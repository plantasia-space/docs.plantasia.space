---
title: Bitcrusher
sidebar_position: 20
sidebar_custom_props:
  icon: Binary
---

The **Bitcrusher** makes a sound coarse and digital on purpose: fewer bits, fewer samples, and a hard
ceiling that clips, folds or wraps whatever goes over it. It is the sound of old samplers and game
consoles, from a light grain to broken noise. It goes in any effects rack, most often as an **insert**
on drums, a synth line or a loop.

:::tip[Loads doing nothing]

The Bitcrusher loads at 24 bit, Downsampling 1×, Clip level 0 dB and Drive 0 dB: the sound passes as it
came in.

:::

<TryModule module="bitcrusher" set="resolution:8,downsample:6" source="drums">
<ModulePicture
  src="/img/orbiters/audio-effects/bitcrusher.jpg"
  alt="The Bitcrusher at 8 bit, Downsampling 6×, Clip mode: the Output screen, then Distortion (Mode, Clip level, Drive), Crush (Resolution, Downsampling) and Output."
  dots={[[1, 4.5, 56.1], [2, 14.1, 79], [3, 38.4, 79], [4, 65.9, 68.5], [5, 65.9, 90.2], [6, 89.7, 63.3], [7, 89.7, 86.8], [8, 50, 12.5]]}
/>
</TryModule>

## Distortion

| Control | What it does |
|---|---|
| <Dot>1</Dot>**Mode** | What happens to peaks above the clip level: **Fold** turns them back down, **Clip** (as it loads) cuts them flat, **Wrap** sends them round to the other side, the harshest. |
| <Dot>2</Dot>**Clip level** | The ceiling the mode acts above, −48 … 0 dB. It is also the loudest the output gets, so lowering it makes the sound quieter: bring it back with Level. |
| <Dot>3</Dot>**Drive** | Gain into the ceiling, 0 … 48 dB: more drive, more of the sound goes over it. |

## Crush

| Control | What it does |
|---|---|
| <Dot>4</Dot>**Resolution** | The bit depth, 1 … 24 bit. **24** (as it loads) is off; lower is coarser and noisier. Around 8 bit is an old sampler; under 4 the sound breaks into steps. |
| <Dot>5</Dot>**Downsampling** | Holds each sample for this many, 1× … 100×. **1×** (as it loads) is off; higher is duller and adds a metallic ring. The pitch and the speed never change. |

## Output

| Control | What it does |
|---|---|
| <Dot>6</Dot>**Dry/wet** | Balance between the dry and the crushed sound. **100 %** as it loads. |
| <Dot>7</Dot>**Level** | Makes up the level a low Clip level or Resolution takes away. |

## The screen

<Dot>8</Dot>**Output.** One cycle of a wave as the Bitcrusher would return it: the thin line is the wave
going in, the white one what comes out. The steps up and down are the **Resolution**, the flat stretches
between the points the **Downsampling**, and the two dotted lines the **Clip level**, with a marker at
the left. Below, the clip level, then the bits and the downsampling.

## Try it

- **An old sampler on drums.** Resolution **12 bit**, Downsampling **3×**: a light grain and a darker top.
- **A game console lead.** On a plain synth line: Resolution **6 bit**, Downsampling **8×**.
- **A broken radio.** Mode **Wrap**, Drive **18 dB**, Clip level **−12 dB**, Dry/wet **60 %**, then Level up about 12 dB.
- **Decay on an axis.** Map **Downsampling** from 1× to 30×: the sound falls apart as the Planet moves away and comes back whole at rest.

## Mapping

Every Bitcrusher knob can be mapped to the Orbiter's axes: see [Edit](/docs/orbiters/edit). Mode is a
choice, never on an axis.
