import type {
  AiConversation,
  AiConversationFilter,
  AiConversationWithMessages,
  AiMessage,
  AiProjectContextBundle,
  CreateAiConversationInput,
  CreateAiMessageInput,
  CreateProjectInput,
  CreateRfiInput,
  DocumentFilter,
  Drawing,
  ManpowerFilter,
  ManpowerSummary,
  MaterialFilter,
  EquipmentFilter,
  NotificationFilter,
  PaginatedResult,
  ProcurementFilter,
  ProcurementRiskSummary,
  Project,
  ProjectKpis,
  Rfi,
  RfiFilter,
  RiskFilter,
  Schedule,
  ScheduleActivity,
  ScheduleSlippageSummary,
  Submittal,
  TaskFilter,
  UpdateProjectInput,
  UpdateRfiInput,
  UUID,
} from "@/lib/data/entities";
import type { RepositoryContext } from "@/lib/data/repositories/base.repository";
import type {
  IDataSource,
  IProjectDataService,
  IProjectRepository,
  IRfiRepository,
} from "@/lib/data/repositories/interfaces";
import { BaseRepository } from "@/lib/data/repositories/base.repository";
import { getMockStore } from "@/lib/data/adapters/mock/mock-store";
import { resolveProjectId } from "@/lib/data/adapters/mock/fixtures/ids";

function assertCompany<T extends { companyId: string }>(
  record: T,
  ctx: RepositoryContext
): T {
  if (record.companyId !== ctx.companyId) {
    throw new Error("Tenant isolation violation");
  }
  return record;
}

class MockProjectRepository extends BaseRepository implements IProjectRepository {
  async findById(id: UUID, ctx: RepositoryContext): Promise<Project | null> {
    const resolved = resolveProjectId(id);
    const project = getMockStore().snapshot.projects.find(
      (p) => p.id === resolved && p.companyId === ctx.companyId && !p.deletedAt
    );
    return project ?? null;
  }

  async findByCode(code: string, ctx: RepositoryContext): Promise<Project | null> {
    return (
      getMockStore().snapshot.projects.find(
        (p) => p.code === code && p.companyId === ctx.companyId && !p.deletedAt
      ) ?? null
    );
  }

  async findAll(
    ctx: RepositoryContext,
    filter?: { page?: number; pageSize?: number }
  ): Promise<PaginatedResult<Project>> {
    const records = this.notDeleted(
      getMockStore().snapshot.projects.filter((p) => p.companyId === ctx.companyId)
    );
    return this.paginate(records, filter?.page, filter?.pageSize);
  }

  async getKpis(ctx: RepositoryContext): Promise<ProjectKpis> {
    const projects = this.notDeleted(
      getMockStore().snapshot.projects.filter((p) => p.companyId === ctx.companyId)
    );
    const active = projects.filter((p) => p.status === "Active");
    const delayed = projects.filter((p) => p.isDelayed);
    const atRisk = projects.filter((p) => p.health === "at-risk" || p.health === "critical");

    return {
      totalProjects: projects.length,
      activeProjects: active.length,
      delayedProjects: delayed.length,
      atRiskProjects: atRisk.length,
      totalContractValue: projects.reduce((sum, p) => sum + p.contractValue, 0),
      averageProgress:
        projects.length === 0
          ? 0
          : Math.round(
              projects.reduce((sum, p) => sum + p.progressPct, 0) / projects.length
            ),
      averageHealthScore:
        projects.length === 0
          ? 0
          : Math.round(
              projects.reduce((sum, p) => sum + p.healthScore, 0) / projects.length
            ),
    };
  }

  async create(input: CreateProjectInput, ctx: RepositoryContext): Promise<Project> {
    const now = new Date().toISOString();
    const project: Project = {
      id: crypto.randomUUID(),
      companyId: ctx.companyId,
      code: input.code,
      name: input.name,
      clientName: input.clientName,
      country: input.country,
      status: input.status,
      health: "healthy",
      healthScore: 100,
      riskLevel: "Low",
      progressPct: 0,
      contractValue: input.contractValue,
      contractCurrency: input.contractCurrency,
      currentPhase: input.currentPhase ?? "Planning",
      startDate: input.startDate,
      plannedFinishDate: input.plannedFinishDate,
      isDelayed: false,
      projectDirectorId: input.projectDirectorId,
      constructionManagerId: input.constructionManagerId,
      projectManagerId: input.projectManagerId,
      nextMilestone: input.nextMilestone,
      nextMilestoneDate: input.nextMilestoneDate,
      createdAt: now,
      updatedAt: now,
    };
    getMockStore().snapshot.projects.push(project);
    return project;
  }

  async update(
    id: UUID,
    input: UpdateProjectInput,
    ctx: RepositoryContext
  ): Promise<Project> {
    const project = await this.findById(id, ctx);
    if (!project) throw new Error("Project not found");
    Object.assign(project, input, { updatedAt: new Date().toISOString() });
    return project;
  }
}

class MockRfiRepository extends BaseRepository implements IRfiRepository {
  async findByProject(
    projectId: UUID,
    ctx: RepositoryContext,
    filter?: RfiFilter
  ): Promise<Rfi[]> {
    const resolved = resolveProjectId(projectId);
    return getMockStore().snapshot.rfis.filter((r) => {
      if (r.companyId !== ctx.companyId || r.projectId !== resolved || r.deletedAt) {
        return false;
      }
      if (filter?.status && r.status !== filter.status) return false;
      if (filter?.priority && r.priority !== filter.priority) return false;
      if (filter?.overdue && r.status !== "Overdue") return false;
      return true;
    });
  }

  async findById(id: UUID, ctx: RepositoryContext): Promise<Rfi | null> {
    const rfi = getMockStore().snapshot.rfis.find((r) => r.id === id && !r.deletedAt);
    return rfi ? assertCompany(rfi, ctx) : null;
  }

  async create(input: CreateRfiInput, ctx: RepositoryContext): Promise<Rfi> {
    const now = new Date().toISOString();
    const rfi: Rfi = {
      id: crypto.randomUUID(),
      companyId: ctx.companyId,
      projectId: resolveProjectId(input.projectId),
      reference: input.reference,
      subject: input.subject,
      description: input.description,
      status: input.status ?? "Open",
      priority: input.priority ?? "Medium",
      discipline: input.discipline,
      area: input.area,
      responsibleEngineerId: input.responsibleEngineerId,
      consultant: input.consultant,
      submittedById: input.submittedById,
      submissionDate: input.submissionDate,
      dueDate: input.dueDate,
      daysOpen: 0,
      revision: input.revision ?? "—",
      linkedDrawingId: input.linkedDrawingId,
      createdAt: now,
      updatedAt: now,
    };
    getMockStore().snapshot.rfis.push(rfi);
    return rfi;
  }

  async update(id: UUID, input: UpdateRfiInput, ctx: RepositoryContext): Promise<Rfi> {
    const rfi = await this.findById(id, ctx);
    if (!rfi) throw new Error("RFI not found");
    Object.assign(rfi, input, { updatedAt: new Date().toISOString() });
    return rfi;
  }
}

function projectScopedFilter<T extends { companyId: string; projectId: string; deletedAt?: string | null }>(
  records: T[],
  projectId: UUID,
  ctx: RepositoryContext
): T[] {
  const resolved = resolveProjectId(projectId);
  return records.filter(
    (r) => r.companyId === ctx.companyId && r.projectId === resolved && !r.deletedAt
  );
}

class MockProjectDataService implements IProjectDataService {
  constructor(private readonly projects: MockProjectRepository) {}

  async getProjectBundle(projectId: UUID, ctx: RepositoryContext) {
    const resolved = resolveProjectId(projectId);
    const store = getMockStore().snapshot;
    const project = await this.projects.findById(resolved, ctx);
    if (!project) throw new Error("Project not found");

    const rfis = projectScopedFilter(store.rfis, resolved, ctx);
    const submittals = projectScopedFilter(store.submittals, resolved, ctx);
    const drawings = projectScopedFilter(store.drawings, resolved, ctx);
    const risks = projectScopedFilter(store.risks, resolved, ctx);
    const materials = projectScopedFilter(store.materials, resolved, ctx);
    const manpower = projectScopedFilter(store.manpower, resolved, ctx);
    const procurement = projectScopedFilter(store.procurement, resolved, ctx);
    const tasks = projectScopedFilter(store.tasks, resolved, ctx);
    const meetings = projectScopedFilter(store.meetings, resolved, ctx);
    const dailyReports = projectScopedFilter(store.dailyReports, resolved, ctx);

    const bundle: AiProjectContextBundle = {
      projectId: resolved,
      rfis: rfis.map((r) => ({ reference: r.reference, status: r.status, title: r.subject })),
      submittals: submittals.map((s) => ({ reference: s.reference, status: s.status, title: s.title })),
      drawings: drawings.map((d) => ({ reference: d.reference, status: d.status, title: d.title })),
      risks: risks.map((r) => ({ reference: r.reference, level: r.level, title: r.title })),
      materials: materials.map((m) => ({ code: m.code, status: m.status, name: m.name })),
      manpower: manpower.map((m) => ({
        trade: m.trade,
        planned: m.plannedHeadcount,
        actual: m.actualHeadcount,
      })),
      procurement: procurement.map((p) => ({
        poNumber: p.poNumber,
        status: p.status,
        supplier: p.supplier,
      })),
      tasks: tasks.map((t) => ({ reference: t.reference, status: t.status, title: t.title })),
    };

    return { ...bundle, project, risks, meetings, dailyReports };
  }
}

function createListRepo<T extends { companyId: string; projectId: string; deletedAt?: string | null }>(
  getRecords: () => T[]
) {
  return {
    findByProject(projectId: UUID, ctx: RepositoryContext): Promise<T[]> {
      return Promise.resolve(projectScopedFilter(getRecords(), projectId, ctx));
    },
  };
}

export function createMockDataSource(): IDataSource {
  const projects = new MockProjectRepository();
  const rfis = new MockRfiRepository();
  const store = getMockStore();

  return {
    mode: "mock",
    companies: {
      findById: (id) =>
        Promise.resolve(store.snapshot.companies.find((c) => c.id === id) ?? null),
      findBySlug: (slug) =>
        Promise.resolve(store.snapshot.companies.find((c) => c.slug === slug) ?? null),
      create: async (input) => {
        const now = new Date().toISOString();
        const company = {
          id: crypto.randomUUID(),
          ...input,
          subscriptionTier: input.subscriptionTier ?? "professional",
          isActive: true,
          createdAt: now,
          updatedAt: now,
        } as import("@/lib/data/entities").Company;
        store.snapshot.companies.push(company);
        return company;
      },
      update: async (id, input) => {
        const company = store.snapshot.companies.find((c) => c.id === id);
        if (!company) throw new Error("Company not found");
        Object.assign(company, input, { updatedAt: new Date().toISOString() });
        return company;
      },
    },
    users: {
      findById: (id, ctx) =>
        Promise.resolve(
          store.snapshot.users.find(
            (u) => u.id === id && u.companyId === ctx.companyId && !u.deletedAt
          ) ?? null
        ),
      findByEmail: (email, ctx) =>
        Promise.resolve(
          store.snapshot.users.find(
            (u) =>
              u.email.toLowerCase() === email.toLowerCase() &&
              u.companyId === ctx.companyId &&
              !u.deletedAt
          ) ?? null
        ),
      findByCompany: (ctx) =>
        Promise.resolve(
          store.snapshot.users.filter(
            (u) => u.companyId === ctx.companyId && !u.deletedAt
          )
        ),
    },
    projects,
    contracts: createListRepo(() => store.snapshot.contracts),
    rfis,
    submittals: {
      ...createListRepo<Submittal>(() => store.snapshot.submittals),
      findById: async (id, ctx) => {
        const s = store.snapshot.submittals.find((x) => x.id === id && !x.deletedAt);
        return s ? assertCompany(s, ctx) : null;
      },
    },
    drawings: {
      ...createListRepo<Drawing>(() => store.snapshot.drawings),
      findById: async (id, ctx) => {
        const d = store.snapshot.drawings.find((x) => x.id === id && !x.deletedAt);
        return d ? assertCompany(d, ctx) : null;
      },
    },
    documents: {
      findByProject: async (projectId, ctx, filter?: DocumentFilter) => {
        let docs = projectScopedFilter(store.snapshot.documents, projectId, ctx);
        if (filter?.category) docs = docs.filter((d) => d.category === filter.category);
        if (filter?.search) {
          const q = filter.search.toLowerCase();
          docs = docs.filter((d) => d.name.toLowerCase().includes(q));
        }
        return docs;
      },
      findById: async (id, ctx) => {
        const d = store.snapshot.documents.find((x) => x.id === id && !x.deletedAt);
        return d ? assertCompany(d, ctx) : null;
      },
    },
    dailyReports: {
      findByProject: (projectId, ctx) =>
        Promise.resolve(projectScopedFilter(store.snapshot.dailyReports, projectId, ctx)),
      findByDate: async (projectId, reportDate, ctx) => {
        const reports = projectScopedFilter(store.snapshot.dailyReports, projectId, ctx);
        return reports.find((r) => r.reportDate === reportDate) ?? null;
      },
    },
    materials: {
      findByProject: async (projectId, ctx, filter?: MaterialFilter) => {
        let items = projectScopedFilter(store.snapshot.materials, projectId, ctx);
        if (filter?.status) items = items.filter((m) => m.status === filter.status);
        return items;
      },
    },
    equipment: {
      findByProject: async (projectId, ctx, filter?: EquipmentFilter) => {
        let items = projectScopedFilter(store.snapshot.equipment, projectId, ctx);
        if (filter?.status) items = items.filter((e) => e.status === filter.status);
        return items;
      },
    },
    manpower: {
      findByProject: async (projectId, ctx, filter?: ManpowerFilter) => {
        let items = projectScopedFilter(store.snapshot.manpower, projectId, ctx);
        if (filter?.belowTarget) {
          items = items.filter((m) => m.actualHeadcount < m.plannedHeadcount);
        }
        return items;
      },
      getLatestSummary: async (projectId, ctx): Promise<ManpowerSummary[]> => {
        const items = projectScopedFilter(store.snapshot.manpower, projectId, ctx);
        return items.map((m) => ({
          trade: m.trade,
          plannedHeadcount: m.plannedHeadcount,
          actualHeadcount: m.actualHeadcount,
          variancePct: m.variancePct,
          unit: m.unit,
        }));
      },
    },
    procurement: {
      findByProject: async (projectId, ctx, filter?: ProcurementFilter) => {
        let items = projectScopedFilter(store.snapshot.procurement, projectId, ctx);
        if (filter?.delayed) items = items.filter((p) => (p.delayDays ?? 0) > 0);
        return items;
      },
      getRiskSummary: async (projectId, ctx): Promise<ProcurementRiskSummary[]> => {
        const items = projectScopedFilter(store.snapshot.procurement, projectId, ctx);
        return items
          .filter((p) => (p.delayDays ?? 0) > 0 || p.status === "delayed")
          .map((p) => ({
            id: p.id,
            poNumber: p.poNumber,
            title: p.title,
            supplier: p.supplier,
            delayDays: p.delayDays ?? 0,
            status: p.status,
            requiredDeliveryDate: p.requiredDeliveryDate,
          }));
      },
    },
    risks: {
      findByProject: async (projectId, ctx, filter?: RiskFilter) => {
        let items = projectScopedFilter(store.snapshot.risks, projectId, ctx);
        if (filter?.status) items = items.filter((r) => r.status === filter.status);
        if (filter?.level) items = items.filter((r) => r.level === filter.level);
        return items;
      },
    },
    meetings: {
      findByProject: async (projectId, ctx) =>
        projectScopedFilter(store.snapshot.meetings, projectId, ctx),
    },
    tasks: {
      findByProject: async (projectId, ctx, filter?: TaskFilter) => {
        let items = projectScopedFilter(store.snapshot.tasks, projectId, ctx);
        if (filter?.status) items = items.filter((t) => t.status === filter.status);
        return items;
      },
    },
    schedules: {
      findActiveByProject: async (projectId, ctx): Promise<Schedule | null> => {
        const resolved = resolveProjectId(projectId);
        return (
          store.snapshot.schedules.find(
            (s) =>
              s.companyId === ctx.companyId &&
              s.projectId === resolved &&
              s.isActive &&
              !s.deletedAt
          ) ?? null
        );
      },
      findActivities: async (
        scheduleId: UUID,
        ctx: RepositoryContext
      ): Promise<ScheduleActivity[]> => {
        return store.snapshot.scheduleActivities.filter(
          (a) =>
            a.scheduleId === scheduleId &&
            a.companyId === ctx.companyId &&
            !a.deletedAt
        );
      },
      getCriticalActivities: async (
        projectId: UUID,
        ctx: RepositoryContext
      ): Promise<ScheduleSlippageSummary[]> => {
        const resolved = resolveProjectId(projectId);
        return store.snapshot.scheduleActivities
          .filter(
            (a) =>
              a.projectId === resolved &&
              a.companyId === ctx.companyId &&
              a.isCritical &&
              !a.deletedAt
          )
          .map((a) => ({
            activityId: a.id,
            activityCode: a.activityCode,
            name: a.name,
            plannedFinish: a.plannedFinish,
            floatDays: a.floatDays,
            isCritical: a.isCritical,
          }));
      },
    },
    notifications: {
      findByUser: async (userId, ctx, filter?: NotificationFilter) => {
        let items = store.snapshot.notifications.filter(
          (n) => n.userId === userId && n.companyId === ctx.companyId && !n.deletedAt
        );
        if (filter?.isRead !== undefined) {
          items = items.filter((n) => n.isRead === filter.isRead);
        }
        return items;
      },
      markRead: async (id, ctx) => {
        const n = store.snapshot.notifications.find(
          (x) => x.id === id && x.companyId === ctx.companyId
        );
        if (n) {
          n.isRead = true;
          n.readAt = new Date().toISOString();
        }
      },
    },
    aiConversations: {
      findById: async (id, ctx): Promise<AiConversationWithMessages | null> => {
        const conversation = store.snapshot.aiConversations.find(
          (c) => c.id === id && c.companyId === ctx.companyId && !c.deletedAt
        );
        if (!conversation) return null;
        const messages = store.snapshot.aiMessages.filter(
          (m) => m.conversationId === id && m.companyId === ctx.companyId
        );
        return { ...conversation, messages };
      },
      findMany: async (ctx, filter?: AiConversationFilter): Promise<AiConversation[]> => {
        let items = store.snapshot.aiConversations.filter(
          (c) => c.companyId === ctx.companyId && !c.deletedAt
        );
        if (filter?.userId) items = items.filter((c) => c.userId === filter.userId);
        if (filter?.projectId) items = items.filter((c) => c.projectId === filter.projectId);
        if (filter?.pinned !== undefined) items = items.filter((c) => c.pinned === filter.pinned);
        return items.sort((a, b) => {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
      },
      create: async (input: CreateAiConversationInput, ctx): Promise<AiConversation> => {
        const now = new Date().toISOString();
        const conversation: AiConversation = {
          id: crypto.randomUUID(),
          companyId: ctx.companyId,
          userId: input.userId,
          projectId: input.projectId,
          scope: input.scope,
          title: input.title,
          pinned: input.pinned ?? false,
          messageCount: 0,
          metadata: input.metadata,
          createdAt: now,
          updatedAt: now,
        };
        store.snapshot.aiConversations.push(conversation);
        return conversation;
      },
      addMessage: async (input: CreateAiMessageInput, ctx): Promise<AiMessage> => {
        const now = new Date().toISOString();
        const message: AiMessage = {
          id: crypto.randomUUID(),
          conversationId: input.conversationId,
          companyId: ctx.companyId,
          role: input.role,
          content: input.content,
          references: input.references ?? [],
          tokenCount: input.tokenCount,
          model: input.model,
          createdAt: now,
        };
        store.snapshot.aiMessages.push(message);
        const conversation = store.snapshot.aiConversations.find(
          (c) => c.id === input.conversationId
        );
        if (conversation) {
          conversation.messageCount += 1;
          conversation.lastMessageAt = now;
          conversation.updatedAt = now;
        }
        return message;
      },
      update: async (id, input, ctx) => {
        const conversation = store.snapshot.aiConversations.find(
          (c) => c.id === id && c.companyId === ctx.companyId
        );
        if (!conversation) throw new Error("Conversation not found");
        Object.assign(conversation, input, { updatedAt: new Date().toISOString() });
        return conversation;
      },
    },
    projectData: new MockProjectDataService(projects),
  };
}
