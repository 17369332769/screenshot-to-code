from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_healthz():
    response = client.get("/api/healthz")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_readyz_shape():
    response = client.get("/api/readyz")

    assert response.status_code == 200

    data = response.json()
    assert data["status"] in {"ready", "not_ready"}
    assert set(data["configuredProviders"].keys()) == {
        "openai",
        "anthropic",
        "gemini",
    }
    assert isinstance(data["message"], str)
