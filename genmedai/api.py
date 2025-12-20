import frappe
from frappe.core.doctype.user.user import sign_up as frappe_sign_up
import requests
import json

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

def get_ai_config():
    # Fetch from settings, ignoring permissions (System User only by default)
    try:
        doc = frappe.get_doc("GenMedAI Settings")
        provider = doc.ai_provider
        
        if provider == "OpenAI":
            key = doc.get_password("openai_api_key") or frappe.conf.get("OPENAI_API_KEY")
        else:
            # Default to Gemini
            provider = "Google Gemini"
            key = doc.get_password("gemini_api_key") or frappe.conf.get("GEMINI_API_KEY")
            
        return provider, key.strip() if key else None
    except Exception as e:
        print(f"DEBUG: Error fetching Settings: {e}")
        # Fallback to config if settings fail
        return "Google Gemini", frappe.conf.get("GEMINI_API_KEY")

def query_ai(prompt):
    provider, api_key = get_ai_config()
    
    if not api_key:
        frappe.log_error(message=f"GenMedAI: No API Key found for {provider}", title="GenMedAI Debug")
        return None
    
    if provider == "OpenAI":
        return query_openai(api_key, prompt)
    else:
        return query_gemini_internal(api_key, prompt)

def query_openai(api_key, prompt):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "You are a helpful medical assistant that outputs strictly JSON."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }
    
    try:
        response = requests.post(OPENAI_API_URL, headers=headers, json=payload, timeout=15)
        
        if response.status_code != 200:
            frappe.log_error(f"GenMedAI OpenAI Error {response.status_code}: {response.text}", "GenMedAI Debug")
        
        response.raise_for_status()
        data = response.json()
        return data['choices'][0]['message']['content']
    except Exception as e:
        frappe.log_error(message=f"OpenAI API Error: {str(e)}", title="GenMedAI OpenAI Error")
        return None

def query_gemini_internal(api_key, prompt, image_base64=None):
    headers = {"Content-Type": "application/json"}
    
    parts = [{"text": prompt}]
    
    if image_base64:
        # Depending on format, clean header if present (e.g. data:image/jpeg;base64,)
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]
            
        parts.append({
            "inline_data": {
                "mime_type": "image/jpeg", # Assuming JPEG or generic image
                "data": image_base64
            }
        })
        
    payload = {
        "contents": [{
            "parts": parts
        }]
    }
    
    try:
        url = f"{GEMINI_API_URL}?key={api_key}"
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        if response.status_code != 200:
            frappe.log_error(f"GenMedAI Gemini Error {response.status_code}: {response.text}", "GenMedAI Debug")
        
        response.raise_for_status()
        data = response.json()
        return data['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        frappe.log_error(message=f"Gemini API Error: {str(e)}", title="GenMedAI Gemini Error")
        return None

@frappe.whitelist(allow_guest=True)
def analyze_prescription(image_base64):
    if not image_base64:
        frappe.throw("No image data provided")
        
    prompt = """
    Analyze this prescription image. Identify the medicines prescribed.
    Return strictly a JSON LIST of strings, where each string is a medicine name.
    Example: ["Dolo 650", "Augmentin 625"]
    If no medicines are clearly visible, return an empty list [].
    """
    
    provider, api_key = get_ai_config()
    if provider != "Google Gemini":
        # Force fallback or error if OpenAI (vision support varies, simplified here for Gemini default)
        # For now, let's assume Gemini is used or switch key if available
        pass
        
    result = query_gemini_internal(api_key, prompt, image_base64)
    
    if result:
        try:
            start_index = result.find('[')
            end_index = result.rfind(']')
            if start_index != -1 and end_index != -1:
                return json.loads(result[start_index:end_index+1])
        except:
            pass
            
    return []

@frappe.whitelist(allow_guest=True)
def register_user(email, full_name, mobile_no, gender, redirect_to=None):
    if frappe.db.exists("User", {"mobile_no": mobile_no}):
        frappe.throw("Mobile number already registered")
    
    if frappe.db.exists("User", {"email": email}):
        frappe.throw("Email already registered")

    frappe_sign_up(email, full_name, redirect_to)

    user = frappe.get_doc("User", email)
    user.mobile_no = mobile_no
    user.gender = gender
    
    # Dynamic Role Assignment from Portal Settings
    role_name = "GenMedAI Member" # Fallback
    try:
        portal_settings = frappe.get_doc("Portal Settings", "Portal Settings")
        if portal_settings.get("default_role"):
            role_name = portal_settings.get("default_role")
    except Exception:
        pass

    if not frappe.db.exists("Role", role_name):
        role = frappe.new_doc("Role")
        role.role_name = role_name
        role.desk_access = 0
        role.insert(ignore_permissions=True)
        
    user.append("roles", {"role": role_name})
    
    user.flags.ignore_permissions = True
    user.save(ignore_permissions=True)

    return {"status": "success", "message": "Registration successful"}

    
    

@frappe.whitelist(allow_guest=True)
def get_medicines(query=None):
    if not query:
        return []

    # Enable debug logging
    frappe.log_error(f"GenMedAI Search Query: {query}", "GenMedAI Search")
    
    # 1. Search Local Database
    
    clean_query = query.strip()
    is_exact_search = False
    
    # Check for exact match syntax (quotes)
    if clean_query.startswith('"') and clean_query.endswith('"') and len(clean_query) > 2:
        is_exact_search = True
        clean_query = clean_query[1:-1].strip()

    if is_exact_search:
        # Exact Match Strategy
        or_filters = {
            "brand_name": clean_query,
            "salt_composition": clean_query,
            "short_composition1": clean_query,
            "short_composition2": clean_query,
            "manufacturer_name": clean_query
        }
    else:
        # Broad Match Strategy (LIKE)
        or_filters = {
            "brand_name": ["like", f"%{query}%"],
            "salt_composition": ["like", f"%{query}%"],
            "short_composition1": ["like", f"%{query}%"],
            "short_composition2": ["like", f"%{query}%"],
            "manufacturer_name": ["like", f"%{query}%"],
            "type": ["like", f"%{query}%"],
            "strength": ["like", f"%{query}%"],
            "dosage_form": ["like", f"%{query}%"],
            "pack_size_label": ["like", f"%{query}%"],
            "description": ["like", f"%{query}%"]
        }
    
    local_results = frappe.get_list(
        "Medicine",
        fields=[
            "name", "brand_name", "salt_composition", "short_composition1", "short_composition2",
            "strength", "dosage_form", "manufacturer_name", "type", 
            "price", "is_generic", "image", "is_discontinued", "pack_size_label"
        ],
        or_filters=or_filters,
        limit_page_length=20,
        ignore_permissions=True
    )
    
    # Map fields for frontend compatibility
    for r in local_results:
        r['manufacturer'] = r.get('manufacturer_name')
        if not r.get('dosage_form') and r.get('type'):
            r['dosage_form'] = r['type']
        # Ensure boolean for is_discontinued
        r['is_discontinued'] = 1 if r.get('is_discontinued') else 0

        # Check for substitutes
        r['has_substitutes'] = False
        if r.get('salt_composition'):
            raw_salt = r['salt_composition']
            base_salt = raw_salt.split('(')[0].strip()
            if not base_salt:
                base_salt = raw_salt.strip()
            
            if base_salt:
                count = frappe.db.count("Medicine", filters={
                    "salt_composition": ["like", f"%{base_salt}%"],
                    "name": ["!=", r["name"]]
                })
                if count > 0:
                    r['has_substitutes'] = True
    
    # 2. AI Fallback / Augmentation
    # We ask AI to identify the medicine and provide details
    ai_results = []
    
    # Check if we should skip AI to save tokens/time if we found a perfect match? 
    # User requested AI results too, so we proceed.
    
    prompt = f"""
    You are a medical assistant JSON API.
    Identify the medicine "{query}" available in India.
    Return a JSON object (and ONLY JSON, no markdown) with details.
    
    Expected JSON Structure:
    {{
        "brand_name": "Standard Brand Name",
        "salt_composition": "Active Ingredients",
        "strength": "e.g. 500mg",
        "dosage_form": "Tablet/Capsule/Syrup",
        "pack_size_label": "e.g. 10 Tablet Strip",
        "manufacturer": "Company Name",
        "price": 100.00,
        "is_generic": false,
        "is_discontinued": false,
        "image": null,
        "explanation": "A detailed explanation (3-4 sentences) of what this medicine is, its primary uses, how it works, and key precautions.",
        "affiliate_link": "https://www.1mg.com/search/all?name={query}" 
    }}
    
    If strict details are unknown, estimate based on common market data in India. 
    If the term is nonsense or not a medicine, return null.
    For the affiliate_link, generate a valid search URL for a major Indian online pharmacy (like 1mg, Pharmeasy, or Apollo) with the medicine name query.
    """
    
    ai_text = query_ai(prompt)
    
    if ai_text:
        try:
            # Clean markdown if present
            # specific robust JSON extraction
            start_index = ai_text.find('{')
            end_index = ai_text.rfind('}')
            
            if start_index != -1 and end_index != -1:
                json_str = ai_text[start_index:end_index+1]
                ai_data = json.loads(json_str)
            else:
                # Fallback to direct load or error
                ai_data = json.loads(ai_text)
            
            if ai_data and isinstance(ai_data, dict) and ai_data.get("brand_name"):
                # Mark as AI generated
                ai_data['name'] = "AI_GENERATED_" + frappe.generate_hash(length=6)
                ai_data['is_ai_generated'] = 1
                
                # Check for duplicates in local_results to avoid showing same thing twice
                # A simple check on brand_name
                # User Feedback: Always show AI result if requested, even if DB has it.
                # is_duplicate = False
                # for existing in local_results:
                #     if existing.get('brand_name').lower() == ai_data.get('brand_name').lower():
                #         is_duplicate = True
                #         break
                
                # if not is_duplicate:
                ai_results.append(ai_data)
                    
        except Exception as e:
            frappe.log_error(message=f"GenMedAI JSON Parse Error: {str(e)} | Text: {ai_text}", title="GenMedAI Debug")

    # Always append AI results to ensure they are shown
    final_results = local_results + ai_results
    return final_results

@frappe.whitelist(allow_guest=True)
def get_substitutes(medicine_id=None, salt_composition=None, current_price=None):
    if not medicine_id:
        return []

    source_med = None
    
    # If it's an AI generated item, we rely on passed params
    if medicine_id.startswith("AI_GENERATED_"):
        if not salt_composition:
            # Cannot find substitutes without knowing what it is
            return []
        
        # Mock a source_med object for consistent logic
        source_med = frappe._dict({
            "brand_name": "Selected Medicine", # Placeholder
            "salt_composition": salt_composition,
            "strength": "", # We might not have this, searching broadly
            "dosage_form": "", 
            "price": float(current_price) if current_price else 999999
        })
    else:
        try:
            source_med = frappe.get_doc("Medicine", medicine_id)
        except frappe.DoesNotExistError:
            frappe.throw("Medicine not found")

    # Core logic: Same Salt Match
    # 1. Clean the salt (remove strength info inside parenthesis if present to find broader matches)
    #    e.g. "Acebrophylline (100mg)" -> "Acebrophylline"
    #    This handles formatting differences like spaces or strength variations better
    
    raw_salt = source_med.salt_composition or ""
    base_salt = raw_salt.split('(')[0].strip()
    
    if not base_salt:
        base_salt = raw_salt.strip()

    filters = {
        "salt_composition": ["like", f"%{base_salt}%"]
    }
    
    # If real DB item, avoid showing itself
    if not medicine_id.startswith("AI_GENERATED_"):
        filters["name"] = ["!=", medicine_id]

    substitutes = frappe.get_list(
        "Medicine",
        fields=["name", "brand_name", "salt_composition", "strength", "dosage_form", "manufacturer_name", "type", "price", "is_generic", "image", "pack_size_label", "is_discontinued"],
        filters=filters,
        order_by="price asc",
        limit_page_length=10
    )
    
    # Map fields for frontend compatibility
    for sub in substitutes:
        sub['manufacturer'] = sub.get('manufacturer_name')
        if not sub.get('dosage_form') and sub.get('type'):
            sub['dosage_form'] = sub.get('type')
        sub['is_discontinued'] = 1 if sub.get('is_discontinued') else 0

    if not substitutes:
        # AI Fallback for Substitutes
        prompt = f"""
        Find cheaper substitutes for medicine with Salt: "{source_med.salt_composition}" available in India.
        Reference Price to beat: INR {source_med.price}.
        Return a JSON LIST (ONLY JSON) of 3-5 objects:
        [{{
            "name": "AI_SUB_1",
            "brand_name": "Name",
            "manufacturer": "Company",
            "price": 0.00,
            "strength": "e.g. 500mg",
            "dosage_form": "Tablet",
            "is_generic": true
        }}]
        """
        ai_text = query_ai(prompt)
        if ai_text:
            try:
                # specific robust JSON extraction for list
                start_index = ai_text.find('[')
                end_index = ai_text.rfind(']')
                
                if start_index != -1 and end_index != -1:
                    json_str = ai_text[start_index:end_index+1]
                    ai_subs = json.loads(json_str)
                else:
                    ai_subs = json.loads(ai_text)
                if isinstance(ai_subs, list):
                    return ai_subs
            except Exception as e:
                frappe.log_error(message=f"GenMedAI Substitutes JSON Parse Error: {str(e)}", title="GenMedAI Debug")

    return substitutes

@frappe.whitelist(allow_guest=True)
def translate_text(text, target_language="Hindi"):
    if not text:
        return ""
    
    prompt = f"Translate the following medical text to {target_language}. Keep it simple and easy to understand. Return ONLY the translated text.\n\nText: {text}"
    return query_ai(prompt)

@frappe.whitelist(allow_guest=True)
def get_contact_us_settings():
    """Fetch Contact Us Settings for public display safely."""
    try:
        # Fetch individual values directly from DB to avoid DocType file dependency crashes
        # if the DocType files are missing from the filesystem but data exists in DB.
        fields = ["heading", "introduction", "email_id", "phone", 
                  "address_title", "address_line1", "address_line2", 
                  "city", "state", "pincode", "country", 
                  "query_options", "forward_to_email"]
        
        settings = {}
        for field in fields:
            settings[field] = frappe.db.get_single_value("Contact Us Settings", field)
            
        return settings
    except Exception as e:
        frappe.log_error(f"Error fetching Contact Us Settings: {str(e)}")
        return None

@frappe.whitelist(allow_guest=True)
def has_desk_access():
    user = frappe.session.user
    if user == "Guest":
        return {"allowed": False}

    if user == "Administrator":
        return {"allowed": True}

    # "System User" type is the standard definition for Desk Access in Frappe
    user_type = frappe.db.get_value("User", user, "user_type")
    return {"allowed": user_type == "System User"}

from genmedai.emails.admin_notification import get_admin_email_content
from genmedai.emails.user_reply import get_user_reply_content

@frappe.whitelist(allow_guest=True)
def submit_contact_query(email, message, query_type="Other"):
    if not email or not message:
        frappe.throw("Email and Message are required")

    # 1. Fetch Settings safely
    forward_email = frappe.db.get_single_value("Contact Us Settings", "forward_to_email")
    
    if not forward_email:
        frappe.throw("Contact configuration missing (Forward Email not set).")

    # 2. Store in Database
    doc = frappe.get_doc({
        "doctype": "Contact Query",
        "email": email,
        "query_type": query_type,
        "message": message,
        "submission_date": frappe.utils.now_datetime(),
        "status": "Open"
    })
    doc.insert(ignore_permissions=True)
    
    # 3. Send Email to Admin
    subject = f"GenMedAI: New Inquiry - {query_type}"
    email_content = get_admin_email_content(email, query_type, message, doc.name, doc.submission_date)
    
    frappe.sendmail(
        recipients=[forward_email],
        reply_to=email,
        subject=subject,
        message=email_content,
        now=True
    )
    
    # 4. Send Auto-Reply to User
    reply_subject = "We received your message - GenMedAI"
    reply_message = get_user_reply_content(query_type)
    
    frappe.sendmail(
        recipients=[email],
        subject=reply_subject,
        message=reply_message,
        now=True
    )
    
    return {"status": "success", "message": "Your message has been sent successfully."}

@frappe.whitelist(allow_guest=True)
def browse_medicines(start=0, limit=20, search_text=None, manufacturer=None, dosage_form=None, has_image=None, order_by='modified desc'):
    start = int(start)
    limit = int(limit)
    
    conditions = []
    values = []
    
    # Base condition: Not cancelled
    conditions.append("docstatus < 2")
    
    # 1. Strict Filters
    if manufacturer:
        conditions.append("manufacturer_name = %s")
        values.append(manufacturer)
    
    if dosage_form:
        conditions.append("dosage_form = %s")
        values.append(dosage_form)

    if has_image and str(has_image).lower() in ['true', '1', 'yes']:
        conditions.append("(image IS NOT NULL AND image != '')")
        
    # 2. Search Logic
    if search_text:
        # Search multiple fields using OR
        search_term = f"%{search_text}%"
        conditions.append("(brand_name LIKE %s OR salt_composition LIKE %s OR manufacturer_name LIKE %s)")
        values.extend([search_term, search_term, search_term])
        
    where_clause = " AND ".join(conditions)
    
    # Validate order_by to prevent SQL injection
    valid_sort_fields = ['name', 'brand_name', 'price', 'modified', 'creation', 'salt_composition', 'strength']
    sort_field = order_by.split(' ')[0]
    if sort_field not in valid_sort_fields:
        order_by = 'modified desc'
        
    sql_query = f"""
        SELECT 
            name, brand_name, salt_composition, short_composition1, 
            dosage_form, manufacturer_name, price, is_generic, 
            image, is_discontinued, pack_size_label, modified, creation, description
        FROM `tabMedicine`
        WHERE {where_clause}
        ORDER BY {order_by}
        LIMIT %s, %s
    """
    
    values.extend([start, limit])
    
    medicines = frappe.db.sql(sql_query, tuple(values), as_dict=True)
    
    # Post-processing
    for m in medicines:
        if not m.get('dosage_form') and m.get('type'):
            m['dosage_form'] = m['type']
        m['is_discontinued'] = 1 if m.get('is_discontinued') else 0
        
        # Fallback for safe frontend handling
        m['affiliate_link'] = None
        
    return medicines

@frappe.whitelist(allow_guest=True)
def get_catalog_filters():
    # Efficiently fetch distinct values for filters
    # Limit to top 500 active manufacturers to avoid freezing
    
    manufacturers = frappe.db.sql("""
        SELECT DISTINCT manufacturer_name 
        FROM `tabMedicine` 
        WHERE manufacturer_name IS NOT NULL AND manufacturer_name != ''
        ORDER BY manufacturer_name ASC 
        LIMIT 1000
    """, as_dict=True)
    
    # Limit list size in python if needed or keep full list if < few thousands. 
    # For 3 lakhs rows, distinct manufacturers might be 5k-10k. 
    # Sending 5k strings is ~100KB gzipped. It's acceptable for a "catalog app".
    
    dosage_forms = frappe.db.sql("""
        SELECT DISTINCT dosage_form 
        FROM `tabMedicine` 
        WHERE dosage_form IS NOT NULL AND dosage_form != ''
        ORDER BY dosage_form ASC 
        LIMIT 1000
    """, as_dict=True)
    
    return {
        "manufacturers": [m.manufacturer_name for m in manufacturers],
        "dosage_forms": [d.dosage_form for d in dosage_forms]
    }
