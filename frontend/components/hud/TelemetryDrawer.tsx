"use client";

import React, { useState } from "react";
import { Cpu, Clock, DollarSign, ChevronUp, ChevronDown, Activity, Terminal } from "lucide-react";

interface TelemetryDrawerProps {
  totalDurationMs?: number;
  totalTokens?: number;
  totalCostUsd?: number;
}

const mockTelemetryNodes = [
  { id: "node_brief_01", name: "Brief Ingestion", latencyMs: 240, tokens: 180, provider: "FastAPI Native", cost: 0.0 },
  { id: "node_strategist_01", name: "Strategist Agent", latencyMs: 1420, tokens: 620, provider: "gpt-4o-mini", cost: 0.0012 },
  { id: "node_hook_branch_a", name: "Hook Branch A (Pain)", latencyMs: 1100, tokens: 380, provider: "claude-3-5-sonnet", cost: 0.0009 },
  { id: "node_hook_branch_b", name: "Hook Branch B (Inversion)", latencyMs: 980, tokens: 410, provider: "gpt-4o-mini", cost: 0.0008 },
  { id: "node_hook_branch_c", name: "Hook Branch C (Proof)", latencyMs: 1050, tokens: 390, provider: "gemini-1.5-pro", cost: 0.0007 },
  { id: "node_critic_02", name: "Brand Critic Reflection", latencyMs: 820, tokens: 280, provider: "gpt-4o-mini", cost: 0.0005 },
];

export function TelemetryDrawer({
  totalDurationMs = 4120,
  totalTokens = 2260,
  totalCostUsd = 0.0041,
}: TelemetryDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-studio-border bg-studio-card/95 backdrop-blur-md z-30 transition-all">
      {/* Drawer Toggle Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-8 px-4 flex items-center justify-between hover:bg-slate-900/60 transition-colors text-xs font-mono select-none"
      >
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5 font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Execution Telemetry HUD (SP-16)</span>
          </span>
          <span className="text-slate-500">|</span>
          <span className="flex items-center space-x-1 text-slate-300 text-[11px]">
            <Clock className="w-3 h-3 text-indigo-400" />
            <span>{totalDurationMs} ms</span>
          </span>
          <span className="flex items-center space-x-1 text-slate-300 text-[11px]">
            <Cpu className="w-3 h-3 text-emerald-400" />
            <span>{totalTokens} Tokens</span>
          </span>
          <span className="flex items-center space-x-1 text-slate-300 text-[11px]">
            <DollarSign className="w-3 h-3 text-amber-400" />
            <span>${totalCostUsd.toFixed(5)} USD</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 text-slate-400">
          <span className="text-[10px] text-slate-500">
            {isOpen ? "Collapse Timeline" : "Expand Telemetry Drawer"}
          </span>
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Telemetry Drawer Content */}
      {isOpen && (
        <div className="p-4 border-t border-slate-800 bg-slate-950 font-mono text-xs max-h-48 overflow-y-auto space-y-3">
          <div className="grid grid-cols-4 gap-2 text-[10px] uppercase text-slate-500 font-bold pb-1 border-b border-slate-800">
            <span>Node ID & Name</span>
            <span>Execution Latency</span>
            <span>Token Consumption</span>
            <span>Model Gateway Provider</span>
          </div>

          <div className="space-y-1.5">
            {mockTelemetryNodes.map((node) => (
              <div
                key={node.id}
                className="grid grid-cols-4 gap-2 text-[11px] text-slate-300 p-1.5 rounded bg-slate-900/60 border border-slate-800/80 items-center"
              >
                <span className="font-bold text-slate-200 flex items-center space-x-1.5 truncate">
                  <Terminal className="w-3 h-3 text-indigo-400 shrink-0" />
                  <span className="truncate">{node.name} ({node.id})</span>
                </span>
                <span className="text-emerald-400 font-medium">{node.latencyMs} ms</span>
                <span className="text-indigo-300">{node.tokens} tokens</span>
                <span className="text-slate-400 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{node.provider}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
