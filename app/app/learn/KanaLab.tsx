"use client";

import React, { useMemo, useState } from "react";
import { Modal } from "@/components/ui";
import { KanaWriter } from "@/components/KanaWriter";
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

type TabId = "HIRAGANA" | "KATAKANA" | "DAKUTEN" | "COMBO";

const GOJUON_ROW_ORDER = ["a", "ka", "sa", "ta", "na", "ha", "ma", "ya", "ra", "wa", "n"];
const DAKUTEN_ROW_ORDER = ["ga", "za", "da", "ba", "pa"];
const COMBO_ROW_ORDER = ["kya", "sha", "cha", "nya", "hya", "mya", "rya", "gya", "ja", "bya", "pya"];

const ROW_LABELS: Record<string, string> = {
  a: "Hàng A (あ・ア)", ka: "Hàng Ka (か・カ)", sa: "Hàng Sa (さ・サ)", ta: "Hàng Ta (た・タ)", na: "Hàng Na (な・ナ)",
  ha: "Hàng Ha (は・ハ)", ma: "Hàng Ma (ま・マ)", ya: "Hàng Ya (や・ヤ)", ra: "Hàng Ra (ら・ラ)", wa: "Hàng Wa (わ・ワ)",
  n: "Âm mũi N (ん・ン)", ga: "Hàng Ga (が・ガ)", za: "Hàng Za (ざ・ザ)", da: "Hàng Da (だ・ダ)", ba: "Hàng Ba (ば・バ)",
  pa: "Hàng Pa (ぱ・パ)", kya: "Hàng Kya (きゃ)", sha: "Hàng Sha (しゃ)", cha: "Hàng Cha (ちゃ)", nya: "Hàng Nya (にゃ)",
  hya: "Hàng Hya (ひゃ)", mya: "Hàng Mya (みゃ)", rya: "Hàng Rya (りゃ)", gya: "Hàng Gya (ぎゃ)", ja: "Hàng Ja (じゃ)",
  bya: "Hàng Bya (びゃ)", pya: "Hàng Pya (ぴゃ)",
};

const VOWEL_COLUMNS = ["a", "i", "u", "e", "o"];
const COMBO_COLUMNS = ["a", "u", "o"];

const TABS: { id: TabId; label: string }[] = [
  { id: "HIRAGANA", label: "Hiragana" },
  { id: "KATAKANA", label: "Katakana" },
  { id: "DAKUTEN", label: "Biến âm" },
  { id: "COMBO", label: "Âm ghép Yōon" },
];

const inTab = (k: KanaRow, tab: TabId) => {
  if (tab === "COMBO") return k.kind === "COMBO";
  if (tab === "DAKUTEN") return (k.kind === "DAKUTEN" || k.kind === "HANDAKUTEN") && k.script === "HIRAGANA";
  return k.script === tab && k.kind === "BASIC";
};

export function KanaLab({ kana, practiced }: { kana: KanaRow[]; practiced: string[] }) {
  const [activeTab, setActiveTab] = useState<TabId>("HIRAGANA");
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [writingTarget, setWritingTarget] = useState<KanaRow | null>(null);
  const [doneSet, setDoneSet] = useState<Set<string>>(new Set(practiced));
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const { playClick, playCorrect, showToast, speak: globalSpeak } = useSoundAndTheme();

  const activeKanaList = useMemo(() => kana.filter((k) => inTab(k, activeTab)), [kana, activeTab]);
  const counts = useMemo(() => Object.fromEntries(TABS.map((t) => [t.id, kana.filter((k) => inTab(k, t.id)).length])) as Record<TabId, number>, [kana]);

  const rowOrder = activeTab === "COMBO" ? COMBO_ROW_ORDER : activeTab === "DAKUTEN" ? DAKUTEN_ROW_ORDER : GOJUON_ROW_ORDER;
  const colOrder = activeTab === "COMBO" ? COMBO_COLUMNS : VOWEL_COLUMNS;

  const groupedRows = useMemo(
    () =>
      rowOrder.map((rowKey) => {
        const rowKana = activeKanaList.filter((k) => k.row === rowKey);
        const cells: (KanaRow | null)[] = colOrder.map((colKey) =>
          rowKey === "n" && colKey === "a" ? rowKana.find((k) => k.row === "n") || null : rowKana.find((k) => k.column === colKey) || null,
        );
        return { rowKey, label: ROW_LABELS[rowKey] || `Hàng ${rowKey.toUpperCase()}`, cells };
      }),
    [activeKanaList, rowOrder, colOrder],
  );

  const speak = (character: string) => {
    try { globalSpeak(character, audioSpeed); } catch {}
  };

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
        showToast({ title: `Đã học: ${k.character} (${k.romaji})!`, description: "Đã thêm vào hàng đợi ôn tập Spaced Repetition!", type: "xp" });
      } else {
        showToast({ title: "Không lưu được ký tự.", description: `Máy chủ trả về lỗi ${res.status}. Vui lòng thử lại.`, type: "error" });
      }
    } catch {
      showToast({ title: "Mất kết nối với máy chủ.", description: "Chưa đánh dấu được ký tự. Hãy kiểm tra kết nối và thử lại.", type: "error" });
    } finally {
      setPendingKey(null);
    }
  };

  const total = activeKanaList.length;
  const learned = activeKanaList.filter((k) => doneSet.has(`${k.script}:${k.character}`)).length;
  const pct = total ? (learned / total) * 100 : 0;
  const R = 34;
  const C = 2 * Math.PI * R;

  return (
    <div className="kl">
      <div className="kl-banner">
        <div className="kl-banner-copy">
          <span className="kl-flag">● Kana Lab · 五十音図</span>
          <h3>Bảng 50 Âm Tiếng Nhật Chuẩn (Gojūon)</h3>
          <p>
            Sắp xếp theo 5 nguyên âm <b>a · i · u · e · o</b>. Bấm “Viết” để tập từng nét với mũi tên hướng dẫn và chấm điểm tự động.
          </p>
          <a href="#kl-table" className="kl-banner-btn">Bắt đầu luyện tập →</a>
        </div>
        <div className="kl-progress" role="img" aria-label={`Tiến độ hiện tại ${learned} trên ${total}`}>
          <small>Tiến độ hiện tại</small>
          <div className="kl-progress-row">
            <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true">
              <circle cx="42" cy="42" r={R} className="kl-ring-bg" />
              <circle cx="42" cy="42" r={R} className="kl-ring" strokeDasharray={`${(pct / 100) * C} ${C}`} transform="rotate(-90 42 42)" />
            </svg>
            <b>{learned} / {total}</b>
          </div>
        </div>
      </div>

      <div id="kl-table" className="kl-bar">
        <div className="kl-tabs" role="tablist" aria-label="Chọn bảng kana">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={activeTab === t.id}
              className={activeTab === t.id ? "is-active" : ""}
              onClick={() => { playClick(); setActiveTab(t.id); }}
            >
              {t.label} <span>({counts[t.id]})</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`kl-speed ${audioSpeed === 0.75 ? "is-slow" : ""}`}
          aria-pressed={audioSpeed === 0.75}
          onClick={() => { playClick(); setAudioSpeed(audioSpeed === 1.0 ? 0.75 : 1.0); }}
        >
          {audioSpeed === 0.75 ? "🐢 Đọc chậm 0.75×" : "🐰 Đọc chuẩn 1.0×"}
        </button>
      </div>

      <div className="kl-rows">
        {groupedRows.map((row) => (
          <section key={row.rowKey} className="kl-row">
            <h4><i aria-hidden="true" />{row.label}</h4>
            <div className="kl-cards" data-cols={colOrder.length}>
              {row.cells.map((k, i) => {
                if (!k) return <div key={`e${i}`} className="kl-empty" aria-hidden="true">—</div>;
                const key = `${k.script}:${k.character}`;
                const isDone = doneSet.has(key);
                const long = Array.from(k.character).length > 1;
                return (
                  <div key={k.id} className={`kl-card ${isDone ? "is-done" : ""}`}>
                    <span className="kl-badge">{isDone ? "✓ Đã thuộc" : "Chưa học"}</span>
                    <div className={`kl-glyph jp-text ${long ? "is-combo" : ""}`}>{k.character}</div>
                    <div className="kl-romaji">{k.romaji}</div>
                    <div className="kl-btns">
                      <button type="button" onClick={() => speak(k.character)} aria-label={`Nghe phát âm ${k.romaji}`}>🔊 Nghe</button>
                      <button type="button" className="is-primary" onClick={() => { playClick(); setWritingTarget(k); }} aria-label={`Luyện viết ${k.romaji}`}>✍ Viết</button>
                    </div>
                    <button type="button" className="kl-mark" onClick={() => markPracticed(k)} disabled={pendingKey === key} aria-pressed={isDone}>
                      {isDone ? "Đã đánh dấu nhớ" : "+ Đánh dấu đã nhớ"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {writingTarget && (
        <Modal isOpen onClose={() => setWritingTarget(null)} title={`Luyện viết — ${writingTarget.character}`} maxWidth="2xl" closeOnBackdrop={false}>
          <KanaWriter
            key={writingTarget.id}
            character={writingTarget.character}
            romaji={writingTarget.romaji}
            script={writingTarget.script}
            onPass={() => setDoneSet((prev) => new Set(prev).add(`${writingTarget.script}:${writingTarget.character}`))}
            onClose={() => setWritingTarget(null)}
          />
        </Modal>
      )}
    </div>
  );
}
