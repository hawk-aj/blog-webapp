#!/usr/bin/env python3
"""
start.py - Single entry point for the portfolio site.

Usage:
    python start.py              # serves on port 80 (requires sudo on Linux)
    PORT=8080 python start.py    # serves on port 8080

What it does:
    1. Builds the React frontend  (npm run build)
    2. Launches JupyterLab in the background on port 8888
    3. Starts Flask on PORT (default 80), serving built frontend + API
"""

import os
import sys
import subprocess
import signal
import time

SCRIPT_DIR    = os.path.dirname(os.path.abspath(__file__))
WEBAPP_DIR    = os.path.join(SCRIPT_DIR, 'portfolio-webapp')
FRONTEND_DIR  = os.path.join(WEBAPP_DIR, 'frontend')
BACKEND_DIR   = os.path.join(WEBAPP_DIR, 'backend')
NOTEBOOKS_DIR = os.path.join(WEBAPP_DIR, 'notebooks')

PORT         = int(os.environ.get('PORT', 80))
JUPYTER_PORT = int(os.environ.get('JUPYTER_PORT', 8888))

jupyter_proc = None


def cleanup(signum=None, frame=None):
    if jupyter_proc and jupyter_proc.poll() is None:
        print('\nShutting down JupyterLab...')
        jupyter_proc.terminate()
        try:
            jupyter_proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            jupyter_proc.kill()
    sys.exit(0)


signal.signal(signal.SIGINT,  cleanup)
signal.signal(signal.SIGTERM, cleanup)

# ── Step 1: Build the React frontend ─────────────────────────────────────────
print('=' * 60)
print('Step 1: Building React frontend...')
print('=' * 60)

npm_cmd = 'npm.cmd' if sys.platform == 'win32' else 'npm'

result = subprocess.run([npm_cmd, 'run', 'build'], cwd=FRONTEND_DIR)

if result.returncode != 0:
    print('\nERROR: npm run build failed.')
    print(f'Make sure dependencies are installed:')
    print(f'  cd {FRONTEND_DIR} && npm install')
    sys.exit(1)

print('Frontend build complete.\n')

# ── Step 2: Start JupyterLab in the background ───────────────────────────────
print('=' * 60)
print(f'Step 2: Starting JupyterLab on port {JUPYTER_PORT}...')
print('=' * 60)

os.makedirs(NOTEBOOKS_DIR, exist_ok=True)

# Ensure user site-packages are on the path (needed when running under systemd)
home = os.environ.get('HOME', os.path.expanduser('~'))
jupyter_env = dict(os.environ)
jupyter_env['HOME'] = home

jupyter_log = open('/tmp/jupyter.log', 'w')
jupyter_proc = subprocess.Popen(
    [
        sys.executable, '-m', 'jupyterlab',
        '--ip=0.0.0.0',
        f'--port={JUPYTER_PORT}',
        '--no-browser',
        f'--notebook-dir={NOTEBOOKS_DIR}',
    ],
    stdout=jupyter_log,
    stderr=jupyter_log,
    env=jupyter_env,
)

time.sleep(4)

if jupyter_proc.poll() is not None:
    jupyter_log.flush()
    print(f'WARNING: JupyterLab failed to start (exit code {jupyter_proc.returncode}).')
    print('Check /tmp/jupyter.log for details. Continuing without JupyterLab...')
    jupyter_proc = None
else:
    print(f'JupyterLab running at  http://0.0.0.0:{JUPYTER_PORT}\n')

# ── Step 3: Start Flask ───────────────────────────────────────────────────────
print('=' * 60)
print(f'Step 3: Starting Flask on port {PORT}...')
print(f'        Site available at  http://0.0.0.0:{PORT}')
print('=' * 60)
print()

os.environ['PORT'] = str(PORT)
sys.path.insert(0, BACKEND_DIR)

from app import app as flask_app
flask_app.run(host='0.0.0.0', port=PORT, debug=False)
