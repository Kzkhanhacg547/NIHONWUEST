export const JOURNEY_LOCATIONS = [
  { slug: "tokyo", name: "Tokyo", nameJa: "東京", description: "Thủ đô hoa lệ — Trung tâm kinh tế, văn hóa hiện đại xen lẫn đền đài cổ kính.", order: 0, xpReward: 100, requirementXp: 0 },
  { slug: "kyoto", name: "Kyoto", nameJa: "京都", description: "Cố đô ngàn năm — Trầm mặc với hàng ngàn ngôi chùa thiền tông và nghệ thuật trà đạo.", order: 1, xpReward: 150, requirementXp: 180 },
  { slug: "nara", name: "Nara", nameJa: "奈良", description: "Vùng đất thiêng — Nơi đàn hươu tự do dạo bước bên Đại Phật Todai-ji vĩ đại.", order: 2, xpReward: 180, requirementXp: 380 },
  { slug: "osaka", name: "Osaka", nameJa: "大阪", description: "Nhà bếp quốc dân — Thiên đường ẩm thực đường phố và con người phóng khoáng, hài hước.", order: 3, xpReward: 200, requirementXp: 650 },
  { slug: "nagoya", name: "Nagoya", nameJa: "名古屋", description: "Cái nôi samurai — Thành phố lâu đài cá kình vàng và kỹ nghệ rèn gươm huyền thoại.", order: 4, xpReward: 220, requirementXp: 1000 },
  { slug: "fuji", name: "Fuji & Hakone", nameJa: "富士・箱根", description: "Kỳ quan linh thiêng — Đỉnh núi tuyết biểu tượng nước Nhật soi bóng hồ Ashi và suối khoáng nóng.", order: 5, xpReward: 250, requirementXp: 1400 },
  { slug: "hiroshima", name: "Hiroshima", nameJa: "広島", description: "Thông điệp hòa bình — Cổng Torii đỏ rực rỡ nổi trên mặt biển vịnh đảo Miyajima.", order: 6, xpReward: 280, requirementXp: 1900 },
  { slug: "hokkaido", name: "Hokkaido", nameJa: "北海道", description: "Bắc hải băng tuyết — Xứ sở lễ hội tuyết Sapporo, cánh đồng hoa Furano và cua hoàng đế.", order: 7, xpReward: 320, requirementXp: 2500 },
  { slug: "okinawa", name: "Okinawa", nameJa: "沖縄", description: "Thiên đường biển ngọc — Vương quốc Ryukyu nhiệt đới với điệu đàn Sanshin rộn rã.", order: 8, xpReward: 350, requirementXp: 3200 },
];

export const ACHIEVEMENTS = [
  { key: "first-steps", title: "First Steps", description: "Hoàn tất bước khởi đầu onboarding.", icon: "footprints", xpReward: 20, requirement: "{}" },
  { key: "kana-starter", title: "Kana Starter", description: "Học thuộc 5 ký tự kana đầu tiên.", icon: "kana", xpReward: 30, requirement: "{}" },
  { key: "lesson-complete-1", title: "Lesson Master", description: "Hoàn thành bài học đầu tiên trong khóa.", icon: "book", xpReward: 40, requirement: "{}" },
  { key: "xp-500", title: "Rising Explorer", description: "Đạt mốc 500 tổng điểm kinh nghiệm XP.", icon: "star", xpReward: 50, requirement: "{\"xp\":500}" },
  { key: "tokyo-unlocked", title: "Tokyo Explorer", description: "Hoàn thành đóng dấu chặng Tokyo.", icon: "torii", xpReward: 50, requirement: "{}" },
  { key: "nara-deer", title: "Nara Friend", description: "Khám phá di sản cố đô Nara và hươu thiêng.", icon: "deer", xpReward: 60, requirement: "{}" },
  { key: "fuji-conqueror", title: "Fuji Conqueror", description: "Chiêm ngưỡng đỉnh thiêng núi Phú Sĩ.", icon: "mountain", xpReward: 80, requirement: "{}" },
  { key: "all-japan", title: "Nihon Master", description: "Chinh phục toàn bộ các địa danh trên bản đồ Nhật Bản.", icon: "crown", xpReward: 150, requirement: "{}" },
];

export const DAILY_MISSIONS = [
  { key: "learn-5-kana", title: "Luyện 5 ký tự Kana", description: "Ôn tập hoặc học 5 ký tự Hiragana/Katakana.", xpReward: 20, targetCount: 5, type: "KANA" },
  { key: "complete-1-lesson", title: "Hoàn thành 1 bài học", description: "Vượt qua thử thách một bài học bất kỳ.", xpReward: 30, targetCount: 1, type: "LESSON" },
  { key: "review-10-srs", title: "Ôn tập 10 thẻ SRS", description: "Luyện trí nhớ dài hạn với flashcard thông minh.", xpReward: 25, targetCount: 10, type: "REVIEW" },
];
