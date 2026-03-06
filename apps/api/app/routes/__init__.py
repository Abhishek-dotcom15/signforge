from .auth import auth_bp
from .translate import translate_bp
from .signs import signs_bp
from .stories import stories_bp
from .education import education_bp
from .developer import developer_bp
from .audit import audit_bp
from .admin import admin_bp
from .feedback import feedback_bp
from .user import user_bp
from .learn import learn_bp
from .dashboard import dashboard_bp


def register_blueprints(app):
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(translate_bp, url_prefix="/api/translate")
    app.register_blueprint(signs_bp, url_prefix="/api/signs")
    app.register_blueprint(stories_bp, url_prefix="/api/stories")
    app.register_blueprint(education_bp, url_prefix="/api/education")
    app.register_blueprint(developer_bp, url_prefix="/api/developer")
    app.register_blueprint(audit_bp, url_prefix="/api/audit")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(feedback_bp, url_prefix="/api/feedback")
    app.register_blueprint(user_bp, url_prefix="/api/user")
    app.register_blueprint(learn_bp, url_prefix="/api/learn")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
