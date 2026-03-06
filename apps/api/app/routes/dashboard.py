from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from datetime import datetime, timedelta, timezone
from app.extensions import db
from app.models.user import User
from app.models.story import UserStoryProgress
from app.models.developer import ApiUsageLog

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/stats", methods=["GET"])
@jwt_required()
def user_dashboard_stats():
    user_id = get_jwt_identity()
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0)

    translations_today = (
        db.session.query(func.count(ApiUsageLog.id))
        .filter(
            ApiUsageLog.user_id == user_id,
            ApiUsageLog.endpoint.like("%translate%"),
            ApiUsageLog.created_at >= today,
        )
        .scalar()
    ) or 0

    stories_completed = (
        db.session.query(func.count(UserStoryProgress.id))
        .filter(UserStoryProgress.user_id == user_id, UserStoryProgress.status == "completed")
        .scalar()
    ) or 0

    return jsonify({
        "translationsToday": translations_today,
        "signsLearned": 0,  # MVP placeholder
        "storiesCompleted": stories_completed,
        "streakDays": 0,  # MVP placeholder
    })
