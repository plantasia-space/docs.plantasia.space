---
title: Reverb
sidebar_position: 1
sidebar_custom_props:
  icon: Waves
---

Two reverbs put a sound in a space, from a small room to a long hall: the **Reverb**, with every
control in reach, and the **One Reverb**, one knob that does it all. Both go in any effects rack. The
Reverb's home is a **<Term id="moon">Moon</Term>**; the One Reverb is mostly an insert on a <Term id="world-dimension">World dimension</Term> or the <Term id="star">Star</Term>.

:::tip[How they load]

On a World the Reverb loads at Dry/wet 50 %, so you hear it as soon as you add it; on a Star it loads at 0 %, and on a Moon at 100 %. The One Reverb loads doing nothing (Amount 0 %): turn it up to hear it.

:::

## Reverb

<TryModule module="reverb" set="mix:50" source="piano">
<ModulePicture
  src="/img/orbiters/audio-effects/reverb.jpg"
  wide
  alt="The Reverb playing at Dry/wet 50 %: the Space screen, then Space (Freeze, Decay, Pre-delay, Bass), Tone and Output."
  dots={[[1, 41.3, 61.1], [2, 51, 61.1], [3, 58.5, 61.1], [4, 34.9, 20.4], [5, 67, 57.1], [6, 74.5, 57.1], [7, 82, 57.1], [8, 89.5, 57.1], [9, 96.8, 45.3], [10, 96.8, 68.8], [11, 17.4, 14.2]]}
/>
</TryModule>

### Space

| Control | What it does |
|---|---|
| <Dot>1</Dot>**Decay** | How long the tail rings: about 0.5 s is a small room, 2 to 4 s a hall, 10 s and more a wash. 0.2 … 20 s. |
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

<Dot>9</Dot>**Dry/wet** blends the dry sound with the reverb, and <Dot>10</Dot>**Level** sets the level after it.

On a Moon it starts at Dry/wet 100 % and returns only the effect; the Moon level sets how much you
hear (see [Audio effects](/docs/orbiters/audio-effects)).

### The screen

<Dot>11</Dot>A wireframe cube hangs in a starry sky above the sound, with rings spreading out from it.

- **The big number, top left, is Dry/wet**: how much of the reverb you hear. At 0 % the whole
  picture is muted (**Dry · 0 %**).
- **The cube's size is Decay**, and the rings reach further the longer the tail rings.
- **The word** names the space by its Decay: **Room**, **Hall** or **Wash**.
- **Freeze** stops everything where it is: **Frozen**.

## One Reverb

<TryModule module="oneReverb" set="amount:60" source="piano">
<ModulePicture
  src="/img/orbiters/audio-effects/one-reverb.jpg"
  alt="The One Reverb playing at Amount 60 %, Hall: the Space screen shows Decay 1.7 s and Pre-delay 15 ms."
  dots={[[1, 50, 76], [2, 50, 14.2]]}
/>
</TryModule>

One knob, <Dot>1</Dot>**Amount**, with the One badge. It goes both ways from 0, and each way is a different
reverb; at 0 it does nothing, and either way the level stays about where it was.

- **Turn it right: Room, then Hall.** The sound moves from a dry booth into a close room, then a
  long, darker hall. The first half gives a sound air without sounding "reverbed"; past +50 it opens
  into a hall.
- **Turn it left: Plate, then Bloom.** A bright, airy plate with a thin low end. Further left it
  waits longer before it starts and rings longer, so it blooms after the note.

Everything else is set for you: the decay, how the lows and highs fade, the pre-delay and the cuts.
Map Amount to an <Term id="axis">axis</Term> and one gesture sweeps from the bloom, through dry, to the hall.

### The screen

<Dot>2</Dot>A craft hovers over the sound: hidden at 0, a small dome that widens into a flat saucer as you
turn further either way. Turned right it flies dome up; turned left it flies upside down, shining on
the sound. The big number is the decay in seconds; the word says **Room** or **Hall** turned right,
**Plate** or **Bloom** turned left.

## Try it

- **A room around a dry piano.** As an insert: Decay **0.8 s**, Pre-delay **10 ms**, Dry/wet **20 %**. The piano stays in front and stops sounding boxed in.
- **One hall for the whole World.** A Reverb on Moon I at Decay **3 s**, Low cut **200 Hz**, then turn **Send Moon I** up on each dimension that should be in the hall. The low cut keeps the tail from getting muddy.
- **A frozen chord to play over.** Play a chord, press **Freeze**, and play a melody over the pad it leaves. Map Freeze to a toggle to do it while you move.
- **One gesture.** The One Reverb with Amount on an axis: the bloom one way, dry in the middle, the hall the other.

## In the scene

Both reverbs suggest the [Blur](/docs/orbiters/visual-modules/blur), a visual module: with **Auto visuals**
on, adding one adds a Blur to the same dimension, and the sky around the body blurs with the sound.

## Mapping

Every Reverb control can be mapped to the Orbiter's axes, and Freeze to its toggles; the One
Reverb's Amount maps like any knob: see [Edit](/docs/orbiters/edit).
