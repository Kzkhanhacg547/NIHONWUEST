// N3 Conversational Scenarios & Grammar Patterns for AI Kaiwa Sensei

export interface KaiwaScenario {
  id: string;
  title: string;
  titleJa: string;
  badge: string;
  icon: string;
  description: string;
  initialMessage: string;
  initialFurigana: string;
  initialMeaning: string;
  systemPrompt: string;
  suggestedReplies: { ja: string; furigana: string; vi: string }[];
  keyGrammar: { pattern: string; meaning: string; example: string }[];
}

export const N3_KAIWA_SCENARIOS: KaiwaScenario[] = [
  {
    id: "business_horenso",
    title: "Giao Tiếp Công Sở & Horenso",
    titleJa: "オフィスでの報告・連絡・相談",
    badge: "Keigo & Business N3",
    icon: "💼",
    description: "Báo cáo tiến độ công việc, xin ý kiến tiền bối và sử dụng thể kính ngữ/lịch sự đúng chuẩn công sở Nhật Bản.",
    initialMessage: "お疲れ様です！今日のプロジェクトの進捗はいかがですか？何か困っていることはありますか？",
    initialFurigana: "おつかれさまです！きょうのプロジェクトのしんちょくはいかがですか？なにかこまっていることはありますか？",
    initialMeaning: "Chào bạn, hôm nay bạn đã vất vả rồi! Tiến độ dự án hôm nay thế nào rồi? Có điều gì đang gặp khó khăn không?",
    systemPrompt: `Bạn là Tanaka Senpai (hoặc Aoi Sensei), tiền bối thân thiện nhưng chỉn chu tại công ty Nhật Bản. 
Trình độ người học: JLPT N3.
Quy tắc trò chuyện:
1. Sử dụng tiếng Nhật lịch sự công sở (Desu/Masu, お〜になる, 〜ていただけないでしょうか, に関して, につきまして).
2. Khi người học trả lời, hãy phản hồi tự nhiên như trong văn phòng thật.
3. Nếu người học dùng từ chưa tự nhiên hoặc sai ngữ pháp, hãy sửa nhẹ và khích lệ.
4. Giữ câu trả lời ngắn gọn, súc tích (2-4 câu) và kết thúc bằng 1 câu hỏi dẫn dắt.`,
    suggestedReplies: [
      {
        ja: "予定通り進んでおりますが、一点だけご相談したいことがございます。",
        furigana: "よていどおりすすんでおりますが、いってんだけごそうだんしたいことがございます。",
        vi: "Dự án đang tiến triển đúng kế hoạch, nhưng em có 1 điểm muốn xin ý kiến anh/chị ạ.",
      },
      {
        ja: "資料の作成が終わったので、一度確認していただけますでしょうか？",
        furigana: "しりょうのさくせいがおわったので、いちどかくにんしていただけますでしょうか？",
        vi: "Em đã soạn xong tài liệu, anh/chị có thể xem qua giúp em một lần được không ạ?",
      },
      {
        ja: "システムのエラーが発生してしまい、少し遅れております。",
        furigana: "システムのえらーがはっせいしてしまい、すこしおくれております。",
        vi: "Do hệ thống phát sinh lỗi nên tiến độ đang bị chậm lại một chút ạ.",
      },
    ],
    keyGrammar: [
      { pattern: "〜に関して (Ni kanshite)", meaning: "Về vấn đề...", example: "この件に関して、ご相談があります。" },
      { pattern: "〜ていただけないでしょうか", meaning: "Xin phép làm ơn...", example: "ご確認していただけないでしょうか。" },
      { pattern: "〜うちに (Uchi ni)", meaning: "Trong lúc/trước khi...", example: "明るいうちに作業を終わらせましょう。" },
    ],
  },
  {
    id: "casual_friends",
    title: "Chém Gió Bạn Bè (Thể Ngắn)",
    titleJa: "友達とのフリートーク（タメ口）",
    badge: "Thể Ngắn & Slang",
    icon: "☕",
    description: "Luyện phản xạ giao tiếp đời thường không khoảng cách với bạn thân người Nhật: thán từ, thể ngắn, slang tự nhiên.",
    initialMessage: "やっほー！週末は何してたの？なんか面白いことあった？",
    initialFurigana: "やっほー！しゅうまつはなにをしてたの？なんかも白いことあった？",
    initialMeaning: "Hé lô! Cuối tuần rồi cậu làm gì đấy? Có chuyện gì vui hay ho không?",
    systemPrompt: `Bạn là Aoi-chan, bạn thân người Nhật trạc tuổi người học.
Trình độ: JLPT N3 thực chiến đời sống.
Quy tắc trò chuyện:
1. Sử dụng thể ngắn (タメ口 - Casual Japanese), thán từ tự nhiên (マジで？, そうなんだ, やばい, めっちゃ, 〜じゃん, 〜っけ).
2. Trò chuyện cởi mở, vui vẻ, hào hứng như bạn thân đi cafe.
3. Kèm theo giải nghĩa ngắn gọn nếu dùng từ lóng hay cụm từ thú vị.`,
    suggestedReplies: [
      {
        ja: "特に何もしてないよ。家でアニメ観てゴロゴロしてた（笑）",
        furigana: "とくになにもしてないよ。いえであにめみてごろごろしてた",
        vi: "Cũng chả làm gì đặc biệt. Ở nhà xem anime rồi nằm lười thôi à (cười)",
      },
      {
        ja: "友達と渋谷で新しいカフェに行ってきた！めっちゃ美味しかったよ！",
        furigana: "ともだちとしぶやであたらしいかふぇにいってきた！めっちゃおいしかったよ！",
        vi: "Tớ vừa cùng bạn đi quán cafe mới ở Shibuya! Ngon dã man luôn!",
      },
      {
        ja: "日本語の勉強に追われてて、どこにも行けなかったんだよね…",
        furigana: "にほんごのべんきょうにおわれてて、どこにもいけなかったんだよね…",
        vi: "Bị ngập đầu trong việc học tiếng Nhật nên tớ chả đi đâu được hết á...",
      },
    ],
    keyGrammar: [
      { pattern: "〜に違いない (Ni chigainai)", meaning: "Chắc chắn là...", example: "美味しいに違いない！" },
      { pattern: "〜わけがない (Wake ga nai)", meaning: "Lẽ nào / Không thể nào...", example: "嘘をつくわけがないよ。" },
      { pattern: "〜てたまらない (Te tamaranai)", meaning: "...không chịu nổi", example: "日本に行きたくてたまらない！" },
    ],
  },
  {
    id: "travel_restaurant",
    title: "Du Lịch & Ẩm Thực Nhật Bản",
    titleJa: "旅行・レストランでの実践会話",
    badge: "Thực Chiến Du Lịch",
    icon: "🍜",
    description: "Nhập vai giải quyết các tình huống gọi món, hỏi đặc sản địa phương, đổi món hoặc hỏi đường tại Tokyo/Kyoto.",
    initialMessage: "いらっしゃいませ！当店のおすすめは特製豚骨ラーメンですが、何か気になるメニューはございますか？",
    initialFurigana: "いらっしゃいませ！とうてんのおすすめはとくせいとんこつらーめんですが、なにかきになるめにゅーはございますか？",
    initialMeaning: "Kính chào quý khách! Món đặc trưng của quán chúng tôi là mì Ramen Tonkotsu đặc biệt, quý khách có đang để ý món nào không ạ?",
    systemPrompt: `Bạn là nhân viên quán ăn / hướng dẫn viên du lịch tại Nhật Bản.
Trình độ: JLPT N3.
Quy tắc:
1. Giao tiếp nhã nhặn, giải thích món ăn, đồ uống, cách đặt món, cách trả tiền, hỏi dị ứng.
2. Tương tác sống động như bối cảnh nhà hàng thực tế.`,
    suggestedReplies: [
      {
        ja: "一番人気の特製豚骨ラーメンを麺硬めでお願いします！",
        furigana: "いちばんにんきのとくせいとんこつらーめんをめんかためでおねがいします！",
        vi: "Cho tôi một tô Ramen Tonkotsu đặc biệt được gọi nhiều nhất, sợi mì nấu vừa tới (hơi cứng) nhé!",
      },
      {
        ja: "すみません、卵アレルギーがあるのですが、卵を抜いていただくことは可能ですか？",
        furigana: "すみません、たまごあれるぎーがあるのですが、たまごをぬいていただくことはかのうですか？",
        vi: "Xin lỗi, tôi bị dị ứng trứng, quán có thể không cho trứng vào giúp tôi được không ạ?",
      },
      {
        ja: "替え玉はいくらですか？後からでも追加注文できますか？",
        furigana: "かえだまはいくらですか？あとからでもついかちゅうもんできますか？",
        vi: "Thêm vắt mì (Kaedama) thì bao nhiêu tiền ạ? Lát nữa tôi gọi thêm sau được không?",
      },
    ],
    keyGrammar: [
      { pattern: "〜たとたん (Ta totan)", meaning: "Vừa mới... thì ngay lập tức", example: "スープを飲んだとたん、感動しました！" },
      { pattern: "〜ことにする (Koto ni suru)", meaning: "Quyết định chọn...", example: "このセットにすることにします。" },
    ],
  },
  {
    id: "n3_grammar_lab",
    title: "Luyện Ngữ Pháp N3 Chuyên Sâu",
    titleJa: "N3文法マスター・特訓道場",
    badge: "N3 Grammar Focus",
    icon: "🎯",
    description: "Tập trung áp dụng các mẫu câu ngữ pháp N3 quan trọng vào giao tiếp tự nhiên và nhận sửa lỗi câu tức thì.",
    initialMessage: "こんにちは！N3の文法を一緒に練習しましょう。今日は「〜わけがない」や「〜に違いない」を使って、何か文を作ってみませんか？",
    initialFurigana: "こんにちは！N3のぶんぽうをいっしょにれんしゅうしましょう。きょうは「〜わけがない」や「〜にちがいない」をつかって、なにかぶんをつくってみませんか？",
    initialMeaning: "Xin chào! Chúng ta hãy cùng luyện ngữ pháp N3 nhé. Hôm nay bạn có muốn thử đặt một câu với 「〜わけがない」(không lý nào) hoặc 「〜に違いない」(chắc chắn là) không?",
    systemPrompt: `Bạn là Aoi Sensei - Chuyên gia luyện thi JLPT N3.
Nhiệm vụ:
1. Đưa ra thử thách đặt câu theo ngữ pháp N3.
2. Phân tích chi tiết câu của học viên: Chỉ ra chỗ đúng, chỗ sai, sắc thái biểu đạt.
3. Cho ví dụ đối chiếu sinh động.`,
    suggestedReplies: [
      {
        ja: "毎日しっかり復習しているんだから、合格できないわけがない！",
        furigana: "まいにちしっかりふくしゅうしているんだから、ごうかくできないわけがない！",
        vi: "Mỗi ngày đều ôn tập kỹ càng như thế này thì lẽ nào lại không đỗ được!",
      },
      {
        ja: "田中さんは日本に10年も住んでいるから、日本語がペラペラに違いない。",
        furigana: "たなかさんはにほんにじゅうねんもすんでいるから、にほんごがぺらぺらにちがいない。",
        vi: "Anh Tanaka đã sống ở Nhật tận 10 năm rồi nên tiếng Nhật chắc chắn là lưu loát như người bản xứ.",
      },
      {
        ja: "「わけがない」と「はずがない」の使い分けを詳しく教えてください。",
        furigana: "「わけがない」と「はずがない」のつかいわけをくわしくおしえてください。",
        vi: "Xin Sensei giải thích chi tiết sự khác nhau giữa 'wake ga nai' và 'hazu ga nai' ạ.",
      },
    ],
    keyGrammar: [
      { pattern: "〜わけがない", meaning: "Lẽ nào lại / Không thể nào có chuyện...", example: "そんな嘘を信じるわけがない。" },
      { pattern: "〜に違いない", meaning: "Chắc chắn là...", example: "彼は犯人に違いない。" },
      { pattern: "〜をはじめ (O hajime)", meaning: "Tiêu biểu là / Trước hết phải kể đến...", example: "東京をはじめ、大都市を巡る。" },
    ],
  },
  {
    id: "free_kaiwa",
    title: "Trò Chuyện Tự Do (Free Kaiwa)",
    titleJa: "自由な日常会話・フリートーク",
    badge: "Giao Tiếp Mở",
    icon: "🌸",
    description: "Trò chuyện cởi mở về bất kỳ đề tài nào bạn yêu thích: Anime, Manga, ẩm thực, cuộc sống tại Nhật hoặc kinh nghiệm học tiếng Nhật.",
    initialMessage: "こんにちは！今日はどんなことについて話したいですか？好きなアニメや日本文化、最近の出来事など、何でも気軽に教えてね！🌸",
    initialFurigana: "こんにちは！きょうはどんなことについて話したいですか？すきなアニメやにほんぶんか、さいきんのできごとなど、なんでもきがるにおしえてね！",
    initialMeaning: "Xin chào! Hôm nay bạn muốn trò chuyện về đề tài gì nào? Anime yêu thích, văn hóa Nhật Bản, hay chuyện dạo gần đây... cứ thoải mái chia sẻ nhé! 🌸",
    systemPrompt: `Bạn là Aoi Sensei, người bạn đồng hành trò chuyện tiếng Nhật N3.
Quy tắc:
1. Lắng nghe cởi mở, phản hồi nhiệt tình, ấm áp.
2. Dùng tiếng Nhật tự nhiên, phong phú từ vựng N3.
3. Luôn khích lệ người học tự tin nói.`,
    suggestedReplies: [
      {
        ja: "最近『葬送のフリーレン』というアニメにハマっていて、セリフがとても感動的でした。",
        furigana: "さいきん『そうそうのふりーれん』というあにめにはまっていて、せりふがとてもかんどうてきでした。",
        vi: "Dạo gần đây tớ đang mê mẩn anime 'Frieren', lời thoại trong phim cảm động thực sự.",
      },
      {
        ja: "日本で一番おすすめの旅行先はどこですか？",
        furigana: "にほんでいちばんおすすめのりょこうさきはどこですか？",
        vi: "Địa điểm du lịch mà Sensei khuyên nên đi nhất ở Nhật là nơi nào ạ?",
      },
      {
        ja: "漢字を覚えるのが苦手なんですが、何か良いコツはありますか？",
        furigana: "かんじをおぼえるのがにがてなんですが、なにかよいこつはありますか？",
        vi: "Em hơi yếu phần nhớ chữ Hán Kanji, Sensei có mẹo hay nào không ạ?",
      },
    ],
    keyGrammar: [
      { pattern: "〜にハマる (Ni hamaru)", meaning: "Mê mẩn / Nghiện (anime, game, món ăn)...", example: "日本のラーメンにハマっている。" },
      { pattern: "〜にとって (Ni totte)", meaning: "Đối với...", example: "私にとって、日本語は宝物です。" },
    ],
  },
];
