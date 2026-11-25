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

<TryModule module="random" set="chance:50" source="piano">
<ModulePicture
  src="/img/orbiters/midi-effects/random.jpg"
  alt="Random at Chance 50 %, ± 12 st: the dream screen, then Draw (Random or Alternate, Chance, Choices) and Interval (+, − or ±, Follow, Interval)."
  dots={[[1, 12.1, 82.9], [2, 33, 82.9], [3, 4.5, 63.9], [4, 48.5, 63.9], [5, 72.2, 82.9], [6, 78.5, 63.9], [7, 50, 14.2]]}
/>
</TryModule>

## Draw

| Control | What it does |
|---|---|
| <Dot>1</Dot>**Chance** | How likely a note is moved. At 0 % no note moves; at 100 % every note does. |
| <Dot>2</Dot>**Choices** | How many intervals a moved note can land on, each way. With Choices 3 and an interval of 12 st, a note can move one, two or three octaves. |
| <Dot>3</Dot>**Random** or **Alternate** | How a moved note picks its move. **Random** draws one of the moves for each note. **Alternate** takes the moves in turn: up, down, further up, further down… A chord's notes take successive places, so a chord spreads out. |

The light after **Draw** flashes when a note was just moved.

## Interval

| Control | What it does |
|---|---|
| <Dot>4</Dot>**+**, **−** or **±** | Which way a note moves. **±** (as it loads) moves it either way, so a line drawn around itself keeps its register. |
| <Dot>5</Dot>**Interval** | One step of a move. In semitones (1 … 24 st, 12 st as it loads: an octave), or, with Follow on, in degrees of the scale (1 … 14 deg, 7 deg as it loads). |
| <Dot>6</Dot>**Follow** | On, the interval counts degrees of the Orbiter's scale, so a moved note stays in the Orbiter's key. Off (as it loads), it counts semitones. Turn Follow on once the Orbiter has a key: with no scale set, a degree is just a semitone. |

Random moves the line in the key, it doesn't correct it: for a strictly in-key result, put **Scale**
after it.

## The edges

A move past the lowest or the highest MIDI note folds back by whole octaves, so the note keeps its
note name. There is no range of its own: put **Pitch** after Random to keep a register.

## The screen

<Dot>7</Dot>The screen shows a dream from Méliès' *A Trip to the Moon* (1902): where the last note went among the
moves it could take.

- The **crescent moon** with its dreamer is the note coming in.
- The **small stars** are the moves, one each, at their real height: higher is up.
- The **big star**, held up on a staff from the rocks, is the move the note took, with an arc from
  the moon.
- **Saturn** lights when the note stayed where it was.
- With **Alternate**, a dotted line joins the stars in the order the walk takes them.

### The corners and the crosshair

The number at the top left is **Chance**: drag it up or down (double-click resets it). At the top
right, **Direction** (up, both ways or down) and at the bottom right, **Mode** (Random or Alternate)
are rows of dots: tap to take the next. The crosshair is the sky: drag it **sideways** for
**Choices** (how many stars) and **up or down** for **Interval** (how high they reach, in semitones or
degrees); the triangles on the edges move one of the two alone.

## Try it

- **An arpeggio that leaps.** After an Arpeggiator, before the instrument: Chance **30 %**, **±**, Interval **12 st**. Now and then a note jumps an octave.
- **A line that wanders in the key.** With the Orbiter's key set: **Follow** on, Interval **1 deg**, Choices **2**, Chance **50 %**.
- **A bass between root and fifth.** On a one-note bass line: **+**, Interval **7 st**, Choices **1**, Chance **40 %**.
- **More, the further you move.** Map Chance to an axis: at rest the line plays as written, and it loosens as the axis moves away from rest.

## Mapping

<Term id="axis">Axes</Term> can drive Chance, Choices and the interval: a World that moves away from the
centre plays a looser line (Chance), or a wider one (Choices). Random · Alternate and Follow can be
toggled. The two intervals map separately, so switching Follow never changes what a stored number
means.

## In a room

Every player in a <Term id="room">room</Term> hears the same notes moved the same way.
