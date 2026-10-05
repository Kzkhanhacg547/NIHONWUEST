"use client";

import { Icon, Tabs, type TabItem } from "@/components/ui";
import type { SenseiTab } from "./types";

const TAB_ITEMS: TabItem[] = [
  { id: "KAIWA", label: "AI Kaiwa (Đàm thoại)", icon: <Icon name="chat" className="h-4 w-4" /> },
  { id: "DUNGEON", label: "Sensei's Daily Dungeon", icon: <Icon name="calendar" className="h-4 w-4" /> },
];

export function SenseiHero({
  activeTab,
  onTabChange,
}: {
  activeTab: SenseiTab;
  onTabChange: (tab: SenseiTab) => void;
}) {
  return (
    <header className="ais-hero">
      <div className="ais-hero-copy">
        <p className="ais-eyebrow">
          <span className="ais-eyebrow-dot" aria-hidden />
          AI Sensei · JLPT N3
        </p>
        <h1 className="ais-title">
          AI Kaiwa Sensei <span className="ais-title-jp font-jp">(葵先生)</span>
        </h1>
        <p className="ais-subtitle">
          Luyện phản xạ giao tiếp tiếng Nhật thực tế N3 bằng giọng nói và văn bản. Sensei phản hồi trực tiếp,
          khẩu hình đồng bộ khi nói.
        </p>
      </div>

      <Tabs
        items={TAB_ITEMS}
        value={activeTab}
        onChange={(id) => onTabChange(id as SenseiTab)}
        ariaLabel="Chế độ luyện tập với Sensei"
        className="ais-tabs"
        tabClassName="ais-tab"
        activeClassName="is-active"
      />
    </header>
  );
}
