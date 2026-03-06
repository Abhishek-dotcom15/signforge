from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from app.extensions import db
from app.models.story import UserStoryProgress

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


@learn_bp.route("/stats", methods=["GET"])
@jwt_required()
def learning_stats():
    user_id = get_jwt_identity()

    completed_stories = (
        db.session.query(func.count(UserStoryProgress.id))
        .filter(UserStoryProgress.user_id == user_id, UserStoryProgress.status == "completed")
        .scalar()
    ) or 0

    total_time = (
        db.session.query(func.sum(UserStoryProgress.time_spent_sec))
        .filter(UserStoryProgress.user_id == user_id)
        .scalar()
    ) or 0

    return jsonify({
        "totalLessons": sum(m["lessonsTotal"] for m in MODULES),
        "completedLessons": 0,  # MVP placeholder
        "streakDays": 0,  # MVP placeholder
        "signsLearned": completed_stories * 5,  # rough estimate
    })
