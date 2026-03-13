import { useEffect, useState } from "react";

interface OutfitItem {
  category: string;
  item: string;
  reason: string;
}

interface RecommendationResponse {
  occasion: string;
  weather_context: string;
  style_preference: string;
  outfit_items: OutfitItem[];
  summary: string;
}

interface RecommendationResultsProps {
  occasion: string;
  weatherContext: string;
  stylePreference: string;
}

export function RecommendationResults({ occasion, weatherContext, stylePreference }: RecommendationResultsProps) {
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendation() {
      try {
        setLoading(true);
        setError(null);

        // Call the API to get recommendations
        const response = await fetch("http://localhost:8000/api/v1/recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            occasion,
            weather_context: weatherContext,
            style_preference: stylePreference
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRecommendation(data);
      } catch (err) {
        console.error("Error fetching recommendation:", err);
        setError("Failed to generate recommendation. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendation();
  }, [occasion, weatherContext, stylePreference]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-zinc-600 border-t-amber-400 mx-auto"></div>
          <p className="text-zinc-400">Generating your personalized outfit recommendation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-red-400">❌</div>
          <p className="text-zinc-400">{error}</p>
          <button
            onClick={() => window.location.href = "/"}
            className="mt-4 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8">
          {/* Header Section */}
          <section className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-amber-200/70">
              Personalized Recommendation
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Your Perfect Outfit
            </h1>
            <p className="mt-2 text-lg text-zinc-300">
              Curated just for your {occasion.toLowerCase()} in {weatherContext}
            </p>
          </section>

          {/* Recommendation Results */}
          <section
            className="grid gap-5 rounded-[28px] border border-amber-200/20 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_rgba(24,24,27,0.98)_58%)] p-5 shadow-2xl shadow-amber-950/20"
            aria-label="Outfit recommendation results"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-amber-200/70">
                  Recommended look
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  Clothing recommendations for {recommendation.occasion}
                </h2>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200">
                {recommendation.outfit_items.length} curated pieces
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full border border-amber-200/20 bg-amber-100/10 px-3 py-1 text-amber-50">
                Occasion: {recommendation.occasion}
              </span>
              <span className="rounded-full border border-sky-200/20 bg-sky-100/10 px-3 py-1 text-sky-50">
                Weather: {recommendation.weather_context}
              </span>
              <span className="rounded-full border border-emerald-200/20 bg-emerald-100/10 px-3 py-1 text-emerald-50">
                Style: {recommendation.style_preference}
              </span>
            </div>

            <div className="grid gap-3">
              {recommendation.outfit_items.map((item) => (
                <article
                  key={`${item.category}-${item.item}`}
                  className="rounded-3xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-zinc-400">
                        {item.category}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">{item.item}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{item.reason}</p>
                </article>
              ))}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                Why this works
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-200">{recommendation.summary}</p>
            </div>
          </section>

          {/* Action Buttons */}
          <section className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => window.location.href = "/"}
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
            >
              Start Over
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition border border-zinc-600 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
            >
              Save & Print
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}