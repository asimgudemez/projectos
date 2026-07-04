# Excel Import Engine

Import JCDC Technical Deliverables Master Log workbooks into ProjectOS.

## Route

`/projects/[projectId]/import`

## Supported sheets

| Excel Sheet | ProjectOS Module |
|-------------|-------------------|
| RFI LOG | RFIs |
| SD Log / SD MAT-MBL Log | Shop Drawings |
| MS LOG / MS T&C Log | Method Statements |
| ITP LOG | ITPs |
| MIR LOG | Material Inspections |
| LETTER LOG | Letters (documents) |
| Material Awaited-HQ / Material Follow-up Log | Materials |
| Follow-up Tracker | Tasks / Actions |
| MR&TBE | Submittals |
| PLANS LOG | Plans (drawings) |
| DC LOG | Design Changes (tasks) |
| Summary | Metadata only |

## Architecture

```
src/lib/import/
├── types.ts           # Import domain types
├── sheet-registry.ts  # Sheet name → module mapping
├── header-utils.ts    # Flexible column detection
├── excel-parser.ts    # xlsx parsing
├── normalizers.ts     # Row → ProjectOS format
├── import-insights.ts # AI insights + summary
├── import-store.ts    # Mock store + localStorage + Supabase payloads
└── import-service.ts  # Orchestration
```

## Flow

1. Upload `.xlsx` file
2. Auto-detect sheets and header rows
3. Preview mappings and row counts
4. Normalize records into ProjectOS entity shape
5. Persist to mock data store + localStorage
6. Build Supabase insert payloads (not executed yet)
7. Show summary + AI insights

## Usage

```typescript
import { executeExcelImport } from "@/lib/import";

const result = await executeExcelImport(file, "amaala");
console.log(result.batch.summary);
console.log(result.supabaseInserts); // ready for future DB insert
```

## Expected file

`JCDC - Technical Deliverables - Master Log - 01-07-2026.xlsx`

Column headers are matched flexibly (Ref, Status, Title, Due Date, etc.).
