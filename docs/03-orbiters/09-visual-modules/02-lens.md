---
title: Lens
sidebar_position: 2
sidebar_custom_props:
  icon: Aperture
---

The **Lens** changes the lens the Orbiter is seen through. It draws nothing: it opens and closes the
field of view, and slides the picture to one side. Add it with **Visual module +** on any body; no
sound module brings it.

<figure className="ps-doc-themed-figure">
  <iframe
    className="ps-doc-themed-image ps-doc-themed-image--light"
    src="/figures/orbiters/lens-light.html"
    title="The Orbiter's camera: the lens barrel is Width, the cross-slide is Shift, the knob on the console is Amount"
    loading="lazy"
    style={{ width: '100%', height: 710, border: 0 }}
  />
  <iframe
    className="ps-doc-themed-image ps-doc-themed-image--dark"
    src="/figures/orbiters/lens.html"
    title="The Orbiter's camera: the lens barrel is Width, the cross-slide is Shift, the knob on the console is Amount"
    loading="lazy"
    style={{ width: '100%', height: 710, border: 0 }}
  />
</figure>

Think of the Lens as the Orbiter's own camera, bolted to its hull. Move over the picture to work it:

| On the camera | In the Lens module |
|---|---|
| **The lens barrel** slides in and out | **Width**: in, the lens opens and the World pulls back; out, it closes and the World looms |
| **The two lines on the deck** | the field of view, as wide as the lens is open |
| **The cross-slide** under the camera | **Shift**: the camera moves one way and the picture slides the other |
| **The knob on the console** | **Amount**: how far Width and Shift move the lens |
| **The viewfinder** on the console | what you see: the World, larger or smaller, to one side or the other |

:::note[It loads doing nothing]

With **Width** and **Shift** at 0 % the view is the Orbiter's own. Turn one of them, or map it to an
<Term id="axis">axis</Term>, to see it.

:::

## Controls

| Control | What it does |
|---|---|
| **Width** | The field of view. Above 0 % the lens opens and the world pulls back into space; below 0 % it closes and the world looms. −100 … 100 %. |
| **Shift** | Slides the picture to one side: above 0 % to the right, below 0 % to the left. −100 … 100 %. |
| **Amount** | How far Width and Shift move the lens. 100 % as it loads; at 0 % the view is the Orbiter's own. |

Sound input, Sensitivity and While stopped are the same as on every
[visual module](/docs/orbiters/visual-modules). With Sensitivity up, the lens moves only as far as the
sound is loud, so it breathes with what plays.

## Good to know

- It changes the lens only: where the camera is and what it looks at stay as they are.
- Back at 0 %, the view is exactly the Orbiter's own again.
- The lens moves a little less on the low graphics setting, where a big swing on a small screen is
  uncomfortable.

## Mapping

Width, Shift and Amount can each be mapped to the dimension's axes: see [Edit](/docs/orbiters/edit).
Shift on the same axis as a panner's Pan makes the picture follow the sound from side to side.
