"use client";

import React, { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  BackgroundVariant,
} from "@xyflow/react";

// Placeholder initial demonstration graph nodes for Phase 1 base UI system
const initialNodes: Node[] = [
  {
    id: "node_brief_01",
    type: "default",
    position: { x: 250, y: 40 },
    data: { label: "📄 Brief Node: AuraPulse Watch" },
    style: {
      background: "#111827",
      color: "#f8fafc",
      border: "1px solid #6366f1",
      borderRadius: "8px",
      fontSize: "12px",
      fontFamily: "JetBrains Mono, monospace",
      width: 220,
    },
  },
  {
    id: "node_strategist_01",
    type: "default",
    position: { x: 250, y: 150 },
    data: { label: "🧠 Strategist Agent (ICP Extraction)" },
    style: {
      background: "#111827",
      color: "#f8fafc",
      border: "1px solid #6366f1",
      borderRadius: "8px",
      fontSize: "12px",
      fontFamily: "JetBrains Mono, monospace",
      width: 260,
    },
  },
  {
    id: "node_hook_branch_a",
    type: "default",
    position: { x: 50, y: 280 },
    data: { label: "⚡ Variant A: Pain Agitation" },
    style: {
      background: "#111827",
      color: "#f8fafc",
      border: "1px solid #1e293b",
      borderRadius: "8px",
      fontSize: "11px",
      fontFamily: "JetBrains Mono, monospace",
      width: 190,
    },
  },
  {
    id: "node_hook_branch_b",
    type: "default",
    position: { x: 280, y: 280 },
    data: { label: "⚡ Variant B: Value Inversion" },
    style: {
      background: "#111827",
      color: "#f8fafc",
      border: "1px solid #10b981",
      borderRadius: "8px",
      fontSize: "11px",
      fontFamily: "JetBrains Mono, monospace",
      width: 190,
    },
  },
  {
    id: "node_hook_branch_c",
    type: "default",
    position: { x: 510, y: 280 },
    data: { label: "⚡ Variant C: Social Proof" },
    style: {
      background: "#111827",
      color: "#f8fafc",
      border: "1px solid #1e293b",
      borderRadius: "8px",
      fontSize: "11px",
      fontFamily: "JetBrains Mono, monospace",
      width: 190,
    },
  },
  {
    id: "node_critic_02",
    type: "default",
    position: { x: 280, y: 400 },
    data: { label: "🔍 Brand Critic: Score 91.8 (Pass)" },
    style: {
      background: "#064e3b",
      color: "#6ee7b7",
      border: "1px solid #10b981",
      borderRadius: "8px",
      fontSize: "11px",
      fontFamily: "JetBrains Mono, monospace",
      width: 220,
    },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "node_brief_01", target: "node_strategist_01", animated: true, style: { stroke: "#6366f1" } },
  { id: "e2-3a", source: "node_strategist_01", target: "node_hook_branch_a", animated: true, style: { stroke: "#6366f1" } },
  { id: "e2-3b", source: "node_strategist_01", target: "node_hook_branch_b", animated: true, style: { stroke: "#10b981" } },
  { id: "e2-3c", source: "node_strategist_01", target: "node_hook_branch_c", animated: true, style: { stroke: "#6366f1" } },
  { id: "e3b-4", source: "node_hook_branch_b", target: "node_critic_02", animated: true, style: { stroke: "#10b981" } },
];

export function DAGCanvas() {
  const defaultViewport = useMemo(() => ({ x: 80, y: 40, zoom: 1.0 }), []);

  return (
    <main className="flex-1 h-full relative bg-studio-bg overflow-hidden">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        defaultViewport={defaultViewport}
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#334155" />
        <Controls className="m-4" />
        <MiniMap
          nodeColor={(node) => {
            if (node.id === "node_critic_02") return "#10b981";
            if (node.id.includes("branch")) return "#6366f1";
            return "#1e293b";
          }}
          maskColor="rgba(9, 13, 22, 0.7)"
          className="m-4"
        />
      </ReactFlow>

      {/* Canvas Floating Overlay Pill */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-studio-card/90 border border-studio-border backdrop-blur-md flex items-center space-x-2 text-xs font-mono text-slate-300">
        <span className="w-2 h-2 rounded-full bg-indigo-500" />
        <span>Canvas Phase 1 Scaffold (@xyflow/react)</span>
      </div>
    </main>
  );
}
