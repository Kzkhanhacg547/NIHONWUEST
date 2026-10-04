export const SCENARIOS = [
  {
    slug: "ordering-ramen",
    title: "Gọi món tại tiệm Ramen Shibuya",
    description: "Nhập vai thực tế khi bước vào một quán Ramen truyền thống tại Tokyo. Tự tin trả lời số lượng người và gọi tô Tonkotsu Ramen chuẩn vị!",
    level: "N5",
    xpReward: 80,
    messages: [
      { order: 1, speaker: "CHỦ QUÁN RAMEN", japanese: "いらっしゃいませ！何名様ですか？", romaji: "Irasshaimase! Nan-mei sama desu ka?", meaning: "Kính chào quý khách! Quý khách đi mấy người ạ?" },
      { order: 2, speaker: "CHỦ QUÁN RAMEN", japanese: "どうぞ！こちらのカウンター席へどうぞ。どのラーメンにしますか？", romaji: "Dōzo! Kochira no kauntā-seki e dōzo. Dono rāmen ni shimasu ka?", meaning: "Mời bạn! Xin mời ngồi ở quầy này. Bạn muốn dùng loại mì Ramen nào?" },
      { order: 3, speaker: "CHỦ QUÁN RAMEN", japanese: "かしこまりました！豚骨ラーメン一丁！すぐにお作りしますね。", romaji: "Kashikomarimashita! Tonkotsu rāmen itchō! Sugu ni otsukuri shimasu ne.", meaning: "Tôi hiểu rồi! Một tô mì Tonkotsu! Chúng tôi sẽ chuẩn bị ngay cho bạn nhé." },
    ],
    choices: [
      { optionText: "一人です。カウンター席でいいですか？", isIdeal: true, xpReward: 40 },
      { optionText: "豚骨ラーメンをお願いします！麺は硬めで！", isIdeal: true, xpReward: 40 },
    ],
  },
  {
    slug: "shinjuku-station",
    title: "Hỏi đường tại Ga Shinjuku",
    description: "Ga Shinjuku là nhà ga đông đúc nhất thế giới. Hãy hỏi nhân viên nhà ga cách tìm tuyến tàu Yamanote Line một cách lịch sự!",
    level: "N5",
    xpReward: 80,
    messages: [
      { order: 1, speaker: "NHÂN VIÊN NHÀ GA", japanese: "こんにちは！何かお困りですか？", romaji: "Konnichiwa! Nanika okomari desu ka?", meaning: "Xin chào bạn! Bạn có cần tôi giúp gì không?" },
      { order: 2, speaker: "NHÂN VIÊN NHÀ GA", japanese: "山手線ですね！14番線と15番線ですよ。あちらのエスカレーターを上がってください。", romaji: "Yamanote-sen desu ne! Jū-yon bansen to jū-go bansen desu yo. Achira no esukarētā o agatte kudasai.", meaning: "Tuyến Yamanote đúng không! Ở đường ray số 14 và 15 đó. Bạn hãy đi lên thang cuốn đằng kia nhé." },
    ],
    choices: [
      { optionText: "すみません、山手線のホームはどこですか？", isIdeal: true, xpReward: 40 },
      { optionText: "ありがとうございます！助かりました。", isIdeal: true, xpReward: 40 },
    ],
  },
  {
    slug: "konbini-shopping",
    title: "Mua sắm tại cửa hàng tiện lợi Konbini",
    description: "Thanh toán tại 7-Eleven hay Lawson: xử lý các câu hỏi quen thuộc về thẻ tích điểm, hâm nóng cơm nắm và lấy túi nilông.",
    level: "N5",
    xpReward: 80,
    messages: [
      { order: 1, speaker: "THU NGÂN KONBINI", japanese: "ポイントカードはお持ちですか？", romaji: "Pointo kādo wa omochi desu ka?", meaning: "Quý khách có thẻ tích điểm không ạ?" },
      { order: 2, speaker: "THU NGÂN KONBINI", japanese: "かしこまりました。お弁当は温めますか？袋はお付けしますか？", romaji: "Kashikomarimashita. Obentō wa atatamemasu ka? Fukuro wa otsuke shimasu ka?", meaning: "Vâng tôi hiểu rồi. Cơm hộp có cần hâm nóng không ạ? Quý khách có lấy túi không?" },
      { order: 3, speaker: "THU NGÂN KONBINI", japanese: "ありがとうございます！ちょうど750円になります。またお越しくださいませ！", romaji: "Arigatō gozaimasu! Chōdo nana-hyaku go-jū en ni narimasu. Mata okoshi kudasaimase!", meaning: "Xin cảm ơn quý khách! Tổng cộng vừa tròn 750 Yên. Xin hẹn gặp lại quý khách!" },
    ],
    choices: [
      { optionText: "持っていません。大丈夫です。", isIdeal: true, xpReward: 40 },
      { optionText: "温めをお願いします。袋も1枚ください。", isIdeal: true, xpReward: 40 },
    ],
  },
  {
    slug: "akihabara-anime",
    title: "Mua sắm Anime & Miễn thuế tại Akihabara",
    description: "Khám phá phố điện tử Akihabara, hỏi nhân viên xem mô hình trong tủ kính và hỏi thủ tục miễn thuế Passport Tax-Free.",
    level: "N5",
    xpReward: 90,
    messages: [
      { order: 1, speaker: "NHÂN VIÊN AKIHABARA", japanese: "いらっしゃいませ！ショーケースの中の商品をご覧になりますか？", romaji: "Irasshaimase! Shōkēsu no naka no shōhin o goran ni narimasu ka?", meaning: "Kính chào quý khách! Quý khách có muốn xem sản phẩm bên trong tủ kính không ạ?" },
      { order: 2, speaker: "NHÂN VIÊN AKIHABARA", japanese: "はい、どうぞ！こちらの大人気フィギュアですね。免税をご利用ですか？", romaji: "Hai, dōzo! Kochira no daininki figyua desu ne. Menzei o goriyō desu ka?", meaning: "Vâng, xin mời! Đây là mô hình đang rất được ưa chuộng đó. Quý khách có dùng dịch vụ miễn thuế Tax-Free không?" },
    ],
    choices: [
      { optionText: "すみません、このフィギュアを見せてください。", isIdeal: true, xpReward: 45 },
      { optionText: "はい、パスポートがあります。免税をお願いします！", isIdeal: true, xpReward: 45 },
    ],
  },
  {
    slug: "hakone-ryokan",
    title: "Nhận phòng Ryokan & Tắm Onsen tại Hakone",
    description: "Trải nghiệm văn hóa lữ quán truyền thống Nhật Bản, hỏi giờ dùng bữa Kaiseki và quy tắc vào suối nước nóng Onsen.",
    level: "N5",
    xpReward: 90,
    messages: [
      { order: 1, speaker: "NỮ TIẾP VIÊN OKAMI", japanese: "ようこそ箱根温泉へ！ご予約のお名前をお伺いできますか？", romaji: "Yōkoso Hakone Onsen e! Goyoyaku no onamae o oukagai dekimasu ka?", meaning: "Chào mừng quý khách đến với Suối nước nóng Hakone! Tôi xin phép được hỏi tên người đặt phòng ạ?" },
      { order: 2, speaker: "NỮ TIẾP VIÊN OKAMI", japanese: "確認いたしました！夕食は18時から大広間でご用意いたします。温泉は24時間ご利用いただけますよ。", romaji: "Kakunin itashimashita! Yūshoku wa jū-hachi-ji kara ōbiroma de goyōi itashimasu. Onsen wa nijū-yo-jikan goriyō itadakemasu yo.", meaning: "Tôi đã kiểm tra rồi ạ! Bữa tối sẽ phục vụ từ 18 giờ tại sảnh lớn. Suối nước nóng mở cửa phục vụ 24/24 giờ nhé quý khách." },
    ],
    choices: [
      { optionText: "予約したグエンと申します。チェックインをお願いします。", isIdeal: true, xpReward: 45 },
      { optionText: "ありがとうございます！温泉に入るのがとても楽しみです。", isIdeal: true, xpReward: 45 },
    ],
  },
  {
    slug: "japanese-pharmacy",
    title: "Mua thuốc cảm sốt tại Hiệu thuốc Nhật",
    description: "Diễn tả triệu chứng đau đầu, sốt nhẹ khi đi du lịch và hỏi dược sĩ liều lượng uống mỗi ngày một cách an tâm.",
    level: "N5",
    xpReward: 90,
    messages: [
      { order: 1, speaker: "DƯỢC SĨ HIỆU THUỐC", japanese: "どうされましたか？どのような症状ですか？", romaji: "Dō saremashita ka? Dono yō na shōjō desu ka?", meaning: "Bạn bị làm sao thế? Triệu chứng của bạn như thế nào?" },
      { order: 2, speaker: "DƯỢC SĨ HIỆU THUỐC", japanese: "頭痛と熱ですね。この総合かぜ薬がよく効きますよ。1日3回、食後に飲んでください。", romaji: "Zutsū to netsu desu ne. Kono sōgō kaze-gusuri ga yoku kikimasu yo. Ichi-nichi san-kai, shokugo ni nonde kudasai.", meaning: "Đau đầu và bị sốt đúng không. Loại thuốc cảm tổng hợp này công hiệu lắm đó. Hãy uống mỗi ngày 3 lần sau bữa ăn nhé." },
    ],
    choices: [
      { optionText: "昨日から頭が痛くて、少し熱があります。", isIdeal: true, xpReward: 45 },
      { optionText: "分かりました。食後ですね。ありがとうございます！", isIdeal: true, xpReward: 45 },
    ],
  },
  {
    slug: "kyoto-taxi",
    title: "Đi Taxi ngắm cảnh tại Cố đô Kyoto",
    description: "Bắt taxi tại ga Kyoto để đến Chùa Vàng Kinkaku-ji, học cách nói điểm đến và thanh toán tiện lợi bằng thẻ IC.",
    level: "N5",
    xpReward: 90,
    messages: [
      { order: 1, speaker: "TÀI XẾ TAXI KYOTO", japanese: "ご乗車ありがとうございます！どちらまで向かいますか？", romaji: "Gojōsha arigatō gozaimasu! Dochira made mukaimasu ka?", meaning: "Cảm ơn quý khách đã đi xe! Quý khách muốn đi đến đâu ạ?" },
      { order: 2, speaker: "TÀI XẾ TAXI KYOTO", japanese: "金閣寺ですね！かしこまりました。20分ほどで到着しますよ。", romaji: "Kinkaku-ji desu ne! Kashikomarimashita. Ni-juppun hodo de tōchaku shimasu yo.", meaning: "Chùa Vàng Kinkaku-ji đúng không! Tôi hiểu rồi. Khoảng 20 phút nữa là chúng ta sẽ tới nơi nhé." },
    ],
    choices: [
      { optionText: "金閣寺までお願いします。", isIdeal: true, xpReward: 45 },
      { optionText: "Suica（スイカ）で支払うことはできますか？", isIdeal: true, xpReward: 45 },
    ],
  },
];
