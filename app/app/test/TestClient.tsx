"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";

interface Question {
  id: number;
  category: "Kanji" | "Từ Vựng" | "Ngữ Pháp" | "Đọc Hiểu";
  level: "N5" | "N4" | "N3" | "N2";
  question: string;
  subText?: string;
  reading?: string;
  options: { label: string; text: string; isCorrect: Boolean }[];
  explanation: string;
}

const DIAGNOSTIC_QUESTIONS: Question[] = [
  // N5 Questions
  {
    id: 1,
    category: "Kanji",
    level: "N5",
    question: "Cách đọc Hán tự 「日本」 trong câu 「私は日本が好きです」 là gì?",
    options: [
      { label: "A", text: "にほん (Nihon)", isCorrect: true },
      { label: "B", text: "にっぽ (Nippo)", isCorrect: false },
      { label: "C", text: "ひほん (Hihon)", isCorrect: false },
      { label: "D", text: "にちほん (Nichihon)", isCorrect: false },
    ],
    explanation: "日本 được đọc là にほん (Nihon) nghĩa là Nước Nhật.",
  },
  {
    id: 2,
    category: "Từ Vựng",
    level: "N5",
    question: "Điền từ thích hợp: 「毎朝７時に＿＿＿。」",
    options: [
      { label: "A", text: "おきます (Thức dậy)", isCorrect: true },
      { label: "B", text: "ねます (Đi ngủ)", isCorrect: false },
      { label: "C", text: "たべます (Ăn)", isCorrect: false },
      { label: "D", text: "いきます (Đi)", isCorrect: false },
    ],
    explanation: "毎朝７時に起きます (Mỗi sáng tôi thức dậy lúc 7 giờ).",
  },
  {
    id: 3,
    category: "Ngữ Pháp",
    level: "N5",
    question: "Chọn trợ từ đúng: 「明日、友達＿＿＿映画を見に行きます。」",
    options: [
      { label: "A", text: "と (Với)", isCorrect: true },
      { label: "B", text: "に (Vào/Tại)", isCorrect: false },
      { label: "C", text: "を (Tác động)", isCorrect: false },
      { label: "D", text: "で (Tại/Bằng)", isCorrect: false },
    ],
    explanation: "Trợ từ 「と」 dùng chỉ đối tượng thực hiện hành động cùng (Với bạn bè).",
  },
  // N4 Questions
  {
    id: 4,
    category: "Kanji",
    level: "N4",
    question: "Cách đọc của chữ Hán 「約束」 là gì?",
    options: [
      { label: "A", text: "やくそく (Yakusoku)", isCorrect: true },
      { label: "B", text: "やくそっ (Yakusokku)", isCorrect: false },
      { label: "C", text: "えくそく (Ekusoku)", isCorrect: false },
      { label: "D", text: "やくぞく (Yakuzoku)", isCorrect: false },
    ],
    explanation: "約束 (Ước Thúc) đọc là やくそく có nghĩa là Lời hứa, cuộc hẹn.",
  },
  {
    id: 5,
    category: "Ngữ Pháp",
    level: "N4",
    question: "Chọn dạng đúng của động từ: 「雨が＿＿＿前に帰りましょう。」",
    options: [
      { label: "A", text: "降る (Furu - Thể nguyên mẫu)", isCorrect: true },
      { label: "B", text: "降り (Furi)", isCorrect: false },
      { label: "C", text: "降った (Futta - Thể quá khứ)", isCorrect: false },
      { label: "D", text: "降って (Futte - Thể Te)", isCorrect: false },
    ],
    explanation: "Trước 「前に」 (Trước khi...) luôn dùng động từ thể nguyên mẫu (V-ru + 前に).",
  },
  {
    id: 6,
    category: "Từ Vựng",
    level: "N4",
    question: "Từ nào có nghĩa trái ngược với 「危険」 (kiken - nguy hiểm)?",
    options: [
      { label: "A", text: "安全 (Anzen - An toàn)", isCorrect: true },
      { label: "B", text: "安心 (Anshin - An tâm)", isCorrect: false },
      { label: "C", text: "便利 (Benri - Tiện lợi)", isCorrect: false },
      { label: "D", text: "複雑 (Fukuzatsu - Phức tạp)", isCorrect: false },
    ],
    explanation: "危険 (Nguy hiểm) >< 安全 (An toàn).",
  },
  // N3 Questions
  {
    id: 7,
    category: "Ngữ Pháp",
    level: "N3",
    question: "Điền ngữ pháp thích hợp: 「彼は日本語が上手な＿＿＿、英語も話せます。」",
    options: [
      { label: "A", text: "だけでなく (Không chỉ... mà còn)", isCorrect: true },
      { label: "B", text: "ために (Vì/Để)", isCorrect: false },
      { label: "C", text: "かわりに (Thay vì)", isCorrect: false },
      { label: "D", text: "とおりに (Theo như)", isCorrect: false },
    ],
    explanation: "AだけでなくB (Không chỉ A mà còn B). Cấu trúc N3 quen thuộc.",
  },
  {
    id: 8,
    category: "Kanji",
    level: "N3",
    question: "Cách đọc đúng của từ 「解決」 là gì?",
    options: [
      { label: "A", text: "かいけつ (Kaiketsu)", isCorrect: true },
      { label: "B", text: "かいけつう (Kaiketsuu)", isCorrect: false },
      { label: "C", text: "けいけつ (Keiketsu)", isCorrect: false },
      { label: "D", text: "かいけつち (Kaiketsuchi)", isCorrect: false },
    ],
    explanation: "解決 (Giải Quyết) có cách đọc âm On là かいけつ.",
  },
  {
    id: 9,
    category: "Đọc Hiểu",
    level: "N3",
    subText: "「最近、日本ではキャッシュレス決済を使う人が増えている。現金を持ち歩かなくても、スマートフォンで簡単に買い物ができるからだ。」",
    question: "Theo đoạn văn, tại sao số người dùng thanh toán không tiền mặt lại tăng lên?",
    options: [
      { label: "A", text: "Vì mua sắm dễ dàng bằng smartphone không cần mang tiền mặt", isCorrect: true },
      { label: "B", text: "Vì tiền mặt ở Nhật Bản bị cấm sử dụng", isCorrect: false },
      { label: "C", text: "Vì smartphone giá rẻ hơn trước", isCorrect: false },
      { label: "D", text: "Vì người Nhật không thích đi mua sắm trực tiếp", isCorrect: false },
    ],
    explanation: "Đoạn văn nêu rõ: 現金を持ち歩かなくても、スマートフォンで簡単に買い物ができるからだ (Vì không cần mang tiền mặt vẫn mua sắm dễ dàng bằng smartphone).",
  },
  // N2 Questions
  {
    id: 10,
    category: "Ngữ Pháp",
    level: "N2",
    question: "Chọn mẫu câu N2 đúng: 「どんなに困難であっても、最後まで諦めない＿＿＿。」",
    options: [
      { label: "A", text: "つもりだ (Quyết tâm/Ý định)", isCorrect: true },
      { label: "B", text: "はずがない (Chắc chắn không)", isCorrect: false },
      { label: "C", text: "わけにはいかない (Không thể vì lý do đạo đức)", isCorrect: false },
      { label: "D", text: "にちがいない (Chắc chắn là)", isCorrect: false },
    ],
    explanation: "どんなに...であっても (Dù cho có khó khăn đến thế nào đi nữa, tôi vẫn có ý định không bỏ cuộc cho đến cùng).",
  },
  {
    id: 11,
    category: "Từ Vựng",
    level: "N2",
    question: "Từ nào đồng nghĩa với 「早速」 (Sassoku)?",
    options: [
      { label: "A", text: "すぐに (Ngay lập tức)", isCorrect: true },
      { label: "B", text: "ゆっくり (Thong thả)", isCorrect: false },
      { label: "C", text: "ようやく (Cuối cùng thì)", isCorrect: false },
      { label: "D", text: "たまに (Thỉnh thoảng)", isCorrect: false },
    ],
    explanation: "早速 (Sát Tốc) = すぐに (Ngay lập tức, không chần chừ).",
  },
  {
    id: 12,
    category: "Kanji",
    level: "N2",
    question: "Chữ Hán 「矛盾」 đọc là gì?",
    options: [
      { label: "A", text: "むじゅん (Mujun)", isCorrect: true },
      { label: "B", text: "ぼうじゅん (Boujun)", isCorrect: false },
      { label: "C", text: "むじゅんち (Mujunchi)", isCorrect: false },
      { label: "D", text: "むどう (Mudou)", isCorrect: false },
    ],
    explanation: "矛盾 (Mẫu Thuẫn) đọc là むじゅん.",
  },
  {
    id: 13,
    category: "Ngữ Pháp",
    level: "N5",
    question: "Hoàn thành câu: 「この本は＿＿＿おもしろいです。」",
    options: [
      { label: "A", text: "とても (Rất)", isCorrect: true },
      { label: "B", text: "あまり (Không... lắm)", isCorrect: false },
      { label: "C", text: "ぜんぜん (Hoàn toàn không)", isCorrect: false },
      { label: "D", text: "すこしも (Một chút cũng không)", isCorrect: false },
    ],
    explanation: "とても đi với tính từ khẳng định để nhấn mạnh (Rất thú vị).",
  },
  {
    id: 14,
    category: "Từ Vựng",
    level: "N4",
    question: "Chỉ ra nghĩa của từ 「遠慮する」 (enryo suru):",
    options: [
      { label: "A", text: "Ngần ngại, giữ kẽ, từ chối lịch sự", isCorrect: true },
      { label: "B", text: "Tất ngầm, lo lắng thái quá", isCorrect: false },
      { label: "C", text: "Hứa hẹn chắc chắn", isCorrect: false },
      { label: "D", text: "Giải thích rõ ràng", isCorrect: false },
    ],
    explanation: "遠慮する nghĩa là ngại ngùng, kiềm chế, hoặc giữ kẽ khi nhận quà/lời mời.",
  },
  {
    id: 15,
    category: "Đọc Hiểu",
    level: "N4",
    subText: "「図書館では静かにしなければなりません。また、館内での飲食は禁止されています。」",
    question: "Hành động nào ĐÚNG khi ở trong thư viện?",
    options: [
      { label: "A", text: "Giữ trật tự yên lặng và không ăn uống", isCorrect: true },
      { label: "B", text: "Vừa ăn bánh vừa đọc sách", isCorrect: false },
      { label: "C", text: "Nói chuyện điện thoại thoải mái", isCorrect: false },
      { label: "D", text: "Mang đồ ăn vào ăn trưa", isCorrect: false },
    ],
    explanation: "Chủ trương: 静かにする (giữ yên lặng) & 飲食禁止 (cấm ăn uống).",
  },
];

const TEST_MODES = [
  {
    id: "DIAGNOSTIC",
    title: "Bài Kiểm Tra Phân Loại Trình Độ Nhanh",
    description: "15 câu hỏi tổng hợp bao gồm N5 đến N2. Giúp xác định trình độ xuất phát chuẩn xác nhất cho bạn.",
    timeMinutes: 15,
    questionCount: 15,
    icon: "★",
    color: "from-amber-500 to-orange-600",
    badge: "Phổ biến nhất",
  },
  {
    id: "N5_FULL",
    title: "Bài Test Năng Lực JLPT N5",
    description: "Đánh giá toàn diện 20 câu chuẩn JLPT N5 (Hán tự sơ cấp, Từ vựng đời sống, Ngữ pháp Minna).",
    timeMinutes: 20,
    questionCount: 15,
    icon: "🌸",
    color: "from-rose-500 to-red-600",
    badge: "Sơ cấp 1",
  },
  {
    id: "N4_FULL",
    title: "Bài Test Năng Lực JLPT N4",
    description: "Đánh giá trình độ JLPT N4 (Hán tự trung cấp, Động từ thể Te/Ta/Nai, Mẫu câu giao tiếp).",
    timeMinutes: 20,
    questionCount: 15,
    icon: "⛩️",
    color: "from-emerald-500 to-teal-600",
    badge: "Sơ cấp 2",
  },
  {
    id: "N3_FULL",
    title: "Bài Test Năng Lực JLPT N3",
    description: "Thử thách trung cấp N3 với bài đọc hiểu, ngữ pháp biểu thái và từ vựng phong phú.",
    timeMinutes: 25,
    questionCount: 15,
    icon: "🗼",
    color: "from-blue-500 to-indigo-600",
    badge: "Trung cấp",
  },
];

interface TestClientProps {
  userLevel: string;
  userXP: number;
  displayName: string;
}

export function TestClient({ userLevel, userXP: initialXP, displayName }: TestClientProps) {
  const { playClick, playCorrect, showToast } = useSoundAndTheme();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<"SELECT" | "TESTING" | "RESULT">("SELECT");
  
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isUpdatingLevel, setIsUpdatingLevel] = useState(false);
  const [isClaimingXP, setIsClaimingXP] = useState(false);
  const [currentLevelState, setCurrentLevelState] = useState(userLevel);
  const [xpState, setXpState] = useState(initialXP);
  const [xpClaimed, setXpClaimed] = useState(false);
  const [levelUpdated, setLevelUpdated] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const questions = DIAGNOSTIC_QUESTIONS; // Default set
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const finishTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    playCorrect();
    setCurrentStep("RESULT");
  }, [playCorrect]);

  // Countdown timer
  useEffect(() => {
    if (currentStep === "TESTING" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentStep, timeLeft, finishTest]);

  const startTest = (modeId: string) => {
    playClick();
    setSelectedMode(modeId);
    const mode = TEST_MODES.find((m) => m.id === modeId);
    setTimeLeft((mode?.timeMinutes || 15) * 60);
    setQuestionIndex(0);
    setUserAnswers({});
    setXpClaimed(false);
    setLevelUpdated(false);
    setShowReview(false);
    setCurrentStep("TESTING");
  };

  const handleSelectOption = (qId: number, optIdx: number) => {
    playClick();
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  // Calculations
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = questions.reduce((acc, q) => {
    const chosenIdx = userAnswers[q.id];
    if (chosenIdx !== undefined && q.options[chosenIdx]?.isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const scorePercent = Math.round((correctCount / questions.length) * 100);

  // Calculate Breakdown by Category
  const categoryStats = questions.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = { total: 0, correct: 0 };
    acc[q.category].total += 1;
    const chosen = userAnswers[q.id];
    if (chosen !== undefined && q.options[chosen]?.isCorrect) {
      acc[q.category].correct += 1;
    }
    return acc;
  }, {} as Record<string, { total: number; correct: number }>);

  // Recommended Level logic
  const determineRecommendedLevel = (): string => {
    if (scorePercent >= 85) return "N3";
    if (scorePercent >= 65) return "N4";
    return "N5";
  };

  const recommendedLevel = determineRecommendedLevel();

  // Action: Update User Level in DB
  const handleUpdateLevel = async () => {
    setIsUpdatingLevel(true);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learningLevel: recommendedLevel }),
      });
      if (res.ok) {
        setCurrentLevelState(recommendedLevel);
        setLevelUpdated(true);
        playCorrect();
        showToast({
          title: `Đã cập nhật trình độ ${recommendedLevel} vào Hồ sơ của bạn!`,
          type: "success",
        });
      } else {
        showToast({ title: "Không thể cập nhật trình độ. Vui lòng thử lại.", type: "error" });
      }
    } catch {
      showToast({ title: "Lỗi kết nối máy chủ.", type: "error" });
    } finally {
      setIsUpdatingLevel(false);
    }
  };

  // Action: Claim XP Reward
  const handleClaimXP = async () => {
    setIsClaimingXP(true);
    try {
      const dayKey = new Date().toISOString().slice(0, 10);
      const res = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "REVIEW_COMPLETE", dayKey }),
      });
      const data = await res.json();
      if (res.ok) {
        setXpClaimed(true);
        setXpState((prev) => prev + 100);
        playCorrect();
        showToast({
          title: "🎉 Bạn nhận được +100 XP Thưởng Hoàn Thành Bài Kiểm Tra!",
          type: "success",
        });
      } else {
        showToast({ title: data.error || "Đã nhận thưởng trước đó hôm nay.", type: "info" });
        setXpClaimed(true);
      }
    } catch {
      showToast({ title: "Lỗi kết nối máy chủ.", type: "error" });
    } finally {
      setIsClaimingXP(false);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-8">
      {/* STEP 1: MODE SELECTION */}
      {currentStep === "SELECT" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-sumi-900 dark:ring-slate-800">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Xin chào, {displayName}! 👋
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Trình độ hiện tại trong hồ sơ: <span className="font-extrabold text-red-600 dark:text-red-400">{currentLevelState}</span> · Tổng XP: <span className="font-extrabold text-amber-500">{xpState} XP</span>
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300">
              <span>🎯 Đánh giá năng lực chuẩn JLPT</span>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {TEST_MODES.map((mode) => (
              <div
                key={mode.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-md hover:ring-slate-300 dark:bg-sumi-900 dark:ring-slate-800 dark:hover:ring-slate-700"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{mode.icon}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-700 dark:bg-sumi-800 dark:text-slate-300">
                      {mode.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-red-600 dark:text-white dark:group-hover:text-red-400 transition">
                    {mode.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed dark:text-slate-400">
                    {mode.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>⏱️ {mode.timeMinutes} phút</span>
                    <span>•</span>
                    <span>📝 {mode.questionCount} câu hỏi</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => startTest(mode.id)}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-4 py-2 text-xs font-extrabold text-white shadow hover:brightness-110 active:scale-95 transition"
                  >
                    Bắt đầu làm bài
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: ACTIVE TEST QUIZ RUNNER */}
      {currentStep === "TESTING" && (
        <div className="space-y-6">
          {/* TOP BAR: TIMER & PROGRESS */}
          <div className="sticky top-20 z-30 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/95 px-6 py-4 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-sumi-900/95">
            <div className="flex items-center gap-4">
              <span className="rounded-lg bg-red-100 px-3 py-1 text-xs font-black text-red-700 dark:bg-red-950/60 dark:text-red-300">
                Câu {questionIndex + 1} / {questions.length}
              </span>
              <span className="hidden sm:inline-block text-xs font-bold text-slate-400">
                Phần: {questions[questionIndex].category} ({questions[questionIndex].level})
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 font-mono text-base font-extrabold text-slate-800 dark:text-white">
                <span className="text-red-500">⏱️</span>
                <span className={timeLeft < 180 ? "animate-pulse text-red-600" : ""}>
                  {formatTimer(timeLeft)}
                </span>
              </div>

              <button
                type="button"
                onClick={finishTest}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition"
              >
                Nộp Bài ({answeredCount}/{questions.length})
              </button>
            </div>
          </div>

          {/* QUESTION BOX */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200/80 dark:bg-sumi-900 dark:ring-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-400">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                {questions[questionIndex].category} · Cấp độ {questions[questionIndex].level}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Đã trả lời {answeredCount}/{questions.length} câu
              </span>
            </div>

            {questions[questionIndex].subText && (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-700 dark:bg-sumi-800 dark:text-slate-200 border-l-4 border-red-500">
                <p className="jp-text leading-relaxed">{questions[questionIndex].subText}</p>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="jp-text text-lg sm:text-xl font-bold leading-relaxed text-slate-900 dark:text-white">
                {questions[questionIndex].question}
              </h3>
            </div>

            {/* OPTIONS */}
            <div className="grid gap-3 pt-2">
              {questions[questionIndex].options.map((opt, oIdx) => {
                const isSelected = userAnswers[questions[questionIndex].id] === oIdx;
                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleSelectOption(questions[questionIndex].id, oIdx)}
                    className={`flex items-start gap-4 rounded-2xl border p-4 text-left font-medium transition ${
                      isSelected
                        ? "border-red-600 bg-red-50/80 text-red-900 shadow-sm ring-2 ring-red-500/20 dark:border-red-500 dark:bg-red-950/40 dark:text-red-100"
                        : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-sumi-850 dark:text-slate-200 dark:hover:bg-sumi-800"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                        isSelected
                          ? "bg-red-600 text-white"
                          : "bg-slate-100 text-slate-600 dark:bg-sumi-750 dark:text-slate-300"
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span className="jp-text flex-1 pt-0.5 text-base leading-snug">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* QUESTION NAV & ACTIONS */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-800">
              <button
                type="button"
                disabled={questionIndex === 0}
                onClick={() => {
                  playClick();
                  setQuestionIndex((prev) => Math.max(0, prev - 1));
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-sumi-800"
              >
                ← Câu trước
              </button>

              <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto max-w-xs">
                {questions.map((q, idx) => {
                  const isDone = userAnswers[q.id] !== undefined;
                  const isCurrent = idx === questionIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setQuestionIndex(idx)}
                      className={`h-7 w-7 rounded-lg text-xs font-extrabold transition ${
                        isCurrent
                          ? "bg-red-600 text-white ring-2 ring-red-400"
                          : isDone
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-400 dark:bg-sumi-800"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {questionIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1));
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition"
                >
                  Câu tiếp →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={finishTest}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-6 py-2.5 text-xs font-black text-white shadow hover:brightness-110 transition"
                >
                  Hoàn tất & Nộp bài 🎉
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: RESULT DASHBOARD */}
      {currentStep === "RESULT" && (
        <div className="space-y-8 animate-fadeIn">
          {/* HERO SUMMARY */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sumi-900 to-red-950 p-8 text-white shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-left">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-amber-300 backdrop-blur">
                  🏆 KẾT QUẢ BÀI KIỂM TRA NĂNG LỰC
                </span>
                <h2 className="text-3xl font-black tracking-tight">
                  {scorePercent >= 80
                    ? "Xuất Sắc! Bạn Đã Vượt Qua Thử Thách 🎉"
                    : scorePercent >= 60
                    ? "Khá Tốt! Tiếp Tục Phát Huy Nhé 💪"
                    : "Đạt Mức Cơ Bản! Cố Gắng Thêm Nào 🌱"}
                </h2>
                <p className="max-w-md text-sm text-slate-300 leading-relaxed">
                  Bạn đã trả lời đúng <b className="text-white">{correctCount}</b> / {questions.length} câu hỏi. Dưới đây là phân tích chi tiết kỹ năng và đề xuất lộ trình.
                </p>
              </div>

              {/* SCORE BADGE */}
              <div className="flex shrink-0 flex-col items-center justify-center rounded-3xl bg-white/10 p-6 text-center backdrop-blur ring-1 ring-white/20 min-w-[180px]">
                <span className="text-xs font-bold text-slate-300">TỔNG ĐIỂM</span>
                <span className="text-5xl font-black text-amber-400 mt-1">{scorePercent}%</span>
                <span className="mt-2 rounded-full bg-amber-400/20 px-3 py-0.5 text-xs font-bold text-amber-300">
                  {scorePercent >= 85 ? "Xếp loại S" : scorePercent >= 70 ? "Xếp loại A" : scorePercent >= 50 ? "Xếp loại B" : "Xếp loại C"}
                </span>
              </div>
            </div>
          </div>

          {/* ACTION CARDS: RECOMMENDED LEVEL & XP REWARD */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* CARD 1: LEVEL RECOMMENDATION */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-sumi-900 dark:ring-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 text-xl text-red-600 dark:bg-red-950/60 dark:text-red-400">
                  🎯
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Trình Độ Khuyên Dùng</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Dựa trên kết quả bài test của bạn</p>
                </div>
              </div>

              <div className="rounded-2xl bg-red-50/70 p-4 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Lộ trình khuyến nghị: <span className="font-black text-red-600 dark:text-red-400 text-lg">JLPT {recommendedLevel}</span>
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {recommendedLevel === "N3"
                    ? "Bạn có nền tảng vững chắc N5 & N4. Hãy tự tin bắt đầu khóa N3!"
                    : recommendedLevel === "N4"
                    ? "Bạn đã nắm chắc N5 và sẵn sàng chinh phục trình độ N4."
                    : "Hãy bắt đầu củng cố nền tảng kiến thức từ trình độ N5 nhé!"}
                </p>
              </div>

              <button
                type="button"
                disabled={isUpdatingLevel || levelUpdated}
                onClick={handleUpdateLevel}
                className={`w-full rounded-2xl py-3 text-xs font-extrabold text-white shadow transition flex items-center justify-center gap-2 ${
                  levelUpdated
                    ? "bg-emerald-600"
                    : "bg-gradient-to-r from-red-600 to-rose-500 hover:brightness-110 active:scale-95"
                }`}
              >
                {isUpdatingLevel ? (
                  <span>Đang cập nhật...</span>
                ) : levelUpdated ? (
                  <span>✓ Đã cập nhật trình độ {recommendedLevel} vào Hồ sơ!</span>
                ) : (
                  <span>Cập nhật trình độ {recommendedLevel} vào Hồ sơ →</span>
                )}
              </button>
            </div>

            {/* CARD 2: XP REWARD */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-sumi-900 dark:ring-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-xl text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                  ⭐
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Phần Thưởng Kinh Nghiệm</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Phần thưởng cho sự nỗ lực làm bài</p>
                </div>
              </div>

              <div className="rounded-2xl bg-amber-50/70 p-4 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Phần thưởng bài test: <span className="font-black text-amber-600 dark:text-amber-400 text-lg">+100 XP</span>
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Cộng điểm trực tiếp vào tổng tích lũy và tăng thứ hạng trên Bảng xếp hạng.
                </p>
              </div>

              <button
                type="button"
                disabled={isClaimingXP || xpClaimed}
                onClick={handleClaimXP}
                className={`w-full rounded-2xl py-3 text-xs font-extrabold text-white shadow transition flex items-center justify-center gap-2 ${
                  xpClaimed
                    ? "bg-emerald-600"
                    : "bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110 active:scale-95"
                }`}
              >
                {isClaimingXP ? (
                  <span>Đang nhận thưởng...</span>
                ) : xpClaimed ? (
                  <span>✓ Đã nhận +100 XP Thưởng!</span>
                ) : (
                  <span>Nhận +100 XP Thưởng Hoàn Thành 🎁</span>
                )}
              </button>
            </div>
          </div>

          {/* CATEGORY BREAKDOWN BARS */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-sumi-900 dark:ring-slate-800 space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white">Phân Tích Chi Tiết Kỹ Năng</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(categoryStats).map(([cat, stat]) => {
                const percent = Math.round((stat.correct / stat.total) * 100);
                return (
                  <div key={cat} className="space-y-2 rounded-2xl bg-slate-50 p-4 dark:bg-sumi-850">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>{cat}</span>
                      <span>{stat.correct} / {stat.total} câu ({percent}%)</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-sumi-750">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTION BUTTONS & ANSWER REVIEW TOGGLE */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep("SELECT")}
              className="w-full sm:w-auto rounded-2xl border border-slate-300 bg-white px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-sumi-900 dark:text-slate-200 dark:hover:bg-sumi-800 transition"
            >
              ← Chọn Bài Test Khác
            </button>

            <button
              type="button"
              onClick={() => setShowReview((prev) => !prev)}
              className="w-full sm:w-auto rounded-2xl bg-slate-900 px-6 py-3 text-xs font-bold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition"
            >
              {showReview ? "Ẩn Chi Tiết Đáp Án" : "Xem Chi Tiết Đáp Án & Giải Thích 📖"}
            </button>
          </div>

          {/* DETAILED ANSWER REVIEW */}
          {showReview && (
            <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-sumi-900 dark:ring-slate-800 animate-fadeIn">
              <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
                Chi Tiết Đáp Án & Giải Thích
              </h3>

              <div className="space-y-6 pt-2">
                {questions.map((q, idx) => {
                  const userChoice = userAnswers[q.id];
                  const isCorrect = userChoice !== undefined && q.options[userChoice]?.isCorrect;

                  return (
                    <div
                      key={q.id}
                      className={`rounded-2xl border p-5 space-y-3 ${
                        isCorrect
                          ? "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                          : "border-rose-200 bg-rose-50/40 dark:border-rose-900/50 dark:bg-rose-950/20"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-500 dark:text-slate-400">
                          Câu {idx + 1} ({q.category} · {q.level})
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
                            isCorrect
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          {isCorrect ? "✓ Đúng" : "✗ Sai"}
                        </span>
                      </div>

                      <p className="jp-text font-bold text-slate-900 dark:text-white text-base">
                        {q.question}
                      </p>

                      <div className="grid gap-2 pt-1 text-sm">
                        {q.options.map((opt, oIdx) => {
                          const wasChosen = userChoice === oIdx;
                          return (
                            <div
                              key={oIdx}
                              className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium ${
                                opt.isCorrect
                                  ? "bg-emerald-200/60 font-bold text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-100"
                                  : wasChosen
                                  ? "bg-rose-200/60 font-bold text-rose-900 dark:bg-rose-900/60 dark:text-rose-100"
                                  : "bg-slate-100/60 text-slate-600 dark:bg-sumi-800 dark:text-slate-400"
                              }`}
                            >
                              <span>
                                {opt.label}. {opt.text}
                              </span>
                              {opt.isCorrect && <span>Đáp án đúng</span>}
                              {wasChosen && !opt.isCorrect && <span>Lựa chọn của bạn</span>}
                            </div>
                          );
                        })}
                      </div>

                      <div className="rounded-xl bg-white/80 p-3 text-xs text-slate-600 dark:bg-sumi-950/60 dark:text-slate-300 border-l-2 border-amber-400">
                        <b>💡 Giải thích:</b> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
