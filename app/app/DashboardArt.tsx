import React from "react";

/** Nền tối kiểu phố đèn lồng cho thẻ "Bài học hôm nay" */
export function JapanStreetScene() {
  return (
    <svg viewBox="0 0 900 340" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="st-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1c1a" />
          <stop offset="1" stopColor="#0f0c0b" />
        </linearGradient>
        <radialGradient id="st-glow">
          <stop offset="0" stopColor="#ffb25a" stopOpacity=".9" />
          <stop offset="1" stopColor="#ffb25a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="st-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a5a3c" stopOpacity=".7" />
          <stop offset="1" stopColor="#1a1210" />
        </linearGradient>
      </defs>
      <rect width="900" height="340" fill="url(#st-sky)" />
      {/* pagoda */}
      <g transform="translate(560 20)" fill="#120d0c">
        <rect x="58" y="0" width="4" height="30" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(0 ${30 + i * 42})`}>
            <path d={`M${40 - i * 10} 0H${80 + i * 10}L${90 + i * 10} 14H${30 - i * 10}Z`} />
            <rect x={50 - i * 4} y="14" width={20 + i * 8} height="24" fill="#1d1412" />
          </g>
        ))}
      </g>
      {/* buildings */}
      <path d="M380 340V150L520 190V340Z" fill="#1a1210" />
      <path d="M760 340V160L900 130V340Z" fill="#1a1210" />
      <path d="M470 340L560 205H640L720 340Z" fill="url(#st-road)" />
      {/* lanterns */}
      {[[420, 215], [452, 250], [500, 232], [780, 200], [815, 238], [858, 214], [700, 250]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r="34" fill="url(#st-glow)" />
          <rect x="-6" y="-9" width="12" height="18" rx="5" fill="#ff7b3a" />
        </g>
      ))}
      {/* blossoms */}
      <g stroke="#1a1210" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M900 0C820 30 760 20 690 70M820 28c-10 20-4 36 8 52" />
      </g>
      {Array.from({ length: 16 }).map((_, i) => (
        <circle key={i} cx={690 + i * 13} cy={70 - Math.sin(i * 0.8) * 34 + (i % 3) * 6} r={7 + (i % 3)} fill={i % 2 ? "#f08a8d" : "#e5555b"} opacity=".9" />
      ))}
    </svg>
  );
}

/** Dải Shinkansen dưới thẻ "Hành trình" */
export function ShinkansenStrip() {
  return (
    <svg viewBox="0 0 440 70" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="440" height="70" fill="#f6ecea" />
      <path d="M0 52C70 30 120 46 200 34S350 20 440 40V70H0Z" fill="#cfd9d2" />
      <path d="M0 62C90 50 170 64 260 54S390 52 440 58V70H0Z" fill="#6f8f86" />
      <g transform="translate(210 28)">
        <path d="M0 18C0 10 6 6 16 6H180C200 6 214 12 222 22L226 30H0Z" fill="#fff" />
        <rect x="0" y="22" width="226" height="4" fill="#1d4f9a" />
        <g fill="#1d4f9a">
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={30 + i * 13} y="10" width="8" height="7" rx="1" />
          ))}
        </g>
      </g>
      {Array.from({ length: 8 }).map((_, i) => (
        <circle key={i} cx={20 + i * 22} cy={22 + (i % 3) * 5} r="5" fill="#ef7a7d" opacity=".85" />
      ))}
    </svg>
  );
}
