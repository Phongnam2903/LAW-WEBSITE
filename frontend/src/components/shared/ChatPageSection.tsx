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
  ChevronDown,
  ArrowLeft,
  Plus,
  MessageSquare,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { ChatMessage } from "@/types/chat";
import {
  QUICK_PROMPTS,
  LEGAL_CATEGORIES,
  generateBotResponse,
} from "@/lib/chatbot-data";
import { sendChatMessage } from "@/services/chat-service";

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
    if (messages.length > 1 || isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  async function handleSend(promptText?: string) {
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

    try {
      const data = await sendChatMessage(query);
      const botMessage: ChatMessage = {
        id: createMessageId("bot"),
        sender: "bot",
        text: data.response,
        timestamp: getCurrentTimeString(),
        citations: data.citations && data.citations.length > 0 ? data.citations : undefined,
        action:
          data.action ??
          (!data.has_grounding
            ? {
                label: "Đặt lịch tư vấn với Luật sư về vụ việc này",
                href: `/consultation?notes=${encodeURIComponent(query)}`,
              }
            : null),
        has_grounding: data.has_grounding,
        analysis: data.analysis,
        intent: data.intent,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Lỗi gửi câu hỏi chat page:", error);
      const fallback = generateBotResponse(query);
      const botMessage: ChatMessage = {
        id: createMessageId("bot-fallback"),
        sender: "bot",
        text:
          fallback.text ||
          "Hệ thống AI của Công ty Luật Hợp danh Nghiệp Hưng hiện đang bận hoặc gián đoạn kết nối. Quý khách vui lòng gọi Hotline 1900 1234 hoặc đặt lịch hẹn trực tiếp với Luật sư để được hỗ trợ tức thì.",
        timestamp: getCurrentTimeString(),
        citations: fallback.citations,
        suggestions: fallback.suggestions,
        action: fallback.action || {
          label: "Đặt lịch tư vấn với Luật sư về vụ việc này",
          href: `/consultation?notes=${encodeURIComponent(query)}`,
        },
        has_grounding: false,
      };

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
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
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans">
      {/* ── Left Sidebar (History & Navigation) - Light Theme ── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-[#F8FAFC] text-slate-800 transition-transform duration-300 md:static md:translate-x-0 shadow-sm md:shadow-none",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-0 -translate-x-full md:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F2942]/10 text-[#0F2942] border border-[#0F2942]/20">
              <Scale className="h-5 w-5 text-[#0F2942]" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-[#0F2942]">
                Luật Nghiệp Hưng
              </span>
              <p className="text-[10px] text-[#C59B27] font-semibold tracking-wide">Trí tuệ Nhân tạo Pháp lý</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 md:hidden"
            aria-label="Đóng thanh bên"
          >
            ✕
          </button>
        </div>

        {/* New Chat Button - Clean Light Style */}
        <div className="p-3">
          <button
            type="button"
            onClick={handleNewSession}
            className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300/80 bg-white py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-[#0F2942]/40 hover:bg-slate-50 hover:text-[#0F2942] hover:shadow-xs"
          >
            <Plus className="h-4 w-4 text-[#C59B27] group-hover:scale-110 transition-transform" />
            <span>Tạo hội thoại mới</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
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
                  ? "bg-white font-semibold text-[#0F2942] border border-slate-200 shadow-2xs"
                  : "text-slate-700 hover:bg-slate-200/60 hover:text-[#0F2942]"
              )}
            >
              <div className="flex items-center gap-2.5 truncate">
                <MessageSquare className={cn(
                  "h-3.5 w-3.5 shrink-0 transition-colors",
                  activeSessionId === session.id ? "text-[#C59B27]" : "text-slate-400 group-hover:text-[#0F2942]"
                )} />
                <span className="truncate">{session.title}</span>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 group-hover:text-slate-500">
                {session.date}
              </span>
            </button>
          ))}
        </div>

        {/* Bottom Navigation & Hotline */}
        <div className="border-t border-slate-200 p-4 space-y-2 bg-[#F8FAFC]">
          <Link
            href="/consultation"
            className="flex items-center gap-2.5 rounded-lg border border-[#C59B27]/40 bg-[#C59B27]/10 px-3 py-2 text-xs font-semibold text-[#9A7318] transition-colors hover:bg-[#C59B27] hover:text-white"
          >
            <Calendar className="h-4 w-4" />
            <span>Đặt lịch hẹn Luật sư</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-600 transition-colors hover:bg-slate-200/60 hover:text-[#0F2942]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Về trang chủ Luật Nghiệp Hưng</span>
          </Link>
        </div>
      </aside>

      {/* ── Main Chat Workspace ── */}
      <main className="flex flex-1 flex-col overflow-hidden bg-white">
        {/* Top Header Bar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
              aria-label="Mở danh sách hội thoại"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F2942]/10 text-[#0F2942] border border-[#0F2942]/20 font-bold">
                <Bot className="h-5 w-5 text-[#0F2942]" />
              </div>
              <div>
                <h1 className="font-serif text-sm md:text-base font-semibold text-[#0F2942] flex items-center gap-2">
                  Trợ lý Pháp lý AI Nghiệp Hưng
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-pill bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Đang hoạt động 24/7
                  </span>
                </h1>
                <p className="text-[11px] text-slate-500">
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
            <Link
              href="/consultation"
              className="inline-flex items-center gap-1.5 rounded-pill bg-[#C59B27] px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#B38A1F] hover:shadow-sm"
            >
              <Calendar className="h-3.5 w-3.5 text-white/90" />
              <span>Gặp Luật sư</span>
            </Link>
          </div>
        </header>

        {/* Category Pills Filter */}
        <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] font-semibold text-slate-600 shrink-0">Chủ đề:</span>
            {LEGAL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors",
                  activeCategory === cat.id
                    ? "bg-[#0F2942]/10 text-[#0F2942] border border-[#0F2942]/30 font-semibold shadow-2xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-[#0F2942]/40 hover:text-[#0F2942]"
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
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F2942]/10 text-[#0F2942] border border-[#0F2942]/20 shadow-2xs">
                    <Scale className="h-4 w-4 text-[#0F2942]" />
                  </div>
                )}

                {/* Bubble Container */}
                <div
                  className={cn(
                    "flex flex-col",
                    msg.sender === "user"
                      ? "items-end max-w-[85%] md:max-w-[70%]"
                      : "items-start w-full max-w-[95%] md:max-w-[88%]"
                  )}
                >
                  {msg.sender === "user" ? (
                    /* User Message: nền #1E3A8A, chữ trắng */
                    <div className="rounded-2xl rounded-tr-xs bg-[#1E3A8A] text-white p-4 md:p-5 shadow-xs">
                      <div className="whitespace-pre-wrap leading-relaxed text-sm">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    /* AI Message: Nền trong suốt bg-transparent, bỏ nền card bao quanh, bỏ shadow và border không cần thiết */
                    <div className="w-full bg-transparent p-0 text-[#1F2937]">
                      {/* Header bar for bot message: Tên và icon AI: #0F2942 */}
                      <div className="mb-2.5 flex items-center justify-between border-b border-slate-200/80 pb-2 text-xs">
                        <span className="font-semibold text-[#0F2942] flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-[#0F2942]" />
                          Trợ lý Pháp lý AI Nghiệp Hưng
                        </span>
                        <CopyActionButton
                          text={msg.text}
                          id={msg.id}
                          copiedId={copiedId}
                          onCopy={handleCopy}
                          size="sm"
                        />
                      </div>

                      {/* Content: Màu chữ nội dung AI #1F2937 với định dạng Markdown & Legal Quotes */}
                      <div className="leading-relaxed text-sm text-[#1F2937]">
                        {parseMessageBlocks(msg.text).map((block, idx) => {
                          if (block.type === "h3") {
                            return (
                              <h3 key={idx} className="mt-4 mb-2 font-bold text-sm md:text-base text-[#0F2942]">
                                {renderFormattedText(block.text || "")}
                              </h3>
                            );
                          }
                          if (block.type === "h2") {
                            return (
                              <h2 key={idx} className="mt-4 mb-2 font-bold text-base md:text-lg text-[#0F2942]">
                                {renderFormattedText(block.text || "")}
                              </h2>
                            );
                          }
                          if (block.type === "h1") {
                            return (
                              <h1 key={idx} className="mt-4 mb-2 font-bold text-lg md:text-xl text-[#0F2942]">
                                {renderFormattedText(block.text || "")}
                              </h1>
                            );
                          }
                          if (block.type === "section_title") {
                            return (
                              <div key={idx} className="mt-3.5 mb-1.5 font-bold text-sm md:text-base text-[#0F2942]">
                                {renderFormattedText(block.text || "")}
                              </div>
                            );
                          }
                          if (block.type === "quote") {
                            return (
                              <div
                                key={idx}
                                className="my-3 rounded-xl border-l-4 border-[#C59B27] bg-[#F8FAFC] p-3.5 md:p-4 text-xs md:text-sm text-slate-800 shadow-2xs"
                              >
                                <div className="flex items-start gap-2.5">
                                  <Quote className="h-4 w-4 shrink-0 text-[#C59B27] mt-0.5 opacity-80" />
                                  <div className="space-y-1.5 font-serif italic text-[#1F2937] leading-relaxed">
                                    {block.lines?.map((qLine, qIdx) => (
                                      <p key={qIdx}>{renderFormattedText(qLine)}</p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          if (block.type === "bullet") {
                            return (
                              <div key={idx} className="my-1 flex items-start gap-2 pl-1">
                                <span className="text-[#C59B27] font-bold text-xs mt-0.5">•</span>
                                <span className="text-[#1F2937] leading-relaxed">
                                  {renderFormattedText(block.text || "")}
                                </span>
                              </div>
                            );
                          }
                          if (block.type === "space") {
                            return <div key={idx} className="h-2" />;
                          }
                          return (
                            <p key={idx} className="my-1.5 leading-relaxed">
                              {renderFormattedText(block.text || "")}
                            </p>
                          );
                        })}
                      </div>

                      {/* Căn cứ pháp lý đối chiếu (Collapsible accordion tinh tế, sạch sẽ, bỏ mũi tên > thừa) */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-3.5 border-t border-slate-100 pt-2.5">
                          <details className="group rounded-xl border border-slate-200/90 bg-[#F8FAFC] p-3 text-xs transition-colors hover:border-slate-300">
                            <summary className="flex cursor-pointer items-center justify-between font-semibold text-[#0F2942] select-none list-none">
                              <span className="flex items-center gap-2">
                                <Scale className="h-3.5 w-3.5 text-[#C59B27]" />
                                <span>Căn cứ pháp lý đối chiếu ({msg.citations.length} nguồn văn bản)</span>
                              </span>
                              <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-normal">
                                <span>Chi tiết</span>
                                <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-open:rotate-180" />
                              </span>
                            </summary>
                            <ul className="mt-2.5 space-y-2 border-t border-slate-200/70 pt-2.5">
                              {msg.citations.map((c, i) => {
                                const { docName, article } = formatCitationBreadcrumb(c);
                                return (
                                  <li key={i} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#C59B27] shrink-0" />
                                    <div>
                                      <span className="font-semibold text-[#0F2942]">{docName}</span>
                                      {article && (
                                        <span className="text-slate-600 block text-[11px] mt-0.5">{article}</span>
                                      )}
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                            {msg.analysis && (
                              <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-500 italic">
                                <span className="flex items-center gap-1.5">
                                  <Sparkles className="h-3 w-3 text-[#C59B27]" />
                                  {msg.analysis}
                                </span>
                              </div>
                            )}
                          </details>
                        </div>
                      )}

                      {/* Grounding Advisory */}
                      {msg.has_grounding === false && msg.id !== "welcome-main" && (
                        <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200">
                          <span className="font-bold text-amber-800 shrink-0">⚠️ Khuyến nghị từ Luật Nghiệp Hưng:</span>
                          <span className="text-amber-900 leading-relaxed">
                            Vụ việc này có tính chất chuyên biệt hoặc cần đối chiếu các tài liệu/hợp đồng gốc. Quý khách nên đặt lịch hẹn làm việc trực tiếp với luật sư chuyên trách để được thẩm định chuyên sâu.
                          </span>
                        </div>
                      )}

                      {/* Action button linking to legal consultation */}
                      {msg.id !== "welcome-main" && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200/80">
                          <Link
                            href={msg.action ? msg.action.href : `/consultation?notes=${encodeURIComponent(msg.text.slice(0, 150))}`}
                            className="inline-flex items-center gap-2 rounded-pill bg-[#C59B27] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#B38A1F] shadow-xs hover:shadow-sm"
                          >
                            <Calendar className="h-3.5 w-3.5 text-white/90" />
                            <span>{msg.action ? msg.action.label : "Đặt lịch Luật sư tư vấn vụ việc này"}</span>
                            <ChevronRight className="h-3.5 w-3.5 text-white/80" />
                          </Link>

                          <CopyActionButton
                            text={msg.text}
                            id={msg.id}
                            copiedId={copiedId}
                            onCopy={handleCopy}
                            size="md"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 pl-0">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSend(sug)}
                          className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 transition-colors hover:border-[#C59B27] hover:bg-[#C59B27]/10 hover:text-[#0F2942] shadow-2xs"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="mt-1.5 px-1 text-[11px] text-slate-400">
                    {msg.timestamp}
                  </span>
                </div>

                {/* User Avatar */}
                {msg.sender === "user" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1E3A8A]/10 text-[#1E3A8A] font-bold border border-[#1E3A8A]/30">
                    Bạn
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3 text-xs text-slate-600 bg-[#F8FAFC] rounded-2xl border border-slate-200 px-4 py-3 w-fit shadow-xs animate-pulse">
                <Bot className="h-4 w-4 text-[#0F2942] animate-spin" />
                <span>Trợ lý Nghiệp Hưng đang tra cứu và tổng hợp cơ sở pháp lý...</span>
              </div>
            )}

            {/* Quick Cards Grid when fresh session */}
            {messages.length <= 1 && !isTyping && (
              <div className="mt-8 pt-4 border-t border-slate-200">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Câu hỏi thường gặp theo lĩnh vực:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {QUICK_PROMPTS.map((qp) => (
                    <button
                      key={qp.id}
                      type="button"
                      onClick={() => handleSend(qp.prompt)}
                      className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3.5 text-left transition-all hover:border-[#0F2942] hover:shadow-md"
                    >
                      <div>
                        <span className="rounded-md bg-[#0F2942]/5 px-2 py-0.5 text-[10px] font-semibold text-[#0F2942]">
                          {qp.category}
                        </span>
                        <h4 className="mt-2 text-xs font-semibold text-slate-900 group-hover:text-[#0F2942] transition-colors">
                          {qp.title}
                        </h4>
                        <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                          {qp.prompt}
                        </p>
                      </div>
                      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#C59B27] group-hover:translate-x-1 transition-transform">
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
        <footer className="border-t border-slate-200 bg-white p-4 md:p-5">
          <div className="mx-auto max-w-4xl">
            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative rounded-2xl border border-slate-300 bg-slate-50/70 focus-within:border-[#0F2942] focus-within:bg-white shadow-2xs transition-colors"
            >
              <textarea
                ref={inputRef}
                rows={2}
                placeholder="Nhập câu hỏi pháp lý của bạn (Ví dụ: Thủ tục ly hôn đơn phương, tranh chấp đất đai chưa có sổ đỏ...)..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                className="w-full resize-none bg-transparent px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />

              <div className="flex items-center justify-between border-t border-slate-200/60 px-4 py-2 text-xs text-slate-500">
                <span className="text-[11px] text-slate-400">
                  Nhấn <kbd className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-mono text-slate-700">Enter</kbd> để gửi, <kbd className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-mono text-slate-700">Shift + Enter</kbd> để xuống dòng
                </span>

                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-pill px-4 py-1.5 text-xs font-semibold transition-all",
                    input.trim() && !isTyping
                      ? "bg-[#0F2942] text-white hover:bg-[#1E3A8A] shadow-xs"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  )}
                >
                  <span>Gửi câu hỏi</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>

            <p className="mt-2.5 text-center text-[11px] text-slate-500">
              <ShieldCheck className="inline h-3 w-3 text-[#C59B27] mr-1" />
              Thông tin từ AI Nghiệp Hưng mang tính tham khảo sơ bộ • Để có giá trị pháp lý chính thức, hãy{" "}
              <Link href="/consultation" className="font-semibold text-[#0F2942] underline hover:text-[#C59B27]">
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
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-[#0F2942]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-[#0F2942] border border-slate-200"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function renderCitationText(text: string) {
  const markdownLinkRegex = /\[(.*?)\]\((.*?)\)/g;
  if (markdownLinkRegex.test(text)) {
    const parts = [];
    let lastIndex = 0;
    let match;
    const re = /\[(.*?)\]\((.*?)\)/g;
    while ((match = re.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[#1E3A8A] underline hover:text-[#C59B27]"
        >
          {match[1]}
        </a>
      );
      lastIndex = re.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts;
  }
  return renderFormattedText(text);
}

function formatCitationBreadcrumb(raw: string): { docName: string; article: string } {
  if (!raw.includes(" > ")) {
    return { docName: raw, article: "" };
  }
  const parts = raw.split(" > ").map((p) => p.trim()).filter(Boolean);
  const docName = parts[0] || raw;
  const article = parts.length > 1 ? parts[parts.length - 1] : "";
  return { docName, article };
}

interface ParsedBlock {
  type: "h1" | "h2" | "h3" | "section_title" | "bullet" | "quote" | "space" | "paragraph";
  text?: string;
  lines?: string[];
}

function parseMessageBlocks(rawText: string): ParsedBlock[] {
  const lines = rawText.split("\n");
  const blocks: ParsedBlock[] = [];
  let currentQuoteLines: string[] = [];

  const flushQuote = () => {
    if (currentQuoteLines.length > 0) {
      blocks.push({ type: "quote", lines: [...currentQuoteLines] });
      currentQuoteLines = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Dòng trích dẫn blockquote bắt đầu bằng >
    if (line.startsWith(">")) {
      const cleanQuoteLine = line.replace(/^>+\s*/, "").trim();
      if (cleanQuoteLine) {
        currentQuoteLines.push(cleanQuoteLine);
      }
      continue;
    }

    // Flush quote nếu gặp dòng bình thường
    flushQuote();

    if (!line) {
      blocks.push({ type: "space" });
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.substring(4).trim() });
    } else if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.substring(3).trim() });
    } else if (line.startsWith("# ")) {
      blocks.push({ type: "h1", text: line.substring(2).trim() });
    } else if (line.startsWith("• ") || line.startsWith("- ") || line.startsWith("* ")) {
      blocks.push({ type: "bullet", text: line.replace(/^[•\-*]\s*/, "").trim() });
    } else if (/^\d+\.\s/.test(line)) {
      blocks.push({ type: "section_title", text: line });
    } else {
      blocks.push({ type: "paragraph", text: line });
    }
  }

  flushQuote();
  return blocks;
}

function CopyActionButton({
  text,
  id,
  copiedId,
  onCopy,
  size = "md",
}: {
  text: string;
  id: string;
  copiedId: string | null;
  onCopy: (id: string, text: string) => void;
  size?: "sm" | "md";
}) {
  const isCopied = copiedId === id;
  const isSm = size === "sm";

  return (
    <div className="relative group/copy inline-flex items-center">
      <button
        type="button"
        onClick={() => onCopy(id, text)}
        aria-label="Sao chép nội dung"
        className={cn(
          "inline-flex items-center justify-center transition-all focus:outline-hidden",
          isSm
            ? "h-7 w-7 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#0F2942]"
            : "h-8.5 w-8.5 rounded-full border border-slate-200/90 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#0F2942] hover:border-slate-300 shadow-2xs",
          isCopied && "text-emerald-600 hover:text-emerald-700 border-emerald-200 bg-emerald-50/50"
        )}
      >
        {isCopied ? (
          <Check className={cn(isSm ? "h-3.5 w-3.5" : "h-4 w-4", "text-emerald-600 transition-transform scale-110")} />
        ) : (
          <Copy className={cn(isSm ? "h-3.5 w-3.5" : "h-4 w-4", "transition-transform group-hover/copy:scale-105")} />
        )}
      </button>

      {/* Floating Tooltip kiểu ChatGPT / Claude */}
      <span className="pointer-events-none absolute -top-8.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-md transition-all duration-150 group-hover/copy:opacity-100 group-hover/copy:-translate-y-0.5 z-30">
        {isCopied ? "Đã sao chép!" : "Sao chép"}
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
      </span>
    </div>
  );
}
