# SignForge Deployment Guide

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [AWS Deployment](#aws-deployment)
- [Vercel Deployment (Frontend)](#vercel-deployment-frontend)
- [Database Migrations](#database-migrations)
- [Monitoring & Logging](#monitoring--logging)
- [Security Checklist](#security-checklist)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Docker 24+ and Docker Compose v2
- Node.js 20+ with pnpm 9+
- Python 3.12+
- PostgreSQL 16+
- Redis 7+

---

## Environment Variables

Copy `.env.production.example` to `.env` and fill in all required values:

```bash
cp .env.production.example .env
```

**Generate secrets:**

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

**Required variables:**

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Flask secret key (random, 48+ chars) |
| `JWT_SECRET_KEY` | JWT signing key (random, 48+ chars) |
| `POSTGRES_PASSWORD` | Database password |
| `DATABASE_URL` | Full PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `CORS_ORIGINS` | Allowed frontend origins (comma-separated) |
| `MEILISEARCH_API_KEY` | Search engine API key |

---

## Docker Deployment

### Quick Start (Production)

```bash
# 1. Clone and configure
git clone https://github.com/your-org/signforge.git
cd signforge
cp .env.production.example .env
# Edit .env with production values

# 2. Build and start all services
docker compose -f docker-compose.yml up -d --build

# 3. Run database migrations
docker compose exec api flask db upgrade

# 4. Seed initial data (optional)
docker compose exec api python -c "from app.seed import seed_all; from app import create_app; app = create_app(); seed_all(app)"

# 5. Verify health
curl http://localhost:5000/health
curl http://localhost:3000/health
```

### Local Development

```bash
# docker-compose.override.yml is loaded automatically
docker compose up -d

# API at http://localhost:5000 (hot reload)
# Web at http://localhost:3000 (Vite HMR)
```

### Service Management

```bash
# View logs
docker compose logs -f api
docker compose logs -f web

# Restart a service
docker compose restart api

# Scale workers
docker compose up -d --scale worker=3

# Stop everything
docker compose down

# Stop and remove volumes (destructive)
docker compose down -v
```

### Image Build Only

```bash
# Build without running
docker compose build

# Build specific service
docker compose build api
docker compose build web

# Build with no cache
docker compose build --no-cache api
```

---

## AWS Deployment

### Option A: ECS Fargate (Recommended)

**Architecture:** ALB → ECS Fargate (API + Web) → RDS PostgreSQL + ElastiCache Redis

#### 1. Infrastructure Setup

```bash
# Create ECR repositories
aws ecr create-repository --repository-name signforge/api
aws ecr create-repository --repository-name signforge/web

# Create RDS PostgreSQL
aws rds create-db-instance \
  --db-instance-identifier signforge-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 16 \
  --master-username signforge \
  --master-user-password "$POSTGRES_PASSWORD" \
  --allocated-storage 20 \
  --storage-encrypted \
  --backup-retention-period 7

# Create ElastiCache Redis
aws elasticache create-cache-cluster \
  --cache-cluster-id signforge-cache \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1
```

#### 2. Push Docker Images

```bash
# Login to ECR
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com

# Build and push API
docker build -t signforge/api ./apps/api
docker tag signforge/api:latest <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/signforge/api:latest
docker push <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/signforge/api:latest

# Build and push Web
docker build -t signforge/web ./apps/web --build-arg VITE_API_URL=/api
docker tag signforge/web:latest <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/signforge/web:latest
docker push <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/signforge/web:latest
```

#### 3. ECS Task Definition

Create `ecs-task-def.json` with your container definitions pointing to the ECR images. Set environment variables via AWS Secrets Manager:

```bash
# Store secrets in AWS Secrets Manager
aws secretsmanager create-secret \
  --name signforge/production \
  --secret-string '{
    "SECRET_KEY": "...",
    "JWT_SECRET_KEY": "...",
    "DATABASE_URL": "postgresql://...",
    "REDIS_URL": "redis://..."
  }'
```

#### 4. ALB + HTTPS

- Create an ALB with HTTPS listener (ACM certificate)
- Route `/api/*` → API target group (port 5000)
- Route `/*` → Web target group (port 8080)

### Option B: EC2 with Docker Compose

```bash
# 1. Launch EC2 instance (Ubuntu 22.04, t3.medium+)
# 2. Install Docker
sudo apt update && sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker ubuntu

# 3. Clone and deploy
git clone https://github.com/your-org/signforge.git
cd signforge
cp .env.production.example .env
# Edit .env

# 4. Start services
docker compose -f docker-compose.yml up -d --build

# 5. Set up Nginx reverse proxy with Let's Encrypt
sudo apt install -y nginx certbot python3-certbot-nginx
```

**Nginx site config (`/etc/nginx/sites-available/signforge`):**

```nginx
server {
    server_name signforge.yourdomain.com;

    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Request-ID $request_id;
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

```bash
# Enable site and get SSL
sudo ln -s /etc/nginx/sites-available/signforge /etc/nginx/sites-enabled/
sudo certbot --nginx -d signforge.yourdomain.com
sudo systemctl reload nginx
```

---

## Vercel Deployment (Frontend)

Vercel deploys the React frontend as a static site. The API must be hosted separately.

### 1. Project Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login
```

### 2. Create `vercel.json`

Already included at `apps/web/vercel.json`. Key settings:
- Build command: `pnpm build`
- Output directory: `dist`
- SPA rewrites (all routes → `index.html`)
- API proxy rewrites (`/api/*` → your backend URL)

### 3. Configure Environment Variables

In Vercel dashboard → Project Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://api.signforge.yourdomain.com` (or `/api` if using rewrites) |

### 4. Deploy

```bash
# From apps/web directory
cd apps/web

# Preview deploy
vercel

# Production deploy
vercel --prod
```

### 5. Custom Domain

```bash
vercel domains add signforge.yourdomain.com
```

### 6. API Proxy via Vercel Rewrites

The `vercel.json` includes a rewrite rule that proxies `/api/:path*` to your backend. Set `API_BACKEND_URL` in Vercel environment variables to your API host.

---

## Database Migrations

```bash
# Generate a new migration after model changes
docker compose exec api flask db migrate -m "description of changes"

# Apply migrations
docker compose exec api flask db upgrade

# Rollback one migration
docker compose exec api flask db downgrade

# View migration history
docker compose exec api flask db history
```

---

## Monitoring & Logging

### Structured Logging

The API uses JSON-formatted structured logs in production:

```json
{
  "timestamp": "2026-03-06T12:00:00.000Z",
  "level": "INFO",
  "logger": "app.middleware.request_logging",
  "message": "request completed",
  "request_id": "abc-123",
  "method": "GET",
  "path": "/api/signs",
  "status": 200,
  "duration_ms": 45.2
}
```

### Health Checks

- **API:** `GET /health` — returns database and Redis status
- **Web:** `GET /health` — nginx static response

```bash
# Check API health with dependency status
curl -s http://localhost:5000/health | python -m json.tool
```

Response:
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

### Docker Container Monitoring

```bash
# Resource usage
docker stats

# Container health status
docker compose ps

# Follow logs with timestamps
docker compose logs -f --timestamps api
```

### External Monitoring (Recommended)

- **Uptime:** UptimeRobot or Better Uptime — monitor `/health` endpoints
- **APM:** Sentry (error tracking, see below) or Datadog
- **Metrics:** Prometheus + Grafana via `prometheus-flask-instrumentator`
- **Log aggregation:** AWS CloudWatch, Datadog, or Grafana Loki

### Sentry Integration

Error tracking is pre-configured. Set `SENTRY_DSN` environment variable:

```bash
# API (Python)
SENTRY_DSN=https://your-key@sentry.io/project-id

# Web (JavaScript)
VITE_SENTRY_DSN=https://your-key@sentry.io/project-id
```

---

## Security Checklist

Before going to production, verify:

- [ ] All secrets rotated from defaults (`SECRET_KEY`, `JWT_SECRET_KEY`, DB password)
- [ ] `FLASK_ENV=production` (disables debug mode)
- [ ] `FLASK_DEBUG` is NOT set or is `0`
- [ ] HTTPS configured (TLS termination at load balancer or nginx)
- [ ] `CORS_ORIGINS` set to your actual frontend domain(s)
- [ ] Database connections use SSL (`?sslmode=require` in DATABASE_URL)
- [ ] Redis protected with password or VPC networking
- [ ] Rate limiting enabled (default: 200 req/min per IP)
- [ ] JWT expiry is reasonable (15min access, 7 day refresh)
- [ ] Docker images run as non-root user
- [ ] Security headers configured (CSP, HSTS, X-Frame-Options)
- [ ] No `.env` files committed to git
- [ ] Database backups configured
- [ ] Log level set to `info` (not `debug`)

---

## Troubleshooting

### API won't start

```bash
# Check logs
docker compose logs api

# Common issues:
# - DATABASE_URL not set or wrong password
# - Redis not reachable
# - Missing SECRET_KEY or JWT_SECRET_KEY
```

### Database connection refused

```bash
# Check if postgres is healthy
docker compose ps postgres
docker compose logs postgres

# Test connection
docker compose exec postgres psql -U signforge -d signforge -c "SELECT 1"
```

### Frontend shows blank page

```bash
# Check if nginx is serving files
docker compose exec web ls /usr/share/nginx/html

# Check nginx logs
docker compose logs web

# Common issue: VITE_API_URL not set at build time
# Rebuild with: docker compose build --no-cache web
```

### Token refresh loop

- Check that API and Web clocks are synchronized
- Verify `JWT_ACCESS_TOKEN_EXPIRES` and `JWT_REFRESH_TOKEN_EXPIRES` are set
- Check Redis connectivity (token blocklist)

### High memory usage

```bash
# Check per-container usage
docker stats --no-stream

# Reduce Gunicorn workers
# Edit WEB_CONCURRENCY env var (default: cpu_count * 2 + 1)
```
