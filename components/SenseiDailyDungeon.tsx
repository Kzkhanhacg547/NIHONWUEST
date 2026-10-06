"use client";

import { useState, useEffect } from "react";
import { Button, Card, Badge } from "@/components/ui";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";
import { notifyProgressUpdated } from "@/components/UserProgressContext";
import { kanaToRomaji } from "@/lib/romajiConverter";

interface QuestionOption {
  textJa: string;
  textVi: string;
}

interface DungeonQuestion {
  id: string;
  situationJa: string;
  situationVi: string;
  furigana: string;
  options: QuestionOption[];
  correctIndex: number;
  explanation: string;
}

interface DungeonTheme {
  id: string;
  title: string;
  japaneseTitle: string;
  description: string;
  icon: string;
  bgGradient: string;
}

export function SenseiDailyDungeon() {
  const { playClick, playCorrect, playIncorrect, speak } = useSoundAndTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [theme, setTheme] = useState<DungeonTheme | null>(null);
  const [questions, setQuestions] = useState<DungeonQuestion[]>([]);
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const [streak, setStreak] = useState(0);

  // Gameplay state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<
    { questionId: string; selectedIndex: number; isCorrect: boolean }[]
  >([]);
  const [score, setScore] = useState(0);

  const [showFurigana, setShowFurigana] = useState(true);
  const [showRomaji, setShowRomaji] = useState(true);
  const [showViTranslation, setShowViTranslation] = useState(true);

  // Phase
  const [phase, setPhase] = useState<"INTRO" | "PLAYING" | "SUBMITTING" | "RESULT">("INTRO");
  const [submitResult, setSubmitResult] = useState<{
    xpEarned: number;
    streak: number;
    achievementUnlocked: boolean;
  } | null>(null);

  useEffect(() => {
    fetchDungeonData();
  }, []);

  const fetchDungeonData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/dungeon");
      if (!res.ok) throw new Error("Không thể tải dữ liệu Daily Dungeon.");
      const data = await res.json();

      setTheme(data.theme);
      setQuestions(data.questions || []);
      setIsCompletedToday(data.isCompletedToday);
      setStreak(data.streak || 0);

      if (data.isCompletedToday) {
        setPhase("RESULT");
      }
    } catch (err: any) {
      setError(err.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setScore(0);
    setPhase("PLAYING");
  };

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null || !currentQ) return;

    setSelectedOption(index);
    const isCorrect = index === currentQ.correctIndex;

    if (isCorrect) {
      playCorrect();
      setScore((prev) => prev + 1);
    } else {
      playIncorrect();
    }

    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selectedIndex: index,
        isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // Submit results
      submitDungeon();
    }
  };

  const submitDungeon = async () => {
    setPhase("SUBMITTING");
    const finalScore = score + (selectedOption === currentQ?.correctIndex ? 0 : 0);
    try {
      const res = await fetch("/api/ai/dungeon/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: finalScore,
          answers,
        }),
      });

      const data = await res.json();
      setSubmitResult({
        xpEarned: data.xpEarned || 50,
        streak: data.streak || streak + 1,
        achievementUnlocked: !!data.achievementUnlocked,
      });
      setStreak(data.streak || streak + 1);
      setIsCompletedToday(true);
      notifyProgressUpdated();
      setPhase("RESULT");
    } catch {
      setSubmitResult({
        xpEarned: 50,
        streak: streak + 1,
        achievementUnlocked: false,
      });
      setPhase("RESULT");
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white dark:bg-sumi-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <div className="w-12 h-12 rounded-full border-4 border-sakura-500 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
          Đang kết nối ngục tối Aoi Sensei...
        </p>
      </Card>
    );
  }

  if (error || !theme) {
    return (
      <Card className="p-6 text-center bg-white dark:bg-sumi-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <p className="text-sm font-bold text-rose-500">{error || "Không thể tải dữ liệu"}</p>
        <Button onClick={fetchDungeonData} variant="sakura" size="sm" className="mt-4">
          🔄 Thử lại
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ── Top Header Banner: Theme & Streak Progress ── */}
      <div
        className={`relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r ${theme.bgGradient} text-white shadow-xl overflow-hidden border border-white/10`}
      >
        <div className="absolute -right-6 -bottom-6 text-9xl opacity-15 pointer-events-none select-none">
          {theme.icon}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-400/90 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                🏯 Sensei&apos;s Daily Dungeon
              </span>
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                Thử thách hàng ngày
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              {theme.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200/90 max-w-xl leading-relaxed">
              {theme.description}
            </p>
          </div>

          {/* 7-Day Streak linkage badge */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center gap-4 shrink-0">
            <div className="text-center">
              <span className="text-2xl font-black text-amber-300 block">🔥 {streak}</span>
              <span className="text-[10px] text-slate-200 uppercase font-black tracking-wider block mt-0.5">
                Chuỗi ngày (Streak)
              </span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-xs">
              <span className="font-bold text-white block">Mục tiêu: 7 Ngày</span>
              <span className="text-[10px] text-amber-200 block">🏆 Mở khóa &apos;Dungeon Master&apos;</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── INTRO PHASE ── */}
      {phase === "INTRO" && (
        <Card className="p-6 sm:p-8 bg-white dark:bg-sumi-900 border-2 border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-md space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
            <span className="text-3xl">🌸</span>
            <div>
              <h4 className="font-black text-base text-slate-900 dark:text-white">
                Chào mừng bạn đến với ngục tối hôm nay từ Aoi Sensei!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Hoàn thành 5 tình huống N3/N4 theo chủ đề ngày để nhận ngay <strong>+50 XP</strong> và tích lũy chuỗi <strong>7 ngày liên tiếp</strong> mở khóa danh hiệu độc quyền!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-sumi-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
              <span className="text-2xl block">🎯</span>
              <h5 className="font-black text-xs text-slate-800 dark:text-slate-200">5 Tình Huống</h5>
              <p className="text-[11px] text-slate-500">Phản xạ thực tế với người Nhật</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-sumi-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
              <span className="text-2xl block">🇻🇳</span>
              <h5 className="font-black text-xs text-slate-800 dark:text-slate-200">Có Dịch Nghĩa</h5>
              <p className="text-[11px] text-slate-500">Kèm giải thích chi tiết từ Sensei</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-sumi-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
              <span className="text-2xl block">🔊</span>
              <h5 className="font-black text-xs text-slate-800 dark:text-slate-200">Giọng Đọc Audio</h5>
              <p className="text-[11px] text-slate-500">Hỗ trợ đọc hội thoại chuẩn xác</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 flex-wrap gap-4">
            <div className="text-xs text-slate-500 font-medium">
              Chủ đề: <strong className="text-slate-900 dark:text-white font-bold">{theme.japaneseTitle}</strong>
            </div>

            <Button onClick={handleStart} variant="sakura" size="lg" className="px-8 font-black rounded-2xl shadow-lg">
              🚀 Bắt Đầu Khiêu Chiến Ngục Tối
            </Button>
          </div>
        </Card>
      )}

      {/* ── PLAYING PHASE ── */}
      {phase === "PLAYING" && currentQ && (
        <Card className="p-6 sm:p-8 bg-white dark:bg-sumi-900 border-2 border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
          {/* Progress Header */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Badge variant="sakura">
                Câu {currentIndex + 1} / {questions.length}
              </Badge>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {theme.title}
              </span>
            </div>

            {/* Quick Helper Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFurigana(!showFurigana)}
                className={`px-2.5 py-2.5 min-h-11 rounded-xl text-xs font-bold transition ${
                  showFurigana
                    ? "bg-sakura-50 text-sakura-600 dark:bg-sakura-950/60 dark:text-sakura-300 border border-sakura-200"
                    : "text-slate-400 bg-slate-100 dark:bg-sumi-800"
                }`}
              >
                あ Furigana
              </button>
              <button
                onClick={() => setShowRomaji(!showRomaji)}
                className={`px-2.5 py-2.5 min-h-11 rounded-xl text-xs font-bold transition ${
                  showRomaji
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200"
                    : "text-slate-400 bg-slate-100 dark:bg-sumi-800"
                }`}
              >
                🔤 Romaji
              </button>
              <button
                onClick={() => setShowViTranslation(!showViTranslation)}
                className={`px-2.5 py-2.5 min-h-11 rounded-xl text-xs font-bold transition ${
                  showViTranslation
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200"
                    : "text-slate-400 bg-slate-100 dark:bg-sumi-800"
                }`}
              >
                🇻🇳 Dịch nghĩa
              </button>
            </div>
          </div>

          {/* Situation Question Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-sumi-800 dark:to-sumi-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                📌 TÌNH HUỐNG N3
              </span>
              <button
                onClick={() => speak(currentQ.situationJa)}
                className="flex min-h-11 items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-sumi-900 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 transition shadow-2xs"
              >
                🔊 Nghe câu hỏi
              </button>
            </div>

            {showFurigana && currentQ.furigana && (
              <p className="text-xs text-slate-400 font-jp leading-relaxed font-medium">
                {currentQ.furigana}
              </p>
            )}

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-jp leading-relaxed">
              {currentQ.situationJa}
            </h3>

            {showRomaji && currentQ.furigana && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono italic leading-relaxed">
                🔤 Phiên âm Romaji: {kanaToRomaji(currentQ.furigana)}
              </p>
            )}

            {showViTranslation && (
              <p className="text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 italic font-medium">
                🇻🇳 {currentQ.situationVi}
              </p>
            )}
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            <p className="text-xs font-black uppercase text-slate-400 tracking-wider">
              LỰA CHỌN CÂU TRẢ LỜI PHÙ HỢP:
            </p>
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;
                const revealed = selectedOption !== null;

                let btnStyle = "bg-white dark:bg-sumi-900 border-slate-200 dark:border-slate-800 hover:border-sakura-300 text-slate-800 dark:text-slate-100";

                if (revealed) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20";
                  } else if (isSelected) {
                    btnStyle = "bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200 font-bold";
                  } else {
                    btnStyle = "bg-slate-50 dark:bg-sumi-800/40 border-slate-200 dark:border-slate-800 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={revealed}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl text-left border-2 transition-all flex items-start justify-between gap-4 ${btnStyle}`}
                  >
                    <div className="space-y-1">
                      <p className="font-jp text-sm sm:text-base font-bold leading-relaxed">
                        {opt.textJa}
                      </p>
                      {showRomaji && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono italic">
                          🔤 {kanaToRomaji(opt.textJa)}
                        </p>
                      )}
                      {showViTranslation && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {opt.textVi}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 pt-0.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(opt.textJa);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-sumi-800 hover:bg-sakura-50 text-slate-500 hover:text-sakura-600 transition"
                        title="Nghe phát âm câu trả lời"
                      >
                        🔊
                      </button>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation Box from Sensei when option selected */}
          {selectedOption !== null && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800/70 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-black text-amber-800 dark:text-amber-300">
                <span>🌸 AOI SENSEI GIẢI THÍCH:</span>
              </div>
              <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {selectedOption !== null && (
            <div className="flex justify-end pt-2">
              <Button onClick={handleNext} variant="sakura" size="md" className="px-6 font-bold rounded-xl shadow-md">
                {currentIndex < questions.length - 1 ? "Câu Tiếp Theo ➔" : "🏁 Hoàn Thành Ngục Tối"}
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* ── RESULT PHASE ── */}
      {phase === "RESULT" && (
        <Card className="p-6 sm:p-8 bg-white dark:bg-sumi-900 border-2 border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-4xl shadow-lg mx-auto">
            🏰
          </div>

          <div className="space-y-2">
            <Badge variant="matcha" className="px-3 py-1 text-xs">
              ✓ Đã Hoàn Thành Ngục Tối Hôm Nay!
            </Badge>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Chúc mừng bạn đã chinh phục ngục tối!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Bạn đã xuất sắc vượt qua các thử thách tình huống thực tế N3 trong ngày hôm nay.
            </p>
          </div>

          {/* Rewards Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-1">
              <span className="text-2xl font-black text-amber-600 block">
                +{submitResult?.xpEarned || 50} XP
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">
                Thưởng Ngục Tối
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center space-y-1">
              <span className="text-2xl font-black text-rose-600 block">
                🔥 {streak} Ngày
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">
                Chuỗi Liên Tiếp (Streak)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-1">
              <span className="text-2xl font-black text-emerald-600 block">
                ✓ Xong
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">
                Nhiệm Vụ Hàng Ngày
              </span>
            </div>
          </div>

          {/* Achievement Progress Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-sumi-800 border border-slate-200 dark:border-slate-700 max-w-md mx-auto text-left space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-800 dark:text-slate-200">🏆 Danh hiệu &apos;Dungeon Master&apos;</span>
              <span className="text-amber-600 font-black">{Math.min(streak, 7)} / 7 Ngày</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-sumi-900 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (streak / 7) * 100)}%` }}
              />
            </div>
            {streak >= 7 && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold text-center">
                🎉 Bạn đã chính thức sở hữu danh hiệu Dungeon Master!
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button onClick={fetchDungeonData} variant="secondary" size="md" className="font-bold">
              🔄 Tải Lại Trạng Thái Ngục Tối
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
