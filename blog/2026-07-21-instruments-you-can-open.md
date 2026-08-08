---
title: Instruments you can open
description: On visible mechanism — why the sound you hear should show you where it comes from, and why Plantasia Space is now open source.
slug: instruments-you-can-open
authors: [plantasia]
tags: [updates]
image: https://dev-herbarium.plantasia.space/image-assets/plantae/common-objects-sea-shore/common-objects-sea-shore-019.png
image_credit: "Subjects(s) - Wood, J. G., & Evans, E. (1859). The common objects of the sea shore : including hints for an aquarium. Routledge, Warnes & Routledge. https://www.biodiversitylibrary.org/item/138181"
---

An acoustic instrument hides nothing from you.

<!-- truncate -->

Open a piano and the mechanism is right there — hammer, string, damper, felt. Press a key slowly enough and you can watch the precise event that makes the sound. Learning to play and learning how the thing works turn out to be closely related activities. The instrument teaches you about itself while you use it.

Electroacoustic sound broke that relationship, and R. Murray Schafer gave one part of the break a name: schizophonia, the split between an original sound and its reproduction [1]. He was writing about recording. The split kept widening after him. A great deal of music software now arrives as a box with a result on the far side, and the newest generative tools take the arrangement to its conclusion — a prompt goes in, finished music comes out, and the mechanism between them is hidden and owned by someone else.

My problem with this isn't that it's too easy. Easy is good. A low floor is the point.

My problem is that hidden mechanism makes a particular kind of learning impossible. **You can't build intuition about a process you're never allowed to watch.** You can develop taste in the results and preferences among the outputs, but the relationship stays consumer-shaped.

Most of what we built this past month is, from a certain angle, one long argument with that arrangement. It arrives by degrees.

The shallowest degree is being able to *see* it. Orbiters run on a new sound engine — you can stretch an audio without dragging its pitch along, play it backwards, break it into grains with granular synthesis. What matters to me more than the list is that every effect now has its own visual behaviour in the scene. The grains you hear have something to look at. You can see what you're hearing, and after a while you start to anticipate it.

A degree further is being able to *set* it. The home feed became something you choose rather than something chosen for you: four modes behind a switcher in the corner — a blend, strict chronology, what people are playing, and older work you may have missed. It runs on counts we already had. There's no new tracking, and no profile of you assembled in the background to guess what you'd like. The ordering is a decision you make, and you can change it in a second.

The last degree took us years to reach, and we reached it this month. **Plantasia Space is open source.**

Orbiters and Entangled Worlds — the applications themselves, not a demonstration of them — are public on GitHub. So is the runtime they share: the Three.js rendering, and the clock that holds everything in time. So is the design system. All of it at [github.com/plantasia-space](https://github.com/plantasia-space).

The licences are where the intention actually sits, and they aren't the same on purpose. The shared libraries are MIT — take them, build something unrelated, owe us nothing. The instruments are AGPL — build on them, and your version stays open too. One is a gift. The other is a condition. **An instrument you can open should stay openable.**

I want to be accurate about what this is, because "open source" gets announced more often than it gets practised. The repositories are public and licensed. The contributor documentation isn't written yet. Nobody has forked anything, and nobody has sent a patch. What exists today is permission — the rest is a practice, and practices take longer than releases.

There's a smaller thing I'm equally attached to. Every orbiter anyone had already made plays exactly as it did before. New engine underneath, no broken instruments on top. What people built stays theirs, in working order.

None of this makes anyone a better musician on its own. Visible mechanism is a precondition, not a method.

But an instrument you can open outlives the people who made it. A piano keeps working whether or not its manufacturer is still in business, because anyone can take the lid off and understand what's inside. That's the property I want this to have — a mechanism you can inspect, rather than a company you have to trust.

The lid is off. What would you do with it?

---

### References

[1] R. Murray Schafer, *The Tuning of the World* (1977)
