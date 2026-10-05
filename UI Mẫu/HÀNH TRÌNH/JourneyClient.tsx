"use client";

import "./journey.css";
import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";
import { Japanese3DRoom } from "@/components/Japanese3DRoom";
import { JapanHeroScene, JapanMapArt, JAPAN_MAP_SLOTS } from "@/components/JapanIllustration";
import { CITY_DETAILS, getJourneyMeta, type CityGourmet } from "./cityData";

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

type Tone = "done" | "open" | "next" | "locked";
type TabId = "overview" | "culture" | "food" | "mission" | "stamp";

const fmt = (n: number) => n.toLocaleString("en-US");
const detailsOf = (slug: string): CityGourmet => CITY_DETAILS[slug] || CITY_DETAILS.tokyo;
const photoOf = (d: CityGourmet) => d.scenicPhotos?.[0]?.url || d.landmarkImage;

// ======================== ICONS ========================
function Icon({ name, size = 16 }: { name: "lock" | "torii" | "check" | "flame" | "arrow" | "stamp" | "temple" | "bowl" | "pin" | "map" | "star" | "mask"; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (name) {
    case "lock":
      return <svg {...common}><rect x="5" y="11" width="14" height="9" rx="2" fill="currentColor" stroke="none" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>;
    case "torii":
      return <svg {...common}><path d="M2.5 5.5C8 7 16 7 21.5 5.5M5 10h14M7 7v13M17 7v13" /></svg>;
    case "check":
      return <svg {...common} strokeWidth={3}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
    case "flame":
      return <svg {...common} fill="currentColor" stroke="none"><path d="M12 2c1 3.5 5 5.5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 .3 1.3 1 2 2 2-.5-3 .5-5 1-8z" /></svg>;
    case "arrow":
      return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "stamp":
      return <svg {...common}><rect x="4" y="3" width="16" height="18" rx="2.5" /><rect x="8" y="7" width="8" height="8" rx="1.5" /><path d="M8 18h8" /></svg>;
    case "temple":
      return <svg {...common}><path d="M12 3l3 3H9zM6 9l6-3 6 3M4 13l8-4 8 4M5 13v7h14v-7M10 20v-4h4v4" /></svg>;
    case "bowl":
      return <svg {...common}><path d="M3 12h18a9 9 0 01-18 0zM8 8c0-2 1.5-2 1.5-4M13 8c0-2 1.5-2 1.5-4M9 21h6" /></svg>;
    case "pin":
      return <svg {...common}><path d="M12 21s7-6.2 7-11.5a7 7 0 10-14 0C5 14.800 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.4" /></svg>;
    case "map":
      return <svg {...common}><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14" /></svg>;
    case "star":
      return <svg {...common}><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.500l6.100-.9z" /></svg>;
    case "mask":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
  }
}

function Shinkansen() {
  return (
    <svg className="jy-train" viewBox="0 0 150 30" aria-hidden="true">
      <path d="M4 22C4 12 10 8 22 8h96c18 0 28 6 30 14z" fill="#fff" stroke="#d6dbe0" strokeWidth="1" />
      <path d="M118 8c18 0 28 6 30 14h-18c-4-6-8-10-12-14z" fill="#e7ecf0" />
      <rect x="8" y="17" width="136" height="3" fill="#d43128" />
      {[18, 36, 54, 72, 90, 108].map((x) => (
        <rect key={x} x={x} y="11" width="10" height="4" rx="1" fill="#2a5aa8" />
      ))}
    </svg>
  );
}

function PassportStamp({ kanji, name, stamped }: { kanji: string; name: string; stamped: boolean }) {
  return (
    <div className={`jy-stamp ${stamped ? "is-stamped" : ""}`}>
      <div className="jy-stamp-inner">
        <small>Nihon Quest</small>
        <small className="sub">PASSPORT STAMP</small>
        <svg viewBox="0 0 64 80" className="jy-stamp-art" aria-hidden="true">
          <g fill="#d45a52">
            <path d="M32 4l4 6H28zM14 20l18-8 18 8-4 4H18zM18 34l14-6 14 6-3 4H21zM12 52l20-8 20 8-4 5H16zM22 60h20v14H22z" />
          </g>
          <path d="M6 74c10-6 18-6 26-2 8-4 16-4 26 2" stroke="#d45a52" strokeWidth="2" fill="none" />
        </svg>
        <b className="jp-text">{kanji}</b>
        <span>{name.toUpperCase()}</span>
      </div>
    </div>
  );
}

// ======================== MAIN ========================
export function JourneyClient({
  rows,
  achievements,
  totalXP,
}: {
  rows: RowItem[];
  achievements: AchievementItem[];
  totalXP: number;
}) {
  const router = useRouter();
  const { playClick, playCorrect, playFanfare, showToast } = useSoundAndTheme();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>("overview");
  const [selectedCity, setSelectedCity] = useState<{ row: RowItem; details: CityGourmet } | null>(null);
  const [stampedCities, setStampedCities] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    rows.forEach((r) => {
      if (r.progress?.isStamped) initial.add(r.location.slug);
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

  // ---------- actions (giữ nguyên logic cũ) ----------
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

  // ---------- derived ----------
  const visible = rows.slice(0, 5);
  const completedCount = rows.filter((r) => r.progress?.status === "COMPLETED").length;

  const tones: Tone[] = (() => {
    let nextSeen = false;
    return visible.map((r): Tone => {
      const s = r.progress?.status ?? "LOCKED";
      if (s === "COMPLETED") return "done";
      if (s !== "LOCKED") return "open";
      if (!nextSeen) {
        nextSeen = true;
        return "next";
      }
      return "locked";
    });
  })();
  const reached = tones.filter((t) => t === "done" || t === "open").length;

  const byIdIndex = visible.findIndex((r) => r.location.id === activeId);
  const defaultIndex = tones.indexOf("next") >= 0 ? tones.indexOf("next") : tones.lastIndexOf("open") >= 0 ? tones.lastIndexOf("open") : visible.length - 1;
  const activeIndex = byIdIndex >= 0 ? byIdIndex : defaultIndex;

  const accessible = (i: number) => tones[i] === "done" || tones[i] === "open" || (tones[i] === "next" && visible[i].unlockable);

  const openRoom = (row: RowItem) => setSelectedCity({ row, details: detailsOf(row.location.slug) });

  const select = (i: number) => {
    playClick();
    setActiveId(visible[i].location.id);
    setTab("overview");
  };

  const scrollToRoute = () => {
    playClick();
    document.getElementById("journey-route")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const continueJourney = () => {
    playClick();
    const openIdx = tones.lastIndexOf("open");
    if (openIdx >= 0) {
      setActiveId(visible[openIdx].location.id);
      openRoom(visible[openIdx]);
    } else if (tones.indexOf("next") >= 0) {
      select(tones.indexOf("next"));
    } else {
      scrollToRoute();
    }
  };

  if (visible.length === 0) {
    return (
      <div className="jy-root">
        <div className="jy-empty">Chưa có điểm đến nào trong hành trình.</div>
      </div>
    );
  }

  const row = visible[activeIndex];
  const tone = tones[activeIndex];
  const loc = row.location;
  const details = detailsOf(loc.slug);
  const meta = getJourneyMeta(loc.slug);
  const stamped = stampedCities.has(loc.slug);
  const lessonPct = tone === "done" ? 100 : cityProgressMap[loc.id] ?? row.progress?.progress ?? 0;
  const xpPct = loc.requirementXp > 0 ? Math.min(100, Math.round((totalXP / loc.requirementXp) * 100)) : 100;
  const xpRemain = Math.max(0, loc.requirementXp - totalXP);
  const isLockedTone = tone === "next" || tone === "locked";
  const barPct = isLockedTone ? xpPct : lessonPct;
  const pad = (n: number) => String(n).padStart(2, "0");

  const tabs: Array<{ id: TabId; label: string; icon: ReactNode }> = [
    { id: "overview", label: "Tổng quan", icon: <Icon name="temple" size={14} /> },
    { id: "culture", label: "Văn hóa", icon: <Icon name="mask" size={14} /> },
    { id: "food", label: "Ẩm thực", icon: <Icon name="bowl" size={14} /> },
    { id: "mission", label: "Nhiệm vụ", icon: <Icon name="star" size={14} /> },
    { id: "stamp", label: "Tem du lịch", icon: <Icon name="stamp" size={14} /> },
  ];

  return (
    <div className="jy-root">
      <div className="jy-vertical-tag jp-text" aria-hidden="true">日本への旅</div>

      <div className="jy-main">
        {/* ================= HERO + MAP ================= */}
        <section className="jy-hero" data-intro>
          <JapanHeroScene />
          <div className="jy-hero-copy">
            <div className="jy-eyebrow"><i /> HÀNH TRÌNH KHÁM PHÁ</div>
            <h1>
              Hành trình
              <em>Nhật Bản.</em>
            </h1>
            <p>Học một ngôn ngữ. Khám phá một nền văn hóa. Mỗi bài học là một bước chân đưa bạn gần hơn tới những vùng đất tuyệt đẹp của Nhật Bản.</p>
            <div className="jy-hero-actions">
              <button type="button" className="jy-btn is-red" onClick={continueJourney}>
                Tiếp tục hành trình <Icon name="arrow" size={14} />
              </button>
              <button type="button" className="jy-btn is-white" onClick={scrollToRoute}>
                Xem toàn bộ lộ trình
              </button>
            </div>
            <dl className="jy-hero-stats">
              <div><dt>{rows.length}</dt><dd>Điểm đến</dd></div>
              <div><dt>{completedCount}</dt><dd>Đã khám phá</dd></div>
              <div><dt>{fmt(rows.reduce((sum, r) => sum + r.location.xpReward, 0))}</dt><dd>XP hành trình</dd></div>
            </dl>
          </div>

          <div className="jy-map" data-parallax>
            <JapanMapArt reached={reached} />
            {visible.map((r, i) => {
              const slot = JAPAN_MAP_SLOTS[i];
              const t = tones[i];
              const isActive = i === activeIndex;
              return (
                <button
                  type="button"
                  key={r.location.id}
                  className={`jy-pin is-${t} ${isActive ? "is-selected" : ""}`}
                  style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                  onClick={() => select(i)}
                  aria-label={`${r.location.name} - ${t === "done" ? "đã khám phá" : `${fmt(r.location.requirementXp)} XP`}`}
                >
                  {isActive && <span className="jy-pin-marker"><Icon name="pin" size={16} /></span>}
                  <span className="jy-pin-icon">
                    <Icon name={t === "done" || t === "open" ? "torii" : "lock"} size={t === "done" || t === "open" ? 18 : 14} />
                  </span>
                  <span className="jy-pin-text">
                    <strong>{r.location.name}</strong>
                    <small>
                      {t === "done" ? "Đã khám phá" : t === "open" ? "Đang học" : `${fmt(r.location.requirementXp)} XP`}
                    </small>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ================= ROUTE ================= */}
        <section id="journey-route" className="jy-route" data-reveal>
          <div className="jy-route-kicker"><i /> LỘ TRÌNH HÀNH TRÌNH</div>
          <h2>Từ {visible[0].location.name} đến những chân trời mới.</h2>
          <p>Khám phá {visible.length} điểm đến biểu tượng của Nhật Bản qua hành trình học tập.</p>

          <div className="jy-stations">
            <span className="jy-stations-line" aria-hidden="true" />
            {visible.length >= 3 && <Shinkansen />}
            {visible.map((r, i) => {
              const t = tones[i];
              const d = detailsOf(r.location.slug);
              const img = d.landmarkImage || photoOf(d);
              const isActive = i === activeIndex;
              return (
                <div key={r.location.id} className={`jy-station is-${t} ${isActive ? "is-selected" : ""}`}>
                  <button type="button" className="jy-disc" onClick={() => select(i)} aria-label={`Chọn ${r.location.name}`}>
                    <span className="jy-disc-img" style={{ backgroundImage: img ? `url(${img})` : undefined }}>
                      {!img && <span className="jy-disc-emoji">{d.landmark3D}</span>}
                    </span>
                    {t === "done" && <span className="jy-disc-check"><Icon name="check" size={11} /></span>}
                    {(t === "next" || t === "locked") && (
                      <span className="jy-disc-lock"><Icon name="lock" size={20} /></span>
                    )}
                  </button>
                  <b>{r.location.name}</b>
                  <span className="jp-text jy-station-ja">{r.location.nameJa}</span>
                  <span className={`jy-chip is-${t}`}>
                    {t === "done" && <><Icon name="check" size={10} /> Hoàn thành</>}
                    {t === "open" && <><Icon name="check" size={10} /> Đã mở khóa</>}
                    {t === "next" && <><i /> Sắp mở khóa</>}
                    {t === "locked" && <><Icon name="lock" size={10} /> {fmt(r.location.requirementXp)} XP</>}
                  </span>
                  <small>+{fmt(r.location.xpReward)} XP thưởng</small>
                  <button
                    type="button"
                    className={`jy-station-btn is-${t}`}
                    onClick={() => {
                      if (t === "locked") return select(i);
                      select(i);
                      if (accessible(i)) openRoom(r);
                    }}
                  >
                    {t === "done" && <>Xem lại <Icon name="arrow" size={11} /></>}
                    {t === "open" && <>Tiếp tục <Icon name="arrow" size={11} /></>}
                    {t === "next" && <><Icon name="flame" size={12} /> {fmt(r.location.requirementXp)} XP</>}
                    {t === "locked" && <>Sắp mở khóa</>}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= DETAIL PANEL ================= */}
        <aside className="jy-detail" data-intro>
          <div className="jy-detail-head">
            <span className="jy-kicker"><i /> {tone === "done" || tone === "open" ? "ĐIỂM ĐẾN HIỆN TẠI" : "ĐIỂM ĐẾN TIẾP THEO"}</span>
            <span className="jy-count">{pad(activeIndex + 1)} / {pad(visible.length)}</span>
          </div>

          <div className="jy-detail-hero" style={{ backgroundImage: photoOf(details) ? `url(${photoOf(details)})` : undefined }}>
            <div className="jy-detail-fade" />
            <div className="jy-detail-title">
              <h2>{loc.name}</h2>
              <span className="jp-text jy-title-ja">{loc.nameJa}</span>
              <p>{loc.description}</p>
            </div>
            <span className={`jy-lockchip is-${tone}`}>
              {isLockedTone ? (
                <><Icon name="lock" size={12} /> {fmt(loc.requirementXp)} XP để mở khóa</>
              ) : tone === "done" ? (
                <><Icon name="check" size={12} /> Đã hoàn thành</>
              ) : (
                <><Icon name="flame" size={12} /> Đang khám phá</>
              )}
            </span>
            <div className="jy-hero-vertical jp-text" aria-hidden="true">
              {meta.kana && <small>{meta.kana}</small>}
              <b>{loc.nameJa}</b>
            </div>
          </div>

          <div className="jy-tabs" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={tab === t.id ? "is-active" : ""}
                onClick={() => {
                  playClick();
                  setTab(t.id);
                }}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          <div className="jy-tab-body">
            {tab === "overview" && (
              <div className="jy-overview">
                <div className="jy-overview-info">
                  <p>{details.funFact || loc.description}</p>
                  <ul>
                    <li><span className="jy-info-ico"><Icon name="map" size={13} /></span><b>Vùng</b><em>{meta.region}</em></li>
                    <li><span className="jy-info-ico"><Icon name="torii" size={13} /></span><b>Nổi tiếng với</b><em>{details.highlights.slice(0, 3).join(", ")}</em></li>
                    <li><span className="jy-info-ico"><Icon name="star" size={13} /></span><b>Mùa đẹp nhất</b><em>{meta.season}</em></li>
                  </ul>
                </div>
                <div className="jy-overview-stamp">
                  <h4>Thẻ điểm đến</h4>
                  <PassportStamp kanji={loc.nameJa} name={loc.name} stamped={stamped} />
                </div>
              </div>
            )}

            {tab === "culture" && (
              <ul className="jy-list">
                {details.culturalFacts.slice(0, 4).map((f) => (
                  <li key={f.label}>
                    <span className="jy-list-ico">{f.icon}</span>
                    <div><b>{f.label}</b><p>{f.value}</p></div>
                  </li>
                ))}
              </ul>
            )}

            {tab === "food" && (
              <ul className="jy-list">
                {details.delicacies.slice(0, 3).map((f) => (
                  <li key={f.name}>
                    <span className="jy-list-ico">{f.icon}</span>
                    <div><b>{f.name} <span className="jp-text">{f.nameJa}</span></b><p>{f.taste}</p></div>
                  </li>
                ))}
              </ul>
            )}

            {tab === "mission" && (
              <ol className="jy-mission">
                <li className={totalXP >= loc.requirementXp ? "is-done" : ""}>
                  <i>{totalXP >= loc.requirementXp ? <Icon name="check" size={12} /> : "1"}</i>
                  Đạt {fmt(loc.requirementXp)} XP để mở khóa điểm đến.
                </li>
                <li className={tone === "done" ? "is-done" : ""}>
                  <i>{tone === "done" ? <Icon name="check" size={12} /> : "2"}</i>
                  Hoàn thành các bài học và khám phá không gian {loc.name}.
                </li>
                <li className={stamped ? "is-done" : ""}>
                  <i>{stamped ? <Icon name="check" size={12} /> : "3"}</i>
                  Đóng dấu du lịch và nhận +{fmt(loc.xpReward)} XP thưởng.
                </li>
              </ol>
            )}

            {tab === "stamp" && (
              <div className="jy-stamp-tab">
                <PassportStamp kanji={loc.nameJa} name={loc.name} stamped={stamped} />
                <div>
                  <b className="jp-text">{details.stampJa}</b>
                  <p>{stamped ? "Con dấu đã được lưu vào hộ chiếu Nihon Quest của bạn." : "Hoàn thành điểm đến để đóng dấu vào hộ chiếu Nihon Quest."}</p>
                  {tone === "done" && !stamped && (
                    <button type="button" className="jy-btn is-red is-sm" onClick={() => handleStampEki(loc.id, loc.slug, loc.name)}>
                      Đóng dấu ngay
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="jy-progress">
            <div className="jy-progress-head">
              <span><i /> {isLockedTone ? `TIẾN ĐỘ MỞ KHÓA ${loc.name.toUpperCase()}` : `TIẾN ĐỘ KHÁM PHÁ ${loc.name.toUpperCase()}`}</span>
              <b>{isLockedTone ? `${fmt(Math.min(totalXP, loc.requirementXp))} / ${fmt(loc.requirementXp)} XP` : `${barPct}%`}</b>
            </div>
            {isLockedTone && <div className="jy-progress-pct">{barPct}%</div>}
            <div className="jy-bar"><span style={{ width: `${barPct}%` }} /></div>

            <div className="jy-progress-note">
              <span className="jy-note-ico"><Icon name={isLockedTone ? "lock" : "check"} size={16} /></span>
              <p>
                {tone === "done"
                  ? "Bạn đã chinh phục điểm đến này. Hãy đóng dấu và ôn lại những điều đã học!"
                  : isLockedTone
                  ? xpRemain > 0
                    ? `Hoàn thành thêm ${fmt(xpRemain)} XP để mở khóa điểm đến này. Tiếp tục học và chinh phục các bài học!`
                    : "Bạn đã đủ XP! Nhấn mở khóa để bắt đầu hành trình tới đây."
                  : `Điểm đến đã mở khóa. Hoàn thành các bài học để nhận +${fmt(loc.xpReward)} XP.`}
              </p>
            </div>

            <div className="jy-progress-cta">
              {tone === "next" && row.unlockable ? (
                <button type="button" className="jy-btn is-outline" disabled={loadingId === loc.id} onClick={() => handleAction(loc.id, "unlock", loc.name)}>
                  Mở khóa ngay <Icon name="arrow" size={13} />
                </button>
              ) : tone === "done" || tone === "open" ? (
                <button type="button" className="jy-btn is-outline" onClick={() => { playClick(); openRoom(row); }}>
                  Mở không gian khám phá <Icon name="arrow" size={13} />
                </button>
              ) : (
                <button type="button" className="jy-btn is-outline" onClick={() => { playClick(); router.push("/app/practice"); }}>
                  Xem các bài học liên quan <Icon name="arrow" size={13} />
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* ================= FEATURES ================= */}
      <section className="jy-features" data-reveal>
        {[
          { icon: "stamp" as const, title: "Thu thập tem du lịch", body: "Mở khóa mỗi điểm đến và nhận tem vào hộ chiếu Nihon Quest của bạn." },
          { icon: "temple" as const, title: "Khám phá văn hóa", body: "Tìm hiểu những phong tục, lễ hội và câu chuyện đặc sắc của từng vùng đất." },
          { icon: "bowl" as const, title: "Thưởng thức ẩm thực", body: "Khám phá các món ăn nổi tiếng và từ vựng liên quan đến ẩm thực Nhật Bản." },
          { icon: "torii" as const, title: "Hoàn thành thử thách", body: "Vượt qua các bài học và nhiệm vụ để mở khóa điểm đến tiếp theo." },
        ].map((f) => (
          <div key={f.title} className="jy-feature">
            <span className="jy-feature-ico"><Icon name={f.icon} size={26} /></span>
            <div><b>{f.title}</b><p>{f.body}</p></div>
          </div>
        ))}
      </section>

      {achievements.length > 0 && (
        <section className="jy-achievements" data-reveal>
          <div className="jy-achievements-head">
            <h2>Huy hiệu hành trình</h2>
            <span>{achievements.length} thành tựu</span>
          </div>
          <div className="jy-achievements-grid">
            {achievements.map((ach) => (
              <div key={ach.id} className="jy-feature is-compact">
                <span className="jy-feature-ico">🏅</span>
                <div><b>{ach.achievement.title}</b><p>{ach.achievement.description}</p></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= 3D ROOM (giữ nguyên) ================= */}
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
              const s = r.progress?.status ?? "LOCKED";
              return s === "COMPLETED" || s === "IN_PROGRESS" || r.unlockable;
            })
            .map((r) => {
              const d = detailsOf(r.location.slug);
              return { slug: r.location.slug, name: r.location.name, nameJa: r.location.nameJa, landmark3D: d.landmark3D };
            })}
          onSelectCity={(citySlug) => {
            const foundRow = rows.find((r) => r.location.slug === citySlug);
            if (!foundRow) return;
            const s = foundRow.progress?.status ?? "LOCKED";
            const ok = s === "COMPLETED" || s === "IN_PROGRESS" || foundRow.unlockable;
            if (!ok) return;
            setSelectedCity({ row: foundRow, details: detailsOf(citySlug) });
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
            setCityProgressMap((prev) => ({ ...prev, [selectedCity.row.location.id]: newPercent }));
          }}
        />
      )}
    </div>
  );
}
