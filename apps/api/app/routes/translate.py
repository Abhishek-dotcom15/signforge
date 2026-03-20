from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from marshmallow import Schema, fields, validate, ValidationError

from app.extensions import limiter
from app.services.translation_service import translate_text, translate_batch

translate_bp = Blueprint("translate", __name__)


class TranslateSchema(Schema):
    text = fields.Str(required=True, validate=validate.Length(min=1, max=5000))
    sourceLang = fields.Str(load_default="en", validate=validate.OneOf(["en", "hi", "auto"]))


class BatchTranslateSchema(Schema):
    sentences = fields.List(fields.Str(), required=True, validate=validate.Length(min=1, max=20))


translate_schema = TranslateSchema()
batch_translate_schema = BatchTranslateSchema()


@translate_bp.route("", methods=["POST"])
@jwt_required()
@limiter.limit("30 per minute")
def translate_text_route():
    try:
        data = translate_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": "Validation failed", "details": e.messages}), 400

    result = translate_text(data["text"], data["sourceLang"])
    return jsonify(result)


@translate_bp.route("/batch", methods=["POST"])
@jwt_required()
@limiter.limit("30 per minute")
def translate_batch_route():
    try:
        data = batch_translate_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": "Validation failed", "details": e.messages}), 400

    results = translate_batch(data["sentences"])
    return jsonify({"results": results})
