from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from marshmallow import Schema, fields, validate, ValidationError
import httpx

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
def translate_text():
    try:
        data = translate_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": "Validation failed", "details": e.messages}), 400

    service_url = current_app.config["TRANSLATION_SERVICE_URL"]
    try:
        resp = httpx.post(
            f"{service_url}/translate",
            json={"text": data["text"], "source_lang": data["sourceLang"]},
            timeout=30.0,
        )
        resp.raise_for_status()
        return jsonify(resp.json())
    except httpx.HTTPStatusError as e:
        return jsonify({"error": "Translation service error", "detail": str(e)}), 502
    except httpx.TimeoutException:
        return jsonify({"error": "Translation service timed out"}), 504
    except httpx.ConnectError:
        return jsonify({"error": "Translation service unavailable"}), 503


@translate_bp.route("/batch", methods=["POST"])
@jwt_required()
def translate_batch():
    try:
        data = batch_translate_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": "Validation failed", "details": e.messages}), 400

    service_url = current_app.config["TRANSLATION_SERVICE_URL"]
    try:
        resp = httpx.post(
            f"{service_url}/translate/batch",
            json={"sentences": data["sentences"]},
            timeout=60.0,
        )
        resp.raise_for_status()
        return jsonify(resp.json())
    except httpx.HTTPStatusError as e:
        return jsonify({"error": "Translation service error", "detail": str(e)}), 502
    except httpx.TimeoutException:
        return jsonify({"error": "Translation service timed out"}), 504
    except httpx.ConnectError:
        return jsonify({"error": "Translation service unavailable"}), 503
