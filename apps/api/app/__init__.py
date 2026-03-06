import os
from dotenv import load_dotenv
load_dotenv()
if os.getenv("DATABASE_URL", "").strip().startswith("sqlite"):
    from . import sqlite_compat  # noqa: F401 — SQLite JSONB/UUID compatibility

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from .config import Config
from .extensions import db, migrate, redis_client
from .routes import register_blueprints
from .middleware import register_error_handlers
from .logging_config import configure_logging
from .middleware.request_logging import register_request_logging
from .monitoring import init_sentry


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Error tracking (must be early to capture init errors)
    init_sentry(app)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, origins=app.config.get("CORS_ORIGINS", "*"))
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

    Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=["200 per minute"],
        storage_uri="memory://" if redis_client is None else app.config.get("REDIS_URL", "redis://localhost:6379/0"),
    )

    # Register blueprints
    register_blueprints(app)

    # Register error handlers
    register_error_handlers(app)

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

        overall = "healthy" if all(v == "healthy" for v in checks.values()) else "degraded"
        status_code = 200 if overall == "healthy" else 503
        return {"status": overall, "service": "signforge-api", "checks": checks}, status_code

    return app
