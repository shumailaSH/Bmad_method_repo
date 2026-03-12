# Story 1.2: Build the Context Input Form

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an end user,
I want to enter occasion, weather context, and style preference,
so that I can request an outfit recommendation without extra setup.

## Acceptance Criteria

1. Given I open the application on desktop or mobile, when the recommendation page loads, then I can access a single continuous form for occasion, weather context, and style preference, and the experience does not require account creation before submission.
2. Given the input form is visible, when I enter valid context values, then the system preserves my inputs in the current session, and the interface remains usable between 360 px and 1440 px without horizontal scrolling.

## Tasks / Subtasks

- [x] Replace the current scaffold landing page with a recommendation request screen rooted in `apps/web/src/app/page.tsx` and feature code under `apps/web/src/features/recommendation-flow`. (AC: 1)
- [x] Build a single continuous context input form that captures occasion, weather context, and style preference without requiring authentication. (AC: 1)
- [x] Add client-side form state management that preserves entered values within the active browser session, including remounts within the same browser session. (AC: 2)
- [x] Keep the UI responsive from 360 px to 1440 px without horizontal scrolling using the existing Tailwind-based frontend scaffold. (AC: 2)
- [x] Add the minimum automated coverage needed to verify the form renders the required fields and preserves user-entered values within session scope. (AC: 1, 2)

## Dev Notes

- Story `1.1` is complete, so this story should build on the existing scaffold in `apps/web` rather than reworking project setup. The current homepage in `apps/web/src/app/page.tsx` is a placeholder scaffold screen and is the correct entrypoint to replace with the initial recommendation request experience.
- This story is about input capture only. Do not implement backend recommendation submission, server-state fetching, validation/error messaging, selection flow, retry flow, or authentication in this story unless a change is strictly required to satisfy the stated acceptance criteria.
- The architecture requires an App Router shell with client components for interactive recommendation flow work. The page route can remain server-rendered at the route boundary, but the interactive form logic should live in a client component under `apps/web/src/features/recommendation-flow/`.
- Local form state is the approved pattern for this stage. TanStack Query is reserved for backend server state and should not be introduced just to hold form values before recommendation requests exist.
- Because Story `1.3` owns validation and Story `1.4` owns deeper accessibility/responsiveness hardening, keep this story focused on:
  - rendering the required fields
  - preserving entered values during the session
  - keeping the layout usable across the required width range
  - maintaining a single continuous flow without account gating
- Use the environment and project structure created in Story `1.1`. Do not move route files or flatten the feature-first structure.

### Technical Requirements

- Replace the placeholder landing content in `apps/web/src/app/page.tsx` with a recommendation request screen for context capture.
- Add a feature folder for this flow, e.g. `apps/web/src/features/recommendation-flow/`, and place business-specific form UI there.
- Capture these three inputs explicitly:
  - occasion
  - weather context
  - style preference
- The page must present these fields in a single continuous form on first load.
- The flow must not require login, registration, profile creation, or any account-related state before the user can interact with the form.
- Preserve entered values within the active browser session scope of the page. This implementation may use session-scoped browser storage if it remains lightweight and isolated to the recommendation-flow feature.
- Keep the initial implementation lightweight and ready for follow-on stories that will add validation and request submission.

### Architecture Compliance

- Follow the frontend architecture:
  - App Router route under `src/app`
  - feature-owned code under `src/features/recommendation-flow`
  - reusable UI only in `src/components`
  - infra helpers only in `src/lib`
- Keep business logic out of `src/app/page.tsx`; that file should compose the recommendation-flow feature, not contain all field/state logic inline.
- Do not add a global state library for this story. Architecture explicitly prefers local state for flow progress and transient input state.
- Do not add API calls yet unless a supporting helper is trivial and does not exceed the story scope.
- Preserve the split frontend/backend architecture. No direct database or backend logic belongs in the web app.

### Library / Framework Requirements

- Use the existing Next.js `16.x` frontend scaffold from Story `1.1`.
- Stay within the current React/Next stack already installed in `apps/web`.
- Tailwind CSS should continue to be the styling mechanism for layout and responsive behavior.
- Avoid adding new dependencies unless they are clearly required by the story. A plain React client component with `useState` is the expected baseline here.

### File Structure Requirements

- Expected new/updated frontend locations:
  - `apps/web/src/app/page.tsx`
  - `apps/web/src/features/recommendation-flow/`
- Prefer file names such as:
  - `recommendation-flow.tsx`
  - `context-input-form.tsx`
  - `types.ts`
- Keep component file names in `kebab-case` and React components in `PascalCase`.
- If a small helper or type is needed for the form, keep it local to the recommendation-flow feature unless it is genuinely reusable.

### Testing Requirements

- Add the minimum committed test coverage needed to prove the form renders the required context fields and preserves entered values during interaction.
- Prefer frontend tests that exercise user-visible behavior rather than implementation details.
- Reuse the verification pattern established in Story `1.1`; do not replace or break the existing `pnpm verify` baseline.
- If new frontend testing dependencies are required, that is a story-level dependency change and should be introduced deliberately with a clear justification in implementation.

### Previous Story Intelligence

- Story `1.1` established the live scaffold and already resolved several setup pitfalls:
  - the frontend currently builds successfully only after removing the generated Google font dependency from the layout
  - `pnpm verify` is the committed repeatable frontend verification path
  - the feature-folder structure now exists and should be used rather than bypassed
- Do not reintroduce external font/network dependencies that can break local or sandboxed builds.
- Keep env-example tracking intact; Story `1.1` already fixed the generated `.gitignore` behavior for `apps/web/.env.example`.

### Project Structure Notes

- Current relevant frontend files already in place:
  - `apps/web/src/app/layout.tsx`
  - `apps/web/src/app/page.tsx`
  - `apps/web/src/app/globals.css`
  - `apps/web/src/features/.gitkeep`
  - `apps/web/src/components/.gitkeep`
  - `apps/web/src/lib/.gitkeep`
- This story should convert `src/features` from an empty placeholder into the first real feature implementation for the recommendation flow.

### References

- [_bmad-output/planning-artifacts/epics.md](/Users/mac2014l/Desktop/pocs-projects/bmad-poc/_bmad-output/planning-artifacts/epics.md) - Story 1.2 definition and acceptance criteria
- [_bmad-output/planning-artifacts/architecture.md](/Users/mac2014l/Desktop/pocs-projects/bmad-poc/_bmad-output/planning-artifacts/architecture.md) - frontend architecture, state management, feature mapping, and naming conventions
- [page.tsx](/Users/mac2014l/Desktop/pocs-projects/bmad-poc/apps/web/src/app/page.tsx) - current scaffold route to replace

### Latest Tech Information

- Next.js `16.x` continues to support the App Router as the primary route model for new application work, which matches the existing scaffold and should remain the basis for this feature. [Source: https://nextjs.org/docs/app]
- React `19.x` is already present in the scaffold, so the form implementation should stay within standard client component patterns and avoid introducing additional form libraries unless the story truly requires them. [Source: https://react.dev/reference/react/useState]
- The installed frontend stack currently has no test runner configured. If the implementer adds frontend tests for this story, that is an intentional dependency expansion and should be kept minimal and aligned with the current Next.js/React toolchain.

### Project Context Reference

- No `project-context.md` file was found in this repository.
- Use the architecture document, the epics artifact, and the completed Story `1.1` file as the authoritative implementation context for this story.

### Story Completion Status

- Story context is complete and implementation-ready.
- This handoff is intentionally scoped to the first recommendation input screen only.
- Validation logic, accessibility hardening beyond the current ACs, request submission, and retry flows remain for later stories unless a minimal foundation is strictly necessary during implementation.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `pnpm add -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom`
- `pnpm lint`
- `pnpm test`
- `pnpm exec next build --webpack`
- `pnpm test`
- `pnpm lint`
- `pnpm exec next build --webpack`

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created
- Replaced the placeholder homepage with a recommendation input experience composed from the new `recommendation-flow` feature.
- Added a client-side context form that captures occasion, weather context, and style preference without any account gating.
- Preserved user-entered values in `sessionStorage` so the form survives page remounts within the same browser session, and surfaced a session summary to confirm the current selections.
- Kept the layout responsive using Tailwind grid and spacing rules that hold from compact mobile widths through desktop.
- Added a minimal Vitest + Testing Library setup and committed tests covering required field rendering and session-state preservation.
- Replaced the misleading next-step CTA with a disabled explanatory control so the story stops at context capture without presenting a broken action.
- Added a responsive regression guard in the frontend tests to verify the shell keeps its no-horizontal-overflow layout contract.
- Validation passed with `pnpm lint`, `pnpm test`, and `pnpm exec next build --webpack`.

### File List

- apps/web/package.json
- apps/web/pnpm-lock.yaml
- apps/web/src/app/page.tsx
- apps/web/src/features/recommendation-flow/context-input-form.tsx
- apps/web/src/features/recommendation-flow/recommendation-flow.test.tsx
- apps/web/src/features/recommendation-flow/recommendation-flow.tsx
- apps/web/src/test/setup.ts
- apps/web/vitest.config.ts

### Change Log

- 2026-03-12: Added the first end-user recommendation context form, replaced the placeholder landing page, and introduced minimal frontend test infrastructure with committed automated coverage.
- 2026-03-12: Fixed Story 1.2 review findings by persisting form state across remounts with session storage, replacing the dead CTA with an explicit disabled next-step marker, and expanding regression coverage for responsive shell constraints.

## Senior Developer Review (AI)

- Outcome: Approve
- Date: 2026-03-12
- [x] Session preservation now survives page remounts within the same browser session via `sessionStorage` in the recommendation-flow feature.
- [x] The misleading live CTA was replaced with a disabled explanatory control so the screen no longer presents a broken action.
- [x] Automated coverage now includes a responsive shell regression check alongside the session-preservation behavior test.
