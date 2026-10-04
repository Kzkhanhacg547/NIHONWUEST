// Personalization engine — builds a learning path (lộ trình) from the 5
// onboarding answers. Pure functions only: no DB, no React. The API layer
// (app/api/learning-path) enriches modules with real lesson rows/progress.

export const JLPT_LEVELS = ["BEGINNER", "N5", "N4", "N3"] as const;
export const LEARNING_GOALS = ["TRAVEL", "JLPT", "CONVERSATION", "CULTURE"] as const;
export const FOCUS_SKILLS = ["BALANCED", "LISTENING", "SPEAKING", "READING", "WRITING"] as const;
export const LEARNING_STYLES = ["STRUCTURED", "IMMERSIVE", "GAMIFIED", "PRACTICAL"] as const;

export type ModuleKind =
  | "KANA"
  | "LESSON"
  | "VOCAB"
  | "GRAMMAR"
  | "REVIEW"
  | "SURVIVAL"
  | "JOURNEY"
  | "SENSEI"
  | "MOCK";

export interface PathModule {
  id: string;
  kind: ModuleKind;
  /** Lesson slug — used by LESSON / MOCK modules to resolve real content. */
  slug?: string;
  /** App route the module opens. */
  target: string;
  title: string;
  description: string;
  minutes: number;
  xp: number;
  skills: string[];
  /** Why this module is in the path, tied to the user's answers. */
  why: string;
}

export interface LearningPath {
  pathId: string;
  name: string;
  tagline: string;
  answers: {
    levelLabel: string;
    goalLabel: string;
    skillLabel: string;
    styleLabel: string;
    dailyMinutes: number;
  };
  modulesPerWeek: number;
  estWeeks: number;
  totalMinutes: number;
  totalXP: number;
  modules: PathModule[];
  rationale: string[];
}

export interface PersonalizationAnswers {
  level: string; // BEGINNER | N5 | N4 | N3
  goal: string; // TRAVEL | JLPT | CONVERSATION | CULTURE
  dailyGoalMinutes: number;
  focusSkill: string; // BALANCED | LISTENING | SPEAKING | READING | WRITING
  learningStyle: string; // STRUCTURED | IMMERSIVE | GAMIFIED | PRACTICAL
}

export const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Mới bắt đầu",
  N5: "N5",
  N4: "N4",
  N3: "N3",
};

export const GOAL_LABELS: Record<string, string> = {
  TRAVEL: "Du lịch",
  JLPT: "Thi JLPT",
  CONVERSATION: "Giao tiếp",
  CULTURE: "Văn hóa",
};

export const SKILL_LABELS: Record<string, string> = {
  BALANCED: "Toàn diện",
  LISTENING: "Nghe",
  SPEAKING: "Nói",
  READING: "Đọc",
  WRITING: "Viết",
};

export const STYLE_LABELS: Record<string, string> = {
  STRUCTURED: "Bài bản",
  IMMERSIVE: "Nhập vai",
  GAMIFIED: "Phiêu lưu",
  PRACTICAL: "Thực chiến",
};

export const DAILY_MINUTES_OPTIONS = [10, 15, 30, 60] as const;

const GOAL_BASE_NAME: Record<string, string> = {
  TRAVEL: "Sinh tồn du lịch",
  JLPT: "Chinh phục JLPT",
  CONVERSATION: "Giao tiếp tự tin",
  CULTURE: "Thấm nhuần văn hóa",
};

const STYLE_SUFFIX: Record<string, string> = {
  STRUCTURED: "bài bản",
  IMMERSIVE: "nhập vai",
  GAMIFIED: "phiêu lưu",
  PRACTICAL: "thực chiến",
};

function norm(v: string, allowed: readonly string[], fallback: string): string {
  return allowed.includes(v) ? v : fallback;
}

function minutesForDailyGoal(minutes: number): number {
  // A module is sized to fit the user's daily budget (rounded to 5s).
  const m = Math.min(60, Math.max(10, Math.round(minutes / 5) * 5));
  return m;
}

// ---------------------------------------------------------------------------
// Module catalog — slugs/titles mirror prisma/seed-data lessons exactly so the
// API layer can resolve them against the DB. Minutes/xp are fallback values
// used only when a slug is missing from the DB.
// ---------------------------------------------------------------------------

interface CatalogEntry {
  slug?: string;
  kind: ModuleKind;
  target: string;
  title: string;
  description: string;
  minutes: number;
  xp: number;
  skills: string[];
  tags: string[]; // goal/skill tags used for selection
}

const K = (
  slug: string | undefined,
  kind: ModuleKind,
  target: string,
  title: string,
  description: string,
  minutes: number,
  skills: string[],
  tags: string[],
  xp = 50,
): CatalogEntry => ({ slug, kind, target, title, description, minutes, xp, skills, tags });

// --- Foundations (BEGINNER / N5) ---
const KANA_HIRA = K(undefined, "KANA", "/app/learn", "Bảng 50 âm Hiragana Gojūon", "Luyện đọc, viết 46 ký tự Hiragana cơ bản trên canvas với âm thanh chuẩn.", 20, ["Đọc", "Viết"], ["foundations", "writing", "reading"]);
const KANA_KATA = K(undefined, "KANA", "/app/learn", "Katakana & Từ mượn quốc tế", "Nhận diện Katakana và từ mượn Gairaigo trong đời sống.", 20, ["Đọc", "Viết"], ["foundations", "writing", "reading"]);
const DAKUTEN = K("dakuten-handakuten", "LESSON", "/app/practice/dakuten-handakuten", "Biến âm đục & bán đục", "が・ざ・だ・ば và ぱ — phân biệt nghĩa bằng âm đục.", 15, ["Đọc", "Nghe"], ["foundations", "listening"]);
const YOON = K("yoon-sokuon-chouon", "LESSON", "/app/practice/yoon-sokuon-chouon", "Ảo âm, âm ngắt & trường âm", "きゃ・しゃ・ちゃ, っ và âm kéo dài — những lỗi phát âm phổ biến.", 15, ["Đọc", "Nghe"], ["foundations", "listening"]);

// --- N5 conversation core (Minna sequence) ---
const GREETINGS = K("daily-greetings-culture", "LESSON", "/app/practice/daily-greetings-culture", "Chào hỏi hàng ngày & Văn hóa cúi chào Ojigi", "Konnichiwa, Ohayou, Arigatou cùng quy tắc lễ nghĩa Nhật Bản.", 15, ["Nói", "Nghe"], ["travel", "conversation", "culture", "speaking"]);
const SELF_INTRO = K("self-introduction-grammar", "LESSON", "/app/practice/self-introduction-grammar", "Giới thiệu bản thân (です・じゃありません)", "Tên, quốc tịch, nghề nghiệp — câu đầu tiên bạn cần nói.", 15, ["Nói", "Đọc"], ["conversation", "travel", "speaking", "reading"]);
const KORE_SORE = K("minna-lesson-02-kore-sore-are", "LESSON", "/app/practice/minna-lesson-02-kore-sore-are", "Đại từ chỉ thị (これ・それ・あれ・どれ)", "Chỉ đồ vật gần/xa — cực hữu dụng khi mua sắm.", 15, ["Đọc", "Nói"], ["travel", "conversation", "speaking"]);
const KOKO_SOKO = K("minna-lesson-03-koko-soko-asoko", "LESSON", "/app/practice/minna-lesson-03-koko-soko-asoko", "Vị trí & chỉ hướng (ここ・そこ・どこ)", "Hỏi đường, chỉ địa điểm tại ga, khách sạn, cửa hàng.", 15, ["Đọc", "Nghe"], ["travel", "listening"]);
const TIME_VERBS = K("minna-lesson-04-time-and-verbs", "LESSON", "/app/practice/minna-lesson-04-time-and-verbs", "Thời gian, giờ giấc & chia thì (ます・ました)", "Hẹn giờ, đặt lịch — nền tảng động từ tiếng Nhật.", 20, ["Đọc", "Viết"], ["jlpt", "foundations"]);
const MOVEMENT = K("minna-lesson-05-movement-verbs", "LESSON", "/app/practice/minna-lesson-05-movement-verbs", "Di chuyển & đi lại (行きます・来ます・帰ります)", "Đi, đến, về — bộ động từ dùng mỗi ngày khi du lịch.", 15, ["Đọc", "Nói"], ["travel", "conversation", "speaking"]);
const ACTIONS = K("minna-lesson-06-actions-and-objects", "LESSON", "/app/practice/minna-lesson-06-actions-and-objects", "Tân ngữ & nơi chốn (〜を / 〜で)", "Cấu trúc câu cơ bản: ai làm gì ở đâu.", 15, ["Đọc", "Viết"], ["jlpt", "foundations"]);
const INVITATIONS = K("minna-lesson-06-invitations", "LESSON", "/app/practice/minna-lesson-06-invitations", "Lời mời lịch sự (〜ませんか・〜ましょう)", "Rủ bạn bè, đề nghị cùng làm — giao tiếp tự nhiên.", 15, ["Nói", "Nghe"], ["conversation", "speaking"]);
const I_ADJ = K("minna-lesson-08-i-adjectives", "LESSON", "/app/practice/minna-lesson-08-i-adjectives", "Tính từ đuôi い (đặc điểm, phủ định, quá khứ)", "Mô tả đồ vật, con người — cao/siêu/rẻ/đắt.", 15, ["Đọc", "Viết"], ["jlpt", "conversation"]);
const NA_ADJ = K("minna-lesson-08-09-na-adj-preferences", "LESSON", "/app/practice/minna-lesson-08-09-na-adj-preferences", "Tính từ đuôi な & Sở thích (すき・上手)", "Nói bạn thích gì, giỏi gì — chất liệu trò chuyện.", 15, ["Nói", "Đọc"], ["conversation", "speaking", "jlpt"]);
const ARIMASU = K("minna-lesson-10-arimasu-imasu", "LESSON", "/app/practice/minna-lesson-10-arimasu-imasu", "Sự tồn tại (あります・います) & trợ từ に", "Có/không có đồ vật, sinh vật ở đâu.", 15, ["Đọc", "Viết"], ["jlpt", "foundations"]);
const COUNTERS = K("minna-lesson-11-counters-quantifiers", "LESSON", "/app/practice/minna-lesson-11-counters-quantifiers", "Lượng từ & đơn vị đếm", "ひとつ・〜人・〜本 — đặt hàng, đếm đồ khi mua sắm.", 15, ["Đọc", "Nghe"], ["travel", "jlpt", "listening"]);
const TE_FORM = K("minna-lesson-14-te-form-rules", "LESSON", "/app/practice/minna-lesson-14-te-form-rules", "Thể Te (て形) — quy tắc 3 nhóm động từ", "Chìa khóa nối câu, yêu cầu và xin phép.", 20, ["Đọc", "Viết"], ["jlpt", "foundations", "conversation"]);
const TE_REQUESTS = K("minna-lesson-14-requests-and-progressive", "LESSON", "/app/practice/minna-lesson-14-requests-and-progressive", "Yêu cầu lịch sự (〜てください) & đang diễn ra", "「写真を撮ってもいいですか」— xin phép, yêu cầu khi du lịch.", 15, ["Nói", "Nghe"], ["travel", "conversation", "speaking"]);
const NAI_FORM = K("minna-lesson-17-nai-form-prohibition", "LESSON", "/app/practice/minna-lesson-17-nai-form-prohibition", "Thể Nai (ない形) & câu phủ định", "Nói không, từ chối — kỹ năng giao tiếp thiết yếu.", 15, ["Đọc", "Nói"], ["jlpt", "conversation"]);
const JISHO = K("minna-lesson-18-dictionary-form-ability", "LESSON", "/app/practice/minna-lesson-18-dictionary-form-ability", "Thể từ điển (辞書形) & khả năng (〜ことができる)", "Nói «tôi có thể…» — thể ngắn gọn trong hội thoại.", 15, ["Đọc", "Nói"], ["jlpt", "conversation"]);
const TA_FORM = K("minna-lesson-19-ta-form-experience", "LESSON", "/app/practice/minna-lesson-19-ta-form-experience", "Thể Ta (た形) & kinh nghiệm (〜たことがある)", "Kể chuyện quá khứ, chia sẻ trải nghiệm du lịch.", 15, ["Nói", "Đọc"], ["conversation", "jlpt", "speaking"]);
const PLAIN_FORM = K("minna-lesson-20-plain-form", "LESSON", "/app/practice/minna-lesson-20-plain-form", "Thể thông thường (普通形) & đàm thoại thân mật", "Nói tự nhiên như người bản xứ với bạn bè.", 15, ["Nói", "Nghe"], ["conversation", "speaking"]);
const CONDITIONALS = K("minna-lesson-23-25-conditionals", "LESSON", "/app/practice/minna-lesson-23-25-conditionals", "Khi (〜とき), điều kiện (〜と・〜たら・〜ても)", "Câu điều kiện — «nếu… thì…» trong mọi tình huống.", 20, ["Đọc", "Viết"], ["jlpt", "foundations"]);

// --- N5 skill builders ---
const KANJI_NUM = K("n5-kanji-numbers-nature", "LESSON", "/app/practice/n5-kanji-numbers-nature", "Số đếm, lịch & tự nhiên", "一〜万, 日月年, 山川木 — Kanji N5 tập 1.", 15, ["Viết", "Đọc"], ["jlpt", "writing", "reading"]);
const KANJI_PEOPLE = K("n5-kanji-people-body", "LESSON", "/app/practice/n5-kanji-people-body", "Con người, gia đình & cơ thể", "人子女人, 父母, 目手足 — Kanji N5 tập 2.", 15, ["Viết", "Đọc"], ["jlpt", "writing", "reading"]);
const KANJI_VERBS = K("n5-kanji-verbs-places", "LESSON", "/app/practice/n5-kanji-verbs-places", "Động từ đời sống & nơi chốn", "行来帰食飲, 駅車 — Kanji N5 tập 3.", 15, ["Viết", "Đọc"], ["jlpt", "writing", "reading"]);
const KANJI_ADJ = K("n5-kanji-adjectives-opposites", "LESSON", "/app/practice/n5-kanji-adjectives-opposites", "Cặp tính từ trái nghĩa", "大/小, 高/安, 新/古 — Kanji N5 tập 4.", 15, ["Viết", "Đọc"], ["jlpt", "writing", "reading"]);
const PARTICLES = K("n5-grammar-10-core-particles", "LESSON", "/app/practice/n5-grammar-10-core-particles", "10 trợ từ cốt lõi", "は・が・を・に・で・へ・と・から・まで・より — xương sống câu Nhật.", 20, ["Đọc", "Viết"], ["jlpt", "foundations"]);
const VERB_CONJ = K("n5-grammar-verb-conjugation-master", "LESSON", "/app/practice/n5-grammar-verb-conjugation-master", "Bảng chia 5 thể động từ", "Masu・Te・Nai・Ta・Jisho — tổng ôn chia động từ.", 25, ["Viết", "Đọc"], ["jlpt", "writing"]);
const READ_SIGNS = K("n5-reading-notices-signs", "LESSON", "/app/practice/n5-reading-notices-signs", "Đọc hiểu: bảng tin, thông báo & thực đơn", "Đọc biển hiệu, giờ mở cửa, thực đơn nhà hàng.", 15, ["Đọc"], ["jlpt", "reading", "travel"]);
const READ_EMAILS = K("n5-reading-emails-messages", "LESSON", "/app/practice/n5-reading-emails-messages", "Đọc hiểu: email, tin nhắn & nhật ký", "Đọc thư mời, tin nhắn ngắn — kỹ năng đọc thực tế.", 15, ["Đọc"], ["jlpt", "reading"]);
const LISTENING_N5 = K("n5-listening-conversations", "LESSON", "/app/practice/n5-listening-conversations", "Nghe hiểu: Konbini, ga tàu & phản xạ đời sống", "Nghe hội thoại ngắn tại cửa hàng, nhà ga.", 15, ["Nghe"], ["jlpt", "listening", "travel"]);
const MOCK_N5 = K("n5-jlpt-mock-test-comprehensive", "LESSON", "/app/practice/n5-jlpt-mock-test-comprehensive", "Đề thi thử toàn diện JLPT N5", "Mô phỏng 4 kỹ năng Moji・Goi・Bunpou・Dokkai.", 30, ["Đọc", "Nghe"], ["jlpt", "mock"]);

// --- Survival / immersive / AI / journey / review ---
const SURVIVAL = K(undefined, "SURVIVAL", "/app/survival", "Survival Mode — Sinh tồn thực chiến", "Test phản xạ từ vựng & xử lý tình huống giao tiếp có thời gian thực.", 10, ["Nghe", "Nói"], ["travel", "conversation", "practical", "immersive", "listening", "speaking"]);
const SENSEI = K(undefined, "SENSEI", "/app/sensei", "AI Kaiwa Sensei — Hội thoại AI", "Luyện đối thoại 2 chiều với giáo viên AI, không sợ sai.", 15, ["Nói", "Nghe"], ["conversation", "immersive", "speaking", "listening"]);
const JOURNEY = K(undefined, "JOURNEY", "/app/journey", "Hành trình Shinkansen — Mở khóa địa danh", "Thuật XP mở khóa Tokyo → Kyoto → Osaka trên bản đồ Nhật Bản.", 10, ["Ôn tập"], ["gamified", "immersive"]);
const REVIEW_SRS = K(undefined, "REVIEW", "/app/review", "Ôn tập SRS SM-2", "Thuật toán lặp lại ngắt quãng — chống quên lâu dài.", 10, ["Ôn tập"], ["structured", "gamified", "practical", "writing"]);
const VOCAB_N5 = K(undefined, "VOCAB", "/app/vocabulary", "Kho từ vựng N5 — Lưu thẻ SRS", "Tra cứu nghĩa, âm On/Kun, ví dụ ngữ cảnh; lưu thẻ ôn 1 chạm.", 15, ["Đọc", "Viết"], ["jlpt", "travel", "conversation", "reading"]);

// --- N4 ---
const N4_GRAMMAR = [
  K("n4-lesson-26-ndesu", "LESSON", "/app/practice/n4-lesson-26-ndesu", "Giải thích hoàn cảnh 〜んです & nhờ vả 〜んですが", "Nói mềm mại, giải thích lý do — phong cách giao tiếp Nhật.", 15, ["Nói", "Đọc"], ["conversation", "jlpt", "speaking"]),
  K("n4-lesson-27-potential", "LESSON", "/app/practice/n4-lesson-27-potential", "Thể khả năng (可能形) & phân biệt 見える/聞こえる", "«Tôi có thể làm được» — khác 〜ことができます.", 15, ["Đọc", "Viết"], ["jlpt"]),
  K("n4-lesson-28-nagara", "LESSON", "/app/practice/n4-lesson-28-nagara", "Hành động song song 〜ながら & liệt kê 〜し、〜し", "Vừa làm A vừa làm B; nhiều lý do cùng lúc.", 15, ["Đọc", "Nói"], ["conversation", "jlpt"]),
  K("n4-lesson-32-advice-prediction", "LESSON", "/app/practice/n4-lesson-32-advice-prediction", "Lời khuyên 〜ほうがいい & dự đoán 〜でしょう", "Khuyên bảo, phỏng đoán — giao tiếp lịch sự.", 15, ["Nói", "Đọc"], ["conversation", "jlpt"]),
  K("n4-lesson-35-conditionals-ba", "LESSON", "/app/practice/n4-lesson-35-conditionals-ba", "Thể điều kiện 〜ば & càng… càng… 〜ば〜ほど", "Điều kiện trang trọng trong công việc & đời sống.", 15, ["Đọc", "Viết"], ["jlpt"]),
  K("n4-lesson-37-passive-ukemi", "LESSON", "/app/practice/n4-lesson-37-passive-ukemi", "Thể bị động (受身形) & trợ từ に", "«Được làm», «bị làm» — câu bị động tiếng Nhật.", 15, ["Đọc", "Viết"], ["jlpt"]),
  K("n4-lesson-39-node-te-causes", "LESSON", "/app/practice/n4-lesson-39-node-te-causes", "Nguyên nhân 〜ので & thể lỡ lời 〜てしまう", "Giải thích nguyên nhân, xin lỗi khi lỡ làm.", 15, ["Nói", "Đọc"], ["conversation", "jlpt"]),
  K("n4-lesson-40-embedded-questions", "LESSON", "/app/practice/n4-lesson-40-embedded-questions", "Câu hỏi phụ 〜か & thử làm 〜てみます", "Hỏi gián tiếp, dám thử — chất liệu hội thoại.", 15, ["Nói", "Đọc"], ["conversation", "speaking"]),
  K("n4-lesson-41-giving-receiving-keigo", "LESSON", "/app/practice/n4-lesson-41-giving-receiving-keigo", "Cho–nhận kính ngữ (いただきます・くださいます)", "Biểu đạt cho/nhận trong quan hệ xã hội Nhật.", 15, ["Đọc", "Nói"], ["jlpt", "conversation"]),
  K("n4-lesson-42-tame-ni-noni", "LESSON", "/app/practice/n4-lesson-42-tame-ni-noni", "Mục đích 〜ために & tiếc nuối 〜のに", "Để làm gì, đáng lẽ nên… — diễn đạt tinh tế.", 15, ["Đọc", "Viết"], ["jlpt"]),
  K("n4-lesson-48-causative-shieki", "LESSON", "/app/practice/n4-lesson-48-causative-shieki", "Thể sai khiến (使役形) & xin phép lịch sự", "Cho ai làm gì; xin phép trang trọng.", 15, ["Đọc", "Viết"], ["jlpt"]),
  K("n4-lesson-49-respectful-sonkeigo", "LESSON", "/app/practice/n4-lesson-49-respectful-sonkeigo", "Kính ngữ (尊敬語: いらっしゃいます・おっしゃいます)", "Nói về khách hàng, cấp trên — nền tảng Keigo.", 15, ["Nói", "Đọc"], ["jlpt", "conversation"]),
  K("n4-lesson-50-humble-kenjougo", "LESSON", "/app/practice/n4-lesson-50-humble-kenjougo", "Khiêm nhường ngữ (謙譲語) & tổng ôn N4", "Kín đáo về bản thân; ôn tổng lực N4.", 20, ["Đọc", "Nói"], ["jlpt", "mock"]),
  K("n4-baito-interview", "LESSON", "/app/practice/n4-baito-interview", "Phỏng vấn xin việc làm thêm (Baito)", "Tình huống thực tế: phỏng vấn part-time tại Nhật.", 20, ["Nói", "Nghe"], ["conversation", "travel", "practical"]),
  K("n4-apartment-leasing", "LESSON", "/app/practice/n4-apartment-leasing", "Thuê nhà trọ & ký hợp đồng bất động sản", "Đọc hợp đồng, trao đổi với chủ nhà — sống tại Nhật.", 20, ["Đọc", "Viết"], ["practical", "reading"]),
  K("n4-hospital-visit", "LESSON", "/app/practice/n4-hospital-visit", "Khám bệnh tại bệnh viện Nhật Bản", "Mô tả triệu chứng, hiểu chỉ dẫn bác sĩ.", 20, ["Nghe", "Nói"], ["practical", "listening", "speaking", "travel"]),
  K("n4-office-reporting", "LESSON", "/app/practice/n4-office-reporting", "Báo cáo công việc với cấp trên (Horenso)", "報連相 — văn hóa báo cáo, liên lạc, thảo luận.", 20, ["Nói", "Đọc"], ["practical", "conversation"]),
];

// --- N3 ---
const N3_GRAMMAR = [
  K("n3-lesson-1-grammar-foundations", "LESSON", "/app/practice/n3-lesson-1-grammar-foundations", "Cấu trúc N3 cốt lõi: 〜最中に, 〜うちに, 〜代わりに", "Đúng lúc, tranh thủ, thay vì — ngữ pháp N3 nền tảng.", 20, ["Đọc", "Viết"], ["jlpt"]),
  K("n3-lesson-4-grammar-logic-certainty", "LESSON", "/app/practice/n3-lesson-4-grammar-logic-certainty", "Phán đoán logic & phủ định phản bác", "〜に違いない, 〜はずだ, 〜わけがない — chắc chắn & bác bỏ.", 15, ["Đọc", "Nói"], ["jlpt", "conversation"]),
  K("n3-lesson-6-grammar-inability", "LESSON", "/app/practice/n3-lesson-6-grammar-inability", "Không thể & khó khăn (〜ようがない・〜かねる)", "Diễn đạt bất lực, e ngại — sắc thái trung cấp.", 15, ["Đọc", "Viết"], ["jlpt"]),
  K("n3-lesson-7-grammar-moments", "LESSON", "/app/practice/n3-lesson-7-grammar-moments", "Hành động chớp náng 〜た途端に & ý định 〜ようとする", "Vừa… liền…; định làm gì — diễn đạt động thái.", 15, ["Đọc", "Nói"], ["jlpt", "conversation"]),
  K("n3-lesson-10-grammar-keigo", "LESSON", "/app/practice/n3-lesson-10-grammar-keigo", "Kính ngữ N3 nâng cao (お〜です・おいでになる)", "Keigo hoàn thiện cho công sở & giao tiếp trang trọng.", 20, ["Nói", "Đọc"], ["jlpt", "conversation"]),
  K("n3-lesson-11-kanji-politics-economy", "LESSON", "/app/practice/n3-lesson-11-kanji-politics-economy", "Kanji N3 tập 1 — Chính trị, kinh tế & xã hội", "漢字 trung cấp chủ đề thời sự.", 15, ["Viết", "Đọc"], ["jlpt", "writing", "reading"]),
  K("n3-lesson-15-kanji-daily-life", "LESSON", "/app/practice/n3-lesson-15-kanji-daily-life", "Kanji N3 tập 5 — Đời sống, gia đình & tự nhiên", "Kanji chủ đề gần gũi, củng cố vốn Hán tự.", 15, ["Viết", "Đọc"], ["jlpt", "writing", "reading"]),
  K("n3-lesson-16-vocab-frequent-verbs", "LESSON", "/app/practice/n3-lesson-16-vocab-frequent-verbs", "Từ vựng N3 — Động từ tần suất cao", "Động từ trung cấp diễn đạt chính xác ý.", 15, ["Đọc", "Viết"], ["jlpt", "reading"]),
  K("n3-lesson-17-vocab-adjectives-adverbs", "LESSON", "/app/practice/n3-lesson-17-vocab-adjectives-adverbs", "Từ vựng N3 — Tính từ & phó từ tinh tế", "Diễn đạt sắc thái: hơi, khá, vừa phải…", 15, ["Đọc", "Nói"], ["jlpt", "conversation"]),
  K("n3-lesson-19-reading-emails-notices", "LESSON", "/app/practice/n3-lesson-19-reading-emails-notices", "Đọc hiểu N3 — Email công việc & thông báo", "Đọc thư từ, công văn — kỹ năng đọc chuyên nghiệp.", 20, ["Đọc"], ["jlpt", "reading"]),
  K("n3-lesson-21-listening-school-hospital", "LESSON", "/app/practice/n3-lesson-21-listening-school-hospital", "Nghe hiểu & phản xạ N3 — Trường học & bệnh viện", "Nghe đoạn hội thoại dài, bắt ý chính.", 15, ["Nghe"], ["jlpt", "listening"]),
  K("n3-lesson-22-listening-workplace-dialogue", "LESSON", "/app/practice/n3-lesson-22-listening-workplace-dialogue", "Nghe hiểu N3 — Trao đổi ý kiến công ty", "Nghe họp, thảo luận — phản xạ nghe nâng cao.", 15, ["Nghe"], ["jlpt", "listening"]),
  K("n3-lesson-23-jlpt-mock-test-1", "LESSON", "/app/practice/n3-lesson-23-jlpt-mock-test-1", "Đề thi thử JLPT N3 tập 1 — Từ vựng & Hán tự", "Mô phỏng phần Moji・Goi theo chuẩn JLPT.", 25, ["Đọc"], ["jlpt", "mock"]),
  K("n3-lesson-24-jlpt-mock-test-2", "LESSON", "/app/practice/n3-lesson-24-jlpt-mock-test-2", "Đề thi thử JLPT N3 tập 2 — Ngữ pháp & cấu trúc", "Mô phỏng phần Bunpou theo chuẩn JLPT.", 25, ["Đọc"], ["jlpt", "mock"]),
  K("n3-lesson-25-jlpt-mock-test-final", "LESSON", "/app/practice/n3-lesson-25-jlpt-mock-test-final", "Đề thi thử JLPT N3 tập 3 — Tổng hợp 4 kỹ năng", "Đề tổng hợp kiểm tra toàn diện trước kỳ thi.", 30, ["Đọc", "Nghe"], ["jlpt", "mock"]),
  K("n3-workplace-reporting", "LESSON", "/app/practice/n3-workplace-reporting", "Báo cáo tiến độ dự án với quản lý Nhật (Horenso)", "Tình huống công sở thực tế, tiếng Nhật chuyên nghiệp.", 20, ["Nói", "Đọc"], ["practical", "conversation"]),
  K("n3-medical-clinic", "LESSON", "/app/practice/n3-medical-clinic", "Khám bệnh tại phòng khám đa khoa Nhật Bản", "Mô tả triệu chứng phức tạp, hiểu hướng dẫn điều trị.", 20, ["Nghe", "Nói"], ["practical", "listening", "speaking"]),
];

// --- Per-level pools ---
function levelPool(level: string): CatalogEntry[] {
  if (level === "N4") {
    return [
      PARTICLES, TE_FORM, VERB_CONJ, ...N4_GRAMMAR,
      KANJI_PEOPLE, KANJI_VERBS, READ_SIGNS, LISTENING_N5,
    ];
  }
  if (level === "N3") {
    return [
      PARTICLES, VERB_CONJ, CONDITIONALS, ...N3_GRAMMAR,
      KANJI_ADJ, READ_EMAILS, LISTENING_N5,
    ];
  }
  // N5 / BEGINNER
  return [
    KANA_HIRA, KANA_KATA, DAKUTEN, YOON,
    GREETINGS, SELF_INTRO, KORE_SORE, KOKO_SOKO, TIME_VERBS, MOVEMENT,
    ACTIONS, INVITATIONS, I_ADJ, NA_ADJ, ARIMASU, COUNTERS, TE_FORM,
    TE_REQUESTS, NAI_FORM, JISHO, TA_FORM, PLAIN_FORM, CONDITIONALS,
    KANJI_NUM, KANJI_PEOPLE, KANJI_VERBS, KANJI_ADJ,
    PARTICLES, VERB_CONJ, READ_SIGNS, READ_EMAILS, LISTENING_N5, MOCK_N5,
  ];
}

// --- Goal ordering: define the ideal order of tags per goal ---
const GOAL_ORDER: Record<string, string[]> = {
  TRAVEL: ["travel", "foundations", "listening", "practical", "conversation", "reading", "jlpt", "writing", "mock"],
  JLPT: ["foundations", "jlpt", "writing", "reading", "listening", "mock"],
  CONVERSATION: ["conversation", "speaking", "listening", "foundations", "travel", "immersive"],
  CULTURE: ["culture", "foundations", "reading", "conversation", "travel", "jlpt"],
};

const SKILL_PRIORITY: Record<string, string[]> = {
  LISTENING: ["listening", "speaking", "foundations", "travel", "conversation", "reading", "jlpt", "writing", "mock"],
  SPEAKING: ["speaking", "listening", "conversation", "travel", "foundations", "immersive", "practical", "jlpt", "reading", "writing", "mock"],
  READING: ["reading", "foundations", "jlpt", "writing", "listening", "travel", "conversation", "mock"],
  WRITING: ["writing", "foundations", "jlpt", "reading", "conversation", "listening", "travel", "mock"],
  BALANCED: [],
};

function scoreModule(entry: CatalogEntry, goal: string, focusSkill: string, style: string): number {
  let score = 0;
  const goalOrder = GOAL_ORDER[goal] ?? [];
  entry.tags.forEach((tag, i) => {
    const gi = goalOrder.indexOf(tag);
    if (gi >= 0) score += (goalOrder.length - gi) * 10;
    const si = (SKILL_PRIORITY[focusSkill] ?? []).indexOf(tag);
    if (si >= 0) score += (SKILL_PRIORITY[focusSkill].length - si) * 3;
  });
  if (style === "PRACTICAL" && entry.tags.includes("practical")) score += 40;
  if (style === "IMMERSIVE" && entry.tags.includes("immersive")) score += 30;
  if (style === "GAMIFIED" && entry.tags.includes("gamified")) score += 25;
  if (style === "STRUCTURED" && entry.tags.includes("foundations")) score += 15;
  if (focusSkill !== "BALANCED" && entry.skills.some((s) => s === SKILL_LABELS[focusSkill])) score += 50;
  return score;
}

function pick(path: string[], n: number): string[] {
  return path.slice(0, n);
}

// Deterministic 32-bit hash (FNV-1a) for a stable pathId.
function hashString(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

function isRealBeginner(level: string): boolean {
  return level === "BEGINNER";
}

/**
 * Build a complete personalized learning path from the 5 onboarding answers.
 * Deterministic: same answers -> same path (stable pathId).
 */
export function buildLearningPath(input: PersonalizationAnswers): LearningPath {
  const level = norm(input.level, JLPT_LEVELS, "N5");
  const goal = norm(input.goal, LEARNING_GOALS, "TRAVEL");
  const focusSkill = norm(input.focusSkill, FOCUS_SKILLS, "BALANCED");
  const style = norm(input.learningStyle, LEARNING_STYLES, "STRUCTURED");
  const daily = Math.min(180, Math.max(5, Math.round(input.dailyGoalMinutes || 15)));

  const rationale: string[] = [];
  rationale.push(
    `Trình độ ${LEVEL_LABELS[level]} quyết định điểm khởi đầu: ${
      isRealBeginner(level)
        ? "bắt đầu từ bảng 50 âm, chưa cần kiến thức nền"
        : `bỏ qua phần kana cơ bản, đi thẳng vào ngữ pháp & kỹ năng ${LEVEL_LABELS[level]}`
    }.`,
  );
  rationale.push(`Mục tiêu ${GOAL_LABELS[goal]} định hướng trọng tâm nội dung — các mô-đun phù hợp được xếp trước.`);
  rationale.push(`Kỹ năng trọng tâm ${SKILL_LABELS[focusSkill]} được ưu tiên trong mọi giai đoạn.`);
  rationale.push(`Phong cách ${STYLE_LABELS[style]} quyết định cách xen kẽ bài học, thực hành và ôn tập.`);
  rationale.push(`Ngân sách ${daily} phút/ngày → khoảng ${modulesPerWeekFor(daily)} mô-đun/tuần, lộ trình kéo dài tương ứng.`);

  // ---- Phase 1: foundations ----
  const modules: PathModule[] = [];
  const pool = levelPool(level);
  const mid = minutesForDailyGoal(daily);

  const seen = new Set<string>();
  const add = (entry: CatalogEntry, why: string, overrideMinutes?: number) => {
    const key = entry.slug ?? entry.title;
    if (seen.has(key)) return;
    seen.add(key);
    modules.push({
      id: `${entry.kind}-${key}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
      kind: entry.kind,
      slug: entry.slug,
      target: entry.target,
      title: entry.title,
      description: entry.description,
      minutes: overrideMinutes ?? Math.min(entry.minutes, Math.max(10, mid)),
      xp: entry.xp,
      skills: entry.skills,
      why,
    });
  };

  const goalWhy = `Phù hợp mục tiêu ${GOAL_LABELS[goal]} của bạn.`;
  const skillWhy = `Được chọn vì bạn tập trung kỹ năng ${SKILL_LABELS[focusSkill]}.`;
  const styleWhy = `Phong cách ${STYLE_LABELS[style]} của bạn cần bước này.`;

  if (isRealBeginner(level)) {
    add(KANA_HIRA, "Mọi lộ trình cho người mới đều bắt đầu bằng Hiragana — nền tảng đọc viết.");
    add(KANA_KATA, "Katakana mở ra vốn từ mượn quốc tế bạn gặp hằng ngày.");
  }

  // ---- Phase 2: goal-specialized core (sorted by score) ----
  // Foundational modules always precede specialized content,
  // regardless of goal/skill scoring.
  if (level === "N5" || level === "BEGINNER") {
    add(DAKUTEN, "Nền tảng phát âm: biến âm đục là bước tiếp sau kana cơ bản.");
    add(YOON, "Nền tảng phát âm: ảo âm & âm ngắt hoàn thiện bảng 50 âm.");
  } else {
    add(PARTICLES, "Nền tảng ngữ pháp: 10 trợ từ cốt lõi trước khi học cấu trúc nâng cao.");
    add(TE_FORM, "Nền tảng ngữ pháp: thể Te là chìa khóa cho mọi biến thể sau này.");
    add(VERB_CONJ, "Nền tảng ngữ pháp: bảng chia 5 thể — tổng quan trước khi chuyên sâu.");
  }

  const foundational = new Set(
    level === "N5" || level === "BEGINNER"
      ? [DAKUTEN, YOON]
      : [PARTICLES, TE_FORM, VERB_CONJ],
  );

  const scored = levelPool(level)
    .filter((e) => e !== KANA_HIRA && e !== KANA_KATA && !foundational.has(e))
    .map((e) => ({ e, s: scoreModule(e, goal, focusSkill, style) }))
    .sort((a, b) => b.s - a.s);

  // core size scales with time budget
  const coreSize = daily >= 60 ? 12 : daily >= 30 ? 10 : daily >= 15 ? 8 : 6;

  // For PRACTICAL style, force survival into the first core slots
  if (style === "PRACTICAL") {
    add(SURVIVAL, "Bạn chọn phong cách thực chiến — học ngay tình huống giao tiếp đời thực trước.", Math.min(10, mid));
  }

  for (const { e } of scored.slice(0, coreSize)) {
    const whyParts: string[] = [];
    if (e.tags.includes(goal)) whyParts.push(goalWhy);
    if (focusSkill !== "BALANCED" && (e.tags.includes(focusSkill.toLowerCase()) || e.skills.includes(SKILL_LABELS[focusSkill]))) whyParts.push(skillWhy);
    if (!whyParts.length) whyParts.push(`Nằm trong lộ trình ${GOAL_LABELS[goal]} ${LEVEL_LABELS[level]} — trình tự khoa học.`);
    add(e, whyParts.join(" "));
  }

  // ---- Phase 3: style overlay ----
  if (style === "IMMERSIVE") {
    add(JOURNEY, "Nhập vai: mở khóa hành trình Shinkansen song song bài học.", 10);
    add(SENSEI, "Nhập vai: đối thoại thật với AI Sensei để củng cố phản xạ.", 15);
    add(SURVIVAL, "Nhập vai: thử thách sinh tồn tổng lực.", 10);
  } else if (style === "GAMIFIED") {
    add(JOURNEY, "Phiêu lưu: mỗi bài học là một chặng tàu mới trên bản đồ.", 10);
    add(REVIEW_SRS, "Phiêu lưu: chuỗi ngày học (streak) & thẻ SRS củng cố thành quả.", 10);
  } else if (style === "PRACTICAL") {
    add(SENSEI, "Thực chiến: luyện nói với AI trước khi ra thực tế.", 15);
    add(REVIEW_SRS, "Thực chiến: ôn SRS để kiến thức không rơi rớt.", 10);
  } else {
    add(REVIEW_SRS, "Bài bản: ôn tập SRS đúng chu kỳ SM-2 sau mỗi giai đoạn.", 10);
    if (goal === "CONVERSATION" || focusSkill === "SPEAKING") add(SENSEI, "Bài bản: đối thoại AI theo cấu trúc đã học.", 15);
  }

  // ---- Phase 4: skill booster (ensure focus skill is strongly represented) ----
  if (focusSkill === "LISTENING") {
    add(LISTENING_N5, skillWhy);
    add(SURVIVAL, "Nghe phản xạ trong điều kiện thời gian thực.");
  } else if (focusSkill === "SPEAKING") {
    add(SENSEI, skillWhy);
    add(PLAIN_FORM, "Nói tự nhiên hơn với thể thông thường.");
  } else if (focusSkill === "READING") {
    add(READ_SIGNS, skillWhy);
    add(READ_EMAILS, "Đọc tin nhắn, email — kỹ năng đọc thực tế.");
  } else if (focusSkill === "WRITING") {
    add(VERB_CONJ, skillWhy);
    add(KANJI_PEOPLE, "Luyện viết Hán tự tay qua thẻ SRS.");
  }

  // ---- Phase 5: JLPT mock at the end for JLPT goal ----
  if (goal === "JLPT") {
    if (level === "N3") add(N3_GRAMMAR.find((g) => g.slug === "n3-lesson-25-jlpt-mock-test-final")!, "Tổng duyệt trước kỳ thi N3.");
    else if (level === "N4") add(N4_GRAMMAR.find((g) => g.slug === "n4-lesson-50-humble-kenjougo")!, "Tổng ôn N4 trước khi thi.");
    else add(MOCK_N5, "Bài bản: thi thử tổng lực để kiểm tra trình độ.");
  }

  // ---- Phase 6: vocab + journey caps ----
  add(VOCAB_N5, "Từ vựng là chất liệu cho mọi kỹ năng — lưu thẻ SRS mỗi ngày.");
  if (style !== "IMMERSIVE" && style !== "GAMIFIED") add(JOURNEY, "Mở khóa địa danh thưởng cho mỗi giai đoạn hoàn thành.", 10);

  // ---- Pacing ----
  const perWeek = modulesPerWeekFor(daily);
  const totalMinutes = modules.reduce((a, m) => a + m.minutes, 0);
  const totalXP = modules.reduce((a, m) => a + m.xp, 0);
  const estWeeks = Math.max(1, Math.ceil(modules.length / perWeek));

  const pathId = hashString(`${level}|${goal}|${daily}|${focusSkill}|${style}`);

  return {
    pathId,
    name: `${GOAL_BASE_NAME[goal]} — ${STYLE_SUFFIX[style]}`,
    tagline: buildTagline(goal, style, level, focusSkill),
    answers: {
      levelLabel: LEVEL_LABELS[level],
      goalLabel: GOAL_LABELS[goal],
      skillLabel: SKILL_LABELS[focusSkill],
      styleLabel: STYLE_LABELS[style],
      dailyMinutes: daily,
    },
    modulesPerWeek: perWeek,
    estWeeks,
    totalMinutes,
    totalXP,
    modules,
    rationale,
  };
}

function modulesPerWeekFor(daily: number): number {
  if (daily >= 60) return 10;
  if (daily >= 30) return 6;
  if (daily >= 15) return 4;
  return 3;
}

function buildTagline(goal: string, style: string, level: string, skill: string): string {
  const parts: string[] = [];
  if (goal === "TRAVEL") parts.push("từ sân bay đến quán Ramen, bạn tự tin giao tiếp");
  else if (goal === "JLPT") parts.push("học có hệ thống, bám sát cấu trúc đề thi");
  else if (goal === "CONVERSATION") parts.push("phản xạ nghe–nói tự nhiên như người bản xứ");
  else parts.push("hiểu tiếng Nhật qua phim, manga và văn hóa");
  if (style === "PRACTICAL") parts.push("qua tình huống thực tế");
  else if (style === "IMMERSIVE") parts.push("nhúng mình vào môi trường Nhật");
  else if (style === "GAMIFIED") parts.push("mỗi bài học là một chặng phiêu lưu");
  if (skill !== "BALANCED") parts.push(`với trọng tâm kỹ năng ${SKILL_LABELS[skill].toLowerCase()}`);
  return `Lộ trình ${LEVEL_LABELS[level]}: ${parts.join(", ")}.`;
}

/** Answer option catalogs for onboarding UI. */
export const ONBOARDING_QUESTIONS = [
  {
    id: "level",
    label: "Trình độ hiện tại",
    title: "Trình độ hiện tại của bạn là gì?",
    subtitle: "Chọn trình độ phù hợp nhất. Đừng lo lắng, bạn luôn có thể thay đổi sau này.",
  },
  {
    id: "goal",
    label: "Mục tiêu học",
    title: "Mục tiêu học của bạn là gì?",
    subtitle: "Chọn mục tiêu chính để Nihon Quest ưu tiên nội dung phù hợp với bạn.",
  },
  {
    id: "time",
    label: "Thời lượng mỗi ngày",
    title: "Bạn muốn học bao lâu mỗi ngày?",
    subtitle: "Một nhịp học vừa sức sẽ giúp bạn duy trì lâu dài và tiến bộ đều hơn.",
  },
  {
    id: "focusSkill",
    label: "Kỹ năng trọng tâm",
    title: "Kỹ năng nào bạn muốn giỏi nhất?",
    subtitle: "Chọn kỹ năng ưu tiên — lộ trình sẽ sắp xếp nội dung để kỹ năng đó tiến bộ nhanh nhất.",
  },
  {
    id: "learningStyle",
    label: "Phong cách học",
    title: "Bạn thích học theo cách nào?",
    subtitle: "Mỗi phong cách tạo ra một lộ trình với nhịp độ và cách xen kẽ bài học khác nhau.",
  },
] as const;

export const FOCUS_SKILL_OPTIONS = [
  { value: "BALANCED", label: "Toàn diện", desc: "Nghe – nói – đọc – viết cân đối, không lệch pha.", art: "五" },
  { value: "LISTENING", label: "Nghe", desc: "Hiểu tiếng Nhật khi bản xứ nói nhanh, nghe podcast & phim.", art: "耳" },
  { value: "SPEAKING", label: "Nói", desc: "Tự tin mở lời, phát chuẩn và giao tiếp trôi chảy.", art: "話" },
  { value: "READING", label: "Đọc", desc: "Đọc báo, manga, email & tài liệu không cần tra từ điển.", art: "文" },
  { value: "WRITING", label: "Viết", desc: "Viết đúng ngữ pháp, chữ đẹp, làm chủ Hán tự.", art: "書" },
] as const;

export const LEARNING_STYLE_OPTIONS = [
  { value: "STRUCTURED", label: "Học bài bản", desc: "Theo trình tự khoa học, có ôn tập SRS định kỳ.", art: "道" },
  { value: "IMMERSIVE", label: "Nhập vai", desc: "Học như đang sống tại Nhật: tình huống thực + AI hội thoại.", art: "旅" },
  { value: "GAMIFIED", label: "Phiêu lưu", desc: "Mở khóa địa danh, streak & thử thách mỗi ngày.", art: "宝" },
  { value: "PRACTICAL", label: "Thực chiến", desc: "Học ngay kỹ năng sinh tồn, dùng được liền.", art: "戦" },
] as const;

/** Normalize arbitrary stored values into safe engine input. */
export function sanitizeAnswers(raw: {
  level?: string | null;
  goal?: string | null;
  dailyGoalMinutes?: number | null;
  focusSkill?: string | null;
  learningStyle?: string | null;
}): PersonalizationAnswers {
  return {
    level: norm(raw.level ?? "", JLPT_LEVELS, "N5"),
    goal: norm(raw.goal ?? "", LEARNING_GOALS, "TRAVEL"),
    dailyGoalMinutes: Math.min(180, Math.max(5, Math.round(raw.dailyGoalMinutes ?? 15))),
    focusSkill: norm(raw.focusSkill ?? "", FOCUS_SKILLS, "BALANCED"),
    learningStyle: norm(raw.learningStyle ?? "", LEARNING_STYLES, "STRUCTURED"),
  };
}
