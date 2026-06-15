import base64
from pathlib import Path

import pytest

from agent.state import AgentFileState
from agent.tools.runtime import AgentToolRuntime
from agent.tools.types import ToolCall
from uploaded_assets import persist_data_url_as_temporary_asset


def _data_url(payload: bytes, content_type: str = "image/png") -> str:
    encoded = base64.b64encode(payload).decode("ascii")
    return f"data:{content_type};base64,{encoded}"


def test_edit_file_returns_structured_result_with_diff() -> None:
    runtime = AgentToolRuntime(
        file_state=AgentFileState(
            path="index.html",
            content="<div>before</div>\n<p>keep</p>\n",
        ),
        should_generate_images=False,
        openai_api_key=None,
        openai_base_url=None,
    )

    result = runtime._edit_file(
        {
            "old_text": "<div>before</div>",
            "new_text": "<div>after</div>",
        }
    )

    assert result.ok is True
    assert result.updated_content == "<div>after</div>\n<p>keep</p>\n"
    assert result.result["content"] == "Successfully edited file at index.html."
    assert set(result.result["details"].keys()) == {"diff", "firstChangedLine"}
    assert result.result["details"]["firstChangedLine"] == 1
    assert "--- index.html" in result.result["details"]["diff"]
    assert "+++ index.html" in result.result["details"]["diff"]
    assert "-<div>before</div>" in result.result["details"]["diff"]
    assert "+<div>after</div>" in result.result["details"]["diff"]
    assert result.summary["firstChangedLine"] == 1
    assert result.summary["diff"] == result.result["details"]["diff"]


@pytest.mark.asyncio
async def test_execute_edit_file_uses_updated_result_shape() -> None:
    runtime = AgentToolRuntime(
        file_state=AgentFileState(path="index.html", content="<main>old</main>"),
        should_generate_images=False,
        openai_api_key=None,
        openai_base_url=None,
    )

    result = await runtime.execute(
        ToolCall(
            id="call-1",
            name="edit_file",
            arguments={"old_text": "old", "new_text": "new"},
        )
    )

    # execute() is sync for edit_file and should preserve the structured payload.
    assert result.ok is True
    assert result.result["content"] == "Successfully edited file at index.html."
    assert set(result.result["details"].keys()) == {"diff", "firstChangedLine"}
    assert "--- index.html" in result.result["details"]["diff"]


@pytest.mark.asyncio
async def test_save_assets_promotes_temporary_asset_id(
    monkeypatch: pytest.MonkeyPatch,
    tmp_path: Path,
) -> None:
    temp_dir = tmp_path / "tmp-assets"
    asset_dir = tmp_path / "local-assets"
    monkeypatch.setattr("uploaded_assets.store.TEMP_ASSET_DIR", str(temp_dir))
    monkeypatch.setattr("uploaded_assets.store.LOCAL_ASSET_DIR", str(asset_dir))

    temp_asset = persist_data_url_as_temporary_asset(
        _data_url(b"image-bytes"),
        "http://127.0.0.1:7001",
    )
    assert temp_asset is not None

    runtime = AgentToolRuntime(
        file_state=AgentFileState(),
        should_generate_images=False,
        openai_api_key=None,
        openai_base_url=None,
    )

    result = await runtime.execute(
        ToolCall(
            id="call-1",
            name="save_assets",
            arguments={"asset_ids": [temp_asset.asset_id]},
        )
    )

    assert result.ok is True
    images = result.result["images"]
    assert len(images) == 1
    assert images[0]["asset_id"] == temp_asset.asset_id
    assert images[0]["status"] == "ok"
    assert images[0]["public_url"].startswith(
        "http://127.0.0.1:7001/local-assets/"
    )
    assert temp_asset.asset_id not in images[0]["public_url"]
    assert len(list(asset_dir.iterdir())) == 1


@pytest.mark.asyncio
async def test_generate_images_prefers_quickrouter_when_key_present(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    captured: dict[str, object] = {}

    async def fake_process_tasks(
        prompts: list[str],
        api_key: str,
        base_url: str | None,
        model: str,
    ) -> list[str]:
        captured["prompts"] = prompts
        captured["api_key"] = api_key
        captured["base_url"] = base_url
        captured["model"] = model
        return ["https://example.com/generated.png"]

    monkeypatch.setattr("agent.tools.runtime.QUICKROUTER_IMAGE_API_KEY", "quick-key")
    monkeypatch.setattr(
        "agent.tools.runtime.QUICKROUTER_IMAGE_BASE_URL",
        "https://api.quickrouter.ai/v1",
    )
    monkeypatch.setattr("agent.tools.runtime.REPLICATE_API_KEY", "replicate-key")
    monkeypatch.setattr("agent.tools.runtime.process_tasks", fake_process_tasks)

    runtime = AgentToolRuntime(
        file_state=AgentFileState(),
        should_generate_images=True,
        openai_api_key="openai-key",
        openai_base_url="https://vip-sg.freemodel.dev",
    )

    result = await runtime.execute(
        ToolCall(
            id="call-1",
            name="generate_images",
            arguments={"prompts": ["hero banner"]},
        )
    )

    assert result.ok is True
    assert captured == {
        "prompts": ["hero banner"],
        "api_key": "quick-key",
        "base_url": "https://api.quickrouter.ai/v1",
        "model": "quickrouter",
    }


@pytest.mark.asyncio
async def test_replace_background_uses_quickrouter_when_key_present(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    async def fake_replace_background_quickrouter(
        image_url: str,
        prompt: str,
        api_key: str,
        *,
        base_url: str = "https://api.quickrouter.ai",
    ) -> dict[str, str]:
        return {
            "request_id": "req-123",
            "task_id": "task-123",
            "task_status": "submitted",
            "result_url": "https://example.com/replaced.png",
        }

    monkeypatch.setattr("agent.tools.runtime.QUICKROUTER_IMAGE_API_KEY", "quick-key")
    monkeypatch.setattr(
        "agent.tools.runtime.replace_background_quickrouter",
        fake_replace_background_quickrouter,
    )

    runtime = AgentToolRuntime(
        file_state=AgentFileState(),
        should_generate_images=True,
        openai_api_key="openai-key",
        openai_base_url="https://vip-sg.freemodel.dev",
    )

    result = await runtime.execute(
        ToolCall(
            id="call-1",
            name="replace_background",
            arguments={
                "image_urls": ["https://example.com/input.png"],
                "prompt": "Replace the background with a cozy cafe interior",
            },
        )
    )

    assert result.ok is True
    assert result.result["images"] == [
        {
            "image_url": "https://example.com/input.png",
            "prompt": "Replace the background with a cozy cafe interior",
            "result_url": "https://example.com/replaced.png",
            "task_id": "task-123",
            "task_status": "submitted",
            "request_id": "req-123",
            "status": "ok",
        }
    ]
