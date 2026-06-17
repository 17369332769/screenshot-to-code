import hashlib
import json
import os
import secrets
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, cast
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Request, Response
from pydantic import BaseModel
from starlette.requests import HTTPConnection
from typing_extensions import TypedDict

from config import ENABLE_AUTH, FREE_GENERATIONS_PER_USER

router = APIRouter()

SESSION_COOKIE_NAME = "stc_session"


class SessionRecord(TypedDict):
    tokenHash: str
    createdAt: str


class UsageRecord(TypedDict):
    totalGenerations: int
    remainingFreeGenerations: int
    updatedAt: str


class UserRecord(TypedDict):
    id: str
    email: str
    createdAt: str
    usage: UsageRecord
    sessions: list[SessionRecord]


class ProjectRecord(TypedDict):
    id: str
    userId: str
    name: str
    createdAt: str
    updatedAt: str
    appState: str
    stack: str | None
    inputMode: str | None
    initialPrompt: str
    referenceImages: list[str]
    commits: dict[str, Any]
    head: str | None
    latestCommitHash: str | None


class LoginRequest(BaseModel):
    email: str


class SaveProjectRequest(BaseModel):
    name: str
    appState: str
    stack: str | None = None
    inputMode: str | None = None
    initialPrompt: str = ""
    referenceImages: list[str] = []
    commits: dict[str, Any]
    head: str | None = None
    latestCommitHash: str | None = None


class UpdateProjectRequest(SaveProjectRequest):
    pass


def utc_timestamp() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_data_dir() -> Path:
    data_dir = os.environ.get("SCREENSHOT_TO_CODE_DATA_DIR")
    return Path(data_dir).expanduser() if data_dir else Path.home() / ".screenshot-to-code"


def get_users_file_path() -> Path:
    return get_data_dir() / "users.json"


def get_projects_file_path() -> Path:
    return get_data_dir() / "projects.json"


def read_json_file(path: Path) -> list[Any]:
    if not path.exists():
        return []

    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=500, detail=f"Invalid JSON storage at {path.name}") from exc

    if not isinstance(payload, list):
        raise HTTPException(status_code=500, detail=f"{path.name} must contain a list")

    return cast(list[Any], payload)


def write_json_file(path: Path, payload: list[Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_suffix(f"{path.suffix}.tmp")
    tmp_path.write_text(f"{json.dumps(payload, indent=2)}\n", encoding="utf-8")
    tmp_path.replace(path)


def read_users() -> list[UserRecord]:
    return cast(list[UserRecord], read_json_file(get_users_file_path()))


def write_users(users: list[UserRecord]) -> None:
    write_json_file(get_users_file_path(), cast(list[Any], users))


def read_projects() -> list[ProjectRecord]:
    return cast(list[ProjectRecord], read_json_file(get_projects_file_path()))


def write_projects(projects: list[ProjectRecord]) -> None:
    write_json_file(get_projects_file_path(), cast(list[Any], projects))


def normalize_project_name(name: str) -> str:
    normalized = name.strip()
    if not normalized:
        raise HTTPException(status_code=400, detail="Project name is required")
    return normalized[:120]


def normalize_email(email: str) -> str:
    normalized = email.strip().lower()
    if "@" not in normalized or "." not in normalized.split("@")[-1]:
        raise HTTPException(status_code=400, detail="Valid email is required")
    return normalized


def hash_session_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def require_auth_enabled() -> None:
    if not ENABLE_AUTH:
        raise HTTPException(status_code=404, detail="Auth is disabled")


def create_user(email: str) -> UserRecord:
    timestamp = utc_timestamp()
    return UserRecord(
        id=str(uuid4()),
        email=normalize_email(email),
        createdAt=timestamp,
        usage=UsageRecord(
            totalGenerations=0,
            remainingFreeGenerations=FREE_GENERATIONS_PER_USER,
            updatedAt=timestamp,
        ),
        sessions=[],
    )


def find_user_by_email(users: list[UserRecord], email: str) -> UserRecord | None:
    normalized_email = normalize_email(email)
    return next((user for user in users if user["email"] == normalized_email), None)


def get_authenticated_user(request: HTTPConnection) -> UserRecord:
    require_auth_enabled()
    token = request.cookies.get(SESSION_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required")

    token_hash = hash_session_token(token)
    users = read_users()
    for user in users:
        if any(session["tokenHash"] == token_hash for session in user["sessions"]):
            return user

    raise HTTPException(status_code=401, detail="Session expired")


def get_authenticated_user_with_index(request: HTTPConnection) -> tuple[list[UserRecord], int]:
    token = request.cookies.get(SESSION_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required")

    token_hash = hash_session_token(token)
    users = read_users()
    for index, user in enumerate(users):
        if any(session["tokenHash"] == token_hash for session in user["sessions"]):
            return users, index

    raise HTTPException(status_code=401, detail="Session expired")


def build_public_user(user: UserRecord) -> dict[str, Any]:
    return {
        "id": user["id"],
        "email": user["email"],
        "createdAt": user["createdAt"],
    }


def build_usage_response(user: UserRecord) -> dict[str, Any]:
    usage = user["usage"]
    return {
        "totalGenerations": usage["totalGenerations"],
        "remainingFreeGenerations": usage["remainingFreeGenerations"],
        "limit": FREE_GENERATIONS_PER_USER,
    }


def consume_generation_credit_for_user_id(user_id: str) -> None:
    if not ENABLE_AUTH:
        return

    users = read_users()
    for index, user in enumerate(users):
        if user["id"] != user_id:
            continue

        remaining = user["usage"]["remainingFreeGenerations"]
        if remaining <= 0:
            raise HTTPException(status_code=402, detail="Free generation limit reached")

        updated_user = cast(UserRecord, dict(user))
        updated_usage = cast(UsageRecord, dict(user["usage"]))
        updated_usage["totalGenerations"] += 1
        updated_usage["remainingFreeGenerations"] = remaining - 1
        updated_usage["updatedAt"] = utc_timestamp()
        updated_user["usage"] = updated_usage
        users[index] = updated_user
        write_users(users)
        return

    raise HTTPException(status_code=401, detail="User not found")


@router.post("/api/auth/login")
async def login(request: LoginRequest, response: Response) -> dict[str, Any]:
    require_auth_enabled()
    users = read_users()
    user = find_user_by_email(users, request.email)

    if user is None:
        user = create_user(request.email)
        users.append(user)

    token = secrets.token_urlsafe(32)
    updated_user = cast(UserRecord, dict(user))
    updated_sessions = list(user["sessions"])
    updated_sessions = updated_sessions[-9:]
    updated_sessions.append(
        SessionRecord(
            tokenHash=hash_session_token(token),
            createdAt=utc_timestamp(),
        )
    )
    updated_user["sessions"] = updated_sessions

    for index, existing_user in enumerate(users):
        if existing_user["id"] == user["id"]:
            users[index] = updated_user
            break

    write_users(users)

    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=60 * 60 * 24 * 30,
    )

    return {
        "user": build_public_user(updated_user),
        "usage": build_usage_response(updated_user),
    }


@router.post("/api/auth/logout")
async def logout(request: Request, response: Response) -> dict[str, bool]:
    require_auth_enabled()
    token = request.cookies.get(SESSION_COOKIE_NAME)
    if token:
        token_hash = hash_session_token(token)
        users = read_users()
        for index, user in enumerate(users):
            next_sessions = [
                session for session in user["sessions"] if session["tokenHash"] != token_hash
            ]
            if len(next_sessions) != len(user["sessions"]):
                updated_user = cast(UserRecord, dict(user))
                updated_user["sessions"] = next_sessions
                users[index] = updated_user
                write_users(users)
                break

    response.delete_cookie(SESSION_COOKIE_NAME)
    return {"ok": True}


@router.get("/api/me")
async def me(request: Request) -> dict[str, Any]:
    require_auth_enabled()
    user = get_authenticated_user(request)
    return {
        "user": build_public_user(user),
        "usage": build_usage_response(user),
    }


@router.get("/api/usage")
async def usage(request: Request) -> dict[str, Any]:
    require_auth_enabled()
    user = get_authenticated_user(request)
    return build_usage_response(user)


@router.get("/api/projects")
async def list_projects(request: Request) -> list[ProjectRecord]:
    require_auth_enabled()
    user = get_authenticated_user(request)
    projects = [
        project
        for project in read_projects()
        if project["userId"] == user["id"]
    ]
    projects.sort(key=lambda item: item["updatedAt"], reverse=True)
    return projects


@router.post("/api/projects")
async def create_project(request: Request, payload: SaveProjectRequest) -> ProjectRecord:
    require_auth_enabled()
    user = get_authenticated_user(request)
    timestamp = utc_timestamp()
    project: ProjectRecord = {
        "id": str(uuid4()),
        "userId": user["id"],
        "name": normalize_project_name(payload.name),
        "createdAt": timestamp,
        "updatedAt": timestamp,
        "appState": payload.appState,
        "stack": payload.stack,
        "inputMode": payload.inputMode,
        "initialPrompt": payload.initialPrompt,
        "referenceImages": payload.referenceImages,
        "commits": payload.commits,
        "head": payload.head,
        "latestCommitHash": payload.latestCommitHash,
    }
    projects = read_projects()
    projects.append(project)
    write_projects(projects)
    return project


@router.patch("/api/projects/{project_id}")
async def update_project(
    project_id: str, request: Request, payload: UpdateProjectRequest
) -> ProjectRecord:
    require_auth_enabled()
    user = get_authenticated_user(request)
    projects = read_projects()

    for index, project in enumerate(projects):
        if project["id"] != project_id or project["userId"] != user["id"]:
            continue

        updated = cast(ProjectRecord, dict(project))
        updated["name"] = normalize_project_name(payload.name)
        updated["updatedAt"] = utc_timestamp()
        updated["appState"] = payload.appState
        updated["stack"] = payload.stack
        updated["inputMode"] = payload.inputMode
        updated["initialPrompt"] = payload.initialPrompt
        updated["referenceImages"] = payload.referenceImages
        updated["commits"] = payload.commits
        updated["head"] = payload.head
        updated["latestCommitHash"] = payload.latestCommitHash
        projects[index] = updated
        write_projects(projects)
        return updated

    raise HTTPException(status_code=404, detail="Project not found")


@router.get("/api/projects/{project_id}")
async def get_project(project_id: str, request: Request) -> ProjectRecord:
    require_auth_enabled()
    user = get_authenticated_user(request)
    for project in read_projects():
        if project["id"] == project_id and project["userId"] == user["id"]:
            return project

    raise HTTPException(status_code=404, detail="Project not found")


@router.delete("/api/projects/{project_id}")
async def delete_project(project_id: str, request: Request) -> Response:
    require_auth_enabled()
    user = get_authenticated_user(request)
    projects = read_projects()
    remaining = [
        project
        for project in projects
        if not (project["id"] == project_id and project["userId"] == user["id"])
    ]
    if len(remaining) == len(projects):
        raise HTTPException(status_code=404, detail="Project not found")
    write_projects(remaining)
    return Response(status_code=204)
