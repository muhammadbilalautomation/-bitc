import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("voice startup behavior", () => {
  it("uses the supplied poster with the restored LiveAvatar lip-sync path", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(source).toContain("thabo-anthony-liveavatar-reference_e381baca.png");
    expect(source).toContain("liveAvatarPoster ?? \"/manus-storage/thabo-anthony-liveavatar-reference_e381baca.png\"");
    expect(source).toContain("LiveAvatarSession");
    expect(source).toContain("liveAvatarActive");
    expect(source).toContain("liveAvatarVideoRef");
    expect(source).toContain("liveAvatarMutation.mutateAsync");
    expect(source).toContain("AgentEventsEnum.AVATAR_SPEAK_STARTED");
    expect(source).toContain("SessionEvent.SESSION_STREAM_READY");
    expect(source).toContain("<video ref={liveAvatarVideoRef} autoPlay playsInline");
    expect(source).toContain("assistant-face-image assistant-face-video");
    expect(source).toContain("voiceChat: true");
    expect(source).toContain('apiUrl: "/api/liveavatar"');
    expect(source).not.toContain("nextLiveSession.voiceChat.start");
    expect(source).toContain("withTimeout(activeLiveSession.start(), 30_000");
    expect(source).toContain("VoiceChatState.ACTIVE");
    expect(source).toContain("AgentEventsEnum.USER_SPEAK_STARTED");
    expect(source).toContain("activeLiveSession.interrupt()");
    expect(source).toContain("LiveAvatar could not start. Trying the connected Thabo voice service.");
    expect(source).toContain("getLiveAvatarStartErrorMessage");
    expect(source).toContain("isLiveAvatarStartError");
    expect(source).toContain("noCredits");
    expect(source).toContain("/no credits available|insufficient credits|credits for session|4033/i");
  });

  it("keeps the direct ElevenLabs browser voice path and fallback behavior", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(source).toContain("Conversation.startSession");
    expect(source).not.toContain("speakBrowserFallback");
    expect(source).toContain("onInterruption");
    expect(source).toContain("onClick={connected || session ? stopSession : startSession}");
  });
});
