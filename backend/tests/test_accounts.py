from pathlib import Path

import pytest
from fastapi import HTTPException
from starlette.requests import HTTPConnection

from routes import accounts


class DummyConnection(HTTPConnection):
    def __init__(self, cookies: dict[str, str] | None = None):
        scope = {
            "type": "http",
            "headers": [],
            "query_string": b"",
            "client": ("127.0.0.1", 1234),
            "server": ("127.0.0.1", 7001),
            "scheme": "http",
            "method": "GET",
            "path": "/",
        }
        super().__init__(scope)
        self._cookies = cookies or {}

    @property
    def cookies(self):
        return self._cookies


def test_create_user_uses_normalized_email(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(accounts, "FREE_GENERATIONS_PER_USER", 10)
    user = accounts.create_user(" Test@Example.com ")

    assert user["email"] == "test@example.com"
    assert user["usage"]["remainingFreeGenerations"] == 10


def test_normalize_email_rejects_invalid() -> None:
    with pytest.raises(HTTPException):
        accounts.normalize_email("not-an-email")


def test_consume_generation_credit(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("SCREENSHOT_TO_CODE_DATA_DIR", str(tmp_path))
    monkeypatch.setattr(accounts, "ENABLE_AUTH", True)
    monkeypatch.setattr(accounts, "FREE_GENERATIONS_PER_USER", 3)

    user = accounts.create_user("credits@example.com")
    accounts.write_users([user])

    accounts.consume_generation_credit_for_user_id(user["id"])

    saved_user = accounts.read_users()[0]
    assert saved_user["usage"]["totalGenerations"] == 1
    assert saved_user["usage"]["remainingFreeGenerations"] == 2


def test_get_authenticated_user_requires_cookie(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(accounts, "ENABLE_AUTH", True)
    with pytest.raises(HTTPException):
      accounts.get_authenticated_user(DummyConnection())
