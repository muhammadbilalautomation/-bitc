import { describe, expect, it } from "vitest";

describe("new ElevenLabs agent configuration", () => {
  it("uses the newly configured agent id shape", () => {
    const agentId = process.env.ELEVENLABS_AGENT_ID ?? "";
    expect(agentId).toBe("agent_5001m0m1f8hqe4ys3jkv7zf3rgkv");
  });
});
