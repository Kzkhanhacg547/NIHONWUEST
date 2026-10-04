"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NihonQuestLogo } from "@/components/NihonQuestLogo";
import { JapanBackdrop, JapanScenicPanel, ChoiceArt, NQIcon, type ChoiceArtKind } from "@/components/JapanIllustration";

const STEPS = [
  { id: "level", label: "Trình độ hiện tại", title: "Trình độ hiện tại của bạn là gì?", subtitle: "Chọn trình độ phù hợp nhất. Đừng lo lắng, bạn luôn có thể thay đổi sau này." },
  { id: "goal", label: "Mục tiêu học", title: "Mục tiêu học của bạn là gì?", subtitle: "Chọn mục tiêu chính để Nihon Quest ưu tiên nội dung phù hợp với bạn." },
  { id: "time", label: "Thời lượng mỗi ngày", title: "Bạn muốn học bao lâu mỗi ngày?", subtitle: "Một nhịp học vừa sức sẽ giúp bạn duy trì lâu dài và tiến bộ đều hơn." },
];

const LEVEL_OPTIONS = [
  { key: "BEGINNER", value: "N5", label: "Người mới bắt đầu", desc: "Chưa từng học hoặc mới làm quen với tiếng Nhật.", art: "torii" },
  { key: "N5", value: "N5", label: "N5", desc: "Hiểu các câu cơ bản, tự giới thiệu, hội thoại hằng ngày đơn giản.", art: "sprout" },
  { key: "N4", value: "N4", label: "N4", desc: "Hiểu tình huống quen thuộc, giao tiếp cơ bản trong cuộc sống, công việc.", art: "fuji" },
  { key: "N3", value: "N3", label: "N3", desc: "Có thể hiểu nội dung phổ biến, giao tiếp tự tin hơn trong nhiều tình huống.", art: "sakura" },
];

const GOAL_OPTIONS = [
  { value: "TRAVEL", label: "Du lịch Nhật Bản", desc: "Giao tiếp tại sân bay, khách sạn, nhà hàng và mua sắm.", art: "旅" },
  { value: "JLPT", label: "Thi JLPT", desc: "Học có hệ thống, bám sát cấp độ và dạng bài thi.", art: "試" },
  { value: "CONVERSATION", label: "Giao tiếp hằng ngày", desc: "Tăng phản xạ nghe nói và dùng tiếng Nhật tự nhiên hơn.", art: "話" },
  { value: "CULTURE", label: "Văn hóa & Anime", desc: "Hiểu tiếng Nhật qua phim, manga, âm nhạc và văn hóa.", art: "祭" },
];

const TIME_OPTIONS = [
  { value: 10, label: "10 phút", desc: "Nhẹ nhàng, dễ duy trì mỗi ngày.", art: "一" },
  { value: 15, label: "15 phút", desc: "Nhịp học cân bằng, phù hợp phần lớn người học.", art: "十五" },
  { value: 30, label: "30 phút", desc: "Tiến bộ nhanh hơn với luyện tập đều.", art: "三十" },
  { value: 60, label: "60 phút", desc: "Cường độ cao cho mục tiêu rõ ràng.", art: "一時" },
];

const SVG_ART = ["torii", "sprout", "fuji", "sakura"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [levelChoice, setLevelChoice] = useState("BEGINNER");
  const [selections, setSelections] = useState({ learningLevel: "N5", learningGoal: "TRAVEL", dailyGoalMinutes: 15 });

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = async () => {
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...selections,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Ho_Chi_Minh",
          onboardingCompleted: true,
        }),
      });
      if (res.ok) {
        router.push("/app");
        router.refresh();
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  };

  const choices = step === 0 ? LEVEL_OPTIONS : step === 1 ? GOAL_OPTIONS : TIME_OPTIONS;

  return (
    <div className="nq-onboard-page">
      <JapanBackdrop />
      <div className="nq-onboard-shell">
        <header className="nq-onboard-top" data-intro>
          <Link href="/"><NihonQuestLogo size="sm" /></Link>
          <nav className="nq-onboard-mini-nav" aria-label="Giới thiệu"><span>Trải nghiệm</span><span>Hành trình</span><span>Không gian học</span></nav>
          <div className="nq-onboard-top-actions">
            <Link href="/login">Đăng nhập</Link>
            <Link href="/register" className="nq-top-cta">Bắt đầu <i><NQIcon name="arrowUR" /></i></Link>
          </div>
        </header>

        <ol className="nq-stepper" aria-label="Tiến trình cá nhân hóa" data-intro>
          {STEPS.map((item, index) => (
            <li key={item.id} className={`nq-step ${step === index ? "is-active" : ""} ${index < step ? "is-done" : ""}`} aria-current={step === index ? "step" : undefined}>
              <span>{index + 1}</span><b>{item.label}</b>
            </li>
          ))}
        </ol>

        <section className="nq-onboard-hero">
          <div className="nq-onboard-copy" data-intro>
            <span className="eyebrow">NIHON QUEST</span>
            <h1>Cá nhân hóa<em>hành trình học của bạn.</em></h1>
            <p>Chỉ với 3 bước đơn giản, chúng tôi sẽ thiết kế lộ trình học tiếng Nhật phù hợp nhất với mục tiêu, thời gian và trình độ hiện tại của bạn.</p>
          </div>
          <div className="nq-onboard-scene" data-intro data-parallax><JapanScenicPanel variant="fuji" /></div>
        </section>

        <section className="nq-onboard-card" data-reveal>
          <div className="nq-onboard-card-head">
            <small><b>0{step + 1}</b> / 03</small>
            <h2>{currentStep.title}</h2>
            <p>{currentStep.subtitle}</p>
          </div>

          <div className="nq-choice-grid" role="radiogroup" aria-label={currentStep.title}>
            {choices.map((option: any) => {
              const selected = step === 0
                ? levelChoice === option.key
                : step === 1
                  ? selections.learningGoal === option.value
                  : selections.dailyGoalMinutes === option.value;
              return (
                <button
                  key={step === 0 ? option.key : option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`nq-choice ${selected ? "is-selected" : ""}`}
                  data-tilt
                  onClick={() => {
                    if (step === 0) {
                      setLevelChoice(option.key);
                      setSelections((s) => ({ ...s, learningLevel: option.value }));
                    } else if (step === 1) {
                      setSelections((s) => ({ ...s, learningGoal: option.value }));
                    } else {
                      setSelections((s) => ({ ...s, dailyGoalMinutes: option.value }));
                    }
                  }}
                >
                  <span className="nq-choice-check" aria-hidden="true">{selected ? "✓" : ""}</span>
                  <span className="nq-choice-art">
                    {SVG_ART.includes(option.art) ? <ChoiceArt kind={option.art as ChoiceArtKind} /> : <span className="jp-text">{option.art}</span>}
                  </span>
                  <b>{option.label}</b>
                  <small>{option.desc}</small>
                </button>
              );
            })}
          </div>

          <div className="nq-onboard-actions">
            <button className="nq-onboard-back" type="button" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}><NQIcon name="back" /> Quay lại</button>
            <div className="nq-onboard-dots" aria-hidden="true">{STEPS.map((_, i) => <span key={i} className={i === step ? "is-active" : ""} />)}</div>
            <button className="nq-onboard-next" type="button" onClick={handleNext} disabled={loading}>
              {loading ? "Đang thiết lập..." : isLast ? "Bắt đầu học" : "Tiếp theo"} <NQIcon name="arrow" />
            </button>
          </div>
        </section>
      </div>

      <div className="nq-side-jp nq-side-jp-onboard" aria-hidden="true">
        <span className="jp-text">日本への旅</span><i />
        <small>HÀNH TRÌNH<br />MỚI.<br />MỘT<br />PHIÊN BẢN<br />MỚI.</small>
      </div>
    </div>
  );
}
