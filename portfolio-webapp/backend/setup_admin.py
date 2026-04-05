#!/usr/bin/env python3
"""
First-time admin setup. Run this once on the server:

    cd portfolio-webapp/backend
    source venv/bin/activate
    python setup_admin.py
"""
import os
import sys
import json
import getpass

# Load .env before importing auth
sys.path.insert(0, os.path.dirname(__file__))
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
except ImportError:
    pass

import auth as admin_auth

DATA_DIR  = os.path.join(os.path.dirname(__file__), 'data')
AUTH_FILE = os.path.join(DATA_DIR, 'auth.json')

os.makedirs(DATA_DIR, exist_ok=True)


def main():
    print("=" * 60)
    print("  Admin Portal Setup — aaryajha.com")
    print("=" * 60)

    if admin_auth.is_configured():
        ans = input("\nAdmin is already configured. Re-configure? [y/N]: ").strip().lower()
        if ans != 'y':
            print("Aborted.")
            return

    # ── Password ──────────────────────────────────────────────────────────────
    print("\n[1/2] Set admin password")
    while True:
        pw  = getpass.getpass("  Password (min 8 chars): ")
        pw2 = getpass.getpass("  Confirm password:       ")
        if pw != pw2:
            print("  Passwords don't match, try again.\n")
            continue
        if len(pw) < 8:
            print("  Password must be at least 8 characters.\n")
            continue
        break
    print("  Password set.")

    # ── TOTP ──────────────────────────────────────────────────────────────────
    print("\n[2/2] Set up 2FA (Google Authenticator)")
    totp_secret = admin_auth.generate_totp_secret()
    uri         = admin_auth.get_totp_uri(totp_secret)

    print(f"\n  Manual key:  {totp_secret}")
    print(f"\n  OTP URI:\n  {uri}\n")

    try:
        import qrcode
        qr = qrcode.QRCode(border=1)
        qr.add_data(uri)
        qr.make(fit=True)
        print("  Scan this QR code with Google Authenticator:\n")
        qr.print_ascii(invert=True)
    except ImportError:
        print("  (pip install qrcode to render QR in terminal)")
        print("  Paste the URI above into a QR code generator, or enter the manual key.")

    # Verify the code before saving
    print("\n  Open Google Authenticator, add the account, then enter the 6-digit code.")
    while True:
        code = input("  Enter code to verify: ").strip()
        if admin_auth.verify_totp(totp_secret, code):
            print("  2FA verified successfully.")
            break
        print("  Invalid code. Wait for the next 30-second window and try again.")

    # ── Save ──────────────────────────────────────────────────────────────────
    with open(AUTH_FILE, 'w') as f:
        json.dump({
            "password_hash":       admin_auth.hash_password(pw),
            "totp_secret":         totp_secret,
            "recovery_otp":        None,
            "recovery_otp_expiry": None,
        }, f, indent=2)

    print("\n" + "=" * 60)
    print("  Setup complete.")
    print("=" * 60)
    print("""
Next steps:
  1. Copy .env.example to .env and fill in JWT_SECRET, SMTP_USER, SMTP_PASSWORD
  2. Restart the service:  sudo systemctl restart portfolio
  3. Log in at:           https://aaryajha.com/admin
""")


if __name__ == '__main__':
    main()
