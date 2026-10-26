---
title: Limiter
sidebar_position: 21
sidebar_custom_props:
  icon: ArrowUpToLine
---

Two limiters make a sound louder while its peaks never pass a ceiling: the **Limiter**, three controls
like a mastering limiter, and the **One Limiter**, one knob that makes a mix louder one way and denser
the other. A limiter is a compressor with an infinite ratio: whatever would go over the ceiling is
turned down just enough, a moment before it arrives. Its home is the end of the
<Term id="star">Star</Term>'s chain, the last thing before the speakers; it works on a World too.

:::tip[Loads doing nothing]

The Limiter loads with its Threshold on its Ceiling (−1 dB) and the One Limiter at Amount 0: a sound
under the ceiling passes exactly as it came in, 1.6 ms later. A limiter looks ahead to catch each peak
in time, so it always plays that little late.

:::

:::note[Not on a Moon]

Neither limiter can go on a Moon. A Moon plays beside its World, and the limiter's small delay would
make the two copies interfere.

:::

## Limiter

<TryModule module="limiter" set="threshold:-13" source="drums">
<ModulePicture
  src="/img/orbiters/audio-effects/limiter.jpg"
  wide
  alt="The Limiter at Threshold −13 dB on drums, limiting: the air compressor with its pump, big and small gauges and safety valve, the reduction ladder lit, then Threshold, Ceiling, Release and Auto."
  dots={[[1, 71.9, 58.3], [2, 84.5, 58.3], [3, 94.3, 58.3], [4, 92, 14.7], [5, 28.1, 33.7], [6, 41, 36.7], [7, 36.4, 44.2], [8, 47.3, 41.8], [9, 57.6, 30]]}
/>
</TryModule>

### Limiter

| Control | What it does |
|---|---|
| <Dot>1</Dot>**Threshold** | Where limiting starts, −24 … 0 dB (−1 dB as it loads). Pull it down and everything gets louder by the difference between the Ceiling and the Threshold, while the peaks above the Threshold are held at the ceiling. Threshold −7 dB with Ceiling −1 dB: 6 dB louder. |
| <Dot>2</Dot>**Ceiling** | The highest peak that comes out, −12 … 0 dB (−1 dB as it loads). It counts the peaks between the samples too (dBTP), the ones a converter or an MP3 would clip. It is the Limiter's output level: there is no Dry/wet or Level, so nothing ever passes it. |
| <Dot>3</Dot>**Release** | How fast it lets go after a peak, 1 ms … 1 s (100 ms as it loads). Short is louder but can distort low notes; long is cleaner but can pump. |
| <Dot>4</Dot>**Auto** | On as it loads. A lone peak lets go at Release, and a long loud passage lets go more slowly, so it neither crackles nor pumps. Off, Release alone sets it. |

### The screen

**An air compressor.** The sound is the air. The <Dot>5</Dot>pump on top pushes it into the tank: its piston
works harder the more gain the Threshold gives. The <Dot>6</Dot>**big gauge** reads the pressure that comes out,
the output level, with the **ceiling** as its mark. When the sound would pass it, the <Dot>7</Dot>**safety valve**
lets the extra air out in puffs, more the harder the Limiter works, and the <Dot>8</Dot>**small gauge** reads how
much it lets out: the reduction. The big number is the Threshold and the half-ring under it the
Ceiling; underneath, the gain the Threshold gives and the Release. The <Dot>9</Dot>ladder on the right lights with
the reduction, and the number under it says how much in dB.

## One Limiter

<TryModule module="oneLimiter" set="amount:60" source="drums">
<ModulePicture
  src="/img/orbiters/audio-effects/one-limiter.jpg"
  alt="The One Limiter at Amount 60 % on drums: the pancake compressor with its gauge, safety valve and reduction ladder, beside the Amount knob."
  dots={[[1, 89.5, 54.2], [2, 59.7, 43.8], [3, 21.4, 43.8], [4, 71.8, 30]]}
/>
</TryModule>

One knob, <Dot>1</Dot>**Amount**, with the One badge. It goes both ways from 0, and each way is a different limiter;
at 0 it does nothing. Either way, once you turn it, no peak passes −1 dB.

- **Turn it right: Loud.** Up to 12 dB louder, with a fast release: punchy and loud, the classic
  mastering push.
- **Turn it left: Dense.** The same push with a slow release, and the level it added taken back off:
  the mix gets thicker and more even without getting louder. Safe to move on an axis.

Its screen is a smaller machine, a pancake compressor: one <Dot>2</Dot>gauge for the output, with the ceiling's
mark, and the <Dot>3</Dot>safety valve's air while it limits. The big number is Amount, and the <Dot>4</Dot>ladder on the right
shows the reduction.

## Try it

- **Catch the overs.** Limiter at its defaults on the Star: nothing changes until a peak would pass
  −1 dB.
- **Ready for streaming.** Threshold **−4 dB**, Ceiling **−1 dB**, Auto on: 3 dB louder, peaks at
  −1 dBTP.
- **Loud master.** Threshold **−8 dB**, Ceiling **−0.3 dB**, Release **60 ms**, Auto on. Watch the
  ladder: past 6 dB of reduction most mixes start to suffer.
- **Smashed drum bus.** Threshold **−13 dB**, Ceiling **−3 dB**, Release **20 ms**, Auto off.
- **One knob on the Star.** One Limiter at **+40**: louder and finished. At **−40**: the same glue,
  the level kept.

## Mapping

Every Limiter control can be mapped to the Orbiter's axes, and the One Limiter's Amount maps like any
knob: see [Edit](/docs/orbiters/edit).
