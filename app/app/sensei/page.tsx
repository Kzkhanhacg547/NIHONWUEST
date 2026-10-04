import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { AppNav } from "@/components/AppNav";
import { PageTitle } from "@/components/ui";
import { SenseiKaiwaClient } from "./SenseiKaiwaClient";

export const metadata = {
  title: "AI Kaiwa Sensei N3 — Nihon Quest",
  description: "Trò chuyện trực tiếp cùng Aoi Sensei bằng giọng nói và chữ viết với khẩu hình tự nhiên.",
};

export default async function SenseiPage() {
  const session = await getServerSession(authOptions);
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) redirect("/login");

  return (
    <div className="nq-workspace space-y-6">
      <AppNav />
      <PageTitle
        title="AI Kaiwa Sensei (葵先生) 🌸"
        subtitle="Luyện phản xạ giao tiếp tiếng Nhật thực tế N3 bằng giọng nói và văn bản. Đồng bộ khẩu hình tự nhiên và nhận phản hồi trực tiếp."
        badge="JLPT N3 Kaiwa"
      />
      <SenseiKaiwaClient />
    </div>
  );
}
