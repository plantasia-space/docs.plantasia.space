---
title: Auto-panner
sidebar_position: 6
sidebar_custom_props:
  icon: MoveHorizontal
---

Two auto-panners move a sound between left and right, on their own: the **Auto-panner**, with every
control in reach, and the **One Auto-panner**, one knob with a hard chop on the beat one way and a
slow drift the other. Both go in any effects rack, most often as an **insert** on a pad, a hi-hat or a
synth line, and they behave the same wherever they sit.

The sound travels across the stereo image and comes back **without getting louder or softer on the
way**: wherever it is, the two speakers together play it at the same level. That is the difference
from a tremolo, where the level itself goes up and down.

:::tip[Loads doing nothing]

Both load doing nothing (Amount 0): turn Amount up to set the sound moving.

:::

## Auto-panner

<TryModule module="autoPanner" set="amount:80" source="drums">
<ModulePicture
  src="/img/orbiters/audio-effects/auto-panner.jpg"
  wide
  alt="The Auto-panner playing at Amount 80 %, Glide: the Position screen draws the sound's path at 1.0 Hz, then Motion, Colour and Output."
/>
</TryModule>

### Motion

| Control | What it does |
|---|---|
| **Sync** | Off (as it loads): Rate is in Hz. On: Rate is a note value or a number of bars of the Orbiter's tempo, and the movement locks to the beat. |
| **Amount** | How far the sound travels: at 100 % it goes all the way left and all the way right, at 50 % halfway out each way. **0 %** as it loads: the sound as it came in. |
| **Rate** | How long one trip from side to side and back takes. Free: 0.05 … 10 Hz, **1.00 Hz** as it loads. Synced: 8 bars down to 1/32, with dotted values and triplets; **1/2** as it loads. |
| **Shape** | How the sound travels: **Triangle** at 0 %, **Sine** at 50 % (as it loads), **Square** at 100 %, and every step between. |

**Shape: three ways to travel.** One knob goes through three shapes, ordered by how long the sound
rests at the sides:

- **Triangle** (0 %): an even sweep at one speed, never resting. It spends about 5 % of the time at
  the sides.
- **Sine** (50 %, a click-stop on the knob): it slows down at each side and speeds through the
  middle, the smooth classic. About 20 % of the time at the sides.
- **Square** (100 %): it jumps from one side to the other and stays there, the chopped pan of a
  hi-hat or a pad. The jump takes 4 ms at every rate, short enough to sound like a cut and long
  enough not to click.

Between Sine and Square the jumps get shorter step by step (at 75 % it rests at the sides about half
the time), so mapping Shape to an <Term id="axis">axis</Term> goes smoothly from gliding to chopping.

**Sync on the beat.** With Sync on, the movement is locked to the Orbiter's beat, not only to its
speed: one trip starts on the beat, heading left. At **1/2** and Shape 100 % the sound is hard left on
beats 1 and 3 and hard right on 2 and 4, each jump finishing just before its beat, so a hit on the
beat lands whole on its side. Every peer in a room pans together.

When you start, stop or move the transport, the movement doesn't jump to the new place: it speeds up
or slows down (never more than half again as fast, never backwards) until it is back on the beat, so
it never clicks. A slow rate takes up to one trip to get there: at 8 bars that is a drift, not a
jump. Stopped, it keeps moving at the tempo's speed.

### Colour

| Control | What it does |
|---|---|
| **Low cut** | Keeps everything below this frequency **in the centre**, so the bass and the kick don't swing from ear to ear. **Off** at 20 Hz (as it loads), up to 1 kHz. |

**The low cut keeps the bass centred, it doesn't remove it.** Below the cut the sound stays where it
was at every Amount; above it, it travels. So an auto-panner on a full loop can move the hats and the
pads while the kick and the bass stay in the middle: set the Low cut around 150–250 Hz.

### Output

**Trim** sets the level after the panner. There is no Dry/wet: blending a panned copy with the
unpanned sound is the same as less Amount, so Amount is the "how much".

### Mono and stereo sounds

- **A mono sound** (most synth voices, a mono track) travels across the image at a steady level.
- **A stereo sound** is panned as a **balance**: each side gets louder and softer in turn, nothing
  crosses from one side to the other. A wide pad or a stereo loop keeps its level. A sound that sits
  on one side of a stereo source (a hi-hat panned hard left in the loop) doesn't travel: it rises and
  falls with its side, like a tremolo. To move a single sound across the image, put the Auto-panner
  where it is still near the centre: on its voice, before a stereo effect.
- **Heard in mono** (a phone speaker, a club's mono sum), the movement disappears and the sound dips
  a little at the sides: about 3 dB at Amount 100 %, under 1 dB at 50 %. That is the price of the
  steady level in stereo, and the same pan law a mixer uses.
- **Headroom:** at a hard side that speaker plays the sound 3 dB louder than in the middle (the other
  one is silent). On a very loud sound, pull **Trim** down a little.

### The screen

**Flight.** A wire runs across the top, and the sound is the dot on it, where it is now. Under the
wire its path scrolls down, like a pen on a moving roll of paper: four seconds of it, so a slow rate
draws a trip or two and a fast one many.

- **Shape** is the path's form: a triangle zigzags evenly, a sine glides, a square is flat runs
  joined by jumps.
- **Amount** is how much of the wire is lit and how wide the path swings, and the small number in the
  bottom-left corner. At 0 % the picture turns grey: **Still · 0 %**.
- **Sync on:** a tick at the path's left edge for every beat, so you can see the jumps land on them.
- **Low cut:** a frequency bar under the path, from 20 Hz to 20 kHz: up to the cut it is solid and
  still (that part stays in the centre), above it it is lit, with arrows (that part moves). A still
  line runs down the middle of the path and a ring sits in the middle of the wire: the bass at home.
- **The bird** on the wire has a life of its own: it rests, turns round, flutters and now and then
  flies somewhere else. It doesn't show anything; it lives there while sound plays.

The word above the picture follows Shape: **Sweep**, **Glide**, **Swing** or **Chop**. Below it, the
rate (with the length of one trip) and how far the sound travels. When you turn Rate, the picture
takes up the new rate once the knob comes to rest. It moves only while sound plays; at rest, and with
your system's reduced-motion setting, it is a still picture of the current values.

## One Auto-panner

<TryModule module="oneAutoPanner" set="amount:60" source="drums">
<ModulePicture
  src="/img/orbiters/audio-effects/one-auto-panner.jpg"
  alt="The One Auto-panner playing at Amount +60 %, Drift: one trip in 6.6 s on the Position screen."
/>
</TryModule>

One knob, **Amount**, with the One badge. It goes both ways from 0, and each way is a different
auto-pan; at 0 it does nothing. Either way the level stays where it was and the bass (below 120 Hz)
stays in the centre, so it is safe on a loop or a full mix.

- **Turn it up** (+), **Drift**: the sound floats slowly across the stereo field and back. A little,
  it breathes slightly off centre; all the way, it wanders from one side to the other, one trip in
  about 5 seconds (12 seconds at the slow end). The Drift doesn't follow the beat.
- **Turn it down** (−), **Chop**: the sound jumps from side to side on the beat, left on one beat,
  right on the next, locked to the Orbiter's tempo. A little is a soft lean that ticks with the beat;
  all the way, hard left and hard right with sharp edges.

Map Amount to an <Term id="axis">axis</Term> and one gesture goes from the chop, through the still
sound, into the drift. A jump from one side to the other (a preset, an axis snap) glides through the
centre instead of stepping.

### The screen

**A metronome.** An arm stands on a small base over the sound, and its angle is where the sound is:
the Chop ticks it from side to side on the beat and rests it there, the Drift sways it slowly. The
dotted arc is how far it may swing; on the Chop's side a tick at each end marks where it rests. A
bird sits on the tip with a life of its own, and now and then flies up out of the picture and comes
back. The big number is Amount, signed; the word says **Chop**, **Off** or **Drift**; below it, **One
side per beat** with the length of its edges, or how long one trip takes. At 0 the arm stands upright
and still: **Centred**. In the smallest drawer the screen hides and the knob stays.

## Mapping

Every Auto-panner control can be mapped to the Orbiter's axes, and Sync to its toggles; the One
Auto-panner's Amount maps like any knob, resting on 0: see [Edit](/docs/orbiters/edit).
