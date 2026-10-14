import pytest


@pytest.mark.asyncio
async def test_health(client):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


@pytest.mark.asyncio
async def test_chat_empty_message(client):
    response = await client.post("/api/v1/chat", json={"message": ""})
    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_agent_status(client):
    response = await client.get("/api/v1/status")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_chat_greeting(client):
    response = await client.post("/api/v1/chat", json={"message": "hello"})
    assert response.status_code == 200
    data = response.json()
    assert "Xin chào Quý khách" in data["response"]
    assert data["citations"] == []
    assert data["has_grounding"] is True
