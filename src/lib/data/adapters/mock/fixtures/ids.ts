/** Stable UUIDs for mock/seed data — map to legacy string IDs where needed. */

export const IDS = {
  company: {
    nexora: "00000000-0000-4000-8000-000000000001",
  },
  users: {
    khalid: "00000000-0000-4000-8000-000000000101",
    sarah: "00000000-0000-4000-8000-000000000102",
    omar: "00000000-0000-4000-8000-000000000103",
    fatima: "00000000-0000-4000-8000-000000000104",
    david: "00000000-0000-4000-8000-000000000105",
    anna: "00000000-0000-4000-8000-000000000106",
    asim: "00000000-0000-4000-8000-000000000107",
  },
  projects: {
    amaala: "00000000-0000-4000-8000-000000000201",
    neomOxagon: "00000000-0000-4000-8000-000000000202",
    riyadhMetro: "00000000-0000-4000-8000-000000000203",
    qiddiya: "00000000-0000-4000-8000-000000000204",
  },
  schedules: {
    amaalaBaseline: "00000000-0000-4000-8000-000000000301",
  },
} as const;

/** Legacy slug IDs used by existing UI routes */
export const LEGACY_PROJECT_SLUGS: Record<string, string> = {
  amaala: IDS.projects.amaala,
  "neom-oxagon": IDS.projects.neomOxagon,
  "riyadh-metro-l3": IDS.projects.riyadhMetro,
  qiddiya: IDS.projects.qiddiya,
};

export function resolveProjectId(idOrSlug: string): string {
  return LEGACY_PROJECT_SLUGS[idOrSlug] ?? idOrSlug;
}

export const NOW = "2026-07-04T08:00:00.000Z";
