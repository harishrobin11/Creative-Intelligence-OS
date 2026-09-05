"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  FileCode,
  X,
  Loader2,
  Film,
  Eye,
} from "lucide-react";
import { rerunNodeApi, BrandBriefPayloadClient } from "@/lib/api";

interface ExperimentLabHUDProps {
  briefPayload?: BrandBriefPayloadClient | null;
  variants?: any[];
  selectedVariantId?: string | null;
  onSelectVariant?: (variantId: string) => void;
  onVariantUpdated?: (updatedVariant: any) => void;
}

const defaultVariants = [
  {
    variant_id: "VAR-A-PAIN-001",
    angle_archetype: "pain_agitation",
    headline_hook: "Why your current fitness watch is lying about your REM recovery.",
    narrative_thesis: "Expose hidden subscription paywalls in high-end watches.",
    evaluation: {
      novelty_score: 88.0,
      clarity_score: 90.0,
      hook_velocity_score: 84.0,
      brand_alignment_score: 92.0,
      composite_index: 86.4,
      pass_audit: true,
      critique_notes: "Passed brand audit. High agitation tension.",
    },
    storyboard: [
      {
        beat_number: 1,
        duration_seconds: 3.0,
        visual_description: "Macro handheld shot of runner tying shoe at dawn track.",
        audio_voiceover: "Why your current fitness watch is lying about your REM recovery.",
        on_screen_text: "Stop Overpaying For Recovery Data",
      },
      {
        beat_number: 2,
        duration_seconds: 4.5,
        visual_description: "Split screen showing locked app paywall vs AuraPulse interface.",
        audio_voiceover: "Most legacy brands charge $400 markups and lock HRV data.",
        on_screen_text: "Zero Subscription Paywalls",
      },
      {
        beat_number: 3,
        duration_seconds: 4.0,
        visual_description: "Runner sprinting on foggy track with optical sensor close-up.",
        audio_voiceover: "AuraPulse gives you medical-grade recovery tracking at student pricing.",
        on_screen_text: "Medical-Grade Precision",
      },
      {
        beat_number: 4,
        duration_seconds: 3.5,
        visual_description: "Clean studio product packshot with CTA overlay.",
        audio_voiceover: "Tap below to check student pricing today.",
        on_screen_text: "Claim Student Pricing Below ↓",
      },
    ],
  },
  {
    variant_id: "VAR-B-VALUE-INVERT-002",
    angle_archetype: "value_inversion",
    headline_hook: "You don't need a $400 watch to run a sub-20 minute 5K.",
    narrative_thesis: "Subvert luxury status symbols in collegiate athletics.",
    evaluation: {
      novelty_score: 88.0,
      clarity_score: 93.0,
      hook_velocity_score: 94.0,
      brand_alignment_score: 92.0,
      composite_index: 91.8,
      pass_audit: true,
      critique_notes: "Passed audit seamlessly. Strong tension established at 0.8s.",
    },
    storyboard: [
      {
        beat_number: 1,
        duration_seconds: 3.2,
        visual_description: "Cinematic 35mm handheld, cold dawn mist, runner checking wrist.",
        audio_voiceover: "Stop spending four hundred dollars just to track your morning splits.",
        on_screen_text: "You Don't Need A $400 Watch",
      },
      {
        beat_number: 2,
        duration_seconds: 4.0,
        visual_description: "Dynamic track lap sprint with optical sensor close-up.",
        audio_voiceover: "AuraPulse gives you medical-grade recovery tracking at student pricing.",
        on_screen_text: "Medical-Grade Precision",
      },
      {
        beat_number: 3,
        duration_seconds: 4.5,
        visual_description: "Student athlete analyzing sleep recovery chart on phone app.",
        audio_voiceover: "Track REM sleep, split times, and recovery index with zero monthly fees.",
        on_screen_text: "Zero Monthly Fees",
      },
      {
        beat_number: 4,
        duration_seconds: 3.3,
        visual_description: "Studio shot of watch with student discount badge.",
        audio_voiceover: "Tap below to check student pricing for AuraPulse Watch.",
        on_screen_text: "Shop Student Discount Now",
      },
    ],
  },
  {
    variant_id: "VAR-C-SOCIAL-003",
    angle_archetype: "social_proof",
    headline_hook: "We gave 50 college athletes this smart band for finals week.",
    narrative_thesis: "Relatable peer validation & stress recovery testing.",
    evaluation: {
      novelty_score: 78.0,
      clarity_score: 88.0,
      hook_velocity_score: 80.0,
      brand_alignment_score: 90.0,
      composite_index: 82.2,
      pass_audit: true,
      critique_notes: "Passed threshold test.",
    },
    storyboard: [
      {
        beat_number: 1,
        duration_seconds: 3.0,
        visual_description: "Fast montage of student athletes studying and running.",
        audio_voiceover: "We gave 50 college athletes this smart band for finals week.",
        on_screen_text: "50 Athletes Tested",
      },
      {
        beat_number: 2,
        duration_seconds: 4.0,
        visual_description: "Interviews with runners showing HRV recovery metrics.",
        audio_voiceover: "89% reported better sleep pacing during high stress training.",
        on_screen_text: "89% Recovery Improvement",
      },
    ],
  },
];

export function ExperimentLabHUD({
  briefPayload,
  variants = defaultVariants,
  selectedVariantId,
  onSelectVariant,
  onVariantUpdated,
}: ExperimentLabHUDProps) {
  const activeVariants = variants && variants.length > 0 ? variants : defaultVariants;

  const [selectedVariant, setSelectedVariant] = useState<any>(activeVariants[1]);
  const [rerunningNodeId, setRerunningNodeId] = useState<string | null>(null);
  const [overridePrompts, setOverridePrompts] = useState<{ [key: string]: string }>({});
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [showStoryboardModal, setShowStoryboardModal] = useState(false);

  // Sync external selectedVariantId prop
  useEffect(() => {
    if (selectedVariantId) {
      const match = activeVariants.find((v) => v.variant_id === selectedVariantId);
      if (match) {
        setSelectedVariant(match);
      }
    }
  }, [selectedVariantId, activeVariants]);

  // Find top pick variant
  const topPick = activeVariants.reduce(
    (max, v) => (v.evaluation?.composite_index > max.evaluation?.composite_index ? v : max),
    activeVariants[0]
  );

  const handleSelectVariant = (v: any) => {
    setSelectedVariant(v);
    if (onSelectVariant) {
      onSelectVariant(v.variant_id);
    }
  };

  const handleRerunNode = async (variant: any) => {
    const nodeId =
      variant.angle_archetype === "pain_agitation"
        ? "node_hook_branch_a"
        : variant.angle_archetype === "value_inversion"
        ? "node_hook_branch_b"
        : "node_hook_branch_c";

    setRerunningNodeId(nodeId);

    const payload: BrandBriefPayloadClient = briefPayload || {
      project_id: "demo-proj",
      product_name: "AuraPulse Watch",
      raw_brief_text: "Affordable recovery smartwatch for collegiate athletes.",
      target_platform: "instagram_reels",
      forbidden_terms: ["cheap"],
    };

    try {
      const res = await rerunNodeApi(
        nodeId,
        payload,
        variant.angle_archetype,
        overridePrompts[variant.variant_id]
      );

      if (onVariantUpdated) {
        onVariantUpdated(res.variant);
      }
      setSelectedVariant(res.variant);
    } catch (err: any) {
      alert(`Rerun failed: ${err.message}`);
    } finally {
      setRerunningNodeId(null);
    }
  };

  // Build downstream execution JSON payload
  const downstreamPayload = {
    variant_reference: selectedVariant.variant_id,
    aspect_ratio: "9:16",
    total_duration: selectedVariant.storyboard
      ? selectedVariant.storyboard.reduce((sum: number, b: any) => sum + (b.duration_seconds || 3.0), 0)
      : 15.0,
    scene_manifest: (selectedVariant.storyboard || []).map((beat: any) => ({
      beat_number: beat.beat_number,
      timestamp_range: [
        0.0,
        beat.duration_seconds || 3.0,
      ],
      camera_prompt: beat.visual_description,
      voiceover_text: beat.audio_voiceover,
      on_screen_text: beat.on_screen_text,
    })),
  };

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
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
          SP-14 & SP-15 ACTIVE
        </span>
      </div>

      {/* Scorecard Content */}
      <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
        {/* Overview Metric Summary */}
        <div className="grid grid-cols-2 gap-2 font-mono">
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Top Composite Score</div>
            <div className="text-base font-bold text-emerald-400 flex items-center space-x-1">
              <span>{topPick?.evaluation?.composite_index?.toFixed(1) || "91.8"}</span>
              <span className="text-[10px] text-slate-500">/ 100</span>
            </div>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Audit Status</div>
            <div className="text-base font-bold text-indigo-400 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs">3/3 Passed</span>
            </div>
          </div>
        </div>

        {/* Variant Scorecards List */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
            Variant Candidates Matrix
          </h3>

          {activeVariants.map((v) => {
            const isTop = v.variant_id === topPick?.variant_id;
            const isSelected = v.variant_id === selectedVariant?.variant_id;
            const score = v.evaluation?.composite_index || 80.0;
            const isPassing = score >= 80.0;
            const isRerunning = rerunningNodeId?.includes(v.angle_archetype?.slice(0, 4));

            return (
              <div
                key={v.variant_id}
                onClick={() => handleSelectVariant(v)}
                className={`p-3 rounded-lg bg-slate-950 border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? "border-indigo-500/90 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold font-mono text-slate-200">
                      {v.variant_id}
                    </span>
                    {isTop && (
                      <span className="text-[9px] font-mono uppercase bg-indigo-600 text-white px-1.5 py-0.2 rounded font-bold">
                        Top Pick
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center space-x-1 ${
                      isPassing
                        ? "bg-emerald-950 text-emerald-300 border-emerald-800/50"
                        : "bg-amber-950 text-amber-300 border-amber-800/50"
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{score.toFixed(1)}</span>
                  </span>
                </div>

                <p className="text-[11px] text-slate-200 italic font-medium leading-snug">
                  "{v.headline_hook}"
                </p>

                {/* Metric Gauges Bar */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[10px] font-mono">
                  <div className="flex justify-between text-slate-400 text-[9px]">
                    <span>Velocity: {v.evaluation?.hook_velocity_score || 90}</span>
                    <span>Novelty: {v.evaluation?.novelty_score || 85}</span>
                    <span>Clarity: {v.evaluation?.clarity_score || 90}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden flex">
                    <div
                      className="bg-indigo-500 h-full"
                      style={{ width: `${v.evaluation?.hook_velocity_score || 90}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons: View Storyboard & Rerun Node */}
                <div className="pt-2 flex items-center justify-between space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectVariant(v);
                      setShowStoryboardModal(true);
                    }}
                    className="flex-1 py-1.5 px-2 rounded bg-indigo-950 hover:bg-indigo-900 border border-indigo-800/60 text-indigo-200 font-mono text-[10px] flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Film className="w-3 h-3 text-indigo-400" />
                    <span>View Storyboard ({(v.storyboard || []).length} Beats)</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRerunNode(v);
                    }}
                    disabled={isRerunning}
                    className="py-1.5 px-2.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center space-x-1 transition-colors"
                  >
                    {isRerunning ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <RotateCw className="w-3 h-3 text-indigo-400" />
                    )}
                    <span>Rerun</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Diagnostic Card for Selected Variant */}
        {selectedVariant && (
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-3 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Deep Storyboard Diagnostic</span>
              </span>
              <button
                onClick={() => setShowStoryboardModal(true)}
                className="text-[10px] font-mono text-indigo-400 hover:underline flex items-center space-x-1"
              >
                <Eye className="w-3 h-3" />
                <span>Expand Full Screen</span>
              </button>
            </div>

            {/* Beat Timeline list */}
            <div className="space-y-2">
              {(selectedVariant.storyboard || []).map((beat: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setShowStoryboardModal(true)}
                  className="p-2.5 rounded bg-slate-900 border border-slate-800 hover:border-indigo-500/50 cursor-pointer text-[11px] space-y-1 transition-colors"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                    <span className="text-indigo-400 font-bold flex items-center space-x-1">
                      <Film className="w-3 h-3 text-indigo-400" />
                      <span>Beat #{beat.beat_number} ({beat.duration_seconds}s)</span>
                    </span>
                    <span className="text-slate-500 font-mono">OST Overlay</span>
                  </div>
                  <p className="text-slate-100 font-medium">"{beat.audio_voiceover}"</p>
                  <p className="text-[10px] text-slate-400 italic">
                    Visual: {beat.visual_description}
                  </p>
                  {beat.on_screen_text && (
                    <div className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800 inline-block">
                      Text: {beat.on_screen_text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="p-3 border-t border-studio-border bg-slate-900/80 flex items-center space-x-2">
        <button
          onClick={() => setShowJsonModal(true)}
          className="flex-1 py-2 px-3 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-medium flex items-center justify-center space-x-1.5 transition-colors shadow-lg shadow-indigo-600/20"
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Export Downstream JSON</span>
        </button>
      </div>

      {/* Full Interactive Storyboard Timeline Modal */}
      {showStoryboardModal && selectedVariant && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-studio-card border border-studio-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-studio-border bg-slate-900/90 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono text-slate-100">
                    Storyboard Timeline — {selectedVariant.variant_id}
                  </h3>
                  <p className="text-xs text-slate-400 italic">
                    "{selectedVariant.headline_hook}"
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowStoryboardModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Storyboard Beats Grid Content */}
            <div className="p-5 overflow-y-auto space-y-4 bg-slate-950 flex-1 text-xs">
              <div className="grid grid-cols-2 gap-3 mb-2 font-mono text-[11px]">
                <div className="p-3 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 uppercase text-[9px] block">Archetype</span>
                  <span className="text-indigo-300 font-bold uppercase">{selectedVariant.angle_archetype}</span>
                </div>
                <div className="p-3 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 uppercase text-[9px] block">Composite Score</span>
                  <span className="text-emerald-400 font-bold">{selectedVariant.evaluation?.composite_index?.toFixed(1)} / 100</span>
                </div>
              </div>

              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Pacing-Calibrated Scene Manifest Beats
              </h4>

              <div className="space-y-3">
                {(selectedVariant.storyboard || []).map((beat: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2 font-sans relative"
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-indigo-400 font-bold flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                          {beat.beat_number}
                        </span>
                        <span>Scene Beat #{beat.beat_number}</span>
                      </span>
                      <span className="text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                        Duration: {beat.duration_seconds}s
                      </span>
                    </div>

                    <div className="pl-8 space-y-2">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase block">
                          Audio Voiceover Script
                        </span>
                        <p className="text-sm font-semibold text-slate-100">
                          "{beat.audio_voiceover}"
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase block">
                          Visual Camera & Lighting Prompt
                        </span>
                        <p className="text-xs text-slate-300 italic">
                          {beat.visual_description}
                        </p>
                      </div>

                      {beat.on_screen_text && (
                        <div>
                          <span className="text-[10px] font-mono text-slate-500 uppercase block">
                            On-Screen Text Overlay (OST)
                          </span>
                          <span className="inline-block text-xs font-mono font-bold px-2 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                            {beat.on_screen_text}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 border-t border-studio-border bg-slate-900/80 flex justify-between items-center">
              <span className="text-xs font-mono text-slate-400">
                Total Scene Duration: {downstreamPayload.total_duration}s
              </span>
              <button
                onClick={() => setShowStoryboardModal(false)}
                className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono"
              >
                Close Storyboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Downstream JSON Export Payload Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-studio-card border border-studio-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-studio-border bg-slate-900/80 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Film className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                  Downstream Video Engine Generation Manifest
                </h3>
              </div>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto font-mono text-xs text-indigo-300 bg-slate-950 flex-1">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(downstreamPayload, null, 2)}
              </pre>
            </div>

            <div className="p-3 border-t border-studio-border bg-slate-900/80 flex justify-end">
              <button
                onClick={() => setShowJsonModal(false)}
                className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono"
              >
                Close Manifest
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
