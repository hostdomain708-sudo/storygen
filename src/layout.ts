// অনুপাত এক জায়গায়। এই প্রজেক্টের দৃশ্য ৯:১৬-এর স্থানাঙ্কে আঁকা।
export const RATIO = "9:16" as const;
export const RATIOS = {
  "9:16": { w: 1080, h: 1920, margin: 70, tab: { y: 150, h: 62 }, label: { y: 262 }, stage: { top: 280, bottom: 1300 }, caption: { y: 1398, font: 62, pillH: 115 }, reserveFrom: 1500, k: 1 },
} as const;
export const L = RATIOS[RATIO];
