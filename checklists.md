# Checklists & Issues
Dưới đây là danh sách các lỗi và các phần chưa tốt trong project đã được kiểm tra:

## 1. Lỗi hiển thị ID thay vì từ vựng ở thẻ SRS (Flashcard) - [Nghiêm trọng] [FIXED]
Status: FIXED
- [x] Không còn hiển thị raw contentId (Đã có logic fallback type-safe, loại bỏ orphan items trước khi render)
- [x] Orphan ReviewItem đã được xử lý (Sử dụng hàm filter trong trang)
- [x] Cleanup script được tạo (`scripts/cleanup-orphan-review-items.ts`)
- [x] SRS flow được kiểm tra an toàn
- **Tình trạng:** Ở màn hình Ôn tập (SRS), một số thẻ hiển thị chuỗi mã ngẫu nhiên (ví dụ: `cmu32wk7500rmxg2hrttpa6pq`) thay vì chữ tiếng Nhật.
- **Nguyên nhân:** Trong `app/app/review/page.tsx`, dữ liệu của `ReviewItem` lưu trữ dạng tham chiếu đa hình (Polymorphic) thông qua `contentType` và `contentId`. Khi truy vấn, nếu dữ liệu gốc bên bảng `Vocabulary`, `Kana`... đã bị xóa hoặc không tồn tại, thì logic fallback sẽ tự động gán `title = item.contentId`. Do Prisma không có ràng buộc Foreign Key cứng khóa ngoại (Cascade Delete) cho trường hợp này, các bản ghi mồ côi (orphan records) sẽ dẫn đến lỗi hiển thị.
- **Cách khắc phục:** 
  - Trong vòng lặp map `enrichedItems`, nếu không map được dữ liệu (như `vocabDetail`, `kanaDetail` là `undefined`), cần phải lọc (filter) bỏ các item đó ra khỏi mảng hiển thị hoặc hiển thị một fallback UI đàng hoàng ("Nội dung đã bị xóa").
  - Xây dựng một API/Script để dọn dẹp các `ReviewItem` không còn tham chiếu thực tế.

## 2. Cảnh báo ESLint về việc sử dụng thẻ `<img>` thay vì `<Image />` - [Tối ưu hóa] [FIXED]
Status: FIXED
- [x] Đã thay toàn bộ các thẻ HTML thuần bằng component `<Image />` của Next.js với thuộc tính `fill={true}` và `object-cover`.
- [x] Layout responsive được bảo toàn.
- **Tình trạng:** `next lint` báo cảnh báo về hiệu suất khi load ảnh.
- **Nguyên nhân:** File `components/Japanese3DRoom.tsx` (tại các dòng 531, 744, 815, 997) đang sử dụng thẻ `<img>` HTML thuần. Điều này khiến Next.js không thể tự động tối ưu hóa ảnh, dẫn đến việc tải chậm hơn (ảnh hưởng điểm LCP) và tốn băng thông.
- **Cách khắc phục:** Thay thế các thẻ `<img>` bằng component `<Image />` được import từ `next/image`, cung cấp đầy đủ thuộc tính `width`, `height` hoặc dùng `layout="fill"`.

## 3. Quản lý trạng thái và Type Safety [FIXED]
Status: FIXED
- [x] Cấu trúc ReviewItem đã được tách rời an toàn với helper `resolveReviewItems`.
- [x] Validation TypeScript (`tsc --noEmit`) báo 0 lỗi, project pass mọi test về type safety.
- **Tình trạng:** Dự án chạy `tsc --noEmit` không phát hiện lỗi type (rất tốt). Tuy nhiên kiến trúc ReviewItem cần chú ý.
- **Khuyến nghị:** Cân nhắc tạo Type Guard hoặc các hàm Helper riêng biệt để validate và map `contentId` cho `ReviewItem` an toàn hơn.
