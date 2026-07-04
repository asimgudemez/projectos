"use client";

import { useEffect, useState } from "react";
import { Bot, User } from "lucide-react";

import type { AiDataReference } from "@/lib/ai-assistant-types";
import { cn } from "@/lib/utils";
import { AiDataReferences } from "@/components/ai-assistant/ai-data-references";

function formatMessageContent(content: string) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part.split("\n").map((line, lineIndex, arr) => (
      <span key={`${index}-${lineIndex}`}>
        {line}
        {lineIndex < arr.length - 1 ? <br /> : null}
      </span>
    ));
  });
}

function StreamingText({
  content,
  onComplete,
}: {
  content: string;
  onComplete?: () => void;
}) {
  const [length, setLength] = useState(0);

  useEffect(() => {
    let index = 0;
    const interval = window.setInterval(() => {
      index += 2;
      setLength(index);
      if (index >= content.length) {
        window.clearInterval(interval);
        onComplete?.();
      }
    }, 16);

    return () => window.clearInterval(interval);
  }, [content, onComplete]);

  const displayed = content.slice(0, length);

  return (
    <>
      {formatMessageContent(displayed)}
      {length < content.length ? (
        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-violet-400" />
      ) : null}
    </>
  );
}

type AiChatMessageProps = {
  role: "user" | "assistant";
  content: string;
  references?: AiDataReference[];
  isStreaming?: boolean;
  onStreamComplete?: () => void;
};

export function AiChatMessage({
  role,
  content,
  references,
  isStreaming = false,
  onStreamComplete,
}: AiChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          isUser ? "bg-white/[0.06]" : "bg-violet-500/15"
        )}
      >
        {isUser ? (
          <User className="size-4 text-muted-foreground" />
        ) : (
          <Bot className="size-4 text-violet-400" />
        )}
      </div>

      <div
        className={cn(
          "min-w-0 max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-violet-600/20 text-foreground ring-1 ring-violet-500/20"
            : "bg-white/[0.03] text-foreground/90 ring-1 ring-white/[0.06]"
        )}
      >
        {isStreaming ? (
          <StreamingText content={content} onComplete={onStreamComplete} />
        ) : (
          formatMessageContent(content)
        )}
        {!isUser && references && !isStreaming ? (
          <AiDataReferences references={references} />
        ) : null}
      </div>
    </div>
  );
}
