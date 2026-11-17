import { describe, expect, it } from "vitest";
import { DEFAULT_INPUTS, FORMULAS, calculateRevenue, formatMoney, parseInput } from "./revenue";

describe("calculateRevenue", () => {
  it("calculates the default illustrative example", () => {
    expect(calculateRevenue(DEFAULT_INPUTS)).toEqual({
      adoptedLicences: 300, // 500 × 60%
      monthlyCustomerSpend: 5700, // 300 × 19
      annualCustomerSpend: 68400, // × 12
      annualPartnerMargin: 6840, // × 10%
    });
  });

  it("rounds licences down to whole seats", () => {
    const r = calculateRevenue({ ...DEFAULT_INPUTS, eligibleDevelopers: 333, adoptionPercent: 50 });
    expect(r.adoptedLicences).toBe(166);
  });

  it("avoids floating-point drift on exact percentages", () => {
    for (const [devs, pct, expected] of [
      [500, 60, 300],
      [100, 7, 7],
      [1000, 29, 290],
      [3, 100, 3],
    ] as const) {
      expect(calculateRevenue({ ...DEFAULT_INPUTS, eligibleDevelopers: devs, adoptionPercent: pct }).adoptedLicences).toBe(expected);
    }
  });

  it("rounds money to cents", () => {
    const r = calculateRevenue({ eligibleDevelopers: 3, adoptionPercent: 100, monthlyCostPerUser: 10.333, partnerMarginPercent: 12.5 });
    expect(r.monthlyCustomerSpend).toBe(31);
    expect(r.annualCustomerSpend).toBe(372);
    expect(r.annualPartnerMargin).toBe(46.5);
  });

  it("handles zero inputs and the 0% / 100% bounds", () => {
    expect(calculateRevenue({ ...DEFAULT_INPUTS, eligibleDevelopers: 0 })).toEqual({
      adoptedLicences: 0,
      monthlyCustomerSpend: 0,
      annualCustomerSpend: 0,
      annualPartnerMargin: 0,
    });
    expect(calculateRevenue({ ...DEFAULT_INPUTS, adoptionPercent: 0 }).adoptedLicences).toBe(0);
    expect(calculateRevenue({ ...DEFAULT_INPUTS, adoptionPercent: 100 }).adoptedLicences).toBe(500);
    expect(calculateRevenue({ ...DEFAULT_INPUTS, partnerMarginPercent: 0 }).annualPartnerMargin).toBe(0);
  });

  it("rejects invalid inputs instead of producing misleading numbers", () => {
    expect(() => calculateRevenue({ ...DEFAULT_INPUTS, eligibleDevelopers: -1 })).toThrow(RangeError);
    expect(() => calculateRevenue({ ...DEFAULT_INPUTS, adoptionPercent: 101 })).toThrow(RangeError);
    expect(() => calculateRevenue({ ...DEFAULT_INPUTS, monthlyCostPerUser: Number.NaN })).toThrow(RangeError);
    expect(() => calculateRevenue({ ...DEFAULT_INPUTS, partnerMarginPercent: Infinity })).toThrow(RangeError);
  });

  it("documents a formula for every output", () => {
    expect(FORMULAS).toHaveLength(4);
  });
});

describe("parseInput", () => {
  it("accepts valid numbers, including decimals for money", () => {
    expect(parseInput("eligibleDevelopers", " 250 ")).toEqual({ value: 250 });
    expect(parseInput("monthlyCostPerUser", "19.5")).toEqual({ value: 19.5 });
  });

  it.each([
    ["eligibleDevelopers", "", "Enter a number."],
    ["eligibleDevelopers", "abc", "Enter a number."],
    ["eligibleDevelopers", "12.5", "Developers must be a whole number."],
    ["eligibleDevelopers", "-5", "Enter a value from 0 to 1,000,000."],
    ["adoptionPercent", "150", "Enter a value from 0 to 100."],
    ["partnerMarginPercent", "-1", "Enter a value from 0 to 100."],
    ["monthlyCostPerUser", "1e9", "Enter a value from 0 to 10,000."],
    ["monthlyCostPerUser", "Infinity", "Enter a number."],
  ] as const)("rejects %s = %j", (field, raw, message) => {
    expect(parseInput(field, raw)).toEqual({ error: message });
  });
});

describe("formatMoney", () => {
  it("formats by currency, without cents for large values", () => {
    expect(formatMoney(68400)).toBe("$68,400");
    expect(formatMoney(19.5)).toBe("$19.50");
    expect(formatMoney(1000, "EUR")).toBe("€1,000");
  });
});
