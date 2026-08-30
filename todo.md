# Project TODO

- [x] Build the dark Thabo BITC dashboard shell inspired by the JARVIS demo.
- [x] Add the animated holographic Thabo orb/face with listening, thinking, speaking, and idle states.
- [x] Add microphone push-to-talk using the browser Web Speech API.
- [x] Add a best-effort “Thabo” wake-word detection attempt with a visible microphone permission and listening state.
- [x] Add typed command fallback for users who cannot or do not want to use voice.
- [x] Parse command intent, target country, investment sector, and requested company count.
- [x] Add BITC investment/export mode controls and target filters.
- [x] Add transparent public-source research result cards with company, website, country, sector, contact URL, and source URL.
- [x] Add per-company research summary cards and source transparency.
- [x] Add personalized BITC outreach email drafts using company-specific facts.
- [x] Prevent sending or saving any email draft without explicit human approval.
- [x] Add editable draft review interface with approve, revise, cancel, copy, and download actions.
- [x] Add clipboard fallback and plain-text download fallback for approved drafts.
- [x] Add audit log fields for company, draft content, approval status, action, and timestamp.
- [x] Add activity/history panel for research sessions, companies, drafts, and approval outcomes.
- [x] Add browser text-to-speech responses for Thabo.
- [x] Architect a future ElevenLabs voice swap-in through configurable server-side credentials.
- [x] Add empty, loading, error, and unsupported-browser states.
- [x] Add responsive mobile and desktop layouts with accessible controls and visible focus states.
- [x] Write/update Vitest coverage for command parsing and approval safeguards.
- [x] Run type checks, tests, and visual screenshots before delivery.

- [x] Defer ElevenLabs API key and voice ID; user will provide them in a later phase.
- [x] Defer server-side ElevenLabs text-to-speech endpoint; browser speech remains the active demo fallback.
- [x] Defer ElevenLabs playback states until the provider is connected.
- [x] Defer ElevenLabs provider tests until the provider is connected.
- [x] Defer post-ElevenLabs validation until that integration phase.

- [x] Add demo-only Botswana exchange market overview using the client-provided company list.
- [x] Add clearly labeled simulated stock prices, percentage moves, watchlist cards, and chart interactions.
- [x] Add company detail panel with sector, simulated price chart, day range, and demo disclaimer.
- [x] Add a demo navigation flow between market overview, company detail, Thabo research, and draft preview without production integrations.
- [x] Preserve the explicit demo-only boundary: no live trading, real brokerage actions, WhatsApp, phone, CRM, or real outbound email in this iteration.

- [x] Replace the rejected Brave Search provider path with SerpApi for public web research.
- [x] Add SERPAPI_API_KEY through secure project secrets and validate it with a lightweight request.
- [x] Add a server-side SerpApi research helper that returns transparent source URLs and safe demo fallback data.
- [x] Update tests and documentation to identify SerpApi as the selected research provider.

- [x] Add direct market company-to-Thabo research prefill and draft preview flow.
- [x] Make Market/Thabo navigation visible on mobile screens.
- [x] Preserve selected market company context when opening research and draft review.

- [x] Require an exact “Thabo” wake phrase before command capture; ignore unrelated speech while dormant.
- [x] Add an explicit dormant/listening/processing/speaking voice state machine with a push-to-talk fallback.
- [x] Add live SerpApi Google research for company names, sectors, websites, and publicly listed business contact details.
- [x] Label public contact hints as unverified, preserve transparent source URLs, and never infer or fabricate missing email/phone fields.
- [x] Add Gemini API integration for structured command understanding, research summarization, and company-specific drafts.
- [x] Defer Google Sheets OAuth/connector setup and structured read/write by user request.
- [x] Add spoken research completion report showing count, companies found, and fields captured; clearly state external saving is deferred.
- [x] Defer voice reading of Google Sheets records by user request.
- [x] Defer final email-send confirmation until Gmail sending is connected; current draft review remains approval-only.
- [x] Defer Gmail send integration, rate limits, duplicate protection, and send audit logging by user request.
- [x] Defer integration-dependent end-to-end tests; wake-word and Gemini unit coverage is active in this milestone.

- [x] Defer approval/auto-send mode selector until an email provider is connected.
- [x] Defer auto-send control and confirmation phrase by user request.
- [x] Defer outbound recipient validation and sending safeguards until Gmail integration.
- [x] Defer send-mode audit outcomes until outbound sending exists.
- [x] Defer email-mode tests until outbound sending exists.

- [x] Add a landing-page section explaining Thabo social account integrations.
- [x] Add demo cards for generating social posts, flyers, and videos.
- [x] Add social post link attachment and voice-agent link routing explanation.
- [x] Add connection/status UI for multiple social accounts with demo-only labels.
- [x] Keep real publishing behind explicit account permissions and approval controls.

- [x] Treat the deliverable as one focused demo landing page that hosts the Thabo experience.
- [x] Do not build a full public business website, production marketing site, or complete social publishing platform in this iteration.
- [x] Keep all feature explanations, interactive demo entry points, simulated market view, and social capability cards inside the demo landing page.
- [x] Add clear demo-only language so the client understands which integrations are simulated versus live.

- [x] Defer Apps Script gateway validation by user request; prepared gateway remains for a later phase.
- [x] Defer Apps Script deployment documentation until the user starts the Google integration phase.

- [x] Keep Google Sheets, Gmail, Calendar, Apps Script, ElevenLabs, and n8n integrations deferred for this iteration.
- [x] Complete the live SerpApi research workflow as the primary demo action.
- [x] Complete Gemini command understanding, research summaries, and personalized draft generation.
- [x] Add clear UI status that deferred integrations are not active in this demo milestone.

- [x] Fix TRPC mutation error: Unexpected non-whitespace character after JSON at position 3 on /?from_webdev=1.
- [x] Add regression coverage for the failing mutation response/parsing path.
- [x] Re-run type checks, tests, and preview verification after the mutation fix.

- [x] Replace the robotic orb with a front-facing African business professional assistant portrait.
- [x] Add subtle speaking bounce/vibration and listening/thinking visual states to the portrait.
- [x] Remove Market navigation and extra landing-page sections so the demo is one focused single-page experience.
- [x] Verify the single-page layout and portrait state styling on desktop and mobile; live speaking animation is wired to assistant state changes.

- [x] Remove the lower metrics, research results, source details, and draft-review interface from the current demo page.
- [x] Keep only the upper Thabo portrait, voice controls, and voice-status hero area; the lower command/research console remains removed by user request.
- [x] Verify the shortened page on desktop and mobile and save a new checkpoint.

- [x] Add ElevenLabs API key securely through project secrets for the supplied agent.
- [x] Wire ElevenLabs agent `agent_5401m0g6smcqe9086sznkwfq0ytw` into the Thabo voice experience; live microphone start requires the user to click Talk to Thabo and grant browser permission.
- [x] Preserve SerpApi/Gemini research handoff and add automatic browser voice fallback on ElevenLabs startup/runtime errors.
- [x] Validate ElevenLabs configuration with focused API and Agent endpoint tests; live microphone session still requires a user click and browser permission.

- [x] Prevent ElevenLabs and browser speech from speaking the same response twice.
- [x] Add a single-source voice guard and verify no duplicate playback path remains.
- [x] Run tests and preview verification for the duplicate-voice fix.

- [x] Add a focused regression test proving browser speech is skipped while ElevenLabs is the active transport.
- [x] Record that live microphone end-to-end audio verification requires a user click and browser permission in Preview.

- [x] Diagnose the TRPC mutation error: The service is currently unavailable; the failing path was ai.summarizeResearch when Gemini briefly returned 503.
- [x] Add a resilient local research summary fallback when Gemini is unavailable.
- [x] Run tests and preview verification for the service-unavailable mutation path; fresh browser preview loads cleanly and direct tRPC verification returns HTTP 200.

- [x] Handle Gemini free-tier quota exhaustion without surfacing a TRPC mutation error by returning safe server-side fallbacks.
- [x] Add truthful local fallbacks for command understanding, summaries, and drafts; no automatic retry is used so the exhausted quota is not consumed further.
- [x] Add quota regression tests and verify the affected mutation responses.

- [x] Verify command understanding fallback while Gemini quota is exhausted.
- [x] Verify research summary fallback while Gemini quota is exhausted.
- [x] Verify draft server fallback and HTTP response behavior while Gemini quota is exhausted; live UI click-through remains a browser-permission-dependent check.
- [x] Record test results and fallback scope; all three AI mutations returned HTTP 200, while live UI click-through remains browser-permission-dependent.

- [x] Reduce the active demo to an ElevenLabs-only voice-agent shell.
- [x] Remove active SerpApi, Gemini, research, draft, market, social, and quota-fallback UI/workflows from the demo; server helpers remain dormant for possible future work.
- [x] Preserve Agent ID `agent_5401m0g6smcqe9086sznkwfq0ytw`, ElevenLabs API configuration, voice session, and transcript display; no other active voice provider is used.
- [x] Verify the simplified ElevenLabs-only page on desktop and mobile and save a checkpoint.

- [x] Preserve all existing Thabo content, controls, structure, and functionality during the additive QR update.
- [x] Add the user-provided QR image exactly as supplied, without crop, resize distortion, recolor, blur, or redesign.
- [x] Add a clean professional QR access section with the instruction “Scan the QR code to access Thabo.”
- [x] Apply restrained spacing, alignment, typography, hierarchy, and responsive polish without changing existing copy or behavior; updated header/card spacing and large-screen column breathing room only.
- [x] Verify QR readability/presentation and existing voice-agent behavior on desktop and mobile; visual checks, type checks, and 26 tests pass; live microphone permission remains user-controlled.

- [x] Clean the provided QR asset to keep only the QR code area and remove surrounding text, buttons, and unnecessary side content.
- [x] Preserve the QR pattern and immediate quiet zone unchanged so it remains scannable.
- [x] Replace the website QR asset and verify the cleaned presentation on desktop and mobile.

- [x] Preserve the existing Thabo page structure, QR access, ElevenLabs connection, and current functionality.
- [x] Apply a premium modern visual theme through non-destructive styling changes.
- [x] Replace the boxed transcript presentation with an open line-by-line transcript beside the Thabo portrait; transcript is now outside the connection card.
- [x] Render both user speech and Thabo speech live as separate line-by-line entries.
- [x] Verify transcript layout, responsive behavior, and tests; live microphone click-through remains user-controlled and the running preview is healthy.

- [x] Replace the website's configured ElevenLabs Agent ID with the newly supplied agent from the provided link.
- [x] Verify the new agent's identity and browser-only configuration; server-side agent access validation is intentionally not required for this demo.
- [x] Recheck transcript, single-source voice guard, browser fallback, and preserved QR/premium UI behavior.
- [x] Run regression tests and preview verification after the agent replacement.

- [x] Re-verify the newly supplied ElevenLabs Agent ID from the latest screenshot/link.
- [x] Confirm that server-side API validation is intentionally not required for the browser-only demo; workspace API access remains unverified.
- [x] Replace the website configuration with the browser-only Agent ID while preserving the previous agent account-side and avoiding destructive deletion.
- [x] Re-run ElevenLabs configuration, transcript, voice-guard, and UI regression checks.

- [x] Replace the active website Agent ID with `agent_5001m0m1f8hqe4ys3jkv7zf3rgkv` using the browser-only demo path.
- [x] Make ELEVENLABS_API_KEY non-required for starting the browser voice session.
- [x] Keep premium styling, QR access, transcript display, single-source voice guard, and browser fallback intact.
- [x] Verify browser startup presentation on desktop/mobile and run all regression tests; live microphone permission remains user-controlled.

- [x] Reintroduce browser speech fallback for ElevenLabs startup/runtime failure in the browser-only demo.
- [x] Wire the shared single-source voice transport guard into the current Home.tsx flow and add focused regression coverage.

- [x] Move the live User and Thabo transcript lines to the left side of the portrait within the hero layout.
- [x] Remove the lower transcript rendering area while keeping the live transcript state and ElevenLabs callbacks intact.
- [x] Add a clear dark/light theme toggle without changing existing copy or voice-agent behavior.
- [x] Verify theme switching, transcript placement, QR access, ElevenLabs controls, and responsive desktop/mobile layouts.

- [x] Follow-up: Make QR access panel and footer fully theme-aware for polished light-mode contrast.
- [x] Follow-up: Re-verify the enabled switchable ThemeProvider and light-mode rendering after the theme-aware styling pass.

- [x] Follow-up: Verify switchable light mode on mobile after final QR/footer theme-aware styling.

- [x] Add a clearly visible public text chat with Thabo while preserving the existing voice/session behavior.
- [x] Replace visible ElevenLabs branding and technical wording with "BITC Chat with Thabo" without removing the underlying agent integration.
- [x] Add the three supplied client logos neatly at the bottom of the existing page.
- [x] Add an "INVEST IN BOTSWANA" banner using Botswana flag colors in the letter treatment.
- [x] Defer Twilio phone number display until the client supplies the exact number(s); no number was invented.
- [x] Confirm active demo scope: preserve voice-agent, QR, chat, branding, and responsive behavior; Google Calendar and Google Sheets remain deferred in this single-page demo.

- [x] Deferred by client: Twilio phone number display remains pending until exact number(s) are supplied.
- [x] Finalize and publish all other requested chat, branding, logo, and Botswana banner updates.

- [x] Clarify that Google Calendar and Google Sheets are not active in the current single-page demo; preserve any dormant helpers without claiming live integration verification.
- [x] Save a new checkpoint after the BITC chat, branding cleanup, Botswana banner, and supplied logo updates.

- [x] Bug: BITC Chat with Thabo accepts a message but does not display a reply; diagnose frontend/server flow and fix without changing other features.

- [x] Polish the BITC Chat with Thabo board with premium message bubbles, clearer role labels, spacing, loading state, and input/send presentation.
- [x] Verify the polished chat board remains responsive and functional in dark and light themes.

- [x] Explicitly verify the polished chat board in light theme on desktop and mobile after the styling changes.
- [x] Save the post-polish checkpoint after light-theme verification is complete.

- [x] Save a post-polish checkpoint after the explicit light-theme desktop/mobile verification.

- [x] Upgrade the chat board to an enterprise-style conversation interface while preserving the existing chat mutation and message history behavior.
- [x] Add microphone dictation inside the chat composer using browser speech recognition; stopping the mic must place editable text in the input without auto-sending.
- [x] Add clear recording, unsupported-browser, permission-error, and accessibility states for chat dictation.
- [x] Verify the professional chat and dictation UI across desktop/mobile and dark/light themes.

- [x] Replace the always-visible chat section with a floating Thabo launcher in the page corner.
- [x] Add a recurring but restrained "Chat with Thabo" prompt beside the launcher.
- [x] Open a centered, accessible, unique chat modal when the launcher or prompt is clicked.
- [x] Show "Welcome to BITC" in the modal empty state while preserving text chat and microphone dictation.
- [x] Keep the existing voice agent, transcript, QR, logos, banner, themes, and other page functionality intact.
- [x] Verify launcher animation, modal interactions, responsive layout, and dark/light themes.

- [x] Reduce chat response latency and improve perceived speed with immediate optimistic UI, clear streaming-style loading feedback, and a lighter request path where safe.
- [x] Replace the current chat modal design with a distinct premium chat workspace while preserving text chat, mic dictation, and voice behavior.
- [x] Add protected user-owned conversation and message history storage using the existing authentication identity.
- [x] Add a top-left three-dot menu in the chat window for viewing the signed-in user’s own chat history only.
- [x] Add safe signed-out behavior so one user can never read another user’s saved chat history.
- [x] Test response flow, auth isolation, history menu, mic dictation, accessibility, and responsive dark/light layouts.

- [x] Replace the current screenshot-style investment banner area with a clean INVEST IN BOTSWANA banner.
- [x] Apply Botswana flag blue, white, and black bands inside the banner letterforms.
- [x] Verify the replacement banner remains readable and responsive in dark/light themes.

- [x] Move INVEST IN BOTSWANA banner from the lower page to the prominent area directly below the header.
- [x] Restyle the top banner with a dark premium treatment inspired by the supplied reference, while keeping Botswana flag colors inside the letterforms.
- [x] Replace the banner’s old lower-page position with a distinct, clean business-related design.
- [x] Verify top banner hierarchy, dark/light theme behavior, and desktop/mobile responsiveness.

- [x] Remove the existing top header contents, including its microphone, labels, theme control, and status badge.
- [x] Replace the top area with a full-width, screenshot-proportioned dark INVEST IN BOTSWANA banner using Botswana flag colors inside the letters.
- [x] Move the dark/light theme control to a lower floating corner location without overlapping the chat launcher.
- [x] Verify the new full-width banner and relocated theme control on desktop and mobile while preserving existing functionality.

- [x] Replace the top banner microphone icon with the exact client-supplied BITC official logo asset.
- [x] Add a premium Botswana-vision-inspired abstract background treatment behind the existing banner text.
- [x] Preserve INVEST IN BOTSWANA text and verify logo/banner readability across desktop, mobile, and themes.

- [x] Ground Thabo’s text chat responses in the official BITC public knowledge base saved from https://www.bitc.co.bw/.
- [x] Align chat guidance with the existing ElevenLabs agent without exposing technical branding or claiming unsupported agent changes.
- [x] Route research requests safely through an available research provider, with source URLs and no fabricated facts.
- [x] Add a clear meeting-booking response path and preserve honest messaging until Google Calendar credentials/action wiring is confirmed.
- [x] Restyle the conversation flow to feel natural and WhatsApp-like while preserving voice dictation and per-user history.
- [x] Test grounding, research and booking states, chat rendering, auth isolation, voice behavior, and responsive themes.

- [x] Remove the official BITC logo from the top INVEST IN BOTSWANA banner without changing the banner headline.
- [x] Add a realistic Botswana vision/business landscape background image behind the top banner, with readable text-safe composition.
- [x] Remove the bottom-left theme toggle and add a top-right three-dot menu with separate Light Mode and Dark Mode buttons.
- [x] Verify theme selection, banner text contrast, accessibility, and desktop/mobile responsiveness.

- [x] Make Thabo answer the user’s exact message directly and contextually, with no unrelated default greeting.
- [x] Restrict greetings to actual greeting messages and preserve official BITC grounding and research/meeting guardrails.
- [x] Polish the message input/composer with a clear WhatsApp-style layout, professional placeholder, mic, and send controls.
- [x] Test short messages, greetings, BITC questions, loading, dictation, and responsive composer states.

- [x] Fix the chat composer so typed text is visibly readable while the user is entering a message.
- [x] Research current international chat UI patterns for readable composer contrast, message hierarchy, spacing, and mobile behavior.
- [x] Apply evidence-informed refinements without changing BITC chat, voice dictation, history, or source-grounding behavior.
- [x] Test typed text visibility, send flow, dictation, accessibility, and responsive dark/light layouts.

- [x] Diagnose why clear user questions can receive repetition, generic clarification, or unrelated replies in BITC Chat with Thabo.
- [x] Strengthen direct-answer behavior for Urdu, Roman Urdu, and English questions using official BITC knowledge and explicit intent handling.
- [x] Keep research, meeting guidance, voice, chat history, and existing UI behavior intact while improving reply quality.
- [x] Add regression tests for representative BITC questions, Roman Urdu requests, greetings, unclear prompts, research intent, and meeting intent.
- [x] Run type checks, Vitest tests, and representative chat-response verification before publishing.

- [x] Find a high-resolution, text-safe Botswana trade-and-investment image suitable for the existing hero banner.
- [x] Add the requested “Botswana trade and investment” banner treatment while preserving the existing Thabo visual structure.
- [x] Add an accessible HOME button linking to the official BITC main page at https://www.bitc.co.bw/.
- [x] Verify banner fit, title readability, HOME navigation, mobile/desktop responsiveness, and existing voice/chat behavior.

- [x] Add a professional animated investor-services text strip in the marked gap between the banner and Thabo card.
- [x] Include all requested investor recruitment, call-center, multilingual communication, outreach, registration, orientation, and selling-point text items.
- [x] Make the text move continuously and smoothly from left to right in one readable line, with a clear reduced-motion fallback.
- [x] Verify the marked placement, text visibility, animation direction, accessibility, desktop/mobile layout, and existing functionality before publishing.

- [x] Increase the scrolling investor-services strip background contrast so its text stands out from the page.
- [x] Preserve marquee content, left-to-right animation, speed, accessibility, and responsive dark/light behavior.
- [x] Verify the updated contrast on desktop and mobile before publishing.

- [x] Reverse the investor-services marquee from left-to-right to right-to-left motion.
- [x] Verify the reversed loop, readability, contrast, responsive layout, and existing functionality before publishing.

- [x] Configure LiveAvatar with supplied avatar ID `509609b9-cda3-4f74-b1b2-97b4d98834fd`.
- [x] Securely add the LiveAvatar API key before implementing the live avatar session.
- [x] Keep the existing ElevenLabs voice agent and browser fallback intact during the avatar integration.

- [x] Replace the old pre-session male portrait with the supplied Anthony in White Suit LiveAvatar visual.
- [x] Verify the supplied LiveAvatar avatar ID; the provided screenshot confirms it is Anthony in White Suit, not a female avatar.
- [x] Preserve live avatar video, voice session, and browser fallback behavior while keeping the Anthony identity consistent.
- [x] Verify the replacement on desktop and mobile and run the full test suite before publishing.

- [x] Crop the supplied Anthony in White Suit screenshot to the avatar image area only, excluding browser chrome and page text.
- [x] Host the prepared avatar asset through webdev storage and replace the old static Thabo portrait.
- [x] Preserve the LiveAvatar video switch, ElevenLabs fallback, accessibility label, and responsive portrait frame.
- [x] Verify the replacement on desktop/mobile and run tests before publishing.

- [x] Refine the avatar frame shape, border, glow, and background color for a more professional premium appearance.
- [x] Preserve the Anthony fallback image, live LiveAvatar video, lip-sync, voice flow, and existing page structure.
- [x] Verify the frame in light/dark themes and desktop/mobile layouts, then run the full test suite.

- [x] Diagnose why Start voice chat takes too long to connect to ElevenLabs/LiveAvatar.
- [x] Reduce safe startup latency while preserving LiveAvatar lip-sync, ElevenLabs fallback, microphone permissions, and existing UI.
- [x] Verify voice-start behavior, session errors, fallback timing, responsive states, and full tests before publishing.

- [x] Re-investigate the still-slow voice startup using browser/server timing and runtime logs.
- [x] Replace the insufficient hover-only prewarm with a reliable startup strategy that gives immediate user feedback and avoids duplicate session work.
- [x] Verify LiveAvatar and ElevenLabs timing, fallback behavior, microphone permission flow, and full test coverage before publishing.

- [x] Use the client-provided 9310.jpg portrait as the new Thabo static fallback face.
- [x] Preserve image proportions and improve presentation without inventing a different face.
- [x] Confirm the configured LiveAvatar identity matches this face; the configured LiveAvatar identity remains separate and lip-sync alignment is not claimed beyond the supplied visual.
- [x] Verify the new face in the existing frame, live-session transition, responsive layouts, and tests before publishing.

- [x] Crop only the new African business-man portrait from 9257.jpg, excluding browser chrome, frame labels, READY badge, and surrounding page text.
- [x] Host the prepared portrait asset and replace the current static Thabo fallback image.
- [x] Preserve the existing premium frame, LiveAvatar lip-sync branch, voice fallback, and responsive behavior.
- [x] Verify the new image on desktop/mobile, run tests, and publish the update.

- [x] Restore clarity and upscale the provided portrait without changing the face.
- [x] Replace the static fallback with the clean enhanced portrait while preserving the LiveAvatar branch.
- [x] Verify face clarity on desktop and mobile and run the full test suite before publishing.

- [x] Remove the current 9257 client portrait fallback from the website.
- [x] Restore the static LiveAvatar-matching preset portrait for idle, connecting, and post-call states.
- [x] Preserve the live video/lip-sync session, voice fallback, frame design, responsive layout, and accessibility labels.
- [x] Verify the character is consistent before and after calls, run tests, and publish the update.

- [x] Remove LiveAvatar lip-sync/video switching from the public voice experience.
- [x] Restore the original static portrait used before the LiveAvatar integration in all avatar states.
- [x] Preserve chat, basic ElevenLabs voice behavior, fallback handling, frame design, and responsive layout.
- [x] Do not add a phone number until the client supplies the exact number; verify the rollback and run tests before publishing.

- [x] Display +1 (571) 464-5456 exactly once, extracted from the repeated screenshot entries.
- [x] Display +1 (267) 828-9063 exactly once, using the number supplied in the user message.
- [x] Add a professional contact/call section without claiming that either number is active or working.
- [x] Preserve existing voice, chat, avatar, and responsive behavior; verify and test before publishing.

- [x] Replace the current White Suit static portrait with the requested 9257 dark-suit portrait.
- [x] Keep lip-sync/video removed while preserving static avatar, voice, chat, phone section, and responsive layout.
- [x] Verify the 9257 portrait on desktop/mobile, run tests, and publish the update.
- [x] Add the client-provided developer credit: DEVELOPED BY: SENSTAR SOFTWARE SYSTEMS BOTSWANA - +267 75 602 481.
- [x] Keep the credit professional, responsive, and separate from existing Thabo functionality.
- [x] Verify the credit in the footer, run tests, and publish the update.
- [x] Restore the previously configured LiveAvatar lip-sync avatar for active voice calls.
- [x] Remove the avatar green-screen look and match its background/presentation to the website light and dark themes.
- [x] Use the same avatar visual before and during the call, while preserving existing voice/chat behavior.
- [x] Apply an African business professional clothing/style treatment if it can be done without changing the person's identity.
- [x] Verify LiveAvatar continuity, theme behavior, responsiveness, tests, and publish the update.
- [x] Add the supplied Senstar developer credit text to the existing right-to-left investor-services marquee.
- [x] Preserve the existing footer credit, marquee direction, readability, and all Thabo functionality.
- [x] Verify the updated marquee, run tests, and publish the change.
- [x] Replace the mismatched pre-call portrait with the same visual asset/identity used by the active LiveAvatar stream.
- [x] Preserve LiveAvatar lip-sync, voice, chat, marquee, footer, and existing page functionality.
- [x] Verify pre-call and active-call avatar continuity, run tests, and publish the correction.
- [x] Re-scan the current LiveAvatar rendering flow against the supplied 9312 visual.
- [x] Remove the 9312 green background and prepare a polished African business avatar treatment while preserving identity.
- [x] Use the cleaned matching avatar before the call and preserve the active LiveAvatar lip-sync flow.
- [x] Verify visual continuity, theme behavior, responsiveness, tests, and publish the correction.
- [x] Restore real-time LiveAvatar lip-sync synchronized with the existing ElevenLabs voice.
- [x] Keep the corrected transparent 9312 avatar image unchanged.
- [x] Verify audio/video synchronization, fallback behavior, tests, and publish the lip-sync fix.
- [x] Add the revised Senstar developer credit with “BOTSWANA CITIZEN OWNED” to the existing right-to-left marquee.
- [x] Keep the previous marquee items, direction, footer credit, and Thabo functionality intact.
- [x] Verify the marquee text, run tests, and publish the update.
- [x] Diagnose why LiveAvatar lip-sync is not visible even though ElevenLabs audio plays.
- [x] Restore true audio-driven facial/mouth movement without changing the current avatar image.
- [x] Verify any required provider access or API configuration, run tests, and publish the fix or clearly report the blocker.
- [x] Investigate the newly reported website error from browser, server, and network evidence.
- [x] Apply a targeted fix without changing the current avatar image or unrelated functionality.
- [x] Run regression checks, verify the preview, and publish the fix or report the remaining blocker.
- [x] Attach the real LiveAvatar lip-sync stream to the ElevenLabs voice pipeline.
- [x] Keep the current transparent avatar image unchanged and preserve existing voice/chat behavior.
- [x] Verify provider access, run tests, and publish the lip-sync attachment update or report the remaining provider blocker.
- [x] Handle the LiveAvatar “No credits available for start session” error with a clear user-facing message.
- [x] Preserve the current avatar, lip-sync integration, voice/chat behavior, and avoid masking the provider credit blocker.
- [x] Run regression checks, verify the preview, and publish the error-handling update.
- [x] Prevent the repeated LiveAvatar no-credit session error from surfacing as an unhandled browser error.
- [x] Preserve the current avatar, lip-sync integration, voice/chat behavior, and clearly report the provider credit requirement.
- [x] Run regression checks, verify the preview, and publish the error-handling update.
- [x] Replace the configured LiveAvatar avatar ID with 91342979-4c4c-44f1-bd3b-1c846d20341e.
- [x] Preserve the current 9312 static image, lip-sync wiring, voice/chat interface, and credit error handling.
- [x] Verify the new avatar configuration, run tests, and publish the update.
- [x] Securely update the new LiveAvatar API credential when supplied by the user.
- [x] Validate the new LiveAvatar API with the confirmed avatar ID and preserve existing lip-sync/voice/chat behavior.
- [x] Run tests and publish the validated credential configuration or report the remaining credits blocker.
- [x] Open secure fields for the new LiveAvatar API key and ElevenLabs Agent ID.
- [x] Validate and connect the new account credentials while preserving the current avatar, lip-sync, voice, and chat behavior.
- [x] Run tests and publish the validated new-account configuration or report any provider blocker.
- [x] [Deferred by user] Define the custom notification trigger, audience, message, presentation, and delivery channel.
- [x] [Deferred by user] Inspect and reuse existing auth, database, and notification scaffolding.
- [x] [Deferred by user] Implement and test the custom notification flow without disrupting Thabo voice/chat behavior.
- [x] [Deferred by user] Verify notification permissions, persistence, responsiveness, and publish the feature.
- [x] Defer the custom notification feature and return focus to LiveAvatar setup.
- [x] Validate the newly saved LiveAvatar API key, avatar ID, and ElevenLabs Agent mapping.
- [x] Verify/fix the LiveAvatar lip-sync session, run tests, and publish or report any provider blocker.
- [x] Investigate the current LiveAvatar “API request failed” session-start error.
- [x] Preserve the current avatar, ElevenLabs mapping, lip-sync, voice, chat, and page layout while applying the targeted fix.
- [x] Run regression checks, verify the voice/avatar flow, and publish the fix or report the provider blocker.
- [x] Open fresh secure fields for LIVEAVATAR_AVATAR_ID and LIVEAVATAR_API_KEY after the user removed the old entries.
- [x] Validate the new LiveAvatar avatar ID and API key from zero and reconnect the existing lip-sync session.
- [x] Preserve the current 9312 avatar/UI and run tests before publishing the clean configuration.
- [x] Investigate the recurring 10:59 LiveAvatar “API request failed” session-start error.
- [x] Apply the smallest reliable correction without changing the current avatar or unrelated features.
- [x] Run regression checks, verify the LiveAvatar flow, and publish the fix or report the provider blocker.
- [x] Perform a full scan of LiveAvatar session start/stop, proxy, credentials, ElevenLabs mapping, lip-sync events, and runtime logs.
- [x] Apply only necessary targeted fixes found during the scan.
- [x] Run full tests, verify desktop/mobile previews, and publish the scan result.
- [x] Keep the LiveAvatar-matched agent visible during idle, connecting, active, and stopped states without a blank image or person switch.
- [x] Preserve the real LiveAvatar video by using a persistent paused/matching visual before and after calls.
- [x] Verify Start voice chat transitions, call stop behavior, responsiveness, tests, and publish the correction.

- [x] Replace the current pre-call poster with the user-supplied Anthony avatar screenshot image.
- [x] Preserve the same Anthony visual during idle, connecting, active, and stopped voice-session states without changing the configured LiveAvatar ID.
- [x] Host the supplied image through webdev storage and use the hosted asset in the website.
- [x] Verify the replacement on desktop/mobile, run the full test suite and type checks, then publish the update.
- [x] User requested personal computer shutdown after publishing; external computer shutdown is not available from this workspace and must be reported honestly.

- [x] Remove speaking bounce, vibration, transform, and visual movement from the Thabo avatar while preserving the live lip-sync video feed.
- [x] Keep the avatar/live video fixed in its frame during speaking, listening, connecting, and stopped states.
- [x] Correct the investor-services marquee area based on the client screenshot: keep the scrolling line readable and ensure the full client-required developer credit is included in the same strip.
- [x] Verify stationary avatar rendering, marquee content/direction, responsive layout, and full tests before publishing.

- [x] Diagnose Start voice chat returning from Connecting without establishing a usable LiveAvatar/voice session.
- [x] Fix incomplete Thabo responses so agent speech is not cut off mid-sentence when the provider returns a response.
- [x] Fix turn-taking so Thabo does not keep speaking over the user and correctly listens for the next user turn.
- [x] Preserve avatar continuity, lip-sync wiring, chat, marquee, and existing page design while correcting voice behavior.
- [x] Add regression coverage, run full tests/type checks, verify the voice flow in preview, and publish the correction.

- [x] Restore the real LiveAvatar video layer as the visible speaking surface so facial/lip movement is synchronized with provider audio.
- [x] Keep the avatar shell, crop, and frame position stable while allowing only the LiveAvatar face/video to move naturally.
- [x] Verify stream-ready, video-ready, and speaking event behavior so the static poster is replaced only when real LiveAvatar video is available.
- [x] Add regression coverage, run full tests/type checks, verify lip-sync presentation, and publish the correction.

- [x] Confirm the reported missing LiveAvatar lip-sync as a regression across the current session flow.
- [x] Trace LiveAvatar token/session creation, proxy lifecycle requests, stream attachment, video playback, audio tracks, speaking events, and browser console/network failures.
- [x] Determine whether the root cause is application wiring or an external LiveAvatar account/credits/avatar configuration blocker.
- [x] Restore lip-sync in application code if possible; otherwise add truthful diagnostics and clear provider guidance without faking motion.
- [x] Add regression coverage, run full tests/type checks, verify the result in preview, and publish only a verified correction.
- [x] Map LiveAvatar provider error 4033 / “Insufficient credits for session” to clear lip-sync credit guidance instead of exposing the raw provider phrase.

- [x] Diagnose the client-reported avatar on/off behavior during and after voice-session startup.
- [x] Keep the Anthony poster visible continuously while LiveAvatar is connecting, fails, disconnects, or waits for credits.
- [x] Prevent session cleanup or video visibility state from making the avatar appear to disappear or toggle unexpectedly.
- [x] Preserve real LiveAvatar video/lip-sync visibility when a provider session actually becomes available.
- [x] Add regression coverage, run tests/type checks, verify the client scenario in preview, and publish the stability correction if application code can fix it.

- [x] Define JARVIS as a separate reusable enterprise intelligence product, not a full-computer-control bot.
- [x] Keep the client company as owner of its operational data and existing systems of record.
- [x] Support voice-issued tasks, autonomous low-risk actions, approval-gated sensitive actions, and emergency team alerts.
- [x] Map finance, budgeting, state-owned enterprises, procurement, projects, investor services, executive reporting, minutes/resolutions, legislative gaps, fixed assets, manifesto tracking, and public-service workforce requirements.
- [x] Design safe connections to client systems through approved interfaces and controlled tools rather than screen clicking or human-like computer control.
- [x] Define a continuously available deployment and monitoring model; treat waking a powered-off computer as a separate optional capability, not a core requirement.

- [x] Define futuristic sci-fi JARVIS interface reference criteria: executive dashboard, voice command area, clear data hierarchy, restrained motion, and professional usability.
- [x] Research reputable interface galleries and live futuristic dashboard references suitable to share with the client.
- [x] Identify where reference images can be viewed or licensed and warn against copying another site’s design.
- [x] Prepare a short client-ready message with selected links and a recommended visual direction.

- [x] Until the client finishes sharing requirements and the user explicitly requests it, do not prepare or deliver any new formal JARVIS document; answer questions and maintain only an internal running record.

- [x] Break the KGOSI/JARVIS platform into demonstration and production parts, map tools/services to each part, and list the client APIs, permissions, and access needed.

- [x] Rewrite the KGOSI/JARVIS deliverable as a standalone document-only client requirements checklist; exclude the Thabo website/demo and focus on company data, system access, APIs, connection methods, approvals, and security requirements.

- [x] Use the client’s expanded decision-support requirement as the KGOSI/JARVIS demo foundation: business-wide understanding, live reporting dashboard, figure explanations, analysis, forecasting, advice, board decision support, solution suggestions, and approved task execution.

- [x] From this point forward, do not modify or extend the Thabo website; treat KGOSI/JARVIS as the only active project scope and preserve Thabo only as historical context.

- [x] Prepare a standalone English JARVIS requirements and system-integration document covering client business requirements, existing systems, APIs, connection methods, access permissions, security, human approval, and live deployment needs.

- [x] Include the client-requested JARVIS demo flow: voice/text command, account preparation preview, finance/risk/operations report generation, on-screen live dashboard, PDF/PowerPoint/Excel exports, email draft or approval workflow, and clear demo-only boundaries for production actions.

- [x] Add https://www.bitc.co.bw/ as the first approved public knowledge source for KGOSI/JARVIS and review its public information areas for future ingestion.

- [x] Scope the BITC source for KGOSI/JARVIS ingestion: Home, Invest, Export, BOSSC, Brand Botswana, Contacts, exporter development, trade portal, trade agreements, investment climate, investment sectors, e-Services, board/executive structure, business enquiry, registration, procurement, careers, code of ethics, privacy, and resource-centre content.

- [x] Use the supplied futuristic globe command-center image as a visual reference for the future KGOSI/JARVIS interface; preserve the style direction while adding Botswana focus, organisation data panels, reports, risks, forecasting, board advice, approvals, and command execution.

- [x] Record the client’s expanded KGOSI demo scope: executive organisational briefing, BITC source-grounded information copilot, cross-system business investigation, synthetic linked enterprise data, 20 voice/text commands, PDF/PowerPoint/Excel and dashboard outputs, recommendations, prepared actions, and controlled low-risk execution with approval gates.

- [x] Use a custom KGOSI/JARVIS backend as the primary architecture; keep n8n optional and do not make the demo dependent on it.

- [x] Create an English client-facing presentation for the KGOSI/JARVIS Demo 1 covering the purpose, three demo functions, BITC and synthetic enterprise data, voice interaction, reasoning and evidence, reports, approvals, custom backend architecture, and what is deliberately excluded from the first demo.

- [x] Add optional GIS location pins for tender and project sites, a secure login portal, and business-intelligence reports inspired by the supplied examples: customer records and documents, workflow status, financial reports, branch or unit performance, transaction analysis, sales and order dashboards, document indexing, balance sheet, and income statement.

- [x] Add a secure user login portal with role-based report-menu access so each user can open only the business-intelligence reports permitted for their role.

- [x] Add the requested post-login left navigation areas to the KGOSI/JARVIS scope: Briefing Reports, Minutes and Meetings, E-Procurement, Finance, Accounting, Projects, Budgets, Inventory, Assets, Payments, Human Capital, Operations, Property, Vehicles, Plant and Machinery, Loans and Equity, Cash Flows, Marketing, Sales, Contracts, Compliance, and Documents.

- [x] Do not create or recreate a tab bar for the KGOSI/JARVIS interface; keep the current work focused on understanding client conversations and recording requirements.

- [x] Add report filters for Group, Department, Year, and Unit; define the first briefing area modules left-to-right: Voice Agent with Avatar, Business Intelligence, Minutes and Meetings, My Calendar, My To-Do List, My Alerts, Approvals, Head of Department Reports, Media Feed, Pipeline, Mails and Notices, Registry, Requests, Actions, Decisions, and Projects with GIS.

- [x] Keep all future requirements, design, demo, and development work exclusively on the new KGOSI/JARVIS project; do not open, modify, or extend the Thabo website or its files.

- [x] Exclude all avatars, human faces, speaking portraits, and avatar-based controls from the KGOSI/JARVIS interface; use the supplied sci-fi globe command-center image only for visual inspiration.

- [x] Record expanded report examples for the KGOSI/JARVIS scope: income statement, financial position, procurement and tender dashboard, sales and profit analysis, stakeholder dashboard, project and case GIS view, document indexing and search, live performance indicators, and role-based report access.

- [x] Define the first focused KGOSI/JARVIS demo as five core capabilities: command understanding, organisation briefing, finance/profit-loss analysis, risk and operations analysis, and report/dashboard generation with recommendations and approval-ready actions; use BITC public data plus clearly labelled synthetic enterprise data and defer live client-system integration.

- [x] Improve readability of the five-slide KGOSI/JARVIS presentation by applying bolder typography and higher contrast to all titles, subtitles, and key points.

- [x] Create a standalone WordPress integration plugin for KGOSI/JARVIS that embeds the dashboard through a configurable backend URL and package it as a downloadable ZIP; do not move the core intelligence backend into WordPress.

- [x] Record the expanded THABO production scope: preserve the current website voice/chat experience, connect the ElevenLabs agent with n8n workflows, support Google Calendar booking/rescheduling/cancellation and availability checks, perform live web research, save research records to Google Sheets, retrieve contact data from Sheets, create or send emails, and add the requested African language support before handover.
- [x] Separate THABO prototype demonstrations from production-ready commitments, including provider accounts, permissions, reliability, security, human approval for sensitive email/calendar actions, testing, deployment, and maintenance.
- [x] Prepare a separate client-facing THABO production scope and pricing basis after confirming which functions must be live at handover and which external service costs are paid by the client.

- [x] Distinguish the free-tier THABO prototype from the paid production handover: paid provider plans, live reliability, multilingual support, Google Calendar and Gmail permissions, n8n workflows, deployment, testing, security, training, maintenance, and external service charges.
- [x] Prepare a separate final THABO production proposal in USD with scope, exclusions, client-paid subscriptions, payment milestones, handover criteria, and post-handover support.

- [x] Create a polished THABO production proposal priced at USD 3,000, showing current free-tier demo capabilities, paid-tool production capabilities, included work, client-paid external services, payment terms, support, and handover conditions.

- [x] Remove the dummy contact number and any related company contact line from the THABO production proposal; keep the proposal content and price unchanged.

- [x] Add a continuous investment-opportunity visual stream to the THABO portal showing mining, agriculture, tourism and related sectors.
- [x] Add THABO voice-over narration for the rotating investment slides and stop the narration/stream when a visitor starts chat, then resume or reset safely after chat ends according to the agreed UX.
- [x] Add language-ready content and provider capability checks for Setswana, Shona, Ndebele, Zulu and Afrikaans; do not claim native voice support until the selected provider is verified.
- [x] Verify the new stream-to-chat handoff, accessibility, responsive layout, audio permissions, and regression coverage before delivery.

- [ ] Assess a lower-cost THABO architecture using ElevenLabs for speech understanding/output and n8n webhook workflows for research, Google Sheets, Gmail and Google Calendar actions instead of a fully trained ElevenLabs agent.
- [ ] Verify the webhook contract, command format, authentication, action approvals, error handling and response path between the THABO website and n8n before implementation.

- [ ] Prioritize THABO completion before any JARVIS-KGOSI implementation and record the approved architecture: source websites feed a searchable knowledge layer, ElevenLabs handles speech understanding/output, and n8n executes actions through a secure webhook.
- [ ] Define how approved website links are collected, cleaned, refreshed and indexed for THABO answers; do not treat a website link alone as a completed database.
- [ ] Define the THABO command contract for research, Google Sheets lookup/write, Gmail draft/send and Google Calendar actions, including authentication, approval, response format and failure handling.

- [ ] Keep the THABO knowledge path separate from the n8n action path: website-provided sources are ingested into the THABO knowledge base for informational answers, while only action requests are routed to the supplied n8n webhook.
- [ ] Add explicit routing rules so informational questions use the THABO knowledge base, while research-on-demand, Sheets, Gmail and Calendar requests use the n8n action workflow and return a spoken result.
- [ ] Confirm that the THABO knowledge base is stored and queried by the project backend/code layer, with source links and refresh handling, and is not dependent on the n8n workflow.

- [x] Use https://www.bitc.co.bw/ as the first approved THABO knowledge-base source and record the source URL for future ingestion and refresh checks.
- [x] Record the new client requirement for Setswana, Shona, Ndebele, Zulu and Afrikaans support, plus a continuous mining, agriculture and tourism investment slide stream with THABO voice-over that stops when Start Chat is selected.

- [ ] Connect and synchronize the THABO source with the user's private GitHub repository: https://github.com/muhammadbilalautomation/-bitc; preserve secrets outside the repository and keep version history available for maintenance.
