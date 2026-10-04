"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, EmptyState, Icon, Modal, type IconName } from "@/components/ui";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";
import { type EnrichedReviewItem } from "@/lib/review/resolveReviewItem";

type Grade = "AGAIN" | "HARD" | "GOOD" | "EASY";

// Nhãn thời gian chỉ để hiển thị (khớp thiết kế). Lịch ôn thật do /api/review (SM-2) quyết định.
const GRADES: readonly {
  grade: Grade;
  key: string;
  label: string;
  hint: string;
  tone: "again" | "hard" | "good" | "easy";
  icon: IconName;
}[] = [
  { grade: "AGAIN", key: "1", label: "Again", hint: "< 1 ngày nữa", tone: "again", icon: "refresh" },
  { grade: "HARD", key: "2", label: "Hard", hint: "3 ngày nữa", tone: "hard", icon: "bars" },
  { grade: "GOOD", key: "3", label: "Good", hint: "1 tuần nữa", tone: "good", icon: "minusCircle" },
  { grade: "EASY", key: "4", label: "Easy", hint: "2 tuần nữa", tone: "easy", icon: "sparkle" },
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
                    <kbd>Space</kbd> lật thẻ · <kbd>1</kbd> Again · <kbd>2</kbd> Hard · <kbd>3</kbd> Good · <kbd>4</kbd> Easy
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

// ======================== Phong cảnh trang trí sau mặt thẻ ========================
const BLOSSOMS_TOP: [number, number, number][] = [
  [18, 40, 9], [40, 62, 11], [68, 80, 10], [96, 98, 12], [120, 112, 9], [150, 118, 10],
  [44, 30, 7], [82, 56, 8], [112, 80, 8], [28, 86, 8], [10, 70, 7], [172, 134, 7],
  [112, 14, 8], [90, 26, 9], [70, 44, 8],
];
const BLOSSOMS_RIGHT: [number, number, number][] = [
  [776, 296, 9], [752, 314, 8], [790, 270, 8], [728, 330, 7], [796, 246, 7],
];

function Blossoms({ points }: { points: [number, number, number][] }) {
  return (
    <>
      {points.map(([x, y, r], i) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={r} fill={i % 2 ? "#fad0d3" : "#f6b3b9"} opacity="0.92" />
          <circle cx={x} cy={y} r={r / 3} fill="#ee8a94" opacity="0.9" />
        </g>
      ))}
    </>
  );
}

function CardScenery() {
  return (
    <svg className="rv-scenery" viewBox="0 0 800 340" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="rvMist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8d99a6" stopOpacity="0" />
          <stop offset="1" stopColor="#8d99a6" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* núi xa + sương */}
      <path d="M470 340l118-142c10-12 22-12 32 0l118 142z" fill="#9aa6b2" opacity="0.2" />
      <path d="M0 340V262c60-26 110-18 170 4s100 6 150-14 90-36 140-18 80 22 130 6 120-44 210-22V340z" fill="url(#rvMist)" />
      {/* rừng thông */}
      <path d="M24 322l12-36 12 36zM46 326l10-30 10 30zM70 320l9-26 9 26zM96 326l8-22 8 22z" fill="#4a6355" opacity="0.32" />
      <path d="M690 330l10-26 10 26zM716 334l8-20 8 20z" fill="#4a6355" opacity="0.3" />
      {/* cổng torii */}
      <g fill="#d3261e">
        <rect x="664" y="236" width="9" height="90" rx="1.5" />
        <rect x="727" y="236" width="9" height="90" rx="1.5" />
        <rect x="656" y="252" width="88" height="7" />
        <path d="M636 226Q700 244 764 226L768 212Q700 230 632 212Z" />
      </g>
      {/* cành anh đào */}
      <g fill="none" stroke="#4a3a35" strokeLinecap="round" strokeWidth="4" opacity="0.85">
        <path d="M-4 52C40 60 70 74 110 100S170 126 196 136" />
        <path d="M52 66C60 40 80 24 112 14" strokeWidth="3" />
        <path d="M806 256C782 280 762 298 730 328" strokeWidth="3" />
      </g>
      <Blossoms points={BLOSSOMS_TOP} />
      <Blossoms points={BLOSSOMS_RIGHT} />
      {/* cánh hoa rơi */}
      <g fill="#f4a9ae" opacity="0.75">
        <ellipse cx="300" cy="110" rx="6" ry="3" transform="rotate(35 300 110)" />
        <ellipse cx="610" cy="150" rx="5" ry="2.5" transform="rotate(-25 610 150)" />
        <ellipse cx="520" cy="60" rx="5" ry="2.5" transform="rotate(50 520 60)" />
        <ellipse cx="190" cy="250" rx="5" ry="2.5" transform="rotate(10 190 250)" />
      </g>
    </svg>
  );
}

// ======================== Phiên ôn tập ========================
export function ReviewClient({ initial }: { initial: EnrichedReviewItem[] }) {
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
        // Bỏ focus khỏi nút vừa bấm để phím Space tiếp tục lật thẻ kế tiếp
        (document.activeElement as HTMLElement | null)?.blur?.();

        if (grade === "AGAIN") {
          // Đưa thẻ về cuối hàng đợi của phiên để ôn lại ngay
          const requeued = [...items];
          const [card] = requeued.splice(currentIndex, 1);
          requeued.push(card);
          setItems(requeued);
          setCurrentIndex(currentIndex >= requeued.length ? 0 : currentIndex);
        } else {
          const nextItems = items.filter((_, idx) => idx !== currentIndex);
          setItems(nextItems);
          setDone((d) => d + 1);

          if (nextItems.length === 0) {
            playFanfare();
            showToast({
              title: "🏆 Phiên ôn tập hoàn tất! +20 XP thưởng！",
              description: "Chúc mừng bạn đã bảo vệ kiến thức khỏi đường cong quên lãng!",
              type: "achievement",
            });
            await fetch("/api/activity", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: "REVIEW_COMPLETE", xp: 20 }),
            }).catch(() => {});
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

  // Phím tắt: Space lật thẻ, 1–4 chấm điểm (sau khi lật)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target;
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement) return;
      if (document.querySelector('[aria-modal="true"]')) return; // đang mở hộp thoại / menu
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
  }, [isFlipped, submitting, handleGrade]);

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
  const jlptLabel = currentItem.contentType === "KANA" ? "KANA" : "JLPT N5";
  const position = Math.min(done + 1, sessionTotal);
  const size = termSize(currentItem.title);
  const showReading = Boolean(currentItem.reading) && currentItem.reading !== currentItem.title;
  // romaji là trường tuỳ chọn: chỉ hiển thị nếu resolveReviewItems có trả về
  const romaji = (currentItem as unknown as { romaji?: string }).romaji;
  const meaning = currentItem.extra || currentItem.subtitle;
  const tip =
    currentItem.contentType === "KANA"
      ? `Đọc to “${currentItem.title}” ba lần rồi viết ra giấy một lần — vừa nghe vừa viết giúp bạn nhớ nét chữ lâu hơn.`
      : `Hãy liên tưởng “${currentItem.title}” với một hình ảnh hoặc tình huống thật bạn từng gặp. Hình ảnh cụ thể sẽ giúp bạn nhớ lâu hơn!`;

  const flip = () => setIsFlipped((f) => !f);

  return (
    <div className="rv-session">
      <div
        className="rv-flash"
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
          {/* MẶT TRƯỚC */}
          <div className="rv-face" aria-hidden={isFlipped}>
            <CardScenery />
            <div className="rv-face-top">
              <span className="rv-count">
                {position} / {sessionTotal}
              </span>
              <span className="rv-jlpt">{jlptLabel}</span>
            </div>
            <div className="rv-face-main">
              <div>
                <div className="rv-term">
                  <p className={`rv-term-text rv-fs-${size} jp-text`}>{currentItem.title}</p>
                  {isJapaneseText && <SpeakButton text={currentItem.title} className="rv-speak" size={20} />}
                </div>
                {showReading && <p className="rv-reading jp-text">{currentItem.reading}</p>}
                {romaji && <p className="rv-romaji">{romaji}</p>}
              </div>
            </div>
          </div>

          {/* MẶT SAU */}
          <div className="rv-face is-back" aria-hidden={!isFlipped}>
            <CardScenery />
            <div className="rv-face-top">
              <span className="rv-count">
                {position} / {sessionTotal}
              </span>
              <span className="rv-jlpt">{jlptLabel}</span>
            </div>
            <div className="rv-face-main">
              <div>
                <div className="rv-term">
                  <p className="rv-term-text rv-fs-md jp-text">{currentItem.title}</p>
                  {isJapaneseText && <SpeakButton text={currentItem.title} className="rv-speak" size={20} />}
                </div>
                {showReading && <p className="rv-reading jp-text">{currentItem.reading}</p>}
                {meaning && <p className="rv-meaning">{meaning}</p>}
              </div>
            </div>
            <div className="rv-face-foot">
              <span>Đã củng cố: {currentItem.repetitions} lần</span>
              <span>Chu kỳ hiện tại: {currentItem.interval} ngày</span>
            </div>
          </div>
        </div>
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
            disabled={submitting}
            aria-keyshortcuts={g.key}
            onClick={() => handleGrade(g.grade)}
          >
            <Icon name={g.icon} size={26} strokeWidth={2.1} />
            <b>{g.label}</b>
            <small>{g.hint}</small>
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
