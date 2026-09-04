"use client";

import React from "react";
import { Sparkles, GitBranch, ShieldCheck, Cpu } from "lucide-react";

export function Header() {
  return (
    <header className="h-14 border-b border-studio-border bg-studio-card/80 backdrop-blur-md px-4 flex items-center justify-between z-30 shrink-0">
      {/* Brand Identity */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm font-semibold tracking-wide text-slate-100 font-sans">
              Creative Intelligence OS
            </h1>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/50 text-indigo-300">
              v1.0 MONOLITH
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Deterministic Multi-Agent Strategy Engine
          </p>
        </div>
      </div>

      {/* Center Engine Telemetry Overview */}
      <div className="hidden md:flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
          <span>DAG Topology: <strong className="text-slate-200">Active</strong></span>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span>Engine: <strong className="text-slate-200">LiteLLM Router</strong></span>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Schemas: <strong className="text-slate-200">Pydantic v2 Enforced</strong></span>
        </div>
      </div>

      {/* Action / Status Pill */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-300">System Ready</span>
        </div>
      </div>
    </header>
  );
}
