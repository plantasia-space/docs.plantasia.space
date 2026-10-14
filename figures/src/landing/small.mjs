// The small figures: the five rows (06), the Playground's three steps (04) and the music garden (03).
// Each is one object or one short chain from the home machine's parts, on its own deck.
// A row or a step plays one gesture wherever it is tapped (`elseTap`), as the canvas drawings did.
import { stage, beamSvg, flat, trackAt, uv, k, G, TAU } from "./stage.mjs";

const BALL_BIAS = 6;
const ringOf = (r, n, z) => Array.from({ length: n }, (_, i) => { const t = (i / n) * TAU; return [r * Math.cos(t), r * Math.sin(t), z]; });
const pad = (r, tall = 0) => [...ringOf(r, 24, -11), [0, 0, tall]];
const lap = (T, ring, name, period, balls, rest, data, { fade } = {}) => {
  data.tracks[name] = { pts: flat(ring), period, closed: !fade, ...(fade ? { fade } : {}) };
  for (let i = 0; i < balls; i++) {
    const offset = (i * period) / balls, at = trackAt(data.tracks[name], rest + offset);
    T.ball(at, name + i, BALL_BIAS);
    data.movers.push({ name: name + i, track: name, offset, rest: at, bias: BALL_BIAS });
  }
};
const blank = (rest) => ({ rest, tracks: {}, movers: [], links: [], events: [], spin: [] });
// the gesture each row plays (plantasia.space-root draw/rows.ts, ROW_TAPS)
const ROW_TAPS = ["glass", "strum", "stars", "breath", "spiral"];
const W = 340, H = 230;
// Beside each row's object, a small deck for its fungus (the page lays the illustration on it), the two
// joined by a cable: the thread of mycelium. `side`: -1 left, 1 right (draw/rows.ts alternates them).
const seat = (side) => { const [x, y] = uv(side * 92, 10); return ringOf(24, 12, -8).map(([a, b, z]) => [x + a, y + b, z]).concat([[x, y, 44]]); };
function fungus(T, side) {
  const [x, y] = uv(side * 92, 10);
  T.island(x, y, 24, 5);
  T.put([x, y, 0], T.L(k.ring(x, y, 13, 0, T.P, 30), { tone: "lo" }), -1990);
  T.cable(uv(side * 40, 6), uv(side * 80, 9));
  return T.anchor([x, y, 0]);
}

// I Orbiter: the craft over its pad, an Audio circling under its beam
function rowOrbiter() {
  const T = stage(W, H, [...pad(58, 86), ...seat(-1)], { pad: 10 });
  T.island(0, 0, 58);
  const sticker = fungus(T, -1);
  const data = blank(1.2);
  T.put([0, 0, 0], T.S(k.cylinder(0, 0, 14, 0, 3, T.P, 36, 0.5), { tone: "mid" }) + T.L(k.ring(0, 0, 9, 3, T.P, 32), { tone: "lo" }), -0.2);
  const at = [0, 0, 62];
  T.saucer(at, "craft", `<path data-part="beam" class="hm-beam" d="${T.path3([[0, 0, 58], [0, 0, 3]])}"/>`);
  T.part("beam", "glow", { base: 0.4 });
  const ring = ringOf(34, 72, 12);
  T.rails([...ring, ring[0]], { max: 12 });
  ring.forEach((p, i) => { if (i % 12 === 0) T.post(p[0], p[1], 0, 11.4, 0.9, "lo"); });
  lap(T, ring.map(([x, y, z]) => [x, y, z + 3.6]), "ball", 7, 2, data.rest, data);
  data.events.push({ track: "ball", at: 0, part: "beam", dur: 1.6 });
  return { name: "row-i", width: W, height: H, T, data: { ...data, anchors: { sticker }, elseTap: ROW_TAPS[0] } };
}

// II Audio (a track): a ball hops down the tuned bars
function rowTrack() {
  const T = stage(W, H, [...pad(58), [-44, 0, 52], [-22, -16, 30], ...seat(1)], { pad: 10 });
  T.island(0, 0, 58);
  const sticker = fungus(T, 1);
  const data = blank(0.9);
  const tops = T.bars(-22, 0, 26, 5, { step: 11, drop: 3.4 });
  const landed = tops.map(([x, y, z]) => [x, y, z + 3.6]);
  const from = [-40, 0, 44], to = [38, 0, 6], HOP = 0.42, pts = [];
  const hop = (a, b, n, rise) => { for (let i = 0; i < n; i++) { const u = i / n; pts.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u + rise * 4 * u * (1 - u)]); } };
  const stops = [from, ...landed, to];
  stops.slice(0, -1).forEach((p, i) => hop(p, stops[i + 1], 12, i === 0 ? 2 : 6));
  const period = stops.length * HOP + 1;
  for (let i = 0; i < Math.round((1 / HOP) * 12); i++) pts.push(to);
  lap(T, pts, "ball", period, 1, data.rest, data, { fade: [0.25, period - 1.1, period - 0.8] });
  const unit = period / pts.length;
  tops.forEach((_, i) => data.events.push({ track: "ball", at: (i + 1) * 12 * unit, part: "bar" + i, dur: 0.6 }));
  return { name: "row-ii", width: W, height: H, T, data: { ...data, anchors: { sticker }, elseTap: ROW_TAPS[1] } };
}

// III a Release: a sprout, growing each time an Audio lands in its pot
function rowRelease() {
  const T = stage(W, H, [...pad(58, 50), [-46, 0, 60], ...seat(-1)], { pad: 10 });
  T.island(0, 0, 58);
  const sticker = fungus(T, -1);
  const data = blank(1.5);
  const soil = T.sprout(0, 0, 0, { size: 1.5 });
  const chute = G.fillet([[-44, 0, 50], [-30, 0, 44], [-16, 0, 26], [-9, 0, 22]], 8);
  T.rails(chute, { max: 12 });
  T.post(-44, 0, 0, 49.4, 1.1);
  T.post(-24, 0, 0, 37, 0.9, "lo");
  const way = [...chute.map(([x, y, z]) => [x, y, z + 3.6]), [soil[0] - 2, soil[1], soil[2] + 2]];
  const pts = [...way, ...Array.from({ length: 10 }, () => way[way.length - 1])];
  lap(T, pts, "ball", 4.2, 1, data.rest, data, { fade: [0.3, 3.1, 3.5] });
  data.events.push({ track: "ball", at: 2.6, part: "sprout", dur: 1.4 });
  return { name: "row-iii", width: W, height: H, T, data: { ...data, anchors: { sticker }, elseTap: ROW_TAPS[2] } };
}

// IV an Entangled World, and the Orbiter that circles it
function rowWorld() {
  const T = stage(W, H, [...pad(58), [0, 0, 84], [-52, 0, 70], [52, 0, 70], ...seat(1)], { pad: 10 });
  T.island(0, 0, 58);
  const sticker = fungus(T, 1);
  const data = blank(2.2);
  const C = [0, 0, 46], R = 19;
  T.gear(0, 0, 0, 16, 10, "gearA");
  T.gear(-23.6, 0, 0, 9, 6, "gearB", { turn: -1 });
  T.world(C, R, { stand: 23.6 });
  const ORBIT = { r: 40, z: 62, period: 9 };
  data.tracks.orbit = { pts: flat(T.orbit(C, ORBIT.r, ORBIT.z).slice(0, -1)), period: ORBIT.period, closed: true };
  data.links.push({ part: "beam", mover: "saucer", off: [0, 0, -1], ball: C, r: R });
  const rest = trackAt(data.tracks.orbit, data.rest);
  T.saucer(rest, "saucer", beamSvg(T, data.links[0], rest));
  data.movers.push({ name: "saucer", track: "orbit", offset: 0, rest, bias: 6 });
  T.part("beam", "glow", { base: 0.5 });
  data.spin.push({ part: "gearA", period: ORBIT.period / 10 }, { part: "gearB", period: ORBIT.period / 10 });
  return { name: "row-iv", width: W, height: H, T, data: { ...data, anchors: { sticker }, elseTap: ROW_TAPS[3] } };
}

// V the instrument: the xPlorer's console, and six effects round it that light one after another
function rowInstrument() {
  const T = stage(W, H, [...pad(60, 44), ...seat(-1)], { pad: 10 });
  T.island(0, 0, 60);
  const sticker = fungus(T, -1);
  const data = blank(0.6);
  T.console(4, 8, 0);
  const ring = ringOf(47, 72, 9);
  data.tracks.round = { pts: flat(ring), period: 9, closed: true };
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU + 0.5, x = 4 + 42 * Math.cos(a) * 0.98, y = 8 + 40 * Math.sin(a);
    if (Math.hypot(x, y) > 52) continue;
    T.put([x, y, 0], T.S(k.cylinder(x, y, 4.6, 0, 2, T.P, 18, 0.3), { tone: "mid" }), -0.2);
    T.put([x, y, 2], T.S(k.cylinder(x, y, 3.2, 2, 3.4, T.P, 16, 0.3), { tone: "hi", crease: "lo" }) + T.D([T.at([x, y, 5.4])], { size: 0.5 }), 0.1, { part: "fx" + i });
    T.part("fx" + i, "dip", { amp: -2.6 });
    T.cable([x, y], [4 + (x - 4) * 0.5, 8 + (y - 8) * 0.5]);
    data.events.push({ track: "round", at: (i / 6) * 9, part: "fx" + i, dur: 1.2 });
  }
  // an unseen mover carries the round's clock
  T.put([0, 0, 0], "<g></g>", -4000, { mover: "clock" });
  data.movers.push({ name: "clock", track: "round", offset: 0, rest: ring[0], bias: -4000 });
  data.events.push({ track: "round", at: 0.4, part: "lever", dur: 1 }, { track: "round", at: 4.9, part: "lever", dur: 1 });
  return { name: "row-v", width: W, height: H, T, data: { ...data, anchors: { sticker }, elseTap: ROW_TAPS[4] } };
}

// ---- the Playground's three steps (draw/capitals.ts, drawStep): meet = bloom, jam = root, live = glass
const SW = 220, SH = 170;
// Meet in a room: the orchid, and Audios coming round to it
function stepMeet() {
  const T = stage(SW, SH, pad(44, 62), { pad: 8 });
  T.island(0, 0, 44);
  const data = blank(1);
  T.orchid(0, 0, 0, { size: 1.05 });
  const ring = ringOf(27, 60, 11);
  T.rails([...ring, ring[0]], { max: 12 });
  ring.forEach((p, i) => { if (i % 15 === 0) T.post(p[0], p[1], 0, 10.4, 0.9, "lo"); });
  lap(T, ring.map(([x, y, z]) => [x, y, z + 3.6]), "ball", 6, 3, data.rest, data);
  data.events.push({ track: "ball", at: 0, part: "bloom", dur: 1.4 });
  return { name: "step-meet", width: SW, height: SH, T, data: { ...data, elseTap: "bloom" } };
}
// Jam: three sprouts, an Audio passed from one to the next
function stepJam() {
  const T = stage(SW, SH, pad(46, 40), { pad: 8 });
  T.island(0, 0, 46);
  const data = blank(0.5);
  const at = [uv(-28, 6), uv(0, -10), uv(28, 6)];
  const soils = at.map(([x, y], i) => T.sprout(x, y, 0, { size: 0.82, name: "sprout" + i }));
  const tips = soils.map(([x, y, z]) => [x, y, z + 20]);
  const pts = [];
  [0, 1, 2].forEach((i) => { const a = tips[i], b = tips[(i + 1) % 3]; for (let j = 0; j < 20; j++) { const u = j / 20; pts.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u + 28 * u * (1 - u)]); } });
  lap(T, pts, "ball", 4.5, 1, data.rest, data);
  [0, 1, 2].forEach((i) => data.events.push({ track: "ball", at: i * 1.5, part: "sprout" + i, dur: 1.1 }));
  return { name: "step-jam", width: SW, height: SH, T, data: { ...data, elseTap: "root" } };
}
// Play live: the Orbiter on its stage, and the listeners in front of it
function stepLive() {
  const T = stage(SW, SH, pad(48, 52), { pad: 8 });
  T.island(0, 0, 48);
  const data = blank(1);
  const s = uv(0, -22);
  T.put([s[0], s[1], 0], T.S(k.cylinder(s[0], s[1], 15, 0, 4, T.P, 36, 0.5), { tone: "mid", inner: T.L(k.sideArc(s[0], s[1], 15, 2, T.P, 36), { tone: "faint" }) }) + T.L(k.ring(s[0], s[1], 10, 4, T.P, 30), { tone: "lo" }), -0.2);
  T.saucer([s[0], s[1], 34], "craft", `<path data-part="beam" class="hm-beam" d="${T.path3([[s[0], s[1], 30], [s[0], s[1], 4]])}"/>`);
  T.part("beam", "glow", { base: 0.4 });
  [[-30, 12], [-10, 22], [12, 22], [32, 12], [-20, 34], [22, 34]].forEach(([a, b], i) => { const [x, y] = uv(a, b); T.listener(x, y, 0, "listener" + i, { h: 15 }); T.part("listener" + i, "dip", { amp: -1.6 }); data.events.push({ track: "beat", at: (i % 3) * 0.5, part: "listener" + i, dur: 0.9 }); });
  data.tracks.beat = { pts: flat([[0, 0, 0], [0, 0, 0]]), period: 3, closed: true };
  T.put([0, 0, 0], "<g></g>", -4000, { mover: "clock" });
  data.movers.push({ name: "clock", track: "beat", offset: 0, rest: [0, 0, 0], bias: -4000 });
  data.events.push({ track: "beat", at: 0, part: "beam", dur: 1.4 });
  return { name: "step-live", width: SW, height: SH, T, data: { ...data, elseTap: "glass" } };
}

// ---- 03 the music garden: a bed of sprouts, tallest in the middle, an Audio running along its front.
// what a sprout plays, by its place in the row (draw/garden.ts, SPROUT_TAPS; draw/scenes.ts starts at k + 1)
const SPROUT_TAPS = ["glass", "strum", "breath", "bell"];
function bed({ name, WIDTH, HEIGHT, half, n }) {
  const deep = 26, ring = [uv(-half, -deep), uv(half, -deep), uv(half, deep), uv(-half, deep)];
  const T = stage(WIDTH, HEIGHT, [...ring.map(([x, y]) => [x, y, -10]), [0, 0, 96]], { pad: 12 });
  const data = blank(1.4);
  T.put([ring[0][0], ring[0][1], -8], `<path class="iso-halo" d="${k.extrude(ring, -11, 8, T.P).fill}"/>`, -3000);
  T.put([ring[0][0], ring[0][1], -8], T.S(k.extrude(ring, -8, 8, T.P, { bevel: 1.2 }), { tone: "mid", inner: T.L(k.ringSeam(ring, -4, T.P), { tone: "faint" }) }), -2000);
  const rail = Array.from({ length: 61 }, (_, i) => uv(-half + 8 + ((half - 8) * 2 * i) / 60, deep - 7, 9));
  T.rails(rail, { max: 14 });
  rail.forEach((p, i) => { if (i % 10 === 5) T.post(p[0], p[1], 0, 8.4, 0.9, "lo"); });
  const there = rail.map(([x, y, z]) => [x, y, z + 3.6]), period = n * 1.3;
  lap(T, [...there, ...there.slice().reverse()], "ball", period * 2, 2, data.rest, data);
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n, a = -half + 14 + (half - 14) * 2 * u, near = 1 - Math.abs(u - 0.5) * 2;
    const size = 0.8 + 1.25 * near * (0.6 + 0.4 * Math.sin(i * 2.1)) + (i % 3 ? 0 : 0.15);
    const [x, y] = uv(a, -5 + (i % 2 ? -8 : 4));
    if (i === Math.floor(n / 2)) T.tapped({ tap: SPROUT_TAPS[(i + 1) % 4], kick: "bloom", pad: [[x, y, 60], 14] }, () => T.orchid(x, y, 0, { size: 1.7 }));
    else T.tapped({ tap: SPROUT_TAPS[(i + 1) % 4], kick: "sprout" + i, pad: [[x, y, 18 * size], 11] }, () => T.sprout(x, y, 0, { size, name: "sprout" + i }));
    const part = i === Math.floor(n / 2) ? "bloom" : "sprout" + i;
    data.events.push({ track: "ball", at: u * period, part, dur: 1.2 }, { track: "ball", at: (2 - u) * period, part, dur: 1.2 });
  }
  return { name, width: WIDTH, height: HEIGHT, T, data };
}
const musicGarden = () => bed({ name: "music-garden", WIDTH: 900, HEIGHT: 330, half: 225, n: 11 });
const musicGardenNarrow = () => bed({ name: "music-garden-narrow", WIDTH: 390, HEIGHT: 300, half: 118, n: 7 });

export const small = [rowOrbiter, rowTrack, rowRelease, rowWorld, rowInstrument, stepMeet, stepJam, stepLive, musicGarden, musicGardenNarrow];
