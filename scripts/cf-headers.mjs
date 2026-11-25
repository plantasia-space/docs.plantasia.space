// Writes build/_headers for the Cloudflare static site (PLA-747).
// The dev docs (DOCS_SITE=dev) carry the same headers its nginx sent: noindex + X-Environment.
import { writeFileSync } from 'node:fs';

const dev = process.env.DOCS_SITE === 'dev';
const lines = [
  '/*',
  '  X-Content-Type-Options: nosniff',
  '  Strict-Transport-Security: max-age=63072000',
  ...(dev ? ['  X-Environment: Development', '  X-Robots-Tag: noindex, nofollow'] : []),
];
writeFileSync(new URL('../build/_headers', import.meta.url), `${lines.join('\n')}\n`);
console.log(`build/_headers written (${dev ? 'dev' : 'prod'})`);
