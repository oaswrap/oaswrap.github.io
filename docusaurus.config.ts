import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'OASWrap',
  tagline: 'Framework-agnostic OpenAPI documentation for Go',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://oaswrap.github.io',
  baseUrl: '/',

  organizationName: 'oaswrap',
  projectName: 'oaswrap.github.io',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/oaswrap/oaswrap.github.io/tree/main/',
        },
        blog: {
            showReadingTime: true,
            feedOptions: {
              type: ['rss', 'atom'],
            },
          },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'OASWrap',
      logo: {
        alt: 'OASWrap Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left',
        },
        {
          href: 'https://github.com/oaswrap',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Libraries',
          items: [
            {
              label: 'spec',
              href: 'https://github.com/oaswrap/spec',
            },
            {
              label: 'spec-ui',
              href: 'https://github.com/oaswrap/spec-ui',
            },
            {
              label: 'gswag',
              href: 'https://github.com/oaswrap/gswag',
            },
          ],
        },
        {
          title: 'API Reference',
          items: [
            {
              label: 'pkg.go.dev/spec',
              href: 'https://pkg.go.dev/github.com/oaswrap/spec',
            },
            {
              label: 'pkg.go.dev/spec-ui',
              href: 'https://pkg.go.dev/github.com/oaswrap/spec-ui',
            },
            {
              label: 'pkg.go.dev/gswag',
              href: 'https://pkg.go.dev/github.com/oaswrap/gswag',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/oaswrap',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} OASWrap. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['go', 'bash', 'yaml', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
