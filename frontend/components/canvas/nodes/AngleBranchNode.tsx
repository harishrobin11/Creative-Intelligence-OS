"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Zap, Film, CheckCircle2 } from "lucide-react";

export interface AngleBranchNodeData {
  variant_id: string;
  archetype: "pain_agitation" | "value_inversion" | "social_proof";
  headline_hook: string;
  narrative_thesis: string;
  beats_count?: number;
  score?: number;
  onSelectVariant?: (variantId: string) => void;
  [key: string]: unknown;
}

const archetypeLabels = {
  pain_agitation: { label: "Pain Agitation", color: "bg-rose-950/80 border-rose-800/60 text-rose-300" },
  value_inversion: { label: "Value Inversion", color: "bg-indigo-950/80 border-indigo-800/60 text-indigo-300" },
  social_proof: { label: "Social Proof", color: "bg-purple-950/80 border-purple-800/60 text-purple-300" },
};

export const AngleBranchNode = memo(({ data }: NodeProps) => {
  const nodeData = data as unknown as AngleBranchNodeData;
  const config = archetypeLabels[nodeData.archetype] || archetypeLabels.value_inversion;

  const handleClickStoryboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nodeData.onSelectVariant) {
      nodeData.onSelectVariant(nodeData.variant_id);
    }
  };

  return (
    <div className="w-[270px] rounded-lg bg-studio-card border border-slate-700 hover:border-indigo-500 shadow-xl shadow-slate-950/50 p-3 font-sans text-xs overflow-hidden select-none transition-colors">
      {/* Inbound Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-indigo-500 border-2 border-slate-900"
      />

      {/* Node Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
        <div className="flex items-center space-x-1.5 text-slate-300 font-bold font-mono text-[10px]">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span>{nodeData.variant_id || "VAR-001"}</span>
        </div>
        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Headline Hook */}
      <div className="mb-2">
        <p className="text-xs font-semibold text-slate-100 italic leading-snug line-clamp-2">
          "{nodeData.headline_hook || "Headline hook text..."}"
        </p>
      </div>

      {/* Narrative Thesis & Interactive Storyboard Button */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/80">
        <button
          type="button"
          onClick={handleClickStoryboard}
          className="px-2 py-0.5 rounded bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/60 text-indigo-300 flex items-center space-x-1 transition-colors cursor-pointer"
          title="Click to view storyboard in Experiment Lab"
        >
          <Film className="w-3 h-3 text-indigo-400" />
          <span>Storyboard ({nodeData.beats_count || 4} Beats)</span>
        </button>

        {nodeData.score && (
          <span className="flex items-center space-x-1 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>{nodeData.score}</span>
          </span>
        )}
      </div>

      {/* Outbound Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-indigo-500 border-2 border-slate-900"
      />
    </div>
  );
});

AngleBranchNode.displayName = "AngleBranchNode";
