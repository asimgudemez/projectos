export const IMPORT_COMPLETE_EVENT = "projectos:import-complete";

export type ImportCompleteDetail = {
  fileName: string;
  totalRecords: number;
  projectId: string;
};

export function dispatchImportComplete(detail: ImportCompleteDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ImportCompleteDetail>(IMPORT_COMPLETE_EVENT, { detail })
  );
}

export function onImportComplete(
  handler: (detail: ImportCompleteDetail) => void
): () => void {
  if (typeof window === "undefined") return () => undefined;

  const listener = (event: Event) => {
    handler((event as CustomEvent<ImportCompleteDetail>).detail);
  };

  window.addEventListener(IMPORT_COMPLETE_EVENT, listener);
  return () => window.removeEventListener(IMPORT_COMPLETE_EVENT, listener);
}
