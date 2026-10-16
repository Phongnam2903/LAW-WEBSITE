"use client";

import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Sparkles,
  X,
  Send,
  Maximize2,
  RotateCcw,
  Copy,
  Check,
  Calendar,
  Scale,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { ChatMessage } from "@/types/chat";
import { generateBotResponse } from "@/lib/chatbot-data";
import { sendChatMessage } from "@/services/chat-service";

function createMessageId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

function getCurrentTimeString(): string {
  return new Date().toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatbotWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text:
        "Xin chào! Tôi là **Trợ lý Pháp lý AI** của **Công ty Luật Hợp danh Nghiệp Hưng**.\n\n" +
        "Tôi có thể hỗ trợ bạn tra cứu quy định pháp luật sơ bộ, giải đáp thủ tục về Đất đai, Doanh nghiệp, Hôn nhân gia đình, Lao động hoặc hỗ trợ đặt lịch hẹn với luật sư chuyên trách.\n\n" +
        "Bạn cần tư vấn vấn đề gì hôm nay?",
      timestamp: "Vừa xong",
      suggestions: [
        "Thủ tục ly hôn đơn phương",
        "Tranh chấp đất đai chưa có sổ",
        "Thành lập công ty TNHH",
        "Cách tính án phí dân sự",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isTooltipVisible = showTooltip && !isOpen;

  // Auto show tooltip after 3.5s to invite user
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  async function handleSend(textToSend?: string) {
    const query = (textToSend || input).trim();
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
                label: "Đặt lịch tư vấn với Luật sư",
                href: `/consultation?notes=${encodeURIComponent(query)}`,
              }
            : null),
        has_grounding: data.has_grounding,
        analysis: data.analysis,
        intent: data.intent,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Lỗi gửi câu hỏi chatbot widget:", error);
      const fallback = generateBotResponse(query);
      const botMessage: ChatMessage = {
        id: createMessageId("bot-fallback"),
        sender: "bot",
        text:
          fallback.text ||
          "Hệ thống Trợ lý Pháp lý AI hiện đang bận hoặc gián đoạn kết nối. Quý khách vui lòng thử lại sau giây lát hoặc liên hệ hotline 1900 1234 để được luật sư hỗ trợ trực tiếp.",
        timestamp: getCurrentTimeString(),
        citations: fallback.citations,
        suggestions: fallback.suggestions,
        action: fallback.action || {
          label: "Đặt lịch tư vấn với Luật sư",
          href: `/consultation?notes=${encodeURIComponent(query)}`,
        },
        has_grounding: false,
      };

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
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

  function handleReset() {
    setMessages([
      {
        id: createMessageId("welcome"),
        sender: "bot",
        text:
          "Hội thoại đã được làm mới. Tôi sẵn sàng hỗ trợ bạn tra cứu các vấn đề pháp lý mới. Bạn muốn bắt đầu với chủ đề nào?",
        timestamp: getCurrentTimeString(),
        suggestions: [
          "Thủ tục ly hôn đơn phương",
          "Tranh chấp đất đai",
          "Thành lập công ty TNHH",
          "Thời hiệu chia thừa kế",
        ],
      },
    ]);
  }

  if (pathname === "/chat") {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* ── Welcome floating invite badge ── */}
      {isTooltipVisible && (
        <div className="mb-3 animate-fade-in flex items-center gap-3 rounded-2xl border border-gold-600/30 bg-navy-900/95 px-4 py-2.5 text-xs text-white shadow-xl backdrop-blur-md">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-600/20 text-gold-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gold-600">Trợ lý Pháp lý AI Nghiệp Hưng</p>
            <p className="text-neutral-300">Cần tư vấn sơ bộ hoặc tra cứu luật?</p>
          </div>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            aria-label="Đóng thông báo"
            className="text-neutral-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Chat Window Popover ── */}
      {isOpen && (
        <div className="mb-3 flex h-[580px] max-h-[85vh] w-[370px] max-w-[94vw] flex-col overflow-hidden rounded-2xl border border-neutral-300 bg-white shadow-2xl sm:w-[420px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-navy-700 bg-navy-900 px-4 py-3.5 text-white">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gold-600/20 text-gold-600 border border-gold-600/30">
                <Scale className="h-5 w-5" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-navy-900" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-sm font-semibold tracking-wide">
                    AI Luật Nghiệp Hưng
                  </h3>
                  <span className="rounded-full bg-gold-600/20 px-1.5 py-0.2 text-[10px] font-medium text-gold-600">
                    24/7
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300 flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Trực tuyến • Tư vấn pháp lý tức thì
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-neutral-300">
              <button
                type="button"
                onClick={handleReset}
                title="Làm mới cuộc trò chuyện"
                className="rounded-lg p-1.5 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Làm mới hội thoại"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <Link
                href="/chat"
                title="Mở toàn màn hình"
                className="rounded-lg p-1.5 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Mở trang chat đầy đủ"
              >
                <Maximize2 className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Thu nhỏ"
                className="rounded-lg p-1.5 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Đóng cửa sổ chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="bg-neutral-100 px-3.5 py-1.5 text-[11px] text-charcoal-600 flex items-center justify-between border-b border-neutral-200">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-gold-600 shrink-0" />
              Phân tích theo quy định pháp luật Việt Nam
            </span>
            <Link
              href="/consultation"
              className="text-navy-900 font-semibold hover:underline flex items-center gap-0.5"
            >
              Gặp Luật sư
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm bg-neutral-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col",
                  msg.sender === "user" ? "items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "relative max-w-[88%] rounded-2xl px-4 py-3 shadow-xs",
                    msg.sender === "user"
                      ? "rounded-tr-xs bg-navy-900 text-white"
                      : "rounded-tl-xs bg-white text-charcoal-900 border border-neutral-200"
                  )}
                >
                  {/* Sender icon for bot */}
                  {msg.sender === "bot" && (
                    <div className="mb-1 flex items-center justify-between gap-2 border-b border-neutral-100 pb-1 text-[11px] font-medium text-gold-600">
                      <span className="flex items-center gap-1">
                        <Bot className="h-3.5 w-3.5 text-gold-600" />
                        Trợ lý Nghiệp Hưng
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.text)}
                        title="Sao chép nội dung"
                        className="text-charcoal-600/70 hover:text-charcoal-900 transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Formatted Text */}
                  <div className="whitespace-pre-wrap leading-relaxed text-[13px]">
                    {msg.text.split("\n").map((line, idx) => {
                      if (line.startsWith("• ") || line.startsWith("- ")) {
                        return (
                          <div key={idx} className="my-0.5 flex items-start gap-1.5 pl-1">
                            <span className="text-gold-600 font-bold">•</span>
                            <span>{renderFormattedText(line.substring(2))}</span>
                          </div>
                        );
                      }
                      if (/^\d+\.\s/.test(line)) {
                        return (
                          <div key={idx} className="my-1 font-semibold text-charcoal-900">
                            {renderFormattedText(line)}
                          </div>
                        );
                      }
                      return (
                        <p key={idx} className="my-1">
                          {renderFormattedText(line)}
                        </p>
                      );
                    })}
                  </div>

                  {/* Citations list if any */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2.5 rounded-lg bg-neutral-100 p-2 text-[11px] text-charcoal-600 border border-neutral-200/60">
                      <p className="font-semibold text-navy-900 mb-1 flex items-center gap-1">
                        <Scale className="h-3 w-3 text-gold-600" />
                        Căn cứ pháp lý:
                      </p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {msg.citations.map((c, i) => (
                          <li key={i} className="text-charcoal-900">
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Grounding notice if question needs lawyer review */}
                  {msg.sender === "bot" && msg.has_grounding === false && msg.id !== "welcome-1" && (
                    <div className="mt-2 rounded-lg bg-amber-500/10 p-2 text-[11px] text-amber-900 border border-amber-500/20">
                      <p className="font-semibold text-amber-800">⚠️ Lưu ý tư vấn:</p>
                      <p>Vụ việc này cần thẩm định thêm hồ sơ chứng cứ. Quý khách nên tham khảo ý kiến trực tiếp của luật sư.</p>
                    </div>
                  )}

                  {/* CTA Action button */}
                  {msg.action && (
                    <div className="mt-3 pt-2 border-t border-neutral-100">
                      <Link
                        href={msg.action.href}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-pill bg-navy-900 py-2 text-xs font-semibold text-white transition-colors hover:bg-navy-700 shadow-xs"
                      >
                        <Calendar className="h-3.5 w-3.5 text-gold-600" />
                        {msg.action.label}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Suggestions chip buttons below bot message */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 pl-1 max-w-[92%]">
                    {msg.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSend(sug)}
                        className="rounded-full border border-neutral-300 bg-white px-2.5 py-1 text-[11px] font-medium text-charcoal-900 transition-colors hover:border-gold-600 hover:bg-gold-600/10 hover:text-navy-900 text-left"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}

                <span className="mt-1 px-1 text-[10px] text-charcoal-600/70">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-charcoal-600 bg-white rounded-2xl border border-neutral-200 px-3.5 py-2.5 w-fit shadow-xs animate-pulse">
                <Bot className="h-3.5 w-3.5 text-gold-600 animate-spin" />
                <span>Trợ lý Nghiệp Hưng đang tra cứu quy định pháp luật...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="border-t border-neutral-200 bg-white p-3">
            <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Nhập câu hỏi pháp lý của bạn..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                className="flex-1 rounded-pill border border-neutral-300 bg-neutral-100 px-4 py-2.5 text-xs text-charcoal-900 outline-none transition-colors placeholder:text-charcoal-600/60 focus:border-navy-700 focus:bg-white"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                aria-label="Gửi câu hỏi"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-all shrink-0",
                  input.trim() && !isTyping
                    ? "bg-navy-900 text-white hover:bg-navy-700 hover:scale-105 shadow-xs"
                    : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-2 text-center text-[10px] text-charcoal-600/75">
              Thông tin mang tính tham khảo •{" "}
              <Link href="/consultation" className="underline hover:text-navy-900 font-medium">
                Đặt lịch tư vấn chính thức với luật sư
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* ── Floating Launcher Trigger Button ── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Đóng trợ lý pháp lý AI" : "Mở trợ lý pháp lý AI"}
        className={cn(
          "group relative flex h-14 w-14 items-center justify-center rounded-full bg-navy-900 text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gold-600/30",
          isOpen ? "rotate-90 bg-charcoal-900" : "bg-gradient-to-br from-navy-900 via-navy-700 to-navy-900"
        )}
      >
        {/* Subtle pulsing background ring */}
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full bg-gold-600/30 opacity-75 blur-xs animate-ping" />
        )}

        <div className="relative flex items-center justify-center">
          {isOpen ? (
            <X className="h-6 w-6 text-white transition-transform duration-300 rotate-90" />
          ) : (
            <>
              <Bot className="h-7 w-7 text-gold-600 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-navy-900" />
              </span>
            </>
          )}
        </div>
      </button>
    </div>
  );
}

/**
 * Helper to render bold markdown **text** without full markdown parser
 */
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
