

## Research provider

The Thabo demo uses **SerpApi** as its active server-side public-web research provider. The server reads `SERPAPI_API_KEY` from project secrets and never exposes it to the browser. Research requests return structured public result URLs, snippets, and a transparent confidence label. If SerpApi is unavailable or returns no results, the demo returns clearly labeled fallback records and keeps the client walkthrough usable; fallback records must be replaced with verified live research before any outreach.

The demo does not perform live trading, brokerage actions, WhatsApp messaging, phone calls, CRM writes, or real outbound email. Email drafts remain subject to explicit human review and approval. Browser speech is the default voice, while the optional ElevenLabs provider can be enabled later through `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` server secrets.
