import { describe, expect, it } from "vitest";
import { isDarkTheme, nextTheme } from "../shared/theme";

describe("theme helpers", () => {
  it("toggles between light and dark deterministically", () => {
    expect(nextTheme("light")).toBe("dark");
    expect(nextTheme("dark")).toBe("light");
  });

  it("identifies the active dark theme", () => {
    expect(isDarkTheme("dark")).toBe(true);
    expect(isDarkTheme("light")).toBe(false);
  });
});
