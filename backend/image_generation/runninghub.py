import asyncio
from typing import Any, Mapping, cast

import httpx


QUERY_ENDPOINT = "/openapi/v2/query"
POLL_INTERVAL_SECONDS = 0.5
MAX_POLLS = 240


def _build_headers(api_token: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


def _extract_task_id(response_json: Mapping[str, Any]) -> str:
    task_id = response_json.get("taskId")
    if not isinstance(task_id, str) or not task_id:
        raise ValueError("Task ID not found in RunningHub response.")
    return task_id


def _extract_output_url(response_json: Mapping[str, Any]) -> str:
    results = response_json.get("results")
    if not isinstance(results, list) or not results:
        raise ValueError(f"Unexpected RunningHub results payload: {results}")

    first = cast(Any, results[0])
    if not isinstance(first, Mapping):
        raise ValueError(f"Unexpected RunningHub result item: {first}")

    url = cast(Any, first.get("url"))
    if isinstance(url, str) and url:
        return url

    raise ValueError(f"RunningHub result URL not found: {first}")


def _extract_error_message(response_json: Mapping[str, Any]) -> str:
    error_code = response_json.get("errorCode")
    error_message = response_json.get("errorMessage")
    failed_reason = response_json.get("failedReason")

    parts = [
        str(value).strip()
        for value in (error_code, error_message, failed_reason)
        if value not in (None, "", {})
    ]
    return " | ".join(parts) or "Unknown RunningHub task failure"


async def _poll_task(
    client: httpx.AsyncClient,
    base_url: str,
    api_token: str,
    task_id: str,
) -> dict[str, Any]:
    endpoint = f"{base_url.rstrip('/')}{QUERY_ENDPOINT}"
    payload = {"taskId": task_id}

    for _ in range(MAX_POLLS):
        await asyncio.sleep(POLL_INTERVAL_SECONDS)
        response = await client.post(
            endpoint,
            headers=_build_headers(api_token),
            json=payload,
            timeout=120,
        )
        response.raise_for_status()
        response_json = response.json()
        if not isinstance(response_json, dict):
            raise ValueError("Invalid RunningHub query response.")

        status = cast(Any, response_json.get("status"))
        if status == "SUCCESS":
            return cast(dict[str, Any], response_json)
        if status in {"FAILED", "ERROR", "CANCELLED"}:
            raise ValueError(_extract_error_message(response_json))

    raise TimeoutError("RunningHub task timed out")


async def generate_image_runninghub(
    prompt: str,
    api_token: str,
    base_url: str,
    model: str,
    *,
    aspect_ratio: str = "1:1",
    resolution: str = "1k",
    quality: str = "low",
) -> str:
    endpoint = f"{base_url.rstrip('/')}/openapi/v2/{model.lstrip('/')}"
    payload = {
        "prompt": prompt,
        "aspectRatio": aspect_ratio,
        "resolution": resolution,
        "quality": quality,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            endpoint,
            headers=_build_headers(api_token),
            json=payload,
            timeout=120,
        )
        response.raise_for_status()
        response_json = response.json()
        if not isinstance(response_json, dict):
            raise ValueError("Invalid RunningHub task creation response.")

        task_id = _extract_task_id(response_json)
        final_response = await _poll_task(client, base_url, api_token, task_id)

    return _extract_output_url(final_response)
