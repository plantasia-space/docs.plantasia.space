// Built by figures/src/orbiter-console/build.mjs. Do not edit by hand.
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

export const svg = "<div class=\"iso-stage\" tabindex=\"0\" role=\"slider\" aria-label=\"The Orbiter's console: left and right arrows turn X, up and down arrows turn Y, Shift with left and right turns Z, Home brings the three back to 0°\" aria-valuemin=\"-180\" aria-valuemax=\"180\" aria-valuenow=\"0\"><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"iso-svg\" viewBox=\"0 0 640 400\" role=\"img\" aria-label=\"An Orbiter drawn as a console of its craft. A screen shows the World with its ring and its Moon, and a Star far off. Three knobs in a row are the axes X, Y and Z, each with a toggle in front of it. A rack holds the instrument and three effects, joined by a line. Three keys are the dimensions. Turning a knob turns the World on the screen and moves a marker on one effect.\"><path class=\"iso-halo\" d=\"M29.3 182.8L29.7 181.1L30.7 179.4L32.3 177.9L34.5 176.5L293.5 47L296.2 45.9L299.3 45.1L302.6 44.6L306.1 44.4L309.5 44.6L312.9 45.1L315.9 45.9L318.6 47L605.5 190.5L607.7 191.8L609.3 193.3L610.3 195L610.7 196.7L610.7 224L610.3 225.7L609.3 227.4L607.7 228.9L605.5 230.3L346.5 359.8L343.8 360.9L340.7 361.7L337.4 362.2L333.9 362.4L330.5 362.2L327.1 361.7L324.1 360.9L321.4 359.8L34.5 216.4L32.3 215L30.7 213.5L29.7 211.8L29.3 210.1Z\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M292.3 91.9L292.8 90.1L294.1 88.4L296.3 87L299.2 85.9L302.5 85.2L306.1 85L309.6 85.2L313 85.9L315.8 87L318 88.4L319.4 90.1L319.9 91.9L319.9 98.7L319.4 100.5L318 102.1L315.8 103.6L313 104.7L309.6 105.3L306.1 105.6L302.5 105.3L299.2 104.7L296.3 103.6L294.1 102.1L292.8 100.5L292.3 98.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M315.8 103.6L313 104.7L313 97.8L315.8 96.7ZM319.9 98.7L319.4 100.5L319.4 93.7L319.9 91.9ZM319.4 100.5L318 102.1L318 95.3L319.4 93.7ZM318 102.1L315.8 103.6L315.8 96.7L318 95.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M313 104.7L309.6 105.3L309.6 98.5L313 97.8ZM309.6 105.3L306.1 105.6L306.1 98.8L309.6 98.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M306.1 105.6L302.5 105.3L302.5 98.5L306.1 98.8ZM302.5 105.3L299.2 104.7L299.2 97.8L302.5 98.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M299.2 104.7L296.3 103.6L296.3 96.7L299.2 97.8ZM296.3 103.6L294.1 102.1L294.1 95.3L296.3 96.7ZM294.1 102.1L292.8 100.5L292.8 93.7L294.1 95.3ZM292.8 100.5L292.3 98.7L292.3 91.9L292.8 93.7Z\"/><path class=\"iso-top\" d=\"M315.8 96.7L313 97.8L309.6 98.5L306.1 98.8L302.5 98.5L299.2 97.8L296.3 96.7L294.1 95.3L292.8 93.7L292.3 91.9L292.8 90.1L294.1 88.4L296.3 87L299.2 85.9L302.5 85.2L306.1 85L309.6 85.2L313 85.9L315.8 87L318 88.4L319.4 90.1L319.9 91.9L319.4 93.7L318 95.3Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M319.9 91.9L319.4 93.7L318 95.3L315.8 96.7L313 97.8L309.6 98.5L306.1 98.8L302.5 98.5L299.2 97.8L296.3 96.7L294.1 95.3L292.8 93.7L292.3 91.9\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M292.3 91.9L292.8 90.1L294.1 88.4L296.3 87L299.2 85.9L302.5 85.2L306.1 85L309.6 85.2L313 85.9L315.8 87L318 88.4L319.4 90.1L319.9 91.9M319.9 98.7L319.4 100.5L318 102.1L315.8 103.6L313 104.7L309.6 105.3L306.1 105.6L302.5 105.3L299.2 104.7L296.3 103.6L294.1 102.1L292.8 100.5L292.3 98.7M292.3 91.9L292.3 98.7M319.9 91.9L319.9 98.7\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M69.5 203.3L70 201.5L71.3 199.8L73.5 198.4L76.4 197.3L79.7 196.6L83.3 196.4L86.8 196.6L90.2 197.3L93 198.4L95.2 199.8L96.6 201.5L97.1 203.3L97.1 210.1L96.6 211.9L95.2 213.5L93 215L90.2 216.1L86.8 216.8L83.3 217L79.7 216.8L76.4 216.1L73.5 215L71.3 213.5L70 211.9L69.5 210.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M93 215L90.2 216.1L90.2 209.2L93 208.1ZM97.1 210.1L96.6 211.9L96.6 205.1L97.1 203.3ZM96.6 211.9L95.2 213.5L95.2 206.7L96.6 205.1ZM95.2 213.5L93 215L93 208.1L95.2 206.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M90.2 216.1L86.8 216.8L86.8 209.9L90.2 209.2ZM86.8 216.8L83.3 217L83.3 210.2L86.8 209.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M83.3 217L79.7 216.8L79.7 209.9L83.3 210.2ZM79.7 216.8L76.4 216.1L76.4 209.2L79.7 209.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M76.4 216.1L73.5 215L73.5 208.1L76.4 209.2ZM73.5 215L71.3 213.5L71.3 206.7L73.5 208.1ZM71.3 213.5L70 211.9L70 205.1L71.3 206.7ZM70 211.9L69.5 210.1L69.5 203.3L70 205.1Z\"/><path class=\"iso-top\" d=\"M93 208.1L90.2 209.2L86.8 209.9L83.3 210.2L79.7 209.9L76.4 209.2L73.5 208.1L71.3 206.7L70 205.1L69.5 203.3L70 201.5L71.3 199.8L73.5 198.4L76.4 197.3L79.7 196.6L83.3 196.4L86.8 196.6L90.2 197.3L93 198.4L95.2 199.8L96.6 201.5L97.1 203.3L96.6 205.1L95.2 206.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M97.1 203.3L96.6 205.1L95.2 206.7L93 208.1L90.2 209.2L86.8 209.9L83.3 210.2L79.7 209.9L76.4 209.2L73.5 208.1L71.3 206.7L70 205.1L69.5 203.3\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M69.5 203.3L70 201.5L71.3 199.8L73.5 198.4L76.4 197.3L79.7 196.6L83.3 196.4L86.8 196.6L90.2 197.3L93 198.4L95.2 199.8L96.6 201.5L97.1 203.3M97.1 210.1L96.6 211.9L95.2 213.5L93 215L90.2 216.1L86.8 216.8L83.3 217L79.7 216.8L76.4 216.1L73.5 215L71.3 213.5L70 211.9L69.5 210.1M69.5 203.3L69.5 210.1M97.1 203.3L97.1 210.1\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M542.9 217.2L543.4 215.4L544.8 213.7L547 212.3L549.8 211.2L553.2 210.5L556.7 210.3L560.3 210.5L563.6 211.2L566.5 212.3L568.7 213.7L570 215.4L570.5 217.2L570.5 224L570 225.8L568.7 227.5L566.5 228.9L563.6 230L560.3 230.7L556.7 230.9L553.2 230.7L549.8 230L547 228.9L544.8 227.5L543.4 225.8L542.9 224Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M566.5 228.9L563.6 230L563.6 223.2L566.5 222.1ZM570.5 224L570 225.8L570 219L570.5 217.2ZM570 225.8L568.7 227.5L568.7 220.6L570 219ZM568.7 227.5L566.5 228.9L566.5 222.1L568.7 220.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M563.6 230L560.3 230.7L560.3 223.9L563.6 223.2ZM560.3 230.7L556.7 230.9L556.7 224.1L560.3 223.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M556.7 230.9L553.2 230.7L553.2 223.9L556.7 224.1ZM553.2 230.7L549.8 230L549.8 223.2L553.2 223.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M549.8 230L547 228.9L547 222.1L549.8 223.2ZM547 228.9L544.8 227.5L544.8 220.6L547 222.1ZM544.8 227.5L543.4 225.8L543.4 219L544.8 220.6ZM543.4 225.8L542.9 224L542.9 217.2L543.4 219Z\"/><path class=\"iso-top\" d=\"M566.5 222.1L563.6 223.2L560.3 223.9L556.7 224.1L553.2 223.9L549.8 223.2L547 222.1L544.8 220.6L543.4 219L542.9 217.2L543.4 215.4L544.8 213.7L547 212.3L549.8 211.2L553.2 210.5L556.7 210.3L560.3 210.5L563.6 211.2L566.5 212.3L568.7 213.7L570 215.4L570.5 217.2L570 219L568.7 220.6Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M570.5 217.2L570 219L568.7 220.6L566.5 222.1L563.6 223.2L560.3 223.9L556.7 224.1L553.2 223.9L549.8 223.2L547 222.1L544.8 220.6L543.4 219L542.9 217.2\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M542.9 217.2L543.4 215.4L544.8 213.7L547 212.3L549.8 211.2L553.2 210.5L556.7 210.3L560.3 210.5L563.6 211.2L566.5 212.3L568.7 213.7L570 215.4L570.5 217.2M570.5 224L570 225.8L568.7 227.5L566.5 228.9L563.6 230L560.3 230.7L556.7 230.9L553.2 230.7L549.8 230L547 228.9L544.8 227.5L543.4 225.8L542.9 224M542.9 217.2L542.9 224M570.5 217.2L570.5 224\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M320.1 328.6L320.6 326.8L322 325.2L324.2 323.7L327 322.6L330.4 321.9L333.9 321.7L337.5 321.9L340.8 322.6L343.7 323.7L345.9 325.2L347.2 326.8L347.7 328.6L347.7 335.4L347.2 337.2L345.9 338.9L343.7 340.3L340.8 341.4L337.5 342.1L333.9 342.3L330.4 342.1L327 341.4L324.2 340.3L322 338.9L320.6 337.2L320.1 335.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M343.7 340.3L340.8 341.4L340.8 334.6L343.7 333.5ZM347.7 335.4L347.2 337.2L347.2 330.4L347.7 328.6ZM347.2 337.2L345.9 338.9L345.9 332L347.2 330.4ZM345.9 338.9L343.7 340.3L343.7 333.5L345.9 332Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M340.8 341.4L337.5 342.1L337.5 335.3L340.8 334.6ZM337.5 342.1L333.9 342.3L333.9 335.5L337.5 335.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M333.9 342.3L330.4 342.1L330.4 335.3L333.9 335.5ZM330.4 342.1L327 341.4L327 334.6L330.4 335.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M327 341.4L324.2 340.3L324.2 333.5L327 334.6ZM324.2 340.3L322 338.9L322 332L324.2 333.5ZM322 338.9L320.6 337.2L320.6 330.4L322 332ZM320.6 337.2L320.1 335.4L320.1 328.6L320.6 330.4Z\"/><path class=\"iso-top\" d=\"M343.7 333.5L340.8 334.6L337.5 335.3L333.9 335.5L330.4 335.3L327 334.6L324.2 333.5L322 332L320.6 330.4L320.1 328.6L320.6 326.8L322 325.2L324.2 323.7L327 322.6L330.4 321.9L333.9 321.7L337.5 321.9L340.8 322.6L343.7 323.7L345.9 325.2L347.2 326.8L347.7 328.6L347.2 330.4L345.9 332Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M347.7 328.6L347.2 330.4L345.9 332L343.7 333.5L340.8 334.6L337.5 335.3L333.9 335.5L330.4 335.3L327 334.6L324.2 333.5L322 332L320.6 330.4L320.1 328.6\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M320.1 328.6L320.6 326.8L322 325.2L324.2 323.7L327 322.6L330.4 321.9L333.9 321.7L337.5 321.9L340.8 322.6L343.7 323.7L345.9 325.2L347.2 326.8L347.7 328.6M347.7 335.4L347.2 337.2L345.9 338.9L343.7 340.3L340.8 341.4L337.5 342.1L333.9 342.3L330.4 342.1L327 341.4L324.2 340.3L322 338.9L320.6 337.2L320.1 335.4M320.1 328.6L320.1 335.4M347.7 328.6L347.7 335.4\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M29.3 176L29.7 174.3L30.7 172.6L32.3 171.1L34.5 169.7L293.5 40.2L296.2 39.1L299.3 38.3L302.6 37.8L306.1 37.6L309.5 37.8L312.9 38.3L315.9 39.1L318.6 40.2L605.5 183.6L607.7 185L609.3 186.5L610.3 188.2L610.7 189.9L610.7 217.2L610.3 218.9L609.3 220.6L607.7 222.1L605.5 223.5L346.5 353L343.8 354.1L340.7 354.9L337.4 355.4L333.9 355.6L330.5 355.4L327.1 354.9L324.1 354.1L321.4 353L34.5 209.5L32.3 208.2L30.7 206.7L29.7 205L29.3 203.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M610.7 217.2L610.3 218.9L610.3 191.6L610.7 189.9ZM610.3 218.9L609.3 220.6L609.3 193.3L610.3 191.6ZM609.3 220.6L607.7 222.1L607.7 194.8L609.3 193.3ZM607.7 222.1L605.5 223.5L605.5 196.2L607.7 194.8ZM605.5 223.5L346.5 353L346.5 325.7L605.5 196.2ZM346.5 353L343.8 354.1L343.8 326.8L346.5 325.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M343.8 354.1L340.7 354.9L340.7 327.6L343.8 326.8ZM340.7 354.9L337.4 355.4L337.4 328.1L340.7 327.6ZM337.4 355.4L333.9 355.6L333.9 328.3L337.4 328.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M333.9 355.6L330.5 355.4L330.5 328.1L333.9 328.3ZM330.5 355.4L327.1 354.9L327.1 327.6L330.5 328.1ZM327.1 354.9L324.1 354.1L324.1 326.8L327.1 327.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M324.1 354.1L321.4 353L321.4 325.7L324.1 326.8ZM321.4 353L34.5 209.5L34.5 182.2L321.4 325.7ZM34.5 209.5L32.3 208.2L32.3 180.9L34.5 182.2ZM32.3 208.2L30.7 206.7L30.7 179.4L32.3 180.9ZM30.7 206.7L29.7 205L29.7 177.7L30.7 179.4ZM29.7 205L29.3 203.3L29.3 176L29.7 177.7Z\"/><path class=\"iso-top\" d=\"M605.5 183.6L607.7 185L609.3 186.5L610.3 188.2L610.7 189.9L610.3 191.6L609.3 193.3L607.7 194.8L605.5 196.2L346.5 325.7L343.8 326.8L340.7 327.6L337.4 328.1L333.9 328.3L330.5 328.1L327.1 327.6L324.1 326.8L321.4 325.7L34.5 182.2L32.3 180.9L30.7 179.4L29.7 177.7L29.3 176L29.7 174.3L30.7 172.6L32.3 171.1L34.5 169.7L293.5 40.2L296.2 39.1L299.3 38.3L302.6 37.8L306.1 37.6L309.5 37.8L312.9 38.3L315.9 39.1L318.6 40.2Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M610.7 189.9L610.3 191.6L609.3 193.3L607.7 194.8L605.5 196.2L346.5 325.7L343.8 326.8L340.7 327.6L337.4 328.1L333.9 328.3L330.5 328.1L327.1 327.6L324.1 326.8L321.4 325.7L34.5 182.2L32.3 180.9L30.7 179.4L29.7 177.7L29.3 176\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M610.7 189.9L607.6 191.4L606.8 192.8L605.4 194.1L603.4 195.2L344.6 324.7L342.2 325.6L339.7 326.3L336.8 326.8L333.9 326.9L331 326.8L328.2 326.3L325.6 325.6L323.2 324.7L36.6 181.3L34.6 180.1L33.2 178.8L32.4 177.4L29.3 176\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M610.7 208.7L610.3 210.4L609.3 212.1L607.7 213.6L605.5 214.9L346.5 344.4L343.8 345.5L340.7 346.4L337.4 346.9L333.9 347L330.5 346.9L327.1 346.4L324.1 345.5L321.4 344.4L34.5 201L32.3 199.7L30.7 198.1L29.7 196.5L29.3 194.7\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M29.3 176L29.7 174.3L30.7 172.6L32.3 171.1L34.5 169.7L293.5 40.2L296.2 39.1L299.3 38.3L302.6 37.8L306.1 37.6L309.5 37.8L312.9 38.3L315.9 39.1L318.6 40.2L605.5 183.6L607.7 185L609.3 186.5L610.3 188.2L610.7 189.9M610.7 217.2L610.3 218.9L609.3 220.6L607.7 222.1L605.5 223.5L346.5 353L343.8 354.1L340.7 354.9L337.4 355.4L333.9 355.6L330.5 355.4L327.1 354.9L324.1 354.1L321.4 353L34.5 209.5L32.3 208.2L30.7 206.7L29.7 205L29.3 203.3M610.7 189.9L610.7 217.2M29.3 176L29.3 203.3\"/></g><path class=\"iso-line\" data-tone=\"faint\" d=\"M599.9 186.4L601.1 187.2L602 188L602.6 188.9L602.8 189.9L602.6 190.9L602 191.8L601.1 192.6L599.9 193.4L340.9 322.9L339.4 323.5L337.7 324L335.8 324.2L333.9 324.3L332 324.2L330.2 324L328.5 323.5L327 322.9L40.1 179.5L38.9 178.7L38 177.9L37.4 176.9L37.2 176L37.4 175L38 174.1L38.9 173.2L40.1 172.5L299.1 43L300.6 42.4L302.3 41.9L304.2 41.6L306.1 41.6L308 41.6L309.8 41.9L311.5 42.4L313 43Z\"/><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"306.1\" cy=\"46.5\" r=\"0.5\"/><circle cx=\"592.9\" cy=\"189.9\" r=\"0.5\"/><circle cx=\"47.1\" cy=\"176\" r=\"0.5\"/><circle cx=\"333.9\" cy=\"319.4\" r=\"0.5\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M192.4 105L193 103.5L194.7 102.3L303.3 48L305.8 47.1L308.9 46.8L311.9 47.1L314.4 48L411.9 96.7L413.6 98L414.2 99.5L414.2 103.6L413.6 105.1L411.9 106.4L303.3 160.7L300.7 161.5L297.7 161.8L294.7 161.5L292.1 160.7L194.7 111.9L193 110.6L192.4 109.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M414.2 103.6L413.6 105.1L413.6 101L414.2 99.5ZM413.6 105.1L411.9 106.4L411.9 102.3L413.6 101ZM411.9 106.4L303.3 160.7L303.3 156.6L411.9 102.3ZM303.3 160.7L300.7 161.5L300.7 157.4L303.3 156.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M300.7 161.5L297.7 161.8L297.7 157.7L300.7 157.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M297.7 161.8L294.7 161.5L294.7 157.4L297.7 157.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M294.7 161.5L292.1 160.7L292.1 156.6L294.7 157.4ZM292.1 160.7L194.7 111.9L194.7 107.8L292.1 156.6ZM194.7 111.9L193 110.6L193 106.6L194.7 107.8ZM193 110.6L192.4 109.1L192.4 105L193 106.6Z\"/><path class=\"iso-top\" d=\"M411.9 96.7L413.6 98L414.2 99.5L413.6 101L411.9 102.3L303.3 156.6L300.7 157.4L297.7 157.7L294.7 157.4L292.1 156.6L194.7 107.8L193 106.6L192.4 105L193 103.5L194.7 102.3L303.3 48L305.8 47.1L308.9 46.8L311.9 47.1L314.4 48Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M414.2 99.5L413.6 101L411.9 102.3L303.3 156.6L300.7 157.4L297.7 157.7L294.7 157.4L292.1 156.6L194.7 107.8L193 106.6L192.4 105\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M414.2 99.5L412.7 100.8L411.1 102L302.7 156.2L300.4 157L297.7 157.2L295.1 157L292.8 156.2L195.4 107.5L193.9 106.4L192.4 105\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M192.4 105L193 103.5L194.7 102.3L303.3 48L305.8 47.1L308.9 46.8L311.9 47.1L314.4 48L411.9 96.7L413.6 98L414.2 99.5M414.2 103.6L413.6 105.1L411.9 106.4L303.3 160.7L300.7 161.5L297.7 161.8L294.7 161.5L292.1 160.7L194.7 111.9L193 110.6L192.4 109.1M414.2 99.5L414.2 103.6M192.4 105L192.4 109.1\"/></g><path class=\"iso-line\" data-tone=\"mid\" d=\"M403.6 99.5L297.7 152.4L203 105L308.9 52.1Z\"/><g class=\"iso-dots\" data-tone=\"lo\"><circle cx=\"308.9\" cy=\"48.8\" r=\"0.36\"/><circle cx=\"410.2\" cy=\"99.5\" r=\"0.36\"/><circle cx=\"196.3\" cy=\"105\" r=\"0.36\"/><circle cx=\"297.7\" cy=\"155.7\" r=\"0.36\"/></g><path class=\"iso-line\" data-tone=\"mid\" d=\"M344.6 71.1L346.2 73.9L351.1 72.5L348.3 74.9L353.7 75.7L348.3 76.4L351.1 78.9L346.2 77.5L344.6 80.2L343.1 77.5L338.2 78.9L341.0 76.4L335.6 75.7L341.0 74.9L338.2 72.5L343.1 73.9Z\"/><path data-part=\"ring\" class=\"iso-line\" data-tone=\"hi\" data-free=\"\" d=\"M350.6 102.3L350.4 101.3L349.8 100.3L348.9 99.4L347.7 98.5L346.1 97.6L344.2 96.7L342.0 95.9L339.5 95.1L336.7 94.4L333.7 93.8L330.4 93.2L326.9 92.7L323.3 92.2L319.5 91.8L315.5 91.5L311.5 91.3L307.4 91.2L303.3 91.2L299.2 91.2L295.1 91.3L291.1 91.5L287.1 91.8L283.3 92.2L279.7 92.7L276.2 93.2L272.9 93.8L269.9 94.4L267.1 95.1L264.6 95.9L262.4 96.7L260.5 97.6L258.9 98.5L257.6 99.4L256.7 100.3L256.2 101.3L256.0 102.3L256.2 103.2L256.7 104.2L257.6 105.1L258.9 106.1L260.5 107.0L262.4 107.8L264.6 108.6L267.1 109.4L269.9 110.1L272.9 110.8L276.2 111.4L279.7 111.9L283.3 112.3L287.1 112.7L291.1 113.0M315.5 113.0L319.5 112.7L323.3 112.3L326.9 111.9L330.4 111.4L333.7 110.8L336.7 110.1L339.5 109.4L342.0 108.6L344.2 107.8L346.1 107.0L347.7 106.1L348.9 105.1L349.8 104.2L350.4 103.2L350.6 102.3\"/><path class=\"iso-fill\" d=\"M326.9 102.3L326.6 100.4L325.8 98.6L324.3 96.9L322.4 95.3L320.0 93.9L317.2 92.7L314.0 91.7L310.6 91.0L307.0 90.6L303.3 90.4L299.6 90.6L296.0 91.0L292.6 91.7L289.4 92.7L286.6 93.9L284.2 95.3L282.2 96.9L280.8 98.6L279.9 100.4L279.7 102.3L279.9 104.1L280.8 105.9L282.2 107.6L284.2 109.2L286.6 110.6L289.4 111.8L292.6 112.8L296.0 113.5L299.6 113.9L303.3 114.1L307.0 113.9L310.6 113.5L314.0 112.8L317.2 111.8L320.0 110.6L322.4 109.2L324.3 107.6L325.8 105.9L326.6 104.1Z\"/><path class=\"iso-line\" data-tone=\"hi\" d=\"M326.9 102.3L326.6 100.4L325.8 98.6L324.3 96.9L322.4 95.3L320.0 93.9L317.2 92.7L314.0 91.7L310.6 91.0L307.0 90.6L303.3 90.4L299.6 90.6L296.0 91.0L292.6 91.7L289.4 92.7L286.6 93.9L284.2 95.3L282.2 96.9L280.8 98.6L279.9 100.4L279.7 102.3L279.9 104.1L280.8 105.9L282.2 107.6L284.2 109.2L286.6 110.6L289.4 111.8L292.6 112.8L296.0 113.5L299.6 113.9L303.3 114.1L307.0 113.9L310.6 113.5L314.0 112.8L317.2 111.8L320.0 110.6L322.4 109.2L324.3 107.6L325.8 105.9L326.6 104.1Z\"/><circle data-part=\"moon\" class=\"iso-wire-end\" r=\"2.2\" cx=\"339.5\" cy=\"95.1\" style=\"stroke:var(--anatomy-hi)\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M369.1 140.6L370.1 139.7L434.2 107.7L436 107.2L438 107.2L439.8 107.7L592.9 184.3L594 185.1L594 190.4L592.9 191.3L528.9 223.3L527.1 223.8L525.1 223.8L523.3 223.3L370.1 146.7L369.1 145.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M594 190.4L592.9 191.3L592.9 187L594 186.2ZM592.9 191.3L528.9 223.3L528.9 219.1L592.9 187ZM528.9 223.3L527.1 223.8L527.1 219.6L528.9 219.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M527.1 223.8L525.1 223.8L525.1 219.6L527.1 219.6ZM525.1 223.8L523.3 223.3L523.3 219.1L525.1 219.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M523.3 223.3L370.1 146.7L370.1 142.5L523.3 219.1ZM370.1 146.7L369.1 145.9L369.1 141.6L370.1 142.5Z\"/><path class=\"iso-top\" d=\"M592.9 184.3L594 185.1L594 186.2L592.9 187L528.9 219.1L527.1 219.6L525.1 219.6L523.3 219.1L370.1 142.5L369.1 141.6L369.1 140.6L370.1 139.7L434.2 107.7L436 107.2L438 107.2L439.8 107.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M594 186.2L592.9 187L528.9 219.1L527.1 219.6L525.1 219.6L523.3 219.1L370.1 142.5L369.1 141.6\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M594 186.2L592.3 186.8L528.4 218.8L526.9 219.2L525.3 219.2L523.8 218.8L370.8 142.2L369.1 141.6\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M369.1 141.6L369.1 140.6L370.1 139.7L434.2 107.7L436 107.2L438 107.2L439.8 107.7L592.9 184.3L594 185.1L594 186.2M594 190.4L592.9 191.3L528.9 223.3L527.1 223.8L525.1 223.8L523.3 223.3L370.1 146.7L369.1 145.9M594 186.2L594 190.4M369.1 141.6L369.1 145.9\"/></g><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"437\" cy=\"110.4\" r=\"0.4\"/><circle cx=\"587.4\" cy=\"185.6\" r=\"0.4\"/><circle cx=\"375.7\" cy=\"141.1\" r=\"0.4\"/><circle cx=\"526.1\" cy=\"216.3\" r=\"0.4\"/></g><path class=\"iso-line\" data-tone=\"mid\" d=\"M443.9 144.6L560.9 203.1\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M382.9 113.5L383.2 112.7L384.1 112.1L437 85.6L438.2 85.2L439.8 85.1L441.3 85.2L442.5 85.6L470.4 99.6L471.2 100.2L471.5 100.9L471.5 129.9L471.2 130.7L470.4 131.3L417.5 157.8L416.2 158.2L414.7 158.4L413.2 158.2L411.9 157.8L384.1 143.9L383.2 143.2L382.9 142.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M471.5 129.9L471.2 130.7L471.2 101.7L471.5 100.9ZM471.2 130.7L470.4 131.3L470.4 102.3L471.2 101.7ZM470.4 131.3L417.5 157.8L417.5 128.8L470.4 102.3ZM417.5 157.8L416.2 158.2L416.2 129.2L417.5 128.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M416.2 158.2L414.7 158.4L414.7 129.4L416.2 129.2Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M414.7 158.4L413.2 158.2L413.2 129.2L414.7 129.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M413.2 158.2L411.9 157.8L411.9 128.8L413.2 129.2ZM411.9 157.8L384.1 143.9L384.1 114.9L411.9 128.8ZM384.1 143.9L383.2 143.2L383.2 114.2L384.1 114.9ZM383.2 143.2L382.9 142.5L382.9 113.5L383.2 114.2Z\"/><path class=\"iso-top\" d=\"M470.4 99.6L471.2 100.2L471.5 100.9L471.2 101.7L470.4 102.3L417.5 128.8L416.2 129.2L414.7 129.4L413.2 129.2L411.9 128.8L384.1 114.9L383.2 114.2L382.9 113.5L383.2 112.7L384.1 112.1L437 85.6L438.2 85.2L439.8 85.1L441.3 85.2L442.5 85.6Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M471.5 100.9L471.2 101.7L470.4 102.3L417.5 128.8L416.2 129.2L414.7 129.4L413.2 129.2L411.9 128.8L384.1 114.9L383.2 114.2L382.9 113.5\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M471.5 100.9L470.2 101.5L469.5 102L416.7 128.3L415.7 128.7L414.7 128.8L413.6 128.7L412.7 128.3L385 114.5L384.3 114L382.9 113.5\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M471.5 107.8L471.2 108.5L470.4 109.2L417.5 135.6L416.2 136L414.7 136.2L413.2 136L411.9 135.6L384.1 121.7L383.2 121.1L382.9 120.3\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M382.9 113.5L383.2 112.7L384.1 112.1L437 85.6L438.2 85.2L439.8 85.1L441.3 85.2L442.5 85.6L470.4 99.6L471.2 100.2L471.5 100.9M471.5 129.9L471.2 130.7L470.4 131.3L417.5 157.8L416.2 158.2L414.7 158.4L413.2 158.2L411.9 157.8L384.1 143.9L383.2 143.2L382.9 142.5M471.5 100.9L471.5 129.9M382.9 113.5L382.9 142.5\"/></g><path class=\"iso-line\" data-tone=\"mid\" d=\"M450.2 104.8L447.3 105.9L443.9 106.5L440.2 106.6L436.7 106.3L433.5 105.4L430.9 104.1L429.2 102.5L428.4 100.7L428.6 98.9L429.9 97.2L432.1 95.7L435 94.6L438.4 94L442.1 93.9L445.6 94.3L448.8 95.1L451.4 96.4L453.1 98L453.9 99.8L453.7 101.6L452.4 103.3ZM444.2 101.8L442.3 102.3L440 102.3L438.1 101.8L437 100.8L437 99.7L438.1 98.7L440 98.2L442.3 98.2L444.2 98.7L445.3 99.7L445.3 100.8ZM422.4 118.7L419.4 119.8L416 120.4L412.4 120.6L408.8 120.2L405.6 119.3L403.1 118L401.3 116.4L400.5 114.6L400.8 112.8L402.1 111.1L404.2 109.7L407.2 108.6L410.6 107.9L414.2 107.8L417.8 108.2L421 109.1L423.5 110.3L425.3 111.9L426.1 113.7L425.8 115.5L424.5 117.2ZM416.4 115.7L414.4 116.3L412.2 116.3L410.2 115.7L409.1 114.7L409.1 113.6L410.2 112.6L412.2 112.1L414.4 112.1L416.4 112.6L417.5 113.6L417.5 114.7Z\"/><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"441.1\" cy=\"100.3\" r=\"0.45\"/><circle cx=\"413.3\" cy=\"114.2\" r=\"0.45\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M426 144.8L426.9 144L480.4 117.3L482 116.9L483.8 116.9L485.4 117.3L505.5 127.3L506.4 128.1L506.4 147.8L505.5 148.6L452 175.3L450.4 175.8L448.6 175.8L447 175.3L426.9 165.3L426 164.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M506.4 147.8L505.5 148.6L505.5 129.8L506.4 129ZM505.5 148.6L452 175.3L452 156.6L505.5 129.8ZM452 175.3L450.4 175.8L450.4 157L452 156.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M450.4 175.8L448.6 175.8L448.6 157L450.4 157Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M448.6 175.8L447 175.3L447 156.6L448.6 157ZM447 175.3L426.9 165.3L426.9 146.6L447 156.6ZM426.9 165.3L426 164.5L426 145.8L426.9 146.6Z\"/><path class=\"iso-top\" d=\"M505.5 127.3L506.4 128.1L506.4 129L505.5 129.8L452 156.6L450.4 157L448.6 157L447 156.6L426.9 146.6L426 145.8L426 144.8L426.9 144L480.4 117.3L482 116.9L483.8 116.9L485.4 117.3Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M506.4 129L505.5 129.8L452 156.6L450.4 157L448.6 157L447 156.6L426.9 146.6L426 145.8\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M506.4 129L504.9 129.6L451.5 156.3L450.2 156.7L448.8 156.7L447.5 156.3L427.6 146.3L426 145.8\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M506.4 134.2L505.5 135L452 161.7L450.4 162.2L448.6 162.2L447 161.7L426.9 151.7L426 150.9\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M426 145.8L426 144.8L426.9 144L480.4 117.3L482 116.9L483.8 116.9L485.4 117.3L505.5 127.3L506.4 128.1L506.4 129M506.4 147.8L505.5 148.6L452 175.3L450.4 175.8L448.6 175.8L447 175.3L426.9 165.3L426 164.5M506.4 129L506.4 147.8M426 145.8L426 164.5\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M486.8 126.6L487.6 127.2L487.9 127.9L487.6 128.6L486.8 129.1L450.6 147.2L449.5 147.6L448.1 147.8L446.8 147.6L445.6 147.2L445.6 147.2L444.8 146.7L444.6 146L444.8 145.3L445.6 144.7L481.8 126.6L483 126.3L484.3 126.1L485.7 126.3L486.8 126.6Z\"/><g data-part=\"pip-0\"><g class=\"iso-solid\" data-lit=\"\"><path class=\"iso-fill\" d=\"M457.5 133.2L458.1 132.7L463.2 130.2L464.2 129.9L465.4 129.9L466.5 130.2L474.3 134.1L474.9 134.6L474.9 137.9L474.3 138.5L469.3 141L468.2 141.3L467 141.3L465.9 141L458.1 137.1L457.5 136.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M474.9 137.9L474.3 138.5L474.3 135.7L474.9 135.2ZM474.3 138.5L469.3 141L469.3 138.3L474.3 135.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M469.3 141L468.2 141.3L468.2 138.6L469.3 138.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M468.2 141.3L467 141.3L467 138.6L468.2 138.6ZM467 141.3L465.9 141L465.9 138.3L467 138.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M465.9 141L458.1 137.1L458.1 134.4L465.9 138.3ZM458.1 137.1L457.5 136.6L457.5 133.8L458.1 134.4Z\"/><path class=\"iso-top\" d=\"M474.3 134.1L474.9 134.6L474.9 135.2L474.3 135.7L469.3 138.3L468.2 138.6L467 138.6L465.9 138.3L458.1 134.4L457.5 133.8L457.5 133.2L458.1 132.7L463.2 130.2L464.2 129.9L465.4 129.9L466.5 130.2Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M474.9 135.2L474.3 135.7L469.3 138.3L468.2 138.6L467 138.6L465.9 138.3L458.1 134.4L457.5 133.8\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M474.9 135.2L473.8 135.6L468.9 138L468.1 138.3L467.1 138.3L466.3 138L458.6 134.2L457.5 133.8\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M457.5 133.8L457.5 133.2L458.1 132.7L463.2 130.2L464.2 129.9L465.4 129.9L466.5 130.2L474.3 134.1L474.9 134.6L474.9 135.2M474.9 137.9L474.3 138.5L469.3 141L468.2 141.3L467 141.3L465.9 141L458.1 137.1L457.5 136.6M474.9 135.2L474.9 137.9M457.5 133.8L457.5 136.6\"/></g></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M462.2 162.9L463.2 162.1L516.6 135.4L518.2 135L520 135L521.6 135.4L541.7 145.4L542.6 146.2L542.6 165.9L541.7 166.7L488.2 193.4L486.6 193.9L484.8 193.9L483.2 193.4L463.2 183.4L462.2 182.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M542.6 165.9L541.7 166.7L541.7 147.9L542.6 147.2ZM541.7 166.7L488.2 193.4L488.2 174.7L541.7 147.9ZM488.2 193.4L486.6 193.9L486.6 175.1L488.2 174.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M486.6 193.9L484.8 193.9L484.8 175.1L486.6 175.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M484.8 193.9L483.2 193.4L483.2 174.7L484.8 175.1ZM483.2 193.4L463.2 183.4L463.2 164.7L483.2 174.7ZM463.2 183.4L462.2 182.6L462.2 163.9L463.2 164.7Z\"/><path class=\"iso-top\" d=\"M541.7 145.4L542.6 146.2L542.6 147.2L541.7 147.9L488.2 174.7L486.6 175.1L484.8 175.1L483.2 174.7L463.2 164.7L462.2 163.9L462.2 162.9L463.2 162.1L516.6 135.4L518.2 135L520 135L521.6 135.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M542.6 147.2L541.7 147.9L488.2 174.7L486.6 175.1L484.8 175.1L483.2 174.7L463.2 164.7L462.2 163.9\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M542.6 147.2L541.1 147.7L487.7 174.4L486.4 174.8L485 174.8L483.7 174.4L463.8 164.4L462.2 163.9\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M542.6 152.3L541.7 153.1L488.2 179.8L486.6 180.3L484.8 180.3L483.2 179.8L463.2 169.8L462.2 169\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M462.2 163.9L462.2 162.9L463.2 162.1L516.6 135.4L518.2 135L520 135L521.6 135.4L541.7 145.4L542.6 146.2L542.6 147.2M542.6 165.9L541.7 166.7L488.2 193.4L486.6 193.9L484.8 193.9L483.2 193.4L463.2 183.4L462.2 182.6M542.6 147.2L542.6 165.9M462.2 163.9L462.2 182.6\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M523 144.7L523.8 145.3L524.1 146L523.8 146.7L523 147.2L486.8 165.4L485.7 165.7L484.3 165.9L483 165.7L481.8 165.4L481.8 165.4L481 164.8L480.8 164.1L481 163.4L481.8 162.8L518 144.7L519.2 144.4L520.5 144.2L521.9 144.4L523 144.7Z\"/><g data-part=\"pip-1\"><g class=\"iso-solid\" data-lit=\"\"><path class=\"iso-fill\" d=\"M493.7 151.3L494.3 150.8L499.4 148.3L500.4 148L501.6 148L502.7 148.3L510.5 152.2L511.1 152.7L511.1 156L510.5 156.6L505.5 159.1L504.4 159.4L503.2 159.4L502.1 159.1L494.3 155.2L493.7 154.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M511.1 156L510.5 156.6L510.5 153.9L511.1 153.3ZM510.5 156.6L505.5 159.1L505.5 156.4L510.5 153.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M505.5 159.1L504.4 159.4L504.4 156.7L505.5 156.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M504.4 159.4L503.2 159.4L503.2 156.7L504.4 156.7ZM503.2 159.4L502.1 159.1L502.1 156.4L503.2 156.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M502.1 159.1L494.3 155.2L494.3 152.5L502.1 156.4ZM494.3 155.2L493.7 154.7L493.7 151.9L494.3 152.5Z\"/><path class=\"iso-top\" d=\"M510.5 152.2L511.1 152.7L511.1 153.3L510.5 153.9L505.5 156.4L504.4 156.7L503.2 156.7L502.1 156.4L494.3 152.5L493.7 151.9L493.7 151.3L494.3 150.8L499.4 148.3L500.4 148L501.6 148L502.7 148.3Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M511.1 153.3L510.5 153.9L505.5 156.4L504.4 156.7L503.2 156.7L502.1 156.4L494.3 152.5L493.7 151.9\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M511.1 153.3L510 153.7L505.1 156.1L504.3 156.4L503.4 156.4L502.5 156.1L494.8 152.3L493.7 151.9\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M493.7 151.9L493.7 151.3L494.3 150.8L499.4 148.3L500.4 148L501.6 148L502.7 148.3L510.5 152.2L511.1 152.7L511.1 153.3M511.1 156L510.5 156.6L505.5 159.1L504.4 159.4L503.2 159.4L502.1 159.1L494.3 155.2L493.7 154.7M511.1 153.3L511.1 156M493.7 151.9L493.7 154.7\"/></g></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M498.4 181L499.4 180.3L552.8 153.5L554.4 153.1L556.3 153.1L557.8 153.5L577.9 163.5L578.8 164.3L578.8 184L577.9 184.8L524.4 211.5L522.8 212L521 212L519.4 211.5L499.4 201.5L498.4 200.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M578.8 184L577.9 184.8L577.9 166L578.8 165.3ZM577.9 184.8L524.4 211.5L524.4 192.8L577.9 166ZM524.4 211.5L522.8 212L522.8 193.2L524.4 192.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M522.8 212L521 212L521 193.2L522.8 193.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M521 212L519.4 211.5L519.4 192.8L521 193.2ZM519.4 211.5L499.4 201.5L499.4 182.8L519.4 192.8ZM499.4 201.5L498.4 200.7L498.4 182L499.4 182.8Z\"/><path class=\"iso-top\" d=\"M577.9 163.5L578.8 164.3L578.8 165.3L577.9 166L524.4 192.8L522.8 193.2L521 193.2L519.4 192.8L499.4 182.8L498.4 182L498.4 181L499.4 180.3L552.8 153.5L554.4 153.1L556.3 153.1L557.8 153.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M578.8 165.3L577.9 166L524.4 192.8L522.8 193.2L521 193.2L519.4 192.8L499.4 182.8L498.4 182\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M578.8 165.3L577.3 165.8L523.9 192.5L522.6 192.9L521.2 192.9L519.9 192.5L500 182.5L498.4 182\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M578.8 170.4L577.9 171.2L524.4 197.9L522.8 198.4L521 198.4L519.4 197.9L499.4 187.9L498.4 187.1\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M498.4 182L498.4 181L499.4 180.3L552.8 153.5L554.4 153.1L556.3 153.1L557.8 153.5L577.9 163.5L578.8 164.3L578.8 165.3M578.8 184L577.9 184.8L524.4 211.5L522.8 212L521 212L519.4 211.5L499.4 201.5L498.4 200.7M578.8 165.3L578.8 184M498.4 182L498.4 200.7\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M559.2 162.8L560 163.4L560.3 164.1L560 164.8L559.2 165.4L523 183.5L521.9 183.8L520.5 184L519.2 183.8L518 183.5L518 183.5L517.2 182.9L517 182.2L517.2 181.5L518 180.9L554.2 162.8L555.4 162.5L556.7 162.3L558.1 162.5L559.2 162.8Z\"/><g data-part=\"pip-2\"><g class=\"iso-solid\" data-lit=\"\"><path class=\"iso-fill\" d=\"M529.9 169.4L530.5 168.9L535.6 166.4L536.6 166.1L537.8 166.1L538.9 166.4L546.7 170.3L547.3 170.8L547.3 174.2L546.7 174.7L541.7 177.2L540.6 177.5L539.4 177.5L538.3 177.2L530.5 173.3L529.9 172.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M547.3 174.2L546.7 174.7L546.7 172L547.3 171.4ZM546.7 174.7L541.7 177.2L541.7 174.5L546.7 172Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M541.7 177.2L540.6 177.5L540.6 174.8L541.7 174.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M540.6 177.5L539.4 177.5L539.4 174.8L540.6 174.8ZM539.4 177.5L538.3 177.2L538.3 174.5L539.4 174.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M538.3 177.2L530.5 173.3L530.5 170.6L538.3 174.5ZM530.5 173.3L529.9 172.8L529.9 170L530.5 170.6Z\"/><path class=\"iso-top\" d=\"M546.7 170.3L547.3 170.8L547.3 171.4L546.7 172L541.7 174.5L540.6 174.8L539.4 174.8L538.3 174.5L530.5 170.6L529.9 170L529.9 169.4L530.5 168.9L535.6 166.4L536.6 166.1L537.8 166.1L538.9 166.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M547.3 171.4L546.7 172L541.7 174.5L540.6 174.8L539.4 174.8L538.3 174.5L530.5 170.6L529.9 170\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M547.3 171.4L546.2 171.8L541.3 174.2L540.5 174.5L539.6 174.5L538.7 174.2L531 170.4L529.9 170\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M529.9 170L529.9 169.4L530.5 168.9L535.6 166.4L536.6 166.1L537.8 166.1L538.9 166.4L546.7 170.3L547.3 170.8L547.3 171.4M547.3 174.2L546.7 174.7L541.7 177.2L540.6 177.5L539.4 177.5L538.3 177.2L530.5 173.3L529.9 172.8M547.3 171.4L547.3 174.2M529.9 170L529.9 172.8\"/></g></g><g class=\"iso-solid\" data-lit=\"\"><path class=\"iso-fill\" d=\"M350.6 170.1L351.3 169.4L370.8 159.7L372.2 159.3L373.7 159.3L375 159.7L404.2 174.3L405 175L405 179.1L404.2 179.8L384.8 189.6L383.4 189.9L381.9 189.9L380.6 189.6L351.3 174.9L350.6 174.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M405 179.1L404.2 179.8L404.2 176.4L405 175.7ZM404.2 179.8L384.8 189.6L384.8 186.1L404.2 176.4ZM384.8 189.6L383.4 189.9L383.4 186.5L384.8 186.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M383.4 189.9L381.9 189.9L381.9 186.5L383.4 186.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M381.9 189.9L380.6 189.6L380.6 186.1L381.9 186.5ZM380.6 189.6L351.3 174.9L351.3 171.5L380.6 186.1ZM351.3 174.9L350.6 174.3L350.6 170.9L351.3 171.5Z\"/><path class=\"iso-top\" d=\"M404.2 174.3L405 175L405 175.7L404.2 176.4L384.8 186.1L383.4 186.5L381.9 186.5L380.6 186.1L351.3 171.5L350.6 170.9L350.6 170.1L351.3 169.4L370.8 159.7L372.2 159.3L373.7 159.3L375 159.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M405 175.7L404.2 176.4L384.8 186.1L383.4 186.5L381.9 186.5L380.6 186.1L351.3 171.5L350.6 170.9\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M405 175.7L403.6 176.2L384.3 185.8L383.2 186.2L382.1 186.2L381.1 185.8L352 171.3L350.6 170.9\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M350.6 170.9L350.6 170.1L351.3 169.4L370.8 159.7L372.2 159.3L373.7 159.3L375 159.7L404.2 174.3L405 175L405 175.7M405 179.1L404.2 179.8L384.8 189.6L383.4 189.9L381.9 189.9L380.6 189.6L351.3 174.9L350.6 174.3M405 175.7L405 179.1M350.6 170.9L350.6 174.3\"/></g><path class=\"iso-line\" data-tone=\"lit\" data-free=\"\" d=\"M383.4 170.1L372.2 175.7\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M392.3 188.6L393.1 187.9L412.6 178.2L413.9 177.8L415.5 177.8L416.8 178.2L446 192.8L446.8 193.5L446.8 200L446 200.7L426.5 210.4L425.2 210.8L423.7 210.8L422.4 210.4L393.1 195.8L392.3 195.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M446.8 200L446 200.7L446 194.9L446.8 194.2ZM446 200.7L426.5 210.4L426.5 204.6L446 194.9ZM426.5 210.4L425.2 210.8L425.2 205L426.5 204.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M425.2 210.8L423.7 210.8L423.7 205L425.2 205Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M423.7 210.8L422.4 210.4L422.4 204.6L423.7 205ZM422.4 210.4L393.1 195.8L393.1 190L422.4 204.6ZM393.1 195.8L392.3 195.2L392.3 189.4L393.1 190Z\"/><path class=\"iso-top\" d=\"M446 192.8L446.8 193.5L446.8 194.2L446 194.9L426.5 204.6L425.2 205L423.7 205L422.4 204.6L393.1 190L392.3 189.4L392.3 188.6L393.1 187.9L412.6 178.2L413.9 177.8L415.5 177.8L416.8 178.2Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M446.8 194.2L446 194.9L426.5 204.6L425.2 205L423.7 205L422.4 204.6L393.1 190L392.3 189.4\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M446.8 194.2L445.4 194.7L426 204.3L425 204.7L423.9 204.7L422.8 204.3L393.7 189.8L392.3 189.4\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M392.3 189.4L392.3 188.6L393.1 187.9L412.6 178.2L413.9 177.8L415.5 177.8L416.8 178.2L446 192.8L446.8 193.5L446.8 194.2M446.8 200L446 200.7L426.5 210.4L425.2 210.8L423.7 210.8L422.4 210.4L393.1 195.8L392.3 195.2M446.8 194.2L446.8 200M392.3 189.4L392.3 195.2\"/></g><path class=\"iso-line\" data-tone=\"mid\" data-free=\"\" d=\"M422.4 187.2L411.2 192.8M427.9 190L416.8 195.6\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M434.1 209.5L434.9 208.8L454.4 199.1L455.7 198.7L457.2 198.7L458.6 199.1L487.8 213.7L488.6 214.4L488.6 220.9L487.8 221.6L468.3 231.3L467 231.7L465.5 231.7L464.1 231.3L434.9 216.7L434.1 216.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M488.6 220.9L487.8 221.6L487.8 215.8L488.6 215.1ZM487.8 221.6L468.3 231.3L468.3 225.5L487.8 215.8ZM468.3 231.3L467 231.7L467 225.9L468.3 225.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M467 231.7L465.5 231.7L465.5 225.9L467 225.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M465.5 231.7L464.1 231.3L464.1 225.5L465.5 225.9ZM464.1 231.3L434.9 216.7L434.9 210.9L464.1 225.5ZM434.9 216.7L434.1 216.1L434.1 210.3L434.9 210.9Z\"/><path class=\"iso-top\" d=\"M487.8 213.7L488.6 214.4L488.6 215.1L487.8 215.8L468.3 225.5L467 225.9L465.5 225.9L464.1 225.5L434.9 210.9L434.1 210.3L434.1 209.5L434.9 208.8L454.4 199.1L455.7 198.7L457.2 198.7L458.6 199.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M488.6 215.1L487.8 215.8L468.3 225.5L467 225.9L465.5 225.9L464.1 225.5L434.9 210.9L434.1 210.3\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M488.6 215.1L487.2 215.5L467.8 225.2L466.8 225.5L465.7 225.5L464.6 225.2L435.5 210.7L434.1 210.3\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M434.1 210.3L434.1 209.5L434.9 208.8L454.4 199.1L455.7 198.7L457.2 198.7L458.6 199.1L487.8 213.7L488.6 214.4L488.6 215.1M488.6 220.9L487.8 221.6L468.3 231.3L467 231.7L465.5 231.7L464.1 231.3L434.9 216.7L434.1 216.1M488.6 215.1L488.6 220.9M434.1 210.3L434.1 216.1\"/></g><path class=\"iso-line\" data-tone=\"mid\" data-free=\"\" d=\"M461.3 206.7L450.2 212.3M466.9 209.5L455.8 215.1M472.5 212.3L461.3 217.9\"/><path class=\"iso-line\" data-tone=\"lo\" d=\"M212.8 182.2L207.9 184.4L202.5 186.1L196.6 187.5L190.4 188.4L184 188.8L177.5 188.8L171.1 188.4L164.9 187.5L159 186.1L153.6 184.4L148.7 182.2L144.5 179.8L141 177.1L138.3 174.1L136.5 171L135.6 167.9L135.6 164.6L136.5 161.4L138.3 158.3L141 155.4L144.5 152.7L148.7 150.2L153.6 148.1L159 146.4L164.9 145L171.1 144.1L177.5 143.6L184 143.6L190.4 144.1L196.6 145L202.5 146.4L207.9 148.1L212.8 150.2L217 152.7L220.5 155.4L223.2 158.3L225 161.4L225.9 164.6L225.9 167.9L225 171L223.2 174.1L220.5 177.1L217 179.8Z\"/><path class=\"iso-line\" data-tone=\"lo\" d=\"M217.6 155.6L220 154.9M221.8 160.7L224.5 160.4M223.3 166.2L226 166.2M221.8 171.7L224.5 172.1M217.6 176.9L220 177.6M202 184.7L203.4 185.8M191.8 186.8L192.5 188.1M180.7 187.5L180.7 188.9M169.7 186.8L169 188.1M159.5 184.7L158.1 185.8M143.9 176.9L141.5 177.6M139.7 171.7L137 172.1M138.2 166.2L135.5 166.2M139.7 160.7L137 160.4M143.9 155.6L141.5 154.9M159.5 147.8L158.1 146.6M169.7 145.7L169 144.4M180.7 145L180.7 143.6M191.8 145.7L192.5 144.4M202 147.8L203.4 146.6\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M208.9 152.2L212.8 150.2M208.9 180.3L212.8 182.2M152.6 180.3L148.7 182.2M152.6 152.2L148.7 150.2\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M143.4 162.2L144.2 159.5L145.7 157L147.9 154.5L150.8 152.3L154.3 150.3L158.3 148.5L162.8 147.1L167.7 146L172.8 145.2L178.1 144.8L183.4 144.8L188.7 145.2L193.8 146L198.7 147.1L203.2 148.5L207.2 150.3L210.7 152.3L213.6 154.5L215.8 157L217.3 159.5L218.1 162.2L218.1 167.6L217.3 170.2L215.8 172.8L213.6 175.2L210.7 177.4L207.2 179.5L203.2 181.2L198.7 182.7L193.8 183.8L188.7 184.5L183.4 184.9L178.1 184.9L172.8 184.5L167.7 183.8L162.8 182.7L158.3 181.2L154.3 179.5L150.8 177.4L147.9 175.2L145.7 172.8L144.2 170.2L143.4 167.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M207.2 179.5L203.2 181.2L203.2 178.5L207.2 176.7ZM203.2 181.2L198.7 182.7L198.7 179.9L203.2 178.5ZM218.1 167.6L217.3 170.2L217.3 167.5L218.1 164.8ZM217.3 170.2L215.8 172.8L215.8 170L217.3 167.5ZM215.8 172.8L213.6 175.2L213.6 172.5L215.8 170ZM213.6 175.2L210.7 177.4L210.7 174.7L213.6 172.5ZM210.7 177.4L207.2 179.5L207.2 176.7L210.7 174.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M198.7 182.7L193.8 183.8L193.8 181L198.7 179.9ZM193.8 183.8L188.7 184.5L188.7 181.8L193.8 181ZM188.7 184.5L183.4 184.9L183.4 182.2L188.7 181.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M183.4 184.9L178.1 184.9L178.1 182.2L183.4 182.2ZM178.1 184.9L172.8 184.5L172.8 181.8L178.1 182.2ZM172.8 184.5L167.7 183.8L167.7 181L172.8 181.8ZM167.7 183.8L162.8 182.7L162.8 179.9L167.7 181Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M162.8 182.7L158.3 181.2L158.3 178.5L162.8 179.9ZM158.3 181.2L154.3 179.5L154.3 176.7L158.3 178.5ZM154.3 179.5L150.8 177.4L150.8 174.7L154.3 176.7ZM150.8 177.4L147.9 175.2L147.9 172.5L150.8 174.7ZM147.9 175.2L145.7 172.8L145.7 170L147.9 172.5ZM145.7 172.8L144.2 170.2L144.2 167.5L145.7 170ZM144.2 170.2L143.4 167.6L143.4 164.8L144.2 167.5Z\"/><path class=\"iso-top\" d=\"M207.2 176.7L203.2 178.5L198.7 179.9L193.8 181L188.7 181.8L183.4 182.2L178.1 182.2L172.8 181.8L167.7 181L162.8 179.9L158.3 178.5L154.3 176.7L150.8 174.7L147.9 172.5L145.7 170L144.2 167.5L143.4 164.8L143.4 162.2L144.2 159.5L145.7 157L147.9 154.5L150.8 152.3L154.3 150.3L158.3 148.5L162.8 147.1L167.7 146L172.8 145.2L178.1 144.8L183.4 144.8L188.7 145.2L193.8 146L198.7 147.1L203.2 148.5L207.2 150.3L210.7 152.3L213.6 154.5L215.8 157L217.3 159.5L218.1 162.2L218.1 164.8L217.3 167.5L215.8 170L213.6 172.5L210.7 174.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M218.1 164.8L217.3 167.5L215.8 170L213.6 172.5L210.7 174.7L207.2 176.7L203.2 178.5L198.7 179.9L193.8 181L188.7 181.8L183.4 182.2L178.1 182.2L172.8 181.8L167.7 181L162.8 179.9L158.3 178.5L154.3 176.7L150.8 174.7L147.9 172.5L145.7 170L144.2 167.5L143.4 164.8\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M143.4 164.8L143.4 162.2L144.2 159.5L145.7 157L147.9 154.5L150.8 152.3L154.3 150.3L158.3 148.5L162.8 147.1L167.7 146L172.8 145.2L178.1 144.8L183.4 144.8L188.7 145.2L193.8 146L198.7 147.1L203.2 148.5L207.2 150.3L210.7 152.3L213.6 154.5L215.8 157L217.3 159.5L218.1 162.2L218.1 164.8M218.1 167.6L217.3 170.2L215.8 172.8L213.6 175.2L210.7 177.4L207.2 179.5L203.2 181.2L198.7 182.7L193.8 183.8L188.7 184.5L183.4 184.9L178.1 184.9L172.8 184.5L167.7 183.8L162.8 182.7L158.3 181.2L154.3 179.5L150.8 177.4L147.9 175.2L145.7 172.8L144.2 170.2L143.4 167.6M143.4 164.8L143.4 167.6M218.1 164.8L218.1 167.6\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M147.3 152.6L147.6 150.4L148.4 148.3L149.8 146.2L151.8 144.2L154.2 142.4L157.1 140.8L160.4 139.3L164 138.1L167.9 137.1L172.1 136.4L176.4 136L180.7 135.9L185.1 136L189.4 136.4L193.6 137.1L197.5 138.1L201.1 139.3L204.4 140.8L207.3 142.4L209.7 144.2L211.7 146.2L213.1 148.3L213.9 150.4L214.2 152.6L214.2 163.5L213.9 165.7L213.1 167.8L211.7 169.9L209.7 171.9L207.3 173.7L204.4 175.3L201.1 176.8L197.5 178L193.6 179L189.4 179.7L185.1 180.1L180.7 180.2L176.4 180.1L172.1 179.7L167.9 179L164 178L160.4 176.8L157.1 175.3L154.2 173.7L151.8 171.9L149.8 169.9L148.4 167.8L147.6 165.7L147.3 163.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M204.4 175.3L201.1 176.8L201.1 165.9L204.4 164.4ZM201.1 176.8L197.5 178L197.5 167.1L201.1 165.9ZM214.2 163.5L213.9 165.7L213.9 154.8L214.2 152.6ZM213.9 165.7L213.1 167.8L213.1 156.9L213.9 154.8ZM213.1 167.8L211.7 169.9L211.7 159L213.1 156.9ZM211.7 169.9L209.7 171.9L209.7 161L211.7 159ZM209.7 171.9L207.3 173.7L207.3 162.8L209.7 161ZM207.3 173.7L204.4 175.3L204.4 164.4L207.3 162.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M197.5 178L193.6 179L193.6 168.1L197.5 167.1ZM193.6 179L189.4 179.7L189.4 168.8L193.6 168.1ZM189.4 179.7L185.1 180.1L185.1 169.2L189.4 168.8ZM185.1 180.1L180.7 180.2L180.7 169.3L185.1 169.2Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M180.7 180.2L176.4 180.1L176.4 169.2L180.7 169.3ZM176.4 180.1L172.1 179.7L172.1 168.8L176.4 169.2ZM172.1 179.7L167.9 179L167.9 168.1L172.1 168.8ZM167.9 179L164 178L164 167.1L167.9 168.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M164 178L160.4 176.8L160.4 165.9L164 167.1ZM160.4 176.8L157.1 175.3L157.1 164.4L160.4 165.9ZM157.1 175.3L154.2 173.7L154.2 162.8L157.1 164.4ZM154.2 173.7L151.8 171.9L151.8 161L154.2 162.8ZM151.8 171.9L149.8 169.9L149.8 159L151.8 161ZM149.8 169.9L148.4 167.8L148.4 156.9L149.8 159ZM148.4 167.8L147.6 165.7L147.6 154.8L148.4 156.9ZM147.6 165.7L147.3 163.5L147.3 152.6L147.6 154.8Z\"/><path class=\"iso-top\" d=\"M204.4 164.4L201.1 165.9L197.5 167.1L193.6 168.1L189.4 168.8L185.1 169.2L180.7 169.3L176.4 169.2L172.1 168.8L167.9 168.1L164 167.1L160.4 165.9L157.1 164.4L154.2 162.8L151.8 161L149.8 159L148.4 156.9L147.6 154.8L147.3 152.6L147.6 150.4L148.4 148.3L149.8 146.2L151.8 144.2L154.2 142.4L157.1 140.8L160.4 139.3L164 138.1L167.9 137.1L172.1 136.4L176.4 136L180.7 135.9L185.1 136L189.4 136.4L193.6 137.1L197.5 138.1L201.1 139.3L204.4 140.8L207.3 142.4L209.7 144.2L211.7 146.2L213.1 148.3L213.9 150.4L214.2 152.6L213.9 154.8L213.1 156.9L211.7 159L209.7 161L207.3 162.8Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M214.2 152.6L213.9 154.8L213.1 156.9L211.7 159L209.7 161L207.3 162.8L204.4 164.4L201.1 165.9L197.5 167.1L193.6 168.1L189.4 168.8L185.1 169.2L180.7 169.3L176.4 169.2L172.1 168.8L167.9 168.1L164 167.1L160.4 165.9L157.1 164.4L154.2 162.8L151.8 161L149.8 159L148.4 156.9L147.6 154.8L147.3 152.6\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M214.2 152.6L213 154.7L212.1 156.8L210.8 158.8L208.9 160.7L206.5 162.5L203.7 164.1L200.5 165.5L197 166.7L193.2 167.6L189.2 168.3L185 168.7L180.7 168.8L176.5 168.7L172.3 168.3L168.3 167.6L164.5 166.7L161 165.5L157.8 164.1L155 162.5L152.6 160.7L150.7 158.8L149.4 156.8L148.5 154.7L147.3 152.6\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M147.3 152.6L147.6 150.4L148.4 148.3L149.8 146.2L151.8 144.2L154.2 142.4L157.1 140.8L160.4 139.3L164 138.1L167.9 137.1L172.1 136.4L176.4 136L180.7 135.9L185.1 136L189.4 136.4L193.6 137.1L197.5 138.1L201.1 139.3L204.4 140.8L207.3 142.4L209.7 144.2L211.7 146.2L213.1 148.3L213.9 150.4L214.2 152.6M214.2 163.5L213.9 165.7L213.1 167.8L211.7 169.9L209.7 171.9L207.3 173.7L204.4 175.3L201.1 176.8L197.5 178L193.6 179L189.4 179.7L185.1 180.1L180.7 180.2L176.4 180.1L172.1 179.7L167.9 179L164 178L160.4 176.8L157.1 175.3L154.2 173.7L151.8 171.9L149.8 169.9L148.4 167.8L147.6 165.7L147.3 163.5M147.3 152.6L147.3 163.5M214.2 152.6L214.2 163.5\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M204.4 174.7L204.4 165.1M199 176.9L199 167.3M192.7 178.5L192.7 168.9M186 179.4L186 169.8M179 179.5L179 170M172.1 179L172.1 169.4M165.5 177.7L165.5 168.2M159.7 175.8L159.7 166.3M154.7 173.4L154.7 163.8M150.9 170.4L150.9 160.9M148.4 167.2L148.4 157.6M213.8 165.4L213.8 155.9M212 168.8L212 159.3M208.8 171.9L208.8 162.4\"/><path data-part=\"wedge-0\" d=\"M180.7 152.5L180.7 169.2L177.8 169.2L174.9 169.0L172.1 168.7L169.3 168.2L166.6 167.7L164.0 167.0L161.5 166.2L159.2 165.3L157.1 164.3L155.1 163.3L153.3 162.1L151.8 160.9L150.4 159.6L149.3 158.2L148.4 156.8L147.8 155.4L147.4 154.0L147.3 152.5L147.4 151.0L147.8 149.6L148.4 148.2L149.3 146.8L150.4 145.4L151.8 144.1L153.3 142.9L155.1 141.7L157.1 140.7L159.2 139.7L161.5 138.8L164.0 138.0L166.6 137.3L169.3 136.8L172.1 136.3L174.9 136.0L177.8 135.8L180.7 135.8Z\" style=\"fill:var(--anatomy-lit);opacity:.2;stroke:none\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M180.7 135.8L185.1 135.9L189.4 136.3L193.6 137.0L197.5 138.0L201.1 139.2L204.4 140.7L207.3 142.3L209.7 144.1L211.7 146.1L213.1 148.2L213.9 150.3L214.2 152.5L213.9 154.7L213.1 156.8L211.7 158.9L209.7 160.9L207.3 162.7L204.4 164.3L201.1 165.8L197.5 167.0L193.6 168.0L189.4 168.7L185.1 169.1L180.7 169.2L176.4 169.1L172.1 168.7L167.9 168.0L164.0 167.0L160.4 165.8L157.1 164.3L154.2 162.7L151.8 160.9L149.8 158.9L148.4 156.8L147.6 154.7L147.3 152.5L147.6 150.3L148.4 148.2L149.8 146.1L151.8 144.1L154.2 142.3L157.1 140.7L160.4 139.2L164.0 138.0L167.9 137.0L172.1 136.3L176.4 135.9Z\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M180.7 137.4L186.5 145.5L202.1 141.9L194.7 149.6L210.9 152.5L194.7 155.4L202.1 163.2L186.5 159.5L180.7 167.6L175.0 159.5L159.4 163.2L166.8 155.4L150.6 152.5L166.8 149.6L159.4 141.9L175.0 145.5ZM180.7 152.5L180.7 137.4M180.7 152.5L202.1 141.9M180.7 152.5L210.9 152.5M180.7 152.5L202.1 163.2M180.7 152.5L180.7 167.6M180.7 152.5L159.4 163.2M180.7 152.5L150.6 152.5M180.7 152.5L159.4 141.9\"/><path data-part=\"needle-0\" class=\"iso-line\" data-tone=\"lit\" data-free=\"end\" d=\"M180.7 152.5L180.7 137.4\" style=\"stroke-width:1.1\"/><path class=\"iso-line\" data-tone=\"lo\" d=\"M299.1 225.4L294.2 227.5L288.8 229.3L282.9 230.6L276.7 231.5L270.3 232L263.9 232L257.5 231.5L251.3 230.6L245.4 229.3L239.9 227.5L235.1 225.4L230.8 223L227.3 220.3L224.6 217.3L222.8 214.2L221.9 211L221.9 207.8L222.8 204.6L224.6 201.5L227.3 198.5L230.8 195.8L235.1 193.4L239.9 191.3L245.4 189.5L251.3 188.2L257.5 187.3L263.9 186.8L270.3 186.8L276.7 187.3L282.9 188.2L288.8 189.5L294.2 191.3L299.1 193.4L303.3 195.8L306.8 198.5L309.5 201.5L311.3 204.6L312.3 207.8L312.3 211L311.3 214.2L309.5 217.3L306.8 220.3L303.3 223Z\"/><path class=\"iso-line\" data-tone=\"lo\" d=\"M303.9 198.8L306.3 198.1M308.2 203.9L310.8 203.5M309.6 209.4L312.4 209.4M308.2 214.9L310.8 215.3M303.9 220L306.3 220.7M288.4 227.8L289.7 229M278.1 229.9L278.8 231.3M267.1 230.7L267.1 232.1M256.1 229.9L255.4 231.3M245.8 227.8L244.4 229M230.2 220L227.9 220.7M226 214.9L223.3 215.3M224.5 209.4L221.8 209.4M226 203.9L223.3 203.5M230.2 198.8L227.9 198.1M245.8 191L244.4 189.8M256.1 188.9L255.4 187.5M267.1 188.1L267.1 186.8M278.1 188.9L278.8 187.5M288.4 191L289.7 189.8\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M295.2 195.3L299.1 193.4M295.2 223.5L299.1 225.4M239 223.5L235.1 225.4M239 195.3L235.1 193.4\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M229.8 208L229.8 205.3L230.5 202.7L232 200.1L234.2 197.7L237.1 195.5L240.6 193.4L244.7 191.7L249.2 190.3L254 189.1L259.1 188.4L264.4 188L269.8 188L275 188.4L280.2 189.1L285 190.3L289.5 191.7L293.5 193.4L297 195.5L299.9 197.7L302.1 200.1L303.6 202.7L304.4 205.3L304.4 210.7L303.6 213.4L302.1 215.9L299.9 218.4L297 220.6L293.5 222.6L289.5 224.4L285 225.8L280.2 226.9L275 227.7L269.8 228.1L264.4 228.1L259.1 227.7L254 226.9L249.2 225.8L244.7 224.4L240.6 222.6L237.1 220.6L234.2 218.4L232 215.9L230.5 213.4L229.8 210.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M293.5 222.6L289.5 224.4L289.5 221.7L293.5 219.9ZM289.5 224.4L285 225.8L285 223.1L289.5 221.7ZM304.4 210.7L303.6 213.4L303.6 210.7L304.4 208ZM303.6 213.4L302.1 215.9L302.1 213.2L303.6 210.7ZM302.1 215.9L299.9 218.4L299.9 215.6L302.1 213.2ZM299.9 218.4L297 220.6L297 217.9L299.9 215.6ZM297 220.6L293.5 222.6L293.5 219.9L297 217.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M285 225.8L280.2 226.9L280.2 224.2L285 223.1ZM280.2 226.9L275 227.7L275 225L280.2 224.2ZM275 227.7L269.8 228.1L269.8 225.3L275 225Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M269.8 228.1L264.4 228.1L264.4 225.3L269.8 225.3ZM264.4 228.1L259.1 227.7L259.1 225L264.4 225.3ZM259.1 227.7L254 226.9L254 224.2L259.1 225ZM254 226.9L249.2 225.8L249.2 223.1L254 224.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M249.2 225.8L244.7 224.4L244.7 221.7L249.2 223.1ZM244.7 224.4L240.6 222.6L240.6 219.9L244.7 221.7ZM240.6 222.6L237.1 220.6L237.1 217.9L240.6 219.9ZM237.1 220.6L234.2 218.4L234.2 215.6L237.1 217.9ZM234.2 218.4L232 215.9L232 213.2L234.2 215.6ZM232 215.9L230.5 213.4L230.5 210.7L232 213.2ZM230.5 213.4L229.8 210.7L229.8 208L230.5 210.7Z\"/><path class=\"iso-top\" d=\"M293.5 219.9L289.5 221.7L285 223.1L280.2 224.2L275 225L269.8 225.3L264.4 225.3L259.1 225L254 224.2L249.2 223.1L244.7 221.7L240.6 219.9L237.1 217.9L234.2 215.6L232 213.2L230.5 210.7L229.8 208L229.8 205.3L230.5 202.7L232 200.1L234.2 197.7L237.1 195.5L240.6 193.4L244.7 191.7L249.2 190.3L254 189.1L259.1 188.4L264.4 188L269.8 188L275 188.4L280.2 189.1L285 190.3L289.5 191.7L293.5 193.4L297 195.5L299.9 197.7L302.1 200.1L303.6 202.7L304.4 205.3L304.4 208L303.6 210.7L302.1 213.2L299.9 215.6L297 217.9Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M304.4 208L303.6 210.7L302.1 213.2L299.9 215.6L297 217.9L293.5 219.9L289.5 221.7L285 223.1L280.2 224.2L275 225L269.8 225.3L264.4 225.3L259.1 225L254 224.2L249.2 223.1L244.7 221.7L240.6 219.9L237.1 217.9L234.2 215.6L232 213.2L230.5 210.7L229.8 208\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M229.8 208L229.8 205.3L230.5 202.7L232 200.1L234.2 197.7L237.1 195.5L240.6 193.4L244.7 191.7L249.2 190.3L254 189.1L259.1 188.4L264.4 188L269.8 188L275 188.4L280.2 189.1L285 190.3L289.5 191.7L293.5 193.4L297 195.5L299.9 197.7L302.1 200.1L303.6 202.7L304.4 205.3L304.4 208M304.4 210.7L303.6 213.4L302.1 215.9L299.9 218.4L297 220.6L293.5 222.6L289.5 224.4L285 225.8L280.2 226.9L275 227.7L269.8 228.1L264.4 228.1L259.1 227.7L254 226.9L249.2 225.8L244.7 224.4L240.6 222.6L237.1 220.6L234.2 218.4L232 215.9L230.5 213.4L229.8 210.7M229.8 208L229.8 210.7M304.4 208L304.4 210.7\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M233.6 195.8L233.9 193.6L234.7 191.4L236.2 189.4L238.1 187.4L240.5 185.6L243.4 183.9L246.7 182.5L250.3 181.3L254.3 180.3L258.4 179.6L262.7 179.2L267.1 179L271.5 179.2L275.7 179.6L279.9 180.3L283.8 181.3L287.5 182.5L290.8 183.9L293.6 185.6L296.1 187.4L298 189.4L299.4 191.4L300.3 193.6L300.6 195.8L300.6 206.7L300.3 208.9L299.4 211L298 213.1L296.1 215L293.6 216.9L290.8 218.5L287.5 220L283.8 221.2L279.9 222.1L275.7 222.8L271.5 223.3L267.1 223.4L262.7 223.3L258.4 222.8L254.3 222.1L250.3 221.2L246.7 220L243.4 218.5L240.5 216.9L238.1 215L236.2 213.1L234.7 211L233.9 208.9L233.6 206.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M290.8 218.5L287.5 220L287.5 209L290.8 207.6ZM287.5 220L283.8 221.2L283.8 210.3L287.5 209ZM300.6 206.7L300.3 208.9L300.3 197.9L300.6 195.8ZM300.3 208.9L299.4 211L299.4 200.1L300.3 197.9ZM299.4 211L298 213.1L298 202.2L299.4 200.1ZM298 213.1L296.1 215L296.1 204.1L298 202.2ZM296.1 215L293.6 216.9L293.6 205.9L296.1 204.1ZM293.6 216.9L290.8 218.5L290.8 207.6L293.6 205.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M283.8 221.2L279.9 222.1L279.9 211.2L283.8 210.3ZM279.9 222.1L275.7 222.8L275.7 211.9L279.9 211.2ZM275.7 222.8L271.5 223.3L271.5 212.4L275.7 211.9ZM271.5 223.3L267.1 223.4L267.1 212.5L271.5 212.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M267.1 223.4L262.7 223.3L262.7 212.4L267.1 212.5ZM262.7 223.3L258.4 222.8L258.4 211.9L262.7 212.4ZM258.4 222.8L254.3 222.1L254.3 211.2L258.4 211.9ZM254.3 222.1L250.3 221.2L250.3 210.3L254.3 211.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M250.3 221.2L246.7 220L246.7 209L250.3 210.3ZM246.7 220L243.4 218.5L243.4 207.6L246.7 209ZM243.4 218.5L240.5 216.9L240.5 205.9L243.4 207.6ZM240.5 216.9L238.1 215L238.1 204.1L240.5 205.9ZM238.1 215L236.2 213.1L236.2 202.2L238.1 204.1ZM236.2 213.1L234.7 211L234.7 200.1L236.2 202.2ZM234.7 211L233.9 208.9L233.9 197.9L234.7 200.1ZM233.9 208.9L233.6 206.7L233.6 195.8L233.9 197.9Z\"/><path class=\"iso-top\" d=\"M290.8 207.6L287.5 209L283.8 210.3L279.9 211.2L275.7 211.9L271.5 212.4L267.1 212.5L262.7 212.4L258.4 211.9L254.3 211.2L250.3 210.3L246.7 209L243.4 207.6L240.5 205.9L238.1 204.1L236.2 202.2L234.7 200.1L233.9 197.9L233.6 195.8L233.9 193.6L234.7 191.4L236.2 189.4L238.1 187.4L240.5 185.6L243.4 183.9L246.7 182.5L250.3 181.3L254.3 180.3L258.4 179.6L262.7 179.2L267.1 179L271.5 179.2L275.7 179.6L279.9 180.3L283.8 181.3L287.5 182.5L290.8 183.9L293.6 185.6L296.1 187.4L298 189.4L299.4 191.4L300.3 193.6L300.6 195.8L300.3 197.9L299.4 200.1L298 202.2L296.1 204.1L293.6 205.9Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M300.6 195.8L300.3 197.9L299.4 200.1L298 202.2L296.1 204.1L293.6 205.9L290.8 207.6L287.5 209L283.8 210.3L279.9 211.2L275.7 211.9L271.5 212.4L267.1 212.5L262.7 212.4L258.4 211.9L254.3 211.2L250.3 210.3L246.7 209L243.4 207.6L240.5 205.9L238.1 204.1L236.2 202.2L234.7 200.1L233.9 197.9L233.6 195.8\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M300.6 195.8L299.3 197.9L298.5 200L297.1 202L295.2 203.9L292.9 205.6L290.1 207.2L286.9 208.6L283.3 209.8L279.5 210.8L275.5 211.5L271.3 211.9L267.1 212L262.8 211.9L258.7 211.5L254.6 210.8L250.8 209.8L247.3 208.6L244.1 207.2L241.3 205.6L238.9 203.9L237.1 202L235.7 200L234.9 197.9L233.6 195.8\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M233.6 195.8L233.9 193.6L234.7 191.4L236.2 189.4L238.1 187.4L240.5 185.6L243.4 183.9L246.7 182.5L250.3 181.3L254.3 180.3L258.4 179.6L262.7 179.2L267.1 179L271.5 179.2L275.7 179.6L279.9 180.3L283.8 181.3L287.5 182.5L290.8 183.9L293.6 185.6L296.1 187.4L298 189.4L299.4 191.4L300.3 193.6L300.6 195.8M300.6 206.7L300.3 208.9L299.4 211L298 213.1L296.1 215L293.6 216.9L290.8 218.5L287.5 220L283.8 221.2L279.9 222.1L275.7 222.8L271.5 223.3L267.1 223.4L262.7 223.3L258.4 222.8L254.3 222.1L250.3 221.2L246.7 220L243.4 218.5L240.5 216.9L238.1 215L236.2 213.1L234.7 211L233.9 208.9L233.6 206.7M233.6 195.8L233.6 206.7M300.6 195.8L300.6 206.7\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M290.8 217.8L290.8 208.3M285.3 220L285.3 210.5M279.1 221.6L279.1 212.1M272.3 222.5L272.3 213M265.3 222.7L265.3 213.2M258.4 222.2L258.4 212.6M251.9 220.9L251.9 211.4M246 219L246 209.5M241.1 216.5L241.1 207M237.3 213.6L237.3 204M234.7 210.3L234.7 200.8M300.2 208.6L300.2 199.1M298.3 212L298.3 202.4M295.2 215.1L295.2 205.6\"/><path data-part=\"wedge-1\" d=\"M267.1 195.7L267.1 212.4L264.2 212.3L261.3 212.2L258.4 211.8L255.6 211.4L252.9 210.8L250.3 210.2L247.9 209.4L245.6 208.5L243.4 207.5L241.4 206.4L239.7 205.3L238.1 204.0L236.7 202.7L235.6 201.4L234.7 200.0L234.1 198.6L233.7 197.1L233.6 195.7L233.7 194.2L234.1 192.8L234.7 191.3L235.6 189.9L236.7 188.6L238.1 187.3L239.7 186.1L241.4 184.9L243.4 183.8L245.6 182.9L247.9 182.0L250.3 181.2L252.9 180.5L255.6 179.9L258.4 179.5L261.3 179.2L264.2 179.0L267.1 178.9Z\" style=\"fill:var(--anatomy-lit);opacity:.2;stroke:none\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M267.1 178.9L271.5 179.1L275.7 179.5L279.9 180.2L283.8 181.2L287.5 182.4L290.8 183.8L293.6 185.5L296.1 187.3L298.0 189.3L299.4 191.3L300.3 193.5L300.6 195.7L300.3 197.9L299.4 200.0L298.0 202.1L296.1 204.0L293.6 205.9L290.8 207.5L287.5 209.0L283.8 210.2L279.9 211.1L275.7 211.8L271.5 212.3L267.1 212.4L262.7 212.3L258.4 211.8L254.3 211.1L250.3 210.2L246.7 209.0L243.4 207.5L240.5 205.9L238.1 204.0L236.2 202.1L234.7 200.0L233.9 197.9L233.6 195.7L233.9 193.5L234.7 191.3L236.2 189.3L238.1 187.3L240.5 185.5L243.4 183.8L246.7 182.4L250.3 181.2L254.3 180.2L258.4 179.5L262.7 179.1Z\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M267.1 180.6L272.8 188.7L288.4 185.0L281.0 192.8L297.2 195.7L281.0 198.6L288.4 206.3L272.8 202.6L267.1 210.7L261.3 202.6L245.8 206.3L253.2 198.6L237.0 195.7L253.2 192.8L245.8 185.0L261.3 188.7ZM267.1 195.7L267.1 180.6M267.1 195.7L288.4 185.0M267.1 195.7L297.2 195.7M267.1 195.7L288.4 206.3M267.1 195.7L267.1 210.7M267.1 195.7L245.8 206.3M267.1 195.7L237.0 195.7M267.1 195.7L245.8 185.0\"/><path data-part=\"needle-1\" class=\"iso-line\" data-tone=\"lit\" data-free=\"end\" d=\"M267.1 195.7L267.1 180.6\" style=\"stroke-width:1.1\"/><path class=\"iso-line\" data-tone=\"lo\" d=\"M385.4 268.6L380.6 270.7L375.1 272.4L369.2 273.8L363 274.7L356.7 275.2L350.2 275.2L343.8 274.7L337.6 273.8L331.7 272.4L326.3 270.7L321.4 268.6L317.2 266.1L313.7 263.4L311 260.5L309.2 257.4L308.2 254.2L308.2 251L309.2 247.8L311 244.7L313.7 241.7L317.2 239L321.4 236.6L326.3 234.4L331.7 232.7L337.6 231.4L343.8 230.4L350.2 230L356.7 230L363 230.4L369.2 231.4L375.1 232.7L380.6 234.4L385.4 236.6L389.7 239L393.2 241.7L395.9 244.7L397.7 247.8L398.6 251L398.6 254.2L397.7 257.4L395.9 260.5L393.2 263.4L389.7 266.1Z\"/><path class=\"iso-line\" data-tone=\"lo\" d=\"M390.3 241.9L392.6 241.2M394.5 247.1L397.2 246.7M396 252.6L398.7 252.6M394.5 258.1L397.2 258.4M390.3 263.2L392.6 263.9M374.7 271L376.1 272.2M364.4 273.1L365.1 274.4M353.4 273.8L353.4 275.2M342.4 273.1L341.7 274.4M332.2 271L330.8 272.2M316.6 263.2L314.2 263.9M312.3 258.1L309.7 258.4M310.9 252.6L308.1 252.6M312.3 247.1L309.7 246.7M316.6 241.9L314.2 241.2M332.2 234.2L330.8 233M342.4 232L341.7 230.7M353.4 231.3L353.4 229.9M364.4 232L365.1 230.7M374.7 234.2L376.1 233\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M381.5 238.5L385.4 236.6M381.5 266.6L385.4 268.6M325.3 266.6L321.4 268.6M325.3 238.5L321.4 236.6\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M316.1 248.5L316.9 245.9L318.4 243.3L320.6 240.9L323.5 238.6L327 236.6L331 234.9L335.5 233.4L340.3 232.3L345.5 231.6L350.8 231.2L356.1 231.2L361.4 231.6L366.5 232.3L371.4 233.4L375.8 234.9L379.9 236.6L383.4 238.6L386.3 240.9L388.5 243.3L390 245.9L390.7 248.5L390.7 253.9L390 256.5L388.5 259.1L386.3 261.5L383.4 263.8L379.9 265.8L375.8 267.5L371.4 269L366.5 270.1L361.4 270.9L356.1 271.2L350.8 271.2L345.5 270.9L340.3 270.1L335.5 269L331 267.5L327 265.8L323.5 263.8L320.6 261.5L318.4 259.1L316.9 256.5L316.1 253.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M379.9 265.8L375.8 267.5L375.8 264.8L379.9 263.1ZM375.8 267.5L371.4 269L371.4 266.3L375.8 264.8ZM390.7 253.9L390 256.5L390 253.8L390.7 251.2ZM390 256.5L388.5 259.1L388.5 256.4L390 253.8ZM388.5 259.1L386.3 261.5L386.3 258.8L388.5 256.4ZM386.3 261.5L383.4 263.8L383.4 261.1L386.3 258.8ZM383.4 263.8L379.9 265.8L379.9 263.1L383.4 261.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M371.4 269L366.5 270.1L366.5 267.4L371.4 266.3ZM366.5 270.1L361.4 270.9L361.4 268.1L366.5 267.4ZM361.4 270.9L356.1 271.2L356.1 268.5L361.4 268.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M356.1 271.2L350.8 271.2L350.8 268.5L356.1 268.5ZM350.8 271.2L345.5 270.9L345.5 268.1L350.8 268.5ZM345.5 270.9L340.3 270.1L340.3 267.4L345.5 268.1ZM340.3 270.1L335.5 269L335.5 266.3L340.3 267.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M335.5 269L331 267.5L331 264.8L335.5 266.3ZM331 267.5L327 265.8L327 263.1L331 264.8ZM327 265.8L323.5 263.8L323.5 261.1L327 263.1ZM323.5 263.8L320.6 261.5L320.6 258.8L323.5 261.1ZM320.6 261.5L318.4 259.1L318.4 256.4L320.6 258.8ZM318.4 259.1L316.9 256.5L316.9 253.8L318.4 256.4ZM316.9 256.5L316.1 253.9L316.1 251.2L316.9 253.8Z\"/><path class=\"iso-top\" d=\"M379.9 263.1L375.8 264.8L371.4 266.3L366.5 267.4L361.4 268.1L356.1 268.5L350.8 268.5L345.5 268.1L340.3 267.4L335.5 266.3L331 264.8L327 263.1L323.5 261.1L320.6 258.8L318.4 256.4L316.9 253.8L316.1 251.2L316.1 248.5L316.9 245.9L318.4 243.3L320.6 240.9L323.5 238.6L327 236.6L331 234.9L335.5 233.4L340.3 232.3L345.5 231.6L350.8 231.2L356.1 231.2L361.4 231.6L366.5 232.3L371.4 233.4L375.8 234.9L379.9 236.6L383.4 238.6L386.3 240.9L388.5 243.3L390 245.9L390.7 248.5L390.7 251.2L390 253.8L388.5 256.4L386.3 258.8L383.4 261.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M390.7 251.2L390 253.8L388.5 256.4L386.3 258.8L383.4 261.1L379.9 263.1L375.8 264.8L371.4 266.3L366.5 267.4L361.4 268.1L356.1 268.5L350.8 268.5L345.5 268.1L340.3 267.4L335.5 266.3L331 264.8L327 263.1L323.5 261.1L320.6 258.8L318.4 256.4L316.9 253.8L316.1 251.2\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M316.1 251.2L316.1 248.5L316.9 245.9L318.4 243.3L320.6 240.9L323.5 238.6L327 236.6L331 234.9L335.5 233.4L340.3 232.3L345.5 231.6L350.8 231.2L356.1 231.2L361.4 231.6L366.5 232.3L371.4 233.4L375.8 234.9L379.9 236.6L383.4 238.6L386.3 240.9L388.5 243.3L390 245.9L390.7 248.5L390.7 251.2M390.7 253.9L390 256.5L388.5 259.1L386.3 261.5L383.4 263.8L379.9 265.8L375.8 267.5L371.4 269L366.5 270.1L361.4 270.9L356.1 271.2L350.8 271.2L345.5 270.9L340.3 270.1L335.5 269L331 267.5L327 265.8L323.5 263.8L320.6 261.5L318.4 259.1L316.9 256.5L316.1 253.9M316.1 251.2L316.1 253.9M390.7 251.2L390.7 253.9\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M319.9 238.9L320.2 236.7L321.1 234.6L322.5 232.5L324.4 230.6L326.9 228.7L329.7 227.1L333 225.6L336.7 224.4L340.6 223.5L344.8 222.8L349.1 222.3L353.4 222.2L357.8 222.3L362.1 222.8L366.2 223.5L370.2 224.4L373.8 225.6L377.1 227.1L380 228.7L382.4 230.6L384.4 232.5L385.8 234.6L386.6 236.7L386.9 238.9L386.9 249.8L386.6 252L385.8 254.2L384.4 256.2L382.4 258.2L380 260L377.1 261.7L373.8 263.1L370.2 264.3L366.2 265.3L362.1 266L357.8 266.4L353.4 266.6L349.1 266.4L344.8 266L340.6 265.3L336.7 264.3L333 263.1L329.7 261.7L326.9 260L324.4 258.2L322.5 256.2L321.1 254.2L320.2 252L319.9 249.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M377.1 261.7L373.8 263.1L373.8 252.2L377.1 250.8ZM373.8 263.1L370.2 264.3L370.2 253.4L373.8 252.2ZM386.9 249.8L386.6 252L386.6 241.1L386.9 238.9ZM386.6 252L385.8 254.2L385.8 243.3L386.6 241.1ZM385.8 254.2L384.4 256.2L384.4 245.3L385.8 243.3ZM384.4 256.2L382.4 258.2L382.4 247.3L384.4 245.3ZM382.4 258.2L380 260L380 249.1L382.4 247.3ZM380 260L377.1 261.7L377.1 250.8L380 249.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M370.2 264.3L366.2 265.3L366.2 254.4L370.2 253.4ZM366.2 265.3L362.1 266L362.1 255.1L366.2 254.4ZM362.1 266L357.8 266.4L357.8 255.5L362.1 255.1ZM357.8 266.4L353.4 266.6L353.4 255.7L357.8 255.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M353.4 266.6L349.1 266.4L349.1 255.5L353.4 255.7ZM349.1 266.4L344.8 266L344.8 255.1L349.1 255.5ZM344.8 266L340.6 265.3L340.6 254.4L344.8 255.1ZM340.6 265.3L336.7 264.3L336.7 253.4L340.6 254.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M336.7 264.3L333 263.1L333 252.2L336.7 253.4ZM333 263.1L329.7 261.7L329.7 250.8L333 252.2ZM329.7 261.7L326.9 260L326.9 249.1L329.7 250.8ZM326.9 260L324.4 258.2L324.4 247.3L326.9 249.1ZM324.4 258.2L322.5 256.2L322.5 245.3L324.4 247.3ZM322.5 256.2L321.1 254.2L321.1 243.3L322.5 245.3ZM321.1 254.2L320.2 252L320.2 241.1L321.1 243.3ZM320.2 252L319.9 249.8L319.9 238.9L320.2 241.1Z\"/><path class=\"iso-top\" d=\"M377.1 250.8L373.8 252.2L370.2 253.4L366.2 254.4L362.1 255.1L357.8 255.5L353.4 255.7L349.1 255.5L344.8 255.1L340.6 254.4L336.7 253.4L333 252.2L329.7 250.8L326.9 249.1L324.4 247.3L322.5 245.3L321.1 243.3L320.2 241.1L319.9 238.9L320.2 236.7L321.1 234.6L322.5 232.5L324.4 230.6L326.9 228.7L329.7 227.1L333 225.6L336.7 224.4L340.6 223.5L344.8 222.8L349.1 222.3L353.4 222.2L357.8 222.3L362.1 222.8L366.2 223.5L370.2 224.4L373.8 225.6L377.1 227.1L380 228.7L382.4 230.6L384.4 232.5L385.8 234.6L386.6 236.7L386.9 238.9L386.6 241.1L385.8 243.3L384.4 245.3L382.4 247.3L380 249.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M386.9 238.9L386.6 241.1L385.8 243.3L384.4 245.3L382.4 247.3L380 249.1L377.1 250.8L373.8 252.2L370.2 253.4L366.2 254.4L362.1 255.1L357.8 255.5L353.4 255.7L349.1 255.5L344.8 255.1L340.6 254.4L336.7 253.4L333 252.2L329.7 250.8L326.9 249.1L324.4 247.3L322.5 245.3L321.1 243.3L320.2 241.1L319.9 238.9\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M386.9 238.9L385.6 241L384.8 243.1L383.4 245.1L381.6 247.1L379.2 248.8L376.4 250.4L373.2 251.8L369.7 253L365.9 253.9L361.8 254.6L357.7 255L353.4 255.2L349.2 255L345 254.6L341 253.9L337.2 253L333.6 251.8L330.4 250.4L327.6 248.8L325.3 247.1L323.4 245.1L322 243.1L321.2 241L319.9 238.9\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M319.9 238.9L320.2 236.7L321.1 234.6L322.5 232.5L324.4 230.6L326.9 228.7L329.7 227.1L333 225.6L336.7 224.4L340.6 223.5L344.8 222.8L349.1 222.3L353.4 222.2L357.8 222.3L362.1 222.8L366.2 223.5L370.2 224.4L373.8 225.6L377.1 227.1L380 228.7L382.4 230.6L384.4 232.5L385.8 234.6L386.6 236.7L386.9 238.9M386.9 249.8L386.6 252L385.8 254.2L384.4 256.2L382.4 258.2L380 260L377.1 261.7L373.8 263.1L370.2 264.3L366.2 265.3L362.1 266L357.8 266.4L353.4 266.6L349.1 266.4L344.8 266L340.6 265.3L336.7 264.3L333 263.1L329.7 261.7L326.9 260L324.4 258.2L322.5 256.2L321.1 254.2L320.2 252L319.9 249.8M319.9 238.9L319.9 249.8M386.9 238.9L386.9 249.8\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M377.1 261L377.1 251.4M371.7 263.2L371.7 253.6M365.4 264.8L365.4 255.2M358.7 265.7L358.7 256.1M351.7 265.9L351.7 256.3M344.8 265.3L344.8 255.8M338.2 264.1L338.2 254.5M332.4 262.2L332.4 252.6M327.4 259.7L327.4 250.1M323.6 256.8L323.6 247.2M321.1 253.5L321.1 243.9M386.5 251.8L386.5 242.2M384.7 255.2L384.7 245.6M381.5 258.3L381.5 248.7\"/><path data-part=\"wedge-2\" d=\"M353.4 238.8L353.4 255.6L350.5 255.5L347.6 255.3L344.8 255.0L342.0 254.6L339.3 254.0L336.7 253.3L334.2 252.6L331.9 251.7L329.7 250.7L327.8 249.6L326.0 248.4L324.4 247.2L323.1 245.9L322.0 244.6L321.1 243.2L320.5 241.7L320.1 240.3L319.9 238.8L320.1 237.4L320.5 235.9L321.1 234.5L322.0 233.1L323.1 231.8L324.4 230.5L326.0 229.2L327.8 228.1L329.7 227.0L331.9 226.0L334.2 225.1L336.7 224.3L339.3 223.7L342.0 223.1L344.8 222.7L347.6 222.4L350.5 222.2L353.4 222.1Z\" style=\"fill:var(--anatomy-lit);opacity:.2;stroke:none\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M353.4 222.1L357.8 222.2L362.1 222.7L366.2 223.4L370.2 224.3L373.8 225.6L377.1 227.0L380.0 228.7L382.4 230.5L384.4 232.4L385.8 234.5L386.6 236.7L386.9 238.8L386.6 241.0L385.8 243.2L384.4 245.2L382.4 247.2L380.0 249.0L377.1 250.7L373.8 252.1L370.2 253.3L366.2 254.3L362.1 255.0L357.8 255.4L353.4 255.6L349.1 255.4L344.8 255.0L340.6 254.3L336.7 253.3L333.0 252.1L329.7 250.7L326.9 249.0L324.4 247.2L322.5 245.2L321.1 243.2L320.2 241.0L319.9 238.8L320.2 236.7L321.1 234.5L322.5 232.4L324.4 230.5L326.9 228.7L329.7 227.0L333.0 225.6L336.7 224.3L340.6 223.4L344.8 222.7L349.1 222.2Z\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M353.4 223.8L359.2 231.9L374.7 228.2L367.3 236.0L383.6 238.8L367.3 241.7L374.7 249.5L359.2 245.8L353.4 253.9L347.7 245.8L332.1 249.5L339.5 241.7L323.3 238.8L339.5 236.0L332.1 228.2L347.7 231.9ZM353.4 238.8L353.4 223.8M353.4 238.8L374.7 228.2M353.4 238.8L383.6 238.8M353.4 238.8L374.7 249.5M353.4 238.8L353.4 253.9M353.4 238.8L332.1 249.5M353.4 238.8L323.3 238.8M353.4 238.8L332.1 228.2\"/><path data-part=\"needle-2\" class=\"iso-line\" data-tone=\"lit\" data-free=\"end\" d=\"M353.4 238.8L353.4 223.8\" style=\"stroke-width:1.1\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M109.5 187.4L122.3 183.7L135.1 187.4L135.1 199.2L122.3 202.9L109.5 199.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M135.1 199.2L122.3 202.9L122.3 198.4L135.1 194.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M122.3 202.9L109.5 199.2L109.5 194.7L122.3 198.4Z\"/><path class=\"iso-top\" d=\"M122.3 198.4L109.5 194.7L109.5 187.4L122.3 183.7L135.1 187.4L135.1 194.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M135.1 194.7L122.3 198.4L109.5 194.7\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M135.1 194.7L122.3 198.1L109.5 194.7\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M109.5 194.7L109.5 187.4L122.3 183.7L135.1 187.4L135.1 194.7M135.1 199.2L122.3 202.9L109.5 199.2M109.5 194.7L109.5 199.2M135.1 194.7L135.1 199.2\"/></g><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"122.3\" cy=\"191\" r=\"0.5\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M195.8 230.5L208.6 226.8L221.4 230.5L221.4 242.3L208.6 246L195.8 242.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M221.4 242.3L208.6 246L208.6 241.6L221.4 237.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M208.6 246L195.8 242.3L195.8 237.9L208.6 241.6Z\"/><path class=\"iso-top\" d=\"M208.6 241.6L195.8 237.9L195.8 230.5L208.6 226.8L221.4 230.5L221.4 237.9Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M221.4 237.9L208.6 241.6L195.8 237.9\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M221.4 237.9L208.6 241.3L195.8 237.9\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M195.8 237.9L195.8 230.5L208.6 226.8L221.4 230.5L221.4 237.9M221.4 242.3L208.6 246L195.8 242.3M195.8 237.9L195.8 242.3M221.4 237.9L221.4 242.3\"/></g><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"208.6\" cy=\"234.2\" r=\"0.5\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M282.1 273.7L294.9 270L307.7 273.7L307.7 285.5L294.9 289.2L282.1 285.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M307.7 285.5L294.9 289.2L294.9 284.8L307.7 281.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M294.9 289.2L282.1 285.5L282.1 281.1L294.9 284.8Z\"/><path class=\"iso-top\" d=\"M294.9 284.8L282.1 281.1L282.1 273.7L294.9 270L307.7 273.7L307.7 281.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M307.7 281.1L294.9 284.8L282.1 281.1\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M307.7 281.1L294.9 284.5L282.1 281.1\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M282.1 281.1L282.1 273.7L294.9 270L307.7 273.7L307.7 281.1M307.7 285.5L294.9 289.2L282.1 285.5M282.1 281.1L282.1 285.5M307.7 281.1L307.7 285.5\"/></g><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"294.9\" cy=\"277.4\" r=\"0.5\"/></g></svg></div>";

const P = {"origin":[322.78504672897196,181.55261814604236],"scale":1.5568884516236852,"azimuth":45,"elevation":30}, VIEW_AT = [-61,-47,2.4], RIGHT = [0.7071067811865476,-0.7071067811865476,0], UP = [-0.7071067811865476,-0.7071067811865476,0], TIP = [0.46947156278589086,0.8829475928589269], WORLD_R = 12, RING_R = 24, MOON_AT = 40, KNOB_R = 17, PIP_TRAVEL = 22, FACES = [{"o":[-62,40,8.05],"u":[0.7071067811865476,-0.7071067811865476,0],"v":[-0.7071067811865476,-0.7071067811865476,0]},{"o":[0,40,8.05],"u":[0.7071067811865476,-0.7071067811865476,0],"v":[-0.7071067811865476,-0.7071067811865476,0]},{"o":[62,40,8.05],"u":[0.7071067811865476,-0.7071067811865476,0],"v":[-0.7071067811865476,-0.7071067811865476,0]}];


const knobAt = (F, r, clock) => { const t = clock * Math.PI / 180, x = r * Math.sin(t), y = r * Math.cos(t); return iso([F.o[0] + F.u[0] * x + F.v[0] * y, F.o[1] + F.u[1] * x + F.v[1] * y, F.o[2] + F.u[2] * x + F.v[2] * y], P); };
const knobPath = (points, closed) => points.map(([x, y], i) => (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1)).join("") + (closed ? "Z" : "");
// degrees is the axis value, -180 to 180: the fill and the needle for it.
function knobOf(F, r, degrees) {
  const to = 180 + ((Math.min(180, Math.max(-180, degrees)) + 180) / 360) * 360, points = [knobAt(F, 0, 0)];
  for (let clock = 180; clock < to; clock += 5) points.push(knobAt(F, r, clock));
  points.push(knobAt(F, r, to));
  return { wedge: to - 180 > 0.5 ? knobPath(points, true) : "", needle: knobPath([knobAt(F, 0, 0), knobAt(F, r * 0.9, to)]) };
}
const signed = (degrees) => { const n = Math.round(degrees); return (n > 0 ? "+" : n < 0 ? "−" : "") + Math.abs(n) + "°"; };
const axesReadout = ([x, y, z]) => "X " + signed(x) + " · Y " + signed(y) + " · Z " + signed(z);

const DEG = Math.PI / 180;
const onGlass = (x, y) => iso([VIEW_AT[0] + RIGHT[0] * x + UP[0] * y, VIEW_AT[1] + RIGHT[1] * x + UP[1] * y, VIEW_AT[2]], P);
// The World on the screen: its ring and its Moon turn with the three axes. Behind the World they are hidden.
function sceneOf([ax, ay, az]) {
  const cx = Math.cos(ax * DEG), sx = Math.sin(ax * DEG), cy = Math.cos(ay * DEG), sy = Math.sin(ay * DEG), cz = Math.cos(az * DEG), sz = Math.sin(az * DEG);
  const turn = ([x, y, z]) => {
    [x, y] = [x * cz - y * sz, x * sz + y * cz];
    [x, z] = [x * cy + z * sy, -x * sy + z * cy];
    [y, z] = [y * cx - z * sx, y * sx + z * cx];
    return [x, y, z];
  };
  // the ring rests tipped toward the reader, so that it reads as a ring
  const rest = ([x, y, z]) => [x, y * TIP[0] - z * TIP[1], y * TIP[1] + z * TIP[0]];
  const seen = ([x, y, z]) => z > 0 || x * x + y * y > WORLD_R * WORLD_R;
  const runs = [];
  let run = null;
  for (let i = 0; i <= 72; i++) {
    const a = (i / 72) * Math.PI * 2, p = turn(rest([RING_R * Math.cos(a), RING_R * Math.sin(a), 0]));
    if (seen(p)) { if (!run) runs.push(run = []); run.push(onGlass(p[0], p[1])); } else run = null;
  }
  const moon = turn(rest([RING_R * Math.cos(MOON_AT * DEG), RING_R * Math.sin(MOON_AT * DEG), 0]));
  return { ring: runs.map((points) => knobPath(points)).join(""), moon: seen(moon) ? onGlass(moon[0], moon[1]) : null };
}

export function mount(root, say = () => {}) {
const stage = root.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const part = (name) => svg.querySelector('[data-part="' + name + '"]');
const wedges = [0, 1, 2].map((index) => part("wedge-" + index)), needles = [0, 1, 2].map((index) => part("needle-" + index)), pips = [0, 1, 2].map((index) => part("pip-" + index));
const ring = part("ring"), moon = part("moon");
let said = "";
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v) => Math.min(180, Math.max(-180, v));
// The tour turns one axis at a time.
const TOUR = [[0, 0, 0], [70, 0, 0], [-50, 0, 0], [-50, 80, 0], [-50, -40, 0], [-50, -40, 120], [-50, -40, -90], [0, 0, 0]];
const now = [0, 0, 0], goal = [0, 0, 0];
let frame = 0, last = 0, clock = 0, touring = !still.matches, visible = false, idle = 0;
function draw() {
  now.forEach((value, index) => {
    const knob = knobOf(FACES[index], KNOB_R, value);
    wedges[index].setAttribute("d", knob.wedge);
    needles[index].setAttribute("d", knob.needle);
    pips[index].setAttribute("transform", translateAlong(P, [0, (-value / 360) * PIP_TRAVEL, 0]));
  });
  const scene = sceneOf(now);
  ring.setAttribute("d", scene.ring);
  moon.style.display = scene.moon ? "" : "none";
  if (scene.moon) { moon.setAttribute("cx", scene.moon[0].toFixed(1)); moon.setAttribute("cy", scene.moon[1].toFixed(1)); }
  const text = axesReadout(now);
  if (said !== text) { said = text; say(text); }
  if (!touring && stage.getAttribute("aria-valuetext") !== text) { stage.setAttribute("aria-valuenow", String(Math.round(now[0]))); stage.setAttribute("aria-valuetext", text); }
}
function tick(time) {
  const dt = last ? Math.min((time - last) / 1000, 1 / 30) : 1 / 60;
  last = time;
  if (touring) { clock += dt; const at = TOUR[Math.floor(clock / 2.4) % TOUR.length]; goal[0] = at[0]; goal[1] = at[1]; goal[2] = at[2]; }
  const ease = still.matches ? 1 : 1 - Math.exp(-dt / 0.36);
  let moving = false;
  for (let i = 0; i < 3; i++) { now[i] += (goal[i] - now[i]) * ease; if (Math.abs(goal[i] - now[i]) < 0.2) now[i] = goal[i]; else moving = true; }
  draw();
  frame = visible && (touring || moving) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
// The reader's setting stays for as long as they are on the figure (pointer over it, or keyboard focus):
// the tour only comes back a while after they have left.
let over = false;
const rest = () => { clearTimeout(idle); if (over || document.activeElement === stage) return; idle = setTimeout(() => { touring = !still.matches; clock = 0; run(); }, 4200); };
const steer = (x, y, z) => { touring = false; goal[0] = clamp(x); goal[1] = clamp(y); goal[2] = clamp(z); rest(); run(); };
stage.addEventListener("pointerenter", () => { over = true; clearTimeout(idle); });
stage.addEventListener("pointerleave", () => { over = false; rest(); });
stage.addEventListener("pointercancel", () => { over = false; rest(); });
stage.addEventListener("blur", rest);
const seen = new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" });
seen.observe(stage);
// Across the figure turns X, up and down turns Y, and Z goes back to 0°: the keys turn it.
stage.addEventListener("pointermove", (event) => {
  const box = svg.getBoundingClientRect();
  if (!box.width || !box.height) return;
  steer(((event.clientX - box.left) / box.width - 0.5) * 400, ((event.clientY - box.top) / box.height - 0.5) * -400, 0);
});
stage.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === "Home") { event.preventDefault(); steer(0, 0, 0); return; }
  const by = (event.shiftKey ? { ArrowRight: [0, 0, 15], ArrowLeft: [0, 0, -15] } : { ArrowRight: [15, 0, 0], ArrowLeft: [-15, 0, 0], ArrowUp: [0, 15, 0], ArrowDown: [0, -15, 0] })[event.key];
  if (!by) return;
  event.preventDefault();
  steer(Math.round(goal[0] + by[0]), Math.round(goal[1] + by[1]), Math.round(goal[2] + by[2]));
});
draw();
return () => { seen.disconnect(); cancelAnimationFrame(frame); clearTimeout(idle); visible = false; };
}
