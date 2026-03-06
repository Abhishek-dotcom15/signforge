import uuid
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.extensions import db


class AnnotationBatch(db.Model):
    __tablename__ = "annotation_batches"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default="open")  # open, in_progress, completed
    total_items = db.Column(db.Integer, default=0)
    completed_items = db.Column(db.Integer, default=0)
    created_by = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    annotations = db.relationship("Annotation", backref="batch", cascade="all, delete-orphan")


class Annotation(db.Model):
    __tablename__ = "annotations"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    batch_id = db.Column(UUID(as_uuid=True), db.ForeignKey("annotation_batches.id", ondelete="CASCADE"), nullable=False)
    annotator_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
    sign_id = db.Column(UUID(as_uuid=True), db.ForeignKey("signs.id"))
    type = db.Column(db.String(30), nullable=False)  # gloss_verify, sigml_quality, video_label
    data = db.Column(JSONB, nullable=False)
    status = db.Column(db.String(20), default="pending")  # pending, approved, rejected
    reviewed_by = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class FeedbackSubmission(db.Model):
    __tablename__ = "feedback_submissions"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"))
    type = db.Column(db.String(30), nullable=False)  # bug, feature, translation_quality, sign_error
    category = db.Column(db.String(50))
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    metadata_ = db.Column("metadata", JSONB, default=dict)
    status = db.Column(db.String(20), default="open")  # open, reviewing, resolved, closed
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class ModelVersion(db.Model):
    __tablename__ = "model_versions"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(100), nullable=False)
    version = db.Column(db.String(20), nullable=False)
    model_type = db.Column(db.String(50), nullable=False)  # nlp_to_gloss, gloss_to_sigml, sign_recognition
    artifact_path = db.Column(db.String(500), nullable=False)
    metrics = db.Column(JSONB, default=dict)
    is_active = db.Column(db.Boolean, default=False)
    promoted_at = db.Column(db.DateTime(timezone=True))
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (db.UniqueConstraint("name", "version"),)
