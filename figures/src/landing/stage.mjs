// What every landing figure is built on (PLA-523, the guest home page of plantasia.space-root):
// the home machine's scene and parts (../home-machine/parts.mjs), so both sites share one world, plus
// the few parts only the landing has (the tree, the gong, the shell, a listener), tap targets, and
// the writer for a figure's three files.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../kit/iso-kit.mjs";
import * as G from "../../kit/lathe.mjs";
import { scene, polar, UP, TAU } from "../home-machine/parts.mjs";

export { k, G, polar, UP, TAU };
const HERE = dirname(fileURLToPath(import.meta.url));
const fix = (n) => Number(n.toFixed(1));

// The one accent: the Orbiters app's default Color C (orbiters/src/ui/react/orbitersUI.css,
// --orb-default-color3: #33ff41), with the same ramp as the home machine (home-machine/build.mjs, ACCENT).
const ACCENT = {
  dark: { paper: "#149c1f", face: "#25d434", top: "#33ff41", shades: ["#149c1f", "#1cb82a", "#25d434", "#2dea3b"], hi: "#b8ffbd", mid: "#33ff41", line: "#33ff41" },
  light: { paper: "#22c930", face: "#2adf39", top: "#33ff41", shades: ["#1ba827", "#22c930", "#2adf39", "#30f03e"], hi: "#0b5a12", mid: "#149c1f", line: "#17a823" },
};
const ramp = (a) => `--anatomy-paper:${a.paper};--anatomy-face:${a.face};--anatomy-top:${a.top};${a.shades.map((c, i) => `--anatomy-shade-${i}:${c}`).join(";")};--anatomy-hi:${a.hi};--anatomy-mid:${a.mid}`;
export const CSS = `.hm-acc{${ramp(ACCENT.dark)}}[data-theme="light"] .hm-acc{${ramp(ACCENT.light)}}`
  + `.hm-beam{fill:none;stroke:${ACCENT.dark.line};stroke-width:1.1;stroke-dasharray:1 3.2;stroke-linecap:round;opacity:.45}[data-theme="light"] .hm-beam{stroke:${ACCENT.light.line}}`
  + `[data-tap]{cursor:pointer}.lf-pad{fill:transparent;stroke:none}`
  + `.lf-ping{fill:none;stroke:${ACCENT.dark.line};stroke-width:1;transform-box:fill-box;transform-origin:center;pointer-events:none}[data-theme="light"] .lf-ping{stroke:${ACCENT.light.line}}`;

// Screen directions on the floor, for the default camera (azimuth 45°): `a` runs to the right of
// the screen, `b` toward the viewer (down the screen at half the rate).
const H = Math.SQRT1_2;
export const uv = (a, b, z) => (z === undefined ? [(a + b) * H, (b - a) * H] : [(a + b) * H, (b - a) * H, z]);
export const RIGHT = [H, -H, 0];

export function stage(width, height, extremes, fit = {}) {
  const T = scene(width, height, extremes, fit);
  const { P, S, L, D, put, at, acc } = T;

  // Mark what was put since `from` as one tap target: `tap` is what the page plays, `count` goes
  // with it, `kick` names the parts it sets off ("bloom,sprout0@0.2": a part, and one 0.2 s later).
  // `pad` ([point, radius]) adds an unseen disc so a small thing is easy to hit with a finger.
  T.tag = (from, { tap, count, kick, pad }) => {
    const attrs = `data-tap="${tap}"${count === undefined ? "" : ` data-count="${count}"`}${kick ? ` data-kick="${kick}"` : ""}`;
    for (let i = from; i < T.items.length; i++) T.items[i].svg = `<g ${attrs}>${T.items[i].svg}</g>`;
    if (pad) { const [x, y] = at(pad[0]); put(pad[0], `<g ${attrs}><circle class="lf-pad" cx="${fix(x)}" cy="${fix(y)}" r="${fix(pad[1] * G.scaleOf(P))}"/></g>`, pad[2] ?? 0.9); }
  };
  T.tapped = (attrs, make) => { const from = T.items.length; const made = make(); T.tag(from, attrs); return made; };

  // ---- a round deck anywhere on the floor (the scene's own `round` only stands at the centre)
  T.island = (cx, cy, r, h = 8) => {
    put([cx, cy, -h], `<path class="iso-halo" d="${k.cylinder(cx, cy, r, -h - 3, h, P, 72).fill}"/>`, -3000);
    const screws = Array.from({ length: 8 }, (_, i) => { const [x, y] = polar(r - 12, i * 45 + 22.5); return [cx + x, cy + y]; });
    put([cx, cy, -h], S(k.cylinder(cx, cy, r, -h, h, P, 96, 1.4), { tone: "mid", inner: L(k.sideArc(cx, cy, r, -h / 2, P, 72), { tone: "faint" }) })
      + L(k.ring(cx, cy, r - 5, 0, P, 96), { tone: "lo" })
      + L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 14)).join(""), { tone: "lo" }) + D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }), -2000);
  };

  // ---- the tree at the centre of the garden: a straight stem, five pairs of branches with their
  // leaflets, a fan flower on top with a lit heart, a ring of studs round the root.
  // It lies in the plane that faces the viewer. Each pair is a part (`name`0..4), the flower is `bloom`.
  T.tree = (x, y, z = 0, { h = 110, name = "tree", bloom = "bloom" } = {}) => {
    put([x, y, z], S(k.cylinder(x, y, 5, z, 1.6, P, 20, 0.4), { tone: "mid" }), -0.2);
    put([x, y, z], S(k.cylinder(x, y, 1.4, z + 1.6, h - 1.6, P, 12), { tone: "hi", crease: "none" }));
    const studs = Array.from({ length: 14 }, (_, i) => { const [dx, dy] = polar(12, (i + 0.5) * (360 / 14)); return at([x + dx, y + dy, z]); });
    put([x, y, z], D(studs, { size: 0.55, tone: "mid" }), -0.4);
    const lean = 0.92;
    for (let j = 0; j < 5; j++) {
      const o = [x, y, z + h * (0.15 + j * 0.155)], len = h * (j === 0 ? 0.2 : 0.26);
      let svg = "";
      for (const s of [-1, 1]) {
        const tip = [o[0] + RIGHT[0] * s * len * Math.sin(lean), o[1] + RIGHT[1] * s * len * Math.sin(lean), o[2] + len * Math.cos(lean)];
        svg += T.tubeStr([o, tip], 0.55, { tone: "hi" });
        for (let i = 1; i <= 3; i++) {
          const q = G.lerp3(o, tip, i / 3.4), l = len * 0.34 * (1 - 0.14 * i);
          svg += T.leaf(q, s * 0.2, l, l * 0.2, RIGHT) + T.leaf(q, s * 1.42, l, l * 0.2, RIGHT);
        }
      }
      put(o, svg, 0.3 + j * 0.01, { part: name + j });
      T.part(name + j, "nod", { pivot: at(o).map(fix), amp: j % 2 ? 5 : -5 });
    }
    const top = [x, y, z + h], fh = h * 0.2;
    const petals = [-0.56, -0.28, 0, 0.28, 0.56].map((d) => T.leaf(top, d, fh * (1 - Math.abs(d) * 0.2), fh * 0.19, RIGHT)).join("");
    const heart = [top[0] + 0.5, top[1] + 0.5, top[2] + fh * 0.2];
    put(top, `${petals}${acc(S(G.sphereOf(heart, h * 0.028, P, { steps: 28 })))}`, 0.6, { part: bloom });
    T.part(bloom, "grow", { pivot: at(top).map(fix), amp: 0.16 });
    return { top, heart, fh };
  };

  // ---- the gong (the hero's moon): a disc hanging in a frame, facing the viewer
  T.gong = (x, y, z = 0, { r = 11, name = "gong" } = {}) => {
    const hang = z + r * 2 + 9, half = r + 4;
    for (const s of [-1, 1]) {
      const [px, py] = [x + RIGHT[0] * s * half, y + RIGHT[1] * s * half];
      put([px, py, z], S(k.cylinder(px, py, 2.4, z, 1.2, P, 14), { tone: "lo" }) + S(k.cylinder(px, py, 0.9, z + 1.2, hang - z - 1.2, P, 10), { tone: "mid", crease: "none" }));
    }
    const bar = [-1, 1].map((s) => [x + RIGHT[0] * s * half, y + RIGHT[1] * s * half, hang]);
    put([x, y, hang], T.tubeStr(bar, 0.8, { tone: "mid" }), 0.2);
    const c = [x, y, hang - 4 - r], F = G.frameAlong(c, [H, H, 0]);
    const cords = [-0.5, 0.5].map((s) => L(T.path3([[x + RIGHT[0] * s * r, y + RIGHT[1] * s * r, hang], [x + RIGHT[0] * s * r, y + RIGHT[1] * s * r, c[2] + r * 0.86]]), { tone: "mid" })).join("");
    put(c, `${cords}${S(G.disc(-0.7, 0.7, r, F, P, { steps: 48 }), { tone: "hi", crease: "lo" })}${L(G.circleOf(F, 0.7, r * 0.42, P), { tone: "lo" })}${D([at([c[0] + H * 0.7, c[1] + H * 0.7, c[2]])], { size: 0.6 })}`, 0.4, { part: name });
    T.part(name, "nod", { pivot: at([x, y, hang]).map(fix), amp: 9 });
    return c;
  };

  // ---- a bell: a small solid on a post (the hero's drifting solids). `shape`: "cube" or "gem".
  T.bell = (x, y, z = 0, { h = 26, size = 5, shape = "cube", name = "bell" } = {}) => {
    put([x, y, z], S(k.cylinder(x, y, 2.6, z, 1.2, P, 14), { tone: "lo" }) + S(k.cylinder(x, y, 0.8, z + 1.2, h - 1.2, P, 8), { tone: "mid", crease: "none" }));
    const body = shape === "cube"
      ? S(k.slabOf({ x: x - size, y: y - size, w: size * 2, d: size * 2, r: 0.8 }, z + h, size * 2, P, 2, 0.4), { tone: "hi", crease: "lo" })
      : S(k.extrude(k.circleRing(x, y, size * 1.15, 6), z + h, size * 1.7, P), { tone: "hi", crease: "lo" });
    put([x, y, z + h], body, 0.3, { part: name });
    T.part(name, "dip", { amp: -3 });
  };

  // ---- the shell: a ramp that winds down round a post, wide at the foot. Returns the way down it.
  T.shell = (x, y, z = 0, { h = 44, r0 = 4, r1 = 22, turns = 2.6 } = {}) => {
    put([x, y, z], S(k.cylinder(x, y, 4, z, 1.4, P, 18, 0.3), { tone: "mid" }), -0.2);
    put([x, y, z], S(k.cylinder(x, y, 1.6, z + 1.4, h + 3, P, 12), { tone: "mid", crease: "none" }) + S(G.sphereOf([x, y, z + h + 5.6], 2.4, P, { steps: 24 }), { tone: "hi" }), 0.1);
    const n = Math.round(turns * 40), way = [];
    for (let i = 0; i <= n; i++) { const t = i / n, a = t * turns * TAU + 0.6, r = r0 * (r1 / r0) ** t; way.push([x + r * Math.cos(a), y + r * Math.sin(a), z + 2 + (h - 2) * (1 - t) ** 1.25]); }
    T.tube(way, 1, { tone: "hi", max: 9 });
    // spokes from the post to the ramp, a third of a turn apart
    for (let i = 4; i < n; i += Math.round(n / (turns * 3))) put(way[i], T.tubeStr([[x, y, way[i][2]], way[i]], 0.45, { tone: "mid" }), -0.3);
    return way;
  };

  // ---- a listener: headphones on a stand, one part so it can come and go
  T.listener = (x, y, z = 0, name = "listener", { h = 22 } = {}) => {
    const hang = z + h, half = 6.5, AX = [1, 0, 0];
    const band = Array.from({ length: 13 }, (_, i) => [x + AX[0] * half * Math.cos((i / 12) * Math.PI), y + AX[1] * half * Math.cos((i / 12) * Math.PI), hang - 6 + 6.5 * Math.sin((i / 12) * Math.PI)]);
    const cup = (s) => { const F = G.frameAlong([x + AX[0] * s * half, y + AX[1] * s * half, hang - 8], [AX[0] * s, AX[1] * s, 0]); return S(G.disc(-1, 2, 3.8, F, P), { tone: "hi", crease: "lo", inner: L(G.arcOf(F, 0.4, 3.8, P), { tone: "faint" }) }); };
    const stand = S(k.cylinder(x, y, 2.6, z, 1.2, P, 14), { tone: "lo" }) + S(k.cylinder(x, y, 0.8, z + 1.2, h - 1, P, 8), { tone: "mid", crease: "none" });
    put([x, y, z], `${stand}${cup(-1)}${T.tubeStr(band, 0.75, { tone: "hi" })}${cup(1)}`, 0.2, { part: name });
  };

  // ---- a thin rail between two floor points (a cable on the deck), ending in terminal dots
  T.cable = (a, b, { via = [], tone = "lo" } = {}) => put([a[0], a[1], 0], k.wireSvg(at([a[0], a[1], 0]), at([b[0], b[1], 0]), { via: via.map(([x, y]) => at([x, y, 0])), tone, size: 1 }), -900);

  // where on the picture a point is, as fractions of its width and height (for the page's own text)
  T.anchor = (p) => { const [x, y] = at(p); return [Number((x / width).toFixed(4)), Number((y / height).toFixed(4))]; };
  return T;
}

// A ball's trigger over a track: a post outside it, an arm, and a flag the ball flicks (home-machine/build.mjs).
export function trigger(T, post, over, z, name) {
  const [px, py] = post, [hx, hy] = over;
  T.put([px, py, 0], T.S(k.cylinder(px, py, 2.2, 0, 1.2, T.P, 14), { tone: "lo" }) + T.S(k.cylinder(px, py, 0.8, 1.2, z + 12, T.P, 8), { tone: "mid", crease: "none" }), 0.1);
  T.put([hx, hy, z + 13], T.tubeStr([[px, py, z + 13], [hx, hy, z + 13]], 0.6, { tone: "mid" }), 7);
  T.put([hx, hy, z + 13], T.S(k.cylinder(hx, hy, 0.5, z + 7.4, 5.6, T.P, 6), { tone: "hi", crease: "none" }) + T.S(G.sphereOf([hx, hy, z + 6.6], 1.5, T.P, { steps: 20 }), { tone: "hi" }), 7.2, { part: name });
  T.part(name, "nod", { pivot: T.at([hx, hy, z + 13]).map(fix), amp: 38 });
}

export const flat = (points) => points.flatMap((p) => p.map(fix));
export function trackAt(track, t) {
  const n = track.pts.length / 3, u = (((t % track.period) + track.period) % track.period) / track.period;
  const f = u * (track.closed ? n : n - 1), i = Math.floor(f) % n, j = track.closed ? (i + 1) % n : Math.min(i + 1, n - 1), w = f - Math.floor(f);
  const a = track.pts, lerp = (o) => a[i * 3 + o] + (a[j * 3 + o] - a[i * 3 + o]) * w;
  return [lerp(0), lerp(1), lerp(2)];
}
// the Orbiter's beam to its World: from under the craft to the World's surface
export function beamSvg(T, link, rest) {
  const from = [rest[0] + link.off[0], rest[1] + link.off[1], rest[2] + link.off[2]];
  const c = link.ball, d = G.sub3(from, c), n = G.len3(d) || 1;
  return `<path data-part="${link.part}" class="hm-beam" d="${T.path3([from, [c[0] + (d[0] / n) * link.r, c[1] + (d[1] / n) * link.r, c[2] + (d[2] / n) * link.r]])}"/>`;
}

// ---- the writer. A figure is { name, width, height, T, data }: it becomes <name>-dark.svg and
// <name>-light.svg (the picture, which the page shows as it is and then puts on its stage) and
// <name>.json (what moves and what a tap plays). `runtime.js` is copied beside them once.
export function emit(fig, { out, preview }) {
  const { name, T, data, width } = fig;
  const scene = { rest: 0, tracks: {}, movers: [], links: [], events: [], spin: [], ...data, camera: T.camera(), parts: T.parts };
  const build = createHash("sha256").update(T.svg(name, { style: CSS }) + JSON.stringify(scene)).digest("hex").slice(0, 10);
  // The page gives the description; `aria-hidden` figures are marked there too.
  const picture = (theme) => T.svg("", { style: CSS, standalone: theme }).replace("<svg ", `<svg data-build="${build}" `);
  mkdirSync(out, { recursive: true });
  for (const theme of ["dark", "light"]) writeFileSync(join(out, `${name}-${theme}.svg`), picture(theme));
  writeFileSync(join(out, `${name}.json`), JSON.stringify({ build, width: fig.width, height: fig.height, ...scene }));
  const runtime = readFileSync(join(HERE, "runtime.js"), "utf8");
  writeFileSync(join(out, "runtime.js"), `// Built by docs.plantasia.space figures/src/landing (runtime.js). Do not edit by hand.\n${runtime}`);
  console.log("wrote", name, `${(picture("dark").length / 1024).toFixed(0)} KB drawing, ${(JSON.stringify(scene).length / 1024).toFixed(0)} KB data, ${T.items.length} items`);
  if (preview) {
    mkdirSync(preview, { recursive: true });
    for (const theme of ["dark", "light"]) {
      const script = `${runtime.replace("export function mount", "function mount")}\nconst SCENE = ${JSON.stringify({ build, ...scene })};\nwindow.figure = mount(document.getElementById("fig"), SCENE, { tap: (tap) => { window.taps = (window.taps || []).concat(tap); document.title = "tap " + tap.kind; }, count: (n) => { document.body.dataset.count = n; } });`;
      writeFileSync(join(preview, `preview-${name}-${theme}.html`), k.pageHtml({ title: name, theme, width, body: `<div id="fig" class="iso-stage">${picture(theme)}</div>`, script }));
    }
  }
}
