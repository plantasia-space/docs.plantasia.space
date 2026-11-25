import fs from 'fs/promises';
import path from 'path';

import { redirectHtml } from '../redirect-html.js';

// The default locale's pages live at `/…`, not `/<locale>/…`. Apps still link
// to `/en/…`, so every default-locale route needs a real file under `en/` on
// disk: without it the host serves 404.html and the client-side route below
// then renders the real page on top of the "Page Not Found" markup.
export default function enRedirectPlugin(context) {
  const { i18n, baseUrl, siteConfig } = context;
  const locale = i18n.defaultLocale;
  const htmlLang = i18n.localeConfigs?.[locale]?.htmlLang ?? locale;
  const prefix = `${baseUrl}${locale}/`;

  return {
    name: 'en-redirect',
    async contentLoaded({ actions }) {
      if (i18n.currentLocale !== locale) {
        return;
      }

      const { addRoute } = actions;

      // Covers in-app navigation to `/en/…` links (no server round-trip).
      addRoute({
        path: `${prefix}*`,
        component: '@site/src/plugins/en-redirect/redirect.js',
        exact: false,
      });
    },
    async postBuild({ outDir, routesPaths }) {
      if (i18n.currentLocale !== locale) {
        return;
      }

      const targets = routesPaths.filter(
        (route) =>
          route.startsWith(baseUrl) &&
          !route.includes('*') &&
          !route.startsWith(prefix) &&
          route !== `${baseUrl}404.html`,
      );

      await Promise.all(
        targets.map(async (route) => {
          const relative = route.slice(baseUrl.length);
          // Mirror how Docusaurus writes routes: `.html` routes are files as-is.
          const file = /\.html?$/.test(relative)
            ? path.join(outDir, locale, relative)
            : path.join(outDir, locale, relative, 'index.html');
          await fs.mkdir(path.dirname(file), { recursive: true });
          await fs.writeFile(
            file,
            redirectHtml({
              target: route,
              canonical: new URL(route, siteConfig.url).href,
              htmlLang,
            }),
          );
        }),
      );
    },
  };
}
