

export type DecorTheme = "sakura" | "lantern" | "torii" | "train" | "wave";

function Flower({ x, y, s = 1, o = 1 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-7" rx="4.5" ry="7" fill="#ff8fa3" transform={`rotate(${a})`} />
      ))}
      <circle r="2.2" fill="#ffe2a8" />
    </g>
  );
}

export function PathDecor({ theme }: { theme: DecorTheme }) {
  return (
    <svg
      className={`nqp-decor d-${theme}`}
      viewBox="0 0 240 160"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {theme === "sakura" && (
        <g>
          <path d="M240 18 C200 24 170 40 140 70" stroke="#3a1f2b" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M196 30 C185 18 176 14 168 10" stroke="#3a1f2b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <Flower x={150} y={64} s={1.1} />
          <Flower x={176} y={44} s={0.8} o={0.9} />
          <Flower x={206} y={28} s={1} />
          <Flower x={226} y={50} s={0.7} o={0.8} />
          <Flower x={120} y={118} s={0.6} o={0.5} />
          {/* ấn あ */}
          <rect x="176" y="84" width="48" height="52" rx="8" fill="rgba(60,10,20,.55)" stroke="#ff4d5a" strokeWidth="1.5" />
          <text x="200" y="124" textAnchor="middle" fontSize="38" fontWeight="700" fill="#ff5b66">あ</text>
        </g>
      )}

      {theme === "lantern" && (
        <g>
          <path d="M200 0 V28" stroke="#ffb86b" strokeWidth="1.5" />
          <rect x="188" y="26" width="24" height="5" rx="2" fill="#2a1418" />
          <ellipse cx="200" cy="64" rx="22" ry="32" fill="#e0352b" />
          <ellipse cx="200" cy="64" rx="22" ry="32" fill="none" stroke="#ff8a6b" strokeWidth="1" opacity=".7" />
          {[-12, 0, 12].map((d) => (
            <path key={d} d={`M${200 + d} 34 Q${200 + d * 1.6} 64 ${200 + d} 94`} stroke="#8f1d19" strokeWidth="1.2" fill="none" />
          ))}
          <rect x="188" y="94" width="24" height="5" rx="2" fill="#2a1418" />
          <path d="M200 99 V116" stroke="#ffb86b" strokeWidth="2" />
          <circle cx="200" cy="64" r="46" fill="#ff5a3c" opacity=".12" />
          <Flower x={150} y={40} s={0.8} o={0.85} />
          <Flower x={236} y={96} s={0.9} />
          <Flower x={168} y={120} s={0.6} o={0.6} />
        </g>
      )}

      {theme === "torii" && (
        <g>
          <circle cx="176" cy="48" r="34" fill="#ff3b4a" opacity=".28" />
          <path d="M60 140 L120 96 L160 120 L200 90 L240 130 V160 H60z" fill="#0d1535" opacity=".75" />
          <path d="M136 52 Q176 40 220 52 L216 64 H140z" fill="#d93a30" />
          <rect x="142" y="68" width="72" height="7" fill="#d93a30" />
          <rect x="152" y="64" width="9" height="80" fill="#c9302b" />
          <rect x="196" y="64" width="9" height="80" fill="#c9302b" />
          <path d="M60 148 H240" stroke="#ff6b6b" strokeWidth="1" opacity=".35" />
        </g>
      )}

      {theme === "train" && (
        <g>
          <path d="M70 142 H240" stroke="#7aa2ff" strokeWidth="1.5" opacity=".4" />
          <path d="M60 116 Q70 98 110 98 H214 Q236 100 242 126 V136 H60z" fill="#e9eef7" />
          <rect x="60" y="120" width="182" height="6" fill="#2f6bff" />
          <rect x="60" y="127" width="182" height="3" fill="#ff4d5a" />
          {[96, 124, 152, 180].map((x) => (
            <rect key={x} x={x} y="105" width="16" height="9" rx="3" fill="#18233f" />
          ))}
          <circle cx="232" cy="122" r="14" fill="#fff6c8" opacity=".35" />
          <circle cx="236" cy="124" r="3" fill="#fff6c8" />
        </g>
      )}

      {theme === "wave" && (
        <g fill="none" stroke="#7aa2ff" strokeWidth="1.2" opacity=".55">
          {[0, 1, 2].map((r) =>
            [0, 1, 2, 3].map((c) => {
              const cx = 120 + c * 40 + (r % 2) * 20;
              const cy = 60 + r * 22;
              return (
                <g key={`${r}-${c}`}>
                  <circle cx={cx} cy={cy} r="20" />
                  <circle cx={cx} cy={cy} r="13" />
                  <circle cx={cx} cy={cy} r="6" />
                </g>
              );
            })
          )}
        </g>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */

export type PathIconName =
  | "level" | "goal" | "skill" | "style" | "clock"
  | "cap" | "layers" | "target" | "flame" | "refresh" | "torii";

const ICONS: Record<PathIconName, React.ReactNode> = {
  level: (<><rect x="3" y="12" width="4" height="8" rx="1" /><rect x="10" y="8" width="4" height="12" rx="1" /><rect x="17" y="4" width="4" height="16" rx="1" /></>),
  goal: (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>),
  target: (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>),
  skill: <polygon points="12,3 14.7,9 21,9.6 16.2,13.8 17.7,20 12,16.7 6.3,20 7.8,13.8 3,9.6 9.3,9" />,
  style: <path d="M4 5h7a2 2 0 0 1 1 .3V20a2 2 0 0 0-1-.3H4z M20 5h-7a2 2 0 0 0-1 .3V20a2 2 0 0 1 1-.3h7z" />,
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  cap: <path d="M2 9l10-5 10 5-10 5z M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" />,
  layers: <path d="M12 3l9 5-9 5-9-5z M3 13l9 5 9-5" />,
  flame: <path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z" />,
  refresh: <path d="M20 11a8 8 0 0 0-14-4M4 5v4h4 M4 13a8 8 0 0 0 14 4M20 19v-4h-4" />,
  torii: <path d="M3 6q9-3 18 0M5 9.5h14M7 7v13M17 7v13" />,
};

export function PathIcon({ name }: { name: PathIconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name]}
    </svg>
  );
}