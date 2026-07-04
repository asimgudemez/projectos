import type { IDataSource } from "@/lib/data/repositories/interfaces";
import { createMockDataSource } from "@/lib/data/adapters/mock/mock-data-source";
import { isSupabaseConfigured } from "@/lib/data/adapters/supabase/client";

export type DataSourceMode = "mock" | "supabase";

export function resolveDataSourceMode(): DataSourceMode {
  const override = process.env.PROJECTOS_DATA_SOURCE as DataSourceMode | undefined;
  if (override === "mock" || override === "supabase") return override;
  return isSupabaseConfigured() ? "supabase" : "mock";
}

let cachedDataSource: IDataSource | null = null;

/**
 * Returns the active data source.
 * Mock by default; switches to Supabase when env vars are set and adapter is implemented.
 */
export function getDataSource(): IDataSource {
  if (cachedDataSource) return cachedDataSource;

  const mode = resolveDataSourceMode();

  if (mode === "supabase") {
    // Supabase repositories will be wired here in the integration sprint.
    // Until then, fall back to mock to keep the app functional.
    cachedDataSource = createMockDataSource();
    return cachedDataSource;
  }

  cachedDataSource = createMockDataSource();
  return cachedDataSource;
}

export function resetDataSource(): void {
  cachedDataSource = null;
}
