def get_user_reply_content(query_type):
    """Generate HTML content for the user auto-reply email."""
    return f"""
    <h3>Hello,</h3>
    <p>Thank you for reaching out to us. We have received your message regarding "<strong>{query_type}</strong>".</p>
    <p>Our team will review your inquiry and get back to you shortly.</p>
    <br>
    <p>Best regards,</p>
    <p><strong>GenMedAI Team</strong></p>
    <hr>
    <p style="color: #888; font-size: 12px;">This is an automated response. Please do not reply to this email.</p>
    """
