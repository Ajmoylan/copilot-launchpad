/** Adoption metrics, computed from (illustrative) programme snapshots. */

export interface AdoptionSnapshot {
  /** Label for the point in time, for example "Week 4". */
  period: string;
  eligibleDevelopers: number;
  /** Developers in the controlled pilot. */
  pilotParticipants: number;
  /** Licences assigned and in use. */
  adoptedLicences: number;
  /** Planned adopted licences at this point. */
  targetLicences: number;
}

export interface AdoptionSummary {
  eligibleDevelopers: number;
  pilotParticipants: number;
  adoptedLicences: number;
  adoptionPercent: number;
  targetPercent: number;
  /** Adopted minus target licences (negative = behind plan). */
  varianceLicences: number;
  status: "ahead" | "on-track" | "behind";
}

/** Percentage rounded to one decimal place; 0 when there's nothing to divide by. */
export function percent(part: number, whole: number): number {
  if (!Number.isFinite(part) || !Number.isFinite(whole) || whole <= 0) return 0;
  return Math.round((1000 * part) / whole) / 10;
}

export function summarise(snapshot: AdoptionSnapshot, tolerancePercent = 5): AdoptionSummary {
  const adoptionPercent = percent(snapshot.adoptedLicences, snapshot.eligibleDevelopers);
  const targetPercent = percent(snapshot.targetLicences, snapshot.eligibleDevelopers);
  const varianceLicences = snapshot.adoptedLicences - snapshot.targetLicences;
  const gap = adoptionPercent - targetPercent;
  const status = gap > tolerancePercent ? "ahead" : gap < -tolerancePercent ? "behind" : "on-track";
  return {
    eligibleDevelopers: snapshot.eligibleDevelopers,
    pilotParticipants: snapshot.pilotParticipants,
    adoptedLicences: snapshot.adoptedLicences,
    adoptionPercent,
    targetPercent,
    varianceLicences,
    status,
  };
}

/** Chart rows: adoption % and target % per period. */
export function progression(snapshots: readonly AdoptionSnapshot[]) {
  return snapshots.map((s) => ({
    period: s.period,
    adopted: s.adoptedLicences,
    target: s.targetLicences,
    pilot: s.pilotParticipants,
    adoptionPercent: percent(s.adoptedLicences, s.eligibleDevelopers),
    targetPercent: percent(s.targetLicences, s.eligibleDevelopers),
  }));
}
