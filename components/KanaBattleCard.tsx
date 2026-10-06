"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui";
import { notifyProgressUpdated } from "@/components/UserProgressContext";

// ─── Types ──────────────────────────────────────────────────────────────────
interface KanaCard {
  id: string;
  character: string;
  script: string;
  romaji: string;
  audioUrl?: string | null;
  kind: string;
  row: string;
}

interface RoundResult {
  kanaId: string;
  character: string;
  script: string;
  romaji: string;
  userAnswer: string;
  isCorrect: boolean;
  timeMs: number;
}

type GamePhase = "LOBBY" | "PLAYING" | "SUBMITTING" | "RESULT";
type ScriptOption = "hiragana" | "katakana" | "mixed";

const CARD_TIME_MS = 5000;
const CARDS_PER_ROUND = 10;

// ─── Circular Timer SVG ──────────────────────────────────────────────────────
function CircularTimer({ progress, timeLeft }: { progress: number; timeLeft: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - progress);
  const isUrgent = timeLeft <= 1000;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="absolute inset-0 rotate-[-90deg]" width="80" height="80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
        <circle
          cx="40" cy="40" r={r} fill="none"
          stroke={isUrgent ? "#f43f5e" : "#a78bfa"}
          strokeWidth="5"
          strokeDasharray={circ}
          strokeDashoffset={dash}
          strokeLinecap="round"
          className="transition-all duration-100"
        />
      </svg>
      <span className={`relative text-lg font-black transition-colors ${isUrgent ? "text-rose-400" : "text-white"}`}>
        {Math.ceil(timeLeft / 1000)}
      </span>
    </div>
  );
}

// ─── Combo Badge ─────────────────────────────────────────────────────────────
function ComboBadge({ combo }: { combo: number }) {
  if (combo < 3) return null;
  const isSuper = combo >= 5;
  return (
    <div
      key={combo}
      className={`inline-flex min-h-11 items-center gap-1.5 px-3 py-2.5 rounded-full text-xs font-black animate-bounce
        ${isSuper
          ? "bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 shadow-lg shadow-amber-500/40"
          : "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-purple-500/30"
        }`}
    >
      {isSuper ? "⚡" : "🔥"} COMBO ×{combo}{isSuper ? " — XP×2!" : "!"}
    </div>
  );
}

// ─── XP Popup ────────────────────────────────────────────────────────────────
function XPPopup({ xp, show }: { xp: number; show: boolean }) {
  if (!show || xp === 0) return null;
  return (
    <div className="absolute top-2 right-2 text-amber-400 font-black text-sm animate-ping-once pointer-events-none select-none">
      +{xp} XP
    </div>
  );
}

// ─── Result Card ─────────────────────────────────────────────────────────────
function ResultCard({ result }: { result: RoundResult }) {
  const isCorrect = result.isCorrect;
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs
        ${isCorrect
          ? "bg-emerald-950/50 border-emerald-700/40 text-emerald-300"
          : "bg-rose-950/50 border-rose-700/40 text-rose-300"
        }`}
    >
      <span className="text-base mr-2">{isCorrect ? "✅" : "❌"}</span>
      <span className="font-black text-lg text-white mr-2">{result.character}</span>
      <span className="flex-1 text-slate-400">
        {isCorrect ? (
          <span className="text-emerald-400">{result.romaji}</span>
        ) : (
          <>
            <span className="line-through text-rose-400 mr-1">{result.userAnswer || "—"}</span>
            <span className="text-slate-300">→ {result.romaji}</span>
          </>
        )}
      </span>
      <span className="text-slate-500 ml-2">{(result.timeMs / 1000).toFixed(1)}s</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function KanaBattleCard() {
  const [phase, setPhase] = useState<GamePhase>("LOBBY");
  const [script, setScript] = useState<ScriptOption>("mixed");
  const [cards, setCards] = useState<KanaCard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(CARD_TIME_MS);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [lastXP, setLastXP] = useState(0);
  const [showXP, setShowXP] = useState(false);
  const [cardFlip, setCardFlip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverResult, setServerResult] = useState<{
    totalXP: number; isPerfect: boolean; correctCount: number;
    totalCount: number; maxCombo: number;
  } | null>(null);
  const [submitError, setSubmitError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const cardStartRef = useRef<number>(0);

  const currentCard = cards[cardIndex] ?? null;

  // ── Compute XP for display (mirrors server logic) ──
  const computeXPForCard = useCallback((correct: boolean, elapsed: number, currentComboVal: number) => {
    if (!correct) return 0;
    const base = 10;
    const speed = elapsed < 1500 ? 5 : 0;
    const multi = currentComboVal >= 5 ? 2 : 1;
    return (base + speed) * multi;
  }, []);

  // ── Submit round to server ──
  const submitRound = useCallback(async (roundResults: RoundResult[]) => {
    setPhase("SUBMITTING");
    setSubmitError("");
    try {
      const res = await fetch("/api/kana-battle/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          results: roundResults.map((r) => ({
            kanaId: r.kanaId,
            character: r.character,
            script: r.script,
            isCorrect: r.isCorrect,
            timeMs: r.timeMs,
          })),
        }),
      });
      if (!res.ok) throw new Error("Submit failed");
      const data = await res.json();
      setServerResult(data);
      notifyProgressUpdated();
    } catch {
      setSubmitError("Không thể lưu kết quả. Vui lòng thử lại.");
    } finally {
      setPhase("RESULT");
    }
  }, []);

  // ── Handle answer (correct or timeout) ──
  const handleAnswer = useCallback((userAnswer: string, timedOut = false) => {
    if (!currentCard || phase !== "PLAYING") return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const elapsed = Date.now() - cardStartRef.current;
    const isCorrect = !timedOut && userAnswer.trim().toLowerCase() === currentCard.romaji.toLowerCase();

    const newCombo = isCorrect ? combo + 1 : 0;
    setCombo(newCombo);
    setMaxCombo((prev) => Math.max(prev, newCombo));

    const xpEarned = computeXPForCard(isCorrect, elapsed, newCombo);
    if (xpEarned > 0) {
      setLastXP(xpEarned);
      setShowXP(true);
      setTimeout(() => setShowXP(false), 1200);
    }

    const newResult: RoundResult = {
      kanaId: currentCard.id,
      character: currentCard.character,
      script: currentCard.script,
      romaji: currentCard.romaji,
      userAnswer: timedOut ? "" : userAnswer.trim(),
      isCorrect,
      timeMs: elapsed,
    };

    const newResults = [...results, newResult];
    setResults(newResults);
    setInput("");

    if (newResults.length >= CARDS_PER_ROUND || cardIndex >= cards.length - 1) {
      submitRound(newResults);
      return;
    }

    // Flip animation then advance card
    setCardFlip(true);
    setTimeout(() => {
      setCardIndex((i) => i + 1);
      setTimeLeft(CARD_TIME_MS);
      setCardFlip(false);
      cardStartRef.current = Date.now();
    }, 350);
  }, [currentCard, phase, combo, results, cardIndex, cards.length, computeXPForCard, submitRound]);

  // ── Timer loop ──
  useEffect(() => {
    if (phase !== "PLAYING" || !currentCard) return;

    cardStartRef.current = Date.now();
    setTimeLeft(CARD_TIME_MS);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - cardStartRef.current;
      const remaining = CARD_TIME_MS - elapsed;
      if (remaining <= 0) {
        setTimeLeft(0);
        handleAnswer("", true);
      } else {
        setTimeLeft(remaining);
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardIndex, phase]);

  // ── Focus input when playing ──
  useEffect(() => {
    if (phase === "PLAYING") {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [phase, cardIndex]);

  // ── Start game ──
  const startGame = async () => {
    setIsLoading(true);
    setResults([]);
    setCombo(0);
    setMaxCombo(0);
    setCardIndex(0);
    setServerResult(null);
    setSubmitError("");
    try {
      const res = await fetch(`/api/kana-battle?script=${script}&count=${CARDS_PER_ROUND}`);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setCards(data.kana);
      startTimeRef.current = Date.now();
      setPhase("PLAYING");
    } catch {
      alert("Không thể tải bài. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetToLobby = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("LOBBY");
    setCards([]);
    setCardIndex(0);
    setInput("");
    setCombo(0);
    setMaxCombo(0);
    setResults([]);
    setServerResult(null);
  };

  // ── LOBBY ──────────────────────────────────────────────────────────────────
  if (phase === "LOBBY") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] py-8">
        {/* Hero card */}
        <div className="w-full max-w-md bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-900 rounded-3xl border border-violet-700/30 shadow-2xl shadow-violet-900/40 p-8 flex flex-col items-center gap-6">
          {/* Title */}
          <div className="text-center space-y-1.5">
            <div className="text-5xl mb-1 animate-pulse">🃏</div>
            <h2 className="text-2xl font-black text-white tracking-tight">Kana Battle Card</h2>
            <p className="text-sm text-slate-400 max-w-xs">
              Gõ Romaji đúng trong <span className="text-amber-400 font-bold">3 giây</span> cho mỗi thẻ Kana.<br />
              Combo 5+ liên tiếp → <span className="text-violet-400 font-bold">XP ×2</span>!
            </p>
          </div>

          {/* Stats preview */}
          <div className="grid grid-cols-3 gap-3 w-full text-center">
            {[
              { icon: "🎴", label: "Số thẻ", value: `${CARDS_PER_ROUND}` },
              { icon: "⏱️", label: "Thời gian", value: "3s / thẻ" },
              { icon: "✨", label: "XP tối đa", value: "~200 XP" },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <div className="text-xl mb-0.5">{s.icon}</div>
                <div className="text-xs font-black text-white">{s.value}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Script selector */}
          <div className="w-full space-y-2">
            <p className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider">Chọn loại chữ</p>
            <div className="grid grid-cols-3 gap-2">
              {(["hiragana", "katakana", "mixed"] as ScriptOption[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScript(s)}
                  className={`py-2.5 rounded-xl text-xs font-black transition-all border
                    ${script === s
                      ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-600/30 scale-[1.03]"
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  {s === "hiragana" ? "🔵 Hiragana" : s === "katakana" ? "🔴 Katakana" : "🟣 Mixed"}
                </button>
              ))}
            </div>
          </div>

          {/* XP rules */}
          <div className="w-full bg-white/5 rounded-2xl border border-white/10 p-3.5 space-y-1.5 text-xs">
            <p className="font-black text-white text-[11px] uppercase tracking-wider mb-2">Luật XP</p>
            {[
              { icon: "✅", text: "Đúng → +10 XP base" },
              { icon: "⚡", text: "Dưới 1.5s → thêm +5 XP tốc độ" },
              { icon: "🔥", text: "Combo 3+ → Badge cháy!" },
              { icon: "×2", text: "Combo 5+ → Nhân đôi XP mỗi câu" },
              { icon: "🏆", text: "10/10 Perfect → +50 XP bonus" },
            ].map((r) => (
              <div key={r.text} className="flex items-center gap-2 text-slate-300">
                <span className="w-6 text-center font-black text-amber-400 shrink-0">{r.icon}</span>
                <span>{r.text}</span>
              </div>
            ))}
          </div>

          <Button
            variant="fuji"
            size="lg"
            onClick={startGame}
            loading={isLoading}
            className="w-full text-base font-black"
            id="kana-battle-start-btn"
          >
            {isLoading ? "Đang tải..." : "⚔️ Bắt đầu chiến đấu!"}
          </Button>
        </div>
      </div>
    );
  }

  // ── PLAYING ─────────────────────────────────────────────────────────────────
  if (phase === "PLAYING" && currentCard) {
    const progress = timeLeft / CARD_TIME_MS;
    const scriptLabel = currentCard.script === "hiragana" ? "Hiragana" : "Katakana";
    const correctSoFar = results.filter((r) => r.isCorrect).length;

    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] py-8 gap-6 select-none">
        {/* Progress row */}
        <div className="w-full max-w-md flex items-center justify-between gap-3">
          <div className="flex gap-1">
            {cards.map((_, i) => {
              const res = results[i];
              const isCurrent = i === cardIndex;
              return (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    res
                      ? res.isCorrect ? "bg-emerald-500" : "bg-rose-500"
                      : isCurrent ? "bg-violet-400 animate-pulse" : "bg-white/15"
                  }`}
                />
              );
            })}
          </div>
          <span className="text-xs font-black text-slate-400 shrink-0">
            {cardIndex + 1}/{CARDS_PER_ROUND}
          </span>
        </div>

        {/* Combo badge */}
        <div className="h-8 flex items-center justify-center">
          <ComboBadge combo={combo} />
        </div>

        {/* Main card */}
        <div
          className={`relative w-full max-w-md transition-all duration-300 ${
            cardFlip ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
          }`}
        >
          {/* XP popup */}
          <XPPopup xp={lastXP} show={showXP} />

          <div className="bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-900 rounded-3xl border border-violet-600/30 shadow-2xl shadow-violet-900/40 p-8 flex flex-col items-center gap-5">
            {/* Script badge + timer */}
            <div className="w-full flex items-center justify-between">
              <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full
                ${currentCard.script === "hiragana"
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                }`}>
                {scriptLabel}
              </span>
              <CircularTimer progress={progress} timeLeft={timeLeft} />
            </div>

            {/* Character display */}
            <div className="text-center py-2 flex flex-col items-center">
              <div
                className="text-8xl font-black text-white leading-none tracking-tight drop-shadow-[0_0_30px_rgba(167,139,250,0.5)]"
                style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                {currentCard.character}
              </div>

              {/* Romaji Phonetic Reading */}
              <div className="mt-3 text-xs font-black text-amber-300 tracking-wider font-mono bg-amber-400/10 px-3 py-1 rounded-xl border border-amber-400/30 flex items-center gap-1.5 shadow-sm">
                <span>🔤 Phiên âm:</span>
                <span className="text-sm text-white font-bold underline">{currentCard.romaji}</span>
              </div>

              <div className="text-xs text-slate-400 mt-2 font-medium">
                {currentCard.kind === "BASIC" ? "Cơ bản" : currentCard.kind === "DAKUTEN" ? "Âm đục" : currentCard.kind === "COMBO" ? "Âm ghép" : currentCard.kind}
                {currentCard.row ? ` · Hàng ${currentCard.row.toUpperCase()}` : ""}
              </div>
            </div>

            {/* Input */}
            <div className="w-full">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && input.trim()) {
                    handleAnswer(input.trim());
                  }
                }}
                placeholder="Gõ Romaji rồi nhấn Enter..."
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="w-full px-4 py-3.5 rounded-2xl bg-white/10 border border-violet-500/40 text-white text-center text-lg font-bold placeholder:text-slate-500 focus:outline-none focus:border-violet-400 focus:bg-white/15 transition-all"
                id="kana-battle-input"
              />
              <p className="text-center text-[11px] text-slate-500 mt-2">
                Nhấn <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-slate-400">Enter</kbd> để xác nhận
              </p>
            </div>

            {/* Confirm button on mobile */}
            <Button
              variant="fuji"
              size="sm"
              onClick={() => input.trim() && handleAnswer(input.trim())}
              disabled={!input.trim()}
              className="w-full sm:hidden"
            >
              Xác nhận →
            </Button>

            {/* Stats row */}
            <div className="flex items-center justify-between w-full text-xs font-bold text-slate-400">
              <span>✅ {correctSoFar}/{cardIndex} đúng</span>
              <span>🔥 Combo: {combo}</span>
              <span>⏱ {(timeLeft / 1000).toFixed(1)}s</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── SUBMITTING ───────────────────────────────────────────────────────────────
  if (phase === "SUBMITTING") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] gap-4">
        <div className="text-5xl animate-bounce">⏳</div>
        <p className="text-white font-black text-lg">Đang lưu kết quả...</p>
        <p className="text-slate-400 text-sm">Cập nhật SRS và tính XP</p>
      </div>
    );
  }

  // ── RESULT ───────────────────────────────────────────────────────────────────
  if (phase === "RESULT") {
    const correctCount = results.filter((r) => r.isCorrect).length;
    const accuracy = Math.round((correctCount / results.length) * 100);
    const isPerfect = correctCount === results.length;
    const xp = serverResult?.totalXP ?? 0;

    return (
      <div className="flex flex-col items-center min-h-[420px] py-8 gap-5 w-full max-w-md mx-auto">
        {/* Result hero */}
        <div className="w-full bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-900 rounded-3xl border border-violet-700/30 shadow-2xl shadow-violet-900/40 p-7 flex flex-col items-center gap-5">
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="text-5xl">
              {isPerfect ? "🏆" : accuracy >= 80 ? "🎉" : accuracy >= 50 ? "👍" : "💪"}
            </div>
            <h3 className="text-xl font-black text-white">
              {isPerfect ? "PERFECT ROUND!" : accuracy >= 80 ? "Xuất sắc!" : accuracy >= 50 ? "Tốt lắm!" : "Cố gắng thêm!"}
            </h3>
            {submitError && (
              <p className="text-rose-400 text-xs bg-rose-950/50 px-3 py-1.5 rounded-xl border border-rose-700/30">
                {submitError}
              </p>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {[
              { icon: "🎯", label: "Độ chính xác", value: `${accuracy}%`, color: accuracy >= 80 ? "text-emerald-400" : "text-amber-400" },
              { icon: "✨", label: "XP kiếm được", value: `+${xp} XP`, color: "text-amber-400" },
              { icon: "🔥", label: "Combo cao nhất", value: `×${serverResult?.maxCombo ?? maxCombo}`, color: "text-violet-400" },
              { icon: "✅", label: "Đúng / Tổng", value: `${correctCount}/${results.length}`, color: "text-white" },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 rounded-2xl p-3.5 border border-white/10 text-center">
                <div className="text-xl mb-1">{s.icon}</div>
                <div className={`text-lg font-black ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {isPerfect && (
            <div className="w-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-2xl px-4 py-3 text-center">
              <p className="text-amber-400 font-black text-sm">🏆 Perfect Bonus: +50 XP đặc biệt!</p>
              <p className="text-amber-300/70 text-xs mt-0.5">10/10 câu đúng — Đỉnh của đỉnh!</p>
            </div>
          )}
        </div>

        {/* SRS notice */}
        <div className="w-full flex items-start gap-2 text-xs text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800 px-4 py-3">
          <span className="text-base shrink-0">🧠</span>
          <span>
            Thẻ sai đã được thêm vào <strong className="text-violet-400">hàng đợi ôn tập SRS</strong> để bạn ôn lại sớm.
            Thẻ đúng sẽ được lên lịch ôn tiếp theo tự động.
          </span>
        </div>

        {/* Card-by-card breakdown */}
        <div className="w-full space-y-1.5">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider px-1">Chi tiết từng thẻ</p>
          {results.map((r, i) => (
            <ResultCard key={i} result={r} />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 w-full">
          <Button variant="fuji" size="md" onClick={startGame} loading={isLoading} className="flex-1 font-black" id="kana-battle-retry-btn">
            ⚔️ Chơi lại
          </Button>
          <Button variant="secondary" size="md" onClick={resetToLobby} className="flex-1 font-black" id="kana-battle-lobby-btn">
            🏠 Về Lobby
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
