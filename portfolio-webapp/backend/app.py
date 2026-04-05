from flask import Flask, jsonify, request, send_from_directory
import os
import json
import re

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

import auth as admin_auth

BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
DATA_DIR    = os.path.join(BASE_DIR, 'data')
DIST_DIR    = os.path.join(BASE_DIR, '..', 'frontend', 'dist')
JUPYTER_LOG = os.environ.get('JUPYTER_LOG', '/tmp/jupyter.log')

app = Flask(__name__)

os.makedirs(DATA_DIR, exist_ok=True)


# ── Data helpers ──────────────────────────────────────────────────────────────

def load(name):
    with open(os.path.join(DATA_DIR, f'{name}.json')) as f:
        return json.load(f)

def save(name, data):
    with open(os.path.join(DATA_DIR, f'{name}.json'), 'w') as f:
        json.dump(data, f, indent=2)

def next_id(items):
    return max((i['id'] for i in items), default=0) + 1


# ── Public API ────────────────────────────────────────────────────────────────

@app.route('/api/profile')
def get_profile():
    return jsonify(load('profile'))

@app.route('/api/experience')
def get_experience():
    return jsonify(load('experience'))

@app.route('/api/blogs')
def get_blogs():
    return jsonify(load('blogs'))

@app.route('/api/blogs/<int:blog_id>')
def get_blog(blog_id):
    blog = next((b for b in load('blogs') if b['id'] == blog_id), None)
    if blog:
        return jsonify(blog)
    return jsonify({'error': 'Blog not found'}), 404

@app.route('/api/ramblings')
def get_ramblings():
    return jsonify(load('ramblings'))

@app.route('/api/contact', methods=['POST'])
def contact():
    return jsonify({'message': "Thank you for your message! I'll get back to you soon."})


# ── Auth ──────────────────────────────────────────────────────────────────────

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data     = request.get_json(silent=True) or {}
    password = data.get('password', '')

    if not admin_auth.is_configured():
        return jsonify({'error': 'Admin not set up. Run setup_admin.py on the server.'}), 503

    if not admin_auth.verify_password(password, admin_auth.get_password_hash()):
        return jsonify({'error': 'Invalid password'}), 401

    pre_token = admin_auth.create_token('pre_auth', expiry=300)  # valid 5 min
    return jsonify({'requires_2fa': True, 'pre_token': pre_token})


@app.route('/api/admin/verify-2fa', methods=['POST'])
@admin_auth.require_pre_auth
def admin_verify_2fa():
    data = request.get_json(silent=True) or {}
    code = data.get('code', '').strip()

    if not admin_auth.verify_totp(admin_auth.get_totp_secret(), code):
        return jsonify({'error': 'Invalid 2FA code'}), 401

    token = admin_auth.create_token('admin', expiry=3600)  # valid 1 hour
    return jsonify({'token': token})


@app.route('/api/admin/recover/request', methods=['POST'])
def admin_recover_request():
    otp = admin_auth.generate_recovery_otp()
    admin_auth.store_recovery_otp(otp)
    try:
        admin_auth.send_recovery_email(otp)
    except RuntimeError as e:
        return jsonify({'error': str(e)}), 503
    except Exception as e:
        return jsonify({'error': f'Failed to send email: {e}'}), 500
    return jsonify({'message': f'Recovery code sent to {admin_auth.RECOVERY_EMAIL}'})


@app.route('/api/admin/recover/verify', methods=['POST'])
def admin_recover_verify():
    data         = request.get_json(silent=True) or {}
    otp          = data.get('otp', '').strip()
    new_password = data.get('new_password', '')

    if len(new_password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters'}), 400

    if not admin_auth.verify_recovery_otp(otp):
        return jsonify({'error': 'Invalid or expired recovery code'}), 401

    admin_auth.update_password(new_password)
    return jsonify({'message': 'Password updated. You can now log in.'})


# ── Protected admin routes ────────────────────────────────────────────────────

@app.route('/api/admin/jupyter-token')
@admin_auth.require_admin
def admin_jupyter_token():
    try:
        with open(JUPYTER_LOG) as f:
            log = f.read()
    except FileNotFoundError:
        return jsonify({'error': 'Jupyter log not found — is JupyterLab running?'}), 404

    token_match = re.search(r'token=([a-f0-9]+)', log)
    if not token_match:
        return jsonify({'error': 'Token not found in log. JupyterLab may still be starting.'}), 404

    token = token_match.group(1)
    # Prefer 127.0.0.1 URL over 0.0.0.0
    url_match = re.search(r'http://[^\s]+\?token=[a-f0-9]+', log)
    url = url_match.group(0).replace('0.0.0.0', '127.0.0.1') if url_match else None
    return jsonify({'token': token, 'url': url})


@app.route('/api/admin/profile', methods=['GET', 'PUT'])
@admin_auth.require_admin
def admin_profile():
    if request.method == 'GET':
        return jsonify(load('profile'))
    save('profile', request.get_json(silent=True) or {})
    return jsonify({'message': 'Profile updated'})


@app.route('/api/admin/blogs', methods=['GET', 'POST'])
@admin_auth.require_admin
def admin_blogs():
    blogs = load('blogs')
    if request.method == 'GET':
        return jsonify(blogs)
    entry        = request.get_json(silent=True) or {}
    entry['id']  = next_id(blogs)
    blogs.append(entry)
    save('blogs', blogs)
    return jsonify(entry), 201


@app.route('/api/admin/blogs/<int:blog_id>', methods=['PUT', 'DELETE'])
@admin_auth.require_admin
def admin_blog(blog_id):
    blogs = load('blogs')
    idx   = next((i for i, b in enumerate(blogs) if b['id'] == blog_id), None)
    if idx is None:
        return jsonify({'error': 'Not found'}), 404
    if request.method == 'DELETE':
        blogs.pop(idx)
        save('blogs', blogs)
        return jsonify({'message': 'Deleted'})
    entry       = request.get_json(silent=True) or {}
    entry['id'] = blog_id
    blogs[idx]  = entry
    save('blogs', blogs)
    return jsonify(entry)


@app.route('/api/admin/experience', methods=['GET', 'POST'])
@admin_auth.require_admin
def admin_experience():
    items = load('experience')
    if request.method == 'GET':
        return jsonify(items)
    entry        = request.get_json(silent=True) or {}
    entry['id']  = next_id(items)
    items.insert(0, entry)   # newest first
    save('experience', items)
    return jsonify(entry), 201


@app.route('/api/admin/experience/<int:exp_id>', methods=['PUT', 'DELETE'])
@admin_auth.require_admin
def admin_exp(exp_id):
    items = load('experience')
    idx   = next((i for i, e in enumerate(items) if e['id'] == exp_id), None)
    if idx is None:
        return jsonify({'error': 'Not found'}), 404
    if request.method == 'DELETE':
        items.pop(idx)
        save('experience', items)
        return jsonify({'message': 'Deleted'})
    entry       = request.get_json(silent=True) or {}
    entry['id'] = exp_id
    items[idx]  = entry
    save('experience', items)
    return jsonify(entry)


@app.route('/api/admin/ramblings', methods=['GET', 'POST'])
@admin_auth.require_admin
def admin_ramblings():
    items = load('ramblings')
    if request.method == 'GET':
        return jsonify(items)
    entry        = request.get_json(silent=True) or {}
    entry['id']  = next_id(items)
    items.insert(0, entry)
    save('ramblings', items)
    return jsonify(entry), 201


@app.route('/api/admin/ramblings/<int:item_id>', methods=['PUT', 'DELETE'])
@admin_auth.require_admin
def admin_rambling(item_id):
    items = load('ramblings')
    idx   = next((i for i, r in enumerate(items) if r['id'] == item_id), None)
    if idx is None:
        return jsonify({'error': 'Not found'}), 404
    if request.method == 'DELETE':
        items.pop(idx)
        save('ramblings', items)
        return jsonify({'message': 'Deleted'})
    entry       = request.get_json(silent=True) or {}
    entry['id'] = item_id
    items[idx]  = entry
    save('ramblings', items)
    return jsonify(entry)


# ── Static / SPA serving ──────────────────────────────────────────────────────

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_spa(path):
    full = os.path.join(DIST_DIR, path)
    if path and os.path.exists(full):
        return send_from_directory(DIST_DIR, path)
    return send_from_directory(DIST_DIR, 'index.html')


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == '__main__':
    port  = int(os.environ.get('PORT', 80))
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
