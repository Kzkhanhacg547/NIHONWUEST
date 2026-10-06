"use client";

import { useEffect, useState } from "react";
import { SafeImg } from "./SafeImg";

const FEATURES = [
  { icon: "💬", label: "Hội thoại\ntương tác", cls: "bg-rose-100 text-rose-500" },
  { icon: "♪", label: "Phát âm\ntiếng Nhật", cls: "bg-indigo-100 text-indigo-500" },
  { icon: "🎙", label: "Luyện phản xạ\nnói", cls: "bg-sky-100 text-sky-600" },
];

export default function Loading() {
  const [pct, setPct] = useState(6);

  // Không biết chính xác thời gian tải -> chạy tiệm cận 94%, trang thật hiện ra sẽ thay thế màn này.
  useEffect(() => {
    const t = setInterval(() => {
      setPct((p) => (p >= 94 ? p : p + Math.max(1, Math.round((94 - p) / 12))));
    }, 140);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Đang tải thử thách sinh tồn"
      className="fixed inset-0 z-[100] overflow-hidden bg-gradient-to-br from-sky-300 via-indigo-300 to-pink-200"
    >
      <SafeImg
        src="/images/survival/loading-girl.webp"
        alt=""
        priority
        className="absolute inset-0 h-full w-full object-cover object-[22%_40%] md:object-[50%_40%]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-indigo-950/10" />

      {/* Logo + nhãn */}
      <div className="absolute left-5 top-5 flex items-center gap-2.5 drop-shadow-lg sm:left-8 sm:top-7">
        <span
          className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-white shadow-md"
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.png" alt="" width={40} height={40} className="h-full w-full object-contain" draggable={false} />
        </span>
        <span className="text-2xl font-black tracking-tight text-white">
          Nihon&nbsp;<span className="text-rose-400">Quest</span>
        </span>
      </div>
      <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-2.5 text-sm font-bold text-rose-600 shadow-lg backdrop-blur sm:right-8 sm:top-7">
        <span aria-hidden>⛩</span> Survival Mode
      </div>

      {/* Thẻ loading */}
      <div className="absolute inset-0 flex items-center justify-center px-4 pt-10 md:justify-end md:pr-[10vw] lg:justify-center lg:pl-[12vw]">
        <div className="relative w-full max-w-[640px] rounded-[32px] border border-white/70 bg-white/75 px-6 pb-7 pt-12 text-center shadow-2xl shadow-indigo-900/20 backdrop-blur-xl sm:px-10 sm:pb-9">
          <div className="absolute -top-14 left-1/2 -translate-x-1/2">
            <SafeImg
              src="/icon.png"
              alt=""
              priority
              className="h-28 w-28 rounded-full border-4 border-white bg-white object-contain shadow-xl shadow-indigo-900/25"
              fallback={
                <div
                  className="relative grid h-28 w-28 place-items-center rounded-full border-4 border-white bg-white text-4xl drop-shadow-lg"
                  aria-hidden
                >
                  ⛩️
                </div>
              }
            />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-950">Đang tải module</p>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-indigo-950 sm:text-5xl">
            Thử thách <span className="text-pink-500">sinh tồn</span>{" "}
            <span className="text-2xl text-pink-400 sm:text-3xl" aria-hidden>🌸</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
            Chuẩn bị tinh thần, chúng ta sắp bước vào những tình huống giao tiếp thực tế tại Nhật Bản!
          </p>

          {/* Thanh tiến trình */}
          <div className="mt-7 flex items-center gap-4">
            <div
              className="relative h-3.5 flex-1 rounded-full bg-indigo-100"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-400 to-indigo-400 transition-[width] duration-200 ease-out"
                style={{ width: `${pct}%` }}
              />
              <span
                className="absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-sm text-white shadow-lg transition-[left] duration-200 ease-out"
                style={{ left: `calc(${pct}% - 16px)` }}
                aria-hidden
              >
                ⛩
              </span>
            </div>
            <span className="w-11 text-right text-sm font-black tabular-nums text-indigo-950">{pct}%</span>
          </div>

          {/* 3 tính năng */}
          <div className="mt-7 grid grid-cols-3 divide-x divide-indigo-100">
            {FEATURES.map((f) => (
              <div key={f.icon} className="flex flex-col items-center gap-2 px-2">
                <span className={`flex h-12 w-12 items-center justify-center rounded-full text-xl ${f.cls}`} aria-hidden>
                  {f.icon}
                </span>
                <span className="whitespace-pre-line text-xs font-bold leading-snug text-indigo-950 sm:text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}