import React from "react";

type SceneVariant = "fuji" | "kyoto";

const FILLS = ["#ef5b5f", "#f4868a", "#e84a50"];
const BLOSSOMS: [number, number, number][] = [
  [20, 24, 1], [60, 32, 0.9], [100, 40, 1.1], [140, 60, 1], [150, 100, 0.9], [140, 140, 1.1],
  [182, 58, 0.8], [205, 30, 1], [222, 8, 0.9], [245, 88, 1.1], [280, 66, 1], [310, 44, 0.9],
  [342, 36, 1.1], [300, 118, 1], [330, 134, 1.2], [348, 170, 1], [342, 225, 1], [380, 146, 0.9],
  [420, 160, 1.1], [450, 150, 1], [490, 128, 1], [530, 120, 1.1], [565, 130, 0.9], [500, 176, 1],
  [540, 196, 1.1], [548, 240, 1], [540, 275, 0.9], [580, 215, 1], [610, 245, 0.9], [470, 172, 1.2],
];

function Blossom({ x, y, s = 1, i = 0 }: { x: number; y: number; s?: number; i?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${(i * 37) % 72})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} d="M0 0C-8-4-9-14 0-16C9-14 8-4 0 0Z" transform={`rotate(${a})`} fill={FILLS[i % 3]} />
      ))}
      <circle r="2.4" fill="#b4221c" />
    </g>
  );
}

function SakuraBranch({ className }: { className: string }) {
  return (
    <svg className={`nq-branch ${className}`} viewBox="0 0 620 340" fill="none">
      <path d="M-20 18C80 30 160 40 240 90C310 135 380 150 470 170C530 183 580 210 640 260" stroke="#2a2523" strokeWidth="7" strokeLinecap="round" />
      <path d="M120 40C150 70 150 100 140 140M240 90C260 60 300 40 340 36M330 128C350 160 350 190 340 225M440 160C470 130 520 120 560 128M520 190C540 215 548 240 540 275M200 66C190 40 200 20 220 4" stroke="#3a302b" strokeWidth="3.5" strokeLinecap="round" />
      {BLOSSOMS.map(([x, y, s], i) => <Blossom key={i} x={x} y={y} s={s * 1.15} i={i} />)}
    </svg>
  );
}

export function JapanBackdrop({ className = "" }: { className?: string }) {
  return (
    <div className={`nq-page-backdrop ${className}`} aria-hidden="true">
      <SakuraBranch className="nq-branch-tr" />
      <SakuraBranch className="nq-branch-bl" />
      {[1, 2, 3, 4, 5].map((n) => <span key={n} className={`nq-floating-petal p${n}`} />)}
    </div>
  );
}

const torii = (
  <g fill="#c8281f">
    <path d="M428 352Q502 368 576 352L572 366Q502 380 432 366Z" />
    <rect x="446" y="372" width="12" height="82" />
    <rect x="546" y="372" width="12" height="82" />
    <rect x="440" y="388" width="124" height="9" />
    <rect x="496" y="368" width="12" height="20" fill="#8f211c" />
  </g>
);

export function JapanScenicPanel({
  variant = "fuji",
  className = "",
  showLabel = true,
}: {
  variant?: SceneVariant;
  className?: string;
  showLabel?: boolean;
}) {
  const v = variant;
  return (
    <div className={`nq-scenic-panel nq-scene-${v} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 900 560" preserveAspectRatio="xMidYMax slice" className="nq-scenic-svg">
        <defs>
          <linearGradient id={`mt-${v}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#5b7473" /><stop offset="1" stopColor="#2b4543" /></linearGradient>
          <linearGradient id={`lake-${v}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#dde2dc" /><stop offset="1" stopColor="#b3c0b8" /></linearGradient>
          <linearGradient id={`mist-${v}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff" stopOpacity="0" /><stop offset=".55" stopColor="#fff" stopOpacity=".85" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
          <filter id={`blur-${v}`}><feGaussianBlur stdDeviation="3" /></filter>
        </defs>
        <circle cx="470" cy="215" r="190" fill="#e0372c" />
        <path d="M0 340C80 300 150 305 230 330C310 355 360 320 430 300C520 275 600 300 680 320C760 340 830 320 900 300V470H0Z" fill="#b9c5c0" opacity=".75" />
        <path d="M150 440C280 410 380 290 425 232C440 214 460 210 490 210C520 210 535 214 548 232C590 292 690 410 810 440Z" fill={`url(#mt-${v})`} />
        <path d="M425 232C440 214 460 210 490 210C520 210 538 214 548 232L530 244L516 228L500 252L486 230L470 256L452 232L440 250Z" fill="#f6f4ec" />
        <rect y="385" width="900" height="70" fill={`url(#mist-${v})`} />
        <path d="M0 430V380C40 370 70 392 110 384C150 376 190 400 240 392C290 386 330 410 380 420V450H0Z" fill="#35504d" opacity=".85" />
        <path d="M520 450C560 410 600 400 650 396C700 392 760 380 820 388C860 392 880 380 900 372V450Z" fill="#2d4744" opacity=".9" />
        <g transform="translate(285 330)" fill="#243b39">
          <rect x="12" y="62" width="36" height="22" />
          <path d="M0 62H60L52 52H8ZM6 50H54L47 40H13ZM12 38H48L42 29H18ZM18 27H42L36 19H24Z" />
          <rect x="29" y="4" width="2" height="15" />
        </g>
        {v === "kyoto" && (
          <g transform="translate(650 362)">
            <path d="M-10 30L70 0L150 30L130 36H10Z" fill="#2b2220" />
            <rect x="10" y="36" width="120" height="58" fill="#3a2d28" />
            {[24, 52, 80, 104].map((x) => <rect key={x} x={x} y="50" width="14" height="22" fill="#f2b05a" />)}
          </g>
        )}
        <rect y="440" width="900" height="120" fill={`url(#lake-${v})`} />
        <ellipse cx="480" cy="478" rx="130" ry="7" fill="#e0372c" opacity=".22" />
        <g transform="translate(0 908) scale(1 -1)" opacity=".3" filter={`url(#blur-${v})`}>{torii}</g>
        {torii}
        <path d="M150 560V525C190 508 230 520 270 545L290 560ZM620 560C660 520 720 515 780 530C830 540 870 520 900 500V560Z" fill="#2c3331" />
      </svg>
      {showLabel && (
        <div className="nq-scenic-callout">
          <span className="jp-text">旅</span>
          <small>Mỗi hành trình vĩ đại đều bắt đầu bằng một lựa chọn phù hợp.</small>
        </div>
      )}
    </div>
  );
}

export type ChoiceArtKind = "torii" | "sprout" | "fuji" | "sakura";

export function ChoiceArt({ kind }: { kind: ChoiceArtKind }) {
  return (
    <svg viewBox="0 0 160 90" className="nq-choice-svg" aria-hidden="true">
      {kind === "torii" && (
        <>
          <path d="M10 78C30 62 50 70 70 64C90 58 110 72 150 76V80H10Z" fill="#c9cfcc" opacity=".7" />
          <g fill="#c8281f"><path d="M58 28Q80 34 102 28L100 35Q80 41 60 35Z" /><rect x="66" y="38" width="5" height="34" /><rect x="89" y="38" width="5" height="34" /><rect x="62" y="47" width="36" height="4" /></g>
        </>
      )}
      {kind === "sprout" && (
        <>
          <path d="M10 60C40 52 120 52 150 62" stroke="#e8e3dc" strokeWidth="22" strokeLinecap="round" />
          <path d="M80 80V52" stroke="#c8281f" strokeWidth="3" />
          <path d="M80 54C60 54 50 42 52 28C68 28 80 38 80 54ZM80 54C100 52 112 40 112 24C94 26 80 38 80 54Z" fill="#c8281f" />
        </>
      )}
      {kind === "fuji" && (
        <>
          <circle cx="96" cy="30" r="14" fill="#e8574e" />
          <path d="M20 78L72 36C78 32 84 32 90 36L146 78Z" fill="#3f5a58" />
          <path d="M60 46L72 36C78 32 84 32 90 36L100 46L90 43L82 49L74 43Z" fill="#fff" />
        </>
      )}
      {kind === "sakura" && (
        <>
          <path d="M20 70C50 60 80 50 140 30" stroke="#3a302b" strokeWidth="2.5" strokeLinecap="round" />
          {([[30, 66], [55, 55], [82, 46], [108, 38], [132, 30], [70, 36], [100, 62]] as const).map(([x, y], i) => <Blossom key={i} x={x} y={y} s={0.7} i={i} />)}
        </>
      )}
    </svg>
  );
}

export function NQIcon({ name }: { name: "mail" | "lock" | "eye" | "book" | "torii" | "people" | "arrow" | "arrowUR" | "back" }) {
  const s = { width: 22, height: 22, viewBox: "0 0 24 24", "aria-hidden": true } as const;
  const st = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  switch (name) {
    case "mail": return <svg {...s} {...st}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
    case "lock": return <svg {...s} {...st}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>;
    case "eye": return <svg {...s} {...st}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "book": return <svg {...s} {...st}><path d="M12 6C10 4.5 7 4 4 4.5v13C7 17 10 17.5 12 19c2-1.500 5-2 8-1.500v-13C17 4 14 4.500 12 6ZM12 6v13" /></svg>;
    case "arrow": return <svg {...s} {...st}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "back": return <svg {...s} {...st}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
    case "arrowUR": return <svg {...s} {...st}><path d="M7 17 17 7M8 7h9v9" /></svg>;
    case "torii": return <svg {...s} fill="currentColor"><path d="M2 4.500c4 1.400 16 1.400 20 0v2.400c-4 1.200-16 1.200-20 0zM5 9h14v2H5zM7 7h2.200v14H7zM14.800 7H17v14h-2.200z" /></svg>;
    case "people": return <svg {...s} fill="currentColor"><circle cx="12" cy="8" r="3" /><circle cx="5.500" cy="10" r="2.200" /><circle cx="18.500" cy="10" r="2.200" /><path d="M6.500 19c0-3.300 2.500-5.500 5.500-5.500s5.500 2.200 5.500 5.500zM1.500 18c0-2.300 1.500-4 4-4h.5c-1 1-1.500 2.500-1.500 4zM22.500 18c0-2.300-1.500-4-4-4H18c1 1 1.500 2.500 1.500 4z" /></svg>;
  }
}
