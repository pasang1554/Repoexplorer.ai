from fastapi import APIRouter
from app.schemas.requests import QueryRequest
from app.agents.graph import query_agent
from app.core.logging import logger

router = APIRouter()

@router.post("/query")
async def ask_question(request: QueryRequest):
    try:
        result = await query_agent(request.repo_id, request.question)
        return result
    except Exception as e:
        logger.exception(f"Query pipeline failed for repo_id={request.repo_id}: {e}")
        return {
            "answer": (
                "The AI service could not complete the request, so a full answer is not available right now. "
                "Please verify your Groq API key and try again."
            ),
            "sources": [],
        }
