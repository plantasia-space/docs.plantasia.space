---
title: Pitch
sidebar_position: 9
sidebar_custom_props:
  icon: MoveVertical
---

**Pitch** transposes the notes: everything up a fifth, a bass an octave down, a line moved three
degrees up in the key. It also keeps notes inside a **range**, so a transposed part never ends up too
high or too low for its instrument.

It is a MIDI effect: it sits in an Orbiter's chain before the instrument, after the generator if there
is one. A change applies to every note that begins after it: a note already sounding keeps its pitch.

:::tip[Loads neutral]

Pitch loads at Transpose 0 with the full range: every note passes as it came.

:::

<TryModule module="pitch" set="semitones:7" source="piano">
<ModulePicture
  src="/img/orbiters/midi-effects/pitch.jpg"
  alt="Pitch at +7 st, Fold, full range: the Semitones screen with its staircase, then Pitch (st or deg, Transpose) and Range (Block, Fold or Limit, Lowest, Range)."
  dots={[[1, 41, 58.2], [2, 21.7, 80], [3, 45, 63.9], [4, 51.3, 82.9], [5, 74.8, 82.9], [6, 50, 12.5]]}
/>
</TryModule>

## Pitch

- <Dot>1</Dot>**st** or **deg**: what Transpose counts. **st** (as it loads) is semitones. **deg** is
  degrees of the Orbiter's scale, so a transposed line stays in the key: +2 deg plays every note a third
  higher, major or minor as the scale has it. Each unit keeps its own Transpose, so switching never
  changes what a stored number means.
- <Dot>2</Dot>**Transpose**: how far every note moves, −48 … +48 st or −28 … +28 deg.

## Range

- <Dot>3</Dot>**Block**, **Fold** or **Limit**: what a note outside the range does.
  - **Block**: it isn't played.
  - **Fold** (as it loads): it moves by whole octaves until it is inside, so it keeps its name.
  - **Limit**: it plays at the nearer edge of the range.
- <Dot>4</Dot>**Lowest**: the lowest note let out.
- <Dot>5</Dot>**Range**: how many semitones above Lowest notes may go. At 127 (as it loads) the range
  is the whole keyboard.

## The screen

<Dot>6</Dot>**The Stairs.** One octave as a staircase. In **st** it has twelve even steps from C; in
**deg** it is the Orbiter's scale from its root, each step as tall as its interval. The ring is the note
that came in, the bright ball where it lands, and the arc the move between them. The ladder at the right
is the whole keyboard, C-2 at the bottom to C8 at the top: lit where the range lets notes out, with a
ring for the octave the note came in on and a dot for the one it left on. The big number is the
Transpose. The word above says what happened to the last note: **In range**, **Folded**, **Limited** or
**Blocked** (**Neutral** while Pitch changes nothing), and the light after **Range** flashes when a note
is blocked. Below, the Transpose, then the range mode and the range's two ends.

## Try it

- **A fifth up.** Transpose **+7 st** in front of a second instrument on another dimension that gets the same notes: the two play in fifths.
- **Thirds in the key.** **deg**, Transpose **+2**, with the Orbiter's key set.
- **A bass that stays a bass.** Lowest **C1**, Range **24 st**, **Fold**: whatever you play comes out in those two octaves.
- **A key change on an axis.** Map **Transpose** in **st** from 0 to +5: the whole part moves up a fourth as the axis moves away from rest.

## Mapping

<Term id="axis">Axes</Term> can drive **Transpose** (each unit's own), **Lowest** and **Range**. Toggles
can flip the unit.

## In a room

Every player hears the same notes moved the same way.
