import uuid
import secrets
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.extensions import db


class Plan(db.Model):
    __tablename__ = "plans"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(50), unique=True, nullable=False)
    display_name = db.Column(db.String(100), nullable=False)
    price_monthly = db.Column(db.Numeric(10, 2), nullable=False)
    price_yearly = db.Column(db.Numeric(10, 2))
    rate_limit_per_min = db.Column(db.Integer, default=60)
    daily_quota = db.Column(db.Integer, default=1000)
    features = db.Column(JSONB, default=dict)
    is_active = db.Column(db.Boolean, default=True)


class Subscription(db.Model):
    __tablename__ = "subscriptions"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    plan_id = db.Column(UUID(as_uuid=True), db.ForeignKey("plans.id"), nullable=False)
    stripe_subscription_id = db.Column(db.String(255))
    status = db.Column(db.String(20), default="active")  # active, canceled, past_due
    current_period_start = db.Column(db.DateTime(timezone=True))
    current_period_end = db.Column(db.DateTime(timezone=True))
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    plan = db.relationship("Plan")


class ApiKey(db.Model):
    __tablename__ = "api_keys"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    key_hash = db.Column(db.String(255), nullable=False, unique=True)
    prefix = db.Column(db.String(10), nullable=False)
    scopes = db.Column(JSONB, default=list)
    is_active = db.Column(db.Boolean, default=True)
    last_used_at = db.Column(db.DateTime(timezone=True))
    expires_at = db.Column(db.DateTime(timezone=True))
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    @staticmethod
    def generate_key():
        raw = secrets.token_urlsafe(32)
        prefix = raw[:8]
        return raw, prefix


class Webhook(db.Model):
    __tablename__ = "webhooks"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    secret = db.Column(db.String(255), nullable=False)
    events = db.Column(JSONB, default=list)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    deliveries = db.relationship("WebhookDelivery", backref="webhook", cascade="all, delete-orphan")


class WebhookDelivery(db.Model):
    __tablename__ = "webhook_deliveries"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    webhook_id = db.Column(UUID(as_uuid=True), db.ForeignKey("webhooks.id", ondelete="CASCADE"), nullable=False)
    event = db.Column(db.String(50), nullable=False)
    payload = db.Column(JSONB, nullable=False)
    response_status = db.Column(db.Integer)
    response_body = db.Column(db.Text)
    delivered_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        db.Index("ix_webhook_deliveries_webhook_delivered", "webhook_id", "delivered_at"),
    )


class ApiUsageLog(db.Model):
    __tablename__ = "api_usage_logs"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    endpoint = db.Column(db.String(255), nullable=False)
    method = db.Column(db.String(10), nullable=False)
    status_code = db.Column(db.Integer, nullable=False)
    response_time_ms = db.Column(db.Integer)
    ip_address = db.Column(db.String(45))
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        db.Index("ix_api_usage_logs_user_created", "user_id", "created_at"),
        db.Index("ix_api_usage_logs_endpoint_created", "endpoint", "created_at"),
    )
