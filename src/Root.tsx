import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { L } from "./layout";
import { FPS, TOTAL_FRAMES } from "./motion";
import "./font";

export const Root: React.FC = () => (
  <Composition id="Main" component={Main} durationInFrames={TOTAL_FRAMES} fps={FPS} width={L.w} height={L.h} />
);
