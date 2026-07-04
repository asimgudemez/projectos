/**
 * Entity relationship map for documentation and query planning.
 */

export const ENTITY_RELATIONSHIPS = {
  companies: {
    hasMany: ["users", "projects", "notifications", "ai_conversations"],
  },
  users: {
    belongsTo: ["companies"],
    hasMany: ["project_members", "notifications", "ai_conversations", "tasks"],
  },
  projects: {
    belongsTo: ["companies"],
    hasMany: [
      "project_members",
      "contracts",
      "rfis",
      "submittals",
      "drawings",
      "documents",
      "daily_reports",
      "materials",
      "equipment",
      "manpower",
      "procurement",
      "risks",
      "meetings",
      "tasks",
      "schedules",
      "ai_conversations",
    ],
  },
  schedules: {
    belongsTo: ["projects", "companies"],
    hasMany: ["schedule_activities"],
  },
  ai_conversations: {
    belongsTo: ["companies", "users", "projects"],
    hasMany: ["ai_messages"],
  },
  rfis: {
    belongsTo: ["projects", "companies", "users", "drawings"],
  },
  submittals: {
    belongsTo: ["projects", "companies", "procurement", "documents"],
  },
  drawings: {
    belongsTo: ["projects", "companies", "drawings"],
    hasMany: ["rfis"],
  },
  materials: {
    belongsTo: ["projects", "companies", "procurement", "submittals"],
  },
  procurement: {
    belongsTo: ["projects", "companies"],
    hasMany: ["materials", "submittals"],
  },
} as const;

export type EntityName = keyof typeof ENTITY_RELATIONSHIPS;
