export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sourceFiles?: string[];
  timestamp: Date;
}

export interface RepoInfo {
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  updatedAt: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
  defaultBranch?: string;
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "dir";
  children?: FileTreeNode[];
}

export const EXAMPLE_QUESTIONS = [
  "What is the main purpose of this repository?",
  "Explain the project structure and architecture",
  "What are the key dependencies used?",
  "How does authentication work in this project?",
  "Show me the main entry point of the application",
  "What design patterns are used in this codebase?",
];

export const MOCK_REPO_INFO: RepoInfo = {
  name: "react",
  fullName: "facebook/react",
  description: "The library for web and native user interfaces.",
  language: "JavaScript",
  stars: 224000,
  forks: 45800,
  updatedAt: "2026-03-09T12:00:00Z",
  owner: {
    login: "facebook",
    avatarUrl: "",
  },
};

export const MOCK_FILE_TREE: FileTreeNode[] = [
  {
    name: "src",
    path: "src",
    type: "dir",
    children: [
      {
        name: "components",
        path: "src/components",
        type: "dir",
        children: [
          { name: "App.tsx", path: "src/components/App.tsx", type: "file" },
          { name: "Header.tsx", path: "src/components/Header.tsx", type: "file" },
          { name: "Footer.tsx", path: "src/components/Footer.tsx", type: "file" },
        ],
      },
      {
        name: "hooks",
        path: "src/hooks",
        type: "dir",
        children: [
          { name: "useAuth.ts", path: "src/hooks/useAuth.ts", type: "file" },
          { name: "useQuery.ts", path: "src/hooks/useQuery.ts", type: "file" },
        ],
      },
      { name: "index.tsx", path: "src/index.tsx", type: "file" },
      { name: "main.ts", path: "src/main.ts", type: "file" },
    ],
  },
  {
    name: "public",
    path: "public",
    type: "dir",
    children: [
      { name: "index.html", path: "public/index.html", type: "file" },
      { name: "favicon.ico", path: "public/favicon.ico", type: "file" },
    ],
  },
  { name: "README.md", path: "README.md", type: "file" },
  { name: "package.json", path: "package.json", type: "file" },
  { name: "tsconfig.json", path: "tsconfig.json", type: "file" },
  { name: ".gitignore", path: ".gitignore", type: "file" },
  { name: "LICENSE", path: "LICENSE", type: "file" },
];
