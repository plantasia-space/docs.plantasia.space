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
    .replace(/<Dot>(\d+)<\/Dot>/g, '($1) ')
    .replace(/<Term id="[\w-]+">([\s\S]*?)<\/Term>/g, '$1')
    .replace(/<StepFlow\b[\s\S]*?\n\/>\n?/g, '')
    .replace(/^<\/?Walkthrough>\n?/gm, '')
    .replace(/\n{3,}/g, '\n\n');
}

class RawMarkdownWebpackPlugin {
  constructor(docsDir) {
    this.docsDir = docsDir;
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
    const { docsDir } = this;
    const siteDir = path.dirname(docsDir);

    const { RawSource } = compiler.webpack.sources;
    const stage = compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL;

    compiler.hooks.thisCompilation.tap('RawMarkdownPlugin', (compilation) => {
      compilation.hooks.processAssets.tap({ name: 'RawMarkdownPlugin', stage }, () => {
        for (const file of this.findMarkdownFiles(docsDir)) {
          try {
            const content = plainMarkdown(fs.readFileSync(file, 'utf8'));
            const relativePath = path.relative(siteDir, file).replace(/\\/g, '/');
            compilation.emitAsset(`_raw/${relativePath}`, new RawSource(content));
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
  return {
    name: 'raw-markdown-plugin',
    configureWebpack(_config, isServer) {
      if (isServer) return {};
      return {
        plugins: [new RawMarkdownWebpackPlugin(docsDir)],
      };
    },
  };
}
