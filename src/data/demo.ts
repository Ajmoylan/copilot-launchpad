/**
 * DEMONSTRATION DATA. Every organisation, number and stage below is fictional. The organisation
 * names are Microsoft's well-known fictional sample companies; none of this describes a real
 * customer, deal, price or outcome.
 */
import type { AdoptionSnapshot } from "../lib/adoption";

export type Stage = "Discover" | "Pilot" | "Rollout" | "Expand";

export interface Opportunity {
  organisation: string;
  industry: string;
  eligibleDevelopers: number;
  /** Planned adoption, %. */
  plannedAdoptionPercent: number;
  stage: Stage;
  nextStep: string;
}

export const STAGES: readonly Stage[] = ["Discover", "Pilot", "Rollout", "Expand"];

export const STAGE_INFO: Record<Stage, string> = {
  Discover: "Requirements, teams and success criteria are being agreed.",
  Pilot: "A controlled group is using Copilot with enablement and feedback loops.",
  Rollout: "Licences are being extended to more teams against the agreed plan.",
  Expand: "Results are reviewed and further teams or capabilities are being scoped.",
};

export const OPPORTUNITIES: readonly Opportunity[] = [
  {
    organisation: "Contoso Ltd",
    industry: "Manufacturing",
    eligibleDevelopers: 420,
    plannedAdoptionPercent: 60,
    stage: "Pilot",
    nextStep: "Review pilot feedback against success criteria",
  },
  {
    organisation: "Fabrikam Inc",
    industry: "Financial services",
    eligibleDevelopers: 1200,
    plannedAdoptionPercent: 45,
    stage: "Discover",
    nextStep: "Security and governance workshop",
  },
  {
    organisation: "Northwind Traders",
    industry: "Retail",
    eligibleDevelopers: 180,
    plannedAdoptionPercent: 75,
    stage: "Rollout",
    nextStep: "Extend licences to the platform team",
  },
  {
    organisation: "Tailspin Toys",
    industry: "Gaming",
    eligibleDevelopers: 95,
    plannedAdoptionPercent: 80,
    stage: "Expand",
    nextStep: "Scope additional teams for the next phase",
  },
  {
    organisation: "Woodgrove Bank",
    industry: "Banking",
    eligibleDevelopers: 650,
    plannedAdoptionPercent: 40,
    stage: "Discover",
    nextStep: "Identify pilot teams and use cases",
  },
];

/** Illustrative 12-week programme for one fictional customer (Contoso Ltd). */
export const ADOPTION_PROGRAMME = {
  organisation: "Contoso Ltd",
  snapshots: [
    { period: "Wk 1", eligibleDevelopers: 420, pilotParticipants: 0, adoptedLicences: 0, targetLicences: 0 },
    { period: "Wk 2", eligibleDevelopers: 420, pilotParticipants: 25, adoptedLicences: 18, targetLicences: 25 },
    { period: "Wk 3", eligibleDevelopers: 420, pilotParticipants: 40, adoptedLicences: 34, targetLicences: 40 },
    { period: "Wk 4", eligibleDevelopers: 420, pilotParticipants: 40, adoptedLicences: 38, targetLicences: 40 },
    { period: "Wk 5", eligibleDevelopers: 420, pilotParticipants: 40, adoptedLicences: 40, targetLicences: 40 },
    { period: "Wk 6", eligibleDevelopers: 420, pilotParticipants: 40, adoptedLicences: 62, targetLicences: 70 },
    { period: "Wk 7", eligibleDevelopers: 420, pilotParticipants: 40, adoptedLicences: 88, targetLicences: 100 },
    { period: "Wk 8", eligibleDevelopers: 420, pilotParticipants: 40, adoptedLicences: 121, targetLicences: 130 },
    { period: "Wk 9", eligibleDevelopers: 420, pilotParticipants: 40, adoptedLicences: 150, targetLicences: 160 },
    { period: "Wk 10", eligibleDevelopers: 420, pilotParticipants: 40, adoptedLicences: 176, targetLicences: 190 },
    { period: "Wk 11", eligibleDevelopers: 420, pilotParticipants: 40, adoptedLicences: 204, targetLicences: 220 },
    { period: "Wk 12", eligibleDevelopers: 420, pilotParticipants: 40, adoptedLicences: 231, targetLicences: 252 },
  ] satisfies AdoptionSnapshot[],
};
