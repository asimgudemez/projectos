import type {
  ISO8601,
  DocumentCategory,
  ProjectScopedEntity,
  UUID,
} from "./common";

export type Document = ProjectScopedEntity & {
  name: string;
  category: DocumentCategory;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  storagePath: string;
  storageBucket: string;
  version: number;
  previousVersionId?: UUID | null;
  uploadedById?: UUID | null;
  uploadedAt: ISO8601;
  discipline?: string | null;
  tags: string[];
  description?: string | null;
  isConfidential: boolean;
  checksum?: string | null;
  linkedEntityType?: string | null;
  linkedEntityId?: UUID | null;
};

export type CreateDocumentInput = Pick<
  Document,
  | "projectId"
  | "name"
  | "category"
  | "fileName"
  | "mimeType"
  | "fileSizeBytes"
  | "storagePath"
  | "storageBucket"
> &
  Partial<
    Pick<
      Document,
      | "discipline"
      | "tags"
      | "description"
      | "isConfidential"
      | "linkedEntityType"
      | "linkedEntityId"
      | "uploadedById"
    >
  >;

export type UpdateDocumentInput = Partial<
  Omit<Document, "id" | "companyId" | "projectId" | "createdAt" | "updatedAt">
>;

export type DocumentFilter = {
  projectId?: UUID;
  category?: DocumentCategory;
  discipline?: string;
  search?: string;
};

export type DocumentSummary = Pick<
  Document,
  | "id"
  | "projectId"
  | "name"
  | "category"
  | "fileName"
  | "fileSizeBytes"
  | "version"
  | "uploadedAt"
  | "discipline"
>;
