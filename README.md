# Aarya Jha — Portfolio & Blog

Personal portfolio, blog, and data science workspace for Aarya Jha.

## Live Links

| | URL |
|---|---|
| Portfolio | https://aaryajha.com |
| JupyterLab | https://jupyter.aaryajha.com |
| API (profile) | https://aaryajha.com/api/profile |
| API (blogs) | https://aaryajha.com/api/blogs |
| API (experience) | https://aaryajha.com/api/experience |
| API (ramblings) | https://aaryajha.com/api/ramblings |


## Project Structure

```
personal-blog/
├── start.py                          # Single entry point — builds frontend, starts Jupyter + Flask
├── cloudformation.yaml               # AWS infrastructure definition
├── README.md                         # This file
├── ARCHITECTURE.md                   # EC2 and service architecture
└── portfolio-webapp/
    ├── backend/
    │   ├── app.py                    # Flask API + static file serving
    │   └── requirements.txt          # Python deps (Flask, JupyterLab)
    ├── frontend/
    │   ├── src/
    │   │   ├── App.jsx / App.css
    │   │   ├── index.css             # Design system (dark theme, Inter font)
    │   │   ├── components/Navbar.*
    │   │   └── pages/                # Home, About, Work, Blogs, Ramblings, Contact
    │   ├── index.html
    │   ├── package.json
    │   └── vite.config.js
    └── notebooks/                    # Jupyter notebooks (mounted into JupyterLab)
```

## Running Locally

**Install dependencies once:**
```bash
cd portfolio-webapp/frontend && npm install
cd ../backend && pip install -r requirements.txt
cd ../..
```

**Start everything:**
```bash
python start.py
# Site →    http://localhost
# Jupyter → http://localhost:8888
```

Set `PORT=8080` if port 80 requires root on your machine:
```bash
PORT=8080 python start.py
```

**Frontend dev server** (hot reload, proxies API to Flask on 5000):
```bash
# Terminal 1 — Flask
cd portfolio-webapp/backend && PORT=5000 python app.py

# Terminal 2 — Vite dev server
cd portfolio-webapp/frontend && npm run dev
# → http://localhost:3000
```

## Redeploying to EC2

After making local changes, push them to the server:

```bash
# From the personal-blog/ directory:
tar -czf /tmp/portfolio.tar.gz \
  --exclude='./.git' \
  --exclude='./portfolio-webapp/frontend/node_modules' \
  --exclude='./portfolio-webapp/frontend/dist' \
  --exclude='./portfolio-webapp/backend/venv' \
  --exclude='./portfolio-webapp/video-demo.mp4' \
  --exclude='./.claude' \
  --exclude='./cloudformation.yaml' \
  .

KEY="~/.configs/aarya-base-key-pair.pem"
scp -i "$KEY" /tmp/portfolio.tar.gz ec2-user@$HOST:/tmp/

ssh -i "$KEY" ec2-user@$HOST \
  "tar -xzf /tmp/portfolio.tar.gz -C ~/portfolio && sudo systemctl restart portfolio"
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Name, bio, skills, contact info |
| GET | `/api/experience` | Work experience entries |
| GET | `/api/blogs` | All blog posts |
| GET | `/api/blogs/<id>` | Single blog post |
| GET | `/api/ramblings` | Personal ramblings |
| POST | `/api/contact` | Contact form submission |

---

## Recreating `start.py`

`start.py` is committed to the repo at the root. If you need to recreate it from scratch, here is what it does and the key configuration:

**Purpose:** Single entry point that (1) builds the React frontend with `npm run build`, (2) starts JupyterLab in the background on port 8888 logging to `/tmp/jupyter.log`, and (3) starts Flask on `PORT` (default 80) serving both the API and the built frontend.

**Key config constants (top of file):**
```python
WEBAPP_DIR    = os.path.join(SCRIPT_DIR, 'portfolio-webapp')
FRONTEND_DIR  = os.path.join(WEBAPP_DIR, 'frontend')
BACKEND_DIR   = os.path.join(WEBAPP_DIR, 'backend')
NOTEBOOKS_DIR = os.path.join(WEBAPP_DIR, 'notebooks')

PORT         = int(os.environ.get('PORT', 80))
JUPYTER_PORT = int(os.environ.get('JUPYTER_PORT', 8888))
```

**Jupyter log path:** `/tmp/jupyter.log` — the admin panel reads this file to extract the token via regex `token=([a-f0-9]+)`.

**Signal handling:** `SIGINT` and `SIGTERM` both call `cleanup()` which gracefully terminates the JupyterLab subprocess before exiting.

**systemd unit** (`/etc/systemd/system/portfolio.service`) references this file:
```ini
[Service]
ExecStart=/usr/bin/python3 /home/ec2-user/portfolio/start.py
WorkingDirectory=/home/ec2-user/portfolio
EnvironmentFile=/home/ec2-user/portfolio/portfolio-webapp/backend/.env
Restart=always
```

---

## Recreating `update-deployment.py`

`update-deployment.py` is **gitignored** (contains your local key path). Create it at the repo root with the following template, filling in the `KEY` path for your machine:

```python
#!/usr/bin/env python3
"""
update-deployment.py  —  deploy local changes to EC2
Usage:
    python update-deployment.py            # bundle, copy, extract, restart
    python update-deployment.py --no-restart   # sync files only
    python update-deployment.py --restart      # restart service only (no file sync)
"""
import os, sys, tarfile, subprocess, tempfile, argparse

# ── Config ────────────────────────────────────────────────────────────────────
LOCAL_SRC   = 'portfolio-webapp/'          # relative to this script
KEY         = '../.configs/aarya-base-key-pair.pem'   # <-- EDIT THIS
HOST        = 'ec2-user@<YOUR-EC2-IP>'
REMOTE_BASE = '/home/ec2-user/portfolio'
SERVICE     = 'portfolio'

EXCLUDE_DIRS = {'node_modules', 'venv', 'dist', '__pycache__', '.git', '.ipynb_checkpoints'}
EXCLUDE_REL  = {'backend/data/auth.json', 'backend/.env'}   # relative to LOCAL_SRC
EXCLUDE_EXT  = {'.pyc', '.pem', '.mp4', '.mov', '.avi', '.mkv', '.mp3', '.wav'}
# ─────────────────────────────────────────────────────────────────────────────

def ssh(cmd):
    return subprocess.run(['ssh', '-i', KEY, HOST, cmd], check=True)

def collect_files(src_root):
    files = []
    for dirpath, dirnames, filenames in os.walk(src_root):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        for fname in filenames:
            if os.path.splitext(fname)[1].lower() in EXCLUDE_EXT:
                continue
            abs_path = os.path.join(dirpath, fname)
            rel = os.path.relpath(abs_path, src_root)
            if rel.replace('\\', '/') in EXCLUDE_REL:
                continue
            files.append((abs_path, rel))
    return files

def bundle_and_deploy(src_root):
    files = collect_files(src_root)
    print(f'[..] Bundling {len(files)} files')
    with tempfile.NamedTemporaryFile(suffix='.tar.gz', delete=False) as tmp:
        tmp_path = tmp.name
    with tarfile.open(tmp_path, 'w:gz') as tar:
        for abs_path, rel in files:
            tar.add(abs_path, arcname=os.path.join('portfolio-webapp', rel))
    size_kb = os.path.getsize(tmp_path) // 1024
    print(f'[ok] Bundle ready: {size_kb} KB')
    remote_tmp = '/tmp/portfolio_deploy.tar.gz'
    subprocess.run(['scp', '-i', KEY, tmp_path, f'{HOST}:{remote_tmp}'], check=True)
    os.unlink(tmp_path)
    print('[ok] Uploaded')
    ssh(f'tar -xzf {remote_tmp} -C {REMOTE_BASE} && rm {remote_tmp}')
    print('[ok] Extracted on server')

def restart_service():
    ssh(f'sudo systemctl restart {SERVICE}')
    print('[ok] Service restarted')
    import time; time.sleep(3)
    r = subprocess.run(['ssh', '-i', KEY, HOST,
                        f'sudo systemctl is-active {SERVICE}'], capture_output=True, text=True)
    status = r.stdout.strip()
    print(f'[ok] Service status: {status}' if status == 'active' else f'[x]  Service status: {status}')

if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--no-restart', action='store_true')
    p.add_argument('--restart',    action='store_true')
    args = p.parse_args()

    script_dir = os.path.dirname(os.path.abspath(__file__))
    src_root   = os.path.normpath(os.path.join(script_dir, LOCAL_SRC))

    if args.restart:
        restart_service()
    elif args.no_restart:
        bundle_and_deploy(src_root)
    else:
        bundle_and_deploy(src_root)
        restart_service()
```

**Things to update when recreating on a new machine:**
- `KEY` — absolute or relative path to your `.pem` file
- `HOST` — EC2 public IP in the format `ec2-user@<ip>`
- `REMOTE_BASE` — deployment directory on the server (currently `/home/ec2-user/portfolio`)
