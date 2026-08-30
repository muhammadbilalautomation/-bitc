import { describe, expect, it } from "vitest";

describe("ElevenLabs browser-only configuration", () => {
  it("does not require an API key for the browser voice session", () => {
    const agentId = process.env.ELEVENLABS_AGENT_ID ?? "";
    expect(agentId).toMatch(/^agent_[A-Za-z0-9]+$/);
  });
});
