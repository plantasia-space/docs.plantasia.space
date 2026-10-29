import React, { useEffect, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'plantasia.space-design/react';

/**
 * Plan, pack, credit and Orchidea facts, read live from the one plans summary (root's
 * /api/subscriptions/plans-summary, built by the backend from the same settings as the pricing page
 * and the model pickers). Orchidea answers from the same summary, so the page and its answers never
 * disagree, and the pages hold no figures of their own.
 */

type Amount = number | 'unlimited';
type Summary = {
  pricesBeforeTax: boolean;
  pricesKnown: boolean;
  plans: Array<{
    plan: string;
    free: boolean;
    price: { monthly: string | null; yearly: string | null } | null;
    limits: { tracks: Amount; fileSizeMB: Amount; entangledWorlds: Amount; orbiters: Amount };
    monthlyAiCredits: Amount;
    orbiterStudio: boolean;
    orchideaIn: string[];
  }>;
  credits?: { creditValueEUR: number; expiryMonths: number; planCreditsReset: string };
  creditPacks: Array<{ pack: string; credits: Amount; price: string | null }>;
  orchidea: Array<{ app: string; fromPlan: string; models: Array<{ model: string; creditsPerRequestAtMost: number | null }> }>;
};

const WORDS = {
  en: {
    plan: 'Plan', monthly: 'Monthly', yearly: 'Yearly', free: 'Free', tracks: 'Tracks', fileSize: 'File size',
    worlds: 'Entangled Worlds', orbiters: 'Orbiters', aiCredits: 'AI credits each month',
    orchidea: 'Orchidea', studio: 'Orbiter Studio', yes: 'Yes', unlimited: 'Unlimited', pack: 'Pack', credits: 'Credits', price: 'Price',
    where: 'Where', fromPlan: 'From plan', model: 'Model', perRequest: 'Credits per request, at most',
    packs: { small: 'Small', medium: 'Medium', large: 'Large' } as Record<string, string>,
    creditFacts: (value: string, months: number) => `One credit is worth ${value} before tax. Bought credits last ${months} months from the day you buy them; plan credits reset every month.`,
    apps: { root: 'plantasia.space', docs: 'These docs', orbiters: 'Orbiter Studio', 'entangled-worlds': 'Entangled World Studio' } as Record<string, string>,
    failed: 'The current figures could not load here. They are on the', pricing: 'pricing page', beforeTax: 'Prices are shown before tax.',
    noPrices: 'Prices could not load just now. They are on the',
  },
  es: {
    plan: 'Plan', monthly: 'Mensual', yearly: 'Anual', free: 'Gratis', tracks: 'Pistas', fileSize: 'Tamaño de archivo',
    worlds: 'Entangled Worlds', orbiters: 'Orbiters', aiCredits: 'Créditos de IA al mes',
    orchidea: 'Orchidea', studio: 'Orbiter Studio', yes: 'Sí', unlimited: 'Ilimitado', pack: 'Paquete', credits: 'Créditos', price: 'Precio',
    where: 'Dónde', fromPlan: 'Desde el plan', model: 'Modelo', perRequest: 'Créditos por petición, como máximo',
    packs: { small: 'Pequeño', medium: 'Mediano', large: 'Grande' } as Record<string, string>,
    creditFacts: (value: string, months: number) => `Un crédito vale ${value} sin impuestos. Los créditos comprados duran ${months} meses desde el día de la compra; los del plan se reinician cada mes.`,
    apps: { root: 'plantasia.space', docs: 'Esta documentación', orbiters: 'Orbiter Studio', 'entangled-worlds': 'Entangled World Studio' } as Record<string, string>,
    failed: 'Las cifras actuales no se pudieron cargar aquí. Están en la', pricing: 'página de precios', beforeTax: 'Los precios se muestran sin impuestos.',
    noPrices: 'Los precios no se pudieron cargar ahora. Están en la',
  },
};
type Words = (typeof WORDS)['en'];

// One request per language, shared by every table; a summary without prices is asked for again next time.
const loads = new Map<string, Promise<Summary>>();

function useSummary(): { summary: Summary | null; failed: boolean; words: Words; lang: 'en' | 'es'; pricing: string } {
  const { siteConfig, i18n } = useDocusaurusContext();
  const root = String(siteConfig.customFields?.rootBase ?? '');
  const lang = i18n.currentLocale === 'es' ? 'es' : 'en';
  const [state, setState] = useState<{ summary: Summary | null; failed: boolean }>({ summary: null, failed: false });
  useEffect(() => {
    let live = true;
    const key = `${root}|${lang}`;
    if (!loads.has(key)) {
      loads.set(key, fetch(`${root}/api/subscriptions/plans-summary?locale=${lang}`, { credentials: 'omit' })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then((body) => {
          const summary = body.summary as Summary;
          if (!summary.pricesKnown) loads.delete(key);
          return summary;
        })
        .catch((err) => { loads.delete(key); throw err; }));
    }
    loads.get(key)!
      .then((summary) => { if (live) setState({ summary, failed: false }); })
      .catch(() => { if (live) setState({ summary: null, failed: true }); });
    return () => { live = false; };
  }, [root, lang]);
  return { ...state, words: WORDS[lang], lang, pricing: `${root}/${lang}/pricing` };
}

function Status({ failed, words, pricing }: { failed: boolean; words: Words; pricing: string }) {
  if (failed) return <p>{words.failed} <a href={pricing}>{words.pricing}</a>.</p>;
  return <Skeleton style={{ height: 160, width: '100%' }} />;
}

// A number or 'unlimited'; anything else (a summary in an older shape) shows as unknown, never as '[object Object]'.
const show = (n: Amount, words: Words, unit = '') =>
  n === 'unlimited' ? words.unlimited : typeof n === 'number' ? `${n}${unit}` : '—';

export function PlansTable() {
  const { summary, failed, words, pricing } = useSummary();
  if (!summary) return <Status failed={failed} words={words} pricing={pricing} />;
  const { plans } = summary;
  type Plan = Summary['plans'][number];
  const price = (p: Plan, cycle: 'monthly' | 'yearly') => (p.free ? words.free : p.price?.[cycle] ?? '—');
  const rows: Array<[string, (p: Plan) => string]> = [
    [words.monthly, (p) => price(p, 'monthly')],
    [words.yearly, (p) => price(p, 'yearly')],
    [words.tracks, (p) => show(p.limits.tracks, words)],
    [words.fileSize, (p) => show(p.limits.fileSizeMB, words, ' MB')],
    [words.worlds, (p) => show(p.limits.entangledWorlds, words)],
    [words.orbiters, (p) => show(p.limits.orbiters, words)],
    [words.aiCredits, (p) => show(p.monthlyAiCredits, words)],
    [words.studio, (p) => (p.orbiterStudio ? words.yes : '—')],
    [words.orchidea, (p) => p.orchideaIn.map((app) => words.apps[app] ?? app).join(', ') || '—'],
  ];
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{words.plan}</TableHead>
            {plans.map((p) => <TableHead key={p.plan}>{p.plan}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(([name, value]) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              {plans.map((p) => <TableCell key={p.plan}>{value(p)}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {summary.pricesKnown
        ? summary.pricesBeforeTax ? <p>{words.beforeTax}</p> : null
        : <p>{words.noPrices} <a href={pricing}>{words.pricing}</a>.</p>}
    </>
  );
}

export function CreditPacksTable() {
  const { summary, failed, words, pricing } = useSummary();
  if (!summary) return <Status failed={failed} words={words} pricing={pricing} />;
  return (
    <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{words.pack}</TableHead>
          <TableHead>{words.credits}</TableHead>
          <TableHead>{words.price}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {summary.creditPacks.map((k) => (
          <TableRow key={k.pack}>
            <TableCell>{words.packs[k.pack] ?? k.pack}</TableCell>
            <TableCell>{show(k.credits, words)}</TableCell>
            <TableCell>{k.price ?? '—'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    {summary.pricesKnown ? null : <p>{words.noPrices} <a href={pricing}>{words.pricing}</a>.</p>}
    </>
  );
}

/** One sentence: what a credit is worth and how long bought credits last, from the summary. */
export function CreditFacts() {
  const { summary, failed, words, lang, pricing } = useSummary();
  if (!summary) return <Status failed={failed} words={words} pricing={pricing} />;
  if (!summary.credits) return null;
  const value = summary.credits.creditValueEUR.toLocaleString(lang, { style: 'currency', currency: 'EUR' });
  return <p>{words.creditFacts(value, summary.credits.expiryMonths)}</p>;
}

export function OrchideaPricesTable() {
  const { summary, failed, words, lang, pricing } = useSummary();
  if (!summary) return <Status failed={failed} words={words} pricing={pricing} />;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{words.where}</TableHead>
          <TableHead>{words.fromPlan}</TableHead>
          <TableHead>{words.model}</TableHead>
          <TableHead>{words.perRequest}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {summary.orchidea.flatMap((o) => o.models.map((m, i) => (
          <TableRow key={`${o.app}-${m.model}`}>
            <TableCell>{i === 0 ? words.apps[o.app] ?? o.app : ''}</TableCell>
            <TableCell>{i === 0 ? o.fromPlan : ''}</TableCell>
            <TableCell>{m.model}</TableCell>
            <TableCell>{m.creditsPerRequestAtMost == null ? '—' : m.creditsPerRequestAtMost.toLocaleString(lang)}</TableCell>
          </TableRow>
        )))}
      </TableBody>
    </Table>
  );
}
