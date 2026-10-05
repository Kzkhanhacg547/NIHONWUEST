import Image from "next/image";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/AppNav";
import { JapanBackdrop } from "@/components/JapanIllustration";
import { VocabKanjiClient } from "./VocabKanjiClient";
import { Sakura } from "./Sakura";

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

      {/* HERO – banner bo góc nằm trong khung nội dung, cùng bề rộng với thẻ bên dưới */}
      <section className="relative z-0 mx-auto mt-2 max-w-[1320px] px-3 sm:px-5">
        <div className="relative isolate overflow-hidden rounded-[32px] shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
          <Image
            src="/images/footer-japan.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 1320px) 1320px, 100vw"
            className="-z-20 object-cover object-[center_40%] brightness-110 saturate-[1.05]"
          />
          {/* Mờ dần từ trái (vùng chữ) sang phải, không phủ trắng toàn ảnh */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.72)_36%,rgba(255,255,255,0)_72%)] dark:bg-[linear-gradient(to_right,rgba(10,14,30,0.92)_0%,rgba(10,14,30,0.65)_36%,rgba(10,14,30,0)_72%)]"
          />
          {/* Mờ nhẹ phía dưới để hòa vào thẻ nội dung */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white/70 to-transparent dark:from-sumi-950/60"
          />

          <div className="px-6 pb-28 pt-9 sm:px-10 lg:pb-32 lg:pt-11" data-intro>
            <span className="jp-text inline-flex items-center rounded-full bg-red-600 px-4 py-1.5 text-sm font-bold text-white shadow-md shadow-red-600/30">
              日本語を学ぼう！
            </span>

            <h1 className="mt-4 max-w-xl text-[clamp(2.1rem,7vw,3.5rem)] font-black leading-[1.08] tracking-tight text-[#0f1b4c] dark:text-white">
              Từ vựng, Hán tự,
              <br />
              <span className="text-red-600">Ngữ pháp.</span>
            </h1>

            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
              Khám phá và luyện tập từ vựng, Hán tự, ngữ pháp tiếng Nhật một cách khoa học, dễ hiểu và hiệu quả. Bước nhỏ
              hôm nay, chinh phục tiếng Nhật ngày mai!
            </p>

            {/* Nhãn "nét cọ" */}
            <div className="relative mt-6 inline-flex">
              <span className="jp-text inline-flex items-center bg-[#14224f] py-3 pl-7 pr-12 text-lg font-bold tracking-wide text-white [clip-path:polygon(0_14%,5%_0,38%_9%,76%_0,100%_20%,95%_55%,100%_88%,70%_100%,30%_91%,4%_100%,2%_58%)]">
                がんばりましょう！
              </span>
              <Sakura className="absolute -right-2 top-1/2 h-8 w-8 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </section>

      {/* Thẻ nội dung chính đè lên mép dưới của hero (bo góc lớn như mẫu) */}
      <div className="relative z-10 mx-auto -mt-10 max-w-[1320px] px-3 pb-16 sm:px-5">
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