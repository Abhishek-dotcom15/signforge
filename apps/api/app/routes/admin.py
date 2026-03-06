from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from functools import wraps
from app.extensions import db
from app.models.user import User
from app.models.sign import Sign, SigmlFile
from app.models.story import Story

admin_bp = Blueprint("admin", __name__)


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
    return jsonify({
        "totalUsers": User.query.count(),
        "activeUsers": User.query.filter_by(is_active=True).count(),
        "totalSigns": Sign.query.filter_by(is_active=True).count(),
        "totalStories": Story.query.filter_by(is_published=True).count(),
        "totalSigmlFiles": SigmlFile.query.filter_by(is_active=True).count(),
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
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.is_active = not user.is_active
    db.session.commit()
    return jsonify({"id": str(user.id), "isActive": user.is_active})
