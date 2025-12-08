import frappe
from frappe.core.doctype.user.user import sign_up as frappe_sign_up

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

    
    

# @frappe.whitelist(allow_guest=True)
# def get_verified_profiles():
#     return frappe.get_list(
#         "ProfileCard",
#         fields=['name', 'full_name', 'age', 'location', 'profession', 'profile_image', 'about_me', 'interests', 'status', 'gender', 'mobile_number', 'is_mobile_public'],
#         filters={'status': 'Verified'},
#         order_by='modified desc',
#         limit_page_length=100
#     )
