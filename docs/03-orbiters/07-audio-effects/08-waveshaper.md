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
same harmonics as a loud one, the tail of a note the same as its attack. It never clips, and a note's
start has no thump you'd hear. (Very high notes, above about 8 kHz, get fewer harmonics: theirs would be
above hearing anyway.)

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
and the 3rd. Turning it up adds the higher ones in pairs (the 4th and 5th, then the 6th and 7th, then
the 8th), each pair quieter than the one below: at 50 %, as it loads, each pair is half as loud (6 dB
down). At 100 % they all come in equally: all seven with Even/odd at Both, the four even or three odd
ones towards one side.

**Even/odd: warm or hollow.** What each harmonic adds:

| Harmonic | Sounds like | Kind |
|---|---|---|
| 2nd | the octave above: fuller, warmer | even |
| 3rd | an octave and a fifth: hollow, woody, like a clarinet | odd |
| 4th | two octaves: brighter, still sweet | even |
| 5th | two octaves and a third: reedy | odd |
| 6th | two octaves and a fifth: bright | even |
| 7th | two octaves and a slightly flat seventh: buzzy, a little sour | odd |
| 8th | three octaves: airy top | even |

The even harmonics are octaves and fifths of the note, so they thicken it without changing its
character, like a tube amp. The odd ones give the hollow, square-wave colour of a clarinet or an
overdriven reed. Turn Even/odd to the even side for warmth, to the odd side for bite.

## Output

| Control | What it does |
|---|---|
| **Dry/wet** | Balance between the dry and the shaped sound. **100 %** as it loads; lower, the harmonics come in lower (Amount still sets how loud they are at 100 %). |
| **Trim** | The module's output level, dry included. |

**Watch the level at high Amount.** The harmonics come in at the sound's own level. With Height and
Even/odd where they load, even Amount 100 % moves the loudness about 1 dB at most, but the peaks rise: about
**+6 dB** on a pure tone, about +3 dB on a square wave or a mix. The loudest setting is Height 0 with
the odd harmonics: up to **+9 dB** of peak on a square wave, and on a mix about **+5 dB** louder overall.
Nothing distorts inside the module; pull **Trim** down if the next effect or the mix gets too hot.

## Best on one voice

On one note at a time (a bass, a lead, a pad's single voice) you hear exactly the harmonics you chose.
On a chord or a full mix the notes' harmonics mix with one another and make extra tones between them,
the rough intermodulation of any waveshaper: denser with Height low and the odd side. On a mix, keep
Amount low and lean to the even side.

## On a Moon

On a <Term id="moon">Moon</Term> it returns **the harmonics alone**: the World already plays the dry
sound, so the Moon adds only what the Waveshaper makes, and the Moon level sets how much. At Amount 0 %
it returns nothing; Dry/wet scales what it returns.

## The screen

**A flytrap.** Seven leaves fan out from the ground, one per harmonic, each ending in a trap: the 2nd and
3rd stand nearly upright, the 7th and 8th lean out widest; the even harmonics lean left, the odd ones
right.

- **How wide a trap opens** is how loud its harmonic is. **Amount** (and Dry/wet) opens them all; at 0 %
  they are shut and the picture turns grey: **Off · 0 %** (**Dry · 0 %** with Dry/wet at 0). **Height** opens the outer traps, **Even/odd** one side.
- **The flies** come while sound plays: the more you hear of the harmonics (Amount, and Dry/wet), the
  more often one comes; at Dry/wet 0 none come. It flies to the most
  open trap, which opens wide to take it and shuts on it. The fly is eaten; after a while the trap opens
  again, empty.
- **Amount** is also the small number in the bottom-left corner.

The word above the picture says what the harmonics sound like: **Warm** (Even/odd towards even) or
**Hollow** (towards odd); near Both, **Bright** (Height high), **Round** (Height low) or **Rich**. Below it, which harmonics
are heard (**2nd – 8th**) and how much of them are even and odd. The traps breathe with the sound while
it plays; at rest, and with your system's reduced-motion setting, it is a still picture.

## Mapping

Every control can be mapped to the Orbiter's <Term id="axis">axes</Term>. As it loads, Amount's mapping
rests on 0 and reaches 30 % one way and 100 % the other; Height rests on 50 % (20 % to 90 %); Even/odd
rests on Both and leans further to the even side (−40 % to +70 %). Dry/wet's mapping, like every
effect's, rests on dry (0 %): mapped, the axis at rest plays the sound without the harmonics, and
brings them in as it moves. See [Edit](/docs/orbiters/edit).
