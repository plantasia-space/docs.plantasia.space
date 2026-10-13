---
title: FM synth
sidebar_position: 6
sidebar_custom_props:
  icon: Atom
---

The **FM synth** makes the bright, glassy and percussive sounds a filter synth can't: electric
pianos, bells and mallets, plucked basses, metallic hits, brassy stabs, organs. It is a notes
instrument: it sits at the head of a <Term id="world-dimension">World dimension</Term>, after any generator and MIDI effects, and
the notes you play (the keys, MIDI, the piano roll, a sequencer) sound through it.

It loads as the plainest sound there is, a pure sine at the key. Everything else is yours to bring
in, one Level at a time.

<TryModule module="fm" set="algorithm:5,cRatio:1,dRatio:14,bLevel:45,cLevel:60,dLevel:25,tDecay:500,tSustain:10,m_velocity_timbre:80,decay:2500,sustain:0" source="piano">
<ModulePicture
  src="/img/orbiters/instruments/fm-synth.jpg"
  wide
  alt="The FM synth set as an electric piano: algorithm 5's wiring and the spectrum on the screen, the eight algorithm buttons over the operators' matrix, the Amp envelope beside Velocity and Level, and the folded LFO, Matrix and Voice columns."
  dots={[[1, 23, 27], [2, 74, 27], [3, 30.6, 55.2], [4, 3.1, 78.5], [5, 10.9, 65.2], [6, 17.4, 65.2], [7, 24, 65.2], [8, 30.5, 65.2], [9, 37, 93.8], [10, 48.5, 51.6], [11, 69.8, 77.8], [12, 92.8, 62]]}
/>
</TryModule>

## How it makes a sound

Four **operators**, **A**, **B**, **C** and **D**, each a small oscillator. An operator can be
**heard**, or it can **modulate** another one: bend its wave so fast that new partials appear. That
is FM (more exactly phase modulation, the way the classic Yamaha DX and TX synths do it). Modulation
only ever flows downward, **D → C → B → A**, and **A is always heard**.

How hard a modulator works is its **Level**: low, a soft glow; high, bright and buzzy. In FM the
modulators' Levels are what a cutoff is on a filter synth, so they are the first knobs to put on an
<Term id="axis">axis</Term>.

## Operators

<Dot>3</Dot>**Algorithm.** The eight buttons in the group's title are the eight classic four-operator layouts,
each drawn as a small wiring diagram, the heard operators on the right. Hover one to read its routes
and who is heard.

| Algorithm | Routes | Heard | Good for |
|---|---|---|---|
| **1** | D → C → B → A | A | the deepest stack: brass, basses, evolving leads |
| **2** | C → B, D → B → A | A | two modulators into one: dense bells, growls |
| **3** | C → B → A, D → A | A | a stack plus a direct modulator: metallic keys |
| **4** | D → C → A, B → A | A | as 3, mirrored: plucks, harps |
| **5** | B → A, D → C | A, C | two pairs: the e-piano's body and tine |
| **6** | D into A, B and C | A, B, C | one modulator, three heard: organ with bite |
| **7** | D → C | A, B, C | one pair and two plain sines: soft keys |
| **8** | none | A, B, C, D | four sines as drawbars: organs, additive pads |

Changing the algorithm while notes play glides between the two in a few milliseconds: no click.

**The matrix.** Under the algorithm, one row per operator, every one in view:

| Column | What it does |
|---|---|
| <Dot>4</Dot>**On** (the hexagon) | Switches B, C or D off and on. Off, the row dims and the operator is silent (D's feedback too); its settings are kept. A's hexagon is fixed: A is always on. |
| <Dot>5</Dot>**Wave** | The operator's wave, from a drop-down: **Sine**, **Half** (the top half of a sine: brighter, a nasal edge), **Abs** (both halves up: an octave higher, buzzy) or **Alt** (a double-speed half: hollow, vocal). A change crossfades. |
| <Dot>6</Dot>**Ratio** | The operator's pitch against the key: **×½**, **×1** … **×16**. Whole numbers sound harmonic. |
| <Dot>7</Dot>**Fine** | Raises the ratio by a percentage for inharmonic, bell-like tones: ×3 at 17 % is 3.51. |
| <Dot>8</Dot>**Level** | Modulating: how bright it makes what it modulates. Heard (in algorithms 5 to 8): its loudness against A. |
| <Dot>9</Dot>**Feedback** | D's only: D modulates itself, from a reedy edge to something close to a saw. |

Every cell is a number box: drag it up and down, click to type, double-click to go back to the
default. A has no Fine or Level: it stays in tune and at full level (the module's **Level** is in the
Amp tab).

## The screen

The screen has two halves. <Dot>1</Dot>On the left, the algorithm drawn in the same style as the connections in
the Dimensions panel: the key comes in on the left, each route is a curve from a modulator into what
it modulates, and the heard operators merge into **Out**. A route lights up and thickens as its
modulator works harder, and is dashed while it is silent; an operator switched off or at Level 0 is
drawn faint. A loop over D is its feedback.

<Dot>2</Dot>On the right, what the sound is made of right now: its spectrum, with the key's harmonics ×1, ×2,
×4, ×8 and ×16 marked underneath. Harmonic ratios stand on the marks; Fine moves partials between
them. While a note plays, the spectrum follows the Timbre envelope. The readouts say who is
**Heard** and how many **Partials** stand within 40 dB of the loudest.

## Envelopes

<Dot>10</Dot>Two tabs, **Amp** first, each an envelope drawn beside its knobs with its four values under it:
**Attack**, **Decay**, **Sustain** and **Release**.

- **Amp**: the envelope every note goes through, with <Dot>11</Dot>**Velocity** (how much a note's velocity moves
  its level; at 0 every note is full) and **Level**.
- **Timbre**: one envelope for every modulator at once. It is what makes an FM sound bloom and fade:
  a short Decay with a low Sustain is the bark of an electric piano, a long Decay a slow bell.
  At the defaults (Sustain 100 %) it holds and changes nothing. **Vel → Timbre**, in the Matrix,
  makes harder notes brighter.

Attack, Decay and Release can each be **bent**: drag the small hollow handle in the middle of a
sloped segment across it, from **−100 %** to **+100 %**. **+** is fast at the start, **−** slow.
Double-click a handle to straighten it.

## LFO, Matrix, Voice

<Dot>12</Dot>These three groups start folded; open them from their column.

- **LFO**: one LFO for the whole instrument, **synced** to the transport (a note value or bars) or
  free (in Hz), with six shapes, and **Amount** (how much of it gets through). What it moves is set
  in the Matrix.
- **Matrix**: the [Matrix](/docs/orbiters/instruments#the-matrix) every notes instrument shares. **Modulation** has the LFO's column over
  **Pitch** (vibrato), **Timbre** (the modulators' brightness wobbling, FM's wah) and **Feedback**.
  **MIDI** has **Pitch** (with the pitch bend, two semitones), **Timbre** (every modulator's
  brightness: Vel → Timbre for a harder, brighter strike, Mod → Timbre for the wheel), **Level**,
  **Feedback**, **Vibrato** and **LFO**. For a wheel that brings the LFO in, set the LFO's Amount to
  0 % and **Mod → LFO** to 100 %.
- **Voice**: **Voices** (how many notes sound at once, 1 … 16), **Mono** (one note at a time),
  **Legato** (with Mono, a note played over a held one slides there without a new strike, with
  **Glide** for how long the slide takes).

There is no filter in the FM synth: add a **Filters** or **Multimode filter** module after it to shape
every voice at once.

## Try it

- **An electric piano under your hands.** Set the **E-piano** row of the table below and play it from the keys: soft notes are round, hard ones bark, because velocity opens the timbre.
- **A bass for a sequencer.** Set the **DX bass** row and put a Step sequencer in front of it: Mono and Legato make the notes slide into each other.
- **One knob that changes everything.** Map operator B's **Level** to an axis: the sound goes from a plain sine to a bright, metallic one as the Planet moves.

## Starting points

Set these from the defaults to hear what the instrument can do:

| Sound | Algorithm | Ratios A / B / C / D | Levels B / C / D | Timbre envelope | Also |
|---|---|---|---|---|---|
| **E-piano** | 5 | ×1 / ×1 / ×1 / ×14 | 45 / 60 / 25 | Decay 500 ms, Sustain 10 % | Matrix: Vel → Timbre 80 %; Amp Decay 2.5 s, Sustain 0 % |
| **Tubular bell** | 2 | ×1 / ×3 (Fine 17 %) / ×1 / ×5 | 55 / 30 / 20 | Decay 3 s, Sustain 0 % | Amp Release 3 s |
| **DX bass** | 1 | ×1 / ×1 / ×1 / ×2 | 70 / 40 / 30 | Decay 250 ms, Sustain 20 % | Feedback 30 %, Mono and Legato, Glide 40 ms |
| **Organ** | 8 | ×½ / ×1 / ×2 / ×3 | 70 / 50 / 30 | — | D on Abs |

## Mapping

In the Studio's **Map** mode, every number can be driven by an axis: the Levels (dark ↔ bright),
Fine or Ratio (harmonic ↔ metallic; Ratio moves in whole steps), Feedback (smooth ↔ gritty), the
Timbre envelope's Decay with Vel → Timbre (the bark on the strike), the Matrix's LFO → Timbre (a wobble).
Toggles can switch **B**, **C** and **D** on and off, and flip **Sync**, **Mono** and **Legato**.
The algorithm and the waves are never on an axis: a preset carries them.

## In a room

Everything the FM synth plays is the same for every player in a room: every note starts its
operators from the same place, there is no noise in it, and the synced LFO follows the transport.
Only a free (unsynced) LFO can drift apart between players over a long take.
