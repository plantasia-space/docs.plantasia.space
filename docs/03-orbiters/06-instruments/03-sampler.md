---
title: Sampler
sidebar_position: 3
sidebar_custom_props:
  icon: AudioWaveform
---

The **Sampler** plays real recorded instruments under the keys: pick a piano, a marimba
or a small percussion kit and it plays, in tune, across the keyboard. It is a notes instrument: it plays whatever notes reach it, from the keys, MIDI, the piano roll or a
sequencer.

<TryModule module="sampler" source="piano">
<ModulePicture
  src="/img/orbiters/instruments/sampler.jpg"
  wide
  alt="The Sampler playing the Kawai grand: the sample and its zones on the screen, then Sample, Amp, and the folded LFO, Matrix and Voice columns."
  dots={[[1, 8, 12.2], [2, 5.5, 75.6], [3, 15, 75.6], [4, 24.5, 75.6], [5, 34, 75.6], [6, 43.5, 75.6], [7, 5.6, 49.4], [8, 13.4, 49.4], [9, 67.8, 54.3], [10, 88.9, 62], [11, 93.3, 62], [12, 97.7, 62], [13, 50, 23.5]]}
/>
</TryModule>

## Picking an instrument

An **instrument** is a set of recordings laid across the keys (each one is a **zone**); the Sampler
picks the right one for every note.

The instrument's name is on the screen<Dot>1</Dot>, and in the Studio it is the button in the module's header.
Press that button to open the list of
**libraries** and their instruments. Each row shows what it is and its size.

Pick one and it loads, then swaps in. The module keeps every value you set. While it loads, the
header shows a progress line and the screen says the Sampler is silent until it is ready. If a load
fails, the header says **Failed** and offers **Retry**.

Instruments are saved with the Orbiter (by name, not by file), and kept on your device after the
first load, so they open at once the next time.

**The first library, VCSL** (the Versilian Community Sample Library, public domain): Kawai grand,
Marimba, Kalimba, Tubular glockenspiel and a Percussion kit (cajon, snare, claps, closed hi-hat).
The kit's keys are named on every surface that shows notes (the piano roll, Keys, a drum
sequencer's voices).

## Sample

Where in each zone a note plays. Start, End and Loop start are in **% of each zone**, so one knob
works the same on every zone of the instrument.

| Control | What it does |
|---|---|
| <Dot>2</Dot>**Start** | Where a note starts reading. Raise it to skip the attack and start in the body of the sound. Acts from the next note. |
| <Dot>3</Dot>**End** | Where reading stops, or turns back with Loop on. Lower it for shorter, clipped notes. |
| <Dot>4</Dot>**Loop start** | Where the loop turns back to, in % of Start … End. Only with Loop on. |
| <Dot>5</Dot>**Transpose** | Moves the pitch of every zone, in semitones; the zones stay on their keys. |
| <Dot>6</Dot>**Fine** | Fine tuning, in cents. |
| <Dot>7</Dot>**One-shot** | Every note plays to End whatever you do with the key: for drums. Loop is ignored while it is on. |
| <Dot>8</Dot>**Loop** | When the read reaches End it turns back to Loop start (with a short crossfade, so it never clicks), and keeps looping through the release: sustained pads and drones from short samples. |

## Amp

<Dot>9</Dot>The envelope every note goes through, drawn above its knobs: **Attack**, **Decay**, **Sustain** and
**Release**, then **Velocity** (how much a note's velocity moves its level; at 0 every note is
full) and **Level**. At the defaults (1 ms attack, sustain 100 %) the sample plays as recorded.
Velocity never changes which layer plays: a hard hit always picks the hard recording.

Attack, Decay and Release can be bent: see [Envelopes](/docs/orbiters/instruments#envelopes).

## LFO, Matrix, Voice

These three groups start folded; open them from their column.

- <Dot>10</Dot>**LFO**: one [LFO](/docs/orbiters/instruments#lfo-and-voice) for the whole instrument.
- <Dot>11</Dot>**Matrix**: the [Matrix](/docs/orbiters/instruments#the-matrix) every notes instrument shares. **Modulation** has the LFO's column over
  **Pitch** (vibrato) and **Level** (tremolo). **MIDI** has **Pitch** (with the pitch bend, two
  semitones), **Level**, **Vibrato** (the mod wheel's, on top of the LFO's) and **LFO**. A swell is
  **Mod › Level**: the wheel brings the level up from where the Level knob stands.
- <Dot>12</Dot>**Voice**: the usual [Voice](/docs/orbiters/instruments#lfo-and-voice) group. With Legato, a note played over a held one keeps
  the sample playing and only bends its pitch.

There is no filter in the Sampler: add a **Filters** or **Multimode filter** module after it to shape
every voice at once.

## The screen

<Dot>13</Dot>The screen has two parts.

- **On top, the sound you played last**, as tall as it is loud. **Start** and **End** are handles you
  can drag; with **Loop** on, a bar marks the part that repeats.
- **Below, the whole instrument**: a small square for each zone at its pitch, octaves labelled (a kit
  names its sounds). Each note sounding sends a thread up from its square.
- **The bottom line** names the zone and how long it plays.

While a new instrument loads, the screen shows a thin progress line and stays silent until it is ready.

## Try it

- **A piano that swells.** Pick a piano, then Attack **400 ms** in Amp: every note fades in, and the piano turns into a pad.
- **A reversed-sounding start.** Start **30 %**: notes skip their attack and begin in the body of the sound.
- **A sustained marimba.** Pick a marimba, **Loop** on, Loop start **60 %**, Release **1.5 s**: held notes ring for as long as you hold them.
- **A kit that plays to the end.** Pick a percussion kit and turn **One-shot** on: every hit rings out whatever the note's length.

## Mapping

In the Studio's **Map** mode, every number can be driven by an <Term id="axis">axis</Term>. Two to try first:

- **Start**: from the attack to the body of the sound
- **End** with **Release**: from a stab to a ring

Toggles can flip **One-shot**, **Loop**, **Sync**, **Mono** and **Legato**. The instrument itself is
never on an axis: a preset carries it.

## In a room

Everyone in a <Term id="room">room</Term> hears the same notes and the same sound. A player whose device is still loading
the instrument hears nothing from it until it is ready; the room doesn't wait.
