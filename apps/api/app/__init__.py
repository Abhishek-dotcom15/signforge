import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from repo root (two levels up from apps/api/app/)
_root_env = Path(__file__).resolve().parent.parent.parent.parent / ".env"
load_dotenv(_root_env)
# Also load local .env if it exists in apps/api/
load_dotenv()
if os.getenv("DATABASE_URL", "").strip().startswith("sqlite"):
    from . import sqlite_compat  # noqa: F401 — SQLite JSONB/UUID compatibility

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .config import Config
from .extensions import db, migrate, redis_client, limiter
from .routes import register_blueprints
from .middleware import register_error_handlers
from .logging_config import configure_logging
from .middleware.request_logging import register_request_logging
from .middleware.security_headers import register_security_headers
from .monitoring import init_sentry


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Error tracking (must be early to capture init errors)
    init_sentry(app)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # CORS — reads allowed origins from CORS_ORIGINS env var (comma-separated),
    # defaults to ["http://localhost:3000"] via Config class.
    cors_origins = app.config.get("CORS_ORIGINS", ["http://localhost:3000"])
    CORS(app, origins=cors_origins)

    jwt = JWTManager(app)

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        if redis_client is None:
            return False
        jti = jwt_payload["jti"]
        try:
            token_in_redis = redis_client.get(f"blocklist:{jti}")
            return token_in_redis is not None
        except Exception:
            return False

    # Rate limiter — uses shared instance from extensions so routes can import it
    storage_uri = "memory://" if redis_client is None else app.config.get("REDIS_URL", "redis://localhost:6379/0")
    app.config["RATELIMIT_STORAGE_URI"] = storage_uri
    app.config.setdefault("RATELIMIT_DEFAULT", "200 per minute")
    limiter.init_app(app)

    # Register blueprints
    register_blueprints(app)

    # Register error handlers
    register_error_handlers(app)

    # Security headers
    register_security_headers(app)

    # Logging & monitoring
    configure_logging(app)
    register_request_logging(app)

    # Health check
    @app.route("/health")
    def health():
        checks = {"api": "healthy"}
        try:
            db.session.execute(db.text("SELECT 1"))
            checks["database"] = "healthy"
        except Exception:
            checks["database"] = "unhealthy"
        try:
            if redis_client is not None:
                redis_client.ping()
                checks["redis"] = "healthy"
            else:
                checks["redis"] = "unavailable"
        except Exception:
            checks["redis"] = "unhealthy"

        # "unavailable" means intentionally skipped (SKIP_REDIS=1), not a failure
        required = {k: v for k, v in checks.items() if v != "unavailable"}
        overall = "healthy" if all(v == "healthy" for v in required.values()) else "degraded"
        status_code = 200 if overall == "healthy" else 503
        return {"status": overall, "service": "signforge-api", "checks": checks}, status_code

    return app
