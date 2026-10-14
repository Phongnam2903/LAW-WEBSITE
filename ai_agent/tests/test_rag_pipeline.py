import io
import sys
from pathlib import Path

# Đảm bảo in tiếng Việt chuẩn trên console Windows
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# Thêm ai_agent vào sys.path
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

from src.services.rag_service import LegalRAGService  # noqa: E402


def test_rag_pipeline():
    rag = LegalRAGService()
    print("=== ĐANG KHỞI TẠO VÀ INDEX CORPUS PHÁP LUẬT ===")
    rag.initialize_index()
    print(f"✔ Đã nạp và vector hóa thành công {len(rag.vector_index)} chunks pháp luật.")

    # ---------------------------------------------------------
    # TEST CASE 1: CÂU HỎI CÓ CĂN CỨ TRONG BỘ LUẬT LAO ĐỘNG (ĐIỀU 35)
    # ---------------------------------------------------------
    q1 = (
        "Người lao động làm việc theo hợp đồng lao động không xác định thời hạn "
        "khi đơn phương chấm dứt hợp đồng thì phải báo trước ít nhất bao nhiêu ngày theo Điều 35 Bộ luật Lao động?"
    )
    print("\n--- TEST CASE 1: CÂU HỎI CÓ CĂN CỨ PHÁP LÝ ---")
    print(f"Câu hỏi: {q1}")

    result1 = rag.generate_answer(q1)
    print(f"Has Grounding: {result1['has_grounding']}")
    print(f"Citations: {result1['citations']}")
    print(f"\nCâu trả lời từ Agent:\n{result1['response']}")

    assert result1["has_grounding"] is True, "Test Case 1 thất bại: Hệ thống phải nhận diện được căn cứ pháp lý."
    assert "45 ngày" in result1["response"] or "bốn mươi lăm" in result1["response"].lower(), (
        "Test Case 1 thất bại: Không tìm thấy quy định báo trước 45 ngày."
    )
    assert "Điều 35" in result1["response"], "Test Case 1 thất bại: Không viện dẫn Điều 35."
    print("✔ TEST CASE 1 ĐẠT CHUẨN!")

    # ---------------------------------------------------------
    # TEST CASE 2: CÂU HỎI NGOÀI PHẠM VI DỮ LIỆU HIỆN CÓ
    # ---------------------------------------------------------
    q2 = (
        "Theo Luật Thủy sản Việt Nam, thủ tục cấp giấy phép khai thác thủy sản tại vùng khơi "
        "được quy định như thế nào và thời hạn của giấy phép là bao nhiêu năm?"
    )
    print("\n--- TEST CASE 2: CÂU HỎI NGOÀI PHẠM VI DỮ LIỆU ---")
    print(f"Câu hỏi: {q2}")

    result2 = rag.generate_answer(q2)
    print(f"Has Grounding: {result2['has_grounding']}")
    print(f"Phản hồi từ chối: {result2['response']}")

    assert result2["has_grounding"] is False, "Test Case 2 thất bại: Câu hỏi ngoài phạm vi phải có has_grounding=False."
    assert "không tìm thấy quy định phù hợp" in result2["response"], (
        "Test Case 2 thất bại: Không đưa ra thông điệp từ chối kết luận chuẩn."
    )
    print("✔ TEST CASE 2 ĐẠT CHUẨN!")

    print("\n=======================================================")
    print(">>> TẤT CẢ CÁC BÀI TEST RAG PIPELINE ĐỀU ĐẠT 100%! <<<")
    print("=======================================================")


if __name__ == "__main__":
    test_rag_pipeline()
