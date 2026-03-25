import { motion } from "framer-motion";
import { FolderTree, Search } from "lucide-react";
import { useState } from "react";
import { FileTree } from "@/components/FileTree";
import { RepoOverview } from "@/components/RepoOverview";
import { useRepo } from "@/contexts/RepoContext";

export default function StructurePage() {
  const [search, setSearch] = useState("");
  const { repoInfo, fileTree } = useRepo();

  const countNodes = (nodes: any[]): { files: number; dirs: number } => {
    let files = 0;
    let dirs = 0;
    for (const n of nodes) {
      if (n.type === "dir") {
        dirs++;
        if (n.children) {
          const childCount = countNodes(n.children);
          files += childCount.files;
          dirs += childCount.dirs;
        }
      } else {
        files++;
      }
    }
    return { files, dirs };
  };

  const { files, dirs } = fileTree ? countNodes(fileTree) : { files: 0, dirs: 0 };

  if (!repoInfo) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-muted-foreground">Please load a repository from the Explore tab first.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <FolderTree className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Repository Structure</h1>
            <p className="text-xs text-muted-foreground">
              {repoInfo.fullName} — browse the project tree
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card"
        >
          {/* Search */}
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files..."
                className="h-8 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Tree */}
          <div className="p-3">
            <FileTree tree={fileTree || []} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <RepoOverview repo={repoInfo} />

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 text-xs font-semibold text-foreground">Quick Stats</h3>
            <div className="space-y-2">
              {[
                { label: "Total Files", value: files.toString() },
                { label: "Directories", value: dirs.toString() },
                { label: "Lines of Code", value: "~" },
                { label: "Contributors", value: "~" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-mono font-medium text-foreground">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
