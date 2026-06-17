import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { buildCompanySeoPrompt, type CompanyPromptInput } from "./seo-prompt";

const DEFAULT_MODEL = "gemini-2.5-flash";

/**
 * Validated shape of the AI-generated SEO fields. Deterministic fields
 * (wordCount, generationStatus, sourceSnapshot, externalLinks) are NOT produced
 * by the model — the caller fills those in.
 */
const aiContentSchema = z.object({
  introSummary: z.string().min(1).nullable(),
  cultureSummary: z.string().min(1).nullable(),
  salarySummary: z.string().min(1).nullable(),
  interviewSummary: z.string().min(1).nullable(),
  prosSummary: z.string().min(1).nullable(),
  consSummary: z.string().min(1).nullable(),
  candidateTakeaway: z.string().min(1),
  faqItems: z
    .array(z.object({ question: z.string().min(1), answer: z.string().min(1) }))
    .max(8),
  keywords: z.array(z.string().min(1)).max(12),
});

export type GeneratedAiContent = z.infer<typeof aiContentSchema>;

const resolveApiKey = () => {
  const key = process.env.GEMINI_API_KEY;
  return key && !key.startsWith("REPLACE_WITH_") ? key : "";
};

const stripCodeFences = (text: string) =>
  text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

/**
 * Generates SEO content via Gemini. Returns null on any failure (missing key,
 * API error, malformed/invalid response) so the caller can fall back to the
 * deterministic builder. Never throws.
 */
export const generateCompanySummary = async (
  input: CompanyPromptInput
): Promise<GeneratedAiContent | null> => {
  const apiKey = resolveApiKey();
  if (!apiKey) {
    return null;
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const prompt = buildCompanySeoPrompt(input);
  const maxAttempts = 3;

  const ai = new GoogleGenAI({ apiKey });

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });

      const text = response.text;
      if (!text) {
        return null;
      }

      const parsed: unknown = JSON.parse(stripCodeFences(text));
      const result = aiContentSchema.safeParse(parsed);
      if (!result.success) {
        console.warn(`  Gemini response failed validation for ${input.name}: ${result.error.message}`);
        return null;
      }

      return result.data;
    } catch (error) {
      const message = (error as Error).message;
      const isTransient = /\b(429|503|UNAVAILABLE|RESOURCE_EXHAUSTED)\b/.test(message);
      if (isTransient && attempt < maxAttempts) {
        const backoffMs = 1000 * attempt;
        console.warn(`  Gemini transient error for ${input.name} (attempt ${attempt}/${maxAttempts}); retrying in ${backoffMs}ms.`);
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        continue;
      }
      console.warn(`  Gemini generation error for ${input.name}: ${message}`);
      return null;
    }
  }

  return null;
};

export { aiContentSchema };
