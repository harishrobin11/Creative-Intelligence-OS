"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Brain, UserCheck, Zap } from "lucide-react";

export interface StrategistNodeData {
  persona_name: string;
  demographic: string;
  primary_anxiety: string;
  value_props: string[];
  status?: "idle" | "running" | "done";
  [key: string]: unknown;
}

export const StrategistNode = memo(({ data }: NodeProps) => {
  const nodeData = data as unknown as StrategistNodeData;
  const isDone = nodeData.status === "done";

  return (
    <div className="w-[290px] rounded-lg bg-studio-card border border-indigo-500/80 shadow-xl shadow-indigo-950/40 p-3 font-sans text-xs overflow-hidden select-none">
      {/* Inbound Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-indigo-500 border-2 border-slate-900"
      />

      {/* Node Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
        <div className="flex items-center space-x-1.5 text-indigo-400 font-bold uppercase tracking-wider text-[10px]">
          <Brain className="w-3.5 h-3.5" />
          <span>Tier 1: Strategist Agent</span>
        </div>
        <span
          className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
            isDone
              ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
              : "bg-indigo-950 text-indigo-300 border border-indigo-800/50"
          }`}
        >
          {nodeData.status || "done"}
        </span>
      </div>

      {/* Target Persona Card */}
      <div className="p-2 rounded bg-slate-950 border border-slate-800/80 mb-2 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 flex items-center space-x-1">
            <UserCheck className="w-3 h-3 text-indigo-400" />
            <span>{nodeData.persona_name || "Collegiate Runner"}</span>
          </span>
          <span className="text-[9px] font-mono text-slate-400">
            {nodeData.demographic || "18-24"}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 italic">
          Anxiety: "{nodeData.primary_anxiety || "Inaccurate metrics leading to overtraining"}"
        </p>
      </div>

      {/* Value Props Tags */}
      {nodeData.value_props && nodeData.value_props.length > 0 && (
        <div className="space-y-1">
          <div className="text-[9px] font-mono uppercase text-slate-400 flex items-center space-x-1">
            <Zap className="w-2.5 h-2.5 text-amber-400" />
            <span>Core Pillars</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {nodeData.value_props.map((prop, idx) => (
              <span
                key={idx}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 truncate max-w-full"
              >
                {prop}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Outbound Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-indigo-500 border-2 border-slate-900"
      />
    </div>
  );
});

StrategistNode.displayName = "StrategistNode";
