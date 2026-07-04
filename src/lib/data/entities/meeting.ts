import type {
  DateOnly,
  ISO8601,
  MeetingStatus,
  MeetingType,
  ProjectScopedEntity,
  UUID,
} from "./common";

export type Meeting = ProjectScopedEntity & {
  title: string;
  type: MeetingType;
  status: MeetingStatus;
  scheduledStart: ISO8601;
  scheduledEnd: ISO8601;
  location?: string | null;
  virtualLink?: string | null;
  organizerId?: UUID | null;
  attendeeIds: UUID[];
  agenda?: string | null;
  minutes?: string | null;
  actionItems?: string | null;
  linkedTaskIds: UUID[];
  aiSummary?: string | null;
};

export type CreateMeetingInput = Pick<
  Meeting,
  "projectId" | "title" | "type" | "scheduledStart" | "scheduledEnd"
> &
  Partial<
    Pick<
      Meeting,
      | "status"
      | "location"
      | "virtualLink"
      | "organizerId"
      | "attendeeIds"
      | "agenda"
    >
  >;

export type UpdateMeetingInput = Partial<
  Omit<Meeting, "id" | "companyId" | "projectId" | "createdAt" | "updatedAt">
>;

export type MeetingFilter = {
  projectId?: UUID;
  status?: MeetingStatus;
  type?: MeetingType;
  fromDate?: DateOnly;
  toDate?: DateOnly;
};
