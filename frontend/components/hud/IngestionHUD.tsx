"use client";

import React from "react";
import { FileText, Link as LinkIcon, Play, Sliders } from "lucide-react";

export function IngestionHUD() {
  return (
    <aside className="w-[320px] shrink-0 border-r border-studio-border bg-studio-card/90 flex flex-col h-full overflow-hidden z-20">
      {/* HUD Header */}
      <div className="p-3.5 border-b border-studio-border flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Creative Brief Ingestion
          </h2>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          HUD 01
        </span>
      </div>

      {/* HUD Form Content Placeholder */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
        {/* Product URL Input */}
        <div>
          <label className="block text-[11px] font-mono font-medium text-slate-400 mb-1.5 flex items-center space-x-1.5">
            <LinkIcon className="w-3 h-3 text-slate-400" />
            <span>Product Landing Page URL</span>
          </label>
          <input
            type="url"
            disabled
            placeholder="https://aurapulse.com"
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-300 placeholder-slate-600 focus:outline-none cursor-not-allowed opacity-75"
          />
        </div>

        {/* Brand Name */}
        <div>
          <label className="block text-[11px] font-mono font-medium text-slate-400 mb-1.5">
            Product / Brand Name
          </label>
          <input
            type="text"
            disabled
            placeholder="AuraPulse Fitness Watch"
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-300 placeholder-slate-600 focus:outline-none cursor-not-allowed opacity-75"
          />
        </div>

        {/* Target Platform */}
        <div>
          <label className="block text-[11px] font-mono font-medium text-slate-400 mb-1.5">
            Target Platform Format
          </label>
          <select
            disabled
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-300 focus:outline-none cursor-not-allowed opacity-75"
          >
            <option value="instagram_reels">Instagram Reels (9:16)</option>
            <option value="tiktok">TikTok (9:16)</option>
            <option value="youtube_shorts">YouTube Shorts (9:16)</option>
          </select>
        </div>

        {/* Raw Brief Text */}
        <div>
          <label className="block text-[11px] font-mono font-medium text-slate-400 mb-1.5">
            Raw Brief & Core Value Proposition
          </label>
          <textarea
            disabled
            rows={5}
            placeholder="Affordable recovery smartwatch designed specifically for collegiate athletes focusing on sleep, split times, and HRV..."
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-300 placeholder-slate-600 focus:outline-none cursor-not-allowed opacity-75 resize-none"
          />
        </div>

        {/* Advanced Settings */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono flex items-center space-x-1">
              <Sliders className="w-3 h-3 text-indigo-400" />
              <span>Forbidden Terms</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/50 text-[10px] font-mono text-rose-300">
              cheap
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/50 text-[10px] font-mono text-rose-300">
              unreliable
            </span>
          </div>
        </div>
      </div>

      {/* CTA Button Footer */}
      <div className="p-3 border-t border-studio-border bg-slate-900/80">
        <button
          disabled
          className="w-full py-2.5 px-4 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 opacity-60 cursor-not-allowed"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Compile Graph (Phase 2)</span>
        </button>
      </div>
    </aside>
  );
}
