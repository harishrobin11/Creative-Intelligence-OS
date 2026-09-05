"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { IngestionHUD } from "../hud/IngestionHUD";
import { DAGCanvas } from "../canvas/DAGCanvas";
import { ExperimentLabHUD } from "../hud/ExperimentLabHUD";
import { TelemetryDrawer } from "../hud/TelemetryDrawer";
import { BrandBriefPayloadClient, executeGraphApi } from "@/lib/api";

export function StudioWorkspace() {
  const [compiledPayload, setCompiledPayload] =
    useState<BrandBriefPayloadClient | null>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>("VAR-B-VALUE-INVERT-002");
  const [showStoryboardModal, setShowStoryboardModal] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [totalDurationMs, setTotalDurationMs] = useState(4120);

  const handleCompileGraph = async (payload: BrandBriefPayloadClient) => {
    setCompiledPayload(payload);
    setIsExecuting(true);

    try {
      // Execute multi-agent strategy & reflection pipeline
      const execRes = await executeGraphApi(payload);
      if (execRes.variants && execRes.variants.length > 0) {
        setVariants(execRes.variants);
        setSelectedVariantId(execRes.variants[0].variant_id);
      }
      if (execRes.total_duration_ms) {
        setTotalDurationMs(execRes.total_duration_ms);
      }
    } catch (err: any) {
      console.warn("Backend API execution warning, using client generated graph flow:", err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSelectVariant = (variantId: string) => {
    setSelectedVariantId(variantId);
  };

  const handleOpenStoryboardModal = (variantId: string) => {
    setSelectedVariantId(variantId);
    setShowStoryboardModal(true);
  };

  const handleCloseStoryboardModal = () => {
    setShowStoryboardModal(false);
  };

  const handleVariantUpdated = (updatedVariant: any) => {
    setVariants((prevVariants) => {
      const exists = prevVariants.some((v) => v.variant_id === updatedVariant.variant_id);
      if (exists) {
        return prevVariants.map((v) =>
          v.variant_id === updatedVariant.variant_id ? updatedVariant : v
        );
      }
      return [...prevVariants, updatedVariant];
    });
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-studio-bg">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <IngestionHUD onCompileGraph={handleCompileGraph} />
        <DAGCanvas
          compiledBriefPayload={compiledPayload}
          onSelectVariant={handleSelectVariant}
          onOpenStoryboardModal={handleOpenStoryboardModal}
        />
        <ExperimentLabHUD
          briefPayload={compiledPayload}
          variants={variants}
          selectedVariantId={selectedVariantId}
          onSelectVariant={handleSelectVariant}
          showStoryboardModal={showStoryboardModal}
          onCloseStoryboardModal={handleCloseStoryboardModal}
          onVariantUpdated={handleVariantUpdated}
        />
      </div>
      <TelemetryDrawer totalDurationMs={totalDurationMs} />
    </div>
  );
}
