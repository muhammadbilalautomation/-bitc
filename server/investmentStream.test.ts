import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");

 describe("THABO investment opportunity channel", () => {
  it("includes the requested sector slides and persistent storage-backed image paths", () => {
    expect(homeSource).toContain('sector: "Mining"');
    expect(homeSource).toContain('sector: "Agriculture"');
    expect(homeSource).toContain('sector: "Tourism"');
    expect(homeSource).toContain("/manus-storage/mining_a33b0c16.jpg");
    expect(homeSource).toContain("/manus-storage/agriculture_9a56baa3.jpg");
    expect(homeSource).toContain("/manus-storage/tourism_1d992526.jpg");
  });

  it("stops the stream voice-over when chat opens and resumes only when no voice session is active", () => {
    expect(homeSource).toContain("stopInvestmentVoiceover();");
    expect(homeSource).toContain("setStreamActive(false);");
    expect(homeSource).toContain("else if (!connected && !session) setStreamActive(true)");
    expect(homeSource).toContain('window.speechSynthesis.cancel()');
  });

  it("keeps the requested African language programme visible without claiming provider support", () => {
    for (const language of ["Setswana", "Shona", "Ndebele", "Zulu", "Afrikaans"]) {
      expect(homeSource).toContain(`>${language}</span>`);
    }
    expect(homeSource).toContain("provider");
  });
});
