import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Button, FloatingDock, Orchidea, OrchideaChat, OrchideaChatFeed, OrchideaChatWait, OrchideaChatMessage } from 'plantasia.space-design/react';
import { createAssistant, createEventStream, createSiteRequest, createSiteTransport } from 'plantasia.space-orchidea/assistant';
import { AssistantPanel } from 'plantasia.space-orchidea/assistant/react';
import { createDocsRegistry } from './capabilities';
import { useDocsAssistantAccess } from './DocsAssistantProvider';

export default function DocsAssistant({ base }: { base: string }) {
  const access = useDocsAssistantAccess();
  const state = useSyncExternalStore(access.subscribe, access.getSnapshot, access.getSnapshot);
  const [open, setOpen] = useState(false);
  const [appLink, setAppLink] = useState<string | null>(null);
  const [mode, setMode] = useState(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  useEffect(() => {
    const observer = new MutationObserver(() => setMode(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  const location = useLocation();
  const history = useHistory();
  // `siteConfig.url`: the public docs, where a help page's address always points, even locally.
  const { i18n: { currentLocale: locale }, siteConfig: { url: publicDocs, customFields } } = useDocusaurusContext();
  const eventsBase = String(customFields?.eventsBase ?? '');
  const current = useRef({ location, locale });
  current.current = { location, locale };
  const es = locale === 'es';
  const assistant = useMemo(() => {
    let initialConfig = true;
    const fetcher: typeof fetch = async (input, init) => {
      if (initialConfig && String(input).includes('/api/orchidea/config?')) {
        initialConfig = false;
        const cached = access.getSnapshot();
        if (cached.status === 'ready' && cached.config) return Response.json(cached.config);
      }
      const response = await fetch(input, init);
      if (response.status === 401) access.signedOut();
      return response;
    };
    // The person's event stream (the session cookie, as root's), paired with root's address in the
    // site config: a step is answered there, never in one long call. None configured: steps are read back.
    const events = eventsBase ? createEventStream({ url: `${eventsBase.replace(/\/+$/, '')}/v1/events` }) : null;
    const transport = createSiteTransport({ app: 'docs', base, fetch: fetcher, events });
    const registry = createDocsRegistry({
      docsOrigin: window.location.origin, rootOrigin: base,
      page: () => ({ path: current.current.location.pathname, title: document.title }),
      offerAppLink: setAppLink,
      studio: {
        route: transport,
        // Root's edit address: it checks the Orbiter, then hands the token on to the Studio.
        studioHref: (entity, token) => new URL(`/${current.current.locale}/release/${entity.type}/${entity.id ? encodeURIComponent(entity.id) : 'new'}${token ? `?handoff=${encodeURIComponent(token)}` : ''}`, base).href,
        go: (href) => window.location.assign(href),
        pricingHref: () => new URL(`/${current.current.locale}/pricing`, base).href,
      },
      navigate: (url) => { const target = new URL(url); history.push(target.pathname + target.search + target.hash); },
      request: createSiteRequest({ base, fetch: fetcher }),
      locale: () => current.current.locale,
      read: async (url) => {
        const response = await fetch(url, { credentials: 'omit' });
        if (!response.ok) throw new Error('Documentation page unavailable');
        const page = new DOMParser().parseFromString(await response.text(), 'text/html');
        const article = page.querySelector('article');
        if (!article) throw new Error('This is not a documentation page');
        article.querySelectorAll('script, style, iframe, nav').forEach((node) => node.remove());
        return (article.textContent ?? '').replace(/\s+/g, ' ').trim();
      },
      search: async (query) => {
        const { searchByWorker } = await import('@easyops-cn/docusaurus-search-local/dist/client/client/theme/searchByWorker');
        const prefix = current.current.locale === 'es' ? '/es/' : '/';
        const results = await searchByWorker(prefix, undefined, query, 8);
        return results.map((hit) => ({ title: hit.page?.t ?? hit.document.t, url: hit.document.u, excerpt: hit.document.t }));
      },
    });
    // A docs page is read whole: results up to 6000 characters, where the Studios keep the default.
    return createAssistant({ app: 'docs', registry, resultChars: 6000,
      context: () => ({ page: current.current.location.pathname, title: document.title, locale: current.current.locale }),
      transport,
    });
  }, [access, base, eventsBase, history]);
  // Welcome by name (from the config), with one short line picked per panel.
  const name = (state.config as { person?: { name?: string | null } } | null)?.person?.name ?? '';
  const [prompt] = useState(() => Math.floor(Math.random() * 4));
  const prompts = es
    ? ['¿Qué estás buscando?', 'Pregúntame sobre la documentación.', '¿En qué te ayudo?', 'Pregúntame lo que quieras.']
    : ['What are you looking for?', 'Ask me about the docs.', 'What can I help with?', 'Ask me anything.'];
  // The name in bold; its own Markdown characters are dropped so they cannot reshape the line.
  const bold = name.replace(/[*_`[\]]/g, '');
  const greeting = `${es ? (bold ? `¡Hola, **${bold}**!` : '¡Hola!') : (bold ? `Hi **${bold}**!` : 'Hi!')} ${prompts[prompt]}`;
  const labels = useMemo(() => ({ greeting }), [greeting]);
  const returnTo = window.location.href;
  const link = (path: string) => { const url = new URL(`/${locale}/${path}`, base); url.searchParams.set('redirectTo', returnTo); return url.href; };
  return <div className={`orchidea-docs-host ${mode}`}>
    <FloatingDock storageKey="docs.orchidea.spot" placement="free" bottomClearance="24px" topClearance="72px">
      {(corner) => <div style={{ display: 'flex', flexDirection: corner.startsWith('bottom') ? 'column-reverse' : 'column', alignItems: corner.endsWith('right') ? 'flex-end' : 'flex-start', gap: 8 }}>
        <Button variant="ghost" size="icon" data-floating-dock-handle aria-label={es ? 'Pregunta a Orchidea' : 'Ask Orchidea'} aria-expanded={open} style={{ width: 72, height: 72 }} onClick={() => { setOpen(!open); if (!open) void access.load(); }}><Orchidea size={64} className="size-16" style={{ width: 64, height: 64 }} /></Button>
        {open ? <>
          {state.status === 'unknown' || state.status === 'loading' || state.status === 'failed' ? <OrchideaChat layout="window"><OrchideaChatFeed>
            {state.status === 'failed' ? <OrchideaChatMessage from="orchidea">{es ? 'No se pudo cargar Orchidea.' : 'Orchidea could not load.'} <Button variant="link" onClick={() => void access.load()}>{es ? 'Reintentar' : 'Try again'}</Button></OrchideaChatMessage> : <OrchideaChatWait>{es ? 'Cargando Orchidea' : 'Loading Orchidea'}</OrchideaChatWait>}
          </OrchideaChatFeed></OrchideaChat> : <AssistantPanel assistant={assistant} account={state.account}
            signInHref={link('auth/login')} pricingHref={new URL(`/${locale}/pricing`, base).href} creditsHref={new URL(`/${locale}/credits`, base).href}
            locale={locale} surface="docs" layout="window" labels={labels} portalClassName="orchidea-docs-portal" linkOrigins={[window.location.origin, base, new URL(publicDocs).origin]} onClose={() => setOpen(false)}
            style={{ width: 'min(380px, calc(100vw - 32px))', height: 'min(620px, calc(100dvh - 160px), var(--floating-dock-room, 100dvh))' }} />}
          {appLink && state.account ? <Button asChild><a href={appLink}>{es ? 'Abrir en la aplicación' : 'Open in the app'}</a></Button> : null}
        </> : null}
      </div>}
    </FloatingDock>
  </div>;
}
