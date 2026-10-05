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
import "./onboarding.css";

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

  const optionsFor = (index: number): readonly any[] =>
    index === 0
      ? LEVEL_OPTIONS
      : index === 1
        ? GOAL_OPTIONS
        : index === 2
          ? TIME_OPTIONS
          : index === 3
            ? FOCUS_SKILL_OPTIONS
            : LEARNING_STYLE_OPTIONS;

  const isSelectedFor = (index: number, option: any): boolean => {
    const stepId = STEPS[index].id as StepId;
    if (stepId === "level") return levelChoice === option.key;
    if (stepId === "goal") return selections.learningGoal === option.value;
    if (stepId === "time") return selections.dailyGoalMinutes === option.value;
    if (stepId === "focusSkill") return selections.focusSkill === option.value;
    return selections.learningStyle === option.value;
  };

  const selectedLabel = (index: number): string =>
    optionsFor(index).find((o: any) => isSelectedFor(index, o))?.label ?? "";

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

  const choices = optionsFor(step);

  return (
    <div className="ob-page">
      <JapanBackdrop />

      <div className="ob-scene" aria-hidden="true">
        <JapanScenicPanel variant="fuji" showLabel={false} />
      </div>

      <div className="ob-shell">
        {/* ───────── Thanh đầu trang ───────── */}
        <header className="ob-top">
          <Link href="/" className="ob-top-logo" aria-label="Nihon Quest - Trang chủ">
            <NihonQuestLogo size="sm" />
          </Link>
          <nav className="ob-top-nav" aria-label="Giới thiệu">
            <span>Trải nghiệm</span>
            <span>Hành trình</span>
            <span>Không gian học</span>
          </nav>
          <div className="ob-top-actions">
            <Link href="/login" className="ob-top-login">Đăng nhập</Link>
            <Link href="/register" className="ob-top-cta">
              <span>Bắt đầu</span>
              <i><NQIcon name="arrowUR" /></i>
            </Link>
          </div>
        </header>

        {/* ───────── Tiến trình ───────── */}
        <ol className="ob-stepper" aria-label="Tiến trình cá nhân hóa">
          {STEPS.map((item, index) => (
            <li
              key={item.id}
              className={`ob-step ${step === index ? "is-active" : ""} ${index < step ? "is-done" : ""}`}
              aria-current={step === index ? "step" : undefined}
            >
              <span className="ob-step-dot">{index < step ? "✓" : index + 1}</span>
              <b>{item.label}</b>
            </li>
          ))}
        </ol>

        {/* ───────── Giới thiệu ───────── */}
        <section className="ob-hero">
          <div className="ob-hero-copy">
            <span className="ob-eyebrow">NIHON QUEST</span>
            <h1>
              Cá nhân hóa
              <em>hành trình học của bạn.</em>
            </h1>
            <p>
              Chỉ với {STEPS.length} bước đơn giản, chúng tôi sẽ thiết kế lộ trình học tiếng Nhật phù hợp nhất với trình
              độ, mục tiêu, thời gian và phong cách học của bạn.
            </p>
          </div>

          <aside className="ob-callout" aria-hidden="true">
            <span className="jp-text">旅</span>
            <p>Mỗi hành trình vĩ đại đều bắt đầu bằng một lựa chọn phù hợp.</p>
            <i />
          </aside>
        </section>

        {/* ───────── Thẻ câu hỏi ───────── */}
        <section className="ob-card" aria-labelledby="ob-question">
          <div className="ob-card-head">
            <small>
              <b>0{step + 1}</b> / 0{STEPS.length}
            </small>
            <h2 id="ob-question">{currentStep.title}</h2>
            <p>{currentStep.subtitle}</p>
          </div>

          <div key={step} className="ob-choices" role="radiogroup" aria-label={currentStep.title}>
            {choices.map((option: any) => {
              const selected = isSelectedFor(step, option);
              return (
                <button
                  key={currentStep.id === "level" ? option.key : option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={`ob-choice ${selected ? "is-selected" : ""}`}
                  onClick={() => select(option)}
                >
                  <span className="ob-choice-check" aria-hidden="true">{selected ? "✓" : ""}</span>
                  <span className="ob-choice-art">
                    {SVG_ART.includes(option.art) ? (
                      <ChoiceArt kind={option.art as ChoiceArtKind} />
                    ) : (
                      <span className="jp-text">{option.art}</span>
                    )}
                  </span>
                  <b>{option.label}</b>
                  <small>{option.desc}</small>
                </button>
              );
            })}
          </div>

          <div className="ob-actions">
            <button className="ob-back" type="button" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
              <NQIcon name="back" /> Quay lại
            </button>
            <div className="ob-dots" aria-hidden="true">
              {STEPS.map((_, i) => (
                <span key={i} className={i === step ? "is-active" : ""} />
              ))}
            </div>
            <button className="ob-next" type="button" onClick={handleNext} disabled={loading}>
              {loading ? "Đang thiết lập..." : isLast ? "Xem lộ trình của bạn" : "Tiếp theo"} <NQIcon name="arrow" />
            </button>
          </div>
        </section>
      </div>

      {/* Chữ dọc bên phải (chỉ hiện trên màn hình rộng) */}
      <div className="ob-side" aria-hidden="true">
        <span className="jp-text">日本への旅</span>
        <i />
        <small>
          HÀNH TRÌNH
          <br />
          MỚI.
          <br />
          MỘT
          <br />
          PHIÊN BẢN
          <br />
          MỚI.
        </small>
      </div>
    </div>
  );
}