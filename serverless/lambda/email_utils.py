"""
email_utils.py — SMTP email helpers.
Reads config from Lambda environment variables (same values as the old .env).
"""
import os
import smtplib
from email.mime.text import MIMEText


def _smtp_config():
    host     = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
    port     = int(os.environ.get('SMTP_PORT', 587))
    user     = os.environ.get('SMTP_USER', '')
    password = os.environ.get('SMTP_PASSWORD', '')
    if not user or not password:
        raise RuntimeError('SMTP not configured. Set SMTP_USER and SMTP_PASSWORD in Lambda environment.')
    return host, port, user, password


def send_contact_email(name: str, sender_email: str, subject: str, message: str):
    host, port, user, password = _smtp_config()
    contact_email = os.environ.get('CONTACT_EMAIL', 'admin@aaryajha.com')

    body = f"""New message from the contact form on aaryajha.com

From:    {name} <{sender_email}>
Subject: {subject}

{message}

---
Reply directly to this email to respond to {name}.
"""
    msg = MIMEText(body)
    msg['Subject']  = f'[aaryajha.com] {subject}'
    msg['From']     = user
    msg['To']       = contact_email
    msg['Reply-To'] = f'{name} <{sender_email}>'

    with smtplib.SMTP(host, port) as s:
        s.starttls()
        s.login(user, password)
        s.sendmail(user, [contact_email], msg.as_string())


def send_recovery_email(otp: str):
    host, port, user, password = _smtp_config()
    recovery_email = os.environ.get('RECOVERY_EMAIL', 'aj240502@gmail.com')

    body = f"""Your admin portal recovery code is:

    {otp}

This code is valid for 15 minutes. Do not share it.

If you did not request this, ignore this email.
— aaryajha.com
"""
    msg = MIMEText(body)
    msg['Subject'] = '[aaryajha.com] Admin Recovery Code'
    msg['From']    = user
    msg['To']      = recovery_email

    with smtplib.SMTP(host, port) as s:
        s.starttls()
        s.login(user, password)
        s.sendmail(user, [recovery_email], msg.as_string())
