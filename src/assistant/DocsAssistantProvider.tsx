import React, { createContext, lazy, Suspense, useContext, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { createDocsAccess, type DocsAccessStore } from './access';

const Launcher = lazy(() => import('./DocsAssistant'));
const Context = createContext<DocsAccessStore | null>(null);
export function useDocsAssistantAccess() {
  const store = useContext(Context);
  if (!store) throw new Error('DocsAssistantProvider is missing');
  return store;
}

/** Children keep their normal SSR output; only the assistant is browser-only. */
export default function DocsAssistantProvider({ children }: { children: React.ReactNode }) {
  const { siteConfig } = useDocusaurusContext();
  const root = String(siteConfig.customFields?.orchideaRootUrl ?? '');
  const base = root ? new URL(root).origin : null;
  const [store] = useState(() => (base ? createDocsAccess(base) : null));
  // No root to talk to (a build without one): the docs show no assistant.
  if (!base || !store) return <>{children}</>;
  return <Context.Provider value={store}>
    {children}
    <BrowserOnly>{() => <Suspense fallback={null}><Launcher base={base} /></Suspense>}</BrowserOnly>
  </Context.Provider>;
}
