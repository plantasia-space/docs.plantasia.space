// The Orbiter's axis knob, as the app draws it (plantasia.space-design, src/react/arrow/arrow-knob.tsx
// and knob-geometry.ts): a disc that fills from 6 o'clock round to the needle, under a fixed rose of
// eight points whose inner corners sit at half its radius, drawn at 0.9 of the disc.
// An axis runs from -180° to 180° and rests at 0°, the needle at 12 o'clock (orbiters XYZControls.tsx).
// Every figure that shows X, Y and Z draws them with this.
//
// A knob face is a frame { o, u, v }: its centre, the direction of 3 o'clock and the direction of 12 o'clock.


// Runs in the page and in the build: needs `iso` and `P` in scope.
export const KNOB_SOURCE = `
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
`;

// The fixed drawing on the face: the rim and the rose with its spokes.
export function knobFace(F, r, P, iso, lineSvg) {
  const at = (radius, clock) => { const t = (clock * Math.PI) / 180, x = radius * Math.sin(t), y = radius * Math.cos(t); return iso([F.o[0] + F.u[0] * x + F.v[0] * y, F.o[1] + F.u[1] * x + F.v[1] * y, F.o[2] + F.u[2] * x + F.v[2] * y], P); };
  const d = (points, closed) => points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("") + (closed ? "Z" : "");
  const rose = Array.from({ length: 16 }, (_, i) => at(i % 2 ? r * 0.45 : r * 0.9, i * 22.5));
  const spokes = Array.from({ length: 8 }, (_, i) => d([at(0, 0), at(r * 0.9, i * 45)])).join("");
  return lineSvg(d(Array.from({ length: 48 }, (_, i) => at(r, i * 7.5)), true), { tone: "mid" }) + lineSvg(d(rose, true) + spokes, { tone: "mid" });
}

// The two parts the page repaints, in the order they are drawn: the fill goes under the rose, the needle over it.
export const knobWedge = (part, d) => `<path data-part="${part}" d="${d}" style="fill:var(--anatomy-lit);opacity:.2;stroke:none"/>`;
export const knobNeedle = (part, d) => `<path data-part="${part}" class="iso-line" data-tone="lit" data-free="end" d="${d}" style="stroke-width:1.1"/>`;
