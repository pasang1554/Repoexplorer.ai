from __future__ import annotations

from typing import Iterable, List

from langchain_core.documents import Document


class SimpleTextSplitter:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def split_documents(self, documents: Iterable[Document]) -> List[Document]:
        chunks: List[Document] = []

        for document in documents:
            text = document.page_content
            start = 0

            while start < len(text):
                end = min(start + self.chunk_size, len(text))
                chunk_text = text[start:end]
                metadata = dict(document.metadata)
                metadata["chunk_start"] = start
                metadata["chunk_end"] = end
                chunks.append(Document(page_content=chunk_text, metadata=metadata))

                if end >= len(text):
                    break

                start = max(end - self.chunk_overlap, start + 1)

        return chunks


def get_text_splitter() -> SimpleTextSplitter:
    return SimpleTextSplitter(chunk_size=1000, chunk_overlap=200)
