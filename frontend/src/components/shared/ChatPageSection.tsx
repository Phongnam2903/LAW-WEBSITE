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
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.text)}
                          title="Sao chép câu trả lời"
                          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#0F2942] transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-medium">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5 text-slate-400" />
                              <span>Sao chép</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Content: Màu chữ nội dung AI #1F2937 */}
                      <div className="whitespace-pre-wrap leading-relaxed text-sm text-[#1F2937]">
                        {msg.text.split("\n").map((line, idx) => {
                          if (line.startsWith("### ")) {
                            return (
                              <h3 key={idx} className="mt-3.5 mb-1.5 font-bold text-sm md:text-base text-[#0F2942]">
                                {renderFormattedText(line.substring(4))}
                              </h3>
                            );
                          }
                          if (line.startsWith("## ")) {
                            return (
                              <h2 key={idx} className="mt-4 mb-2 font-bold text-base md:text-lg text-[#0F2942]">
                                {renderFormattedText(line.substring(3))}
                              </h2>
                            );
                          }
                          if (line.startsWith("# ")) {
                            return (
                              <h1 key={idx} className="mt-4 mb-2 font-bold text-lg md:text-xl text-[#0F2942]">
                                {renderFormattedText(line.substring(2))}
                              </h1>
                            );
                          }
                          if (line.startsWith("• ") || line.startsWith("- ")) {
                            return (
                              <div key={idx} className="my-1 flex items-start gap-2 pl-1">
                                <span className="text-[#C59B27] font-bold">•</span>
                                <span className="text-[#1F2937]">{renderFormattedText(line.substring(2))}</span>
                              </div>
                            );
                          }
                          if (/^\d+\.\s/.test(line)) {
                            return (
                              <div key={idx} className="mt-2.5 mb-1 font-semibold text-[#0F2942]">
                                {renderFormattedText(line)}
                              </div>
                            );
                          }
                          if (!line.trim()) {
                            return <div key={idx} className="h-2" />;
                          }
                          return (
                            <p key={idx} className="my-1.5">
                              {renderFormattedText(line)}
                            </p>
                          );
                        })}
                      </div>

                      {/* Card trích dẫn pháp luật riêng với nền #F8FAFC, border #E2E8F0 */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-4 rounded-xl bg-[#F8FAFC] p-3.5 text-xs text-slate-700 border border-[#E2E8F0] shadow-2xs">
                          <p className="font-semibold text-[#0F2942] mb-1.5 flex items-center gap-1.5">
                            <Scale className="h-3.5 w-3.5 text-[#C59B27]" />
                            Căn cứ pháp lý viện dẫn:
                          </p>
                          <ul className="list-disc list-inside space-y-1.5">
                            {msg.citations.map((c, i) => (
                              <li key={i} className="text-[#1F2937] leading-relaxed">
                                {renderCitationText(c)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Analysis Box */}
                      {msg.analysis && (
                        <div className="mt-3 rounded-xl bg-[#C59B27]/10 p-3 text-xs text-slate-700 border border-[#C59B27]/30">
                          <p className="font-semibold text-[#0F2942] mb-1 flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-[#0F2942]" />
                            Phân tích hệ thống AI & Phạm vi tra cứu:
                          </p>
                          <p className="text-[12px] text-slate-700 leading-relaxed italic">{msg.analysis}</p>
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

                          <button
                            type="button"
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="inline-flex items-center gap-1.5 rounded-pill border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                                <span className="text-emerald-600 font-semibold">Đã sao chép</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5 text-slate-500" />
                                <span>Sao chép câu trả lời</span>
                              </>
                            )}
                          </button>
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
