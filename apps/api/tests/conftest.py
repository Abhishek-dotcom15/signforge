import uuid as _uuid_mod

import pytest
import sqlalchemy.dialects.sqlite.base as sqlite_base
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

# Monkey-patch PostgreSQL types to work with SQLite for testing
if not hasattr(sqlite_base.SQLiteTypeCompiler, 'visit_JSONB'):
    sqlite_base.SQLiteTypeCompiler.visit_JSONB = lambda self, type_, **kw: "JSON"
if not hasattr(sqlite_base.SQLiteTypeCompiler, 'visit_UUID'):
    sqlite_base.SQLiteTypeCompiler.visit_UUID = lambda self, type_, **kw: "VARCHAR(36)"
if not hasattr(sqlite_base.SQLiteTypeCompiler, 'visit_INET'):
    sqlite_base.SQLiteTypeCompiler.visit_INET = lambda self, type_, **kw: "VARCHAR(45)"

# Patch UUID bind_processor so string UUIDs work with SQLite
_original_uuid_bind_processor = PG_UUID.bind_processor


def _patched_uuid_bind_processor(self, dialect):
    if dialect.name == "sqlite":
        def process(value):
            if value is not None:
                if isinstance(value, _uuid_mod.UUID):
                    return str(value)
                return str(value)
            return value
        return process
    return _original_uuid_bind_processor(self, dialect)


PG_UUID.bind_processor = _patched_uuid_bind_processor

from app import create_app
from app.config import TestConfig
from app.extensions import db as _db


@pytest.fixture(scope="session")
def app():
    app = create_app(TestConfig)
    with app.app_context():
        _db.create_all()
        yield app
        _db.drop_all()


@pytest.fixture(scope="function")
def client(app):
    with app.test_client() as client:
        with app.app_context():
            yield client
            # Clean up all tables after each test to avoid cross-test pollution
            for table in reversed(_db.metadata.sorted_tables):
                _db.session.execute(table.delete())
            _db.session.commit()


@pytest.fixture(scope="function")
def db(app):
    with app.app_context():
        _db.session.begin_nested()
        yield _db
        _db.session.rollback()
