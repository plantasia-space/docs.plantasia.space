---
title: Chorus
sidebar_position: 4
sidebar_custom_props:
  icon: AudioLines
---

Two choruses make a sound wider and thicker without making it louder, darker or out of tune: the
**Chorus**, with every control in reach, and the **One Chorus**, one knob with a slow sway one way and
a fast shimmer the other. Both go in any effects rack, most often as an **insert** on a pad, a synth
voice or a guitar-like track. The Chorus works on a **Moon** too.

A chorus plays a few copies of the sound, each one a few milliseconds late, and keeps moving how late
they are. The moving copies drift a little out of tune against the original, and that drift is what
you hear as width and movement.

## On a Moon, or as an insert

As an **insert**, a chorus blends with the sound it is on. Both load doing nothing (the Chorus at
Dry/wet 0 %, the One Chorus at Amount 0): turn them up to hear them.

A **Moon** is a send and return: what it returns is added to the dry World through the Star's mixer.

- **An effect added to a Moon starts at Dry/wet 100 %**, the Chorus included, so the Moon returns
  only the copies. How loud they are is the mixer's: the Moon level and the crossfade on the Star.
- **The One Chorus turns into a send by itself on a Moon:** it returns only its copies, with no dry,
  and there is nothing to set. An untouched One Chorus on a Moon (Amount 0) returns silence.

## Chorus

### Motion

| Control | What it does |
|---|---|
| **Mode** | **Classic** (as it loads): two copies, one per side, drifting against each other, the synth chorus. **Ensemble**: three copies and a quick shimmer on top, lusher and more liquid, like a string machine. |
| **Sync** | Off (as it loads): Rate is in Hz. On: Rate is a note value or a number of bars of the Orbiter's tempo. |
| **Rate** | How fast the copies sway. Free: 0.05 … 8 Hz, **0.80 Hz** as it loads. Synced: 8 bars down to 1/32, with dotted values and triplets; **1/2** as it loads. Slow sways drift; fast ones shimmer. |
| **Depth** | How far the copies drift from the sound: more depth, more movement and more detune. At 0 % the copies don't move at all (a still doubling). |

**Classic and Ensemble.** Classic is the chorus of the classic synths: two copies, one in each
speaker, swaying in opposite directions, so a mono voice opens up into stereo. Ensemble adds a third
copy in the middle and a fast, shallow shimmer, for pads and strings. Switching between them while
sound plays is smooth: the two modes cross-fade, nothing bends.

**Rate and Depth together set how out of tune it gets.** At the defaults (0.80 Hz, 50 %) Classic
detunes by about ±13 cents, a gentle thickening. A fast rate with full depth (3 Hz, 100 %) reaches
about a semitone: a wobble more than a chorus. The screen shows the detune in cents as you turn.

**Synced.** A synced chorus sways once per note value or per so many bars, so a 1-bar or 2-bar sway
breathes with the music. It follows the speed of the tempo, not the beat itself: the sway's peaks
don't jump to the downbeat when you start, stop or move the transport, so it never clicks. Changing
the tempo, the rate or Sync only changes the speed of the sway.

### Colour

| Control | What it does |
|---|---|
| **Feedback** | Sends the copies back through the chorus: sharper and a little metallic. Up to 50 %; beyond that is a flanger's sound. |
| **Width** | How wide the copies spread: at 100 % (as it loads) they are as wide as the mode makes them, at 0 % the chorus sits in the centre. The dry sound is never touched. |
| **Low cut** | Keeps everything below this frequency **out of the chorus**, so the bass stays clean, centred and in tune. **Off** at 20 Hz (as it loads). |

**The low cut keeps the bass dry, it doesn't remove it.** Below the cut the sound passes as it came
in, at any Dry/wet: two octaves under the cut it is within 0.1 dB of the dry sound. Above it, the
sound is chorused. So a chorus on a bass line, or on a whole mix, can thicken the top while the low
end stays solid: set the Low cut around 150–250 Hz.

### Output

**Dry/wet** blends the dry sound with the copies (0 % as it loads, 100 % on a Moon); 50 % is the
classic chorus blend. **Trim** sets the level after it.

### Mono and stereo sounds

- **A mono sound** (most synth voices, a mono track) opens into stereo: the two sides drift in
  opposite directions. Ensemble adds a third copy in the centre.
- **A stereo sound** keeps its image: each side is chorused on its own side.
- **Heard in mono** (a phone speaker, a club's mono sum), the chorus stays a chorus: thinner, but
  nothing cancels, and the dry sound is untouched.

### The screen

**Voices.** The sound comes in on the left as one line and splits into the voices: two in Classic,
three in Ensemble (the middle one in the accent colour). After the split they drift apart, a braid:
that drift is the detune.

- **The big number, top left, is Dry/wet** (0 … 100), with a dial under it from dry to wet. At 0 %
  the picture turns grey: **Dry · 0 %**.
- **Depth** is how far the voices drift apart; at 0 % they stay one line. **Width** is how far apart
  they stand; at 0 % one line.
- **Low cut** is a short bar on the line: the sound stays a single line up to the bar (the bass
  stays dry) and splits after it. The bar moves right as the cut rises.
- **Feedback** is a faint dotted copy of the wave above the braid, stronger with more Feedback.
- **Rate** is how fast the wave flows along the braid, while sound plays.

Below the picture: the rate (with its speed in Hz when synced), then the number of voices, the
detune in cents, Feedback and the Low cut. The picture moves only while sound plays; at rest, and
with your system's reduced-motion setting, it is a still picture of the current values.

## One Chorus

One knob, **Amount**, with the One badge. It goes both ways from 0, and each way is a different
chorus; at 0 it does nothing, and either way the level stays where it was and the bass (below
120 Hz) is never chorused, so it is safe on anything, a bass line included.

- **Turn it up** (+), **Sway**: the sound gets wider and softly moving. A little gives a slight
  stereo doubling you notice more when it's gone; all the way, a clear, slow, wide sway (0.4 up to
  1.1 Hz), a strong Juno-style wobble at the very end.
- **Turn it down** (−), **Shimmer**: the sound quivers, fast and shallow (2.5 up to 6 Hz), a glassy
  shimmer on the top, like a string ensemble or a rotary speaker's horn.

Both ends detune by about the same amount (about ±50 cents, a clearly audible effect): the two sides differ in speed and size, not in
how far out of tune they get. Map Amount to an axis and one gesture goes from a shimmer, through the
dry sound, into a sway.

### The screen

**A mobile.** The sound feeds up to a hub with the fixed low cut on it; two threads hold the copies
out, an icosahedron and a dodecahedron. They turn in place, one each way: slowly for Sway, fast for
Shimmer. How far apart they hang is how far the copies swing. The big number is the detune in cents,
the ladder on the right follows how loud the copies are, and the word says **Sway**, **Off** or
**Shimmer**. On a Moon the sound is drawn hollow and the screen reads **Send ·** and the word. In the
smallest drawer the screen hides and the knob stays.

## Mapping

Every Chorus control can be mapped to the Orbiter's axes, and Mode and Sync to its toggles; the One
Chorus's Amount maps like any knob, resting on 0: see [Edit](/docs/orbiters/edit).
