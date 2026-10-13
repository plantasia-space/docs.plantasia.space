// The guest home page's figures (plantasia.space-root, src/components/guest/landing), PLA-523:
// each 2D canvas drawing of that page redrawn in the house style, on the home machine's parts.
//   node build.mjs --out=<root>/public/figures/landing [--preview] [--only=hero,row-i]
// Writes, per figure, <name>-dark.svg, <name>-light.svg and <name>.json, and one runtime.js for all.
// --preview also writes a bare page per figure and theme here (preview-<name>-<theme>.html), for the kit's checks.
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { emit } from "./stage.mjs";
import { hero, heroNarrow } from "./hero.mjs";
import { playground, playgroundNarrow } from "./playground.mjs";
import { small } from "./small.mjs";
import { closing, closingNarrow } from "./closing.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = process.argv.find((a) => a.startsWith("--out="))?.slice(6);
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",");
if (!OUT) { console.error("give --out=<plantasia.space-root>/public/figures/landing"); process.exit(1); }

const FIGURES = [hero, heroNarrow, playground, playgroundNarrow, small, closing, closingNarrow];
for (const make of FIGURES.flat()) {
  const fig = make();
  if (ONLY && !ONLY.includes(fig.name)) continue;
  emit(fig, { out: OUT, preview: process.argv.includes("--preview") ? HERE : null });
}
