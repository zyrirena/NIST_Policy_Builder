# 🛡️ NIST AI RMF Policy Builder

A production-ready SaaS application that helps organizations create customized AI governance policies aligned with the **NIST AI Risk Management Framework**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-20+-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)

---

## 🎯 What This App Does

The NIST AI RMF Policy Builder allows organizations to:

1. **Register AI Systems** — Document AI systems with a guided wizard
2. **Generate Tailored Policies** — Aligned with GOVERN, MAP, MEASURE, MANAGE
3. **Run Gap Analysis** — Identify what controls are covered, missing, or need improvement
4. **Track Maturity** — Level 1→5 maturity scoring with improvement roadmaps
5. **Monitor Compliance** — Regulatory alerts for EU AI Act, HIPAA, NYC laws, etc.
6. **Generate PDF Reports** — Professional, downloadable governance reports
7. **Manage Evidence** — Upload and organize compliance documentation
8. **Collaborate** — Kanban task board with assignments and status tracking

---

## 🖥️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TailwindCSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| PDF Generation | PDFKit |
| Auth | JWT (JSON Web Tokens) |
| File Storage | Local (cloud-ready) |

---

## 🚀 Quick Start (Local Development)

### Prerequisites

Make sure you have installed:
- **Node.js 18+** — Download from [nodejs.org](https://nodejs.org)
- **PostgreSQL 14+** — Download from [postgresql.org](https://www.postgresql.org/download/)
- **Git** — Download from [git-scm.com](https://git-scm.com)

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/nist-ai-rmf-policy-builder.git
cd nist-ai-rmf-policy-builder
```

### Step 2: Create the Database

Open a terminal and run:

```bash
# On Mac/Linux:
psql -U postgres -c "CREATE DATABASE nist_rmf;"

# On Windows (in PostgreSQL shell):
CREATE DATABASE nist_rmf;
```

### Step 3: Configure Environment Variables

```bash
# Copy the example env file
cp .env.example backend/.env

# Edit backend/.env and set your database URL:
# DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/nist_rmf
```

### Step 4: Install Dependencies

```bash
# Install all dependencies (root + backend + frontend)
npm run install:all
```

### Step 5: Set Up the Database

```bash
# Run migrations (creates tables)
npm run db:migrate

# Seed test data (creates test user + demo data)
npm run db:seed
```

### Step 6: Start the App

```bash
# Start both backend and frontend
npm run dev
```

The app will be running at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

### Step 7: Log In

Use the test account:
- **Email:** `test@demo.com`
- **Password:** `Test1234!`

---

## 📦 Project Structure

```
nist-ai-rmf-policy-builder/
├── backend/
│   ├── src/
│   │   ├── index.js              # Express server entry point
│   │   ├── routes/
│   │   │   ├── auth.js           # Login, register, JWT
│   │   │   ├── organizations.js  # Org CRUD
│   │   │   ├── aiSystems.js      # AI system management
│   │   │   ├── policies.js       # Policy generation + PDF
│   │   │   └── data.js           # Gaps, alerts, tasks, docs, monitoring
│   │   ├── middleware/
│   │   │   └── auth.js           # JWT authentication
│   │   ├── services/
│   │   │   ├── policyEngine.js   # NIST RMF policy templates
│   │   │   └── pdfGenerator.js   # PDF report generation
│   │   ├── seeds/
│   │   │   └── seed.js           # Database seeder
│   │   └── utils/
│   │       ├── db.js             # PostgreSQL connection
│   │       └── migrate.js        # Database migrations
│   ├── uploads/                  # File upload storage
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js         # Root layout
│   │   │   ├── page.js           # Main SPA application
│   │   │   └── globals.css       # Pastel theme styles
│   │   └── lib/
│   │       └── api.js            # API client
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
├── .env.example
├── .gitignore
├── railway.json
├── nixpacks.toml
├── Procfile
├── package.json
└── README.md
```

---

## 🚂 Deploy to Railway (Step-by-Step)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit - NIST AI RMF Policy Builder"

# Create a repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/nist-ai-rmf-policy-builder.git
git branch -M main
git push -u origin main
```

### Step 2: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **"Login"** → Sign in with GitHub

### Step 3: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Select your `nist-ai-rmf-policy-builder` repository
4. Railway will auto-detect the project

### Step 4: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database" → "PostgreSQL"**
3. Railway will create a PostgreSQL instance
4. Click on the PostgreSQL service → **"Variables"** tab
5. Copy the `DATABASE_URL` value

### Step 5: Set Environment Variables

1. Click on your **main service** (the GitHub repo)
2. Go to **"Variables"** tab
3. Add these variables:

```
DATABASE_URL        = (paste from PostgreSQL service, or use ${{Postgres.DATABASE_URL}})
JWT_SECRET          = your-strong-secret-key-here
NODE_ENV            = production
PORT                = 5000
FRONTEND_URL        = https://your-app.up.railway.app
NEXT_PUBLIC_API_URL = https://your-app.up.railway.app
```

### Step 6: Configure Build

Railway should auto-detect the config. If not:
1. Go to **"Settings"** tab
2. Set **Build Command:** `cd frontend && npm install && npm run build && cd ../backend && npm install`
3. Set **Start Command:** `cd backend && npm run db:migrate && npm run db:seed && NODE_ENV=production node src/index.js`

### Step 7: Deploy

1. Click **"Deploy"** — Railway will build and deploy
2. Once deployed, click **"Generate Domain"** to get your URL
3. Update `FRONTEND_URL` and `NEXT_PUBLIC_API_URL` with your new domain

### Step 8: Test It

1. Open your Railway URL in a browser
2. Log in with `test@demo.com` / `Test1234!`
3. You're live! 🎉

---

## 📊 Features Overview

### 🔐 Authentication & Roles
- JWT-based secure authentication
- Three roles: Admin, User, Auditor
- Activity logging for all actions

### 🤖 AI System Intake Wizard
- Guided 4-step wizard to register AI systems
- Capture: name, use case, data types, risk level, deployment type
- Human-in-the-loop configuration

### 📚 NIST RMF Policy Engine
- Generates policies across all 4 NIST categories
- **GOVERN** — Governance structure, risk management, workforce
- **MAP** — Context, risk identification, impact assessment
- **MEASURE** — Assessment, evaluation, tracking, feedback
- **MANAGE** — Prioritization, treatment, incident response, improvement

### ⚖️ Industry-Specific Compliance
Tailored policies for:
- Healthcare (HIPAA, FDA)
- Finance (SR 11-7, ECOA, FCRA)
- Business (FTC, CCPA)
- Wellness, Education, Government

### 📊 Gap Analysis
- 16-question assessment across all 4 NIST categories
- Status: ✅ Covered, ⚠️ Needs Improvement, ❌ Missing
- Auto-calculates maturity scores

### 📈 Maturity Scoring (Level 1→5)
- Per-category and overall maturity scores
- Visual progress bars and improvement tracking

### 🚨 Regulatory Alerts
- Pre-seeded alerts for EU AI Act, HIPAA, NYC Law 144, Colorado AI Act
- Severity-based filtering and read tracking

### 📄 PDF Report Generation
Professional reports including:
- Executive summary
- AI system overview
- Risk assessment
- Policy recommendations (all 4 categories)
- Gap analysis summary
- Maturity assessment
- Action checklist
- RACI matrix
- Monitoring plan
- Regulatory alerts
- Cost/risk estimation

### 💰 Cost/Risk Estimation
- Estimated non-compliance costs
- Operational risk exposure assessment
- Recommended annual investment

### 📂 Evidence Vault
- File upload with tagging
- Link documents to controls
- Version tracking

### 👥 Task Board
- Kanban-style task management
- Priority levels and status tracking
- Assignment and collaboration

### 🔁 Continuous Monitoring Plans
- Auto-generated monitoring metrics
- Frequency, thresholds, and responsible parties
- Performance, drift, fairness, and safety metrics

---

## 🧪 Test Accounts

| Email | Password | Role |
|-------|----------|------|
| test@demo.com | Test1234! | Admin |
| auditor@demo.com | Auditor1234! | Auditor |

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/auth/me` | Current user |
| GET | `/api/organizations/mine` | Get my org |
| POST | `/api/organizations` | Create org |
| GET | `/api/ai-systems` | List AI systems |
| POST | `/api/ai-systems` | Create AI system |
| POST | `/api/policies/generate/:id` | Generate policies |
| GET | `/api/policies/:id` | Get policies |
| POST | `/api/policies/pdf/:id` | Generate PDF |
| GET | `/api/gap-analysis/:id` | Get gaps |
| POST | `/api/gap-analysis/:id` | Submit gaps |
| GET | `/api/dashboard` | Dashboard data |
| GET | `/api/alerts` | Regulatory alerts |
| GET/POST | `/api/tasks` | Tasks |
| POST | `/api/documents/upload` | Upload file |
| GET | `/api/documents` | List documents |
| GET | `/api/monitoring/:id` | Monitoring plans |
| GET | `/api/maturity/:id` | Maturity scores |
| GET | `/api/activity` | Activity log |

---

## 📝 License

MIT License — See LICENSE file for details.

---

## 🙏 Credits

- [NIST AI Risk Management Framework](https://airc.nist.gov/airmf-resources/playbook/)
- Built with Next.js, Express, PostgreSQL, and PDFKit
