import path from 'path';
import fs from 'fs';

const decode = (text) => text.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

// The raw view is plain Markdown: the docs components go back to what they mean.
export function plainMarkdown(content) {
  return content
    .replace(/<ModulePicture\b([\s\S]*?)\/>/g, (_, attrs) => {
      const src = attrs.match(/\bsrc="([^"]*)"/)?.[1] ?? '';
      const alt = decode(attrs.match(/\balt="([^"]*)"/)?.[1] ?? '');
      return `![${alt}](${src})`;
    })
    // A card's `/>` ends its line; its icon prop holds a `/>` of its own that does not.
    .replace(/^[ \t]*<NavigationCard\b([\s\S]*?)\/>[ \t]*$\n?/gm, (_, attrs) => {
      const href = attrs.match(/\bhref="([^"]*)"/)?.[1] ?? '';
      const label = decode(attrs.match(/\blabel="([^"]*)"/)?.[1] ?? '');
      const description = decode(attrs.match(/\bdescription="([^"]*)"/)?.[1] ?? '');
      return `- [${label}](${href})${description ? `: ${description}` : ''}\n`;
    })
    .replace(/^<\/?NavigationGrid>\n?/gm, '')
    .replace(/<Dot>(\d+)<\/Dot>/g, '($1) ')
    .replace(/<Term id="[\w-]+">([\s\S]*?)<\/Term>/g, '$1')
    .replace(/<StepFlow\b[\s\S]*?\n\/>\n?/g, '')
    .replace(/^<\/?Walkthrough>\n?/gm, '')
    .replace(/\n{3,}/g, '\n\n');
}

class RawMarkdownWebpackPlugin {
  /**
   * @param {string} docsDir the docs, in the default language
   * @param {string|null} localizedDir this build's translations of them, or null
   */
  constructor(docsDir, localizedDir = null) {
    this.docsDir = docsDir;
    this.localizedDir = localizedDir;
  }

  findMarkdownFiles(dir) {
    const results = [];
    if (!fs.existsSync(dir)) return results;
    for (const item of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        results.push(...this.findMarkdownFiles(fullPath));
      } else if (/\.(md|mdx)$/.test(item)) {
        results.push(fullPath);
      }
    }
    return results;
  }

  apply(compiler) {
    const { docsDir, localizedDir } = this;

    const { RawSource } = compiler.webpack.sources;
    const stage = compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL;

    compiler.hooks.thisCompilation.tap('RawMarkdownPlugin', (compilation) => {
      compilation.hooks.processAssets.tap({ name: 'RawMarkdownPlugin', stage }, () => {
        for (const file of this.findMarkdownFiles(docsDir)) {
          try {
            // Each page at its docs path, in this build's language when it has a translation.
            const relativePath = path.relative(docsDir, file).replace(/\\/g, '/');
            const localized = localizedDir && path.join(localizedDir, relativePath);
            const source = localized && fs.existsSync(localized) ? localized : file;
            const content = plainMarkdown(fs.readFileSync(source, 'utf8'));
            compilation.emitAsset(`_raw/docs/${relativePath}`, new RawSource(content));
          } catch (err) {
            console.warn('[raw-markdown-plugin] skipping', file, err.message);
          }
        }
      });
    });
  }
}

export default function rawMarkdownPlugin(context) {
  const docsDir = path.join(context.siteDir, 'docs');
  const { currentLocale, defaultLocale } = context.i18n;
  const localizedDir = currentLocale === defaultLocale ? null
    : path.join(context.siteDir, 'i18n', currentLocale, 'docusaurus-plugin-content-docs', 'current');
  return {
    name: 'raw-markdown-plugin',
    configureWebpack(_config, isServer) {
      if (isServer) return {};
      return {
        plugins: [new RawMarkdownWebpackPlugin(docsDir, localizedDir)],
      };
    },
  };
}
