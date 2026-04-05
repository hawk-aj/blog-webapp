# Architecture

## EC2 Instance

| Property | Value |
|---|---|
| Instance ID | `i-0a839c60eef5e7ed6` |
| Type | `t3.small` (2 vCPU, 2 GB RAM) |
| Region | `ap-south-1` (Mumbai) |
| OS | Amazon Linux 2023 |
| Disk | 20 GB gp3 |
| Public IP | `3.6.40.8` |
| DNS | `ec2-3-6-40-8.ap-south-1.compute.amazonaws.com` |
| Key pair | `aarya-base-key-pair` |
| CloudFormation stack | `portfolio-site` |

## Service Topology

```
Internet
    │
    │  :80  (HTTP → redirect to HTTPS)
    │  :443 (HTTPS)
    │  :22  (SSH)
    ▼
┌─────────────────────────────────────────┐
│              nginx 1.28                 │
│                                         │
│  aaryajha.com          → :5000          │
│  www.aaryajha.com      → redirect apex  │
│  jupyter.aaryajha.com  → :8888 (WS)    │
└──────────────┬──────────────────┬───────┘
               │                  │
               ▼                  ▼
     ┌──────────────┐   ┌──────────────────┐
     │  Flask 3.1   │   │  JupyterLab 4.3  │
     │  :5000       │   │  :8888           │
     │  (localhost) │   │  (localhost)     │
     └──────────────┘   └──────────────────┘
     Serves:            Serves:
     - React SPA        - Notebook UI
       (dist/)          - Kernel WS
     - /api/* routes    notebooks/ dir
```

## How Traffic Flows

1. **HTTP request** (`http://aaryajha.com`) hits nginx on port 80 → nginx returns `301` to HTTPS.
2. **HTTPS request** (`https://aaryajha.com`) hits nginx on port 443 → nginx terminates TLS → proxies to Flask on `127.0.0.1:5000`.
3. Flask serves the pre-built React `dist/` as static files for all non-`/api/` paths (SPA fallback to `index.html`), and handles `/api/*` routes directly.
4. **Jupyter** traffic (`https://jupyter.aaryajha.com`) is proxied to `127.0.0.1:8888`. nginx forwards `Upgrade: websocket` headers so Jupyter's kernel connections work.

## Security Groups

| Port | Protocol | Source | Purpose |
|------|----------|--------|---------|
| 22 | TCP | 0.0.0.0/0 | SSH |
| 80 | TCP | 0.0.0.0/0 | HTTP (redirects to HTTPS) |
| 443 | TCP | 0.0.0.0/0 | HTTPS |
| 8888 | TCP | 0.0.0.0/0 | JupyterLab direct (also via HTTPS subdomain) |

## TLS Certificate

| Property | Value |
|---|---|
| Issuer | Let's Encrypt |
| Domains | `aaryajha.com`, `www.aaryajha.com`, `jupyter.aaryajha.com` |
| Expires | 2026-07-04 |
| Auto-renew | Yes — certbot systemd timer |
| Cert path | `/etc/letsencrypt/live/aaryajha.com/fullchain.pem` |
| Key path | `/etc/letsencrypt/live/aaryajha.com/privkey.pem` |

## Systemd Service

The portfolio runs as a systemd service (`portfolio.service`) that starts on boot and auto-restarts on failure.

**What `start.py` does on each start:**
1. `npm run build` — builds the React frontend into `frontend/dist/`
2. Launches JupyterLab as a background subprocess (`python3 -m jupyterlab`)
3. Starts Flask on `PORT=5000` (in-process import, not a subprocess)

```bash
# Service management
sudo systemctl status portfolio
sudo systemctl restart portfolio
sudo systemctl stop portfolio

# Logs (live)
sudo journalctl -u portfolio -f

# nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Jupyter startup log
tail -f /tmp/jupyter.log
```

## SSH Access

```bash
ssh -i ~/.configs/aarya-base-key-pair.pem ec2-user@3.6.40.8
```

## Infrastructure as Code

The EC2 instance, security group, and EBS volume are defined in `cloudformation.yaml` at the project root. The stack can be updated with:

```bash
aws cloudformation deploy \
  --template-file cloudformation.yaml \
  --stack-name portfolio-site \
  --parameter-overrides KeyPairName=aarya-base-key-pair InstanceType=t3.small
```

To tear everything down:
```bash
aws cloudformation delete-stack --stack-name portfolio-site
```
