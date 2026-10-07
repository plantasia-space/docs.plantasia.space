---
title: Drum Sequencer
sidebar_position: 1
sidebar_custom_props:
  icon: Grid3x3
---

The **Drum Sequencer** plays drum patterns into an Orbiter's instrument. It works like a pad
controller: <Dot>1</Dot>16 pads (or 8) whose job changes with the <Dot>2</Dot>**pad function** you pick, a
<Dot>3</Dot>small screen with <Dot>4</Dot>four knobs, <Dot>5</Dot>two **real-time FX** ribbons, and up to 32 **beats**, each 1 to 8 bars long.

You meet it in two places, which always show the same state:

- **The module**, in the Studio's drawer, where you build the Orbiter. Its knobs and switches can
  be **mapped to the Orbiter's <Term id="axis">axes</Term> and toggles**.
- **The play surface**, on the stage while the Drum Sequencer leads the chain, in the Studio and when
  the Orbiter is played. Its controls can be **mapped to MIDI hardware**.


<ModulePicture
  src="/img/orbiters/midi-effects/drum-sequencer.jpg"
  wide
  alt="The Drum Sequencer: real-time FX ribbons on the left, pad function and pad options above the 16 pads, the screen, knobs and Generate on the right."
  dots={[[1, 15.8, 63.6], [2, 11.6, 20.7], [3, 68.6, 22], [4, 72.3, 44.6], [5, 3.4, 56.7], [6, 40.7, 27.4], [7, 54.4, 27.4], [8, 73.8, 83.7], [9, 11.6, 38.6], [10, 6, 96]]}
/>

## Pad functions

Pick what the pads do: **Beats** and **Mutes** work on the beat, **Steps**, **Tunings** and **Voices** on its notes. The buttons
around the pads follow the function: an action that would do nothing there is greyed out.

| Function | The pads… | Also available |
|---|---|---|
| **Voices** | play each drum voice (bank A, or bank B with **Bank B**) and select it | Roll, Accent, Rec, Generate, Copy/Paste/Erase |
| **Beats** | pick the beat that plays | Beat roll, Bank B, Copy/Paste/Erase of the whole beat, Length |
| **Steps** | set the selected voice's steps; hold a pad to edit that step on the knobs | Roll, Accent, Page, Generate, Copy/Paste/Erase of the voice's row |
| **Tunings** | play the selected voice across the pads, a semitone (or more, with **Spread**) apart | Roll, Accent, Rec |
| **Mutes** | mute or unmute each voice | Beat roll, Bank B, Unmute all |

The four knobs under the screen change with the function too.

<Dot>6</Dot>**Roll** follows the function. In Beats and Mutes it is **Beat roll**: the beat repeats a short slice,
at the roll rate (the Roll knob in Beats), from where you switched it on. In the other functions,
**Roll** repeats a pad while you hold it. Their names and values are shown on
the screen.

## Switching beats

In **Beats**, tap a pad to pick a beat. While the transport is stopped it switches at once. While it
plays, the new beat starts on the Orbiter's **launch grid** (the grid picker in the header, also the
first knob in Beats), so the switch always lands on a bar line. A mute waits for the grid the same
way.

While a switch waits, its pad blinks and counts down the beats left, like Play does when it waits
for the grid. Tap the beat that is playing to take the switch back.

## Recording

Press <Dot>7</Dot>**Rec** to record what you play into the beat that is playing:

1. Pick **Voices** or **Tunings**.
2. Press **Rec**. The button lights; it records while the transport plays.
3. Play the pads, by tapping or from MIDI pads mapped to them.

Each hit lands on the step nearest to when you heard it, keeping how far off the grid it was, its
velocity (Accent records at full velocity), and in Tunings its pitch. The result is ordinary steps:
open **Steps** to edit them, or **Undo** to take a hit back. Press **Rec** again to stop.

<LoopVideo
  src="https://herbarium.plantasia.space/docs/en/media/orbiters/midi-effects/drum-sequencer/record-drum-pads"
  caption="Play, Rec, then C1 four times and F♯1 a few. Rec again stops; Steps shows F♯1's hits as ordinary steps, each with how far off the grid it landed."
  label="The transport starts, Rec is pressed in the Drum Sequencer, the C1 pad is tapped four times and the F♯1 pad several times; Rec is pressed again, then Steps, which shows the recorded F♯1 steps with their offsets."
/>

## Generate

<Dot>8</Dot>**Generate** writes rhythms for the selected voice (in Voices or Steps):

- **Euclid** plays the voice's row as an even rhythm, live: **Hits** per bar, turned by **Rotate**,
  with a **Chance** per hit. **Mutate** moves hits and adds ghost notes anew every bar. Nothing is
  written while it plays.
- **Apply** writes the rhythm into the row and turns Euclid off.
- **Mutate** (the button) nudges the written row once, by the Mutate amount.

## Edit

<Dot>9</Dot>**Copy**, **Paste** and **Erase** act on the voice's row in Voices and Steps, and on the whole beat
in Beats: copy a beat, pick another, paste. **Undo** takes back the last edit.

## Real-time FX

Two ribbons bend the notes on their way out: **Beat roll**, **Stutter**, **Skip**, **Reverse**,
**Density**, **Velocity**, **Swing** or **Transpose**. Pick the effect from the menu above each
ribbon (the button with the arrow), then press and slide on the ribbon; let go and it falls back to
0. With <Dot>10</Dot>**Latch** on, the ribbon keeps its amount when you let go. Latch is the same in the module
and on the play surface.

## Mapping

There are two kinds of mapping, one per place.

**Axes and toggles (the module).** In the Studio's **Map** mode, the module's controls show map
badges like any module's:

- axes can drive **Swing**, **Human**, **Roll rate**, the **FX** ribbons' amounts and the Euclid
  knobs (**Hits**, **Rotate**, **Chance**, **Mutate**);
- toggles can flip **Roll**, **Beat roll**, **Euclid**, each ribbon's **Latch**, and each voice's **mute** (switch
  to **Mutes** to see the mute badges on the pads).

A control an axis or toggle drives is locked in the editor and follows it.

**MIDI hardware (the play surface).** In MIDI learn mode, every control of the play surface can be
learned: the pads, the pad functions, Roll, Bank B, Rec, Page, the four knobs and their key, Swing,
the FX menus, ribbons and Latch, and the Generate controls. A mapped pad plays at the note's
velocity and lets go with its note-off, so recording from MIDI pads keeps your dynamics. Buttons act
when pressed, knobs and ribbons follow the controller across their range, and an FX menu steps
through the effects as you turn.
