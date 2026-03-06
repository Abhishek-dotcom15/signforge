import logging
from flask import jsonify
from sqlalchemy.exc import IntegrityError, OperationalError
from marshmallow import ValidationError

logger = logging.getLogger(__name__)


def register_error_handlers(app):
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": str(e.description) if hasattr(e, 'description') else "Bad request"}), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({"error": "Authentication required"}), 401

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({"error": "Access denied"}), 403

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"error": "Method not allowed"}), 405

    @app.errorhandler(409)
    def conflict(e):
        return jsonify({"error": "Resource conflict"}), 409

    @app.errorhandler(422)
    def unprocessable(e):
        return jsonify({"error": "Unprocessable entity"}), 422

    @app.errorhandler(429)
    def rate_limited(e):
        return jsonify({"error": "Too many requests. Please slow down."}), 429

    @app.errorhandler(500)
    def internal_error(e):
        logger.exception("Internal server error")
        return jsonify({"error": "An internal error occurred"}), 500

    @app.errorhandler(IntegrityError)
    def handle_integrity_error(e):
        logger.warning(f"Integrity error: {e}")
        from app.extensions import db
        db.session.rollback()
        return jsonify({"error": "A database constraint was violated"}), 409

    @app.errorhandler(OperationalError)
    def handle_operational_error(e):
        logger.error(f"Database error: {e}")
        from app.extensions import db
        db.session.rollback()
        return jsonify({"error": "A database error occurred"}), 500
