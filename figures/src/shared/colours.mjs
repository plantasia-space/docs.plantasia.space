// The docs figures' colours, from the page's entity tokens (the library's ENTITY: each token with the
// library's own fallback, for a picture shown alone). The one lit accent, the part the reader should
// watch, is the Orbiter's colour; a World drawn inside a figure (a screen, a viewfinder) is the World's.
// The light theme takes each a shade darker, as the library's stage does.
import { ENTITY } from "plantasia.space-design/anatomy/build";

const darker = (c) => `color-mix(in oklab,${c} 70%,#000)`;
const LIGHT = (sel) => `[data-theme="light"] ${sel},.iso-svg[data-theme="light"] ${sel.replace(/^\.iso-svg /, "")}`;

// Set on the drawing's own pieces (not the <svg>), so they win over the kit's theme values on it.
export const COLOURS = "<style>"
  + `.iso-svg *{--anatomy-lit:${ENTITY.orb}}${LIGHT(".iso-svg *")}{--anatomy-lit:${darker(ENTITY.orb)}}`
  + `.iso-svg .lf-wld{--anatomy-hi:${ENTITY.wld}}${LIGHT(".iso-svg .lf-wld")}{--anatomy-hi:${darker(ENTITY.wld)}}`
  + "</style>";
