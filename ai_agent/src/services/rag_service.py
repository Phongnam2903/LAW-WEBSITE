import json
import math
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import httpx

from src.models.legal_document import LegalChunk
from src.services.legal_corpus_service import LegalCorpusService


class LegalRAGService:
    """Service thực hiện RAG pháp luật với nomic-embed-text và llama3.1 qua Ollama local."""

    def __init__(
        self,
        ollama_base_url: str = "http://localhost:11434",
        embed_model: str = "nomic-embed-text:latest",
        llm_model: str = "llama3.1:latest",
        similarity_threshold: float = 0.42,
        data_root: Optional[Path] = None,
    ):
        self.ollama_base_url = ollama_base_url
        self.embed_model = embed_model
        self.llm_model = llm_model
        self.similarity_threshold = similarity_threshold

        self.corpus_service = LegalCorpusService(data_root=data_root)
        self.cache_dir = self.corpus_service.data_root / "cache"
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.vector_cache_path = self.cache_dir / "vector_index_cache.json"

        # Index vectors in memory: {chunk_id: {"vector": [...], "chunk": LegalChunk}}
        self.vector_index: Dict[str, Dict[str, Any]] = {}
        self.initialized = False

    def get_embedding(self, text: str) -> List[float]:
        """Tạo vector embedding cho văn bản qua Ollama API."""
        url = f"{self.ollama_base_url}/api/embeddings"
        payload = {"model": self.embed_model, "prompt": text}
        try:
            with httpx.Client(timeout=30.0) as client:
                resp = client.post(url, json=payload)
                resp.raise_for_status()
                data = resp.json()
                return data["embedding"]
        except Exception as e:
            raise RuntimeError(f"Lỗi khi gọi embedding từ Ollama ({self.embed_model}): {e}")

    @staticmethod
    def cosine_similarity(v1: List[float], v2: List[float]) -> float:
        """Tính độ tương đồng cosin giữa 2 vector."""
        dot = sum(a * b for a, b in zip(v1, v2))
        norm1 = math.sqrt(sum(a * a for a in v1))
        norm2 = math.sqrt(sum(b * b for b in v2))
        if norm1 == 0.0 or norm2 == 0.0:
            return 0.0
        return dot / (norm1 * norm2)

    def initialize_index(self, force_reindex: bool = False):
        """Khởi tạo hoặc tải index vector từ cache."""
        all_chunks = self.corpus_service.load_all_chunks()
        if not all_chunks:
            print("Cảnh báo: Không tìm thấy chunks nào để index.")
            self.initialized = True
            return

        cached_vectors = {}
        if self.vector_cache_path.exists() and not force_reindex:
            try:
                with open(self.vector_cache_path, "r", encoding="utf-8") as f:
                    cached_vectors = json.load(f)
            except Exception as e:
                print(f"Lỗi đọc vector cache: {e}")

        # Cập nhật các chunks chưa có trong cache
        updated = False
        self.vector_index = {}

        for chunk in all_chunks:
            cid = chunk.chunk_id
            if cid in cached_vectors:
                vec = cached_vectors[cid]
            else:
                # Tạo embedding mới từ nội dung kèm breadcrumbs
                embed_text = f"{chunk.breadcrumbs}\n{chunk.content}"
                vec = self.get_embedding(embed_text)
                cached_vectors[cid] = vec
                updated = True

            self.vector_index[cid] = {"vector": vec, "chunk": chunk}

        if updated:
            with open(self.vector_cache_path, "w", encoding="utf-8") as f:
                json.dump(cached_vectors, f)

        self.initialized = True

    def retrieve(
        self, query: str, top_k: int = 3, min_similarity: Optional[float] = None
    ) -> List[Tuple[LegalChunk, float]]:
        """Truy xuất các chunk có độ tương đồng ngữ nghĩa cao nhất với query."""
        if not self.initialized:
            self.initialize_index()

        threshold = min_similarity if min_similarity is not None else self.similarity_threshold
        query_vec = self.get_embedding(query)

        scored: List[Tuple[LegalChunk, float]] = []
        for item in self.vector_index.values():
            sim = self.cosine_similarity(query_vec, item["vector"])
            if sim >= threshold:
                scored.append((item["chunk"], sim))

        # Sắp xếp theo độ tương đồng giảm dần
        scored.sort(key=lambda x: x[1], reverse=True)
        return scored[:top_k]

    def generate_answer(self, query: str) -> Dict[str, Any]:
        """Thực hiện toàn bộ quy trình RAG (Retrieval + Strict Grounded Generation)."""
        if not self.initialized:
            self.initialize_index()

        retrieved = self.retrieve(query)

        # Trường hợp KHÔNG ĐỦ CĂN CỨ hoặc NGOÀI PHẠM VI DỮ LIỆU
        if not retrieved:
            rejection_message = (
                "Căn cứ vào cơ sở dữ liệu pháp luật hiện có, hệ thống không tìm thấy quy định phù hợp "
                "để đưa ra kết luận cho tình huống này. Quý khách vui lòng kiểm tra lại câu hỏi hoặc "
                "đặt lịch hẹn để được luật sư chuyên trách tư vấn trực tiếp."
            )
            return {
                "response": rejection_message,
                "citations": [],
                "has_grounding": False,
                "analysis": "Không có đoạn trích pháp luật nào vượt qua ngưỡng tương đồng tối thiểu (Câu hỏi ngoài phạm vi dữ liệu).",
                "sources": [],
            }

        # Xây dựng context ngữ cảnh pháp luật từ các chunks tìm thấy
        context_blocks = []
        citations_list = []
        sources_list = []

        for i, (chunk, score) in enumerate(retrieved, start=1):
            context_blocks.append(
                f"[ĐOẠN TRÍCH {i}] ({chunk.breadcrumbs})\n{chunk.content}"
            )
            citation_item = f"{chunk.breadcrumbs}"
            if citation_item not in citations_list:
                citations_list.append(citation_item)
            sources_list.append({
                "chunk_id": chunk.chunk_id,
                "article_number": chunk.article_number,
                "title": chunk.title,
                "score": round(score, 4),
            })

        context_text = "\n\n".join(context_blocks)

        system_prompt = (
            "Bạn là Trợ lý Pháp lý AI chuyên sâu về Pháp luật Việt Nam. Nhiệm vụ của bạn là giải đáp thắc mắc "
            "của người dùng DỰA HOÀN TOÀN VÀO CĂN CỨ PHÁP LÝ ĐƯỢC CUNG CẤP DƯỚI ĐÂY.\n\n"
            "QUY TẮC BẮT BUỘC:\n"
            "1. CHỈ sử dụng thông tin có trong phần CĂN CỨ PHÁP LÝ. TUYỆT ĐỐI KHÔNG tự suy đoán, bịa đặt hoặc đưa ra thông tin không có trong tài liệu.\n"
            "2. Nếu căn cứ pháp lý được cung cấp KHÔNG ĐỦ để trả lời chính xác, bạn BẮT BUỘC phải trả lời: "
            "'Căn cứ vào cơ sở dữ liệu pháp luật hiện có, hệ thống không tìm thấy quy định phù hợp để đưa ra kết luận cho tình huống này. "
            "Quý khách vui lòng kiểm tra lại câu hỏi hoặc đặt lịch hẹn để được luật sư chuyên trách tư vấn trực tiếp.'\n"
            "3. BẮT BUỘC trình bày câu trả lời theo đúng 4 phần sau:\n"
            "### 1. Kết luận & Hướng dẫn giải quyết:\n"
            "(Nêu câu trả lời rõ ràng, chính xác, trực diện)\n\n"
            "### 2. Căn cứ điều luật áp dụng:\n"
            "(Chỉ rõ tên văn bản luật, số hiệu, Điều, Khoản, Điểm liên quan)\n\n"
            "### 3. Đoạn trích dẫn nguyên văn:\n"
            "(Trích dẫn chính xác nguyên văn quy định từ ngữ trong điều luật)\n\n"
            "### 4. Nguồn kiểm chứng:\n"
            "(Ghi rõ nguồn: Cổng Thông tin điện tử Chính phủ / Cơ sở dữ liệu quốc gia về văn bản pháp luật, ngày ban hành và ngày có hiệu lực)\n"
        )

        user_prompt = (
            f"=== CĂN CỨ PHÁP LÝ ĐÃ TRUY XUẤT ===\n{context_text}\n\n"
            f"=== CÂU HỎI CỦA NGƯỜI DÙNG ===\n{query}\n\n"
            "Hãy trả lời tuân thủ nghiêm ngặt các quy tắc trên."
        )

        llm_url = f"{self.ollama_base_url}/api/generate"
        payload = {
            "model": self.llm_model,
            "prompt": f"{system_prompt}\n\n{user_prompt}",
            "stream": False,
            "options": {
                "temperature": 0.1,
                "top_p": 0.9,
                "num_predict": 512,
            },
        }

        try:
            with httpx.Client(timeout=300.0) as client:
                resp = client.post(llm_url, json=payload)
                resp.raise_for_status()
                data = resp.json()
                raw_response = data.get("response", "").strip()

            return {
                "response": raw_response,
                "citations": citations_list,
                "has_grounding": True,
                "analysis": f"Truy xuất thành công {len(retrieved)} căn cứ pháp lý liên quan từ kho dữ liệu.",
                "sources": sources_list,
            }
        except Exception as e:
            return {
                "response": f"Lỗi trong quá trình suy luận pháp lý qua LLM: {str(e)}",
                "citations": citations_list,
                "has_grounding": False,
                "analysis": f"LLM error: {str(e)}",
                "sources": sources_list,
            }
