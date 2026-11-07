import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { T } from "./theme";
import { SPRING, clamp01, ease3, hash } from "./motion";
import { bn } from "./font";

export const useTime = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { f, t: f / fps, fps };
};
export const usePop = (at: number, cfg = SPRING.pop) => {
  const { f, fps } = useTime();
  return spring({ frame: f - at * fps, fps, config: cfg });
};
const S = { stroke: T.ink, strokeWidth: 4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

// ───────── গতি-র‍্যাপার (পুরো-বস্তুর) ─────────
export const Pop: React.FC<{ at: number; x?: number; y?: number; s?: number; rise?: number; until?: number; opacity?: number; rot?: number; children?: React.ReactNode }> =
  ({ at, x = 0, y = 0, s = 1, rise = 50, until, opacity = 1, rot = 0, children }) => {
    const { t } = useTime();
    const p = usePop(at);
    const out = until !== undefined ? 1 - clamp01((t - until) / 0.3) : 1;
    const o = clamp01(p * 1.6) * out * opacity;
    if (o <= 0.002) return null;
    return <g transform={`translate(${x} ${y + (1 - p) * rise}) rotate(${rot}) scale(${s * (0.9 + 0.1 * p)})`} opacity={o}>{children}</g>;
  };

/** from→to সরণ (সেকেন্ডে), চলার সময় ছোট bob */
export const Move: React.FC<{ from: [number, number]; to: [number, number]; at: number; dur: number; bob?: number; children?: React.ReactNode }> =
  ({ from, to, at, dur, bob = 0, children }) => {
    const { t } = useTime();
    const p = ease3((t - at) / dur);
    const moving = p > 0 && p < 1 ? 1 : 0;
    const x = from[0] + (to[0] - from[0]) * p;
    const y = from[1] + (to[1] - from[1]) * p + Math.abs(Math.sin(t * 11)) * -bob * moving;
    return <g transform={`translate(${x} ${y})`}>{children}</g>;
  };

export const Pulse: React.FC<{ x: number; y: number; r?: number; color?: string; at?: number; period?: number; n?: number }> =
  ({ x, y, r = 60, color = T.accent, at = 0, period = 1.4, n = 2 }) => {
    const { t } = useTime();
    if (t < at) return null;
    return <g>{Array.from({ length: n }, (_, i) => {
      const k = ((((t - at) / period) + i / n) % 1);
      return <circle key={i} cx={x} cy={y} r={r * (0.4 + 1.6 * k)} fill="none" stroke={color} strokeWidth={4} opacity={0.65 * (1 - k)} />;
    })}</g>;
  };

export const Glow: React.FC<{ x: number; y: number; r: number; color?: string; o?: number }> = ({ x, y, r, color = T.accent, o = 1 }) => {
  const { t } = useTime();
  const k = 1 + Math.sin(t * Math.PI) * 0.06;
  return <circle cx={x} cy={y} r={r * k} fill={`url(#g-${color.replace(/[^a-z0-9]/gi, "")})`} opacity={o} />;
};
export const GlowDefs: React.FC = () => (
  <defs>
    {[T.accent, T.data, T.bad, T.good, T.warn, T.royal].map((c) => (
      <radialGradient key={c} id={`g-${c.replace(/[^a-z0-9]/gi, "")}`}>
        <stop offset="0%" stopColor={c} stopOpacity={0.55} /><stop offset="100%" stopColor={c} stopOpacity={0} />
      </radialGradient>
    ))}
  </defs>
);

// ───────── টেক্সট ও টীকা ─────────
export const Txt: React.FC<{ x: number; y: number; size?: number; fill?: string; weight?: number; anchor?: "start" | "middle" | "end"; opacity?: number; children?: React.ReactNode }> =
  ({ x, y, size = 40, fill = T.text, weight = 700, anchor = "middle", opacity = 1, children }) => (
    <text x={x} y={y} fontFamily={bn} fontWeight={weight} fontSize={size} fill={fill} textAnchor={anchor} opacity={opacity} dominantBaseline="central">{children}</text>
  );

/** মেট্রিক/ট্যাগ চিপ (কেন্দ্র x,y) */
export const Chip: React.FC<{ x: number; y: number; w: number; h?: number; text: string; unit?: string; color?: string; size?: number; fillBg?: string }> =
  ({ x, y, w, h = 84, text, unit, color = T.accent, size = 52, fillBg = T.surface }) => (
    <g transform={`translate(${x - w / 2} ${y - h / 2})`}>
      <rect width={w} height={h} rx={24} fill={fillBg} stroke={color} strokeWidth={3} />
      <rect width={w} height={h} rx={24} fill="none" stroke={color} strokeWidth={10} opacity={0.15} />
      <Txt x={unit ? w * 0.38 : w / 2} y={h / 2 + 2} size={size} fill={color}>{text}</Txt>
      {unit && <Txt x={w * 0.76} y={h / 2 + 4} size={Math.round(size * 0.5)} fill={T.muted}>{unit}</Txt>}
    </g>
  );
export const Tag: React.FC<{ x: number; y: number; w: number; text: string; color?: string; size?: number; h?: number }> =
  ({ x, y, w, text, color = T.data, size = 32, h = 56 }) => (
    <g transform={`translate(${x - w / 2} ${y - h / 2})`}>
      <rect width={w} height={h} rx={h / 2} fill={T.surface} stroke={color} strokeWidth={2.5} />
      <Txt x={w / 2} y={h / 2 + 2} size={size} fill={color}>{text}</Txt>
    </g>
  );

export const Cross: React.FC<{ x: number; y: number; s?: number; color?: string; at: number }> = ({ x, y, s = 1, color = T.bad, at }) => {
  const { t } = useTime(); const p = usePop(at, SPRING.pop); const d = ease3((t - at) / 0.25);
  if (p <= 0.01) return null;
  return <g transform={`translate(${x} ${y}) scale(${s * (0.85 + 0.15 * p)})`} opacity={clamp01(p * 2)}>
    <circle r={52} fill={T.surface} opacity={0.75} />
    <path d="M -28 -28 L 28 28" stroke={color} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} />
    <path d="M 28 -28 L -28 28" stroke={color} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01(d * 2 - 0.8)} />
  </g>;
};
export const Check: React.FC<{ x: number; y: number; s?: number; color?: string; at: number }> = ({ x, y, s = 1, color = T.good, at }) => {
  const p = usePop(at, SPRING.pop);
  if (p <= 0.01) return null;
  return <g transform={`translate(${x} ${y}) scale(${s * (0.85 + 0.15 * p)})`} opacity={clamp01(p * 2)}>
    <circle r={52} fill={T.surface} opacity={0.75} />
    <path d="M -28 2 L -8 24 L 30 -22" stroke={color} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </g>;
};
export const Stamp: React.FC<{ x: number; y: number; text: string; color?: string; at: number; size?: number; w?: number }> = ({ x, y, text, color = T.bad, at, size = 56, w = 380 }) => {
  const { t } = useTime(); const p = usePop(at, SPRING.pop);
  if (p <= 0.01) return null;
  const sc = 1.5 - 0.5 * clamp01(p); const rot = -6 + 3 * clamp01(p);
  return <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sc})`} opacity={clamp01(p * 2)}>
    <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.9} rx={14} fill={T.bg} fillOpacity={0.55} stroke={color} strokeWidth={7} />
    <Txt x={0} y={4} size={size} fill={color}>{text}</Txt>
  </g>;
};

// ───────── ছোট আঁকা প্রপ ─────────
export const Star: React.FC<{ r?: number; fill?: string; rot?: number }> = ({ r = 40, fill = T.accent, rot = 0 }) => {
  const pts = Array.from({ length: 10 }, (_, i) => { const a = (Math.PI / 5) * i - Math.PI / 2; const rr = i % 2 ? r * 0.45 : r; return `${Math.cos(a) * rr},${Math.sin(a) * rr}`; }).join(" ");
  return <polygon points={pts} fill={fill} {...S} transform={`rotate(${rot})`} />;
};
export const Heart: React.FC<{ s?: number; fill?: string }> = ({ s = 1, fill = T.bad }) => (
  <path transform={`scale(${s})`} d="M 0 28 C -46 -4 -36 -40 -16 -40 C -6 -40 0 -32 0 -26 C 0 -32 6 -40 16 -40 C 36 -40 46 -4 0 28 Z" fill={fill} {...S} />
);
export const Smile: React.FC<{ r?: number }> = ({ r = 18 }) => (
  <g><circle r={r} fill={T.accent} stroke={T.ink} strokeWidth={2.5} />
    <circle cx={-r * 0.35} cy={-r * 0.2} r={r * 0.11} fill={T.ink} /><circle cx={r * 0.35} cy={-r * 0.2} r={r * 0.11} fill={T.ink} />
    <path d={`M ${-r * 0.45} ${r * 0.2} Q 0 ${r * 0.65} ${r * 0.45} ${r * 0.2}`} stroke={T.ink} strokeWidth={2.5} fill="none" strokeLinecap="round" /></g>
);
export const Eye: React.FC<{ s?: number; color?: string; look?: number }> = ({ s = 1, color = T.text, look = 0 }) => (
  <g transform={`scale(${s})`}><path d="M -44 0 Q 0 -38 44 0 Q 0 38 -44 0 Z" fill={color} {...S} />
    <circle cx={look * 10} r={15} fill={T.navy2} stroke={T.ink} strokeWidth={3} /><circle cx={look * 10 + 4} cy={-4} r={4.5} fill={T.text} /></g>
);
export const Coin: React.FC<{ r?: number }> = ({ r = 24 }) => (
  <g><circle r={r} fill={T.accent} {...S} /><circle r={r * 0.62} fill="none" stroke={T.ink} strokeWidth={2.5} opacity={0.6} /></g>
);
export const CoinBag: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><path d="M -30 -20 Q -52 40 -34 50 Q 0 62 34 50 Q 52 40 30 -20 Z" fill={T.warn} {...S} />
    <path d="M -22 -22 L -30 -44 L 30 -44 L 22 -22 Z" fill={T.warn} {...S} /><rect x={-26} y={-30} width={52} height={10} rx={5} fill={T.accent} {...S} />
    <circle cx={0} cy={18} r={14} fill={T.accent} stroke={T.ink} strokeWidth={3} /></g>
);
export const Plate: React.FC<{ s?: number; color?: string }> = ({ s = 1, color = T.cream }) => (
  <g transform={`scale(${s})`}><ellipse cx={0} cy={0} rx={38} ry={9} fill={color} {...S} strokeWidth={3} />
    <path d="M -28 -2 Q -28 -34 0 -34 Q 28 -34 28 -2 Z" fill={color} {...S} strokeWidth={3} /><circle cx={0} cy={-39} r={5} fill={color} {...S} strokeWidth={3} /></g>
);
export const Mask: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><path d="M -40 -40 Q 0 -56 40 -40 Q 44 20 0 46 Q -44 20 -40 -40 Z" fill={T.accent} {...S} />
    <path d="M -22 -14 Q -14 -24 -6 -14" stroke={T.ink} strokeWidth={4} fill="none" strokeLinecap="round" /><path d="M 6 -14 Q 14 -24 22 -14" stroke={T.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M -18 12 Q 0 30 18 12" stroke={T.ink} strokeWidth={4} fill="none" strokeLinecap="round" /></g>
);
export const Gavel: React.FC<{ s?: number; rot?: number }> = ({ s = 1, rot = 0 }) => (
  <g transform={`scale(${s}) rotate(${rot})`}><rect x={-14} y={-4} width={28} height={110} rx={8} fill={T.warn} {...S} />
    <rect x={-60} y={-44} width={120} height={50} rx={14} fill={T.hairBrown} {...S} /></g>
);
export const Crest: React.FC<{ s?: number; children?: React.ReactNode }> = ({ s = 1, children }) => (
  <g transform={`scale(${s})`}><path d="M -110 -130 L 110 -130 L 110 20 Q 110 100 0 150 Q -110 100 -110 20 Z" fill={T.surfaceHi} stroke={T.accent} strokeWidth={8} strokeLinejoin="round" />
    <path d="M -110 -130 L 110 -130 L 110 20 Q 110 100 0 150 Q -110 100 -110 20 Z" fill="none" stroke={T.ink} strokeWidth={3} />{children}</g>
);
export const Crown: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><path d="M -40 14 L -40 -22 L -20 -2 L 0 -34 L 20 -2 L 40 -22 L 40 14 Z" fill={T.accent} {...S} />
    <circle cx={-40} cy={-24} r={5} fill={T.bad} /><circle cx={0} cy={-36} r={6} fill={T.data} /><circle cx={40} cy={-24} r={5} fill={T.bad} /></g>
);
export const Bubble: React.FC<{ x: number; y: number; w: number; h: number; tail?: "l" | "r" | "d"; children?: React.ReactNode }> = ({ x, y, w, h, tail = "d", children }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={34} fill={T.text} {...S} />
    {tail === "d" && <path d={`M -16 ${h / 2 - 2} L 0 ${h / 2 + 30} L 18 ${h / 2 - 2} Z`} fill={T.text} stroke={T.ink} strokeWidth={4} strokeLinejoin="round" />}
    {tail === "d" && <path d={`M -12 ${h / 2 - 3} L 14 ${h / 2 - 3}`} stroke={T.text} strokeWidth={6} />}
    {children}
  </g>
);

// ───────── মানুষ (আইকন-মানুষ; (0,0)=পায়ের তলা; উচ্চতা ≈ ২৩৫×s) ─────────
export type PersonProps = {
  pose?: "stand" | "clap" | "cheer" | "point" | "hold"; face?: "smile" | "frown" | "neutral" | "wow";
  skin?: string; cloth?: string; cloth2?: string; hair?: string; hat?: "none" | "crown" | "wig" | "helmet" | "cap" | "bun";
  acc?: ("tie" | "sash" | "cape" | "beard" | "glasses")[]; s?: number; flip?: boolean; dim?: number; glow?: string; tilt?: number; phase?: number;
};
export const Person: React.FC<PersonProps> = ({ pose = "stand", face = "smile", skin = T.skin1, cloth = T.navy2, cloth2 = T.stone, hair = T.hairDark, hat = "none", acc = [], s = 1, flip, dim = 1, glow, tilt = 0, phase = 0 }) => {
  const { t } = useTime();
  const bob = Math.sin(t * 2.4 + phase) * 2.2;
  const clap = pose === "clap" ? Math.abs(Math.sin(t * 9)) * 10 : 0;
  const arm = (x1: number, y1: number, x2: number, y2: number, key: string) => (
    <g key={key}>
      <path d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={T.ink} strokeWidth={26} strokeLinecap="round" />
      <path d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={cloth} strokeWidth={18} strokeLinecap="round" />
      <circle cx={x2} cy={y2} r={11} fill={skin} stroke={T.ink} strokeWidth={3.5} />
    </g>);
  const eyeY = -172;
  return (
    <g transform={`scale(${(flip ? -1 : 1) * s} ${s}) rotate(${tilt})`} opacity={dim}>
      {glow && <circle cx={0} cy={-120} r={210} fill={`url(#g-${glow.replace(/[^a-z0-9]/gi, "")})`} />}
      <g transform={`translate(0 ${bob})`}>
        {acc.includes("cape") && <path d="M -40 -140 L -66 -14 Q 0 6 66 -14 L 40 -140 Z" fill={T.royal} {...S} />}
        <rect x={-23} y={-72} width={19} height={72} rx={9} fill={cloth2} {...S} />
        <rect x={4} y={-72} width={19} height={72} rx={9} fill={cloth2} {...S} />
        {pose === "stand" && <>
          <rect x={-52} y={-136} width={18} height={70} rx={9} fill={cloth} {...S} /><rect x={34} y={-136} width={18} height={70} rx={9} fill={cloth} {...S} />
          <circle cx={-43} cy={-62} r={9} fill={skin} stroke={T.ink} strokeWidth={3} /><circle cx={43} cy={-62} r={9} fill={skin} stroke={T.ink} strokeWidth={3} /></>}
        {hat === "wig" && <g fill={T.wig} {...S} strokeWidth={3}>
          <circle cx={-34} cy={-168} r={17} /><circle cx={34} cy={-168} r={17} /><circle cx={-30} cy={-194} r={19} /><circle cx={30} cy={-194} r={19} /><circle cx={0} cy={-206} r={22} />
          <circle cx={-38} cy={-142} r={13} /><circle cx={38} cy={-142} r={13} /></g>}
        <rect x={-33} y={-142} width={66} height={78} rx={26} fill={cloth} {...S} />
        {acc.includes("sash") && <path d="M -30 -138 L -8 -142 L 33 -78 L 12 -70 Z" fill={T.accent} stroke={T.ink} strokeWidth={3} strokeLinejoin="round" />}
        {acc.includes("tie") && <path d="M -7 -138 L 7 -138 L 10 -104 L 0 -88 L -10 -104 Z" fill={T.crimson} stroke={T.ink} strokeWidth={3} strokeLinejoin="round" />}
        {pose === "clap" && <>{arm(-30, -122, -4 - clap * 0.2, -100, "l")}{arm(30, -122, 4 + clap * 0.2, -100, "r")}</>}
        {pose === "hold" && <>{arm(-30, -122, -10, -96, "l")}{arm(30, -122, 10, -96, "r")}</>}
        {pose === "cheer" && <>{arm(-30, -128, -60, -196, "l")}{arm(30, -128, 60, -196, "r")}</>}
        {pose === "point" && <>
          <rect x={-52} y={-136} width={18} height={70} rx={9} fill={cloth} {...S} />{arm(30, -124, 104, -146, "r")}</>}
        <circle cx={0} cy={-172} r={30} fill={skin} {...S} />
        {hat === "none" && <path d="M -30 -176 Q -30 -208 0 -208 Q 30 -208 30 -176 Q 12 -194 -30 -176 Z" fill={hair} stroke={T.ink} strokeWidth={3} strokeLinejoin="round" />}
        {hat === "bun" && <><path d="M -30 -176 Q -30 -208 0 -208 Q 30 -208 30 -176 Q 12 -194 -30 -176 Z" fill={hair} stroke={T.ink} strokeWidth={3} /><circle cx={0} cy={-214} r={11} fill={hair} {...S} strokeWidth={3} /></>}
        {hat === "wig" && <path d="M -30 -180 Q -10 -200 0 -192 Q 10 -200 30 -180 Q 10 -188 0 -184 Q -10 -188 -30 -180 Z" fill={T.wig} stroke={T.ink} strokeWidth={3} strokeLinejoin="round" />}
        {hat === "crown" && <g transform="translate(0 -216)"><Crown s={0.9} /></g>}
        {hat === "helmet" && <g><path d="M -34 -176 Q -34 -218 0 -218 Q 34 -218 34 -176 Z" fill={T.steel} {...S} /><rect x={-38} y={-182} width={76} height={9} rx={4} fill={T.stone} {...S} strokeWidth={3} /><path d="M 0 -218 L 0 -236" stroke={T.crimson} strokeWidth={8} strokeLinecap="round" /></g>}
        {hat === "cap" && <g><ellipse cx={0} cy={-200} rx={38} ry={13} fill={T.teal} {...S} /><path d="M -22 -202 Q 0 -230 22 -202 Z" fill={T.teal} {...S} /></g>}
        {acc.includes("beard") && <path d="M -26 -164 Q -22 -122 0 -122 Q 22 -122 26 -164 Q 0 -146 -26 -164 Z" fill={T.wig} stroke={T.ink} strokeWidth={3} strokeLinejoin="round" />}
        <circle cx={-10} cy={eyeY} r={3.6} fill={T.ink} /><circle cx={10} cy={eyeY} r={3.6} fill={T.ink} />
        {acc.includes("glasses") && <g stroke={T.ink} strokeWidth={3} fill="none"><circle cx={-10} cy={eyeY} r={9} /><circle cx={10} cy={eyeY} r={9} /><path d="M -1 -172 L 1 -172" /></g>}
        {face === "smile" && <path d="M -9 -158 Q 0 -150 9 -158" stroke={T.ink} strokeWidth={3.5} fill="none" strokeLinecap="round" />}
        {face === "frown" && <><path d="M -9 -152 Q 0 -160 9 -152" stroke={T.ink} strokeWidth={3.5} fill="none" strokeLinecap="round" /><path d="M -17 -183 L -5 -179 M 17 -183 L 5 -179" stroke={T.ink} strokeWidth={3.5} strokeLinecap="round" /></>}
        {face === "neutral" && <path d="M -8 -155 L 8 -155" stroke={T.ink} strokeWidth={3.5} strokeLinecap="round" />}
        {face === "wow" && <circle cx={0} cy={-153} r={6} fill={T.ink} />}
      </g>
    </g>
  );
};
export const Bust: React.FC<{ s?: number; cloth?: string; skin?: string; hair?: string; face?: "smile" | "neutral" | "wow" }> = ({ s = 1, cloth = T.navy2, skin = T.skin1, hair = T.hairDark, face = "smile" }) => (
  <g transform={`scale(${s})`}>
    <path d="M -36 0 Q -36 -40 0 -40 Q 36 -40 36 0 Z" fill={cloth} {...S} strokeWidth={3.5} />
    <circle cx={0} cy={-62} r={22} fill={skin} {...S} strokeWidth={3.5} />
    <path d="M -22 -64 Q -22 -88 0 -88 Q 22 -88 22 -64 Q 8 -76 -22 -64 Z" fill={hair} stroke={T.ink} strokeWidth={2.5} />
    <circle cx={-7} cy={-62} r={2.6} fill={T.ink} /><circle cx={7} cy={-62} r={2.6} fill={T.ink} />
    {face === "smile" && <path d="M -6 -53 Q 0 -47 6 -53" stroke={T.ink} strokeWidth={2.6} fill="none" strokeLinecap="round" />}
    {face === "neutral" && <path d="M -5 -52 L 5 -52" stroke={T.ink} strokeWidth={2.6} strokeLinecap="round" />}
    {face === "wow" && <circle cx={0} cy={-52} r={3.5} fill={T.ink} />}
  </g>
);

// ───────── ভবন ও জায়গা ─────────
export const Palace: React.FC<{ s?: number; gold?: boolean; lit?: number; dim?: number; flag?: boolean }> = ({ s = 1, gold, lit = 0.5, dim = 1, flag = true }) => {
  const { t } = useTime();
  const trim = gold ? T.accent : T.steel;
  const win = (x: number, y: number, k: number) => {
    const on = hash(k) < lit; const fl = on ? 0.75 + 0.25 * Math.sin(t * 3 + k) : 1;
    return <rect key={k} x={x} y={y} width={22} height={34} rx={5} fill={on ? T.winOn : T.winOff} opacity={fl} />;
  };
  const wins: React.ReactNode[] = [];
  let k = 0;
  [-300, -265, -230, -195, -160, 160, 195, 230, 265, 300].forEach((x) => { [-120, -60].forEach((y) => wins.push(win(x - 11, y, k++))); });
  [-80, -40, 0, 40, 80].forEach((x) => { [-200, -150, -100].forEach((y) => wins.push(win(x - 11, y, k++))); });
  return (
    <g transform={`scale(${s})`} opacity={dim}>
      <rect x={-340} y={-150} width={230} height={150} fill={T.wall} {...S} /><rect x={110} y={-150} width={230} height={150} fill={T.wall} {...S} />
      <path d="M -350 -150 L -325 -184 L -105 -184 L -105 -150 Z" fill={T.roof} {...S} /><path d="M 350 -150 L 325 -184 L 105 -184 L 105 -150 Z" fill={T.roof} {...S} />
      <rect x={-130} y={-230} width={260} height={230} fill={T.wall} {...S} />
      <path d="M -150 -230 L -96 -300 L 96 -300 L 150 -230 Z" fill={T.roof} {...S} />
      <rect x={-34} y={-336} width={68} height={38} fill={T.wall} {...S} /><path d="M -44 -336 L 0 -380 L 44 -336 Z" fill={T.roof} {...S} />
      <rect x={-130} y={-236} width={260} height={10} fill={trim} stroke={T.ink} strokeWidth={3} />
      <rect x={-340} y={-156} width={230} height={8} fill={trim} stroke={T.ink} strokeWidth={3} /><rect x={110} y={-156} width={230} height={8} fill={trim} stroke={T.ink} strokeWidth={3} />
      {wins}
      <path d="M -30 0 L -30 -62 Q 0 -96 30 -62 L 30 0 Z" fill={T.ink} stroke={trim} strokeWidth={4} />
      {[-110, 110].map((x) => <rect key={x} x={x - 6} y={-228} width={12} height={228} fill={trim} opacity={0.5} />)}
      {flag && <g><path d="M 0 -380 L 0 -420" stroke={T.ink} strokeWidth={4} /><path d={`M 0 -420 Q 14 ${-428 + Math.sin(t * 4) * 4} 30 -418 L 30 -400 Q 14 ${-408 + Math.sin(t * 4) * 4} 0 -402 Z`} fill={T.accent} {...S} strokeWidth={3} /></g>}
    </g>
  );
};
export const Prison: React.FC<{ s?: number; face?: boolean; glow?: boolean }> = ({ s = 1, face = true, glow }) => {
  const { t } = useTime();
  return (
    <g transform={`scale(${s})`}>
      {glow && <circle cx={0} cy={-300} r={420} fill={`url(#g-${T.bad.replace(/[^a-z0-9]/gi, "")})`} opacity={0.6} />}
      <path d="M -520 0 L -120 -400 L 60 -190 L 200 -330 L 520 0 Z" fill={T.mount1} {...S} />
      <path d="M -120 -400 L -80 -350 L -120 -330 L -150 -362 Z" fill={T.text} opacity={0.75} />
      <path d="M 200 -330 L 232 -290 L 200 -274 L 172 -296 Z" fill={T.text} opacity={0.75} />
      <path d="M -300 0 L -40 -250 L 160 -90 L 360 0 Z" fill={T.mount2} {...S} />
      <rect x={-78} y={-520} width={156} height={520} fill={T.stone} {...S} />
      {[-78, -34, 10, 54].map((x) => <rect key={x} x={x} y={-556} width={34} height={40} fill={T.stone} {...S} />)}
      <rect x={-78} y={-300} width={156} height={10} fill={T.ink} opacity={0.25} /><rect x={-78} y={-180} width={156} height={10} fill={T.ink} opacity={0.25} />
      <rect x={-28} y={-440} width={56} height={84} rx={8} fill={T.ink} stroke={T.steel} strokeWidth={4} />
      {face && <g transform="translate(0 -386)"><circle r={19} fill={T.skin1} stroke={T.ink} strokeWidth={3} /><circle cx={-6} cy={-2} r={2.4} fill={T.ink} /><circle cx={6} cy={-2} r={2.4} fill={T.ink} /><path d="M -5 8 Q 0 4 5 8" stroke={T.ink} strokeWidth={2.4} fill="none" strokeLinecap="round" /></g>}
      {[-14, 0, 14].map((x) => <path key={x} d={`M ${x} -440 L ${x} -356`} stroke={T.steel} strokeWidth={4} />)}
      <circle cx={0} cy={-398} r={5} fill={T.bad} opacity={0.6 + 0.4 * Math.sin(t * 3)} />
      <path d="M -26 0 L -26 -70 Q 0 -100 26 -70 L 26 0 Z" fill={T.ink} stroke={T.steel} strokeWidth={4} />
    </g>
  );
};
export const Skyline: React.FC<{ y: number; o?: number; seed?: number }> = ({ y, o = 0.5, seed = 0 }) => (
  <g opacity={o}>{Array.from({ length: 9 }, (_, i) => { const w = 90 + hash(i + seed) * 70, h = 160 + hash(i * 3 + seed) * 280; const x = -40 + i * 130;
    return <g key={i}><rect x={x} y={y - h} width={w} height={h} rx={6} fill={T.surfaceHi} stroke={T.ink} strokeWidth={3} />
      {Array.from({ length: Math.floor(h / 60) }, (_, r) => <rect key={r} x={x + 14} y={y - h + 16 + r * 60} width={w - 28} height={22} rx={4} fill={hash(i * 9 + r + seed) < 0.3 ? T.winOn : T.winOff} />)}</g>; })}</g>
);
export const Ground: React.FC<{ y: number; h?: number; color?: string }> = ({ y, h = 200, color = T.surface }) => (
  <g><rect x={-10} y={y} width={1100} height={h} fill={color} /><rect x={-10} y={y} width={1100} height={5} fill={T.border} /></g>
);
export const Firework: React.FC<{ x: number; y: number; at: number; color?: string; r?: number; period?: number }> = ({ x, y, at, color = T.accent, r = 110, period = 2.4 }) => {
  const { t } = useTime();
  if (t < at) return null;
  const k = (((t - at) % period) + period) % period / period;
  const e = ease3(k * 1.6); const o = 1 - clamp01((k - 0.35) / 0.65);
  return <g opacity={o}>{Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; const c = Math.cos(a), sn = Math.sin(a);
    return <g key={i}><line x1={x + c * r * e * 0.55} y1={y + sn * r * e * 0.55} x2={x + c * r * e} y2={y + sn * r * e} stroke={color} strokeWidth={5} strokeLinecap="round" />
      <circle cx={x + c * r * e * 1.12} cy={y + sn * r * e * 1.12} r={4} fill={color} /></g>; })}</g>;
};
export const Table: React.FC<{ w?: number; color?: string }> = ({ w = 700, color = T.hairBrown }) => (
  <g><rect x={-w / 2} y={0} width={w} height={26} rx={8} fill={color} {...S} /><rect x={-w / 2 + 40} y={26} width={18} height={80} fill={color} {...S} /><rect x={w / 2 - 58} y={26} width={18} height={80} fill={color} {...S} /></g>
);
export const Bunting: React.FC<{ x1: number; x2: number; y: number; sag?: number; colors?: string[]; n?: number }> = ({ x1, x2, y, sag = 50, colors = [T.accent, T.data, T.bad, T.good], n = 9 }) => {
  const { t } = useTime();
  return <g>{Array.from({ length: n }, (_, i) => { const u = (i + 0.5) / n; const x = x1 + (x2 - x1) * u; const yy = y + Math.sin(u * Math.PI) * sag + Math.sin(t * 3 + i) * 2;
    return <path key={i} d={`M ${x - 18} ${yy - 4} L ${x + 18} ${yy - 4} L ${x} ${yy + 34} Z`} fill={colors[i % colors.length]} stroke={T.ink} strokeWidth={2.5} strokeLinejoin="round" />; })}
    <path d={`M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + sag * 2} ${x2} ${y}`} stroke={T.ink} strokeWidth={3} fill="none" opacity={0.7} /></g>;
};
export const Planet: React.FC<{ r?: number }> = ({ r = 90 }) => (
  <g><clipPath id="pclip"><circle r={r} /></clipPath>
    <circle r={r} fill={T.warn} />
    <g clipPath="url(#pclip)">{[-0.62, -0.3, 0.05, 0.4, 0.7].map((k, i) => <rect key={i} x={-r} y={r * k - r * 0.1} width={r * 2} height={r * 0.2} fill={i % 2 ? T.cream : T.crimson} opacity={0.55} />)}</g>
    <circle r={r} fill="none" stroke={T.ink} strokeWidth={5} /></g>
);
export const Telescope: React.FC<{ s?: number; ang?: number }> = ({ s = 1, ang = -48 }) => (
  <g transform={`scale(${s})`}>
    <path d="M 0 0 L -50 120 M 0 0 L 50 120 M 0 0 L 0 120" stroke={T.ink} strokeWidth={14} strokeLinecap="round" /><path d="M 0 0 L -50 120 M 0 0 L 50 120 M 0 0 L 0 120" stroke={T.hairBrown} strokeWidth={7} strokeLinecap="round" />
    <g transform={`rotate(${ang})`}><rect x={-14} y={-30} width={190} height={46} rx={10} fill={T.accent} {...S} /><rect x={170} y={-40} width={50} height={66} rx={10} fill={T.steel} {...S} /><rect x={30} y={-34} width={14} height={54} fill={T.hairBrown} stroke={T.ink} strokeWidth={3} /></g>
  </g>
);
export const Spot: React.FC<{ x: number; y: number; w: number; h: number; color?: string; o?: number }> = ({ x, y, w, h, color = T.accent, o = 0.22 }) => (
  <path d={`M ${x - 20} ${y} L ${x + 20} ${y} L ${x + w / 2} ${y + h} L ${x - w / 2} ${y + h} Z`} fill={color} opacity={o} />
);
export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; at: number; dur?: number; color?: string; w?: number; dash?: boolean }> = ({ x1, y1, x2, y2, at, dur = 0.6, color = T.flow, w = 6, dash }) => {
  const { t } = useTime(); const p = ease3((t - at) / dur);
  if (p <= 0) return null;
  const len = Math.hypot(x2 - x1, y2 - y1); const a = Math.atan2(y2 - y1, x2 - x1);
  const ex = x1 + (x2 - x1) * p, ey = y1 + (y2 - y1) * p;
  return <g><line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash ? "18 12" : undefined} strokeDashoffset={dash ? -t * 60 : 0} />
    {p > 0.95 && <path d={`M ${x2} ${y2} l ${-26 * Math.cos(a - 0.5)} ${-26 * Math.sin(a - 0.5)} M ${x2} ${y2} l ${-26 * Math.cos(a + 0.5)} ${-26 * Math.sin(a + 0.5)}`} stroke={color} strokeWidth={w} strokeLinecap="round" />}</g>;
};
/** পথ বেয়ে ডট/টোকেন-প্রবাহ */
export const Stream: React.FC<{ x1: number; y1: number; x2: number; y2: number; at: number; until?: number; n?: number; speed?: number; arc?: number; token?: boolean; color?: string; r?: number }> =
  ({ x1, y1, x2, y2, at, until = 1e9, n = 10, speed = 0.45, arc = 0, token = true, color = T.accent, r = 16 }) => {
    const { t } = useTime();
    if (t < at || t > until) return null;
    return <g>{Array.from({ length: n }, (_, i) => { const u = ((((t - at) * speed) + i / n) % 1);
      const x = x1 + (x2 - x1) * u + (hash(i) - 0.5) * 30, y = y1 + (y2 - y1) * u - Math.sin(u * Math.PI) * arc + (hash(i + 9) - 0.5) * 30;
      const o = clamp01(u * 6) * clamp01((1 - u) * 6);
      return <g key={i} transform={`translate(${x} ${y})`} opacity={o}>{token ? <Smile r={r} /> : <circle r={r * 0.5} fill={color} />}</g>; })}</g>;
  };
