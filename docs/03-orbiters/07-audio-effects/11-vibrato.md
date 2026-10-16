---
title: Vibrato
sidebar_position: 11
sidebar_custom_props:
  icon: AudioWaveform
---

The **Vibrato** makes the pitch waver, evenly above and below the note: a singer's vibrato on a synth
lead, a slow warble on a pad, a warped tape at a slow rate and a big depth. It goes in any effects rack,
most often as an **insert** on a lead, a pad, an organ or a voice.

The note wavers **without getting louder, softer or wider**. That is the difference from a tremolo,
where the level goes up and down, and from a chorus, which mixes wavering copies with the original.

:::tip[Loads doing nothing]

The Vibrato loads at Depth 0 ct: the sound passes exactly as it came in, with no delay. Turn Depth up
to start the waver.

:::

<TryModule module="vibrato" set="depth:40" source="pad">
<ModulePicture
  src="/img/orbiters/audio-effects/vibrato.jpg"
  wide
  alt="The Vibrato at Depth 40 ct, 5 Hz: the runner bean screen, then Motion and Output."
  dots={[[1, 82.2, 14.7], [2, 59.9, 58.3], [3, 73.9, 58.3], [4, 84.8, 58.3], [5, 95.4, 45.3], [6, 95.4, 68.8], [7, 25.3, 14.2]]}
/>
</TryModule>

## Motion

| Control | What it does |
|---|---|
| **LFO** | The waver is one of [the Orbiter's nine LFOs](/docs/orbiters/interact#an-lfo-in-a-module). The menu on the tab picks which (the dimension's X as it loads), the hexagon switches the waver on and off. Its **Rate in** (Hz, Beats or a value of the World), **Rate**, **Shape** and **LFO depth** are that LFO's own, shared with whatever else reads it. |
| <Dot>2</Dot>**Depth** | How far the pitch swings above and below the note, in **cents**: 100 ct is a semitone, up to 300 ct (three semitones). **0 ct** as it loads: the sound as it came in. |
| <Dot>4</Dot>**Spread** | Swings the two sides apart: **0 %** as it loads (both sides together), 100 % one side up while the other is down. |

**Depth in cents.** Depth means the same thing at every Rate: 25 ct is a quarter of a semitone each
way, whether the waver is slow or fast. A singer's vibrato is about 10 … 50 ct at 5 … 7 Hz; a gentle
shimmer is under 12 ct, a warble 40 ct and up, and past 150 ct it turns into a siren. The knob is finer
near 0: its first half covers 0 … 60 ct, the second half 60 … 300 ct. At the slowest rates the
deepest settings are held back a little, and the screen says **(held)**.

**The LFO's Rate.** Slow (under about 1.5 Hz), the pitch sways or wows like a warped tape. Around 5 Hz it sings.
Fast (above 8 Hz), it flutters; near 21 Hz, the LFO's fastest, it turns into a buzz. Depth is in tune with a sine; another Shape bends the pitch its own way (a square jumps between two pitches).

**On the beat.** With the LFO's Rate in on **Beats**, the waver is locked to the Orbiter's beat, not only to its speed:
each waver starts on the beat, in tune and rising. Every player in a room wavers together. Start, stop or jump the
transport and the waver slides back onto the beat without a click.

## Output

| Control | What it does |
|---|---|
| <Dot>5</Dot>**Dry/wet** | How much of the wavering sound you hear. **100 %** as it loads: a vibrato. Lower, the dry note blends back in. 0 %: the sound as it came in. |
| <Dot>6</Dot>**Level** | The level after the effect. |

**Dry/wet below 100 % is a chorus-like blend.** The wavering copy plays a few milliseconds behind the
dry note, so at 50 % the two beat against each other: a shimmer, slightly hollow, the sound of a
simple chorus. For a lusher, wider blend, with several voices and a low cut that keeps the bass
steady, use the [Chorus](/docs/orbiters/audio-effects/chorus) instead.

On a <Term id="moon">Moon</Term> it returns only its wavering copy, at Dry/wet 100 %, next to the
World's dry sound: the two together sound like a chorus (see [Audio effects](/docs/orbiters/audio-effects)).

## The screen

<Dot>7</Dot>**A runner bean.** A runner bean twines round a string, and the string is the note.

- **Rate** is the wavelength: the faster the waver, the shorter the turns.
- **Depth** is how far the bean swings from the string, and the small number in the bottom-left
  corner. At 0 the bean is gone and the string turns grey: **Still · 0 ct**.
- **Spread** is a second, thinner bean: the right side.
- **The word** above the picture says **Shimmer**, **Sing**, **Warble**, **Wow** or **Flutter**.

## Try it

- **A singer's vibrato on a lead.** Depth **25 ct**, the LFO's Rate **5.5 Hz**. Map Depth to an axis and bring it in on the long notes only.
- **A warped tape on a pad or a piano.** Depth **60 ct**, the LFO's Rate **0.8 Hz**: the pitch sways slowly, like a record off centre.
- **A wide shimmer.** Depth **10 ct**, the LFO's Rate **6 Hz**, Spread **100 %**: the two sides waver apart and the sound opens up.

## Mapping

Every Vibrato control can be mapped to the Orbiter's axes, and the LFO's on/off to its toggles: see [Edit](/docs/orbiters/edit).
