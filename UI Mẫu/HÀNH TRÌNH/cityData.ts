import { CulturalArtifact, Delicacy, ScenicPhoto, CulturalFact, LanguagePhrase, HistoricalEra } from "@/components/Japanese3DRoom";

export interface CulturalEtiquetteItem {
  title: string;
  desc: string;
  icon: string;
}

export interface CityGourmet {
  landmark3D: string;
  landmarkImage: string;
  highlights: string[];
  history: HistoricalEra;
  delicacies: Delicacy[];
  funFact: string;
  stampJa: string;
  scenicPhotos: ScenicPhoto[];
  culturalFacts: CulturalFact[];
  culturalArtifacts: CulturalArtifact[];
  language: LanguagePhrase[];
  culturalEtiquette: CulturalEtiquetteItem[];
}

export const CITY_DETAILS: Record<string, CityGourmet> = {
  tokyo: {
    landmark3D: "🗼",
    landmarkImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    highlights: ["Tháp Tokyo & Tokyo Skytree", "Ngã tư Shibuya sầm uất", "Đền cổ Senso-ji Asakusa"],
    history: {
      eraName: "Thời kỳ Mạc Phủ Tokugawa (Edo 1603 – 1867) & Minh Trị Duy Tân Đổi Đô",
      summary: "Khởi đầu từ một làng chài nhỏ mang tên Edo, tướng quân Tokugawa Ieyasu đã chọn nơi đây làm trung tâm quyền lực của Mạc phủ năm 1603, biến Tokyo thành đại đô thị sầm uất với hơn 1 triệu dân vào thế kỷ 18 — vượt qua cả London và Paris lúc bấy giờ.\n\nNăm 1868, sau thắng lợi của cuộc Minh Trị Duy Tân, Thiên hoàng chính thức dời đô từ Kyoto về Edo và đổi tên thành Tokyo (Đông Kinh). Trải qua trận Đại địa chấn Kanto năm 1923 và sự tàn phá của Thế chiến thứ hai, Tokyo đã tái sinh kỳ diệu với Thế vận hội 1964 và tuyến Shinkansen đầu tiên, trở thành siêu đô thị an toàn, hiện đại bậc nhất hành tinh.",
      famousFigure: "Mạc chúa Tokugawa Ieyasu, Thiên hoàng Minh Trị, Kiến trúc sư Tange Kenzo",
      milestones: [
        {
          year: "Năm 1603",
          title: "Tokugawa Ieyasu Thành Lập Mạc Phủ Edo",
          desc: "Sau trận đại chiến Sekigahara, Tokugawa Ieyasu thống nhất Nhật Bản và lập chính quyền Mạc phủ tại Edo, thiết lập hệ thống Luân phiên Trình diện (Sankin-kotai) khiến mọi lãnh chúa cả nước đổ về đây, tạo nên huyết mạch kinh tế khổng lồ."
        },
        {
          year: "Năm 1657",
          title: "Đại Hỏa Hoạn Meireki & Quy Hoạch Đô Thị",
          desc: "Trận đại hỏa hoạn thiêu rụi phần lớn lâu đài Edo đã mở đường cho cuộc tái thiết quy hoạch quy mô lớn: xây cầu Ryogoku, mở rộng khu dân cư Asakusa và Nihonbashi, đặt nền móng cho cấu trúc Tokyo hiện đại."
        },
        {
          year: "Năm 1868",
          title: "Minh Trị Duy Tân & Thiên Hoàng Dời Đô",
          desc: "Chế độ Mạc phủ sụp đổ, quyền lực trở về tay Thiên hoàng. Kinh đô ngàn năm Kyoto được chuyển về Edo và đổi tên thành Tokyo ('Kinh đô phía Đông'), mở ra làn sóng Tây hóa và công nghiệp hóa thần tốc."
        },
        {
          year: "Năm 1923",
          title: "Đại Địa Chấn Kanto & Khí Phách Tái Sinh",
          desc: "Trận động đất mạnh 7.9 độ Richter tàn phá Tokyo và Yokohama. Dưới sự lãnh đạo của thị trưởng Goto Shimpei, Tokyo được quy hoạch lại với đại lộ rộng rãi, công viên chống cháy và mạng lưới cầu thép kiên cố."
        },
        {
          year: "Năm 1964",
          title: "Thế Vận Hội Tokyo & Khai Sinh Shinkansen",
          desc: "Thế vận hội Olympic Tokyo 1964 đánh dấu sự trở lại ngoạn mục của Nhật Bản trên trường quốc tế. Tuyến tàu siêu tốc Tokaido Shinkansen chạy từ Tokyo đến Osaka với vận tốc 210 km/h đã làm kinh ngạc thế giới."
        }
      ]
    },
    delicacies: [
      {
        name: "Edomae Nigiri Sushi",
        nameJa: "江戸前握り寿司",
        desc: "Sushi truyền thống nguồn gốc thời Edo với hải sản tươi ngon đánh bắt tại vịnh Tokyo đặt trên nắm cơm giấm ấm nóng.",
        icon: "🍣",
        imageUrl: "https://itamaesushi-shinbashi.eeat.jp/wp-content/data/itamaesushi-shinbashi/9ac7cc397a131ec96623ea304e866e98-2.jpg",
        taste: "Vị ngọt thanh tự nhiên của cá hồi, cá ngừ hòa quyện giấm đỏ Akazu và wasabi cay nồng ấm.",
        orderingPhrase: "おまかせでお願いします (Omakase de onegaishimasu - Xin nhờ đầu bếp chọn món giúp)"
      },
      {
        name: "Tsukishima Monjayaki",
        nameJa: "月島もんじゃ焼き",
        desc: "Bánh xèo bột lỏng nướng xèo xèo trên bàn sắt teppan tại khu phố cổ Tsukishima, dùng xẻng nhỏ hagashi cạo ăn nóng hổi.",
        icon: "🥢",
        imageUrl: "https://en.ichimileinc.com/wp-content/uploads/2025/02/monjayaki-food-tsukishima.jpg",
        taste: "Đáy bánh xém giòn thơm lừng mùi bắp cải, bạch tuộc, phô mai và tôm khô dẻo ngậy.",
        orderingPhrase: "もんじゃ焼きを二人前ください (Monjayaki o ninmae kudasai - Cho 2 phần Monjayaki)"
      },
      {
        name: "Tonkotsu Ramen Shinjuku",
        nameJa: "新宿豚骨ラーメン",
        desc: "Bát mì ramen nước hầm xương heo ninh nhừ suốt 18 tiếng, ăn kèm thịt xá xíu mềm tan, trứng lòng đào ngâm tương và mộc nhĩ giòn.",
        icon: "🍜",
        imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700&q=80",
        taste: "Nước dùng béo ngậy đậm đà, sợi mì dai sợi mảnh và tỏi phi dậy mùi thơm quyến rũ.",
        orderingPhrase: "麺固めでお願いします (Men katame de onegaishimasu - Làm mì sợi cứng giúp tôi)"
      },
      {
        name: "Tempura Soba Asakusa",
        nameJa: "浅草天ぷら蕎麦",
        desc: "Mì kiều mạch soba nước dùng dashi thanh khiết ăn kèm tôm sú chiên tempura vàng ươm giòn rụm theo phong cách phố cổ Asakusa.",
        icon: "🍤",
        imageUrl: "https://www.jal.co.jp/vn/vn/guide-to-japan/destinations/articles/tokyo/guide-to-soba/_jcr_content/root/responsivegrid/sectioncontainer_cop/image_2047275859_cop_293197973.coreimg.jpeg/1690511771973.jpeg",
        taste: "Lớp vỏ tempura giòn tan ngấm nhẹ nước tương ngọt dịu dashi và hạt kiều mạch thơm mộc mạc.",
        orderingPhrase: "天ぷら蕎麦を温かいので (Tempura soba o atatakai no de - Cho tôi mì soba tôm nóng)"
      }
    ],
    funFact: "Ga Shinjuku tại Tokyo là nhà ga tấp nập nhất thế giới với hơn 3.5 triệu lượt khách qua lại mỗi ngày!",
    stampJa: "東京駅・記念印",
    scenicPhotos: [
      {
        url: "https://rimage.gnst.jp/livejapan.com/public/article/detail/a/00/00/a0000146/img/basic/a0000146_main.jpg",
        caption: "Tháp Tokyo rực sáng giữa đường chân trời đêm 🗼",
        location: "Minato-ku, Tokyo",
        description: "Ngọn tháp thép cao 332.9m xây dựng năm 1958, lấy cảm hứng từ tháp Eiffel với hai sắc đỏ trắng bảo hộ bầu trời thủ đô."
      },
      {
        url: "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcRh0StbctSIT986CGLpNIjznQgDJXrIvwSgTPT18d1SzQpYDFKgiR03zftrZKCtK4D6PQpqZW_JaVi05G4",
        caption: "Đền cổ Senso-ji Asakusa linh thiêng ⛩️",
        location: "Asakusa Taito-ku",
        description: "Ngôi đền Phật giáo cổ nhất Tokyo thành lập năm 645, nơi lưu giữ tinh hoa lễ hội Sanja Matsuri rộn rã."
      },
      {
        url: "https://mia.vn/media/uploads/blog-du-lich/giao-lo-shibuya-2-1729755650.jpg",
        caption: "Ngã tư Shibuya Crossing nhộn nhịp 🚶",
        location: "Shibuya Center Street",
        description: "Giao lộ người đi bộ đông nhất hành tinh, biểu tượng cho nhịp sống hiện đại không bao giờ ngủ."
      }
    ],
    culturalFacts: [
      { icon: "🏙️", label: "Dân số nội thành", value: "14 triệu người (vùng đô thị 37 triệu)" },
      { icon: "🚇", label: "Mạng lưới tàu điện", value: "13 tuyến Metro & 30+ tuyến JR liên tỉnh" },
      { icon: "🌸", label: "Điểm ngắm hoa anh đào", value: "Công viên Ueno, Sông Meguro, Shinjuku Gyoen" },
      { icon: "🎌", label: "Văn hóa hiện đại", value: "Anime, Manga, Cosplay Akihabara & Harajuku" }
    ],
    culturalArtifacts: [
      {
        title: "Đèn Lồng Đỏ Lớn Cổng Sấm Kaminarimon",
        titleJa: "雷門大提灯 (Kaminarimon Ō-chōchin)",
        icon: "🏮",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSvboh-Pm7jBWmDzsWZCxvCMAadbya2wjsvSsA1ZtXXXY_Av8Hw8tWUIA&s=10",
        desc: "Chiếc đèn lồng đỏ khổng lồ nặng gần 700kg treo sừng sững tại cổng sấm đền Senso-ji, được chế tác thủ công từ tre và giấy washi Kyoto.",
        significance: "Biểu tượng bảo hộ bình an, xua đuổi tà khí và cầu nguyện mưa thuận gió hòa cho bách tính thời Edo."
      },
      {
        title: "Kiếm Đạo Katana & Võ Sĩ Đạo Bushido",
        titleJa: "日本刀と武士道 (Nihontō & Bushidō)",
        icon: "⚔️",
        imageUrl: "https://genk.mediacdn.vn/2019/11/23/photo-1-1574481103349400604856.jpg",
        desc: "Nghệ thuật rèn kiếm bậc thầy với thép Tamahagane gấp hàng vạn lần, sở hữu đường vân sóng nước Hamon độc bản và độ sắc bén phi thường.",
        significance: "Linh hồn của giai cấp võ sĩ Samurai, biểu trưng cho Danh dự, Lòng quả cảm và Tinh thần Chính trực bất khuất."
      },
      {
        title: "Văn Hóa Công Nghệ & Manga Akihabara",
        titleJa: "秋葉原オタク文化 (Akihabara Otaku)",
        icon: "🤖",
        imageUrl: "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTdBTRjcus5HQjoXe42PRyB-alZ1kY1DBP0OH-DZ1erbY_sGw6IDg1FqfmsdsD0dlWVa7ZcWoADjQJ7gbI",
        desc: "Thánh địa truyện tranh manga, anime, thiết bị điện tử vi mạch và văn hóa Otaku lan tỏa ảnh hưởng toàn cầu.",
        significance: "Sức mạnh quyền lực mềm văn hóa đương đại đưa hình ảnh nước Nhật hiện đại chinh phục thế hệ trẻ năm châu."
      }
    ],
    culturalEtiquette: [
      { title: "Nghi thức bái lễ đền Shinto", desc: "Thực hiện '2 Cúi - 2 Vỗ tay - 1 Cúi' (二礼二拍手一礼) trước chính điện để kính cẩn chào đón thần linh.", icon: "⛩️" },
      { title: "Quy tắc trên tàu điện ngầm", desc: "Để điện thoại chế độ im lặng (Manner Mode) và không nói chuyện điện thoại trên tàu.", icon: "🚇" },
      { title: "Cách ăn Sushi đúng chuẩn", desc: "Chấm phần cá vào nước tương chứ không chấm phần cơm để hạt cơm không bị vỡ vụn.", icon: "🍣" }
    ],
    language: [
      { japanese: "東京へようこそ！", romaji: "Tōkyō e yōkoso!", meaning: "Chào mừng bạn đến với Tokyo!" },
      { japanese: "渋谷はどこですか？", romaji: "Shibuya wa doko desu ka?", meaning: "Khu vực Shibuya ở đâu vậy ạ?" },
      { japanese: "写真を撮ってもいいですか？", romaji: "Shashin o totte mo ii desu ka?", meaning: "Tôi có thể chụp ảnh ở đây được không?" }
    ]
  },

  kyoto: {
    landmark3D: "⛩️",
    landmarkImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRqYzB166U4VEYWxGvdXlcVAlB6UWrENJEVvTiU8Leqg&s=10",
    highlights: ["Chùa Vàng Kinkaku-ji phản chiếu trên hồ", "Ngàn cổng Torii đỏ Fushimi Inari", "Rừng trúc Sagano Arashiyama"],
    history: {
      eraName: "Kỷ Nguyên Bình An Heian (794 – 1185) & Cố Đô Ngàn Năm Hoàng Gia",
      summary: "Năm 794, Thiên hoàng Kammu dời đô về Heian-kyo (Bình An Kinh, chính là Kyoto ngày nay), mở ra hơn một thiên niên kỷ giữ vị thế trung tâm tâm linh, văn hóa và hoàng gia của nước Nhật cho đến năm 1868.\n\nHeian là thời kỳ vàng son của văn học cung đình với sự ra đời của kiệt tác 'Truyện Genji', nghệ thuật dệt lụa Kimono Yuzen, và kiến trúc Phật giáo thiền tông. Dù trải qua chiến loạn Onin tàn phá vào thế kỷ 15, Kyoto vẫn được các lãnh chúa như Oda Nobunaga và Toyotomi Hideyoshi dốc sức khôi phục.\n\nNhờ giá trị vô giá của hàng ngàn ngôi đền cổ, Kyoto đã được loại khỏi danh sách mục tiêu ném bom trong Thế chiến II, giữ gìn nguyên vẹn 17 Di sản Văn hóa Thế giới UNESCO cho nhân loại.",
      famousFigure: "Thiên hoàng Kammu, Nữ sĩ Murasaki Shikibu, Thiền sư Sen no Rikyu, Lãnh chúa Ashikaga Yoshimitsu",
      milestones: [
        {
          year: "Năm 794",
          title: "Thiên Hoàng Kammu Định Đô Heian-kyo",
          desc: "Định đô tại thung lũng phong thủy bao quanh bởi núi non, xây dựng thành quách theo mô hình Trường An với đại lộ Suzaku, mở ra hơn 1,000 năm ngai vàng hoàng gia ngự trị."
        },
        {
          year: "Năm 1008",
          title: "Nữ Sĩ Murasaki Shikibu Viết Truyện Genji",
          desc: "Tác phẩm được coi là tiểu thuyết tâm lý đầu tiên của nhân loại ra đời tại cung đình Kyoto, tôn vinh triết lý thẩm mỹ 'Mono no aware' (nỗi xao xuyến trước vẻ đẹp phù du)."
        },
        {
          year: "Năm 1397",
          title: "Ashikaga Yoshimitsu Xây Dựng Chùa Vàng Kinkaku-ji",
          desc: "Tướng quân Muromachi cho dát vàng ròng hai tầng trên của ngôi biệt viện bên hồ Gương (Kyoko-chi), đỉnh cao dung hòa phong cách quý tộc Shinden và thiền viện Bukke."
        },
        {
          year: "Năm 1587",
          title: "Đại Tiệc Trà Kitano & Thiền Sư Sen no Rikyu",
          desc: "Lãnh chúa Toyotomi Hideyoshi tổ chức đại tiệc trà mở cho cả thứ dân. Thiền sư Sen no Rikyu hoàn thiện đạo trà Wabi-cha đề cao sự giản dị, tĩnh tại và lòng hiếu khách chí thành."
        },
        {
          year: "Năm 1994",
          title: "UNESCO Ghi Danh 17 Quần Thể Cố Đô Kyoto",
          desc: "Kiyomizu-dera, Kinkaku-ji, Ginkaku-ji, Ryoan-ji cùng 13 di tích khác được vinh danh là Di sản Văn hóa Thế giới, khẳng định Kyoto là viên ngọc bảo tồn của nhân loại."
        }
      ]
    },
    delicacies: [
      {
        name: "Yến Tiệc Hoàng Gia Kaiseki Ryori",
        nameJa: "京懐石料理",
        desc: "Nghệ thuật ẩm thực cung đình cao cấp gồm nhiều món nhỏ bày biện tinh tế như tác phẩm nghệ thuật, thay đổi theo 4 mùa trong năm.",
        icon: "🍱",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAIG3XE5_ke5HXF1OteMyee3qABCbiMD_anwZM9yEODUQAfK2l4ER_BmAgqzRV",
        taste: "Vị ngọt thanh thuần khiết từ rau củ Kyoto (Kyo-yasai), nước dùng dashi tảo bẹ Kombu thượng hạng và cá tươi theo mùa.",
        orderingPhrase: "季節の懐石コースをお願いします (Kisetsu no kaiseki kōsu o onegaishimasu - Cho tôi set Kaiseki theo mùa)"
      },
      {
        name: "Trà Đạo Uji Matcha & Wagashi",
        nameJa: "宇治抹茶と和菓子",
        desc: "Bột trà xanh cao cấp từ những đồn điền Uji cổ xưa đánh sủi bọt ngọc bích sánh mịn, thưởng thức cùng bánh ngọt Wagashi tạo hình hoa lá bốn mùa.",
        icon: "🍵",
        imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQLpdEPbPNAyd3d-IxCMSZjzd70U6JRKJprWVx0WvAnEbJQjmn6wkk0rKiGIqhW",
        taste: "Vị đắng chát êm dịu lúc đầu, đọng lại vị ngọt sâu lắng hậu vị hòa quyện nhân đậu đỏ thanh nhẹ.",
        orderingPhrase: "お抹茶とお菓子のセットをください (Omatcha to okashi no setto o kudasai - Cho tôi set trà Matcha và bánh ngọt)"
      },
      {
        name: "Đậu Phụ Yudofu Thiền Viện Nanzen-ji",
        nameJa: "南禅寺湯豆腐",
        desc: "Miếng đậu phụ tươi mượt mà thả trong nồi gang nước dùng tảo bẹ sôi liu riu, món ăn chay dưỡng tâm truyền thống của các nhà sư thiền tông.",
        icon: "🥢",
        imageUrl: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcT7LnFB_SMFpqWxQqZKygVn8EoEW5V6gpJHbZih7gHpeSvmAycM_D2BTngmqE-5cqWFdveGw4IOy_n7M1I",
        taste: "Mềm tan béo ngậy vị đậu nành tự nhiên, chấm nước tương Ponzu chua thanh, hành hoa thái chỉ và gừng tươi.",
        orderingPhrase: "湯豆腐御膳を一つお願いします (Yudofu gozen o hitotsu onegaishimasu - Cho một phần cơm đậu phụ Yudofu)"
      },
      {
        name: "Bánh Ngọt Truyền Thống Wagashi",
        nameJa: "京都の上生菓子",
        desc: "Những chiếc bánh ngọt nghệ thuật được nhào nặn thủ công tỉ mỉ mô phỏng nhành hoa anh đào mùa xuân hay lá phong đỏ mùa thu.",
        icon: "🌸",
        imageUrl: "https://tse3.mm.bing.net/th/id/OIP.RsSnleEL4_WGya-Zz6oYngHaGI?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
        taste: "Ngọt thanh tao từ đường Wasanbon quý hiếm và đậu trắng Shiro-an mịn màng tan ngay trên đầu lưỡi.",
        orderingPhrase: "お持ち帰り用の和菓子はありますか (Omochikaeri-yō no wagashi wa arimasu ka - Có hộp bánh wagashi mang về không?)"
      }
    ],
    funFact: "Kyoto có hơn 1,600 ngôi đền Phật giáo và 400 đền thờ Thần đạo Shinto tồn tại suốt hàng thế kỷ!",
    stampJa: "京都駅・記念印",
    scenicPhotos: [
      {
        url: "https://dulichviet.com.vn/images/bandidau/chua-vang-kinkakuji-bieu-tuong-cua-co-do-kyoto-nhat-ban.jpg",
        caption: "Chùa Vàng Kinkaku-ji rực rỡ bên hồ Gương ⛩️",
        location: "Kinkaku-ji, Kita-ku",
        description: "Ngôi chùa dát vàng ròng lung linh soi bóng mặt hồ tĩnh lặng, biểu tượng vĩnh cửu của văn hóa Muromachi."
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxQMmwSpBzRyzZzKwMZxMNP7MITrfmrI50Gp2R3eP-2GCYrQsh_aS3uIOc&s=10",
        caption: "Đường hầm vạn cổng Torii Fushimi Inari 🦊",
        location: "Fushimi-ku, Kyoto",
        description: "Hơn 10,000 cổng Torii sơn màu đỏ chu sa son sắt xếp liền nhau dẫn lên đỉnh núi thiêng thờ Thần Nông Nghiệp Inari."
      },
      {
        url: "https://www.luavietours.com/wp/wp-content/uploads/2024/12/1-rung-tre-sagano-voi-khong-gian-day-yen-binh-va-tinh-lang-750x500.jpg",
        caption: "Rừng trúc Sagano Arashiyama xanh biếc 🎋",
        location: "Arashiyama, Ukyo-ku",
        description: "Lối mòn xuyên qua rừng tre cao vút xào xạc trong gió, một trong 100 âm thanh đặc trưng của nước Nhật."
      }
    ],
    culturalFacts: [
      { icon: "⛩️", label: "Di sản Thế giới UNESCO", value: "17 đền đài & thắng cảnh cổ" },
      { icon: "👘", label: "Nghệ thuật Geiko/Maiko", value: "Bảo tồn tại 5 phố hoa Gion & Pontocho" },
      { icon: "🍵", label: "Trà đạo Wabi-cha", value: "Cái nôi của 3 gia tộc trà Urasenke, Omotesenke, Mushakojisenke" },
      { icon: "🧵", label: "Lụa dệt thủ công", value: "Kỹ nghệ lụa Nishijin-ori & nhuộm Yuzen nổi tiếng" }
    ],
    culturalArtifacts: [
      {
        title: "Kimono Lụa Dệt Nishijin-ori Cố Đô",
        titleJa: "西陣織着物 (Nishijin-ori Kimono)",
        icon: "👘",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTZi9n1ABoAo7CukeicEYr3YxiaYhdRf0Eyfy4oysku67YMja7a4f2-mQU&s=10",
        desc: "Kỹ nghệ dệt gấm lụa tơ tằm xen chỉ vàng chỉ bạc phức tạp với hơn 1,200 năm lịch sử tại quận Nishijin.",
        significance: "Trang phục truyền thống quý tộc, quốc phục biểu trưng cho phẩm hạnh và vẻ đẹp thanh nhã của phụ nữ Nhật."
      },
      {
        title: "Chổi Đánh Trà Chasen & Bát Trà Chawan",
        titleJa: "茶筅と茶碗 (Chasen & Chawan)",
        icon: "🍵",
        imageUrl: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcQ4b2xy1bVAvG6-Mj-x_Q_KuyiC2Ba5LLUDKjB3X7dgcEsucKAi9BoDt9oD8qz-u3dwxHftdzfqWWwp88c",
        desc: "Chiếc chổi đánh trà chẻ từ một ống tre duy nhất thành cả trăm sợi mảnh như tơ cùng bát gốm Raku nung mộc mạc.",
        significance: "Bảo vật của Trà đạo thể hiện triết lý 'Nhất kỳ nhất hội' (Ichigo Ichie) — trân trọng từng khoảnh khắc gặp gỡ trong đời."
      },
      {
        title: "Chuông Gió Furin Chùa Thiền Buổi Hạ",
        titleJa: "風鈴 (Furin - Chuông gió)",
        icon: "🎐",
        imageUrl: "https://bizweb.dktcdn.net/thumb/1024x1024/100/362/023/files/camnhi-214928084952-chuong-gio-nhat-ban-2.jpg?v=1706082613250",
        desc: "Chiếc chuông gió thủy tinh treo dưới mái hiên chùa kèm dải giấy cầu nguyện rung rinh khi có ngọn gió hạ thổi qua.",
        significance: "Âm thanh thanh lương mang lại cảm giác mát mẻ xua tan oi bức mùa hè và gột rửa tâm hồn thanh tịnh."
      }
    ],
    culturalEtiquette: [
      { title: "Tôn trọng nghệ nhân Maiko", desc: "Không tự ý chặn đường chụp ảnh hoặc chạm vào tà áo Kimono của Maiko tại khu phố Gion.", icon: "👘" },
      { title: "Quy tắc bước vào thiền viện", desc: "Cởi giày dép xếp ngay ngắn hướng mũi ra ngoài cửa trước khi bước lên chiếu tatami.", icon: "⛩️" },
      { title: "Thưởng trà đúng cách", desc: "Xoay bát trà hai lần theo chiều kim đồng hồ để tránh uống trực tiếp vào mặt chính diện trang trí của bát.", icon: "🍵" }
    ],
    language: [
      { japanese: "おいでやす (Kyoto-ben)", romaji: "Oideyasu", meaning: "Kính chào quý khách (Lời chào đón nồng ấm phương ngữ Kyoto)" },
      { japanese: "おおきに！", romaji: "Ōkini!", meaning: "Cảm ơn bạn rất nhiều! (Cách cảm ơn đặc trưng xứ Kansai)" },
      { japanese: "静かに拝観しましょう。", romaji: "Shizuka ni haikan shimashō.", meaning: "Chúng ta hãy giữ trật tự khi chiêm bái đền chùa nhé." }
    ]
  },

  nara: {
    landmark3D: "🦌",
    landmarkImage: "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcQ7cnDkzD5-VevAMnD0397K8CrIcTz6GEoS2WD1Q36w7tCa2i5iEbE7v8SwHQe85gtrO-cW1XxRdu2es-c",
    highlights: ["Đại Phật Daibutsu chùa Todai-ji", "Đàn hươu thiêng công viên Nara", "Đền thờ ngàn đèn lồng Kasuga Taisha"],
    history: {
      eraName: "Thời kỳ Bình Thành Heijo-kyo (710 – 784) & Cái Nôi Phật Giáo Nhật Bản",
      summary: "Trước khi có Nara, triều đình Nhật Bản thường thay đổi thủ đô mỗi khi có vị Thiên hoàng mới băng hà. Năm 710, Nữ hoàng Gemmei đã quyết định xây dựng kinh đô thường trực đầu tiên mang tên Heijo-kyo (Nara), mở ra thời kỳ Nara rực rỡ.\n\nĐây là giai đoạn Phật giáo trở thành quốc đạo. Thiên hoàng Shomu đã huy động toàn bộ quốc lực để đúc pho tượng Đại Phật đồng đen vĩ đại tại Todai-ji nhằm cầu nguyện quốc thái dân an trước dịch bệnh.\n\nNara cũng là điểm kết thúc phía Đông của Con đường Tơ lụa huyền thoại, nơi kho báu Shosoin lưu giữ hàng ngàn cống phẩm vô giá từ Ba Tư, Ấn Độ và Trung Hoa thời Đường.",
      famousFigure: "Nữ hoàng Gemmei, Thiên hoàng Shomu, Đại sư Giám Chân (Ganjin), Quý tộc Fujiwara no Fuhito",
      milestones: [
        {
          year: "Năm 710",
          title: "Nữ Hoàng Gemmei Định Đô Heijo-kyo",
          desc: "Kinh đô Nara đầu tiên trong lịch sử ra đời theo kiến trúc bàn cờ hoàn mỹ, đặt nền móng cho hệ thống luật pháp Ritsuryo và ghi chép hai bộ sử vĩ đại Kojiki và Nihon Shoki."
        },
        {
          year: "Năm 752",
          title: "Đại Lễ Khai Nhãn Đại Phật Daibutsu",
          desc: "Đại lễ khai nhãn cho tượng Phật Thích Ca Mâu Ni cao 15 mét bằng đồng đen tại Todai-ji với sự tham dự của hàng vạn cao tăng từ Ấn Độ, Trung Hoa và các vương quốc châu Á."
        },
        {
          year: "Năm 768",
          title: "Thành Lập Đền Thần Đạo Kasuga Taisha",
          desc: "Thần Takemikazuchi cưỡi hươu trắng giáng trần xuống núi Mikasa bảo hộ kinh thành. Kể từ đó, loài hươu được tôn vinh là sứ giả thần linh (Shinroku) và được bảo vệ nghiêm ngặt."
        },
        {
          year: "Năm 759",
          title: "Đại Sư Giám Chân Xây Chùa Toshodai-ji",
          desc: "Nhà sư Giám Chân từ Trung Hoa vượt biển 6 lần gian nan, dù bị mù cả hai mắt vẫn đến được Nara truyền thụ giới luật chính thống cho tăng đoàn Nhật Bản."
        },
        {
          year: "Năm 1998",
          title: "UNESCO Công Nhận Di Sản Cố Đô Nara",
          desc: "Quần thể 8 di tích gồm chùa Todai-ji, Kofuku-ji, đền Kasuga Taisha, rừng nguyên sinh Kasugayama chính thức trở thành Di sản Văn hóa Thế giới."
        }
      ]
    },
    delicacies: [
      {
        name: "Kaki no Ha Zushi (Sushi Cuộn Lá Hồng)",
        nameJa: "柿の葉寿司",
        desc: "Món sushi cá hồi hoặc cá thu ngâm giấm bọc trong lá hồng tươi vùng Yoshino, ép chặt trong hộp gỗ qua đêm cho lên men dịu nhẹ.",
        icon: "🍣",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPUvQlssMCqPAXwEuHSNBhjRShh8B4gMIQCq-Eyi0LFbAklQZJienDO7bi&s=10",
        taste: "Thịt cá đậm đà ngậy béo, hạt cơm dẻo quyện hương thơm thanh khiết chống khuẩn đặc trưng của lá hồng.",
        orderingPhrase: "柿の葉寿司の詰め合わせをください (Kakinohazushi no tsumeawase o kudasai - Cho tôi hộp thập cẩm sushi lá hồng)"
      },
      {
        name: "Miến Lạnh Cố Đô Miwa Somen",
        nameJa: "三輪素麺",
        desc: "Sợi mì somen mỏng manh như sợi tơ làm thủ công suốt 1,200 năm dưới chân núi thiêng Miwa, ủ qua mùa đông rồi luộc chín ướp đá lạnh.",
        icon: "🍜",
        imageUrl: "https://nippontravel.vn/wp-content/uploads/2026/05/somen-1-600x600.webp",
        taste: "Sợi mì dai giòn trơn lướt mát lạnh, chấm nước tương dashi thơm nồng gừng tươi và hành lá mùa hè.",
        orderingPhrase: "冷やし三輪素麺をお願いします (Hiyashi Miwa somen o onegaishimasu - Cho tôi miến lạnh Miwa ướp đá)"
      },
      {
        name: "Bánh Mochi Ngải Cứu Nakatanidou",
        nameJa: "中谷堂よもぎ餅",
        desc: "Bánh mochi lá ngải cứu tươi được các nghệ nhân giã siêu tốc với tốc độ mắt thường khó thấy, lăn qua bột đậu nành rang Kinako thơm lừng.",
        icon: "🍡",
        imageUrl: "https://kilala.vn/data/uploads/2023/171120231359-1700204385-yomogi-mochi.jpg",
        taste: "Lớp vỏ nếp ấm mềm dẻo dai dậy mùi thơm thảo mộc ngải cứu, bọc trọn nhân đậu đỏ ngọt lịm tan chảy.",
        orderingPhrase: "出来立てのよmogi餅を二つ (Dekitate no yomogimochi o futatsu - Cho tôi 2 cái mochi ngải cứu mới giã)"
      },
      {
        name: "Cháo Trà Thiền Viện Chagayu",
        nameJa: "大和茶粥",
        desc: "Cháo gạo nếp nấu cùng nước trà rang Hojicha mộc mạc thanh tịnh, món điểm tâm truyền thống của các thiền viện Nara suốt hơn 1,000 năm.",
        icon: "🥣",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKCG9ie2P90S1KwIHCA8x4Cw-vpR3uA6xqwKhNW7Dobzy8aJgfF3HXvUQ&s=10",
        taste: "Vị bùi bùi nhẹ bụng, thoang thoảng hương thơm khói trà rang ăn kèm mận muối Umeboshi chua thanh kích thích tiêu hóa.",
        orderingPhrase: "朝の茶粥定食をください (Asa no chagayu teishoku o kudasai - Cho tôi set cháo trà buổi sáng)"
      }
    ],
    funFact: "Hơn 1,200 chú hươu tại công viên Nara biết cúi gập đầu (ojigi) chào du khách để xin bánh quy Shika-senbei!",
    stampJa: "奈良駅・記念印",
    scenicPhotos: [
      {
        url: "https://nippontravel.vn/wp-content/uploads/2024/03/todaiji-temple-1.webp",
        caption: "Chính điện Daibutsuden chùa Todai-ji vĩ đại 🏯",
        location: "Zoshicho, Nara",
        description: "Tòa kiến trúc bằng gỗ lớn nhất thế giới, nơi che chở cho pho tượng Đại Phật đồng đen uy nghi ngàn năm."
      },
      {
        url: "https://dulichminhanh.com.vn/wp-content/uploads/2024/05/cong-vien-nai-nara-nhat-ban-4.jpg",
        caption: "Đàn hươu thiêng thong dong dưới bóng phong 🦌",
        location: "Công viên Nara Park",
        description: "Những sứ giả thần linh hoang dã tự do tản bộ giữa thảm cỏ xanh và tiếp xúc thân thiện với du khách."
      },
      {
        url: "https://nippontravel.vn/wp-content/uploads/2024/08/Kasuga-Taisha-Shrine-10.webp",
        caption: "Đền Kasuga Taisha với 3,000 đèn lồng đồng 🏮",
        location: "Kasuganocho, Nara",
        description: "Hàng ngàn chiếc đèn lồng treo dọc hành lang đỏ thắm, thắp sáng lung linh trong lễ hội Mantoro thần bí."
      }
    ],
    culturalFacts: [
      { icon: "🦌", label: "Đàn hươu hoang dã", value: "Hơn 1,200 cá thể được bảo vệ như bảo vật quốc gia" },
      { icon: "🏛️", label: "Công trình gỗ lớn nhất", value: "Điện Daibutsuden Todai-ji rộng 57m, cao 49m" },
      { icon: "🖌️", label: "Cái nôi thư pháp", value: "Mực nho Nara-sumi và cọ lông viết thư pháp hàng đầu" },
      { icon: "🪵", label: "Chùa cổ nhất thế giới", value: "Chùa Horyu-ji bằng gỗ hơn 1,400 năm tuổi" }
    ],
    culturalArtifacts: [
      {
        title: "Đèn Lồng Đồng Thần Đạo Kasuga",
        titleJa: "春日大社釣燈籠 (Kasuga Tsuri-dōrō)",
        icon: "🏮",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIAPIRPhodEIY_m9cRHYfc4LHV26ihxQaSIMS1LX2lzeOKCXc_8CtHKjU&s=10",
        desc: "Hơn 3,000 chiếc đèn lồng bằng đá và đồng đúc chạm khắc hình hoa tử đằng và hươu rừng, do các tín đồ hiến tặng qua nhiều thế kỷ.",
        significance: "Ánh sáng xua đi u minh tăm tối, dẫn lối cho linh hồn và thần linh giáng thế ban phúc lành."
      },
      {
        title: "Mực Nho Thủ Công Nara-sumi",
        titleJa: "奈良墨 (Nara-sumi)",
        icon: "🖌️",
        imageUrl: "https://suigenkyo.store/cdn/shop/products/153854986.jpg?v=1661670776&width=800",
        desc: "Thỏi mực đen bóng mài thủ công từ muội than dầu hạt cải và keo tự nhiên, sản xuất mực chiếm 90% sản lượng toàn quốc.",
        significance: "Linh hồn của nghệ thuật Thư đạo (Shodo), tạo nên những nét chữ có độ bóng sâu và trường tồn hàng thiên niên kỷ."
      },
      {
        title: "Bánh Quy Thảo Dược Cho Hươu Shika-senbei",
        titleJa: "鹿せんべい (Shika-senbei)",
        icon: "🍪",
        imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTmwmwMtm4KFY1PmDeCt3IyOu8a0IdCZSSsc3ANK4kzOZOFNvsJoMgczgQ4-Mp8",
        desc: "Bánh tròn nướng từ cám gạo và bột mì không đường, có dán tem giấy ăn được do Quỹ Bảo tồn Hươu Nara chứng nhận.",
        significance: "Cầu nối giao lưu thân thiện giữa con người và thiên nhiên hoang dã suốt hàng trăm năm qua."
      }
    ],
    culturalEtiquette: [
      { title: "Cách cho hươu ăn văn minh", desc: "Giơ hai bàn tay lên báo hiệu đã hết bánh để hươu không bám theo vòi thêm.", icon: "🦌" },
      { title: "Tuyệt đối không trêu chọc hươu", desc: "Không giấu bánh sau lưng hoặc nhử rồi rút lại để tránh làm hươu giật mình dùng sừng húc.", icon: "⚠️" },
      { title: "Bảo vệ môi trường công viên", desc: "Không vứt rác túi nylon bừa bãi vì hươu có thể ăn nhầm gây nghẽn đường ruột.", icon: "🌿" }
    ],
    language: [
      { japanese: "鹿せんべいをください。", romaji: "Shika senbei o kudasai.", meaning: "Làm ơn bán cho tôi một tệp bánh quy cho hươu." },
      { japanese: "大仏様はとても大きいです！", romaji: "Daibutsu-sama wa totemo ōkii desu!", meaning: "Đức Đại Phật thật sự vô cùng uy nghi vĩ đại!" },
      { japanese: "お辞儀してくれてありがとう。", romaji: "Ojigi shite kurete arigatō.", meaning: "Cảm ơn chú hươu đã cúi đầu chào nhé." }
    ]
  },

  osaka: {
    landmark3D: "🐙",
    landmarkImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    highlights: ["Lâu đài thành quách Osaka-jo", "Phố ẩm thực đèn lồng neon Dotonbori", "Tháp Tsutenkaku khu phố cổ Shinsekai"],
    history: {
      eraName: "Thời kỳ Chiến Quốc Sengoku & 'Nhà Bếp Quốc Dân' (Tenka no Daidokoro)",
      summary: "Từng là hải cảng sầm uất Naniwa-kyo từ thế kỷ thứ 7, Osaka thực sự bước lên đỉnh cao lịch sử khi danh tướng Toyotomi Hideyoshi chọn nơi đây làm trung tâm quyền lực thống nhất non sông vào năm 1583 và xây dựng đại thành trì Osaka-jo với hào sâu lũy đá kiên cố bậc nhất.\n\nBước sang thời kỳ Edo, Osaka trở thành 'Nhà bếp của thiên hạ' (Tenka no Daidokoro). Hàng hóa, lúa gạo từ khắp mọi miền đất nước đổ về thương cảng Osaka. Sở giao dịch gạo Dojima tại đây chính là thị trường giao dịch hàng hóa tương lai đầu tiên trên thế giới.\n\nTinh thần thương gia thực tế, phóng khoáng và hài hước đã sản sinh ra văn hóa hài kịch Manzai danh tiếng và nền ẩm thực đường phố Kuidaore (ăn cho đến khi khánh kiệt).",
      famousFigure: "Lãnh chúa Toyotomi Hideyoshi, Nhà sáng lập mì ăn liền Momofuku Ando, Thương gia Dojima",
      milestones: [
        {
          year: "Năm 645",
          title: "Cải Cách Taika & Định Đô Naniwa-kyo",
          desc: "Thiên hoàng Kotoku dời đô về Naniwa-kyo bên bờ vịnh Osaka, mở cảng biển đầu tiên đón tiếp các sứ đoàn ngoại giao từ nhà Đường và bán đảo Triều Tiên."
        },
        {
          year: "Năm 1583",
          title: "Toyotomi Hideyoshi Xây Dựng Lâu Đài Osaka",
          desc: "Huy động hàng chục vạn nhân công xây dựng tòa lâu đài đồ sộ với tường đá nặng hàng trăm tấn và dát vàng lộng lẫy trên mái ngói, biến Osaka thành trái tim chính trị nước Nhật."
        },
        {
          year: "Năm 1615",
          title: "Trận Chiến Mùa Hè Osaka (Osaka Natsu no Jin)",
          desc: "Đại quân Tokugawa tiêu diệt tàn quân Toyotomi, kết thúc thời kỳ Chiến quốc loạn lạc đẫm máu và sáp nhập vùng thương mại Osaka trực tiếp dưới quyền Mạc phủ."
        },
        {
          year: "Năm 1730",
          title: "Sở Giao Dịch Gạo Dojima Ra Đời",
          desc: "Mạc phủ phê chuẩn sàn giao dịch gạo Dojima tại Osaka, phát minh ra hệ thống hợp đồng tương lai (Futures contract) đầu tiên trên toàn thế giới hiện đại."
        },
        {
          year: "Năm 1970",
          title: "Triển Lãm Thế Giới Osaka Expo '70",
          desc: "Đại hội thế giới đầu tiên tại châu Á với biểu tượng 'Tháp Mặt Trời' (Taiyo no To) của Okamoto Taro, thu hút 64 triệu lượt khách và khẳng định vị thế kinh tế toàn cầu của Nhật Bản."
        }
      ]
    },
    delicacies: [
      {
        name: "Bánh Bạch Tuộc Takoyaki Dotonbori",
        nameJa: "道頓堀たこ焼き",
        desc: "Viên bánh tròn xoe nướng trên khuôn gang đồng rực lửa, bên trong là miếng bạch tuộc tươi giòn sần sật, phủ xốt tương ngọt, sốt mayonnaise béo ngậy và cá ngừ bào katsuobushi nhảy múa.",
        icon: "🐙",
        imageUrl: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=700&q=80",
        taste: "Lớp vỏ ngoài xém giòn nóng bỏng, nhân trong béo mềm tan chảy cùng vị ngọt thơm của hải sản.",
        orderingPhrase: "たこ焼き一舟、マヨネーズ付きで (Takoyaki hitofune, mayonēzu tsuki de - Cho một thuyền Takoyaki kèm sốt mayo)"
      },
      {
        name: "Bánh Xèo Nhật Bản Okonomiyaki",
        nameJa: "大阪お好み焼き",
        desc: "Bánh xèo áp chảo dày dặn với bắp cải thái nhỏ, thịt ba chỉ heo giòn rụm, mực và tôm, quết sốt nâu đặc sánh thơm lừng tiêu chuẩn phong cách Osaka.",
        icon: "🥢",
        imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=700&q=80",
        taste: "Đậm đà ngậy béo, thơm lừng vị rong biển aonori và xốt chua ngọt kích thích vị giác.",
        orderingPhrase: "豚玉を一つ焼いてください (Butatama o hitotsu yaite kudasai - Hãy làm cho tôi một bánh xèo thịt heo trứng)"
      },
      {
        name: "Xiên Chiên Giòn Shinsekai Kushikatsu",
        nameJa: "新世界串カツ",
        desc: "Các xiên thịt bò, phô mai, măng tây nhúng bột xù chiên giòn tan ngập dầu, ăn kèm lá bắp cải tươi giòn ngọt tại phố đèn lồng Shinsekai.",
        icon: "🍢",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=700&q=80",
        taste: "Vỏ ngoài giòn rụm ráo dầu, nhân bên trong giữ trọn độ mọng nước tự nhiên.",
        orderingPhrase: "ソース二度づけ禁止ですね！ (Sōsu nidozuke kinshi desu ne! - Tuyệt đối không nhúng sốt lần hai đúng không ạ!)"
      },
      {
        name: "Mì Udon Đậu Hũ Ngọt Kitsune Udon",
        nameJa: "きつねうどん",
        desc: "Tô mì sợi to trắng ngần chan ngập nước dùng dashi Kansai thanh trong, đặt lên trên miếng đậu hũ chiên Aburaage to bản rim nước tương ngọt dịu.",
        icon: "🍜",
        imageUrl: "https://images.unsplash.com/photo-1618841557871-b4664fbf0cb3?w=700&q=80",
        taste: "Sợi mì mềm mướt trơn tuột, nước dùng thanh ngọt đậm vị cá ngừ và nấm hương shiitake.",
        orderingPhrase: "きつneうどんを温かい出汁で (Kitsune udon o atatakai dashi de - Cho tôi mì udon đậu ngọt nước dùng nóng)"
      }
    ],
    funFact: "Khẩu hiệu văn hóa ẩm thực nổi tiếng của Osaka là 'Kuidaore' — nghĩa là ăn uống thỏa thích cho đến khi khánh kiệt!",
    stampJa: "大阪駅・記念印",
    scenicPhotos: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
        caption: "Lâu đài Osaka-jo lộng lẫy giữa trời xuân 🏯",
        location: "Chuo-ku, Osaka",
        description: "Thành trì kiêu hãnh với tháp chính 8 tầng và những phiến đá khổng lồ ghép không cần vữa kiên cố."
      },
      {
        url: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&q=80",
        caption: "Biển hiệu Vận động viên Glico phố Dotonbori 🏃",
        location: "Dotonbori, Namba",
        description: "Bảng quảng cáo đèn neon biểu tượng chạy suốt gần một thế kỷ bên dòng kênh Dotonbori sôi động."
      },
      {
        url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
        caption: "Khu phố cổ Retro Shinsekai & Tháp Tsutenkaku 🗼",
        location: "Shinsekai, Naniwa-ku",
        description: "Khu phố giải trí mang hơi thở thời kỳ Chiêu Hòa Showa với các quán xiên que Kushikatsu rực rỡ sắc màu."
      }
    ],
    culturalFacts: [
      { icon: "🍴", label: "Tinh thần ẩm thực", value: "'Kuidaore' — Ăn ngon sành điệu đến quên cả túi tiền" },
      { icon: "🎭", label: "Nghệ thuật hài kịch", value: "Cái nôi hài đối thoại Manzai & sân khấu kịch Yoshimoto" },
      { icon: "🛍️", label: "Phố mua sắm dài nhất", value: "Tenjinbashi-suji kéo dài 2.6 km với hơn 600 cửa hiệu" },
      { icon: "🤝", label: "Tính cách con người", value: "Thân thiện, cởi mở, dí dỏm và thẳng thắn bậc nhất Nhật Bản" }
    ],
    culturalArtifacts: [
      {
        title: "Tượng Thần May Mắn Bàn Chân Vàng Billiken",
        titleJa: "通天閣のビリケンさん (Billiken-san)",
        icon: "🗿",
        imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80",
        desc: "Bức tượng vị thần nụ cười ngộ nghĩnh đặt trên đỉnh tháp Tsutenkaku với đôi bàn chân hướng ra ngoài.",
        significance: "Người ta tin rằng xoa vào lòng bàn chân của ngài Billiken sẽ mang lại may mắn, đỗ đạt và tài lộc tràn trề."
      },
      {
        title: "Trống Taiko Lễ Hội Tenjin Matsuri",
        titleJa: "天神祭の太鼓 (Tenjin Matsuri Taiko)",
        icon: "🥁",
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80",
        desc: "Dàn trống Taiko vang dội trên những chiếc thuyền rực lửa hoa đăng xuôi dòng sông Okawa trong đại lễ hội mùa hạ.",
        significance: "Một trong 3 lễ hội lớn nhất Nhật Bản với hơn 1,000 năm lịch sử tôn vinh thần học vấn Sugawara no Michizane."
      },
      {
        title: "Chảo Gang Nướng Bánh Bạch Tuộc Đồng Thau",
        titleJa: "たこ焼き銅板 (Takoyaki Dōban)",
        icon: "🍳",
        imageUrl: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=600&q=80",
        desc: "Chiếc chảo bằng đồng đỏ dẫn nhiệt siêu tốc với hàng chục lỗ bán cầu, dụng cụ gia truyền của mỗi gia đình Osaka.",
        significance: "Văn hóa quây quần gia đình ấm cúng, nơi mỗi đứa trẻ Osaka lớn lên đều tự hào là chuyên gia lật bánh."
      }
    ],
    culturalEtiquette: [
      { title: "Luật xiên que Kushikatsu", desc: "Tuyệt đối KHÔNG nhúng xiên đã cắn dở vào hũ sốt chung trên bàn (Quy tắc 'Nidozuke Kinshi').", icon: "🍢" },
      { title: "Đứng thang cuốn ở Kansai", desc: "Tại Osaka, người đi đứng yên nép sang bên PHẢI thang cuốn (ngược lại với Tokyo đứng bên trái).", icon: "🚇" },
      { title: "Văn hóa trò chuyện mua sắm", desc: "Đừng ngần ngại trò chuyện, hỏi thăm vui vẻ với các chủ quán thân thiện ở chợ Kuromon.", icon: "💬" }
    ],
    language: [
      { japanese: "なんでやねん！", romaji: "Nandeyanen!", meaning: "Cái quái gì thế này! (Câu cảm thán bông đùa kinh điển phương ngữ Osaka)" },
      { japanese: "おおきに、また来てな！", romaji: "Ōkini, mata kite na!", meaning: "Cảm ơn nhiều nghen, bữa sau lại ghé nữa nha!" },
      { japanese: "めっちゃうまい！", romaji: "Metcha umai!", meaning: "Món này ngon đỉnh nóc kịch trần luôn á!" }
    ]
  },

  nagoya: {
    landmark3D: "🏯",
    landmarkImage: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    highlights: ["Lâu đài Nagoya & Cặp cá kình vàng Kinshachi", "Đền cổ Atsuta Jingu giữ gươm báu Kusanagi", "Bảo tàng Kỹ nghệ Ô tô Toyota"],
    history: {
      eraName: "Quê Hương Ba Vị Tướng Thống Nhất Non Sông & Gia Tộc Owari Tokugawa",
      summary: "Nagoya (xứ Owari cổ) giữ vị trí độc tôn trong lịch sử Nhật Bản: đây là quê hương của cả 'Ba anh hùng thống nhất thiên hạ' vĩ đại nhất thời Chiến quốc — Oda Nobunaga, Toyotomi Hideyoshi và Tokugawa Ieyasu.\n\nNăm 1610, Tokugawa Ieyasu cho xây dựng lâu đài Nagoya kiên cố làm cứ điểm cho chi trưởng Owari Tokugawa — một trong ba nhánh quyền lực nhất của dòng họ Tokugawa. Cặp tượng cá kình đầu rồng đuôi cá dát vàng ròng Kinshachi trên nóc lâu đài trở thành biểu tượng cho quyền uy tột đỉnh.\n\nĐền thần Atsuta Jingu hơn 1,900 năm tuổi tại đây là nơi phụng thờ thanh bảo kiếm huyền thoại Kusanagi no Tsurugi (Thảo Thế Kiếm) — một trong Tam Chủng Thần Khí của Hoàng gia Nhật Bản.\n\nNgày nay, kế thừa truyền thống rèn kiếm và chế tác đồng hồ cơ Karakuri thời Edo, Nagoya vươn lên thành thủ phủ công nghiệp chế tạo cơ khí (Monozukuri) hàng đầu thế giới với tập đoàn Toyota.",
      famousFigure: "Oda Nobunaga, Toyotomi Hideyoshi, Tokugawa Ieyasu, Sáng lập viên Kiichiro Toyoda",
      milestones: [
        {
          year: "Năm 113",
          title: "Đền Atsuta Jingu Phụng Thờ Bảo Kiếm Kusanagi",
          desc: "Đền thờ được thành lập để lưu giữ thanh kiếm thiêng Kusanagi no Tsurugi do công chúa Yamato Hime trao cho người anh hùng Yamato Takeru chém lửa dẹp loạn."
        },
        {
          year: "Năm 1560",
          title: "Oda Nobunaga Đại Phá Quân Imagawa Tại Okehazama",
          desc: "Chỉ với 2,000 quân, Oda Nobunaga đã táo bạo tập kích tiêu diệt đạo quân 25,000 người của Imagawa Yoshimoto trong cơn bão lớn, làm chấn động toàn bộ nước Nhật."
        },
        {
          year: "Năm 1610",
          title: "Tokugawa Ieyasu Xây Lâu Đài Nagoya & Đúc Cá Kình Vàng",
          desc: "Lâu đài Nagoya được khởi công cùng cặp cá kình rồng bằng vàng lá Kinshachi nặng gần 200kg vàng ròng, biểu trưng cho sự bất diệt và chống hỏa hoạn."
        },
        {
          year: "Thời kỳ Edo",
          title: "Phát Triển Gốm Sứ Seto & Búp Bê Cơ Học Karakuri",
          desc: "Nghệ thuật làm gốm Seto-yaki và chế tác búp bê tự động Karakuri ningyo đặt nền móng tư duy kỹ thuật cơ khí chính xác cho nước Nhật."
        },
        {
          year: "Thời kỳ Hiện đại",
          title: "Thủ Phủ Ô Tô Toyota & Công Nghiệp Toàn Cầu",
          desc: "Từ xưởng dệt tự động Toyoda chuyển mình thành tập đoàn xe hơi số một hành tinh, biến vùng Nagoya thành đầu tàu kinh tế công nghiệp hùng mạnh nhất Nhật Bản."
        }
      ]
    },
    delicacies: [
      {
        name: "Cơm Lươn Nướng Than Hoa Hitsumabushi",
        nameJa: "ひつまぶし (名古屋名物)",
        desc: "Lươn nướng than củi giòn da mềm thịt quết nước xốt tare bí truyền thái nhỏ trên thau cơm gỗ Ohitsu, thưởng thức theo nghi thức 3 bước độc đáo.",
        icon: "🍱",
        imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=700&q=80",
        taste: "Hương khói than thơm lừng, thịt lươn béo ngậy ngọt đậm, bước cuối chan nước dùng dashi thanh ngọt tạo nên dư vị tuyệt hảo.",
        orderingPhrase: "ひつまぶしを一つ、お茶漬け用出汁付きで (Hitsumabushi o hitotsu, ochazuke-yō dashi tsuki de - Cho một phần cơm lươn kèm nước dashi)"
      },
      {
        name: "Thịt Heo Chiên Sốt Miso Đỏ Miso Katsu",
        nameJa: "味噌カツ (矢場とん風)",
        desc: "Miếng sườn heo cốt lết lăn bột chiên vàng rộm ngập tràn nước sốt Miso đỏ Hatcho ủ lên men tự nhiên 3 năm trong thùng gỗ sồi.",
        icon: "🥩",
        imageUrl: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=700&q=80",
        taste: "Vỏ giòn tan, thịt ngọt mọng nước hòa cùng vị miso đỏ đậm đà hơi ngòn ngọt độc bản xứ Nagoya.",
        orderingPhrase: "味噌カツ定食、ご飯大盛りで (Misokatsu teishoku, gohan ōmori de - Cho set cơm heo chiên sốt miso, thêm cơm lớn)"
      },
      {
        name: "Cánh Gà Chiên Giòn Cay Ngọt Tebasaki",
        nameJa: "手羽先唐揚げ",
        desc: "Cánh gà chiên giòn hai lần không tẩm bột, quét lớp men tương ngọt đậm và rắc nhiều hạt tiêu trắng cùng mè thơm giòn rụm.",
        icon: "🍗",
        imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=700&q=80",
        taste: "Vỏ ngoài giòn tan kêu tanh tách, cay nồng hạt tiêu tê tê đầu lưỡi là món nhắm bia số một.",
        orderingPhrase: "手羽先一人前と生ビールを！ (Tebasaki ichininmae to namabīru o! - Cho một phần cánh gà và một ly bia tươi!)"
      },
      {
        name: "Mì Bản Dẹt Truyền Thống Kishimen",
        nameJa: "きしめん",
        desc: "Sợi mì lúa mì cán mỏng dẹt như dải lụa luộc mềm chan nước súp dashi cá ngừ đậm đặc, rắc đầy hành lá và phôi cá bào nhảy múa.",
        icon: "🍜",
        imageUrl: "https://images.unsplash.com/photo-1618841557871-b4664fbf0cb3?w=700&q=80",
        taste: "Sợi mì trơn tuột mềm mại quyện vị ngọt béo mặn mà của nước dùng đậu nành miso truyền thống.",
        orderingPhrase: "きしめんを温かい汁でお願いします (Kishimen o atatakai shiru de onegaishimasu - Cho tôi tô mì dẹt kishimen nóng hổi)"
      }
    ],
    funFact: "Cặp tượng cá kình vàng Kinshachi trên nóc lâu đài Nagoya được dát bằng hơn 88kg vàng ròng 18-karat nguyên chất!",
    stampJa: "名古屋駅・記念印",
    scenicPhotos: [
      {
        url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
        caption: "Lâu đài Nagoya và đôi cá kình vàng Kinshachi 🏯",
        location: "Naka-ku, Nagoya",
        description: "Tòa thành tráng lệ với cung điện Hommaru Palace phục dựng lộng lẫy bằng gỗ bách Hinoki nguyên khối."
      },
      {
        url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
        caption: "Đền cổ Atsuta Jingu tĩnh mịch giữa rừng thiêng ⛩️",
        location: "Atsuta-ku, Nagoya",
        description: "Ngôi đền cổ kính gần 2 thiên niên kỷ cất giữ thanh kiếm báu Kusanagi no Tsurugi huyền thoại của hoàng gia."
      },
      {
        url: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&q=80",
        caption: "Tháp truyền hình Mirai Tower & Công viên Sakae 🗼",
        location: "Hisaya Odori Park",
        description: "Ngọn tháp truyền hình đầu tiên của Nhật Bản soi bóng hồ nước lung linh giữa trung tâm hiện đại."
      }
    ],
    culturalFacts: [
      { icon: "🚗", label: "Trung tâm sản xuất ô tô", value: "Vùng đất khai sinh ra đế chế ô tô Toyota toàn cầu" },
      { icon: "🏺", label: "Đồ gốm Seto-yaki", value: "Lịch sử nghìn năm khiến từ 'setomono' trở thành từ đồng nghĩa với đồ gốm" },
      { icon: "☕", label: "Văn hóa cà phê sáng", value: "'Morning Service' — Gọi cà phê được tặng kèm bánh mì nướng và trứng" },
      { icon: "🏯", label: "Cá kình vàng Kinshachi", value: "Linh vật nửa rồng nửa cá bảo hộ chống hỏa hoạn và mang lại mưa lành" }
    ],
    culturalArtifacts: [
      {
        title: "Tượng Cá Kình Đầu Rồng Dát Vàng Kinshachi",
        titleJa: "金鯱 (Kinshachi - Cá kình vàng)",
        icon: "🐉",
        imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
        desc: "Linh thú thần thoại đầu rồng đuôi cá uốn lượn dát vàng lá đặt trên hai đầu hồi mái tháp lâu đài Nagoya.",
        significance: "Thần thú có quyền năng hô mưa gọi gió dập tắt hỏa hoạn và biểu tượng quyền uy tối cao của Mạc chúa Tokugawa."
      },
      {
        title: "Gốm Sứ Men Xanh Seto-yaki Cổ Điển",
        titleJa: "瀬戸焼 (Seto-yaki)",
        icon: "🏺",
        imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
        desc: "Dòng đồ gốm tráng men lâu đời nhất trong Lục đại Cổ diêu Nhật Bản với men tro xanh ngọc Ofuke và men vàng kii-zeto.",
        significance: "Đỉnh cao của chén uống trà và bát ăn hàng ngày đồng hành cùng sự phát triển của Trà đạo Samurai."
      },
      {
        title: "Tương Đậu Nành Lên Men Hatcho Miso 3 Năm",
        titleJa: "八丁味噌 (Hatchō Miso)",
        icon: "🥣",
        imageUrl: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&q=80",
        desc: "Loại tương miso đỏ đen sẫm chỉ làm từ hạt đậu nành chọn lọc, nén bằng hàng tấn đá tảng và ủ ròng rã hơn hai mùa đông.",
        significance: "Nguồn dưỡng chất kiên cường cung cấp thể lực bền bỉ cho các đoàn quân Samurai thời Chiến quốc."
      }
    ],
    culturalEtiquette: [
      { title: "Cách ăn cơm lươn Hitsumabushi", desc: "Chia thau cơm làm 4 phần: Phần 1 ăn nguyên bản, phần 2 rắc gia vị hành rong biển, phần 3 chan nước dashi, phần 4 ăn theo cách mình thích nhất.", icon: "🍱" },
      { title: "Văn hóa cà phê sáng Morning Service", desc: "Hãy ghé quán cà phê trước 11h trưa để được tặng miễn phí bánh mì bơ nướng sốt đậu đỏ Ogura.", icon: "☕" },
      { title: "Kính cẩn tại đền Atsuta", desc: "Không bước vào giữa lối đi chính dẫn vào cổng Torii vì đó là lối đi của các vị thần linh.", icon: "⛩️" }
    ],
    language: [
      { japanese: "どえりゃあうみゃあ！", romaji: "Doeryā umyā!", meaning: "Trời ơi ngon kinh khủng khiếp! (Tiếng địa phương Nagoya-ben)" },
      { japanese: "モーニングをお願いします。", romaji: "Mōningu o onegaishimasu.", meaning: "Cho tôi một phần bữa sáng cà phê kèm bánh mì nướng nhé." },
      { japanese: "名古屋城はどちらですか？", romaji: "Nagoya-jō wa dochira desu ka?", meaning: "Lối đi đến Lâu đài Nagoya theo hướng nào vậy ạ?" }
    ]
  },

  fuji: {
    landmark3D: "🗻",
    landmarkImage: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&q=80",
    highlights: ["Chùa Chureito Pagoda ngắm đỉnh Phú Sĩ", "Hồ Ashi hồ núi lửa soi bóng cổng Torii", "Thung lũng khói lưu huỳnh Owakudani"],
    history: {
      eraName: "Tín Ngưỡng Núi Thiêng Fujisan & Trạm Kiểm Soát Quan Sở Tokaido",
      summary: "Cao 3,776 mét, núi Phú Sĩ (Fujisan) không chỉ là đỉnh núi cao nhất Nhật Bản mà còn là linh hồn tâm linh ngự trị trong tâm thức người dân từ ngàn xưa. Người cổ đại tôn kính ngọn núi lửa là nơi ngự trị của nữ thần Asama no Okami (Konohanasakuya-hime).\n\nTừ thời kỳ Heian, các tu sĩ khổ hạnh Shugendo đã leo lên đỉnh thiêng để tu tập. Đến thời Edo, tín ngưỡng 'Fuji-ko' phát triển rực rỡ, hàng vạn thường dân mặc áo trắng hành hương trèo lên miệng núi lửa để ngắm cảnh bình minh linh thiêng Goraiko.\n\nThị trấn Hakone dưới chân núi là trạm kiểm soát quân sự Hakone Sekisho nghiêm ngặt nhất trên con đường huyết mạch Tokaido nối liền Tokyo và Kyoto. Năm 2013, UNESCO đã công nhận núi Phú Sĩ là Di sản Văn hóa Thế giới (thay vì di sản tự nhiên) bởi giá trị nguồn cảm hứng nghệ thuật bất tận cho thi ca và hội họa Ukiyo-e của Hokusai.",
      famousFigure: "Nữ thần Konohanasakuya-hime, Danh họa Katsushika Hokusai, Nhà thơ Matsuo Basho",
      milestones: [
        {
          year: "Thế kỷ thứ 8",
          title: "Thi Tuyển Vạn Diệp Tập (Manyoshu) Tôn Vinh Phú Sĩ",
          desc: "Những bài thơ cổ ca ngợi núi Phú Sĩ là ngọn núi thần bất tử sừng sững giữa cõi trời đất, lưu giữ linh dược trường sinh."
        },
        {
          year: "Năm 1619",
          title: "Thiết Lập Trạm Quan Sở Hakone Sekisho",
          desc: "Mạc phủ Tokugawa lập trạm kiểm soát gắt gao trên đèo núi hiểm trở Hakone nhằm ngăn chặn súng đạn lọt vào Edo và phụ nữ con tin trốn thoát."
        },
        {
          year: "Năm 1831",
          title: "Hokusai Xuất Bản '36 Cảnh Núi Phú Sĩ'",
          desc: "Kiệt tác tranh khắc gỗ Ukiyo-e 'Sóng lừng ngoài khơi Kanagawa' và 'Phú Sĩ đỏ' ra đời, tạo nên làn sóng ảnh hưởng mạnh mẽ đến trường phái Ấn tượng châu Âu."
        },
        {
          year: "Năm 1860",
          title: "Người Nước Ngoài Đầu Tiên Chinh Phục Đỉnh Phú Sĩ",
          desc: "Nhà ngoại giao người Anh Rutherford Alcock trở thành người nước ngoài đầu tiên leo lên đỉnh núi lửa thiêng, mở đường cho du lịch khám phá quốc tế."
        },
        {
          year: "Năm 2013",
          title: "UNESCO Vinh Danh Phú Sĩ Là Di Sản Văn Hóa Thế Giới",
          desc: "Được ghi danh là di sản văn hóa với tiêu chí 'Nguồn cảm hứng nghệ thuật và địa điểm linh thiêng', khẳng định biểu tượng vĩnh cửu của tâm hồn nước Nhật."
        }
      ]
    },
    delicacies: [
      {
        name: "Trứng Đen Núi Lửa Kuro-tamago Owakudani",
        nameJa: "大涌谷の黒たまご",
        desc: "Trứng gà tươi luộc trong các hồ nước khoáng nóng giàu lưu huỳnh và sắt ở thung lũng Owakudani, vỏ trứng chuyển thành màu đen tuyền bóng bẩy.",
        icon: "🥚",
        imageUrl: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=700&q=80",
        taste: "Lòng trắng mịn màng béo ngậy ngấm khoáng chất tự nhiên, ăn một quả truyền thuyết tăng thêm 7 năm tuổi thọ.",
        orderingPhrase: "黒たまごを一袋ください (Kurotamago o hitofukuro kudasai - Cho tôi một túi 5 quả trứng đen)"
      },
      {
        name: "Lẩu Mì Hōtō Bí Đỏ Yamanashi",
        nameJa: "山梨ほうとう鍋",
        desc: "Sợi mì cán bản dẹt dày nấu trực tiếp trong nồi gang cùng bí đỏ kabocha ngọt lịm, nấm hương rừng, khoai môn và nước dùng tương Miso vùng cao nguyên.",
        icon: "🍲",
        imageUrl: "https://images.unsplash.com/photo-1618841557871-b4664fbf0cb3?w=700&q=80",
        taste: "Nước lẩu sánh đặc ngọt bùi tự nhiên từ bí đỏ ninh nhừ, húp một thìa làm ấm bừng cơ thể giữa mùa đông lạnh giá.",
        orderingPhrase: "かぼちゃほうとうを一つ (Kabocha hōtō o hitotsu - Cho một phần mì Hoto bí đỏ nóng hổi)"
      },
      {
        name: "Mì Xào Núi Phú Sĩ Fujinomiya Yakisoba",
        nameJa: "富士宮やきそば",
        desc: "Món mì xào dai giòn độc nhất vô nhị làm từ sợi mì hấp xào trên chảo phẳng với mỡ tóp heo nướng giòn và rắc bột cá mòi khô thơm nức.",
        icon: "🥢",
        imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=700&q=80",
        taste: "Sợi mì dai sần sật đậm đà sốt Worcestershire thơm béo mỡ tóp heo giòn giã và gừng đỏ ngâm chua.",
        orderingPhrase: "富士宮やきそば大盛り、目玉焼き乗せで (Fujinomiya yakisoba ōmori, medamayaki nose de - Cho đĩa mì xào lớn thêm trứng ốp la)"
      },
      {
        name: "Váng Đậu Tươi Hấp Sốt Trứng Yubadon Hakone",
        nameJa: "箱根湯葉丼",
        desc: "Từng lớp váng đậu yuba non làm thủ công từ nguồn nước khoáng tinh khiết Hakone, thả vào nước dùng dashi nấm ninh liu riu cùng trứng gà bông xốp trút lên cơm nóng.",
        icon: "🍚",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80",
        taste: "Thanh tao vô cùng, béo nhẹ vị đậu nành nguyên chất và nước súp ngọt lành thơm dịu.",
        orderingPhrase: "湯葉丼御膳をいただけますか (Yubadon gozen o itadakemasu ka - Cho tôi một set cơm váng đậu Yubadon)"
      }
    ],
    funFact: "Núi Phú Sĩ thực chất là một ngọn núi lửa gồm 3 tầng xếp chồng lên nhau: Komitake cổ xưa, Kofuji và Phú Sĩ hiện đại ngày nay!",
    stampJa: "富士山・登頂記念印",
    scenicPhotos: [
      {
        url: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&q=80",
        caption: "Tháp Chureito Pagoda nhìn về chóp tuyết Phú Sĩ 🌸",
        location: "Fujiyoshida, Yamanashi",
        description: "Bức tranh phong cảnh ngoạn mục nhất thế giới với hoa anh đào, ngôi chùa 5 tầng đỏ thắm và đỉnh núi tuyết trắng."
      },
      {
        url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
        caption: "Cổng Torii hòa bình trên mặt hồ Ashi Hakone ⛩️",
        location: "Hồ Ashinoko, Hakone",
        description: "Cổng Torii đỏ son sừng sững giữa làn nước xanh thẳm của hồ miệng núi lửa dưới chân rặng Hakone."
      },
      {
        url: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800&q=80",
        caption: "Thung lũng khói địa nhiệt lửa Owakudani 🌋",
        location: "Owakudani, Hakone",
        description: "Vùng đất núi lửa còn hoạt động với những cột khói lưu huỳnh bốc nghi ngút và các suối nước khoáng sôi ùng ục."
      }
    ],
    culturalFacts: [
      { icon: "🗻", label: "Độ cao đỉnh núi", value: "3,776 mét — Nóc nhà linh thiêng của xứ sở Mặt Trời Mọc" },
      { icon: "♨️", label: "Suối khoáng nóng", value: "Hơn 20 khu suối khoáng Onsen trứ danh tại thung lũng Hakone" },
      { icon: "🌅", label: "Khoảnh khắc Goraiko", value: "Ngắm bình minh đầu tiên từ trên miệng núi lửa là ước nguyện cả đời" },
      { icon: "🎨", label: "Nguồn cảm hứng Ukiyo-e", value: "Hàng trăm danh họa khắc họa ngọn núi qua bốn mùa xuân hạ thu đông" }
    ],
    culturalArtifacts: [
      {
        title: "Bộ Tranh Ukiyo-e '36 Cảnh Núi Phú Sĩ' Hokusai",
        titleJa: "富嶽三十六景 (Fugaku Sanjūrokkei)",
        icon: "🌊",
        imageUrl: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600&q=80",
        desc: "Tuyệt tác tranh in mộc bản thế kỷ 19 của bậc thầy Katsushika Hokusai khắc họa đỉnh Phú Sĩ từ mọi góc độ thời gian.",
        significance: "Di sản mỹ thuật kinh điển truyền tải vẻ đẹp vĩnh cửu của tự nhiên và sức sống mãnh liệt của con người."
      },
      {
        title: "Gậy Leo Núi Hành Hương Kongotsue",
        titleJa: "金剛杖 (Kongōzue - Gậy kim cương)",
        icon: "🦯",
        imageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80",
        desc: "Gậy gỗ bát giác đồng hành cùng người leo núi, qua mỗi trạm dừng chân trên núi sẽ được đóng một con dấu sắt nung đỏ rực.",
        significance: "Minh chứng cho ý chí kiên định vượt qua gian nan để chạm tới đỉnh cao vinh quang và thức tỉnh tâm linh."
      },
      {
        title: "Khảm Gỗ Ghép Hình Học Yosegi-zaiku Hakone",
        titleJa: "箱根寄木細工 (Yosegi-zaiku)",
        icon: "🪵",
        imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80",
        desc: "Nghệ thuật ghép các thanh gỗ tự nhiên mang màu sắc khác nhau thành khối hoa văn hình học rồi bào mỏng dán lên hộp bí mật.",
        significance: "Kỹ nghệ thủ công đỉnh cao thời Edo với những chiếc hộp cơ quan đòi hỏi hàng chục bước trượt mới mở được nắp."
      }
    ],
    culturalEtiquette: [
      { title: "Quy tắc leo núi Phú Sĩ có trách nhiệm", desc: "Mang toàn bộ rác thải xuống núi, tuyệt đối không bước chệch khỏi đường mòn quy định để bảo vệ hệ thực vật núi cao.", icon: "🗻" },
      { title: "Nghi thức tắm khoáng nóng Onsen", desc: "Tắm rửa kỳ cọ thật sạch sẽ bằng xà phòng trước khi bước chân vào bồn ngâm khoáng; không nhúng khăn tắm vào nước.", icon: "♨️" },
      { title: "Chuẩn bị trang phục leo núi", desc: "Nhiệt độ trên đỉnh núi ban đêm có thể xuống dưới 0 độ C, cần mang đủ áo ấm chắn gió và đèn pin đeo trán.", icon: "🧥" }
    ],
    language: [
      { japanese: "富士山がきれいに見えますね！", romaji: "Fujisan ga kirei ni miemasu ne!", meaning: "Hôm nay nhìn ngọn núi Phú Sĩ thật rõ và đẹp quá nhỉ!" },
      { japanese: "ご来光は素晴らしかったです。", romaji: "Goraikō wa subarashikatta desu.", meaning: "Ánh bình minh trên đỉnh thiêng thật sự vô cùng diệu kỳ." },
      { japanese: "いい湯ですね。", romaji: "Ii yu desu ne.", meaning: "Nước suối khoáng nóng ngâm thật là sảng khoái dễ chịu!" }
    ]
  },

  hiroshima: {
    landmark3D: "🕊️",
    landmarkImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    highlights: ["Cổng Torii nổi đảo thần Miyajima", "Vòm Nguyên Tử Genbaku Dome di sản", "Công viên Tưởng niệm Hòa bình & Rừng Hạc giấy"],
    history: {
      eraName: "Thành Trì Gia Tộc Mori, Thần Xã Nổi Miyajima & Thành Phố Hòa Bình Toàn Cầu",
      summary: "Được xây dựng trên vùng châu thổ sông Ota màu mỡ, Hiroshima khởi đầu là thành trì của danh tướng Mori Motonari vào thời Chiến quốc. Tòa thành Hiroshima-jo (còn gọi là Thành Cá Chép Riji) được khởi công năm 1589.\n\nNgoài khơi vịnh Hiroshima là hòn đảo thiêng Miyajima, nơi lãnh chúa Taira no Kiyomori cho xây dựng đền Itsukushima vào năm 1168 với chiếc cổng Torii bằng gỗ long não đỏ rực cắm sâu dưới đáy biển, nổi bồng bềnh mỗi khi thủy triều dâng cao.\n\nVào lúc 8 giờ 15 phút sáng ngày 6 tháng 8 năm 1945, quả bom nguyên tử đầu tiên trong lịch sử loài người đã phát nổ trên bầu trời Hiroshima, san phẳng gần như toàn bộ thành phố trong chớp mắt. Tuy nhiên, từ đống tro tàn đổ nát, cây cối đâm chồi và người dân Hiroshima đã kiên cường tái sinh thành phố trở thành Biểu tượng Quốc tế của Hòa bình và phi vũ khí hạt nhân.",
      famousFigure: "Danh tướng Mori Motonari, Lãnh chúa Taira no Kiyomori, Cô bé Sadako Sasaki cùng ngàn cánh hạc giấy",
      milestones: [
        {
          year: "Năm 1168",
          title: "Taira no Kiyomori Xây Đền Nổi Itsukushima",
          desc: "Tướng quân Taira no Kiyomori tôn tạo ngôi đền Shinto trên mặt biển vịnh đảo Miyajima để cảm tạ thần biển cả bảo hộ con đường giao thương hàng hải Seto."
        },
        {
          year: "Năm 1589",
          title: "Mori Terumoto Khởi Công Xây Thành Cá Chép",
          desc: "Cháu nội danh tướng Mori Motonari chọn dải đất châu thổ sông Ota đặt tên là Hiroshima ('Hòn đảo rộng lớn') và dựng nên lâu đài Hiroshima-jo sầm uất."
        },
        {
          year: "Ngày 6/8/1945",
          title: "Thảm Họa Bom Nguyên Tử & Chứng Tích Vòm Genbaku",
          desc: "Vụ nổ nguyên tử phá hủy thành phố, cướp đi sinh mạng hơn 140,000 thường dân. Tòa nhà Hội trường Triển lãm Công nghiệp còn sót lại khung vòm thép trơ trọi trở thành chứng tích chiến tranh."
        },
        {
          year: "Năm 1949",
          title: "Quốc Hội Ban Hành Đạo Luật Thành Phố Hòa Bình",
          desc: "Chính phủ phê chuẩn việc tái thiết Hiroshima thành 'Thành phố Kỷ niệm Hòa bình', xây dựng công viên tưởng niệm và đài tháp ngọn lửa hòa bình cháy mãi."
        },
        {
          year: "Năm 1996",
          title: "UNESCO Công Nhận Đồng Thời Hai Di Sản Thế Giới",
          desc: "Vòm Bom Nguyên Tử Genbaku Dome và Đền Thần Đạo Itsukushima cùng lúc được vinh danh là Di sản Thế giới, gửi gắm thông điệp hòa bình và vẻ đẹp tâm linh bất diệt."
        }
      ]
    },
    delicacies: [
      {
        name: "Hiroshima Okonomiyaki Mì Sợi Xếp Lớp",
        nameJa: "広島風お好み焼き",
        desc: "Khác với phong cách Osaka trộn bột, bánh xèo Hiroshima được xếp từng lớp riêng biệt: đế bánh mỏng, núi bắp cải ngọt lịm, thịt ba chỉ, mì yakisoba chiên giòn và trứng ốp la trải sốt Otafuku đậm đà.",
        icon: "🥢",
        imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=700&q=80",
        taste: "Hòa quyện bùng nổ giữa sợi mì giòn dai, bắp cải xào chín tới ngọt mọng và nước xốt mặn ngọt đậm vị.",
        orderingPhrase: "そば入り肉玉をお願いします (Soba iri nikutama o onegaishimasu - Cho một bánh xèo mì sợi thịt heo trứng)"
      },
      {
        name: "Hàu Nướng Vịnh Miyajima Than Hồng (Yaki Kaki)",
        nameJa: "宮島焼き牡蠣",
        desc: "Những con hàu sữa béo mẫm đánh bắt từ các bè tre vùng biển nội địa Seto, nướng nguyên vỏ trên than hoa xèo xèo, vắt chanh tươi hoặc nhỏ giọt tương Shoyu.",
        icon: "🦪",
        imageUrl: "https://images.unsplash.com/photo-1559742811-822873691df8?w=700&q=80",
        taste: "Ngọt đậm đà hương vị biển cả, thịt hàu mọng sữa béo ngậy mềm tan trong miệng.",
        orderingPhrase: "焼き牡蠣を一皿、レモン添えで (Yaki kaki o hitosara, remon soe de - Cho một đĩa hàu nướng than kèm chanh)"
      },
      {
        name: "Bánh Bông Lan Lá Phong Momiji Manju",
        nameJa: "もみじ饅頭",
        desc: "Món bánh ngọt biểu tượng hình chiếc lá phong mùa thu nướng vàng ươm xốp mềm, nhân đậu đỏ mịn truyền thống, phô mai dẻo hoặc kem sữa matcha béo ngậy.",
        icon: "🍁",
        imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=700&q=80",
        taste: "Lớp vỏ bánh thơm lừng mùi trứng sữa, nhân đậu đỏ sên ngọt dịu thưởng thức tuyệt hảo cùng tách trà xanh nóng.",
        orderingPhrase: "揚げもみじ饅頭を一つ (Age momiji manjū o hitotsu - Cho tôi một chiếc bánh lá phong chiên giòn)"
      },
      {
        name: "Mì Trộn Cay Nồng Hiroshima Tsukemen",
        nameJa: "広島つけ麺",
        desc: "Tô mì sợi ramen ướp đá lạnh giòn giòn ăn kèm dưa chuột thái sợi, bắp cải luộc ngọt và thịt xá xíu, chấm vào bát nước tương ớt mè đỏ rực cay nồng.",
        icon: "🍜",
        imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700&q=80",
        taste: "Vị cay nồng ấm từ ớt bột quyện vị chua thanh của giấm gạo và hạt mè rang thơm phức kích thích vị giác.",
        orderingPhrase: "辛さ5倍でお願いします (Karasa go-bai de onegaishimasu - Làm độ cay gấp 5 lần giúp tôi)"
      }
    ],
    funFact: "Cổng Torii nổi tiếng đền Itsukushima trên đảo Miyajima không hề chôn móng dưới đất mà đứng vững suốt hàng trăm năm chỉ nhờ sức nặng tự thân 60 tấn!",
    stampJa: "広島駅・記念印",
    scenicPhotos: [
      {
        url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
        caption: "Cổng Torii khổng lồ nổi trên biển đảo Miyajima ⛩️",
        location: "Hatsukaichi, Hiroshima",
        description: "Ngọn cổng cao 16.6m đứng sừng sững giữa triều dâng vịnh Seto, biểu tượng thanh tẩy linh hồn của Thần Đạo."
      },
      {
        url: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&q=80",
        caption: "Vòm Bom Nguyên Tử Genbaku Dome trầm mặc 🕊️",
        location: "Otemachi, Naka-ku",
        description: "Khung vòm gạch thép đứng vững sau vụ nổ hạt nhân, lời nhắc nhở vĩnh cửu nhân loại về thảm họa chiến tranh."
      },
      {
        url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
        caption: "Tượng đài thiếu nữ Sadako và Triệu cánh hạc giấy 🎋",
        location: "Công viên Tưởng niệm Hòa bình",
        description: "Hàng ngàn chuỗi hạc giấy rực rỡ sắc màu từ trẻ em khắp năm châu gửi về cầu nguyện cho một thế giới không vũ khí hạt nhân."
      }
    ],
    culturalFacts: [
      { icon: "🕊️", label: "Sứ mệnh toàn cầu", value: "Thủ phủ phong trào hòa bình quốc tế & thỉnh cầu giải trừ vũ khí hạt nhân" },
      { icon: "🦪", label: "Vựa hàu số một", value: "Cung cấp hơn 60% sản lượng hàu tươi chất lượng cao cho toàn nước Nhật" },
      { icon: "🦌", label: "Hươu đảo Miyajima", value: "Hơn 500 chú hươu sinh sống tự do trên hòn đảo thiêng không phép chặt cây" },
      { icon: "🦽", label: "Hệ thống tàu điện cổ", value: "Hệ thống xe điện mặt đất 'Hiroden' lớn nhất Nhật Bản vẫn đang vận hành" }
    ],
    culturalArtifacts: [
      {
        title: "Cánh Hạc Giấy Hòa Bình Orizuru Sadako",
        titleJa: "折り鶴 (Orizuru - Hạc giấy hòa bình)",
        icon: "🕊️",
        imageUrl: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&q=80",
        desc: "Những cánh chim hạc gấp bằng giấy Washi rực rỡ dựa trên câu chuyện cảm động của cô bé Sadako Sasaki bị nhiễm phóng xạ.",
        significance: "Biểu tượng bất tử cho khát vọng hòa bình, tình yêu thương và sự kiên cường của nhân loại trước chiến tranh."
      },
      {
        title: "Muôi Xới Cơm Gỗ Đảo Miyajima Shamoji",
        titleJa: "宮島杓子 (Miyajima Shamoji)",
        icon: "🥄",
        imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80",
        desc: "Chiếc muôi xới cơm bằng gỗ thơm được nhà sư Seishin sáng tạo từ thế kỷ 18 theo hình dáng cây đàn tì bà của thần Benzaite.",
        significance: "Bùa may mắn cầu mong 'xúc cơm tài lộc', đánh đuổi vận xui và đem lại ấm no cho gia đình."
      },
      {
        title: "Cọ Lông Thư Pháp Kumano Hàng Đầu",
        titleJa: "熊野筆 (Kumano-fude)",
        icon: "🖌️",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80",
        desc: "Thị trấn Kumano sản xuất hơn 80% cọ trang điểm và bút lông viết chữ thư pháp cao cấp nhất thế giới bằng lông thú tự nhiên.",
        significance: "Nghệ thuật thủ công tinh xảo hàng trăm năm phục vụ các họa sĩ bậc thầy và các chuyên gia trang điểm quốc tế."
      }
    ],
    culturalEtiquette: [
      { title: "Kính cẩn tại Đài Tưởng niệm Hòa bình", desc: "Giữ trật tự trang nghiêm, không cười đùa lớn tiếng khi thăm Vòm Nguyên Tử và Bảo tàng Chứng tích.", icon: "🕊️" },
      { title: "Không cho hươu đảo Miyajima ăn", desc: "Không cho hươu ăn thức ăn của người để bảo vệ tập tính tự nhiên kiếm thức ăn của loài thú hoang.", icon: "🦌" },
      { title: "Cách ăn bánh xèo Hiroshima", desc: "Dùng chiếc xẻng sắt nhỏ xắn từng miếng bánh vuông vắn vừa miệng ăn trực tiếp trên bàn sắt teppan nóng.", icon: "🥢" }
    ],
    language: [
      { japanese: "平和を祈ります。", romaji: "Heiwa o inorimasu.", meaning: "Chúng tôi chân thành cầu nguyện cho nền hòa bình thế giới." },
      { japanese: "ぶちうまい！ (Hiroshima-ben)", romaji: "Buchi umai!", meaning: "Món này ngon khủng khiếp luôn á! (Tiếng địa phương Hiroshima)" },
      { japanese: "宮島へ行きたいです。", romaji: "Miyajima e ikitai desu.", meaning: "Tôi muốn bắt phà ra thăm đảo Miyajima xinh đẹp." }
    ]
  },

  hokkaido: {
    landmark3D: "❄️",
    landmarkImage: "https://images.unsplash.com/photo-1580100586938-02822d99c4a8?w=800&q=80",
    highlights: ["Lễ hội băng tuyết Sapporo Yuki Matsuri", "Kênh đào lãng mạn đèn dầu Otaru", "Cánh đồng hoa oải hương Furano"],
    history: {
      eraName: "Văn Hóa Bản Địa Ainu Cổ Xưa & Công Cuộc Khai Phá Bắc Hải Thời Kỳ Minh Trị",
      summary: "Hòn đảo phía Bắc quanh năm tuyết phủ này vốn là quê hương ngàn đời của người bản địa Ainu. Với nền văn hóa gắn bó mật thiết với thiên nhiên, người Ainu tôn thờ vạn vật xung quanh là các vị thần linh 'Kamuy' (thần gấu, thần cú, thần lửa).\n\nSau cuộc Duy Tân năm 1869, triều đình Minh Trị chính thức đổi tên vùng đất Ezo thành Hokkaido ('Đạo Bắc Hải') và thành lập cơ quan Khai Thác Sứ (Kaitakushi). Thành phố Sapporo được quy hoạch theo mô hình đường phố bàn cờ hiện đại của các thành phố phương Tây.\n\nTiến sĩ người Mỹ William S. Clark được mời đến làm hiệu trưởng đầu tiên của Đại học Nông nghiệp Sapporo, câu nói bất hủ của ông khi chia tay học trò 'Boys, be ambitious!' (Hỡi các chàng trai, hãy mang trong mình hoài bão lớn!) đã trở thành ngọn đuốc tinh thần cho cả vùng đất.\n\nNăm 1972, Sapporo đăng cai Thế vận hội Mùa đông đầu tiên của châu Á, đưa thương hiệu thủ phủ băng tuyết của Nhật Bản vươn tầm toàn cầu.",
      famousFigure: "Tiến sĩ William S. Clark, Khai thác sứ Kuroda Kiyotaka, Tù trưởng văn hóa Ainu Shakushain",
      milestones: [
        {
          year: "Cổ đại – Thế kỷ 18",
          title: "Văn Hóa Bản Địa Ainu Gắn Bó Thiên Nhiên",
          desc: "Cộng đồng người Ainu xây dựng làng bản Kotan, duy trì nghi lễ tế thần gấu Iomante và sáng tạo những bộ trang phục dệt vỏ cây Attus với hoa văn kỳ ảo xua đuổi tà linh."
        },
        {
          year: "Năm 1869",
          title: "Minh Trị Duy Tân Đổi Tên Thành Hokkaido",
          desc: "Chính phủ thành lập cơ quan Khai Thác Sứ Kaitakushi, đưa hàng vạn võ sĩ samurai và nông dân miền Nam lên khai hoang vùng đất băng giá, xây dựng thành phố Sapporo."
        },
        {
          year: "Năm 1876",
          title: "Tiến Sĩ Clark & Tuyên Ngôn 'Boys, be ambitious!'",
          desc: "Nhà giáo dục người Mỹ giúp đặt nền móng cho ngành nông nghiệp, chăn nuôi bò sữa hiện đại và truyền cảm hứng hoài bão vĩ đại cho thế hệ thanh niên Nhật Bản."
        },
        {
          year: "Năm 1950",
          title: "Khởi Sinh Lễ Hội Băng Tuyết Sapporo Yuki Matsuri",
          desc: "Các em học sinh địa phương đắp 6 bức tượng tuyết đầu tiên tại công viên Odori, đặt nền móng cho lễ hội băng tuyết khổng lồ thu hút hơn 2 triệu lượt khách quốc tế mỗi mùa đông."
        },
        {
          year: "Năm 1972",
          title: "Thế Vận Hội Mùa Đông Sapporo Đầu Tiên Châu Á",
          desc: "Thành phố vươn mình ra thế giới, xây dựng hệ thống tàu điện ngầm bánh cao su độc đáo chạy êm ái dưới lòng tuyết phủ và phát triển các khu trượt tuyết tuyết bột (powder snow) số một."
        }
      ]
    },
    delicacies: [
      {
        name: "Miso Ramen Bơ Bắp Ngọt Sapporo",
        nameJa: "札幌味噌バターコーンラーメン",
        desc: "Tô mì ramen nóng hổi nghi ngút khói giữa trời đông băng giá, nước súp hầm xương ninh nhừ với tương miso Hokkaido đậm đà, phủ miếng bơ vàng béo ngậy tan chảy cùng bắp ngô ngọt giòn và thịt xá xíu dày dặn.",
        icon: "🍜",
        imageUrl: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=700&q=80",
        taste: "Sợi mì xoăn vàng óng dai sần sật, lớp mỡ bơ giữ cho nước súp nóng sôi đến thìa cuối cùng béo bùi khó cưỡng.",
        orderingPhrase: "味噌バターコーンを一杯お願いします (Miso batā kōn o ippai onegaishimasu - Cho một tô ramen miso bơ bắp ngô)"
      },
      {
        name: "Tô Hải Sản Tươi Sống Kaisendon Otaru",
        nameJa: "小樽海鮮丼",
        desc: "Thau cơm giấm ngập tràn các loại hải sản tươi sống vừa cập cảng trong ngày: nhím biển Uni vàng óng, trứng cá hồi Ikura ướp tương nổ lách tách trong miệng, sò điệp Hotate to bản và thịt cua hoàng đế ngọt ngào.",
        icon: "🦀",
        imageUrl: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=700&q=80",
        taste: "Vị ngọt thanh khiết nguyên bản của đại dương lạnh giá tan chảy nơi đầu lưỡi.",
        orderingPhrase: "特上海鮮丼を酢飯で (Tokujō kaisendon o sumeshi de - Cho tô hải sản đặc biệt với cơm giấm)"
      },
      {
        name: "Thịt Cừu Nướng Chảo Nón Jingisukan",
        nameJa: "ジンギスカン (成吉思汗)",
        desc: "Thịt cừu non mềm mọng nướng trên chiếc chảo sắt hình nón lồi, mỡ cừu chảy xuống viền chảo xào chín giá đỗ, hành tây và ớt chuông ngọt lịm chấm sốt táo gừng đậm đà.",
        icon: "🥩",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=700&q=80",
        taste: "Thịt cừu ngọt mềm không hề có mùi tanh nồng, ngậy béo thơm lừng hương lửa than hồng.",
        orderingPhrase: "生ラム肉二人前と野菜盛り (Nama ramu niku ninmae to yasai mori - Cho hai phần thịt cừu tươi và rau củ)"
      },
      {
        name: "Cà Ri Nước Rau Củ Sapporo Soup Curry",
        nameJa: "札幌スープカレー",
        desc: "Nước súp cà ri lỏng thanh thơm lừng hàng chục vị thảo mộc thuốc bắc, ăn kèm đùi gà hầm mềm róc xương và đủ loại rau củ củ cải, cà tím, bí đỏ Hokkaido chiên vàng giòn rụm.",
        icon: "🍛",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80",
        taste: "Cay nồng ấm áp xua tan cái rét âm độ, vị ngọt bùi của rau củ tươi hữu cơ hòa cùng cơm vàng nghệ tây.",
        orderingPhrase: "チキンと野菜のスープカレー、辛さ3番 (Chikin to yasai no sūpu karē, karasa san-ban - Cà ri nước đùi gà rau củ độ cay số 3)"
      }
    ],
    funFact: "Tuyết ở Hokkaido được mệnh danh là 'Japow' (Japan Powder Snow) — loại tuyết bột mịn khô và nhẹ nhất hành tinh, thiên đường của giới trượt tuyết!",
    stampJa: "札幌駅・記念印",
    scenicPhotos: [
      {
        url: "https://images.unsplash.com/photo-1580100586938-02822d99c4a8?w=800&q=80",
        caption: "Kênh đào Otaru lãng mạn dưới ánh đèn dầu ❄️",
        location: "Otaru, Hokkaido",
        description: "Dòng kênh đào cổ soi bóng các nhà kho bằng đá lịch sử, thắp sáng lung linh bằng những ngọn đèn khí gas ấm áp."
      },
      {
        url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
        caption: "Đại tác phẩm điêu khắc băng tuyết Sapporo Yuki Matsuri 🏰",
        location: "Công viên Odori, Sapporo",
        description: "Những cung điện và danh thắng thế giới được tái hiện bằng hàng ngàn tấn tuyết trắng tinh khiết khổng lồ."
      },
      {
        url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80",
        caption: "Hộp âm nhạc cổ tích Bảo tàng Hộp Nhạc Otaru 🎵",
        location: "Otaru Music Box Museum",
        description: "Chiếc đồng hồ hơi nước cổ kính phun hơi nước định giờ trước ngôi nhà lưu giữ hàng vạn giai điệu âm nhạc thần tiên."
      }
    ],
    culturalFacts: [
      { icon: "❄️", label: "Lễ hội tuyết quốc tế", value: "Sapporo Snow Festival trưng bày hàng trăm lâu đài tuyết ngoạn mục" },
      { icon: "🥛", label: "Thủ phủ bơ sữa", value: "Cung cấp hơn 50% sữa tươi, bơ béo và phô mai thơm ngon cho cả nước Nhật" },
      { icon: "🐻", label: "Biểu tượng thần Gấu Higuma", value: "Loài gấu nâu khổng lồ được người Ainu tôn xưng là thần rừng tối thượng Kim-un Kamuy" },
      { icon: "⛷️", label: "Tuyết bột thiên đường", value: "Khu trượt tuyết Niseko và Rusutsu thu hút người mê thể thao mùa đông toàn cầu" }
    ],
    culturalArtifacts: [
      {
        title: "Tác Phẩm Khắc Gỗ Thần Gấu Ainu Kim-un Kamuy",
        titleJa: "木彫りの熊 (Kibori no Kuma)",
        icon: "🐻",
        imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80",
        desc: "Bức tượng chú gấu ngoạm cá hồi khắc tay từ thân cây gỗ nguyên khối, nghệ thuật chạm khắc bản địa độc đáo của người Ainu.",
        significance: "Bảo vật bảo hộ gia đình bình an, biểu tượng sức mạnh dũng mãnh và linh hồn tự do của rừng già phương Bắc."
      },
      {
        title: "Đồng Hồ Hơi Nước Cổ Kính Otaru Steam Clock",
        titleJa: "小樽蒸気時計 (Otaru Jōki Dokei)",
        icon: "🕰️",
        imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80",
        desc: "Chiếc đồng hồ hơi nước bằng đồng nặng 1.5 tấn do nghệ nhân Raymond Saunders chế tác, cứ 15 phút lại hú còi và xả khói trắng reo vui.",
        significance: "Di sản gợi nhớ thời kỳ khai thương cảng biển sôi động cuối thế kỷ 19 của vùng duyên hải Hokkaido."
      },
      {
        title: "Vải Dệt Vỏ Cây Truyền Thống Ainu Attus",
        titleJa: "アイヌ伝統織物アットゥシ (Ainu Attus)",
        icon: "🧶",
        imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80",
        desc: "Tấm vải dệt tỉ mỉ từ lớp xơ vỏ cây du rừng Ohyo, thêu những đường nét hình học móc câu kỳ bí quanh cổ áo và gấu tay áo.",
        significance: "Trang phục bảo vệ con người khỏi linh hồn tà ác và giá rét khắc nghiệt, di sản văn hóa phi vật thể của Nhật Bản."
      }
    ],
    culturalEtiquette: [
      { title: "Giữ ấm khi tham quan lễ hội tuyết", desc: "Đeo giày có đế chống trượt hoặc gắn đế cao su gai chống té ngã trên đường băng tuyết trơn trượt.", icon: "❄️" },
      { title: "Tôn trọng văn hóa bản địa Ainu", desc: "Không chụp ảnh cận cảnh người dân hay các nghi lễ thiêng tại các trung tâm văn hóa Upopoy khi có biển cấm.", icon: "🏛️" },
      { title: "Thưởng thức bia Sapporo đúng điệu", desc: "Nâng ly cụng và nói 'Kanpai!' ấm cúng cùng thịt cừu nướng Jingisukan nóng hổi giữa trời đông tuyết rơi.", icon: "🍺" }
    ],
    language: [
      { japanese: "イランカラプテ (Tiếng Ainu)", romaji: "Irankarapte", meaning: "Xin chào bạn (Lời chào chứa chan tình cảm: 'Hãy để trái tim tôi chạm đến trái tim bạn')" },
      { japanese: "なまら寒い！ (Hokkaido-ben)", romaji: "Namara samui!", meaning: "Trời đất ơi lạnh dã man con ngan luôn á!" },
      { japanese: "雪まつりは素晴らしいですね。", romaji: "Yukimatsuri wa subarashii desu ne.", meaning: "Lễ hội băng tuyết thực sự tráng lệ không tưởng." }
    ]
  },

  okinawa: {
    landmark3D: "🏝️",
    landmarkImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    highlights: ["Lâu đài hoàng gia Shuri-jo đỏ rực", "Thủy cung kỳ quan Churaumi Whale Shark", "Biển ngọc bích đảo đá san hô Kerama"],
    history: {
      eraName: "Vương Quốc Lưu Cầu (Ryukyu Kingdom 1429 – 1879) & Con Đường Tơ Lụa Hàng Hải",
      summary: "Tách biệt khỏi đất liền Nhật Bản, quần đảo Ryukyu từng là một vương quốc độc lập hưng thịnh kéo dài suốt 450 năm mang tên Vương quốc Lưu Cầu (Ryukyu). Năm 1429, vua Sho Hashi thống nhất ba vùng lãnh địa lập nên triều đại Sho thống nhất.\n\nNhờ vị trí đắc địa giữa ngã ba đường biển Đông Bắc Á và Đông Nam Á, Ryukyu trở thành trung tâm trung chuyển thương mại hàng hải sầm uất bậc nhất ('Chiếc cầu nối vạn quốc - Bankoku Shinryo'). Văn hóa nơi đây là sự giao thoa kỳ diệu giữa phong cách cung đình Trung Hoa, văn hóa Nhật Bản và nét nhiệt đới Đông Nam Á.\n\nĐây cũng là cái nôi khai sinh ra môn võ thuật Karate vang danh toàn cầu và giai điệu đàn Sanshin bọc da trăn rộn rã. Dù sáp nhập vào Nhật Bản năm 1879 và trải qua trận chiến Okinawa khốc liệt trong Thế chiến II, người dân hòn đảo này vẫn bảo tồn nguyên vẹn tinh thần nhân hậu 'Ichariba Chode' (Hễ gặp nhau một lần, tất cả đã là anh em).",
      famousFigure: "Vua Sho Hashi, Vua Sho Shin, Đại sư võ thuật Karate Funakoshi Gichin",
      milestones: [
        {
          year: "Năm 1429",
          title: "Vua Sho Hashi Thống Nhất Vương Quốc Lưu Cầu",
          desc: "Hợp nhất ba tiểu quốc Nanzan, Chuzan và Hokuzan thành một vương quốc thống nhất, định đô tại lâu đài Shuri-jo và triều cống giao thương cùng nhà Minh."
        },
        {
          year: "Thế kỷ 15 – 16",
          title: "Kỷ Nguyên 'Chiếc Cầu Nối Vạn Quốc' (Bankoku Shinryo)",
          desc: "Đoàn thuyền buôn Ryukyu xuôi ngược khắp Đông Nam Á, trao đổi gốm sứ tơ lụa Trung Hoa lấy hương liệu, da hươu và thiếc từ Xiêm La, Malacca và Đại Việt."
        },
        {
          year: "Năm 1609",
          title: "Gia Tộc Satsuma Nhật Bản Thôn Tính Ryukyu",
          desc: "Lãnh chúa Shimazu xứ Satsuma xua quân chiếm giữ Ryukyu nhưng vẫn cho phép vương quốc duy trì quan hệ ngoại giao với Trung Hoa nhằm tiếp tục mối lợi thương mại."
        },
        {
          year: "Năm 1879",
          title: "Minh Trị Duy Tân Sáp Nhập & Đổi Thành Tỉnh Okinawa",
          desc: "Chính phủ Minh Trị phế bỏ vương triều Sho, biến vương quốc thành tỉnh Okinawa. Môn võ tự vệ truyền thống Te phát triển thành nghệ thuật Karate lan tỏa năm châu."
        },
        {
          year: "Năm 2000",
          title: "UNESCO Ghi Danh Quần Thể Lâu Đài Shuri-jo",
          desc: "9 công trình thành lũy Gusuku và di tích vương quốc Ryukyu cổ kính được vinh danh là Di sản Văn hóa Thế giới, khẳng định bản sắc nhiệt đới độc nhất vô nhị."
        }
      ]
    },
    delicacies: [
      {
        name: "Mì Sườn Heo Hầm Nhừ Okinawa Soba",
        nameJa: "沖縄ソーキそば",
        desc: "Khác với mì soba thông thường làm từ kiều mạch, Okinawa soba làm 100% từ bột mì sợi to dai như mì udon, nước súp trong vắt ngọt thanh ninh từ xương heo và cá ngừ bào Katsuobushi, đặt miếng sườn heo Soki hầm mềm rục xương sụn béo ngậy bên trên.",
        icon: "🍜",
        imageUrl: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=700&q=80",
        taste: "Nước dùng thanh ngọt thanh đạm, cắn miếng sườn mềm tan chảy sần sật miếng sụn non, nhỏ thêm vài giọt rượu ớt Koregusu cay nồng.",
        orderingPhrase: "ソーキそば大盛り、コーレーグース付きで (Sōki soba ōmori, kōrēgūsu tsuki de - Cho tô mì sườn soki lớn kèm chai rượu ớt)"
      },
      {
        name: "Mướp Đắng Xào Đậu Phụ Gōyā Chanpurū",
        nameJa: "ゴーヤーチャンプルー",
        desc: "Món ăn trường thọ nổi tiếng nhất của đảo Okinawa: mướp đắng giòn xào cùng đậu hũ đảo Shima-dofu cứng bùi, trứng gà thơm và thịt ba chỉ xông khói trên chảo lửa lớn.",
        icon: "🥒",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80",
        taste: "Vị đắng dịu thanh mát kích thích tuần hoàn máu quyện cùng vị béo ngậy của đậu hũ và trứng chiên vàng thơm phức.",
        orderingPhrase: "ゴーヤーチャンプルー定食を一つ (Gōyā chanpurū teishoku o hitotsu - Cho một set cơm mướp đắng xào chanpuru)"
      },
      {
        name: "Thịt Ba Chỉ Kho Rượu Nếp Awamori Rafute",
        nameJa: "ラフテー (琉球豚角煮)",
        desc: "Những tảng thịt ba chỉ heo dày dặn hầm nhừ ròng rã suốt nhiều giờ cùng rượu nếp đảo Awamori, đường đen mía Kokuto và nước tương Shoyu cho đến khi phần mỡ trong veo không ngấy.",
        icon: "🥩",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=700&q=80",
        taste: "Mềm tan ngay khi chạm đầu lưỡi, vị ngọt sâu lắng của đường đen và men nồng thơm của rượu ủ lâu năm.",
        orderingPhrase: "ラフテーを一皿、泡盛と一緒に (Rafutē o hitosara, awamori to issho ni - Cho một đĩa thịt kho Rafute kèm ly rượu Awamori)"
      },
      {
        name: "Cơm Thịt Bò Kiểu Mỹ Okinawa Taco Rice",
        nameJa: "タコライス (Taco Rice)",
        desc: "Món ăn giao thoa văn hóa độc đáo: cơm trắng dẻo thơm phủ thịt bò băm xào gia vị Mexico đậm đà, phô mai Cheddar bào vụn, rau xà lách giòn và sốt cà chua Salsa tươi mát.",
        icon: "🌮",
        imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=700&q=80",
        taste: "Chua cay mặn ngọt bùng nổ, sự kết hợp hoàn hảo giữa ẩm thực phương Tây và tinh thần cơm Nhật Bản.",
        orderingPhrase: "チーズ多めのタコライスをください (Chīzu ōme no tako raisu o kudasai - Cho tôi đĩa Taco Rice nhiều phô mai)"
      }
    ],
    funFact: "Okinawa được thế giới gọi là 'Hòn đảo trường thọ' (Blue Zone) với tỉ lệ người sống thọ trên 100 tuổi cao nhất thế giới nhờ chế độ ăn mướp đắng và lối sống chan hòa!",
    stampJa: "那覇・首里城記念印",
    scenicPhotos: [
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        caption: "Bờ biển ngọc bích nước xanh màu ngọc lục bảo 🏝️",
        location: "Quần đảo Kerama, Okinawa",
        description: "Bãi cát trắng mịn như bột ôm lấy làn nước trong vắt thấy tận đáy biển với rạn san hô rực rỡ sắc màu."
      },
      {
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
        caption: "Cá mập voi khổng lồ Thủy cung Churaumi 🐋",
        location: "Công viên Ocean Expo, Motobu",
        description: "Bể kính Kuroshio Sea khổng lồ nơi những chú cá mập voi dài hơn 8m bơi lội thanh bình cùng đàn cá đuối Manta."
      },
      {
        url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80",
        caption: "Cặp tượng thần sư tử Shisa gác mái ngói đỏ 🦁",
        location: "Làng gốm Yachimun, Naha",
        description: "Linh vật nửa sư tử nửa chó bảo vệ các ngôi nhà cổ khỏi bão biển và tà khí mang đến bình yên hạnh phúc."
      }
    ],
    culturalFacts: [
      { icon: "🏝️", label: "Hòn đảo Trường Thọ", value: "Vùng đất có tỉ lệ cụ ông cụ bà sống trên 100 tuổi khỏe mạnh cao nhất hành tinh" },
      { icon: "🥋", label: "Cái nôi võ thuật Karate", value: "Môn võ tự vệ đỉnh cao bắt nguồn từ bàn tay trần 'Ti' của người Lưu Cầu cổ" },
      { icon: "🪕", label: "Đàn Sanshin 3 dây", value: "Cây đàn bọc da trăn cất lên những giai điệu dân ca Eisa rộn rã đón hè" },
      { icon: "🏮", label: "Rượu gạo Awamori", value: "Rượu chưng cất cổ xưa nhất Nhật Bản làm từ gạo hạt dài và nấm men đen koji" }
    ],
    culturalArtifacts: [
      {
        title: "Cặp Tượng Thần Sư Tử Hộ Mệnh Shisa",
        titleJa: "シーサー (Shīsā)",
        icon: "🦁",
        imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80",
        desc: "Cặp tượng nặn từ đất sét nung đỏ gác trên cổng nhà: con há miệng đón tài lộc điều lành, con ngậm miệng giữ gìn phúc đức gia đạo.",
        significance: "Bùa hộ mệnh thần thánh xua đuổi tà khí, bão giông và bảo vệ mái ấm gia đình người dân đảo."
      },
      {
        title: "Đàn Ba Dây Da Trăn Hoàng Gia Sanshin",
        titleJa: "三線 (Sanshin - Đàn 3 dây)",
        icon: "🪕",
        imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80",
        desc: "Cây đàn dây làm từ gỗ mun quý hiếm, bầu đàn bọc da trăn hoa gảy bằng ngón tay đeo móng vuốt trâu.",
        significance: "Linh hồn âm nhạc của vương quốc, là tiền thân sản sinh ra cây đàn Shamisen trên chính quốc Nhật Bản."
      },
      {
        title: "Vải Lụa Nhuộm Sắc Hoa Nhiệt Đới Bingata",
        titleJa: "紅型染物 (Ryūkyū Bingata)",
        icon: "👘",
        imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80",
        desc: "Nghệ thuật nhuộm lụa thủ công rực rỡ sắc màu nhiệt đới với họa tiết hoa dâm bụt, sóng biển và chim muông.",
        significance: "Trang phục hoàng gia quý tộc thời vương triều Ryukyu, tôn vinh ánh nắng chan hòa và sắc màu biển đảo."
      }
    ],
    culturalEtiquette: [
      { title: "Triết lý sống chan hòa Ichariba Chode", desc: "'Gặp nhau dù chỉ một lần đã là anh em' — Luôn mở rộng nụ cười và sự chân thành khi tiếp xúc người dân đảo.", icon: "🌺" },
      { title: "Bảo vệ rạn san hô biển ngọc", desc: "Không giẫm đạp lên san hô non khi lặn biển, sử dụng kem chống nắng thân thiện môi trường rạn san hô.", icon: "🪸" },
      { title: "Cung kính trước các khu đền thiêng Utaki", desc: "Các khu rừng thiêng Utaki là nơi thờ cúng tổ tiên linh thiêng của người Ryukyu, không bước vào khu cấm.", icon: "⛩️" }
    ],
    language: [
      { japanese: "はいさい！ (Haisai!)", romaji: "Haisai! (Nam) / Haitai! (Nữ)", meaning: "Xin chào buổi sáng/ngày mới! (Lời chào nồng hậu tiếng Okinawa)" },
      { japanese: "いちゃりばちょーでー", romaji: "Ichariba chōdē", meaning: "Hễ đã gặp gỡ một lần, chúng ta đều là anh em ruột thịt!" },
      { japanese: "にふぇーでーびる！", romaji: "Nifē dēbiru!", meaning: "Xin chân thành cảm ơn bạn rất nhiều! (Cảm ơn tiếng Ryukyu)" }
    ]
  }
};

// ======================== JOURNEY MAP META (dùng cho giao diện bản đồ hành trình) ========================
export interface JourneyCityMeta {
  region: string;
  kana: string;
  season: string;
}

export const CITY_JOURNEY_META: Record<string, JourneyCityMeta> = {
  tokyo: { region: "Kanto (関東)", kana: "とうきょう", season: "Xuân (hoa anh đào), Thu (lá đỏ)" },
  hakone: { region: "Kanto (関東)", kana: "はこね", season: "Thu (lá đỏ), Đông (onsen)" },
  kyoto: { region: "Kinki (関西)", kana: "きょうと", season: "Xuân (hoa anh đào), Thu (lá đỏ)" },
  nara: { region: "Kinki (関西)", kana: "なら", season: "Xuân (hoa anh đào), Thu (lá đỏ)" },
  osaka: { region: "Kinki (関西)", kana: "おおさか", season: "Xuân (hoa anh đào), Thu (lá đỏ)" },
  nagoya: { region: "Chubu (中部)", kana: "なごや", season: "Xuân (hoa anh đào)" },
  fuji: { region: "Chubu (中部)", kana: "ふじさん", season: "Hè (mùa leo núi), Thu (lá đỏ)" },
  hiroshima: { region: "Chugoku (中国)", kana: "ひろしま", season: "Xuân (hoa anh đào), Thu (lá đỏ)" },
  sapporo: { region: "Hokkaido (北海道)", kana: "さっぽろ", season: "Hè (hoa oải hương), Đông (lễ hội tuyết)" },
  hokkaido: { region: "Hokkaido (北海道)", kana: "ほっかいどう", season: "Hè (hoa oải hương), Đông (lễ hội tuyết)" },
  okinawa: { region: "Okinawa (沖縄)", kana: "おきなわ", season: "Xuân – Hè (biển xanh)" },
};

export function getJourneyMeta(slug: string): JourneyCityMeta {
  return CITY_JOURNEY_META[slug] ?? { region: "Nhật Bản (日本)", kana: "", season: "Bốn mùa" };
}
