import type { RouteConfig } from 'plantasia.space-orchidea/assistant';

export type DocsAccess = { status: 'unknown' | 'loading' | 'failed'; account: null; config: null }
  | { status: 'ready'; account: string | null; config: RouteConfig | null };

/** One lazy identity check for this tab. Docs owns no token and never initiates a sign-in. */
export function createDocsAccess(base: string, fetcher: typeof fetch = (...args) => fetch(...args)) {
  let snapshot: DocsAccess = { status: 'unknown', account: null, config: null };
  let pending: Promise<void> | null = null;
  let generation = 0;
  const listeners = new Set<() => void>();
  const set = (next: DocsAccess) => { snapshot = next; listeners.forEach((listener) => listener()); };
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    signedOut() { ++generation; pending = null; set({ status: 'ready', account: null, config: null }); },
    load(): Promise<void> {
      if (pending) return pending;
      if (snapshot.status === 'ready') return Promise.resolve();
      const mine = generation;
      set({ status: 'loading', account: null, config: null });
      pending = (async () => {
        try {
          const response = await fetcher(`${new URL(base).origin}/api/orchidea/config?app=docs`, { credentials: 'include' });
          if (mine !== generation) return;
          if (response.status === 401) { set({ status: 'ready', account: null, config: null }); return; }
          if (!response.ok) throw new Error('Config unavailable');
          const config = await response.json() as RouteConfig;
          if (mine !== generation) return;
          if (typeof config.enabled !== 'boolean' || typeof config.planAllowed !== 'boolean' || !config.notice) throw new Error('Invalid config');
          set({ status: 'ready', account: 'docs-session', config });
        } catch { if (mine === generation) set({ status: 'failed', account: null, config: null }); }
        finally { if (mine === generation) pending = null; }
      })();
      return pending;
    },
  };
}
export type DocsAccessStore = ReturnType<typeof createDocsAccess>;
