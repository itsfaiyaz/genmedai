import frappe
from genmedai.api import query_gemini

def search():
    """
    Interactive tool for Medicine Inquiry using Gemini Integration.
    Run in bench console:
    import genmedai.interactive
    genmedai.interactive.search()
    """
    print("\nXXX GenMedAI Interactive Medicine Assistant XXX")
    print("-----------------------------------------------")
    print(f"Current User: {frappe.session.user}")
    
    # Verify API Key Availability
    from genmedai.api import get_gemini_api_key
    key = get_gemini_api_key()
    if not key:
        print("WARNING: Gemini API Key not found in Site Config or GenMedAI Settings.")
    else:
        print("Gemini API Key: Configured ✅")

    while True:
        print("\n" + "="*40)
        keyword = input("Enter medicine name (or 'q' to quit): ").strip()
        
        if keyword.lower() in ['q', 'quit', 'exit']:
            break
            
        if not keyword:
            continue
            
        print(f"\nAsking Gemini about '{keyword}'...")
        
        prompt = f"""
        You are a medical information assistant.
        The user searched for medicine: "{keyword}".

        Give a short, clear, general explanation about this medicine:
        - Generic name (if any)
        - Common uses
        - Common side effects
        - Any important precautions (general, not patient-specific)

        Keep the answer in simple language.
        """
        
        try:
            # Using the existing helper in api.py which uses 'requests' 
            # instead of google.generativeai package
            response_text = query_gemini(prompt)
            
            print("\nAI Response:\n")
            if response_text:
                # Clean up markdown code blocks if any (though prompt asks for text)
                clean_text = response_text.replace("```json", "").replace("```", "").strip()
                print(clean_text)
            else:
                print("No response from AI.")
                
        except Exception as e:
            print(f"ERROR: {str(e)}")
            frappe.log_error(f"Interactive Debug Error: {str(e)}")

    print("\nExiting.")
