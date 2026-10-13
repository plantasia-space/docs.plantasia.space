// The Orbiter's camera, for the Lens module page (docs.plantasia.space, ORB-630).
// Width = the zoom barrel (field of view), Shift = the cross-slide, Amount = the knob on the console.
// Numbers are the module's own: orbiters/src/visual/scene/lensHandle.ts (wide +20°, narrow −14°, shift 12 % of the frame).
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../kit/iso-kit.mjs";
import * as G from "../../kit/lathe.mjs";
import { kitScript } from "../../scripts/inline-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
// Writes one ES module, <slot>/static/figures/orbiters/lens.js, which the docs' <IsoFigure> loads:
// it exports the drawing (`svg`) and `mount(root, say)`. No card, no text, no background: the page explains.
const OUT = process.argv.find((a) => a.startsWith("--out="))?.slice(6) ?? HERE;
const PREVIEW = process.argv.includes("--preview");

const WIDTH = 640, HEIGHT = 400;
const REST_FOV = 42, WIDE = 20, NARROW = 14, SHIFT_FRAC = 0.12;

const PLATE = { x: -140, y: -134, w: 232, d: 224, r: 10 };
const PLATE_H = 10, FOOT_H = 5;
const RAILS = [-106, -64];
const SLIDE = 14;
const CARR = { x: -116, y: -28, w: 68, d: 56, r: 3 };
const BODY = { x: -110, y: -22, w: 54, d: 44, r: 4 };
const BODY_Z = 9, BODY_TOP = 47;
const AXIS_Z = 28, FACE_X = -56;
const E_REST = 14, E_WIDE = 2, E_NARROW = 26;
const HORIZON = { x: 70, y: -76, w: 8, d: 152, r: 1 };
const CON = { x: -46, y: -128, w: 106, d: 44, r: 3 };
const CON_TOP = 8;
const SCR = { x: -40, y: -123, w: 80, d: 30, r: 1.5 };
const WORLD_R = 8.3;
const STARS = [[-29, 9], [-17, -10], [12, 10.5], [24, -5.5], [33, 4], [-35, -5], [6, -12], [-8, 12.5], [30, 12]];
const KNOB = [50, -114];

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [-83, 0, BODY_TOP + 8], [HORIZON.x + 8, 76, 3]],
  WIDTH, HEIGHT, { pad: 26, azimuth: 45 },
);
const F = G.frameOf([FACE_X, 0, AXIS_Z], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

function deck() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 24))) {
    out.push(S(k.cylinder(x, y, 8, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 6, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid", inner: L(k.sideSeam(PLATE, -PLATE_H / 2, P, 8), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 11);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.3, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  return out.join("");
}

function slideway() {
  const out = [];
  // the far end stop first, then rails, ruler, the near end stop last
  const stop = (y) => {
    out.push(S(k.slabOf({ x: -119, y, w: 74, d: 5, r: 1.2 }, 0, 8, P, 3, 0.5), { tone: "mid" }));
    out.push(D([-112, -85, -52].map((x) => at([x, y + 2.5, 8])), { size: 0.45 }));
  };
  stop(-50);
  for (const x of RAILS) {
    out.push(S(k.slabOf({ x: x - 3, y: -45, w: 6, d: 90, r: 1 }, 0, 3, P, 3, 0.4), { tone: "mid" }));
    out.push(D([-40, 40].map((y) => at([x, y, 3])), { size: 0.4 }));
  }
  const strip = { x: -44, y: -44, w: 7, d: 88, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(-40, 40, 4, 5, strip.x + 0.8, 0.6, [2, 3.6], P, "y");
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 5.4, -42, 0.6]), at([strip.x + 5.4, 42, 0.6])], { size: 0.4 }));
  return { back: out.join(""), front: (() => { out.length = 0; stop(45); return out.join(""); })() };
}

function horizon() {
  const out = [];
  out.push(S(k.slabOf(HORIZON, 0, 2.4, P, 3, 0.4), { tone: "mid" }));
  const ticks = k.topTicks(-72, 72, 6, 5, HORIZON.x + 0.6, 2.4, [2.4, 4.4], P, "y");
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([HORIZON.x + 6.4, -74, 2.4]), at([HORIZON.x + 6.4, 74, 2.4])], { size: 0.45 }));
  return out.join("");
}

function consoleBox() {
  const out = [];
  out.push(S(k.slabOf(CON, 0, CON_TOP, P, 5, 0.8), { tone: "mid", inner: L(k.sideSeam(CON, 2.2, P, 5), { tone: "faint" }) }));
  out.push(S(k.slabOf(k.insetPlan(SCR, -1.8), CON_TOP, 0.8, P, 3, 0.3), { tone: "mid", crease: "lo" }));
  out.push(L(k.planOutline(SCR, CON_TOP + 0.8, P, 3), { tone: "lo" }));
  out.push(D(k.corners(k.insetPlan(SCR, -1.8), 1.3).map(([x, y]) => at([x, y, CON_TOP + 0.8])), { size: 0.35, tone: "lo" }));
  // label plate with three rule lines (printed text)
  const tag = { x: -40, y: -90.6, w: 24, d: 3.6, r: 0.6 };
  out.push(S(k.slabOf(tag, CON_TOP, 0.4, P, 2), { tone: "lo", crease: "none" }));
  out.push(L([0.9, 1.8, 2.7].map((dy, i) => k.lineOnTop([tag.x + 1.5, tag.y + dy], [tag.x + (i === 2 ? 12 : 20), tag.y + dy], CON_TOP + 0.4, P)).join(""), { tone: "lo", free: true }));
  // the Amount knob
  out.push(S(k.cylinder(KNOB[0], KNOB[1], 5.2, CON_TOP, 1, P, 28), { tone: "lo" }));
  out.push(S(k.cylinder(KNOB[0], KNOB[1], 4.2, CON_TOP + 1, 4.4, P, 30, 0.4), { tone: "mid" }));
  out.push(L(k.knurl(KNOB[0], KNOB[1], 4.2, CON_TOP + 1, CON_TOP + 5.4, 26, P), { tone: "lo" }));
  const marks = k.radialTicks(KNOB[0], KNOB[1], 6.2, 20, 5, CON_TOP, [0.9, 1.6], P, -Math.PI * 0.75, Math.PI * 1.5);
  out.push(L(marks.minor, { tone: "lo" }), L(marks.major, { tone: "mid" }));
  // two small status lamps
  out.push(L([[47, -96], [53, -96]].map(([x, y]) => k.ring(x, y, 1.5, CON_TOP, P, 14)).join(""), { tone: "lo" }));
  out.push(D([[47, -96], [53, -96]].map(([x, y]) => at([x, y, CON_TOP])), { size: 0.5, tone: "mid" }));
  return out.join("");
}

function carriage() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(CARR, 3), 3, 0.1, P)}" style="filter:blur(4px)"/>`];
  // bushing blocks riding the rails
  for (const [x, y] of byDepth(RAILS.flatMap((x) => [[x, -20], [x, 20]]))) out.push(S(k.slabOf({ x: x - 5, y: y - 5, w: 10, d: 10, r: 1.2 }, 1.2, 3.4, P, 3, 0.3), { tone: "mid" }));
  out.push(S(k.slabOf(CARR, 4, 5, P, 5, 0.6), { tone: "mid" }));
  out.push(D(k.corners(CARR, 4).map(([x, y]) => at([x, y, 9])), { size: 0.42 }));
  out.push(L(k.planOutline(k.insetPlan(CARR, 2.6), 9, P, 4), { tone: "faint" }));
  // the pointer that reads the ruler
  out.push(S(k.slabOf({ x: CARR.x + CARR.w - 0.5, y: -1.4, w: 6.5, d: 2.8, r: 0.8 }, 4.6, 1.2, P, 2), { tone: "hi", crease: "none" }));
  out.push(L(k.lineOnTop([CARR.x + CARR.w, 0], [CARR.x + CARR.w + 5.6, 0], 5.8, P), { tone: "hi", free: "end" }));
  // camera body
  out.push(S(k.slabOf(BODY, BODY_Z, 3, P, 5, 0.5), { tone: "mid" }));
  out.push(S(k.slabOf(k.insetPlan(BODY, 1), BODY_Z + 3, BODY_TOP - BODY_Z - 3, P, 6, 1.1), { tone: "hi", crease: "lo", inner: L(k.sideSeam(k.insetPlan(BODY, 1), BODY_TOP - 7, P, 6), { tone: "faint" }) + L(k.sideSeam(k.insetPlan(BODY, 1), BODY_Z + 9, P, 6), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(BODY, 5), BODY_TOP, P, 4), { tone: "faint" }));
  out.push(D(k.corners(BODY, 8).map(([x, y]) => at([x, y, BODY_TOP])), { size: 0.42 }));
  // top: hot shoe, finder dome, antenna stub
  const shoe = { x: -98, y: -9, w: 18, d: 18, r: 1.5 };
  out.push(S(k.slabOf(shoe, BODY_TOP, 1.6, P, 3, 0.3), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(shoe, 3), BODY_TOP + 1.6, P, 2), { tone: "lo" }));
  out.push(S(k.cylinder(-70, 9, 4.4, BODY_TOP, 1.4, P, 24), { tone: "mid" }));
  out.push(S(k.cylinder(-70, 9, 3, BODY_TOP + 1.4, 2.2, P, 22, 0.4), { tone: "hi" }));
  out.push(S(k.cylinder(-70, -11, 1.5, BODY_TOP, 1, P, 14), { tone: "mid" }));
  out.push(S(k.cylinder(-70, -11, 0.7, BODY_TOP + 1, 9, P, 10), { tone: "mid", crease: "none" }));
  out.push(D([at([-70, -11, BODY_TOP + 10])], { size: 0.9, tone: "hi" }));
  // +y side: a port and a service hatch
  out.push(L(k.sideRing([-98, BODY.y + BODY.d - 1, 22], 2.6, "x", P, 18), { tone: "lo" }));
  out.push(D([at([-98, BODY.y + BODY.d - 1, 22])], { size: 0.5 }));
  out.push(L(k.sideRing([-88, BODY.y + BODY.d - 1, 22], 2.6, "x", P, 18), { tone: "lo" }));
  out.push(D([at([-88, BODY.y + BODY.d - 1, 22])], { size: 0.5 }));
  return out.join("");
}

function barrelFixed() {
  const out = [];
  out.push(S(G.disc(0, 3, 16.5, F, P), { tone: "mid" }));
  out.push(D(G.dotsOf(F, 3, 14.6, 10, P, { all: true }), { size: 0.4, tone: "lo" }));
  out.push(S(G.disc(3, 10, 13, F, P), { tone: "mid" }));
  out.push(S(G.disc(10, 20, 14.2, F, P), { tone: "mid" }));
  out.push(k.fadedSvg(G.ribsOf(F, 10.6, 19.4, 14.2, 34, P, { fade: [0.06, 0.5] }), { tone: "lo" }));
  out.push(S(G.disc(20, 26, 13, F, P), { tone: "mid", inner: L(G.arcOf(F, 23, 13, P), { tone: "faint" }) }));
  out.push(L(G.circleOf(F, 26, 11.5, P), { tone: "lo" }));
  return out.join("");
}

function barrelMoving() {
  const out = [];
  out.push(S(G.disc(-2, 26, 11, F, P), { tone: "hi", crease: "lo", inner: L(G.arcOf(F, 20, 11, P), { tone: "faint" }) + L(G.arcOf(F, 14, 11, P), { tone: "faint" }) + L(G.arcOf(F, 8, 11, P), { tone: "faint" }) }));
  out.push(S(G.disc(26, 30, 12.6, F, P), { tone: "hi", crease: "lo" }));
  out.push(L(G.circleOf(F, 30, 10.4, P), { tone: "mid" }));
  out.push(L(G.circleOf(F, 30, 7.6, P), { tone: "lit" }));
  out.push(L(G.circleOf(F, 30, 3.2, P), { tone: "mid" }));
  out.push(D(G.dotsOf(F, 30, 11.5, 6, P, { all: true }), { size: 0.34, tone: "lo" }));
  return out.join("");
}

const clipD = G.disc(26, 26 + E_NARROW + 6, 13.4, F, P).fill;
const way = slideway();

// ---- live geometry, shared by the build (rest pose) and the page
const liveSource = `
const fovOf = (w) => REST_FOV + w * (w >= 0 ? WIDE : NARROW);
const extOf = (w) => E_REST + (w >= 0 ? w * (E_WIDE - E_REST) : -w * (E_NARROW - E_REST));
const tanHalf = (deg) => Math.tan((deg * Math.PI) / 360);
function poseOf(w, s) {
  const fov = fovOf(w), e = extOf(w), sy = s * SLIDE;
  const ax = FACE_X + 30 + e;
  const half = (HORIZON_X - ax) * tanHalf(fov);
  const cone = lineOnTop([ax, sy], [HORIZON_X, sy - half], 0, P) + lineOnTop([ax, sy], [HORIZON_X, sy + half], 0, P);
  const zoom = tanHalf(REST_FOV) / tanHalf(fov);
  const cx = SCR.x + SCR.w / 2 + s * SHIFT_FRAC * SCR.w, cy = SCR.y + SCR.d / 2;
  const world = ring(cx, cy, WORLD_R * zoom, SCR_Z, P, 40);
  const stars = STARS.map(([x, y]) => [cx + x * zoom, cy + y * zoom]).filter(([x, y]) => x > SCR.x + 1 && x < SCR.x + SCR.w - 1 && y > SCR.y + 1 && y < SCR.y + SCR.d - 1).map(([x, y]) => iso([x, y, SCR_Z], P));
  return { fov, e, sy, apex: iso([ax, sy, 0], P), cone, world, stars };
}
const sign = (n, digits) => (n > 0 ? "+" : n < 0 ? "−" : "") + Math.abs(n).toFixed(digits);
function readoutOf(w, s) {
  const turn = fovOf(w) - REST_FOV;
  const view = Math.round(Math.abs(turn)) === 0 ? "own view" : (turn > 0 ? "opens " : "closes ") + Math.abs(turn).toFixed(0) + "°";
  const slide = s * SHIFT_FRAC * 100;
  const side = Math.round(Math.abs(slide)) === 0 ? "centred" : Math.abs(slide).toFixed(0) + " % " + (slide > 0 ? "right" : "left");
  return "Width " + sign(w * 100, 0) + " % · " + view + " · Shift " + sign(s * 100, 0) + " % · " + side;
}
`;
const consts = `const P = ${JSON.stringify(P)}, REST_FOV = ${REST_FOV}, WIDE = ${WIDE}, NARROW = ${NARROW}, SHIFT_FRAC = ${SHIFT_FRAC}, SLIDE = ${SLIDE}, FACE_X = ${FACE_X}, E_REST = ${E_REST}, E_WIDE = ${E_WIDE}, E_NARROW = ${E_NARROW}, HORIZON_X = ${HORIZON.x}, SCR = ${JSON.stringify(SCR)}, SCR_Z = ${CON_TOP + 0.8}, WORLD_R = ${WORLD_R}, STARS = ${JSON.stringify(STARS)};`;
const { poseOf, readoutOf } = new Function("lineOnTop", "ring", "iso", `${consts}${liveSource}; return { poseOf, readoutOf };`)(k.lineOnTop, k.ring, k.iso);
const rest = poseOf(0, 0);
const starDots = (points) => points.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="0.55"/>`).join("");

const svg = k.figureSvg({
  width: WIDTH, height: HEIGHT,
  label: "The Orbiter's camera on a hull deck. Its lens barrel slides in and out to open or close the field of view, drawn as two lines across the deck to a horizon rule. The camera rides a cross-slide that moves it sideways. A console holds the Amount knob and a viewfinder that shows the World growing, shrinking and sliding as the lens moves.",
  body: [
    deck(),
    `<path data-part="cone" class="iso-line" data-tone="lit" d="${rest.cone}" style="stroke-width:1"/>`,
    `<circle data-part="apex" class="iso-wire-end" cx="${rest.apex[0].toFixed(1)}" cy="${rest.apex[1].toFixed(1)}" r="1.3"/>`,
    consoleBox(),
    `<path data-part="world" class="iso-line" data-tone="hi" d="${rest.world}" style="stroke-width:1"/>`,
    `<g data-part="stars" class="iso-dots" data-tone="mid">${starDots(rest.stars)}</g>`,
    `<path data-part="knob" class="iso-line" data-tone="hi" d="${k.lineOnTop(KNOB, [KNOB[0] + 4.2 * Math.sin(Math.PI * 0.75), KNOB[1] - 4.2 * Math.cos(Math.PI * 0.75)], CON_TOP + 5.4, P)}"/>`,
    k.wireSvg(at([CON.x, -106, 0]), at([-62, -50, 0]), { via: [at([-62, -106, 0])], tone: "lo", size: 1.1 }),
    way.back,
    `<g data-part="carriage" transform="${k.translateAlong(P, [0, rest.sy, 0])}">${carriage()}${barrelFixed()}<clipPath id="lens-gland"><path d="${clipD}"/></clipPath><g clip-path="url(#lens-gland)"><g data-part="barrel" transform="${k.translateAlong(P, [rest.e, 0, 0])}">${barrelMoving()}</g></g></g>`,
    way.front,
    horizon(),
  ],
});

const live = `
${consts}
${liveSource}
export function mount(root, say = () => {}) {
const stage = root.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const part = (name) => svg.querySelector('[data-part="' + name + '"]');
const carriage = part("carriage"), barrel = part("barrel"), cone = part("cone"), apex = part("apex"), world = part("world"), stars = part("stars");
let said = "";
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const TOUR = [[0, 0], [1, 0], [1, 0.8], [-1, 0.8], [-1, -0.8], [0.4, -0.8], [0, 0]];
let w = 0, s = 0, tw = 0, ts = 0, frame = 0, last = 0, clock = 0, touring = !still.matches, visible = false, idle = 0;
function draw() {
  const pose = poseOf(w, s);
  carriage.setAttribute("transform", translateAlong(P, [0, pose.sy, 0]));
  barrel.setAttribute("transform", translateAlong(P, [pose.e, 0, 0]));
  cone.setAttribute("d", pose.cone);
  apex.setAttribute("cx", pose.apex[0].toFixed(1)); apex.setAttribute("cy", pose.apex[1].toFixed(1));
  world.setAttribute("d", pose.world);
  stars.innerHTML = pose.stars.map(([x, y]) => '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="0.55"/>').join("");
  const text = readoutOf(Math.round(w * 100) / 100, Math.round(s * 100) / 100);
  if (said !== text) { said = text; say(text); }
  if (!touring && stage.getAttribute("aria-valuetext") !== text) { stage.setAttribute("aria-valuenow", String(Math.round(w * 100))); stage.setAttribute("aria-valuetext", text); }
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  if (touring) { clock += dt; const at = TOUR[Math.floor(clock / 2.6) % TOUR.length]; tw = at[0]; ts = at[1]; }
  const ease = still.matches ? 1 : 1 - Math.exp(-dt / 0.32);
  w += (tw - w) * ease; s += (ts - s) * ease;
  if (Math.abs(tw - w) < 0.002) w = tw;
  if (Math.abs(ts - s) < 0.002) s = ts;
  draw();
  frame = visible && (touring || w !== tw || s !== ts) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
// The reader's setting stays for as long as they are on the figure (pointer over it, or keyboard focus):
// the tour only comes back a while after they have left.
let over = false;
const rest = () => { clearTimeout(idle); if (over || document.activeElement === stage) return; idle = setTimeout(() => { touring = !still.matches; clock = 0; run(); }, 4200); };
const steer = (nw, ns) => { touring = false; tw = clamp(nw, -1, 1); ts = clamp(ns, -1, 1); rest(); run(); };
stage.addEventListener("pointerenter", () => { over = true; clearTimeout(idle); });
stage.addEventListener("pointerleave", () => { over = false; rest(); });
stage.addEventListener("pointercancel", () => { over = false; rest(); });
stage.addEventListener("blur", rest);
const seen = new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" });
seen.observe(stage);
stage.addEventListener("pointermove", (event) => {
  const box = svg.getBoundingClientRect();
  steer(((event.clientX - box.left) / box.width - 0.5) * 2.6, ((event.clientY - box.top) / box.height - 0.5) * -2.6);
});
stage.addEventListener("keydown", (event) => {
  const step = { ArrowRight: [0.2, 0], ArrowLeft: [-0.2, 0], ArrowUp: [0, 0.2], ArrowDown: [0, -0.2] }[event.key];
  if (event.key === "Home") { event.preventDefault(); steer(0, 0); return; }
  if (!step) return;
  event.preventDefault();
  steer(Math.round((tw + step[0]) * 5) / 5, Math.round((ts + step[1]) * 5) / 5);
});
draw();
return () => { seen.disconnect(); cancelAnimationFrame(frame); clearTimeout(idle); visible = false; };
}
`;

const stageHtml = `<div class="iso-stage" tabindex="0" role="slider" aria-label="The Orbiter's camera: left and right arrows change Width, up and down arrows change Shift, Home centres the lens" aria-valuemin="-100" aria-valuemax="100" aria-valuenow="0">${svg}</div>`;

writeFileSync(join(OUT, "lens.js"), `// Built by figures/src/orbiter-lens/build.mjs. Do not edit by hand.\n${kitScript()}\nexport const svg = ${JSON.stringify(stageHtml)};\n${live}`);
console.log("wrote", join(OUT, "lens.js"));

// --preview also writes a bare page per theme next to this script, for the capture and line checks.
if (PREVIEW) {
  for (const theme of ["dark", "light"]) {
    const page = k.pageHtml({ title: "The Orbiter's camera", theme, body: `<div id="fig" style="max-width:640px;margin:40px auto">${stageHtml}</div>`, script: `${kitScript()}\n${live.replace("export function mount", "function mount")}\nmount(document.getElementById("fig"));` });
    writeFileSync(join(HERE, `preview-${theme}.html`), page);
  }
  console.log("wrote previews");
}
