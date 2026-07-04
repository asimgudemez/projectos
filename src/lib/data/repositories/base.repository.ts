import type {
  ListFilter,
  PaginatedResult,
  UUID,
} from "@/lib/data/entities";

export type RepositoryContext = {
  companyId: UUID;
  userId?: UUID;
};

export interface IRepository<T, CreateInput, UpdateInput, Filter = ListFilter> {
  findById(id: UUID, ctx: RepositoryContext): Promise<T | null>;
  findMany(filter: Filter, ctx: RepositoryContext): Promise<PaginatedResult<T>>;
  create(input: CreateInput, ctx: RepositoryContext): Promise<T>;
  update(id: UUID, input: UpdateInput, ctx: RepositoryContext): Promise<T>;
  softDelete(id: UUID, ctx: RepositoryContext): Promise<void>;
}

export abstract class BaseRepository {
  protected notDeleted<T extends { deletedAt?: string | null }>(
    records: T[]
  ): T[] {
    return records.filter((record) => !record.deletedAt);
  }

  protected paginate<T>(
    records: T[],
    page = 1,
    pageSize = 50
  ): PaginatedResult<T> {
    const start = (page - 1) * pageSize;
    const data = records.slice(start, start + pageSize);
    return {
      data,
      total: records.length,
      page,
      pageSize,
      hasMore: start + pageSize < records.length,
    };
  }
}
