---
title: Parametric EQ
sidebar_position: 17
sidebar_custom_props:
  icon: ChartSpline
---

The **Parametric EQ** shapes a sound's tone with up to **eight bands**: take the rumble out of a
recording, make room for a voice, add air on top, or notch out one ringing note. It goes in any effects
rack, as an **insert**.

:::tip[Loads doing nothing]

The Parametric EQ loads with three bands on (a low shelf, a bell and a high shelf) and every gain at
0 dB: the sound passes as it came in until you move a band.

:::

<TryModule module="parametricEq" set="band2Gain:4,band4Gain:-5,band4Q:2,band7Gain:3" source="piano">
<ModulePicture
  src="/img/orbiters/audio-effects/parametric-eq.jpg"
  alt="The Parametric EQ with a low shelf up, a bell cut at 750 Hz and a high shelf up: the Response screen, then the eight bands with their shape and switch, the selected band's Freq, Gain and Q, and Output."
  dots={[[1, 50, 12.5], [2, 2.6, 52.1], [3, 2.6, 58.6], [4, 2.6, 64.6], [5, 19.5, 83.3], [6, 42.9, 83.3], [7, 66.3, 83.3], [8, 92.7, 61.2], [9, 92.7, 84.6]]}
/>
</TryModule>

## The bands

Eight bands in a row, numbered 1 to 8 from low to high. Each has:

- <Dot>2</Dot>a **shape** menu, the small curve above it;
- <Dot>3</Dot>a **switch**, the hexagon: lit, the band is in the sound. Switching glides, so you can
  flip a band while the sound plays, and map it to a toggle;
- <Dot>4</Dot>its **number**: tap it to show that band's knobs below.

| Shape | What it does |
|---|---|
| **Low cut 12 · 24** | Takes away everything below the frequency, gently (12 dB/oct) or steeply (24). |
| **Low shelf** | Raises or lowers everything below the frequency by the Gain. |
| **Bell** | Raises or lowers a region around the frequency. |
| **Notch** | Takes out a narrow slice at the frequency. |
| **High shelf** | Raises or lowers everything above the frequency. |
| **High cut 12 · 24** | Takes away everything above the frequency. |

The three knobs are the selected band's:

| Control | What it does |
|---|---|
| <Dot>5</Dot>**Freq** | The band's frequency, 20 Hz … 20 kHz: the centre of a bell or a notch, the corner of a shelf or a cut. |
| <Dot>6</Dot>**Gain** | The boost or the cut, −15 … +15 dB, for a bell or a shelf. A cut or a notch has no gain: it reads n/a. |
| <Dot>7</Dot>**Q** | How narrow a bell or a notch is, how steep a shelf, or how much a cut peaks at its corner. 0.1 … 18. |

## Output

| Control | What it does |
|---|---|
| <Dot>8</Dot>**Scale** | Scales every bell's and shelf's gain at once: **0 %** is flat, **100 %** as you set them, **200 %** doubles the curve. Map it to an axis to fade the whole EQ in. |
| <Dot>9</Dot>**Level** | Makes up the level the EQ adds or takes away. |

## The screen

<Dot>1</Dot>**Response.** The white line is the whole EQ: above the middle line it boosts, below it
cuts, lows on the left and highs on the right. Each band is a numbered point on it, filled when the band
is on; the selected one has an upright line through it. Behind the line, the sound's own spectrum moves
while it plays, so you can see where to cut. Above, the selected band, its shape and whether it is on;
below, its frequency and its Q.

## Try it

- **Clean up the low end.** Band 1 on, **Low cut 24**, Freq **40 Hz**: the rumble under a recording goes, the bass stays.
- **Room for a voice.** On the pad or the loop that sits under it: band 4, **Bell**, Freq **2 kHz**, Gain **−4 dB**, Q **1**.
- **Air.** Band 7, **High shelf**, Freq **8 kHz**, Gain **+3 dB**.
- **Find a ringing note.** A bell with Gain **+12 dB** and Q **8**: sweep **Freq** until the ring jumps out, then set the shape to **Notch**.

## Mapping

Every band's Freq, Gain and Q, Scale and Level can be mapped to the Orbiter's axes, and each band's
switch to its toggles: see [Edit](/docs/orbiters/edit).
