export const BITC_KNOWLEDGE_SOURCE = "https://www.bitc.co.bw/";

export const BITC_PUBLIC_KNOWLEDGE = [
  "BITC publicly presents its work around Botswana investment promotion, export development, trade facilitation, stakeholder engagement, research, and Brand Botswana activities.",
  "The official public navigation includes Invest, Export, BOSSC (Botswana One Stop Service Centre), About BITC, Brand Botswana, and Contacts.",
  "The official website publicly references exporter development and promotion programmes, including the Botswana Exporter Development Programme and Botswana Exporter Promotion Programme (BEPP).",
  "The website also references Global Expo Botswana, trade agreements, investment climate information, international relations and rankings, investment sectors, and BOSSC services.",
  "Public pathways include enquiring about a business with BITC, registering a business, submitting feedback, and viewing contact details.",
].join(" ");

export const BITC_CHAT_GUARDRAILS = [
  "Treat these as public website information, not a guarantee or official eligibility decision.",
  "Do not invent contact details, investment guarantees, company facts, or completed external actions.",
  `When useful, direct the user to the official source: ${BITC_KNOWLEDGE_SOURCE}`,
].join(" ");
