import logging
import sys
import os
import json
from datetime import datetime, timezone


class JSONFormatter(logging.Formatter):
    """Structured JSON log formatter for production."""

    def format(self, record):
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        if record.exc_info and record.exc_info[0] is not None:
            log_entry["exception"] = self.formatException(record.exc_info)

        if hasattr(record, "request_id"):
            log_entry["request_id"] = record.request_id

        if hasattr(record, "user_id"):
            log_entry["user_id"] = record.user_id

        return json.dumps(log_entry)


def configure_logging(app):
    """Configure application logging based on environment."""
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    is_production = os.getenv("FLASK_ENV") == "production"

    # Clear default handlers
    root = logging.getLogger()
    root.handlers.clear()

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(getattr(logging, log_level))

    if is_production:
        handler.setFormatter(JSONFormatter())
    else:
        handler.setFormatter(logging.Formatter(
            "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
        ))

    root.addHandler(handler)
    root.setLevel(getattr(logging, log_level))

    # Quiet noisy libraries
    logging.getLogger("urllib3").setLevel(logging.WARNING)
    logging.getLogger("werkzeug").setLevel(logging.WARNING if is_production else logging.INFO)
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.WARNING if is_production else logging.INFO
    )

    app.logger.info("Logging configured: level=%s, format=%s", log_level, "json" if is_production else "text")
