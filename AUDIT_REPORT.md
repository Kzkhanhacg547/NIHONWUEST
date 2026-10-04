# NIHON QUEST — FULL PROJECT AUDIT

**Path:** `D:\Downloads\NihonQuest-Japan-Redesign-Complete\SSA-GR3--main\`
**Date:** 2026-10-03
**Auditor role:** Senior Full-Stack + UI/UX + QA
**Code changed:** none. This is an audit only.

---

## 0. Mental model (Phase 1)

| Concern | Reality |
|---|---|
| Framework | Next.js **14.2.5**, App Router, React 18.3.1, `reactStrictMode: true` |
| Language | TypeScript 5.5.3, `strict: true`, `@/*` → project root |
| UI | **No component library.** Hand-rolled `components/ui.tsx` + Tailwind 3.4.7 + ~6k lines of hand-written CSS |
| CSS systems in parallel | Tailwind utilities, `.nqd-*` (dashboard), `.nqn-*` (**100 % dead**), `.rv-*` (review, 1074 l), `.jy-*` (journey), `.lp-*` (learn), `.nq-*` (nq-ui) |
| DB / ORM | **SQLite** + Prisma 5.18.0. `prisma/dev.db` = 2.3 MB |
| Auth | NextAuth 4.24.7, **Credentials only**, JWT session, Prisma adapter |
| State | Local `useState` + `localStorage` (starred items). No store library |
| API | 27 route handlers under `app/api`, all Server-Route handlers |
| Animation | GSAP 3.15 via **`file:vendor/gsap`** + ScrollTrigger, dynamic-imported in `MotionEnhancer` |
| Route protection | `middleware.ts` → `withAuth`, matcher `["/app/:path*", "/onboarding"]` |
| Tests | Vitest, 4 files / 15 tests — **pure functions only**, zero component/API coverage |

### Real data volume (measured against `prisma/dev.db`)

| Table | Rows | | Table | Rows |
|---|---|---|---|---|
| lesson | 100 (N5 50 / N4 25 / N3 25) | | vocabulary | 340 (N5 141 / N4 125 / N3 74) |
| exercise | 1 500 | | kanji / kanjiReading | 252 / 497 |
| exerciseOption | 6 000 | | grammar / grammarExample | 56 / 114 |
| kana | 175 | | scenario / message | 13 / 30 |
| journeyLocation | 9 | | achievement / dailyMission | 8 / 3 |
| **user** | **1** (`Asia/Saigon`, 140 XP) | | | |

---

## 1. Project Health

| Axis | Verdict | Detail |
|---|---|---|
| **Build** | 🟢 **PASS** | `next build` compiled successfully, 43 static pages. No build blocker. |
| **TypeScript** | 🟢 **PASS** | `tsc --noEmit` → exit 0, zero errors under `strict: true`. |
| **Lint** | 🟡 **PASS but blind** | `next lint` → exit 0, **1 warning** (`<img>` at `app/app/page.tsx:223`). Suspiciously clean for ~11 k lines — see §12. |
| **Test** | 🟡 **PASS but hollow** | 15/15 pass in 4 files. Only `streak/srs/level/otp/romaji/rivalBots/n3Kaiwa` — **no component, API-route, or integration test**. |
| **Prisma** | 🟢 valid | `prisma validate` OK, schema matches migrations. |
| **Runtime** | 🔴 **FAIL in core loops** | 3 confirmed false-feedback bugs that show the user success while the server persists nothing. |
| **UI/UX** | 🔴 **FAIL** | Fabricated progress/stats, 3 dead nav entries, missing loading/error states, duplicate kana browsers that desync. |
| **Responsive** | 🔴 **FAIL** | Navbar overflows at 1024 px; 5-column kana grid has no mobile breakpoint; 0 `scroll-margin-top` for a sticky header. |
| **Accessibility** | 🔴 **FAIL** | Shared `Modal` (19 call sites) has no dialog role, no focus trap, no Escape, no focus management. 3 `role="tablist"` with no tabpanel/arrow-keys. 10 px text. |
| **Performance** | 🔴 **FAIL on mobile** | 250 KB JSON payload to `/app/vocabulary`; 464 KB 5-table scan per `/app/review` load; 639 KB favicon; `Japanese3DRoom` (1 309 l) eagerly bundled into `/app/journey`. |
| **Security** | 🔴 **FAIL** | Real secrets in a distributed ZIP; committed fallback JWT secret; **no rate limiting anywhere**; no OTP brute-force lockout; client-trusted XP. |

**Bottom line: green build, red product.** Nothing here is a compile error. Every CRITICAL below is a class of bug `tsc` and `next build` are structurally incapable of catching.

---

## 2. Critical Issues

| # | Severity | File:Line | Issue | Root Cause | Fix |
|---|---|---|---|---|---|
| 1 | **CRITICAL** | `app/api/activity/route.ts:7` | **UI promises XP that is never granted.** `ReviewClient.tsx:288` shows `"🏆 Phiên ôn tập hoàn tất! +20 XP thưởng！"` then calls `POST /api/activity` with `{xp:20}`. The handler signature is `export async function POST()` — **no `req` parameter, body never read**. No `xpTransaction` row, no `totalXP` increment. Ever. | Endpoint contract invented by the client and silently ignored by the server. | Either award XP in `/api/activity` (with an idempotency key) or drop the claim. Do not ship the string until it is true. |
| 2 | **CRITICAL** | `prisma/seed.ts:152-153` | **Re-seeding destroys all user vocabulary + SRS progress.** `await prisma.vocabularyExample.deleteMany({}); await prisma.vocabulary.deleteMany({});` deletes every row. `ReviewItem.contentId` is a plain `String` (no FK, `schema.prisma:292-307`), so the delete succeeds and every user's VOCAB/KANJI review cards become **dangling pointers to non-existent rows**. | Seed uses truncate-and-recreate for content that users accumulate references to. | Upsert by a **stable natural key** (`word`+`jlptLevel`), not delete-all. Same for `prisma/seed.ts:54-57` which deletes `Lesson` rows and cascades `UserLessonProgress`. |
| 3 | **CRITICAL** | `app/api/kana-battle/submit/route.ts:42-63`, `app/api/ai/dungeon/submit/route.ts:8` | **Client-trusted scoring = unlimited XP.** `results[].isCorrect` and `score` are taken from the request body; the server never re-derives them from the DB. `POST /api/kana-battle/submit` with 20 fabricated `{isCorrect:true,timeMs:0}` pays 20×15×2 + 50 = **650 XP**. `GET /api/ai/dungeon` even ships `correctIndex` to the client (line 654), so the answers are handed over. | Anti-cheat was never implemented. | Re-grade server-side from stored `correctAnswer`; accept only `{id, selectedIndex, timeMs}`. Make `score`/`isCorrect` derived, never received. |
| 4 | **CRITICAL** | `app/app/survival/SurvivalClient.tsx:827-851` | **Fabricated victory.** `finishScenario` calls `await fetch("/api/survival/progress")` but **never inspects `res.ok`**. On HTTP 401/404/500 `fetch` resolves, so the code proceeds to `playFanfare(); setIsCompleted(true); showToast("Hoàn thành +XP")`. On network failure the `catch` block *also* sets `isCompleted(true)`. Local state is never reconciled with the server, so a false win persists across `router.refresh()`. | Success path not gated on the response. | `if (!res.ok) { toast error + retry; return; }` before any celebration. |
| 5 | **CRITICAL** | `lib/rivalBots.ts:17-114`, `app/app/leaderboard/LeaderboardClient.tsx:135-203`, `app/app/page.tsx:216-232` | **8 fabricated users presented as real classmates.** `RIVAL_BOTS` injects fake names ("Hoàng Việt 🚅", "Minh Tuấn 🍜"), XP, streaks and first-person quotes ("Streak 30 ngày không bỏ bữa nào!"). `isBot` exists on the type and is **never read** — every row renders identically. `getBotDynamicXp` (lines 145-154) explicitly tunes bot XP to the user's XP to keep them motivated. On the dashboard widget bots get **no marker at all**. | Engagement mechanic shipped without disclosure. | Render a visible "AI" badge + tooltip on every `isBot` row, and label the block "Học viên ảo". Never present synthetic activity as real. |
| 6 | **CRITICAL** | `app/app/learn/page.tsx:169-197` | **Every content statistic is fabricated.** Claims `1,200+` vocabulary (**DB: 340**), `320` kanji (**252**), `24` chủ đề, `120+` ngữ pháp cấu trúc (**56**), `400+` ví dụ (**114**), `500+` câu hội thoại (**13 scenarios**), `Từ N5 → N1` (**only N5/N4/N3 exist**). | Marketing copy hardcoded instead of counted. | Query `count()` at render. Never ship a number the DB cannot produce. |
| 7 | **CRITICAL** | `.env` (root) | **Live secrets inside a distributed ZIP.** `NEXTAUTH_SECRET`, `GROQ_API_KEY`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` are real values in a folder named `…-Redesign-Complete`. Values are **not** reproduced here. `.gitignore:7` covers `.env`, but that protects git only — the ZIP has already shipped. | No `.env.example`, secrets materialised in the deliverable. | Rotate `NEXTAUTH_SECRET`, `GROQ_API_KEY`, and the Gmail app password **now**. Commit `.env.example` with placeholders. |
| 8 | **CRITICAL** | `middleware.ts:4` + `lib/auth-options.ts:16` | **Committed fallback JWT secret.** Both files hardcode `"dev-only-change-me-min-32-chars-long-secret"`. If `NEXTAUTH_SECRET` is absent in production, the secret is public in the repo → **anyone can forge a session cookie for any user id**. | Defensive `||` instead of a hard startup failure. | `if (!process.env.NEXTAUTH_SECRET) throw new Error(...)` at module load. Never fall back. |

### HIGH

| # | File:Line | Issue | Root cause / Impact |
|---|---|---|---|
| 9 | `app/app/page.tsx:75` | `prisma.xpTransaction.findMany({ where: { createdAt: { gte: sevenDaysAgo } } })` — **no `userId` filter**. Loads *every user's* XP ledger into one user's dashboard request. | Authorisation + scale bug. Leaks cross-user activity server-side; grows unbounded with users. Add `userId: uid`. |
| 10 | `app/app/page.tsx:79-82` | `prisma.user.findMany({ ..., take: 20 })` — **no `orderBy`**. "🏆 Bảng xếp hạng tuần này" shows 20 arbitrary rows in rowid order. | Missing sort. The widget is not a leaderboard. Add `orderBy: [{ weeklyXp… }, { totalXP: "desc" }]`. |
| 11 | `app/app/learn/page.tsx:113` | `const pct = isDone ? 100 : isCurrent ? 40 : 0; // TODO: thay bằng % tiến độ thật` — **hardcoded 40 %** on an in-progress lesson, rendered with `role="progressbar" aria-valuenow={40}`. | Fake progress announced to screen readers. |
| 12 | `app/app/review/page.tsx:70-73` | `forgottenCount = round(sessionCount * 0.08)`; `retention = clamp(68 + mature/session*24)`. **Both invented.** "Tỉ lệ ghi nhớ 87 %" is never computed from `ReviewHistory`. | Fabricated analytics in the core learning loop. Compute from real `reviewHistory.grade`. |
| 13 | `app/api/lessons/complete/route.ts:79-92` | `status: "COMPLETED"` and full `lesson.xpReward` awarded **regardless of score**. Line 29-34 also lets the client submit an arbitrary *subset* of exercises, so `accuracy` can be forced to 100 %. | Lesson marked done on a 0 % attempt. Gate `COMPLETED` on a passing threshold; require all `exerciseId`s. |
| 14 | `app/app/review/ReviewClient.tsx:22-25` | SRS interval hints are **fabricated**: shows `Again "< 1 ngày"`, `Hard "3 ngày"`, `Good "1 tuần"`, `Easy "2 tuần"`. Real `lib/srs.ts` yields 0 / 1.2× / ease / 1.3×ease days. `AGAIN` sets `dueAt = now` → card returns **in the same session**, not tomorrow. | Labels contradict the algorithm the code runs. Derive labels from the returned `dueInDays`. |
| 15 | `app/app/review/ReviewClient.tsx:449-465` | The 4 grade buttons are enabled and clickable **before the card is flipped**; `onClick` never checks `isFlipped`. The keyboard path (line 321) *does* check it. | Mouse and keyboard disagree → users grade unseen cards, destroying SRS integrity. Add `if (!isFlipped) return`. |
| 16 | `app/app/review/ReviewClient.tsx:372` | `const romaji = (currentItem as unknown as { romaji?: string }).romaji;` — `EnrichedReviewItem` **has no `romaji` field**. The cast silences TS; `romaji` is always `undefined`, so line 411 never renders. **Romaji is permanently absent from the SRS card.** | Type-cast hid a missing field. Add `romaji` to the resolver and interface. |
| 17 | `app/app/practice/[slug]/page.tsx:60-67` | **No gating whatsoever** — any published lesson renders for any user via URL. Yet `learn/page.tsx:118,131` labels lessons `"🔒 Chưa mở khóa"`. A beginner can deep-link into an N3 lesson. | UI claims a lock the backend does not enforce. |
| 18 | `lib/otp.ts:69-74` | OTP verify has **no attempt limit** and no lockout. 6-digit code, unlimited tries, 10-minute window. Combined with account enumeration (below), this is an account-takeover path. | Add per-identifier attempt counter + lockout; use `crypto.randomInt`, not `Math.random()` (line 37). |
| 19 | *(project-wide)* | **Zero rate limiting** — not on login, register, OTP send, OTP verify, `/api/ai/chat`, `/api/kana-battle/submit`, `/api/ai/dungeon/submit`. | Grep for `rateLimit|throttle|429` returns nothing. |
| 20 | `app/api/ai/chat/route.ts:123-352` | One request can fire **up to ~30 sequential upstream HTTP calls** (3 Groq models × 1 key, OpenRouter, 5+ Gemini models × 2 attempts, plus live model discovery), each with a 15–18 s `AbortSignal.timeout`. Worst case latency is minutes. | Any authenticated user can burn the GROQ quota / rack up cost, or hang a serverless worker past its timeout. Cap total attempts, add a route-level deadline + AbortController. |
| 21 | `components/AppNav.tsx:19-33` + grep | **`/app/profile` is referenced nowhere in the codebase.** Not in `NAV_ITEMS`, not in `MORE_ITEMS`, not linked anywhere. Therefore **there is no reachable logout button** — `signOut` exists only in `app/app/profile/DangerZone.tsx:13,24`, on an orphan route. The avatar (line 63-79) is a non-interactive `<span>`. | Navigation data and routes drifted apart. Add `/app/profile` to the nav and make the avatar a link/menu. |
| 22 | `app/app/review/page.tsx:28-46` | Loads **all** kana (175), vocabulary (340), kanji (252), grammar (56) and **exercises (1 500)** = **463.7 KB measured** on every page load, to resolve at most 30 review items. | Fetch only the `contentId`s in `items`. |
| 23 | `app/app/vocabulary/page.tsx:17-18, 72-73` | Ships **250.2 KB measured** of vocabulary + kanji to the client, then deep-clones it again with `JSON.parse(JSON.stringify(...))` (lines 72-73) — Prisma output is already serialisable. | Paginate/filter server-side; drop the round-trip. |
| 24 | `app/app/learn/page.tsx:86` + `app/app/learn/KanaLab.tsx:155-179` + `LearnKanaPanel.tsx:102-124` | **Two independent kana browsers on one page.** `LearnKanaPanel` and `KanaLab` each hold their own `activeTab`, `doneSet`, `selectedId`/`writingTarget`. Marking a kana done in one does **not** update the other until a full reload. | Duplicated component, duplicated state. Lift to one shared provider or drop the mini panel. |

---

## 3. UI/UX Issues

| Screen | Device | Issue | Impact | Recommended fix |
|---|---|---|---|---|
| Dashboard | all | `totalDone(total)` (`page.tsx:254-256`) returns `total === 0`; used at line 163 to badge the review card "Đã hoàn thành". Inverted/dead logic. | Badge shows only when there are zero lessons — effectively never. | Delete the helper and the badge, or implement the real condition. |
| Dashboard | all | Hardcoded inline styles: `style={{ color: "#78716c" }}` (line 184), plus `flex`/`margin`/`width` inline at 174-190. | Bypasses design tokens; dark mode shows `#78716c` on a dark card. | Move to Tailwind tokens / CSS vars. |
| Dashboard | all | `<img src={row.avatar}>` (line 223) renders a **user-supplied URL** with no validation; avatar strings may also be emoji (bots). | Mixed content-type in an avatar slot; lint warning. | Validate scheme or use `next/image` with `unoptimized` for emoji. |
| Dashboard | 1366-1920 | Journey widget renders 5 stations + a `ShinkansenStrip` SVG; the completion count is `sr-only` only (line 245). | Progress invisible to sighted users. | Show the "3/9 địa danh" number visibly. |
| **Review (SRS)** | all | Grade buttons enabled pre-flip (finding 15). | Users can Good-grade unseen cards → SRS collapses. | Gate on `isFlipped`. |
| **Review (SRS)** | all | `+20 XP` toast that is never granted (finding 1). | Direct trust damage in the core loop. | Fix endpoint or fix copy. |
| **Review (SRS)** | all | Romaji layer never renders (finding 16). | Learner loses the JP→romaji bridge on the single most-used screen. | Add `romaji` to the resolver. |
| **Review (SRS)** | all | `forgottenCount`/`retention` invented (finding 12). | "Tỉ lệ ghi nhớ" is decorative. | Compute from `ReviewHistory`. |
| Review | all | `<AppNav />` called with **no props** (line 78) → avatar falls back to generic `"N"`, no XP/level. Every other page passes user data. | Inconsistent identity across screens. | Pass the same props everywhere. |
| Review | all | `<main className="rv-container">` inside a layout that already renders `<main id="main">`. Nested `main` landmarks. | Screen-reader landmark navigation breaks. | Use `<section>`/`<div>`. |
| Review | all | `MODES` includes `/app/learn#kana-full` (line 18) but the anchor target is hidden under the sticky header. | Clicking the tab appears to do nothing. | Add `scroll-margin-top` (see §4). |
| Review | mobile | `rv-grade` buttons carry `Icon size={26}` + label + hint; 4 across. | Likely < 44 px tall on 375 px. | Verify; stack 2×2 under `sm`. |
| **Learn** | all | Fabricated stats + fake 40 % progress (findings 6, 11). | Misrepresents course size and personal progress. | Query counts; compute progress. |
| Learn | all | Locked lessons render `<span aria-hidden>›</span>` (line 148) — no link, no explanation, no unlock rule. | Dead end; learner cannot tell how to proceed. | Render a real disabled affordance + "hoàn bài trước để mở". |
| Learn | all | Line 118: the current-lesson node renders `""` (empty). | Blank circle in the timeline. | Render a dot/label. |
| Learn | all | `Math.max(5, lesson._count.exercises)` (line 140) inflates the count when a lesson has fewer. | Reports content that doesn't exist. | Show the real count. |
| Learn | all | "Hướng dẫn nét" and "Kiểm tra →" (LearnKanaPanel 157, 194) open the **same** modal. | Two labels, one destination. | Merge or differentiate. |
| Learn | all | "🗑 Xóa" and "↻ Viết lại" (LearnKanaPanel 170, 191) both call `clearCanvas()`. | Duplicate controls. | Keep one. |
| Learn | all | The inline practice canvas is **never scored and never saved**; `useEffect(clearCanvas, [selected?.id])` (line 69) silently wipes it when the kana changes. | Learner believes they practised; the work is discarded. | Either wire it to `KanaCanvas` scoring or label it "chỉ để thử nét". |
| **Kana Lab** | **375-430** | `grid-cols-5` with **no breakpoint** (KanaLab 233-235). At 375 px: 4×12 px gaps leave ~65 px per cell, each holding `p-3.5` + `text-3xl` kanji + two `grid-cols-2` buttons labelled "🔊 Nghe"/"✍️ Viết". | Guaranteed text truncation/overflow; unusable. | `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`; stack the two buttons. |
| Kana Lab | **< 640** | Column header is `hidden sm:grid` (line 204). | On mobile the learner sees a 5-column grid with **no /a/ /i/ /u/ /e/ /o/ labels** — the entire point of the table. | Show a compact header on mobile. |
| Kana Lab | all | The kanji glyph itself is a `<div onClick>` (269-273) — no `role`, no `tabIndex`, no key handler — **while a redundant 🔊 button sits right below it**. | The primary content is keyboard-inaccessible, and duplicated. | Delete the div; keep the button. |
| Kana Lab | all | `text-[10px]` badges (263, 307). | Below the 12 px floor; fails readability for the target audience. | `text-xs`. |
| Kana Lab | all | `markPracticed` (100-119) has `if (res.ok)` and **no `else`**, plus `catch {}`. Clicking "Đánh dấu đã nhớ" on a failed request does nothing, silently. | No feedback after interaction — exactly the failure mode that erodes trust. | Show an error toast; disable while in flight. |
| Kana Lab | all | "Đã thành thạo" (mastered) is set by a **single click with no verification**, and feeds the `learnedCount` progress ring (122, 142). | Progress is self-reported. | Rename to "Đã đánh dấu" or gate on a real check. |
| Leaderboard | all | Bot rows indistinguishable (finding 5). | Fabricated social proof. | Badge them. |
| Leaderboard | all | Empty state (205-211) is **unreachable** — 8 bots guarantee `users.length > 0`. | Dead code; the true first-run experience is untested. | Reachable when no user has XP and bots are excluded. |
| Leaderboard | all | `getTier(currentUser.xp)` and "🎯 Lv.{currentUser.level}" read the DB `level` column, which is only written by 2 of 9 XP routes (§5 #24). | Level shown on the leaderboard disagrees with the dashboard. | Derive from `totalXP`. |
| Vocabulary | all | Search is un-debounced (VocabKanjiClient 1181-1184); every keystroke re-filters 340 items, rebuilds the `flashcards[]` map and regroups topics. Also `.toLowerCase()` only — no Vietnamese accent folding ("ăn" ≠ "an"). | Janky typing on mobile; Vietnamese search misses. | Debounce 250 ms + NFD accent strip. |
| Vocabulary | all | `handleAddToSrs` (899-925) guards on `savedSet` **before** the await and only updates it **after** → double-click fires two POSTs. 4+ save surfaces affected. | Duplicate writes, no disabled state. | Optimistic set + revert, or disable. |
| Vocabulary | mobile | `MasteredCheckbox` is `h-[18px] w-[18px]` (line 329). | 18 px touch target. | ≥ 24 px, ideally 44 px. |
| Vocabulary | mobile | `text-[11px]` Japanese kana in topic cards (line 1592). | 11 px kana is below readable size. | `text-sm`. |
| Survival | all | Fabricated victory (finding 4). | False completion. | Check `res.ok`. |
| Survival | all | SpeechRecognition cleanup never `stop()`s the recogniser (717-719). | Mic can stay live after unmount; stale `setIsListening`. | Full teardown. |
| Profile | all | Unreachable from any navigation (finding 21). | No logout, no settings, no account deletion. | Add to nav. |
| Error boundary | all | `app/error.tsx` shows `error.digest` (line 27-31). | Developer noise for end users. | Hide in production. |
| Error boundary | all | **No `app/global-error.tsx`** and **no `app/app/error.tsx`**. A throw in any learning module replaces the entire shell including the nav. | One module failure costs the user their place. | Add nested boundaries per module. |
| Loading | all | **Only `app/app/loading.tsx` exists** — no nested boundary for any of the 12 module routes, and none at `app/`. | Navigation under `/app` shows a stale screen with no feedback while 250-464 KB is fetched. | Add per-route `loading.tsx`. |
| Loading | all | `loading.tsx:12` uses `Math.random()` in a **Server Component**; `:15` is `fixed inset-0` full-screen takeover. | Non-deterministic SSR; white flash on every navigation. | Derive from pathname; keep the nav visible. |
| Loading | a11y | `animate-spin` ×2, `animate-pulse`, `animate-bounce` ×3 with no reduced-motion guard; `motion-safe:`/`motion-reduce:` used **0 times** project-wide. | WCAG 2.3.3 failure. | Add `motion-reduce:` variants. |
| Sensei | all | When no API key is reachable, `generateNaturalJapaneseResponse` silently substitutes canned text (ai/chat 355/359/363). | Student believes they are conversing with an AI Sensei; they are not. | Label the fallback visibly. |
| Sensei | all | `ai/chat` returns the **oldest** 20 messages (`orderBy: createdAt: "asc", take: 20`, line 94-97). | Long conversations lose all recent context. | `desc` + reverse. |
| Cross-cutting | all | Grade buttons, cards, tabs, toasts, progress bars are re-implemented per module (`nqd-`, `rv-`, `jy-`, `lp-`, `nq-`, Tailwind). No shared button/progress/tab primitive. | The "same action, different look" inconsistency the brief asks about, at scale. | Adopt `components/ui.tsx` primitives everywhere. |

---

## 4. Responsive Issues

| Screen | 1920 | 1536 | 1366 | 1280 | 1024 | 768 | 430 | 390 | 375 |
|---|---|---|---|---|---|---|---|---|---|
| Top nav fits | ✅ | ✅ | ✅ | ⚠️ | 🔴 | ✅ | ✅ | ✅ | ✅ |
| Kana Lab 5-col grid | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🔴 | 🔴 | 🔴 |
| Vocabulary payload | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | 🔴 | 🔴 | 🔴 |
| Dashboard 2-col (`nqd-grid`) | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ | ✅ |
| In-page anchors (`#roadmap`, `#kana-full`, `#review-card`) | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 |

### Navbar overflow at 1024 × 1366 (HIGH)

`components/AppNav.tsx:155-156` — `header` is `sticky top-3 px-3 sm:px-6`; the inner bar is `flex … px-3 py-2 lg:px-4` with `max-w-[1320px]`. The desktop `nav` is `hidden … lg:flex` (line 161), so it switches on at **1024 px** carrying:

- logo (`.nq-logo-sm`: 36 px mark + 21 px wordmark + 7 px tagline ≈ 130 px)
- 5 nav links at `px-3 py-2 text-[13px] gap-2` + 18 px icon ≈ 105-115 px each ≈ **540 px**
- "Khám Phá" + chevron ≈ **136 px**
- right cluster: speed pill (~76) + theme (40) + bell (40, `sm:inline-flex`) + avatar (40, `sm:block`) + 3 gaps ≈ **220 px**

≈ **1 040 px** of content in a **944 px** content box at 1024 px viewport. `overflow-x-hidden` is set on `<html>`, `<body>` **and** `<main>` (`app/layout.tsx:40-41,46`), so the overflow is **clipped, not scrollable** — "Ngữ Pháp" and the right-hand controls become unreachable.

Fix: move the `lg:` breakpoint to `xl:` (1280), or collapse the 5 primary links into the "Khám Phá" popover below 1280, or hide the bell/avatar until `xl`.

### Anchors land under the sticky header (MEDIUM-HIGH, all viewports)

`app/globals.css:19` sets `html { scroll-behavior: smooth }`; `components/AppNav.css:18` / `AppNav.tsx:155` make the header `position: sticky; top: 0-3px; z-index: 40` at ~62-72 px tall. **`scroll-margin-top` / `scroll-padding-top` appear in zero CSS files.** So every in-page anchor scrolls its target flush to y=0 and hides the first ~70 px:

- `app/app/learn/page.tsx:54` → `#roadmap`
- `app/app/learn/LearnKanaPanel.tsx:144` → `#kana-full`
- `app/app/review/page.tsx:18` → `/app/learn#kana-full`
- `app/app/review/page.tsx:165` → `<a href="#review-card">Bắt đầu ôn tập</a>`

Fix: `html { scroll-padding-top: 84px; }` (one line, fixes all four).

### Other responsive notes

- `KanaLab.tsx:204` header is `hidden sm:grid` → no column labels below 640 px.
- `KanaLab.tsx:233-235` `grid-cols-5` has **no responsive variant** → 65 px cells at 375 px.
- `app/app/loading.tsx:15` `fixed inset-0 z-50` covers the sticky nav on every `/app` navigation.
- Toasts are `fixed bottom-20 right-4` (SoundAndThemeContext) and can overlap bottom-anchored controls.
- `VocabKanjiClient` detail pane is `sticky top-24` + `max-h-[calc(100vh-7rem)]` — `lg:`-only, so no mobile keyboard clash, but `100vh` (not `dvh`) should be modernised.
- `components/ui.tsx:295` Modal uses `max-h-[92vh] overflow-y-auto` with `items-center` — no `dvh`, so the bottom is unreachable when the mobile keyboard shrinks the viewport.

---

## 5. Runtime / Logic Issues

**1 — Daily-mission date key diverges by timezone (HIGH, affects 7 h/day for every VN user).**
Two incompatible date keys are in production simultaneously:

| Uses `user.timezone` ✅ | Hardcodes UTC 🔴 |
|---|---|
| `app/api/ai/dungeon/route.ts:589` | `app/api/missions/route.ts:9` `localDateKey(new Date(), "UTC")` |
| `app/api/ai/dungeon/submit/route.ts:31` | `app/api/review/route.ts:45` `localDateKey(now, "UTC")` |
| `app/api/kana/practice/route.ts:52` | `app/api/survival/progress/route.ts:59` `localDateKey(now, "UTC")` |
| `app/api/kana-battle/submit/route.ts:32` | `app/api/lessons/complete/route.ts:96` `new Date().toISOString().slice(0,10)` |
| `app/app/page.tsx:60` (reads) | |

The dashboard **reads** `localDateKey(now, user.timezone)` while every **write** for lessons/reviews/survival uses UTC. For the one real user (`Asia/Saigon`, UTC+7), between 17:00 and 24:00 UTC the dashboard looks at date `D+1` while progress lands on `D` — up to 7 hours a day of mission progress written to a row nobody displays. `/api/missions` additionally seeds a *second* row set on the UTC key. Fix: one helper, `await todayKey(userId)`, used by all five writers and both readers.

**2 — `app/api/lessons/complete/route.ts:95-96`** fetches `user` with `select: { timezone: true }` and then **never uses it**; the dead variable is the smoking gun for #1.

**3 — Check-then-insert XP races (MEDIUM).** `lessons/complete:87-90`, `journey/progress:83-87`, `kana/practice:33-42`, `missions:29-33`, `achievements:40-44`, `ai/dungeon/submit:36-58` all do `findFirst(...)` → `create(...)` with no transaction and no unique constraint. Two concurrent requests both pay out. Wrap in `prisma.$transaction` and add a unique index on `(userId, reason, referenceId)`.

**4 — Multi-step writes without transactions (MEDIUM).** `kana-battle/submit:66-108` runs N SRS updates + N history inserts + XP + user update as ~4 N+2 sequential awaits. A failure midway leaves `ReviewItem` advanced but no `XpTransaction`. Same in `lessons/complete:36-70`.

**5 — `AGAIN` never leaves the queue (MEDIUM).** `kana-battle/submit:76` and `review/route.ts:36` set `dueAt = now` for `dueInDays <= 0`, so a failed card is immediately re-due. `ReviewClient:273-279` re-queues it *client-side* too. A card the learner keeps failing can monopolise the 20-card window forever. Cap re-queues per session (Anki's learning-step model).

**6 — `ReviewClient` AGAIN re-queue is a no-op on the last card (MEDIUM).** `const [card] = requeued.splice(currentIndex,1); requeued.push(card);` leaves `requeued.length === items.length`, so `currentIndex >= requeued.length` is never true. On the last card, AGAIN shows the **same** card again instead of wrapping to index 0.

**7 — `handleGrade` blur kills keyboard focus (MEDIUM, a11y).** Line 271 `(document.activeElement as HTMLElement)?.blur?.()`. After grading, focus falls to `<body>`; a keyboard-only user must Tab from the top of the document for every card.

**8 — Duplicate `doneSet` state (HIGH).** See §2 #24.

**9 — `prisma.journeyLocation` writes during render (MEDIUM).** `app/app/journey/page.tsx:21-46` and `app/api/journey/route.ts:16-41` contain an **identical** N+1 create/update sync loop executed inside a Server Component render on every page load and every GET. Server Components should be side-effect-free; this also fires on prefetch. Extract to one shared, idempotent function and call it from a single owner.

**10 — `resolveJourneyStatus` ignores its own inputs.** `lib/journey.ts:11-26` accepts `previousCompleted` and never uses it; `canUnlockJourney` (1-9) accepts it and never uses it. So the "complete the previous stop first" rule that `journey/page.tsx:60` appears to implement is **not enforced** — a user with enough XP jumps straight to stop 10.

**11 — Orphan-review fallback defeats its own purpose.** `lib/review/resolveReviewItem.ts:94-100` marks **any** item whose `contentId` contains `":"` as valid, so unknown types survive the orphan filter with garbage titles. The `Prisma` import on line 1 is unused dead weight.

**12 — Level labels are hardcoded N5.** `resolveReviewItem.ts:71,78,87` and `review/page.tsx:224` and `ReviewClient.tsx:367` all print `"JLPT N5"` regardless of the item's actual level. An N3 learner reviewing N3 kanji is told "N5".

**13 — `loginSchema` has no `.trim()` (MEDIUM).** `lib/auth-options.ts:9-10` — a trailing space in the email or password fails validation silently.

**14 — Account enumeration.** `/api/auth/otp/send` returns 409 "already registered" (line 28-33) and 404 "not registered" (35-40).

**15 — Password reset does not invalidate sessions.** JWT strategy with no session table; after `/api/auth/forgot-password/reset` the old cookie stays valid.

**16 — Missing states, quantified.** No route except `/app` has a `loading.tsx`; no route has an `error.tsx`; `components/ui.tsx` exports `Skeleton` and `ErrorState` and **both have 0 usages** — the primitives exist, the features never adopted them.

**17 — `app/api/account` PATCH accepts free-form strings.** `learningLevel`, `learningGoal`, `theme`, `timezone` are `z.string().optional()` (lines 7-14). A garbage `learningLevel` makes the dashboard query return 0 lessons → "Bài 1 / 1" with an empty roadmap.

**18 — Empty-level edge case.** `app/app/page.tsx:137` renders `Bài {Math.min(completed+1, Math.max(1, len))} / {Math.max(1,len)}` → with 0 lessons it displays "Bài 1 / 1" instead of "0 / 0" or a real empty state.

**19 — N+1 mission seeding on first paint.** `app/app/page.tsx:61-72` and `app/api/missions/route.ts:14-24` loop `await upsert` per template inside a server render.

**20 — `deleteMany({})` in seed wipes vocabulary.** See §2 #2.

---

## 6. Accessibility Issues

### Blocking

| # | File:Line | Issue |
|---|---|---|
| A1 | `components/ui.tsx:287-311` | **`Modal` has no `role="dialog"`, no `aria-modal`, no `aria-labelledby`.** Used by **19 call sites** (KanaCanvas grading, vocab detail, review settings, …). Screen readers get an unlabelled generic container. |
| A2 | same | **No focus trap.** Tab escapes into the page behind, which is still in the DOM and not `inert`. |
| A3 | same | **No focus management.** Focus is not moved in on open and not restored to the trigger on close. |
| A4 | same | **No Escape-to-close.** `ReviewClient:74-81` had to bolt on its own global listener; the other 18 modals have none. |
| A5 | same | **No body scroll lock.** The page behind scrolls while the modal is open. |
| A6 | same:290-292 | **Backdrop `onClick` closes the modal.** For the `KanaCanvas` modal (`LearnKanaPanel:203`, `KanaLab:327`) an accidental finger-tap on the 16 px backdrop destroys an in-progress drawing with no warning. |
| A7 | `app/app/learn/KanaLab.tsx:269-273` | The **kana glyph** is a `<div onClick>` — no `role`, no `tabIndex`, no key handler. The primary learning content is unreachable by keyboard, while a redundant 🔊 `<button>` sits directly below it. |
| A8 | `app/app/review/ReviewClient.tsx:383-393` | Flashcard is a `<div tabIndex={0} onClick>` pseudo-button. It does handle Enter, but should be a `<button>`. |

### Serious

- **Tab semantics are broken in 3 places.** `role="tablist"` + `role="tab"` with **no `role="tabpanel"`, no `aria-controls`, no `id`, no arrow-key navigation, and no roving `tabIndex`** (all tabs stay tabbable): `KanaLab.tsx:156,165` · `LearnKanaPanel.tsx:108,112` · `JourneyClient.tsx:428,433`. Zero occurrences of `tabpanel` or `aria-controls` project-wide.
- **Nested `<main>` landmarks.** Root layout renders `<main id="main">` (`app/layout.tsx:46`); `app/app/review/page.tsx:80` and `app/app/learn/page.tsx:37` each render another `<main>`.
- **Interactive `<li>` elements.** `VocabKanjiClient.tsx:357-367` and `:434-443` — `<li onClick tabIndex={0}>`; should be `<button>` or `role="option"` + `aria-selected`.
- **`<div role="button">` flashcard face** — `VocabKanjiClient.tsx:1450-1463`.
- **Sub-minimum touch targets:** `MasteredCheckbox` 18×18 (`VocabKanjiClient:329`); `IconButton`/`SpeakerButton` 32-36 px (`SurvivalClient:644`, `VocabKanjiClient:756`); 10 px text labels in `KanaLab:263,307`, `LeaderboardClient:111,116,176,196`.
- **Contrast:** `text-slate-400` (#9ca3af) on white ≈ **4.1:1**, under AA 4.5:1 — used for romaji (`VocabKanjiClient:375`), example glosses (399, 619), XP captions (`LeaderboardClient:196`), and `KanaLab:184`.
- **Motion:** `motion-safe:`/`motion-reduce:` used **0 times**; 9 `animate-spin` + 8 `animate-pulse` + 8 `animate-bounce` are unguarded. `prefers-reduced-motion` exists in 5 CSS files and in GSAP `matchMedia`, but not for the Tailwind animations.
- **No `aria-live` anywhere** — no announcement when a review grade registers, an AI reply arrives, a mission completes, or a toast fires.
- **Non-inert `aria-label`.** `app/page.tsx:239` puts `aria-label` on a plain `<div className="nq-route">` with no role — ignored by most screen readers.
- **Progress bars with invented values** announced as real: `learn/page.tsx:133` (`aria-valuenow={40}` hardcoded) and `review/page.tsx:162`.
- **Skip link exists** (`app/layout.tsx:42-44`) ✅ — but every one of the 12 module pages re-declares `<main>`/`<nav aria-label>` inconsistently, and there is no `aria-label` on the module-level `<nav>` in `AppNav` beyond "Điều hướng chính" (that one is correct).
- **`ErrorState` is English-only** ("Something went wrong." / "Retry") in a 100 % Vietnamese product — and unused.

### Good

`role="switch"` + `aria-checked` on the sound toggles · `aria-pressed` on speech-rate chips · `aria-current="page"` on nav and breadcrumbs · `aria-haspopup`/`aria-expanded` on both AppNav popovers · `role="progressbar"` with `aria-valuemin/max` on review stats · `aria-label` on every `<select>` via `SelectField` · search input labelled · focus-visible rings on AppNav controls · no `dangerouslySetInnerHTML` and no `innerHTML` anywhere (no XSS surface).

---

## 7. Performance Issues

| # | Issue | Measured impact |
|---|---|---|
| **P1** | `/app/vocabulary` ships the entire vocabulary + kanji corpus as RSC props, then deep-clones it with `JSON.parse(JSON.stringify())` (`page.tsx:72-73`). | **250.2 KB** of JSON (vocab 160 KB + kanji 90 KB) before the page is interactive. 340 + 252 items on a phone. |
| **P2** | `/app/review` runs a 5-table full scan (kana 175, vocab 340, kanji 252, grammar 56, **exercises 1 500**) to resolve ≤ 30 cards. | **463.7 KB** read per page load. Fetch only the needed `contentId`s. |
| **P3** | `Japanese3DRoom` (1 309 lines) is imported at the **top** of `JourneyClient.tsx:7` and only needed inside a modal. | Explains `/app/journey` = **51 kB route / 165 kB First Load JS**. `next/dynamic` is used **0 times in the whole project**. |
| **P4** | `public/favicon.ico` **639 KB**, `public/logo.jpg` **639 KB** (1024×1024), `app/icon.jpg` **639 KB** (a second copy). All three are referenced as the favicon/apple-touch-icon (`app/layout.tsx:30-32`, `app/app/loading.tsx:20`). | ~1.9 MB of images for a 112×112 loading logo. Should be a few KB. |
| **P5** | `gsap` + `ScrollTrigger` are `import()`-ed inside `MotionEnhancer`, which sits in the **root layout** — so the landing page, login and register all pay for ScrollTrigger. | ~25 KB gzip on every route. Gate behind a route check or move to a per-page enhancer. |
| **P6** | `app/fonts.css` declares **131 `@font-face` rules → 5 314 KB (5.2 MB)** of woff2 across 119 Noto Sans JP + 9 Inter files. All 131 **do** declare `unicode-range` and `font-display`, so subsetting is correct and the browser only fetches what it renders. | Not a desktop bug, but a **Japanese** learning app renders kanji/kana on nearly every screen, so a student actively studying will pull a large share of the 4.6 MB JP payload over mobile data. Worth measuring `document.fonts` in Chrome DevTools on `/app/vocabulary` and `/app/review`. |
| **P7** | Un-debounced vocabulary search re-filters 340 items, rebuilds the `flashcards[]` card map and regroups topics **per keystroke**. | Input lag on mobile. |
| **P8** | N+1 write loops inside server renders: journey status sync (`journey/page.tsx:21-46`), mission seeding (`app/app/page.tsx:61-72`), achievement checks (`api/achievements:29` per achievement), lesson attempt inserts (`lessons/complete:36-70`). | Multiples the query count on the hottest paths. |
| **P9** | `api/lessons/[slug]:14` fetches **all** `exerciseAttempt` rows for a user+lesson with no `take`. | Unbounded growth per retake. |
| **P10** | `api/ai/chat:94-97` awaits `dbHistory` (20 rows) on every message, then **discards it** whenever `clientHistory` is non-empty. Also `orderBy asc, take 20` returns the *oldest* 20 → context loss. | Wasted query + wrong context. |
| **P11** | Dead weight shipped in source control: `components/AppNav.css` (**422 lines, 100 % unused** — 0 `nqn-*` references), `.nqd-nav/.nqd-links/.nqd-link/.nqd-more/.nqd-pop/.nqd-drawer` in `dashboard.css` (lines 24-49, unused), `app/app/sensei/SenseiClient.tsx` (**449 lines, 0 imports**), and 9 Vietnamese-named archive folders (`VOCAB/`, `LOGIN/`, `HOME/`, `HÀNH TRÌNH/`, `LỘ TRÌNH/`, `THỰC CHIẾN/`, `ÔN TẬP/`, `BÀI HỌC/`, `UI Mẫu/`) holding near-duplicate copies of live files. | No runtime cost (excluded from `tsconfig`), but a serious maintainability and tooling hazard. |
| **P12** | `gsap` is a **`file:vendor/gsap`** dependency — a hand-vendored copy pinned outside the npm registry. | `npm ci` on a clean clone requires `vendor/` to be committed; not covered by `npm audit`. |

### Build output (production, measured)

```
Shared by all            87.2 kB      Middleware                  49.9 kB
/app                     842 B / 105 kB      /app/grammar      2.62 kB / 106 kB
/app/journey             51 kB  / 165 kB  ←  /app/sensei       17.9 kB / 122 kB
/app/survival            14.5 kB/ 118 kB      /app/vocabulary   10.9 kB / 115 kB
/app/learn               8.77 kB/ 113 kB      /app/practice     7.22 kB / 111 kB
```
Route sizes are healthy; **the problem is props payload and server query cost, not JS.**

---

## 8. Security Issues

| # | Severity | File | Issue |
|---|---|---|---|
| **S1** | **CRITICAL** | `.env` | Live `NEXTAUTH_SECRET`, `GROQ_API_KEY`, `SMTP_USER`, `SMTP_PASS` shipped inside the distributed ZIP. **Rotate all of them.** |
| **S2** | **CRITICAL** | `middleware.ts:4`, `lib/auth-options.ts:16` | Committed fallback JWT secret → forgeable sessions if the env var is missing. |
| **S3** | **HIGH** | `app/api/auth/otp/send/route.ts` | Account enumeration (409 vs 404). |
| **S4** | **HIGH** | `lib/otp.ts:61-89` | OTP verify has no attempt limit / lockout. 6 digits × unlimited tries. |
| **S5** | **HIGH** | `lib/otp.ts:37` | `Math.floor(100000 + Math.random()*900000)` — not cryptographically secure. Use `crypto.randomInt`. |
| **S6** | **HIGH** | *(all routes)* | No rate limiting anywhere. |
| **S7** | **HIGH** | `app/api/kana-battle/submit`, `app/api/ai/dungeon/submit`, `app/api/lessons/complete` | Client-trusted scoring / partial submissions → XP and leaderboard manipulation. |
| **S8** | **MEDIUM** | `app/app/page.tsx:75` | XP ledger queried without a `userId` filter — cross-user data in one user's request. |
| **S9** | **MEDIUM** | `lib/email.ts:84-87` | Gmail transport uses `logger: true, debug: true` → the **entire SMTP session, including the OTP, is logged to stdout in production**. |
| **S10** | **MEDIUM** | `lib/email.ts:71-78` | If SMTP credentials are missing, it returns `success: true` and prints the OTP to the server console. Users see "OTP sent" and never receive it. |
| **S11** | **MEDIUM** | `app/api/ai/chat/route.ts:253, 270` | `model` is taken from the client body and interpolated into the Gemini URL path — an attacker-controlled path segment on an authenticated endpoint. Allow-list it. |
| **S12** | **MEDIUM** | `app/api/ai/chat/route.ts:100-107` | Client-supplied `history` is trusted and merged into the system context. A user can fabricate the entire assistant side of the conversation (self-assessment bypass / prompt injection). |
| **S13** | **MEDIUM** | *(session strategy)* | JWT sessions are not invalidated on password change/reset. |
| **S14** | **LOW** | `next.config.js:5-8` | `images.remotePatterns` allows **every https and http host** (including plaintext `http`). Image-proxy abuse / mixed content. Allow-list known hosts. |
| **S15** | **LOW** | `app/api/auth/otp/send:51` vs `lib/otp.ts:57` | `devCode` is only forwarded when `NODE_ENV === "test"`, but `requestOtp` returns it whenever SMTP is unconfigured — a future edit to that condition would leak OTPs. Tighten the guard. |
| **S16** | **LOW** | `app/api/ai/chat:49` | No max message length; a 10 MB body is persisted to `AiConversation`. |
| **S17** | ✅ OK | — | No `dangerouslySetInnerHTML`/`innerHTML`. No SQL injection (Prisma parameterised). Passwords bcrypt cost 12. `/api/me` and `/api/account` both strip `passwordHash`. Every route handler calls `requireUserId()`. |

---

## 9. Code Quality Issues

**Duplication**
- Journey status-sync loop duplicated verbatim: `app/app/journey/page.tsx:21-46` ↔ `app/api/journey/route.ts:16-41`.
- Live server routes are duplicated across 9 archive folders (`VOCAB/`, `LOGIN/`, `HOME/`, `HÀNH TRÌNH/`, `LỘ TRÌNH/`, `THỰC CHIẾN/`, `ÔN TẬP/`, `BÀI HỌC/`, `UI Mẫu/`) — e.g. `ÔN TẬP/ReviewClient.tsx` and `app/app/review/ReviewClient.tsx`. Anyone editing the wrong copy ships nothing.
- `components/DashboardArt.tsx` **and** `app/app/DashboardArt.tsx` both exist; `app/app/page.tsx:12` imports the local one. One is dead.
- Date-key logic: 5 UTC, 5 timezone-aware (see §5 #1).

**Dead code**
`components/AppNav.css` (422 l) · `app/app/sensei/SenseiClient.tsx` (449 l) · `dashboard.css:24-49` (`.nqd-*` nav) · `lib/journey.ts` (`previousCompleted` unused in both functions) · `lib/review/resolveReviewItem.ts:1` unused `Prisma` import · `app/api/achievements:10` unused `ownedKeys` · `app/app/page.tsx:254-256` `totalDone()` · `AppNav` props `userLevel`, `userXP`, `streak`, `levelLabel`, `unreadCount` are all accepted and **never used** · `components/ui.tsx` exports `Skeleton`, `ErrorState`, `XPBar`, `StreakFlame` — **0 usages** · `ReviewClient`'s `romaji` read (always undefined) · `/api/achievements` POST and `/api/missions` GET are **called by no client**.

**Giant components** — `VocabKanjiClient.tsx` **1 499 l**, `SurvivalClient.tsx` **1 273 l**, `Japanese3DRoom.tsx` **1 309 l**, `SenseiKaiwaClient.tsx` 714 l, `JourneyClient.tsx` 649 l, `KanaCanvas.tsx` 646 l, `QuizRunner.tsx` 520 l. None has tests.

**Missing toolchain**
- `tailwindcss-animate` is **not installed** (`plugins: []`), yet `animate-in`, `fade-in`, `zoom-in-95`, `slide-in-from-*` appear **49 times** — including `ui.tsx:289,295` (Modal), `QuizRunner.tsx:299,499` (**quiz answer feedback**), `GrammarClient.tsx:60` (accordion). **These animations silently do not exist.**
- `lib/journey.ts` has no test while the other pure libs do.
- Zero component/API/integration tests; the 15 tests cover pure functions only.
- Lint is effectively a no-op signal: 1 warning across ~11 000 lines.

**Version drift** — `prisma` warns 5.18.0 → 8.0.0-rc available; `@next-auth/prisma-adapter` pinned to 1.0.7 with `next-auth` 4.24.7; `nodemailer`/`@types/nodemailer` use floating `^`.

---

## 10. Quick Wins

| Effort | Fix | Why it's high value |
|---|---|---|
| **1 line** | `html { scroll-padding-top: 84px }` in `app/globals.css` | Fixes **4 broken in-page anchor links** across learn + review at every viewport. |
| **1 line** | `app/layout.tsx:46` + `review/page.tsx:80` + `learn/page.tsx:37` — `<main>` → `<section>` | Removes nested `main` landmarks; instant a11y win. |
| **2 lines** | `ReviewClient.tsx:22-25` — delete the 4 interval strings, or derive from `dueInDays` | Stops the app from lying about SRS scheduling. |
| **2 lines** | `ReviewClient.tsx:288` — remove `+20 XP` from the toast | Stops promising XP that never lands. |
| **1 line** | `ReviewClient.tsx:449-465` — `disabled={submitting \|\| !isFlipped}` | Aligns mouse behaviour with the keyboard path; protects SRS integrity. |
| **3 lines** | `SurvivalClient.tsx:830` — `if (!res.ok) { … return; }` before the fanfare | Stops fabricated victories. |
| **1 line** | `app/app/page.tsx:75` — add `userId: uid` | Fixes a cross-user data leak and an unbounded query. |
| **1 line** | `app/app/page.tsx:81` — add `orderBy: { totalXP: "desc" }` | Turns an arbitrary list into a leaderboard. |
| **1 file** | Add `/app/profile` to `MORE_ITEMS` in `AppNav.tsx` | Restores logout, settings and account deletion. |
| **~10 min** | Replace the 6 hardcoded stats at `learn/page.tsx:170-196` with `count()` queries | Removes 6 fabricated numbers. |
| **~10 min** | Delete `ReviewClient.tsx:372` + add `romaji` to `EnrichedReviewItem` and `resolveReviewItems` | Restores the missing romaji layer on the main screen. |
| **~15 min** | `next/dynamic` the `Japanese3DRoom` import in `JourneyClient.tsx:7` (`ssr: false`) | Cuts the heaviest client chunk off `/app/journey`. |
| **~15 min** | Shrink `public/favicon.ico` / `logo.jpg` / `app/icon.jpg` to ≤ 20 KB | Removes ~1.9 MB of images. |
| **~20 min** | Delete `components/AppNav.css`, `SenseiClient.tsx`, `dashboard.css:24-49`, `AppNav`'s 5 unused props | −900 lines of misleading dead code. |
| **~30 min** | Add `role="dialog" aria-modal="true"` + Escape + focus-return to `ui.tsx:262` `Modal` | Fixes the single most-used broken primitive (19 sites). |
| **~30 min** | One `todayKey(userId)` helper used by all 5 mission writers + 2 readers | Fixes 7 h/day of lost mission progress for every VN user. |

---

## 11. Recommended Fix Order

**Wave 1 — Trust (do first; these are the app lying to the user)**
1. `.env` rotation + delete the fallback JWT secret (`middleware.ts:4`, `auth-options.ts:16`) → throw at boot. *(S1, S2)*
2. `ReviewClient.tsx:288` — stop claiming +20 XP, or implement it. *(§2 #1)*
3. `SurvivalClient.tsx:827-851` — gate success on `res.ok`. *(§2 #4)*
4. Delete the 6 fabricated stats (`learn/page.tsx:170-196`) and the invented `forgottenCount`/`retention` (`review/page.tsx:70-73`). *(§2 #6, #12)*
5. Badge `isBot` rows on the leaderboard **and** the dashboard widget. *(§2 #5)*

**Wave 2 — Data integrity (blockers for any further seeding/testing)**
6. `prisma/seed.ts:152-153` — upsert vocabulary by natural key instead of delete-all. *(§2 #2)*
7. `app/app/page.tsx:75,79-82` — `userId` filter + `orderBy`. *(§2 #9, #10)*
8. `todayKey(userId)` helper across all 5 mission writers + 2 readers. *(§5 #1)*
9. Server-side re-grading for kana-battle, dungeon and lessons; require the full exercise set. *(§2 #3, #13)*
10. `findFirst`→`create` XP races → `$transaction` + unique index on `(userId, reason, referenceId)`. *(§5 #3)*
11. Add `userId: uid` filtering discipline + derive `level` from `totalXP` everywhere (kill the redundant column). *(§5 #24)*

**Wave 3 — Auth & abuse**
12. Rate limiting on login / register / OTP send / OTP verify / AI chat. *(S6)*
13. OTP attempt lockout + `crypto.randomInt` + generic responses. *(S3, S4, S5)*
14. Add `/app/profile` to the nav — restores logout. *(§2 #21)*
15. `next.config.js` image `remotePatterns` allow-list. *(S14)*
16. `lib/email.ts` — drop `logger/debug`, fail loudly when SMTP is unconfigured. *(S9, S10)*

**Wave 4 — Mobile & accessibility (the stated #1 priority)**
17. `scroll-padding-top: 84px`. *(§4)*
18. Navbar at 1024 px — move the desktop breakpoint to `xl` or collapse links. *(§4)*
19. `KanaLab` `grid-cols-5` → responsive; restore the column header on mobile. *(§3)*
20. `ui.tsx` `Modal`: dialog role, Escape, focus trap + return, body scroll lock, and **do not close on backdrop click for the drawing modal**. *(A1-A6)*
21. `KanaLab.tsx:269-273` — remove the `<div onClick>`; keep the 🔊 button. *(A7)*
22. 3 tab groups → real `tablist`/`tab`/`tabpanel` with arrow keys. *(A11)*
23. 10 px text → ≥ 12 px; 18 px checkbox → ≥ 44 px; `text-slate-400` → `slate-500`. *(§6)*
24. Add nested `loading.tsx` + `error.tsx` per module; use `Skeleton`/`ErrorState` (already written, currently unused). *(§5 #16)*

**Wave 5 — Performance**
25. `/app/review`: fetch only the referenced `contentId`s (kills the 464 KB scan).
26. `/app/vocabulary`: server-side filter/paginate; drop the `JSON.parse(JSON.stringify())` clone.
27. `next/dynamic` for `Japanese3DRoom`, `KanaCanvas`, `KanaBattleCard`, `SenseiKaiwaClient`.
28. Favicon/logo/icon → ≤ 20 KB.
29. Gate GSAP off the public routes.
30. Debounce vocabulary search; add Vietnamese accent folding.

**Wave 6 — Consistency & maintainability (lowest risk, do last)**
31. Adopt `components/ui.tsx` primitives across modules; retire the `.nqd-*`/`.nqn-*` systems.
32. Delete the dead code and the 9 archive folders.
33. Install `tailwindcss-animate` **or** remove the 49 dead animation classes.
34. Add `motion-reduce:` to the 25 unguarded Tailwind animations.
35. Extract the duplicated journey sync loop; split the 4 components over 1 000 lines.
36. Add API-route and component tests; enable `eslint-plugin-jsx-a11y`.

---

## 12. Post-Audit — Triage (no code changed yet)

### A. Fix immediately
- `.env` rotation + JWT secret fallback removal.
- `+20 XP` fabrication; Survival fabricated victory; 6 fabricated stats; invented SRS intervals; invented retention metrics; hardcoded 40 % progress.
- `/app/vocabulary` + `/app/review` payload sizes.
- `prisma/seed.ts` delete-all.
- `app/app/page.tsx` missing `userId` filter and `orderBy`.
- Timezone divergence on daily missions.
- Client-trusted XP on 3 endpoints.
- `/app/profile` unreachable → no logout.

### B. Fix — UI/UX
- Navbar at 1024 px; `scroll-padding-top`; Kana Lab mobile grid; column headers on mobile.
- Romaji missing from the review card; grade buttons enabled pre-flip; AGAIN re-queue no-op on the last card.
- Duplicate kana browsers on `/app/learn`; two buttons that do the same thing in `LearnKanaPanel`.
- Missing loading/error boundaries; silent failures in `KanaLab.markPracticed` and `handleAddToSrs`.
- Bots unlabelled; leaderboard empty state unreachable.
- Locked-lesson affordance on `/app/learn` vs. no real gating on `/app/practice/[slug]`.

### C. Fix — mobile
- Kana Lab 5-column grid and 10 px badges.
- 639 KB favicon/logo; 250 KB vocabulary payload.
- Modal backdrop tap destroying drawings; no body scroll lock; `92vh` vs `dvh`.
- 18 px checkbox and 32-36 px icon buttons.
- `text-slate-400` and 10/11 px text on mobile.
- Unguarded `animate-spin`/`pulse`/`bounce` on the loading screen.

### D. Can be deferred
- `next/dynamic` for the 3D room and canvas.
- Splitting the 4 files over 1 000 lines.
- Dead CSS/archive-folder deletion.
- Installing or removing `tailwindcss-animate`.
- `practical` version bumps (Prisma 8, nodemailer floats).
- GSAP gating for public routes.
- Component/API test suite.

### E. Not actually bugs — deliberate, keep
- **Rival bots existing at all.** A competitive hook is a legitimate product decision. The bug is only the **absence of disclosure**.
- **`overflow-x-hidden` on html/body/main.** Intentional bleed for the decorative backdrops — *but* it is also what turns the 1024 px navbar overflow into invisible, unreachable links. Keep it, fix the navbar.
- **Full-screen loading takeover.** Intentional brand moment — but it needs a deterministic phrase, reduced-motion handling, and per-route granularity.
- **The `1.2 s` auto-close after a successful kana write.** Deliberate celebration beat; keep it, just clear the timeout on unmount.
- **SQLite.** Correct for a single-node student deployment; only becomes a problem under horizontal scaling.
- **`fixed inset-0 z-50` layering collisions.** Only latent; no observed visual break.
- **`Noto_Serif_JP subsets: ["latin"]`.** Renders Japanese via the local `@font-face` fallback — correct, not a bug. Confirm §7 P6 subset count.
- **The 39 unused `AppNav` props / unused `ui.tsx` exports.** Over-parameterisation, not a defect.

---

## Appendix — Verification commands used

```powershell
npx tsc --noEmit --pretty false                 # exit 0
npx next lint                                  # exit 0, 1 warning
npx vitest run                                 # 15/15 pass
npx prisma validate                            # valid
npx next build                                 # compiled successfully, 43 pages
```

Evidence gathered by direct inspection: line-level source reads; `prisma/dev.db` row counts via Prisma Client; measured JSON payload sizes for the `/app/vocabulary` props (250.2 KB) and the `/app/review` lookup maps (463.7 KB); image dimensions/byte sizes via `System.Drawing`; exhaustive greps for `signOut`, `/app/profile`, `next/dynamic`, `dangerouslySetInnerHTML`, `role="tabpanel"`, `aria-controls`, `scroll-margin-top`, `scroll-padding-top`, `prefers-reduced-motion`, `motion-safe|motion-reduce`, `nqn-`, `skeleton`, `errorstate`, and every `localDateKey`/`toISOString().slice(0,10)` call site.

**No project file was modified during this audit.**
