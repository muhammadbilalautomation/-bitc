import { describe, expect, it } from "vitest";

describe("ElevenLabs API key status", () => {
  it("returns an authenticated account response", async () => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    expect(apiKey, "ELEVENLABS_API_KEY must be configured").toBeTruthy();

    const response = await fetch("https://api.elevenlabs.io/v1/user", {
      headers: { "xi-api-key": apiKey as string },
      signal: AbortSignal.timeout(10_000),
    });

    expect(response.ok, `ElevenLabs returned HTTP ${response.status}`).toBe(true);
    const body = (await response.json()) as { subscription?: unknown };
    expect(body).toBeTruthy();
  }, 15_000);
});
