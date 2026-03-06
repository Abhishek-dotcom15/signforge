"""
Production-specific configuration.

Import this in production by setting:
  FLASK_CONFIG=app.config_production.ProductionConfig
Or use it directly in create_app().
"""

import os
from .config import Config


class ProductionConfig(Config):
    """Production configuration with hardened defaults."""

    # Disable debug
    DEBUG = False
    TESTING = False

    # Require secrets to be set
    SECRET_KEY = os.environ["SECRET_KEY"]
    JWT_SECRET_KEY = os.environ["JWT_SECRET_KEY"]

    # Database — enforce SSL in production
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_size": int(os.getenv("DB_POOL_SIZE", "20")),
        "pool_recycle": 300,
        "pool_pre_ping": True,
        "max_overflow": int(os.getenv("DB_MAX_OVERFLOW", "10")),
        "connect_args": {
            "options": "-c statement_timeout=30000",
        },
    }

    # Tighter rate limits
    RATELIMIT_DEFAULT = os.getenv("RATELIMIT_DEFAULT", "100 per minute")

    # Session cookie security
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"

    # Proxy headers (when behind a load balancer)
    PREFERRED_URL_SCHEME = "https"
