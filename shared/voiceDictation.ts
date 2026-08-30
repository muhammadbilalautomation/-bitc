export function mergeDictationText(existing: string, transcript: string) {
  return [existing.trim(), transcript.trim()].filter(Boolean).join(" ");
}
