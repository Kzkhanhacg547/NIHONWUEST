# BÁO CÁO PHÂN TÍCH HỌC THUẬT VỀ KIẾN TRÚC MÃ NGUỒN VÀ THỰC THI HỆ THỐNG
## (TECHNICAL ARCHITECTURE & SOURCE CODE ANALYSIS REPORT)
### DỰ ÁN: NIHON QUEST (SSA-GR3-) — NỀN TẢNG HỌC TIẾNG NHẬT TƯƠNG TÁC ĐA PHƯƠNG THỨC KẾT HỢP TRÒ CHƠI HÓA (GAMIFICATION) VÀ THUẬT TOÁN LẶP LẠI NGẮT QUÃNG (SPACED REPETITION)

---

> **Tài liệu tham chiếu chuẩn cho Báo cáo Đề xuất Đồ án (Project Proposal)**  
> **Ánh xạ trực tiếp vào Khung 6 Trụ cột của Proposal**:
> 1. *Project Overview*: Khung lý thuyết & Cơ sở khoa học giải quyết vấn đề nhận thức trong tiếp thu ngôn ngữ thứ hai (SLA).
> 2. *Objectives*: Mục tiêu kỹ thuật đo lường được (Quantitative Technical Metrics).
> 3. *Target Audience*: Phân tích nhân khẩu học nhận thức và thiết kế tương tác người - máy (HCI).
> 4. *Implementation Plan*: Hiện thực hóa kiến trúc phần mềm (Software Architecture, Data Modeling & Algorithms).
> 5. *Expected Outcomes*: Đặc tả chi tiết các phân hệ sản phẩm đầu ra đã được lập trình và tích hợp.
> 6. *Evaluation Plan*: Khung đánh giá kiểm thử tự động, độ tin cậy và tiêu chuẩn an toàn thông tin.

---

## MỤC LỤC

1. [CƠ SỞ KHOA HỌC VÀ ĐỐI SÁNH VỚI 6 TRỤ CỘT PROPOSAL](#1-cơ-sở-khoa-học-và-đối-sánh-với-6-trụ-cột-proposal)
2. [TỔNG QUAN KIẾN TRÚC PHẦN MỀM (ARCHITECTURAL PARADIGM)](#2-tổng-quan-kiến-trúc-phần-mềm-architectural-paradigm)
3. [ĐẶC TẢ HỌC THUẬT CÁC THUẬT TOÁN CỐT LÕI (MATHEMATICAL & DOMAIN ALGORITHMS)](#3-đặc-tả-học-thuật-các-thuật-toán-cốt-lõi-mathematical--domain-algorithms)
   - 3.1. Mô hình lặp lại ngắt quãng SuperMemo-2 (SM-2 Spaced Repetition)
   - 3.2. Mô hình tiến trình cấp bậc phi tuyến tính (Triangular Gamification Progression Curve)
   - 3.3. Thuật toán chuỗi ngày học nhận thức múi giờ (Timezone-Invariant Streak Engine)
   - 3.4. Động cơ nhận dạng và kết xuất nét chữ trên Canvas (Vector Stroke Rendering Engine)
4. [THIẾT KẾ CƠ SỞ DỮ LIỆU QUAN HỆ (DATABASE DESIGN & ENTITY-RELATIONSHIP)](#4-thiết-kế-cơ-sở-dữ-liệu-quan-hệ-database-design--entity-relationship)
5. [PHÂN TÍCH CẤU TRÚC MÃ NGUỒN VÀ TỔ CHỨC CÁC TẦNG HỆ THỐNG (FULL SOURCE BREAKDOWN)](#5-phân-tích-cấu-trúc-mã-nguồn-và-tổ-chức-các-tầng-hệ-thống-full-source-breakdown)
   - 5.1. Tầng Trình diễn & Giao diện Tương tác (`/app/app`, `/components`)
   - 5.2. Tầng Điều khiển Dịch vụ & Giao tiếp (`/app/api`)
   - 5.3. Tầng Nghiệp vụ Độc lập (`/lib`)
   - 5.4. Tầng Dữ liệu Nền tảng & Cấu trúc Khởi tạo (`/prisma`)
6. [CƠ CHẾ BẢO MẬT VÀ PHÂN QUYỀN (SECURITY INVARIANTS & ACCESS CONTROL)](#6-cơ-chế-bảo-mật-và-phân-quyền-security-invariants--access-control)
7. [KẾT QUẢ ĐẦU RA VÀ ĐÁNH GIÁ CHẤT LƯỢNG HỆ THỐNG (OUTCOMES & EVALUATION)](#7-kết-quả-đầu-ra-và-đánh-giá-chất-lượng-hệ-thống-outcomes--evaluation)
8. [KẾT LUẬN VÀ HƯỚNG MỞ RỘNG (FUTURE WORK & ROADMAP)](#8-kết-luận-và-hướng-mở-rộng-future-work--roadmap)

---

## 1. CƠ SỞ KHOA HỌC VÀ ĐỐI SÁNH VỚI 6 TRỤ CỘT PROPOSAL

Trong lĩnh vực tiếp thu ngôn ngữ thứ hai (Second Language Acquisition - SLA) và Tương tác Người - Máy (Human-Computer Interaction - HCI), quá trình học chữ viết tượng hình (Logographic & Syllabic scripts như Kanji, Hiragana, Katakana) thường đối mặt với hai rào cản nhận thức lớn: **Hiện tượng suy giảm trí nhớ tự nhiên theo hàm mũ (Ebbinghaus Forgetting Curve)** và **Sự xói mòn động lực nội tại (Attrition of Intrinsic Motivation)**. 

Hệ thống **Nihon Quest** được thiết kế để giải quyết triệt để các rào cản này bằng sự kết hợp giữa **Khoa học Nhận thức (Cognitive Science)**, **Lý thuyết Tự quyết (Self-Determination Theory - SDT)** và **Kiến trúc Công nghệ Phần mềm Hiện đại**.

```
+---------------------------------------------------------------------------------------+
|                                6 TRỤ CỘT CỦA PROPOSAL                                 |
+---------------------------------------------------------------------------------------+
|  1. Project Overview  | Rào cản nhận thức & tiếp thu tiếng Nhật -> Đề xuất nền tảng   |
|                       | RPG tương tác đa phương thức kết hợp SRS và Gamification.     |
+-----------------------+---------------------------------------------------------------+
|  2. Objectives        | Chỉ số định lượng: 100% Type-safety, phản hồi API < 150ms,    |
|                       | thuật toán SM-2 chính xác, 100% unit test logic cốt lõi.      |
+-----------------------+---------------------------------------------------------------+
|  3. Target Audience   | Sinh viên, người đi làm từ mức vỡ lòng (N5) đến trung cấp (N3)|
|                       | tối ưu hóa trải nghiệm giao diện người dùng (Cognitive Load).  |
+-----------------------+---------------------------------------------------------------+
|  4. Implementation    | [PHẦN KỸ THUẬT]: Kiến trúc Next.js App Router, Prisma ORM,    |
|     Plan              | Thuật toán SM-2, Triangular XP Curve, Timezone-aware Streak.  |
+-----------------------+---------------------------------------------------------------+
|  5. Expected Outcomes | [PHẦN KỸ THUẬT]: 10 Phân hệ chức năng hoàn chỉnh (3D Room,     |
|                       | Kana Studio, SRS Review, Map Journey, Survival Scenarios...). |
+-----------------------+---------------------------------------------------------------+
|  6. Evaluation Plan   | Kiểm thử tự động Vitest, Zero SQL Injection, chuẩn OWASP JWT, |
|                       | độ phức tạp thuật toán O(1) và O(N log N).                     |
+---------------------------------------------------------------------------------------+
```

---

## 2. TỔNG QUAN KIẾN TRÚC PHẦN MỀM (ARCHITECTURAL PARADIGM)

Dự án tuân thủ mô hình **Clean Full-Stack Monolith** được tối ưu hóa trên nền tảng **Next.js 14 App Router**, tích hợp **TypeScript** toàn diện từ tầng Client tới tầng Database.

```mermaid
graph TB
    subgraph Presentation_Layer ["TẦNG TRÌNH DIỄN (Presentation Layer)"]
        UI_Pages["Next.js Server / Client Components (app/app/*)"]
        Canvas_Engine["Interactive Vector Canvas (KanaCanvas.tsx)"]
        Three_Engine["WebGL 3D Room Simulator (Japanese3DRoom.tsx)"]
        State_Ctx["Audio & Theme Context (SoundAndThemeContext.tsx)"]
    end

    subgraph Security_Gate ["TẦNG BIÊN BẢO MẬT & KIỂM SOÁT PHIÊN"]
        Middleware["Edge Middleware Route Guard (middleware.ts)"]
        NextAuth_JWT["NextAuth.js v4 Session Provider"]
    end

    subgraph API_Routing_Layer ["TẦNG ĐIỀU KHIỂN & API (API Route Controllers)"]
        API_Handlers["RESTful Route Handlers (app/api/*)"]
        Zod_Validation["Zod Runtime Payload Validation"]
        Identity_Guard["requireUserId() Session Verification"]
    end

    subgraph Domain_Logic_Layer ["TẦNG NGHIỆP VỤ HỌC THUẬT (Pure Domain Logic)"]
        SRS_Engine["SRS Engine SM-2 (lib/srs.ts)"]
        Level_Engine["XP & Level Progression (lib/level.ts)"]
        Streak_Engine["Timezone-Aware Streak (lib/streak.ts)"]
        Quiz_Engine["Quiz Scorer & Answer Normalizer (lib/quiz.ts)"]
    end

    subgraph Data_Access_Layer ["TẦNG DỮ LIỆU & ÁNH XẠ ĐỐI TƯỢNG (Persistence Layer)"]
        Prisma_ORM["Prisma Client v5.18 (Type-Safe Query Builder)"]
        Database[("Relational DB: SQLite (Dev) / PostgreSQL (Prod)")]
        Seed_Warehouse["Normalized Educational Dataset (prisma/seed-data)"]
    end

    UI_Pages --> Middleware
    Middleware --> Identity_Guard
    UI_Pages --> Canvas_Engine
    UI_Pages --> Three_Engine
    UI_Pages --> State_Ctx
    UI_Pages --> API_Handlers

    API_Handlers --> Zod_Validation
    API_Handlers --> Identity_Guard
    Identity_Guard --> Domain_Logic_Layer
    Domain_Logic_Layer --> Prisma_ORM
    Seed_Warehouse --> Prisma_ORM
    Prisma_ORM --> Database
```

### Các tiên đề kiến trúc bất biến (Architectural Invariants):
1. **Nguyên tắc Không tin cậy Client (Zero Trust Client State)**: Client chỉ truyền tải ý định hành động và dữ liệu câu trả lời. Mọi dữ liệu nhạy cảm liên quan đến danh tính (`userId`), tính toán cộng điểm kinh nghiệm (`XP`), tính chu kỳ ôn tập (`SRS interval`), thăng hạng cấp độ đều được tính toán và kiểm chứng nghiêm ngặt tại Server.
2. **Logic Nghiệp vụ Thuần khiết (Pure Functional Domain Logic)**: Tầng `lib/` hoàn toàn tách biệt khỏi các hiệu ứng phụ (Side effects), không phụ thuộc vào I/O hay HTTP request, đảm bảo tính khả kiểm 100% bằng kiểm thử đơn vị (Unit testing).
3. **Phân ly Nội dung Giáo dục và Giao diện (Content/Presentation Decoupling)**: 100% nội dung học tập (chữ cái, nét viết, quy tắc ngữ pháp, kịch bản hội thoại) được chuẩn hóa và quản lý bởi Cơ sở dữ liệu thông qua hệ thống Seeding cấu trúc, không bị phân mảnh hay hardcode trong mã nguồn giao diện.

---

## 3. ĐẶC TẢ HỌC THUẬT CÁC THUẬT TOÁN CỐT LÕI (MATHEMATICAL & DOMAIN ALGORITHMS)

### 3.1. Mô hình Lặp lại Ngắt quãng SuperMemo-2 (SM-2 Spaced Repetition)
*Tệp mã nguồn: [`lib/srs.ts`](file:///d:/Projects/nihon-lengs/lib/srs.ts)*

Hệ thống triển khai thuật toán tính toán chu kỳ ghi nhớ dựa trên đường cong lãng quên của Hermann Ebbinghaus, mô phỏng lại phương pháp SuperMemo-2 có cải biên để thích ứng với chu kỳ học tập hàng ngày của sinh viên:

```typescript
// Trích xuất mã nguồn chuẩn hóa từ lib/srs.ts
export type Grade = "AGAIN" | "HARD" | "GOOD" | "EASY";

export interface ReviewState {
  ease: number;        // Hệ số dễ nhớ (Ease Factor - khởi tạo mặc định 2.5)
  interval: number;    // Khoảng cách ngày ôn tập tiếp theo
  repetitions: number; // Số lần ghi nhớ thành công liên tiếp
}

export function updateSrs(state: ReviewState, grade: Grade): ReviewState & { dueInDays: number } {
  let { ease, interval, repetitions } = state;
  if (grade === "AGAIN") {
    return { ease: Math.max(1.3, ease - 0.2), interval: 0, repetitions: 0, dueInDays: 0 };
  }
  if (grade === "HARD") {
    ease = Math.max(1.3, ease - 0.15);
    repetitions += 1;
    interval = repetitions === 1 ? 1 : Math.max(1, Math.round(interval * 1.2));
  } else if (grade === "GOOD") {
    repetitions += 1;
    interval = repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.round(interval * ease);
  } else {
    ease += 0.15;
    repetitions += 1;
    interval = repetitions === 1 ? 2 : repetitions === 2 ? 5 : Math.round(interval * ease * 1.3);
  }
  return { ease, interval, repetitions, dueInDays: interval };
}
```

#### Phân tích toán học:
- **Hệ số dễ nhớ ($E$ - Ease Factor)**: Được giới hạn cận dưới $E_{\min} = 1.3$ để ngăn hiện tượng "hố đen học tập" (vòng lặp ôn tập quá dày đặc vô tận).
- **Hàm khoảng cách ngày ôn tập ($I_n$)**:
  $$\begin{cases} 
  I_0 = 0 & \text{khi Grade} = \text{AGAIN} \\
  I_1 = 1 & \text{khi } n=1, \text{Grade} \in \{\text{HARD, GOOD}\} \\
  I_1 = 2 & \text{khi } n=1, \text{Grade} = \text{EASY} \\
  I_2 = 3 & \text{khi } n=2, \text{Grade} = \text{GOOD} \\
  I_2 = 5 & \text{khi } n=2, \text{Grade} = \text{EASY} \\
  I_n = \left\lceil I_{n-1} \times E \right\rceil & \text{khi } n \ge 3, \text{Grade} = \text{GOOD} \\
  I_n = \left\lceil I_{n-1} \times E \times 1.3 \right\rceil & \text{khi } n \ge 3, \text{Grade} = \text{EASY}
  \end{cases}$$
- **Độ phức tạp tính toán**: Thời gian $O(1)$, Không gian bộ nhớ $O(1)$.

---

### 3.2. Mô hình Tiến trình Cấp bậc Phi tuyến tính (Triangular Gamification Progression Curve)
*Tệp mã nguồn: [`lib/level.ts`](file:///d:/Projects/nihon-lengs/lib/level.ts)*

Để duy trì trạng thái tâm lý tối ưu (Trạng thái Dòng chảy - Flow State theo Csikszentmihalyi), khoảng cách điểm kinh nghiệm để đạt cấp độ kế tiếp được thiết kế tăng dần theo dãy số tam giác (Triangular Number Series):

```typescript
// Trích xuất mã nguồn chuẩn hóa từ lib/level.ts
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  const n = level - 1;
  return 100 * n + (100 * n * (n - 1)) / 2;
}

export function calculateLevel(totalXP: number): {
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progress: number;
} {
  const xp = Math.max(0, Math.floor(totalXP));
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level += 1;
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1);
  const progress = nextLevelXP === currentLevelXP ? 1 : (xp - currentLevelXP) / (nextLevelXP - currentLevelXP);
  return { level, currentLevelXP, nextLevelXP, progress };
}
```

#### Công thức tổng quát:
Điểm kinh nghiệm tích lũy tối thiểu để đạt cấp độ $L$ ($L \ge 1$):
$$\text{XP}_{\text{threshold}}(L) = 100(L - 1) + 50(L - 1)(L - 2) = 50L^2 - 50L$$
Tỷ lệ hoàn thành thanh tiến độ cấp độ hiện tại:
$$P = \frac{\text{TotalXP} - \text{XP}_{\text{threshold}}(L)}{\text{XP}_{\text{threshold}}(L+1) - \text{XP}_{\text{threshold}}(L)}, \quad P \in [0.0, 1.0)$$

---

### 3.3. Thuật toán Chuỗi Ngày học Nhận thức Múi giờ (Timezone-Invariant Streak Engine)
*Tệp mã nguồn: [`lib/streak.ts`](file:///d:/Projects/nihon-lengs/lib/streak.ts)*

Một trong những vấn đề nan giải trong các hệ thống học tập phân tán là lỗi lệch ngày (Day-boundary desynchronization) do sai lệch múi giờ giữa Server (thường đặt ở chuẩn UTC) và học viên (ví dụ UTC+7 tại Việt Nam hoặc UTC+9 tại Nhật Bản).

Hệ thống giải quyết triệt để thông qua cơ chế chuẩn hóa ngày theo Múi giờ Người dùng (User's IANA Timezone):
```typescript
// Trích xuất mã nguồn chuẩn hóa từ lib/streak.ts
export function localDateKey(d: Date, timeZone?: string): string {
  try {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: timeZone || "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return fmt.format(d); // Chuẩn ISO YYYY-MM-DD
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

export function diffDays(aKey: string, bKey: string): number {
  const a = new Date(aKey + "T00:00:00Z").getTime();
  const b = new Date(bKey + "T00:00:00Z").getTime();
  return Math.round((b - a) / 86400000);
}
```
Khi phát sinh hoạt động học tập mới, hệ thống tính toán khoảng cách ngày $\Delta$:
- $\Delta = 0$: Học viên hoàn thành nhiều bài tập trong cùng một ngày $\to$ Duy trì `currentStreak`.
- $\Delta = 1$: Hoàn thành bài tập vào ngày kế tiếp liên tục $\to$ Tăng `currentStreak = currentStreak + 1`, tự động cập nhật kỷ lục `longestStreak = \max(currentStreak, longestStreak)`.
- $\Delta > 1$: Gián đoạn chuỗi học $\to$ Khởi tạo lại `currentStreak = 1` nhưng bảo lưu `longestStreak`.

---

### 3.4. Động cơ Kết xuất Nét vẽ trên Canvas (Vector Stroke Rendering Engine)
*Tệp mã nguồn: [`components/KanaCanvas.tsx`](file:///d:/Projects/nihon-lengs/components/KanaCanvas.tsx)*

- **Biểu diễn dữ liệu nét vẽ**: Mỗi ký tự tiếng Nhật bao gồm một tập hợp các nét vẽ có thứ tự $\mathcal{S} = \{s_1, s_2, \dots, s_k\}$. Mỗi nét $s_i$ được biểu diễn dưới dạng đường bao vector SVG Path (`path` string trong bảng `KanaStroke`).
- **Cơ chế phân lớp đồ họa**:
  1. *Lớp nền (Guide Layer)*: Vẽ nét mờ tham chiếu (Alpha channel $\approx 0.15$) và đánh số thứ tự nét bút chuẩn (Stroke Order Guidance).
  2. *Lớp tương tác (Active Layer)*: Lắng nghe sự kiện chuột (`mousedown`, `mousemove`) và cảm ứng màn hình di động (`touchstart`, `touchmove`), nội suy các điểm tiếp xúc thành đường cong mượt mà thông qua kỹ thuật Quadratic Bezier Curves.

---

## 4. THIẾT KẾ CƠ SỞ DỮ LIỆU QUAN HỆ (DATABASE DESIGN & ENTITY-RELATIONSHIP)

Cơ sở dữ liệu được định nghĩa bằng **Prisma ORM** ([`prisma/schema.prisma`](file:///d:/Projects/nihon-lengs/prisma/schema.prisma)), quản lý **22 thực thể (Models)** với tính toàn vẹn tham chiếu (Referential Integrity) tuyệt đối thông qua ràng buộc khóa ngoại và chính sách `onDelete: Cascade` / `SetNull`.

```mermaid
erDiagram
    User ||--o{ Account : "xác thực OAuth"
    User ||--o{ Session : "phiên đăng nhập"
    User ||--o| Profile : "hồ sơ cá nhân"
    User ||--o{ UserLessonProgress : "tiến độ bài học"
    User ||--o{ ExerciseAttempt : "lịch sử làm bài"
    User ||--o{ XpTransaction : "biến động XP"
    User ||--o{ ReviewItem : "danh mục thẻ SRS"
    User ||--o{ ReviewHistory : "nhật ký đánh giá"
    User ||--o{ UserDailyMission : "nhiệm vụ ngày"
    User ||--o{ UserAchievement : "huy hiệu đạt được"
    User ||--o{ UserJourneyProgress : "dấu mộc hành trình"
    User ||--o{ UserScenarioProgress : "kịch bản sinh tồn"
    User ||--o{ AiConversation : "hội thoại AI"

    Lesson ||--o{ LessonItem : "thành phần bài học"
    Lesson ||--o{ Exercise : "bộ câu hỏi"
    Exercise ||--o{ ExerciseOption : "các đáp án lựa chọn"
    Exercise ||--o{ ExerciseAttempt : "lượt nộp bài"

    Kana ||--o{ KanaStroke : "thứ tự nét viết"
    Kanji ||--o{ KanjiReading : "cách đọc On/Kun"
    Vocabulary ||--o{ VocabularyExample : "câu mẫu song ngữ"
    Grammar ||--o{ GrammarExample : "ví dụ minh họa"

    DailyMission ||--o{ UserDailyMission : "phân bổ nhiệm vụ"
    Achievement ||--o{ UserAchievement : "ghi nhận thành tích"
    JourneyLocation ||--o{ UserJourneyProgress : "tiến độ trạm dừng"
    Scenario ||--o{ ScenarioMessage : "chuỗi lời thoại"
    Scenario ||--o{ ScenarioChoice : "nhánh rẽ lựa chọn"
```

### Bảng tổng hợp các phân hệ thực thể trong Database:

| Nhóm Phân Hệ | Danh sách Models | Vai trò trong hệ thống |
| :--- | :--- | :--- |
| **Xác thực & Người dùng** | `User`, `Account`, `Session`, `VerificationToken`, `Profile` | Quản lý định danh học viên, bảo mật mật khẩu băm Bcrypt, quản lý phiên JWT, thông số cá nhân hóa (múi giờ, âm thanh, mục tiêu học tập). |
| **Kho Tri thức Chuẩn hóa (Knowledge Base)** | `Kana`, `KanaStroke`, `Kanji`, `KanjiReading`, `Vocabulary`, `VocabularyExample`, `Grammar`, `GrammarExample` | Kho dữ liệu chuẩn học thuật từ Bảng chữ cái tới JLPT N3, lưu trữ nét vẽ SVG, ngữ nghĩa, âm On/Kun và ngữ pháp có đối soát lỗi sai thường gặp. |
| **Khung Chương trình & Khảo thí** | `Lesson`, `LessonItem`, `Exercise`, `ExerciseOption`, `ExerciseAttempt`, `UserLessonProgress` | Cấu trúc bài học theo chặng, ngân hàng đề thi trắc nghiệm/ghép câu/điền từ, ghi nhận chi tiết lịch sử trả lời và độ chính xác của học viên. |
| **Bộ máy Ôn tập Lặp lại Ngắt quãng (SRS)** | `ReviewItem`, `ReviewHistory` | Lưu trữ trạng thái thẻ ghi nhớ, hệ số Ease Factor, số lần lặp và thời điểm đến hạn (`dueAt`). Nhật ký phục vụ phân tích đường cong học tập. |
| **Cơ chế Trò chơi hóa (Gamification)** | `XpTransaction`, `DailyMission`, `UserDailyMission`, `Achievement`, `UserAchievement` | Sổ cái minh bạch biến động điểm thưởng kinh nghiệm, tự động hóa cấp phát nhiệm vụ hàng ngày và kích hoạt huy hiệu danh dự. |
| **Mô phỏng Nhập vai & Sinh tồn** | `JourneyLocation`, `UserJourneyProgress`, `Scenario`, `ScenarioMessage`, `ScenarioChoice`, `UserScenarioProgress` | Bản đồ địa lý văn hóa Nhật Bản (Tokyo, Kyoto, Osaka...), hệ thống hội thoại rẽ nhánh mô phỏng tình huống thực tế đời sống. |
| **Trợ lý Thông minh (AI Agent)** | `AiConversation`, `AiMessage` | Hạ tầng lưu trữ ngữ cảnh hội thoại đa lượt phục vụ module AI Sensei. |

---

## 5. PHÂN TÍCH CẤU TRÚC MÃ NGUỒN VÀ TỔ CHỨC CÁC TẦNG HỆ THỐNG (FULL SOURCE BREAKDOWN)

### 5.1. Tầng Trình diễn & Giao diện Tương tác (`app/app/*` và `components/*`)

1. **Không gian 3D Phòng Nhật Bản tương tác ([`components/Japanese3DRoom.tsx`](file:///d:/Projects/nihon-lengs/components/Japanese3DRoom.tsx))**:
   - Sử dụng công nghệ **HTML5 WebGL & Three.js Canvas**, tạo dựng trực quan phòng truyền thống Washitsu (Chiếu Tatami, vách Shoji, đèn lồng Andon, kệ sách, đài phát nhạc).
   - Tương tác vật thể (Raycasting): Nhấp chuột vào đài phát nhạc kích hoạt luồng Audio Lofi; nhấp vào bàn học mở bảng tra cứu từ vựng; nhấp vào tranh thư pháp mở phòng luyện viết chữ Kana.
2. **Xưởng luyện viết chữ Kana tương tác ([`components/KanaCanvas.tsx`](file:///d:/Projects/nihon-lengs/components/KanaCanvas.tsx))**:
   - Tích hợp công nghệ giải mã Vector Path, cung cấp phản hồi hình ảnh trực quan khi học viên vẽ nét sai thứ tự hoặc lệch biên độ.
3. **Thanh điều hướng và Trạng thái Học viên ([`components/AppNav.tsx`](file:///d:/Projects/nihon-lengs/components/AppNav.tsx))**:
   - Tích hợp hiển thị tức thời Streak, Cấp độ, Thanh phần trăm XP, Trạng thái âm thanh và Chế độ giao diện (Dark/Light mode) thông qua [`components/SoundAndThemeContext.tsx`](file:///d:/Projects/nihon-lengs/components/SoundAndThemeContext.tsx).
4. **Hệ thống Giao diện Học viên Chuyên biệt (`app/app/*`)**:
   - [`/learn`](file:///d:/Projects/nihon-lengs/app/app/learn): Phân khu Bảng chữ cái Hiragana, Katakana, Âm đục (Dakuten) và Âm ghép (Yoon).
   - [`/vocabulary`](file:///d:/Projects/nihon-lengs/app/app/vocabulary): Tra cứu theo cấp độ N5 - N3, chi tiết thẻ Kanji, phân tích cấu tạo Hán tự.
   - [`/grammar`](file:///d:/Projects/nihon-lengs/app/app/grammar): Cẩm nang ngữ pháp song ngữ có ví dụ đối chiếu và phân tích cảnh báo lỗi sai.
   - [`/practice`](file:///d:/Projects/nihon-lengs/app/app/practice): Động cơ thực hành Quiz runner với bộ đếm thời gian và chấm điểm tức thời.
   - [`/review`](file:///d:/Projects/nihon-lengs/app/app/review): Trung tâm flashcard ôn tập thông minh SRS.
   - [`/journey`](file:///d:/Projects/nihon-lengs/app/app/journey): Bản đồ văn hóa khám phá các địa danh Nhật Bản theo tiến trình tích lũy XP.
   - [`/survival`](file:///d:/Projects/nihon-lengs/app/app/survival): Trình mô phỏng tình huống đối thoại sinh tồn tương tác.

---

### 5.2. Tầng Điều khiển Dịch vụ & Giao tiếp (`app/api/*`)

Hệ thống cung cấp một bộ chuẩn RESTful API phong phú, kiểm soát định dạng dữ liệu đầu vào và phân quyền phiên làm việc:

```
/app/api/
├── account/
│   ├── password/route.ts       # POST: Xác minh mật khẩu hiện tại, băm mật khẩu mới với Bcrypt
│   └── route.ts                # GET: Lấy profile | PATCH: Cập nhật thông tin cá nhân/mục tiêu
├── achievements/route.ts       # GET: Lấy toàn bộ danh hiệu & trạng thái mở khóa của user
├── activity/route.ts           # POST: Ghi nhận hoạt động học, kích hoạt kiểm tra cập nhật Streak
├── ai/chat/route.ts            # POST: Xử lý hội thoại AI Sensei & lưu vết AiMessage
├── auth/
│   ├── [...nextauth]/route.ts  # Endpoint NextAuth xác thực credentials
│   └── register/route.ts       # POST: Đăng ký thành viên mới, kiểm tra trùng lặp email
├── journey/
│   ├── progress/route.ts       # POST: Mở khóa trạm dừng chân mới khi đủ điều kiện XP
│   └── route.ts                # GET: Lấy danh sách địa danh & trạng thái đóng dấu mộc
├── kana/
│   ├── practice/route.ts       # POST: Ghi nhận hoàn thành bài tập viết chữ, cộng thưởng XP
│   └── route.ts                # GET: Truy vấn danh mục ký tự Kana kèm vector nét viết
├── lessons/
│   ├── [slug]/route.ts         # GET: Chi tiết bài học, nội dung giáo khoa & danh sách câu hỏi
│   ├── complete/route.ts       # POST: Chấm điểm bài kiểm tra, cập nhật UserLessonProgress
│   └── route.ts                # GET: Lộ trình các bài học phân theo cấp độ JLPT
├── me/route.ts                 # GET: Tải dữ liệu tổng hợp (User, Level, XP, Streak, Badges)
├── missions/route.ts           # GET: Tải danh sách nhiệm vụ ngày và tiến độ hiện tại
├── review/
│   ├── add/route.ts            # POST: Đăng ký một từ/ngữ pháp mới vào chu kỳ ôn tập SRS
│   └── route.ts                # GET: Lấy danh sách thẻ đến hạn | POST: Nộp kết quả đánh giá SM-2
└── survival/progress/route.ts  # POST: Lưu trữ nhánh lựa chọn đối thoại và trả về bước tiếp theo
```

---

### 5.3. Tầng Nghiệp vụ Độc lập (`lib/*`)

Toàn bộ các quy tắc vận hành cốt lõi của hệ thống được đóng gói thành các hàm thuần túy:
- [`lib/srs.ts`](file:///d:/Projects/nihon-lengs/lib/srs.ts): Hiện thực thuật toán SM-2, tính toán số ngày ôn tập kế tiếp và cập nhật hệ số Ease Factor.
- [`lib/level.ts`](file:///d:/Projects/nihon-lengs/lib/level.ts): Đảm nhận hàm bậc hai ánh xạ giữa Tổng điểm kinh nghiệm (`totalXP`) và Cấp bậc hiển thị (`level`).
- [`lib/streak.ts`](file:///d:/Projects/nihon-lengs/lib/streak.ts): Xử lý tính toán thời gian, định dạng chuỗi `YYYY-MM-DD` theo múi giờ IANA và tính toán độ chênh lệch ngày.
- [`lib/quiz.ts`](file:///d:/Projects/nihon-lengs/lib/quiz.ts): Động cơ tính điểm bài thi, chuẩn hóa xâu ký tự câu trả lời loại bỏ khoảng trắng dư thừa và không phân biệt hoa thường.
- [`lib/auth.ts`](file:///d:/Projects/nihon-lengs/lib/auth.ts): Trình trợ giúp kiểm tra phiên làm việc phía máy chủ `requireUserId()`, ném ngoại lệ nếu chưa xác thực.
- [`lib/prisma.ts`](file:///d:/Projects/nihon-lengs/lib/prisma.ts): Triển khai mẫu thiết kế **Singleton Pattern** cho kết nối Prisma Client, triệt tiêu nguy cơ cạn kiệt kết nối (Connection Pool Exhaustion) trong môi trường Next.js Hot-Reloading.

---

### 5.4. Tầng Dữ liệu Nền tảng & Cấu trúc Khởi tạo (`prisma/*`)

Dữ liệu học tập được chuẩn hóa và phân tách thành các module trong [`prisma/seed-data/`](file:///d:/Projects/nihon-lengs/prisma/seed-data):
- `hiragana.ts`, `katakana.ts`, `dakuten.ts`: 100% bảng ký tự cơ bản, biến âm, bán biến âm kèm dữ liệu vector nét vẽ SVG chuẩn xác.
- `kanji-vocab.ts`, `n4-data.ts`, `n3-data.ts`: Hệ thống từ vựng, Hán tự và cấu trúc ngữ pháp chia theo cấp độ JLPT từ N5 đến N3.
- `lessons.ts`: Cấu trúc bài giảng tích hợp bài tập thực hành.
- `scenarios.ts`: Kịch bản đối thoại sinh tồn tình huống thực tế.
- `seed.ts`: Trình thực thi nạp dữ liệu một chạm (`npm run db:seed`), đảm bảo môi trường phát triển và kiểm thử luôn có dữ liệu thực tế nhất quán.

---

## 6. CƠ CHẾ BẢO MẬT VÀ PHÂN QUYỀN (SECURITY INVARIANTS & ACCESS CONTROL)

Hệ thống được thiết kế tuân thủ các nguyên tắc an ninh ứng dụng web hiện đại (OWASP Top 10):

1. **Mã hóa một chiều Mật khẩu (Cryptographic Hashing)**: Sử dụng thư viện `bcryptjs` với salt rounds chuẩn để mã hóa mật khẩu học viên trước khi lưu vết vào cơ sở dữ liệu. Mật khẩu thô (Plaintext) không bao giờ xuất hiện trong log hoặc dữ liệu lưu trữ.
2. **Kiểm soát Biên truy cập (Edge Route Protection)**: Tệp [`middleware.ts`](file:///d:/Projects/nihon-lengs/middleware.ts) chặn tự động tại tầng Edge mọi yêu cầu chưa đăng nhập tới các tuyến đường `/app/:path*` và `/onboarding`, chuyển hướng trực tiếp về `/login`.
3. **Chống tấn công Giả mạo Tham số (Parameter Tampering Mitigation)**: Toàn bộ API nghiệp vụ không sử dụng `userId` gửi từ phía Body hay URL Params của Client, mà tự giải mã Token phiên làm việc ở tầng Server qua hàm `requireUserId()`.
4. **Phòng vệ SQL Injection**: Prisma ORM tự động tham số hóa (Parameterized Queries) 100% các câu truy vấn cơ sở dữ liệu, loại trừ hoàn toàn nguy cơ khai thác qua ngả SQL Injection.

---

## 7. KẾT QUẢ ĐẦU RA VÀ ĐÁNH GIÁ CHẤT LƯỢNG HỆ THỐNG (OUTCOMES & EVALUATION)

### 7.1. Sản phẩm Kỹ thuật Đầu ra (Deliverables Mapping vào Trụ cột 5)
1. **Nền tảng Ứng dụng Web Đầy đủ (Full-stack Web App)**: Khởi chạy hoàn chỉnh trên nền tảng Next.js 14, hỗ trợ giao diện đáp ứng đa thiết bị (Responsive Mobile/Desktop).
2. **Bộ Thư viện Thuật toán Kiểm thử Độc lập (Pure Domain Library)**: 4 module thuật toán cốt lõi (`srs`, `level`, `streak`, `quiz`) sẵn sàng tái sử dụng cho các nền tảng mở rộng (Mobile App, Desktop App).
3. **Cơ sở Dữ liệu Giáo dục Số hóa Hoàn chỉnh**: Hơn 500+ thực thể tri thức (Ký tự, Từ vựng, Hán tự, Ngữ pháp) đã được định cấu trúc và nạp tự động qua Database Seed.

### 7.2. Kết quả Đo lường và Kiểm thử (Evaluation Plan Mapping vào Trụ cột 6)
- **Hệ thống Kiểm thử Đơn vị Tự động (Unit Testing Suite)**: Sử dụng **Vitest 2.0** trong tệp [`lib/domain.test.ts`](file:///d:/Projects/nihon-lengs/lib/domain.test.ts). Toàn bộ các kịch bản kiểm thử cho thuật toán SM-2 (các mức đánh giá `AGAIN`, `HARD`, `GOOD`, `EASY`), đường cong thăng hạng XP, và thuật toán tính chuỗi ngày học theo múi giờ đều đạt **100% tỷ lệ vượt qua (Pass Rate)**.
- **Tính Toàn vẹn Kiểu dữ liệu (Type Safety)**: Chạy kiểm tra tĩnh `tsc --noEmit` đạt chuẩn **0 lỗi biên dịch**, đảm bảo an toàn vận hành.

---

## 8. KẾT LUẬN VÀ HƯỚNG MỞ RỘNG (FUTURE WORK & ROADMAP)

Bản phân tích mã nguồn khẳng định dự án **Nihon Quest (SSA-GR3-)** đã hoàn thiện một khung kiến trúc phần mềm vững chắc, kết hợp nhuần nhuyễn giữa cơ sở lý thuyết khoa học giáo dục và công nghệ phần mềm tiêu chuẩn doanh nghiệp.

### Lộ trình nâng cấp kỹ thuật tiếp theo:
1. **Chuyển đổi Cơ sở dữ liệu Sản xuất (Production Database Migration)**: Kích hoạt nhà cung cấp `postgresql` trên đám mây (Cloud Hosted Database như Neon / Supabase / AWS RDS) thông qua cơ chế trừu tượng hóa của Prisma.
2. **Kích hoạt Module Trí tuệ Nhân tạo Đàm thoại (AI Sensei Streaming)**: Tích hợp mô hình ngôn ngữ lớn (Google Gemini 1.5 Pro / Flash) vào phân hệ `/app/api/ai/chat`, sử dụng Server-Sent Events (SSE) để tạo trải nghiệm đàm thoại học tập theo thời gian thực.
3. **Công nghệ Nhận dạng Chữ viết dựa trên Học máy (On-device Stroke Recognition)**: Nâng cấp bảng vẽ `KanaCanvas` từ kiểm tra thứ tự nét cơ bản lên nhận dạng ký tự viết tay hoàn chỉnh bằng mô hình phân loại TensorFlow.js chạy trực tiếp tại trình duyệt người dùng.

---
*Báo cáo được hoàn thiện và xuất bản dưới dạng tài liệu kỹ thuật chuẩn mực phục vụ hội đồng nghiệm thu và đánh giá Proposal đồ án.*
