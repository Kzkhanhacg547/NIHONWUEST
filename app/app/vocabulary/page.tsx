import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { JapanBackdrop, JapanScenicPanel } from "@/components/JapanIllustration";
import { VocabKanjiClient } from "./VocabKanjiClient";

export default async function VocabularyPage() {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as { id?: string; name?: string | null; image?: string | null } | undefined;
  const uid = sessionUser?.id;
  if (!uid) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: uid }, select: { learningLevel: true } });
  const userLevel = user?.learningLevel ?? "N5";
  const vocabulary = await prisma.vocabulary.findMany({ orderBy: { word: "asc" }, include: { examples: true } });
  const kanji = await prisma.kanji.findMany({ orderBy: { strokeCount: "asc" }, include: { readings: true } });
  const userReviews = await prisma.reviewItem.findMany({
    where: { userId: uid, contentType: { in: ["VOCAB", "KANJI"] } },
    select: { contentId: true },
  });
  const savedItemIds = userReviews.map((r) => r.contentId);

  return (
    <div className="nq-workspace">
      <JapanBackdrop />
      <AppNav userName={sessionUser?.name} userImage={sessionUser?.image} />

      {/* HERO */}
      <section className="relative mx-auto mt-2 grid max-w-[1320px] items-center gap-2 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="relative z-10 py-8 lg:py-12" data-intro>
          <div className="mb-4 flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-slate-500 dark:text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600" aria-hidden="true" />
            THƯ VIỆN TRI THỨC NHẬT BẢN
          </div>
          <h1 className="text-[clamp(1.75rem,7.5vw,40px)] font-black leading-[1.08] tracking-tight text-balance text-slate-900 dark:text-white sm:text-5xl">
            Từ vựng, Hán tự, <span className="text-red-600">Ngữ pháp.</span>
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
            Khám phá và tra cứu mọi kiến thức nền tảng của tiếng Nhật, được tuyển chọn và trình bày rõ ràng, khoa học.
          </p>
        </div>

        <div className="relative hidden h-[230px] md:block lg:h-[260px]" data-intro data-parallax>
          {/* Mờ dần về phía chữ để cảnh Phú Sĩ hòa vào nền, giống ảnh mẫu */}
          <div className="absolute inset-0 overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,black_28%)] [mask-image:linear-gradient(to_right,transparent,black_28%)] [&>*]:h-full [&>*]:w-full">
            <JapanScenicPanel variant="fuji" showLabel={false} />
          </div>

          {/* Chữ dọc 日本語の基礎 */}
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

      <div className="mx-auto max-w-[1320px] px-4 pb-16 sm:px-6">
        <VocabKanjiClient
          vocabulary={JSON.parse(JSON.stringify(vocabulary))}
          kanji={JSON.parse(JSON.stringify(kanji))}
          savedItemIds={savedItemIds}
          defaultLevel={userLevel}
        />
      </div>
    </div>
  );
}
