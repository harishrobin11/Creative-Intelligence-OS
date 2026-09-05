"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { IngestionHUD } from "../hud/IngestionHUD";
import { DAGCanvas } from "../canvas/DAGCanvas";
import { ExperimentLabHUD } from "../hud/ExperimentLabHUD";
import { BrandBriefPayloadClient } from "@/lib/api";

export function StudioWorkspace() {
  const [compiledPayload, setCompiledPayload] =
    useState<BrandBriefPayloadClient | null>(null);

  const handleCompileGraph = (payload: BrandBriefPayloadClient) => {
    setCompiledPayload(payload);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-studio-bg">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <IngestionHUD onCompileGraph={handleCompileGraph} />
        <DAGCanvas compiledBriefPayload={compiledPayload} />
        <ExperimentLabHUD />
      </div>
    </div>
  );
}
