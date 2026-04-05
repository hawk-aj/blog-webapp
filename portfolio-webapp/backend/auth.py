"""
auth.py — Admin authentication utilities.
Handles password hashing, TOTP 2FA, JWT tokens, and email recovery.
"""
import json
import os
import re
import time
import secrets
import smtplib
from email.mime.text import MIMEText
from functools import wraps

import bcrypt
import pyotp
import jwt
from flask import request, jsonify

DATA_DIR  = os.path.join(os.path.dirname(__file__), 'data')
AUTH_FILE = os.path.join(DATA_DIR, 'auth.json')

JWT_SECRET      = os.environ.get('JWT_SECRET', 'dev-insecure-set-JWT_SECRET-in-env')
RECOVERY_EMAIL  = os.environ.get('RECOVERY_EMAIL', 'aj240502@gmail.com')


# ── Auth file helpers ─────────────────────────────────────────────────────────

def _load():
    with open(AUTH_FILE) as f:
        return json.load(f)

def _save(data):
    with open(AUTH_FILE, 'w') as f:
        json.dump(data, f, indent=2)


# ── Password ──────────────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


# ── TOTP ──────────────────────────────────────────────────────────────────────

def generate_totp_secret() -> str:
    return pyotp.random_base32()

def get_totp_uri(secret: str) -> str:
    return pyotp.TOTP(secret).provisioning_uri(
        name='Admin', issuer_name='aaryajha.com'
    )

def verify_totp(secret: str, code: str) -> bool:
    return pyotp.TOTP(secret).verify(code, valid_window=1)


# ── JWT ───────────────────────────────────────────────────────────────────────

def create_token(role: str, expiry: int = 3600) -> str:
    payload = {
        'role': role,
        'iat': time.time(),
        'exp': time.time() + expiry,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

def decode_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=['HS256'])


def require_admin(f):
    """Decorator: requires a valid admin JWT in the Authorization header."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get('Authorization', '')
        if not auth.startswith('Bearer '):
            return jsonify({'error': 'Unauthorized'}), 401
        try:
            payload = decode_token(auth[7:])
            if payload.get('role') != 'admin':
                return jsonify({'error': 'Forbidden'}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except Exception:
            return jsonify({'error': 'Invalid token'}), 401
        return f(*args, **kwargs)
    return decorated


def require_pre_auth(f):
    """Decorator: requires a pre_auth JWT (issued after correct password, before 2FA)."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get('Authorization', '')
        if not auth.startswith('Bearer '):
            return jsonify({'error': 'Unauthorized'}), 401
        try:
            payload = decode_token(auth[7:])
            if payload.get('role') != 'pre_auth':
                return jsonify({'error': 'Invalid token type'}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Pre-auth token expired, please log in again'}), 401
        except Exception:
            return jsonify({'error': 'Invalid token'}), 401
        return f(*args, **kwargs)
    return decorated


# ── Recovery OTP ──────────────────────────────────────────────────────────────

def generate_recovery_otp() -> str:
    return str(secrets.randbelow(900000) + 100000)  # 6-digit, never starts with 0

def store_recovery_otp(otp: str, ttl: int = 900):
    data = _load()
    data['recovery_otp']        = otp
    data['recovery_otp_expiry'] = time.time() + ttl
    _save(data)

def verify_recovery_otp(otp: str) -> bool:
    data   = _load()
    stored = data.get('recovery_otp')
    expiry = data.get('recovery_otp_expiry', 0)
    if stored and stored == otp and time.time() < expiry:
        data['recovery_otp']        = None
        data['recovery_otp_expiry'] = None
        _save(data)
        return True
    return False


# ── Email ─────────────────────────────────────────────────────────────────────

def send_recovery_email(otp: str):
    smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
    smtp_port = int(os.environ.get('SMTP_PORT', 587))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_pass = os.environ.get('SMTP_PASSWORD', '')

    if not smtp_user or not smtp_pass:
        raise RuntimeError(
            'SMTP not configured. Set SMTP_USER and SMTP_PASSWORD in .env'
        )

    body = f"""Your admin portal recovery code is:

    {otp}

This code is valid for 15 minutes. Do not share it.

If you did not request this, ignore this email.
— aaryajha.com
"""
    msg = MIMEText(body)
    msg['Subject'] = '[aaryajha.com] Admin Recovery Code'
    msg['From']    = smtp_user
    msg['To']      = RECOVERY_EMAIL

    with smtplib.SMTP(smtp_host, smtp_port) as s:
        s.starttls()
        s.login(smtp_user, smtp_pass)
        s.sendmail(smtp_user, [RECOVERY_EMAIL], msg.as_string())


# ── State helpers ─────────────────────────────────────────────────────────────

def is_configured() -> bool:
    try:
        data = _load()
        return bool(data.get('password_hash') and data.get('totp_secret'))
    except Exception:
        return False

def get_password_hash() -> str:
    return _load().get('password_hash', '')

def get_totp_secret() -> str:
    return _load().get('totp_secret', '')

def update_password(new_password: str):
    data = _load()
    data['password_hash'] = hash_password(new_password)
    _save(data)
