"""Lấy văn bản pháp luật nguyên văn từ HF dataset th1nhng0/vietnamese-legal-documents.

Ghi vào tầng Bronze `data/raw/hf/`, mỗi văn bản gồm 3 file:
  {slug}.html       HTML gốc (không sửa gì, dùng để đối chiếu / tính checksum)
  {slug}.txt        văn bản thuần, mỗi đoạn một dòng (đầu vào cho bước parse Điều/Khoản/Điểm)
  {slug}.meta.json  metadata + provenance + quan hệ sửa đổi/thay thế/hướng dẫn

Cách dùng:
  python scripts/fetch_hf_documents.py --list-only                    # chỉ tra metadata, không tải nội dung
  python scripts/fetch_hf_documents.py                                # lấy danh sách mặc định
  python scripts/fetch_hf_documents.py --numbers 59/2020/QH14 "47/2021/NĐ-CP"

Chỉ tải metadata (~15 MB), quan hệ (~10 MB) và những khối nội dung chứa văn bản cần lấy.
Đặt biến môi trường HF_TOKEN để tránh bị giới hạn tốc độ khi tải ẩn danh.
"""

import argparse
import hashlib
import json
import re
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd
import pyarrow.parquet as pq
from huggingface_hub import HfFileSystem, hf_hub_download
from lxml import html as lhtml

REPO = "th1nhng0/vietnamese-legal-documents"
OUT_DIR = Path(__file__).resolve().parents[1] / "data" / "raw" / "hf"

DEFAULT_NUMBERS = [
    "59/2020/QH14",  # Luật Doanh nghiệp
    "47/2021/NĐ-CP",  # hướng dẫn Luật Doanh nghiệp
    "45/2019/QH14",  # Bộ luật Lao động
    "145/2020/NĐ-CP",  # hướng dẫn Bộ luật Lao động
    "12/2022/NĐ-CP",  # xử phạt vi phạm hành chính về lao động
    "91/2015/QH13",  # Bộ luật Dân sự
    "31/2024/QH15",  # Luật Đất đai
    "102/2024/NĐ-CP",  # hướng dẫn Luật Đất đai
    "52/2014/QH13",  # Luật Hôn nhân và gia đình
]

# "Căn cứ"/"Dẫn chiếu" chiếm ~70% bảng quan hệ (hàng trăm văn bản địa phương viện dẫn một luật),
# không liên quan đến hiệu lực nên bỏ khỏi meta.json.
IGNORED_RELATIONSHIPS = {"Căn cứ", "Dẫn chiếu", "Văn bản căn cứ", "Văn bản dẫn chiếu"}

BLOCK_TAGS = {"p", "div", "br", "tr", "li", "ul", "ol", "table", "blockquote",
              "h1", "h2", "h3", "h4", "h5", "h6"}
ARTICLE_HEADING = re.compile(r"^Điều\s+(\d+)[a-zA-Z]?\s*[.:]", re.MULTILINE)


def slugify(number: str) -> str:
    s = unicodedata.normalize("NFD", number.replace("Đ", "D").replace("đ", "d"))
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def html_to_text(raw_html: str) -> str:
    """Xuống dòng theo thẻ block, nối liền thẻ inline (span/b/i/a) để không vỡ từ giữa chừng."""
    raw_html = re.sub(r"^\s*<\?xml[^>]*\?>", "", raw_html)
    doc = lhtml.fromstring(raw_html)
    for el in doc.xpath("//script|//style"):
        el.drop_tree()
    for el in doc.iter():
        if not isinstance(el.tag, str):
            continue
        if el.tag in BLOCK_TAGS:
            el.tail = "\n" + (el.tail or "")
            if el.tag != "br":
                el.text = "\n" + (el.text or "")
        elif el.tag in ("td", "th"):
            el.tail = " " + (el.tail or "")
    text = doc.text_content().replace("\xa0", " ").replace("​", "")
    lines = (re.sub(r"[ \t]+", " ", ln).strip() for ln in text.splitlines())
    return "\n".join(ln for ln in lines if ln)


def pick_documents(meta: pd.DataFrame, numbers: list[str]) -> dict[str, list[pd.Series]]:
    """Với mỗi số hiệu trả về các ứng viên, đã loại bản dịch tiếng Anh."""
    found: dict[str, list[pd.Series]] = {}
    for number in numbers:
        rows = meta[meta["so_ky_hieu"] == number]
        rows = rows[(rows["loai_van_ban"] != "Bản dịch văn bản") & ~rows["id"].str.startswith("vbpqta_")]
        found[number] = [r for _, r in rows.iterrows()]
    return found


def read_contents(wanted: set[str]) -> dict[str, str]:
    """Đọc content_html của các id cần lấy trực tiếp từ HF bằng HTTP range request.

    Không tải cả file 785 MB: mỗi row group chỉ đọc cột `id` (nhỏ) trước, rồi chỉ kéo
    `content_html` của những row group thực sự chứa id cần lấy.
    """
    out: dict[str, str] = {}
    with HfFileSystem().open(f"datasets/{REPO}/data/content.parquet", "rb") as f:
        pf = pq.ParquetFile(f)
        for i in range(pf.metadata.num_row_groups):
            ids = set(pf.read_row_group(i, columns=["id"]).column("id").to_pylist())
            hit = ids & wanted
            print(f"  row group {i + 1}/{pf.metadata.num_row_groups}: {len(hit)} văn bản cần lấy", flush=True)
            if not hit:
                continue
            tbl = pf.read_row_group(i, columns=["id", "content_html"])
            for doc_id, html in zip(tbl.column("id").to_pylist(), tbl.column("content_html").to_pylist()):
                if doc_id in wanted and html:
                    out[doc_id] = html
            if wanted <= out.keys():
                break
    return out


def relationships_of(doc_id: str, rel: pd.DataFrame, meta_by_id: pd.DataFrame) -> list[dict]:
    sub = rel[((rel["doc_id"] == doc_id) | (rel["other_doc_id"] == doc_id))
              & ~rel["relationship"].isin(IGNORED_RELATIONSHIPS)]
    result = []
    for _, r in sub.iterrows():
        is_source = r["doc_id"] == doc_id
        other_id = r["other_doc_id"] if is_source else r["doc_id"]
        other = meta_by_id.loc[other_id] if other_id in meta_by_id.index else None
        result.append({
            "relationship": r["relationship"],
            "this_is_doc_id": is_source,  # giữ nguyên chiều lưu trong dataset, chưa suy diễn
            "other_id": other_id,
            "other_so_ky_hieu": None if other is None else other["so_ky_hieu"],
            "other_title": None if other is None else other["title"],
            "other_status": None if other is None else other["tinh_trang_hieu_luc"],
        })
    return result


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--numbers", nargs="+", default=DEFAULT_NUMBERS, help="Số hiệu văn bản, ví dụ 59/2020/QH14")
    ap.add_argument("--list-only", action="store_true", help="Chỉ tra metadata, không tải nội dung")
    ap.add_argument("--out", type=Path, default=OUT_DIR)
    args = ap.parse_args()

    meta = pd.read_parquet(hf_hub_download(REPO, "data/metadata.parquet", repo_type="dataset"))
    candidates = pick_documents(meta, args.numbers)

    for number, rows in candidates.items():
        print(f"\n## {number}: {len(rows)} ứng viên")
        for r in rows:
            print(f"   id={r['id']} | {r['loai_van_ban']} | {(r['title'] or '')[:60]} | "
                  f"{r['tinh_trang_hieu_luc']} | hiệu lực {r['ngay_co_hieu_luc']}")
    if args.list_only:
        return

    wanted = {r["id"] for rows in candidates.values() for r in rows}
    contents = read_contents(wanted)
    rel = pd.read_parquet(hf_hub_download(REPO, "data/relationships.parquet", repo_type="dataset"))
    meta_by_id = meta.set_index("id")

    args.out.mkdir(parents=True, exist_ok=True)
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    print("\n── Kết quả ──")
    for number, rows in candidates.items():
        rows = [r for r in rows if r["id"] in contents]
        if not rows:
            print(f"✗ {number}: không có trong dataset")
            continue
        # Cùng số hiệu có thể bị trùng (bản crawl lặp, Nghị quyết trùng số...): lấy bản dài nhất.
        best = max(rows, key=lambda r: len(contents[r["id"]]))
        raw = contents[best["id"]]
        text = html_to_text(raw)
        articles = [int(n) for n in ARTICLE_HEADING.findall(text)]
        slug = slugify(number)
        (args.out / f"{slug}.html").write_text(raw, encoding="utf-8")
        (args.out / f"{slug}.txt").write_text(text, encoding="utf-8")
        record = {
            "so_ky_hieu": number,
            "dataset_id": best["id"],
            "title": best["title"],
            "loai_van_ban": best["loai_van_ban"],
            "co_quan_ban_hanh": best["co_quan_ban_hanh"],
            "ngay_ban_hanh": best["ngay_ban_hanh"],
            "ngay_co_hieu_luc": best["ngay_co_hieu_luc"],
            "ngay_het_hieu_luc": best["ngay_het_hieu_luc"],
            "tinh_trang_hieu_luc": best["tinh_trang_hieu_luc"],
            "nguon_thu_thap": best["nguon_thu_thap"],
            "source": {"provider": f"{REPO} (crawl từ vbpl.vn)", "retrieved_at": now},
            "checksum_sha256": hashlib.sha256(raw.encode("utf-8")).hexdigest(),
            "text_chars": len(text),
            "article_headings_found": len(articles),
            "max_article_number": max(articles, default=0),
            "other_candidates": [r["id"] for r in rows if r["id"] != best["id"]],
            "relationships": relationships_of(best["id"], rel, meta_by_id),
        }
        (args.out / f"{slug}.meta.json").write_text(
            json.dumps(record, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"✓ {number} → {slug}  |  {record['tinh_trang_hieu_luc']}  |  {len(text):,} ký tự  |  "
              f"{len(articles)} đầu mục Điều (số lớn nhất {record['max_article_number']})  |  "
              f"{len(record['relationships'])} quan hệ")


if __name__ == "__main__":
    main()
