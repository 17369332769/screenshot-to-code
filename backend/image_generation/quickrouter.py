import base64
from typing import Any, Mapping, cast

import httpx


def _build_headers(api_token: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


def _extract_output_url(result: Any, image_format: str) -> str:
    if isinstance(result, str) and result:
        return result

    if isinstance(result, dict):
        direct_url = cast(Any, result.get("url"))
        if isinstance(direct_url, str) and direct_url:
            return direct_url

        data = cast(Any, result.get("data"))
        if isinstance(data, list) and data:
            first = cast(Any, data[0])
            if isinstance(first, str) and first:
                return first
            if isinstance(first, Mapping):
                item_url = cast(Any, first.get("url"))
                if isinstance(item_url, str) and item_url:
                    return item_url
                b64_json = cast(Any, first.get("b64_json"))
                if isinstance(b64_json, str) and b64_json:
                    return f"data:image/{image_format};base64,{b64_json}"

        image_base64 = cast(Any, result.get("b64_json"))
        if isinstance(image_base64, str) and image_base64:
            return f"data:image/{image_format};base64,{image_base64}"

    if isinstance(result, list) and result:
        first = cast(Any, result[0])
        if isinstance(first, str) and first:
            return first
        if isinstance(first, Mapping):
            item_url = cast(Any, first.get("url"))
            if isinstance(item_url, str) and item_url:
                return item_url
            b64_json = cast(Any, first.get("b64_json"))
            if isinstance(b64_json, str) and b64_json:
                return f"data:image/{image_format};base64,{b64_json}"

    raise ValueError(f"Unexpected QuickRouter image response: {result}")


async def generate_image_quickrouter(
    prompt: str,
    api_key: str,
    base_url: str,
    model: str,
    *,
    image_format: str = "png",
    quality: str = "low",
    size: str = "1024x1024",
) -> str:
    endpoint = f"{base_url.rstrip('/')}/images/generations"
    payload = {
        "model": model,
        "prompt": prompt,
        "n": 1,
        "size": size,
        "quality": quality,
        "format": image_format,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            endpoint,
            headers=_build_headers(api_key),
            json=payload,
            timeout=120,
        )
        response.raise_for_status()
        result = response.json()

    return _extract_output_url(result, image_format)
