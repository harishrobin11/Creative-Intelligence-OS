"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { FileText, Globe, Tag } from "lucide-react";

export interface BriefNodeData {
  product_name: string;
  product_url?: string;
  target_platform: string;
  brief_excerpt: string;
  forbidden_terms: string[];
  [key: string]: unknown;
}

export const BriefNode = memo(({ data }: NodeProps) => {
  const nodeData = data as unknown as BriefNodeData;

  return (
    <div className="w-[280px] rounded-lg bg-studio-card border border-indigo-500/60 shadow-xl shadow-indigo-950/40 p-3 font-sans text-xs overflow-hidden select-none">
      {/* Node Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
        <div className="flex items-center space-x-1.5 text-indigo-400 font-bold uppercase tracking-wider text-[10px]">
          <FileText className="w-3.5 h-3.5" />
          <span>Tier 0: Brief Node</span>
        </div>
        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
          {nodeData.target_platform || "reels"}
        </span>
      </div>

      {/* Product Title */}
      <h3 className="text-xs font-bold text-slate-100 mb-1 truncate">
        {nodeData.product_name || "AuraPulse Fitness Watch"}
      </h3>

      {/* URL pill */}
      {nodeData.product_url && (
        <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono mb-2 truncate">
          <Globe className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="truncate">{nodeData.product_url}</span>
        </div>
      )}

      {/* Excerpt */}
      <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 italic mb-2">
        "{nodeData.brief_excerpt || "Affordable smartwatch for collegiate athletes..."}"
      </p>

      {/* Forbidden terms footer */}
      {nodeData.forbidden_terms && nodeData.forbidden_terms.length > 0 && (
        <div className="flex items-center space-x-1 text-[9px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/80">
          <Tag className="w-2.5 h-2.5 text-rose-400 shrink-0" />
          <span className="truncate">
            Forbidden: {nodeData.forbidden_terms.join(", ")}
          </span>
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

BriefNode.displayName = "BriefNode";
