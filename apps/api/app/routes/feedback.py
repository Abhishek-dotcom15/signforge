from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, validate, ValidationError
from app.extensions import db
from app.models.annotation import FeedbackSubmission

feedback_bp = Blueprint("feedback", __name__)


class FeedbackSchema(Schema):
    type = fields.Str(required=True, validate=validate.OneOf(["bug", "feature", "improvement", "other"]))
    category = fields.Str(allow_none=True)
    title = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    description = fields.Str(required=True, validate=validate.Length(min=1, max=5000))
    metadata = fields.Dict(load_default={})


feedback_schema = FeedbackSchema()


@feedback_bp.route("", methods=["POST"])
@jwt_required()
def submit_feedback():
    user_id = get_jwt_identity()
    try:
        data = feedback_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": "Validation failed", "details": e.messages}), 400

    feedback = FeedbackSubmission(
        user_id=user_id,
        type=data["type"],
        category=data.get("category"),
        title=data["title"],
        description=data["description"],
        metadata_=data.get("metadata", {}),
    )
    db.session.add(feedback)
    db.session.commit()
    return jsonify({"id": str(feedback.id), "message": "Feedback submitted"}), 201


@feedback_bp.route("", methods=["GET"])
@jwt_required()
def list_feedback():
    user_id = get_jwt_identity()
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("perPage", 10, type=int), 50)

    pagination = (
        FeedbackSubmission.query
        .filter_by(user_id=user_id)
        .order_by(FeedbackSubmission.created_at.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )
    return jsonify({
        "data": [
            {
                "id": str(f.id),
                "type": f.type,
                "title": f.title,
                "status": f.status,
                "createdAt": f.created_at.isoformat(),
            }
            for f in pagination.items
        ],
        "total": pagination.total,
        "page": pagination.page,
        "pages": pagination.pages,
    })
