export type AiDataReference = {
  type: string;
  reference: string;
  label: string;
  detail: string;
};

export type AiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  references?: AiDataReference[];
  createdAt: string;
};

export type AiConversationScope =
  | { kind: "portfolio" }
  | { kind: "project"; projectId: string; projectName: string };

export type AiConversation = {
  id: string;
  title: string;
  scope: AiConversationScope;
  messages: AiMessage[];
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AiGeneratedResponse = {
  content: string;
  references: AiDataReference[];
};
