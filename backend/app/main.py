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
        logger.error("❌ GOOGLE_API_KEY is NOT set in environment variables!")
    else:
        # Log masked key for verification
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
    key_exists = bool(settings.GOOGLE_API_KEY and len(settings.GOOGLE_API_KEY) > 10)
    return {
        "status": "online",
        "google_api_key_configured": key_exists,
        "model": "gemini-1.5-flash"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8003, reload=True)
