import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { GrammarClient } from "./GrammarClient";

export const metadata = { title: "Ngữ Pháp JLPT — Nihon Quest" };
// Mỗi lần tải trang sẽ xáo ảnh cấp độ lại từ đầu
export const dynamic = "force-dynamic";

const IMG_EXT = /\.(webp|jpe?g|png|avif)$/i;
const LEVELS = ["N5", "N4", "N3"] as const;

/**
 * Đọc toàn bộ ảnh trong public/images/level, xáo trộn (Fisher-Yates),
 * rồi gán cho N5/N4/N3 để 3 thẻ không trùng ảnh trong cùng một lần hiển thị.
 * Chạy ở server nên kết quả được truyền xuống client dưới dạng props
 * -> không bị lệch hydration và không đổi ảnh khi re-render.
 */
function pickLevelImages(): Record<(typeof LEVELS)[number], string | null> {
  const dir = path.join(process.cwd(), "public", "images", "level");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => IMG_EXT.test(f));
  } catch {
    files = [];
  }
  for (let i = files.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [files[i], files[j]] = [files[j], files[i]];
  }
  const result = {} as Record<(typeof LEVELS)[number], string | null>;
  LEVELS.forEach((lv, i) => {
    // Nếu thư mục có ít hơn 3 ảnh thì buộc phải lặp lại
    result[lv] = files.length ? `/images/level/${encodeURIComponent(files[i % files.length])}` : null;
  });
  return result;
}

export default async function GrammarPage() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: uid },
    select: { learningLevel: true, name: true },
  });
  const userLevel = user?.learningLevel ?? "N5";
  const displayName = user?.name ?? session?.user?.name ?? "bạn";

  // Chỉ hỗ trợ N5, N4, N3
  const grammar = await prisma.grammar.findMany({
    where: { level: { in: [...LEVELS] } },
    include: { examples: { orderBy: { id: "asc" } } },
    orderBy: [{ level: "asc" }, { title: "asc" }],
  });
  const serialized = grammar.map((g) => ({
    id: g.id,
    title: g.title,
    level: g.level,
    meaning: g.meaning,
    structure: g.structure,
    commonMistakes: g.commonMistakes,
    examples: g.examples.map((e) => ({ id: e.id, japanese: e.japanese, romaji: e.romaji, meaning: e.meaning })),
  }));

  const levelImages = pickLevelImages();

  return (
    <div className="nq-workspace">
      <AppNav />

      {/* HERO */}
      <section className="mx-auto mt-2 max-w-[1320px] px-4 sm:px-6">
        <div className="relative isolate overflow-hidden rounded-3xl bg-[#0b1230]">
          <Image
            src="/images/dashboard/fuji-hero.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 1320px) 1320px, 100vw"
            className="-z-20 object-cover object-[70%_center]"
          />
          {/* Lớp phủ tối bên trái để chữ luôn dễ đọc */}
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0b1230]/90 via-[#0b1230]/55 to-transparent"
            aria-hidden="true"
          />

          <div className="relative px-6 py-10 sm:px-10 sm:py-14 lg:py-16">
            <p className="mb-4 text-xs font-bold tracking-[0.14em] text-white/80">
              <span className="border-b-2 border-red-500 pb-0.5">CHÀO MỪNG BẠN ĐẾN VỚI NIHONGUEST</span>
            </p>
            <h1 className="max-w-xl text-[clamp(2rem,7.5vw,3.5rem)] font-black leading-[1.08] tracking-tight text-white">
              Từ vựng, Hán tự,
              <br />
              <span className="text-red-500">Ngữ pháp.</span>
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/85">
              Khám phá cấu trúc, cách dùng và hơn thế nữa – để chinh phục tiếng Nhật một cách tự tin và hiệu quả!
            </p>
            <Link
              href="#grammar-list"
              className="mt-7 inline-flex min-h-11 items-center gap-3 rounded-full bg-gradient-to-r from-red-600 to-rose-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/30 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span aria-hidden="true">📖</span>
              Bắt đầu học ngay
              <span aria-hidden="true">›</span>
            </Link>
          </div>

          <p
            className="jp-text pointer-events-none absolute right-6 top-6 hidden text-2xl font-medium tracking-[0.35em] text-white/90 [writing-mode:vertical-rl] md:block"
            aria-hidden="true"
          >
            日本語
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] px-4 pb-20 pt-5 sm:px-6">
        <GrammarClient
          grammar={serialized}
          defaultLevel={userLevel}
          displayName={displayName}
          levelImages={levelImages}
        />
      </div>
    </div>
  );
}