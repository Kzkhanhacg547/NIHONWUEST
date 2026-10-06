"use client";

import { useMemo } from "react";
import { arrowMarks, type GlyphStroke } from "@/lib/kana-strokes";

interface Props {
  glyph: GlyphStroke[];
  /** Vẽ chữ đậm (chữ mẫu) */
  ink?: boolean;
  /** Vẽ chữ mờ làm nền tập viết */
  ghost?: boolean;
  /** Mũi tên hướng + số thứ tự nét (KHÔNG phải nét mẫu) */
  guide?: boolean;
  /** Đổi giá trị (>0) để phát hoạt ảnh viết từng nét theo thứ tự */
  animateKey?: number;
  className?: string;
}

const W_INK = 6.4;
const W_GHOST = 7;

export function KanaStrokeGuide({ glyph, ink = false, ghost = false, guide = false, animateKey = 0, className }: Props) {
  const marks = useMemo(() => glyph.map((g) => arrowMarks(g)), [glyph]);
  const animating = animateKey > 0;

  const paths = (width: number, extra?: (i: number) => React.SVGProps<SVGPathElement>) =>
    glyph.map((g, i) => (
      <path
        key={i}
        d={g.d}
        transform={`translate(${g.tx} ${g.ty}) scale(${g.s})`}
        strokeWidth={width / g.s}
        {...(extra ? extra(i) : null)}
      />
    ));

  return (
    <svg viewBox="0 0 109 109" className={className} aria-hidden="true" focusable="false">
      {ghost && (
        <g className="kg-ghost" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {paths(W_GHOST)}
        </g>
      )}
      {ink && !animating && (
        <g className="kg-ink" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {paths(W_INK)}
        </g>
      )}
      {ink && animating && (
        <g key={animateKey} className="kg-ink" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {paths(W_INK, (i) => ({ pathLength: 1, className: "kg-draw", style: { animationDelay: `${i * 0.85}s` } }))}
        </g>
      )}

      {guide && (
        <g className="kg-guide">
          <g fill="none" strokeLinecap="round">
            {paths(1.1, () => ({ className: "kg-line", strokeDasharray: "2 2.2" }))}
          </g>
          {marks.map((ms, i) =>
            ms.map((m, k) => (
              <polygon
                key={`${i}-${k}`}
                className="kg-arrow"
                points="3.4,0 -2.4,2.7 -1.2,0 -2.4,-2.7"
                transform={`translate(${m.x} ${m.y}) rotate(${m.angle})`}
              />
            )),
          )}
          {glyph.map((g, i) => (
            <g key={`n${i}`} transform={`translate(${g.num[0]} ${g.num[1]})`}>
              <circle r="4.3" className="kg-badge" />
              <text className="kg-num" textAnchor="middle" dominantBaseline="central" y="0.3">
                {i + 1}
              </text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
