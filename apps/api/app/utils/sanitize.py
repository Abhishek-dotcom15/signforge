import re

_HTML_TAG_RE = re.compile(r"<[^>]+>")


def sanitize_string(value):
    """Strip HTML tags and trim whitespace from a string value."""
    if not isinstance(value, str):
        return value
    cleaned = _HTML_TAG_RE.sub("", value)
    return cleaned.strip()
