---
title: Orbiters for DAW users
sidebar_label: For DAW users
description: "If you know a DAW: the World, the Moon, the Star and their dimensions as tracks, return tracks and the main bus."
sidebar_position: 1.7
sidebar_custom_props:
  icon: SlidersVertical
---

If you have made music in a DAW, an Orbiter's parts map onto things you already know. The names are the Orbiter's own; this page is the translation.

## The bodies are groups of tracks

An Orbiter has three bodies, each a group of up to three tracks: its dimensions **I**, **II** and **III**.

| In an Orbiter | In a DAW |
|---|---|
| **<Term id="world-dimension">World</Term>** | your tracks: where the sound is made |
| a **World dimension** | one of those tracks |
| **<Term id="moon">Moon</Term>** | return tracks: the effects the World sends to |
| a **Moon dimension** | one return track, fed by a send from each World dimension |
| **<Term id="star">Star</Term>** | the main bus: where everything meets before you hear it |
| a **Star dimension** | processing on the main bus, after its mixer |
| the **Main mix**, in Star I | the main bus's mixer: a level, a Mute and a Solo for the World and for the Moon |
| a **[Channel](/docs/orbiters/audio-effects/channel)** | a track's fader, Solo, Mute and sends |

## The World: an audio track, or MIDI tracks

What World I plays decides which kind of Orbiter it is.

- **Audio Orbiter**: World I is the audio track; it plays the audio you choose. II and III take what I plays and process it, one after another or side by side, like buses after it.
- **Notes Orbiter**: each World dimension is like a MIDI track. It can play an instrument from its own notes, or process the dimension before it.

## The Moon: sends and returns

Each World dimension's Channel has a send to each Moon dimension, taken **Pre** or **Post** its Level, as a DAW send is. The Moon runs its effects and returns only the effect, so an effect on a Moon starts at **Dry/wet 100 %**. A reverb or a delay the whole Orbiter shares lives there. See [Audio effects](/docs/orbiters/audio-effects) for where each effect fits.

## The Star: the main bus

The World and the Moon's return meet in the Star's **Main mix**. The Star's own effects play over everything after it, like inserts on the main bus.

## Each dimension is a rack with three macros

Think of each dimension as a rack whose three macros are always there: its <Term id="axis">axes</Term>, **X**, **Y** and **Z**. Each turns every control mapped to it at once, and you play them by moving: on screen, with the keys, or by tilting a phone. Every dimension maps its three its own way, so switching to another dimension changes what X, Y and Z move.

## The Cosmic LFO: three per dimension

The Cosmic LFO's slow waves come in threes, one set per dimension: **1cX**, **1cY** and **1cZ** for dimension I, up to **3cX**, **3cY** and **3cZ** for III. For now they belong to the World, and the axes and the modules of the whole Orbiter share them, so one wave can move things in every track.

[Interact](/docs/orbiters/interact) shows how to play all of this.
