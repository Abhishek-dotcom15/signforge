#!/bin/bash
set -e

echo "=== SignForge Local Setup ==="
echo ""

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed."; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "pnpm is required. Install: npm i -g pnpm"; exit 1; }
command -v python >/dev/null 2>&1 || { echo "Python 3.12+ is required."; exit 1; }

# Copy env file if not exists
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env from .env.example — edit it with your settings"
fi

# Start infrastructure services
echo ""
echo "Starting PostgreSQL, Redis, Meilisearch..."
docker compose up -d postgres redis meilisearch
echo "Waiting for services to be healthy..."
sleep 5

# Install Python dependencies
echo ""
echo "Installing Python dependencies..."
cd apps/api
pip install -r requirements.txt
cd ../..

# Install Node dependencies
echo ""
echo "Installing Node dependencies..."
pnpm install

# Initialize database
echo ""
echo "Initializing database..."
cd apps/api
FLASK_APP=wsgi.py python -m flask db upgrade 2>/dev/null || python -c "
from app import create_app
from app.extensions import db
app = create_app()
with app.app_context():
    db.create_all()
    print('Tables created via db.create_all()')
"

# Seed data
echo "Seeding demo data..."
python -m app.seed

cd ../..

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Start the application:"
echo "  Backend:  cd apps/api && FLASK_APP=wsgi.py flask run --port 5000"
echo "  Frontend: pnpm --filter web dev"
echo ""
echo "Demo accounts:"
echo "  Admin:   admin@signforge.dev / admin123"
echo "  Demo:    demo@signforge.dev / demo1234"
echo "  Teacher: teacher@signforge.dev / teach123"
