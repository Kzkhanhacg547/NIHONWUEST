export function NihonQuestLogo({
  size = "md",
  showText = true,
}: {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}) {
  return (
    <div className={`nq-logo-lockup nq-logo-${size}`} aria-label="Nihon Quest">
      {/* Single source of truth for the brand mark: app/icon.png (the App Router
          metadata route, served at /icon.png, and already preloaded by Next from
          the root layout head). The mark keeps a white background so it is never
          blank while the image decodes, and decoding is left eager. */}
      <span className="nq-brand-mark" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon.png" alt="" width={52} height={52} />
      </span>
      {showText && (
        <span className="nq-brand-type">
          <span className="nq-wordmark">
            <strong>nihon</strong>
            <b>quest</b>
          </span>
          <small>LEARN. EXPLORE. BECOME.</small>
        </span>
      )}
    </div>
  );
}
