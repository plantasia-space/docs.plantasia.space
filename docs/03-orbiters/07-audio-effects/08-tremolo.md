---
title: Tremolo
sidebar_position: 8
sidebar_custom_props:
  icon: Activity
---

The **Tremolo** moves a sound's level up and down, on its own: slow and smooth it breathes, at 4–6 times a
second it is the classic amp tremolo, square and on the beat it chops a pad into a rhythm. It goes in any
effects rack, most often as an **insert** on a pad, a guitar, a synth line or a loop, and it behaves the
same wherever it sits.

The level itself moves: **the loud moments stay as loud as the sound you put in, and the quiet ones dip
below it**. That is the difference from the [Auto-panner](/docs/orbiters/audio-effects/auto-panner),
which moves the sound from side to side and keeps its level.

:::tip[Loads doing nothing]

The Tremolo loads doing nothing (Depth 0 %): turn Depth up to set the level moving.

:::

## Motion

| Control | What it does |
|---|---|
| **Sync** | Off (as it loads): Rate is in Hz. On: Rate is a note value or a number of bars of the Orbiter's tempo, and the pulse locks to the beat. |
| **Depth** | How far the level dips on each pulse. At 50 % it dips to half (−6 dB), at 100 % to silence. **0 %** as it loads: the sound as it came in. |
| **Rate** | How fast the level rises and falls. Free: 0.05 … 20 Hz, **4.00 Hz** as it loads. Synced: 8 bars down to 1/32, with dotted values and triplets; **1/8** as it loads. |
| **Shape** | How the level moves: **Triangle** at 0 %, **Sine** at 50 % (as it loads), **Square** at 100 %, and every step between. |
| **Spread** | How far the right side's pulse trails the left's: **0°** as it loads (both sides together) up to **90°**, a quarter of a pulse later. |

**Depth and loudness.** Because the loud moments stay where they were, the sound gets a little quieter
on average as Depth goes up: at Depth 100 % about **−4.3 dB** with Sine, −4.8 dB with Triangle and
−3.0 dB with Square; at 50 % about −2.3 dB. On an <Term id="axis">axis</Term> that takes Depth up, that
reads as "more chop, less sound", which is what a chop is. **Trim** is there to bring it back up, and
**Dry/wet** under 100 % makes every dip shallower. The
Tremolo never pushes the peaks above the sound you put in, so it is safe on a loud bus.

**Shape: three ways to pulse.** One knob goes through three shapes, ordered by how long the level stays
fully up and fully down:

- **Triangle** (0 %): an even ramp up and down, never resting.
- **Sine** (50 %, a click-stop on the knob): it lingers at the top and the bottom and moves quickly in
  between, the smooth classic.
- **Square** (100 %): it switches on and off, a chop. Each switch takes 4 ms at every rate: short enough
  to sound like a cut, long enough not to click.

Between Sine and Square the switches get shorter step by step, so mapping Shape to an axis goes smoothly
from a swell to a chop. It is the same Shape knob as the Auto-panner's, so the two feel alike.

**Sync on the beat.** With Sync on, the pulse is locked to the Orbiter's beat, not only to its speed:
every pulse starts **fully open on the beat**. At **1/8** and Shape 100 % the sound is on for the first
half of every eighth note and off for the second, each switch finishing just before its beat, so a hit on
the beat passes whole. Every peer in a room pulses together.

When you start, stop or move the transport, the pulse doesn't jump to the new place: it speeds up or
slows down (never more than half again as fast, never backwards) until it is back on the beat, so it
never clicks. Stopped, it keeps pulsing at the tempo's speed.

**Spread: a pulse that shimmers.** At 0° both sides pulse together, a plain tremolo (a mono sound stays
mono). Turn Spread up and the right side follows the left a moment later, so the pulse starts on the left
and lands on the right: the pulse shimmers across the stereo image. At 90° the right side is a quarter of
a pulse behind. Spread stops there on purpose: further apart, the sound stops pulsing and starts
travelling from side to side, which is the Auto-panner's job.

## Output

| Control | What it does |
|---|---|
| **Dry/wet** | Balance between the steady sound and the pulsing one. **100 %** as it loads: the tremolo alone. At 50 % the dips are half as deep, so it is a second way to soften the pulse, handy on an axis that already moves Depth. |
| **Trim** | The level after the tremolo, to bring back what the dips take away. |

## The bass pulses too

The Tremolo moves the whole sound, bass and kick included. To keep a loop's kick and bass steady while
the pads and the hats pulse, put the Tremolo **after the parts you want to pulse**, not on the full mix:
on the pad's or the synth's own rack, before they meet the drums.

**Heard in mono** (a phone speaker, a club's mono sum): at Spread 0° it sounds the same as in stereo.
With Spread the two sides dip at different moments, so the mono sum dips less than each side.

## The screen

**Conversation.** Two plants stand at the sides, the left and the right of the sound, and their heads are
level on one line. Between them runs the pulse the two send each other.

- **Each head** glows as loud as its side is now. The outer dashed ring is the sound's own level; the
  inner one is how far it dips (Depth). Only the heads breathe.
- **Each band** runs from a head to the middle: its side's level over the last half second, as wide as
  the level. **Shape** is the band's form (ramps, waves or blocks), **Rate** how many pulses it holds,
  **Depth** how far it narrows.
- **Spread** is the gap where the two bands would meet (the right head answers later), and the two hands
  above it: one line at 0°, a right angle at 90°.
- **Sync on:** a tick under each band for every beat.
- **Depth** is also the small number in the bottom-left corner. At 0 % the picture turns grey: **Still · 0 %**.

The word above the picture follows Shape: **Ramp**, **Swell**, **Throb** or **Chop**. Below it, the rate
(with the length of one pulse) and how far it dips, with the Spread when it is on. The heads pulse at the
real rate up to about once a second and calmly above that; the rate itself is in the readout and in the
bands. When you turn Rate, the picture takes up the new rate once the knob comes to rest. It moves only
while sound plays; at rest, and with your system's reduced-motion setting, it is a still picture of the
current values.

## Mapping

Every Tremolo control can be mapped to the Orbiter's axes, and Sync to its toggles: see
[Edit](/docs/orbiters/edit). Depth and Spread rest on 0 (a light shimmer one way, a full chop or a full
quarter-pulse spread the other); Rate and Shape rest on the values they load with.
