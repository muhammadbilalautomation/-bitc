import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("developer credit", () => {
  it("shows the supplied Senstar Software Systems Botswana credit and phone link", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

    expect(source).toContain("Developed by: Senstar Software Systems Botswana");
    expect(source).toContain("+267 75 602 481");
    expect(source).toContain('href="tel:+26775602481"');
    expect(source).toContain("<footer");
    expect(source).toContain("DEVELOPED BY: SENSTAR SOFTWARE SYSTEMS BOTSWANA - +267 75 602 481");
    expect(source).toContain("DEVELOPED BY: SENSTAR SOFTWARE SYSTEMS [BOTSWANA CITIZEN OWNED] - +267 75 602 481");
  });
});

export {};
