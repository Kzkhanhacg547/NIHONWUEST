import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { JapanBackdrop, JapanScenicPanel } from "@/components/JapanIllustration";
import { GrammarClient } from "./GrammarClient";

export const metadata = { title: "Ngữ Pháp JLPT — Nihon Quest" };

export default async function GrammarPage() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: uid }, select: { learningLevel: true } });
  const userLevel = user?.learningLevel ?? "N5";
  const grammar = await prisma.grammar.findMany({ include: { examples: { orderBy: { id: "asc" } } }, orderBy: [{ level: "asc" }, { title: "asc" }] });
  const serialized = grammar.map((g) => ({
    id: g.id,
    title: g.title,
    level: g.level,
    meaning: g.meaning,
    structure: g.structure,
    commonMistakes: g.commonMistakes,
    examples: g.examples.map((e) => ({ id: e.id, japanese: e.japanese, romaji: e.romaji, meaning: e.meaning })),
  }));

  return (
    <div className="nq-workspace">
      <JapanBackdrop />
      <AppNav />

      {/* HERO */}
      <section className="relative mx-auto mt-2 grid max-w-[1320px] items-center gap-2 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="relative z-10 py-8 lg:py-12">
          <div className="mb-4 flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-slate-500 dark:text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600" aria-hidden="true" />
            THƯ VIỆN TRI THỨC NHẬT BẢN
          </div>
          <h1 className="text-[clamp(1.75rem,7.5vw,40px)] font-black leading-[1.08] tracking-tight text-balance text-slate-900 dark:text-white sm:text-5xl">
            Từ vựng, Hán tự, <span className="text-red-600">Ngữ pháp.</span>
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
            Khám phá cấu trúc, cách dùng và ví dụ theo từng cấp độ JLPT trong một không gian tra cứu thống nhất.
          </p>
        </div>

        <div className="relative hidden h-[230px] md:block lg:h-[260px]">
          <div className="absolute inset-0 overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,black_28%)] [mask-image:linear-gradient(to_right,transparent,black_28%)] [&>*]:h-full [&>*]:w-full">
            <JapanScenicPanel variant="fuji" showLabel={false} />
          </div>
          <div className="pointer-events-none absolute right-2 top-4 flex items-start gap-3 lg:right-4">
            <p className="hidden max-w-[88px] pt-1 text-[8px] font-semibold leading-snug tracking-[0.18em] text-slate-500 xl:block">
              FOUNDATIONS
              <br />
              FOR A BRIGHTER
              <br />
              JOURNEY
            </p>
            <p
              className="jp-text text-2xl font-medium tracking-[0.35em] text-slate-800 dark:text-slate-200 [writing-mode:vertical-rl]"
              aria-hidden="true"
            >
              日本語の基礎
            </p>
          </div>
        </div>
      </section>

      {/* TABS */}
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 mb-8">
        <nav className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-sumi-900 w-fit" aria-label="Thư viện tiếng Nhật">
          <Link 
            href="/app/vocabulary#vocabulary" 
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-sumi-800 dark:hover:text-white transition-all"
          >
            ▤ &nbsp;Từ vựng
          </Link>
          <Link 
            href="/app/vocabulary#kanji" 
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-sumi-800 dark:hover:text-white transition-all"
          >
            <span className="jp-text font-bold">漢</span>&nbsp; Hán tự
          </Link>
          <Link 
            href="/app/grammar" 
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-white text-red-600 shadow-sm dark:bg-sumi-800 dark:text-red-400 transition-all"
          >
            <span className="jp-text">文</span>&nbsp; Ngữ pháp
          </Link>
        </nav>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 ml-2">
          {grammar.length} cấu trúc được hệ thống theo cấp độ, ý nghĩa, công thức và ngữ cảnh sử dụng.
        </p>
      </div>

      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 pb-20">
        <GrammarClient grammar={serialized} defaultLevel={userLevel} />
      </div>
    </div>
  );
}
