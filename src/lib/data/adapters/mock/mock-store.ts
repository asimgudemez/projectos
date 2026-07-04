import type { MockSeedData } from "@/lib/data/adapters/mock/fixtures/seed-data";
import { mockSeedData } from "@/lib/data/adapters/mock/fixtures/seed-data";

/**
 * In-memory mutable store for mock adapter.
 * Supabase adapter replaces this with PostgreSQL queries.
 */
export class MockDataStore {
  private data: MockSeedData;

  constructor(initial: MockSeedData = mockSeedData) {
    this.data = structuredClone(initial);
  }

  get snapshot(): Readonly<MockSeedData> {
    return this.data;
  }

  reset(initial: MockSeedData = mockSeedData): void {
    this.data = structuredClone(initial);
  }
}

let singletonStore: MockDataStore | null = null;

export function getMockStore(): MockDataStore {
  if (!singletonStore) {
    singletonStore = new MockDataStore();
  }
  return singletonStore;
}

export function resetMockStore(): void {
  singletonStore = new MockDataStore();
}
