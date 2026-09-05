"use client";

import React, { useState } from "react";
import { Node } from "@xyflow/react";
import { X, Code, FileText, Cpu, Copy, Check } from "lucide-react";

interface InspectModalProps {
  node: Node | null;
  onClose: () => void;
}

export function InspectModal({ node, onClose }: InspectModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"output" | "prompt" | "variables">("output");

  if (!node) return null;

  const nodeData = node.data || {};

  const systemPrompts: { [key: string]: string } = {
    briefNode: "System Prompt: Raw Ingestion Engine Parser. Validates BrandBriefPayload schemas.",
    strategistNode:
      "SYSTEM: You are an elite direct-response growth strategist. Your role is strictly analytical. Analyze input product data and extract: (1) Core latent customer anxieties, (2) Competitor clichés to avoid, (3) Three core strategic pillars.",
    angleBranchNode:
      "SYSTEM: You are a master viral direct-response video scriptwriter. Synthesize high-converting short-form video hooks. Output MUST conform strictly to CreativeAngleVariant JSON schema.",
    brandCriticNode:
      "SYSTEM: You are an uncompromising Creative Director and Regulatory Compliance Auditor. Evaluate creative hooks across Novelty, Clarity, Hook Velocity, and Brand Alignment. Output MUST conform to EvaluationVector JSON schema.",
  };

  const currentSystemPrompt =
    systemPrompts[node.type as string] || "System Prompt: Specialist Agent Execution Boundary.";

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(nodeData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-studio-card border border-studio-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] select-none">
        {/* Header */}
        <div className="p-4 border-b border-studio-border bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Prompt & Payload Inspector (SP-17) — {node.id}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-4 font-mono text-xs">
          <button
            onClick={() => setActiveTab("output")}
            className={`py-2 px-3 border-b-2 font-medium transition-colors ${
              activeTab === "output"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Raw JSON Output
          </button>
          <button
            onClick={() => setActiveTab("prompt")}
            className={`py-2 px-3 border-b-2 font-medium transition-colors ${
              activeTab === "prompt"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            System Prompt Template
          </button>
          <button
            onClick={() => setActiveTab("variables")}
            className={`py-2 px-3 border-b-2 font-medium transition-colors ${
              activeTab === "variables"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Injected Input Variables
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto font-mono text-xs text-slate-200 bg-slate-950 flex-1">
          {activeTab === "output" && (
            <div className="relative">
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 flex items-center space-x-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy JSON"}</span>
              </button>
              <pre className="text-indigo-300 whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(nodeData, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === "prompt" && (
            <div className="space-y-2">
              <div className="text-slate-400 text-[11px] font-bold">Agent System Prompt</div>
              <div className="p-3 rounded bg-slate-900 border border-slate-800 text-slate-300 italic leading-relaxed">
                {currentSystemPrompt}
              </div>
            </div>
          )}

          {activeTab === "variables" && (
            <div className="space-y-2">
              <div className="text-slate-400 text-[11px] font-bold">Injected Context Variables</div>
              <pre className="p-3 rounded bg-slate-900 border border-slate-800 text-emerald-400 whitespace-pre-wrap">
                {JSON.stringify(
                  {
                    node_id: node.id,
                    node_type: node.type,
                    data_keys: Object.keys(nodeData),
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-studio-border bg-slate-900/80 flex justify-between items-center text-[10px] font-mono text-slate-400">
          <span>Node Type: {node.type}</span>
          <button
            onClick={onClose}
            className="px-4 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
