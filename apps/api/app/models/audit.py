import uuid
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.extensions import db


class AuditJob(db.Model):
    __tablename__ = "audit_jobs"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    status = db.Column(db.String(20), default="pending")  # pending, running, completed, failed
    config = db.Column(JSONB, default=dict)
    score = db.Column(db.Numeric(5, 2))
    summary = db.Column(db.Text)
    report = db.Column(JSONB)
    pages_scanned = db.Column(db.Integer, default=0)
    started_at = db.Column(db.DateTime(timezone=True))
    completed_at = db.Column(db.DateTime(timezone=True))
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    issues = db.relationship("AuditIssue", backref="job", cascade="all, delete-orphan")


class AuditIssue(db.Model):
    __tablename__ = "audit_issues"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = db.Column(UUID(as_uuid=True), db.ForeignKey("audit_jobs.id", ondelete="CASCADE"), nullable=False)
    severity = db.Column(db.String(20), nullable=False)  # critical, major, minor, info
    category = db.Column(db.String(50), nullable=False)
    wcag_criterion = db.Column(db.String(20))
    element_selector = db.Column(db.Text)
    description = db.Column(db.Text, nullable=False)
    recommendation = db.Column(db.Text)
    page_url = db.Column(db.String(500))
