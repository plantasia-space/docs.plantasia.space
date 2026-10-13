---
title: Interact
wrapperClassName: doc-wrapper-icon-interact
sidebar_position: 4
sidebar_custom_props:
  icon: Power
---

## Opening an Orbiter

Orbiters open from an **audio**: the Orbiter opens over it, embedded in the page or in a separate tab.

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/en/media/orbiters/06-use-open.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## Dimensions

Each Orbiter has up to three dimensions, **I**, **II** and **III**. Each one has its own modules and its
own mapping of X, Y and Z, so the same axes do different things in each. On a computer, the keys **1**,
**2** and **3** switch between them.

Transport, loop and volume are shared by the three. The axes, the Cosmic LFO and the sensors belong to
the dimension you are in.

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/en/media/orbiters/07-use-transport-jam.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## Transport and looping

Use the transport controls to:

- Play
- Pause
- Stop

Open the **Playback** panel to work with the waveform:

- Zoom in and out
- Seek to a position
- Set loop regions

Looping remains available across all panels.

### Loops

Set a loop three ways: **drag** a region on the waveform, pick a **loop size** (1 bar, 4 bars, …),
or mark **IN** and **OUT** points at the playhead.

A loop can be **switched off and keeps its markers**.


## Monitoring

The monitors show what is happening as you play: which controls each axis moves right now, the audio
that plays, the Entangled World you are in and the Orbiter itself.

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/en/media/orbiters/10-use-monitor-playback.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## Jamming mode (XYZ)

Jamming mode is the primary interaction mode.

- X and Y are controlled by movement across the screen
- Z is controlled via zoom gestures or dedicated controls

You can also use the knobs directly, or tilt a phone: see [Sensors](./sensors).

### Reset to equilibrium

- Double-click / double-tap a knob to reset one axis
- Double-click / double-tap the screen to reset X, Y, and Z together

Equilibrium usually represents a bypass or neutral state.

<LoopVideo
  src="https://herbarium.plantasia.space/docs/en/media/orbiters/interact/move-axes"
  caption="In the Studio: X moves the One Reverb's Amount and Y the Track player's Speed, and each module's Screen follows. A double-click on X takes it back to its equilibrium."
  label="With the transport playing, the X axis is dragged up and the One Reverb's Screen turns to a room; the Y axis is dragged up and down and the Track player's speed display follows; a double-click on X brings it and Amount back to 0."
/>

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/en/media/orbiters/09-use-level-num-keyboard.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## Playing notes

A Notes Orbiter is played from the <Term id="play-surface">play surface</Term>, in the **Playback** panel:

- **The piano roll** comes first: it plays the instrument of the dimension in focus.
- **A tab for each generator** in that dimension's chain: the Arpeggiator's keys, the Step sequencer's
  steps, the Drum sequencer's pads.
- **The <Term id="launch-grid">launch grid</Term>** picker, next to SYNC, makes starts and switches land
  on a bar line.

See [MIDI effects](/docs/orbiters/midi-effects) for the generators and [Sync](/docs/orbiters/sync) for
the launch grid.

## Cosmic LFO

Each axis (X, Y, Z) has an independent Cosmic LFO.

You can control:

- Depth (modulation amount)
- Waveform
- Frequency source

Some sources are manual, others depend on the Entangled World and its exoplanet data.

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/en/media/orbiters/08-use-cosmic-lfo.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

