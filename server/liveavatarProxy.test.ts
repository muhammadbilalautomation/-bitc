import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("LiveAvatar same-origin proxy", () => {
  it("forwards LiveAvatar session lifecycle paths and requires a session token", () => {
    const source = readFileSync(resolve(process.cwd(), "server/liveavatarProxy.ts"), "utf8");
    expect(source).toContain('app.use("/api/liveavatar"');
    expect(source).toContain('const SESSION_PATH_PREFIX = "/v1/sessions/";');
    expect(source).toContain("path.startsWith(SESSION_PATH_PREFIX)");
    expect(source).toContain('request.header("x-session-token")');
    expect(source).toContain('request.url.includes("?")');
    expect(source).toContain('https://api.liveavatar.com');
  });

  it("uses the same-origin proxy in the browser SDK", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(source).toContain('apiUrl: "/api/liveavatar"');
  });
});
