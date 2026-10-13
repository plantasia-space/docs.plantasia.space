// The Orbiter as its craft, after the Orbiter coin symbol (docs.plantasia.space, ORB-632): a dome over a
// wide ring, a belly and a hatch under it, leaning the way the symbol leans.
// Three tracks run round the ring, one per axis, X outermost. A light rides each track: an axis is a
// rotation from -180° to 180° that rests at 0° (orbiters/src/ui/react/regions/XYZControls.tsx), so a full
// turn of the axis is one lap, and 0° is the point nearest the reader. As on the app's knob, the track is
// lit from the far point, -180°, round to the light.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../kit/iso-kit.mjs";
import * as G from "../../kit/lathe.mjs";
import { kitScript } from "../../scripts/inline-kit.mjs";
import { KNOB_SOURCE } from "../shared/knob.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
// Writes one ES module, <slot>/static/figures/orbiters/saucer.js, which the docs' <IsoFigure> loads:
// it exports the drawing (`svg`) and `mount(root, say)`. No card, no text, no background: the page explains.
const OUT = process.argv.find((a) => a.startsWith("--out="))?.slice(6) ?? HERE;
const PREVIEW = process.argv.includes("--preview");

const WIDTH = 640, HEIGHT = 400;
const RING_R = 84, RING_T = 1.8, BODY_R = 40, DOME_R = 27, DOME_S = 13;
const TRACKS = [75, 63, 51];
// how the craft leans: to the reader's left, and a little toward them so the top of the ring shows
const LEAN = 22, TOWARD = 20;

const CAMERA = { origin: [0, 0], scale: 1, azimuth: 45, elevation: 30 };
const V = G.viewOf(CAMERA), SIDE = [Math.SQRT1_2, -Math.SQRT1_2, 0], UP = G.unit3(G.cross3(SIDE, V).map((n) => -n));
const rad = (deg) => (deg * Math.PI) / 180;
const up = UP[2] > 0 ? UP : G.mul3(UP, -1);
const AXIS = G.unit3(G.add3(G.mul3(G.add3(G.mul3(up, Math.cos(rad(LEAN))), G.mul3(SIDE, -Math.sin(rad(LEAN)))), Math.cos(rad(TOWARD))), G.mul3(V, Math.sin(rad(TOWARD)))));
const F = G.frameAlong([0, 0, 0], AXIS);

const rim = Array.from({ length: 16 }, (_, i) => G.pointOf(F, 0, RING_R + 2, (i / 16) * Math.PI * 2));
const P = k.fitProjection([...rim, G.pointOf(F, DOME_S + DOME_R + 16, 0, 0), G.pointOf(F, -38, 14, 0), G.pointOf(F, -38, 14, Math.PI)], WIDTH, HEIGHT, { pad: 44, azimuth: 45 });
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const NEAR = G.angleToward(F, G.viewOf(P));

function under() {
  const out = [];
  // the hatch, then the belly it opens from
  out.push(S(G.solidOf([[-36, 9], [-28, 14]], F, P), { tone: "mid" }));
  out.push(D(G.dotsOf(F, -32, 11.6, 10, P, { fade: [0.04, 0.42] }), { size: 0.4, tone: "lo" }));
  out.push(S(G.solidOf([[-28, 16], [-24, 26, 1], [-15, 35, 1], [-RING_T, BODY_R]], F, P), { tone: "hi", crease: "lo", inner: L(G.arcOf(F, -15, 35, P, { slope: -1 }), { tone: "faint" }) }));
  out.push(D(G.dotsOf(F, -8, 38, 18, P, { fade: [0.04, 0.42] }), { size: 0.42, tone: "lo" }));
  return out.join("");
}

function ring() {
  const out = [];
  out.push(S(G.solidOf([[-RING_T, RING_R - 3], [-0.4, RING_R, 1], [0.4, RING_R, 1], [RING_T, RING_R - 3]], F, P), { tone: "hi", crease: "lo" }));
  // the deck: plates between the body and the first track, and the three tracks
  out.push(L(G.spokesOf(F, RING_T, BODY_R, TRACKS[2] - 5, 16, P), { tone: "faint" }));
  out.push(L(G.circleOf(F, RING_T, TRACKS[2] - 5, P), { tone: "faint" }));
  out.push(L(TRACKS.map((r) => G.circleOf(F, RING_T, r, P)).join(""), { tone: "lo" }));
  out.push(D(G.dotsOf(F, RING_T, RING_R - 3.6, 32, P, { all: true }), { size: 0.36, tone: "lo" }));
  return out.join("");
}

function over() {
  const out = [];
  out.push(S(G.solidOf([[RING_T, BODY_R], [6, 37, 1], [DOME_S, 31]], F, P), { tone: "hi", crease: "lo" }));
  out.push(D(G.dotsOf(F, 5, 37.6, 20, P, { fade: [0.04, 0.42] }), { size: 0.5, tone: "mid" }));
  out.push(S(G.disc(DOME_S, DOME_S + 1.6, DOME_R + 2.2, F, P), { tone: "mid" }));
  // the dome: a half ball of glass, with the seat of the screen inside it
  const dome = Array.from({ length: 13 }, (_, i) => { const t = (i / 12) * (Math.PI / 2); return [DOME_S + 1.6 + DOME_R * Math.sin(t), Math.max(0.01, DOME_R * Math.cos(t)), 1]; });
  const seam = L(G.arcOf(F, DOME_S + 1.6 + DOME_R * Math.sin(0.5), DOME_R * Math.cos(0.5), P, { slope: -Math.tan(0.5) }), { tone: "faint" });
  out.push(S(G.lathe(dome, F, P, { smooth: true }), { tone: "hi", crease: "none", inner: seam }));
  out.push(S(G.disc(DOME_S + DOME_R + 1.4, DOME_S + DOME_R + 12, 0.8, F, P), { tone: "mid", crease: "none" }));
  out.push(D([at(G.pointOf(F, DOME_S + DOME_R + 12.6, 0, 0))], { size: 1, tone: "hi" }));
  return out.join("");
}

// ---- live geometry, shared by the build (rest pose) and the page
const liveSource = `
${KNOB_SOURCE}
const onRing = (r, angle) => iso([F.o[0] + F.a[0] * RING_T + r * (Math.cos(angle) * F.u[0] + Math.sin(angle) * F.v[0]), F.o[1] + F.a[1] * RING_T + r * (Math.cos(angle) * F.u[1] + Math.sin(angle) * F.v[1]), F.o[2] + F.a[2] * RING_T + r * (Math.cos(angle) * F.u[2] + Math.sin(angle) * F.v[2])], P);
// One track: its lit arc from the far point round to the light, and where the light is.
function trackOf(r, degrees) {
  // a positive turn carries the light to the reader's right, so at 0° the lit half is the left one, as on the knob
  const from = NEAR + Math.PI, to = NEAR - (Math.min(180, Math.max(-180, degrees)) * Math.PI) / 180, points = [];
  for (let a = from; a > to; a -= 0.06) points.push(onRing(r, a));
  points.push(onRing(r, to));
  return { arc: points.length > 1 ? knobPath(points) : "", light: onRing(r, to) };
}
`;
const consts = `const P = ${JSON.stringify(P)}, F = ${JSON.stringify(F)}, RING_T = ${RING_T}, NEAR = ${NEAR}, TRACKS = ${JSON.stringify(TRACKS)};`;
const { trackOf } = new Function("iso", `${consts}${liveSource}; return { trackOf };`)(k.iso);
const rest = TRACKS.map((r) => trackOf(r, 0));

const svg = k.figureSvg({
  width: WIDTH, height: HEIGHT,
  label: "An Orbiter drawn as its craft: a glass dome over a wide ring, with a belly and a hatch under it, leaning to one side. Three tracks run round the ring, for the axes X, Y and Z from the outside in. A light rides each track and goes round it as the axis turns, the track lit behind it.",
  body: [
    under(),
    ring(),
    ...TRACKS.map((_, index) => `<path data-part="arc-${index}" class="iso-line" data-tone="lit" data-free="" d="${rest[index].arc}" style="stroke-width:0.9"/><circle data-part="light-${index}" class="iso-wire-end" r="2.3" cx="${rest[index].light[0].toFixed(1)}" cy="${rest[index].light[1].toFixed(1)}" style="stroke:var(--anatomy-lit);fill:var(--anatomy-lit)"/>`),
    over(),
  ],
});

const live = `
${consts}
${liveSource}
export function mount(root, say = () => {}) {
const stage = root.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const part = (name) => svg.querySelector('[data-part="' + name + '"]');
const arcs = [0, 1, 2].map((index) => part("arc-" + index)), lights = [0, 1, 2].map((index) => part("light-" + index));
let said = "";
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v) => Math.min(180, Math.max(-180, v));
// The tour turns one axis at a time.
const TOUR = [[0, 0, 0], [120, 0, 0], [-90, 0, 0], [-90, 100, 0], [-90, -60, 0], [-90, -60, 150], [-90, -60, -120], [0, 0, 0]];
const now = [0, 0, 0], goal = [0, 0, 0];
let frame = 0, last = 0, clock = 0, touring = !still.matches, visible = false, idle = 0;
function draw() {
  now.forEach((value, index) => {
    const track = trackOf(TRACKS[index], value);
    arcs[index].setAttribute("d", track.arc);
    lights[index].setAttribute("cx", track.light[0].toFixed(1));
    lights[index].setAttribute("cy", track.light[1].toFixed(1));
  });
  const text = axesReadout(now);
  if (said !== text) { said = text; say(text); }
  if (!touring && stage.getAttribute("aria-valuetext") !== text) { stage.setAttribute("aria-valuenow", String(Math.round(now[0]))); stage.setAttribute("aria-valuetext", text); }
}
function tick(time) {
  const dt = last ? Math.min((time - last) / 1000, 1 / 30) : 1 / 60;
  last = time;
  if (touring) { clock += dt; const at = TOUR[Math.floor(clock / 2.6) % TOUR.length]; goal[0] = at[0]; goal[1] = at[1]; goal[2] = at[2]; }
  const ease = still.matches ? 1 : 1 - Math.exp(-dt / 0.4);
  let moving = false;
  for (let i = 0; i < 3; i++) { now[i] += (goal[i] - now[i]) * ease; if (Math.abs(goal[i] - now[i]) < 0.2) now[i] = goal[i]; else moving = true; }
  draw();
  frame = visible && (touring || moving) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
// The reader's setting stays for as long as they are on the figure (pointer over it, or keyboard focus):
// the tour only comes back a while after they have left.
let over = false;
const rest = () => { clearTimeout(idle); if (over || document.activeElement === stage) return; idle = setTimeout(() => { touring = !still.matches; clock = 0; run(); }, 4200); };
const steer = (x, y, z) => { touring = false; goal[0] = clamp(x); goal[1] = clamp(y); goal[2] = clamp(z); rest(); run(); };
stage.addEventListener("pointerenter", () => { over = true; clearTimeout(idle); });
stage.addEventListener("pointerleave", () => { over = false; rest(); });
stage.addEventListener("pointercancel", () => { over = false; rest(); });
stage.addEventListener("blur", rest);
const seen = new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" });
seen.observe(stage);
// Across the figure turns X, up and down turns Y, and Z goes back to 0°: the keys turn it.
stage.addEventListener("pointermove", (event) => {
  const box = svg.getBoundingClientRect();
  if (!box.width || !box.height) return;
  steer(((event.clientX - box.left) / box.width - 0.5) * 400, ((event.clientY - box.top) / box.height - 0.5) * -400, 0);
});
stage.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === "Home") { event.preventDefault(); steer(0, 0, 0); return; }
  const by = (event.shiftKey ? { ArrowRight: [0, 0, 15], ArrowLeft: [0, 0, -15] } : { ArrowRight: [15, 0, 0], ArrowLeft: [-15, 0, 0], ArrowUp: [0, 15, 0], ArrowDown: [0, -15, 0] })[event.key];
  if (!by) return;
  event.preventDefault();
  steer(Math.round(goal[0] + by[0]), Math.round(goal[1] + by[1]), Math.round(goal[2] + by[2]));
});
draw();
return () => { seen.disconnect(); cancelAnimationFrame(frame); clearTimeout(idle); visible = false; };
}
`;

const stageHtml = `<div class="iso-stage" tabindex="0" role="slider" aria-label="The Orbiter's craft: left and right arrows turn X, up and down arrows turn Y, Shift with left and right turns Z, Home brings the three back to 0°" aria-valuemin="-180" aria-valuemax="180" aria-valuenow="0">${svg}</div>`;

writeFileSync(join(OUT, "saucer.js"), `// Built by figures/src/orbiter-saucer/build.mjs. Do not edit by hand.\n${kitScript()}\nexport const svg = ${JSON.stringify(stageHtml)};\n${live}`);
console.log("wrote", join(OUT, "saucer.js"));

// --preview also writes a bare page per theme next to this script, for the capture and line checks.
if (PREVIEW) {
  for (const theme of ["dark", "light"]) {
    const page = k.pageHtml({ title: "The Orbiter's craft", theme, body: `<div id="fig" style="max-width:640px;margin:40px auto">${stageHtml}</div>`, script: `${kitScript()}\n${live.replace("export function mount", "function mount")}\nmount(document.getElementById("fig"));` });
    writeFileSync(join(HERE, `preview-${theme}.html`), page);
  }
  console.log("wrote previews");
}
