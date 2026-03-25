from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import repo, ai
from app.core.logging import logger

app = FastAPI(title="RepoExplorer.ai API")

# Configure CORS for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(repo.router, prefix="/api/repo", tags=["Repository"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])

@app.get("/")
async def root():
    return {"message": "Welcome to RepoExplorer.ai API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8003, reload=True)
