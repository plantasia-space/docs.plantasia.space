---
title: Waveshaper
sidebar_position: 8
sidebar_custom_props:
  icon: Sprout
---

The **Waveshaper** adds harmonics to a sound, and you choose which ones: a warm octave, a hollow fifth
above it, a bright reedy top, or a blend. It goes in any effects rack, most often as an **insert** on a
bass, a pad, a lead or a voice that needs more body or more edge.

It works on the classic waveshaper's maths (Chebyshev polynomials: each one draws exactly one
harmonic), with one difference: the harmonics **stay the same at any level**. A quiet note gets the
same harmonics as a loud one, the tail of a note the same as its attack. It never clips, and it adds no
thump when a note starts.

:::tip[Loads doing nothing]

It loads doing nothing (Amount 0 %): the sound passes through untouched. Turn Amount up to hear the
harmonics come in.

:::

## Harmonics

| Control | What it does |
|---|---|
| **Amount** | How loud the added harmonics are, against the sound. **0 %** as it loads: the sound as it came in. |
| **Height** | How far up the harmonics reach, from the 2nd to the 8th. **50 %** as it loads. |
| **Even/odd** | Which harmonics: **Even** (+100 %), **Odd** (−100 %) or **Both** (0, as it loads, a click-stop on the knob), and every blend between. |

**Height: darker to brighter.** At 0 % the sound gains only the lowest harmonic of each kind, the 2nd
and the 3rd. Turning it up adds the higher ones, each a little quieter than the one below; at 100 % all
seven, the 2nd to the 8th, come in equally.

**Even/odd: warm or hollow.** What each harmonic adds:

| Harmonic | Sounds like | Kind |
|---|---|---|
| 2nd | the octave above: fuller, warmer | even |
| 3rd | an octave and a fifth: hollow, woody, like a clarinet | odd |
| 4th | two octaves: brighter, still sweet | even |
| 5th | two octaves and a third: reedy | odd |
| 6th | two octaves and a fifth: bright | even |
| 7th | a slightly flat seventh: buzzy, a little sour | odd |
| 8th | three octaves: airy top | even |

The even harmonics are octaves and fifths of the note, so they thicken it without changing its
character, like a tube amp. The odd ones give the hollow, square-wave colour of a clarinet or an
overdriven reed. Turn Even/odd to the even side for warmth, to the odd side for bite.

## Output

**Trim** sets the level after the harmonics are added. There is no Dry/wet: the Waveshaper adds its
harmonics to the untouched sound, so a Dry/wet would be a second Amount.

**Watch the peaks at high Amount.** The harmonics come in at the sound's own level, so the loudness
barely moves at the settings it loads with, but the peaks can rise: on a pure tone, up to about
**+6 dB** at Amount 100 %, and up to **+9 dB** on a square-like sound with the odd harmonics alone.
Nothing distorts inside the module; pull **Trim** down if the next effect or the mix gets too hot.

## Best on one voice

On one note at a time (a bass, a lead, a pad's single voice) you hear exactly the harmonics you chose.
On a chord or a full mix the notes' harmonics mix with one another and make extra tones between them,
the rough intermodulation of any waveshaper: denser with Height low and the odd side. On a mix, keep
Amount low and lean to the even side.

## On a Moon

On a <Term id="moon">Moon</Term> it returns **the harmonics alone**: the World already plays the dry
sound, so the Moon adds only what the Waveshaper makes, and the Moon level sets how much. At Amount 0 %
it returns nothing.

## The screen

**A flytrap.** Seven leaves fan out from the ground, one per harmonic, each ending in a trap: the 2nd and
3rd stand nearly upright, the 7th and 8th lean out widest; the even harmonics lean left, the odd ones
right.

- **How wide a trap opens** is how loud its harmonic is. **Amount** opens them all; at 0 % they are shut
  and the picture turns grey: **Off · 0 %**. **Height** opens the outer traps, **Even/odd** one side.
- **The flies** come while sound plays: the higher Amount, the more often one comes. It flies to the most
  open trap, which opens wide to take it and shuts on it. The fly is eaten; after a while the trap opens
  again, empty.
- **Amount** is also the small number in the bottom-left corner.

The word above the picture says what the harmonics sound like: **Warm** (towards even), **Hollow**
(towards odd), **Bright** (Height high), **Round** (Height low) or **Rich**. Below it, which harmonics
are heard (**2nd – 8th**) and how much of them are even and odd. The traps breathe with the sound while
it plays; at rest, and with your system's reduced-motion setting, it is a still picture.

## Mapping

Every control can be mapped to the Orbiter's <Term id="axis">axes</Term>. As it loads, Amount's mapping
rests on 0 and reaches 30 % one way and 100 % the other; Height rests on 50 % (20 % to 90 %); Even/odd
rests on Both and leans further to the even side (−40 % to +70 %). See [Edit](/docs/orbiters/edit).
