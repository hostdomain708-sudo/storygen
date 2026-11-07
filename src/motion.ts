import { Easing } from "remotion";
import timing from "./timing.json";
export const SPRING = {
  pop: { damping: 11, stiffness: 170, mass: 0.8 },
  soft: { damping: 20, stiffness: 120, mass: 1.0 },
  snap: { damping: 14, stiffness: 260, mass: 0.6 },
};
export const SMOOTH = Easing.bezier(0.22, 1, 0.36, 1);
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
export const FPS = 30;
export const AUDIO_SEC = timing.duration as number;
export const TOTAL_FRAMES = Math.ceil((AUDIO_SEC + 1.0) * FPS);
export const words = timing.words as { w: string; s: number; e: number }[];
// শব্দ-ইনডেক্স থেকে সময়: cue = শব্দ-শুরু − ০.০৮s
export const W = (i: number) => words[i].s;
export const C = (i: number) => Math.max(0, words[i].s - 0.08);
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const ease3 = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
export const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const toBn = (n: number | string) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
