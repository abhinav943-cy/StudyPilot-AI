
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Bot,
  Send,
  UserRound,
  Plus,
  History,
  Trash2,
  Pencil,
  MessageSquare,
  LoaderCircle,
  ArrowDown,
} from "lucide-react";

import TutorMessage from "../components/TutorMessage";

import { api } from "../services/api";
import { tutorChatApi } from "../services/tutorChatApi";

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Hi! Main tumhe concepts simple Hinglish mein samjhane mein help kar sakta hoon. Kya seekhna hai?",
};

// Page ke neeche kitni jagah chhodni hai (parent layout ka bottom padding).
// Agar ab bhi poora page thoda scroll ho raha ho to isse badha do (e.g. 32).
const BOTTOM_GAP = 24;

// Itna paas neeche ho to hi auto-scroll hoga (user upar padh raha ho to nahi).
const NEAR_BOTTOM_PX = 120;

export default function Tutor() {
  const [topic, setTopic] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const rootRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const isNearBottomRef = useRef(true);
  // "smooth" | "auto" | null  -> next render me forcefully neeche scroll karo
  const scrollRequestRef = useRef(null);

  /* ---------------------------------------------------------------
   * 1) Page ko exactly screen ki height me fit karo.
   *    h-full tabhi kaam karta hai jab parent ki height fixed ho.
   *    Isliye yahan viewport se height measure karte hain, taaki
   *    sirf messages / history ke andar scroll ho, poora page nahi.
   * ------------------------------------------------------------- */
  useLayoutEffect(() => {
    function fitToViewport() {
      const el = rootRef.current;
      if (!el) return;

      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const top = el.getBoundingClientRect().top + window.scrollY;

      el.style.height = `${Math.max(320, viewportHeight - top - BOTTOM_GAP)}px`;
    }

    fitToViewport();

    window.addEventListener("resize", fitToViewport);
    window.visualViewport?.addEventListener("resize", fitToViewport);

    return () => {
      window.removeEventListener("resize", fitToViewport);
      window.visualViewport?.removeEventListener("resize", fitToViewport);
    };
  }, []);

  /* ---------------------------------------------------------------
   * 2) Chat history load
   * ------------------------------------------------------------- */
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);

    try {
      const result = await tutorChatApi.getAll();
      setChats(result.chats || []);
    } catch (err) {
      setError(err.message || "Chat history load nahi hui.");
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  /* ---------------------------------------------------------------
   * 3) Smart auto-scroll (ChatGPT jaisa)
   *    - User ne message bheja / chat open ki -> neeche le jao
   *    - User upar purana text padh raha hai -> zabardasti neeche mat kheecho
   * ------------------------------------------------------------- */
  function scrollToBottom(behavior = "smooth") {
    const container = messagesContainerRef.current;

    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior });
    }
  }

  function handleMessagesScroll() {
    const container = messagesContainerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    const nearBottom = distanceFromBottom < NEAR_BOTTOM_PX;

    isNearBottomRef.current = nearBottom;
    setShowScrollDown(!nearBottom);
  }

  useEffect(() => {
    const request = scrollRequestRef.current;

    if (request) {
      scrollRequestRef.current = null;
      scrollToBottom(request);
      return;
    }

    if (isNearBottomRef.current) {
      scrollToBottom("smooth");
    }
  }, [messages, loading, error]);

  /* ---------------------------------------------------------------
   * 4) Input box auto-grow (max 160px), phir andar scroll
   * ------------------------------------------------------------- */
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  function handleInputKeyDown(event) {
    // Enter = send, Shift+Enter = new line
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  /* ---------------------------------------------------------------
   * 5) Chat actions
   * ------------------------------------------------------------- */
  function startNewChat() {
    if (loading) return;

    scrollRequestRef.current = "auto";
    setActiveChatId(null);
    setTopic("");
    setMessages([WELCOME_MESSAGE]);
    setInput("");
    setError("");
  }

  async function openChat(chatId) {
    if (loading) return;

    setError("");

    try {
      const result = await tutorChatApi.getById(chatId);
      const chat = result.chat;

      scrollRequestRef.current = "auto";
      setActiveChatId(chat._id);
      setTopic(chat.topic || "");
      setMessages(
        chat.messages?.length ? chat.messages : [WELCOME_MESSAGE]
      );
    } catch (err) {
      setError(err.message || "Chat open nahi hui.");
    }
  }

  async function saveChat(chatId, nextMessages, chatTopic, title) {
    const result = await tutorChatApi.update(chatId, {
      messages: nextMessages,
      topic: chatTopic,
      ...(title ? { title } : {}),
    });

    const savedChat = result.chat;

    setChats((current) => {
      const remaining = current.filter(
        (chat) => chat._id !== savedChat._id
      );

      return [
        {
          _id: savedChat._id,
          title: savedChat.title,
          topic: savedChat.topic,
          createdAt: savedChat.createdAt,
          updatedAt: savedChat.updatedAt,
        },
        ...remaining,
      ];
    });

    return savedChat;
  }

  async function sendMessage(event) {
    event.preventDefault();

    const question = input.trim();
    const selectedTopic = topic.trim();

    if (!question || loading) return;

    if (!selectedTopic) {
      setError("Pehle subject ya topic enter karo.");
      return;
    }

    const userMessage = { role: "user", content: question };
    const nextMessages = [...messages, userMessage];

    // User ne abhi bheja hai -> chahe kahin bhi scroll ho, neeche le jao.
    scrollRequestRef.current = "smooth";
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    let chatId = activeChatId;
    const chatTitle = activeChatId ? undefined : question.slice(0, 55);

    try {
      // Create the conversation the first time a question is sent.
      if (!chatId) {
        const created = await tutorChatApi.create({
          title: chatTitle,
          topic: selectedTopic,
        });

        chatId = created.chat._id;
        setActiveChatId(chatId);
      }

      // Save the user's question immediately.
      await saveChat(chatId, nextMessages, selectedTopic, chatTitle);

      // Keep using the existing AI-powered backend endpoint.
      const result = await api.askTutor(
        `Subject/topic: ${selectedTopic}\nStudent question: ${question}`,
        nextMessages.slice(-10)
      );




     // const answer = result.answer || result.message;
  
const rawAnswer = result.answer ?? result.message;

if (rawAnswer == null || rawAnswer === "") {
  throw new Error("AI Tutor se answer nahi mila.");
}

const answer =
  typeof rawAnswer === "string"
    ? rawAnswer
    : JSON.stringify(rawAnswer);







      if (!answer) {
        throw new Error("AI Tutor se answer nahi mila.");
      }

      const completedMessages = [
        ...nextMessages,
        { role: "assistant", content: answer },
      ];

      setMessages(completedMessages);

      // Save the AI response too.
      await saveChat(chatId, completedMessages, selectedTopic, chatTitle);
    } catch (err) {
      setError(err.message || "Message send nahi ho paya.");

      // Keep the question saved even if the AI request fails.
      if (chatId) {
        try {
          await saveChat(chatId, nextMessages, selectedTopic, chatTitle);
        } catch (saveError) {
          console.error("Could not save tutor question:", saveError);
        }
      }
    } finally {
      setLoading(false);
      loadHistory();
    }
  }

  async function renameChat(chat) {
    if (loading) return;

    const newTitle = window.prompt("Enter chat title:", chat.title || "");

    if (newTitle === null || !newTitle.trim()) return;

    try {
      const result = await tutorChatApi.update(chat._id, {
        title: newTitle.trim().slice(0, 100),
      });

      setChats((current) =>
        current.map((item) =>
          item._id === chat._id
            ? { ...item, title: result.chat.title }
            : item
        )
      );
    } catch (err) {
      setError(err.message || "Chat rename nahi hui.");
    }
  }

  async function deleteChat(chat) {
    if (loading) return;

    const confirmed = window.confirm(
      `Delete "${chat.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await tutorChatApi.delete(chat._id);

      setChats((current) =>
        current.filter((item) => item._id !== chat._id)
      );

      if (activeChatId === chat._id) {
        startNewChat();
      }
    } catch (err) {
      setError(err.message || "Chat delete nahi hui.");
    }
  }

  return (
    // Height inline style se aati hai (useLayoutEffect). Class wali height
    // sirf pehle paint ke liye approximate fallback hai.
    <div
      ref={rootRef}
      className="mx-auto flex h-[calc(100dvh-7rem)] min-h-0 w-full max-w-7xl flex-col gap-3 overflow-hidden"
    >
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            AI Tutor
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Ask questions and learn any subject step by step.
          </p>
        </div>

        {/* Mobile-only history button. Desktop history stays in its own column. */}
        <button
          type="button"
          onClick={() => setHistoryOpen(true)}
          className="secondary-btn flex shrink-0 items-center gap-2 md:hidden"
          aria-label="Open chat history"
        >
          <History size={18} />
          <span>History</span>
        </button>
      </div>

      <div className="flex min-h-0 flex-1 gap-3 overflow-hidden">
        {/* Desktop history: sirf list scroll hoti hai, baaki fixed. */}
        <aside className="hidden w-56 shrink-0 flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#0d1220] md:flex lg:w-64">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-800 p-3">
            <div className="flex items-center gap-2 font-semibold text-white">
              <History size={17} />
              <span>Chat History</span>
            </div>

            <button
              type="button"
              onClick={startNewChat}
              disabled={loading}
              title="New chat"
              className="rounded-lg p-2 text-blue-400 hover:bg-slate-800 disabled:opacity-50"
            >
              <Plus size={19} />
            </button>
          </div>

          <button
            type="button"
            onClick={startNewChat}
            disabled={loading}
            className="mx-2 mt-3 flex shrink-0 items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-50"
          >
            <MessageSquare size={16} />
            New Chat
          </button>

          <div className="min-h-0 flex-1 space-y-1 overflow-x-hidden overflow-y-auto overscroll-contain p-2">
            {historyLoading ? (
              <p className="p-3 text-sm text-slate-400">Loading history...</p>
            ) : chats.length === 0 ? (
              <p className="p-3 text-sm text-slate-500">No saved chats yet.</p>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat._id}
                  className={`group rounded-lg ${
                    activeChatId === chat._id
                      ? "bg-slate-800"
                      : "hover:bg-slate-800/70"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => openChat(chat._id)}
                    className="w-full min-w-0 px-3 py-3 text-left"
                  >
                    <span className="block truncate text-sm font-medium text-slate-200">
                      {chat.title || chat.topic || "New Chat"}
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-500">
                      {chat.topic || "General topic"}
                    </span>
                  </button>

                  <div className="flex items-center justify-end gap-1 px-2 pb-2">
                    <button
                      type="button"
                      onClick={() => renameChat(chat)}
                      title="Rename chat"
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteChat(chat)}
                      title="Delete chat"
                      className="rounded p-1.5 text-slate-400 hover:bg-red-950 hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main chat: header + composer fixed, sirf messages scroll. */}
        <section className="panel flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-slate-800 bg-[#080b14] p-3 md:p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Bot size={22} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white">StudyPilot AI</p>
              <p className="text-xs text-slate-400">
                {activeChatId ? "Saved conversation" : "New conversation"}
              </p>
            </div>

            <input
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Enter any subject/topic"
              aria-label="Subject or topic"
              maxLength={150}
              className="input-field min-w-0 flex-1 sm:max-w-xs"
              disabled={loading}
            />
          </div>

          {/* Messages area: yahi ek jagah hai jo scroll hoti hai. */}
          <div className="relative flex min-h-0 flex-1 flex-col">
            <div
              ref={messagesContainerRef}
              onScroll={handleMessagesScroll}
              className="min-h-0 flex-1 space-y-4 overflow-x-hidden overflow-y-auto overscroll-contain p-4 md:p-6"
              aria-live="polite"
            >
              {messages.map((message, index) => (
                <div
                  key={`${index}-${message.role}`}
                  className={`flex items-start gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      message.role === "user"
                        ? "bg-violet-500/15 text-violet-300"
                        : "bg-blue-500/15 text-blue-300"
                    }`}
                  >
                    {message.role === "user" ? (
                      <UserRound size={18} />
                    ) : (
                      <Bot size={18} />
                    )}
                  </div>

                  <div
                    className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-7 ${
                      message.role === "user"
                        ? "rounded-tr-sm bg-blue-600 text-white"
                        : "rounded-tl-sm border border-slate-800 bg-[#111827] text-slate-200"
                    }`}
                  >
                  <TutorMessage content={message.content} />
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <LoaderCircle size={18} className="animate-spin" />
                  AI Tutor is thinking...
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300"
                >
                  {error}
                </div>
              )}
            </div>

            {showScrollDown && (
              <button
                type="button"
                onClick={() => scrollToBottom("smooth")}
                aria-label="Scroll to latest message"
                className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-[#111827] text-slate-200 shadow-lg hover:bg-slate-800"
              >
                <ArrowDown size={18} />
              </button>
            )}
          </div>

          {/* Composer: hamesha screen ke neeche fixed (shrink-0). */}
          <form
            onSubmit={sendMessage}
            className="flex shrink-0 items-end gap-2 border-t border-slate-800 bg-[#080b14] p-3 md:p-4"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Ask a follow-up question..."
              aria-label="Your question"
              enterKeyHint="send"
              className="input-field max-h-40 min-w-0 flex-1 resize-none overflow-y-auto"
            />

            <button
              type="submit"
              aria-label="Send message"
              disabled={loading || !input.trim()}
              className="primary-btn flex shrink-0 items-center justify-center self-end px-4 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      </div>

      {/* Mobile history drawer opens from the top, over the chat. */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close chat history"
            className="absolute inset-0 h-full w-full bg-black/60"
            onClick={() => setHistoryOpen(false)}
          />

          <aside className="absolute inset-x-0 top-0 flex max-h-[78dvh] flex-col overflow-hidden rounded-b-2xl border-b border-slate-700 bg-[#0d1220] shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-800 p-4">
              <div className="flex items-center gap-2 font-semibold text-white">
                <History size={18} />
                Chat History
              </div>
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                startNewChat();
                setHistoryOpen(false);
              }}
              disabled={loading}
              className="mx-3 mt-3 flex shrink-0 items-center gap-2 rounded-lg border border-slate-700 p-3 text-left text-sm text-white disabled:opacity-50"
            >
              <Plus size={17} />
              New Chat
            </button>

            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain p-2">
              {historyLoading ? (
                <p className="p-3 text-sm text-slate-400">Loading history...</p>
              ) : chats.length === 0 ? (
                <p className="p-3 text-sm text-slate-500">No saved chats yet.</p>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat._id}
                    className={`flex items-center gap-1 rounded-lg ${
                      activeChatId === chat._id
                        ? "bg-slate-800"
                        : "hover:bg-slate-800/70"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={async () => {
                        await openChat(chat._id);
                        setHistoryOpen(false);
                      }}
                      className="min-w-0 flex-1 p-3 text-left"
                    >
                      <span className="block truncate text-sm font-medium text-slate-200">
                        {chat.title || chat.topic || "New Chat"}
                      </span>
                      <span className="mt-1 block truncate text-xs text-slate-500">
                        {chat.topic || "General topic"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => renameChat(chat)}
                      aria-label="Rename chat"
                      className="p-2 text-slate-400 hover:text-white"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteChat(chat)}
                      aria-label="Delete chat"
                      className="p-2 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
