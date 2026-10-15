import re
from typing import Literal

IntentType = Literal[
    "greeting",
    "gratitude",
    "farewell",
    "bot_info",
    "consultation_booking",
    "legal_query",
]

GREETING_PATTERNS = [
    r"^(hi|hello|hey|alo|hế lô|hé lô|chào|xin chào|chào bạn|chào bot|chào ad|chào em|chào anh|chào chị|hi bot|hello bot|chào nhé|chào nha)$",
    r"^(chào buổi sáng|chào buổi chiều|chào buổi tối|good morning|good afternoon|good evening)$",
]

GRATITUDE_PATTERNS = [
    r"^(cảm ơn|cám ơn|cảm ơn bạn|cám ơn bạn|cảm ơn bot|cám ơn bot|thank you|thanks|tks|tkss)$",
    r"^(cảm ơn nhiều|cảm ơn nhé|cám ơn nhiều|cám ơn nhé|thank you very much|cảm ơn nha|cám ơn nha)$",
]

FAREWELL_PATTERNS = [
    r"^(tạm biệt|tạm biệt bạn|tạm biệt bot|bye|bye bye|goodbye|hẹn gặp lại|chúc một ngày tốt lành|bye nhé|bye nha)$",
]

BOT_INFO_PATTERNS = [
    r"(bạn là ai|bạn tên là gì|mày là ai|giới thiệu về bạn|bạn có thể làm gì|bạn giúp gì được|chức năng của bạn)",
    r"(who are you|what can you do)",
]

CONSULTATION_BOOKING_PATTERNS = [
    r"(đặt lịch|hẹn luật sư|gặp luật sư|tư vấn trực tiếp|thuê luật sư|nhờ luật sư|liên hệ luật sư)",
    r"(văn phòng ở đâu|địa chỉ công ty|địa chỉ văn phòng|trụ sở ở đâu|số điện thoại|hotline|số hotline)",
    r"(chi phí luật sư|giá dịch vụ|báo giá|thù lao luật sư|phí tư vấn)",
]

LEGAL_KEYWORDS = [
    # Quy phạm & Căn cứ
    "luật", "bộ luật", "nghị định", "thông tư", "quy định", "điều", "khoản", "điểm",
    # Đất đai
    "đất", "sổ đỏ", "sổ hồng", "chuyển nhượng", "tặng cho", "ranh giới", "thu hồi",
    "tái định cư", "bồi thường đất", "quyền sử dụng đất", "địa chính", "mục đích sử dụng",
    # Hôn nhân & Gia đình
    "ly hôn", "thuận tình", "đơn phương", "quyền nuôi con", "cấp dưỡng", "nuôi con",
    "tài sản chung", "tài sản riêng", "hôn nhân", "vợ chồng", "kết hôn",
    # Dân sự & Hợp đồng
    "đặt cọc", "phạt cọc", "mất cọc", "thừa kế", "di chúc", "di sản", "hàng thừa kế",
    "lãi suất", "cho vay", "vay tiền", "nợ", "khởi kiện", "thời hiệu", "bồi thường thiệt hại",
    # Doanh nghiệp & Thương mại
    "doanh nghiệp", "công ty", "thành lập", "giải thể", "vốn điều lệ", "cổ phần",
    "người đại diện", "góp vốn", "cổ đông", "chủ tịch",
    # Lao động
    "hợp đồng lao động", "thời hạn báo trước", "thôi việc", "sa thải", "tiền lương",
    "kỷ luật", "thử việc", "trợ cấp", "bảo hiểm xã hội",
]


def classify_intent(query: str) -> IntentType:
    """Phân loại ý định của người dùng với độ trễ cực thấp (0ms).

    Tách biệt giao tiếp thông thường (Chitchat/Greeting), yêu cầu đặt lịch luật sư
    với truy vấn phân tích pháp lý chuyên sâu.
    """
    cleaned = query.strip().lower()
    # Loại bỏ dấu câu ở cuối câu
    cleaned = re.sub(r"[.?!,;:]+$", "", cleaned).strip()

    # 1. Kiểm tra yêu cầu đặt lịch hẹn hoặc thông tin văn phòng luật sư
    for pattern in CONSULTATION_BOOKING_PATTERNS:
        if re.search(pattern, cleaned):
            return "consultation_booking"

    # 2. Nếu câu có chứa từ khóa pháp lý rõ ràng -> ưu tiên phân tích pháp lý
    if any(kw in cleaned for kw in LEGAL_KEYWORDS):
        return "legal_query"

    # 3. Giao tiếp xã giao
    for pattern in GREETING_PATTERNS:
        if re.match(pattern, cleaned):
            return "greeting"

    for pattern in GRATITUDE_PATTERNS:
        if re.match(pattern, cleaned):
            return "gratitude"

    for pattern in FAREWELL_PATTERNS:
        if re.match(pattern, cleaned):
            return "farewell"

    for pattern in BOT_INFO_PATTERNS:
        if re.search(pattern, cleaned):
            return "bot_info"

    # Mặc định coi các câu hỏi còn lại là truy vấn pháp lý
    return "legal_query"

