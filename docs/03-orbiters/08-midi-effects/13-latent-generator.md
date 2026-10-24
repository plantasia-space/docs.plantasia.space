---
title: Latent generator
sidebar_position: 1.8
sidebar_custom_props:
  icon: Sparkles
---

The **Latent Generator** plays loops made by small trained models: a drum groove or a melody, two
bars long. Each model has learned a space of loops, and the Orbiter's **X**, **Y** and **Z** axes move a
point through it, so leaning the Planet morphs the loop: busier, sparser, a shuffle, a leap. The same
spot always plays the same loop, so a gesture you liked can be found again.

It is a **generator**: it leads an Orbiter's chain, before the MIDI effects and the instrument, and a
dimension has at most one. It plays while the transport runs. When a loop is worth keeping, send it
**To piano roll** and edit it by hand.

## The model

One menu lists every model, under what it makes:

| Kind | Styles |
|---|---|
| **Percussion** | **Groove** (rock, latin, funk and jazz feels from real drummers) · **House** (four-on-the-floor house and techno) |
| **Melody** | **Bach** (lines in the style of J. S. Bach) |

New styles appear in the menu as they are published. Changing the model keeps the point where it is
and plays the new model's loop from the next step. Percussion plays the General MIDI drum keys (kick,
snare, hats, toms, crash, ride); each lane's key can be changed under **Lanes** to match another kit.

The first time a model plays on a device it is downloaded (a few hundred kB, plus once what runs the
models); after that it plays offline too. Until then the screen says **Loading model**.

## Space

| Control | What it does |
|---|---|
| **X**, **Y**, **Z** | Where the point is: 0 % is the model's most typical loop, ±100 % its edges. Map them to the axes, drag the crosshair on the screen, or the pad on the play surface (Z is the strip under it). |

## Take and shape

| Control | What it does |
|---|---|
| **Temperature** | How freely the loop is drawn. **50 %** is the model's own. Lower plays its most likely loop (percussion straight on the grid at 0 %); higher is looser and more surprising (percussion draws extra hits and their feel). |
| **Variation** | Another take of the same spot: other draws of the same loop (percussion: with Temperature above 50 %). |
| **Length** | How much of the two bars plays, round and round: 1 beat, 2 beats, 1 bar or both bars. |
| **Rate** | How long a step of the loop is: **1/16** as made, **1/8** at half speed. Or [another dimension's hits](./14-another-dimension.md): the loop's next note on each hit. |
| **Density** | Percussion: more hits up, only the surest down. 0 % plays the model's own hits. |
| **Accent** | Melody: how much the notes follow a drummer's accents. 0 % plays every note at one velocity. |

A melody follows the Orbiter's key and scale (**Follow**, on as it loads): the model plays in major or
minor to match, and a pentatonic Orbiter gets a pentatonic line. Switch Follow off to pick a root and
scale of its own; **Octave** moves the line by octaves.

## Spots

16 pads that keep places in the space, like a sequencer's patterns: tap **Store**, then a pad (or
Ctrl-click a pad) to keep where the point is; tap a stored pad to go back there. Spots are part of the
performance, saved with play snapshots.

## To piano roll

**To piano roll** writes the loop playing now into the dimension's piano roll (it replaces the clip:
percussion as notes on the drum keys) and powers the generator off, so the piano roll plays the same
notes, ready to edit. Power the generator on again to go back to the live loop.

## Where the models come from

Every model learned from music that can be shared:

- **Groove** and **House**: the Groove MIDI Dataset by Jon Gillick, Adam Roberts, Jesse Engel, Mark
  Rubin and Peter Barhoum, Google Magenta (2019), [CC BY 4.0](https://magenta.tensorflow.org/datasets/groove).
  House also learned from Plantasia Space's own loops.
- **Bach**: editions from the [Mutopia Project](https://www.mutopiaproject.org), public domain and CC BY
  3.0. The pieces under CC BY 3.0, with their typesetters:
  - Brandenburg Concerto No. 1 (First Movement, Allegro), BWV 1046, typeset by Ben Stewart
    ([piece 1136](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1136)).
  - A piece by J. S. Bach typeset by Hermógenes Hebert Pereira Oliveira
    ([piece 1902](https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1902)).

The credits live on this page; the model menu lists the models only.
