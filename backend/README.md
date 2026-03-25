# RepoExplorer.ai Backend

Agentic RAG-powered GitHub repository explorer built with FastAPI, LangGraph, Groq, and ChromaDB.

## Setup

1. Install dependencies:

```powershell
cd backend
uv sync
```

2. Create `.env` from `.env.example` and add your Groq API key:

```env
GROQ_API_KEY=gsk_your_key_here
```

3. Run the backend:

```powershell
uv run uvicorn app.main:app --reload --port 8003
```

## Features

- Multi-repo support for public GitHub repositories
- Agentic RAG workflow using LangGraph
- Code-aware chunking for better retrieval
- Persistent local ChromaDB storage

## API Endpoints

- `POST /api/repo/ingest`
- `POST /api/ai/query`
- `GET /`
