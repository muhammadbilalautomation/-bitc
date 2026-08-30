# LiveAvatar diagnostic sources

## Official documentation

- LiveAvatar overview: https://docs.liveavatar.com/
  - LiveAvatar LITE mode handles real-time video while the application/connector supplies the AI stack.
  - LITE sessions with an ElevenLabs configuration use `mode: "LITE"`, `elevenlabs_agent_config` containing `secret_id` and `agent_id`, and an `avatar_id`.
  - LiveAvatar lists LITE billing at 1 credit per minute.

- Sandbox mode: https://docs.liveavatar.com/docs/sandbox-mode
  - Sandbox mode is intended for testing without consuming credits.
  - Sandbox is constrained to the Wayne avatar, ID `dd73ea75-1218-4ef3-92ce-606d5f7fbc0a`, and short sessions of approximately one minute.
  - Production/custom avatars therefore require production access and credits.

- LITE mode overview: https://docs.liveavatar.com/docs/lite-mode/overview
  - LITE mode focuses on real-time video and supports hosted voice-agent connectors including ElevenLabs.
  - LITE mode costs 1 credit per minute.

- ElevenLabs LiveAvatar integration: https://elevenlabs.io/docs/eleven-agents/guides/integrations/live-avatar
  - ElevenLabs handles audio interaction/orchestration and LiveAvatar handles synchronized avatar video.
  - The ElevenLabs Agent requires PCM 24000 Hz input/output formats.
  - The ElevenLabs API key must be registered with LiveAvatar through `POST https://api.liveavatar.com/v1/secrets`, then the returned `secret_id` is used in the LITE session token request.

## SDK issue reference

- SDK issue #40: https://github.com/heygen-com/liveavatar-web-sdk/issues/40
  - The SDK maintainers describe `Session start failed: API request failed` as the actual provider request failure and recommend checking the Network response for `/v1/sessions/start`.
  - The issue also notes that valid LiveAvatar credentials and valid avatar/context identifiers are required.

## Project runtime evidence

- The Thabo server tRPC call `/api/trpc/liveavatar.createSession` succeeds and returns a session token with the configured avatar ID.
- The subsequent browser request to `https://api.liveavatar.com/v1/sessions/start` fails with `TypeError: Failed to fetch` and no HTTP response in the network log. This points to a browser/network-layer problem such as CORS, origin allowlisting, CSP, firewall, or provider-side session rejection that the SDK cannot expose as an HTTP payload.
