This is the FastAPI backend scaffold for `bmad-poc`, generated with `uv` and aligned to the project architecture.

## Getting Started

Use the lockfile-backed environment and run the API:

```bash
uv run uvicorn app.main:app --reload
```

The default health endpoint is available at [http://localhost:8000/health](http://localhost:8000/health).

## Verification

Run the committed backend smoke test with:

```bash
uv run python -m unittest discover -s tests
```

## Project Layout

- `app/main.py` contains the FastAPI application entrypoint.
- `app/api` is reserved for route handlers.
- `app/services` is reserved for business logic.
- `app/repositories` is reserved for MongoDB access.
- `app/models` is reserved for Pydantic and domain models.
- `app/integrations` is reserved for AI and weather providers.

## Configuration

Copy `.env.example` to `.env` before wiring real integrations. Later stories will use `MONGODB_URL` and related settings.
