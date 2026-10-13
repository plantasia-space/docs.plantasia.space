// The Orbiter as a console of its craft, for the Interact page (docs.plantasia.space, ORB-632).
// A screen shows the World, its ring and its Moon. Three knobs in a row are the axes X, Y and Z, each with
// its toggle in front of it. A rack holds the instrument and the effects, in the order the sound runs
// through them. Three keys are the dimensions I, II and III.
// Numbers are the app's own: an axis is a rotation from -180° to 180° that rests at 0°
// (orbiters/src/ui/react/regions/XYZControls.tsx), and its knob is the design library's (../shared/knob.mjs).
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../kit/iso-kit.mjs";
import { kitScript } from "../../scripts/inline-kit.mjs";
import { KNOB_SOURCE, knobFace, knobWedge, knobNeedle } from "../shared/knob.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
// Writes one ES module, <slot>/static/figures/orbiters/console.js, which the docs' <IsoFigure> loads:
// it exports the drawing (`svg`) and `mount(root, say)`. No card, no text, no background: the page explains.
const OUT = process.argv.find((a) => a.startsWith("--out="))?.slice(6) ?? HERE;
const PREVIEW = process.argv.includes("--preview");

const WIDTH = 640, HEIGHT = 400;

const BODY = { x: -112, y: -100, w: 224, d: 204, r: 9 };
const BODY_H = 16, FOOT_H = 4;
const SCREEN = { x: -100, y: -90, w: 78, d: 86, r: 4 };
const GLASS = k.insetPlan(SCREEN, 5), GLASS_Z = 2.4;
const VIEW_AT = [SCREEN.x + SCREEN.w / 2, SCREEN.y + SCREEN.d / 2, GLASS_Z];
const WORLD_R = 12, RING_R = 24, MOON_AT = 40;
const RACK = { x: -10, y: -92, w: 114, d: 50, r: 2 };
const RACK_TOP = 2.5;
const INSTRUMENT = { x: -4, y: -88, w: 24, d: 42, r: 2 };
const EFFECTS = [36, 62, 88];
const EFFECT_H = 11, PIP_TRAVEL = 22;
const KEYS = [4, 34, 64].map((x) => ({ x, y: -32, w: 24, d: 17, r: 1.5 }));
const KNOBS = [-62, 0, 62], KNOB_Y = 40, KNOB_R = 17, KNOB_H = 8;
const TOGGLE_Y = 82;

const P = k.fitProjection([...k.boxCorners(BODY, -BODY_H - FOOT_H, 0), [INSTRUMENT.x, INSTRUMENT.y, RACK_TOP + 20]], WIDTH, HEIGHT, { pad: 22, azimuth: 45 });
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
// On the console's top, "up" is away from the reader and "right" is to their right.
const RIGHT = [Math.SQRT1_2, -Math.SQRT1_2, 0], UP = [-Math.SQRT1_2, -Math.SQRT1_2, 0];
const faceOf = (x) => ({ o: [x, KNOB_Y, KNOB_H + 0.05], u: RIGHT, v: UP });

function body() {
  const out = [`<path class="iso-halo" d="${k.haloOf(BODY, -BODY_H - FOOT_H, BODY_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(BODY, 22))) out.push(S(k.cylinder(x, y, 7, -BODY_H - FOOT_H, FOOT_H, P, 24), { tone: "mid" }));
  out.push(S(k.slabOf(BODY, -BODY_H, BODY_H, P, 8, 1.4), { tone: "hi", crease: "lo", inner: L(k.sideSeam(BODY, -BODY_H + 5, P, 8), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(BODY, 4), 0, P), { tone: "faint" }));
  out.push(D(k.corners(BODY, 9).map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  return out.join("");
}

function screen() {
  const out = [];
  out.push(S(k.slabOf(SCREEN, 0, GLASS_Z, P, 4, 0.5), { tone: "mid" }));
  out.push(L(k.planOutline(GLASS, GLASS_Z, P, 4), { tone: "mid" }));
  out.push(D(k.corners(SCREEN, 2.6).map(([x, y]) => at([x, y, GLASS_Z])), { size: 0.36, tone: "lo" }));
  return out.join("");
}

function rack() {
  const out = [];
  out.push(S(k.slabOf(RACK, 0, RACK_TOP, P, 3, 0.4), { tone: "mid" }));
  out.push(D(k.corners(RACK, 3).map(([x, y]) => at([x, y, RACK_TOP])), { size: 0.4 }));
  // the line the sound follows, from the instrument through each effect and out of the rack
  const mid = INSTRUMENT.y + INSTRUMENT.d / 2;
  out.push(L(k.lineOnTop([INSTRUMENT.x + INSTRUMENT.w, mid], [RACK.x + RACK.w, mid], RACK_TOP, P), { tone: "mid" }));
  // the instrument: two reels on its lid
  out.push(S(k.slabOf(INSTRUMENT, RACK_TOP, 17, P, 4, 0.6), { tone: "hi", crease: "lo", inner: L(k.sideSeam(INSTRUMENT, RACK_TOP + 13, P, 4), { tone: "faint" }) }));
  const lid = RACK_TOP + 17, cx = INSTRUMENT.x + INSTRUMENT.w / 2;
  out.push(L([-10, 10].map((dy) => k.ring(cx, mid + dy, 6.5, lid, P, 22) + k.ring(cx, mid + dy, 2.2, lid, P, 12)).join(""), { tone: "mid" }));
  out.push(D([-10, 10].map((dy) => at([cx, mid + dy, lid])), { size: 0.45 }));
  return out.join("");
}

// An effect: a box in the rack, with a slot on its lid where its marker rides.
function effect(x) {
  const plan = { x: x - 9, y: INSTRUMENT.y, w: 18, d: INSTRUMENT.d, r: 1.8 }, lid = RACK_TOP + EFFECT_H, mid = plan.y + plan.d / 2;
  return [
    S(k.slabOf(plan, RACK_TOP, EFFECT_H, P, 3, 0.4), { tone: "hi", crease: "lo", inner: L(k.sideSeam(plan, lid - 3, P, 3), { tone: "faint" }) }),
    L(k.planOutline({ x: x - 1.8, y: mid - PIP_TRAVEL / 2 - 3.8, w: 3.6, d: PIP_TRAVEL + 7.6, r: 1.8 }, lid, P, 4), { tone: "lo" }),
  ].join("");
}
const pip = (x) => S(k.slabOf({ x: x - 4, y: INSTRUMENT.y + INSTRUMENT.d / 2 - 3, w: 8, d: 6, r: 1.2 }, RACK_TOP + EFFECT_H, 1.6, P, 3, 0.3), { tone: "hi", lit: true });

// The dimensions: three keys with one, two and three strokes, the first one down and lit.
function keys() {
  return KEYS.map((plan, index) => {
    const top = index === 0 ? 2 : 3.4, cx = plan.x + plan.w / 2;
    const strokes = Array.from({ length: index + 1 }, (_, n) => k.lineOnTop([cx + (n - index / 2) * 4, plan.y + 4.5], [cx + (n - index / 2) * 4, plan.y + plan.d - 4.5], top, P)).join("");
    return S(k.slabOf(plan, 0, top, P, 3, 0.4), { tone: "mid", lit: index === 0 }) + L(strokes, { tone: index === 0 ? "lit" : "mid", free: true });
  }).join("");
}

// A knob's fixed parts: a skirt with its dial marks on the panel, and the cap.
function knobBody(x) {
  const out = [];
  out.push(L(k.ring(x, KNOB_Y, 23, 0, P, 44), { tone: "lo" }));
  const marks = k.radialTicks(x, KNOB_Y, 23, 24, 6, 0, [1.4, 2.8], P);
  out.push(L(marks.minor, { tone: "lo" }), L(marks.major, { tone: "mid" }));
  out.push(S(k.cylinder(x, KNOB_Y, 19, 0, 1.6, P, 44), { tone: "mid" }));
  out.push(S(k.cylinder(x, KNOB_Y, KNOB_R, 1.6, KNOB_H - 1.6, P, 48, 0.5), { tone: "hi", crease: "lo" }));
  out.push(L(k.knurl(x, KNOB_Y, KNOB_R, 1.6, KNOB_H, 30, P), { tone: "lo" }));
  return out.join("");
}
// The toggle in front of each knob: a hexagon, as in the app.
function toggle(x) {
  const ring = Array.from({ length: 6 }, (_, i) => [x + 7.5 * Math.cos((i * Math.PI) / 3 + Math.PI / 4), TOGGLE_Y + 7.5 * Math.sin((i * Math.PI) / 3 + Math.PI / 4)]);
  return S(k.extrude(ring, 0, 2.6, P, { bevel: 0.3 }), { tone: "mid" }) + D([at([x, TOGGLE_Y, 2.6])], { size: 0.5 });
}

// ---- live geometry, shared by the build (rest pose) and the page
const liveSource = `
${KNOB_SOURCE}
const DEG = Math.PI / 180;
const onGlass = (x, y) => iso([VIEW_AT[0] + RIGHT[0] * x + UP[0] * y, VIEW_AT[1] + RIGHT[1] * x + UP[1] * y, VIEW_AT[2]], P);
// The World on the screen: its ring and its Moon turn with the three axes. Behind the World they are hidden.
function sceneOf([ax, ay, az]) {
  const cx = Math.cos(ax * DEG), sx = Math.sin(ax * DEG), cy = Math.cos(ay * DEG), sy = Math.sin(ay * DEG), cz = Math.cos(az * DEG), sz = Math.sin(az * DEG);
  const turn = ([x, y, z]) => {
    [x, y] = [x * cz - y * sz, x * sz + y * cz];
    [x, z] = [x * cy + z * sy, -x * sy + z * cy];
    [y, z] = [y * cx - z * sx, y * sx + z * cx];
    return [x, y, z];
  };
  // the ring rests tipped toward the reader, so that it reads as a ring
  const rest = ([x, y, z]) => [x, y * TIP[0] - z * TIP[1], y * TIP[1] + z * TIP[0]];
  const seen = ([x, y, z]) => z > 0 || x * x + y * y > WORLD_R * WORLD_R;
  const runs = [];
  let run = null;
  for (let i = 0; i <= 72; i++) {
    const a = (i / 72) * Math.PI * 2, p = turn(rest([RING_R * Math.cos(a), RING_R * Math.sin(a), 0]));
    if (seen(p)) { if (!run) runs.push(run = []); run.push(onGlass(p[0], p[1])); } else run = null;
  }
  const moon = turn(rest([RING_R * Math.cos(MOON_AT * DEG), RING_R * Math.sin(MOON_AT * DEG), 0]));
  return { ring: runs.map((points) => knobPath(points)).join(""), moon: seen(moon) ? onGlass(moon[0], moon[1]) : null };
}
`;
const TIP = [Math.cos((62 * Math.PI) / 180), Math.sin((62 * Math.PI) / 180)];
const consts = `const P = ${JSON.stringify(P)}, VIEW_AT = ${JSON.stringify(VIEW_AT)}, RIGHT = ${JSON.stringify(RIGHT)}, UP = ${JSON.stringify(UP)}, TIP = ${JSON.stringify(TIP)}, WORLD_R = ${WORLD_R}, RING_R = ${RING_R}, MOON_AT = ${MOON_AT}, KNOB_R = ${KNOB_R}, PIP_TRAVEL = ${PIP_TRAVEL}, FACES = ${JSON.stringify(KNOBS.map(faceOf))};`;
const { knobOf, sceneOf } = new Function("iso", `${consts}${liveSource}; return { knobOf, sceneOf };`)(k.iso);
const rest = { knob: KNOBS.map((x) => knobOf(faceOf(x), KNOB_R, 0)), scene: sceneOf([0, 0, 0]) };
const glassPoint = (x, y) => at([VIEW_AT[0] + RIGHT[0] * x + UP[0] * y, VIEW_AT[1] + RIGHT[1] * x + UP[1] * y, VIEW_AT[2]]);
const circleOnGlass = (r, steps) => Array.from({ length: steps }, (_, i) => glassPoint(r * Math.cos((i / steps) * Math.PI * 2), r * Math.sin((i / steps) * Math.PI * 2))).map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("") + "Z";
// the Star, far off in a corner of the screen: a small rose
const star = Array.from({ length: 16 }, (_, i) => { const r = i % 2 ? 2 : 4.6, a = (i / 16) * Math.PI * 2; return glassPoint(21 + r * Math.sin(a), 27 + r * Math.cos(a)); }).map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("") + "Z";

const svg = k.figureSvg({
  width: WIDTH, height: HEIGHT,
  label: "An Orbiter drawn as a console of its craft. A screen shows the World with its ring and its Moon, and a Star far off. Three knobs in a row are the axes X, Y and Z, each with a toggle in front of it. A rack holds the instrument and three effects, joined by a line. Three keys are the dimensions. Turning a knob turns the World on the screen and moves a marker on one effect.",
  body: [
    body(),
    screen(),
    L(star, { tone: "mid" }),
    `<path data-part="ring" class="iso-line" data-tone="hi" data-free="" d="${rest.scene.ring}"/>`,
    `<path class="iso-fill" d="${circleOnGlass(WORLD_R, 40)}"/>` + L(circleOnGlass(WORLD_R, 40), { tone: "hi" }),
    `<circle data-part="moon" class="iso-wire-end" r="2.2" cx="${rest.scene.moon?.[0].toFixed(1) ?? 0}" cy="${rest.scene.moon?.[1].toFixed(1) ?? 0}" style="stroke:var(--anatomy-hi)${rest.scene.moon ? "" : ";display:none"}"/>`,
    rack(),
    ...EFFECTS.map((x, index) => `${effect(x)}<g data-part="pip-${index}">${pip(x)}</g>`),
    keys(),
    ...KNOBS.map((x, index) => knobBody(x) + knobWedge(`wedge-${index}`, rest.knob[index].wedge) + knobFace(faceOf(x), KNOB_R, P, k.iso, k.lineSvg) + knobNeedle(`needle-${index}`, rest.knob[index].needle)),
    ...KNOBS.map(toggle),
  ],
});

const live = `
${consts}
${liveSource}
export function mount(root, say = () => {}) {
const stage = root.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const part = (name) => svg.querySelector('[data-part="' + name + '"]');
const wedges = [0, 1, 2].map((index) => part("wedge-" + index)), needles = [0, 1, 2].map((index) => part("needle-" + index)), pips = [0, 1, 2].map((index) => part("pip-" + index));
const ring = part("ring"), moon = part("moon");
let said = "";
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v) => Math.min(180, Math.max(-180, v));
// The tour turns one axis at a time.
const TOUR = [[0, 0, 0], [70, 0, 0], [-50, 0, 0], [-50, 80, 0], [-50, -40, 0], [-50, -40, 120], [-50, -40, -90], [0, 0, 0]];
const now = [0, 0, 0], goal = [0, 0, 0];
let frame = 0, last = 0, clock = 0, touring = !still.matches, visible = false, idle = 0;
function draw() {
  now.forEach((value, index) => {
    const knob = knobOf(FACES[index], KNOB_R, value);
    wedges[index].setAttribute("d", knob.wedge);
    needles[index].setAttribute("d", knob.needle);
    pips[index].setAttribute("transform", translateAlong(P, [0, (-value / 360) * PIP_TRAVEL, 0]));
  });
  const scene = sceneOf(now);
  ring.setAttribute("d", scene.ring);
  moon.style.display = scene.moon ? "" : "none";
  if (scene.moon) { moon.setAttribute("cx", scene.moon[0].toFixed(1)); moon.setAttribute("cy", scene.moon[1].toFixed(1)); }
  const text = axesReadout(now);
  if (said !== text) { said = text; say(text); }
  if (!touring && stage.getAttribute("aria-valuetext") !== text) { stage.setAttribute("aria-valuenow", String(Math.round(now[0]))); stage.setAttribute("aria-valuetext", text); }
}
function tick(time) {
  const dt = last ? Math.min((time - last) / 1000, 1 / 30) : 1 / 60;
  last = time;
  if (touring) { clock += dt; const at = TOUR[Math.floor(clock / 2.4) % TOUR.length]; goal[0] = at[0]; goal[1] = at[1]; goal[2] = at[2]; }
  const ease = still.matches ? 1 : 1 - Math.exp(-dt / 0.36);
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

const stageHtml = `<div class="iso-stage" tabindex="0" role="slider" aria-label="The Orbiter's console: left and right arrows turn X, up and down arrows turn Y, Shift with left and right turns Z, Home brings the three back to 0°" aria-valuemin="-180" aria-valuemax="180" aria-valuenow="0">${svg}</div>`;

writeFileSync(join(OUT, "console.js"), `// Built by figures/src/orbiter-console/build.mjs. Do not edit by hand.\n${kitScript()}\nexport const svg = ${JSON.stringify(stageHtml)};\n${live}`);
console.log("wrote", join(OUT, "console.js"));

// --preview also writes a bare page per theme next to this script, for the capture and line checks.
if (PREVIEW) {
  for (const theme of ["dark", "light"]) {
    const page = k.pageHtml({ title: "The Orbiter's console", theme, body: `<div id="fig" style="max-width:640px;margin:40px auto">${stageHtml}</div>`, script: `${kitScript()}\n${live.replace("export function mount", "function mount")}\nmount(document.getElementById("fig"));` });
    writeFileSync(join(HERE, `preview-${theme}.html`), page);
  }
  console.log("wrote previews");
}
