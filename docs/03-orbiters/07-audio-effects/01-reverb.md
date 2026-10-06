---
title: Reverb
sidebar_position: 1
sidebar_custom_props:
  icon: Waves
---

Two reverbs put a sound in a space, from a small room to a long hall: the **Reverb**, with every
control in reach, and the **One Reverb**, one knob that does it all. Both go in any effects rack. The
Reverb's home is a **<Term id="moon">Moon</Term>**; the One Reverb is mostly an insert on a <Term id="world-dimension">World dimension</Term> or the <Term id="star">Star</Term>.

## On a Moon, or as an insert

A **Moon** is a send and return: the World is sent to it, and what it returns is added to the dry
World through the Star's mixer. So a reverb on a Moon should return only the reverb, never the dry
sound again, or the dry is heard twice.

- **An effect added to a Moon starts at Dry/wet 100 %.** This goes for every effect with a Dry/wet
  knob, the Reverb included. You can still turn it down for a deliberate dry leak.
- **How much reverb you hear** is the mixer's: the Moon level and the crossfade on the Star.
- **The tail outlives the sound.** The Moon runs after the World, so a World dimension going quiet
  doesn't stop the tail. When the send is closed, nothing more goes in and what is ringing rings out.

As an **insert** on a World dimension or the Star, a reverb blends with the sound it is on.

:::tip[Loads doing nothing]

Both load doing nothing (the Reverb at Dry/wet 0 %, the One Reverb at Amount 0 %): turn them up to hear them.

:::

## Reverb

<ModulePicture
  src="/img/orbiters/audio-effects/reverb.jpg"
  wide
  alt="The Reverb as an insert, at Dry/wet 0 %: the Space screen, then Space (Freeze, Decay, Pre-delay, Bass), Tone and Output."
  dots={[[1, 42.1, 78.8], [2, 51.6, 82.1], [3, 58.8, 82.1], [4, 43.9, 26.4], [5, 67.5, 82.1], [6, 74.8, 82.1], [7, 82, 82.1], [8, 89.3, 82.1], [9, 96.8, 62.2], [10, 96.8, 85.6], [11, 17.8, 14.2]]}
/>

### Space

| Control | What it does |
|---|---|
| <Dot>1</Dot>**Decay** | How long the tail rings, in seconds, before it fades by 60 dB: about 0.5 s is a small room, 2–4 s a hall, 10 s and more an ambient wash. 0.2 … 20 s. |
| <Dot>2</Dot>**Pre-delay** | A gap before the reverb starts, 0 … 200 ms: keeps the sound in front of its room. |
| <Dot>3</Dot>**Bass** | How long the low end rings, compared to Decay (×0.5 … ×2). Below ×1 keeps long tails clean. |
| <Dot>4</Dot>**Freeze** | Holds the tail forever and stops new sound from getting in: play a chord, freeze it, and play over the pad it leaves. Turn it off and the tail fades at Decay again. Freeze can be mapped to the Orbiter's toggles. |

### Tone

These shape the reverb only; the dry sound is never filtered.

| Control | What it does |
|---|---|
| <Dot>5</Dot>**Damping** | Above this frequency the tail fades faster: lower sounds darker and further away. 1 … 20 kHz. |
| <Dot>6</Dot>**Low cut** | Removes lows before the reverb, so the tail doesn't get muddy. **Off** at 20 Hz. |
| <Dot>7</Dot>**High cut** | Removes highs before the reverb, for a softer, darker tail. **Off** at 20 kHz. |
| <Dot>8</Dot>**Width** | How wide the tail spreads: 0 % is a mono tail. |

### Output

<Dot>9</Dot>**Dry/wet** blends the dry sound with the reverb (0 % as it loads, 100 % on a Moon), and <Dot>10</Dot>**Trim**
sets the level after it.

### The screen

<Dot>11</Dot>A wireframe cube hangs in a starry sky above the sound, with rings spreading out from it.

- **The big number, top left, is Dry/wet** (0 … 100): how much of the reverb you hear. At 0 % it
  turns grey and the whole picture is muted (**Dry · 0 %**).
- **The cube's size is Decay.** It turns slowly while sound plays.
- **Rings** leave the sound at one fixed speed; each ring's brightness is how loud the tail still is
  at that age, so a short decay fades near the centre and a long one reaches the edge. The empty
  dotted disc in the middle is the **pre-delay**.
- **Damping** is the sparks rising up the beam, up to a dotted line: lower damping, lower line.
- **Low and High cut** are bars closing the beam from its edges, low down and high up.
- **Width** is how wide the beam and the rings spread.
- **Freeze** stops everything where it is and turns the beam solid: **Frozen**.

The word on the screen names the space by its Decay: **Room**, **Hall** or **Wash**. Below the
picture, Dry/wet, then Decay, the pre-delay and how long the lows and the highs ring. The picture
moves only while sound plays; at rest, and with your system's reduced-motion setting, it is a still
picture of the current values.

## One Reverb

<ModulePicture
  src="/img/orbiters/audio-effects/one-reverb.jpg"
  alt="The One Reverb playing at Amount 60 %, Hall: the Space screen shows Decay 1.7 s and Pre-delay 15 ms."
  dots={[[1, 50, 78.8], [2, 50, 14.2]]}
/>

<HearIt
  dry="/audio/orbiters/audio-effects/one-reverb-dry.m4a"
  wet="/audio/orbiters/audio-effects/one-reverb-wet.m4a"
  caption="One Reverb, Amount 60 %, Hall"
/>

One knob, <Dot>1</Dot>**Amount**, with the One badge. It goes both ways from 0, and each way is a different
reverb; at 0 it does nothing, and either way the level stays about where it was.

- **Turn it up** (+): the sound moves from a dry booth into a close room, then a long, darker hall.
  The first half gives a sound air without sounding "reverbed"; past +50 it opens into a hall.
- **Turn it down** (−): a bright, airy plate with a thin low end. Further down it waits longer
  before it starts (up to 100 ms) and rings longer, so it **blooms** after the note.

Everything else is set for you: the decay, how the lows and highs fade, the pre-delay and the cuts.
Map Amount to an <Term id="axis">axis</Term> and one gesture sweeps from the bloom, through dry, to the hall.

:::note[On a Moon it turns into a send by itself]

It returns only the reverb, with no dry, so there is nothing to set. An untouched One Reverb on a Moon (Amount 0) returns silence.

:::

### The screen

<Dot>2</Dot>A craft hovers over the sound: hidden at 0, a small, tall dome that widens into a flat saucer as
you turn further either way. Turned up it flies dome up (a room, a hall); turned down it flies upside
down, shining on the sound (a plate), and its echoes start past a dotted ring: the gap before the
bloom. Its echoes ring out on the ground beneath it, more of them as the space grows, and the lights
on its rim and the ladder on the right follow how loud the reverb is. The big number is the decay in
seconds; the word says **Room** or **Hall** turned up, **Plate** or **Bloom** turned down. On a Moon
the sound under the craft is drawn hollow (the dry stays on the World side) and the screen reads
**Send ·** and the word.

## Mapping

Every Reverb control can be mapped to the Orbiter's axes, and Freeze to its toggles; the One
Reverb's Amount maps like any knob: see [Edit](/docs/orbiters/edit).
