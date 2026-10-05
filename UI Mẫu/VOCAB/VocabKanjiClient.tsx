"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge, Button, Card, EmptyState, Icon, IconButton, Modal, SelectField } from "@/components/ui";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";

/* ============================== TYPES ============================== */

interface KanjiItem {
  id: string;
  character: string;
  meaning: string;
  strokeCount: number;
  jlptLevel: string;
  readings: Array<{ id: string; reading: string; type: string }>;
}

interface ExampleItem {
  id?: string;
  japanese: string;
  meaning: string;
  romaji: string | null;
}

interface VocabItem {
  id: string;
  word: string;
  kana: string;
  kanji: string | null;
  romaji: string;
  meaning: string;
  partOfSpeech: string;
  jlptLevel: string;
  tags?: string;
  /** Tuỳ chọn 1–5. Nếu DB chưa có cột này, tần suất sẽ được ước lượng theo cấp JLPT. */
  frequency?: number;
  examples: ExampleItem[];
}

/** Dữ liệu đã chuẩn hoá để dùng chung cho thẻ lưới & flashcard (cả từ vựng lẫn Hán tự). */
interface CardData {
  id: string;
  type: "VOCAB" | "KANJI";
  front: string;
  reading: string;
  romaji?: string;
  meaning: string;
  label: string;
  level: string;
  topic: string;
  example?: ExampleItem;
  highlight?: { word: string; kana: string };
}

type ViewMode = "LIST" | "GRID" | "FLASHCARD" | "TOPIC";
type SortMode = "DEFAULT" | "KANA" | "LEVEL" | "SAVED";
type Tab = "VOCAB" | "KANJI";

/* ============================== CONSTANTS & HELPERS ============================== */

const LEVEL_OPTIONS = [
  { value: "ALL", label: "Tất cả" },
  { value: "N5", label: "N5" },
  { value: "N4", label: "N4" },
  { value: "N3", label: "N3" },
];

const POS_LABELS: Record<string, string> = {
  noun: "Danh từ",
  verb: "Động từ",
  adjective: "Tính từ -i",
  "na-adjective": "Tính từ -na",
  expression: "Cụm từ / Giao tiếp",
  pronoun: "Đại từ",
};

const POS_OPTIONS = [{ value: "ALL", label: "Tất cả" }, ...Object.entries(POS_LABELS).map(([value, label]) => ({ value, label }))];

const LEVEL_ORDER: Record<string, number> = { N5: 0, N4: 1, N3: 2, N2: 3, N1: 4 };
const FREQUENCY_LABELS = ["Hiếm gặp", "Ít gặp", "Phổ biến", "Rất phổ biến", "Cực kỳ phổ biến"];

const KANJI_RE = /[\u3400-\u9fff]/;
const HIRAGANA_RE = /[\u3041-\u309f]/;

/** Lưới 1 hàng trong danh sách: cột ví dụ chỉ hiện ở md và ≥xl (ở lg đã có panel chi tiết chiếm chỗ). */
const ROW_GRID =
  "flex flex-wrap items-center gap-x-3 gap-y-2 md:grid md:grid-cols-[20px_minmax(84px,108px)_minmax(84px,108px)_minmax(110px,150px)_minmax(0,1fr)_40px_84px] lg:grid-cols-[20px_minmax(84px,108px)_minmax(84px,108px)_minmax(110px,150px)_40px_84px] xl:grid-cols-[20px_minmax(84px,108px)_minmax(84px,108px)_minmax(110px,150px)_minmax(0,1fr)_40px_84px]";
const ROW_EXTRA_COL = "hidden min-w-0 md:block lg:hidden xl:block";

const tagsOf = (tags?: string) => (tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : []);
const readingsOf = (k: KanjiItem, type: "ONYOMI" | "KUNYOMI") =>
  k.readings.filter((r) => r.type === type).map((r) => r.reading);

/** Tách phần chữ Hán của từ (để tô đỏ trong câu) và cách đọc tương ứng (để làm furigana). */
function splitWord(word: string, kana: string): { target: string; reading: string | null } {
  if (!KANJI_RE.test(word)) return { target: word, reading: null };
  let end = word.length;
  while (end > 1 && HIRAGANA_RE.test(word[end - 1])) end--;
  const target = word.slice(0, end);
  const okurigana = word.slice(end);
  if (!okurigana) return { target, reading: kana || null };
  const reading = kana.endsWith(okurigana) ? kana.slice(0, kana.length - okurigana.length) : null;
  return { target, reading: reading || null };
}

function frequencyOf(v: VocabItem) {
  const base = v.frequency ?? ({ N5: 3, N4: 2 } as Record<string, number>)[v.jlptLevel] ?? 1;
  const dots = Math.min(5, Math.max(1, Math.round(base)));
  return { dots, label: FREQUENCY_LABELS[dots - 1] };
}

function sortItems<T extends { id: string; jlptLevel: string }>(
  items: T[],
  mode: SortMode,
  saved: Set<string>,
  kana?: (item: T) => string
): T[] {
  if (mode === "DEFAULT") return items;
  const copy = [...items];
  if (mode === "KANA" && kana) copy.sort((a, b) => kana(a).localeCompare(kana(b), "ja"));
  else if (mode === "LEVEL") copy.sort((a, b) => (LEVEL_ORDER[a.jlptLevel] ?? 9) - (LEVEL_ORDER[b.jlptLevel] ?? 9));
  else if (mode === "SAVED") copy.sort((a, b) => Number(saved.has(b.id)) - Number(saved.has(a.id)));
  return copy;
}

function vocabToCard(v: VocabItem): CardData {
  return {
    id: v.id,
    type: "VOCAB",
    front: v.word,
    reading: v.kana,
    romaji: v.romaji,
    meaning: v.meaning,
    label: POS_LABELS[v.partOfSpeech] ?? v.partOfSpeech,
    level: v.jlptLevel,
    topic: tagsOf(v.tags)[0] ?? "Chung",
    example: v.examples[0],
    highlight: { word: v.word, kana: v.kana },
  };
}

function kanjiToCard(k: KanjiItem): CardData {
  const on = readingsOf(k, "ONYOMI").join("、");
  const kun = readingsOf(k, "KUNYOMI").join("、");
  return {
    id: k.id,
    type: "KANJI",
    front: k.character,
    reading: [on && `On: ${on}`, kun && `Kun: ${kun}`].filter(Boolean).join("  ·  "),
    meaning: k.meaning,
    label: `${k.strokeCount} nét`,
    level: k.jlptLevel,
    topic: "Hán tự",
  };
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

/* ============================== SMALL PIECES ============================== */

/** Câu ví dụ: tô đỏ từ đang học và gắn furigana cho phần chữ Hán của từ đó. */
function ExampleText({ sentence, highlight }: { sentence: string; highlight?: { word: string; kana: string } }) {
  if (!highlight) return <>{sentence}</>;
  const { target, reading } = splitWord(highlight.word, highlight.kana);
  const idx = target ? sentence.indexOf(target) : -1;
  if (idx < 0) return <>{sentence}</>;
  return (
    <>
      {sentence.slice(0, idx)}
      <span className="font-bold text-red-600 dark:text-red-400">
        {reading ? (
          <ruby>
            {target}
            <rt className="text-[9px] font-semibold text-red-500">{reading}</rt>
          </ruby>
        ) : (
          target
        )}
      </span>
      {sentence.slice(idx + target.length)}
    </>
  );
}

function FrequencyDots({ dots, label }: { dots: number; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex gap-1" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={`h-2.5 w-2.5 rounded-full ${i < dots ? "bg-red-500" : "bg-red-100 dark:bg-red-950"}`} />
        ))}
      </span>
      <span className="text-xs font-medium text-slate-500">{label}</span>
    </span>
  );
}

function PlayButton({ text, speakingText, onSpeak }: { text: string; speakingText: string | null; onSpeak: (t: string) => void }) {
  const playing = speakingText === text;
  return (
    <button
      type="button"
      aria-label="Nghe phát âm"
      title="Nghe phát âm"
      onClick={(e) => {
        e.stopPropagation();
        onSpeak(text);
      }}
      className={`relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 ${
        playing
          ? "border-red-500 bg-red-100 text-red-700 dark:bg-red-950/60"
          : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400"
      }`}
    >
      <Icon name="play" className="ml-0.5 h-4 w-4" />
      {playing && <span className="absolute inset-0 animate-ping rounded-full border border-red-400/70" />}
    </button>
  );
}

function SaveButton({ saved, onSave, className = "" }: { saved: boolean; onSave: () => void; className?: string }) {
  return (
    <Button
      size="xs"
      variant={saved ? "brand" : "brandOutline"}
      className={`h-9 ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onSave();
      }}
    >
      {saved ? (
        <>
          Đã lưu <Icon name="check" className="h-3.5 w-3.5" />
        </>
      ) : (
        <>
          <Icon name="plus" className="h-3.5 w-3.5" /> Lưu
        </>
      )}
    </Button>
  );
}

function Pagination({
  page,
  totalPages,
  total,
  perPage,
  unit,
  onPage,
}: {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  unit: string;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );
  return (
    <nav aria-label="Phân trang" className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
      <span className="text-xs font-semibold text-slate-500">
        Hiển thị {from}–{to} / {total.toLocaleString("vi-VN")} {unit}
      </span>
      <div className="flex items-center gap-1">
        <Button size="sm" variant="outline" disabled={page === 1} onClick={() => onPage(page - 1)}>
          ‹ Trước
        </Button>
        {pages.map((p, idx) => (
          <Fragment key={p}>
            {idx > 0 && pages[idx - 1] !== p - 1 && <span className="px-1 text-xs text-slate-400">…</span>}
            <button
              type="button"
              aria-current={p === page ? "page" : undefined}
              onClick={() => onPage(p)}
              className={`h-8 w-8 rounded-xl text-xs font-extrabold transition ${
                p === page
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-sumi-800"
              }`}
            >
              {p}
            </button>
          </Fragment>
        ))}
        <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => onPage(page + 1)}>
          Sau ›
        </Button>
      </div>
    </nav>
  );
}

/* ============================== LIST ROWS ============================== */

const rowClass = (selected: boolean) =>
  `rounded-2xl border px-3 py-3 transition sm:px-4 ${
    selected
      ? "border-red-500 bg-red-50/40 shadow-[0_0_0_3px_rgba(220,38,38,0.08)] dark:bg-red-950/20"
      : "cursor-pointer border-transparent shadow-[0_1px_0_0_rgb(241_245_249)] hover:bg-slate-50 dark:shadow-[0_1px_0_0_rgb(30_41_59)] dark:hover:bg-sumi-800/50"
  }`;

function MasteredCheckbox({ checked, name, onToggle }: { checked: boolean; name: string; onToggle: () => void }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onToggle}
      onClick={(e) => e.stopPropagation()}
      aria-label={`Đánh dấu đã thuộc: ${name}`}
      title="Đánh dấu đã thuộc"
      className="h-[18px] w-[18px] cursor-pointer rounded accent-red-600"
    />
  );
}

function VocabRow({
  v,
  selected,
  mastered,
  saved,
  speakingText,
  onSelect,
  onToggleMastered,
  onSpeak,
  onSave,
}: {
  v: VocabItem;
  selected: boolean;
  mastered: boolean;
  saved: boolean;
  speakingText: string | null;
  onSelect: () => void;
  onToggleMastered: () => void;
  onSpeak: (t: string) => void;
  onSave: () => void;
}) {
  const ex = v.examples[0];
  return (
    <li
      tabIndex={0}
      aria-current={selected ? "true" : undefined}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`${ROW_GRID} ${rowClass(selected)} focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500`}
    >
      <MasteredCheckbox checked={mastered} name={v.word} onToggle={onToggleMastered} />

      <div className="jp-text break-words text-[26px] font-black leading-tight text-slate-900 dark:text-white sm:text-[28px]">{v.word}</div>

      <div className="min-w-0">
        <p className="jp-text text-sm text-slate-600 dark:text-slate-300">{v.kana}</p>
        <p className="truncate text-xs text-slate-400">{v.romaji}</p>
      </div>

      <div className="min-w-0 basis-full md:basis-auto">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{v.meaning}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <Badge variant="sky" className="text-[11px]">
            {POS_LABELS[v.partOfSpeech] ?? v.partOfSpeech}
          </Badge>
          <Badge variant="amber" className="text-[11px]">
            JLPT {v.jlptLevel}
          </Badge>
        </div>
      </div>

      <div className={ROW_EXTRA_COL}>
        {ex && (
          <>
            <p className="jp-text flex items-start gap-2 text-[13px] font-medium leading-[2] text-slate-800 dark:text-slate-100">
              <span className="mt-[13px] h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
              <span className="min-w-0">
                <ExampleText sentence={ex.japanese} highlight={{ word: v.word, kana: v.kana }} />
              </span>
            </p>
            <p className="truncate pl-3.5 text-xs text-slate-500">{ex.meaning}</p>
          </>
        )}
      </div>

      <PlayButton text={v.word} speakingText={speakingText} onSpeak={onSpeak} />
      <SaveButton saved={saved} onSave={onSave} className="ml-auto w-[84px] md:ml-0" />
    </li>
  );
}

function KanjiRow({
  k,
  selected,
  mastered,
  saved,
  speakingText,
  onSelect,
  onToggleMastered,
  onSpeak,
  onSave,
}: {
  k: KanjiItem;
  selected: boolean;
  mastered: boolean;
  saved: boolean;
  speakingText: string | null;
  onSelect: () => void;
  onToggleMastered: () => void;
  onSpeak: (t: string) => void;
  onSave: () => void;
}) {
  const on = readingsOf(k, "ONYOMI");
  const kun = readingsOf(k, "KUNYOMI");
  return (
    <li
      tabIndex={0}
      aria-current={selected ? "true" : undefined}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`${ROW_GRID} ${rowClass(selected)} focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500`}
    >
      <MasteredCheckbox checked={mastered} name={k.character} onToggle={onToggleMastered} />
      <div className="jp-text text-[34px] font-black leading-none text-slate-900 dark:text-white">{k.character}</div>
      <div className="min-w-0">
        <p className="text-sm text-slate-600 dark:text-slate-300">{k.strokeCount} nét</p>
        <p className="text-xs text-slate-400">Số nét viết</p>
      </div>
      <div className="min-w-0 basis-full md:basis-auto">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{k.meaning}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <Badge variant="amber" className="text-[11px]">
            JLPT {k.jlptLevel}
          </Badge>
        </div>
      </div>
      <div className={ROW_EXTRA_COL}>
        <p className="jp-text truncate text-[13px] font-semibold text-amber-700 dark:text-amber-300">On: {on.join("、") || "—"}</p>
        <p className="jp-text truncate text-[13px] font-semibold text-sky-700 dark:text-sky-300">Kun: {kun.join("、") || "—"}</p>
      </div>
      <PlayButton text={k.character} speakingText={speakingText} onSpeak={onSpeak} />
      <SaveButton saved={saved} onSave={onSave} className="ml-auto w-[84px] md:ml-0" />
    </li>
  );
}

/* ============================== DETAIL PANELS ============================== */

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[116px_1fr] border-b border-slate-100 last:border-b-0 dark:border-slate-800">
      <dt className="bg-slate-50/80 px-3.5 py-3 text-[13px] font-medium text-slate-500 dark:bg-sumi-950/60">{label}</dt>
      <dd className="flex flex-wrap items-center gap-1.5 px-3.5 py-3 text-[13px] font-semibold text-slate-800 dark:text-slate-100">{children}</dd>
    </div>
  );
}

const detailTable = "overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-sumi-900";

function SrsBox({ name, saved, onSave }: { name: string; saved: boolean; onSave: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50/70 p-3.5 dark:border-red-900/50 dark:bg-red-950/30">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-white text-red-600 dark:border-red-900/60 dark:bg-sumi-900">
        <Icon name="cards" className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold text-red-700 dark:text-red-300">Thêm vào SRS</p>
        <p className="text-xs text-slate-600 dark:text-slate-400">Lưu {name} để ôn tập định kỳ, ghi nhớ lâu dài.</p>
      </div>
      <SaveButton saved={saved} onSave={onSave} className="shrink-0 px-3.5" />
    </div>
  );
}

function VocabDetail({
  v,
  saved,
  starred,
  speakingText,
  showAllExamples,
  onToggleExamples,
  onSpeak,
  onSave,
  onToggleStar,
}: {
  v: VocabItem;
  saved: boolean;
  starred: boolean;
  speakingText: string | null;
  showAllExamples: boolean;
  onToggleExamples: () => void;
  onSpeak: (t: string) => void;
  onSave: () => void;
  onToggleStar: () => void;
}) {
  const freq = frequencyOf(v);
  const tags = tagsOf(v.tags);
  const examples = showAllExamples ? v.examples : v.examples.slice(0, 3);
  const hl = { word: v.word, kana: v.kana };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="brand" className="text-[11px] uppercase">
            Từ vựng
          </Badge>
          <Badge variant="amber" className="text-[11px]">
            JLPT {v.jlptLevel}
          </Badge>
        </div>
        <IconButton
          label={starred ? "Bỏ đánh dấu yêu thích" : "Đánh dấu yêu thích"}
          active={starred}
          onClick={onToggleStar}
          className="border-transparent bg-transparent dark:bg-transparent"
        >
          <Icon name="star" filled={starred} className="h-5 w-5" />
        </IconButton>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="jp-text break-words text-5xl font-black leading-tight text-slate-900 dark:text-white sm:text-[56px]">{v.word}</h2>
          <p className="mt-1.5 flex flex-wrap items-baseline gap-x-4 text-base text-slate-600 dark:text-slate-300">
            <span className="jp-text">{v.kana}</span>
            <span className="text-slate-400">{v.romaji}</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <IconButton label="Nghe phát âm" tone="brand" active={speakingText === v.word} className="h-11 w-11" onClick={() => onSpeak(v.word)}>
            <Icon name="speaker" className="h-5 w-5" />
          </IconButton>
          <Button size="sm" variant={saved ? "brand" : "brandOutline"} onClick={onSave}>
            {saved ? (
              <>
                Đã lưu vào SRS <Icon name="check" className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                <Icon name="plus" className="h-3.5 w-3.5" /> Lưu vào SRS
              </>
            )}
          </Button>
        </div>
      </div>

      <dl className={detailTable}>
        <DetailRow label="Nghĩa tiếng Việt">{v.meaning}</DetailRow>
        <DetailRow label="Loại từ">{POS_LABELS[v.partOfSpeech] ?? v.partOfSpeech}</DetailRow>
        <DetailRow label="Tần suất">
          <FrequencyDots dots={freq.dots} label={freq.label} />
        </DetailRow>
        <DetailRow label="Chủ đề">
          {tags.length === 0 ? (
            <span className="text-slate-400">Chưa phân loại</span>
          ) : (
            tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-red-100 bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
              >
                {t}
              </span>
            ))
          )}
        </DetailRow>
      </dl>

      <section aria-labelledby="vocab-examples">
        <div className="mb-1 flex items-center justify-between">
          <h3 id="vocab-examples" className="text-base font-extrabold text-slate-900 dark:text-white">
            Ví dụ câu
          </h3>
          {v.examples.length > 3 && (
            <button type="button" onClick={onToggleExamples} className="text-xs font-bold text-red-600 hover:underline dark:text-red-400">
              {showAllExamples ? "Thu gọn" : `Xem thêm (${v.examples.length})`}
            </button>
          )}
        </div>
        {v.examples.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500 dark:border-slate-700">
            Từ này chưa có câu ví dụ.
          </p>
        ) : (
          <ol className="divide-y divide-slate-100 dark:divide-slate-800">
            {examples.map((ex, i) => (
              <li key={ex.id ?? i} className="grid grid-cols-[24px_1fr_auto] items-center gap-3 py-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 dark:bg-sumi-800">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="jp-text text-[15px] font-semibold leading-[2] text-slate-900 dark:text-white">
                    <ExampleText sentence={ex.japanese} highlight={hl} />
                  </p>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400">{ex.meaning}</p>
                </div>
                <IconButton label="Nghe câu ví dụ" tone="brand" active={speakingText === ex.japanese} onClick={() => onSpeak(ex.japanese)}>
                  <Icon name="speaker" className="h-4 w-4" />
                </IconButton>
              </li>
            ))}
          </ol>
        )}
      </section>

      <SrsBox name="từ này" saved={saved} onSave={onSave} />
    </div>
  );
}

function KanjiDetail({
  k,
  saved,
  starred,
  speakingText,
  onSpeak,
  onSave,
  onToggleStar,
}: {
  k: KanjiItem;
  saved: boolean;
  starred: boolean;
  speakingText: string | null;
  onSpeak: (t: string) => void;
  onSave: () => void;
  onToggleStar: () => void;
}) {
  const on = readingsOf(k, "ONYOMI");
  const kun = readingsOf(k, "KUNYOMI");
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="brand" className="text-[11px] uppercase">
            Hán tự
          </Badge>
          <Badge variant="amber" className="text-[11px]">
            JLPT {k.jlptLevel}
          </Badge>
        </div>
        <IconButton
          label={starred ? "Bỏ đánh dấu yêu thích" : "Đánh dấu yêu thích"}
          active={starred}
          onClick={onToggleStar}
          className="border-transparent bg-transparent dark:bg-transparent"
        >
          <Icon name="star" filled={starred} className="h-5 w-5" />
        </IconButton>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="jp-text text-7xl font-black leading-none text-slate-900 dark:text-white">{k.character}</h2>
          <p className="mt-2 text-base font-semibold text-slate-600 dark:text-slate-300">{k.meaning}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <IconButton label="Nghe phát âm" tone="brand" active={speakingText === k.character} className="h-11 w-11" onClick={() => onSpeak(k.character)}>
            <Icon name="speaker" className="h-5 w-5" />
          </IconButton>
          <Button size="sm" variant={saved ? "brand" : "brandOutline"} onClick={onSave}>
            {saved ? (
              <>
                Đã lưu vào SRS <Icon name="check" className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                <Icon name="plus" className="h-3.5 w-3.5" /> Lưu vào SRS
              </>
            )}
          </Button>
        </div>
      </div>

      <dl className={detailTable}>
        <DetailRow label="Nghĩa tiếng Việt">{k.meaning}</DetailRow>
        <DetailRow label="Số nét viết">{k.strokeCount} nét</DetailRow>
        <DetailRow label="Âm On">
          {on.length === 0 ? (
            <span className="text-slate-400">—</span>
          ) : (
            on.map((r) => (
              <span key={r} className="jp-text rounded-md bg-amber-50 px-2 py-0.5 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                {r}
              </span>
            ))
          )}
        </DetailRow>
        <DetailRow label="Âm Kun">
          {kun.length === 0 ? (
            <span className="text-slate-400">—</span>
          ) : (
            kun.map((r) => (
              <span key={r} className="jp-text rounded-md bg-sky-50 px-2 py-0.5 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                {r}
              </span>
            ))
          )}
        </DetailRow>
      </dl>

      <SrsBox name="Hán tự này" saved={saved} onSave={onSave} />
    </div>
  );
}

/* ============================== GRID CARD ============================== */

function GridCard({
  c,
  saved,
  mastered,
  speakingText,
  onSpeak,
  onSave,
  onToggleMastered,
}: {
  c: CardData;
  saved: boolean;
  mastered: boolean;
  speakingText: string | null;
  onSpeak: (t: string) => void;
  onSave: () => void;
  onToggleMastered: () => void;
}) {
  return (
    <Card hover className="flex flex-col justify-between !rounded-2xl">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="jp-text break-words text-3xl font-black text-slate-900 dark:text-white">{c.front}</h3>
              <IconButton label="Nghe phát âm" tone="brand" active={speakingText === c.front} className="h-8 w-8" onClick={() => onSpeak(c.front)}>
                <Icon name="speaker" className="h-4 w-4" />
              </IconButton>
            </div>
            <p className="jp-text mt-1 text-sm text-slate-600 dark:text-slate-300">
              {c.reading}
              {c.romaji && <span className="ml-2 text-slate-400">{c.romaji}</span>}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="amber" className="text-[11px]">
              JLPT {c.level}
            </Badge>
            <Badge variant="sky" className="text-[11px]">
              {c.label}
            </Badge>
          </div>
        </div>

        <p className="mt-3 border-t border-slate-100 pt-3 text-sm font-bold text-slate-800 dark:border-slate-800 dark:text-slate-100">{c.meaning}</p>

        {c.example && (
          <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-sumi-950">
            <p className="jp-text text-sm font-semibold leading-[2] text-slate-800 dark:text-slate-100">
              <ExampleText sentence={c.example.japanese} highlight={c.highlight} />
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{c.example.meaning}</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <button
          type="button"
          onClick={onToggleMastered}
          className={`rounded-xl px-2.5 py-1 text-xs font-bold transition ${
            mastered
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          }`}
        >
          {mastered ? "✓ Đã thuộc" : "○ Đánh dấu thuộc"}
        </button>
        <SaveButton saved={saved} onSave={onSave} className="px-3" />
      </div>
    </Card>
  );
}

/* ============================== MAIN COMPONENT ============================== */

export function VocabKanjiClient({
  vocabulary,
  kanji,
  savedItemIds = [],
  defaultLevel = "N5",
}: {
  vocabulary: VocabItem[];
  kanji: KanjiItem[];
  savedItemIds?: string[];
  defaultLevel?: string;
}) {
  const [tab, setTab] = useState<Tab>("VOCAB");
  const [levelFilter, setLevelFilter] = useState<string>(defaultLevel);
  const [viewMode, setViewMode] = useState<ViewMode>("LIST");
  const [sortMode, setSortMode] = useState<SortMode>("DEFAULT");
  const [posFilter, setPosFilter] = useState("ALL");
  const [tagFilter, setTagFilter] = useState("ALL");
  const [srsOnlyFilter, setSrsOnlyFilter] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [query, setQuery] = useState("");

  const [savedSet, setSavedSet] = useState<Set<string>>(() => new Set(savedItemIds));
  const [masteredSet, setMasteredSet] = useState<Set<string>>(new Set());
  const [starredSet, setStarredSet] = useState<Set<string>>(new Set());

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [showAllExamples, setShowAllExamples] = useState(false);

  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const isDesktop = useIsDesktop();
  const { playClick, playCorrect, showToast, speak, speakingText } = useSoundAndTheme();

  /* ---------- effects ---------- */

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#kanji") setTab("KANJI");
      else if (hash === "#vocabulary") setTab("VOCAB");
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nq_starred_items");
      if (raw) setStarredSet(new Set(JSON.parse(raw) as string[]));
    } catch {
      // bỏ qua
    }
  }, []);

  // Đổi bộ lọc → về trang 1 và bỏ chọn
  useEffect(() => {
    setCurrentPage(1);
    setFlashcardIndex(0);
    setIsFlipped(false);
    setSelectedId(null);
  }, [levelFilter, tab, posFilter, tagFilter, srsOnlyFilter, query, viewMode, sortMode]);

  useEffect(() => {
    setShowAllExamples(false);
  }, [selectedId]);

  // Một số tuỳ chọn chỉ có ở tab Từ vựng
  useEffect(() => {
    if (tab === "KANJI") {
      if (viewMode === "TOPIC") setViewMode("LIST");
      if (sortMode === "KANA") setSortMode("DEFAULT");
    }
  }, [tab, viewMode, sortMode]);

  /* ---------- actions ---------- */

  const switchTab = (next: Tab) => {
    playClick();
    setTab(next);
    try {
      window.history.replaceState(null, "", next === "KANJI" ? "#kanji" : "#vocabulary");
    } catch {
      // bỏ qua
    }
  };

  const handleAddToSrs = async (contentType: Tab, contentId: string, name: string) => {
    playClick();
    if (savedSet.has(contentId)) {
      showToast({ title: `${name} đã nằm trong hàng đợi SRS`, type: "info" });
      return;
    }
    try {
      const res = await fetch("/api/review/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, contentId }),
      });
      if (res.ok) {
        playCorrect();
        setSavedSet((prev) => new Set(prev).add(contentId));
        showToast({
          title: `Đã lưu thẻ Flashcard: ${name}! 🎴`,
          description: "Mục này đã được đưa vào hàng đợi ôn tập SRS!",
          type: "xp",
        });
      } else {
        showToast({ title: "Không thể lưu thẻ, vui lòng thử lại.", type: "error" });
      }
    } catch {
      showToast({ title: "Không thể lưu thẻ, vui lòng thử lại.", type: "error" });
    }
  };

  const toggleMastered = (id: string) => {
    playClick();
    setMasteredSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleStar = (id: string) => {
    playClick();
    const next = new Set(starredSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setStarredSet(next);
    try {
      localStorage.setItem("nq_starred_items", JSON.stringify(Array.from(next)));
    } catch {
      // bỏ qua
    }
  };

  const toggleTopicExpand = (title: string) => {
    playClick();
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const selectItem = (id: string) => {
    playClick();
    setSelectedId(id);
    if (!isDesktop) setDetailOpen(true);
  };

  const goToPage = (p: number) => {
    playClick();
    setCurrentPage(p);
  };

  const resetFilters = () => {
    setQuery("");
    setLevelFilter("ALL");
    setPosFilter("ALL");
    setTagFilter("ALL");
    setSrsOnlyFilter(false);
  };

  /* ---------- derived data ---------- */

  const filteredVocab = useMemo(() => {
    let result = levelFilter === "ALL" ? vocabulary : vocabulary.filter((v) => v.jlptLevel === levelFilter);
    if (posFilter !== "ALL") result = result.filter((v) => v.partOfSpeech === posFilter);
    if (tagFilter !== "ALL") result = result.filter((v) => v.tags && v.tags.includes(tagFilter));
    if (srsOnlyFilter) result = result.filter((v) => savedSet.has(v.id));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (v) =>
          v.word.toLowerCase().includes(q) ||
          v.kana.toLowerCase().includes(q) ||
          v.romaji.toLowerCase().includes(q) ||
          v.meaning.toLowerCase().includes(q) ||
          (v.tags && v.tags.toLowerCase().includes(q))
      );
    }
    return sortItems(result, sortMode, savedSet, (v) => v.kana);
  }, [vocabulary, query, levelFilter, posFilter, tagFilter, srsOnlyFilter, savedSet, sortMode]);

  const filteredKanji = useMemo(() => {
    let result = levelFilter === "ALL" ? kanji : kanji.filter((k) => k.jlptLevel === levelFilter);
    if (srsOnlyFilter) result = result.filter((k) => savedSet.has(k.id));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (k) =>
          k.character.includes(q) ||
          k.meaning.toLowerCase().includes(q) ||
          k.readings.some((r) => r.reading.toLowerCase().includes(q))
      );
    }
    return sortItems(result, sortMode, savedSet);
  }, [kanji, query, levelFilter, srsOnlyFilter, savedSet, sortMode]);

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    vocabulary.forEach((v) => tagsOf(v.tags).forEach((t) => set.add(t)));
    return Array.from(set);
  }, [vocabulary]);

  const topicOptions = useMemo(
    () => [{ value: "ALL", label: "Tất cả" }, ...availableTags.map((t) => ({ value: t, label: t }))],
    [availableTags]
  );

  const sortOptions = useMemo(
    () => [
      { value: "DEFAULT", label: "Mặc định" },
      ...(tab === "VOCAB" ? [{ value: "KANA", label: "Bảng chữ cái あ–ん" }] : []),
      { value: "LEVEL", label: "Cấp độ JLPT" },
      { value: "SAVED", label: "Đã lưu trước" },
    ],
    [tab]
  );

  const topicGroups = useMemo(() => {
    const groups: Record<string, VocabItem[]> = {
      "💬 Giao tiếp & Chào hỏi": [],
      "🏠 Gia đình & Đời sống": [],
      "🍣 Món ăn & Nhà hàng": [],
      "💼 Trường học & Công việc": [],
      "🚗 Giao thông & Di chuyển": [],
      "☀️ Thời gian & Thời tiết": [],
      "🏃 Động từ thông dụng": [],
      "🎨 Tính từ & Trạng thái": [],
      "📦 Khác": [],
    };
    filteredVocab.forEach((v) => {
      const tag = v.tags || "";
      const pos = v.partOfSpeech || "";
      if (tag.includes("Giao tiếp") || pos === "expression") groups["💬 Giao tiếp & Chào hỏi"].push(v);
      else if (tag.includes("Gia đình") || tag.includes("Đời sống")) groups["🏠 Gia đình & Đời sống"].push(v);
      else if (tag.includes("Ăn uống")) groups["🍣 Món ăn & Nhà hàng"].push(v);
      else if (tag.includes("Công việc") || tag.includes("Học tập")) groups["💼 Trường học & Công việc"].push(v);
      else if (tag.includes("Giao thông") || tag.includes("Địa điểm")) groups["🚗 Giao thông & Di chuyển"].push(v);
      else if (tag.includes("Thời tiết") || tag.includes("Thời gian")) groups["☀️ Thời gian & Thời tiết"].push(v);
      else if (pos === "verb" || tag.includes("Động từ")) groups["🏃 Động từ thông dụng"].push(v);
      else if (pos.includes("adjective") || tag.includes("Tính từ")) groups["🎨 Tính từ & Trạng thái"].push(v);
      else groups["📦 Khác"].push(v);
    });
    return groups;
  }, [filteredVocab]);

  const totalItems = tab === "VOCAB" ? filteredVocab.length : filteredKanji.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const vocabSlice = useMemo(
    () => filteredVocab.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredVocab, currentPage, itemsPerPage]
  );
  const kanjiSlice = useMemo(
    () => filteredKanji.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredKanji, currentPage, itemsPerPage]
  );

  const activeVocab = tab === "VOCAB" ? (vocabSlice.find((v) => v.id === selectedId) ?? vocabSlice[0] ?? null) : null;
  const activeKanji = tab === "KANJI" ? (kanjiSlice.find((k) => k.id === selectedId) ?? kanjiSlice[0] ?? null) : null;

  const sliceCards = useMemo<CardData[]>(
    () => (tab === "VOCAB" ? vocabSlice.map(vocabToCard) : kanjiSlice.map(kanjiToCard)),
    [tab, vocabSlice, kanjiSlice]
  );
  const flashcards = useMemo<CardData[]>(
    () => (tab === "VOCAB" ? filteredVocab.map(vocabToCard) : filteredKanji.map(kanjiToCard)),
    [tab, filteredVocab, filteredKanji]
  );
  const flashcard = flashcards.length > 0 ? flashcards[Math.min(flashcardIndex, flashcards.length - 1)] : null;

  const unit = tab === "VOCAB" ? "từ" : "Hán tự";
  const advancedCount = (srsOnlyFilter ? 1 : 0) + (viewMode === "FLASHCARD" || viewMode === "TOPIC" ? 1 : 0);

  const detail = activeVocab ? (
    <VocabDetail
      v={activeVocab}
      saved={savedSet.has(activeVocab.id)}
      starred={starredSet.has(activeVocab.id)}
      speakingText={speakingText}
      showAllExamples={showAllExamples}
      onToggleExamples={() => setShowAllExamples((s) => !s)}
      onSpeak={speak}
      onSave={() => handleAddToSrs("VOCAB", activeVocab.id, activeVocab.word)}
      onToggleStar={() => toggleStar(activeVocab.id)}
    />
  ) : activeKanji ? (
    <KanjiDetail
      k={activeKanji}
      saved={savedSet.has(activeKanji.id)}
      starred={starredSet.has(activeKanji.id)}
      speakingText={speakingText}
      onSpeak={speak}
      onSave={() => handleAddToSrs("KANJI", activeKanji.id, activeKanji.character)}
      onToggleStar={() => toggleStar(activeKanji.id)}
    />
  ) : null;

  const emptyState = (
    <EmptyState
      icon="🔍"
      title="Không tìm thấy kết quả"
      body="Thử đổi từ khóa hoặc bỏ bớt bộ lọc để xem thêm mục."
      action={
        <Button variant="brandOutline" size="sm" onClick={resetFilters}>
          Xóa bộ lọc
        </Button>
      }
    />
  );

  /* ---------- styles ---------- */

  const tabBase =
    "flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-extrabold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500";
  const tabActive = "bg-red-600 text-white shadow-md shadow-red-600/30";
  const tabIdle = "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-sumi-800 dark:hover:text-white";
  const segBtn = (on: boolean) =>
    `rounded-lg px-3 py-1.5 text-xs font-bold transition ${
      on ? "bg-red-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-sumi-900 dark:text-slate-300 dark:hover:bg-sumi-800"
    }`;
  const viewToggle = (on: boolean) =>
    `inline-flex h-8 w-9 items-center justify-center rounded-lg transition ${
      on ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300" : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
    }`;

  /* ============================== RENDER ============================== */

  return (
    <div className="nq-vocab-shell" id="dictionary">
      <div className="rounded-[28px] border border-white/80 bg-white/85 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-sumi-900/85 sm:p-5">
        {/* ---------- Tabs ---------- */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
          <div className="grid w-full grid-cols-3 gap-1 rounded-2xl bg-slate-100/90 p-1 dark:bg-sumi-950 md:w-[540px]">
            <button
              type="button"
              onClick={() => switchTab("VOCAB")}
              aria-pressed={tab === "VOCAB"}
              className={`${tabBase} ${tab === "VOCAB" ? tabActive : tabIdle}`}
            >
              <Icon name="book" className="h-[18px] w-[18px]" /> Từ vựng
            </button>
            <button
              type="button"
              onClick={() => switchTab("KANJI")}
              aria-pressed={tab === "KANJI"}
              className={`${tabBase} ${tab === "KANJI" ? tabActive : tabIdle}`}
            >
              <span className="jp-text text-lg leading-none">漢</span> Hán tự
            </button>
            <Link href="/app/grammar" onClick={playClick} className={`${tabBase} ${tabIdle}`}>
              <span className="jp-text text-lg leading-none">文</span> Ngữ pháp
            </Link>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hơn {vocabulary.length.toLocaleString("vi-VN")} từ vựng theo giáo trình, JLPT và chủ đề đời sống.
          </p>
        </div>

        {/* ---------- Search & filters ---------- */}
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={tab === "VOCAB" ? "Tìm từ vựng" : "Tìm Hán tự"}
              placeholder={
                tab === "VOCAB"
                  ? "Tìm từ vựng, nghĩa, cách đọc... (ví dụ: 学校, がっこう, trường học)"
                  : "Tìm Hán tự, nghĩa, âm đọc... (ví dụ: 学, gaku, học)"
              }
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-10 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-4 focus:ring-red-500/10 dark:border-slate-700 dark:bg-sumi-900 dark:text-white [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                aria-label="Xóa từ khóa"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition hover:bg-slate-300 dark:bg-sumi-800 dark:text-slate-300"
              >
                <Icon name="close" className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SelectField label="JLPT" value={levelFilter} options={LEVEL_OPTIONS} onChange={setLevelFilter} />
            {tab === "VOCAB" && (
              <>
                <SelectField label="Chủ đề" value={tagFilter} options={topicOptions} onChange={setTagFilter} />
                <SelectField label="Loại từ" value={posFilter} options={POS_OPTIONS} onChange={setPosFilter} />
              </>
            )}
            <button
              type="button"
              onClick={() => {
                playClick();
                setAdvancedOpen((o) => !o);
              }}
              aria-expanded={advancedOpen}
              className={`inline-flex h-11 items-center gap-2 rounded-2xl border px-4 text-sm font-bold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 ${
                advancedOpen || advancedCount > 0
                  ? "border-red-300 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300"
                  : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-sumi-900 dark:text-slate-100"
              }`}
            >
              <Icon name="filter" className="h-4 w-4" />
              Bộ lọc khác
              {advancedCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-black text-white">
                  {advancedCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {advancedOpen && (
          <div className="mt-3 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-sumi-950/50 md:grid-cols-3">
            <div>
              <p className="mb-2 text-xs font-bold text-slate-500">Thẻ đã lưu</p>
              <button
                type="button"
                role="switch"
                aria-checked={srsOnlyFilter}
                onClick={() => {
                  playClick();
                  setSrsOnlyFilter((s) => !s);
                }}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-sumi-900 dark:text-slate-200"
              >
                <span>Chỉ hiện thẻ đã lưu SRS ({savedSet.size})</span>
                <span className={`relative h-5 w-9 shrink-0 rounded-full transition ${srsOnlyFilter ? "bg-red-600" : "bg-slate-300 dark:bg-slate-700"}`}>
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${srsOnlyFilter ? "left-[18px]" : "left-0.5"}`} />
                </span>
              </button>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold text-slate-500">Chế độ xem</p>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    ["LIST", "Danh sách"],
                    ["GRID", "Thẻ lưới"],
                    ["FLASHCARD", "Flashcard"],
                    ...(tab === "VOCAB" ? [["TOPIC", "Theo chủ đề"]] : []),
                  ] as Array<[ViewMode, string]>
                ).map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={viewMode === mode}
                    onClick={() => {
                      playClick();
                      setViewMode(mode);
                    }}
                    className={`${segBtn(viewMode === mode)} border border-slate-200 dark:border-slate-700`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold text-slate-500">Số mục mỗi trang</p>
              <div className="flex gap-1.5">
                {[12, 24, 48].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={itemsPerPage === n}
                    onClick={() => {
                      playClick();
                      setItemsPerPage(n);
                      setCurrentPage(1);
                    }}
                    className={`${segBtn(itemsPerPage === n)} border border-slate-200 dark:border-slate-700`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------- Results header ---------- */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 px-1 pb-3">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Hiển thị <b className="font-extrabold text-slate-900 dark:text-white">{totalItems.toLocaleString("vi-VN")}</b> kết quả
          </p>
          <div className="flex items-center gap-3">
            <SelectField plain label="Sắp xếp" value={sortMode} options={sortOptions} onChange={(v) => setSortMode(v as SortMode)} />
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-sumi-900">
              <button
                type="button"
                aria-label="Dạng danh sách"
                title="Dạng danh sách"
                aria-pressed={viewMode === "LIST"}
                onClick={() => {
                  playClick();
                  setViewMode("LIST");
                }}
                className={viewToggle(viewMode === "LIST")}
              >
                <Icon name="list" className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Dạng thẻ lưới"
                title="Dạng thẻ lưới"
                aria-pressed={viewMode === "GRID"}
                onClick={() => {
                  playClick();
                  setViewMode("GRID");
                }}
                className={viewToggle(viewMode === "GRID")}
              >
                <Icon name="grid" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ---------- VIEW: LIST + DETAIL ---------- */}
        {viewMode === "LIST" && (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_440px]">
            <div className="min-w-0">
              {totalItems === 0 ? (
                emptyState
              ) : (
                <ul className="space-y-0.5">
                  {tab === "VOCAB"
                    ? vocabSlice.map((v) => (
                        <VocabRow
                          key={v.id}
                          v={v}
                          selected={isDesktop && activeVocab?.id === v.id}
                          mastered={masteredSet.has(v.id)}
                          saved={savedSet.has(v.id)}
                          speakingText={speakingText}
                          onSelect={() => selectItem(v.id)}
                          onToggleMastered={() => toggleMastered(v.id)}
                          onSpeak={speak}
                          onSave={() => handleAddToSrs("VOCAB", v.id, v.word)}
                        />
                      ))
                    : kanjiSlice.map((k) => (
                        <KanjiRow
                          key={k.id}
                          k={k}
                          selected={isDesktop && activeKanji?.id === k.id}
                          mastered={masteredSet.has(k.id)}
                          saved={savedSet.has(k.id)}
                          speakingText={speakingText}
                          onSelect={() => selectItem(k.id)}
                          onToggleMastered={() => toggleMastered(k.id)}
                          onSpeak={speak}
                          onSave={() => handleAddToSrs("KANJI", k.id, k.character)}
                        />
                      ))}
                </ul>
              )}
              <Pagination page={currentPage} totalPages={totalPages} total={totalItems} perPage={itemsPerPage} unit={unit} onPage={goToPage} />
            </div>

            <aside className="hidden lg:block" aria-label="Chi tiết">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-3xl bg-slate-50/80 p-5 dark:bg-sumi-950/50">
                {detail ?? <p className="py-10 text-center text-sm text-slate-500">Chọn một mục để xem chi tiết.</p>}
              </div>
            </aside>
          </div>
        )}

        {/* Màn hình nhỏ: chi tiết mở dạng hộp thoại */}
        <Modal
          isOpen={!isDesktop && detailOpen && viewMode === "LIST" && detail !== null}
          onClose={() => setDetailOpen(false)}
          title={tab === "VOCAB" ? "Chi tiết từ vựng" : "Chi tiết Hán tự"}
          maxWidth="lg"
        >
          {detail}
        </Modal>

        {/* ---------- VIEW: GRID ---------- */}
        {viewMode === "GRID" && (
          <>
            {totalItems === 0 ? (
              emptyState
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {sliceCards.map((c) => (
                  <GridCard
                    key={c.id}
                    c={c}
                    saved={savedSet.has(c.id)}
                    mastered={masteredSet.has(c.id)}
                    speakingText={speakingText}
                    onSpeak={speak}
                    onSave={() => handleAddToSrs(c.type, c.id, c.front)}
                    onToggleMastered={() => toggleMastered(c.id)}
                  />
                ))}
              </div>
            )}
            <Pagination page={currentPage} totalPages={totalPages} total={totalItems} perPage={itemsPerPage} unit={unit} onPage={goToPage} />
          </>
        )}

        {/* ---------- VIEW: FLASHCARD ---------- */}
        {viewMode === "FLASHCARD" && (
          <div className="mx-auto max-w-xl space-y-4">
            {!flashcard ? (
              emptyState
            ) : (
              <>
                <div className="flex items-center justify-between px-1 text-xs font-black text-slate-500">
                  <span>
                    Thẻ {Math.min(flashcardIndex, flashcards.length - 1) + 1} / {flashcards.length}
                  </span>
                  <div className="h-2 w-36 overflow-hidden rounded-full bg-slate-200 dark:bg-sumi-800">
                    <div
                      className="h-full bg-red-500 transition-all duration-300"
                      style={{ width: `${((Math.min(flashcardIndex, flashcards.length - 1) + 1) / flashcards.length) * 100}%` }}
                    />
                  </div>
                  <Badge variant="amber">JLPT {flashcard.level}</Badge>
                </div>

                <div
                  role="button"
                  tabIndex={0}
                  aria-label={isFlipped ? "Lật thẻ để xem lại mặt trước" : "Lật thẻ để xem nghĩa"}
                  onClick={() => {
                    playClick();
                    setIsFlipped((f) => !f);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      playClick();
                      setIsFlipped((f) => !f);
                    }
                  }}
                  className="flex min-h-[300px] w-full cursor-pointer flex-col justify-between rounded-3xl border-2 border-red-100 bg-gradient-to-br from-white via-red-50/30 to-rose-50/50 p-8 shadow-xl transition hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-950 dark:from-sumi-900 dark:via-sumi-900 dark:to-sumi-950 sm:min-h-[340px]"
                >
                  {!isFlipped ? (
                    <div className="my-auto flex flex-col items-center space-y-3 text-center">
                      <span className="text-xs font-bold text-slate-400">Mặt trước – chạm để lật thẻ</span>
                      <h2 className="jp-text text-6xl font-black text-slate-900 dark:text-white">{flashcard.front}</h2>
                      <p className="jp-text text-lg font-bold text-red-600 dark:text-red-400">{flashcard.reading}</p>
                      {flashcard.romaji && <p className="text-xs text-slate-400">{flashcard.romaji}</p>}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(flashcard.front);
                        }}
                        className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-red-50 dark:border-slate-700 dark:bg-sumi-800 dark:text-slate-300"
                      >
                        <Icon name="speaker" className="h-4 w-4 text-red-600" /> Nghe phát âm
                      </button>
                    </div>
                  ) : (
                    <div className="my-auto flex flex-col items-center space-y-3 text-center">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Mặt sau – nghĩa & ví dụ</span>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white">{flashcard.meaning}</h3>
                      <Badge variant="sky">{flashcard.label}</Badge>
                      {flashcard.example && (
                        <div className="mt-3 w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-4 text-left dark:border-slate-800 dark:bg-sumi-950/80">
                          <p className="jp-text text-base font-semibold leading-[2] text-slate-800 dark:text-slate-100">
                            <ExampleText sentence={flashcard.example.japanese} highlight={flashcard.highlight} />
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{flashcard.example.meaning}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-4 text-xs font-bold text-slate-400 dark:border-slate-800">
                    <span>{isFlipped ? "Chạm để xem lại mặt trước" : "Chạm để xem nghĩa"}</span>
                    <span>Chủ đề: {flashcard.topic}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    disabled={flashcardIndex === 0}
                    onClick={() => {
                      playClick();
                      setIsFlipped(false);
                      setFlashcardIndex((i) => Math.max(0, i - 1));
                    }}
                  >
                    ‹ Thẻ trước
                  </Button>
                  <Button
                    variant={savedSet.has(flashcard.id) ? "brand" : "brandOutline"}
                    onClick={() => handleAddToSrs(flashcard.type, flashcard.id, flashcard.front)}
                  >
                    {savedSet.has(flashcard.id) ? (
                      <>
                        Đã lưu SRS <Icon name="check" className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <Icon name="plus" className="h-4 w-4" /> Lưu vào SRS
                      </>
                    )}
                  </Button>
                  <Button
                    variant="primary"
                    disabled={flashcardIndex >= flashcards.length - 1}
                    onClick={() => {
                      playClick();
                      setIsFlipped(false);
                      setFlashcardIndex((i) => Math.min(flashcards.length - 1, i + 1));
                    }}
                  >
                    Thẻ tiếp ›
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ---------- VIEW: THEO CHỦ ĐỀ ---------- */}
        {viewMode === "TOPIC" && tab === "VOCAB" && (
          <div className="space-y-5">
            {filteredVocab.length === 0 && emptyState}
            {Object.entries(topicGroups).map(([title, items]) => {
              if (items.length === 0) return null;
              const expanded = expandedTopics.has(title);
              const visible = expanded ? items : items.slice(0, 6);
              return (
                <section
                  key={title}
                  className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-5 dark:border-slate-800 dark:bg-sumi-900/90"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                    <h3 className="flex items-center gap-2 text-base font-black text-slate-900 dark:text-white">
                      {title}
                      <span className="rounded-full border border-red-100 bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-600 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300">
                        {items.length} từ
                      </span>
                    </h3>
                    {items.length > 6 && (
                      <Button size="xs" variant="brandSoft" onClick={() => toggleTopicExpand(title)}>
                        {expanded ? "Thu gọn" : `Mở rộng tất cả ${items.length} từ`}
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {visible.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-start justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 transition hover:border-red-300 dark:border-slate-800 dark:bg-sumi-950"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="jp-text text-lg font-black text-slate-900 dark:text-white">{v.word}</span>
                            <button
                              type="button"
                              aria-label={`Nghe phát âm ${v.word}`}
                              onClick={() => speak(v.word)}
                              className="text-slate-400 hover:text-red-600"
                            >
                              <Icon name="speaker" className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="jp-text text-[11px] font-bold text-red-600 dark:text-red-400">{v.kana}</p>
                          <p className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-200">{v.meaning}</p>
                        </div>
                        <SaveButton saved={savedSet.has(v.id)} onSave={() => handleAddToSrs("VOCAB", v.id, v.word)} className="h-8 shrink-0 px-2.5" />
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
