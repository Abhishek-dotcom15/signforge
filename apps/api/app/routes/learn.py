import uuid as _uuid
from datetime import datetime, timedelta, timezone

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func, select, distinct
from app.extensions import db
from app.models.story import UserStoryProgress
from app.models.developer import ApiUsageLog

learn_bp = Blueprint("learn", __name__)

# Static module definitions for MVP — in production these would be in DB
MODULES = [
    {"id": "m1", "title": "ISL Alphabet", "description": "Learn the A-Z finger-spelling alphabet", "difficulty": "beginner", "category": "alphabet", "lessonsTotal": 26, "isLocked": False},
    {"id": "m2", "title": "Numbers 1-20", "description": "Count from 1 to 20 in ISL", "difficulty": "beginner", "category": "numbers", "lessonsTotal": 20, "isLocked": False},
    {"id": "m3", "title": "Basic Greetings", "description": "Hello, goodbye, thank you and more", "difficulty": "beginner", "category": "greetings", "lessonsTotal": 12, "isLocked": False},
    {"id": "m4", "title": "Daily Essentials", "description": "Common phrases for everyday use", "difficulty": "beginner", "category": "daily", "lessonsTotal": 15, "isLocked": False},
    {"id": "m5", "title": "Family & People", "description": "Signs for family members and relationships", "difficulty": "intermediate", "category": "daily", "lessonsTotal": 18, "isLocked": False},
    {"id": "m6", "title": "Food & Drink", "description": "Order food, describe meals", "difficulty": "intermediate", "category": "daily", "lessonsTotal": 20, "isLocked": False},
    {"id": "m7", "title": "ISL Grammar Basics", "description": "Sentence structure and non-manual markers", "difficulty": "intermediate", "category": "grammar", "lessonsTotal": 10, "isLocked": False},
    {"id": "m8", "title": "Advanced Conversation", "description": "Complex sentences and storytelling", "difficulty": "advanced", "category": "grammar", "lessonsTotal": 15, "isLocked": True},
    {"id": "m9", "title": "Numbers & Math", "description": "Large numbers, fractions, and math signs", "difficulty": "advanced", "category": "numbers", "lessonsTotal": 12, "isLocked": True},
]


@learn_bp.route("/modules", methods=["GET"])
@jwt_required()
def list_modules():
    # For MVP, return static modules with 0 progress
    # In production, join with a user_module_progress table
    return jsonify([{**m, "lessonsCompleted": 0} for m in MODULES])


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
            # Allow streak to start from yesterday
            streak = 1
        else:
            break
    return streak


@learn_bp.route("/stats", methods=["GET"])
@jwt_required()
def learning_stats():
    user_id = _uuid.UUID(get_jwt_identity())

    completed_stories = (
        db.session.execute(
            select(func.count(UserStoryProgress.id))
            .where(UserStoryProgress.user_id == user_id, UserStoryProgress.status == "completed")
        ).scalar()
    ) or 0

    # Count unique signs the user has interacted with via API
    signs_learned = (
        db.session.execute(
            select(func.count(distinct(ApiUsageLog.endpoint)))
            .where(
                ApiUsageLog.user_id == user_id,
                ApiUsageLog.endpoint.like("%/signs/%"),
            )
        ).scalar()
    ) or 0

    streak_days = _compute_streak(user_id)

    return jsonify({
        "totalLessons": sum(m["lessonsTotal"] for m in MODULES),
        "completedLessons": completed_stories,
        "streakDays": streak_days,
        "signsLearned": signs_learned,
    })
