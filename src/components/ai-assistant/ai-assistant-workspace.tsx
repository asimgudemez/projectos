"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";

import { assistantPromptSuggestions } from "@/lib/ai-assistant-data";
import {
  generateAiResponse,
  getProjectContextOrFallback,
} from "@/lib/ai-assistant-engine";
import {
  createConversation,
  getScopeConversations,
  loadConversations,
  saveConversations,
} from "@/lib/ai-assistant-storage";
import type {
  AiConversation,
  AiConversationScope,
  AiMessage,
} from "@/lib/ai-assistant-types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AiChatMessage } from "@/components/ai-assistant/ai-chat-message";
import { AiConversationSidebar } from "@/components/ai-assistant/ai-conversation-sidebar";

type AiAssistantWorkspaceProps = {
  scope: AiConversationScope;
  projectId?: string | null;
  headline?: string;
  subheadline?: string;
  className?: string;
};

function getScopeKey(scope: AiConversationScope): string {
  return scope.kind === "portfolio" ? "portfolio" : scope.projectId;
}

function deriveTitle(query: string): string {
  const trimmed = query.trim();
  if (trimmed.length <= 48) return trimmed;
  return `${trimmed.slice(0, 45)}...`;
}

export function AiAssistantWorkspace({
  scope,
  projectId = null,
  headline = "AI Construction Assistant",
  subheadline = "Ask anything about your project — answers reference live project data",
  className,
}: AiAssistantWorkspaceProps) {
  const scopeKey = getScopeKey(scope);
  const [allConversations, setAllConversations] = useState<AiConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  const [isThinking, setIsThinking] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = loadConversations();
      setAllConversations(stored);
      const scoped = getScopeConversations(stored, scopeKey);
      if (scoped.length > 0) {
        setActiveId(scoped[0].id);
      }
      setHydrated(true);
    });
  }, [scopeKey]);

  const scopedConversations = useMemo(
    () => getScopeConversations(allConversations, scopeKey),
    [allConversations, scopeKey]
  );

  const activeConversation = scopedConversations.find(
    (conversation) => conversation.id === activeId
  );

  const persist = useCallback(
    (conversations: AiConversation[]) => {
      setAllConversations(conversations);
      saveConversations(conversations);
    },
    []
  );

  const updateConversation = useCallback(
    (id: string, updater: (conversation: AiConversation) => AiConversation) => {
      persist(
        allConversations.map((conversation) =>
          conversation.id === id ? updater(conversation) : conversation
        )
      );
    },
    [allConversations, persist]
  );

  const handleNewConversation = useCallback(() => {
    const conversation = createConversation(scope, "New conversation");
    persist([conversation, ...allConversations]);
    setActiveId(conversation.id);
    setQuery("");
  }, [allConversations, persist, scope]);

  const handlePin = useCallback(
    (id: string) => {
      updateConversation(id, (conversation) => ({
        ...conversation,
        pinned: !conversation.pinned,
        updatedAt: new Date().toISOString(),
      }));
    },
    [updateConversation]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const remaining = allConversations.filter(
        (conversation) => conversation.id !== id
      );
      persist(remaining);
      if (activeId === id) {
        const next = getScopeConversations(remaining, scopeKey)[0];
        setActiveId(next?.id ?? null);
      }
    },
    [activeId, allConversations, persist, scopeKey]
  );

  const submitQuery = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isThinking) return;

      let conversationId = activeId;
      let conversations = allConversations;

      if (!conversationId) {
        const created = createConversation(scope, deriveTitle(trimmed));
        conversations = [created, ...allConversations];
        conversationId = created.id;
        setActiveId(created.id);
        persist(conversations);
      }

      const userMessage: AiMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      const now = new Date().toISOString();
      const withUser = conversations.map((conversation) => {
        if (conversation.id !== conversationId) return conversation;
        const isFirst = conversation.messages.length === 0;
        return {
          ...conversation,
          title: isFirst ? deriveTitle(trimmed) : conversation.title,
          messages: [...conversation.messages, userMessage],
          updatedAt: now,
        };
      });

      persist(withUser);
      setQuery("");
      setIsThinking(true);

      await new Promise((resolve) => setTimeout(resolve, 600));

      const context = getProjectContextOrFallback(projectId);
      const response = generateAiResponse(trimmed, context);

      const assistantMessage: AiMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.content,
        references: response.references,
        createdAt: new Date().toISOString(),
      };

      const withAssistant = withUser.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: [...conversation.messages, assistantMessage],
              updatedAt: new Date().toISOString(),
            }
          : conversation
      );

      persist(withAssistant);
      setIsThinking(false);
      setStreamingMessageId(assistantMessage.id);
    },
    [
      activeId,
      allConversations,
      isThinking,
      persist,
      projectId,
      scope,
    ]
  );

  const contextLabel =
    scope.kind === "portfolio"
      ? "Portfolio context"
      : `${scope.projectName} · Project context`;

  if (!hydrated) {
    return (
      <div className="flex min-h-[480px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading assistant...</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-[calc(100vh-10rem)] flex-col overflow-hidden rounded-xl bg-white/[0.015] ring-1 ring-white/[0.06] lg:min-h-[calc(100vh-8rem)] lg:flex-row",
        className
      )}
    >
      <AiConversationSidebar
        conversations={scopedConversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={handleNewConversation}
        onPin={handlePin}
        onDelete={handleDelete}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-white/[0.06] px-4 py-4 lg:px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-violet-400" />
            <p className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
              {contextLabel}
            </p>
          </div>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
            {headline}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{subheadline}</p>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-6 px-4 py-6 lg:px-6">
            {!activeConversation || activeConversation.messages.length === 0 ? (
              <div className="mx-auto max-w-2xl py-8 text-center lg:py-16">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-violet-500/15">
                  <Sparkles className="size-6 text-violet-400" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-foreground">
                  Construction intelligence, grounded in your data
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ask about RFIs, submittals, manpower, procurement, drawings,
                  or request executive reports. Every answer references project
                  records.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {assistantPromptSuggestions.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => submitQuery(prompt)}
                      className="rounded-full bg-white/[0.04] px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-white/[0.07] hover:text-foreground"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              activeConversation.messages.map((message) => (
                <AiChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  references={message.references}
                  isStreaming={
                    message.role === "assistant" &&
                    message.id === streamingMessageId
                  }
                  onStreamComplete={() => setStreamingMessageId(null)}
                />
              ))
            )}

            {isThinking ? (
              <div className="flex gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15">
                  <Sparkles className="size-4 animate-pulse text-violet-400" />
                </div>
                <div className="rounded-xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/[0.06]">
                  <p className="text-sm text-muted-foreground">
                    Analysing project data...
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </ScrollArea>

        <div className="border-t border-white/[0.06] bg-background/80 p-4 backdrop-blur-sm lg:p-5">
          {activeConversation && activeConversation.messages.length > 0 ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {assistantPromptSuggestions.slice(0, 5).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setQuery(prompt)}
                  className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-white/[0.07] hover:text-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
          ) : null}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitQuery(query);
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ask about RFIs, submittals, manpower, procurement..."
              className="h-11 flex-1 border-white/[0.06] bg-white/[0.02] text-sm shadow-none placeholder:text-muted-foreground/55 focus-visible:border-violet-500/40 focus-visible:ring-violet-500/20"
              disabled={isThinking}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!query.trim() || isThinking}
              className="size-11 shrink-0 bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40"
              aria-label="Send message"
            >
              <ArrowUp className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
