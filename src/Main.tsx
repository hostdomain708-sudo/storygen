import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { L } from "./layout";
import { Background, Caption, TabBar } from "./components";
import { GlowDefs } from "./art";
import { AllScenes } from "./scenes";

export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: "#0B1226", overflow: "hidden" }}>
    <svg width={L.w} height={L.h} viewBox={`0 0 ${L.w} ${L.h}`} style={{ position: "absolute", left: 0, top: 0 }}>
      <GlowDefs />
      <Background />
      <AllScenes />
    </svg>
    <TabBar />
    <Caption />
    <Audio src={staticFile("voice.mp3")} />
  </AbsoluteFill>
);
