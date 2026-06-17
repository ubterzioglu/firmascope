import { describe, it, expect } from "vitest";
import { aiContentSchema } from "../../../scripts/lib/gemini";

const validPayload = {
  introSummary: "Örnek şirket özeti.",
  cultureSummary: "Kültür özeti.",
  salarySummary: null,
  interviewSummary: null,
  prosSummary: "Artılar.",
  consSummary: null,
  candidateTakeaway: "Adaylar için çıkarım.",
  faqItems: [{ question: "Soru?", answer: "Cevap." }],
  keywords: ["anahtar1", "anahtar2"],
};

describe("aiContentSchema", () => {
  it("accepts a valid AI payload", () => {
    const result = aiContentSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("accepts nullable optional summaries", () => {
    const result = aiContentSchema.safeParse({
      ...validPayload,
      introSummary: null,
      cultureSummary: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing required candidateTakeaway", () => {
    const { candidateTakeaway, ...rest } = validPayload;
    void candidateTakeaway;
    const result = aiContentSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects malformed faqItems", () => {
    const result = aiContentSchema.safeParse({
      ...validPayload,
      faqItems: [{ question: "Eksik cevap" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty candidateTakeaway string", () => {
    const result = aiContentSchema.safeParse({ ...validPayload, candidateTakeaway: "" });
    expect(result.success).toBe(false);
  });

  it("rejects too many keywords", () => {
    const result = aiContentSchema.safeParse({
      ...validPayload,
      keywords: Array.from({ length: 13 }, (_, i) => `k${i}`),
    });
    expect(result.success).toBe(false);
  });
});
