export const SECTIONS = [
  { id: "overview", label: "Overview", number: "01" },
  { id: "calculator", label: "Revenue Calculator", number: "02" },
  { id: "adoption", label: "Adoption Dashboard", number: "03" },
  { id: "roadmap", label: "30/60/90 Roadmap", number: "04" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export function sectionFromHash(hash: string): SectionId {
  const id = hash.replace(/^#\/?/, "");
  return SECTIONS.some((s) => s.id === id) ? (id as SectionId) : "overview";
}
