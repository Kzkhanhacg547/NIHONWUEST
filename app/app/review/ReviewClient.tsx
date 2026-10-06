"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, EmptyState, Icon, Modal, type IconName } from "@/components/ui";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";
import { notifyProgressUpdated } from "@/components/UserProgressContext";
import { type EnrichedReviewItem } from "@/lib/review/resolveReviewItem";
import { updateSrs } from "@/lib/srs";

type Grade = "AGAIN" | "HARD" | "GOOD" | "EASY";

/**
 * Interval labels describe the SRS algorithm in lib/srs.ts, they are not
 * decoration. Previously these were hardcoded to values the scheduler never
 * produced, so the UI contradicted the schedule it actually ran.
 */
function describeInterval(grade: Grade, ease: number): string {
  const next = updateSrs({ ease, interval: 0, repetitions: 0 }, grade);
  if (next.dueInDays <= 0) return "Ôn lại ngay";
  if (next.dueInDays < 1) return "Trong 1 ngày nữa";
  if (next.dueInDays < 7) return `~${Math.round(next.dueInDays)} ngày nữa`;
  if (next.dueInDays < 30) return `~${Math.round(next.dueInDays / 7)} tuần nữa`;
  return `~${Math.round(next.dueInDays / 30)} tháng nữa`;
}

const GRADES: readonly {
  grade: Grade;
  key: string;
  label: string;
  tone: "again" | "hard" | "good" | "easy";
  icon: IconName;
}[] = [
  { grade: "AGAIN", key: "1", label: "Again", tone: "again", icon: "refresh" },
  { grade: "HARD", key: "2", label: "Hard", tone: "hard", icon: "bars" },
  { grade: "GOOD", key: "3", label: "Good", tone: "good", icon: "minusCircle" },
  { grade: "EASY", key: "4", label: "Easy", tone: "easy", icon: "sparkle" },
];

const RATES = [0.6, 0.75, 0.85, 1, 1.2];

// Cỡ chữ thích ứng theo độ dài nội dung mặt thẻ
const termSize = (text: string) => {
  const len = text ? text.trim().length : 0;
  if (len <= 2) return "xl";
  if (len <= 8) return "lg";
  if (len <= 20) return "md";
  if (len <= 45) return "sm";
  return "xs";
};

// ======================== Nút phát âm dùng lại ở cột "Hàng đợi" ========================
export function SpeakButton({ text, className = "rv-icon-btn", size = 16 }: { text: string; className?: string; size?: number }) {
  const { speak } = useSoundAndTheme();
  return (
    <button
      type="button"
      className={className}
      aria-label={`Phát âm: ${text}`}
      title="Phát âm tiếng Nhật"
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
    >
      <Icon name="speaker" size={size} />
    </button>
  );
}

// ======================== Nút + hộp thoại "Cài đặt ôn tập" ========================
export function ReviewSettingsButton() {
  const [open, setOpen] = useState(false);
  const {
    soundEnabled,
    setSoundEnabled,
    speechRate,
    setSpeechRate,
    speechVoiceURI,
    setSpeechVoiceURI,
    availableVoices,
    speak,
    playClick,
  } = useSoundAndTheme();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="rv-chip-btn"
        onClick={() => {
          playClick();
          setOpen(true);
        }}
        aria-haspopup="dialog"
      >
        <Icon name="settings" size={17} />
        Cài đặt ôn tập
      </button>

      {open &&
        createPortal(
          <div className="rv-page">
            <Modal isOpen={open} onClose={() => setOpen(false)} title="Cài đặt ôn tập" maxWidth="md">
              <div className="rv-set">
                <div className="rv-set-row">
                  <span>Âm thanh hiệu ứng</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={soundEnabled}
                    aria-label="Âm thanh hiệu ứng"
                    className="rv-switch"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  />
                </div>

                <div>
                  <h4>Tốc độ đọc</h4>
                  <div className="rv-set-chips">
                    {RATES.map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        aria-pressed={Math.abs(rate - speechRate) < 0.001}
                        onClick={() => {
                          setSpeechRate(rate);
                          speak("ありがとう", rate);
                        }}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4>Giọng đọc</h4>
                  <select value={speechVoiceURI} onChange={(e) => setSpeechVoiceURI(e.target.value)}>
                    <option value="">Mặc định hệ thống</option>
                    {availableVoices.map((voice) => (
                      <option key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <h4>Phím tắt</h4>
                  <p>
                    <kbd>Space</kbd> lật thẻ · <kbd>←</kbd> <kbd>→</kbd> đổi thẻ · <kbd>1</kbd> Again · <kbd>2</kbd> Hard · <kbd>3</kbd> Good · <kbd>4</kbd> Easy
                    (chấm điểm sau khi đã lật thẻ).
                  </p>
                </div>

                <div>
                  <h4>SRS hoạt động thế nào?</h4>
                  <p>
                    Chọn <b>Good</b> hoặc <b>Easy</b> để giãn cách lần ôn tiếp theo (1 ngày → 3 ngày → 7 ngày…). Chọn{" "}
                    <b>Again</b> và thẻ quay về cuối hàng đợi hôm nay để bạn làm quen lại ngay.
                  </p>
                </div>
              </div>
            </Modal>
          </div>,
          document.body
        )}
    </>
  );
}

// ======================== Phiên ôn tập ========================
export function ReviewClient({ initial, backgrounds = [] }: { initial: EnrichedReviewItem[]; backgrounds?: string[] }) {
  const router = useRouter();
  const { playClick, playCorrect, playIncorrect, playFanfare, showToast } = useSoundAndTheme();

  const [items, setItems] = useState<EnrichedReviewItem[]>(initial);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sessionTotal] = useState(initial.length);
  const [done, setDone] = useState(0);

  const currentItem = items[currentIndex];

  const handleGrade = useCallback(
    async (grade: Grade) => {
      if (!currentItem || submitting) return;
      setSubmitting(true);
      playClick();

      try {
        const res = await fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewItemId: currentItem.id, grade }),
        });

        if (!res.ok) {
          showToast({ title: "Lỗi lưu đánh giá, vui lòng thử lại.", type: "error" });
          setSubmitting(false);
          return;
        }

        if (grade === "AGAIN") playIncorrect();
        else playCorrect();
        setIsFlipped(false);

        if (grade === "AGAIN") {
          // Move the card to the back of the session queue. The old code spliced
          // then pushed within one array, so length never changed and the last
          // card re-rendered itself instead of wrapping to index 0.
          const requeued = [...items];
          const [card] = requeued.splice(currentIndex, 1);
          requeued.push(card);
          setItems(requeued);
          setCurrentIndex(currentIndex + 1 >= requeued.length ? 0 : currentIndex + 1);
        } else {
          const nextItems = items.filter((_, idx) => idx !== currentIndex);
          setItems(nextItems);
          setDone((d) => d + 1);

          if (nextItems.length === 0) {
            playFanfare();
            // Ask the server for the bonus and report what it actually granted
            // instead of promising a fixed amount it might refuse.
            const dayKey = new Intl.DateTimeFormat("en-CA").format(new Date());
            let xpAwarded = 0;
            try {
              const bonusRes = await fetch("/api/activity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "REVIEW_COMPLETE", dayKey }),
              });
              if (bonusRes.ok) {
                const data = (await bonusRes.json()) as { xpAwarded?: number };
                xpAwarded = data.xpAwarded ?? 0;
              }
            } catch {
              xpAwarded = 0;
            }

            showToast({
              title:
                xpAwarded > 0
                  ? `🏆 Phiên ôn tập hoàn tất! +${xpAwarded} XP`
                  : "🏆 Phiên ôn tập hoàn tất!",
              description:
                xpAwarded > 0
                  ? "Chúc mừng bạn đã bảo vệ kiến thức khỏi đường cong quên lãng!"
                  : "Phần thưởng hôm nay đã được nhận. Tiếp tục ôn tập để giữ vững trí nhớ!",
              type: "achievement",
            });
            notifyProgressUpdated();
            router.refresh();
          } else {
            setCurrentIndex((prev) => (prev >= nextItems.length ? 0 : prev));
          }
        }
      } catch {
        showToast({ title: "Có lỗi xảy ra khi kết nối máy chủ.", type: "error" });
      }
      setSubmitting(false);
    },
    [currentItem, submitting, items, currentIndex, playClick, playCorrect, playIncorrect, playFanfare, showToast, router]
  );

  // Xem thẻ trước / sau mà không chấm điểm (không đổi lịch SRS)
  const goStep = useCallback(
    (dir: 1 | -1) => {
      const n = items.length;
      if (n < 2) return;
      setCurrentIndex((i) => (i + dir + n) % n);
      setIsFlipped(false);
    },
    [items.length]
  );

  // Phím tắt: Space lật thẻ, ←/→ đổi thẻ, 1–4 chấm điểm (sau khi lật)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target;
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement) return;
      if (document.querySelector('[aria-modal="true"]')) return; // đang mở hộp thoại / menu
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        goStep(e.key === "ArrowRight" ? 1 : -1);
        return;
      }
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        if (!e.repeat) setIsFlipped((f) => !f);
        return;
      }
      if (isFlipped && !submitting) {
        const g = GRADES.find((x) => x.key === e.key);
        if (g) handleGrade(g.grade);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFlipped, submitting, handleGrade, goStep]);

  if (!items.length) {
    return (
      <div className="rv-empty">
        <EmptyState
          icon="🧠✨"
          title="Tất cả kiến thức đã được ghi nhớ vững chắc!"
          body="Hiện tại không có thẻ nào đến hạn quên. Hệ thống SRS sẽ tự động tính toán chu kỳ và nhắc nhở bạn đúng thời điểm vàng."
          action={
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/app/practice">
                <Button variant="torii" size="md" className="font-bold">
                  Tiếp tục bài học N5
                </Button>
              </Link>
              <Link href="/app">
                <Button variant="secondary" size="md" className="font-bold">
                  Về Dashboard
                </Button>
              </Link>
            </div>
          }
        />

        <Card className="p-4 border-dashed border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-sumi-900/50 space-y-2">
          <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Icon name="bulb" size={15} /> Cơ chế Spaced Repetition (SRS)
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Hệ thống tự động điều chỉnh giãn cách ôn tập (1 ngày ➔ 3 ngày ➔ 7 ngày ➔ 14 ngày ➔ 30 ngày) dựa theo mức độ ghi nhớ bạn đánh giá, giúp bạn ghi nhớ kiến thức trọn đời mà không tốn công học dồn.
          </p>
        </Card>
      </div>
    );
  }

  const isJapaneseText =
    currentItem.contentType === "KANA" || currentItem.contentType === "VOCAB" || currentItem.contentType === "KANJI";
  const jlptLabel = currentItem.contentType === "KANA" ? "KANA" : `JLPT ${currentItem.level || "N5"}`;
  const position = Math.min(done + 1, sessionTotal);
  const size = termSize(currentItem.title);
  const showReading = Boolean(currentItem.reading) && currentItem.reading !== currentItem.title;
  const romaji = currentItem.romaji;
  const meaning = currentItem.extra || currentItem.subtitle;
  const tip =
    currentItem.contentType === "KANA"
      ? `Đọc to “${currentItem.title}” ba lần rồi viết ra giấy một lần — vừa nghe vừa viết giúp bạn nhớ nét chữ lâu hơn.`
      : `Hãy liên tưởng “${currentItem.title}” với một hình ảnh hoặc tình huống thật bạn từng gặp. Hình ảnh cụ thể sẽ giúp bạn nhớ lâu hơn!`;

  const flip = () => setIsFlipped((f) => !f);

  // Mỗi thẻ một phong cảnh, xoay vòng qua các ảnh trong public/images/SRS_card/back/
  const bg = backgrounds.length ? backgrounds[(done + currentIndex) % backgrounds.length] : null;
  const flashStyle = bg ? ({ "--rv-card-img": `url("${bg}")` } as CSSProperties) : undefined;

  const renderFace = (back: boolean) => (
    <div className={`rv-face ${back ? "is-back" : ""}`} aria-hidden={back ? !isFlipped : isFlipped}>
      <div className="rv-face-top">
        <span className="rv-count">
          {position} / {sessionTotal}
        </span>
        <span className="rv-jlpt">{jlptLabel}</span>
      </div>
      <div className="rv-face-main">
        <div className="rv-paper">
          <div className="rv-paper-body">
            <p className={`rv-term-text rv-fs-${back ? "md" : size} jp-text`}>{currentItem.title}</p>
            {showReading && <p className="rv-reading jp-text">{currentItem.reading}</p>}
            {!back && romaji && <p className="rv-romaji">{romaji}</p>}
            {back && meaning && <p className="rv-meaning">{meaning}</p>}
          </div>
          {isJapaneseText && <SpeakButton text={currentItem.title} className="rv-speak" size={20} />}
          {back && (
            <div className="rv-paper-foot">
              <span>Đã củng cố: {currentItem.repetitions} lần</span>
              <span>Chu kỳ hiện tại: {currentItem.interval} ngày</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="rv-session">
      <div
        className="rv-flash"
        style={flashStyle}
        tabIndex={0}
        onClick={flip}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target === e.currentTarget) {
            e.preventDefault();
            flip();
          }
        }}
      >
        <div className={`rv-flash-inner ${isFlipped ? "is-flipped" : ""}`}>
          {renderFace(false)}
          {renderFace(true)}
        </div>

        {items.length > 1 && (
          <>
            <button
              type="button"
              className="rv-nav is-prev"
              aria-label="Thẻ trước"
              onClick={(e) => {
                e.stopPropagation();
                playClick();
                goStep(-1);
              }}
            >
              <Icon name="arrowRight" size={22} />
            </button>
            <button
              type="button"
              className="rv-nav is-next"
              aria-label="Thẻ kế tiếp"
              onClick={(e) => {
                e.stopPropagation();
                playClick();
                goStep(1);
              }}
            >
              <Icon name="arrowRight" size={22} />
            </button>
          </>
        )}
      </div>

      <div className="rv-hint">
        <Icon name="tap" size={18} />
        <span>{isFlipped ? "Nhấn vào thẻ để lật lại" : "Nhấn vào thẻ để xem nghĩa"}</span>
        <kbd>Space</kbd>
      </div>

      <div className="rv-grades" role="group" aria-label="Đánh giá mức độ ghi nhớ">
        {GRADES.map((g) => (
          <button
            key={g.grade}
            type="button"
            className="rv-grade"
            data-tone={g.tone}
            // Grading an unseen card corrupts the schedule. The keyboard path
            // already checked this; the mouse path did not.
            disabled={submitting || !isFlipped}
            aria-keyshortcuts={g.key}
            onClick={() => handleGrade(g.grade)}
          >
            <Icon name={g.icon} size={26} strokeWidth={2.1} />
            <b>{g.label}</b>
            <small>{describeInterval(g.grade, currentItem.ease)}</small>
          </button>
        ))}
      </div>

      <div className="rv-tip">
        <Icon name="bulb" size={24} className="rv-tip-icon" />
        <div>
          <b>Mẹo ghi nhớ</b>
          <small>{tip}</small>
        </div>
        <Link href="/app/vocabulary">
          <Icon name="image" size={16} />
          Xem ví dụ
          <Icon name="external" size={15} />
        </Link>
      </div>
    </div>
  );
}