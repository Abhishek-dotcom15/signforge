"""
Sentry error tracking and performance monitoring integration.

Initializes Sentry SDK when SENTRY_DSN environment variable is set.
Does nothing when SENTRY_DSN is absent (local development, tests).
"""

import os
import logging

logger = logging.getLogger(__name__)


def init_sentry(app):
    """Initialize Sentry error tracking if SENTRY_DSN is configured."""
    dsn = os.getenv("SENTRY_DSN")
    if not dsn:
        logger.info("SENTRY_DSN not set — error tracking disabled")
        return

    try:
        import sentry_sdk
        from sentry_sdk.integrations.flask import FlaskIntegration
        from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
        from sentry_sdk.integrations.celery import CeleryIntegration
        from sentry_sdk.integrations.redis import RedisIntegration

        sentry_sdk.init(
            dsn=dsn,
            integrations=[
                FlaskIntegration(transaction_style="url"),
                SqlalchemyIntegration(),
                CeleryIntegration(),
                RedisIntegration(),
            ],
            environment=os.getenv("FLASK_ENV", "production"),
            release=os.getenv("GIT_SHA", "unknown"),
            traces_sample_rate=float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.1")),
            profiles_sample_rate=float(os.getenv("SENTRY_PROFILES_SAMPLE_RATE", "0.1")),
            send_default_pii=False,
            before_send=_filter_events,
        )
        logger.info("Sentry initialized: env=%s", os.getenv("FLASK_ENV"))
    except ImportError:
        logger.warning("sentry-sdk not installed — error tracking disabled")


def _filter_events(event, hint):
    """Filter out noisy or sensitive events before sending to Sentry."""
    # Skip health check errors
    if event.get("request", {}).get("url", "").endswith("/health"):
        return None

    # Strip authorization headers
    headers = event.get("request", {}).get("headers", {})
    if "Authorization" in headers:
        headers["Authorization"] = "[filtered]"

    return event
