"use client";

import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  Send,
  RotateCcw,
  Copy,
  Check,
  Calendar,
  Scale,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Plus,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  type ChatMessage,
  QUICK_PROMPTS,
  LEGAL_CATEGORIES,
  generateBotResponse,
} from "@/lib/chatbot-data";

interface ChatSession {
  id: string;
  title: string;
  date: string;
  category: string;
}

function createMessageId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

function getCurrentTimeString(): string {
  return new Date().toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const DEFAULT_SESSIONS: ChatSession[] = [
  {
    id: "s-1",
    title: "Thủ tục ly hôn đơn phương",
    date: "Hôm nay",
    category: "Hôn nhân & Gia đình",
  },
  {
    id: "s-2",
    title: "Tranh chấp đất đai chưa sổ đỏ",
    date: "Hôm qua",
    category: "Đất đai",
  },
  {
    id: "s-3",
    title: "Thành lập công ty TNHH 2 TV",
    date: "3 ngày trước",
    category: "Doanh nghiệp",
  },
  {
    id: "s-4",
    title: "Tính tạm ứng án phí dân sự",
    date: "Tuần trước",
    category: "Án phí",
  },
];

export function ChatPageSection() {
  const [activeSessionId, setActiveSessionId] = useState("s-1");
  const [sessions, setSessions] = useState<ChatSession[]>(DEFAULT_SESSIONS);
  const [activeCategory, setActiveCategory] = useState("all");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-main",
      sender: "bot",
      text:
        "Xin chào quý khách! Tôi là **Trợ lý Pháp lý AI** của **Công ty Luật Hợp danh Nghiệp Hưng**.\n\n" +
        "Tôi được huấn luyện với nguồn dữ liệu quy phạm pháp luật Việt Nam hiện hành (Bộ luật Dân sự, Luật Đất đai 2024, Luật Doanh nghiệp, Luật Hôn nhân & Gia đình, Bộ luật Lao động và các Nghị định hướng dẫn).\n\n" +
        "Bạn có thể đặt câu hỏi về bất kỳ tình huống pháp lý nào, hoặc chọn các chủ đề gợi ý bên dưới để bắt đầu:",
      timestamp: "09:00",
      suggestions: [
        "Thủ tục ly hôn thuận tình và đơn phương",
        "Tranh chấp quyền sử dụng đất chưa có sổ đỏ",
        "Hồ sơ thành lập công ty TNHH",
        "Thời hiệu khởi kiện tranh chấp hợp đồng",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function handleSend(promptText?: string) {
    const query = (promptText || input).trim();
    if (!query || isTyping) return;

    const userMessage: ChatMessage = {
      id: createMessageId("user"),
      sender: "user",
      text: query,
      timestamp: getCurrentTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Update session title if it's new
    if (messages.length <= 1) {
      setSessions((prev) => [
        {
          id: createMessageId("session"),
          title: query.length > 32 ? query.slice(0, 32) + "..." : query,
          date: "Vừa xong",
          category: "Tư vấn mới",
        },
        ...prev,
      ]);
    }

    setTimeout(() => {
      const response = generateBotResponse(query);
      const botMessage: ChatMessage = {
        id: createMessageId("bot"),
        sender: "bot",
        text: response.text,
        timestamp: getCurrentTimeString(),
        citations: response.citations,
        suggestions: response.suggestions,
        action: response.action,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleCopy(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleNewSession() {
    const newId = createMessageId("session");
    setActiveSessionId(newId);
    setMessages([
      {
        id: createMessageId("welcome"),
        sender: "bot",
        text:
          "Chào mừng bạn đến với phiên tư vấn mới. Hãy mô tả chi tiết tình huống pháp lý của bạn để AI Nghiệp Hưng phân tích và đưa ra giải pháp.",
        timestamp: getCurrentTimeString(),
        suggestions: [
          "Thủ tục ly hôn đơn phương",
          "Tranh chấp đất đai chưa sổ đỏ",
          "Thành lập công ty TNHH",
          "Quy định thử việc trong HĐLĐ",
        ],
      },
    ]);
    setMobileSidebarOpen(false);
  }

  function handleClearChat() {
    setMessages([]);
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-100 font-sans">
      {/* ── Left Sidebar (History & Navigation) ── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-navy-700 bg-navy-900 text-white transition-transform duration-300 md:static md:translate-x-0",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-0 -translate-x-full md:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-navy-700 px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-600/20 text-gold-600 border border-gold-600/40">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-white">
                Luật Nghiệp Hưng
              </span>
              <p className="text-[10px] text-gold-600 font-medium">Trí tuệ Nhân tạo Pháp lý</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="rounded-lg p-1 text-neutral-400 hover:text-white md:hidden"
          >
            ✕
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            type="button"
            onClick={handleNewSession}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-600 py-3 text-xs font-semibold text-navy-900 transition-colors hover:bg-gold-600/90 shadow-md"
          >
            <Plus className="h-4 w-4" />
            Tạo hội thoại mới
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Lịch sử tư vấn gần đây
          </div>

          {sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => {
                setActiveSessionId(session.id);
                setMobileSidebarOpen(false);
              }}
              className={cn(
                "group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-colors",
                activeSessionId === session.id
                  ? "bg-white/10 font-medium text-white"
                  : "text-neutral-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-2.5 truncate">
                <MessageSquare className="h-3.5 w-3.5 text-gold-600 shrink-0" />
                <span className="truncate">{session.title}</span>
              </div>
              <span className="text-[10px] text-neutral-400 shrink-0 group-hover:text-neutral-300">
                {session.date}
              </span>
            </button>
          ))}
        </div>

        {/* Bottom Navigation & Hotline */}
        <div className="border-t border-navy-700 p-4 space-y-2 bg-navy-900/50">
          <Link
            href="/consultation"
            className="flex items-center gap-2.5 rounded-lg border border-gold-600/30 bg-gold-600/10 px-3 py-2 text-xs font-semibold text-gold-600 transition-colors hover:bg-gold-600 hover:text-navy-900"
          >
            <Calendar className="h-4 w-4" />
            <span>Đặt lịch hẹn Luật sư</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-neutral-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Về trang chủ Luật Nghiệp Hưng</span>
          </Link>
        </div>
      </aside>

      {/* ── Main Chat Workspace ── */}
      <main className="flex flex-1 flex-col overflow-hidden bg-white">
        {/* Top Header Bar */}
        <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="rounded-lg p-2 text-charcoal-600 hover:bg-neutral-100 md:hidden"
              aria-label="Mở danh sách hội thoại"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 text-gold-600 font-bold">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-serif text-sm md:text-base font-semibold text-charcoal-900 flex items-center gap-2">
                  Trợ lý Pháp lý AI Nghiệp Hưng
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-pill bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Đang hoạt động 24/7
                  </span>
                </h1>
                <p className="text-[11px] text-charcoal-600">
                  Hệ thống phân tích pháp lý & hướng dẫn thủ tục trực tuyến
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearChat}
              title="Xóa nội dung cuộc trò chuyện này"
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-charcoal-600 hover:bg-neutral-50 hover:text-charcoal-900"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
            <Link
              href="/consultation"
              className="inline-flex items-center gap-1.5 rounded-pill bg-navy-900 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-navy-700 shadow-xs"
            >
              <Calendar className="h-3.5 w-3.5 text-gold-600" />
              <span>Gặp Luật sư</span>
            </Link>
          </div>
        </header>

        {/* Category Pills Filter */}
        <div className="border-b border-neutral-200 bg-neutral-50/80 px-4 py-2 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] font-semibold text-charcoal-600 shrink-0">Chủ đề:</span>
            {LEGAL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors",
                  activeCategory === cat.id
                    ? "bg-navy-900 text-white"
                    : "bg-white text-charcoal-600 border border-neutral-200 hover:border-navy-700"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <div className="mx-auto max-w-4xl space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                {/* Bot Avatar */}
                {msg.sender === "bot" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-600 border border-gold-600/30">
                    <Scale className="h-4 w-4" />
                  </div>
                )}

                {/* Bubble Container */}
                <div
                  className={cn(
                    "flex flex-col",
                    msg.sender === "user" ? "items-end max-w-[85%] md:max-w-[70%]" : "items-start max-w-[92%] md:max-w-[80%]"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl p-4 md:p-5 shadow-xs",
                      msg.sender === "user"
                        ? "rounded-tr-xs bg-navy-900 text-white"
                        : "rounded-tl-xs bg-neutral-50 text-charcoal-900 border border-neutral-200"
                    )}
                  >
                    {/* Header bar for bot message */}
                    {msg.sender === "bot" && (
                      <div className="mb-2 flex items-center justify-between border-b border-neutral-200/60 pb-2 text-xs">
                        <span className="font-semibold text-navy-900 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-gold-600" />
                          Trợ lý Pháp lý AI Nghiệp Hưng
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.text)}
                          title="Sao chép câu trả lời"
                          className="flex items-center gap-1 text-[11px] text-charcoal-600 hover:text-charcoal-900"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-medium">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Sao chép</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Content */}
                    <div className="whitespace-pre-wrap leading-relaxed text-sm">
                      {msg.text.split("\n").map((line, idx) => {
                        if (line.startsWith("• ") || line.startsWith("- ")) {
                          return (
                            <div key={idx} className="my-1 flex items-start gap-2 pl-1">
                              <span className="text-gold-600 font-bold">•</span>
                              <span>{renderFormattedText(line.substring(2))}</span>
                            </div>
                          );
                        }
                        if (/^\d+\.\s/.test(line)) {
                          return (
                            <div key={idx} className="mt-2.5 mb-1 font-semibold text-charcoal-900">
                              {renderFormattedText(line)}
                            </div>
                          );
                        }
                        return (
                          <p key={idx} className="my-1.5">
                            {renderFormattedText(line)}
                          </p>
                        );
                      })}
                    </div>

                    {/* Citations Box */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-3.5 rounded-xl bg-white p-3 text-xs text-charcoal-600 border border-neutral-200">
                        <p className="font-semibold text-navy-900 mb-1.5 flex items-center gap-1.5">
                          <Scale className="h-3.5 w-3.5 text-gold-600" />
                          Căn cứ pháp lý viện dẫn:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          {msg.citations.map((c, i) => (
                            <li key={i} className="text-charcoal-900">
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action button linking to legal consultation */}
                    {msg.action && (
                      <div className="mt-4 pt-3 border-t border-neutral-200/80">
                        <Link
                          href={msg.action.href}
                          className="inline-flex items-center gap-2 rounded-pill bg-navy-900 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-navy-700 shadow-xs"
                        >
                          <Calendar className="h-4 w-4 text-gold-600" />
                          {msg.action.label}
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 pl-2">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSend(sug)}
                          className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-charcoal-900 transition-colors hover:border-gold-600 hover:bg-gold-600/10 hover:text-navy-900 shadow-2xs"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="mt-1 px-1 text-[11px] text-charcoal-600/70">
                    {msg.timestamp}
                  </span>
                </div>

                {/* User Avatar */}
                {msg.sender === "user" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-600/20 text-navy-900 font-bold border border-gold-600/40">
                    Bạn
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3 text-xs text-charcoal-600 bg-neutral-50 rounded-2xl border border-neutral-200 px-4 py-3 w-fit shadow-xs animate-pulse">
                <Bot className="h-4 w-4 text-gold-600 animate-spin" />
                <span>Trợ lý Nghiệp Hưng đang tra cứu và tổng hợp cơ sở pháp lý...</span>
              </div>
            )}

            {/* Quick Cards Grid when fresh session */}
            {messages.length <= 1 && !isTyping && (
              <div className="mt-8 pt-4 border-t border-neutral-200">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-charcoal-600">
                  Câu hỏi thường gặp theo lĩnh vực:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {QUICK_PROMPTS.map((qp) => (
                    <button
                      key={qp.id}
                      type="button"
                      onClick={() => handleSend(qp.prompt)}
                      className="group flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-3.5 text-left transition-all hover:border-navy-700 hover:shadow-md"
                    >
                      <div>
                        <span className="rounded-md bg-navy-900/5 px-2 py-0.5 text-[10px] font-semibold text-navy-900">
                          {qp.category}
                        </span>
                        <h4 className="mt-2 text-xs font-semibold text-charcoal-900 group-hover:text-navy-900">
                          {qp.title}
                        </h4>
                        <p className="mt-1 text-[11px] text-charcoal-600 line-clamp-2">
                          {qp.prompt}
                        </p>
                      </div>
                      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-gold-600 group-hover:translate-x-1 transition-transform">
                        Hỏi ngay <ChevronRight className="h-3 w-3" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <footer className="border-t border-neutral-200 bg-white p-4 md:p-5">
          <div className="mx-auto max-w-4xl">
            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative rounded-2xl border border-neutral-300 bg-neutral-50 focus-within:border-navy-700 focus-within:bg-white shadow-xs transition-colors"
            >
              <textarea
                ref={inputRef}
                rows={2}
                placeholder="Nhập câu hỏi pháp lý của bạn (Ví dụ: Thủ tục ly hôn đơn phương, tranh chấp đất đai chưa có sổ đỏ...)..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                className="w-full resize-none bg-transparent px-4 py-3 text-sm text-charcoal-900 outline-none placeholder:text-charcoal-600/60"
              />

              <div className="flex items-center justify-between border-t border-neutral-200/60 px-4 py-2 text-xs text-charcoal-600">
                <span className="text-[11px] text-charcoal-600/70">
                  Nhấn <kbd className="rounded bg-neutral-200 px-1.5 py-0.5 text-[10px] font-mono">Enter</kbd> để gửi, <kbd className="rounded bg-neutral-200 px-1.5 py-0.5 text-[10px] font-mono">Shift + Enter</kbd> để xuống dòng
                </span>

                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-pill px-4 py-1.5 text-xs font-semibold transition-all",
                    input.trim() && !isTyping
                      ? "bg-navy-900 text-white hover:bg-navy-700 shadow-xs"
                      : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  )}
                >
                  <span>Gửi câu hỏi</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>

            <p className="mt-2.5 text-center text-[11px] text-charcoal-600/80">
              <ShieldCheck className="inline h-3 w-3 text-gold-600 mr-1" />
              Thông tin từ AI Nghiệp Hưng mang tính tham khảo sơ bộ • Để có giá trị pháp lý chính thức, hãy{" "}
              <Link href="/consultation" className="font-semibold text-navy-900 underline hover:text-gold-600">
                đặt lịch tư vấn với luật sư phụ trách
              </Link>.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-charcoal-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
