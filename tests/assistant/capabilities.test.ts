import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createDocsRegistry, itemLink, publicUrl, type DocsHost } from '../../src/assistant/capabilities';
import { buildToolList, createUndoGroups } from 'plantasia.space-orchidea/assistant';

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

test('docs has the platform set and its own page tools: labelled, strict, reads or the person’s own', () => {
  const list = buildToolList(createDocsRegistry(host, createUndoGroups()));
  assert.deepEqual(list.skipped, []);
  assert.equal(list.tools.length, 24);
  for (const name of ['site_search', 'library_list', 'star_set', 'collection_create', 'entity_archive', 'docs_page', 'studio_open'])
    assert.ok(list.tools.some((tool) => tool.name === name), name);
  for (const tool of list.tools) { assert.ok(['read', 'own'].includes(tool.risk)); assert.ok(tool.label?.en); assert.ok(tool.label?.es); }
});

test('a write on docs is undone with its request', async () => {
  const stars = new Set<string>();
  const id = 'a'.repeat(24);
  const undo = createUndoGroups();
  const registry = createDocsRegistry({ ...host, request: async (path, init) => {
    if (path.startsWith('/v1/me/stars')) return { ok: true, status: 200, data: { stars: [...stars].map((targetId) => ({ targetType: 'track', targetId })) } };
    if (path === '/v1/stars/toggle') { if (stars.has(id)) stars.delete(id); else stars.add(id); return { ok: true, status: 200, data: { starred: stars.has(id) } }; }
    return { ok: false, status: 404, data: {} };
  } }, undo);
  undo.history.begin({ requestId: 'r1' });
  const starred = await registry.invoke('star.set', { type: 'track', id, starred: true }, { source: 'orchidea' }) as { link?: string };
  undo.history.end({ requestId: 'r1', status: 'done' });
  assert.equal(stars.has(id), true);
  assert.equal(starred.link, `https://plantasia.space/audio/${id}`);
  await undo.history.undoGroup!('r1');
  assert.equal(stars.has(id), false);
});

test('item links go to the item’s page on plantasia.space', () => {
  assert.equal(itemLink('https://plantasia.space', 'world', 'w1'), 'https://plantasia.space/entangled-world/w1');
  assert.equal(itemLink('https://plantasia.space', 'person', 'x'), undefined);
});

test('read, search, navigation and app links use the host and stay public', async () => {
  let navigated = '';
  let offered = '';
  const registry = createDocsRegistry({ ...host, offerAppLink: (url) => { offered = url; }, navigate: (url) => { navigated = url; } }, createUndoGroups());
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
  ] }, createUndoGroups());
  const hits = await registry.invoke('docs.search', { query: 'start' }) as Array<{ url: string }>;
  assert.deepEqual(hits.map((hit) => hit.url), ['https://docs.plantasia.space/docs/start']);
});
