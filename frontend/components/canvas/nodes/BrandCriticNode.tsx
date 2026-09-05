"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { ShieldCheck, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

export interface EvaluationVectorData {
  novelty_score: number;
  clarity_score: number;
  hook_velocity_score: number;
  brand_alignment_score: number;
  composite_index: number;
  pass_audit: boolean;
  critique_notes: string;
  retries_count?: number;
  [key: string]: unknown;
}

export const BrandCriticNode = memo(({ data }: NodeProps) => {
  const evalData = data as unknown as EvaluationVectorData;
  const score = evalData.composite_index ?? 91.8;
  const isPassing = score >= 80.0 && evalData.pass_audit !== false;

  return (
    <div
      className={`w-[290px] rounded-lg bg-studio-card border shadow-xl font-sans text-xs overflow-hidden select-none ${
        isPassing
          ? "border-emerald-500/80 shadow-emerald-950/30"
          : "border-rose-500/80 shadow-rose-950/30"
      }`}
    >
      {/* Inbound Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className={`w-3 h-3 border-2 border-slate-900 ${
          isPassing ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />

      {/* Header */}
      <div className="flex items-center justify-between p-3 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-1.5 font-bold uppercase tracking-wider text-[10px]">
          <ShieldCheck
            className={`w-3.5 h-3.5 ${
              isPassing ? "text-emerald-400" : "text-rose-400"
            }`}
          />
          <span className="text-slate-300">Tier 3: Brand Critic</span>
        </div>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border flex items-center space-x-1 ${
            isPassing
              ? "bg-emerald-950 text-emerald-300 border-emerald-800/60"
              : "bg-rose-950 text-rose-300 border-rose-800/60"
          }`}
        >
          {isPassing ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          ) : (
            <AlertCircle className="w-3 h-3 text-rose-400" />
          )}
          <span>{score.toFixed(1)} / 100</span>
        </span>
      </div>

      {/* Metric breakdown grid */}
      <div className="p-3 space-y-2">
        <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
          <div className="p-1.5 rounded bg-slate-950 border border-slate-800/80">
            <span className="text-slate-500 block text-[9px]">Hook Velocity</span>
            <strong className="text-slate-200">{evalData.hook_velocity_score ?? 94}</strong>
          </div>
          <div className="p-1.5 rounded bg-slate-950 border border-slate-800/80">
            <span className="text-slate-500 block text-[9px]">Novelty Index</span>
            <strong className="text-slate-200">{evalData.novelty_score ?? 88}</strong>
          </div>
          <div className="p-1.5 rounded bg-slate-950 border border-slate-800/80">
            <span className="text-slate-500 block text-[9px]">Clarity Score</span>
            <strong className="text-slate-200">{evalData.clarity_score ?? 93}</strong>
          </div>
          <div className="p-1.5 rounded bg-slate-950 border border-slate-800/80">
            <span className="text-slate-500 block text-[9px]">Alignment</span>
            <strong className="text-slate-200">{evalData.brand_alignment_score ?? 92}</strong>
          </div>
        </div>

        {/* Critique Notes */}
        <p className="text-[10px] text-slate-300 italic line-clamp-2 leading-relaxed pt-1">
          "{evalData.critique_notes || "Passed evaluation. Strong tension established in first 0.8 seconds."}"
        </p>

        {/* Retries Indicator */}
        {evalData.retries_count !== undefined && evalData.retries_count > 0 && (
          <div className="flex items-center space-x-1 text-[9px] font-mono text-amber-400 pt-1 border-t border-slate-800">
            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            <span>Self-Correction Loop: Retry #{evalData.retries_count}</span>
          </div>
        )}
      </div>

      {/* Outbound Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-3 h-3 border-2 border-slate-900 ${
          isPassing ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />
    </div>
  );
});

BrandCriticNode.displayName = "BrandCriticNode";
