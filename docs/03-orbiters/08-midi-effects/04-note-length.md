---
title: Note Length
sidebar_position: 4
sidebar_custom_props:
  icon: Ruler
---

**Note Length** gives each note a new length: as you played it and stretched, a fixed time, or a
note value on the tempo. It can make low keys last longer than high ones, strike notes when you
**release** the keys, or hold a chord until you play the next one. It never changes which key plays.

It is a MIDI effect: it sits in an Orbiter's chain before the instrument, after the generator if
there is one, so an arpeggio can be clipped short or stretched into a pad.

:::tip[Loads neutral]

Note Length loads as played, Gate at 100 %: every note passes exactly as it came, so adding it changes
nothing until you move something.

:::

<TryModule module="noteLength" set="length:time,timeMs:60" source="piano">
<ModulePicture
  src="/img/orbiters/midi-effects/note-length.jpg"
  alt="Note Length: the Lengths screen, then Length, Shape and Trigger."
/>
</TryModule>

## Length

- **Played**: each note keeps the length you played. **Gate** over 100 % lengthens it past the
  key-up: at 200 %, a note held 300 ms rings 300 ms more. Under 100 % changes nothing here, because
  the note can't know when you'll let go.
- **Time**: every note lasts the same time, 1 ms to 4 s, however long you hold the key.
- **Sync**: every note lasts a note value on the Orbiter's tempo, from 1/2 to 1/32, dotted and
  triplet ones included ("1/16" at 120 BPM is 125 ms).
- **Gate**: a share of that length. 50 % halves it, 200 % doubles it.

Each note keeps the rules it started with: turning a knob, or changing the tempo, acts from the next
note. Note Length works with the transport stopped too. No note lasts more than 60 s.

## Shape

- **Key scale** (Time and Sync): low keys longer (+) or shorter (−). At +100 %, a note two octaves
  under C3 lasts twice as long, two octaves over it half as long.
- **Decay** (Key up only): the longer you held a key, the quieter its note. Held for Decay or longer,
  it stays silent. At the top, **∞**, every note keeps the velocity you played.

## Trigger

- **Down** (the default): a note sounds as its key goes down.
- **Up**: a note sounds when you **release** its key, an organ's release click or a pluck on the way
  up. Its length is the time or note value you set; with **Played**, the time you held it × Gate.
- **Latch** (Down only): notes keep sounding after you let go, until you start a **new chord**: the
  first key you press with no key down replaces them. Keys you add while one is held join the chord.
  Turning Latch off, switching to Up, bypassing the module, stopping or seeking the transport, or
  the panic button releases them.

What a setting doesn't use dims, with a note saying why: Time and Key scale with Played, Decay
unless Up, Latch with Up, and Time, Gate and Key scale while Latch holds the notes.

## The screen: Lengths

One row per note. The dashed outline is the note as you played it; the solid bar inside it is the
note that comes out, lit while it sounds. With nothing playing, three example notes held a sixteenth,
one beat and two beats show how the settings treat each. While you play, the four newest notes scroll
past, newest on top, with now three quarters of the way across.

With **Up**, the bar starts where the outline ends. A note too quiet after Decay is a ring with a
slash. A latched or still-open note fades out at the right edge. Under the picture: the setting, then
the last note in and how long it came out ("C3 · 500 ms → 250 ms").

## Mapping

<Term id="axis">Axes</Term> can drive **Time** (milliseconds or the note value), **Gate**, **Key
scale** and **Decay**: from clipped to sustained in one move. Toggles can flip **Trigger** and
**Latch**.

## In a room

Every player hears the lengths made on their own device from the notes they hear, so nothing extra
travels. A player who hears a note late hears its new length late by the same amount. Latch's "no key
down" counts every player's keys: while one player holds a key, another's notes join the chord.
Someone joining starts with nothing latched; the next chord lines everyone up.
