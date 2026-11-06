// Niveau 3, étape 1 : produit le HTML de l'aperçu STATIQUE de la carte des muscles (clair et sombre) dans screenshots/muscle-map/.
// Les captures WebKit sont faites par tests/screens/muscle-map-preview.spec.ts. Rien de ceci n'entre dans le bundle de production.
// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { mkdirSync, writeFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { generateProgram, toProgramDays } from '../../src/generator';
import { sessionMap, setsOfExercises, weekMap } from '../../src/zones/map-data';
import { MuscleMap, MuscleMapLegend } from '../../src/ui/MuscleMap';
import { FICHES, mk } from './generator-helpers';

// Le composant est pur : on l'appelle directement et on sérialise l'arbre de vnodes en HTML (pas de DOM nécessaire).
type VNode = { type: unknown; props: Record<string, unknown> } | string | number | null | boolean | undefined | VNode[];
const dash = (k: string) => k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const attrName = (k: string) => (k === 'className' ? 'class' : k === 'tabIndex' ? 'tabindex' : ['viewBox', 'patternUnits', 'patternTransform'].includes(k) ? k : dash(k));
function html(n: VNode): string {
  if (n === null || n === undefined || typeof n === 'boolean') return '';
  if (typeof n === 'string' || typeof n === 'number') return String(n).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  if (Array.isArray(n)) return n.map(html).join('');
  const { type, props } = n;
  if (typeof type === 'function') return html((type as (p: unknown) => VNode)(props));
  const { children, ...rest } = props;
  const attrs = Object.entries(rest)
    .filter(([k, v]) => v !== undefined && v !== null && typeof v !== 'function' && k !== 'key' && k !== 'ref')
    .map(([k, v]) => (k === 'style' && typeof v === 'object' ? ` style="${Object.entries(v as object).map(([a, b]) => `${dash(a)}:${b}`).join(';')}"` : ` ${attrName(k)}="${String(v)}"`))
    .join('');
  return `<${type as string}${attrs}>${html(children as VNode)}</${type as string}>`;
}

const FICHE_BY_ID = new Map(FICHES.map((f) => [f.id, f]));
const PUSH = [
  { movementId: 'developpe-couche-barre', sets: 4 },
  { movementId: 'developpe-incline-halteres', sets: 3 },
  { movementId: 'elevation-laterale', sets: 3 },
  { movementId: 'extension-triceps-barre-ez-allonge', sets: 3 },
];

it('génère le HTML de l\'aperçu (séance de poussée, semaine du profil 2)', () => {
  for (const e of PUSH) expect(FICHE_BY_ID.has(e.movementId), e.movementId).toBe(true);
  // Profil 2 de tools/demo-programmes.mjs : intermédiaire, force, 4 jours, salle (haut / bas).
  const r = generateProgram(mk({ level: 'intermediaire', days: 4, dur: 60, goal: 'force', profile: 'F', place: 'salle' }));
  if (!r.ok) throw new Error('programme');
  const days = toProgramDays(r.program).filter((d) => d.exercises.some((e) => e.role !== 'cardio'));
  const session = sessionMap(setsOfExercises(PUSH), FICHE_BY_ID).statuses;
  const week = weekMap(days, FICHE_BY_ID).statuses;
  const body = html([
    { type: 'h2', props: { children: 'Séance de poussée' } },
    { type: 'p', props: { class: 'dim', children: 'Développé couché, développé incliné, élévations latérales, triceps (prise de muscle).' } },
    { type: MuscleMap, props: { view: 'les-deux', statuses: session, label: 'Zones travaillées par la séance de poussée' } },
    { type: 'h2', props: { children: 'Une semaine (profil 2 : 4 jours, force)' } },
    { type: 'p', props: { class: 'dim', children: days.map((d) => d.label).join(', ') } },
    { type: MuscleMap, props: { view: 'les-deux', statuses: week, label: 'Zones travaillées dans la semaine' } },
    { type: MuscleMapLegend, props: {} },
  ] as VNode);
  mkdirSync('screenshots/muscle-map', { recursive: true });
  for (const theme of ['dark', 'light'] as const) {
    const dark = theme === 'dark';
    const doc = `<!doctype html><html lang="fr" data-theme="${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;padding:16px;background:${dark ? '#0f1115' : '#f6f7f9'};color:${dark ? '#f2f4f8' : '#12151b'};font:16px system-ui,sans-serif}h2{font-size:18px;margin:14px 0 2px}.dim{color:${dark ? '#a9b0bf' : '#4d5566'};margin:2px 0 6px;font-size:14px}</style></head><body>${body}</body></html>`;
    writeFileSync(`screenshots/muscle-map/apercu-${theme}.html`, doc);
  }
});
