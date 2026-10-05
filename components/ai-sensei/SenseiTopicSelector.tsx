"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui";
import type { KaiwaScenario } from "@/lib/n3KaiwaScenarios";

interface Props {
  scenarios: KaiwaScenario[];
  selectedId: string;
  onSelect: (scenario: KaiwaScenario) => void;
  keyConnected: boolean;
  onOpenKey: () => void;
}

export function SenseiTopicSelector({ scenarios, selectedId, onSelect, keyConnected, onOpenKey }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);

  // Đưa chủ đề đang chọn vào tầm nhìn trên mobile (chỉ cuộn trong hàng, không cuộn trang).
  useEffect(() => {
    const row = rowRef.current;
    const active = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!row || !active) return;
    const target = active.offsetLeft - (row.clientWidth - active.offsetWidth) / 2;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollTo({ left: Math.max(0, target), behavior: reduce ? "auto" : "smooth" });
  }, [selectedId]);

  return (
    <section className="ais-topics" aria-label="Chủ đề đàm thoại">
      <div className="ais-topics-head">
        <h2 className="ais-topics-label">Chủ đề đàm thoại N3 thực chiến</h2>
        <button
          type="button"
          className="ais-keybtn"
          onClick={onOpenKey}
          title="Cài đặt Google Gemini API Key để trò chuyện không giới hạn"
        >
          <Icon name="settings" className="h-4 w-4" />
          <span>{keyConnected ? "AI Key: Đã kết nối" : "Cài đặt AI Key"}</span>
          {keyConnected && <span className="ais-keybtn-dot" aria-hidden />}
        </button>
      </div>

      <div ref={rowRef} className="ais-topics-row">
        {scenarios.map((sc) => (
          <button
            key={sc.id}
            type="button"
            className="ais-topic"
            aria-pressed={sc.id === selectedId}
            onClick={() => onSelect(sc)}
          >
            <span className="ais-topic-ico" aria-hidden>
              {sc.icon}
            </span>
            <span>{sc.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
