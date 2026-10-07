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

## Motion

| Control | What it does |
|---|---|
| **Sync** | Off (as it loads): Rate is in Hz. On: Rate is a note value or a bar of the Orbiter's tempo, and the waver locks to the beat. |
| **Depth** | How far the pitch swings above and below the note, in **cents**: 100 ct is a semitone, up to 300 ct (three semitones). **0 ct** as it loads: the sound as it came in. |
| **Rate** | How fast the pitch wavers. Free: 0.5 … 24 Hz, **5.00 Hz** as it loads. Synced: 1 bar down to 1/32, with dotted values and triplets; **1/8** as it loads. |
| **Spread** | Swings the two sides apart: **0 %** as it loads (both sides together), 100 % one side up while the other is down. |

**Depth in cents.** Depth means the same thing at every Rate: 25 ct is a quarter of a semitone each
way, whether the waver is slow or fast. A singer's vibrato is about 10 … 50 ct at 5 … 7 Hz; a gentle
shimmer is under 12 ct, a warble 40 ct and up, and past 150 ct it turns into a siren. The knob is finer
near 0: its first half covers 0 … 60 ct, the second half 60 … 300 ct. At the slowest rates (under about
1 Hz) the deepest settings are held to what the effect can reach: at 0.5 Hz, 300 ct comes out as about
±164 ct, and the screen says **(held)**.

**Rate.** Slow (under about 1.5 Hz), the pitch sways or wows like a warped tape. Around 5 Hz it sings.
Fast (above 8 Hz), it flutters; near 24 Hz it turns into a buzz.

**Sync on the beat.** With Sync on, the waver is locked to the Orbiter's beat, not only to its speed:
each waver starts on the beat, in tune and rising. Every peer in a room wavers together. When you
start, stop or move the transport, the waver doesn't jump to the new place: it speeds up or slows
down a little until it is back on the beat, so it never clicks.

## Output

| Control | What it does |
|---|---|
| **Dry/wet** | How much of the wavering sound you hear. **100 %** as it loads: a vibrato. Lower, the dry note blends back in. 0 %: the sound as it came in. |
| **Trim** | The level after the effect. |

**Dry/wet below 100 % is a chorus-like blend.** The wavering copy plays a few milliseconds behind the
dry note, so at 50 % the two beat against each other: a shimmer, slightly hollow, the sound of a
simple chorus. For a lusher, wider blend, with several voices and a low cut that keeps the bass
steady, use the [Chorus](/docs/orbiters/audio-effects/chorus) instead.

## Spread and mono

- **Spread 0 %** (as it loads): both sides waver together. A stereo sound keeps its image, and the
  Vibrato sounds the same in mono.
- **Spread 100 %**: one side goes up while the other goes down. A mono sound opens up into stereo.
  **Heard in mono** (a phone speaker, a club's mono sum), the two sides beat against each other like a
  chorus.

## A few milliseconds late

While Depth is above 0, the sound comes out a little late: the room the waver needs, from about
0.1 ms (a small, fast vibrato) to 30 ms (a deep, slow one). A typical vibrato, 25 ct at 5 Hz, is half
a millisecond late, and the screen shows the delay. Right after you cut Depth to 0, it takes about two
and a half wavers to come back to exactly the input (2.5 s at 1 Hz, half a second at 5 Hz), slightly
sharp on the way (an eighth of the depth you had): it drains gently so the cut never clicks. At Depth 0
there is no delay at all.

## On a Moon

On a <Term id="moon">Moon</Term> the Vibrato returns only its wavering copy, at Dry/wet 100 %, next to
the World's dry sound: the two together sound like a chorus, a good use for a Moon. At Depth 0 a Moon
Vibrato is silent, so it never returns the dry sound a second time.

## The screen

**A runner bean.** A runner bean twines round a string, and the string is the note. The bean is one
finished drawing that slides slowly down the screen, a full screen in about six seconds; nothing in
the picture is ever redrawn while it slides.

- **Rate** is the wavelength: the faster the waver, the shorter the turns. At 5 Hz two and a half
  turns fit on the screen, at 24 Hz twelve. The slide's speed never changes.
- **Depth** is how far the bean swings from the string, on the knob's curve; the dashed lines are
  ±100 ct (inner) and ±300 ct (outer). The small number
  in the bottom-left corner is Depth. At 0 the bean is gone and the string turns grey: **Still · 0 ct**.
- **The leaves:** a curl on each crest and a leaf hanging from each trough, on every other turn when
  the turns crowd.
- **Sync on:** a knot on the string for every beat.
- **Spread:** a second, thinner bean, the right side, half a turn behind at 100 %.

When you change a control, the new setting joins at the top of the screen once the knob comes to rest,
and slides down into view. The word above the picture says **Shimmer**, **Sing**, **Warble**, **Wow**
or **Flutter**; below it, the rate (with the length of one waver) and the depth with its delay. The
picture moves only while sound plays; at rest, and with your system's reduced-motion setting, it is a
still picture of the current values.

## Mapping

Every Vibrato control can be mapped to the Orbiter's axes, and Sync to its toggles: Depth rests on 0,
so half an axis gives a gentle vibrato and the other half a deep one (45 ct and 180 ct as it maps). See [Edit](/docs/orbiters/edit).
