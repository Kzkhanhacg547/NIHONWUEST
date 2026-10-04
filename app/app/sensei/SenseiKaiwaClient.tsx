"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, Button, Badge } from "@/components/ui";
import { SenseiAvatar, type AvatarState } from "@/components/SenseiAvatar";
import { SenseiDailyDungeon } from "@/components/SenseiDailyDungeon";
import { N3_KAIWA_SCENARIOS, type KaiwaScenario } from "@/lib/n3KaiwaScenarios";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";
import { kanaToRomaji } from "@/lib/romajiConverter";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  furigana?: string;
  meaning?: string;
  createdAt: string;
}

export function SenseiKaiwaClient() {
  const { playClick, playCorrect, speak: globalSpeak } = useSoundAndTheme();

  // Main Tab State (Kaiwa vs Dungeon)
  const [activeSenseiTab, setActiveSenseiTab] = useState<"KAIWA" | "DUNGEON">("KAIWA");

  // Selected scenario
  const [selectedScenario, setSelectedScenario] = useState<KaiwaScenario>(N3_KAIWA_SCENARIOS[0]);

  // Messages in current conversation
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init_1",
      role: "assistant",
      content: N3_KAIWA_SCENARIOS[0].initialMessage,
      furigana: N3_KAIWA_SCENARIOS[0].initialFurigana,
      meaning: N3_KAIWA_SCENARIOS[0].initialMeaning,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [avatarState, setAvatarState] = useState<AvatarState>("IDLE");
  const [showFurigana, setShowFurigana] = useState(true);
  const [showRomaji, setShowRomaji] = useState(true);
  const [showTranslations, setShowTranslations] = useState(true);
  const [autoVoice, setAutoVoice] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-3.6-flash");
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [tempKeyInput, setTempKeyInput] = useState("");
  const [tempModelInput, setTempModelInput] = useState("gemini-3.6-flash");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const baseInputRef = useRef<string>("");

  // Load API Key & Model from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("nihon_gemini_key");
      const savedModel = localStorage.getItem("nihon_gemini_model");
      if (savedKey) {
        setApiKey(savedKey);
        setTempKeyInput(savedKey);
      }
      if (savedModel) {
        setSelectedModel(savedModel);
        setTempModelInput(savedModel);
      }
    }
  }, []);

  const handleSaveApiKey = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nihon_gemini_key", tempKeyInput.trim());
      localStorage.setItem("nihon_gemini_model", tempModelInput.trim());
      setApiKey(tempKeyInput.trim());
      setSelectedModel(tempModelInput.trim());
      setIsKeyModalOpen(false);
      playCorrect();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // TTS Speech Synthesis with Avatar Lip-Sync using Global TTS
  const speakJapanese = useCallback(
    (text: string) => {
      if (!text) return;

      // Extract Japanese text
      const japaneseMatch = text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3000-\u303F]+/g);
      const cleanJp = japaneseMatch ? japaneseMatch.join(" ") : text;

      setIsSpeaking(true);
      setAvatarState("TALKING");

      globalSpeak(cleanJp);

      const estimatedMs = Math.max(1500, cleanJp.length * 200);
      setTimeout(() => {
        setIsSpeaking(false);
        setAvatarState("IDLE");
      }, estimatedMs);
    },
    [globalSpeak]
  );

  // Play initial scenario message speech on change if autoVoice is on
  const handleSelectScenario = (sc: KaiwaScenario) => {
    playClick();
    setSelectedScenario(sc);
    setConversationId(null);
    const firstMsg: Message = {
      id: `init_${Date.now()}`,
      role: "assistant",
      content: sc.initialMessage,
      furigana: sc.initialFurigana,
      meaning: sc.initialMeaning,
      createdAt: new Date().toISOString(),
    };
    setMessages([firstMsg]);
    if (autoVoice) {
      setTimeout(() => speakJapanese(sc.initialMessage), 300);
    }
  };

  // Web Speech Recognition (Microphone STT) - Accumulate speech without overwriting
  const toggleListening = () => {
    playClick();

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setAvatarState("IDLE");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói. Bạn có thể gõ phím để trò chuyện!");
      return;
    }

    // Save current text in input as base so new speech appends rather than overwrites
    baseInputRef.current = input.trim();

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "ja-JP";
      recognition.continuous = true; // Continuous listening across pauses
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setAvatarState("LISTENING");
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");

        const base = baseInputRef.current;
        const combined = base ? `${base} ${transcript}` : transcript;
        setInput(combined);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setAvatarState("IDLE");
      };

      recognition.onend = () => {
        setIsListening(false);
        setAvatarState("IDLE");
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setAvatarState("IDLE");
    }
  };

  // Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setInput("");
    playClick();

    const matched = selectedScenario.suggestedReplies.find(
      (r) => r.ja.trim() === text.trim()
    );

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      content: text,
      furigana: matched?.furigana,
      meaning: matched?.vi,
      createdAt: new Date().toISOString(),
    };

    const historyPayload = messages.slice(-14).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setAvatarState("LISTENING");

    try {
      const activeKey =
        apiKey?.trim() ||
        (typeof window !== "undefined" ? localStorage.getItem("nihon_gemini_key")?.trim() : "") ||
        undefined;

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationId: conversationId || undefined,
          history: historyPayload,
          scenarioId: selectedScenario.id,
          apiKey: activeKey,
          model: selectedModel || "gemini-3.6-flash",
        }),
      });

      const data = await res.json();
      if (data?.conversationId) {
        setConversationId(data.conversationId);
      }
      if (data?.message?.content) {
        const aiContent = data.message.content;
        const aiMsg: Message = {
          id: data.message.id || `ai_${Date.now()}`,
          role: "assistant",
          content: aiContent,
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, aiMsg]);
        playCorrect();
        setAvatarState("HAPPY");

        if (autoVoice) {
          speakJapanese(aiContent);
        } else {
          setTimeout(() => setAvatarState("IDLE"), 1200);
        }
      }
    } catch {
      // Fallback
      const fallbackMsg: Message = {
        id: `ai_${Date.now()}`,
        role: "assistant",
        content: "とてもよく言えました！その調子でどんどん練習していきましょうね。🌸 (Bạn nói rất tốt! Cứ tiếp tục luyện tập như vậy nhé.)",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setAvatarState("IDLE");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Main Feature Switcher ── */}
      <div className="flex items-center gap-2 bg-white dark:bg-sumi-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <button
          type="button"
          onClick={() => { playClick(); setActiveSenseiTab("KAIWA"); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeSenseiTab === "KAIWA"
              ? "bg-sakura-500 text-white shadow-md shadow-sakura-500/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-sumi-800"
          }`}
        >
          💬 AI Kaiwa (Đàm Thoại)
        </button>
        <button
          type="button"
          onClick={() => { playClick(); setActiveSenseiTab("DUNGEON"); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeSenseiTab === "DUNGEON"
              ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-amber-500/25"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-sumi-800"
          }`}
        >
          🏯 Sensei&apos;s Daily Dungeon
          <span className="bg-amber-300 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full">DAILY</span>
        </button>
      </div>

      {activeSenseiTab === "DUNGEON" ? (
        <SenseiDailyDungeon />
      ) : (
        <>
          {/* Top Banner: Scenario Selector & AI Key Setup */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            CHỦ ĐỀ ĐÀM THOẠI N3 THỰC CHIẾN
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTempKeyInput(apiKey);
                setIsKeyModalOpen(true);
                playClick();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-600/40 transition shadow-xs"
              title="Cài đặt Google Gemini API Key để trò chuyện không giới hạn"
            >
              <span>🔑</span>
              <span>{apiKey ? "AI Key: Đã kết nối" : "Cài đặt AI Key"}</span>
              {apiKey && <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />}
            </button>
            <Badge variant="sakura" dot>
              {selectedScenario.badge}
            </Badge>
          </div>
        </div>

        {/* Horizontal Scenario Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {N3_KAIWA_SCENARIOS.map((sc) => {
            const isSelected = selectedScenario.id === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition-all border ${
                  isSelected
                    ? "bg-sakura-500 text-white border-sakura-500 shadow-md shadow-sakura-500/25 scale-[1.02]"
                    : "bg-white dark:bg-sumi-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <span className="text-base">{sc.icon}</span>
                <span>{sc.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Conversation Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ==========================================
            LEFT / SENSEI AVATAR STAGE (4 cols)
            ========================================== */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-6 text-center border-2 border-sakura-200/80 dark:border-slate-800 bg-gradient-to-b from-sakura-50/40 via-white to-white dark:from-sumi-900 dark:via-sumi-950 dark:to-sumi-900 shadow-md relative overflow-hidden">
            <div className="absolute top-3 left-3">
              <Badge variant={isSpeaking ? "sakura" : isListening ? "fuji" : "matcha"} dot>
                {isSpeaking ? "Đang nói..." : isListening ? "Đang lắng nghe..." : "Sẵn sàng trò chuyện"}
              </Badge>
            </div>

            {/* Sensei Animated Avatar */}
            <div className="pt-5 pb-2">
              <SenseiAvatar
                state={avatarState}
                isSpeaking={isSpeaking}
                isListening={isListening}
                size={190}
                className="mx-auto"
              />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                葵先生 (Aoi Sensei)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Gia sư đàm thoại tiếng Nhật N3
              </p>
            </div>

            {/* Settings Toggles (Furigana, Meaning, Auto-Voice) */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around text-xs">
              <button
                onClick={() => {
                  setShowFurigana(!showFurigana);
                  playClick();
                }}
                className={`px-2.5 py-1 rounded-xl font-bold transition ${
                  showFurigana
                    ? "bg-sakura-50 text-sakura-600 dark:bg-sakura-950/60 dark:text-sakura-300 border border-sakura-200"
                    : "text-slate-400"
                }`}
                title="Bật/Tắt Furigana"
              >
                あ Furigana
              </button>

              <button
                onClick={() => {
                  setShowRomaji(!showRomaji);
                  playClick();
                }}
                className={`px-2.5 py-1 rounded-xl font-bold transition ${
                  showRomaji
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200"
                    : "text-slate-400"
                }`}
                title="Bật/Tắt Phiên âm Romaji"
              >
                🔤 Romaji
              </button>

              <button
                onClick={() => {
                  setShowTranslations(!showTranslations);
                  playClick();
                }}
                className={`px-2.5 py-1 rounded-xl font-bold transition ${
                  showTranslations
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200"
                    : "text-slate-400"
                }`}
                title="Bật/Tắt Dịch nghĩa tiếng Việt"
              >
                🇻🇳 Dịch nghĩa
              </button>

              <button
                onClick={() => {
                  setAutoVoice(!autoVoice);
                  playClick();
                }}
                className={`px-2.5 py-1 rounded-xl font-bold transition ${
                  autoVoice
                    ? "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200"
                    : "text-slate-400"
                }`}
                title="Tự động phát giọng nói khi Sensei trả lời"
              >
                {autoVoice ? "🔊 Tự đọc" : "🔈 Tắt đọc"}
              </button>
            </div>
          </Card>

          {/* Grammar Focus for Current Scenario */}
          <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-sumi-900 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                MẪU CÂU N3 TRỌNG TÂM
              </span>
              <span className="text-xs">💡</span>
            </div>
            <div className="space-y-2">
              {selectedScenario.keyGrammar.map((g, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-slate-50 dark:bg-sumi-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                  <span className="font-bold text-sakura-600 dark:text-sakura-400 font-jp block">
                    {g.pattern}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    {g.meaning}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ==========================================
            RIGHT / CHAT DIALOGUE & MIC (8 cols)
            ========================================== */}
        {/* 650px cố định vượt quá chiều cao màn hình điện thoại nên ô nhập
            liệu bị đẩy khỏi tầm nhìn. */}
        <div className="lg:col-span-8 flex flex-col h-[min(650px,65dvh)] min-h-[420px] sm:h-[650px] sm:min-h-0 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-sumi-900/90 shadow-lg overflow-hidden">
          {/* Header of Chat */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-sumi-950/50">
            <div>
              <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>{selectedScenario.icon}</span>
                <span>{selectedScenario.title}</span>
              </h4>
              <p className="text-[11px] text-slate-500 font-jp mt-0.5">
                {selectedScenario.titleJa}
              </p>
            </div>

            <Button
              onClick={() => handleSelectScenario(selectedScenario)}
              variant="ghost"
              size="sm"
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              🔄 Bắt đầu lại
            </Button>
          </div>

          {/* Messages Scroll View */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div key={msg.id} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && (
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sakura-500 to-rose-500 flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5 shadow-sm">
                      葵
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      isUser
                        ? "bg-gradient-to-r from-sakura-500 to-rose-500 text-white rounded-tr-sm font-medium"
                        : "bg-slate-50 dark:bg-sumi-800 text-slate-800 dark:text-slate-100 border border-slate-200/70 dark:border-slate-700/70 rounded-tl-sm"
                    }`}
                  >
                    {/* Furigana subtext if available */}
                    {showFurigana && msg.furigana && (
                      <p className={`text-[11px] font-jp mb-1 font-medium ${isUser ? "text-rose-100" : "text-slate-400 dark:text-slate-400"}`}>
                        {msg.furigana}
                      </p>
                    )}

                    {/* Main Message Content */}
                    <p className="font-jp text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">
                      {msg.content}
                    </p>

                    {/* Romaji phonetic subtext if enabled */}
                    {showRomaji && (
                      <p className={`text-xs font-mono italic mt-1 leading-relaxed ${isUser ? "text-rose-100" : "text-emerald-600 dark:text-emerald-400"}`}>
                        🔤 {kanaToRomaji(msg.furigana || msg.content)}
                      </p>
                    )}

                    {/* Meaning translation subtext if available */}
                    {showTranslations && msg.meaning && (
                      <p className={`text-xs mt-2 pt-2 border-t italic leading-relaxed ${isUser ? "text-rose-100 border-white/20" : "text-slate-600 dark:text-slate-300 border-slate-200/50 dark:border-slate-700/50"}`}>
                        🇻🇳 {msg.meaning}
                      </p>
                    )}

                    {/* Audio Playback button for Sensei */}
                    {!isUser && (
                      <div className="mt-2.5 flex items-center gap-3 pt-1">
                        <button
                          onClick={() => {
                            playClick();
                            speakJapanese(msg.content);
                          }}
                          className="flex items-center gap-1 text-[11px] font-bold text-sakura-600 dark:text-sakura-400 hover:underline"
                        >
                          🔊 Nghe lại
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 rounded-2xl bg-sakura-500 flex items-center justify-center text-white text-xs font-black animate-pulse">
                  葵
                </div>
                <div className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-sumi-800 text-xs font-medium text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sakura-500 animate-ping" />
                  Sensei đang suy nghĩ câu trả lời...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Suggestions (Chips to never get stuck) */}
          <div className="px-4 py-2 bg-slate-50/70 dark:bg-sumi-950/70 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
              <span>💡 GỢI Ý ĐỐI ĐÁP NHANH (N3)</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {selectedScenario.suggestedReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(reply.ja)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-sumi-800 hover:bg-sakura-50 dark:hover:bg-sakura-950/40 text-slate-700 dark:text-slate-300 hover:text-sakura-600 border border-slate-200 dark:border-slate-700 text-xs font-medium shrink-0 text-left transition max-w-[280px] truncate shadow-2xs"
                  title={reply.vi}
                >
                  <span className="font-jp font-bold truncate block">{reply.ja}</span>
                  <span className="text-[10px] text-slate-400 truncate block mt-0.5">{reply.vi}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Input Box + Microphone Action */}
          <div className="p-3 sm:p-4 bg-white dark:bg-sumi-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            {/* Microphone Button with Sound Wave Pulse */}
            <button
              onClick={toggleListening}
              className={`p-3.5 rounded-2xl text-lg transition-all shrink-0 flex items-center justify-center shadow-md ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse shadow-rose-500/40 scale-105"
                  : "bg-slate-100 dark:bg-sumi-800 text-slate-700 dark:text-slate-200 hover:bg-sakura-50 hover:text-sakura-600"
              }`}
              title={isListening ? "Đang thu âm... Nhấn để dừng" : "Nhấn để nói tiếng Nhật (Micro)"}
            >
              {isListening ? "🔴" : "🎙️"}
            </button>

            {/* Text input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={isListening ? "Đang lắng nghe giọng nói tiếng Nhật..." : "Nhập câu tiếng Nhật hoặc bấm Micro để nói..."}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-sumi-950 text-sm font-jp focus:outline-none focus:ring-2 focus:ring-sakura-500 dark:text-white"
            />

            {/* Send Button */}
            <Button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || loading}
              variant="sakura"
              size="md"
              className="px-5 font-black shrink-0 shadow-md shadow-sakura-500/25"
            >
              Gửi 🚀
            </Button>
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-sumi-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔑</span>
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  Cấu hình Google Gemini AI Key
                </h3>
              </div>
              <button
                onClick={() => setIsKeyModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-sumi-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Nhập Google Gemini API Key để mở khóa toàn bộ trí thông minh đàm thoại tiếng Nhật (Gemini 1.5 Flash), nói chuyện tự do mọi chủ đề. Khóa được lưu trực tiếp trên trình duyệt của bạn.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>API Key (Hỗ trợ Bể nhiều Key & Đa nền tảng):</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Tự động đảo Key khi hết hạn ngạch</span>
              </label>
              <textarea
                rows={3}
                value={tempKeyInput}
                onChange={(e) => setTempKeyInput(e.target.value)}
                placeholder="Dán 1 hoặc nhiều Gemini Key (AIzaSy...), Groq Key (gsk_...), OpenRouter Key (sk-or-)... Mỗi key 1 dòng hoặc cách nhau bằng dấu phẩy"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-sumi-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white resize-none"
              />
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                💡 <strong>Mẹo:</strong> Bạn có thể tạo 2-3 Google Gemini key từ các tài khoản Google khác nhau và dán vào đây để hệ thống tự luân phiên, không bao giờ lo bị nghẽn!
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Chọn Mô hình AI (Gemini 3 / Groq):</span>
                <span className="text-[10px] text-amber-500 font-normal">Tự động chuyển model nếu 503</span>
              </label>
              <select
                value={tempModelInput}
                onChange={(e) => setTempModelInput(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-sumi-950 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="gemini-3.6-flash">⚡ Gemini 3.6 Flash (Chính thức từ Google - Khuyên dùng)</option>
                <option value="gemini-3.6-flash-preview">🧪 Gemini 3.6 Flash Preview</option>
                <option value="gemini-3.8-flash">🚀 Gemini 3.8 Flash (Tốc độ cao)</option>
                <option value="gemini-3.6-pro">🌟 Gemini 3.6 Pro (Chuyên sâu cao cấp)</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-[11px] text-amber-800 dark:text-amber-300 space-y-1.5">
              <div className="font-bold flex items-center gap-1">
                <span>💡</span>
                <span>Nơi lấy API Key miễn phí không giới hạn:</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[10px]">
                <li>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline text-amber-900 dark:text-amber-200 hover:text-amber-600"
                  >
                    Google AI Studio (Gemini 3.6 Flash miễn phí) ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline text-amber-900 dark:text-amber-200 hover:text-amber-600"
                  >
                    Groq Cloud (gsk_... 14,400 lượt/ngày cực nhanh) ↗
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2">
              {apiKey ? (
                <button
                  onClick={() => {
                    localStorage.removeItem("nihon_gemini_key");
                    setApiKey("");
                    setTempKeyInput("");
                    setIsKeyModalOpen(false);
                  }}
                  className="text-xs font-bold text-rose-500 hover:underline"
                >
                  Xóa Key đã lưu
                </button>
              ) : (
                <span className="text-[11px] text-slate-400">Chưa cài đặt</span>
              )}

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsKeyModalOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                >
                  Đóng
                </Button>
                <Button
                  onClick={handleSaveApiKey}
                  variant="primary"
                  size="sm"
                  className="text-xs font-black bg-amber-500 hover:bg-amber-600 text-slate-950 border-none shadow-md shadow-amber-500/20"
                >
                  Lưu Key 💾
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
