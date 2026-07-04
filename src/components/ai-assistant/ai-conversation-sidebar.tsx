"use client";

import {
  Download,
  MessageSquarePlus,
  Pin,
  PinOff,
  Trash2,
} from "lucide-react";

import type { AiConversation } from "@/lib/ai-assistant-types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { exportConversationToPdf } from "@/lib/ai-assistant-storage";

type AiConversationSidebarProps = {
  conversations: AiConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
};

function formatRelativeTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

export function AiConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onPin,
  onDelete,
}: AiConversationSidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-white/[0.06] bg-white/[0.01] lg:w-64 xl:w-72">
      <div className="border-b border-white/[0.06] p-3">
        <Button
          onClick={onNew}
          className="h-9 w-full justify-start bg-violet-600 text-white hover:bg-violet-500"
        >
          <MessageSquarePlus className="size-4" data-icon="inline-start" />
          New conversation
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {conversations.length === 0 ? (
            <p className="px-3 py-8 text-center text-xs text-muted-foreground">
              No conversations yet. Start by asking a question.
            </p>
          ) : (
            conversations.map((conversation) => {
              const isActive = conversation.id === activeId;
              const preview =
                conversation.messages[conversation.messages.length - 1]?.content ??
                "Empty conversation";

              return (
                <div
                  key={conversation.id}
                  className={cn(
                    "group relative rounded-lg transition-colors",
                    isActive ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(conversation.id)}
                    className="w-full px-3 py-2.5 text-left"
                  >
                    <div className="flex items-start gap-2">
                      {conversation.pinned ? (
                        <Pin className="mt-0.5 size-3 shrink-0 text-violet-400" />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {conversation.title}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          {preview.replace(/\*\*/g, "")}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground/70">
                          {formatRelativeTime(conversation.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </button>

                  <div className="absolute top-2 right-2 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => onPin(conversation.id)}
                      aria-label={conversation.pinned ? "Unpin" : "Pin"}
                    >
                      {conversation.pinned ? (
                        <PinOff className="size-3.5" />
                      ) : (
                        <Pin className="size-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => exportConversationToPdf(conversation)}
                      aria-label="Export to PDF"
                    >
                      <Download className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-rose-400 hover:text-rose-300"
                      onClick={() => onDelete(conversation.id)}
                      aria-label="Delete conversation"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
