import { describe, expect, it } from "vitest";

describe("Gemini secret", () => {
  it("authenticates a lightweight models-list request", async () => {
    const key = process.env.GEMINI_API_KEY;
    expect(key, "GEMINI_API_KEY must be configured").toBeTruthy();

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key as string)}`);
    const body = await response.json() as { models?: unknown[]; error?: { message?: string } };

    expect(response.ok, `Gemini returned ${response.status}: ${body.error?.message ?? "unknown error"}`).toBe(true);
    expect(body.models?.length).toBeGreaterThan(0);
  }, 15000);
});
