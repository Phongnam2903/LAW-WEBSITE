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
    elif intent == "bot_info":
        response_text = (
            "Tôi là **Trợ lý Pháp lý AI** của **Công ty Luật Hợp danh Nghiệp Hưng**, chuyên sâu về Pháp luật Việt Nam.\n\n"
            "Chức năng chính của tôi:\n"
            "- Tra cứu chính xác các điều khoản trong **Luật Doanh nghiệp 2020** và **Bộ luật Lao động 2019**.\n"
            "- Giải đáp các tình huống pháp lý có căn cứ, trích dẫn rõ số hiệu, điều khoản và ngày hiệu lực.\n"
            "- Kiểm soát tính chính xác, không tự suy đoán hoặc đưa ra thông tin không có cơ sở pháp lý.\n\n"
            "Quý khách đang quan tâm đến nội dung pháp lý nào ạ?"
        )
    else:  # greeting
        response_text = (
            "Xin chào Quý khách! Tôi là **Trợ lý Pháp lý AI** của **Công ty Luật Hợp danh Nghiệp Hưng**.\n\n"
            "Tôi có thể hỗ trợ Quý khách tra cứu và giải đáp các quy định pháp lý liên quan đến:\n"
            "- 🏢 **Luật Doanh nghiệp 2020**: Thành lập doanh nghiệp, góp vốn, người đại diện theo pháp luật, quyền & nghĩa vụ...\n"
            "- ⚖️ **Bộ luật Lao động 2019**: Hợp đồng lao động, thời hạn báo trước, tiền lương, kỷ luật, chấm dứt hợp đồng...\n\n"
            "Quý khách đang cần tôi hỗ trợ hoặc giải đáp thông tin pháp luật nào ạ?"
        )

    return {
        "response": response_text,
        "analysis": f"Xử lý giao tiếp tự nhiên (Ý định: {intent})",
        "metadata": {
            "has_grounding": True,
            "citations": [],
            "intent": intent,
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
    merged_metadata = {**metadata, "citations": rag_result.get("citations", [])}

    return {
        "response": rag_result.get("response", ""),
        "analysis": rag_result.get("analysis", ""),
        "metadata": merged_metadata,
    }
