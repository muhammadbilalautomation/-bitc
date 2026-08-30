export function getLiveAvatarStartErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error ?? "");
  const normalized = message.toLowerCase();

  if (normalized.includes("no credits available") || normalized.includes("insufficient credits") || normalized.includes("credits for session") || normalized.includes("4033")) {
    return "LiveAvatar lip-sync cannot start because this account has insufficient session credits. Add LiveAvatar credits, then refresh the website and try again.";
  }

  if (normalized.includes("api request failed") || normalized.includes("failed to fetch")) {
    return "LiveAvatar could not reach its session service from this browser. Check the LiveAvatar allowed origin, production access/credits, and browser network permissions, then try again.";
  }

  return message || "LiveAvatar could not start the lip-sync session. Check the provider configuration and try again.";
}

export function isLiveAvatarStartError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  const normalized = message.toLowerCase();
  return normalized.includes("api request failed") || normalized.includes("failed to fetch") || normalized.includes("no credits available") || normalized.includes("insufficient credits") || normalized.includes("credits for session") || normalized.includes("4033");
}
