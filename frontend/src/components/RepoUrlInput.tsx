import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface RepoUrlInputProps {
  onSubmit: (url: string) => void;
  compact?: boolean;
  disabled?: boolean;
}

export function RepoUrlInput({ onSubmit, compact, disabled = false }: RepoUrlInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && url.trim()) onSubmit(url.trim());
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={disabled}
            placeholder="github.com/owner/repo"
            className="h-9 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          disabled={disabled}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </form>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-xl"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={disabled}
          placeholder="Paste a GitHub repository URL..."
          className="h-14 w-full rounded-xl border border-border bg-card pl-12 pr-14 text-sm text-foreground shadow-lg placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 glow-primary"
        />
        <button
          type="submit"
          disabled={disabled}
          className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.form>
  );
}
