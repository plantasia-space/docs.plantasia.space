---
title: Multimode filter
sidebar_position: 16
sidebar_custom_props:
  icon: Blend
---

The **Multimode filter** is a synth's filter for any sound: low-pass, high-pass, band-pass or notch,
clean or with a ladder's growl, and it can move by itself, with an LFO or with the sound's own level.
It goes in any effects rack, most often as an **insert** on a pad, a loop, a bass or a drum bus. For one
knob that sweeps a whole mix, see [Filters](/docs/orbiters/audio-effects/filters).

<TryModule module="multimodeFilter" set="lfoEnabled:on,resonance:45" source="pad">
<ModulePicture
  src="/img/orbiters/audio-effects/multimode-filter.jpg"
  wide
  alt="The Multimode filter as a low-pass at 350 Hz, Resonance 45 %, with the LFO on: the Response and LFO screens, then Filter (Type, Model, Slope, Cutoff, Resonance), the LFO and Envelope tabs, and Output."
  dots={[[1, 14.5, 50.4], [2, 22.5, 50.4], [3, 33.8, 50.4], [4, 10.5, 76.2], [5, 26.1, 76.2], [6, 46.5, 50.4], [7, 67.5, 50.4], [8, 94.8, 63.3], [9, 94.8, 86.8], [10, 32, 12.5], [11, 82, 12.5]]}
/>
</TryModule>

## Filter

| Control | What it does |
|---|---|
| <Dot>1</Dot>**Type** | What the filter lets through: **Low-pass** (as it loads) keeps what is below the cutoff, **High-pass** what is above, **Band-pass** only what is around it, **Notch** everything but that. **Morph** adds a knob that sweeps from one to the next. |
| <Dot>2</Dot>**Model** | **Clean** (as it loads) never rings on its own, however high the resonance. **Ladder** is a transistor ladder: it has a **Drive** knob, and near full resonance it sings a note of its own. The ladder is a low-pass or a high-pass. |
| <Dot>3</Dot>**Slope** | **12 dB/oct** (as it loads) or **24 dB/oct**, the steeper. |
| <Dot>4</Dot>**Cutoff** | The big knob: where the filter works, 20 Hz … 20 kHz (350 Hz as it loads). The LFO and the envelope move it from here. |
| <Dot>5</Dot>**Resonance** | A peak at the cutoff, 0 … 100 % (20 % as it loads). |
| **Morph** | With Type on Morph: sweeps low-pass, band-pass, high-pass, notch and back to low-pass. |
| **Drive** | With the Ladder: gain into the filter, 0 … 24 dB, for its growl. Level, in Output, makes it up. |

## LFO

<Dot>6</Dot>The **LFO** tab moves the cutoff in a steady cycle. The hexagon on the tab switches it on and
off, without a click.

| Control | What it does |
|---|---|
| **Shape** | The wave: **Sine**, **Triangle**, **Saw up**, **Saw down**, **Square**, or **S&H**, a new random value every cycle (**stereo**: one for each side; **mono**: one for both). |
| **Amount** | How far the cutoff sweeps, 0 … 8 octaves, centred on Cutoff (2 octaves as it loads). |
| **Rate** | How fast, 0.01 … 20 Hz (1.2 Hz as it loads). |
| **Phase** | Offsets the right side's sweep from the left's: at 180° they move in opposite directions. |
| **Spin** | Runs the right side's LFO this much faster than the left's, up to 50 %, so the two drift apart and meet again. While it is above 0, Phase rests. |

## Envelope

<Dot>7</Dot>The **Envelope** tab moves the cutoff with the sound's own level: loud moments open the
filter (or close it). Its hexagon switches it on and off.

| Control | What it does |
|---|---|
| **Amount** | How far the level moves the cutoff, −8 … +8 octaves (+3 as it loads): above 0 hits open the filter, below 0 they close it. |
| **Sensitivity** | The level at which the envelope reaches its full Amount, −40 … 0 dB: lower for quiet sounds. |
| **Attack** | How fast the filter follows a rise in level, 1 … 500 ms. |
| **Release** | How fast it falls back, 10 ms … 2 s. |

## Output

<Dot>8</Dot>**Dry/wet** blends the dry sound with the filtered one (100 % as it loads), and
<Dot>9</Dot>**Level** sets the level after it: resonance and drive change how loud the sound is.

## The screens

<Dot>10</Dot>**Response.** The white line is what the filter does to each frequency right now, lows on
the left; the thin line behind it is the filter where the Cutoff knob stands. The upright line and the
dot mark the two, and the shaded band is how far the LFO sweeps. Below, the **Cutoff** you set and where
the filter is **Now**.

<Dot>11</Dot>**LFO.** The wave the LFO draws, with its rate below.

## Try it

- **An auto-wah on a guitar-like line or an electric piano.** Envelope on, Amount **+3 oct**, Cutoff **300 Hz**, Resonance **50 %**: every note opens the filter and it closes behind it.
- **A slow sweep on a pad.** LFO on, **Sine**, Rate **0.1 Hz**, Amount **3 oct**, Phase **90°**: the pad opens and closes, a little apart on each side.
- **An acid bass.** Model **Ladder**, **24 dB/oct**, Cutoff **400 Hz**, Resonance **80 %**, Drive **12 dB**, with Cutoff on an axis.
- **Random steps on a loop.** LFO on, **S&H stereo**, Rate **4 Hz**, Type **Band-pass**.

## Mapping

Every knob can be mapped to the Orbiter's axes, and the LFO and Envelope switches to its toggles: see
[Edit](/docs/orbiters/edit). Cutoff is the first one to map.
