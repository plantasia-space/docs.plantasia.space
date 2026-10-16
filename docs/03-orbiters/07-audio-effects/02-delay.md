---
title: Delay
sidebar_position: 2
sidebar_custom_props:
  icon: Timer
---

Two delays repeat a sound in time: the **Delay**, with every control in reach, and the **One Echo**,
one knob with a dub echo one way and a slapback the other. Both go in any effects rack. The Delay's
home is a **<Term id="moon">Moon</Term>**; the One Echo is mostly an insert on a <Term id="world-dimension">World dimension</Term> or the <Term id="star">Star</Term>.

:::tip[How they load]

On a World the Delay loads at Dry/wet 50 %, so you hear it as soon as you add it; on a Star it loads at 0 %, and on a Moon at 100 %. The One Echo loads doing nothing (Amount 0): turn it up to hear it.

:::

## Delay

<TryModule module="delay" set="mix:50" source="drums">
<ModulePicture
  src="/img/orbiters/audio-effects/delay.jpg"
  wide
  alt="The Delay playing at Dry/wet 50 %: the Echoes screen, then Time, Repeats and Output."
  dots={[[1, 48.8, 14.7], [2, 50.6, 58.3], [3, 64.7, 58.3], [4, 77, 58.3], [5, 86.6, 58.3], [6, 67.9, 14.7], [7, 80.7, 14.7], [8, 95.9, 45.3], [9, 95.9, 68.8], [10, 22.3, 14.2]]}
/>
</TryModule>

### Time

| Control | What it does |
|---|---|
| <Dot>1</Dot>**Sync** | On (as it loads): the time is a note value of the Orbiter's tempo, so the echoes stay on the beat when the tempo changes. Off: the time is in milliseconds. |
| <Dot>2</Dot>**Time** | Synced: 1/2 down to 1/32 triplets, with dotted values; **1/8D** (a dotted eighth) as it loads. Free: 1 ms … 2 s, 250 ms as it loads. Move it while sound plays and the echoes swoop like a tape delay; map it to an <Term id="axis">axis</Term> for that. |

### Repeats

| Control | What it does |
|---|---|
| <Dot>3</Dot>**Feedback** | How many echoes: more feedback, longer trails. Up to 95 %; for endless echoes, use Freeze. |
| <Dot>4</Dot>**Low cut** | Each echo loses more low end: the trail gets thinner. **Off** at 20 Hz. |
| <Dot>5</Dot>**High cut** | Each echo loses more top: the trail gets darker, like tape. **Off** at 20 kHz. |
| <Dot>6</Dot>**Ping-pong** | Bounces the echoes from left to right. Off (as it loads): each side echoes on its own side. |
| <Dot>7</Dot>**Freeze** | Holds the echoes forever and stops new sound from getting in: play a phrase, freeze it, and play over the loop it leaves. Turn it off and the echoes fade at Feedback again. |

The cuts sit inside the loop, so every echo goes through them again: each one is a little thinner or
darker than the last.

With Ping-pong on, a stereo sound is folded to mono before it bounces.

Ping-pong and Freeze can be mapped to the Orbiter's toggles.

### Output

<Dot>8</Dot>**Dry/wet** blends the dry sound with the echoes, and <Dot>9</Dot>**Level** sets the level after it.

On a Moon it starts at Dry/wet 100 % and returns only the effect; the Moon level sets how much you
hear (see [Audio effects](/docs/orbiters/audio-effects)).

### The screen

<Dot>10</Dot>Two tetrahedra fly through each other over the sound, a star.

- **The big number, bottom left, is Dry/wet**: how much of the echoes you hear. At 0 % the picture
  is muted (**Dry · 0 %**).
- **The triangles on the ground are the echoes**, outward from the sound: the further one is, the
  later it comes. They fade with Feedback.
- **Freeze** stops the star and lights every echo: **Frozen**.

## One Echo

<TryModule module="oneEcho" set="amount:60" source="drums">
<ModulePicture
  src="/img/orbiters/audio-effects/one-echo.jpg"
  alt="The One Echo at Amount 60 %: echoes climbing the corridor on the Echoes screen, beside the Amount knob."
  dots={[[1, 89.5, 54.2], [2, 39.5, 12.2]]}
/>
</TryModule>

One knob, <Dot>1</Dot>**Amount**, with the One badge. It goes both ways from 0, and each way is a different echo;
at 0 it does nothing, and either way the level stays about where it was.

- **Turn it right: Trail.** A dub echo in time with the Orbiter, a dotted eighth bouncing left and
  right. A little gives one soft repeat behind the sound; further, a long trail of repeats, each one
  darker than the last, so it never clutters the top of a mix.
- **Turn it left: Slap.** A slapback, one quick repeat right behind the sound, in the centre: the
  doubled vocal, the rockabilly guitar. Further left it stretches a little and gets a second,
  fainter repeat.

Map Amount to an <Term id="axis">axis</Term> and one gesture goes from a slap, through dry, into a dub trail.

### The screen

<Dot>2</Dot>A corridor runs up into the sky from the sound, with an octahedron hovering over it. Turned right,
the echoes are diamonds climbing the corridor, left, right, left; turned left, one or two diamonds
sit straight above the sound: the slap. At 0 the octahedron rests over the sound, grey and still,
with no echoes. The big number is Amount: drag it up or down to turn it, as you would the knob.

## Try it

- **A dotted-eighth echo on a melody.** As it loads on a World (Sync on, **1/8D**, Dry/wet 50 %), then Feedback **35 %** and High cut **4 kHz**: the echoes fall between the notes and get darker as they fade.
- **Echoes that bounce.** **Ping-pong** on, Time **1/8**, Feedback **50 %**, on a short sound: a hi-hat, a pluck, a rim.
- **A slapback.** Sync off, Time **90 ms**, Feedback **0 %**, Dry/wet **30 %**: one quick repeat right behind the sound.
- **A loop out of a phrase.** Time **1/2**, Feedback **60 %**: play a short phrase, press **Freeze**, and play over the loop it leaves.

## Mapping

Every Delay control can be mapped to the Orbiter's axes, and Sync, Ping-pong and Freeze to its
toggles; the One Echo's Amount maps like any knob: see [Edit](/docs/orbiters/edit).
