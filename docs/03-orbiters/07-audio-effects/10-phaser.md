---
title: Phaser
sidebar_position: 10
sidebar_custom_props:
  icon: MoonStar
---

Two phasers make a sound turn and swirl, like a voice saying "ooo-aaa" without words: the **Phaser**,
with every control in reach, and the **One Phaser**, one knob that does it all. Both go in any effects
rack, **an insert first**: a pad, an electric piano, a guitar-like line, a drum loop.

A phaser plays the sound together with a copy of itself whose phase has been shifted, a little for the
low frequencies and more for the high ones. Wherever the copy ends up exactly opposite the dry sound,
the two cancel: a **notch**, a narrow dip in the spectrum. A phaser has only a few notches, unevenly
spaced, and it keeps sliding them up and down together. That moving set of dips is the swirl.

A phaser is not a [Flanger](/docs/orbiters/audio-effects/flanger): a flanger delays its copy, which
carves many evenly spaced notches that ring with a pitch (the jet). A phaser's notches are few and
spread out, so it sounds like a moving filter, never a pitch.

:::tip[Loads doing nothing]

Both load doing nothing (the Phaser at Dry/wet 0 %, the One Phaser at Amount 0 %): turn them up to hear them.

:::

## Phaser

### Motion

| Control | What it does |
|---|---|
| **Sync** | On (as it loads), one sweep takes a length of the Orbiter's tempo, from **8 bars** to **1/16**, and lands on the bar: every player in a room sweeps together. Off, you set the **Rate** in Hz. Switching never makes the sweep jump. |
| **Rate** | How long one sweep, up and back, takes. Slow (1 bar, as it loads, or 0.5 Hz) is a long swirl; fast (1/16, or a few Hz) turns into a throb. Synced, it reads a note length; free, 0.02 … 10 Hz. A synced sweep faster than 10 Hz (1/16 above 150 BPM) is halved until it fits. |
| **Depth** | How far the notches travel. At 100 % they move three octaves either way; at 50 % (as it loads) one and a half; at 0 % they stand still on one colour. |
| **Phase** | Offsets the right side's sweep from the left's. At 0° both sides move together; 90° (as it loads) makes the sweep turn across the stereo image; 180° sweeps them against each other, the widest. |

While the transport plays, a synced sweep follows it: after you jump to another place, start or loop,
the sweep catches up with the bar within about a cycle, running a little faster or slower for a moment,
never backwards and never with a jump. While the transport is stopped it keeps sweeping at the tempo's
speed, so live input still phases.

### Notches

| Control | What it does |
|---|---|
| **Feedback** | The big knob. Feeds the phaser into itself. **Positive** sharpens the notches and makes a vowel-like peak ring between them; **negative** turns it hollow and nasal. −95 … +95 %, +40 % as it loads, the classic lightly ringing colour. Turning it up doesn't make the sound louder: the level is held. |
| **Stages** | How many notches: half the stages. **4** is the classic pedal (two notches), **6** as it loads (three), **8**, and **12** is dense and watery (six). You can change it while it plays, and map it: it crossfades. |
| **Centre** | Where the sweep sits, 100 Hz … 4 kHz (700 Hz as it loads). Lower is darker and throatier, higher is airier. |
| **Low cut** | Keeps everything below this frequency out of the phaser, so the bass stays solid and unphased under a phased loop. **Off** at 20 Hz. It splits the sound cleanly: a notch that happens to sit on the cut never turns into a boost. |

### Output

**Dry/wet** blends the dry sound with the phased copy, and **Trim** sets the level after it.

- **50 % is the sweet spot:** the dry and the copy at equal level cancel completely at the notches, so
  the sweep is deepest. Use it as the normal setting.
- **100 % is the vibe setting:** you hear the phased copy alone. On its own a phase shift has no
  notches, so what is left is a soft, wavering vibrato as the phase moves. Folded to mono, though, the
  two sides' copies meet and carve notches of their own.

### On a Moon

Like every effect with a Dry/wet knob, the Phaser starts at **Dry/wet 100 %** on a <Term id="moon">Moon</Term>:
the Moon returns the phased copy, and the notches form where it meets the dry sound in the mix. That is
the phaser a send can make. With **Low cut** on, the band under it stays out of the return: the World
already carries it.

### The screen

A row of moons stands along the spectrum, low frequencies on the left, high on the right, over a
horizon marked 20 Hz … 20 kHz.

- **Each moon shows how the phased copy meets the dry sound at its frequency:** full where they agree,
  dark (new) where they cancel. The dark moons are the notches. The moons stay where they are; their
  phases roll as the sweep moves.
- **A tick on the horizon** marks each real notch, so you can count them (half the Stages). **Halos**
  ring a moon where Feedback makes a peak.
- **The sun** riding the dotted arc is where the sweep is now. The solid stretch of the arc is how far
  it travels (Depth), and the small tick in its middle is Centre.
- **The smaller moons** below are the right side, offset by Phase.
- **Low cut** draws a dashed line up from the horizon at the cut; the moons left of it are small and
  muted: that band passes dry.
- **The big number, bottom left, is Dry/wet** (0 … 100). At 0 % the whole picture is muted
  (**Dry · 0 %**). Bottom right, a dial shows **Feedback**: left of the top is negative, right positive.

The word on the screen is **Swirl**, **Throb** (2 Hz and faster), **Ringing** (Feedback +60 % and up),
**Hollow** (below 0), **Vibe** (Dry/wet 95 % and up) or **Dry · 0 %**. Below the picture: Dry/wet,
then the sweep's range in Hz, or **Dry under** the Low cut when it is on. When the sweep is faster than
the screen can draw smoothly, the picture holds at its fastest, rings mark both ends of the sun's
travel, and the readout names the real rate. The picture moves only while sound plays.

## One Phaser

One knob, **Amount**, with the One badge. It goes both ways from 0, and each way is a different phaser;
at 0 it does nothing, and either way the level stays where it was and the bass (under 120 Hz) stays
clean, so it is safe on a loop or a full mix.

- **Turn it right: the Swirl.** A slow, wide sweep turns through the sound, the two sides a
  quarter-turn apart. A little is a gentle movement in the air; all the way, a deep, lush swirl across
  three octaves, one turn in about five seconds, with a soft ringing peak.
- **Turn it left: the Throb.** A fast pulse of many notches, both sides together, so it throbs rather
  than turns. A little is a quick shimmer at 2–3 Hz; all the way, a 6 Hz throb of four notches, hollow
  and nasal.

Map Amount to an <Term id="axis">axis</Term> and one gesture goes from the throb, through the dry sound, to the swirl.

:::note[On a Moon it turns into a send by itself]

It returns only the phased copy, with no dry, so there is nothing to set. An untouched One Phaser on a Moon (Amount 0) returns silence.

:::

### The screen

A Trip to the Moon, after Méliès' 1902 film: the moon's face between two cloud banks. At 0 it is the
moon before the landing, still and muted. Turned either way, the capsule flies in from the top left
towards its left eye, closer as Amount grows, and **at 30 % it lands** in the eye and stays there.

- **On the Swirl** (right) the light glides slowly across the face with the sweep, the right side's
  shadow faint and a quarter-turn behind; the mouth opens and closes like a vowel, and the clouds billow.
- **On the Throb** (left) the moon winces once the capsule lands: its other eye squeezed shut, a wide
  grimace. The sweep is too fast to draw one by one, so its two ends show faintly.

The big number is Amount itself, and the ladder on the right is how loud the phaser is. Below: the
inside Feedback, then how long one sweep takes (Swirl) or the throb's rate and stages. On a Moon the
screen reads **Send ·** and the word.

## Mapping

Every Phaser control can be mapped to the Orbiter's axes, and Sync to its toggles; the One Phaser's
Amount maps like any knob: see [Edit](/docs/orbiters/edit).
