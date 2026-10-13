---
title: Hybrid drum synth
sidebar_position: 4
sidebar_custom_props:
  icon: Drum
---

The **Hybrid drum synth** is a drum kit made by synthesis: sixteen pads, each one a drum built from
three layers that are played, not sampled. It is a notes instrument: it sits at the head of a
<Term id="world-dimension">World dimension</Term>, usually after a **Drum sequencer**, and every pad
sits on the key that sequencer's voice plays, so a new sequencer in front plays the kit with no setup.

<TryModule module="hybridDrumSynth">
<ModulePicture
  src="/img/orbiters/instruments/hybrid-drum-synth.jpg"
  wide
  alt="The Hybrid drum synth with the kick selected: the kit screen with its sixteen pads, then Kit (Tune, Decay, Velocity, Level), Pad 01 with its type and choke menus and eight knobs, and Voices folded."
  dots={[[1, 18.3, 14], [2, 42.2, 42.2], [3, 51.4, 42.2], [4, 42.2, 71.9], [5, 51.4, 71.9], [6, 74.2, 14.7], [7, 94.6, 14.7], [8, 62.4, 43.4], [9, 71.6, 43.4], [10, 80.7, 43.4], [11, 89.9, 43.4], [12, 62.4, 73.1], [13, 71.6, 73.1], [14, 80.7, 73.1], [15, 89.9, 73.1], [16, 97.6, 26]]}
/>
</TryModule>

## Pads and types

Each pad has a **type**: what kind of drum it is.

| Type | What it is made of |
|---|---|
| **Kick** | a sine that drops from high to low as it strikes, over a short membrane, and a click |
| **Snare** | two tones, a ringing membrane and the wires' hiss |
| **Tom** | a sine with a short pitch drop over a ringing membrane |
| **Rim** | a high, short tone, a small wooden body and a click: a side stick |
| **Clap** | bursts of filtered air, four of them close together, then a short tail |
| **Hat** | six square waves at metallic ratios through a band-pass, with a high hiss |
| **Cymbal** | the hat's metal a semitone lower, with a shimmer of jingles and a long ring |
| **Shaker** | jingles and a swelling hiss: a tambourine, or maracas with the Body off |
| **Wood** | a wooden block's ring |
| **Bell** | a bell's ring, with its hum below the note |
| **Empty** | nothing: the pad is silent and its key plays nothing |

Every pad holds every layer, so you can change a pad's type at any time, even while the beat plays:
it glides to its new sound with no click and no reload.

## The kit screen

<Dot>1</Dot>The screen at the left of the panel is the kit: sixteen hexagons, each a line drawing of its pad's
instrument. The drawing follows the pad: a hi-hat opens once its Decay is long, toms and cymbals draw
smaller as you tune them up, a Shaker is a tambourine with its jingles on and a pair of maracas with
them off.

- **Tap** a pad to select it (its controls fill the **Pad** group) and hear it.
- A pad **lights up** while it sounds, as long as it rings: a crash glows for a while, a closed hat
  blinks.
- **Swap two pads:** press and hold a pad for a moment until it lifts, drag it onto another and let
  go. The two pads exchange their whole sound (type, every knob, choke); the keys stay where they
  are, so a beat that is playing hears it at once (the kick's steps now play the snare). It is one
  step to undo.

## Kit

Four knobs for the whole kit.

| Control | What it does |
|---|---|
| <Dot>2</Dot>**Tune** | Tunes every pad together, in semitones. |
| <Dot>3</Dot>**Decay** | Makes every pad ring shorter or longer: 100 % is each pad as set, below is tighter, above roomier. |
| <Dot>4</Dot>**Velocity** | How much a strike's velocity changes its level. At 0 % every strike is full. |
| <Dot>5</Dot>**Level** | The kit's output level. |

## Pad

The selected pad's controls. Its <Dot>6</Dot>**type** and its <Dot>7</Dot>**choke group** are the two menus beside the pad's
name.

**The middle of every knob is the type as designed.** A new pad, or one whose type you just changed,
sounds as its type was made: Tune at 0, Decay at ×1, Tone and Snap at 0, Body and Noise at 0 dB. Turn
a knob away from the middle to move the sound one way or the other.

| Control | What it does |
|---|---|
| <Dot>8</Dot>**Tune** | The pad's pitch, oscillator and body together, in semitones. |
| <Dot>9</Dot>**Decay** | How long the pad rings, as a multiple of its type's length (×0.125 … ×8). A longer ring is never louder. |
| <Dot>10</Dot>**Tone** | Darker or brighter: the strike, the body's high ring, the metal and the noise, all at once. It never changes the pitch. |
| <Dot>11</Dot>**Snap** | Softer or harder: how far the pitch falls at the strike and how loud the click is. Kick, Snare, Tom and Rim only. |
| <Dot>12</Dot>**Body** | The struck body (skin, wood, bell or jingles) against its type as designed; all the way down is off. |
| <Dot>13</Dot>**Noise** | The noise (a click, the wires, the air, the hiss) the same way. |
| <Dot>14</Dot>**Level** | The pad's level in the kit. |
| <Dot>15</Dot>**Pan** | Where the pad sits left to right. |

A knob that does nothing for the pad's type stays in its place, dimmed, and its tooltip says why
(a Clap has no body, a Tom no noise).

### Choke

Pads in the same **choke group** (1 to 4) cut each other: a strike silences, within a few
milliseconds, every other pad of its group still ringing. The default kit puts the closed and the open
hi-hat in group 1, so the closed hat cuts the open one as on a real kit.

## Voices

The <Dot>16</Dot>**Voices** group (folded) sets how many pads can ring at once, 1 to 16 (6 by default), shared by
all sixteen pads. A pad struck again rings on its own voice, struck again from where it is, so a roll
never clicks. When every voice is busy, the oldest ring makes way.

## Playing it

- **From a Drum sequencer:** each of its voices plays the pad on its note. Its **Gate** does nothing on
  this kit: every strike rings to its end.
- **From the keys, MIDI or the piano roll:** the pads sit on General MIDI's drum keys (the kick on C1),
  and every surface names them (Kick, Snare, … or the type's name once you change a pad's type). A key
  with no pad plays nothing.

## Try it

- **A beat with no setup.** Put a Drum sequencer in front of it and draw a kick on 1 and 3, a snare on 2 and 4 and closed hats on the eighths: every voice already plays its pad.
- **A deeper, longer kick.** Select the kick: Tune **−4 st**, Decay **×2**, Snap up a little for the click.
- **Open and close the hats with one move.** Map the closed hat's **Decay** to an axis: short at rest, ringing as the Planet moves away.
- **A tighter kit for a fast beat.** The kit's Decay at **60 %**: every pad rings shorter and keeps its own character.

## Mapping

In the Studio's **Map** mode every knob can follow an <Term id="axis">axis</Term>: the kit's Decay for a
tight-to-roomy kit, the kit's Tune, a kick's Snap and Decay for its punch, a snare's Body down and
Noise up on one axis (shell to wires), the hats' Decay to open them, the cymbals' Tone. A pad's type and
its choke group are choices, never on an axis.

## In a room

Every player hears the same pads struck on the same steps, and the same sound, except for the noise:
each player's noise is its own, so the hiss of a snare or a hat is never sample-identical between
players.
