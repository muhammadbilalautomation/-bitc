import { afterEach, describe, expect, it, vi } from "vitest";

const newAvatarId = "91342979-4c4c-44f1-bd3b-1c846d20341e";

describe("LiveAvatar avatar ID configuration", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("uses the configured avatar ID when requesting a session token", async () => {
    vi.stubEnv("LIVEAVATAR_API_KEY", "test-liveavatar-key");
    vi.stubEnv("LIVEAVATAR_AVATAR_ID", newAvatarId);
    vi.stubEnv("ELEVENLABS_API_KEY", "test-elevenlabs-key");
    vi.stubEnv("ELEVENLABS_AGENT_ID", "test-agent-id");

    const requests: Array<{ url: string; body: Record<string, unknown> }> = [];
    vi.stubGlobal("fetch", vi.fn(async (input: string | URL, init?: RequestInit) => {
      const body = init?.body ? JSON.parse(String(init.body)) as Record<string, unknown> : {};
      requests.push({ url: String(input), body });
      if (String(input).endsWith("/v1/secrets")) {
        return new Response(JSON.stringify({ data: { secret_id: "secret-test-id" } }), { status: 200, headers: { "content-type": "application/json" } });
      }
      return new Response(JSON.stringify({ data: { session_token: "session-token", session_id: "session-id" } }), { status: 200, headers: { "content-type": "application/json" } });
    }));

    const { createLiveAvatarSession } = await import("./liveavatar");
    const session = await createLiveAvatarSession();
    const tokenRequest = requests.find(request => request.url.endsWith("/v1/sessions/token"));

    expect(session.avatarId).toBe(newAvatarId);
    expect(tokenRequest?.body.avatar_id).toBe(newAvatarId);
  });
});

export {};

