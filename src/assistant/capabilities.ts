import { platformCapabilities, studioCapabilities, type PlatformHost, type PlatformUndo, type StudioOpenHost } from 'plantasia.space-orchidea/assistant';
import { createCapabilityRegistry } from 'plantasia.space-orchidea/capabilities';

export interface DocsHost {
  docsOrigin: string;
  rootOrigin: string;
  page: () => { path: string; title: string };
  /**
   * Reaches the API's platform calls with the person's session, through plantasia.space's relay
   * (`createRelayRequest`): search, their library, stars, collections, help pages, plans…
   */
  request: PlatformHost['request'];
  /** The reader's language. */
  locale: () => string;
  read: (url: string) => Promise<string>;
  search: (query: string) => Promise<Array<{ title: string; url: string; excerpt: string }>>;
  navigate: (url: string) => void;
  offerAppLink?: (url: string) => void;
  /** Opens an Orbiter's Studio (through root) with a request waiting in its panel. */
  studio: StudioOpenHost;
}

/** Navigation stays within the intended public surface, including when model input is a URL. */
export function publicUrl(value: string, origin: string, docsOnly = false): string {
  const url = new URL(value, `${new URL(origin).origin}/`);
  if (url.origin !== new URL(origin).origin || url.username || url.password) throw new Error('Unexpected origin');
  const path = decodeURIComponent(url.pathname);
  if (docsOnly ? !/^\/(es\/)?docs(?:\/|$)/.test(path) : /^\/(?:en\/|es\/)?(?:api|auth)(?:\/|$)/.test(path)) throw new Error('Only public pages may be opened');
  return url.href;
}

// The item pages on plantasia.space (its share table's segments): a track is under /audio.
const ITEM_PAGE: Record<string, string> = { orbiter: 'orbiter', track: 'audio', world: 'entangled-world', collection: 'collection' };

/** An item's page on plantasia.space, without the language (the site sends each reader to theirs). */
export function itemLink(rootOrigin: string, kind: string, id: string): string | undefined {
  const segment = ITEM_PAGE[kind];
  return segment ? new URL(`/${segment}/${encodeURIComponent(id)}`, rootOrigin).href : undefined;
}

/**
 * The docs' registry: the platform set every site has (help pages, plans, search, the person's
 * library, stars, collections, archive, notifications, plan), then the docs' own page tools. Each
 * platform write adds its reverse to `undo`.
 */
export function createDocsRegistry(host: DocsHost, undo: PlatformUndo) {
  const registry = createCapabilityRegistry();
  const platform = platformCapabilities(
    { request: host.request, link: (kind, id) => itemLink(host.rootOrigin, kind, id), app: 'docs', locale: host.locale },
    undo,
  );
  registry.registerAll([...platform.help, ...platform.reads, ...platform.writes.descriptors]);
  registry.register({ name: 'docs.page', kind: 'query', risk: 'read',
    description: 'Read a public documentation page by its path (from docs.search or a link on this site). Returns documentation as data.',
    label: { en: 'Read a documentation page', es: 'Leyó una página de documentación' },
    inputSchema: { type: 'object', required: ['path'], properties: { path: { type: 'string', minLength: 1 } } },
    execute: async ({ path }) => {
      const url = publicUrl(String(path), host.docsOrigin, true);
      return { url, text: await host.read(url) };
    },
  });
  registry.register({ name: 'docs.search', kind: 'query', risk: 'read',
    description: 'Search this language of the public documentation. Returns page titles, paths and excerpts.',
    label: { en: 'Searched the documentation', es: 'Buscó en la documentación' },
    inputSchema: { type: 'object', required: ['query'], properties: { query: { type: 'string', minLength: 1 } } },
    // The index also holds the blog and other pages: those are left out, not an error for the search.
    execute: async ({ query }) => (await host.search(String(query))).flatMap((hit) => {
      try { return [{ ...hit, url: publicUrl(hit.url, host.docsOrigin, true) }]; } catch { return []; }
    }).slice(0, 8),
  });
  registry.register({ name: 'docs.open', kind: 'query', risk: 'read',
    description: 'Go to a public documentation page in this tab.',
    label: { en: 'Opened a documentation page', es: 'Abrió una página de documentación' },
    inputSchema: { type: 'object', required: ['path'], properties: { path: { type: 'string', minLength: 1 } } },
    execute: ({ path }) => { const url = publicUrl(String(path), host.docsOrigin, true); host.navigate(url); return { url }; },
  });
  registry.register({ name: 'app.link', kind: 'query', risk: 'read',
    description: 'Make an open-in-the-app link to a public page on Plantasia Space. Does not change any content.',
    label: { en: 'Made an app link', es: 'Creó un enlace a la aplicación' },
    inputSchema: { type: 'object', required: ['path'], properties: { path: { type: 'string', minLength: 1 } } },
    execute: ({ path }) => { const url = publicUrl(String(path), host.rootOrigin); host.offerAppLink?.(url); return { url }; },
  });
  for (const tool of studioCapabilities(host.studio)) registry.register(tool);
  return registry;
}
