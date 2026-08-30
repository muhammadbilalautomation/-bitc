import type { Express, NextFunction, Request, Response } from "express";

const LIVEAVATAR_API_URL = "https://api.liveavatar.com";
const SESSION_PATH_PREFIX = "/v1/sessions/";

function forwardHeaders(request: Request): Headers {
  const headers = new Headers();
  const authorization = request.header("authorization");
  const sessionToken = request.header("x-session-token");
  if (authorization) headers.set("authorization", authorization);
  else if (sessionToken) headers.set("authorization", `Bearer ${sessionToken}`);

  const contentType = request.header("content-type");
  const accept = request.header("accept");
  if (contentType) headers.set("content-type", contentType);
  if (accept) headers.set("accept", accept);
  return headers;
}

function isAllowedSessionPath(path: string) {
  return path.startsWith(SESSION_PATH_PREFIX);
}

export function registerLiveAvatarProxy(app: Express) {
  app.use("/api/liveavatar", async (request: Request, response: Response, next: NextFunction) => {
    const providerPath = request.path;
    if (!isAllowedSessionPath(providerPath)) {
      response.status(404).json({ message: "LiveAvatar session endpoint not found." });
      return;
    }

    const authorization = request.header("authorization") ?? request.header("x-session-token");
    if (!authorization || (authorization.startsWith("Bearer ") === false && request.header("x-session-token") === undefined)) {
      response.status(401).json({ message: "A LiveAvatar session token is required." });
      return;
    }

    try {
      const query = request.url.includes("?") ? request.url.slice(request.url.indexOf("?")) : "";
      const providerResponse = await fetch(`${LIVEAVATAR_API_URL}${providerPath}${query}`, {
        method: request.method,
        headers: forwardHeaders(request),
        body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body == null ? undefined : JSON.stringify(request.body),
        signal: AbortSignal.timeout(30_000),
      });
      const body = await providerResponse.text();
      if (!providerResponse.ok) {
        console.warn(`[LiveAvatar proxy] ${request.method} ${providerPath} -> ${providerResponse.status}: ${body.slice(0, 500)}`);
      }
      response.status(providerResponse.status);
      const contentType = providerResponse.headers.get("content-type");
      if (contentType) response.setHeader("content-type", contentType);
      response.send(body);
    } catch (error) {
      console.warn(`[LiveAvatar proxy] ${request.method} ${providerPath} failed`, error);
      if (!response.headersSent) response.status(502).json({ message: "LiveAvatar session request failed at the server proxy." });
      else next(error);
    }
  });
}
