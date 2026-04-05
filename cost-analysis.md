# AWS Cost Analysis — Portfolio Site

> Prices are **ap-south-1 (Mumbai)** on-demand rates as of 2026.
> All figures in USD. Actual bills may vary slightly with data transfer and minor rounding.

---

## Current Architecture

| Component | Service | Spec |
|---|---|---|
| Compute | EC2 t3.small | 2 vCPU, 2 GB RAM, Amazon Linux 2023 |
| Storage | EBS gp3 | 20 GB root volume |
| Networking | Public IPv4 | Assigned to instance |
| DNS | Route 53 | Hosted zone + A records |
| TLS | Let's Encrypt (Certbot) | Free, auto-renewed |

No RDS, no S3, no load balancer, no NAT gateway.

---

## Monthly Cost Breakdown

### EC2 — t3.small (on-demand)

| Item | Rate | Monthly |
|---|---|---|
| t3.small compute | $0.0272 / hr | **~$19.84** |
| EBS gp3 20 GB | $0.0928 / GB-mo | **~$1.86** |
| EBS I/O (gp3 baseline included) | — | $0.00 |

**EC2 subtotal: ~$21.70 / month**

### Networking

| Item | Rate | Monthly |
|---|---|---|
| Public IPv4 address (in-use) | $0.005 / hr | **~$3.65** |
| Data transfer out (first 100 GB) | $0.1093 / GB | ~$0–$2 typical |
| Data transfer in | Free | $0.00 |

> AWS started charging for all public IPv4 addresses (including those attached to running instances) from February 2024.

**Networking subtotal: ~$4–$6 / month**

### Route 53

| Item | Rate | Monthly |
|---|---|---|
| Hosted zone (aaryajha.com) | $0.50 / zone | **$0.50** |
| DNS queries (first 1B) | $0.40 / million | ~$0.00 (low traffic) |

**Route 53 subtotal: ~$0.50 / month**

---

## Total Estimated Monthly Cost

| Scenario | Cost |
|---|---|
| Minimum (low traffic) | **~$26 / month** |
| Typical (a few GB out) | **~$27–$28 / month** |
| Heavy traffic (10+ GB out) | **~$30+ / month** |

**Annual estimate: ~$312–$340 / year**

---

## Savings Options

### Option 1 — Reserved Instance (1-year, no upfront)
- t3.small 1-yr reserved: ~$0.0174 / hr → **~$12.70 / month**
- Saves ~$7 / month (~35%) on compute alone
- **New total: ~$18–$20 / month (~$216–$240 / year)**

### Option 2 — Downgrade to t3.micro
- t3.micro: $0.0136 / hr → **~$9.93 / month**
- 1 GB RAM — Flask + JupyterLab may be tight; monitor memory before switching
- **New total: ~$15–$16 / month**

### Option 3 — Static site on S3 + CloudFront (if Jupyter not needed)
- S3 + CloudFront hosting: < $1 / month
- Would lose JupyterLab integration and Flask API (would need Lambda/API Gateway)
- Not recommended given current architecture

### Option 4 — Spot Instance (not recommended for this use case)
- Up to 70% savings but instance can be interrupted
- Not suitable for a persistent web server with JupyterLab sessions

---

## Free Tier Note

If the account is within its first 12 months, t3.micro is free-tier eligible (750 hrs/month). t3.small is **not** free-tier eligible.

---

## Cost Monitoring Tips

- Set a **Billing Alert** in CloudWatch at $35/month to catch unexpected charges
- Check **Cost Explorer** monthly — filter by service to spot anomalies
- Data transfer out is the main variable cost; stays near $0 for a personal portfolio
