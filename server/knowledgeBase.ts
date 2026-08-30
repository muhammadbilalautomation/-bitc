import { chatWithThabo } from "./gemini";

export const THABO_KNOWLEDGE_SOURCE = {
  name: "Botswana Investment and Trade Centre",
  origin: "https://www.bitc.co.bw/",
} as const;

export type KnowledgeMessage = {
  role: "user" | "assistant";
  content: string;
};

/**
 * Information-only boundary for THABO.
 *
 * The current Gemini implementation already contains the curated BITC context.
 * Crawled BITC chunks can be injected here later without coupling retrieval to
 * email, calendar, Sheets, research, or any other action workflow.
 */
export async function answerFromKnowledgeBase(messages: KnowledgeMessage[]) {
  return chatWithThabo(messages);
}


