import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("phone display", () => {
  it("shows each client-provided number exactly once", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    const firstNumber = "+1 (571) 464-5456";
    const secondNumber = "+1 (267) 828-9063";
    expect(source.split(firstNumber).length - 1).toBe(1);
    expect(source.split(secondNumber).length - 1).toBe(1);
    expect(source).toContain("Investor call lines");
  });
});
