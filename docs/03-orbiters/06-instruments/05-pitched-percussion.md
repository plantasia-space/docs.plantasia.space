---
title: Pitched percussion
sidebar_position: 5
sidebar_custom_props:
  icon: Bell
---

**Pitched percussion** is a mallet striking a body: marimba and vibes lines, glockenspiel and kalimba
patterns, tubular bells and singing-bowl drones, all played from the keys. It is a notes instrument:
it sits at the head of a <Term id="world-dimension">World dimension</Term>, after any generator and MIDI effects, and the notes you play (the
keys, MIDI, the piano roll, the Arpeggiator) strike it.

Each note is **a mallet striking a body**: the body rings with its own overtones, the way a real bar or
bell does (they are not in tune with each other, which is why a bell sounds like a bell). Beside it, an
**FM pair** can ring the glassy, DX-style bell sound, mixed in with one knob.

<TryModule module="pitchedPercussion" source="piano">
<ModulePicture
  src="/img/orbiters/instruments/pitched-percussion.jpg"
  wide
  alt="Pitched percussion on the Marimba: the Struck screen on the left, then Body, Mallet and FM, with Amp, Matrix and Voice folded."
  dots={[[1, 52.1, 14.7], [2, 33.8, 58.3], [3, 40.3, 58.3], [4, 46.8, 58.3], [5, 53.2, 58.3], [6, 60.5, 57.1], [7, 67.9, 57.1], [8, 74.3, 57.1], [9, 80.8, 57.1], [10, 87.3, 57.1], [11, 92.4, 32], [12, 95.4, 32], [13, 98.4, 32], [14, 15, 54.3]]}
/>
</TryModule>

At its defaults it is the plainest struck sound: a marimba at its natural length, struck in the
middle with a medium mallet, no FM.

## The body

<Dot>1</Dot>The **Body** menu, in the group's title row, picks what the mallet strikes:

| Body | What it is |
|---|---|
| **Marimba** | A tuned wooden bar over its resonator tube: warm, short. |
| **Vibraphone** | A tuned aluminium bar: long and bright. Put a **Tremolo** after it for the vibes' motor. |
| **Glockenspiel** | A small steel bar: high, bell-like, ringing. |
| **Kalimba** | A thumb piano's metal tine, plucked. |
| **Tubular bells** | Orchestral chimes: you hear the *strike tone* on the key, with two low hums under it. |
| **Bowl** | A singing bowl: a very long, slowly shimmering ring. |

A new body takes over **from the next strike**: a note already ringing keeps the body it was struck
on, so changing the body never makes a ringing note jump.

| Control | What it does |
|---|---|
| <Dot>2</Dot>**Ring** | How long the body rings, against its natural length (100 %). Lower is a dead, muted hit; up to 400 % a long tail. |
| <Dot>3</Dot>**Position** | Where the strike lands: 0 % is the centre (mostly the fundamental), 100 % the edge (more overtones, hollower). |
| <Dot>4</Dot>**Stretch** | Moves every overtone toward the key (−, rounder, nearer a plain tone) or away from it (+, more metallic). |
| <Dot>5</Dot>**Damping** | How much faster the overtones die than the fundamental. 50 % is the body as it is; at 100 % only the fundamental rings on, at 0 % every overtone rings as long as it does. |

Ring, Stretch and Damping act on notes already ringing, so they sound good on an <Term id="axis">axis</Term>. Higher notes
ring shorter, as on a real instrument (half the time two octaves up).

## The mallet

| Control | What it does |
|---|---|
| <Dot>6</Dot>**Hardness** | How hard the mallet is: from yarn (soft, round, only the low overtones) to brass (hard, bright, every overtone). The fundamental stays as loud either way. |

A harder hit can also be a brighter one, as on a real bar: that is **Vel → Hardness** in the
[Matrix](#amp-matrix-and-voice). At 0, velocity moves only the level.

## FM

An FM pair beside the body: one sine bending another, the classic way to make a bell. It rings as long
as the body's fundamental, so Ring and Damping act on both together.

| Control | What it does |
|---|---|
| <Dot>7</Dot>**Mix** | Body to FM, keeping the same loudness all the way. At 0 only the body sounds. |
| <Dot>8</Dot>**Ratio** | The modulator against the carrier. Whole numbers sound harmonic; the marks on the rim are the classic bells: **1.40**, **2.00**, **3.50** and **7.11**. |
| <Dot>9</Dot>**Index** | How bright the FM strike is. |
| <Dot>10</Dot>**Sweep** | How fast that brightness falls after the strike: short is a clang that settles into a pure tone, long stays bright. |

## Amp, Matrix and Voice

These three groups start folded; open them from their column.

- <Dot>11</Dot>**Amp**: the envelope every note goes through, drawn above its knobs: **Attack**, **Decay**,
  **Sustain**, **Release**, then **Velocity** (how much a note's velocity moves its level) and **Level**.
  At the defaults the strike is the mallet's own and the envelope adds nothing.
  **Release is what letting a key go does**: the body rings on that long, then is damped. It is 4 s by
  default, so even a short note rings out; turn it down for a damper, like a vibraphone's pedal up.
  Attack, Decay and Release can each be bent with the small hollow handle on their segment, as on every
  envelope.
- <Dot>12</Dot>**Matrix**: the [Matrix](/docs/orbiters/instruments#the-matrix) every notes instrument shares, here with the **MIDI** tab only (there is no LFO
  or free envelope to route). It opens with **Pitch** (with the pitch bend, two semitones),
  **Hardness** and **Vibrato** (the mod wheel's); **Level**, **Index**, **Position**, **Damping** and
  **Mix** come in when you turn their knob. Rand → Position makes every strike land a little
  elsewhere, as a player's does.
- <Dot>13</Dot>**Voice**: **Voices** (how many notes can ring at once, 1 … 16), **Mono** (one note at a time),
  **Legato** (with Mono, a note played over a held one re-tunes the ringing body without a new strike,
  a singing bowl's bend) and **Glide** (how long that slide takes).

## The screen

<Dot>14</Dot>The screen, **Struck**, draws the body itself: a bar on its cords (with its tube under the marimba and
the vibraphone), the kalimba's tines, the tubular bells in two rows like a piano's keys, or the bowl on an
open palm. The controls draw on it:

- **Position** is where the striker lands; **Hardness** the size of the mallet head (big is soft); **Vel → Hardness**
  two dashed rings round the head, its size at the softest and hardest hit.
- **Stretch** is the arch cut under a bar, the tines' taper, the tubes' thickness or the bowl's depth;
  **Damping** the felt: pads on the cords, a strip under the tines, the damper bar, the fingers on the bowl.
- **Mix** draws rings above the body, one for each quarter; **Ratio** sets their spacing, **Index** their weight.

When a note plays, the striker swings (a louder note starts higher), the bar or tine bends in the accent
colour as it rings, a struck tube lights, and the bowl's rim glows with rings spreading behind it. On the
tubular bells and the kalimba, every ringing note lights its own tube or tine, the newest brightest. A
column of dots up the left edge is the voices: one per voice, lit while a note rings on it. The number
bottom left is the body's ring time; the line below it counts the overtones still sounding.

## Try it

- **A marimba line.** The defaults, played from an Arpeggiator: short, warm notes.
- **Vibes.** Body **Vibraphone**, Hardness **35 %**, and a [Tremolo](/docs/orbiters/audio-effects/tremolo) after it at 5 Hz for the motor.
- **A bell with a glassy edge.** Body **Tubular bells**, then FM **Mix** up to **40 %**.
- **Softer the further you move.** Map **Hardness** to an axis: a felt mallet at rest, a hard one as the axis moves away from rest.

## Presets to start from

| Sound | Set |
|---|---|
| **Marimba** | the defaults |
| **Vibes** | Vibraphone, Hardness 35 %, Release 1.50 s, and a **Tremolo** after it |
| **Glock** | Glockenspiel, Hardness 85 % |
| **Kalimba** | Kalimba, Position 30 %, Ring 70 % |
| **Tubular bell** | Tubular bells, Mix 40 %, Ratio 3.50, Index 4.00, Sweep 900 ms |
| **Glass** | Bowl, Stretch +20 %, Mix 30 %, Ratio 7.11 |

## Mapping

In the Studio's **Map** mode, every number control can follow an axis. Some pairings that work well:
**Ring** (and Release) for muted ↔ ringing; **Stretch** with **Damping** going down for wood ↔ metal;
**Hardness** with **Position** for a soft ↔ hard mallet; **Mix** with **Index** for bar ↔ bell; **Sweep**
for a clang that settles; a Matrix cell, such as Vel → Hardness, for how much the touch counts.
Toggles can flip **Mono** and **Legato**. The body itself is never on an axis.

## In a room

Every player in a room hears exactly the same sound for the same notes: the strike has no noise in it
and the FM starts afresh on every strike. (The pitch bend and mod wheel, which add a vibrato here,
stay on the device that plays them.)
