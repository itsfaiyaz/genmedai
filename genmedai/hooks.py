app_name = "genmedai"
app_title = "GenMedAI"
app_publisher = "Adimyra Systems Private Limited"
app_description = "GenMedAI"
app_email = "admin@adimyra.com"
app_license = "agpl-3.0"

app_logo_url = "/assets/genmedai/images/adiCloudFavicon.png"

# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "genmedai",
# 		"logo": "/assets/genmedai/logo.png",
# 		"title": "GenMedAI",
# 		"route": "/genmedai",
# 		"has_permission": "genmedai.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/genmedai/css/genmedai.css"
# app_include_js = "/assets/genmedai/js/genmedai.js"

# include js, css files in header of web template
# web_include_css = "/assets/genmedai/css/genmedai.css"
# web_include_js = "/assets/genmedai/js/genmedai.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "genmedai/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "genmedai/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "genmedai.utils.jinja_methods",
# 	"filters": "genmedai.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "genmedai.install.before_install"
after_install = "genmedai.install.after_install"
after_migrate = "genmedai.install.after_migrate"

# Uninstallation
# ------------

# before_uninstall = "genmedai.uninstall.before_uninstall"
# after_uninstall = "genmedai.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "genmedai.utils.before_app_install"
# after_app_install = "genmedai.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "genmedai.utils.before_app_uninstall"
# after_app_uninstall = "genmedai.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "genmedai.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"genmedai.tasks.all"
# 	],
# 	"daily": [
# 		"genmedai.tasks.daily"
# 	],
# 	"hourly": [
# 		"genmedai.tasks.hourly"
# 	],
# 	"weekly": [
# 		"genmedai.tasks.weekly"
# 	],
# 	"monthly": [
# 		"genmedai.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "genmedai.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "genmedai.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "genmedai.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["genmedai.utils.before_request"]
# after_request = ["genmedai.utils.after_request"]

# Job Events
# ----------
# before_job = ["genmedai.utils.before_job"]
# after_job = ["genmedai.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"genmedai.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }





website_route_rules = [
    {"from_route": "/update-password", "to_route": "frontend"},
    # for login and signup register also
    {"from_route": "/login", "to_route": "frontend"},
    {"from_route": "/register", "to_route": "frontend"},
    {"from_route": "/forgot-password", "to_route": "frontend"},
    {"from_route": "/frontend/<path:app_path>", "to_route": "frontend"},
    {"from_route": "/frontend", "to_route": "frontend"},

    #contact and about us page
    {"from_route": "/contact", "to_route": "frontend"},
    {"from_route": "/about", "to_route": "frontend"},
    
    # 404 page
    {"from_route": "/404", "to_route": "frontend"},
    {"from_route": "/index", "to_route": "/"},
    
    # allow app - MUST be before catch-all
    {"from_route": "/app", "to_route": "app"},
    {"from_route": "/app/<path:app_path>", "to_route": "app"},

    # Catch-all - MUST be last
    {"from_route": "/<path:app_path>", "to_route": "frontend"},
]




# website_route_rules = [
#     {"from_route": "/update-password", "to_route": "frontend"},
#     # for login and signup register also
#     {"from_route": "/login", "to_route": "frontend"},
#     {"from_route": "/register", "to_route": "frontend"},
#     {"from_route": "/forgot-password", "to_route": "frontend"},
#     {"from_route": "/frontend/<path:app_path>", "to_route": "frontend"},
#     {"from_route": "/frontend", "to_route": "frontend"},

#     #contact and about us page
#     {"from_route": "/contact", "to_route": "frontend"},
#     {"from_route": "/about", "to_route": "frontend"},
    
#     # 404 page
#     {"from_route": "/404", "to_route": "frontend"},
#     {"from_route": "/index", "to_route": "/"},
#     {"from_route": "/<path:app_path>", "to_route": "frontend"},
#     # allow app
#     {"from_route": "/app", "to_route": "/app"},
#     {"from_route": "/app/<path:app_path>", "to_route": "/app/<path:app_path>"},
# ]
