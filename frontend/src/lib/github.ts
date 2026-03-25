import { RepoInfo, FileTreeNode } from "./types";

/**
 * Parses a GitHub URL to extract the owner and repo name.
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== "github.com") return null;
    
    const parts = urlObj.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1].replace(".git", "") };
    }
    return null;
  } catch (e) {
    // Fallback for "owner/repo" format
    const parts = url.split("/").filter(Boolean);
    if (parts.length === 2 && !url.includes("://")) {
      return { owner: parts[0], repo: parts[1].replace(".git", "") };
    }
    return null;
  }
}

/**
 * Fetches repository metadata from the GitHub API.
 */
export async function getRepoInfo(owner: string, repo: string): Promise<RepoInfo> {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch repo info: ${response.statusText}`);
  }
  const data = await response.json();
  
  return {
    name: data.name,
    fullName: data.full_name,
    description: data.description || "",
    language: data.language || "Unknown",
    stars: data.stargazers_count,
    forks: data.forks_count,
    updatedAt: data.updated_at,
    owner: {
      login: data.owner.login,
      avatarUrl: data.owner.avatar_url,
    },
    defaultBranch: data.default_branch,
  };
}

/**
 * Helper to build a nested tree from flat GitHub tree array
 */
function buildFileTree(flatTree: any[]): FileTreeNode[] {
  const root: FileTreeNode[] = [];
  const map: Record<string, FileTreeNode> = {};

  // First pass: create all nodes
  for (const item of flatTree) {
    const node: FileTreeNode = {
      name: item.path.split("/").pop() || item.path,
      path: item.path,
      type: item.type === "tree" ? "dir" : "file",
    };
    if (node.type === "dir") {
      node.children = [];
    }
    map[item.path] = node;
  }

  // Second pass: link children to parents
  for (const item of flatTree) {
    const node = map[item.path];
    const parts = item.path.split("/");
    if (parts.length === 1) {
      root.push(node);
    } else {
      parts.pop(); // remove current name
      const parentPath = parts.join("/");
      const parentNode = map[parentPath];
      if (parentNode && parentNode.children) {
        parentNode.children.push(node);
      } else {
        // If parent is missing for some reason, just push to root
        root.push(node);
      }
    }
  }

  // Sort nodes: directories first, then alphabetical
  const sortTree = (nodes: FileTreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "dir" ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    for (const node of nodes) {
      if (node.children) {
        sortTree(node.children);
      }
    }
  };

  sortTree(root);
  return root;
}

/**
 * Fetches the entire repository file tree.
 */
export async function getRepoTree(owner: string, repo: string, branch: string = "HEAD"): Promise<FileTreeNode[]> {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
  if (!response.ok) {
    throw new Error(`Failed to fetch repo tree: ${response.statusText}`);
  }
  const data = await response.json();
  return buildFileTree(data.tree);
}
