/**
 * Hand-written Supabase database types.
 * Replace with `supabase gen types typescript` output after linking a project.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: DbCompany;
        Insert: Omit<DbCompany, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<DbCompany>;
      };
      users: {
        Row: DbUser;
        Insert: Omit<DbUser, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<DbUser>;
      };
      projects: {
        Row: DbProject;
        Insert: Omit<DbProject, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<DbProject>;
      };
      rfis: { Row: DbRfi; Insert: Partial<DbRfi> & Pick<DbRfi, "company_id" | "project_id" | "reference" | "subject" | "submission_date" | "due_date">; Update: Partial<DbRfi> };
      submittals: { Row: DbSubmittal; Insert: Partial<DbSubmittal> & Pick<DbSubmittal, "company_id" | "project_id" | "reference" | "title" | "submission_date" | "due_date">; Update: Partial<DbSubmittal> };
      drawings: { Row: DbDrawing; Insert: Partial<DbDrawing> & Pick<DbDrawing, "company_id" | "project_id" | "reference" | "title" | "drawing_type" | "discipline" | "submission_date" | "due_date">; Update: Partial<DbDrawing> };
      documents: { Row: DbDocument; Insert: Partial<DbDocument> & Pick<DbDocument, "company_id" | "project_id" | "name" | "file_name" | "mime_type" | "storage_path">; Update: Partial<DbDocument> };
      ai_conversations: { Row: DbAiConversation; Insert: Partial<DbAiConversation> & Pick<DbAiConversation, "company_id" | "user_id" | "title" | "scope">; Update: Partial<DbAiConversation> };
      ai_messages: { Row: DbAiMessage; Insert: Partial<DbAiMessage> & Pick<DbAiMessage, "conversation_id" | "company_id" | "role" | "content">; Update: Partial<DbAiMessage> };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type DbTimestamps = {
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type DbCompany = DbTimestamps & {
  id: string;
  name: string;
  slug: string;
  legal_name: string;
  country: string;
  timezone: string;
  currency: string;
  subscription_tier: string;
  logo_url: string | null;
  website: string | null;
  primary_contact_email: string;
  primary_contact_phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postal_code: string | null;
  is_active: boolean;
  onboarded_at: string | null;
};

export type DbUser = DbTimestamps & {
  id: string;
  company_id: string;
  email: string;
  full_name: string;
  role: string;
  job_title: string | null;
  phone: string | null;
  avatar_url: string | null;
  department: string | null;
  is_active: boolean;
  last_login_at: string | null;
  invited_at: string | null;
  auth_user_id: string | null;
  created_by_id: string | null;
  updated_by_id: string | null;
};

export type DbProject = DbTimestamps & {
  id: string;
  company_id: string;
  code: string;
  name: string;
  client_name: string;
  country: string;
  city: string | null;
  description: string | null;
  status: string;
  health: string;
  health_score: number;
  risk_level: string;
  progress_pct: number;
  contract_value: number;
  contract_currency: string;
  current_phase: string | null;
  start_date: string;
  planned_finish_date: string;
  actual_finish_date: string | null;
  next_milestone: string | null;
  next_milestone_date: string | null;
  is_delayed: boolean;
  project_director_id: string | null;
  construction_manager_id: string | null;
  project_manager_id: string | null;
  location_lat: number | null;
  location_lng: number | null;
  timezone: string | null;
  created_by_id: string | null;
  updated_by_id: string | null;
};

export type DbRfi = DbTimestamps & {
  id: string;
  company_id: string;
  project_id: string;
  reference: string;
  subject: string;
  description: string | null;
  status: string;
  priority: string;
  discipline: string | null;
  area: string | null;
  responsible_engineer_id: string | null;
  consultant: string | null;
  submitted_by_id: string | null;
  submission_date: string;
  due_date: string;
  response_date: string | null;
  days_open: number;
  revision: string;
  ai_summary: string | null;
  cost_impact: number | null;
  schedule_impact_days: number | null;
  linked_drawing_id: string | null;
  closed_at: string | null;
  created_by_id: string | null;
  updated_by_id: string | null;
};

export type DbSubmittal = DbTimestamps & {
  id: string;
  company_id: string;
  project_id: string;
  reference: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  discipline: string | null;
  spec_section: string | null;
  responsible_engineer_id: string | null;
  reviewer: string | null;
  submitted_by_id: string | null;
  submission_date: string;
  due_date: string;
  approval_date: string | null;
  revision: string;
  ai_summary: string | null;
  supplier: string | null;
  linked_procurement_id: string | null;
  document_id: string | null;
  created_by_id: string | null;
  updated_by_id: string | null;
};

export type DbDrawing = DbTimestamps & {
  id: string;
  company_id: string;
  project_id: string;
  reference: string;
  title: string;
  drawing_type: string;
  discipline: string;
  status: string;
  priority: string;
  area: string | null;
  level: string | null;
  grid: string | null;
  responsible_engineer_id: string | null;
  consultant: string | null;
  submission_date: string;
  due_date: string;
  approval_date: string | null;
  revision: string;
  previous_revision_id: string | null;
  ai_summary: string | null;
  document_id: string | null;
  sheet_count: number | null;
  created_by_id: string | null;
  updated_by_id: string | null;
};

export type DbDocument = DbTimestamps & {
  id: string;
  company_id: string;
  project_id: string;
  name: string;
  category: string;
  file_name: string;
  mime_type: string;
  file_size_bytes: number;
  storage_path: string;
  storage_bucket: string;
  version: number;
  previous_version_id: string | null;
  uploaded_by_id: string | null;
  uploaded_at: string;
  discipline: string | null;
  tags: string[];
  description: string | null;
  is_confidential: boolean;
  checksum: string | null;
  linked_entity_type: string | null;
  linked_entity_id: string | null;
  created_by_id: string | null;
  updated_by_id: string | null;
};

export type DbAiConversation = DbTimestamps & {
  id: string;
  company_id: string;
  user_id: string;
  project_id: string | null;
  scope: string;
  title: string;
  pinned: boolean;
  last_message_at: string | null;
  message_count: number;
  metadata: Json | null;
};

export type DbAiMessage = {
  id: string;
  conversation_id: string;
  company_id: string;
  role: string;
  content: string;
  references: Json;
  token_count: number | null;
  model: string | null;
  created_at: string;
};

export const TABLE_NAMES = {
  companies: "companies",
  users: "users",
  projects: "projects",
  projectMembers: "project_members",
  contracts: "contracts",
  rfis: "rfis",
  submittals: "submittals",
  drawings: "drawings",
  documents: "documents",
  dailyReports: "daily_reports",
  materials: "materials",
  equipment: "equipment",
  manpower: "manpower",
  procurement: "procurement",
  risks: "risks",
  meetings: "meetings",
  tasks: "tasks",
  schedules: "schedules",
  scheduleActivities: "schedule_activities",
  notifications: "notifications",
  aiConversations: "ai_conversations",
  aiMessages: "ai_messages",
} as const;
