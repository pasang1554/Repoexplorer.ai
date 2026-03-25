import asyncio
import os
from langchain_core.documents import Document
from app.services.github_service import GitHubService
from app.rag.chunking import get_text_splitter
from app.rag.vector_store import get_collection_count, get_vector_store
from app.core.logging import logger

github_service = GitHubService()
INGEST_LOCKS: dict[str, asyncio.Lock] = {}

# Basic language extensions map
ALLOWED_EXTENSIONS = {
    ".py", ".js", ".ts", ".jsx", ".tsx", ".md", ".java", ".cpp", ".c", ".h", ".go", ".rs", ".html", ".css", ".json"
}

async def ingest_repository(repo_url: str) -> dict:
    repo_name = repo_url.rstrip('/').split('/')[-1]
    if repo_name.endswith('.git'):
        repo_name = repo_name[:-4]

    lock = INGEST_LOCKS.setdefault(repo_name, asyncio.Lock())
    async with lock:
        existing_chunks = get_collection_count(repo_name)
        if existing_chunks > 0:
            logger.info(f"Repository {repo_name} already indexed. Reusing {existing_chunks} chunks.")
            return {"status": "success", "repo_id": repo_name, "chunks": existing_chunks, "cached": True}

        local_path = github_service.clone_repo(repo_url)
    
        documents = []
    
        # Simple language-aware parsing: we read files into Documents
        for root, dirs, files in os.walk(local_path):
            # Exclude hidden and generated directories like .git
            dirs[:] = [d for d in dirs if not d.startswith('.') and d not in {"node_modules", "__pycache__"}]
        
            for file in files:
                if "lock" in file.lower() or file.startswith("."):
                    continue
                ext = os.path.splitext(file)[1]
                if ext in ALLOWED_EXTENSIONS:
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, "r", encoding="utf-8") as f:
                            content = f.read()
                    
                        rel_path = os.path.relpath(file_path, local_path)
                        docs = Document(
                            page_content=content,
                            metadata={"source": rel_path, "repo": repo_name, "extension": ext}
                        )
                        documents.append(docs)
                    except (OSError, UnicodeDecodeError) as e:
                        logger.warning(f"Failed to read file {file_path}: {e}")
                    
        logger.info(f"Loaded {len(documents)} files from {repo_name}")
    
        # Chunking
        splitter = get_text_splitter()
        chunks = splitter.split_documents(documents)
    
        logger.info(f"Created {len(chunks)} chunks for {repo_name}")
    
        # Store in ChromaDB
        vector_store = get_vector_store(repo_name)
        vector_store.add_documents(chunks)
        logger.info(f"Ingested {repo_name} into ChromaDB")
    
        return {"status": "success", "repo_id": repo_name, "chunks": len(chunks), "cached": False}
