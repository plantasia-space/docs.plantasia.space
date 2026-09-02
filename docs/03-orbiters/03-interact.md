---
title: Interact
wrapperClassName: doc-wrapper-icon-interact
sidebar_position: 4
sidebar_custom_props:
  icon: Power
---

## Opening an Orbiter

Orbiters are accessed through **Audios**.

An Orbiter can open embedded in the page or in a separate tab, depending on context.

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/en/media/orbiters/06-use-open.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## Start with dimensions

Each Orbiter contains **three dimensions**.

Dimensions are different sound-transformation setups designed by the Orbiter creator.

The same **X, Y, Z** controls affect different processes in each dimension.

On desktop, dimensions can usually be switched using **1 / 2 / 3**.

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

- The size presets loop forward from the loop you're inside — or **from the playhead** when the
  loop is off or you're outside it.
- **IN and OUT are independent.** With a loop already set, marking a new IN moves the loop right
  away, keeping the old OUT. An IN past the current OUT clears the OUT — mark a new one when you're
  ready. An OUT before the IN is ignored.
- A loop can be **switched off while keeping its markers** — they sit inert until you enable it
  again.


## Monitoring

Use the monitors to understand what is happening in real time:

- Engine monitor (active parameters)
- Audio information
- Entangled World context
- Orbiter identity

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

You can also use the knobs directly, or tilt a phone — see [Sensors](./sensors).

### Reset to equilibrium

- Double-click / double-tap a knob to reset one axis
- Double-click / double-tap the screen to reset X, Y, and Z together

Equilibrium usually represents a bypass or neutral state.

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/en/media/orbiters/09-use-level-num-keyboard.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

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



## Global vs dimension-specific controls

Some controls are global across dimensions, such as:

- Transport
- Loop
- Volume

Most performance controls are dimension-specific and change when switching dimensions.
