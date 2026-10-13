---
title: Step sequencer
sidebar_position: 1.6
sidebar_custom_props:
  icon: Footprints
---

The **Step sequencer** plays a line you draw, in time: a bass figure, a sequenced lead, a pulse on the
root with an octave jump on the last step. Up to 32 steps, each with its own note, octave, length,
velocity and chance, and 16 patterns to switch between.

It is a **generator**: it leads an Orbiter's chain, before the MIDI effects and the instrument, and a
dimension has at most one. Unlike the other modules it makes sound as soon as you add it: it loads with
a plain pattern, and its power button is how you silence it.

You meet it in two places, which always show the same state:

- **The module**, in the Studio's drawer: the controls around the pattern, which can be mapped to the
  Orbiter's <Term id="axis">axes</Term> and toggles.
- **The play surface**, on the stage while the Step sequencer leads the chain: where you draw the steps
  and switch patterns.

<TryModule module="stepSequencer" source="piano">
<ModulePicture
  src="/img/orbiters/midi-effects/step-sequencer.jpg"
  wide
  alt="The Step sequencer's module: the Orbit screen, then Play (Direction, Rate, Gate, Swing), Loop (Start, Length) with its Lanes tab, Pitch (Follow, Keys, Scale, Octave, Root) and Euclid (Hits, Rotate)."
  dots={[[1, 12.3, 12.7], [2, 25.8, 20.4], [3, 28.4, 61.1], [4, 34.9, 61.1], [5, 41.5, 61.1], [6, 45.8, 14.7], [7, 48.8, 58.4], [8, 55.3, 58.4], [9, 63, 28.5], [10, 69.4, 28.5], [11, 78.1, 28.5], [12, 68.1, 61.1], [13, 76.9, 61.1], [14, 89, 28.5], [15, 89.7, 61.1], [16, 96.2, 61.1]]}
/>
</TryModule>

## Play

| Control | What it does |
|---|---|
| <Dot>2</Dot>**Direction** | Which way the steps run: **Forward**, **Backward**, **Ping-pong** (there and back, the ends played once) or **Random**. |
| <Dot>3</Dot>**Rate** | How long a step is: a note value of the Orbiter's tempo, straight or triplet. **1/16** as it loads. |
| <Dot>4</Dot>**Gate** | Every step's length, times this, 10 … 200 %: short for staccato, over 100 % for notes that run into each other. |
| <Dot>5</Dot>**Swing** | Delays every second step, by up to half a step. |

## Loop

<Dot>6</Dot>Two tabs: **Loop** for the whole pattern, **Lanes** for each lane's own length.

| Control | What it does |
|---|---|
| <Dot>7</Dot>**Start** | The first step of the loop, 1 … 32. The loop wraps round the 32 steps, so sliding Start moves a window along the pattern. |
| <Dot>8</Dot>**Length** | How many steps the loop has, 1 … 32 (16 as it loads). 14 steps at 1/16 is a bar of 7/8. |
| **Lanes** | The Octave, Length, Velocity and Chance lanes can each loop over a length of their own. A velocity lane of 3 steps under a pattern of 16 puts the accent somewhere new on every pass. At 0 a lane follows Length. |

Steps outside the loop are kept: slide the loop back and they play again.

## Pitch

| Control | What it does |
|---|---|
| <Dot>9</Dot>**Follow** | On (as it loads), the pattern plays in the Orbiter's key and scale, and follows them when they change. Off, it has a **Root** and a **Scale** of its own. |
| <Dot>10</Dot>**Keys** | On (as it loads), the keys you hold transpose the pattern while it runs: **C3 plays it as drawn**, E3 a third higher, counted in the scale so it stays in the key. The lowest held key counts; let go and the pattern returns to its own pitches. The keys make no sound of their own while the transport runs. Off, the keys are silent. |
| <Dot>11</Dot>**Scale** | Its own scale, while not following. |
| <Dot>12</Dot>**Octave** | Moves the whole pattern by octaves, −3 … +3. |
| <Dot>13</Dot>**Root** | Its own root, while not following. |

Each step's note is a number of semitones above the root. With a scale, a note outside it moves to the
scale note below, so changing from major to minor turns the thirds with it.

## Euclid

<Dot>14</Dot>**Euclid** plays an even rhythm in place of the steps you switched on, live, over the loop:
<Dot>15</Dot>**Hits** is how many notes fall in the loop, spread as evenly as they go, and
<Dot>16</Dot>**Rotate** turns them later, step by step. Your own steps stay stored, drawn dimmed, and
come back when you switch Euclid off.

## Drawing the pattern

On the play surface, in **Notes**, every step has six values, one lane each:

| Lane | What it sets |
|---|---|
| **On** | Whether the step plays or rests. |
| **Note** | The pitch, in semitones above the root (snapped to the scale). |
| **Octave** | Octaves up or down. |
| **Length** | How long the note sounds, in steps, times Gate. |
| **Velocity** | How hard the note strikes. |
| **Chance** | How often the step plays. The draw is the same for everyone in a room. |

Every lane has the same tools at its end: **−** and **+**, **dice** for a random row, **Euclid** to write
an even rhythm into that row (each press writes another shape: rising, falling, an arch, flat), and its
loop length. On the On row, **Mutate** nudges the written rhythm a little each time you press it.

## Patterns

The Step sequencer holds **16 patterns**. In **Patterns**, sixteen pads show them, each as a ring of its
steps with its number and name:

- **Tap a pad** to switch. While the transport plays, the switch waits for the Orbiter's **launch grid**,
  so it lands on a bar line; tap the waiting pad again to take it back. Stopped, it switches at once.
- **Store** keeps what is playing in its pattern; Store, then a pad, keeps it in that pad.
- **Copy**, **Paste** and **Clear** work on whole patterns, and **Undo** takes back the last of them.
- **Name** a pattern (up to 12 characters): press and hold its pad, double-click it, or press
  **Ctrl + R** (or **F2**). Enter keeps the name, Esc leaves it as it was.

The rate, direction, gate, swing, pitch settings and Euclid belong to the module and are shared by all
sixteen.

## The screen

<Dot>1</Dot>**Orbit.** The loop is a ring with a tick for every step, and a hand sweeps round it once
per pass. The steps that play are bodies on the rings around it, further out the higher they are, and
the one sounding lights up. Top right, the note playing; below, the rate and the direction, and the
root. In Patterns, the sixteen patterns' rings take its place.

## Try it

- **A bass line.** In front of a synth: switch on steps 1, 4, 7, 11 and 13, raise the **Note** of one or two, and lift the last one's **Octave** by 1.
- **Play it in other keys with one finger.** With **Keys** on, hold **F3** while it runs: the line moves up a fourth, in the scale. Let go and it comes back.
- **A figure that never repeats the same way.** Set a few steps' **Chance** to 50 %, and the Velocity lane to **3** steps.
- **A shorter loop on an axis.** Map **Length** from 16 down to 4: the pattern closes in on its first steps as the Planet moves away.
- **A second pattern for the change.** Store pattern 1, tap pad 2, change the notes, Store. While it plays, tap either pad: it switches on the next bar.

## Mapping

Axes can drive **Rate**, **Gate**, **Swing**, **Start**, **Length**, the four lane lengths, **Octave**,
**Hits** and **Rotate**; toggles can flip **Follow**, **Keys** and **Euclid**. The steps themselves are
drawn, not mapped.

## In a room

Everyone hears the same notes on the same steps: what a step plays depends only on the beat, and the
chance draws are shared. A pattern switch reaches every player on the same bar line.
