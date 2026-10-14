// Built by figures/src/module-families/build.mjs. Do not edit by hand.
// src/anatomy/kit.ts
var AZIMUTH = 45;
var ELEVATION = 30;
var SHADES = 4;
var RADIANS = Math.PI / 180;
var UNIT = Math.sqrt(1.6);
function cameraOf({ scale, azimuth = AZIMUTH, elevation = ELEVATION }) {
  const a = azimuth * RADIANS;
  const e = elevation * RADIANS;
  return { sinA: Math.sin(a), cosA: Math.cos(a), sinE: Math.sin(e), cosE: Math.cos(e), k: scale * UNIT };
}
function iso([x, y, z], projection) {
  const { origin } = projection;
  const { sinA, cosA, sinE, cosE, k } = cameraOf(projection);
  return [origin[0] + (x * sinA - y * cosA) * k, origin[1] + ((x * cosA + y * sinA) * sinE - z * cosE) * k];
}
function towardViewer(projection) {
  const { sinA, cosA } = cameraOf(projection);
  return [cosA, sinA];
}
function depthOf([x, y, z], projection) {
  const { sinA, cosA, sinE, cosE } = cameraOf(projection);
  return (x * cosA + y * sinA) * cosE + z * sinE;
}
var tenth = (value) => {
  const text = (Math.round(value * 10) / 10).toFixed(1).replace(/\.0$/, "");
  return text === "-0" ? "0" : text;
};
function pathOf(points, closed = false) {
  if (!points.length) return "";
  return points.map(([x, y], at) => `${at ? "L" : "M"}${tenth(x)} ${tenth(y)}`).join("") + (closed ? "Z" : "");
}
var joinPaths = (paths) => paths.filter(Boolean).join("");
function roundedPlan({ x, y, w, d, r }, steps = 8) {
  const radius = Math.max(0, Math.min(r, w / 2, d / 2));
  const corners2 = [
    [x + w - radius, y + radius, -90],
    [x + w - radius, y + d - radius, 0],
    [x + radius, y + d - radius, 90],
    [x + radius, y + radius, 180]
  ];
  const out = [];
  for (const [cx, cy, start] of corners2) {
    const count = radius > 0 ? steps : 0;
    for (let step = 0; step <= count; step++) {
      const angle = (start + (count ? 90 * step / count : 45)) * RADIANS;
      out.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
    }
  }
  return out;
}
function signedArea(points) {
  let area = 0;
  for (let index = 0; index < points.length; index++) {
    const [ax, ay] = points[index];
    const [bx, by] = points[(index + 1) % points.length];
    area += ax * by - bx * ay;
  }
  return area / 2;
}
var oriented = (points) => signedArea(points) < 0 ? [...points].reverse() : points;
function convexHull(points) {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (sorted.length < 3) return sorted;
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const point of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) lower.pop();
    lower.push(point);
  }
  const upper = [];
  for (let index = sorted.length - 1; index >= 0; index--) {
    const point = sorted[index];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) upper.pop();
    upper.push(point);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
function runsOf(flags, want) {
  const count = flags.length;
  const runs = [];
  const start = flags.findIndex((flag, index) => flag !== flags[(index + count - 1) % count]);
  if (start < 0) return flags[0] === want ? [Array.from({ length: count + 1 }, (_, index) => index % count)] : [];
  let run = null;
  for (let step = 0; step < count; step++) {
    const index = (start + step) % count;
    if (flags[index] === want) {
      if (!run) run = [index];
      run.push((index + 1) % count);
    } else if (run) {
      runs.push(run);
      run = null;
    }
  }
  if (run) runs.push(run);
  return runs;
}
function extrude(ring2, z, height, projection, options = {}) {
  const convex = options.convex ?? true;
  const count = ring2.length;
  const counter = signedArea(ring2) > 0;
  const [vx, vy] = towardViewer(projection);
  const { sinA, cosA } = cameraOf(projection);
  const normals = ring2.map(([ax, ay], index) => {
    const [bx, by] = ring2[(index + 1) % count];
    const dx = bx - ax;
    const dy = by - ay;
    const length = Math.hypot(dx, dy) || 1;
    return counter ? [dy / length, -dx / length] : [-dy / length, dx / length];
  });
  const facing = normals.map(([nx, ny]) => nx * vx + ny * vy > 1e-9);
  const top = ring2.map(([x, y]) => iso([x, y, z + height], projection));
  const bottom = ring2.map(([x, y]) => iso([x, y, z], projection));
  const outline = [];
  const crease = [];
  for (const run of runsOf(facing, false)) outline.push(pathOf(run.map((index) => top[index])));
  for (const run of runsOf(facing, true)) {
    crease.push(pathOf(run.map((index) => top[index])));
    if (height > 0) outline.push(pathOf(run.map((index) => bottom[index])));
  }
  if (height > 0) {
    for (let index = 0; index < count; index++) {
      if (facing[(index + count - 1) % count] !== facing[index]) outline.push(pathOf([top[index], bottom[index]]));
    }
  }
  let fill;
  if (convex) {
    fill = pathOf(convexHull([...top, ...bottom]), true);
  } else {
    const parts = [pathOf(oriented(top), true), pathOf(oriented(bottom), true)];
    for (let index = 0; index < count; index++) {
      if (!facing[index]) continue;
      const next = (index + 1) % count;
      parts.push(pathOf(oriented([top[index], top[next], bottom[next], bottom[index]]), true));
    }
    fill = parts.join("");
  }
  const buckets = Array.from({ length: SHADES }, () => []);
  if (height > 0) {
    const [lx, ly] = [-sinA, cosA];
    for (let index = 0; index < count; index++) {
      if (!facing[index]) continue;
      const [nx, ny] = normals[index];
      const lit = (nx * lx + ny * ly + 1) / 2;
      const shade = Math.min(SHADES - 1, Math.max(0, Math.floor(lit * SHADES)));
      const next = (index + 1) % count;
      buckets[shade].push(pathOf(oriented([top[index], top[next], bottom[next], bottom[index]]), true));
    }
  }
  let bevel;
  if (options.bevel && options.bevel > 0) {
    const by = options.bevel;
    const inset = ring2.map(([x, y], index) => {
      const [ax, ay] = normals[(index + count - 1) % count];
      const [bx, by2] = normals[index];
      const mx = ax + bx;
      const my = ay + by2;
      const length = Math.hypot(mx, my) || 1;
      return [x - mx / length * by, y - my / length * by];
    });
    const insetTop = inset.map(([x, y]) => iso([x, y, z + height], projection));
    bevel = runsOf(facing, true).map((run) => pathOf([top[run[0]], ...run.slice(1, -1).map((index) => insetTop[index]), top[run[run.length - 1]]])).join("");
  }
  return {
    fill,
    outline: outline.join(""),
    crease: crease.join(""),
    top: pathOf(oriented(top), true),
    shades: buckets.map((paths) => paths.join("")),
    bevel
  };
}
var ringOf = (plan, steps = 8) => roundedPlan(plan, steps);
function slabOf(plan, z, height, projection, steps = 8, bevel = 0) {
  return extrude(ringOf(plan, steps), z, height, projection, { convex: true, bevel });
}
function circleRing(cx, cy, radius, steps = 40) {
  return Array.from({ length: steps }, (_, step) => {
    const angle = step / steps * Math.PI * 2;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  });
}
function cylinder(cx, cy, radius, z, height, projection, steps = 32, bevel = 0) {
  return extrude(circleRing(cx, cy, radius, steps), z, height, projection, { convex: true, bevel });
}
var insetPlan = ({ x, y, w, d, r }, by) => ({ x: x + by, y: y + by, w: w - by * 2, d: d - by * 2, r: Math.max(0, r - by) });
function onTop(points, z, projection, closed = false) {
  return pathOf(
    points.map(([x, y]) => iso([x, y, z], projection)),
    closed
  );
}
var planOutline = (plan, z, projection, steps = 8) => onTop(ringOf(plan, steps), z, projection, true);
var lineOnTop = (from, to, z, projection) => onTop([from, to], z, projection);
var segment = (from, to, projection) => pathOf([iso(from, projection), iso(to, projection)]);
var rise = (at, from, to, projection) => segment([at[0], at[1], from], [at[0], at[1], to], projection);
var ring = (cx, cy, radius, z, projection, steps = 40) => onTop(circleRing(cx, cy, radius, steps), z, projection, true);
var pointsAt = (points, projection) => points.map((point) => iso(point, projection));
function dotGrid(x, y, columns, rows, gap, z, projection) {
  const dots = [];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) dots.push(iso([x + column * gap, y + row * gap, z], projection));
  }
  return dots;
}
function corners({ x, y, w, d }, inset = 0) {
  return [
    [x + inset, y + inset],
    [x + w - inset, y + inset],
    [x + inset, y + d - inset],
    [x + w - inset, y + d - inset]
  ];
}
function boxCorners({ x, y, w, d }, z0, z1) {
  const out = [];
  for (const px of [x, x + w]) for (const py of [y, y + d]) for (const z of [z0, z1]) out.push([px, py, z]);
  return out;
}
function knurl(cx, cy, radius, z0, z1, count, projection, inset = 0.4) {
  const [vx, vy] = towardViewer(projection);
  const lines = [];
  for (let index = 0; index < count; index++) {
    const angle = index / count * Math.PI * 2;
    const nx = Math.cos(angle);
    const ny = Math.sin(angle);
    if (nx * vx + ny * vy < 0.15) continue;
    lines.push(segment([cx + radius * nx, cy + radius * ny, z0 + inset], [cx + radius * nx, cy + radius * ny, z1 - inset], projection));
  }
  return lines.join("");
}
function sideArc(cx, cy, radius, z, projection, steps = 24) {
  const [vx, vy] = towardViewer(projection);
  const facing = Math.atan2(vy, vx);
  const points = [];
  for (let step = 0; step <= steps; step++) {
    const angle = facing - Math.PI / 2 + step / steps * Math.PI;
    points.push(iso([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle), z], projection));
  }
  return pathOf(points);
}
function ringSeam(ring2, z, projection) {
  const count = ring2.length;
  const counter = signedArea(ring2) > 0;
  const [vx, vy] = towardViewer(projection);
  const facing = ring2.map(([ax, ay], index) => {
    const [bx, by] = ring2[(index + 1) % count];
    const dx = bx - ax;
    const dy = by - ay;
    const [nx, ny] = counter ? [dy, -dx] : [-dy, dx];
    return nx * vx + ny * vy > 1e-9;
  });
  return runsOf(facing, true).map((run) => pathOf(run.map((index) => iso([ring2[index][0], ring2[index][1], z], projection)))).join("");
}
var sideSeam = (plan, z, projection, steps = 8) => ringSeam(ringOf(plan, steps), z, projection);
function sideRing(center, radius, axis, projection, steps = 20) {
  const [px, py, pz] = center;
  const points = [];
  for (let step = 0; step < steps; step++) {
    const angle = step / steps * Math.PI * 2;
    const u = radius * Math.cos(angle);
    const v = radius * Math.sin(angle);
    points.push(iso(axis === "x" ? [px, py + u, pz + v] : [px + u, py, pz + v], projection));
  }
  return pathOf(points, true);
}
function coil(from, to, center, radius, turns, axis, projection, perTurn = 16) {
  const count = Math.max(1, Math.round(turns * perTurn));
  const back = [];
  const front = [];
  let run = [];
  let near = null;
  for (let index = 0; index <= count; index++) {
    const share = index / count;
    const angle = share * turns * Math.PI * 2;
    const u = radius * Math.cos(angle);
    const v = radius * Math.sin(angle);
    const along = from + (to - from) * share;
    const point = axis === "x" ? [along, center[0] + u, center[1] + v] : [center[0] + u, along, center[1] + v];
    const normal = axis === "x" ? [0, Math.cos(angle), Math.sin(angle)] : [Math.cos(angle), 0, Math.sin(angle)];
    const facing = depthOf(normal, projection) > 0;
    const flat = iso(point, projection);
    if (near === null) near = facing;
    if (facing !== near) {
      run.push(flat);
      (near ? front : back).push(pathOf(run));
      run = [flat];
      near = facing;
      continue;
    }
    run.push(flat);
  }
  if (run.length > 1) (near ? front : back).push(pathOf(run));
  return { back: back.join(""), front: front.join("") };
}
function topTicks(from, to, step, every, edge, z, lengths, projection, axis = "x") {
  const minor = [];
  const major = [];
  const first = Math.ceil(from / step) * step;
  for (let at = first, index = Math.round(first / step); at <= to + 1e-9; at += step, index++) {
    const big = index % every === 0;
    const length = big ? lengths[1] : lengths[0];
    const a = axis === "x" ? [at, edge] : [edge, at];
    const b = axis === "x" ? [at, edge + length] : [edge + length, at];
    (big ? major : minor).push(lineOnTop(a, b, z, projection));
  }
  return { minor: minor.join(""), major: major.join("") };
}
function sideTicks(from, to, step, every, face, top, lengths, projection, axis = "x") {
  const minor = [];
  const major = [];
  const first = Math.ceil(from / step) * step;
  for (let at = first, index = Math.round(first / step); at <= to + 1e-9; at += step, index++) {
    const big = index % every === 0;
    const length = big ? lengths[1] : lengths[0];
    const a = axis === "x" ? [at, face, top] : [face, at, top];
    const b = axis === "x" ? [at, face, top - length] : [face, at, top - length];
    (big ? major : minor).push(segment(a, b, projection));
  }
  return { minor: minor.join(""), major: major.join("") };
}
function radialTicks(cx, cy, radius, count, every, z, lengths, projection, from = 0, span = Math.PI * 2) {
  const minor = [];
  const major = [];
  const closed = Math.abs(span - Math.PI * 2) < 1e-9;
  const steps = closed ? count : count + 1;
  for (let index = 0; index < steps; index++) {
    const angle = from + index / count * span;
    const big = index % every === 0;
    const inner = radius - (big ? lengths[1] : lengths[0]);
    const sx = Math.sin(angle);
    const sy = -Math.cos(angle);
    (big ? major : minor).push(lineOnTop([cx + sx * inner, cy + sy * inner], [cx + sx * radius, cy + sy * radius], z, projection));
  }
  return { minor: minor.join(""), major: major.join("") };
}
var haloOf = (plan, z, height, projection) => slabOf(plan, z, height, projection).fill;
function axisVector(projection, [dx, dy, dz]) {
  const origin = iso([0, 0, 0], projection);
  const moved = iso([dx, dy, dz], projection);
  return [moved[0] - origin[0], moved[1] - origin[1]];
}
var fine = (value) => Math.round(value * 100) / 100;
function translateAlong(projection, by) {
  const [x, y] = axisVector(projection, by);
  return `translate(${fine(x)} ${fine(y)})`;
}
var thousandth = (value) => Math.round(value * 1e3) / 1e3;
function axesAt(at, z, projection) {
  const origin = iso([at[0], at[1], z], projection);
  const along = (point) => {
    const [px, py] = iso(point, projection);
    return [px - origin[0], py - origin[1]];
  };
  return { origin, x: along([at[0] + 1, at[1], z]), y: along([at[0], at[1] + 1, z]), z: along([at[0], at[1], z + 1]) };
}
var matrixOf = (u, v, origin) => `matrix(${thousandth(u[0])} ${thousandth(u[1])} ${thousandth(v[0])} ${thousandth(v[1])} ${thousandth(origin[0])} ${thousandth(origin[1])})`;
function holdStill(element, [dx, dy]) {
  const text = dx || dy ? `translate(${-dx} ${-dy})` : "";
  element.querySelectorAll("[data-hold]").forEach((node) => text ? node.setAttribute("transform", text) : node.removeAttribute("transform"));
}
function topMatrix(at, z, projection, along = "x") {
  const { origin, x, y } = axesAt(at, z, projection);
  return along === "x" ? matrixOf(x, y, origin) : matrixOf([-y[0], -y[1]], x, origin);
}
function sideMatrix(at, z, projection, face) {
  const { origin, x, y, z: up } = axesAt(at, z, projection);
  const down = [-up[0], -up[1]];
  return face === "left" ? matrixOf(x, down, origin) : matrixOf([-y[0], -y[1]], down, origin);
}
function screenRise(height, projection) {
  const { cosE, k } = cameraOf(projection);
  return height * cosE * k;
}
function fitProjection(points, width, height, { pad = 24, headroom = 0, azimuth = AZIMUTH, elevation = ELEVATION } = {}) {
  const unit = { origin: [0, 0], scale: 1, azimuth, elevation };
  const flat = points.map((point) => iso(point, unit));
  const xs = flat.map(([x]) => x);
  const ys = flat.map(([, y]) => y);
  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const up = Math.min(...ys);
  const down = Math.max(...ys);
  const scale = Math.min((width - pad * 2) / (right - left), (height - pad * 2 - headroom) / (down - up));
  return {
    origin: [width / 2 - (left + right) / 2 * scale, headroom + (height - headroom) / 2 - (up + down) / 2 * scale],
    scale,
    azimuth,
    elevation
  };
}
var escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
var attrs = (pairs) => Object.entries(pairs).filter(([, value]) => value !== void 0 && value !== false).map(([key, value]) => ` ${key}="${escape(String(value))}"`).join("");
function solidSvg(paths, { tone = "hi", crease = "faint", halo = false, lit = false, flat = false, className, inner = "" } = {}) {
  const parts = [];
  if (halo) parts.push(`<path class="iso-halo" d="${paths.fill}"/>`);
  parts.push(`<path class="iso-fill" d="${paths.fill}"/>`);
  if (!flat) {
    paths.shades.forEach((d, shade) => {
      if (d) parts.push(`<path class="iso-shade" data-shade="${shade}" d="${d}"/>`);
    });
    parts.push(`<path class="iso-top" d="${paths.top}"/>`);
  }
  if (crease !== "none" && paths.crease) parts.push(`<path class="iso-line iso-crease" data-tone="${crease}" d="${paths.crease}"/>`);
  if (crease !== "none" && paths.bevel) parts.push(`<path class="iso-line iso-bevel" data-tone="${crease}" d="${paths.bevel}"/>`);
  if (inner) parts.push(inner);
  parts.push(`<path class="iso-line iso-edge" data-tone="${tone}" d="${paths.outline}"/>`);
  return `<g${attrs({ class: className ? `iso-solid ${className}` : "iso-solid", "data-lit": lit ? "" : void 0, "data-seamless": paths.seamless ? "" : void 0 })}>${parts.join("")}</g>`;
}
function lineSvg(d, { tone = "lo", dotted = false, dashed = false, flow = false, className, free } = {}) {
  if (!d) return "";
  return `<path${attrs({
    class: className ? `iso-line ${className}` : "iso-line",
    "data-tone": tone,
    "data-free": free === true ? "" : free || void 0,
    "data-dotted": dotted ? "" : void 0,
    "data-dashed": dashed ? "" : void 0,
    "data-flow": flow ? "" : void 0,
    d
  })}/>`;
}
function dotsSvg(points, { size = 0.5, tone = "mid", pulse = false } = {}) {
  const dots = points.map(([x, y, alpha], index) => `<circle cx="${tenth(x)}" cy="${tenth(y)}" r="${size}"${alpha !== void 0 && alpha < 1 ? ` fill-opacity="${Math.max(0, alpha).toFixed(2)}"` : ""}${pulse ? ` data-pulse="" style="--pulse-at:${index * 137 % 1600}ms"` : ""}/>`).join("");
  return `<g class="iso-dots" data-tone="${tone}">${dots}</g>`;
}
function fadedSvg(list, style = {}) {
  const groups = /* @__PURE__ */ new Map();
  for (const entry of list) {
    const [d, alpha] = Array.isArray(entry) ? entry : [entry.d, entry.alpha];
    if (!d || !(alpha > 0.02)) continue;
    const level = Math.min(1, Math.round(alpha * 20) / 20);
    groups.set(level, (groups.get(level) ?? "") + d);
  }
  return [...groups].map(([alpha, d]) => alpha >= 1 ? lineSvg(d, style) : `<g opacity="${alpha.toFixed(2)}">${lineSvg(d, style)}</g>`).join("");
}
function fadeLineSvg(points, { fade = [0, 0], tone = "lo", className, stops = 6 } = {}) {
  if (points.length < 2) return "";
  const ease = (t) => t * t * (3 - 2 * t);
  const hashOf = (text) => {
    let hash = 2166136261;
    for (let index = 0; index < text.length; index++) hash = Math.imul(hash ^ text.charCodeAt(index), 16777619);
    return (hash >>> 0).toString(36);
  };
  const lengths = [0];
  for (let index = 1; index < points.length; index++) lengths.push(lengths[index - 1] + Math.hypot(points[index][0] - points[index - 1][0], points[index][1] - points[index - 1][1]));
  const at = (length) => {
    let index = 1;
    while (index < points.length - 1 && lengths[index] < length) index++;
    const span = lengths[index] - lengths[index - 1] || 1;
    const t = Math.max(0, Math.min(1, (length - lengths[index - 1]) / span));
    return [points[index - 1][0] + (points[index][0] - points[index - 1][0]) * t, points[index - 1][1] + (points[index][1] - points[index - 1][1]) * t];
  };
  const pieceOf = (from, to) => [at(from), ...points.filter((_, index) => lengths[index] > from + 1e-6 && lengths[index] < to - 1e-6), at(to)];
  const total = lengths[lengths.length - 1];
  if (total < 1e-6) return "";
  let [start, end] = Array.isArray(fade) ? fade : [fade, fade];
  if (start + end > total) {
    const share = total / (start + end);
    start *= share;
    end *= share;
  }
  const paint = `var(--anatomy-${tone})`;
  const ramp = (piece, rising) => {
    const d = pathOf(piece);
    const [x1, y1] = piece[0];
    const [x2, y2] = piece[piece.length - 1];
    const id = `iso-fade-${hashOf(`${d}|${tone}|${rising}`)}`;
    const marks = Array.from({ length: stops + 1 }, (_, index) => {
      const t = index / stops;
      const alpha = ease(rising ? t : 1 - t);
      return `<stop offset="${t.toFixed(3)}" stop-opacity="${alpha.toFixed(3)}" style="stop-color:${paint}"/>`;
    }).join("");
    const gradient = `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${tenth(x1)}" y1="${tenth(y1)}" x2="${tenth(x2)}" y2="${tenth(y2)}">${marks}</linearGradient>`;
    return `<defs>${gradient}</defs><path${attrs({ class: className ? `iso-line ${className}` : "iso-line", "data-tone": tone, "data-free": rising ? "start" : "end", d, style: `stroke:url(#${id})` })}/>`;
  };
  const parts = [];
  if (start > 0.05) parts.push(ramp(pieceOf(0, start), true));
  if (total - end - start > 0.05) parts.push(lineSvg(pathOf(pieceOf(start, total - end)), { tone, className }));
  if (end > 0.05) parts.push(ramp(pieceOf(total - end, total), false));
  return `<g class="iso-fade">${parts.join("")}</g>`;
}
function wireSvg(from, to, { via = [], tone = "lo", dotted = false, dashed = false, flow = false, ends = "both", size = 1.2 } = {}) {
  const d = pathOf([from, ...via, to]);
  const end = ([x, y]) => `<circle class="iso-wire-end" cx="${tenth(x)}" cy="${tenth(y)}" r="${size}"/>`;
  return `<g class="iso-wire" data-tone="${tone}">${lineSvg(d, { tone, dotted, dashed, flow })}${ends === "both" || ends === "from" ? end(from) : ""}${ends === "both" || ends === "to" ? end(to) : ""}</g>`;
}
function faceTextSvg(transform, text, { size = 3, tone = "mid", anchor = "start" } = {}) {
  return `<text class="iso-face-text" data-tone="${tone}" transform="${transform}" font-size="${size}" text-anchor="${anchor}">${escape(text)}</text>`;
}
function groupSvg(children, extra = {}) {
  return `<g${attrs(extra)}>${Array.isArray(children) ? children.join("") : children}</g>`;
}
function figureSvg({ width, height, label, body, standalone = false, className }) {
  const style = standalone ? `<style>${ISO_CSS}</style>` : "";
  return `<svg${attrs({
    xmlns: "http://www.w3.org/2000/svg",
    class: `iso-svg${standalone ? " iso" : ""}${className ? ` ${className}` : ""}`,
    "data-theme": standalone || void 0,
    viewBox: `0 0 ${width} ${height}`,
    role: "img",
    "aria-label": label
  })}>${style}${Array.isArray(body) ? body.join("") : body}</svg>`;
}
function swatchSvg(mark) {
  if (mark === "raised" || mark === "flat" || mark === "lit") {
    const body = mark === "flat" ? "M2 6.5 8 3.5 14 6.5 8 9.5Z" : "M2 4.5 8 1.5 14 4.5 14 6 8 9 2 6Z";
    const crease = mark === "flat" ? "" : `<path class="iso-swatch-crease" d="M2 4.5 8 7.5 14 4.5"/>`;
    return `<svg class="iso-swatch" data-mark="${mark}" viewBox="0 0 16 10" aria-hidden="true"><path d="${body}"/>${crease}</svg>`;
  }
  return `<svg class="iso-swatch" data-mark="${mark}" viewBox="0 0 16 10" aria-hidden="true"><path d="M1.5 5h13"/></svg>`;
}
function plateHtml({ fig, title, hint, readout = "", keys = [], caption, body }) {
  const corner = (name, text, extra = "") => `<span class="iso-plate-corner" data-corner="${name}"${extra}>${escape(text)}</span>`;
  const legend = keys.length || caption ? `<figcaption class="iso-legend">${keys.length ? `<span class="iso-keys">${keys.map((key) => `<span class="iso-key">${swatchSvg(key.mark)}${escape(key.label)}</span>`).join("")}</span>` : ""}${caption ? `<span class="iso-caption">${escape(caption)}</span>` : ""}</figcaption>` : "";
  return `<figure class="iso-figure"><div class="iso-plate"><div class="iso-plate-corners" aria-hidden="true">${corner("fig", fig)}${title ? corner("title", title) : ""}${hint ? corner("hint", hint) : ""}${corner("readout", readout, " data-readout")}</div>${body}</div>${legend}</figure>`;
}
function pageHtml({ title, theme = "dark", body, script = "", width = 650 }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><style>${ISO_CSS}${PAGE_CSS.replace("__WIDTH__", String(width))}</style></head><body class="iso" data-theme="${theme}"><main class="iso-page">${body}</main>${script ? `<script type="module">${script.replace(/<\/(script)/gi, "<\\/$1")}</script>` : ""}</body></html>`;
}
var PAGE_CSS = `
*{box-sizing:border-box}
html{color-scheme:dark}
body[data-theme="light"]{color-scheme:light}
body{margin:0;background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
.iso-page{width:min(__WIDTH__px,100% - 32px);margin:64px auto 96px}
`;
var ISO_CSS = `
.iso{
  --anatomy-page:#0b0b0b;--anatomy-card:#131313;--anatomy-text:#a3a3a3;--anatomy-strong:#e6e6e6;--anatomy-muted:#6e6e6e;
  --anatomy-paper:#131313;--anatomy-face:#1b1b1b;--anatomy-top:#1c1c1c;
  --anatomy-shade-0:#0f0f0f;--anatomy-shade-1:#121212;--anatomy-shade-2:#151515;--anatomy-shade-3:#181818;
  --anatomy-lit-top:#262626;--anatomy-lit-shade:#1d1d1d;
  --anatomy-hi:#d4d4d4;--anatomy-mid:#6a6a6a;--anatomy-lo:#3e3e3e;--anatomy-faint:#2a2a2a;--anatomy-lit:#ffffff;
  --anatomy-halo:#050505;--anatomy-halo-opacity:.9;--anatomy-dot:#e6e6e6;
  --anatomy-red:#ff6b6b;--anatomy-green:#6be0a0;--anatomy-blue:#6b9bff;
  --anatomy-weight:.6px;--anatomy-ease:cubic-bezier(.32,.72,0,1);
  --anatomy-mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --anatomy-lift:inset 0 1px 0 0 #ffffff0a,inset 0 0 0 1px #ffffff06,0 0 0 1px #00000026,0 1px 1px -.5px #00000014,0 3px 3px -1.5px #00000014,0 6px 6px -3px #00000014,0 12px 12px -6px #00000014;
}
.iso[data-theme="light"]{
  --anatomy-page:#f2f2ef;--anatomy-card:#fbfbfa;--anatomy-text:#57575a;--anatomy-strong:#18181a;--anatomy-muted:#8c8c90;
  --anatomy-paper:#fbfbfa;--anatomy-face:#ffffff;--anatomy-top:#ffffff;
  --anatomy-shade-0:#dcdcd9;--anatomy-shade-1:#e5e5e2;--anatomy-shade-2:#ededea;--anatomy-shade-3:#f4f4f1;
  --anatomy-lit-top:#ffffff;--anatomy-lit-shade:#eeeeeb;
  --anatomy-hi:#26262a;--anatomy-mid:#8a8a8f;--anatomy-lo:#b4b4b8;--anatomy-faint:#d4d4d6;--anatomy-lit:#000000;
  --anatomy-halo:#8a8a80;--anatomy-halo-opacity:.32;--anatomy-dot:#3a3a3e;
  --anatomy-red:#e5484d;--anatomy-green:#30a46c;--anatomy-blue:#3e63dd;
  --anatomy-lift:inset 0 1px 0 0 #ffffff,0 0 0 1px #0000000f,0 1px 1px -.5px #0000000a,0 3px 3px -1.5px #0000000a,0 6px 6px -3px #0000000a,0 12px 12px -6px #0000000a;
}
.iso-svg{display:block;width:100%;height:auto;overflow:visible}
.iso-svg path,.iso-svg circle{vector-effect:non-scaling-stroke}
.iso-fill{fill:var(--anatomy-paper);stroke:none}
.iso-solid[data-lit]>.iso-fill{fill:var(--anatomy-face)}
.iso-shade,.iso-top{stroke:none}
.iso-shade[data-shade="0"]{fill:var(--anatomy-shade-0)}
.iso-shade[data-shade="1"]{fill:var(--anatomy-shade-1)}
.iso-shade[data-shade="2"]{fill:var(--anatomy-shade-2)}
.iso-shade[data-shade="3"]{fill:var(--anatomy-shade-3)}
.iso-top{fill:var(--anatomy-top)}
.iso-solid[data-lit]>.iso-top{fill:var(--anatomy-lit-top)}
.iso-solid[data-lit]>.iso-shade{fill:var(--anatomy-lit-shade)}
.iso-solid[data-seamless]>.iso-shade,.iso-solid[data-seamless]>.iso-top{stroke-width:.4;stroke-linejoin:round}
.iso-solid[data-seamless]>.iso-shade[data-shade="0"]{stroke:var(--anatomy-shade-0)}
.iso-solid[data-seamless]>.iso-shade[data-shade="1"]{stroke:var(--anatomy-shade-1)}
.iso-solid[data-seamless]>.iso-shade[data-shade="2"]{stroke:var(--anatomy-shade-2)}
.iso-solid[data-seamless]>.iso-shade[data-shade="3"]{stroke:var(--anatomy-shade-3)}
.iso-solid[data-seamless]>.iso-top{stroke:var(--anatomy-top)}
.iso-solid[data-seamless][data-lit]>.iso-top{stroke:var(--anatomy-lit-top)}
.iso-solid[data-seamless][data-lit]>.iso-shade{stroke:var(--anatomy-lit-shade)}
.iso-solid[data-lit]>.iso-edge{stroke:var(--anatomy-lit)}
.iso-halo{fill:var(--anatomy-halo);stroke:none;filter:blur(9px);opacity:var(--anatomy-halo-opacity);transform:translateY(3px)}
.iso-line{fill:none;stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linecap:round;stroke-linejoin:round}
.iso-line[data-tone="hi"]{stroke:var(--anatomy-hi)}
.iso-line[data-tone="mid"]{stroke:var(--anatomy-mid)}
.iso-line[data-tone="lo"]{stroke:var(--anatomy-lo)}
.iso-line[data-tone="faint"]{stroke:var(--anatomy-faint)}
.iso-line[data-tone="lit"]{stroke:var(--anatomy-lit)}
.iso-line[data-tone="red"]{stroke:var(--anatomy-red)}
.iso-line[data-tone="green"]{stroke:var(--anatomy-green)}
.iso-line[data-tone="blue"]{stroke:var(--anatomy-blue)}
.iso-line[data-dotted]{stroke-dasharray:.01 3.5;stroke-width:1}
.iso-line[data-dashed]{stroke-dasharray:3 3}
.iso-line[data-flow]{stroke-dasharray:2 6}
.iso-wire-end{fill:var(--anatomy-paper);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.iso-wire[data-tone="hi"] .iso-wire-end{stroke:var(--anatomy-hi)}
.iso-wire[data-tone="mid"] .iso-wire-end{stroke:var(--anatomy-mid)}
.iso-wire[data-tone="faint"] .iso-wire-end{stroke:var(--anatomy-faint)}
.iso-wire[data-tone="lit"] .iso-wire-end{stroke:var(--anatomy-lit)}
.iso-dots circle{fill:var(--anatomy-dot);stroke:none;opacity:.32}
.iso-dots[data-tone="hi"] circle{opacity:.85}
.iso-dots[data-tone="mid"] circle{opacity:.45}
.iso-dots[data-tone="lo"] circle{opacity:.22}
.iso-dots[data-tone="faint"] circle{opacity:.12}
.iso-face-text{fill:var(--anatomy-mid);font-family:var(--anatomy-mono);letter-spacing:.04em}
.iso-face-text[data-tone="hi"]{fill:var(--anatomy-hi)}
.iso-face-text[data-tone="lo"]{fill:var(--anatomy-lo)}
.iso-face-text[data-tone="faint"]{fill:var(--anatomy-faint)}
.tb-body{fill:var(--anatomy-shade-2);stroke:none}
.tb-shine{fill:var(--anatomy-top);stroke:none}
.tb-shade{fill:var(--anatomy-shade-0);stroke:none}
.tb-ring{fill:none;stroke:var(--anatomy-lo);stroke-width:.45;stroke-linecap:butt;stroke-linejoin:round}
.tb-ring[data-tone="mid"]{stroke:var(--anatomy-mid)}
.tb-ring[data-tone="faint"]{stroke:var(--anatomy-faint)}
.tb-ring[data-tone="hi"]{stroke:var(--anatomy-hi)}
@keyframes iso-flow{to{stroke-dashoffset:-32}}
@keyframes iso-pulse{0%,100%{opacity:.18}12%{opacity:1}40%{opacity:.18}}
.iso-line[data-flow]{animation:iso-flow 1600ms linear infinite}
.iso-dots circle[data-pulse]{animation:iso-pulse 1600ms steps(1,end) infinite;animation-delay:var(--pulse-at,0ms)}
.iso-figure{margin:32px 0 36px}
.iso-plate{position:relative;padding:52px 24px;border-radius:0;background:var(--anatomy-card);box-shadow:0 0 0 1px var(--anatomy-mid);--anatomy-paper:var(--anatomy-card)}
.iso-plate-corners{position:absolute;inset:18px 20px;pointer-events:none}
.iso-plate-corner{position:absolute;color:var(--anatomy-muted);font-family:var(--anatomy-mono);font-size:10.5px;line-height:1;letter-spacing:.04em;white-space:nowrap}
.iso-plate-corner[data-corner="fig"]{top:0;left:0;color:var(--anatomy-text)}
.iso-plate-corner[data-corner="title"]{top:0;right:0;text-transform:uppercase;letter-spacing:.1em}
.iso-plate-corner[data-corner="hint"]{bottom:0;left:0;text-transform:uppercase;letter-spacing:.1em}
.iso-plate-corner[data-corner="readout"]{right:0;bottom:0;color:var(--anatomy-text);font-variant-numeric:tabular-nums}
.iso-plate .iso-svg{margin:0 auto}
.iso-legend{display:grid;gap:8px;margin-top:12px;color:var(--anatomy-muted);font-size:13px;line-height:1.55}
.iso-keys{display:flex;flex-wrap:wrap;gap:6px 18px}
.iso-key{display:inline-flex;align-items:center;gap:7px}
.iso-swatch{width:16px;height:10px;flex:none;overflow:visible}
.iso-swatch path{fill:none;stroke:var(--anatomy-hi);stroke-width:1;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.iso-swatch[data-mark="raised"] path,.iso-swatch[data-mark="flat"] path{stroke:var(--anatomy-mid)}
.iso-swatch[data-mark="lit"] path{stroke:var(--anatomy-lit)}
.iso-swatch[data-mark="dim"] path{stroke:var(--anatomy-lo)}
.iso-swatch[data-mark="dotted"] path{stroke-dasharray:.01 3;stroke-width:1.4}
.iso-swatch[data-mark="dashed"] path{stroke-dasharray:3 2.5}
.iso-swatch[data-mark="red"] path{stroke:var(--anatomy-red)}
.iso-swatch[data-mark="green"] path{stroke:var(--anatomy-green)}
.iso-swatch[data-mark="blue"] path{stroke:var(--anatomy-blue)}
.iso-swatch-crease{stroke:var(--anatomy-lo)!important}
@media (max-width:560px){.iso-plate{padding:48px 12px 70px}.iso-plate-corner[data-corner="hint"]{bottom:18px}}
@media (prefers-reduced-motion:reduce){.iso-line[data-flow],.iso-dots circle[data-pulse]{animation:none}}
`;

export const svg = "<div class=\"iso-stage\" tabindex=\"0\" role=\"slider\" aria-label=\"Audio effects: left and right arrows move the sound along the rack, Home and End take it to either end\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"0\"><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"iso-svg\" viewBox=\"0 0 640 360\" role=\"img\" aria-label=\"A length of the Orbiter's rack with three audio effects in a row, and a line along its edge. The sound travels along the line from left to right and passes each effect in turn, picking up a ring from each one.\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M196.9 103.7L198 101.8L200.3 100.1L203.6 98.9L207.6 98.4L211.6 98.6L215.3 99.5L218.1 100.9L219.8 102.7L220.2 104.7L220.2 119.9L219.2 121.9L216.8 123.5L213.5 124.7L209.6 125.2L205.6 125L201.9 124.2L199 122.7L197.3 120.9L196.9 118.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M216.8 123.5L213.5 124.7L213.5 109.5L216.8 108.4ZM220.2 119.9L219.2 121.9L219.2 106.7L220.2 104.7ZM219.2 121.9L216.8 123.5L216.8 108.4L219.2 106.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M213.5 124.7L209.6 125.2L209.6 110.1L213.5 109.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M209.6 125.2L205.6 125L205.6 109.9L209.6 110.1ZM205.6 125L201.9 124.2L201.9 109L205.6 109.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M201.9 124.2L199 122.7L199 107.6L201.9 109ZM199 122.7L197.3 120.9L197.3 105.7L199 107.6ZM197.3 120.9L196.9 118.9L196.9 103.7L197.3 105.7Z\"/><path class=\"iso-top\" d=\"M216.8 108.4L213.5 109.5L209.6 110.1L205.6 109.9L201.9 109L199 107.6L197.3 105.7L196.9 103.7L198 101.8L200.3 100.1L203.6 98.9L207.6 98.4L211.6 98.6L215.3 99.5L218.1 100.9L219.8 102.7L220.2 104.7L219.2 106.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M220.2 104.7L219.2 106.7L216.8 108.4L213.5 109.5L209.6 110.1L205.6 109.9L201.9 109L199 107.6L197.3 105.7L196.9 103.7\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M196.9 103.7L198 101.8L200.3 100.1L203.6 98.9L207.6 98.4L211.6 98.6L215.3 99.5L218.1 100.9L219.8 102.7L220.2 104.7M220.2 119.9L219.2 121.9L216.8 123.5L213.5 124.7L209.6 125.2L205.6 125L201.9 124.2L199 122.7L197.3 120.9L196.9 118.9M196.9 103.7L196.9 118.9M220.2 104.7L220.2 119.9\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M114.4 145L115.5 143L117.8 141.4L121.1 140.2L125 139.7L129.1 139.9L132.7 140.7L135.6 142.2L137.3 144L137.7 146L137.7 161.2L136.6 163.1L134.3 164.8L131 166L127.1 166.5L123 166.3L119.3 165.5L116.5 164L114.8 162.2L114.4 160.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M134.3 164.8L131 166L131 150.8L134.3 149.6ZM137.7 161.2L136.6 163.1L136.6 148L137.7 146ZM136.6 163.1L134.3 164.8L134.3 149.6L136.6 148Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M131 166L127.1 166.5L127.1 151.3L131 150.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M127.1 166.5L123 166.3L123 151.1L127.1 151.3ZM123 166.3L119.3 165.5L119.3 150.3L123 151.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M119.3 165.5L116.5 164L116.5 148.9L119.3 150.3ZM116.5 164L114.8 162.2L114.8 147L116.5 148.9ZM114.8 162.2L114.4 160.2L114.4 145L114.8 147Z\"/><path class=\"iso-top\" d=\"M134.3 149.6L131 150.8L127.1 151.3L123 151.1L119.3 150.3L116.5 148.9L114.8 147L114.4 145L115.5 143L117.8 141.4L121.1 140.2L125 139.7L129.1 139.9L132.7 140.7L135.6 142.2L137.3 144L137.7 146L136.6 148Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M137.7 146L136.6 148L134.3 149.6L131 150.8L127.1 151.3L123 151.1L119.3 150.3L116.5 148.9L114.8 147L114.4 145\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M114.4 145L115.5 143L117.8 141.4L121.1 140.2L125 139.7L129.1 139.9L132.7 140.7L135.6 142.2L137.3 144L137.7 146M137.7 161.2L136.6 163.1L134.3 164.8L131 166L127.1 166.5L123 166.3L119.3 165.5L116.5 164L114.8 162.2L114.4 160.2M114.4 145L114.4 160.2M137.7 146L137.7 161.2\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M502.3 256.4L503.4 254.5L505.7 252.8L509 251.6L512.9 251.1L517 251.3L520.7 252.2L523.5 253.6L525.2 255.4L525.6 257.4L525.6 272.6L524.5 274.6L522.2 276.2L518.9 277.4L515 277.9L510.9 277.7L507.3 276.9L504.4 275.4L502.7 273.6L502.3 271.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M522.2 276.2L518.9 277.4L518.9 262.2L522.2 261.1ZM525.6 272.6L524.5 274.6L524.5 259.4L525.6 257.4ZM524.5 274.6L522.2 276.2L522.2 261.1L524.5 259.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M518.9 277.4L515 277.9L515 262.7L518.9 262.2Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M515 277.9L510.9 277.7L510.9 262.6L515 262.7ZM510.9 277.7L507.3 276.9L507.3 261.7L510.9 262.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M507.3 276.9L504.4 275.4L504.4 260.3L507.3 261.7ZM504.4 275.4L502.7 273.6L502.7 258.4L504.4 260.3ZM502.7 273.6L502.3 271.6L502.3 256.4L502.7 258.4Z\"/><path class=\"iso-top\" d=\"M522.2 261.1L518.9 262.2L515 262.7L510.9 262.6L507.3 261.7L504.4 260.3L502.7 258.4L502.3 256.4L503.4 254.5L505.7 252.8L509 251.6L512.9 251.1L517 251.3L520.7 252.2L523.5 253.6L525.2 255.4L525.6 257.4L524.5 259.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M525.6 257.4L524.5 259.4L522.2 261.1L518.9 262.2L515 262.7L510.9 262.6L507.3 261.7L504.4 260.3L502.7 258.4L502.3 256.4\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M502.3 256.4L503.4 254.5L505.7 252.8L509 251.6L512.9 251.1L517 251.3L520.7 252.2L523.5 253.6L525.2 255.4L525.6 257.4M525.6 272.6L524.5 274.6L522.2 276.2L518.9 277.4L515 277.9L510.9 277.7L507.3 276.9L504.4 275.4L502.7 273.6L502.3 271.6M502.3 256.4L502.3 271.6M525.6 257.4L525.6 272.6\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M419.8 297.7L420.8 295.7L423.2 294.1L426.5 292.9L430.4 292.4L434.4 292.6L438.1 293.4L441 294.9L442.7 296.7L443.1 298.7L443.1 313.9L442 315.8L439.7 317.5L436.4 318.7L432.4 319.2L428.4 319L424.7 318.1L421.9 316.7L420.2 314.9L419.8 312.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M439.7 317.5L436.4 318.7L436.4 303.5L439.7 302.3ZM443.1 313.9L442 315.8L442 300.7L443.1 298.7ZM442 315.8L439.7 317.5L439.7 302.3L442 300.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M436.4 318.7L432.4 319.2L432.4 304L436.4 303.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M432.4 319.2L428.4 319L428.4 303.8L432.4 304ZM428.4 319L424.7 318.1L424.7 303L428.4 303.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M424.7 318.1L421.9 316.7L421.9 301.5L424.7 303ZM421.9 316.7L420.2 314.9L420.2 299.7L421.9 301.5ZM420.2 314.9L419.8 312.9L419.8 297.7L420.2 299.7Z\"/><path class=\"iso-top\" d=\"M439.7 302.3L436.4 303.5L432.4 304L428.4 303.8L424.7 303L421.9 301.5L420.2 299.7L419.8 297.7L420.8 295.7L423.2 294.1L426.5 292.9L430.4 292.4L434.4 292.6L438.1 293.4L441 294.9L442.7 296.7L443.1 298.7L442 300.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M443.1 298.7L442 300.7L439.7 302.3L436.4 303.5L432.4 304L428.4 303.8L424.7 303L421.9 301.5L420.2 299.7L419.8 297.7\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M419.8 297.7L420.8 295.7L423.2 294.1L426.5 292.9L430.4 292.4L434.4 292.6L438.1 293.4L441 294.9L442.7 296.7L443.1 298.7M443.1 313.9L442 315.8L439.7 317.5L436.4 318.7L432.4 319.2L428.4 319L424.7 318.1L421.9 316.7L420.2 314.9L419.8 312.9M419.8 297.7L419.8 312.9M443.1 298.7L443.1 313.9\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M88.4 135.4L89.1 133.7L91 132.3L202.4 76.6L205.2 75.6L208.6 75.3L211.9 75.6L214.8 76.6L549 243.7L550.9 245.1L551.6 246.8L551.6 256.9L550.9 258.6L549 260L437.6 315.7L434.8 316.7L431.4 317L428.1 316.7L425.2 315.7L91 148.6L89.1 147.2L88.4 145.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M551.6 256.9L550.9 258.6L550.9 248.5L551.6 246.8ZM550.9 258.6L549 260L549 249.9L550.9 248.5ZM549 260L437.6 315.7L437.6 305.6L549 249.9ZM437.6 315.7L434.8 316.7L434.8 306.6L437.6 305.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M434.8 316.7L431.4 317L431.4 306.9L434.8 306.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M431.4 317L428.1 316.7L428.1 306.6L431.4 306.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M428.1 316.7L425.2 315.7L425.2 305.6L428.1 306.6ZM425.2 315.7L91 148.6L91 138.5L425.2 305.6ZM91 148.6L89.1 147.2L89.1 137.1L91 138.5ZM89.1 147.2L88.4 145.5L88.4 135.4L89.1 137.1Z\"/><path class=\"iso-top\" d=\"M549 243.7L550.9 245.1L551.6 246.8L550.9 248.5L549 249.9L437.6 305.6L434.8 306.6L431.4 306.9L428.1 306.6L425.2 305.6L91 138.5L89.1 137.1L88.4 135.4L89.1 133.7L91 132.3L202.4 76.6L205.2 75.6L208.6 75.3L211.9 75.6L214.8 76.6Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M551.6 246.8L550.9 248.5L549 249.9L437.6 305.6L434.8 306.6L431.4 306.9L428.1 306.6L425.2 305.6L91 138.5L89.1 137.1L88.4 135.4\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M551.6 246.8L549.3 248.2L547.7 249.4L436.5 305L434.1 305.8L431.4 306L428.7 305.8L426.3 305L92.3 137.9L90.7 136.7L88.4 135.4\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M551.6 251.9L550.9 253.6L549 255L437.6 310.7L434.8 311.6L431.4 312L428.1 311.6L425.2 310.7L91 143.5L89.1 142.1L88.4 140.5\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M88.4 135.4L89.1 133.7L91 132.3L202.4 76.6L205.2 75.6L208.6 75.3L211.9 75.6L214.8 76.6L549 243.7L550.9 245.1L551.6 246.8M551.6 256.9L550.9 258.6L549 260L437.6 315.7L434.8 316.7L431.4 317L428.1 316.7L425.2 315.7L91 148.6L89.1 147.2L88.4 145.5M551.6 246.8L551.6 256.9M88.4 135.4L88.4 145.5\"/></g><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"208.6\" cy=\"81.7\" r=\"0.42\"/><circle cx=\"538.7\" cy=\"246.8\" r=\"0.42\"/><circle cx=\"101.3\" cy=\"135.4\" r=\"0.42\"/><circle cx=\"431.4\" cy=\"300.5\" r=\"0.42\"/></g><path class=\"iso-line\" data-tone=\"mid\" d=\"M109.5 139.5L423.2 296.3\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M101.9 136L102.5 134.5L104.2 133.3L106.6 132.5L109.5 132.2L112.4 132.5L114.9 133.3L116.5 134.5L117.1 136L117.1 139.5L116.5 141L114.9 142.2L112.4 143L109.5 143.3L106.6 143L104.2 142.2L102.5 141L101.9 139.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M114.9 142.2L112.4 143L112.4 139.5L114.9 138.7ZM117.1 139.5L116.5 141L116.5 137.4L117.1 136ZM116.5 141L114.9 142.2L114.9 138.7L116.5 137.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M112.4 143L109.5 143.3L109.5 139.8L112.4 139.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M109.5 143.3L106.6 143L106.6 139.5L109.5 139.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M106.6 143L104.2 142.2L104.2 138.7L106.6 139.5ZM104.2 142.2L102.5 141L102.5 137.4L104.2 138.7ZM102.5 141L101.9 139.5L101.9 136L102.5 137.4Z\"/><path class=\"iso-top\" d=\"M114.9 138.7L112.4 139.5L109.5 139.8L106.6 139.5L104.2 138.7L102.5 137.4L101.9 136L102.5 134.5L104.2 133.3L106.6 132.5L109.5 132.2L112.4 132.5L114.9 133.3L116.5 134.5L117.1 136L116.5 137.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M117.1 136L116.5 137.4L114.9 138.7L112.4 139.5L109.5 139.8L106.6 139.5L104.2 138.7L102.5 137.4L101.9 136\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M101.9 136L102.5 134.5L104.2 133.3L106.6 132.5L109.5 132.2L112.4 132.5L114.9 133.3L116.5 134.5L117.1 136M117.1 139.5L116.5 141L114.9 142.2L112.4 143L109.5 143.3L106.6 143L104.2 142.2L102.5 141L101.9 139.5M101.9 136L101.9 139.5M117.1 136L117.1 139.5\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"109.5\" cy=\"136\" r=\"0.5\"/></g><path class=\"iso-line\" data-tone=\"mid\" d=\"M183.8 168.4L175.6 172.5\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M150.3 111.9L151 110.3L152.9 108.8L231.3 69.6L234.1 68.7L237.5 68.4L240.8 68.7L243.7 69.6L305.6 100.6L307.5 102L308.1 103.7L308.1 141.6L307.5 143.3L305.6 144.7L227.1 183.9L224.3 184.8L221 185.2L217.6 184.8L214.8 183.9L152.9 152.9L151 151.5L150.3 149.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M308.1 141.6L307.5 143.3L307.5 105.4L308.1 103.7ZM307.5 143.3L305.6 144.7L305.6 106.8L307.5 105.4ZM305.6 144.7L227.1 183.9L227.1 146L305.6 106.8ZM227.1 183.9L224.3 184.8L224.3 146.9L227.1 146Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M224.3 184.8L221 185.2L221 147.3L224.3 146.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M221 185.2L217.6 184.8L217.6 146.9L221 147.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M217.6 184.8L214.8 183.9L214.8 146L217.6 146.9ZM214.8 183.9L152.9 152.9L152.9 115L214.8 146ZM152.9 152.9L151 151.5L151 113.6L152.9 115ZM151 151.5L150.3 149.8L150.3 111.9L151 113.6Z\"/><path class=\"iso-top\" d=\"M305.6 100.6L307.5 102L308.1 103.7L307.5 105.4L305.6 106.8L227.1 146L224.3 146.9L221 147.3L217.6 146.9L214.8 146L152.9 115L151 113.6L150.3 111.9L151 110.3L152.9 108.8L231.3 69.6L234.1 68.7L237.5 68.4L240.8 68.7L243.7 69.6Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M308.1 103.7L307.5 105.4L305.6 106.8L227.1 146L224.3 146.9L221 147.3L217.6 146.9L214.8 146L152.9 115L151 113.6L150.3 111.9\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M308.1 103.7L306.1 105.1L304.4 106.3L226.2 145.4L223.7 146.3L221 146.5L218.2 146.3L215.7 145.4L154 114.6L152.3 113.3L150.3 111.9\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M308.1 112.5L307.5 114.2L305.6 115.6L227.1 154.8L224.3 155.8L221 156.1L217.6 155.8L214.8 154.8L152.9 123.9L151 122.5L150.3 120.8\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M150.3 111.9L151 110.3L152.9 108.8L231.3 69.6L234.1 68.7L237.5 68.4L240.8 68.7L243.7 69.6L305.6 100.6L307.5 102L308.1 103.7M308.1 141.6L307.5 143.3L305.6 144.7L227.1 183.9L224.3 184.8L221 185.2L217.6 184.8L214.8 183.9L152.9 152.9L151 151.5L150.3 149.8M308.1 103.7L308.1 141.6M150.3 111.9L150.3 149.8\"/></g><path data-part=\"lid-0\" class=\"iso-line\" data-tone=\"mid\" d=\"M256 121.2L249.9 123.7L242.8 125.5L235.1 126.5L227.2 126.8L219.4 126.1L212 124.7L205.3 122.5L199.7 119.7L195.4 116.4L192.6 112.7L191.3 108.8L191.7 104.8L193.8 101L197.4 97.5L202.4 94.4L208.5 91.9L215.6 90.1L223.3 89.1L231.2 88.9L239 89.5L246.4 90.9L253.1 93.1L258.7 95.9L263 99.2L265.9 102.9L267.1 106.8L266.7 110.8L264.6 114.6L261 118.1ZM247.8 117.1L243.5 118.8L238.6 120.1L233.3 120.8L227.8 120.9L222.4 120.5L217.3 119.5L212.7 118L208.8 116.1L205.8 113.8L203.8 111.2L203 108.5L203.3 105.8L204.7 103.1L207.2 100.7L210.6 98.5L214.9 96.8L219.8 95.5L225.1 94.8L230.6 94.7L236 95.1L241.1 96.1L245.7 97.6L249.6 99.5L252.6 101.8L254.6 104.4L255.4 107.1L255.1 109.9L253.7 112.5L251.2 115ZM239.5 113L237.2 113.9L234.4 114.6L231.5 115L228.4 115.1L225.4 114.9L222.6 114.3L220 113.5L217.9 112.4L216.2 111.1L215.1 109.7L214.6 108.2L214.8 106.7L215.6 105.2L217 103.8L218.9 102.6L221.3 101.7L224 101L226.9 100.6L230 100.5L233 100.8L235.8 101.3L238.4 102.1L240.5 103.2L242.2 104.5L243.3 105.9L243.8 107.4L243.6 108.9L242.8 110.4L241.4 111.8Z\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M274.6 213.8L266.4 217.9\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M241.1 157.3L241.8 155.7L243.7 154.2L322.1 115L324.9 114.1L328.3 113.7L331.6 114.1L334.4 115L396.3 146L398.2 147.4L398.9 149.1L398.9 187L398.2 188.7L396.3 190.1L317.9 229.3L315.1 230.2L311.7 230.6L308.4 230.2L305.6 229.3L243.7 198.3L241.8 196.9L241.1 195.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M398.9 187L398.2 188.7L398.2 150.8L398.9 149.1ZM398.2 188.7L396.3 190.1L396.3 152.2L398.2 150.8ZM396.3 190.1L317.9 229.3L317.9 191.4L396.3 152.2ZM317.9 229.3L315.1 230.2L315.1 192.3L317.9 191.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M315.1 230.2L311.7 230.6L311.7 192.7L315.1 192.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M311.7 230.6L308.4 230.2L308.4 192.3L311.7 192.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M308.4 230.2L305.6 229.3L305.6 191.4L308.4 192.3ZM305.6 229.3L243.7 198.3L243.7 160.4L305.6 191.4ZM243.7 198.3L241.8 196.9L241.8 159L243.7 160.4ZM241.8 196.9L241.1 195.2L241.1 157.3L241.8 159Z\"/><path class=\"iso-top\" d=\"M396.3 146L398.2 147.4L398.9 149.1L398.2 150.8L396.3 152.2L317.9 191.4L315.1 192.3L311.7 192.7L308.4 192.3L305.6 191.4L243.7 160.4L241.8 159L241.1 157.3L241.8 155.7L243.7 154.2L322.1 115L324.9 114.1L328.3 113.7L331.6 114.1L334.4 115Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M398.9 149.1L398.2 150.8L396.3 152.2L317.9 191.4L315.1 192.3L311.7 192.7L308.4 192.3L305.6 191.4L243.7 160.4L241.8 159L241.1 157.3\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M398.9 149.1L396.9 150.5L395.2 151.7L317 190.8L314.5 191.7L311.7 191.9L309 191.7L306.5 190.8L244.8 160L243.1 158.7L241.1 157.3\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M398.9 157.9L398.2 159.6L396.3 161L317.9 200.2L315.1 201.2L311.7 201.5L308.4 201.2L305.6 200.2L243.7 169.3L241.8 167.9L241.1 166.2\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M241.1 157.3L241.8 155.7L243.7 154.2L322.1 115L324.9 114.1L328.3 113.7L331.6 114.1L334.4 115L396.3 146L398.2 147.4L398.9 149.1M398.9 187L398.2 188.7L396.3 190.1L317.9 229.3L315.1 230.2L311.7 230.6L308.4 230.2L305.6 229.3L243.7 198.3L241.8 196.9L241.1 195.2M398.9 149.1L398.9 187M241.1 157.3L241.1 195.2\"/></g><path data-part=\"lid-1\" class=\"iso-line\" data-tone=\"mid\" d=\"M328.3 126.4L329.4 127.4L329.4 128.5L328.3 129.5L272.5 157.3L270.6 157.9L268.3 157.9L266.4 157.3L266.4 157.3L265.2 156.3L265.2 155.2L266.4 154.2L322.1 126.4L324 125.8L326.3 125.8L328.3 126.4ZM334.4 137.7L335.6 138.7L335.6 139.8L334.4 140.8L295.2 160.4L293.3 161L291 161L289 160.4L289 160.4L287.9 159.4L287.9 158.3L289 157.3L328.3 137.7L330.2 137.2L332.5 137.2L334.4 137.7ZM340.6 149.1L341.8 150.1L341.8 151.2L340.6 152.2L317.9 163.5L316 164.1L313.7 164.1L311.7 163.5L311.7 163.5L310.6 162.5L310.6 161.4L311.7 160.4L334.4 149.1L336.4 148.5L338.7 148.5L340.6 149.1ZM347.9 159.9L349 160.9L349 162L347.9 163L339.6 167.1L337.6 167.7L335.4 167.7L333.4 167.1L333.4 167.1L332.3 166.2L332.3 165L333.4 164L341.7 159.9L343.6 159.3L345.9 159.3L347.9 159.9Z\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M365.4 259.2L357.1 263.3\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M331.9 202.7L332.5 201.1L334.4 199.6L412.9 160.4L415.7 159.5L419 159.1L422.4 159.5L425.2 160.4L487.1 191.4L489 192.8L489.7 194.5L489.7 232.4L489 234.1L487.1 235.5L408.7 274.7L405.9 275.6L402.5 276L399.2 275.6L396.3 274.7L334.4 243.7L332.5 242.3L331.9 240.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M489.7 232.4L489 234.1L489 196.1L489.7 194.5ZM489 234.1L487.1 235.5L487.1 197.6L489 196.1ZM487.1 235.5L408.7 274.7L408.7 236.8L487.1 197.6ZM408.7 274.7L405.9 275.6L405.9 237.7L408.7 236.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M405.9 275.6L402.5 276L402.5 238.1L405.9 237.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M402.5 276L399.2 275.6L399.2 237.7L402.5 238.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M399.2 275.6L396.3 274.7L396.3 236.8L399.2 237.7ZM396.3 274.7L334.4 243.7L334.4 205.8L396.3 236.8ZM334.4 243.7L332.5 242.3L332.5 204.4L334.4 205.8ZM332.5 242.3L331.9 240.6L331.9 202.7L332.5 204.4Z\"/><path class=\"iso-top\" d=\"M487.1 191.4L489 192.8L489.7 194.5L489 196.1L487.1 197.6L408.7 236.8L405.9 237.7L402.5 238.1L399.2 237.7L396.3 236.8L334.4 205.8L332.5 204.4L331.9 202.7L332.5 201.1L334.4 199.6L412.9 160.4L415.7 159.5L419 159.1L422.4 159.5L425.2 160.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M489.7 194.5L489 196.1L487.1 197.6L408.7 236.8L405.9 237.7L402.5 238.1L399.2 237.7L396.3 236.8L334.4 205.8L332.5 204.4L331.9 202.7\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M489.7 194.5L487.7 195.9L486 197.1L407.8 236.2L405.3 237L402.5 237.3L399.7 237L397.3 236.2L335.6 205.4L333.9 204.1L331.9 202.7\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M489.7 203.3L489 205L487.1 206.4L408.7 245.6L405.9 246.6L402.5 246.9L399.2 246.6L396.3 245.6L334.4 214.7L332.5 213.2L331.9 211.6\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M331.9 202.7L332.5 201.1L334.4 199.6L412.9 160.4L415.7 159.5L419 159.1L422.4 159.5L425.2 160.4L487.1 191.4L489 192.8L489.7 194.5M489.7 232.4L489 234.1L487.1 235.5L408.7 274.7L405.9 275.6L402.5 276L399.2 275.6L396.3 274.7L334.4 243.7L332.5 242.3L331.9 240.6M489.7 194.5L489.7 232.4M331.9 202.7L331.9 240.6\"/></g><path data-part=\"lid-2\" class=\"iso-line\" data-tone=\"mid\" d=\"M419 173.8L420 174.6L420 175.5L419 176.3L366.2 202.7L364.7 203.2L362.8 203.2L361.3 202.7L361.3 202.7L360.4 201.9L360.4 201L361.3 200.3L414.1 173.8L415.7 173.4L417.5 173.4L419 173.8ZM429.4 179L430.3 179.8L430.3 180.7L429.4 181.5L376.5 207.9L375 208.3L373.2 208.3L371.6 207.9L371.6 207.9L370.7 207.1L370.7 206.2L371.6 205.4L424.4 179L426 178.5L427.8 178.5L429.4 179ZM439.7 184.2L440.6 184.9L440.6 185.8L439.7 186.6L386.9 213L385.3 213.5L383.5 213.5L381.9 213L381.9 213L381 212.3L381 211.4L381.9 210.6L434.7 184.2L436.3 183.7L438.1 183.7L439.7 184.2ZM450 189.3L450.9 190.1L450.9 191L450 191.8L397.2 218.2L395.6 218.7L393.8 218.7L392.2 218.2L392.2 218.2L391.3 217.4L391.3 216.5L392.2 215.7L445 189.3L446.6 188.9L448.4 188.9L450 189.3ZM460.3 194.5L461.2 195.3L461.2 196.2L460.3 196.9L407.5 223.4L405.9 223.8L404.1 223.8L402.5 223.4L402.5 223.4L401.6 222.6L401.6 221.7L402.5 220.9L455.4 194.5L456.9 194L458.7 194L460.3 194.5Z\"/><circle data-part=\"mark-1\" class=\"iso-line\" data-tone=\"lit\" r=\"4.6\" style=\"display:none\"/><circle data-part=\"mark-2\" class=\"iso-line\" data-tone=\"lit\" r=\"6.800000000000001\" style=\"display:none\"/><circle data-part=\"mark-3\" class=\"iso-line\" data-tone=\"lit\" r=\"9\" style=\"display:none\"/><circle data-part=\"pulse\" class=\"iso-wire-end\" r=\"2.4\" style=\"stroke:var(--anatomy-lit);fill:var(--anatomy-lit)\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M415.6 292.8L416.2 291.4L417.8 290.1L420.3 289.3L423.2 289L426.1 289.3L428.5 290.1L430.2 291.4L430.8 292.8L430.8 296.3L430.2 297.8L428.5 299L426.1 299.9L423.2 300.1L420.3 299.9L417.8 299L416.2 297.8L415.6 296.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M428.5 299L426.1 299.9L426.1 296.3L428.5 295.5ZM430.8 296.3L430.2 297.8L430.2 294.3L430.8 292.8ZM430.2 297.8L428.5 299L428.5 295.5L430.2 294.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M426.1 299.9L423.2 300.1L423.2 296.6L426.1 296.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M423.2 300.1L420.3 299.9L420.3 296.3L423.2 296.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M420.3 299.9L417.8 299L417.8 295.5L420.3 296.3ZM417.8 299L416.2 297.8L416.2 294.3L417.8 295.5ZM416.2 297.8L415.6 296.3L415.6 292.8L416.2 294.3Z\"/><path class=\"iso-top\" d=\"M428.5 295.5L426.1 296.3L423.2 296.6L420.3 296.3L417.8 295.5L416.2 294.3L415.6 292.8L416.2 291.4L417.8 290.1L420.3 289.3L423.2 289L426.1 289.3L428.5 290.1L430.2 291.4L430.8 292.8L430.2 294.3Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M430.8 292.8L430.2 294.3L428.5 295.5L426.1 296.3L423.2 296.6L420.3 296.3L417.8 295.5L416.2 294.3L415.6 292.8\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M415.6 292.8L416.2 291.4L417.8 290.1L420.3 289.3L423.2 289L426.1 289.3L428.5 290.1L430.2 291.4L430.8 292.8M430.8 296.3L430.2 297.8L428.5 299L426.1 299.9L423.2 300.1L420.3 299.9L417.8 299L416.2 297.8L415.6 296.3M415.6 292.8L415.6 296.3M430.8 292.8L430.8 296.3\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"423.2\" cy=\"292.8\" r=\"0.5\"/></g></svg></div>";
const P = {"origin":[320,201.22056821459537],"scale":2.3069999880832937,"azimuth":45,"elevation":30}, LINE_Y = 26, RAIL_TOP = 4, PORTS = [-76,76];
const lineX = (place) => PORTS[0] + place * (PORTS[1] - PORTS[0]);
const pd = (points) => points.map(([x, y], i) => (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1)).join("");
const moveTo = (node, [x, y]) => { node.setAttribute("cx", x.toFixed(1)); node.setAttribute("cy", y.toFixed(1)); };
const FX = [[-62,-26],[-18,18],[26,62]], REST = 0, LAP = 8, ALIVE = false, STOPS = Array.from({ length: 21 }, (_, i) => i / 20), SPAN = [0.2549660821213412,0.7450339178786589];
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
}

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
