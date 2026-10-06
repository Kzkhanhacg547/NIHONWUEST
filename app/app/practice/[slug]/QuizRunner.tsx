"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";
import { notifyProgressUpdated } from "@/components/UserProgressContext";
import { SpeakButton } from "./LessonSections";
import { IconArrowRight, IconCheck, IconClose, IconRefresh } from "./LessonIcons";

interface Option {
  id: string;
  label: string;
  text: string;
  isCorrect?: boolean;
}

interface Exercise {
  id: string;
  type: string;
  contentType?: string | null;
  question: string;
  prompt?: string | null;
  correctAnswer: string;
  options: Option[];
  points: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  level?: string;
  xpReward: number;
  exercises: Exercise[];
}

interface NextLesson {
  id: string;
  slug: string;
  title: string;
  level: string;
  xpReward: number;
}

const normalize = (value: string) => value.trim().toLowerCase();

/** Must stay in sync with PASS_THRESHOLD in app/api/lessons/complete/route.ts. */
const PASS_PERCENT = 60;

function exerciseKind(contentType?: string | null) {
  if (contentType === "VOCAB") return "Từ vựng";
  if (contentType === "GRAMMAR") return "Ngữ pháp";
  return "Luyện tập";
}

// Grammatical explanation helper for Japanese questions
function getGrammarExplanation(question: string, correctAnswer: string, prompt?: string | null) {
  if (prompt && prompt.trim().length > 5) {
    return {
      title: "Giải thích ngữ cảnh",
      breakdown: prompt,
      rule: "Ghi nhớ cấu trúc mẫu câu tương ứng trong ngữ cảnh này.",
    };
  }

  // Detect grammatical patterns
  if (correctAnswer.includes("は") && (correctAnswer.includes("です") || correctAnswer.includes("ではありません"))) {
    return {
      title: "Cấu trúc Danh từ & Trợ từ 「は」(wa)",
      breakdown: "「は」 đóng vai trò trợ từ chỉ chủ đề của câu. 「です」 là đuôi câu khẳng định lịch sự.",
      rule: "A は B です (A là B) · A は B ではありません (A không phải là B)",
    };
  }

  if (correctAnswer.includes("を") && correctAnswer.includes("ます")) {
    return {
      title: "Trợ từ Tân ngữ 「を」(o)",
      breakdown: "「を」 kết nối giữa đối tượng tác động (tân ngữ) và hành động (động từ).",
      rule: "Danh từ + を + Động từ (Ví dụ: 水を飲みます - Uống nước)",
    };
  }

  if (correctAnswer.includes("に") || correctAnswer.includes("へ")) {
    return {
      title: "Trợ từ Điểm đến & Thời gian 「に / へ」",
      breakdown: "「に / へ」 chỉ hướng chuyển động tới địa điểm, hoặc thời điểm cụ thể diễn ra hành động.",
      rule: "Địa điểm + に/へ + 行きます (Đi tới đâu) · Thời gian + に + Hành động",
    };
  }

  if (correctAnswer.includes("これ") || correctAnswer.includes("それ") || correctAnswer.includes("あれ")) {
    return {
      title: "Đại từ chỉ định Ko-So-A-Do",
      breakdown: "これ (vật ở gần người nói) · それ (vật ở gần người nghe) · あれ (vật ở xa cả hai).",
      rule: "これ / それ / あれ + は + Danh từ + です",
    };
  }

  return {
    title: "Phân tích câu trả lời đúng",
    breakdown: `Đáp án chính xác là "${correctAnswer}". Hãy chú ý sự phù hợp giữa câu hỏi và ngữ cảnh đối thoại.`,
    rule: "Ôn tập lại từ vựng và mẫu câu này để củng cố phản xạ.",
  };
}

export function QuizRunner({
  lesson,
  nextLesson,
}: {
  lesson: Lesson;
  nextLesson: NextLesson | null;
}) {
  const router = useRouter();
  const { playClick, playCorrect, playIncorrect, playFanfare, showToast, speak } = useSoundAndTheme();

  // Hàng đợi câu hỏi (chỉ số vào lesson.exercises). "Hỏi khác" đẩy câu hiện tại xuống cuối hàng.
  const [queue, setQueue] = useState<number[]>(() => lesson.exercises.map((_, i) => i));
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [hasChecked, setHasChecked] = useState(false);
  const [answersLog, setAnswersLog] = useState<
    Array<{ exerciseId: string; question: string; answer: string; correctAnswer: string; isCorrect: boolean }>
  >([]);
  const [isFinished, setIsFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [summaryData, setSummaryData] = useState<{ score: number; xpAwarded: number; passed: boolean } | null>(null);
  // Số câu của lượt làm hiện tại. Lượt "học lại câu sai" chỉ có một phần nên
  // không dùng được totalQuestions để tính tiến độ.
  const [attemptTotal, setAttemptTotal] = useState(lesson.exercises.length);

  const totalQuestions = lesson.exercises.length;
  const currentExercise: Exercise | undefined = lesson.exercises[queue[0]];
  const currentNumber = attemptTotal - queue.length + 1;

  const displayedOptions = useMemo(() => {
    if (!currentExercise?.options || currentExercise.options.length === 0) return [];
    const list = [...currentExercise.options];
    // Fisher-Yates random shuffle for fair distribution across A, B, C, D
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    const labels = ["A", "B", "C", "D", "E", "F"];
    return list.map((opt, idx) => ({
      ...opt,
      displayLabel: labels[idx] ?? String.fromCharCode(65 + idx),
    }));
  }, [currentExercise]);

  // Báo cho thanh tiến độ bài học biết đã bắt đầu phần 4
  useEffect(() => {
    if (selectedAnswer || answersLog.length > 0) {
      window.dispatchEvent(new CustomEvent("nq:quiz-progress"));
    }
  }, [selectedAnswer, answersLog.length]);

  const handleSelectOption = useCallback(
    (text: string) => {
      if (hasChecked) return;
      playClick();
      setSelectedAnswer(text);
    },
    [hasChecked, playClick]
  );

  const handleCheckAnswer = useCallback(() => {
    if (!selectedAnswer || hasChecked || !currentExercise) return;

    const isCorrect = normalize(selectedAnswer) === normalize(currentExercise.correctAnswer);

    if (isCorrect) {
      playCorrect();
    } else {
      playIncorrect();
    }

    setHasChecked(true);
    // Giữ đúng một bản ghi cho mỗi câu: nếu không, lượt làm lại sẽ gửi trùng
    // exerciseId và API từ chối với "Incomplete submission".
    setAnswersLog((prev) => [
      ...prev.filter((a) => a.exerciseId !== currentExercise.id),
      {
        exerciseId: currentExercise.id,
        question: currentExercise.question,
        answer: selectedAnswer,
        correctAnswer: currentExercise.correctAnswer,
        isCorrect,
      },
    ]);
  }, [selectedAnswer, hasChecked, currentExercise, playCorrect, playIncorrect]);

  /**
   * Học lại. `onlyWrong` giữ lại các câu đã đúng và chỉ xếp lại câu sai, nên
   * answersLog vẫn phủ đủ toàn bộ bài khi submit.
   */
  const startRetry = useCallback(
    (onlyWrong: boolean) => {
      playClick();
      const correctIds = new Set(answersLog.filter((a) => a.isCorrect).map((a) => a.exerciseId));
      const retryPool = onlyWrong
        ? lesson.exercises.map((ex, i) => ({ ex, i })).filter(({ ex }) => !correctIds.has(ex.id)).map(({ i }) => i)
        : lesson.exercises.map((_, i) => i);

      // Trường hợp "học lại câu sai" nhưng không còn câu sai nào → làm lại toàn bộ.
      const pool = retryPool.length ? retryPool : lesson.exercises.map((_, i) => i);

      setQueue(pool);
      setAttemptTotal(pool.length);
      setAnswersLog(onlyWrong ? answersLog.filter((a) => a.isCorrect) : []);
      setSelectedAnswer("");
      setHasChecked(false);
      setIsFinished(false);
      setSummaryData(null);
    },
    [answersLog, lesson.exercises, playClick]
  );

  const handleSkip = useCallback(() => {
    if (hasChecked || queue.length < 2) return;
    playClick();
    setQueue((q) => [...q.slice(1), q[0]]);
    setSelectedAnswer("");
  }, [hasChecked, queue.length, playClick]);

  const finishLesson = useCallback(async () => {
    setSubmitting(true);
    const correctCount = answersLog.filter((a) => a.isCorrect).length;
    const localScore = Math.round((correctCount / Math.max(1, totalQuestions)) * 100);

    try {
      const res = await fetch("/api/lessons/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          answers: answersLog.map((a) => ({
            exerciseId: a.exerciseId,
            answer: a.answer,
            timeSpent: 10,
          })),
        }),
      });

      const data = await res.json().catch(() => ({}));
      // Server mới là nguồn sự thật: nó mới quyết định đạt/không đạt và XP.
      const passed = typeof data.passed === "boolean" ? data.passed : localScore >= PASS_PERCENT;
      const score = typeof data.score === "number" ? data.score : localScore;
      const xpAwarded = typeof data.xpAwarded === "number" ? data.xpAwarded : 0;

      setIsFinished(true);
      setSummaryData({ score, xpAwarded, passed });
      if (passed) playFanfare();
      else playIncorrect();

      if (!res.ok) {
        showToast({
          title: "Chưa lưu được kết quả",
          description: data.error ?? "Vui lòng làm lại bài quiz.",
          type: "error",
        });
      } else {
        notifyProgressUpdated();
        if (!passed) {
          showToast({
            title: `Chưa đạt ${PASS_PERCENT}% — cần luyện lại`,
            description: `Đạt ${score}% điểm. Bài học chưa được tính XP.`,
            type: "info",
          });
        } else if (data.isPriorCompleted) {
          showToast({
            title: `Luyện tập lại hoàn tất: ${lesson.title}!`,
            description: `Đạt ${score}% điểm · Điểm cao nhất: ${data.bestScore ?? score}%!`,
            type: "info",
          });
        } else {
          showToast({
            title: `Hoàn thành bài học: ${lesson.title}!`,
            description: `Đạt ${score}% điểm · Nhận +${xpAwarded} XP!`,
            type: "xp",
          });
        }
      }
      router.refresh();
    } catch {
      setIsFinished(true);
      setSummaryData({ score: localScore, xpAwarded: 0, passed: false });
    }
    setSubmitting(false);
  }, [answersLog, lesson, totalQuestions, playFanfare, playIncorrect, showToast, router]);

  const handleNextQuestion = useCallback(async () => {
    playClick();
    if (queue.length > 1) {
      setQueue((q) => q.slice(1));
      setSelectedAnswer("");
      setHasChecked(false);
    } else {
      await finishLesson();
    }
  }, [queue.length, playClick, finishLesson]);

  // Desktop Keyboard Shortcuts (1, 2, 3, 4, Enter)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (!isFinished && currentExercise) {
        if (!hasChecked) {
          if (displayedOptions.length > 0) {
            const keyNum = parseInt(e.key, 10);
            if (keyNum >= 1 && keyNum <= displayedOptions.length) {
              e.preventDefault();
              handleSelectOption(displayedOptions[keyNum - 1].text);
            }
          }
          if (e.key === "Enter" && selectedAnswer.trim()) {
            e.preventDefault();
            handleCheckAnswer();
          }
        } else if (e.key === "Enter" && !submitting) {
          e.preventDefault();
          handleNextQuestion();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFinished, currentExercise, displayedOptions, hasChecked, selectedAnswer, submitting, handleSelectOption, handleCheckAnswer, handleNextQuestion]);

  // ==================== EMPTY ====================
  if (totalQuestions === 0 || !currentExercise) {
    if (!isFinished) {
      return (
        <p className="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-500 dark:bg-sumi-800/60 dark:text-slate-400">
          Bài học này chưa có câu hỏi luyện tập.
        </p>
      );
    }
  }

  // ==================== LESSON COMPLETE ====================
  if (isFinished && summaryData) {
    const correctCount = answersLog.filter((a) => a.isCorrect).length;
    const wrongAnswers = answersLog.filter((a) => !a.isCorrect);
    const passed = summaryData.passed;
    // Ngưỡng đạt được server áp dụng; hiển thị sai sẽ khiến người học tưởng đã qua.
    const needed = Math.max(0, Math.ceil((PASS_PERCENT / 100) * totalQuestions) - correctCount);

    return (
      <div className="space-y-4 text-center animate-in zoom-in-95 duration-200">
        <div
          className={`rounded-2xl border p-5 ${
            passed
              ? "border-rose-200 bg-rose-50/50 dark:border-red-900/60 dark:bg-red-950/20"
              : "border-amber-300 bg-amber-50/60 dark:border-amber-800/70 dark:bg-amber-950/25"
          }`}
        >
          <div className="mb-2 text-5xl">{passed ? "🎉" : "📖"}</div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {passed ? "Xuất sắc! お疲れ様でした!" : "Chưa đạt yêu cầu — học lại nhé!"}
          </h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {passed ? (
              <>
                Bạn vừa hoàn thành:{" "}
                <span className="font-bold text-slate-900 dark:text-white">{lesson.title}</span>
              </>
            ) : (
              <>
                Cần đúng ít nhất <b className="text-amber-700 dark:text-amber-300">{PASS_PERCENT}%</b> để mở bài
                tiếp theo. Còn thiếu <b>{needed}</b> câu nữa.
              </>
            )}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-slate-200/80 bg-white p-3 dark:border-slate-700 dark:bg-sumi-800/80">
              <span className="text-[11px] font-bold text-slate-500">Đúng</span>
              <p className="mt-0.5 text-lg font-black text-emerald-600">
                {correctCount} / {totalQuestions}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white p-3 dark:border-slate-700 dark:bg-sumi-800/80">
              <span className="text-[11px] font-bold text-slate-500">Chính xác</span>
              <p className={`mt-0.5 text-lg font-black ${passed ? "text-indigo-600 dark:text-indigo-400" : "text-amber-600 dark:text-amber-400"}`}>
                {summaryData.score}%
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white p-3 dark:border-slate-700 dark:bg-sumi-800/80">
              <span className="text-[11px] font-bold text-slate-500">Kinh nghiệm</span>
              <p className="mt-0.5 text-lg font-black text-amber-500">+{summaryData.xpAwarded} XP</p>
            </div>
          </div>
        </div>

        {wrongAnswers.length > 0 && (
          <div className="space-y-2 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-left dark:border-red-900 dark:bg-red-950/30">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black text-rose-700 dark:text-rose-300">
                📚 {wrongAnswers.length} nội dung cần ôn lại trong SRS
              </span>
              <Link href="/app/review">
                <Button variant="torii" size="sm" className="px-3 py-1 text-xs">
                  Ôn ngay
                </Button>
              </Link>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
              Các câu chưa chính xác đã được lưu vào hàng đợi Spaced Repetition (SRS) để nhắc bạn ôn đúng thời điểm.
            </p>
          </div>
        )}

        {/* Học lại — luôn có, kể cả khi đã đạt */}
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 text-left dark:border-slate-800 dark:bg-sumi-900">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Luyện lại</span>
          <div className="flex flex-col gap-2 pt-1 sm:flex-row">
            {wrongAnswers.length > 0 && (
              <Button
                variant="torii"
                size="md"
                onClick={() => startRetry(true)}
                className="flex-1 font-black"
              >
                <IconRefresh width={16} height={16} /> Học lại {wrongAnswers.length} câu sai
              </Button>
            )}
            <Button
              variant="secondary"
              size="md"
              onClick={() => startRetry(false)}
              className="flex-1 font-bold"
            >
              <IconRefresh width={16} height={16} /> Làm lại toàn bộ
            </Button>
          </div>
        </div>

        {passed ? (
          nextLesson ? (
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 text-left dark:border-slate-800 dark:bg-sumi-900">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Bài học tiếp theo</span>
              <h4 className="text-base font-black text-slate-900 dark:text-white">{nextLesson.title}</h4>
              <Link href={`/app/practice/${nextLesson.slug}`} className="block pt-1">
                <Button variant="torii" size="md" className="w-full">
                  Tiếp tục bài học <IconArrowRight width={16} height={16} />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left dark:border-emerald-800 dark:bg-emerald-950/40">
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                🏆 Bạn đã hoàn thành tất cả bài học {lesson.level ?? ""}!
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Khám phá bản đồ Shinkansen hoặc thử thách hội thoại Survival Mode để áp dụng kiến thức thực tế.
              </p>
              <div className="flex gap-2 pt-1">
                <Link href="/app/journey" className="flex-1">
                  <Button variant="gold" size="sm" className="w-full">Khám phá Nhật Bản 🗾</Button>
                </Link>
                <Link href="/app/survival" className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">Survival 🍜</Button>
                </Link>
              </div>
            </div>
          )
        ) : (
          /* Chưa đạt: không mở đường sang bài tiếp theo. */
          <div className="space-y-2 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-left dark:border-amber-800/70 dark:bg-amber-950/25">
            <span className="text-xs font-black text-amber-800 dark:text-amber-300">
              🔒 Bài học tiếp theo đang khóa
            </span>
            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              Đạt {PASS_PERCENT}% để mở khóa và nhận +{lesson.xpReward} XP. Ôn lại phần từ vựng/ngữ pháp phía
              bên trái rồi làm lại phần trên nhé.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Link href="/app/practice" className="flex-1">
            <Button variant="secondary" size="sm" className="w-full">← Danh sách bài học</Button>
          </Link>
          <Link href="/app" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">Dashboard ⛩️</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!currentExercise) return null;

  // ==================== ACTIVE QUIZ VIEW ====================
  const progressPercent = Math.round((currentNumber / Math.max(1, attemptTotal)) * 100);
  const liveCorrect = answersLog.filter((a) => a.isCorrect).length;
  const isCurrentCorrect = hasChecked && normalize(selectedAnswer) === normalize(currentExercise.correctAnswer);
  const explanation = hasChecked
    ? getGrammarExplanation(currentExercise.question, currentExercise.correctAnswer, currentExercise.prompt)
    : null;
  const canSkip = !hasChecked && queue.length > 1;

  return (
    <div className="space-y-4">
      {/* Tiến độ */}
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
          <span>
            Câu {currentNumber} / {attemptTotal}
          </span>
          <span className="shrink-0 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
            Cần ≥ {PASS_PERCENT}% để qua
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-rose-100 dark:bg-sumi-800"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={attemptTotal}
          aria-valuenow={currentNumber}
          aria-label={`Tiến độ câu ${currentNumber}/${attemptTotal}`}
        >
          <div className="h-full rounded-full bg-red-600 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
        {/* Điểm tạm tính để người học biết còn đủ điều kiện qua bài hay không */}
        <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          Đã đúng {liveCorrect} câu · cần tối thiểu{" "}
          <b className="text-amber-600 dark:text-amber-400">
            {Math.ceil((PASS_PERCENT / 100) * attemptTotal)}
          </b>{" "}
          câu để đạt {PASS_PERCENT}%
        </p>
      </div>

      {/* Câu hỏi + đáp án */}
      <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-rose-50/30 p-4 dark:border-slate-800 dark:bg-sumi-900/50 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-md border border-rose-100 bg-rose-50 px-2 py-0.5 text-xs font-bold text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            <i className="h-3 w-0.5 rounded bg-red-500" aria-hidden />
            {exerciseKind(currentExercise.contentType)}
          </span>
          <SpeakButton onClick={() => speak(currentExercise.question)} label="Nghe phát âm câu hỏi" />
        </div>

        <h3 className="text-lg font-black leading-snug text-balance text-slate-900 dark:text-white sm:text-xl">{currentExercise.question}</h3>

        {displayedOptions.length > 0 ? (
          <div className="grid gap-2.5" role="group" aria-label="Các đáp án">
            {displayedOptions.map((opt, idx) => {
              const isSelected = selectedAnswer === opt.text;
              const isCorrectOption = normalize(opt.text) === normalize(currentExercise.correctAnswer);
              const isWrongPick = hasChecked && isSelected && !isCurrentCorrect;

              let box = "border-slate-200 bg-white hover:border-red-300 dark:border-slate-800 dark:bg-sumi-900 dark:hover:border-red-800";
              let letter = "bg-slate-100 text-slate-600 dark:bg-sumi-800 dark:text-slate-300";

              if (isSelected && !hasChecked) {
                box = "border-red-500 bg-red-50/60 ring-1 ring-red-400 dark:bg-red-950/30";
                letter = "bg-red-600 text-white";
              }
              if (hasChecked) {
                if (isCorrectOption) {
                  box = "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 dark:bg-emerald-950/50";
                  letter = "bg-emerald-600 text-white";
                } else if (isWrongPick) {
                  box = "border-red-500 bg-red-50 ring-1 ring-red-500 dark:bg-red-950/50";
                  letter = "bg-red-600 text-white";
                } else {
                  box = "border-slate-200 bg-white opacity-50 dark:border-slate-800 dark:bg-sumi-900";
                }
              }

              return (
                <button
                  key={opt.id || idx}
                  type="button"
                  disabled={hasChecked}
                  aria-pressed={isSelected}
                  onClick={() => handleSelectOption(opt.text)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500 ${box}`}
                >
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-black ${letter}`}>
                    {opt.displayLabel}
                  </span>
                  <span className="jp-text flex-1 text-base font-bold text-slate-900 dark:text-slate-100">{opt.text}</span>
                  {isSelected && !hasChecked && (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-red-600 text-white">
                      <IconCheck width={14} height={14} strokeWidth={3} />
                    </span>
                  )}
                  {hasChecked && isCorrectOption && (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-white">
                      <IconCheck width={14} height={14} strokeWidth={3} />
                    </span>
                  )}
                  {isWrongPick && (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-red-600 text-white">
                      <IconClose width={13} height={13} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <input
            disabled={hasChecked}
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
            placeholder="Nhập câu trả lời của bạn..."
            className="w-full rounded-xl border-2 border-slate-300 bg-white p-3.5 text-lg font-bold outline-none focus:border-red-500 dark:border-slate-700 dark:bg-sumi-900"
          />
        )}
      </div>

      {/* Phản hồi + giải thích */}
      {hasChecked && (
        <div
          role="status"
          className={`animate-in fade-in rounded-2xl border p-4 ${
            isCurrentCorrect
              ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white text-emerald-900 dark:border-emerald-800 dark:from-emerald-950/50 dark:to-sumi-900 dark:text-emerald-100"
              : "border-rose-200 bg-gradient-to-br from-rose-50 to-white text-rose-900 dark:border-rose-900 dark:from-rose-950/50 dark:to-sumi-900 dark:text-rose-100"
          }`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-white ${
                isCurrentCorrect ? "bg-emerald-500" : "bg-red-500"
              }`}
            >
              {isCurrentCorrect ? <IconCheck width={20} height={20} strokeWidth={3} /> : <IconClose width={18} height={18} strokeWidth={3} />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className={`font-black ${isCurrentCorrect ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>
                  {isCurrentCorrect ? "Chính xác!" : "Chưa chính xác"}
                </p>
                {isCurrentCorrect && (
                  <span className="shrink-0 rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-black text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
                    🔥 +{currentExercise.points} XP
                  </span>
                )}
              </div>
              {!isCurrentCorrect && (
                <p className="mt-0.5 text-sm">
                  Đáp án đúng: <span className="jp-text font-black">{currentExercise.correctAnswer}</span>
                </p>
              )}
              {explanation && (
                <>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300">{explanation.breakdown}</p>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">💡 {explanation.rule}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hành động */}
      <div className={`grid gap-3 ${canSkip ? "grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]" : "grid-cols-1"}`}>
        {canSkip && (
          <Button variant="outline" size="lg" onClick={handleSkip} className="font-bold">
            <IconRefresh width={16} height={16} /> Hỏi khác
          </Button>
        )}
        {!hasChecked ? (
          <Button
            variant="torii"
            size="lg"
            disabled={!selectedAnswer.trim()}
            onClick={handleCheckAnswer}
            className="font-black"
          >
            Kiểm tra đáp án
          </Button>
        ) : (
          <Button variant="torii" size="lg" loading={submitting} onClick={handleNextQuestion} className="font-black">
            {queue.length > 1 ? (
              <>
                Câu tiếp theo <IconArrowRight width={18} height={18} />
              </>
            ) : (
              "Nộp bài & xem kết quả"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
