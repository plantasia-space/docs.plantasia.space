---
title: Release
sidebar_position: 2
sidebar_custom_props:
  icon: ReleaseIcon
---

## Where to start {#start}

Go to **Release → New Entangled World**.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/plantasia-space/release/release-menu.jpg"
  alt="The side bar with Release open: New Audio, New Entangled World, New Orbiter, New Collection and New Clip."
  width={360}
/>

The new world opens in **World Studio**. You make it in four steps, shown at the top of the page: **Origin**, **Story**, **Landscape** and **Release**. You can move between them in any order, and your work is saved as a draft as you go. The numbers below are the parts of each step, in the order they appear.

<StepFlow
  stacked
  groups={[
    { label: 'Origin', steps: [
      { n: 1, label: 'Choose an exoplanet', href: '#exoplanet' },
      { n: 2, label: 'Read the planet', href: '#planet' },
      { n: 3, label: 'Name your world', href: '#name' },
    ] },
    { label: 'Story', steps: [
      { n: 4, label: 'Shape the elementals', href: '#elementals' },
      { n: 5, label: 'Write the story', href: '#text' },
      { n: 6, label: 'Give it a voice', href: '#voice' },
    ] },
    { label: 'Landscape', steps: [
      { n: 7, label: 'Look at the world', href: '#world' },
      { n: 8, label: 'Make the texture', href: '#texture' },
      { n: 9, label: 'Pin the pictures', href: '#pictures' },
    ] },
    { label: 'Release', steps: [
      { n: 10, label: 'Cover', href: '#cover' },
      { n: 11, label: 'Collaboration', href: '#collaboration' },
      { n: 12, label: 'World Readiness', href: '#readiness' },
      { n: 13, label: 'Release', href: '#release' },
    ] },
  ]}
/>

For a guided first run, open **Tutorials → Your first Entangled World**: cards walk you through the same steps in World Studio itself.

Depending on your plan, you can have a limited number of worlds, released or draft. See [Plans and credits](/docs/plantasia-space/plans-and-credits).

## How World Studio is laid out {#layout}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/studio-layout.jpg"
  alt="World Studio on the Story step of Flatfish: the story on the stage, the Geography card in the drawer below, and the Text settings in the inspector on the right."
  dots={[['A', 39, 41], ['B', 49, 69], ['C', 89.6, 27]]}
/>

- **A. The stage** fills the page: the sky, the story or the world in 3D, depending on the step.
- **B. The drawer**, at the bottom, holds the step's cards. Scroll it sideways, or drag its top edge to make it taller. When the cards don't fit, a strip under them shows one block per card: drag or click it to move along.
- **C. The inspector**, on the right, holds the step's settings. Origin has none.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/studio-top-bar.jpg"
  alt="The bar at the top of World Studio: Toggle modules, Toggle inspector, Undo, Redo, the four steps, the save dot, Ask Orchidea and Exit studio."
  wide
/>

The bar at the top, from left to right:

- **Toggle modules** and **Toggle inspector** show or hide the drawer and the inspector
- **Undo** and **Redo**
- The four steps
- **Presets** and **Random**, on the Story step only (see [4](#elementals))
- A dot that shows whether your last change is saved
- **Ask Orchidea**, the flower, opens [Orchidea](/docs/plantasia-space/orchidea), the assistant
- **Exit studio** takes you back to Plantasia Space

### On a phone

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/studio-phone.jpg"
  alt="World Studio on a phone, reading Step 2 of 4 · Story at the top, with the story and the Geography card below it."
  width={360}
/>

The top of the page reads **Step 2 of 4 · Story**: tap it to list the steps and go to another. The inspector opens as a sheet from the bottom, the drawer's cards scroll sideways, and Release is a single column. Orchidea opens over the whole page.

## Origin

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/origin-sky.jpg"
  alt="The Origin step: the exoplanet search above the sky map with NGTS-9 b picked, the three facts on the left, and the map buttons with Whole sky on the right."
  wide
  dots={[[2, 8.2, 29.6]]}
/>

### 1. Choose an exoplanet {#exoplanet}

Every world comes from a real exoplanet. The stage is a map of the whole sky, and every **blue dot** is a star with planets a world can come from. Drag to move around it and zoom with the wheel, a pinch or the zoom buttons; a **ring** follows your pointer to the nearest blue dot, and a click picks it.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/origin-sky-pick.jpg"
  alt="The sky map zoomed in on Virgo and Sextans: the blue dots are stars with planets, and a ring under the pointer marks the nearest one, ready to pick."
  wide
  dots={[[1, 33.3, 41]]}
/>

You can also search by name or number in the box above the sky, or pick one of the suggested planets there. The planet's data sets the rates of an Orbiter's Cosmic LFO; beyond that, which planet you choose is an artistic choice.

The buttons under the map zoom, center on your planet, go back to the **Whole sky**, and choose which **Layers** show: Exoplanets, Night sky and Guides. You can change the exoplanet later.

### 2. Read the planet {#planet}

Once a planet is picked, the stage shows three facts about it: the **sunlight** it gets compared with Earth, its **equilibrium temperature**, and its **distance** in light-years, with the year its light left and the year it was found. On a phone, they are behind **Planet facts**.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/origin-cards.jpg"
  alt="The Astronomical Body card with the orbit of NGTS-9 b drawn to scale, and the Artistic Name card with Flatfish and Name is available."
  wide
  dots={[[2, 17.1, 8.9], [3, 84.7, 8.9]]}
/>

The **Astronomical Body** card draws the planet's system to scale: every known planet of its star on its orbit, beside Earth's orbit for comparison. Orbits are drawn as circles, since the catalog has no orbit shapes.

### 3. Name your world {#name}

The **Artistic Name** card sets the world's name, and tells you if another world already has it. For a starting point, pick a kingdom (Plantae, Fungi or Animalia) and generate one.

## Story

### 4. Shape the elementals {#elementals}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/story-elementals.jpg"
  alt="The Geography card in the drawer: its figure, the kind of planet, and the biomes and waters to choose from."
  wide
  dots={[[4, 59.5, 8]]}
/>

The drawer holds the world's elementals as cards: **Geography**, **Flora**, **Fauna**, **Society**, **History** and **Elements**. They are the world's identity: the story, the texture and the pictures are all made from them.

Set each card by hand, or use **Presets** and **Random** at the top of the page. **Reset**, in the Presets menu, goes back to the starting values.

### 5. Write the story {#text}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/story-text.jpg"
  alt="The Text tab of the inspector: Whole story with Tone, Format, Point of View, Narration language, the AI model and its price, and Regenerate."
  width={300}
  dots={[[5, 95, 90.6]]}
/>

The stage shows the story as the world page will show it, in seven chapters: World Intro, Geography, Flora, Fauna, Society, History and Narrative Coda. Each one becomes a part of the [world page](./index.mdx#the-world-page).

In the inspector, under **Text**, choose the tone, format, point of view and language, and the AI model (its price in credits is on the button). Generate the whole story, or open one chapter to make only that one again. You can also write or change any chapter yourself, up to 2000 characters.

### 6. Give it a voice {#voice}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/story-voice-made.jpg"
  alt="The Voice tab of the inspector with a voice made: Your own voice, then Made voice with the voice July, its speed, the AI model and Make speech again."
  width={300}
  dots={[[6, 95, 89.9]]}
/>

On the **Voice** tab, under **Made voice**, one AI voice reads the whole story. Choose the voice, its speed and its instructions (its character, mood and pace), then select **Make speech**. While it plays, the line being read lights up on the stage.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/story-listen.jpg"
  alt="A chapter on the stage once it has a voice: World Intro with Listen and its length, 0:41."
  width={480}
/>

Under **Your own voice**, you can read a chapter yourself: open it and upload your recording, up to 20 minutes. It plays like a generated voice and costs no credits.

Each chapter keeps up to ten versions of its voice: play any of them and pick the one that reads the chapter. If you change a chapter's text after its voice was made, it shows **Older than the text** until you select **Make speech again**.

## Landscape

### 7. Look at the world {#world}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/landscape-world.jpg"
  alt="The Landscape step: Flatfish in 3D with its moons, the World, Moon and Star selector on the left, Pictures in the inspector, and the Starfield and Star cards in the drawer."
  dots={[[7, 5.5, 53.8]]}
/>

The stage shows the world in 3D. Drag to turn it and zoom to get closer. The buttons on the left of the stage move the camera to the **World**, its **Moon** or its **Star**, and bring that body's cards into view.

The drawer's cards shape what you see: **Starfield**, **Star**, **Light**, **Shell**, **Surface**, **Clouds** and **Moons**. The starfield is the real sky as seen from the world's star; its **How this sky is made** button explains how.

### 8. Make the texture {#texture}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/landscape-surface.jpg"
  alt="The Surface card: the texture the world wears, three World Textures with one selected, the Style settings and Generate."
  wide
  dots={[[8, 97, 70.9]]}
/>

In the **Surface** card, generate the planet's texture. Choose the AI model and guide it with its style: art medium, technique, and color and light. Then select the texture the world wears. A world needs a selected texture to be released.

### 9. Pin the pictures {#pictures}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/landscape-pictures.jpg"
  alt="World Intro open in Landscape: its figure on the stage with the pin under it, and in the inspector the figure, Make a picture and Upload."
  dots={[[9, 43.5, 93.2]]}
/>

The inspector holds the pictures of the seven chapters. Each one has its figure (a drawing World Studio makes for it) and up to ten pictures.

Open a chapter and its pictures take the stage, in place of the world and the drawer. Swipe the stage (or select a picture in the inspector) to look through them, and pinch or double-tap to zoom. Looking changes nothing: select the **pin** under a picture to make it the one the world page shows. Until a picture is pinned, the figure shows.

In the inspector you can make a picture from the chapter's text, upload your own, or remove one. A chapter needs its text before a picture can be made from it. Pictures can share the texture's look or have their own.

Textures, stories, voices and pictures made with AI are paid with your credits. See [Plans and credits](/docs/plantasia-space/plans-and-credits).

## Release

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/release-panel.jpg"
  alt="The Release step's inspector: Cover with Capture the world and Upload image, World Readiness with its checklist, and Release Changes."
  width={300}
  dots={[[10, 35, 9.8], [12, 4.5, 48.5], [13, 5, 96.5]]}
/>

### 10. Cover {#cover}

Turn and zoom the world on the stage, pick its World, Moon or Star, then select **Capture the world**. Or upload an image. The cover is shown in a circle. Without one, the world's DNA figure stands in for it.

### 11. Collaboration {#collaboration}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/release/collaboration.jpg"
  alt="Collaboration: Add xPlorers with the role menu set to Viewer and the search box."
  width={300}
  dots={[[11, 60, 12.2]]}
/>

**Add xPlorers** and give each a role:

- **Viewer** can view the world
- **Publisher** can also publish Audios inside it, and release the world
- **Editor** can also edit the world and change who works on it

Under **General Access**, keep the world **Restricted** or open it to **Anyone with the link**. Only the owner can change General Access.

Below Collaboration, **Release the story as audio** joins the voiced chapters into one Audio. See [The story as audio](./05-story-audio.md).

### 12. Licence {#licence}

A World is released under **Creative Commons BY 4.0**: others can use and adapt it if they credit
you. Turn on **Noncommercial** to make it **BY-NC 4.0**, which also rules out commercial use. Clips
made from the World take its licence. Only the owner can change it. See [Licences](/docs/plantasia-space/sharing#licences).

### 13. World Readiness {#readiness}

The checklist shows what the world still needs. A step with something missing has its own **Go to** button.

To be released, a world needs:

- A real **Exoplanet** and a **Name** (Origin)
- A **Texture selected** (Landscape)
- **No AI job running**
- **Permission**: only the owner and publishers can release a world

**Elementals**, a **Story** and a **Cover** are recommended, not required.

### 14. Release {#release}

Select **Release Entangled World** when you want others to explore and use the world. After that, the button reads **Release Changes**: see [Edit](./02-edit.md).
