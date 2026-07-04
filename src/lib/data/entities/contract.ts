import type {
  ContractStatus,
  ContractType,
  CurrencyCode,
  DateOnly,
  ProjectScopedEntity,
  UUID,
} from "./common";

export type Contract = ProjectScopedEntity & {
  contractNumber: string;
  title: string;
  type: ContractType;
  status: ContractStatus;
  value: number;
  currency: CurrencyCode;
  counterparty: string;
  counterpartyContact?: string | null;
  startDate: DateOnly;
  endDate: DateOnly;
  signedDate?: DateOnly | null;
  scopeSummary?: string | null;
  retentionPct?: number | null;
  paymentTermsDays?: number | null;
  parentContractId?: UUID | null;
  documentId?: UUID | null;
};

export type CreateContractInput = Pick<
  Contract,
  | "projectId"
  | "contractNumber"
  | "title"
  | "type"
  | "value"
  | "currency"
  | "counterparty"
  | "startDate"
  | "endDate"
> &
  Partial<
    Pick<
      Contract,
      | "status"
      | "counterpartyContact"
      | "signedDate"
      | "scopeSummary"
      | "retentionPct"
      | "paymentTermsDays"
      | "parentContractId"
      | "documentId"
    >
  >;

export type UpdateContractInput = Partial<
  Omit<Contract, "id" | "companyId" | "projectId" | "createdAt" | "updatedAt">
>;
