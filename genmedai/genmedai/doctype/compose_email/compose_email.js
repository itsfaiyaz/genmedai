frappe.ui.form.on('Compose Email', {
    refresh: function (frm) {
        frm.disable_save();
    },

    send_email: function (frm) {
        let recipient_arg = "";

        if (frm.doc.send_to_option == "User") {
            if (!frm.doc.recipient_user) {
                frappe.msgprint(__("Please select a User"));
                return;
            }
            recipient_arg = frm.doc.recipient_user;
        } else {
            if (!frm.doc.recipient_email) {
                frappe.msgprint(__("Please enter an email address"));
                return;
            }
            recipient_arg = frm.doc.recipient_email;
        }

        if (!frm.doc.subject) {
            frappe.msgprint(__("Please enter a subject"));
            return;
        }

        if (!frm.doc.message) {
            frappe.msgprint(__("Please enter a message"));
            return;
        }

        frappe.call({
            method: "genmedai.genmedai.doctype.compose_email.compose_email.send_custom_email",
            args: {
                send_to_option: frm.doc.send_to_option,
                recipient: recipient_arg,
                subject: frm.doc.subject,
                message: frm.doc.message,
                attachment: frm.doc.attachment
            },
            freeze: true,
            freeze_message: __("Sending Email..."),
            callback: function (r) {
                if (!r.exc) {
                    frappe.msgprint(__("Email successfully sent!"));
                    frm.events.clear_fields(frm);
                    // Reload to update timeline/comments
                    frm.reload_doc();
                }
            }
        });
    },

    clear_fields: function (frm) {
        frm.set_value('recipient_user', '');
        frm.set_value('recipient_email', '');
        frm.set_value('subject', '');
        frm.set_value('message', '');
        frm.set_value('attachment', '');
        // Optional: Reset User/Email selection default?
    }
});
