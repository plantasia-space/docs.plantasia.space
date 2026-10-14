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
| `landing` | The guest home page of plantasia.space-root (`src/components/guest/landing`), not a docs page | each runs by itself and answers taps. One `build.mjs` writes every figure of that page into root's `public/figures/landing` (`--out`): a picture per theme, `<name>.json`, and one `runtime.js` for all. It is built on the home machine's parts (`src/home-machine/parts.mjs`, ORB-633) |
| `orbiter-saucer` | Orbiters overview | a light on each of the ring's three tracks (X, Y, Z), one lap for the axis's full turn |
| `orbiter-console` | Interact | the three knobs (X, Y, Z), the World on the screen, and the marker on the effect each knob is mapped to |
| `module-families` (three figures) | Instruments, Audio effects, MIDI effects overviews | a place along the rack: which instrument plays, the sound passing three effects, a note going from generator to effect to instrument |
| `orbiter-sensors` | Sensors | the phone on its ball joint (turn, tip, roll) and the three knobs it turns |
| `home-machine` | Home page (`src/components/HomeFigure`) | runs by itself: Audios (balls) on their track, the Orbiter round the World, each part answering as a ball passes. Two arrangements of the same parts (`parts.mjs`): `orrery` for wide screens, `tower` for a narrow column |

## Shared marks

- **X, Y and Z are three knobs in a row, drawn as the app draws them** (`src/shared/knob.mjs`): a disc that
  fills from 6 o'clock to the needle, under a fixed rose of eight points, −180° to 180°, resting at 0°.
  Bruna, 13 Oct 2026: knobs, not sliders. Read them out in degrees with the module's `axesReadout`.
- **The screen matters**: an Orbiter is drawn as a part of its craft with a screen on it (the console),
  after the Orbiter controller Bruna is designing.
- **A hexagon is an axis's toggle**, never the axis.
- **A module is a box standing in the rack**, with what it does drawn on its lid (reels for an audio,
  keys for notes).
- **A part that turns in space** (the Sensors phone) is rebuilt by the page each frame: the build script's
  `prism()` draws a box on any plane with the kit's own tones. Copy it from `orbiter-sensors`.

## A figure with several objects (the home machine)

- One drawing of each entity lives in `src/home-machine/parts.mjs`: reuse them so every figure shares one World and one Orbiter.
- Each item sits in its own `<g data-k>` (its depth). The page only moves what the build drew: a mover follows a sampled track and is put back at its place in the back-to-front order as it goes.
- Its one accent is a ramp in `build.mjs` (`ACCENT`) round the Orbiters app's default Color C, `#33ff41` (`--orb-default-color3`).
- It writes a picture per arrangement and theme (`<name>-dark.svg`, `<name>-light.svg`) and a small `<name>.js` that only moves it. The page shows the picture first, then puts the same file on its stage and mounts the script: the drawing is downloaded once. Both files carry the build's id and the script refuses a picture from another build, so rebuild and commit them together.
- The page gives the description (translated) and sets it on the drawing after it mounts. It also owns the two buttons (`mount` returns its cleanup, with `.pause(on)` and `.sound(on)`).
- Sound is part of the figure's script: an event in `build.mjs` may carry a `voice`, played once as the part starts to answer. The notes are not written down: four chords in D major move on with each lap of the Orbiter, and each voice draws from the chord of the moment with some chance in it. It is off until the reader turns it on, and silent while paused.
- Build: `cd figures/src/home-machine && node build.mjs --preview` (writes into `static/figures/home`), then the line check and captures on `preview-orrery-*.html` and `preview-tower-*.html`.

## To polish next

- `src/components/docs/IsoFigure.kit.css` is the kit's stylesheet unchanged: its tones are the kit's
  greys, not yet Plantasia Space's colours.
- The Lens figure's Amount knob is drawn but does not turn.
- No still picture is shown before the script loads, or without JavaScript.
- A figure's `say` passes finished English text. For a Spanish page it should pass values and let the
  page word them.
- `IsoFigure` imports the figure through `new Function` to keep it out of the bundle: fine today (the
  site sets no Content-Security-Policy), to revisit if one is added.
- The Lens figure shows the mid and high graphics presets' swing (20°, 14°, 12 %); the low preset's is
  smaller (14°, 10°, 8 %), which is why the page says "up to".
- The figures' page code (`mount`: the tour, the pointer, the keys, the cleanup) is written out in each
  build script. One shared source in `src/shared/` would cover them all, the Lens included.
- While a figure's tour runs, its `aria-valuenow` and `aria-valuetext` are not kept up to date.
- The Sensors figure rests the phone upright and reads turn, tip and roll from there. The app's own
  reading away from a flat calibration has not been checked on a phone.
- Upstream's 4x close-up pass and its geometry audit have not been run on our figures.
- `kit/` still carries upstream's React and 3D parts, which we do not use yet.
