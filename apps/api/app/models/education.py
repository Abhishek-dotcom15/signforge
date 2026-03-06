import uuid
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID
from app.extensions import db


class Institution(db.Model):
    __tablename__ = "institutions"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False)
    type = db.Column(db.String(50), nullable=False)  # school, college, ngo
    logo_url = db.Column(db.String(500))
    website = db.Column(db.String(500))
    is_verified = db.Column(db.Boolean, default=False)
    created_by = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    members = db.relationship("InstitutionMember", backref="institution", cascade="all, delete-orphan")
    classes = db.relationship("Class", backref="institution", cascade="all, delete-orphan")


class InstitutionMember(db.Model):
    __tablename__ = "institution_members"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = db.Column(UUID(as_uuid=True), db.ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = db.Column(db.String(30), nullable=False)  # admin, teacher, student
    joined_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (db.UniqueConstraint("institution_id", "user_id"),)


class Class(db.Model):
    __tablename__ = "classes"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = db.Column(UUID(as_uuid=True), db.ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    teacher_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False)
    join_code = db.Column(db.String(20), unique=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    students = db.relationship("ClassStudent", backref="class_", cascade="all, delete-orphan")
    assignments = db.relationship("Assignment", backref="class_", cascade="all, delete-orphan")


class ClassStudent(db.Model):
    __tablename__ = "class_students"

    class_id = db.Column(UUID(as_uuid=True), db.ForeignKey("classes.id", ondelete="CASCADE"), primary_key=True)
    student_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    enrolled_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Assignment(db.Model):
    __tablename__ = "assignments"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    class_id = db.Column(UUID(as_uuid=True), db.ForeignKey("classes.id", ondelete="CASCADE"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    type = db.Column(db.String(30), nullable=False)  # sign_practice, story_reading, quiz
    config = db.Column(db.JSON)
    due_date = db.Column(db.DateTime(timezone=True))
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    submissions = db.relationship("AssignmentSubmission", backref="assignment", cascade="all, delete-orphan")


class AssignmentSubmission(db.Model):
    __tablename__ = "assignment_submissions"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assignment_id = db.Column(UUID(as_uuid=True), db.ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False)
    student_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = db.Column(db.String(20), default="pending")  # pending, submitted, graded
    score = db.Column(db.Numeric(5, 2))
    data = db.Column(db.JSON)
    submitted_at = db.Column(db.DateTime(timezone=True))
    graded_at = db.Column(db.DateTime(timezone=True))

    __table_args__ = (db.UniqueConstraint("assignment_id", "student_id"),)
