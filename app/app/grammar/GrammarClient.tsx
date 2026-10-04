"use client";

import { useState } from "react";
import { Card, Badge, Button } from "@/components/ui";
import { useSoundAndTheme } from "@/components/SoundAndThemeContext";

interface GrammarExample {
  id: string;
  japanese: string;
  romaji: string | null;
  meaning: string;
}

interface GrammarItem {
  id: string;
  title: string;
  level: string;
  meaning: string;
  structure: string;
  commonMistakes: string | null;
  examples: GrammarExample[];
}

interface GrammarClientProps {
  grammar: GrammarItem[];
  defaultLevel?: string;
}

function GrammarCard({ item, isOpen, onToggle }: { item: GrammarItem; isOpen: boolean; onToggle: () => void }) {
  const { playClick, speak } = useSoundAndTheme();

  return (
    <Card
      className={`transition-all duration-300 ${isOpen ? "border-sakura-300 dark:border-sakura-800 shadow-lg shadow-sakura-500/10" : "hover:border-slate-300 dark:hover:border-slate-700"}`}
    >
      {/* Header — always visible */}
      <button
        onClick={() => { onToggle(); playClick(); }}
        className="w-full flex items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuji-500 to-sakura-500 flex items-center justify-center text-white font-black text-sm shrink-0">
            文
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-slate-900 dark:text-white text-sm jp-text">{item.title}</h3>
              <Badge variant="sakura" className="text-[10px]">{item.level}</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{item.meaning}</p>
          </div>
        </div>
        <span className={`text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Meaning */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-fuji-500 dark:text-fuji-400">Ý Nghĩa</span>
            <p className="text-sm text-slate-700 dark:text-slate-200 mt-1 leading-relaxed">{item.meaning}</p>
          </div>

          {/* Structure */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-matcha-600 dark:text-matcha-400">Cấu Trúc</span>
            <div className="mt-1 rounded-xl bg-matcha-50 dark:bg-matcha-950/30 border border-matcha-200 dark:border-matcha-900 px-4 py-3">
              <p className="text-sm font-mono text-matcha-800 dark:text-matcha-200 font-bold">{item.structure}</p>
            </div>
          </div>

          {/* Common Mistakes */}
          {item.commonMistakes && (
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">⚠️ Lưu Ý / Lỗi Hay Gặp</span>
              <div className="mt-1 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 px-4 py-3">
                <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">{item.commonMistakes}</p>
              </div>
            </div>
          )}

          {/* Examples */}
          {item.examples.length > 0 && (
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-sakura-500 dark:text-sakura-400">Ví Dụ Thực Tế</span>
              <div className="mt-2 space-y-2.5">
                {item.examples.map((ex) => (
                  <div
                    key={ex.id}
                    className="rounded-xl bg-white dark:bg-sumi-900 border border-slate-200 dark:border-slate-800 px-4 py-3 hover:border-sakura-200 dark:hover:border-sakura-900 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="jp-text text-base font-black text-slate-900 dark:text-white">{ex.japanese}</p>
                        {ex.romaji && (
                          <p className="text-xs text-fuji-500 dark:text-fuji-400 mt-0.5 italic">{ex.romaji}</p>
                        )}
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{ex.meaning}</p>
                      </div>
                      <button
                        onClick={() => speak(ex.japanese)}
                        aria-label="Phát âm ví dụ"
                        /* Ẩn cho tới khi hover là vô nghĩa trên cảm ứng: nút
                           không bao giờ hiện. Dùng focus để bàn phím vẫn tới. */
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:text-sakura-500 hover:border-sakura-300 focus-visible:opacity-100 transition dark:border-slate-700 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                        title="Phát âm"
                      >
                        🔊
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export function GrammarClient({ grammar, defaultLevel = "N5" }: GrammarClientProps) {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>(defaultLevel);
  const [openId, setOpenId] = useState<string | null>(null);
  const { playClick } = useSoundAndTheme();

  const LEVELS = ["N5", "N4", "N3"] as const;
  const LEVEL_LABELS: Record<string, string> = { N5: "Cơ Bản", N4: "Sơ Trung Cấp", N3: "Trung Cấp" };

  const levelFiltered = levelFilter === "ALL" ? grammar : grammar.filter((g) => g.level === levelFilter);

  const filtered = levelFiltered.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.meaning.toLowerCase().includes(search.toLowerCase()) ||
      g.structure.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Level Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap bg-white/90 dark:bg-slate-900/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <span className="text-xs font-black text-slate-500 uppercase tracking-wider mr-1">Cấp độ:</span>
        {LEVELS.map((lv) => (
          <button
            key={lv}
            onClick={() => { playClick(); setLevelFilter(lv); setOpenId(null); }}
            className={`px-3.5 py-2.5 min-h-11 rounded-full text-xs font-bold transition-all ${
              levelFilter === lv
                ? "bg-red-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-slate-700"
            }`}
          >
            {lv} {LEVEL_LABELS[lv]}
            <span className="ml-1 opacity-80 text-[10px]">({grammar.filter((g) => g.level === lv).length})</span>
          </button>
        ))}
        <button
          onClick={() => { playClick(); setLevelFilter("ALL"); setOpenId(null); }}
          className={`px-3.5 py-2.5 min-h-11 rounded-full text-xs font-bold transition-all ${
            levelFilter === "ALL"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          Tất Cả ({grammar.length})
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3.5 text-center bg-gradient-to-br from-red-50 to-rose-50 dark:from-slate-900 dark:to-slate-950 border-red-200 dark:border-red-900/50">
          <div className="text-2xl font-black text-red-600 dark:text-red-400">{levelFiltered.length}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Điểm Ngữ Pháp</div>
        </Card>
        <Card className="p-3.5 text-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-950 border-emerald-200 dark:border-emerald-900/50">
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {levelFiltered.reduce((acc, g) => acc + g.examples.length, 0)}
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Câu Ví Dụ</div>
        </Card>
        <Card className="p-3.5 text-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-950 border-amber-200 dark:border-amber-900/50">
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{levelFilter === "ALL" ? "All" : levelFilter}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cấp Độ JLPT</div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm ngữ pháp... (VD: て形, から, たい)"
          className="w-full pl-10 pr-12 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-sumi-900 text-base sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sakura-400 dark:focus:border-sakura-700 transition"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            aria-label="Xoá từ khoá tìm kiếm"
            className="absolute right-0 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center text-slate-400 hover:text-slate-600 transition active:scale-90"
          >
            ✕
          </button>
        )}
      </div>

      {/* Expand All / Collapse All */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {filtered.length} / {grammar.length} điểm ngữ pháp
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setOpenId("ALL"); playClick(); }}
            className="text-xs"
          >
            Mở tất cả
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setOpenId(null); playClick(); }}
            className="text-xs"
          >
            Đóng tất cả
          </Button>
        </div>
      </div>

      {/* Grammar list */}
      {filtered.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-slate-400">Không tìm thấy ngữ pháp phù hợp. Thử từ khóa khác nhé！🌸</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <GrammarCard
              key={item.id}
              item={item}
              isOpen={openId === "ALL" || openId === item.id}
              onToggle={() => setOpenId(openId === item.id ? null : item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
