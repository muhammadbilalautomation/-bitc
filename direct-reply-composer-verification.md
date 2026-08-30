# Direct Reply and Composer Verification

The direct-reply prompt now explicitly requires Thabo to answer the latest user message first, avoid generic self-introductions, and ask one focused clarification when the message is unclear. The fallback also distinguishes greeting-only messages from short or concrete messages and keeps the user’s actual wording in the response.

The chat composer remains responsive with a rounded WhatsApp-style input, explicit message accessibility label, send keyboard hint, microphone dictation control, circular send control, and a live dictation status message. Desktop and mobile surrounding layouts remain stable after the update.

TypeScript and the full Vitest suite passed after the prompt, fallback, and composer changes.
