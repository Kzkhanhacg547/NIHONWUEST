"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Badge } from "@/components/ui";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";
import { Japanese3DRoom, CityRoomData } from "@/components/Japanese3DRoom";
import { CITY_DETAILS, CityGourmet } from "./cityData";
import { JapanMap3D, type MapPin, type MapTone } from "@/components/JapanMap3D";

interface LocationData {
  id: string;
  slug: string;
  name: string;
  nameJa: string;
  description: string;
  requirementXp: number;
  xpReward: number;
}

interface RowItem {
  location: LocationData;
  progress: { status: string; progress?: number; isStamped?: boolean } | null;
  unlockable: boolean;
}

interface AchievementItem {
  id: string;
  achievement: {
    key: string;
    title: string;
    description: string;
    xpReward: number;
    icon: string;
  };
  unlockedAt: string;
}

// Canvas Particle Effect: Falling Sakura Petals
function SakuraFallCanvas({ mode }: { mode: "DAY" | "NIGHT" }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 320);

    const petals: Array<{ x: number; y: number; size: number; speedX: number; speedY: number; angle: number; angleSpeed: number }> = [];

    for (let i = 0; i < 35; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 5 + Math.random() * 8,
        speedX: 0.5 + Math.random() * 1.5,
        speedY: 0.8 + Math.random() * 1.8,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.05,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.angle += p.angleSpeed;

        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x > width) {
          p.x = -10;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = mode === "DAY" ? "rgba(251, 113, 133, 0.45)" : "rgba(254, 205, 211, 0.35)";
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [mode]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10 w-full h-full" />;
}

export function JourneyClient({
  rows,
  achievements,
}: {
  rows: RowItem[];
  totalXP?: number;
  achievements: AchievementItem[];
}) {
  const router = useRouter();
  const { playClick, playCorrect, playFanfare, showToast } = useSoundAndTheme();

  const [atmosphere, setAtmosphere] = useState<"DAY" | "NIGHT">("DAY");
  const [selectedCity, setSelectedCity] = useState<{ row: RowItem; details: CityGourmet } | null>(null);
  const [stampedCities, setStampedCities] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    rows.forEach((r) => {
      if (r.progress?.isStamped) {
        initial.add(r.location.slug);
      }
    });
    return initial;
  });
  const [cityProgressMap, setCityProgressMap] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    rows.forEach((r) => {
      map[r.location.id] = r.progress?.progress ?? (r.progress?.status === "COMPLETED" ? 100 : 0);
    });
    return map;
  });
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleAction = async (locationId: string, action: "unlock" | "complete", locName: string) => {
    playClick();
    setLoadingId(locationId);

    try {
      const res = await fetch("/api/journey/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId, action }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showToast({ title: data.error ?? "Không thể thực hiện hành động.", type: "error" });
        setLoadingId(null);
        return;
      }

      if (action === "complete") {
        playFanfare();
        setCityProgressMap((prev) => ({ ...prev, [locationId]: 100 }));
        showToast({
          title: `Chinh phục thành công: ${locName}!`,
          description: "Chúc mừng bạn đã mở khóa địa danh và nhận thưởng XP!",
          type: "achievement",
        });
      } else {
        playCorrect();
        showToast({
          title: `Bắt đầu khám phá: ${locName}!`,
          description: "Hãy hoàn tất các bài học để đóng dấu con dấu du lịch nhà ga.",
          type: "info",
        });
      }

      await fetch("/api/achievements", { method: "POST" });
      router.refresh();
    } catch {
      showToast({ title: "Lỗi kết nối máy chủ.", type: "error" });
    }
    setLoadingId(null);
  };

  const handleStampEki = async (locationId: string, slug: string, cityName: string) => {
    playFanfare();
    setStampedCities((prev) => new Set(prev).add(slug));
    showToast({
      title: `Đã đóng dấu du lịch: ${cityName}! ⛩️`,
      description: "Con dấu lưu niệm Eki-Stamp đỏ son đã được lưu vào sổ tay hành trình!",
      type: "xp",
    });

    try {
      await fetch("/api/journey/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId, action: "stamp" }),
      });
      router.refresh();
    } catch {}
  };

  const completedCount = rows.filter((r) => r.progress?.status === "COMPLETED").length;

  const tones: MapTone[] = rows.map((r) => {
    const st = r.progress?.status ?? "LOCKED";
    if (st === "COMPLETED") return "done";
    if (st === "IN_PROGRESS") return "open";
    return r.unlockable ? "next" : "locked";
  });
  const activeIdx = (() => {
    const byId = rows.findIndex((r) => r.location.id === activeId);
    if (byId >= 0) return byId;
    const open = tones.indexOf("open");
    if (open >= 0) return open;
    return Math.max(0, tones.indexOf("next"));
  })();

  const openCity = (row: RowItem) => {
    const loc = row.location;
    setActiveId(loc.id);
    const st = row.progress?.status ?? "LOCKED";
    if (!row.unlockable && st !== "COMPLETED" && st !== "IN_PROGRESS") {
      showToast({
        title: `🔒 Cần ${loc.requirementXp} XP để mở khoá ${loc.name}`,
        description: "Tiếp tục học bài và ôn tập để tích lũy đủ điểm kinh nghiệm!",
        type: "error",
      });
      return;
    }
    playClick();
    setSelectedCity({ row, details: CITY_DETAILS[loc.slug] || CITY_DETAILS.tokyo });
  };

  return (
    <div className="mx-auto max-w-[1320px] px-3 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
      {/* Bản đồ Nhật Bản 3D */}
      <JapanMap3D
        night={atmosphere === "NIGHT"}
        activeIndex={activeIdx}
        onSelect={(i) => openCity(rows[i])}
        pins={rows.map((r, i): MapPin => ({
          id: r.location.id,
          slug: r.location.slug,
          name: r.location.name,
          tone: tones[i],
          icon: <span>{tones[i] === "done" ? "✓" : tones[i] === "locked" ? "🔒" : "⛩"}</span>,
          sub:
            tones[i] === "done" ? "Đã chinh phục"
            : tones[i] === "open" ? "Đang du ngoạn"
            : tones[i] === "next" ? "Sẵn sàng mở"
            : `${r.location.requirementXp} XP`,
        }))}
      >
        <SakuraFallCanvas mode={atmosphere} />
        <div className="jm-hud">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="sakura" className="bg-white/20 text-white border-white/30 text-xs font-black">
              HÀNH TRÌNH KHÁM PHÁ NHẬT BẢN 🗾
            </Badge>
            <button
              onClick={() => {
                playClick();
                setAtmosphere(atmosphere === "DAY" ? "NIGHT" : "DAY");
              }}
              className="px-3 py-1 rounded-full text-xs font-bold bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-black/50 transition"
            >
              {atmosphere === "DAY" ? "🌙 Cảnh đêm" : "☀️ Cảnh ngày"}
            </button>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">Du Ngoạn Xuyên Nhật Bản</h2>
          <p className="text-sm opacity-85 leading-relaxed mt-1">
            Bấm vào ghim trên bản đồ để vào không gian văn hóa của từng thành phố.
          </p>
        </div>
        <div className="jm-stats">
          <span className="text-xs font-bold">Chặng đã chinh phục</span>
          <div className="text-3xl font-black">{completedCount} / {rows.length}</div>
          <div className="w-full bg-white/25 h-2 rounded-full mt-1 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${(completedCount / Math.max(1, rows.length)) * 100}%` }} />
          </div>
        </div>
      </JapanMap3D>

      {/* Landmarks Roadmap */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🚅</span> Lộ Trình Tuyến Shinkansen Du Lịch
            </h3>
            <p className="text-xs text-slate-500">
              Bấm vào bất kỳ thành phố nào để khám phá không gian văn hóa, món ăn đặc sản và đóng dấu lưu niệm Eki-stamp!
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row, idx) => {
            const loc = row.location;
            const details = CITY_DETAILS[loc.slug] || CITY_DETAILS.tokyo;
            const status = row.progress?.status ?? "LOCKED";
            const isCompleted = status === "COMPLETED";
            const isInProgress = status === "IN_PROGRESS";
            const isLocked = !row.unlockable && !isCompleted && !isInProgress;
            const isStamped = stampedCities.has(loc.slug) || isCompleted;
            const progressPct = isCompleted ? 100 : (cityProgressMap[loc.id] ?? row.progress?.progress ?? 0);

            return (
              <div
                key={loc.id}
                onClick={() => openCity(row)}
                className={`group rounded-3xl border-2 transition-all duration-300 p-5 relative overflow-hidden flex flex-col justify-between ${
                  isCompleted
                    ? "cursor-pointer border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/10 hover:shadow-card-hover hover:-translate-y-1"
                    : isInProgress
                    ? "cursor-pointer border-sakura-400 dark:border-sakura-800 bg-sakura-50/20 dark:bg-sakura-950/10 hover:shadow-card-hover hover:-translate-y-1"
                    : isLocked
                    ? "cursor-not-allowed opacity-55 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-sumi-950/60 grayscale"
                    : "cursor-pointer border-slate-200 dark:border-slate-800 bg-white dark:bg-sumi-900 hover:border-sakura-400 hover:shadow-card-hover hover:-translate-y-1"
                }`}
              >
                {/* Locked overlay */}
                {isLocked && (
                  <div className="absolute inset-0 z-10 rounded-3xl flex flex-col items-center justify-center gap-2 bg-black/30 dark:bg-black/50 backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-full bg-slate-800/80 border-2 border-slate-600 flex items-center justify-center text-2xl shadow-lg">
                      🔒
                    </div>
                    <div className="text-center px-4">
                      <p className="text-xs font-extrabold text-white drop-shadow">Chưa mở khóa</p>
                      <p className="text-[11px] text-amber-300 font-bold mt-0.5">Cần {loc.requirementXp} XP</p>
                    </div>
                  </div>
                )}

                {/* 3D Depth Landmark Visual */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-300">
                      Chặng #{idx + 1}
                    </span>

                    {isCompleted ? (
                      <Badge variant="matcha">✓ Đã chinh phục</Badge>
                    ) : isInProgress ? (
                      <Badge variant="sakura">Đang du ngoạn</Badge>
                    ) : (
                      <Badge variant="slate">🔒 Cần {loc.requirementXp} XP</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 my-2">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-sakura-100 to-amber-100 dark:from-sakura-950/60 dark:to-sumi-800 flex items-center justify-center text-2xl sm:text-3xl shadow-inner group-hover:scale-110 transition-transform shrink-0">
                      {details.landmark3D}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate">
                        {loc.name}{" "}
                        <span className="jp-text text-sakura-600 dark:text-sakura-400 font-bold ml-0.5">
                          {loc.nameJa}
                        </span>
                      </h4>
                      <p className="text-xs font-semibold text-slate-400 mt-0.5 truncate">
                        {details.highlights[0]}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {loc.description}
                  </p>

                  {/* Exploration Progress Bar on Card */}
                  {!isLocked && (
                    <div className="mt-3.5 space-y-1 bg-slate-50 dark:bg-sumi-950/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-500 dark:text-slate-400">Tiến độ khám phá:</span>
                        <span className={progressPct >= 100 ? "text-emerald-600 dark:text-emerald-400 font-black" : "text-sakura-600 dark:text-sakura-400 font-bold"}>
                          {progressPct}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-sumi-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            progressPct >= 100
                              ? "bg-emerald-500"
                              : "bg-gradient-to-r from-sakura-500 to-amber-500"
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Info & Tour Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap text-xs">
                  <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0">
                    ✨ +{loc.xpReward} XP
                  </span>

                  {isLocked ? (
                    <span className="font-bold text-slate-400 flex items-center gap-1 shrink-0">
                      🔒 Cần {loc.requirementXp} XP
                    </span>
                  ) : (
                    <span className="font-bold text-sakura-600 group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0">
                      Khám phá Không Gian Văn Hóa 🏯 ➔
                    </span>
                  )}
                </div>

                {/* Red Inkan Stamp Watermark if stamped */}
                {isStamped && (
                  <div className="absolute right-3 bottom-3 opacity-15 pointer-events-none select-none border-2 border-red-600 text-red-600 font-jp font-black text-[11px] p-1.5 rounded-xl rotate-12">
                    {details.stampJa}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3D VIRTUAL EXHIBITION ROOM */}
      {selectedCity && (
        <Japanese3DRoom
          isOpen={Boolean(selectedCity)}
          onClose={() => setSelectedCity(null)}
          data={{
            slug: selectedCity.row.location.slug,
            name: selectedCity.row.location.name,
            nameJa: selectedCity.row.location.nameJa,
            description: selectedCity.row.location.description,
            landmark3D: selectedCity.details.landmark3D,
            landmarkImage: selectedCity.details.landmarkImage,
            highlights: selectedCity.details.highlights,
            history: selectedCity.details.history,
            delicacies: selectedCity.details.delicacies,
            funFact: selectedCity.details.funFact,
            stampJa: selectedCity.details.stampJa,
            scenicPhotos: selectedCity.details.scenicPhotos,
            culturalFacts: selectedCity.details.culturalFacts,
            culturalArtifacts: selectedCity.details.culturalArtifacts || [],
            language: selectedCity.details.language,
            culturalEtiquette: selectedCity.details.culturalEtiquette,
          }}
          allCities={rows
            .filter((r) => {
              // Only show cities that are accessible (not hard-locked)
              const s = r.progress?.status ?? "LOCKED";
              return s === "COMPLETED" || s === "IN_PROGRESS" || r.unlockable;
            })
            .map((r) => {
              const d = CITY_DETAILS[r.location.slug] || CITY_DETAILS.tokyo;
              return {
                slug: r.location.slug,
                name: r.location.name,
                nameJa: r.location.nameJa,
                landmark3D: d.landmark3D,
              };
            })}
          onSelectCity={(citySlug) => {
            const foundRow = rows.find((r) => r.location.slug === citySlug);
            if (!foundRow) return;
            const s = foundRow.progress?.status ?? "LOCKED";
            const accessible = s === "COMPLETED" || s === "IN_PROGRESS" || foundRow.unlockable;
            if (!accessible) return; // guard: ignore teleport to locked city
            const details = CITY_DETAILS[citySlug] || CITY_DETAILS.tokyo;
            setSelectedCity({ row: foundRow, details });
          }}
          status={selectedCity.row.progress?.status ?? null}
          unlockable={selectedCity.row.unlockable}
          requirementXp={selectedCity.row.location.requirementXp}
          xpReward={selectedCity.row.location.xpReward}
          onAction={(action) => handleAction(selectedCity.row.location.id, action, selectedCity.row.location.name)}
          loadingAction={loadingId === selectedCity.row.location.id}
          isStamped={stampedCities.has(selectedCity.row.location.slug)}
          onStamp={() => handleStampEki(selectedCity.row.location.id, selectedCity.row.location.slug, selectedCity.row.location.name)}
          locationId={selectedCity.row.location.id}
          initialProgress={cityProgressMap[selectedCity.row.location.id] ?? selectedCity.row.progress?.progress ?? 0}
          onProgressUpdate={(newPercent) => {
            if (!selectedCity) return;
            setCityProgressMap((prev) => ({
              ...prev,
              [selectedCity.row.location.id]: newPercent,
            }));
          }}
        />
      )}

      {/* Achievements Showcase Grid */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <span>🏆</span> Huy Hiệu Thành Tựu Khám Phá ({achievements.length})
        </h3>

        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {achievements.map((ach) => (
              <Card
                key={ach.id}
                className="flex items-center gap-3 p-4 border-amber-200/80 bg-amber-50/20 dark:border-amber-900/40 dark:bg-amber-950/10 shadow-sm"
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-xl shrink-0">
                  {ach.achievement.icon === "star" ? "⭐" : "🏅"}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {ach.achievement.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{ach.achievement.description}</p>
                  <span className="inline-block text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-1">
                    +{ach.achievement.xpReward} XP Đã nhận
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-500 text-sm">
            Chưa mở khóa thành tựu nào. Hãy hoàn thành các chặng Shinkansen để sưu tầm huy hiệu!
          </div>
        )}
      </div>
    </div>
  );
}