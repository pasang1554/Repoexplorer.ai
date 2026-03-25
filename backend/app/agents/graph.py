from __future__ import annotations

from langchain_core.messages import HumanMessage

from app.core.logging import logger
from app.rag.vector_store import get_vector_store
from app.services.google_service import get_google_llm

MAX_DOCS = 3
MAX_CHARS_PER_DOC = 1200
MAX_CONTEXT_CHARS = 3600


def _format_context(repo_id: str, question: str) -> tuple[str, list[str]]:
    vector_store = get_vector_store(repo_id)
    retriever = vector_store.as_retriever(search_kwargs={"k": MAX_DOCS})
    docs = retriever.invoke(question)

    sources: list[str] = []
    context_parts: list[str] = []
    total_chars = 0

    for doc in docs:
        source = doc.metadata.get("source", "Unknown")
        if source not in sources:
            sources.append(source)

        remaining_chars = MAX_CONTEXT_CHARS - total_chars
        if remaining_chars <= 0:
            break

        snippet = doc.page_content[: min(MAX_CHARS_PER_DOC, remaining_chars)]
        context_part = f"File: {source}\nContent:\n{snippet}"
        context_parts.append(context_part)
        total_chars += len(context_part)

    return "\n\n".join(context_parts), sources


def _build_fallback_answer(question: str, context: str, sources: list[str]) -> str:
    short_context = context[:1600].strip()
    source_list = ", ".join(sources[:3]) if sources else "the indexed repository files"
    return (
        "Google Gemini is unavailable right now, so here is a local fallback summary.\n\n"
        f"Question: {question}\n\n"
        f"Relevant sources: {source_list}\n\n"
        "Retrieved code context:\n"
        f"{short_context}"
    )


async def query_agent(repo_id: str, question: str) -> dict:
    context, sources = _format_context(repo_id, question)

    if not context:
        return {
            "answer": "I could not find relevant code in the indexed repository for that question.",
            "sources": [],
        }

    try:
        llm = get_google_llm()
        prompt = (
            "You are helping explain a code repository.\n"
            "Answer the user's question using only the repository context below.\n"
            "If the answer is uncertain, say so briefly.\n\n"
            f"Question:\n{question}\n\n"
            f"Repository context:\n{context}"
        )

        response = await llm.ainvoke([HumanMessage(content=prompt)])
        answer = response.content if isinstance(response.content, str) else str(response.content)
    except Exception as exc:
        logger.warning(f"Google Gemini query failed, using local fallback answer: {exc}")
        answer = _build_fallback_answer(question, context, sources)

    return {
        "answer": answer,
        "sources": sources,
    }
