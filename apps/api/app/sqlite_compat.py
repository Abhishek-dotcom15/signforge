"""Apply SQLite compatibility patches for JSONB/UUID/INET when using sqlite:// DATABASE_URL."""
import os
import uuid as _uuid_mod

import sqlalchemy.dialects.sqlite.base as sqlite_base
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

if not hasattr(sqlite_base.SQLiteTypeCompiler, "visit_JSONB"):
    sqlite_base.SQLiteTypeCompiler.visit_JSONB = lambda self, type_, **kw: "JSON"
if not hasattr(sqlite_base.SQLiteTypeCompiler, "visit_UUID"):
    sqlite_base.SQLiteTypeCompiler.visit_UUID = lambda self, type_, **kw: "VARCHAR(36)"
if not hasattr(sqlite_base.SQLiteTypeCompiler, "visit_INET"):
    sqlite_base.SQLiteTypeCompiler.visit_INET = lambda self, type_, **kw: "VARCHAR(45)"

_original_uuid_bind = PG_UUID.bind_processor


def _patched_uuid_bind_processor(self, dialect):
    if dialect.name == "sqlite":
        def process(value):
            if value is not None and isinstance(value, _uuid_mod.UUID):
                return str(value)
            return value
        return process
    return _original_uuid_bind(self, dialect)


PG_UUID.bind_processor = _patched_uuid_bind_processor
