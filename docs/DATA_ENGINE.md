# ProjectOS Data Engine

Enterprise multi-tenant data architecture for Supabase PostgreSQL.

## Architecture

```
src/lib/data/
├── entities/          # Domain models (camelCase TypeScript)
├── database/          # Supabase row types + mappers (snake_case ↔ camelCase)
├── repositories/      # Repository interfaces (contracts)
├── adapters/
│   ├── mock/          # In-memory adapter (current default)
│   └── supabase/      # Supabase client stub (integration sprint)
├── data-source.ts     # Factory: mock | supabase
└── index.ts           # Public API: data.withContext()
```

## Multi-Tenancy

Every record belongs to a **company** (`company_id`). Project-scoped records also reference `project_id`.

```
Company
  ├── Users
  ├── Projects
  │     ├── Contracts, RFIs, Submittals, Drawings, Documents
  │     ├── Daily Reports, Materials, Equipment, Manpower
  │     ├── Procurement, Risks, Meetings, Tasks, Schedules
  │     └── AI Conversations (optional project scope)
  └── Notifications
```

## Entities (19)

| Entity | Scope | Key relationships |
|--------|-------|-------------------|
| Companies | Root tenant | — |
| Users | Company | `company_id`, optional `auth_user_id` |
| Projects | Company | Directors/managers → users |
| Contracts | Project | Optional parent contract, document |
| RFIs | Project | Engineer, drawing link |
| Submittals | Project | Procurement, document |
| Drawings | Project | Revision chain, document |
| Documents | Project | Storage path, version chain |
| Daily Reports | Project | Prepared/approved by users |
| Materials | Project | Procurement, submittal links |
| Equipment | Project | Operator user |
| Manpower | Project | Daily headcount snapshots |
| Procurement | Project | Material/submittal links |
| Risks | Project | RFI/task links |
| Meetings | Project | Attendees, linked tasks |
| Tasks | Project | Assignee, linked entities |
| Schedules | Project | Schedule activities |
| Notifications | Company/User | Optional project |
| AI Conversations | Company/User | Messages normalized |

## Usage

```typescript
import { data, resolveProjectId } from "@/lib/data";

const { projects, rfis, projectData, context } = data.withContext();

const project = await projects.findById(resolveProjectId("amaala"), context);
const openRfis = await rfis.findByProject(project!.id, context, { overdue: true });
const bundle = await projectData.getProjectBundle(project!.id, context);
```

## Supabase Setup

1. Copy `.env.example` → `.env.local`
2. Run migrations: `supabase db push` or apply `supabase/migrations/001_core_schema.sql`
3. Seed: `supabase db seed` or run `supabase/seed.sql`
4. Generate types: `supabase gen types typescript --local > src/lib/data/database/generated.types.ts`
5. Implement Supabase repositories in `adapters/supabase/`
6. Set `PROJECTOS_DATA_SOURCE=supabase`

## Migration from Mock UI Data

Existing `src/lib/*-data.ts` files remain for UI compatibility. Future sprints should migrate UI to `data.withContext()` repositories. Legacy project slugs (`amaala`) map to UUIDs via `resolveProjectId()`.

## Row Level Security

RLS is enabled on all tables. Apply tenant policies after Supabase Auth integration:

```sql
CREATE POLICY tenant_isolation ON projects
  USING (company_id = (SELECT company_id FROM users WHERE auth_user_id = auth.uid()));
```
