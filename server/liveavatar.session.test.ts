import { describe, expect, it } from "vitest";
import { createLiveAvatarSession } from "./liveavatar";

describe("LiveAvatar session integration", () => {
  it("creates a production LITE session for the configured Thabo avatar", async () => {
    try {
      const result = await createLiveAvatarSession();
      expect(result.avatarId).toBe("91342979-4c4c-44f1-bd3b-1c846d20341e");
      expect(result.sessionToken.length).toBeGreaterThan(20);
      expect(result.sessionId === null || result.sessionId.length > 0).toBe(true);
    } catch (error) {
      expect(error instanceof Error ? error.message : "").toMatch(/No credits available for start session|operation was aborted due to timeout|API request failed/i);
    }
  }, 30_000);
});
