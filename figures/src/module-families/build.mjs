// The three module families, for their overview pages (docs.plantasia.space, ORB-632): Instruments,
// Audio effects and MIDI effects. Each is a length of the Orbiter's rack with that family's modules
// standing in it, and a line along the rack's near edge that the notes or the sound follow, left to right.
//   Instruments    an Orbiter is Audio or Notes, never both (docs/03-orbiters/06-instruments/index.mdx):
//                  the box with the reels plays, or the box with the keys does.
//   Audio effects  a place holds up to three effects, run in order from left to right
//                  (docs/03-orbiters/07-audio-effects/index.mdx): the sound passes each one in turn.
//   MIDI effects   a generator makes notes, a MIDI effect reshapes them, the instrument plays the result
//                  (docs/03-orbiters/08-midi-effects/index.mdx).
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../kit/iso-kit.mjs";
import * as G from "../../kit/lathe.mjs";
import { kitScript } from "../../scripts/inline-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
// Writes three ES modules into <slot>/static/figures/orbiters/, which the docs' <IsoFigure> loads: each
// exports the drawing (`svg`) and `mount(root, say)`. No card, no text, no background: the page explains.
const OUT = process.argv.find((a) => a.startsWith("--out="))?.slice(6) ?? HERE;
const PREVIEW = process.argv.includes("--preview");

const WIDTH = 640, HEIGHT = 360;
const RAIL = { x: -84, y: -30, w: 168, d: 60, r: 3 };
const RAIL_TOP = 4, LINE_Y = 26, PORTS = [RAIL.x + 8, RAIL.x + RAIL.w - 8];
// one camera for the three, so the set keeps one scale
const P = k.fitProjection([...k.boxCorners(RAIL, -6, RAIL_TOP), [-66, -23, 33], [-14, -22, 33]], WIDTH, HEIGHT, { pad: 26, azimuth: 45 });
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const part = (name, body, attrs = "") => `<g data-part="${name}"${attrs}>${body}</g>`;

// The rack: a rail on four stubs, a port at each end, and the line between them along the near edge.
function rail() {
  const out = [];
  for (const [x, y] of [...k.corners(RAIL, 10)].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P))) out.push(S(k.cylinder(x, y, 4, -6, 6, P, 18), { tone: "mid" }));
  out.push(S(k.slabOf(RAIL, 0, RAIL_TOP, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(RAIL, 2, P, 4), { tone: "faint" }) }));
  out.push(D(k.corners(RAIL, 4).map(([x, y]) => at([x, y, RAIL_TOP])), { size: 0.42 }));
  return out.join("");
}
const line = (from = PORTS[0], to = PORTS[1]) => L(k.lineOnTop([from, LINE_Y], [to, LINE_Y], RAIL_TOP, P), { tone: "mid" });
const port = (x) => S(k.cylinder(x, LINE_Y, 2.6, RAIL_TOP, 1.4, P, 16), { tone: "mid" }) + D([at([x, LINE_Y, RAIL_TOP + 1.4])], { size: 0.5, tone: "hi" });
// a module's tap onto the line: from its near face out to the line
const tap = (x, plan) => L(k.lineOnTop([x, plan.y + plan.d], [x, LINE_Y], RAIL_TOP, P), { tone: "mid" });
const box = (plan, h, tone = "hi") => S(k.slabOf(plan, RAIL_TOP, h, P, 4, 0.5), { tone, crease: "lo", inner: L(k.sideSeam(plan, RAIL_TOP + h - 3.5, P, 4), { tone: "faint" }) });
// every module has a small screen on its lid: a bezel, and what it shows drawn across the glass
function screen(plan, lid, picture) {
  const glass = k.insetPlan(plan, 1.6);
  const points = picture.map(([fx, fy]) => [glass.x + fx * glass.w, glass.y + fy * glass.d]);
  return S(k.slabOf(plan, lid, 0.9, P, 3, 0.2), { tone: "mid" }) + L(k.planOutline(glass, lid + 0.9, P, 3), { tone: "mid" }) + L(k.onTop(points, lid + 0.9, P), { tone: "hi" });
}
// a module's own knob: a small cap with a needle
const knob = (x, y, lid, turn = 0.6) => S(k.cylinder(x, y, 2.8, lid, 2.2, P, 16, 0.3), { tone: "mid" }) + L(k.lineOnTop([x, y], [x + 2.8 * Math.sin(turn), y - 2.8 * Math.cos(turn)], lid + 2.2, P), { tone: "hi", free: "start" });
// a keyboard on a lid: white keys the page can press, black keys over them
const WHITE = 7, KEY_W = 5;
function keys(x0, y0, lid) {
  const list = [];
  for (let i = 0; i < WHITE; i++) list.push(part(`key-${i}`, S(k.slabOf({ x: x0 + i * KEY_W, y: y0, w: KEY_W - 0.4, d: 22, r: 0.6 }, lid, 1.6, P, 2, 0.2), { tone: "mid" })));
  for (const i of [0, 1, 3, 4, 5]) list.push(S(k.slabOf({ x: x0 + i * KEY_W + 3.3, y: y0, w: 3, d: 13, r: 0.5 }, lid + 1.6, 1.4, P, 2), { tone: "hi" }));
  return list.join("");
}
// where a stretch of the rack falls across the picture, as fractions of its width, read along the row of modules
const spanOf = (from, to) => [at([from, 0, RAIL_TOP + 10])[0] / WIDTH, at([to, 0, RAIL_TOP + 10])[0] / WIDTH];
const pulse = (extra = "") => `<circle data-part="pulse" class="iso-wire-end" r="2.4" style="stroke:var(--anatomy-lit);fill:var(--anatomy-lit)"/>${extra}`;

// ---- what every one of the three shares in the page: a place along the rack, from 0 to 1, that a slow
// tour moves and the reader can take over. Each figure supplies `draw(place, seconds, dt)` and returns its text.
const runtime = `
export function mount(root, say = () => {}) {
const stage = root.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const part = (name) => svg.querySelector('[data-part="' + name + '"]');
const onLine = (x) => iso([x, LINE_Y, RAIL_TOP], P);
const draw = setup(part, onLine);
let said = "";
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v) => Math.min(1, Math.max(0, v));
let place = REST, goal = REST, frame = 0, last = 0, seconds = 0, touring = !still.matches, visible = false, idle = 0;
function paint(dt) {
  const text = draw(place, seconds, dt);
  if (said !== text) { said = text; say(text); }
  if (!touring) { stage.setAttribute("aria-valuenow", String(Math.round(place * 100))); stage.setAttribute("aria-valuetext", text); }
}
function tick(time) {
  const dt = last ? Math.min((time - last) / 1000, 1 / 30) : 1 / 60;
  last = time;
  seconds += dt;
  if (touring) { place = (place + dt / LAP) % 1; goal = place; }
  else { place += (goal - place) * (1 - Math.exp(-dt / 0.25)); if (Math.abs(goal - place) < 0.002) place = goal; }
  paint(dt);
  // a figure with parts that keep turning (ALIVE) stays awake while it is watched
  frame = visible && !still.matches && (ALIVE || touring || place !== goal) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
let over = false;
const rest = () => { clearTimeout(idle); if (over || document.activeElement === stage) return; idle = setTimeout(() => { touring = !still.matches; run(); }, 4200); };
const steer = (to) => { touring = false; goal = clamp(to); if (still.matches) { place = goal; paint(0); } rest(); run(); };
stage.addEventListener("pointerenter", () => { over = true; clearTimeout(idle); });
stage.addEventListener("pointerleave", () => { over = false; rest(); });
stage.addEventListener("pointercancel", () => { over = false; rest(); });
stage.addEventListener("blur", rest);
const seen = new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" });
seen.observe(stage);
stage.addEventListener("pointermove", (event) => {
  const box = svg.getBoundingClientRect();
  if (!box.width || !box.height) return;
  steer(((event.clientX - box.left) / box.width - SPAN[0]) / (SPAN[1] - SPAN[0]));
});
stage.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  const by = { Home: -STOPS.length, End: STOPS.length, ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[event.key];
  if (!by) return;
  event.preventDefault();
  // from the stop nearest to where the figure is, one stop along
  const near = STOPS.reduce((best, stop, index) => (Math.abs(stop - goal) < Math.abs(STOPS[best] - goal) ? index : best), 0);
  steer(STOPS[Math.min(STOPS.length - 1, Math.max(0, near + by))]);
});
paint(0);
return () => { seen.disconnect(); cancelAnimationFrame(frame); clearTimeout(idle); visible = false; };
}
`;
const shared = `const P = ${JSON.stringify(P)}, LINE_Y = ${LINE_Y}, RAIL_TOP = ${RAIL_TOP}, PORTS = ${JSON.stringify(PORTS)};
const lineX = (place) => PORTS[0] + place * (PORTS[1] - PORTS[0]);
const pd = (points) => points.map(([x, y], i) => (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1)).join("");
const moveTo = (node, [x, y]) => { node.setAttribute("cx", x.toFixed(1)); node.setAttribute("cy", y.toFixed(1)); };`;

// ============ Instruments: Audio or Notes
const AUDIO = { x: -66, y: -22, w: 52, d: 44, r: 3 }, AUDIO_H = 22;
const NOTES = { x: 12, y: -22, w: 52, d: 44, r: 3 }, NOTES_H = 16;
const REELS = [[-52, 6], [-28, 6]], REEL_R = 9, HUB_R = 2.6, REEL_Z = RAIL_TOP + AUDIO_H;
function instruments() {
  const audio = [box(AUDIO, AUDIO_H)];
  audio.push(screen({ x: -60, y: -19, w: 40, d: 11, r: 1.2 }, REEL_Z, [[0, 0.5], [0.12, 0.2], [0.22, 0.8], [0.34, 0.1], [0.46, 0.9], [0.58, 0.3], [0.7, 0.7], [0.84, 0.4], [1, 0.5]]));
  audio.push(L(REELS.map(([x, y]) => k.ring(x, y, REEL_R, REEL_Z, P, 28) + k.ring(x, y, HUB_R, REEL_Z, P, 14)).join(""), { tone: "mid" }));
  audio.push(L(k.lineOnTop([REELS[0][0], REELS[0][1] + REEL_R], [REELS[1][0], REELS[1][1] + REEL_R], REEL_Z, P), { tone: "lo" }));
  audio.push(`<path data-part="spokes" class="iso-line" data-tone="hi" d=""/>`);
  const notes = [box(NOTES, NOTES_H)];
  const lid = RAIL_TOP + NOTES_H;
  notes.push(screen({ x: 18, y: -19, w: 26, d: 11, r: 1.2 }, lid, [[0, 1], [0.2, 0.1], [0.4, 0.45], [0.72, 0.45], [1, 1]]));
  notes.push(knob(50, -13.5, lid, 0.4), knob(58, -13.5, lid, 2.2));
  notes.push(keys(20.5, -3, lid));
  return [rail(), line(), port(PORTS[0]), tap(-40, AUDIO), tap(38, NOTES), part("audio", audio.join("")), part("notes", notes.join("")), port(PORTS[1])];
}
const instrumentsLive = `${shared}
const REELS = ${JSON.stringify(REELS)}, REEL_R = ${REEL_R}, HUB_R = ${HUB_R}, REEL_Z = ${REEL_Z}, WHITE = ${WHITE}, REST = 0.25, LAP = 9, ALIVE = true, STOPS = [0.25, 0.75], SPAN = [0.12, 0.88];
const ORDER = [0, 2, 4, 6, 5, 3, 1];
function setup(part) {
  const spokes = part("spokes"), audio = part("audio"), notes = part("notes"), keys = Array.from({ length: WHITE }, (_, i) => part("key-" + i));
  let spin = 0;
  return (place, seconds, dt) => {
    const playsAudio = place < 0.5;
    if (playsAudio) spin += dt * 1.6;
    spokes.setAttribute("d", REELS.map(([x, y]) => [0, 1, 2].map((n) => { const a = spin + (n * Math.PI * 2) / 3; return pd([iso([x + HUB_R * Math.cos(a), y + HUB_R * Math.sin(a), REEL_Z], P), iso([x + REEL_R * Math.cos(a), y + REEL_R * Math.sin(a), REEL_Z], P)]); }).join("")).join(""));
    const down = playsAudio ? -1 : ORDER[Math.floor(seconds * 2.5) % ORDER.length];
    keys.forEach((key, i) => key.setAttribute("transform", translateAlong(P, [0, 0, i === down ? -1.1 : 0])));
    // the one that plays wears the lit edge
    audio.firstElementChild.toggleAttribute("data-lit", playsAudio);
    notes.firstElementChild.toggleAttribute("data-lit", !playsAudio);
    return playsAudio ? "Audio" : "Notes";
  };
}`;

// ============ Audio effects: up to three, in order
const FX = [-62, -18, 26].map((x) => ({ x, y: -22, w: 36, d: 44, r: 3 })), FX_H = 15;
function audioEffects() {
  const lid = RAIL_TOP + FX_H, out = [rail(), line(), port(PORTS[0])];
  FX.forEach((plan, index) => {
    const cx = plan.x + plan.w / 2;
    // rings for a room, shrinking bars for repeats, a grille for a filter
    const picture = [
      [13, 9, 5].map((r) => k.ring(cx, 0, r, lid, P, 30)).join(""),
      [[-11, 30], [-4, 22], [3, 14], [10, 7]].map(([dx, long]) => k.planOutline({ x: cx + dx - 1.5, y: -long / 2, w: 3, d: long, r: 1.5 }, lid, P, 3)).join(""),
      [-10, -5, 0, 5, 10].map((dx) => k.planOutline({ x: cx + dx - 1.2, y: -14, w: 2.4, d: 28, r: 1.2 }, lid, P, 3)).join(""),
    ][index];
    out.push(tap(cx, plan), box(plan, FX_H), `<path data-part="lid-${index}" class="iso-line" data-tone="mid" d="${picture}"/>`);
  });
  // the sound on the line: a dot that gains a ring from each effect it has passed
  out.push([1, 2, 3].map((n) => `<circle data-part="mark-${n}" class="iso-line" data-tone="lit" r="${2.4 + n * 2.2}" style="display:none"/>`).join(""), pulse(), port(PORTS[1]));
  return out;
}
const audioEffectsLive = `${shared}
const FX = ${JSON.stringify(FX.map((plan) => [plan.x, plan.x + plan.w]))}, REST = 0, LAP = 8, ALIVE = false, STOPS = Array.from({ length: 21 }, (_, i) => i / 20), SPAN = ${JSON.stringify(spanOf(PORTS[0], PORTS[1]))};
const NAMES = ["First effect", "Second effect", "Third effect"];
function setup(part, onLine) {
  const dot = part("pulse"), marks = [1, 2, 3].map((n) => part("mark-" + n)), lids = [0, 1, 2].map((n) => part("lid-" + n));
  return (place) => {
    const x = lineX(place), here = onLine(x);
    moveTo(dot, here);
    let text = x < FX[0][0] ? "Before the effects" : "After the effects";
    FX.forEach(([from, to], index) => {
      const inside = x >= from && x <= to;
      lids[index].setAttribute("data-tone", inside ? "lit" : "mid");
      marks[index].style.display = x > (from + to) / 2 ? "" : "none";
      moveTo(marks[index], here);
      if (inside) text = NAMES[index];
      else if (x > to && (index === 2 || x < FX[index + 1][0])) text = index === 2 ? "After the effects" : NAMES[index];
    });
    return text;
  };
}`;

// ============ MIDI effects: a generator, a MIDI effect, the instrument
const DRUM = { x: -56, r: 10, from: -18, to: 18, z: RAIL_TOP + 15 };
const GRID = { x: -22, y: -22, w: 34, d: 44, r: 3 }, GRID_H = 14, CELL = 4.2, COLS = 5, ROWS = 7;
const SYNTH = { x: 26, y: -22, w: 48, d: 44, r: 3 }, SYNTH_H = 16;
const PINS = Array.from({ length: 9 }, (_, row) => Array.from({ length: 4 + (row % 3) }, (_, n) => [DRUM.from + 2 + row * 4, row * 0.7 + (n * Math.PI * 2) / (4 + (row % 3))])).flat();
function midiEffects() {
  const out = [rail(), line(DRUM.x, PORTS[1])];
  const F = G.frameOf([DRUM.x, DRUM.from, DRUM.z], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
  const cheek = (y) => S(k.slabOf({ x: DRUM.x - 8, y, w: 16, d: 3, r: 1 }, RAIL_TOP, 19, P, 2, 0.3), { tone: "mid" });
  // the generator: a pin drum in a cradle, its pins repainted by the page as it turns
  out.push(cheek(DRUM.from - 3), S(G.disc(0, DRUM.to - DRUM.from, DRUM.r, F, P), { tone: "hi", crease: "lo" }), `<g data-part="pins" class="iso-dots" data-tone="hi"></g>`, cheek(DRUM.to));
  out.push(L(k.lineOnTop([DRUM.x, DRUM.to + 3], [DRUM.x, LINE_Y], RAIL_TOP, P), { tone: "mid" }));
  // the MIDI effect: a grid of notes on its lid, one of them lit and moved
  const lid = RAIL_TOP + GRID_H, gx = GRID.x + 9, gy = GRID.y + 9;
  out.push(tap(GRID.x + GRID.w / 2, GRID), box(GRID, GRID_H), L(k.planOutline(k.insetPlan(GRID, 5), lid, P, 3), { tone: "lo" }));
  out.push(D(k.dotGrid(gx, gy, COLS, ROWS, CELL, lid, P), { size: 0.45, tone: "mid" }));
  out.push(`<circle data-part="note" class="iso-wire-end" r="1.9" style="stroke:var(--anatomy-lit);fill:var(--anatomy-lit);display:none"/>`);
  // the instrument that plays them
  const top = RAIL_TOP + SYNTH_H;
  out.push(tap(SYNTH.x + SYNTH.w / 2, SYNTH), box(SYNTH, SYNTH_H));
  out.push(screen({ x: 31, y: -19, w: 24, d: 11, r: 1.2 }, top, [[0, 1], [0.2, 0.1], [0.4, 0.45], [0.72, 0.45], [1, 1]]), knob(61, -13.5, top, 0.4), knob(68.5, -13.5, top, 2.2), keys(32.5, -3, top));
  out.push(pulse(), port(PORTS[1]));
  return out;
}
const V = G.viewOf(P);
const midiEffectsLive = `${shared}
const DRUM = ${JSON.stringify(DRUM)}, PINS = ${JSON.stringify(PINS)}, VIEW = ${JSON.stringify(V)}, WHITE = ${WHITE}, REST = 0, LAP = 9, ALIVE = true, STOPS = Array.from({ length: 21 }, (_, i) => i / 20), SPAN = ${JSON.stringify(spanOf(DRUM.x, SYNTH.x + SYNTH.w / 2))};
const GRID_AT = ${JSON.stringify([GRID.x + 9 + 2 * CELL, GRID.y + 9, RAIL_TOP + GRID_H])}, CELL = ${CELL}, GRID_X = ${JSON.stringify([GRID.x, GRID.x + GRID.w])}, SYNTH_X = ${SYNTH.x + SYNTH.w / 2}, SYNTH_FROM = ${SYNTH.x + 6}, TAP = ${GRID.x + GRID.w / 2};
function setup(part, onLine) {
  const dot = part("pulse"), pins = part("pins"), note = part("note"), keys = Array.from({ length: WHITE }, (_, i) => part("key-" + i));
  return (place, seconds) => {
    // the drum turns all the time: only the pins that face the reader are drawn, fading toward the edge
    pins.innerHTML = PINS.map(([y, at]) => { const a = at + seconds * 0.9, facing = Math.cos(a) * VIEW[0] + Math.sin(a) * VIEW[2]; if (facing < 0.05) return ""; const [x, sy] = iso([DRUM.x + DRUM.r * Math.cos(a), y, DRUM.z + DRUM.r * Math.sin(a)], P); return '<circle cx="' + x.toFixed(1) + '" cy="' + sy.toFixed(1) + '" r="0.55" style="opacity:' + Math.min(1, facing * 2.4).toFixed(2) + '"/>'; }).join("");
    const x = DRUM.x + place * (SYNTH_X - DRUM.x);
    moveTo(dot, onLine(x));
    const inside = x >= GRID_X[0] && x <= GRID_X[1], played = x >= SYNTH_FROM;
    // on the grid the note comes in on one row and leaves on another
    const row = 5 - 3 * Math.min(1, Math.max(0, (x - GRID_X[0]) / (GRID_X[1] - GRID_X[0])));
    note.style.display = inside ? "" : "none";
    moveTo(note, iso([GRID_AT[0], GRID_AT[1] + row * CELL, GRID_AT[2]], P));
    keys.forEach((key, i) => key.setAttribute("transform", translateAlong(P, [0, 0, played && i === 4 ? -1.1 : 0])));
    return played ? "The instrument plays it" : x >= GRID_X[0] ? (inside ? "The MIDI effect reshapes the note" : "The reshaped note") : "The generator makes a note";
  };
}`;

const FIGURES = [
  { file: "instruments", title: "Instruments", body: instruments(), live: instrumentsLive, label: "A length of the Orbiter's rack with two instruments on it. One has two reels and plays an audio. The other has a keyboard and plays notes. Only one of them plays at a time.", keys: "left and right arrows choose Audio or Notes" },
  { file: "audio-effects", title: "Audio effects", body: audioEffects(), live: audioEffectsLive, label: "A length of the Orbiter's rack with three audio effects in a row, and a line along its edge. The sound travels along the line from left to right and passes each effect in turn, picking up a ring from each one.", keys: "left and right arrows move the sound along the rack, Home and End take it to either end" },
  { file: "midi-effects", title: "MIDI effects", body: midiEffects(), live: midiEffectsLive, label: "A length of the Orbiter's rack with a pin drum, a box with a grid of notes, and a box with a keyboard. A note leaves the drum, moves to another row on the grid, and a key plays it.", keys: "left and right arrows move the note along the rack, Home and End take it to either end" },
];
for (const figure of FIGURES) {
  const svg = k.figureSvg({ width: WIDTH, height: HEIGHT, label: figure.label, body: figure.body });
  const stageHtml = `<div class="iso-stage" tabindex="0" role="slider" aria-label="${figure.title}: ${figure.keys}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">${svg}</div>`;
  const live = `${figure.live}\n${runtime}`;
  writeFileSync(join(OUT, `${figure.file}.js`), `// Built by figures/src/module-families/build.mjs. Do not edit by hand.\n${kitScript()}\nexport const svg = ${JSON.stringify(stageHtml)};\n${live}`);
  console.log("wrote", join(OUT, `${figure.file}.js`));
  // --preview also writes a bare page per theme next to this script, for the capture and line checks.
  if (PREVIEW) for (const theme of ["dark", "light"]) writeFileSync(join(HERE, `preview-${figure.file}-${theme}.html`), k.pageHtml({ title: figure.title, theme, body: `<div id="fig" style="max-width:640px;margin:40px auto">${stageHtml}</div>`, script: `${kitScript()}\n${live.replace("export function mount", "function mount")}\nmount(document.getElementById("fig"));` }));
}
