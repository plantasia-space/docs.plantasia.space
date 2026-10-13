---
title: Saturator
sidebar_position: 19
sidebar_custom_props:
  icon: Flame
---

Two saturators add warmth, then grit: the **Saturator**, with every control in reach, and the **One
Saturator**, one knob with a warm crunch one way and a tube's sweetness the other. A saturator pushes a
sound into a curve that rounds its peaks off, which adds harmonics: a little thickens a sound, a lot
distorts it. Both go in any effects rack, most often as an **insert** on drums, a bass, a synth or a
voice.

**The level stays where it was.** Turning Drive up makes the sound thicker, not louder, so you can
judge the colour by ear.

:::tip[Loads doing nothing]

The Saturator loads at Drive 0 dB and the One Saturator at Amount 0: the sound passes as it came in.

:::

## Saturator

<TryModule module="saturator" set="drive:18" source="drums">
<ModulePicture
  src="/img/orbiters/audio-effects/saturator.jpg"
  alt="The Saturator at Drive 18 dB, Warm, on drums: the Curve and Harmonics screens, then Shape (Character, Drive, Tone) and Output."
  dots={[[1, 4.5, 56.1], [2, 22.8, 79], [3, 55.4, 79], [4, 85.6, 63.3], [5, 85.6, 86.8], [6, 28, 12.5], [7, 77, 12.5]]}
/>
</TryModule>

### Shape

| Control | What it does |
|---|---|
| <Dot>1</Dot>**Character** | The curve. **Soft** is the gentlest; **Warm** (as it loads) is rounder and thickens as it saturates; **Tube** is lopsided, which adds even harmonics: body and sweetness. It switches while the sound plays, without a click. |
| <Dot>2</Dot>**Drive** | How hard the sound is pushed into the curve, 0 … 40 dB: warmth at first, crunch further up. **0 dB** (as it loads) is off. |
| <Dot>3</Dot>**Tone** | A low-pass on the saturated sound only, 500 Hz … 20 kHz (8 kHz as it loads): lower tames the fizz. The dry sound is never filtered. |

### Output

| Control | What it does |
|---|---|
| <Dot>4</Dot>**Dry/wet** | Balance between the dry and the saturated sound. **100 %** as it loads. |
| <Dot>5</Dot>**Level** | The module's output level, dry included. |

### The screens

<Dot>6</Dot>**Curve.** The white line is what the Saturator does to the wave: the thin diagonal is the
sound untouched, and the more the white line flattens at the top and the bottom, the more the peaks are
rounded off. Above, the Character; below, the Drive.

<Dot>7</Dot>**Harmonics.** One bar for each harmonic the curve adds, the lowest on the left. The word
above says which kind lead (**Odd** with Soft and Warm), and the bars shorten towards the right as Tone
comes down.

## One Saturator

<TryModule module="oneSaturator" set="amount:60" source="drums">
<ModulePicture
  src="/img/orbiters/audio-effects/one-saturator.jpg"
  alt="The One Saturator at Amount +60 %, Crunch, on drums: the Harmonics screen above the Amount knob."
  dots={[[1, 50, 76], [2, 50, 14.2]]}
/>
</TryModule>

One knob, <Dot>1</Dot>**Amount**, with the One badge. It goes both ways from 0, and each way is a
different saturator; at 0 it does nothing, and either way the level is kept.

- **Turn it right: Warm.** Odd harmonics, from warmth to a little crunch, with the top end closing as
  you turn.
- **Turn it left: Tube.** Even harmonics, body and sweetness, with the top end left open.

Map Amount to an <Term id="axis">axis</Term> and one gesture goes from the tube, through the clean sound,
to the crunch.

### The screen

<Dot>2</Dot>**Harmonics.** The harmonics the knob adds, with the drive and the top end it has set
under them.

## Try it

- **A thicker bass.** Character **Tube**, Drive **10 dB**: the bass gains harmonics above its note and is easier to hear on small speakers.
- **Drums with bite.** Character **Warm**, Drive **18 dB**, Tone **6 kHz**, Dry/wet **50 %**: the crunch sits under the clean hits.
- **A soft edge on a pad.** Character **Soft**, Drive **6 dB**: a little density, no audible distortion.
- **Clean to crunch on an axis.** Map **Drive** from 0 to 24 dB. The level holds, so only the colour moves.

## Mapping

Drive, Tone, Dry/wet and Level can be mapped to the Orbiter's axes, and the One Saturator's Amount maps
like any knob: see [Edit](/docs/orbiters/edit).
