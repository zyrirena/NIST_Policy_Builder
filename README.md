# NIST AI RMF Policy Builder v2

AI governance policy generator aligned with the NIST AI Risk Management Framework. Built for easy deployment on **Railway + Supabase** with an optional **Claude AI Policy Advisor**.

## Features

- **Policy Generator** — 16 NIST RMF-aligned policies across GOVERN/MAP/MEASURE/MANAGE
- **AI Advisor** — Claude-powered governance advisor (optional, requires API key)
- **Gap Analysis** — Assess controls with maturity scoring
- **PDF Reports** — Professional governance reports with cover page, TOC, RACI matrix
- **Regulatory Alerts** — EU AI Act, HIPAA, NYC Law 144, Colorado AI Act
- **Evidence Vault** — Upload and tag compliance documents
- **Task Board** — Kanban-style task management
- **Monitoring Plans** — Auto-generated metrics and thresholds
- **Industry Support** — Healthcare, Finance, Education, Government, Wellness, Business

## Tech Stack

- **Frontend**: Next.js 14 (static export) + TailwindCSS
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL (Supabase)
- **AI**: Claude API via @anthropic-ai/sdk (optional)
- **PDF**: PDFKit
- **Deploy**: Railway

## Quick Deploy: Railway + Supabase

### Step 1: Create Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **Settings → Database → Connection string → URI**
3. Copy the connection string (replace `[YOUR-PASSWORD]` with your DB password)

### Step 2: Deploy to Railway

1. Push this code to a GitHub repo
2. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub**
3. Select your repo
4. Go to **Variables** tab and add:

```
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
JWT_SECRET=<run: openssl rand -base64 48>
NODE_ENV=production
FRONTEND_URL=https://your-app.up.railway.app
ANTHROPIC_API_KEY=sk-ant-api03-...  (optional)
```

5. Railway will auto-detect the `nixpacks.toml` and build

### Step 3: Run Database Setup

After the first deploy, open the Railway **shell** and run:

```bash
npm run db:migrate && npm run db:seed
```

### Step 4: Done!

Visit your Railway URL. Login with:
- **Email**: test@demo.com
- **Password**: Test1234!

## Local Development

```bash
# 1. Clone
git clone <your-repo> && cd nist-ai-rmf-policy-builder

# 2. Install
cd backend && npm install && cd ../frontend && npm install && cd ..

# 3. Set up Supabase (or local PostgreSQL)
cp .env.example backend/.env
# Edit backend/.env with your DATABASE_URL

# 4. Migrate & seed
cd backend && node src/utils/migrate.js && node src/seeds/seed.js && cd ..

# 5. Run
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev

# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Supabase PostgreSQL connection string |
| `JWT_SECRET` | Yes | Random string for JWT signing |
| `NODE_ENV` | Yes | `production` for Railway |
| `PORT` | No | Default: 5000 |
| `FRONTEND_URL` | Yes | Your Railway app URL (for CORS) |
| `ANTHROPIC_API_KEY` | No | Enables AI Policy Advisor |

## Architecture

```
Railway (single service)
├── Express.js backend (port 5000)
│   ├── /api/* routes
│   ├── Serves frontend/out/ static files in production
│   └── Claude AI Advisor service
└── Next.js frontend (static export → served by Express)

Supabase (external)
└── PostgreSQL database (12 tables)
```

The frontend uses **relative URLs** in production — no need to set `NEXT_PUBLIC_API_URL`. The Express server serves both the API and the static frontend from the same domain.

## Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| test@demo.com | Test1234! | Admin |
| auditor@demo.com | Auditor1234! | Auditor |
