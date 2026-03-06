from app.extensions import db
from app.models.sign import Sign, SignCategory


def _seed_signs(app):
    with app.app_context():
        for i, (word, gloss, diff) in enumerate([
            ("Apple", "APPLE", "beginner"),
            ("Banana", "BANANA", "beginner"),
            ("Cat", "CAT", "beginner"),
            ("Dance", "DANCE", "intermediate"),
            ("Elephant", "ELEPHANT", "advanced"),
        ]):
            sign = Sign(english_word=word, gloss=gloss, difficulty=diff, hindi_word=f"hindi_{word}")
            db.session.add(sign)
            db.session.flush()
            db.session.add(SignCategory(sign_id=sign.id, category="test"))
        db.session.commit()


def test_list_signs(client, app):
    _seed_signs(app)
    resp = client.get("/api/signs")
    assert resp.status_code == 200
    data = resp.get_json()
    assert "data" in data
    assert len(data["data"]) == 5
    assert data["total"] == 5


def test_list_signs_pagination(client, app):
    _seed_signs(app)
    resp = client.get("/api/signs?page=1&perPage=2")
    data = resp.get_json()
    assert len(data["data"]) == 2
    assert data["pages"] > 1


def test_list_signs_search(client, app):
    _seed_signs(app)
    resp = client.get("/api/signs?q=Apple")
    data = resp.get_json()
    assert len(data["data"]) == 1
    assert data["data"][0]["englishWord"] == "Apple"


def test_list_signs_filter_difficulty(client, app):
    _seed_signs(app)
    resp = client.get("/api/signs?difficulty=beginner")
    data = resp.get_json()
    assert all(s["difficulty"] == "beginner" for s in data["data"])


def test_get_sign_detail(client, app):
    _seed_signs(app)
    signs = client.get("/api/signs").get_json()["data"]
    sign_id = signs[0]["id"]
    resp = client.get(f"/api/signs/{sign_id}")
    assert resp.status_code == 200
    assert resp.get_json()["id"] == sign_id


def test_get_sign_not_found(client):
    resp = client.get("/api/signs/00000000-0000-0000-0000-000000000000")
    assert resp.status_code == 404


def test_word_of_the_day(client, app):
    _seed_signs(app)
    resp = client.get("/api/signs/word-of-the-day")
    assert resp.status_code == 200
    assert "englishWord" in resp.get_json()


def test_glossary(client, app):
    _seed_signs(app)
    resp = client.get("/api/signs/glossary?letter=A")
    data = resp.get_json()
    assert data["letter"] == "A"
    assert all(s["englishWord"].startswith("A") for s in data["signs"])
