import dagre from "dagre";
import { Node, Edge } from "@xyflow/react";

const nodeWidth = 280;
const nodeHeight = 160;

/**
 * Calculates top-to-bottom hierarchical node positions using Dagre layout algorithm.
 */
export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "TB"
): { nodes: Node[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 50,
    ranksep: 70,
  });

  nodes.forEach((node) => {
    // Use node specific dimensions if provided, else default
    const width = (node.style?.width as number) || nodeWidth;
    const height = (node.style?.height as number) || nodeHeight;
    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const width = (node.style?.width as number) || nodeWidth;
    const height = (node.style?.height as number) || nodeHeight;

    return {
      ...node,
      targetPosition: direction === "TB" ? "top" : "left",
      sourcePosition: direction === "TB" ? "bottom" : "right",
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
    } as Node;
  });

  return { nodes: layoutedNodes, edges };
}
