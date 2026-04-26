"""
index.py — Lambda entry point for portfolio API.
Handles routing, request parsing, and response formatting.
All Flask routes ported 1:1; auth logic unchanged.
"""
import json
import re
import os
import base64

import db
import auth_utils
import email_utils

DOMAIN = os.environ.get('DOMAIN', 'https://aaryajha.com')

CORS_HEADERS = {
    'Access-Control-Allow-Origin': DOMAIN,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
}


# ── Response helpers ──────────────────────────────────────────────────────────

def response(status, body):
    return {'statusCode': status, 'headers': CORS_HEADERS, 'body': json.dumps(body)}

def ok(body):       return response(200, body)
def created(body):  return response(201, body)
def err(status, msg): return response(status, {'error': msg})


# ── Request helpers ───────────────────────────────────────────────────────────

def get_body(event):
    body = event.get('body') or ''
    if event.get('isBase64Encoded'):
        body = base64.b64decode(body).decode()
    try:
        return json.loads(body) if body else {}
    except Exception:
        return {}

def get_token(event):
    auth = (event.get('headers') or {}).get('authorization', '')
    return auth[7:] if auth.startswith('Bearer ') else None


# ── Auth guards ───────────────────────────────────────────────────────────────

def require_admin(event):
    token = get_token(event)
    if not token:
        return err(401, 'Unauthorized')
    try:
        payload = auth_utils.decode_token(token)
        if payload.get('role') != 'admin':
            return err(403, 'Forbidden')
    except Exception as e:
        return err(401, str(e))
    return None

def require_pre_auth(event):
    token = get_token(event)
    if not token:
        return err(401, 'Unauthorized')
    try:
        payload = auth_utils.decode_token(token)
        if payload.get('role') != 'pre_auth':
            return err(403, 'Invalid token type')
    except Exception as e:
        return err(401, str(e))
    return None


# ── Public routes ─────────────────────────────────────────────────────────────

def get_profile(event, _):
    return ok(db.load_single('profile'))

def get_experience(event, _):
    return ok(db.load_list('experience', reverse=True))

def get_blogs(event, _):
    return ok(db.load_list('blogs'))

def get_blog(event, m):
    blog_id = int(m.group(1))
    blog = next((b for b in db.load_list('blogs') if b['id'] == blog_id), None)
    return ok(blog) if blog else err(404, 'Blog not found')

def get_ramblings(event, _):
    return ok(db.load_list('ramblings', reverse=True))

def contact(event, _):
    data    = get_body(event)
    name    = data.get('name', '').strip()
    email   = data.get('email', '').strip()
    subject = data.get('subject', '').strip()
    message = data.get('message', '').strip()
    if not all([name, email, subject, message]):
        return err(400, 'All fields are required.')
    try:
        email_utils.send_contact_email(name, email, subject, message)
    except RuntimeError as e:
        return err(503, str(e))
    except Exception as e:
        return err(500, f'Failed to send message: {e}')
    return ok({'message': "Thank you for your message! I'll get back to you soon."})


# ── Auth routes ───────────────────────────────────────────────────────────────

def admin_login(event, _):
    data     = get_body(event)
    password = data.get('password', '')
    if not auth_utils.is_configured():
        return err(503, 'Admin not set up. Run setup_admin.py.')
    if not auth_utils.verify_password(password, auth_utils.get_password_hash()):
        return err(401, 'Invalid password')
    pre_token = auth_utils.create_token('pre_auth', expiry=300)
    return ok({'requires_2fa': True, 'pre_token': pre_token})

def admin_verify_2fa(event, _):
    guard = require_pre_auth(event)
    if guard: return guard
    code = get_body(event).get('code', '').strip()
    if not auth_utils.verify_totp(auth_utils.get_totp_secret(), code):
        return err(401, 'Invalid 2FA code')
    return ok({'token': auth_utils.create_token('admin', expiry=3600)})

def admin_recover_request(event, _):
    otp = auth_utils.generate_recovery_otp()
    auth_utils.store_recovery_otp(otp)
    try:
        email_utils.send_recovery_email(otp)
    except RuntimeError as e:
        return err(503, str(e))
    except Exception as e:
        return err(500, f'Failed to send email: {e}')
    return ok({'message': f'Recovery code sent to {os.environ.get("RECOVERY_EMAIL", "")}'})

def admin_recover_verify(event, _):
    data         = get_body(event)
    otp          = data.get('otp', '').strip()
    new_password = data.get('new_password', '')
    if len(new_password) < 8:
        return err(400, 'Password must be at least 8 characters')
    if not auth_utils.verify_recovery_otp(otp):
        return err(401, 'Invalid or expired recovery code')
    auth_utils.update_password(new_password)
    return ok({'message': 'Password updated. You can now log in.'})


# ── Protected admin CRUD — profile ────────────────────────────────────────────

def admin_get_profile(event, _):
    guard = require_admin(event)
    if guard: return guard
    return ok(db.load_single('profile'))

def admin_put_profile(event, _):
    guard = require_admin(event)
    if guard: return guard
    db.save_single('profile', get_body(event))
    return ok({'message': 'Profile updated'})


# ── Protected admin CRUD — blogs ──────────────────────────────────────────────

def admin_get_blogs(event, _):
    guard = require_admin(event)
    if guard: return guard
    return ok(db.load_list('blogs'))

def admin_post_blog(event, _):
    guard = require_admin(event)
    if guard: return guard
    blogs = db.load_list('blogs')
    entry       = get_body(event)
    entry['id'] = db.next_id(blogs)
    db.save_item('blogs', entry)
    return created(entry)

def admin_put_blog(event, m):
    guard = require_admin(event)
    if guard: return guard
    entry       = get_body(event)
    entry['id'] = int(m.group(1))
    db.save_item('blogs', entry)
    return ok(entry)

def admin_delete_blog(event, m):
    guard = require_admin(event)
    if guard: return guard
    db.delete_item('blogs', int(m.group(1)))
    return ok({'message': 'Deleted'})


# ── Protected admin CRUD — experience ────────────────────────────────────────

def admin_get_experience(event, _):
    guard = require_admin(event)
    if guard: return guard
    return ok(db.load_list('experience', reverse=True))

def admin_post_experience(event, _):
    guard = require_admin(event)
    if guard: return guard
    items       = db.load_list('experience')
    entry       = get_body(event)
    entry['id'] = db.next_id(items)
    db.save_item('experience', entry)
    return created(entry)

def admin_put_experience(event, m):
    guard = require_admin(event)
    if guard: return guard
    entry       = get_body(event)
    entry['id'] = int(m.group(1))
    db.save_item('experience', entry)
    return ok(entry)

def admin_delete_experience(event, m):
    guard = require_admin(event)
    if guard: return guard
    db.delete_item('experience', int(m.group(1)))
    return ok({'message': 'Deleted'})


# ── Protected admin CRUD — ramblings ─────────────────────────────────────────

def admin_get_ramblings(event, _):
    guard = require_admin(event)
    if guard: return guard
    return ok(db.load_list('ramblings', reverse=True))

def admin_post_rambling(event, _):
    guard = require_admin(event)
    if guard: return guard
    items       = db.load_list('ramblings')
    entry       = get_body(event)
    entry['id'] = db.next_id(items)
    db.save_item('ramblings', entry)
    return created(entry)

def admin_put_rambling(event, m):
    guard = require_admin(event)
    if guard: return guard
    entry       = get_body(event)
    entry['id'] = int(m.group(1))
    db.save_item('ramblings', entry)
    return ok(entry)

def admin_delete_rambling(event, m):
    guard = require_admin(event)
    if guard: return guard
    db.delete_item('ramblings', int(m.group(1)))
    return ok({'message': 'Deleted'})


# ── Route table ───────────────────────────────────────────────────────────────

ROUTES = [
    ('GET',    r'^/api/profile$',                   get_profile),
    ('GET',    r'^/api/experience$',                get_experience),
    ('GET',    r'^/api/blogs$',                     get_blogs),
    ('GET',    r'^/api/blogs/(\d+)$',               get_blog),
    ('GET',    r'^/api/ramblings$',                 get_ramblings),
    ('POST',   r'^/api/contact$',                   contact),
    ('POST',   r'^/api/admin/login$',               admin_login),
    ('POST',   r'^/api/admin/verify-2fa$',          admin_verify_2fa),
    ('POST',   r'^/api/admin/recover/request$',     admin_recover_request),
    ('POST',   r'^/api/admin/recover/verify$',      admin_recover_verify),
    ('GET',    r'^/api/admin/profile$',             admin_get_profile),
    ('PUT',    r'^/api/admin/profile$',             admin_put_profile),
    ('GET',    r'^/api/admin/blogs$',               admin_get_blogs),
    ('POST',   r'^/api/admin/blogs$',               admin_post_blog),
    ('PUT',    r'^/api/admin/blogs/(\d+)$',         admin_put_blog),
    ('DELETE', r'^/api/admin/blogs/(\d+)$',         admin_delete_blog),
    ('GET',    r'^/api/admin/experience$',          admin_get_experience),
    ('POST',   r'^/api/admin/experience$',          admin_post_experience),
    ('PUT',    r'^/api/admin/experience/(\d+)$',    admin_put_experience),
    ('DELETE', r'^/api/admin/experience/(\d+)$',    admin_delete_experience),
    ('GET',    r'^/api/admin/ramblings$',           admin_get_ramblings),
    ('POST',   r'^/api/admin/ramblings$',           admin_post_rambling),
    ('PUT',    r'^/api/admin/ramblings/(\d+)$',     admin_put_rambling),
    ('DELETE', r'^/api/admin/ramblings/(\d+)$',     admin_delete_rambling),
]


# ── Entry point ───────────────────────────────────────────────────────────────

def lambda_handler(event, context):
    method = event['requestContext']['http']['method']
    path   = event.get('rawPath', '/')

    if method == 'OPTIONS':
        return {'statusCode': 204, 'headers': CORS_HEADERS, 'body': ''}

    for route_method, pattern, handler in ROUTES:
        if method == route_method:
            m = re.match(pattern, path)
            if m:
                try:
                    return handler(event, m)
                except Exception as e:
                    print(f'Unhandled error in {handler.__name__}: {e}')
                    return err(500, 'Internal server error')

    return err(404, 'Not found')
