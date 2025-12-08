import frappe
import csv
import os

def import_medicines(file_path):
    """
    Import medicines from a CSV file.
    Usage: bench execute genmedai.genmedai.utils.import_medicines.import_medicines --args "['/path/to/file.csv']"
    """
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    print(f"Starting import from {file_path}...")
    
    with open(file_path, mode='r', encoding='utf-8-sig') as csvfile:
        reader = csv.DictReader(csvfile)
        
        # Clean headers if needed (strip spaces)
        reader.fieldnames = [name.strip() for name in reader.fieldnames]
        
        count = 0
        errors = 0
        
        for row in reader:
            try:
                # Map fields
                brand_name = row.get("name")
                if not brand_name:
                    continue
                
                # Check for existing
                # Since brand_name is unique, check existence
                if frappe.db.exists("Medicine", {"brand_name": brand_name}):
                    # Optional: Update existing? Or skip?
                    # User said "update field in medicine ok", implying update logic or just structure update?
                    # Let's Skip for speed, or Update if user wants. Defaulting to Skip for duplicate safety first run.
                    # Or better: Update existing
                    doc_name = frappe.db.get_value("Medicine", {"brand_name": brand_name}, "name")
                    doc = frappe.get_doc("Medicine", doc_name)
                else:
                    doc = frappe.new_doc("Medicine")
                    doc.brand_name = brand_name
                
                # Map other fields
                doc.type = row.get("type", "")
                doc.manufacturer_name = row.get("manufacturer_name", "")
                doc.pack_size_label = row.get("pack_size_label", "")
                doc.short_composition1 = row.get("short_composition1", "")
                doc.short_composition2 = row.get("short_composition2", "")
                
                # Handle Price
                price_str = row.get("price(₹)", "0")
                try:
                    doc.price = float(price_str) if price_str else 0.0
                except ValueError:
                    doc.price = 0.0
                    
                # Handle Boolean
                is_disc = row.get("Is_discontinued", "FALSE")
                doc.is_discontinued = 1 if is_disc.upper() == "TRUE" else 0
                
                # Save
                doc.flags.ignore_permissions = True
                doc.save()
                
                count += 1
                if count % 100 == 0:
                    frappe.db.commit()
                    print(f"Processed {count} records...")
                    
            except Exception as e:
                errors += 1
                print(f"Error processing row {row.get('name')}: {e}")
                # frappe.log_error(f"Import Error: {e}", "Medicine Import")

        frappe.db.commit()
        print(f"Import completed. Success: {count}, Errors: {errors}")
