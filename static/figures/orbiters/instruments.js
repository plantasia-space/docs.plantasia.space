// Built by figures/src/module-families/build.mjs. Do not edit by hand.
const AZIMUTH = 45;
const ELEVATION = 30;
const SHADES = 4;
const RADIANS = Math.PI / 180;
const UNIT = Math.sqrt(1.6);
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
const tenth = (value) => {
    const text = (Math.round(value * 10) / 10).toFixed(1).replace(/\.0$/, "");
    return text === "-0" ? "0" : text;
};
function pathOf(points, closed = false) {
    if (!points.length)
        return "";
    return points.map(([x, y], at) => `${at ? "L" : "M"}${tenth(x)} ${tenth(y)}`).join("") + (closed ? "Z" : "");
}
const joinPaths = (paths) => paths.filter(Boolean).join("");
function roundedPlan({ x, y, w, d, r }, steps = 8) {
    const radius = Math.max(0, Math.min(r, w / 2, d / 2));
    const corners = [
        [x + w - radius, y + radius, -90],
        [x + w - radius, y + d - radius, 0],
        [x + radius, y + d - radius, 90],
        [x + radius, y + radius, 180],
    ];
    const out = [];
    for (const [cx, cy, start] of corners) {
        const count = radius > 0 ? steps : 0;
        for (let step = 0; step <= count; step++) {
            const angle = (start + (count ? (90 * step) / count : 45)) * RADIANS;
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
const oriented = (points) => (signedArea(points) < 0 ? [...points].reverse() : points);
function convexHull(points) {
    const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (sorted.length < 3)
        return sorted;
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lower = [];
    for (const point of sorted) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0)
            lower.pop();
        lower.push(point);
    }
    const upper = [];
    for (let index = sorted.length - 1; index >= 0; index--) {
        const point = sorted[index];
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0)
            upper.pop();
        upper.push(point);
    }
    return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
function runsOf(flags, want) {
    const count = flags.length;
    const runs = [];
    const start = flags.findIndex((flag, index) => flag !== flags[(index + count - 1) % count]);
    if (start < 0)
        return flags[0] === want ? [Array.from({ length: count + 1 }, (_, index) => index % count)] : [];
    let run = null;
    for (let step = 0; step < count; step++) {
        const index = (start + step) % count;
        if (flags[index] === want) {
            if (!run)
                run = [index];
            run.push((index + 1) % count);
        }
        else if (run) {
            runs.push(run);
            run = null;
        }
    }
    if (run)
        runs.push(run);
    return runs;
}
function extrude(ring, z, height, projection, options = {}) {
    const convex = options.convex ?? true;
    const count = ring.length;
    const counter = signedArea(ring) > 0;
    const [vx, vy] = towardViewer(projection);
    const { sinA, cosA } = cameraOf(projection);
    const normals = ring.map(([ax, ay], index) => {
        const [bx, by] = ring[(index + 1) % count];
        const dx = bx - ax;
        const dy = by - ay;
        const length = Math.hypot(dx, dy) || 1;
        return (counter ? [dy / length, -dx / length] : [-dy / length, dx / length]);
    });
    const facing = normals.map(([nx, ny]) => nx * vx + ny * vy > 1e-9);
    const top = ring.map(([x, y]) => iso([x, y, z + height], projection));
    const bottom = ring.map(([x, y]) => iso([x, y, z], projection));
    const outline = [];
    const crease = [];
    for (const run of runsOf(facing, false))
        outline.push(pathOf(run.map((index) => top[index])));
    for (const run of runsOf(facing, true)) {
        crease.push(pathOf(run.map((index) => top[index])));
        if (height > 0)
            outline.push(pathOf(run.map((index) => bottom[index])));
    }
    if (height > 0) {
        for (let index = 0; index < count; index++) {
            if (facing[(index + count - 1) % count] !== facing[index])
                outline.push(pathOf([top[index], bottom[index]]));
        }
    }
    let fill;
    if (convex) {
        fill = pathOf(convexHull([...top, ...bottom]), true);
    }
    else {
        const parts = [pathOf(oriented(top), true), pathOf(oriented(bottom), true)];
        for (let index = 0; index < count; index++) {
            if (!facing[index])
                continue;
            const next = (index + 1) % count;
            parts.push(pathOf(oriented([top[index], top[next], bottom[next], bottom[index]]), true));
        }
        fill = parts.join("");
    }
    const buckets = Array.from({ length: SHADES }, () => []);
    if (height > 0) {
        const [lx, ly] = [-sinA, cosA];
        for (let index = 0; index < count; index++) {
            if (!facing[index])
                continue;
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
        const inset = ring.map(([x, y], index) => {
            const [ax, ay] = normals[(index + count - 1) % count];
            const [bx, by2] = normals[index];
            const mx = ax + bx;
            const my = ay + by2;
            const length = Math.hypot(mx, my) || 1;
            return [x - (mx / length) * by, y - (my / length) * by];
        });
        const insetTop = inset.map(([x, y]) => iso([x, y, z + height], projection));
        bevel = runsOf(facing, true)
            .map((run) => pathOf([top[run[0]], ...run.slice(1, -1).map((index) => insetTop[index]), top[run[run.length - 1]]]))
            .join("");
    }
    return {
        fill,
        outline: outline.join(""),
        crease: crease.join(""),
        top: pathOf(oriented(top), true),
        shades: buckets.map((paths) => paths.join("")),
        bevel,
    };
}
const ringOf = (plan, steps = 8) => roundedPlan(plan, steps);
function slabOf(plan, z, height, projection, steps = 8, bevel = 0) {
    return extrude(ringOf(plan, steps), z, height, projection, { convex: true, bevel });
}
function circleRing(cx, cy, radius, steps = 40) {
    return Array.from({ length: steps }, (_, step) => {
        const angle = (step / steps) * Math.PI * 2;
        return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
    });
}
function cylinder(cx, cy, radius, z, height, projection, steps = 32, bevel = 0) {
    return extrude(circleRing(cx, cy, radius, steps), z, height, projection, { convex: true, bevel });
}
const insetPlan = ({ x, y, w, d, r }, by) => ({ x: x + by, y: y + by, w: w - by * 2, d: d - by * 2, r: Math.max(0, r - by) });
function onTop(points, z, projection, closed = false) {
    return pathOf(points.map(([x, y]) => iso([x, y, z], projection)), closed);
}
const planOutline = (plan, z, projection, steps = 8) => onTop(ringOf(plan, steps), z, projection, true);
const lineOnTop = (from, to, z, projection) => onTop([from, to], z, projection);
const segment = (from, to, projection) => pathOf([iso(from, projection), iso(to, projection)]);
const rise = (at, from, to, projection) => segment([at[0], at[1], from], [at[0], at[1], to], projection);
const ring = (cx, cy, radius, z, projection, steps = 40) => onTop(circleRing(cx, cy, radius, steps), z, projection, true);
const pointsAt = (points, projection) => points.map((point) => iso(point, projection));
function dotGrid(x, y, columns, rows, gap, z, projection) {
    const dots = [];
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++)
            dots.push(iso([x + column * gap, y + row * gap, z], projection));
    }
    return dots;
}
function corners({ x, y, w, d }, inset = 0) {
    return [
        [x + inset, y + inset],
        [x + w - inset, y + inset],
        [x + inset, y + d - inset],
        [x + w - inset, y + d - inset],
    ];
}
function boxCorners({ x, y, w, d }, z0, z1) {
    const out = [];
    for (const px of [x, x + w])
        for (const py of [y, y + d])
            for (const z of [z0, z1])
                out.push([px, py, z]);
    return out;
}
function knurl(cx, cy, radius, z0, z1, count, projection, inset = 0.4) {
    const [vx, vy] = towardViewer(projection);
    const lines = [];
    for (let index = 0; index < count; index++) {
        const angle = (index / count) * Math.PI * 2;
        const nx = Math.cos(angle);
        const ny = Math.sin(angle);
        if (nx * vx + ny * vy < 0.15)
            continue;
        lines.push(segment([cx + radius * nx, cy + radius * ny, z0 + inset], [cx + radius * nx, cy + radius * ny, z1 - inset], projection));
    }
    return lines.join("");
}
function sideArc(cx, cy, radius, z, projection, steps = 24) {
    const [vx, vy] = towardViewer(projection);
    const facing = Math.atan2(vy, vx);
    const points = [];
    for (let step = 0; step <= steps; step++) {
        const angle = facing - Math.PI / 2 + (step / steps) * Math.PI;
        points.push(iso([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle), z], projection));
    }
    return pathOf(points);
}
function ringSeam(ring, z, projection) {
    const count = ring.length;
    const counter = signedArea(ring) > 0;
    const [vx, vy] = towardViewer(projection);
    const facing = ring.map(([ax, ay], index) => {
        const [bx, by] = ring[(index + 1) % count];
        const dx = bx - ax;
        const dy = by - ay;
        const [nx, ny] = counter ? [dy, -dx] : [-dy, dx];
        return nx * vx + ny * vy > 1e-9;
    });
    return runsOf(facing, true).map((run) => pathOf(run.map((index) => iso([ring[index][0], ring[index][1], z], projection)))).join("");
}
const sideSeam = (plan, z, projection, steps = 8) => ringSeam(ringOf(plan, steps), z, projection);
function sideRing(center, radius, axis, projection, steps = 20) {
    const [px, py, pz] = center;
    const points = [];
    for (let step = 0; step < steps; step++) {
        const angle = (step / steps) * Math.PI * 2;
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
        if (near === null)
            near = facing;
        if (facing !== near) {
            run.push(flat);
            (near ? front : back).push(pathOf(run));
            run = [flat];
            near = facing;
            continue;
        }
        run.push(flat);
    }
    if (run.length > 1)
        (near ? front : back).push(pathOf(run));
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
        const angle = from + (index / count) * span;
        const big = index % every === 0;
        const inner = radius - (big ? lengths[1] : lengths[0]);
        const sx = Math.sin(angle);
        const sy = -Math.cos(angle);
        (big ? major : minor).push(lineOnTop([cx + sx * inner, cy + sy * inner], [cx + sx * radius, cy + sy * radius], z, projection));
    }
    return { minor: minor.join(""), major: major.join("") };
}
const haloOf = (plan, z, height, projection) => slabOf(plan, z, height, projection).fill;
function axisVector(projection, [dx, dy, dz]) {
    const origin = iso([0, 0, 0], projection);
    const moved = iso([dx, dy, dz], projection);
    return [moved[0] - origin[0], moved[1] - origin[1]];
}
const fine = (value) => Math.round(value * 100) / 100;
function translateAlong(projection, by) {
    const [x, y] = axisVector(projection, by);
    return `translate(${fine(x)} ${fine(y)})`;
}
const thousandth = (value) => Math.round(value * 1000) / 1000;
function axesAt(at, z, projection) {
    const origin = iso([at[0], at[1], z], projection);
    const along = (point) => {
        const [px, py] = iso(point, projection);
        return [px - origin[0], py - origin[1]];
    };
    return { origin, x: along([at[0] + 1, at[1], z]), y: along([at[0], at[1] + 1, z]), z: along([at[0], at[1], z + 1]) };
}
const matrixOf = (u, v, origin) => `matrix(${thousandth(u[0])} ${thousandth(u[1])} ${thousandth(v[0])} ${thousandth(v[1])} ${thousandth(origin[0])} ${thousandth(origin[1])})`;
function holdStill(element, [dx, dy]) {
    const text = dx || dy ? `translate(${-dx} ${-dy})` : "";
    element.querySelectorAll("[data-hold]").forEach((node) => (text ? node.setAttribute("transform", text) : node.removeAttribute("transform")));
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
        origin: [width / 2 - ((left + right) / 2) * scale, headroom + (height - headroom) / 2 - ((up + down) / 2) * scale],
        scale,
        azimuth,
        elevation,
    };
}
const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const attrs = (pairs) => Object.entries(pairs)
    .filter(([, value]) => value !== undefined && value !== false)
    .map(([key, value]) => ` ${key}="${escape(String(value))}"`)
    .join("");
function solidSvg(paths, { tone = "hi", crease = "faint", halo = false, lit = false, flat = false, className, inner = "" } = {}) {
    const parts = [];
    if (halo)
        parts.push(`<path class="iso-halo" d="${paths.fill}"/>`);
    parts.push(`<path class="iso-fill" d="${paths.fill}"/>`);
    if (!flat) {
        paths.shades.forEach((d, shade) => {
            if (d)
                parts.push(`<path class="iso-shade" data-shade="${shade}" d="${d}"/>`);
        });
        parts.push(`<path class="iso-top" d="${paths.top}"/>`);
    }
    if (crease !== "none" && paths.crease)
        parts.push(`<path class="iso-line iso-crease" data-tone="${crease}" d="${paths.crease}"/>`);
    if (crease !== "none" && paths.bevel)
        parts.push(`<path class="iso-line iso-bevel" data-tone="${crease}" d="${paths.bevel}"/>`);
    if (inner)
        parts.push(inner);
    parts.push(`<path class="iso-line iso-edge" data-tone="${tone}" d="${paths.outline}"/>`);
    return `<g${attrs({ class: className ? `iso-solid ${className}` : "iso-solid", "data-lit": lit ? "" : undefined, "data-seamless": paths.seamless ? "" : undefined })}>${parts.join("")}</g>`;
}
function lineSvg(d, { tone = "lo", dotted = false, dashed = false, flow = false, className, free } = {}) {
    if (!d)
        return "";
    return `<path${attrs({
        class: className ? `iso-line ${className}` : "iso-line",
        "data-tone": tone,
        "data-free": free === true ? "" : free || undefined,
        "data-dotted": dotted ? "" : undefined,
        "data-dashed": dashed ? "" : undefined,
        "data-flow": flow ? "" : undefined,
        d,
    })}/>`;
}
function dotsSvg(points, { size = 0.5, tone = "mid", pulse = false } = {}) {
    const dots = points
        .map(([x, y, alpha], index) => `<circle cx="${tenth(x)}" cy="${tenth(y)}" r="${size}"${alpha !== undefined && alpha < 1 ? ` fill-opacity="${Math.max(0, alpha).toFixed(2)}"` : ""}${pulse ? ` data-pulse="" style="--pulse-at:${(index * 137) % 1600}ms"` : ""}/>`)
        .join("");
    return `<g class="iso-dots" data-tone="${tone}">${dots}</g>`;
}
function fadedSvg(list, style = {}) {
    const groups = new Map();
    for (const entry of list) {
        const [d, alpha] = Array.isArray(entry) ? entry : [entry.d, entry.alpha];
        if (!d || !(alpha > 0.02))
            continue;
        const level = Math.min(1, Math.round(alpha * 20) / 20);
        groups.set(level, (groups.get(level) ?? "") + d);
    }
    return [...groups].map(([alpha, d]) => (alpha >= 1 ? lineSvg(d, style) : `<g opacity="${alpha.toFixed(2)}">${lineSvg(d, style)}</g>`)).join("");
}
function fadeLineSvg(points, { fade = [0, 0], tone = "lo", className, stops = 6 } = {}) {
    if (points.length < 2)
        return "";
    const ease = (t) => t * t * (3 - 2 * t);
    const hashOf = (text) => {
        let hash = 2166136261;
        for (let index = 0; index < text.length; index++)
            hash = Math.imul(hash ^ text.charCodeAt(index), 16777619);
        return (hash >>> 0).toString(36);
    };
    const lengths = [0];
    for (let index = 1; index < points.length; index++)
        lengths.push(lengths[index - 1] + Math.hypot(points[index][0] - points[index - 1][0], points[index][1] - points[index - 1][1]));
    const at = (length) => {
        let index = 1;
        while (index < points.length - 1 && lengths[index] < length)
            index++;
        const span = lengths[index] - lengths[index - 1] || 1;
        const t = Math.max(0, Math.min(1, (length - lengths[index - 1]) / span));
        return [points[index - 1][0] + (points[index][0] - points[index - 1][0]) * t, points[index - 1][1] + (points[index][1] - points[index - 1][1]) * t];
    };
    const pieceOf = (from, to) => [at(from), ...points.filter((_, index) => lengths[index] > from + 1e-6 && lengths[index] < to - 1e-6), at(to)];
    const total = lengths[lengths.length - 1];
    if (total < 1e-6)
        return "";
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
    if (start > 0.05)
        parts.push(ramp(pieceOf(0, start), true));
    if (total - end - start > 0.05)
        parts.push(lineSvg(pathOf(pieceOf(start, total - end)), { tone, className }));
    if (end > 0.05)
        parts.push(ramp(pieceOf(total - end, total), false));
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
        "data-theme": standalone || undefined,
        viewBox: `0 0 ${width} ${height}`,
        role: "img",
        "aria-label": label,
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
    const legend = keys.length || caption
        ? `<figcaption class="iso-legend">${keys.length ? `<span class="iso-keys">${keys.map((key) => `<span class="iso-key">${swatchSvg(key.mark)}${escape(key.label)}</span>`).join("")}</span>` : ""}${caption ? `<span class="iso-caption">${escape(caption)}</span>` : ""}</figcaption>`
        : "";
    return `<figure class="iso-figure"><div class="iso-plate"><div class="iso-plate-corners" aria-hidden="true">${corner("fig", fig)}${title ? corner("title", title) : ""}${hint ? corner("hint", hint) : ""}${corner("readout", readout, " data-readout")}</div>${body}</div>${legend}</figure>`;
}
function pageHtml({ title, theme = "dark", body, script = "", width = 650 }) {
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><style>${ISO_CSS}${PAGE_CSS.replace("__WIDTH__", String(width))}</style></head><body class="iso" data-theme="${theme}"><main class="iso-page">${body}</main>${script ? `<script type="module">${script.replace(/<\/(script)/gi, "<\\/$1")}</script>` : ""}</body></html>`;
}
const PAGE_CSS = `
*{box-sizing:border-box}
html{color-scheme:dark}
body[data-theme="light"]{color-scheme:light}
body{margin:0;background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
.iso-page{width:min(__WIDTH__px,100% - 32px);margin:64px auto 96px}
`;
const ISO_CSS = `
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

export const svg = "<div class=\"iso-stage\" tabindex=\"0\" role=\"slider\" aria-label=\"Instruments: left and right arrows choose Audio or Notes\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"0\"><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"iso-svg\" viewBox=\"0 0 640 360\" role=\"img\" aria-label=\"A length of the Orbiter's rack with two instruments on it. One has two reels and plays an audio. The other has a keyboard and plays notes. Only one of them plays at a time.\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M196.9 103.7L198 101.8L200.3 100.1L203.6 98.9L207.6 98.4L211.6 98.6L215.3 99.5L218.1 100.9L219.8 102.7L220.2 104.7L220.2 119.9L219.2 121.9L216.8 123.5L213.5 124.7L209.6 125.2L205.6 125L201.9 124.2L199 122.7L197.3 120.9L196.9 118.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M216.8 123.5L213.5 124.7L213.5 109.5L216.8 108.4ZM220.2 119.9L219.2 121.9L219.2 106.7L220.2 104.7ZM219.2 121.9L216.8 123.5L216.8 108.4L219.2 106.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M213.5 124.7L209.6 125.2L209.6 110.1L213.5 109.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M209.6 125.2L205.6 125L205.6 109.9L209.6 110.1ZM205.6 125L201.9 124.2L201.9 109L205.6 109.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M201.9 124.2L199 122.7L199 107.6L201.9 109ZM199 122.7L197.3 120.9L197.3 105.7L199 107.6ZM197.3 120.9L196.9 118.9L196.9 103.7L197.3 105.7Z\"/><path class=\"iso-top\" d=\"M216.8 108.4L213.5 109.5L209.6 110.1L205.6 109.9L201.9 109L199 107.6L197.3 105.7L196.9 103.7L198 101.8L200.3 100.1L203.6 98.9L207.6 98.4L211.6 98.6L215.3 99.5L218.1 100.9L219.8 102.7L220.2 104.7L219.2 106.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M220.2 104.7L219.2 106.7L216.8 108.4L213.5 109.5L209.6 110.1L205.6 109.9L201.9 109L199 107.6L197.3 105.7L196.9 103.7\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M196.9 103.7L198 101.8L200.3 100.1L203.6 98.9L207.6 98.4L211.6 98.6L215.3 99.5L218.1 100.9L219.8 102.7L220.2 104.7M220.2 119.9L219.2 121.9L216.8 123.5L213.5 124.7L209.6 125.2L205.6 125L201.9 124.2L199 122.7L197.3 120.9L196.9 118.9M196.9 103.7L196.9 118.9M220.2 104.7L220.2 119.9\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M114.4 145L115.5 143L117.8 141.4L121.1 140.2L125 139.7L129.1 139.9L132.7 140.7L135.6 142.2L137.3 144L137.7 146L137.7 161.2L136.6 163.1L134.3 164.8L131 166L127.1 166.5L123 166.3L119.3 165.5L116.5 164L114.8 162.2L114.4 160.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M134.3 164.8L131 166L131 150.8L134.3 149.6ZM137.7 161.2L136.6 163.1L136.6 148L137.7 146ZM136.6 163.1L134.3 164.8L134.3 149.6L136.6 148Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M131 166L127.1 166.5L127.1 151.3L131 150.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M127.1 166.5L123 166.3L123 151.1L127.1 151.3ZM123 166.3L119.3 165.5L119.3 150.3L123 151.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M119.3 165.5L116.5 164L116.5 148.9L119.3 150.3ZM116.5 164L114.8 162.2L114.8 147L116.5 148.9ZM114.8 162.2L114.4 160.2L114.4 145L114.8 147Z\"/><path class=\"iso-top\" d=\"M134.3 149.6L131 150.8L127.1 151.3L123 151.1L119.3 150.3L116.5 148.9L114.8 147L114.4 145L115.5 143L117.8 141.4L121.1 140.2L125 139.7L129.1 139.9L132.7 140.7L135.6 142.2L137.3 144L137.7 146L136.6 148Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M137.7 146L136.6 148L134.3 149.6L131 150.8L127.1 151.3L123 151.1L119.3 150.3L116.5 148.9L114.8 147L114.4 145\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M114.4 145L115.5 143L117.8 141.4L121.1 140.2L125 139.7L129.1 139.9L132.7 140.7L135.6 142.2L137.3 144L137.7 146M137.7 161.2L136.6 163.1L134.3 164.8L131 166L127.1 166.5L123 166.3L119.3 165.5L116.5 164L114.8 162.2L114.4 160.2M114.4 145L114.4 160.2M137.7 146L137.7 161.2\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M502.3 256.4L503.4 254.5L505.7 252.8L509 251.6L512.9 251.1L517 251.3L520.7 252.2L523.5 253.6L525.2 255.4L525.6 257.4L525.6 272.6L524.5 274.6L522.2 276.2L518.9 277.4L515 277.9L510.9 277.7L507.3 276.9L504.4 275.4L502.7 273.6L502.3 271.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M522.2 276.2L518.9 277.4L518.9 262.2L522.2 261.1ZM525.6 272.6L524.5 274.6L524.5 259.4L525.6 257.4ZM524.5 274.6L522.2 276.2L522.2 261.1L524.5 259.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M518.9 277.4L515 277.9L515 262.7L518.9 262.2Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M515 277.9L510.9 277.7L510.9 262.6L515 262.7ZM510.9 277.7L507.3 276.9L507.3 261.7L510.9 262.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M507.3 276.9L504.4 275.4L504.4 260.3L507.3 261.7ZM504.4 275.4L502.7 273.6L502.7 258.4L504.4 260.3ZM502.7 273.6L502.3 271.6L502.3 256.4L502.7 258.4Z\"/><path class=\"iso-top\" d=\"M522.2 261.1L518.9 262.2L515 262.7L510.9 262.6L507.3 261.7L504.4 260.3L502.7 258.4L502.3 256.4L503.4 254.5L505.7 252.8L509 251.6L512.9 251.1L517 251.3L520.7 252.2L523.5 253.6L525.2 255.4L525.6 257.4L524.5 259.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M525.6 257.4L524.5 259.4L522.2 261.1L518.9 262.2L515 262.7L510.9 262.6L507.3 261.7L504.4 260.3L502.7 258.4L502.3 256.4\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M502.3 256.4L503.4 254.5L505.7 252.8L509 251.6L512.9 251.1L517 251.3L520.7 252.2L523.5 253.6L525.2 255.4L525.6 257.4M525.6 272.6L524.5 274.6L522.2 276.2L518.9 277.4L515 277.9L510.9 277.7L507.3 276.9L504.4 275.4L502.7 273.6L502.3 271.6M502.3 256.4L502.3 271.6M525.6 257.4L525.6 272.6\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M419.8 297.7L420.8 295.7L423.2 294.1L426.5 292.9L430.4 292.4L434.4 292.6L438.1 293.4L441 294.9L442.7 296.7L443.1 298.7L443.1 313.9L442 315.8L439.7 317.5L436.4 318.7L432.4 319.2L428.4 319L424.7 318.1L421.9 316.7L420.2 314.9L419.8 312.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M439.7 317.5L436.4 318.7L436.4 303.5L439.7 302.3ZM443.1 313.9L442 315.8L442 300.7L443.1 298.7ZM442 315.8L439.7 317.5L439.7 302.3L442 300.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M436.4 318.7L432.4 319.2L432.4 304L436.4 303.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M432.4 319.2L428.4 319L428.4 303.8L432.4 304ZM428.4 319L424.7 318.1L424.7 303L428.4 303.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M424.7 318.1L421.9 316.7L421.9 301.5L424.7 303ZM421.9 316.7L420.2 314.9L420.2 299.7L421.9 301.5ZM420.2 314.9L419.8 312.9L419.8 297.7L420.2 299.7Z\"/><path class=\"iso-top\" d=\"M439.7 302.3L436.4 303.5L432.4 304L428.4 303.8L424.7 303L421.9 301.5L420.2 299.7L419.8 297.7L420.8 295.7L423.2 294.1L426.5 292.9L430.4 292.4L434.4 292.6L438.1 293.4L441 294.9L442.7 296.7L443.1 298.7L442 300.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M443.1 298.7L442 300.7L439.7 302.3L436.4 303.5L432.4 304L428.4 303.8L424.7 303L421.9 301.5L420.2 299.7L419.8 297.7\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M419.8 297.7L420.8 295.7L423.2 294.1L426.5 292.9L430.4 292.4L434.4 292.6L438.1 293.4L441 294.9L442.7 296.7L443.1 298.7M443.1 313.9L442 315.8L439.7 317.5L436.4 318.7L432.4 319.2L428.4 319L424.7 318.1L421.9 316.7L420.2 314.9L419.8 312.9M419.8 297.7L419.8 312.9M443.1 298.7L443.1 313.9\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M88.4 135.4L89.1 133.7L91 132.3L202.4 76.6L205.2 75.6L208.6 75.3L211.9 75.6L214.8 76.6L549 243.7L550.9 245.1L551.6 246.8L551.6 256.9L550.9 258.6L549 260L437.6 315.7L434.8 316.7L431.4 317L428.1 316.7L425.2 315.7L91 148.6L89.1 147.2L88.4 145.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M551.6 256.9L550.9 258.6L550.9 248.5L551.6 246.8ZM550.9 258.6L549 260L549 249.9L550.9 248.5ZM549 260L437.6 315.7L437.6 305.6L549 249.9ZM437.6 315.7L434.8 316.7L434.8 306.6L437.6 305.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M434.8 316.7L431.4 317L431.4 306.9L434.8 306.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M431.4 317L428.1 316.7L428.1 306.6L431.4 306.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M428.1 316.7L425.2 315.7L425.2 305.6L428.1 306.6ZM425.2 315.7L91 148.6L91 138.5L425.2 305.6ZM91 148.6L89.1 147.2L89.1 137.1L91 138.5ZM89.1 147.2L88.4 145.5L88.4 135.4L89.1 137.1Z\"/><path class=\"iso-top\" d=\"M549 243.7L550.9 245.1L551.6 246.8L550.9 248.5L549 249.9L437.6 305.6L434.8 306.6L431.4 306.9L428.1 306.6L425.2 305.6L91 138.5L89.1 137.1L88.4 135.4L89.1 133.7L91 132.3L202.4 76.6L205.2 75.6L208.6 75.3L211.9 75.6L214.8 76.6Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M551.6 246.8L550.9 248.5L549 249.9L437.6 305.6L434.8 306.6L431.4 306.9L428.1 306.6L425.2 305.6L91 138.5L89.1 137.1L88.4 135.4\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M551.6 246.8L549.3 248.2L547.7 249.4L436.5 305L434.1 305.8L431.4 306L428.7 305.8L426.3 305L92.3 137.9L90.7 136.7L88.4 135.4\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M551.6 251.9L550.9 253.6L549 255L437.6 310.7L434.8 311.6L431.4 312L428.1 311.6L425.2 310.7L91 143.5L89.1 142.1L88.4 140.5\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M88.4 135.4L89.1 133.7L91 132.3L202.4 76.6L205.2 75.6L208.6 75.3L211.9 75.6L214.8 76.6L549 243.7L550.9 245.1L551.6 246.8M551.6 256.9L550.9 258.6L549 260L437.6 315.7L434.8 316.7L431.4 317L428.1 316.7L425.2 315.7L91 148.6L89.1 147.2L88.4 145.5M551.6 246.8L551.6 256.9M88.4 135.4L88.4 145.5\"/></g><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"208.6\" cy=\"81.7\" r=\"0.42\"/><circle cx=\"538.7\" cy=\"246.8\" r=\"0.42\"/><circle cx=\"101.3\" cy=\"135.4\" r=\"0.42\"/><circle cx=\"431.4\" cy=\"300.5\" r=\"0.42\"/></g><path class=\"iso-line\" data-tone=\"mid\" d=\"M109.5 139.5L423.2 296.3\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M101.9 136L102.5 134.5L104.2 133.3L106.6 132.5L109.5 132.2L112.4 132.5L114.9 133.3L116.5 134.5L117.1 136L117.1 139.5L116.5 141L114.9 142.2L112.4 143L109.5 143.3L106.6 143L104.2 142.2L102.5 141L101.9 139.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M114.9 142.2L112.4 143L112.4 139.5L114.9 138.7ZM117.1 139.5L116.5 141L116.5 137.4L117.1 136ZM116.5 141L114.9 142.2L114.9 138.7L116.5 137.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M112.4 143L109.5 143.3L109.5 139.8L112.4 139.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M109.5 143.3L106.6 143L106.6 139.5L109.5 139.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M106.6 143L104.2 142.2L104.2 138.7L106.6 139.5ZM104.2 142.2L102.5 141L102.5 137.4L104.2 138.7ZM102.5 141L101.9 139.5L101.9 136L102.5 137.4Z\"/><path class=\"iso-top\" d=\"M114.9 138.7L112.4 139.5L109.5 139.8L106.6 139.5L104.2 138.7L102.5 137.4L101.9 136L102.5 134.5L104.2 133.3L106.6 132.5L109.5 132.2L112.4 132.5L114.9 133.3L116.5 134.5L117.1 136L116.5 137.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M117.1 136L116.5 137.4L114.9 138.7L112.4 139.5L109.5 139.8L106.6 139.5L104.2 138.7L102.5 137.4L101.9 136\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M101.9 136L102.5 134.5L104.2 133.3L106.6 132.5L109.5 132.2L112.4 132.5L114.9 133.3L116.5 134.5L117.1 136M117.1 139.5L116.5 141L114.9 142.2L112.4 143L109.5 143.3L106.6 143L104.2 142.2L102.5 141L101.9 139.5M101.9 136L101.9 139.5M117.1 136L117.1 139.5\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"109.5\" cy=\"136\" r=\"0.5\"/></g><path class=\"iso-line\" data-tone=\"mid\" d=\"M192.1 172.5L183.8 176.7\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M353 253L344.8 257.1\"/><g data-part=\"audio\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M142 90.1L142.7 88.4L144.6 87L223 47.8L225.9 46.9L229.2 46.5L232.6 46.9L235.4 47.8L330.3 95.3L332.2 96.7L332.9 98.4L332.9 154L332.2 155.6L330.3 157.1L251.9 196.3L249.1 197.2L245.7 197.6L242.4 197.2L239.5 196.3L144.6 148.8L142.7 147.4L142 145.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M332.9 154L332.2 155.6L332.2 100L332.9 98.4ZM332.2 155.6L330.3 157.1L330.3 101.5L332.2 100ZM330.3 157.1L251.9 196.3L251.9 140.7L330.3 101.5ZM251.9 196.3L249.1 197.2L249.1 141.6L251.9 140.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M249.1 197.2L245.7 197.6L245.7 142L249.1 141.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M245.7 197.6L242.4 197.2L242.4 141.6L245.7 142Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M242.4 197.2L239.5 196.3L239.5 140.7L242.4 141.6ZM239.5 196.3L144.6 148.8L144.6 93.2L239.5 140.7ZM144.6 148.8L142.7 147.4L142.7 91.8L144.6 93.2ZM142.7 147.4L142 145.7L142 90.1L142.7 91.8Z\"/><path class=\"iso-top\" d=\"M330.3 95.3L332.2 96.7L332.9 98.4L332.2 100L330.3 101.5L251.9 140.7L249.1 141.6L245.7 142L242.4 141.6L239.5 140.7L144.6 93.2L142.7 91.8L142 90.1L142.7 88.4L144.6 87L223 47.8L225.9 46.9L229.2 46.5L232.6 46.9L235.4 47.8Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M332.9 98.4L332.2 100L330.3 101.5L251.9 140.7L249.1 141.6L245.7 142L242.4 141.6L239.5 140.7L144.6 93.2L142.7 91.8L142 90.1\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M332.9 98.4L330.9 99.8L329.2 101L251 140.1L248.5 140.9L245.7 141.2L242.9 140.9L240.5 140.1L145.7 92.8L144.1 91.5L142 90.1\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M332.9 107.2L332.2 108.9L330.3 110.3L251.9 149.5L249.1 150.5L245.7 150.8L242.4 150.5L239.5 149.5L144.6 102.1L142.7 100.6L142 99\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M142 90.1L142.7 88.4L144.6 87L223 47.8L225.9 46.9L229.2 46.5L232.6 46.9L235.4 47.8L330.3 95.3L332.2 96.7L332.9 98.4M332.9 154L332.2 155.6L330.3 157.1L251.9 196.3L249.1 197.2L245.7 197.6L242.4 197.2L239.5 196.3L144.6 148.8L142.7 147.4L142 145.7M332.9 98.4L332.9 154M142 90.1L142 145.7\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M214.3 62.6L215.2 61.8L232.9 53L234.5 52.5L236.3 52.5L237.9 53L315.5 91.8L316.4 92.5L316.4 95.7L315.5 96.5L297.7 105.4L296.1 105.8L294.3 105.8L292.8 105.4L215.2 66.6L214.3 65.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M316.4 95.7L315.5 96.5L315.5 94.2L316.4 93.5ZM315.5 96.5L297.7 105.4L297.7 103.1L315.5 94.2ZM297.7 105.4L296.1 105.8L296.1 103.6L297.7 103.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M296.1 105.8L294.3 105.8L294.3 103.6L296.1 103.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M294.3 105.8L292.8 105.4L292.8 103.1L294.3 103.6ZM292.8 105.4L215.2 66.6L215.2 64.3L292.8 103.1ZM215.2 66.6L214.3 65.8L214.3 63.5L215.2 64.3Z\"/><path class=\"iso-top\" d=\"M315.5 91.8L316.4 92.5L316.4 93.5L315.5 94.2L297.7 103.1L296.1 103.6L294.3 103.6L292.8 103.1L215.2 64.3L214.3 63.5L214.3 62.6L215.2 61.8L232.9 53L234.5 52.5L236.3 52.5L237.9 53Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M316.4 93.5L315.5 94.2L297.7 103.1L296.1 103.6L294.3 103.6L292.8 103.1L215.2 64.3L214.3 63.5\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M316.4 93.5L315 94.1L297.4 102.9L296 103.3L294.5 103.3L293.1 102.9L215.6 64.1L214.3 63.5\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M214.3 63.5L214.3 62.6L215.2 61.8L232.9 53L234.5 52.5L236.3 52.5L237.9 53L315.5 91.8L316.4 92.5L316.4 93.5M316.4 95.7L315.5 96.5L297.7 105.4L296.1 105.8L294.3 105.8L292.8 105.4L215.2 66.6L214.3 65.8M316.4 93.5L316.4 95.7M214.3 63.5L214.3 65.8\"/></g><path class=\"iso-line\" data-tone=\"mid\" d=\"M311.3 93L295.2 101L219.3 63.1L235.4 55Z\"/><path class=\"iso-line\" data-tone=\"hi\" d=\"M227.4 59.1L241.3 61.2L239.2 69.8L259.6 68.7L255.8 79.7L274.6 79.5L277.3 87.2L292.7 90.1L303.3 97\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M218.9 97.3L214.3 99.2L209 100.4L203.3 101.1L197.4 101.1L191.6 100.4L186.3 99.2L181.7 97.3L178.1 95L175.5 92.4L174.2 89.5L174.2 86.6L175.5 83.7L178.1 81.1L181.7 78.8L186.3 76.9L191.6 75.7L197.4 75L203.3 75L209 75.7L214.3 76.9L218.9 78.8L222.6 81.1L225.1 83.7L226.4 86.6L226.4 89.5L225.1 92.4L222.6 95ZM205.7 90.7L202.8 91.6L199.5 91.8L196.3 91.3L193.9 90.1L192.8 88.5L193.2 86.8L195 85.4L197.8 84.5L201.2 84.3L204.4 84.8L206.7 86L207.9 87.6L207.5 89.3ZM268.4 122.1L263.8 123.9L258.5 125.2L252.8 125.9L246.9 125.9L241.2 125.2L235.9 123.9L231.3 122.1L227.6 119.8L225.1 117.2L223.7 114.3L223.7 111.3L225.1 108.5L227.6 105.8L231.3 103.5L235.9 101.7L241.2 100.4L246.9 99.8L252.8 99.8L258.5 100.4L263.8 101.7L268.4 103.5L272.1 105.8L274.6 108.5L275.9 111.3L275.9 114.3L274.6 117.2L272.1 119.8ZM255.2 115.5L252.3 116.4L249 116.6L245.8 116L243.4 114.8L242.3 113.2L242.7 111.6L244.5 110.1L247.3 109.2L250.7 109L253.9 109.6L256.3 110.8L257.4 112.4L257 114.1Z\"/><path class=\"iso-line\" data-tone=\"lo\" d=\"M181.7 97.3L231.3 122.1\"/><path data-part=\"spokes\" class=\"iso-line\" data-tone=\"hi\" d=\"\"/></g><g data-part=\"notes\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M303 185.8L303.7 184.1L305.6 182.7L384 143.5L386.8 142.5L390.2 142.2L393.5 142.5L396.3 143.5L491.3 190.9L493.2 192.3L493.8 194L493.8 234.4L493.2 236.1L491.3 237.5L412.9 276.7L410 277.7L406.7 278L403.3 277.7L400.5 276.7L305.6 229.3L303.7 227.9L303 226.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M493.8 234.4L493.2 236.1L493.2 195.7L493.8 194ZM493.2 236.1L491.3 237.5L491.3 197.1L493.2 195.7ZM491.3 237.5L412.9 276.7L412.9 236.3L491.3 197.1ZM412.9 276.7L410 277.7L410 237.3L412.9 236.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M410 277.7L406.7 278L406.7 237.6L410 237.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M406.7 278L403.3 277.7L403.3 237.3L406.7 237.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M403.3 277.7L400.5 276.7L400.5 236.3L403.3 237.3ZM400.5 276.7L305.6 229.3L305.6 188.9L400.5 236.3ZM305.6 229.3L303.7 227.9L303.7 187.4L305.6 188.9ZM303.7 227.9L303 226.2L303 185.8L303.7 187.4Z\"/><path class=\"iso-top\" d=\"M491.3 190.9L493.2 192.3L493.8 194L493.2 195.7L491.3 197.1L412.9 236.3L410 237.3L406.7 237.6L403.3 237.3L400.5 236.3L305.6 188.9L303.7 187.4L303 185.8L303.7 184.1L305.6 182.7L384 143.5L386.8 142.5L390.2 142.2L393.5 142.5L396.3 143.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M493.8 194L493.2 195.7L491.3 197.1L412.9 236.3L410 237.3L406.7 237.6L403.3 237.3L400.5 236.3L305.6 188.9L303.7 187.4L303 185.8\"/><path class=\"iso-line iso-bevel\" data-tone=\"lo\" d=\"M493.8 194L491.8 195.4L490.1 196.6L411.9 235.7L409.5 236.6L406.7 236.9L403.9 236.6L401.4 235.7L306.7 188.4L305 187.2L303 185.8\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M493.8 202.9L493.2 204.5L491.3 205.9L412.9 245.2L410 246.1L406.7 246.4L403.3 246.1L400.5 245.2L305.6 197.7L303.7 196.3L303 194.6\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M303 185.8L303.7 184.1L305.6 182.7L384 143.5L386.8 142.5L390.2 142.2L393.5 142.5L396.3 143.5L491.3 190.9L493.2 192.3L493.8 194M493.8 234.4L493.2 236.1L491.3 237.5L412.9 276.7L410 277.7L406.7 278L403.3 277.7L400.5 276.7L305.6 229.3L303.7 227.9L303 226.2M493.8 194L493.8 234.4M303 185.8L303 226.2\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M375.2 158.3L376.1 157.5L393.9 148.6L395.4 148.2L397.3 148.2L398.8 148.6L447.5 173L448.4 173.7L448.4 176.9L447.5 177.7L429.8 186.6L428.2 187L426.4 187L424.8 186.6L376.1 162.2L375.2 161.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M448.4 176.9L447.5 177.7L447.5 175.4L448.4 174.6ZM447.5 177.7L429.8 186.6L429.8 184.3L447.5 175.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M429.8 186.6L428.2 187L428.2 184.8L429.8 184.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M428.2 187L426.4 187L426.4 184.8L428.2 184.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M426.4 187L424.8 186.6L424.8 184.3L426.4 184.8ZM424.8 186.6L376.1 162.2L376.1 160L424.8 184.3ZM376.1 162.2L375.2 161.4L375.2 159.2L376.1 160Z\"/><path class=\"iso-top\" d=\"M447.5 173L448.4 173.7L448.4 174.6L447.5 175.4L429.8 184.3L428.2 184.8L426.4 184.8L424.8 184.3L376.1 160L375.2 159.2L375.2 158.3L376.1 157.5L393.9 148.6L395.4 148.2L397.3 148.2L398.8 148.6Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M448.4 174.6L447.5 175.4L429.8 184.3L428.2 184.8L426.4 184.8L424.8 184.3L376.1 160L375.2 159.2\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M448.4 174.6L447.1 175.3L429.4 184.1L428.1 184.5L426.5 184.5L425.2 184.1L376.6 159.8L375.2 159.2\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M375.2 159.2L375.2 158.3L376.1 157.5L393.9 148.6L395.4 148.2L397.3 148.2L398.8 148.6L447.5 173L448.4 173.7L448.4 174.6M448.4 176.9L447.5 177.7L429.8 186.6L428.2 187L426.4 187L424.8 186.6L376.1 162.2L375.2 161.4M448.4 174.6L448.4 176.9M375.2 159.2L375.2 161.4\"/></g><path class=\"iso-line\" data-tone=\"mid\" d=\"M443.4 174.2L427.3 182.2L380.3 158.7L396.3 150.7Z\"/><path class=\"iso-line\" data-tone=\"hi\" d=\"M380.3 158.7L404.1 156.2L407.9 163.7L423 171.2L427.3 182.2\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M442.9 182.8L443.5 181.2L445.3 179.9L447.9 179L451 178.7L454.2 179L456.8 179.9L458.6 181.2L459.2 182.8L459.2 188.3L458.6 189.9L456.8 191.2L454.2 192.1L451 192.4L447.9 192.1L445.3 191.2L443.5 189.9L442.9 188.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M456.8 191.2L454.2 192.1L454.2 186.5L456.8 185.7ZM459.2 188.3L458.6 189.9L458.6 184.3L459.2 182.8ZM458.6 189.9L456.8 191.2L456.8 185.7L458.6 184.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M454.2 192.1L451 192.4L451 186.9L454.2 186.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M451 192.4L447.9 192.1L447.9 186.5L451 186.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M447.9 192.1L445.3 191.2L445.3 185.7L447.9 186.5ZM445.3 191.2L443.5 189.9L443.5 184.3L445.3 185.7ZM443.5 189.9L442.9 188.3L442.9 182.8L443.5 184.3Z\"/><path class=\"iso-top\" d=\"M456.8 185.7L454.2 186.5L451 186.9L447.9 186.5L445.3 185.7L443.5 184.3L442.9 182.8L443.5 181.2L445.3 179.9L447.9 179L451 178.7L454.2 179L456.8 179.9L458.6 181.2L459.2 182.8L458.6 184.3Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M459.2 182.8L458.6 184.3L456.8 185.7L454.2 186.5L451 186.9L447.9 186.5L445.3 185.7L443.5 184.3L442.9 182.8\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M459.2 182.8L457.8 184.2L456.2 185.4L453.8 186.1L451 186.4L448.2 186.1L445.9 185.4L444.3 184.2L442.9 182.8\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M442.9 182.8L443.5 181.2L445.3 179.9L447.9 179L451 178.7L454.2 179L456.8 179.9L458.6 181.2L459.2 182.8M459.2 188.3L458.6 189.9L456.8 191.2L454.2 192.1L451 192.4L447.9 192.1L445.3 191.2L443.5 189.9L442.9 188.3M442.9 182.8L442.9 188.3M459.2 182.8L459.2 188.3\"/></g><path class=\"iso-line\" data-tone=\"hi\" data-free=\"start\" d=\"M451 182.8L458.6 181.2\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M459.4 191L460 189.5L461.8 188.1L464.4 187.3L467.5 186.9L470.7 187.3L473.3 188.1L475.1 189.5L475.7 191L475.7 196.6L475.1 198.2L473.3 199.5L470.7 200.4L467.5 200.7L464.4 200.4L461.8 199.5L460 198.2L459.4 196.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M473.3 199.5L470.7 200.4L470.7 194.8L473.3 193.9ZM475.7 196.6L475.1 198.2L475.1 192.6L475.7 191ZM475.1 198.2L473.3 199.5L473.3 193.9L475.1 192.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M470.7 200.4L467.5 200.7L467.5 195.1L470.7 194.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M467.5 200.7L464.4 200.4L464.4 194.8L467.5 195.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M464.4 200.4L461.8 199.5L461.8 193.9L464.4 194.8ZM461.8 199.5L460 198.2L460 192.6L461.8 193.9ZM460 198.2L459.4 196.6L459.4 191L460 192.6Z\"/><path class=\"iso-top\" d=\"M473.3 193.9L470.7 194.8L467.5 195.1L464.4 194.8L461.8 193.9L460 192.6L459.4 191L460 189.5L461.8 188.1L464.4 187.3L467.5 186.9L470.7 187.3L473.3 188.1L475.1 189.5L475.7 191L475.1 192.6Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M475.7 191L475.1 192.6L473.3 193.9L470.7 194.8L467.5 195.1L464.4 194.8L461.8 193.9L460 192.6L459.4 191\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M475.7 191L474.3 192.4L472.7 193.6L470.3 194.4L467.5 194.7L464.7 194.4L462.4 193.6L460.8 192.4L459.4 191\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M459.4 191L460 189.5L461.8 188.1L464.4 187.3L467.5 186.9L470.7 187.3L473.3 188.1L475.1 189.5L475.7 191M475.7 196.6L475.1 198.2L473.3 199.5L470.7 200.4L467.5 200.7L464.4 200.4L461.8 199.5L460 198.2L459.4 196.6M459.4 191L459.4 196.6M475.7 191L475.7 196.6\"/></g><path class=\"iso-line\" data-tone=\"hi\" data-free=\"start\" d=\"M467.5 191L468.8 195.1\"/><g data-part=\"key-0\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M323.8 187.4L324.3 186.8L367.3 165.3L368.5 165.1L369.7 165.3L376.7 168.8L377.3 169.4L377.3 173.5L376.7 174.1L333.8 195.6L332.6 195.8L331.3 195.6L324.3 192L323.8 191.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M377.3 173.5L376.7 174.1L376.7 170.1L377.3 169.4ZM376.7 174.1L333.8 195.6L333.8 191.5L376.7 170.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M333.8 195.6L332.6 195.8L332.6 191.8L333.8 191.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M332.6 195.8L331.3 195.6L331.3 191.5L332.6 191.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M331.3 195.6L324.3 192L324.3 188L331.3 191.5ZM324.3 192L323.8 191.4L323.8 187.4L324.3 188Z\"/><path class=\"iso-top\" d=\"M376.7 168.8L377.3 169.4L376.7 170.1L333.8 191.5L332.6 191.8L331.3 191.5L324.3 188L323.8 187.4L324.3 186.8L367.3 165.3L368.5 165.1L369.7 165.3Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M377.3 169.4L376.7 170.1L333.8 191.5L332.6 191.8L331.3 191.5L324.3 188L323.8 187.4\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M377.3 169.4L376.3 169.9L333.5 191.3L332.6 191.5L331.7 191.3L324.8 187.8L323.8 187.4\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M323.8 187.4L324.3 186.8L367.3 165.3L368.5 165.1L369.7 165.3L376.7 168.8L377.3 169.4M377.3 173.5L376.7 174.1L333.8 195.6L332.6 195.8L331.3 195.6L324.3 192L323.8 191.4M377.3 169.4L377.3 173.5M323.8 187.4L323.8 191.4\"/></g></g><g data-part=\"key-1\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M334.1 192.5L334.7 191.9L377.6 170.5L378.8 170.2L380 170.5L387.1 174L387.6 174.6L387.6 178.6L387.1 179.3L344.1 200.7L342.9 201L341.7 200.7L334.7 197.2L334.1 196.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M387.6 178.6L387.1 179.3L387.1 175.2L387.6 174.6ZM387.1 179.3L344.1 200.7L344.1 196.7L387.1 175.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M344.1 200.7L342.9 201L342.9 196.9L344.1 196.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M342.9 201L341.7 200.7L341.7 196.7L342.9 196.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M341.7 200.7L334.7 197.2L334.7 193.2L341.7 196.7ZM334.7 197.2L334.1 196.6L334.1 192.5L334.7 193.2Z\"/><path class=\"iso-top\" d=\"M387.1 174L387.6 174.6L387.1 175.2L344.1 196.7L342.9 196.9L341.7 196.7L334.7 193.2L334.1 192.5L334.7 191.9L377.6 170.5L378.8 170.2L380 170.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M387.6 174.6L387.1 175.2L344.1 196.7L342.9 196.9L341.7 196.7L334.7 193.2L334.1 192.5\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M387.6 174.6L386.6 175L343.8 196.4L342.9 196.6L342 196.4L335.1 193L334.1 192.5\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M334.1 192.5L334.7 191.9L377.6 170.5L378.8 170.2L380 170.5L387.1 174L387.6 174.6M387.6 178.6L387.1 179.3L344.1 200.7L342.9 201L341.7 200.7L334.7 197.2L334.1 196.6M387.6 174.6L387.6 178.6M334.1 192.5L334.1 196.6\"/></g></g><g data-part=\"key-2\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M344.5 197.7L345 197.1L387.9 175.6L389.1 175.4L390.4 175.6L397.4 179.1L397.9 179.8L397.9 183.8L397.4 184.4L354.5 205.9L353.2 206.1L352 205.9L345 202.4L344.5 201.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M397.9 183.8L397.4 184.4L397.4 180.4L397.9 179.8ZM397.4 184.4L354.5 205.9L354.5 201.8L397.4 180.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M354.5 205.9L353.2 206.1L353.2 202.1L354.5 201.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M353.2 206.1L352 205.9L352 201.8L353.2 202.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M352 205.9L345 202.4L345 198.3L352 201.8ZM345 202.4L344.5 201.7L344.5 197.7L345 198.3Z\"/><path class=\"iso-top\" d=\"M397.4 179.1L397.9 179.8L397.4 180.4L354.5 201.8L353.2 202.1L352 201.8L345 198.3L344.5 197.7L345 197.1L387.9 175.6L389.1 175.4L390.4 175.6Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M397.9 179.8L397.4 180.4L354.5 201.8L353.2 202.1L352 201.8L345 198.3L344.5 197.7\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M397.9 179.8L396.9 180.2L354.1 201.6L353.2 201.8L352.3 201.6L345.5 198.2L344.5 197.7\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M344.5 197.7L345 197.1L387.9 175.6L389.1 175.4L390.4 175.6L397.4 179.1L397.9 179.8M397.9 183.8L397.4 184.4L354.5 205.9L353.2 206.1L352 205.9L345 202.4L344.5 201.7M397.9 179.8L397.9 183.8M344.5 197.7L344.5 201.7\"/></g></g><g data-part=\"key-3\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M354.8 202.9L355.3 202.2L398.2 180.8L399.4 180.5L400.7 180.8L407.7 184.3L408.2 184.9L408.2 189L407.7 189.6L364.8 211L363.5 211.3L362.3 211L355.3 207.5L354.8 206.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M408.2 189L407.7 189.6L407.7 185.5L408.2 184.9ZM407.7 189.6L364.8 211L364.8 207L407.7 185.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M364.8 211L363.5 211.3L363.5 207.2L364.8 207Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M363.5 211.3L362.3 211L362.3 207L363.5 207.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M362.3 211L355.3 207.5L355.3 203.5L362.3 207ZM355.3 207.5L354.8 206.9L354.8 202.9L355.3 203.5Z\"/><path class=\"iso-top\" d=\"M407.7 184.3L408.2 184.9L407.7 185.5L364.8 207L363.5 207.2L362.3 207L355.3 203.5L354.8 202.9L355.3 202.2L398.2 180.8L399.4 180.5L400.7 180.8Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M408.2 184.9L407.7 185.5L364.8 207L363.5 207.2L362.3 207L355.3 203.5L354.8 202.9\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M408.2 184.9L407.2 185.4L364.5 206.7L363.5 207L362.6 206.7L355.8 203.3L354.8 202.9\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M354.8 202.9L355.3 202.2L398.2 180.8L399.4 180.5L400.7 180.8L407.7 184.3L408.2 184.9M408.2 189L407.7 189.6L364.8 211L363.5 211.3L362.3 211L355.3 207.5L354.8 206.9M408.2 184.9L408.2 189M354.8 202.9L354.8 206.9\"/></g></g><g data-part=\"key-4\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M365.1 208L365.6 207.4L408.5 185.9L409.8 185.7L411 185.9L418 189.4L418.5 190.1L418.5 194.1L418 194.7L375.1 216.2L373.9 216.4L372.6 216.2L365.6 212.7L365.1 212.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M418.5 194.1L418 194.7L418 190.7L418.5 190.1ZM418 194.7L375.1 216.2L375.1 212.1L418 190.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M375.1 216.2L373.9 216.4L373.9 212.4L375.1 212.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M373.9 216.4L372.6 216.2L372.6 212.1L373.9 212.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M372.6 216.2L365.6 212.7L365.6 208.6L372.6 212.1ZM365.6 212.7L365.1 212.1L365.1 208L365.6 208.6Z\"/><path class=\"iso-top\" d=\"M418 189.4L418.5 190.1L418 190.7L375.1 212.1L373.9 212.4L372.6 212.1L365.6 208.6L365.1 208L365.6 207.4L408.5 185.9L409.8 185.7L411 185.9Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M418.5 190.1L418 190.7L375.1 212.1L373.9 212.4L372.6 212.1L365.6 208.6L365.1 208\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M418.5 190.1L417.5 190.5L374.8 211.9L373.9 212.1L372.9 211.9L366.1 208.5L365.1 208\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M365.1 208L365.6 207.4L408.5 185.9L409.8 185.7L411 185.9L418 189.4L418.5 190.1M418.5 194.1L418 194.7L375.1 216.2L373.9 216.4L372.6 216.2L365.6 212.7L365.1 212.1M418.5 190.1L418.5 194.1M365.1 208L365.1 212.1\"/></g></g><g data-part=\"key-5\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M375.4 213.2L375.9 212.6L418.8 191.1L420.1 190.8L421.3 191.1L428.3 194.6L428.8 195.2L428.8 199.3L428.3 199.9L385.4 221.3L384.2 221.6L382.9 221.3L375.9 217.8L375.4 217.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M428.8 199.3L428.3 199.9L428.3 195.8L428.8 195.2ZM428.3 199.9L385.4 221.3L385.4 217.3L428.3 195.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M385.4 221.3L384.2 221.6L384.2 217.6L385.4 217.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M384.2 221.6L382.9 221.3L382.9 217.3L384.2 217.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M382.9 221.3L375.9 217.8L375.9 213.8L382.9 217.3ZM375.9 217.8L375.4 217.2L375.4 213.2L375.9 213.8Z\"/><path class=\"iso-top\" d=\"M428.3 194.6L428.8 195.2L428.3 195.8L385.4 217.3L384.2 217.6L382.9 217.3L375.9 213.8L375.4 213.2L375.9 212.6L418.8 191.1L420.1 190.8L421.3 191.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M428.8 195.2L428.3 195.8L385.4 217.3L384.2 217.6L382.9 217.3L375.9 213.8L375.4 213.2\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M428.8 195.2L427.8 195.7L385.1 217.1L384.2 217.3L383.3 217.1L376.4 213.6L375.4 213.2\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M375.4 213.2L375.9 212.6L418.8 191.1L420.1 190.8L421.3 191.1L428.3 194.6L428.8 195.2M428.8 199.3L428.3 199.9L385.4 221.3L384.2 221.6L382.9 221.3L375.9 217.8L375.4 217.2M428.8 195.2L428.8 199.3M375.4 213.2L375.4 217.2\"/></g></g><g data-part=\"key-6\"><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M385.7 218.3L386.2 217.7L429.2 196.3L430.4 196L431.6 196.3L438.6 199.8L439.2 200.4L439.2 204.4L438.6 205L395.7 226.5L394.5 226.8L393.3 226.5L386.2 223L385.7 222.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M439.2 204.4L438.6 205L438.6 201L439.2 200.4ZM438.6 205L395.7 226.5L395.7 222.5L438.6 201Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M395.7 226.5L394.5 226.8L394.5 222.7L395.7 222.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M394.5 226.8L393.3 226.5L393.3 222.5L394.5 222.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M393.3 226.5L386.2 223L386.2 219L393.3 222.5ZM386.2 223L385.7 222.4L385.7 218.3L386.2 219Z\"/><path class=\"iso-top\" d=\"M438.6 199.8L439.2 200.4L438.6 201L395.7 222.5L394.5 222.7L393.3 222.5L386.2 219L385.7 218.3L386.2 217.7L429.2 196.3L430.4 196L431.6 196.3Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M439.2 200.4L438.6 201L395.7 222.5L394.5 222.7L393.3 222.5L386.2 219L385.7 218.3\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M439.2 200.4L438.2 200.8L395.4 222.2L394.5 222.4L393.6 222.2L386.7 218.8L385.7 218.3\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M385.7 218.3L386.2 217.7L429.2 196.3L430.4 196L431.6 196.3L438.6 199.8L439.2 200.4M439.2 204.4L438.6 205L395.7 226.5L394.5 226.8L393.3 226.5L386.2 223L385.7 222.4M439.2 200.4L439.2 204.4M385.7 218.3L385.7 222.4\"/></g></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M349.1 178L349.5 177.5L374.3 165.1L375.3 164.9L376.3 165.1L380.5 167.1L380.9 167.7L380.9 171.2L380.5 171.7L355.7 184.1L354.7 184.3L353.6 184.1L349.5 182L349.1 181.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M380.9 171.2L380.5 171.7L380.5 168.2L380.9 167.7ZM380.5 171.7L355.7 184.1L355.7 180.5L380.5 168.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M355.7 184.1L354.7 184.3L354.7 180.8L355.7 180.5Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M354.7 184.3L353.6 184.1L353.6 180.5L354.7 180.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M353.6 184.1L349.5 182L349.5 178.5L353.6 180.5ZM349.5 182L349.1 181.5L349.1 178L349.5 178.5Z\"/><path class=\"iso-top\" d=\"M380.5 167.1L380.9 167.7L380.5 168.2L355.7 180.5L354.7 180.8L353.6 180.5L349.5 178.5L349.1 178L349.5 177.5L374.3 165.1L375.3 164.9L376.3 165.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M380.9 167.7L380.5 168.2L355.7 180.5L354.7 180.8L353.6 180.5L349.5 178.5L349.1 178\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M349.1 178L349.5 177.5L374.3 165.1L375.3 164.9L376.3 165.1L380.5 167.1L380.9 167.7M380.9 171.2L380.5 171.7L355.7 184.1L354.7 184.3L353.6 184.1L349.5 182L349.1 181.5M380.9 167.7L380.9 171.2M349.1 178L349.1 181.5\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M359.4 183.1L359.8 182.6L384.6 170.2L385.6 170L386.6 170.2L390.8 172.3L391.2 172.8L391.2 176.3L390.8 176.9L366 189.2L365 189.5L364 189.2L359.8 187.2L359.4 186.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M391.2 176.3L390.8 176.9L390.8 173.3L391.2 172.8ZM390.8 176.9L366 189.2L366 185.7L390.8 173.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M366 189.2L365 189.5L365 185.9L366 185.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M365 189.5L364 189.2L364 185.7L365 185.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M364 189.2L359.8 187.2L359.8 183.6L364 185.7ZM359.8 187.2L359.4 186.7L359.4 183.1L359.8 183.6Z\"/><path class=\"iso-top\" d=\"M390.8 172.3L391.2 172.8L390.8 173.3L366 185.7L365 185.9L364 185.7L359.8 183.6L359.4 183.1L359.8 182.6L384.6 170.2L385.6 170L386.6 170.2Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M391.2 172.8L390.8 173.3L366 185.7L365 185.9L364 185.7L359.8 183.6L359.4 183.1\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M359.4 183.1L359.8 182.6L384.6 170.2L385.6 170L386.6 170.2L390.8 172.3L391.2 172.8M391.2 176.3L390.8 176.9L366 189.2L365 189.5L364 189.2L359.8 187.2L359.4 186.7M391.2 172.8L391.2 176.3M359.4 183.1L359.4 186.7\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M380 193.4L380.5 192.9L405.2 180.5L406.3 180.3L407.3 180.5L411.4 182.6L411.8 183.1L411.8 186.7L411.4 187.2L386.6 199.6L385.6 199.8L384.6 199.6L380.5 197.5L380 197Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M411.8 186.7L411.4 187.2L411.4 183.6L411.8 183.1ZM411.4 187.2L386.6 199.6L386.6 196L411.4 183.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M386.6 199.6L385.6 199.8L385.6 196.2L386.6 196Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M385.6 199.8L384.6 199.6L384.6 196L385.6 196.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M384.6 199.6L380.5 197.5L380.5 194L384.6 196ZM380.5 197.5L380 197L380 193.4L380.5 194Z\"/><path class=\"iso-top\" d=\"M411.4 182.6L411.8 183.1L411.4 183.6L386.6 196L385.6 196.2L384.6 196L380.5 194L380 193.4L380.5 192.9L405.2 180.5L406.3 180.3L407.3 180.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M411.8 183.1L411.4 183.6L386.6 196L385.6 196.2L384.6 196L380.5 194L380 193.4\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M380 193.4L380.5 192.9L405.2 180.5L406.3 180.3L407.3 180.5L411.4 182.6L411.8 183.1M411.8 186.7L411.4 187.2L386.6 199.6L385.6 199.8L384.6 199.6L380.5 197.5L380 197M411.8 183.1L411.8 186.7M380 193.4L380 197\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M390.3 198.6L390.8 198.1L415.5 185.7L416.6 185.5L417.6 185.7L421.7 187.8L422.2 188.3L422.2 191.8L421.7 192.3L397 204.7L395.9 204.9L394.9 204.7L390.8 202.7L390.3 202.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M422.2 191.8L421.7 192.3L421.7 188.8L422.2 188.3ZM421.7 192.3L397 204.7L397 201.2L421.7 188.8Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M397 204.7L395.9 204.9L395.9 201.4L397 201.2Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M395.9 204.9L394.9 204.7L394.9 201.2L395.9 201.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M394.9 204.7L390.8 202.7L390.8 199.1L394.9 201.2ZM390.8 202.7L390.3 202.1L390.3 198.6L390.8 199.1Z\"/><path class=\"iso-top\" d=\"M421.7 187.8L422.2 188.3L421.7 188.8L397 201.2L395.9 201.4L394.9 201.2L390.8 199.1L390.3 198.6L390.8 198.1L415.5 185.7L416.6 185.5L417.6 185.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M422.2 188.3L421.7 188.8L397 201.2L395.9 201.4L394.9 201.2L390.8 199.1L390.3 198.6\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M390.3 198.6L390.8 198.1L415.5 185.7L416.6 185.5L417.6 185.7L421.7 187.8L422.2 188.3M422.2 191.8L421.7 192.3L397 204.7L395.9 204.9L394.9 204.7L390.8 202.7L390.3 202.1M422.2 188.3L422.2 191.8M390.3 198.6L390.3 202.1\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M400.7 203.8L401.1 203.2L425.9 190.9L426.9 190.7L427.9 190.9L432 192.9L432.5 193.4L432.5 197L432 197.5L407.3 209.9L406.3 210.1L405.2 209.9L401.1 207.8L400.7 207.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M432.5 197L432 197.5L432 194L432.5 193.4ZM432 197.5L407.3 209.9L407.3 206.3L432 194Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M407.3 209.9L406.3 210.1L406.3 206.6L407.3 206.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M406.3 210.1L405.2 209.9L405.2 206.3L406.3 206.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M405.2 209.9L401.1 207.8L401.1 204.3L405.2 206.3ZM401.1 207.8L400.7 207.3L400.7 203.8L401.1 204.3Z\"/><path class=\"iso-top\" d=\"M432 192.9L432.5 193.4L432 194L407.3 206.3L406.3 206.6L405.2 206.3L401.1 204.3L400.7 203.8L401.1 203.2L425.9 190.9L426.9 190.7L427.9 190.9Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M432.5 193.4L432 194L407.3 206.3L406.3 206.6L405.2 206.3L401.1 204.3L400.7 203.8\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M400.7 203.8L401.1 203.2L425.9 190.9L426.9 190.7L427.9 190.9L432 192.9L432.5 193.4M432.5 197L432 197.5L407.3 209.9L406.3 210.1L405.2 209.9L401.1 207.8L400.7 207.3M432.5 193.4L432.5 197M400.7 203.8L400.7 207.3\"/></g></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M415.6 292.8L416.2 291.4L417.8 290.1L420.3 289.3L423.2 289L426.1 289.3L428.5 290.1L430.2 291.4L430.8 292.8L430.8 296.3L430.2 297.8L428.5 299L426.1 299.9L423.2 300.1L420.3 299.9L417.8 299L416.2 297.8L415.6 296.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M428.5 299L426.1 299.9L426.1 296.3L428.5 295.5ZM430.8 296.3L430.2 297.8L430.2 294.3L430.8 292.8ZM430.2 297.8L428.5 299L428.5 295.5L430.2 294.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M426.1 299.9L423.2 300.1L423.2 296.6L426.1 296.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M423.2 300.1L420.3 299.9L420.3 296.3L423.2 296.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M420.3 299.9L417.8 299L417.8 295.5L420.3 296.3ZM417.8 299L416.2 297.8L416.2 294.3L417.8 295.5ZM416.2 297.8L415.6 296.3L415.6 292.8L416.2 294.3Z\"/><path class=\"iso-top\" d=\"M428.5 295.5L426.1 296.3L423.2 296.6L420.3 296.3L417.8 295.5L416.2 294.3L415.6 292.8L416.2 291.4L417.8 290.1L420.3 289.3L423.2 289L426.1 289.3L428.5 290.1L430.2 291.4L430.8 292.8L430.2 294.3Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M430.8 292.8L430.2 294.3L428.5 295.5L426.1 296.3L423.2 296.6L420.3 296.3L417.8 295.5L416.2 294.3L415.6 292.8\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M415.6 292.8L416.2 291.4L417.8 290.1L420.3 289.3L423.2 289L426.1 289.3L428.5 290.1L430.2 291.4L430.8 292.8M430.8 296.3L430.2 297.8L428.5 299L426.1 299.9L423.2 300.1L420.3 299.9L417.8 299L416.2 297.8L415.6 296.3M415.6 292.8L415.6 296.3M430.8 292.8L430.8 296.3\"/></g><g class=\"iso-dots\" data-tone=\"hi\"><circle cx=\"423.2\" cy=\"292.8\" r=\"0.5\"/></g></svg></div>";
const P = {"origin":[320,201.22056821459537],"scale":2.3069999880832937,"azimuth":45,"elevation":30}, LINE_Y = 26, RAIL_TOP = 4, PORTS = [-76,76];
const lineX = (place) => PORTS[0] + place * (PORTS[1] - PORTS[0]);
const pd = (points) => points.map(([x, y], i) => (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1)).join("");
const moveTo = (node, [x, y]) => { node.setAttribute("cx", x.toFixed(1)); node.setAttribute("cy", y.toFixed(1)); };
const REELS = [[-52,6],[-28,6]], REEL_R = 9, HUB_R = 2.6, REEL_Z = 26, WHITE = 7, REST = 0.25, LAP = 9, ALIVE = true, STOPS = [0.25, 0.75], SPAN = [0.12, 0.88];
const ORDER = [0, 2, 4, 6, 5, 3, 1];
function setup(part) {
  const spokes = part("spokes"), audio = part("audio"), notes = part("notes"), keys = Array.from({ length: WHITE }, (_, i) => part("key-" + i));
  let spin = 0;
  return (place, seconds, dt) => {
    const playsAudio = place < 0.5;
    if (playsAudio) spin += dt * 1.6;
    spokes.setAttribute("d", REELS.map(([x, y]) => [0, 1, 2].map((n) => { const a = spin + (n * Math.PI * 2) / 3; return pd([iso([x + HUB_R * Math.cos(a), y + HUB_R * Math.sin(a), REEL_Z], P), iso([x + REEL_R * Math.cos(a), y + REEL_R * Math.sin(a), REEL_Z], P)]); }).join("")).join(""));
    const down = playsAudio ? -1 : ORDER[Math.floor(seconds * 2.5) % ORDER.length];
    keys.forEach((key, i) => key.setAttribute("transform", translateAlong(P, [0, 0, i === down ? -1.1 : 0])));
    // the one that plays wears the lit edge
    audio.firstElementChild.toggleAttribute("data-lit", playsAudio);
    notes.firstElementChild.toggleAttribute("data-lit", !playsAudio);
    return playsAudio ? "Audio" : "Notes";
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
