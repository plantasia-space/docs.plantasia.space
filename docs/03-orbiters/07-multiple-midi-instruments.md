---
title: Multiple MIDI instruments
sidebar_position: 8
sidebar_custom_props:
  icon: Layers
---

What World **I** plays decides what the Orbiter is:

- **Audio:** World I plays the audio you choose, on the **Track player** or **Granular**. II and
  III shape that sound with effects. An Audio Orbiter has one instrument.
- **Notes:** World I holds a notes instrument, such as the **Subtractive synth (Sheaf)**. II and III
  can each hold one more, so the Orbiter plays **up to three** notes instruments, like a small band:
  a bass and a lead, or a bass, a pad and a lead.

The rest of this page is about Notes Orbiters.

## Add a second or third instrument

1. In the Studio's **Instrument** step, give World **I** its notes instrument.
2. Open the **Dimensions** tab and switch on **II**. Dimensions switch on in order: II before III.
3. Select **World II** and add a notes instrument. Add a generator or MIDI effects in front of it if
   you like, such as the **Arpeggiator** or **Ephemeris**.
4. For a third, switch on **III** and build its chain the same way.

Each instrument has its own chain of modules. Two instruments are as complete an Orbiter as three.

## Each instrument in its own place

A World dimension that holds an instrument always runs **beside** the others, on the first stage of
the wiring. So the instruments play side by side, each through its own effects only: the bass in II
is never heard through III's effects. The **Dimensions** tab shows this wiring.

A dimension you switch off costs nothing: its instrument is not even loaded.

## Play each one

- **Surface:** the play surface follows the dimension in focus. Focus **II** and you play its
  instrument: the piano roll first, then a tab for each generator in its chain (the Arpeggiator's
  keys, Ephemeris's steps, the Drum Sequencer's pads).
- **MIDI:** each dimension has its own **Input** and **Channel**, in the MIDI mapping header. With
  **All Ins** and **All Channels** (the default), a dimension listens while it has the focus. Set a
  channel instead to play them all at once from one controller: for example **Ch. 1** for I and
  **Ch. 2** for II.

## Switching an Orbiter to Audio

If you replace World I's notes instrument with the Track player or Granular, the Orbiter becomes
Audio. The Studio asks first and names what goes: the instruments of II and III and the modules in
front of them. Their effects stay. **Undo** brings everything back.

## Keep them together as one preset

Presets work at three levels: a **module** preset keeps one module, a **body** preset keeps a whole
body with its dimensions, and a **rack** preset keeps every body.

To keep your instruments together, save a **World** body preset: in the Studio header, open
**More** (⋯) → **Body presets…**, name it, and press **Save current**. Loading it brings back every
chain, which dimensions are on, and their wiring.
