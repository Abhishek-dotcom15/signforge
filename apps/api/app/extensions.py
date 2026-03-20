from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import redis
import os

db = SQLAlchemy()
migrate = Migrate()
limiter = Limiter(key_func=get_remote_address)

# Use in-memory limiter when Redis not available (no Docker)
_redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
if _redis_url.startswith("memory://") or os.getenv("SKIP_REDIS", "").lower() in ("1", "true", "yes"):
    redis_client = None  # Optional Redis for JWT blocklist; limiter uses memory://
else:
    try:
        redis_client = redis.from_url(_redis_url, decode_responses=True)
    except Exception:
        redis_client = None
