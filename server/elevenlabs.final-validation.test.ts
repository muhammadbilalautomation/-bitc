import { describe, expect, it } from "vitest";

describe("ElevenLabs credential validation", () => {
  it("accepts the active API key", async () => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    expect(apiKey, "ELEVENLABS_API_KEY must be configured").toBeTruthy();
    const response = await fetch("https://api.elevenlabs.io/v1/user", {
      headers: { "xi-api-key": apiKey as string },
      signal: AbortSignal.timeout(10_000),
    });
    expect(response.ok, `ElevenLabs returned HTTP ${response.status}`).toBe(true);
  }, 15_000);
});
