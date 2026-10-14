---
name: ps-docs-figures
description: Draw a live isometric figure for a docs.plantasia.space page - one real object (a part of an Orbiter, drawn as spaceship hardware) whose working is the idea being explained. Use when a docs page needs a picture that a screenshot cannot give - "make a diagram of X", "explain X with a figure", "a picture for the Lens page".
---

# Docs figures (Plantasia Space)

**The method, the house rules, the shared marks and the checks are the shared `ps-anatomy` skill**
(`skills-in-use/ps-anatomy`): read it first. The kit is the design library's
(`plantasia.space-design/anatomy/build`), and the checks are `npx ps-anatomy …`. This file keeps only
what is particular to the docs. The kit started from Anatomy (MIT, `LICENSE-anatomy` here, because
every built figure below carries the kit's code inline).

## Docs only

- **One lit accent**, the part the reader should watch; everything else in the kit's tones (the guest
  home's entity colours are not for docs pages).
- **A figure is one module**: `figures/src/<name>/build.mjs` writes `static/figures/<area>/<name>.js`,
  exporting `svg` (the stage) and `mount(root, say)` (returns a cleanup), with the kit inlined
  (`kitSource()`). Built files are committed: the site build does not run the kit.
- **In a page**: `<IsoFigure name="orbiters/lens" label="what the drawing shows">caption</IsoFigure>`
  (`src/components/docs/IsoFigure.jsx`, on the lib's `useAnatomyModule`, available on every page).
  It follows the site's theme. What the figure says as it moves (`say`) is written under it.
- **The home machine** is the scene kind instead (a picture per theme, `<name>.js` that moves it):
  `src/components/HomeFigure`, built by `figures/src/home-machine/build.mjs` into `static/figures/home`.
  Its sound is its own script's: off until the reader turns it on, silent while paused.

```bash
cd figures/src/orbiter-lens
node build.mjs --preview --out=../../../static/figures/orbiters   # lens.js, and preview pages here
npx ps-anatomy check .                                             # must print "line ends 0", dark and light
npx ps-anatomy capture preview-dark.html --select "#fig" --reduced --out shots/dark.png
```

## Figures here

| Figure | Page | What moves |
|---|---|---|
| `orbiter-lens` | Visual modules, Lens | the lens barrel (Width), the cross-slide (Shift); the viewfinder shows the World |
| `orbiter-saucer` | Orbiters overview | a light on each of the ring's three tracks (X, Y, Z), one lap for the axis's full turn |
| `orbiter-console` | Interact | the three knobs (X, Y, Z), the World on the screen, the marker on the effect each knob is mapped to |
| `module-families` (three figures) | Instruments, Audio effects, MIDI effects overviews | which instrument plays, the sound passing three effects, a note going from generator to effect to instrument |
| `orbiter-sensors` | Sensors | the phone on its ball joint (turn, tip, roll) and the three knobs it turns |
| `home-machine` | Home page | Audios on their track, the Orbiter round the World, each part answering; `orrery` wide, `tower` narrow |

The knob drawing every docs figure shares is `figures/src/shared/knob.mjs`. A part that turns in
space (the Sensors phone) is rebuilt by the page each frame with `prism()` from `orbiter-sensors`.

## To polish next (docs)

- The Lens figure's Amount knob is drawn but does not turn. It shows the mid and high graphics
  presets' swing (20°, 14°, 12 %); the low preset's is smaller, which is why the page says "up to".
- No still picture is shown before a module figure's script loads, or without JavaScript.
- `IsoFigure` imports the figure by URL out of the bundle's sight (fine without a Content-Security-Policy).
- The Sensors figure rests the phone upright; the app's reading away from a flat calibration has not
  been checked on a phone.
