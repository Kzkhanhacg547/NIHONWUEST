"use client";

import { useState } from "react";
import Link from "next/link";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";

export interface DbAchievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  requirement: string;
}

export interface DbUserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
  achievement?: DbAchievement;
}

interface MasterBadge {
  key: string;
  title: string;
  description: string;
  category: "JOURNEY" | "LEARNING" | "CHALLENGE" | "SPECIAL";
  categoryLabel: string;
  icon: string;
  xpReward: number;
  requirementHint: string;
  actionHref?: string;
  actionLabel?: string;
}

interface DisplayBadge extends MasterBadge {
  isUnlocked: boolean;
  unlockedAt: string | null;
}

const MASTER_BADGES: MasterBadge[] = [
  {
    key: "first-steps",
    title: "First Steps",
    description: "Hoàn tất bước khởi đầu onboarding và sẵn sàng chinh phục tiếng Nhật.",
    category: "LEARNING",
    categoryLabel: "Bài học & Kỹ năng",
    icon: "👟",
    xpReward: 20,
    requirementHint: "Hoàn thành quy trình nhập môn (Onboarding).",
    actionHref: "/app/practice",
    actionLabel: "Đến Bài Học",
  },
  {
    key: "kana-starter",
    title: "Kana Starter",
    description: "Học thuộc 5 ký tự Hiragana / Katakana đầu tiên.",
    category: "LEARNING",
    categoryLabel: "Bài học & Kỹ năng",
    icon: "あ",
    xpReward: 30,
    requirementHint: "Luyện tập và làm chủ 5 ký tự Bảng chữ cái.",
    actionHref: "/app/learn",
    actionLabel: "Vào Kana Lab",
  },
  {
    key: "lesson-complete-1",
    title: "Lesson Master",
    description: "Hoàn thành bài học đầu tiên trong chương trình Nihon Quest.",
    category: "LEARNING",
    categoryLabel: "Bài học & Kỹ năng",
    icon: "📖",
    xpReward: 40,
    requirementHint: "Hoàn thành 1 bài học bất kỳ trong phần Bài Học.",
    actionHref: "/app/practice",
    actionLabel: "Học Bài Đầu Tiên",
  },
  {
    key: "xp-500",
    title: "Rising Explorer",
    description: "Đạt mốc 500 tổng điểm kinh nghiệm XP tích lũy.",
    category: "CHALLENGE",
    categoryLabel: "Thách thức & XP",
    icon: "⭐",
    xpReward: 50,
    requirementHint: "Tích lũy tối thiểu 500 XP từ các hoạt động học tập.",
    actionHref: "/app/journey",
    actionLabel: "Khám Phá Bản Đồ",
  },
  {
    key: "tokyo-unlocked",
    title: "Tokyo Explorer",
    description: "Hoàn thành đóng dấu chặng dừng chân đầu tiên tại thủ đô Tokyo.",
    category: "JOURNEY",
    categoryLabel: "Hành trình Shinkansen",
    icon: "⛩️",
    xpReward: 50,
    requirementHint: "Khám phá và vượt qua thử thách tại trạm Tokyo.",
    actionHref: "/app/journey",
    actionLabel: "Xem Bản Đồ Shinkansen",
  },
  {
    key: "kyoto-temple",
    title: "Kyoto Pilgrim",
    description: "Khám phá cố đô Kyoto trầm mặc với hàng ngàn ngôi chùa thiền tông.",
    category: "JOURNEY",
    categoryLabel: "Hành trình Shinkansen",
    icon: "⛩️",
    xpReward: 60,
    requirementHint: "Đạt 180 XP và hoàn thành chặng Kyoto.",
    actionHref: "/app/journey",
    actionLabel: "Đến Kyoto",
  },
  {
    key: "nara-deer",
    title: "Nara Friend",
    description: "Khám phá di sản cố đô Nara và giao lưu cùng những chú hươu thiêng.",
    category: "JOURNEY",
    categoryLabel: "Hành trình Shinkansen",
    icon: "🦌",
    xpReward: 60,
    requirementHint: "Đạt 380 XP và hoàn thành chặng Nara.",
    actionHref: "/app/journey",
    actionLabel: "Đến Nara",
  },
  {
    key: "osaka-foodie",
    title: "Osaka Gourmet",
    description: "Thưởng thức ẩm thực đường phố Takoyaki rực rỡ tại nhà bếp quốc dân Osaka.",
    category: "JOURNEY",
    categoryLabel: "Hành trình Shinkansen",
    icon: "🍡",
    xpReward: 70,
    requirementHint: "Mở khóa chặng Osaka trên bản đồ Shinkansen.",
    actionHref: "/app/journey",
    actionLabel: "Đến Osaka",
  },
  {
    key: "fuji-conqueror",
    title: "Fuji Conqueror",
    description: "Chiêm ngưỡng đỉnh thiêng núi Phú Sĩ soi bóng bên hồ Ashi.",
    category: "JOURNEY",
    categoryLabel: "Hành trình Shinkansen",
    icon: "🗻",
    xpReward: 80,
    requirementHint: "Mở khóa chặng Fuji & Hakone trên hành trình.",
    actionHref: "/app/journey",
    actionLabel: "Đến Núi Phú Sĩ",
  },
  {
    key: "all-japan",
    title: "Nihon Master",
    description: "Chinh phục toàn bộ các địa danh nổi tiếng trên bản đồ Nhật Bản.",
    category: "JOURNEY",
    categoryLabel: "Hành trình Shinkansen",
    icon: "👑",
    xpReward: 150,
    requirementHint: "Hoàn thành tất cả 9 địa danh Shinkansen.",
    actionHref: "/app/journey",
    actionLabel: "Trở Thành Huyền Thoại",
  },
  {
    key: "streak-7",
    title: "Streak Warrior",
    description: "Duy trì chuỗi ngày học tập liên tục trong 7 ngày.",
    category: "CHALLENGE",
    categoryLabel: "Thách thức & XP",
    icon: "🔥",
    xpReward: 50,
    requirementHint: "Học tập mỗi ngày liên tiếp không ngắt quãng trong 7 ngày.",
    actionHref: "/app/stats",
    actionLabel: "Xem Chuỗi Streak",
  },
  {
    key: "sensei-chat",
    title: "Sensei Companion",
    description: "Trò chuyện và thực hành giao tiếp tiếng Nhật cùng AI Sensei.",
    category: "SPECIAL",
    categoryLabel: "Đặc biệt & Giao tiếp",
    icon: "🗣️",
    xpReward: 40,
    requirementHint: "Hoàn thành 1 lượt đàm thoại Kaiwa cùng AI Sensei.",
    actionHref: "/app/sensei",
    actionLabel: "Trò Chuyện Với Sensei",
  },
  {
    key: "survival-survivor",
    title: "Survival Legend",
    description: "Vượt qua thử thách sinh tồn giao tiếp trong Survival Mode.",
    category: "SPECIAL",
    categoryLabel: "Đặc biệt & Giao tiếp",
    icon: "🍱",
    xpReward: 60,
    requirementHint: "Hoàn thành 1 màn sinh tồn thực chiến thành công.",
    actionHref: "/app/survival",
    actionLabel: "Vào Survival Mode",
  },
  {
    key: "test-champion",
    title: "Test Champion",
    description: "Hoàn thành bài kiểm tra năng lực tiếng Nhật JLPT.",
    category: "SPECIAL",
    categoryLabel: "Đặc biệt & Giao tiếp",
    icon: "★",
    xpReward: 50,
    requirementHint: "Hoàn thành 1 bài test năng lực tại trang Kiểm tra.",
    actionHref: "/app/test",
    actionLabel: "Làm Bài Kiểm Tra",
  },
];

interface AchievementsClientProps {
  dbAll: DbAchievement[];
  dbOwned: DbUserAchievement[];
  totalXP: number;
  currentStreak: number;
}

export function AchievementsClient({
  dbAll,
  dbOwned: initialOwned,
  totalXP,
  currentStreak,
}: AchievementsClientProps) {
  const { playClick, playCorrect, showToast } = useSoundAndTheme();

  const [ownedList, setOwnedList] = useState<DbUserAchievement[]>(initialOwned);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<DisplayBadge | null>(null);
  const [activeTab, setActiveTab] = useState<"ALL" | "UNLOCKED" | "LOCKED">("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Map owned achievements by key for fast lookup
  const ownedKeyMap = new Map<string, DbUserAchievement>();
  ownedList.forEach((ua) => {
    const key = ua.achievement?.key;
    if (key) ownedKeyMap.set(key, ua);
  });

  // Sync and Evaluate Achievements via API
  const handleSyncAchievements = async () => {
    playClick();
    setIsSyncing(true);
    try {
      const res = await fetch("/api/achievements", { method: "POST" });
      const data = await res.json();

      // Refetch current list
      const freshRes = await fetch("/api/achievements");
      if (freshRes.ok) {
        const freshData = await freshRes.json();
        setOwnedList(freshData.owned || []);
      }

      if (data.unlocked && data.unlocked.length > 0) {
        playCorrect();
        showToast({
          title: `🎉 Chúc mừng! Bạn mở khóa ${data.unlocked.length} huy hiệu mới!`,
          type: "success",
        });
      } else {
        showToast({
          title: "Đã đồng bộ huy hiệu. Chưa có huy hiệu mới nào được mở thêm.",
          type: "info",
        });
      }
    } catch {
      showToast({ title: "Lỗi kết nối khi đồng bộ huy hiệu.", type: "error" });
    } finally {
      setIsSyncing(false);
    }
  };

  // Combine master badge list with db achievements
  const allDisplayBadges: DisplayBadge[] = MASTER_BADGES.map((b) => {
    const ownedInfo = ownedKeyMap.get(b.key);
    return {
      ...b,
      isUnlocked: !!ownedInfo,
      unlockedAt: ownedInfo?.unlockedAt ? new Date(ownedInfo.unlockedAt).toLocaleDateString("vi-VN") : null,
    };
  });

  // Filtering
  const filteredBadges = allDisplayBadges.filter((b) => {
    // Tab filter
    if (activeTab === "UNLOCKED" && !b.isUnlocked) return false;
    if (activeTab === "LOCKED" && b.isUnlocked) return false;

    // Category filter
    if (selectedCategory !== "ALL" && b.category !== selectedCategory) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.categoryLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unlockedCount = allDisplayBadges.filter((b) => b.isUnlocked).length;
  const totalBadgesCount = allDisplayBadges.length;
  const progressPercent = Math.round((unlockedCount / totalBadgesCount) * 100);
  const totalEarnedXP = allDisplayBadges
    .filter((b) => b.isUnlocked)
    .reduce((sum, b) => sum + b.xpReward, 0);

  return (
    <div className="space-y-8">
      {/* STAT CARDS HEADER */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* CARD 1: UNLOCKED COUNT */}
        <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-sumi-900 dark:ring-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">HUY HIỆU ĐÃ MỞ</span>
            <span className="text-xl">🏆</span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{unlockedCount}</span>
              <span className="text-sm font-bold text-slate-400">/ {totalBadgesCount}</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-sumi-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* CARD 2: TOTAL XP FROM BADGES */}
        <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-sumi-900 dark:ring-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">TỔNG XP HUY HIỆU</span>
            <span className="text-xl">⭐</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-amber-500">+{totalEarnedXP} XP</span>
            <p className="mt-1 text-xs text-slate-400">Tích lũy từ danh hiệu</p>
          </div>
        </div>

        {/* CARD 3: STREAK */}
        <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 dark:bg-sumi-900 dark:ring-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">CHUỖI STREAK</span>
            <span className="text-xl">🔥</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-orange-600 dark:text-orange-400">{currentStreak} Ngày</span>
            <p className="mt-1 text-xs text-slate-400">Học tập liên tục</p>
          </div>
        </div>

        {/* CARD 4: SYNC ACTION */}
        <div className="flex flex-col justify-between rounded-3xl bg-gradient-to-br from-slate-900 to-sumi-900 p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300">ĐỒNG BỘ THÀNH TỰU</span>
            <span className="text-xl">✨</span>
          </div>
          <div className="mt-4 space-y-3">
            <p className="text-xs text-slate-300 leading-relaxed">
              Kiểm tra dữ liệu tiến độ mới nhất để nhận tự động các huy hiệu vừa đủ điều kiện!
            </p>
            <button
              type="button"
              disabled={isSyncing}
              onClick={handleSyncAchievements}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 text-xs font-extrabold text-white shadow hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
            >
              {isSyncing ? <span>Đang đồng bộ...</span> : <span>Kiểm Tra & Nhận Huy Hiệu 🔄</span>}
            </button>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80 dark:bg-sumi-900 dark:ring-slate-800">
        {/* TABS */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 rounded-2xl dark:bg-sumi-800">
          <button
            type="button"
            onClick={() => { playClick(); setActiveTab("ALL"); }}
            className={`rounded-xl px-4 py-2 text-xs font-extrabold transition ${
              activeTab === "ALL"
                ? "bg-white text-slate-900 shadow dark:bg-sumi-900 dark:text-white"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Tất Cả ({totalBadgesCount})
          </button>
          <button
            type="button"
            onClick={() => { playClick(); setActiveTab("UNLOCKED"); }}
            className={`rounded-xl px-4 py-2 text-xs font-extrabold transition ${
              activeTab === "UNLOCKED"
                ? "bg-white text-emerald-600 shadow dark:bg-sumi-900 dark:text-emerald-400"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Đã Mở ({unlockedCount})
          </button>
          <button
            type="button"
            onClick={() => { playClick(); setActiveTab("LOCKED"); }}
            className={`rounded-xl px-4 py-2 text-xs font-extrabold transition ${
              activeTab === "LOCKED"
                ? "bg-white text-slate-900 shadow dark:bg-sumi-900 dark:text-white"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Chưa Mở ({totalBadgesCount - unlockedCount})
          </button>
        </div>

        {/* CATEGORY & SEARCH */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-red-400 dark:border-slate-700 dark:bg-sumi-850 dark:text-slate-200"
          >
            <option value="ALL">Tất cả danh mục</option>
            <option value="JOURNEY">Hành trình Shinkansen</option>
            <option value="LEARNING">Bài học & Kỹ năng</option>
            <option value="CHALLENGE">Thách thức & XP</option>
            <option value="SPECIAL">Đặc biệt & Giao tiếp</option>
          </select>

          <input
            type="text"
            placeholder="Tìm huy hiệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-48 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-red-400 dark:border-slate-700 dark:bg-sumi-850 dark:text-slate-200"
          />
        </div>
      </div>

      {/* BADGES GRID */}
      {filteredBadges.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBadges.map((badge) => (
            <div
              key={badge.key}
              onClick={() => { playClick(); setSelectedBadge(badge); }}
              className={`group relative flex cursor-pointer items-start gap-4 rounded-3xl p-5 transition-all duration-200 ${
                badge.isUnlocked
                  ? "bg-gradient-to-br from-amber-500/10 via-white to-emerald-500/5 shadow-sm ring-1 ring-amber-400/40 hover:shadow-md hover:ring-amber-500 dark:from-amber-950/20 dark:via-sumi-900 dark:to-emerald-950/10 dark:ring-amber-500/30"
                  : "bg-white/80 opacity-70 ring-1 ring-slate-200/80 hover:opacity-100 dark:bg-sumi-900/60 dark:ring-slate-800"
              }`}
            >
              {/* BADGE ICON CONTAINER */}
              <div
                className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-inner transition group-hover:scale-105 ${
                  badge.isUnlocked
                    ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/30 ring-2 ring-amber-300"
                    : "bg-slate-100 text-slate-400 dark:bg-sumi-800 grayscale"
                }`}
              >
                <span>{badge.icon}</span>
                {!badge.isUnlocked && (
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-[10px] text-white">
                    🔒
                  </span>
                )}
              </div>

              {/* BADGE INFO */}
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-400 truncate">
                    {badge.categoryLabel}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-800 dark:bg-amber-950 dark:text-amber-300 shrink-0">
                    +{badge.xpReward} XP
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400 transition truncate text-base">
                  {badge.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 dark:text-slate-400">
                  {badge.description}
                </p>

                <div className="pt-1 text-[11px] font-semibold">
                  {badge.isUnlocked ? (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      ✓ Đã mở khóa ({badge.unlockedAt || "Đã đạt"})
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      🔒 Chưa đạt · Bấm xem yêu cầu
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200/80 dark:bg-sumi-900 dark:ring-slate-800 space-y-3">
          <span className="text-4xl">🔍</span>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Không Tìm Thấy Huy Hiệu Phù Hợp</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Hãy thử tìm kiếm với từ khóa khác hoặc chuyển danh mục bộ lọc.
          </p>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedBadge && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedBadge(null)}
        >
          <div
            className="w-full max-w-md space-y-6 rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 dark:bg-sumi-900 dark:ring-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shadow ${
                    selectedBadge.isUnlocked
                      ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white ring-2 ring-amber-300"
                      : "bg-slate-100 text-slate-400 dark:bg-sumi-800 grayscale"
                  }`}
                >
                  {selectedBadge.icon}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400">{selectedBadge.categoryLabel}</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedBadge.title}</h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-sumi-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <b className="text-slate-900 dark:text-white block mb-1">Mô tả huy hiệu:</b>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                  {selectedBadge.description}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-sumi-850 space-y-2 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-500">Phần thưởng XP:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">+{selectedBadge.xpReward} XP</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-500">Trạng thái:</span>
                  <span className={selectedBadge.isUnlocked ? "text-emerald-600 font-bold" : "text-slate-400"}>
                    {selectedBadge.isUnlocked ? "✓ Đã mở khóa" : "🔒 Chưa mở khóa"}
                  </span>
                </div>
                <div>
                  <b className="text-slate-700 dark:text-slate-300 block mt-1">Điều kiện đạt được:</b>
                  <p className="text-slate-500 mt-0.5">{selectedBadge.requirementHint}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              {selectedBadge.actionHref && (
                <Link
                  href={selectedBadge.actionHref}
                  onClick={() => setSelectedBadge(null)}
                  className="rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-5 py-2.5 text-xs font-bold text-white shadow hover:brightness-110 transition"
                >
                  {selectedBadge.actionLabel || "Đến Thực Hiện →"}
                </Link>
              )}
              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-sumi-800"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

