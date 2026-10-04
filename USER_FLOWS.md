# THIẾT KẾ LUỒNG NGƯỜI DÙNG CHI TIẾT (USER FLOWS)
**Dự án:** Nihon Quest (`D:\Projects\nihon-lengs`)  
**Mục tiêu:** Định hình chi tiết các hành trình người dùng (User Journeys) khép kín, triệt tiêu mọi điểm đứt gãy  
**Trọng tâm:** UX Phase — State Transitions, API triggers, Gamification sync và Spaced Repetition loop  
**Tài liệu tham chiếu:** [`REDESIGN_AUDIT.md`](file:///d:/Projects/nihon-lengs/REDESIGN_AUDIT.md), [`INFORMATION_ARCHITECTURE.md`](file:///d:/Projects/nihon-lengs/INFORMATION_ARCHITECTURE.md)

---

## 1. MÔ HÌNH VÒNG LẶP HỌC TẬP CỐT LÕI (THE CORE LEARNING LOOP ENGINE)

Toàn bộ hệ thống Nihon Quest vận hành dựa trên một động cơ vòng lặp tuần hoàn khép kín gồm 5 giai đoạn:

```text
               ┌─────────────────────────────────────────────────────────┐
               │                1. LEARN (TIẾP NHẬN)                     │
               │   Học lý thuyết, từ vựng, ngữ pháp theo ngữ cảnh bài    │
               └────────────────────────────┬────────────────────────────┘
                                            ▼
               ┌─────────────────────────────────────────────────────────┐
               │               2. PRACTICE (PHẢN XẠ)                     │
               │   Làm bài trắc nghiệm Quiz, phản hồi đúng/sai tức thì   │
               └────────────────────────────┬────────────────────────────┘
                                            ▼
               ┌─────────────────────────────────────────────────────────┐
               │                3. REVIEW (CỦNG CỐ SRS)                  │
               │   Ôn tập cách khoảng SM-2, chuyển kiến thức vào nhớ lâu │
               └────────────────────────────┬────────────────────────────┘
                                            ▼
               ┌─────────────────────────────────────────────────────────┐
               │               4. PROGRESS (GHI NHẬN TIẾN TRÌNH)         │
               │   Tự động cộng XP, tăng Streak, hoàn thành nhiệm vụ ngày │
               └────────────────────────────┬────────────────────────────┘
                                            ▼
               ┌─────────────────────────────────────────────────────────┐
               │               5. CONTINUE (BƯỚC TIẾP THEO)              │
               │   Mở khóa trạm tàu Shinkansen, gợi ý bài học kế tiếp    │
               └────────────────────────────┬────────────────────────────┘
                                            │
                                            └───────────(Vòng tuần hoàn tiếp diễn)──┘
```

---

## 2. USER FLOW 1: NGƯỜI DÙNG MỚI (NEW USER ONBOARDING & FIRST WIN)

### 2.1. Mục tiêu luồng
Đưa người học mới từ lúc chưa có tài khoản đến **"Khoảnh khắc chiến thắng đầu tiên" (First Win)** trong vòng dưới 3 phút mà không gặp bất kỳ sự lặp lại phiền toái nào.

### 2.2. Sơ đồ luồng (ASCII Flowchart)

```text
[Khách truy cập] ──> Landing Page (/)
                          │
                          ▼ (Click "Bắt đầu miễn phí 🚀")
                 Form Đăng Ký Tinh Gọn (/register)
                 ┌───────────────────────────────┐
                 │ 1. Họ và tên                  │
                 │ 2. Email                      │
                 │ 3. Mật khẩu (≥ 8 ký tự)       │
                 └───────────────┬───────────────┘
                                 │
                                 ▼ (Submit: POST /api/auth/register)
                         Tạo User thành công
                                 │
                                 ▼ (Tự động đăng nhập qua NextAuth JWT)
                     Onboarding Wizard (/onboarding)
            (3 bước khảo sát tương tác duy nhất - không bị lặp lại)
            ┌──────────────────────────────────────────────────────┐
            │ Bước 1: Trình độ (N5 Mới bắt đầu / N4 / N3)          │
            │ Bước 2: Mục tiêu (Du lịch / Thi JLPT / Giao tiếp)   │
            │ Bước 3: Thời lượng học (10p / 15p / 30p / 60p)       │
            └──────────────────────┬───────────────────────────────┘
                                   │
                                   ▼ (Hoàn tất: PATCH /api/account)
                          Home Dashboard (/app)
                     ┌─────────────────────────────┐
                     │ Hiển thị PRIMARY ACTION:    │
                     │ "Bắt đầu bài 1 ngay →"     │
                     └─────────────┬───────────────┘
                                   │
                                   ▼ (Click "Bắt đầu bài 1")
                     Phòng Học Quiz (/app/practice/[slug])
                     ┌─────────────────────────────┐
                     │ Làm 5 câu trắc nghiệm đầu   │
                     │ Nghe âm thanh, xem phân tích│
                     └─────────────┬───────────────┘
                                   │
                                   ▼ (Hoàn thành bài)
                     Màn hình Chúc Mừng & Ghi Nhận
                     ┌─────────────────────────────┐
                     │ 🏆 +50 XP đầu tiên          │
                     │ 🔥 Kích hoạt chuỗi 1 ngày   │
                     │ 🎴 Nạp 5 từ vựng vào SRS    │
                     │ 💮 Mở khóa Ga Tokyo         │
                     └─────────────────────────────┘
```

### 2.3. Chi tiết chuyển đổi trạng thái (State & Data Transitions)
1. **Tại `/register`:**
   - Dữ liệu gửi: `{ email, password, displayName }`.
   - CSDL tạo bản ghi `User` với `onboardingCompleted: false`.
2. **Tại `/onboarding`:**
   - Dữ liệu gửi: `{ learningLevel, learningGoal, dailyGoalMinutes, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, onboardingCompleted: true }`.
   - Middleware ghi nhận `onboardingCompleted === true` và cho phép truy cập `/app`.
3. **Tại bài học đầu tiên:**
   - Sau khi hoàn thành quiz, gọi `POST /api/lessons/complete`.
   - **Tự động kích hoạt chuỗi hành động:**
     - Cộng `totalXP += 50`.
     - Gọi `updateStreak()` tự động nâng `currentStreak = 1` (không cần bấm nút điểm danh).
     - Đưa câu hỏi và từ vựng bài 1 vào `ReviewItem` (cả câu đúng với `interval = 2 ngày`, câu sai với `interval = 0`).
     - Đánh dấu hoàn thành nhiệm vụ ngày "Hoàn thành bài học đầu tiên" (`status = "COMPLETED"`) và cộng thêm +20 XP thưởng.

---

## 3. USER FLOW 2: NGƯỜI DÙNG QUAY LẠI HÀNG NGÀY (RETURNING USER DAILY HABIT)

### 3.1. Mục tiêu luồng
Tối ưu hóa thời gian từ khi mở trang đến khi bắt đầu học, giải quyết dứt điểm câu hỏi "Hôm nay tôi phải làm gì?", bảo vệ chuỗi Streak và chống quên kiến thức cũ.

### 3.2. Sơ đồ luồng (ASCII Flowchart)

```text
[Người học quay lại] ──> Đăng nhập (/login)
                               │
                               ▼ (Xác thực JWT hợp lệ)
                      Home Dashboard (/app)
                               │
                 Hệ thống kiểm tra trạng thái SRS
                               │
            ┌──────────────────┴──────────────────┐
            ▼ (> 0 thẻ đến hạn)                   ▼ (0 thẻ đến hạn)
┌───────────────────────────────────────┐ ┌───────────────────────────────────────┐
│ PRIMARY ACTION:                       │ │ PRIMARY ACTION:                       │
│ 🎴 "Hôm nay bạn có 8 thẻ cần ôn tập!" │ │ 📖 "Tiếp tục bài học tiếp theo!"     │
│ [ ÔN TẬP NGAY (3 phút) → ]           │ │ [ BẮT ĐẦU BÀI TIẾP THEO → ]          │
└──────────────────┬────────────────────┘ └──────────────────┬────────────────────┘
                   │                                         │
                   ▼ (Click)                                 ▼ (Click)
       Phiên Ôn Tập Flashcard                      Phòng Học Quiz Bài Mới
       (/app/practice/srs)                         (/app/practice/[slug])
                   │                                         │
                   └──────────────────┬──────────────────────┘
                                      │
                                      ▼
                      Hoàn thành phiên học hôm nay
                      ┌───────────────────────────────────────┐
                      │ 1. 🔥 Streak tự động tăng lên N + 1   │
                      │ 2. 🎯 Nhiệm vụ ngày tự động COMPLETED  │
                      │ 3. ✨ +XP được cộng vào thanh tiến độ │
                      │ 4. 🗾 Cập nhật tiến trình Shinkansen  │
                      └───────────────────────────────────────┘
```

### 2.3. Quy tắc ưu tiên hiển thị trên Home (Smart Priority Engine)
* **Quy tắc 1 (Ưu tiên Trí nhớ):** Nếu số thẻ SRS đến hạn $\ge 5$, Primary Action **bắt buộc** là Ôn tập Flashcard SRS để tôn trọng chu kỳ sinh học của não bộ.
* **Quy tắc 2 (Ưu tiên Lộ trình):** Nếu số thẻ SRS $= 0$, Primary Action tự động chuyển thành Bài học mới tiếp theo theo cấp độ N5/N4/N3 của người học.
* **Quy tắc 3 (Gợi ý Mở rộng):** Nếu người học đã hoàn thành cả bài học và ôn tập trong ngày, Primary Action chuyển thành: *"Thử thách Hội Thoại Sinh Tồn tại Quán Mì Ramen (Survival Mode) để rèn phản xạ!"*

---

## 4. USER FLOW 3: VÒNG LẶP ÔN TẬP CÁCH KHOẢNG (SRS CLOSED-LOOP ENGINE)

### 4.1. Mục tiêu luồng
Hiện thực hóa trọn vẹn thuật toán Spaced Repetition SM-2 trên giao diện thẻ lật 3D, tái xếp hàng tức thì các thẻ đánh giá "Chưa thuộc" (Again), đảm bảo sau mỗi phiên ôn tập người học nắm vững 100% lượng thẻ trong ngày.

### 4.2. Sơ đồ luồng chi tiết (State Machine Flowchart)

```text
[Home Dashboard] ──> Bấm "Ôn tập ngay (N thẻ)"
                           │
                           ▼
          Bắt đầu Phiên Ôn Tập Flashcard
          (/app/practice/srs hoặc Modal SRS)
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. HIỂN THỊ MẶT TRƯỚC (Front of Card)                       │
│    - Ký tự / Từ vựng / Mẫu ngữ pháp: 日本 (Nihon)          │
│    - Nút nghe phát âm tiếng Nhật chuẩn (TTS)                │
│    - Gợi ý gợi nhớ ngữ cảnh                                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼ (Người học lẩm nhẩm đáp án & click LẬT THẺ)
┌─────────────────────────────────────────────────────────────┐
│ 2. HIỂN THỊ MẶT SAU (Back of Card - Hiệu ứng lật 3D)        │
│    - Cách đọc: にほん (Nihon)                               │
│    - Ý nghĩa: Nhật Bản (Đất nước mặt trời mọc)              │
│    - Câu ví dụ thực tế kèm audio                            │
│    - Phân loại giai đoạn trí nhớ: 🌿 Đang quen dần          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼ (Người học tự đánh giá độ ghi nhớ)
    ┌──────────────────────┼──────────────────────┬──────────────────────┐
    │                      │                      │                      │
    ▼ [1. AGAIN]           ▼ [2. HARD]            ▼ [3. GOOD]            ▼ [4. EASY]
(Quên hoàn toàn)      (Khó khăn mới nhớ)     (Nhớ tốt, tự nhiên)   (Thuộc nằm lòng)
    │                      │                      │                      │
    ├─ ease = ease - 0.2   ├─ ease = ease - 0.15  ├─ interval *= ease    ├─ ease = ease + 0.15
    ├─ interval = 0        ├─ interval = 1 ngày   ├─ interval = 3-6 ngày ├─ interval = 7-14 ngày
    ├─ reps = 0            ├─ reps += 1           ├─ reps += 1           ├─ reps += 1
    │                      │                      │                      │
    ▼                      └──────────────────────┴──────────────────────┘
[XẾP LẠI VÀO CUỐI HÀNG ĐỢI]                          │
Thẻ này sẽ xuất hiện lại ngay                       ▼
trong phiên học hiện tại!                    LƯU VÀO CSDL PRISMA
(Đảm bảo học đến khi thuộc)                  (POST /api/review)
    │                                                │
    └──────────────────────┬─────────────────────────┘
                           │
                           ▼
                 Còn thẻ trong hàng đợi?
                 ├── CÒN ──> Chuyển sang thẻ tiếp theo (Quay lại Bước 1)
                 │
                 └── HẾT (0 thẻ còn lại)
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. MÀN HÌNH CHÚC MỪNG HOÀN THÀNH PHIÊN ÔN TẬP               │
│    - 🏆 Âm thanh Fanfare ăn mừng vang lên                   │
│    - ✨ Nhận +20 XP thưởng bảo vệ trí nhớ                    │
│    - 🎯 Tự động đánh dấu Nhiệm vụ SRS: COMPLETED            │
│    - 🔥 Tự động cập nhật chuỗi Streak ngày hôm nay          │
│    - [ QUAY VỀ HOME ] hoặc [ HỌC BÀI TIẾP THEO ]           │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. USER FLOW 4: LUYỆN TẬP HỘI THOẠI SINH TỒN (SURVIVAL CONTEXT FLOW)

### 5.1. Mục tiêu luồng
Kết nối kiến thức từ vựng và ngữ pháp đã học vào tình huống giao tiếp sinh tồn thực tế (Ordering Ramen, Asking directions at Shinjuku station, Pharmacy, Taxi).

### 5.2. Sơ đồ luồng

```text
[Practice Hub] ──> Chọn Tab "Hội Thoại Sinh Tồn" (/app/practice)
                         │
                         ▼
        Chọn Kịch bản: "Gọi Món Tại Tiệm Ramen Shibuya"
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ NPC (Bác chủ quán Ramen):                                   │
│ "いらっしゃいませ！何名様ですか？"                            │
│ (Kính chào quý khách! Quý khách đi mấy người ạ?)            │
│ [🔊 Tự động phát âm bản xứ]                                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼ (Người học chọn cách đối đáp)
            ┌──────────────┴──────────────┐
            ▼ (Cách 1: Bấm chọn câu)      ▼ (Cách 2: Nói vào Micro)
     Chọn 1 trong 3 đáp án:              Bấm icon 🎙️ và nói tiếng Nhật:
     - Lịch sự (100đ)                    "Hitori desu. Kauntā-seki de..."
     - Cộc lốc (60đ)                     (Web Speech Recognition API
     - Sai ngữ cảnh (40đ)                 chuyển giọng nói thành văn bản)
            │                                     │
            └──────────────────────┬──────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────┐
│ PHẢN HỒI VĂN HÓA TỨC THÌ TỪ NPC:                            │
│ - Điểm số: 100/100 (Rất lịch sự!)                           │
│ - Lời thoại NPC: Bác chủ quán cười tươi chỉ vào ghế số 3!   │
│ - Giải thích ngữ cảnh: Người Nhật luôn dùng trợ từ desu... │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼ (Hết các lượt thoại của kịch bản)
┌─────────────────────────────────────────────────────────────┐
│ TỔNG KẾT KỊCH BẢN:                                          │
│ - Đạt 100% điểm phản xạ giao tiếp                           │
│ - +100 XP thưởng hoàn thành kịch bản                        │
│ - Đồng bộ trạng thái: POST /api/survival/progress (Prisma)  │
│ - Tự động nạp các mẫu câu vừa dùng vào SRS để luyện lại      │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. USER FLOW 5: CHỨNG NHẬN NĂNG LỰC & HÀNH TRÌNH SHINKANSEN (JOURNEY MILESTONE FLOW)

### 6.1. Mục tiêu luồng
Biến bản đồ Shinkansen thành **Hộ chiếu năng lực (Passport of Competencies)**. Mỗi trạm dừng chân là một cột mốc chứng minh người học đã thực sự làm chủ kiến thức tương ứng.

### 6.2. Sơ đồ luồng mở khóa trạm dừng chân

```text
[Người học tích lũy kiến thức qua Learn & Practice]
                         │
                         ▼
             Truy cập bản đồ Shinkansen (/app/journey)
                         │
                         ▼
     Kiểm tra điều kiện mở khóa trạm tiếp theo (VD: Ga Kyoto)
                         │
     ┌───────────────────┴───────────────────┐
     ▼ (CHƯA ĐỦ ĐIỀU KIỆN)                   ▼ (ĐÃ ĐỦ ĐIỀU KIỆN)
┌───────────────────────────────┐   ┌───────────────────────────────┐
│ TRẠM ĐANG KHÓA (LOCKED)       │   │ TRẠM SẴN SÀNG (AVAILABLE)     │
│ Hiển thị yêu cầu năng lực:    │   │ Nút sáng: "MỞ KHÓA TRẠM KYOTO"│
│ ○ Cần thêm 120 XP             │   └───────────────┬───────────────┘
│ ○ Cần hoàn thành Unit 03 Quiz │                   │
│ [ VÀO HỌC ĐỂ MỞ KHÓA → ]      │                   ▼ (Bấm Mở Khóa)
└───────────────────────────────┘   Ghi nhận CSDL: POST /api/journey/progress
                                                    │
                                                    ▼
                                    Khai mở Không Gian Văn Hóa Kyoto
                                    (CulturalSpaceModal)
                                    ┌───────────────────────────────┐
                                    │ 1. Xem danh thắng Đền Fushimi │
                                    │ 2. Khám phá ẩm thực Trà đạo   │
                                    │ 3. Rút quẻ may mắn Omikuji    │
                                    │ 4. ĐÓNG DẤU MỘC LƯU NIỆM EKI 💮│
                                    └───────────────┬───────────────┘
                                                    │
                                                    ▼ (Bấm Đóng Dấu Mộc)
                                    Dấu đỏ in vào Hộ chiếu điện tử
                                    Tự động kiểm tra & mở khóa Thành Tựu
                                    "Nhà thám hiểm Cố Đô Kyoto" 🏆
```

---

## 7. XỬ LÝ CÁC TRƯỜNG HỢP BIÊN & PHỤC HỒI (EDGE CASES & RECOVERY FLOWS)

### 7.1. Người học bị lỡ ngày học (Streak Freeze & Recovery)
* **Vấn đề cũ:** Khi người học quên vào app 1 ngày, `currentStreak` lập tức bị reset về 1, gây chán nản và từ bỏ học.
* **Luồng xử lý mới (Grace Period):**
  - Hệ thống cho phép "Bảo lưu chuỗi" (Streak Freeze) nếu người học quay lại trong vòng 48 giờ.
  - Khi đăng nhập lại, Home hiển thị thông báo khích lệ: *"Đừng lo lắng! Hoàn thành bài học ngay hôm nay để khôi phục chuỗi 🔥 5 ngày của bạn!"*
  - Hoàn thành bài học trong ngày phục hồi $\rightarrow$ Streak được nối lại nguyên vẹn.

### 7.2. Hàng đợi SRS trống rỗng (Zero Due Cards State)
* **Vấn đề cũ:** Người học vào `/app/review` thấy trống trơn, không biết làm gì tiếp.
* **Luồng xử lý mới (Delightful Empty State):**
  - Hiển thị thông điệp tích cực: *"Tuyệt vời! Bạn đã hoàn thành toàn bộ thẻ ôn tập hôm nay. Kiến thức đang được não bộ củng cố dài hạn."*
  - Kèm theo CTA rõ ràng: *"Trong lúc chờ đợi, bạn có muốn khám phá 10 từ vựng mới của Unit tiếp theo không?"* $\rightarrow$ Dẫn trực tiếp sang `/app/learn`.

### 7.3. Thiết bị không hỗ trợ Micro (Voice Recognition Fallback)
* Trong Chế độ sinh tồn, nếu trình duyệt không hỗ trợ Web Speech API (như iOS Safari phiên bản cũ):
  - Tự động ẩn nút Micro.
  - Chuyển sang chế độ chọn đáp án trực quan kết hợp phát âm TTS mẫu.
  - Không bao giờ hiển thị lỗi kỹ thuật hay crash giao diện.
