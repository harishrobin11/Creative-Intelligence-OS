"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import { nodeTypes } from "./nodes";
import { getLayoutedElements } from "@/lib/dagreLayout";
import { BrandBriefPayloadClient } from "@/lib/api";
import { InspectModal } from "./InspectModal";
import { LayoutGrid, Code } from "lucide-react";

interface DAGCanvasProps {
  compiledBriefPayload?: BrandBriefPayloadClient | null;
  onSelectVariant?: (variantId: string) => void;
  onOpenStoryboardModal?: (variantId: string) => void;
}

const defaultInitialNodes: Node[] = [
  {
    id: "node_brief_01",
    type: "briefNode",
    position: { x: 0, y: 0 },
    data: {
      product_name: "AuraPulse Fitness Watch",
      product_url: "https://aurapulse.com",
      target_platform: "instagram_reels",
      brief_excerpt:
        "Affordable recovery smartwatch designed specifically for collegiate athletes focusing on sleep & HRV.",
      forbidden_terms: ["cheap", "unreliable"],
    },
    style: { width: 280, height: 160 },
  },
  {
    id: "node_strategist_01",
    type: "strategistNode",
    position: { x: 0, y: 0 },
    data: {
      persona_name: "Collegiate Runner",
      demographic: "18-24",
      primary_anxiety: "Inaccurate recovery metrics leading to overtraining",
      value_props: [
        "Medical-grade optical tracking at student pricing",
        "7-day battery life with zero subscription paywalls",
      ],
      status: "done",
    },
    style: { width: 290, height: 170 },
  },
  {
    id: "node_hook_branch_a",
    type: "angleBranchNode",
    position: { x: 0, y: 0 },
    data: {
      variant_id: "VAR-A-PAIN-001",
      archetype: "pain_agitation",
      headline_hook:
        "Why your current fitness watch is lying about your REM recovery.",
      narrative_thesis: "Expose hidden subscription paywalls in high-end watches.",
      beats_count: 4,
      score: 84.6,
    },
    style: { width: 270, height: 140 },
  },
  {
    id: "node_hook_branch_b",
    type: "angleBranchNode",
    position: { x: 0, y: 0 },
    data: {
      variant_id: "VAR-B-VALUE-INVERT-002",
      archetype: "value_inversion",
      headline_hook:
        "You don't need a $400 watch to run a sub-20 minute 5K.",
      narrative_thesis: "Subvert luxury status symbols in collegiate athletics.",
      beats_count: 4,
      score: 91.8,
    },
    style: { width: 270, height: 140 },
  },
  {
    id: "node_hook_branch_c",
    type: "angleBranchNode",
    position: { x: 0, y: 0 },
    data: {
      variant_id: "VAR-C-SOCIAL-003",
      archetype: "social_proof",
      headline_hook:
        "We gave 50 college athletes this smart band for finals week.",
      narrative_thesis: "Relatable peer validation & stress recovery testing.",
      beats_count: 4,
      score: 78.2,
    },
    style: { width: 270, height: 140 },
  },
  {
    id: "node_critic_02",
    type: "brandCriticNode",
    position: { x: 0, y: 0 },
    data: {
      novelty_score: 88.0,
      clarity_score: 93.0,
      hook_velocity_score: 94.0,
      brand_alignment_score: 92.0,
      composite_index: 91.8,
      pass_audit: true,
      critique_notes:
        "Passed evaluation seamlessly. Strong tension established at 0.8s.",
    },
    style: { width: 290, height: 180 },
  },
];

const defaultInitialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "node_brief_01",
    target: "node_strategist_01",
    animated: true,
    style: { stroke: "#6366f1", strokeWidth: 2 },
  },
  {
    id: "e2-3a",
    source: "node_strategist_01",
    target: "node_hook_branch_a",
    animated: true,
    style: { stroke: "#6366f1", strokeWidth: 1.5 },
  },
  {
    id: "e2-3b",
    source: "node_strategist_01",
    target: "node_hook_branch_b",
    animated: true,
    style: { stroke: "#10b981", strokeWidth: 2 },
  },
  {
    id: "e2-3c",
    source: "node_strategist_01",
    target: "node_hook_branch_c",
    animated: true,
    style: { stroke: "#6366f1", strokeWidth: 1.5 },
  },
  {
    id: "e3b-4",
    source: "node_hook_branch_b",
    target: "node_critic_02",
    animated: true,
    style: { stroke: "#10b981", strokeWidth: 2 },
  },
];

export function DAGCanvas({
  compiledBriefPayload,
  onSelectVariant,
  onOpenStoryboardModal,
}: DAGCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedInspectNode, setSelectedInspectNode] = useState<Node | null>(null);

  // Calculate Dagre auto layout
  const onLayout = useCallback(
    (nodeList: Node[], edgeList: Edge[]) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodeList,
        edgeList,
        "TB"
      );
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    },
    [setNodes, setEdges]
  );

  useEffect(() => {
    const rawNodes = compiledBriefPayload
      ? [
          {
            id: "node_brief_01",
            type: "briefNode",
            position: { x: 0, y: 0 },
            data: {
              product_name: compiledBriefPayload.product_name,
              product_url: compiledBriefPayload.product_url,
              target_platform: compiledBriefPayload.target_platform,
              brief_excerpt: compiledBriefPayload.raw_brief_text,
              forbidden_terms: compiledBriefPayload.forbidden_terms,
            },
            style: { width: 280, height: 160 },
          },
          {
            id: "node_strategist_01",
            type: "strategistNode",
            position: { x: 0, y: 0 },
            data: {
              persona_name: "Synthesized ICP Persona",
              demographic: "Target Demographic",
              primary_anxiety: "Latent customer anxiety extracted from brief",
              value_props: [
                "Primary Value Proposition",
                "Secondary Differentiator",
              ],
              status: "done",
            },
            style: { width: 290, height: 170 },
          },
          {
            id: "node_hook_branch_a",
            type: "angleBranchNode",
            position: { x: 0, y: 0 },
            data: {
              variant_id: "VAR-A-PAIN-001",
              archetype: "pain_agitation",
              headline_hook: `Why ${compiledBriefPayload.product_name} changes the status quo.`,
              narrative_thesis: "Problem agitation strategy branch.",
              beats_count: 4,
              score: 86.0,
              onSelectVariant,
              onOpenStoryboardModal,
            },
            style: { width: 270, height: 140 },
          },
          {
            id: "node_hook_branch_b",
            type: "angleBranchNode",
            position: { x: 0, y: 0 },
            data: {
              variant_id: "VAR-B-VALUE-INVERT-002",
              archetype: "value_inversion",
              headline_hook: `Stop overpaying for alternatives. Choose ${compiledBriefPayload.product_name}.`,
              narrative_thesis: "Value inversion strategy branch.",
              beats_count: 4,
              score: 92.5,
              onSelectVariant,
              onOpenStoryboardModal,
            },
            style: { width: 270, height: 140 },
          },
          {
            id: "node_hook_branch_c",
            type: "angleBranchNode",
            position: { x: 0, y: 0 },
            data: {
              variant_id: "VAR-C-SOCIAL-003",
              archetype: "social_proof",
              headline_hook: `See how users react to ${compiledBriefPayload.product_name}.`,
              narrative_thesis: "Social proof strategy branch.",
              beats_count: 4,
              score: 79.0,
              onSelectVariant,
              onOpenStoryboardModal,
            },
            style: { width: 270, height: 140 },
          },
          {
            id: "node_critic_02",
            type: "brandCriticNode",
            position: { x: 0, y: 0 },
            data: {
              novelty_score: 90.0,
              clarity_score: 94.0,
              hook_velocity_score: 95.0,
              brand_alignment_score: 92.0,
              composite_index: 92.5,
              pass_audit: true,
              critique_notes:
                "Passed brand evaluation. Compliant with forbidden terms.",
            },
            style: { width: 290, height: 180 },
          },
        ]
      : defaultInitialNodes.map((n) =>
          n.type === "angleBranchNode"
            ? {
                ...n,
                data: {
                  ...n.data,
                  onSelectVariant,
                  onOpenStoryboardModal,
                },
              }
            : n
        );

    onLayout(rawNodes, defaultInitialEdges);
  }, [compiledBriefPayload, onLayout, onSelectVariant, onOpenStoryboardModal]);

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedInspectNode(node);
    if (node.type === "angleBranchNode" && node.data?.variant_id && onSelectVariant) {
      onSelectVariant(node.data.variant_id as string);
    }
  };

  return (
    <main className="flex-1 h-full relative bg-studio-bg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#334155"
        />
        <Controls className="m-4" />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === "brandCriticNode") return "#10b981";
            if (node.type === "angleBranchNode") return "#6366f1";
            if (node.type === "briefNode") return "#818cf8";
            return "#1e293b";
          }}
          maskColor="rgba(9, 13, 22, 0.75)"
          className="m-4"
        />
      </ReactFlow>

      {/* Top Toolbar Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
        <div className="px-3 py-1.5 rounded-lg bg-studio-card/90 border border-studio-border backdrop-blur-md flex items-center space-x-2 text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>DAG Engine: Click any node to Inspect Prompt/Payload (SP-17)</span>
        </div>

        <button
          onClick={() => onLayout(nodes, edges)}
          className="px-2.5 py-1.5 rounded-lg bg-studio-card/90 border border-studio-border hover:bg-slate-800 backdrop-blur-md text-xs font-mono text-slate-300 flex items-center space-x-1.5 transition-colors shadow-lg"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
          <span>Auto Layout</span>
        </button>
      </div>

      {/* Inspect Modal */}
      {selectedInspectNode && (
        <InspectModal
          node={selectedInspectNode}
          onClose={() => setSelectedInspectNode(null)}
        />
      )}
    </main>
  );
}
