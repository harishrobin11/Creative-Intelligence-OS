"use client";

import React, { useState } from "react";
import {
  FileText,
  Link as LinkIcon,
  Play,
  Sliders,
  Sparkles,
  X,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { extractUrlContent } from "@/lib/api";

interface IngestionHUDProps {
  onCompileGraph?: (payload: {
    project_id: string;
    product_name: string;
    product_url?: string;
    raw_brief_text: string;
    target_platform: "tiktok" | "instagram_reels" | "youtube_shorts";
    forbidden_terms: string[];
  }) => void;
}

export function IngestionHUD({ onCompileGraph }: IngestionHUDProps) {
  const [productUrl, setProductUrl] = useState("");
  const [productName, setProductName] = useState("AuraPulse Fitness Watch");
  const [targetPlatform, setTargetPlatform] = useState<
    "instagram_reels" | "tiktok" | "youtube_shorts"
  >("instagram_reels");
  const [rawBriefText, setRawBriefText] = useState(
    "Affordable recovery smartwatch designed specifically for collegiate athletes focusing on sleep, split times, and HRV recovery index without overpaying."
  );

  // Tag manager state
  const [forbiddenTerms, setForbiddenTerms] = useState<string[]>([
    "cheap",
    "unreliable",
  ]);
  const [tagInput, setTagInput] = useState("");

  // Extraction state
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extractSuccess, setExtractSuccess] = useState<string | null>(null);

  // Submission / Payload state
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !forbiddenTerms.includes(trimmed)) {
      setForbiddenTerms([...forbiddenTerms, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setForbiddenTerms(forbiddenTerms.filter((t) => t !== tagToRemove));
  };

  const handleKeyDownTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleExtractUrl = async () => {
    if (!productUrl.trim()) return;

    setIsExtracting(true);
    setExtractError(null);
    setExtractSuccess(null);

    try {
      const data = await extractUrlContent(productUrl);
      if (data.title && !productName) {
        setProductName(data.title.slice(0, 120));
      }
      if (data.suggested_brief) {
        setRawBriefText(data.suggested_brief);
      }
      setExtractSuccess(`Extracted: ${data.title}`);
    } catch (err: any) {
      setExtractError(err.message || "Failed to extract web content");
    } finally {
      setIsExtracting(false);
    }
  };

  // Validation bounds matching BrandBriefPayload schema
  const isProductNameValid = productName.trim().length > 0 && productName.length <= 120;
  const isBriefTextValid = rawBriefText.trim().length >= 20;
  const isFormValid = isProductNameValid && isBriefTextValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const payload = {
      project_id: `proj-${Date.now()}`,
      product_name: productName.trim(),
      product_url: productUrl.trim() || undefined,
      raw_brief_text: rawBriefText.trim(),
      target_platform: targetPlatform,
      forbidden_terms: forbiddenTerms,
    };

    setIsSubmitted(true);
    if (onCompileGraph) {
      onCompileGraph(payload);
    }

    setTimeout(() => setIsSubmitted(false), 3000);
  };

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
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
          SP-04 ACTIVE
        </span>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
        {/* Product URL Input with Auto-Scraper */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-mono font-medium text-slate-400 flex items-center space-x-1.5">
              <LinkIcon className="w-3 h-3 text-slate-400" />
              <span>Product Landing Page URL</span>
            </label>
          </div>
          <div className="flex space-x-1.5">
            <input
              type="text"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              placeholder="https://aurapulse.com"
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
            />
            <button
              type="button"
              onClick={handleExtractUrl}
              disabled={isExtracting || !productUrl.trim()}
              className="px-2.5 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-mono text-[10px] flex items-center space-x-1 transition-colors"
            >
              {isExtracting ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              <span>Extract</span>
            </button>
          </div>

          {/* Extraction status badges */}
          {extractError && (
            <div className="mt-1.5 text-[10px] text-rose-400 font-mono flex items-center space-x-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{extractError}</span>
            </div>
          )}
          {extractSuccess && (
            <div className="mt-1.5 text-[10px] text-emerald-400 font-mono flex items-center space-x-1 truncate">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span className="truncate">{extractSuccess}</span>
            </div>
          )}
        </div>

        {/* Product / Brand Name */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-mono font-medium text-slate-400">
              Product / Brand Name
            </label>
            <span className="text-[10px] font-mono text-slate-500">
              {productName.length}/120
            </span>
          </div>
          <input
            type="text"
            maxLength={120}
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. AuraPulse Watch"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Target Platform Format */}
        <div>
          <label className="block text-[11px] font-mono font-medium text-slate-400 mb-1.5">
            Target Platform Format
          </label>
          <select
            value={targetPlatform}
            onChange={(e) =>
              setTargetPlatform(
                e.target.value as "instagram_reels" | "tiktok" | "youtube_shorts"
              )
            }
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono text-xs"
          >
            <option value="instagram_reels">Instagram Reels (9:16)</option>
            <option value="tiktok">TikTok (9:16)</option>
            <option value="youtube_shorts">YouTube Shorts (9:16)</option>
          </select>
        </div>

        {/* Raw Brief Text */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-mono font-medium text-slate-400">
              Raw Brief & Positioning
            </label>
            <span
              className={`text-[10px] font-mono ${
                isBriefTextValid ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {rawBriefText.length} chars (min 20)
            </span>
          </div>
          <textarea
            rows={5}
            value={rawBriefText}
            onChange={(e) => setRawBriefText(e.target.value)}
            placeholder="Describe product claims, audience pain points, positioning..."
            required
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none font-sans text-xs leading-relaxed"
          />
        </div>

        {/* Forbidden Terms Tag Manager */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-mono flex items-center space-x-1">
              <Sliders className="w-3 h-3 text-indigo-400" />
              <span>Forbidden Compliance Terms</span>
            </span>
          </div>

          {/* Add Tag Input */}
          <div className="flex space-x-1.5 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDownTag}
              placeholder="Add forbidden term..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tag List */}
          <div className="flex flex-wrap gap-1.5">
            {forbiddenTerms.map((term) => (
              <span
                key={term}
                className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/50 text-[10px] font-mono text-rose-300 flex items-center space-x-1"
              >
                <span>{term}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(term)}
                  className="hover:text-rose-100"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Submit Form Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-2.5 px-4 rounded font-medium text-xs flex items-center justify-center space-x-2 shadow-lg transition-all ${
              isFormValid
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
                : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
            }`}
          >
            {isSubmitted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Graph Compiled (BrandBriefPayload Valid)</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Compile Graph (SP-04)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </aside>
  );
}
