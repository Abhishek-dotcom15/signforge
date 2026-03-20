import uuid
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.extensions import db


class SigmlFile(db.Model):
    __tablename__ = "sigml_files"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    filename = db.Column(db.String(255), unique=True, nullable=False)
    s3_key = db.Column(db.String(500), nullable=False)
    cdn_url = db.Column(db.String(500))
    gloss = db.Column(db.String(100), nullable=False)
    hamnosys_code = db.Column(db.String(500))
    version = db.Column(db.Integer, default=1)
    is_active = db.Column(db.Boolean, default=True)
    tags = db.Column(JSONB, default=list)
    uploaded_by = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Sign(db.Model):
    __tablename__ = "signs"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    english_word = db.Column(db.String(255), nullable=False, index=True)
    hindi_word = db.Column(db.String(255))
    gloss = db.Column(db.String(100), unique=True, nullable=False, index=True)
    hamnosys_code = db.Column(db.String(500))
    sigml_file_id = db.Column(UUID(as_uuid=True), db.ForeignKey("sigml_files.id"))
    handshape_desc = db.Column(db.Text)
    description = db.Column(db.Text)
    video_url = db.Column(db.String(500))
    difficulty = db.Column(db.String(20), default="beginner")
    usage_count = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    sigml_file = db.relationship("SigmlFile", backref="signs")
    categories = db.relationship("SignCategory", backref="sign", cascade="all, delete-orphan")
    examples = db.relationship("SignExample", backref="sign", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": str(self.id),
            "englishWord": self.english_word,
            "hindiWord": self.hindi_word,
            "gloss": self.gloss,
            "hamnosysCode": self.hamnosys_code,
            "sigmlUrl": self.sigml_file.cdn_url if self.sigml_file else None,
            "videoUrl": self.video_url,
            "categories": [c.category for c in self.categories],
            "difficulty": self.difficulty,
            "examples": [{"sentenceEn": e.sentence_en, "islGloss": e.isl_gloss} for e in self.examples],
            "handshapeDesc": self.handshape_desc,
            "usageCount": self.usage_count or 0,
            "isActive": self.is_active,
        }


class SignCategory(db.Model):
    __tablename__ = "sign_categories"

    sign_id = db.Column(UUID(as_uuid=True), db.ForeignKey("signs.id", ondelete="CASCADE"), primary_key=True)
    category = db.Column(db.String(100), primary_key=True)


class SignExample(db.Model):
    __tablename__ = "sign_examples"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sign_id = db.Column(UUID(as_uuid=True), db.ForeignKey("signs.id", ondelete="CASCADE"), nullable=False)
    sentence_en = db.Column(db.Text, nullable=False)
    sentence_hi = db.Column(db.Text)
    isl_gloss = db.Column(db.Text, nullable=False)


class GlossMapping(db.Model):
    __tablename__ = "gloss_mappings"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    english_word = db.Column(db.String(255), nullable=False, index=True)
    gloss = db.Column(db.String(100), nullable=False)
    sigml_file_id = db.Column(UUID(as_uuid=True), db.ForeignKey("sigml_files.id"), nullable=False)
    confidence = db.Column(db.Numeric(3, 2), default=1.0)
    source = db.Column(db.String(20), default="manual")
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    sigml_file = db.relationship("SigmlFile")

    __table_args__ = (db.UniqueConstraint("english_word", "gloss"),)
