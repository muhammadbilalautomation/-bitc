# International Chat UI Research Findings

## Sources

1. Setproduct, “Designing AI chat interfaces: Anatomy, patterns, pitfalls” — https://www.setproduct.com/blog/ai-chat-interface-ui-design
2. UXPin, “Chat UI Design: How to Build Effective Chat Interfaces in 2026” — https://www.uxpin.com/studio/blog/chat-user-interface-design/

## Applicable findings

Setproduct describes the composer as a multiline textarea with a clear submit control, a sensible growth cap, and keyboard behavior that distinguishes sending from adding a new line. It also recommends rendering the user message immediately, exposing clear queued/thinking/streaming/error states, and keeping assistant responses in a comfortable readable width.

The same source distinguishes AI chat from human messaging: AI interfaces need clear uncertainty and failure recovery rather than generic silence or canned dead-end messages. For Thabo, this supports direct replies tied to the latest user message, source-aware research results, and honest meeting-booking status.

UXPin emphasizes readable input and message hierarchy, WCAG-aware contrast, keyboard navigation, ARIA labels/live regions, legible typography, customizable light/dark themes, and touch targets of at least 44 by 44 pixels. These principles support making the typed composer text explicitly visible, retaining accessible mic/send controls, and keeping the responsive chat usable on mobile.

The current Thabo update applies the relevant principles without copying another product: direct contextual prompting and fallback behavior, visible composer text styling, accessible labels, a send keyboard hint, microphone dictation status, and responsive mobile/desktop layouts.
