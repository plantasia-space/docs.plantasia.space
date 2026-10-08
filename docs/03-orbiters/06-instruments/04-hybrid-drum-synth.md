---
title: Hybrid Drum Synth
sidebar_position: 4
sidebar_custom_props:
  icon: Drum
---

The **Hybrid Drum Synth** is a drum kit made by synthesis: sixteen pads, each one a drum built from
three layers that are played, not sampled. It is a notes instrument: it sits at the head of a
<Term id="world-dimension">World dimension</Term>, usually after a **Drum Sequencer**, and every pad
sits on the key that sequencer's voice plays, so a new sequencer in front plays the kit with no setup.

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

The screen at the left of the panel is the kit: sixteen hexagons, each a line drawing of its pad's
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
| **Tune** | Tunes every pad together, in semitones. |
| **Decay** | Makes every pad ring shorter or longer: 100 % is each pad as set, below is tighter, above roomier. |
| **Velocity** | How much a strike's velocity changes its level. At 0 % every strike is full. |
| **Level** | The kit's output level. |

## Pad

The selected pad's controls. Its **type** and its **choke group** are the two menus beside the pad's
name.

**The middle of every knob is the type as designed.** A new pad, or one whose type you just changed,
sounds as its type was made: Tune at 0, Decay at ×1, Tone and Snap at 0, Body and Noise at 0 dB. Turn
a knob away from the middle to move the sound one way or the other.

| Control | What it does |
|---|---|
| **Tune** | The pad's pitch, oscillator and body together, in semitones. |
| **Decay** | How long the pad rings, as a multiple of its type's length (×0.125 … ×8). A longer ring is never louder. |
| **Tone** | Darker or brighter: the strike, the body's high ring, the metal and the noise, all at once. It never changes the pitch. |
| **Snap** | Softer or harder: how far the pitch falls at the strike and how loud the click is. Kick, Snare, Tom and Rim only. |
| **Body** | The struck body (skin, wood, bell or jingles) against its type as designed; all the way down is off. |
| **Noise** | The noise (a click, the wires, the air, the hiss) the same way. |
| **Level** | The pad's level in the kit. |
| **Pan** | Where the pad sits left to right. |

A knob that does nothing for the pad's type stays in its place, dimmed, and its tooltip says why
(a Clap has no body, a Tom no noise).

### Choke

Pads in the same **choke group** (1 to 4) cut each other: a strike silences, within a few
milliseconds, every other pad of its group still ringing. The default kit puts the closed and the open
hi-hat in group 1, so the closed hat cuts the open one as on a real kit.

## Voices

The **Voices** group (folded) sets how many pads can ring at once, 1 to 16 (8 by default), shared by
all sixteen pads. A pad struck again rings on its own voice, struck again from where it is, so a roll
never clicks. When every voice is busy, the oldest ring makes way.

## Playing it

- **From a Drum Sequencer:** each of its voices plays the pad on its note. Its **Gate** does nothing on
  this kit: every strike rings to its end.
- **From the keys, MIDI or the piano roll:** the pads sit on General MIDI's drum keys (the kick on C1),
  and every surface names them (Kick, Snare, … or the type's name once you change a pad's type). A key
  with no pad plays nothing.

## Mapping

In the Studio's **Map** mode every knob can follow an <Term id="axis">axis</Term>: the kit's Decay for a
tight-to-roomy kit, the kit's Tune, a kick's Snap and Decay for its punch, a snare's Body down and
Noise up on one axis (shell to wires), the hats' Decay to open them, the cymbals' Tone. A pad's type and
its choke group are choices, never on an axis.

## In a room

Every player hears the same pads struck on the same steps, and the same sound, except for the noise:
each player's noise is its own, so the hiss of a snare or a hat is never sample-identical between
players.
