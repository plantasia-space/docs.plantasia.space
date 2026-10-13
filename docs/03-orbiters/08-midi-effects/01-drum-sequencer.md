---
title: Drum sequencer
sidebar_position: 1
sidebar_custom_props:
  icon: Grid3x3
---

The **Drum sequencer** plays drum patterns into an Orbiter's instrument. It works like a pad
controller: <Dot>1</Dot>16 pads (or 8) whose job changes with the <Dot>2</Dot>**pad function** you pick, a
<Dot>3</Dot>small screen with <Dot>4</Dot>four knobs, <Dot>5</Dot>two **real-time FX** ribbons, and up to 32 **beats**, each 1 to 8 bars long.

You meet it in two places, which always show the same state:

- **The module**, in the Studio's drawer, where you build the Orbiter. Its knobs and switches can
  be **mapped to the Orbiter's <Term id="axis">axes</Term> and toggles**.
- **The play surface**, on the stage while the Drum sequencer leads the chain, in the Studio and when
  the Orbiter is played. Its controls can be **mapped to MIDI hardware**.


<ModulePicture
  src="/img/orbiters/midi-effects/drum-sequencer.jpg"
  wide
  alt="The Drum sequencer in Sound, on an Analog drum synth: the real-time FX ribbons on the left, the pad function, pad options and Edit rows above the 16 pads, then the screen, its knobs and Generate on the right."
  dots={[[1, 66.6, 74.7], [2, 11.6, 20.7], [3, 83.6, 14.8], [4, 69.5, 44.6], [5, 3.4, 56.7], [6, 38.7, 28.5], [7, 52, 28.5], [8, 78, 76.5], [9, 11.6, 38.6], [10, 5.9, 97]]}
/>

## Pad functions

Pick what the pads do: **Beats** and **Mutes** work on the beat, **Sound**, **Steps** and **Tunings** on its notes. The buttons
around the pads follow the function: an action that would do nothing there is greyed out.

| Function | The pads… | Also available |
|---|---|---|
| **Beats** | pick the beat that plays | Beat roll, Bank B, Copy/Paste/Erase of the whole beat, Length |
| **Mutes** | mute or unmute each voice | Beat roll, Bank B, Unmute all |
| **Sound** | play each drum voice (bank A, or bank B with **Bank B**) and select it | Roll, Accent, Rec, Generate, Copy/Paste/Erase |
| **Steps** | set the selected voice's steps; hold a pad to edit that step on the knobs | Roll, Accent, Page, Generate, Copy/Paste/Erase of the voice's row |
| **Tunings** | play the selected voice higher or lower: the same sound at a different pitch on every pad | Roll, Accent, Rec |

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

## Naming beats

Every beat can have a **name**, up to 12 characters, so you remember what each one is. In **Beats**:

- on a touch screen, **press and hold** a pad;
- with a mouse, **double-click** it;
- from the keyboard, **Ctrl + R** (or **F2**) names the beat you are on.

Type the name and press **Enter** (**Esc** leaves it as it was). The pad shows the name with the beat's
number under it, and the status line names the beat that plays and the one that waits. A beat without
a name reads "Beat 7". Names are saved with the Drum sequencer: in its preset, in the Orbiter, and for
everyone in a room. Copy and Paste carry a beat's name; Erase keeps it.

## Tunings

Pick a sound in **Sound**, then open **Tunings**: every pad plays that same sound at another pitch. A
snare stays a snare, higher or lower. On a drum instrument (the Analog drum synth, the Hybrid drum
synth, a Sampler kit) the pad keeps its drum and only its pitch moves; on a synth the pads play
different notes.

<ModulePicture
  src="/img/orbiters/midi-effects/drum-sequencer-tunings.jpg"
  wide
  alt="Tunings with the snare selected and no scale set: the sixteen pads play the snare from F♯0 to A1, a semitone apart, with Base and Spread on the first two knobs."
  dots={[[1, 72.3, 44.6], [2, 79.8, 44.6]]}
/>

The pads follow the Orbiter's **key and scale**: each pad is one step of the scale away from the next.
With no scale set, a step is a semitone.

- <Dot>1</Dot>**Base** sets which step the middle pad plays. At 0 it is the sound's own pitch.
- <Dot>2</Dot>**Spread** sets how many steps lie between one pad and the next (1 to 3).

Each pad shows its step and the note it plays. A Sampler kit's sounds are pitched two octaves at most,
up or down. A sound that is only noise, like a clap, has no pitch to move and plays as it is.

## Shift

**Shift** flips what a tap does. Hold the **Shift** key, or use the **Shift** button: hold it for one
tap, or tap it to keep it on (it stays lit) until you tap it again. It is the same Shift on every
play surface of the Orbiter.

| Function | A tap… | With Shift |
|---|---|---|
| **Beats** | switches on the launch grid | switches at once |
| **Mutes** | mutes or unmutes on the launch grid | mutes or unmutes at once |
| **Sound** | plays the voice and selects it (Audition on) | selects it without sounding it |

With the launch grid off, a tap acts at once and Shift waits for the next bar instead. With Audition
off in Sound, Shift does the opposite too: the tap sounds the voice. In Steps and Tunings, Shift
rests.

The right end of the status line always says what a tap does now, for example "Tap launches in 1 bar",
and turns to the accent colour while Shift is on.

## Recording

Press <Dot>7</Dot>**Rec** to record what you play into the beat that is playing:

1. Pick **Sound** or **Tunings**.
2. Press **Rec**. The button lights; it records while the transport plays.
3. Play the pads, by tapping or from MIDI pads mapped to them.

Each hit lands on the step nearest to when you heard it, keeping how far off the grid it was, its
velocity (Accent records at full velocity), and in Tunings its pitch (it keeps that pitch if the key or scale changes later). The result is ordinary steps:
open **Steps** to edit them, or **Undo** to take a hit back. Press **Rec** again to stop.

<LoopVideo
  src="https://herbarium.plantasia.space/docs/en/media/orbiters/midi-effects/drum-sequencer/record-drum-pads"
  caption="Play, Rec, then C1 four times and F♯1 a few. Rec again stops; Steps shows F♯1's hits as ordinary steps, each with how far off the grid it landed."
  label="The transport starts, Rec is pressed in the Drum sequencer, the C1 pad is tapped four times and the F♯1 pad several times; Rec is pressed again, then Steps, which shows the recorded F♯1 steps with their offsets."
/>

## Generate

<Dot>8</Dot>**Generate** writes rhythms for the selected voice (in Sound or Steps):

- **Euclid** plays the voice's row as an even rhythm, live: **Hits** per bar, turned by **Rotate**,
  with a **Chance** per hit. **Mutate** moves hits and adds ghost notes anew every bar. Nothing is
  written while it plays.
- **Apply** writes the rhythm into the row and turns Euclid off.
- **Mutate** (the button) nudges the written row once, by the Mutate amount.

## Edit

<Dot>9</Dot>**Copy**, **Paste** and **Erase** act on the voice's row in Sound and Steps, and on the whole beat
in Beats: copy a beat, pick another, paste. **Undo** takes back the last edit.

## Real-time FX

Two ribbons bend the notes on their way out: **Beat roll**, **Stutter**, **Skip**, **Reverse**,
**Density**, **Velocity**, **Swing** or **Transpose**. Pick the effect from the menu above each
ribbon (the button with the arrow), then press and slide on the ribbon; let go and it falls back to
0. With <Dot>10</Dot>**Latch** on, the ribbon keeps its amount when you let go. Latch is the same in the module
and on the play surface.

## Its screen while you play

With the Drum sequencer's Panel set to **Screen** (the Visuals step in the Studio), its screen shows
in the play monitor while it leads the chain: the playing beat's voices across the bar, the playhead,
and the beat that plays and the one that waits, by name.

You can edit there too: **tap a cell** to set a hit, tap it again to clear it. It writes into the beat
that is playing, and the screen always offers a few rows to write in, even on an empty beat. For
velocity, chance, ratchet and offset, use **Steps**.

## Try it

- **A first beat.** Put the Drum sequencer in front of a drum instrument. In **Sound**, tap the kick; in **Steps**, tap pads 1, 5, 9 and 13. Go back to Sound, tap the snare, and set steps 5 and 13. Press Play.
- **Hats without drawing them.** Select the closed hat, open **Generate**, turn **Euclid** on and set **Hits** to 11: an even pattern plays at once. **Apply** writes it into the row.
- **A snare across the pads.** Tap the snare in **Sound**, then open **Tunings**: the sixteen pads play the same snare at sixteen pitches, in the Orbiter's key. Press **Rec** and play a fill.
- **A second beat for the chorus.** In **Beats**, **Copy** beat 1, tap pad 2 and **Paste**, then change it. While it plays, a tap on either pad switches on the next bar.

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
learned: the pads, the pad functions, Roll, Bank B, Rec, Shift, Page, the four knobs and their key, Swing,
the FX menus, ribbons and Latch, and the Generate controls. A mapped pad plays at the note's
velocity and lets go with its note-off, so recording from MIDI pads keeps your dynamics. Buttons act
when pressed, knobs and ribbons follow the controller across their range, and an FX menu steps
through the effects as you turn.

## In a room

Everyone in a room hears the same beat on the same steps. The beats and their names are shared by all the players.
