---
title: Velocity
sidebar_position: 3
sidebar_custom_props:
  icon: Signal
---

**Velocity** reshapes how hard each note plays: softer hands, harder accents, a floor so nothing is
too quiet, one velocity for every note, or a little randomness so a sequence breathes.

It is a MIDI effect: it sits in an Orbiter's chain before the instrument, after the generator if
there is one. A change applies from the next note: a note already sounding keeps its velocity.

:::tip[Loads as a straight line]

Velocity loads with every note coming out as it went in, so adding it changes nothing until you move something.

:::


<TryModule module="velocity" set="random:24" source="piano">
<ModulePicture
  src="/img/orbiters/midi-effects/velocity.jpg"
  alt="Velocity as it loads, a straight line from in to out: the curve on the screen, then Curve, In and Out."
  dots={[[1, 8, 82.1], [2, 21.2, 82.1], [3, 34.3, 82.1], [4, 47.4, 93.8], [5, 59.8, 93.8], [6, 66.2, 69.9], [7, 72.8, 93.8], [8, 88.4, 81], [9, 89.4, 93.8], [10, 50, 14.2]]}
/>
</TryModule>

## Curve

- <Dot>1</Dot>**Drive**: up, soft notes come out louder; down, loud notes come out softer.
- <Dot>2</Dot>**Compand**: up, quiet notes get quieter and loud ones louder; down, every note moves towards the
  middle (even hands).
- <Dot>3</Dot>**Random**: moves each note up or down by up to this much, after the curve.

## In

The **window** is the range of velocities the curve reads: from <Dot>4</Dot>**Lowest** to Lowest + <Dot>5</Dot>**Range**.
<Dot>6</Dot>What happens to a note outside it:

- **Clip**: it plays at the window's nearest edge.
- **Gate**: it isn't played at all (a velocity filter).
- **Fixed**: every note plays at <Dot>7</Dot>**Fixed**, whatever its velocity (a drum machine's feel). Fixed is
  only used in this mode; elsewhere it reads n/a.

## Out

<Dot>8</Dot>**Out high** and <Dot>9</Dot>**Out low** are what the top and the bottom of the window come out as. Set Out low
above Out high and the curve turns over: loud in, soft out.

## The screen

<Dot>10</Dot>The plot reads the velocity in (across) against the velocity out (up). The faint diagonal is
"unchanged"; the solid line is the curve. Grey zones are outside the window; with Gate, the curve
drops through the floor there. With Random, two faint lines show its spread. A dot marks each note
just played, and the readout says what it came in and went out at ("90 → 104").

Drag the handles to shape it: under the plot, **Lowest** and the window's top; on the left, **Out
low** and **Out high** (double-click one to reset it). On the smallest drawer the screen hides; the
number boxes do the same job.

## Mapping

<Term id="axis">Axes</Term> can drive every knob and number: a Planet that leans in plays louder (Drive), or a line gets
more uneven the further it goes (Random). The mode is a choice of three, so it isn't mappable.

## In a room

Every player hears the same velocities, Random included. Random reads one shared list of numbers, a
note at a time per pitch class, so a note that reaches someone late still gets the same velocity.
Someone joining takes over where the room is.
