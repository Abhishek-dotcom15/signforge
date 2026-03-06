import uuid
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.extensions import db


class Story(db.Model):
    __tablename__ = "stories"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title_en = db.Column(db.String(500), nullable=False)
    title_hi = db.Column(db.String(500))
    slug = db.Column(db.String(255), unique=True, nullable=False)
    summary_en = db.Column(db.Text)
    summary_hi = db.Column(db.Text)
    theme = db.Column(db.String(50), nullable=False)
    difficulty = db.Column(db.String(20), nullable=False)
    duration_min = db.Column(db.Integer)
    word_count = db.Column(db.Integer)
    chapter_count = db.Column(db.Integer, default=1)
    thumbnail_url = db.Column(db.String(500))
    is_published = db.Column(db.Boolean, default=False)
    view_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    chapters = db.relationship("StoryChapter", backref="story", cascade="all, delete-orphan", order_by="StoryChapter.chapter_num")
    quizzes = db.relationship("StoryQuiz", backref="story", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": str(self.id), "titleEn": self.title_en, "titleHi": self.title_hi,
            "slug": self.slug, "summaryEn": self.summary_en, "theme": self.theme,
            "difficulty": self.difficulty, "durationMin": self.duration_min,
            "wordCount": self.word_count, "chapterCount": self.chapter_count,
            "thumbnailUrl": self.thumbnail_url, "viewCount": self.view_count,
        }


class StoryChapter(db.Model):
    __tablename__ = "story_chapters"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    story_id = db.Column(UUID(as_uuid=True), db.ForeignKey("stories.id", ondelete="CASCADE"), nullable=False)
    chapter_num = db.Column(db.Integer, nullable=False)
    title_en = db.Column(db.String(255))
    content_en = db.Column(db.Text, nullable=False)
    content_hi = db.Column(db.Text)
    isl_glosses = db.Column(db.Text, nullable=False)
    sigml_sequence = db.Column(JSONB, nullable=False)
    __table_args__ = (db.UniqueConstraint("story_id", "chapter_num"),)


class StoryQuiz(db.Model):
    __tablename__ = "story_quizzes"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    story_id = db.Column(UUID(as_uuid=True), db.ForeignKey("stories.id", ondelete="CASCADE"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    is_adaptive = db.Column(db.Boolean, default=False)
    question_count = db.Column(db.Integer, default=5)
    questions = db.relationship("QuizQuestion", backref="quiz", cascade="all, delete-orphan")


class QuizQuestion(db.Model):
    __tablename__ = "quiz_questions"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quiz_id = db.Column(UUID(as_uuid=True), db.ForeignKey("story_quizzes.id", ondelete="CASCADE"), nullable=False)
    type = db.Column(db.String(30), nullable=False)
    question_data = db.Column(JSONB, nullable=False)
    options = db.Column(JSONB, nullable=False)
    correct_answer = db.Column(JSONB, nullable=False)
    difficulty = db.Column(db.Integer, default=1)
    order_num = db.Column(db.Integer, nullable=False)


class UserStoryProgress(db.Model):
    __tablename__ = "user_story_progress"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    story_id = db.Column(UUID(as_uuid=True), db.ForeignKey("stories.id", ondelete="CASCADE"), nullable=False)
    status = db.Column(db.String(20), default="not_started")
    current_chapter = db.Column(db.Integer, default=1)
    completion_pct = db.Column(db.Numeric(5, 2), default=0)
    time_spent_sec = db.Column(db.Integer, default=0)
    completed_at = db.Column(db.DateTime(timezone=True))
    __table_args__ = (db.UniqueConstraint("user_id", "story_id"),)


class QuizAttempt(db.Model):
    __tablename__ = "quiz_attempts"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    quiz_id = db.Column(UUID(as_uuid=True), db.ForeignKey("story_quizzes.id", ondelete="CASCADE"), nullable=False)
    score = db.Column(db.Numeric(5, 2), nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
    correct_count = db.Column(db.Integer, nullable=False)
    answers = db.Column(JSONB, nullable=False)
    time_spent_sec = db.Column(db.Integer)
    completed_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
