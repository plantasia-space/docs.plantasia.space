---
title: Sampler
sidebar_position: 8
sidebar_custom_props:
  icon: AudioWaveform
---

The **Sampler** (Rhizome) plays real recorded instruments under the keys: pick a piano, a marimba
or a small percussion kit and it plays, in tune, across the keyboard. It is a notes instrument: it
sits at the head of a World dimension, after any generator and MIDI effects, and the notes you play
(the keys, MIDI, the piano roll, a sequencer) sound through it.

An **instrument** is a set of recordings and a map of where each one plays: a **zone** is one
recording on a range of keys, sometimes in several **velocity layers** (soft and hard hits) and
**round robins** (takes that alternate, so repeated notes don't sound identical). The Sampler picks
the right zone for every note by itself.

## Picking an instrument

The instrument's name is the button in the module's header. Press it to open the list of
**libraries** and their instruments. Each row shows the instrument's tags, how many zones (and
layers or round robins) it has, its size, and where it comes from with its licence.

Pick one and it loads, then swaps in. The module keeps every value you set. While it loads, the
header shows a progress line and the screen says the Sampler is silent until it is ready. If a load
fails, the header says **Failed** and offers **Retry**.

Instruments are saved with the Orbiter (by name, not by file), and kept on your device after the
first load, so they open at once the next time.

**The first library, VCSL** (the Versilian Community Sample Library, public domain): Kawai grand,
Marimba, Kalimba, Tubular glockenspiel and a Percussion kit (cajon, snare, claps, closed hi-hat).
The kit's keys are named on every surface that shows notes (the piano roll, Keys, a drum
sequencer's voices).

## The screen

The screen has two parts. On top, the zone you played last (before any note, the one nearest the
middle of the keyboard), drawn as fine strands as tall as the sound is loud; outside **Start** … **End**
they fade. **Start** and **End** are handles you can drag. With **Loop** on, a bar marks the span from
**Loop** to End, and the strands inside it weave into a mesh: that part repeats.

Below, every zone of the instrument sits as a small square at its pitch, octaves labelled (a kit names
its sounds), the zone you played last the large one. Each note sounding sends a thread from its zone up
to where it is reading, with a dot that fades as the note does: the newest thread bright, older ones
faint. A chord shows as threads from several zones. The bottom line names the zone and how long it plays.

While a new instrument loads, the screen shows a thin progress line and stays silent until it is ready
(in a room, the room plays on meanwhile). If it can't load, it says why.

## Sample

Where in each zone a note plays. Start, End and Loop start are in **% of each zone**, so one knob
works the same on every zone of the instrument.

| Control | What it does |
|---|---|
| **Start** | Where a note starts reading. Raise it to skip the attack and start in the body of the sound. Acts from the next note. |
| **End** | Where reading stops, or turns back with Loop on. Lower it for shorter, clipped notes. |
| **Loop start** | Where the loop turns back to, in % of Start … End. Only with Loop on. |
| **Transpose** | Moves the pitch of every zone, in semitones; the zones stay on their keys. |
| **Fine** | Fine tuning, in cents. |
| **One-shot** | Every note plays to End whatever you do with the key: for drums. Loop is ignored while it is on. |
| **Loop** | When the read reaches End it turns back to Loop start (with a short crossfade, so it never clicks), and keeps looping through the release: sustained pads and drones from short samples. |

## Amp

The envelope every note goes through, drawn above its knobs: **Attack**, **Decay**, **Sustain** and
**Release**, then **Velocity** (how much a note's velocity moves its level; at 0 every note is
full) and **Level**. At the defaults (1 ms attack, sustain 100 %) the sample plays as recorded.
Velocity never changes which layer plays: a hard hit always picks the hard recording.

Attack, Decay and Release can each be **bent**. The small hollow handle in the middle of each sloped
segment is its curve: drag it across the segment to bend it, from **−100 %** to **+100 %**.
**+** is fast at the start (a quick rise, a quick drop and a long tail), **−** slow (a swell, a fall
that holds before it goes). Double-click a handle to straighten it. A bent segment's handle is
filled in. What the graph draws is what you hear, and a curve can be mapped to an axis like any
other control.

## LFO, Mod wheel, Voice

These three groups start folded; open them from their column.

- **LFO**: one LFO for the whole instrument, **synced** to the transport (a note value or bars) or
  free (in Hz), with six shapes. **Pitch** is its vibrato depth (in semitones), **Level** its
  tremolo depth.
- **Mod wheel**: what the wheel moves — **LFO** (extra vibrato on top of the LFO's), **Level** (a
  swell: at Amount 100 % the instrument is silent until you move the wheel) or **Pitch** (up to
  +2 semitones) — and how far (**Amount**).
- **Voice**: **Voices** (how many notes sound at once, 1 … 16), **Mono** (one note at a time),
  **Legato** (with Mono, a note played over a held one keeps the sample playing and only bends its
  pitch, with **Glide** for how long the slide takes).

There is no filter in the Sampler: add a **Filters** or **Multimode Filter** module after it to shape
every voice at once.

## Mapping

In the Studio's **Map** mode, every number control can be driven by an axis — Start (attack ↔
body), End and Release (stab ↔ ring), Loop start (on a drone), Transpose (stepped, in semitones),
the LFO depths — and toggles can flip **One-shot**, **Loop**, **Sync**, **Mono** and **Legato**. The
instrument itself is never on an axis: a preset carries it.

## In a room

Every player in a room loads the instrument from the Orbiter. A player whose device is still loading
it hears nothing from it until it is ready; the room doesn't wait. Notes, the synced LFO and its
Random shape are the same for everyone. Two things may differ slightly between players: the round
robin a note picks when it is struck exactly on a sixteenth's boundary, and a free (unsynced) LFO
over a long take.
