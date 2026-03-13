"use client";

import { RecommendationResults } from "@/features/recommendation-flow/recommendation-results";
import { useEffect, useState } from "react";

export default function RecommendationsPage() {
  const [context, setContext] = useState({
    occasion: "",
    weatherContext: "",
    stylePreference: ""
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the context from URL search params
    const urlParams = new URLSearchParams(window.location.search);
    const occasion = urlParams.get("occasion") || "";
    const weatherContext = urlParams.get("weatherContext") || "";
    const stylePreference = urlParams.get("stylePreference") || "";

    setContext({
      occasion,
      weatherContext,
      stylePreference
    });
    
    setIsLoading(false);
  }, []);

  // Show loading state while context is being loaded
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-zinc-300 border-t-zinc-900"></div>
          <p className="mt-4 text-zinc-400">Loading recommendation context...</p>
        </div>
      </div>
    );
  }

  // Show error if context is missing
  if (!context.occasion || !context.weatherContext || !context.stylePreference) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center rounded-2xl border border-red-900/50 bg-red-950/30 p-8">
          <h2 className="text-xl font-semibold text-red-200">Missing Context</h2>
          <p className="mt-2 text-red-100">
            Please go back to the form and provide all required information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <RecommendationResults
      occasion={context.occasion}
      weatherContext={context.weatherContext}
      stylePreference={context.stylePreference}
    />
  );
}
