import { describe, expect, it } from "vitest";
import { ADOPTION_PROGRAMME, OPPORTUNITIES } from "../data/demo";
import { percent, progression, summarise } from "./adoption";
import { opportunityRows } from "./opportunities";

const base = { period: "Wk 1", eligibleDevelopers: 400, pilotParticipants: 40, adoptedLicences: 200, targetLicences: 200 };

describe("percent", () => {
  it("rounds to one decimal place", () => {
    expect(percent(231, 420)).toBe(55);
    expect(percent(1, 3)).toBe(33.3);
  });
  it("returns 0 when there is nothing to divide by or input is invalid", () => {
    expect(percent(5, 0)).toBe(0);
    expect(percent(5, -10)).toBe(0);
    expect(percent(Number.NaN, 10)).toBe(0);
  });
});

describe("summarise", () => {
  it("is on track within the tolerance", () => {
    expect(summarise(base)).toMatchObject({ adoptionPercent: 50, targetPercent: 50, varianceLicences: 0, status: "on-track" });
  });
  it("is behind or ahead beyond the tolerance", () => {
    expect(summarise({ ...base, adoptedLicences: 160 }).status).toBe("behind");
    expect(summarise({ ...base, adoptedLicences: 240 }).status).toBe("ahead");
    expect(summarise({ ...base, adoptedLicences: 190 }).status).toBe("on-track");
  });
  it("summarises the example programme's final week", () => {
    const last = ADOPTION_PROGRAMME.snapshots.at(-1)!;
    expect(summarise(last)).toMatchObject({ eligibleDevelopers: 420, pilotParticipants: 40, adoptedLicences: 231, adoptionPercent: 55, targetPercent: 60, varianceLicences: -21, status: "on-track" });
  });
});

describe("progression", () => {
  it("produces one chart row per period with percentages", () => {
    const rows = progression(ADOPTION_PROGRAMME.snapshots);
    expect(rows).toHaveLength(12);
    expect(rows[0]).toMatchObject({ period: "Wk 1", adoptionPercent: 0, targetPercent: 0 });
    expect(rows.at(-1)).toMatchObject({ adopted: 231, target: 252, adoptionPercent: 55, targetPercent: 60 });
  });
  it("example data never adopts more licences than eligible developers", () => {
    for (const s of ADOPTION_PROGRAMME.snapshots) {
      expect(s.adoptedLicences).toBeLessThanOrEqual(s.eligibleDevelopers);
      expect(s.pilotParticipants).toBeLessThanOrEqual(s.eligibleDevelopers);
    }
  });
});

describe("opportunityRows", () => {
  it("sizes each fictional opportunity with the calculator", () => {
    const rows = opportunityRows();
    expect(rows).toHaveLength(OPPORTUNITIES.length);
    const contoso = rows.find((r) => r.organisation === "Contoso Ltd")!;
    expect(contoso.adoptedLicences).toBe(252); // 420 × 60%
    expect(contoso.annualCustomerSpend).toBe(252 * 19 * 12);
  });
});
