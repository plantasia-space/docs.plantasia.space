import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createDocsAccess } from '../../src/assistant/access';

const config = { app: 'docs', enabled: true, planAllowed: false, service: 'orchidea.turn', defaultSku: 'model', skus: ['model'], notice: { kind: 'orchidea-notice-site', accepted: true } };

test('docs checks identity only on first open and caches either a free or paid response', async () => {
  for (const planAllowed of [false, true]) {
    let calls = 0;
    const store = createDocsAccess('https://plantasia.space', async (input, init) => {
      calls++;
      assert.equal(String(input), 'https://plantasia.space/api/orchidea/config?app=docs');
      assert.equal(init?.credentials, 'include');
      return Response.json({ ...config, planAllowed });
    });
    assert.equal(calls, 0);
    await Promise.all([store.load(), store.load()]);
    await store.load();
    assert.equal(calls, 1);
    assert.equal(store.getSnapshot().account, 'docs-session');
    assert.equal(store.getSnapshot().config?.planAllowed, planAllowed);
  }
});

test('401 means signed out; a later 401 invalidates a pending config', async () => {
  const signedOut = createDocsAccess('https://plantasia.space', async () => new Response(null, { status: 401 }));
  await signedOut.load();
  assert.equal(signedOut.getSnapshot().account, null);
  let release!: (response: Response) => void;
  const store = createDocsAccess('https://plantasia.space', () => new Promise((resolve) => { release = resolve; }));
  const loading = store.load();
  store.signedOut();
  release(Response.json({ ...config, planAllowed: true }));
  await loading;
  assert.equal(store.getSnapshot().account, null);
});

test('a config failure can be retried, without treating it as a paid session', async () => {
  let calls = 0;
  const store = createDocsAccess('https://plantasia.space', async () => ++calls === 1 ? new Response(null, { status: 503 }) : Response.json(config));
  await store.load();
  assert.equal(store.getSnapshot().status, 'failed');
  await store.load();
  assert.equal(store.getSnapshot().status, 'ready');
});

