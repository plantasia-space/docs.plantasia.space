// The parts of the Plantasia Space machine (docs home figure, ORB-633): one drawing of each entity,
// shared by the two arrangements in build.mjs. Each part puts its pieces into the scene at their own depth.
//   Collection = a cabinet of drawers · Audio = a ball · xPlorer = a console with headphones
//   Entangled World = a planet with its ring · Orbiter = the craft · Release = a sprout · Plantasia Space = the orchid
import * as k from "../../kit/iso-kit.mjs";
import * as G from "../../kit/lathe.mjs";
import { tubePieces, tubeSvg } from "../../kit/tube.mjs";

export const TAU = Math.PI * 2;
export const UP = (o) => G.frameOf(o, [0, 0, 1], [1, 0, 0], [0, 1, 0]);
export const polar = (r, deg, z) => (z === undefined ? [r * Math.cos((deg * Math.PI) / 180), r * Math.sin((deg * Math.PI) / 180)] : [r * Math.cos((deg * Math.PI) / 180), r * Math.sin((deg * Math.PI) / 180), z]);
const fix = (n) => Number(n.toFixed(1));

export function scene(width, height, extremes, fit = {}) {
  const P = k.fitProjection(extremes, width, height, { pad: 20, azimuth: 45, ...fit });
  const V = G.viewOf(P);
  const items = [];
  const base = [];
  const parts = {};
  const S = (paths, style) => k.solidSvg(paths, style);
  const L = (d, style) => k.lineSvg(d, style);
  const D = (points, style) => k.dotsSvg(points, style);
  const key = (p) => G.dot3(p, V);
  const at = (p) => k.iso(p, P);
  const acc = (svg) => `<g class="hm-acc">${svg}</g>`;
  // put(point, svg, bias, { part, mover }): one item of the depth-sorted layer
  const put = (p, svg, bias = 0, tag = {}) => items.push({ key: key(p) + bias, svg, ...tag });
  const pieces = (points, r, { closed = false, max = 10 } = {}) => tubePieces(points, r, P, { closed, maxLength: max });
  const tube = (points, r, { tone = "mid", closed = false, max = 10, accent = false, bias = 0 } = {}) => {
    for (const piece of pieces(points, r, { closed, max })) put(piece.mid, accent ? acc(tubeSvg(piece, { tone })) : tubeSvg(piece, { tone }), bias);
  };
  // one tube as a single string, its pieces already in depth order (for a part that moves as one)
  const tubeStr = (points, r, { tone = "mid", max = 60 } = {}) => pieces(points, r, { max }).sort((a, b) => key(a.mid) - key(b.mid)).map((piece) => tubeSvg(piece, { tone })).join("");
  // a thin rail or wire along a 3D route, as plain strokes cut into depth-sorted lengths
  const wire = (points, { closed = false, max = 14, bias = 0, tone = "hi", width = 1.3 } = {}) => {
    const route = closed ? [...points, points[0]] : points;
    let run = [route[0]], length = 0;
    const flush = (free) => { const mid = run[Math.floor(run.length / 2)]; put(mid, `<path class="iso-line" data-tone="${tone}"${free ? ' data-free=""' : ""} style="stroke-width:${width}" d="${path3(run)}"/>`, bias); };
    for (let i = 1; i < route.length; i++) {
      length += G.len3(G.sub3(route[i], route[i - 1]));
      run.push(route[i]);
      const last = i === route.length - 1;
      if (length >= max || last) { flush(!closed && (last || run[0] === route[0])); run = [route[i]]; length = 0; }
    }
  };
  const path3 = (points) => points.map((p, i) => (i ? "L" : "M") + at(p).map(fix).join(" ")).join("");
  const part = (name, kind, spec) => { parts[name] = { kind, ...spec }; };

  const T = {
    P, V, put, at, key, S, L, D, acc, tube, tubeStr, wire, path3, part, parts, items,

    // ---- ground
    deck(plan, h = 8) {
      base.push(`<path class="iso-halo" d="${k.haloOf(plan, -h - 4, h, P)}"/>`);
      for (const [x, y] of k.corners(plan, 20).sort((a, b) => key([...a, 0]) - key([...b, 0]))) base.push(S(k.cylinder(x, y, 6, -h - 4, 4, P, 24), { tone: "mid" }));
      base.push(S(k.slabOf(plan, -h, h, P, 8, 1.4), { tone: "mid", inner: L(k.sideSeam(plan, -h / 2, P, 8), { tone: "faint" }) }));
      base.push(L(k.planOutline(k.insetPlan(plan, 5), 0, P), { tone: "lo" }));
      const screws = k.corners(plan, 12);
      base.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 14)).join(""), { tone: "lo" }), D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
    },
    round(r, h = 8) {
      base.push(`<path class="iso-halo" d="${k.cylinder(0, 0, r, -h - 3, h, P, 72).fill}"/>`);
      base.push(S(k.cylinder(0, 0, r, -h, h, P, 96, 1.4), { tone: "mid", inner: L(k.sideArc(0, 0, r, -h / 2, P, 72), { tone: "faint" }) }));
      base.push(L(k.ring(0, 0, r - 5, 0, P, 96), { tone: "lo" }));
      const screws = Array.from({ length: 8 }, (_, i) => polar(r - 12, i * 45 + 22.5));
      base.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 14)).join(""), { tone: "lo" }), D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
    },

    // ---- Collection: a cabinet of drawers. The top drawer opens along +x and holds what is kept.
    cabinet(x, y, z = 0, { w = 36, d = 30, h = 44, name = "drawer" } = {}) {
      const plan = { x: x - w / 2, y: y - d / 2, w, d, r: 3 };
      const third = h / 3;
      const seams = [third, 2 * third].map((s) => L(k.sideSeam(plan, z + s, P, 5), { tone: "lo" })).join("");
      put([x, y, z], S(k.slabOf({ x: plan.x - 1.5, y: plan.y - 1.5, w: w + 3, d: d + 3, r: 3.5 }, z, 2, P, 5), { tone: "mid" }), -0.5);
      put([x, y, z], S(k.slabOf(plan, z + 2, h - 2, P, 5, 0.9), { tone: "hi", crease: "lo", inner: seams }));
      put([x, y, z], L(k.planOutline(k.insetPlan(plan, 4), z + h, P, 4), { tone: "faint" }), 0.2);
      // handles on the two closed drawers, on the +x face
      for (const s of [third / 2 + 1, third * 1.5]) put([x + w / 2, y, z + s], S(G.disc(0, 1.6, 2.1, G.frameAlong([x + w / 2, y, z + s], [1, 0, 0]), P), { tone: "mid" }), 0.3);
      // the open drawer and what it holds
      const dr = { x: x + w / 2 - 4, y: y - d / 2 + 3, w: 18, d: d - 6, r: 1.5 };
      const dz = z + 2 * third + 2, dh = third - 5, c = [dr.x + dr.w / 2 + 2, dr.y + dr.d / 2];
      const kept = [[c[0], c[1] - 7], [c[0], c[1] + 7]].map(([bx, by]) => S(G.sphereOf([bx, by, dz + dh + 0.6], 3.2, P, { steps: 32 }), { tone: "mid" })).join("");
      put([c[0], c[1], dz], `${S(k.slabOf(dr, dz, dh, P, 3, 0.5), { tone: "mid" })}${L(k.planOutline(k.insetPlan(dr, 2), dz + dh, P, 3), { tone: "lo" })}${kept}`, 0.6, { part: name });
      const slide = at([x - 9, y, 0]), home = at([x, y, 0]);
      part(name, "slide", { vec: [fix(slide[0] - home[0]), fix(slide[1] - home[1])] });
      return { mouth: [dr.x + dr.w, c[1], dz + dh], top: z + h };
    },

    // ---- xPlorer: a console (a screen showing the World, the three axes, a lever) and headphones on a post
    console(x, y, z = 0, { name = "lever" } = {}) {
      const plan = { x: x - 18, y: y - 14, w: 36, d: 28, r: 3 };
      put([x, y, z], S(k.slabOf(plan, z, 11, P, 5, 0.8), { tone: "mid", inner: L(k.sideSeam(plan, z + 3, P, 5), { tone: "faint" }) }));
      const top = z + 11, scr = { x: x - 14, y: y - 10, w: 15, d: 20, r: 1.5 };
      put([x, y, z], L(k.planOutline(scr, top, P, 3), { tone: "lo" }) + L(k.ring(scr.x + 7.5, scr.y + 10, 3.4, top, P, 20), { tone: "hi" }) + D([[2.5, 4], [11.5, 6], [4, 16.5], [12, 15]].map(([dx, dy]) => at([scr.x + dx, scr.y + dy, top])), { size: 0.35, tone: "mid" }), 0.2);
      // X, Y and Z: three knobs in a row
      [-7, 0, 7].forEach((dy, i) => put([x + 6, y + dy, top], S(k.cylinder(x + 6, y + dy, 2.3, top, 2.6, P, 16, 0.3), { tone: "mid" }) + D([at([x + 6, y + dy, top + 2.6])], { size: 0.4 }), 0.3 + i * 0.01));
      // the lever
      const lx = x + 13, ly = y + 4;
      put([lx, ly, top], S(k.cylinder(lx, ly, 3, top, 1.2, P, 18), { tone: "lo" }), 0.4);
      put([lx, ly, top], S(k.cylinder(lx, ly, 0.85, top + 1.2, 11, P, 10), { tone: "mid", crease: "none" }) + S(G.sphereOf([lx, ly, top + 14], 2.5, P, { steps: 32 }), { tone: "hi" }), 0.5, { part: name });
      part(name, "nod", { pivot: at([lx, ly, top + 1.2]).map(fix), amp: 24 });
      // headphones
      const px = x - 8, py = y - 24, hang = z + 33;
      put([px, py, z], S(k.cylinder(px, py, 3, z, 1.4, P, 16), { tone: "lo" }));
      put([px, py, z], S(k.cylinder(px, py, 1, z + 1.4, 31.6, P, 10), { tone: "mid", crease: "none" }), 0.1);
      const band = Array.from({ length: 19 }, (_, i) => [px + 8.5 * Math.cos((i / 18) * Math.PI), py, hang - 9 + 9 * Math.sin((i / 18) * Math.PI)]);
      tube(band, 0.9, { tone: "hi", max: 40, bias: 0.3 });
      for (const side of [-1, 1]) {
        const F = G.frameAlong([px + side * 8.5, py, hang - 11], [side, 0, 0]);
        put([px + side * 8.5, py, hang - 10], S(G.disc(-1.2, 2.4, 4.8, F, P), { tone: "hi", crease: "lo", inner: L(G.arcOf(F, 0.4, 4.8, P), { tone: "faint" }) }), side > 0 ? 0.5 : 0.2);
      }
    },

    // ---- Audio: a ball. Built once at `rest`; the page moves it along its track.
    ball(rest, name, bias, r = 3.6) { put(rest, acc(S(G.sphereOf(rest, r, P, { steps: 36 }))), bias, { mover: name }); },

    // two rails for a ball to roll on, along a 3D route
    rails(points, { gap = 3.1, posts = 0, floor = 0, max = 12 } = {}) {
      const side = (s) => points.map((p, i) => {
        const a = points[Math.max(0, i - 1)], b = points[Math.min(points.length - 1, i + 1)];
        const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
        return [p[0] - (dy / n) * gap * s, p[1] + (dx / n) * gap * s, p[2]];
      });
      for (const s of [-1, 1]) wire(side(s), { max, bias: -6 });
      // sleepers under the rails
      points.forEach((p, i) => { if (i % 3 === 1) put(p, `<path class="iso-line" data-tone="mid" d="${path3([side(-1)[i], side(1)[i]])}"/>`, -6.5); });
      if (posts) points.forEach((p, i) => { if (i % posts === Math.floor(posts / 2) && p[2] - floor > 5) put([p[0], p[1], floor], S(k.cylinder(p[0], p[1], 0.9, floor, p[2] - floor - 0.6, P, 8), { tone: "lo", crease: "none" })); });
    },

    // ---- an instrument: tuned bars on two rails. `drop` steps them down, for a ball to hop along.
    bars(x, y, z, n = 4, { step = 12, drop = 0, floor = 0, name = "bar" } = {}) {
      const tops = [];
      for (let i = 0; i < n; i++) {
        const top = z - i * drop, bx = x + i * step, d = 30 - i * 3;
        for (const dy of [-7, 7]) put([bx, y + dy, floor], S(k.slabOf({ x: bx - 2, y: y + dy - 2, w: 4, d: 4, r: 0.8 }, floor, top - 2.6 - floor, P, 2), { tone: "mid" }), -0.2);
        put([bx, y, top], S(k.slabOf({ x: bx - 4.6, y: y - d / 2, w: 9.2, d, r: 1.2 }, top - 2.4, 2.4, P, 3, 0.4), { tone: "hi", crease: "lo" }) + D([at([bx, y - 7, top]), at([bx, y + 7, top])], { size: 0.4 }), 0.2, { part: name + i });
        part(name + i, "dip", { amp: 2.2 });
        tops.push([bx, y, top]);
      }
      return tops;
    },

    // ---- Orbiter: the craft. A mover: built at `rest`, with its beam (and arm, if any) inside so they share its depth.
    saucer(rest, name, extra = "") {
      const F = UP(rest);
      const body = [
        S(G.disc(-3.6, -1.4, 6.5, F, P, { steps: 32 }), { tone: "mid" }),
        D(G.dotsOf(F, -3.6, 4.2, 3, P, { all: true, phase: 0.4 }), { size: 0.5, tone: "hi" }),
        S(G.disc(-1.4, 1.2, 16, F, P, { steps: 56 }), { tone: "hi", crease: "lo", inner: L(G.arcOf(F, -0.1, 16, P), { tone: "faint" }) }),
        D(G.dotsOf(F, 1.2, 13.6, 10, P, { all: true }), { size: 0.42, tone: "mid" }),
        L(G.circleOf(F, 1.2, 9.4, P), { tone: "lo" }),
        S(G.solidOf([[1.2, 7.6], [4.4, 6.9, 1], [7.2, 4.8, 1], [8.8, 2.2, 1]], F, P, { steps: 36 }), { tone: "hi" }),
      ].join("");
      put(rest, `${extra}${body}`, 6, { mover: name });
    },

    // ---- Entangled World: a planet with its ring, on a stand
    world(c, r = 20, { stand = 0, tilt = [0.34, -0.2, 1] } = {}) {
      if (stand) {
        const z0 = c[2] - r - stand;
        put([c[0], c[1], z0], S(k.cylinder(c[0], c[1], 9, z0, 2.4, P, 28, 0.5), { tone: "mid" }));
        put([c[0], c[1], z0], S(k.cylinder(c[0], c[1], 2, z0 + 2.4, stand, P, 14), { tone: "mid", crease: "none" }), 0.1);
      }
      const F = G.frameAlong(c, G.unit3(tilt));
      const bands = [-0.45, 0.2, 0.62].map((f) => L(G.arcOf(F, f * r, Math.sqrt(1 - f * f) * r, P, { slope: -f / Math.sqrt(1 - f * f) }), { tone: "faint" })).join("");
      put(c, S(G.sphereOf(c, r, P, { steps: 72 }), { tone: "hi", inner: bands }));
      tube(G.arcPoints(F, 0, r * 1.5, 0, TAU, 72).slice(0, -1), 1.15, { tone: "hi", closed: true, max: 13 });
    },
    // the Orbiter's path round the World: the points it flies through (the path itself is not drawn)
    orbit(c, r, z) { return G.arcPoints(UP([c[0], c[1], z]), 0, r, 0, TAU, 96); },

    pot(x, y, z = 0, r = 7, h = 10) {
      const F = UP([x, y, z]);
      put([x, y, z], S(G.solidOf([[0, r * 0.72], [h, r]], F, P), { tone: "mid" }));
      put([x, y, z], S(G.disc(h, h + 1.6, r + 1, F, P), { tone: "mid" }), 0.1);
      put([x, y, z], L(G.circleOf(F, h + 1.6, r - 1.2, P), { tone: "lo" }), 0.2);
      return z + h + 1.6;
    },
    // a flat leaf in the vertical plane through `plane`, growing from o at angle `dir` (0 = straight up)
    leaf(o, dir, len, wide, plane = [1, 0, 0]) {
      const F = G.frameOf(o, [-plane[1], plane[0], 0], plane, [0, 0, 1]);
      const n = 9, pts = [];
      for (let i = 0; i <= n; i++) { const t = i / n; pts.push([t * len, Math.sin(t * Math.PI) * wide]); }
      for (let i = n - 1; i > 0; i--) { const t = i / n; pts.push([t * len, -Math.sin(t * Math.PI) * wide * 0.55]); }
      const c = Math.cos(dir), s = Math.sin(dir);
      return S(G.prismOf(F, pts.map(([l, w]) => [l * s + w * c, l * c - w * s]), -0.4, 0.4, P), { tone: "hi" });
    },
    // ---- Release: a sprout in a pot
    sprout(x, y, z = 0, { size = 1, name = "sprout" } = {}) {
      const top = T.pot(x, y, z, 7 * size, 9 * size);
      const tip = top + 13 * size;
      const stem = tubeStr([[x, y, top - 1], [x, y, top + 6 * size], [x + 0.6, y, tip]], 0.8, { tone: "hi" });
      put([x, y, tip], acc(`${stem}${T.leaf([x + 0.4, y, tip - 3 * size], -0.75, 12 * size, 4 * size)}${T.leaf([x + 0.4, y, tip - 3 * size], 0.95, 15 * size, 4.6 * size)}`), 0.5, { part: name });
      part(name, "grow", { pivot: at([x, y, top - 1]).map(fix), amp: 0.2 });
      return [x, y, top];
    },
    // ---- Plantasia Space: the orchid
    orchid(x, y, z = 0, { size = 1, name = "bloom" } = {}) {
      const top = T.pot(x, y, z, 8 * size, 10 * size);
      const head = [x - 1, y - 1, top + 40 * size];
      tube([[x, y, top - 1], [x + 2, y + 1, top + 16 * size], [x, y, top + 30 * size], head], 0.9, { tone: "hi", max: 60, bias: 0.3 });
      put([x, y, top], T.leaf([x, y, top], -1.25, 15 * size, 3.4 * size) + T.leaf([x, y, top], 1.2, 17 * size, 3.6 * size), 0.35);
      const face = [-Math.SQRT1_2, Math.SQRT1_2, 0];
      const petals = [[0, 11, 5.4], [2.2, 10, 4.6], [-2.2, 10, 4.6], [1.05, 8, 3], [-1.05, 8, 3]].map(([d, len, wide]) => T.leaf(head, d, len * size, wide * size, face)).join("");
      const heart = [head[0] + 0.6, head[1] + 0.6, head[2] - 2.5 * size];
      put(head, `${petals}${acc(S(G.sphereOf(heart, 2.2 * size, P, { steps: 28 })))}`, 0.6, { part: name });
      part(name, "grow", { pivot: at(head).map(fix), amp: 0.12 });
    },

    // a gear, drawn `frames` times across one tooth so the page can turn it by swapping frames
    gear(x, y, z, r, teeth, name, { h = 3.4, frames = 4, turn = 1 } = {}) {
      const frame = (phase) => {
        const ringPts = [];
        for (let i = 0; i < teeth * 4; i++) { const a = ((i + phase * 4 * turn) / (teeth * 4)) * TAU; const rr = i % 4 < 2 ? r : r - 2.6; ringPts.push([x + rr * Math.cos(a), y + rr * Math.sin(a)]); }
        return S(k.extrude(ringPts, z, h, P, { convex: false }), { tone: "mid" });
      };
      const all = Array.from({ length: frames }, (_, i) => `<g data-f="${i}"${i ? ' style="display:none"' : ""}>${frame(i / frames)}</g>`).join("");
      put([x, y, z], all, 0, { part: name });
      put([x, y, z], S(k.cylinder(x, y, r * 0.36, z + h, 1.6, P, 18), { tone: "mid" }) + L(k.ring(x, y, r * 0.62, z + h, P, 28), { tone: "faint" }) + D([at([x, y, z + h + 1.6])], { size: 0.7 }), 0.2);
      part(name, "frames", { count: frames });
    },
    post(x, y, z0, z1, r = 1.2, tone = "mid") { put([x, y, z0], S(k.cylinder(x, y, r, z0, z1 - z0, P, r > 2 ? 18 : 10), { tone, crease: r > 2 ? "faint" : "none" })); },
    shelf(plan, z, h = 3) {
      // keyed at its far corner, so whatever stands on it paints after it
      put([plan.x, plan.y, z - h], S(k.slabOf(plan, z - h, h, P, 4, 0.6), { tone: "mid" }) + L(k.planOutline(k.insetPlan(plan, 3), z, P, 4), { tone: "faint" }), -4);
    },

    // the finished drawing: the base, then every item back to front, each in its own group.
    // `standalone` ("dark" | "light") makes a picture that carries the kit's styles itself.
    svg(label, { style = "", standalone = false } = {}) {
      items.sort((a, b) => a.key - b.key);
      const layer = items.map((i) => `<g data-k="${i.key.toFixed(1)}"${i.part ? ` data-part="${i.part}"` : ""}${i.mover ? ` data-mover="${i.mover}"` : ""}>${i.svg}</g>`).join("");
      return k.figureSvg({ width, height, label, standalone, body: `<style>${style}</style>${base.join("")}<g data-layer="">${layer}</g>` });
    },
    // what the page needs to move things: the screen basis and the view direction
    camera() {
      const o = at([0, 0, 0]), ex = at([1, 0, 0]), ey = at([0, 1, 0]), ez = at([0, 0, 1]);
      const r = (n) => Number(n.toFixed(4));
      return { o: o.map(r), x: [r(ex[0] - o[0]), r(ex[1] - o[1])], y: [r(ey[0] - o[0]), r(ey[1] - o[1])], z: [r(ez[0] - o[0]), r(ez[1] - o[1])], v: V.map(r) };
    },
  };
  return T;
}
