# Copyright (c) 2024, GenMedAI and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Medicine(Document):
	def validate(self):
		if not self.brand_name:
			frappe.throw("Brand Name is required")
		if not self.salt_composition:
			frappe.throw("Salt Composition is required")
