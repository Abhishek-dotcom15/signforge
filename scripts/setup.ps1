Write-Host "=== SignForge Local Setup ===" -ForegroundColor Cyan

# Check prerequisites
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker is required but not installed." -ForegroundColor Red; exit 1
}
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "pnpm is required. Install: npm i -g pnpm" -ForegroundColor Red; exit 1
}
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Python 3.12+ is required." -ForegroundColor Red; exit 1
}

# Copy env file if not exists
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "Created .env from .env.example"
}

# Start infrastructure
Write-Host "`nStarting PostgreSQL, Redis, Meilisearch..." -ForegroundColor Yellow
docker compose up -d postgres redis meilisearch
Start-Sleep -Seconds 5

# Install Python dependencies
Write-Host "`nInstalling Python dependencies..." -ForegroundColor Yellow
Push-Location apps/api
pip install -r requirements.txt
Pop-Location

# Install Node dependencies
Write-Host "`nInstalling Node dependencies..." -ForegroundColor Yellow
pnpm install

# Initialize database
Write-Host "`nInitializing database..." -ForegroundColor Yellow
Push-Location apps/api
$env:FLASK_APP = "wsgi.py"
try {
    flask db upgrade
} catch {
    python -c @"
from app import create_app
from app.extensions import db
app = create_app()
with app.app_context():
    db.create_all()
    print('Tables created via db.create_all()')
"@
}

# Seed data
Write-Host "Seeding demo data..." -ForegroundColor Yellow
python -m app.seed
Pop-Location

Write-Host "`n=== Setup Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Start the application:"
Write-Host "  Backend:  cd apps/api; `$env:FLASK_APP='wsgi.py'; flask run --port 5000"
Write-Host "  Frontend: pnpm --filter web dev"
Write-Host ""
Write-Host "Demo accounts:"
Write-Host "  Admin:   admin@signforge.dev / admin123"
Write-Host "  Demo:    demo@signforge.dev / demo1234"
Write-Host "  Teacher: teacher@signforge.dev / teach123"
