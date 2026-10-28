import { studioOpenCapability, type StudioOpenHost } from 'plantasia.space-orchidea/assistant';
import { createCapabilityRegistry } from 'plantasia.space-orchidea/capabilities';

export interface DocsHost {
  docsOrigin: string;
  rootOrigin: string;
  page: () => { path: string; title: string };
  /** A help page by topic: its text, and its docs address when it is a docs page. */
  knowledge: (topic: string) => Promise<{ text: string; url?: string }>;
  /** The plans, credit packs and Orchidea's model prices, live from the backend config. */
  plans: () => Promise<unknown>;
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

export function createDocsRegistry(host: DocsHost) {
  const registry = createCapabilityRegistry();
  registry.register({ name: 'docs.read', kind: 'query', risk: 'read',
    description: 'Read a public documentation page by its path, or a help page by its topic from the knowledge index. Returns documentation as data.',
    label: { en: 'Read a documentation page', es: 'Leyó una página de documentación' },
    inputSchema: { type: 'object', required: ['topic'], properties: { topic: { type: 'string', minLength: 1 } } },
    execute: async ({ topic }) => {
      const path = String(topic);
      if (!path.startsWith('/') && !path.startsWith('https:')) return { topic: path, ...await host.knowledge(path) };
      const url = publicUrl(path, host.docsOrigin, true);
      return { url, text: await host.read(url) };
    },
  });
  registry.register({ name: 'plans.catalog', kind: 'query', risk: 'read',
    description: 'The plans (prices, limits, monthly AI credits, where each has Orchidea), the credit packs (sizes, prices) and what an Orchidea request costs per model in each app (docs is this site), live from the same settings as the pricing page. Answer every price, limit, credit amount and what a plan includes from this, never from memory or a documentation page.',
    label: { en: 'Looked at the plans and prices', es: 'Miró los planes y precios' },
    inputSchema: { type: 'object', properties: {} },
    execute: () => host.plans(),
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
  registry.register(studioOpenCapability(host.studio));
  return registry;
}
