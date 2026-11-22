// @ts-check
// Docusaurus configuration file
// For more information, visit: https://docusaurus.io/docs/configuration

import { themes as prismThemes } from 'prism-react-renderer';

// Which site a production build is: the public docs (from `main`), or the dev docs (from `dev`,
// `DOCS_SITE=dev`), each paired with its own root and event stream. A local `docusaurus start`
// pairs with local root.
const DEV_SITE = process.env.DOCS_SITE === 'dev';
const PRODUCTION = process.env.NODE_ENV === 'production';
// The CDN the dashboard publishes to: the public bucket for the public docs, the dev bucket for the
// dev docs and for local work.
const ASSETS_BASE = PRODUCTION && !DEV_SITE ? 'https://herbarium.plantasia.space' : 'https://dev-herbarium.plantasia.space';

// The share card: root draws it (the same card every Plantasia page shares), so the docs ship no
// image of their own. Crawlers need a public address, so a local build points at production root.
const SHARE_CARD_ROOT = PRODUCTION && DEV_SITE ? 'https://dev-root.plantasia.space' : 'https://plantasia.space';
const SHARE_CARD_URL = `${SHARE_CARD_ROOT}/api/og?${new URLSearchParams({ title: 'Plantasia Space Docs', description: 'Guides' })}`;

// Root's address: production root, dev-root for the dev docs, local root for a local `docusaurus start`.
const ROOT_BASE = !PRODUCTION ? 'https://local.plantasia.space:3000' : DEV_SITE ? 'https://dev-root.plantasia.space' : 'https://plantasia.space';

/**
 * Who runs the site, from the legal register (mycelium's config/legal/entity.json, read through
 * root's API) at build time: the one place it is written. Unreachable → the footer leaves it out.
 */
async function readEntity() {
  try {
    const res = await fetch(`${ROOT_BASE}/api/legal/register`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const body = await res.json();
    return body?.register?.entity ?? null;
  } catch {
    return null;
  }
}

const escapeHtml = (v) => String(v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** The Contact column: name, NIF and address as known, then the email. A null fact is left out. */
function contactColumn(entity) {
  if (!entity) return [];
  const lines = [entity.legalName || entity.tradeName, entity.taxId && `NIF ${entity.taxId}`, entity.address]
    .filter(Boolean)
    .map(escapeHtml);
  const items = [{ html: `<span class="footer__contact">${lines.join('<br>')}</span>` }];
  // The email in two parts: src/clientModules/protectedEmail.js joins it in the browser.
  const at = entity.email ? entity.email.indexOf('@') : -1;
  if (at > 0) {
    const user = escapeHtml(entity.email.slice(0, at));
    const domain = escapeHtml(entity.email.slice(at + 1));
    items.push({ html: `<a class="footer__link-item" data-email-user="${user}" data-email-domain="${domain}"></a>` });
  }
  return [{ title: 'Contact', items }];
}

export default async function createConfig() {
  const entity = await readEntity();
  /** @type {import('@docusaurus/types').Config} */
  const config = {
    title: 'Plantasia Space Docs',
    clientModules: [require.resolve('./src/clientModules/protectedEmail.js')],
    tagline: 'Guides',
    favicon: 'img/favico.ico',
    // Browsers that take an SVG tab icon get this one: it follows the light/dark colour scheme.
    headTags: [{ tagName: 'link', attributes: { rel: 'icon', type: 'image/svg+xml', href: '/img/favicon.svg' } }],

    // The site's address: the public docs, or the dev docs for a `DOCS_SITE=dev` build.
    url: DEV_SITE ? 'https://xplorer-docs.plantasia.space' : 'https://docs.plantasia.space',
    // Base URL pathname
    baseUrl: '/',

    // GitHub pages deployment config.
    // If you're not using GitHub pages, you can remove these.
    organizationName: 'plantasia-space-org', // Your GitHub org/user name.
    projectName: 'docs.plantasia.space', // Your repository name.

    // Handle broken links and markdown links
    onBrokenLinks: 'warn', // 'throw' for production builds
  
    markdown: {
      hooks: {
        onBrokenMarkdownLinks: 'warn',
      },
    },

    // Internationalization configuration
    i18n: {
      defaultLocale: 'en',
      locales: ['en', 'es'],
      localeConfigs: {
        en: {
          htmlLang: 'en-GB',
        },
        es: {
          htmlLang: 'es-ES',
        },
      },
    },

    customFields: {
      // The wordmark on the CDN above: the navbar's brand and the home page's title.
      wordmarkUrl: `${ASSETS_BASE}/assets/logos/current/plantasia-space-wordmark-currentcolor-transparent-background.svg`,
      // Root's address (Orchidea signs in and asks through it): production root, dev-root for the dev
      // docs, local root for a local `docusaurus start`.
      rootBase: ROOT_BASE,
      // The person's event stream, paired with root above: Orchidea hears its steps end there. Local
      // root's API (and its stream) is on dev-api.local.
      eventsBase: !PRODUCTION
        ? 'https://dev-api.local.plantasia.space'
        : DEV_SITE ? 'https://dev-events.plantasia.space' : 'https://events.plantasia.space',
      // Where "Try it" (TryModule) loads a module from: the Orbiters app's module embed page. One value
      // for every page. `ORBITERS_EMBED_URL` sets it for a build; a local `docusaurus start` uses the
      // monitor's Orbiters preview. A production build without it shows the pictures only, so nothing
      // points at a host that can't serve (or frame) the embed yet.
      orbitersEmbedUrl:
        process.env.ORBITERS_EMBED_URL ||
        (PRODUCTION ? null : 'https://local.plantasia.space:3000/embed/module'),
    },

    // Presets for Docusaurus
    presets: [
      [
        'classic',
        /** @type {import('@docusaurus/preset-classic').Options} */
        {
          docs: {
            // Path to your docs directory
            path: 'docs',
            // Path to your sidebar configuration
            sidebarPath: require.resolve('./sidebars.js'),
            // Edit URL for the documentation pages
            editUrl: 'https://github.com/plantasia-space/docs.plantasia.space/edit/main/', // Update to your GitHub repo
            routeBasePath: 'docs', // Base path for documentation
            remarkPlugins: [require("remark-breaks")],
          },
          blog: {
            showReadingTime: true,
            blogTitle: 'Plantasia Space Blog',
            blogDescription: 'News, updates, and stories from the Plantasia Space ecosystem.',
            blogSidebarTitle: 'Recent posts',
            editUrl: 'https://github.com/plantasia-space/docs.plantasia.space/edit/main/blog/', // Update to your GitHub repo
            path: './blog',
            routeBasePath: 'blog', // Base path for blog
          },
          theme: {
            customCss: require.resolve('./src/css/custom.css'),
          },
          sitemap: {
            // `/en/…` only redirects to the unprefixed English pages (see en-redirect).
            ignorePatterns: ['/en/**'],
          },
        },
      ],
    ],
    plugins: [
      './src/plugins/en-redirect',
      './src/plugins/raw-markdown',
      './src/plugins/moved-pages',
      './src/plugins/glossary-terms',
      ['./src/plugins/theme-fonts', { assetsBase: ASSETS_BASE }],
      './src/plugins/dev-feeds',
      // What's new: one post per promotion (dev → main), drafted by comms routine 02 from triaged tickets.
      // The root app's menu reads feed.json (PLA-514).
      [
        '@docusaurus/plugin-content-blog',
        {
          id: 'whats-new',
          path: './whats-new',
          routeBasePath: 'whats-new',
          blogTitle: "What's new",
          blogDescription: 'What you can do in Plantasia Space now, release by release.',
          blogSidebarTitle: 'All releases',
          blogSidebarCount: 'ALL',
          postsPerPage: 10,
          showReadingTime: false,
          // The list shows each release in full, like a changelog.
          onUntruncatedBlogPosts: 'ignore',
          feedOptions: {
            type: 'all',
            title: "Plantasia Space: What's new",
            description: 'What you can do in Plantasia Space now, release by release.',
            copyright: `Copyright © ${new Date().getFullYear()} Plantasia Space`,
            limit: 20,
          },
        },
      ],
    ],

    // Theme configuration
    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        colorMode: {
          defaultMode: 'dark',
          disableSwitch: false,
          respectPrefersColorScheme: false,
        },
        // Social card image for meta tags
        image: SHARE_CARD_URL,
        navbar: {
          title: 'docs',
          items: [
            {
              type: 'docSidebar',
              sidebarId: 'docsSidebar',
              position: 'left',
              label: 'xPlorer Guide',
              'aria-label': 'xPlorer Guide',
              className: 'nav-xplorer',
            },
            {
              to: '/blog',
              label: 'Blog',
              position: 'left',
              className: 'nav-blog',
            },
            {
              to: '/whats-new',
              label: "What's new",
              position: 'left',
              'aria-label': "What's new",
              className: 'nav-whats-new',
            },
            {
              type: 'localeDropdown',
              position: 'right',
            },
            {
              href: 'https://discord.gg/JkKybrvqSN',
              label: 'Discord',
              position: 'right',
              className: 'nav-discord',
            },
            {
              href: 'https://github.com/plantasia-space/docs.plantasia.space',
              label: 'GitHub',
              position: 'right',
              className: 'nav-github',
            },
          ],
        },
        // The same footer as root's guest pages (PLA-724): help, the legal pages, who runs the site.
        // Links to plantasia.space stay in this tab (same product, another site); only the outside
        // services (Discord, Instagram, GitHub) open a new tab with the arrow (PLA-544).
        footer: {
          // Not 'dark': the colours follow the page's light/dark theme (custom.css).
          style: 'light',
          links: [
            {
              title: 'Help',
              items: [
                { label: 'Pricing', href: `${ROOT_BASE}/pricing`, target: '_self' },
                { label: 'Desktop app', href: `${ROOT_BASE}/download`, target: '_self' },
                { label: 'Documentation', to: '/docs/index' },
                { label: 'Discord', href: 'https://discord.gg/JkKybrvqSN' },
                { label: 'Instagram', href: 'https://instagram.com/plantasia_space' },
                { label: 'GitHub', href: 'https://github.com/plantasia-space' },
              ],
            },
            {
              title: 'Legal',
              items: [
                { label: 'Terms of Use', href: `${ROOT_BASE}/legal/terms`, target: '_self' },
                { label: 'Privacy Policy', href: `${ROOT_BASE}/legal/privacy`, target: '_self' },
                { label: 'Refunds and cancellation', href: `${ROOT_BASE}/legal/terms#refunds`, target: '_self' },
                { label: 'Withdraw from contract here', href: `${ROOT_BASE}/legal/withdrawal`, target: '_self' },
              ],
            },
            ...contactColumn(entity),
          ],
        },
        prism: {
          theme: prismThemes.github,
          darkTheme: prismThemes.dracula,
        },
      }),


    // Add the search plugin to the theme
    themes: [
      [
        require.resolve('@easyops-cn/docusaurus-search-local'),
        {
          hashed: true, // Optional: recommended for better caching
          docsRouteBasePath: '/docs', // The route base path for docs
          indexDocs: true, // Index docs (default: true)
          indexPages: true, // Index pages other than docs (default: false)
          language: ['en', 'es'], // Specify the language(s) to be indexed
          highlightSearchTermsOnTargetPage: true, // Highlight search terms on the target page
          explicitSearchResultPath: true, // Explicitly define search result paths
          ignoreFiles: ['/deck', '/es/deck', 'en/*'],
        },
      ],
    ],


  };

  return config;
}
