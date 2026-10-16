import io
import json
import sys
from pathlib import Path

# Đảm bảo console Windows hiển thị đúng UTF-8
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# Thêm đường dẫn ai_agent vào sys.path để import models
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

from src.models.legal_document import LegalCorpusChunks, LegalDocument


def validate_legal_files():
    data_dir = project_root / "data"
    schema_file = data_dir / "schemas" / "vietnam_legal_document.schema.json"
    corpus_file = (
        data_dir
        / "processed"
        / "legal_corpus"
        / "corporate"
        / "hf_59-2020-qh14.json"
    )
    chunks_file = (
        data_dir
        / "embeddings"
        / "corporate"
        / "hf_59-2020-qh14_chunks.json"
    )

    print("=== KIỂM TRA CHUẨN DỮ LIỆU PHÁP LUẬT DOANH NGHIỆP ===")

    # 1. Kiểm tra file tồn tại
    assert schema_file.exists(), f"Thiếu file schema: {schema_file}"
    assert corpus_file.exists(), f"Thiếu file corpus: {corpus_file}"
    assert chunks_file.exists(), f"Thiếu file chunks: {chunks_file}"
    print("✔ Đã tìm thấy đầy đủ các file dữ liệu theo cấu trúc thư mục enterprise.")

    # 2. Đọc file corpus JSON
    with open(corpus_file, "r", encoding="utf-8") as f:
        doc_json = json.load(f)
    print("✔ File corpus JSON có cú pháp chuẩn xác (valid JSON syntax).")

    # 3. Validate qua Pydantic Model
    doc_model = LegalDocument.model_validate(doc_json)
    print(f"✔ Pydantic validation THÀNH CÔNG!")
    print(f"  - Document ID: {doc_model.document_id}")
    print(f"  - Title: {doc_model.title}")
    print(f"  - Cơ quan ban hành: {doc_model.issuing_authority}")
    print(f"  - Ngày hiệu lực: {doc_model.effective_date}")
    print(f"  - Số chương có trong cấu trúc: {len(doc_model.body.chapters)}")

    # 4. Validate file Chunks qua Pydantic Model
    with open(chunks_file, "r", encoding="utf-8") as f:
        chunks_json = json.load(f)
    chunks_model = LegalCorpusChunks.model_validate(chunks_json)
    print(f"✔ RAG-Ready Chunks validation THÀNH CÔNG!")
    print(f"  - Tổng số chunks tối ưu cho Vector DB: {chunks_model.total_chunks}")
    print(f"  - Chunk strategy: {chunks_model.chunk_strategy}")

    print("\n>>> TẤT CẢ KIỂM THỬ ĐÃ HOÀN TẤT THÀNH CÔNG! <<<")


if __name__ == "__main__":
    validate_legal_files()
