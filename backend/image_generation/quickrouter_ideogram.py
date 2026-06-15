import mimetypes
from pathlib import Path
from typing import Any, Mapping, cast
from urllib.parse import urlparse

import httpx


def _build_headers(api_token: str) -> dict[str, str]:
    return {
        "Accept": "application/json",
        "Authorization": f"Bearer {api_token}",
    }


def _guess_filename(image_url: str, content_type: str | None) -> str:
    parsed = urlparse(image_url)
    name = Path(parsed.path).name
    if name:
        return name

    guessed_ext = mimetypes.guess_extension(content_type or "") or ".png"
    return f"image{guessed_ext}"


def _extract_result_url(payload: Mapping[str, Any]) -> str | None:
    direct_url = cast(Any, payload.get("url"))
    if isinstance(direct_url, str) and direct_url:
        return direct_url

    data = cast(Any, payload.get("data"))
    if isinstance(data, Mapping):
        nested_url = cast(Any, data.get("url"))
        if isinstance(nested_url, str) and nested_url:
            return nested_url

        image_url = cast(Any, data.get("image_url"))
        if isinstance(image_url, str) and image_url:
            return image_url

        images = cast(Any, data.get("images"))
        if isinstance(images, list) and images:
            first = cast(Any, images[0])
            if isinstance(first, Mapping):
                first_url = cast(Any, first.get("url"))
                if isinstance(first_url, str) and first_url:
                    return first_url
                first_image_url = cast(Any, first.get("image_url"))
                if isinstance(first_image_url, str) and first_image_url:
                    return first_image_url
            if isinstance(first, str) and first:
                return first

    return None


def _normalize_response(payload: Mapping[str, Any]) -> dict[str, Any]:
    request_id = cast(Any, payload.get("request_id"))
    data = cast(Any, payload.get("data"))
    result: dict[str, Any] = {
        "request_id": request_id if isinstance(request_id, str) else None,
        "task_id": None,
        "task_status": None,
        "result_url": _extract_result_url(payload),
    }

    if isinstance(data, Mapping):
        task_id = cast(Any, data.get("task_id"))
        task_status = cast(Any, data.get("task_status"))
        if isinstance(task_id, str):
            result["task_id"] = task_id
        if isinstance(task_status, str):
            result["task_status"] = task_status

    return result


async def replace_background_quickrouter(
    image_url: str,
    prompt: str,
    api_key: str,
    *,
    base_url: str = "https://api.quickrouter.ai",
) -> dict[str, Any]:
    endpoint = f"{base_url.rstrip('/')}/ideogram/v1/ideogram-v3/replace-background"

    async with httpx.AsyncClient(timeout=120) as client:
        image_response = await client.get(image_url)
        image_response.raise_for_status()
        content_type = image_response.headers.get("content-type", "image/png")
        filename = _guess_filename(image_url, content_type)

        files = {
            "image": (
                filename,
                image_response.content,
                content_type,
            )
        }
        data = {"prompt": prompt}

        response = await client.post(
            endpoint,
            headers=_build_headers(api_key),
            files=files,
            data=data,
        )
        response.raise_for_status()
        payload = response.json()

    if not isinstance(payload, Mapping):
        raise ValueError(f"Unexpected QuickRouter Ideogram response: {payload}")

    return _normalize_response(payload)
