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
  ChevronDown,
  Quote,
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
                      <CopyActionButton
                        text={msg.text}
                        id={msg.id}
                        copiedId={copiedId}
                        onCopy={handleCopy}
                        size="sm"
                      />
                    </div>
                  )}

                  {/* Formatted Text với Markdown & Legal Quotes */}
                  <div className="leading-relaxed text-[13px] text-charcoal-900">
                    {parseMessageBlocks(msg.text).map((block, idx) => {
                      if (block.type === "h3" || block.type === "section_title") {
                        return (
                          <div key={idx} className="mt-2.5 mb-1 font-bold text-navy-900 text-[13px]">
                            {renderFormattedText(block.text || "")}
                          </div>
                        );
                      }
                      if (block.type === "quote") {
                        return (
                          <div
                            key={idx}
                            className="my-2 rounded-lg border-l-3 border-gold-600 bg-neutral-50 p-2.5 text-xs text-charcoal-800"
                          >
                            <div className="flex items-start gap-1.5">
                              <Quote className="h-3.5 w-3.5 shrink-0 text-gold-600 mt-0.5 opacity-80" />
                              <div className="space-y-1 font-serif italic leading-relaxed">
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
                          <div key={idx} className="my-0.5 flex items-start gap-1.5 pl-1">
                            <span className="text-gold-600 font-bold text-xs mt-0.5">•</span>
                            <span className="leading-relaxed">{renderFormattedText(block.text || "")}</span>
                          </div>
                        );
                      }
                      if (block.type === "space") {
                        return <div key={idx} className="h-1.5" />;
                      }
                      return (
                        <p key={idx} className="my-1 leading-relaxed">
                          {renderFormattedText(block.text || "")}
                        </p>
                      );
                    })}
                  </div>

                  {/* Citations list gọn gàng, thu gọn */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2.5 border-t border-neutral-100 pt-2">
                      <details className="group rounded-lg bg-neutral-50 p-2 text-[11px] text-charcoal-600 border border-neutral-200/70">
                        <summary className="flex cursor-pointer items-center justify-between font-semibold text-navy-900 select-none list-none">
                          <span className="flex items-center gap-1.5">
                            <Scale className="h-3 w-3 text-gold-600" />
                            <span>Căn cứ pháp lý đối chiếu ({msg.citations.length})</span>
                          </span>
                          <ChevronDown className="h-3 w-3 text-neutral-400 transition-transform duration-200 group-open:rotate-180" />
                        </summary>
                        <ul className="mt-2 space-y-1.5 border-t border-neutral-200/60 pt-1.5">
                          {msg.citations.map((c, i) => {
                            const { docName, article } = formatCitationBreadcrumb(c);
                            return (
                              <li key={i} className="flex items-start gap-1.5 text-charcoal-800 leading-normal">
                                <span className="mt-1 h-1 w-1 rounded-full bg-gold-600 shrink-0" />
                                <div>
                                  <span className="font-semibold text-navy-900">{docName}</span>
                                  {article && (
                                    <span className="text-charcoal-600 block text-[10px]">{article}</span>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </details>
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
            ? "h-6 w-6 rounded-md text-charcoal-600/70 hover:bg-neutral-100 hover:text-navy-900"
            : "h-7.5 w-7.5 rounded-full border border-neutral-300 bg-white text-charcoal-600 hover:bg-neutral-50 hover:text-navy-900 shadow-2xs",
          isCopied && "text-emerald-600 hover:text-emerald-700 border-emerald-200 bg-emerald-50/50"
        )}
      >
        {isCopied ? (
          <Check className={cn(isSm ? "h-3 w-3" : "h-3.5 w-3.5", "text-emerald-600 transition-transform scale-110")} />
        ) : (
          <Copy className={cn(isSm ? "h-3 w-3" : "h-3.5 w-3.5", "transition-transform group-hover/copy:scale-105")} />
        )}
      </button>

      {/* Floating Tooltip kiểu ChatGPT / Claude */}
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 shadow-md transition-all duration-150 group-hover/copy:opacity-100 group-hover/copy:-translate-y-0.5 z-30">
        {isCopied ? "Đã sao chép!" : "Sao chép"}
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
      </span>
    </div>
  );
}
