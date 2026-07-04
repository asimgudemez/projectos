-- ProjectOS Core Schema
-- Multi-tenant construction operating system
-- Every record belongs to a company; project-scoped records also reference project_id

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE subscription_tier AS ENUM ('trial', 'professional', 'enterprise');
CREATE TYPE user_role AS ENUM (
  'owner', 'admin', 'project_director', 'construction_manager', 'project_manager',
  'engineer', 'procurement', 'commercial', 'qa_qc', 'hse', 'viewer'
);
CREATE TYPE project_member_role AS ENUM (
  'director', 'manager', 'engineer', 'supervisor', 'commercial',
  'procurement', 'qa_qc', 'hse', 'viewer'
);
CREATE TYPE project_lifecycle_status AS ENUM (
  'Planning', 'Mobilizing', 'Active', 'Delayed', 'On Hold', 'Completed', 'Cancelled'
);
CREATE TYPE health_status AS ENUM ('healthy', 'at-risk', 'critical');
CREATE TYPE risk_level AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE priority_level AS ENUM ('Critical', 'High', 'Medium', 'Low');
CREATE TYPE approval_status AS ENUM (
  'Draft', 'Open', 'Under Review', 'Approved', 'Rejected', 'Overdue', 'Closed'
);
CREATE TYPE contract_type AS ENUM ('main', 'subcontract', 'consultancy', 'supply', 'variation', 'nda');
CREATE TYPE contract_status AS ENUM ('draft', 'under_review', 'signed', 'active', 'completed', 'terminated');
CREATE TYPE drawing_type AS ENUM ('ifc', 'shop', 'red_mark', 'as_built', 'revision_history', 'coordination', 'other');
CREATE TYPE document_category AS ENUM (
  'drawing', 'specification', 'report', 'contract', 'correspondence',
  'method_statement', 'itp', 'commercial', 'other'
);
CREATE TYPE submittal_type AS ENUM ('material', 'shop_drawing', 'method_statement', 'itp', 'sample', 'other');
CREATE TYPE material_status AS ENUM ('planned', 'ordered', 'in_transit', 'on_site', 'installed', 'delayed', 'critical');
CREATE TYPE equipment_status AS ENUM ('active', 'idle', 'maintenance', 'offline', 'decommissioned');
CREATE TYPE procurement_status AS ENUM (
  'draft', 'rfq_issued', 'quotation_received', 'po_issued',
  'in_transit', 'delivered', 'delayed', 'cancelled'
);
CREATE TYPE risk_category AS ENUM (
  'schedule', 'cost', 'quality', 'safety', 'design',
  'procurement', 'interface', 'regulatory', 'other'
);
CREATE TYPE risk_status AS ENUM ('open', 'mitigating', 'monitoring', 'closed');
CREATE TYPE meeting_type AS ENUM ('coordination', 'progress', 'safety', 'design', 'commercial', 'client', 'other');
CREATE TYPE meeting_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed');
CREATE TYPE task_status AS ENUM ('backlog', 'todo', 'in_progress', 'blocked', 'done', 'cancelled');
CREATE TYPE schedule_activity_status AS ENUM ('not_started', 'in_progress', 'completed', 'delayed', 'on_hold');
CREATE TYPE notification_channel AS ENUM ('in_app', 'email', 'push', 'sms');
CREATE TYPE notification_type AS ENUM (
  'rfi_overdue', 'submittal_pending', 'task_assigned', 'risk_escalated',
  'meeting_reminder', 'document_uploaded', 'schedule_slippage',
  'procurement_delay', 'ai_insight', 'system'
);
CREATE TYPE ai_conversation_scope AS ENUM ('portfolio', 'project');
CREATE TYPE ai_message_role AS ENUM ('user', 'assistant', 'system');
CREATE TYPE daily_report_weather AS ENUM ('clear', 'cloudy', 'rain', 'sandstorm', 'extreme_heat');
CREATE TYPE currency_code AS ENUM ('SAR', 'AED', 'USD', 'EUR', 'GBP');

-- =============================================================================
-- AUDIT HELPER
-- =============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- COMPANIES (tenant root)
-- =============================================================================

CREATE TABLE companies (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            CITEXT NOT NULL UNIQUE,
  legal_name      TEXT NOT NULL,
  country         TEXT NOT NULL DEFAULT 'Saudi Arabia',
  timezone        TEXT NOT NULL DEFAULT 'Asia/Riyadh',
  currency        currency_code NOT NULL DEFAULT 'SAR',
  subscription_tier subscription_tier NOT NULL DEFAULT 'professional',
  logo_url        TEXT,
  website         TEXT,
  primary_contact_email CITEXT NOT NULL,
  primary_contact_phone TEXT,
  address_line1   TEXT,
  address_line2   TEXT,
  city            TEXT,
  postal_code     TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  onboarded_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE TRIGGER companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- USERS
-- =============================================================================

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email           CITEXT NOT NULL,
  full_name       TEXT NOT NULL,
  role            user_role NOT NULL DEFAULT 'viewer',
  job_title       TEXT,
  phone           TEXT,
  avatar_url      TEXT,
  department      TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at   TIMESTAMPTZ,
  invited_at      TIMESTAMPTZ,
  auth_user_id    UUID UNIQUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_id   UUID REFERENCES users(id),
  updated_by_id   UUID REFERENCES users(id),
  deleted_at      TIMESTAMPTZ,
  UNIQUE (company_id, email)
);

CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_users_auth ON users(auth_user_id);

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- PROJECTS
-- =============================================================================

CREATE TABLE projects (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id              UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  code                    TEXT NOT NULL,
  name                    TEXT NOT NULL,
  client_name             TEXT NOT NULL,
  country                 TEXT NOT NULL,
  city                    TEXT,
  description             TEXT,
  status                  project_lifecycle_status NOT NULL DEFAULT 'Planning',
  health                  health_status NOT NULL DEFAULT 'healthy',
  health_score            SMALLINT NOT NULL DEFAULT 100 CHECK (health_score BETWEEN 0 AND 100),
  risk_level              risk_level NOT NULL DEFAULT 'Low',
  progress_pct            SMALLINT NOT NULL DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  contract_value          NUMERIC(18, 2) NOT NULL DEFAULT 0,
  contract_currency       currency_code NOT NULL DEFAULT 'SAR',
  current_phase           TEXT,
  start_date              DATE NOT NULL,
  planned_finish_date     DATE NOT NULL,
  actual_finish_date      DATE,
  next_milestone          TEXT,
  next_milestone_date     DATE,
  is_delayed              BOOLEAN NOT NULL DEFAULT FALSE,
  project_director_id     UUID REFERENCES users(id),
  construction_manager_id UUID REFERENCES users(id),
  project_manager_id      UUID REFERENCES users(id),
  location_lat            DOUBLE PRECISION,
  location_lng            DOUBLE PRECISION,
  timezone                TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_id           UUID REFERENCES users(id),
  updated_by_id           UUID REFERENCES users(id),
  deleted_at              TIMESTAMPTZ,
  UNIQUE (company_id, code)
);

CREATE INDEX idx_projects_company ON projects(company_id);
CREATE INDEX idx_projects_status ON projects(company_id, status);
CREATE INDEX idx_projects_health ON projects(company_id, health);

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE project_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role            project_member_role NOT NULL DEFAULT 'viewer',
  is_primary      BOOLEAN NOT NULL DEFAULT FALSE,
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  UNIQUE (project_id, user_id)
);

CREATE INDEX idx_project_members_project ON project_members(project_id);

-- =============================================================================
-- CONTRACTS
-- =============================================================================

CREATE TABLE contracts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  contract_number     TEXT NOT NULL,
  title               TEXT NOT NULL,
  type                contract_type NOT NULL,
  status              contract_status NOT NULL DEFAULT 'draft',
  value               NUMERIC(18, 2) NOT NULL DEFAULT 0,
  currency            currency_code NOT NULL DEFAULT 'SAR',
  counterparty        TEXT NOT NULL,
  counterparty_contact TEXT,
  start_date          DATE NOT NULL,
  end_date            DATE NOT NULL,
  signed_date         DATE,
  scope_summary       TEXT,
  retention_pct       NUMERIC(5, 2),
  payment_terms_days  SMALLINT,
  parent_contract_id  UUID REFERENCES contracts(id),
  document_id         UUID,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_id       UUID REFERENCES users(id),
  updated_by_id       UUID REFERENCES users(id),
  deleted_at          TIMESTAMPTZ,
  UNIQUE (project_id, contract_number)
);

CREATE INDEX idx_contracts_project ON contracts(project_id);

-- =============================================================================
-- ENGINEERING: RFIs, SUBMITTALS, DRAWINGS
-- =============================================================================

CREATE TABLE rfis (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id              UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id              UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  reference               TEXT NOT NULL,
  subject                 TEXT NOT NULL,
  description             TEXT,
  status                  approval_status NOT NULL DEFAULT 'Open',
  priority                priority_level NOT NULL DEFAULT 'Medium',
  discipline              TEXT,
  area                    TEXT,
  responsible_engineer_id UUID REFERENCES users(id),
  consultant              TEXT,
  submitted_by_id         UUID REFERENCES users(id),
  submission_date         DATE NOT NULL,
  due_date                DATE NOT NULL,
  response_date           DATE,
  days_open               SMALLINT NOT NULL DEFAULT 0,
  revision                TEXT NOT NULL DEFAULT '—',
  ai_summary              TEXT,
  cost_impact             NUMERIC(18, 2),
  schedule_impact_days    SMALLINT,
  linked_drawing_id       UUID,
  closed_at               TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_id           UUID REFERENCES users(id),
  updated_by_id           UUID REFERENCES users(id),
  deleted_at              TIMESTAMPTZ,
  UNIQUE (project_id, reference)
);

CREATE INDEX idx_rfis_project_status ON rfis(project_id, status);
CREATE INDEX idx_rfis_due ON rfis(project_id, due_date);

CREATE TABLE submittals (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id              UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id              UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  reference               TEXT NOT NULL,
  title                   TEXT NOT NULL,
  type                    submittal_type NOT NULL DEFAULT 'material',
  status                  approval_status NOT NULL DEFAULT 'Open',
  priority                priority_level NOT NULL DEFAULT 'Medium',
  discipline              TEXT,
  spec_section            TEXT,
  responsible_engineer_id UUID REFERENCES users(id),
  reviewer                TEXT,
  submitted_by_id         UUID REFERENCES users(id),
  submission_date         DATE NOT NULL,
  due_date                DATE NOT NULL,
  approval_date           DATE,
  revision                TEXT NOT NULL DEFAULT 'Rev A',
  ai_summary              TEXT,
  supplier                TEXT,
  linked_procurement_id   UUID,
  document_id             UUID,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_id           UUID REFERENCES users(id),
  updated_by_id           UUID REFERENCES users(id),
  deleted_at              TIMESTAMPTZ,
  UNIQUE (project_id, reference)
);

CREATE INDEX idx_submittals_project ON submittals(project_id, status);

CREATE TABLE drawings (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id              UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id              UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  reference               TEXT NOT NULL,
  title                   TEXT NOT NULL,
  drawing_type            drawing_type NOT NULL,
  discipline              TEXT NOT NULL,
  status                  approval_status NOT NULL DEFAULT 'Open',
  priority                priority_level NOT NULL DEFAULT 'Medium',
  area                    TEXT,
  level                   TEXT,
  grid                    TEXT,
  responsible_engineer_id UUID REFERENCES users(id),
  consultant              TEXT,
  submission_date         DATE NOT NULL,
  due_date                DATE NOT NULL,
  approval_date           DATE,
  revision                TEXT NOT NULL DEFAULT 'Rev A',
  previous_revision_id    UUID REFERENCES drawings(id),
  ai_summary              TEXT,
  document_id             UUID,
  sheet_count             SMALLINT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_id           UUID REFERENCES users(id),
  updated_by_id           UUID REFERENCES users(id),
  deleted_at              TIMESTAMPTZ,
  UNIQUE (project_id, reference, revision)
);

CREATE INDEX idx_drawings_project ON drawings(project_id, drawing_type);

-- =============================================================================
-- DOCUMENTS
-- =============================================================================

CREATE TABLE documents (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  category            document_category NOT NULL DEFAULT 'other',
  file_name           TEXT NOT NULL,
  mime_type           TEXT NOT NULL,
  file_size_bytes     BIGINT NOT NULL DEFAULT 0,
  storage_path        TEXT NOT NULL,
  storage_bucket      TEXT NOT NULL DEFAULT 'project-documents',
  version             INTEGER NOT NULL DEFAULT 1,
  previous_version_id UUID REFERENCES documents(id),
  uploaded_by_id      UUID REFERENCES users(id),
  uploaded_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  discipline          TEXT,
  tags                TEXT[] NOT NULL DEFAULT '{}',
  description         TEXT,
  is_confidential     BOOLEAN NOT NULL DEFAULT FALSE,
  checksum            TEXT,
  linked_entity_type  TEXT,
  linked_entity_id    UUID,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_id       UUID REFERENCES users(id),
  updated_by_id       UUID REFERENCES users(id),
  deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_documents_project ON documents(project_id, category);
CREATE INDEX idx_documents_tags ON documents USING GIN(tags);

-- =============================================================================
-- CONSTRUCTION: DAILY REPORTS, MATERIALS, EQUIPMENT, MANPOWER
-- =============================================================================

CREATE TABLE daily_reports (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  report_date         DATE NOT NULL,
  report_number       TEXT NOT NULL,
  prepared_by_id      UUID REFERENCES users(id),
  approved_by_id      UUID REFERENCES users(id),
  weather             daily_report_weather NOT NULL DEFAULT 'clear',
  temperature_high_c  SMALLINT,
  temperature_low_c   SMALLINT,
  workforce_count     INTEGER NOT NULL DEFAULT 0,
  work_hours          NUMERIC(8, 2) NOT NULL DEFAULT 0,
  progress_summary    TEXT NOT NULL,
  issues_summary      TEXT,
  safety_summary      TEXT,
  quality_summary     TEXT,
  visitors            TEXT,
  equipment_on_site   TEXT,
  submitted_at        TIMESTAMPTZ,
  approved_at         TIMESTAMPTZ,
  ai_summary          TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_id       UUID REFERENCES users(id),
  updated_by_id       UUID REFERENCES users(id),
  deleted_at          TIMESTAMPTZ,
  UNIQUE (project_id, report_date)
);

CREATE TABLE materials (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id              UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id              UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  code                    TEXT NOT NULL,
  name                    TEXT NOT NULL,
  status                  material_status NOT NULL DEFAULT 'planned',
  category                TEXT,
  spec_section            TEXT,
  quantity                NUMERIC(18, 4) NOT NULL DEFAULT 0,
  unit                    TEXT NOT NULL,
  supplier                TEXT,
  po_number               TEXT,
  procurement_id          UUID,
  required_on_site_date   DATE NOT NULL,
  expected_delivery_date  DATE,
  actual_delivery_date    DATE,
  location                TEXT,
  cost                    NUMERIC(18, 2),
  currency                currency_code,
  detail                  TEXT,
  linked_submittal_id     UUID REFERENCES submittals(id),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_id           UUID REFERENCES users(id),
  updated_by_id           UUID REFERENCES users(id),
  deleted_at              TIMESTAMPTZ,
  UNIQUE (project_id, code)
);

CREATE TABLE equipment (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id              UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id              UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  asset_tag               TEXT NOT NULL,
  name                    TEXT NOT NULL,
  category                TEXT NOT NULL,
  status                  equipment_status NOT NULL DEFAULT 'active',
  manufacturer            TEXT,
  model                   TEXT,
  serial_number           TEXT,
  location                TEXT,
  operator_id             UUID REFERENCES users(id),
  utilization_pct         SMALLINT CHECK (utilization_pct BETWEEN 0 AND 100),
  last_inspection_date    DATE,
  next_inspection_date    DATE,
  maintenance_due_date    DATE,
  detail                  TEXT,
  daily_rate              NUMERIC(18, 2),
  currency                currency_code,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_id           UUID REFERENCES users(id),
  updated_by_id           UUID REFERENCES users(id),
  deleted_at              TIMESTAMPTZ,
  UNIQUE (project_id, asset_tag)
);

CREATE TABLE manpower (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  trade               TEXT NOT NULL,
  subcontractor       TEXT,
  planned_headcount   INTEGER NOT NULL DEFAULT 0,
  actual_headcount    INTEGER NOT NULL DEFAULT 0,
  unit                TEXT NOT NULL DEFAULT 'workers',
  shift               TEXT,
  report_date         DATE NOT NULL,
  supervisor_id       UUID REFERENCES users(id),
  location            TEXT,
  notes               TEXT,
  variance_pct        NUMERIC(6, 2) NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_id       UUID REFERENCES users(id),
  updated_by_id       UUID REFERENCES users(id),
  deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_manpower_project_date ON manpower(project_id, report_date);

-- =============================================================================
-- PROCUREMENT
-- =============================================================================

CREATE TABLE procurement (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id              UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id              UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  po_number               TEXT NOT NULL,
  title                   TEXT NOT NULL,
  status                  procurement_status NOT NULL DEFAULT 'draft',
  priority                priority_level NOT NULL DEFAULT 'Medium',
  supplier                TEXT NOT NULL,
  supplier_contact        TEXT,
  category                TEXT NOT NULL,
  description             TEXT,
  value                   NUMERIC(18, 2) NOT NULL DEFAULT 0,
  currency                currency_code NOT NULL DEFAULT 'SAR',
  issued_date             DATE,
  required_delivery_date  DATE NOT NULL,
  expected_delivery_date  DATE,
  actual_delivery_date    DATE,
  lead_time_days          SMALLINT,
  delay_days              SMALLINT NOT NULL DEFAULT 0,
  buyer_id                UUID REFERENCES users(id),
  linked_material_id      UUID REFERENCES materials(id),
  linked_submittal_id     UUID REFERENCES submittals(id),
  risk_notes              TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_id           UUID REFERENCES users(id),
  updated_by_id           UUID REFERENCES users(id),
  deleted_at              TIMESTAMPTZ,
  UNIQUE (project_id, po_number)
);

CREATE INDEX idx_procurement_project ON procurement(project_id, status);

-- Add deferred FKs after materials/procurement exist
ALTER TABLE materials
  ADD CONSTRAINT fk_materials_procurement
  FOREIGN KEY (procurement_id) REFERENCES procurement(id);

ALTER TABLE submittals
  ADD CONSTRAINT fk_submittals_procurement
  FOREIGN KEY (linked_procurement_id) REFERENCES procurement(id);

ALTER TABLE rfis
  ADD CONSTRAINT fk_rfis_drawing
  FOREIGN KEY (linked_drawing_id) REFERENCES drawings(id);

ALTER TABLE contracts
  ADD CONSTRAINT fk_contracts_document
  FOREIGN KEY (document_id) REFERENCES documents(id);

ALTER TABLE submittals
  ADD CONSTRAINT fk_submittals_document
  FOREIGN KEY (document_id) REFERENCES documents(id);

ALTER TABLE drawings
  ADD CONSTRAINT fk_drawings_document
  FOREIGN KEY (document_id) REFERENCES documents(id);

-- =============================================================================
-- RISKS, MEETINGS, TASKS, SCHEDULES
-- =============================================================================

CREATE TABLE risks (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id              UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id              UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  reference               TEXT NOT NULL,
  title                   TEXT NOT NULL,
  description             TEXT,
  category                risk_category NOT NULL,
  status                  risk_status NOT NULL DEFAULT 'open',
  level                   risk_level NOT NULL DEFAULT 'Medium',
  priority                priority_level NOT NULL DEFAULT 'Medium',
  owner_id                UUID REFERENCES users(id),
  identified_date         DATE NOT NULL,
  target_close_date       DATE,
  closed_date             DATE,
  probability_pct         SMALLINT NOT NULL DEFAULT 50 CHECK (probability_pct BETWEEN 0 AND 100),
  impact_score            SMALLINT NOT NULL DEFAULT 3 CHECK (impact_score BETWEEN 1 AND 5),
  exposure_score          NUMERIC(6, 2) GENERATED ALWAYS AS (probability_pct * impact_score / 100.0) STORED,
  mitigation_plan         TEXT,
  contingency_plan        TEXT,
  cost_exposure           NUMERIC(18, 2),
  schedule_exposure_days  SMALLINT,
  linked_rfi_id           UUID REFERENCES rfis(id),
  linked_task_id          UUID,
  ai_summary              TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_id           UUID REFERENCES users(id),
  updated_by_id           UUID REFERENCES users(id),
  deleted_at              TIMESTAMPTZ,
  UNIQUE (project_id, reference)
);

CREATE TABLE meetings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  type                meeting_type NOT NULL DEFAULT 'coordination',
  status              meeting_status NOT NULL DEFAULT 'scheduled',
  scheduled_start     TIMESTAMPTZ NOT NULL,
  scheduled_end       TIMESTAMPTZ NOT NULL,
  location            TEXT,
  virtual_link        TEXT,
  organizer_id        UUID REFERENCES users(id),
  attendee_ids        UUID[] NOT NULL DEFAULT '{}',
  agenda              TEXT,
  minutes             TEXT,
  action_items        TEXT,
  linked_task_ids     UUID[] NOT NULL DEFAULT '{}',
  ai_summary          TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_id       UUID REFERENCES users(id),
  updated_by_id       UUID REFERENCES users(id),
  deleted_at          TIMESTAMPTZ
);

CREATE TABLE tasks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  reference           TEXT NOT NULL,
  title               TEXT NOT NULL,
  description         TEXT,
  status              task_status NOT NULL DEFAULT 'todo',
  priority            priority_level NOT NULL DEFAULT 'Medium',
  assignee_id         UUID REFERENCES users(id),
  reporter_id         UUID REFERENCES users(id),
  due_date            DATE,
  completed_at        TIMESTAMPTZ,
  module              TEXT,
  linked_entity_type  TEXT,
  linked_entity_id    UUID,
  tags                TEXT[] NOT NULL DEFAULT '{}',
  estimated_hours     NUMERIC(8, 2),
  actual_hours        NUMERIC(8, 2),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_id       UUID REFERENCES users(id),
  updated_by_id       UUID REFERENCES users(id),
  deleted_at          TIMESTAMPTZ,
  UNIQUE (project_id, reference)
);

ALTER TABLE risks
  ADD CONSTRAINT fk_risks_task
  FOREIGN KEY (linked_task_id) REFERENCES tasks(id);

CREATE TABLE schedules (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id                  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id                  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name                        TEXT NOT NULL,
  version                     TEXT NOT NULL,
  baseline_date               DATE NOT NULL,
  data_date                   DATE NOT NULL,
  is_active                   BOOLEAN NOT NULL DEFAULT TRUE,
  total_activities            INTEGER NOT NULL DEFAULT 0,
  critical_path_length_days   INTEGER NOT NULL DEFAULT 0,
  description                 TEXT,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_id               UUID REFERENCES users(id),
  updated_by_id               UUID REFERENCES users(id),
  deleted_at                  TIMESTAMPTZ,
  UNIQUE (project_id, version)
);

CREATE TABLE schedule_activities (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  schedule_id         UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  activity_code       TEXT NOT NULL,
  name                TEXT NOT NULL,
  status              schedule_activity_status NOT NULL DEFAULT 'not_started',
  wbs_code            TEXT,
  planned_start       DATE NOT NULL,
  planned_finish      DATE NOT NULL,
  actual_start        DATE,
  actual_finish       DATE,
  duration_days       INTEGER NOT NULL DEFAULT 0,
  float_days          INTEGER NOT NULL DEFAULT 0,
  is_critical         BOOLEAN NOT NULL DEFAULT FALSE,
  percent_complete    SMALLINT NOT NULL DEFAULT 0 CHECK (percent_complete BETWEEN 0 AND 100),
  predecessor_ids     UUID[] NOT NULL DEFAULT '{}',
  responsible_id      UUID REFERENCES users(id),
  discipline          TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_id       UUID REFERENCES users(id),
  updated_by_id       UUID REFERENCES users(id),
  deleted_at          TIMESTAMPTZ,
  UNIQUE (schedule_id, activity_code)
);

CREATE INDEX idx_schedule_activities_critical ON schedule_activities(schedule_id, is_critical);

-- =============================================================================
-- NOTIFICATIONS
-- =============================================================================

CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type            notification_type NOT NULL,
  channel         notification_channel NOT NULL DEFAULT 'in_app',
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  action_url      TEXT,
  entity_type     TEXT,
  entity_id       UUID,
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  read_at         TIMESTAMPTZ,
  sent_at         TIMESTAMPTZ,
  priority        TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  metadata        JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- =============================================================================
-- AI CONVERSATIONS
-- =============================================================================

CREATE TABLE ai_conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
  scope           ai_conversation_scope NOT NULL DEFAULT 'project',
  title           TEXT NOT NULL,
  pinned          BOOLEAN NOT NULL DEFAULT FALSE,
  last_message_at TIMESTAMPTZ,
  message_count   INTEGER NOT NULL DEFAULT 0,
  metadata        JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id, pinned, updated_at DESC);

CREATE TABLE ai_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role            ai_message_role NOT NULL,
  content         TEXT NOT NULL,
  references      JSONB NOT NULL DEFAULT '[]',
  token_count     INTEGER,
  model           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_messages_conversation ON ai_messages(conversation_id, created_at);

-- =============================================================================
-- ROW LEVEL SECURITY (enable; policies applied per deployment)
-- =============================================================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE submittals ENABLE ROW LEVEL SECURITY;
ALTER TABLE drawings ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE manpower ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- Example tenant isolation policy (enable after Supabase Auth integration):
-- CREATE POLICY tenant_isolation ON projects
--   USING (company_id = (SELECT company_id FROM users WHERE auth_user_id = auth.uid()));
