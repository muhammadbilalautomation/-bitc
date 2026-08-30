import { describe, expect, it } from "vitest";

describe("LiveAvatar API secret", () => {
  it("authenticates against the public avatar endpoint", async () => {
    const apiKey = process.env.LIVEAVATAR_API_KEY;
    expect(apiKey, "LIVEAVATAR_API_KEY must be configured").toBeTruthy();

    const response = await fetch("https://api.liveavatar.com/v1/avatars/public", {
      headers: { "X-API-KEY": apiKey as string },
      signal: AbortSignal.timeout(10_000),
    });

    expect(response.status, `LiveAvatar returned HTTP ${response.status}`).toBeGreaterThanOrEqual(200);
    expect(response.status, `LiveAvatar returned HTTP ${response.status}`).toBeLessThan(300);
  }, 15_000);
});
