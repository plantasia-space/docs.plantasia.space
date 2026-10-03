---
title: Three instruments
sidebar_position: 8
sidebar_custom_props:
  icon: Layers
---

One Orbiter can play like a small band: a **track** in World **I**, and up to two **notes
instruments** in World **II** and **III**, such as a bass and a lead on the **Subtractive synth
(Sheaf)**. Each one has its own chain of modules, its own play surface and its own MIDI channel.

## Build it

1. In the Studio's **Instrument** step, give World **I** its instrument. For a track, choose
   **Audio** and add the **Track player** (or **Granular**).
2. Open the **Dimensions** tab and switch on **II**. Dimensions switch on in order: II before III.
3. Select **World II** and add a notes instrument, such as **Sheaf**. Add a generator or MIDI
   effects in front of it if you like, such as the **Arpeggiator** or **Ephemeris**.
4. Switch on **III** and build its chain the same way.

Only World **I** plays the track. In II and III the picker shows the Track player and Granular
greyed out, with **Plays the track: World I only**.

## Each instrument in its own place

A World dimension that holds an instrument always runs **beside** the others, on the first stage of
the wiring. So the three play side by side, each through its own effects only: the bass in II is
never heard through III's effects, and the track never goes through a synth's chain. The
**Dimensions** tab shows this wiring.

A dimension you switch off costs nothing: its instrument is not even loaded.

## Play each one

- **Surface:** the play surface follows the dimension in focus. Focus **II** and you play its
  instrument: the piano roll first, then a tab for each generator in its chain (the Arpeggiator's
  keys, Ephemeris's steps, the Drum Sequencer's pads).
- **MIDI:** each dimension has its own **Input** and **Channel**, in the MIDI mapping header. With
  **All Ins** and **All Channels** (the default), a dimension listens while it has the focus. Set a
  channel instead to play all three at once from one controller: for example **Ch. 1** for I,
  **Ch. 2** for II and **Ch. 3** for III.

## Keep the three as one preset

Presets work at three levels: a **module** preset keeps one module, a **body** preset keeps a whole
body with its dimensions, and a **rack** preset keeps every body.

To keep the three instruments together, save a **World** body preset: in the Studio header, open
**More** (⋯) → **Body presets…**, name it, and press **Save current**. Loading it brings back all
three chains, which dimensions are on, and their wiring.
