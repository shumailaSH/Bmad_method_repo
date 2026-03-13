import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RecommendationFlow } from "./recommendation-flow";

const mockRecommendation = {
  occasion: "Class or campus day",
  weather_context: "morning",
  style_preference: "Relaxed",
  outfit_items: [
    {
      category: "Top",
      item: "Cotton crew neck t-shirt",
      reason: "Comfortable base layer suitable for most occasions",
    },
    {
      category: "Bottom",
      item: "Dark wash jeans",
      reason: "Versatile and appropriate for campus environment",
    },
    {
      category: "Shoes",
      item: "White sneakers",
      reason: "Comfortable for walking around campus",
    },
  ],
  summary:
    "Your relaxed outfit for class or campus day in morning includes: Cotton crew neck t-shirt, Dark wash jeans, White sneakers. This combination balances comfort, style, and practicality for your specific needs.",
};

describe("RecommendationFlow", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    global.fetch = vi.fn();
  });

  it("renders the required context fields without account gating", () => {
    render(<RecommendationFlow />);

    expect(
      screen.getByText(/capture the context before we suggest what to wear/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/occasion/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/weather context/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/relaxed/i)).toBeChecked();
    expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument();
    expect(screen.getByText(/recommendation step comes next/i)).toBeDisabled();
  });

  it("preserves entered values when the page remounts within the current session", () => {
    const firstRender = render(<RecommendationFlow />);

    fireEvent.change(screen.getByLabelText(/occasion/i), {
      target: { value: "Dinner or social outing" },
    });
    fireEvent.change(screen.getByLabelText(/weather context/i), {
      target: { value: "Warm afternoon with a chance of rain" },
    });
    fireEvent.click(screen.getByLabelText(/statement/i));

    expect(screen.getByLabelText(/occasion/i)).toHaveValue(
      "Dinner or social outing",
    );
    expect(screen.getByLabelText(/weather context/i)).toHaveValue(
      "Warm afternoon with a chance of rain",
    );
    expect(screen.getByLabelText(/statement/i)).toBeChecked();

    const sessionSummary = screen
      .getByText(/current session context/i)
      .closest("div");

    expect(sessionSummary).not.toBeNull();
    expect(sessionSummary).toHaveTextContent(/dinner or social outing/i);
    expect(sessionSummary).toHaveTextContent(
      /warm afternoon with a chance of rain/i,
    );

    firstRender.unmount();

    render(<RecommendationFlow />);

    expect(screen.getByLabelText(/occasion/i)).toHaveValue(
      "Dinner or social outing",
    );
    expect(screen.getByLabelText(/weather context/i)).toHaveValue(
      "Warm afternoon with a chance of rain",
    );
    expect(screen.getByLabelText(/statement/i)).toBeChecked();
  });

  it("keeps the responsive shell constraints that prevent horizontal overflow regressions", () => {
    render(<RecommendationFlow />);

    expect(screen.getByTestId("recommendation-flow-shell")).toHaveClass(
      "overflow-x-hidden",
      "px-4",
      "sm:px-6",
      "lg:px-8",
    );
    expect(screen.getByTestId("context-input-form")).toHaveClass("grid", "gap-6");
  });
});

describe("ContextInputForm Validation", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("shows validation errors for empty required fields", async () => {
    render(<RecommendationFlow />);
    
    const submitButton = screen.getByRole("button", { name: /generate recommendation/i });
    
    // Click submit with empty form
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please describe the weather context/i)).toBeInTheDocument();
      expect(screen.getByText(/please select a valid occasion/i)).toBeInTheDocument();
      expect(screen.getByText(/please select a valid style preference/i)).toBeInTheDocument();
    });
  });

  it("shows validation error only for empty weather context", async () => {
    render(<RecommendationFlow />);
    
    // Set occasion and style preference but leave weather context empty
    const occasionSelect = screen.getByLabelText(/occasion/i);
    const styleOption = screen.getByLabelText(/relaxed/i);
    
    fireEvent.change(occasionSelect, { target: { value: "Class or campus day" } });
    fireEvent.click(styleOption);
    
    const submitButton = screen.getByRole("button", { name: /generate recommendation/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please describe the weather context/i)).toBeInTheDocument();
      expect(screen.queryByText(/please select a valid occasion/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/please select a valid style preference/i)).not.toBeInTheDocument();
    });
  });

  it("clears validation errors when user starts typing", async () => {
    render(<RecommendationFlow />);
    
    const submitButton = screen.getByRole("button", { name: /generate recommendation/i });
    
    // Trigger validation with empty form
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please describe the weather context/i)).toBeInTheDocument();
    });
    
    // Start typing in weather context
    const weatherInput = screen.getByLabelText(/weather context/i);
    fireEvent.change(weatherInput, { target: { value: "Sunny" } });
    
    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/please describe the weather context/i)).not.toBeInTheDocument();
    });
  });

  it("shows validation error summary when there are errors", async () => {
    render(<RecommendationFlow />);
    
    const submitButton = screen.getByRole("button", { name: /generate recommendation/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please fix the following issues/i)).toBeInTheDocument();
      expect(screen.getByText(/please describe the weather context/i)).toBeInTheDocument();
    });
  });

  it("enables submit button when form is valid", async () => {
    render(<RecommendationFlow />);
    
    // Fill in all required fields
    const weatherInput = screen.getByLabelText(/weather context/i);
    const occasionSelect = screen.getByLabelText(/occasion/i);
    const styleOption = screen.getByLabelText(/relaxed/i);
    
    fireEvent.change(weatherInput, { target: { value: "Sunny day" } });
    fireEvent.change(occasionSelect, { target: { value: "Class or campus day" } });
    fireEvent.click(styleOption);
    
    const submitButton = screen.getByRole("button", { name: /generate recommendation/i });
    
    // Button should be enabled and show success text
    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveTextContent("Generate Recommendation");
  });

  it("disables submit button and shows error text when form is invalid", async () => {
    render(<RecommendationFlow />);
    
    const submitButton = screen.getByRole("button", { name: /generate recommendation/i });
    
    // Button should show error state text when form is invalid
    expect(submitButton).toHaveTextContent("Fix Issues to Continue");
  });

  it("applies error styling to invalid fields", async () => {
    render(<RecommendationFlow />);
    
    const submitButton = screen.getByRole("button", { name: /generate recommendation/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      const weatherInput = screen.getByLabelText(/weather context/i);
      const occasionSelect = screen.getByLabelText(/occasion/i);
      
      // Fields should have error styling (red border)
      expect(weatherInput).toHaveClass("border-red-500");
      expect(occasionSelect).toHaveClass("border-red-500");
    });
  });

  it("has proper ARIA attributes for accessibility", async () => {
    render(<RecommendationFlow />);
    
    const weatherInput = screen.getByLabelText(/weather context/i);
    const occasionSelect = screen.getByLabelText(/occasion/i);
    
    // Initially should not be marked as invalid
    expect(weatherInput).toHaveAttribute("aria-invalid", "false");
    expect(occasionSelect).toHaveAttribute("aria-invalid", "false");
    
    const submitButton = screen.getByRole("button", { name: /generate recommendation/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      // After validation, should be marked as invalid
      expect(weatherInput).toHaveAttribute("aria-invalid", "true");
      expect(occasionSelect).toHaveAttribute("aria-invalid", "true");
    });
  });

  it("provides helpful error messages for each field", async () => {
    render(<RecommendationFlow />);
    
    const submitButton = screen.getByRole("button", { name: /generate recommendation/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please describe the weather context/i)).toBeInTheDocument();
      expect(screen.getByText(/please select a valid occasion/i)).toBeInTheDocument();
      expect(screen.getByText(/please select a valid style preference/i)).toBeInTheDocument();
    });
  });

  it("preserves valid inputs when clearing only invalid fields", async () => {
    render(<RecommendationFlow />);
    
    // Fill in some valid data but leave weather context empty
    const occasionSelect = screen.getByLabelText(/occasion/i);
    
    fireEvent.change(occasionSelect, { target: { value: "Class or campus day" } });
    
    // Trigger validation (should fail due to missing weather context)
    const submitButton = screen.getByRole("button", { name: /generate recommendation/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please describe the weather context/i)).toBeInTheDocument();
    });
    
    // Valid inputs should still be preserved
    expect(screen.getByDisplayValue("Class or campus day")).toBeInTheDocument();
    
    // Now fill in weather context - error should clear but occasion should remain
    const weatherInput = screen.getByLabelText(/weather context/i);
    fireEvent.change(weatherInput, { target: { value: "Sunny day" } });
    
    await waitFor(() => {
      expect(screen.queryByText(/please describe the weather context/i)).not.toBeInTheDocument();
    });
    
    // Both inputs should still be preserved
    expect(screen.getByDisplayValue("Sunny day")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Class or campus day")).toBeInTheDocument();
  });

  it("maintains session storage across component updates", () => {
    render(<RecommendationFlow />);
    
    const weatherInput = screen.getByLabelText(/weather context/i);
    fireEvent.change(weatherInput, { target: { value: "Test weather" } });
    
    // Check that session storage was updated
    expect(sessionStorage.getItem("recommendation-flow-context")).toContain("Test weather");
  });

  it("renders clothing recommendations in the page after a successful response", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockRecommendation,
    } as Response);

    render(<RecommendationFlow />);

    fireEvent.change(screen.getByLabelText(/weather context/i), {
      target: { value: "Morning breeze on campus" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /generate recommendation/i }),
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/v1/recommendations",
      expect.objectContaining({ method: "POST" }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: /clothing recommendations for class or campus day/i,
        }),
      ).toBeInTheDocument();
      expect(screen.getByText(/cotton crew neck t-shirt/i)).toBeInTheDocument();
      expect(screen.getByText(/dark wash jeans/i)).toBeInTheDocument();
      expect(screen.getByText(/white sneakers/i)).toBeInTheDocument();
      expect(screen.getByText(/why this works/i)).toBeInTheDocument();
    });
  });

  it("shows an inline request error when the recommendation call fails", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    render(<RecommendationFlow />);

    fireEvent.change(screen.getByLabelText(/weather context/i), {
      target: { value: "Warm afternoon" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /generate recommendation/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(/failed to generate recommendation\. please try again\./i),
      ).toBeInTheDocument();
    });
  });
});
