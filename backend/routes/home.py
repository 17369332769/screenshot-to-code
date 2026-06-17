from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from typing_extensions import TypedDict

from config import ANTHROPIC_API_KEY, GEMINI_API_KEY, OPENAI_API_KEY


router = APIRouter()


class ProviderConfigStatus(TypedDict):
    openai: bool
    anthropic: bool
    gemini: bool


class ReadinessResponse(TypedDict):
    status: str
    configuredProviders: ProviderConfigStatus
    message: str


@router.get("/")
async def get_status():
    return HTMLResponse(
        content="<h3>Your backend is running correctly. Please open the front-end URL (default is http://localhost:5173) to use screenshot-to-code.</h3>"
    )


@router.get("/api/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/api/readyz")
async def readyz() -> ReadinessResponse:
    configured_providers: ProviderConfigStatus = {
        "openai": bool(OPENAI_API_KEY),
        "anthropic": bool(ANTHROPIC_API_KEY),
        "gemini": bool(GEMINI_API_KEY),
    }

    is_ready = any(configured_providers.values())

    return {
        "status": "ready" if is_ready else "not_ready",
        "configuredProviders": configured_providers,
        "message": (
            "At least one model provider is configured."
            if is_ready
            else "No model provider is configured yet."
        ),
    }
