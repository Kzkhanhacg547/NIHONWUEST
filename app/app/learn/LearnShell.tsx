"use client";

import { useEffect, useState, type ReactNode } from "react";

type TimeOfDay = "day" | "night";

const DAY_START = 6; // 06:00 → ảnh ban ngày
const NIGHT_START = 18; // 18:00 → ảnh ban đêm

const getTimeOfDay = (date = new Date()): TimeOfDay => {
  const h = date.getHours();
  return h >= DAY_START && h < NIGHT_START ? "day" : "night";
};

/**
 * Khung bao trang Học tập: dựng nền body (ảnh sáng/tối luân phiên theo giờ máy người dùng)
 * và gắn data-tod lên .lp-root để learn.css đổi bảng màu cho khớp.
 * Children là server component truyền từ page.tsx nên vẫn render phía server.
 */
export function LearnShell({ children }: { children: ReactNode }) {
  // SSR luôn "day" để hydrate khớp; đồng bộ giờ thật ngay sau khi mount.
  const [tod, setTod] = useState<TimeOfDay>("day");

  useEffect(() => {
    const sync = () => setTod(getTimeOfDay());
    sync();
    const id = window.setInterval(sync, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="lp-root" data-tod={tod}>
      <div className="lp-bg" aria-hidden="true">
        <div className="lp-bg-fixed">
          <i className="lp-bg-img is-day" />
          <i className="lp-bg-img is-night" />
          <i className="lp-bg-veil" />
        </div>
      </div>
      {children}
    </div>
  );
}