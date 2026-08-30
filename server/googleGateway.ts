export type CompanyRecord = {
  companyName: string;
  country: string;
  sector: string;
  website: string;
  businessEmail?: string;
  businessPhone?: string;
  contactPage: string;
  sourceUrl: string;
  publicFact: string;
  fit: string;
  researchedAt: string;
};

export type ApprovedEmail = {
  companyName: string;
  to: string;
  subject: string;
  body: string;
  approved: boolean;
};

function gatewayConfig() {
  return {
    url: process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL,
    token: process.env.GOOGLE_APPS_SCRIPT_TOKEN,
  };
}

async function callGateway(action: string, payload: unknown) {
  const { url, token } = gatewayConfig();
  if (!url || !token) return { connected: false, action, message: "Google gateway is not configured; demo mode remains active." };
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Thabo-Token": token },
    body: JSON.stringify({ action, payload, token }),
  });
  const body = await response.json().catch(() => ({})) as { ok?: boolean; message?: string; rows?: CompanyRecord[]; sent?: boolean };
  if (!response.ok || body.ok === false) throw new Error(body.message || `Google gateway returned ${response.status}`);
  return { connected: true, action, ...body };
}

export async function saveCompanyResearch(rows: CompanyRecord[]) {
  return callGateway("save_research", { rows });
}

export async function readCompanyResearch(query?: string) {
  return callGateway("read_research", { query: query ?? "" });
}

export async function sendApprovedEmail(email: ApprovedEmail) {
  if (!email.approved) throw new Error("Email send requires explicit human approval");
  return callGateway("send_approved_email", email);
}
