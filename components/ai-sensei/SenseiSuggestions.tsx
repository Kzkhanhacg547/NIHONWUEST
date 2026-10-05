"use client";

import { useState } from "react";
import type { KaiwaScenario } from "@/lib/n3KaiwaScenarios";

interface Props {
  replies: KaiwaScenario["suggestedReplies"];
  disabled: boolean;
  onPick: (ja: string) => void;
}

export function SenseiSuggestions({ replies, disabled, onPick }: Props) {
  const [open, setOpen] = useState(true);
  if (!replies?.length) return null;

  return (
    <div className="ais-suggest">
      <div className="ais-suggest-head">
        <h3>Gợi ý đối đáp nhanh</h3>
        <button
          type="button"
          className="ais-suggest-toggle"
          aria-expanded={open}
          aria-controls="ais-suggest-row"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Ẩn" : "Hiện"}
        </button>
      </div>

      {open && (
        <div id="ais-suggest-row" className="ais-suggest-row">
          {replies.map((reply, idx) => (
            <button
              key={idx}
              type="button"
              className="ais-suggest-card"
              disabled={disabled}
              onClick={() => onPick(reply.ja)}
              title={reply.vi}
            >
              <span className="ais-suggest-ja font-jp">{reply.ja}</span>
              <span className="ais-suggest-vi">{reply.vi}</span>
              <span className="ais-suggest-tag">N3</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
