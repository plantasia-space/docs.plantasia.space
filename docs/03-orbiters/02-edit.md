---
title: Edit
wrapperClassName: doc-wrapper-icon-edit
sidebar_position: 3
sidebar_custom_props:
  icon: Pencil
---

Editing an Orbiter allows you to refine an existing instrument without creating a new one.

### Video: Editing an Orbiter

<video
  className="ps-doc-video"
  controls
  poster="/img/video-placeholder.svg"
>
  <source src="https://herbarium.plantasia.space/docs/en/media/orbiters/05-edit-orbiter.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## What can be edited

An Orbiter can be updated after release. You can edit:

- Orbiter image
- Orbital name (where allowed)
- Preview Audio and Entangled World (for testing)
- Panel design per dimension
- Engine mappings per dimension
- Collaboration and visibility settings

## Dimension awareness

Most Orbiter parameters are **dimension-specific**.

When editing, always check each dimension (1, 2, and 3) and verify:

- Panel styling is correct
- Engine mappings behave as expected

Copy / paste can be used for panel styling, but engine settings must be adjusted per dimension.

## Map a control to an axis

Press **Map** in the **Mappings** column (or **Shift+M**): the **X** axis on the stage turns red and every control shows a **map** badge. Touch a control and its mapping appears in the column with its **min**, **<Term id="equilibrium">equil</Term>** and **max**. Press **Mapping…** to leave Map mode, then move the axis: the control follows it. The [Quickstart](./00-quickstart.md#map) goes through it step by step.

<LoopVideo
  src="https://herbarium.plantasia.space/docs/en/media/orbiters/edit/map-a-knob"
  caption="Map, then the One Reverb's Amount: X · Amount appears in the Mappings column. Moving X turns Amount towards the room one way and the plate the other."
  label="Map mode on, the One Reverb's Amount touched, then the X axis moved up and down while the Amount knob follows it."
/>

Drag **min**, **equil** and **max** in the mapping to set how far the axis takes the control and where it rests:

<LoopVideo
  src="https://herbarium.plantasia.space/docs/en/media/orbiters/edit/min-equil-max"
  caption="Max and min drawn in, then equil moved to 20 %: with X at rest Amount now sits on 20 %, and X moves it within the new range."
  label="In the Mappings column, the max and min handles of X · Amount are dragged towards the middle, then the equil handle to 20 %; the X axis is then moved up and down and the Amount knob follows within the narrower range."
/>

The curve buttons under each side shape the way between: **Linear**, **Exponential** or **Logarithmic**, from min to equil and from equil to max.

<LoopVideo
  src="https://herbarium.plantasia.space/docs/en/media/orbiters/edit/curve"
  caption="X held halfway up: the equil → max curve moves Amount from 20 % (Linear) to 6 % (Exponential) and 37 % (Logarithmic). Then the same below rest, with min → equil."
  label="The X axis is moved halfway up, then the equil to max curve buttons are pressed and the Amount knob jumps to a new value for each; X is moved below rest and the min to equil curve buttons are pressed."
/>

## Iteration workflow

Orbiters are designed to be iterated.

You can:

- Test changes with different Audios
- Preview behavior in different Entangled Worlds
- Refine mappings gradually

## Saving and publishing changes

Your edits save themselves. A couple of seconds after you stop changing something, the Orbiter's draft is saved for you — there is no save button to remember.

The small disk icon at the top of the page shows where that has got to, and its dot changes colour as it goes: unsaved changes, saving, saved, or couldn't save. Hover it to read the current state. You can also click it to save straight away instead of waiting.

Saving only ever updates your draft. Anyone listening to your Orbiter keeps hearing the version you last published, so you can experiment freely.

When you are ready for your changes to reach everyone, press **Release Orbiter**. That step is always yours to take.

Images are the exception: a cover you upload is applied when you choose it, not by autosave.
