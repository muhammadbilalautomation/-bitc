export type DraftApprovalStatus = "Needs review" | "Approved";

export function canUseDraftFallback(status: DraftApprovalStatus) {
  return status === "Approved";
}

export function nextApprovalStatus(action: "approve" | "reset"): DraftApprovalStatus {
  return action === "approve" ? "Approved" : "Needs review";
}
