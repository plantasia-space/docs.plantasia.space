---
title: Analog synth
sidebar_position: 5
sidebar_custom_props:
  icon: Cable
---

The **Analog synth** is the deep synth: two complete sound paths in one voice, so a pad can sit on
one path and a pluck on the other, a low-pass beside a band-pass, or both filters in a row. Its second
oscillator also does **hard sync** (tearing leads), **ring modulation** (bells, gongs, robot voices)
and **AM**. It is a notes instrument: it sits at the head of a <Term id="world-dimension">World dimension</Term>, after any generator
and MIDI effects, and the notes you play (the keys, MIDI, the piano roll, a sequencer) sound through it.

It loads as the plainest sound there is: one saw through a wide-open filter. Osc 2 and the noise
are switched off, ready at their levels, so switching one on is heard at once.

<TryModule module="analog" set="o2On:on,o2Shape:pulse,o2Width:30,o2Detune:7,o2Level:90,o2Balance:100,noiseBalance:50,f1Cutoff:1200,f2Type:bp,f2Cutoff:900,lfo2Cutoff:1,attack:400,a2Attack:900,amp1Pan:-40,amp2Pan:40" source="chords">
<ModulePicture
  src="/img/orbiters/instruments/analog-synth.jpg"
  wide
  alt="The Analog synth set as a two-path pad: the Patch on the screen with both paths lit, Routing on Parallel, the four sources as a table, and the Filter 2 tab with its band-pass, its envelope and its knobs."
  dots={[[1, 9, 45], [2, 19.5, 14], [3, 27, 14], [4, 18.6, 38], [5, 23, 38], [6, 42, 38], [7, 46.5, 64], [8, 51, 64], [9, 56, 64], [10, 66, 14], [11, 62, 23], [12, 77, 45], [13, 66, 82]]}
/>
</TryModule>

## How it makes a sound

Three **sources**, Osc 1 (with its **sub**), Osc 2 and **noise**, each send what they make to
**Filter 1**, **Filter 2**, or both. Each filter goes into its own **amp**, with its own envelope and
pan, and both amps are heard. **Path 1** is Osc 1 → Filter 1 → Amp 1, moved by **LFO 1**; **path 2**
the same with the 2s.

At the defaults everything goes to Filter 1, so path 2 is silent because nothing feeds it, not
because it is switched off: move any source's **To filter** towards F2 and you hear it.

## The screen

<Dot>1</Dot>The **Patch**: the synth drawn as blocks on a bench. The three sources on the left, wired into the
two filters, each into its amp, both into the output. A wire is as strong as what it carries; a
block nothing reaches is dashed. Each source shows its wave, each filter where its cutoff is now. Osc
2's mode links the two oscillators: a tether for **Sync**, a ring for **Ring**, a wave for **AM**.
Under the bench, the two LFO dials, with dashed wires to what each moves.

The open tab's block is outlined, and **tapping a block opens its tab**: a filter opens its Filter tab,
an amp its Amp tab, the oscillators the Mod tab, an LFO dial its LFO tab, the output the Voice tab.
The big number is Filter 1's cutoff in kHz; the ladder at the right edge is the level now.

## Sources

<Dot>2</Dot>**Routing** sets every source's balance at once:

| Routing | What it sets |
|---|---|
| **Single** | everything into Filter 1 (the default) |
| **Parallel** | Osc 1 into Filter 1, Osc 2 into Filter 2, the noise half and half |
| **Split** | every source half into each filter |
| **Serial** | everything into Filter 1, then Filter 1 into Filter 2, with Amp 1 muted: both filters in a row |

It is a shortcut, not a setting of its own: change a balance by hand and it reads **Custom**.

<Dot>3</Dot>**Osc 2's mode**:

| Mode | What Osc 2 does |
|---|---|
| **Free** | plays on its own pitch |
| **Sync** | restarts every time Osc 1 starts a cycle: the pitch is Osc 1's, and **Sync** sweeps the tearing timbre |
| **Ring** | is multiplied by Osc 1: only the sum and difference of the two pitches are heard, neither of them. Two sines at an odd interval make a bell |
| **AM** | Osc 1 with sidebands: a beating, organ-like tone |

Ring and AM read Osc 1's wave even with Osc 1 switched off or at Level 0, so a bell can be Osc 2
alone.

**The table.** One row per source, every one in view:

| Column | What it does |
|---|---|
| <Dot>4</Dot>**On** (the hexagon) | Switches the source on and off; off, its row dims and keeps its settings. **S**, the sub, is Osc 1's and follows its switch. |
| <Dot>5</Dot>**Wave** | Sine, Saw or Pulse: tap to step through them. A change crossfades. |
| **Octave**, **Semi**, **Fine** | The oscillator's pitch: octaves, semitones and cents. A few cents between the two oscillators is the classic beating pair. |
| <Dot>6</Dot>**Level** | Its level in the mix. The mix only ever turns down: two sources at full share the room. |
| <Dot>7</Dot>**Tone** | A pulse's width (50 % is a square, narrower is thinner), or the noise's colour (dark to white). |
| <Dot>8</Dot>**Sync** | Under Sync, how far above its own pitch Osc 2 runs between restarts, in octaves. Put it on an axis for the sync sweep. |
| <Dot>9</Dot>**To filter** | Where the source goes: **F1**, **F2**, or both, read as "60 · 40". |

Every cell is a number box: drag it up and down, click to type, double-click to go back to the
default.

## The tabs

<Dot>10</Dot>Everything else is in eight tabs.

**Filter 1** and **Filter 2.** <Dot>11</Dot>**Type**: low-pass, band-pass, high-pass, notch, or **Vowel**, two
resonances at a vowel's formants, with **Vowel** (A, E, I, O, U) in Resonance's place; the cutoff
moves the vowel. **Slope**: 12 or 24 dB an octave. Filter 2's **Follow** puts its cutoff on Filter
1's, plus an **Offset**. <Dot>12</Dot>The envelope on top is the filter's own, and **Envelope** is how far it
moves the cutoff, up or down. <Dot>13</Dot>The knobs: **Cutoff**, **Resonance**, **Envelope**, **Drive**
(saturation into the filter), **Key** (the cutoff following the key), and on Filter 1 **F1 → F2**
(how much of Filter 1 also feeds Filter 2).

**Amp 1** and **Amp 2.** Each path's envelope, its **Level** and its **Pan**. Amp 1's envelope is the
one every note's loudness follows; Amp 2's is path 2's.

**Loop.** Every envelope can loop while a key is held. **AD-R** repeats the attack and decay, from the
sustain level back up; **ADR-R** repeats attack, decay and release down to silence. Short times make
a pulse or a trill; letting the key go always ends the note.

**Mod.** Each oscillator's **pitch envelope** (where its pitch starts on a strike, and how long it
takes to reach the key: a zap on Osc 2 under a steady Osc 1 is the classic use), and the **mod
wheel**: **Vibrato** (both oscillators), **Cutoff** (both filters) or **LFO** (both LFOs held back
until the wheel moves), with **Wheel** for how far.

**LFO 1** and **LFO 2.** Each moves its own path: **Pitch** (vibrato), **Width** (pulse-width
modulation), **Cutoff** and **Tremolo**. Synced to the transport (a note value or bars) or free in
Hz, six shapes. While Filter 2 follows Filter 1, it follows LFO 1 too.

**Voice.** **Unison** stacks 2 or 4 oscillator sets per note, detuned by **Spread**: thick, but each
set costs about an oscillator pair more per voice, and the tab says how much while it is on (use
fewer **Voices** or **Mono** with it). **Drift** puts each oscillator a little off on every strike
and lets it wander, so the two beat like an analog pair. **Glide**, **Velocity** (how much a note's
velocity moves both amps), **Env < Vel** (harder notes open the filters further), **Level**, and
**Poly · Mono**, **Retrig · Legato**.

## Starting points

Set these from the defaults to hear what the instrument can do:

| Sound | Sources | Filters | Also |
|---|---|---|---|
| **Sync lead** | Osc 2 on, Saw, Sync, Sync 1.4 oct, Level 80 % | Filter 1 at 3 kHz, Envelope +2 oct | Mono and Legato, Glide 50 ms |
| **Ring bell** | Osc 1 Sine at Level 0; Osc 2 on, Sine, Ring, Semi +6, Fine +14 ct | open | Amp 1 Decay 1.8 s, Sustain 0 %, Release 2 s |
| **Two-path pad** | Osc 2 on, Pulse at 30 %, Fine +7 ct; Routing Parallel | Filter 1 at 1.2 kHz; Filter 2 BP at 900 Hz, LFO 2 Cutoff 1 oct | Amp 1 Attack 400 ms, Amp 2 Attack 900 ms, pans L 40 and R 40 |
| **Serial acid** | Routing Serial | Filter 1 12 dB at 600 Hz, Resonance 60 %, Envelope +3 oct; Filter 2 HP at 150 Hz | Mono and Legato, Glide 60 ms |
| **Supersaw** | Osc 2 on, Fine +7 ct; Unison 4, Spread 25 ct | Filter 1 at 6 kHz | Voices 4, Amp 1 Release 600 ms |
| **Choir** | Osc 2 on, Pulse at 40 %, Level 80 % | Filter 1 Vowel at E, LFO 1 Cutoff 0.3 oct | Attack 300 ms, Drift 10 ct |
| **Loop pluck** | — | Filter 1 at 800 Hz, Envelope +3 oct, Loop AD-R (Attack 5 ms, Decay 180 ms) | a held note pulses |

## Mapping

In the Studio's **Map** mode, every number can be driven by an axis: a cutoff with its resonance (the
classic sweep), **Sync** under Sync (the sync scream), Osc 2's **Semi** or **Fine** under Ring (bell ↔
clang), Osc 2's **To filter** with **F1 → F2** (thin ↔ two paths), the envelopes' Decays (pluck ↔ pad),
**Vowel** under Vowel (talking). Toggles can switch each source **On** and off, flip **Follow**,
**Slope**, an LFO's **Sync**, **Mono** and **Legato**. Waves, modes, filter types, loops and Unison are
never on an axis: a preset carries them.

## In a room

The notes, both synced LFOs and Drift's offset on each strike are the same for every player in a
room. Three things are a timbre rather than a choice and can differ between players: the **noise**,
Drift's slow **wander**, and a free (unsynced) LFO over a long take.
