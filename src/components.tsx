import React from "react";
import { T } from "./theme";
import { L } from "./layout";
import { bn } from "./font";
import { useTime, usePop } from "./art";
import { words, W, C, clamp01, SPRING } from "./motion";

// ───────── ব্যাকগ্রাউন্ড: পুরো ফ্রেম জুড়ে ─────────
export const Background: React.FC = () => {
  const { t } = useTime();
  return (
    <g>
      <defs>
        <pattern id="dots" width={48} height={48} patternUnits="userSpaceOnUse"><circle cx={24} cy={24} r={1.6} fill="#fff" opacity={0.08} /></pattern>
        <radialGradient id="bgglow"><stop offset="0%" stopColor={T.data} stopOpacity={0.13} /><stop offset="100%" stopColor={T.data} stopOpacity={0} /></radialGradient>
      </defs>
      <rect width={L.w} height={L.h} fill={T.bg} />
      <circle cx={540} cy={800 + Math.sin(t * 0.8) * 14} r={760} fill="url(#bgglow)" />
      <rect width={L.w} height={L.h} fill="url(#dots)" transform={`translate(0 ${(t * 6) % 48})`} />
    </g>
  );
};

/** সিন: [from,to] সেকেন্ডে দৃশ্যমান; ঢোকা ০.৩৫s, বেরোনো ০.৩s (ক্রসফেড) */
export const Scene: React.FC<{ from: number; to: number; fin?: number; fout?: number; children?: React.ReactNode }> = ({ from, to, fin = 0.35, fout = 0.3, children }) => {
  const { t } = useTime();
  if (t < from - 0.01 || t > to + fout) return null;
  const o = clamp01((t - from) / fin) * (1 - clamp01((t - to) / fout));
  return <g opacity={o}>{children}</g>;
};

// ───────── ক্যাপশন (HTML; শব্দে শব্দে হাইলাইট) ─────────
const glen = (s: string) => { try { return [...new (Intl as any).Segmenter("bn", { granularity: "grapheme" }).segment(s)].length; } catch { return s.length; } };
type Chunk = { words: typeof words; start: number; end: number };
function chunkWords(ws: typeof words, maxWords = 3, maxChars = 24, gap = 0.45): Chunk[] {
  const chunks: (typeof words)[] = []; let cur: typeof words = [];
  const flush = () => { if (cur.length) { chunks.push(cur); cur = []; } };
  for (const w of ws) {
    const chars = glen([...cur, w].map((x) => x.w).join(" "));
    if (cur.length && (cur.length >= maxWords || chars > maxChars)) flush();
    if (cur.length && w.s - cur[cur.length - 1].e > gap) flush();
    cur.push(w);
    if (/[।,?!;:—]$/.test(w.w)) flush();
  }
  flush();
  return chunks.map((c) => ({ words: c, start: c[0].s, end: c[c.length - 1].e }));
}
const CHUNKS = chunkWords(words);
function captionState(t: number, hold = 0.35) {
  for (let i = 0; i < CHUNKS.length; i++) {
    const c = CHUNKS[i], next = CHUNKS[i + 1];
    const until = next ? Math.min(next.start, c.end + hold) : c.end + hold;
    if (t >= c.start - 0.02 && t < until) { let active = -1; c.words.forEach((w, k) => { if (t >= w.s) active = k; }); return { chunk: c, active }; }
  }
  return null;
}
export const Caption: React.FC = () => {
  const { t } = useTime();
  const st = captionState(t); if (!st) return null;
  const enter = clamp01((t - st.chunk.start) / 0.12);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: L.caption.y, transform: `translateY(-50%) scale(${0.96 + 0.04 * enter})`, display: "flex", justifyContent: "center", opacity: enter }}>
      <div style={{ display: "flex", gap: 14, padding: "14px 26px", borderRadius: 34, background: T.surfaceHi, border: `1.5px solid ${T.border}`, fontFamily: bn, fontWeight: 700, fontSize: L.caption.font, lineHeight: 1.2, boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}>
        {st.chunk.words.map((w, k) => {
          const on = k === st.active, done = k < st.active;
          return <span key={k} style={{ padding: "4px 14px", borderRadius: 16, background: on ? T.accent : "transparent", color: on ? T.onAccent : done ? T.text : T.muted, opacity: on || done ? 1 : 0.55 }}>{w.w}</span>;
        })}
      </div>
    </div>
  );
};

// ───────── ধাপ-ট্যাব বার (ভয়েসে "তিন ধাপ") ─────────
const TABS = ["১ · জায়গা চেনা", "২ · ছাপিয়ে যাওয়া", "৩ · উল্টো পথ"];
const TAB_AT = [C(85), C(88), C(93)];
const STEP_FROM = [W(95) - 0.1, W(131) - 0.1, W(226) - 0.1, W(293) - 0.1];
const STEP_TITLES = ["মনিবের জায়গা চেনা", "ছাপিয়ে যাওয়া", "উল্টো পথ"];
export const TabBar: React.FC = () => {
  const { t } = useTime();
  if (t < TAB_AT[0]) return null;
  const endFade = 1 - clamp01((t - W(306)) / 0.4);
  if (endFade <= 0) return null;
  let active = -1;
  if (t >= STEP_FROM[0]) active = 0; if (t >= STEP_FROM[1]) active = 1; if (t >= STEP_FROM[2]) active = 2; if (t >= STEP_FROM[3]) active = 3;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: L.tab.y, display: "flex", justifyContent: "center", gap: 12, opacity: endFade }}>
        {TABS.map((label, i) => <Tab key={i} label={label} at={TAB_AT[i]} on={active === i} done={active > i} />)}
      </div>
      {active >= 0 && active < 3 && (
        <div style={{ position: "absolute", left: L.margin, top: L.label.y, transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 14, opacity: endFade }}>
          <div style={{ width: 36, height: 4, background: T.accent, borderRadius: 2 }} />
          <div style={{ fontFamily: bn, fontWeight: 600, fontSize: 28, color: T.muted }}>{`ধাপ ${["১", "২", "৩"][active]} · ${STEP_TITLES[active]}`}</div>
        </div>
      )}
    </>
  );
};
const Tab: React.FC<{ label: string; at: number; on: boolean; done: boolean }> = ({ label, at, on, done }) => {
  const p = usePop(at, SPRING.pop);
  return (
    <div style={{ height: L.tab.h, padding: "0 22px", borderRadius: 31, display: "flex", alignItems: "center", gap: 10, fontFamily: bn, fontWeight: 700, fontSize: 28, whiteSpace: "nowrap",
      background: on ? T.accent : T.surfaceHi, color: on ? T.onAccent : done ? T.text : T.muted, border: `1.5px solid ${on ? T.accent : T.border}`,
      boxShadow: on ? `0 0 26px ${T.accent}66` : "none", opacity: clamp01(p * 1.5), transform: `translateY(${(1 - Math.min(1, p)) * -20}px) scale(${on ? 1.04 : 1})` }}>
      {done && <span style={{ width: 10, height: 10, borderRadius: 5, background: T.accent, display: "inline-block" }} />}{label}
    </div>
  );
};
