import { describe, expect, it } from "vitest";

describe("SerpApi secret", () => {
  it("authenticates a lightweight Google search request", async () => {
    const key = process.env.SERPAPI_API_KEY;
    expect(key, "SERPAPI_API_KEY must be configured").toBeTruthy();

    const params = new URLSearchParams({
      engine: "google",
      q: "BITC Botswana",
      num: "1",
      api_key: key as string,
    });
    const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
    const body = await response.json() as { search_metadata?: { status?: string }; error?: string };

    expect(response.ok, `SerpApi returned ${response.status}: ${body.error ?? "unknown error"}`).toBe(true);
    expect(body.search_metadata?.status).toBe("Success");
  }, 15000);
});
