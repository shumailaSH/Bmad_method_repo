This is the frontend scaffold for `bmad-poc`, generated from the official Next.js starter and aligned to the project architecture.

## Getting Started

Install dependencies and run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The primary app entrypoint lives in `src/app/page.tsx`. Shared feature code should be added under `src/features`, shared UI primitives under `src/components/ui`, and infrastructure helpers under `src/lib`.

The frontend expects the backend API base URL via `NEXT_PUBLIC_API_BASE_URL`. Copy `.env.example` to `.env.local` before wiring the recommendation flow in later stories.

## Available Scripts

```bash
pnpm dev
pnpm build
pnpm lint
```

## Deployment Direction

The architecture targets Vercel for frontend deployment. Keep the app aligned with the App Router and avoid introducing backend logic into this app.
