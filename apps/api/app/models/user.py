import uuid
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID, INET
from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255))
    full_name = db.Column(db.String(255), nullable=False)
    display_name = db.Column(db.String(100))
    avatar_url = db.Column(db.String(500))
    locale = db.Column(db.String(10), default="en")
    theme = db.Column(db.String(10), default="system")
    is_deaf = db.Column(db.Boolean, default=False)
    is_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    onboarding_done = db.Column(db.Boolean, default=False)
    last_login_at = db.Column(db.DateTime(timezone=True))
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    roles = db.relationship("UserRole", backref="user", cascade="all, delete-orphan", lazy="joined", foreign_keys="UserRole.user_id")
    oauth_accounts = db.relationship("OAuthAccount", backref="user", cascade="all, delete-orphan")
    api_keys = db.relationship("ApiKey", backref="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": str(self.id),
            "email": self.email,
            "fullName": self.full_name,
            "displayName": self.display_name,
            "avatarUrl": self.avatar_url,
            "locale": self.locale,
            "theme": self.theme,
            "isDeaf": self.is_deaf,
            "isVerified": self.is_verified,
            "roles": [r.role for r in self.roles],
            "onboardingDone": self.onboarding_done,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }


class UserRole(db.Model):
    __tablename__ = "user_roles"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = db.Column(db.String(30), nullable=False)
    granted_by = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"))
    granted_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (db.UniqueConstraint("user_id", "role"),)


class OAuthAccount(db.Model):
    __tablename__ = "oauth_accounts"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    provider = db.Column(db.String(30), nullable=False)
    provider_id = db.Column(db.String(255), nullable=False)
    access_token = db.Column(db.Text)
    refresh_token = db.Column(db.Text)
    expires_at = db.Column(db.DateTime(timezone=True))
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (db.UniqueConstraint("provider", "provider_id"),)


class Session(db.Model):
    __tablename__ = "sessions"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    refresh_token = db.Column(db.String(500), nullable=False)
    ip_address = db.Column(INET)
    user_agent = db.Column(db.Text)
    expires_at = db.Column(db.DateTime(timezone=True), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
