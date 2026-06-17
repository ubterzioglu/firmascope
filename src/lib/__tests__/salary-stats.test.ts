import { describe, it, expect } from "vitest";
import { computeSalaryStats } from "@/lib/salary-stats";

describe("computeSalaryStats", () => {
  it("returns empty array for no salaries", () => {
    expect(computeSalaryStats([])).toEqual([]);
  });

  it("computes min/avg/max/count per job title + city", () => {
    const stats = computeSalaryStats([
      { job_title: "QA Engineer", salary_amount: 50000, currency: "TRY", location_city: "İstanbul" },
      { job_title: "QA Engineer", salary_amount: 70000, currency: "TRY", location_city: "İstanbul" },
      { job_title: "QA Engineer", salary_amount: 90000, currency: "TRY", location_city: "İstanbul" },
    ]);
    expect(stats).toHaveLength(1);
    expect(stats[0]).toMatchObject({
      jobTitle: "QA Engineer",
      city: "İstanbul",
      currency: "TRY",
      min: 50000,
      avg: 70000,
      max: 90000,
      count: 3,
    });
  });

  it("separates groups by city", () => {
    const stats = computeSalaryStats([
      { job_title: "Developer", salary_amount: 60000, location_city: "İstanbul" },
      { job_title: "Developer", salary_amount: 40000, location_city: "Ankara" },
    ]);
    expect(stats).toHaveLength(2);
  });

  it("sorts by sample count descending", () => {
    const stats = computeSalaryStats([
      { job_title: "Rare Role", salary_amount: 10000 },
      { job_title: "Common Role", salary_amount: 20000 },
      { job_title: "Common Role", salary_amount: 30000 },
    ]);
    expect(stats[0].jobTitle).toBe("Common Role");
    expect(stats[0].count).toBe(2);
  });

  it("skips entries with invalid amounts", () => {
    const stats = computeSalaryStats([
      { job_title: "QA", salary_amount: Number.NaN },
      { job_title: "QA", salary_amount: 50000 },
    ]);
    expect(stats).toHaveLength(1);
    expect(stats[0].count).toBe(1);
  });

  it("defaults currency to TRY when missing", () => {
    const stats = computeSalaryStats([{ job_title: "QA", salary_amount: 50000 }]);
    expect(stats[0].currency).toBe("TRY");
  });
});
