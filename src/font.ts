import { staticFile, delayRender, continueRender } from "remotion";
export const bn = "HindSiliguriLocal, 'Hind Siliguri', sans-serif";
const handle = delayRender("load-font");
const mk = (weight: string, subset: string, range: string) =>
  new FontFace("HindSiliguriLocal", `url(${staticFile(`fonts/hs-${subset}-${weight}.woff2`)})`, { weight, unicodeRange: range }).load();
Promise.all(["600", "700"].flatMap((w) => [
  mk(w, "bengali", "U+0951-0952,U+0964-0965,U+0980-09FE,U+200C-200D,U+20B9,U+25CC"),
  mk(w, "latin", "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"),
])).then((fs) => { fs.forEach((f) => (document as any).fonts.add(f)); continueRender(handle); })
  .catch(() => continueRender(handle));
