from datetime import date, datetime
from enum import StrEnum

from pydantic import BaseModel, Field


class LegalDocumentType(StrEnum):
    HIEN_PHAP = "HIEN_PHAP"
    BO_LUAT = "BO_LUAT"
    LUAT = "LUAT"
    NGHI_QUYET = "NGHI_QUYET"
    PHAP_LENH = "PHAP_LENH"
    NGHI_DINH = "NGHI_DINH"
    QUYET_DINH = "QUYET_DINH"
    THONG_TU = "THONG_TU"
    THONG_TU_LIEN_TICH = "THONG_TU_LIEN_TICH"


class LegalStatus(StrEnum):
    ACTIVE = "ACTIVE"
    EXPIRED = "EXPIRED"
    PARTIALLY_AMENDED = "PARTIALLY_AMENDED"
    REPLACED = "REPLACED"
    SUSPENDED = "SUSPENDED"


class Point(BaseModel):
    point_id: str
    point_letter: str
    text: str


class Clause(BaseModel):
    clause_id: str
    clause_number: int
    text: str
    points: list[Point] = Field(default_factory=list)


class Article(BaseModel):
    article_id: str
    article_number: int
    title: str
    full_text: str
    clauses: list[Clause] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    cross_references: list[str] = Field(default_factory=list)


class Section(BaseModel):
    section_id: str
    section_number: str
    title: str
    articles: list[Article] = Field(default_factory=list)


class Chapter(BaseModel):
    chapter_id: str
    chapter_number: str
    title: str
    sections: list[Section] | None = None
    articles: list[Article] = Field(default_factory=list)


class Signer(BaseModel):
    name: str
    position: str


class SourceMetadata(BaseModel):
    url: str
    provider: str
    retrieved_at: datetime


class GazetteMetadata(BaseModel):
    gazette_number: str | None = None
    gazette_date: date | None = None


class Preamble(BaseModel):
    text: str
    legal_bases: list[str] = Field(default_factory=list)


class LegalDocumentBody(BaseModel):
    total_chapters: int
    total_articles: int
    chapters: list[Chapter]


class LegalDocument(BaseModel):
    """Mô hình dữ liệu chuẩn doanh nghiệp cho Văn bản Pháp luật Việt Nam."""
    schema_version: str = "1.0.0"
    document_id: str
    document_code: str
    document_type: LegalDocumentType
    title: str
    short_title: str | None = None
    issuing_authority: str
    jurisdiction: str = "VN"
    signer: Signer
    promulgation_date: date
    effective_date: date
    expiration_date: date | None = None
    status: LegalStatus = LegalStatus.ACTIVE
    legal_domain: list[str] = Field(default_factory=list)
    gazette: GazetteMetadata | None = None
    checksum_sha256: str | None = None
    source: SourceMetadata
    preamble: Preamble | None = None
    body: LegalDocumentBody


class LegalChunkMetadata(BaseModel):
    document_type: str
    document_code: str
    chapter: str
    article: int
    status: str
    tags: list[str] = Field(default_factory=list)


class LegalChunk(BaseModel):
    chunk_id: str
    article_id: str
    article_number: int
    title: str
    breadcrumbs: str
    content: str
    metadata: LegalChunkMetadata


class LegalCorpusChunks(BaseModel):
    corpus_version: str = "1.0.0"
    document_id: str
    chunk_strategy: str
    total_chunks: int
    generated_at: datetime
    chunks: list[LegalChunk]
