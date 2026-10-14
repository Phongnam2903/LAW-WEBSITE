
from langchain_core.tools import tool

from src.models.legal_document import LegalDocument
from src.services.legal_corpus_service import LegalCorpusService

# Khởi tạo service corpus
_corpus_service = LegalCorpusService()
_cached_docs: list[LegalDocument] | None = None


def _get_all_laws() -> list[LegalDocument]:
    global _cached_docs
    if _cached_docs is None:
        _cached_docs = _corpus_service.load_all_documents()
    return _cached_docs


@tool
def lookup_vietnam_law_article(article_number: int, law_keyword: str = "") -> str:
    """Tra cứu toàn văn một Điều cụ thể trong cơ sở dữ liệu pháp luật (Luật Doanh nghiệp 2020, Bộ luật Lao động 2019...).

    Args:
        article_number: Số thứ tự của Điều cần tra cứu (ví dụ: 35, 36, 4, 12, 111)
        law_keyword: Tên viết tắt hoặc từ khóa tên luật (ví dụ: 'lao động', 'doanh nghiệp', để trống để tìm tất cả)

    Returns:
        Nội dung điều luật, tên điều, các khoản và điểm chi tiết.
    """
    try:
        docs = _get_all_laws()
        results = []

        for doc in docs:
            if law_keyword and law_keyword.lower() not in doc.title.lower() and law_keyword.lower() not in (doc.short_title or "").lower():
                continue

            art = _corpus_service.find_article_by_number(doc, article_number)
            if art:
                res = [f"=== [{doc.short_title or doc.title}] Điều {art.article_number}. {art.title} ==="]
                res.append(f"Toàn văn: {art.full_text}")
                if art.tags:
                    res.append(f"Từ khóa phân loại: {', '.join(art.tags)}")
                if art.cross_references:
                    res.append(f"Viện dẫn liên quan: {', '.join(art.cross_references)}")
                results.append("\n".join(res))

        if not results:
            return f"Không tìm thấy Điều {article_number} trong cơ sở dữ liệu pháp luật hiện có."

        return "\n\n---\n\n".join(results)
    except Exception as e:
        return f"Lỗi khi tra cứu Điều luật: {str(e)}"


@tool
def search_vietnam_law_by_keyword(keyword: str) -> str:
    """Tìm kiếm các điều khoản trong toàn bộ cơ sở dữ liệu pháp luật (Doanh nghiệp, Lao động...) theo từ khóa.

    Args:
        keyword: Từ khóa cần tra cứu (ví dụ: 'đơn phương chấm dứt hợp đồng', 'báo trước 45 ngày', 'vốn điều lệ')

    Returns:
        Danh sách các Điều luật phù hợp kèm tóm tắt nội dung.
    """
    try:
        docs = _get_all_laws()
        all_matched = []

        for doc in docs:
            matched = _corpus_service.search_articles_by_keyword(doc, keyword)
            for art in matched:
                all_matched.append((doc, art))

        if not all_matched:
            return f"Không tìm thấy điều khoản nào khớp với từ khóa '{keyword}'."

        res = [f"Tìm thấy {len(all_matched)} điều khoản liên quan đến '{keyword}':\n"]
        for doc, art in all_matched[:5]:  # Giới hạn top 5 kết quả
            res.append(f"- [{doc.short_title or doc.title}] Điều {art.article_number}. {art.title}")
            res.append(f"  Tóm tắt/Nội dung: {art.full_text[:200]}...")
        return "\n".join(res)
    except Exception as e:
        return f"Lỗi khi tìm kiếm luật: {str(e)}"
