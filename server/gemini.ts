import { parseThaboCommand } from "@shared/commandParser";
import { BITC_CHAT_GUARDRAILS, BITC_KNOWLEDGE_SOURCE, BITC_PUBLIC_KNOWLEDGE } from "@shared/bitcKnowledge";
import { searchPublicProspects } from "./serpApi";

export type GeminiCompanyInput = {
  name: string;
  country: string;
  sector: string;
  fact: string;
  fit: string;
};

export type GeminiCommand = {
  intent: "investment" | "export";
  country: string;
  sector: string;
  count: number;
};

export type GeminiResearchSummaryInput = {
  name: string;
  country: string;
  sector: string;
  fact: string;
  fit: string;
  source: string;
};

async function geminiText(prompt: string, maxOutputTokens = 700) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not configured");
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2, maxOutputTokens } }),
  });
  const body = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>; error?: { message?: string } };
  if (!response.ok) throw new Error(body.error?.message || `Gemini returned ${response.status}`);
  return body.candidates?.[0]?.content?.parts?.map(part => part.text ?? "").join("").trim() || "";
}

function firstJsonObject(raw: string) {
  const start = raw.indexOf("{");
  if (start < 0) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < raw.length; index += 1) {
    const character = raw[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') inString = true;
    else if (character === "{") depth += 1;
    else if (character === "}") {
      depth -= 1;
      if (depth === 0) return raw.slice(start, index + 1);
    }
  }
  return null;
}

export function parseGeminiCommandJson(raw: string): Partial<GeminiCommand> {
  const json = firstJsonObject(raw);
  if (!json) return {};
  try {
    return JSON.parse(json) as Partial<GeminiCommand>;
  } catch {
    return {};
  }
}

function normalizeGeminiCommand(parsed: Partial<GeminiCommand>): GeminiCommand {
  return {
    intent: parsed.intent === "export" ? "export" : "investment",
    country: String(parsed.country || "United Arab Emirates"),
    sector: String(parsed.sector || "Energy & infrastructure"),
    count: Math.min(Math.max(Number(parsed.count) || 3, 1), 10),
  };
}

export async function understandGeminiCommand(text: string): Promise<GeminiCommand> {
  try {
    const raw = await geminiText([
      "Extract a business research command as JSON only.",
      'Schema: {"intent":"investment"|"export","country":"string","sector":"string","count":number}',
      "Use the user's language if possible, but return normalized English field values.",
      "Never invent a country or sector; use the closest explicit phrase and count 3 if no count is stated.",
      `User command: ${text}`,
    ].join("\\n"));
    return normalizeGeminiCommand(parseGeminiCommandJson(raw));
  } catch {
    return normalizeGeminiCommand(parseThaboCommand(text));
  }
}

export function buildResearchFallbackSummary(items: GeminiResearchSummaryInput[]): string {
  const count = items.length;
  const sectors = Array.from(new Set(items.map(item => item.sector).filter(Boolean))).slice(0, 3).join(", ");
  const countries = Array.from(new Set(items.map(item => item.country).filter(Boolean))).slice(0, 3).join(", ");
  return `I found ${count} public prospect${count === 1 ? "" : "s"}${sectors ? ` across ${sectors}` : ""}${countries ? ` in ${countries}` : ""}. Gemini’s summary service is temporarily unavailable, so this report uses only the supplied public facts. Verify every source and contact route before any outreach.`;
}

export async function summarizeGeminiResearch(items: GeminiResearchSummaryInput[]): Promise<string> {
  const compact = items.slice(0, 10).map(item => ({ name: item.name, country: item.country, sector: item.sector, fact: item.fact, fit: item.fit, source: item.source }));
  try {
    return await geminiText([
      "Summarize this BITC public-web research in 3 concise sentences.",
      "Mention the number of prospects, the strongest patterns, and remind the user that every lead needs source verification before outreach.",
      "Use only supplied facts; do not invent contact details or claims.",
      JSON.stringify(compact),
    ].join("\\n"));
  } catch {
    return buildResearchFallbackSummary(items);
  }
}

export function buildResearchBasedDraft(company: GeminiCompanyInput): string {
  return `Subject: Exploring ${company.sector} opportunities in Botswana\n\nDear ${company.name} team,\n\nI am reaching out from the Botswana Investment and Trade Centre. ${company.fact} This appears relevant to Botswana’s ${company.sector.toLowerCase()} opportunities.\n\n${company.fit} We would welcome the opportunity to share a concise brief and explore whether there is a fit for a conversation with our investment and trade team. Would you be open to a short introductory call next week?\n\nKind regards,\nBITC Investment Team`;
}

export async function generateGeminiDraft(company: GeminiCompanyInput): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return buildResearchBasedDraft(company);

  const prompt = [
    "Write one concise, professional, personalized business-development email for BITC.",
    "Use only the public facts supplied below; do not invent contact details, partnerships, funding, or claims.",
    "Return subject line, greeting, 2 short paragraphs, one clear call to action, and sign-off.",
    `Company: ${company.name}`,
    `Country: ${company.country}`,
    `Sector: ${company.sector}`,
    `Public fact: ${company.fact}`,
    `Potential fit: ${company.fit}`,
    "Sender: Botswana Investment and Trade Centre (BITC)",
  ].join("\n");

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.35, maxOutputTokens: 700 } }),
    });
    const body = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>; error?: { message?: string } };
    if (!response.ok) throw new Error(body.error?.message || `Gemini returned ${response.status}`);
    const text = body.candidates?.[0]?.content?.parts?.map(part => part.text ?? "").join("").trim();
    if (!text) throw new Error("Gemini returned an empty draft");
    return text;
  } catch {
    return buildResearchBasedDraft(company);
  }
}

export type ThaboChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function isGreetingOnly(text: string) {
  return /^(hi|hello|hey|good morning|good afternoon|good evening|salam|assalam(?:u|o)? alaikum|سلام|السلام علیکم)[!.?,\s]*$/i.test(text.trim());
}

function isRomanUrdu(text: string) {
  return /\b(?:mujhe|moja|mojay|ki|ka|ke|do|batao|bataye|maloomat|jaankari|kya|hai|hain|chahiye|dikhao|samjhao|karna|karo)\b/i.test(text);
}

function isUrduScript(text: string) {
  return /[\u0600-\u06ff]/.test(text);
}

function isBitcInformationRequest(text: string) {
  return /\b(?:bitc|botswana investment and trade centre)\b/i.test(text) &&
    /(?:information|info|maloomat|jaankari|bata|bataye|about|services?|what|how|kya|kaam|do|contact|invest|export|trade)|(?:معلومات|بتاؤ|بتائیں|کیا|کام|سروس|رابطہ|سرمایہ|برآمد)/i.test(text);
}

export function buildBitcInformationReply(message: string): string {
  if (isUrduScript(message)) {
    return "BITC یعنی Botswana Investment and Trade Centre، بوٹسوانا میں سرمایہ کاری لانے، برآمدات بڑھانے، تجارت میں سہولت دینے، کاروباری تحقیق، شراکت داروں سے رابطے اور Brand Botswana کو فروغ دینے میں مدد کرتا ہے۔ اس کی عوامی ویب سائٹ پر Invest، Export، BOSSC ون اسٹاپ سروسز، سرمایہ کاری کے شعبے، Global Expo Botswana اور رابطے کی معلومات موجود ہیں۔ مزید مستند معلومات کے لیے https://www.bitc.co.bw/ دیکھیں۔";
  }
  if (isRomanUrdu(message)) {
    return "BITC yani Botswana Investment and Trade Centre, Botswana mein investment lane, exports barhane, trade ko asaan banane, business research aur investors ya partners se rabta karne mein madad karta hai. Is ki official website par Invest, Export, BOSSC one-stop services, investment sectors, Global Expo Botswana aur contact information di gayi hai. Tafseel ke liye https://www.bitc.co.bw/ dekhein.";
  }
  return "BITC, the Botswana Investment and Trade Centre, supports investment promotion, export development, trade facilitation, business research, stakeholder engagement, and Brand Botswana activities. Its official public website includes Invest, Export, BOSSC one-stop services, investment sectors, Global Expo Botswana, and contact pathways. Official source: https://www.bitc.co.bw/.";
}

export function buildThaboChatFallback(message: string): string {
  const trimmed = message.trim();
  if (isGreetingOnly(trimmed)) return "Hello. I’m Thabo from BITC. How can I help with Botswana investment, trade, research, or business opportunities?";
  if (isBitcInformationRequest(trimmed)) return buildBitcInformationReply(trimmed);
  if (trimmed.length < 36) return `I received “${trimmed}”. Please tell me the specific BITC information you need—for example investment services, export support, BOSSC services, or official contact details.`;
  return `I could not generate a complete reply to “${trimmed}” right now. Please rephrase the request and I will answer that specific point directly.`;
}

function isResearchRequest(text: string) {
  return /\b(research|find|search|prospect|investor|buyers?|companies|market scan|look for|dhoondo|dhoondho|talash|talaash|sarmaya kar|sararmayakaar)\b|(?:تحقیق|ریسرچ|تلاش|سرمایہ کار|خریدار|کمپنیاں)/i.test(text);
}

function isMeetingRequest(text: string) {
  return /\b(book|schedule|arrange|set up|meeting|appointment|call|mulaqat|mلاقات)\b|(?:میٹنگ|ملاقات|اجلاس|وقت لے)/i.test(text);
}

async function buildResearchChatReply(message: string) {
  const command = parseThaboCommand(message);
  const results = await searchPublicProspects(command);
  const lines = results.slice(0, 5).map((item, index) => `${index + 1}. **${item.name}** — ${item.fact} [Source](${item.source})`);
  return `I found ${results.length} public ${command.intent === "export" ? "export-related result" : "investment-related result"}${results.length === 1 ? "" : "s"} for ${command.country} and ${command.sector}. These are research leads, not verified endorsements; please review each source before outreach.\n\n${lines.join("\n")}`;
}

function buildMeetingChatReply() {
  return "I can help prepare a meeting request with BITC. The live Google Calendar booking action is not connected in this demo yet, so I have not created an appointment. Please share the preferred date, time, timezone, purpose, and attendee details, or use the official BITC contact route: https://www.bitc.co.bw/contact-us.";
}

export async function chatWithThabo(messages: ThaboChatMessage[]): Promise<string> {
  const recentMessages = messages.slice(-6);
  const latestMessage = recentMessages.at(-1)?.content ?? "";

  if (isMeetingRequest(latestMessage)) return buildMeetingChatReply();
  if (isResearchRequest(latestMessage)) {
    try {
      return await buildResearchChatReply(latestMessage);
    } catch {
      return "I could not complete the public search right now. Please try again with a country, sector, and number of results, and verify all sources before outreach.";
    }
  }
  if (isBitcInformationRequest(latestMessage)) return buildBitcInformationReply(latestMessage);

  const prompt = [
    "You are Thabo, BITC's professional business-development assistant.",
    "Answer naturally in a warm, concise, WhatsApp-like conversational style using short paragraphs.",
    "Answer the latest user message directly and specifically before adding any context.",
    "Do not repeat the user’s message as your answer and do not ask for clarification when the request is already clear.",
    "Do not introduce yourself or send a generic welcome unless the latest message is actually a greeting.",
    "Never use a canned response such as 'I am ready to help' when the user has asked a concrete question.",
    "For a clear information request, give the answer first, then one useful next step or official source.",
    "If the message is genuinely unclear, ask one focused clarification that quotes or refers to the user’s actual words.",
    "Answer in the same language as the latest user message whenever possible, including Urdu script or Roman Urdu.",
    "Focus on Botswana investment, trade, market opportunities, investor engagement, and practical business-development guidance.",
    `Official BITC public knowledge: ${BITC_PUBLIC_KNOWLEDGE}`,
    `Source: ${BITC_KNOWLEDGE_SOURCE}`,
    BITC_CHAT_GUARDRAILS,
    "Do not claim that an external action, call, email, calendar booking, or spreadsheet update was completed unless the user has explicitly connected and invoked that integration.",
    "Use only the official knowledge above plus the conversation; do not invent contact details, company facts, or official commitments.",
    "Conversation:",
    ...recentMessages.map(item => `${item.role === "user" ? "User" : "Thabo"}: ${item.content}`),
    "Reply to the latest user message:",
  ].join("\n");

  try {
    const response = await geminiText(prompt, 420);
    return response || buildThaboChatFallback(latestMessage);
  } catch {
    return buildThaboChatFallback(latestMessage);
  }
}
