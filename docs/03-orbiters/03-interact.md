---
title: Interact
wrapperClassName: doc-wrapper-icon-interact
sidebar_position: 4
sidebar_custom_props:
  icon: Power
---

<IsoFigure name="orbiters/console" label="An Orbiter's console: a screen with the World, its ring and its Moon, three knobs in a row for X, Y and Z with a toggle in front of each, a rack with the instrument and three effects, and three keys for the dimensions.">
  Move over the console: across turns X, up and down turns Y.
</IsoFigure>

Think of what you play as the console of the Orbiter's craft:

| On the console | In an Orbiter |
|---|---|
| **The screen** | what you see while you play: the World turns as you turn the axes |
| **The three knobs** in a row | the axes X, Y and Z, from left to right. Each turns from −180° to 180° and rests at 0° |
| **The hexagon** in front of each knob | that axis's toggle |
| **The tall box with two reels**, first in the rack | the instrument |
| **The three boxes after it** | the effects, in the order the sound passes through them. The marker on each one follows the knob it is mapped to |
| **The three keys** | the dimensions I, II and III |

## Opening an Orbiter

Orbiters open from an **audio**: press the Orbiter's **On/Off** button on the audio, and the Orbiter opens over it, embedded in the page or in a separate tab. Press it again to close it.

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

Transport, loop and volume are shared by the three. The axes, the Cosmic LFO panel and the sensors
belong to the dimension you are in; the panel can show any LFO of the Orbiter's dimensions.

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

An Orbiter has **three LFOs per dimension**, slow waves that move things by themselves: **1cX, 1cY,
1cZ** live in dimension I, **2cX … 2cZ** in dimension II, **3cX … 3cZ** in dimension III. The "c" is for Cosmic. That name is the
LFO's label everywhere: in every menu and on the hexagons. A module's **LFO 1** or **LFO 2** is
something else: a slot of the module, where one of these LFOs is plugged in. Where both show, the slot
comes first: **LFO 1 · 1cX**.

Which LFOs exist follows the body with the most dimensions: the World, the Moon or the Star. If they all
have one dimension, the Orbiter has 1cX, 1cY and 1cZ; if the Moon has three while the World has one, it
has all nine. Every LFO menu lists only these. The axes and every module of the Orbiter share them: an
LFO set once moves everything that reads it, in step.

The Cosmic LFO panel shows the LFO each axis reads, one column per axis:

- **Depth**: how far the LFO swings. It belongs to the LFO, so it is the same for everything that
  reads it.
- **Offset**: the value it swings this axis around. At the middle it moves the axis up and down
  evenly; turn it down to move the lower values, up to move the upper ones. The ends of the axis clip
  the swing. Offset is the axis's own.
- **LFO**: which LFO this axis reads, listed by dimension (**Dimension I**, **II**, **III**). Each axis reads its own as it loads (X in dimension II reads
  2cX); pick another and the column shows that LFO's controls, so turning them turns it for
  everything that reads it. An axis set to the LFO of a dimension the Orbiter no longer has reads its
  own until that dimension is back, then the one you picked again; the menu's hint says so.
- **Shape**: one knob that runs from sine through triangle, ramp up, square and ramp down to random,
  blending each shape into the next; its label names the shape when it sits on one. Square and the
  ramps have soft 4 ms edges, so no shape clicks. The screen above it draws the wave you are making.
- **Rate in**: where the rate comes from: a frequency you set (**Hz**), the tempo (**Beats**: 8 bars
  down to 1/32, with dotted notes and triplets), or a value of the Entangled World's exoplanet (Cosmic
  LFO, Stellar Luminosity, Frequency, Mass). A world value only appears when the world carries it;
  with one selected, the two arrows move its rate down or up an octave (×½, ×2). **ƒ** reads the rate
  it runs at.
- **The hexagon**: switches this axis's LFO on and off. It reads the name of the LFO the axis reads:
  **1cX** for X in dimension I on its own LFO, **2cY** when it reads 2cY. An LFO only runs while something
  reading it is on.

The panel shows the World's dimensions. A dimension only the Moon or the Star has (dimension III of a
Moon of three, on a World of one) has no Cosmic LFO columns of its own: set its LFOs (3cX, 3cY, 3cZ) in the
LFO tab of a module that reads them, or pick one in an axis's **LFO** menu here and its controls show in
that column.

An axis moves its mapped sounds smoothly up to about 2 Hz. For a faster wobble on a sound, pick the
LFO in the module's own LFO input (below): there it runs inside the sound, smooth at any rate.

### An LFO in a module {#an-lfo-in-a-module}

A module never has an LFO of its own: an instrument's LFO tab, a Tremolo's or a Chorus's motion,
each **reads one of the Orbiter's LFOs**. Its tab shows:

- **The LFO menu**: which one it reads, of the Orbiter's dimensions. A module reads its dimension's X LFO
  as it loads (an instrument's second LFO, the Y one): a module on the Moon's dimension III reads 3cX, even
  on a World of one dimension. Pick the LFO an axis reads and the axis and the sound move together. A
  module set to the LFO of a dimension the Orbiter doesn't have (one taken out, or a module from a bigger
  Orbiter) reads its own dimension's until that dimension is there; the menu shows it as **1cX (3cY off)**.
- **The tab and its hexagon**: the tab names the module's slot, then the LFO plugged into it
  (**LFO 1 · 1cX**, **LFO 2 · 2cY**; **LFO · 1cX** in a module with one); the hexagon
  switches this module's connection on and off. The LFO keeps running for whatever else reads it.
- **Rate in, Rate, Shape and Depth**: the LFO's own, shown in place. Turning them turns that LFO
  everywhere: in the Cosmic LFO panel too.
- **Amount** (or the module's own Depth) and its extras (**Spread**, **Phase**, **Spin**): the
  module's own. Amount comes after the LFO's Depth.

The LFOs and which one each axis and module reads are saved with the Orbiter. Everyone in a
<Term id="room">room</Term> sees and hears the same LFOs on the same phase, and an effect's LFO never
jumps a sound at Play or a seek: it bends back onto the beat.

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/en/media/orbiters/08-use-cosmic-lfo.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

