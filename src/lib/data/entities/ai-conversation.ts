import type {
  AiConversationScope,
  AiMessageRole,
  CompanyScopedEntity,
  ISO8601,
  UUID,
} from "./common";

export type AiDataReference = {
  type: string;
  reference: string;
  label: string;
  detail: string;
  entityId?: UUID | null;
};

export type AiMessage = {
  id: UUID;
  conversationId: UUID;
  companyId: UUID;
  role: AiMessageRole;
  content: string;
  references: AiDataReference[];
  tokenCount?: number | null;
  model?: string | null;
  createdAt: ISO8601;
};

export type AiConversation = CompanyScopedEntity & {
  userId: UUID;
  projectId?: UUID | null;
  scope: AiConversationScope;
  title: string;
  pinned: boolean;
  lastMessageAt?: ISO8601 | null;
  messageCount: number;
  metadata?: Record<string, unknown> | null;
};

export type AiConversationWithMessages = AiConversation & {
  messages: AiMessage[];
};

export type CreateAiConversationInput = Pick<
  AiConversation,
  "userId" | "scope" | "title"
> &
  Partial<Pick<AiConversation, "projectId" | "pinned" | "metadata">>;

export type CreateAiMessageInput = Pick<
  AiMessage,
  "conversationId" | "role" | "content"
> &
  Partial<Pick<AiMessage, "references" | "tokenCount" | "model">>;

export type AiConversationFilter = {
  userId?: UUID;
  projectId?: UUID;
  scope?: AiConversationScope;
  pinned?: boolean;
};

export type AiProjectContextBundle = {
  projectId: UUID;
  rfis: { reference: string; status: string; title: string }[];
  submittals: { reference: string; status: string; title: string }[];
  drawings: { reference: string; status: string; title: string }[];
  risks: { reference: string; level: string; title: string }[];
  materials: { code: string; status: string; name: string }[];
  manpower: { trade: string; planned: number; actual: number }[];
  procurement: { poNumber: string; status: string; supplier: string }[];
  tasks: { reference: string; status: string; title: string }[];
};
