import { afterEach, describe, expect, it, vi } from "vitest";
import { buildResearchBasedDraft, buildResearchFallbackSummary, generateGeminiDraft, parseGeminiCommandJson, summarizeGeminiResearch, understandGeminiCommand } from "./gemini";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Gemini intelligence helpers", () => {
  it("normalizes structured command JSON", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: '{"intent":"export","country":"Kenya","sector":"Agriculture & food processing","count":5}' }] } }],
    }), { status: 200, headers: { "Content-Type": "application/json" } })));

    await expect(understandGeminiCommand("Kenya میں زرعی خریدار پانچ تلاش کرو")).resolves.toEqual({
      intent: "export",
      country: "Kenya",
      sector: "Agriculture & food processing",
      count: 5,
    });
  });

  it("falls back to the local parser when Gemini quota is exhausted", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ error: { message: "Quota exceeded" } }), { status: 429, headers: { "Content-Type": "application/json" } })));

    await expect(understandGeminiCommand("Find 5 renewable energy investors in Kenya")).resolves.toEqual({
      intent: "investment",
      country: "Kenya",
      sector: "Energy & infrastructure",
      count: 5,
    });
  });

  it("ignores prose around a valid JSON object", () => {
    expect(parseGeminiCommandJson('Here is the command: {"intent":"investment","country":"Rwanda","sector":"Logistics","count":2}')).toEqual({ intent: "investment", country: "Rwanda", sector: "Logistics", count: 2 });
  });

  it("returns an empty partial command for invalid model output", () => {
    expect(parseGeminiCommandJson("not valid JSON 123")).toEqual({});
  });

  it("builds a safe local summary when Gemini is unavailable", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ error: { message: "The service is currently unavailable." } }), { status: 503, headers: { "Content-Type": "application/json" } })));

    await expect(summarizeGeminiResearch([{ name: "Example", country: "Kenya", sector: "Agriculture", fact: "Public fact", fit: "Potential fit", source: "https://example.com" }])).resolves.toContain("Gemini’s summary service is temporarily unavailable");
    expect(buildResearchFallbackSummary([{ name: "Example", country: "Kenya", sector: "Agriculture", fact: "Public fact", fit: "Potential fit", source: "https://example.com" }])).toContain("Verify every source");
  });

  it("returns a local summary when Gemini quota is exhausted with 429", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ error: { message: "Quota exceeded" } }), { status: 429, headers: { "Content-Type": "application/json" } })));
    const items = [{ name: "Example", country: "Kenya", sector: "Agriculture", fact: "Public fact", fit: "Potential fit", source: "https://example.com" }];

    await expect(summarizeGeminiResearch(items)).resolves.toContain("Gemini’s summary service is temporarily unavailable");
  });

  it("returns a research-based draft when Gemini quota is exhausted", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ error: { message: "Quota exceeded" } }), { status: 429, headers: { "Content-Type": "application/json" } })));
    const company = { name: "Example", country: "Kenya", sector: "Agriculture", fact: "Public fact", fit: "Potential fit" };

    await expect(generateGeminiDraft(company)).resolves.toBe(buildResearchBasedDraft(company));
  });

  it("returns a supplied-facts-only summary", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: "Three prospects were found across energy and agriculture. The strongest pattern is cross-border investment interest. Verify every source before outreach." }] } }],
    }), { status: 200, headers: { "Content-Type": "application/json" } })));

    await expect(summarizeGeminiResearch([{ name: "Example", country: "Kenya", sector: "Agriculture", fact: "Public fact", fit: "Potential fit", source: "https://example.com" }])).resolves.toContain("Three prospects");
  });
});
