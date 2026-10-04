# Bản nháp prompt xây dựng web Nihon Quest

Tài liệu này ghi lại các prompt từng bước để nhờ AI code dần từ một ý tưởng sơ khai thành con web học tiếng Nhật hoàn chỉnh (Next.js + Prisma + Tailwind + NextAuth).

---

## Ý tưởng ban đầu (Draft Idea)

Mình muốn làm một web app học tiếng Nhật tên là **Nihon Quest**.
Ý tưởng cốt lõi: Vừa học tiếng Nhật vừa nhập vai đi du lịch qua các thành phố của Nhật Bản.

Các tính năng chính:
- Học bảng chữ cái Kana (Hiragana, Katakana) có âm thanh, vẽ thử nét trên canvas.
- Học từ vựng, ngữ pháp N5 và làm quiz kiểm tra kiến thức.
- Ôn tập ngắt quãng (SRS) theo thuật toán SM-2 để nhớ lâu.
- Game hoá: có điểm XP, lên level, giữ chuỗi ngày học (streak), nhiệm vụ hàng ngày.
- Khám phá văn hóa Nhật Bản (Tokyo, Kyoto, Osaka...) mở khoá dần theo điểm kinh nghiệm, sưu tầm tem lưu niệm.
- Phòng Tatami 3D trang trí các món đồ lưu niệm kiếm được.
- Chế độ sinh tồn: hội thoại nhập vai tình huống thực tế (mua đồ combini, gọi ramen, hỏi đường).
- AI Sensei: chatbot đóng vai giáo viên giải thích ngữ pháp, hỗ trợ nhiều model (Gemini, OpenRouter, Ollama...).

Tech stack dự kiến:
- Next.js 14 (App Router, TypeScript)
- Database: Prisma ORM (SQLite / PostgreSQL)
- Auth: NextAuth.js
- Styling: Tailwind CSS
- Test: Vitest

---

## Giai đoạn 1: Khởi tạo dự án và thiết kế cơ sở dữ liệu

### Prompt:
```text
Tôi muốn xây dựng một ứng dụng web học tiếng Nhật tên là Nihon Quest bằng Next.js 14 App Router, TypeScript, Tailwind CSS và Prisma ORM.

Hãy giúp tôi:
1. Tạo file package.json với các thư viện cần thiết: Next.js, React, Prisma, NextAuth, bcryptjs, zod, vitest.
2. Thiết kế schema Prisma (schema.prisma) lưu trữ đầy đủ các bảng dữ liệu:
   - Bảng người dùng, tài khoản, phiên đăng nhập (phục vụ NextAuth).
   - Bảng dữ liệu học: Kana, nét vẽ KanaStroke, Kanji, Từ vựng, Ngữ pháp, Bài học (Lesson), Câu hỏi (Exercise).
   - Bảng lưu tiến độ người dùng: Tiến độ bài học, Lịch sử làm bài tập, Lịch sử cộng XP, Hàng đợi ôn tập SRS (ReviewItem), Nhiệm vụ ngày (DailyMission), Thành tựu (Achievement).
   - Bảng hành trình & mini game: Thành phố du lịch (JourneyLocation), Tiến độ mở khoá, Kịch bản hội thoại sinh tồn (Scenario), Vật phẩm sưu tầm, Đồ đạc trong phòng 3D.
   - Bảng lưu hội thoại với AI Sensei.
3. Tạo file lib/prisma.ts để kết nối database.
4. Viết file prisma/seed.ts nạp sẵn dữ liệu ban đầu (bảng Hiragana, Katakana, khoảng 30 từ vựng N5, 5 bài học mẫu, 7 thành phố Nhật Bản và vài kịch bản sinh tồn).
```

---

## Giai đoạn 2: Đăng ký, đăng nhập và khung giao diện (App Shell)

### Prompt:
```text
Tiếp tục dự án Nihon Quest, hãy làm phần xác thực tài khoản và khung giao diện chính:

1. Cài đặt NextAuth tại app/api/auth/[...nextauth]/route.ts sử dụng CredentialsProvider (email + mật khẩu mã hoá bằng bcryptjs).
2. Viết API đăng ký tài khoản tại app/api/auth/register/route.ts, kiểm tra dữ liệu bằng zod và tự động tạo thông tin ban đầu cho user.
3. Thêm middleware.ts để bảo vệ các trang /app/*, nếu chưa đăng nhập thì chuyển về /login, nếu đã đăng nhập thì tự vào thẳng /app.
4. Dựng giao diện các trang:
   - Trang Đăng nhập (/login) và Đăng ký (/register).
   - Trang khảo sát ban đầu (/onboarding) để chọn mục tiêu học (5 phút, 15 phút mỗi ngày).
5. Tạo khung giao diện ứng dụng (App Shell):
   - Sidebar bên trái cho máy tính, thanh điều hướng đáy màn hình cho điện thoại.
   - Header hiển thị tên user, cấp độ (Level), thanh kinh nghiệm (XP), chuỗi ngày học (Streak) và nút đổi giao diện Sáng/Tối.
   - Tạo trang Dashboard chính (/app) tổng hợp: lời chào, nhiệm vụ hôm nay, nút tiếp tục bài học gần nhất và tiến độ ôn tập.
```

---

## Giai đoạn 3: Bảng chữ cái Kana và bảng vẽ tập viết

### Prompt:
```text
Xây dựng trang luyện bảng chữ cái Kana (/app/practice) cho Nihon Quest:

1. Tạo API lấy danh sách chữ Hiragana và Katakana từ database.
2. Giao diện bảng chữ cái:
   - Chia tab rõ ràng: Hiragana, Katakana, Âm đục (Dakuten), Âm ghép (Yōon).
   - Xếp theo lưới 5 cột chuẩn (a, i, u, e, o).
   - Bấm vào chữ sẽ phát âm tiếng Nhật (dùng Web Speech API kèm fallback âm thanh).
3. Viết component bảng vẽ KanaCanvas (components/KanaCanvas.tsx) bằng HTML5 Canvas:
   - Hỗ trợ cả chạm trên điện thoại lẫn rê chuột trên máy tính.
   - Có nét vẽ mờ làm mẫu và hướng dẫn thứ tự nét.
   - Có nút Xoá, nút Quay lại (Undo), và nút Kiểm tra nét vẽ để chấm điểm độ chuẩn xác.
   - Tặng điểm XP khi người dùng tập viết đúng.
```

---

## Giai đoạn 4: Bài học, từ điển từ vựng và Quiz Engine

### Prompt:
```text
Xây dựng tính năng học tập và làm bài tập trắc nghiệm:

1. Trang danh sách bài học (/app/learn):
   - Hiển thị lộ trình bài học từ cơ bản đến nâng cao.
   - Phân biệt rõ bài đã học xong, bài đang mở và bài bị khoá.
2. Trang chi tiết bài học (/app/learn/[lessonId]):
   - Phần lý thuyết: hiển thị từ vựng mới, giải thích ngữ pháp ngắn gọn, ví dụ thực tế và nút nghe phát âm.
   - Phần Quiz Engine: bài tập kiểm tra đa dạng (chọn đáp án trắc nghiệm, gõ romaji, ghép nghĩa, nghe chọn từ).
   - Có thanh tiến độ câu hỏi, âm thanh khi trả lời đúng/sai.
3. API hoàn thành bài học (/api/lessons/[lessonId]/complete):
   - Ghi nhận điểm số, độ chính xác.
   - Cộng điểm XP vào tài khoản (đảm bảo reload trang không bị cộng điểm lặp lại).
   - Cập nhật tiến độ nhiệm vụ ngày và chuỗi streak.
4. Trang từ vựng (/app/vocabulary) và ngữ pháp (/app/grammar):
   - Có ô tìm kiếm từ vựng N5 theo Kanji, Kana hoặc nghĩa tiếng Việt.
   - Danh sách mẫu ngữ pháp cơ bản kèm lưu ý các lỗi hay sai.
```

---

## Giai đoạn 5: Hệ thống tính điểm XP, Streak, Nhiệm vụ và Ôn tập SRS

### Prompt:
```text
Hãy viết logic game hoá và thuật toán ôn tập ghi nhớ cho web:

1. Viết file lib/gamification.ts:
   - Hàm tính Level từ tổng điểm XP.
   - Hàm cập nhật chuỗi ngày học (Daily Streak) dựa theo múi giờ người dùng (tránh lệch ngày do giờ server UTC).
   - Xử lý các giao dịch cộng XP có lưu lý do rõ ràng.
2. API nhiệm vụ ngày (/api/missions/today):
   - Tự động sinh 3 nhiệm vụ mỗi ngày cho user (ví dụ: học 1 bài mới, đạt 50 XP, ôn tập 10 từ).
   - Tự động nhận thưởng khi hoàn thành.
3. Hệ thống Ôn tập ngắt quãng SRS SM-2 (/app/review):
   - Viết thuật toán SM-2 tại lib/srs.ts để tính ngày ôn tập tiếp theo dựa trên đánh giá của người học: Quên (1 ngày), Khó (2 ngày), Tốt (4 ngày), Dễ (7 ngày).
   - Giao diện thẻ Flashcard lật 3D: Mặt trước xem chữ/nghe âm, bấm lật xem nghĩa và chọn mức độ nhớ để lên lịch ôn tiếp theo.
```

---

## Giai đoạn 6: Bản đồ hành trình Nhật Bản và phòng 3D Tatami

### Prompt:
```text
Xây dựng tính năng khám phá văn hoá và phòng truyền thống Nhật Bản:

1. Bản đồ hành trình Nhật Bản (/app/journey):
   - Tạo file cityData.ts chứa thông tin 7 thành phố lớn: Tokyo, Kyoto, Osaka, Hiroshima, Hokkaido, Kyushu, Okinawa.
   - Mỗi thành phố có: hình ảnh minh hoạ, điều kiện XP để mở khoá, bài giới thiệu văn hoá, đặc sản, và từ vựng địa phương.
   - Giao diện bản đồ hiển thị các trạm dừng chân, cho phép bấm vào khám phá và bấm "Đóng dấu lưu niệm" để nhận tem và vật phẩm.
2. Phòng 3D Tatami (components/Japanese3DRoom.tsx):
   - Dựng căn phòng phong cách Nhật Bản truyền thống (sàn chiếu Tatami, cửa trượt Shoji, view nhìn ra cây hoa anh đào).
   - Cho phép người dùng bài trí các món đồ lưu niệm đã thu thập từ các thành phố (Búp bê Daruma, Mèo thần tài, Kiếm gỗ...).
   - Lưu vị trí đồ vật vào database để khi vào lại phòng vẫn giữ nguyên.
```

---

## Giai đoạn 7: Chế độ hội thoại sinh tồn (Survival Mode)

### Prompt:
```text
Xây dựng chế độ giao tiếp tình huống thực tế (/app/survival):

1. Tạo dữ liệu các kịch bản thực tế tại Nhật:
   - Gọi món tại quán mì Ramen (chọn độ đậm nước dùng, gọi thêm trứng).
   - Mua đồ và thanh toán tại cửa hàng tiện lợi Conbini.
   - Mua vé tàu điện Shinkansen và hỏi nhân viên nhà ga.
2. Giao diện hội thoại dạng Visual Novel:
   - Hiển thị nhân vật NPC đang nói chuyện, có câu thoại tiếng Nhật, dịch nghĩa và nút nghe phát âm.
   - Đưa ra 3-4 câu trả lời để người học lựa chọn:
     * Câu trả lời lịch sự chuẩn mực (nhận tối đa điểm).
     * Câu trả lời bình thường (đủ hiểu).
     * Câu trả lời sai ngữ cảnh hoặc bất lịch sự (bị nhắc nhở và trừ điểm).
3. Lưu tiến độ và thưởng danh hiệu "Bậc thầy Sinh tồn" khi vượt qua các màn thử thách.
```

---

## Giai đoạn 8: Trợ lý AI Sensei giải đáp ngữ pháp

### Prompt:
```text
Tích hợp chatbot AI Sensei hỗ trợ học tập (/app/sensei):

1. Viết adapter tại lib/ai.ts và API /api/sensei/chat:
   - Hỗ trợ linh hoạt nhiều dịch vụ AI: Google Gemini, OpenRouter, Ollama (chạy AI local) hoặc OpenAI.
   - Nếu không điền API key nào thì hệ thống tự chuyển sang chế độ trả lời mẫu có sẵn, không để web bị lỗi.
   - Đặt system prompt cho AI đóng vai "Takeshi Sensei" kiên nhẫn, phân tích cặn kẽ ngữ pháp, chỉ ra điểm đúng sai và luôn động viên người học.
2. Giao diện khung chat:
   - Có avatar hoạt hình của Sensei.
   - Có sẵn các nút gợi ý câu hỏi nhanh (ví dụ: "Phân biệt は và が", "Sửa giúp tôi câu này", "Luyện hội thoại gọi món").
   - Cho phép nghe câu trả lời bằng giọng đọc tiếng Nhật và lưu lại lịch sử đoạn chat vào database.
```

---

## Giai đoạn 9: Kiểm tra chất lượng, viết test và hoàn thiện

### Prompt:
```text
Hoàn thiện dự án, kiểm tra lỗi và viết test:

1. Cài đặt Vitest và viết unit test cho các hàm quan trọng:
   - Test công thức tính Level và kinh nghiệm XP.
   - Test logic tính chuỗi ngày học Streak theo múi giờ.
   - Test thuật toán tính khoảng cách ngày ôn tập SM-2.
2. Bổ sung các trang báo lỗi và chờ tải:
   - loading.tsx với skeleton loader mượt mà.
   - error.tsx và not-found.tsx thân thiện.
3. Chạy kiểm tra toàn bộ dự án:
   - Chạy npm run typecheck đảm bảo không có lỗi TypeScript.
   - Chạy npm test kiểm tra các hàm nghiệp vụ pass hết.
   - Chạy npm run build xác nhận dự án build thành công không lỗi.
```

---

## Tóm tắt các lệnh chạy dự án

Sau khi tạo xong code, chạy các lệnh này để khởi động:

```bash
npm install

npx prisma generate
npx prisma migrate dev --name init
npm run db:seed

npm test

npm run dev
```
