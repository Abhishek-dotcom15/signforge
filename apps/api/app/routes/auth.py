import uuid as _uuid
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from marshmallow import Schema, fields, validate, ValidationError

from app.extensions import db, limiter
from app.models.user import User
from app.services.auth_service import create_user, authenticate, generate_tokens
from app.utils.sanitize import sanitize_string
from app.utils.responses import success_response, error_response

auth_bp = Blueprint("auth", __name__)


class RegisterSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8, max=128))
    fullName = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    isDeaf = fields.Bool(load_default=False)


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)


register_schema = RegisterSchema()
login_schema = LoginSchema()


@auth_bp.route("/register", methods=["POST"])
@limiter.limit("5 per minute")
def register():
    try:
        data = register_schema.load(request.get_json())
    except ValidationError as e:
        return error_response("Validation failed", 400, errors=e.messages)

    if User.query.filter_by(email=data["email"].lower()).first():
        return error_response("Email already registered", 409)

    user = create_user(
        email=data["email"],
        password=data["password"],
        full_name=sanitize_string(data["fullName"]),
        is_deaf=data.get("isDeaf", False),
    )
    tokens = generate_tokens(user)
    return success_response({"user": user.to_dict(), **tokens}, status=201)


@auth_bp.route("/login", methods=["POST"])
@limiter.limit("5 per minute")
def login():
    try:
        data = login_schema.load(request.get_json())
    except ValidationError as e:
        return error_response("Validation failed", 400, errors=e.messages)

    user = authenticate(data["email"], data["password"])
    if not user:
        return error_response("Invalid email or password", 401)

    tokens = generate_tokens(user)
    return success_response({"user": user.to_dict(), **tokens})


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    user = db.session.get(User, identity)
    if not user or not user.is_active:
        return jsonify({"error": "User not found"}), 404
    tokens = generate_tokens(user)
    return jsonify(tokens)


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user = db.session.get(User, _uuid.UUID(get_jwt_identity()))
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict())


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    from flask_jwt_extended import get_jwt
    from flask import current_app
    from app.extensions import redis_client
    jti = get_jwt()["jti"]
    expires = current_app.config["JWT_ACCESS_TOKEN_EXPIRES"]
    try:
        if redis_client is not None:
            redis_client.setex(f"blocklist:{jti}", int(expires.total_seconds()), "true")
    except Exception:
        pass  # Redis unavailable — token won't be blocklisted
    return jsonify({"message": "Logged out successfully"})
