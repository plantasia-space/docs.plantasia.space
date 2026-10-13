// The Plantasia Space machine, for the docs home page (ORB-633): every entity as a working part of one contraption.
// An Audio (a ball) leaves the Collection (a cabinet), plays an instrument (the bars) under the xPlorer's
// console, while the Orbiter (the craft) circles the Entangled World (the planet), and a Release (the sprout)
// grows where the Audio lands. The orchid is Plantasia Space.
// Two arrangements of the same parts: the orrery (wide screens) and the tower (a narrow column).
// It runs by itself and carries no words. Nothing here is a number from the app: it is a picture of the whole.
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../kit/iso-kit.mjs";
import * as G from "../../kit/lathe.mjs";
import { scene, polar, UP, TAU } from "./parts.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
// Writes into static/figures/home, per arrangement: a picture for each theme (<name>-dark.svg, <name>-light.svg),
// which the page shows as it is and then puts on its stage, and <name>.js, which only moves it (`mount(root)`).
const OUT = process.argv.find((a) => a.startsWith("--out="))?.slice(6) ?? join(HERE, "../../../static/figures/home");
const PREVIEW = process.argv.includes("--preview");
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.slice(7);

// The one accent: the Orbiters app's default Color C, the green of whatever is selected or active
// (orbiters/src/ui/react/orbitersUI.css, --orb-default-color3: #33ff41). The ramp shades it for the kit's faces.
const ACCENT = {
  dark: { paper: "#149c1f", face: "#25d434", top: "#33ff41", shades: ["#149c1f", "#1cb82a", "#25d434", "#2dea3b"], hi: "#b8ffbd", mid: "#33ff41", line: "#33ff41" },
  light: { paper: "#22c930", face: "#2adf39", top: "#33ff41", shades: ["#1ba827", "#22c930", "#2adf39", "#30f03e"], hi: "#0b5a12", mid: "#149c1f", line: "#17a823" },
};
const ramp = (a) => `--anatomy-paper:${a.paper};--anatomy-face:${a.face};--anatomy-top:${a.top};${a.shades.map((c, i) => `--anatomy-shade-${i}:${c}`).join(";")};--anatomy-hi:${a.hi};--anatomy-mid:${a.mid}`;
const CSS = `.hm-acc{${ramp(ACCENT.dark)}}[data-theme="light"] .hm-acc{${ramp(ACCENT.light)}}`
  + `.hm-beam{fill:none;stroke:${ACCENT.dark.line};stroke-width:1.1;stroke-dasharray:1 3.2;stroke-linecap:round;opacity:.45}[data-theme="light"] .hm-beam{stroke:${ACCENT.light.line}}`;

// The page describes the drawing in its own language (src/components/HomeFigure) and sets that on it.
const LABEL = "The Plantasia Space machine";

// ---- geometry the build and the page both use
const SHARED = `
function linkEnds(link, p) {
  const from = [p[0] + link.off[0], p[1] + link.off[1], p[2] + link.off[2]];
  const c = link.ball, d = [from[0] - c[0], from[1] - c[1], from[2] - c[2]], n = Math.hypot(d[0], d[1], d[2]) || 1;
  return [from, [c[0] + (d[0] / n) * link.r, c[1] + (d[1] / n) * link.r, c[2] + (d[2] / n) * link.r]];
}
function trackAt(track, t) {
  const n = track.pts.length / 3, u = (((t % track.period) + track.period) % track.period) / track.period;
  const f = u * (track.closed ? n : n - 1), i = Math.floor(f) % n, j = track.closed ? (i + 1) % n : Math.min(i + 1, n - 1), w = f - Math.floor(f);
  const a = track.pts, lerp = (o) => a[i * 3 + o] + (a[j * 3 + o] - a[i * 3 + o]) * w;
  return [lerp(0), lerp(1), lerp(2)];
}
`;
const { linkEnds, trackAt } = new Function(`${SHARED}; return { linkEnds, trackAt };`)();
// a ball paints over the rails it rides (drawn 6 back) and under whatever stands in front of it
const BALL_BIAS = 6;
const flat = (points) => points.flatMap((p) => p.map((n) => Number(n.toFixed(1))));
const linkSvg = (T, link, rest, cls) => `<path data-part="${link.part}" class="${cls}" d="${T.path3(linkEnds(link, rest))}"/>`;

// a ball's trigger over the track: a post, an arm, and a flag the ball flicks; a wire runs from its foot to what it sets off
function trigger(T, deg, r, z, name, to) {
  const [px, py] = polar(r + 9, deg), [hx, hy] = polar(r, deg);
  T.put([px, py, 0], T.S(k.cylinder(px, py, 2.2, 0, 1.2, T.P, 14), { tone: "lo" }) + T.S(k.cylinder(px, py, 0.8, 1.2, z + 12, T.P, 8), { tone: "mid", crease: "none" }), 0.1);
  T.put([hx, hy, z + 13], T.tubeStr([[px, py, z + 13], [hx, hy, z + 13]], 0.6, { tone: "mid" }), 7);
  T.put([hx, hy, z + 13], T.S(k.cylinder(hx, hy, 0.5, z + 7.4, 5.6, T.P, 6), { tone: "hi", crease: "none" }) + T.S(G.sphereOf([hx, hy, z + 6.6], 1.5, T.P, { steps: 20 }), { tone: "hi" }), 7.2, { part: name });
  T.part(name, "nod", { pivot: T.at([hx, hy, z + 13]).map((n) => Number(n.toFixed(1))), amp: 38 });
  if (to) T.put([px, py, 0], k.wireSvg(T.at([px, py, 0]), T.at([to[0], to[1], 0]), { tone: "lo", size: 1 }), -900);
}

// ---------- the orrery: everything turns round the World ----------
function orrery() {
  const R = 132, WIDTH = 680, HEIGHT = 500;
  const edge = Array.from({ length: 24 }, (_, i) => polar(R, i * 15, -10));
  const T = scene(WIDTH, HEIGHT, [...edge, [0, 0, 104], polar(110, -14, 66), polar(52, 225, 92)]);
  T.round(R);
  const REST = 7.6; // the moment the still picture shows, in seconds

  // the centre: two gears, the column, the World
  T.gear(0, 0, 0, 26, 14, "gearA");
  T.gear(...polar(38.6, 118), 0, 15, 8, "gearB", { turn: -1 });
  T.post(0, 0, 5, 47, 3);
  const W = [0, 0, 70], WR = 22;
  T.world(W, WR);

  // the Orbiter, flying round the World
  const ORBIT = { r: 52, z: 80, period: 11 };
  const orbitPts = T.orbit(W, ORBIT.r, ORBIT.z).slice(0, -1);
  const tracks = { orbit: { pts: flat(orbitPts), period: ORBIT.period, closed: true } };
  const links = [{ part: "beam", mover: "saucer", off: [0, 0, -1], ball: W, r: WR }];
  const saucerRest = trackAt(tracks.orbit, REST);
  T.saucer(saucerRest, "saucer", linkSvg(T, links[0], saucerRest, "hm-beam"));

  // the ring track the Audios run on
  const TR = 76, TZ = 14, LAP = 16, BALLS = 4;
  const ring = G.arcPoints(UP([0, 0, TZ]), 0, TR, 0, TAU, 96).slice(0, -1);
  for (const f of [0.959, 1.041]) T.wire(ring.map(([x, y, z]) => [x * f, y * f, z]), { closed: true, max: 16, bias: -6 });
  ring.forEach((p, i) => { if (i % 3 === 0) T.put(p, `<path class="iso-line" data-tone="mid" d="${T.path3([[p[0] * 0.959, p[1] * 0.959, p[2]], [p[0] * 1.041, p[1] * 1.041, p[2]]])}"/>`, -6.5); });
  for (let i = 0; i < 10; i++) T.post(...polar(TR, i * 36 + 2), 0, TZ - 0.6, 0.9, "lo");
  // a lap starts at 180° and runs with the angle falling: past the Collection, the xPlorer, the bars, the sprout, the orchid
  const lap = Array.from({ length: 120 }, (_, i) => polar(TR, 180 - i * 3, TZ + 3.9));
  tracks.ring = { pts: flat(lap), period: LAP, closed: true };
  const movers = [{ name: "saucer", track: "orbit", offset: 0, rest: saucerRest, bias: 6 }];
  for (let i = 0; i < BALLS; i++) {
    const offset = (i * LAP) / BALLS, rest = trackAt(tracks.ring, REST + offset);
    T.ball(rest, "ball" + i, BALL_BIAS);
    movers.push({ name: "ball" + i, track: "ring", offset, rest, bias: BALL_BIAS });
  }

  // round the edge, in the order a ball meets them
  const AT = { cabinet: 186, console: 124, bars: 90, sprout: 40, orchid: -14 };
  const cab = polar(100, AT.cabinet);
  T.cabinet(cab[0], cab[1]);
  const con = polar(108, AT.console);
  T.console(con[0], con[1]);
  const barAt = polar(106, AT.bars);
  const tops = T.bars(barAt[0] - 16.5, barAt[1], 9, 4, { step: 11 });
  const sp = polar(108, AT.sprout);
  T.sprout(sp[0], sp[1]);
  const or = polar(110, AT.orchid);
  T.orchid(or[0], or[1], 0, { size: 1.05 });

  // what each passing ball sets off
  const when = (deg) => ((((180 - deg) % 360) + 360) % 360) / 360 * LAP;
  trigger(T, AT.console, TR, TZ, "flagA", [con[0] + 4, con[1] - 14]);
  trigger(T, AT.bars, TR, TZ, "flagB", [barAt[0], barAt[1] - 13]);
  trigger(T, AT.sprout, TR, TZ, "flagC", [sp[0] - 5, sp[1] - 5]);
  trigger(T, AT.orchid, TR, TZ, "flagD", [or[0] - 6, or[1] - 3]);
  T.part("beam", "glow", { base: 0.45 });
  const events = [
    { at: when(AT.cabinet), part: "drawer", dur: 1.4, voice: "knock" },
    { at: when(AT.console), part: "flagA", dur: 0.9, voice: "tick" }, { at: when(AT.console) + 0.12, part: "lever", dur: 1, voice: "lever" },
    { at: when(AT.bars), part: "flagB", dur: 0.9, voice: "tick" }, ...tops.map((_, i) => ({ at: when(AT.bars) + 0.12 + i * 0.16, part: "bar" + i, dur: 0.6, voice: "bar", step: i })), { at: when(AT.bars) + 0.2, part: "beam", dur: 1.6 },
    { at: when(AT.sprout), part: "flagC", dur: 0.9, voice: "tick" }, { at: when(AT.sprout) + 0.12, part: "sprout", dur: 1.3, voice: "grow" },
    { at: when(AT.orchid), part: "flagD", dur: 0.9, voice: "tick" }, { at: when(AT.orchid) + 0.12, part: "bloom", dur: 1.3, voice: "bloom" },
  ].map((e) => ({ track: "ring", ...e }));
  const spin = [{ part: "gearA", period: ORBIT.period / 14 }, { part: "gearB", period: ORBIT.period / 14 }];

  const label = LABEL;
  return { name: "orrery", width: WIDTH, height: HEIGHT, T, label, data: { camera: T.camera(), rest: REST, tracks, movers, links, events, spin, parts: T.parts } };
}

// ---------- the tower: the same chain, top to bottom, for a narrow column ----------
function tower() {
  const DECK = { x: -80, y: -80, w: 160, d: 160, r: 12 }, WIDTH = 420, HEIGHT = 690;
  const T = scene(WIDTH, HEIGHT, [...k.boxCorners(DECK, -12, 0), [0, -14, 268], [-80, 0, 262]], { pad: 16 });
  T.deck(DECK);
  const LANE = 4, MAST = [0, -14];
  T.put([MAST[0], MAST[1], 262], T.S(G.sphereOf([MAST[0], MAST[1], 263], 3.4, T.P, { steps: 28 }), { tone: "hi" }), 0.2);
  T.put([MAST[0], MAST[1], 0], T.S(k.cylinder(MAST[0], MAST[1], 8, 0, 2, T.P, 24, 0.4), { tone: "mid" }), -0.2);

  // top shelf: the Collection
  const Z1 = 214, Z2 = 154, Z3 = 96;
  // the mast, in lengths between the shelves so each paints over the shelf below it
  [[0, Z3 - 3], [Z3, Z2 - 3], [Z2, Z1 - 3], [Z1, 262]].forEach(([z0, z1]) => T.post(MAST[0], MAST[1], z0, z1, 2.6));
  T.shelf({ x: -80, y: -24, w: 86, d: 46, r: 4 }, Z1);
  const cab = T.cabinet(-50, LANE, Z1);
  const start = [cab.mouth[0] - 9, LANE, cab.mouth[2] + 3.6];
  const c1 = G.fillet([[cab.mouth[0] - 2, LANE, cab.mouth[2] - 4], [cab.mouth[0] + 14, LANE, cab.mouth[2] - 7], [20, LANE, Z2 + 27], [27, LANE, Z2 + 23]], 9);
  T.rails(c1);

  // second shelf: the bars, stepping down
  T.shelf({ x: -6, y: -24, w: 86, d: 46, r: 4 }, Z2);
  const tops = T.bars(32, LANE, Z2 + 18, 4, { step: 11, drop: 4, floor: Z2 });

  // off the bars, round and down to the third shelf: the xPlorer
  const LANE3 = 60;
  const c2 = G.fillet([[74, LANE, Z2 + 2], [88, LANE, Z2 - 2], [88, 34, Z2 - 18], [56, LANE3, Z3 + 22], [26, LANE3, Z3 + 7], [20, LANE3, Z3 + 5]], 10);
  T.rails(c2);
  T.shelf({ x: -22, y: -24, w: 44, d: 100, r: 4 }, Z3);
  T.console(0, 24, Z3);

  // off the shelf's end and down to the sprout
  const pot = [-56, 50];
  const c3 = G.fillet([[-24, LANE3, Z3 - 2], [-38, LANE3 + 4, Z3 - 20], [-50, LANE3, 46], [pot[0], pot[1] + 3, 34]], 9);
  T.rails(c3);
  const soil = T.sprout(pot[0], pot[1]);

  // the ground: the World and its Orbiter, a pair of gears, the orchid
  const W = [40, 40, 48], WR = 18;
  T.gear(W[0], W[1], 0, 15, 9, "gearA");
  T.gear(W[0] - 22.4, W[1], 0, 10, 6, "gearB", { turn: -1 });
  T.world(W, WR, { stand: 26.6 });
  const ORBIT = { r: 34, z: 56, period: 9 };
  const orbitPts = T.orbit(W, ORBIT.r, ORBIT.z).slice(0, -1);
  const tracks = { orbit: { pts: flat(orbitPts), period: ORBIT.period, closed: true } };
  const links = [{ part: "beam", mover: "saucer", off: [0, 0, -1], ball: W, r: WR }];
  const REST = 2.9;
  const saucerRest = trackAt(tracks.orbit, REST);
  T.saucer(saucerRest, "saucer", linkSvg(T, links[0], saucerRest, "hm-beam"));
  T.orchid(58, -56, 0, { size: 1 });

  // ---- the ball's way down, as [seconds, point] steps; sampled 30 times a second
  const lift = (points, dz = 3.5) => points.map(([x, y, z]) => [x, y, z + dz]);
  const along = (points, t0, t1, ease = 1) => ({ t0, t1, at: (u) => G.pointAlong(points, G.pathLength(points) * u ** ease) });
  const hop = (a, b, t0, t1, rise = 7) => ({ t0, t1, at: (u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u + rise * 4 * u * (1 - u)] });
  const HOP = 0.4, LAP = 9.6, BALLS = 3;
  const landed = tops.map(([x, y, z]) => [x, y, z + 3.6]);
  const r1 = lift(c1), r2 = lift(c2), r3 = lift(c3), lane = [[18, LANE3, Z3 + 3.6], [-22, LANE3, Z3 + 3.6]];
  const legs = [];
  let t = 0.5;
  legs.push({ t0: 0, t1: t, at: () => start });
  legs.push(hop(start, r1[0], t, (t += 0.5), 1));
  legs.push(along(r1, t, (t += 1.3), 1.7));
  legs.push(hop(r1[r1.length - 1], landed[0], t, (t += 0.25), 1.5));
  const hits = [t];
  for (let i = 1; i < landed.length; i++) { legs.push(hop(landed[i - 1], landed[i], t, (t += HOP))); hits.push(t); }
  legs.push(hop(landed[landed.length - 1], r2[0], t, (t += HOP), 5));
  legs.push(along(r2, t, (t += 2), 1.25));
  const onLane = t;
  legs.push(hop(r2[r2.length - 1], lane[0], t, (t += 0.15), 0.6));
  legs.push(along(lane, t, (t += 1.1)));
  legs.push(hop(lane[1], r3[0], t, (t += 0.2), 0.8));
  legs.push(along(r3, t, (t += 1.3), 1.5));
  const planted = t + 0.35;
  legs.push(hop(r3[r3.length - 1], [soil[0], soil[1], soil[2] + 1], t, (t += 0.35), 1));
  legs.push({ t0: t, t1: LAP, at: () => [soil[0], soil[1], soil[2] + 1] });
  const where = (s) => { const leg = legs.find((l) => s < l.t1) ?? legs[legs.length - 1]; return leg.at(Math.min(1, Math.max(0, (s - leg.t0) / (leg.t1 - leg.t0 || 1)))); };
  const N = Math.round(LAP * 30);
  tracks.run = { pts: flat(Array.from({ length: N + 1 }, (_, i) => where((i / N) * LAP))), period: LAP, closed: false, fade: [0.45, planted, planted + 0.25] };
  const movers = [{ name: "saucer", track: "orbit", offset: 0, rest: saucerRest, bias: 6 }];
  for (let i = 0; i < BALLS; i++) {
    const offset = (i * LAP) / BALLS, rest = trackAt(tracks.run, REST + offset);
    T.ball(rest, "ball" + i, BALL_BIAS);
    movers.push({ name: "ball" + i, track: "run", offset, rest, bias: BALL_BIAS });
  }
  T.part("beam", "glow", { base: 0.45 });
  const events = [
    { at: 0.3, part: "drawer", dur: 1.3, voice: "knock" },
    ...hits.map((at, i) => ({ at, part: "bar" + i, dur: 0.6, voice: "bar", step: i })), { at: hits[0], part: "beam", dur: 2 },
    { at: onLane + 0.25, part: "lever", dur: 1, voice: "lever" },
    { at: planted, part: "sprout", dur: 1.4, voice: "grow" }, { at: planted + 0.5, part: "bloom", dur: 1.4, voice: "bloom" },
  ].map((e) => ({ track: "run", ...e }));
  const spin = [{ part: "gearA", period: ORBIT.period / 9 }, { part: "gearB", period: ORBIT.period / 9 }];

  const label = LABEL;
  return { name: "tower", width: WIDTH, height: HEIGHT, T, label, data: { camera: T.camera(), rest: REST, tracks, movers, links, events, spin, parts: T.parts } };
}

// ---- the page's side: it only moves what the build drew
const LIVE = `
${SHARED}
export function mount(root) {
  const svg = root.querySelector("svg"), layer = svg.querySelector("[data-layer]"), C = SCENE.camera;
  if (svg.dataset.build !== SCENE.build) throw new Error("the picture and its script are from different builds");
  const iso = (p) => [C.o[0] + p[0] * C.x[0] + p[1] * C.y[0] + p[2] * C.z[0], C.o[1] + p[0] * C.x[1] + p[1] * C.y[1] + p[2] * C.z[1]];
  const depth = (p) => p[0] * C.v[0] + p[1] * C.v[1] + p[2] * C.v[2];
  const fixed = [], moving = {};
  for (const el of Array.from(layer.children)) { if (el.dataset.mover) moving[el.dataset.mover] = el; else fixed.push({ el, k: Number(el.dataset.k) }); }
  const part = (name) => svg.querySelector('[data-part="' + name + '"]');
  const movers = SCENE.movers.map((m) => ({ ...m, el: moving[m.name], home: iso(m.rest), slot: -1, shift: [0, 0], at: m.rest }));
  const byName = Object.fromEntries(movers.map((m) => [m.name, m]));
  const links = SCENE.links.map((l) => ({ ...l, el: part(l.part) }));
  const parts = Object.entries(SCENE.parts).map(([name, spec]) => ({ name, ...spec, el: part(name), level: 0 })).filter((p) => p.el);
  const levelOf = Object.fromEntries(parts.map((p) => [p.name, p]));
  const spin = SCENE.spin.map((s) => ({ ...s, frames: Array.from(part(s.part).children), shown: 0 }));
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const n1 = (n) => n.toFixed(1);
  // write an attribute or a style only when it changes: most parts are at rest most of the time
  const written = new WeakMap();
  const write = (el, name, value) => { let seen = written.get(el); if (!seen) written.set(el, (seen = {})); if (seen[name] === value) return; seen[name] = value; if (name === "opacity") el.style.opacity = value; else el.setAttribute(name, value); };
  // put a mover where it is, and at its place in the back-to-front order
  function place(m, p) {
    const s = iso(p);
    m.at = p; m.shift = [s[0] - m.home[0], s[1] - m.home[1]];
    write(m.el, "transform", "translate(" + n1(m.shift[0]) + " " + n1(m.shift[1]) + ")");
    const key = depth(p) + m.bias;
    let lo = 0, hi = fixed.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (fixed[mid].k <= key) lo = mid + 1; else hi = mid; }
    if (lo !== m.slot) { m.slot = lo; layer.insertBefore(m.el, lo < fixed.length ? fixed[lo].el : null); }
  }
  // ---- sound: a part that answers a ball also sounds, while the page's switch is on
  let audio = null, out = null, master = null, sounding = false, primed = false;
  const ringing = new Set();
  // The music is not written down. One key (D major), four chords that move on each time the Orbiter
  // completes a lap, and every voice draws its notes from the chord of the moment, with some chance in it.
  // Each chord is its notes as semitones above D3, low to high.
  const CHORDS = [[0, 4, 7, 12, 14, 16, 19, 24], [0, 6, 7, 9, 12, 18, 19, 21], [2, 5, 9, 12, 14, 17, 21, 24], [2, 7, 11, 14, 16, 19, 23, 26]];
  const LAP = SCENE.tracks.orbit.period;
  let clock = 0, phrase = { from: 0, by: 1 };
  const chord = () => CHORDS[Math.floor(clock / LAP) % CHORDS.length];
  const hzOf = (semitones, cents = 0) => 146.83 * 2 ** ((semitones + cents / 100) / 12);
  const any = (n) => Math.floor(Math.random() * n);
  const near = (spread) => (Math.random() * 2 - 1) * spread;
  function tone(type, hz, peak, attack, decay, { to = 0, after = 0, pan = 0 } = {}) {
    const t0 = audio.currentTime + 0.01 + after, osc = audio.createOscillator(), gain = audio.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(hz, t0);
    if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + attack + decay * 0.7);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(peak, t0 + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
    let last = osc.connect(gain);
    if (pan && audio.createStereoPanner) { const side = audio.createStereoPanner(); side.pan.value = pan; last = last.connect(side); }
    last.connect(out);
    osc.start(t0); osc.stop(t0 + attack + decay + 0.05);
  }
  // the mallet: a few milliseconds of filtered noise
  function tap(peak) {
    const t0 = audio.currentTime + 0.01, length = Math.floor(audio.sampleRate * 0.02);
    const buffer = audio.createBuffer(1, length, audio.sampleRate), data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2;
    const source = audio.createBufferSource(), band = audio.createBiquadFilter(), gain = audio.createGain();
    source.buffer = buffer; band.type = "bandpass"; band.frequency.value = 1400; band.Q.value = 0.8; gain.gain.value = peak;
    source.connect(band).connect(gain).connect(out);
    source.start(t0);
  }
  function play(e) {
    const notes = chord();
    if (e.voice === "bar") {
      // each pass chooses where on the chord the four bars start and how far apart they step; the longest bar stays the lowest
      if (e.step === 0) { const by = Math.random() < 0.3 ? 2 : 1; phrase = { from: any(notes.length - 3 * by), by }; }
      const hz = hzOf(notes[Math.min(notes.length - 1, phrase.from + e.step * phrase.by)], near(4)), hit = 0.8 + Math.random() * 0.35;
      // a mallet bar: the note, its two tuned overtones (4 and 10 times, as on a marimba) dying fast, and the mallet's tap
      tone("sine", hz, 0.2 * hit, 0.003, 1.3);
      tone("sine", hz * 4, 0.05 * hit, 0.002, 0.22);
      tone("sine", hz * 10, 0.014 * hit, 0.001, 0.06);
      tap(0.05 * hit);
    } else if (e.voice === "tick") tone("triangle", 1900 + near(250), 0.05, 0.001, 0.04);
    else if (e.voice === "knock") tone("sine", 150, 0.45, 0.004, 0.16, { to: 80 });
    else if (e.voice === "lever") {
      // two notes of the chord, a step apart, up or down
      const low = 1 + any(notes.length - 3), up = Math.random() < 0.7, pair = up ? [low, low + 2] : [low + 2, low];
      pair.forEach((index, i) => tone("triangle", hzOf(notes[index] + 12), 0.14, 0.004, 0.13, { after: i * 0.09 }));
    } else if (e.voice === "grow") {
      // a glide up one octave, from a note of the chord
      const from = hzOf(notes[any(4)] + 12);
      tone("sine", from, 0.18, 0.05, 0.6, { to: from * 2 });
    } else if (e.voice === "bloom") {
      // the orchid opens: five bells strummed upward through the chord, never quite the same way twice.
      // Each bell is its note, a soft octave under it for body, and a bright overtone (2.76 times) that fades at once.
      const from = any(notes.length - 4);
      let after = 0;
      for (let i = 0; i < 5; i++) {
        const hz = hzOf(notes[from + i] + 12, near(5)), pan = (i / 4 - 0.5) * 0.9, ring = 2.2 + i * 0.25;
        tone("sine", hz, 0.085, 0.012, ring, { after, pan });
        tone("sine", hz / 2, 0.03, 0.03, ring * 0.7, { after, pan });
        tone("sine", hz * 2.76, 0.016, 0.004, 0.35, { after, pan });
        after += 0.075 + Math.random() * 0.06;
      }
    }
  }
  function sound(on) {
    sounding = on;
    if (on && !audio) {
      audio = new (window.AudioContext || window.webkitAudioContext)();
      master = audio.createGain(); master.gain.value = 0; master.connect(audio.destination);
      out = audio.createGain(); out.gain.value = 0.5; out.connect(master);
      // a little room: one soft echo
      const echo = audio.createDelay(1), back = audio.createGain(), wet = audio.createGain();
      echo.delayTime.value = 0.27; back.gain.value = 0.28; wet.gain.value = 0.3;
      out.connect(echo); echo.connect(back).connect(echo); echo.connect(wet).connect(master);
    }
    if (!audio) return;
    // off is a quick fade, not a stop: whatever is ringing dies away unheard instead of coming back later
    if (on) audio.resume().catch(() => {});
    master.gain.cancelScheduledValues(audio.currentTime);
    master.gain.setTargetAtTime(on ? 1 : 0, audio.currentTime, 0.03);
  }
  function draw(t) {
    clock = t;
    for (const m of movers) {
      const track = SCENE.tracks[m.track], local = (((t + m.offset) % track.period) + track.period) % track.period;
      place(m, trackAt(track, local));
      if (track.fade) write(m.el, "opacity", Math.min(1, local / track.fade[0], Math.max(0, 1 - (local - track.fade[1]) / (track.fade[2] - track.fade[1]))).toFixed(1));
    }
    for (const l of links) {
      const m = byName[l.mover], [a, b] = linkEnds(l, m.at).map(iso);
      write(l.el, "d", "M" + n1(a[0] - m.shift[0]) + " " + n1(a[1] - m.shift[1]) + "L" + n1(b[0] - m.shift[0]) + " " + n1(b[1] - m.shift[1]));
    }
    for (const p of parts) p.level = 0;
    SCENE.events.forEach((e, index) => {
      const track = SCENE.tracks[e.track], p = levelOf[e.part];
      if (!p) return;
      for (const m of movers) {
        if (m.track !== e.track) continue;
        const since = ((((t + m.offset - e.at) % track.period) + track.period) % track.period) / e.dur, id = index + m.name;
        if (since >= 1) { ringing.delete(id); continue; }
        p.level = Math.max(p.level, Math.sin(Math.PI * since) * (1 - 0.5 * since));
        // it sounds once, as it starts (and not for what was already under way on the first frame)
        if (!ringing.has(id)) { ringing.add(id); if (e.voice && sounding && primed) play(e); }
      }
    });
    primed = true;
    for (const p of parts) {
      const b = p.level;
      if (p.kind === "dip") write(p.el, "transform", "translate(0 " + n1(p.amp * b) + ")");
      else if (p.kind === "nod") write(p.el, "transform", "rotate(" + n1(p.amp * b) + " " + p.pivot[0] + " " + p.pivot[1] + ")");
      else if (p.kind === "grow") write(p.el, "transform", "translate(" + p.pivot[0] + " " + p.pivot[1] + ") scale(" + (1 + p.amp * b).toFixed(3) + ") translate(" + -p.pivot[0] + " " + -p.pivot[1] + ")");
      else if (p.kind === "slide") write(p.el, "transform", "translate(" + n1(p.vec[0] * b) + " " + n1(p.vec[1] * b) + ")");
      else if (p.kind === "glow") write(p.el, "opacity", (p.base + (1 - p.base) * b).toFixed(2));
    }
    for (const s of spin) {
      const show = Math.floor((((t / s.period) % 1) + 1) % 1 * s.frames.length);
      if (show !== s.shown) { s.frames[s.shown].style.display = "none"; s.frames[show].style.display = ""; s.shown = show; }
    }
  }
  let t = SCENE.rest, frame = 0, last = 0, visible = false, paused = false;
  function tick(now) {
    t += last ? Math.min((now - last) / 1000, 1 / 20) : 0;
    last = now;
    draw(t);
    frame = visible && !paused && !still.matches ? requestAnimationFrame(tick) : 0;
  }
  const run = () => { if (!frame && visible && !paused && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
  const seen = new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; run(); }, { rootMargin: "120px 0px" });
  seen.observe(svg);
  still.addEventListener("change", run);
  draw(t);
  const unmount = () => { seen.disconnect(); still.removeEventListener("change", run); cancelAnimationFrame(frame); visible = false; sounding = false; audio?.close().catch(() => {}); };
  // the page's two buttons: pause, and sound (sound(true) must come from a click, as browsers ask)
  unmount.pause = (on) => { paused = on; run(); };
  unmount.sound = sound;
  return unmount;
}
`;

mkdirSync(OUT, { recursive: true });
for (const make of [orrery, tower]) {
  if (ONLY && make.name !== ONLY) continue;
  const { name, T, label, data, width } = make();
  // The picture and the script are two files that must come from one build: both carry its id, and the script checks.
  const build = createHash("sha256").update(T.svg(label, { style: CSS }) + JSON.stringify(data)).digest("hex").slice(0, 10);
  const picture = (theme) => T.svg(label, { style: CSS, standalone: theme }).replace("<svg ", `<svg data-build="${build}" `);
  for (const theme of ["dark", "light"]) writeFileSync(join(OUT, `${name}-${theme}.svg`), picture(theme));
  const live = `const SCENE = ${JSON.stringify({ build, ...data })};\n${LIVE}`;
  writeFileSync(join(OUT, `${name}.js`), `// Built by figures/src/home-machine/build.mjs. Do not edit by hand.\n${live}`);
  const stage = picture("dark");
  if (process.argv.includes("--sizes")) console.log([...T.items].sort((a, b) => b.svg.length - a.svg.length).slice(0, 10).map((i) => `${(i.svg.length / 1024).toFixed(1)}K ${i.part ?? i.mover ?? i.svg.slice(0, 40)}`).join("\n"), "\ntubes", (T.items.filter((i) => i.svg.includes('class="tb')).reduce((n, i) => n + i.svg.length, 0) / 1024).toFixed(0), "K");
  console.log("wrote", name, `${(stage.length / 1024).toFixed(0)} KB drawing, ${(JSON.stringify(data).length / 1024).toFixed(0)} KB data, ${T.items.length} items`);
  if (PREVIEW) {
    for (const theme of ["dark", "light"]) {
      const page = k.pageHtml({ title: label, theme, width, body: `<div id="fig" class="iso-stage">${picture(theme)}</div>`, script: `${live.replace("export function mount", "function mount")}\nwindow.figure = mount(document.getElementById("fig"));\n// #sound: a check for the captures. It turns the sound on and reports how many voices started in 6 s.\nif (location.hash === "#sound") { let n = 0; const make = AudioContext.prototype.createOscillator; AudioContext.prototype.createOscillator = function () { n += 1; return make.call(this); }; window.figure.sound(true); setTimeout(() => console.error("voices started: " + n), 6000); }` });
      writeFileSync(join(HERE, `preview-${name}-${theme}.html`), page);
    }
  }
}
