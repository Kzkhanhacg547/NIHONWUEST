"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card } from "@/components/ui";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";

interface AiMsg {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface SenseiClientProps {
  conversationId?: string;
  initialMessages?: AiMsg[];
}

const QUICK_PROMPTS = [
  { icon: "⚡", text: "Giải thích sự khác nhau giữa は và が" },
  { icon: "🍜", text: "Luyện hội thoại gọi món tại nhà hàng" },
  { icon: "📝", text: "Sửa lỗi câu tiếng Nhật của tôi" },
  { icon: "🏯", text: "Dạy tôi 5 câu hỏi đường thông dụng" },
  { icon: "🌸", text: "Giải thích cách dùng て-form" },
  { icon: "🎌", text: "Học từ vựng về thời tiết tiếng Nhật" },
];

function MessageBubble({ msg }: { msg: AiMsg }) {
  const isUser = msg.role === "user";
  const { playClick, speak: globalSpeak } = useSoundAndTheme();

  const speak = (text: string) => {
    const japaneseMatch = text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g);
    const jpText = japaneseMatch?.join("") || text;
    globalSpeak(jpText);
    playClick();
  };

  // Convert markdown to basic HTML-like rendering
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, i) => {
      // Headers
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={i} className="font-black text-base my-1">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }
      // Bold text inline
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const rendered = parts.map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={j}>{part.replace(/\*\*/g, "")}</strong>;
        }
        return <span key={j}>{part}</span>;
      });

      // Table rows
      if (line.startsWith("|")) {
        return (
          <div key={i} className="font-mono text-xs bg-black/10 rounded px-2 py-0.5 my-0.5 overflow-x-auto">
            {line}
          </div>
        );
      }

      // Bullet points
      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <div key={i} className="flex gap-1.5 ml-2">
            <span className="shrink-0">•</span>
            <span>{rendered.slice(1)}</span>
          </div>
        );
      }

      if (line.trim() === "" || line === "---") {
        return <div key={i} className="h-1" />;
      }

      return (
        <p key={i} className="leading-relaxed">
          {rendered}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sakura-500 to-rose-500 flex items-center justify-center text-white text-sm font-black shrink-0 mt-1 shadow-md shadow-sakura-500/30">
          葵
        </div>
      )}
      <div
        className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-sakura-500 to-rose-500 text-white rounded-tr-sm"
            : "bg-white dark:bg-sumi-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-tl-sm"
        }`}
      >
        <div className="space-y-0.5">{renderContent(msg.content)}</div>
        {!isUser && (
          <button
            onClick={() => speak(msg.content)}
            className="mt-2 flex items-center gap-1 text-[11px] font-bold text-sakura-500 dark:text-sakura-400 hover:underline"
            title="Phát âm tiếng Nhật"
          >
            🔊 Nghe phát âm
          </button>
        )}
      </div>
      {isUser && (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-sm shrink-0 mt-1">
          👤
        </div>
      )}
    </div>
  );
}

export function SenseiClient({ conversationId: initialConvId, initialMessages = [] }: SenseiClientProps) {
  const { playClick, playCorrect, showToast } = useSoundAndTheme();
  const [messages, setMessages] = useState<AiMsg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(initialConvId);
  const [isTyping, setIsTyping] = useState(false);
  const [geminiKey, setGeminiKey] = useState<string>("");
  const [tempKeyInput, setTempKeyInput] = useState<string>("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load saved key from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nihon_gemini_api_key") || "";
      setGeminiKey(saved);
      setTempKeyInput(saved);
    }
  }, []);

  const saveGeminiKey = (key: string) => {
    const trimmed = key.trim();
    setGeminiKey(trimmed);
    if (typeof window !== "undefined") {
      if (trimmed) {
        localStorage.setItem("nihon_gemini_api_key", trimmed);
        showToast({ title: "Đã lưu Google Gemini API Key thành công!", type: "success" });
      } else {
        localStorage.removeItem("nihon_gemini_api_key");
        showToast({ title: "Đã chuyển về chế độ Sổ Tay Ngoại Tuyến.", type: "info" });
      }
    }
    setShowKeyModal(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: AiMsg = {
        id: `tmp-${Date.now()}`,
        role: "user",
        content: text.trim(),
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);
      setIsTyping(true);
      playClick();

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text.trim(),
            conversationId,
            apiKey: geminiKey || undefined,
          }),
        });

        if (!res.ok) throw new Error("API error");

        const data = await res.json();
        setConversationId(data.conversationId);

        const aiMsg: AiMsg = {
          id: data.message.id,
          role: "assistant",
          content: data.message.content,
          createdAt: data.message.createdAt,
        };

        setIsTyping(false);
        setMessages((prev) => [...prev, aiMsg]);
        playCorrect();
      } catch {
        setIsTyping(false);
        showToast({ title: "Không thể kết nối với Aoi Sensei. Vui lòng thử lại！", type: "error" });
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [loading, conversationId, geminiKey, playClick, playCorrect, showToast]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    // dvh chứ không phải vh: 100vh của Safari/Chrome di động tính cả phần sau
    // thanh công cụ ẩn/hiện nên khung chat tràn xuống dưới màn hình.
    <div className="flex flex-col h-[calc(100dvh-11rem)] max-h-[720px] max-sm:min-h-[420px]">
      {/* Sensei Profile Header */}
      <Card className="p-4 mb-4 bg-gradient-to-r from-sakura-50 via-rose-50 to-amber-50/40 dark:from-sumi-900 dark:to-sumi-950 border-sakura-200 dark:border-sakura-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-sakura-400 via-rose-500 to-amber-400 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-sakura-500/30">
                葵
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white dark:border-sumi-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  葵先生 <span className="text-sakura-600 dark:text-sakura-400 font-bold">(Aoi Sensei)</span>
                </h3>
                {geminiKey ? (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    ✨ Google Gemini AI
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-sumi-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                    📖 Sổ Tay Ngoại Tuyến
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {geminiKey
                  ? "Được kích hoạt bởi Google AI (Gemini 1.5 Flash) · Thông minh & Tự nhiên"
                  : "Gia sư tiếng Nhật N5 · Tra cứu ngữ pháp & từ vựng tức thì"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => {
                setTempKeyInput(geminiKey);
                setShowKeyModal(true);
                playClick();
              }}
              className="px-3 py-2.5 min-h-11 rounded-xl bg-white dark:bg-sumi-800 text-slate-700 dark:text-slate-200 hover:border-sakura-400 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>⚙️</span>
              <span>{geminiKey ? "Cấu Hình Google AI" : "Tích Hợp Google AI (Free)"}</span>
            </button>
            {messages.length > 0 && (
              <button
                onClick={() => {
                  setMessages([]);
                  setConversationId(undefined);
                  playClick();
                }}
                className="px-3 py-2.5 min-h-11 rounded-xl bg-white dark:bg-sumi-800 text-slate-600 dark:text-slate-400 hover:text-red-500 border border-slate-200 dark:border-slate-700 text-xs font-bold transition shadow-sm"
                title="Tạo cuộc trò chuyện mới"
              >
                Làm mới
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Google AI Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-sumi-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-md">
                  G
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-base">
                    Tích Hợp Google Gemini AI
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sử dụng model Gemini tốc độ cao, hoàn toàn miễn phí
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                aria-label="Đóng"
                className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-sumi-800 text-slate-500 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 space-y-1.5">
              <p className="font-bold flex items-center gap-1">
                <span>💡</span> Cách lấy API Key miễn phí 100%:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-blue-800 dark:text-blue-300">
                <li>
                  Truy cập{" "}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline text-blue-600 dark:text-blue-400 hover:opacity-80"
                  >
                    Google AI Studio
                  </a>{" "}
                  (đăng nhập tài khoản Google của bạn).
                </li>
                <li>Bấm <strong>Create API Key</strong> (không cần nhập thẻ tín dụng).</li>
                <li>Sao chép key và dán vào ô bên dưới để trò chuyện thông minh không giới hạn!</li>
              </ol>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                Google Gemini API Key:
              </label>
              <input
                type="password"
                value={tempKeyInput}
                onChange={(e) => setTempKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full min-h-11 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-sumi-950 text-slate-900 dark:text-white text-base sm:text-sm font-mono focus:outline-none focus:border-sakura-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Key chỉ được lưu trữ cục bộ trong trình duyệt của bạn (LocalStorage).
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              {geminiKey ? (
                <button
                  type="button"
                  onClick={() => saveGeminiKey("")}
                  className="px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 text-xs font-bold transition"
                >
                  Xóa Key & Dùng Offline
                </button>
              ) : (
                <div />
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-sumi-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => saveGeminiKey(tempKeyInput)}
                  className="px-4 py-2 rounded-xl bg-sakura-600 hover:bg-sakura-500 text-white text-xs font-black shadow-md transition"
                >
                  Lưu & Áp Dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
        {messages.length === 0 && (
          <div className="text-center py-8 space-y-3">
            <div className="text-4xl">🌸</div>
            <p className="font-black text-slate-700 dark:text-slate-200">
              Chào mừng đến với lớp học của Aoi Sensei！
            </p>
            <p className="text-sm text-slate-500">
              Hãy đặt câu hỏi hoặc chọn một chủ đề bên dưới để bắt đầu：
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt.text)}
                  className="flex items-start gap-2 p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-sakura-300 dark:hover:border-sakura-700 bg-white dark:bg-sumi-900 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all hover:scale-[1.02] hover:shadow-sm"
                >
                  <span className="text-base shrink-0">{prompt.icon}</span>
                  <span>{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sakura-500 to-rose-500 flex items-center justify-center text-white text-sm font-black shrink-0 shadow-md">
              葵
            </div>
            <div className="bg-white dark:bg-sumi-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sakura-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-sakura-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-sakura-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="text-xs text-slate-400 ml-1">Aoi Sensei đang soạn câu trả lời...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts (when messages exist) */}
      {messages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto py-2 shrink-0 no-scrollbar">
          {QUICK_PROMPTS.slice(0, 4).map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendMessage(prompt.text)}
              disabled={loading}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-sumi-900 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-sakura-300 hover:text-sakura-600 transition-all disabled:opacity-50"
            >
              <span>{prompt.icon}</span>
              <span className="whitespace-nowrap">{prompt.text}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="mt-3 shrink-0">
        <div className="flex gap-2 items-end bg-white dark:bg-sumi-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 focus-within:border-sakura-400 dark:focus-within:border-sakura-700 transition-colors p-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Hỏi Aoi Sensei về tiếng Nhật... (Enter để gửi)"
            rows={2}
            className="flex-1 resize-none bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none leading-relaxed"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-sakura-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-sakura-500/30 hover:scale-105 transition-transform disabled:opacity-40 disabled:scale-100"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 text-center">
          Nhấn <kbd className="px-1 rounded bg-slate-100 dark:bg-sumi-800 text-slate-500 text-[10px]">Enter</kbd> để gửi ·{" "}
          <kbd className="px-1 rounded bg-slate-100 dark:bg-sumi-800 text-slate-500 text-[10px]">Shift+Enter</kbd> để xuống dòng
        </p>
      </div>
    </div>
  );
}
