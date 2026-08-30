# LiveAvatar integration references

## Official sources

- LiveAvatar documentation: https://docs.liveavatar.com/
- LiveAvatar session token API: https://docs.liveavatar.com/api-reference/sessions/create-session-token
- LITE mode configuration: https://docs.liveavatar.com/docs/lite-mode/configuration
- Embed guide: https://docs.liveavatar.com/docs/guides/embed-avatar
- Secrets and integrations: https://docs.liveavatar.com/docs/core-concepts/secrets
- ElevenLabs LiveAvatar integration: https://elevenlabs.io/docs/eleven-agents/guides/integrations/live-avatar
- Official Web SDK repository: https://github.com/heygen-com/liveavatar-web-sdk

## Verified implementation facts

- The session token endpoint is POST https://api.liveavatar.com/v1/sessions/token and uses the X-API-KEY header.
- The ElevenLabs integration uses LiveAvatar LITE mode with avatar_id and elevenlabs_agent_config containing agent_id and a LiveAvatar secret_id.
- LiveAvatar stores third-party credentials as encrypted secrets; the website must not expose API keys in frontend code.
- The official Web SDK package is @heygen/liveavatar-web-sdk and exposes LiveAvatarSession.
- The SDK starts with a short-lived session token, supports session.start(), session.stop(), voiceChat.start(), and attach(videoElement).
- The SDK emits SESSION_STREAM_READY, SESSION_STATE_CHANGED, and SESSION_DISCONNECTED events.
- The official ElevenLabs guide states the ElevenLabs agent audio output drives the avatar lip-sync and animations in real time.
- For this project, the supplied LiveAvatar avatar ID is 509609b9-cda3-4f74-b1b2-97b4d98834fd.

## Avatar catalog lookup

- Official List User Avatars API: https://docs.liveavatar.com/api-reference/avatar/list-user-avatars
- The user-avatar endpoint is GET https://api.liveavatar.com/v1/avatars with X-API-KEY authentication and returns paginated `data.results` records containing `id`, `name`, `type`, `status`, and `preview_url`.
- The supplied ID was not found in the first returned user-avatar catalog page, so the static fallback cannot safely be replaced with an unverified image. The live session itself remains configured with the supplied ID.
