# Project Agent Instructions

Python environment:

- The backend is a Poetry-managed project targeting Python 3.10+ (`backend/pyproject.toml` declares `python = "^3.10"`).
- On this machine, `poetry` is not on `PATH`, but `uv` and `python3.10` are available. Prefer invoking Poetry via `uvx`.
- Preferred invocation on this machine: `cd backend && uvx poetry run <command>`.
- If the backend virtualenv has not been created yet, initialize it with Python 3.10 first:
  - `cd backend && uvx poetry env use /opt/homebrew/bin/python3.10`
  - `cd backend && uvx poetry install`
- If `poetry` is available on `PATH` in a future environment, `cd backend && poetry run <command>` is also acceptable.

Testing policy:

- Always run backend tests after every code change: `cd backend && uvx poetry run pytest`.
- Always run type checking after every code change: `cd backend && uvx poetry run pyright`.
- Type checking policy: no new warnings in changed files (`pyright`).

## Frontend

- Frontend: `cd frontend && pnpm lint`

If changes touch both, run both sets.

## Prompt formatting

- Prefer triple-quoted strings (`"""..."""`) for multi-line prompt text.
- For interpolated multi-line prompts, prefer a single triple-quoted f-string over concatenated string fragments.

# Hosted

The hosted version is on the `hosted` branch. The `hosted` branch connects to a saas backend, which is a seperate codebase at ../screenshot-to-code-saas
