import type { BaseEntity, CurrencyCode, ISO8601, UUID } from "./common";

export type SubscriptionTier = "trial" | "professional" | "enterprise";

export type Company = BaseEntity & {
  id: UUID;
  name: string;
  slug: string;
  legalName: string;
  country: string;
  timezone: string;
  currency: CurrencyCode;
  subscriptionTier: SubscriptionTier;
  logoUrl?: string | null;
  website?: string | null;
  primaryContactEmail: string;
  primaryContactPhone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  postalCode?: string | null;
  isActive: boolean;
  onboardedAt?: ISO8601 | null;
};

export type CreateCompanyInput = Pick<
  Company,
  | "name"
  | "slug"
  | "legalName"
  | "country"
  | "timezone"
  | "currency"
  | "primaryContactEmail"
> &
  Partial<
    Pick<
      Company,
      | "logoUrl"
      | "website"
      | "primaryContactPhone"
      | "addressLine1"
      | "addressLine2"
      | "city"
      | "postalCode"
      | "subscriptionTier"
    >
  >;

export type UpdateCompanyInput = Partial<
  Omit<Company, "id" | "createdAt" | "updatedAt">
>;
