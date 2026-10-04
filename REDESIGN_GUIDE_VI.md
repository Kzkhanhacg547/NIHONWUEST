# Nihon Quest — UI/UX redesign

## Ý tưởng

Japanese editorial: nền giấy ấm, chữ đậm tương phản, đỏ son và xanh trà. Hero mang hình ảnh mặt trời, núi Phú Sĩ và cổng Torii bằng SVG; bố cục Bento tạo điểm nhấn cho Kana, SRS và AI Sensei. Glassmorphism dùng có chọn lọc ở thanh điều hướng và thẻ trên minh họa, không phủ blur toàn trang. Giao diện tối tiếp tục hoạt động theo cài đặt cũ.

## Cấu trúc dự án đã xác minh

- Next.js 14.2.5 App Router, React 18.3.1, TypeScript, Tailwind CSS.
- NextAuth dùng credentials/JWT; Prisma 5.18.0 dùng **SQLite** trong schema hiện tại.
- `app/page.tsx`: trang chủ server-rendered, hero, tính năng, hành trình, CTA, footer.
- `app/app/`: dashboard, Kana Lab, bài học/quiz, SRS, từ vựng, ngữ pháp, journey, survival, leaderboard, profile, Sensei.
- `app/api/`, `lib/`, `prisma/`: API, thuật toán và mô hình dữ liệu gốc. Không chỉnh sửa nội dung các file gốc trong các thư mục này.

## Những phần thay đổi

| File / thành phần | Vai trò |
| --- | --- |
| `app/page.tsx` | Trang chủ mới, liên kết đến các luồng gốc |
| `app/redesign.css` | Design tokens, Bento, responsive, theme, style dùng chung |
| `app/fonts.css`, `public/fonts/` | Inter + Noto Sans JP tự lưu trữ, unicode subsets, giấy phép OFL |
| `components/JapanScene.tsx` | Minh họa vector nhẹ, không phụ thuộc ảnh bên ngoài |
| `components/MotionEnhancer.tsx` | GSAP intro, ScrollTrigger, parallax, magnetic, card tilt |
| `components/ui.tsx` | Card, Button, PageTitle theo hệ giao diện mới |
| `components/AppNav.tsx` | Navigation tablet/mobile, focus trap, Escape, trả focus |
| `components/NihonQuestLogo.tsx` | Hook CSS để logo thích ứng màn hình nhỏ; giữ ảnh logo gốc |
| `app/layout.tsx` | Ngôn ngữ vi, mô tả SEO, font và motion integration |
| `app/app/**/page.tsx` | Shell và kiểu trình bày chung; giữ truy vấn dữ liệu và nội dung |
| `app/login`, `app/register`, `app/forgot-password` | Giao diện form; login thêm label liên kết input, autocomplete và nhãn hiện/ẩn mật khẩu |
| `tailwind.config.js` | Đồng bộ palette sakura/sumi để các màn hình hiện có dùng chung |
| `vendor/gsap/`, `package*.json` | GSAP 3.15.0 lấy trực tiếp từ GSAP-master.zip, dependency local |

Các trang học chuyên biệt giữ bố cục tương tác gốc và nhận giao diện qua shared components, palette và shell. Canvas, thẻ lật SRS, 3D room, quiz, trình phát âm và gọi API được giữ nguyên.

## Chạy mới trên máy

Dùng Node.js tương thích Next.js 14 (Node 20 hoặc 22) và npm. Mở terminal trong thư mục có `package.json`:

```sh
npm ci
```

Sao chép `.env.example` thành `.env`, cấu hình `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET` của môi trường bạn. Với bản local, SQLite dùng `file:./dev.db`. Tạo một file SQLite rỗng nếu chưa có:

```sh
node -e "require('fs').closeSync(require('fs').openSync('prisma/dev.db', 'a'))"
npm run setup
npm run dev
```

Mở http://localhost:3000. Với production build:

```sh
npm run build
npm start
```

SMTP cần cấu hình để gửi OTP thật. AI provider cần key theo README gốc. Không có key hay cơ sở dữ liệu thử nghiệm được đóng gói trong ZIP.

## Tích hợp vào bản đang dùng

1. Sao lưu mã nguồn và dữ liệu hiện tại.
2. Thay các file có trong `docs/redesign/CHANGED_FILES.txt`; thêm `app/redesign.css`, `app/fonts.css`, `components/JapanScene.tsx`, `components/MotionEnhancer.tsx`, `public/fonts/` và `vendor/gsap/`.
3. Giữ `.env` và database đang dùng; không chạy seed lại chỉ để cập nhật UI.
4. Chạy `npm ci`, `npm run typecheck`, `npm run build`, rồi khởi động lại ứng dụng.

Có thể sử dụng toàn bộ source ZIP như một bản dự án hoàn chỉnh; không cần chép riêng thư viện GSAP nữa.

## Điều chỉnh GSAP

Trong `MotionEnhancer.tsx`, các đoạn có chú thích:

- `[data-intro]`: hero reveal, `duration: 0.85`, `stagger: 0.085`, dịch 24px.
- `[data-reveal]`: fade-up một lần khi phần tử đến 94% chiều cao viewport.
- `[data-parallax]`: dịch tối đa 28px, native scroll, không pin hoặc scroll hijacking.
- `[data-magnetic]`: nút dịch tối đa khoảng 3.5px theo vị trí con trỏ, đàn hồi khi rời nút.
- `[data-tilt]`: card xoay tối đa khoảng 1.5 độ.
- Dynamic imports tránh đẩy animation vào render phía server; không tải qua CDN.
- `gsap.matchMedia()` tắt chuyển động với reduced-motion và tắt pointer effects trên touch.
- Cleanup theo pathname/unmount; gỡ listeners, kill tweens và revert ScrollTrigger.
- Nội dung HTML hiển thị mặc định, vẫn truy cập được khi JavaScript hoặc tải animation thất bại.

Không đặt `data-tilt` trên canvas hay thẻ flip SRS vì chúng đã sử dụng transform riêng.

## Phạm vi xác minh

Xem `docs/redesign/QA.md` và báo cáo JSON kèm theo. Các ảnh preview là screenshot của bản build thật, không phải mockup.

Hiệu ứng ưu tiên transform/opacity, SVG không có ảnh nền tải ngoài, font có `font-display: swap`. Chưa đo FPS trên thiết bị thật hoặc chứng nhận WCAG; không khẳng định mọi thiết bị đều đạt 60fps. Không nâng phiên bản framework ngoài phạm vi giao diện. npm ghi nhận cảnh báo bảo mật với Next.js 14.2.5 của dự án gốc; cần có đợt nâng cấp riêng trước khi triển khai công khai.
