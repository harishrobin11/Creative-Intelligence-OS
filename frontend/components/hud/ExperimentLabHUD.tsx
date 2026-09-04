"use client";

import React from "react";
import { BarChart3, RotateCw, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export function ExperimentLabHUD() {
  return (
    <aside className="w-[380px] shrink-0 border-l border-studio-border bg-studio-card/90 flex flex-col h-full overflow-hidden z-20">
      {/* HUD Header */}
      <div className="p-3.5 border-b border-studio-border flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Creative Experiment Lab
          </h2>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          HUD 02
        </span>
      </div>

      {/* Scorecard Content */}
      <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
        {/* Metric Overview Cards */}
        <div className="grid grid-cols-2 gap-2 font-mono">
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Top Score</div>
            <div className="text-base font-bold text-emerald-400">91.8 <span className="text-[10px] text-slate-500">/ 100</span></div>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Generated</div>
            <div className="text-base font-bold text-indigo-400">3 Variants</div>
          </div>
        </div>

        {/* Variant Cards List */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
            Variant Candidates
          </h3>

          {/* Variant A */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-slate-200">Variant A: Pain Agitation</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>84.6</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              "Why your current fitness watch is lying about your REM recovery."
            </p>
          </div>

          {/* Variant B (Selected Top Pick) */}
          <div className="p-3 rounded-lg bg-slate-950 border-2 border-indigo-500/80 space-y-2 relative shadow-lg shadow-indigo-500/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-indigo-300 flex items-center space-x-1.5">
                <span>Variant B: Value Inversion</span>
                <span className="text-[9px] font-mono uppercase bg-indigo-500 text-white px-1.5 py-0.2 rounded font-bold">Top Pick</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>91.8</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-200 italic font-medium">
              "You don't need a $400 watch to run a sub-20 minute 5K."
            </p>

            {/* Radar / Vector Breakdown */}
            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-1.5 text-[10px] font-mono text-slate-400">
              <div>Hook Velocity: <strong className="text-slate-200">94</strong></div>
              <div>Novelty Score: <strong className="text-slate-200">88</strong></div>
              <div>Clarity Score: <strong className="text-slate-200">93</strong></div>
              <div>Brand Alignment: <strong className="text-slate-200">92</strong></div>
            </div>
          </div>

          {/* Variant C */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-slate-200">Variant C: Social Proof</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/50 flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>78.2</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              "We gave 50 college athletes this smart band for finals week."
            </p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-3 border-t border-studio-border bg-slate-900/80 flex items-center space-x-2">
        <button
          disabled
          className="flex-1 py-2 px-3 rounded bg-slate-800 text-slate-400 text-xs font-mono flex items-center justify-center space-x-1 opacity-60 cursor-not-allowed"
        >
          <RotateCw className="w-3 h-3" />
          <span>Single Node Rerun</span>
        </button>
        <button
          disabled
          className="py-2 px-3 rounded bg-indigo-600/50 text-indigo-200 text-xs font-mono flex items-center justify-center space-x-1 opacity-60 cursor-not-allowed"
        >
          <span>Dispatch</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
}
