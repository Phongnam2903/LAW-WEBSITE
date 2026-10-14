from typing import List
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000, description="Tin nhắn từ user")


class ChatResponse(BaseModel):
    response: str = Field(..., description="Phản hồi từ agent")
    analysis: str = Field(default="", description="Phân tích nội bộ")
    citations: List[str] = Field(default_factory=list, description="Danh sách căn cứ pháp lý viện dẫn")
    has_grounding: bool = Field(default=True, description="Đánh dấu câu trả lời có đủ căn cứ pháp lý hay bị từ chối")
