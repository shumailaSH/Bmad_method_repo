import { ContextInputForm } from "./context-input-form";

export function RecommendationFlow() {
  return (
    <main
      className="min-h-screen overflow-x-hidden bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 lg:px-8"
      data-testid="recommendation-flow-shell"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 overflow-x-hidden">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">
              Recommendation input
            </p>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Capture the context before we suggest what to wear.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                Start with the moment you are dressing for, the weather you need
                to handle, and the style direction you want today. No account,
                profile, or saved wardrobe setup is required.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <article className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="text-sm font-medium text-zinc-100">Single flow</p>
                <p className="mt-2 text-sm text-zinc-400">
                  One continuous form captures the full request context.
                </p>
              </article>
              <article className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="text-sm font-medium text-zinc-100">Session-safe</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Entered values stay visible while you work through the page.
                </p>
              </article>
              <article className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="text-sm font-medium text-zinc-100">Mobile ready</p>
                <p className="mt-2 text-sm text-zinc-400">
                  The layout stays readable from compact phones to desktop widths.
                </p>
              </article>
            </div>
          </div>

          <ContextInputForm />
        </section>
      </div>
    </main>
  );
}
