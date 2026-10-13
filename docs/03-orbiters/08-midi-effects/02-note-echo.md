---
title: Note echo
sidebar_position: 2
sidebar_custom_props:
  icon: Repeat
---

**Note echo** plays each note again after a delay, a set number of times. Each repeat can be
quieter or louder than the one before, and can climb or fall in pitch. A chord echoes as a chord.

It is a MIDI effect: it sits in an Orbiter's chain before the instrument, after the generator if
there is one, so an arpeggio or a step line can echo too.

:::tip[Loads silent]

Note echo loads with Level at 0 %, so adding it changes nothing until you turn Level up.

:::


<TryModule module="noteEcho" set="level:70" source="piano">
<ModulePicture
  src="/img/orbiters/midi-effects/note-echo.jpg"
  alt="Note echo as it loads, Level at 0 %: the Bounce screen, then Delay, Per repeat and Input."
  dots={[[1, 22.0, 58.2], [2, 9.2, 80], [3, 25.2, 80], [4, 43.2, 78.8], [5, 59.2, 78.8], [6, 75.2, 78.8], [7, 92, 66.6], [8, 50, 14.2]]}
/>
</TryModule>

## Delay

| Control | What it does |
|---|---|
| <Dot>1</Dot>**Sync** | On: Delay is a note value on the Orbiter's tempo. Off: it is in milliseconds. |
| <Dot>2</Dot>**Delay** | The time between repeats. Synced: from 1/2 to 1/32, dotted and triplet ones included ("1/8D"). Free: up to 1 s. At the very bottom of the knob it reads **0 ms**: every repeat sounds at once with the note, so with **Pitch** set, one key plays a chord. |
| <Dot>3</Dot>**Repeats** | How many times each note plays again, 1 to 15. Each repeat uses one of the instrument's 16 voices, so the instrument's **Voices** may go down to fit; the screen says so. |

Echoes keep the length of the note you played. They also sound with the transport stopped.
Changing the delay while repeats are still to come slows or speeds them like tape: each still plays
once.

## Per repeat

| Control | What it does |
|---|---|
| <Dot>4</Dot>**Level** | How loud the first repeat is, as a share of the note you played. |
| <Dot>5</Dot>**Feedback** | Each further repeat, times this. Under 100 % the echoes fade, over 100 % they swell (up to full velocity). |
| <Dot>6</Dot>**Pitch** | Added on every repeat, in semitones. +7 st plays the repeats a fifth, then a ninth, then two octaves… higher. A repeat that would leave the keyboard is silent. |

## Input

<Dot>7</Dot>**Thru** plays the note you played, then its repeats. **Mute** plays only the repeats: a pure
delay.

## The screen

<Dot>8</Dot>**Bounce.** The note lands on the middle line and bounces once per repeat. The space between landings is the
delay (the faint dots are the beats), the height of each arc is how loud that repeat is, and each
landing sits higher or lower by its pitch. A repeat that won't sound stays as a dashed ghost: muted,
too quiet, off the keyboard, or past the echo's longest reach (the dashed line, about 2.7 s).

**Tap a landing to mute that repeat**, for rhythmic echoes; tap the first one to mute the note you
played. The number on the left counts the repeats that sound. On the smallest drawer the screen
hides, and so do the taps: the mutes keep what you set.

## Try it

- **A dotted echo on single notes.** Sync on, Delay **1/8D**, Repeats **3**, Level **70 %**, Feedback **70 %**: each note comes back three times, softer every time.
- **An echo that climbs.** Pitch **+7 st**, Repeats **2**: the repeats play a fifth, then a ninth above the note.
- **A swell.** Feedback **120 %**, Level **40 %**, Repeats **4**: the echoes get louder instead of fading.
- **Only the echoes.** **Mute** the input, Level **70 %**: you hear only the echoes.

## Mapping

<Term id="axis">Axes</Term> can drive **Delay** (the note value, or the milliseconds), **Level**, **Feedback** and
**Pitch**: stretch the echo like tape, fade the repeats in, or bend a climb from fourths to octaves.
Toggles can flip **Sync** and **Input**. **Repeats** changes the instrument's voices, so it isn't
mappable.

## In a room

Every player's device in a <Term id="room">room</Term> makes the echoes from the notes it hears, so an echo never drifts against its
note.
