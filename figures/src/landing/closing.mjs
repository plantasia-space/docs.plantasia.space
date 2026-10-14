// 07 Closing: the Entangled World, large, on its deck. Two rings of track round it carry what the old
// drawing had in orbit: the Orbiter (with its beam to the World), a moon and four solids. The orchid,
// Plantasia Space, stands beside it (where the hawk watched from).
// Taps: the World = tone (the page walks the scale across it) · the orchid = root · anywhere else = gong.
import { stage, beamSvg, flat, trackAt, uv, k, G, TAU } from "./stage.mjs";

function world({ name, WIDTH, HEIGHT, R, WR }) {
  const C = [0, 0, WR + 30];
  const T = stage(WIDTH, HEIGHT, [...Array.from({ length: 24 }, (_, i) => [R * Math.cos((i / 24) * TAU), R * Math.sin((i / 24) * TAU), -11]), [0, 0, C[2] + WR * 1.5], ...[-1, 1].map((s) => uv(s * WR * 2.5, 0, C[2] + 20))], { pad: 14 });
  T.island(0, 0, R);
  const REST = 2.6;
  T.gear(0, 0, 0, WR * 0.62, 14, "gearA");
  T.gear(...uv(-WR * 0.62 - 9.4, 0), 0, 10, 7, "gearB", { turn: -1 });
  // the stand is put first and is not part of the World that plays
  const before = T.items.length;
  T.world(C, WR, { stand: 26.6 });
  T.tag(before + 2, { tap: "tone", kick: "beam", whole: "world" });

  const tracks = {}, movers = [], links = [];
  const orbit = (r, z, period, back) => { const pts = T.orbit(C, r, z).slice(0, -1); return { pts: flat(back ? pts.reverse() : pts), period, closed: true }; };
  tracks.near = orbit(WR * 2.3, C[2] + 16, 22);
  tracks.far = orbit(WR * 1.75, C[2] - 8, 15, true);
  links.push({ part: "beam", mover: "saucer", off: [0, 0, -1], ball: C, r: WR });
  const at = trackAt(tracks.near, REST);
  T.saucer(at, "saucer", beamSvg(T, links[0], at));
  movers.push({ name: "saucer", track: "near", offset: 0, rest: at, bias: 6 });
  T.part("beam", "glow", { base: 0.5 });
  // what else is in orbit: a moon, and four solids
  const body = (name, track, offset, make) => { const p = trackAt(tracks[track], REST + offset); T.put(p, make(p), 4, { mover: name }); movers.push({ name, track, offset, rest: p, bias: 4 }); };
  const cube = (s) => ([x, y, z]) => T.S(k.slabOf({ x: x - s, y: y - s, w: s * 2, d: s * 2, r: 0.8 }, z - s, s * 2, T.P, 2, 0.4), { tone: "hi", crease: "lo" });
  const gem = (s, n) => ([x, y, z]) => T.S(k.extrude(k.circleRing(x, y, s, n), z - s * 0.8, s * 1.6, T.P), { tone: "hi", crease: "lo" });
  body("moon", "near", 11, (p) => T.S(G.sphereOf(p, 5, T.P, { steps: 32 }), { tone: "hi" }));
  body("solidA", "near", 5.5, gem(5.5, 6));
  body("solidB", "near", 16.5, cube(3.8));
  body("solidC", "far", 2, gem(4.6, 5));
  body("solidD", "far", 9.5, cube(4.2));

  const o = uv(-R * 0.66, R * 0.36);
  T.tapped({ tap: "root", kick: "bloom", pad: [[o[0], o[1], 34], 16] }, () => T.orchid(o[0], o[1], 0, { size: 1.15 }));
  // a perch on the left, for the hawk that watches (the page lays it there)
  const h = uv(-R * 0.74, -R * 0.12);
  const anchors = { sticker: T.anchor(T.perch(h[0], h[1], 0, { h: WR * 1.05, half: WR * 0.42 })) };
  const events = [{ track: "near", at: 0, part: "bloom", dur: 2.2 }, { track: "far", at: 0, part: "beam", dur: 2 }];
  const spin = [{ part: "gearA", period: 1.6 }, { part: "gearB", period: 1.6 }];
  return { name, width: WIDTH, height: HEIGHT, T, data: { rest: REST, tracks, movers, links, events, spin, anchors, elseTap: "gong" } };
}
export const closing = () => world({ name: "closing", WIDTH: 900, HEIGHT: 470, R: 150, WR: 52 });
export const closingNarrow = () => world({ name: "closing-narrow", WIDTH: 390, HEIGHT: 330, R: 96, WR: 34 });
