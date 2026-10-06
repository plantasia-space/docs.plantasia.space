---
title: Note Echo
sidebar_position: 2
sidebar_custom_props:
  icon: Repeat
---

**Note Echo** plays each note again after a delay, a set number of times. Each repeat can be
quieter or louder than the one before, and can climb or fall in pitch. A chord echoes as a chord.

It is a MIDI effect: it sits in an Orbiter's chain before the instrument, after the generator if
there is one, so an arpeggio or a step line can echo too. It loads silent (Level at 0 %), so adding
it changes nothing until you turn Level up.

## Delay

- **Sync** on: the delay is a note value on the Orbiter's tempo, from 1/2 to 1/32, dotted and
  triplet ones included ("1/8D").
- **Sync** off: the delay is in milliseconds, up to 1 s. At the very bottom of the knob it reads
  **0 ms**: every repeat sounds at once with the note, so with **Pitch** set, one key plays a chord.
- **Repeats**: how many times each note plays again, 1 to 15. Each repeat is a voice of the
  instrument, so the knob only goes as far as the instrument's voices allow. Hover it to see why it
  stops there (with 4 voices, 3 repeats fill the instrument's 16 voices). Lower the instrument's
  voices to allow more repeats.

Echoes keep the length of the note you played. They also sound with the transport stopped.
Changing the delay while repeats are still to come slows or speeds them like tape: each still plays
once.

## Per repeat

- **Level**: how loud the first repeat is, as a share of the note you played.
- **Feedback**: each further repeat, times this. Under 100 % the echoes fade, over 100 % they swell
  (up to full velocity).
- **Pitch**: added on every repeat, in semitones. +7 st plays the repeats a fifth, then a ninth,
  then two octaves… higher. A repeat that would leave the keyboard is silent.

## Input

**Thru** plays the note you played, then its repeats. **Mute** plays only the repeats: a pure
delay.

## The screen: Bounce

The note lands on the middle line and bounces once per repeat. The space between landings is the
delay (the faint dots are the beats), the height of each arc is how loud that repeat is, and each
landing sits higher or lower by its pitch. A repeat that won't sound stays as a dashed ghost: muted,
too quiet, off the keyboard, or past the echo's longest reach (the dashed line, about 2.7 s).

**Tap a landing to mute that repeat**, for rhythmic echoes; tap the first one to mute the note you
played. The number on the left counts the repeats that sound. On the smallest drawer the screen
hides, and so do the taps: the mutes keep what you set.

## Mapping

Axes can drive **Delay** (the note value, or the milliseconds), **Level**, **Feedback** and
**Pitch**: stretch the echo like tape, fade the repeats in, or bend a climb from fourths to octaves.
Toggles can flip **Sync** and **Input**. **Repeats** changes the instrument's voices, so it isn't
mappable.

## In a room

Every player hears the echoes made on their own device from the notes they hear, so nothing extra
travels. A player who hears a note late hears its repeats late by the same amount: the echo never
drifts against its note. Someone joining hears the echoes of what is played from then on.
