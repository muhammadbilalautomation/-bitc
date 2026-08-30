export const THABO_ACTIONS = [
  "research_web",
  "find_investors",
  "read_google_sheet",
  "write_google_sheet",
  "draft_email",
  "send_email",
  "check_availability",
  "book_meeting",
  "update_meeting",
  "delete_meeting",
] as const;

export type ThaboAction = (typeof THABO_ACTIONS)[number];

const APPROVAL_REQUIRED = new Set<ThaboAction>([
  "write_google_sheet",
  "send_email",
  "book_meeting",
  "update_meeting",
  "delete_meeting",
]);

export type ActionRequest = {
  action: ThaboAction;
  userMessage: string;
  parameters?: Record<string, unknown>;
  approved?: boolean;
  conversationId?: string;
  userId?: string;
};

export type ActionResult = {
  success: boolean;
  message: string;
  data?: unknown;
  requiresApproval?: boolean;
};

function getWebhookUrl() {
  const value = process.env.THABO_N8N_WEBHOOK_URL?.trim();
  if (!value) throw new Error("THABO_N8N_WEBHOOK_URL is not configured");
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error("THABO n8n webhook must use HTTPS");
  return url;
}

export async function runThaboAction(request: ActionRequest): Promise<ActionResult> {
  if (APPROVAL_REQUIRED.has(request.action) && request.approved !== true) {
    return {
      success: false,
      requiresApproval: true,
      message: `Please approve the ${request.action.replaceAll("_", " ")} action before it is sent to n8n.`,
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(getWebhookUrl(), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.THABO_N8N_WEBHOOK_SECRET
          ? { "x-thabo-webhook-secret": process.env.THABO_N8N_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify({
        ...request,
        source: "thabo-portal",
        requestedAt: new Date().toISOString(),
      }),
      signal: controller.signal,
    });

    const payload = (await response.json().catch(() => null)) as ActionResult | null;
    if (!response.ok) {
      return { success: false, message: payload?.message ?? `The n8n workflow returned HTTP ${response.status}.` };
    }

    return payload ?? { success: true, message: "The action completed successfully." };
  } catch (error) {
    const message = error instanceof Error && error.name === "AbortError"
      ? "The n8n workflow timed out."
      : error instanceof Error
        ? error.message
        : "The n8n workflow could not be reached.";
    return { success: false, message };
  } finally {
    clearTimeout(timeout);
  }
}


