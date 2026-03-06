# SignForge

AI-powered Indian Sign Language (ISL) communication and developer platform.

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js >= 20 + pnpm 9
- Python >= 3.12

### Setup

```bash
# Clone and enter the project
cd signforge

# Run the setup script
# Linux/macOS:
bash scripts/setup.sh

# Windows PowerShell:
powershell scripts/setup.ps1
```

### Manual Setup

```bash
# 1. Start infrastructure
docker compose up -d postgres redis meilisearch

# 2. Install dependencies
pnpm install
cd apps/api && pip install -r requirements.txt && cd ../..

# 3. Initialize database
cd apps/api
python -c "from app import create_app; from app.extensions import db; app = create_app(); app.app_context().__enter__(); db.create_all()"
python -m app.seed
cd ../..
```

### Run

```bash
# Terminal 1 -- Backend (Flask API on port 5000)
cd apps/api
FLASK_APP=wsgi.py flask run --port 5000

# Terminal 2 -- Frontend (Vite dev server on port 3000)
pnpm --filter web dev
```

Open http://localhost:3000

### Demo Accounts

| Role    | Email                    | Password  |
|---------|--------------------------|-----------|
| Admin   | admin@signforge.dev      | admin123  |
| Learner | demo@signforge.dev       | demo1234  |
| Teacher | teacher@signforge.dev    | teach123  |

### Run Tests

```bash
# Backend tests
cd apps/api && python -m pytest tests/ -v

# Frontend build check
pnpm --filter web build
```

## Architecture

```
signforge/
├── apps/
│   ├── api/          Flask backend (12 blueprints, JWT auth)
│   └── web/          React 18 + TypeScript + Vite frontend
├── services/
│   └── translation/  FastAPI NLP translation microservice
├── packages/         Shared packages
├── infra/            Docker, K8s, Terraform configs
└── scripts/          Setup and utility scripts
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Radix UI, TanStack Query, Zustand
- **Backend**: Flask 3, SQLAlchemy 2, PostgreSQL 16, Redis 7, JWT auth
- **ML Services**: FastAPI, PyTorch, MediaPipe
- **Infrastructure**: Docker Compose, GitHub Actions CI
