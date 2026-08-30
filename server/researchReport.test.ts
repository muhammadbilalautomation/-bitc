import { describe, expect, it } from "vitest";
import { formatResearchReport } from "../shared/researchReport";

describe("formatResearchReport", () => {
  it("reports captured fields without claiming external save", () => {
    const report = formatResearchReport([
      { name: "Alpha Energy", businessEmail: "hello@alpha.example" },
      { name: "Beta Capital", businessPhone: "+267 1234567" },
    ]);
    expect(report).toContain("2 companies found");
    expect(report).toContain("Alpha Energy, Beta Capital");
    expect(report).toContain("2 unverified contact hints");
    expect(report).toContain("not saved to an external system");
  });
});
