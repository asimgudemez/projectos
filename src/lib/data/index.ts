import type { UUID } from "@/lib/data/entities";
import type { RepositoryContext } from "@/lib/data/repositories/base.repository";
import { IDS } from "@/lib/data/adapters/mock/fixtures/ids";
import { getDataSource } from "@/lib/data/data-source";

/** Default tenant context for development (Nexora Labs). */
export const DEFAULT_COMPANY_ID: UUID = IDS.company.nexora;
export const DEFAULT_USER_ID: UUID = IDS.users.asim;

export function createRepositoryContext(
  overrides?: Partial<RepositoryContext>
): RepositoryContext {
  return {
    companyId: overrides?.companyId ?? DEFAULT_COMPANY_ID,
    userId: overrides?.userId ?? DEFAULT_USER_ID,
  };
}

/** Public API — single entry point for all data access. */
export const data = {
  get source() {
    return getDataSource();
  },
  withContext(ctx?: Partial<RepositoryContext>) {
    const context = createRepositoryContext(ctx);
    const source = getDataSource();
    return {
      context,
      companies: source.companies,
      users: source.users,
      projects: source.projects,
      contracts: source.contracts,
      rfis: source.rfis,
      submittals: source.submittals,
      drawings: source.drawings,
      documents: source.documents,
      dailyReports: source.dailyReports,
      materials: source.materials,
      equipment: source.equipment,
      manpower: source.manpower,
      procurement: source.procurement,
      risks: source.risks,
      meetings: source.meetings,
      tasks: source.tasks,
      schedules: source.schedules,
      notifications: source.notifications,
      aiConversations: source.aiConversations,
      projectData: source.projectData,
    };
  },
};

export * from "@/lib/data/entities";
export { getDataSource, resolveDataSourceMode } from "@/lib/data/data-source";
export { resolveProjectId, LEGACY_PROJECT_SLUGS } from "@/lib/data/adapters/mock/fixtures/ids";
