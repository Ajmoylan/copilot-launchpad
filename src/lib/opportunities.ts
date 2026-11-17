import { OPPORTUNITIES } from "../data/demo";
import { DEFAULT_INPUTS, calculateRevenue } from "./revenue";

/** Each fictional opportunity sized at the calculator's default (illustrative) assumptions. */
export function opportunityRows() {
  return OPPORTUNITIES.map((o) => {
    const revenue = calculateRevenue({
      ...DEFAULT_INPUTS,
      eligibleDevelopers: o.eligibleDevelopers,
      adoptionPercent: o.plannedAdoptionPercent,
    });
    return { ...o, ...revenue };
  });
}
