"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IcoArrow } from "@/components/LearnIcons";

type Tone = "day" | "night";

/** 06:00–17:59 → ban ngày, còn lại → ban đêm (theo giờ máy người dùng). */
const toneAt = (d: Date = new Date()): Tone => {
  const h = d.getHours();
  return h >= 6 && h < 18 ? "day" : "night";
};

export function CulturePromo() {
  const [tone, setTone] = useState<Tone>("day");

  useEffect(() => {
    const sync = () => setTone(toneAt());
    sync();
    const id = window.setInterval(sync, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Link href="/app/journey" className="lp-promo" data-tone={tone}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp-promo-img is-day" src="/learn/promo-day.jpg" alt="" aria-hidden="true" loading="lazy" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lp-promo-img is-night" src="/learn/promo-night.jpg" alt="" aria-hidden="true" loading="lazy" />
      <span className="lp-promo-tone" aria-hidden="true">{tone === "day" ? "☀ Ban ngày" : "☾ Ban đêm"}</span>
      <small>TIẾN XA HƠN</small>
      <h3>Khám phá Văn hóa Nhật Bản</h3>
      <p>Hiểu thêm về con người, phong tục và những câu chuyện đằng sau ngôn ngữ.</p>
      <span className="lp-promo-btn">Khám phá ngay <IcoArrow width={14} height={14} /></span>
    </Link>
  );
}