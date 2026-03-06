from datetime import datetime, timezone
from app.extensions import db
from app.models.user import User
from app.services.auth_service import hash_password, verify_password


def update_profile(user_id: str, data: dict) -> User:
    user = db.session.get(User, user_id)
    if not user:
        raise ValueError("User not found")
    if "fullName" in data:
        user.full_name = data["fullName"]
    if "displayName" in data:
        user.display_name = data["displayName"]
    if "locale" in data and data["locale"] in ("en", "hi"):
        user.locale = data["locale"]
    if "theme" in data and data["theme"] in ("light", "dark", "system"):
        user.theme = data["theme"]
    if "isDeaf" in data:
        user.is_deaf = bool(data["isDeaf"])
    if "onboardingDone" in data:
        user.onboarding_done = bool(data["onboardingDone"])
    user.updated_at = datetime.now(timezone.utc)
    db.session.commit()
    return user


def change_password(user_id: str, current_password: str, new_password: str) -> bool:
    user = db.session.get(User, user_id)
    if not user or not user.password_hash:
        raise ValueError("User not found")
    if not verify_password(current_password, user.password_hash):
        raise ValueError("Current password is incorrect")
    user.password_hash = hash_password(new_password)
    user.updated_at = datetime.now(timezone.utc)
    db.session.commit()
    return True
