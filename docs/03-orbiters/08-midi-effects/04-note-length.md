---
title: Note length
sidebar_position: 4
sidebar_custom_props:
  icon: Ruler
---

**Note length** gives each note a new length: as you played it and stretched, a fixed time, or a
note value on the tempo. It can make low keys last longer than high ones, strike notes when you
**release** the keys, or hold a chord until you play the next one. It never changes which key plays.

It is a MIDI effect: it sits in an Orbiter's chain before the instrument, after the generator if
there is one, so an arpeggio can be clipped short or stretched into a pad.

:::tip[Loads neutral]

Note length loads as played, Gate at 100 %: every note passes exactly as it came, so adding it changes
nothing until you move something.

:::

<TryModule module="noteLength" set="length:time,timeMs:60" source="piano">
<ModulePicture
  src="/img/orbiters/midi-effects/note-length.jpg"
  alt="Note length at a fixed time of 60 ms: the Lengths screen, then Length (the Played, Time and Sync switch, Time, Gate), Shape (Key scale, Decay) and Trigger (Down or Up, Latch)."
  dots={[[1, 5, 63.9], [2, 11, 82.9], [3, 30, 82.9], [4, 51.5, 78.8], [5, 70.5, 78.8], [6, 90.5, 66.6], [7, 90.5, 79.6], [8, 50, 14.2]]}
/>
</TryModule>

## Length

| Control | What it does |
|---|---|
| <Dot>1</Dot>**Length** | **Played**: each note keeps the length you played. **Time**: every note lasts the same time, 1 ms to 4 s, however long you hold the key. **Sync**: every note lasts a note value on the Orbiter's tempo, from 1/2 to 1/32, dotted and triplet ones included. |
| <Dot>2</Dot>**Time** | The time, or the note value. |
| <Dot>3</Dot>**Gate** | A share of that length: 50 % halves it, 200 % doubles it. With Played, Gate over 100 % lets the note ring on after the key-up. |

Each note keeps the rules it started with: turning a knob, or changing the tempo, acts from the next
note. Note length works with the transport stopped too. No note lasts more than 60 s.

## Shape

| Control | What it does |
|---|---|
| <Dot>4</Dot>**Key scale** | Time and Sync: low keys longer (+) or shorter (−). At +100 %, a note two octaves under C3 lasts twice as long, two octaves over it half as long. |
| <Dot>5</Dot>**Decay** | Key up only: the longer you held a key, the quieter its note. Held for Decay or longer, it stays silent. At the top, **∞**, every note keeps the velocity you played. |

## Trigger

| Control | What it does |
|---|---|
| <Dot>6</Dot>**Trigger** | **Down** (as it loads): a note sounds as its key goes down. **Up**: a note sounds when you **release** its key, an organ's release click or a pluck on the way up; its length is the time or note value you set, or with Played, the time you held it × Gate. |
| <Dot>7</Dot>**Latch** | Down only: notes keep sounding after you let go, until you start a **new chord**. Keys you add while one is held join the chord. Turning Latch off, switching to Up, bypassing the module, stopping or seeking the transport, or the panic button releases them. |

Controls a setting does not use are dimmed.

## The screen

<Dot>8</Dot>**Lengths.** One row per note. The dashed outline is the note as you played it; the solid bar inside it is the
note that comes out, lit while it sounds. With nothing playing, three example notes held a sixteenth,
one beat and two beats show how the settings treat each. While you play, the four newest notes scroll
past, newest on top, with now three quarters of the way across.

With **Up**, the bar starts where the outline ends. A note too quiet after Decay is a ring with a
slash. A latched or still-open note fades out at the right edge. Under the picture: the setting, then
the last note in and how long it came out ("C3 · 500 ms → 250 ms").

## Try it

- **A staccato arpeggio.** After an Arpeggiator: Length **Sync**, **1/16**, Gate **50 %**. Every note is clipped to half a sixteenth.
- **A pad out of short notes.** Length **Time**, **2 s**, in front of a slow synth: tapped keys ring on and overlap.
- **Hold a chord while your hands move.** Trigger **Down**, **Latch** on: play a chord, let go, and it sounds until you play the next one.
- **A pluck on the way up.** Trigger **Up**, Length **Time**, **120 ms**: each note sounds as you release its key.

## Mapping

<Term id="axis">Axes</Term> can drive **Time** (milliseconds or the note value), **Gate**, **Key
scale** and **Decay**: from clipped to sustained in one move. Toggles can flip **Trigger** and
**Latch**.

## In a room

Every player's device in a <Term id="room">room</Term> makes the lengths from the notes it hears. Latch counts every player's keys:
while one player holds a key, another's notes join the chord.
