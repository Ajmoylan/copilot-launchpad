/**
 * Illustrative revenue model. Every input is a user assumption: nothing here is an official
 * GitHub, Microsoft or Arrow price, discount or margin.
 */

export interface RevenueInputs {
  /** Developers who could be offered a Copilot licence. */
  eligibleDevelopers: number;
  /** Share of eligible developers expected to adopt, 0–100. */
  adoptionPercent: number;
  /** Assumed monthly licence cost per user, in the chosen currency. */
  monthlyCostPerUser: number;
  /** Assumed partner gross margin on customer spend, 0–100. */
  partnerMarginPercent: number;
}

export interface RevenueResult {
  adoptedLicences: number;
  monthlyCustomerSpend: number;
  annualCustomerSpend: number;
  annualPartnerMargin: number;
}

export type InputField = keyof RevenueInputs;

export const LIMITS: Record<InputField, { min: number; max: number; step: number }> = {
  eligibleDevelopers: { min: 0, max: 1_000_000, step: 1 },
  adoptionPercent: { min: 0, max: 100, step: 1 },
  monthlyCostPerUser: { min: 0, max: 10_000, step: 0.01 },
  partnerMarginPercent: { min: 0, max: 100, step: 0.1 },
};

/**
 * Illustrative starting values only. The licence cost is a placeholder to be replaced with the
 * customer's actual quoted price; the margin is an arbitrary example, not a programme term.
 */
export const DEFAULT_INPUTS: RevenueInputs = {
  eligibleDevelopers: 500,
  adoptionPercent: 60,
  monthlyCostPerUser: 19,
  partnerMarginPercent: 10,
};

export const FORMULAS = [
  "Adopted licences = round down(eligible developers × adoption %)",
  "Monthly customer spend = adopted licences × monthly cost per user",
  "Annual customer spend = monthly customer spend × 12",
  "Annual partner gross margin = annual customer spend × partner margin %",
] as const;

/**
 * Parse one raw form value. Returns an error message for empty, non-numeric, out-of-range or
 * (for developer counts) fractional input, so the UI never calculates from invalid data.
 */
export function parseInput(field: InputField, raw: string): { value?: number; error?: string } {
  const trimmed = raw.trim();
  if (trimmed === "") return { error: "Enter a number." };
  const value = Number(trimmed);
  if (!Number.isFinite(value)) return { error: "Enter a number." };
  const { min, max } = LIMITS[field];
  if (value < min || value > max) {
    return { error: `Enter a value from ${min.toLocaleString("en-GB")} to ${max.toLocaleString("en-GB")}.` };
  }
  if (field === "eligibleDevelopers" && !Number.isInteger(value)) {
    return { error: "Developers must be a whole number." };
  }
  return { value };
}

const roundMoney = (value: number) => Math.round(value * 100) / 100;

export function calculateRevenue(inputs: RevenueInputs): RevenueResult {
  for (const field of Object.keys(LIMITS) as InputField[]) {
    const value = inputs[field];
    const { min, max } = LIMITS[field];
    if (!Number.isFinite(value) || value < min || value > max) {
      throw new RangeError(`${field} must be between ${min} and ${max}.`);
    }
  }
  // Whole licences only: you can't buy part of a seat. Round down to stay conservative, with a
  // small epsilon so 500 × 60% is exactly 300, not 299 from floating-point error.
  const adoptedLicences = Math.floor(
    (inputs.eligibleDevelopers * inputs.adoptionPercent) / 100 + 1e-9,
  );
  const monthlyCustomerSpend = roundMoney(adoptedLicences * inputs.monthlyCostPerUser);
  const annualCustomerSpend = roundMoney(monthlyCustomerSpend * 12);
  const annualPartnerMargin = roundMoney((annualCustomerSpend * inputs.partnerMarginPercent) / 100);
  return { adoptedLicences, monthlyCustomerSpend, annualCustomerSpend, annualPartnerMargin };
}

export function formatMoney(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}
