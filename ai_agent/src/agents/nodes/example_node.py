from typing import Any, Dict
from src.agents.state import AgentState
from src.services.rag_service import LegalRAGService

# Khởi tạo singleton RAG service
_rag_service = LegalRAGService()


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
