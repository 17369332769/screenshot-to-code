import pytest

from image_generation import quickrouter_ideogram


def test_normalize_response_with_task_metadata() -> None:
    payload = {
        "request_id": "req-123",
        "data": {
            "task_id": "task-123",
            "task_status": "submitted",
        },
    }

    assert quickrouter_ideogram._normalize_response(payload) == {
        "request_id": "req-123",
        "task_id": "task-123",
        "task_status": "submitted",
        "result_url": None,
    }


def test_normalize_response_with_direct_result_url() -> None:
    payload = {
        "request_id": "req-123",
        "data": {
            "task_id": "task-123",
            "task_status": "completed",
            "images": [{"url": "https://example.com/result.png"}],
        },
    }

    assert quickrouter_ideogram._normalize_response(payload) == {
        "request_id": "req-123",
        "task_id": "task-123",
        "task_status": "completed",
        "result_url": "https://example.com/result.png",
    }


@pytest.mark.asyncio
async def test_replace_background_quickrouter_fetches_image_and_posts_form(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    captured: dict[str, object] = {}

    class FakeResponse:
        def __init__(self, *, content: bytes = b"", headers: dict[str, str] | None = None):
            self.content = content
            self.headers = headers or {}

        def raise_for_status(self) -> None:
            return None

        def json(self) -> dict[str, object]:
            return {
                "request_id": "req-123",
                "data": {
                    "task_id": "task-123",
                    "task_status": "submitted",
                },
            }

    class FakeClient:
        def __init__(self, *args, **kwargs) -> None:
            return None

        async def __aenter__(self) -> "FakeClient":
            return self

        async def __aexit__(self, exc_type, exc, tb) -> None:
            return None

        async def get(self, image_url: str) -> FakeResponse:
            captured["image_url"] = image_url
            return FakeResponse(
                content=b"image-bytes",
                headers={"content-type": "image/png"},
            )

        async def post(
            self,
            endpoint: str,
            *,
            headers: dict[str, str],
            files: dict[str, tuple[str, bytes, str]],
            data: dict[str, str],
        ) -> FakeResponse:
            captured["endpoint"] = endpoint
            captured["headers"] = headers
            captured["files"] = files
            captured["data"] = data
            return FakeResponse()

    monkeypatch.setattr(quickrouter_ideogram.httpx, "AsyncClient", FakeClient)

    result = await quickrouter_ideogram.replace_background_quickrouter(
        "https://example.com/input.png",
        "Add a sunset beach background",
        "token-123",
    )

    assert result == {
        "request_id": "req-123",
        "task_id": "task-123",
        "task_status": "submitted",
        "result_url": None,
    }
    assert captured["image_url"] == "https://example.com/input.png"
    assert captured["endpoint"] == (
        "https://api.quickrouter.ai/ideogram/v1/ideogram-v3/replace-background"
    )
    assert captured["headers"] == {
        "Accept": "application/json",
        "Authorization": "Bearer token-123",
    }
    assert captured["data"] == {"prompt": "Add a sunset beach background"}
    assert captured["files"] == {
        "image": ("input.png", b"image-bytes", "image/png")
    }
