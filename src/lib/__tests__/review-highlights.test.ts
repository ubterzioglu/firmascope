import { describe, it, expect } from "vitest";
import { computeReviewHighlights } from "@/lib/review-highlights";

describe("computeReviewHighlights", () => {
  it("returns empty highlights for no reviews", () => {
    expect(computeReviewHighlights([])).toEqual({ topBenefits: [], weakDimensions: [] });
  });

  it("counts and ranks top benefits", () => {
    const result = computeReviewHighlights([
      { benefits: ["remote_work", "meal_card"] },
      { benefits: ["remote_work"] },
      { benefits: ["remote_work", "meal_card"] },
    ]);
    expect(result.topBenefits[0].count).toBe(3);
    expect(result.topBenefits[0].label).toBe("Uzaktan Çalışma");
    expect(result.topBenefits).toHaveLength(2);
  });

  it("flags dimensions averaging below 3 as weak", () => {
    const result = computeReviewHighlights([
      { rating_manager_behavior: 2, rating_career_growth: 4 },
      { rating_manager_behavior: 2, rating_career_growth: 5 },
    ]);
    const labels = result.weakDimensions.map((d) => d.label);
    expect(labels).toContain("Yönetici Tutumu");
    expect(labels).not.toContain("Kariyer Gelişimi");
  });

  it("ignores zero/null ratings in averages", () => {
    const result = computeReviewHighlights([
      { rating_work_life_balance: 0 },
      { rating_work_life_balance: 2 },
    ]);
    const wlb = result.weakDimensions.find((d) => d.label === "İş-Yaşam Dengesi");
    expect(wlb?.avg).toBe(2);
  });
});
