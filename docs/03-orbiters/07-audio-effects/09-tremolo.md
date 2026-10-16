---
title: Tremolo
sidebar_position: 9
sidebar_custom_props:
  icon: Activity
---

The **Tremolo** moves a sound's level up and down, on its own: slow and smooth it breathes, at 4 to 6 times a
second it is the classic amp tremolo, square and on the beat it chops a pad into a rhythm. It goes in any
effects rack, most often as an **insert** on a pad, a guitar, a synth line or a loop, and it behaves the
same wherever it sits.

The level itself moves: **the loud moments stay as loud as the sound you put in, and the quiet ones dip
below it**. That is the difference from the [Auto-panner](/docs/orbiters/audio-effects/auto-panner),
which moves the sound from side to side and keeps its level.

:::tip[Loads doing nothing]

The Tremolo loads doing nothing (Depth 0 %): turn Depth up to set the level moving.

:::

<TryModule module="tremolo" set="depth:60" source="drums">
<ModulePicture
  src="/img/orbiters/audio-effects/tremolo.jpg"
  wide
  alt="The Tremolo at Depth 60 %, Sine, 4 Hz: the Conversation screen, then Motion and Output."
  dots={[[1, 83.9, 14.7], [2, 54, 58.3], [3, 66.6, 58.3], [4, 76.4, 58.3], [5, 86.3, 58.3], [6, 95.8, 45.3], [7, 95.8, 68.8], [8, 22.8, 14.2]]}
/>
</TryModule>

## Motion

| Control | What it does |
|---|---|
| **LFO** | The pulse is one of [the Orbiter's nine LFOs](/docs/orbiters/interact#an-lfo-in-a-module). The menu on the tab picks which (the dimension's X as it loads), the hexagon switches the pulse on and off. Its **Rate in** (Hz, Beats or a value of the World), **Rate**, **Shape** and **LFO depth** are that LFO's own, shared with whatever else reads it: an axis on the same LFO moves with the pulse. |
| <Dot>2</Dot>**Depth** | How far the level dips on each pulse. At 50 % it dips to half, at 100 % to silence. **0 %** as it loads: the sound as it came in. |
| <Dot>5</Dot>**Spread** | How far the right side's pulse trails the left's: **0°** as it loads (both sides together) up to **90°**, a quarter of a pulse later. |

**Depth and loudness.** As Depth goes up the sound gets a little quieter on average; **Level** brings
it back. The Tremolo never pushes the peaks above the sound you put in.

**Shape: ways to pulse.** The LFO's Shape: Sine lingers at the top and the bottom; Triangle ramps evenly
up and down; the ramps swell and drop; Square switches on and off, a chop; Random steps. Map Shape to
an <Term id="axis">axis</Term> and it goes smoothly from a swell to a chop.

**On the beat.** With the LFO's Rate in on **Beats**, the pulse is locked to the Orbiter's beat, not
only to its speed: every pulse starts on the beat. At **Square** and **1/8** the sound is on for half
of every eighth note and off for the other half. Every player in a room pulses together. Start, stop or
jump the transport and the pulse slides back onto the beat without a click.

**Spread: a pulse that shimmers.** At 0° both sides pulse together, a plain tremolo (a mono sound stays
mono). Turn Spread up and the right side follows the left a moment later, so the pulse starts on the left
and lands on the right: the pulse shimmers across the stereo image. At 90° the right side is a quarter of
a pulse behind. Spread stops there on purpose: further apart, the sound stops pulsing and starts
travelling from side to side, which is the Auto-panner's job.

## Output

| Control | What it does |
|---|---|
| <Dot>6</Dot>**Dry/wet** | Balance between the steady sound and the pulsing one. **100 %** as it loads: the tremolo alone. At 50 % the dips are half as deep, so it is a second way to soften the pulse, handy on an axis that already moves Depth. |
| <Dot>7</Dot>**Level** | The level after the tremolo, to bring back what the dips take away. |

## The bass pulses too

The Tremolo moves the whole sound, bass and kick included. To keep a loop's kick and bass steady while
the pads and the hats pulse, put the Tremolo **after the parts you want to pulse**, not on the full mix:
on the pad's or the synth's own rack, before they meet the drums.

## The screen

<Dot>8</Dot>**Conversation.** Two plants stand at the sides, the left and the right of the sound, and their heads are
level on one line. Between them runs the pulse the two send each other.

- **Each head** glows as loud as its side is now, and the band beside it draws that side's recent
  level: ramps, waves or blocks, following Shape.
- **Spread** is the gap where the two bands would meet: the right head answers later.
- **Depth** is the small number in the bottom-left corner. At 0 % the picture turns grey: **Still · 0 %**.
- **The word** above the picture follows Shape: **Ramp**, **Swell**, **Throb** or **Chop**.

## Try it

- **An amp tremolo on a held sound.** On a pad or a long synth note: Depth **40 %**, the LFO's Rate **5 Hz**, Shape **Sine**. The sound throbs gently and stays whole.
- **A pad chopped into a rhythm.** On the pad's own rack: the LFO's Rate in **Beats**, Rate **1/8**, Shape **Square**, Depth **100 %**. The pad plays on half of every eighth note. Bring **Level** up about 3 dB to make up for the gaps.
- **A shimmer across the sides.** On a wide pad: Depth **30 %**, the LFO's Rate **0.5 Hz**, Spread **90°**. The pulse starts on the left and lands on the right.

## Mapping

Every Tremolo control can be mapped to the Orbiter's axes, and the LFO's on/off to its toggles: see
[Edit](/docs/orbiters/edit).
