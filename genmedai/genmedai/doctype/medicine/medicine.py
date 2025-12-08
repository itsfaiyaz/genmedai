# Copyright (c) 2024, GenMedAI and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Medicine(Document):
	def validate(self):
		if not self.brand_name:
			frappe.throw("Brand Name is required")
		
		# Auto-populate salt_composition from short_composition fields if empty
		if not self.salt_composition:
			comps = []
			if self.get("short_composition1"):
				comps.append(self.short_composition1)
			if self.get("short_composition2"):
				comps.append(self.short_composition2)
			
			if comps:
				self.salt_composition = " + ".join(comps)
				
		if not self.salt_composition:
			# Only throw if we still don't have it (optional: or just allow empty)
			# frappe.throw("Salt Composition is required")
			pass
