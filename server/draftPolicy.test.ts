import { describe, expect, it } from "vitest";
import { canUseDraftFallback, nextApprovalStatus } from "../shared/draftPolicy";

describe("draft approval policy", () => {
  it("blocks fallback actions until explicit approval", () => {
    expect(canUseDraftFallback("Needs review")).toBe(false);
    expect(canUseDraftFallback("Approved")).toBe(true);
  });

  it("returns approval states for approve and reset actions", () => {
    expect(nextApprovalStatus("approve")).toBe("Approved");
    expect(nextApprovalStatus("reset")).toBe("Needs review");
  });
});
