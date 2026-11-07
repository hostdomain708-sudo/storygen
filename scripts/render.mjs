import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
const browserExecutable = process.env.BROWSER || undefined;
const chromiumOptions = { args: ["--no-sandbox"] };
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comp = await selectComposition({ serveUrl, id: "Main", browserExecutable, chromiumOptions });
await renderMedia({ composition: comp, serveUrl, codec: "h264", crf: 18, outputLocation: "out/video.mp4", browserExecutable, chromiumOptions, concurrency: 4, onProgress: ({ progress }) => { if (Math.round(progress * 1000) % 50 === 0) console.log(Math.round(progress * 100) + "%"); } });
console.log("DONE");
