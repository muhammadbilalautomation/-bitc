import { describe, expect, it } from "vitest";
import { getLiveAvatarStartErrorMessage, isLiveAvatarStartError } from "../shared/liveavatarErrors";

describe("LiveAvatar start error handling", () => {
  it("explains provider credit failures", () => {
    const error = new Error("No credits available for start session");
    expect(isLiveAvatarStartError(error)).toBe(true);
    expect(getLiveAvatarStartErrorMessage(error)).toContain("session credits");
  });

  it("explains the provider 4033 insufficient-credit response", () => {
    const error = new Error("Insufficient credits for session");
    expect(isLiveAvatarStartError(error)).toBe(true);
    expect(getLiveAvatarStartErrorMessage(error)).toContain("insufficient session credits");
    expect(getLiveAvatarStartErrorMessage(error)).toContain("refresh the website");
  });

  it("explains browser/network session failures", () => {
    const error = new Error("API request failed");
    expect(isLiveAvatarStartError(error)).toBe(true);
    expect(getLiveAvatarStartErrorMessage(error)).toContain("allowed origin");
  });

  it("provides a safe fallback for unknown errors", () => {
    expect(isLiveAvatarStartError(new Error("unexpected provider response"))).toBe(false);
    expect(getLiveAvatarStartErrorMessage(new Error("unexpected provider response"))).toBe("unexpected provider response");
  });
});
