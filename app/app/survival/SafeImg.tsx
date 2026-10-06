"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * <img> có fallback: nếu file ảnh chưa tồn tại (404) thì render `fallback`
 * thay vì icon ảnh vỡ. Dùng cho các ảnh bài học / nhân vật chưa kịp thêm.
 */
export function SafeImg({
  src,
  alt,
  className,
  fallback = null,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback?: ReactNode;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  // Ảnh có thể lỗi trước khi React hydrate -> onError không bắt được, kiểm tra lại ở đây.
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, [src]);

  if (failed) return <>{fallback}</>;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}