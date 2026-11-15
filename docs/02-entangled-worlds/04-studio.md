---
title: Studio & Clips
sidebar_position: 6
sidebar_custom_props:
  icon: Clapperboard
---

A **Clip** is a short video made from an Entangled World: the world on screen, with music, the world's voice reading a chapter, or both, and text, pictures and camera moves on a timeline. You make it in **Clip Studio**.

Released Clips show on the world's page, in the **Clips** tab of the home feed, and in search under the **Clips** filter. Your own are under **My Clips**.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/studio/clips-feed.jpg"
  alt="The home feed on its Clips tab, showing a Clip of the world Flatfish."
  width={600}
/>

<StepFlow
  groups={[
    { label: 'Create clip', steps: [{ n: 1, label: 'Choose the world', href: '#start' }] },
    { label: 'Clip Studio', steps: [
      { n: 2, label: 'Select audio', href: '#audio' },
      { n: 3, label: 'Set animations', href: '#animations' },
      { n: 4, label: 'Export', href: '#export' },
      { n: 5, label: 'Release Clip', href: '#release' },
    ] },
  ]}
/>

## 1. Choose the world {#start}

Go to **Release → New Clip**, or open the **Release** menu on a world's page. In **Create clip**, choose the Entangled World and its **Section** (the chapter the Clip is about), then select **Open clip studio**.

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/studio/create-clip.jpg"
  alt="The Create clip dialog with Flatfish selected among the available worlds, and Open clip studio."
  width={480}
  dots={[[1, 76.9, 96.3]]}
/>

Depending on your plan, you can make a limited number of Clips per world. See [Plans and credits](/docs/plantasia-space/plans-and-credits).

## 2. Select audio {#audio}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/studio/select-audio.jpg"
  alt="Select audio: the audio search with Exraña Señal Luminosa chosen."
  width={480}
  dots={[[2, 49.6, 25.6]]}
/>

Search for the Audio that plays under the Clip, or pick a suggested one. When the Clip's section has a voice, the **Voice-over** card lets the voice read it in the Clip: switch it on or off. A Clip can have music, the voice, or both. A Clip with only the voice starts out the same length as the voice.

Picking an Audio takes you to the next step. On the timeline, you choose which part of it plays.

## 3. Set animations {#animations}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/studio/set-animations.jpg"
  alt="Set animations: the world on the canvas, the elements bar and the timeline with the Music track below it, and the Scene settings in the inspector."
  dots={[['A', 43.9, 58], ['B', 39.8, 28.5], ['C', 44.2, 80], ['D', 84.5, 27.2]]}
/>

This is where the Clip is made: a live canvas of your world, with a timeline under it.

- **A. Elements**: the bar above the timeline adds **Text**, an **Image**, a **Video**, a **World** camera move or a **Shape**
- **B. The canvas** shows the Clip as it plays
- **C. The timeline** places each element in time
- **D. The inspector** sets the selected element (**Element**) or the whole Clip (**Scene**)

### The timeline

The **Music** and **Voice** tracks each have their own **Level** and mute. Drag the music to choose which part of the Audio plays; its fade in and fade out are set on the music track.

The voice's **Subtitles** have their own track. With **Link to voice** on, the voice and its subtitles move as one block.

### Scene and elements

Under **Scene**, the **Clip** tab holds the Clip's name, its aspect ratio and its theme **Preset** (or your own colors). The **Text** tab sets the text style: size, font, alignment and background. The **World** tab sets the camera moves: a preset such as **Calm orbit**, **Drift** or **Arrival**, or **Custom**, and how many moves the Clip has (**Sparse**, **Balanced** or **Dense**). Text animates by phrases, words or both.

Select any element to change it in the inspector. Scene settings are the defaults, and each element can set its own.

### Ask Orchidea

With a Bloom plan or above, the flower in Clip Studio's header opens [Orchidea](/docs/plantasia-space/orchidea), the assistant, beside the canvas. Ask in plain words and it makes the change in your Clip:

- The look: theme, font, text size and alignment, and how often the camera moves
- Elements and the timeline: add or remove text, images and camera moves, change their timing and animation
- The sound: switch the voice-over and its subtitles on or off, set each track's level, mute a track
- Pictures: it places pictures you uploaded to this world, from the shared library or from the old library's plates, or makes a new square picture with AI from a prompt
- Picture edits: it changes one of those pictures with AI from a prompt ("make it night", "remove the background and leave only the flower"). The edit is a new picture and the original stays. It can also cut out the subject on a transparent background
- Texts written with AI, from a prompt

Texts, pictures and picture edits made with AI cost credits, depending on the model, and Orchidea asks before each one. Every picture is checked, both what you ask for and what is made: one that isn't allowed on Plantasia Space isn't made or kept, and its credits come back.

Each request is one step in Clip Studio's undo. To let Orchidea write texts and make pictures without asking, turn off **Ask before using credits** in its **⋯** menu; it asks again in every new conversation. Orchidea always asks before anything that affects other people.

## 4. Export {#export}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/studio/export.jpg"
  alt="Export options: Landscape, Square, Vertical and Portrait, the resolution of the chosen one, Capture video, Release Clip without video and Back to editor."
  width={520}
  dots={[[4, 95, 69.4]]}
/>

Choose the shape of the video:

- **Landscape**: YouTube / web
- **Square**: Social feed
- **Vertical**: Reels / Shorts
- **Portrait**: Feed post

Select **Capture video** to record it. A capture window opens: accept the share prompt there, then keep both windows open and unchanged until the recording finishes. Or choose **Release Clip without video** to release the animation without a recording.

Capturing works in desktop Chrome, Edge and Firefox. In Safari and on a phone there is no Export step: the Clip is released without a video.

## 5. Release Clip {#release}

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/studio/release-bar.jpg"
  alt="The bar at the bottom of the Release Clip step: Back, Thumbnail and Release Clip."
  wide
  dots={[[5, 81.9, 58]]}
/>

Look over your Clip before you release it. The bar at the bottom has:

- **Thumbnail**: capture a frame or upload an image. A Clip needs one to be released
- **Release Clip**, to publish it

A Clip not released yet also has **Draft**, to keep it and come back later. With a recording, the bar also has **Download**, and a switch between the **Animation** and the **Recording**.

A Clip is never more visible than its world: if the world is private, the Clip stays private too.

## Who can work on a Clip {#who-can-work-on-a-clip}

A Clip follows the roles of its Entangled World (see [Sharing](/docs/plantasia-space/sharing#individual-xplorer-permissions)), and you always keep full control of the Clips you make:

<RoleGrid id="clip-roles" />

A Clip's Studio link asks you to sign in first if you're signed out, and shows a page saying so if the Clip isn't yours to edit.

Whoever works on a Clip, it stays its maker's: it's released under their name, and its Audio must be one they are allowed to use. Credits for pictures and texts made with AI come from whoever asks for them.

## Manage your Clips

<ModulePicture
  src="https://herbarium.plantasia.space/docs/en/media/worlds/studio/clip-menu.jpg"
  alt="A Clip in the feed with its More options menu open: Share, Edit, Archive and Delete, and the download button on the left."
  wide
/>

From **My Clips** or the Clip's page, you can:

- **Download** the video as **Original** or **Compressed (MP4)**. Only for Clips with a recording, and for two weeks after the capture. After that the animation stays, and you can capture it again whenever you like.
- **Archive** a Clip: it is hidden from feeds and profiles and kept private to you. Archived Clips can't be edited and don't count toward your plan limits. You can restore them at any time.
- **Delete** a Clip permanently: its files are removed and direct links stop working. This can't be undone.

Every Clip credits the Entangled World it was made from and the Audio it uses, with the Audio's license.
