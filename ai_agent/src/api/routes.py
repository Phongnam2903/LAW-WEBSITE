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
    """Kiểm tra trạng thái agent."""
    return {
        "status": "ready",
        "agent": "Legal RAG Agent v1.0",
        "embed_model": "nomic-embed-text:latest",
        "llm_model": "llama3.1:latest",
    }
