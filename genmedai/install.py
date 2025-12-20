import frappe

def after_install():
	setup_defaults()

def after_migrate():
	setup_defaults()

def setup_defaults():
	# Update Website Settings
	website_settings = frappe.get_doc("Website Settings")
	website_settings.app_logo = "/assets/genmedai/images/genmed_favicon.png"
	website_settings.favicon = "/assets/genmedai/images/genmed_favicon.png"
	website_settings.banner_image = "/assets/genmedai/images/genmed_favicon.png"
	website_settings.splash_image = "/assets/genmedai/images/genmed_favicon.png"
	website_settings.home_page = "frontend"
	website_settings.app_name = "AdiCloud"
	website_settings.save(ignore_permissions=True)

	# Update Navbar Settings (for Desk)
	if frappe.db.exists("DocType", "Navbar Settings"):
		navbar_settings = frappe.get_single("Navbar Settings")
		navbar_settings.app_logo = "/assets/genmedai/images/genmed_favicon.png"
		navbar_settings.save(ignore_permissions=True)

	# Update System Settings
	system_settings = frappe.get_single("System Settings")
	system_settings.allow_login_using_mobile_number = 1
	system_settings.allow_login_using_user_name = 1

	# Set mandatory fields if missing
	if not system_settings.language:
		system_settings.language = "en"
	if not system_settings.time_zone:
		system_settings.time_zone = "Asia/Kolkata"

	system_settings.save(ignore_permissions=True)

	# Create another role for admin
	role_name = "GenMedAI Admin"
	if not frappe.db.exists("Role", role_name):
		role = frappe.new_doc("Role")
		role.role_name = role_name
		role.desk_access = 1
		role.insert(ignore_permissions=True)

	# Create user with role
	user_email = "admin@genmedai.com"
	if not frappe.db.exists("User", user_email):
		user = frappe.new_doc("User")
		user.email = user_email
		user.first_name = "Admin"
		user.last_name = "GenMedAI"
		user.send_welcome_email = 0
		user.insert(ignore_permissions=True)

	# Ensure roles are assigned (idempotent)
	user = frappe.get_doc("User", user_email)
	user.add_roles(role_name, "System Manager")
