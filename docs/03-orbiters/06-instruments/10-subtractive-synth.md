---
title: Subtractive synth
sidebar_position: 10
sidebar_custom_props:
  icon: Wheat
---

The **Subtractive synth** (Sheaf) is the plainest synth and the quickest to a sound: one oscillator, a
sub and noise, into a low-pass filter and an amp, each with its own envelope. Basses, leads, pads and
plucks all start here. It is a notes instrument: it sits at the head of a
<Term id="world-dimension">World dimension</Term>, after any generator and MIDI effects, and the notes
you play (the keys, MIDI, the piano roll, a sequencer) sound through it.

<TryModule module="subtractive" set="wave:30,sub:40,cutoff:1200,resonance:35,envAmount:2.5,fSustain:20">
<ModulePicture
  src="/img/orbiters/instruments/subtractive-synth.jpg"
  wide
  alt="The Subtractive synth set as a plucked bass: the Sheaf screen, then Oscillator (Wave, Sub, Noise), Filter with its envelope, Amp with its envelope, and LFO, Matrix and Voice folded."
  dots={[[1, 50, 12.6], [2, 4.6, 71.6], [3, 12.6, 71.6], [4, 20.6, 71.6], [5, 42.5, 47], [6, 31.4, 84.9], [7, 41.1, 84.9], [8, 50.8, 84.9], [9, 86.5, 47], [10, 67.5, 84.9], [11, 78.3, 84.9], [12, 90.7, 58], [13, 94.4, 70], [14, 98, 58]]}
/>
</TryModule>

## How it makes a sound

The oscillator makes a bright, full wave. The **filter** takes the top of it away, more or less, and
that is the "subtractive" part: the sound is shaped by what is removed. Two envelopes move things over
the life of a note: one opens and closes the filter, the other the level.

## Oscillator

| Control | What it does |
|---|---|
| <Dot>2</Dot>**Wave** | The oscillator's shape: a **saw** at 0 %, bright and full; a **square** at 50 %, hollow; a narrow **pulse** at 100 %, thin and nasal; and every shape between. |
| <Dot>3</Dot>**Sub** | A square one octave below, for weight. |
| <Dot>4</Dot>**Noise** | White noise, through the filter and the envelopes with the oscillator: breath on a pad, the hiss of a snare. |

## Filter

A 24 dB low-pass.

| Control | What it does |
|---|---|
| <Dot>6</Dot>**Cutoff** | Where the filter starts taking away, 20 Hz … 20 kHz. Fully open at 20 kHz, as it loads. |
| <Dot>7</Dot>**Resonance** | A peak at the cutoff. Near 100 % the filter sings on its own. |
| <Dot>8</Dot>**Envelope** | How far the filter envelope moves the cutoff, −5 … +5 octaves. Above 0 each note opens the filter and it closes again: a pluck. Below 0 it closes first. |

<Dot>5</Dot>**The filter envelope** is drawn above the knobs: **Attack** (the rise), **Decay** (the fall
to the sustain), **Sustain** (where it holds while the note is down) and **Release** (the fall after
the note ends). Drag a point, or type a value under it.

## Amp

<Dot>9</Dot>The envelope of the level, drawn the same way: **Attack**, **Decay**, **Sustain** and
**Release**. Then <Dot>10</Dot>**Velocity** (how much a note's velocity moves its level; at 0 every note
is full) and <Dot>11</Dot>**Level**.

Attack, Decay and Release of both envelopes can each be **bent**: the small hollow handle in the middle
of a sloped segment is its curve. Drag it across the segment: **+** is fast at the start (a quick rise,
a quick drop and a long tail), **−** slow. Double-click a handle to straighten it.

## LFO, Matrix, Voice

Three groups start folded; open one from its column.

- <Dot>12</Dot>**LFO**: one slow wave for vibrato, wah or a moving pulse. **Sync** (on as it loads) keeps
  it on the Orbiter's beat, so every player in a room is on one phase; off, **Rate** is in Hz. **Shape**:
  sine, triangle, ramp up, ramp down, square or random. **Amount** is how much of it gets through to
  everything it moves.
- <Dot>13</Dot>**Matrix**: the [Matrix](/docs/orbiters/instruments#the-matrix) every notes instrument
  shares. Here the LFO, velocity, the key, pitch bend, pressure, the mod wheel and a random value per
  note can each move **Pitch**, **Wave**, **Cutoff**, **Resonance**, **Sub**, **Noise**, **Level** and
  **Vibrato**; the wheel, the bend and pressure can also bring the **LFO** in.
- <Dot>14</Dot>**Voice**: **Mono** (one note at a time: a new note takes over, and letting it go returns
  to the one still held), **Legato** (with Mono, a note played over a held one slides there without a new
  strike, over **Glide**), and **Voices**, how many notes sound at once (6 as it loads, up to 16).

## The screen

<Dot>1</Dot>**Sheaf.** The sound is a sheaf of stalks running from left to right, lows at one edge and
highs at the other. Where the filter is, a band ties the sheaf: the stalks pull together around it, and
the band moves as the envelope and the LFO move the cutoff. Top right, the filter; below, the **Cutoff**
you set and where the filter is **Now**.

## Starting points

Set these from the defaults to hear what the instrument can do:

| Sound | Oscillator | Filter | Amp and voice |
|---|---|---|---|
| **Plucked bass** | Wave 30 %, Sub 40 % | Cutoff 1.2 kHz, Resonance 35 %, Envelope +2.5 oct, Sustain 20 % | the defaults |
| **Soft pad** | Wave 0 %, Noise 10 % | Cutoff 2 kHz | Attack 600 ms, Release 1.5 s |
| **Hollow lead** | Wave 50 % | Cutoff 4 kHz, Resonance 20 % | Mono and Legato, Glide 60 ms |
| **Pulse that moves** | Wave 70 % | open | Matrix: LFO › Wave 40 % |

## Try it

- **Play the filter.** Set the **Plucked bass** row, put a Step sequencer in front, and map **Cutoff** to an axis: the line opens and closes as the Planet moves.
- **A pad from nothing.** From the defaults, Attack **600 ms** and Release **1.5 s** in Amp, Cutoff **2 kHz**: hold a chord.
- **Vibrato from the mod wheel.** In the Matrix, set Mod wheel › Vibrato: the wheel brings it in on the long notes.

## Mapping

In the Studio's **Map** mode every knob can follow an <Term id="axis">axis</Term>, and Mono, Legato and
the LFO's Sync a toggle: see [Edit](/docs/orbiters/edit). Cutoff, Wave and the filter's Envelope are
the ones to try first.

## In a room

Every player hears the same notes with the same sound. A synced LFO is on the same phase for everyone;
pitch bend, pressure and the mod wheel stay your own.
