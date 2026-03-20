from datetime import datetime, timezone
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from functools import wraps
from marshmallow import Schema, fields, ValidationError

from app.extensions import db
from app.models.user import User
from app.models.sign import Sign, SigmlFile
from app.models.story import Story

admin_bp = Blueprint("admin", __name__)


class ToggleUserActiveSchema(Schema):
    is_active = fields.Bool(required=True)


toggle_user_active_schema = ToggleUserActiveSchema()


def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if "admin" not in claims.get("roles", []):
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)
    return wrapper


@admin_bp.route("/stats", methods=["GET"])
@admin_required
def dashboard_stats():
    from sqlalchemy import func
    from datetime import timedelta

    now = datetime.now(timezone.utc)
    recent_cutoff = now - timedelta(days=7)

    # Recent users (last 7 days)
    recent_users = (
        User.query
        .filter(User.created_at >= recent_cutoff)
        .order_by(User.created_at.desc())
        .limit(10)
        .all()
    )

    # Recent stories (last 7 days, by created_at)
    recent_stories = (
        Story.query
        .filter(Story.created_at >= recent_cutoff)
        .order_by(Story.created_at.desc())
        .limit(10)
        .all()
    )

    # Build activity feed from recent registrations and content
    activity = []
    for u in recent_users:
        activity.append({
            "type": "user_registered",
            "description": f"{u.full_name} joined the platform",
            "timestamp": u.created_at.isoformat() if u.created_at else None,
            "meta": {"userId": str(u.id), "email": u.email},
        })
    for s in recent_stories:
        activity.append({
            "type": "story_created",
            "description": f'Story "{s.title_en}" was added',
            "timestamp": s.created_at.isoformat() if s.created_at else None,
            "meta": {"storyId": str(s.id), "theme": s.theme},
        })

    # Sort activity by timestamp descending
    activity.sort(key=lambda a: a["timestamp"] or "", reverse=True)

    # Basic health checks
    health_services = []
    # API is healthy if we got here
    health_services.append({"name": "API Server", "status": "healthy"})
    # DB check
    try:
        db.session.execute(db.text("SELECT 1"))
        health_services.append({"name": "Database", "status": "healthy"})
    except Exception:
        health_services.append({"name": "Database", "status": "unhealthy"})
    # Redis check
    try:
        from app.extensions import redis_client
        if redis_client:
            redis_client.ping()
            health_services.append({"name": "Redis Cache", "status": "healthy"})
        else:
            health_services.append({"name": "Redis Cache", "status": "unknown"})
    except Exception:
        health_services.append({"name": "Redis Cache", "status": "unhealthy"})

    health_services.append({"name": "Worker Queue", "status": "unknown"})

    return jsonify({
        "totalUsers": User.query.count(),
        "activeUsers": User.query.filter_by(is_active=True).count(),
        "totalSigns": Sign.query.filter_by(is_active=True).count(),
        "totalStories": Story.query.filter_by(is_published=True).count(),
        "totalSigmlFiles": SigmlFile.query.filter_by(is_active=True).count(),
        "recentActivity": activity[:15],
        "services": health_services,
    })


@admin_bp.route("/users", methods=["GET"])
@admin_required
def list_users():
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("perPage", 20, type=int), 100)
    search = request.args.get("search")

    query = User.query
    if search:
        query = query.filter(
            db.or_(
                User.email.ilike(f"%{search}%"),
                User.full_name.ilike(f"%{search}%"),
            )
        )

    pagination = query.order_by(User.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "data": [u.to_dict() for u in pagination.items],
        "total": pagination.total,
        "page": pagination.page,
        "pages": pagination.pages,
    })


@admin_bp.route("/users/<user_id>/toggle-active", methods=["POST"])
@admin_required
def toggle_user_active(user_id):
    try:
        data = toggle_user_active_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": "Validation failed", "details": e.messages}), 400

    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.is_active = data["is_active"]
    db.session.commit()
    return jsonify({"id": str(user.id), "isActive": user.is_active})
