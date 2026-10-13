---
title: Channel
sidebar_position: 30
sidebar_custom_props:
  icon: SlidersVertical
---

Every <Term id="world-dimension">World dimension</Term> and every <Term id="moon">Moon</Term> dimension
ends with a **Channel**: its level, its solo, and where its sound goes next. It is always there, always
last in the rack: you can't remove it, move it or switch it off. Its controls are also on each card of
the Dimensions tab, so you can mix without opening the rack.

The Channel has two faces, one for each body:

- the **World channel**, on a World dimension: Level, Solo, and a send to each Moon dimension;
- the **Moon channel**, on a Moon dimension: Level, Pan and Solo.

The <Term id="star">Star</Term> has no Channel: its **Main mix** brings the World and the Moon together
(see below).

:::tip[Loads doing nothing]

A Channel loads at Level 0 dB, Pan centred, Solo off and every send Off: the dimension sounds as it
did, and a new Moon is silent until a send is turned up.

:::

## World channel

<ModulePicture
  src="/img/orbiters/audio-effects/world-channel.jpg"
  alt="The World channel of World dimension I as it loads: its signal-flow screen, then Level, Pre · Post, Solo and the send to Moon I."
  dots={[[1, 59.9, 35.5], [2, 53.6, 69.7], [3, 53.1, 61.5], [4, 85.8, 35.5], [5, 22.8, 14]]}
/>

| Control | What it does |
|---|---|
| <Dot>1</Dot>**Level** | The dimension's output, **−∞ … +6 dB**: into the next World dimension when they run in series, into the World when it is the last. At the bottom it is silent. |
| <Dot>2</Dot>**S** (Solo) | Plays only this dimension, and the dimensions that feed it, with their sends. Several solos add up; every dimension soloed sounds as none soloed. The Moon keeps returning. Saved with the Orbiter, and a toggle can flip it. |
| <Dot>3</Dot>**Pre · Post** | Where the sends are taken: **Post** (as it loads) after Level, so Level turns the sends down too; **Pre** before Level, so you can turn the dimension down and the Moon keeps ringing. Shown when there is a Moon. |
| <Dot>4</Dot>**Send Moon I · II · III** | How much of this dimension goes to each Moon dimension that is on, **Off … +6 dB**. A send goes straight into its Moon dimension, wherever it sits in the Moon's chain. Turned to Off, nothing more goes in and what the Moon holds rings out. |

## Moon channel

<ModulePicture
  src="/img/orbiters/audio-effects/moon-channel.jpg"
  alt="The Moon channel of Moon dimension I as it loads: its signal-flow screen, then Level, Pan and Solo."
  dots={[[1, 82.5, 33.1], [2, 82.5, 72.1], [3, 74.8, 95.7], [4, 32.5, 14]]}
/>

| Control | What it does |
|---|---|
| <Dot>1</Dot>**Level** | The Moon dimension's return, **−∞ … +6 dB**: into the next Moon dimension in series, into the Moon's return when it is the last. Use it to balance a reverb against a delay on two Moon dimensions side by side. |
| <Dot>2</Dot>**Pan** | Where the return sits, **L 50 … C … R 50**: an echo on the left, a reverb in the middle. In series, the Moon dimensions after it hear it panned. |
| <Dot>3</Dot>**S** (Solo) | Returns only this Moon dimension, and the ones that feed it. The dry World keeps playing: a Moon solo never mutes the World, and a World solo never mutes the Moon. |

Each Moon dimension hears **its own sends whole**: dimensions side by side don't share them, so their
Levels decide the balance.

## The Main mix

The Star's inputs, at the head of Star I: where the World and the Moon meet, before the Star's own
effects (whatever its dimensions and their wiring).

| Control | What it does |
|---|---|
| **World** | The level of all the World's dimensions together, **−∞ … +6 dB**, 0 dB as it loads. |
| **Moon** | The level of all the Moon's dimensions together (its return), **−∞ … +6 dB**, −3 dB as it loads. |

Its screen draws the World and the Moon coming in side by side, each through its level, meeting at Σ
and going on to the Star. For a balance on the whole mix, add a
[Utility](/docs/orbiters/audio-effects/utility) to the Star: its Balance leans the sound to one side.

## The screen

The screen (<Dot>5</Dot> on the World channel, <Dot>4</Dot> on the Moon channel) draws **the signal flow, top to bottom**, each circle level with its control: **In → Level → Solo → Out**,
with **Pan** after Level on a Moon. A circle lights up like a small sun while it passes sound, its rays
as long as its level. On a World dimension the sends branch off at **Pre** (above Level) or **Post**
(under it), one circle per Moon dimension that is on.

## Try it

- **Balance two dimensions.** Leave the louder one at **0 dB** and bring the other's **Level** down until they sit together. Do it on the cards of the Dimensions tab, without opening a rack.
- **Send one dimension to a reverb.** Put a Reverb on Moon I, then turn **Send Moon I** up on the World dimension you want in the space: start at **−12 dB**. The other dimensions stay dry.
- **A tail that outlives the sound.** Set the sends to **Pre** and map the World channel's **Level** to an axis: the dimension fades out and the Moon keeps ringing.
- **An echo on the left, a reverb in the middle.** Two Moon dimensions side by side: **Pan** the delay's channel to **L 30** and leave the reverb's on **C**.

## Mapping

Level, Pan and every send can be mapped to the Orbiter's axes, and Solo and Pre/Post to its toggles:
see [Edit](/docs/orbiters/edit). Level rests on 0 dB (−24 dB one way, +6 dB the other), a send on
−24 dB (Off / 0 dB), Pan on centre (L 50 / R 50). The Main mix's two levels can be mapped to the
Star's axes.
