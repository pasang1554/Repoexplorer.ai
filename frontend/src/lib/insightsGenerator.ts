import type { Node, Edge } from "@xyflow/react";
import { MarkerType } from "@xyflow/react";
import { FileTreeNode } from "./types";

const edgeDefaults = {
  animated: true,
  style: { stroke: "hsl(174, 72%, 50%)", strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(174, 72%, 50%)" },
};

export function generateGraphs(tree: FileTreeNode[]): Record<string, { nodes: Node[]; edges: Edge[] }> {
  // We build a single generalized graph to use for Architecture & Modules.
  // We represent directories as node-clusters and files as leaf nodes.
  
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  let yOffset = 0;
  
  const traverse = (nodesList: FileTreeNode[], parentId: string | null = null, depth: number = 0) => {
    // Only go 2 levels deep to prevent massive graphs that lag out React Flow
    if (depth > 2) return;
    
    for (const item of nodesList) {
      const id = item.path;
      nodes.push({
        id,
        type: "custom",
        // Spread them out based on depth (x) and traversal order (y)
        position: { x: depth * 280 + 50, y: yOffset * 100 },
        data: {
          label: item.name,
          description: item.type === "dir" ? "Directory" : "File",
          icon: item.type === "dir" ? "folder" : "file",
          category: item.type === "dir" ? "module" : "component"
        }
      });
      
      if (parentId) {
        edges.push({
          id: `e-${parentId}-to-${id}`,
          source: parentId,
          target: id,
          ...edgeDefaults
        });
      }
      
      yOffset++;
      
      if (item.children) {
        traverse(item.children, id, depth + 1);
      }
    }
  };
  
  traverse(tree);

  return {
    architecture: { nodes, edges },
    dependencies: { nodes, edges }, // Using same tree structure for all as fallback
    functions: { nodes, edges },
    modules: { nodes, edges },
    codeflow: { nodes, edges },
  };
}
