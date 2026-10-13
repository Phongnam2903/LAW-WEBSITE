export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  topic?: string;
  citations?: string[];
  suggestions?: string[];
  action?: {
    label: string;
    href: string;
  };
}

export interface QuickPrompt {
  id: string;
  category: string;
  title: string;
  prompt: string;
  icon?: string;
}

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: "corp-1",
    category: "Doanh nghiệp",
    title: "Thành lập công ty TNHH",
    prompt: "Hồ sơ và thủ tục thành lập công ty TNHH 2 thành viên cần những gì?",
  },
  {
    id: "land-1",
    category: "Đất đai",
    title: "Tranh chấp đất đai chưa sổ đỏ",
    prompt: "Đất chưa có sổ đỏ khi xảy ra tranh chấp thì giải quyết ở đâu và như thế nào?",
  },
  {
    id: "divorce-1",
    category: "Hôn nhân & Gia đình",
    title: "Thủ tục ly hôn đơn phương",
    prompt: "Thủ tục và thời gian giải quyết ly hôn đơn phương gồm những bước nào?",
  },
  {
    id: "fee-1",
    category: "Án phí & Chi phí",
    title: "Cách tính án phí dân sự",
    prompt: "Tạm ứng án phí sơ thẩm trong vụ án tranh chấp dân sự có giá ngạch được tính ra sao?",
  },
  {
    id: "labor-1",
    category: "Lao động",
    title: "Đơn phương chấm dứt HĐLĐ",
    prompt: "Người sử dụng lao động có quyền sa thải hoặc đơn phương chấm dứt HĐLĐ trong trường hợp nào?",
  },
  {
    id: "inherit-1",
    category: "Thừa kế",
    title: "Thời hiệu chia di sản thừa kế",
    prompt: "Thời hiệu yêu cầu chia di sản thừa kế là bao lâu và ai thuộc hàng thừa kế thứ nhất?",
  },
];

export const LEGAL_CATEGORIES = [
  { id: "all", label: "Tất cả lĩnh vực" },
  { id: "corporate", label: "Doanh nghiệp & Đầu tư" },
  { id: "real-estate", label: "Đất đai & Bất động sản" },
  { id: "family", label: "Hôn nhân & Gia đình" },
  { id: "labor", label: "Lao động & Việc làm" },
  { id: "civil", label: "Dân sự & Hợp đồng" },
];

/**
 * Intelligent mock AI response generator based on Vietnamese legal knowledge.
 */
export function generateBotResponse(userQuery: string): {
  text: string;
  citations: string[];
  suggestions: string[];
  action?: { label: string; href: string };
} {
  const query = userQuery.toLowerCase();

  // 1. Ly hôn / Hôn nhân gia đình
  if (
    query.includes("ly hôn") ||
    query.includes("li dị") ||
    query.includes("ly than") ||
    query.includes("kết hôn") ||
    query.includes("nuôi con") ||
    query.includes("phân chia tài sản")
  ) {
    const isSingle = query.includes("đơn phương");
    return {
      text: isSingle
        ? `Về thủ tục **Ly hôn đơn phương** theo pháp luật Việt Nam hiện hành:\n\n` +
          `1. **Thẩm quyền giải quyết:** Tòa án nhân dân cấp huyện nơi bị đơn (vợ hoặc chồng) cư trú, làm việc (Điều 35, 39 Bộ luật Tố tụng Dân sự 2015).\n\n` +
          `2. **Căn cứ ly hôn (Điều 56 Luật Hôn nhân & Gia đình 2014):**\n` +
          `   - Có hành vi bạo lực gia đình hoặc vi phạm nghiêm trọng quyền, nghĩa vụ làm hôn nhân lâm vào tình trạng trầm trọng, đời sống chung không thể kéo dài.\n\n` +
          `3. **Hồ sơ cần chuẩn bị:**\n` +
          `   - Đơn khởi kiện ly hôn (mẫu số 23-DS).\n` +
          `   - Bản chính Giấy chứng nhận đăng ký kết hôn.\n` +
          `   - Bản sao công chứng CCCD của hai vợ chồng.\n` +
          `   - Giấy khai sinh của các con chung (nếu có).\n` +
          `   - Giấy tờ chứng minh tài sản chung, nợ chung (nếu yêu cầu Tòa giải quyết).\n\n` +
          `4. **Thời gian giải quyết:** Khoảng từ 4 đến 6 tháng tùy tính chất phức tạp của vụ việc.`
        : `Về **Thủ tục Ly hôn** theo quy định pháp luật Việt Nam:\n\n` +
          `Pháp luật phân định rõ 2 trường hợp:\n` +
          `• **Thuận tình ly hôn (Điều 55 LHNGĐ 2014):** Cả hai bên tự nguyện ly hôn và đã thỏa thuận xong về con cái, tài sản. Nộp đơn tại TAND nơi một trong hai bên cư trú. Thời gian thụ lý và giải quyết thường từ 1 - 2 tháng.\n` +
          `• **Đơn phương ly hôn (Điều 56 LHNGĐ 2014):** Một bên yêu cầu ly hôn khi có mâu thuẫn trầm trọng, bạo lực gia đình hoặc mục đích hôn nhân không đạt được. Nộp đơn tại TAND nơi bị đơn cư trú. Thời gian từ 4 - 6 tháng.\n\n` +
          `*Lưu ý quan trọng:* Chồng không được quyền yêu cầu ly hôn khi vợ đang có thai, sinh con hoặc đang nuôi con dưới 12 tháng tuổi.`,
      citations: [
        "Luật Hôn nhân và Gia đình 2014 (Điều 51, 55, 56, 81)",
        "Bộ luật Tố tụng Dân sự 2015 (Điều 35, 39)",
      ],
      suggestions: [
        "Hồ sơ ly hôn nộp ở đâu?",
        "Quyền nuôi con dưới 36 tháng tuổi được quy định thế nào?",
        "Cách chia tài sản chung trong thời kỳ hôn nhân?",
      ],
      action: {
        label: "Đặt lịch hẹn Luật sư Hôn nhân & Gia đình",
        href: "/consultation?service=family-law",
      },
    };
  }

  // 2. Đất đai / Bất động sản / Sổ đỏ
  if (
    query.includes("đất") ||
    query.includes("sổ đỏ") ||
    query.includes("sổ hồng") ||
    query.includes("bất động sản") ||
    query.includes("tranh chấp đất") ||
    query.includes("sang tên") ||
    query.includes("lấn chiếm")
  ) {
    return {
      text: `Về **Tranh chấp và Thủ tục Đất đai** theo Luật Đất đai 2024 (có hiệu lực từ 01/08/2024):\n\n` +
        `1. **Thủ tục hòa giải bắt buộc:**\n` +
        `   - Tranh chấp ai là người có quyền sử dụng đất **bắt buộc phải qua thủ tục hòa giải tại UBND cấp xã/phường** nơi có đất (Điều 235 Luật Đất đai 2024).\n` +
        `   - Thời hạn hòa giải: Không quá 30 ngày kể từ ngày nhận được đơn.\n\n` +
        `2. **Thẩm quyền giải quyết khi hòa giải không thành:**\n` +
        `   - Đất **có Giấy chứng nhận (Sổ đỏ)** hoặc giấy tờ Điều 137: Thẩm quyền thuộc về **Tòa án nhân dân**.\n` +
        `   - Đất **chưa có Giấy chứng nhận**: Đương sự có quyền lựa chọn (1) Nộp đơn yêu cầu giải quyết tại UBND cấp có thẩm quyền hoặc (2) Khởi kiện trực tiếp tại Tòa án nhân dân theo quy định mới.\n\n` +
        `3. **Biện pháp khẩn cấp cần làm ngay:**\n` +
        `   - Nộp đơn đề nghị ngăn chặn giao dịch, phong tỏa tài sản tại Văn phòng Đăng ký Đất đai để tránh việc bên kia tẩu tán, chuyển nhượng đất trong thời gian tranh chấp.`,
      citations: [
        "Luật Đất đai 2024 (Điều 137, 159, 235, 236)",
        "Bộ luật Tố tụng Dân sự 2015 (Điều 111 về Biện pháp khẩn cấp tạm thời)",
      ],
      suggestions: [
        "Đất chưa có sổ đỏ làm thế nào để được cấp?",
        "Mẫu đơn đề nghị hòa giải tranh chấp đất đai tại xã?",
        "Chi phí đo đạc và thẩm định giá đất tại Tòa án?",
      ],
      action: {
        label: "Kết nối Luật sư Đất đai & Bất động sản",
        href: "/consultation?service=land-dispute",
      },
    };
  }

  // 3. Doanh nghiệp / Thành lập công ty / Đầu tư
  if (
    query.includes("doanh nghiệp") ||
    query.includes("công ty") ||
    query.includes("thành lập") ||
    query.includes("tnhh") ||
    query.includes("cổ phần") ||
    query.includes("vốn điều lệ") ||
    query.includes("giấy phép kinh doanh")
  ) {
    return {
      text: `Về thủ tục **Thành lập Doanh nghiệp** theo Luật Doanh nghiệp 2020:\n\n` +
        `1. **Hồ sơ đăng ký thành lập (Công ty TNHH/Cổ phần):**\n` +
        `   - Giấy đề nghị đăng ký doanh nghiệp (theo mẫu).\n` +
        `   - Điều lệ công ty dự thảo.\n` +
        `   - Danh sách thành viên (TNHH 2 TV trở lên) hoặc Danh sách cổ đông sáng lập (CTCP).\n` +
        `   - Bản sao CCCD/Hộ chiếu người đại diện theo pháp luật và các thành viên/cổ đông.\n\n` +
        `2. **Thời gian và nơi thực hiện:**\n` +
        `   - Nộp hồ sơ trực tuyến qua Cổng thông tin quốc gia về đăng ký doanh nghiệp (dangkykinhdoanh.gov.vn).\n` +
        `   - Thời hạn cấp Giấy chứng nhận ĐKDN: **03 ngày làm việc** kể từ ngày nhận đủ hồ sơ hợp lệ.\n\n` +
        `3. **Các việc cần làm ngay sau khi có GPKD:**\n` +
        `   - Mở tài khoản ngân hàng và thông báo cơ quan thuế.\n` +
        `   - Đăng ký chữ ký số (Token) và phát hành hóa đơn điện tử.\n` +
        `   - Treo biển hiệu tại trụ sở chính.\n` +
        `   - Góp đủ vốn điều lệ trong thời hạn **90 ngày** kể từ ngày cấp GPKD.`,
      citations: [
        "Luật Doanh nghiệp 2020 (Điều 23, 24, 30, 47, 75)",
        "Nghị định 01/2021/NĐ-CP về Đăng ký doanh nghiệp",
      ],
      suggestions: [
        "Nên thành lập Công ty TNHH hay Công ty Cổ phần?",
        "Mức phạt nếu không góp đủ vốn điều lệ trong 90 ngày?",
        "Dịch vụ trọn gói thành lập công ty VietLex Law?",
      ],
      action: {
        label: "Tư vấn Luật Doanh nghiệp & Đầu tư",
        href: "/consultation?service=corporate-law",
      },
    };
  }

  // 4. Án phí / Chi phí luật sư / Tạm ứng
  if (
    query.includes("án phí") ||
    query.includes("chi phí") ||
    query.includes("tiền cọc") ||
    query.includes("tạm ứng") ||
    query.includes("giá ngạch") ||
    query.includes("thù lao")
  ) {
    return {
      text: `Về mức **Án phí và Tạm ứng Án phí Dân sự** theo Nghị quyết 326/2016/UBTVQH14:\n\n` +
        `1. **Tranh chấp không có giá ngạch:** (ví dụ: xin ly hôn, tranh chấp nuôi con không chia tài sản)\n` +
        `   - Mức án phí sơ thẩm cố định: **300.000 VNĐ**.\n` +
        `   - Tạm ứng án phí nộp trước: 300.000 VNĐ.\n\n` +
        `2. **Tranh chấp có giá ngạch:** (tranh chấp tài sản, hợp đồng, đất đai tính theo giá trị tranh chấp):\n` +
        `   - Dưới 6 triệu VNĐ: 300.000 VNĐ.\n` +
        `   - Từ 6 triệu đến 400 triệu: 5% giá trị tranh chấp.\n` +
        `   - Từ trên 400 triệu đến 800 triệu: 20 triệu + 4% của phần vượt 400 triệu.\n` +
        `   - Từ trên 800 triệu đến 2 tỷ: 36 triệu + 3% của phần vượt 800 triệu.\n\n` +
        `*Quy tắc nộp tạm ứng:* Người khởi kiện nộp **50% mức án phí dự kiến** khi Tòa án thông báo thụ lý đơn.\n` +
        `*Ai chịu án phí cuối cùng:* Bên thua kiện sẽ phải chịu toàn bộ án phí sơ thẩm trừ khi có thỏa thuận khác.`,
      citations: [
        "Nghị quyết 326/2016/UBTVQH14 của Ủy ban Thường vụ Quốc hội về Án phí, Lệ phí Tòa án",
        "Bộ luật Tố tụng Dân sự 2015 (Điều 143 - 149)",
      ],
      suggestions: [
        "Các trường hợp được miễn hoặc giảm án phí Tòa án?",
        "Bảng giá dịch vụ luật sư tranh tụng VietLex?",
        "Đặt lịch tư vấn ước tính chi phí giải quyết vụ án",
      ],
      action: {
        label: "Nhận báo giá & Phân tích chi phí vụ việc",
        href: "/consultation",
      },
    };
  }

  // 5. Thừa kế / Di chúc
  if (
    query.includes("thừa kế") ||
    query.includes("di chúc") ||
    query.includes("di sản") ||
    query.includes("hàng thừa kế") ||
    query.includes("chia gia tài")
  ) {
    return {
      text: `Về quy định **Thừa kế & Di sản** theo Bộ luật Dân sự 2015:\n\n` +
        `1. **Thời hiệu khởi kiện yêu cầu chia di sản (Điều 623 BLDS 2015):**\n` +
        `   - Đối với **Bất động sản**: **30 năm** kể từ thời điểm mở thừa kế (người để lại di sản qua đời).\n` +
        `   - Đối với **Động sản**: **10 năm** kể từ thời điểm mở thừa kế.\n\n` +
        `2. **Hàng thừa kế theo pháp luật (nếu không có di chúc hoặc di chúc vô hiệu - Điều 651):**\n` +
        `   - **Hàng 1:** Vợ, chồng, cha đẻ, mẹ đẻ, cha nuôi, mẹ nuôi, con đẻ, con nuôi của người chết (hưởng kỷ phần bằng nhau).\n` +
        `   - **Hàng 2:** Ông nội, bà nội, ông ngoại, bà ngoại, anh/chị/em ruột; cháu ruột của người chết.\n` +
        `   - **Hàng 3:** Cụ nội, cụ ngoại; bác, chú, cậu, cô, dì ruột; cháu gọi người chết là bác/chú/cô/dì.\n\n` +
        `3. **Đối tượng được hưởng di sản không phụ thuộc vào nội dung di chúc (Điều 644):**\n` +
        `   - Con chưa thành niên, cha, mẹ, vợ, chồng; hoặc con thành niên mà không có khả năng lao động vẫn được hưởng phần di sản bằng 2/3 suất của một người thừa kế theo pháp luật dù di chúc không cho.`,
      citations: [
        "Bộ luật Dân sự 2015 (Điều 623, 644, 650, 651)",
        "Luật Công chứng 2014 về Thỏa thuận phân chia di sản",
      ],
      suggestions: [
        "Thủ tục công chứng văn bản thỏa thuận phân chia di sản?",
        "Di chúc viết tay không công chứng có giá trị không?",
        "Đặt lịch luật sư tư vấn thừa kế",
      ],
      action: {
        label: "Tư vấn Tranh chấp & Phân chia Thừa kế",
        href: "/consultation?service=inheritance",
      },
    };
  }

  // 6. Lao động / Hợp đồng lao động / Tiền lương
  if (
    query.includes("lao động") ||
    query.includes("hợp đồng lao động") ||
    query.includes("sa thải") ||
    query.includes("nghỉ việc") ||
    query.includes("trợ cấp") ||
    query.includes("thử việc") ||
    query.includes("bảo hiểm xã hội")
  ) {
    return {
      text: `Về quy định **Pháp luật Lao động** theo Bộ luật Lao động 2019:\n\n` +
        `1. **Thời hạn thử việc tối đa (Điều 25 BLLĐ 2019):**\n` +
        `   - Tối đa **180 ngày** đối với công việc của người quản lý doanh nghiệp.\n` +
        `   - Tối đa **60 ngày** đối với công việc có trình độ từ cao đẳng trở lên.\n` +
        `   - Tối đa **30 ngày** đối với công việc trình độ trung cấp, công nhân kỹ thuật.\n` +
        `   - Tiền lương thử việc: Ít nhất bằng **85%** mức lương chính thức.\n\n` +
        `2. **Đơn phương chấm dứt hợp đồng lao động:**\n` +
        `   - Người lao động có quyền đơn phương chấm dứt HĐLĐ không cần lý do nhưng phải báo trước: ít nhất 30 ngày (HĐLĐ xác định thời hạn 12-36 tháng) hoặc 45 ngày (HĐLĐ không xác định thời hạn).\n` +
        `   - Người sử dụng lao động sa thải sai luật: Phải nhận người lao động trở lại làm việc, bồi thường ít nhất 02 tháng tiền lương cùng toàn bộ tiền lương đóng BHXH trong thời gian không được làm việc.`,
      citations: [
        "Bộ luật Lao động 2019 (Điều 24, 25, 35, 36, 41, 125)",
        "Luật Bảo hiểm xã hội 2014",
      ],
      suggestions: [
        "Công ty nợ lương và trốn đóng BHXH phải xử lý ra sao?",
        "Mức trợ cấp thôi việc được tính như thế nào?",
        "Đặt lịch tư vấn tranh chấp lao động",
      ],
      action: {
        label: "Tư vấn Pháp luật Lao động",
        href: "/consultation?service=labor-law",
      },
    };
  }

  // 7. Đặt lịch tư vấn / Liên hệ luật sư
  if (
    query.includes("đặt lịch") ||
    query.includes("liên hệ") ||
    query.includes("gặp luật sư") ||
    query.includes("tư vấn trực tiếp") ||
    query.includes("số điện thoại") ||
    query.includes("hotline") ||
    query.includes("địa chỉ")
  ) {
    return {
      text: `Bạn có thể dễ dàng kết nối với đội ngũ luật sư chuyên trách của **VietLex Law** qua các kênh sau:\n\n` +
        `1. **Đặt lịch hẹn trực tuyến:** Điền thông tin yêu cầu và chọn khung giờ tại trang Đặt lịch tư vấn (hỗ trợ cả tư vấn trực tiếp tại văn phòng và tư vấn qua video call).\n` +
        `2. **Hotline tiếp nhận vụ việc 24/7:** \`1900 1234\` hoặc \`+84 28 3822 9999\`.\n` +
        `3. **Văn phòng chính:** Tầng 18, VietLex Tower, Quận 1, TP. Hồ Chí Minh.\n\n` +
        `Đội ngũ thư ký luật sư sẽ liên hệ lại xác nhận và sắp xếp luật sư chuyên môn phù hợp nhất trong vòng 30 phút.`,
      citations: ["Quy chế tư vấn khách hàng VietLex Law 2026"],
      suggestions: [
        "Chi phí cho một buổi tư vấn ban đầu là bao nhiêu?",
        "Tôi muốn tư vấn vào buổi tối hoặc cuối tuần được không?",
        "Chuyển ngay đến form Đặt lịch tư vấn",
      ],
      action: {
        label: "Chuyển đến Form Đặt lịch tư vấn ngay",
        href: "/consultation",
      },
    };
  }

  // 8. Trả lời mặc định / Tổng quát
  return {
    text: `Cảm ơn câu hỏi của bạn. Về vấn đề **"${userQuery}"**, theo nguyên tắc pháp luật Việt Nam:\n\n` +
      `1. **Xem xét cơ sở pháp lý:** Cần xác định đối tượng tranh chấp/quan hệ pháp luật, các hợp đồng hoặc văn bản thỏa thuận đã ký kết, cùng mốc thời gian phát sinh sự kiện pháp lý.\n\n` +
      `2. **Lưu ý rủi ro thường gặp:**\n` +
      `   - Chú ý thời hiệu khởi kiện hoặc khiếu nại (thường là 02 - 03 năm tùy vụ việc).\n` +
      `   - Lưu trữ, bảo quản đầy đủ chứng cứ bằng văn bản, tin nhắn, email hoặc hóa đơn chuyển khoản.\n` +
      `   - Tránh ký kết các biên bản thỏa thuận tự phát khi chưa rõ hậu quả pháp lý.\n\n` +
      `3. **Khuyến nghị từ VietLex:** Bạn có thể cung cấp thêm chi tiết cụ thể hơn (tình tiết, giấy tờ hiện có) để Trợ lý AI phân tích sâu hơn, hoặc đặt lịch để luật sư trực tiếp rà soát hồ sơ.`,
    citations: [
      "Bộ luật Dân sự 2015",
      "Hệ thống văn bản quy phạm pháp luật Việt Nam hiện hành",
    ],
    suggestions: [
      "Thủ tục giải quyết tranh chấp đất đai chưa có sổ đỏ",
      "Thủ tục ly hôn đơn phương và thời gian giải quyết",
      "Cách tính tạm ứng án phí dân sự sơ bộ",
      "Đặt lịch tư vấn trực tiếp với luật sư",
    ],
    action: {
      label: "Gặp Luật sư tư vấn chuyên sâu",
      href: "/consultation",
    },
  };
}
