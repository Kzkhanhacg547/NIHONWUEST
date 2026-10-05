"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { Button, Badge, Icon, Modal, Tabs } from "@/components/ui";
import { SenseiAvatar, type AvatarState } from "@/components/SenseiAvatar";
import { SenseiDailyDungeon } from "@/components/SenseiDailyDungeon";
import { N3_KAIWA_SCENARIOS, type KaiwaScenario } from "@/lib/n3KaiwaScenarios";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";
import { kanaToRomaji } from "@/lib/romajiConverter";
import { SENSEI_CHARACTERS, DEFAULT_SENSEI_ID, type SenseiCharacterId } from "@/lib/senseiCharacters";
import { useSenseiVoice } from "@/lib/useSenseiVoice";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  furigana?: string;
  meaning?: string;
  createdAt: string;
}

/** Con dấu đỏ "葵" (hanko) — định danh Sensei trong khung chat. */
function Seal({ className = "", char = "葵" }: { className?: string; char?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-red-600 font-jp font-black text-white shadow-sm ring-2 ring-white dark:ring-sumi-900 ${className}`}
    >
      {char}
    </span>
  );
}

function MicIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6" />
    </svg>
  );
}

function ToggleChip({
  on,
  onClick,
  title,
  children,
}: {
  on: boolean;
  onClick: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      title={title}
      className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 ${
        on
          ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300"
          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800 dark:border-slate-700 dark:bg-sumi-900 dark:text-slate-400 dark:hover:text-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

export function SenseiKaiwaClient() {
  const { playClick, playCorrect } = useSoundAndTheme();

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
  const [isListening, setIsListening] = useState(false);
  const [avatarState, setAvatarState] = useState<AvatarState>("IDLE");
  const [characterId, setCharacterId] = useState<SenseiCharacterId>(DEFAULT_SENSEI_ID);
  const character = SENSEI_CHARACTERS[characterId];
  // Giọng đọc + khẩu hình theo giới tính của nhân vật (không dùng giọng mặc định của thiết bị).
  const voice = useSenseiVoice(character);
  const isSpeaking = voice.isSpeaking;
  const greetOnSwitch = useRef(false);
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

  // Nhớ Sensei người học đã chọn
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nihon_sensei_character");
      if (saved && saved in SENSEI_CHARACTERS) setCharacterId(saved as SenseiCharacterId);
    } catch {
      /* localStorage bị chặn: dùng mặc định */
    }
  }, []);

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

  // Ổn định tham chiếu: Modal chạy lại effect (và đoạt focus) khi onClose đổi,
  // nên nếu truyền arrow inline thì mỗi lần gõ phím sẽ nhảy focus khỏi ô nhập key.
  const closeKeyModal = useCallback(() => setIsKeyModalOpen(false), []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Giọng đọc theo giới tính nhân vật. Khẩu hình chạy theo sự kiện của chính utterance
  // (onstart / onboundary / onend), không còn setTimeout ước lượng độ dài.
  const speakJapanese = useCallback(
    (text: string, reading?: string) => {
      if (!text) return;
      voice.speak(text, { reading });
    },
    [voice.speak] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Avatar đang "nói" đúng khi âm thanh thật đang phát.
  useEffect(() => {
    if (voice.isSpeaking) setAvatarState("TALKING");
    else setAvatarState((st) => (st === "TALKING" ? "IDLE" : st));
  }, [voice.isSpeaking]);

  const handleSelectCharacter = (id: SenseiCharacterId) => {
    if (id === characterId) return;
    playClick();
    try {
      localStorage.setItem("nihon_sensei_character", id);
    } catch {
      /* bỏ qua */
    }
    greetOnSwitch.current = autoVoice;
    setCharacterId(id);
  };

  // Chào bằng giọng mới ngay sau khi đổi Sensei (người học nghe là biết giới tính có khớp không).
  // Effect của hook (cancel giọng cũ) chạy trước effect này trong cùng một lần commit.
  useEffect(() => {
    if (!greetOnSwitch.current) return;
    greetOnSwitch.current = false;
    speakJapanese(character.greeting.ja, character.greeting.reading);
  }, [characterId]); // eslint-disable-line react-hooks/exhaustive-deps

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
      setTimeout(() => speakJapanese(sc.initialMessage, sc.initialFurigana), 300);
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

    voice.cancel(); // không để giọng Sensei lọt vào micro
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

  // ── Dữ liệu dẫn xuất cho giao diện (không ảnh hưởng logic) ──
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");

  const statusLabel = loading
    ? "Đang soạn câu trả lời..."
    : isSpeaking
    ? "Đang nói..."
    : isListening
    ? "Đang lắng nghe..."
    : "Sẵn sàng trò chuyện";
  const statusVariant = loading ? "amber" : isSpeaking ? "sakura" : isListening ? "fuji" : "matcha";

  // Câu thoại của Sensei trong bong bóng — là text thật, đổi theo trạng thái.
  const bubble = loading
    ? { ja: "少し考えますね…", vi: `Để ${character.viRef} suy nghĩ một chút nhé…` }
    : isListening
    ? { ja: "どうぞ、聞いていますよ。", vi: `Mời em nói, ${character.viRef} đang nghe đây.` }
    : isSpeaking
    ? { ja: "よく聞いてくださいね。", vi: "Em nghe kỹ nhé." }
    : avatarState === "HAPPY"
    ? { ja: "いいですね！その調子！", vi: "Rất tốt! Cứ thế phát huy nhé!" }
    : { ja: "今日は何を話しましょうか？", vi: "Hôm nay chúng ta nói về chủ đề gì nhỉ?" };

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* ── Thanh trên: chuyển chế độ + AI key ── */}
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b border-slate-200 dark:border-slate-800">
        <Tabs
          ariaLabel="Chế độ luyện tập với Sensei"
          value={activeSenseiTab}
          onChange={(id) => {
            playClick();
            setActiveSenseiTab(id as "KAIWA" | "DUNGEON");
          }}
          items={[
            { id: "KAIWA", label: "AI Kaiwa (Đàm Thoại)", icon: <Icon name="chat" className="h-4 w-4" /> },
            { id: "DUNGEON", label: "Sensei's Daily Dungeon", icon: <Icon name="flame" className="h-4 w-4" /> },
          ]}
          className="flex items-center"
          tabClassName="-mb-px inline-flex min-h-11 items-center gap-2 border-b-2 border-transparent px-4 text-sm font-bold text-slate-500 transition hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-red-500 aria-selected:border-red-600 aria-selected:text-red-600 dark:text-slate-400 dark:hover:text-white dark:aria-selected:border-red-400 dark:aria-selected:text-red-400"
        />

        {activeSenseiTab === "KAIWA" && (
          <button
            type="button"
            onClick={() => {
              setTempKeyInput(apiKey);
              setIsKeyModalOpen(true);
              playClick();
            }}
            className="mb-1.5 inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-slate-700 dark:bg-sumi-900 dark:text-slate-200"
            title="Cài đặt Google Gemini API Key để trò chuyện không giới hạn"
          >
            <Icon name="settings" className="h-4 w-4 text-slate-500" />
            <span>{apiKey ? "AI Key: Đã kết nối" : "Cài đặt AI Key"}</span>
            {apiKey && <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-500" />}
          </button>
        )}
      </div>

      {activeSenseiTab === "DUNGEON" ? (
        <SenseiDailyDungeon />
      ) : (
        <>
          {/* ── Chủ đề đàm thoại ── */}
          <section aria-labelledby="scenario-heading" className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2
                id="scenario-heading"
                className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400"
              >
                Chủ đề đàm thoại N3 thực chiến
              </h2>
              <Badge variant="sakura" dot>
                {selectedScenario.badge}
              </Badge>
            </div>

            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
              {N3_KAIWA_SCENARIOS.map((sc) => {
                const isSelected = selectedScenario.id === sc.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => handleSelectScenario(sc)}
                    aria-pressed={isSelected}
                    className={`flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 ${
                      isSelected
                        ? "border-red-600 bg-red-600 text-white shadow-sm shadow-red-600/25"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-sumi-900 dark:text-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <span className="text-base leading-none">{sc.icon}</span>
                    <span>{sc.title}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Sân khấu Sensei (trái) + Hội thoại (phải) ── */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start lg:gap-6">
            {/* SENSEI STAGE */}
            <section
              aria-label={character.nameRomaji}
              className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-[#fbf8f3] p-4 shadow-sm dark:border-slate-800 dark:bg-sumi-900 sm:p-5 lg:col-span-4 lg:col-start-1 lg:row-start-1"
            >
              {/* Giấy washi + lưới shoji rất mờ */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(148,163,184,.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,.16) 1px, transparent 1px)",
                  backgroundSize: "44px 44px",
                  WebkitMaskImage: "linear-gradient(to bottom, black, transparent 75%)",
                  maskImage: "linear-gradient(to bottom, black, transparent 75%)",
                }}
              />
              {/* Núi Phú Sĩ mờ ở chân khung */}
              <svg
                aria-hidden="true"
                viewBox="0 0 240 100"
                preserveAspectRatio="xMidYMax slice"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 w-full opacity-60 dark:opacity-30"
              >
                <path
                  d="M0 100 L0 92 C40 84 80 60 104 34 Q120 22 136 34 C160 60 200 84 240 92 L240 100 Z"
                  className="fill-slate-200 dark:fill-slate-700"
                />
                <path
                  d="M104 34 Q120 22 136 34 C139 38 142 43 146 47 L136 43 L128 51 L120 41 L110 50 L102 44 C102 40 103 37 104 34 Z"
                  className="fill-white dark:fill-slate-500"
                />
              </svg>

              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant={statusVariant} dot>
                    {statusLabel}
                  </Badge>
                  <Badge variant="brand">JLPT N3</Badge>
                </div>

                {/* Mobile: avatar nhỏ cạnh bong bóng; desktop: avatar lớn ở trên */}
                <div className="mt-3 flex items-center gap-3 lg:flex-col lg:gap-4">
                  <div className="w-28 shrink-0 sm:w-36 lg:w-full lg:max-w-[260px]">
                    <SenseiAvatar
                      state={avatarState}
                      isSpeaking={isSpeaking}
                      isListening={isListening}
                      size={260}
                      character={character}
                      viseme={voice.viseme}
                    />
                  </div>

                  <div className="min-w-0 flex-1 lg:w-full lg:flex-none">
                    <div className="mb-2.5 lg:text-center">
                      <h3 className="flex items-baseline gap-1.5 lg:justify-center">
                        <span lang="ja" className="font-jp text-lg font-black text-slate-900 dark:text-white">
                          {character.nameJa}
                        </span>
                        <span className="text-sm font-bold text-red-600 dark:text-red-400">{character.nameRomaji}</span>
                      </h3>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Gia sư đàm thoại tiếng Nhật N3
                      </p>
                    </div>

                    {/* Bong bóng thoại — text thật, không nằm trong ảnh */}
                    <div className="relative rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-sumi-800">
                      <span
                        aria-hidden="true"
                        className="absolute -left-1.5 top-5 h-3 w-3 rotate-45 border-b border-l border-slate-200 bg-white dark:border-slate-700 dark:bg-sumi-800 lg:-top-1.5 lg:left-1/2 lg:-ml-1.5 lg:border-b-0 lg:border-l lg:border-t"
                      />
                      <p lang="ja" className="font-jp text-[15px] font-bold leading-snug text-slate-900 dark:text-white">
                        「{bubble.ja}」
                      </p>
                      {showTranslations && (
                        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{bubble.vi}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hành động nhanh */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button
                    onClick={toggleListening}
                    variant={isListening ? "brand" : "brandOutline"}
                    size="sm"
                    aria-pressed={isListening}
                  >
                    <MicIcon className="h-4 w-4" />
                    {isListening ? "Dừng nghe" : "Nói với Sensei"}
                  </Button>
                  <Button
                    onClick={() => {
                      if (!lastAssistant) return;
                      playClick();
                      speakJapanese(lastAssistant.content, lastAssistant.furigana);
                    }}
                    disabled={!lastAssistant}
                    variant="secondary"
                    size="sm"
                  >
                    <Icon name="speaker" className="h-4 w-4" />
                    Nghe lại
                  </Button>
                </div>

                {/* Chọn Sensei (nữ / nam) + giọng đọc tương ứng */}
                <div className="mt-4 border-t border-slate-200/70 pt-3 dark:border-slate-700">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Chọn Sensei
                  </p>
                  <div role="radiogroup" aria-label="Chọn giáo viên và giọng đọc" className="mt-2 grid grid-cols-2 gap-2">
                    {Object.values(SENSEI_CHARACTERS).map((c) => {
                      const on = c.id === characterId;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => handleSelectCharacter(c.id)}
                          className={`flex min-h-11 items-center gap-2 rounded-xl border px-2.5 py-1.5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 ${
                            on
                              ? "border-red-300 bg-red-50 dark:border-red-900/70 dark:bg-red-950/40"
                              : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-sumi-900"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            lang="ja"
                            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-jp text-sm font-black text-white ${
                              on ? "bg-red-600" : "bg-slate-400 dark:bg-slate-600"
                            }`}
                          >
                            {c.seal}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-xs font-extrabold text-slate-900 dark:text-white">
                              {c.nameRomaji}
                            </span>
                            <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                              Giọng {c.genderLabel.toLowerCase()}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {!voice.supported ? (
                    <p className="mt-2 text-[11px] text-amber-700 dark:text-amber-400">
                      Trình duyệt này không hỗ trợ giọng đọc. Hãy thử Chrome, Edge hoặc Safari.
                    </p>
                  ) : (
                    <>
                      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <Icon name="speaker" className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {voice.activeVoice ? voice.activeVoice.name : "Chưa tìm thấy giọng tiếng Nhật"}
                        </span>
                      </p>
                      {!voice.exactMatch && voice.activeVoice && (
                        <p className="mt-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] leading-relaxed text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                          Thiết bị chưa có giọng {character.genderLabel.toLowerCase()} tiếng Nhật nên đang dùng giọng
                          sẵn có và chỉnh tông. Bạn có thể chọn giọng khác bên dưới.
                        </p>
                      )}
                      {voice.voices.length > 0 && (
                        <details className="mt-2 text-[11px] text-slate-600 dark:text-slate-300">
                          <summary className="cursor-pointer select-none font-bold">Đổi giọng đọc</summary>
                          <label htmlFor="sensei-voice" className="sr-only">
                            Giọng đọc tiếng Nhật
                          </label>
                          <select
                            id="sensei-voice"
                            value={voice.selectedURI ?? ""}
                            onChange={(e) => voice.setVoiceURI(e.target.value || null)}
                            className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-2.5 text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-slate-700 dark:bg-sumi-950 dark:text-slate-200 sm:text-xs"
                          >
                            <option value="">Tự chọn theo giới tính</option>
                            {voice.voices.map((v) => (
                              <option key={v.uri} value={v.uri}>
                                {v.name} ({v.guess === "female" ? "nữ" : v.guess === "male" ? "nam" : "chưa rõ"})
                              </option>
                            ))}
                          </select>
                        </details>
                      )}
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* CHAT PANEL */}
            <section
              aria-label={`Hội thoại với ${character.nameRomaji}`}
              className="flex h-[min(680px,72dvh)] min-h-[440px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-sumi-900 sm:h-[680px] sm:min-h-0 lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-1"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-800 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-red-50 text-xl dark:bg-red-950/40">
                    {selectedScenario.icon}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-extrabold text-slate-900 dark:text-white">
                      {selectedScenario.title}
                    </h3>
                    <p lang="ja" className="truncate font-jp text-[11px] text-slate-500">
                      {selectedScenario.titleJa}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleSelectScenario(selectedScenario)}
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-xs text-slate-500 hover:text-slate-800"
                >
                  <Icon name="refresh" className="h-3.5 w-3.5" />
                  Bắt đầu lại
                </Button>
              </div>

              {/* Tùy chọn hiển thị */}
              <div
                role="group"
                aria-label="Tùy chọn hiển thị"
                className="no-scrollbar flex items-center gap-2 overflow-x-auto border-b border-slate-100 bg-slate-50/60 px-4 py-2 dark:border-slate-800 dark:bg-sumi-950/40 sm:px-5"
              >
                <ToggleChip
                  on={showFurigana}
                  onClick={() => {
                    setShowFurigana(!showFurigana);
                    playClick();
                  }}
                  title="Bật/Tắt Furigana"
                >
                  <span lang="ja" className="font-jp">あ</span> Furigana
                </ToggleChip>
                <ToggleChip
                  on={showRomaji}
                  onClick={() => {
                    setShowRomaji(!showRomaji);
                    playClick();
                  }}
                  title="Bật/Tắt Phiên âm Romaji"
                >
                  <span className="font-mono">Aa</span> Romaji
                </ToggleChip>
                <ToggleChip
                  on={showTranslations}
                  onClick={() => {
                    setShowTranslations(!showTranslations);
                    playClick();
                  }}
                  title="Bật/Tắt Dịch nghĩa tiếng Việt"
                >
                  <span className="font-bold">VI</span> Dịch nghĩa
                </ToggleChip>
                <ToggleChip
                  on={autoVoice}
                  onClick={() => {
                    setAutoVoice(!autoVoice);
                    playClick();
                  }}
                  title="Tự động phát giọng nói khi Sensei trả lời"
                >
                  <Icon name="speaker" className="h-3.5 w-3.5" />
                  {autoVoice ? "Tự đọc" : "Tắt đọc"}
                </ToggleChip>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto bg-[#fcfaf7] p-4 dark:bg-sumi-950/40 sm:p-5">
                {messages.map((msg) => {
                  const isUser = msg.role === "user";
                  return (
                    <div key={msg.id} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                      {!isUser && <Seal char={character.seal} className="mt-0.5 h-9 w-9 text-sm" />}
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm sm:max-w-[78%] ${
                          isUser
                            ? "rounded-tr-md bg-slate-900 font-medium text-white dark:bg-slate-700"
                            : "rounded-tl-md border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-sumi-800 dark:text-slate-100"
                        }`}
                      >
                        {/* Furigana subtext if available */}
                        {showFurigana && msg.furigana && (
                          <p className={`mb-1 font-jp text-[11px] font-medium ${isUser ? "text-slate-300" : "text-slate-400"}`}>
                            {msg.furigana}
                          </p>
                        )}

                        {/* Main Message Content */}
                        <p lang="ja" className="whitespace-pre-wrap font-jp text-sm font-medium leading-relaxed sm:text-base">
                          {msg.content}
                        </p>

                        {/* Romaji phonetic subtext if enabled */}
                        {showRomaji && (
                          <p className={`mt-1 font-mono text-xs italic leading-relaxed ${isUser ? "text-slate-300" : "text-slate-500 dark:text-slate-400"}`}>
                            {kanaToRomaji(msg.furigana || msg.content)}
                          </p>
                        )}

                        {/* Meaning translation subtext if available */}
                        {showTranslations && msg.meaning && (
                          <p
                            className={`mt-2 border-t pt-2 text-xs leading-relaxed ${
                              isUser
                                ? "border-white/15 text-slate-200"
                                : "border-slate-200/70 text-slate-600 dark:border-slate-700/70 dark:text-slate-300"
                            }`}
                          >
                            <span
                              className={`mr-1.5 rounded px-1 py-0.5 text-[10px] font-bold ${
                                isUser ? "bg-white/15" : "bg-slate-100 text-slate-500 dark:bg-sumi-900 dark:text-slate-400"
                              }`}
                            >
                              VI
                            </span>
                            {msg.meaning}
                          </p>
                        )}

                        {/* Audio Playback button for Sensei */}
                        {!isUser && (
                          <button
                            type="button"
                            onClick={() => {
                              playClick();
                              speakJapanese(msg.content, msg.furigana);
                            }}
                            className="mt-2.5 inline-flex min-h-8 items-center gap-1.5 rounded-lg text-[11px] font-bold text-red-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:text-red-400"
                          >
                            <Icon name="speaker" className="h-3.5 w-3.5" />
                            Nghe lại
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex items-center gap-3">
                    <Seal char={character.seal} className="h-9 w-9 text-sm motion-safe:animate-pulse" />
                    <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-sumi-800">
                      <span aria-hidden="true" className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400 motion-safe:animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400 motion-safe:animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400 motion-safe:animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                      Sensei đang suy nghĩ câu trả lời...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Suggestions (Chips to never get stuck) */}
              <div className="border-t border-slate-100 bg-white px-4 py-2.5 dark:border-slate-800 dark:bg-sumi-900 sm:px-5">
                <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Gợi ý đối đáp nhanh · N3
                </p>
                <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
                  {selectedScenario.suggestedReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(reply.ja)}
                      className="max-w-[280px] shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-left text-xs text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-slate-700 dark:bg-sumi-800 dark:text-slate-300 dark:hover:bg-red-950/30"
                      title={reply.vi}
                    >
                      <span lang="ja" className="block truncate font-jp font-bold">{reply.ja}</span>
                      <span className="mt-0.5 block truncate text-[10px] text-slate-400">{reply.vi}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input + Microphone */}
              <div className="border-t border-slate-100 bg-white p-3 dark:border-slate-800 dark:bg-sumi-900 sm:p-4">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 transition focus-within:border-red-300 focus-within:ring-2 focus-within:ring-red-500/20 dark:border-slate-700 dark:bg-sumi-950">
                  <button
                    type="button"
                    onClick={toggleListening}
                    aria-pressed={isListening}
                    aria-label={isListening ? "Đang thu âm — nhấn để dừng" : "Nói tiếng Nhật bằng micro"}
                    className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 ${
                      isListening
                        ? "bg-red-600 text-white shadow-md shadow-red-600/30 motion-safe:animate-pulse"
                        : "bg-white text-slate-700 shadow-sm hover:bg-red-50 hover:text-red-600 dark:bg-sumi-800 dark:text-slate-200"
                    }`}
                    title={isListening ? "Đang thu âm... Nhấn để dừng" : "Nhấn để nói tiếng Nhật (Micro)"}
                  >
                    <MicIcon />
                  </button>

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
                    aria-label="Nhập câu tiếng Nhật"
                    placeholder={isListening ? "Đang lắng nghe giọng nói tiếng Nhật..." : "Nhập câu tiếng Nhật hoặc bấm Micro để nói..."}
                    className="min-w-0 flex-1 bg-transparent px-2 py-2.5 font-jp text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-white sm:text-sm"
                  />

                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim() || loading}
                    variant="brand"
                    size="md"
                    className="shrink-0 px-4 font-black"
                  >
                    Gửi
                    <Icon name="arrow" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </section>

            {/* BẢNG MẪU CÂU (bảng đen lớp học) */}
            <section
              aria-labelledby="grammar-heading"
              className="rounded-3xl bg-[#1f2a2c] p-4 text-slate-100 shadow-sm ring-1 ring-black/10 dark:bg-sumi-950 dark:ring-slate-800 sm:p-5 lg:col-span-4 lg:col-start-1 lg:row-start-2"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3
                  id="grammar-heading"
                  className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-300"
                >
                  Mẫu câu N3 trọng tâm
                </h3>
                <span lang="ja" className="font-jp text-xs font-bold text-red-300" aria-hidden="true">
                  文型
                </span>
              </div>
              <ul className="space-y-0">
                {selectedScenario.keyGrammar.map((g, idx) => (
                  <li
                    key={idx}
                    className="border-t border-dashed border-white/15 py-2.5 first:border-t-0 first:pt-0 last:pb-0"
                  >
                    <span lang="ja" className="block font-jp text-base font-bold text-amber-100">
                      {g.pattern}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-300">{g.meaning}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* API Key Modal (dùng Modal chung: focus trap, Escape, khóa cuộn nền) */}
          <Modal isOpen={isKeyModalOpen} onClose={closeKeyModal} title="Cấu hình Google Gemini AI Key" maxWidth="md">
            <div className="space-y-4">
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Nhập Google Gemini API Key để mở khóa toàn bộ trí thông minh đàm thoại tiếng Nhật (Gemini 1.5 Flash), nói chuyện tự do mọi chủ đề. Khóa được lưu trực tiếp trên trình duyệt của bạn.
              </p>

              <div className="space-y-2">
                <label htmlFor="nq-ai-keys" className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>API Key (Hỗ trợ Bể nhiều Key & Đa nền tảng):</span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Tự động đảo Key khi hết hạn ngạch</span>
                </label>
                <textarea
                  id="nq-ai-keys"
                  rows={3}
                  value={tempKeyInput}
                  onChange={(e) => setTempKeyInput(e.target.value)}
                  placeholder="Dán 1 hoặc nhiều Gemini Key (AIzaSy...), Groq Key (gsk_...), OpenRouter Key (sk-or-)... Mỗi key 1 dòng hoặc cách nhau bằng dấu phẩy"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-base focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-slate-700 dark:bg-sumi-950 dark:text-white sm:text-xs"
                />
                <p className="text-[10px] leading-tight text-slate-500 dark:text-slate-400">
                  <strong>Mẹo:</strong> Bạn có thể tạo 2-3 Google Gemini key từ các tài khoản Google khác nhau và dán vào đây để hệ thống tự luân phiên, không bao giờ lo bị nghẽn!
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="nq-ai-model" className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Chọn Mô hình AI (Gemini 3 / Groq):</span>
                  <span className="text-[10px] font-normal text-amber-600">Tự động chuyển model nếu 503</span>
                </label>
                <select
                  id="nq-ai-model"
                  value={tempModelInput}
                  onChange={(e) => setTempModelInput(e.target.value)}
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-slate-700 dark:bg-sumi-950 dark:text-slate-200 sm:text-xs"
                >
                  <option value="gemini-3.6-flash">⚡ Gemini 3.6 Flash (Chính thức từ Google - Khuyên dùng)</option>
                  <option value="gemini-3.6-flash-preview">🧪 Gemini 3.6 Flash Preview</option>
                  <option value="gemini-3.8-flash">🚀 Gemini 3.8 Flash (Tốc độ cao)</option>
                  <option value="gemini-3.6-pro">🌟 Gemini 3.6 Pro (Chuyên sâu cao cấp)</option>
                </select>
              </div>

              <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-700 dark:border-slate-700 dark:bg-sumi-950 dark:text-slate-300">
                <div className="flex items-center gap-1 font-bold">
                  <Icon name="bulb" className="h-3.5 w-3.5 text-amber-500" />
                  <span>Nơi lấy API Key miễn phí không giới hạn:</span>
                </div>
                <ul className="list-disc space-y-1 pl-4 text-[11px]">
                  <li>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-red-600 underline hover:opacity-80 dark:text-red-400"
                    >
                      Google AI Studio (Gemini 3.6 Flash miễn phí) ↗
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://console.groq.com/keys"
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-red-600 underline hover:opacity-80 dark:text-red-400"
                    >
                      Groq Cloud (gsk_... 14,400 lượt/ngày cực nhanh) ↗
                    </a>
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-1">
                {apiKey ? (
                  <button
                    type="button"
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
                  <Button onClick={closeKeyModal} variant="ghost" size="sm" className="text-xs">
                    Đóng
                  </Button>
                  <Button onClick={handleSaveApiKey} variant="brand" size="sm" className="text-xs font-black">
                    Lưu Key
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}