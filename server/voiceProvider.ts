export type VoiceProviderConfig = {
  provider: "browser" | "elevenlabs";
  voiceId?: string;
  configured: boolean;
};

/**
 * The first demo uses browser speech synthesis. When credentials are supplied,
 * the server can switch to ElevenLabs without changing the UI contract.
 */
export function getVoiceProviderConfig(): VoiceProviderConfig {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  return {
    provider: apiKey && voiceId ? "elevenlabs" : "browser",
    voiceId: voiceId || undefined,
    configured: Boolean(apiKey && voiceId),
  };
}
