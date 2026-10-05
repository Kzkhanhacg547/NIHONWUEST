interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function NihonQuestLogo({ size = "md", showText = true }: LogoProps) {
  return (
    <div className={`nq-logo-lockup nq-logo-${size}`} aria-label="Nihon Quest">
      <span className="nq-brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="6" width="16" height="20" rx="1.5" />
          <path d="M8 16h16M12 11h8M12 21h8" />
        </svg>
      </span>
      {showText && (
        <span className="nq-brand-type">
          <span className="nq-wordmark"><strong>nihon</strong><b>quest</b></span>
          <small>LEARN. EXPLORE. BECOME.</small>
        </span>
      )}
    </div>
  );
}
