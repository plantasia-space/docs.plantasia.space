---
title: Waveshaper
sidebar_position: 8
sidebar_custom_props:
  icon: Sprout
---

The **Waveshaper** adds harmonics to a sound, and you choose which ones: a warm octave, a hollow fifth
above it, a bright reedy top, or a blend. It goes in any effects rack, most often as an **insert** on a
bass, a pad, a lead or a voice that needs more body or more edge.

It adds the harmonics you choose, and they stay the same at any level: a quiet note gets the same
colour as a loud one. It never clips.

:::tip[Loads doing nothing]

It loads doing nothing (Amount 0 %): the sound passes through untouched. Turn Amount up to hear the
harmonics come in.

:::

<TryModule module="waveshaper" set="amount:60" source="piano">
<ModulePicture
  src="/img/orbiters/audio-effects/waveshaper.jpg"
  wide
  alt="The Waveshaper at Amount 60 %, Height 50 %, Both: the flytrap screen, then Harmonics (Amount, Height, Even/odd) and Output."
  dots={[[1, 59.9, 57.1], [2, 73.9, 57.1], [3, 84.8, 57.1], [4, 95.4, 45.3], [5, 95.4, 68.8], [6, 25.3, 14.2]]}
/>
</TryModule>

## Harmonics

| Control | What it does |
|---|---|
| <Dot>1</Dot>**Amount** | How loud the added harmonics are, against the sound. **0 %** as it loads: the sound as it came in. |
| <Dot>2</Dot>**Height** | How far up the harmonics reach, from the 2nd to the 8th. **50 %** as it loads. |
| <Dot>3</Dot>**Even/odd** | Which harmonics: **Even** (+100 %), **Odd** (−100 %) or **Both** (0, as it loads, a click-stop on the knob), and every blend between. |

**Height: darker to brighter.** At 0 % the sound gains only the 2nd and the 3rd harmonic; turn it up
and the higher ones join, in pairs.

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
| <Dot>4</Dot>**Dry/wet** | Balance between the dry and the shaped sound. **100 %** as it loads; lower, the harmonics come in lower (Amount still sets how loud they are at 100 %). |
| <Dot>5</Dot>**Level** | The module's output level, dry included. |

The harmonics add to the level; pull **Level** down if the next effect gets too hot.

On a <Term id="moon">Moon</Term> it returns only the harmonics; the Moon level sets how much you hear
(see [Audio effects](/docs/orbiters/audio-effects)).

## Best on one voice

On one note at a time (a bass, a lead, a pad's single voice) you hear exactly the harmonics you chose.
On a chord or a full mix the notes' harmonics rub against each other and turn rough. On a mix, keep
Amount low and lean to the even side.

## The screen

<Dot>6</Dot>**A flytrap.** Seven leaves fan out from the ground, one per harmonic, each ending in a trap: the 2nd and
3rd stand nearly upright, the 7th and 8th lean out widest; the even harmonics lean left, the odd ones
right.

- **How wide a trap opens** is how loud its harmonic is. **Amount** opens them all; at 0 % they are
  shut and the picture turns grey: **Off · 0 %**. **Height** opens the outer traps, **Even/odd** one side.
- **The flies** come while sound plays, and fly to the most open trap, which shuts on them.
- **The word** says what the harmonics sound like: **Warm** (towards even) or **Hollow** (towards
  odd); near Both, **Bright**, **Round** or **Rich**.

## Try it

- **A warmer bass.** On a bass with one note at a time: Amount **40 %**, Height **0 %**, Even/odd all the way to **Even**. It gains the octave above and is easier to hear on small speakers.
- **A hollow, reedy lead.** Amount **60 %**, Height **50 %**, Even/odd all the way to **Odd**: the clarinet colour.
- **Air on a pad.** Amount **25 %**, Height **100 %**, **Both**. Keep Amount low on chords, so the notes' harmonics don't turn rough.

## Mapping

Every control can be mapped to the Orbiter's <Term id="axis">axes</Term>: see [Edit](/docs/orbiters/edit).
