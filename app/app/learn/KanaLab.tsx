"use client";

import React, { useMemo, useState } from "react";
import { Card, Button, Badge, Modal } from "@/components/ui";
import { KanaCanvas } from "@/components/KanaCanvas";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";

export interface KanaRow {
  id: string;
  character: string;
  script: string;
  romaji: string;
  ipa: string | null;
  row: string;
  column: string | null;
  kind: string;
}

// Traditional 50-sound rows order
const GOJUON_ROW_ORDER = ["a", "ka", "sa", "ta", "na", "ha", "ma", "ya", "ra", "wa", "n"];
const DAKUTEN_ROW_ORDER = ["ga", "za", "da", "ba", "pa"];
const COMBO_ROW_ORDER = ["kya", "sha", "cha", "nya", "hya", "mya", "rya", "gya", "ja", "bya", "pya"];

const ROW_LABELS: Record<string, string> = {
  a: "Hàng A (あ・ア)",
  ka: "Hàng Ka (か・カ)",
  sa: "Hàng Sa (さ・サ)",
  ta: "Hàng Ta (た・タ)",
  na: "Hàng Na (な・ナ)",
  ha: "Hàng Ha (は・ハ)",
  ma: "Hàng Ma (ま・マ)",
  ya: "Hàng Ya (や・ヤ)",
  ra: "Hàng Ra (ら・ラ)",
  wa: "Hàng Wa (わ・ワ)",
  n: "Âm mũi N (ん・ン)",
  ga: "Hàng Ga (が・ガ)",
  za: "Hàng Za (ざ・ザ)",
  da: "Hàng Da (だ・ダ)",
  ba: "Hàng Ba (ば・バ)",
  pa: "Hàng Pa (ぱ・パ)",
  kya: "Hàng Kya (きゃ)",
  sha: "Hàng Sha (しゃ)",
  cha: "Hàng Cha (ちゃ)",
  nya: "Hàng Nya (にゃ)",
  hya: "Hàng Hya (ひゃ)",
  mya: "Hàng Mya (みゃ)",
  rya: "Hàng Rya (りゃ)",
  gya: "Hàng Gya (ぎゃ)",
  ja: "Hàng Ja (じゃ)",
  bya: "Hàng Bya (びゃ)",
  pya: "Hàng Pya (ぴゃ)",
};

const VOWEL_COLUMNS = ["a", "i", "u", "e", "o"];
const COMBO_COLUMNS = ["a", "u", "o"]; // kya, kyu, kyo

export function KanaLab({ kana, practiced }: { kana: KanaRow[]; practiced: string[] }) {
  const [activeTab, setActiveTab] = useState<"HIRAGANA" | "KATAKANA" | "DAKUTEN" | "COMBO">("HIRAGANA");
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [writingTarget, setWritingTarget] = useState<KanaRow | null>(null);
  const [doneSet, setDoneSet] = useState<Set<string>>(new Set(practiced));
  const { playClick, playCorrect, showToast, speak: globalSpeak } = useSoundAndTheme();

  // Filter current kana category
  const activeKanaList = useMemo(() => {
    return kana.filter((k) => {
      if (activeTab === "COMBO") return k.kind === "COMBO";
      if (activeTab === "DAKUTEN") return (k.kind === "DAKUTEN" || k.kind === "HANDAKUTEN") && k.script === "HIRAGANA";
      return k.script === activeTab && k.kind === "BASIC";
    });
  }, [kana, activeTab]);

  // Group into Gojūon Rows
  const rowOrder = activeTab === "COMBO" ? COMBO_ROW_ORDER : activeTab === "DAKUTEN" ? DAKUTEN_ROW_ORDER : GOJUON_ROW_ORDER;
  const colOrder = activeTab === "COMBO" ? COMBO_COLUMNS : VOWEL_COLUMNS;

  const groupedRows = useMemo(() => {
    return rowOrder.map((rowKey) => {
      const rowKana = activeKanaList.filter((k) => k.row === rowKey);
      const cells: (KanaRow | null)[] = colOrder.map((colKey) => {
        if (rowKey === "n" && colKey === "a") {
          return rowKana.find((k) => k.row === "n") || null;
        }
        return rowKana.find((k) => k.column === colKey) || null;
      });
      return {
        rowKey,
        label: ROW_LABELS[rowKey] || `Hàng ${rowKey.toUpperCase()}`,
        cells,
      };
    });
  }, [activeKanaList, rowOrder, colOrder]);

  const speak = (character: string) => {
    try {
      globalSpeak(character, audioSpeed);
    } catch {}
  };

  const [pendingKey, setPendingKey] = React.useState<string | null>(null);

  const markPracticed = async (k: KanaRow) => {
    playClick();
    const key = `${k.script}:${k.character}`;
    if (pendingKey === key) return;
    setPendingKey(key);
    try {
      const res = await fetch("/api/kana/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character: k.character, script: k.script }),
      });
      if (res.ok) {
        setDoneSet((prev) => new Set(prev).add(key));
        playCorrect();
        showToast({
          title: `Đã học: ${k.character} (${k.romaji})!`,
          description: "Đã thêm vào hàng đợi ôn tập Spaced Repetition!",
          type: "xp",
        });
      } else {
        // Previously there was no else branch, so a failed request did nothing
        // at all: no feedback, no retry hint.
        showToast({
          title: "Không lưu được ký tự.",
          description: `Máy chủ trả về lỗi ${res.status}. Vui lòng thử lại.`,
          type: "error",
        });
      }
    } catch {
      showToast({
        title: "Mất kết nối với máy chủ.",
        description: "Chưa đánh dấu được ký tự. Hãy kiểm tra kết nối và thử lại.",
        type: "error",
      });
    } finally {
      setPendingKey(null);
    }
  };

  const totalCharacters = activeKanaList.length;
  const learnedCount = activeKanaList.filter((k) => doneSet.has(`${k.script}:${k.character}`)).length;

  return (
    <div className="space-y-6">
      {/* Top Banner with Stats */}
      <div className="rounded-3xl bg-gradient-to-r from-sakura-600 via-rose-600 to-indigo-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-sakura-100 bg-white/20 px-3 py-1 rounded-full">
              KANA LAB · 五十音図 🌸
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2">Bảng 50 Âm Tiếng Nhật Chuẩn (Gojūon)</h2>
            <p className="text-sm text-rose-100 max-w-xl mt-1 opacity-90">
              Sắp xếp theo 5 nguyên âm cơ bản <span className="font-bold text-white underline">a - i - u - e - o</span>. Bấm vào ký tự để nghe phát âm và tập viết từng nét trên canvas!
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[190px] text-center shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-100">Tiến độ bảng chữ</span>
            <div className="text-3xl font-black mt-1">
              {learnedCount} / {totalCharacters}
            </div>
            <div className="w-full bg-white/25 h-2.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${(learnedCount / Math.max(1, totalCharacters)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Script Selector Tabs & Audio Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/90 dark:bg-sumi-900/90 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto" role="tablist">
          {[
            { id: "HIRAGANA", label: "Hiragana (ひらがな)" },
            { id: "KATAKANA", label: "Katakana (カタカナ)" },
            { id: "DAKUTEN", label: "Biến âm (が・ざ・だ・ば・ぱ)" },
            { id: "COMBO", label: "Âm ghép Yōon (きゃ・しゃ)" },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => {
                playClick();
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-sakura-600 to-rose-600 text-white shadow-md shadow-sakura-500/25 font-black scale-[1.02]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-sumi-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Audio Playback Rate */}
        <div className="flex items-center gap-2 text-xs font-bold px-2 self-end sm:self-auto shrink-0">
          <span className="text-slate-400 dark:text-slate-500">Tốc độ đọc:</span>
          <button
            onClick={() => {
              playClick();
              setAudioSpeed(audioSpeed === 1.0 ? 0.75 : 1.0);
            }}
            className={`px-3.5 py-1.5 rounded-xl border font-bold transition shadow-xs ${
              audioSpeed === 0.75
                ? "bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300"
                : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-sumi-900 dark:text-slate-300 hover:bg-slate-50"
            }`}
          >
            {audioSpeed === 0.75 ? "🐢 Chậm (0.75x)" : "🐰 Chuẩn (1.0x)"}
          </button>
        </div>
      </div>

      {/* GOJUON 5-COLUMN TABLE */}
      <div className="space-y-5">
        {/* Table Column Header. Previously `hidden sm:grid`, so on mobile the learner
            saw a 5-column grid with no /a/ /i/ /u/ /e/ /o/ labels at all. */}
        <div className="grid gap-2 text-center text-[11px] font-black uppercase tracking-wider text-slate-400 px-2 pb-1 grid-cols-2 sm:grid-cols-6 sm:gap-3 sm:text-xs sm:px-4">
          <div className="hidden text-left pl-2 sm:block">Hàng âm</div>
          {colOrder.map((vowel) => (
            <div
              key={vowel}
              className="py-1.5 rounded-xl bg-slate-100/80 dark:bg-sumi-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800"
            >
              Cột /{vowel}/
            </div>
          ))}
        </div>

        {/* Gojuon Rows */}
        <div className="space-y-4">
          {groupedRows.map((row) => (
            <div
              key={row.rowKey}
              className="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-sumi-900/95 border border-slate-200/80 dark:border-slate-800 shadow-sm"
            >
              {/* Row Title */}
              <div className="flex items-center justify-between mb-3.5 px-1">
                <span className="text-xs sm:text-sm font-black uppercase text-sakura-600 dark:text-sakura-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sakura-500 inline-block shadow-xs shadow-sakura-500/50"></span>
                  {row.label}
                </span>
              </div>

              {/* Responsive grid. `grid-cols-5` with no breakpoint left ~65px cells at
                  375px, each holding a kanji glyph plus two labelled buttons. */}
              <div
                className={`grid gap-2 sm:gap-4 ${
                  colOrder.length === 3
                    ? "grid-cols-2 sm:grid-cols-3"
                    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
                }`}
              >
                {row.cells.map((k, colIdx) => {
                  if (!k) {
                    return (
                      <div
                        key={`empty-${colIdx}`}
                        className="min-h-[140px] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-50/40 dark:bg-sumi-950/30 flex items-center justify-center text-slate-300 dark:text-slate-700 text-base font-bold"
                      >
                        —
                      </div>
                    );
                  }

                  const key = `${k.script}:${k.character}`;
                  const isDone = doneSet.has(key);

                  return (
                    <div
                      key={k.id}
                      className={`relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 group ${
                        isDone
                          ? "border-emerald-400/80 bg-emerald-50/30 dark:border-emerald-800/80 dark:bg-emerald-950/20 shadow-xs"
                          : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-sumi-900 hover:border-sakura-400 hover:shadow-card-hover dark:hover:border-sakura-700"
                      }`}
                    >
                      {/* Done indicator tag */}
                      {isDone && (
                        <span className="absolute top-2 right-2 text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          ✓ Thuộc
                        </span>
                      )}

                      {/* The glyph was a <div onClick> with no role/tabIndex/key handler while a
                          redundant 🔊 button sat right below it. The button is the
                          real control; the glyph is now non-interactive. */}
                      <div className="text-center py-2 select-none">
                        <p className="jp-text text-[6rem] sm:text-[7.5rem] lg:text-[9rem] font-black text-slate-900 dark:text-white group-hover:scale-105 group-hover:text-sakura-600 dark:group-hover:text-sakura-400 transition-all">
                          {k.character}
                        </p>
                        <p className="text-base sm:text-xl font-black text-rose-500 dark:text-sakura-400 mt-1">
                          {k.romaji}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-1.5 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                        <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => speak(k.character)}
                            className="min-h-11 py-2 px-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-sumi-800 text-slate-700 dark:text-slate-300 text-center transition active:scale-[0.97]"
                            title="Nghe phát âm"
                            aria-label={`Nghe phát âm ${k.romaji}`}
                          >
                            🔊 Nghe
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              playClick();
                              setWritingTarget(k);
                            }}
                            className="min-h-11 py-2 px-2 rounded-xl bg-sakura-50 hover:bg-sakura-100 text-sakura-700 dark:bg-sakura-950/70 dark:text-sakura-300 border border-sakura-200/70 dark:border-sakura-900/70 text-center transition font-bold active:scale-[0.97]"
                            title="Luyện viết nét vẽ"
                            aria-label={`Luyện viết ${k.romaji}`}
                          >
                            ✍️ Viết
                          </button>
                        </div>

                        {/* Quick toggle check */}
                        <button
                          type="button"
                          onClick={() => markPracticed(k)}
                          disabled={pendingKey === `${k.script}:${k.character}`}
                          aria-pressed={isDone}
                          className={`w-full min-h-11 py-2 text-xs font-bold rounded-xl transition ${
                            isDone
                              ? "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                              : "text-sakura-600 hover:text-sakura-700 bg-sakura-50/50 dark:bg-sakura-950/30 hover:bg-sakura-100/70"
                          }`}
                        >
                          {isDone ? "Đã đánh dấu nhớ" : "+ Đánh dấu đã nhớ"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Writing Canvas Modal with 2xl spacious width */}
      {writingTarget && (
        <Modal
          isOpen={Boolean(writingTarget)}
          onClose={() => setWritingTarget(null)}
          title={`Luyện Viết Ký Tự — ${writingTarget.character}`}
          maxWidth="2xl"
          // An accidental backdrop tap used to destroy an in-progress drawing.
          closeOnBackdrop={false}
        >
          <KanaCanvas
            character={writingTarget.character}
            romaji={writingTarget.romaji}
            script={writingTarget.script}
            onComplete={() => {
              setDoneSet((prev) => new Set(prev).add(`${writingTarget.script}:${writingTarget.character}`));
              setTimeout(() => setWritingTarget(null), 1200);
            }}
            onClose={() => setWritingTarget(null)}
          />
        </Modal>
      )}
    </div>
  );
}
