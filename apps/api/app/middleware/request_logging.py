import time
import uuid
import logging
from flask import request, g

logger = logging.getLogger(__name__)


def register_request_logging(app):
    """Add request ID tracking and performance logging."""

    @app.before_request
    def before_request():
        g.request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        g.start_time = time.perf_counter()

    @app.after_request
    def after_request(response):
        if hasattr(g, "start_time"):
            duration_ms = (time.perf_counter() - g.start_time) * 1000
            response.headers["X-Request-ID"] = getattr(g, "request_id", "")
            response.headers["X-Response-Time"] = f"{duration_ms:.2f}ms"

            logger.info(
                "request completed",
                extra={
                    "request_id": g.request_id,
                    "method": request.method,
                    "path": request.path,
                    "status": response.status_code,
                    "duration_ms": round(duration_ms, 2),
                    "remote_addr": request.remote_addr,
                    "user_agent": request.user_agent.string[:200],
                },
            )

            # Warn on slow requests
            if duration_ms > 1000:
                logger.warning(
                    "slow request detected: %s %s took %.0fms",
                    request.method,
                    request.path,
                    duration_ms,
                )

        return response
