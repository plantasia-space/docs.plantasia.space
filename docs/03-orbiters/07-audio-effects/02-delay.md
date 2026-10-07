---
title: Delay
sidebar_position: 2
sidebar_custom_props:
  icon: Timer
---

Two delays repeat a sound in time: the **Delay**, with every control in reach, and the **One Echo**,
one knob with a dub echo one way and a slapback the other. Both go in any effects rack. The Delay's
home is a **<Term id="moon">Moon</Term>**; the One Echo is mostly an insert on a <Term id="world-dimension">World dimension</Term> or the <Term id="star">Star</Term>.

## On a Moon, or as an insert

A **Moon** is a send and return: what it returns is added to the dry World through the Star's mixer,
so a delay there should return only its echoes.

- **An effect added to a Moon starts at Dry/wet 100 %**, the Delay included. How loud the echoes are
  is the mixer's: the Moon level and the crossfade on the Star.
- **The echoes outlive the sound.** When the send is closed, nothing more goes in and the echoes
  already in flight ring out.

As an **insert**, a delay blends with the sound it is on. Turning an effect off (its power button)
cuts its echoes at once; to keep them, use Freeze or the Moon's send.

:::tip[Loads doing nothing]

Both load doing nothing (the Delay at Dry/wet 0 %, the One Echo at Amount 0): turn them up to hear them.

:::

## Delay

<TryModule module="delay" set="mix:50" source="drums">
<ModulePicture
  src="/img/orbiters/audio-effects/delay.jpg"
  wide
  alt="The Delay as an insert, at Dry/wet 0 %: the Echoes screen, then Time, Repeats and Output."
  dots={[[1, 55.9, 20.7], [2, 51.1, 82.1], [3, 65.1, 78.8], [4, 77.1, 82.1], [5, 86.4, 82.1], [6, 81.2, 20.7], [7, 90.9, 20.7], [8, 95.9, 62.2], [9, 95.9, 85.6], [10, 22.6, 14.2]]}
/>
</TryModule>

### Time

| Control | What it does |
|---|---|
| <Dot>1</Dot>**Sync** | On (as it loads): the time is a note value of the Orbiter's tempo, so the echoes stay on the beat when the tempo changes. Off: the time is in milliseconds. |
| <Dot>2</Dot>**Time** | Synced: 1/2 down to 1/32 triplets, with dotted values; **1/8D** (a dotted eighth) as it loads. Free: 1 ms … 2 s, 250 ms as it loads. |

A synced time longer than 2.5 s (a 1/2 note below 48 BPM) plays at half its length, so it stays on
the beat; the screen says **halved to fit**.

**Why the echoes bend.** Moving the time while sound plays bends the echoes' pitch, like a tape
delay: the repeats speed up or slow down until they reach the new time, then sit on it. This is what
makes Time worth mapping to an <Term id="axis">axis</Term>: sweep it and the echoes swoop. A tempo change bends them the
same way.

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

**Ping-pong with mono and stereo sounds.** A mono sound (most synth voices, a mono track) bounces:
the first echo lands left, the next right, then left. A stereo sound is folded to mono on its way in
and then bounces too, so it trades its own width for the bounce's. Heard on a phone speaker, the
echoes keep their level: the two sides land at different times, so nothing cancels.

Ping-pong and Freeze can be mapped to the Orbiter's toggles.

### Output

<Dot>8</Dot>**Dry/wet** blends the dry sound with the echoes (0 % as it loads, 100 % on a Moon), and <Dot>9</Dot>**Trim**
sets the level after it.

### The screen

<Dot>10</Dot>Two tetrahedra fly through each other over the sound, a star.

- **The big number, bottom left, is Dry/wet** (0 … 100): how much of the echoes you hear. At 0 % it
  turns grey and the picture is muted (**Dry · 0 %**). The star's six front points light up with it.
- **The triangles on the ground are the echoes**, outward from the sound: the further one is, the
  later it comes. They fade with Feedback, darken with the High cut and shrink with the Low cut. The
  nearest ones light up on the side that is ringing.
- **Ping-pong** pulls the two tetrahedra apart on a strut; the sound feeds the left one, the echoes
  land left, right, left, and a dot on the strut follows the bounce.
- **Time** sets how fast the star turns: shorter times turn it a little faster.
- **Freeze** stops the star, lights every echo and turns the strut solid: **Frozen**.

Below the picture: the time (with its length in ms when synced), then the number of echoes, Feedback
and the cuts. The picture moves only while sound plays; at rest, and with your system's
reduced-motion setting, it is a still picture of the current values.

## One Echo

<TryModule module="oneEcho" set="amount:60" source="drums">
<ModulePicture
  src="/img/orbiters/audio-effects/one-echo.jpg"
  alt="The One Echo playing at Amount +60 %, Trail: four echoes at 1/8D (375 ms) on the Echoes screen."
  dots={[[1, 50, 78.8], [2, 50, 14.2]]}
/>
</TryModule>

One knob, <Dot>1</Dot>**Amount**, with the One badge. It goes both ways from 0, and each way is a different echo;
at 0 it does nothing, and either way the level stays about where it was.

- **Turn it up** (+): a dub echo in time with the Orbiter, a dotted eighth bouncing left and right.
  A little gives one soft repeat behind the sound; further up, a long trail of repeats, each one
  darker than the last, so it never clutters the top of a mix. It follows the tempo.
- **Turn it down** (−): a slapback, one quick repeat right behind the sound, in the centre: the
  doubled vocal, the rockabilly guitar. Further down it stretches a little (80 to 140 ms) and gets a
  second, fainter repeat.

The two sides run on their own lines, so sweeping Amount across 0 never bends or cuts the other
side's echoes: they fade out with their own level. Map Amount to an axis and one gesture goes from a
slap, through dry, into a dub trail.

:::note[On a Moon it turns into a send by itself]

It returns only its echoes, with no dry, so there is nothing to set. An untouched One Echo on a Moon (Amount 0) returns silence.

:::

### The screen

<Dot>2</Dot>A corridor runs up into the sky from the sound, with an octahedron hovering over it. Turned up, the
echoes are diamonds climbing the corridor, left, right, left; more of them, and a bigger craft, as
you turn further. Turned down, one or two diamonds sit straight above the sound, close to the craft:
the slap. The big number counts the echoes you hear, the ladder on the right follows how loud they
are, and the word says **Soft** or **Trail** turned up, **Slap** turned down. On a Moon the sound is
drawn hollow and the screen reads **Send ·** and the word. In the smallest drawer the screen hides
and the knob stays.

## Mapping

Every Delay control can be mapped to the Orbiter's axes, and Sync, Ping-pong and Freeze to its
toggles; the One Echo's Amount maps like any knob: see [Edit](/docs/orbiters/edit).
