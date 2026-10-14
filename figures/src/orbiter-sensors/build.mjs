// The tilt handset, for the Sensors page (docs.plantasia.space, ORB-632).
// A phone on a ball joint over a hull deck: turning it turns X, tipping it front to back turns Y,
// rolling it side to side turns Z. A bridge of three knobs shows the axes side by side.
// Numbers are the app's own: orbiters/src/input/SensorsController.js (processSensorData):
// the tilt becomes a quaternion (Euler order YXZ: beta, gamma, alpha), and its z, x and y parts,
// each read from -0.7 to 0.7, are X, Y and Z from 0 to 1, which the axis spreads over -180° to 180°.
// So an axis rests at 0° where the phone was calibrated and reaches its end at about 89° of tilt.
// The knobs are the app's own (../shared/knob.mjs).
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { k, G, kitSource as kitScript } from "plantasia.space-design/anatomy/build";
import { KNOB_SOURCE, knobFace, knobWedge, knobNeedle } from "../shared/knob.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
// Writes one ES module, <slot>/static/figures/orbiters/sensors.js, which the docs' <IsoFigure> loads:
// it exports the drawing (`svg`) and `mount(root, say)`. No card, no text, no background: the page explains.
const OUT = process.argv.find((a) => a.startsWith("--out="))?.slice(6) ?? HERE;
const PREVIEW = process.argv.includes("--preview");

const WIDTH = 640, HEIGHT = 400;
const Q_RANGE = 0.7;

const PLATE = { x: -62, y: -106, w: 160, d: 186, r: 10 };
const PLATE_H = 10, FOOT_H = 5;
// the stand and its ball joint
const STAND = [8, 50];
const BALL = [STAND[0], STAND[1], 64], BALL_R = 6.5;
// the handset, in its own plane: across, along, and out of the screen
const PHONE = { w: 50, h: 104, r: 8.5, back: 9, front: 14.5 };
// where it rests: held up to the reader, leaning back and turned a little aside, the way a phone is held to play
const LEAN = 48, SWING = 14;
const CUP = { r: 8, from: 4.5 };
// the bridge: an upright panel whose near face carries the three knobs
const RAIL = { x: -40, y: -98, w: 130, d: 20, r: 2 };
const PANEL = { x: -34, y: -92, w: 118, d: 7, r: 1.5 };
const PANEL_Z = 5, PANEL_TOP = 90;
const FACE_Y = PANEL.y + PANEL.d;
const SLOTS = [-12, 25, 62];
const KNOB_Z = 45, KNOB_R = 15.5, KNOB_OUT = 5;
const faceOf = (x) => ({ o: [x, FACE_Y + KNOB_OUT + 0.05, KNOB_Z], u: [1, 0, 0], v: [0, 0, 1] });
const BUTTON = [62, 50];

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [PANEL.x, PANEL.y, PANEL_TOP + 2], [PANEL.x + PANEL.w, PANEL.y, PANEL_TOP + 2], [BALL[0], BALL[1], BALL[2] + 58], [BALL[0] - 40, BALL[1] + 40, BALL[2] + 12]],
  WIDTH, HEIGHT, { pad: 22, azimuth: 45 },
);
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

function bridge() {
  const out = [];
  out.push(S(k.slabOf(RAIL, 0, PANEL_Z, P, 4, 0.6), { tone: "mid" }));
  out.push(D(k.corners(RAIL, 4).map(([x, y]) => at([x, y, PANEL_Z])), { size: 0.42 }));
  const seams = [PANEL_Z + 5, PANEL_TOP - 5].map((z) => L(k.sideSeam(PANEL, z, P, 4), { tone: "faint" })).join("");
  out.push(S(k.slabOf(PANEL, PANEL_Z, PANEL_TOP - PANEL_Z, P, 4, 0.5), { tone: "mid", inner: seams }));
  for (const x of SLOTS) {
    // each knob: a collar on the panel, the cap standing out of it, and a lamp over it
    const F = G.frameOf([x, FACE_Y, KNOB_Z], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
    out.push(S(G.disc(0, 1.4, KNOB_R + 2.4, F, P), { tone: "mid" }));
    out.push(S(G.disc(1.4, KNOB_OUT, KNOB_R, F, P), { tone: "hi", crease: "lo" }));
    out.push(L(k.sideRing([x, FACE_Y, PANEL_TOP - 9.5], 1.7, "x", P, 14), { tone: "lo" }));
    out.push(D([at([x, FACE_Y, PANEL_TOP - 9.5])], { size: 0.5, tone: "mid" }));
  }
  out.push(D([[PANEL.x + 4, PANEL_Z + 9], [PANEL.x + PANEL.w - 4, PANEL_Z + 9], [PANEL.x + 4, PANEL_TOP - 9], [PANEL.x + PANEL.w - 4, PANEL_TOP - 9]].map(([x, z]) => at([x, FACE_Y, z])), { size: 0.42 }));
  return out.join("");
}

function stand() {
  const out = [`<path class="iso-halo" d="${k.cylinder(STAND[0], STAND[1], 13, 0, 0.1, P, 28).fill}" style="filter:blur(4px)"/>`];
  out.push(S(k.cylinder(STAND[0], STAND[1], 14, 0, 2, P, 40, 0.5), { tone: "mid" }));
  out.push(D([0, 1, 2, 3, 4, 5].map((i) => at([STAND[0] + 11 * Math.cos((i * Math.PI) / 3), STAND[1] + 11 * Math.sin((i * Math.PI) / 3), 2])), { size: 0.42 }));
  out.push(S(k.cylinder(STAND[0], STAND[1], 7.5, 2, 6, P, 30, 0.4), { tone: "mid" }));
  out.push(S(k.cylinder(STAND[0], STAND[1], 4, 8, BALL[2] - 16, P, 24), { tone: "mid", inner: L(k.sideArc(STAND[0], STAND[1], 4, 30, P, 14), { tone: "faint" }) }));
  out.push(S(k.cylinder(STAND[0], STAND[1], 5.4, BALL[2] - 10, 3.4, P, 24, 0.3), { tone: "mid" }));
  out.push(L(k.knurl(STAND[0], STAND[1], 5.4, BALL[2] - 10, BALL[2] - 6.6, 18, P), { tone: "lo" }));
  return out.join("");
}

function button() {
  const out = [];
  out.push(S(k.cylinder(BUTTON[0], BUTTON[1], 9, 0, 1.6, P, 30), { tone: "lo" }));
  out.push(S(k.cylinder(BUTTON[0], BUTTON[1], 6.4, 1.6, 3, P, 28, 0.5), { tone: "mid" }));
  out.push(L(k.ring(BUTTON[0], BUTTON[1], 3.4, 4.6, P, 18), { tone: "lo" }));
  out.push(D([at([BUTTON[0], BUTTON[1], 4.6])], { size: 0.5 }));
  return out.join("");
}

const ball = () => S(G.sphereOf(BALL, BALL_R, P), { tone: "mid" });

// ---- live geometry, shared by the build (rest pose) and the page
const V = G.viewOf(P), LIGHT = G.lightOf(P);
// the resting handset's across, along and out, in the figure's world: its screen faces the reader, leaning back by LEAN
const swing = ((P.azimuth ?? 45) + SWING) * (Math.PI / 180), sinA = Math.sin(swing), cosA = Math.cos(swing), sinL = Math.sin((LEAN * Math.PI) / 180), cosL = Math.cos((LEAN * Math.PI) / 180);
const REST = [[sinA, -cosA, 0], [-cosA * sinL, -sinA * sinL, cosL], [cosA * cosL, sinA * cosL, sinL]];
const liveSource = `
${KNOB_SOURCE}
const DEG = Math.PI / 180;
const pd = (points, closed) => points.map(([x, y], i) => (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1)).join("") + (closed ? "Z" : "");
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const put = (F, s, x, y) => iso([F.o[0] + F.a[0] * s + F.u[0] * x + F.v[0] * y, F.o[1] + F.a[1] * s + F.u[1] * x + F.v[1] * y, F.o[2] + F.a[2] * s + F.u[2] * x + F.v[2] * y], P);
function hullOf(points) {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list) => { const out = []; for (const p of list) { while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 1e-9) out.pop(); out.push(p); } return out.slice(0, -1); };
  return [...half(sorted), ...half(sorted.reverse())];
}
const round = (w, h, r, steps = 6) => [[1, 1], [-1, 1], [-1, -1], [1, -1]].flatMap(([sx, sy], corner) => Array.from({ length: steps + 1 }, (_, i) => { const t = (corner + i / steps) * Math.PI / 2; return [sx * (w / 2 - r) + r * Math.cos(t), sy * (h / 2 - r) + r * Math.sin(t)]; }));
const circle = (r, steps, cx = 0, cy = 0) => Array.from({ length: steps }, (_, i) => [cx + r * Math.cos((i / steps) * Math.PI * 2), cy + r * Math.sin((i / steps) * Math.PI * 2)]);
const bandOf = (score) => { let tone = 0; while (tone < 4 && score >= BANDS[tone]) tone++; return tone; };
// A prism standing on any plane: the ring is drawn in the frame's u, v plane and pulled along its axis.
function prism(F, ring, s0, s1) {
  const n = ring.length, low = ring.map(([x, y]) => put(F, s0, x, y)), high = ring.map(([x, y]) => put(F, s1, x, y));
  const tones = [[], [], [], [], []], seen = [];
  for (let j = 0; j < n; j++) {
    const a = ring[j], b = ring[(j + 1) % n];
    let nx = b[1] - a[1], ny = a[0] - b[0];
    if (nx * (a[0] + b[0]) + ny * (a[1] + b[1]) < 0) { nx = -nx; ny = -ny; }
    const length = Math.hypot(nx, ny) || 1;
    const normal = [(F.u[0] * nx + F.v[0] * ny) / length, (F.u[1] * nx + F.v[1] * ny) / length, (F.u[2] * nx + F.v[2] * ny) / length];
    seen.push(dot(normal, VIEW) > 1e-6);
    if (seen[j]) tones[bandOf(dot(normal, LIGHT))].push(pd([low[j], low[(j + 1) % n], high[(j + 1) % n], high[j]], true));
  }
  const front = dot(F.a, VIEW) > 1e-6, cap = front ? high : low, crease = [];
  // the face you see is always the lightest tone, so a tilting handset does not flicker between tones
  tones[front ? 4 : 1].push(pd(cap, true));
  for (let j = 0; j < n; j++) if (seen[j]) crease.push(pd([cap[j], cap[(j + 1) % n]]));
  const outline = pd(hullOf([...low, ...high]), true);
  return { front, fill: outline, s0: tones[0].join(""), s1: tones[1].join(""), s2: tones[2].join(""), s3: tones[3].join(""), top: tones[4].join(""), crease: crease.join(""), edge: outline };
}
// The handset's own axes in the figure's world, for a turn (alpha), a tip front to back (beta) and a roll (gamma),
// in the order the device reports them. Across is the screen's right, along is its top.
function frameOf(alpha, beta, gamma) {
  const ca = Math.cos(alpha * DEG), sa = Math.sin(alpha * DEG), cb = Math.cos(beta * DEG), sb = Math.sin(beta * DEG), cg = Math.cos(gamma * DEG), sg = Math.sin(gamma * DEG);
  const across = [ca * cg - sa * sb * sg, sa * cg + ca * sb * sg, -cb * sg];
  const along = [-sa * cb, ca * cb, sb];
  const out = [ca * sg + sa * sb * cg, sa * sg - ca * sb * cg, cb * cg];
  const world = ([x, y, z]) => [0, 1, 2].map((i) => REST[0][i] * x + REST[1][i] * y + REST[2][i] * z);
  return { o: BALL, u: world(across), v: world(along), a: world(out) };
}
// X, Y and Z as the app reads them (SensorsController.processSensorData).
function valuesOf(alpha, beta, gamma) {
  const c1 = Math.cos(beta * DEG / 2), s1 = Math.sin(beta * DEG / 2), c2 = Math.cos(gamma * DEG / 2), s2 = Math.sin(gamma * DEG / 2), c3 = Math.cos(alpha * DEG / 2), s3 = Math.sin(alpha * DEG / 2);
  const q = { x: s1 * c2 * c3 + c1 * s2 * s3, y: c1 * s2 * c3 - s1 * c2 * s3, z: c1 * c2 * s3 - s1 * s2 * c3 };
  const map = (part) => Math.min(1, Math.max(0, (part + Q_RANGE) / (2 * Q_RANGE)));
  return [map(q.z), map(q.x), map(q.y)];
}
const SCREEN = round(PHONE.w - 7, PHONE.h - 7, PHONE.r - 2.5);
const BODY = round(PHONE.w, PHONE.h, PHONE.r);
const MARKS = [round(13, 2.6, 1.3, 3).map(([x, y]) => [x, y + PHONE.h / 2 - 10]), round(20, 1.8, 0.9, 3).map(([x, y]) => [x, y - PHONE.h / 2 + 9]), ...[-13, 0, 13].map((x) => circle(4.4, 6, x, -4))];
const LENS = [circle(5.2, 22, -13, PHONE.h / 2 - 16), circle(2.6, 16, -13, PHONE.h / 2 - 16)];
function poseOf(alpha, beta, gamma) {
  const F = frameOf(alpha, beta, gamma);
  const body = prism(F, BODY, PHONE.back, PHONE.front), cup = prism(F, circle(CUP.r, 22), CUP.from, PHONE.back);
  const on = (rings, s) => rings.map((ring) => pd(ring.map(([x, y]) => put(F, s, x, y)), true)).join("");
  body.a = body.front ? on([SCREEN], PHONE.front) : on(LENS, PHONE.back);
  body.b = body.front ? on(MARKS, PHONE.front) : "";
  return { front: body.front, body, cup, values: valuesOf(alpha, beta, gamma) };
}
const KEYS = ["fill", "s0", "s1", "s2", "s3", "top", "crease", "a", "b", "edge"];
// what the axis reads for a value from 0 to 1
const degreesOf = (value) => (value - 0.5) * 360;
`;
const consts = `const P = ${JSON.stringify(P)}, VIEW = ${JSON.stringify(V)}, LIGHT = ${JSON.stringify(LIGHT)}, BANDS = [0, 0.2, 0.42, 0.62], Q_RANGE = ${Q_RANGE}, BALL = ${JSON.stringify(BALL)}, REST = ${JSON.stringify(REST)}, PHONE = ${JSON.stringify(PHONE)}, CUP = ${JSON.stringify(CUP)}, KNOB_R = ${KNOB_R}, FACES = ${JSON.stringify(SLOTS.map(faceOf))};`;
const { poseOf, knobOf } = new Function("iso", `${consts}${liveSource}; return { poseOf, knobOf };`)(k.iso);
const rest = poseOf(0, 0, 0);

// A solid the page repaints: the same children as the kit's solidSvg, each found by its key.
function liveSolid(part, paths, tone, extra = "") {
  const shades = [0, 1, 2, 3].map((n) => `<path class="iso-shade" data-shade="${n}" data-k="s${n}" d="${paths[`s${n}`]}"/>`).join("");
  return `<g class="iso-solid" data-part="${part}"><path class="iso-fill" data-k="fill" d="${paths.fill}"/>${shades}<path class="iso-top" data-k="top" d="${paths.top}"/><path class="iso-line iso-crease" data-tone="faint" data-k="crease" d="${paths.crease}"/>${extra}<path class="iso-line iso-edge" data-tone="${tone}" data-k="edge" d="${paths.edge}"/></g>`;
}
const EMPTY = { fill: "", s0: "", s1: "", s2: "", s3: "", top: "", crease: "", edge: "" };
const details = `<path class="iso-line" data-tone="mid" data-k="a" d="${rest.body.a}"/><path class="iso-line" data-tone="lo" data-k="b" d="${rest.body.b}"/>`;

const svg = k.figureSvg({
  width: WIDTH, height: HEIGHT,
  label: "A phone held on a ball joint over a hull deck, beside a bridge of three knobs. Turning the phone turns the first knob, X. Tipping it front to back turns the second, Y. Rolling it side to side turns the third, Z. Each knob rests at 0°, its needle straight up, where the phone was calibrated.",
  body: [
    deck(),
    bridge(),
    ...SLOTS.map((x, index) => { const knob = knobOf(faceOf(x), KNOB_R, 0); return knobWedge(`wedge-${index}`, knob.wedge) + knobFace(faceOf(x), KNOB_R, P, k.iso, k.lineSvg) + knobNeedle(`needle-${index}`, knob.needle); }),
    k.wireSvg(at([STAND[0], STAND[1] - 14, 0]), at([STAND[0], RAIL.y + RAIL.d, 0]), { tone: "lo", size: 1.1 }),
    k.wireSvg(at([BUTTON[0] - 9, BUTTON[1], 0]), at([STAND[0] + 14, BUTTON[1], 0]), { tone: "lo", size: 1.1 }),
    button(),
    stand(),
    // the joint is drawn behind the handset while its screen faces you, and in front of it once its back does
    `<g data-part="ball-behind">${ball()}</g>`,
    liveSolid("cup-behind", rest.cup, "mid"),
    liveSolid("phone", rest.body, "hi", details),
    liveSolid("cup-front", EMPTY, "mid"),
    `<g data-part="ball-front" style="display:none">${ball()}</g>`,
  ],
});

const live = `
${consts}
${liveSource}
export function mount(root, say = () => {}) {
const stage = root.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const part = (name) => svg.querySelector('[data-part="' + name + '"]');
const slots = (group) => Object.fromEntries(KEYS.map((key) => [key, group.querySelector('[data-k="' + key + '"]')]).filter(([, node]) => node));
const phone = slots(part("phone")), cupBehind = slots(part("cup-behind")), cupFront = slots(part("cup-front"));
const ballBehind = part("ball-behind"), ballFront = part("ball-front"), wedges = [0, 1, 2].map((index) => part("wedge-" + index)), needles = [0, 1, 2].map((index) => part("needle-" + index));
const paint = (nodes, paths) => { for (const key in nodes) nodes[key].setAttribute("d", paths ? paths[key] || "" : ""); };
let said = "";
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
// The tour moves one thing at a time: tip, roll, then turn.
const TOUR = [[0, 0, 0], [0, 40, 0], [0, -40, 0], [0, 0, 0], [0, 0, 40], [0, 0, -40], [0, 0, 0], [50, 0, 0], [-50, 0, 0]];
const now = [0, 0, 0], goal = [0, 0, 0];
let frame = 0, last = 0, clock = 0, touring = !still.matches, visible = false, idle = 0;
function draw() {
  const pose = poseOf(now[0], now[1], now[2]);
  paint(phone, pose.body);
  paint(cupBehind, pose.front ? pose.cup : null);
  paint(cupFront, pose.front ? null : pose.cup);
  ballBehind.style.display = pose.front ? "" : "none";
  ballFront.style.display = pose.front ? "none" : "";
  const degrees = pose.values.map(degreesOf);
  degrees.forEach((value, index) => { const knob = knobOf(FACES[index], KNOB_R, value); wedges[index].setAttribute("d", knob.wedge); needles[index].setAttribute("d", knob.needle); });
  const text = axesReadout(degrees);
  if (said !== text) { said = text; say(text); }
  if (!touring && stage.getAttribute("aria-valuetext") !== text) { stage.setAttribute("aria-valuenow", String(Math.round(degrees[1]))); stage.setAttribute("aria-valuetext", text); }
}
function tick(time) {
  const dt = last ? Math.min((time - last) / 1000, 1 / 30) : 1 / 60;
  last = time;
  if (touring) { clock += dt; const at = TOUR[Math.floor(clock / 2.4) % TOUR.length]; goal[0] = at[0]; goal[1] = at[1]; goal[2] = at[2]; }
  const ease = still.matches ? 1 : 1 - Math.exp(-dt / 0.34);
  let moving = false;
  for (let i = 0; i < 3; i++) { now[i] += (goal[i] - now[i]) * ease; if (Math.abs(goal[i] - now[i]) < 0.05) now[i] = goal[i]; else moving = true; }
  draw();
  frame = visible && (touring || moving) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
// The reader's setting stays for as long as they are on the figure (pointer over it, or keyboard focus):
// the tour only comes back a while after they have left.
let over = false;
const rest = () => { clearTimeout(idle); if (over || document.activeElement === stage) return; idle = setTimeout(() => { touring = !still.matches; clock = 0; run(); }, 4200); };
const steer = (alpha, beta, gamma) => { touring = false; goal[0] = clamp(alpha, -80, 80); goal[1] = clamp(beta, -55, 55); goal[2] = clamp(gamma, -55, 55); rest(); run(); };
stage.addEventListener("pointerenter", () => { over = true; clearTimeout(idle); });
stage.addEventListener("pointerleave", () => { over = false; rest(); });
stage.addEventListener("pointercancel", () => { over = false; rest(); });
stage.addEventListener("blur", rest);
const seen = new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" });
seen.observe(stage);
stage.addEventListener("pointermove", (event) => {
  const box = svg.getBoundingClientRect();
  if (!box.width || !box.height) return;
  steer(goal[0], ((event.clientY - box.top) / box.height - 0.5) * -130, ((event.clientX - box.left) / box.width - 0.5) * 130);
});
stage.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === "Home") { event.preventDefault(); steer(0, 0, 0); return; }
  const by = (event.shiftKey ? { ArrowRight: [10, 0, 0], ArrowLeft: [-10, 0, 0] } : { ArrowUp: [0, 10, 0], ArrowDown: [0, -10, 0], ArrowRight: [0, 0, 10], ArrowLeft: [0, 0, -10] })[event.key];
  if (!by) return;
  event.preventDefault();
  steer(Math.round(goal[0] + by[0]), Math.round(goal[1] + by[1]), Math.round(goal[2] + by[2]));
});
draw();
return () => { seen.disconnect(); cancelAnimationFrame(frame); clearTimeout(idle); visible = false; };
}
`;

const stageHtml = `<div class="iso-stage" tabindex="0" role="slider" aria-label="The tilt handset: up and down arrows tip the phone and turn Y, left and right arrows roll it and turn Z, Shift with left and right turns it and turns X, Home brings it back to the centre" aria-valuemin="-180" aria-valuemax="180" aria-valuenow="0">${svg}</div>`;

writeFileSync(join(OUT, "sensors.js"), `// Built by figures/src/orbiter-sensors/build.mjs. Do not edit by hand.\n${kitScript()}\nexport const svg = ${JSON.stringify(stageHtml)};\n${live}`);
console.log("wrote", join(OUT, "sensors.js"));

// --preview also writes a bare page per theme next to this script, for the capture and line checks.
if (PREVIEW) {
  for (const theme of ["dark", "light"]) {
    const page = k.pageHtml({ title: "The tilt handset", theme, body: `<div id="fig" style="max-width:640px;margin:40px auto">${stageHtml}</div>`, script: `${kitScript()}\n${live.replace("export function mount", "function mount")}\nmount(document.getElementById("fig"));` });
    writeFileSync(join(HERE, `preview-${theme}.html`), page);
  }
  console.log("wrote previews");
}
