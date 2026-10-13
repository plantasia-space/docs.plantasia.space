// The page's side of a landing figure (PLA-523): it only moves what the build drew, and reports taps.
// One copy serves every figure: `mount(root, scene, hooks)`, with `scene` the figure's own <name>.json.
// It is the home machine's script (figures/src/home-machine/build.mjs) without its sound: the page
// that shows the figure owns the sound, and plays it from `hooks.tap`.
function linkEnds(link, p) {
  const from = [p[0] + link.off[0], p[1] + link.off[1], p[2] + link.off[2]];
  const c = link.ball, d = [from[0] - c[0], from[1] - c[1], from[2] - c[2]], n = Math.hypot(d[0], d[1], d[2]) || 1;
  return [from, [c[0] + (d[0] / n) * link.r, c[1] + (d[1] / n) * link.r, c[2] + (d[2] / n) * link.r]];
}
function trackAt(track, t) {
  const n = track.pts.length / 3, u = (((t % track.period) + track.period) % track.period) / track.period;
  const f = u * (track.closed ? n : n - 1), i = Math.floor(f) % n, j = track.closed ? (i + 1) % n : Math.min(i + 1, n - 1), w = f - Math.floor(f);
  const a = track.pts, lerp = (o) => a[i * 3 + o] + (a[j * 3 + o] - a[i * 3 + o]) * w;
  return [lerp(0), lerp(1), lerp(2)];
}
// A finger that moves further than this between down and up was scrolling, not tapping.
const TAP_SLOP = 10;
const KICK_SECONDS = 1.1;

export function mount(root, SCENE, hooks = {}) {
  const svg = root.querySelector("svg"), layer = svg.querySelector("[data-layer]"), C = SCENE.camera;
  if (svg.dataset.build !== SCENE.build) throw new Error("the picture and its data are from different builds");
  const iso = (p) => [C.o[0] + p[0] * C.x[0] + p[1] * C.y[0] + p[2] * C.z[0], C.o[1] + p[0] * C.x[1] + p[1] * C.y[1] + p[2] * C.z[1]];
  const depth = (p) => p[0] * C.v[0] + p[1] * C.v[1] + p[2] * C.v[2];
  const fixed = [], moving = {};
  for (const el of Array.from(layer.children)) { if (el.dataset.mover) moving[el.dataset.mover] = el; else fixed.push({ el, k: Number(el.dataset.k) }); }
  const part = (name) => svg.querySelector('[data-part="' + name + '"]');
  const movers = SCENE.movers.map((m) => ({ ...m, el: moving[m.name], home: iso(m.rest), slot: -1, shift: [0, 0], at: m.rest }));
  const byName = Object.fromEntries(movers.map((m) => [m.name, m]));
  const links = SCENE.links.map((l) => ({ ...l, el: part(l.part) }));
  const parts = Object.entries(SCENE.parts).map(([name, spec]) => ({ name, ...spec, el: part(name), level: 0 })).filter((p) => p.el);
  const levelOf = Object.fromEntries(parts.map((p) => [p.name, p]));
  const spin = SCENE.spin.map((s) => ({ ...s, frames: Array.from(part(s.part).children), shown: 0 }));
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const n1 = (n) => n.toFixed(1);
  // write an attribute or a style only when it changes: most parts are at rest most of the time
  const written = new WeakMap();
  const write = (el, name, value) => { let seen = written.get(el); if (!seen) written.set(el, (seen = {})); if (seen[name] === value) return; seen[name] = value; if (name === "opacity") el.style.opacity = value; else el.setAttribute(name, value); };
  // put a mover where it is, and at its place in the back-to-front order
  function place(m, p) {
    const s = iso(p);
    m.at = p; m.shift = [s[0] - m.home[0], s[1] - m.home[1]];
    write(m.el, "transform", "translate(" + n1(m.shift[0]) + " " + n1(m.shift[1]) + ")");
    const key = depth(p) + m.bias;
    let lo = 0, hi = fixed.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (fixed[mid].k <= key) lo = mid + 1; else hi = mid; }
    if (lo !== m.slot) { m.slot = lo; layer.insertBefore(m.el, lo < fixed.length ? fixed[lo].el : null); }
  }
  // a tap sets its part off once more: name -> the second it was tapped
  const kicks = {};
  let present = -1;
  function draw(t) {
    for (const m of movers) {
      const track = SCENE.tracks[m.track], local = (((t + m.offset) % track.period) + track.period) % track.period;
      place(m, trackAt(track, local));
      if (track.fade) write(m.el, "opacity", Math.min(1, local / track.fade[0], Math.max(0, 1 - (local - track.fade[1]) / (track.fade[2] - track.fade[1]))).toFixed(1));
    }
    for (const l of links) {
      const m = byName[l.mover], [a, b] = linkEnds(l, m.at).map(iso);
      write(l.el, "d", "M" + n1(a[0] - m.shift[0]) + " " + n1(a[1] - m.shift[1]) + "L" + n1(b[0] - m.shift[0]) + " " + n1(b[1] - m.shift[1]));
    }
    for (const p of parts) p.level = 0;
    for (const e of SCENE.events) {
      const track = SCENE.tracks[e.track], p = levelOf[e.part];
      if (!p) continue;
      for (const m of movers) {
        if (m.track !== e.track) continue;
        const since = ((((t + m.offset - e.at) % track.period) + track.period) % track.period) / e.dur;
        if (since < 1) p.level = Math.max(p.level, Math.sin(Math.PI * since) * (1 - 0.5 * since));
      }
    }
    for (const name in kicks) {
      const p = levelOf[name], since = (t - kicks[name]) / KICK_SECONDS;
      if (since >= 1) { delete kicks[name]; continue; }
      if (p && since > 0) p.level = Math.max(p.level, Math.sin(Math.PI * since) * (1 - 0.5 * since));
    }
    let here = 0;
    for (const p of parts) {
      const b = p.level;
      if (p.kind === "dip") write(p.el, "transform", "translate(0 " + n1(p.amp * b) + ")");
      else if (p.kind === "nod") write(p.el, "transform", "rotate(" + n1(p.amp * b) + " " + p.pivot[0] + " " + p.pivot[1] + ")");
      else if (p.kind === "grow") write(p.el, "transform", "translate(" + p.pivot[0] + " " + p.pivot[1] + ") scale(" + (1 + p.amp * b).toFixed(3) + ") translate(" + -p.pivot[0] + " " + -p.pivot[1] + ")");
      else if (p.kind === "slide") write(p.el, "transform", "translate(" + n1(p.vec[0] * b) + " " + n1(p.vec[1] * b) + ")");
      else if (p.kind === "glow") write(p.el, "opacity", (p.base + (1 - p.base) * b).toFixed(2));
      else if (p.kind === "visit") {
        // someone who comes, stays a while and goes: there for `stay` of each period, fading at both ends
        const u = ((((t / p.period + p.phase) % 1) + 1) % 1) / p.stay, there = u >= 1 ? 0 : Math.min(1, u / 0.2, (1 - u) / 0.2);
        write(p.el, "opacity", there.toFixed(2));
        write(p.el, "pointer-events", there > 0.3 ? "auto" : "none");
        if (there > 0.5) here += 1;
      }
    }
    if (here !== present) { present = here; hooks.count?.(here); }
    for (const s of spin) {
      const show = Math.floor((((t / s.period) % 1) + 1) % 1 * s.frames.length);
      if (show !== s.shown) { s.frames[s.shown].style.display = "none"; s.frames[show].style.display = ""; s.shown = show; }
    }
  }
  let t = SCENE.rest, frame = 0, last = 0, visible = false, paused = false;
  // The motion is slow: 30 frames a second look the same as 60 and halve the work on a phone.
  const FRAME_MS = 1000 / 30;
  function tick(now) {
    if (last && now - last < FRAME_MS - 3) { frame = requestAnimationFrame(tick); return; }
    t += last ? Math.min((now - last) / 1000, 1 / 20) : 0;
    last = now;
    draw(t);
    frame = visible && !paused && !still.matches ? requestAnimationFrame(tick) : 0;
  }
  const run = () => { if (!frame && visible && !paused && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
  const seen = new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; run(); }, { rootMargin: "120px 0px" });
  seen.observe(svg);
  still.addEventListener("change", run);
  draw(t);

  // ---- taps: what was drawn under the finger says what it plays (data-tap); the page plays it
  const tapOf = (target) => {
    const el = target instanceof Element ? target.closest("[data-tap]") : null;
    if (el && svg.contains(el)) return el;
    return SCENE.elseTap ? svg : null;
  };
  function play(e) {
    const el = tapOf(e.target);
    if (!el) return;
    // an object drawn in several pieces (data-whole) is measured as one
    const whole = el !== svg && el.dataset.whole ? Array.from(svg.querySelectorAll('[data-whole="' + el.dataset.whole + '"]')).map((piece) => piece.getBoundingClientRect()) : null;
    const box = svg.getBoundingClientRect();
    const own = el === svg ? box : whole ? (() => { const left = Math.min(...whole.map((r) => r.left)), top = Math.min(...whole.map((r) => r.top)); return { left, top, width: Math.max(...whole.map((r) => r.right)) - left, height: Math.max(...whole.map((r) => r.bottom)) - top }; })() : el.getBoundingClientRect();
    const kind = el === svg ? SCENE.elseTap : el.dataset.tap;
    const cx = own.left + own.width / 2, cy = own.top + own.height / 2, reach = Math.max(1, Math.min(own.width, own.height) / 2);
    hooks.tap?.({
      kind,
      count: el.dataset.count === undefined ? undefined : Number(el.dataset.count),
      // where on the figure (0..1 across), for the sound's place between the ears
      x: (e.clientX - box.left) / Math.max(1, box.width),
      // where on the thing tapped: 0..1 across it, and 0 at its edge to 1 at its centre
      across: Math.max(0, Math.min(0.999, (e.clientX - own.left) / Math.max(1, own.width))),
      inward: Math.max(0, Math.min(1, 1 - Math.hypot(e.clientX - cx, e.clientY - cy) / reach)),
    });
    if (still.matches) return;
    for (const entry of (el.dataset.kick || "").split(",")) {
      const [name, delay] = entry.split("@");
      if (name) kicks[name] = t + Number(delay || 0);
    }
    // a ring at the point tapped
    const scale = svg.viewBox.baseVal.width / Math.max(1, box.width);
    const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    ring.setAttribute("class", "lf-ping");
    ring.setAttribute("cx", n1((e.clientX - box.left) * scale));
    ring.setAttribute("cy", n1((e.clientY - box.top) * scale));
    ring.setAttribute("r", kind === "gong" ? "70" : "30");
    svg.appendChild(ring);
    const going = ring.animate([{ transform: "scale(.15)", opacity: 0.8 }, { transform: "scale(1)", opacity: 0 }], { duration: kind === "gong" ? 2600 : 1400, easing: "ease-out" });
    going.onfinish = going.oncancel = () => ring.remove();
  }
  // A mouse plays on press. A finger plays on lift, and only if it barely moved: a scroll that starts
  // on a drawing never sounds, and a lift (unlike a touch press) may unlock audio.
  let down = null;
  const onDown = (e) => { if (e.pointerType === "mouse") play(e); else down = { id: e.pointerId, x: e.clientX, y: e.clientY }; };
  const onUp = (e) => { const d = down; down = null; if (d && d.id === e.pointerId && Math.hypot(e.clientX - d.x, e.clientY - d.y) <= TAP_SLOP) play(e); };
  const onCancel = () => { down = null; };
  svg.addEventListener("pointerdown", onDown);
  svg.addEventListener("pointerup", onUp);
  svg.addEventListener("pointercancel", onCancel);

  const unmount = () => {
    seen.disconnect(); still.removeEventListener("change", run); cancelAnimationFrame(frame); visible = false;
    svg.removeEventListener("pointerdown", onDown); svg.removeEventListener("pointerup", onUp); svg.removeEventListener("pointercancel", onCancel);
  };
  unmount.pause = (on) => { paused = on; run(); };
  return unmount;
}
