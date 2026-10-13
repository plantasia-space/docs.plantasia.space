---
title: Compressor
sidebar_position: 18
sidebar_custom_props:
  icon: Gauge
---

Two compressors even out a sound's level: the **Compressor**, with every control in reach, and the
**One Compressor**, one knob that glues a mix one way and lifts its quiet detail the other. A
compressor turns a sound down when it gets loud, so the quiet parts and the loud parts end up closer
together. Both go in any effects rack, as an **insert**: on drums, a bass, a voice, or the
<Term id="star">Star</Term>.

:::tip[Loads doing nothing]

The Compressor loads at Ratio 1:1 and the One Compressor at Amount 0: the sound passes exactly as it
came in.

:::

## Compressor

<TryModule module="compressor" set="ratio:4,threshold:-24" source="drums">
<ModulePicture
  src="/img/orbiters/audio-effects/compressor.jpg"
  wide
  alt="The Compressor at Threshold −24 dB, Ratio 4:1, on drums: the Transfer and Reduction screens, then Detector (Threshold, Ratio, Knee), Envelope (Attack, Release, SC high-pass) and Output (Makeup, Dry/wet, Level)."
  dots={[[1, 9.7, 78.8], [2, 24.1, 78.8], [3, 35.3, 78.8], [4, 48, 78.8], [5, 59.2, 78.8], [6, 70.5, 78.8], [7, 81.4, 78.8], [8, 88.3, 78.8], [9, 95.2, 78.8], [10, 40, 12.5], [11, 89.5, 12.5]]}
/>
</TryModule>

### Detector

| Control | What it does |
|---|---|
| <Dot>1</Dot>**Threshold** | The level above which the compressor turns the sound down, −60 … 0 dB (−18 dB as it loads). Lower catches more of the sound. |
| <Dot>2</Dot>**Ratio** | How hard it turns down what goes over the threshold, 1:1 … 20:1. At **1:1** (as it loads) it is off; 2:1 to 4:1 is gentle; 10:1 and up holds the level almost flat. |
| <Dot>3</Dot>**Knee** | How wide the soft region around the threshold is, 0 … 24 dB (6 dB as it loads). At 0 the compressor starts at a hard corner; wider, it eases in. |

### Envelope

| Control | What it does |
|---|---|
| <Dot>4</Dot>**Attack** | How fast it clamps down once the sound goes over, 0.1 … 200 ms (12 ms as it loads). Slower lets the start of each hit through, so drums keep their punch. |
| <Dot>5</Dot>**Release** | How fast it lets go once the sound falls back, 5 ms … 2 s (180 ms as it loads). Fast pumps with the beat; slow recovers smoothly. |
| <Dot>6</Dot>**SC high-pass** | Below this frequency the compressor doesn't listen, so a kick doesn't duck the whole mix. It never filters the sound itself. **Off** at 20 Hz, up to 500 Hz. |

### Output

| Control | What it does |
|---|---|
| <Dot>7</Dot>**Makeup** | Gain on the compressed sound, 0 … 24 dB, to bring back the level the compressor took. It is manual: it never follows the reduction. |
| <Dot>8</Dot>**Dry/wet** | Balance between the dry and the compressed sound. **100 %** as it loads; below it is parallel compression: the squashed sound under the untouched one. |
| <Dot>9</Dot>**Level** | The module's output level, dry included. |

### The screens

<Dot>10</Dot>**Transfer.** The white line is the level out against the level in: it follows the thin
diagonal up to the threshold, then bends flatter, as flat as the Ratio says. The upright line is the
**Threshold** and the band around it the **Knee**. While sound plays, the dot on the line is the level
the compressor hears (after SC high-pass). Above, the ratio and the knee; below, the threshold and the
knee's width, or, with SC high-pass on, the frequency the detector listens above.

<Dot>11</Dot>**Reduction.** How much the compressor is turning the sound down at this moment: the bar
drops from the top as it works, up to 40 dB, and the number below is the reduction in dB.

## One Compressor

<TryModule module="oneCompressor" set="amount:60" source="drums">
<ModulePicture
  src="/img/orbiters/audio-effects/one-compressor.jpg"
  alt="The One Compressor at Amount +60 %, on drums: the Reduction screen above the Amount knob."
  dots={[[1, 50, 76], [2, 50, 14.2]]}
/>
</TryModule>

One knob, <Dot>1</Dot>**Amount**, with the One badge. It goes both ways from 0, and each way is a
different compressor; at 0 it does nothing, and either way the level stays where it was.

- **Turn it right: Glue.** The mix sits tighter. The threshold, the ratio and the attack move together
  as you turn.
- **Turn it left: Lift.** A hard compressor blended under the dry sound, so quiet detail comes up and the
  hits stay whole.

Map Amount to an <Term id="axis">axis</Term> and one gesture goes from the lift, through the dry sound,
to the glue.

### The screen

<Dot>2</Dot>**The Press.** The mix is a block on a plate, and a press comes down on it by as much as
the sound is being turned down: clear of the block at 0 dB, touching it as the glue starts, flattening it
and squeezing drops out past 6 dB. The block breathes with the sound's level while it plays. The big
number is the reduction in dB, the ladder beside it lights from 0.3 to 24 dB, and a small dial shows
which way Amount is turned. The word above says **Lift**, **Glue** or **Dense** (**None** while nothing
is turned down); below, the reduction, then the ratio and the threshold the knob has set.

## Try it

- **Drums with punch.** Threshold **−20 dB**, Ratio **4:1**, Attack **30 ms**, Release **120 ms**: the start of each hit passes and the tail is held down. Bring the level back with **Makeup**.
- **A steadier bass.** Ratio **6:1**, Attack **5 ms**, Release **200 ms**, and lower the Threshold until Reduction reads 4 to 6 dB on the loud notes.
- **Glue on the whole Orbiter.** On the Star: Ratio **2:1**, Threshold where Reduction just moves (1 to 2 dB), SC high-pass **120 Hz** so the kick doesn't pump the mix.
- **Parallel drums.** Ratio **10:1**, Threshold **−30 dB**, Dry/wet **40 %**: a crushed copy under the untouched drums.

## Mapping

Every Compressor control can be mapped to the Orbiter's axes, and the One Compressor's Amount maps like
any knob: see [Edit](/docs/orbiters/edit).
