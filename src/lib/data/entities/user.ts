import type { CompanyScopedEntity, ISO8601, UserRole } from "./common";

export type User = CompanyScopedEntity & {
  email: string;
  fullName: string;
  role: UserRole;
  jobTitle?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  department?: string | null;
  isActive: boolean;
  lastLoginAt?: ISO8601 | null;
  invitedAt?: ISO8601 | null;
  authUserId?: string | null; // Supabase auth.users.id
};

export type CreateUserInput = Pick<
  User,
  "email" | "fullName" | "role"
> &
  Partial<
    Pick<
      User,
      "jobTitle" | "phone" | "avatarUrl" | "department" | "authUserId"
    >
  >;

export type UpdateUserInput = Partial<
  Omit<User, "id" | "companyId" | "createdAt" | "updatedAt">
>;
