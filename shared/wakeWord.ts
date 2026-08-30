export type WakeWordResult = {
  activated: boolean;
  command: string;
};

export function extractWakeCommand(transcript: string): WakeWordResult {
  const normalized = transcript.trim().replace(/\s+/g, " ");
  const match = normalized.match(/^thabo(?:\s+(.*))?$/i);
  if (!match) return { activated: false, command: "" };
  return { activated: true, command: (match[1] ?? "").trim() };
}
