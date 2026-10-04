"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "./ui";
import { useSoundAndTheme } from "./SoundAndThemeContext";

interface KanaCanvasProps {
  character: string;
  romaji: string;
  script: string;
  onComplete: () => void;
  onClose: () => void;
}

interface EvaluationResult {
  score: number;
  message?: string;
}

export function KanaCanvas({ character, romaji, script, onComplete, onClose }: KanaCanvasProps) {
  const isCombo = character.length > 1;
  const comboChars = useMemo(() => (isCombo ? character.split("") : [character]), [isCombo, character]);

  // Active target mode: 'combo' (draw both in 2 boxes) or index (0 for char1, 1 for char2)
  const [activeMode, setActiveMode] = useState<"combo" | number>(isCombo ? "combo" : 0);
  const [brushSize, setBrushSize] = useState<number>(12);
  const [showGuide, setShowGuide] = useState<boolean>(true);
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [strokeHistory, setStrokeHistory] = useState<ImageData[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const { playClick, playCorrect, playIncorrect, showToast } = useSoundAndTheme();

  // Canvas dimensions based on mode
  const canvasWidth = activeMode === "combo" && isCombo ? 420 : 300;
  const canvasHeight = activeMode === "combo" && isCombo ? 240 : 300;

  // Static box layout calculation for current mode & dimensions
  const layout = useMemo(() => {
    if (activeMode === "combo" && isCombo) {
      const boxSize = 190;
      const paddingY = (canvasHeight - boxSize) / 2;
      const gap = 16;
      const totalWidth = boxSize * 2 + gap;
      const startX = (canvasWidth - totalWidth) / 2;
      return {
        isDual: true,
        box1: {
          x: startX,
          y: paddingY,
          size: boxSize,
          cx: startX + boxSize / 2,
          cy: paddingY + boxSize / 2,
          fontSize: 135,
          char: comboChars[0] || "",
        },
        box2: {
          x: startX + boxSize + gap,
          y: paddingY,
          size: boxSize,
          cx: startX + boxSize + gap + boxSize / 2,
          cy: paddingY + boxSize / 2,
          fontSize: 105,
          char: comboChars[1] || "",
        },
      };
    } else {
      const boxSize = Math.min(canvasWidth, canvasHeight) - 24;
      const startX = (canvasWidth - boxSize) / 2;
      const startY = (canvasHeight - boxSize) / 2;
      const targetChar = typeof activeMode === "number" ? comboChars[activeMode] || character : character;
      return {
        isDual: false,
        single: {
          x: startX,
          y: startY,
          size: boxSize,
          cx: canvasWidth / 2,
          cy: canvasHeight / 2,
          fontSize: 180,
          char: targetChar,
        },
      };
    }
  }, [activeMode, isCombo, canvasWidth, canvasHeight, comboChars, character]);

  // Helper to draw grid guidelines
  const drawGuidelinesToContext = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      const drawGridBox = (x: number, y: number, size: number) => {
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.strokeRect(x, y, size, size);

        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([5, 5]);

        // Horizontal center
        ctx.beginPath();
        ctx.moveTo(x, y + size / 2);
        ctx.lineTo(x + size, y + size / 2);
        ctx.stroke();

        // Vertical center
        ctx.beginPath();
        ctx.moveTo(x + size / 2, y);
        ctx.lineTo(x + size / 2, y + size);
        ctx.stroke();

        // Diagonals
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y + size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + size, y);
        ctx.lineTo(x, y + size);
        ctx.stroke();

        ctx.setLineDash([]);
      };

      if (layout.isDual && layout.box1 && layout.box2) {
        drawGridBox(layout.box1.x, layout.box1.y, layout.box1.size);
        drawGridBox(layout.box2.x, layout.box2.y, layout.box2.size);
      } else if (layout.single) {
        drawGridBox(layout.single.x, layout.single.y, layout.single.size);
      }
    },
    [canvasWidth, canvasHeight, layout]
  );

  // Initialize and redraw on mode/character change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    drawGuidelinesToContext(ctx);
    setStrokeHistory([ctx.getImageData(0, 0, canvasWidth, canvasHeight)]);
    setAccuracyScore(null);
    setFeedbackMsg(null);
    isDrawingRef.current = false;
    lastPointRef.current = null;
  }, [character, activeMode, canvasWidth, canvasHeight, drawGuidelinesToContext]);

  // Pointer drawing event handlers
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const coords = getCanvasCoords(e);
    isDrawingRef.current = true;
    lastPointRef.current = coords;

    // Draw initial dot
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = "#0f172a";
    ctx.fill();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    const last = lastPointRef.current;

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a";
    ctx.stroke();

    lastPointRef.current = coords;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    setStrokeHistory((prev) => [...prev, ctx.getImageData(0, 0, canvasWidth, canvasHeight)]);
  };

  const clearCanvas = () => {
    playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    drawGuidelinesToContext(ctx);
    setStrokeHistory([ctx.getImageData(0, 0, canvasWidth, canvasHeight)]);
    setAccuracyScore(null);
    setFeedbackMsg(null);
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const undoStroke = () => {
    playClick();
    if (strokeHistory.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const newHistory = strokeHistory.slice(0, -1);
    const previousState = newHistory[newHistory.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setStrokeHistory(newHistory);
    setAccuracyScore(null);
    setFeedbackMsg(null);
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  // Distance-field stroke evaluation
  const evaluateStrokes = (userCanvas: HTMLCanvasElement): EvaluationResult => {
    const offscreen = document.createElement("canvas");
    offscreen.width = canvasWidth;
    offscreen.height = canvasHeight;
    const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
    if (!offCtx) return { score: 80 };

    offCtx.fillStyle = "#ffffff";
    offCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    offCtx.fillStyle = "#000000";
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";

    if (layout.isDual && layout.box1 && layout.box2) {
      offCtx.font = `bold ${layout.box1.fontSize}px 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif`;
      offCtx.fillText(layout.box1.char, layout.box1.cx, layout.box1.cy);

      offCtx.font = `bold ${layout.box2.fontSize}px 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif`;
      offCtx.fillText(layout.box2.char, layout.box2.cx, layout.box2.cy);
    } else if (layout.single) {
      offCtx.font = `bold ${layout.single.fontSize}px 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif`;
      offCtx.fillText(layout.single.char, layout.single.cx, layout.single.cy);
    }

    const refData = offCtx.getImageData(0, 0, canvasWidth, canvasHeight).data;
    const userCtx = userCanvas.getContext("2d", { willReadFrequently: true });
    if (!userCtx) return { score: 80 };
    const userData = userCtx.getImageData(0, 0, canvasWidth, canvasHeight).data;

    const evaluateBox = (xMin: number, xMax: number, yMin: number, yMax: number, minRequired: number) => {
      let userDarkCount = 0;
      let refDarkCount = 0;
      let matchedUserCount = 0;
      let matchedRefCount = 0;

      const step = 2;
      const searchRadius = 18;

      // 1. Evaluate User Drawn Strokes (Precision)
      for (let y = yMin; y < yMax; y += step) {
        for (let x = xMin; x < xMax; x += step) {
          const idx = (y * canvasWidth + x) * 4;
          const isUser = userData[idx] < 120 && userData[idx + 1] < 120 && userData[idx + 2] < 120;
          if (isUser) {
            userDarkCount++;
            let minDist2 = Infinity;
            for (let dy = -searchRadius; dy <= searchRadius; dy += 2) {
              const ny = y + dy;
              if (ny < 0 || ny >= canvasHeight) continue;
              for (let dx = -searchRadius; dx <= searchRadius; dx += 2) {
                const nx = x + dx;
                if (nx < 0 || nx >= canvasWidth) continue;
                const nidx = (ny * canvasWidth + nx) * 4;
                if (refData[nidx] < 120) {
                  const d2 = dx * dx + dy * dy;
                  if (d2 < minDist2) {
                    minDist2 = d2;
                  }
                }
              }
            }

            const d = Math.sqrt(minDist2);
            if (d <= 9) {
              matchedUserCount += 1.0;
            } else if (d <= searchRadius) {
              matchedUserCount += 1.0 - ((d - 9) / (searchRadius - 9)) * 0.45;
            }
          }
        }
      }

      // 2. Evaluate Reference Stroke Coverage (Recall)
      for (let y = yMin; y < yMax; y += step) {
        for (let x = xMin; x < xMax; x += step) {
          const idx = (y * canvasWidth + x) * 4;
          const isRef = refData[idx] < 120 && refData[idx + 1] < 120 && refData[idx + 2] < 120;
          if (isRef) {
            refDarkCount++;
            let minDist2 = Infinity;
            for (let dy = -searchRadius; dy <= searchRadius; dy += 2) {
              const ny = y + dy;
              if (ny < 0 || ny >= canvasHeight) continue;
              for (let dx = -searchRadius; dx <= searchRadius; dx += 2) {
                const nx = x + dx;
                if (nx < 0 || nx >= canvasWidth) continue;
                const nidx = (ny * canvasWidth + nx) * 4;
                if (userData[nidx] < 120) {
                  const d2 = dx * dx + dy * dy;
                  if (d2 < minDist2) {
                    minDist2 = d2;
                  }
                }
              }
            }
            const d = Math.sqrt(minDist2);
            if (d <= 14) {
              matchedRefCount += 1.0;
            } else if (d <= searchRadius) {
              matchedRefCount += 1.0 - (d - 14) / (searchRadius - 14 + 1);
            }
          }
        }
      }

      if (userDarkCount < minRequired) {
        return { score: 0, missing: true, userDarkCount };
      }

      const precision = matchedUserCount / Math.max(1, userDarkCount);
      const recall = matchedRefCount / Math.max(1, refDarkCount);
      const score = Math.round((precision * 0.55 + recall * 0.45) * 100);

      return {
        score: Math.min(99, Math.max(0, score)),
        precision,
        recall,
        missing: false,
        userDarkCount,
      };
    };

    if (layout.isDual && layout.box1 && layout.box2) {
      const b1 = layout.box1;
      const b2 = layout.box2;

      const eval1 = evaluateBox(b1.x, b1.x + b1.size, b1.y, b1.y + b1.size, 30);
      const eval2 = evaluateBox(b2.x, b2.x + b2.size, b2.y, b2.y + b2.size, 20);

      if (eval1.missing && eval2.missing) {
        return { score: 10, message: "Bạn chưa viết nét chữ nào vào 2 ô!" };
      }
      if (eval1.missing) {
        return {
          score: Math.round(eval2.score * 0.4),
          message: `Bạn chưa viết chữ chính [ ${b1.char} ] ở ô bên trái!`,
        };
      }
      if (eval2.missing) {
        return {
          score: Math.round(eval1.score * 0.4),
          message: `Bạn chưa viết chữ nhỏ [ ${b2.char} ] ở ô bên phải!`,
        };
      }

      const combinedScore = Math.round(eval1.score * 0.55 + eval2.score * 0.45);

      if (eval1.score < 65) {
        return { score: combinedScore, message: `Nét chữ [ ${b1.char} ] chưa chuẩn xác!` };
      }
      if (eval2.score < 65) {
        return { score: combinedScore, message: `Nét chữ nhỏ [ ${b2.char} ] chưa chuẩn xác!` };
      }

      return { score: combinedScore };
    } else {
      const evalSingle = evaluateBox(0, canvasWidth, 0, canvasHeight, 25);

      if (evalSingle.missing) {
        return { score: 15, message: "Hãy viết đầy đủ nét chữ mẫu!" };
      }

      return { score: evalSingle.score };
    }
  };

  const checkDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas || strokeHistory.length <= 1) {
      showToast({ title: "Hãy viết ít nhất 1 nét chữ!", type: "error" });
      playIncorrect();
      return;
    }

    setSubmitting(true);
    const result = evaluateStrokes(canvas);
    const score = result.score;
    setAccuracyScore(score);
    setFeedbackMsg(result.message || null);

    if (score >= 70) {
      playCorrect();

      try {
        const res = await fetch("/api/kana/practice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ character, script }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          showToast({
            title: `🌸 Xuất sắc: ${character} (${romaji})!`,
            description: `Độ chuẩn nét: ${score}% · ${data.xpAwarded ? `+${data.xpAwarded} XP · ` : ""}Đã ghi nhận!`,
            type: "xp",
          });
          onComplete();
        }
      } catch {}
    } else {
      playIncorrect();
      showToast({
        title: result.message || "Nét vẽ chưa đạt chuẩn!",
        description: `Độ chuẩn nét: ${score}%. Điểm tối thiểu cần đạt là 70%.`,
        type: "error",
      });
    }
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Header Info & Guide Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-sakura-600 dark:text-sakura-400 bg-sakura-50 dark:bg-sakura-950/60 px-2.5 py-0.5 rounded-full border border-sakura-200/60 dark:border-sakura-900/60">
              {script} · {isCombo ? "Âm ghép (Yōon)" : "Ký tự đơn"}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Luyện viết: <span className="jp-text text-4xl font-black text-rose-600 dark:text-sakura-400 inline-block ml-1">{character}</span>{" "}
            <span className="text-slate-500 font-bold text-lg">({romaji})</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className={`min-h-11 px-3 py-2.5 text-xs font-bold rounded-xl border transition flex items-center gap-1.5 shadow-sm ${
              showGuide
                ? "bg-sakura-50 border-sakura-300 text-sakura-700 dark:bg-sakura-950/60 dark:border-sakura-800 dark:text-sakura-300"
                : "border-slate-200 text-slate-500 hover:text-slate-800 dark:border-slate-700 dark:text-slate-400"
            }`}
          >
            <span>{showGuide ? "👁️ Nét mẫu: BẬT" : "👁️ Nét mẫu: TẮT"}</span>
          </button>
        </div>
      </div>

      {/* Mode / Sub-character selector for 2-letter combos */}
      {isCombo && (
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-sumi-800 rounded-2xl w-full max-w-md justify-center">
          <button
            type="button"
            onClick={() => {
              playClick();
              setActiveMode("combo");
            }}
            className={`flex-1 min-h-11 py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
              activeMode === "combo"
                ? "bg-white text-sakura-600 shadow-sm dark:bg-sumi-900 dark:text-sakura-400"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            🔤 Trọn cụm ({character})
          </button>
          <button
            type="button"
            onClick={() => {
              playClick();
              setActiveMode(0);
            }}
            className={`flex-1 min-h-11 py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
              activeMode === 0
                ? "bg-white text-sakura-600 shadow-sm dark:bg-sumi-900 dark:text-sakura-400"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            1️⃣ Chữ chính ({comboChars[0]})
          </button>
          <button
            type="button"
            onClick={() => {
              playClick();
              setActiveMode(1);
            }}
            className={`flex-1 min-h-11 py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
              activeMode === 1
                ? "bg-white text-sakura-600 shadow-sm dark:bg-sumi-900 dark:text-sakura-400"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            2️⃣ Chữ nhỏ ({comboChars[1]})
          </button>
        </div>
      )}

      {/* Canvas Drawing Area with Direct Pointer Event Handling */}
      <div className="relative border-2 border-slate-300 dark:border-sumi-700 rounded-3xl overflow-hidden shadow-lg bg-white select-none touch-none">
        {/* SVG Ghost Reference Character Watermark */}
        {showGuide && (
          <svg
            className="absolute inset-0 pointer-events-none select-none w-full h-full"
            style={{ pointerEvents: "none" }}
            viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
            preserveAspectRatio="none"
          >
            {layout.isDual && layout.box1 && layout.box2 ? (
              <>
                <text
                  x={layout.box1.cx}
                  y={layout.box1.cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={layout.box1.fontSize}
                  fontWeight="bold"
                  fill="rgba(203, 213, 225, 0.85)"
                  fontFamily="'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif"
                  style={{ pointerEvents: "none" }}
                >
                  {layout.box1.char}
                </text>
                <text
                  x={layout.box2.cx}
                  y={layout.box2.cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={layout.box2.fontSize}
                  fontWeight="bold"
                  fill="rgba(203, 213, 225, 0.85)"
                  fontFamily="'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif"
                  style={{ pointerEvents: "none" }}
                >
                  {layout.box2.char}
                </text>
              </>
            ) : layout.single ? (
              <text
                x={layout.single.cx}
                y={layout.single.cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={layout.single.fontSize}
                fontWeight="bold"
                fill="rgba(203, 213, 225, 0.85)"
                fontFamily="'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif"
                style={{ pointerEvents: "none" }}
              >
                {layout.single.char}
              </text>
            ) : null}
          </svg>
        )}

        {/* Interactive Drawing Canvas using HTML5 Pointer Events.
            width/height thuộc tính buffer nội bộ (giữ nguyên độ phân giải vẽ),
            còn kích thước hiển thị do aspect-ratio nên co lại được trên 360px –
            toạ độ con trỏ đã lấy lại theo getBoundingClientRect nên vẽ vẫn
            chính xác. */}
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            width: "100%",
            height: "auto",
            aspectRatio: `${canvasWidth} / ${canvasHeight}`,
            touchAction: "none",
          }}
          className="block w-full cursor-crosshair select-none"
        />
      </div>

      {/* Brush Size / Thickness Switcher */}
      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-semibold">
        <span>Nét bút:</span>
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-sumi-800 p-1 rounded-xl">
          {[
            { size: 8, label: "Mảnh" },
            { size: 12, label: "Chuẩn" },
            { size: 16, label: "Đậm" },
          ].map((item) => (
            <button
              key={item.size}
              type="button"
              onClick={() => {
                playClick();
                setBrushSize(item.size);
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                brushSize === item.size
                  ? "bg-white dark:bg-sumi-900 text-slate-900 dark:text-white font-bold shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result feedback */}
      {accuracyScore !== null && (
        <div
          className={`text-center px-5 py-3 rounded-2xl text-sm font-bold border animate-in fade-in zoom-in-95 duration-150 w-full max-w-md ${
            accuracyScore >= 70
              ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300"
              : "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300"
          }`}
        >
          <div className="text-base font-black">
            {accuracyScore >= 85
              ? "🌸 たいへんよくできました！ (Xuất sắc!)"
              : accuracyScore >= 70
              ? "✨ よくできました！ (Đạt chuẩn!)"
              : "✍️ もうすこし！ (Chưa đạt yêu cầu!)"}
          </div>
          <div className="text-xs opacity-90 mt-1">
            Độ chính xác đường nét: <span className="text-sm font-black">{accuracyScore}%</span>
            {accuracyScore < 70 && <span className="text-red-500 font-bold ml-1">(Yêu cầu ≥ 70%)</span>}
          </div>
          {feedbackMsg && (
            <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1 bg-rose-50/80 dark:bg-rose-950/40 py-1 px-2 rounded-lg">
              ⚠️ {feedbackMsg}
            </div>
          )}
        </div>
      )}

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 w-full pt-2 border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="outline"
          size="md"
          onClick={undoStroke}
          disabled={strokeHistory.length <= 1}
          className="rounded-2xl"
        >
          ↩️ Hoàn tác
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={clearCanvas}
          className="rounded-2xl"
        >
          🗑️ Viết lại
        </Button>
        <Button
          variant="sakura"
          size="md"
          onClick={checkDrawing}
          loading={submitting}
          className="px-6 font-black rounded-2xl shadow-lg shadow-sakura-500/25"
        >
          ✨ Chấm nét & Lưu
        </Button>
      </div>
    </div>
  );
}
