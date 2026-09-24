import fs from 'fs/promises';
import path from 'path';

// English is the default locale, so its pages live at `/…`, not `/en/…`.
// Apps still link to `/en/…`, so every English route needs a real
// `/en/<route>/index.html` on disk: without it the host serves 404.html and
// the client-side route below then renders the real page on top of the
// "Page Not Found" markup.
function redirectHtml(target) {
  const url = JSON.stringify(target);
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<title>Redirecting…</title>
<link rel="canonical" href="${target}">
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=${target}">
<script>location.replace(${url} + location.search + location.hash);</script>
</head>
<body><a href="${target}">${target}</a></body>
</html>
`;
}

export default function enRedirectPlugin(context) {
  const currentLocale = context?.i18n?.currentLocale;

  return {
    name: 'en-redirect',
    async contentLoaded({ actions }) {
      if (currentLocale !== 'en') {
        return;
      }

      const { addRoute } = actions;

      // Covers in-app navigation to `/en/…` links (no server round-trip).
      addRoute({
        path: '/en/*',
        component: '@site/src/plugins/en-redirect/redirect.js',
        exact: false,
      });
    },
    async postBuild({ outDir, routesPaths }) {
      if (currentLocale !== 'en') {
        return;
      }

      const targets = routesPaths.filter(
        (route) => !route.includes('*') && !route.startsWith('/en/') && route !== '/404.html',
      );

      await Promise.all(
        targets.map(async (route) => {
          const file = path.join(outDir, 'en', route, 'index.html');
          await fs.mkdir(path.dirname(file), { recursive: true });
          await fs.writeFile(file, redirectHtml(route));
        }),
      );

      // The wildcard client route above makes Docusaurus emit a literal
      // `en/*/index.html`; it is never served, so drop it.
      await fs.rm(path.join(outDir, 'en', '*'), { recursive: true, force: true });
    },
  };
}
