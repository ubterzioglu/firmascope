// Pure helpers that surface "öne çıkanlar" (top benefits) and
// "dikkat edilmesi gerekenler" (weak detail-rating dimensions) from reviews.
// Uses existing review data only — no new DB fields required.

import { BENEFIT_OPTIONS } from "@/lib/form-options";

interface ReviewHighlightInput {
  benefits?: string[] | null;
  rating_work_atmosphere?: number | null;
  rating_communication?: number | null;
  rating_team_spirit?: number | null;
  rating_work_life_balance?: number | null;
  rating_manager_behavior?: number | null;
  rating_tasks?: number | null;
  rating_compensation_benefits?: number | null;
  rating_career_growth?: number | null;
}

export interface ReviewHighlights {
  topBenefits: { label: string; count: number }[];
  weakDimensions: { label: string; avg: number }[];
}

const BENEFIT_LABELS = new Map(BENEFIT_OPTIONS.map((o) => [o.value, o.label]));

const DIMENSION_LABELS: Record<string, string> = {
  rating_work_atmosphere: "Çalışma Ortamı",
  rating_communication: "İletişim",
  rating_team_spirit: "Takım Ruhu",
  rating_work_life_balance: "İş-Yaşam Dengesi",
  rating_manager_behavior: "Yönetici Tutumu",
  rating_tasks: "Görevler",
  rating_compensation_benefits: "Ücret ve Yan Haklar",
  rating_career_growth: "Kariyer Gelişimi",
};

const WEAK_THRESHOLD = 3; // average below this flags a "watch out" dimension

/**
 * Aggregate the most-mentioned benefits and the lowest-scoring rating
 * dimensions across all reviews of a company.
 */
export const computeReviewHighlights = (
  reviews: readonly ReviewHighlightInput[]
): ReviewHighlights => {
  const benefitCounts = new Map<string, number>();
  const dimensionTotals = new Map<string, { sum: number; count: number }>();

  for (const review of reviews) {
    for (const benefit of review.benefits ?? []) {
      benefitCounts.set(benefit, (benefitCounts.get(benefit) || 0) + 1);
    }
    for (const key of Object.keys(DIMENSION_LABELS)) {
      const value = (review as Record<string, number | null | undefined>)[key];
      if (typeof value === "number" && value > 0) {
        const existing = dimensionTotals.get(key) || { sum: 0, count: 0 };
        dimensionTotals.set(key, { sum: existing.sum + value, count: existing.count + 1 });
      }
    }
  }

  const topBenefits = [...benefitCounts.entries()]
    .map(([value, count]) => ({ label: BENEFIT_LABELS.get(value) || value, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const weakDimensions = [...dimensionTotals.entries()]
    .map(([key, { sum, count }]) => ({ label: DIMENSION_LABELS[key], avg: sum / count }))
    .filter((dim) => dim.avg < WEAK_THRESHOLD)
    .sort((a, b) => a.avg - b.avg)
    .slice(0, 5);

  return { topBenefits, weakDimensions };
};
