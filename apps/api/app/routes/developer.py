import hashlib
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, validate, ValidationError

from app.extensions import db, limiter
from app.models.developer import ApiKey, Webhook, ApiUsageLog, Subscription

developer_bp = Blueprint("developer", __name__)


class CreateApiKeySchema(Schema):
    name = fields.Str(load_default="Default", validate=validate.Length(min=1, max=255))
    scopes = fields.List(
        fields.Str(validate=validate.OneOf(["translate:read", "translate:write", "signs:read", "signs:write"])),
        load_default=["translate:read"],
    )


class CreateWebhookSchema(Schema):
    url = fields.Url(required=True, schemes={"https"})
    events = fields.List(
        fields.Str(validate=validate.OneOf(["translation.completed", "sign.created", "sign.updated"])),
        load_default=["translation.completed"],
    )


create_api_key_schema = CreateApiKeySchema()
create_webhook_schema = CreateWebhookSchema()


@developer_bp.route("/api-keys", methods=["GET"])
@jwt_required()
def list_api_keys():
    user_id = get_jwt_identity()
    keys = ApiKey.query.filter_by(user_id=user_id, is_active=True).all()
    return jsonify([
        {
            "id": str(k.id),
            "name": k.name,
            "prefix": k.prefix,
            "scopes": k.scopes,
            "lastUsedAt": k.last_used_at.isoformat() if k.last_used_at else None,
            "createdAt": k.created_at.isoformat(),
        }
        for k in keys
    ])


@developer_bp.route("/api-keys", methods=["POST"])
@jwt_required()
@limiter.limit("10 per hour")
def create_api_key():
    user_id = get_jwt_identity()
    try:
        data = create_api_key_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": "Validation failed", "details": e.messages}), 400

    raw_key, prefix = ApiKey.generate_key()
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()

    api_key = ApiKey(
        user_id=user_id,
        name=data["name"],
        key_hash=key_hash,
        prefix=prefix,
        scopes=data["scopes"],
    )
    db.session.add(api_key)
    db.session.commit()

    return jsonify({
        "id": str(api_key.id),
        "key": raw_key,
        "prefix": prefix,
        "message": "Store this key securely. It won't be shown again.",
    }), 201


@developer_bp.route("/api-keys/<key_id>", methods=["DELETE"])
@jwt_required()
def revoke_api_key(key_id):
    user_id = get_jwt_identity()
    key = ApiKey.query.filter_by(id=key_id, user_id=user_id).first()
    if not key:
        return jsonify({"error": "API key not found"}), 404
    key.is_active = False
    db.session.commit()
    return jsonify({"message": "API key revoked"})


@developer_bp.route("/webhooks", methods=["GET"])
@jwt_required()
def list_webhooks():
    user_id = get_jwt_identity()
    webhooks = Webhook.query.filter_by(user_id=user_id).all()
    return jsonify([
        {
            "id": str(w.id),
            "url": w.url,
            "events": w.events,
            "isActive": w.is_active,
        }
        for w in webhooks
    ])


@developer_bp.route("/webhooks", methods=["POST"])
@jwt_required()
def create_webhook():
    user_id = get_jwt_identity()
    try:
        data = create_webhook_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": "Validation failed", "details": e.messages}), 400

    import secrets

    webhook = Webhook(
        user_id=user_id,
        url=data["url"],
        secret=secrets.token_hex(32),
        events=data["events"],
    )
    db.session.add(webhook)
    db.session.commit()
    return jsonify({"id": str(webhook.id), "secret": webhook.secret}), 201


@developer_bp.route("/usage", methods=["GET"])
@jwt_required()
def usage_stats():
    user_id = get_jwt_identity()
    from sqlalchemy import func, cast, Date
    from datetime import datetime, timedelta, timezone

    since = datetime.now(timezone.utc) - timedelta(days=30)
    stats = (
        db.session.query(
            func.count(ApiUsageLog.id).label("total_requests"),
            func.avg(ApiUsageLog.response_time_ms).label("avg_response_ms"),
        )
        .filter(ApiUsageLog.user_id == user_id, ApiUsageLog.created_at >= since)
        .first()
    )

    # Daily breakdown for the last 30 days
    daily_rows = (
        db.session.query(
            cast(ApiUsageLog.created_at, Date).label("date"),
            func.count(ApiUsageLog.id).label("requests"),
            func.avg(ApiUsageLog.response_time_ms).label("avg_ms"),
        )
        .filter(ApiUsageLog.user_id == user_id, ApiUsageLog.created_at >= since)
        .group_by(cast(ApiUsageLog.created_at, Date))
        .order_by(cast(ApiUsageLog.created_at, Date))
        .all()
    )

    daily = [
        {
            "date": row.date.isoformat(),
            "requests": row.requests,
            "avgMs": round(float(row.avg_ms or 0), 2),
        }
        for row in daily_rows
    ]

    return jsonify({
        "totalRequests": stats.total_requests or 0,
        "avgResponseMs": round(float(stats.avg_response_ms or 0), 2),
        "period": "last_30_days",
        "daily": daily,
    })
