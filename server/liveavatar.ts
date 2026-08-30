import { TRPCError } from "@trpc/server";

const LIVEAVATAR_API_URL = "https://api.liveavatar.com";
const CONFIRMED_LIVEAVATAR_AVATAR_ID = "91342979-4c4c-44f1-bd3b-1c846d20341e";
const avatarId = () => {
  const configured = process.env.LIVEAVATAR_AVATAR_ID?.trim() ?? "";
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(configured)
    ? configured
    : CONFIRMED_LIVEAVATAR_AVATAR_ID;
};
const liveAvatarApiKey = () => process.env.LIVEAVATAR_API_KEY ?? "";
const elevenLabsApiKey = () => process.env.ELEVENLABS_API_KEY ?? "";
const elevenLabsAgentId = () => process.env.ELEVENLABS_AGENT_ID ?? "";

let elevenLabsSecretId: string | null = null;

async function readError(response: Response, fallback: string) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await response.json().catch(() => null)) as { message?: string; error?: string; detail?: string | Array<{ msg?: string; message?: string }>; data?: Array<{ msg?: string; message?: string }> | { message?: string; error?: string } } | null;
    const detail = Array.isArray(body?.detail) ? body.detail.map(item => item.msg ?? item.message).filter(Boolean).join(", ") : body?.detail;
    const dataMessage = Array.isArray(body?.data) ? body.data.map(item => item.msg ?? item.message).filter(Boolean).join(", ") : body?.data?.message ?? body?.data?.error;
    return body?.message ?? body?.error ?? detail ?? dataMessage ?? fallback;
  }
  return (await response.text().catch(() => "")) || fallback;
}

async function getElevenLabsSecretId() {
  if (elevenLabsSecretId) return elevenLabsSecretId;
  const apiKey = liveAvatarApiKey();
  const voiceKey = elevenLabsApiKey();
  if (!apiKey || !voiceKey) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "LiveAvatar and ElevenLabs credentials are required." });

  const response = await fetch(`${LIVEAVATAR_API_URL}/v1/secrets`, {
    method: "POST",
    headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      secret_type: "ELEVENLABS_API_KEY",
      secret_value: voiceKey,
      secret_name: "Thabo ElevenLabs Agent",
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new TRPCError({ code: "BAD_GATEWAY", message: await readError(response, "LiveAvatar could not register the ElevenLabs secret.") });
  const body = (await response.json()) as { data?: { secret_id?: string; id?: string; secret?: { id?: string; secret_id?: string } }; secret_id?: string; id?: string };
  const secretId = body.data?.secret_id ?? body.data?.id ?? body.data?.secret?.secret_id ?? body.data?.secret?.id ?? body.secret_id ?? body.id;
  if (!secretId) throw new TRPCError({ code: "BAD_GATEWAY", message: "LiveAvatar did not return a secret ID." });
  elevenLabsSecretId = secretId;
  return secretId;
}

export async function createLiveAvatarSession() {
  const apiKey = liveAvatarApiKey();
  const selectedAvatarId = avatarId();
  const agentId = elevenLabsAgentId();
  if (!apiKey || !selectedAvatarId || !agentId) {
    throw new TRPCError({ code: "PRECONDITION_FAILED", message: "LiveAvatar avatar, LiveAvatar API key, and ElevenLabs Agent ID are required." });
  }
  const secretId = await getElevenLabsSecretId();
  const response = await fetch(`${LIVEAVATAR_API_URL}/v1/sessions/token`, {
    method: "POST",
    headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "LITE",
      avatar_id: selectedAvatarId,
      // This preset avatar is not available in sandbox mode; live sessions require production credits.
      is_sandbox: false,
      elevenlabs_agent_config: { agent_id: agentId, secret_id: secretId },
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new TRPCError({ code: "BAD_GATEWAY", message: await readError(response, "LiveAvatar could not start a session.") });
  const body = (await response.json()) as { data?: { session_token?: string; session_id?: string } };
  const sessionToken = body.data?.session_token;
  if (!sessionToken) throw new TRPCError({ code: "BAD_GATEWAY", message: "LiveAvatar did not return a session token." });
  return { sessionToken, sessionId: body.data?.session_id ?? null, avatarId: selectedAvatarId };
}
