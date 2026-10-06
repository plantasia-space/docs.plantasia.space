---
title: Frequency shifter
sidebar_position: 5
sidebar_custom_props:
  icon: Orbit
---

The **Frequency shifter** moves every frequency in a sound by the same number of Hz. It goes in any
effects rack, as an insert or on a <Term id="moon">Moon</Term>: a drum loop, a pad, a voice, a
whole mix.

**What it does that a pitch shifter doesn't.** A [pitch shifter](/docs/orbiters/audio-effects/pitch-shifter) multiplies: up an octave, 100 Hz
becomes 200 Hz and 1 000 Hz becomes 2 000 Hz, so the harmonics stay in line and the sound stays in
tune with itself. A frequency shifter **adds**: shifted up 50 Hz, 100 Hz becomes 150 Hz but
1 000 Hz becomes 1 050 Hz. The harmonics stop lining up, so the sound turns metallic, bell-like,
like a broken radio. The further you go, the stranger it gets.

:::tip[Loads doing nothing]

It loads at Dry/wet 0 %, already set to shift up 50 Hz: turn Dry/wet up to hear it.

:::

<ModulePicture
  src="/img/orbiters/audio-effects/frequency-shifter.jpg"
  wide
  alt="The Frequency shifter at Dry/wet 100 %, Shift +50 Hz, Spread 60 Hz and Feedback 80 %: the Shift screen, then Shift, Spiral and Output."
  dots={[[1, 46.9, 78.8], [2, 57.4, 82.1], [3, 65.5, 82.1], [4, 89.3, 14.5], [5, 77.6, 78.8], [6, 88.1, 82.1], [7, 96.4, 62.2], [8, 96.4, 85.6], [9, 19.7, 14.2]]}
/>

## What a shift sounds like

- **A few Hz.** The pitch barely moves, but at **Dry/wet 50 %** the dry and the shifted sound
  beat against each other: a slow swirl, like a phaser that never resets.
- **Tens of Hz.** Out of tune with itself: metallic, ringing, a sound from another room.
- **Hundreds to thousands of Hz.** Harmonics torn apart: alien, clangorous.
- **Up** brightens and thins the sound; **down** darkens it.
- **Through zero.** Shift a sound down further than its own frequencies and they fold back up: a
  200 Hz tone shifted down 500 Hz comes out at 300 Hz. Sweeping Shift through 0 and down is the
  classic growl, and it never clicks.

## Shift

| Control | What it does |
|---|---|
| <Dot>1</Dot>**Shift** | The big knob: how many Hz every frequency moves, **−5 kHz … +5 kHz**, **+50 Hz** as it loads. Up / Down shows beside its name. Fine near 0 (tenths of a Hz in the middle of the turn), coarse at the ends; it clicks into **0** at twelve o'clock. |
| <Dot>2</Dot>**Spread** | Shifts the left side up and the right side down by half this much, **0 … 1 kHz**. The two sides beat against each other, so the sound swirls across the stereo field. At Shift 0 it is a pure widener: left up, right down. Back at 0, both sides come back together within a few seconds. |
| <Dot>3</Dot>**Low cut** | Keeps everything below it out of the shifter: the bass passes dry, solid and **in tune**, under a shifted top. **Off** at 20 Hz. |

## Spiral

The Spiral feeds the shifted sound back in through a delay, so **each repeat is shifted once
more**: up a step, and up again, an endless staircase (or down, on a downshift).

| Control | What it does |
|---|---|
| <Dot>4</Dot>**Sync** | Off (as it loads), you set **Time** in milliseconds. On, Time is a note length of the Orbiter's tempo, from **1/2** to **1/32T**; **1/8** as it loads. A synced time longer than 1 s is halved until it fits. |
| <Dot>5</Dot>**Feedback** | The big knob: how much goes round again, **0 … 95 %**. At 0 there is no Spiral and Time does nothing. Turning it up doesn't make the sound louder: the level is held, the trail just gets longer. |
| <Dot>6</Dot>**Time** | The time between one repeat and the next, **1 ms … 1 s**, **120 ms** as it loads. Short (under about 30 ms) the repeats blur into a rising or falling shimmer; long, you hear each step of the staircase. Moving it bends the repeats like tape. |

:::note[One frequency can ring]

On a downshift, a frequency at exactly half the shift folds back onto itself (150 Hz shifted down
300 Hz is 150 Hz again), so with a lot of Feedback it rings louder than the rest. On real material
it is one narrow line; pull Feedback down a little if it stands out.

:::

## Output

<Dot>7</Dot>**Dry/wet** blends the dry sound with the shifted one, and <Dot>8</Dot>**Trim** sets the level after it.
**At 50 %, small shifts beat like a phaser**: the dry and the shifted sound at equal level. At
100 % you hear the shifted sound alone (with Low cut on, the bass under it stays dry).

## On a Moon

Like every effect with a Dry/wet knob, it starts at **Dry/wet 100 %** on a Moon: the Moon returns
the shifted sound, beside the dry World. Small shifts beat against the dry in the mix (the
barber-pole phaser); large ones sit beside it as a metallic shadow. With **Low cut** on, the band
under it stays out of the return: the World already carries it.

## The screen

<Dot>9</Dot>A still dodecahedron, the sound as it comes in, holds a turning icosahedron, the shifted sound.

- **The inner solid turns** one way on an upshift and the other way on a downshift, faster the
  further the knob is from 0. At Shift 0 it stands still.
- **The orbit leans with the shift**: an upshift lifts its right end, a downshift its left; level at 0.
- **Spread** splits the orbit into two rings: the left side outside (dashed, a filled dot), the
  right side inside (solid, a hollow dot). The wider the Spread, the further apart.
- **The Spiral** is a few dots climbing (or falling) round the pair, one for each repeat still
  heard; the turns open with Time.
- **Low cut** is the bar on the line feeding the shell: the sound below it stays dry.
- **The big number, bottom left, is Dry/wet**; the dial, bottom right, **Feedback**. At Dry/wet 0 %
  the picture is muted.

The word on the screen is **Up ·** or **Down ·** and **Beating** (under 10 Hz), **Metallic** (to
200 Hz) or **Clang**; **Wide** at Shift 0 with Spread, **Still** at 0 without; **Dry · 0 %**.
Below the picture: Dry/wet, then what the shift does to an A (**220 → 270 Hz**, both sides with
Spread), or **Dry under** the Low cut when it is on. The picture moves only while sound plays.

## Mapping

Every control can be mapped to the Orbiter's axes, and Sync to its toggles: see
[Edit](/docs/orbiters/edit). A Shift mapping rests on +50 Hz and sweeps down through 0 into a small
downshift one way, up into the metallic range the other.
