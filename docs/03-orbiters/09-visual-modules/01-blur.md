---
title: Blur
sidebar_position: 1
sidebar_custom_props:
  icon: Wind
---

The **Blur** lets go of the space around a body. As the sound rings, the sky around the body smears
outward and the stars pull into streaks; as the sound dies, the sky comes back into focus. The body
itself stays sharp. It works on a <Term id="world-dimension">World dimension</Term>, a
<Term id="moon">Moon</Term> or the <Term id="star">Star</Term>, and blurs around the body it is on.

![The Blur on a World: the stars streak outward from the World, which stays sharp.](/img/orbiters/visual-modules/blur.jpg)

It is the visual of the reverbs: with **Auto visuals** on, adding a [Reverb or a One Reverb](/docs/orbiters/audio-effects/reverb)
adds a Blur to the same dimension. You can also add it alone with **Visual module +**. Either way it
is its own module: it follows the sound of its body, with or without a reverb.

:::tip[It follows the sound]

A Blur arrives listening to its own body, with **Sensitivity** at 100 %: it shows only as loud as that
sound, and nothing in silence. It rises quickly with the sound and lets go slowly, like a tail. Turn
Sensitivity down to keep some blur whatever plays.

:::

## Controls

| Control | What it does |
|---|---|
| **Amount** | How much the sky blurs. 100 % as it arrives; at 0 % it shows nothing. |
| **Room** | The size of the room. A small one smears a little even at full sound; a long one lets go completely. 50 % as it arrives. |
| **Reach** | How far out from the body the blur takes to build: low keeps it tight around the body, high spreads it across the sky. 10 … 60 %, 30 % as it arrives. |

Sound input, Sensitivity and While stopped are the same as on every
[visual module](/docs/orbiters/visual-modules).

## Good to know

- On a World that has a rim glow, the glow brightens with the Blur and returns to its own look when
  the Blur is at rest.
- At rest it costs nothing: the picture is drawn as if the module were not there.
- With a **Lo-fi** on the same Orbiter the two work on the same picture together.

## Mapping

Amount, Room and Reach can each be mapped to the dimension's axes: see [Edit](/docs/orbiters/edit).
Room on the same axis as a reverb's Decay makes the picture open with the tail.
