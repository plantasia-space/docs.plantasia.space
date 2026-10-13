---
title: Granular
sidebar_position: 11
sidebar_custom_props:
  icon: Sparkles
---

**Granular** plays the audio you choose for an Audio Orbiter as a cloud of **grains**: short slices of
the track, a few to dozens a second, each with its own pitch, place and direction. A voice becomes a
shimmer, a chord a frozen texture, a drum loop a scatter of hits. Like the
[Track player](/docs/orbiters/instruments/track-player), it sits at the head of World I, and everything
after it in the chain hears it.

It is a Track player with grains on top: the **Player** group is the same player (speed, pitch, stretch,
formants), and **Dry/wet** blends the track as the player plays it with the grains.

Pick the audio with the <Dot>1</Dot>button in the module's header.

<ModulePicture
  src="/img/orbiters/instruments/granular.jpg"
  wide
  alt="Granular as it loads, following the track: the Track screen with the waveform, the Player group folded, then Grain (Density, Size, Pitch, Shape, Spread), Position (Follow or Hold, Position, Spray, Seek, Reverse) and Output."
  dots={[[1, 72.5, 4.1], [2, 50, 12], [3, 2.4, 62], [4, 10.2, 83], [5, 19.5, 83], [6, 28.8, 83], [7, 38.1, 83], [8, 47.4, 83], [9, 83, 50.4], [10, 58.4, 83], [11, 67.7, 83], [12, 77, 83], [13, 86.3, 83], [14, 95.9, 63.3], [15, 95.9, 86.8]]}
/>

## Player

<Dot>3</Dot>The **Player** group starts folded; open it from its column. Its controls are the Track
player's, and they move the track the grains are cut from: **Speed**, **Tape** or **Stretch**,
**Quantize**, **Pitch**, **Formant**, **Keep formants** and **Tonality**. See the
[Track player](/docs/orbiters/instruments/track-player) for each.

## Grain

| Control | What it does |
|---|---|
| <Dot>4</Dot>**Density** | How many grains are born each second, 0.5 … 80 (12 as it loads). Few, and you hear each one; many, and they blur into one texture. |
| <Dot>5</Dot>**Size** | How long each grain sounds, 20 … 500 ms (120 ms as it loads): dust at the bottom, long smears at the top. With Density it sets how many grains overlap, six at most. |
| <Dot>6</Dot>**Pitch** | Each grain's transposition, −24 … +24 st, on top of the player's. |
| <Dot>7</Dot>**Shape** | Where a grain's level peaks: low, a sharp attack and a long fade; high, a soft swell. |
| <Dot>8</Dot>**Spread** | How far each grain may land from the centre, left or right. |

## Position

| Control | What it does |
|---|---|
| <Dot>9</Dot>**Follow · Hold** | **Follow** (as it loads): the grains read where the track is playing, so the cloud moves through the song with it. **Hold**: they read at Position while the track plays on underneath: a moment frozen. |
| <Dot>10</Dot>**Position** | Where in the track the grains read while held, 0 … 100 % of its length. With Follow it reads n/a. |
| <Dot>11</Dot>**Spray** | Each grain starts up to this far either side of the reading point, 0 … 1 s. A little keeps a held sound alive; a lot scatters it. |
| <Dot>12</Dot>**Seek** | Sends the reading point travelling on its own, −3 … +3 times the track's speed, added to the speed it rides: a held position that creeps forward, or a cloud that runs ahead of the track. |
| <Dot>13</Dot>**Reverse** | The chance a grain plays its slice backwards. |

## Output

| Control | What it does |
|---|---|
| <Dot>14</Dot>**Dry/wet** | Dry is the track as the player plays it, wet the grains. **75 %** as it loads. |
| <Dot>15</Dot>**Level** | The instrument's level, after Dry/wet, −60 … +6 dB. |

## The screen

<Dot>2</Dot>**Track.** The whole track's waveform, still. Only three things move on it: the grey line
is the **playhead**, where the track is playing; the bright line is the **reading point**, where the
grains are cut, tagged **Follow** or **Hold**; and the small squares are the grains sounding now, higher
or lower as they land left or right, hollow when they play backwards. The box around the reading point
is as wide as **Spray** and as tall as **Spread**. In Hold, the reading point is a handle: drag it along
the track to set **Position**. Scroll over the screen to zoom in around the pointer. Top right, how wet
the sound is (and the Seek, when it is on); below, the density, and where in the track the grains are
reading.

## Try it

- **A frozen moment.** **Hold**, Position on a sustained note or chord, Spray **80 ms**, Size **200 ms**, Density **20 /s**, Dry/wet **100 %**: the moment hangs in the air while you play over it.
- **Travel through the track by hand.** Hold, then map **Position** to an axis: the Planet scrubs through the song.
- **A shimmer above the song.** Follow, grain Pitch **+12 st**, Spread **80 %**, Dry/wet **40 %**: the track plays on, with an octave of grains scattered around it.
- **Scattered drums.** On a loop: Size **40 ms**, Density **8 /s**, Reverse **50 %**, Spray **300 ms**.

## Mapping

Every knob can follow an <Term id="axis">axis</Term>, and Follow · Hold, Stretch, Quantize and Keep
formants a toggle: see [Edit](/docs/orbiters/edit). Position (while held), Density and Size are the ones
to try first.
