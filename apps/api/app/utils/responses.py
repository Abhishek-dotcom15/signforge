"""
Consistent API response helpers for SignForge.

Usage:
    from app.utils.responses import success_response, error_response, paginated_response

These helpers produce a uniform envelope so callers can always check
``response.success`` while keeping backward compatibility with existing
frontend code that reads keys directly (e.g. ``response.user``).

Envelope shapes
---------------
success_response(data, message, status)
    {"success": true, "message": "...", **data}
    When *data* is a dict its keys are merged into the top level so that
    ``response.data.user`` (axios) keeps working.  Non-dict *data* is
    placed under a ``"data"`` key.

error_response(message, status, errors)
    {"success": false, "error": "...", "errors": [...]}

paginated_response(items, total, page, per_page, extra)
    {"success": true, "data": [...], "total": N, "page": N,
     "pages": N, "perPage": N}
"""

from __future__ import annotations

import math
from typing import Any

from flask import jsonify


def success_response(
    data: Any = None,
    message: str | None = None,
    status: int = 200,
):
    """Return a successful JSON response.

    If *data* is a ``dict`` its entries are spread into the top-level
    payload so existing frontend destructuring (``response.data.user``,
    ``response.data.accessToken``, …) continues to work.
    """
    payload: dict[str, Any] = {"success": True}

    if message is not None:
        payload["message"] = message

    if data is not None:
        if isinstance(data, dict):
            payload.update(data)
        else:
            payload["data"] = data

    return jsonify(payload), status


def error_response(
    message: str,
    status: int = 400,
    errors: Any = None,
):
    """Return an error JSON response."""
    payload: dict[str, Any] = {
        "success": False,
        "error": message,
    }

    if errors is not None:
        payload["errors"] = errors

    return jsonify(payload), status


def paginated_response(
    items: list[Any],
    total: int,
    page: int,
    per_page: int,
    extra: dict[str, Any] | None = None,
):
    """Return a paginated JSON response.

    Keeps the same shape the frontend already consumes:
    ``data`` (list), ``total``, ``page``, ``pages``, ``perPage``.
    """
    pages = math.ceil(total / per_page) if per_page else 0

    payload: dict[str, Any] = {
        "success": True,
        "data": items,
        "total": total,
        "page": page,
        "pages": pages,
        "perPage": per_page,
    }

    if extra:
        payload.update(extra)

    return jsonify(payload)
