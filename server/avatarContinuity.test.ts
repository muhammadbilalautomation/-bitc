import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("LiveAvatar visual continuity", () => {
  it("keeps a poster below the live stream and captures the last video frame", () => {
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
    expect(home).toContain("const [liveAvatarPoster, setLiveAvatarPoster] = useState<string | null>(null);");
    expect(home).toContain("const captureLiveAvatarFrame = () =>");
    expect(home).toContain("setLiveAvatarPoster(canvas.toDataURL(\"image/jpeg\", 0.9))");
    expect(home).toContain("captureLiveAvatarFrame();");
    expect(home).toContain("liveAvatarPoster ?? \"/manus-storage/thabo-anthony-liveavatar-reference_e381baca.png\"");
    expect(home).toContain("onLoadedData={captureLiveAvatarFrame}");
    expect(home).toContain("onPlaying={() => setLiveAvatarActive(true)}");
    expect(home).toContain("onError={() => setLiveAvatarActive(false)}");
    expect(home).toContain("onEnded={() => setLiveAvatarActive(false)}");
    expect(home).not.toContain("onCanPlay={() => setLiveAvatarActive(true)}");
    expect(css).toContain(".assistant-face-media { position: relative;");
    expect(css).toContain("opacity: 0;");
    expect(css).toContain(".assistant-face-video-visible { opacity: 1; }");
    expect(css).toContain("z-index: 2;");
    expect(css).toContain("object-position: 50% 24%;");
    expect(css).toContain(".assistant-face-listening, .assistant-face-thinking, .assistant-face-speaking { transform: none; filter: none; }");
    expect(css).toContain(".assistant-face-listening .assistant-face-image, .assistant-face-speaking .assistant-face-image { transform: none; animation: none; }");
    expect(css).not.toContain("face-speaking-vibrate");
    expect(css).not.toContain("face-speaking-bounce");
    expect(css).toContain("transition: none; }");
    expect(css).toContain("transition: opacity 160ms ease; }");
  });
});
