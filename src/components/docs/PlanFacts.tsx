import React, { useEffect, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'plantasia.space-design/react';

/**
 * Plan, pack and Orchidea price tables, read live from the same public catalogs the pricing page and
 * every model picker read (root's /api/subscriptions/*, from the backend config). The pages hold no
 * figures of their own: a change in the backend shows here on the next load.
 */

type Catalog = 'plans-catalog' | 'credits-catalog' | 'services-catalog';

const WORDS = {
  en: {
    plan: 'Plan', monthly: 'Monthly', yearly: 'Yearly', tracks: 'Tracks', fileSize: 'File size',
    worlds: 'Entangled Worlds', orbiters: 'Orbiters', text: 'Text credits each month', texture: 'Texture credits each month',
    unlimited: 'Unlimited', pack: 'Pack', pool: 'Pool', credits: 'Credits', price: 'Price', model: 'Model',
    perRequest: 'Credits per request, at most', poolText: 'Text', poolTexture: 'Texture',
    failed: 'The current figures could not load here. They are on the', pricing: 'pricing page', beforeTax: 'Prices are shown before tax.',
  },
  es: {
    plan: 'Plan', monthly: 'Mensual', yearly: 'Anual', tracks: 'Pistas', fileSize: 'Tamaño de archivo',
    worlds: 'Entangled Worlds', orbiters: 'Orbiters', text: 'Créditos de texto al mes', texture: 'Créditos de textura al mes',
    unlimited: 'Ilimitado', pack: 'Paquete', pool: 'Bolsa', credits: 'Créditos', price: 'Precio', model: 'Modelo',
    perRequest: 'Créditos por petición, como máximo', poolText: 'Texto', poolTexture: 'Textura',
    failed: 'Las cifras actuales no se pudieron cargar aquí. Están en la', pricing: 'página de precios', beforeTax: 'Los precios se muestran sin impuestos.',
  },
} as const;

/** A plan limit at or above this is unlimited, as the plans list shows it. */
const UNLIMITED = 1000000;

function useCatalog<T>(name: Catalog): { data: T | null; failed: boolean; words: (typeof WORDS)['en']; pricing: string } {
  const { siteConfig, i18n } = useDocusaurusContext();
  const root = String(siteConfig.customFields?.rootBase ?? '');
  const lang = i18n.currentLocale === 'es' ? 'es' : 'en';
  const [state, setState] = useState<{ data: T | null; failed: boolean }>({ data: null, failed: false });
  useEffect(() => {
    let live = true;
    fetch(`${root}/api/subscriptions/${name}?locale=${lang}`, { credentials: 'omit' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => { if (live) setState({ data, failed: false }); })
      .catch(() => { if (live) setState({ data: null, failed: true }); });
    return () => { live = false; };
  }, [root, name, lang]);
  return { ...state, words: WORDS[lang], pricing: `${root}/${lang}/pricing` };
}

function Status({ failed, words, pricing }: { failed: boolean; words: (typeof WORDS)['en']; pricing: string }) {
  if (failed) return <p>{words.failed} <a href={pricing}>{words.pricing}</a>.</p>;
  return <Skeleton style={{ height: 160, width: '100%' }} />;
}

const count = (n: unknown, words: (typeof WORDS)['en'], unit = '') =>
  Number(n) >= UNLIMITED ? words.unlimited : `${Number(n) || 0}${unit}`;

type Plan = {
  key: string;
  limits?: Record<string, number>;
  aiMonthlyCredits?: Record<string, number>;
  pricing?: { monthly?: string; yearly?: string };
};

export function PlansTable() {
  const { data, failed, words, pricing } = useCatalog<{ catalog?: { list?: Plan[] } }>('plans-catalog');
  const plans = data?.catalog?.list;
  if (!plans) return <Status failed={failed} words={words} pricing={pricing} />;
  const rows: Array<[string, (p: Plan) => string]> = [
    [words.monthly, (p) => p.pricing?.monthly ?? '—'],
    [words.yearly, (p) => p.pricing?.yearly ?? '—'],
    [words.tracks, (p) => count(p.limits?.maxTracks, words)],
    [words.fileSize, (p) => count(p.limits?.maxFileSizeMB, words, ' MB')],
    [words.worlds, (p) => count(p.limits?.maxEntangledWorlds, words)],
    [words.orbiters, (p) => count(p.limits?.maxOrbiters, words)],
    [words.text, (p) => count(p.aiMonthlyCredits?.text, words)],
    [words.texture, (p) => count(p.aiMonthlyCredits?.texture, words)],
  ];
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{words.plan}</TableHead>
            {plans.map((p) => <TableHead key={p.key}>{p.key}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(([name, value]) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              {plans.map((p) => <TableCell key={p.key}>{value(p)}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p>{words.beforeTax}</p>
    </>
  );
}

type Pack = { type: string; tier: string; credits?: Record<string, number>; pricing?: { oneTime?: string } };

export function CreditPacksTable() {
  const { data, failed, words, pricing } = useCatalog<{ catalog?: { packs?: Pack[] } }>('credits-catalog');
  const packs = data?.catalog?.packs;
  if (!packs) return <Status failed={failed} words={words} pricing={pricing} />;
  const pool = (type: string) => (type === 'text' ? words.poolText : type === 'texture' ? words.poolTexture : type);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{words.pool}</TableHead>
          <TableHead>{words.pack}</TableHead>
          <TableHead>{words.credits}</TableHead>
          <TableHead>{words.price}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {packs.map((k) => (
          <TableRow key={`${k.type}-${k.tier}`}>
            <TableCell>{pool(k.type)}</TableCell>
            <TableCell>{k.tier.charAt(0).toUpperCase() + k.tier.slice(1)}</TableCell>
            <TableCell>{count(k.credits?.[k.type], words)}</TableCell>
            <TableCell>{k.pricing?.oneTime ?? '—'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

type Service = { serviceId: string; allowedSkus?: Array<{ sku: string; label: string; credits: number; capCredits?: number }> };

export function OrchideaPricesTable() {
  const { data, failed, words, pricing } = useCatalog<{ services?: Service[] }>('services-catalog');
  const models = data?.services?.find((s) => s.serviceId === 'orchidea.turn')?.allowedSkus;
  if (!models) return <Status failed={failed} words={words} pricing={pricing} />;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{words.model}</TableHead>
          <TableHead>{words.perRequest}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {models.map((m) => (
          <TableRow key={m.sku}>
            <TableCell>{m.label}</TableCell>
            <TableCell>{(m.capCredits ?? m.credits).toLocaleString(words === WORDS.es ? 'es' : 'en')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
