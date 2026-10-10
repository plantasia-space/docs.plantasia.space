---
title: Flanger
sidebar_position: 3
sidebar_custom_props:
  icon: Wind
---

Two flangers make a sound whoosh, as if it flew past or poured through a pipe whose length keeps
changing: the **Flanger**, with every control in reach, and the **One Flanger**, one knob that does
it all. Both go in any effects rack, **an insert first**: a drum bus, a pad, a guitar-like part, a
riser.

A flanger plays the sound together with a copy of itself a few milliseconds late, and keeps sliding
that delay back and forth. Where the two meet, some frequencies add up and others cancel: a comb of
peaks and notches that sweeps up and down the spectrum. That moving comb is the jet sound.

:::tip[Loads doing nothing]

Both load doing nothing (the Flanger at Dry/wet 0 %, the One Flanger at Amount 0 %): turn them up to hear them.

:::

## Flanger

<TryModule module="flanger" set="mix:50" source="pad">
<ModulePicture
  src="/img/orbiters/audio-effects/flanger.jpg"
  wide
  alt="The Flanger as an insert, at Dry/wet 0 %: the Sweep screen, then Motion, Comb and Output."
  dots={[[1, 62.5, 20.7], [2, 43.1, 82.1], [3, 51, 82.1], [4, 58.8, 82.1], [5, 92.2, 20.7], [6, 70.4, 78.8], [7, 80.6, 82.1], [8, 88.5, 82.1], [9, 96.5, 62.2], [10, 96.5, 85.6], [11, 19.2, 14.2]]}
/>
</TryModule>

### Motion

| Control | What it does |
|---|---|
| <Dot>1</Dot>**Sync** | On (as it loads), one sweep takes a length of the Orbiter's tempo, from **8 bars** to **1/16**, and lands on the bar: every player in a room sweeps together. Off, you set the **Rate** in Hz. Switching never makes the sweep jump. |
| <Dot>2</Dot>**Rate** | How long one sweep, down and back, takes. Slow (2 bars, or 0.25 Hz) is a long whoosh; fast (1/16, or a few Hz) turns into a warble. Synced, it reads a note length; free, 0.02 … 10 Hz. A synced sweep faster than 10 Hz (1/16 above 150 BPM) is halved until it fits. |
| <Dot>3</Dot>**Depth** | How far the sweep travels. At 100 % the comb moves two octaves either way; at 0 % it stands still on one colour. |
| <Dot>4</Dot>**Phase** | Offsets the right side's sweep from the left's. At 0° both sides move together; 90° (as it loads) moves the sweep across the stereo image; 180° sweeps them against each other, the widest. In mono it stays a flange, never cancelled. |

While the transport plays, a synced sweep follows it: after you jump to another place, start or
loop, the sweep bends back onto the bar within about a second and a half, a little faster or slower
for a moment, never with a click. While the transport is stopped it keeps sweeping at the tempo's
speed, so live input still flanges.

### Comb

| Control | What it does |
|---|---|
| <Dot>5</Dot>**Mode** | **Classic** (as it loads): the sweep rings above the sound. **Through-zero**: the tape flanger's jet, see below. Mode can be mapped to the Orbiter's toggles; switching crossfades in 30 ms. |
| <Dot>6</Dot>**Feedback** | The big knob. Feeds the sound back through the flanger: more rings with a pitch, like a jet (above about +60 % it really sings). **Below zero it turns hollow and nasal**, its pitch an octave lower. −95 … +95 %, +50 % as it loads. Turning it up doesn't make the sound louder: the level is held. |
| <Dot>7</Dot>**Time** | Where the sweep sits, 0.2 … 5 ms. Shorter is higher and brighter; longer is lower, and towards 5 ms it gets closer to a chorus. |
| <Dot>8</Dot>**Low cut** | Keeps everything below this frequency out of the flanger, so the bass stays solid, centred and unflanged under a flanged drum bus. **Off** at 20 Hz. |

### Output

<Dot>9</Dot>**Dry/wet** blends the dry sound with the swept copy, and <Dot>10</Dot>**Trim** sets the level after it.
**Around 50 % the sweep is clearest:** the dry and the copy at equal level carve the deepest
notches. With more Feedback the peaks ring and the notches get shallower, so the strongest sweep
moves a little above 50 %. At 100 % you hear the swept copy alone: a vibrato-like wobble, no comb.

### Through-zero

Tape flangers ran two machines: the copy didn't only run late, it passed **through** the dry, and
where the two lined up the sound cancelled for a moment and came back: a hollow whoosh at the
crossing. Through-zero does that. To let the copy run early, it delays the whole sound by **5 ms**.

- In series (an insert) 5 ms is not heard.
- **In a parallel stage, the other branches are not delayed**, so the sum combs. On a **<Term id="moon">Moon</Term>** the
  return lands 5 ms after the dry World: a flange of the whole mix, often the point. Classic adds no
  delay.

### On a Moon

Like every effect with a Dry/wet knob, the Flanger starts at **Dry/wet 100 %** on a Moon: the Moon
returns the swept copy, and the comb forms where it meets the dry in the mix. With **Low cut** on, the band under it stays out of the return: the World already carries it.

### The screen

<Dot>11</Dot>A ring station turns in a starry sky: a ring tilted towards you round the Orbiter hex.

- **The big number, bottom left, is Dry/wet** (0 … 100). At 0 % it turns faint and the whole
  picture is muted (**Dry · 0 %**). Beside it, bottom right, a dial shows **Feedback**: left of the
  top is negative, right positive.
- **The spokes are the comb's peaks**, lows at the top, highs down to the bottom, the left half of
  the ring for the left side, the right half for the right. As the delay grows they gather at the
  top; as it shrinks they spread down: that is the sweep. Phase shows as the two halves moving apart.
- **The lights** where the spokes meet the ring glow with Feedback; negative Feedback moves every
  spoke half a step (the comb flips).
- **The dotted arc** outside the ring spans how far the first spoke travels: Time and Depth.
- **Low cut** lays a still cap over the top of the ring: the band it keeps dry. No spokes under it.
- **The hex** turns once per sweep, on the bar when synced.
- **Through-zero** adds a dashed ghost ring, the late dry: the ring swells and shrinks through it,
  and at the crossing the spokes vanish and the ring lights.

The word on the screen is **Swirl**, **Jet** (Feedback +60 % and up), **Hollow** (below 0),
**Through-zero** or **Dry · 0 %**. Below the picture: Dry/wet, then the sweep's range in ms, or
**Dry under** the Low cut when it is on. The picture moves only while sound plays.

## One Flanger

<TryModule module="oneFlanger" set="amount:60" source="pad">
<ModulePicture
  src="/img/orbiters/audio-effects/one-flanger.jpg"
  alt="The One Flanger playing at Amount +60 %, Jet: Feedback +50 % and a 6.3 s sweep on the Sweep screen."
  dots={[[1, 50, 78.8], [2, 50, 14.2]]}
/>
</TryModule>

One knob, <Dot>1</Dot>**Amount**, with the One badge. It goes both ways from 0, and each way is a different
flanger; at 0 it does nothing, and either way the level stays where it was and the bass (under
120 Hz) stays clean, so it is safe on a drum bus or a full mix.

- **Turn it right: the Jet.** A slow whoosh moves through the sound (one sweep in 10 s, down to 5 s
  at the end). A little is a soft, airy **swirl**; all the way it is a deep sweep that rings with a
  pitch, the **jet** passing overhead.
- **Turn it left: the Hollow.** A quicker, shallower sweep (about one a second) with a hollow,
  nasal colour, like talking through a tube. A little is a faint metallic shimmer; all the way, a
  pronounced tube sweep.

Map Amount to an <Term id="axis">axis</Term> and one gesture goes from the tube, through the dry sound, to the jet.

:::note[On a Moon it turns into a send by itself]

It returns only the flange, with no dry, so there is nothing to set. An untouched One Flanger on a Moon (Amount 0) passes the sound through unchanged, so an effect after it on the same Moon still hears it; the dry leaves as you turn Amount up, over its first 5 %.

:::

### The screen

<Dot>2</Dot>A jellyfish drifts over the sound, filling the screen between the number and the ladder: at 0 a
still bell with no tendrils. Turned either way the same bell slowly changes shape and pulses with the
sweep, and its tendrils grow out of the rim: they are the comb, hanging as long as it rings, their tips
lit with how loud the flange is (and the ladder on the right). Turned right (the Jet) the bell widens
and its tendrils grow long; turned left (the Hollow) it grows taller, its tendrils stay shorter and
end in rings. Through 0 one shape turns into the other, with no jump. The big number is Amount itself; below it, the inside
Feedback and how long one sweep takes. On a Moon the sound under the bell is drawn hollow and the
screen reads **Send ·** and the word.

## Mapping

Every Flanger control can be mapped to the Orbiter's axes, and Sync and Mode to its toggles; the One
Flanger's Amount maps like any knob: see [Edit](/docs/orbiters/edit).
