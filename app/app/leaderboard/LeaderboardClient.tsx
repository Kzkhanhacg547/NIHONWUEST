"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Badge, Button } from "@/components/ui";
import { type EnrichedLeaderboardUser, type DirectRivalInfo } from "@/lib/rivalBots";

const RANK_ICONS = ["🥇", "🥈", "🥉"];
const TIER_COLORS = [
  { min: 0, max: 100, name: "Mới Bắt Đầu", color: "from-slate-400 to-slate-600", badge: "⭐" },
  { min: 100, max: 500, name: "Học Viên", color: "from-amber-400 to-amber-600", badge: "🎌" },
  { min: 500, max: 1500, name: "Lữ Hành", color: "from-emerald-400 to-emerald-600", badge: "🗾" },
  { min: 1500, max: 5000, name: "Samurai", color: "from-fuji-400 to-fuji-700", badge: "⚔️" },
  { min: 5000, max: Infinity, name: "Đại Sư", color: "from-sakura-400 to-rose-600", badge: "👑" },
];

function getTier(xp: number) {
  return TIER_COLORS.findLast((t) => xp >= t.min) ?? TIER_COLORS[0];
}

export function LeaderboardClient({
  currentUserId,
  weeklyUsers,
  allTimeUsers,
  directRival,
}: {
  currentUserId: string;
  weeklyUsers: EnrichedLeaderboardUser[];
  allTimeUsers: EnrichedLeaderboardUser[];
  directRival: DirectRivalInfo | null;
}) {
  const [tab, setTab] = useState<"WEEKLY" | "ALL_TIME">("WEEKLY");

  const users = tab === "WEEKLY" ? weeklyUsers : allTimeUsers;
  const currentUser = users.find((u) => u.id === currentUserId);
  const currentUserRank = users.findIndex((u) => u.id === currentUserId) + 1;

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex p-1.5 rounded-2xl bg-slate-100 dark:bg-sumi-900 border border-slate-200 dark:border-slate-800 max-w-sm mx-auto shadow-inner">
        <button
          onClick={() => setTab("WEEKLY")}
          className={`flex-1 min-h-11 py-2.5 rounded-xl text-xs font-black transition-all ${
            tab === "WEEKLY"
              ? "bg-white dark:bg-sumi-800 text-sakura-600 dark:text-sakura-400 shadow-sm"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          🔥 Tuần Này (Weekly League)
        </button>
        <button
          onClick={() => setTab("ALL_TIME")}
          className={`flex-1 min-h-11 py-2.5 rounded-xl text-xs font-black transition-all ${
            tab === "ALL_TIME"
              ? "bg-white dark:bg-sumi-800 text-sakura-600 dark:text-sakura-400 shadow-sm"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          👑 Mọi Lúc (All-Time)
        </button>
      </div>

      {/* Direct Rival Challenge Banner (Only on Weekly League) */}
      {tab === "WEEKLY" && directRival && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-indigo-500/10 dark:from-rose-950/40 dark:via-amber-950/30 dark:to-indigo-950/40 border-2 border-rose-300/80 dark:border-rose-900/80 p-5 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-2xl text-white shadow-md shadow-rose-500/30 shrink-0">
                {directRival.bot.avatar || "⚔️"}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-xs">
                    ⚔️ ĐỐI THỦ TRỰC TIẾP
                  </span>
                  {/* Bots are synthetic. Labelling them here stops the banner
                      from reading as a real person challenging the user. */}
                  <Badge variant="slate" className="shrink-0 text-[9px] uppercase tracking-wider">
                    Học viên
                  </Badge>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                    {directRival.bot.displayName || "Học viên ảo"}
                  </span>
                </div>
                <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                  {directRival.message}
                </h4>
                {directRival.bot.quote && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    &ldquo;{directRival.bot.quote}&rdquo;
                  </p>
                )}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <Link href="/app/practice">
                <Button variant="sakura" size="sm" className="font-black shadow-md shadow-sakura-500/25">
                  Học bài vượt mặt 🚀
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Current User Position Banner */}
      {currentUser && (
        <Card className="p-4 sm:p-5 bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 dark:from-slate-900 dark:to-slate-950 border-2 border-red-200 dark:border-red-900/50 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getTier(currentUser.xp).color} flex items-center justify-center text-2xl shadow-lg`}>
                {getTier(currentUser.xp).badge}
              </div>
              <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                #{currentUserRank}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Vị trí của bạn {tab === "WEEKLY" ? "trong tuần" : "toàn thời gian"}
              </p>
              <p className="font-black text-slate-900 dark:text-white text-base sm:text-lg truncate">
                {currentUser.displayName || currentUser.name || "Bạn"}{" "}
                <span className="text-red-600 dark:text-red-400">#{currentUserRank}</span>
              </p>
              <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500 flex-wrap font-semibold">
                <span>⚡ {currentUser.xp.toLocaleString()} XP</span>
                <span>🎯 Lv.{currentUser.level}</span>
                <span>🔥 {currentUser.currentStreak} ngày</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Leaderboard Table List */}
      <div className="space-y-2.5">
        {users.map((user, idx) => {
          const rank = idx + 1;
          const isMe = user.id === currentUserId;
          const tier = getTier(user.xp);
          const displayName = user.displayName || user.name || "Học Viên";

          return (
            <Card
              key={user.id}
              className={`p-3.5 transition-all ${
                isMe
                  ? "border-2 border-sakura-400 dark:border-sakura-800 bg-sakura-50/60 dark:bg-sakura-950/30 shadow-sm scale-[1.01]"
                  : rank <= 3
                  ? "border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/10"
                  : "border border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Rank number or medal */}
                <div className="w-8 text-center shrink-0">
                  {rank <= 3 ? (
                    <span className="text-xl">{RANK_ICONS[rank - 1]}</span>
                  ) : (
                    <span className="text-sm font-black text-slate-400">#{rank}</span>
                  )}
                </div>

                {/* Avatar / Badge */}
                <div
                  className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center text-lg shadow-sm shrink-0 font-black text-white`}
                >
                  {user.avatar || tier.badge}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-black text-sm truncate ${isMe ? "text-sakura-600 dark:text-sakura-400" : "text-slate-900 dark:text-white"}`}>
                      {displayName}
                      {isMe && " (Bạn)"}
                    </span>
                    <Badge variant={rank <= 3 ? "amber" : "slate"} className="text-[10px] shrink-0">
                      {tier.name}
                    </Badge>
                    {user.isBot && (
                      <Badge variant="slate" className="shrink-0 text-[9px] uppercase tracking-wider">
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5 mt-0.5 text-xs text-slate-500 font-medium">
                    <span>🎯 Lv.{user.level}</span>
                    <span>🔥 {user.currentStreak}d</span>
                    {user.quote && (
                      <span className="hidden sm:inline text-slate-400 truncate max-w-[180px]">
                        · &ldquo;{user.quote}&rdquo;
                      </span>
                    )}
                  </div>
                </div>

                {/* XP earned */}
                <div className="text-right shrink-0">
                  <div className="font-black text-sm text-amber-600 dark:text-amber-400">
                    ⚡ {user.xp.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {tab === "WEEKLY" ? "XP tuần" : "XP"}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {users.length === 0 && (
          <Card className="p-8 text-center border-dashed border-2 border-slate-200 dark:border-slate-800">
            <p className="text-4xl mb-2">🏆</p>
            <p className="font-black text-slate-700 dark:text-slate-200">Chưa có hoạt động trong tuần này!</p>
            <p className="text-xs text-slate-500 mt-1">Hãy hoàn thành một bài học hoặc ôn tập để dẫn đầu bảng xếp hạng！🌸</p>
          </Card>
        )}
  
        {/*users.some((u) => u.isBot) && (
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            Các học viên có nhãn <b>BOT ảo</b> là nhân vật do hệ thống tạo ra để luyện cạnh tranh —
            không phải người dùng thật. Thứ hạng và XP của họ không phản ánh hoạt động của người thật.
          </p>
        )*/} 
      </div>
    </div>
  );
}

