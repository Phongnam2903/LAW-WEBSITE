import re
from typing import Literal

IntentType = Literal["greeting", "gratitude", "farewell", "bot_info", "legal_query"]

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

LEGAL_KEYWORDS = [
    "luật", "bộ luật", "nghị định", "thông tư", "quy định", "điều", "khoản", "điểm",
    "hợp đồng", "lao động", "doanh nghiệp", "công ty", "thành lập", "giải thể",
    "vốn", "cổ phần", "báo trước", "thôi việc", "sa thải", "tranh chấp", "bảo hiểm",
    "tiền lương", "nghỉ phép", "chấm dứt", "phạt", "bồi thường"
]


def classify_intent(query: str) -> IntentType:
    """Phân loại ý định của người dùng với độ trễ cực thấp (0ms).

    Tách biệt giao tiếp thông thường (Chitchat/Greeting) với truy vấn pháp lý chuyên sâu.
    """
    cleaned = query.strip().lower()
    # Loại bỏ dấu câu ở cuối câu
    cleaned = re.sub(r"[.?!,;:]+$", "", cleaned).strip()

    # Nếu câu có chứa từ khóa pháp lý rõ ràng -> luôn ưu tiên legal_query
    if any(kw in cleaned for kw in LEGAL_KEYWORDS):
        return "legal_query"

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

    # Mặc định coi các câu hỏi nội dung khác là truy vấn pháp lý
    return "legal_query"
