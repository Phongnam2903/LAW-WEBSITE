import json
import math
from pathlib import Path
from typing import Any

import httpx

from src.config import get_settings
from src.models.legal_document import LegalChunk
from src.services.legal_corpus_service import LegalCorpusService


class LegalRAGService:
    """Service thực hiện RAG pháp luật hỗ trợ Hybrid (Ollama Local & Google Gemini Flash)."""

    def __init__(
        self,
        llm_provider: str | None = None,
        gemini_api_key: str | None = None,
        gemini_model: str | None = None,
        ollama_base_url: str | None = None,
        embed_model: str | None = None,
        llm_model: str | None = None,
        similarity_threshold: float = 0.48,
        data_root: Path | None = None,
    ):
        settings = get_settings()
        self.llm_provider = llm_provider or settings.llm_provider
        self.gemini_api_key = gemini_api_key if gemini_api_key is not None else settings.gemini_api_key
        self.gemini_model = gemini_model or settings.gemini_model

        self.ollama_base_url = ollama_base_url or settings.ollama_base_url
        self.embed_model = embed_model or settings.ollama_embed_model
        self.llm_model = llm_model or settings.ollama_model
        self.similarity_threshold = similarity_threshold

        self.corpus_service = LegalCorpusService(data_root=data_root)
        self.cache_dir = self.corpus_service.data_root / "cache"
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.vector_cache_path = self.cache_dir / "vector_index_cache.json"

        # Index vectors in memory: {chunk_id: {"vector": [...], "chunk": LegalChunk}}
        self.vector_index: dict[str, dict[str, Any]] = {}
        self.initialized = False

    def get_embedding(self, text: str) -> list[float]:
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
    def cosine_similarity(v1: list[float], v2: list[float]) -> float:
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
                with open(self.vector_cache_path, encoding="utf-8") as f:
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
        self, query: str, top_k: int = 3, min_similarity: float | None = None
    ) -> list[tuple[LegalChunk, float]]:
        """Truy xuất các chunk có độ tương đồng ngữ nghĩa cao nhất với query."""
        if not self.initialized:
            self.initialize_index()

        threshold = min_similarity if min_similarity is not None else self.similarity_threshold
        query_vec = self.get_embedding(query)

        scored: list[tuple[LegalChunk, float]] = []
        for item in self.vector_index.values():
            sim = self.cosine_similarity(query_vec, item["vector"])
            if sim >= threshold:
                scored.append((item["chunk"], sim))

        # Sắp xếp theo độ tương đồng giảm dần
        scored.sort(key=lambda x: x[1], reverse=True)
        return scored[:top_k]

    def generate_answer(self, query: str) -> dict[str, Any]:
        """Thực hiện toàn bộ quy trình RAG (Retrieval + Strict Grounded Generation)."""
        if not self.initialized:
            self.initialize_index()

        retrieved = self.retrieve(query)

        # Trường hợp KHÔNG ĐỦ CĂN CỨ hoặc NGOÀI PHẠM VI DỮ LIỆU
        if not retrieved:
            rejection_message = (
                "Căn cứ vào cơ sở dữ liệu pháp luật hiện có, hệ thống không tìm thấy quy định phù hợp "
                "để đưa ra kết luận cho tình huống này. Quý khách vui lòng kiểm tra lại câu hỏi hoặc "
                "đặt lịch hẹn để được luật sư Công ty Luật Hợp danh Nghiệp Hưng tư vấn trực tiếp."
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
            "Bạn là Trợ lý Pháp lý AI của Công ty Luật Hợp danh Nghiệp Hưng, chuyên sâu về Pháp luật Việt Nam. "
            "Nhiệm vụ của bạn là giải đáp thắc mắc của người dùng DỰA HOÀN TOÀN VÀO CĂN CỨ PHÁP LÝ ĐƯỢC CUNG CẤP DƯỚI ĐÂY.\n\n"
            "QUY TẮC BẮT BUỘC:\n"
            "1. CHỈ sử dụng thông tin có trong phần CĂN CỨ PHÁP LÝ. TUYỆT ĐỐI KHÔNG tự suy đoán, bịa đặt hoặc đưa ra thông tin không có trong tài liệu.\n"
            "2. Nếu căn cứ pháp lý được cung cấp KHÔNG ĐỦ để trả lời chính xác, bạn BẮT BUỘC phải trả lời: "
            "'Căn cứ vào cơ sở dữ liệu pháp luật hiện có, hệ thống không tìm thấy quy định phù hợp để đưa ra kết luận cho tình huống này. "
            "Quý khách vui lòng kiểm tra lại câu hỏi hoặc đặt lịch hẹn để được luật sư Công ty Luật Hợp danh Nghiệp Hưng tư vấn trực tiếp.'\n"
            "3. BẮT BUỘC trình bày câu trả lời theo đúng 4 phần sau:\n"
            "### 1. Kết luận & Hướng dẫn giải quyết:\n"
            "(Nêu câu trả lời rõ ràng, chính xác, trực diện)\n\n"
            "### 2. Căn cứ điều luật áp dụng:\n"
            "(Chỉ rõ tên văn bản luật, số hiệu, Điều, Khoản, Điểm liên quan)\n\n"
            "### 3. Đoạn trích dẫn nguyên văn:\n"
            "(Trích dẫn chính xác nguyên văn quy định từ ngữ trong điều luật)\n\n"
            "### 4. Khuyến nghị từ Luật Nghiệp Hưng:\n"
            "(Lưu ý rủi ro pháp lý thực tế, các giấy tờ/chứng cứ cần lưu trữ hoặc chuẩn bị, và đề xuất đặt lịch làm việc với luật sư nếu vụ việc phức tạp hoặc có nguy cơ tranh chấp)\n"
        )

        user_prompt = (
            f"=== CĂN CỨ PHÁP LÝ ĐÃ TRUY XUẤT ===\n{context_text}\n\n"
            f"=== CÂU HỎI CỦA NGƯỜI DÙNG ===\n{query}\n\n"
            "Hãy trả lời tuân thủ nghiêm ngặt các quy tắc trên."
        )

        full_prompt = f"{system_prompt}\n\n{user_prompt}"

        # Xác định provider và thực thi suy luận (Hybrid: Gemini Flash siêu tốc hoặc Ollama Local)
        try:
            if self.llm_provider == "gemini" and self.gemini_api_key:
                raw_response, used_model = self._generate_with_gemini(full_prompt)
                provider_used = f"Google Gemini Flash ({used_model})"
            else:
                raw_response = self._generate_with_ollama(full_prompt)
                provider_used = f"Ollama Local ({self.llm_model})"

            is_grounded = "không tìm thấy quy định phù hợp" not in raw_response
            effective_citations = citations_list if is_grounded else []

            return {
                "response": raw_response,
                "citations": effective_citations,
                "has_grounding": is_grounded,
                "analysis": (
                    f"Truy xuất thành công {len(retrieved)} căn cứ pháp lý. Suy luận hoàn tất qua {provider_used}."
                    if is_grounded
                    else f"LLM nhận diện {len(retrieved)} đoạn trích không đủ cơ sở để trả lời. Đã đưa ra thông báo từ chối suy đoán."
                ),
                "sources": sources_list if is_grounded else [],
            }
        except Exception as e:
            # Nếu Gemini gặp sự cố (mạng, quota), tự động fallback sang Ollama
            if self.llm_provider == "gemini" and self.gemini_api_key:
                try:
                    fallback_response = self._generate_with_ollama(full_prompt)
                    is_fallback_grounded = "không tìm thấy quy định phù hợp" not in fallback_response
                    return {
                        "response": fallback_response,
                        "citations": citations_list if is_fallback_grounded else [],
                        "has_grounding": is_fallback_grounded,
                        "analysis": f"Gemini gặp sự cố ({e}), đã fallback thành công sang Ollama Local ({self.llm_model}).",
                        "sources": sources_list if is_fallback_grounded else [],
                    }
                except Exception as fallback_e:
                    err_msg = f"Lỗi Gemini: {e} | Lỗi Fallback Ollama: {fallback_e}"
            else:
                err_msg = str(e)

            return {
                "response": f"Lỗi trong quá trình suy luận pháp lý qua LLM: {err_msg}",
                "citations": citations_list,
                "has_grounding": False,
                "analysis": f"LLM error: {err_msg}",
                "sources": sources_list,
            }

    def _generate_with_gemini(self, prompt: str) -> tuple[str, str]:
        """Sinh phản hồi siêu tốc qua Google Gemini Flash API (1-2s).

        Tự động fallback giữa các phiên bản Flash khả dụng (3.5-flash-lite, 2.5-flash) nếu gặp 404 hoặc 503.
        """
        if not self.gemini_api_key:
            raise ValueError(
                "Chưa cấu hình GEMINI_API_KEY trong file .env. Vui lòng cung cấp API key để sử dụng Gemini Flash."
            )

        candidate_models = [self.gemini_model, "gemini-3.5-flash-lite", "gemini-2.5-flash", "gemini-flash-latest"]
        unique_models: list[str] = []
        for m in candidate_models:
            if m not in unique_models:
                unique_models.append(m)

        last_error = "Không có model nào phản hồi"
        for model in unique_models:
            url = (
                f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
                f"?key={self.gemini_api_key}"
            )
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.1,
                    "topP": 0.9,
                    "maxOutputTokens": 800,
                },
            }
            try:
                with httpx.Client(timeout=25.0) as client:
                    resp = client.post(url, json=payload)
                    if resp.status_code != 200:
                        last_error = f"Model {model} returned status {resp.status_code}: {resp.text[:120]}"
                        continue
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if not candidates:
                        continue
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if not parts:
                        continue
                    text = parts[0].get("text", "").strip()
                    if text:
                        return text, model
            except Exception as e:
                last_error = str(e)
                continue

        raise RuntimeError(f"Tất cả model Gemini đều không phản hồi thành công: {last_error}")

    def _generate_with_ollama(self, prompt: str) -> str:
        """Sinh phản hồi qua Ollama Local (chế độ On-Premise offline)."""
        llm_url = f"{self.ollama_base_url}/api/generate"
        payload = {
            "model": self.llm_model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.1,
                "top_p": 0.9,
                "num_predict": 512,
            },
        }
        with httpx.Client(timeout=300.0) as client:
            resp = client.post(llm_url, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data.get("response", "").strip()
