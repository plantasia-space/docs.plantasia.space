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

<TryModule module="limiter" set="threshold:-7" source="drums" />

### Limiter

| Control | What it does |
|---|---|
| **Threshold** | Where limiting starts, −24 … 0 dB (−1 dB as it loads). Pull it down and everything gets louder by the difference between the Ceiling and the Threshold, while the peaks above the Threshold are held at the ceiling. Threshold −7 dB with Ceiling −1 dB: 6 dB louder. |
| **Ceiling** | The highest peak that comes out, −12 … 0 dB (−1 dB as it loads). It counts the peaks between the samples too (dBTP), the ones a converter or an MP3 would clip. It is the Limiter's output level: there is no Dry/wet or Level, so nothing ever passes it. |
| **Release** | How fast it lets go after a peak, 1 ms … 1 s (100 ms as it loads). Short is louder but can distort low notes; long is cleaner but can pump. |
| **Auto** | On as it loads. A lone peak lets go at Release, and a long loud passage lets go more slowly, so it neither crackles nor pumps. Off, Release alone sets it. |

### The screen

**Output level.** The sound coming out over the last seconds, scrolling from right to left, with the
**ceiling** as the line across: where the sound's top runs flat along it, the Limiter is working. The
**reduction** hangs from the top in green, deeper as it turns the sound down harder. The big number is
the Threshold and the half-ring under it the Ceiling; underneath, the gain the Threshold gives and the
Release. The ladder on the right lights with the reduction now, and the number under it is the deepest
reduction of the last second.

## One Limiter

<TryModule module="oneLimiter" set="amount:60" source="drums" />

One knob, **Amount**, with the One badge. It goes both ways from 0, and each way is a different limiter;
at 0 it does nothing. Either way, once you turn it, no peak passes −1 dB.

- **Turn it right: Loud.** Up to 12 dB louder, with a fast release: punchy and loud, the classic
  mastering push.
- **Turn it left: Dense.** The same push with a slow release, and the level it added taken back off:
  the mix gets thicker and more even without getting louder. Safe to move on an axis.

Its screen is the Limiter's, with Amount as the big number.

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
