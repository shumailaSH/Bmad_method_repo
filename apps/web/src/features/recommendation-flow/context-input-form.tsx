"use client";

import { useEffect, useState } from "react";

const OCCASION_OPTIONS = [
  "Class or campus day",
  "Office or workday",
  "Dinner or social outing",
  "Weekend casual",
];

const STYLE_OPTIONS = ["Relaxed", "Polished", "Minimal", "Statement"];

type FormState = {
  occasion: string;
  weatherContext: string;
  stylePreference: string;
};

type ValidationError = {
  field: keyof FormState;
  message: string;
};

type OutfitItem = {
  category: string;
  item: string;
  reason: string;
};

type RecommendationResponse = {
  occasion: string;
  weather_context: string;
  style_preference: string;
  outfit_items: OutfitItem[];
  summary: string;
};

const INITIAL_FORM_STATE: FormState = {
  occasion: OCCASION_OPTIONS[0],
  weatherContext: "",
  stylePreference: STYLE_OPTIONS[0],
};

const SESSION_STORAGE_KEY = "recommendation-flow-context";

function getInitialFormState(): FormState {
  if (typeof window === "undefined") {
    return INITIAL_FORM_STATE;
  }

  const savedState = window.sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (!savedState) {
    return INITIAL_FORM_STATE;
  }

  try {
    const parsedState = JSON.parse(savedState) as Partial<FormState>;

    return {
      occasion: parsedState.occasion ?? INITIAL_FORM_STATE.occasion,
      weatherContext:
        parsedState.weatherContext ?? INITIAL_FORM_STATE.weatherContext,
      stylePreference:
        parsedState.stylePreference ?? INITIAL_FORM_STATE.stylePreference,
    };
  } catch {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    return INITIAL_FORM_STATE;
  }
}

function validateForm(formState: FormState): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate weather context (required field)
  if (!formState.weatherContext.trim()) {
    errors.push({
      field: "weatherContext",
      message: "Please describe the weather context (e.g., warm afternoon, light rain, chilly evening)",
    });
  }

  // Validate occasion (required field)
  if (!OCCASION_OPTIONS.includes(formState.occasion)) {
    errors.push({
      field: "occasion",
      message: "Please select a valid occasion",
    });
  }

  // Validate style preference (required field)
  if (!STYLE_OPTIONS.includes(formState.stylePreference)) {
    errors.push({
      field: "stylePreference",
      message: "Please select a valid style preference",
    });
  }

  return errors;
}

export function ContextInputForm() {
  const [formState, setFormState] = useState<FormState>(getInitialFormState);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(formState));
  }, [formState]);

  function updateField<Key extends keyof FormState>(
    field: Key,
    value: FormState[Key],
  ) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));

    // Clear validation error for this field when user starts typing
    setValidationErrors((currentErrors) =>
      currentErrors.filter((error) => error.field !== field)
    );
  }

  async function handleSubmit() {
    const errors = validateForm(formState);
    setValidationErrors(errors);

    if (errors.length === 0) {
      try {
        setIsLoading(true);
        setRequestError(null);
        // Form is valid - call the API to generate recommendation
        const response = await fetch("http://localhost:8000/api/v1/recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            occasion: formState.occasion,
            weather_context: formState.weatherContext,
            style_preference: formState.stylePreference
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const recommendationData = await response.json() as RecommendationResponse;
        console.log("Recommendation generated:", recommendationData);
        
        // Navigate to the results page with the context as query parameters
        const url = new URL("/recommendations", window.location.origin);
        url.searchParams.set("occasion", formState.occasion);
        url.searchParams.set("weatherContext", formState.weatherContext);
        url.searchParams.set("stylePreference", formState.stylePreference);
        window.location.href = url.toString();
      } catch (error) {
        console.error("Error generating recommendation:", error);
        setRecommendation(null);
        setRequestError("Failed to generate recommendation. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <form
      className="grid gap-6 rounded-[28px] border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl shadow-black/20"
      aria-label="Outfit recommendation context form"
      data-testid="context-input-form"
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium text-zinc-100" htmlFor="occasion">
          Occasion
        </label>
        <select
          id="occasion"
          className={`rounded-2xl border px-4 py-3 outline-none transition focus:border-zinc-400 ${
            validationErrors.find((e) => e.field === "occasion")
              ? "border-red-500 bg-red-950/30 text-red-100"
              : "border-zinc-700 bg-zinc-950 text-zinc-100"
          }`}
          value={formState.occasion}
          onChange={(event) => updateField("occasion", event.target.value)}
          aria-invalid={validationErrors.find((e) => e.field === "occasion") ? "true" : "false"}
          aria-describedby={validationErrors.find((e) => e.field === "occasion") ? "occasion-error" : undefined}
        >
          {OCCASION_OPTIONS.map((occasion) => (
            <option key={occasion} value={occasion}>
              {occasion}
            </option>
          ))}
        </select>
        {validationErrors.find((e) => e.field === "occasion") && (
          <span
            id="occasion-error"
            className="text-sm text-red-200"
            role="alert"
            aria-live="polite"
          >
            {validationErrors.find((e) => e.field === "occasion")?.message}
          </span>
        )}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-zinc-100" htmlFor="weather-context">
          Weather context
        </label>
        <input
          id="weather-context"
          type="text"
          placeholder="Warm afternoon, light rain, chilly evening..."
          className={`rounded-2xl border px-4 py-3 outline-none transition placeholder:text-zinc-500 focus:border-zinc-400 ${
            validationErrors.find((e) => e.field === "weatherContext")
              ? "border-red-500 bg-red-950/30 text-red-100"
              : "border-zinc-700 bg-zinc-950 text-zinc-100"
          }`}
          value={formState.weatherContext}
          onChange={(event) => updateField("weatherContext", event.target.value)}
          aria-invalid={validationErrors.find((e) => e.field === "weatherContext") ? "true" : "false"}
          aria-describedby={validationErrors.find((e) => e.field === "weatherContext") ? "weather-context-error" : undefined}
        />
        {validationErrors.find((e) => e.field === "weatherContext") && (
          <span
            id="weather-context-error"
            className="text-sm text-red-200"
            role="alert"
            aria-live="polite"
          >
            {validationErrors.find((e) => e.field === "weatherContext")?.message}
          </span>
        )}
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-medium text-zinc-100">
          Style preference
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {STYLE_OPTIONS.map((style) => {
            const checked = formState.stylePreference === style;
            const hasError = validationErrors.find((e) => e.field === "stylePreference");

            return (
              <label
                key={style}
                className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 transition ${
                  hasError
                    ? "border-red-500 bg-red-950/30 text-red-100"
                    : checked
                    ? "border-zinc-300 bg-zinc-100 text-zinc-950"
                    : "border-zinc-700 bg-zinc-950 text-zinc-100"
                }`}
              >
                <span className="text-sm font-medium">{style}</span>
                <input
                  className="h-4 w-4 accent-zinc-950"
                  type="radio"
                  name="style-preference"
                  value={style}
                  checked={checked}
                  onChange={(event) =>
                    updateField("stylePreference", event.target.value)
                  }
                  aria-invalid={hasError ? "true" : "false"}
                  aria-describedby={hasError ? "style-preference-error" : undefined}
                />
              </label>
            );
          })}
        </div>
        {validationErrors.find((e) => e.field === "stylePreference") && (
          <span
            id="style-preference-error"
            className="text-sm text-red-200"
            role="alert"
            aria-live="polite"
          >
            {validationErrors.find((e) => e.field === "stylePreference")?.message}
          </span>
        )}
      </fieldset>

      {/* Validation Error Summary */}
      {validationErrors.length > 0 && (
        <div
          className="rounded-2xl border border-red-900/50 bg-red-950/30 p-4"
          role="alert"
          aria-live="polite"
        >
          <p className="text-sm font-medium text-red-200">
            Please fix the following issues:
          </p>
          <ul className="mt-2 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-sm text-red-100">
                • {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/80 p-4 text-sm text-zinc-300">
        <p className="font-medium text-zinc-100">Current session context</p>
        <p className="mt-2">
          Occasion: <span className="text-zinc-100">{formState.occasion}</span>
        </p>
        <p>
          Weather context:{" "}
          <span className="text-zinc-100">
            {formState.weatherContext || "Not entered yet"}
          </span>
        </p>
        <p>
          Style preference:{" "}
          <span className="text-zinc-100">{formState.stylePreference}</span>
        </p>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        aria-describedby="recommendation-next-step"
        disabled={isLoading}
        className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition sm:w-fit ${
          isLoading
            ? "cursor-wait bg-zinc-700 text-zinc-300"
            : validationErrors.length === 0
            ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
            : "bg-zinc-100/60 text-zinc-950/80"
        }`}
      >
        {isLoading
          ? "Generating Looks..."
          : validationErrors.length === 0
          ? "Generate Recommendation"
          : "Fix Issues to Continue"}
      </button>
      <p
        id="recommendation-next-step"
        className="text-sm text-zinc-400"
      >
        {isLoading
          ? "Building an outfit recommendation for your current context"
          : validationErrors.length === 0
          ? "Click above to generate your outfit recommendation"
          : "Complete all required fields to continue"}
      </p>

      {requestError && (
        <div
          className="rounded-2xl border border-red-900/50 bg-red-950/30 p-4"
          role="alert"
          aria-live="polite"
        >
          <p className="text-sm font-medium text-red-100">{requestError}</p>
        </div>
      )}
    </form>
  );
}
