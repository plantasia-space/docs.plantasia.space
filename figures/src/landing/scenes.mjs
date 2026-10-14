// The scenes that keep their illustration (PLA-518's pictures from old books: the birds, the meadow,
// the winter flowers). The page lays the illustration over the figure at `anchors.sticker*`; the
// figure is what used to be drawn round it in lines: the ground, the plants, the vine, the threads.
//   perch: the bird's branch is a perch, and its vine a pair of rails an Audio rolls down into the garden
//   converge: both illustrations stand on their own deck, and Audios run in from each to the Orbiter
import { stage, flat, trackAt, uv, k, G, TAU } from "./stage.mjs";

const BALL_BIAS = 6;
// what a sprout plays, by its place in the row (plantasia.space-root draw/garden.ts, SPROUT_TAPS)
const SPROUT_TAPS = ["glass", "strum", "breath", "bell"];
const ringOf = (cx, cy, r, z) => Array.from({ length: 16 }, (_, i) => [cx + r * Math.cos((i / 16) * TAU), cy + r * Math.sin((i / 16) * TAU), z]);

// `side`: 1 puts the perch on the left (the brown birds), -1 on the right (the hummingbird)
function perch(name, side, kinds) {
  const WIDTH = 520, HEIGHT = 300, A = 96;
  const P0 = uv(-side * A, -8), G0 = uv(side * 74, 6);
  const T = stage(WIDTH, HEIGHT, [...ringOf(P0[0], P0[1], 46, -10), ...ringOf(G0[0], G0[1], 66, -10), [P0[0], P0[1], 132]], { pad: 12 });
  T.island(P0[0], P0[1], 46);
  T.island(G0[0], G0[1], 66);
  const data = { rest: 2.1, tracks: {}, movers: [], links: [], events: [], spin: [] };
  // the perch: a post, a bar across its top for the branch to lie on
  const TOP = 74;
  T.put([P0[0], P0[1], 0], T.S(k.cylinder(P0[0], P0[1], 7, 0, 2, T.P, 24, 0.4), { tone: "mid" }), -0.2);
  T.post(P0[0], P0[1], 2, TOP, 1.6, "hi");
  const bar = [-1, 1].map((s) => [...uv(-side * A + s * 26, -8), TOP]);
  T.put([P0[0], P0[1], TOP], T.tubeStr(bar, 1.1, { tone: "hi" }), 0.3);
  // the vine: rails from the end of the bar down to the garden
  const from = [...uv(-side * (A - 26), -8), TOP - 2];
  const vine = G.fillet([from, [...uv(-side * 44, -4), TOP - 14], [...uv(side * 4, 4), 30], [...uv(side * 30, 8), 22]], 12);
  T.rails(vine, { max: 12 });
  T.post(...uv(side * 4, 4), 0, 28.6, 0.9, "lo");
  const spots = [[side * 44, 14, 1.25], [side * 82, -12, 0.95], [side * 110, 18, 1.1]].map(([a, b, size], i) => {
    const [x, y] = uv(a, b);
    const soil = T.tapped({ tap: SPROUT_TAPS[kinds[i]], kick: "sprout" + i, pad: [[x, y, 18 * size], 12] }, () => T.sprout(x, y, 0, { size, name: "sprout" + i }));
    return [soil[0], soil[1], soil[2] + 16 * size];
  });
  const pts = vine.map(([x, y, z]) => [x, y, z + 3.6]);
  const hop = (a, b, rise) => { for (let j = 0; j < 14; j++) { const u = j / 14; pts.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u + rise * 4 * u * (1 - u)]); } };
  const down = pts.length;
  hop(pts[pts.length - 1], spots[0], 3);
  hop(spots[0], spots[1], 7);
  hop(spots[1], spots[2], 7);
  for (let j = 0; j < 12; j++) pts.push(spots[2]);
  const period = 7;
  data.tracks.vine = { pts: flat(pts), period, closed: false, fade: [0.4, period - 0.9, period - 0.5] };
  const rest = trackAt(data.tracks.vine, data.rest);
  T.ball(rest, "ball", BALL_BIAS);
  data.movers.push({ name: "ball", track: "vine", offset: 0, rest, bias: BALL_BIAS });
  spots.forEach((_, i) => data.events.push({ track: "vine", at: ((down + 14 * (i + 1)) / pts.length) * period, part: "sprout" + i, dur: 1.2, voice: "grow" }));
  return { name, width: WIDTH, height: HEIGHT, T, data: { ...data, anchors: { sticker: T.anchor([P0[0], P0[1], TOP]) } } };
}

function converge() {
  const WIDTH = 1000, HEIGHT = 380, SIDE = 236;
  const L = uv(-SIDE, 0), R = uv(SIDE, 0);
  const T = stage(WIDTH, HEIGHT, [...ringOf(L[0], L[1], 62, -10), ...ringOf(R[0], R[1], 62, -10), ...ringOf(0, 0, 84, -10), [0, 0, 96], [L[0], L[1], 150], [R[0], R[1], 150]], { pad: 12 });
  T.island(L[0], L[1], 62);
  T.island(R[0], R[1], 62);
  T.island(0, 0, 84);
  const data = { rest: 1.3, tracks: {}, movers: [], links: [], events: [], spin: [] };
  // where they meet: one Orbiter over its pad
  T.put([0, 0, 0], T.S(k.cylinder(0, 0, 18, 0, 4, T.P, 40, 0.5), { tone: "mid", inner: T.L(k.sideArc(0, 0, 18, 2, T.P, 40), { tone: "faint" }) }) + T.L(k.ring(0, 0, 12, 4, T.P, 32), { tone: "lo" }), -0.2);
  T.tapped({ tap: "glass", kick: "beam" }, () => T.saucer([0, 0, 66], "craft", `<path data-part="beam" class="hm-beam" d="${T.path3([[0, 0, 62], [0, 0, 4]])}"/>`));
  T.part("beam", "glow", { base: 0.4 });
  // a planter on each side deck, for the illustration to stand in
  for (const [x, y] of [L, R]) T.put([x, y, 0], T.S(k.cylinder(x, y, 30, 0, 5, T.P, 48, 0.6), { tone: "mid", inner: T.L(k.sideArc(x, y, 30, 2.5, T.P, 48), { tone: "faint" }) }) + T.L(k.ring(x, y, 25, 5, T.P, 40), { tone: "lo" }), -0.2);
  // the threads: rails from each side into the centre, an Audio running in along each
  [[-1, 14, "trk"], [1, 14, "wld"], [-1, -16, "orb"], [1, -16, "clip"]].forEach(([s, b, entity], i) => {
    const way = G.fillet([[...uv(s * (SIDE - 40), b), 16], [...uv(s * 150, b * 1.5), 14], [...uv(s * 80, b), 12], [...uv(s * 26, b * 0.5), 8]], 16);
    T.rails(way, { max: 14 });
    for (const a of [SIDE - 46, 70]) { const [x, y] = uv(s * a, b * (a > 100 ? 1 : 0.95)); T.post(x, y, 0, a > 100 ? 15 : 10.4, 0.9, "lo"); }
    const period = 6.2;
    data.tracks["in" + i] = { pts: flat(way.map(([x, y, z]) => [x, y, z + 3.6])), period, closed: false, fade: [0.5, period - 1, period - 0.4] };
    const offset = i * 1.55, rest = trackAt(data.tracks["in" + i], data.rest + offset);
    T.ball(rest, "ball" + i, BALL_BIAS);
    T.items[T.items.length - 1].svg = T.items[T.items.length - 1].svg.replace("lf-trk", "lf-" + entity);
    data.movers.push({ name: "ball" + i, track: "in" + i, offset, rest, bias: BALL_BIAS });
    data.events.push({ track: "in" + i, at: period - 1, part: "beam", dur: 1.2, voice: "swell" });
  });
  [[-58, 44, 0.9, 3], [58, 46, 1, 1]].forEach(([a, b, size, kind], i) => {
    const [x, y] = uv(a, b);
    T.tapped({ tap: SPROUT_TAPS[kind], kick: "sprout" + i, pad: [[x, y, 18 * size], 12] }, () => T.sprout(x, y, 0, { size, name: "sprout" + i }));
    data.events.push({ track: "in" + i, at: 5, part: "sprout" + i, dur: 1.2, voice: "grow" });
  });
  return { name: "converge", width: WIDTH, height: HEIGHT, T, data: { ...data, anchors: { stickerLeft: T.anchor([L[0], L[1], 5]), stickerRight: T.anchor([R[0], R[1], 5]) } } };
}

// draw/scenes.ts: the pair's plants in front are k = 3, 1, 2; the hummingbird's 3, 2, 1
export const scenes = [() => perch("perch-left", 1, [3, 1, 2]), () => perch("perch-right", -1, [3, 2, 1]), converge];
