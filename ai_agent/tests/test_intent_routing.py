import asyncio
import sys
from pathlib import Path

# Đảm bảo in tiếng Việt chuẩn trên Windows
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

from src.agents.graph import agent  # noqa: E402


async def run_tests():
    test_cases = [
        ("hello", "greeting", 0),
        ("xin chào", "greeting", 0),
        ("cảm ơn bạn", "gratitude", 0),
        ("bạn là ai", "bot_info", 0),
        ("tôi muốn đặt lịch gặp luật sư tư vấn", "consultation_booking", 0),
        ("địa chỉ văn phòng công ty luật ở đâu", "consultation_booking", 0),
    ]

    print("=== BẮT ĐẦU KIỂM THỬ ĐỊNH TUYẾN Ý ĐỊNH (INTENT ROUTING) ===")

    for query, expected_intent, expected_citations_count in test_cases:
        result = await agent.ainvoke({"query": query})
        metadata = result.get("metadata", {}) or {}
        intent = metadata.get("intent")
        citations = metadata.get("citations", [])
        response = result.get("response", "")

        print(f"\n[Test query]: '{query}'")
        print(f"-> Detected Intent: {intent}")
        print(f"-> Citations count: {len(citations)}")
        print(f"-> Response snippet: {response[:120]}...")

        assert intent == expected_intent, f"Sai intent: kỳ vọng {expected_intent}, nhận {intent}"
        assert len(citations) == expected_citations_count, "Citations phải bằng 0 cho lời chào"
        assert len(response) > 0, "Response không được rỗng"
        print("✔ ĐẠT CHUẨN!")

    print("\n>>> TẤT CẢ CÁC BÀI TEST CHÀO HỎI & GIAO TIẾP ĐÃ THÀNH CÔNG! <<<")


if __name__ == "__main__":
    asyncio.run(run_tests())
