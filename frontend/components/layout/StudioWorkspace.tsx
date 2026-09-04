"use client";

import React from "react";
import { Header } from "./Header";
import { IngestionHUD } from "../hud/IngestionHUD";
import { DAGCanvas } from "../canvas/DAGCanvas";
import { ExperimentLabHUD } from "../hud/ExperimentLabHUD";

export function StudioWorkspace() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-studio-bg">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <IngestionHUD />
        <DAGCanvas />
        <ExperimentLabHUD />
      </div>
    </div>
  );
}
