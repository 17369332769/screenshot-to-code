import json
from pathlib import Path

import pytest

from routes.design_systems import (
    DEFAULT_DESIGN_SYSTEM_ID,
    CreateDesignSystemRequest,
    UpdateDesignSystemRequest,
    create_design_system,
    delete_design_system,
    get_design_systems_file_path,
    list_design_systems,
    update_design_system,
)


@pytest.mark.asyncio
async def test_list_design_systems_bootstraps_default_design_system(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setenv("SCREENSHOT_TO_CODE_DATA_DIR", str(tmp_path))

    design_systems = await list_design_systems()

    assert len(design_systems) == 1
    assert design_systems[0].id == DEFAULT_DESIGN_SYSTEM_ID
    assert design_systems[0].name
    assert design_systems[0].content
    assert get_design_systems_file_path().exists()


@pytest.mark.asyncio
async def test_design_system_crud_persists_to_backend_file(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setenv("SCREENSHOT_TO_CODE_DATA_DIR", str(tmp_path))

    initial_design_systems = await list_design_systems()
    assert len(initial_design_systems) == 1

    created = await create_design_system(
        CreateDesignSystemRequest(name="Legal SaaS", content="Use .mockup-frame")
    )

    assert created.name == "Legal SaaS"
    assert created.content == "Use .mockup-frame"
    assert get_design_systems_file_path().exists()

    raw_items = json.loads(get_design_systems_file_path().read_text(encoding="utf-8"))
    assert any(item["id"] == created.id for item in raw_items)

    updated = await update_design_system(
        created.id,
        UpdateDesignSystemRequest(name="Legal Marketing", content="Use Roboto"),
    )

    assert updated.name == "Legal Marketing"
    assert updated.content == "Use Roboto"

    await delete_design_system(created.id)

    remaining_design_systems = await list_design_systems()
    assert len(remaining_design_systems) == 1
    assert remaining_design_systems[0].id == DEFAULT_DESIGN_SYSTEM_ID
