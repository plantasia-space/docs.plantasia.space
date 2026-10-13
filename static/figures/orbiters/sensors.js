// Built by figures/src/orbiter-sensors/build.mjs. Do not edit by hand.
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

export const svg = "<div class=\"iso-stage\" tabindex=\"0\" role=\"slider\" aria-label=\"The tilt handset: up and down arrows tip the phone and turn Y, left and right arrows roll it and turn Z, Shift with left and right turns it and turns X, Home brings it back to the centre\" aria-valuemin=\"-180\" aria-valuemax=\"180\" aria-valuenow=\"0\"><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"iso-svg\" viewBox=\"0 0 640 400\" role=\"img\" aria-label=\"A phone held on a ball joint over a hull deck, beside a bridge of three knobs. Turning the phone turns the first knob, X. Tipping it front to back turns the second, Y. Rolling it side to side turns the third, Z. Each knob rests at 0°, its needle straight up, where the phone was calibrated.\"><path class=\"iso-halo\" d=\"M109.8 262L110.1 260.2L111.1 258.6L112.8 257L115 255.7L323.8 151.3L326.5 150.2L329.5 149.4L332.9 148.9L336.4 148.7L339.8 148.9L343.2 149.4L346.2 150.2L348.9 151.3L525 239.3L527.2 240.7L528.9 242.2L529.9 243.9L530.2 245.6L530.2 261L529.9 262.8L528.9 264.4L527.2 266L525 267.3L316.2 371.7L313.5 372.8L310.5 373.6L307.1 374.1L303.6 374.3L300.2 374.1L296.8 373.6L293.8 372.8L291.1 371.7L115 283.7L112.8 282.3L111.1 280.8L110.1 279.1L109.8 277.4Z\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M322.2 188.9L322.2 187.3L322.9 185.8L324.3 184.3L326.3 183.1L328.8 182.1L331.7 181.4L334.8 181.1L337.9 181.1L341.1 181.4L343.9 182.1L346.4 183.1L348.4 184.3L349.8 185.8L350.5 187.3L350.5 191.4L349.8 192.9L348.4 194.4L346.4 195.6L343.9 196.6L341.1 197.3L337.9 197.7L334.8 197.7L331.7 197.3L328.8 196.6L326.3 195.6L324.3 194.4L322.9 192.9L322.2 191.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M346.4 195.6L343.9 196.6L343.9 194.2L346.4 193.2ZM350.5 191.4L349.8 192.9L349.8 190.5L350.5 188.9ZM349.8 192.9L348.4 194.4L348.4 191.9L349.8 190.5ZM348.4 194.4L346.4 195.6L346.4 193.2L348.4 191.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M343.9 196.6L341.1 197.3L341.1 194.8L343.9 194.2ZM341.1 197.3L337.9 197.7L337.9 195.2L341.1 194.8ZM337.9 197.7L334.8 197.7L334.8 195.2L337.9 195.2Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M334.8 197.7L331.7 197.3L331.7 194.8L334.8 195.2ZM331.7 197.3L328.8 196.6L328.8 194.2L331.7 194.8Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M328.8 196.6L326.3 195.6L326.3 193.2L328.8 194.2ZM326.3 195.6L324.3 194.4L324.3 191.9L326.3 193.2ZM324.3 194.4L322.9 192.9L322.9 190.5L324.3 191.9ZM322.9 192.9L322.2 191.4L322.2 188.9L322.9 190.5Z\"/><path class=\"iso-top\" d=\"M346.4 193.2L343.9 194.2L341.1 194.8L337.9 195.2L334.8 195.2L331.7 194.8L328.8 194.2L326.3 193.2L324.3 191.9L322.9 190.5L322.2 188.9L322.2 187.3L322.9 185.8L324.3 184.3L326.3 183.1L328.8 182.1L331.7 181.4L334.8 181.1L337.9 181.1L341.1 181.4L343.9 182.1L346.4 183.1L348.4 184.3L349.8 185.8L350.5 187.3L350.5 188.9L349.8 190.5L348.4 191.9Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M350.5 188.9L349.8 190.5L348.4 191.9L346.4 193.2L343.9 194.2L341.1 194.8L337.9 195.2L334.8 195.2L331.7 194.8L328.8 194.2L326.3 193.2L324.3 191.9L322.9 190.5L322.2 188.9\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M322.2 188.9L322.2 187.3L322.9 185.8L324.3 184.3L326.3 183.1L328.8 182.1L331.7 181.4L334.8 181.1L337.9 181.1L341.1 181.4L343.9 182.1L346.4 183.1L348.4 184.3L349.8 185.8L350.5 187.3L350.5 188.9M350.5 191.4L349.8 192.9L348.4 194.4L346.4 195.6L343.9 196.6L341.1 197.3L337.9 197.7L334.8 197.7L331.7 197.3L328.8 196.6L326.3 195.6L324.3 194.4L322.9 192.9L322.2 191.4M322.2 188.9L322.2 191.4M350.5 188.9L350.5 191.4\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M325.7 182.3L326.3 181.1L327.3 180.1L328.8 179.1L330.7 178.4L332.8 177.9L335.2 177.6L337.5 177.6L339.9 177.9L342 178.4L343.9 179.1L345.4 180.1L346.4 181.1L347 182.3L347 188.7L346.4 189.9L345.4 191L343.9 191.9L342 192.7L339.9 193.2L337.5 193.4L335.2 193.4L332.8 193.2L330.7 192.7L328.8 191.9L327.3 191L326.3 189.9L325.7 188.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M343.9 191.9L342 192.7L342 187.4L343.9 186.7ZM347 188.7L346.4 189.9L346.4 184.7L347 183.5ZM346.4 189.9L345.4 191L345.4 185.7L346.4 184.7ZM345.4 191L343.9 191.9L343.9 186.7L345.4 185.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M342 192.7L339.9 193.2L339.9 187.9L342 187.4ZM339.9 193.2L337.5 193.4L337.5 188.2L339.9 187.9ZM337.5 193.4L335.2 193.4L335.2 188.2L337.5 188.2Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M335.2 193.4L332.8 193.2L332.8 187.9L335.2 188.2ZM332.8 193.2L330.7 192.7L330.7 187.4L332.8 187.9Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M330.7 192.7L328.8 191.9L328.8 186.7L330.7 187.4ZM328.8 191.9L327.3 191L327.3 185.7L328.8 186.7ZM327.3 191L326.3 189.9L326.3 184.7L327.3 185.7ZM326.3 189.9L325.7 188.7L325.7 183.5L326.3 184.7Z\"/><path class=\"iso-top\" d=\"M343.9 186.7L342 187.4L339.9 187.9L337.5 188.2L335.2 188.2L332.8 187.9L330.7 187.4L328.8 186.7L327.3 185.7L326.3 184.7L325.7 183.5L325.7 182.3L326.3 181.1L327.3 180.1L328.8 179.1L330.7 178.4L332.8 177.9L335.2 177.6L337.5 177.6L339.9 177.9L342 178.4L343.9 179.1L345.4 180.1L346.4 181.1L347 182.3L347 183.5L346.4 184.7L345.4 185.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M347 183.5L346.4 184.7L345.4 185.7L343.9 186.7L342 187.4L339.9 187.9L337.5 188.2L335.2 188.2L332.8 187.9L330.7 187.4L328.8 186.7L327.3 185.7L326.3 184.7L325.7 183.5\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M325.7 183.5L325.7 182.3L326.3 181.1L327.3 180.1L328.8 179.1L330.7 178.4L332.8 177.9L335.2 177.6L337.5 177.6L339.9 177.9L342 178.4L343.9 179.1L345.4 180.1L346.4 181.1L347 182.3L347 183.5M347 188.7L346.4 189.9L345.4 191L343.9 191.9L342 192.7L339.9 193.2L337.5 193.4L335.2 193.4L332.8 193.2L330.7 192.7L328.8 191.9L327.3 191L326.3 189.9L325.7 188.7M325.7 183.5L325.7 188.7M347 183.5L347 188.7\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M463.1 259.4L463.1 257.8L463.8 256.2L465.2 254.8L467.2 253.5L469.6 252.5L472.5 251.9L475.6 251.5L478.8 251.5L481.9 251.9L484.8 252.5L487.3 253.5L489.3 254.8L490.6 256.2L491.4 257.8L491.4 261.8L490.6 263.4L489.3 264.8L487.3 266.1L484.8 267.1L481.9 267.7L478.8 268.1L475.6 268.1L472.5 267.7L469.6 267.1L467.2 266.1L465.2 264.8L463.8 263.4L463.1 261.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M487.3 266.1L484.8 267.1L484.8 264.6L487.3 263.6ZM491.4 261.8L490.6 263.4L490.6 260.9L491.4 259.4ZM490.6 263.4L489.3 264.8L489.3 262.4L490.6 260.9ZM489.3 264.8L487.3 266.1L487.3 263.6L489.3 262.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M484.8 267.1L481.9 267.7L481.9 265.3L484.8 264.6ZM481.9 267.7L478.8 268.1L478.8 265.6L481.9 265.3Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M478.8 268.1L475.6 268.1L475.6 265.6L478.8 265.6ZM475.6 268.1L472.5 267.7L472.5 265.3L475.6 265.6ZM472.5 267.7L469.6 267.1L469.6 264.6L472.5 265.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M469.6 267.1L467.2 266.1L467.2 263.6L469.6 264.6ZM467.2 266.1L465.2 264.8L465.2 262.4L467.2 263.6ZM465.2 264.8L463.8 263.4L463.8 260.9L465.2 262.4ZM463.8 263.4L463.1 261.8L463.1 259.4L463.8 260.9Z\"/><path class=\"iso-top\" d=\"M487.3 263.6L484.8 264.6L481.9 265.3L478.8 265.6L475.6 265.6L472.5 265.3L469.6 264.6L467.2 263.6L465.2 262.4L463.8 260.9L463.1 259.4L463.1 257.8L463.8 256.2L465.2 254.8L467.2 253.5L469.6 252.5L472.5 251.9L475.6 251.5L478.8 251.5L481.9 251.9L484.8 252.5L487.3 253.5L489.3 254.8L490.6 256.2L491.4 257.8L491.4 259.4L490.6 260.9L489.3 262.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M491.4 259.4L490.6 260.9L489.3 262.4L487.3 263.6L484.8 264.6L481.9 265.3L478.8 265.6L475.6 265.6L472.5 265.3L469.6 264.6L467.2 263.6L465.2 262.4L463.8 260.9L463.1 259.4\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M463.1 259.4L463.1 257.8L463.8 256.2L465.2 254.8L467.2 253.5L469.6 252.5L472.5 251.9L475.6 251.5L478.8 251.5L481.9 251.9L484.8 252.5L487.3 253.5L489.3 254.8L490.6 256.2L491.4 257.8L491.4 259.4M491.4 261.8L490.6 263.4L489.3 264.8L487.3 266.1L484.8 267.1L481.9 267.7L478.8 268.1L475.6 268.1L472.5 267.7L469.6 267.1L467.2 266.1L465.2 264.8L463.8 263.4L463.1 261.8M463.1 259.4L463.1 261.8M491.4 259.4L491.4 261.8\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M466.6 252.7L467.1 251.6L468.2 250.5L469.7 249.6L471.5 248.8L473.7 248.3L476 248L478.4 248L480.7 248.3L482.9 248.8L484.8 249.6L486.3 250.5L487.3 251.6L487.8 252.7L487.8 259.2L487.3 260.3L486.3 261.4L484.8 262.3L482.9 263.1L480.7 263.6L478.4 263.9L476 263.9L473.7 263.6L471.5 263.1L469.7 262.3L468.2 261.4L467.1 260.3L466.6 259.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M484.8 262.3L482.9 263.1L482.9 257.8L484.8 257.1ZM487.8 259.2L487.3 260.3L487.3 255.1L487.8 253.9ZM487.3 260.3L486.3 261.4L486.3 256.2L487.3 255.1ZM486.3 261.4L484.8 262.3L484.8 257.1L486.3 256.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M482.9 263.1L480.7 263.6L480.7 258.4L482.9 257.8ZM480.7 263.6L478.4 263.9L478.4 258.6L480.7 258.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M478.4 263.9L476 263.9L476 258.6L478.4 258.6ZM476 263.9L473.7 263.6L473.7 258.4L476 258.6ZM473.7 263.6L471.5 263.1L471.5 257.8L473.7 258.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M471.5 263.1L469.7 262.3L469.7 257.1L471.5 257.8ZM469.7 262.3L468.2 261.4L468.2 256.2L469.7 257.1ZM468.2 261.4L467.1 260.3L467.1 255.1L468.2 256.2ZM467.1 260.3L466.6 259.2L466.6 253.9L467.1 255.1Z\"/><path class=\"iso-top\" d=\"M484.8 257.1L482.9 257.8L480.7 258.4L478.4 258.6L476 258.6L473.7 258.4L471.5 257.8L469.7 257.1L468.2 256.2L467.1 255.1L466.6 253.9L466.6 252.7L467.1 251.6L468.2 250.5L469.7 249.6L471.5 248.8L473.7 248.3L476 248L478.4 248L480.7 248.3L482.9 248.8L484.8 249.6L486.3 250.5L487.3 251.6L487.8 252.7L487.8 253.9L487.3 255.1L486.3 256.2Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M487.8 253.9L487.3 255.1L486.3 256.2L484.8 257.1L482.9 257.8L480.7 258.4L478.4 258.6L476 258.6L473.7 258.4L471.5 257.8L469.7 257.1L468.2 256.2L467.1 255.1L466.6 253.9\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M466.6 253.9L466.6 252.7L467.1 251.6L468.2 250.5L469.7 249.6L471.5 248.8L473.7 248.3L476 248L478.4 248L480.7 248.3L482.9 248.8L484.8 249.6L486.3 250.5L487.3 251.6L487.8 252.7L487.8 253.9M487.8 259.2L487.3 260.3L486.3 261.4L484.8 262.3L482.9 263.1L480.7 263.6L478.4 263.9L476 263.9L473.7 263.6L471.5 263.1L469.7 262.3L468.2 261.4L467.1 260.3L466.6 259.2M466.6 253.9L466.6 259.2M487.8 253.9L487.8 259.2\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M148.6 274.1L149.4 272.6L150.7 271.1L152.7 269.9L155.2 268.9L158.1 268.2L161.2 267.8L164.4 267.8L167.5 268.2L170.4 268.9L172.8 269.9L174.8 271.1L176.2 272.6L176.9 274.1L176.9 276.6L176.9 278.2L176.2 279.7L174.8 281.2L172.8 282.4L170.4 283.4L167.5 284.1L164.4 284.5L161.2 284.5L158.1 284.1L155.2 283.4L152.7 282.4L150.7 281.2L149.4 279.7L148.6 278.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M172.8 282.4L170.4 283.4L170.4 280.9L172.8 279.9ZM176.9 278.2L176.2 279.7L176.2 277.3L176.9 275.7ZM176.2 279.7L174.8 281.2L174.8 278.7L176.2 277.3ZM174.8 281.2L172.8 282.4L172.8 279.9L174.8 278.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M170.4 283.4L167.5 284.1L167.5 281.6L170.4 280.9ZM167.5 284.1L164.4 284.5L164.4 282L167.5 281.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M164.4 284.5L161.2 284.5L161.2 282L164.4 282ZM161.2 284.5L158.1 284.1L158.1 281.6L161.2 282ZM158.1 284.1L155.2 283.4L155.2 280.9L158.1 281.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M155.2 283.4L152.7 282.4L152.7 279.9L155.2 280.9ZM152.7 282.4L150.7 281.2L150.7 278.7L152.7 279.9ZM150.7 281.2L149.4 279.7L149.4 277.3L150.7 278.7ZM149.4 279.7L148.6 278.2L148.6 275.7L149.4 277.3Z\"/><path class=\"iso-top\" d=\"M172.8 279.9L170.4 280.9L167.5 281.6L164.4 282L161.2 282L158.1 281.6L155.2 280.9L152.7 279.9L150.7 278.7L149.4 277.3L148.6 275.7L148.6 274.1L149.4 272.6L150.7 271.1L152.7 269.9L155.2 268.9L158.1 268.2L161.2 267.8L164.4 267.8L167.5 268.2L170.4 268.9L172.8 269.9L174.8 271.1L176.2 272.6L176.9 274.1L176.9 275.7L176.2 277.3L174.8 278.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M176.9 275.7L176.2 277.3L174.8 278.7L172.8 279.9L170.4 280.9L167.5 281.6L164.4 282L161.2 282L158.1 281.6L155.2 280.9L152.7 279.9L150.7 278.7L149.4 277.3L148.6 275.7\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M148.6 275.7L148.6 274.1L149.4 272.6L150.7 271.1L152.7 269.9L155.2 268.9L158.1 268.2L161.2 267.8L164.4 267.8L167.5 268.2L170.4 268.9L172.8 269.9L174.8 271.1L176.2 272.6L176.9 274.1L176.9 275.7M176.9 278.2L176.2 279.7L174.8 281.2L172.8 282.4L170.4 283.4L167.5 284.1L164.4 284.5L161.2 284.5L158.1 284.1L155.2 283.4L152.7 282.4L150.7 281.2L149.4 279.7L148.6 278.2M148.6 275.7L148.6 278.2M176.9 275.7L176.9 278.2\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M152.2 269.1L152.7 267.9L153.7 266.8L155.2 265.9L157.1 265.2L159.3 264.6L161.6 264.4L164 264.4L166.3 264.6L168.5 265.2L170.3 265.9L171.8 266.8L172.9 267.9L173.4 269.1L173.4 275.5L172.9 276.7L171.8 277.8L170.3 278.7L168.5 279.4L166.3 280L164 280.2L161.6 280.2L159.3 280L157.1 279.4L155.2 278.7L153.7 277.8L152.7 276.7L152.2 275.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M170.3 278.7L168.5 279.4L168.5 274.2L170.3 273.5ZM173.4 275.5L172.9 276.7L172.9 271.4L173.4 270.3ZM172.9 276.7L171.8 277.8L171.8 272.5L172.9 271.4ZM171.8 277.8L170.3 278.7L170.3 273.5L171.8 272.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M168.5 279.4L166.3 280L166.3 274.7L168.5 274.2ZM166.3 280L164 280.2L164 275L166.3 274.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M164 280.2L161.6 280.2L161.6 275L164 275ZM161.6 280.2L159.3 280L159.3 274.7L161.6 275ZM159.3 280L157.1 279.4L157.1 274.2L159.3 274.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M157.1 279.4L155.2 278.7L155.2 273.5L157.1 274.2ZM155.2 278.7L153.7 277.8L153.7 272.5L155.2 273.5ZM153.7 277.8L152.7 276.7L152.7 271.4L153.7 272.5ZM152.7 276.7L152.2 275.5L152.2 270.3L152.7 271.4Z\"/><path class=\"iso-top\" d=\"M170.3 273.5L168.5 274.2L166.3 274.7L164 275L161.6 275L159.3 274.7L157.1 274.2L155.2 273.5L153.7 272.5L152.7 271.4L152.2 270.3L152.2 269.1L152.7 267.9L153.7 266.8L155.2 265.9L157.1 265.2L159.3 264.6L161.6 264.4L164 264.4L166.3 264.6L168.5 265.2L170.3 265.9L171.8 266.8L172.9 267.9L173.4 269.1L173.4 270.3L172.9 271.4L171.8 272.5Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M173.4 270.3L172.9 271.4L171.8 272.5L170.3 273.5L168.5 274.2L166.3 274.7L164 275L161.6 275L159.3 274.7L157.1 274.2L155.2 273.5L153.7 272.5L152.7 271.4L152.2 270.3\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M152.2 270.3L152.2 269.1L152.7 267.9L153.7 266.8L155.2 265.9L157.1 265.2L159.3 264.6L161.6 264.4L164 264.4L166.3 264.6L168.5 265.2L170.3 265.9L171.8 266.8L172.9 267.9L173.4 269.1L173.4 270.3M173.4 275.5L172.9 276.7L171.8 277.8L170.3 278.7L168.5 279.4L166.3 280L164 280.2L161.6 280.2L159.3 280L157.1 279.4L155.2 278.7L153.7 277.8L152.7 276.7L152.2 275.5M152.2 270.3L152.2 275.5M173.4 270.3L173.4 275.5\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M289.5 344.6L290.2 343L291.6 341.6L293.6 340.3L296.1 339.3L298.9 338.6L302.1 338.3L305.2 338.3L308.3 338.6L311.2 339.3L313.7 340.3L315.7 341.6L317.1 343L317.8 344.6L317.8 348.6L317.1 350.2L315.7 351.6L313.7 352.8L311.2 353.8L308.3 354.5L305.2 354.9L302.1 354.9L298.9 354.5L296.1 353.8L293.6 352.8L291.6 351.6L290.2 350.2L289.5 348.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M313.7 352.8L311.2 353.8L311.2 351.4L313.7 350.4ZM317.8 348.6L317.1 350.2L317.1 347.7L317.8 346.1ZM317.1 350.2L315.7 351.6L315.7 349.1L317.1 347.7ZM315.7 351.6L313.7 352.8L313.7 350.4L315.7 349.1Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M311.2 353.8L308.3 354.5L308.3 352.1L311.2 351.4ZM308.3 354.5L305.2 354.9L305.2 352.4L308.3 352.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M305.2 354.9L302.1 354.9L302.1 352.4L305.2 352.4ZM302.1 354.9L298.9 354.5L298.9 352.1L302.1 352.4ZM298.9 354.5L296.1 353.8L296.1 351.4L298.9 352.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M296.1 353.8L293.6 352.8L293.6 350.4L296.1 351.4ZM293.6 352.8L291.6 351.6L291.6 349.1L293.6 350.4ZM291.6 351.6L290.2 350.2L290.2 347.7L291.6 349.1ZM290.2 350.2L289.5 348.6L289.5 346.1L290.2 347.7Z\"/><path class=\"iso-top\" d=\"M313.7 350.4L311.2 351.4L308.3 352.1L305.2 352.4L302.1 352.4L298.9 352.1L296.1 351.4L293.6 350.4L291.6 349.1L290.2 347.7L289.5 346.1L289.5 344.6L290.2 343L291.6 341.6L293.6 340.3L296.1 339.3L298.9 338.6L302.1 338.3L305.2 338.3L308.3 338.6L311.2 339.3L313.7 340.3L315.7 341.6L317.1 343L317.8 344.6L317.8 346.1L317.1 347.7L315.7 349.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M317.8 346.1L317.1 347.7L315.7 349.1L313.7 350.4L311.2 351.4L308.3 352.1L305.2 352.4L302.1 352.4L298.9 352.1L296.1 351.4L293.6 350.4L291.6 349.1L290.2 347.7L289.5 346.1\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M289.5 346.1L289.5 344.6L290.2 343L291.6 341.6L293.6 340.3L296.1 339.3L298.9 338.6L302.1 338.3L305.2 338.3L308.3 338.6L311.2 339.3L313.7 340.3L315.7 341.6L317.1 343L317.8 344.6L317.8 346.1M317.8 348.6L317.1 350.2L315.7 351.6L313.7 352.8L311.2 353.8L308.3 354.5L305.2 354.9L302.1 354.9L298.9 354.5L296.1 353.8L293.6 352.8L291.6 351.6L290.2 350.2L289.5 348.6M289.5 346.1L289.5 348.6M317.8 346.1L317.8 348.6\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M293 339.5L293.6 338.3L294.6 337.3L296.1 336.3L298 335.6L300.1 335.1L302.5 334.8L304.8 334.8L307.2 335.1L309.3 335.6L311.2 336.3L312.7 337.3L313.7 338.3L314.3 339.5L314.3 345.9L313.7 347.1L312.7 348.2L311.2 349.1L309.3 349.9L307.2 350.4L304.8 350.7L302.5 350.7L300.1 350.4L298 349.9L296.1 349.1L294.6 348.2L293.6 347.1L293 345.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M311.2 349.1L309.3 349.9L309.3 344.6L311.2 343.9ZM314.3 345.9L313.7 347.1L313.7 341.9L314.3 340.7ZM313.7 347.1L312.7 348.2L312.7 343L313.7 341.9ZM312.7 348.2L311.2 349.1L311.2 343.9L312.7 343Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M309.3 349.9L307.2 350.4L307.2 345.1L309.3 344.6ZM307.2 350.4L304.8 350.7L304.8 345.4L307.2 345.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M304.8 350.7L302.5 350.7L302.5 345.4L304.8 345.4ZM302.5 350.7L300.1 350.4L300.1 345.1L302.5 345.4ZM300.1 350.4L298 349.9L298 344.6L300.1 345.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M298 349.9L296.1 349.1L296.1 343.9L298 344.6ZM296.1 349.1L294.6 348.2L294.6 343L296.1 343.9ZM294.6 348.2L293.6 347.1L293.6 341.9L294.6 343ZM293.6 347.1L293 345.9L293 340.7L293.6 341.9Z\"/><path class=\"iso-top\" d=\"M311.2 343.9L309.3 344.6L307.2 345.1L304.8 345.4L302.5 345.4L300.1 345.1L298 344.6L296.1 343.9L294.6 343L293.6 341.9L293 340.7L293 339.5L293.6 338.3L294.6 337.3L296.1 336.3L298 335.6L300.1 335.1L302.5 334.8L304.8 334.8L307.2 335.1L309.3 335.6L311.2 336.3L312.7 337.3L313.7 338.3L314.3 339.5L314.3 340.7L313.7 341.9L312.7 343Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M314.3 340.7L313.7 341.9L312.7 343L311.2 343.9L309.3 344.6L307.2 345.1L304.8 345.4L302.5 345.4L300.1 345.1L298 344.6L296.1 343.9L294.6 343L293.6 341.9L293 340.7\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M293 340.7L293 339.5L293.6 338.3L294.6 337.3L296.1 336.3L298 335.6L300.1 335.1L302.5 334.8L304.8 334.8L307.2 335.1L309.3 335.6L311.2 336.3L312.7 337.3L313.7 338.3L314.3 339.5L314.3 340.7M314.3 345.9L313.7 347.1L312.7 348.2L311.2 349.1L309.3 349.9L307.2 350.4L304.8 350.7L302.5 350.7L300.1 350.4L298 349.9L296.1 349.1L294.6 348.2L293.6 347.1L293 345.9M293 340.7L293 345.9M314.3 340.7L314.3 345.9\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M109.8 254.3L110.1 252.5L111.1 250.9L112.8 249.3L115 248L323.8 143.6L326.5 142.5L329.5 141.7L332.9 141.2L336.4 141L339.8 141.2L343.2 141.7L346.2 142.5L348.9 143.6L525 231.6L527.2 233L528.9 234.5L529.9 236.2L530.2 237.9L530.2 253.3L529.9 255.1L528.9 256.7L527.2 258.3L525 259.6L316.2 364L313.5 365.1L310.5 365.9L307.1 366.4L303.6 366.6L300.2 366.4L296.8 365.9L293.8 365.1L291.1 364L115 276L112.8 274.6L111.1 273.1L110.1 271.4L109.8 269.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M530.2 253.3L529.9 255.1L529.9 239.7L530.2 237.9ZM529.9 255.1L528.9 256.7L528.9 241.3L529.9 239.7ZM528.9 256.7L527.2 258.3L527.2 242.9L528.9 241.3ZM527.2 258.3L525 259.6L525 244.2L527.2 242.9ZM525 259.6L316.2 364L316.2 348.6L525 244.2ZM316.2 364L313.5 365.1L313.5 349.7L316.2 348.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M313.5 365.1L310.5 365.9L310.5 350.5L313.5 349.7ZM310.5 365.9L307.1 366.4L307.1 351L310.5 350.5ZM307.1 366.4L303.6 366.6L303.6 351.2L307.1 351Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M303.6 366.6L300.2 366.4L300.2 351L303.6 351.2ZM300.2 366.4L296.8 365.9L296.8 350.5L300.2 351ZM296.8 365.9L293.8 365.1L293.8 349.7L296.8 350.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M293.8 365.1L291.1 364L291.1 348.6L293.8 349.7ZM291.1 364L115 276L115 260.6L291.1 348.6ZM115 276L112.8 274.6L112.8 259.2L115 260.6ZM112.8 274.6L111.1 273.1L111.1 257.7L112.8 259.2ZM111.1 273.1L110.1 271.4L110.1 256L111.1 257.7ZM110.1 271.4L109.8 269.7L109.8 254.3L110.1 256Z\"/><path class=\"iso-top\" d=\"M525 231.6L527.2 233L528.9 234.5L529.9 236.2L530.2 237.9L529.9 239.7L528.9 241.3L527.2 242.9L525 244.2L316.2 348.6L313.5 349.7L310.5 350.5L307.1 351L303.6 351.2L300.2 351L296.8 350.5L293.8 349.7L291.1 348.6L115 260.6L112.8 259.2L111.1 257.7L110.1 256L109.8 254.3L110.1 252.5L111.1 250.9L112.8 249.3L115 248L323.8 143.6L326.5 142.5L329.5 141.7L332.9 141.2L336.4 141L339.8 141.2L343.2 141.7L346.2 142.5L348.9 143.6Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M530.2 237.9L529.9 239.7L528.9 241.3L527.2 242.9L525 244.2L316.2 348.6L313.5 349.7L310.5 350.5L307.1 351L303.6 351.2L300.2 351L296.8 350.5L293.8 349.7L291.1 348.6L115 260.6L112.8 259.2L111.1 257.7L110.1 256L109.8 254.3\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M530.2 237.9L527.1 239.4L526.2 240.8L524.9 242.1L522.9 243.3L314.3 347.6L312 348.5L309.4 349.2L306.6 349.6L303.6 349.8L300.7 349.6L297.9 349.2L295.3 348.5L293 347.6L117.1 259.6L115.1 258.4L113.8 257.1L112.9 255.7L109.8 254.3\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M530.2 245.6L529.9 247.4L528.9 249L527.2 250.6L525 251.9L316.2 356.3L313.5 357.4L310.5 358.2L307.1 358.7L303.6 358.9L300.2 358.7L296.8 358.2L293.8 357.4L291.1 356.3L115 268.3L112.8 266.9L111.1 265.4L110.1 263.7L109.8 262\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M109.8 254.3L110.1 252.5L111.1 250.9L112.8 249.3L115 248L323.8 143.6L326.5 142.5L329.5 141.7L332.9 141.2L336.4 141L339.8 141.2L343.2 141.7L346.2 142.5L348.9 143.6L525 231.6L527.2 233L528.9 234.5L529.9 236.2L530.2 237.9M530.2 253.3L529.9 255.1L528.9 256.7L527.2 258.3L525 259.6L316.2 364L313.5 365.1L310.5 365.9L307.1 366.4L303.6 366.6L300.2 366.4L296.8 365.9L293.8 365.1L291.1 364L115 276L112.8 274.6L111.1 273.1L110.1 271.4L109.8 269.7M530.2 237.9L530.2 253.3M109.8 254.3L109.8 269.7\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M518.7 234.8L519.8 235.5L520.7 236.2L521.2 237.1L521.3 237.9L521.2 238.8L520.7 239.6L519.8 240.4L518.7 241.1L309.9 345.5L308.6 346L307.1 346.4L305.4 346.7L303.6 346.8L301.9 346.7L300.2 346.4L298.7 346L297.4 345.5L121.3 257.4L120.2 256.7L119.3 256L118.8 255.1L118.7 254.3L118.8 253.4L119.3 252.6L120.2 251.8L121.3 251.1L330.1 146.7L331.4 146.2L332.9 145.8L334.6 145.5L336.4 145.4L338.1 145.5L339.8 145.8L341.3 146.2L342.6 146.7Z\"/><path class=\"iso-line\" data-tone=\"lo\" d=\"M339.2 152.6L337.9 153L336.4 153.2L334.8 153L333.5 152.6L332.6 151.9L332.3 151.1L332.6 150.4L333.5 149.7L334.8 149.3L336.4 149.1L337.9 149.3L339.2 149.7L340.1 150.4L340.4 151.1L340.1 151.9ZM512.8 239.4L511.5 239.8L509.9 240L508.4 239.8L507 239.4L506.1 238.7L505.8 237.9L506.1 237.1L507 236.5L508.4 236L509.9 235.9L511.5 236L512.8 236.5L513.7 237.1L514 237.9L513.7 238.7ZM133 255.7L131.6 256.2L130.1 256.3L128.5 256.2L127.2 255.7L126.3 255.1L126 254.3L126.3 253.5L127.2 252.8L128.5 252.4L130.1 252.2L131.6 252.4L133 252.8L133.9 253.5L134.2 254.3L133.9 255.1ZM306.5 342.5L305.2 342.9L303.6 343.1L302.1 342.9L300.8 342.5L299.9 341.8L299.6 341.1L299.9 340.3L300.8 339.6L302.1 339.2L303.6 339L305.2 339.2L306.5 339.6L307.4 340.3L307.7 341.1L307.4 341.8Z\"/><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"336.4\" cy=\"151.1\" r=\"0.5\"/><circle cx=\"509.9\" cy=\"237.9\" r=\"0.5\"/><circle cx=\"130.1\" cy=\"254.3\" r=\"0.5\"/><circle cx=\"303.6\" cy=\"341.1\" r=\"0.5\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M330.3 161L330.5 160.4L331.3 159.8L351.4 149.7L352.6 149.3L354 149.2L355.3 149.3L356.5 149.7L514.9 229L515.7 229.5L516 230.2L516 237.9L515.7 238.6L514.9 239.2L494.8 249.2L493.7 249.6L492.3 249.8L490.9 249.6L489.8 249.2L331.3 170L330.5 169.4L330.3 168.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M516 237.9L515.7 238.6L515.7 230.9L516 230.2ZM515.7 238.6L514.9 239.2L514.9 231.5L515.7 230.9ZM514.9 239.2L494.8 249.2L494.8 241.5L514.9 231.5ZM494.8 249.2L493.7 249.6L493.7 241.9L494.8 241.5Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M493.7 249.6L492.3 249.8L492.3 242.1L493.7 241.9Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M492.3 249.8L490.9 249.6L490.9 241.9L492.3 242.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M490.9 249.6L489.8 249.2L489.8 241.5L490.9 241.9ZM489.8 249.2L331.3 170L331.3 162.3L489.8 241.5ZM331.3 170L330.5 169.4L330.5 161.7L331.3 162.3ZM330.5 169.4L330.3 168.7L330.3 161L330.5 161.7Z\"/><path class=\"iso-top\" d=\"M514.9 229L515.7 229.5L516 230.2L515.7 230.9L514.9 231.5L494.8 241.5L493.7 241.9L492.3 242.1L490.9 241.9L489.8 241.5L331.3 162.3L330.5 161.7L330.3 161L330.5 160.4L331.3 159.8L351.4 149.7L352.6 149.3L354 149.2L355.3 149.3L356.5 149.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M516 230.2L515.7 230.9L514.9 231.5L494.8 241.5L493.7 241.9L492.3 242.1L490.9 241.9L489.8 241.5L331.3 162.3L330.5 161.7L330.3 161\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M516 230.2L514.7 230.7L514.1 231.1L494.1 241.1L493.3 241.4L492.3 241.5L491.4 241.4L490.5 241.1L332.1 162L331.5 161.5L330.3 161\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M330.3 161L330.5 160.4L331.3 159.8L351.4 149.7L352.6 149.3L354 149.2L355.3 149.3L356.5 149.7L514.9 229L515.7 229.5L516 230.2M516 237.9L515.7 238.6L514.9 239.2L494.8 249.2L493.7 249.6L492.3 249.8L490.9 249.6L489.8 249.2L331.3 170L330.5 169.4L330.3 168.7M516 230.2L516 237.9M330.3 161L330.3 168.7\"/></g><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"354\" cy=\"153.5\" r=\"0.42\"/><circle cx=\"507.4\" cy=\"230.2\" r=\"0.42\"/><circle cx=\"338.9\" cy=\"161\" r=\"0.42\"/><circle cx=\"492.3\" cy=\"237.8\" r=\"0.42\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M346.3 29.5L346.5 29L347 28.5L352.1 26L352.9 25.7L354 25.6L355 25.7L355.8 26L500.5 98.3L501.1 98.8L501.3 99.3L501.3 230.2L501.1 230.7L500.5 231.2L495.5 233.7L494.6 234L493.6 234.1L492.5 234L491.7 233.7L347 161.4L346.5 160.9L346.3 160.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M501.3 230.2L501.1 230.7L501.1 99.8L501.3 99.3ZM501.1 230.7L500.5 231.2L500.5 100.2L501.1 99.8ZM500.5 231.2L495.5 233.7L495.5 102.7L500.5 100.2ZM495.5 233.7L494.6 234L494.6 103L495.5 102.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M494.6 234L493.6 234.1L493.6 103.1L494.6 103Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M493.6 234.1L492.5 234L492.5 103L493.6 103.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M492.5 234L491.7 233.7L491.7 102.7L492.5 103ZM491.7 233.7L347 161.4L347 30.4L491.7 102.7ZM347 161.4L346.5 160.9L346.5 30L347 30.4ZM346.5 160.9L346.3 160.4L346.3 29.5L346.5 30Z\"/><path class=\"iso-top\" d=\"M500.5 98.3L501.1 98.8L501.3 99.3L501.1 99.8L500.5 100.2L495.5 102.7L494.6 103L493.6 103.1L492.5 103L491.7 102.7L347 30.4L346.5 30L346.3 29.5L346.5 29L347 28.5L352.1 26L352.9 25.7L354 25.6L355 25.7L355.8 26Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M501.3 99.3L501.1 99.8L500.5 100.2L495.5 102.7L494.6 103L493.6 103.1L492.5 103L491.7 102.7L347 30.4L346.5 30L346.3 29.5\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M501.3 99.3L500.2 99.6L499.8 99.9L494.9 102.4L494.2 102.6L493.6 102.7L492.9 102.6L492.2 102.4L347.7 30.1L347.3 29.8L346.3 29.5\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M501.3 222.5L501.1 223L500.5 223.5L495.5 226L494.6 226.3L493.6 226.4L492.5 226.3L491.7 226L347 153.7L346.5 153.2L346.3 152.7\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M501.3 107L501.1 107.5L500.5 107.9L495.5 110.4L494.6 110.7L493.6 110.8L492.5 110.7L491.7 110.4L347 38.1L346.5 37.7L346.3 37.2\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M346.3 29.5L346.5 29L347 28.5L352.1 26L352.9 25.7L354 25.6L355 25.7L355.8 26L500.5 98.3L501.1 98.8L501.3 99.3M501.3 230.2L501.1 230.7L500.5 231.2L495.5 233.7L494.6 234L493.6 234.1L492.5 234L491.7 233.7L347 161.4L346.5 160.9L346.3 160.4M501.3 99.3L501.3 230.2M346.3 29.5L346.3 160.4\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M348.6 102.3L348.6 101L348.6 99.7L348.8 98.5L348.9 97.3L349.2 96.2L349.4 95L349.8 94L350.1 92.9L350.5 92L351 91L351.5 90.1L352 89.3L352.6 88.5L353.2 87.8L353.9 87.1L354.6 86.5L355.3 85.9L356.1 85.4L356.9 85L358.7 84.1L359.5 83.7L360.4 83.4L361.3 83.2L362.2 83L363.1 82.9L364.1 82.9L365.1 82.9L366.1 83L367.1 83.1L368.1 83.3L369.1 83.6L370.2 83.9L371.2 84.3L372.3 84.8L373.4 85.3L374.4 85.9L375.5 86.6L376.5 87.3L377.5 88L378.6 88.8L379.6 89.7L380.6 90.6L381.6 91.6L382.5 92.6L383.5 93.7L384.4 94.8L385.3 95.9L386.1 97.1L387 98.3L387.8 99.5L388.6 100.8L389.3 102.1L390 103.4L390.7 104.7L391.3 106.1L391.9 107.4L392.4 108.8L392.9 110.2L393.4 111.6L393.8 113L394.1 114.4L394.5 115.8L394.7 117.2L394.9 118.6L395.1 119.9L395.2 121.3L395.3 122.6L395.3 123.9L395.3 125.2L395.2 126.4L395.1 127.6L394.9 128.8L394.7 130L394.5 131.1L394.1 132.2L393.8 133.2L393.4 134.2L392.9 135.1L392.4 136L391.9 136.9L391.3 137.7L390.7 138.4L390 139.1L389.3 139.7L388.6 140.2L387.8 140.7L387 141.2L385.2 142L384.4 142.4L383.5 142.7L382.6 143L381.7 143.1L380.8 143.2L379.8 143.3L378.8 143.3L377.8 143.2L376.8 143L375.8 142.8L374.7 142.6L373.7 142.2L372.6 141.8L371.6 141.3L370.5 140.8L369.5 140.2L368.4 139.6L367.4 138.9L366.3 138.1L365.3 137.3L364.3 136.4L363.3 135.5L362.3 134.6L361.4 133.5L360.4 132.5L359.5 131.4L358.6 130.3L357.7 129.1L356.9 127.9L356.1 126.6L355.3 125.4L354.6 124.1L353.9 122.8L353.2 121.4L352.6 120.1L352 118.7L351.5 117.3L351 115.9L350.5 114.5L350.1 113.1L349.8 111.7L349.4 110.4L349.2 109L348.9 107.6L348.8 106.2L348.6 104.9L348.6 103.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M386 141.6L387.5 140.6L388.9 139.3L390.1 137.7L391.1 136L392 134.1L392.7 132L393.2 129.7L393.5 127.3L393.6 124.8L393.5 122.1L393.2 119.4L392.7 116.7L392 113.9L391.1 111.1L390.1 108.3L391.9 107.4L392.9 110.2L393.8 113L394.5 115.8L394.9 118.6L395.2 121.3L395.3 123.9L395.2 126.4L394.9 128.8L394.5 131.1L393.8 133.2L392.9 135.1L391.9 136.9L390.7 138.4L389.3 139.7L387.8 140.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M390.1 108.3L388.9 105.6L387.5 103L389.3 102.1L390.7 104.7L391.9 107.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M387.5 103L386 100.4L384.4 97.9L382.6 95.6L384.4 94.8L386.1 97.1L387.8 99.5L389.3 102.1Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M382.6 95.6L380.8 93.5L378.8 91.5L376.8 89.7L378.6 88.8L380.6 90.6L382.5 92.6L384.4 94.8ZM371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L371.1 113.5L393.6 124.8L393.5 127.3L393.2 129.7L392.7 132L392 134.1L391.1 136L390.1 137.7L388.9 139.3L387.5 140.6L386 141.6L384.4 142.4L382.6 143L380.8 143.2L378.8 143.3L376.8 143L374.7 142.6L372.6 141.8L370.5 140.8L368.4 139.6L366.3 138.1L364.3 136.4L362.3 134.6L360.4 132.5L358.6 130.3L356.9 127.9L355.3 125.4L353.9 122.8L352.6 120.1L351.5 117.3L350.5 114.5L349.8 111.7L349.2 109L348.8 106.2L348.6 103.6L348.6 101L348.8 98.5L349.2 96.2L349.8 94L350.5 92L351.5 90.1L352.6 88.5L353.9 87.1L355.3 85.9L356.9 85L358.6 84.3L360.4 83.9L362.3 83.7L364.3 83.8L366.3 84.2L368.4 84.8L370.5 85.7L372.6 86.8L374.7 88.2L376.8 89.7L378.8 91.5L380.8 93.5L382.6 95.6L384.4 97.9L386 100.4L387.5 103L388.9 105.6L390.1 108.3L391.1 111.1L392 113.9L392.7 116.7L393.2 119.4L393.5 122.1L393.6 124.8Z\"/><path class=\"iso-top\" d=\"M376.8 89.7L374.7 88.2L372.6 86.8L370.5 85.7L368.4 84.8L366.3 84.2L364.3 83.8L362.3 83.7L360.4 83.9L358.6 84.3L356.9 85L358.7 84.1L360.4 83.4L362.2 83L364.1 82.9L366.1 83L368.1 83.3L370.2 83.9L372.3 84.8L374.4 85.9L376.5 87.3L378.6 88.8Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M385.3 142L386.1 141.6L386.9 141.1L387.6 140.5L388.3 139.9L389 139.2L389.6 138.5L390.2 137.7L390.7 136.8L391.2 135.9L391.6 135L392.1 134L392.4 133L392.7 131.9L393 130.8L393.2 129.6L393.4 128.4L393.5 127.2L393.6 125.9L393.6 124.6L393.5 123.3L393.5 122L393.3 120.7L393.2 119.3L392.9 117.9L392.7 116.5L392.3 115.1L392 113.7L391.6 112.3L391.1 111L390.6 109.6L390 108.2L389.5 106.8L388.8 105.5L388.2 104.1L387.5 102.8L386.7 101.5L385.9 100.3L385.1 99L384.3 97.8L383.4 96.7L382.5 95.5L381.6 94.4L380.7 93.4L379.7 92.4L378.7 91.4L377.7 90.5L376.7 89.6L375.7 88.8L374.6 88.1L373.6 87.4L372.5 86.7L371.5 86.2L370.4 85.6L369.4 85.2L368.3 84.8L367.3 84.4L366.2 84.2L365.2 84L364.2 83.8L363.2 83.7L362.2 83.7L361.3 83.8L360.3 83.9L359.4 84.1L358.5 84.3L357.7 84.7L356.8 85\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M348.6 102.3L348.6 101L348.6 99.7L348.8 98.5L348.9 97.3L349.2 96.2L349.4 95L349.8 94L350.1 92.9L350.5 92L351 91L351.5 90.1L352 89.3L352.6 88.5L353.2 87.8L353.9 87.1L354.6 86.5L355.3 85.9L356.1 85.4L356.9 85L358.7 84.1L359.5 83.7L360.4 83.4L361.3 83.2L362.2 83L363.1 82.9L364.1 82.9L365.1 82.9L366.1 83L367.1 83.1L368.1 83.3L369.1 83.6L370.2 83.9L371.2 84.3L372.3 84.8L373.4 85.3L374.4 85.9L375.5 86.6L376.5 87.3L377.5 88L378.6 88.8L379.6 89.7L380.6 90.6L381.6 91.6L382.5 92.6L383.5 93.7L384.4 94.8L385.3 95.9L386.1 97.1L387 98.3L387.8 99.5L388.6 100.8L389.3 102.1L390 103.4L390.7 104.7L391.3 106.1L391.9 107.4L392.4 108.8L392.9 110.2L393.4 111.6L393.8 113L394.1 114.4L394.5 115.8L394.7 117.2L394.9 118.6L395.1 119.9L395.2 121.3L395.3 122.6L395.3 123.9L395.3 125.2L395.2 126.4L395.1 127.6L394.9 128.8L394.7 130L394.5 131.1L394.1 132.2L393.8 133.2L393.4 134.2L392.9 135.1L392.4 136L391.9 136.9L391.3 137.7L390.7 138.4L390 139.1L389.3 139.7L388.6 140.2L387.8 140.7L387 141.2L385.2 142L384.4 142.4L383.5 142.7L382.6 143L381.7 143.1L380.8 143.2L379.8 143.3L378.8 143.3L377.8 143.2L376.8 143L375.8 142.8L374.7 142.6L373.7 142.2L372.6 141.8L371.6 141.3L370.5 140.8L369.5 140.2L368.4 139.6L367.4 138.9L366.3 138.1L365.3 137.3L364.3 136.4L363.3 135.5L362.3 134.6L361.4 133.5L360.4 132.5L359.5 131.4L358.6 130.3L357.7 129.1L356.9 127.9L356.1 126.6L355.3 125.4L354.6 124.1L353.9 122.8L353.2 121.4L352.6 120.1L352 118.7L351.5 117.3L351 115.9L350.5 114.5L350.1 113.1L349.8 111.7L349.4 110.4L349.2 109L348.9 107.6L348.8 106.2L348.6 104.9L348.6 103.6Z\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M347 106L347.1 104.8L347.2 103.5L347.3 102.3L347.5 101.1L347.8 100L348.1 98.9L348.4 97.9L348.8 96.9L349.3 96L349.8 95.1L350.4 94.3L351 93.6L351.7 92.9L352.4 92.3L353.1 91.7L353.9 91.3L358.4 89L359.3 88.6L360.1 88.3L361 88L361.9 87.9L362.9 87.8L363.8 87.7L364.8 87.8L365.8 87.9L366.9 88.1L367.9 88.4L369 88.7L370 89.1L371.1 89.6L372.1 90.2L373.2 90.8L374.2 91.5L375.3 92.3L376.3 93.1L377.3 94L378.3 94.9L379.2 95.9L380.2 97L381.1 98.1L382 99.2L382.9 100.4L383.7 101.6L384.5 102.9L385.2 104.2L385.9 105.5L386.6 106.8L387.2 108.2L387.8 109.6L388.3 110.9L388.8 112.3L389.2 113.7L389.5 115.1L389.8 116.5L390.1 117.9L390.3 119.3L390.4 120.6L390.5 122L390.6 123.3L390.5 124.5L390.4 125.8L390.3 127L390.1 128.2L389.8 129.3L389.5 130.4L389.2 131.4L388.8 132.4L388.3 133.3L387.8 134.2L387.2 135L386.6 135.7L385.9 136.4L385.2 137L384.5 137.6L383.7 138L379.2 140.3L378.3 140.7L377.5 141L376.6 141.3L375.7 141.4L374.7 141.5L373.8 141.6L372.8 141.5L371.8 141.4L370.7 141.2L369.7 140.9L368.6 140.6L367.6 140.1L366.5 139.7L365.5 139.1L364.4 138.5L363.4 137.8L362.3 137L361.3 136.2L360.3 135.3L359.3 134.4L358.4 133.4L357.4 132.3L356.5 131.2L355.6 130.1L354.7 128.9L353.9 127.7L353.1 126.4L352.4 125.1L351.7 123.8L351 122.5L350.4 121.1L349.8 119.7L349.3 118.4L348.8 117L348.4 115.6L348.1 114.2L347.8 112.8L347.5 111.4L347.3 110L347.2 108.7L347.1 107.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M379.2 140.3L380.7 139.3L382.1 138L383.2 136.4L384.2 134.7L385 132.6L385.6 130.4L385.9 128.1L386 125.5L385.9 122.9L385.6 120.2L385 117.4L384.2 114.6L383.2 111.8L387.8 109.6L388.8 112.3L389.5 115.1L390.1 117.9L390.4 120.6L390.6 123.3L390.4 125.8L390.1 128.2L389.5 130.4L388.8 132.4L387.8 134.2L386.6 135.7L385.2 137L383.7 138Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M383.2 111.8L382.1 109.1L380.7 106.4L385.2 104.2L386.6 106.8L387.8 109.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M380.7 106.4L379.2 103.9L377.5 101.5L382 99.2L383.7 101.6L385.2 104.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M377.5 101.5L375.7 99.3L373.8 97.2L371.8 95.4L376.3 93.1L378.3 94.9L380.2 97L382 99.2ZM366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L366.5 115.8L386 125.5L385.9 128.1L385.6 130.4L385 132.6L384.2 134.7L383.2 136.4L382.1 138L380.7 139.3L379.2 140.3L377.5 141L375.7 141.4L373.8 141.6L371.8 141.4L369.7 140.9L367.6 140.1L365.5 139.1L363.4 137.8L361.3 136.2L359.3 134.4L357.4 132.3L355.6 130.1L353.9 127.7L352.4 125.1L351 122.5L349.8 119.7L348.8 117L348.1 114.2L347.5 111.4L347.2 108.7L347 106L347.2 103.5L347.5 101.1L348.1 98.9L348.8 96.9L349.8 95.1L351 93.6L352.4 92.3L353.9 91.3L355.6 90.5L357.4 90.1L359.3 90L361.3 90.2L363.4 90.6L365.5 91.4L367.6 92.5L369.7 93.8L371.8 95.4L373.8 97.2L375.7 99.3L377.5 101.5L379.2 103.9L380.7 106.4L382.1 109.1L383.2 111.8L384.2 114.6L385 117.4L385.6 120.2L385.9 122.9L386 125.5Z\"/><path class=\"iso-top\" d=\"M371.8 95.4L369.7 93.8L367.6 92.5L365.5 91.4L363.4 90.6L361.3 90.2L359.3 90L357.4 90.1L355.6 90.5L353.9 91.3L358.4 89L360.1 88.3L361.9 87.9L363.8 87.7L365.8 87.9L367.9 88.4L370 89.1L372.1 90.2L374.2 91.5L376.3 93.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M378.9 140.4L379.7 140L380.4 139.5L381.1 138.9L381.8 138.2L382.5 137.5L383 136.7L383.6 135.9L384.1 135L384.5 134L384.9 133L385.2 132L385.5 130.8L385.7 129.7L385.9 128.5L386 127.3L386 126L386 124.7L386 123.4L385.8 122L385.7 120.7L385.4 119.3L385.1 117.9L384.8 116.5L384.4 115.1L383.9 113.7L383.4 112.3L382.9 110.9L382.3 109.6L381.6 108.2L380.9 106.9L380.2 105.6L379.4 104.3L378.6 103.1L377.8 101.9L376.9 100.8L376 99.6L375.1 98.6L374.1 97.6L373.1 96.6L372.1 95.7L371.1 94.8L370.1 94.1L369 93.3L368 92.7L366.9 92.1L365.9 91.6L364.8 91.1L363.8 90.8L362.7 90.5L361.7 90.2L360.7 90.1L359.7 90L358.7 90L357.7 90.1L356.8 90.2L355.9 90.4L355 90.7L354.2 91.1\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M347 106L347.1 104.8L347.2 103.5L347.3 102.3L347.5 101.1L347.8 100L348.1 98.9L348.4 97.9L348.8 96.9L349.3 96L349.8 95.1L350.4 94.3L351 93.6L351.7 92.9L352.4 92.3L353.1 91.7L353.9 91.3L358.4 89L359.3 88.6L360.1 88.3L361 88L361.9 87.9L362.9 87.8L363.8 87.7L364.8 87.8L365.8 87.9L366.9 88.1L367.9 88.4L369 88.7L370 89.1L371.1 89.6L372.1 90.2L373.2 90.8L374.2 91.5L375.3 92.3L376.3 93.1L377.3 94L378.3 94.9L379.2 95.9L380.2 97L381.1 98.1L382 99.2L382.9 100.4L383.7 101.6L384.5 102.9L385.2 104.2L385.9 105.5L386.6 106.8L387.2 108.2L387.8 109.6L388.3 110.9L388.8 112.3L389.2 113.7L389.5 115.1L389.8 116.5L390.1 117.9L390.3 119.3L390.4 120.6L390.5 122L390.6 123.3L390.5 124.5L390.4 125.8L390.3 127L390.1 128.2L389.8 129.3L389.5 130.4L389.2 131.4L388.8 132.4L388.3 133.3L387.8 134.2L387.2 135L386.6 135.7L385.9 136.4L385.2 137L384.5 137.6L383.7 138L379.2 140.3L378.3 140.7L377.5 141L376.6 141.3L375.7 141.4L374.7 141.5L373.8 141.6L372.8 141.5L371.8 141.4L370.7 141.2L369.7 140.9L368.6 140.6L367.6 140.1L366.5 139.7L365.5 139.1L364.4 138.5L363.4 137.8L362.3 137L361.3 136.2L360.3 135.3L359.3 134.4L358.4 133.4L357.4 132.3L356.5 131.2L355.6 130.1L354.7 128.9L353.9 127.7L353.1 126.4L352.4 125.1L351.7 123.8L351 122.5L350.4 121.1L349.8 119.7L349.3 118.4L348.8 117L348.4 115.6L348.1 114.2L347.8 112.8L347.5 111.4L347.3 110L347.2 108.7L347.1 107.3Z\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M370.7 59L370.9 57.8L371.5 56.6L372.3 55.6L373.3 55.2L374.2 55.2L374.8 55.9L375 56.9L374.8 58.1L374.2 59.3L373.3 60.3L372.3 60.7L371.5 60.7L370.9 60.1Z\"/><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"372.8\" cy=\"58\" r=\"0.5\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M395.1 125.5L395.1 124.2L395.2 123L395.3 121.8L395.5 120.6L395.7 119.4L396 118.3L396.3 117.2L396.7 116.2L397.1 115.2L397.5 114.3L398 113.4L398.6 112.6L399.1 111.8L399.8 111L400.4 110.4L401.1 109.8L401.9 109.2L402.6 108.7L403.4 108.3L405.2 107.4L406 107L406.9 106.7L407.8 106.5L408.7 106.3L409.7 106.2L410.6 106.1L411.6 106.1L412.6 106.2L413.6 106.4L414.6 106.6L415.7 106.9L416.7 107.2L417.8 107.6L418.8 108.1L419.9 108.6L420.9 109.2L422 109.8L423 110.5L424.1 111.3L425.1 112.1L426.1 113L427.1 113.9L428.1 114.9L429.1 115.9L430 116.9L430.9 118L431.8 119.2L432.7 120.3L433.5 121.5L434.3 122.8L435.1 124L435.8 125.3L436.5 126.7L437.2 128L437.8 129.3L438.4 130.7L438.9 132.1L439.4 133.5L439.9 134.9L440.3 136.3L440.7 137.7L441 139.1L441.3 140.4L441.5 141.8L441.7 143.2L441.8 144.5L441.9 145.9L441.9 147.2L441.9 148.4L441.8 149.7L441.7 150.9L441.5 152.1L441.3 153.3L441 154.4L440.7 155.4L440.3 156.5L439.9 157.5L439.4 158.4L438.9 159.3L438.4 160.1L437.8 160.9L437.2 161.7L436.5 162.3L435.8 162.9L435.1 163.5L434.3 164L433.5 164.4L431.8 165.3L430.9 165.7L430.1 166L429.2 166.2L428.2 166.4L427.3 166.5L426.3 166.6L425.4 166.5L424.4 166.5L423.3 166.3L422.3 166.1L421.3 165.8L420.2 165.5L419.2 165.1L418.1 164.6L417.1 164.1L416 163.5L415 162.9L413.9 162.1L412.9 161.4L411.9 160.6L410.8 159.7L409.8 158.8L408.9 157.8L407.9 156.8L407 155.8L406 154.7L405.1 153.5L404.3 152.4L403.4 151.1L402.6 149.9L401.9 148.6L401.1 147.4L400.4 146L399.8 144.7L399.1 143.3L398.6 142L398 140.6L397.5 139.2L397.1 137.8L396.7 136.4L396.3 135L396 133.6L395.7 132.2L395.5 130.9L395.3 129.5L395.2 128.2L395.1 126.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M432.6 164.9L434.1 163.8L435.4 162.5L436.6 161L437.7 159.3L438.5 157.4L439.2 155.3L439.7 153L440 150.6L440.1 148L440 145.4L439.7 142.7L439.2 139.9L438.5 137.2L437.7 134.4L436.6 131.6L438.4 130.7L439.4 133.5L440.3 136.3L441 139.1L441.5 141.8L441.8 144.5L441.9 147.2L441.8 149.7L441.5 152.1L441 154.4L440.3 156.5L439.4 158.4L438.4 160.1L437.2 161.7L435.8 162.9L434.3 164Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M436.6 131.6L435.4 128.9L434.1 126.2L435.8 125.3L437.2 128L438.4 130.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M434.1 126.2L432.6 123.7L430.9 121.2L429.2 118.9L430.9 118L432.7 120.3L434.3 122.8L435.8 125.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M429.2 118.9L427.3 116.8L425.4 114.8L423.3 113L425.1 112.1L427.1 113.9L429.1 115.9L430.9 118ZM417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L417.6 136.8L440.1 148L440 150.6L439.7 153L439.2 155.3L438.5 157.4L437.7 159.3L436.6 161L435.4 162.5L434.1 163.8L432.6 164.9L430.9 165.7L429.2 166.2L427.3 166.5L425.4 166.5L423.3 166.3L421.3 165.8L419.2 165.1L417.1 164.1L415 162.9L412.9 161.4L410.8 159.7L408.9 157.8L407 155.8L405.1 153.5L403.4 151.1L401.9 148.6L400.4 146L399.1 143.3L398 140.6L397.1 137.8L396.3 135L395.7 132.2L395.3 129.5L395.1 126.8L395.1 124.2L395.3 121.8L395.7 119.4L396.3 117.2L397.1 115.2L398 113.4L399.1 111.8L400.4 110.4L401.9 109.2L403.4 108.3L405.1 107.6L407 107.2L408.9 107L410.8 107.1L412.9 107.5L415 108.1L417.1 109L419.2 110.1L421.3 111.4L423.3 113L425.4 114.8L427.3 116.8L429.2 118.9L430.9 121.2L432.6 123.7L434.1 126.2L435.4 128.9L436.6 131.6L437.7 134.4L438.5 137.2L439.2 139.9L439.7 142.7L440 145.4L440.1 148Z\"/><path class=\"iso-top\" d=\"M423.3 113L421.3 111.4L419.2 110.1L417.1 109L415 108.1L412.9 107.5L410.8 107.1L408.9 107L407 107.2L405.1 107.6L403.4 108.3L405.2 107.4L406.9 106.7L408.7 106.3L410.6 106.1L412.6 106.2L414.6 106.6L416.7 107.2L418.8 108.1L420.9 109.2L423 110.5L425.1 112.1Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M431.8 165.3L432.6 164.8L433.4 164.3L434.1 163.8L434.8 163.1L435.5 162.5L436.1 161.7L436.7 160.9L437.2 160.1L437.7 159.2L438.2 158.2L438.6 157.3L438.9 156.2L439.3 155.1L439.5 154L439.7 152.9L439.9 151.7L440 150.4L440.1 149.2L440.1 147.9L440.1 146.6L440 145.3L439.9 143.9L439.7 142.6L439.5 141.2L439.2 139.8L438.9 138.4L438.5 137L438.1 135.6L437.6 134.2L437.1 132.8L436.6 131.5L436 130.1L435.4 128.7L434.7 127.4L434 126.1L433.3 124.8L432.5 123.5L431.7 122.3L430.8 121.1L430 119.9L429.1 118.8L428.1 117.7L427.2 116.6L426.2 115.6L425.3 114.7L424.3 113.8L423.2 112.9L422.2 112.1L421.2 111.3L420.1 110.6L419.1 110L418 109.4L417 108.9L415.9 108.4L414.9 108L413.8 107.7L412.8 107.4L411.8 107.2L410.7 107.1L409.7 107L408.8 107L407.8 107.1L406.9 107.2L405.9 107.4L405.1 107.6L404.2 107.9L403.4 108.3\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M395.1 125.5L395.1 124.2L395.2 123L395.3 121.8L395.5 120.6L395.7 119.4L396 118.3L396.3 117.2L396.7 116.2L397.1 115.2L397.5 114.3L398 113.4L398.6 112.6L399.1 111.8L399.8 111L400.4 110.4L401.1 109.8L401.9 109.2L402.6 108.7L403.4 108.3L405.2 107.4L406 107L406.9 106.7L407.8 106.5L408.7 106.3L409.7 106.2L410.6 106.1L411.6 106.1L412.6 106.2L413.6 106.4L414.6 106.6L415.7 106.9L416.7 107.2L417.8 107.6L418.8 108.1L419.9 108.6L420.9 109.2L422 109.8L423 110.5L424.1 111.3L425.1 112.1L426.1 113L427.1 113.9L428.1 114.9L429.1 115.9L430 116.9L430.9 118L431.8 119.2L432.7 120.3L433.5 121.5L434.3 122.8L435.1 124L435.8 125.3L436.5 126.7L437.2 128L437.8 129.3L438.4 130.7L438.9 132.1L439.4 133.5L439.9 134.9L440.3 136.3L440.7 137.7L441 139.1L441.3 140.4L441.5 141.8L441.7 143.2L441.8 144.5L441.9 145.9L441.9 147.2L441.9 148.4L441.8 149.7L441.7 150.9L441.5 152.1L441.3 153.3L441 154.4L440.7 155.4L440.3 156.5L439.9 157.5L439.4 158.4L438.9 159.3L438.4 160.1L437.8 160.9L437.2 161.7L436.5 162.3L435.8 162.9L435.1 163.5L434.3 164L433.5 164.4L431.8 165.3L430.9 165.7L430.1 166L429.2 166.2L428.2 166.4L427.3 166.5L426.3 166.6L425.4 166.5L424.4 166.5L423.3 166.3L422.3 166.1L421.3 165.8L420.2 165.5L419.2 165.1L418.1 164.6L417.1 164.1L416 163.5L415 162.9L413.9 162.1L412.9 161.4L411.9 160.6L410.8 159.7L409.8 158.8L408.9 157.8L407.9 156.8L407 155.8L406 154.7L405.1 153.5L404.3 152.4L403.4 151.1L402.6 149.9L401.9 148.6L401.1 147.4L400.4 146L399.8 144.7L399.1 143.3L398.6 142L398 140.6L397.5 139.2L397.1 137.8L396.7 136.4L396.3 135L396 133.6L395.7 132.2L395.5 130.9L395.3 129.5L395.2 128.2L395.1 126.8Z\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M393.6 129.3L393.6 128L393.7 126.8L393.8 125.6L394 124.4L394.3 123.3L394.6 122.2L395 121.2L395.4 120.2L395.8 119.3L396.4 118.4L396.9 117.6L397.6 116.8L398.2 116.2L398.9 115.6L399.7 115L400.5 114.5L405 112.3L405.8 111.9L406.7 111.6L407.5 111.3L408.5 111.1L409.4 111L410.4 111L411.4 111L412.4 111.2L413.4 111.4L414.4 111.6L415.5 112L416.5 112.4L417.6 112.9L418.7 113.5L419.7 114.1L420.8 114.8L421.8 115.6L422.8 116.4L423.8 117.3L424.8 118.2L425.8 119.2L426.7 120.3L427.7 121.4L428.5 122.5L429.4 123.7L430.2 124.9L431 126.2L431.8 127.4L432.5 128.8L433.1 130.1L433.7 131.5L434.3 132.8L434.8 134.2L435.3 135.6L435.7 137L436.1 138.4L436.4 139.8L436.6 141.2L436.8 142.5L437 143.9L437.1 145.2L437.1 146.5L437.1 147.8L437 149.1L436.8 150.3L436.6 151.4L436.4 152.6L436.1 153.6L435.7 154.7L435.3 155.7L434.8 156.6L434.3 157.4L433.7 158.3L433.1 159L432.5 159.7L431.8 160.3L431 160.8L430.2 161.3L425.7 163.6L424.9 164L424 164.3L423.1 164.5L422.2 164.7L421.3 164.8L420.3 164.8L419.3 164.8L418.3 164.7L417.3 164.5L416.2 164.2L415.2 163.8L414.1 163.4L413.1 162.9L412 162.4L411 161.7L409.9 161L408.9 160.3L407.9 159.4L406.8 158.6L405.9 157.6L404.9 156.6L403.9 155.6L403 154.5L402.1 153.3L401.3 152.2L400.5 150.9L399.7 149.7L398.9 148.4L398.2 147.1L397.6 145.7L396.9 144.4L396.4 143L395.8 141.6L395.4 140.2L395 138.8L394.6 137.4L394.3 136L394 134.7L393.8 133.3L393.7 131.9L393.6 130.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M425.7 163.6L427.2 162.5L428.6 161.3L429.8 159.7L430.8 157.9L431.5 155.9L432.1 153.7L432.5 151.3L432.6 148.8L432.5 146.2L432.1 143.4L431.5 140.7L430.8 137.9L429.8 135.1L434.3 132.8L435.3 135.6L436.1 138.4L436.6 141.2L437 143.9L437.1 146.5L437 149.1L436.6 151.4L436.1 153.6L435.3 155.7L434.3 157.4L433.1 159L431.8 160.3L430.2 161.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M429.8 135.1L428.6 132.4L427.2 129.7L431.8 127.4L433.1 130.1L434.3 132.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M427.2 129.7L425.7 127.2L424 124.8L428.5 122.5L430.2 124.9L431.8 127.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M424 124.8L422.2 122.5L420.3 120.5L418.3 118.7L422.8 116.4L424.8 118.2L426.7 120.3L428.5 122.5ZM413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L413.1 139L432.6 148.8L432.5 151.3L432.1 153.7L431.5 155.9L430.8 157.9L429.8 159.7L428.6 161.3L427.2 162.5L425.7 163.6L424 164.3L422.2 164.7L420.3 164.8L418.3 164.7L416.2 164.2L414.1 163.4L412 162.4L409.9 161L407.9 159.4L405.9 157.6L403.9 155.6L402.1 153.3L400.5 150.9L398.9 148.4L397.6 145.7L396.4 143L395.4 140.2L394.6 137.4L394 134.7L393.7 131.9L393.6 129.3L393.7 126.8L394 124.4L394.6 122.2L395.4 120.2L396.4 118.4L397.6 116.8L398.9 115.6L400.5 114.5L402.1 113.8L403.9 113.4L405.9 113.3L407.9 113.4L409.9 113.9L412 114.7L414.1 115.7L416.2 117.1L418.3 118.7L420.3 120.5L422.2 122.5L424 124.8L425.7 127.2L427.2 129.7L428.6 132.4L429.8 135.1L430.8 137.9L431.5 140.7L432.1 143.4L432.5 146.2L432.6 148.8Z\"/><path class=\"iso-top\" d=\"M418.3 118.7L416.2 117.1L414.1 115.7L412 114.7L409.9 113.9L407.9 113.4L405.9 113.3L403.9 113.4L402.1 113.8L400.5 114.5L405 112.3L406.7 111.6L408.5 111.1L410.4 111L412.4 111.2L414.4 111.6L416.5 112.4L418.7 113.5L420.8 114.8L422.8 116.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M425.4 163.7L426.2 163.3L427 162.7L427.7 162.2L428.4 161.5L429 160.8L429.6 160L430.1 159.2L430.6 158.3L431 157.3L431.4 156.3L431.8 155.2L432 154.1L432.2 153L432.4 151.8L432.5 150.5L432.6 149.3L432.6 148L432.5 146.6L432.4 145.3L432.2 143.9L432 142.6L431.7 141.2L431.3 139.8L430.9 138.4L430.5 137L430 135.6L429.4 134.2L428.8 132.8L428.2 131.5L427.5 130.2L426.8 128.9L426 127.6L425.2 126.4L424.3 125.2L423.4 124L422.5 122.9L421.6 121.8L420.6 120.8L419.7 119.9L418.7 119L417.6 118.1L416.6 117.3L415.6 116.6L414.5 116L413.5 115.4L412.4 114.8L411.3 114.4L410.3 114L409.3 113.7L408.2 113.5L407.2 113.3L406.2 113.3L405.2 113.3L404.3 113.3L403.3 113.5L402.4 113.7L401.6 114L400.7 114.4\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M393.6 129.3L393.6 128L393.7 126.8L393.8 125.6L394 124.4L394.3 123.3L394.6 122.2L395 121.2L395.4 120.2L395.8 119.3L396.4 118.4L396.9 117.6L397.6 116.8L398.2 116.2L398.9 115.6L399.7 115L400.5 114.5L405 112.3L405.8 111.9L406.7 111.6L407.5 111.3L408.5 111.1L409.4 111L410.4 111L411.4 111L412.4 111.2L413.4 111.4L414.4 111.6L415.5 112L416.5 112.4L417.6 112.9L418.7 113.5L419.7 114.1L420.8 114.8L421.8 115.6L422.8 116.4L423.8 117.3L424.8 118.2L425.8 119.2L426.7 120.3L427.7 121.4L428.5 122.5L429.4 123.7L430.2 124.9L431 126.2L431.8 127.4L432.5 128.8L433.1 130.1L433.7 131.5L434.3 132.8L434.8 134.2L435.3 135.6L435.7 137L436.1 138.4L436.4 139.8L436.6 141.2L436.8 142.5L437 143.9L437.1 145.2L437.1 146.5L437.1 147.8L437 149.1L436.8 150.3L436.6 151.4L436.4 152.6L436.1 153.6L435.7 154.7L435.3 155.7L434.8 156.6L434.3 157.4L433.7 158.3L433.1 159L432.5 159.7L431.8 160.3L431 160.8L430.2 161.3L425.7 163.6L424.9 164L424 164.3L423.1 164.5L422.2 164.7L421.3 164.8L420.3 164.8L419.3 164.8L418.3 164.7L417.3 164.5L416.2 164.2L415.2 163.8L414.1 163.4L413.1 162.9L412 162.4L411 161.7L409.9 161L408.9 160.3L407.9 159.4L406.8 158.6L405.9 157.6L404.9 156.6L403.9 155.6L403 154.5L402.1 153.3L401.3 152.2L400.5 150.9L399.7 149.7L398.9 148.4L398.2 147.1L397.6 145.7L396.9 144.4L396.4 143L395.8 141.6L395.4 140.2L395 138.8L394.6 137.4L394.3 136L394 134.7L393.8 133.3L393.7 131.9L393.6 130.6Z\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M417.2 82.3L417.4 81L418 79.8L418.9 78.9L419.8 78.4L420.7 78.5L421.3 79.1L421.5 80.2L421.3 81.4L420.7 82.6L419.8 83.5L418.9 84L418 83.9L417.4 83.3Z\"/><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"419.4\" cy=\"81.2\" r=\"0.5\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M441.6 148.8L441.6 147.5L441.7 146.3L441.8 145L442 143.9L442.2 142.7L442.5 141.6L442.8 140.5L443.2 139.5L443.6 138.5L444.1 137.6L444.6 136.7L445.1 135.8L445.7 135L446.3 134.3L447 133.6L447.7 133L448.4 132.5L449.2 132L450 131.5L451.7 130.7L452.6 130.3L453.4 130L454.3 129.7L455.3 129.6L456.2 129.4L457.2 129.4L458.1 129.4L459.1 129.5L460.2 129.6L461.2 129.9L462.2 130.1L463.3 130.5L464.3 130.9L465.4 131.3L466.4 131.9L467.5 132.5L468.5 133.1L469.6 133.8L470.6 134.6L471.6 135.4L472.7 136.2L473.7 137.2L474.6 138.1L475.6 139.1L476.5 140.2L477.5 141.3L478.4 142.4L479.2 143.6L480.1 144.8L480.9 146L481.6 147.3L482.4 148.6L483.1 149.9L483.7 151.3L484.4 152.6L484.9 154L485.5 155.4L486 156.8L486.4 158.1L486.8 159.5L487.2 160.9L487.5 162.3L487.8 163.7L488 165.1L488.2 166.5L488.3 167.8L488.4 169.1L488.4 170.4L488.4 171.7L488.3 173L488.2 174.2L488 175.4L487.8 176.5L487.5 177.6L487.2 178.7L486.8 179.7L486.4 180.7L486 181.7L485.5 182.6L484.9 183.4L484.4 184.2L483.7 184.9L483.1 185.6L482.4 186.2L481.6 186.8L480.9 187.3L480.1 187.7L478.3 188.6L477.5 188.9L476.6 189.3L475.7 189.5L474.8 189.7L473.8 189.8L472.9 189.8L471.9 189.8L470.9 189.7L469.9 189.6L468.9 189.4L467.8 189.1L466.8 188.8L465.7 188.3L464.7 187.9L463.6 187.4L462.6 186.8L461.5 186.1L460.5 185.4L459.4 184.7L458.4 183.8L457.4 183L456.4 182.1L455.4 181.1L454.4 180.1L453.5 179L452.6 177.9L451.7 176.8L450.8 175.6L450 174.4L449.2 173.2L448.4 171.9L447.7 170.6L447 169.3L446.3 168L445.7 166.6L445.1 165.2L444.6 163.9L444.1 162.5L443.6 161.1L443.2 159.7L442.8 158.3L442.5 156.9L442.2 155.5L442 154.1L441.8 152.8L441.7 151.4L441.6 150.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M479.1 188.1L480.6 187.1L482 185.8L483.2 184.3L484.2 182.6L485.1 180.6L485.8 178.5L486.3 176.3L486.6 173.8L486.7 171.3L486.6 168.7L486.3 166L485.8 163.2L485.1 160.4L484.2 157.6L483.2 154.9L484.9 154L486 156.8L486.8 159.5L487.5 162.3L488 165.1L488.3 167.8L488.4 170.4L488.3 173L488 175.4L487.5 177.6L486.8 179.7L486 181.7L484.9 183.4L483.7 184.9L482.4 186.2L480.9 187.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M483.2 154.9L482 152.1L480.6 149.5L482.4 148.6L483.7 151.3L484.9 154Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M480.6 149.5L479.1 146.9L477.5 144.5L475.7 142.2L477.5 141.3L479.2 143.6L480.9 146L482.4 148.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M475.7 142.2L473.8 140L471.9 138L469.9 136.3L471.6 135.4L473.7 137.2L475.6 139.1L477.5 141.3ZM464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L464.1 160.1L486.7 171.3L486.6 173.8L486.3 176.3L485.8 178.5L485.1 180.6L484.2 182.6L483.2 184.3L482 185.8L480.6 187.1L479.1 188.1L477.5 188.9L475.7 189.5L473.8 189.8L471.9 189.8L469.9 189.6L467.8 189.1L465.7 188.3L463.6 187.4L461.5 186.1L459.4 184.7L457.4 183L455.4 181.1L453.5 179L451.7 176.8L450 174.4L448.4 171.9L447 169.3L445.7 166.6L444.6 163.9L443.6 161.1L442.8 158.3L442.2 155.5L441.8 152.8L441.6 150.1L441.6 147.5L441.8 145L442.2 142.7L442.8 140.5L443.6 138.5L444.6 136.7L445.7 135L447 133.6L448.4 132.5L450 131.5L451.7 130.9L453.5 130.4L455.4 130.3L457.4 130.4L459.4 130.7L461.5 131.4L463.6 132.2L465.7 133.3L467.8 134.7L469.9 136.3L471.9 138L473.8 140L475.7 142.2L477.5 144.5L479.1 146.9L480.6 149.5L482 152.1L483.2 154.9L484.2 157.6L485.1 160.4L485.8 163.2L486.3 166L486.6 168.7L486.7 171.3Z\"/><path class=\"iso-top\" d=\"M469.9 136.3L467.8 134.7L465.7 133.3L463.6 132.2L461.5 131.4L459.4 130.7L457.4 130.4L455.4 130.3L453.5 130.4L451.7 130.9L450 131.5L451.7 130.7L453.4 130L455.3 129.6L457.2 129.4L459.1 129.5L461.2 129.9L463.3 130.5L465.4 131.3L467.5 132.5L469.6 133.8L471.6 135.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M478.4 188.5L479.2 188.1L479.9 187.6L480.7 187L481.4 186.4L482 185.7L482.7 185L483.2 184.2L483.8 183.4L484.3 182.5L484.7 181.5L485.1 180.5L485.5 179.5L485.8 178.4L486.1 177.3L486.3 176.1L486.4 174.9L486.6 173.7L486.6 172.5L486.7 171.2L486.6 169.9L486.5 168.5L486.4 167.2L486.2 165.8L486 164.5L485.7 163.1L485.4 161.7L485 160.3L484.6 158.9L484.2 157.5L483.7 156.1L483.1 154.7L482.5 153.4L481.9 152L481.2 150.7L480.5 149.4L479.8 148.1L479 146.8L478.2 145.6L477.4 144.4L476.5 143.2L475.6 142.1L474.7 141L473.7 139.9L472.8 138.9L471.8 137.9L470.8 137L469.8 136.2L468.7 135.4L467.7 134.6L466.7 133.9L465.6 133.3L464.6 132.7L463.5 132.2L462.4 131.7L461.4 131.3L460.4 131L459.3 130.7L458.3 130.5L457.3 130.4L456.3 130.3L455.3 130.3L454.3 130.3L453.4 130.4L452.5 130.6L451.6 130.9L450.7 131.2L449.9 131.6\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M441.6 148.8L441.6 147.5L441.7 146.3L441.8 145L442 143.9L442.2 142.7L442.5 141.6L442.8 140.5L443.2 139.5L443.6 138.5L444.1 137.6L444.6 136.7L445.1 135.8L445.7 135L446.3 134.3L447 133.6L447.7 133L448.4 132.5L449.2 132L450 131.5L451.7 130.7L452.6 130.3L453.4 130L454.3 129.7L455.3 129.6L456.2 129.4L457.2 129.4L458.1 129.4L459.1 129.5L460.2 129.6L461.2 129.9L462.2 130.1L463.3 130.5L464.3 130.9L465.4 131.3L466.4 131.9L467.5 132.5L468.5 133.1L469.6 133.8L470.6 134.6L471.6 135.4L472.7 136.2L473.7 137.2L474.6 138.1L475.6 139.1L476.5 140.2L477.5 141.3L478.4 142.4L479.2 143.6L480.1 144.8L480.9 146L481.6 147.3L482.4 148.6L483.1 149.9L483.7 151.3L484.4 152.6L484.9 154L485.5 155.4L486 156.8L486.4 158.1L486.8 159.5L487.2 160.9L487.5 162.3L487.8 163.7L488 165.1L488.2 166.5L488.3 167.8L488.4 169.1L488.4 170.4L488.4 171.7L488.3 173L488.2 174.2L488 175.4L487.8 176.5L487.5 177.6L487.2 178.7L486.8 179.7L486.4 180.7L486 181.7L485.5 182.6L484.9 183.4L484.4 184.2L483.7 184.9L483.1 185.6L482.4 186.2L481.6 186.8L480.9 187.3L480.1 187.7L478.3 188.6L477.5 188.9L476.6 189.3L475.7 189.5L474.8 189.7L473.8 189.8L472.9 189.8L471.9 189.8L470.9 189.7L469.9 189.6L468.9 189.4L467.8 189.1L466.8 188.8L465.7 188.3L464.7 187.9L463.6 187.4L462.6 186.8L461.5 186.1L460.5 185.4L459.4 184.7L458.4 183.8L457.4 183L456.4 182.1L455.4 181.1L454.4 180.1L453.5 179L452.6 177.9L451.7 176.8L450.8 175.6L450 174.4L449.2 173.2L448.4 171.9L447.7 170.6L447 169.3L446.3 168L445.7 166.6L445.1 165.2L444.6 163.9L444.1 162.5L443.6 161.1L443.2 159.7L442.8 158.3L442.5 156.9L442.2 155.5L442 154.1L441.8 152.8L441.7 151.4L441.6 150.1Z\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M440.1 152.6L440.1 151.3L440.2 150L440.4 148.8L440.6 147.7L440.8 146.5L441.1 145.5L441.5 144.4L441.9 143.4L442.4 142.5L442.9 141.7L443.5 140.9L444.1 140.1L444.8 139.4L445.5 138.8L446.2 138.3L447 137.8L451.5 135.5L452.3 135.1L453.2 134.8L454.1 134.6L455 134.4L456 134.3L456.9 134.3L457.9 134.3L458.9 134.4L459.9 134.6L461 134.9L462 135.3L463.1 135.7L464.1 136.2L465.2 136.7L466.2 137.4L467.3 138.1L468.3 138.8L469.4 139.7L470.4 140.5L471.4 141.5L472.3 142.5L473.3 143.5L474.2 144.6L475.1 145.8L475.9 146.9L476.8 148.2L477.5 149.4L478.3 150.7L479 152L479.7 153.4L480.3 154.7L480.8 156.1L481.4 157.5L481.8 158.9L482.2 160.3L482.6 161.7L482.9 163.1L483.2 164.4L483.4 165.8L483.5 167.2L483.6 168.5L483.6 169.8L483.6 171.1L483.5 172.3L483.4 173.5L483.2 174.7L482.9 175.8L482.6 176.9L482.2 177.9L481.8 178.9L481.4 179.8L480.8 180.7L480.3 181.5L479.7 182.3L479 182.9L478.3 183.5L477.5 184.1L476.8 184.6L472.2 186.8L471.4 187.2L470.5 187.5L469.7 187.8L468.7 188L467.8 188.1L466.8 188.1L465.8 188.1L464.8 187.9L463.8 187.7L462.8 187.5L461.7 187.1L460.7 186.7L459.6 186.2L458.6 185.6L457.5 185L456.5 184.3L455.4 183.5L454.4 182.7L453.4 181.8L452.4 180.9L451.4 179.9L450.5 178.8L449.6 177.8L448.7 176.6L447.8 175.4L447 174.2L446.2 172.9L445.5 171.7L444.8 170.3L444.1 169L443.5 167.6L442.9 166.3L442.4 164.9L441.9 163.5L441.5 162.1L441.1 160.7L440.8 159.3L440.6 157.9L440.4 156.6L440.2 155.2L440.1 153.9Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M472.2 186.8L473.8 185.8L475.1 184.5L476.3 183L477.3 181.2L478.1 179.2L478.6 177L479 174.6L479.1 172.1L479 169.4L478.6 166.7L478.1 163.9L477.3 161.1L476.3 158.4L480.8 156.1L481.8 158.9L482.6 161.7L483.2 164.4L483.5 167.2L483.6 169.8L483.5 172.3L483.2 174.7L482.6 176.9L481.8 178.9L480.8 180.7L479.7 182.3L478.3 183.5L476.8 184.6Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M476.3 158.4L475.1 155.6L473.8 153L478.3 150.7L479.7 153.4L480.8 156.1Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M473.8 153L472.2 150.4L470.5 148L475.1 145.8L476.8 148.2L478.3 150.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M470.5 148L468.7 145.8L466.8 143.7L464.8 141.9L469.4 139.7L471.4 141.5L473.3 143.5L475.1 145.8ZM459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L459.6 162.3L479.1 172.1L479 174.6L478.6 177L478.1 179.2L477.3 181.2L476.3 183L475.1 184.5L473.8 185.8L472.2 186.8L470.5 187.5L468.7 188L466.8 188.1L464.8 187.9L462.8 187.5L460.7 186.7L458.6 185.6L456.5 184.3L454.4 182.7L452.4 180.9L450.5 178.8L448.7 176.6L447 174.2L445.5 171.7L444.1 169L442.9 166.3L441.9 163.5L441.1 160.7L440.6 157.9L440.2 155.2L440.1 152.6L440.2 150L440.6 147.7L441.1 145.5L441.9 143.4L442.9 141.7L444.1 140.1L445.5 138.8L447 137.8L448.7 137.1L450.5 136.7L452.4 136.5L454.4 136.7L456.5 137.2L458.6 137.9L460.7 139L462.8 140.3L464.8 141.9L466.8 143.7L468.7 145.8L470.5 148L472.2 150.4L473.8 153L475.1 155.6L476.3 158.4L477.3 161.1L478.1 163.9L478.6 166.7L479 169.4L479.1 172.1Z\"/><path class=\"iso-top\" d=\"M464.8 141.9L462.8 140.3L460.7 139L458.6 137.9L456.5 137.2L454.4 136.7L452.4 136.5L450.5 136.7L448.7 137.1L447 137.8L451.5 135.5L453.2 134.8L455 134.4L456.9 134.3L458.9 134.4L461 134.9L463.1 135.7L465.2 136.7L467.3 138.1L469.4 139.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"lo\" d=\"M471.9 187L472.7 186.5L473.5 186L474.2 185.4L474.9 184.8L475.5 184.1L476.1 183.3L476.7 182.4L477.1 181.5L477.6 180.6L478 179.6L478.3 178.5L478.6 177.4L478.8 176.2L478.9 175L479.1 173.8L479.1 172.5L479.1 171.2L479 169.9L478.9 168.6L478.7 167.2L478.5 165.8L478.2 164.4L477.9 163L477.5 161.6L477 160.2L476.5 158.9L476 157.5L475.4 156.1L474.7 154.8L474 153.4L473.3 152.1L472.5 150.9L471.7 149.6L470.9 148.4L470 147.3L469.1 146.2L468.1 145.1L467.2 144.1L466.2 143.1L465.2 142.2L464.2 141.4L463.1 140.6L462.1 139.9L461 139.2L460 138.6L458.9 138.1L457.9 137.7L456.8 137.3L455.8 137L454.8 136.8L453.7 136.6L452.7 136.5L451.8 136.5L450.8 136.6L449.9 136.8L449 137L448.1 137.3L447.3 137.7\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" d=\"M440.1 152.6L440.1 151.3L440.2 150L440.4 148.8L440.6 147.7L440.8 146.5L441.1 145.5L441.5 144.4L441.9 143.4L442.4 142.5L442.9 141.7L443.5 140.9L444.1 140.1L444.8 139.4L445.5 138.8L446.2 138.3L447 137.8L451.5 135.5L452.3 135.1L453.2 134.8L454.1 134.6L455 134.4L456 134.3L456.9 134.3L457.9 134.3L458.9 134.4L459.9 134.6L461 134.9L462 135.3L463.1 135.7L464.1 136.2L465.2 136.7L466.2 137.4L467.3 138.1L468.3 138.8L469.4 139.7L470.4 140.5L471.4 141.5L472.3 142.5L473.3 143.5L474.2 144.6L475.1 145.8L475.9 146.9L476.8 148.2L477.5 149.4L478.3 150.7L479 152L479.7 153.4L480.3 154.7L480.8 156.1L481.4 157.5L481.8 158.9L482.2 160.3L482.6 161.7L482.9 163.1L483.2 164.4L483.4 165.8L483.5 167.2L483.6 168.5L483.6 169.8L483.6 171.1L483.5 172.3L483.4 173.5L483.2 174.7L482.9 175.8L482.6 176.9L482.2 177.9L481.8 178.9L481.4 179.8L480.8 180.7L480.3 181.5L479.7 182.3L479 182.9L478.3 183.5L477.5 184.1L476.8 184.6L472.2 186.8L471.4 187.2L470.5 187.5L469.7 187.8L468.7 188L467.8 188.1L466.8 188.1L465.8 188.1L464.8 187.9L463.8 187.7L462.8 187.5L461.7 187.1L460.7 186.7L459.6 186.2L458.6 185.6L457.5 185L456.5 184.3L455.4 183.5L454.4 182.7L453.4 181.8L452.4 180.9L451.4 179.9L450.5 178.8L449.6 177.8L448.7 176.6L447.8 175.4L447 174.2L446.2 172.9L445.5 171.7L444.8 170.3L444.1 169L443.5 167.6L442.9 166.3L442.4 164.9L441.9 163.5L441.5 162.1L441.1 160.7L440.8 159.3L440.6 157.9L440.4 156.6L440.2 155.2L440.1 153.9Z\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M463.8 105.6L464 104.3L464.6 103.1L465.4 102.2L466.4 101.7L467.2 101.8L467.8 102.4L468 103.4L467.8 104.7L467.2 105.9L466.4 106.8L465.4 107.3L464.6 107.2L464 106.6Z\"/><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"465.9\" cy=\"104.5\" r=\"0.5\"/></g><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"350.2\" cy=\"149.1\" r=\"0.42\"/><circle cx=\"488.5\" cy=\"218.2\" r=\"0.42\"/><circle cx=\"350.2\" cy=\"45.9\" r=\"0.42\"/><circle cx=\"488.5\" cy=\"115\" r=\"0.42\"/></g><path data-part=\"wedge-0\" d=\"M366.5 115.8L366.5 139.7L364.8 138.7L363.1 137.6L361.4 136.4L359.8 134.9L358.2 133.3L356.7 131.6L355.3 129.8L353.9 127.8L352.7 125.8L351.5 123.7L350.5 121.5L349.6 119.3L348.8 117.1L348.2 114.8L347.6 112.6L347.3 110.4L347.1 108.2L347.0 106.1L347.1 104.0L347.3 102.1L347.6 100.2L348.2 98.5L348.8 96.9L349.6 95.4L350.5 94.1L351.5 93.0L352.7 92.0L353.9 91.3L355.3 90.7L356.7 90.3L358.2 90.1L359.8 90.0L361.4 90.2L363.1 90.6L364.8 91.2L366.5 91.9Z\" style=\"fill:var(--anatomy-lit);opacity:.2;stroke:none\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M366.5 91.9L369.0 93.4L371.5 95.3L373.9 97.5L376.2 100.0L378.3 102.8L380.3 105.8L381.9 109.0L383.4 112.3L384.5 115.7L385.3 119.0L385.8 122.4L386.0 125.6L385.8 128.6L385.3 131.4L384.5 134.0L383.4 136.2L381.9 138.1L380.3 139.6L378.3 140.7L376.2 141.4L373.9 141.6L371.5 141.4L369.0 140.8L366.5 139.7L363.9 138.2L361.4 136.4L359.0 134.1L356.7 131.6L354.6 128.8L352.7 125.8L351.0 122.6L349.6 119.3L348.5 115.9L347.6 112.6L347.1 109.3L347.0 106.1L347.1 103.0L347.6 100.2L348.5 97.7L349.6 95.4L351.0 93.5L352.7 92.0L354.6 90.9L356.7 90.3L359.0 90.0L361.4 90.2L363.9 90.9Z\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M366.5 94.3L369.8 107.6L378.9 106.8L374.6 115.8L384.0 124.6L374.6 124.0L378.9 137.2L369.8 127.4L366.5 137.3L363.1 124.1L354.1 124.8L358.4 115.9L348.9 107.0L358.4 107.6L354.1 94.4L363.1 104.2ZM366.5 115.8L366.5 94.3M366.5 115.8L378.9 106.8M366.5 115.8L384.0 124.6M366.5 115.8L378.9 137.2M366.5 115.8L366.5 137.3M366.5 115.8L354.1 124.8M366.5 115.8L348.9 107.0M366.5 115.8L354.1 94.4\"/><path data-part=\"needle-0\" class=\"iso-line\" data-tone=\"lit\" data-free=\"end\" d=\"M366.5 115.8L366.5 94.3\" style=\"stroke-width:1.1\"/><path data-part=\"wedge-1\" d=\"M413.0 139.1L413.0 163.0L411.3 162.0L409.6 160.9L408.0 159.6L406.3 158.2L404.8 156.6L403.3 154.9L401.8 153.0L400.5 151.1L399.2 149.1L398.1 147.0L397.0 144.8L396.1 142.6L395.3 140.3L394.7 138.1L394.2 135.8L393.8 133.6L393.6 131.5L393.5 129.3L393.6 127.3L393.8 125.3L394.2 123.5L394.7 121.8L395.3 120.2L396.1 118.7L397.0 117.4L398.1 116.3L399.2 115.3L400.5 114.5L401.8 113.9L403.3 113.5L404.8 113.3L406.3 113.3L408.0 113.5L409.6 113.9L411.3 114.4L413.0 115.2Z\" style=\"fill:var(--anatomy-lit);opacity:.2;stroke:none\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M413.0 115.2L415.6 116.7L418.1 118.5L420.5 120.8L422.8 123.3L424.9 126.1L426.8 129.1L428.5 132.3L429.9 135.6L431.0 138.9L431.8 142.3L432.3 145.6L432.5 148.8L432.3 151.9L431.8 154.7L431.0 157.2L429.9 159.5L428.5 161.3L426.8 162.9L424.9 164.0L422.8 164.6L420.5 164.9L418.1 164.7L415.6 164.0L413.0 163.0L410.5 161.5L408.0 159.6L405.5 157.4L403.3 154.9L401.1 152.1L399.2 149.1L397.5 145.9L396.1 142.6L395.0 139.2L394.2 135.8L393.7 132.5L393.5 129.3L393.7 126.3L394.2 123.5L395.0 120.9L396.1 118.7L397.5 116.8L399.2 115.3L401.1 114.2L403.3 113.5L405.5 113.3L408.0 113.5L410.5 114.1Z\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M413.0 117.6L416.4 130.8L425.4 130.1L421.1 139.0L430.6 147.9L421.1 147.2L425.4 160.5L416.4 150.7L413.0 160.6L409.7 147.3L400.6 148.1L404.9 139.1L395.5 130.3L404.9 130.9L400.6 117.7L409.7 127.5ZM413.0 139.1L413.0 117.6M413.0 139.1L425.4 130.1M413.0 139.1L430.6 147.9M413.0 139.1L425.4 160.5M413.0 139.1L413.0 160.6M413.0 139.1L400.6 148.1M413.0 139.1L395.5 130.3M413.0 139.1L400.6 117.7\"/><path data-part=\"needle-1\" class=\"iso-line\" data-tone=\"lit\" data-free=\"end\" d=\"M413.0 139.1L413.0 117.6\" style=\"stroke-width:1.1\"/><path data-part=\"wedge-2\" d=\"M459.5 162.3L459.5 186.2L457.8 185.3L456.2 184.2L454.5 182.9L452.9 181.5L451.3 179.9L449.8 178.2L448.4 176.3L447.0 174.4L445.8 172.3L444.6 170.2L443.6 168.1L442.7 165.8L441.9 163.6L441.2 161.4L440.7 159.1L440.3 156.9L440.1 154.7L440.1 152.6L440.1 150.6L440.3 148.6L440.7 146.8L441.2 145.0L441.9 143.4L442.7 142.0L443.6 140.7L444.6 139.5L445.8 138.6L447.0 137.8L448.4 137.2L449.8 136.8L451.3 136.6L452.9 136.6L454.5 136.8L456.2 137.1L457.8 137.7L459.5 138.5Z\" style=\"fill:var(--anatomy-lit);opacity:.2;stroke:none\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M459.5 138.5L462.1 139.9L464.6 141.8L467.0 144.0L469.3 146.5L471.4 149.3L473.3 152.4L475.0 155.5L476.4 158.9L477.6 162.2L478.4 165.6L478.9 168.9L479.0 172.1L478.9 175.1L478.4 177.9L477.6 180.5L476.4 182.7L475.0 184.6L473.3 186.1L471.4 187.2L469.3 187.9L467.0 188.1L464.6 187.9L462.1 187.3L459.5 186.2L457.0 184.7L454.5 182.9L452.1 180.7L449.8 178.2L447.7 175.4L445.8 172.3L444.1 169.2L442.7 165.8L441.5 162.5L440.7 159.1L440.2 155.8L440.1 152.6L440.2 149.6L440.7 146.8L441.5 144.2L442.7 142.0L444.1 140.1L445.8 138.6L447.7 137.5L449.8 136.8L452.1 136.6L454.5 136.8L457.0 137.4Z\"/><path class=\"iso-line\" data-tone=\"mid\" d=\"M459.5 140.9L462.9 154.1L472.0 153.4L467.7 162.3L477.1 171.1L467.7 170.5L472.0 183.7L462.9 174.0L459.5 183.8L456.2 170.6L447.1 171.3L451.4 162.4L442.0 153.6L451.4 154.2L447.1 141.0L456.2 150.7ZM459.5 162.3L459.5 140.9M459.5 162.3L472.0 153.4M459.5 162.3L477.1 171.1M459.5 162.3L472.0 183.7M459.5 162.3L459.5 183.8M459.5 162.3L447.1 171.3M459.5 162.3L442.0 153.6M459.5 162.3L447.1 141.0\"/><path data-part=\"needle-2\" class=\"iso-line\" data-tone=\"lit\" data-free=\"end\" d=\"M459.5 162.3L459.5 140.9\" style=\"stroke-width:1.1\"/><g class=\"iso-wire\" data-tone=\"lo\"><path class=\"iso-line\" data-tone=\"lo\" d=\"M245.8 270.6L389.2 198.9\"/><circle class=\"iso-wire-end\" cx=\"245.8\" cy=\"270.6\" r=\"1.1\"/><circle class=\"iso-wire-end\" cx=\"389.2\" cy=\"198.9\" r=\"1.1\"/></g><g class=\"iso-wire\" data-tone=\"lo\"><path class=\"iso-line\" data-tone=\"lo\" d=\"M284.8 307.7L245.8 288.2\"/><circle class=\"iso-wire-end\" cx=\"284.8\" cy=\"307.7\" r=\"1.1\"/><circle class=\"iso-wire-end\" cx=\"245.8\" cy=\"288.2\" r=\"1.1\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M280.1 311.3L280.3 309.7L281.2 308.1L282.7 306.6L284.8 305.3L287.4 304.2L290.4 303.5L293.6 303L296.9 302.9L300.2 303.2L303.4 303.8L306.2 304.7L308.5 305.9L310.4 307.3L311.6 308.9L312.1 310.5L312.1 313L311.9 314.6L311 316.3L309.5 317.7L307.4 319L304.8 320.1L301.8 320.9L298.6 321.3L295.3 321.4L292 321.1L288.8 320.5L286 319.6L283.7 318.4L281.8 317L280.6 315.5L280.1 313.8Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M307.4 319L304.8 320.1L304.8 317.6L307.4 316.6ZM312.1 313L311.9 314.6L311.9 312.2L312.1 310.5ZM311.9 314.6L311 316.3L311 313.8L311.9 312.2ZM311 316.3L309.5 317.7L309.5 315.3L311 313.8ZM309.5 317.7L307.4 319L307.4 316.6L309.5 315.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M304.8 320.1L301.8 320.9L301.8 318.4L304.8 317.6ZM301.8 320.9L298.6 321.3L298.6 318.8L301.8 318.4ZM298.6 321.3L295.3 321.4L295.3 318.9L298.6 318.8Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M295.3 321.4L292 321.1L292 318.7L295.3 318.9ZM292 321.1L288.8 320.5L288.8 318.1L292 318.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M288.8 320.5L286 319.6L286 317.1L288.8 318.1ZM286 319.6L283.7 318.4L283.7 316L286 317.1ZM283.7 318.4L281.8 317L281.8 314.6L283.7 316ZM281.8 317L280.6 315.5L280.6 313L281.8 314.6ZM280.6 315.5L280.1 313.8L280.1 311.3L280.6 313Z\"/><path class=\"iso-top\" d=\"M307.4 316.6L304.8 317.6L301.8 318.4L298.6 318.8L295.3 318.9L292 318.7L288.8 318.1L286 317.1L283.7 316L281.8 314.6L280.6 313L280.1 311.3L280.3 309.7L281.2 308.1L282.7 306.6L284.8 305.3L287.4 304.2L290.4 303.5L293.6 303L296.9 302.9L300.2 303.2L303.4 303.8L306.2 304.7L308.5 305.9L310.4 307.3L311.6 308.9L312.1 310.5L311.9 312.2L311 313.8L309.5 315.3Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M312.1 310.5L311.9 312.2L311 313.8L309.5 315.3L307.4 316.6L304.8 317.6L301.8 318.4L298.6 318.8L295.3 318.9L292 318.7L288.8 318.1L286 317.1L283.7 316L281.8 314.6L280.6 313L280.1 311.3\"/><path class=\"iso-line iso-edge\" data-tone=\"lo\" d=\"M280.1 311.3L280.3 309.7L281.2 308.1L282.7 306.6L284.8 305.3L287.4 304.2L290.4 303.5L293.6 303L296.9 302.9L300.2 303.2L303.4 303.8L306.2 304.7L308.5 305.9L310.4 307.3L311.6 308.9L312.1 310.5M312.1 313L311.9 314.6L311 316.3L309.5 317.7L307.4 319L304.8 320.1L301.8 320.9L298.6 321.3L295.3 321.4L292 321.1L288.8 320.5L286 319.6L283.7 318.4L281.8 317L280.6 315.5L280.1 313.8M280.1 311.3L280.1 313.8M312.1 310.5L312.1 313\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M284.8 305.7L285.4 304.4L286.5 303.3L288.1 302.3L290 301.5L292.3 300.9L294.8 300.6L297.4 300.6L299.9 300.9L302.2 301.5L304.2 302.3L305.7 303.3L306.8 304.4L307.4 305.7L307.4 310.3L307.4 311.6L306.8 312.8L305.7 314L304.2 314.9L302.2 315.7L299.9 316.3L297.4 316.6L294.8 316.6L292.3 316.3L290 315.7L288.1 314.9L286.5 314L285.4 312.8L284.8 311.6Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M304.2 314.9L302.2 315.7L302.2 311.1L304.2 310.3ZM307.4 311.6L306.8 312.8L306.8 308.2L307.4 306.9ZM306.8 312.8L305.7 314L305.7 309.3L306.8 308.2ZM305.7 314L304.2 314.9L304.2 310.3L305.7 309.3Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M302.2 315.7L299.9 316.3L299.9 311.7L302.2 311.1ZM299.9 316.3L297.4 316.6L297.4 312L299.9 311.7ZM297.4 316.6L294.8 316.6L294.8 312L297.4 312Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M294.8 316.6L292.3 316.3L292.3 311.7L294.8 312ZM292.3 316.3L290 315.7L290 311.1L292.3 311.7Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M290 315.7L288.1 314.9L288.1 310.3L290 311.1ZM288.1 314.9L286.5 314L286.5 309.3L288.1 310.3ZM286.5 314L285.4 312.8L285.4 308.2L286.5 309.3ZM285.4 312.8L284.8 311.6L284.8 306.9L285.4 308.2Z\"/><path class=\"iso-top\" d=\"M304.2 310.3L302.2 311.1L299.9 311.7L297.4 312L294.8 312L292.3 311.7L290 311.1L288.1 310.3L286.5 309.3L285.4 308.2L284.8 306.9L284.8 305.7L285.4 304.4L286.5 303.3L288.1 302.3L290 301.5L292.3 300.9L294.8 300.6L297.4 300.6L299.9 300.9L302.2 301.5L304.2 302.3L305.7 303.3L306.8 304.4L307.4 305.7L307.4 306.9L306.8 308.2L305.7 309.3Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M307.4 306.9L306.8 308.2L305.7 309.3L304.2 310.3L302.2 311.1L299.9 311.7L297.4 312L294.8 312L292.3 311.7L290 311.1L288.1 310.3L286.5 309.3L285.4 308.2L284.8 306.9\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M307.4 306.9L306 308L305 309.1L303.5 310L301.7 310.7L299.6 311.3L297.3 311.5L294.9 311.5L292.6 311.3L290.5 310.7L288.7 310L287.2 309.1L286.2 308L284.8 306.9\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M284.8 306.9L284.8 305.7L285.4 304.4L286.5 303.3L288.1 302.3L290 301.5L292.3 300.9L294.8 300.6L297.4 300.6L299.9 300.9L302.2 301.5L304.2 302.3L305.7 303.3L306.8 304.4L307.4 305.7L307.4 306.9M307.4 311.6L306.8 312.8L305.7 314L304.2 314.9L302.2 315.7L299.9 316.3L297.4 316.6L294.8 316.6L292.3 316.3L290 315.7L288.1 314.9L286.5 314L285.4 312.8L284.8 311.6M284.8 306.9L284.8 311.6M307.4 306.9L307.4 311.6\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M300.4 308.4L298.7 309L296.6 309.3L294.5 309.2L292.6 308.8L291.1 308L290.3 307.1L290.1 306L290.6 305L291.8 304.2L293.5 303.6L295.6 303.3L297.7 303.4L299.6 303.8L301.1 304.6L301.9 305.5L302.1 306.6L301.6 307.6Z\"/><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"296.1\" cy=\"306.3\" r=\"0.5\"/></g><path class=\"iso-halo\" d=\"M205.2 278L206.4 275.5L208.6 273.1L211.8 271.1L215.9 269.5L220.5 268.4L225.6 267.8L230.8 267.8L235.8 268.4L240.5 269.5L244.5 271.1L247.8 273.1L250 275.5L251.2 278L251.2 280.7L250 283.2L247.8 285.6L244.5 287.6L240.5 289.2L235.8 290.3L230.8 290.9L225.6 290.9L220.5 290.3L215.9 289.2L211.8 287.6L208.6 285.6L206.4 283.2L205.2 280.7Z\" style=\"filter:blur(4px)\"/><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M203.3 276.3L203.6 274.4L204.5 272.5L206 270.7L208 269L210.6 267.5L213.5 266.3L216.9 265.3L220.5 264.5L224.3 264.1L228.2 263.9L232.1 264.1L235.9 264.5L239.5 265.3L242.8 266.3L245.8 267.5L248.3 269L250.4 270.7L251.9 272.5L252.8 274.4L253.1 276.3L253.1 279.4L252.8 281.4L251.9 283.3L250.4 285.1L248.3 286.7L245.8 288.2L242.8 289.5L239.5 290.5L235.9 291.3L232.1 291.7L228.2 291.9L224.3 291.7L220.5 291.3L216.9 290.5L213.5 289.5L210.6 288.2L208 286.7L206 285.1L204.5 283.3L203.6 281.4L203.3 279.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M245.8 288.2L242.8 289.5L242.8 286.4L245.8 285.2ZM242.8 289.5L239.5 290.5L239.5 287.4L242.8 286.4ZM253.1 279.4L252.8 281.4L252.8 278.3L253.1 276.3ZM252.8 281.4L251.9 283.3L251.9 280.2L252.8 278.3ZM251.9 283.3L250.4 285.1L250.4 282L251.9 280.2ZM250.4 285.1L248.3 286.7L248.3 283.7L250.4 282ZM248.3 286.7L245.8 288.2L245.8 285.2L248.3 283.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M239.5 290.5L235.9 291.3L235.9 288.2L239.5 287.4ZM235.9 291.3L232.1 291.7L232.1 288.6L235.9 288.2ZM232.1 291.7L228.2 291.9L228.2 288.8L232.1 288.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M228.2 291.9L224.3 291.7L224.3 288.6L228.2 288.8ZM224.3 291.7L220.5 291.3L220.5 288.2L224.3 288.6ZM220.5 291.3L216.9 290.5L216.9 287.4L220.5 288.2Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M216.9 290.5L213.5 289.5L213.5 286.4L216.9 287.4ZM213.5 289.5L210.6 288.2L210.6 285.2L213.5 286.4ZM210.6 288.2L208 286.7L208 283.7L210.6 285.2ZM208 286.7L206 285.1L206 282L208 283.7ZM206 285.1L204.5 283.3L204.5 280.2L206 282ZM204.5 283.3L203.6 281.4L203.6 278.3L204.5 280.2ZM203.6 281.4L203.3 279.4L203.3 276.3L203.6 278.3Z\"/><path class=\"iso-top\" d=\"M245.8 285.2L242.8 286.4L239.5 287.4L235.9 288.2L232.1 288.6L228.2 288.8L224.3 288.6L220.5 288.2L216.9 287.4L213.5 286.4L210.6 285.2L208 283.7L206 282L204.5 280.2L203.6 278.3L203.3 276.3L203.6 274.4L204.5 272.5L206 270.7L208 269L210.6 267.5L213.5 266.3L216.9 265.3L220.5 264.5L224.3 264.1L228.2 263.9L232.1 264.1L235.9 264.5L239.5 265.3L242.8 266.3L245.8 267.5L248.3 269L250.4 270.7L251.9 272.5L252.8 274.4L253.1 276.3L252.8 278.3L251.9 280.2L250.4 282L248.3 283.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M253.1 276.3L252.8 278.3L251.9 280.2L250.4 282L248.3 283.7L245.8 285.2L242.8 286.4L239.5 287.4L235.9 288.2L232.1 288.6L228.2 288.8L224.3 288.6L220.5 288.2L216.9 287.4L213.5 286.4L210.6 285.2L208 283.7L206 282L204.5 280.2L203.6 278.3L203.3 276.3\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M253.1 276.3L251.9 278.2L251 280.1L249.6 281.8L247.6 283.4L245.2 284.8L242.3 286.1L239.1 287L235.6 287.8L231.9 288.2L228.2 288.4L224.4 288.2L220.8 287.8L217.3 287L214.1 286.1L211.2 284.8L208.8 283.4L206.8 281.8L205.3 280.1L204.5 278.2L203.3 276.3\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M203.3 276.3L203.6 274.4L204.5 272.5L206 270.7L208 269L210.6 267.5L213.5 266.3L216.9 265.3L220.5 264.5L224.3 264.1L228.2 263.9L232.1 264.1L235.9 264.5L239.5 265.3L242.8 266.3L245.8 267.5L248.3 269L250.4 270.7L251.9 272.5L252.8 274.4L253.1 276.3M253.1 279.4L252.8 281.4L251.9 283.3L250.4 285.1L248.3 286.7L245.8 288.2L242.8 289.5L239.5 290.5L235.9 291.3L232.1 291.7L228.2 291.9L224.3 291.7L220.5 291.3L216.9 290.5L213.5 289.5L210.6 288.2L208 286.7L206 285.1L204.5 283.3L203.6 281.4L203.3 279.4M203.3 276.3L203.3 279.4M253.1 276.3L253.1 279.4\"/></g><g class=\"iso-dots\" data-tone=\"mid\"><circle cx=\"242\" cy=\"283.3\" r=\"0.42\"/><circle cx=\"223.1\" cy=\"285.8\" r=\"0.42\"/><circle cx=\"209.3\" cy=\"278.9\" r=\"0.42\"/><circle cx=\"214.3\" cy=\"269.4\" r=\"0.42\"/><circle cx=\"233.2\" cy=\"266.9\" r=\"0.42\"/><circle cx=\"247.1\" cy=\"273.8\" r=\"0.42\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M214.9 267.5L215 266.1L215.7 264.7L217 263.5L218.8 262.4L220.9 261.5L223.4 260.9L226.1 260.5L228.9 260.4L231.6 260.7L234.2 261.2L236.6 261.9L238.6 262.9L240.1 264.1L241.1 265.4L241.5 266.8L241.5 276L241.4 277.4L240.6 278.7L239.4 280L237.6 281.1L235.5 281.9L233 282.6L230.3 282.9L227.5 283L224.7 282.8L222.1 282.3L219.8 281.5L217.8 280.5L216.3 279.4L215.3 278.1L214.9 276.7Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M237.6 281.1L235.5 281.9L235.5 272.7L237.6 271.8ZM241.5 276L241.4 277.4L241.4 268.1L241.5 266.8ZM241.4 277.4L240.6 278.7L240.6 269.5L241.4 268.1ZM240.6 278.7L239.4 280L239.4 270.7L240.6 269.5ZM239.4 280L237.6 281.1L237.6 271.8L239.4 270.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M235.5 281.9L233 282.6L233 273.3L235.5 272.7ZM233 282.6L230.3 282.9L230.3 273.7L233 273.3ZM230.3 282.9L227.5 283L227.5 273.8L230.3 273.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M227.5 283L224.7 282.8L224.7 273.5L227.5 273.8ZM224.7 282.8L222.1 282.3L222.1 273L224.7 273.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M222.1 282.3L219.8 281.5L219.8 272.3L222.1 273ZM219.8 281.5L217.8 280.5L217.8 271.3L219.8 272.3ZM217.8 280.5L216.3 279.4L216.3 270.1L217.8 271.3ZM216.3 279.4L215.3 278.1L215.3 268.8L216.3 270.1ZM215.3 278.1L214.9 276.7L214.9 267.5L215.3 268.8Z\"/><path class=\"iso-top\" d=\"M237.6 271.8L235.5 272.7L233 273.3L230.3 273.7L227.5 273.8L224.7 273.5L222.1 273L219.8 272.3L217.8 271.3L216.3 270.1L215.3 268.8L214.9 267.5L215 266.1L215.7 264.7L217 263.5L218.8 262.4L220.9 261.5L223.4 260.9L226.1 260.5L228.9 260.4L231.6 260.7L234.2 261.2L236.6 261.9L238.6 262.9L240.1 264.1L241.1 265.4L241.5 266.8L241.4 268.1L240.6 269.5L239.4 270.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M241.5 266.8L241.4 268.1L240.6 269.5L239.4 270.7L237.6 271.8L235.5 272.7L233 273.3L230.3 273.7L227.5 273.8L224.7 273.5L222.1 273L219.8 272.3L217.8 271.3L216.3 270.1L215.3 268.8L214.9 267.5\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M241.5 266.8L240.7 268.1L240 269.4L238.8 270.5L237.1 271.6L235.1 272.4L232.7 273L230.2 273.3L227.5 273.4L224.9 273.2L222.5 272.7L220.2 272L218.4 271.1L216.9 270L216 268.7L214.9 267.5\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M214.9 267.5L215 266.1L215.7 264.7L217 263.5L218.8 262.4L220.9 261.5L223.4 260.9L226.1 260.5L228.9 260.4L231.6 260.7L234.2 261.2L236.6 261.9L238.6 262.9L240.1 264.1L241.1 265.4L241.5 266.8M241.5 276L241.4 277.4L240.6 278.7L239.4 280L237.6 281.1L235.5 281.9L233 282.6L230.3 282.9L227.5 283L224.7 282.8L222.1 282.3L219.8 281.5L217.8 280.5L216.3 279.4L215.3 278.1L214.9 276.7M214.9 267.5L214.9 276.7M241.5 266.8L241.5 276\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M221.1 193.2L221.3 192.2L222 191.4L223.2 190.7L224.6 190.1L226.3 189.7L228.2 189.6L230 189.7L231.7 190.1L233.2 190.7L234.3 191.4L235.1 192.2L235.3 193.2L235.3 267.1L235.1 268L234.3 268.9L233.2 269.6L231.7 270.2L230 270.5L228.2 270.7L226.3 270.5L224.6 270.2L223.2 269.6L222 268.9L221.3 268L221.1 267.1Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M233.2 269.6L231.7 270.2L231.7 196.2L233.2 195.7ZM235.3 267.1L235.1 268L235.1 194.1L235.3 193.2ZM235.1 268L234.3 268.9L234.3 194.9L235.1 194.1ZM234.3 268.9L233.2 269.6L233.2 195.7L234.3 194.9Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M231.7 270.2L230 270.5L230 196.6L231.7 196.2ZM230 270.5L228.2 270.7L228.2 196.7L230 196.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M228.2 270.7L226.3 270.5L226.3 196.6L228.2 196.7ZM226.3 270.5L224.6 270.2L224.6 196.2L226.3 196.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M224.6 270.2L223.2 269.6L223.2 195.7L224.6 196.2ZM223.2 269.6L222 268.9L222 194.9L223.2 195.7ZM222 268.9L221.3 268L221.3 194.1L222 194.9ZM221.3 268L221.1 267.1L221.1 193.2L221.3 194.1Z\"/><path class=\"iso-top\" d=\"M233.2 195.7L231.7 196.2L230 196.6L228.2 196.7L226.3 196.6L224.6 196.2L223.2 195.7L222 194.9L221.3 194.1L221.1 193.2L221.3 192.2L222 191.4L223.2 190.7L224.6 190.1L226.3 189.7L228.2 189.6L230 189.7L231.7 190.1L233.2 190.7L234.3 191.4L235.1 192.2L235.3 193.2L235.1 194.1L234.3 194.9Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M235.3 193.2L235.1 194.1L234.3 194.9L233.2 195.7L231.7 196.2L230 196.6L228.2 196.7L226.3 196.6L224.6 196.2L223.2 195.7L222 194.9L221.3 194.1L221.1 193.2\"/><path class=\"iso-line\" data-tone=\"faint\" d=\"M235.3 233.2L235.1 234L234.6 234.8L233.7 235.4L232.6 236L231.3 236.4L229.8 236.7L228.2 236.8L226.6 236.7L225.1 236.4L223.7 236L222.6 235.4L221.8 234.8L221.2 234L221.1 233.2\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M221.1 193.2L221.3 192.2L222 191.4L223.2 190.7L224.6 190.1L226.3 189.7L228.2 189.6L230 189.7L231.7 190.1L233.2 190.7L234.3 191.4L235.1 192.2L235.3 193.2M235.3 267.1L235.1 268L234.3 268.9L233.2 269.6L231.7 270.2L230 270.5L228.2 270.7L226.3 270.5L224.6 270.2L223.2 269.6L222 268.9L221.3 268L221.1 267.1M221.1 193.2L221.1 267.1M235.3 193.2L235.3 267.1\"/></g><g class=\"iso-solid\"><path class=\"iso-fill\" d=\"M218.6 191L218.9 189.8L219.9 188.6L221.4 187.6L223.4 186.9L225.7 186.4L228.2 186.2L230.7 186.4L233 186.9L235 187.6L236.5 188.6L237.5 189.8L237.8 191L237.8 196.2L237.5 197.5L236.5 198.6L235 199.6L233 200.4L230.7 200.9L228.2 201L225.7 200.9L223.4 200.4L221.4 199.6L219.9 198.6L218.9 197.5L218.6 196.2Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M235 199.6L233 200.4L233 195.2L235 194.4ZM237.8 196.2L237.5 197.5L237.5 192.3L237.8 191ZM237.5 197.5L236.5 198.6L236.5 193.4L237.5 192.3ZM236.5 198.6L235 199.6L235 194.4L236.5 193.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M233 200.4L230.7 200.9L230.7 195.6L233 195.2ZM230.7 200.9L228.2 201L228.2 195.8L230.7 195.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M228.2 201L225.7 200.9L225.7 195.6L228.2 195.8ZM225.7 200.9L223.4 200.4L223.4 195.2L225.7 195.6Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M223.4 200.4L221.4 199.6L221.4 194.4L223.4 195.2ZM221.4 199.6L219.9 198.6L219.9 193.4L221.4 194.4ZM219.9 198.6L218.9 197.5L218.9 192.3L219.9 193.4ZM218.9 197.5L218.6 196.2L218.6 191L218.9 192.3Z\"/><path class=\"iso-top\" d=\"M235 194.4L233 195.2L230.7 195.6L228.2 195.8L225.7 195.6L223.4 195.2L221.4 194.4L219.9 193.4L218.9 192.3L218.6 191L218.9 189.8L219.9 188.6L221.4 187.6L223.4 186.9L225.7 186.4L228.2 186.2L230.7 186.4L233 186.9L235 187.6L236.5 188.6L237.5 189.8L237.8 191L237.5 192.3L236.5 193.4Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" d=\"M237.8 191L237.5 192.3L236.5 193.4L235 194.4L233 195.2L230.7 195.6L228.2 195.8L225.7 195.6L223.4 195.2L221.4 194.4L219.9 193.4L218.9 192.3L218.6 191\"/><path class=\"iso-line iso-bevel\" data-tone=\"faint\" d=\"M237.8 191L236.9 192.2L236 193.3L234.6 194.2L232.7 194.9L230.5 195.4L228.2 195.5L225.8 195.4L223.6 194.9L221.8 194.2L220.3 193.3L219.4 192.2L218.6 191\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M218.6 191L218.9 189.8L219.9 188.6L221.4 187.6L223.4 186.9L225.7 186.4L228.2 186.2L230.7 186.4L233 186.9L235 187.6L236.5 188.6L237.5 189.8L237.8 191M237.8 196.2L237.5 197.5L236.5 198.6L235 199.6L233 200.4L230.7 200.9L228.2 201L225.7 200.9L223.4 200.4L221.4 199.6L219.9 198.6L218.9 197.5L218.6 196.2M218.6 191L218.6 196.2M237.8 191L237.8 196.2\"/></g><path class=\"iso-line\" data-tone=\"lo\" d=\"M235 199L235 195M232.2 200L232.2 196M229 200.4L229 196.4M225.7 200.3L225.7 196.3M222.7 199.6L222.7 195.6M220.3 198.4L220.3 194.4M218.9 196.9L218.9 192.9M236.9 197.7L236.9 193.7\"/><g data-part=\"ball-behind\"><g class=\"iso-solid\" data-seamless=\"\"><path class=\"iso-fill\" d=\"M216.6 180.8L216.7 179.3L217 177.9L217.5 176.4L218.2 175.1L219 173.8L220 172.7L221.1 171.7L222.4 170.8L223.8 170.2L225.2 169.7L226.7 169.4L228.2 169.3L229.7 169.4L231.2 169.7L232.6 170.2L234 170.8L235.2 171.7L236.4 172.7L237.4 173.8L238.2 175.1L238.9 176.4L239.4 177.9L239.6 179.3L239.7 180.8L239.6 182.4L239.4 183.8L238.9 185.3L238.2 186.6L237.4 187.9L236.4 189L235.2 190L234 190.9L232.6 191.5L231.2 192L229.7 192.3L228.2 192.4L226.7 192.3L225.2 192L223.8 191.5L222.4 190.9L221.1 190L220 189L219 187.9L218.2 186.6L217.5 185.3L217 183.8L216.7 182.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M216.6 180.8L216.7 179.3L217 177.9L217.5 176.4L218.2 175.1L219 173.8L220 172.7L221.1 171.7L222.4 170.8L223.8 170.2L225.2 169.7L226.7 169.4L228.2 169.3L229.7 169.4L231.2 169.7L232.6 170.2L234 170.8L235.2 171.7L236.4 172.7L237.4 173.8L238.2 175.1L238.9 176.4L239.4 177.9L239.6 179.3L239.7 180.8L239.6 182.4L239.4 183.8L238.9 185.3L238.2 186.6L237.4 187.9L236.4 189L235.2 190L234 190.9L232.6 191.5L231.2 192L229.7 192.3L228.2 192.4L226.7 192.3L225.2 192L223.8 191.5L222.4 190.9L221.1 190L220 189L219 187.9L218.2 186.6L217.5 185.3L217 183.8L216.7 182.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M216.6 180.8L216.7 179.3L217 177.9L217.5 176.4L218.2 175.1L219 173.8L220 172.7L221.1 171.7L222.4 170.8L223.8 170.2L225.2 169.7L226.7 169.4L228.2 169.3L229.7 169.4L231.2 169.7L232.6 170.2L234 170.8L234.7 171.3L235.1 171.8L235.3 172.3L235.4 173L235.3 173.8L235.1 174.7L234.7 175.7L234.2 176.7L233.6 177.8L232.9 178.9L232 180L231.1 181.1L230 182.1L229 183.2L227.8 184.1L226.7 185L225.6 185.7L224.5 186.4L223.4 186.9L222.4 187.4L221.4 187.6L220.6 187.8L219.8 187.7L219.2 187.6L218.7 187.3L218.2 186.6L217.5 185.3L217 183.8L216.7 182.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M216.6 180.8L216.7 179.3L217 177.9L217.5 176.4L218.2 175.1L219 173.8L220 172.7L221.1 171.7L222.4 170.8L223.8 170.2L225.2 169.7L226.7 169.4L228.2 169.3L229.7 169.4L231.2 169.7L232.1 170L232.5 170.2L232.9 170.6L233.1 171.2L233.1 171.8L233.1 172.5L232.9 173.4L232.5 174.2L232.1 175.2L231.5 176.2L230.8 177.2L230 178.2L229.1 179.2L228.2 180.2L227.2 181.2L226.1 182.1L225.1 182.9L224 183.6L223 184.2L222 184.7L221 185.1L220.2 185.3L219.4 185.4L218.7 185.4L218.1 185.3L217.6 185L217.3 184.6L217 183.8L216.7 182.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M216.6 180.8L216.7 179.3L217 177.9L217.5 176.4L218.2 175.1L219 173.8L220 172.7L221.1 171.7L222.4 170.8L223.8 170.2L225.2 169.7L226.7 169.4L228.2 169.3L229.1 169.3L229.6 169.5L230 169.7L230.3 170L230.5 170.5L230.6 171L230.5 171.7L230.3 172.4L230 173.2L229.6 174L229.1 174.8L228.5 175.7L227.8 176.6L227.1 177.5L226.3 178.3L225.4 179.2L224.5 179.9L223.6 180.6L222.7 181.2L221.8 181.8L220.9 182.2L220.1 182.5L219.4 182.7L218.7 182.8L218.1 182.8L217.6 182.7L217.2 182.5L216.9 182.1L216.7 181.7Z\"/><path class=\"iso-top\" d=\"\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M216.6 180.8L216.7 179.3L217 177.9L217.5 176.4L218.2 175.1L219 173.8L220 172.7L221.1 171.7L222.4 170.8L223.8 170.2L225.2 169.7L226.7 169.4L228.2 169.3L229.7 169.4L231.2 169.7L232.6 170.2L234 170.8L235.2 171.7L236.4 172.7L237.4 173.8L238.2 175.1L238.9 176.4L239.4 177.9L239.6 179.3L239.7 180.8L239.6 182.4L239.4 183.8L238.9 185.3L238.2 186.6L237.4 187.9L236.4 189L235.2 190L234 190.9L232.6 191.5L231.2 192L229.7 192.3L228.2 192.4L226.7 192.3L225.2 192L223.8 191.5L222.4 190.9L221.1 190L220 189L219 187.9L218.2 186.6L217.5 185.3L217 183.8L216.7 182.4Z\"/></g></g><g class=\"iso-solid\" data-part=\"cup-behind\"><path class=\"iso-fill\" data-k=\"fill\" d=\"M211.6 177.9L211.8 174.0L213.1 170.3L215.4 167.1L218.5 164.5L222.2 162.9L226.2 162.3L230.1 162.7L233.7 164.3L236.6 166.8L238.6 170.0L239.9 172.5L240.9 176.2L240.7 180.0L239.4 183.7L237.1 187.0L234.0 189.5L230.3 191.2L226.3 191.8L222.4 191.3L218.8 189.7L215.9 187.3L213.9 184.1L212.6 181.5Z\"/><path class=\"iso-shade\" data-shade=\"0\" data-k=\"s0\" d=\"M240.7 180.0L240.9 176.2L239.6 173.6L239.4 177.5ZM240.9 176.2L239.9 172.5L238.6 170.0L239.6 173.6ZM218.8 189.7L222.4 191.3L221.1 188.7L217.5 187.2ZM222.4 191.3L226.3 191.8L225.0 189.2L221.1 188.7ZM226.3 191.8L230.3 191.2L229.0 188.6L225.0 189.2ZM230.3 191.2L234.0 189.5L232.7 187.0L229.0 188.6ZM234.0 189.5L237.1 187.0L235.8 184.4L232.7 187.0ZM237.1 187.0L239.4 183.7L238.1 181.2L235.8 184.4ZM239.4 183.7L240.7 180.0L239.4 177.5L238.1 181.2Z\"/><path class=\"iso-shade\" data-shade=\"1\" data-k=\"s1\" d=\"M215.9 187.3L218.8 189.7L217.5 187.2L214.6 184.7Z\"/><path class=\"iso-shade\" data-shade=\"2\" data-k=\"s2\" d=\"M213.9 184.1L215.9 187.3L214.6 184.7L212.6 181.5Z\"/><path class=\"iso-shade\" data-shade=\"3\" data-k=\"s3\" d=\"\"/><path class=\"iso-top\" data-k=\"top\" d=\"M239.4 177.5L239.6 173.6L238.6 170.0L236.6 166.8L233.7 164.3L230.1 162.7L226.2 162.3L222.2 162.9L218.5 164.5L215.4 167.1L213.1 170.3L211.8 174.0L211.6 177.9L212.6 181.5L214.6 184.7L217.5 187.2L221.1 188.7L225.0 189.2L229.0 188.6L232.7 187.0L235.8 184.4L238.1 181.2Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" data-k=\"crease\" d=\"M239.4 177.5L239.6 173.6M239.6 173.6L238.6 170.0M212.6 181.5L214.6 184.7M214.6 184.7L217.5 187.2M217.5 187.2L221.1 188.7M221.1 188.7L225.0 189.2M225.0 189.2L229.0 188.6M229.0 188.6L232.7 187.0M232.7 187.0L235.8 184.4M235.8 184.4L238.1 181.2M238.1 181.2L239.4 177.5\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" data-k=\"edge\" d=\"M211.6 177.9L211.8 174.0L213.1 170.3L215.4 167.1L218.5 164.5L222.2 162.9L226.2 162.3L230.1 162.7L233.7 164.3L236.6 166.8L238.6 170.0L239.9 172.5L240.9 176.2L240.7 180.0L239.4 183.7L237.1 187.0L234.0 189.5L230.3 191.2L226.3 191.8L222.4 191.3L218.8 189.7L215.9 187.3L213.9 184.1L212.6 181.5Z\"/></g><g class=\"iso-solid\" data-part=\"phone\"><path class=\"iso-fill\" data-k=\"fill\" d=\"M166.7 243.7L167.0 240.0L194.8 94.5L196.0 90.9L198.1 87.6L201.0 85.0L204.5 83.1L208.3 82.1L212.2 82.1L269.1 89.2L272.8 90.2L276.1 92.0L278.7 94.7L280.5 97.9L282.0 101.0L282.9 104.6L282.7 108.4L254.8 253.8L253.6 257.5L251.5 260.7L248.6 263.4L245.1 265.2L241.3 266.2L237.4 266.2L180.5 259.1L176.8 258.2L173.5 256.3L170.9 253.7L169.1 250.4L167.6 247.3Z\"/><path class=\"iso-shade\" data-shade=\"0\" data-k=\"s0\" d=\"M282.7 108.4L282.9 104.6L281.3 101.5L281.1 105.3ZM282.9 104.6L282.0 101.0L280.5 97.9L281.3 101.5ZM173.5 256.3L176.8 258.2L175.2 255.1L171.9 253.2ZM176.8 258.2L180.5 259.1L178.9 256.0L175.2 255.1ZM180.5 259.1L237.4 266.2L235.9 263.1L178.9 256.0ZM237.4 266.2L241.3 266.2L239.7 263.1L235.9 263.1ZM241.3 266.2L245.1 265.2L243.6 262.1L239.7 263.1ZM245.1 265.2L248.6 263.4L247.0 260.2L243.6 262.1ZM248.6 263.4L251.5 260.7L249.9 257.6L247.0 260.2ZM251.5 260.7L253.6 257.5L252.0 254.3L249.9 257.6ZM253.6 257.5L254.8 253.8L253.2 250.7L252.0 254.3ZM254.8 253.8L282.7 108.4L281.1 105.3L253.2 250.7Z\"/><path class=\"iso-shade\" data-shade=\"1\" data-k=\"s1\" d=\"M170.9 253.7L173.5 256.3L171.9 253.2L169.3 250.6Z\"/><path class=\"iso-shade\" data-shade=\"2\" data-k=\"s2\" d=\"M169.1 250.4L170.9 253.7L169.3 250.6L167.6 247.3Z\"/><path class=\"iso-shade\" data-shade=\"3\" data-k=\"s3\" d=\"\"/><path class=\"iso-top\" data-k=\"top\" d=\"M281.1 105.3L281.3 101.5L280.5 97.9L278.7 94.7L276.1 92.0L272.8 90.2L269.1 89.2L212.2 82.1L208.3 82.1L204.5 83.1L201.0 85.0L198.1 87.6L196.0 90.9L194.8 94.5L167.0 240.0L166.7 243.7L167.6 247.3L169.3 250.6L171.9 253.2L175.2 255.1L178.9 256.0L235.9 263.1L239.7 263.1L243.6 262.1L247.0 260.2L249.9 257.6L252.0 254.3L253.2 250.7Z\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" data-k=\"crease\" d=\"M281.1 105.3L281.3 101.5M281.3 101.5L280.5 97.9M167.6 247.3L169.3 250.6M169.3 250.6L171.9 253.2M171.9 253.2L175.2 255.1M175.2 255.1L178.9 256.0M178.9 256.0L235.9 263.1M235.9 263.1L239.7 263.1M239.7 263.1L243.6 262.1M243.6 262.1L247.0 260.2M247.0 260.2L249.9 257.6M249.9 257.6L252.0 254.3M252.0 254.3L253.2 250.7M253.2 250.7L281.1 105.3\"/><path class=\"iso-line\" data-tone=\"mid\" data-k=\"a\" d=\"M274.7 106.2L274.9 103.5L274.3 101.0L273.0 98.7L271.2 96.8L268.9 95.5L266.3 94.9L212.8 88.2L210.0 88.2L207.3 88.9L204.9 90.2L202.8 92.1L201.3 94.4L200.5 96.9L173.3 239.1L173.2 241.7L173.7 244.2L175.0 246.5L176.8 248.4L179.1 249.7L181.7 250.4L235.3 257.0L238.0 257.0L240.7 256.3L243.1 255.0L245.2 253.1L246.7 250.9L247.5 248.3Z\"/><path class=\"iso-line\" data-tone=\"lo\" data-k=\"b\" d=\"M248.7 103.8L248.6 102.7L247.9 101.8L246.8 101.3L228.9 99.1L227.7 99.3L226.7 99.9L226.2 101.0L226.2 101.0L226.3 102.1L227.0 103.0L228.1 103.4L246.0 105.7L247.2 105.5L248.2 104.8L248.7 103.8ZM227.5 246.7L227.5 245.9L227.0 245.3L226.3 245.0L194.8 241.1L194.0 241.2L193.4 241.6L193.0 242.4L193.0 242.4L193.1 243.1L193.5 243.8L194.3 244.1L225.7 248.0L226.5 247.9L227.2 247.4L227.5 246.7ZM207.9 177.5L205.3 170.6L197.7 169.7L192.7 175.6L195.3 182.4L202.9 183.4ZM230.3 180.3L227.7 173.4L220.2 172.5L215.1 178.4L217.7 185.2L225.3 186.1ZM252.8 183.0L250.2 176.2L242.6 175.3L237.6 181.2L240.2 188.0L247.7 188.9Z\"/><path class=\"iso-line iso-edge\" data-tone=\"hi\" data-k=\"edge\" d=\"M166.7 243.7L167.0 240.0L194.8 94.5L196.0 90.9L198.1 87.6L201.0 85.0L204.5 83.1L208.3 82.1L212.2 82.1L269.1 89.2L272.8 90.2L276.1 92.0L278.7 94.7L280.5 97.9L282.0 101.0L282.9 104.6L282.7 108.4L254.8 253.8L253.6 257.5L251.5 260.7L248.6 263.4L245.1 265.2L241.3 266.2L237.4 266.2L180.5 259.1L176.8 258.2L173.5 256.3L170.9 253.7L169.1 250.4L167.6 247.3Z\"/></g><g class=\"iso-solid\" data-part=\"cup-front\"><path class=\"iso-fill\" data-k=\"fill\" d=\"\"/><path class=\"iso-shade\" data-shade=\"0\" data-k=\"s0\" d=\"\"/><path class=\"iso-shade\" data-shade=\"1\" data-k=\"s1\" d=\"\"/><path class=\"iso-shade\" data-shade=\"2\" data-k=\"s2\" d=\"\"/><path class=\"iso-shade\" data-shade=\"3\" data-k=\"s3\" d=\"\"/><path class=\"iso-top\" data-k=\"top\" d=\"\"/><path class=\"iso-line iso-crease\" data-tone=\"faint\" data-k=\"crease\" d=\"\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" data-k=\"edge\" d=\"\"/></g><g data-part=\"ball-front\" style=\"display:none\"><g class=\"iso-solid\" data-seamless=\"\"><path class=\"iso-fill\" d=\"M216.6 180.8L216.7 179.3L217 177.9L217.5 176.4L218.2 175.1L219 173.8L220 172.7L221.1 171.7L222.4 170.8L223.8 170.2L225.2 169.7L226.7 169.4L228.2 169.3L229.7 169.4L231.2 169.7L232.6 170.2L234 170.8L235.2 171.7L236.4 172.7L237.4 173.8L238.2 175.1L238.9 176.4L239.4 177.9L239.6 179.3L239.7 180.8L239.6 182.4L239.4 183.8L238.9 185.3L238.2 186.6L237.4 187.9L236.4 189L235.2 190L234 190.9L232.6 191.5L231.2 192L229.7 192.3L228.2 192.4L226.7 192.3L225.2 192L223.8 191.5L222.4 190.9L221.1 190L220 189L219 187.9L218.2 186.6L217.5 185.3L217 183.8L216.7 182.4Z\"/><path class=\"iso-shade\" data-shade=\"0\" d=\"M216.6 180.8L216.7 179.3L217 177.9L217.5 176.4L218.2 175.1L219 173.8L220 172.7L221.1 171.7L222.4 170.8L223.8 170.2L225.2 169.7L226.7 169.4L228.2 169.3L229.7 169.4L231.2 169.7L232.6 170.2L234 170.8L235.2 171.7L236.4 172.7L237.4 173.8L238.2 175.1L238.9 176.4L239.4 177.9L239.6 179.3L239.7 180.8L239.6 182.4L239.4 183.8L238.9 185.3L238.2 186.6L237.4 187.9L236.4 189L235.2 190L234 190.9L232.6 191.5L231.2 192L229.7 192.3L228.2 192.4L226.7 192.3L225.2 192L223.8 191.5L222.4 190.9L221.1 190L220 189L219 187.9L218.2 186.6L217.5 185.3L217 183.8L216.7 182.4Z\"/><path class=\"iso-shade\" data-shade=\"1\" d=\"M216.6 180.8L216.7 179.3L217 177.9L217.5 176.4L218.2 175.1L219 173.8L220 172.7L221.1 171.7L222.4 170.8L223.8 170.2L225.2 169.7L226.7 169.4L228.2 169.3L229.7 169.4L231.2 169.7L232.6 170.2L234 170.8L234.7 171.3L235.1 171.8L235.3 172.3L235.4 173L235.3 173.8L235.1 174.7L234.7 175.7L234.2 176.7L233.6 177.8L232.9 178.9L232 180L231.1 181.1L230 182.1L229 183.2L227.8 184.1L226.7 185L225.6 185.7L224.5 186.4L223.4 186.9L222.4 187.4L221.4 187.6L220.6 187.8L219.8 187.7L219.2 187.6L218.7 187.3L218.2 186.6L217.5 185.3L217 183.8L216.7 182.4Z\"/><path class=\"iso-shade\" data-shade=\"2\" d=\"M216.6 180.8L216.7 179.3L217 177.9L217.5 176.4L218.2 175.1L219 173.8L220 172.7L221.1 171.7L222.4 170.8L223.8 170.2L225.2 169.7L226.7 169.4L228.2 169.3L229.7 169.4L231.2 169.7L232.1 170L232.5 170.2L232.9 170.6L233.1 171.2L233.1 171.8L233.1 172.5L232.9 173.4L232.5 174.2L232.1 175.2L231.5 176.2L230.8 177.2L230 178.2L229.1 179.2L228.2 180.2L227.2 181.2L226.1 182.1L225.1 182.9L224 183.6L223 184.2L222 184.7L221 185.1L220.2 185.3L219.4 185.4L218.7 185.4L218.1 185.3L217.6 185L217.3 184.6L217 183.8L216.7 182.4Z\"/><path class=\"iso-shade\" data-shade=\"3\" d=\"M216.6 180.8L216.7 179.3L217 177.9L217.5 176.4L218.2 175.1L219 173.8L220 172.7L221.1 171.7L222.4 170.8L223.8 170.2L225.2 169.7L226.7 169.4L228.2 169.3L229.1 169.3L229.6 169.5L230 169.7L230.3 170L230.5 170.5L230.6 171L230.5 171.7L230.3 172.4L230 173.2L229.6 174L229.1 174.8L228.5 175.7L227.8 176.6L227.1 177.5L226.3 178.3L225.4 179.2L224.5 179.9L223.6 180.6L222.7 181.2L221.8 181.8L220.9 182.2L220.1 182.5L219.4 182.7L218.7 182.8L218.1 182.8L217.6 182.7L217.2 182.5L216.9 182.1L216.7 181.7Z\"/><path class=\"iso-top\" d=\"\"/><path class=\"iso-line iso-edge\" data-tone=\"mid\" d=\"M216.6 180.8L216.7 179.3L217 177.9L217.5 176.4L218.2 175.1L219 173.8L220 172.7L221.1 171.7L222.4 170.8L223.8 170.2L225.2 169.7L226.7 169.4L228.2 169.3L229.7 169.4L231.2 169.7L232.6 170.2L234 170.8L235.2 171.7L236.4 172.7L237.4 173.8L238.2 175.1L238.9 176.4L239.4 177.9L239.6 179.3L239.7 180.8L239.6 182.4L239.4 183.8L238.9 185.3L238.2 186.6L237.4 187.9L236.4 189L235.2 190L234 190.9L232.6 191.5L231.2 192L229.7 192.3L228.2 192.4L226.7 192.3L225.2 192L223.8 191.5L222.4 190.9L221.1 190L220 189L219 187.9L218.2 186.6L217.5 185.3L217 183.8L216.7 182.4Z\"/></g></g></svg></div>";

const P = {"origin":[281.01010553452505,242.95513849459297],"scale":1.4061944267797557,"azimuth":45,"elevation":30}, VIEW = [0.6123724356957946,0.6123724356957945,0.49999999999999994], LIGHT = [-0.4526787302125926,0.45267873021259264,0.7682212795973757], BANDS = [0, 0.2, 0.42, 0.62], Q_RANGE = 0.7, BALL = [8,50,64], REST = [[0.8571673007021123,-0.5150380749100542,0],[-0.3827478802932453,-0.6369994440852004,0.6691306063588582],[0.3446277393624636,0.5735568756697902,0.7431448254773942]], PHONE = {"w":50,"h":104,"r":8.5,"back":9,"front":14.5}, CUP = {"r":8,"from":4.5}, KNOB_R = 15.5, FACES = [{"o":[-12,-79.95,45],"u":[1,0,0],"v":[0,0,1]},{"o":[25,-79.95,45],"u":[1,0,0],"v":[0,0,1]},{"o":[62,-79.95,45],"u":[1,0,0],"v":[0,0,1]}];


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
const pd = (points, closed) => points.map(([x, y], i) => (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1)).join("") + (closed ? "Z" : "");
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const put = (F, s, x, y) => iso([F.o[0] + F.a[0] * s + F.u[0] * x + F.v[0] * y, F.o[1] + F.a[1] * s + F.u[1] * x + F.v[1] * y, F.o[2] + F.a[2] * s + F.u[2] * x + F.v[2] * y], P);
function hullOf(points) {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list) => { const out = []; for (const p of list) { while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 1e-9) out.pop(); out.push(p); } return out.slice(0, -1); };
  return [...half(sorted), ...half(sorted.reverse())];
}
const round = (w, h, r, steps = 6) => [[1, 1], [-1, 1], [-1, -1], [1, -1]].flatMap(([sx, sy], corner) => Array.from({ length: steps + 1 }, (_, i) => { const t = (corner + i / steps) * Math.PI / 2; return [sx * (w / 2 - r) + r * Math.cos(t), sy * (h / 2 - r) + r * Math.sin(t)]; }));
const circle = (r, steps, cx = 0, cy = 0) => Array.from({ length: steps }, (_, i) => [cx + r * Math.cos((i / steps) * Math.PI * 2), cy + r * Math.sin((i / steps) * Math.PI * 2)]);
const bandOf = (score) => { let tone = 0; while (tone < 4 && score >= BANDS[tone]) tone++; return tone; };
// A prism standing on any plane: the ring is drawn in the frame's u, v plane and pulled along its axis.
function prism(F, ring, s0, s1) {
  const n = ring.length, low = ring.map(([x, y]) => put(F, s0, x, y)), high = ring.map(([x, y]) => put(F, s1, x, y));
  const tones = [[], [], [], [], []], seen = [];
  for (let j = 0; j < n; j++) {
    const a = ring[j], b = ring[(j + 1) % n];
    let nx = b[1] - a[1], ny = a[0] - b[0];
    if (nx * (a[0] + b[0]) + ny * (a[1] + b[1]) < 0) { nx = -nx; ny = -ny; }
    const length = Math.hypot(nx, ny) || 1;
    const normal = [(F.u[0] * nx + F.v[0] * ny) / length, (F.u[1] * nx + F.v[1] * ny) / length, (F.u[2] * nx + F.v[2] * ny) / length];
    seen.push(dot(normal, VIEW) > 1e-6);
    if (seen[j]) tones[bandOf(dot(normal, LIGHT))].push(pd([low[j], low[(j + 1) % n], high[(j + 1) % n], high[j]], true));
  }
  const front = dot(F.a, VIEW) > 1e-6, cap = front ? high : low, crease = [];
  // the face you see is always the lightest tone, so a tilting handset does not flicker between tones
  tones[front ? 4 : 1].push(pd(cap, true));
  for (let j = 0; j < n; j++) if (seen[j]) crease.push(pd([cap[j], cap[(j + 1) % n]]));
  const outline = pd(hullOf([...low, ...high]), true);
  return { front, fill: outline, s0: tones[0].join(""), s1: tones[1].join(""), s2: tones[2].join(""), s3: tones[3].join(""), top: tones[4].join(""), crease: crease.join(""), edge: outline };
}
// The handset's own axes in the figure's world, for a turn (alpha), a tip front to back (beta) and a roll (gamma),
// in the order the device reports them. Across is the screen's right, along is its top.
function frameOf(alpha, beta, gamma) {
  const ca = Math.cos(alpha * DEG), sa = Math.sin(alpha * DEG), cb = Math.cos(beta * DEG), sb = Math.sin(beta * DEG), cg = Math.cos(gamma * DEG), sg = Math.sin(gamma * DEG);
  const across = [ca * cg - sa * sb * sg, sa * cg + ca * sb * sg, -cb * sg];
  const along = [-sa * cb, ca * cb, sb];
  const out = [ca * sg + sa * sb * cg, sa * sg - ca * sb * cg, cb * cg];
  const world = ([x, y, z]) => [0, 1, 2].map((i) => REST[0][i] * x + REST[1][i] * y + REST[2][i] * z);
  return { o: BALL, u: world(across), v: world(along), a: world(out) };
}
// X, Y and Z as the app reads them (SensorsController.processSensorData).
function valuesOf(alpha, beta, gamma) {
  const c1 = Math.cos(beta * DEG / 2), s1 = Math.sin(beta * DEG / 2), c2 = Math.cos(gamma * DEG / 2), s2 = Math.sin(gamma * DEG / 2), c3 = Math.cos(alpha * DEG / 2), s3 = Math.sin(alpha * DEG / 2);
  const q = { x: s1 * c2 * c3 + c1 * s2 * s3, y: c1 * s2 * c3 - s1 * c2 * s3, z: c1 * c2 * s3 - s1 * s2 * c3 };
  const map = (part) => Math.min(1, Math.max(0, (part + Q_RANGE) / (2 * Q_RANGE)));
  return [map(q.z), map(q.x), map(q.y)];
}
const SCREEN = round(PHONE.w - 7, PHONE.h - 7, PHONE.r - 2.5);
const BODY = round(PHONE.w, PHONE.h, PHONE.r);
const MARKS = [round(13, 2.6, 1.3, 3).map(([x, y]) => [x, y + PHONE.h / 2 - 10]), round(20, 1.8, 0.9, 3).map(([x, y]) => [x, y - PHONE.h / 2 + 9]), ...[-13, 0, 13].map((x) => circle(4.4, 6, x, -4))];
const LENS = [circle(5.2, 22, -13, PHONE.h / 2 - 16), circle(2.6, 16, -13, PHONE.h / 2 - 16)];
function poseOf(alpha, beta, gamma) {
  const F = frameOf(alpha, beta, gamma);
  const body = prism(F, BODY, PHONE.back, PHONE.front), cup = prism(F, circle(CUP.r, 22), CUP.from, PHONE.back);
  const on = (rings, s) => rings.map((ring) => pd(ring.map(([x, y]) => put(F, s, x, y)), true)).join("");
  body.a = body.front ? on([SCREEN], PHONE.front) : on(LENS, PHONE.back);
  body.b = body.front ? on(MARKS, PHONE.front) : "";
  return { front: body.front, body, cup, values: valuesOf(alpha, beta, gamma) };
}
const KEYS = ["fill", "s0", "s1", "s2", "s3", "top", "crease", "a", "b", "edge"];
// what the axis reads for a value from 0 to 1
const degreesOf = (value) => (value - 0.5) * 360;

export function mount(root, say = () => {}) {
const stage = root.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const part = (name) => svg.querySelector('[data-part="' + name + '"]');
const slots = (group) => Object.fromEntries(KEYS.map((key) => [key, group.querySelector('[data-k="' + key + '"]')]).filter(([, node]) => node));
const phone = slots(part("phone")), cupBehind = slots(part("cup-behind")), cupFront = slots(part("cup-front"));
const ballBehind = part("ball-behind"), ballFront = part("ball-front"), wedges = [0, 1, 2].map((index) => part("wedge-" + index)), needles = [0, 1, 2].map((index) => part("needle-" + index));
const paint = (nodes, paths) => { for (const key in nodes) nodes[key].setAttribute("d", paths ? paths[key] || "" : ""); };
let said = "";
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
// The tour moves one thing at a time: tip, roll, then turn.
const TOUR = [[0, 0, 0], [0, 40, 0], [0, -40, 0], [0, 0, 0], [0, 0, 40], [0, 0, -40], [0, 0, 0], [50, 0, 0], [-50, 0, 0]];
const now = [0, 0, 0], goal = [0, 0, 0];
let frame = 0, last = 0, clock = 0, touring = !still.matches, visible = false, idle = 0;
function draw() {
  const pose = poseOf(now[0], now[1], now[2]);
  paint(phone, pose.body);
  paint(cupBehind, pose.front ? pose.cup : null);
  paint(cupFront, pose.front ? null : pose.cup);
  ballBehind.style.display = pose.front ? "" : "none";
  ballFront.style.display = pose.front ? "none" : "";
  const degrees = pose.values.map(degreesOf);
  degrees.forEach((value, index) => { const knob = knobOf(FACES[index], KNOB_R, value); wedges[index].setAttribute("d", knob.wedge); needles[index].setAttribute("d", knob.needle); });
  const text = axesReadout(degrees);
  if (said !== text) { said = text; say(text); }
  if (!touring && stage.getAttribute("aria-valuetext") !== text) { stage.setAttribute("aria-valuenow", String(Math.round(degrees[1]))); stage.setAttribute("aria-valuetext", text); }
}
function tick(time) {
  const dt = last ? Math.min((time - last) / 1000, 1 / 30) : 1 / 60;
  last = time;
  if (touring) { clock += dt; const at = TOUR[Math.floor(clock / 2.4) % TOUR.length]; goal[0] = at[0]; goal[1] = at[1]; goal[2] = at[2]; }
  const ease = still.matches ? 1 : 1 - Math.exp(-dt / 0.34);
  let moving = false;
  for (let i = 0; i < 3; i++) { now[i] += (goal[i] - now[i]) * ease; if (Math.abs(goal[i] - now[i]) < 0.05) now[i] = goal[i]; else moving = true; }
  draw();
  frame = visible && (touring || moving) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
// The reader's setting stays for as long as they are on the figure (pointer over it, or keyboard focus):
// the tour only comes back a while after they have left.
let over = false;
const rest = () => { clearTimeout(idle); if (over || document.activeElement === stage) return; idle = setTimeout(() => { touring = !still.matches; clock = 0; run(); }, 4200); };
const steer = (alpha, beta, gamma) => { touring = false; goal[0] = clamp(alpha, -80, 80); goal[1] = clamp(beta, -55, 55); goal[2] = clamp(gamma, -55, 55); rest(); run(); };
stage.addEventListener("pointerenter", () => { over = true; clearTimeout(idle); });
stage.addEventListener("pointerleave", () => { over = false; rest(); });
stage.addEventListener("pointercancel", () => { over = false; rest(); });
stage.addEventListener("blur", rest);
const seen = new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" });
seen.observe(stage);
stage.addEventListener("pointermove", (event) => {
  const box = svg.getBoundingClientRect();
  if (!box.width || !box.height) return;
  steer(goal[0], ((event.clientY - box.top) / box.height - 0.5) * -130, ((event.clientX - box.left) / box.width - 0.5) * 130);
});
stage.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === "Home") { event.preventDefault(); steer(0, 0, 0); return; }
  const by = (event.shiftKey ? { ArrowRight: [10, 0, 0], ArrowLeft: [-10, 0, 0] } : { ArrowUp: [0, 10, 0], ArrowDown: [0, -10, 0], ArrowRight: [0, 0, 10], ArrowLeft: [0, 0, -10] })[event.key];
  if (!by) return;
  event.preventDefault();
  steer(Math.round(goal[0] + by[0]), Math.round(goal[1] + by[1]), Math.round(goal[2] + by[2]));
});
draw();
return () => { seen.disconnect(); cancelAnimationFrame(frame); clearTimeout(idle); visible = false; };
}
