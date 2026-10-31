// By file path: Docusaurus loads plugins through jiti, which turns this import into a `require`, and the
// design library exports `./theme` for `import` only. jiti still transpiles the ES module at this path.
import { buildFontCss, DEFAULT_THEME_PRESET_ID, getPreset, loadThemeCatalog } from '../../../node_modules/plantasia.space-design/dist/theme.js';

// The dashboard's default-theme fonts, written into every page's <head> as the same
// `<style id="theme-fonts">` root renders on its server: --font-sans / --font-serif / --font-mono /
// --font-title, read from the theme catalog the dashboard publishes. The faces themselves come from
// the design library (`plantasia.space-design/styles/fonts.css`), so no page asks a font host.
//
// Read once per build (and once per `docusaurus start`): a dashboard edit reaches the docs on the next
// deploy. A catalog that cannot be read fails the build; there is no font named here to fall back to.
export default function themeFontsPlugin(context, { assetsBase }) {
  return {
    name: 'theme-fonts',
    async loadContent() {
      const catalog = await loadThemeCatalog({ baseUrl: assetsBase, signal: AbortSignal.timeout(15_000) });
      const preset = getPreset(catalog, DEFAULT_THEME_PRESET_ID);
      if (!preset) throw new Error(`[theme-fonts] the theme catalog has no "${DEFAULT_THEME_PRESET_ID}" preset (${assetsBase})`);
      const css = buildFontCss(preset);
      if (!css.includes('--font-sans:') || !css.includes('--font-title:')) {
        throw new Error(`[theme-fonts] "${DEFAULT_THEME_PRESET_ID}" sets no body or title font (${assetsBase})`);
      }
      return css;
    },
    injectHtmlTags({ content }) {
      return {
        // `theme-fonts` is the library's THEME_FONTS_STYLE_ID, the element every app writes these into.
        headTags: [{ tagName: 'style', attributes: { id: 'theme-fonts' }, innerHTML: content }],
      };
    },
  };
}
