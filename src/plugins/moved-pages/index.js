import fs from 'fs/promises';
import path from 'path';

import { redirectHtml } from '../redirect-html.js';

// Pages that moved after they were live: the old address keeps working, in
// every locale, by sending the browser to the new one. Paths are without the
// locale prefix; add a line here whenever a live page moves.
const MOVED = [
  ['/docs/orbiters/drum-sequencer', '/docs/orbiters/midi-effects/drum-sequencer'],
];

export default function movedPagesPlugin(context) {
  const { i18n, baseUrl, siteConfig } = context;
  const htmlLang = i18n.localeConfigs?.[i18n.currentLocale]?.htmlLang ?? i18n.currentLocale;

  return {
    name: 'moved-pages',
    async postBuild({ outDir, routesPaths }) {
      await Promise.all(
        MOVED.map(async ([from, to]) => {
          const target = `${baseUrl}${to.slice(1)}`;
          if (!routesPaths.includes(target)) {
            throw new Error(`moved-pages: ${from} points at ${to}, which is not a page`);
          }
          const html = redirectHtml({ target, canonical: new URL(target, siteConfig.url).href, htmlLang });
          // The default locale also answers at `/en/…` (see en-redirect).
          const dirs = i18n.currentLocale === i18n.defaultLocale ? ['', i18n.defaultLocale] : [''];
          for (const dir of dirs) {
            const file = path.join(outDir, dir, from.slice(1), 'index.html');
            await fs.mkdir(path.dirname(file), { recursive: true });
            await fs.writeFile(file, html);
          }
        }),
      );
    },
  };
}
