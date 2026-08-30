import { describe, expect, it } from "vitest";
import { mergeDictationText } from "../shared/voiceDictation";

describe("mergeDictationText", () => {
  it("keeps existing typed text and appends dictated text with one separator", () => {
    expect(mergeDictationText("Hello", " how can I connect with BITC? ")).toBe("Hello how can I connect with BITC?");
  });

  it("returns the non-empty side when one side is blank", () => {
    expect(mergeDictationText("", " Botswana investment opportunities ")).toBe("Botswana investment opportunities");
    expect(mergeDictationText("Tell me more", "")).toBe("Tell me more");
  });
});
