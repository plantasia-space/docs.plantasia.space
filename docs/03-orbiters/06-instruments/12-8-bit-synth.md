---
title: 8-bit synth
slug: 8-bit-synth
sidebar_position: 12
sidebar_custom_props:
  icon: Gamepad2
---

The **8-bit synth** is the sound of the Commodore 64's sound chip, the SID: buzzy pulse leads with a
moving width, fat filtered basses, ringing metal, screaming sync leads, chords played as a fast
arpeggio, and the noise drums of the old games. After the chip, an **analog boost** warms it the way a
hot amp would. It is a notes instrument: it plays whatever notes reach it, from the keys, MIDI, the
piano roll or a sequencer.

<TryModule module="sid" set="pulseWidth:12,m_lfo_width:30,m_lfo_pitch:3,lfoDelay:300,release:300">
<ModulePicture
  src="/img/orbiters/instruments/8-bit-synth.jpg"
  wide
  alt="The 8-bit synth set as a pulse lead: the home computer screen, then Oscillator (Wave, Width, Octave), Filter (Mode, Chip and its knobs), Amp with its envelope, and Ring & sync, Chip arpeggio, Attack, LFO, Matrix and Voice folded."
  dots={[[1, 29.9, 20.2], [2, 31.3, 61.1], [3, 35.7, 61.1], [4, 39.2, 20.4], [5, 50.3, 20.4], [6, 40.7, 61.1], [7, 45.2, 61.1], [8, 49.6, 61.1], [9, 54.1, 61.1], [10, 58.5, 61.1], [11, 74, 28], [12, 73.4, 74.5], [13, 78.8, 74.5], [14, 84.2, 74.5], [15, 88.6, 40], [16, 90.7, 40], [17, 92.8, 40], [18, 94.8, 40], [19, 96.9, 40], [20, 98.9, 40], [21, 14, 50]]}
/>
</TryModule>

## How it makes a sound

Each note has one oscillator with the chip's waves. All the notes then go through **one filter**, as
on the chip: a chord shares one sweep, and every new note restarts the filter's envelope. After the
filter, the boost. As it loads it is a plain square, the filter off and the boost off, three voices at
once (the chip had three).

## Oscillator

| Control | What it does |
|---|---|
| <Dot>1</Dot>**Wave** | The chip's waves: **Triangle** (soft, flute-like), **Saw** (bright), **Pulse** (the C64 lead) and **Noise** (higher with the key: drums, wind), or two or three of them combined (**Saw + Tri**, **Pulse + Tri**, **Pulse + Saw**, **All three**): the chip's buzzy, quieter mixes. |
| <Dot>2</Dot>**Width** | The pulse's width, in every wave with a Pulse: a square at 50 %, thinner and more nasal towards the edges (30 sounds as 70). |
| <Dot>3</Dot>**Octave** | The whole instrument up or down by octaves. |

## Filter

One filter for every note, over the chip's range (30 Hz … 12 kHz).

| Control | What it does |
|---|---|
| <Dot>4</Dot>**Mode** | **Off** (no filter), **LP** (low-pass, darker as the cutoff falls), **BP** (band-pass, narrow and nasal), **HP** (high-pass, thinner) or **Notch**. |
| <Dot>5</Dot>**Chip** | Which SID the filter sounds like: the **6581**, the first one, dirty and dark, distorting with resonance, never closing all the way; or the **8580**, clean. |
| <Dot>6</Dot>**Cutoff** | Where the filter works. |
| <Dot>7</Dot>**Resonance** | A peak at the cutoff, up to a whistle. The 6581's is weaker and rougher. |
| <Dot>8</Dot>**Envelope** | How far the filter envelope moves the cutoff, up or down, in octaves. |

**The filter envelope** is <Dot>9</Dot>**Attack** and <Dot>10</Dot>**Decay** back to the cutoff, each with a
curve beside it. It has no sustain: it rises and falls whether the key is held or not, and every note
restarts it, for the whole instrument, rising from wherever it is.

## Amp

<Dot>11</Dot>The envelope of each note's level, drawn above the knobs: **Attack**, **Decay**, **Sustain** and
**Release**. Then <Dot>12</Dot>**Velocity** (how much a note's velocity moves its level; the chip had none: at 0 every
note is full), <Dot>13</Dot>**Boost** and <Dot>14</Dot>**Level**.

**Boost** is the analog boost: warmth at a few decibels, a driven amp near the top. At 0 it is off, and
the level stays about the same as it rises. For more drive, tone or a Dry/wet, put a Saturator after it.

Attack, Decay and Release can be bent: see [Envelopes](/docs/orbiters/instruments#envelopes). The chip's
own shape is a fall fast at the start with a long tail: Decay and Release curves at about 60 %.

## Ring and sync, the chip arpeggio, Attack

These groups start folded; open one from its column.

- <Dot>15</Dot>**Ring & sync**: each note has a **partner** at the **Interval** above it (and **Fine**, a few cents
  off it for a slow beating). **Ring** flips the triangle with the partner: bells and metal (only
  Triangle and Pulse + Tri ring, as on the chip). **Sync** restarts the wave at the key's rate while it
  runs at the partner's: sweep the Interval for the sync scream. The note keeps the key's pitch either
  way.
- <Dot>16</Dot>**Chip arpeggio**: **2nd**, **3rd** and **4th**, each a number of semitones above the key, and
  **Speed**, steps a second. One key then plays a chord the way C64 tunes did, as a fast arpeggio on one
  voice: 50 steps a second is the chip's frame rate. All three at 0: no arpeggio. Major: 4, 7, 12;
  minor: 3, 7, 12. For arpeggios in time with the music, use the Arpeggiator before it instead.
- <Dot>17</Dot>**Attack**: the chip's drum tricks. **Noise** plays noise instead of the wave for this many
  milliseconds at each strike; **Drop** starts the note this many semitones above the key and falls to
  it in **Time**.

## LFO, Matrix, Voice

- <Dot>18</Dot>**LFO**: one of [the Orbiter's LFOs](/docs/orbiters/interact#an-lfo-in-a-module), its **Amount**,
  and a **Delay**: each note brings the LFO in over this time, the delayed vibrato of the C64 leads.
  Its share on the filter and the boost comes in at once.
- <Dot>19</Dot>**Matrix**: the [Matrix](/docs/orbiters/instruments#the-matrix) every notes instrument shares. The LFO
  can move **Pitch**, **Width**, **Cutoff**, **Interval** and **Boost**; velocity, the key, pitch bend,
  pressure, the mod wheel and a random value per note move **Pitch**, **Width**, **Interval**, **Level**
  and **Vibrato**; bend, pressure and the wheel move **Cutoff** and **Boost** too (one filter and one
  boost for every note), and can bring the **LFO** in. LFO › Width is the classic moving pulse.
- <Dot>20</Dot>**Voice**: **Mono**, **Legato**, **Glide** and **Voices** (3 as it loads, up to 16).

## The screen

<Dot>21</Dot>**The home computer.** A monitor, the keyboard under it and a joystick. The wave plays on the
monitor's glass in 8-bit steps, through the filter and the boost, and lights while a note sounds; the
pulse's width is the accent under it. The playing note lights its key, the fire button lights at each
strike, and the stick leans with the mod wheel.

The corners: **Width** as a number, **Boost** as a meter, **Cutoff** and **Resonance** as ladders.

## Starting points

| Sound | Set |
|---|---|
| **Pulse lead** | Width 12 %, Matrix: LFO › Width 30 %, LFO › Pitch 3 %, LFO Delay 300 ms, Release 300 ms |
| **Filter bass** | Width 30 %, LP on the 6581, Cutoff 400 Hz, Resonance 60 %, Envelope +3 oct, filter Decay 250 ms, Mono and Legato, Glide 40 ms |
| **Chip chord** | Width 25 %, arpeggio 4 · 7 · 12 at 50 steps/s |
| **Sync scream** | Saw, Sync on, Interval 19, Matrix: Mod › Interval 100 %, Boost 9 dB |
| **Ring bell** | Triangle, Ring on, Interval 19, Fine 7, Decay 1.2 s, Sustain 0 % |
| **Kick** | Triangle, Octave −2, Noise 8 ms, Drop 36 st over 60 ms, Decay 200 ms, Sustain 0 % |
| **Snare** | Pulse, Noise 40 ms, Drop 12 st over 40 ms, Decay 180 ms, Sustain 0 % |
| **Hot SID** | Pulse + Saw, BP on the 6581, Resonance 70 %, Boost 18 dB |
| **Closed hat** | Noise, Octave +2, HP on the 8580 at 6 kHz, Decay 45 ms, Sustain 0 % |
| **Tom** | Triangle, Noise 3 ms, Drop 7 st over 120 ms, Decay 380 ms, Sustain 0 %: play it on several keys |
| **Zap** | Width 20 %, Drop 48 st over 160 ms, Decay 220 ms, Sustain 0 % |

### Drums

The 8-bit synth plays the drums of the old games: a burst of **Noise** at the strike and a **Drop** onto the
key make kicks, snares and toms; the **Noise** wave makes hats and cymbals. The noise follows the key, so
a hat plays brighter up the keyboard (Octave +2 puts it there from any key). One instance plays one drum
sound well: for a kit, put one in each of the Orbiter's dimensions, or play the sounds from different
keys.

## Mapping

In the Studio's **Map** mode every knob can follow an <Term id="axis">axis</Term>, and Chip, Ring, Sync,
Mono, Legato and the LFO's on/off a toggle: see [Edit](/docs/orbiters/edit). Width, the Interval (with
Sync on), Cutoff and Boost are the ones to try first.

## In a room

Every player in a <Term id="room">room</Term> hears the same notes with the same sound: the arpeggio,
the drop, the noise hit, the LFO delay and the filter envelope all start on each note's strike, which
everyone shares. The noise itself differs a little between players. Pitch bend, pressure and the mod
wheel stay your own.
