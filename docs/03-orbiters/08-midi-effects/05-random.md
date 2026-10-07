---
title: Random
sidebar_position: 5
sidebar_custom_props:
  icon: Dices
---

**Random** moves a note up or down, by chance: an arpeggio that sometimes jumps an octave, a step line
that wanders a degree up or down in the key, a bass that flips between root and fifth. At a low
chance it adds the odd variation; at a high one it turns into a new melody built on the old one.

It is a MIDI effect: it sits in an Orbiter's chain before the instrument, after the generator if
there is one. A change applies from the next note: a note already sounding keeps its key, and its
release sounds there.

:::tip[Loads as a bypass]

Random loads with Chance at 0 %: every note passes exactly as it came in. Raise Chance and notes start
to jump an octave up or down.

:::

## Draw

- **Chance**: how likely a note is moved. At 0 % no note moves; at 100 % every note does.
- **Choices**: how many intervals a moved note can land on, each way. With Choices 3 and an interval
  of 12 st, a note can move one, two or three octaves.
- **Random** or **Alternate**: how a moved note picks its move.
  - **Random** draws one of the moves for each note.
  - **Alternate** takes the moves in turn, one place per note: up, down, further up, further down…
    Every note moves the walk on, moved or not, so with Chance below 100 % the line keeps its shape:
    Alternate says *which* move comes next, Chance says *whether* it plays. A chord's notes take
    successive places, so a chord spreads out.

The light after **Draw** flashes when a note was just moved.

## Interval

- **+**, **−** or **±**: which way a note moves. **±** (the default) moves it either way, so a line
  drawn around itself keeps its register.
- **Interval**: one step of a move. In semitones (1 … 24 st, 12 st by default: an octave), or, with
  Follow on, in degrees of the scale (1 … 14 deg, 7 deg by default).
- **Follow** (the Orbiter's tonality): on, the interval counts degrees of the scale the Orbiter
  plays in, so a moved note stays in the key. Off, it counts semitones.

### Why Follow is off by default

Off, raising Chance always gives octaves, whatever the tonality. On, the interval counts degrees
of the Orbiter's scale, and what that means depends on the scale: 7 degrees is an octave in a
seven-note scale, but an octave and two notes in a pentatonic, and only a fifth with no scale set,
where every degree is a semitone. Turn Follow on once the Orbiter has a key.

A note outside the scale keeps its distance from the scale note under it: Random moves the line in
the key, it doesn't correct it. For a strictly in-key result, put **Scale** after it.

## The edges

A move past the lowest or the highest MIDI note folds back by whole octaves, so the note keeps its
pitch class. There is no range of its own: put **Pitch** after Random to keep a register.

## The screen

The screen shows a dream from Méliès' *A Trip to the Moon* (1902): where the last note went among the
moves it could take.

- The **crescent moon** with its dreamer is the note coming in.
- The **small stars** are the moves, one each, at their real height: higher is up.
- The **big star**, held up on a staff from the rocks, is the move the note took, with an arc from
  the moon.
- **Saturn** lights when the note stayed where it was.
- With **Alternate**, a dotted line joins the stars in the order the walk takes them.
- The number is **Chance**; the three lights on the right say whether the last note went up (+),
  stayed (0) or went down (−).

The moon rocks and the big star twinkles only while notes play. On the smallest drawer the screen
hides and the Draw light stays.

## Mapping

<Term id="axis">Axes</Term> can drive Chance, Choices and the interval: a Planet that moves away from the
centre plays a looser line (Chance), or a wider one (Choices). Random · Alternate and Follow can be
toggled. The two intervals map separately, so switching Follow never changes what a stored number
means.

## In a room

Every player hears the same notes moved the same way. Random reads one shared list of numbers, a
note at a time per pitch class, so a note that reaches someone late still moves the same way, and
someone joining takes over where the room is. Alternate's walk counts the same notes, so it walks
alike everywhere, as long as the notes reach everyone in the same order (two players striking at the
same instant may differ by one step).

## Presets

| Preset | Settings | What it does |
| -- | -- | -- |
| **Octave jumps** | Chance 30 %, ± 12 st, Choices 1 | A line that now and then leaps an octave. |
| **Wander in key** | Chance 50 %, Follow on, ± 1 deg, Choices 2 | Steps a degree or two around the line, in the key. |
| **Octave flip** | Chance 100 %, Alternate, ± 12 st, Choices 1 | Up an octave, down an octave, up… |
| **Zig-zag** | Chance 100 %, Alternate, Follow on, ± 2 deg, Choices 2 | Up a third, down a third, further up, further down. |
| **Sparkle** | Chance 20 %, + 12 st, Choices 2 | The odd note one or two octaves higher. |
