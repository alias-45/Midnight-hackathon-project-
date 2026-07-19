import { useEffect, useRef, useState } from "react";
import {
  type Conversation,
  type ChatMessage,
  type UserProfileFact,
  createConversation,
  listConversations,
  getMessages,
  addMessage,
  deleteConversation,
  wipeEverything,
  addProfileFact,
  listProfileFacts,
  deleteProfileFact,
  updateConversationTitle,
} from "./lib/db";
import {
  generateReply,
  extractCandidateFacts,
  initEngine,
  getChatMode,
  setChatMode,
  type ChatMode,
  getLocalModelId,
  setLocalModelId,
  LOCAL_MODELS,
} from "./lib/llm";
import { createConsentCommitment, type ConsentAction } from "./lib/midnight";

type Theme = "dark" | "light" | "fantasy";

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [facts, setFacts] = useState<UserProfileFact[]>([]);
  const [input, setInput] = useState("");
  const [loadingModel, setLoadingModel] = useState(true);
  const [modelStatus, setModelStatus] = useState("Initializing local model…");
  const [sending, setSending] = useState(false);
  const [lastCommitment, setLastCommitment] = useState<string | null>(null);
  const [consentStatus, setConsentStatus] = useState<"given" | "revoked">(() => {