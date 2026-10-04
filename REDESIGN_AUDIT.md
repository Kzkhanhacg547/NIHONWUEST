# BÁO CÁO TOÀN DIỆN: FULL PRODUCT, UX & TECHNICAL AUDIT
**Dự án:** Nihon Quest (`D:\Projects\nihon-lengs`)  
**Mục đích:** Đồ án môn học SSA (Software System Architecture) — Đại học FPT  
**Thời điểm thực hiện Audit:** Tháng 09/2026  
**Trạng thái kiểm toán:** HOÀN THÀNH — KHÔNG THAY ĐỔI CODE SẢN PHẨM (AUDIT ONLY)

---

## 1. EXECUTIVE SUMMARY (TỔNG QUAN ĐIỀU HÀNH)

### 1.1. Kết luận sơ bộ
> **DỰ ÁN CHƯA SẴN SÀNG ĐỂ ĐƯA VÀO VẬN HÀNH THỰC TẾ HOẶC BẢO VỆ MÔN HỌC (THE PROJECT IS NOT READY).**

Mặc dù dự án đã vượt qua các bài kiểm tra kỹ thuật bề mặt:
* `npm run test`: **7/7 test passed** (tập trung thuần túy ở `lib/domain.test.ts`)
* `npm run typecheck` (`tsc --noEmit`): **0 errors**
* `npm run lint` (`next lint`): **0 errors / 0 warnings**
* Local server (`npm run dev`): HTTP 200 OK trên các route chính.

Tuy nhiên, thông qua kiểm tra sâu mã nguồn (Source Code Inspection), kiểm tra tương tác dữ liệu CSDL (Database Model & Seed Verification), và truy vết luồng người dùng (User Journey Trace), dự án bộc lộ **những vết rạn nứt cấu trúc nghiêm trọng**:

1. **Vòng lặp học tập bị đứt gãy (Broken Learning Loop):** Các khâu *Học (Learn) → Luyện tập (Practice) → Ôn tập cách khoảng (SRS) → Ghi nhận tiến độ (Missions & Streak)* không tạo thành một chu trình khép kín tự động. Nhiều mắt xích bị cô lập hoàn toàn.
2. **Ảo tưởng công nghệ (Myth of 3D / WebGL):** Tài liệu đặc tả (`TECHNICAL_ANALYSIS_PROPOSAL.md`, `README.md`) quảng bá rầm rộ về "Mô hình phòng 3D tương tác WebGL & Three.js", nhưng `package.json` **hoàn toàn không có Three.js**. Tệp `Japanese3DRoom.tsx` (54.8 KB) thực chất chỉ là một Modal 2D thuần HTML/CSS chứa ảnh tĩnh và thẻ chữ.
3. **Mã chết và tính năng bị bỏ rơi (Abandoned Features & Dead Code):** Tính năng gia sư AI *Aoi Sensei* (`/app/sensei`) với hơn 37 KB mã nguồn (`SenseiClient.tsx` 21 KB + `api/ai/chat/route.ts` 16.5 KB) bị khóa cứng bằng lệnh `redirect("/app/grammar")`. Nhiều bảng CSDL (`RoomItem`, `CollectionItem`, `KanaStroke`, `LessonItem`) có **0 bản ghi**, không có API và không có UI.
4. **Bỏ qua CSDL (Database Bypass):** Chế độ sinh tồn (`/app/survival`) truy vấn bảng `Scenario` từ Prisma, nhưng client component `SurvivalClient.tsx` (42.8 KB) lại bỏ qua toàn bộ dữ liệu này và sử dụng một mảng `REAL_SCENARIOS` hardcode tĩnh.
5. **Rủi ro vận hành & Lỗi Múi Giờ (Timezone Bug):** Có tới 3 cách tính ngày khác nhau giữa trang Dashboard và các API hoàn thành bài tập/ôn tập. Người dùng học tập tại Việt Nam (GMT+7) vào khung giờ 00:00 - 07:00 sáng sẽ bị tính sai ngày, khiến nhiệm vụ hàng ngày (Daily Missions) không bao giờ hoàn thành.
6. **Sự trùng lặp và xung đột UX:** Trang `/register` đã bắt người dùng chọn Trình độ (N5-N3), Mục tiêu và Thời gian học, nhưng ngay sau khi đăng nhập, hệ thống lại chuyển hướng sang `/onboarding` bắt người dùng chọn lại đúng 3 câu hỏi đó một lần nữa.

---

## 2. CURRENT PRODUCT STRUCTURE (CẤU TRÚC SẢN PHẨM HIỆN TẠI)

### 2.1. Cây thư mục tổng thể
```text
D:\Projects\nihon-lengs
├── app/                          # Next.js 14.2 App Router
│   ├── api/                      # Backend REST API Routes (19 endpoints)
│   │   ├── account/              # Cập nhật thông tin & xóa tài khoản
│   │   │   └── password/         # Đổi mật khẩu
│   │   ├── achievements/         # Danh sách & kích hoạt thành tựu
│   │   ├── activity/             # Điểm danh streak hàng ngày
│   │   ├── ai/chat/              # Sensei AI Gemini API & fallback engine
│   │   ├── auth/                 # NextAuth route & đăng ký tài khoản
│   │   ├── journey/              # API lấy địa danh Shinkansen
│   │   │   └── progress/         # Mở khóa, đóng dấu địa danh
│   │   ├── kana/                 # Danh sách Kana
│   │   │   └── practice/         # Ghi nhận luyện viết/phát âm Kana
│   │   ├── lessons/              # Danh sách bài học
│   │   │   └── complete/         # Nộp bài tập & chấm điểm trắc nghiệm
│   │   ├── me/                   # Thông tin user hiện tại
│   │   ├── missions/             # Nhiệm vụ hàng ngày (Daily Missions)
│   │   ├── review/               # SRS Flashcards review
│   │   │   └── add/              # Thêm từ vựng/kanji vào SRS
│   │   └── survival/progress/    # Hoàn thành kịch bản sinh tồn
│   ├── app/                      # Protected Routes (Dashboard & Features)
│   │   ├── ActivityButton.tsx    # Nút bấm điểm danh Streak thủ công
│   │   ├── loading.tsx           # Fallback loading toàn app
│   │   ├── page.tsx              # Trang Dashboard trung tâm
│   │   ├── stub.tsx              # Component Dead code (không dùng)
│   │   ├── grammar/              # Tra cứu ngữ pháp N5 - N3
│   │   ├── journey/              # Bản đồ văn hóa Shinkansen (cityData 102KB)
│   │   ├── leaderboard/          # Bảng xếp hạng XP tuần & mọi thời đại
│   │   ├── learn/                # Kana Lab (bảng 50 âm & Canvas tập viết)
│   │   ├── practice/             # Danh sách bài học theo Unit
│   │   │   └── [slug]/           # Trình làm bài trắc nghiệm (QuizRunner)
│   │   ├── profile/              # Hồ sơ cá nhân & đổi mật khẩu
│   │   ├── review/               # Hàng đợi ôn tập Spaced Repetition (SRS)
│   │   ├── sensei/               # Route AI Sensei (đã bị bỏ hoang, redirect)
│   │   ├── survival/             # Kịch bản đối thoại sinh tồn
│   │   └── vocabulary/           # Từ điển Từ vựng & Hán tự N5 - N3
│   ├── forgot-password/          # Giao diện quên mật khẩu (chưa nối backend)
│   ├── login/                    # Trang đăng nhập Credentials
│   ├── onboarding/               # Wizard khảo sát 3 bước sau đăng ký
│   ├── register/                 # Trang đăng ký tài khoản
│   ├── error.tsx                 # Error Boundary
│   ├── globals.css               # CSS biến số, Seigaiha pattern, Glassmorphism
│   ├── layout.tsx                # Root layout, Google Fonts (Plus Jakarta Sans, Noto Sans JP)
│   ├── not-found.tsx             # Trang 404 tùy biến phong cách Zen
│   └── page.tsx                  # Landing page giới thiệu ứng dụng
├── components/                   # Reusable & Feature UI Components
│   ├── AppNav.tsx                # Thanh điều hướng Desktop & Mobile Drawer
│   ├── Japanese3DRoom.tsx        # Modal văn hóa 2D (tên nhầm là 3D Room) (54.8 KB)
│   ├── KanaCanvas.tsx            # Bảng vẽ nét chữ Kana 2D HTML5 Canvas (26 KB)
│   ├── Providers.tsx             # NextAuth SessionProvider & Sound/Theme Provider
│   ├── SoundAndThemeContext.tsx  # Web Audio API Synthesizer, Toast & Dark Mode
│   └── ui.tsx                    # Design System Primitives (Button, Card, Badge, Modal...)
├── lib/                          # Business Logic & Helpers
│   ├── auth-options.ts           # Cấu hình NextAuth JWT & Credentials Provider
│   ├── auth.ts                   # Helper trích xuất userId từ session
│   ├── domain.test.ts            # Unit test Vitest
│   ├── journey.ts                # Điều kiện mở khóa địa danh Shinkansen
│   ├── level.ts                  # Thuật toán tính Level theo hàm bậc hai XP
│   ├── prisma.ts                 # Prisma Client Singleton
│   ├── quiz.ts                   # Thuật toán chấm trắc nghiệm & tính độ chính xác
│   ├── srs.ts                    # Thuật toán Spaced Repetition SM-2
│   ├── streak.ts                 # Thuật toán cộng dồn chuỗi ngày học liên tục
│   └── review/
│       └── resolveReviewItem.ts  # Ghép nối dữ liệu đa hình cho ReviewItem
├── prisma/                       # Database Schema & Seed
│   ├── dev.db                    # CSDL SQLite (880 KB)
│   ├── schema.prisma             # 21 Models
│   ├── seed.ts                   # Kịch bản nạp dữ liệu khởi tạo N5, N4, N3
│   └── seed-data/                # Dữ liệu tĩnh json/ts cho kana, vocab, kanji, grammar
└── scripts/                      # Utility Scripts
    ├── cleanup-orphan-review-items.ts # Dọn dẹp ReviewItem mồ côi
    └── db-check.cjs              # Kiểm tra số lượng bản ghi CSDL
```

### 2.2. Kiểm tra CSDL thực tế (Database Verification)
Kết quả truy vấn trực tiếp trên file CSDL `prisma/dev.db`:

| Nhóm dữ liệu | Bảng Prisma | Số bản ghi thực tế | Trạng thái sử dụng |
| :--- | :--- | :---: | :--- |
| **Người dùng** | `User` | 2 | Đang hoạt động |
| | `Profile` | 2 | Đang hoạt động |
| | `Account`, `Session` | 0 | Dự phòng NextAuth (hiện dùng JWT) |
| **Bảng chữ cái** | `Kana` | 175 | Hoạt động đầy đủ (N5 Hiragana/Katakana/Dakuten/Combo) |
| | `KanaStroke` | **0** | **CHẾT (Dead model)**: Không có dữ liệu, canvas vẽ tự do |
| **Bài học & Quiz** | `Lesson` | 34 | Hoạt động (N5, N4, N3) |
| | `Exercise` | 89 | Hoạt động (Trắc nghiệm 4 đáp án) |
| | `ExerciseOption` | 356 | Hoạt động |
| | `LessonItem` | **0** | **CHẾT (Dead model)**: Không dùng trong kịch bản học |
| | `ExerciseAttempt` | 0 | Ghi nhận khi người dùng làm bài |
| | `UserLessonProgress` | 0 | Ghi nhận khi hoàn thành bài |
| **Từ vựng & Hán tự** | `Vocabulary` | 104 | Hoạt động (kèm câu ví dụ) |
| | `Kanji` | 109 | Hoạt động (kèm âm On/Kun) |
| | `KanjiReading` | 218 | Hoạt động |
| **Ngữ pháp** | `Grammar` | 51 | Hoạt động (N5, N4, N3) |
| | `GrammarExample` | 102 | Hoạt động |
| **SRS Ôn tập** | `ReviewItem` | 11 | Hoạt động nhưng có rủi ro quan hệ lỏng lẻo |
| | `ReviewHistory` | 0 | Ghi nhận lịch sử đánh giá thẻ |
| **Hành trình & Văn hóa** | `JourneyLocation` | 9 | Hoạt động (Tokyo, Hakone, Kyoto...) |
| | `UserJourneyProgress` | 0 | Ghi nhận tiến độ mở khóa địa danh |
| **Kịch bản sinh tồn** | `Scenario` | 11 | **BỊ BỎ QUA**: Client dùng dữ liệu tĩnh trong file |
| | `ScenarioMessage` | 33 | **BỊ BỎ QUA**: Không dùng |
| | `ScenarioChoice` | 33 | **BỊ BỎ QUA**: Không dùng |
| | `UserScenarioProgress`| 0 | Chỉ dùng slug để đối chiếu id |
| **Gamification** | `DailyMission` | 3 | Hoạt động một phần (bị lỗi kích hoạt) |
| | `Achievement` | 8 | Hoạt động một phần (bị lỗi kích hoạt) |
| | `XpTransaction` | 0 | Ghi nhận lịch sử tăng XP |
| **Tính năng 3D/Phòng** | `RoomItem` | **0** | **CHẾT (Dead model)**: Không có code dùng |
| | `UserRoomItems` | **0** | **CHẾT (Dead model)**: Không có code dùng |
| | `CollectionItem` | **0** | **CHẾT (Dead model)**: Không có code dùng |
| | `UserCollection` | **0** | **CHẾT (Dead model)**: Không có code dùng |
| **AI Sensei** | `AiConversation` | 1 | **BỊ KHÓA**: Route `/app/sensei` redirect |
| | `AiMessage` | 0 | Bị khóa |

---

## 3. FEATURE INVENTORY (BẢNG KIỂM TÍNH NĂNG THỰC TẾ)

| Phân loại | Tính năng | File hiện thực | Trạng thái thực tế | Đánh giá giá trị học tập |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | Đăng ký tài khoản | `app/register/page.tsx`, `api/auth/register` | Hoạt động. Mã hóa bcrypt salt 12, kiểm tra độ mạnh mật khẩu. | Cần thiết. Tuy nhiên bắt nhập trùng lặp thông tin với Onboarding. |
| **Authentication** | Đăng nhập | `app/login/page.tsx`, `lib/auth-options.ts` | Hoạt động tốt qua NextAuth JWT. | Cần thiết. |
| **Authentication** | Quên mật khẩu | `app/forgot-password/page.tsx` | **GIẢ LẬP (Fake Flow)**: Có UI nhưng setTimeout 800ms rồi thông báo tính năng đang phát triển. | **Không có giá trị.** Tạo cảm giác chưa hoàn thiện. |
| **Onboarding** | Wizard định hướng | `app/onboarding/page.tsx`, `api/account` | Hoạt động. Lưu trình độ, mục tiêu, thời gian học. | **Bị trùng lặp:** Lặp lại 100% các câu hỏi ở bước đăng ký. |
| **Dashboard** | Bento Grid Workspace | `app/app/page.tsx` | Hoạt động. Hiển thị bài học trọng tâm, 4 tile luyện tập, XP bar, Nhiệm vụ, Shinkansen. | Trực quan nhưng nhồi nhét quá nhiều thẻ, gây ngợp thị giác. |
| **Lessons & Practice** | Danh mục bài học theo Unit | `app/app/practice/page.tsx`, `PracticeClient.tsx` | Hoạt động. Phân chia theo Unit 1 - 5. | Khóa cứng theo `user.learningLevel`, không cho chuyển tab xem trình độ khác. |
| **Lessons & Practice** | Trình làm bài Quiz | `app/app/practice/[slug]/page.tsx`, `QuizRunner.tsx` | Hoạt động rất tốt. Hỗ trợ phím tắt số 1-4, Enter, giải thích ngữ pháp tức thì, phát âm TTS. | **Giá trị học tập cao nhất trong toàn bộ app.** |
| **Kana** | Bảng 50 âm Gojūon | `app/app/learn/page.tsx`, `KanaLab.tsx` | Hoạt động tốt. Chia Hiragana, Katakana, Biến âm, Âm ghép. Có âm thanh TTS điều chỉnh tốc độ. | Rất tốt cho người mới bắt đầu. |
| **Kana** | Bảng vẽ Canvas | `components/KanaCanvas.tsx` | Hoạt động tốt. Vẽ nét chữ bằng HTML5 2D Canvas, có lưới chữ điền, mẫu chữ mờ, Undo, Clear. | Tốt, nhưng kiểm tra độ chính xác chỉ dựa trên tỉ lệ diện tích pixel đã vẽ, không kiểm tra thứ tự nét thực tế. |
| **Vocabulary & Kanji** | Từ điển JLPT N5-N3 | `app/app/vocabulary/page.tsx`, `VocabKanjiClient.tsx` | Hoạt động tốt. Tra cứu từ vựng, âm On/Kun, số nét, câu ví dụ, phát âm TTS. Có nút "Lưu thẻ SRS". | Rất tốt. Tích hợp trực tiếp vào kho nhớ dài hạn. |
| **Grammar** | Sổ tay ngữ pháp | `app/app/grammar/page.tsx`, `GrammarClient.tsx` | Hoạt động tốt. Liệt kê cấu trúc, ý nghĩa, lỗi sai thường gặp, câu ví dụ có TTS. | Tốt nhưng **bị cô lập**: Không có nút lưu ngữ pháp vào SRS. |
| **SRS (Spaced Repetition)** | Ôn tập Flashcard SM-2 | `app/app/review/page.tsx`, `ReviewClient.tsx`, `lib/srs.ts` | Hoạt động tốt. Thẻ lật 3D 4 mức đánh giá (Again, Hard, Good, Easy), phân loại giai đoạn trí nhớ. | **Rất tốt.** Tuy nhiên phía server tải toàn bộ CSDL để map dữ liệu gây nghẽn hiệu năng. |
| **Gamification** | Chuỗi ngày học (Streak) | `lib/streak.ts`, `app/app/ActivityButton.tsx` | **BẤT THƯỜNG:** Chỉ tăng streak khi bấm nút "Điểm danh chuỗi ngày" trên Dashboard; làm bài học không tự tăng streak! | Gây ức chế: Người học làm bài chăm chỉ nhưng quên bấm nút thì bị đứt streak. |
| **Gamification** | Nhiệm vụ ngày (Missions) | `prisma/seed-data/meta.ts`, `api/missions` | **BỊ LỖI KÍCH HOẠT:** Tiến độ có tăng nhưng logic đổi trạng thái sang `COMPLETED` chỉ nằm ở `GET /api/missions` (không có trang nào gọi). | Người dùng làm xong nhiệm vụ nhưng không được nhận thưởng XP. |
| **Gamification** | Hệ thống Thành tựu | `api/achievements/route.ts` | **BỊ CÔ LẬP:** API kiểm tra và trao thành tựu chỉ được gọi khi bấm mở địa danh ở Journey. | Làm xong bài học hay luyện Kana không bao giờ mở khóa được thành tựu tương ứng. |
| **Gamification** | Cấp độ & Thanh XP | `lib/level.ts`, `components/ui.tsx (XPBar)` | Hoạt động tốt theo hàm bậc hai: $100 \times n + 50 \times n(n-1)$. | Tốt, tạo động lực rõ ràng. |
| **Gamification** | Bảng xếp hạng | `app/app/leaderboard/page.tsx`, `LeaderboardClient.tsx` | Hoạt động tốt. Có tab Xếp hạng Tuần và Mọi thời đại. | Tốt cho tính cạnh tranh. |
| **Culture & Journey** | Bản đồ Shinkansen | `app/app/journey/page.tsx`, `JourneyClient.tsx` | Hoạt động. Tích lũy XP để mở khóa 9 trạm dừng từ Tokyo đến Sapporo. Hiệu ứng cánh hoa anh đào rơi trên Canvas. | Tạo cảm hứng du lịch Nhật Bản. |
| **Culture & 3D** | "Không gian 3D Nhật Bản" | `components/Japanese3DRoom.tsx` (54.8 KB), `cityData.ts` (102 KB) | **SAI LỆCH ĐẶC TẢ:** Hoàn toàn không có 3D hay Three.js. Đây là một Modal 2D chứa thẻ ảnh Unsplash, thông tin ẩm thực, rút quẻ Omikuji và đóng dấu lưu niệm. | Thông tin văn hóa rất phong phú, nhưng tên gọi "3D Room" gây hiểu nhầm kỹ thuật. Kích thước file quá nặng. |
| **Survival Mode** | Hội thoại sinh tồn | `app/app/survival/page.tsx`, `SurvivalClient.tsx` | Hoạt động. Nhập vai gọi món ramen, hỏi đường, mua thuốc, đi taxi. Có nhận diện giọng nói qua Web Speech API. | Tương tác tốt, nhưng bỏ qua CSDL và hardcode 100% kịch bản trong code client. |
| **AI Sensei** | Trợ lý gia sư AI Aoi | `app/app/sensei/page.tsx`, `SenseiClient.tsx`, `api/ai/chat` | **BỊ KHÓA & BỎ HOANG:** Tệp `page.tsx` chỉ có 6 dòng điều hướng về `/app/grammar`. Client 21 KB và Route API 16.5 KB bị bỏ xó. | **Lãng phí tài nguyên và gây thất vọng cho người dùng.** |
| **Profile & Settings** | Hồ sơ & Cài đặt | `app/app/profile/page.tsx`, `ProfileForm.tsx`, `DangerZone.tsx` | Hoạt động cơ bản. Đổi mật khẩu, xóa tài khoản. | Ngôn ngữ Anh - Việt lẫn lộn. Lỗi không đồng bộ theme với context toàn cục. |

---

## 4. PAGE AUDIT (KIỂM TOÁN TỪNG ROUTE / TRANG)

### 4.1. Trang Chủ / Landing Page (`/`)
* **PURPOSE:** Giới thiệu sản phẩm, tạo ấn tượng ban đầu và chuyển đổi khách vãng lai thành người dùng đăng ký.
* **PRIMARY USER:** Người học tiếng Nhật mới ghé thăm website lần đầu.
* **PRIMARY ACTION:** Bấm "Bắt đầu hành trình miễn phí 🚀" hoặc "Tạo tài khoản 🌸".
* **CURRENT UX:** Thiết kế banner Hero phong cách Torii màu Sakura nổi bật, hiển thị lưới tính năng đột phá, cam kết chuẩn 50 âm Gojuon và SRS.
* **PROBLEMS:** Nút "Vào Dashboard ứng dụng ⛩️" dẫn thẳng vào `/app`. Nếu chưa đăng nhập, người dùng bị NextAuth đẩy gián tiếp sang `/login?callbackUrl=%2Fapp`, gây bất ngờ.
* **DUPLICATION:** Không có.
* **COGNITIVE LOAD:** Vừa phải, thông điệp rõ ràng.
* **MOBILE ISSUES:** Banner khá dài trên màn hình dọc, cần cuộn 3-4 màn hình để xem hết tính năng.
* **RECOMMENDATION:** **KEEP & SIMPLIFY**. Giữ nguyên thiết kế thẩm mỹ; chỉnh nút CTA hướng thẳng tới `/register`.

---

### 4.2. Trang Đăng Nhập (`/login`)
* **PURPOSE:** Xác thực người dùng bằng Email và Mật khẩu.
* **PRIMARY USER:** Người dùng đã có tài khoản.
* **PRIMARY ACTION:** Nhập thông tin và bấm nút Đăng nhập.
* **CURRENT UX:** Form kính mờ (Glassmorphism), có thông báo xanh khi vừa đăng ký xong (`?registered=true`), có nút ẩn/hiện mật khẩu.
* **PROBLEMS:** Không dùng component chuẩn `Button` từ `@/components/ui`, viết lặp lại thẻ `<button>` với class Tailwind riêng.
* **DUPLICATION:** Không có.
* **COGNITIVE LOAD:** Thấp.
* **MOBILE ISSUES:** Tốt.
* **RECOMMENDATION:** **KEEP & STANDARDIZE**. Chuẩn hóa nút bấm dùng chung `Button`.

---

### 4.3. Trang Đăng Ký (`/register`)
* **PURPOSE:** Tạo tài khoản học viên mới.
* **PRIMARY USER:** Người học mới bắt đầu.
* **PRIMARY ACTION:** Điền thông tin cá nhân và đăng ký.
* **CURRENT UX:** Form dài bao gồm: Họ tên, Email, Mật khẩu (có thanh đo độ mạnh mật khẩu), Xác nhận mật khẩu, Chọn trình độ (N5, N4, N3), Chọn mục tiêu (Du lịch, JLPT, Giao tiếp, Văn hóa) và Thời gian học mỗi ngày.
* **PROBLEMS:** **Xung đột luồng UX cực nặng.** Bắt người dùng chọn Trình độ, Mục tiêu, Thời gian học nhưng sau khi đăng ký xong lại chuyển họ sang `/onboarding` bắt chọn lại đúng 3 thông tin này!
* **DUPLICATION:** Trùng lặp 100% dữ liệu thu thập với trang `/onboarding`.
* **COGNITIVE LOAD:** **Quá cao đối với một form đăng ký.** Người dùng muốn vào học nhanh lại phải điền một form dài ngoằng.
* **MOBILE ISSUES:** Form cuộn rất dài trên điện thoại, dễ khiến người dùng bỏ cuộc giữa chừng.
* **RECOMMENDATION:** **SIMPLIFY**. Rút gọn trang đăng ký về đúng 3 trường thiết yếu: Tên, Email, Mật khẩu. Chuyển toàn bộ phần cá nhân hóa lộ trình về cho `/onboarding` xử lý.

---

### 4.4. Trang Khảo Sát Định Hướng (`/onboarding`)
* **PURPOSE:** Cá nhân hóa lộ trình học tiếng Nhật theo 3 bước tương tác trực quan.
* **PRIMARY USER:** Người dùng vừa đăng ký thành công lần đầu.
* **PRIMARY ACTION:** Chọn Trình độ → Chọn Mục tiêu → Chọn Thời lượng học → Bắt đầu.
* **CURRENT UX:** Giao diện Wizard 3 bước cực kỳ đẹp mắt, có thanh tiến trình gradient sakura, thẻ bấm có icon và giải thích chi tiết.
* **PROBLEMS:** Bị thừa thãi vì người dùng vừa mới phải chọn những thứ này ở trang `/register`. Nếu người dùng đã chọn ở trang đăng ký, bước này trở thành sự tra tấn trải nghiệm.
* **DUPLICATION:** Nhân đôi thao tác với `/register`.
* **COGNITIVE LOAD:** Thấp nếu đi độc lập, nhưng gây ức chế cao vì bị lặp lại.
* **MOBILE ISSUES:** Hoạt động mượt mà, kích thước thẻ bấm chuẩn ngón tay (Touch Target).
* **RECOMMENDATION:** **KEEP & MERGE WORKFLOW**. Giữ nguyên giao diện Wizard này làm bước khảo sát sau đăng ký, đồng thời loại bỏ phần khảo sát trùng lặp ở trang `/register`.

---

### 4.5. Trang Quên Mật Khẩu (`/forgot-password`)
* **PURPOSE:** Khôi phục mật khẩu qua email.
* **PRIMARY USER:** Người dùng quên mật khẩu.
* **PRIMARY ACTION:** Nhập email và bấm gửi yêu cầu.
* **CURRENT UX:** Form nhập email, bấm xong hiện thông báo "Yêu cầu đã được ghi nhận... tính năng gửi email đang được phát triển".
* **PROBLEMS:** **Tính năng giả (Mock/Stub).** Không có token reset, không gửi mail, không có bảng CSDL lưu mã khôi phục.
* **DUPLICATION:** Không có.
* **COGNITIVE LOAD:** Thấp.
* **MOBILE ISSUES:** Không có.
* **RECOMMENDATION:** **SIMPLIFY / TEMPORARY REMOVE LINK**. Tạm thời ẩn liên kết "Quên mật khẩu?" trên trang đăng nhập hoặc thay bằng hướng dẫn liên hệ trực tiếp quản trị viên, tránh để người dùng bấm vào một tính năng không có thật.

---

### 4.6. Dashboard Trung Tâm (`/app`)
* **PURPOSE:** Trung tâm điều khiển toàn bộ quá trình học tập: gợi ý bài tiếp theo, điểm danh, truy cập nhanh các phân hệ, theo dõi tiến độ tuần.
* **PRIMARY USER:** Tất cả học viên sau khi đăng nhập.
* **PRIMARY ACTION:** Bấm "Tiếp tục bài học →" trên thẻ trọng tâm ngày (Today's Focus).
* **CURRENT UX:** Bố cục 2 cột Bento Grid:
  - Cột trái: Thẻ bài học trọng tâm + 4 ô truy cập nhanh (SRS, Kana Lab, Vocab/Kanji, Survival Mode).
  - Cột phải: Cấp độ & Thanh XP, Nhiệm vụ hàng ngày, Bản đồ mini Shinkansen.
* **PROBLEMS:**
  1. **Quá tải thị giác (Visual Noise):** Quá nhiều card, quá nhiều badge, quá nhiều thanh tiến trình nhấp nháy trên một màn hình.
  2. **Bỏ quên tính năng:** Phân hệ "Ngữ pháp" có trên thanh điều hướng nhưng hoàn toàn vắng mặt ở Dashboard.
  3. **Lỗi logic Streak:** Nút "Điểm danh chuỗi ngày" đứng độc lập bên cạnh biểu tượng lửa. Học viên học xong bài không được tính streak nếu không tự tay ấn nút này.
  4. **Nhiệm vụ không bao giờ hoàn thành:** Thanh tiến trình nhiệm vụ có thể đạt 100% nhưng trạng thái vẫn là `IN_PROGRESS` vì thiếu lời gọi cập nhật.
* **DUPLICATION:** Tile Shinkansen ở cột phải trùng chức năng dẫn về `/app/journey`.
* **COGNITIVE LOAD:** **Rất cao.** Người học bước vào không biết nên ưu tiên làm gì trước: ôn thẻ SRS, luyện vẽ Kana, làm bài học hay chơi sinh tồn.
* **MOBILE ISSUES:** Cột phải bị đẩy xuống tận đáy màn hình điện thoại, khiến người dùng mobile không thấy được Nhiệm vụ hàng ngày và thanh XP.
* **RECOMMENDATION:** **SIMPLIFY & REORGANIZE**. Giảm bớt số lượng card phụ; đặt CTA học bài và đếm ngược thẻ SRS lên hàng đầu; tự động hóa nút điểm danh.

---

### 4.7. Trang Kana Lab (`/app/learn`)
* **PURPOSE:** Học và luyện viết toàn bộ hệ thống chữ cái Hiragana, Katakana, Âm đục (Dakuten) và Âm ghép (Combo/Yoon).
* **PRIMARY USER:** Người mới bắt đầu học tiếng Nhật (trình độ N5).
* **PRIMARY ACTION:** Nhấp vào ký tự để nghe phát âm, bấm icon bút để mở Canvas tập viết.
* **CURRENT UX:** Bảng 50 âm Gojūon chuẩn chia theo hàng nguyên âm a-i-u-e-o. Tích hợp thanh điều chỉnh tốc độ phát âm (0.75x - 1.25x). Modal Canvas vẽ nét chữ tương tác mượt mà.
* **PROBLEMS:**
  1. URL là `/app/learn` nhưng nội dung chỉ có Bảng chữ cái Kana (nên là `/app/kana`).
  2. Bảng `KanaStroke` trong CSDL hoàn toàn trống rỗng; Canvas chỉ kiểm tra tỷ lệ diện tích nét mực đã bao phủ chứ không kiểm tra được thứ tự nét viết (stroke order) như cam kết trong tài liệu.
* **DUPLICATION:** Không có.
* **COGNITIVE LOAD:** Tốt, chia tab rõ ràng.
* **MOBILE ISSUES:** Lưới 5 cột trên màn hình điện thoại nhỏ bị co hẹp, bấm dễ bị nhầm giữa các ký tự cạnh nhau.
* **RECOMMENDATION:** **KEEP & ENHANCE ACCURACY**. Giữ nguyên tính năng vì đây là phân hệ hoạt động rất ổn định; đổi nhãn điều hướng thành rõ ràng là "Bảng Chữ Cái Kana".

---

### 4.8. Trang Danh Mục Bài Học (`/app/practice`)
* **PURPOSE:** Danh mục lộ trình bài học JLPT theo từng Unit chuyên đề.
* **PRIMARY USER:** Học viên theo học lộ trình bài bản.
* **PRIMARY ACTION:** Chọn bài học tiếp theo để vào làm trắc nghiệm.
* **CURRENT UX:** Danh sách bài học chia theo Unit (ví dụ N5 có 5 Unit: Nhập môn, Cuộc sống, Mua sắm, Du lịch, Giao tiếp nâng cao). Có thanh tìm kiếm và bộ lọc trạng thái (Đã xong, Chưa xong).
* **PROBLEMS:** **Khóa cứng trình độ.** Nếu tài khoản là N5, học viên không thể xem bài học N4 hoặc N3 dù chỉ để tham khảo trước, trừ khi phải vào Settings đổi trình độ học. Trong khi đó, các trang Từ vựng và Ngữ pháp lại cho phép chuyển đổi tab N5/N4/N3 tự do.
* **DUPLICATION:** Trùng lặp phần nào với thẻ "Today's Focus" trên Dashboard.
* **COGNITIVE LOAD:** Vừa phải.
* **MOBILE ISSUES:** Tốt, danh sách bài cuộn dọc mượt mà.
* **RECOMMENDATION:** **KEEP & UNLOCK TABS**. Cho phép người học tự do chuyển tab giữa các cấp độ N5, N4, N3 mà không cần đổi profile.

---

### 4.9. Trang Làm Bài Quiz (`/app/practice/[slug]`)
* **PURPOSE:** Không gian khảo sát phản xạ: làm bài trắc nghiệm kiểm tra kiến thức ngữ pháp, từ vựng và đàm thoại của từng bài.
* **PRIMARY USER:** Học viên đang học một bài cụ thể.
* **PRIMARY ACTION:** Chọn đáp án A, B, C, D (hoặc bấm phím 1, 2, 3, 4) và nhấn Enter kiểm tra.
* **CURRENT UX:** Trải nghiệm kiểm tra xuất sắc:
  - Thanh tiến trình câu hỏi.
  - Phím tắt bàn phím tiện lợi cho Desktop.
  - Phản hồi âm thanh đúng/sai tức thì (Web Audio API).
  - Khung phân tích ngữ cảnh ngữ pháp tương ứng với từng đáp án.
  - Phát âm TTS câu hỏi tiếng Nhật.
* **PROBLEMS:** **Cơ chế kết nối SRS bị lệch một chiều.** Chỉ những câu hỏi làm SAI mới được đưa vào hàng đợi ôn tập SRS (`ReviewItem`), câu làm ĐÚNG không bao giờ được đưa vào SRS để củng cố định kỳ.
* **DUPLICATION:** Không có.
* **COGNITIVE LOAD:** Tối ưu, tập trung cao độ vào từng câu hỏi.
* **MOBILE ISSUES:** Trên mobile không dùng được phím tắt số 1-4 nhưng các nút bấm lựa chọn kích thước lớn, thao tác một tay rất thuận tiện.
* **RECOMMENDATION:** **KEEP AS CORE ENGINE**. Đây là thành phần hoàn thiện và chất lượng nhất dự án.

---

### 4.10. Trang Ôn Tập Lặp Lại Cách Khoảng (`/app/review`)
* **PURPOSE:** Ôn tập kiến thức dài hạn bằng phương pháp Spaced Repetition (thuật toán SM-2).
* **PRIMARY USER:** Học viên có thẻ bài đến hạn ôn tập.
* **PRIMARY ACTION:** Lật thẻ xem đáp án và tự đánh giá (Again, Hard, Good, Easy).
* **CURRENT UX:** Thẻ Flashcard hiệu ứng lật 3D (CSS preserve-3d), hiển thị phân cấp trí nhớ (Mới tiếp thu, Đang quen, Nhớ sâu, Trí nhớ vĩnh viễn). Thẻ đánh giá "Again" sẽ tự động quay lại cuối hàng đợi trong cùng phiên học.
* **PROBLEMS:**
  1. **Hiểm họa hiệu năng CSDL (Database Overload Hazard):** Mỗi lần tải trang `/app/review`, Server Component thực hiện 5 câu truy vấn `findMany()` không giới hạn trên toàn bộ bảng `Kana`, `Vocabulary`, `Kanji`, `Grammar`, `Exercise` để dựng Map tra cứu trong bộ nhớ chỉ nhằm hiển thị tối đa 30 thẻ!
  2. **Dữ liệu mồ côi (Orphan Records):** Bảng `ReviewItem` dùng trường quan hệ đa hình lỏng lẻo (`contentType` và `contentId` kiểu String, không có Foreign Key). Khi seed lại dữ liệu, thẻ ôn tập biến thành bản ghi rác.
* **DUPLICATION:** Không có.
* **COGNITIVE LOAD:** Thấp, rất dễ sử dụng.
* **MOBILE ISSUES:** Thao tác lật thẻ và bấm 4 nút đánh giá ở chân màn hình hoạt động tốt trên điện thoại.
* **RECOMMENDATION:** **KEEP & FIX BACKEND QUERY**. Giữ nguyên UI Flashcard; viết lại câu truy vấn backend chỉ fetch đúng các ID cần thiết thay vì tải toàn bộ CSDL.

---

### 4.11. Trang Kho Từ Vựng & Hán Tự (`/app/vocabulary`)
* **PURPOSE:** Tra cứu từ vựng và chữ Hán JLPT N5, N4, N3; học cách phát âm và lưu vào SRS.
* **PRIMARY USER:** Học viên tra cứu hoặc mở rộng vốn từ.
* **PRIMARY ACTION:** Tìm kiếm từ, nghe đọc âm thanh, bấm "Lưu thẻ Flashcard".
* **CURRENT UX:** Chia 2 tab Từ vựng và Hán tự, lọc theo cấp độ N5/N4/N3, tìm kiếm theo Romaji/Nghĩa tiếng Việt. Nút bấm "Lưu thẻ" hoạt động mượt mà và kết nối trực tiếp với `/api/review/add`.
* **PROBLEMS:** Khi bấm "Lưu thẻ", trạng thái lưu chỉ lưu trong state React cục bộ của trang, nếu tải lại trang hoặc sang trang khác quay lại thì không nhận diện được từ nào đã lưu từ trước.
* **DUPLICATION:** Không có.
* **COGNITIVE LOAD:** Vừa phải.
* **MOBILE ISSUES:** Lưới thẻ 2 cột trên mobile hơi chật, nên chuyển thành 1 cột trên màn hình nhỏ.
* **RECOMMENDATION:** **KEEP & POLISH**. Tính năng hữu ích, cần cải thiện lưu trạng thái `isSaved` từ server.

---

### 4.12. Trang Sổ Tay Ngữ Pháp (`/app/grammar`)
* **PURPOSE:** Tra cứu điểm ngữ pháp theo chuẩn JLPT N5, N4, N3.
* **PRIMARY USER:** Học viên ôn lại cấu trúc câu hoặc tra cứu mẫu câu mới.
* **PRIMARY ACTION:** Nhấp mở rộng card ngữ pháp để đọc giải thích, cấu trúc và câu ví dụ.
* **CURRENT UX:** Danh sách card ngữ pháp dạng Accordion đóng/mở êm ái, có ví dụ kèm Romaji và nút nghe đọc phát âm.
* **PROBLEMS:**
  1. Thanh điều hướng `AppNav` ghi cứng nhãn: "Ngữ Pháp N5" kèm badge "N5", trong khi bên trong trang hỗ trợ cả N5, N4 và N3!
  2. **Bị đứt kết nối SRS:** Hoàn toàn không có nút "Lưu vào SRS" như bên trang Từ vựng, dù helper `resolveReviewItem.ts` đã viết sẵn logic hỗ trợ `contentType === "GRAMMAR"`.
* **DUPLICATION:** Không có.
* **COGNITIVE LOAD:** Rất tốt, phân cấp thông tin rõ ràng.
* **MOBILE ISSUES:** Hoạt động tốt.
* **RECOMMENDATION:** **KEEP, RENAME NAV & CONNECT SRS**. Đổi tên trên thanh điều hướng thành "Ngữ Pháp", bổ sung nút "Lưu vào SRS" cho từng điểm ngữ pháp.

---

### 4.13. Trang Bản Đồ Văn Hóa Shinkansen (`/app/journey`)
* **PURPOSE:** Trải nghiệm du lịch văn hóa Nhật Bản kết hợp gamification (trò chơi hóa tiến trình học).
* **PRIMARY USER:** Học viên muốn khám phá văn hóa, địa danh, ẩm thực Nhật.
* **PRIMARY ACTION:** Tích lũy XP để mở khóa các trạm tàu: Tokyo → Hakone → Kyoto → Osaka → Hiroshima → Fukuoka → Sapporo...
* **CURRENT UX:** Tuyến đường sắt Shinkansen đồ họa đẹp mắt, có hiệu ứng hạt cánh hoa anh đào rơi trên Canvas (`SakuraFallCanvas`), mở ra Modal văn hóa chi tiết cho từng thành phố.
* **PROBLEMS:**
  1. Component bên trong mang tên `Japanese3DRoom` nhưng thực chất không có 3D.
  2. Kích thước file dữ liệu `cityData.ts` lên tới **102 KB mã tĩnh**, chứa lượng văn bản khổng lồ làm phình to gói bundle Javascript tải về máy người dùng.
* **DUPLICATION:** Thẻ tóm tắt trên Dashboard trùng lặp với trang này.
* **COGNITIVE LOAD:** Cao nếu mở Modal văn hóa (quá nhiều tab: Ẩm thực, Di tích, Rút quẻ, Lịch sử, Nghi thức).
* **MOBILE ISSUES:** Modal văn hóa bị tràn màn hình trên một số dòng điện thoại nhỏ; nút đóng bị che khuất nếu cuộn xuống sâu.
* **RECOMMENDATION:** **KEEP AS CULTURAL MODULE, REMOVE "3D" LABEL & LAZY LOAD DATA**. Đổi tên gọi thành "Không Gian Khám Phá Văn Hóa"; tách nhỏ `cityData.ts` để tải bất đồng bộ (dynamic import) khi người dùng bấm vào thành phố tương ứng.

---

### 4.14. Trang Chế Độ Sinh Tồn (`/app/survival`)
* **PURPOSE:** Luyện phản xạ đối đáp tiếng Nhật trong các tình huống đời thực (nhà hàng ramen, nhà ga, hiệu thuốc, taxi).
* **PRIMARY USER:** Người học chuẩn bị đi du lịch hoặc muốn luyện hội thoại thực tế.
* **PRIMARY ACTION:** Đọc lời thoại của NPC, chọn câu trả lời (Lịch sự / Thân mật / Cộc lốc) hoặc bấm Micro để nói trực tiếp bằng tiếng Nhật.
* **CURRENT UX:** Giao diện mô phỏng khung chat đối thoại sinh động, chấm điểm theo mức độ lịch sự của văn hóa Nhật (100đ - 60đ - 40đ), có tích hợp Web Speech Recognition API để nói trực tiếp.
* **PROBLEMS:**
  1. **Bỏ qua CSDL hoàn toàn (Database Bypass):** Trang server `page.tsx` truy vấn bảng `Scenario` từ Prisma rồi truyền vào client, nhưng `SurvivalClient.tsx` lại bỏ xó dữ liệu này và dùng mảng `REAL_SCENARIOS` hardcode cứng 965 dòng trong file!
  2. Badge trên trang ghi cứng "N5 Thực Chiến" dù kịch bản có nhiều mức độ khác nhau.
* **DUPLICATION:** Không có.
* **COGNITIVE LOAD:** Tốt, lối dẫn dắt nhập vai thú vị.
* **MOBILE ISSUES:** Tính năng nhận diện giọng nói (Microphone) hoạt động không đồng đều trên các trình duyệt mobile (iOS Safari chặn SpeechRecognition chuẩn).
* **RECOMMENDATION:** **KEEP & REFACTOR DATA SOURCE**. Đồng bộ kịch bản vào CSDL để quản lý tập trung, không hardcode trong client component; giữ tính năng nhập vai hội thoại vì có tính thực tiễn cao.

---

### 4.15. Trang Gia Sư AI Aoi Sensei (`/app/sensei`)
* **PURPOSE:** Trò chuyện, giải đáp thắc mắc ngữ pháp và sửa lỗi câu tiếng Nhật bằng AI.
* **PRIMARY USER:** Người học cần hỏi đáp tức thì với gia sư ảo.
* **PRIMARY ACTION:** *Không có hành động nào thực hiện được.*
* **CURRENT UX:** Khi truy cập `/app/sensei`, trang **ngay lập tức redirect sang `/app/grammar`**.
* **PROBLEMS:** **TÍNH NĂNG BỊ BỎ HOANG (GHOST FEATURE).**
  - Tệp `app/app/sensei/page.tsx` chỉ vỏn vẹn 6 dòng code để redirect.
  - Tệp `SenseiClient.tsx` (21 KB) với giao diện khung chat xịn xò, avatar Aoi Sensei, gợi ý câu hỏi mẫu hoàn toàn không được hiển thị.
  - Tệp `app/api/ai/chat/route.ts` (16.5 KB) chứa cấu hình Google Gemini API và bộ quy tắc luật ngữ pháp tiếng Nhật chạy fallback không bao giờ được gọi.
  - Không có bất kỳ liên kết nào dẫn tới trang này trên thanh menu hay Dashboard.
* **DUPLICATION:** Không có.
* **COGNITIVE LOAD:** Gây hoang mang nếu người dùng gõ URL trực tiếp.
* **MOBILE ISSUES:** N/A.
* **RECOMMENDATION:** **DECIDE: REVIVE OR REMOVE**. Hoặc là mở khóa lại trang này và gắn lên thanh điều hướng cho người học trò chuyện với AI, hoặc là xóa bỏ toàn bộ mã nguồn thừa thãi để tránh rác dự án.

---

### 4.16. Trang Bảng Xếp Hạng (`/app/leaderboard`)
* **PURPOSE:** Vinh danh học viên có điểm XP cao nhất, thúc đẩy tinh thần học tập.
* **PRIMARY USER:** Học viên thích thi đua gamification.
* **PRIMARY ACTION:** Xem thứ hạng bản thân so với các bạn học khác trong tuần và toàn khóa.
* **CURRENT UX:** Bảng xếp hạng phân loại Top 1 (Vàng), Top 2 (Bạc), Top 3 (Đồng), hiển thị Streak, Level và ảnh đại diện.
* **PROBLEMS:** Hiện tại CSDL chỉ có 2 người dùng thử nghiệm nên bảng xếp hạng còn đơn điệu; thiếu cơ chế phân chia bảng đấu theo giải đấu (Leagues) kiểu Duolingo.
* **DUPLICATION:** Không có.
* **COGNITIVE LOAD:** Thấp, dễ hiểu.
* **MOBILE ISSUES:** Hoạt động tốt.
* **RECOMMENDATION:** **KEEP & SIMPLIFY**. Giữ nguyên thiết kế gọn gàng hiện tại.

---

### 4.17. Trang Hồ Sơ Cá Nhân & Cài Đặt (`/app/profile`)
* **PURPOSE:** Quản lý thông tin tài khoản, đổi mục tiêu học tập, đổi mật khẩu và xóa tài khoản.
* **PRIMARY USER:** Người dùng muốn điều chỉnh thông tin cá nhân.
* **PRIMARY ACTION:** Cập nhật thông tin hoặc Đổi mật khẩu.
* **CURRENT UX:** Phân chia thành các Card: Thông tin tài khoản, Form cài đặt hồ sơ (Tên, Trình độ, Mục tiêu, Thời lượng học, Giao diện, Âm thanh), Form đổi mật khẩu và Vùng nguy hiểm (Đăng xuất, Xóa tài khoản).
* **PROBLEMS:**
  1. **Lệch pha ngôn ngữ trầm trọng:** Tiêu đề ghi `"Profile and settings"`, `"Signed in as"`, `"Log out"`, `"Delete account"` hoàn toàn bằng tiếng Anh, trong khi các trang khác 100% tiếng Việt.
  2. **Lỗi đồng bộ Theme:** Hàm `applyTheme` trong `ProfileForm.tsx` chỉnh trực tiếp class `dark` của thẻ `<html>` mà **không gọi hàm `setTheme` của `SoundAndThemeContext`**, khiến theme bị nhảy lại như cũ khi chuyển trang.
  3. Sử dụng lệnh nguyên thủy `confirm()` của trình duyệt khi xóa tài khoản thay vì Modal của Design System.
* **DUPLICATION:** Không có.
* **COGNITIVE LOAD:** Vừa phải.
* **MOBILE ISSUES:** Các nút bấm ở Danger Zone hơi sát nhau, dễ bấm nhầm giữa Đăng xuất và Xóa tài khoản.
* **RECOMMENDATION:** **SIMPLIFY & STANDARDIZE**. Việt hóa toàn bộ giao diện; sửa lỗi đồng bộ `SoundAndThemeContext`; đưa hộp thoại xác nhận xóa tài khoản vào Modal chuẩn.

---

## 5. COMPONENT AUDIT (KIỂM TOÁN THÀNH PHẦN GIAO DIỆN)

### 5.1. Bảng phân tích các thành phần dùng chung (`components/`)

| Tên Component | File | Kích thước | Trạng thái | Vấn đề phát hiện |
| :--- | :--- | :---: | :--- | :--- |
| `Button` | `components/ui.tsx` | 58 dòng | Tốt | Đầy đủ variant (`primary`, `sakura`, `gold`, `danger`...). Tuy nhiên **nhiều trang không dùng** mà tự viết thẻ `<button>` riêng (`login`, `register`, `forgot-password`, `DangerZone`, `error.tsx`). |
| `Card` | `components/ui.tsx` | 24 dòng | Tốt | Hỗ trợ hiệu ứng `hover`, viền phát sáng `glow`. Được dùng rộng rãi nhưng đôi khi bị lồng ghép thẻ `div` bọc ngoài không cần thiết. |
| `Badge` | `components/ui.tsx` | 24 dòng | Tốt | Màu sắc hài hòa (`sakura`, `fuji`, `matcha`, `amber`, `torii`). |
| `PageTitle` | `components/ui.tsx` | 26 dòng | Tốt | Chuẩn hóa header trang gồm tiêu đề, phụ đề, badge và nút action. |
| `Modal` | `components/ui.tsx` | 52 dòng | Tốt | Hộp thoại kính mờ đẹp mắt, có phím tắt ESC và click outside để đóng. |
| `AppNav` | `components/AppNav.tsx` | 376 dòng (16.9 KB) | Khá cồng kềnh | 5 mục menu chính + 1 dropdown "Khám phá" + 3 nút tiện ích bên phải + Thanh bar mobile + Drawer bottom sheet mobile. Nhãn menu ghi cứng "Ngữ Pháp N5" gây hiểu nhầm. Bỏ quên link dẫn tới AI Sensei. |
| `Japanese3DRoom` | `components/Japanese3DRoom.tsx` | **1,151 dòng (54.8 KB)** | **Quá phức tạp & Sai tên** | **Không có 3D.** Toàn bộ là Modal 2D chứa các tab ảnh, ẩm thực, lịch sử, rút quẻ. Chứa quá nhiều state nội bộ (omikuji, stamp, activeSection, detailItem). Cần đổi tên thành `CulturalDetailModal`. |
| `KanaCanvas` | `components/KanaCanvas.tsx` | **573 dòng (26 KB)** | Tốt nhưng nặng | Canvas 2D mượt mà, nhưng phần lớn logic tính toán tọa độ lưới và render nét chữ chiếm dung lượng lớn. |
| `SoundAndThemeContext` | `components/SoundAndThemeContext.tsx` | 267 dòng (8.8 KB) | Tốt | Sử dụng Web Audio API tổng hợp âm thanh cực nhẹ, không tốn băng thông tải file mp3. Tuy nhiên state Theme bị các component khác ghi đè trực tiếp vào DOM gây mất đồng bộ. |
| `ActivityButton` | `app/app/ActivityButton.tsx` | 43 dòng (1.1 KB) | Lỗi logic UX | Nút bấm điểm danh độc lập, phá vỡ logic tự động tính streak khi hoàn thành bài học. |
| `stub.tsx` | `app/app/stub.tsx` | 13 dòng (0.5 KB) | **MÃ CHẾT (Dead Code)** | Hoàn toàn không được import ở bất kỳ đâu trong toàn bộ dự án. |
| `SenseiClient` | `app/app/sensei/SenseiClient.tsx` | **493 dòng (21 KB)** | **MÃ BỊ BỎ RƠI** | Component chat AI hoàn chỉnh với bubble chat, markdown preview, gợi ý câu hỏi nhưng trang cha bị redirect nên không bao giờ render. |

### 5.2. Sự thiếu nhất quán về Typography, Spacing & Styles
* **Typography:**
  - Tiêu đề các trang lúc dùng tiếng Anh (`"Profile and settings"`, `"Real kana from the database"`), lúc dùng tiếng Việt (`"Kho Từ Vựng & Hán Tự"`, `"Chế Độ Sinh Tồn"`).
  - Phông chữ tiếng Nhật `jp-text` (`Noto Sans JP`) chỉ được gán thủ công ở một vài chỗ rải rác (`app/app/grammar/page.tsx`, `app/globals.css`), khiến một số ký tự Kanji ở các trang khác bị hiển thị fallback theo font chữ Hán của hệ điều hành trông rất thô.
* **Spacing:**
  - Layout chính (`app/layout.tsx`) đã bọc padding: `px-4 py-6 sm:px-8 sm:py-8`. Tuy nhiên một số trang con (`app/onboarding`, `app/forgot-password`, `app/error.tsx`) lại định nghĩa `min-h-screen p-4` hoặc `p-8` riêng, tạo ra khoảng đệm kép gây lãng phí không gian hiển thị.
* **Bọc lót thẻ thừa thãi (Unnecessary Wrappers):**
  - Trong `Japanese3DRoom.tsx` và `JourneyClient.tsx`, có rất nhiều tầng thẻ `div` lồng nhau chỉ để làm hiệu ứng backdrop blur và background gradient, làm cây DOM phình to hơn 1,500 nút (vượt ngưỡng khuyến nghị Lighthouse).

---

## 6. LEARNING FLOW AUDIT (PHÂN TÍCH VÒNG LẶP HỌC TẬP)

### 6.1. Hành trình thực tế của người học
```text
[BƯỚC 1: Mở ứng dụng]
       ↓
Người học thấy gì?
Landing page đẹp mắt → Bấm "Bắt đầu miễn phí" → Sang trang /register.
       ↓
[BƯỚC 2: Đăng ký tài khoản]
       ↓
Người học làm gì?
Điền Tên, Email, Mật khẩu, chọn Trình độ (N5), Mục tiêu (Du lịch), Thời gian (15p).
Bấm Đăng ký → Chuyển hướng sang /onboarding.
       ↓
💥 ĐIỂM GÃY UX #1: BỊ BẮT CHỌN LẠI TỪ ĐẦU!
Trang /onboarding lại bắt người dùng bấm chọn lại Trình độ, Mục tiêu, Thời gian đúng như vừa làm.
Sau khi bấm 3 bước onboarding → Mới vào được Dashboard (/app).
       ↓
[BƯỚC 3: Bước vào Dashboard]
       ↓
Người học nên làm gì?
Dashboard đập vào mắt 10 khối nội dung: Today's Focus, SRS, Kana Lab, Vocab, Survival, Level XP, Missions, Shinkansen, Nút Điểm danh.
CTA sáng nhất là: "Tiếp tục bài học →" (Bài #1: Chào hỏi căn bản).
       ↓
[BƯỚC 4: Học & Làm bài tập]
       ↓
Người học học như thế nào?
Vào trang Quiz (/app/practice/[slug]).
Làm 10 câu trắc nghiệm (chọn đáp án A-B-C-D, xem giải thích ngữ cảnh, nghe TTS).
Làm xong → Nhận điểm số, nhận +50 XP.
       ↓
💥 ĐIỂM GÃY SRS #2: CHỈ CÂU SAI MỚI ĐƯỢC VÀO SRS!
Nếu người học làm đúng hết 10 câu → Không có bất kỳ từ vựng hay mẫu câu nào được thêm vào kho SRS!
Kho SRS của người học vẫn trống rỗng (0 thẻ cần ôn).
       ↓
💥 ĐIỂM GÃY GAMIFICATION #3: TIẾN TRÌNH NHIỆM VỤ BỊ ĐÓNG BĂNG!
API /api/lessons/complete có tăng tiến độ nhiệm vụ lên 1/1, nhưng KHÔNG đổi trạng thái thành COMPLETED và KHÔNG cộng điểm thưởng XP.
Dashboard vẫn báo nhiệm vụ đang làm dở.
       ↓
💥 ĐIỂM GÃY GAMIFICATION #4: HỌC CHĂM CHỈ NHƯNG STREAK VẪN BẰNG 0!
Làm xong bài học, chuỗi Streak không hề tăng.
Người học bắt buộc phải quay ra Dashboard và bấm nút "🔥 Điểm danh chuỗi ngày" thì mới được tính là có học hôm nay!
       ↓
[BƯỚC 5: Mở rộng kiến thức (Từ vựng, Ngữ pháp, Văn hóa)]
       ↓
Người học muốn ôn tập:
- Vào /app/vocabulary → Bấm "Lưu thẻ" → Từ vựng được đưa vào SRS (TỐT).
- Vào /app/grammar → Đọc ngữ pháp hay nhưng KHÔNG CÓ NÚT LƯU VÀO SRS (💥 ĐIỂM GÃY #5).
- Vào /app/journey → Tích lũy đủ XP mở khóa Tokyo → Chỉ lúc này mới kích hoạt API kiểm tra thành tựu (💥 ĐIỂM GÃY #6).
       ↓
[BƯỚC 6: Ngày hôm sau quay lại]
       ↓
Mở app → Vào trang /app/review để ôn tập Spaced Repetition.
Thẻ lật 3D hoạt động tốt theo thuật toán SM-2.
```

### 6.2. Danh sách 6 điểm đứt gãy của luồng học tập (Broken Points Summary)
1. **Onboarding Loop Trap:** Bắt buộc nhập lại 2 lần cùng một tập dữ liệu cá nhân hóa.
2. **One-way SRS Feeder:** Hoàn thành bài học đúng 100% thì không có thẻ nào được đưa vào SRS. SRS chỉ hoạt động như một "thùng chứa lỗi sai" thay vì là một hệ thống ôn tập kiến thức toàn diện.
3. **Missions Frozen State:** Nhiệm vụ đạt 100% mục tiêu nhưng không bao giờ tự đóng và không tự trao XP.
4. **Manual Streak Hazard:** Buộc người học phải thao tác nút bấm điểm danh thủ công, đi ngược lại nguyên lý gamification tự nhiên (học là tự động điểm danh).
5. **Grammar Isolation:** Phân hệ ngữ pháp bị tách rời hoàn toàn khỏi hệ thống lưu trữ SRS.
6. **Achievement Silo:** Thành tựu bị trói chặt vào thao tác mở bản đồ văn hóa Shinkansen, người học làm bài học hay luyện chữ Kana đều không được công nhận danh hiệu.

---

## 7. UX PROBLEMS (CHI TIẾT VẤN ĐỀ TRẢI NGHIỆM NGƯỜI DÙNG)

### 7.1. Quá tải thông tin & Nhiễu thị giác (Information Clutter)
* Trên Dashboard `/app`, người học vừa bước vào đã phải đối diện cùng lúc:
  - 1 Banner chào mừng + Badge trình độ.
  - 1 Khối điểm danh chuỗi ngày.
  - 1 Thẻ Hero bài học trọng tâm chiếm 8 cột.
  - 4 Thẻ lớn trung tâm luyện tập nhanh.
  - 1 Thẻ cấp độ học viên & thanh tiến trình XP.
  - 1 Thẻ nhiệm vụ hôm nay.
  - 1 Thẻ hành trình Shinkansen với 5 nút trạm tàu.
* Tổng cộng có hơn **8 loại đường dẫn kêu gọi hành động (CTA)** khác nhau cạnh tranh sự chú ý của người học, tạo ra trạng thái **tê liệt quyết định (Analysis Paralysis)**: người học không biết nên làm bài tập trước, ôn thẻ SRS trước hay vào đọc từ vựng trước.

### 7.2. Bất cập Navigation & Menu
* Menu Desktop hiển thị 5 mục chính và 1 dropdown "Khám phá" chứa 4 mục phụ. Tuy nhiên:
  - Mục `Ngữ Pháp N5` bị đóng đinh chữ N5 gây ức chế cho người học trình độ N4, N3.
  - Menu không có bất kỳ dấu vết nào của tính năng AI Sensei.
  - Trên giao diện Mobile, thanh menu đáy chỉ hiển thị 4 mục (Tổng quan, Bài học, SRS, Vocab) và 1 nút "Thêm". Khi bấm "Thêm", một Bottom Sheet trượt lên hiển thị danh sách 5 mục còn lại, nhưng các biểu tượng quá to chiếm hết diện tích màn hình.

### 7.3. Trộn lẫn ngôn ngữ (Language Inconsistency)
* Giao diện không tuân thủ một chuẩn ngôn ngữ thống nhất:
  - Trang Profile: `"Signed in as"`, `"Profile and settings"`, `"Log out"`, `"Delete account"` (Tiếng Anh).
  - Trang Learn: `"Real kana from the database. Practicing saves per-user review state."` (Tiếng Anh kỹ thuật).
  - Trang Journey: `"Unlock requirements are evaluated server-side. Progress is per user."` (Ngôn ngữ mô tả của lập trình viên, không dành cho người dùng cuối).
  - Các trang khác: `"Lộ Trình Học Tiếng Nhật"`, `"Kho Từ Vựng & Hán Tự"`, `"Chế Độ Sinh Tồn"` (Tiếng Việt).

### 7.4. Vấn đề trải nghiệm trên di động (Mobile-First Deficiencies)
* Bố cục dự án mang nặng tư duy **Desktop-first**:
  - Bento grid 12 cột khi thu về màn hình dọc (1 cột) làm trang Dashboard dài vô tận.
  - Bảng vẽ Canvas trong `KanaLab` và `Japanese3DRoom` bị cố định chiều rộng (300px - 420px), gây hiện tượng thanh cuộn ngang (Horizontal overflow) trên các điện thoại có bề ngang màn hình hẹp (như iPhone SE: 375px).

---

## 8. TECHNICAL PROBLEMS & RISKS (RỦI RO KỸ THUẬT VÀ KIẾN TRÚC)

### 8.1. Lỗi Múi Giờ Nghiêm Trọng (Timezone Mismatch Bug)
Hệ thống tính ngày hôm nay theo 3 cách khác nhau trên 3 tệp tin:
1. **Tại `app/app/page.tsx` (Dashboard):**
   ```ts
   const today = localDateKey(new Date(), user.timezone || "UTC");
   ```
   *(Tính theo múi giờ người dùng, ví dụ: `Asia/Ho_Chi_Minh` GMT+7).*
2. **Tại `app/api/lessons/complete/route.ts`:**
   ```ts
   const user = await prisma.user.findUnique({ where: { id: userId }, select: { timezone: true } });
   const todayKey = new Date().toISOString().slice(0, 10); // LẤY THEO UTC!
   ```
   *(Truy vấn timezone từ DB nhưng vứt đi không dùng, lấy cứng UTC).*
3. **Tại `app/api/review/route.ts`:**
   ```ts
   where: { userId, date: localDateKey(now, "UTC"), mission: { type: "REVIEW" } }
   ```
   *(Ghi cứng "UTC").*

**Hậu quả:** Một học viên ở Việt Nam học bài vào lúc 01:30 sáng ngày 22/09 (giờ GMT+7). Dashboard tạo bản ghi nhiệm vụ với ngày `2026-09-22`. Nhưng khi người đó hoàn thành bài học hoặc ôn thẻ SRS, API lại tìm bản ghi ngày `2026-09-21` (vì giờ UTC mới là 18:30 ngày 21/09) để tăng tiến độ. Kết quả: **Tiến độ không được cộng, nhiệm vụ không hoàn thành, người dùng mất oan XP.**

---

### 8.2. Hiểm Họa Hiệu Năng Truy Vấn CSDL tại `/app/review`
Trong tệp `app/app/review/page.tsx`:
```ts
// Tải toàn bộ bảng chữ cái Kana
const allKana = await prisma.kana.findMany(...);
// Tải TOÀN BỘ từ vựng N5, N4, N3 trong CSDL!
const allVocab = await prisma.vocabulary.findMany(...);
// Tải TOÀN BỘ chữ Hán trong CSDL kèm tất cả âm On/Kun!
const allKanji = await prisma.kanji.findMany(...);
// Tải TOÀN BỘ ngữ pháp!
const allGrammar = await prisma.grammar.findMany(...);
// Tải TOÀN BỘ bài tập!
const allExercises = await prisma.exercise.findMany(...);
```
**Hậu quả:** Mỗi lần một người dùng bấm vào trang Ôn tập SRS (chỉ để xem tối đa 30 thẻ đến hạn), server Node.js phải quét toàn bộ bảng CSDL, nạp hàng ngàn bản ghi vào RAM và xây dựng 5 Map đối tượng. Khi lượng dữ liệu tăng lên hoặc có nhiều người dùng đồng thời, server sẽ cạn kiệt bộ nhớ (OOM Crash) và thời gian phản hồi (TTFB) sẽ tăng vọt.

---

### 8.3. Bảng CSDL Rác & Quan Hệ Lỏng Lẻo (Schema Smells)
1. **Quan hệ đa hình không ràng buộc khóa ngoại (Polymorphic pseudo-relation):**
   Trong bảng `ReviewItem`, hai trường `contentType` và `contentId` đều là `String` thuần túy, không có khóa ngoại (`FOREIGN KEY`) trỏ tới bảng `Vocabulary`, `Kanji`, `Kana` hay `Grammar`. Khi chạy lại script seed (`seed.ts`), toàn bộ từ vựng bị xóa và tạo mới ID, khiến tất cả `ReviewItem` trước đó trở thành **dữ liệu rác mồ côi (Orphan records)** dẫn tới crash giao diện (chính vì vậy mà nhóm dự án đã phải viết vội tệp `scripts/cleanup-orphan-review-items.ts` để chữa cháy).
2. **Các bảng CSDL "chết" hoàn toàn (Dead Models):**
   - `RoomItem` (0 records)
   - `UserRoomItems` (0 records)
   - `CollectionItem` (0 records)
   - `UserCollection` (0 records)
   - `KanaStroke` (0 records)
   - `LessonItem` (0 records)
   Các bảng này tồn tại trong `schema.prisma` và file migration SQL, làm tăng kích thước schema và độ phức tạp bảo trì nhưng không phục vụ bất kỳ tính năng thực tế nào.

---

### 8.4. Bỏ Qua CSDL trong `SurvivalClient.tsx`
* Tệp `app/app/survival/page.tsx` thực hiện truy vấn quan hệ phức tạp:
  ```ts
  const scenarios = await prisma.scenario.findMany({
    where: { isPublished: true },
    include: { messages: true, choices: true, progress: true }
  });
  ```
  Nhưng sang `SurvivalClient.tsx`, toàn bộ `messages` và `choices` từ CSDL bị bỏ rơi. Client sử dụng mảng tĩnh `REAL_SCENARIOS` dài hàng ngàn dòng code. Mọi thay đổi dữ liệu kịch bản trong CSDL đều vô tác dụng với giao diện người dùng.

---

### 8.5. Đồng Bộ Trạng Thái Theme Bị Lỗi (Theme Desync)
* `SoundAndThemeContext.tsx` quản lý `theme` và lưu vào `localStorage.getItem("nq_theme")`.
* Nhưng `ProfileForm.tsx` (tại dòng 61-66) lại tự ý toggle class `dark` trực tiếp trên `document.documentElement` mà không cập nhật vào Context hay LocalStorage. Khi người dùng chuyển trang, Theme sẽ tự động bị reset về giá trị cũ.

---

## 9. KEEP / MERGE / SIMPLIFY / REMOVE RECOMMENDATIONS
*(Khuyến nghị kiến trúc chuẩn bị cho Phase 2)*

| Phân hệ / Tệp tin | Đề xuất | Lý do & Hướng xử lý |
| :--- | :---: | :--- |
| **Quiz Runner** (`app/app/practice/[slug]`) | **KEEP** | Trải nghiệm xuất sắc, hoạt động mượt mà. Cần bổ sung cơ chế đưa cả câu đúng vào SRS với chu kỳ dài. |
| **SRS Review** (`app/app/review`) | **KEEP & REFACTOR BACKEND** | Giữ nguyên giao diện lật thẻ 3D; viết lại API truy vấn CSDL theo danh sách ID cụ thể, chấm dứt việc nạp toàn bộ CSDL vào RAM. |
| **Kana Lab & Canvas** (`app/app/learn`, `KanaCanvas.tsx`) | **KEEP** | Công cụ luyện viết hữu ích cho người mới học. Giữ nguyên Canvas 2D. |
| **Vocab & Kanji Lab** (`app/app/vocabulary`) | **KEEP** | Tra cứu từ vựng tốt, có nút lưu SRS tiện dụng. |
| **Grammar Lab** (`app/app/grammar`) | **KEEP & CONNECT** | Giữ nội dung ngữ pháp; sửa nhãn menu thành "Ngữ Pháp" và bổ sung nút "Lưu vào SRS". |
| **Landing Page** (`app/page.tsx`) | **KEEP & SIMPLIFY** | Giữ vẻ ngoài ấn tượng; chỉnh sửa các nút CTA điều hướng chuẩn xác. |
| **Onboarding & Register** | **MERGE** | Rút gọn trang Register về thông tin cơ bản; chuyển toàn bộ câu hỏi khảo sát vào Onboarding Wizard để tránh bắt người dùng chọn 2 lần. |
| **Dashboard** (`app/app/page.tsx`) | **SIMPLIFY** | Giảm bớt thẻ phụ; làm nổi bật bài học tiếp theo và số thẻ SRS đến hạn; tự động hóa tính năng điểm danh Streak khi hoàn thành bài học. |
| **Leaderboard** (`app/app/leaderboard`) | **KEEP** | Đơn giản, rõ ràng. |
| **Journey / Shinkansen** (`app/app/journey`) | **SIMPLIFY & RENAME** | Đổi tên "3D Room" thành "Không Gian Văn Hóa"; tách nhỏ file dữ liệu `cityData.ts` (102 KB) tải bất đồng bộ (Dynamic Import). |
| **Survival Mode** (`app/app/survival`) | **SIMPLIFY & REFACTOR** | Giữ lối chơi đàm thoại nhập vai; đồng bộ dữ liệu kịch bản giữa Prisma và Client thay vì hardcode. |
| **Forgot Password** (`app/forgot-password`) | **SIMPLIFY** | Tạm ẩn liên kết hoặc thay bằng thông báo hỗ trợ thật, không để form giả lập. |
| **AI Sensei** (`app/app/sensei`) | **REVIVE OR REMOVE** | Đang bị bỏ hoang. Nếu không triển khai thì xóa bỏ hoàn toàn để dọn 37 KB mã rác; nếu giữ lại thì phải mở route và gắn link lên menu. |
| **Component `stub.tsx`** | **REMOVE** | Mã chết 100%, không dùng ở đâu. |
| **Dead DB Models** (`RoomItem`, `CollectionItem`, `KanaStroke`, `LessonItem`) | **CLEANUP** | Loại bỏ khỏi schema trong đợt refactor CSDL tiếp theo để tránh nhầm lẫn kiến trúc. |

---

## 10. PRIORITY MATRIX (MA TRẬN ƯU TIÊN HÀNH ĐỘNG)

```text
       ẢNH HƯỞNG CAO (HIGH IMPACT)
             │
   P1: Sửa luồng Onboarding/Register  │  P0: Sửa lỗi Timezone Mismatch
   P1: Sửa tự động hóa Streak         │  P0: Sửa truy vấn CSDL OOM tại /app/review
   P1: Khép kín vòng lặp SRS (Bài tập)│  P0: Sửa lỗi Mission không hoàn thành
   P1: Đồng bộ CSDL Survival Mode     │  P0: Quyết định số phận AI Sensei (Xóa/Bật)
 ────────────┼─────────────────────────────────────────────────────────────
             │
   P3: Việt hóa Profile & Tiêu đề     │  P2: Tách nhỏ cityData.ts (102 KB)
   P3: Xóa stub.tsx                   │  P2: Thêm nút lưu SRS cho Ngữ Pháp
   P3: Xóa bảng chết trong schema     │  P2: Sửa desync Theme trong ProfileForm
             │  P2: Đổi tên 3D Room thành Cultural Modal
             │
       ẢNH HƯỞNG THẤP (LOW IMPACT)
 ────────────┴─────────────────────────────────────────────────────────────
       DỄ THỰC HIỆN ──────────────> PHỨC TẠP KỸ THUẬT
```

### 🔴 P0 — CRITICAL (BẮT BUỘC XỬ LÝ ĐẦU TIÊN)
1. **Sửa lỗi tính ngày theo Múi Giờ (Timezone Bug):** Đồng bộ hóa việc dùng `user.timezone` qua hàm `localDateKey` trên tất cả các API (`complete`, `review`, `missions`, `activity`). Chấm dứt việc dùng cứng UTC `toISOString().slice(0, 10)` làm hỏng dữ liệu của người dùng Việt Nam.
2. **Ngăn chặn nguy cơ tràn bộ nhớ tại `/app/review`:** Thay thế 5 câu lệnh `findMany()` quét toàn bộ CSDL bằng các câu truy vấn có điều kiện `id: { in: contentIds }` dựa trên 30 thẻ đến hạn.
3. **Sửa lỗi hoàn thành Nhiệm vụ Hàng ngày (Daily Missions):** Đưa logic kiểm tra `progress >= targetCount` và cập nhật `status = "COMPLETED"` cùng trao thưởng XP vào trực tiếp các API hành động (`api/lessons/complete`, `api/review`, `api/kana/practice`), không để phụ thuộc vào `GET /api/missions`.
4. **Giải quyết tình trạng bỏ rơi AI Sensei (`/app/sensei`):** Đưa ra quyết định dứt khoát: Mở route chat và gắn link vào `AppNav` HOẶC xóa bỏ 37 KB mã nguồn không sử dụng (`SenseiClient.tsx`, `api/ai/chat/route.ts`).

### 🟠 P1 — HIGH (ƯU TIÊN CAO CHO TRẢI NGHIỆM HỌC TẬP)
1. **Hợp nhất luồng Đăng ký & Onboarding:** Bỏ các câu hỏi khảo sát ở form `/register`, chỉ giữ Tên, Email, Mật khẩu. Dẫn người dùng vào Wizard `/onboarding` để trải nghiệm khảo sát mượt mà duy nhất 1 lần.
2. **Tự động hóa chuỗi ngày học (Streak):** Tích hợp việc gọi `updateStreak()` trực tiếp vào API nộp bài học và ôn tập SRS. Bỏ cơ chế bắt người học phải ấn nút "Điểm danh chuỗi ngày" thủ công.
3. **Khép kín vòng lặp SRS:** Cho phép đưa các câu hỏi làm đúng trong bài học vào SRS với chu kỳ ôn tập ban đầu dài hơn (ví dụ 3 - 5 ngày), biến SRS thành kho tri thức tổng hợp thay vì chỉ lưu câu làm sai.
4. **Đồng bộ hóa dữ liệu Survival Mode:** Chuyển dữ liệu hội thoại từ mảng tĩnh `REAL_SCENARIOS` trong `SurvivalClient.tsx` vào đúng các bảng `Scenario`, `ScenarioMessage`, `ScenarioChoice` trong CSDL Prisma.

### 🟡 P2 — MEDIUM (TỐI ƯU HÓA KIẾN TRÚC & DỌN DẸP)
1. **Tối ưu hóa hiệu năng bundle `cityData.ts`:** Chia nhỏ tệp dữ liệu 102 KB này hoặc tải bất đồng bộ (Dynamic Import / API Route) để giảm tải cho gói JavaScript ban đầu của trang `/app/journey`.
2. **Bổ sung tính năng lưu SRS cho Ngữ Pháp:** Thêm nút "Lưu vào SRS" trong `GrammarClient.tsx` và bổ sung `"GRAMMAR"` vào Zod schema của `api/review/add`.
3. **Đổi tên phân hệ 3D thành "Không Gian Văn Hóa":** Bỏ các nhãn quảng bá "3D WebGL / Three.js" không có thật trong UI và tài liệu để đảm bảo tính trung thực học thuật của đồ án.
4. **Sửa lỗi đồng bộ Theme trong `ProfileForm`:** Dùng hàm `setTheme` từ `SoundAndThemeContext` thay vì thao tác trực tiếp vào class DOM của thẻ `<html>`.
5. **Mở khóa cấp độ bài học tại `/app/practice`:** Cho phép người học chuyển tab xem danh sách bài học của N5, N4, N3 mà không bắt buộc phải đổi profile.

### 🟢 P3 — LOW (TINH CHỈNH THẨM MỸ & LÀM SẠCH MÃ NGUỒN)
1. **Việt hóa đồng bộ:** Chuyển đổi các chuỗi tiếng Anh ở trang Profile, Learn và Journey sang tiếng Việt chuẩn mực.
2. **Xóa bỏ mã chết:** Xóa tệp `app/app/stub.tsx`.
3. **Dọn dẹp schema CSDL:** Loại bỏ các model không dùng (`RoomItem`, `CollectionItem`, `KanaStroke`, `LessonItem`) trong đợt cập nhật migration tiếp theo.
4. **Chuẩn hóa nút bấm UI:** Thay thế các thẻ `<button>` viết tay bằng component `Button` từ `@/components/ui`.

---

## 11. XÁC NHẬN KIỂM SOÁT DỰ ÁN (PROJECT HEALTH CONFIRMATION)
* **Toàn bộ quá trình kiểm toán tuân thủ nghiêm ngặt nguyên tắc: CHỈ KIỂM TOÁN, KHÔNG SỬA ĐỔI MÃ NGUỒN DỰ ÁN (NO PRODUCT MODIFICATION).**
* **Trạng thái hệ thống sau Audit:**
  - TypeScript compilation: `tsc --noEmit` đạt 0 lỗi.
  - Test suites: `vitest run` đạt 7/7 passed.
  - ESLint: `next lint` đạt 0 warnings, 0 errors.
  - Next.js Dev Server: Tiếp tục chạy ổn định tại cổng `http://localhost:3000` (HTTP 200).
