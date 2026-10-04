"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Tabs } from "@/components/ui";
import { KanaCanvas } from "@/components/KanaCanvas";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";
import type { KanaRow } from "./KanaLab";

type Tab = "HIRAGANA" | "KATAKANA" | "DAKUTEN" | "COMBO";

const TABS: { id: Tab; label: string }[] = [
  { id: "HIRAGANA", label: "Hiragana" },
  { id: "KATAKANA", label: "Katakana" },
  { id: "DAKUTEN", label: "Dakuten" },
  { id: "COMBO", label: "Yoon" },
];

const ROWS: Record<Tab, string[]> = {
  HIRAGANA: ["a", "ka", "sa", "ta", "na", "ha", "ma", "ya", "ra", "wa", "n"],
  KATAKANA: ["a", "ka", "sa", "ta", "na", "ha", "ma", "ya", "ra", "wa", "n"],
  DAKUTEN: ["ga", "za", "da", "ba", "pa"],
  COMBO: ["kya", "sha", "cha", "nya", "hya", "mya", "rya", "gya", "ja", "bya", "pya"],
};
const COLS: Record<Tab, string[]> = {
  HIRAGANA: ["a", "i", "u", "e", "o"],
  KATAKANA: ["a", "i", "u", "e", "o"],
  DAKUTEN: ["a", "i", "u", "e", "o"],
  COMBO: ["a", "u", "o"],
};
const SAMPLE_SIZE = 15; // 3 hàng x 5 cột như ảnh thiết kế

function pickSamples(kana: KanaRow[], tab: Tab): KanaRow[] {
  const pool = kana.filter((k) => {
    if (tab === "COMBO") return k.kind === "COMBO";
    if (tab === "DAKUTEN") return (k.kind === "DAKUTEN" || k.kind === "HANDAKUTEN") && k.script === "HIRAGANA";
    return k.script === tab && k.kind === "BASIC";
  });
  const out: KanaRow[] = [];
  for (const rowKey of ROWS[tab]) {
    for (const colKey of COLS[tab]) {
      const hit =
        rowKey === "n" ? pool.find((k) => k.row === "n") : pool.find((k) => k.row === rowKey && k.column === colKey);
      if (hit && !out.includes(hit)) out.push(hit);
    }
    if (out.length >= SAMPLE_SIZE) break;
  }
  return out.slice(0, SAMPLE_SIZE);
}

export function LearnKanaPanel({ kana, practiced }: { kana: KanaRow[]; practiced: string[] }) {
  const [tab, setTab] = useState<Tab>("HIRAGANA");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [doneSet, setDoneSet] = useState<Set<string>>(new Set(practiced));
  const { playClick, speak } = useSoundAndTheme();

  const samples = useMemo(() => pickSamples(kana, tab), [kana, tab]);
  const selected = samples.find((k) => k.id === selectedId) ?? samples[0] ?? null;

  // --- canvas viết tay mini ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  const clearCanvas = () => {
    const c = canvasRef.current;
    c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
  };
  useEffect(clearCanvas, [selected?.id]);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * c.width) / r.width, y: ((e.clientY - r.top) * c.height) / r.height };
  };
  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    drawing.current = true;
    last.current = point(e);
  };
  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = point(e);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = document.documentElement.classList.contains("dark") ? "#f1efe9" : "#191919";
    ctx.stroke();
    last.current = p;
  };
  const onUp = () => {
    drawing.current = false;
    last.current = null;
  };

  return (
    <div className="lp-pane" data-reveal>
      <span className="lp-eyebrow">01 / NỀN TẢNG</span>
      <h2>Học bảng chữ cái Kana</h2>
      <p>Làm quen với hệ thống chữ viết tiếng Nhật qua các bài học tương tác, luyện viết và ghi nhớ hiệu quả.</p>

      <Tabs
        items={TABS.map((t) => ({ id: t.id, label: t.label }))}
        value={tab}
        onChange={(id) => {
          playClick();
          setTab(id as Tab);
          setSelectedId(null);
        }}
        ariaLabel="Chọn bảng kana"
        className="lp-tabs"
        tabClassName="lp-tab"
        activeClassName="is-active"
      />

      <div
        role="tabpanel"
        id="lp-kana-panel"
        aria-label={TABS.find((t) => t.id === tab)?.label}
        tabIndex={0}
        className="lp-kana-grid"
      >
        {samples.map((k) => (
          <button
            key={k.id}
            type="button"
            className={`lp-kana-cell ${k.character.length > 1 ? "is-combo" : ""} ${selected?.id === k.id ? "is-active" : ""} ${doneSet.has(`${k.script}:${k.character}`) ? "is-done" : ""}`}
            onClick={() => {
              setSelectedId(k.id);
              speak(k.character);
            }}
            aria-label={`${k.character} (${k.romaji})`}
          >
            <b>{k.character}</b>
            <small>{k.romaji}</small>
          </button>
        ))}
      </div>

      <a href="#kana-full" className="lp-more">
        Xem toàn bộ bảng {TABS.find((t) => t.id === tab)?.label} →
      </a>

      {selected && (
        <div className="lp-write">
          <div className="lp-write-head">
            <div>
              <b>
                Luyện viết chữ <span className="jp-text text-3xl font-black text-[var(--lp-red)] align-middle">{selected.character}</span>
              </b>
              <p>Quan sát thứ tự nét rồi mở bảng hướng dẫn để luyện có chấm điểm.</p>
            </div>
          </div>

          <div className="lp-write-boards">
            <div className={`lp-board is-model ${selected.character.length > 1 ? "is-combo" : ""}`}>
              <span className="jp jp-text">{selected.character}</span>
              <span className="lp-reading">/{selected.romaji}/</span>
            </div>
            <div className={`lp-board is-draw ${selected.character.length > 1 ? "is-combo" : ""}`}>
              <span className="jp jp-text">{selected.character}</span>
              <button type="button" className="lp-clear" onClick={clearCanvas} aria-label="Xóa nét đã vẽ">
                🗑 Xóa
              </button>
              <canvas
                ref={canvasRef}
                width={300}
                height={300}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
                aria-label={`Vùng tập nét chữ ${selected.character}`}
              />
              {/* The scratch canvas is never scored or saved, so it must not
                  imply otherwise. */}
              <small className="lp-board-note">Khung tập tự do — không chấm điểm và không lưu. Bấm “Kiểm tra” để luyện có chấm điểm.</small>
            </div>
          </div>

          <div className="lp-write-foot">
            <button type="button" className="lp-speaker" onClick={() => speak(selected.character)} aria-label="Nghe phát âm">
              🔊
            </button>
            <span className="lp-reading-text">{selected.romaji}</span>
            <button type="button" className="lp-outline" onClick={() => { playClick(); clearCanvas(); }}>
              ↻ Viết lại
            </button>
            <button type="button" className="lp-solid" onClick={() => { playClick(); setChecking(true); }}>
              Kiểm tra &amp; chấm điểm →
            </button>
          </div>
        </div>
      )}

      {/* Kiểm tra/chấm nét dùng lại KanaCanvas gốc để giữ nguyên logic chấm điểm + lưu SRS */}
      {checking && selected && (
        <Modal
          isOpen
          onClose={() => setChecking(false)}
          title={`Luyện Viết Ký Tự — ${selected.character}`}
          maxWidth="2xl"
          closeOnBackdrop={false}
        >
          <KanaCanvas
            character={selected.character}
            romaji={selected.romaji}
            script={selected.script}
            onComplete={() => {
              setDoneSet((prev) => new Set(prev).add(`${selected.script}:${selected.character}`));
              setTimeout(() => setChecking(false), 1200);
            }}
            onClose={() => setChecking(false)}
          />
        </Modal>
      )}
    </div>
  );
}
