
import frappe
from genmedai.api import get_medicines

def test():
    frappe.connect("genmedai.ontu.dev")
    print(f"Current User: {frappe.session.user}")
    
    # Check key source
    key = frappe.conf.get("GEMINI_API_KEY")
    print(f"Key in site_config: {'Yes' if key else 'No'}")
    
    key_db = frappe.db.get_single_value("GenMedAI Settings", "gemini_api_key")
    print(f"Key in DB: {'Yes' if key_db else 'No'}")
    
    print("Testing get_medicines with 'dolo'...")
    try:
        results = get_medicines(query="dolo")
        print("Results Count:", len(results))
        if results:
            print("First Result Keys:", results[0].keys())
            print("First Result:", results[0])
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test()
