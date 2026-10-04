# Kết quả kiểm tra

- `npm run build`: PASS, production build hoàn tất, 43 trang được xử lý khi prerender.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS với 2 cảnh báo hook dependency có sẵn trong `QuizRunner.tsx` (dòng 128, 255); không có cảnh báo ở code mới.
- `DATABASE_URL=file:./dev.db npm test`: 4 test files, 15/15 tests PASS. Bao gồm SRS/domain, rival bots, N3 scenarios và OTP.
- Đăng nhập qua form thật với tài khoản fixture trong SQLite thử nghiệm: PASS.
- Kiểm tra 12 routes × 4 viewport (320, 390, 768, 1440 px): 48/48 phản hồi HTTP 200; không có pageerror JavaScript. Chi tiết trong `browser-check.json`.
- Các nút lọc trong container cuộn ngang có thể nằm ngoài viewport cho đến khi vuốt: hành vi chủ ý. SVG cũng có phần vẽ ngoài viewBox và được clip. Kiểm tra phát hiện menu utility bị chật ở 320px; đã sửa bằng cách thu gọn phần chữ logo, sau đó kiểm tra lại riêng.
- Kết quả kiểm tra cuối menu/focus/Escape, theme, reduced-motion, reveal khi cuộn và auth 320px: `final-browser-check.json`.
- So sánh SHA-256 với ZIP gốc: không thay đổi file gốc nào trong `app/api/`, `lib/`, `prisma/`; middleware cũng giữ nguyên. Binary assets gốc được giữ lại.
- GSAP dependency local 3.15.0 dùng từ file người dùng gửi. Không cần CDN.

## Giới hạn

Kiểm tra bằng Chromium headless trên Linux. Chưa kiểm tra thiết bị Safari/iOS thật, chưa đo FPS phần cứng hoặc thực hiện audit WCAG toàn diện. Chưa gửi email OTP qua SMTP thật hoặc gọi AI provider bên ngoài vì không có credential. Không thực hiện mua dịch vụ, deploy hoặc thay đổi dữ liệu production.

Không có tài khoản kiểm thử, file SQLite, `.env`, `node_modules` hay `.next` trong ZIP bàn giao. Ảnh dashboard chứa dữ liệu fixture, không phải tài khoản thật. Một số emoji phụ thuộc font hệ điều hành; các chữ Nhật đã có Noto Sans JP tự lưu trữ.
