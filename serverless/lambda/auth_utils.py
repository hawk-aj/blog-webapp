"""
auth_utils.py — Admin authentication utilities.
Ported from backend/auth.py; file I/O replaced with DynamoDB via db.py.
Logic (bcrypt, TOTP, JWT) is unchanged.
"""
import os
import time
import secrets

import bcrypt
import pyotp
import jwt

import db

JWT_SECRET = os.environ.get('JWT_SECRET', 'dev-insecure-set-JWT_SECRET-in-env')


# ── Password ──────────────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


# ── TOTP ──────────────────────────────────────────────────────────────────────

def generate_totp_secret() -> str:
    return pyotp.random_base32()

def get_totp_uri(secret: str) -> str:
    return pyotp.TOTP(secret).provisioning_uri(name='Admin', issuer_name='aaryajha.com')

def verify_totp(secret: str, code: str) -> bool:
    return pyotp.TOTP(secret).verify(code, valid_window=1)


# ── JWT ───────────────────────────────────────────────────────────────────────

def create_token(role: str, expiry: int = 3600) -> str:
    payload = {'role': role, 'iat': time.time(), 'exp': time.time() + expiry}
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

def decode_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=['HS256'])


# ── Auth state (DynamoDB) ─────────────────────────────────────────────────────

def is_configured() -> bool:
    try:
        data = db.load_auth()
        return bool(data.get('password_hash') and data.get('totp_secret'))
    except Exception:
        return False

def get_password_hash() -> str:
    return db.load_auth().get('password_hash', '')

def get_totp_secret() -> str:
    return db.load_auth().get('totp_secret', '')

def update_password(new_password: str):
    data = db.load_auth()
    data['password_hash'] = hash_password(new_password)
    db.save_auth(data)


# ── Recovery OTP ──────────────────────────────────────────────────────────────

def generate_recovery_otp() -> str:
    return str(secrets.randbelow(900000) + 100000)

def store_recovery_otp(otp: str, ttl: int = 900):
    data = db.load_auth()
    data['recovery_otp']        = otp
    data['recovery_otp_expiry'] = time.time() + ttl
    db.save_auth(data)

def verify_recovery_otp(otp: str) -> bool:
    data   = db.load_auth()
    stored = data.get('recovery_otp')
    expiry = data.get('recovery_otp_expiry', 0)
    if stored and stored == otp and time.time() < float(expiry):
        data['recovery_otp']        = None
        data['recovery_otp_expiry'] = None
        db.save_auth(data)
        return True
    return False
