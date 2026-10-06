---
title: Pitch shifter
sidebar_position: 6
sidebar_custom_props:
  icon: ArrowUpDown
---

The **Pitch shifter** plays a copy of the sound moved up or down by an interval: an octave under a
bass, a fifth over a pad, a few cents either side to make a voice wide and doubled, or a shimmer
that keeps climbing. It goes in any effects rack, **an insert** or **a Moon**.

It is a character shifter, not an invisible retune: it slices the sound into short windows and
plays each one faster or slower, crossfading as it goes. On a held note you can hear a faint
warble at the window's rate; on drums and textures it sounds like the classic studio harmonizer.

:::tip[Loads doing nothing]

It loads at Pitch 0, Fine 0 and Spread 0: the sound passes untouched until you move one of them.

:::

<ModulePicture
  src="/img/orbiters/audio-effects/pitch-shifter.jpg"
  wide
  alt="The Pitch shifter as an insert at +7 st, a fifth up, with a little Spread and Feedback: the Interval screen, then Pitch and Output."
  dots={[[1, 50.1, 78.8], [2, 61.3, 82.1], [3, 70, 82.1], [4, 78.6, 82.1], [5, 87.3, 82.1], [6, 96.1, 62.1], [7, 96.1, 85.6], [8, 21, 14.1]]}
/>

## Pitch

| Control | What it does |
|---|---|
| <Dot>1</Dot>**Pitch** | The big knob. Moves the sound by whole semitones, **−24 … +24 st**: 12 is an octave, 7 a fifth, 5 a fourth. Beside its name it says the interval in words: **5th up**, **octave down**. It steps from note to note, so an axis lands on intervals. |
| <Dot>2</Dot>**Fine** | Nudges the pitch by cents, a hundredth of a semitone, **−50 … +50 ct**, on top of Pitch. |
| <Dot>3</Dot>**Spread** | Tunes the left side down and the right side up by this much, **0 … 50 ct**. With Pitch at 0, a little (8 to 15 cents) is the classic doubler: one voice becomes two, wide, without a chorus's wobble. With Pitch moved it widens the copy. |
| <Dot>4</Dot>**Window** | How long each slice is, **10 … 100 ms**. Short keeps attacks tight but turns grainy, almost metallic below 20 ms; long is smoother on held notes but softer, and slightly echoed. Turning it bends the pitch for a moment (a short glide, never a jump). |
| <Dot>5</Dot>**Feedback** | Sends the shifted copy back through, **0 … 90 %**, so it moves another interval with each pass: a fifth becomes a stack of fifths. Short windows blur the passes into a rising (or falling) **shimmer**; long windows let you hear the steps. Turning it up doesn't make the sound louder: the level is held. |

### How late the copy is

Each slice is read from a short memory, so the shifted copy runs a little behind the sound: half a
window on average, **up to the whole window** (25 ms on average at the 50 ms it loads with). As a
harmony that's part of the character; to keep a copy tight, shorten Window. At Pitch, Fine and
Spread 0 there is no delay at all.

### The top of an upward shift

What would land above the highest frequency the sound can carry is dropped instead of folding back
as a harsh whistle. So the higher you shift, the lower the top: an octave up keeps the input up to
about 10 kHz, two octaves up to about 5 kHz. Going down nothing is cut from the first copy (with Feedback, each pass loses only what lies under 30 Hz, so the passes don't pile up rumble).

## Output

<Dot>6</Dot>**Dry/wet** loads at **50 %**: the first move of Pitch is a harmony, the shifted copy
beside the original. At 100 % the copy replaces it. <Dot>7</Dot>**Trim** sets the level after it.

## On a Moon

On a <Term id="moon">Moon</Term> it starts at **Dry/wet 100 %**, like every effect there: the Moon
returns only the shifted copy, a harmony next to the World's dry sound (add Feedback for a shimmer).
With Pitch, Fine and Spread all at 0 it returns **nothing**, so an untouched Pitch shifter on a Moon
is silent until you move one of them. Turn its Dry/wet below 100 % and some of the dry comes back
too.

## The screen

<Dot>8</Dot>Root and bloom: the ground line is the original pitch, a seed on it.

- **Shifted up, a stem grows** above the ground by the interval and opens into a flower; **shifted
  down, a root** goes into the earth to a bulb. The higher the flower, the smaller it is; the deeper
  the bulb, the bigger. Faint dotted lines mark the octaves, ±12 and ±24.
- **Window** shows in the edges: smooth petals and few root hairs at long windows, ragged petals and
  more hairs as it shortens.
- **Spread** splits the stem in two, leaning apart; Spread alone grows two short sprouts.
- **Feedback** adds side shoots, one interval further each, fading.
- **The number, top left, is the interval** in semitones (a bar in front for down). **The dial,
  bottom left, is Dry/wet**; at 100 % the seed dims: the original has left the mix.
- The seed and the copy pulse on the same beat while sound plays (the shifter keeps the timing,
  only the pitch moves), and a flower sways with it.

The word on the screen is the interval (**Up · 5th**, **Down · octave**), **Up · cents** or
**Down · cents** for Fine alone, **Wide** for Spread alone, **Off**, **Send · silent** on a Moon with
Pitch, Fine and Spread at 0, or **Dry · 0 %**. Below the picture: the interval, then the ratio (**×1.50**), Spread,
Window and Feedback.

## Mapping

Every control can be mapped to the Orbiter's axes: see [Edit](/docs/orbiters/edit). Pitch rests on
0 and moves to −12 one way and +7 the other, so an axis plays an octave down and a fifth up around
the untouched sound.
