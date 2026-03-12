# Story 1.1: Initialize the Split Web and API Applications

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the project scaffolded from the selected frontend and backend starters,
so that the team can build the MVP on the approved architecture foundation.

## Acceptance Criteria

1. Given the repository does not yet contain the MVP applications, when the project is initialized, then separate `apps/web` and `apps/api` applications are created using the approved Next.js and FastAPI starter approach, and the baseline configuration supports local development for both applications.
2. Given the initialized applications, when a developer reviews the project structure, then it follows the architecture-defined feature-first boundaries and naming conventions, and environment examples are present for frontend, backend, and MongoDB connectivity.

## Tasks / Subtasks

- [x] Create the monorepo application directories and starter scaffolds for `apps/web` and `apps/api`. (AC: 1)
- [x] Initialize the Next.js frontend with TypeScript, App Router, Tailwind CSS, ESLint, `src/` layout, and `@/*` import alias. (AC: 1)
- [x] Initialize the FastAPI backend with `uv`, app entrypoint, and baseline dependencies for `fastapi`, `uvicorn[standard]`, `pymongo`, `pydantic-settings`, and `httpx`. (AC: 1)
- [x] Align generated files and folders to the architecture-defined structure, including `src/app`, `src/features`, `src/components`, `src/lib` on web and `app/api`, `app/services`, `app/repositories`, `app/models`, `app/integrations` on API. (AC: 2)
- [x] Add baseline environment example files for root, frontend, and backend covering local development and MongoDB connectivity expectations. (AC: 1, 2)
- [x] Add minimal starter documentation or comments needed to explain how to run both applications locally without inventing extra architecture. (AC: 1, 2)
- [x] Verify the scaffold matches naming conventions, split-app boundaries, and the approved architecture before handing off to implementation of Story 1.2. (AC: 2)

## Dev Notes

- This story is the mandatory foundation for the rest of Epic 1. Do not implement recommendation features, persistence models, provider integrations, or operator tooling here beyond what is required to scaffold the approved application structure.
- The repository currently contains planning artifacts only. There is no existing `apps/web` or `apps/api` code to extend, so this story should create the initial split applications without introducing extra top-level folders or alternative scaffolding approaches.
- Use the architecture-selected split starter approach:
  - Frontend: Next.js with TypeScript, App Router, Tailwind CSS, ESLint, `src` directory, and `@/*` alias.
  - Backend: FastAPI application managed by `uv`.
  - Database target for later stories: MongoDB Atlas via PyMongo.
- Keep the scaffold lightweight. This story should create the approved structure and local runnability, not pre-build all future features.
- Preserve the architecture sequencing:
  1. Initialize frontend and backend projects from approved starters.
  2. Establish structure and baseline configs.
  3. Leave API contract, database connection, and recommendation features for later stories.
- Since there is no previous story file and no git history in this workspace, there are no prior implementation learnings to inherit. The architecture document is the authoritative source for boundaries and conventions.

### Technical Requirements

- Create exactly two runnable app surfaces for MVP foundation work:
  - `apps/web` for the Next.js frontend
  - `apps/api` for the FastAPI backend
- The frontend scaffold must support:
  - TypeScript
  - Next.js App Router
  - Tailwind CSS
  - ESLint
  - `src` directory layout
  - `@/*` import alias
- The backend scaffold must support:
  - `uv` project management
  - FastAPI app entrypoint
  - `uvicorn[standard]` for local serving
  - `pydantic-settings` for configuration loading
  - `httpx` for future service integrations
  - `pymongo` for future MongoDB access
- Add `.env.example` files where needed so later stories have a consistent configuration baseline.
- Do not add authentication, recommendation endpoints, MongoDB collections, provider adapters, or operator flows in this story unless they are required to make the scaffold structurally complete.

### Architecture Compliance

- Follow the split architecture mandated in the architecture document: Next.js frontend, FastAPI backend, MongoDB-targeted backend stack.
- Preserve service boundaries from day one:
  - browser-facing UI lives under `apps/web`
  - API logic lives under `apps/api`
  - no direct browser-to-database coupling
- Use feature-first organization instead of tech-type sprawl.
- Keep business logic out of route handlers and UI components even in the initial scaffold.
- Leave room for the standard API envelope and repository/service structure instead of inventing alternate patterns.
- Do not introduce a monolithic Next.js-only backend or a combined full-stack starter that bypasses the approved split deployment model.

### Library / Framework Requirements

- Frontend framework: Next.js `16.x` as specified by architecture. Use the official starter path rather than a custom React/Vite scaffold.
- Backend framework: FastAPI `0.135.1` as specified by architecture guidance.
- Python dependency manager: `uv`.
- MongoDB driver target: PyMongo `4.16.0`.
- Styling baseline: Tailwind CSS through the standard Next.js setup.
- State/data libraries such as TanStack Query are part of the approved architecture, but they do not need to be wired into this story unless the scaffold naturally requires their installation. Avoid premature setup that adds noise without supporting the acceptance criteria.

### File Structure Requirements

- Align created files to the architecture’s expected structure, even if some directories start mostly empty:
  - `apps/web/src/app`
  - `apps/web/src/features`
  - `apps/web/src/components`
  - `apps/web/src/lib`
  - `apps/api/app/api`
  - `apps/api/app/services`
  - `apps/api/app/repositories`
  - `apps/api/app/models`
  - `apps/api/app/integrations`
- Follow naming conventions from architecture:
  - frontend component files in `kebab-case`
  - React components in `PascalCase`
  - Python modules in `snake_case`
  - route paths later in `kebab-case`
- Keep reusable utilities in explicit shared locations rather than scattering infra helpers across features.

### Testing Requirements

- This story should establish a foundation that does not block later lightweight testing setup, but it does not need to fully implement the final test stack.
- At minimum, verify both applications can be started locally from their generated scaffolds.
- If starter-generated smoke tests or lint scripts exist, preserve them rather than removing them.
- Avoid adding speculative test tooling that is not required by the scaffold acceptance criteria.

### Latest Tech Information

- `Next.js 16` is the current official major line, and the App Router remains the recommended routing model in the official docs. Keep the scaffold on the App Router path rather than generating a Pages Router project. [Source: https://nextjs.org/docs/app, https://nextjs.org/blog/next-16]
- `uv init` officially supports application project creation, and application projects are the default target for `uv init`; using `uv init --app` remains explicit and aligned with the architecture instructions. [Source: https://docs.astral.sh/uv/concepts/projects/init/]
- FastAPI official docs still recommend a minimal `main.py` / app-entrypoint setup and `fastapi dev` for local development ergonomics; ensure the backend scaffold has a clear importable app entrypoint. [Source: https://fastapi.tiangolo.com/tutorial/first-steps/]
- FastAPI `0.135.1` is a current release on PyPI as of March 1, 2026, which matches the architecture decision document and is safe to pin for this scaffold. [Source: https://pypi.org/project/fastapi/]
- PyMongo `4.16.0` is listed on PyPI as released on January 7, 2026, which matches the architecture-selected driver target. [Source: https://pypi.org/project/pymongo/4.16.0/]

### Project Context Reference

- No `project-context.md` file was found in the repository during workflow discovery.
- Use the architecture document and epics artifact as the governing project context for this story.

### Story Completion Status

- Story context is complete and implementation-ready.
- This document is intended to hand off Story `1.1` to the dev-story workflow without requiring further story clarification.
- Remaining open questions, if any, should be treated as implementation-time decisions only if they do not conflict with the architecture or acceptance criteria.

### Project Structure Notes

- Expected top-level additions:
  - `apps/web`
  - `apps/api`
- Expected frontend structure after scaffold alignment:
  - `apps/web/src/app`
  - `apps/web/src/features`
  - `apps/web/src/components`
  - `apps/web/src/lib`
- Expected backend structure after scaffold alignment:
  - `apps/api/app/api`
  - `apps/api/app/services`
  - `apps/api/app/repositories`
  - `apps/api/app/models`
  - `apps/api/app/integrations`
- Root-level planning artifacts under `_bmad-output/` remain source documentation only and should not be mixed into runtime app directories.

### References

- [_bmad-output/planning-artifacts/epics.md](/Users/mac2014l/Desktop/pocs-projects/bmad-poc/_bmad-output/planning-artifacts/epics.md) - Story 1.1 definition and acceptance criteria
- [_bmad-output/planning-artifacts/architecture.md](/Users/mac2014l/Desktop/pocs-projects/bmad-poc/_bmad-output/planning-artifacts/architecture.md) - starter selection, project structure, naming conventions, and deployment boundaries

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `corepack pnpm create next-app web --yes --ts --tailwind --eslint --app --src-dir --import-alias "@/*"`
- `pnpm install`
- `/Users/mac2014l/Library/Python/3.13/bin/uv init --app`
- `/Users/mac2014l/Library/Python/3.13/bin/uv add fastapi "uvicorn[standard]" pymongo pydantic-settings httpx`
- `pnpm lint`
- `pnpm exec next build --webpack`
- `PATH="/Users/mac2014l/Library/Python/3.13/bin:$PATH" uv run python -c "from fastapi.testclient import TestClient; from app.main import app; client = TestClient(app); response = client.get('/health'); assert response.status_code == 200; assert response.json() == {'status': 'ok'}; print('api-smoke-ok')"`

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created
- Scaffolded `apps/web` from the official Next.js starter with TypeScript, App Router, Tailwind CSS, ESLint, `src/`, and the `@/*` alias.
- Installed and scaffolded `apps/api` with `uv`, FastAPI, `uvicorn[standard]`, `pydantic-settings`, `httpx`, and PyMongo, then converted the generated placeholder CLI into an importable `app.main:app` FastAPI entrypoint.
- Added the architecture-required directory skeletons for frontend feature folders and backend service/repository/model/integration packages.
- Added root, frontend, and backend `.env.example` files plus starter READMEs for local development.
- Replaced the default Next.js marketing page with a project-specific scaffold landing page and removed the generated external Google font dependency so local/offline builds succeed.
- Validation passed with `pnpm lint`, `pnpm exec next build --webpack`, and a backend FastAPI smoke test against `/health`.
- Code review fixes applied: made `apps/web/.env.example` trackable, removed the machine-specific Python pin from the backend scaffold, added a committed backend smoke test, and added a repeatable frontend verification script.
- Post-review validation passed with `pnpm verify` and `uv run python -m unittest discover -s tests`.

### File List

- .editorconfig
- .env.example
- .gitignore
- apps/api/.env.example
- apps/api/.gitignore
- apps/api/README.md
- apps/api/app/__init__.py
- apps/api/app/api/__init__.py
- apps/api/app/integrations/__init__.py
- apps/api/app/main.py
- apps/api/app/models/__init__.py
- apps/api/app/repositories/__init__.py
- apps/api/app/services/__init__.py
- apps/api/pyproject.toml
- apps/api/tests/test_health.py
- apps/api/uv.lock
- apps/web/.env.example
- apps/web/.gitignore
- apps/web/README.md
- apps/web/package.json
- apps/web/pnpm-lock.yaml
- apps/web/src/app/globals.css
- apps/web/src/app/layout.tsx
- apps/web/src/app/page.tsx
- apps/web/src/components/.gitkeep
- apps/web/src/components/ui/.gitkeep
- apps/web/src/features/.gitkeep
- apps/web/src/lib/.gitkeep

### Change Log

- 2026-03-12: Scaffolded the split Next.js and FastAPI applications, aligned both apps to the architecture-defined structure, added local environment examples, and verified the frontend and backend startup baselines.
- 2026-03-12: Addressed code review findings by making env example tracking explicit, removing the backend's machine-specific Python version file, and adding repeatable verification commands/tests.

## Senior Developer Review (AI)

Outcome: Approve
Date: 2026-03-12

Resolved findings:
- [x] Medium: `apps/web/.env.example` is now explicitly trackable because `apps/web/.gitignore` negates the generated `.env*` ignore rule. [Source: apps/web/.gitignore]
- [x] Medium: The backend scaffold no longer hard-pins the review machine's Python version; `.python-version` was removed and `requires-python` was relaxed to `>=3.11`. [Source: apps/api/pyproject.toml]
- [x] Medium: Repeatable verification now exists in committed code via `pnpm verify` for the frontend and `apps/api/tests/test_health.py` for the backend smoke test. [Source: apps/web/package.json, apps/api/tests/test_health.py]
