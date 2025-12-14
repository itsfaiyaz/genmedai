# -*- coding: utf-8 -*-
# Copyright (c) 2025, Ontu Technologies and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import validate_email_address

class ComposeEmail(Document):
	pass

@frappe.whitelist()
def send_custom_email(send_to_option, recipient, subject, message, attachment=None):
	if send_to_option == "User":
		if not recipient:
			frappe.throw("Please select a User")
		email = frappe.db.get_value("User", recipient, "email")
		if not email:
			frappe.throw(f"User {recipient} has no email address")
	else:
		email = recipient
		if not email:
			frappe.throw("Please enter an email address")
		validate_email_address(email, throw=True)

	if not subject:
		frappe.throw("Subject is required")
	
	if not message:
		frappe.throw("Message is required")

	# Prepare attachments
	attachments_list = []
	if attachment:
		# If attachment is a URL (starts with /), try to find the File doc
		file_doc = frappe.db.get_value("File", {"file_url": attachment}, "name")
		if file_doc:
			attachments_list.append(file_doc)
		else:
			# It might be a direct path if not found, but usually Attach field stores URL.
			# If we can't find File doc, we might try passing the dict structure if we can read it.
			# But for simplicity, pass the ID if found. If not found, ignore or try passing dict.
			pass

	# Send the email using the default outgoing account
	frappe.sendmail(
		recipients=[email],
		subject=subject,
		message=message,
		reference_doctype="Compose Email",
		reference_name="Compose Email",
		attachments=attachments_list,
		now=True
	)
	
	# Add a detailed comment to activity history
	doc = frappe.get_doc("Compose Email")
	
	attachment_html = ""
	if attachment:
		file_name = attachment.split("/")[-1]
		attachment_html = f"<br><b>Attachment:</b> <a href='{attachment}' target='_blank'>{file_name}</a>"

	info_msg = f"""
		<div style="border-left: 3px solid #3498db; padding-left: 10px;">
			<p><b>Email Sent To:</b> {email}</p>
			<p><b>Subject:</b> {subject}</p>
			{attachment_html}
			<hr>
			<p><b>Body:</b></p>
			<div>{message}</div>
		</div>
	"""
	
	doc.add_comment("Info", info_msg)
