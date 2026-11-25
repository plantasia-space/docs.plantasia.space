---
title: Your first Entangled World in 10 minutes
sidebar_label: Quickstart
description: Make an Entangled World from a real exoplanet (a name, a story and a texture) and release it.
sidebar_position: 1.5
sidebar_custom_props:
  icon: Rocket
---

In ten minutes you make a small Entangled World: a real exoplanet, a name, a story written with AI and a texture for the planet. Then you release it. You need to be signed in to Plantasia Space, and the story and the texture use a few credits (their price is on each button).

<StepFlow
  stacked
  groups={[
    { label: 'Release menu', steps: [{ n: 1, label: 'New Entangled World', href: '#start' }] },
    { label: 'Origin', steps: [
      { n: 2, label: 'Pick a planet', href: '#exoplanet' },
      { n: 3, label: 'Name it', href: '#name' },
    ] },
    { label: 'Story', steps: [
      { n: 4, label: 'Shape it', href: '#elementals' },
      { n: 5, label: 'Write the story', href: '#text' },
    ] },
    { label: 'Landscape', steps: [{ n: 6, label: 'Make its texture', href: '#texture' }] },
    { label: 'Release', steps: [{ n: 7, label: 'Release it', href: '#release' }] },
  ]}
/>

## 1. Start a new world {#start}

Open **Release → New Entangled World**. The world opens in **World Studio**, on its first step, **Origin**. The four steps are at the top of the page; your work is saved as a draft as you go.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/plantasia-space/release/release-menu.jpg"
  alt="The side bar with Release open: New Audio, New Entangled World, New Orbiter, New Collection and New Clip."
  width={360}
/>

## 2. Pick a planet {#exoplanet}

The stage is a map of the whole sky. Every **blue dot** is a star with planets a world can come from. Pick one on the map:

- **Drag** to move around the sky, and zoom with the mouse wheel, a pinch or the zoom buttons under the map.
- A **ring** follows your pointer to the nearest blue dot. **Click** to pick it.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/origin-sky-pick.jpg"
  alt="The sky map zoomed in on Virgo and Sextans: the blue dots are stars with planets, and a ring under the pointer marks the nearest one, ready to pick."
  wide
  dots={[[2, 33.3, 41]]}
/>

Or type a name or a number in the search box above the sky, or pick one of the suggested planets there. Once a planet is picked, its crosshair shows on the map and the stage shows how much sunlight it gets, how hot it is and how far away it is.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/origin-sky.jpg"
  alt="The Origin step: the exoplanet search above the sky map with NGTS-9 b picked, and the three facts on the left."
  wide
/>

## 3. Name it {#name}

In the **Artistic Name** card, type a name, or pick a kingdom (Plantae, Fungi or Animalia) and generate one. The card tells you if the name is free.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/origin-cards.jpg"
  alt="The Astronomical Body card, and the Artistic Name card with Flatfish and Name is available."
  wide
  dots={[[3, 84.7, 8.9]]}
/>

## 4. Shape it {#elementals}

Open the **Story** step. The drawer holds the world's elementals: its geography, flora, fauna, society, history and elements. For a quick start, press **Random** at the top of the page; you can change any card later.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/studio-top-bar.jpg"
  alt="The bar at the top of World Studio, with Presets and Random on the right in the Story step."
  wide
  dots={[[4, 84.3, 50]]}
/>

## 5. Write the story {#text}

In the inspector, on the **Text** tab, keep the tone, format and language or change them, then select the white button under the AI model, with the price of the story. The seven chapters appear on the stage. You can rewrite any of them yourself.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/story-text.jpg"
  alt="The Text tab of the inspector: Whole story with Tone, Format, Point of View, Narration language, the AI model and its price, and Regenerate."
  width={300}
  dots={[[5, 95, 90.6]]}
/>

## 6. Make its texture {#texture}

Open the **Landscape** step and scroll the drawer to the **Surface** card. Press **Generate**, then select the texture you like: the planet wears it. A world needs a selected texture to be released.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/landscape-surface.jpg"
  alt="The Surface card: the texture the world wears, three World Textures with one selected, the Style settings and Generate."
  wide
  dots={[[6, 97, 70.9]]}
/>

## 7. Release it {#release}

Open the **Release** step. **World Readiness** lists what is done; when it is complete, select **Release Entangled World**. Your world now has its own page on Plantasia Space. (On a world already released, the button reads **Release Changes**, as in the picture.)

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/release-panel.jpg"
  alt="The Release step's inspector: Cover with Capture the world and Upload image, World Readiness with its checklist, and the release button."
  width={300}
  dots={[[7, 5, 96.5]]}
/>

For the same steps as cards inside World Studio, open **Tutorials → Your first Entangled World**.

## Next

- **Give it a voice**: one voice reads the whole story, and each chapter can show its own picture. See [Release](./01-release.md#voice).
- **A cover and people**: capture the world as its cover and invite xPlorers to work on it, in [Release](./01-release.md#cover).
- **Release the story as an Audio**, in [The story as audio](./05-story-audio.md).
- **Make a Clip**: a short video of your world with music, in [Studio & Clips](./04-studio.md).
