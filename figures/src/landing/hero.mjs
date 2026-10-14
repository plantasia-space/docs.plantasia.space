// 01 Hero: the night garden as a machine. The tree stands at the centre and its flower carries the
// page's first invitation. Audios (balls) run a track round the garden and set off what they pass:
// the sprouts, the bars, the bells, the gong (the old drawing's moon). The Orbiter circles its
// World, and a ball winds down the shell. Every old tap has its object:
//   flower = bloom · tree = strum · Orbiter = stars 6 · World = stars 9 · bars = stars 5 ·
//   shell = spiral · gong = gong · the two solids = bell · sprouts = glass, strum, breath, bell
// Two arrangements: `hero` (three decks in a row, wide screens) and `hero-narrow` (one deck, a phone).
import { stage, trigger, beamSvg, flat, trackAt, uv, k, G, TAU } from "./stage.mjs";

// what a sprout plays, by its place in the row (plantasia.space-root, draw/garden.ts, SPROUT_TAPS)
const SPROUT_TAPS = ["glass", "strum", "breath", "bell"];
const BALL_BIAS = 6;
// where along a closed track (0..1) it comes nearest a floor point
const nearest = (pts, [x, y]) => { let best = 0, bd = Infinity; pts.forEach((p, i) => { const d = Math.hypot(p[0] - x, p[1] - y); if (d < bd) { bd = d; best = i; } }); return best / pts.length; };

function garden(T, { treeAt, treeH }) {
  const tree = T.tapped({ tap: "strum", kick: [0, 1, 2, 3, 4].map((j) => `tree${j}@${(j * 0.09).toFixed(2)}`).join(",") }, () => T.tree(treeAt[0], treeAt[1], 0, { h: treeH }));
  // the flower is tagged apart from the tree: it is the last thing the tree put
  const flower = T.items[T.items.length - 1];
  flower.svg = flower.svg.replace('data-tap="strum"', 'data-tap="bloom"').replace(/data-kick="[^"]*"/, 'data-kick="bloom,invite"');
  // the invitation: a ring round the flower that lights as a ball passes
  const F = G.frameOf(tree.top, [0, 0, 1], [1, 0, 0], [0, 1, 0]);
  T.put(tree.top, `<path data-part="invite" class="hm-beam" d="${G.circleOf(F, treeH * 0.13, treeH * 0.25, T.P)}"/>`, 0.5);
  T.part("invite", "glow", { base: 0.3 });
  T.tag(T.items.length, { tap: "bloom", kick: "bloom,invite", pad: [[tree.top[0], tree.top[1], tree.top[2] + treeH * 0.13], treeH * 0.24] });
  return tree;
}

export function hero() {
  const WIDTH = 1040, HEIGHT = 372, TREE = 112;
  const SIDE = 170, R0 = 96, R1 = 66;
  const edge = (a, r) => Array.from({ length: 16 }, (_, i) => { const t = (i / 16) * TAU; return [...uv(a, 0).map((c, j) => c + r * (j ? Math.sin(t) : Math.cos(t))), -11]; });
  const T = stage(WIDTH, HEIGHT, [...edge(-SIDE, R1), ...edge(0, R0), ...edge(SIDE, R1), [0, 0, TREE * 1.32], uv(-SIDE, 0, 92)], { pad: 14 });
  T.island(...uv(-SIDE, 0), R1);
  T.island(...uv(0, 0), R0);
  T.island(...uv(SIDE, 0), R1);
  const REST = 3.2;

  const tree = garden(T, { treeAt: [0, 0], treeH: TREE });

  // ---- the track: one long loop over the three decks, bridging the gaps between them
  const A = 205, B = 45, TZ = 13, N = 180, LAP = 30, BALLS = 3;
  const loop = Array.from({ length: N }, (_, i) => { const t = (i / N) * TAU, c = Math.cos(t), s = Math.sin(t); return uv(A * Math.sign(c) * Math.abs(c) ** 0.72, B * Math.sign(s) * Math.abs(s) ** 0.72, TZ); });
  T.rails([...loop, loop[0]], { max: 14 });
  const onDeck = ([x, y]) => [[-SIDE, R1], [0, R0], [SIDE, R1]].some(([a, r]) => Math.hypot(x - uv(a, 0)[0], y - uv(a, 0)[1]) < r - 8);
  loop.forEach((p, i) => { if (i % 9 === 4 && onDeck(p)) T.post(p[0], p[1], 0, TZ - 0.6, 0.9, "lo"); });
  const tracks = { loop: { pts: flat(loop.map(([x, y, z]) => [x, y, z + 3.6])), period: LAP, closed: true } };
  const movers = [];
  for (let i = 0; i < BALLS; i++) {
    const offset = (i * LAP) / BALLS, rest = trackAt(tracks.loop, REST + offset);
    T.ball(rest, "ball" + i, BALL_BIAS);
    movers.push({ name: "ball" + i, track: "loop", offset, rest, bias: BALL_BIAS });
  }
  const events = [];
  const when = (p) => nearest(loop, p) * LAP;
  // `sound`: the voice the part answers the ball with (and a bar's place in its row), for the page to play
  const sets = (p, part, dur = 1.2, delay = 0, sound) => events.push({ track: "loop", at: when(p) + delay, part, dur, ...sound });

  // ---- the centre deck: the sprouts round the tree, each with the flag a ball flicks
  const SPROUTS = [[-64, 70, 0.95], [-24, 79, 0.8], [26, 79, 1.05], [66, 70, 0.85], [-46, -72, 1], [44, -73, 0.9]];
  SPROUTS.forEach(([a, b, size], i) => {
    const p = uv(a, b);
    T.tapped({ tap: SPROUT_TAPS[i % 4], kick: "sprout" + i, pad: [[p[0], p[1], 20 * size], 13] }, () => T.sprout(p[0], p[1], 0, { size, name: "sprout" + i }));
    const over = loop[Math.round(nearest(loop, p) * N) % N];
    trigger(T, uv(a * 0.93, b * 0.82), [over[0], over[1]], TZ, "flag" + i);
    events.push({ track: "loop", at: when(p), part: "flag" + i, dur: 0.9, voice: "tick" }, { track: "loop", at: when(p) + 0.12, part: "sprout" + i, dur: 1.3, voice: "grow" });
  });
  sets(uv(0, B), "bloom", 1.6, 0, { voice: "bloom" });
  sets(uv(0, B), "invite", 2.2);
  [0, 1, 2, 3, 4].forEach((j) => sets(uv(0, -B), "tree" + j, 1.4, j * 0.09));

  // ---- the left deck: the World and its Orbiter, the bars, a bell
  const W = uv(-SIDE + 8, 0, 44), WR = 16;
  T.gear(W[0], W[1], 0, 13, 9, "gearA");
  T.gear(...uv(-SIDE + 8 - 13.4, 13.4), 0, 8, 6, "gearB", { turn: -1 });
  T.tapped({ tap: "stars", count: 9, kick: "beam" }, () => T.world(W, WR, { stand: 25.4 }));
  const ORBIT = { r: 34, z: 62, period: 10 };
  tracks.orbit = { pts: flat(T.orbit(W, ORBIT.r, ORBIT.z).slice(0, -1)), period: ORBIT.period, closed: true };
  const links = [{ part: "beam", mover: "saucer", off: [0, 0, -1], ball: W, r: WR }];
  const saucerRest = trackAt(tracks.orbit, REST);
  T.tapped({ tap: "stars", count: 6, kick: "beam" }, () => T.saucer(saucerRest, "saucer", beamSvg(T, links[0], saucerRest)));
  movers.push({ name: "saucer", track: "orbit", offset: 0, rest: saucerRest, bias: 6 });
  T.part("beam", "glow", { base: 0.45 });
  const barAt = uv(-SIDE - 14, 47);
  const tops = T.tapped({ tap: "stars", count: 5, kick: [0, 1, 2, 3, 4].map((i) => `bar${i}@${(i * 0.12).toFixed(2)}`).join(",") }, () => T.bars(barAt[0] - 14, barAt[1], 8, 5, { step: 9 }));
  tops.forEach((_, i) => sets(barAt, "bar" + i, 0.6, i * 0.14, { voice: "bar", step: i }));
  sets(barAt, "beam", 1.8);
  const bellA = uv(-SIDE - 54, -6);
  T.tapped({ tap: "bell", kick: "bellA", pad: [[bellA[0], bellA[1], 30], 10] }, () => T.bell(bellA[0], bellA[1], 0, { name: "bellA", shape: "gem" }));
  sets(bellA, "bellA", 1.2, 0, { voice: "bell" });

  // ---- the right deck: the shell, the gong, the other bell
  const shellAt = uv(SIDE - 10, 0);
  const way = T.tapped({ tap: "spiral" }, () => T.shell(shellAt[0], shellAt[1], 0));
  const down = way.map(([x, y, z]) => [x, y, z + 3.4]);
  tracks.shell = { pts: flat(down), period: 9, closed: false, fade: [0.5, 7.6, 8.4] };
  const shellRest = trackAt(tracks.shell, REST);
  T.ball(shellRest, "seed", 2, 2.6);
  movers.push({ name: "seed", track: "shell", offset: 0, rest: shellRest, bias: 2 });
  // the seed sets off down the shell: a falling run (no part moves for it)
  events.push({ track: "shell", at: 0.6, dur: 1, voice: "spiral" });
  const gongAt = uv(SIDE + 50, 2);
  T.tapped({ tap: "gong", kick: "gong" }, () => T.gong(gongAt[0], gongAt[1], 0, { r: 10 }));
  sets(gongAt, "gong", 2, 0, { voice: "gong" });
  const bellB = uv(SIDE + 6, 52);
  T.tapped({ tap: "bell", kick: "bellB", pad: [[bellB[0], bellB[1], 30], 10] }, () => T.bell(bellB[0], bellB[1], 0, { name: "bellB", h: 20 }));
  sets(bellB, "bellB", 1.2, 0, { voice: "bell" });

  const spin = [{ part: "gearA", period: ORBIT.period / 9 }, { part: "gearB", period: ORBIT.period / 9 }];
  return { name: "hero", width: WIDTH, height: HEIGHT, T, data: { rest: REST, tracks, movers, links, events, spin, anchors: { flower: T.anchor(tree.heart) } } };
}

// The same garden on one deck, for a phone: every object of the wide arrangement, closer together.
export function heroNarrow() {
  const WIDTH = 390, HEIGHT = 372, TREE = 112, R = 106;
  const T = stage(WIDTH, HEIGHT, [...Array.from({ length: 24 }, (_, i) => [R * Math.cos((i / 24) * TAU), R * Math.sin((i / 24) * TAU), -11]), [0, 0, TREE * 1.32]], { pad: 12 });
  T.island(0, 0, R);
  const REST = 2.4;
  const tree = garden(T, { treeAt: [0, 0], treeH: TREE });

  const TR = 46, TZ = 13, N = 96, LAP = 15, BALLS = 3;
  const loop = Array.from({ length: N }, (_, i) => { const t = (i / N) * TAU; return uv(TR * Math.cos(t), TR * Math.sin(t), TZ); });
  T.rails([...loop, loop[0]], { max: 14 });
  loop.forEach((p, i) => { if (i % 12 === 6) T.post(p[0], p[1], 0, TZ - 0.6, 0.9, "lo"); });
  const tracks = { loop: { pts: flat(loop.map(([x, y, z]) => [x, y, z + 3.6])), period: LAP, closed: true } };
  const movers = [];
  for (let i = 0; i < BALLS; i++) {
    const offset = (i * LAP) / BALLS, rest = trackAt(tracks.loop, REST + offset);
    T.ball(rest, "ball" + i, BALL_BIAS);
    movers.push({ name: "ball" + i, track: "loop", offset, rest, bias: BALL_BIAS });
  }
  const events = [];
  const when = (p) => nearest(loop, p) * LAP;
  // `sound`: the voice the part answers the ball with (and a bar's place in its row), for the page to play
  const sets = (p, part, dur = 1.2, delay = 0, sound) => events.push({ track: "loop", at: when(p) + delay, part, dur, ...sound });

  [[-62, 56, 0.85], [62, 56, 0.9], [-88, 6, 0.75], [92, 16, 0.8]].forEach(([a, b, size], i) => {
    const p = uv(a, b);
    T.tapped({ tap: SPROUT_TAPS[i % 4], kick: "sprout" + i, pad: [[p[0], p[1], 20 * size], 13] }, () => T.sprout(p[0], p[1], 0, { size, name: "sprout" + i }));
    sets(p, "sprout" + i, 1.3, 0, { voice: "grow" });
  });
  sets(uv(0, TR), "bloom", 1.6, 0, { voice: "bloom" });
  sets(uv(0, TR), "invite", 2.2);
  [0, 1, 2, 3, 4].forEach((j) => sets(uv(0, -TR), "tree" + j, 1.4, j * 0.09));

  const barAt = uv(0, 80);
  const tops = T.tapped({ tap: "stars", count: 5, kick: [0, 1, 2, 3, 4].map((i) => `bar${i}@${(i * 0.12).toFixed(2)}`).join(",") }, () => T.bars(barAt[0] - 18, barAt[1], 7, 5, { step: 9 }));
  tops.forEach((_, i) => sets(barAt, "bar" + i, 0.6, i * 0.14, { voice: "bar", step: i }));

  const W = uv(-52, -62, 34), WR = 11;
  T.tapped({ tap: "stars", count: 9, kick: "beam" }, () => T.world(W, WR, { stand: 23 }));
  const ORBIT = { r: 23, z: 47, period: 9 };
  tracks.orbit = { pts: flat(T.orbit(W, ORBIT.r, ORBIT.z).slice(0, -1)), period: ORBIT.period, closed: true };
  const links = [{ part: "beam", mover: "saucer", off: [0, 0, -1], ball: W, r: WR }];
  const saucerRest = trackAt(tracks.orbit, REST);
  T.tapped({ tap: "stars", count: 6, kick: "beam" }, () => T.saucer(saucerRest, "saucer", beamSvg(T, links[0], saucerRest)));
  movers.push({ name: "saucer", track: "orbit", offset: 0, rest: saucerRest, bias: 6 });
  T.part("beam", "glow", { base: 0.45 });
  sets(barAt, "beam", 1.8);

  const gongAt = uv(34, -80);
  T.tapped({ tap: "gong", kick: "gong" }, () => T.gong(gongAt[0], gongAt[1], 0, { r: 8 }));
  sets(gongAt, "gong", 2, 0, { voice: "gong" });
  const shellAt = uv(80, -40);
  const way = T.tapped({ tap: "spiral" }, () => T.shell(shellAt[0], shellAt[1], 0, { h: 30, r1: 13, turns: 2.1 }));
  tracks.shell = { pts: flat(way.map(([x, y, z]) => [x, y, z + 3.2])), period: 8, closed: false, fade: [0.5, 6.8, 7.5] };
  const shellRest = trackAt(tracks.shell, REST);
  T.ball(shellRest, "seed", 2, 2.4);
  movers.push({ name: "seed", track: "shell", offset: 0, rest: shellRest, bias: 2 });
  // the seed sets off down the shell: a falling run (no part moves for it)
  events.push({ track: "shell", at: 0.6, dur: 1, voice: "spiral" });
  const bellA = uv(-86, -24), bellB = uv(-30, -88);
  T.tapped({ tap: "bell", kick: "bellA", pad: [[bellA[0], bellA[1], 24], 10] }, () => T.bell(bellA[0], bellA[1], 0, { name: "bellA", shape: "gem", h: 18, size: 4 }));
  T.tapped({ tap: "bell", kick: "bellB", pad: [[bellB[0], bellB[1], 22], 10] }, () => T.bell(bellB[0], bellB[1], 0, { name: "bellB", h: 14, size: 4 }));
  sets(bellA, "bellA", 1.2, 0, { voice: "bell" });
  sets(bellB, "bellB", 1.2, 0, { voice: "bell" });

  return { name: "hero-narrow", width: WIDTH, height: HEIGHT, T, data: { rest: REST, tracks, movers, links, events, spin: [], anchors: { flower: T.anchor(tree.heart) } } };
}
