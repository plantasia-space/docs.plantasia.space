import fs from 'fs';
import path from 'path';

const FEEDS = ['rss.xml', 'atom.xml', 'feed.json'];
const BLOGS = ['blog', 'whats-new'];

// Docusaurus writes blog feeds only in `docusaurus build`, so `npm start` answers
// /whats-new/rss.xml (and the feed.json the root app's What's new menu reads) with its
// "Page Not Found" page. In dev, this serves the feed files of the last build instead.
// They are as fresh as that build: run `npm run build` after changing a post.
export default function devFeedsPlugin(context) {
  return {
    name: 'dev-feeds',
    configureWebpack(_config, isServer) {
      if (isServer || process.env.NODE_ENV === 'production') return {};
      const servedDir = path.join(context.generatedFilesDir, 'dev-feeds');
      const statics = [];
      for (const blog of BLOGS) {
        const builtDir = path.join(context.siteDir, 'build', blog);
        const files = FEEDS.filter((name) => fs.existsSync(path.join(builtDir, name)));
        if (files.length === 0) continue;
        // Only the feed files cross over: serving the whole built folder would put the
        // built pages in front of the dev ones.
        const target = path.join(servedDir, blog);
        fs.mkdirSync(target, { recursive: true });
        for (const name of files) fs.copyFileSync(path.join(builtDir, name), path.join(target, name));
        statics.push({
          directory: target,
          publicPath: `/${blog}`,
          watch: false,
          // No index page and no slash redirect: `/${blog}` itself stays the dev page.
          staticOptions: { index: false, redirect: false },
        });
      }
      return statics.length ? { devServer: { static: statics } } : {};
    },
  };
}
