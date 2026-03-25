const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:8003/api";

export async function ingestRepo(repoUrl: string) {
    const response = await fetch(`${API_BASE_URL}/repo/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: repoUrl }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to ingest repository");
    }
    return response.json();
}

export async function queryRepo(repoId: string, question: string) {
    const response = await fetch(`${API_BASE_URL}/ai/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_id: repoId, question }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to get answer from AI");
    }
    return response.json();
}
