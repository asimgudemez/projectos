-- ProjectOS seed data
-- Run after 001_core_schema.sql
-- IDs align with src/lib/data/adapters/mock/fixtures/ids.ts

-- Company
INSERT INTO companies (id, name, slug, legal_name, country, primary_contact_email, subscription_tier, onboarded_at)
VALUES (
  '00000000-0000-4000-8000-000000000001',
  'Nexora Labs',
  'nexora-labs',
  'Nexora Labs Construction Technology LLC',
  'Saudi Arabia',
  'ops@nexoralabs.com',
  'enterprise',
  '2024-01-15T00:00:00Z'
) ON CONFLICT (id) DO NOTHING;

-- Users
INSERT INTO users (id, company_id, email, full_name, role, job_title) VALUES
  ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', 'khalid.alrashid@nexoralabs.com', 'Khalid Al-Rashid', 'project_director', 'Project Director'),
  ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000001', 'sarah.mitchell@nexoralabs.com', 'Sarah Mitchell', 'construction_manager', 'Construction Manager'),
  ('00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000001', 'omar.hassan@nexoralabs.com', 'Omar Hassan', 'engineer', 'Senior MEP Engineer'),
  ('00000000-0000-4000-8000-000000000107', '00000000-0000-4000-8000-000000000001', 'asim@nexoralabs.com', 'Asim Gudemez', 'owner', 'CEO')
ON CONFLICT (id) DO NOTHING;

-- Projects
INSERT INTO projects (
  id, company_id, code, name, client_name, country, status, health, health_score,
  risk_level, progress_pct, contract_value, current_phase, start_date, planned_finish_date,
  next_milestone, next_milestone_date, project_director_id, construction_manager_id, project_manager_id
) VALUES (
  '00000000-0000-4000-8000-000000000201',
  '00000000-0000-4000-8000-000000000001',
  'AMAALA-C',
  'AMAALA Block C',
  'Red Sea Global',
  'Saudi Arabia',
  'Active',
  'healthy',
  87,
  'Low',
  64,
  425000000,
  'MEP Rough-In',
  '2024-01-01',
  '2026-12-31',
  'MEP Rough-In Complete',
  '2026-07-18',
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-4000-8000-000000000102',
  '00000000-0000-4000-8000-000000000103'
) ON CONFLICT (id) DO NOTHING;

-- RFIs
INSERT INTO rfis (
  id, company_id, project_id, reference, subject, status, priority, discipline, area,
  responsible_engineer_id, consultant, submission_date, due_date, days_open, ai_summary
) VALUES (
  '00000000-0000-4000-8000-000000000501',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000201',
  'RFI-221',
  'Façade bracket load transfer',
  'Overdue',
  'Critical',
  'Façade',
  'Area A',
  '00000000-0000-4000-8000-000000000106',
  'Foster + Partners',
  '2026-06-24',
  '2026-07-01',
  9,
  '9 days overdue. Impacts Level 2 MEP routing.'
) ON CONFLICT (id) DO NOTHING;

-- See src/lib/data/adapters/mock/fixtures/seed-data.ts for full mock dataset
