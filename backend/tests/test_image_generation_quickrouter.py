import pytest

from image_generation import quickrouter


def test_extract_output_url_from_openai_style_url_payload() -> None:
    result = {
        "data": [
            {
                "url": "https://example.com/generated.png",
            }
        ]
    }

    assert (
        quickrouter._extract_output_url(result, "png")
        == "https://example.com/generated.png"
    )


def test_extract_output_url_from_openai_style_b64_payload() -> None:
    result = {
        "data": [
            {
                "b64_json": "YWJj",
            }
        ]
    }

    assert (
        quickrouter._extract_output_url(result, "png")
        == "data:image/png;base64,YWJj"
    )


@pytest.mark.asyncio
async def test_generate_image_quickrouter_posts_expected_payload(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    captured: dict[str, object] = {}

    class FakeResponse:
        def raise_for_status(self) -> None:
            return None

        def json(self) -> dict[str, object]:
            return {"data": [{"url": "https://example.com/generated.png"}]}

    class FakeClient:
        async def __aenter__(self) -> "FakeClient":
            return self

        async def __aexit__(self, exc_type, exc, tb) -> None:
            return None

        async def post(
            self,
            endpoint: str,
            *,
            headers: dict[str, str],
            json: dict[str, object],
            timeout: int,
        ) -> FakeResponse:
            captured["endpoint"] = endpoint
            captured["headers"] = headers
            captured["json"] = json
            captured["timeout"] = timeout
            return FakeResponse()

    monkeypatch.setattr(quickrouter.httpx, "AsyncClient", FakeClient)

    result = await quickrouter.generate_image_quickrouter(
        "A cute cat",
        "token-123",
        "https://api.quickrouter.ai/v1",
        "gpt-image-2-all",
    )

    assert result == "https://example.com/generated.png"
    assert captured["endpoint"] == "https://api.quickrouter.ai/v1/images/generations"
    assert captured["headers"] == {
        "Authorization": "Bearer token-123",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    assert captured["json"] == {
        "model": "gpt-image-2-all",
        "prompt": "A cute cat",
        "n": 1,
        "size": "1024x1024",
        "quality": "low",
        "format": "png",
    }
    assert captured["timeout"] == 120
