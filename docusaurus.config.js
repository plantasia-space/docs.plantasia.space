// @ts-check
// Docusaurus configuration file
// For more information, visit: https://docusaurus.io/docs/configuration

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Plantasia Space',
  tagline: 'Comprehensive Documentation',
  favicon: 'img/favico.ico',

  // Production URL of your site
  url: 'https://docs.plantasia.space',
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
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'docs',
        logo: {
          alt: 'plantasia.space Logo',
          src: 'img/ps.svg',
          srcDark: 'img/ps-current.svg',
        },
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
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Documentation',
                to: '/docs/index', // Auto-generated sidebar link
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/JkKybrvqSN',
              },
              {
                label: 'Instagram',
                href: 'https://instagram.com/plantasia_space',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/plantasia-space/docs.plantasia.space',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} plantasia.space Docs.`,
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

export default config;
