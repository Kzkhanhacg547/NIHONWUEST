import { describe, expect, it } from "vitest";
import {
  buildLearningPath,
  sanitizeAnswers,
  type PersonalizationAnswers,
} from "./personalization";

const base: PersonalizationAnswers = {
  level: "N5",
  goal: "TRAVEL",
  dailyGoalMinutes: 15,
  focusSkill: "BALANCED",
  learningStyle: "STRUCTURED",
};

describe("buildLearningPath", () => {
  it("tạo lộ trình với đầy đủ metadata", () => {
    const path = buildLearningPath(base);
    expect(path.modules.length).toBeGreaterThan(8);
    expect(path.pathId).toMatch(/^[0-9a-f]{8}$/);
    expect(path.name).toBeTruthy();
    expect(path.estWeeks).toBeGreaterThan(0);
    expect(path.totalMinutes).toBeGreaterThan(0);
    expect(path.rationale.length).toBe(5);
  });

  it("deterministic: cùng câu trả lời cho cùng pathId", () => {
    expect(buildLearningPath(base).pathId).toBe(buildLearningPath(base).pathId);
  });

  it("trả lời khác nhau tạo lộ trình khác nhau", () => {
    const travel = buildLearningPath(base);
    const jlpt = buildLearningPath({ ...base, goal: "JLPT" });
    expect(travel.pathId).not.toBe(jlpt.pathId);
    expect(travel.name).not.toBe(jlpt.name);
  });

  it("mỗi 5 chiều câu trả lời đều ảnh hưởng pathId", () => {
    const variants: PersonalizationAnswers[] = [
      { ...base, level: "BEGINNER" },
      { ...base, goal: "CONVERSATION" },
      { ...base, dailyGoalMinutes: 60 },
      { ...base, focusSkill: "LISTENING" },
      { ...base, learningStyle: "GAMIFIED" },
    ];
    const ids = new Set(variants.map((v) => buildLearningPath(v).pathId));
    ids.add(buildLearningPath(base).pathId);
    expect(ids.size).toBe(6);
  });

  it("mục tiêu JLPT có mô-đun thi thử ở cuối", () => {
    const path = buildLearningPath({ ...base, goal: "JLPT" });
    const mocks = path.modules.filter((m) => m.kind === "MOCK" || /thi thử|Đề thi/.test(m.title));
    expect(mocks.length).toBeGreaterThan(0);
  });

  it("kỹ năng Nghe đẩy mô-đun nghe lên trước", () => {
    const path = buildLearningPath({ ...base, focusSkill: "LISTENING" });
    const listeningIdx = path.modules.findIndex(
      (m) => m.slug === "n5-listening-conversations",
    );
    const vocabIdx = path.modules.findIndex((m) => m.kind === "VOCAB");
    expect(listeningIdx).toBeGreaterThan(-1);
    expect(vocabIdx).toBeGreaterThan(-1);
    // mô-đun nghe phải đứng trước giai đoạn từ vựng cuối lộ trình
    expect(listeningIdx).toBeLessThan(vocabIdx);
  });

  it("phong cách thực chiến đặt Survival sớm", () => {
    const path = buildLearningPath({ ...base, learningStyle: "PRACTICAL" });
    const survivalIdx = path.modules.findIndex((m) => m.kind === "SURVIVAL");
    expect(survivalIdx).toBeGreaterThan(-1);
    expect(survivalIdx).toBeLessThanOrEqual(3);
  });

  it("mỗi mô-đun có đích đến và lý do", () => {
    const path = buildLearningPath({ ...base, level: "N4" });
    for (const m of path.modules) {
      expect(m.target.startsWith("/app/")).toBe(true);
      expect(m.why.length).toBeGreaterThan(10);
      expect(m.minutes).toBeGreaterThan(0);
    }
  });

  it("trình độ N3 bỏ qua phần kana cơ bản", () => {
    const path = buildLearningPath({ ...base, level: "N3" });
    const titles = path.modules.map((m) => m.title);
    expect(titles.some((t) => /Bảng 50 âm/.test(t))).toBe(false);
    expect(titles.some((t) => /N3/.test(t))).toBe(true);
  });

  it("người mới bắt đầu có kana trước tiên", () => {
    const path = buildLearningPath({ ...base, level: "BEGINNER" });
    expect(path.modules[0].kind).toBe("KANA");
    expect(path.modules[1].kind).toBe("KANA");
  });

  it("ước tính tuần theo ngân sách thời gian", () => {
    const fast = buildLearningPath({ ...base, dailyGoalMinutes: 60 });
    const slow = buildLearningPath({ ...base, dailyGoalMinutes: 10 });
    expect(fast.modulesPerWeek).toBeGreaterThan(slow.modulesPerWeek);
  });
});

describe("sanitizeAnswers", () => {
  it("thay giá trị rỗng/độc bằng mặc định an toàn", () => {
    const out = sanitizeAnswers({ level: "XYZ", goal: null, dailyGoalMinutes: 999, focusSkill: undefined, learningStyle: "" });
    expect(out.level).toBe("N5");
    expect(out.goal).toBe("TRAVEL");
    expect(out.dailyGoalMinutes).toBe(180);
    expect(out.focusSkill).toBe("BALANCED");
    expect(out.learningStyle).toBe("STRUCTURED");
  });
});
