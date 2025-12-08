import frappe
from frappe.core.doctype.user.user import sign_up as frappe_sign_up
import requests
import json

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"

def get_gemini_api_key():
    # Try fetching from site config
    key = frappe.conf.get("GEMINI_API_KEY")
    if key: 
        return key
    
    # Fetch from settings, ignoring permissions (System User only by default)
    try:
        # Use get_doc with ignore_permissions to ensure Guest can read the key
        doc = frappe.get_doc("GenMedAI Settings", ignore_permissions=True)
        return doc.gemini_api_key
    except Exception as e:
        print(f"DEBUG: Error fetching Settings: {e}")
        return None

def query_gemini(prompt):
    api_key = get_gemini_api_key()
    
    if not api_key:
        frappe.log_error(message="GenMedAI: No API Key found (User: " + frappe.session.user + ")", title="GenMedAI Debug")
        return None
    
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    
    try:
        url = f"{GEMINI_API_URL}?key={api_key}"
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        
        if response.status_code != 200:
            frappe.log_error(f"GenMedAI API Error {response.status_code}: {response.text}", "GenMedAI Debug")
        
        response.raise_for_status()
        data = response.json()
        return data['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        frappe.log_error(message=f"Gemini API Error: {str(e)}", title="GenMedAI Gemini Error")
        return None

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
    
    # Create and assign role
    role_name = "GenMedAI Member"
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
    # specific filters for brand_name, salt_composition, manufacturer
    or_filters = {
        "brand_name": ["like", f"%{query}%"],
        "salt_composition": ["like", f"%{query}%"],
        "manufacturer": ["like", f"%{query}%"]
    }
    
    local_results = frappe.get_list(
        "Medicine",
        fields=["name", "brand_name", "salt_composition", "strength", "dosage_form", "manufacturer", "price", "is_generic", "image"],
        or_filters=or_filters,
        limit_page_length=20,
        ignore_permissions=True
    )
    
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
        "manufacturer": "Company Name",
        "price": 100.00,
        "is_generic": false,
        "image": null,
        "explanation": "A quick, simple explanation of what this medicine is used for (max 2 sentences).",
        "affiliate_link": "https://www.1mg.com/search/all?name={query}" 
    }}
    
    If strict details are unknown, estimate based on common market data in India. 
    If the term is nonsense or not a medicine, return null.
    For the affiliate_link, generate a valid search URL for a major Indian online pharmacy (like 1mg, Pharmeasy, or Apollo) with the medicine name query.
    """
    
    ai_text = query_gemini(prompt)
    
    if ai_text:
        try:
            # Clean markdown if present
            ai_text = ai_text.strip()
            if ai_text.startswith("```json"):
                ai_text = ai_text[7:]
            if ai_text.endswith("```"):
                ai_text = ai_text[:-3]
            ai_text = ai_text.strip()
            
            ai_data = json.loads(ai_text)
            
            if ai_data and isinstance(ai_data, dict) and ai_data.get("brand_name"):
                # Mark as AI generated
                ai_data['name'] = "AI_GENERATED_" + frappe.generate_hash(length=6)
                ai_data['is_ai_generated'] = 1
                
                # Check for duplicates in local_results to avoid showing same thing twice
                # A simple check on brand_name
                is_duplicate = False
                for existing in local_results:
                    if existing.get('brand_name').lower() == ai_data.get('brand_name').lower():
                        is_duplicate = True
                        break
                
                if not is_duplicate:
                    ai_results.append(ai_data)
                    
        except Exception as e:
            frappe.log_error(message=f"GenMedAI JSON Parse Error: {str(e)} | Text: {ai_text}", title="GenMedAI Debug")

    return local_results + ai_results

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

    # Core logic: Same Salt + Lower Price
    # We relax strength/dosage match for AI items as we might not have exact details match in DB
    filters = {
        "salt_composition": ["like", f"%{source_med.salt_composition}%"],
        "price": ["<", source_med.price]
    }
    
    # If real DB item, avoid showing itself
    if not medicine_id.startswith("AI_GENERATED_"):
        filters["name"] = ["!=", medicine_id]

    substitutes = frappe.get_list(
        "Medicine",
        fields=["name", "brand_name", "salt_composition", "strength", "dosage_form", "manufacturer", "price", "is_generic", "image"],
        filters=filters,
        order_by="price asc",
        limit_page_length=10
    )

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
        ai_text = query_gemini(prompt)
        if ai_text:
            try:
                ai_text = ai_text.strip()
                if ai_text.startswith("```json"):
                    ai_text = ai_text[7:]
                if ai_text.endswith("```"):
                    ai_text = ai_text[:-3]
                ai_text = ai_text.strip()

                ai_subs = json.loads(ai_text)
                if isinstance(ai_subs, list):
                    return ai_subs
            except Exception as e:
                frappe.log_error(message=f"GenMedAI Substitutes JSON Parse Error: {str(e)}", title="GenMedAI Debug")

    return substitutes
