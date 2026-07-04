import { jsPDF } from "jspdf";

import type { AiConversation } from "@/lib/ai-assistant-types";

const STORAGE_KEY = "projectos-ai-conversations";

export function loadConversations(): AiConversation[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AiConversation[];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: AiConversation[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

export function getScopeConversations(
  conversations: AiConversation[],
  scopeKey: string
): AiConversation[] {
  return conversations
    .filter((conversation) => {
      if (scopeKey === "portfolio") {
        return conversation.scope.kind === "portfolio";
      }
      return (
        conversation.scope.kind === "project" &&
        conversation.scope.projectId === scopeKey
      );
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
}

export function createConversation(
  scope: AiConversation["scope"],
  title: string
): AiConversation {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title,
    scope,
    messages: [],
    pinned: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function exportConversationToPdf(conversation: AiConversation): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const scopeLabel =
    conversation.scope.kind === "portfolio"
      ? "Portfolio"
      : conversation.scope.projectName;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("ProjectOS — AI Conversation Export", margin, y);
  y += 24;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`${scopeLabel} · ${conversation.title}`, margin, y);
  y += 14;
  doc.text(
    `Exported ${new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}`,
    margin,
    y
  );
  y += 28;

  doc.setTextColor(0);

  for (const message of conversation.messages) {
    const role = message.role === "user" ? "You" : "ProjectOS AI";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(role, margin, y);
    y += 16;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(message.content.replace(/\*\*/g, ""), maxWidth);

    for (const line of lines) {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 14;
    }

    if (message.references?.length) {
      y += 6;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(80);
      doc.text("Data references:", margin, y);
      y += 12;

      for (const reference of message.references) {
        const refLine = `[${reference.type}] ${reference.reference} — ${reference.label}`;
        const refLines = doc.splitTextToSize(refLine, maxWidth - 12);
        for (const refText of refLines) {
          if (y > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(refText, margin + 8, y);
          y += 12;
        }
      }
      doc.setTextColor(0);
    }

    y += 20;
  }

  const filename = `projectos-ai-${conversation.title.slice(0, 30).replace(/\s+/g, "-").toLowerCase()}.pdf`;
  doc.save(filename);
}
