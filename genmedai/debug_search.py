
import frappe
from genmedai.api import get_medicines
import json

def execute():
    print("=== GenMedAI Search Debug ===")
    
    # Test 1: "Pan" (User reported failure)
    query = "Pan"
    print(f"\n[Test 1] Searching for: '{query}'")
    try:
        results = get_medicines(query)
        print(f"Results Found: {len(results)}")
        if results:
            print("First Result Name:", results[0].get('brand_name'))
            print("Is AI:", results[0].get('is_ai_generated'))
        else:
            print("No results returned.")
            # Check logs
            logs = frappe.get_all("Error Log", fields=["method", "error"], order_by="creation desc", limit=1)
            if logs:
                print(f"Latest Error Log ({logs[0].method}):")
                print(logs[0].error[:300])

    except Exception as e:
        print(f"Error during search: {e}")

    # Test 2: "Dolo" (Known working)
    query = "Dolo 650"
    print(f"\n[Test 2] Searching for: '{query}'")
    try:
        results = get_medicines(query)
        print(f"Results Found: {len(results)}")
    except Exception as e:
        print(f"Error: {e}")

    print("=============================")
