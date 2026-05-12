# Aarya Jha — Portfolio & Blog

Personal portfolio and blog for Aarya Jha — Data Engineer II & AI/ML Researcher.

## Live

| | URL |
|---|---|
| Site | https://aaryajha.com |
| API | https://aaryajha.com/api/profile |
| Admin | https://aaryajha.com/admin |

## Architecture

Fully serverless on AWS (migrated from EC2 in v2.0):

```
CloudFront (aaryajha.com, ACM TLS)
├── /api/*  → API Gateway HTTP API → Lambda (Python 3.12)
│                                        ├── DynamoDB (profile, blogs, experience, ramblings, auth)
│                                        └── Gmail SMTP (contact form + admin recovery)
└── /*      → S3 (React SPA)
```

## Project Structure

```
personal-blog/
├── serverless/
│   ├── lambda/
│   │   ├── index.py          # All API routes (ported from Flask 1:1)
│   │   ├── auth_utils.py     # bcrypt, TOTP, JWT
│   │   ├── db.py             # DynamoDB helpers
│   │   ├── email_utils.py    # Gmail SMTP
│   │   └── requirements.txt
│   ├── build.sh              # Build Lambda zip (cross-compiled for Linux x86_64)
│   ├── setup_admin.py        # Initialise admin credentials in DynamoDB
│   └── migrate.py            # One-time JSON -> DynamoDB migration
├── portfolio-webapp/
│   └── frontend/
│       ├── public/           # Static images for the 3D room (tree, kalakaari, mosaic_2, …)
│       ├── src/
│       │   ├── App.jsx / App.css
│       │   ├── components/
│       │   │   ├── Navbar.*
│       │   │   └── Room3D.jsx   # CSS 3D hero room — see ROOM3D.md
│       │   └── pages/        # Home, About, Work, Blogs, Ramblings, Contact, Admin
│       └── package.json
├── DESIGN.md                 # Colour palette and design system reference
├── ROOM3D.md                 # 3D room hero — geometry, animation, and tuning guide
└── README.md
```

## Deploying

### Frontend
```bash
cd portfolio-webapp/frontend
npm run build

# Sync — assets get long-lived immutable cache, index.html gets must-revalidate
aws s3 sync dist/ s3://aaryajha.com-frontend/ --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "index.html"

aws s3 cp dist/index.html s3://aaryajha.com-frontend/index.html \
  --cache-control "public,max-age=0,must-revalidate"

# CloudFront invalidation is only needed for static-name assets with long TTLs.
# JS/CSS bundles are content-hashed (new name = auto cache-bust).
# index.html uses must-revalidate so CloudFront revalidates every request.
# Run this only if you changed a non-hashed static asset (e.g. a public/ image):
# aws cloudfront create-invalidation --distribution-id E2P25BXD8Z53FH --paths "/*"
```

### Lambda (backend)
```bash
bash serverless/build.sh
aws lambda update-function-code \
  --function-name portfolio-api \
  --zip-file fileb://serverless/portfolio-lambda.zip
```

### Infrastructure
The CloudFormation stack (`portfolio-serverless`) is deployed separately with sensitive
parameters (JWT secret, SMTP credentials) passed at deploy time — not stored in the repo.

## Local Development

**Frontend** (hot reload against the live API):
```bash
cd portfolio-webapp/frontend
npm install && npm run dev
# -> http://localhost:3000 (proxies /api/* to aaryajha.com)
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/profile` | — | Name, bio, skills, contact info |
| GET | `/api/experience` | — | Work experience entries |
| GET | `/api/blogs` | — | All blog posts |
| GET | `/api/blogs/<id>` | — | Single blog post |
| GET | `/api/ramblings` | — | Personal ramblings |
| POST | `/api/contact` | — | Contact form (sends email) |
| POST | `/api/admin/login` | — | Password auth, returns pre-auth JWT |
| POST | `/api/admin/verify-2fa` | pre-auth | TOTP verify, returns admin JWT |
| GET/PUT | `/api/admin/profile` | admin | Edit profile |
| GET/POST | `/api/admin/blogs` | admin | Manage blog posts |
| PUT/DELETE | `/api/admin/blogs/<id>` | admin | Edit/delete a blog post |
| GET/POST | `/api/admin/experience` | admin | Manage experience entries |
| PUT/DELETE | `/api/admin/experience/<id>` | admin | Edit/delete an experience entry |
| GET/POST | `/api/admin/ramblings` | admin | Manage ramblings |
| PUT/DELETE | `/api/admin/ramblings/<id>` | admin | Edit/delete a rambling |
| POST | `/api/admin/recover/request` | — | Send OTP to recovery email |
| POST | `/api/admin/recover/verify` | — | Reset password via OTP |

## Admin Portal

Login at `/admin` — password + Google Authenticator (TOTP 2FA).

To reset credentials (requires DynamoDB access):
```bash
python serverless/setup_admin.py
```

## AWS Resources

| Resource | ID / Name |
|---|---|
| CloudFront distribution | `E2P25BXD8Z53FH` |
| S3 bucket (frontend) | `aaryajha.com-frontend` |
| Lambda function | `portfolio-api` (ap-south-1) |
| API Gateway | `portfolio-api` (ap-south-1) |
| DynamoDB tables | `portfolio-{profile,blogs,experience,ramblings,auth}` |
| ACM certificate | us-east-1 (covers `aaryajha.com` + `*.aaryajha.com`) |
