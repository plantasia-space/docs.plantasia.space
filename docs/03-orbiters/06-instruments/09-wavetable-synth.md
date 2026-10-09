---
title: Wavetable synth
sidebar_position: 9
sidebar_custom_props:
  icon: AudioWaveform
---

The **Wavetable synth** is the synth designed for movement: a timbre that travels while the note
plays. Pads that breathe, basses that growl open, leads that talk, glassy keys. It is a notes
instrument: it sits at the head of a <Term id="world-dimension">World dimension</Term>, after any
generator and MIDI effects, and the notes you play (the keys, MIDI, the piano roll, a sequencer)
sound through it.

It loads as the plainest sound there is, a pure sine at the key: Osc 2 and the sub are off, the
filter is open and nothing in the matrix moves anything. Everything else is yours to bring in.

<TryModule module="wavetable" set="osc2On:on,table1:vowels,table2:choir,pos2:40,detune2:7,gain2:70,cutoff:6000,m_lfo1_pos1:60,l1Rate:3,attack:600" source="chords">
<ModulePicture
  src="/img/orbiters/instruments/wavetable-synth.jpg"
  wide
  alt="The Wavetable synth set as a vowel pad: Rings on the screen, Osc 1 on Vowels and Osc 2 on Choir with their rows of numbers, the low-pass filter at 6 kHz, the Amp envelope, and the folded Matrix and Voice columns."
/>
</TryModule>

## How it makes a sound

Each oscillator reads a **wavetable**: a row of eight single-cycle waves, from the table's tamest
(always first) to its wildest. **Position** says where in the row it reads; between two waves it
morphs smoothly from one to the next. Moving Position while a note plays is the whole idea: it is the
first knob to put on an <Term id="axis">axis</Term>.

Two oscillators, each with its own table, Position and **effect**, and a sine **sub** under them, go
through one filter and the amp. Two envelopes, two LFOs, the key, velocity, the mod wheel and a
random value per note can move almost anything through the **matrix**.

## The screen

The screen is a square at the left of the panel, the drawer's full height. The glyphs in its top-right
corner pick one of two pictures:

- **Rings** (the first): each table as growth rings, its first wave innermost. Osc 1 is the left
  half, drawn in the accent, Osc 2 the right half. The ring being played grows outward with Position
  and breathes with the note; the sub is the heartwood in the middle.
- **Terrain**: each table as a receding stack of its eight waves, Osc 1 above, Osc 2 below, the wave
  being played riding through it. The rail on each stack's left shows its Position: tap a step of the
  rail to jump to that wave.

The big number is Position 1, in %. A faint bar beside a Position shows how far the matrix can move
it. The readouts name each oscillator's table and Position, or say it is off.

## Oscillators

- **Tables.** The two menus in the title are Osc 1's and Osc 2's tables, sixteen in four kinds:

| Kind | Tables |
|---|---|
| **Basic** | **Sine → Saw**, **Saw → Square**, **Pulse** (a square narrowing to a needle), **Triangle → Saw** |
| **Spectral** | **Resonant** (the classic formant sweep), **Comb**, **Metal** (glassy, bell-like), **Phase** (one spectrum, a shape that moves) |
| **Vocal** | **Vowels** (ah → oo), **Choir**, **Throat**, **Whistle** |
| **Keys** | **Drawbars** (organ registrations), **E-piano**, **Clav**, **Glass** |

- **Effects.** The line under the title holds each oscillator's effect. Its amount is the knob
  captioned with the effect's name (**FM 1**, **Warp 2** …); at 0 it does nothing.
  - **FM**: the other oscillator modulates this one. Osc 2's **Semi** is the FM ratio. Osc 2 keeps
    feeding Osc 1's FM even while it is switched off, so it can be a pure modulator.
  - **Sync**: the wave is read faster and restarted every cycle: the tearing sync sweep.
  - **Warp**: the first part of the cycle is squeezed and the rest stretched, a pulse width for any
    wave.
  - **Fold**: the wave is folded back on itself, brighter and buzzier as the amount rises.

  A new table or effect lands on the next note, so a held note never jumps.

- **The table of numbers.** One row each for **1**, **2** and **Sub**: the hexagon switches it on
  and off (its settings are kept), then **Detune** (cents), **Semi** (semitones against the key) and
  **Gain**. The sub's **Octave** (one or two under the key) sits in the Semi column. Switching Osc 2
  or the sub on is heard at once: their gains start at 100 % and 60 %.
- **The knobs** on the bottom line: **Position 1**, Osc 1's effect, **Position 2**, Osc 2's effect.

## Filter

One filter with four types, the glyphs in its title: **low-pass**, **band-pass**, **high-pass** and
**notch**, 12 dB an octave. Changing the type glides, without a click. **Cutoff** is over
**Resonance**; resonance rings at the cutoff but never whistles on its own.

## Mod sources

Five tabs, one graph size on every tab, so nothing jumps when you switch:

- **Amp**: the envelope every note goes through, with **Velocity** (how much a note's velocity moves
  its level; at 0 every note is full) and **Level**.
- **Filter**: the filter's own envelope, with **Envelope** (how far it moves the cutoff, in octaves,
  up or down) and **Key** (how much the cutoff follows the key).
- **Mod**: a third envelope with nothing of its own: it moves things through the matrix (its **Env**
  column).
- **LFO 1** and **LFO 2**: the six shapes as buttons, the wave drawn at its rate, then **Sync**
  (**Sync** keeps the transport's beat, **Free** runs in Hz) and **Rate**. An LFO has no depth of its
  own either: that is the matrix's.

Drag an envelope's points, or type a value under it. Attack, Decay and Release can each be **bent**:
drag the hollow handle in the middle of a sloped segment across it; double-click to straighten it.

## Matrix

The **Matrix** starts folded; open it from its column. It is a grid: what can move down the side,
what moves it across the top, an amount in each cell.

| Sources (columns) | Targets (rows) |
|---|---|
| **Env** (the Mod envelope), **LFO 1**, **LFO 2**, **Vel** (velocity), **Key** (around C3), **Wheel** (the mod wheel), **Rand** (a value drawn for each note) | **Pos 1**, **Pos 2**, **Pitch** (both oscillators and the sub, up to ±12 semitones), **Pitch 2** (Osc 2 only), **Fx 1**, **Fx 2** (the effects' amounts), **Gain 2**, **Cutoff** (up to ±5 octaves), **Res**, **Unison** (its Amount) |

A cell is blank at 0. Drag it up or down to set an amount from **−100 %** to **+100 %** (hold Shift
for finer steps), double-click it to clear it, or use the arrow keys. Every cell that reaches the same
target adds up, and the target never leaves its range. Hover a cell to read its route
("LFO 1 › Cutoff"). Like any number, a cell can go on an axis: the axis then sets *how much* the
source moves its target.

## Voice

Folded at first. **Mono** and **Legato** (with Mono, a note played over a held one slides there
without a new strike, over **Glide**), **Voices** (how many notes sound at once), and **Unison**:
copies of each oscillator per note, **1** (off) to **4**, spread by **Amount**. **Classic** detunes
the copies (up to ±50 cents); **Position** spreads them across the table instead.

Each unison copy costs about one more pair of oscillators for every voice, so **Voices × Unison** is
at most 16: at Unison 4 the synth plays up to 4 notes, and the Voice group says so.

## Starting points

Set these from the defaults to hear what the instrument can do:

| Sound | Osc 1 | Osc 2 | Filter | Matrix and the rest |
|---|---|---|---|---|
| **PPG sweep** | Resonant, Position 10 | off | open | Env › Pos 1 +70; Mod envelope Decay 1.5 s |
| **Vowel pad** | Vowels | on: Choir, Position 40, Detune +7, Gain 70 | low-pass 6 kHz | LFO 1 › Pos 1 +60, LFO 1 at 1 bar; Unison 2, Position; Amp Attack 600 ms |
| **Growl bass** | Saw → Square, Position 30, Warp 40 | on: Sine → Saw, Semi −12, Gain 60 | low-pass 400 Hz, Envelope +3, Resonance 40 | Wheel › Fx 1 +60; Mono, Legato, Glide 40 ms |
| **Glass keys** | Glass, FM 25 | off (still the FM source): Metal, Semi +12 | open | Vel › Fx 1 +50; Amp Decay 1.2 s, Sustain 0 % |
| **Supersaw lead** | Sine → Saw, Position 100 | on: Sine → Saw, Position 100, Detune +12, Gain 80 | low-pass 8 kHz | Sub on, Gain 50; Unison 4, Classic, Amount 40 |
| **Clav pluck** | Clav, Position 30, Sync 20 | off | band-pass 1.5 kHz, Envelope +2, Decay 200 ms | Rand › Pos 1 +20 |

## Mapping

In the Studio's **Map** mode, every number can be driven by an axis: Position 1 and 2 (the signature
move: one up, the other down, on one axis), Cutoff, an effect's amount (growl), a matrix cell (how
much an LFO breathes), Unison's Amount or Osc 2's Gain with its Detune (thick ↔ thin). Toggles can
switch **1**, **2** and the **Sub** on and off, and flip the sub's Octave, Unison's mode, the LFOs'
Sync, **Mono** and **Legato**. The tables, effects, filter type and LFO shapes are never on an axis: a
preset carries them.

## In a room

Everything the Wavetable synth plays is the same for every player in a room: the tables are the same
numbers everywhere, every note starts its oscillators from the same place, the per-note random value
is drawn from the room's seed, and the synced LFOs follow the transport. A free (unsynced) LFO can
drift apart between players over a long take; the mod wheel is your own.
