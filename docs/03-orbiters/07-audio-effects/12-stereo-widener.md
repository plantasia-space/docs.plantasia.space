---
title: Stereo widener
sidebar_position: 12
sidebar_custom_props:
  icon: UnfoldHorizontal
---

The **Stereo widener** opens or closes the space between the two speakers: a pad or a synth line made
wider, a loop narrowed so a lead has room in the middle, a mono sample turned into stereo. It goes in any
effects rack, most often as an **insert**, and it behaves the same wherever it sits.

**The loudness stays where it was.** A wider sound is not a louder one, so you can compare settings by
ear and trust what you hear. That is the difference from the
[Auto-panner](/docs/orbiters/audio-effects/auto-panner), which moves the sound from side to side, and
from the [Chorus](/docs/orbiters/audio-effects/chorus), which makes it wider by adding wavering copies.
The Stereo widener changes the image the sound already has.

:::tip[Loads doing nothing]

The Stereo widener loads at Width 100 %, Spread 0 % and Bass mono Off: the sound passes exactly as it
came in. Turn Width either way to start.

:::

## Image

| Control | What it does |
|---|---|
| **Width** | How wide the stereo image is. **100 %** as it loads: the sound as it is. Below 100 % the sound gathers to the middle; **0 %** is mono. Above 100 % the sides spread out, up to **200 %**. The knob clicks into place at 100 %. |
| **Spread** | Opens a mono sound into stereo. **0 %** as it loads, up to **100 %**. |
| **Bass mono** | Keeps everything below this frequency in the middle. **Off** as it loads (the knob at the bottom), up to **500 Hz**. |

**Width and the level held.** Making a stereo sound wider makes its sides louder, and how much louder
depends on the sound: nothing for a mono sound, about +2.4 dB for a typical mix at 200 %, up to +4 dB
when the two sides have nothing in common. The Stereo widener measures the sound and evens that out, so
the level stays put at every Width. It follows the music within about a tenth of a second; a knob move
lands at once. A mono sound is never touched: Width has no sides to work on, so at any Width it comes
out exactly as it went in (that is what **Spread** is for).

Two sides that pull against each other (a sound that is partly out of phase) cancel as you narrow
them: at Width 0 % what is left is honestly quieter, and the widener raises it by at most 6 dB rather
than chase it.

**Spread for mono sounds.** Spread makes stereo out of a mono sound: it adds a copy of the sound,
12 ms late, to the left side and takes it from the right. Each side then leans a little differently
at every frequency, and the ear hears width. At 50 % the two sides are still fairly alike; at 100 %
they are as different as two unrelated sounds. **Summed back to mono the copy disappears**, so Spread
never makes a mono speaker sound hollow. It is made for pads, synths and mono samples. On dry
percussion you may hear a slight doubling of each hit (the copy, 12 ms late, fused with the hit):
keep Spread low there, or use Width on a sound that is already stereo.

Width scales what Spread makes too: Width 0 % is mono whatever Spread does, and Width 200 % with
Spread 100 % is about as wide as the module goes.

**Bass mono.** Widening a sound drags its bass away from the middle, which makes a low end sound weak
and unsteady, especially on big speakers. Bass mono takes the sides' lows out below the frequency you
set (steeply: an octave under it the sides' bass is down 24 dB) and leaves them in the middle, where
the bass belongs. Nothing else changes: the bass stays as loud, it just sits in the centre. Around
**100 … 150 Hz** is a good start for a full mix; higher for a pad that should keep only its shimmer
wide.

## Output

| Control | What it does |
|---|---|
| **Dry/wet** | Balance between the sound as it came in and the widened one. **100 %** as it loads: Width 100 % already does nothing. At 50 % the image sits about halfway between the two. |
| **Trim** | The level after the widener. |

## Heard in mono

On a phone speaker or a club's mono sum, the left and right are added together. Without the widener,
that sum is simply the middle of the sound. With it, the middle moves by the same amount the level hold
does: at Width 200 % on a typical mix the mono sum is about **2.4 dB quieter**, and at Width 0 % on a
sound whose sides have nothing in common it is about **3 dB louder**. A mono sound, and Spread's copy,
leave the mono sum alone.

## The screen

**Dandelion.** A seed head on a stem: every seed is one part of the sound, from the lows (the short
seeds near the centre) to the highs (the long ones at the edge). **A seed's angle is where that part
sits**: straight up is the middle, level with the dotted line through the head is a speaker, and a
seed that droops below the line (dashed) is out of phase, its two sides pulling against each other.

- **Width** opens or closes the head: at 0 % every seed stands straight up; wide, the clock opens.
  Width is also the small number in the bottom-left corner.
- **Spread**, on a mono sound, parts the seeds a little left and a little right.
- **Bass mono** is the leaf on the left of the stem: at the ground when Off, sliding up towards the
  head as the cut rises. The low seeds under the cut stand up into the middle.
- **Waves**: while sound plays, a half-circle rises from the head every moment. Its span is how wide
  the sound comes out, Spread tilts it left and right, and with Bass mono it starts a little further
  out. No waves at rest, and none while the widener does nothing.

The picture follows the sound that comes in: a mono input shows every seed straight up and says
**Mono in · try Spread**. The word above the picture says **As is · 100 %** (nothing to do), **Mono**,
**Narrow**, **Wide** or **Phasey** (more out of phase than in). Below it, the Width (and the Spread),
and how alike the two sides come out: **in phase +0.50** for a typical mix, towards **+1.00** for
mono, below zero **out of phase**; with Bass mono on, the cut. It moves only while sound plays; at rest,
and with your system's reduced-motion setting, it is a still picture of the current values.

## Mapping

Every Stereo widener control can be mapped to the Orbiter's axes: see [Edit](/docs/orbiters/edit).
Width rests on 100 % and goes to 40 % one way (narrower) and 180 % the other (wider); Spread rests on
0 % (30 % one way, 70 % the other); Bass mono rests on Off (80 Hz one way, a firm 250 Hz the other).
