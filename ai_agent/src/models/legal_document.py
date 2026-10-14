from datetime import date, datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class LegalDocumentType(str, Enum):
    HIEN_PHAP = "HIEN_PHAP"
    BO_LUAT = "BO_LUAT"
    LUAT = "LUAT"
    NGHI_QUYET = "NGHI_QUYET"
    PHAP_LENH = "PHAP_LENH"
    NGHI_DINH = "NGHI_DINH"
    QUYET_DINH = "QUYET_DINH"
    THONG_TU = "THONG_TU"
    THONG_TU_LIEN_TICH = "THONG_TU_LIEN_TICH"


class LegalStatus(str, Enum):
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
    points: List[Point] = Field(default_factory=list)


class Article(BaseModel):
    article_id: str
    article_number: int
    title: str
    full_text: str
    clauses: List[Clause] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    cross_references: List[str] = Field(default_factory=list)


class Section(BaseModel):
    section_id: str
    section_number: str
    title: str
    articles: List[Article] = Field(default_factory=list)


class Chapter(BaseModel):
    chapter_id: str
    chapter_number: str
    title: str
    sections: Optional[List[Section]] = None
    articles: List[Article] = Field(default_factory=list)


class Signer(BaseModel):
    name: str
    position: str


class SourceMetadata(BaseModel):
    url: str
    provider: str
    retrieved_at: datetime


class GazetteMetadata(BaseModel):
    gazette_number: Optional[str] = None
    gazette_date: Optional[date] = None


class Preamble(BaseModel):
    text: str
    legal_bases: List[str] = Field(default_factory=list)


class LegalDocumentBody(BaseModel):
    total_chapters: int
    total_articles: int
    chapters: List[Chapter]


class LegalDocument(BaseModel):
    """Mô hình dữ liệu chuẩn doanh nghiệp cho Văn bản Pháp luật Việt Nam."""
    schema_version: str = "1.0.0"
    document_id: str
    document_code: str
    document_type: LegalDocumentType
    title: str
    short_title: Optional[str] = None
    issuing_authority: str
    jurisdiction: str = "VN"
    signer: Signer
    promulgation_date: date
    effective_date: date
    expiration_date: Optional[date] = None
    status: LegalStatus = LegalStatus.ACTIVE
    legal_domain: List[str] = Field(default_factory=list)
    gazette: Optional[GazetteMetadata] = None
    checksum_sha256: Optional[str] = None
    source: SourceMetadata
    preamble: Optional[Preamble] = None
    body: LegalDocumentBody


class LegalChunkMetadata(BaseModel):
    document_type: str
    document_code: str
    chapter: str
    article: int
    status: str
    tags: List[str] = Field(default_factory=list)


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
    chunks: List[LegalChunk]
