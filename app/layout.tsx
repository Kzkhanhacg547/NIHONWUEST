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
  subsets: ["latin"],
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
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

// viewportFit: "cover" là bắt buộc để env(safe-area-inset-*) có giá trị, nếu không
// phần dưới bị home indicator của iPhone che mất.
export const viewport: Viewport = {
  themeColor: "#f8f6f1",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${sans.variable} ${serifJp.variable} max-w-full overflow-x-clip`}
    >
      <body className="min-h-[100dvh] font-sans selection:bg-[#d22f27] selection:text-white max-w-full overflow-x-clip">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-[max(1rem,env(safe-area-inset-top))] focus:p-4 focus:bg-[#c82c25] focus:text-white focus:z-[100] rounded-lg"
        >
          Chuyển đến nội dung
        </a>
        <Providers>
          <main id="main" className="min-h-[100dvh] w-full max-w-full overflow-x-clip">
            {children}
            <MotionEnhancer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
