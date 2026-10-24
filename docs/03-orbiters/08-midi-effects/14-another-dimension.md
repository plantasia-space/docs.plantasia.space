---
title: Play on another dimension's hits
sidebar_position: 1.9
sidebar_custom_props:
  icon: Waypoints
---

A generator's **Rate** can follow another <Term id="world-dimension">dimension</Term> of the same
Orbiter instead of a note value. Type a melody into the Step sequencer of World II and pick
**I · Kick** as its Rate: the melody walks one step on every kick, so it plays the drums' rhythm and
stays in step with them, whatever the drums do. Add the open hat and it walks faster where the hats are.

There is nothing new to learn: it is one more section in the Rate list you already know.

## Who follows, who leads

| Module | Follows (its Rate) | Leads (what it plays on) |
|---|---|---|
| **Step sequencer** | yes: the next step on each hit | yes: every note it plays |
| **Arpeggiator** | yes: its next note on each hit | no |
| **Axis notes** | yes: its notes land on the hits | no |
| **Latent generator** | yes: the loop's next note on each hit | yes: percussion by lane, a melody every note |
| **Drum sequencer** | no (it keeps its own grid) | yes: by voice (Kick, Snare, Closed hat …) |
| **Piano roll** | no | yes: every note of its clip |

- A source is always **another** dimension of the same Orbiter, never the generator's own.
- A generator that follows a clock is **not** a source itself: pick the drums directly.

## Picking a source

Open **Rate**: on the module's <Term id="play-surface">play surface</Term>, or in the Studio, where
Rate is a menu in the module's panel. The list shows the note values first, then **From another
dimension**, one row per dimension that can lead, numbered as the Orbiter numbers them:

- **Drum sequencer** and **Latent generator · Percussion**: their lanes. Tap one to follow it, tap
  more to add them ("Kick + Open hat"). Tapping the last lit lane off goes back to the note value.
- **Step sequencer**, **Latent generator · Melody** and **Piano roll**: **Every note**.

Closed, the button names what it follows: **I · Kick+Snare**, and **+2** when more lanes are lit. The
screen's Rate corner reads the same. Picking a note value goes back to it.

## What a hit does

Each generator counts the hits the way it counts steps: hit 1 is step 1, hit 2 step 2.

- **Step sequencer**: Direction, the lanes' own lengths, Start, Chance and Euclid work as before. A
  step's **Length** is measured to the next hit: 1 lasts until the next hit, 0.5 half of that gap.
- **Arpeggiator**: its next note on each hit. **Restart** stays on the bar: the first hit at or after
  the line it names starts the figure again.
- **Axis notes**: a move lands on the next hit instead of the next step of the grid.
- **Latent generator**: each hit plays the loop's next note, rests skipped, with the loop's velocity,
  for the time to the next hit (two beats at most). Its **Rate** is new too: on a note value it plays
  the loop at another speed (**1/16** as made, **1/8** at half speed).

While a generator follows hits, **Swing** does nothing (the hits bring their own feel) and stays set
for when it goes back to a note value.

The hits are the ones that really play: when the source drops a hit (its Chance, Euclid, a muted
voice), the follower drops it too. For probability on top, use the follower's own Chance.

## In a room and after a seek

The step a follower plays is the number of the source's hits **since beat 0**, never a count kept since
it started. Everyone in a <Term id="room">room</Term>, someone joining late and a jump in the timeline
all land on the same step.

## When the source goes

If the source is powered off, removed, or starts following a clock itself, the follower plays on its
last note value. Its choice stays saved and shows dimmed ("I · Kick · off"); it follows again as soon
as the source is back.
