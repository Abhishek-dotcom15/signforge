from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.story import Story, StoryChapter, UserStoryProgress, StoryQuiz, QuizAttempt
from app.utils.responses import paginated_response, error_response

stories_bp = Blueprint("stories", __name__)


@stories_bp.route("", methods=["GET"])
def list_stories():
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("perPage", 20, type=int), 100)
    theme = request.args.get("theme")
    difficulty = request.args.get("difficulty")

    query = Story.query.filter_by(is_published=True)
    if theme:
        query = query.filter_by(theme=theme)
    if difficulty:
        query = query.filter_by(difficulty=difficulty)

    pagination = query.order_by(Story.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    return paginated_response(
        items=[s.to_dict() for s in pagination.items],
        total=pagination.total,
        page=pagination.page,
        per_page=per_page,
    )


@stories_bp.route("/<story_id>", methods=["GET"])
def get_story(story_id):
    story = db.session.get(Story, story_id)
    if not story or not story.is_published:
        return error_response("Story not found", 404)
    story.view_count += 1
    db.session.commit()
    result = story.to_dict()
    result["chapters"] = [
        {"chapterNum": c.chapter_num, "titleEn": c.title_en}
        for c in story.chapters
    ]
    return jsonify(result)


@stories_bp.route("/<story_id>/chapters/<int:chapter_num>", methods=["GET"])
def get_chapter(story_id, chapter_num):
    chapter = StoryChapter.query.filter_by(story_id=story_id, chapter_num=chapter_num).first()
    if not chapter:
        return error_response("Chapter not found", 404)
    return jsonify({
        "chapterNum": chapter.chapter_num,
        "titleEn": chapter.title_en,
        "contentEn": chapter.content_en,
        "contentHi": chapter.content_hi,
        "islGlosses": chapter.isl_glosses,
        "sigmlSequence": chapter.sigml_sequence,
    })


@stories_bp.route("/<story_id>/progress", methods=["GET"])
@jwt_required()
def get_progress(story_id):
    user_id = get_jwt_identity()
    progress = UserStoryProgress.query.filter_by(user_id=user_id, story_id=story_id).first()
    if not progress:
        return jsonify({"status": "not_started", "currentChapter": 1, "completionPct": 0})
    return jsonify({
        "status": progress.status,
        "currentChapter": progress.current_chapter,
        "completionPct": float(progress.completion_pct),
        "timeSpentSec": progress.time_spent_sec,
    })


@stories_bp.route("/<story_id>/progress", methods=["PUT"])
@jwt_required()
def update_progress(story_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    progress = UserStoryProgress.query.filter_by(user_id=user_id, story_id=story_id).first()
    if not progress:
        progress = UserStoryProgress(user_id=user_id, story_id=story_id)
        db.session.add(progress)

    if "currentChapter" in data:
        progress.current_chapter = data["currentChapter"]
    if "status" in data:
        progress.status = data["status"]
    if "completionPct" in data:
        progress.completion_pct = data["completionPct"]
    if "timeSpentSec" in data:
        progress.time_spent_sec = data["timeSpentSec"]

    db.session.commit()
    return jsonify({"message": "Progress updated"})


@stories_bp.route("/<story_id>/quizzes", methods=["GET"])
def list_quizzes(story_id):
    quizzes = StoryQuiz.query.filter_by(story_id=story_id).all()
    return jsonify([
        {"id": str(q.id), "title": q.title, "questionCount": q.question_count, "isAdaptive": q.is_adaptive}
        for q in quizzes
    ])
