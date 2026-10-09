---
title: Utility
sidebar_position: 13
sidebar_custom_props:
  icon: SlidersHorizontal
---

The **Utility** is a stereo channel's housekeeping in one place: flip a channel that came in out of
phase, play one side of a recording in both speakers, narrow or widen the image, keep the bass in the
middle, turn the sound up or down, lean it to one side, silence it, take a DC offset off. It goes in
any effects rack, as an **insert**.

**It colours nothing.** Every control is plain arithmetic on the two channels, so what it does is
exactly what it says: Width 0 % is mono, Gain −6 dB is half the level, Mute is silence. That is the
difference from the [Stereo widener](/docs/orbiters/audio-effects/stereo-widener), whose Width keeps
the loudness steady as it widens: the Utility's Width is the plain law, and a wider sound gets louder.

:::tip[Loads doing nothing]

The Utility loads in Stereo mode with every switch off, Width 100 %, Gain 0 dB and Balance centred:
the sound passes exactly as it came in.

:::

## Two modes

**Mode** picks one world at a time, and the panel shows only what works in it:

- **Stereo** works on the left and right channels: Ø L, Ø R, Channel, Mono, Width and Balance.
- **Mid/Side** works on the middle (what both speakers share) and the sides (what differs between
  them): their levels, and a solo for each.

Bass mono, Gain, Mute and DC work in both. A control that can't do anything in the current setting is
hidden rather than greyed: with Channel on Left, for example, there are no sides to narrow, so Mono,
Width and Bass mono step out of the panel. Their values are kept for when they apply again.

## Utility

| Control | What it does |
|---|---|
| **Mode** | **Stereo** (as it loads) or **Mid/Side**. Switching crossfades, so it never clicks. |
| **Ø L · Ø R** | Flip that channel's polarity. Stereo mode. With only one side flipped, a centred sound vanishes when the two are summed to mono: that is what the switch is for, fixing a recording that came in that way. Both on flips the whole sound. |
| **Channel** | **Stereo** plays both channels as they are; **Left** or **Right** plays that one channel in both speakers; **Swap** exchanges them. Stereo mode. |
| **Mono** | Both speakers play the middle. Stereo mode, with two channels. Width and Bass mono step aside while it is on. |
| **Width** | How wide the image is: **0 %** is mono, **100 %** as it came in, **200 %** twice the sides. The knob clicks into place at 100 %. No level hold: on a typical mix 200 % is about +2.4 dB, and up to +4 dB when the two sides have nothing in common; a mono sound never moves. |
| **Solo M · Solo S** | Listen to only the middle, or only the sides. Mid/Side mode. **Not saved.** |
| **Mid · Side** | The level of the middle (−∞ … +6 dB) and of the sides (−∞ … +12 dB). Mid/Side mode. Side at the bottom leaves the sound mono; Mid at the bottom leaves only what differs between the speakers. |
| **Bass mono** | On: everything below the frequency is kept in the middle, so the low end stays solid and centred. The knob sets the frequency, **50 … 500 Hz**, **120 Hz** as it loads. |
| **Audition** | Bass mono's listen: hear only the lows it keeps in the middle, to set the frequency by ear. Shown while Bass mono is on. **Not saved.** |

**Bass mono** is the same filter as the Stereo widener's: it takes the sides' lows out steeply (an
octave under the frequency they are down 24 dB) and turns the middle and the sides together above it,
so a part panned hard left stays on the left. Around **100 … 150 Hz** is a good start for a full mix.

**Audition, Solo M and Solo S are for listening while you set something.** They are never saved,
never in a preset and never on an axis or a toggle: an Orbiter left with Audition on still plays its
whole sound the next time it loads.

## Output

| Control | What it does |
|---|---|
| **Mute** | Silences the sound, with a short fade either way. |
| **DC** | Removes a constant offset (DC) that pushes the waveform off centre, without touching the bass: a gentle 5 Hz filter, −0.26 dB at 20 Hz. |
| **Gain** | Turns the sound up or down, **−∞ … +24 dB**. At the bottom it is silent. |
| **Balance** | Leans the sound to one side by turning the other side down: **L 50 … C … R 50**. At R 25 the left is 6 dB down, at R 50 silent. Nothing moves across, so a stereo image keeps its shape. Stereo mode. |

The Utility has **no Dry/wet**: half a polarity flip cancels a channel, and half a Mute is only
−6 dB, so a blend would make its controls lie. Gain is its level.

## On a Moon

A Utility on its own on a Moon returns a copy of what the Moon receives: at its defaults the World
is heard twice, about +6 dB on most sounds. That can be the point (a parallel copy made mono, or with
its bass kept in the middle). After a reverb on a Moon, it shapes the return: narrow a tail, keep its
lows in the middle, turn it down.

## The screen

**The signal flow, top to bottom.** The left channel runs down the left lane and the right channel
down the right one, through a box for every control in the order the sound meets them. A row's name
lights up while that control does something, and its value sits at the right.

- **Stereo:** Ø (a box per lane, lit when flipped) → Channel (Left or Right draws that lane into
  both; Swap crosses them) → Width (a bar whose width is the Width; **Mono** with Mono on) →
  Bass mono → Balance (a bar per lane, as wide as that side's level).
- **Mid/Side:** Encode (the lanes become M and S) → Solo → Level dB (a box per lane with its value) →
  Bass mono (HP on the side; with Audition, LP on the middle and the side cut) → Decode (back to L
  and R).
- **Both:** Gain → Mute (both lanes broken open) → DC → **Out**, a bar per lane as tall as that side's
  level while sound plays.

The word above the diagram says what the Utility does now: **As is**, **Muted**, **Mono**, **Wide**,
**Narrow**, **Swapped**, **Left only**, **Mid only**, **Audition** and so on. Below it, the Gain (and
the Balance), and how alike the two sides come out: **in phase +0.50** for a typical mix, towards
**+1.00** for mono, below zero **out of phase**. The diagram keeps every word apart on the smallest
drawer.

## Mapping

Every level and switch can be mapped to the Orbiter's axes and toggles: see
[Edit](/docs/orbiters/edit). Width rests on 100 % (40 % one way, 160 % the other); Mid and Side
on 0 dB (−12 dB one way, +6 dB the other); Bass mono on 120 Hz (60 Hz one way, 250 Hz the other);
Gain on 0 dB (−12 / +6 dB); Balance on centre (L 25 / R 25). Mode and the on/off switches can go on
a toggle; Channel, a menu of four, can't. Audition and the solos are never mapped.
