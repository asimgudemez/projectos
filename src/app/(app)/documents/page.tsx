import { AppShell } from "@/components/layout/app-shell";
import { DocumentsView } from "@/components/documents/documents-view";

export const metadata = {
  title: "Documents · ProjectOS",
};

export default function DocumentsPage() {
  return (
    <AppShell
      title="Documents"
      description="Upload, search and organize project files"
    >
      <DocumentsView />
    </AppShell>
  );
}
