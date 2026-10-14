import json
from pathlib import Path
from typing import Dict, List, Optional

from src.models.legal_document import Article, LegalChunk, LegalCorpusChunks, LegalDocument


class LegalCorpusService:
    """Service doanh nghiệp để nạp, tra cứu và xử lý Corpus văn bản pháp luật."""

    def __init__(self, data_root: Optional[Path] = None):
        if data_root is None:
            # Mặc định trỏ về ai_agent/data
            self.data_root = Path(__file__).resolve().parent.parent.parent / "data"
        else:
            self.data_root = data_root

        self.processed_dir = self.data_root / "processed" / "legal_corpus"
        self.embeddings_dir = self.data_root / "embeddings"

    def load_document(self, domain: str, filename: str) -> LegalDocument:
        """Đọc và validate file văn bản pháp luật chuẩn hóa JSON."""
        file_path = self.processed_dir / domain / filename
        if not file_path.exists():
            raise FileNotFoundError(f"Không tìm thấy tài liệu tại: {file_path}")

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        return LegalDocument.model_validate(data)

    def load_all_documents(self) -> List[LegalDocument]:
        """Tải toàn bộ văn bản pháp luật trong kho processed corpus."""
        documents: List[LegalDocument] = []
        if not self.processed_dir.exists():
            return documents

        for json_path in self.processed_dir.glob("*/*.json"):
            try:
                with open(json_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                documents.append(LegalDocument.model_validate(data))
            except Exception as e:
                print(f"Bỏ qua file không hợp lệ {json_path}: {e}")
        return documents

    def load_chunks(self, domain: str, filename: str) -> LegalCorpusChunks:
        """Đọc file RAG chunks đã chuẩn hóa."""
        file_path = self.embeddings_dir / domain / filename
        if not file_path.exists():
            raise FileNotFoundError(f"Không tìm thấy file chunks tại: {file_path}")

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        return LegalCorpusChunks.model_validate(data)

    def load_all_chunks(self) -> List[LegalChunk]:
        """Tải toàn bộ các chunk pháp luật để phục vụ Embedding & Vector Search."""
        all_chunks: List[LegalChunk] = []
        if not self.embeddings_dir.exists():
            return all_chunks

        for json_path in self.embeddings_dir.glob("*/*chunks.json"):
            try:
                with open(json_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                corpus = LegalCorpusChunks.model_validate(data)
                all_chunks.extend(corpus.chunks)
            except Exception as e:
                print(f"Bỏ qua file chunks {json_path}: {e}")
        return all_chunks

    def find_article_by_number(self, document: LegalDocument, article_number: int) -> Optional[Article]:
        """Tra cứu nhanh một Điều theo số Điều trong một văn bản."""
        for chapter in document.body.chapters:
            # Kiểm tra trong các articles trực tiếp của chapter
            for article in chapter.articles:
                if article.article_number == article_number:
                    return article
            # Kiểm tra trong sections nếu có
            if chapter.sections:
                for section in chapter.sections:
                    for article in section.articles:
                        if article.article_number == article_number:
                            return article
        return None

    def search_articles_by_keyword(self, document: LegalDocument, keyword: str) -> List[Article]:
        """Tìm kiếm các Điều có chứa từ khóa hoặc tag liên quan."""
        keyword_lower = keyword.lower()
        results: List[Article] = []

        all_articles: List[Article] = []
        for chapter in document.body.chapters:
            all_articles.extend(chapter.articles)
            if chapter.sections:
                for section in chapter.sections:
                    all_articles.extend(section.articles)

        for article in all_articles:
            if (
                keyword_lower in article.title.lower()
                or keyword_lower in article.full_text.lower()
                or any(keyword_lower in tag.lower() for tag in article.tags)
            ):
                results.append(article)

        return results
