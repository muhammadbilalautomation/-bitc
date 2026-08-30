import { describe, expect, it } from "vitest";

describe("ElevenLabs paid integration secret", () => {
  it("authenticates against the ElevenLabs user endpoint", async () => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    expect(apiKey, "ELEVENLABS_API_KEY must be configured").toBeTruthy();

    const response = await fetch("https://api.elevenlabs.io/v1/user", {
      headers: { "xi-api-key": apiKey as string },
      signal: AbortSignal.timeout(10_000),
    });

    expect(response.status, `ElevenLabs returned HTTP ${response.status}`).toBeGreaterThanOrEqual(200);
    expect(response.status, `ElevenLabs returned HTTP ${response.status}`).toBeLessThan(300);
  }, 15_000);
});
