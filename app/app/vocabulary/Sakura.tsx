/** Hoa anh đào 5 cánh – SVG nhỏ, dùng được ở cả Server lẫn Client Component. */
export function Sakura({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <g fill="#fbb6d2" stroke="#f472b6" strokeWidth="0.8">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="16" cy="8" rx="5" ry="7" transform={`rotate(${a} 16 16)`} />
        ))}
      </g>
      <circle cx="16" cy="16" r="3" fill="#fb7185" />
    </svg>
  );
}