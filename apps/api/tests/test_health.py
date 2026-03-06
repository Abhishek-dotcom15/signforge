def test_health_endpoint(client):
    response = client.get("/health")
    # Returns 200 (healthy) or 503 (degraded) depending on Redis/DB availability
    assert response.status_code in (200, 503)
    data = response.get_json()
    assert data["status"] in ("healthy", "degraded")
    assert data["service"] == "signforge-api"
    assert "checks" in data


def test_register_and_login(client):
    # Register
    resp = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "testpass123",
        "fullName": "Test User",
    })
    assert resp.status_code == 201
    data = resp.get_json()
    assert "accessToken" in data
    assert data["user"]["email"] == "test@example.com"

    # Login
    resp = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "testpass123",
    })
    assert resp.status_code == 200
    data = resp.get_json()
    assert "accessToken" in data

    # Me
    token = data["accessToken"]
    resp = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.get_json()["email"] == "test@example.com"
