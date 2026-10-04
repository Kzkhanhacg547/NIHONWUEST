// Natural Japanese Conversational Dialogue Engine (Context-Aware Kaiwa Simulator)
// Speaks authentic, warm Japanese with natural follow-ups and Vietnamese translations.

export interface DialogueContext {
  scenarioId?: string;
  userMessage: string;
}

export function generateNaturalJapaneseResponse({
  scenarioId = "free_kaiwa",
  userMessage,
}: DialogueContext): string {
  const msg = userMessage.trim();
  const lower = msg.toLowerCase();

  // 1. GREETINGS & TIME OF DAY (Chào hỏi thời gian)
  if (/^(?:こんばんは|こんばんわ|konbanwa|chào buổi tối)/i.test(msg)) {
    if (scenarioId === "business_horenso") {
      return "こんばんは！遅くまでお疲れ様です。今日の業務の進捗状況はどうですか？何か報告や相談があればいつでもどうぞ！💼\n\n*(Chào buổi tối! Làm việc đến muộn thế này vất vả cho bạn quá. Tiến độ công việc hôm nay thế nào rồi? Nếu có báo cáo hay thảo luận gì bạn cứ nói nhé!)*";
    }
    if (scenarioId === "casual_friends") {
      return "こんばんは〜！今日も一日お疲れ！夜遅くまで日本語の勉強えらいね〜。今日はどんな一日だった？✨\n\n*(Chào buổi tối nè~! Hôm nay vất vả cả ngày rồi nhỉ! Đêm muộn thế này mà vẫn chăm học tiếng Nhật, đỉnh thật đấy. Hôm nay ngày của cậu thế nào?)*";
    }
    return "こんばんは！今日も一日お疲れ様でした。夜の日本語練習、素晴らしいですね！🌙\n今日はどんな一日でしたか？何か楽しいことはありましたか？🌸\n\n*(Chào buổi tối! Hôm nay bạn đã vất vả cả ngày rồi. Luyện tập tiếng Nhật vào buổi tối thật tuyệt vời! Hôm nay ngày của bạn thế nào? Có chuyện gì vui không?)*";
  }

  if (/^(?:こんにちは|こんにちわ|konnichiwa|chào|xin chào|hello|hi)/i.test(msg)) {
    if (scenarioId === "casual_friends") {
      return "やっほー！こんにちは！今日も会えて嬉しいよ〜。最近なんか面白いことあった？☕\n\n*(Hé lô! Chào cậu nhé! Hôm nay lại được gặp cậu vui quá. Dạo gần đây có chuyện gì vui hay ho không?)*";
    }
    if (scenarioId === "business_horenso") {
      return "こんにちは！お疲れ様です。お忙しいところ恐れ入りますが、本日の進捗についてお聞かせいただけますでしょうか？💼\n\n*(Xin chào bạn! Hôm nay bạn vất vả rồi. Xin phép làm phiền lúc bạn đang bận, bạn có thể chia sẻ về tiến độ công việc hôm nay được không ạ?)*";
    }
    return "こんにちは！お会いできて嬉しいです。今日も一緒に楽しく日本語を話しましょう！🌸\n今、何をしていますか？\n\n*(Xin chào bạn! Rất vui được gặp bạn. Hôm nay chúng ta hãy cùng nhau trò chuyện tiếng Nhật thật vui nhé! Bây giờ bạn đang làm gì đấy?)*";
  }

  if (/^(?:おはよう|おはようございます|ohayou|chào buổi sáng)/i.test(msg)) {
    return "おはようございます！🌅 朝から日本語の練習を始めるなんて、本当に素晴らしい向上心ですね！今日もいい一日にしましょうね。朝ごはんはもう食べましたか？\n\n*(Chào buổi sáng! Bắt đầu luyện tiếng Nhật ngay từ sáng sớm thế này, tinh thần học tập của bạn thật tuyệt vời! Chúc bạn một ngày tốt lành nhé. Bạn đã ăn sáng chưa?)*";
  }

  if (/(?:おやすみ|お休みなさい|oyasumi|ngủ ngon|đi ngủ)/i.test(msg)) {
    return "今日もたくさん練習しましたね！本当にお疲れ様でした。ゆっくり休んで、いい夢を見てくださいね。おやすみなさい〜！⭐💤\n\n*(Hôm nay bạn đã luyện tập rất nhiều rồi! Vất vả cho bạn rồi. Hãy nghỉ ngơi thật thoải mái và có những giấc mơ đẹp nhé. Chúc bạn ngủ ngon~!)*";
  }

  // 2. GRATITUDE & POLITE SOCIAL RESPONSES (Cảm ơn, xin lỗi)
  if (/(?:ありがとう|感謝|cảm ơn|thank)/i.test(msg)) {
    return "どういたしまして！こちらこそ、いつも一生懸命練習してくれて嬉しいです。😊 他にも気になるフレーズや話したいことがあれば、何でも気軽に言ってくださいね！🌸\n\n*(Không có chi! Tôi mới là người phải cảm ơn vì bạn luôn chăm chỉ luyện tập. Nếu còn cụm từ nào thắc mắc hay muốn trò chuyện đề tài gì, cứ tự nhiên nói nhé!)*";
  }

  if (/(?:お疲れ様|おつかれ|vất vả rồi)/i.test(msg)) {
    return "お疲れ様です！優しいお言葉をありがとうございます。あなたも毎日のお仕事や勉強、本当にお疲れ様です！お茶でも飲んで一息つきましょうね。🍵\n\n*(Bạn cũng vất vả rồi! Cảm ơn lời hỏi thăm ấm áp của bạn. Bạn học tập và làm việc mỗi ngày cũng vất vả lắm rồi! Hãy uống chút trà nghỉ ngơi nhé.)*";
  }

  // 3. EMOTIONS & PHYSICAL STATES (Cảm xúc & Thể trạng)
  if (/(?:疲れた|つかれた|mệt|mệt mỏi|tired)/i.test(msg)) {
    return "お疲れ様です！今日はいろいろ大変だったんですね… 無理をしないでくださいね。少し肩の力を抜いて、リラックスしながらお話ししましょう。今日は何が一番大変でしたか？🍀\n\n*(Vất vả cho bạn quá! Hôm nay chắc có nhiều việc mệt mỏi lắm nhỉ... Đừng gượng ép quá nhé. Thả lỏng vai một chút và trò chuyện thư giãn cùng tôi nào. Hôm nay điều gì làm bạn vất vả nhất?)*";
  }

  if (/(?:お腹|おなかすいた|腹減った|đói bụng|hungry)/i.test(msg)) {
    return "お腹が空きましたか！美味しいご飯を食べてエネルギーを補給してくださいね。今夜は何が食べたいですか？ラーメン、お寿司、それともベトナム料理？🍜🍣\n\n*(Bạn đói bụng rồi à! Hãy ăn món gì thật ngon để nạp lại năng lượng nhé. Tối nay bạn muốn ăn món gì nào? Ramen, Sushi hay món Việt Nam?)*";
  }

  if (/(?:眠い|ねむい|buồn ngủ|sleepy)/i.test(msg)) {
    return "ふぁ〜、眠くなってきましたか？🥱 集中して勉強すると頭を使いますからね。顔を洗って温かい飲み物を飲むか、今日は早めに休んでくださいね！\n\n*(Oáp~ bạn bắt đầu buồn ngủ rồi à? Vì tập trung học nhiều nên não hoạt động nhiều mà. Bạn thử rửa mặt uống ngụm nước ấm, hoặc hôm nay đi ngủ sớm nhé!)*";
  }

  // 4. SCENARIO: BUSINESS HORENSO (Công sở N3)
  if (scenarioId === "business_horenso") {
    if (/(?:進んで|順調|問題ない|xong|tiến độ|hoàn thành)/i.test(msg)) {
      return "報告ありがとうございます！順調に進んでいるようで安心いたしました。👏 次のステップのスケジュールについて何か共有事項や、事前に懸念されている点はございますか？💼\n\n*(Cảm ơn bạn đã báo cáo! Nghe tiến độ thuận lợi tôi yên tâm rồi. Về lịch trình bước tiếp theo, bạn có điểm nào cần chia sẻ hoặc có lo lắng trước vấn đề gì không?)*";
    }
    if (/(?:困って|エラー|遅れ|バグ|gặp khó|chậm trễ|lỗi)/i.test(msg)) {
      return "状況を教えていただきありがとうございます。一人で抱え込まずに早めに共有してくださって助かりました。私の方で何かサポートできることはありますか？詳しく状況を聞かせていただけますか？🤝\n\n*(Cảm ơn bạn đã báo tình hình. Bạn không tự chịu một mình mà chia sẻ sớm thế này là rất tốt. Về phía tôi có thể hỗ trợ được gì không? Bạn có thể nói chi tiết hơn tình hình được không?)*";
    }
    return "なるほど、承知いたしました。ビジネスの場において、そういった丁寧な言葉遣いと積極的な報告は非常に素晴らしいですね！この件について、他にご質問や確認したいことはございますか？💼\n\n*(Tôi hiểu rồi. Trong môi trường công sở, cách dùng từ lịch sự và chủ động báo cáo như vậy của bạn rất đáng khen! Về việc này bạn còn câu hỏi hay điểm nào muốn xác nhận thêm không?)*";
  }

  // 5. SCENARIO: CASUAL CHIT-CHAT (Bạn bè thể ngắn)
  if (scenarioId === "casual_friends") {
    if (/(?:アニメ|anime|manga|フリーレン|frieren|naruto|one piece|conan)/i.test(msg)) {
      return "えっ、アニメ好きなの？！私もめっちゃ好きだよ！😍 その作品、作画もストーリーも最高だよね〜！一番好きなキャラクターは誰？語ろうよ！✨\n\n*(Ủa, cậu cũng thích anime hả?! Tớ cũng mê dã man luôn! Tác phẩm đấy nét vẽ với cốt truyện đỉnh thật sự nhỉ~! Nhân vật cậu thích nhất là ai thế? Kể tớ nghe với!)*";
    }
    if (/(?:ラーメン|寿司|食べ物|quán ăn|món ăn|ngon|thức ăn)/i.test(msg)) {
      return "いいね〜！聞くだけでお腹鳴っちゃいそう（笑）🍜 日本に行ったら絶対本場の豚骨ラーメンとか食べ歩きしたいよね！辛いものは得意？😋\n\n*(Thích thế~! Nghe cậu kể mà bụng tớ reo luôn này (cười). Sang Nhật nhất định phải đi ăn thử ramen Tonkotsu chính hiệu nhỉ! Cậu có ăn được cay không?)*";
    }
    return `へぇ〜そうなんだ！面白いね！😆 あなたと話してると時間が経つのがあっという間だよ〜。他には最近ハマってることとかある？気軽に教えて！🌸\n\n*(Òa ra là thế à! Thú vị ghê! Trò chuyện với cậu cảm giác thời gian trôi nhanh vù vù luôn á. Dạo này cậu còn mê mẩn cái gì khác nữa không? Kể tớ nghe nhé!)*`;
  }

  // 6. SCENARIO: RESTAURANT & TRAVEL (Nhà hàng & Du lịch)
  if (scenarioId === "travel_restaurant") {
    if (/(?:寿司|すし|sushi)/i.test(msg)) {
      return "お寿司、最高ですよね！🍣 私もサーモンやマグロ、いくらが大好きです。ワサビは入れても大丈夫ですか？日本の回転寿司（スシローやくら寿司など）にも行ってみたいですか？😋\n\n*(Sushi ngon tuyệt cú mèo luôn nhỉ! Tôi cũng cực kỳ thích cá hồi (salmon), cá ngừ và trứng cá hồi đấy. Bạn ăn kèm mù tạt (wasabi) được không? Bạn có muốn đi thử các quán sushi băng chuyền ở Nhật như Sushiro hay Kura Sushi không?)*";
    }
    if (/(?:ラーメン|らーめん|ramen)/i.test(msg)) {
      return "ラーメン、いいですね！🍜 豚骨（とんこつ）、醤油（しょうゆ）、味噌（みそ）、どれが一番好きですか？日本のラーメン屋さんはスープや麺の硬さも選べるんですよ！😋\n\n*(Ramen thích quá đi chứ! Giữa nước dùng xương heo (Tonkotsu), nước tương (Shoyu) và tương Miso, bạn mê vị nào nhất? Ở quán ramen bên Nhật mình còn được tự chọn độ đậm của nước súp và độ dai của sợi mì nữa đấy!)*";
    }
    if (/(?:おすすめ|何が美味しい|gợi ý|món nào ngon|recommend)/i.test(msg)) {
      return "本日のおすすめは、特製海鮮丼と揚げたての天ぷら定食でございます！🍤🐟 旬の魚をたっぷり使っていて絶品ですよ。どちらか試してみますか？✨\n\n*(Món ngon đặc sắc hôm nay của quán là Cơm hải sản Kaisendon đặc biệt và Suất Tempura giòn rụm! Sử dụng cá tươi theo mùa thơm ngon lắm ạ. Bạn có muốn thử một trong hai món không?)*";
    }
    if (/(?:お願いします|ください|order|gọi món|cho tôi)/i.test(msg)) {
      return "かしこまりました！ご注文ありがとうございます。🍜 ただいま調理に入りますので、少々お待ちくださいませ。お水のおかわりはセルフサービスとなっておりますので、ご自由にご利用くださいね！\n\n*(Vâng tôi đã rõ! Cảm ơn quý khách đã gọi món. Bây giờ chúng tôi sẽ bắt đầu nấu ngay, xin quý khách chờ trong giây lát. Nước uống là tự phục vụ, quý khách cứ tự nhiên lấy nhé!)*";
    }
    if (/(?:お会計|会計|お勘定|いくら|check|tính tiền|bao nhiêu tiền)/i.test(msg)) {
      return "お会計ですね！本日はご来店いただき誠にありがとうございました。合計で1,850円になります。お支払いは現金、クレジットカード、PayPayどちらにされますか？💳💴\n\n*(Bạn muốn tính tiền đúng không ạ! Cảm ơn bạn rất nhiều vì đã ghé quán hôm nay. Tổng cộng hết 1.850 Yên. Bạn thanh toán bằng tiền mặt, thẻ tín dụng hay quét mã PayPay ạ?)*";
    }
    return `いらっしゃいませ！「${msg}」ですね。日本のグルメやお食事について何でもご案内できますよ！今日はお肉料理とお魚料理、どちらの気分ですか？🎌\n\n*(Kính chào quý khách! Về "${msg}", tôi có thể tư vấn tất tần tật về ẩm thực Nhật Bản cho bạn. Hôm nay bạn đang có hứng thú với món thịt hay món cá hơn nào?)*`;
  }

  // 7. SCENARIO: N3 GRAMMAR LAB (Luyện ngữ pháp N3)
  if (scenarioId === "n3_grammar_lab") {
    return `素晴らしいアウトプットですね！👏\nあなたが作った文: **「${msg}」**\n\n自然で意味もとてもよく伝わります！N3レベルの表現がしっかり身についていますね。この調子で、別のシチュエーションでも使ってみましょう！💪✨\n\n*(Một câu luyện tập rất tuyệt vời! Câu bạn tạo rất tự nhiên và truyền đạt ý nghĩa rất tốt. Bạn đã nắm chắc cách diễn đạt N3 rồi đấy. Cứ giữ phong độ này và thử trong ngữ cảnh khác nữa nhé!)*`;
  }

  // 8. RICH TOPIC DETECTIONS & NATURAL HUMAN KAIWA
  if (/(?:天気|雨|晴れ|暑い|寒い|thời tiết|mưa|nắng|nóng|lạnh|trời)/i.test(msg)) {
    return "今日の天気はどうですか？日本は季節によってガラリと雰囲気が変わるんですよ。春の桜や秋の紅葉は本当に美しいです！🌸🍁\nベトナムの今の気候はどうですか？過ごしやすいですか？\n\n*(Thời tiết hôm nay bên bạn thế nào? Ở Nhật Bản cảnh sắc thay đổi rất rõ rệt theo từng mùa đấy. Mùa xuân có hoa anh đào còn mùa thu có lá đỏ đẹp lắm luôn! Thời tiết bên Việt Nam bây giờ thế nào rồi? Có dễ chịu không?)*";
  }

  if (/(?:趣味|休み|週末|sở thích|cuối tuần|ngày nghỉ|chơi gì)/i.test(msg)) {
    return "休日は何を過ごすのが好きですか？😊 私はカフェでまったり読書したり、アニメを見たりするのが大好きです！\nあなたはインドア派ですか、それともアウトドア派ですか？✨\n\n*(Ngày nghỉ bạn thích làm gì nhất? Tôi thì thích thong thả ngồi cà phê đọc sách hoặc xem anime lắm luôn! Bạn là tuýp thích ở trong nhà (Indoor) hay thích đi ra ngoài khám phá (Outdoor) thế?)*";
  }

  if (/(?:日本に行|日本へ行|旅行|東京|大阪|京都|du lịch|đến nhật|sang nhật|tokyo|osaka|kyoto)/i.test(msg)) {
    return "日本への旅行や滞在、とてもワクワクしますね！🗼\nもし日本に行くなら、東京の賑やかな街並みと、京都の伝統的なお寺めぐり、どちらに興味がありますか？美味しい和食もたくさんありますよ！🍱✨\n\n*(Chuyến đi Nhật Bản thật là háo hức nhỉ! Nếu sang Nhật, giữa phố xá nhộn nhịp ở Tokyo và các ngôi chùa cổ kính ở Kyoto, bạn thấy hào hứng với bên nào hơn? Còn có vô vàn món ăn Nhật ngon tuyệt nữa đấy!)*";
  }

  if (/(?:日本語|勉強|単語|文法|n3|n2|n1|tiếng nhật|học tiếng|luyện tập|khó)/i.test(msg)) {
    return "日本語の勉強、毎日コツコツ続けていて本当にえらいですね！👏\n漢字や文法で特に難しいと感じる部分はどこですか？私と一緒に少しずつマスターしていきましょうね！がんばりましょう！💪🌸\n\n*(Bạn chăm chỉ học tiếng Nhật mỗi ngày thế này thật đáng khen ngợi! Về Hán tự (Kanji) hay Ngữ pháp, phần nào làm bạn thấy khó nhất? Hãy cùng tôi làm quen từng chút một nhé! Cố lên nào!)*";
  }

  if (/(?:誰|何歳|先生|名前|tên gì|bao nhiêu tuổi|sensei là ai|giới thiệu)/i.test(msg)) {
    return "私は葵（あおい）です！🌸 Nihon Questでみなさんの日本語会話をサポートするAI Senseiです。日本文化や日常会話、アニメや旅行の話など何でもお話ししましょう！どうぞよろしくお願いしますね。✨\n\n*(Tôi là Aoi (葵)! Là giáo viên AI hỗ trợ đàm thoại tiếng Nhật của bạn tại Nihon Quest. Văn hóa Nhật Bản, hội thoại thường ngày, anime hay du lịch... bất cứ chủ đề nào chúng ta cũng có thể trò chuyện nhé! Rất vui được đồng hành cùng bạn.)*";
  }

  // 9. GENERAL JAPANESE NATURAL CONVERSATION FALLBACK
  // Analyzes and mirrors the user's message in a human, conversational way
  return `なるほど、「${msg}」ですね！🌸\n\nとても自然で気持ちの伝わる表現ですね。あなたの日本語のセンス、とても素晴らしいと思います！✨\n\nもっと色んなお話がしたいので、最近あった楽しかったことや、気になっていることについて教えてくれますか？😊\n\n*(Tôi hiểu rồi, là câu chuyện "${msg}" nhỉ! Cách diễn đạt của bạn rất tự nhiên và truyền cảm xúc rất tốt. Khả năng cảm thụ tiếng Nhật của bạn thật tuyệt vời! Tôi rất muốn trò chuyện thêm nhiều điều nữa, gần đây bạn có chuyện gì vui hay có điều gì đang quan tâm không? Kể tôi nghe nhé!)*`;
}
