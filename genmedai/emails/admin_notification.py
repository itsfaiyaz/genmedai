import frappe

def get_admin_email_content(email, query_type, message, doc_name, doc_date):
    """Generate HTML content for the admin notification email."""
    return f"""
    <h3>New Inquiry Received</h3>
    <p><strong>From:</strong> {email}</p>
    <p><strong>Type:</strong> {query_type}</p>
    <p><strong>Date:</strong> {frappe.utils.format_datetime(doc_date, 'medium')}</p>
    <hr>
    <p><strong>Message:</strong></p>
    <p>{message}</p>
    <br>
    <p><em>This query has been saved to the Contact Query database (Ref: {doc_name}).</em></p>
    """
