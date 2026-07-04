import { getMockStore } from "@/lib/data/adapters/mock/mock-store";
import { LEGACY_PROJECT_SLUGS } from "@/lib/data";
import type { Document } from "@/lib/data/entities";
import { getProjectById } from "@/lib/projects-data";

export type DocumentListItem = {
  id: string;
  name: string;
  project: string;
  type: string;
  updated: string;
  size: string;
  source: "library" | "import";
};

const LIBRARY_SEED: DocumentListItem[] = [
  {
    id: "lib-1",
    name: "Structural Drawings — Rev C",
    project: "Marina Tower Phase 2",
    type: "Drawing",
    updated: "Jul 2, 2026",
    size: "24.6 MB",
    source: "library",
  },
  {
    id: "lib-2",
    name: "Weekly Progress Report W26",
    project: "Metro Line Station 7",
    type: "Report",
    updated: "Jul 1, 2026",
    size: "1.2 MB",
    source: "library",
  },
  {
    id: "lib-3",
    name: "MEP Submittal Package B",
    project: "Riverside Campus Expansion",
    type: "Submittal",
    updated: "Jun 28, 2026",
    size: "18.4 MB",
    source: "library",
  },
  {
    id: "lib-4",
    name: "Cost Forecast Q3",
    project: "Greenfield Data Center",
    type: "Financial",
    updated: "Jun 25, 2026",
    size: "890 KB",
    source: "library",
  },
  {
    id: "lib-5",
    name: "Safety Inspection Log",
    project: "Marina Tower Phase 2",
    type: "Compliance",
    updated: "Jun 24, 2026",
    size: "456 KB",
    source: "library",
  },
];

function resolveProjectName(projectId: string): string {
  const slug =
    Object.entries(LEGACY_PROJECT_SLUGS).find(([, id]) => id === projectId)?.[0] ??
    projectId;
  return getProjectById(slug)?.name ?? "Project";
}

function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, " ");
}

function formatUploadedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mapStoreDocument(doc: Document): DocumentListItem {
  return {
    id: doc.id,
    name: doc.name,
    project: resolveProjectName(doc.projectId),
    type: formatCategory(doc.category),
    updated: formatUploadedAt(doc.uploadedAt),
    size: formatSize(doc.fileSizeBytes),
    source: "import",
  };
}

/** Read documents from mock data store + seeded library entries. */
export function getDocumentsLibrary(): DocumentListItem[] {
  const imported = getMockStore()
    .snapshot.documents.filter((doc) => !doc.deletedAt)
    .map(mapStoreDocument)
    .sort(
      (a, b) =>
        new Date(b.updated).getTime() - new Date(a.updated).getTime()
    );

  return [...imported, ...LIBRARY_SEED];
}

export function getImportedDocumentCount(): number {
  return getMockStore().snapshot.documents.filter((doc) => !doc.deletedAt).length;
}
