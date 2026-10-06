"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSoundAndTheme, SPEECH_RATES } from "@/components/SoundAndThemeContext";
import { guessVoiceGender, voiceGenderLabel } from "@/lib/voiceGender";
import { AvatarEditor } from "../profile/AvatarEditor";

export interface SettingsInitialData {
  displayName: string;
  email: string;
  avatar: string | null;
  bio: string;
  timezone: string;
  learningLevel: string;
  learningGoal: string;
  dailyGoalMinutes: number;
  focusSkill: string;
  learningStyle: string;
  theme: "light" | "dark" | "system";
  soundEnabled: boolean;
  registeredDate: string;
}

export function SettingsClient({ initial }: { initial: SettingsInitialData }) {
  const router = useRouter();
  const {
    theme,
    setTheme,
    soundEnabled,
    setSoundEnabled,
    speechRate,
    setSpeechRate,
    speechVoiceURI,
    setSpeechVoiceURI,
    availableVoices,
    speak,
    playClick,
    playCorrect,
    showToast,
  } = useSoundAndTheme();

  const [activeTab, setActiveTab] = useState<
    "profile" | "appearance" | "learning" | "audio" | "notifications" | "privacy" | "account"
  >("profile");

  // Form states
  const [displayName, setDisplayName] = useState(initial.displayName);
  const [bio, setBio] = useState(initial.bio);
  const [timezone, setTimezone] = useState(initial.timezone);
  const [learningLevel, setLearningLevel] = useState(initial.learningLevel);
  const [learningGoal, setLearningGoal] = useState(initial.learningGoal);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(initial.dailyGoalMinutes);
  const [focusSkill, setFocusSkill] = useState(initial.focusSkill);
  const [learningStyle, setLearningStyle] = useState(initial.learningStyle);

  // Notification preferences (persisted locally)
  const [notifDaily, setNotifDaily] = useState(true);
  const [notifReview, setNotifReview] = useState(true);
  const [notifAchievement, setNotifAchievement] = useState(true);
  const [notifLevelUp, setNotifLevelUp] = useState(true);

  // Privacy toggles
  const [privacyPublicLeaderboard, setPrivacyPublicLeaderboard] = useState(true);
  const [privacyPublicStats, setPrivacyPublicStats] = useState(true);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdBusy, setPwdBusy] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteBusy, setDeleteBusy] = useState(false);

  // Saving states
  const [isSaving, setIsSaving] = useState(false);

  const initialAvatarChar = (displayName || initial.email || "N").slice(0, 1).toUpperCase();

  // Save general settings
  async function handleSaveSettings(e?: React.FormEvent) {
    if (e) e.preventDefault();
    playClick();
    setIsSaving(true);

    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          bio,
          timezone,
          learningLevel,
          learningGoal,
          dailyGoalMinutes,
          focusSkill,
          learningStyle,
          theme,
          soundEnabled,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast({ title: json.error || "Không thể lưu cài đặt", type: "error" });
        return;
      }

      playCorrect();
      showToast({
        title: "Đã lưu cài đặt thành công!",
        description: "Các thay đổi đã được áp dụng và đồng bộ trên toàn bộ hệ thống.",
        type: "success",
      });
      router.refresh();
    } catch {
      showToast({ title: "Đã có lỗi xảy ra. Vui lòng thử lại.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  }

  // Change password
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast({ title: "Mật khẩu mới phải có ít nhất 8 ký tự.", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast({ title: "Mật khẩu xác nhận không khớp.", type: "error" });
      return;
    }

    playClick();
    setPwdBusy(true);

    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        showToast({ title: json.error || "Đổi mật khẩu thất bại", type: "error" });
        return;
      }

      playCorrect();
      showToast({ title: "Đã đổi mật khẩu thành công!", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      showToast({ title: "Không thể đổi mật khẩu.", type: "error" });
    } finally {
      setPwdBusy(false);
    }
  }

  // Delete account
  async function handleDeleteAccount() {
    if (deleteConfirmText.trim().toLowerCase() !== "xóa tài khoản") {
      showToast({ title: "Vui lòng nhập chính xác 'xóa tài khoản' để xác nhận.", type: "error" });
      return;
    }

    setDeleteBusy(true);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (!res.ok) throw new Error();

      showToast({ title: "Đã xóa tài khoản vĩnh viễn.", type: "info" });
      await signOut({ redirect: false });
      router.push("/register");
    } catch {
      showToast({ title: "Xóa tài khoản thất bại. Vui lòng thử lại.", type: "error" });
      setDeleteBusy(false);
    }
  }

  const TABS = [
    { id: "profile", label: "Hồ sơ cá nhân", icon: "👤" },
    { id: "appearance", label: "Giao diện", icon: "🎨" },
    { id: "learning", label: "Học tập & Lộ trình", icon: "⛩️" },
    { id: "audio", label: "Âm thanh & Giọng đọc", icon: "🔊" },
    { id: "notifications", label: "Thông báo", icon: "🔔" },
    { id: "privacy", label: "Quyền riêng tư", icon: "🛡️" },
    { id: "account", label: "Tài khoản & Bảo mật", icon: "⚙️" },
  ] as const;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Cài Đặt Hệ Thống
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Tùy chỉnh thông tin cá nhân, giao diện, âm thanh và mục tiêu học tiếng Nhật
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSaveSettings()}
          disabled={isSaving}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-6 text-sm font-bold text-white shadow-md shadow-rose-600/30 transition hover:bg-rose-700 active:scale-95 disabled:opacity-50"
        >
          {isSaving ? "Đang lưu..." : "💾 Lưu tất cả thay đổi"}
        </button>
      </div>

      {/* Main Settings Grid: Sidebar Navigation + Content Area */}
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        {/* Navigation Tabs (Sidebar on Desktop, Horizontal Scroll on Mobile) */}
        <nav
          aria-label="Cài đặt danh mục"
          className="flex gap-1.5 overflow-x-auto rounded-3xl border border-slate-200/80 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-sumi-900 lg:flex-col lg:overflow-visible"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playClick();
                  setActiveTab(tab.id);
                }}
                className={`flex min-h-[46px] items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-sm font-bold transition whitespace-nowrap lg:whitespace-normal ${
                  isActive
                    ? "bg-rose-50 text-rose-700 shadow-sm dark:bg-rose-950/60 dark:text-rose-300"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-sumi-800 dark:hover:text-white"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="flex-1">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Settings Sections Container */}
        <div className="space-y-6">
          {/* ================= SECTION 1: PROFILE ================= */}
          {activeTab === "profile" && (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-sumi-900">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-lg dark:bg-rose-950/60">
                  👤
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Hồ sơ cá nhân</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ảnh đại diện và thông tin hiển thị trên Nihon Quest</p>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {/* Avatar upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">
                    Ảnh đại diện
                  </label>
                  <div className="flex items-center gap-5">
                    <AvatarEditor src={initial.avatar} initial={initialAvatarChar} />
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Ảnh chân dung</p>
                      <p className="mt-0.5 text-xs text-slate-500">Định dạng JPG, PNG hoặc WebP. Tối đa 8MB.</p>
                      <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400">
                        Ảnh sẽ hiển thị trên Navbar, Dashboard và Bảng xếp hạng.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Display Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Nhập tên của bạn"
                    className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 dark:border-slate-700 dark:bg-sumi-950 dark:text-white"
                  />
                </div>

                {/* Email (Readonly) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Địa chỉ Email
                    </label>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      ✓ Đã xác thực
                    </span>
                  </div>
                  <input
                    type="email"
                    value={initial.email}
                    disabled
                    readOnly
                    className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-500 outline-none cursor-not-allowed dark:border-slate-800 dark:bg-sumi-950/60 dark:text-slate-400"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">Email dùng để đăng nhập và bảo mật tài khoản.</p>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                    Giới thiệu bản thân (Bio)
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Chia sẻ lý do bạn học tiếng Nhật, bộ anime yêu thích, hoặc mục tiêu thi JLPT..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 dark:border-slate-700 dark:bg-sumi-950 dark:text-white"
                  />
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                    Múi giờ hoạt động
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 dark:border-slate-700 dark:bg-sumi-950 dark:text-white"
                  >
                    <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7 - Việt Nam)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (GMT+9 - Nhật Bản)</option>
                    <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                    <option value="Asia/Seoul">Asia/Seoul (GMT+9)</option>
                    <option value="UTC">UTC (Giờ chuẩn quốc tế)</option>
                  </select>
                  <p className="mt-1 text-[11px] text-slate-400">Múi giờ quyết định chu kỳ reset streak và nhiệm vụ hàng ngày.</p>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 2: APPEARANCE ================= */}
          {activeTab === "appearance" && (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-sumi-900">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-lg dark:bg-amber-950/60">
                  🎨
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Giao diện (Theme)</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tùy chỉnh chế độ hiển thị sáng tối theo sở thích của bạn</p>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">
                    Chế độ giao diện
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "light" as const, title: "Sáng (Light)", icon: "☀️", desc: "Giấy truyền thống Washi" },
                      { id: "dark" as const, title: "Tối (Dark)", icon: "🌙", desc: "Mực đen Sumi cao cấp" },
                      { id: "system" as const, title: "Tự động", icon: "💻", desc: "Theo thiết bị của bạn" },
                    ].map((mode) => {
                      const on = theme === mode.id;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => {
                            playClick();
                            setTheme(mode.id);
                          }}
                          className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition ${
                            on
                              ? "border-rose-500 bg-rose-50/70 text-rose-700 ring-2 ring-rose-500/20 dark:bg-rose-950/40 dark:text-rose-300"
                              : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-sumi-950 dark:hover:border-slate-600"
                          }`}
                        >
                          <span className="text-2xl">{mode.icon}</span>
                          <span className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{mode.title}</span>
                          <span className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{mode.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 3: LEARNING ================= */}
          {activeTab === "learning" && (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-sumi-900">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-lg dark:bg-indigo-950/60">
                  ⛩️
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Mục tiêu &amp; Lộ trình học</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tùy biến lộ trình cá nhân hóa và thời gian rèn luyện mỗi ngày</p>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {/* Daily Goal Minutes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Mục tiêu thời gian mỗi ngày (phút)
                    </label>
                    <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                      {dailyGoalMinutes} phút / ngày
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[10, 15, 20, 30, 45, 60].map((min) => (
                      <button
                        key={min}
                        type="button"
                        onClick={() => {
                          playClick();
                          setDailyGoalMinutes(min);
                        }}
                        className={`min-h-10 rounded-xl px-4 text-xs font-bold transition ${
                          dailyGoalMinutes === min
                            ? "bg-rose-600 text-white shadow-sm"
                            : "border border-slate-200 bg-white text-slate-700 hover:border-rose-300 dark:border-slate-700 dark:bg-sumi-950 dark:text-slate-300"
                        }`}
                      >
                        {min} phút
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400">
                    Giá trị này sẽ đồng bộ với tiến độ rèn luyện hiển thị trên Dashboard và thanh mục tiêu ngày.
                  </p>
                </div>

                {/* JLPT Level */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                      Cấp độ JLPT trọng tâm
                    </label>
                    <select
                      value={learningLevel}
                      onChange={(e) => setLearningLevel(e.target.value)}
                      className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 dark:border-slate-700 dark:bg-sumi-950 dark:text-white"
                    >
                      <option value="N5">N5 — Sơ cấp (Người mới bắt đầu)</option>
                      <option value="N4">N4 — Sơ trung cấp (Giao tiếp cơ bản)</option>
                      <option value="N3">N3 — Trung cấp (Thực chiến hằng ngày)</option>
                    </select>
                  </div>

                  {/* Primary Goal */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                      Mục tiêu học chính
                    </label>
                    <select
                      value={learningGoal}
                      onChange={(e) => setLearningGoal(e.target.value)}
                      className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 dark:border-slate-700 dark:bg-sumi-950 dark:text-white"
                    >
                      <option value="JLPT">Thi đỗ chứng chỉ JLPT</option>
                      <option value="TRAVEL">Du lịch khám phá Nhật Bản</option>
                      <option value="CONVERSATION">Giao tiếp &amp; làm việc</option>
                      <option value="CULTURE">Văn hóa, Anime &amp; Manga</option>
                    </select>
                  </div>
                </div>

                {/* Skill & Style */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                      Kỹ năng ưu tiên
                    </label>
                    <select
                      value={focusSkill}
                      onChange={(e) => setFocusSkill(e.target.value)}
                      className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 dark:border-slate-700 dark:bg-sumi-950 dark:text-white"
                    >
                      <option value="BALANCED">Toàn diện (Nghe, Nói, Đọc, Viết)</option>
                      <option value="LISTENING">Kỹ năng Nghe hiểu</option>
                      <option value="SPEAKING">Kỹ năng Nói &amp; Đối đáp</option>
                      <option value="READING">Kỹ năng Đọc &amp; Hán tự</option>
                      <option value="WRITING">Kỹ năng Viết &amp; Ngữ pháp</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                      Phong cách học tập
                    </label>
                    <select
                      value={learningStyle}
                      onChange={(e) => setLearningStyle(e.target.value)}
                      className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 dark:border-slate-700 dark:bg-sumi-950 dark:text-white"
                    >
                      <option value="STRUCTURED">Bài bản — Trình tự khoa học, ôn SRS</option>
                      <option value="IMMERSIVE">Nhập vai — Trải nghiệm như ở Nhật</option>
                      <option value="GAMIFIED">Phiêu lưu — Mở khóa Shinkansen &amp; Streak</option>
                      <option value="PRACTICAL">Thực chiến — Tình huống sinh tồn</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 4: AUDIO & VOICE ================= */}
          {activeTab === "audio" && (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-sumi-900">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-lg dark:bg-teal-950/60">
                  🔊
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Âm thanh &amp; Giọng đọc tiếng Nhật</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Hiệu ứng âm thanh khi làm bài và công nghệ đọc giọng chuẩn bản xứ</p>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {/* Sound Effects Toggle */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-sumi-950">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Âm thanh hiệu ứng (Sound FX)</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Phát âm thanh vui tai khi trả lời đúng, hoàn thành bài và click</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={soundEnabled}
                    onClick={() => {
                      setSoundEnabled(!soundEnabled);
                      if (!soundEnabled) playClick();
                    }}
                    className={`relative h-7 w-12 rounded-full transition ${
                      soundEnabled ? "bg-rose-600" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                        soundEnabled ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Speech Rate */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                    Tốc độ phát âm (Voice Speed)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SPEECH_RATES.map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => {
                          setSpeechRate(rate);
                          speak("こんにちは！日本語の練習です。", rate);
                        }}
                        className={`min-h-10 rounded-xl px-4 text-xs font-bold transition ${
                          speechRate === rate
                            ? "bg-rose-600 text-white shadow-sm"
                            : "border border-slate-200 bg-white text-slate-700 hover:border-rose-300 dark:border-slate-700 dark:bg-sumi-950 dark:text-slate-300"
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Japanese Voice Selector */}
                {availableVoices.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                      Giọng đọc tiếng Nhật
                    </label>
                    <select
                      value={speechVoiceURI}
                      onChange={(e) => setSpeechVoiceURI(e.target.value)}
                      className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 dark:border-slate-700 dark:bg-sumi-950 dark:text-white"
                    >
                      <option value="">Tự động (Giọng tiếng Nhật tốt nhất của hệ thống)</option>
                      {availableVoices.map((voice) => (
                        <option key={voice.voiceURI} value={voice.voiceURI}>
                          {voice.name} ({voice.lang}) · {voiceGenderLabel(guessVoiceGender(voice.name))}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Test Voice Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => speak("こんにちは！日本クエストへようこそ！")}
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 hover:border-rose-300 hover:text-rose-600 dark:border-slate-700 dark:bg-sumi-950 dark:text-slate-300"
                  >
                    <span>🔊 Nghe thử giọng đọc mẫu</span>
                    <span className="text-[11px] text-slate-400">(こんにちは！日本クエストへようこそ！)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 5: NOTIFICATIONS ================= */}
          {activeTab === "notifications" && (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-sumi-900">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-lg dark:bg-amber-950/60">
                  🔔
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Cài đặt thông báo</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Nhắc nhở học tập và sự kiện trong ứng dụng</p>
                </div>
              </div>

              <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Nhắc nhở học tập hàng ngày</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Thông báo duy trì chuỗi Streak và hoàn thành mục tiêu ngày</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifDaily}
                    onChange={(e) => setNotifDaily(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Nhắc nhở ôn tập SRS</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Báo khi có thẻ từ vựng và Kanji đến hạn lặp lại</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifReview}
                    onChange={(e) => setNotifReview(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Thông báo thành tựu</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Huy hiệu mới khi bạn chinh phục các cột mốc đặc biệt</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifAchievement}
                    onChange={(e) => setNotifAchievement(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Chúc mừng lên cấp (Level Up)</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Hiệu ứng pháo hoa và thông báo khi bạn đạt Level mới</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifLevelUp}
                    onChange={(e) => setNotifLevelUp(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 6: PRIVACY ================= */}
          {activeTab === "privacy" && (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-sumi-900">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-lg dark:bg-emerald-950/60">
                  🛡️
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quyền riêng tư &amp; Dữ liệu</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Kiểm soát hiển thị thông tin học tập của bạn</p>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Hiển thị trên Bảng xếp hạng</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Cho phép người học khác nhìn thấy tên và XP tuần của bạn</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacyPublicLeaderboard}
                      onChange={(e) => setPrivacyPublicLeaderboard(e.target.checked)}
                      className="h-5 w-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Công khai biểu đồ thống kê</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Hiển thị lịch học và huy hiệu đạt được trên trang hồ sơ</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacyPublicStats}
                      onChange={(e) => setPrivacyPublicStats(e.target.checked)}
                      className="h-5 w-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-sumi-950">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Thông tin tài khoản</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Ngày tham gia: <strong className="text-slate-700 dark:text-slate-300">{initial.registeredDate}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 7: ACCOUNT & SECURITY ================= */}
          {activeTab === "account" && (
            <div className="space-y-6">
              {/* Password Change */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-sumi-900">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-lg dark:bg-rose-950/60">
                    🔒
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Đổi mật khẩu</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Bảo mật tài khoản với mật khẩu tối thiểu 8 ký tự</p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-500 dark:border-slate-700 dark:bg-sumi-950 dark:text-white"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Ít nhất 8 ký tự"
                        required
                        className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-500 dark:border-slate-700 dark:bg-sumi-950 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        required
                        className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-rose-500 dark:border-slate-700 dark:bg-sumi-950 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={pwdBusy}
                    className="mt-2 inline-flex min-h-10 items-center justify-center rounded-xl bg-slate-900 px-5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                  >
                    {pwdBusy ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                  </button>
                </form>
              </div>

              {/* Danger Zone */}
              <div className="rounded-3xl border border-red-200/80 bg-white p-6 shadow-sm dark:border-red-900/60 dark:bg-sumi-900">
                <div className="flex items-center gap-3 border-b border-red-100 pb-4 dark:border-red-900/40">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-lg text-red-600 dark:bg-red-950/60">
                    ⚠️
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-red-700 dark:text-red-400">Vùng nguy hiểm</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Đăng xuất hoặc xóa vĩnh viễn tài khoản của bạn</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl bg-slate-50 dark:bg-sumi-950">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Đăng xuất</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Kết thúc phiên đăng nhập trên trình duyệt này</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-sumi-900 dark:text-slate-200"
                    >
                      Đăng xuất
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl border border-red-100 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/20">
                    <div>
                      <p className="text-sm font-bold text-red-700 dark:text-red-400">Xóa tài khoản vĩnh viễn</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Toàn bộ kinh nghiệm, tiến độ học và dữ liệu ôn tập sẽ bị xóa</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="inline-flex min-h-10 items-center justify-center rounded-xl bg-red-600 px-4 text-xs font-bold text-white transition hover:bg-red-700"
                    >
                      Xóa tài khoản
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Delete Account */}
      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-sumi-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-2xl dark:bg-red-950/60">
              ⚠️
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white">
              Bạn có chắc chắn muốn xóa tài khoản?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Hành động này <strong className="text-red-600 dark:text-red-400">không thể hoàn tác</strong>. Toàn bộ tiến trình học, điểm XP, chuỗi ngày streak và dữ liệu thẻ nhớ SRS sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                Nhập chữ <strong className="text-red-600">xóa tài khoản</strong> để xác nhận:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="xóa tài khoản"
                className="min-h-11 w-full rounded-xl border border-red-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/15 dark:border-red-800 dark:bg-sumi-950 dark:text-white"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleteBusy}
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                className="min-h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={deleteBusy || deleteConfirmText.trim().toLowerCase() !== "xóa tài khoản"}
                onClick={handleDeleteAccount}
                className="min-h-11 rounded-xl bg-red-600 px-5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {deleteBusy ? "Đang xóa..." : "Xác nhận xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
