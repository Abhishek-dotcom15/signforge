from app.extensions import db
from app.models.story import Story, StoryChapter


def _seed_story(app):
    with app.app_context():
        story = Story(
            title_en="Test Story",
            title_hi="टेस्ट",
            slug="test-story",
            summary_en="A test story",
            theme="animal",
            difficulty="beginner",
            chapter_count=2,
            is_published=True,
        )
        db.session.add(story)
        db.session.flush()
        for i in range(1, 3):
            db.session.add(StoryChapter(
                story_id=story.id,
                chapter_num=i,
                title_en=f"Chapter {i}",
                content_en=f"Content for chapter {i}",
                isl_glosses=f"GLOSS-{i}",
                sigml_sequence=[],
            ))
        db.session.commit()
        return str(story.id)


def test_list_stories(client, app):
    _seed_story(app)
    resp = client.get("/api/stories")
    assert resp.status_code == 200
    data = resp.get_json()
    assert len(data["data"]) >= 1


def test_get_story(client, app):
    story_id = _seed_story(app)
    resp = client.get(f"/api/stories/{story_id}")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["titleEn"] == "Test Story"
    assert len(data["chapters"]) == 2


def test_get_chapter(client, app):
    story_id = _seed_story(app)
    resp = client.get(f"/api/stories/{story_id}/chapters/1")
    assert resp.status_code == 200
    assert resp.get_json()["chapterNum"] == 1


def test_story_progress(client, app):
    story_id = _seed_story(app)
    # Register and get token
    reg = client.post("/api/auth/register", json={
        "email": "progress@test.com", "password": "testpass123", "fullName": "Progress"
    })
    token = reg.get_json()["accessToken"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get initial progress
    resp = client.get(f"/api/stories/{story_id}/progress", headers=headers)
    assert resp.status_code == 200
    assert resp.get_json()["status"] == "not_started"

    # Update progress
    resp = client.put(f"/api/stories/{story_id}/progress", headers=headers, json={
        "status": "in_progress", "currentChapter": 2, "completionPct": 50
    })
    assert resp.status_code == 200

    # Verify
    resp = client.get(f"/api/stories/{story_id}/progress", headers=headers)
    assert resp.get_json()["status"] == "in_progress"
    assert resp.get_json()["currentChapter"] == 2
