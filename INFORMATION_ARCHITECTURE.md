# KIẾN TRÚC THÔNG TIN MỚI (INFORMATION ARCHITECTURE)
**Dự án:** Nihon Quest (`D:\Projects\nihon-lengs`)  
**Mục tiêu:** Tái cấu trúc từ "Tập hợp tính năng rời rạc" thành "Hệ thống học tập tinh gọn, khép kín"  
**Trọng tâm:** UX Phase — Kiến trúc thông tin, phân cấp thị giác và cơ chế liên kết dữ liệu  
**Tài liệu tham chiếu:** [`REDESIGN_AUDIT.md`](file:///d:/Projects/nihon-lengs/REDESIGN_AUDIT.md)

---

## 1. NGUYÊN LÝ THIẾT KẾ CỐT LÕI (CORE PRINCIPLES)

Dựa trên kết quả kiểm toán tại `REDESIGN_AUDIT.md`, kiến trúc mới được xây dựng dựa trên 4 nguyên tắc sống còn:

1. **Vòng lặp học tập khép kín (Closed Learning Loop):**
   $$\mathbf{Learn \longrightarrow Practice \longrightarrow Review \longrightarrow Progress \longrightarrow Continue}$$
   Mọi kiến thức được học (Từ vựng, Ngữ pháp, Kana, Bài học) đều phải tự động nuôi dưỡng kho thẻ ôn tập cách khoảng (SRS). Không tính năng nào được phép là "ngõ cụt" (Dead End).
2. **Nguyên tắc Hành Động Kế Tiếp (Next Best Action):**
   Màn hình chính (Home) không phải là dashboard thống kê doanh nghiệp. Màn hình chính chỉ tập trung trả lời một câu hỏi duy nhất của người học trong vòng 3 giây đầu tiên: **"Bây giờ tôi nên làm gì?"**
3. **Một nguồn chân lý (Single Source of Truth):**
   Loại bỏ toàn bộ dữ liệu hardcode tĩnh ở phía client (như `REAL_SCENARIOS`). Dữ liệu bài học, kịch bản, bảng chữ cái, thành tựu phải được quản lý tập trung và phản chiếu chính xác từ CSDL Prisma.
4. **Hợp nhất để giảm tải nhận thức (Consolidation over Proliferation):**
   Gộp 10 route điều hướng phân mảnh hiện tại thành **5 phân vùng chức năng rõ ràng**.

---

## 2. CẤU TRÚC ĐIỀU HƯỚNG MỚI (NEW NAVIGATION ARCHITECTURE)

### 2.1. Đối chiếu Hệ thống Điều hướng (Old vs New)

```text
CŨ (10 mục phân mảnh, gây nhiễu)          MỚI (5 phân vùng chức năng tinh gọn)
┌───────────────────────────────────────┐    ┌───────────────────────────────────┐
│ 1. Dashboard (/app)                  │ ──>│ 1. ⛩️ Home (/app)                 │
│ 2. Bài Học (/app/practice)           │ ──>│ 2. 📖 Learn (/app/learn)          │
│ 3. Ôn Tập SRS (/app/review)          │ ──>│ 3. 🎯 Practice (/app/practice)    │
│ 4. Từ Vựng (/app/vocabulary)         │ ──>│ 4. 🗾 Journey (/app/journey)      │
│ 5. Ngữ Pháp N5 (/app/grammar)        │ ──>│ 5. 👤 Profile (/app/profile)      │
│ 6. Japan Journey (/app/journey)      │    └───────────────────────────────────┘
│ 7. Survival Mode (/app/survival)     │
│ 8. Bảng Xếp Hạng (/app/leaderboard)  │
│ 9. Kana Lab (/app/learn)             │
│ 10. AI Sensei (/app/sensei) [Bị ẩn]  │
└───────────────────────────────────────┘
```

### 2.2. Vai trò của từng phân vùng điều hướng mới

| Phân vùng | Icon | Route | Trách nhiệm cốt lõi | Các tính năng cũ được hợp nhất vào |
| :--- | :---: | :--- | :--- | :--- |
| **Home** | ⛩️ | `/app` | **Bảng chỉ dẫn hành động:** Chỉ ra việc cần làm ngay (Next Best Action), thanh tiến độ ngày và thẻ SRS đến hạn. | Dashboard Bento Grid cũ (đã loại bỏ các card nhiễu). |
| **Learn** | 📖 | `/app/learn` | **Lộ trình bài học chính thống:** Hệ thống bài học cấu trúc N5 - N3, tích hợp học lý thuyết, từ vựng, ngữ pháp theo ngữ cảnh. | Ghép nối `Lessons`, `Vocabulary/Kanji`, `Grammar` và `Kana Lab` thành một lộ trình có thứ tự. |
| **Practice** | 🎯 | `/app/practice` | **Đấu trường luyện tập & Ôn tập:** Trung tâm kiểm tra phản xạ, làm bài Quiz, hàng đợi ôn tập Spaced Repetition (SRS) và Chế độ sinh tồn. | Hợp nhất `QuizRunner`, `Review (SRS)`, `Survival Mode`, và `Kana Canvas`. |
| **Journey** | 🗾 | `/app/journey` | **Bản đồ chứng chỉ năng lực & Văn hóa:** Hành trình Shinkansen phản ánh năng lực thực tế đã nắm vững (Mastery) thay vì chỉ bấm click chuột. | Bản đồ Shinkansen + Modal Khám phá văn hóa (đổi tên từ "3D Room"). |
| **Profile** | 👤 | `/app/profile` | **Cá nhân hóa & Cài đặt:** Quản lý thông tin học viên, đổi mục tiêu, chuỗi ngày, Bảng xếp hạng và giao diện. | Hợp nhất `ProfileForm`, `DangerZone`, và xem nhanh `Leaderboard`. |

---

## 3. THIẾT KẾ CHI TIẾT TỪNG PHÂN VÙNG (DETAILED PAGE ARCHITECTURE)

### 3.1. HOME (`/app`) — "What should I do now?"

Home được tái cấu trúc triệt để theo cấu trúc phân cấp thị giác 3 tầng:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ [TOP HEADER] Chào mừng, Hiori! · Level 3 (450 XP) · 🔥 5 ngày streak     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ 🎯 TẦNG 1: PRIMARY ACTION (Hành động ưu tiên số 1 - Chiếm 60% thị giác) │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │  TIẾP TỤC HỌC: Bài #4 - Đi tàu điện ngầm tại Tokyo (Unit 02)       │ │
│ │  Tiến độ: Đã hoàn thành 60% lộ trình N5                             │ │
│ │  [ BẮT ĐẦU HỌC NGAY → ] (Nút Sakura lớn, Focus tuyệt đối)           │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ 🎴 TẦNG 2: SECONDARY FOCUS (Việc cần làm trong ngày - 2 Card tinh gọn) │
│ ┌───────────────────────────────────┐ ┌───────────────────────────────┐ │
│ │ HÀNG ĐỢI ÔN TẬP SRS               │ │ NHIỆM VỤ HÔM NAY (1/2)        │ │
│ │ 12 thẻ đến hạn hôm nay            │ │ ✓ Hoàn thành 1 bài học (+20XP)│ │
│ │ [ ÔN TẬP NGAY (5 phút) → ]        │ │ ○ Ôn tập 5 thẻ SRS (+20XP)    │ │
│ └───────────────────────────────────┘ └───────────────────────────────┘ │
│                                                                         │
│ 📊 TẦNG 3: SUPPORTING PROGRESS (Theo dõi tiến trình nền)                │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Chặng tiếp theo: Kyoto Shinkansen (Cần thêm 150 XP để mở khóa)     │ │
│ │ Thanh tiến độ cấp độ: [██████████████░░░░░░] 450 / 600 XP           │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Quy tắc hiển thị Tầng 1 (Primary Action Logic):
1. **Nếu có thẻ SRS quá hạn (> 20 thẻ):** Ưu tiên nhắc nhở ôn tập để tránh quên kiến thức cũ.
2. **Nếu chưa có bài học dở dang:** Hiển thị bài học tiếp theo theo lộ trình cấp độ của người dùng.
3. **Nếu người dùng mới (Level 1, vừa xong Onboarding):** Hiển thị ngay Bài 1: "Làm quen bảng chữ cái Hiragana".

---

### 3.2. LEARN (`/app/learn`) — Lộ trình học tập liên kết (Integrated Learning Path)

Thay vì để Bảng chữ cái, Từ vựng, Ngữ pháp nằm ở các trang cô lập, `Learn` trở thành **Trục kiến thức xương sống**:

```text
                             LỘ TRÌNH CHUẨN JLPT (N5 ➔ N4 ➔ N3)
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               ▼                                                         ▼
       [KHO KANA CĂN BẢN]                                       [DANH SÁCH BÀI HỌC UNIT]
    (Bảng 50 âm + Canvas vẽ)                                  (Cấu trúc theo chuyên đề thực tế)
                                                                         │
                                       ┌─────────────────────────────────┴────────────────────────┐
                                       ▼                                                          ▼
                             [BÀI HỌC CỤ THỂ]                                           [BỘ TRA CỨU MỞ RỘNG]
                           (Lesson Contextualized)                                      (Dictionary & Reference)
                                       │                                                          │
          ┌────────────────────────────┼────────────────────────────┐                             ├─ Từ vựng & Hán tự
          ▼                            ▼                            ▼                             └─ Sổ tay Ngữ pháp
   1. TỪ VỰNG BÀI HỌC         2. NGỮ PHÁP BÀI HỌC         3. HỘI THOẠI MẪU
 (Kanji, Kana, Nghĩa, TTS)   (Cấu trúc, Lỗi sai, Ví dụ)     (Nghe nói thực tế)
          │                            │                            │
          └────────────────────────────┼────────────────────────────┘
                                       ▼
                       [TỰ ĐỘNG CHUYỂN TIẾP SANG PRACTICE]
```

#### Cơ chế liên kết:
* Khi học một bài học (ví dụ: *Unit 03: Mua sắm tại Konbini*), người học học các từ vựng (`bento`, `o-hashi`, `ikura`), ngữ pháp (`~ o kudasai`) của bài đó.
* Cuối bài học, hệ thống tự động:
  1. Đưa các từ vựng và mẫu câu này vào **Kho dữ liệu sẵn sàng ôn tập SRS**.
  2. Dẫn người học sang tab **Practice** để làm Quiz trắc nghiệm củng cố.

---

### 3.3. PRACTICE (`/app/practice`) — Đấu trường Luyện tập & Ôn tập tập trung

Hợp nhất toàn bộ các hoạt động khảo sát, tương tác phản xạ và lặp lại cách khoảng vào một trung tâm thống nhất:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 🎯 PRACTICE HUB — ĐẤU TRƯỜNG LUYỆN TẬP                                 │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│ [TAB 1: SRS FLASHCARD] (Quan trọng nhất)                               │
│  - Hàng đợi thẻ đến hạn hôm nay (Spaced Repetition SM-2).              │
│  - Hỗ trợ ôn thẻ Từ vựng, Chữ Hán, Điểm Ngữ pháp và Câu hỏi đã sai.    │
│                                                                        │
│ [TAB 2: QUIZ BÀI HỌC] (Theo lộ trình)                                  │
│  - Làm bài trắc nghiệm phản xạ 4 đáp án (phím tắt 1-4, Enter).        │
│  - Phân tích đáp án sai, giải thích ngữ cảnh tức thì.                  │
│                                                                        │
│ [TAB 3: HỘI THOẠI SINH TỒN (SURVIVAL)] (Thực chiến nâng cao)           │
│  - Kịch bản nhập vai gọi món Ramen, hỏi đường, mua thuốc, đi taxi.     │
│  - Luyện nói tiếng Nhật qua Microphone (Web Speech Recognition).       │
│                                                                        │
│ [TAB 4: XƯỞNG VIẾT NÉT KANA (CANVAS)] (Kỹ năng viết)                  │
│  - Luyện vẽ chữ Hiragana & Katakana trên lưới canvas cảm ứng.          │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 3.4. JOURNEY (`/app/journey`) — Bản đồ năng lực & Khám phá văn hóa

Chuyển đổi Journey từ việc "bấm click nhận XP" sang **Bản đồ chứng chỉ năng lực học tập thực tế**:

* **Điều kiện mở trạm tàu:** Không chỉ dựa vào tổng XP tích lũy, mà gắn liền với năng lực thực:
  - *Ga Tokyo (Khởi hành):* Hoàn thành Unit 01 (Nhập môn & Chào hỏi) + Thuộc 46 chữ Hiragana.
  - *Ga Hakone (Suối nước nóng):* Hoàn thành Unit 02 (Đồ vật & Đời sống) + Đạt 80% độ chính xác Quiz.
  - *Ga Kyoto (Cố đô):* Nắm vững 50 chữ Hán N5 + Hoàn thành Unit 03 & 04.
* **Không gian văn hóa thành phố:** 
  - Đổi tên component `Japanese3DRoom` thành `CulturalSpaceModal` (loại bỏ nhãn 3D sai sự thật).
  - Tải dữ liệu bất đồng bộ (Lazy-loading theo slug thành phố), giảm kích thước ban đầu của `cityData.ts`.
  - Giữ lại các hoạt động văn hóa thú vị: Rút quẻ Omikuji đầu ngày, đóng dấu mộc lưu niệm Eki Stamp vào Sổ tay hành trình (Passport).

---

### 3.5. PROFILE & SETTINGS (`/app/profile`)

* **Hồ sơ học viên:** Avatar, Tên hiển thị, Trình độ JLPT mục tiêu, Thời lượng học mỗi ngày, Múi giờ chuẩn hóa.
* **Bảng xếp hạng (Leaderboard Integration):** Hiển thị thứ hạng tuần của bản thân trực tiếp trong Profile.
* **Thiết lập hệ thống:**
  - Chuyển đổi Giao diện (Sáng / Tối / Hệ thống) — kết nối chặt chẽ với `SoundAndThemeContext`.
  - Bật / Tắt âm thanh hiệu ứng.
* **Vùng bảo mật (Account Security):**
  - Đổi mật khẩu.
  - Đăng xuất & Xóa tài khoản (sử dụng Modal xác nhận của Design System thay cho `window.confirm`).
  - Toàn bộ giao diện được Việt hóa 100%.

---

## 4. BẢNG QUYẾT ĐỊNH TÍNH NĂNG (FEATURE DECISIONS MATRIX)

| STT | Tính năng / Component hiện tại | Quyết định | Lý do & Giải pháp kiến trúc |
| :---: | :--- | :---: | :--- |
| 1 | **Dashboard Bento Grid** (`app/app/page.tsx`) | **SIMPLIFY** | Quá tải thị giác. Rút gọn còn 3 tầng phân cấp rõ ràng: Next Best Action → Daily Focus → Supporting Progress. |
| 2 | **Quiz Runner** (`QuizRunner.tsx`) | **KEEP** | Thành phần lõi xuất sắc nhất. Giữ nguyên trải nghiệm làm bài trắc nghiệm; bổ sung cơ chế đưa cả câu đúng vào SRS. |
| 3 | **SRS Review** (`app/app/review`) | **MERGE** | Chuyển thành Tab chủ đạo bên trong phân hệ `/app/practice`. Viết lại query backend theo ID để tránh OOM RAM. |
| 4 | **Bảng chữ cái Kana** (`app/app/learn`) | **MERGE** | Đặt thành phân mục nền tảng đầu tiên trong `/app/learn`, phục vụ học viên mới trước khi bước vào Unit 1. |
| 5 | **Bảng vẽ Canvas** (`KanaCanvas.tsx`) | **KEEP** | Giữ nguyên chức năng vẽ nét chữ 2D Canvas; tích hợp làm công cụ thực hành của Bảng chữ cái. |
| 6 | **Từ vựng & Hán tự** (`app/app/vocabulary`) | **MERGE** | Đưa vào làm thư viện bổ trợ (Dictionary tab) trong `/app/learn`, liên kết chặt chẽ với từng bài học cụ thể. |
| 7 | **Sổ tay Ngữ pháp** (`app/app/grammar`) | **MERGE** | Đưa vào làm thư viện ngữ pháp trong `/app/learn`. Thêm nút "Lưu vào SRS" và sửa lỗi ghi cứng nhãn N5. |
| 8 | **Hội thoại sinh tồn** (`app/app/survival`) | **MERGE & REFACTOR** | Đưa vào làm Tab thực chiến trong `/app/practice`. Bỏ mảng tĩnh hardcode `REAL_SCENARIOS`, nạp kịch bản từ CSDL Prisma. |
| 9 | **Bản đồ Shinkansen** (`app/app/journey`) | **SIMPLIFY** | Giữ làm phân vùng văn hóa độc lập (`/app/journey`). Chuyển điều kiện mở khóa từ thuần XP sang chứng chỉ bài học đã vượt qua. |
| 10 | **"3D Room"** (`Japanese3DRoom.tsx`) | **SIMPLIFY & RENAME** | Đổi tên thành `CulturalSpaceModal`. Xóa bỏ các định danh sai lệch "WebGL / Three.js". Lazy load data để nhẹ web. |
| 11 | **Gia sư AI** (`app/app/sensei`) | **HIDE / ARCHIVE** | Tạm ẩn hoàn toàn khỏi điều hướng và tắt route redirect rác. Giữ mã nguồn trong thư mục dự phòng để phát triển ở giai đoạn tích hợp LLM chuyên sâu. |
| 12 | **Bảng xếp hạng** (`app/app/leaderboard`) | **MERGE** | Tích hợp thành widget tóm tắt trong Home và xem đầy đủ tại Profile, không cần chiếm riêng một route độc lập trên menu. |
| 13 | **Form Đăng ký** (`app/register`) | **SIMPLIFY** | Cắt bỏ 3 câu hỏi khảo sát trùng lặp; chỉ giữ Tên, Email, Mật khẩu. |
| 14 | **Onboarding Wizard** (`app/onboarding`) | **KEEP & MERGE WORKFLOW** | Giữ làm nơi duy nhất thực hiện cá nhân hóa lộ trình sau khi đăng ký thành công. |
| 15 | **Quên mật khẩu** (`app/forgot-password`) | **SIMPLIFY** | Tạm ẩn link trên form đăng nhập hoặc thay bằng dialog hỗ trợ quản trị viên thật; loại bỏ form giả lập `setTimeout`. |
| 16 | **Nút điểm danh** (`ActivityButton.tsx`) | **REMOVE / AUTOMATE** | Xóa nút bấm thủ công. Tự động hóa việc cộng Streak khi người học nộp bài học hoặc ôn xong thẻ SRS. |
| 17 | **Component `stub.tsx`** | **REMOVE** | Mã chết 100%, xóa bỏ dọn sạch codebase. |
| 18 | **Các model CSDL 0 bản ghi** (`RoomItem`, `CollectionItem`, `KanaStroke`, `LessonItem`) | **HIDE / CLEANUP IN SCHEMA** | Đánh dấu deprecate trong schema Prisma, không sử dụng trong code mới. |

---

## 5. BẢN ĐỒ ĐỊNH TUYẾN MỚI (NEW SITEMAP & ROUTE MAPPING)

```text
/ (Public Landing Page)
│
├── /login                     (Đăng nhập)
├── /register                  (Đăng ký tinh gọn: Tên, Email, Pass)
├── /onboarding                (Wizard 3 bước cá nhân hóa duy nhất)
│
└── /app                       (Protected Area - Yêu cầu xác thực)
    │
    ├── /app (Home)            [Trọng tâm ngày: Next Best Action & Thẻ SRS đến hạn]
    │
    ├── /app/learn             [Lộ trình học bài bản N5 - N3]
    │   ├── /app/learn/kana    (Bảng 50 âm Gojuon & Luyện viết)
    │   ├── /app/learn/vocab   (Tra cứu Từ vựng & Hán tự theo bài / cấp độ)
    │   └── /app/learn/grammar (Tra cứu Cấu trúc Ngữ pháp theo bài / cấp độ)
    │
    ├── /app/practice          [Đấu trường Luyện tập & Ôn tập]
    │   ├── /app/practice/srs  (Phiên lật thẻ Flashcard SM-2)
    │   ├── /app/practice/quiz/[slug] (Trình làm bài trắc nghiệm bài học)
    │   └── /app/practice/survival (Hội thoại tình huống thực chiến)
    │
    ├── /app/journey           [Bản đồ văn hóa & Dấu ấn năng lực Shinkansen]
    │
    └── /app/profile           [Hồ sơ, Múi giờ, Theme, Thứ hạng Leaderboard, Bảo mật]
```
