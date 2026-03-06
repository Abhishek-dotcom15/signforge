import json


def test_register_success(client):
    resp = client.post("/api/auth/register", json={
        "email": "newuser@test.com",
        "password": "securepass123",
        "fullName": "New User",
    })
    assert resp.status_code == 201
    data = resp.get_json()
    assert data["user"]["email"] == "newuser@test.com"
    assert data["user"]["fullName"] == "New User"
    assert "accessToken" in data
    assert "refreshToken" in data
    assert data["user"]["roles"] == ["learner"]


def test_register_duplicate_email(client):
    client.post("/api/auth/register", json={
        "email": "dup@test.com", "password": "pass12345", "fullName": "First"
    })
    resp = client.post("/api/auth/register", json={
        "email": "dup@test.com", "password": "pass12345", "fullName": "Second"
    })
    assert resp.status_code == 409
    assert "already registered" in resp.get_json()["error"].lower()


def test_register_validation_errors(client):
    # Missing email
    resp = client.post("/api/auth/register", json={
        "password": "pass12345", "fullName": "Test"
    })
    assert resp.status_code == 400

    # Short password
    resp = client.post("/api/auth/register", json={
        "email": "x@t.com", "password": "short", "fullName": "Test"
    })
    assert resp.status_code == 400

    # Missing fullName
    resp = client.post("/api/auth/register", json={
        "email": "x@t.com", "password": "longpassword"
    })
    assert resp.status_code == 400


def test_login_success(client):
    client.post("/api/auth/register", json={
        "email": "logintest@test.com", "password": "testpass123", "fullName": "Login Test"
    })
    resp = client.post("/api/auth/login", json={
        "email": "logintest@test.com", "password": "testpass123"
    })
    assert resp.status_code == 200
    data = resp.get_json()
    assert "accessToken" in data
    assert data["user"]["email"] == "logintest@test.com"


def test_login_wrong_password(client):
    client.post("/api/auth/register", json={
        "email": "wrongpw@test.com", "password": "correct123", "fullName": "Test"
    })
    resp = client.post("/api/auth/login", json={
        "email": "wrongpw@test.com", "password": "wrong12345"
    })
    assert resp.status_code == 401
    assert "invalid" in resp.get_json()["error"].lower()


def test_login_nonexistent_user(client):
    resp = client.post("/api/auth/login", json={
        "email": "noone@test.com", "password": "whatever123"
    })
    assert resp.status_code == 401


def test_me_endpoint(client):
    reg = client.post("/api/auth/register", json={
        "email": "me@test.com", "password": "testpass123", "fullName": "Me Test"
    })
    token = reg.get_json()["accessToken"]
    resp = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.get_json()["email"] == "me@test.com"


def test_me_without_token(client):
    resp = client.get("/api/auth/me")
    assert resp.status_code == 401


def test_refresh_token(client):
    reg = client.post("/api/auth/register", json={
        "email": "refresh@test.com", "password": "testpass123", "fullName": "Refresh"
    })
    refresh_token = reg.get_json()["refreshToken"]
    resp = client.post("/api/auth/refresh", headers={
        "Authorization": f"Bearer {refresh_token}"
    })
    assert resp.status_code == 200
    data = resp.get_json()
    assert "accessToken" in data


def test_logout(client):
    reg = client.post("/api/auth/register", json={
        "email": "logout@test.com", "password": "testpass123", "fullName": "Logout"
    })
    token = reg.get_json()["accessToken"]
    resp = client.post("/api/auth/logout", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200


def test_register_with_deaf_flag(client):
    resp = client.post("/api/auth/register", json={
        "email": "deaf@test.com", "password": "testpass123",
        "fullName": "Deaf User", "isDeaf": True,
    })
    assert resp.status_code == 201
    assert resp.get_json()["user"]["isDeaf"] is True
