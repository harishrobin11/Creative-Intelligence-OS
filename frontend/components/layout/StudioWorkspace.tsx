"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { IngestionHUD } from "../hud/IngestionHUD";
import { DAGCanvas } from "../canvas/DAGCanvas";
import { ExperimentLabHUD } from "../hud/ExperimentLabHUD";
import { BrandBriefPayloadClient, executeGraphApi } from "@/lib/api";

export function StudioWorkspace() {
  const [compiledPayload, setCompiledPayload] =
    useState<BrandBriefPayloadClient | null>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleCompileGraph = async (payload: BrandBriefPayloadClient) => {
    setCompiledPayload(payload);
    setIsExecuting(true);

    try {
      // Execute multi-agent strategy & reflection pipeline
      const execRes = await executeGraphApi(payload);
      if (execRes.variants && execRes.variants.length > 0) {
        setVariants(execRes.variants);
      }
    } catch (err: any) {
      console.warn("Backend API execution warning, using client generated graph flow:", err.message);
    } finally {
      setIsExecuting(false);
    }
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
        <DAGCanvas compiledBriefPayload={compiledPayload} />
        <ExperimentLabHUD
          briefPayload={compiledPayload}
          variants={variants}
          onVariantUpdated={handleVariantUpdated}
        />
      </div>
    </div>
  );
}
