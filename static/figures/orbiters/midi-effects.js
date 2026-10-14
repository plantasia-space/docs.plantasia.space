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

export const svg = "<div class=\"iso-stage\" tabindex=\"0\" role=\"slider\" aria-label=\"MIDI effects: left and right arrows move the note along the rack, Home and End take it to either end\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"0\"><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"iso-svg\" viewBox=\"0 0 640 360\" role=\"img\" aria-label=\"A length of the Orbiter's rack with a pin drum, a box with a grid of notes, and a box with a keyboard. A note leaves the drum, moves to another row on the grid, and a key plays it.\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M196.9 103.7L198 101.8L200.3 100.1L203.6 98.9L207.6 98.4L211.6 98.6L215.3 99.5L218.1 100.9L219.8 102.7L220.2 104.7L220.2 119.9L219.2 121.9L216.8 123.5L213.5 124.7L209.6 125.2L205.6 125L201.9 124.2L199 122.7L197.3 120.9L196.9 118.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M216.8 123.5L213.5 124.7L213.5 109.5L216.8 108.4ZM220.2 119.9L219.2 121.9L219.2 106.7L220.2 104.7ZM219.2 121.9L216.8 123.5L216.8 108.4L219.2 106.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M213.5 124.7L209.6 125.2L209.6 110.1L213.5 109.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M209.6 125.2L205.6 125L205.6 109.9L209.6 110.1ZM205.6 125L201.9 124.2L201.9 109L205.6 109.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M201.9 124.2L199 122.7L199 107.6L201.9 109ZM199 122.7L197.3 120.9L197.3 105.7L199 107.6ZM197.3 120.9L196.9 118.9L196.9 103.7L197.3 105.7Z\"/><path class=\"iso-top\" d=\"M216.8 108.4L213.5 109.5L209.6 110.1L205.6 109.9L201.9 109L199 107.6L197.3 105.7L196.9 103.7L198 101.8L200.3 100.1L203.6 98.9L207.6 98.4L211.6 98.6L215.3 99.5L218.1 100.9L219.8 102.7L220.2 104.7L219.2 106.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M220.2 104.7L219.2 106.7L216.8 108.4L213.5 109.5L209.6 110.1L205.6 109.9L201.9 109L199 107.6L197.3 105.7L196.9 103.7\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M196.9 103.7L198 101.8L200.3 100.1L203.6 98.9L207.6 98.4L211.6 98.6L215.3 99.5L218.1 100.9L219.8 102.7L220.2 104.7M220.2 119.9L219.2 121.9L216.8 123.5L213.5 124.7L209.6 125.2L205.6 125L201.9 124.2L199 122.7L197.3 120.9L196.9 118.9M196.9 103.7L196.9 118.9M220.2 104.7L220.2 119.9\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M114.4 145L115.5 143L117.8 141.4L121.1 140.2L125 139.7L129.1 139.9L132.7 140.7L135.6 142.2L137.3 144L137.7 146L137.7 161.2L136.6 163.1L134.3 164.8L131 166L127.1 166.5L123 166.3L119.3 165.5L116.5 164L114.8 162.2L114.4 160.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M134.3 164.8L131 166L131 150.8L134.3 149.6ZM137.7 161.2L136.6 163.1L136.6 148L137.7 146ZM136.6 163.1L134.3 164.8L134.3 149.6L136.6 148Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M131 166L127.1 166.5L127.1 151.3L131 150.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M127.1 166.5L123 166.3L123 151.1L127.1 151.3ZM123 166.3L119.3 165.5L119.3 150.3L123 151.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M119.3 165.5L116.5 164L116.5 148.9L119.3 150.3ZM116.5 164L114.8 162.2L114.8 147L116.5 148.9ZM114.8 162.2L114.4 160.2L114.4 145L114.8 147Z\"/><path class=\"iso-top\" d=\"M134.3 149.6L131 150.8L127.1 151.3L123 151.1L119.3 150.3L116.5 148.9L114.8 147L114.4 145L115.5 143L117.8 141.4L121.1 140.2L125 139.7L129.1 139.9L132.7 140.7L135.6 142.2L137.3 144L137.7 146L136.6 148Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M137.7 146L136.6 148L134.3 149.6L131 150.8L127.1 151.3L123 151.1L119.3 150.3L116.5 148.9L114.8 147L114.4 145\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M114.4 145L115.5 143L117.8 141.4L121.1 140.2L125 139.7L129.1 139.9L132.7 140.7L135.6 142.2L137.3 144L137.7 146M137.7 161.2L136.6 163.1L134.3 164.8L131 166L127.1 166.5L123 166.3L119.3 165.5L116.5 164L114.8 162.2L114.4 160.2M114.4 145L114.4 160.2M137.7 146L137.7 161.2\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M502.3 256.4L503.4 254.5L505.7 252.8L509 251.6L512.9 251.1L517 251.3L520.7 252.2L523.5 253.6L525.2 255.4L525.6 257.4L525.6 272.6L524.5 274.6L522.2 276.2L518.9 277.4L515 277.9L510.9 277.7L507.3 276.9L504.4 275.4L502.7 273.6L502.3 271.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M522.2 276.2L518.9 277.4L518.9 262.2L522.2 261.1ZM525.6 272.6L524.5 274.6L524.5 259.4L525.6 257.4ZM524.5 274.6L522.2 276.2L522.2 261.1L524.5 259.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M518.9 277.4L515 277.9L515 262.7L518.9 262.2Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M515 277.9L510.9 277.7L510.9 262.6L515 262.7ZM510.9 277.7L507.3 276.9L507.3 261.7L510.9 262.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M507.3 276.9L504.4 275.4L504.4 260.3L507.3 261.7ZM504.4 275.4L502.7 273.6L502.7 258.4L504.4 260.3ZM502.7 273.6L502.3 271.6L502.3 256.4L502.7 258.4Z\"/><path class=\"iso-top\" d=\"M522.2 261.1L518.9 262.2L515 262.7L510.9 262.6L507.3 261.7L504.4 260.3L502.7 258.4L502.3 256.4L503.4 254.5L505.7 252.8L509 251.6L512.9 251.1L517 251.3L520.7 252.2L523.5 253.6L525.2 255.4L525.6 257.4L524.5 259.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M525.6 257.4L524.5 259.4L522.2 261.1L518.9 262.2L515 262.7L510.9 262.6L507.3 261.7L504.4 260.3L502.7 258.4L502.3 256.4\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M502.3 256.4L503.4 254.5L505.7 252.8L509 251.6L512.9 251.1L517 251.3L520.7 252.2L523.5 253.6L525.2 255.4L525.6 257.4M525.6 272.6L524.5 274.6L522.2 276.2L518.9 277.4L515 277.9L510.9 277.7L507.3 276.9L504.4 275.4L502.7 273.6L502.3 271.6M502.3 256.4L502.3 271.6M525.6 257.4L525.6 272.6\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M419.8 297.7L420.8 295.7L423.2 294.1L426.5 292.9L430.4 292.4L434.4 292.6L438.1 293.4L441 294.9L442.7 296.7L443.1 298.7L443.1 313.9L442 315.8L439.7 317.5L436.4 318.7L432.4 319.2L428.4 319L424.7 318.1L421.9 316.7L420.2 314.9L419.8 312.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M439.7 317.5L436.4 318.7L436.4 303.5L439.7 302.3ZM443.1 313.9L442 315.8L442 300.7L443.1 298.7ZM442 315.8L439.7 317.5L439.7 302.3L442 300.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M436.4 318.7L432.4 319.2L432.4 304L436.4 303.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M432.4 319.2L428.4 319L428.4 303.8L432.4 304ZM428.4 319L424.7 318.1L424.7 303L428.4 303.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M424.7 318.1L421.9 316.7L421.9 301.5L424.7 303ZM421.9 316.7L420.2 314.9L420.2 299.7L421.9 301.5ZM420.2 314.9L419.8 312.9L419.8 297.7L420.2 299.7Z\"/><path class=\"iso-top\" d=\"M439.7 302.3L436.4 303.5L432.4 304L428.4 303.8L424.7 303L421.9 301.5L420.2 299.7L419.8 297.7L420.8 295.7L423.2 294.1L426.5 292.9L430.4 292.4L434.4 292.6L438.1 293.4L441 294.9L442.7 296.7L443.1 298.7L442 300.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M443.1 298.7L442 300.7L439.7 302.3L436.4 303.5L432.4 304L428.4 303.8L424.7 303L421.9 301.5L420.2 299.7L419.8 297.7\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M419.8 297.7L420.8 295.7L423.2 294.1L426.5 292.9L430.4 292.4L434.4 292.6L438.1 293.4L441 294.9L442.7 296.7L443.1 298.7M443.1 313.9L442 315.8L439.7 317.5L436.4 318.7L432.4 319.2L428.4 319L424.7 318.1L421.9 316.7L420.2 314.9L419.8 312.9M419.8 297.7L419.8 312.9M443.1 298.7L443.1 313.9\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M88.4 135.4L89.1 133.7L91 132.3L202.4 76.6L205.2 75.6L208.6 75.3L211.9 75.6L214.8 76.6L549 243.7L550.9 245.1L551.6 246.8L551.6 256.9L550.9 258.6L549 260L437.6 315.7L434.8 316.7L431.4 317L428.1 316.7L425.2 315.7L91 148.6L89.1 147.2L88.4 145.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M551.6 256.9L550.9 258.6L550.9 248.5L551.6 246.8ZM550.9 258.6L549 260L549 249.9L550.9 248.5ZM549 260L437.6 315.7L437.6 305.6L549 249.9ZM437.6 315.7L434.8 316.7L434.8 306.6L437.6 305.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M434.8 316.7L431.4 317L431.4 306.9L434.8 306.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M431.4 317L428.1 316.7L428.1 306.6L431.4 306.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M428.1 316.7L425.2 315.7L425.2 305.6L428.1 306.6ZM425.2 315.7L91 148.6L91 138.5L425.2 305.6ZM91 148.6L89.1 147.2L89.1 137.1L91 138.5ZM89.1 147.2L88.4 145.5L88.4 135.4L89.1 137.1Z\"/><path class=\"iso-top\" d=\"M549 243.7L550.9 245.1L551.6 246.8L550.9 248.5L549 249.9L437.6 305.6L434.8 306.6L431.4 306.9L428.1 306.6L425.2 305.6L91 138.5L89.1 137.1L88.4 135.4L89.1 133.7L91 132.3L202.4 76.6L205.2 75.6L208.6 75.3L211.9 75.6L214.8 76.6Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M551.6 246.8L550.9 248.5L549 249.9L437.6 305.6L434.8 306.6L431.4 306.9L428.1 306.6L425.2 305.6L91 138.5L89.1 137.1L88.4 135.4\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M551.6 246.8L549.3 248.2L547.7 249.4L436.5 305L434.1 305.8L431.4 306L428.7 305.8L426.3 305L92.3 137.9L90.7 136.7L88.4 135.4\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M551.6 251.9L550.9 253.6L549 255L437.6 310.7L434.8 311.6L431.4 312L428.1 311.6L425.2 310.7L91 143.5L89.1 142.1L88.4 140.5\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M88.4 135.4L89.1 133.7L91 132.3L202.4 76.6L205.2 75.6L208.6 75.3L211.9 75.6L214.8 76.6L549 243.7L550.9 245.1L551.6 246.8M551.6 256.9L550.9 258.6L549 260L437.6 315.7L434.8 316.7L431.4 317L428.1 316.7L425.2 315.7L91 148.6L89.1 147.2L88.4 145.5M551.6 246.8L551.6 256.9M88.4 135.4L88.4 145.5\"/></g><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"208.6\" cy=\"81.7\" r=\"0.42\"/><circle cx=\"538.7\" cy=\"246.8\" r=\"0.42\"/><circle cx=\"101.3\" cy=\"135.4\" r=\"0.42\"/><circle cx=\"431.4\" cy=\"300.5\" r=\"0.42\"/></g><path class=\"iso-line\" data-tone=\"mid\" d=\"M150.8 160.2L423.2 296.3\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M226.3 58.5L227.1 57.5L229.2 56.4L231.3 56L233.3 56.4L262.2 70.9L263.1 71.9L263.1 119.9L262.2 121L260.2 122L258.1 122.4L256 122L227.1 107.5L226.3 106.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M263.1 119.9L262.2 121L262.2 72.9L263.1 71.9ZM262.2 121L260.2 122L260.2 74L262.2 72.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M260.2 122L258.1 122.4L258.1 74.4L260.2 74Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M258.1 122.4L256 122L256 74L258.1 74.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M256 122L227.1 107.5L227.1 59.5L256 74ZM227.1 107.5L226.3 106.5L226.3 58.5L227.1 59.5Z\"/><path class=\"iso-top\" d=\"M262.2 70.9L263.1 71.9L262.2 72.9L260.2 74L258.1 74.4L256 74L227.1 59.5L226.3 58.5L227.1 57.5L229.2 56.4L231.3 56L233.3 56.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M263.1 71.9L262.2 72.9L260.2 74L258.1 74.4L256 74L227.1 59.5L226.3 58.5\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M263.1 71.9L261.5 72.7L259.7 73.6L258.1 74L256.5 73.6L227.9 59.3L226.3 58.5\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M226.3 58.5L227.1 57.5L229.2 56.4L231.3 56L233.3 56.4L262.2 70.9L263.1 71.9M263.1 119.9L262.2 121L260.2 122L258.1 122.4L256 122L227.1 107.5L226.3 106.5M263.1 71.9L263.1 119.9M226.3 58.5L226.3 106.5\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M146.7 103L146.7 101.8L146.8 100.5L147 99.4L147.2 98.2L147.5 97.1L147.8 96L148.2 95L148.6 94L149.1 93.1L149.6 92.2L150.1 91.4L150.7 90.7L151.4 90L152.1 89.3L152.8 88.8L153.6 88.3L154.4 87.8L228.7 50.7L229.5 50.3L230.4 50L231.3 49.8L232.2 49.7L233.1 49.6L234.1 49.6L235.1 49.6L236.1 49.8L237.1 50L238.2 50.2L239.2 50.6L240.3 51L241.3 51.5L242.4 52L243.4 52.6L244.5 53.3L245.5 54L246.5 54.8L247.6 55.7L248.6 56.6L249.5 57.5L250.5 58.5L251.4 59.6L252.4 60.7L253.2 61.8L254.1 63L254.9 64.2L255.7 65.5L256.5 66.8L257.2 68.1L257.8 69.4L258.5 70.8L259.1 72.1L259.6 73.5L260.1 74.9L260.5 76.3L260.9 77.7L261.3 79.1L261.6 80.5L261.8 81.8L262 83.2L262.1 84.5L262.2 85.9L262.2 87.2L262.2 88.5L262.1 89.7L262 90.9L261.8 92.1L261.6 93.2L261.3 94.3L260.9 95.4L260.5 96.4L260.1 97.3L259.6 98.2L259.1 99.1L258.5 99.8L257.8 100.6L257.2 101.2L256.5 101.8L255.7 102.3L254.9 102.8L180.6 140L179.8 140.4L179 140.7L178.1 140.9L177.2 141.1L176.2 141.2L175.3 141.3L174.3 141.3L173.3 141.2L172.3 141L171.2 140.8L170.2 140.5L169.1 140.1L168.1 139.6L167 139.1L166 138.6L164.9 137.9L163.9 137.2L162.9 136.5L161.8 135.6L160.8 134.8L159.8 133.8L158.9 132.8L157.9 131.8L157 130.7L156.1 129.6L155.2 128.4L154.4 127.2L153.6 126L152.8 124.7L152.1 123.4L151.4 122.1L150.7 120.8L150.1 119.4L149.6 118L149.1 116.7L148.6 115.3L148.2 113.9L147.8 112.5L147.5 111.1L147.2 109.7L147 108.3L146.8 107L146.7 105.6L146.7 104.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M179.9 140.3L181.5 139.4L183 138.3L184.2 136.9L185.3 135.3L186.3 133.4L187 131.4L187.5 129.2L187.8 126.8L187.9 124.3L187.8 121.7L187.5 119L187 116.3L186.3 113.5L185.3 110.8L259.6 73.6L260.6 76.4L261.3 79.1L261.8 81.9L262.1 84.6L262.2 87.2L262.1 89.7L261.8 92L261.3 94.3L260.6 96.3L259.6 98.1L258.5 99.8L257.2 101.1L255.8 102.3L254.2 103.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M185.3 110.8L184.2 108L183 105.4L257.2 68.2L258.5 70.9L259.6 73.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M183 105.4L181.5 102.8L179.9 100.3L178.2 98L252.5 60.9L254.2 63.2L255.8 65.6L257.2 68.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M178.2 98L176.4 95.9L174.5 93.9L172.5 92.1L246.8 55L248.8 56.7L250.7 58.7L252.5 60.9ZM167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L167.3 114L187.9 124.3L187.8 126.8L187.5 129.2L187 131.4L186.3 133.4L185.3 135.3L184.2 136.9L183 138.3L181.5 139.4L179.9 140.3L178.2 140.9L176.4 141.2L174.5 141.3L172.5 141L170.4 140.5L168.4 139.8L166.3 138.7L164.2 137.4L162.1 135.9L160.1 134.1L158.2 132.1L156.4 130L154.7 127.7L153.1 125.2L151.6 122.6L150.4 120L149.3 117.2L148.3 114.5L147.6 111.7L147.1 109L146.8 106.3L146.7 103.7L146.8 101.2L147.1 98.8L147.6 96.6L148.3 94.6L149.3 92.7L150.4 91.1L151.6 89.7L153.1 88.6L154.7 87.7L156.4 87.1L158.2 86.8L160.1 86.7L162.1 86.9L164.2 87.5L166.3 88.2L168.4 89.3L170.4 90.6L172.5 92.1L174.5 93.9L176.4 95.9L178.2 98L179.9 100.3L181.5 102.8L183 105.4L184.2 108L185.3 110.8L186.3 113.5L187 116.3L187.5 119L187.8 121.7L187.9 124.3Z\"/><path class=\"iso-top\" d=\"M172.5 92.1L170.4 90.6L168.4 89.3L166.3 88.2L164.2 87.5L162.1 86.9L160.1 86.7L158.2 86.8L156.4 87.1L154.7 87.7L229 50.6L230.7 50L232.5 49.6L234.4 49.6L236.4 49.8L238.5 50.3L240.5 51.1L242.6 52.1L244.7 53.4L246.8 55Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M180.4 140.1L181.1 139.7L181.9 139.2L182.6 138.6L183.3 138L183.9 137.3L184.5 136.5L185.1 135.7L185.6 134.8L186.1 133.9L186.5 132.9L186.8 131.9L187.1 130.9L187.4 129.7L187.6 128.6L187.8 127.4L187.9 126.2L187.9 124.9L187.9 123.7L187.9 122.3L187.8 121L187.6 119.7L187.4 118.3L187.1 116.9L186.8 115.6L186.5 114.2L186 112.8L185.6 111.4L185.1 110.1L184.5 108.7L183.9 107.3L183.3 106L182.6 104.7L181.9 103.4L181.1 102.1L180.3 100.9L179.5 99.7L178.6 98.6L177.8 97.4L176.8 96.4L175.9 95.3L174.9 94.3L174 93.4L173 92.5L172 91.7L170.9 90.9L169.9 90.2L168.9 89.6L167.8 89L166.8 88.5L165.7 88L164.7 87.6L163.7 87.3L162.6 87L161.6 86.9L160.6 86.7L159.6 86.7L158.7 86.7L157.7 86.8L156.8 87L155.9 87.2L155.1 87.5L154.3 87.9\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M146.7 103L146.7 101.8L146.8 100.5L147 99.4L147.2 98.2L147.5 97.1L147.8 96L148.2 95L148.6 94L149.1 93.1L149.6 92.2L150.1 91.4L150.7 90.7L151.4 90L152.1 89.3L152.8 88.8L153.6 88.3L154.4 87.8L228.7 50.7L229.5 50.3L230.4 50L231.3 49.8L232.2 49.7L233.1 49.6L234.1 49.6L235.1 49.6L236.1 49.8L237.1 50L238.2 50.2L239.2 50.6L240.3 51L241.3 51.5L242.4 52L243.4 52.6L244.5 53.3L245.5 54L246.5 54.8L247.6 55.7L248.6 56.6L249.5 57.5L250.5 58.5L251.4 59.6L252.4 60.7L253.2 61.8L254.1 63L254.9 64.2L255.7 65.5L256.5 66.8L257.2 68.1L257.8 69.4L258.5 70.8L259.1 72.1L259.6 73.5L260.1 74.9L260.5 76.3L260.9 77.7L261.3 79.1L261.6 80.5L261.8 81.8L262 83.2L262.1 84.5L262.2 85.9L262.2 87.2L262.2 88.5L262.1 89.7L262 90.9L261.8 92.1L261.6 93.2L261.3 94.3L260.9 95.4L260.5 96.4L260.1 97.3L259.6 98.2L259.1 99.1L258.5 99.8L257.8 100.6L257.2 101.2L256.5 101.8L255.7 102.3L254.9 102.8L180.6 140L179.8 140.4L179 140.7L178.1 140.9L177.2 141.1L176.2 141.2L175.3 141.3L174.3 141.3L173.3 141.2L172.3 141L171.2 140.8L170.2 140.5L169.1 140.1L168.1 139.6L167 139.1L166 138.6L164.9 137.9L163.9 137.2L162.9 136.5L161.8 135.6L160.8 134.8L159.8 133.8L158.9 132.8L157.9 131.8L157 130.7L156.1 129.6L155.2 128.4L154.4 127.2L153.6 126L152.8 124.7L152.1 123.4L151.4 122.1L150.7 120.8L150.1 119.4L149.6 118L149.1 116.7L148.6 115.3L148.2 113.9L147.8 112.5L147.5 111.1L147.2 109.7L147 108.3L146.8 107L146.7 105.6L146.7 104.3Z\"/></g><g data-part=\"pins\" class=\"iso-dots\" data-tone=\"hi\"></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M145.8 98.7L146.7 97.7L148.7 96.7L150.8 96.2L152.9 96.7L181.7 111.1L182.6 112.1L182.6 160.2L181.7 161.2L179.7 162.2L177.6 162.7L175.6 162.2L146.7 147.8L145.8 146.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M182.6 160.2L181.7 161.2L181.7 113.2L182.6 112.1ZM181.7 161.2L179.7 162.2L179.7 114.2L181.7 113.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M179.7 162.2L177.6 162.7L177.6 114.6L179.7 114.2Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M177.6 162.7L175.6 162.2L175.6 114.2L177.6 114.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M175.6 162.2L146.7 147.8L146.7 99.8L175.6 114.2ZM146.7 147.8L145.8 146.7L145.8 98.7L146.7 99.8Z\"/><path class=\"iso-top\" d=\"M181.7 111.1L182.6 112.1L181.7 113.2L179.7 114.2L177.6 114.6L175.6 114.2L146.7 99.8L145.8 98.7L146.7 97.7L148.7 96.7L150.8 96.2L152.9 96.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M182.6 112.1L181.7 113.2L179.7 114.2L177.6 114.6L175.6 114.2L146.7 99.8L145.8 98.7\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M182.6 112.1L181 112.9L179.2 113.8L177.6 114.2L176 113.8L147.4 99.5L145.8 98.7\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M145.8 98.7L146.7 97.7L148.7 96.7L150.8 96.2L152.9 96.7L181.7 111.1L182.6 112.1M182.6 160.2L181.7 161.2L179.7 162.2L177.6 162.7L175.6 162.2L146.7 147.8L145.8 146.7M182.6 112.1L182.6 160.2M145.8 98.7L145.8 146.7\"/></g><path class=\"iso-line\" data-tone=\"mid\" d=\"M161.1 155L150.8 160.2\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M264.3 208.7L256 212.8\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M232.8 155.7L233.5 154.1L235.4 152.6L313.8 113.4L316.6 112.5L320 112.1L323.4 112.5L326.2 113.4L384 142.3L385.9 143.7L386.5 145.4L386.5 180.8L385.9 182.5L384 183.9L305.6 223.1L302.7 224L299.4 224.4L296 224L293.2 223.1L235.4 194.2L233.5 192.8L232.8 191.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M386.5 180.8L385.9 182.5L385.9 147.1L386.5 145.4ZM385.9 182.5L384 183.9L384 148.5L385.9 147.1ZM384 183.9L305.6 223.1L305.6 187.7L384 148.5ZM305.6 223.1L302.7 224L302.7 188.7L305.6 187.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M302.7 224L299.4 224.4L299.4 189L302.7 188.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M299.4 224.4L296 224L296 188.7L299.4 189Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M296 224L293.2 223.1L293.2 187.7L296 188.7ZM293.2 223.1L235.4 194.2L235.4 158.8L293.2 187.7ZM235.4 194.2L233.5 192.8L233.5 157.4L235.4 158.8ZM233.5 192.8L232.8 191.1L232.8 155.7L233.5 157.4Z\"/><path class=\"iso-top\" d=\"M384 142.3L385.9 143.7L386.5 145.4L385.9 147.1L384 148.5L305.6 187.7L302.7 188.7L299.4 189L296 188.7L293.2 187.7L235.4 158.8L233.5 157.4L232.8 155.7L233.5 154.1L235.4 152.6L313.8 113.4L316.6 112.5L320 112.1L323.4 112.5L326.2 113.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M386.5 145.4L385.9 147.1L384 148.5L305.6 187.7L302.7 188.7L299.4 189L296 188.7L293.2 187.7L235.4 158.8L233.5 157.4L232.8 155.7\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M386.5 145.4L384.5 146.8L382.8 148L304.6 187.2L302.2 188L299.4 188.3L296.6 188L294.1 187.2L236.5 158.4L234.8 157.1L232.8 155.7\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M386.5 154.3L385.9 155.9L384 157.4L305.6 196.6L302.7 197.5L299.4 197.8L296 197.5L293.2 196.6L235.4 167.7L233.5 166.3L232.8 164.6\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M232.8 155.7L233.5 154.1L235.4 152.6L313.8 113.4L316.6 112.5L320 112.1L323.4 112.5L326.2 113.4L384 142.3L385.9 143.7L386.5 145.4M386.5 180.8L385.9 182.5L384 183.9L305.6 223.1L302.7 224L299.4 224.4L296 224L293.2 223.1L235.4 194.2L233.5 192.8L232.8 191.1M386.5 145.4L386.5 180.8M232.8 155.7L232.8 191.1\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M369.5 145.4L299.4 180.5L249.8 155.7L320 120.7Z\"/><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"320\" cy=\"128.9\" r=\"0.45\"/><circle cx=\"328.7\" cy=\"133.2\" r=\"0.45\"/><circle cx=\"337.3\" cy=\"137.6\" r=\"0.45\"/><circle cx=\"346\" cy=\"141.9\" r=\"0.45\"/><circle cx=\"354.7\" cy=\"146.2\" r=\"0.45\"/><circle cx=\"311.3\" cy=\"133.2\" r=\"0.45\"/><circle cx=\"320\" cy=\"137.6\" r=\"0.45\"/><circle cx=\"328.7\" cy=\"141.9\" r=\"0.45\"/><circle cx=\"337.3\" cy=\"146.2\" r=\"0.45\"/><circle cx=\"346\" cy=\"150.6\" r=\"0.45\"/><circle cx=\"302.7\" cy=\"137.6\" r=\"0.45\"/><circle cx=\"311.3\" cy=\"141.9\" r=\"0.45\"/><circle cx=\"320\" cy=\"146.2\" r=\"0.45\"/><circle cx=\"328.7\" cy=\"150.6\" r=\"0.45\"/><circle cx=\"337.3\" cy=\"154.9\" r=\"0.45\"/><circle cx=\"294\" cy=\"141.9\" r=\"0.45\"/><circle cx=\"302.7\" cy=\"146.2\" r=\"0.45\"/><circle cx=\"311.3\" cy=\"150.6\" r=\"0.45\"/><circle cx=\"320\" cy=\"154.9\" r=\"0.45\"/><circle cx=\"328.7\" cy=\"159.2\" r=\"0.45\"/><circle cx=\"285.3\" cy=\"146.2\" r=\"0.45\"/><circle cx=\"294\" cy=\"150.6\" r=\"0.45\"/><circle cx=\"302.7\" cy=\"154.9\" r=\"0.45\"/><circle cx=\"311.3\" cy=\"159.2\" r=\"0.45\"/><circle cx=\"320\" cy=\"163.6\" r=\"0.45\"/><circle cx=\"276.7\" cy=\"150.6\" r=\"0.45\"/><circle cx=\"285.3\" cy=\"154.9\" r=\"0.45\"/><circle cx=\"294\" cy=\"159.2\" r=\"0.45\"/><circle cx=\"302.7\" cy=\"163.6\" r=\"0.45\"/><circle cx=\"311.3\" cy=\"167.9\" r=\"0.45\"/><circle cx=\"268\" cy=\"154.9\" r=\"0.45\"/><circle cx=\"276.7\" cy=\"159.2\" r=\"0.45\"/><circle cx=\"285.3\" cy=\"163.6\" r=\"0.45\"/><circle cx=\"294\" cy=\"167.9\" r=\"0.45\"/><circle cx=\"302.7\" cy=\"172.2\" r=\"0.45\"/></g><circle data-part=\"note\" class=\"iso-wire-end\" r=\"1.9\" style=\"stroke:var(--anatomy-lit);fill:var(--anatomy-lit);display:none\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M377.8 265.4L369.5 269.5\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M331.9 200.2L332.5 198.5L334.4 197.1L412.9 157.9L415.7 156.9L419 156.6L422.4 156.9L425.2 157.9L511.9 201.2L513.8 202.7L514.5 204.3L514.5 244.8L513.8 246.4L511.9 247.9L433.5 287.1L430.6 288L427.3 288.3L423.9 288L421.1 287.1L334.4 243.7L332.5 242.3L331.9 240.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M514.5 244.8L513.8 246.4L513.8 206L514.5 204.3ZM513.8 246.4L511.9 247.9L511.9 207.4L513.8 206ZM511.9 247.9L433.5 287.1L433.5 246.6L511.9 207.4ZM433.5 287.1L430.6 288L430.6 247.6L433.5 246.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M430.6 288L427.3 288.3L427.3 247.9L430.6 247.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M427.3 288.3L423.9 288L423.9 247.6L427.3 247.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M423.9 288L421.1 287.1L421.1 246.6L423.9 247.6ZM421.1 287.1L334.4 243.7L334.4 203.3L421.1 246.6ZM334.4 243.7L332.5 242.3L332.5 201.9L334.4 203.3ZM332.5 242.3L331.9 240.6L331.9 200.2L332.5 201.9Z\"/><path class=\"iso-top\" d=\"M511.9 201.2L513.8 202.7L514.5 204.3L513.8 206L511.9 207.4L433.5 246.6L430.6 247.6L427.3 247.9L423.9 247.6L421.1 246.6L334.4 203.3L332.5 201.9L331.9 200.2L332.5 198.5L334.4 197.1L412.9 157.9L415.7 156.9L419 156.6L422.4 156.9L425.2 157.9Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M514.5 204.3L513.8 206L511.9 207.4L433.5 246.6L430.6 247.6L427.3 247.9L423.9 247.6L421.1 246.6L334.4 203.3L332.5 201.9L331.9 200.2\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M514.5 204.3L512.4 205.7L510.8 207L432.6 246.1L430.1 246.9L427.3 247.2L424.5 246.9L422 246.1L335.6 202.8L333.9 201.6L331.9 200.2\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M514.5 213.2L513.8 214.8L511.9 216.3L433.5 255.5L430.6 256.4L427.3 256.8L423.9 256.4L421.1 255.5L334.4 212.1L332.5 210.7L331.9 209\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M331.9 200.2L332.5 198.5L334.4 197.1L412.9 157.9L415.7 156.9L419 156.6L422.4 156.9L425.2 157.9L511.9 201.2L513.8 202.7L514.5 204.3M514.5 244.8L513.8 246.4L511.9 247.9L433.5 287.1L430.6 288L427.3 288.3L423.9 288L421.1 287.1L334.4 243.7L332.5 242.3L331.9 240.6M514.5 204.3L514.5 244.8M331.9 200.2L331.9 240.6\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M402 171.7L403 170.9L420.7 162L422.3 161.6L424.1 161.6L425.6 162L470.2 184.3L471.1 185.1L471.1 188.3L470.2 189.1L452.5 197.9L450.9 198.4L449.1 198.4L447.5 197.9L403 175.6L402 174.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M471.1 188.3L470.2 189.1L470.2 186.8L471.1 186ZM470.2 189.1L452.5 197.9L452.5 195.7L470.2 186.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M452.5 197.9L450.9 198.4L450.9 196.1L452.5 195.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M450.9 198.4L449.1 198.4L449.1 196.1L450.9 196.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M449.1 198.4L447.5 197.9L447.5 195.7L449.1 196.1ZM447.5 197.9L403 175.6L403 173.4L447.5 195.7ZM403 175.6L402 174.9L402 172.6L403 173.4Z\"/><path class=\"iso-top\" d=\"M470.2 184.3L471.1 185.1L471.1 186L470.2 186.8L452.5 195.7L450.9 196.1L449.1 196.1L447.5 195.7L403 173.4L402 172.6L402 171.7L403 170.9L420.7 162L422.3 161.6L424.1 161.6L425.6 162Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M471.1 186L470.2 186.8L452.5 195.7L450.9 196.1L449.1 196.1L447.5 195.7L403 173.4L402 172.6\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M471.1 186L469.8 186.6L452.1 195.4L450.8 195.8L449.2 195.8L447.9 195.4L403.4 173.2L402 172.6\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M402 172.6L402 171.7L403 170.9L420.7 162L422.3 161.6L424.1 161.6L425.6 162L470.2 184.3L471.1 185.1L471.1 186M471.1 188.3L470.2 189.1L452.5 197.9L450.9 198.4L449.1 198.4L447.5 197.9L403 175.6L402 174.9M471.1 186L471.1 188.3M402 172.6L402 174.9\"/></g><path class=\"iso-line\" data-tone=\"mid\" d=\"M466.1 185.5L450 193.6L407.1 172.1L423.2 164.1Z\"/><path class=\"iso-line\" data-tone=\"hi\" d=\"M407.1 172.1L430.1 169.2L433.1 176.3L446.8 183.2L450 193.6\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M465.6 194.1L466.2 192.6L467.9 191.2L470.6 190.3L473.7 190L476.9 190.3L479.5 191.2L481.3 192.6L481.9 194.1L481.9 199.7L481.3 201.2L479.5 202.6L476.9 203.5L473.7 203.8L470.6 203.5L467.9 202.6L466.2 201.2L465.6 199.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M479.5 202.6L476.9 203.5L476.9 197.9L479.5 197ZM481.9 199.7L481.3 201.2L481.3 195.7L481.9 194.1ZM481.3 201.2L479.5 202.6L479.5 197L481.3 195.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M476.9 203.5L473.7 203.8L473.7 198.2L476.9 197.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M473.7 203.8L470.6 203.5L470.6 197.9L473.7 198.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M470.6 203.5L467.9 202.6L467.9 197L470.6 197.9ZM467.9 202.6L466.2 201.2L466.2 195.7L467.9 197ZM466.2 201.2L465.6 199.7L465.6 194.1L466.2 195.7Z\"/><path class=\"iso-top\" d=\"M479.5 197L476.9 197.9L473.7 198.2L470.6 197.9L467.9 197L466.2 195.7L465.6 194.1L466.2 192.6L467.9 191.2L470.6 190.3L473.7 190L476.9 190.3L479.5 191.2L481.3 192.6L481.9 194.1L481.3 195.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M481.9 194.1L481.3 195.7L479.5 197L476.9 197.9L473.7 198.2L470.6 197.9L467.9 197L466.2 195.7L465.6 194.1\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M481.9 194.1L480.5 195.5L478.9 196.7L476.5 197.5L473.7 197.8L470.9 197.5L468.6 196.7L467 195.5L465.6 194.1\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M465.6 194.1L466.2 192.6L467.9 191.2L470.6 190.3L473.7 190L476.9 190.3L479.5 191.2L481.3 192.6L481.9 194.1M481.9 199.7L481.3 201.2L479.5 202.6L476.9 203.5L473.7 203.8L470.6 203.5L467.9 202.6L466.2 201.2L465.6 199.7M465.6 194.1L465.6 199.7M481.9 194.1L481.9 199.7\"/></g><path class=\"iso-line\" data-tone=\"hi\" data-free=\"start\" d=\"M473.7 194.1L481.3 192.6\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M481 201.9L481.7 200.3L483.4 199L486.1 198.1L489.2 197.8L492.3 198.1L495 199L496.8 200.3L497.4 201.9L497.4 207.4L496.8 209L495 210.3L492.3 211.2L489.2 211.5L486.1 211.2L483.4 210.3L481.7 209L481 207.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M495 210.3L492.3 211.2L492.3 205.6L495 204.8ZM497.4 207.4L496.8 209L496.8 203.4L497.4 201.9ZM496.8 209L495 210.3L495 204.8L496.8 203.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M492.3 211.2L489.2 211.5L489.2 205.9L492.3 205.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M489.2 211.5L486.1 211.2L486.1 205.6L489.2 205.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M486.1 211.2L483.4 210.3L483.4 204.8L486.1 205.6ZM483.4 210.3L481.7 209L481.7 203.4L483.4 204.8ZM481.7 209L481 207.4L481 201.9L481.7 203.4Z\"/><path class=\"iso-top\" d=\"M495 204.8L492.3 205.6L489.2 205.9L486.1 205.6L483.4 204.8L481.7 203.4L481 201.9L481.7 200.3L483.4 199L486.1 198.1L489.2 197.8L492.3 198.1L495 199L496.8 200.3L497.4 201.9L496.8 203.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M497.4 201.9L496.8 203.4L495 204.8L492.3 205.6L489.2 205.9L486.1 205.6L483.4 204.8L481.7 203.4L481 201.9\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M497.4 201.9L495.9 203.3L494.4 204.4L492 205.2L489.2 205.5L486.4 205.2L484 204.4L482.5 203.3L481 201.9\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M481 201.9L481.7 200.3L483.4 199L486.1 198.1L489.2 197.8L492.3 198.1L495 199L496.8 200.3L497.4 201.9M497.4 207.4L496.8 209L495 210.3L492.3 211.2L489.2 211.5L486.1 211.2L483.4 210.3L481.7 209L481 207.4M481 201.9L481 207.4M497.4 201.9L497.4 207.4\"/></g><path class=\"iso-line\" data-tone=\"hi\" data-free=\"start\" d=\"M489.2 201.9L490.5 205.9\"/><g data-part=\"key-0\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M348.6 199.8L349.1 199.1L392 177.7L393.3 177.4L394.5 177.7L401.5 181.2L402 181.8L402 185.9L401.5 186.5L358.6 207.9L357.3 208.2L356.1 207.9L349.1 204.4L348.6 203.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M402 185.9L401.5 186.5L401.5 182.4L402 181.8ZM401.5 186.5L358.6 207.9L358.6 203.9L401.5 182.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M358.6 207.9L357.3 208.2L357.3 204.2L358.6 203.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M357.3 208.2L356.1 207.9L356.1 203.9L357.3 204.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M356.1 207.9L349.1 204.4L349.1 200.4L356.1 203.9ZM349.1 204.4L348.6 203.8L348.6 199.8L349.1 200.4Z\"/><path class=\"iso-top\" d=\"M401.5 181.2L402 181.8L401.5 182.4L358.6 203.9L357.3 204.2L356.1 203.9L349.1 200.4L348.6 199.8L349.1 199.1L392 177.7L393.3 177.4L394.5 177.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M402 181.8L401.5 182.4L358.6 203.9L357.3 204.2L356.1 203.9L349.1 200.4L348.6 199.8\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M402 181.8L401 182.3L358.3 203.7L357.3 203.9L356.4 203.7L349.6 200.2L348.6 199.8\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M348.6 199.8L349.1 199.1L392 177.7L393.3 177.4L394.5 177.7L401.5 181.2L402 181.8M402 185.9L401.5 186.5L358.6 207.9L357.3 208.2L356.1 207.9L349.1 204.4L348.6 203.8M402 181.8L402 185.9M348.6 199.8L348.6 203.8\"/></g></g><g data-part=\"key-1\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M358.9 204.9L359.4 204.3L402.3 182.8L403.6 182.6L404.8 182.8L411.8 186.4L412.3 187L412.3 191L411.8 191.6L368.9 213.1L367.7 213.4L366.4 213.1L359.4 209.6L358.9 209Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M412.3 191L411.8 191.6L411.8 187.6L412.3 187ZM411.8 191.6L368.9 213.1L368.9 209.1L411.8 187.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M368.9 213.1L367.7 213.4L367.7 209.3L368.9 209.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M367.7 213.4L366.4 213.1L366.4 209.1L367.7 209.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M366.4 213.1L359.4 209.6L359.4 205.5L366.4 209.1ZM359.4 209.6L358.9 209L358.9 204.9L359.4 205.5Z\"/><path class=\"iso-top\" d=\"M411.8 186.4L412.3 187L411.8 187.6L368.9 209.1L367.7 209.3L366.4 209.1L359.4 205.5L358.9 204.9L359.4 204.3L402.3 182.8L403.6 182.6L404.8 182.8Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M412.3 187L411.8 187.6L368.9 209.1L367.7 209.3L366.4 209.1L359.4 205.5L358.9 204.9\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M412.3 187L411.3 187.4L368.6 208.8L367.7 209L366.8 208.8L359.9 205.4L358.9 204.9\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M358.9 204.9L359.4 204.3L402.3 182.8L403.6 182.6L404.8 182.8L411.8 186.4L412.3 187M412.3 191L411.8 191.6L368.9 213.1L367.7 213.4L366.4 213.1L359.4 209.6L358.9 209M412.3 187L412.3 191M358.9 204.9L358.9 209\"/></g></g><g data-part=\"key-2\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M369.2 210.1L369.7 209.5L412.6 188L413.9 187.7L415.1 188L422.1 191.5L422.7 192.1L422.7 196.2L422.1 196.8L379.2 218.3L378 218.5L376.7 218.3L369.7 214.7L369.2 214.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M422.7 196.2L422.1 196.8L422.1 192.8L422.7 192.1ZM422.1 196.8L379.2 218.3L379.2 214.2L422.1 192.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M379.2 218.3L378 218.5L378 214.5L379.2 214.2Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M378 218.5L376.7 218.3L376.7 214.2L378 214.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M376.7 218.3L369.7 214.7L369.7 210.7L376.7 214.2ZM369.7 214.7L369.2 214.1L369.2 210.1L369.7 210.7Z\"/><path class=\"iso-top\" d=\"M422.1 191.5L422.7 192.1L422.1 192.8L379.2 214.2L378 214.5L376.7 214.2L369.7 210.7L369.2 210.1L369.7 209.5L412.6 188L413.9 187.7L415.1 188Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M422.7 192.1L422.1 192.8L379.2 214.2L378 214.5L376.7 214.2L369.7 210.7L369.2 210.1\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M422.7 192.1L421.7 192.6L378.9 214L378 214.2L377.1 214L370.2 210.5L369.2 210.1\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M369.2 210.1L369.7 209.5L412.6 188L413.9 187.7L415.1 188L422.1 191.5L422.7 192.1M422.7 196.2L422.1 196.8L379.2 218.3L378 218.5L376.7 218.3L369.7 214.7L369.2 214.1M422.7 192.1L422.7 196.2M369.2 210.1L369.2 214.1\"/></g></g><g data-part=\"key-3\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M379.5 215.2L380 214.6L423 193.2L424.2 192.9L425.4 193.2L432.5 196.7L433 197.3L433 201.3L432.5 202L389.5 223.4L388.3 223.7L387.1 223.4L380 219.9L379.5 219.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M433 201.3L432.5 202L432.5 197.9L433 197.3ZM432.5 202L389.5 223.4L389.5 219.4L432.5 197.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M389.5 223.4L388.3 223.7L388.3 219.6L389.5 219.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M388.3 223.7L387.1 223.4L387.1 219.4L388.3 219.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M387.1 223.4L380 219.9L380 215.9L387.1 219.4ZM380 219.9L379.5 219.3L379.5 215.2L380 215.9Z\"/><path class=\"iso-top\" d=\"M432.5 196.7L433 197.3L432.5 197.9L389.5 219.4L388.3 219.6L387.1 219.4L380 215.9L379.5 215.2L380 214.6L423 193.2L424.2 192.9L425.4 193.2Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M433 197.3L432.5 197.9L389.5 219.4L388.3 219.6L387.1 219.4L380 215.9L379.5 215.2\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M433 197.3L432 197.7L389.2 219.1L388.3 219.3L387.4 219.1L380.5 215.7L379.5 215.2\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M379.5 215.2L380 214.6L423 193.2L424.2 192.9L425.4 193.2L432.5 196.7L433 197.3M433 201.3L432.5 202L389.5 223.4L388.3 223.7L387.1 223.4L380 219.9L379.5 219.3M433 197.3L433 201.3M379.5 215.2L379.5 219.3\"/></g></g><g data-part=\"key-4\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M389.9 220.4L390.4 219.8L433.3 198.3L434.5 198.1L435.8 198.3L442.8 201.8L443.3 202.4L443.3 206.5L442.8 207.1L399.9 228.6L398.6 228.8L397.4 228.6L390.4 225.1L389.9 224.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M443.3 206.5L442.8 207.1L442.8 203.1L443.3 202.4ZM442.8 207.1L399.9 228.6L399.9 224.5L442.8 203.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M399.9 228.6L398.6 228.8L398.6 224.8L399.9 224.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M398.6 228.8L397.4 228.6L397.4 224.5L398.6 224.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M397.4 228.6L390.4 225.1L390.4 221L397.4 224.5ZM390.4 225.1L389.9 224.4L389.9 220.4L390.4 221Z\"/><path class=\"iso-top\" d=\"M442.8 201.8L443.3 202.4L442.8 203.1L399.9 224.5L398.6 224.8L397.4 224.5L390.4 221L389.9 220.4L390.4 219.8L433.3 198.3L434.5 198.1L435.8 198.3Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M443.3 202.4L442.8 203.1L399.9 224.5L398.6 224.8L397.4 224.5L390.4 221L389.9 220.4\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M443.3 202.4L442.3 202.9L399.5 224.3L398.6 224.5L397.7 224.3L390.8 220.9L389.9 220.4\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M389.9 220.4L390.4 219.8L433.3 198.3L434.5 198.1L435.8 198.3L442.8 201.8L443.3 202.4M443.3 206.5L442.8 207.1L399.9 228.6L398.6 228.8L397.4 228.6L390.4 225.1L389.9 224.4M443.3 202.4L443.3 206.5M389.9 220.4L389.9 224.4\"/></g></g><g data-part=\"key-5\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M400.2 225.6L400.7 224.9L443.6 203.5L444.8 203.2L446.1 203.5L453.1 207L453.6 207.6L453.6 211.7L453.1 212.3L410.2 233.7L408.9 234L407.7 233.7L400.7 230.2L400.2 229.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M453.6 211.7L453.1 212.3L453.1 208.2L453.6 207.6ZM453.1 212.3L410.2 233.7L410.2 229.7L453.1 208.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M410.2 233.7L408.9 234L408.9 229.9L410.2 229.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M408.9 234L407.7 233.7L407.7 229.7L408.9 229.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M407.7 233.7L400.7 230.2L400.7 226.2L407.7 229.7ZM400.7 230.2L400.2 229.6L400.2 225.6L400.7 226.2Z\"/><path class=\"iso-top\" d=\"M453.1 207L453.6 207.6L453.1 208.2L410.2 229.7L408.9 229.9L407.7 229.7L400.7 226.2L400.2 225.6L400.7 224.9L443.6 203.5L444.8 203.2L446.1 203.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M453.6 207.6L453.1 208.2L410.2 229.7L408.9 229.9L407.7 229.7L400.7 226.2L400.2 225.6\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M453.6 207.6L452.6 208.1L409.8 229.4L408.9 229.7L408 229.4L401.2 226L400.2 225.6\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M400.2 225.6L400.7 224.9L443.6 203.5L444.8 203.2L446.1 203.5L453.1 207L453.6 207.6M453.6 211.7L453.1 212.3L410.2 233.7L408.9 234L407.7 233.7L400.7 230.2L400.2 229.6M453.6 207.6L453.6 211.7M400.2 225.6L400.2 229.6\"/></g></g><g data-part=\"key-6\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M410.5 230.7L411 230.1L453.9 208.6L455.2 208.4L456.4 208.6L463.4 212.1L463.9 212.8L463.9 216.8L463.4 217.4L420.5 238.9L419.3 239.1L418 238.9L411 235.4L410.5 234.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M463.9 216.8L463.4 217.4L463.4 213.4L463.9 212.8ZM463.4 217.4L420.5 238.9L420.5 234.8L463.4 213.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M420.5 238.9L419.3 239.1L419.3 235.1L420.5 234.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M419.3 239.1L418 238.9L418 234.8L419.3 235.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M418 238.9L411 235.4L411 231.3L418 234.8ZM411 235.4L410.5 234.8L410.5 230.7L411 231.3Z\"/><path class=\"iso-top\" d=\"M463.4 212.1L463.9 212.8L463.4 213.4L420.5 234.8L419.3 235.1L418 234.8L411 231.3L410.5 230.7L411 230.1L453.9 208.6L455.2 208.4L456.4 208.6Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M463.9 212.8L463.4 213.4L420.5 234.8L419.3 235.1L418 234.8L411 231.3L410.5 230.7\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M463.9 212.8L462.9 213.2L420.2 234.6L419.3 234.8L418.3 234.6L411.5 231.2L410.5 230.7\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M410.5 230.7L411 230.1L453.9 208.6L455.2 208.4L456.4 208.6L463.4 212.1L463.9 212.8M463.9 216.8L463.4 217.4L420.5 238.9L419.3 239.1L418 238.9L411 235.4L410.5 234.8M463.9 212.8L463.9 216.8M410.5 230.7L410.5 234.8\"/></g></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M373.8 190.3L374.3 189.8L399 177.5L400.1 177.2L401.1 177.5L405.2 179.5L405.6 180L405.6 183.6L405.2 184.1L380.5 196.5L379.4 196.7L378.4 196.5L374.3 194.4L373.8 193.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M405.6 183.6L405.2 184.1L405.2 180.5L405.6 180ZM405.2 184.1L380.5 196.5L380.5 192.9L405.2 180.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M380.5 196.5L379.4 196.7L379.4 193.1L380.5 192.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M379.4 196.7L378.4 196.5L378.4 192.9L379.4 193.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M378.4 196.5L374.3 194.4L374.3 190.9L378.4 192.9ZM374.3 194.4L373.8 193.9L373.8 190.3L374.3 190.9Z\"/><path class=\"iso-top\" d=\"M405.2 179.5L405.6 180L405.2 180.5L380.5 192.9L379.4 193.1L378.4 192.9L374.3 190.9L373.8 190.3L374.3 189.8L399 177.5L400.1 177.2L401.1 177.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M405.6 180L405.2 180.5L380.5 192.9L379.4 193.1L378.4 192.9L374.3 190.9L373.8 190.3\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M373.8 190.3L374.3 189.8L399 177.5L400.1 177.2L401.1 177.5L405.2 179.5L405.6 180M405.6 183.6L405.2 184.1L380.5 196.5L379.4 196.7L378.4 196.5L374.3 194.4L373.8 193.9M405.6 180L405.6 183.6M373.8 190.3L373.8 193.9\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M384.2 195.5L384.6 195L409.3 182.6L410.4 182.4L411.4 182.6L415.5 184.7L416 185.2L416 188.7L415.5 189.2L390.8 201.6L389.7 201.8L388.7 201.6L384.6 199.6L384.2 199Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M416 188.7L415.5 189.2L415.5 185.7L416 185.2ZM415.5 189.2L390.8 201.6L390.8 198.1L415.5 185.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M390.8 201.6L389.7 201.8L389.7 198.3L390.8 198.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M389.7 201.8L388.7 201.6L388.7 198.1L389.7 198.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M388.7 201.6L384.6 199.6L384.6 196L388.7 198.1ZM384.6 199.6L384.2 199L384.2 195.5L384.6 196Z\"/><path class=\"iso-top\" d=\"M415.5 184.7L416 185.2L415.5 185.7L390.8 198.1L389.7 198.3L388.7 198.1L384.6 196L384.2 195.5L384.6 195L409.3 182.6L410.4 182.4L411.4 182.6Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M416 185.2L415.5 185.7L390.8 198.1L389.7 198.3L388.7 198.1L384.6 196L384.2 195.5\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M384.2 195.5L384.6 195L409.3 182.6L410.4 182.4L411.4 182.6L415.5 184.7L416 185.2M416 188.7L415.5 189.2L390.8 201.6L389.7 201.8L388.7 201.6L384.6 199.6L384.2 199M416 185.2L416 188.7M384.2 195.5L384.2 199\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M404.8 205.8L405.2 205.3L430 192.9L431 192.7L432 192.9L436.2 195L436.6 195.5L436.6 199L436.2 199.6L411.4 211.9L410.4 212.2L409.3 211.9L405.2 209.9L404.8 209.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M436.6 199L436.2 199.6L436.2 196L436.6 195.5ZM436.2 199.6L411.4 211.9L411.4 208.4L436.2 196Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M411.4 211.9L410.4 212.2L410.4 208.6L411.4 208.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M410.4 212.2L409.3 211.9L409.3 208.4L410.4 208.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M409.3 211.9L405.2 209.9L405.2 206.3L409.3 208.4ZM405.2 209.9L404.8 209.4L404.8 205.8L405.2 206.3Z\"/><path class=\"iso-top\" d=\"M436.2 195L436.6 195.5L436.2 196L411.4 208.4L410.4 208.6L409.3 208.4L405.2 206.3L404.8 205.8L405.2 205.3L430 192.9L431 192.7L432 192.9Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M436.6 195.5L436.2 196L411.4 208.4L410.4 208.6L409.3 208.4L405.2 206.3L404.8 205.8\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M404.8 205.8L405.2 205.3L430 192.9L431 192.7L432 192.9L436.2 195L436.6 195.5M436.6 199L436.2 199.6L411.4 211.9L410.4 212.2L409.3 211.9L405.2 209.9L404.8 209.4M436.6 195.5L436.6 199M404.8 205.8L404.8 209.4\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M415.1 211L415.5 210.5L440.3 198.1L441.3 197.9L442.4 198.1L446.5 200.1L446.9 200.7L446.9 204.2L446.5 204.7L421.7 217.1L420.7 217.3L419.7 217.1L415.5 215L415.1 214.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M446.9 204.2L446.5 204.7L446.5 201.2L446.9 200.7ZM446.5 204.7L421.7 217.1L421.7 213.6L446.5 201.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M421.7 217.1L420.7 217.3L420.7 213.8L421.7 213.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M420.7 217.3L419.7 217.1L419.7 213.6L420.7 213.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M419.7 217.1L415.5 215L415.5 211.5L419.7 213.6ZM415.5 215L415.1 214.5L415.1 211L415.5 211.5Z\"/><path class=\"iso-top\" d=\"M446.5 200.1L446.9 200.7L446.5 201.2L421.7 213.6L420.7 213.8L419.7 213.6L415.5 211.5L415.1 211L415.5 210.5L440.3 198.1L441.3 197.9L442.4 198.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M446.9 200.7L446.5 201.2L421.7 213.6L420.7 213.8L419.7 213.6L415.5 211.5L415.1 211\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M415.1 211L415.5 210.5L440.3 198.1L441.3 197.9L442.4 198.1L446.5 200.1L446.9 200.7M446.9 204.2L446.5 204.7L421.7 217.1L420.7 217.3L419.7 217.1L415.5 215L415.1 214.5M446.9 200.7L446.9 204.2M415.1 211L415.1 214.5\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M425.4 216.1L425.9 215.6L450.6 203.2L451.6 203L452.7 203.2L456.8 205.3L457.2 205.8L457.2 209.4L456.8 209.9L432 222.3L431 222.5L430 222.3L425.9 220.2L425.4 219.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M457.2 209.4L456.8 209.9L456.8 206.3L457.2 205.8ZM456.8 209.9L432 222.3L432 218.7L456.8 206.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M432 222.3L431 222.5L431 218.9L432 218.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M431 222.5L430 222.3L430 218.7L431 218.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M430 222.3L425.9 220.2L425.9 216.7L430 218.7ZM425.9 220.2L425.4 219.7L425.4 216.1L425.9 216.7Z\"/><path class=\"iso-top\" d=\"M456.8 205.3L457.2 205.8L456.8 206.3L432 218.7L431 218.9L430 218.7L425.9 216.7L425.4 216.1L425.9 215.6L450.6 203.2L451.6 203L452.7 203.2Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M457.2 205.8L456.8 206.3L432 218.7L431 218.9L430 218.7L425.9 216.7L425.4 216.1\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M425.4 216.1L425.9 215.6L450.6 203.2L451.6 203L452.7 203.2L456.8 205.3L457.2 205.8M457.2 209.4L456.8 209.9L432 222.3L431 222.5L430 222.3L425.9 220.2L425.4 219.7M457.2 205.8L457.2 209.4M425.4 216.1L425.4 219.7\"/></g><circle data-part=\"pulse\" class=\"iso-wire-end\" r=\"2.4\" style=\"stroke:var(--anatomy-lit);fill:var(--anatomy-lit)\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M415.6 292.8L416.2 291.4L417.8 290.1L420.3 289.3L423.2 289L426.1 289.3L428.5 290.1L430.2 291.4L430.8 292.8L430.8 296.3L430.2 297.8L428.5 299L426.1 299.9L423.2 300.1L420.3 299.9L417.8 299L416.2 297.8L415.6 296.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M428.5 299L426.1 299.9L426.1 296.3L428.5 295.5ZM430.8 296.3L430.2 297.8L430.2 294.3L430.8 292.8ZM430.2 297.8L428.5 299L428.5 295.5L430.2 294.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M426.1 299.9L423.2 300.1L423.2 296.6L426.1 296.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M423.2 300.1L420.3 299.9L420.3 296.3L423.2 296.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M420.3 299.9L417.8 299L417.8 295.5L420.3 296.3ZM417.8 299L416.2 297.8L416.2 294.3L417.8 295.5ZM416.2 297.8L415.6 296.3L415.6 292.8L416.2 294.3Z\"/><path class=\"iso-top\" d=\"M428.5 295.5L426.1 296.3L423.2 296.6L420.3 296.3L417.8 295.5L416.2 294.3L415.6 292.8L416.2 291.4L417.8 290.1L420.3 289.3L423.2 289L426.1 289.3L428.5 290.1L430.2 291.4L430.8 292.8L430.2 294.3Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M430.8 292.8L430.2 294.3L428.5 295.5L426.1 296.3L423.2 296.6L420.3 296.3L417.8 295.5L416.2 294.3L415.6 292.8\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M415.6 292.8L416.2 291.4L417.8 290.1L420.3 289.3L423.2 289L426.1 289.3L428.5 290.1L430.2 291.4L430.8 292.8M430.8 296.3L430.2 297.8L428.5 299L426.1 299.9L423.2 300.1L420.3 299.9L417.8 299L416.2 297.8L415.6 296.3M415.6 292.8L415.6 296.3M430.8 292.8L430.8 296.3\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"423.2\" cy=\"292.8\" r=\"0.5\"/></g></svg></div>";
const P = {"origin":[320,201.22056821459537],"scale":2.3069999880832937,"azimuth":45,"elevation":30}, LINE_Y = 26, RAIL_TOP = 4, PORTS = [-76,76];
const lineX = (place) => PORTS[0] + place * (PORTS[1] - PORTS[0]);
const pd = (points) => points.map(([x, y], i) => (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1)).join("");
const moveTo = (node, [x, y]) => { node.setAttribute("cx", x.toFixed(1)); node.setAttribute("cy", y.toFixed(1)); };
const DRUM = {"x":-56,"r":10,"from":-18,"to":18,"z":19}, PINS = [[-16,0],[-16,1.5707963267948966],[-16,3.141592653589793],[-16,4.71238898038469],[-12,0.7],[-12,1.9566370614359172],[-12,3.2132741228718347],[-12,4.469911184307752],[-12,5.726548245743669],[-8,1.4],[-8,2.4471975511965978],[-8,3.494395102393195],[-8,4.5415926535897935],[-8,5.58879020478639],[-8,6.635987755982988],[-4,2.0999999999999996],[-4,3.670796326794896],[-4,5.241592653589793],[-4,6.812388980384689],[0,2.8],[0,4.056637061435917],[0,5.313274122871834],[0,6.569911184307752],[0,7.826548245743669],[4,3.5],[4,4.547197551196597],[4,5.594395102393195],[4,6.641592653589793],[4,7.6887902047863905],[4,8.73598775598299],[8,4.199999999999999],[8,5.770796326794896],[8,7.341592653589792],[8,8.912388980384689],[12,4.8999999999999995],[12,6.156637061435917],[12,7.413274122871834],[12,8.66991118430775],[12,9.926548245743668],[16,5.6],[16,6.647197551196597],[16,7.6943951023931945],[16,8.741592653589793],[16,9.788790204786391],[16,10.835987755982988]], VIEW = [0.6123724356957946,0.6123724356957945,0.49999999999999994], WHITE = 7, REST = 0, LAP = 9, ALIVE = true, STOPS = Array.from({ length: 21 }, (_, i) => i / 20), SPAN = [0.3194486920894093,0.6612065249201702];
const GRID_AT = [-4.6,-13,18], CELL = 4.2, GRID_X = [-22,12], SYNTH_X = 50, SYNTH_FROM = 32, TAP = -5;
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
