import uuid as _uuid
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, validate, ValidationError

from app.extensions import db
from app.models.user import User
from app.services.user_service import update_profile, change_password

user_bp = Blueprint("user", __name__)


class UpdateProfileSchema(Schema):
    fullName = fields.Str(validate=validate.Length(min=1, max=255))
    displayName = fields.Str(validate=validate.Length(max=100), allow_none=True)
    locale = fields.Str(validate=validate.OneOf(["en", "hi"]))
    theme = fields.Str(validate=validate.OneOf(["light", "dark", "system"]))
    isDeaf = fields.Bool()
    onboardingDone = fields.Bool()


class ChangePasswordSchema(Schema):
    currentPassword = fields.Str(required=True)
    newPassword = fields.Str(required=True, validate=validate.Length(min=8, max=128))


update_profile_schema = UpdateProfileSchema()
change_password_schema = ChangePasswordSchema()


@user_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_user_profile():
    try:
        data = update_profile_schema.load(request.get_json())
    except ValidationError as e:
        return jsonify({"error": "Validation failed", "details": e.messages}), 400

    user_id = get_jwt_identity()
    try:
        user = update_profile(user_id, data)
        return jsonify(user.to_dict())
    except ValueError as e:
        return jsonify({"error": str(e)}), 404


@user_bp.route("/password", methods=["PUT"])
@jwt_required()
def change_user_password():
    try:
        data = change_password_schema.load(request.get_json())
    except ValidationError as e:
        return jsonify({"error": "Validation failed", "details": e.messages}), 400

    user_id = get_jwt_identity()
    try:
        change_password(user_id, data["currentPassword"], data["newPassword"])
        return jsonify({"message": "Password updated successfully"})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
