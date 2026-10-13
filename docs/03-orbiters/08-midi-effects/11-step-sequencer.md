---
title: Step sequencer
sidebar_position: 1.6
sidebar_custom_props:
  icon: Footprints
---

The **Step sequencer** plays a line you draw, in time: a bass figure, a sequenced lead, a pulse on the
root with an octave jump on the last step. Up to 32 steps, each with its own pitch, octave, length,
velocity and chance, and 16 patterns to switch between.

It is a **generator**: it leads an Orbiter's chain, before the MIDI effects and the instrument, and a
dimension has at most one. Unlike the other modules it makes sound as soon as you add it: it loads with
a plain pattern (a note on steps 1, 5, 9 and 13), and its power button is how you silence it.

You meet it in two places, which always show the same state:

- **The module**, in the Studio's drawer: the controls around the pattern, which can be mapped to the
  Orbiter's <Term id="axis">axes</Term> and toggles.
- **The play surface**, in the **Playback** panel on the stage, on the **Step sequencer** tab beside the
  Piano roll: where you draw the steps and switch patterns.

<TryModule module="stepSequencer" source="piano">
<ModulePicture
  src="/img/orbiters/midi-effects/step-sequencer.jpg"
  wide
  alt="The Step sequencer's module in the Studio: the Orbit screen, the Patterns tile, then Play (Direction, Rate, Gate, Swing), Loop (Start, Length) with its Lanes tab, Pitch (Follow, Keys, Scale, Octave, Root) and Euclid (Hits, Rotate)."
  dots={[[1, 34.9, 19.8], [2, 38.1, 60.9], [3, 43.8, 60.9], [4, 49.5, 60.9], [5, 53, 14.1], [6, 56, 58.2], [7, 61.7, 58.2], [8, 68.3, 27.8], [9, 73.8, 27.8], [10, 81.1, 27.8], [11, 72.5, 60.9], [12, 80.2, 60.9], [13, 90.3, 27.8], [14, 91, 60.9], [15, 96.7, 60.9], [16, 33.6, 39.5], [17, 10.9, 12.5]]}
/>
</TryModule>

## Play

| Control | What it does |
|---|---|
| <Dot>1</Dot>**Direction** | Which way the steps run: **Forward**, **Backward**, **Ping-pong** (there and back, the ends played once) or **Random**. |
| <Dot>2</Dot>**Rate** | How long a step is: a note value of the Orbiter's tempo, from 8 bars down to short notes, with dotted values and triplets. **1/16** as it loads. |
| <Dot>3</Dot>**Gate** | Every step's length, times this, 10 … 200 %: short for staccato, over 100 % for notes that run into each other. |
| <Dot>4</Dot>**Swing** | Delays every second step, by up to half a step. |

## Loop

<Dot>5</Dot>Two tabs: **Loop** for the whole pattern, **Lanes** for each lane's own length.

| Control | What it does |
|---|---|
| <Dot>6</Dot>**Start** | The first step of the loop, 1 … 32. The loop wraps round the 32 steps, so sliding Start moves a window along the pattern. |
| <Dot>7</Dot>**Length** | How many steps the loop has, 1 … 32 (16 as it loads). 14 steps at 1/16 is a bar of 7/8. |
| **Lanes** | The Octave, Length, Velocity and Chance lanes can each loop over a length of their own. A velocity lane of 3 steps under a pattern of 16 puts the accent somewhere new on every pass. At 0 a lane follows Length. |

Steps outside the loop are kept: slide the loop back and they play again.

## Pitch

| Control | What it does |
|---|---|
| <Dot>8</Dot>**Follow** | On (as it loads), the pattern plays in the Orbiter's key and scale, and follows them when they change. Off, it has a **Root** and a **Scale** of its own. |
| <Dot>9</Dot>**Keys** | On (as it loads), the keys you hold transpose the pattern while it runs: **C3 plays it as drawn**, E3 a third higher, counted in the scale so it stays in the key. The lowest held key counts; let go and the pattern returns to its own pitches. The keys make no sound of their own while the transport runs. Off, the keys are silent. |
| <Dot>10</Dot>**Scale** | Its own scale, while not following. |
| <Dot>11</Dot>**Octave** | Moves the whole pattern by octaves, −3 … +3. |
| <Dot>12</Dot>**Root** | Its own root, while not following. |

Each step's pitch is a number of semitones above the root. With a scale, a pitch outside it moves to the
scale note below, so changing from major to minor turns the thirds with it.

## Euclid

<Dot>13</Dot>**Euclid** plays an even rhythm in place of the steps you switched on, live, over the loop:
<Dot>14</Dot>**Hits** is how many notes fall in the loop, spread as evenly as they go, and
<Dot>15</Dot>**Rotate** turns them later, step by step. Your own steps stay stored, drawn dimmed, and
come back when you switch Euclid off.

## Drawing the pattern

<ModulePicture
  src="/img/orbiters/midi-effects/step-sequencer-surface.jpg"
  wide
  alt="The Step sequencer's play surface in Notes: the Notes and Patterns switch with the strip of sixteen patterns and Store, Euclid and Mutate on the same line, the loop ruler, the six lanes with their tools at the right, and the playing controls underneath."
  dots={[[1, 13.6, 2.8], [2, 25, 4.5], [3, 40, 4.5], [4, 4.6, 19.3], [5, 4.9, 50.3], [6, 93.1, 19.3], [7, 72, 4.5], [8, 93.7, 4.5], [9, 27, 89]]}
/>

Open the **Playback** panel and pick the <Dot>1</Dot>**Step sequencer** tab. <Dot>2</Dot>**Notes** shows
the lanes, with the sixteen patterns as a numbered strip beside it: tap a number to switch.
<Dot>3</Dot>**Store** keeps what is playing in its pattern.

<Dot>4</Dot>**The loop** is the bar over the steps: the steps under it play, the rest are kept, dimmed.

<Dot>5</Dot>Every step has six values, one lane each. Tap a step in **On**; drag in the others.

| Lane | What it sets |
|---|---|
| **On** | Whether the step plays or rests. |
| **Pitch** | The pitch, in semitones above the root (snapped to the scale). |
| **Octave** | Octaves up or down. |
| **Length** | How long the note sounds, in steps, times Gate. |
| **Velocity** | How hard the note strikes. |
| **Chance** | How often the step plays. The draw is the same for everyone in a room. |

<Dot>6</Dot>Every lane has the same tools at its end, in the same places: **−** and **+** (every step
one down, one up), the **dice** for a random row, **Euclid** to write an even rhythm into that row (each
press writes another shape: rising, falling, an arch, flat), the **loop** switch (the lane follows the
loop, or has a length of its own), and its number of **steps**.

<Dot>7</Dot>**Euclid**, with **Hits** and **Rotate**, is the same as the module's. <Dot>8</Dot>**Mutate**
nudges the rhythm written in the On row a little each time you press it, by the amount beside it;
**Undo** takes the last write back.

<Dot>9</Dot>Under the lanes, the playing controls stay in reach: **Rate**, **Direction**, **Gate**,
**Swing**, **Octave** and **Keys transpose**.

## Patterns

The Step sequencer holds **16 patterns**. Switch to **Patterns**, on the surface or on the module's
<Dot>16</Dot>**Patterns** tile in the first picture, and sixteen round pads show them, each a ring of its
steps with its number and its name; an unused one reads **Empty**.

<ModulePicture
  src="/img/orbiters/midi-effects/step-sequencer-patterns.jpg"
  wide
  alt="The play surface in Patterns: Shift and what a tap does, Store, Copy, Paste, Clear and Undo, then the sixteen pattern pads, pattern 1 playing and the others empty."
  dots={[]}
/>

- **Tap a pad** to switch. While the transport plays, the switch waits for the Orbiter's **launch grid**,
  so it lands on the grid's next line (a bar, at the 1 Bar setting); tap the waiting pad again to take it
  back. Stopped, or with the launch grid off, it switches at once. The
  line beside **Shift** says what a tap does now ("Tap launches now"), and **Shift** flips it.
- **Store** keeps what is playing in its pattern; Store, then a pad, keeps it in that pad.
- **Copy**, **Paste** and **Clear** work on whole patterns, and **Undo** takes back the last of them.
- **Name** a pattern (up to 12 characters): press and hold its pad, double-click it, or press
  **Ctrl + R** (or **F2**). Enter keeps the name, Esc leaves it as it was.

The rate, direction, gate, swing, pitch settings and Euclid belong to the module and are shared by all
sixteen.

## The screen

<Dot>17</Dot>**Orbit.** The loop is one orbit of a World round its Sun, the root: one tick for every
step, clockwise from the top, longer on the beats. Each step that plays is a Moon on its tick's ray:
further out the higher its note, its lit part its velocity, its rim dashed when its chance is under
100 %, with a tail for its length. A rest leaves its place empty. The World goes round with the
transport, and the Moon it lines up with lights up. A lane with its own length is a smaller ring inside,
with its own marker. **Tap a tick** to rest that step, or to play it again. Top right, the note playing
(**Rest**, or **Stopped**); below, the rate and the direction, and the root. In Patterns, the sixteen
patterns' rings take the Orbit's place: tap one to pick it, as on the pads. On the stage, the same
screen is drawn large in the play monitor.

## Try it

- **A bass line.** In front of a synth: besides the four steps it loads with, switch on steps 4, 7 and 11, raise the **Pitch** of one or two, and lift the last one's **Octave** by 1.
- **Play it in other keys with one finger.** With **Keys** on, hold **F3** while it runs: the line moves up a fourth, in the scale. Let go and it comes back.
- **A figure that never repeats the same way.** Set a few steps' **Chance** to 50 %, and the Velocity lane to **3** steps.
- **A shorter loop on an axis.** Map **Length** from 16 down to 4: the pattern closes in on its first steps as the axis moves away from rest.
- **A second pattern for the change.** In Patterns, tap **Store**, then pad 2: the pattern is kept there too. Tap pad 2, change its notes in Notes, and Store. While it plays, a tap on either pad switches on the launch grid's next line.

## Mapping

Axes can drive **Rate**, **Gate**, **Swing**, **Start**, **Length**, the four lane lengths, **Octave**,
**Hits** and **Rotate**; toggles can flip **Follow**, **Keys** and **Euclid**. The steps themselves are
drawn, not mapped.

## In a room

Everyone hears the same notes on the same steps: what a step plays depends only on the beat, and the
chance draws are shared. A pattern switch reaches every player on the same beat.
