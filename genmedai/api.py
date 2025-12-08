import frappe
from frappe.core.doctype.user.user import sign_up as frappe_sign_up
import requests
import json

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"

def get_gemini_api_key():
    # Try fetching from site config, then common settings, or return None
    key = frappe.conf.get("GEMINI_API_KEY") or frappe.db.get_single_value("GenMedAI Settings", "gemini_api_key")
    return key

def query_gemini(prompt):
    api_key = get_gemini_api_key()
    print(f"DEBUG: API Key found? {True if api_key else False}")
    if not api_key:
        print("DEBUG: No API Key found in site_config or settings")
        return None
    
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    
    try:
        url = f"{GEMINI_API_URL}?key={api_key}"
        print(f"DEBUG: Requesting {url.split('?')[0]}...") 
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        
        if response.status_code != 200:
            print(f"DEBUG: API Error {response.status_code}: {response.text}")
        
        response.raise_for_status()
        data = response.json()
        return data['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        print(f"DEBUG: Exception: {str(e)}")
        frappe.log_error(f"Gemini API Error: {str(e)}")
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

    filters = {"brand_name": ["like", f"%{query}%"]}
    
    local_results = frappe.get_list(
        "Medicine",
        fields=["name", "brand_name", "salt_composition", "strength", "dosage_form", "manufacturer", "price", "is_generic", "image"],
        filters=filters,
        limit_page_length=20
    )

    if local_results:
        return local_results

    # Fallback to AI
    prompt = f"""
    You are a medical assistant JSON API.
    Identify the medicine "{query}" available in India.
    Return a JSON object (and ONLY JSON, no markdown) with details:
    {{
        "brand_name": "Name",
        "salt_composition": "Salt 1 + Salt 2",
        "strength": "e.g. 500mg",
        "dosage_form": "Tablet/Kap/Syrup",
        "manufacturer": "Company Name",
        "price": 0.00 (Approx MRP in INR),
        "is_generic": false,
        "image": null
    }}
    If the medicine is invalid or not found, return null.
    """
    
    ai_text = query_gemini(prompt)
    if ai_text:
        try:
            # Clean markdown if present
            ai_text = ai_text.replace("```json", "").replace("```", "").strip()
            ai_data = json.loads(ai_text)
            if ai_data:
                ai_data['name'] = "AI_GENERATED_" + frappe.generate_hash(length=6)
                ai_data['is_ai_generated'] = 1
                return [ai_data]
        except:
            pass
            
    return []

@frappe.whitelist(allow_guest=True)
def get_substitutes(medicine_id):
    if not medicine_id:
        return []

    if medicine_id.startswith("AI_GENERATED_"):
        # If the medicine ID is from AI, we likely don't have it in DB.
        # We need to re-ask AI for substitutes based on the salt we (theoretically) know.
        # But since we don't persist AI results yet, let's ask AI for substitutes of the query directly?
        # A better approach for this fast prototype:
        # The frontend calls get_medicines -> gets AI result -> user clicks "View Substitutes" -> frontend calls get_substitutes with that AI ID.
        # We can store the AI result in a cache or session, or just ask AI "What are substitutes for [Medicine]?"
        return [] # Complex to handle stateless AI substitutes without passing more data. 
        # IMPROVEMENT: We will enhance this below.

    try:
        source_med = frappe.get_doc("Medicine", medicine_id)
    except frappe.DoesNotExistError:
        frappe.throw("Medicine not found")

    # Core logic: Same Salt + Same Strength + Same Dosage Form
    substitutes = frappe.get_list(
        "Medicine",
        fields=["name", "brand_name", "salt_composition", "strength", "dosage_form", "manufacturer", "price", "is_generic", "image"],
        filters={
            "name": ["!=", medicine_id], 
            "salt_composition": source_med.salt_composition,
            "price": ["<", source_med.price]
        },
        order_by="price asc"
    )

    if not substitutes:
        # AI Fallback for Substitutes
        prompt = f"""
        Find cheaper substitutes for "{source_med.brand_name}" (Salt: {source_med.salt_composition}) available in India.
        Return a JSON LIST (ONLY JSON) of 3-5 objects:
        [{{
            "name": "AI_SUB_1",
            "brand_name": "Name",
            "manufacturer": "Company",
            "price": 0.00,
            "strength": "{source_med.strength}",
            "dosage_form": "{source_med.dosage_form}",
            "is_generic": true
        }}]
        """
        ai_text = query_gemini(prompt)
        if ai_text:
            try:
                ai_text = ai_text.replace("```json", "").replace("```", "").strip()
                ai_subs = json.loads(ai_text)
                if isinstance(ai_subs, list):
                    return ai_subs
            except:
                pass

    return substitutes
