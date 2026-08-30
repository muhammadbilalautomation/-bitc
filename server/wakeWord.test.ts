import { describe, expect, it } from "vitest";
import { extractWakeCommand } from "../shared/wakeWord";

describe("extractWakeCommand", () => {
  it("does not activate for unrelated speech", () => {
    expect(extractWakeCommand("Please research investors in China")).toEqual({ activated: false, command: "" });
  });

  it("activates on the exact wake word and extracts the following command", () => {
    expect(extractWakeCommand("Thabo research investors in China")).toEqual({ activated: true, command: "research investors in China" });
  });

  it("supports a wake word by itself while waiting for the next utterance", () => {
    expect(extractWakeCommand("Thabo")).toEqual({ activated: true, command: "" });
  });

  it("does not activate when Thabo is embedded in a sentence", () => {
    expect(extractWakeCommand("Please ask Thabo to research investors")).toEqual({ activated: false, command: "" });
    expect(extractWakeCommand("research investors, Thabo")).toEqual({ activated: false, command: "" });
  });
});
