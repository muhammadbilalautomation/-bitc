import { describe, expect, it } from "vitest";
import { parseThaboCommand } from "../shared/commandParser";

describe("parseThaboCommand", () => {
  it("extracts investment country, sector, and count", () => {
    const result = parseThaboCommand("Find 3 renewable energy investors in the UAE");

    expect(result).toMatchObject({
      intent: "investment",
      country: "United Arab Emirates",
      sector: "Energy & infrastructure",
      count: 3,
    });
  });

  it("detects export intent and an agriculture sector", () => {
    const result = parseThaboCommand("Research 5 export buyers for Botswana beef in Kenya");

    expect(result).toMatchObject({
      intent: "export",
      country: "Kenya",
      sector: "Agriculture & food processing",
      count: 5,
    });
  });

  it("uses safe demo defaults when the command is underspecified", () => {
    const result = parseThaboCommand("Help me find relevant prospects");

    expect(result.country).toBe("United Arab Emirates");
    expect(result.sector).toBe("Energy & infrastructure");
    expect(result.count).toBe(3);
    expect(result.intent).toBe("investment");
  });
});
