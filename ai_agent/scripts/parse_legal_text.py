"""Parse văn bản thuần (data/raw/hf/{slug}.txt) thành cấu trúc Điều/Khoản/Điểm theo LegalDocument.

Đầu ra:
  data/processed/legal_corpus/{domain}/hf_{slug}.json     toàn văn có cấu trúc (Silver)
  data/embeddings/{domain}/hf_{slug}_chunks.json          chunk cho RAG (Gold), 1 chunk / Điều

Cách dùng:
  python scripts/parse_legal_text.py                          # parse mọi văn bản trong data/raw/hf
  python scripts/parse_legal_text.py 59-2020-qh14 --domain corporate
  python scripts/parse_legal_text.py 41-2024-qh15 --status-override ACTIVE

Cuối mỗi văn bản in báo cáo kiểm tra: số Điều tìm được, số Điều lớn nhất, các số bị thiếu.
Nếu có số bị thiếu thì parse chưa đủ, cần xem lại file .txt trước khi đưa vào RAG.
"""

import argparse
import json
import re
import sys
from datetime import date, datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from src.models.legal_document import LegalChunk, LegalCorpusChunks, LegalDocument  # noqa: E402

RAW_DIR = ROOT / "data" / "raw" / "hf"
MAX_CHUNK_CHARS = 2000

DOC_TYPE = {
    "Hiến pháp": "HIEN_PHAP", "Bộ luật": "BO_LUAT", "Luật": "LUAT", "Nghị quyết": "NGHI_QUYET",
    "Pháp lệnh": "PHAP_LENH", "Nghị định": "NGHI_DINH", "Quyết định": "QUYET_DINH",
    "Thông tư": "THONG_TU", "Thông tư liên tịch": "THONG_TU_LIEN_TICH",
}
STATUS = {
    "Còn hiệu lực": "ACTIVE", "Hết hiệu lực một phần": "PARTIALLY_AMENDED",
    "Hết hiệu lực toàn bộ": "EXPIRED", "Ngưng hiệu lực": "SUSPENDED",
}
DOMAIN_BY_NUMBER = {
    "59/2020/QH14": "corporate", "47/2021/NĐ-CP": "corporate",
    "45/2019/QH14": "labor", "145/2020/NĐ-CP": "labor", "12/2022/NĐ-CP": "labor",
    "91/2015/QH13": "civil", "31/2024/QH15": "land", "102/2024/NĐ-CP": "land",
    "52/2014/QH13": "marriage",
}

RE_PART = re.compile(r"^Phần\s+(thứ\s+\w+|[IVXLC]+)\b", re.IGNORECASE)
RE_CHAPTER = re.compile(r"^Chương\s+([IVXLC]+|\d+)\b\s*[.:]?\s*(.*)$")
RE_SECTION = re.compile(r"^Mục\s+(\d+|[IVXLC]+)\b\s*[.:]?\s*(.*)$")
RE_ARTICLE = re.compile(r"^Điều\s+(\d+)([a-z]?)\s*[.:]\s*(.*)$")
RE_CLAUSE = re.compile(r"^(\d+)\.\s+(.*)$")
RE_POINT = re.compile(r"^([a-zđ])\)\s+(.*)$")
RE_TRAILER = re.compile(r"^(Nơi nhận\b|(Bộ luật|Luật|Pháp lệnh) này (đã )?được Quốc hội|TM\.|T/M|KT\.|"
                        r"CHỦ TỊCH QUỐC HỘI|XÁC THỰC VĂN BẢN HỢP NHẤT)")
RE_XREF = re.compile(r"Điều\s+\d+[a-z]?")


def slug_to_snake(slug: str) -> str:
    return slug.replace("-", "_")


def to_iso(d: str | None) -> date | None:
    if not d:
        return None
    return datetime.strptime(d.strip(), "%d/%m/%Y").date()


def display_name(meta: dict) -> str:
    title = re.sub(rf"\s+số\s+{re.escape(meta['so_ky_hieu'])}", "", meta["title"] or "", flags=re.IGNORECASE).strip()
    loai = meta["loai_van_ban"]
    return title if title.lower().startswith(loai.lower()) else f"{loai} {title}".strip()


def parse_body(lines: list[str]) -> tuple[list[str], list[dict], dict]:
    """Trả về (preamble, chapters, thống kê). Mỗi chapter: {number,title,sections,articles}."""
    first = next((i for i, ln in enumerate(lines)
                  if RE_CHAPTER.match(ln) or RE_ARTICLE.match(ln)), len(lines))
    preamble = lines[:first]

    chapters: list[dict] = []
    chapter = section = article = None
    last_no = 0
    skipped_headings: list[str] = []
    pending_title: dict | None = None  # đầu mục Chương/Mục có tiêu đề nằm ở dòng kế tiếp

    def new_chapter(num: str, title: str) -> dict:
        ch = {"number": num, "title": title, "sections": [], "articles": []}
        chapters.append(ch)
        return ch

    for ln in lines[first:]:
        if article is not None and RE_TRAILER.match(ln):
            break
        if pending_title is not None:
            if not (RE_ARTICLE.match(ln) or RE_SECTION.match(ln) or RE_CHAPTER.match(ln)):
                pending_title["title"] = ln
                pending_title = None
                continue
            pending_title = None
        if RE_PART.match(ln):
            continue
        m = RE_CHAPTER.match(ln)
        if m:
            chapter, section, article = new_chapter(m.group(1), m.group(2).strip()), None, None
            pending_title = None if chapter["title"] else chapter
            continue
        m = RE_SECTION.match(ln)
        if m and chapter is not None:
            section = {"number": m.group(1), "title": m.group(2).strip(), "articles": []}
            chapter["sections"].append(section)
            article = None
            pending_title = None if section["title"] else section
            continue
        m = RE_ARTICLE.match(ln)
        if m:
            no = int(m.group(1))
            if no <= last_no and not m.group(2):  # tiêu đề giả (trích dẫn, phụ lục): coi là nội dung
                skipped_headings.append(ln[:60])
                if article is not None:
                    article["lines"].append(ln)
                continue
            last_no = max(last_no, no)
            if chapter is None:
                chapter = new_chapter("0", "Quy định chung (văn bản không chia chương)")
            article = {"number": no, "suffix": m.group(2), "title": m.group(3).strip(), "lines": []}
            (section["articles"] if section is not None else chapter["articles"]).append(article)
            continue
        if article is not None:
            article["lines"].append(ln)
    return preamble, chapters, {"skipped_headings": skipped_headings}


def build_clauses(code: str, art_id: str, lines: list[str]) -> list[dict]:
    clauses: list[dict] = []
    for ln in lines:
        m = RE_CLAUSE.match(ln)
        if m:
            clauses.append({"clause_id": f"{art_id}:CL_{m.group(1)}", "clause_number": int(m.group(1)),
                            "text": m.group(2), "points": []})
            continue
        if not clauses:
            continue
        p = RE_POINT.match(ln)
        cl = clauses[-1]
        if p:
            cl["points"].append({"point_id": f"{cl['clause_id']}:PT_{p.group(1)}",
                                 "point_letter": p.group(1), "text": p.group(2)})
        elif cl["points"]:
            cl["points"][-1]["text"] += "\n" + ln
        else:
            cl["text"] += "\n" + ln
    return clauses


def authority_slug(name: str) -> str:
    import unicodedata
    s = unicodedata.normalize("NFD", name.replace("Đ", "D").replace("đ", "d"))
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def convert(slug: str, domain: str | None, status_override: str | None) -> None:
    meta = json.loads((RAW_DIR / f"{slug}.meta.json").read_text(encoding="utf-8"))
    lines = (RAW_DIR / f"{slug}.txt").read_text(encoding="utf-8").splitlines()
    number = meta["so_ky_hieu"]
    domain = domain or DOMAIN_BY_NUMBER.get(number, "other")
    dtype = DOC_TYPE[meta["loai_van_ban"]]
    status = status_override or STATUS.get(meta["tinh_trang_hieu_luc"])
    if status is None:
        raise SystemExit(f"{number}: tình trạng '{meta['tinh_trang_hieu_luc']}' chưa ánh xạ, dùng --status-override")
    promulgated = to_iso(meta["ngay_ban_hanh"])
    effective = to_iso(meta["ngay_co_hieu_luc"]) or promulgated
    name = display_name(meta)
    doc_urn = (f"urn:lex:vn:{authority_slug(meta['co_quan_ban_hanh'] or 'khong-ro')}:"
               f"{authority_slug(meta['loai_van_ban'])}:{promulgated.year}:{slug}")

    preamble_lines, parsed, info = parse_body(lines)
    if not any(ch["articles"] or ch["sections"] for ch in parsed):
        print(f"✗ {number}: không tìm thấy Điều nào (file .txt {len(lines)} dòng), bỏ qua, không ghi file")
        return
    chapters_out, chunks = [], []
    n_articles = 0
    numbers_found: list[int] = []

    def article_out(a: dict, chapter_label: str, crumbs: str) -> dict:
        nonlocal n_articles
        n_articles += 1
        numbers_found.append(a["number"])
        art_id = f"VN:{dtype}:{number}:ART_{a['number']}{a['suffix']}"
        body = "\n".join(a["lines"])
        full_text = body if body else a["title"]
        head = f"Điều {a['number']}{a['suffix']}. {a['title']}"
        header = f"{name} ({number}) > {crumbs}Điều {a['number']}{a['suffix']}: {a['title']}"
        parts = split_text(full_text)
        for k, part in enumerate(parts, 1):
            suffix = f"_P{k}" if len(parts) > 1 else ""
            label = f" (phần {k}/{len(parts)})" if len(parts) > 1 else ""
            chunks.append(LegalChunk(
                chunk_id=f"VN:{dtype}:{number}:CHUNK_ART_{a['number']}{a['suffix']}{suffix}",
                article_id=art_id, article_number=a["number"], title=a["title"], breadcrumbs=header,
                content=f"[{header.replace(' > ', ' - ')}]{label}\n{part}",
                metadata={"document_type": dtype, "document_code": number, "chapter": chapter_label,
                          "article": a["number"], "status": status, "tags": []}))
        return {"article_id": art_id, "article_number": a["number"], "title": a["title"],
                "full_text": full_text, "clauses": build_clauses(number, art_id, a["lines"]),
                "tags": [], "cross_references": sorted(set(RE_XREF.findall(body)) - {head.split('.')[0]})}

    for ch in parsed:
        ch_id = f"VN:{dtype}:{number}:CH_{ch['number']}"
        ch_crumb = f"Chương {ch['number']}: {ch['title']} > "
        secs = []
        for s in ch["sections"]:
            s_crumb = f"{ch_crumb}Mục {s['number']}: {s['title']} > "
            secs.append({"section_id": f"{ch_id}:SEC_{s['number']}", "section_number": s["number"],
                         "title": s["title"],
                         "articles": [article_out(a, ch["number"], s_crumb) for a in s["articles"]]})
        chapters_out.append({"chapter_id": ch_id, "chapter_number": ch["number"], "title": ch["title"],
                             "sections": secs or None,
                             "articles": [article_out(a, ch["number"], ch_crumb) for a in ch["articles"]]})

    bases = [ln.rstrip(";.") for ln in preamble_lines if ln.startswith("Căn cứ")]
    doc = LegalDocument.model_validate({
        "document_id": doc_urn, "document_code": number, "document_type": dtype, "title": name,
        "short_title": None, "issuing_authority": meta["co_quan_ban_hanh"] or "Không xác định",
        "signer": {"name": meta.get("nguoi_ky") or "Không xác định", "position": meta.get("chuc_danh") or "Không xác định"},
        "promulgation_date": promulgated, "effective_date": effective,
        "expiration_date": to_iso(meta["ngay_het_hieu_luc"]), "status": status,
        "legal_domain": [], "checksum_sha256": meta["checksum_sha256"],
        "source": {"url": f"https://huggingface.co/datasets/{meta['source']['provider'].split(' ')[0]}",
                   "provider": meta["source"]["provider"], "retrieved_at": meta["source"]["retrieved_at"]},
        "preamble": {"text": "\n".join(preamble_lines), "legal_bases": bases},
        "body": {"total_chapters": len(chapters_out), "total_articles": n_articles, "chapters": chapters_out},
    })
    corpus = LegalCorpusChunks(document_id=doc_urn, chunk_strategy="HIERARCHICAL_ARTICLE_LEVEL_V1",
                               total_chunks=len(chunks), generated_at=datetime.now(timezone.utc), chunks=chunks)

    out_doc = ROOT / "data" / "processed" / "legal_corpus" / domain / f"hf_{slug}.json"
    out_chunks = ROOT / "data" / "embeddings" / domain / f"hf_{slug}_chunks.json"
    for path, model in ((out_doc, doc), (out_chunks, corpus)):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(model.model_dump_json(indent=2), encoding="utf-8")

    top = max(numbers_found, default=0)
    missing = sorted(set(range(1, top + 1)) - set(numbers_found))
    flag = "✓" if not missing and n_articles else "⚠"
    print(f"{flag} {number} [{domain}] {n_articles} Điều (lớn nhất {top}), {len(chapters_out)} chương, "
          f"{len(chunks)} chunk, status={status}")
    if missing:
        print(f"   thiếu số Điều: {missing[:20]}{' …' if len(missing) > 20 else ''}")
    if info["skipped_headings"]:
        print(f"   {len(info['skipped_headings'])} dòng 'Điều N.' bị coi là nội dung (số không tăng), ví dụ: "
              f"{info['skipped_headings'][:2]}")


def split_text(text: str) -> list[str]:
    """Điều dài thì tách theo ranh giới Khoản để mỗi chunk ≤ MAX_CHUNK_CHARS."""
    if len(text) <= MAX_CHUNK_CHARS:
        return [text]
    parts, cur = [], ""
    for ln in text.splitlines():
        if cur and len(cur) + len(ln) + 1 > MAX_CHUNK_CHARS and RE_CLAUSE.match(ln):
            parts.append(cur)
            cur = ""
        cur = f"{cur}\n{ln}" if cur else ln
    parts.append(cur)
    return parts


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slugs", nargs="*", help="slug văn bản, mặc định: tất cả trong data/raw/hf")
    ap.add_argument("--domain", help="thư mục lĩnh vực (corporate, labor, civil, land, marriage, ...)")
    ap.add_argument("--status-override", choices=sorted(set(STATUS.values())),
                    help="ghi đè tình trạng hiệu lực (khi cột của dataset sai)")
    args = ap.parse_args()
    slugs = args.slugs or sorted(p.name.removesuffix(".meta.json") for p in RAW_DIR.glob("*.meta.json"))
    for slug in slugs:
        convert(slug, args.domain, args.status_override)


if __name__ == "__main__":
    main()
