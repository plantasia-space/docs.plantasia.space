// 04 Playground: a room. Three xPlorers (consoles with headphones) sit round one deck, each with
// their Orbiter over them (the third plays two: up to 3 xPlorers and 4 Orbiters in a room,
// plantasia.space-root draw/playground.ts). Audios run the ring between them and each console answers
// as one passes; cables join every player to the hub. Round the room, on their own small decks,
// listeners (headphones on a stand) come and go, wherever they are.
// Taps: a player = talk (its voice) · a listener = crowd (its voice). The birds on the perch are the page's (bell).
// The names, the clocks and the count of listeners are the page's own text, placed at `anchors`.
import { stage, beamSvg, flat, trackAt, uv, k, G, TAU } from "./stage.mjs";

const BALL_BIAS = 6;
// Orbiters per player (draw/playground.ts, PLAY)
const ORBITERS = [1, 1, 2];
// Each listener's own cycle: seconds per visit and where it starts. Three times draw/playground.ts's
// (LIS), so they come and go slowly (Bruna, 14 Oct 2026).
const LISTENERS = Array.from({ length: 7 }, (_, i) => ({ period: 24 + ((i * 0.618) % 1) * 21, phase: (i * 0.377) % 1 }));
const STAY = 0.62;

function room({ name, WIDTH, HEIGHT, R, seats, players, pad }) {
  const edge = Array.from({ length: 24 }, (_, i) => [R * Math.cos((i / 24) * TAU), R * Math.sin((i / 24) * TAU), -11]);
  const T = stage(WIDTH, HEIGHT, [...edge, ...seats.flatMap(([a, b]) => [uv(a - 12, b, -8), uv(a + 12, b, -8), uv(a, b, 26)]), ...players.map(([a, b]) => uv(a, b, 86))], { pad });
  T.island(0, 0, R);
  const REST = 1.6;

  // the hub: what everyone in the room hears
  T.put([0, 0, 0], T.S(k.cylinder(0, 0, 15, 0, 5, T.P, 40, 0.6), { tone: "mid", inner: T.L(k.sideArc(0, 0, 15, 2.5, T.P, 40), { tone: "faint" }) }) + T.L(k.ring(0, 0, 10.5, 5, T.P, 40), { tone: "lo" }) + T.D(Array.from({ length: 8 }, (_, i) => T.at([12.6 * Math.cos((i / 8) * TAU), 12.6 * Math.sin((i / 8) * TAU), 5])), { size: 0.45, tone: "mid" }), -0.2);
  T.put([0, 0, 5], `<g class="lf-trk">${T.acc(T.S(G.sphereOf([0, 0, 10], 5, T.P, { steps: 36 })))}</g>`, 0.3, { part: "hub" });
  T.part("hub", "dip", { amp: -2.4 });

  // the ring the Audios run, between the hub and the players
  const TR = R * 0.47, TZ = 12, N = 108, LAP = 12, BALLS = 3;
  const ring = Array.from({ length: N }, (_, i) => { const t = (i / N) * TAU; return [TR * Math.cos(t), TR * Math.sin(t), TZ]; });
  T.rails([...ring, ring[0]], { max: 14 });
  ring.forEach((p, i) => { if (i % 12 === 3) T.post(p[0], p[1], 0, TZ - 0.6, 0.9, "lo"); });
  const tracks = { ring: { pts: flat(ring.map(([x, y, z]) => [x, y, z + 3.6])), period: LAP, closed: true } };
  const movers = [], events = [], anchors = {};
  for (let i = 0; i < BALLS; i++) {
    const offset = (i * LAP) / BALLS, rest = trackAt(tracks.ring, REST + offset);
    T.ball(rest, "ball" + i, BALL_BIAS);
    movers.push({ name: "ball" + i, track: "ring", offset, rest, bias: BALL_BIAS });
  }
  const when = ([x, y]) => { let best = 0, bd = Infinity; ring.forEach((p, i) => { const d = Math.hypot(p[0] - x, p[1] - y); if (d < bd) { bd = d; best = i; } }); return (best / N) * LAP; };

  // the players
  players.forEach(([a, b], i) => {
    const [x, y] = uv(a, b);
    T.tapped({ tap: "talk", count: i, kick: `lever${i},hub@0.15` }, () => {
      T.console(x, y, 0, { name: "lever" + i });
      for (let o = 0; o < ORBITERS[i]; o++) {
        const at = [x + 12, y + 12, 54 + o * 17];
        T.saucer(at, `orbiter${i}${o}`, o ? "" : `<path data-part="link${i}" class="hm-beam" d="${T.path3([[at[0], at[1], at[2] - 4], [x + 6, y, 13.6]])}"/>`);
      }
    });
    T.part("link" + i, "glow", { base: 0.35 });
    T.cable([x * 0.74, y * 0.74], [x * 0.2, y * 0.2]);
    events.push({ track: "ring", at: when([x, y]), part: "lever" + i, dur: 1, voice: "lever" }, { track: "ring", at: when([x, y]), part: "link" + i, dur: 1.6 }, { track: "ring", at: when([x, y]) + 0.2, part: "hub", dur: 0.7, voice: "pulse" });
    // the name goes under a player at the front, and over the Orbiter of the one at the back
    anchors["player" + i] = b < 0 ? T.anchor([x + 12, y + 12, 54 + ORBITERS[i] * 17 - 4]) : T.anchor([x + 14, y + 14, -8]);
  });

  // a perch at the back of the room, for the blue flycatchers that keep it company (the page lays them on it)
  const perchAt = uv(R * 0.66, -R * 0.52);
  anchors.sticker = T.anchor(T.perch(perchAt[0], perchAt[1], 0, { h: 34, half: 14 }));

  // the listeners, each on a small deck of their own
  seats.forEach(([a, b], i) => {
    const [x, y] = uv(a, b);
    T.island(x, y, 12, 5);
    T.tapped({ tap: "crowd", count: i }, () => T.listener(x, y, 0, "listener" + i));
    // the pad is part of the listener, so it comes and goes with it
    const item = T.items[T.items.length - 1], [sx, sy] = T.at([x, y, 12]);
    item.svg = `${item.svg.slice(0, item.svg.lastIndexOf("</g>"))}<circle class="lf-pad" cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${(13 * G.scaleOf(T.P)).toFixed(1)}"/></g>`;
    T.part("listener" + i, "visit", { period: Number(LISTENERS[i].period.toFixed(2)), phase: Number(LISTENERS[i].phase.toFixed(3)), stay: STAY, voice: "breath" });
  });

  return { name, width: WIDTH, height: HEIGHT, T, data: { rest: REST, tracks, movers, links: [], events, spin: [], anchors } };
}

export const playground = () => room({
  name: "playground", WIDTH: 900, HEIGHT: 450, R: 138, pad: 18,
  players: [[0, -90], [84, 50], [-84, 50]],
  seats: [[-200, -62], [-222, 40], [-160, 138], [168, 138], [222, 44], [200, -58], [-128, -150]],
});
export const playgroundNarrow = () => room({
  name: "playground-narrow", WIDTH: 390, HEIGHT: 488, R: 112, pad: 12,
  players: [[0, -74], [68, 42], [-68, 42]],
  seats: [[-92, -262], [-10, -296], [84, -250], [-96, 236], [-14, 270], [78, 236], [-136, -200]],
});
