export type VoiceTransport = "elevenlabs" | "browser";

export function shouldUseBrowserSpeech(transport: VoiceTransport, elevenlabsConnected: boolean) {
  return transport === "browser" && !elevenlabsConnected;
}
