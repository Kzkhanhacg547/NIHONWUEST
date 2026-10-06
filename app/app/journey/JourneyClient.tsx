"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, Badge } from "@/components/ui";
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


const IMG_BASE = "/images/journey";
const ACHIEVEMENTS_HREF = "/app/achievements"; // đổi nếu route huy hiệu của bạn khác

/** Ảnh minh hoạ: /images/journey/<slug>.png -> fallback landmarkImage -> nền gradient */
function CityImage({ slug, fallback, className }: { slug: string; fallback?: string; className?: string }) {
  const [src, setSrc] = useState<string | null>(`${IMG_BASE}/${slug}.png`);
  const [triedFallback, setTriedFallback] = useState(false);
  if (!src) return <div className={`jy-img-fallback ${className ?? ""}`} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      className={className}
      onError={() => {
        if (!triedFallback && fallback) {
          setTriedFallback(true);
          setSrc(fallback);
        } else setSrc(null);
      }}
    />
  );
}

function PinThumb({ slug, tone }: { slug: string; tone: MapTone }) {
  if (tone === "locked") return <span>🔒</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`${IMG_BASE}/${slug}.png`} alt="" onError={(e) => ((e.currentTarget.style.display = "none"))} />;
}

function ShinkansenArt() {
  return (
    <svg className="jy-train" viewBox="0 0 420 90" aria-hidden="true">
      <defs>
        <linearGradient id="jyTrainBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dfe8f5" />
        </linearGradient>
      </defs>
      <path d="M8 62 C8 48 40 34 120 32 L330 32 C372 32 404 46 414 62 L414 66 L8 66 Z" fill="url(#jyTrainBody)" stroke="#b7c6dd" />
      <rect x="8" y="52" width="406" height="7" fill="#1d4f9c" />
      <rect x="8" y="59" width="406" height="3" fill="#e8344b" />
      {Array.from({ length: 13 }).map((_, i) => (
        <rect key={i} x={150 + i * 17} y="40" width="11" height="9" rx="2" fill="#27407a" />
      ))}
      <path d="M338 38 C362 38 386 44 400 54 L338 54 Z" fill="#27407a" />
      <rect x="0" y="68" width="420" height="3" rx="1.5" fill="#cfd9ea" opacity=".7" />
    </svg>
  );
}

const achIcon = (icon: string) => (icon === "star" ? "⭐" : /^[^\x00-\x7F]{1,4}$/.test(icon) ? icon : "🏅");

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

  const activeRow = rows[activeIdx];
  const cultureCount = rows.reduce((n, r, i) => {
    if (tones[i] === "locked" || tones[i] === "next") return n;
    return n + (CITY_DETAILS[r.location.slug]?.culturalArtifacts?.length ?? 0);
  }, 0);

  return (
    <div className="jy-shell">
      {/* ============ HERO + BẢN ĐỒ 3D ============ */}
      <section className={`jy-hero ${atmosphere === "NIGHT" ? "is-night" : ""}`}>
        <div className="jy-hero-bg" style={{ backgroundImage: `url(${IMG_BASE}/hero.png)` }} />
        <div className="jy-hero-shade" />
        <SakuraFallCanvas mode={atmosphere} />

        <div className="jy-hero-copy">
          <div className="jy-hero-top">
            <Badge variant="sakura" className="jy-hero-badge">HÀNH TRÌNH KHÁM PHÁ NHẬT BẢN ✦</Badge>
            <button
              type="button"
              className="jy-mode-btn"
              onClick={() => {
                playClick();
                setAtmosphere(atmosphere === "DAY" ? "NIGHT" : "DAY");
              }}
            >
              {atmosphere === "DAY" ? "🌙 Cảnh đêm" : "☀️ Cảnh ngày"}
            </button>
          </div>
          <h2 className="jy-hero-title">
            Du Ngoạn<br />Xuyên <em>Nhật Bản</em>
          </h2>
          <p className="jy-hero-sub">Bước vào bản đồ 3D để khám phá những nét văn hóa đặc sắc của từng thành phố.</p>

          <div className="jy-hero-stats">
            <div><span className="jy-st-ico">🧭</span><b>{completedCount} / {rows.length}</b><small>Thành phố đã khám phá</small></div>
            <div><span className="jy-st-ico">⭐</span><b>{cultureCount}</b><small>Văn hóa đặc sắc</small></div>
            <div><span className="jy-st-ico">🗺️</span><b>∞</b><small>Kiến thức cho bạn</small></div>
          </div>

          <button type="button" className="jy-hero-cta" onClick={() => activeRow && openCity(activeRow)}>
            Tiếp tục hành trình <span aria-hidden>→</span>
          </button>
        </div>

        {/* Bản đồ 3D giữ nguyên (JapanMap3D) */}
        <div className="jy-hero-map">
          <JapanMap3D
            night={atmosphere === "NIGHT"}
            activeIndex={activeIdx}
            onSelect={(i) => openCity(rows[i])}
            pins={rows.map((r, i): MapPin => ({
              id: r.location.id,
              slug: r.location.slug,
              name: r.location.name,
              tone: tones[i],
              icon: <PinThumb slug={r.location.slug} tone={tones[i]} />,
              sub: tones[i] === "locked" ? `${r.location.requirementXp} XP` : r.location.nameJa,
            }))}
          >
            {null}
          </JapanMap3D>
        </div>

        <aside className="jy-hero-tip">
          <span className="jy-tip-ico">🏯</span>
          <div>
            <strong>Khám phá văn hoá Nhật Bản</strong>
            <p>Mỗi thành phố là một câu chuyện, một nền văn hoá và những bài học tiếng Nhật thú vị.</p>
          </div>
          <span aria-hidden className="jy-tip-arrow">›</span>
        </aside>
      </section>

      {/* ============ LỘ TRÌNH SHINKANSEN ============ */}
      <section className="jy-section">
        <header className="jy-section-head">
          <div className="jy-section-title">
            <span className="jy-section-ico">🚅</span>
            <div>
              <h3>Lộ Trình Tuyến Shinkansen Du Lịch</h3>
              <p>Bấm vào bất kỳ thành phố nào để khám phá không gian văn hóa, món ăn đặc sản và đóng dấu lưu niệm Eki-stamp!</p>
            </div>
          </div>
          <ShinkansenArt />
        </header>

        <div className="jy-features-grid jy-city-grid">
          {rows.map((row, idx) => {
            const loc = row.location;
            const details = CITY_DETAILS[loc.slug] || CITY_DETAILS.tokyo;
            const status = row.progress?.status ?? "LOCKED";
            const isCompleted = status === "COMPLETED";
            const isInProgress = status === "IN_PROGRESS";
            const isLocked = !row.unlockable && !isCompleted && !isInProgress;
            const isStamped = stampedCities.has(loc.slug) || isCompleted;
            const progressPct = isCompleted ? 100 : (cityProgressMap[loc.id] ?? row.progress?.progress ?? 0);

            if (isLocked) {
              return (
                <button type="button" key={loc.id} onClick={() => openCity(row)} className="jy-card jy-city is-locked">
                  <CityImage slug={loc.slug} fallback={details.landmarkImage} className="jy-city-bg" />
                  <span className="jy-chip jy-chip-step">Chặng #{idx + 1}</span>
                  <div className="jy-lock">
                    <span className="jy-lock-ico">🔒</span>
                    <h4>{loc.name} <span className="jp-text">{loc.nameJa}</span></h4>
                    <strong>Chưa mở khóa</strong>
                    <p>Hoàn thành các thành phố trước để tiếp tục hành trình. Cần {loc.requirementXp} XP.</p>
                  </div>
                </button>
              );
            }

            return (
              <article
                key={loc.id}
                onClick={() => openCity(row)}
                className={`jy-card jy-city ${isCompleted ? "is-done" : isInProgress ? "is-live" : ""}`}
              >
                <div className="jy-city-media">
                  <CityImage slug={loc.slug} fallback={details.landmarkImage} />
                  <span className="jy-chip jy-chip-step">Chặng #{idx + 1}</span>
                  {isCompleted ? (
                    <span className="jy-chip jy-chip-done">✓ Đã khám phá</span>
                  ) : isInProgress ? (
                    <span className="jy-chip jy-chip-live">Đang đi ngay!</span>
                  ) : null}
                </div>

                <div className="jy-city-body">
                  <div className="jy-city-id">
                    <span className="jy-city-ico">{details.landmark3D}</span>
                    <div>
                      <h4>{loc.name} <span className="jp-text">{loc.nameJa}</span></h4>
                      <small>{details.highlights[0]}</small>
                    </div>
                  </div>
                  <p className="jy-city-desc">{loc.description}</p>

                  <div className="jy-prog">
                    <div className="jy-prog-row">
                      <span>Tiến độ khám phá</span>
                      <b className={progressPct >= 100 ? "is-full" : ""}>{progressPct}%</b>
                    </div>
                    <div className="jy-prog-bar"><i style={{ width: `${progressPct}%` }} /></div>
                  </div>

                  <div className="jy-city-foot">
                    <span className="jy-xp">⭐ +{loc.xpReward} XP</span>
                    <span className="jy-go">Khám phá {loc.name} →</span>
                  </div>
                </div>

                {isStamped && <div className="jy-stamp">{details.stampJa}</div>}
              </article>
            );
          })}
        </div>
      </section>

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

      {/* ============ HUY HIỆU ============ */}
      <section className="jy-section jy-ach">
        <header className="jy-section-head">
          <div className="jy-section-title">
            <span className="jy-section-ico">🏆</span>
            <h3>Huy Hiệu Thành Tựu Khám Phá ({achievements.length})</h3>
          </div>
          <button type="button" className="jy-ach-all" onClick={() => router.push(ACHIEVEMENTS_HREF)}>
            Xem tất cả huy hiệu →
          </button>
        </header>

        <div className="jy-ach-wrap">
          {achievements.length > 0 ? (
            <div className="jy-ach-grid">
              {achievements.map((ach) => (
                <Card key={ach.id} className="jy-ach-card">
                  <span className="jy-ach-ico">{achIcon(ach.achievement.icon)}</span>
                  <div>
                    <h4>{ach.achievement.title}</h4>
                    <p>{ach.achievement.description}</p>
                    <b>★ +{ach.achievement.xpReward} XP</b>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="jy-ach-empty">
              Chưa mở khóa thành tựu nào. Hãy hoàn thành các chặng Shinkansen để sưu tầm huy hiệu!
            </div>
          )}

          <div className="jy-mascot">
            <p className="jy-bubble">Khám phá thêm nhiều thành phố để nhận huy hiệu đặc biệt nhé!</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${IMG_BASE}/mascot.png`} alt="" onError={(e) => (e.currentTarget.style.display = "none")} />
          </div>
        </div>
      </section>
    </div>
  );
}