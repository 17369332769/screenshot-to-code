import pytest

from image_generation import runninghub


def test_extract_task_id_from_submit_response() -> None:
    assert (
        runninghub._extract_task_id({"taskId": "task-123", "status": "RUNNING"})
        == "task-123"
    )


def test_extract_output_url_from_success_response() -> None:
    response: dict[str, object] = {
        "status": "SUCCESS",
        "results": [
            {
                "url": "https://example.com/generated.png",
                "outputType": "png",
            }
        ],
    }

    assert runninghub._extract_output_url(response) == "https://example.com/generated.png"


@pytest.mark.asyncio
async def test_generate_image_runninghub_submits_and_queries_task(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    captured: list[dict[str, object]] = []

    class FakeResponse:
        def __init__(self, payload: dict[str, object]) -> None:
            self._payload = payload

        def raise_for_status(self) -> None:
            return None

        def json(self) -> dict[str, object]:
            return self._payload

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
            captured.append(
                {
                    "endpoint": endpoint,
                    "headers": headers,
                    "json": json,
                    "timeout": timeout,
                }
            )
            if endpoint.endswith("/openapi/v2/rhart-image-g-2-official/text-to-image"):
                return FakeResponse({"taskId": "task-123", "status": "RUNNING"})
            return FakeResponse(
                {
                    "taskId": "task-123",
                    "status": "SUCCESS",
                    "results": [{"url": "https://example.com/generated.png"}],
                }
            )

    async def fake_sleep(_: float) -> None:
        return None

    monkeypatch.setattr(runninghub.httpx, "AsyncClient", FakeClient)
    monkeypatch.setattr(runninghub.asyncio, "sleep", fake_sleep)

    result = await runninghub.generate_image_runninghub(
        "A bright landing page hero illustration",
        "token-123",
        "https://www.runninghub.cn",
        "rhart-image-g-2-official/text-to-image",
    )

    assert result == "https://example.com/generated.png"
    assert captured == [
        {
            "endpoint": "https://www.runninghub.cn/openapi/v2/rhart-image-g-2-official/text-to-image",
            "headers": {
                "Authorization": "Bearer token-123",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            "json": {
                "prompt": "A bright landing page hero illustration",
                "aspectRatio": "1:1",
                "resolution": "1k",
                "quality": "low",
            },
            "timeout": 120,
        },
        {
            "endpoint": "https://www.runninghub.cn/openapi/v2/query",
            "headers": {
                "Authorization": "Bearer token-123",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            "json": {"taskId": "task-123"},
            "timeout": 120,
        },
    ]


@pytest.mark.asyncio
async def test_generate_image_runninghub_raises_on_failed_task(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    class FakeResponse:
        def __init__(self, payload: dict[str, object]) -> None:
            self._payload = payload

        def raise_for_status(self) -> None:
            return None

        def json(self) -> dict[str, object]:
            return self._payload

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
            if endpoint.endswith("/openapi/v2/query"):
                return FakeResponse(
                    {
                        "taskId": "task-123",
                        "status": "FAILED",
                        "errorCode": "BAD_PROMPT",
                        "errorMessage": "Prompt rejected",
                    }
                )
            return FakeResponse({"taskId": "task-123", "status": "RUNNING"})

    async def fake_sleep(_: float) -> None:
        return None

    monkeypatch.setattr(runninghub.httpx, "AsyncClient", FakeClient)
    monkeypatch.setattr(runninghub.asyncio, "sleep", fake_sleep)

    with pytest.raises(ValueError, match="BAD_PROMPT"):
        await runninghub.generate_image_runninghub(
            "test",
            "token-123",
            "https://www.runninghub.cn",
            "rhart-image-g-2-official/text-to-image",
        )
