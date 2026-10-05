"use client";

import { useEffect, useRef } from "react";
import { SenseiAvatar, type AvatarState, type MouthShape } from "@/components/SenseiAvatar";
import type { SenseiCharacter as SenseiCharacterData } from "@/lib/senseiCharacters";

const PETALS = [
  { x: "10%", d: "13s", delay: "0s", drift: "34px" },
  { x: "27%", d: "15s", delay: "3.5s", drift: "-28px" },
  { x: "46%", d: "12s", delay: "6s", drift: "30px" },
  { x: "64%", d: "14s", delay: "1.5s", drift: "-36px" },
  { x: "80%", d: "16s", delay: "8s", drift: "26px" },
  { x: "92%", d: "13s", delay: "5s", drift: "-22px" },
];

interface Props {
  state: AvatarState;
  isSpeaking: boolean;
  isListening: boolean;
  size?: number;
  /** Nhân vật (nữ/nam) và khẩu hình bám âm thanh từ useSenseiVoice. */
  character?: SenseiCharacterData;
  viseme?: MouthShape;
}

/**
 * Sân khấu 2.5D cho Sensei: các lớp (nền shoji + Phú Sĩ, thẻ chữ nổi, nhân vật)
 * dịch chuyển nhẹ theo con trỏ để tạo chiều sâu. Không WebGL, không thêm
 * dependency. Parallax chỉ bật với chuột thật và tắt khi prefers-reduced-motion.
 */
export function SenseiCharacter({ state, isSpeaking, isListening, size = 190, character, viseme }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (reduce.matches || !finePointer.matches) return;

    let raf = 0;
    const clamp = (n: number) => Math.max(-1, Math.min(1, n));

    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--px", clamp(((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
        el.style.setProperty("--py", clamp(((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={stageRef} className="ais-stage" data-state={isSpeaking ? "TALKING" : isListening ? "LISTENING" : state}>
      {/* Lớp xa: giấy shoji, Phú Sĩ, mặt trời đỏ */}
      <div className="ais-layer ais-layer-back" aria-hidden>
        <div className="ais-shoji" />
        <svg className="ais-fuji" viewBox="0 0 320 150" preserveAspectRatio="xMidYMax slice">
          <circle className="ais-sun" cx="250" cy="36" r="13" />
          <path
            className="ais-fuji-body"
            d="M-10 150 C50 142 96 112 134 58 L146 44 Q160 36 174 44 L186 58 C224 112 270 142 330 150 Z"
          />
          <path className="ais-fuji-snow" d="M134 58 L146 44 Q160 36 174 44 L186 58 L172 54 L160 62 L148 53 Z" />
        </svg>
        <div className="ais-light" />
      </div>

      {/* Cánh hoa anh đào (CSS thuần, chậm, ít) */}
      <div className="ais-petals" aria-hidden>
        {PETALS.map((p, i) => (
          <span
            key={i}
            className="ais-petal"
            style={{ ["--x" as string]: p.x, ["--d" as string]: p.d, ["--delay" as string]: p.delay, ["--drift" as string]: p.drift }}
          />
        ))}
      </div>

      {/* Lớp giữa: nhân vật */}
      <div className="ais-layer ais-layer-char">
        <div className="ais-char-float">
          <SenseiAvatar state={state} isSpeaking={isSpeaking} isListening={isListening} size={size} character={character} viseme={viseme} />
        </div>
        <span className="ais-ground" aria-hidden />
      </div>

      {/* Lớp gần: thẻ học nổi */}
      <div className="ais-layer ais-layer-front" aria-hidden>
        <span className="ais-fcard ais-fcard--a font-jp">あ</span>
        <span className="ais-fcard ais-fcard--b font-jp">語</span>
        <span className="ais-fcard ais-fcard--c">N3</span>
      </div>
    </div>
  );
}
