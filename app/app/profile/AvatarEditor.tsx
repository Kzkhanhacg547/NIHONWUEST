"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";
import { notifyProgressUpdated } from "@/components/UserProgressContext";
import { Icon, btnGhost, btnPrimary } from "./parts";

const SIZE = 256;
const MAX_FILE = 8 * 1024 * 1024;

/** Cắt vuông từ giữa ảnh, phóng theo zoom, xuất JPEG 256×256. */
function crop(img: HTMLImageElement, zoom: number, ox: number, oy: number) {
  const c = document.createElement("canvas");
  c.width = c.height = SIZE;
  const side = Math.min(img.naturalWidth, img.naturalHeight) / zoom;
  const sx = (img.naturalWidth - side) * ox;
  const sy = (img.naturalHeight - side) * oy;
  c.getContext("2d")!.drawImage(img, sx, sy, side, side, 0, 0, SIZE, SIZE);
  return c.toDataURL("image/jpeg", 0.88);
}

export function AvatarEditor({ src, initial }: { src: string | null; initial: string }) {
  const router = useRouter();
  const { showToast } = useSoundAndTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [ox, setOx] = useState(0.5);
  const [oy, setOy] = useState(0.25);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (img) setPreview(crop(img, zoom, ox, oy)); }, [img, zoom, ox, oy]);
  useEffect(() => {
    if (!img) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function close() { setImg(null); setZoom(1); setOx(0.5); setOy(0.25); setPreview(""); if (inputRef.current) inputRef.current.value = ""; }

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return showToast({ title: "Vui lòng chọn một file ảnh.", type: "error" });
    if (file.size > MAX_FILE) return showToast({ title: "Ảnh quá lớn (tối đa 8 MB).", type: "error" });
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => { URL.revokeObjectURL(url); setImg(im); };
    im.onerror = () => { URL.revokeObjectURL(url); showToast({ title: "Không đọc được ảnh này.", type: "error" }); };
    im.src = url;
  }

  async function send(method: "POST" | "DELETE") {
    setBusy(true);
    try {
      const res = await fetch("/api/account/avatar", {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "POST" ? JSON.stringify({ avatar: preview }) : undefined,
      });
      if (!res.ok) throw new Error();
      notifyProgressUpdated();
      showToast({ title: method === "POST" ? "Đã cập nhật ảnh đại diện" : "Đã xóa ảnh đại diện", type: "success" });
      close();
      router.refresh();
    } catch {
      showToast({ title: "Không thể lưu ảnh. Vui lòng thử lại.", type: "error" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="Ảnh đại diện" className="h-full w-full rounded-full object-cover shadow-lg ring-4 ring-white dark:ring-sumi-900" />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-rose-600 text-5xl font-bold text-white shadow-lg ring-4 ring-white dark:ring-sumi-900">{initial}</div>
        )}
        <button type="button" onClick={() => inputRef.current?.click()} aria-label="Đổi ảnh đại diện" className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-md ring-4 ring-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-rose-400 dark:bg-white dark:text-slate-900 dark:ring-sumi-900">
          <Icon name="camera" className="h-5 w-5" />
        </button>
        <input ref={inputRef} type="file" accept="image/*" onChange={pick} className="sr-only" tabIndex={-1} />
      </div>

      {img ? (
        <div role="dialog" aria-modal="true" aria-label="Chỉnh ảnh đại diện" className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 sm:items-center sm:p-4" onClick={() => !busy && close()}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl dark:bg-sumi-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Chỉnh ảnh đại diện</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Kéo các thanh để phóng to và chọn vùng ảnh muốn giữ.</p>
            <div className="mt-5 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {preview ? <img src={preview} alt="Xem trước" className="h-52 w-52 rounded-full object-cover shadow-md ring-1 ring-slate-200 dark:ring-slate-700" /> : null}
            </div>
            <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {([["Phóng to", zoom, setZoom, 1, 3], ["Ngang", ox, setOx, 0, 1], ["Dọc", oy, setOy, 0, 1]] as const).map(([name, val, set, min, max]) => (
                <label key={name} className="flex items-center gap-3">
                  <span className="w-16 shrink-0">{name}</span>
                  <input type="range" min={min} max={max} step={0.01} value={val} onChange={(e) => set(Number(e.target.value))} className="w-full accent-rose-600" />
                </label>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" disabled={busy} onClick={close} className={btnGhost}>Hủy</button>
              <button type="button" disabled={busy} onClick={() => send("POST")} className={btnPrimary}>{busy ? "Đang lưu..." : "Lưu ảnh"}</button>
            </div>
            <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="mt-3 w-full text-center text-sm font-semibold text-slate-600 underline-offset-4 hover:underline dark:text-slate-300">Chọn ảnh khác</button>
          </div>
        </div>
      ) : null}

      {src && !img ? (
        <button type="button" disabled={busy} onClick={() => send("DELETE")} className="mt-3 text-sm font-semibold text-slate-500 underline-offset-4 hover:text-red-600 hover:underline disabled:opacity-50 dark:text-slate-400">Xóa ảnh</button>
      ) : null}
    </>
  );
}