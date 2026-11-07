import fs from "fs";
const seg = new Intl.Segmenter("bn", { granularity: "grapheme" });
const glen = (s) => [...seg.segment(s)].length;
const tc = (h, m, s, ms) => (+h) * 3600 + (+m) * 60 + (+s) + (+ms.padEnd(3, "0")) / 1000;
function parseSrt(text) {
  const t = text.replace(/^﻿/, "").replace(/\r/g, "").trim(); const cues = [];
  for (const block of t.split(/\n{2,}/)) {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    const i = lines.findIndex(l => /-->/.test(l)); if (i < 0) continue;
    const m = lines[i].match(/(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)/); if (!m) continue;
    const txt = lines.slice(i + 1).join(" ").replace(/\s+/g, " ").trim(); if (!txt) continue;
    cues.push({ s: tc(m[1], m[2], m[3], m[4]), e: tc(m[5], m[6], m[7], m[8]), text: txt });
  }
  return cues;
}
const corr = [
  { from: "হুকের", to: "ফুকের", cue: 35, time: "02:30", evidence: "নাম অন্য সব জায়গায় 'ফুকে/ফুকের'; স্পষ্ট বানান-ভুল", tier: "ক" },
];
const cues = parseSrt(fs.readFileSync("public/original.srt", "utf8"));
for (const c of cues) for (const r of corr) if (c.text.includes(r.from)) c.text = c.text.replace(r.from, r.to);
// SRT-only: প্রতিটি cue-র ভেতরে গ্রাফিম-অনুপাতে
const words = [];
for (const c of cues) {
  const ws = c.text.split(" ").filter(Boolean); const total = ws.reduce((a, w) => a + glen(w), 0) || 1; let t = c.s;
  for (const w of ws) { const d = (c.e - c.s) * glen(w) / total; words.push({ w, s: +t.toFixed(3), e: +(t + d).toFixed(3) }); t += d; }
}
fs.writeFileSync("src/timing.json", JSON.stringify({ duration: 164.754, words, cues }, null, 1));
fs.writeFileSync("src/corrections.json", JSON.stringify({ mode: "SRT-only (ASR মডেল নামানো যায়নি)", corrections: corr, suspects: [
 { time: "00:22", note: "'সাত পদের খাবার' — সংখ্যা ASR/স্ক্রিপ্ট দিয়ে নিশ্চিত নয়", tier: "খ" },
 { time: "00:31", note: "'কুড়ি বছর' — সংখ্যা নিশ্চিত করা যায়নি (ভয়েসের কথাই রাখা হয়েছে)", tier: "খ" },
 { time: "01:34", note: "'নিরামিষ পার্টি' — শব্দটা রূপক অর্থে (জৌলুসহীন) ধরা হয়েছে", tier: "খ" },
 { time: "01:48", note: "'ষোলোশো দশ সাল' ও 'চারটা চাঁদ' — SRT-র সংখ্যা অপরিবর্তিত", tier: "খ" } ] }, null, 1));
console.log(words.length, "words");
words.forEach((w, i) => process.stdout.write(`${i}:${w.w}@${w.s.toFixed(2)} `));
