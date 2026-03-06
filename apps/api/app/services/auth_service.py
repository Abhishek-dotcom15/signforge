import bcrypt
from datetime import datetime, timezone
from flask_jwt_extended import create_access_token, create_refresh_token
from app.extensions import db
from app.models.user import User, UserRole, Session


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def create_user(email: str, password: str, full_name: str, is_deaf: bool = False) -> User:
    user = User(
        email=email.lower().strip(),
        password_hash=hash_password(password),
        full_name=full_name,
        is_deaf=is_deaf,
    )
    db.session.add(user)
    db.session.flush()
    db.session.add(UserRole(user_id=user.id, role="learner"))
    db.session.commit()
    return user


def authenticate(email: str, password: str) -> User | None:
    user = User.query.filter_by(email=email.lower().strip(), is_active=True).first()
    if user and user.password_hash and verify_password(password, user.password_hash):
        user.last_login_at = datetime.now(timezone.utc)
        db.session.commit()
        return user
    return None


def generate_tokens(user: User) -> dict:
    identity = str(user.id)
    additional_claims = {"roles": [r.role for r in user.roles]}
    access_token = create_access_token(identity=identity, additional_claims=additional_claims)
    refresh_token = create_refresh_token(identity=identity)
    return {"accessToken": access_token, "refreshToken": refresh_token}


def create_session(user_id: str, refresh_token: str, ip_address: str = None, user_agent: str = None, expires_at=None) -> Session:
    session = Session(
        user_id=user_id,
        refresh_token=refresh_token,
        ip_address=ip_address,
        user_agent=user_agent,
        expires_at=expires_at,
    )
    db.session.add(session)
    db.session.commit()
    return session
