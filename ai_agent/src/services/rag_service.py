import json
import math
from pathlib import Path
import re
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
        """Tạo vector embedding cho văn bản qua Ollama API (hỗ trợ tự động truncate tránh tràn context)."""
        # Thử endpoint hiện đại /api/embed trước (hỗ trợ tự truncate nếu vượt context 2048)
        embed_url = f"{self.ollama_base_url}/api/embed"
        try:
            with httpx.Client(timeout=60.0) as client:
                resp = client.post(
                    embed_url,
                    json={"model": self.embed_model, "input": text, "truncate": True},
                )
                if resp.status_code == 200:
                    data = resp.json()
                    embeddings = data.get("embeddings", [])
                    if embeddings:
                        return embeddings[0]
        except Exception:
            pass

        # Fallback về /api/embeddings cũ
        url = f"{self.ollama_base_url}/api/embeddings"
        safe_text = text[:6000] if len(text) > 6000 else text
        payload = {"model": self.embed_model, "prompt": safe_text}
        try:
            with httpx.Client(timeout=60.0) as client:
                resp = client.post(url, json=payload)
                resp.raise_for_status()
                data = resp.json()
                return data["embedding"]
        except Exception as e:
            raise RuntimeError(f"Lỗi khi gọi embedding từ Ollama ({self.embed_model}): {e}")

    def get_embeddings_batch(self, texts: list[str]) -> list[list[float]]:
        """Tạo vector embeddings cho một danh sách văn bản theo batch qua Ollama API."""
        embed_url = f"{self.ollama_base_url}/api/embed"
        try:
            with httpx.Client(timeout=120.0) as client:
                resp = client.post(
                    embed_url,
                    json={"model": self.embed_model, "input": texts, "truncate": True},
                )
                if resp.status_code == 200:
                    data = resp.json()
                    embeddings = data.get("embeddings", [])
                    if len(embeddings) == len(texts):
                        return embeddings
        except Exception:
            pass

        # Fallback tuần tự từng text nếu batch thất bại
        return [self.get_embedding(t) for t in texts]

    @staticmethod
    def cosine_similarity(v1: list[float], v2: list[float]) -> float:
        """Tính độ tương đồng cosin giữa 2 vector."""
        dot = sum(a * b for a, b in zip(v1, v2))
        norm1 = math.sqrt(sum(a * a for a in v1))
        norm2 = math.sqrt(sum(b * b for b in v2))
        if norm1 == 0.0 or norm2 == 0.0:
            return 0.0
        return dot / (norm1 * norm2)

    def initialize_index(self, force_reindex: bool = False, batch_size: int = 20):
        """Khởi tạo hoặc tải index vector từ cache, hỗ trợ batching, checkpointing và log tiến độ."""
        all_chunks = self.corpus_service.load_all_chunks()
        if not all_chunks:
            print("Cảnh báo: Không tìm thấy chunks nào để index.")
            self.initialized = True
            return

        cached_vectors: dict[str, list[float]] = {}
        if self.vector_cache_path.exists() and not force_reindex:
            try:
                with open(self.vector_cache_path, encoding="utf-8") as f:
                    cached_vectors = json.load(f)
            except Exception as e:
                print(f"Lỗi đọc vector cache: {e}")

        # Lọc ra các chunks chưa có trong cache
        pending_chunks = [c for c in all_chunks if c.chunk_id not in cached_vectors]
        total_chunks = len(all_chunks)
        already_cached = total_chunks - len(pending_chunks)

        if already_cached > 0:
            print(f"[OK] Da nap san {already_cached}/{total_chunks} chunks tu cache.", flush=True)

        if pending_chunks:
            print(f"[*] Dang vector hoa {len(pending_chunks)} chunks con thieu (Batch size: {batch_size})...", flush=True)
            total_batches = (len(pending_chunks) + batch_size - 1) // batch_size

            for batch_idx in range(total_batches):
                start_i = batch_idx * batch_size
                end_i = min(start_i + batch_size, len(pending_chunks))
                batch = pending_chunks[start_i:end_i]
                batch_texts = [f"{c.breadcrumbs}\n{c.content}" for c in batch]

                try:
                    embeddings = self.get_embeddings_batch(batch_texts)
                    for chunk, vec in zip(batch, embeddings):
                        cached_vectors[chunk.chunk_id] = vec
                except Exception as e:
                    print(f"  [!] Loi batch {batch_idx + 1}: {e}. Dang thu fallback tung chunk...", flush=True)
                    for chunk in batch:
                        embed_text = f"{chunk.breadcrumbs}\n{chunk.content}"
                        cached_vectors[chunk.chunk_id] = self.get_embedding(embed_text)

                # Checkpoint lưu ngay vào đĩa sau mỗi batch
                with open(self.vector_cache_path, "w", encoding="utf-8") as f:
                    json.dump(cached_vectors, f)

                done_count = already_cached + end_i
                pct = (done_count / total_chunks) * 100
                print(f"  -> Tien do: [{done_count}/{total_chunks}] ({pct:.1f}%) - Da luu checkpoint.", flush=True)

        self.vector_index = {}
        for chunk in all_chunks:
            cid = chunk.chunk_id
            if cid in cached_vectors:
                self.vector_index[cid] = {"vector": cached_vectors[cid], "chunk": chunk}

        self.initialized = True

    def retrieve(
        self, query: str, top_k: int = 4, min_similarity: float | None = None
    ) -> list[tuple[LegalChunk, float]]:
        """Truy xuất các chunk pháp luật bằng Hybrid Search (Vector + Lexical / Citation Boosting)."""
        if not self.initialized:
            self.initialize_index()

        threshold = min_similarity if min_similarity is not None else self.similarity_threshold
        query_vec = self.get_embedding(query)

        # Trích xuất số Điều nếu có trong câu hỏi (vd: "Điều 35", "dieu 35")
        art_match = re.search(r"điều\s+(\d+)", query, re.IGNORECASE)
        target_art = int(art_match.group(1)) if art_match else None

        q_lower = query.lower()
        q_tokens = set(re.findall(r"\w+", q_lower))

        scored: list[tuple[LegalChunk, float]] = []
        for item in self.vector_index.values():
            chunk: LegalChunk = item["chunk"]
            sim = self.cosine_similarity(query_vec, item["vector"])
            if sim < threshold:
                continue

            # Tính điểm Lexical / Hybrid Boost
            boost = 0.0

            # 1. Trùng khớp chính xác số Điều
            if target_art and chunk.article_number == target_art:
                boost += 0.15

            # 2. Trùng khớp văn bản luật được nêu tên rõ ràng trong câu hỏi
            b_lower = chunk.breadcrumbs.lower()
            if "lao động" in q_lower and ("bộ luật lao động" in b_lower or "45/2019/qh14" in chunk.chunk_id.lower()):
                boost += 0.12
            elif "đất đai" in q_lower and "đất đai" in b_lower:
                boost += 0.12
            elif "dân sự" in q_lower and "dân sự" in b_lower:
                boost += 0.12
            elif "doanh nghiệp" in q_lower and "doanh nghiệp" in b_lower:
                boost += 0.12
            elif "hôn nhân" in q_lower and "hôn nhân" in b_lower:
                boost += 0.12

            # 3. Mức độ trùng khớp từ khóa (Token overlap)
            c_tokens = set(re.findall(r"\w+", chunk.content.lower()))
            overlap = len(q_tokens.intersection(c_tokens)) / max(len(q_tokens), 1)
            token_score = overlap * 0.1

            total_score = sim + boost + token_score
            scored.append((chunk, total_score))

        # Sắp xếp theo điểm tổng hợp giảm dần
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
            "3. NGUYÊN TẮC VIỆN DẪN VÀ ĐÁNH GIÁ PHÁP LÝ CHUẨN XÁC:\n"
            "   - Viện dẫn đúng Điều: Thủ tục hòa giải tranh chấp đất đai tại UBND cấp xã quy định tại ĐIỀU 235 Luật Đất đai 2024; Thẩm quyền giải quyết tranh chấp đất đai quy định tại ĐIỀU 236 Luật Đất đai 2024. Tuyệt đối không dẫn nhầm thủ tục hòa giải sang Điều 236.\n"
            "   - Phân biệt bản chất tranh chấp: Tranh chấp xác định ai là người có quyền sử dụng đất thì hòa giải tại UBND cấp xã là thủ tục tiền tố tụng bắt buộc; Tranh chấp giao dịch, hợp đồng, thừa kế, chia tài sản gắn liền với đất thì không bắt buộc hòa giải tại UBND cấp xã, có thể khởi kiện trực tiếp ra Tòa án.\n"
            "   - Tình huống đất chưa có Sổ đỏ: Đất chưa có Sổ đỏ KHÔNG CÓ NGHĨA là không được khởi kiện Tòa án. Cần phân định: Nếu có một trong các loại giấy tờ tại Điều 137 thì thuộc thẩm quyền giải quyết của Tòa án nhân dân; Nếu vừa không có Sổ đỏ vừa không có giấy tờ Điều 137 thì đương sự được quyền LỰA CHỌN giữa Tòa án nhân dân hoặc UBND có thẩm quyền.\n"
            "   - Thẩm quyền UBND theo quy định phân cấp mới: Đối với tranh chấp giữa cá nhân, hộ gia đình, cộng đồng dân cư khi chọn con đường hành chính tại UBND, lưu ý cơ chế phân định thẩm quyền chính quyền địa phương hai cấp (áp dụng từ 01/07/2025 theo Nghị định 151/2025/NĐ-CP): thẩm quyền đã được chuyển giao cho Chủ tịch UBND cấp xã giải quyết.\n"
            "4. BẮT BUỘC trình bày câu trả lời theo đúng 4 phần sau:\n"
            "### 1. Kết luận & Hướng dẫn giải quyết:\n"
            "(Nêu câu trả lời rõ ràng, chính xác, trực diện)\n\n"
            "### 2. Căn cứ điều luật áp dụng:\n"
            "(Chỉ rõ tên văn bản luật, số hiệu, Điều, Khoản, Điểm liên quan)\n\n"
            "### 3. Đoạn trích dẫn nguyên văn:\n"
            "(Trích dẫn chính xác nguyên văn quy định từ ngữ trong điều luật, đặt trong dấu ngoặc kép, tuyệt đối không thêm ký hiệu '>' ở đầu dòng trích dẫn)\n\n"
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
