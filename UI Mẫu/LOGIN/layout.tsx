import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Noto_Serif_JP } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";
import "./fonts.css";
import "./redesign.css";
import "./nq-ui.css"; // phải import SAU redesign.css để ghi đè
import { MotionEnhancer } from "@/components/MotionEnhancer";

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam",
  display: "swap",
});
const serifJp = Noto_Serif_JP({
  subsets: ["japanese", "latin"],
  weight: ["500", "700"],
  variable: "--font-noto-serif-jp",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Nihon Quest — Learn Japanese. Explore Japan.",
  description:
    "Học tiếng Nhật cùng Nihon Quest: luyện viết Kana, ôn tập SRS, hội thoại AI và khám phá văn hóa Nhật Bản theo nhịp độ của bạn.",
  keywords: ["learn japanese", "hiragana", "katakana", "kanji", "jlpt", "spaced repetition", "nihon quest"],
  icons: {
    icon: [{ url: "/logo.jpg", type: "image/jpeg" }],
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export const viewport: Viewport = { themeColor: "#f8f6f1" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${sans.variable} ${serifJp.variable} overflow-x-hidden max-w-full`}>
      <body className="min-h-screen font-sans selection:bg-[#d22f27] selection:text-white overflow-x-hidden max-w-full">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:p-4 focus:bg-[#c82c25] focus:text-white focus:z-[100] rounded-lg">
          Chuyển đến nội dung
        </a>
        <Providers>
          <main id="main" className="min-h-screen w-full overflow-x-hidden">
            {children}
            <MotionEnhancer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
