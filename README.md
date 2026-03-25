# RepoExplorer.ai

RepoExplorer.ai is an agentic RAG-powered GitHub repository explorer. It lets you ingest a public repository, ask questions about the codebase, and get answers with relevant source references.

## Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: FastAPI, Python
- AI/RAG: LangGraph, LangChain, ChromaDB, Sentence Transformers, Groq

## Project Structure

```text
RepoExplorer.ai/
|-- frontend/
|-- backend/
`-- README.md
```

## Run Locally

### Backend

```powershell
cd backend
uv sync
$env:GROQ_API_KEY="your_groq_api_key"
uv run uvicorn app.main:app --reload --port 8003
```

### Frontend

```powershell
cd frontend
npm install
npm.cmd run dev
```

Open the app at `http://localhost:8080`.

## API Endpoints

- `POST /api/repo/ingest`
- `POST /api/ai/query`
- `GET /`
