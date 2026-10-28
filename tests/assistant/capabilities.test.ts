import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createDocsRegistry, publicUrl, type DocsHost } from '../../src/assistant/capabilities';
import { buildToolList } from 'plantasia.space-orchidea/assistant';

const host: DocsHost = {
  docsOrigin: 'https://docs.plantasia.space', rootOrigin: 'https://plantasia.space',
  page: () => ({ path: '/docs/start', title: 'Start' }),
  request: async (path: string) => path.startsWith('/v1/orchidea/knowledge/')
    ? { ok: true, status: 200, data: { text: 'Help', url: 'https://docs.plantasia.space/docs/help' } }
    : { ok: true, status: 200, data: { summary: { plans: [] } } },
  locale: () => 'en',
  read: async () => 'Documentation', search: async () => [{ title: 'Start', url: '/docs/start', excerpt: 'Begin' }], navigate: () => {},
  studio: { route: { handoffs: { create: async () => ({ token: 't', expiresAt: '' }), claim: async () => ({ entity: { type: 'orbiter', id: '' }, text: '' }) }, afterRequest: (fn) => fn('done') }, studioHref: () => '', go: () => {} },
};

test('docs exposes only read-only tools with bilingual labels and strict schemas', () => {
  const list = buildToolList(createDocsRegistry(host));
  assert.deepEqual(list.skipped, []);
  assert.equal(list.tools.length, 8);
  for (const tool of list.tools) { assert.equal(tool.risk, 'read'); assert.ok(tool.label?.en); assert.ok(tool.label?.es); }
});

test('read, search, navigation and app links use the host and stay public', async () => {
  let navigated = '';
  let offered = '';
  const registry = createDocsRegistry({ ...host, offerAppLink: (url) => { offered = url; }, navigate: (url) => { navigated = url; } });
  assert.deepEqual(await registry.invoke('docs.page', { path: '/docs/start' }), { url: 'https://docs.plantasia.space/docs/start', text: 'Documentation' });
  assert.deepEqual(await registry.invoke('docs.read', { topic: 'plans-and-credits' }), { text: 'Help', url: 'https://docs.plantasia.space/docs/help' });
  assert.deepEqual(await registry.invoke('plans.catalog', {}), { plans: [] });
  const hits = await registry.invoke('docs.search', { query: 'start' }) as Array<{ url: string }>;
  assert.equal(hits[0].url, 'https://docs.plantasia.space/docs/start');
  await registry.invoke('docs.open', { path: '/es/docs/start' });
  assert.equal(navigated, 'https://docs.plantasia.space/es/docs/start');
  assert.deepEqual(await registry.invoke('app.link', { path: '/es/pricing' }), { url: 'https://plantasia.space/es/pricing' });
  assert.equal(offered, 'https://plantasia.space/es/pricing');
});

test('external, script, auth, API and non-docs destinations are rejected', () => {
  for (const path of ['https://evil.example/docs/start', '//evil.example/docs/start', 'javascript:alert(1)', '/api/account', '/docs/../../api/account']) assert.throws(() => publicUrl(path, host.docsOrigin, true));
  for (const path of ['/en/api/checkout', '/es/auth/login', 'https://evil.example/']) assert.throws(() => publicUrl(path, host.rootOrigin));
});

test('search leaves out blog and other non-docs hits instead of failing', async () => {
  const registry = createDocsRegistry({ ...host, search: async () => [
    { title: 'Release notes', url: '/blog/october', excerpt: 'News' },
    { title: 'Start', url: '/docs/start', excerpt: 'Begin' },
  ] });
  const hits = await registry.invoke('docs.search', { query: 'start' }) as Array<{ url: string }>;
  assert.deepEqual(hits.map((hit) => hit.url), ['https://docs.plantasia.space/docs/start']);
});
