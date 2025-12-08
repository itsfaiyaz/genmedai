# Copyright (c) 2025, Adimyra Systems Private Limited and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class ProfileCard(Document):
	def validate(self):
		if self.status == "Verified" and not self.verified_by:
			self.verified_by = frappe.session.user
		elif self.status != "Verified":
			self.verified_by = None
