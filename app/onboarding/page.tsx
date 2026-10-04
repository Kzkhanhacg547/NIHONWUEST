"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NihonQuestLogo } from "@/components/NihonQuestLogo";
import { JapanBackdrop, JapanScenicPanel, ChoiceArt, NQIcon, type ChoiceArtKind } from "@/components/JapanIllustration";
import {
  ONBOARDING_QUESTIONS,
  FOCUS_SKILL_OPTIONS,
  LEARNING_STYLE_OPTIONS,
} from "@/lib/personalization";

const STEPS = [...ONBOARDING_QUESTIONS];

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

type StepId = (typeof STEPS)[number]["id"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [levelChoice, setLevelChoice] = useState("BEGINNER");
  const [selections, setSelections] = useState({
    learningLevel: "N5",
    levelChoice: "BEGINNER",
    learningGoal: "TRAVEL",
    dailyGoalMinutes: 15,
    focusSkill: "BALANCED",
    learningStyle: "STRUCTURED",
  });

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
        router.push("/app/path");
        router.refresh();
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  };

  const choices: readonly any[] =
    step === 0
      ? LEVEL_OPTIONS
      : step === 1
        ? GOAL_OPTIONS
        : step === 2
          ? TIME_OPTIONS
          : step === 3
            ? FOCUS_SKILL_OPTIONS
            : LEARNING_STYLE_OPTIONS;

  const isSelected = (option: any): boolean => {
    const stepId = currentStep.id as StepId;
    if (stepId === "level") return levelChoice === option.key;
    if (stepId === "goal") return selections.learningGoal === option.value;
    if (stepId === "time") return selections.dailyGoalMinutes === option.value;
    if (stepId === "focusSkill") return selections.focusSkill === option.value;
    return selections.learningStyle === option.value;
  };

  const select = (option: any) => {
    const stepId = currentStep.id as StepId;
    if (stepId === "level") {
      setLevelChoice(option.key);
      setSelections((s) => ({ ...s, levelChoice: option.key, learningLevel: option.value }));
    } else if (stepId === "goal") {
      setSelections((s) => ({ ...s, learningGoal: option.value }));
    } else if (stepId === "time") {
      setSelections((s) => ({ ...s, dailyGoalMinutes: option.value }));
    } else if (stepId === "focusSkill") {
      setSelections((s) => ({ ...s, focusSkill: option.value }));
    } else {
      setSelections((s) => ({ ...s, learningStyle: option.value }));
    }
  };

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
            <p>Chỉ với 5 bước, chúng tôi phân tích trình độ, mục tiêu, thời gian, kỹ năng trọng tâm và phong cách học để thiết kế lộ trình riêng cho bạn.</p>
          </div>
          <div className="nq-onboard-scene" data-intro data-parallax><JapanScenicPanel variant="fuji" /></div>
        </section>

        <section className="nq-onboard-card" data-reveal>
          <div className="nq-onboard-card-head">
            <small><b>0{step + 1}</b> / 0{STEPS.length}</small>
            <h2>{currentStep.title}</h2>
            <p>{currentStep.subtitle}</p>
          </div>

          <div className="nq-choice-grid" role="radiogroup" aria-label={currentStep.title}>
            {choices.map((option: any) => {
              const selected = isSelected(option);
              return (
                <button
                  key={currentStep.id === "level" ? option.key : option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`nq-choice ${selected ? "is-selected" : ""}`}
                  data-tilt
                  onClick={() => select(option)}
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
              {loading ? "Đang thiết lập..." : isLast ? "Xem lộ trình của bạn" : "Tiếp theo"} <NQIcon name="arrow" />
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
