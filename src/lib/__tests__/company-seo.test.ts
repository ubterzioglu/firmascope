import { describe, it, expect } from "vitest";
import { latestContentDate, computeCompanySnapshot } from "@/lib/company-seo";

describe("latestContentDate", () => {
  it("falls back to a stable default when there are no dates", () => {
    expect(latestContentDate({})).toBe("2026-01-01");
  });

  it("uses the company created_at when no content exists", () => {
    expect(latestContentDate({ created_at: "2026-03-10T08:00:00Z" })).toBe("2026-03-10");
  });

  it("returns the freshest date across company and content lists", () => {
    const result = latestContentDate(
      { created_at: "2026-01-01T00:00:00Z" },
      [{ created_at: "2026-05-20T12:00:00Z" }],
      [{ created_at: "2026-02-15T00:00:00Z" }],
      [{ created_at: "2026-07-01T00:00:00Z" }]
    );
    expect(result).toBe("2026-07-01");
  });

  it("ignores null/invalid dates", () => {
    const result = latestContentDate(
      { created_at: null },
      [{ created_at: "not-a-date" }, { created_at: "2026-04-04T00:00:00Z" }]
    );
    expect(result).toBe("2026-04-04");
  });
});

describe("computeCompanySnapshot", () => {
  it("aggregates counts, average rating, recommendation rate and top groups", () => {
    const snapshot = computeCompanySnapshot({
      reviews: [
        { title: null, pros: null, cons: null, rating: 4, recommends: true, reviewer_relationship: null, department: "Yazılım", work_model: null, created_at: null },
        { title: null, pros: null, cons: null, rating: 2, recommends: false, reviewer_relationship: null, department: "Yazılım", work_model: null, created_at: null },
      ],
      salaries: [
        { job_title: "Backend", salary_amount: 50000, currency: "TRY", salary_basis: null, seniority_level: null, department: "Yazılım", location_city: null, work_model: null },
      ],
      interviews: [
        { position: "Engineer", experience: null, difficulty: null, result: null, interview_year: null, interview_type: null, stage_count: null, response_time_days: null, salary_discussed: null },
      ],
    });

    expect(snapshot.reviewCount).toBe(2);
    expect(snapshot.salaryCount).toBe(1);
    expect(snapshot.interviewCount).toBe(1);
    expect(snapshot.averageRating).toBe(3);
    expect(snapshot.recommendationRate).toBe(50);
    expect(snapshot.topDepartments).toContain("Yazılım");
    expect(snapshot.topSalaryTitles).toContain("Backend");
    expect(snapshot.topInterviewPositions).toContain("Engineer");
  });

  it("returns null rating/recommendation when there are no reviews", () => {
    const snapshot = computeCompanySnapshot({ reviews: [], salaries: [], interviews: [] });
    expect(snapshot.averageRating).toBeNull();
    expect(snapshot.recommendationRate).toBeNull();
  });
});
