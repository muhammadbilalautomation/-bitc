import { describe, expect, it } from "vitest";
import { shouldUseBrowserSpeech } from "@shared/voiceTransport";

describe("voice transport guard", () => {
  it("blocks browser speech while ElevenLabs is active", () => {
    expect(shouldUseBrowserSpeech("elevenlabs", true)).toBe(false);
  });

  it("allows browser speech in browser fallback mode", () => {
    expect(shouldUseBrowserSpeech("browser", false)).toBe(true);
  });

  it("also blocks browser speech when the active session flag is connected", () => {
    expect(shouldUseBrowserSpeech("browser", true)).toBe(false);
  });
});
