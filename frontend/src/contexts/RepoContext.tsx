import React, { createContext, useContext, useState, ReactNode } from "react";
import { RepoInfo, FileTreeNode } from "@/lib/types";
import { getRepoInfo, getRepoTree, parseGitHubUrl } from "@/lib/github";
import { ingestRepo } from "@/lib/api";

interface RepoContextType {
  repoUrl: string | null;
  repoId: string | null;
  repoInfo: RepoInfo | null;
  fileTree: FileTreeNode[] | null;
  isLoading: boolean;
  error: string | null;
  loadRepo: (url: string) => Promise<string | null>;
}

const RepoContext = createContext<RepoContextType | undefined>(undefined);

export function RepoProvider({ children }: { children: ReactNode }) {
  const [repoUrl, setRepoUrl] = useState<string | null>(null);
  const [repoId, setRepoId] = useState<string | null>(null);
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const [fileTree, setFileTree] = useState<FileTreeNode[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRepo = async (url: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const parsed = parseGitHubUrl(url);
      if (!parsed || url.includes("?")) {
        throw new Error("Invalid Repository URL. Please use the format: https://github.com/owner/repository");
      }

      // We do these two network calls in parallel when possible, but repo tree 
      // depends on knowing the default branch, so we get info first.
      
      const [ingestResult, info] = await Promise.all([
        ingestRepo(url),
        getRepoInfo(parsed.owner, parsed.repo),
      ]);
      
      const newRepoId = ingestResult.repo_id;
      
      // Fetch Tree using the default branch from info API
      const tree = await getRepoTree(parsed.owner, parsed.repo, info.defaultBranch || "HEAD").catch(() => null);

      setRepoUrl(url);
      setRepoId(newRepoId);
      setRepoInfo(info);
      setFileTree(tree || []);

      return newRepoId as string;
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load repository");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RepoContext.Provider value={{ repoUrl, repoId, repoInfo, fileTree, isLoading, error, loadRepo }}>
      {children}
    </RepoContext.Provider>
  );
}

export function useRepo() {
  const context = useContext(RepoContext);
  if (context === undefined) {
    throw new Error("useRepo must be used within a RepoProvider");
  }
  return context;
}
