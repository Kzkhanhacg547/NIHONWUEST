import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { AppNav } from "@/components/AppNav";
import { SenseiKaiwaClient } from "./SenseiKaiwaClient";
import { SakuraBackdrop } from "./SenseiDecor";

export const metadata = {
  title: "AI Kaiwa Sensei N3 — Nihon Quest",
  description: "Trò chuyện trực tiếp cùng Aoi Sensei bằng giọng nói và chữ viết với khẩu hình tự nhiên.",
};

export default async function SenseiPage() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) redirect("/login");

  // TODO: lấy "bài học gần đây" thật của người học (cần schema/API tiến độ học) rồi truyền vào:
  // const recentLessons = await getRecentLessons(uid);

  return (
    <div className="nq-workspace relative isolate space-y-5">
      <SakuraBackdrop />
      <AppNav />
      <SenseiKaiwaClient /* recentLessons={recentLessons} */ />
    </div>
  );
}