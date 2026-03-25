from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import repo, ai
from app.core.logging import logger

app = FastAPI(title="RepoExplorer.ai API")

# Configure CORS for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    from app.core.config import settings
    if not settings.GOOGLE_API_KEY:
        logger.error("❌ GOOGLE_API_KEY is NOT set!")
    else:
        masked = settings.GOOGLE_API_KEY[:4] + "..." + settings.GOOGLE_API_KEY[-4:]
        logger.info(f"✅ GOOGLE_API_KEY is set: {masked}")

# Include Routers
app.include_router(repo.router, prefix="/api/repo", tags=["Repository"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])

@app.get("/")
async def root():
    return {"message": "Welcome to RepoExplorer.ai API"}

@app.get("/api/health")
async def health_check():
    from app.core.config import settings
    from app.services.google_service import get_google_llm
    from langchain_core.messages import HumanMessage
    
    key_exists = bool(settings.GOOGLE_API_KEY and len(settings.GOOGLE_API_KEY) > 10)
    ai_status = "untested"
    ai_error = None
    
    if key_exists:
        try:
            llm = get_google_llm()
            # Try a tiny query to test
            resp = await llm.ainvoke([HumanMessage(content="hi")])
            ai_status = "success"
        except Exception as e:
            ai_status = "failed"
            ai_error = str(e)
            
    return {
        "status": "online",
        "google_api_key_configured": key_exists,
        "ai_status": ai_status,
        "ai_error": ai_error,
        "model": "models/gemini-1.5-flash"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8003, reload=True)
