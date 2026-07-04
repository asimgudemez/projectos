import type {
  DateOnly,
  ISO8601,
  Priority,
  ProjectScopedEntity,
  TaskStatus,
  UUID,
} from "./common";

export type Task = ProjectScopedEntity & {
  reference: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: Priority;
  assigneeId?: UUID | null;
  reporterId?: UUID | null;
  dueDate?: DateOnly | null;
  completedAt?: ISO8601 | null;
  module?: string | null;
  linkedEntityType?: string | null;
  linkedEntityId?: UUID | null;
  tags: string[];
  estimatedHours?: number | null;
  actualHours?: number | null;
};

export type CreateTaskInput = Pick<Task, "projectId" | "reference" | "title"> &
  Partial<
    Pick<
      Task,
      | "description"
      | "status"
      | "priority"
      | "assigneeId"
      | "reporterId"
      | "dueDate"
      | "module"
      | "linkedEntityType"
      | "linkedEntityId"
      | "tags"
      | "estimatedHours"
    >
  >;

export type UpdateTaskInput = Partial<
  Omit<Task, "id" | "companyId" | "projectId" | "createdAt" | "updatedAt">
>;

export type TaskFilter = {
  projectId?: UUID;
  status?: TaskStatus;
  assigneeId?: UUID;
  priority?: Priority;
  dueBefore?: DateOnly;
};
