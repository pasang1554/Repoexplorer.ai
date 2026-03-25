import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, GitFork, Workflow, Boxes, Route } from "lucide-react";
import { FlowCanvas } from "@/components/insights/FlowCanvas";
import { InsightLegend } from "@/components/insights/InsightLegend";
import { useRepo } from "@/contexts/RepoContext";
import { generateGraphs } from "@/lib/insightsGenerator";

const tabs = [
  { id: "architecture", label: "Architecture", icon: Network, description: "High-level system architecture and component hierarchy" },
  { id: "dependencies", label: "Dependencies", icon: GitFork, description: "File import relationships and module dependencies" },
  { id: "functions", label: "Function Calls", icon: Workflow, description: "Function invocation graph and call chains" },
  { id: "modules", label: "Modules", icon: Boxes, description: "Module groups and their inter-relationships" },
  { id: "codeflow", label: "Code Flow", icon: Route, description: "Execution flow from entry point through the application" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("architecture");
  const currentTab = tabs.find((t) => t.id === activeTab)!;
  
  const { fileTree, repoInfo } = useRepo();

  // Generate the node/edge data based off the loaded repo's file tree
  const tabData = useMemo(() => {
    if (!fileTree || fileTree.length === 0) return null;
    return generateGraphs(fileTree);
  }, [fileTree]);

  if (!repoInfo || !tabData) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-muted-foreground">Please load a repository from the Explore tab first to view insights.</p>
      </div>
    );
  }

  const { nodes, edges } = tabData[activeTab];

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* Tab Bar */}
      <div className="shrink-0 border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="container flex items-center gap-1 overflow-x-auto py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Header + Legend */}
      <div className="container shrink-0 space-y-3 py-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">{currentTab.label}</h2>
          <p className="text-xs text-muted-foreground">{currentTab.description}</p>
        </div>
        <InsightLegend />
      </div>

      {/* Canvas */}
      <div className="container flex-1 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <FlowCanvas initialNodes={nodes} initialEdges={edges} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
