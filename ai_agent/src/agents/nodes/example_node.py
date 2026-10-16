from src.agents.intent import classify_intent
from src.agents.state import AgentState
from src.services.rag_service import LegalRAGService

# Khởi tạo singleton RAG service
_rag_service = LegalRAGService()


async def router_node(state: AgentState) -> dict:
    """Phân loại ý định của người dùng trước khi định tuyến."""
    query = state.get("query", "").strip()
    if not query:
        return {
            "intent": "empty",
            "error": "Câu hỏi rỗng",
            "analysis": "Bạn chưa nhập câu hỏi vào đây.",
            "response": "Vui lòng nhập câu hỏi hoặc vấn đề pháp lý Quý khách cần giải đáp.",
            "metadata": {"has_grounding": True, "citations": []},
        }

    intent = classify_intent(query)
    return {"intent": intent}


async def greeting_node(state: AgentState) -> dict:
    """Xử lý các câu chào hỏi, cảm ơn, tạm biệt hoặc hỏi thông tin bot một cách tự nhiên, chuyên nghiệp."""
    intent = state.get("intent", "greeting")

    if intent == "gratitude":
        response_text = (
            "Rất hân hạnh được hỗ trợ Quý khách! Nếu Quý khách có thêm bất kỳ câu hỏi "
            "hoặc tình huống pháp lý nào cần giải đáp, xin đừng ngần ngại gửi câu hỏi cho tôi nhé."
        )
    elif intent == "farewell":
        response_text = (
            "Tạm biệt Quý khách! Chúc Quý khách một ngày làm việc hiệu quả và thuận lợi. "
            "Khi cần tư vấn hoặc tra cứu pháp luật, tôi luôn sẵn sàng hỗ trợ Quý khách!"
        )
    elif intent == "consultation_booking":
        response_text = (
            "Quý khách có thể kết nối và đặt lịch làm việc trực tiếp với Đội ngũ Luật sư của "
            "**Công ty Luật Hợp danh Nghiệp Hưng** qua các phương thức sau:\n\n"
            "1. 📅 **Đặt lịch trực tuyến:** Điền thông tin vụ việc và chọn khung giờ tại trang [Đặt Lịch Tư Vấn](/consultation) "
            "(hỗ trợ tư vấn trực tiếp tại trụ sở văn phòng hoặc qua video call bảo mật).\n"
            "2. 📞 **Tổng đài Hotline 24/7:** `1900 1234` hoặc `(028) 3822 9999`.\n"
            "3. 🏢 **Trụ sở chính:** Tầng 18, Tòa nhà Nghiệp Hưng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh.\n\n"
            "Thư ký luật sư sẽ chủ động liên hệ xác nhận và bố trí luật sư chuyên trách phù hợp nhất trong vòng 30 phút làm việc."
        )
    elif intent == "bot_info":
        response_text = (
            "Tôi là **Trợ lý Pháp lý AI** của **Công ty Luật Hợp danh Nghiệp Hưng**, chuyên sâu về Pháp luật Việt Nam.\n\n"
            "Chức năng chính của tôi:\n"
            "- Tra cứu và đối chiếu chính xác các điều khoản trong hệ thống pháp luật Việt Nam hiện hành:\n"
            "  + 🏡 **Luật Đất đai 2024**: Cấp sổ đỏ, chuyển nhượng, thu hồi - bồi thường, tranh chấp ranh giới.\n"
            "  + 📜 **Bộ luật Dân sự 2015**: Hợp đồng, đặt cọc, vay mượn, lãi suất, thừa kế di chúc & theo pháp luật.\n"
            "  + 💍 **Luật Hôn nhân & Gia đình 2014**: Thuận tình / đơn phương ly hôn, quyền nuôi con, phân chia tài sản chung.\n"
            "  + 🏢 **Luật Doanh nghiệp 2020**: Thành lập, cơ cấu quản trị, vốn điều lệ, người đại diện theo pháp luật.\n"
            "  + ⚖️ **Bộ luật Lao động 2019**: Hợp đồng lao động, thời hạn báo trước, chấm dứt HĐLĐ, sa thải, trợ cấp.\n"
            "- Trích dẫn căn cứ điều luật nguyên văn, không tự suy đoán hoặc đưa ra thông tin không có cơ sở pháp lý.\n"
            "- Hướng dẫn quy trình và hỗ trợ kết nối trực tiếp với Luật sư Nghiệp Hưng khi vụ việc phức tạp.\n\n"
            "Quý khách đang quan tâm đến nội dung hoặc tình huống pháp lý nào ạ?"
        )
    else:  # greeting
        response_text = (
            "Xin chào Quý khách! Tôi là **Trợ lý Pháp lý AI** của **Công ty Luật Hợp danh Nghiệp Hưng**.\n\n"
            "Tôi luôn sẵn sàng hỗ trợ Quý khách tra cứu và giải đáp các quy định pháp luật liên quan đến:\n"
            "- 🏡 **Đất đai & Bất động sản**: Cấp sổ đỏ có/không có giấy tờ, hợp đồng mua bán, tranh chấp đất đai, bồi thường.\n"
            "- 💍 **Hôn nhân & Gia đình**: Thủ tục ly hôn thuận tình/đơn phương, quyền trực tiếp nuôi con, phân chia tài sản chung/riêng.\n"
            "- 📜 **Dân sự & Hợp đồng**: Hợp đồng đặt cọc, phạt cọc, vay nợ, phân chia di sản thừa kế theo di chúc/pháp luật.\n"
            "- 🏢 **Doanh nghiệp**: Thành lập công ty, góp vốn, giải thể, quản trị nội bộ.\n"
            "- ⚖️ **Lao động**: Hợp đồng lao động, thời hạn báo trước, bồi thường khi đơn phương chấm dứt hợp đồng.\n\n"
            "Quý khách đang cần tôi hỗ trợ hoặc giải đáp vấn đề pháp lý nào hôm nay ạ?"
        )

    return {
        "response": response_text,
        "analysis": f"Xử lý giao tiếp tự nhiên (Ý định: {intent})",
        "metadata": {
            "has_grounding": True,
            "citations": [],
            "intent": intent,
            "action": (
                {"label": "Chuyển đến trang Đặt lịch tư vấn", "href": "/consultation"}
                if intent == "consultation_booking"
                else None
            ),
        },
    }


async def analyze_node(state: AgentState) -> dict:
    """Phân tích query từ user và truy xuất căn cứ pháp lý qua nomic-embed-text."""
    query = state.get("query", "")
    if not query.strip():
        return {
            "error": "Câu hỏi rỗng",
            "analysis": "Bạn chưa nhập câu hỏi vào đây.",
        }

    # Truy xuất các chunks liên quan
    retrieved = _rag_service.retrieve(query)
    if not retrieved:
        return {
            "analysis": "Câu hỏi không có căn cứ phù hợp trong cơ sở dữ liệu pháp luật hiện có (dưới ngưỡng tin cậy).",
            "context": "",
            "metadata": {"has_grounding": False, "citations": []},
        }

    citations = [chunk.breadcrumbs for chunk, _ in retrieved]
    context_str = "\n\n".join(
        [f"[{chunk.breadcrumbs}]\n{chunk.content}" for chunk, _ in retrieved]
    )

    return {
        "analysis": f"Đã tìm thấy {len(retrieved)} căn cứ pháp lý liên quan.",
        "context": context_str,
        "metadata": {
            "has_grounding": True,
            "citations": citations,
            "matched_count": len(retrieved),
        },
    }


async def respond_node(state: AgentState) -> dict:
    """Tạo câu trả lời tuân thủ quy tắc grounding nghiêm ngặt qua llama3.1."""
    query = state.get("query", "")
    error = state.get("error")

    if error:
        return {"response": f"Lỗi: {error}"}

    metadata = state.get("metadata", {})
    if not metadata.get("has_grounding", True):
        rejection_msg = (
            "Căn cứ vào cơ sở dữ liệu pháp luật hiện có, hệ thống không tìm thấy quy định phù hợp "
            "để đưa ra kết luận cho tình huống này. Quý khách vui lòng kiểm tra lại câu hỏi hoặc "
            "đặt lịch hẹn để được luật sư chuyên trách tư vấn trực tiếp."
        )
        return {
            "response": rejection_msg,
            "analysis": state.get("analysis", ""),
            "metadata": metadata,
        }

    rag_result = _rag_service.generate_answer(query)
    is_grounded = rag_result.get("has_grounding", True)
    merged_metadata = {
        **metadata,
        "citations": rag_result.get("citations", []),
        "has_grounding": is_grounded,
        "action": (
            metadata.get("action")
            if is_grounded
            else {"label": "Đặt lịch tư vấn với Luật sư", "href": "/consultation"}
        ),
    }

    return {
        "response": rag_result.get("response", ""),
        "analysis": rag_result.get("analysis", ""),
        "metadata": merged_metadata,
    }
