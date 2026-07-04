import type {
  CompanyScopedEntity,
  ISO8601,
  NotificationChannel,
  NotificationType,
  ProjectScopedEntity,
  UUID,
} from "./common";

export type Notification = CompanyScopedEntity & {
  projectId?: UUID | null;
  userId: UUID;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  body: string;
  actionUrl?: string | null;
  entityType?: string | null;
  entityId?: UUID | null;
  isRead: boolean;
  readAt?: ISO8601 | null;
  sentAt?: ISO8601 | null;
  priority: "low" | "normal" | "high" | "urgent";
  metadata?: Record<string, unknown> | null;
};

export type CreateNotificationInput = Pick<
  Notification,
  "userId" | "type" | "title" | "body"
> &
  Partial<
    Pick<
      Notification,
      | "projectId"
      | "channel"
      | "actionUrl"
      | "entityType"
      | "entityId"
      | "priority"
      | "metadata"
    >
  >;

export type NotificationFilter = {
  userId?: UUID;
  projectId?: UUID;
  isRead?: boolean;
  type?: NotificationType;
};

export type ProjectNotification = Notification & ProjectScopedEntity;
