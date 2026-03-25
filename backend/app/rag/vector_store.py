import os
import chromadb
from langchain_chroma import Chroma
from app.rag.embeddings import SentenceTransformersEmbeddings
from app.core.config import settings

# Wait to create until needed, or use a persistent client
os.makedirs(settings.CHROMA_DB_DIR, exist_ok=True)
chroma_client = chromadb.PersistentClient(path=settings.CHROMA_DB_DIR)

# Single instance of embedding function
embedding_function = SentenceTransformersEmbeddings()

def get_vector_store(collection_name: str) -> Chroma:
    """Returns a LangChain Chroma vector store for a specific collection (repo)."""
    # Chroma collection names must be valid (no special chars like /, etc.)
    safe_name = "".join([c if c.isalnum() else "_" for c in collection_name])
    return Chroma(
        client=chroma_client,
        collection_name=safe_name,
        embedding_function=embedding_function
    )


def get_collection_count(collection_name: str) -> int:
    safe_name = "".join([c if c.isalnum() else "_" for c in collection_name])
    collection = chroma_client.get_or_create_collection(name=safe_name)
    return collection.count()
