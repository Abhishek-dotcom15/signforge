from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.sign import Sign
from app.utils.responses import paginated_response, error_response

signs_bp = Blueprint("signs", __name__)


@signs_bp.route("", methods=["GET"])
def list_signs():
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("perPage", 20, type=int), 100)
    category = request.args.get("category")
    difficulty = request.args.get("difficulty")
    search = request.args.get("q")

    query = Sign.query.filter_by(is_active=True)
    if category:
        query = query.filter(Sign.categories.any(category=category))
    if difficulty:
        query = query.filter_by(difficulty=difficulty)
    if search:
        query = query.filter(
            db.or_(
                Sign.english_word.ilike(f"%{search}%"),
                Sign.gloss.ilike(f"%{search}%"),
            )
        )

    pagination = query.order_by(Sign.english_word).paginate(page=page, per_page=per_page, error_out=False)
    return paginated_response(
        items=[s.to_dict() for s in pagination.items],
        total=pagination.total,
        page=pagination.page,
        per_page=per_page,
    )


@signs_bp.route("/<sign_id>", methods=["GET"])
def get_sign(sign_id):
    sign = db.session.get(Sign, sign_id)
    if not sign or not sign.is_active:
        return error_response("Sign not found", 404)
    sign.usage_count += 1
    db.session.commit()
    return jsonify(sign.to_dict())


@signs_bp.route("/word-of-the-day", methods=["GET"])
def word_of_the_day():
    from datetime import date
    seed = date.today().toordinal()
    signs = Sign.query.filter_by(is_active=True).order_by(Sign.english_word).all()
    if not signs:
        return jsonify({"error": "No signs available"}), 404
    sign = signs[seed % len(signs)]
    return jsonify(sign.to_dict())


@signs_bp.route("/glossary", methods=["GET"])
def glossary():
    letter = request.args.get("letter", "A").upper()
    signs = (
        Sign.query
        .filter(Sign.is_active == True, Sign.english_word.ilike(f"{letter}%"))
        .order_by(Sign.english_word)
        .all()
    )
    return jsonify({"letter": letter, "signs": [s.to_dict() for s in signs]})
