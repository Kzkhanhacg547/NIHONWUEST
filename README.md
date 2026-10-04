# 🌸 Nihon Quest (SSA-GR3-) — Nền Tảng Học Tiếng Nhật Tương Tác & Gamification

> **Nihon Quest** là ứng dụng web học tiếng Nhật toàn diện (từ cơ bản Bảng chữ cái đến JLPT N5 – N3), kết hợp phương pháp học hiện đại, gamification (trò chơi hoá), mô phỏng không gian văn hóa Nhật Bản 3D, luyện viết chữ Kana/Kanji trực quan trên Canvas, và hệ thống ôn tập lặp lại ngắt quãng (Spaced Repetition System - SRS).

---

## 📑 Mục Lục

1. [Giới Thiệu Tổng Quan](#-giới-thiệu-tổng-quan)
2. [Các Tính Năng Nổi Bật](#-các-tính-năng-nổi-bật)
3. [Công Nghệ Sử Dụng (Tech Stack)](#-công-nghệ-sử-dụng-tech-stack)
4. [Cấu Trúc Thư Mục Dự Án](#-cấu-trúc-thư-mục-dự-án)
5. [Yêu Cầu Hệ Thống (Prerequisites)](#-yêu-cầu-hệ-thống-prerequisites)
6. [Hướng Dẫn Cài Đặt & Khởi Chạy Chi Tiết (Setup Guide)](#-hướng-dẫn-cài-đặt--khởi-chạy-chi-tiết)
7. [Cấu Hình Biến Môi Trường (.env)](#-cấu-hình-biến-môi-trường-env)
8. [Quản Lý Cơ Sở Dữ Liệu & Dữ Liệu Mẫu (Database & Seed)](#-quản-lý-cơ-sở-dữ-liệu--dữ-liệu-mẫu)
9. [Danh Sách Lệnh Scripts (NPM Scripts)](#-danh-sách-lệnh-scripts)
10. [Xử Lý Sự Cố Thường Gặp (Troubleshooting)](#-xử-lý-sự-cố-thường-gặp)
11. [Đóng Góp & Bản Quyền](#-đóng-góp--bản-quyền)

---

## 🌟 Giới Thiệu Tổng Quan

Dự án **Nihon Quest** được phát triển theo kiến trúc Full-stack Monolith hiện đại trên nền tảng **Next.js 14 App Router**. Ứng dụng giải quyết bài toán khô khan khi học ngoại ngữ bằng cách đưa người học vào một hành trình nhập vai khám phá Nhật Bản:
- Học qua các giác quan: Hình ảnh, âm thanh phát âm bản ngữ, vẽ tay trực tiếp nét bút.
- Duy trì động lực học tập qua cơ chế tích lũy kinh nghiệm (XP), chuỗi ngày học (Streak), nhiệm vụ hàng ngày và bảng xếp hạng.
- Ghi nhớ sâu dài hạn nhờ thuật toán lặp lại ngắt quãng (SRS).

---

## 🚀 Các Tính Năng Nổi Bật

### 1. ⛩️ Không Gian Phòng Nhật Bản 3D (Interactive Japanese Room)
- Trải nghiệm tương tác 3D với căn phòng mang phong cách truyền thống Nhật Bản (chiếu Tatami, cửa lùa Shoji, đèn lồng, kệ sách, máy phát nhạc...).
- Tích hợp phát nhạc nền Lofi / thư giãn và các hiệu ứng âm thanh phong phú.
- Hỗ trợ đổi chế độ giao diện Sáng / Tối (Dark & Light Theme).

### 2. ✍️ Kana Lab & Luyện Viết Canvas (Interactive Kana Studio)
- Học đầy đủ bảng chữ cái Hiragana, Katakana, Âm đục (Dakuten), Bán âm đục (Handakuten) và Âm ghép (Yoon).
- Bảng vẽ Canvas cảm ứng/chuột để tập viết theo thứ tự nét chuẩn (stroke order).
- Phát âm thanh Audio chuẩn IPA cho từng ký tự.

### 3. 📖 Kho Từ Vựng & Ngữ Pháp JLPT (N5 – N3)
- Hệ thống thẻ học (Flashcards) phân loại rõ ràng theo cấp độ N5, N4, N3.
- Chi tiết từng chữ Hán (Kanji): Âm On, âm Kun, nghĩa Hán-Việt, nét viết.
- Điểm ngữ pháp có cấu trúc chuẩn, giải thích chi tiết, ví dụ song ngữ Nhật - Việt/Romaji và các lỗi sai thường gặp.

### 4. 🧠 Hệ Thống Ôn Tập SRS (Spaced Repetition System)
- Thuật toán ôn tập khoa học dựa trên đường cong quên lãng Ebbinghaus.
- Tự động lên lịch ôn tập cho các từ vựng, chữ cái người dùng đã lưu hoặc làm sai.
- Chấm điểm độ nhớ (Easy / Good / Hard / Again) để tính toán chu kỳ ôn tiếp theo.

### 5. 🎯 Bài Tập Thực Hành & Quiz Đa Dạng
- Đầy đủ các dạng bài tập: Trắc nghiệm, điền từ vào chỗ trống, ghép nghĩa, dịch câu.
- Chấm điểm trực tiếp, giải thích đáp án và thưởng điểm kinh nghiệm (XP) tức thì.

### 6. 🗺️ Bản Đồ Hành Trình Khám Phá (Japan Journey)
- Bản đồ tương tác đưa người học chu du qua các thành phố nổi tiếng của Nhật Bản: Tokyo, Kyoto, Osaka, Sapporo, Hiroshima...
- Mỗi chặng dừng chân gắn liền với bài học và mốc thử thách cần vượt qua để mở khóa địa điểm mới.

### 7. 🏆 Trò Chơi Hoá (Gamification)
- **Hệ thống cấp bậc & XP**: Tích lũy điểm khi hoàn thành bài tập, lên cấp người học.
- **Chuỗi ngày học (Streak)**: Theo dõi và nhắc nhở duy trì thói quen học mỗi ngày.
- **Nhiệm vụ hàng ngày (Daily Missions)**: Nhận thưởng khi đạt mục tiêu trong ngày.
- **Huy hiệu Thành Tựu (Achievements)**: Mở khóa các danh hiệu độc đáo.
- **Bảng xếp hạng (Leaderboard)**: Đua top thi đua cùng các học viên khác.

### 8. 🤖 AI Sensei & Tình Huống Sinh Tồn (Survival Scenarios)
- Chatbot trợ lý học tập AI Sensei hỗ trợ giải đáp thắc mắc ngữ pháp, dịch thuật 24/7.
- Mô phỏng các tình huống thực tế khi du lịch hoặc sinh sống tại Nhật: Đặt món tại nhà hàng, hỏi đường, mua đồ ở Konbini, làm thủ tục sân bay...

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Thành phần | Công nghệ | Chi tiết |
| :--- | :--- | :--- |
| **Framework** | Next.js 14.2.5 | App Router, Server Actions, API Route Handlers |
| **Giao diện** | React 18, Tailwind CSS | Vanilla UI Components tinh chỉnh, Responsive đa thiết bị |
| **Đồ họa & 3D** | HTML5 Canvas, Three.js | Vẽ nét Kana/Kanji, Render phòng 3D tương tác |
| **Ngôn ngữ** | TypeScript 5.5 | Đảm bảo Type-safety 100% toàn dự án |
| **Cơ sở dữ liệu** | SQLite (Dev) / PostgreSQL (Prod) | Thiết lập zero-config cho môi trường phát triển |
| **ORM** | Prisma ORM 5.18.0 | Type-safe queries, Migrations, Seeding tự động |
| **Xác thực** | NextAuth.js v4 + Prisma Adapter | Đăng nhập bằng Email/Password (Bcrypt hashed), JWT Session |
| **Kiểm thử** | Vitest 2.0 | Unit tests cho logic cốt lõi (SRS, Level, Streak, Quiz) |
| **Xác thực dữ liệu**| Zod 3.23 | Schema validation cho form input và API payloads |

---

## 📁 Cấu Trúc Thư Mục Dự Án

```plaintext
nihon-lengs/
├── app/                           # Next.js 14 App Router
│   ├── api/                       # REST API Route Handlers
│   │   ├── account/               # Quản lý thông tin & đổi mật khẩu
│   │   ├── auth/[...nextauth]/    # Xác thực NextAuth endpoints
│   │   ├── journey/               # Tiến độ mở khóa bản đồ
│   │   ├── kana/                  # Dữ liệu & lịch sử tập viết Kana
│   │   ├── lessons/               # Bài học & nộp bài kiểm tra
│   │   ├── review/                # Thuật toán & tương tác SRS
│   │   └── ...                    # Các API khác
│   ├── app/                       # Ứng dụng chính sau khi đăng nhập
│   │   ├── grammar/               # Trang ngữ pháp N5 - N3
│   │   ├── journey/               # Trang bản đồ hành trình
│   │   ├── leaderboard/           # Trang bảng xếp hạng
│   │   ├── learn/                 # Kana Lab & Luyện nét viết
│   │   ├── practice/              # Trang làm bài tập & Quiz Runner
│   │   ├── profile/               # Quản lý trang cá nhân, bảo mật
│   │   ├── review/                # Trung tâm ôn tập thẻ SRS
│   │   ├── sensei/                # AI Sensei Chat
│   │   ├── survival/              # Tình huống sinh tồn thực tế
│   │   └── vocabulary/            # Từ điển từ vựng & chữ Hán
│   ├── layout.tsx                 # Root layout, Fonts & Global Providers
│   └── page.tsx                   # Landing page giới thiệu ứng dụng
├── components/                    # React Components tái sử dụng
│   ├── AppNav.tsx                 # Thanh điều hướng ứng dụng
│   ├── Japanese3DRoom.tsx         # Mô hình phòng 3D Nhật Bản
│   ├── KanaCanvas.tsx             # Bảng vẽ Canvas tập viết chữ
│   ├── SoundAndThemeContext.tsx   # Quản lý âm thanh và giao diện Sáng/Tối
│   └── ui.tsx                     # Bộ thư viện UI Button, Card, Dialog, Badge...
├── lib/                           # Logic cốt lõi & Pure functions
│   ├── auth.ts                    # Cấu hình NextAuth & Session helper
│   ├── level.ts                   # Thuật toán tính XP & Cấp độ
│   ├── prisma.ts                  # Khởi tạo Prisma Client singleton
│   ├── quiz.ts                    # Bộ sinh đề trắc nghiệm
│   ├── srs.ts                     # Thuật toán lặp lại ngắt quãng SRS
│   └── streak.ts                  # Thuật toán quản lý chuỗi ngày học
├── prisma/                        # Cấu hình CSDL & Dữ liệu
│   ├── migrations/                # Lịch sử lược đồ CSDL
│   ├── schema.prisma              # Định nghĩa các Models Prisma
│   ├── seed.ts                    # Script nạp dữ liệu mẫu tự động
│   └── seed-data/                 # Dữ liệu chi tiết Kana, Từ vựng, Ngữ pháp, Bài học
├── scripts/                       # Các kịch bản tiện ích (cleanup, check db)
└── vitest.config.ts               # Cấu hình chạy Unit Tests
```

---

## 💻 Yêu Cầu Hệ Thống (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:
- **Node.js**: Phiên bản **18.17.0** trở lên (Khuyến nghị **Node.js 20 LTS**).
- **Trình quản lý gói**: `npm` (đi kèm Node.js), `yarn`, hoặc `pnpm`.
- **Git**: Đã cài đặt trên máy.

Kiểm tra phiên bản bằng lệnh:
```bash
node -v
npm -v
git --version
```

---

## ⚡ Hướng Dẫn Cài Đặt & Khởi Chạy Chi Tiết

Thực hiện lần lượt các bước sau trong Terminal / Command Prompt:

### Bước 1: Clone Repository về máy
```bash
git clone https://github.com/Kzkhanhacg547/SSA-GR3-.git
cd SSA-GR3-
```
*(Hoặc vào thư mục dự án hiện tại của bạn)*

### Bước 2: Cài đặt các gói phụ thuộc (Dependencies)
```bash
npm install
```

### Bước 3: Thiết lập file môi trường (.env)
Tạo file `.env` từ mẫu `.env.example`:
- **Trên Windows (PowerShell):**
  ```powershell
  Copy-Item .env.example .env
  ```
- **Trên macOS / Linux / Git Bash:**
  ```bash
  cp .env.example .env
  ```

> 💡 *Mặc định dự án dùng SQLite cục bộ (`DATABASE_URL="file:./dev.db"`), bạn không cần cài thêm MySQL hay PostgreSQL để chạy thử nghiệm.*

### Bước 4: Chạy setup chuẩn cho repo mới hoặc khi database bị thiếu dữ liệu
Script chuẩn này sẽ cài đặt dependency, tạo/đồng bộ database và seed dữ liệu mẫu một cách idempotent:
```bash
npm run setup
```
*Sau khi setup thành công, CSDL sẽ có sẵn hàng ngàn từ vựng, chữ cái, bài học và dữ liệu nền từ N5 đến N3.*

### Bước 5: Khởi chạy môi trường phát triển (Local Dev Server)
```bash
npm run dev
```

> Nếu bạn đã có repo cũ và muốn đảm bảo dữ liệu luôn đồng bộ khi dừng / chạy lại, hãy dùng `npm run dev` hoặc `npm run build`; chúng đều tự chạy `prisma migrate deploy` và `db:seed` trước khi khởi động, nên không bị thiếu dữ liệu sau khi restart.

Mở trình duyệt và truy cập:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Cấu Hình Biến Môi Trường (.env)

Nội dung cơ bản trong file `.env`:

```env
# 1. Cơ sở dữ liệu mặc định (SQLite cho môi trường Dev)
DATABASE_URL="file:./dev.db"

# 2. Cấu hình NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-only-change-me-min-32-chars-long-secret"

# 3. Khi triển khai lên môi trường Production (PostgreSQL):
# DATABASE_URL="postgresql://username:password@localhost:5432/nihon_quest?schema=public"
# NEXTAUTH_URL="https://your-domain.com"
# NEXTAUTH_SECRET="chuoi-bi-mat-dai-sinh-bang-openssl"
```

> **Cách tạo `NEXTAUTH_SECRET` ngẫu nhiên bảo mật:**
> ```bash
> openssl rand -base64 32
> ```

---

## 🗄️ Quản Lý Cơ Sở Dữ Liệu & Dữ Liệu Mẫu

Dự án cung cấp các công cụ tiện lợi tích hợp sẵn với Prisma:

- **Xem và chỉnh sửa dữ liệu trực quan (Prisma Studio)**:
  ```bash
  npm run db:studio
  ```
  *Truy cập [http://localhost:5555](http://localhost:5555) để xem trực quan các bảng: User, Lesson, Vocabulary, Grammar, Kana, ReviewItem...*

- **Nạp lại dữ liệu bài học & từ vựng (Idempotent Seed)**:
  ```bash
  npm run db:seed
  ```

- **Tạo tài khoản thử nghiệm**:
  Bạn có thể đăng ký tài khoản mới trực tiếp tại trang web thông qua đường dẫn `/register`. Dữ liệu mật khẩu sẽ được tự động băm an toàn bằng thuật toán `bcryptjs`.

---

## 📜 Danh Sách Lệnh Scripts

| Lệnh | Công dụng |
| :--- | :--- |
| `npm run dev` | Khởi chạy máy chủ phát triển tại cổng 3000 |
| `npm run build` | Tạo bản build production tối ưu hóa |
| `npm run start` | Khởi chạy bản build production |
| `npm run typecheck` | Kiểm tra tính toàn vẹn kiểu dữ liệu TypeScript (`tsc --noEmit`) |
| `npm test` | Chạy bộ Unit Tests với Vitest |
| `npm run test:watch` | Chạy Unit Tests ở chế độ theo dõi thay đổi (Watch Mode) |
| `npm run lint` | Kiểm tra quy chuẩn code với Next.js ESLint |
| `npm run db:migrate` | Tạo và áp dụng các migration Prisma mới |
| `npm run db:seed` | Nạp ngân hàng dữ liệu học tập vào CSDL |
| `npm run db:studio` | Mở giao diện đồ họa quản trị CSDL Prisma Studio |

---
Hoặc 
```bash
cd /workspaces/SSA-GR3-
npm install
npx prisma generate
npx prisma migrate deploy
npm run db:seed   # nếu project cần seed dữ liệu ban đầu
npm run dev
```

## ❓ Xử Lý Sự Cố Thường Gặp

<details>
<summary><b>1. Lỗi: Prisma Client out of date / không tìm thấy Schema</b></summary>

Chạy lệnh tạo lại Prisma Client:
```bash
npx prisma generate
```
</details>

<details>
<summary><b>2. Lỗi: CSDL bị sai lệch schema hoặc muốn reset lại dữ liệu từ đầu</b></summary>

Chạy lệnh reset toàn bộ database và nạp lại seed:
```bash
npx prisma migrate reset
```
*(Lưu ý: Lệnh này sẽ xóa toàn bộ dữ liệu người dùng cũ và tạo lại dữ liệu mẫu sạch)*
</details>

<details>
<summary><b>3. Lỗi Port 3000 đã bị chiếm dụng (Port in use)</b></summary>

Chạy Next.js trên một cổng khác:
```bash
npm run dev -- -p 3001
```
</details>

---

## 👥 Đóng Góp & Bản Quyền

Dự án được xây dựng và duy trì bởi nhóm phát triển **SSA-GR3-**. Mọi đóng góp (Pull Request, Báo lỗi, Góp ý tính năng) đều được chào đón!

1. Fork dự án
2. Tạo branch tính năng mới (`git checkout -b feature/TinhNangMoi`)
3. Commit thay đổi (`git commit -m 'Thêm tính năng mới'`)
4. Push lên branch của bạn (`git push origin feature/TinhNangMoi`)
5. Tạo một Pull Request mới

Phát hành theo giấy phép **MIT License**.#   N I H O N W U E S T  
 