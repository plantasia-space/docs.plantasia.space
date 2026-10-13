---
name: ps-docs-figures
description: Draw a live isometric figure for a docs.plantasia.space page - one real object (a part of an Orbiter, drawn as spaceship hardware) whose working is the idea being explained. Use when a docs page needs a picture that a screenshot cannot give - "make a diagram of X", "explain X with a figure", "a picture for the Lens page".
---

# Docs figures (Plantasia Space)

Our house style for explanatory figures, started on ORB-630 (the Lens page). It is built on the
Anatomy skill (MIT, `LICENSE-anatomy`), whose kit, scripts and references are copied here so we can
polish them. Upstream's full method is `references/anatomy-upstream.md`: read it before a new figure.
This file is the notebook of what we changed and decided; add to it as the style settles.

## House rules (these win over upstream)

1. **The object alone.** No card, no frame, no title, no "Fig n", no hint, no background. The figure
   is the object on the page, in the page's own theme.
2. **No words in the drawing.** Not a readout, not a legend, not an engraved label. The page explains:
   a short table under the figure names each part and what it stands for, in the page's own text.
   What the figure reports as it moves goes through `say(text)` and is written under it by the page.
3. **An Orbiter is a spaceship.** Draw the idea as hardware that belongs on one: a camera on a hull
   deck, a rack, a dish, a console. One object per figure, recognisable at a glance.
4. **True numbers.** Take ranges and behaviour from the app's source (a module's `manifest.ts`, its
   engine code), put them in the build script's constants, and name the source file in a comment.
5. **One lit accent**: the part the reader should watch. Everything else stays in the kit's four tones.
6. **House wording** in every string the reader sees (the `say` text, the aria label): plain words,
   no em dashes, units after the value, "axis", "Plantasia Space".

## How a figure is made

- Source: `figures/src/<name>/build.mjs`, on the kit in `figures/kit/`.
- Output: one ES module, `static/figures/<area>/<name>.js`, exporting `svg` (the stage markup) and
  `mount(root, say)` (returns a cleanup). Built files are committed: the site build does not run the kit.
- In a page: `<IsoFigure name="orbiters/lens" label="what the drawing shows">caption</IsoFigure>`
  (`src/components/docs/IsoFigure.jsx`, available on every docs page). It follows the site's theme.

```bash
cd figures/src/orbiter-lens
node build.mjs --preview --out=../../../static/figures/orbiters   # lens.js, and two bare preview pages here
node ../../scripts/lines.mjs preview-dark.html                     # must print "line ends: 0"
node ../../scripts/lines.mjs preview-light.html
node ../../scripts/capture.mjs preview-dark.html --select "#fig" --out shots/dark.png --reduced
```

Read every capture: at rest, at both ends of each control, light and dark, and at 390 px wide.
The checks need Node 20.10+ and Chrome. Previews and shots are not committed (`figures/.gitignore`).

## Figures so far

| Figure | Page | What moves |
|---|---|---|
| `orbiter-lens` | Visual modules, Lens | the lens barrel (Width), the cross-slide (Shift); the viewfinder shows the World |

## To polish next

- `src/components/docs/IsoFigure.kit.css` is the kit's stylesheet unchanged: its tones are the kit's
  greys, not yet Plantasia Space's colours.
- The Lens figure's Amount knob is drawn but does not turn.
- No still picture is shown before the script loads, or without JavaScript.
- Upstream's 4x close-up pass and its geometry audit have not been run on our figures.
- `kit/` still carries upstream's React and 3D parts, which we do not use yet.
