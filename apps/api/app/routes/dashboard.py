import uuid as _uuid

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func, select, distinct
from datetime import datetime, timedelta, timezone
from app.extensions import db
from app.models.user import User
from app.models.story import UserStoryProgress
from app.models.developer import ApiUsageLog

dashboard_bp = Blueprint("dashboard", __name__)


def _compute_streak(user_id):
    """Compute consecutive-day streak from UserStoryProgress completion dates."""
    rows = db.session.execute(
        select(func.distinct(func.date(UserStoryProgress.completed_at)))
        .where(
            UserStoryProgress.user_id == user_id,
            UserStoryProgress.completed_at.isnot(None),
        )
        .order_by(func.date(UserStoryProgress.completed_at).desc())
    ).scalars().all()

    if not rows:
        return 0

    today = datetime.now(timezone.utc).date()
    streak = 0
    for d in rows:
        expected = today - timedelta(days=streak)
        if d == expected:
            streak += 1
        elif streak == 0 and d == today - timedelta(days=1):
            streak = 1
        else:
            break
    return streak


@dashboard_bp.route("/stats", methods=["GET"])
@jwt_required()
def user_dashboard_stats():
    user_id = _uuid.UUID(get_jwt_identity())
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)

    # Count actual translation API calls for today
    translations_today = (
        db.session.execute(
            select(func.count(ApiUsageLog.id))
            .where(
                ApiUsageLog.user_id == user_id,
                ApiUsageLog.endpoint.like("%translate%"),
                ApiUsageLog.created_at >= today,
            )
        ).scalar()
    ) or 0

    # Count unique sign endpoints the user has accessed
    signs_learned = (
        db.session.execute(
            select(func.count(distinct(ApiUsageLog.endpoint)))
            .where(
                ApiUsageLog.user_id == user_id,
                ApiUsageLog.endpoint.like("%/signs/%"),
            )
        ).scalar()
    ) or 0

    stories_completed = (
        db.session.execute(
            select(func.count(UserStoryProgress.id))
            .where(UserStoryProgress.user_id == user_id, UserStoryProgress.status == "completed")
        ).scalar()
    ) or 0

    streak_days = _compute_streak(user_id)

    return jsonify({
        "translationsToday": translations_today,
        "signsLearned": signs_learned,
        "storiesCompleted": stories_completed,
        "streakDays": streak_days,
    })
