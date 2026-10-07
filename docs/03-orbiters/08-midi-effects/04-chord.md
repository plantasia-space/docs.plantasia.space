---
title: Chord
sidebar_position: 4
sidebar_custom_props:
  icon: Piano
---

**Chord** turns every note you play into a chord of up to six notes. Play one finger, hear a chord:
ninths under a one-finger line, a strummed guitar on every step of a sequence, house stabs from a
bass line.

It is a MIDI effect: it sits in an Orbiter's chain before the instrument, after the generator if
there is one. It always plays in the Orbiter's key (the key and scale in the transport bar): to play
it in another key, put **Pitch** or **Scale** before it.

:::tip[Loads silent]

Chord loads with Level at 0 %, so adding it changes nothing until you turn Level up: only the note
you play sounds.

:::

<ModulePicture
  src="/img/orbiters/midi-effects/chord.jpg"
  alt="Chord with Level up, an F♯ just played: the Keys screen over the set's twelve chords, then Chord, Voicing and Strum."
  dots={[[1, 50, 10], [2, 14, 59], [3, 26, 59], [4, 10, 82], [5, 24, 82], [6, 43, 82], [7, 57, 82], [8, 71, 82], [9, 94, 58], [10, 90, 82]]}
/>

## Chord

- <Dot>2</Dot>**Source: Set** plays a **chord set**: one chord for each of the twelve notes of the
  octave, counted from the Orbiter's root. Playing up the white keys walks a progression. When the
  Orbiter changes key, the whole set moves with it: a set written in C plays in E when the Orbiter is
  in E.
- **Source: In key** builds a chord live on the Orbiter's scale instead (a triad, a seventh, a ninth…),
  so a melody in C major plays C major, D minor, E minor… and switches to minor chords the moment the
  scale does. With no scale, the chord is built on the major scale of each note you play.
- <Dot>4</Dot>**Set** picks the chord set (with Set), or **Shape** the chord (with In key), in the same
  place.
- <Dot>5</Dot>**Notes**: how many notes each chord plays, 2 to 6. A chord with more notes than that
  drops its top ones.
- <Dot>3</Dot>**Capture** (with Set): turn it on and hold a chord, on the keys or a MIDI keyboard. When
  you let go, it is stored in the chord being edited, counted from its lowest note, and Capture turns
  off.

### The sets

| Set | What it plays |
| -- | -- |
| **Triads** | the key's own triad on each of its notes |
| **Sevenths** | seventh chords, spread: root and seventh low, the third and fifth an octave up |
| **Ninths** | neo-soul ninths, wide and soft |
| **Minor pop** | minor-key triads with the octave, and a major V to lead home |
| **House** | a minor ninth on every note: 4 notes play a minor seventh, 5 the ninth |
| **Gospel** | major ninths and sixes, a dominant thirteenth, passing diminished chords |
| **Fifths** | stacked fifths on every note: open, post-rock |
| **Quartal** | stacked fourths on the key's notes |

In the sets built on the key, a note outside the key plays a diminished chord on itself, which
resolves up a semitone. The note you play is always the bottom of its chord. After an edit on the
screen the Set reads **Custom**.

### Notes and the instrument's voices

Each chord note is a voice of the instrument: 5 voices playing triads use 15 of its 16. When adding
Chord, or raising **Notes**, would need more than 16, the instrument's **Voices** go down to the most
that fit, in the same step, and the screen says so ("Voices 8 → 5"). Undo brings both back. Lowering
Notes leaves the voices where they are.

## Voicing

- <Dot>6</Dot>**Level**: how loud the added notes are, as a share of the note you played.
- <Dot>7</Dot>**Tilt**: balances the chord. Up brightens the top notes and softens the bottom; down the
  other way.
- <Dot>8</Dot>**Invert**: inversions. +1 moves the lowest note up an octave (C E G → E G C), +2 the two
  lowest; −1 moves the highest down. Past the chord's size, the whole chord moves an octave.

## Strum

- <Dot>10</Dot>**Strum**: the time between two chord notes, up to 500 ms. At the very bottom it reads
  **0 ms**: the whole chord at once.
- <Dot>9</Dot>**Order**: up (the lowest note first) or down.

Every chord note ends with the key: a quick tap on a long strum plays only its first notes, as on a
guitar. A change to any control plays from the next chord: a chord already sounding keeps its notes.

## The screen: Keys

<Dot>1</Dot>Three octaves of keys (two on a phone) under a row of the set's twelve chords, one per
note of the octave from the root (a line marks the root's).

- The key you play has a ring and a tick. The notes that come out are dots, larger when louder (Tilt
  shows as dot size). An open ring is a note the strum hasn't reached yet; a dashed ring one that
  won't sound (past Notes, off the keyboard, too quiet). An arrow at an edge means chord notes beyond
  the drawn keys.
- In the row, the chord playing is filled, the one being edited outlined; a bar at each foot shows
  its size.
- **Edit a set** (with Set): tap a cell to pick its chord, then tap keys to add or take away notes, up
  to six. Each edit is one undo step.
- Sixteen ticks at the bottom count the instrument voices the chord takes.

With nothing playing, the keys show the chord being edited at full level, so you see its shape even
at Level 0 %. On the smallest drawer the screen hides: the set keeps what you set.

## Mapping

<Term id="axis">Axes</Term> can drive **Level**, **Tilt**, **Invert**, **Strum** and **Shape**: fade
the chord in under the note you play, roll inversions up the keyboard, or open a strum. A toggle can
flip **Source** and **Order**. **Notes** changes the instrument's voices, so it isn't mappable, and
the set is edited on the screen.

## In a room

Every player hears the chords made on their own device from the notes they hear, from the same set
and the same key, so nothing extra travels. A strum starts from each player's own note: a player who
hears a note late hears its whole strum late by the same amount, never out of step with it.
