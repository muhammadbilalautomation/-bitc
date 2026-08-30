import { afterEach, describe, expect, it, vi } from "vitest";
import { buildBitcInformationReply, buildThaboChatFallback, chatWithThabo } from "./gemini";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Thabo public chat", () => {
  it("returns the model response for a BITC conversation grounded in the official source", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: "Botswana offers strong opportunities across energy, infrastructure, and trade." }] } }],
    }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(chatWithThabo([{ role: "user", content: "What can Botswana offer investors?" }])).resolves.toContain("Botswana offers");
    const requestBody = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(requestBody.contents[0].parts[0].text).toContain("https://www.bitc.co.bw/");
  });

  it("keeps a concrete fallback tied to the user’s actual message", () => {
    expect(buildThaboChatFallback("BITC Kay")).toContain("BITC Kay");
    expect(buildThaboChatFallback("BITC Kay")).not.toContain("I’m ready to help with BITC-related business development");
  });

  it("uses a welcome only for a greeting", () => {
    expect(buildThaboChatFallback("Hello")).toContain("How can I help");
    expect(buildThaboChatFallback("Hello")).toContain("Thabo from BITC");
  });

  it("answers a Roman Urdu BITC information request directly", () => {
    const reply = buildThaboChatFallback("Moja bitc ki information do");
    expect(reply).toContain("BITC yani Botswana Investment and Trade Centre");
    expect(reply).toContain("https://www.bitc.co.bw/");
    expect(reply).not.toContain("Could you clarify");
  });

  it("routes a clear Roman Urdu BITC question to a direct answer", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const reply = await chatWithThabo([{ role: "user", content: "Moja bitc ki information do" }]);
    expect(reply).toContain("BITC yani Botswana Investment and Trade Centre");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("answers Urdu-script BITC questions in Urdu", () => {
    const reply = buildBitcInformationReply("مجھے BITC کی معلومات بتاؤ");
    expect(reply).toContain("بوٹسوانا میں سرمایہ کاری");
    expect(reply).toContain("https://www.bitc.co.bw/");
  });

  it("keeps a short non-BITC request specific instead of repeating the message", () => {
    const reply = buildThaboChatFallback("investment");
    expect(reply).toContain("specific BITC information");
    expect(reply).toContain("investment");
  });

  it("returns a safe fallback when the model is unavailable", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ error: { message: "Quota exceeded" } }), { status: 429, headers: { "Content-Type": "application/json" } })));

    await expect(chatWithThabo([{ role: "user", content: "Help me contact BITC" }])).resolves.toBe(buildThaboChatFallback("Help me contact BITC"));
  });

  it("routes meeting requests to honest booking guidance when Calendar is not connected", async () => {
    await expect(chatWithThabo([{ role: "user", content: "I need to book a meeting with BITC" }])).resolves.toContain("Google Calendar booking action is not connected");
  });

  it("routes research requests to public results with source links", async () => {
    vi.stubEnv("SERPAPI_API_KEY", "");
    await expect(chatWithThabo([{ role: "user", content: "Research 3 renewable energy investors in the UAE" }])).resolves.toContain("https://www.bitc.co.bw/");
  });
});
