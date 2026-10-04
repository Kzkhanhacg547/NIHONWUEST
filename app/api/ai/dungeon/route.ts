import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { localDateKey } from "@/lib/streak";

// 7 Rotating Daily Themes
const DAILY_THEMES = [
  {
    id: "theme_travel_airport",
    title: "✈️ Du Lịch & Sân Bay Narita",
    japaneseTitle: "成田空港での観光案内 (N3)",
    description: "Xử lý tình huống làm thủ tục check-in, hỏi đường và khai báo hải quan tại sân bay.",
    icon: "✈️",
    bgGradient: "from-sky-900 to-indigo-950",
  },
  {
    id: "theme_ramen_restaurant",
    title: "🍜 Ẩm Thực & Gọi Món Tại Nhà Hàng",
    japaneseTitle: "ラーメン屋での注文 (N3)",
    description: "Gọi đồ ăn, yêu cầu độ mềm của mì ramen và thanh toán tiền tại quán.",
    icon: "🍜",
    bgGradient: "from-amber-900 to-orange-950",
  },
  {
    id: "theme_office_business",
    title: "🏢 Công Sở & Kính Ngữ Keigo N3",
    japaneseTitle: "ビジネス敬語とほうれんそう (N3)",
    description: "Báo cáo tiến độ Horenso và sử dụng Tôn kính ngữ / Khiêm nhường ngữ với sếp.",
    icon: "🏢",
    bgGradient: "from-slate-900 to-blue-950",
  },
  {
    id: "theme_station_transport",
    title: "🚃 Giao Thông & Ga Shinjuku",
    japaneseTitle: "新宿駅での乗換案内 (N3)",
    description: "Mua vé tàu Shinkansen, hỏi ke tàu Yamanote và hỏi thông tin nhân viên ga.",
    icon: "🚃",
    bgGradient: "from-emerald-900 to-teal-950",
  },
  {
    id: "theme_konbini_shopping",
    title: "🛍️ Mua Sắm Konbini Lawson",
    japaneseTitle: "コンビニでの買い物と税 (N3)",
    description: "Thanh toán bằng thẻ IC, hâm nóng bento và xử lý thủ tục miễn thuế Tax-Free.",
    icon: "🛍️",
    bgGradient: "from-purple-900 to-violet-950",
  },
  {
    id: "theme_kyoto_culture",
    title: "⛩️ Văn Hóa & Ngôi Chùa Kyoto",
    japaneseTitle: "京都の文化探訪とマナー (N3)",
    description: "Mua thẻ Omikuji, quy tắc rửa tay chōzuya và mua quà lưu niệm tại Kyoto.",
    icon: "⛩️",
    bgGradient: "from-rose-900 to-red-950",
  },
  {
    id: "theme_pharmacy_health",
    title: "🏥 Y Tế & Đi Bệnh Viện / Nhà Thuốc",
    japaneseTitle: "薬局での症状説明 (N3)",
    description: "Diễn tả triệu chứng đau đầu/sốt nhẹ và hỏi liều lượng uống từ dược sĩ.",
    icon: "🏥",
    bgGradient: "from-teal-900 to-cyan-950",
  },
];

// Pre-defined 5-question sets for each theme (N3 / N4 level)
const THEME_QUESTIONS: Record<string, Array<{
  id: string;
  situationJa: string;
  situationVi: string;
  furigana: string;
  options: Array<{ textJa: string; textVi: string }>;
  correctIndex: number;
  explanation: string;
}>> = {
  theme_travel_airport: [
    {
      id: "q1",
      situationJa: "搭乗手続きの際、係員に「お荷物は預けますか？」と聞かれました。どう答えますか？",
      situationVi: "Khi làm thủ tục lên máy bay, nhân viên hỏi 'Bạn có ký gửi hành lý không?'. Bạn trả lời thế nào?",
      furigana: "とうじょう てつづき の さい、 かかりいん に 「お にもつ は あずけます か？」 と きかれました。",
      options: [
        { textJa: "はい、このスーツケースをお願いします。", textVi: "Vâng, xin nhờ gửi chiếc vali này." },
        { textJa: "いいえ、乗車券を買いたいです。", textVi: "Không, tôi muốn mua vé xe." },
        { textJa: "はい、パスポートを出します。", textVi: "Vâng, tôi xuất trình hộ chiếu." },
        { textJa: "すみません、満員です。", textVi: "Xin lỗi, đã đầy chỗ rồi." },
      ],
      correctIndex: 0,
      explanation: "「荷物を預ける」có nghĩa là ký gửi hành lý. Trả lời 'はい、このスーツケースをお願いします' là chuẩn xác nhất.",
    },
    {
      id: "q2",
      situationJa: "入国審査で「滞在期間はどれくらいですか？」と質問されました。",
      situationVi: "Tại quầy nhập cảnh, bạn được hỏi 'Thời gian lưu trú của bạn là bao lâu?'.",
      furigana: "にゅうこく しんさ で 「たいざい きかん は どれくらい です か？」 と しつもん されました。",
      options: [
        { textJa: "観光目的です。", textVi: "Mục đích là du lịch." },
        { textJa: "1週間ほどの予定です。", textVi: "Dự định khoảng 1 tuần." },
        { textJa: "東京のホテルに泊まります。", textVi: "Tôi ở khách sạn ở Tokyo." },
        { textJa: "昨日到着しました。", textVi: "Tôi đã đến vào ngày hôm qua." },
      ],
      correctIndex: 1,
      explanation: "「滞在期間」là thời gian lưu trú. Trả lời số ngày/tuần như '1週間ほどの予定です' là đúng ngữ cảnh.",
    },
    {
      id: "q3",
      situationJa: "手荷物検査で「ポケットの中身をすべて出してください」と言われました。",
      situationVi: "Tại quầy kiểm tra hành lý, bạn được yêu cầu 'Hãy lấy hết đồ trong túi ra'.",
      furigana: "てにもつ けんさ で 「ポケット の なかみ を すべて だして ください」 と いわれました。",
      options: [
        { textJa: "かしこまりました。スマートフォンと鍵です。", textVi: "Tôi hiểu rồi. Đây là điện thoại và chìa khóa." },
        { textJa: "いいえ、何も買いません。", textVi: "Không, tôi không mua gì cả." },
        { textJa: "飛行機を予約しました。", textVi: "Tôi đã đặt vé máy bay." },
        { textJa: "搭乗口はどこですか？", textVi: "Cổng lên máy bay ở đâu?" },
      ],
      correctIndex: 0,
      explanation: "Lấy đồ trong túi ra và đưa cho nhân viên kiểm tra metal detector.",
    },
    {
      id: "q4",
      situationJa: "搭乗口（ゲート）の変更のアナウンスを聞きました。どう行動しますか？",
      situationVi: "Bạn nghe thấy thông báo đổi cổng lên máy bay (Gate). Bạn nên làm gì?",
      furigana: "とうじょうぐち （ゲート） の へんこう の アナウンス を ききました。",
      options: [
        { textJa: "案内板で新しいゲート番号を確認して移動する。", textVi: "Kiểm tra số cổng mới trên bảng thông báo và di chuyển." },
        { textJa: "そのまま前のゲートで待つ。", textVi: "Cứ tiếp tục đợi ở cổng cũ." },
        { textJa: "荷物を受け取りに行く。", textVi: "Đi lấy lại hành lý." },
        { textJa: "タクシーを呼ぶ。", textVi: "Gọi xe taxi." },
      ],
      correctIndex: 0,
      explanation: "Khi thông báo đổi gate, cần xem bảng điện tử (案内板) để biết gate mới.",
    },
    {
      id: "q5",
      situationJa: "両替所で「円に両替してください」と頼む時、適切な敬語表現はどれですか？",
      situationVi: "Khi đổi tiền tại quầy, câu lịch sự thích hợp để nhờ đổi sang Yên Nhật là gì?",
      furigana: "りょうがえじょ で 「えん に りょうがえ して ください」 と たのむ とき、 てきせつな けいご ひょうげん は どれ です か？",
      options: [
        { textJa: "日本円への両替をお願いできますでしょうか？", textVi: "Xin phiền anh/chị đổi giúp tôi sang Yên Nhật được không ạ?" },
        { textJa: "円に変えてくれ。", textVi: "Đổi sang Yên cho tôi đi." },
        { textJa: "両替するつもりだ。", textVi: "Tôi định đổi tiền." },
        { textJa: "お金を払います。", textVi: "Tôi sẽ trả tiền." },
      ],
      correctIndex: 0,
      explanation: "「～をお願いできますでしょうか？」là mẫu câu lịch sự Keigo chuẩn N3 dùng nhờ vả khách quan.",
    },
  ],
  theme_ramen_restaurant: [
    {
      id: "q1",
      situationJa: "食券機でラーメンを選んだ後、店員に「麺のかたさはどうしますか？」と聞かれました。",
      situationVi: "Sau khi mua vé ở máy, nhân viên hỏi 'Bạn muốn độ cứng của sợi mì thế nào?'.",
      furigana: "しょっけんき で ラーメン を えらんだ あと、 てんいん に 「めん の かたさ は どう します か？」 と きかれました。",
      options: [
        { textJa: "「かため」でお願いします。", textVi: "Cho tôi mì sợi hơi cứng (Katame)." },
        { textJa: "辛くしないでください。", textVi: "Đừng làm cay nhé." },
        { textJa: "大盛りにしてください。", textVi: "Cho bát to tô lớn nhé." },
        { textJa: "水をお願いします。", textVi: "Cho tôi xin nước ạ." },
      ],
      correctIndex: 0,
      explanation: "Độ cứng của mì ramen gồm: かため (cứng), ふつう (vừa), やわらかめ (mềm).",
    },
    {
      id: "q2",
      situationJa: "チャーシューを追加したい時、店員になんと声をかけますか？",
      situationVi: "Khi muốn thêm thịt xá xíu (Chashu), bạn gọi nhân viên như thế nào?",
      furigana: "チャーシュー を ついか したい とき、 てんいん に なんと こえ を かけます か？",
      options: [
        { textJa: "すみません、チャーシューのトッピングを追加できますか？", textVi: "Xin lỗi, tôi có thể gọi thêm topping thịt xá xíu được không?" },
        { textJa: "チャーシューは嫌いです。", textVi: "Tôi ghét thịt xá xíu." },
        { textJa: "スープを全部飲みました。", textVi: "Tôi đã uống hết nước dùng rồi." },
        { textJa: "ごちそうさまでした。", textVi: "Cảm ơn vì bữa ăn." },
      ],
      correctIndex: 0,
      explanation: "Dùng 「～を追加できますか？」 (Có thể gọi thêm... được không?).",
    },
    {
      id: "q3",
      situationJa: "ラーメンを食べ終わった後、感謝を伝える最も自然な挨拶は？",
      situationVi: "Lời chào tự nhiên nhất sau khi ăn xong để cảm ơn nhà hàng là gì?",
      furigana: "ラーメン を たべおわった あと、 かんしゃ を つたえる もっとも しぜんな あいさつ は？",
      options: [
        { textJa: "ごちそうさまでした。美味しかったです！", textVi: "Cảm ơn vì bữa ăn. Rất ngon ạ!" },
        { textJa: "いただきます。", textVi: "Mời mọi người cùng ăn." },
        { textJa: "お邪魔しました。", textVi: "Xin lỗi đã làm phiền." },
        { textJa: "いってらっしゃい。", textVi: "Anh/chị đi nhé." },
      ],
      correctIndex: 0,
      explanation: "Sau khi ăn xong luôn nói 「ごちそうさまでした」.",
    },
    {
      id: "q4",
      situationJa: "「スープの味を濃いめ（こいめ）にする」とはどういう意味ですか？",
      situationVi: "Cụm từ 'スープの味を濃いめにする' có nghĩa là gì?",
      furigana: "「スープ の あじ を こいめ に する」 と は どういう いみ です か？",
      options: [
        { textJa: "Nước dùng đậm đà, vị đậm hơn bình thường.", textVi: "Nước dùng đậm đà, vị đậm hơn bình thường." },
        { textJa: "Nước dùng nhạt bớt.", textVi: "Nước dùng nhạt bớt." },
        { textJa: "Nước dùng thêm đá lạnh.", textVi: "Nước dùng thêm đá lạnh." },
        { textJa: "Nước dùng ít mỡ.", textVi: "Nước dùng ít mỡ." },
      ],
      correctIndex: 0,
      explanation: "濃いめ (Koime) = vị đậm đà hơn.",
    },
    {
      id: "q5",
      situationJa: "替え玉（かえだま）を注文するタイミングはいつが適切ですか？",
      situationVi: "Thời điểm thích hợp để gọi Kaedama (thêm vắt mì) là khi nào?",
      furigana: "かえだま を ちゅうもん する タイミング は いつ が てきせつ です か？",
      options: [
        { textJa: "麺をほぼ食べ終わり、スープが残っている時。", textVi: "Khi đã ăn gần hết mì và nước dùng vẫn còn." },
        { textJa: "店に入る前。", textVi: "Trước khi vào quán." },
        { textJa: "スープを全部飲み干した後。", textVi: "Sau khi đã uống hết sạch nước dùng." },
        { textJa: "会計を済ませた後。", textVi: "Sau khi đã tính tiền xong." },
      ],
      correctIndex: 0,
      explanation: "Kaedama là vắt mì thả vào nước dùng cũ, nên cần giữ lại nước dùng (スープ).",
    },
  ],
  theme_office_business: [
    {
      id: "q1",
      situationJa: "上司に体調不良で遅刻することを連絡します。最も適切な表現は？",
      situationVi: "Báo cáo cho sếp biết mình sẽ đến muộn vì lý do sức khỏe. Câu nào đúng nhất?",
      furigana: "じょうし に たいちょう ふりょう で ちこく する こと を れんらく します。",
      options: [
        { textJa: "体調を崩してしまい、30分ほど遅れて出社いたします。申し訳ございません。", textVi: "Do sức khỏe không tốt, em xin phép đến muộn khoảng 30 phút ạ. Em rất xin lỗi." },
        { textJa: "気分が悪いから後で行くね。", textVi: "Cảm thấy khó chịu nên tẹo nữa tôi đến nhé." },
        { textJa: "遅刻するわ。", textVi: "Tôi đi muộn đấy." },
        { textJa: "休むからよろしく。", textVi: "Tôi nghỉ nhé, phiền anh." },
      ],
      correctIndex: 0,
      explanation: "Dùng Khiêm nhường ngữ 「出社いたします」 và xin lỗi lịch sự 「申し訳ございません」.",
    },
    {
      id: "q2",
      situationJa: "社外の取引先からの電話で、上司の田中部長が不在です。どう対応しますか？",
      situationVi: "Đối tác bên ngoài gọi điện nhưng Trưởng phòng Tanaka vắng mặt. Bạn trả lời thế nào?",
      furigana: "しゃがい の とりひきさき から の でんわ で、 じょうし の たなか ぶちょう が ふざい です。",
      options: [
        { textJa: "あいにく田中は席を外しております。戻りましたら折り返しお電話させましょうか？", textVi: "Thật tiếc Tanaka đang vắng mặt tại bàn. Khi quay lại em xin phép báo anh ấy gọi lại ạ." },
        { textJa: "田中さんは今遊びに行っています。", textVi: "Anh Tanaka đang đi chơi rồi." },
        { textJa: "田中部長様はいらっしゃいません。", textVi: "Trưởng phòng Tanaka-sama không có ở đây." },
        { textJa: "電話を切ってください。", textVi: "Anh cúp máy đi." },
      ],
      correctIndex: 0,
      explanation: "Nói về người công ty mình với đối tác bên ngoài thì KHÔNG thêm 様/部長, gọi thẳng là 田中.",
    },
    {
      id: "q3",
      situationJa: "「ほうれんそう（報連相）」の正しい組み合わせはどれですか？",
      situationVi: "Bộ 3 quy tắc Horenso trong văn hóa doanh nghiệp Nhật Bản gồm những gì?",
      furigana: "「ほうれんそう」 の ただしい くみあわせ は どれ です か？",
      options: [
        { textJa: "報告（ほうこく）・連絡（れんらく）・相談（そうだん）", textVi: "Báo cáo - Liên lạc - Thảo luận (Hōkoku - Renraku - Sōdan)" },
        { textJa: "ほうれん草・トマト・キュウリ", textVi: "Rau bina - Cà chua - Dưa chuột" },
        { textJa: "放送・練習・相談", textVi: "Phát sóng - Luyện tập - Thảo luận" },
        { textJa: "訪問・連絡・掃除", textVi: "Thăm hỏi - Liên lạc - Dọn dẹp" },
      ],
      correctIndex: 0,
      explanation: "Horenso = 報告 (Báo cáo) + 連絡 (Liên lạc) + 相談 (Thảo luận).",
    },
    {
      id: "q4",
      situationJa: "上司から書類の確認を頼まれ、完了した報告をする際の表現は？",
      situationVi: "Khi sếp nhờ kiểm tra tài liệu và bạn báo cáo đã hoàn thành xong.",
      furigana: "じょうし から しょるい の かくにん を たのまれ、 かんりょう した ほうこく を する さい の ひょうげん は？",
      options: [
        { textJa: "ご指示いただいた書類の確認が完了いたしました。ご確認をお願いいたします。", textVi: "Em đã hoàn thành kiểm tra tài liệu theo chỉ đạo. Kính mong sếp xem qua ạ." },
        { textJa: "書類見たよ。問題ない。", textVi: "Xem tài liệu rồi nhé. Không sao." },
        { textJa: "ご苦労様でした。", textVi: "Vất vả cho sếp rồi (dùng sai ngữ cảnh)." },
        { textJa: "勝手に修正しておいた。", textVi: "Tôi tự tiện sửa xong rồi." },
      ],
      correctIndex: 0,
      explanation: "Dùng 「ご指示いただいた」 và Khiêm nhường ngữ 「完了いたしました」.",
    },
    {
      id: "q5",
      situationJa: "退社する際、残業している同僚や上司にかける適切な挨拶は？",
      situationVi: "Lời chào lịch sự trước khi ra về đối với đồng nghiệp/sếp đang tăng ca?",
      furigana: "たいしゃ する さい、 ざんぎょう している どうりょう や じょうし に かける てきせつな あいさつ は？",
      options: [
        { textJa: "お先に失礼いたします。お疲れ様でした。", textVi: "Em xin phép về trước ạ. Anh/chị đã vất vả rồi ạ." },
        { textJa: "バイバイ、また明日！", textVi: "Bye bye, mai gặp lại!" },
        { textJa: "ごちそうさまでした。", textVi: "Cảm ơn vì bữa ăn." },
        { textJa: "いってきます！", textVi: "Em đi đây!" },
      ],
      correctIndex: 0,
      explanation: "Khi ra về trước luôn chào 「お先に失礼いたします」.",
    },
  ],
  theme_station_transport: [
    {
      id: "q1",
      situationJa: "駅で「山手線はどのホームですか？」と駅員に尋ねます。",
      situationVi: "Bạn hỏi nhân viên ga 'Tuyến Yamanote Line ở ke tàu (platform) số mấy?'.",
      furigana: "えき で 「やまのてせん は どの ホーム です か？」 と えきいん に たずねます。",
      options: [
        { textJa: "すみません、山手線の乗り場は何番ホームでしょうか？", textVi: "Xin lỗi, bến đỗ tuyến Yamanote là ke tàu số mấy ạ?" },
        { textJa: "山手線はどこへ行きますか？", textVi: "Tuyến Yamanote đi đâu vậy?" },
        { textJa: "切符を安くしてください。", textVi: "Giảm giá vé cho tôi đi." },
        { textJa: "電車を止めてください。", textVi: "Dừng tàu lại đi." },
      ],
      correctIndex: 0,
      explanation: "Hỏi ke tàu dùng 「何番ホームでしょうか？」.",
    },
    {
      id: "q2",
      situationJa: "「各駅停車（かくえきていしゃ）」と「特急（とっきゅう）」の違いは？",
      situationVi: "Sự khác biệt giữa Kakueki-teisha (Tàu dừng mọi ga) và Tokkyū (Tàu tốc hành)?",
      furigana: "「かくえきていしゃ」 と 「とっきゅう」 の ちがい は？",
      options: [
        { textJa: "各駅停車はすべての駅に止まり、特急は主要な駅のみに止まる。", textVi: "Tàu Kakueki dừng mọi station, còn Tokkyū chỉ dừng ở các station chính." },
        { textJa: "特急の方が遅い。", textVi: "Tàu Tokkyū chậm hơn." },
        { textJa: "各駅停車は無料である。", textVi: "Tàu Kakueki miễn phí." },
        { textJa: "どちらも同じ速さである。", textVi: "Cả hai có cùng tốc độ." },
      ],
      correctIndex: 0,
      explanation: "各駅停車 dừng ở tất cả các ga, 特急 là tàu tốc hành nhanh hơn.",
    },
    {
      id: "q3",
      situationJa: "ICカードの残高が足りず改札でピンポーンと鳴りました。どうしますか？",
      situationVi: "Thẻ IC không đủ tiền và cửa soát vé kêu bíp bíp đỏ. Bạn cần làm gì?",
      furigana: "ICカード の ざんだか が たりず かいさつ で ピンポーン と なりました。",
      options: [
        { textJa: "精算機（チャージ機）でチャージ（入金）する。", textVi: "Nạp thêm tiền vào thẻ tại máy nạp Seisanki/Charge." },
        { textJa: "改札を飛び越える。", textVi: "Nhảy qua rào soát vé." },
        { textJa: "カードを捨てる。", textVi: "Vứt thẻ đi." },
        { textJa: "そのまま無視して歩く。", textVi: "Bỏ qua cứ thế đi tiếp." },
      ],
      correctIndex: 0,
      explanation: "Dùng máy 精算機 (Seisanki) để nạp thêm tiền (チャージ).",
    },
    {
      id: "q4",
      situationJa: "電車内で「優先席（ゆうせんせき）」付近で配慮すべきマナーは？",
      situationVi: "Văn hóa ứng xử cần chú ý tại khu vực Ghế ưu tiên (Yūsenseki) trên tàu?",
      furigana: "でんしゃない で 「ゆうせんせき」 ふきん で はいりょ すべき マナー は？",
      options: [
        { textJa: "お年寄りや妊婦に席を譲り、混雑時は携帯の電源を切るかマナーモードにする。", textVi: "Nhường ghế cho người già/bà bầu và để điện thoại chế độ im lặng." },
        { textJa: "大きな声で電話する。", textVi: "Nói chuyện điện thoại to tiếng." },
        { textJa: "荷物を席に広げる。", textVi: "Bày hành lý lên ghế." },
        { textJa: "音楽をスピーカーで流す。", textVi: "Bật nhạc loa ngoài." },
      ],
      correctIndex: 0,
      explanation: "Ưu tiên nhường ghế và giữ trật tự im lặng trên tàu.",
    },
    {
      id: "q5",
      situationJa: "「振替輸送（ふりかえゆそう）」という案内が出ました。どういう状態ですか？",
      situationVi: "Thông báo '振替輸送' (Vận chuyển chuyển tiếp) xuất hiện có nghĩa là gì?",
      furigana: "「ふりかえ ゆそう」 という あんない が でました。",
      options: [
        { textJa: "事故等で運転見合わせのため、他社の路線を迂回利用できる状態。", textVi: "Tàu tạm dừng do sự cố, hành khách được chuyển sang dùng tạm tuyến tàu hãng khác." },
        { textJa: "全線無料キャンペーン中。", textVi: "Đang có chiến dịch miễn phí toàn tuyến." },
        { textJa: "終電が早まった。", textVi: "Chuyến tàu cuối chạy sớm hơn." },
        { textJa: "新幹線が全席指定になった。", textVi: "Shinkansen đổi sang vé đặt trước." },
      ],
      correctIndex: 0,
      explanation: "振替輸送 cho phép lấy vé bị hoãn di chuyển sang tuyến tàu của hãng đối tác.",
    },
  ],
  theme_konbini_shopping: [
    {
      id: "q1",
      situationJa: "コンビニのお弁当を買う時、店員に「温めますか？」と聞かれました。",
      situationVi: "Khi mua cơm bento ở Konbini, nhân viên hỏi 'Bạn có muốn hâm nóng không?'.",
      furigana: "コンビニ の おべんとう を かう とき、 てんいん に 「あたたためます か？」 と きかれました。",
      options: [
        { textJa: "はい、お願いします。", textVi: "Vâng, nhờ anh/chị hâm nóng giúp ạ." },
        { textJa: "いいえ、スプーンはいりません。", textVi: "Không, tôi không cần thìa." },
        { textJa: "ポイントカードがあります。", textVi: "Tôi có thẻ tích điểm." },
        { textJa: "袋はいりません。", textVi: "Tôi không cần túi." },
      ],
      correctIndex: 0,
      explanation: "「温めますか？」là hỏi hâm nóng thức ăn bằng lò vi sóng.",
    },
    {
      id: "q2",
      situationJa: "「レジ袋はご利用ですか？」と聞かれ、マイバッグを持っているので断る表現は？",
      situationVi: "Nhân viên hỏi có lấy túi nilon không. Bạn có túi riêng nên từ chối thế nào?",
      furigana: "「レジぶくろ は ごりよう です か？」 と きかれ、 マイバッグ を もっている ので ことわる ひょうげん は？",
      options: [
        { textJa: "袋は大丈夫です（結構です）。持っています。", textVi: "Tôi không cần túi đâu ạ. Tôi có mang túi riêng rồi." },
        { textJa: "袋を3枚ください。", textVi: "Cho tôi 3 cái túi." },
        { textJa: "レジ袋は高いです。", textVi: "Túi nilon đắt quá." },
        { textJa: "温めてください。", textVi: "Hâm nóng giúp tôi." },
      ],
      correctIndex: 0,
      explanation: "Từ chối túi nilon dùng 「袋は結構です / 大丈夫です」.",
    },
    {
      id: "q3",
      situationJa: "Suicaなどのタッチ決済で支払いたい時の申し出方は？",
      situationVi: "Cách báo nhân viên thu ngân bạn muốn thanh toán bằng chạm thẻ Suica?",
      furigana: "Suica など の タッチ けっさい で しはらいたい とき の もうしでかた は？",
      options: [
        { textJa: "「交通系ICでお願いします」と言って端末にタッチする。", textVi: "Nói 'Cho tôi trả bằng thẻ Kōtsū-kei IC' và chạm thẻ vào máy." },
        { textJa: "「現金で払います」と言う。", textVi: "Nói 'Tôi trả bằng tiền mặt'." },
        { textJa: "カードを投げつける。", textVi: "Ném thẻ lên bàn." },
        { textJa: "何も言わずに去る。", textVi: "Không nói gì rồi bỏ đi." },
      ],
      correctIndex: 0,
      explanation: "Suica/Pasmo thuộc nhóm 交通系IC (Kōtsū-kei IC).",
    },
    {
      id: "q4",
      situationJa: "「免税（Tax-Free）」の手続きをしたい場合に必要な持ち物は？",
      situationVi: "Giấy tờ bắt buộc phải trình khi làm thủ tục Miễn thuế Tax-Free là gì?",
      furigana: "「めんぜい」 の てつづき を したい ばあい に ひつような もちもの は？",
      options: [
        { textJa: "パスポート（旅券）の originale", textVi: "Hộ chiếu bản gốc (Passport)." },
        { textJa: "日本の運転免許証", textVi: "Bằng lái xe Nhật Bản." },
        { textJa: "学生証", textVi: "Thẻ học sinh sinh viên." },
        { textJa: "名刺", textVi: "Danh thiếp." },
      ],
      correctIndex: 0,
      explanation: "Thủ tục 免税 bắt buộc xuất trình パスポート (Passport).",
    },
    {
      id: "q5",
      situationJa: "「賞味期限（しょうみきげん）」と「消費期限（しょうひきげん）」の違いは？",
      situationVi: "Phân biệt Shōmi-kigen (Hạn thưởng thức ngon nhất) và Shōhi-kigen (Hạn sử dụng an toàn)?",
      furigana: "「しょうみ きげん」 と 「しょうひ きげん」 の ちがい は？",
      options: [
        { textJa: "賞味期限は美味しく食べられる期限、消費期限は me 期限切れで食べてはいけない期限。", textVi: "Shōmi-kigen là hạn ăn ngon nhất, Shōhi-kigen là hạn an toàn tuyệt đối không nên ăn sau ngày đó." },
        { textJa: "どちらも全く同じ意味。", textVi: "Cả hai hoàn toàn cùng ý nghĩa." },
        { textJa: "賞味期限の方が厳しい。", textVi: "Shōmi-kigen nghiêm ngặt hơn." },
        { textJa: "消費期限は服のサイズのこと。", textVi: "Shōhi-kigen là kích cỡ quần áo." },
      ],
      correctIndex: 0,
      explanation: "賞味期限 = Best before (vẫn ăn được sau đó); 消費期限 = Expiry date (hạn dùng an toàn).",
    },
  ],
  theme_kyoto_culture: [
    {
      id: "q1",
      situationJa: "神社でお参りする前の手水舎（ちょうずや）での正しい作法は？",
      situationVi: "Nghi thức làm sạch đúng cách tại Chōzuya trước khi vào bái lễ ở Đền Shinto?",
      furigana: "じんじゃ で おまいり する まえ の ちょうずや で の ただしい さほう は？",
      options: [
        { textJa: "柄杓（ひしゃく）で水をすくい、左手→右手→口→柄杓の柄の順で清める。", textVi: "Rửa tay trái -> tay phải -> súc miệng -> rửa cán gáo." },
        { textJa: "水に飛び込んで泳ぐ。", textVi: "Nhảy xuống nước bơi." },
        { textJa: "柄杓に直接口をつけて水を飲む。", textVi: "Ghé trực tiếp miệng vào gáo uống nước." },
        { textJa: "足を洗う。", textVi: "Rửa chân." },
      ],
      correctIndex: 0,
      explanation: "Quy tắc rửa sạch: Tay trái → Tay phải → Súc miệng → Rửa gáo.",
    },
    {
      id: "q2",
      situationJa: "おみくじを引いて「大吉（だいきち）」が出ました。どういう意味ですか？",
      situationVi: "Rút được quẻ Omikuji ghi 'Đại Cát' (大吉) có nghĩa là gì?",
      furigana: "おみくじ を ひいて 「だいきち」 が でました。",
      options: [
        { textJa: "最も良い運勢（Very good luck）。", textVi: "Vận may tốt nhất (Very good luck)." },
        { textJa: "大凶（Bad luck）。", textVi: "Xui xẻo nhất." },
        { textJa: "普通。 kiền", textVi: "Bình thường." },
        { textJa: "やり直し。", textVi: "Rút lại." },
      ],
      correctIndex: 0,
      explanation: "大吉 (Daikichi) = quẻ đại may mắn.",
    },
    {
      id: "q3",
      situationJa: "お寺の拝観で「土足禁止（どそくきんし）」と書かれています。",
      situationVi: "Biển báo '土足禁止' tại điện thờ Chùa có nghĩa là gì?",
      furigana: "おてら の はいかん で 「どそく きんし」 と かかれています。",
      options: [
        { textJa: "靴を脱いで上がる必要がある。", textVi: "Cần cởi giày trước khi bước lên." },
        { textJa: "靴のまま入ってよい。", textVi: "Được phép đi nguyên giày vào." },
        { textJa: "写真撮影禁止。", textVi: "Cấm chụp ảnh." },
        { textJa: "大声禁止。", textVi: "Cấm nói to." },
      ],
      correctIndex: 0,
      explanation: "土足禁止 = Cấm đi giày dép vào trong.",
    },
    {
      id: "q4",
      situationJa: "神社での参拝の作法「二礼二拍手一礼」の順番は？",
      situationVi: "Thứ tự nghi lễ bái nguyện 'Nirai Nipakushu Ichirai' ở Đền Shinto là gì?",
      furigana: "じんじゃ で の さんぱい の さほう 「にれい にはくしゅ いちれい」 の じゅんばん は？",
      options: [
        { textJa: "2回深くお辞儀 → 2回手を叩く → 1回お辞儀する。", textVi: "Cúi đầu 2 lần -> Vỗ tay 2 lần -> Cúi đầu 1 lần." },
        { textJa: "2回手を叩く → 2回お辞儀する。", textVi: "Vỗ tay 2 lần -> Cúi đầu 2 lần." },
        { textJa: "歌を歌う。", textVi: "Hát một bài." },
        { textJa: "1回お辞儀 → 5回手を叩く。", textVi: "Cúi đầu 1 lần -> Vỗ tay 5 lần." },
      ],
      correctIndex: 0,
      explanation: "2 lần cúi chào (二礼) → 2 lần vỗ tay (二拍手) → 1 lần cúi chào (一礼).",
    },
    {
      id: "q5",
      situationJa: "舞妓（まいこ）さんを街で見かけた時のマナーとして正しいものは？",
      situationVi: "Ứng xử lịch sự khi gặp Maiko trên phố Kyoto?",
      furigana: "まいこ さん を まち で みかけた とき の マナー として ただしい もの は？",
      options: [
        { textJa: "着物を引っ張ったり通せんぼせず、遠くから静かに見守る（無断撮影NG）。", textVi: "Không kéo áo hay chắn đường, giữ khoảng cách quan sát lịch sự (Cấm chụp ảnh đường phố tự tiện)." },
        { textJa: "追いかけて一緒に自撮りする。", textVi: "Đuổi theo ôm chụp ảnh selfie." },
        { textJa: "袖を引っ張る。", textVi: "Kéo tay áo." },
        { textJa: "大声で呼び止める。", textVi: "Hét to gọi lại." },
      ],
      correctIndex: 0,
      explanation: "Tôn trọng quyền riêng tư của Maiko, không sờ áo hay chắn đường.",
    },
  ],
  theme_pharmacy_health: [
    {
      id: "q1",
      situationJa: "ドラッグストアで「頭痛がするので頭痛薬をください」と伝える表現は？",
      situationVi: "Nói với dược sĩ nhà thuốc 'Tôi bị đau đầu, cho tôi xin thuốc đau đầu'.",
      furigana: "ドラッグストア で 「ずつう が する ので ずつうやく を ください」 と つたえる ひょうげん は？",
      options: [
        { textJa: "頭が痛いので、頭痛薬（ずつうやく）をいただけますか？", textVi: "Tôi bị đau đầu, anh/chị cho tôi mua thuốc đau đầu được không ạ?" },
        { textJa: "お腹が痛いです。", textVi: "Tôi bị đau bụng." },
        { textJa: "目薬をください。", textVi: "Cho tôi thuốc nhỏ mắt." },
        { textJa: "絆創膏はどこですか？", textVi: "Băng cá nhân ở đâu?" },
      ],
      correctIndex: 0,
      explanation: "頭痛薬 (Zutsūyaku) là thuốc trị đau đầu.",
    },
    {
      id: "q2",
      situationJa: "薬の服用方法「食後（しょくご）に服用」とはいつ飲むことですか？",
      situationVi: "Hướng dẫn uống thuốc '食後に服用' có nghĩa là uống vào lúc nào?",
      furigana: "くすり の ふくよう ほうほう 「しょくご に ふくよう」 と は いつ のむ こと です か？",
      options: [
        { textJa: "ご飯を食べた後（30分以内）。", textVi: "Sau khi ăn cơm xong (Trong vòng 30 phút)." },
        { textJa: "ご飯を食べる前。", textVi: "Trước khi ăn cơm." },
        { textJa: "寝る直前。", textVi: "Ngay trước khi đi ngủ." },
        { textJa: "運動した後。", textVi: "Sau khi tập thể dục." },
      ],
      correctIndex: 0,
      explanation: "食後 (Shokugo) = Sau khi ăn.",
    },
    {
      id: "q3",
      situationJa: "薬剤師に「アレルギーはありますか？」と質問されました。",
      situationVi: "Dược sĩ hỏi 'Bạn có bị dị ứng thuốc gì không?'.",
      furigana: "やくざいし に 「アレルギー は あります か？」 と しつもん されました。",
      options: [
        { textJa: "いいえ、特にありません（または、卵アレルギーがあります）。", textVi: "Không, em không bị dị ứng gì (Hoặc: Em bị dị ứng trứng ạ)." },
        { textJa: "はい、風邪をひいています。", textVi: "Vâng, em đang bị cảm." },
        { textJa: "熱は38度あります。", textVi: "Nhiệt độ 38 độ." },
        { textJa: "保険証を持っています。", textVi: "Tôi có thẻ bảo hiểm." },
      ],
      correctIndex: 0,
      explanation: "Trả lời dị ứng thuốc/thức ăn cụ thể hoặc nói 「特にありません」.",
    },
    {
      id: "q4",
      situationJa: "「1日3回、1回2錠（じょう）」の正しい服用法は？",
      situationVi: "Cách uống thuốc đúng theo chỉ dẫn '1日3回、1回2錠' là gì?",
      furigana: "「1にち 3かい、 1かい 2じょう」 の ただしい ふくようほう は？",
      options: [
        { textJa: "1日に3回、毎回2粒ずつ飲む。", textVi: "Một ngày uống 3 lần, mỗi lần uống 2 viên." },
        { textJa: "3日で2錠飲む。", textVi: "3 ngày uống 2 viên." },
        { textJa: "1回に6錠まとめて飲む。", textVi: "Uống dồn 1 lần 6 viên." },
        { textJa: "1日2回、毎回3粒飲む。", textVi: "Một ngày 2 lần, mỗi lần 3 viên." },
      ],
      correctIndex: 0,
      explanation: "1日3回 (1 ngày 3 lần), 1回2錠 (mỗi lần 2 viên).",
    },
    {
      id: "q5",
      situationJa: "処方箋（しょほうせん）を提出して薬を受け取る場所は？",
      situationVi: "Nơi nộp đơn thuốc (Shohōsen) để lấy thuốc kê đơn là đâu?",
      furigana: "しょほうせん を ていしゅつ して くすり を うけとる ばしょ は？",
      options: [
        { textJa: "調剤薬局（ちょうざいやっきょく）", textVi: "Nhà thuốc kê đơn (Chōzai Yakkyoku)" },
        { textJa: "スーパーのレジ", textVi: "Thu ngân siêu thị" },
        { textJa: "郵便局", textVi: "Bưu điện" },
        { textJa: "交番", textVi: "Đồn cảnh sát Kōban" },
      ],
      correctIndex: 0,
      explanation: "Đơn thuốc do bác sĩ kê cần đem đến 調剤薬局 (Chōzai Yakkyoku).",
    },
  ],
};

export async function GET(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Calculate today's theme using local date key
  const now = new Date();
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { timezone: true } });
  const dateKey = localDateKey(now, user?.timezone ?? "UTC");

  // Day of year or day index calculation
  const dayNum = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
  const themeIndex = Math.abs(dayNum) % DAILY_THEMES.length;
  const theme = DAILY_THEMES[themeIndex];
  const questions = THEME_QUESTIONS[theme.id] || THEME_QUESTIONS.theme_travel_airport;

  // Check if completed today
  const existingCompletion = await prisma.xpTransaction.findFirst({
    where: {
      userId,
      reason: "SENSEI_DAILY_DUNGEON",
      referenceId: `dungeon_${dateKey}`,
    },
  });

  // Calculate streak from local storage / transactions
  const recentDungeonTxs = await prisma.xpTransaction.findMany({
    where: { userId, reason: "SENSEI_DAILY_DUNGEON" },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  // Calculate consecutive days streak
  let currentStreak = 0;
  if (recentDungeonTxs.length > 0) {
    const dates = Array.from(
      new Set(
        recentDungeonTxs.map((tx) =>
          localDateKey(new Date(tx.createdAt), user?.timezone ?? "UTC")
        )
      )
    );
    let checkDate = new Date(now);
    for (let i = 0; i < 30; i++) {
      const dKey = localDateKey(checkDate, user?.timezone ?? "UTC");
      if (dates.includes(dKey)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0) {
        // If not completed today yet, check yesterday
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Shuffle options for each question to ensure fair distribution across A, B, C, D
  const randomizedQuestions = questions.map((q) => {
    const optsWithCorrect = q.options.map((opt, idx) => ({
      opt,
      isCorrect: idx === q.correctIndex,
    }));

    // Fisher-Yates shuffle
    for (let i = optsWithCorrect.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optsWithCorrect[i], optsWithCorrect[j]] = [optsWithCorrect[j], optsWithCorrect[i]];
    }

    return {
      ...q,
      options: optsWithCorrect.map((item) => item.opt),
      correctIndex: optsWithCorrect.findIndex((item) => item.isCorrect),
    };
  });

  return NextResponse.json({
    dateKey,
    theme,
    questions: randomizedQuestions,
    isCompletedToday: !!existingCompletion,
    streak: currentStreak,
    totalThemes: DAILY_THEMES.length,
  });
}
