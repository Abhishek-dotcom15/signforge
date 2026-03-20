# SignForge Deployment Guide

## Table of Contents

- [Local Development Setup](#local-development-setup)
- [Docker Development](#docker-development)
- [Production Docker Deployment](#production-docker-deployment)
- [AWS Deployment](#aws-deployment)
- [Vercel Deployment (Frontend)](#vercel-deployment-frontend)
- [Database Migrations](#database-migrations)
- [Monitoring & Logging](#monitoring--logging)
- [Security Checklist](#security-checklist)
- [Commands Reference](#commands-reference)
- [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| pnpm | 9+ | `npm i -g pnpm` or `corepack enable` |
| Python | 3.12+ | [python.org](https://python.org) |
| Docker | 24+ (optional) | [docker.com](https://docker.com) — used for PostgreSQL, Redis, Meilisearch |

Docker is optional if you have PostgreSQL 16, Redis 7, and Meilisearch running natively.

### Automated Setup

```bash
# Linux / macOS
bash scripts/setup.sh

# Windows PowerShell
powershell scripts/setup.ps1
```

The setup script handles everything below automatically. For manual control, follow the steps below.

### Step-by-Step Manual Setup

**1. Clone and install dependencies**

```bash
git clone https://github.com/your-org/signforge.git
cd signforge

# Install frontend dependencies (from repo root)
pnpm install

# Install backend dependencies
cd apps/api
pip install -r requirements.txt
cd ../..
```

**2. Configure environment variables**

```bash
cp .env.example .env
# Edit .env — defaults work for local development with Docker infrastructure
```

Key defaults in `.env.example`:
- `DATABASE_URL=postgresql://signforge:signforge@localhost:5432/signforge`
- `REDIS_URL=redis://localhost:6379/0`
- `VITE_API_URL=http://localhost:5000/api`
- `SECRET_KEY=change-me-in-production` (fine for local dev)

**3. Start infrastructure services (Docker)**

```bash
docker compose up -d postgres redis meilisearch
```

Wait a few seconds for health checks to pass. Verify:

```bash
docker compose ps
```

**4. Initialize the database**

```bash
cd apps/api

# Option A: Alembic migrations (if migrations exist)
FLASK_APP=wsgi.py flask db upgrade

# Option B: Create tables directly
python -c "from app import create_app; from app.extensions import db; app = create_app(); app.app_context().__enter__(); db.create_all()"

cd ../..
```

**5. Seed demo data**

```bash
cd apps/api
python -m app.seed
cd ../..
```

**6. Start the servers**

```bash
# Terminal 1 — Backend (Flask on port 5000)
cd apps/api
FLASK_APP=wsgi.py flask run --port 5000

# Terminal 2 — Frontend (Vite on port 3000)
pnpm --filter web dev
```

On Windows (PowerShell), set the env var differently:

```powershell
cd apps/api
$env:FLASK_APP = "wsgi.py"
flask run --port 5000
```

**7. Open the app**

- Frontend: http://localhost:3000
- API: http://localhost:5000/health

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@signforge.dev | admin123 |
| Learner | demo@signforge.dev | demo1234 |
| Teacher | teacher@signforge.dev | teach123 |

### Run Tests

```bash
# Backend tests (28 tests)
cd apps/api && python -m pytest tests/ -v

# Frontend build check
pnpm --filter web build
```

---

## Docker Development

The `docker-compose.override.yml` is loaded automatically and configures dev mode with hot reload.

### Start All Services

```bash
docker compose up -d
```

This starts: PostgreSQL, Redis, Meilisearch, API (Flask dev server), and Web (Vite dev server).

### Access Services

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | http://localhost:3000 | Vite HMR via override |
| API | http://localhost:5000 | Flask debug mode, auto-reload |
| PostgreSQL | localhost:5432 | User: signforge / Pass: signforge |
| Redis | localhost:6379 | No auth in dev |
| Meilisearch | http://localhost:7700 | Key: masterKey |

### Hot Reload Behavior

The override mounts source directories as volumes:
- `./apps/api` → `/app` in the API container — Flask reloads on Python file changes
- `./apps/web` → `/app` in the Web container (with `node_modules` excluded) — Vite HMR on save
- The override sets `FLASK_DEBUG=1` and runs `python wsgi.py` instead of Gunicorn

### Useful Commands

```bash
# View logs
docker compose logs -f api
docker compose logs -f web

# Restart a single service
docker compose restart api

# Rebuild after Dockerfile or dependency changes
docker compose up -d --build api

# Run database seed inside the container
docker compose exec api python -m app.seed

# Run backend tests inside the container
docker compose exec api python -m pytest tests/ -v

# Stop everything
docker compose down

# Stop and destroy volumes (resets database)
docker compose down -v
```

---

## Production Docker Deployment

Production uses only `docker-compose.yml` (no override). The API runs via Gunicorn and the frontend is served by Nginx from a static build.

### 1. Configure Environment

```bash
cp .env.production.example .env
```

Generate required secrets:

```bash
# SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(48))"

# JWT_SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(48))"

# POSTGRES_PASSWORD
python -c "import secrets; print(secrets.token_urlsafe(24))"

# MEILISEARCH_API_KEY
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Update `DATABASE_URL` in `.env` to use the generated `POSTGRES_PASSWORD`.

### 2. Build and Start

```bash
# Build production images and start (skip override)
docker compose -f docker-compose.yml up -d --build

# Run database migrations
docker compose exec api flask db upgrade

# Seed initial data (optional)
docker compose exec api python -c "
from app.seed import seed_all
from app import create_app
app = create_app()
seed_all(app)
"

# Verify health
curl http://localhost:5000/health
```

### 3. Production Services

| Service | Port | Runtime |
|---------|------|---------|
| API | 5000 | Gunicorn (4 workers, 2 threads each) |
| Web | 80 (configurable via WEB_PORT) | Nginx serving static files on port 8080 internally |
| Worker | — | Celery (2 concurrency) |
| PostgreSQL | 5432 | postgres:16-alpine |
| Redis | 6379 | redis:7-alpine (256MB max) |
| Meilisearch | 7700 | v1.6 |

### 4. Resource Limits

Defined in `docker-compose.yml`:
- API: 512MB RAM, 1 CPU
- Worker: 256MB RAM, 0.5 CPU
- Web: 128MB RAM, 0.25 CPU

### 5. SSL / Reverse Proxy

In production, place Nginx or a load balancer in front to terminate TLS. Example Nginx config:

```nginx
server {
    listen 443 ssl http2;
    server_name signforge.yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/signforge.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/signforge.yourdomain.com/privkey.pem;

    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        proxy_pass http://localhost:5000/health;
    }

    location / {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Set up with Let's Encrypt:

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
# Place config in /etc/nginx/sites-available/signforge
sudo ln -s /etc/nginx/sites-available/signforge /etc/nginx/sites-enabled/
sudo certbot --nginx -d signforge.yourdomain.com
sudo systemctl reload nginx
```

### Key Production Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SECRET_KEY` | Yes | Flask secret key (48+ chars, random) |
| `JWT_SECRET_KEY` | Yes | JWT signing key (48+ chars, random) |
| `POSTGRES_PASSWORD` | Yes | Database password |
| `DATABASE_URL` | Yes | `postgresql://signforge:<password>@postgres:5432/signforge` |
| `REDIS_URL` | Yes | `redis://redis:6379/0` |
| `CORS_ORIGINS` | Yes | Your frontend domain(s), comma-separated |
| `MEILISEARCH_API_KEY` | Yes | Random key for search engine |
| `FLASK_ENV` | Yes | Must be `production` |
| `VITE_API_URL` | Yes | `/api` (set at build time) |
| `SENTRY_DSN` | No | Error tracking |
| `AWS_ACCESS_KEY_ID` | No | S3 file storage |

---

## AWS Deployment

### Recommended Architecture (ECS Fargate)

```
CloudFront CDN
    ├── S3 (static frontend assets)
    └── ALB (Application Load Balancer)
          ├── /api/* → ECS Fargate (API service, port 5000)
          └── /* → ECS Fargate (Web service, port 8080)

RDS PostgreSQL 16 (db.t3.medium, encrypted, 7-day backups)
ElastiCache Redis 7 (cache.t3.micro)
S3 Bucket (user uploads, SiGML files)
Secrets Manager (SECRET_KEY, JWT_SECRET_KEY, DATABASE_URL)
```

### 1. Create Infrastructure

```bash
# ECR repositories
aws ecr create-repository --repository-name signforge/api
aws ecr create-repository --repository-name signforge/web

# RDS PostgreSQL
aws rds create-db-instance \
  --db-instance-identifier signforge-db \
  --db-instance-class db.t3.medium \
  --engine postgres --engine-version 16 \
  --master-username signforge \
  --master-user-password "$POSTGRES_PASSWORD" \
  --allocated-storage 20 --storage-encrypted \
  --backup-retention-period 7

# ElastiCache Redis
aws elasticache create-cache-cluster \
  --cache-cluster-id signforge-cache \
  --cache-node-type cache.t3.micro \
  --engine redis --num-cache-nodes 1
```

### 2. Push Docker Images

```bash
REGION=ap-south-1
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_BASE=$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Login to ECR
aws ecr get-login-password --region $REGION | \
  docker login --username AWS --password-stdin $ECR_BASE

# Build and push API
docker build -t signforge/api ./apps/api
docker tag signforge/api:latest $ECR_BASE/signforge/api:latest
docker push $ECR_BASE/signforge/api:latest

# Build and push Web
docker build -t signforge/web ./apps/web --build-arg VITE_API_URL=/api
docker tag signforge/web:latest $ECR_BASE/signforge/web:latest
docker push $ECR_BASE/signforge/web:latest
```

### 3. Store Secrets

```bash
aws secretsmanager create-secret \
  --name signforge/production \
  --secret-string '{
    "SECRET_KEY": "...",
    "JWT_SECRET_KEY": "...",
    "DATABASE_URL": "postgresql://signforge:pass@rds-endpoint:5432/signforge",
    "REDIS_URL": "redis://elasticache-endpoint:6379/0"
  }'
```

### 4. ECS Service Setup

- Create an ECS cluster (Fargate)
- Create task definitions referencing your ECR images and Secrets Manager ARNs
- Create services for API (desired count: 2) and Web (desired count: 2)
- Attach to an ALB with HTTPS listener (ACM certificate)
- Route `/api/*` to API target group (port 5000), `/*` to Web target group (port 8080)

### 5. S3 + CloudFront (Optional)

For serving the frontend via CDN instead of ECS:

```bash
# Create S3 bucket for static assets
aws s3 mb s3://signforge-frontend --region ap-south-1

# Build and upload frontend
cd apps/web && pnpm build
aws s3 sync dist/ s3://signforge-frontend/ --delete

# Create CloudFront distribution pointing to the S3 bucket
# Configure origin for /api/* to point to the ALB
```

### Key AWS Environment Variables

Set these in ECS task definitions or Secrets Manager:

- `DATABASE_URL` — RDS endpoint
- `REDIS_URL` — ElastiCache endpoint
- `SECRET_KEY`, `JWT_SECRET_KEY` — from Secrets Manager
- `CORS_ORIGINS` — your CloudFront or custom domain
- `S3_BUCKET` — for user uploads
- `CDN_URL` — CloudFront distribution URL
- `SENTRY_DSN` — error tracking

### Alternative: EC2 with Docker Compose

For simpler deployments, launch a `t3.medium+` EC2 instance (Ubuntu 22.04), install Docker, clone the repo, and follow the [Production Docker Deployment](#production-docker-deployment) steps above. Add Nginx + Let's Encrypt for TLS.

---

## Vercel Deployment (Frontend)

Vercel deploys the React frontend as a static site. The API backend must be hosted separately (Docker, AWS, etc.).

### Build Settings

| Setting | Value |
|---------|-------|
| Framework | Vite |
| Build Command | `pnpm build` |
| Output Directory | `dist` |
| Install Command | `corepack enable && pnpm install` |
| Root Directory | `apps/web` |

These are already configured in `apps/web/vercel.json`.

### Environment Variables

Set in Vercel Dashboard > Project Settings > Environment Variables:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://api.signforge.yourdomain.com` or `/api` if using Vercel rewrites |
| `VITE_SENTRY_DSN` | (optional) Sentry DSN for frontend error tracking |

### Deploy

```bash
npm i -g vercel
vercel login

# From apps/web directory
cd apps/web

# Preview deploy
vercel

# Production deploy
vercel --prod

# Custom domain
vercel domains add signforge.yourdomain.com
```

### API Proxy

The `vercel.json` includes a rewrite rule that proxies `/api/:path*` to `https://api.signforge.in/api/:path*`. Update the destination to match your API host. This lets the frontend use `VITE_API_URL=/api` to avoid CORS issues.

### Important Notes

- `VITE_API_URL` is baked into the build at build time — changing it requires a rebuild
- The `vercel.json` SPA rewrite sends all non-asset routes to `index.html`
- Static assets under `/assets/` are cached with `max-age=31536000, immutable`
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy) are set automatically

---

## Database Migrations

```bash
# Generate a new migration after model changes
cd apps/api
FLASK_APP=wsgi.py flask db migrate -m "description of changes"

# Apply migrations
FLASK_APP=wsgi.py flask db upgrade

# Rollback one migration
FLASK_APP=wsgi.py flask db downgrade

# View migration history
FLASK_APP=wsgi.py flask db history

# Docker equivalent
docker compose exec api flask db upgrade
```

---

## Monitoring & Logging

### Health Checks

- **API:** `GET /health` — returns database and Redis connectivity status
- **Web:** `GET /health` — Nginx static response (Docker only)

```bash
curl -s http://localhost:5000/health | python -m json.tool
```

```json
{
  "status": "healthy",
  "service": "signforge-api",
  "checks": {
    "api": "healthy",
    "database": "healthy",
    "redis": "healthy"
  }
}
```

### Structured Logging

The API produces JSON-formatted logs in production:

```json
{
  "timestamp": "2026-03-10T12:00:00.000Z",
  "level": "INFO",
  "message": "request completed",
  "request_id": "abc-123",
  "method": "GET",
  "path": "/api/signs",
  "status": 200,
  "duration_ms": 45.2
}
```

### Sentry Integration

Set `SENTRY_DSN` (backend) and `VITE_SENTRY_DSN` (frontend) environment variables to enable error tracking.

### Recommended External Monitoring

- **Uptime:** UptimeRobot or Better Uptime on `/health`
- **APM:** Sentry or Datadog
- **Metrics:** Prometheus + Grafana
- **Logs:** AWS CloudWatch, Datadog, or Grafana Loki

---

## Security Checklist

Before going to production:

- [ ] All secrets rotated from defaults (`SECRET_KEY`, `JWT_SECRET_KEY`, DB password)
- [ ] `FLASK_ENV=production` (disables debug mode)
- [ ] `FLASK_DEBUG` is NOT set or is `0`
- [ ] HTTPS configured (TLS termination at load balancer or Nginx)
- [ ] `CORS_ORIGINS` set to actual frontend domain(s) only
- [ ] Database connections use SSL (`?sslmode=require` in `DATABASE_URL`)
- [ ] Redis protected with password or VPC networking
- [ ] Rate limiting enabled (default: 200 req/min per IP)
- [ ] JWT expiry is reasonable (15min access, 7 day refresh)
- [ ] Docker images run as non-root user (already configured in Dockerfiles)
- [ ] Security headers configured (CSP, HSTS, X-Frame-Options)
- [ ] No `.env` files committed to git
- [ ] Database backups configured
- [ ] Log level set to `info` (not `debug`)

---

## Commands Reference

### Local Development

```bash
# Setup
cp .env.example .env                              # Create env file
pnpm install                                       # Install frontend deps
cd apps/api && pip install -r requirements.txt     # Install backend deps

# Database
cd apps/api
python -c "from app import create_app; from app.extensions import db; app = create_app(); app.app_context().__enter__(); db.create_all()"
python -m app.seed                                 # Seed demo data
FLASK_APP=wsgi.py flask db upgrade                 # Run migrations
FLASK_APP=wsgi.py flask db migrate -m "msg"        # Generate migration

# Run servers
cd apps/api && FLASK_APP=wsgi.py flask run --port 5000   # Backend
pnpm --filter web dev                                     # Frontend

# Tests
cd apps/api && python -m pytest tests/ -v          # Backend tests
pnpm --filter web build                            # Frontend build check
```

### Docker Development

```bash
docker compose up -d                               # Start all (with override)
docker compose up -d postgres redis meilisearch    # Start infra only
docker compose logs -f api                         # Follow API logs
docker compose exec api python -m app.seed         # Seed database
docker compose exec api python -m pytest tests/ -v # Run tests
docker compose restart api                         # Restart service
docker compose down                                # Stop all
docker compose down -v                             # Stop + delete volumes
```

### Docker Production

```bash
docker compose -f docker-compose.yml up -d --build  # Build + start (no override)
docker compose -f docker-compose.yml build           # Build only
docker compose exec api flask db upgrade             # Run migrations
docker compose up -d --scale worker=3                # Scale Celery workers
docker stats                                         # Monitor resources
```

### Vercel

```bash
cd apps/web
vercel                                              # Preview deploy
vercel --prod                                       # Production deploy
vercel domains add yourdomain.com                   # Custom domain
```

---

## Troubleshooting

### API won't start

```bash
docker compose logs api
# Common causes:
# - DATABASE_URL not set or wrong password
# - Redis not reachable
# - Missing SECRET_KEY or JWT_SECRET_KEY (required, no default in production compose)
```

### Database connection refused

```bash
docker compose ps postgres
docker compose logs postgres
docker compose exec postgres psql -U signforge -d signforge -c "SELECT 1"
```

### Frontend shows blank page

```bash
docker compose logs web
docker compose exec web ls /usr/share/nginx/html
# Common cause: VITE_API_URL not set at build time — rebuild with:
docker compose build --no-cache web
```

### Token refresh loop

- Check that API and frontend clocks are synchronized
- Verify `JWT_ACCESS_TOKEN_EXPIRES` and `JWT_REFRESH_TOKEN_EXPIRES` are set
- Check Redis connectivity (used for token blocklist)

### High memory usage

```bash
docker stats --no-stream
# Reduce Gunicorn workers by setting WEB_CONCURRENCY env var
# Default: cpu_count * 2 + 1
```

### Port conflicts

```bash
# Change ports via .env:
API_PORT=5001
WEB_PORT=3001
POSTGRES_PORT=5433
```
