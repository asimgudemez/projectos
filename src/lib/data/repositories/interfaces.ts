import type {
  Company,
  CreateCompanyInput,
  UpdateCompanyInput,
  UUID,
} from "@/lib/data/entities";
import type { RepositoryContext } from "@/lib/data/repositories/base.repository";

export interface ICompanyRepository {
  findById(id: UUID): Promise<Company | null>;
  findBySlug(slug: string): Promise<Company | null>;
  create(input: CreateCompanyInput): Promise<Company>;
  update(id: UUID, input: UpdateCompanyInput): Promise<Company>;
}

export interface IUserRepository {
  findById(id: UUID, ctx: RepositoryContext): Promise<import("@/lib/data/entities").User | null>;
  findByEmail(email: string, ctx: RepositoryContext): Promise<import("@/lib/data/entities").User | null>;
  findByCompany(ctx: RepositoryContext): Promise<import("@/lib/data/entities").User[]>;
}

export interface IProjectRepository {
  findById(id: UUID, ctx: RepositoryContext): Promise<import("@/lib/data/entities").Project | null>;
  findByCode(code: string, ctx: RepositoryContext): Promise<import("@/lib/data/entities").Project | null>;
  findAll(ctx: RepositoryContext, filter?: import("@/lib/data/entities").ListFilter<import("@/lib/data/entities").Project>): Promise<import("@/lib/data/entities").PaginatedResult<import("@/lib/data/entities").Project>>;
  getKpis(ctx: RepositoryContext): Promise<import("@/lib/data/entities").ProjectKpis>;
  create(input: import("@/lib/data/entities").CreateProjectInput, ctx: RepositoryContext): Promise<import("@/lib/data/entities").Project>;
  update(id: UUID, input: import("@/lib/data/entities").UpdateProjectInput, ctx: RepositoryContext): Promise<import("@/lib/data/entities").Project>;
}

export interface IRfiRepository {
  findByProject(projectId: UUID, ctx: RepositoryContext, filter?: import("@/lib/data/entities").RfiFilter): Promise<import("@/lib/data/entities").Rfi[]>;
  findById(id: UUID, ctx: RepositoryContext): Promise<import("@/lib/data/entities").Rfi | null>;
  create(input: import("@/lib/data/entities").CreateRfiInput, ctx: RepositoryContext): Promise<import("@/lib/data/entities").Rfi>;
  update(id: UUID, input: import("@/lib/data/entities").UpdateRfiInput, ctx: RepositoryContext): Promise<import("@/lib/data/entities").Rfi>;
}

export interface ISubmittalRepository {
  findByProject(projectId: UUID, ctx: RepositoryContext, filter?: import("@/lib/data/entities").SubmittalFilter): Promise<import("@/lib/data/entities").Submittal[]>;
  findById(id: UUID, ctx: RepositoryContext): Promise<import("@/lib/data/entities").Submittal | null>;
}

export interface IDrawingRepository {
  findByProject(projectId: UUID, ctx: RepositoryContext, filter?: import("@/lib/data/entities").DrawingFilter): Promise<import("@/lib/data/entities").Drawing[]>;
  findById(id: UUID, ctx: RepositoryContext): Promise<import("@/lib/data/entities").Drawing | null>;
}

export interface IDocumentRepository {
  findByProject(projectId: UUID, ctx: RepositoryContext, filter?: import("@/lib/data/entities").DocumentFilter): Promise<import("@/lib/data/entities").Document[]>;
  findById(id: UUID, ctx: RepositoryContext): Promise<import("@/lib/data/entities").Document | null>;
}

export interface IDailyReportRepository {
  findByProject(projectId: UUID, ctx: RepositoryContext): Promise<import("@/lib/data/entities").DailyReport[]>;
  findByDate(projectId: UUID, reportDate: string, ctx: RepositoryContext): Promise<import("@/lib/data/entities").DailyReport | null>;
}

export interface IMaterialRepository {
  findByProject(projectId: UUID, ctx: RepositoryContext, filter?: import("@/lib/data/entities").MaterialFilter): Promise<import("@/lib/data/entities").Material[]>;
}

export interface IEquipmentRepository {
  findByProject(projectId: UUID, ctx: RepositoryContext, filter?: import("@/lib/data/entities").EquipmentFilter): Promise<import("@/lib/data/entities").Equipment[]>;
}

export interface IManpowerRepository {
  findByProject(projectId: UUID, ctx: RepositoryContext, filter?: import("@/lib/data/entities").ManpowerFilter): Promise<import("@/lib/data/entities").Manpower[]>;
  getLatestSummary(projectId: UUID, ctx: RepositoryContext): Promise<import("@/lib/data/entities").ManpowerSummary[]>;
}

export interface IProcurementRepository {
  findByProject(projectId: UUID, ctx: RepositoryContext, filter?: import("@/lib/data/entities").ProcurementFilter): Promise<import("@/lib/data/entities").Procurement[]>;
  getRiskSummary(projectId: UUID, ctx: RepositoryContext): Promise<import("@/lib/data/entities").ProcurementRiskSummary[]>;
}

export interface IRiskRepository {
  findByProject(projectId: UUID, ctx: RepositoryContext, filter?: import("@/lib/data/entities").RiskFilter): Promise<import("@/lib/data/entities").Risk[]>;
}

export interface IMeetingRepository {
  findByProject(projectId: UUID, ctx: RepositoryContext, filter?: import("@/lib/data/entities").MeetingFilter): Promise<import("@/lib/data/entities").Meeting[]>;
}

export interface ITaskRepository {
  findByProject(projectId: UUID, ctx: RepositoryContext, filter?: import("@/lib/data/entities").TaskFilter): Promise<import("@/lib/data/entities").Task[]>;
}

export interface IScheduleRepository {
  findActiveByProject(projectId: UUID, ctx: RepositoryContext): Promise<import("@/lib/data/entities").Schedule | null>;
  findActivities(scheduleId: UUID, ctx: RepositoryContext, filter?: import("@/lib/data/entities").ScheduleActivityFilter): Promise<import("@/lib/data/entities").ScheduleActivity[]>;
  getCriticalActivities(projectId: UUID, ctx: RepositoryContext): Promise<import("@/lib/data/entities").ScheduleSlippageSummary[]>;
}

export interface INotificationRepository {
  findByUser(userId: UUID, ctx: RepositoryContext, filter?: import("@/lib/data/entities").NotificationFilter): Promise<import("@/lib/data/entities").Notification[]>;
  markRead(id: UUID, ctx: RepositoryContext): Promise<void>;
}

export interface IAiConversationRepository {
  findById(id: UUID, ctx: RepositoryContext): Promise<import("@/lib/data/entities").AiConversationWithMessages | null>;
  findMany(ctx: RepositoryContext, filter?: import("@/lib/data/entities").AiConversationFilter): Promise<import("@/lib/data/entities").AiConversation[]>;
  create(input: import("@/lib/data/entities").CreateAiConversationInput, ctx: RepositoryContext): Promise<import("@/lib/data/entities").AiConversation>;
  addMessage(input: import("@/lib/data/entities").CreateAiMessageInput, ctx: RepositoryContext): Promise<import("@/lib/data/entities").AiMessage>;
  update(id: UUID, input: Partial<Pick<import("@/lib/data/entities").AiConversation, "title" | "pinned">>, ctx: RepositoryContext): Promise<import("@/lib/data/entities").AiConversation>;
}

export interface IContractRepository {
  findByProject(projectId: UUID, ctx: RepositoryContext): Promise<import("@/lib/data/entities").Contract[]>;
}

/** Aggregated project data bundle for AI and reporting services. */
export interface IProjectDataService {
  getProjectBundle(projectId: UUID, ctx: RepositoryContext): Promise<import("@/lib/data/entities").AiProjectContextBundle & {
    project: import("@/lib/data/entities").Project;
    risks: import("@/lib/data/entities").Risk[];
    meetings: import("@/lib/data/entities").Meeting[];
    dailyReports: import("@/lib/data/entities").DailyReport[];
  }>;
}

export interface IDataSource {
  readonly mode: "mock" | "supabase";
  companies: ICompanyRepository;
  users: IUserRepository;
  projects: IProjectRepository;
  contracts: IContractRepository;
  rfis: IRfiRepository;
  submittals: ISubmittalRepository;
  drawings: IDrawingRepository;
  documents: IDocumentRepository;
  dailyReports: IDailyReportRepository;
  materials: IMaterialRepository;
  equipment: IEquipmentRepository;
  manpower: IManpowerRepository;
  procurement: IProcurementRepository;
  risks: IRiskRepository;
  meetings: IMeetingRepository;
  tasks: ITaskRepository;
  schedules: IScheduleRepository;
  notifications: INotificationRepository;
  aiConversations: IAiConversationRepository;
  projectData: IProjectDataService;
}
