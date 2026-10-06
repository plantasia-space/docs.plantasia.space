---
title: Your first Orbiter in 5 minutes
sidebar_label: Quickstart
description: Build an Orbiter from nothing — an instrument, one effect, mapped to an axis — and play it.
sidebar_position: 1.5
hide_table_of_contents: true
sidebar_custom_props:
  icon: Rocket
---

In five minutes you will build a small Audio Orbiter: a player for an audio you choose, one reverb, and an <Term id="axis">axis</Term> that turns the reverb up as you move it. Then you play it and release it. You need to be signed in to Plantasia Space.

<StepFlow
  groups={[
    { label: 'Release menu', steps: [{ n: 1, label: 'New Orbiter', href: '#start' }] },
    { label: 'Instrument step', steps: [
      { n: 2, label: 'Choose what it plays', href: '#instrument' },
      { n: 3, label: 'Add an effect', href: '#effect' },
      { n: 4, label: 'Map it to an axis', href: '#map' },
      { n: 5, label: 'Play it', href: '#play' },
    ] },
    { label: 'Visual step', steps: [{ n: 6, label: 'Choose its look', href: '#visual' }] },
    { label: 'Release step', steps: [{ n: 7, label: 'Release it', href: '#release' }] },
  ]}
/>

<Walkthrough>

## 1. Start a new Orbiter {#start}

Open **Release → New Orbiter**. The Orbiter Studio opens on its first step, **Instrument**: the Orbiter on its stage at the top, and the rack you build it in below. The other two steps, **Visual** and **Release**, come later.

![The Release menu with New Orbiter.](/img/orbiters/release/new.png)

## 2. Choose what it plays {#instrument}

The empty rack asks **What does this Orbiter play?** Pick **Audio**: the Orbiter plays an audio you choose.

![What does this Orbiter play? Audio or Notes.](/img/orbiters/quickstart/choose-audio-or-notes.jpg)

Press the empty **Instrument** slot and pick the **Track player**.

![The empty Instrument slot of World I, with the Track player and Granular in Modules that fit here.](/img/orbiters/quickstart/instrument-picker.jpg)

Press **Choose preview audio** in the Track player's header and pick an audio. It is only what you listen to while you build: the Orbiter can later play any audio.

:::note

**Notes** builds an Orbiter that plays notes, with a synth or the Sampler, instead. See [Instruments](/docs/orbiters/instruments) for the difference.

:::

## 3. Add one effect {#effect}

Press the **Audio effect** slot after the Track player. Under **One — one-knob modules**, pick **Reverb**: the One Reverb, a whole reverb on a single **Amount** knob. It goes in World I, after the player.

![The rack of World I: Mappings, the Track player, then the One Reverb.](/img/orbiters/quickstart/rack-with-effect.jpg)

It loads at Amount 0 %, so you hear no change yet: see [Every effect loads doing nothing](/docs/orbiters/audio-effects).

## 4. Map it to an axis {#map}

1. Press **Map** in the **Mappings** column. The **X** axis on the stage turns red: it is the axis you are mapping. Touch **Y** or **Z** on the stage to map one of those instead.
2. Every control in the rack now shows a **map** badge. Press the One Reverb's **Amount**.

The mapping appears in the column as **X · Amount**, with three values: **min** (−70 %), **<Term id="equilibrium">equil</Term>** (0 %) and **max** (70 %). With the axis at rest, Amount sits on its equilibrium, 0 %: no reverb. Moving X one way brings in the One Reverb's hall, the other way its plate.

![Map mode: the X axis in red on the stage, X · Amount in the Mappings column with min, equil and max, and the One Reverb's Amount mapped to X.](/img/orbiters/quickstart/map-to-x.jpg)

Press **Mapping…** to leave Map mode.

## 5. Play it {#play}

Press **Play** at the top of the stage, then drag the **X** axis up. The axis now carries the name of what it moves, **Amount**, and the One Reverb follows it: the sound goes from dry into a room, and further up into a hall. Drag it down for the plate.

![Playing: X at 50.6 has moved the One Reverb's Amount to 20 %, a Room.](/img/orbiters/quickstart/play-x.jpg)

## 6. Choose its look {#visual}

Open the **Visual** step. Everything already has a designed look, so you can keep it and move on, or change it:

- **Panel** (2D): the Orbiter's controls on screen. Pick a **Theme**, or set its own fonts and colours.
- **Ring** (3D): the ring around the Orbiter, its colour and its shape (**Amplitude**, **Radius**, **Tilt**).
- **Devices**: what each module shows on the panel, its **Screen**, or its **Mapping** while an axis moves it.

The Panel and the Ring start **Tied · all bodies**: one look for the whole Orbiter.

![The Visual step: the Panel's theme, fonts and colours, the Ring's colour and shape, and the Track player under Devices.](/img/orbiters/quickstart/visual-step.jpg)

## 7. Release it {#release}

Open the **Release** step: give the Orbiter a cover and an **Orbiter Name**, choose who can see it, and press **Release Orbiter**. Until then, your work is saved as a draft by itself. See [Release](/docs/orbiters/release) and [Edit](/docs/orbiters/edit).

</Walkthrough>

## Next

- **More instruments**: the [Sampler](/docs/orbiters/instruments/sampler), or a Notes Orbiter with [up to three instruments](/docs/orbiters/instruments/multiple-midi-instruments).
- **More effects**: where an effect can go, a World dimension, the Star or a Moon, in [Audio effects](/docs/orbiters/audio-effects).
- **More ways to play**: [Sync](/docs/orbiters/sync) several Orbiters on one tempo, or tilt a phone with [Sensors](/docs/orbiters/sensors).
