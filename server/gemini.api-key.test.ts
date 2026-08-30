import { describe, expect, it } from "vitest";

describe("GEMINI_API_KEY", () => {
  it("authenticates against the lightweight Gemini models endpoint", async () => {
    const key = process.env.GEMINI_API_KEY;
    expect(key).toBeTruthy();

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key ?? "")}`);
    expect(response.ok).toBe(true);
  }, 20_000);
});
