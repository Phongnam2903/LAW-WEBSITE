from fastapi import APIRouter, HTTPException

from src.agents.graph import agent
from src.models.schemas import ChatRequest, ChatResponse

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """Chat với Legal AI agent."""
    try:
        result = await agent.ainvoke({"query": request.message})
        metadata = result.get("metadata", {}) or {}
        return ChatResponse(
            response=result.get("response", ""),
            analysis=result.get("analysis", ""),
            citations=metadata.get("citations", []),
            has_grounding=metadata.get("has_grounding", True),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status")
async def agent_status():
    """Kiểm tra trạng thái agent và mô hình suy luận đang hoạt động."""
    from src.config import get_settings

    settings = get_settings()
    active_provider = "gemini" if (settings.llm_provider == "gemini" and settings.gemini_api_key) else "ollama"
    return {
        "status": "ready",
        "agent": "Legal RAG Agent v1.0",
        "provider": active_provider,
        "llm_model": settings.gemini_model if active_provider == "gemini" else settings.ollama_model,
        "embed_model": settings.ollama_embed_model,
        "gemini_configured": bool(settings.gemini_api_key),
    }
