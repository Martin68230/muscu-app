// Cardio (B4) : knowledge/cardio-regles.md (§3 règles du générateur, §4 types selon le lieu et le matériel, §5 sauts / course /
// grossesse / post-partum / blessures). Toutes les valeurs viennent de CARDIO (config.ts, avec leur statut).
// Choix prudents tant que l'utilisateur n'a pas décidé (docs/QUESTIONS.md Q5-Q10) : aucun saut, corde, course, cardio dehors,
// fiche machine ni intervalle soutenu ; effort modéré seulement.
import type { Level } from '../data/model';
import { CARDIO } from './config';
import { levelIdx, type Ctx } from './context';
import { CARDIO_TEXT } from './messages';
import { warmupVariant } from './safety';
import type { CardioItem, GeneratorInput } from './types';

export type CardioRole = 'principal' | 'secondaire' | null;

/** Rôle du cardio dans les objectifs classés : rang 1 = principal ; rang 2 ou plus = secondaire (goal-resolver.md). */
export function cardioRoleOf(goals: GeneratorInput['goals']): CardioRole {
  const sorted = [...(goals ?? [])].sort((a, b) => a.rank - b.rank);
  if (!sorted.length) return null;
  if (sorted[0].goalKey === CARDIO.goalKey) return 'principal';
  return sorted.slice(1).some((g) => g.goalKey === CARDIO.goalKey) ? 'secondaire' : null;
}

/** Niveau qui fixe les durées : grossesse / post-partum = durées du débutant (9bis Q4d ; réserve n° 10 du recontrôle relecteur). */
export const cardioLevel = (ctx: Ctx): Level => (ctx.pregnant ? CARDIO.pregnancyLevel : ctx.level);

export interface CardioChoice {
  ficheId: string;
  variantId: string;
  nom: string;
}

/**
 * §4 / §5 : premier type de la liste CARDIO.types qui passe tous les filtres : niveau, grossesse / post-partum (liste
 * blanche), zones retirées par la règle cardio, puis la fiche elle-même (statut, matériel du profil, cases garder / adapter /
 * retirer des zones et de la ligne Grossesse, via warmupVariant). Jamais une variante hors profil ; null si rien ne convient.
 */
export function chooseCardio(ctx: Ctx): CardioChoice | null {
  for (const t of CARDIO.types) {
    if (levelIdx(t.minLevel) > ctx.levelI) continue;
    if (ctx.pregnant && ctx.postPartum && !t.postPartum) continue;
    if (ctx.pregnant && !ctx.postPartum && !t.grossesse) continue;
    if (ctx.zones.some((z) => !z.isG && t.excludeZones.includes(z.key))) continue;
    const f = ctx.variantOwner.get(t.variantId);
    if (!f) continue;
    const r = warmupVariant(f, ctx, t.variantId);
    if (!r || r.variant.id !== t.variantId) continue;
    return { ficheId: f.id, variantId: t.variantId, nom: `${f.nom} (${r.variant.nom})` };
  }
  return null;
}

/**
 * §3.5 : plan des semaines du bloc. Une seule variable (la durée) ; +10 % au plus par semaine, arrondi vers le bas, jamais
 * au-dessus du plafond (niveau, temps disponible) ; la 4e semaine est allégée (-30 %), sans descendre sous `floorMin`.
 * Grossesse / post-partum : pas de progression (réserve n° 10 du recontrôle relecteur). Comme chaque semaine fait au plus +10 % de la précédente et que la
 * durée ne baisse qu'en semaine 4, le garde-fou « 110 % de la plus longue des 30 derniers jours » est respecté.
 */
export function weekPlan(startMin: number, capMin: number, floorMin: number, weeks: number, progress: boolean): number[] {
  const out: number[] = [];
  let cur = Math.min(startMin, capMin);
  for (let w = 1; w <= weeks; w++) {
    if (w === CARDIO.recoveryWeek) {
      const prev = out[out.length - 1] ?? cur;
      out.push(Math.max(Math.min(floorMin, prev), Math.floor(prev * CARDIO.recoveryFactor)));
      continue;
    }
    if (w > 1 && progress) cur = Math.min(capMin, Math.floor(cur * (1 + CARDIO.weeklyIncrease)));
    out.push(cur);
  }
  return out;
}

export function cardioItem(kind: CardioItem['kind'], choice: CardioChoice, startMin: number, capMin: number, weeks: number, ctx: Ctx): CardioItem {
  const weekMin = weekPlan(startMin, capMin, CARDIO.blockMinMin, weeks, !ctx.pregnant);
  return {
    kind,
    ...choice,
    minutes: weekMin[0],
    weekMin,
    capMin,
    intensity: 'moderee',
    note: CARDIO_TEXT.T7,
  };
}

/** Durée de départ et plafond d'une séance dédiée (§3.3) : jamais plus que D. */
export function dedicatedMinutes(ctx: Ctx, dMin: number): { start: number; cap: number } {
  const lvl = cardioLevel(ctx);
  const cap = ctx.pregnant ? CARDIO.dedicatedStartMin[lvl] : CARDIO.dedicatedMaxMin[lvl];
  return { start: Math.min(CARDIO.dedicatedStartMin[lvl], dMin), cap: Math.min(cap, dMin) };
}

/** Plafond d'un bloc (§3.4) : niveau (grossesse : débutant, sans progression), temps restant, 25 % en secondaire. */
export function blockCap(ctx: Ctx, role: 'principal' | 'secondaire', muscuSec: number, dSec: number): number {
  const lvl = cardioLevel(ctx);
  const byLevel = ctx.pregnant ? CARDIO.blockStartMin : CARDIO.blockMaxMin[lvl];
  const left = Math.floor((dSec - muscuSec) / 60);
  const share = role === 'secondaire' ? Math.floor((muscuSec / 60) * CARDIO.secondaryMaxShare) : Infinity;
  return Math.min(byLevel, left, share);
}

/**
 * §3.2 placement : jours de cardio dédiés parmi les jours libres (ni bloqués, ni jour de musculation : jamais de séance double).
 * Préférence (NON SOURCÉ) : pas la veille d'une séance de musculation (jambes lourdes du corps entier), puis écart le plus
 * grand entre jours d'entraînement, puis ordre lexicographique (déterministe).
 */
export function chooseCardioDays(blocked: number[], muscuDays: number[], count: number): number[] {
  const free = [0, 1, 2, 3, 4, 5, 6].filter((d) => !blocked.includes(d) && !muscuDays.includes(d));
  const k = Math.min(count, free.length);
  if (k <= 0) return [];
  const combos = (items: number[], n: number): number[][] =>
    n === 0 ? [[]] : items.flatMap((x, i) => combos(items.slice(i + 1), n - 1).map((r) => [x, ...r]));
  const eve = (d: number) => muscuDays.includes((d + 1) % 7);
  let best: { days: number[]; score: [number, number] } | null = null;
  for (const c of combos(free, k)) {
    const all = [...c, ...muscuDays].sort((a, b) => a - b);
    const gaps = all.slice(1).map((d, i) => d - all[i]);
    if (all.length > 1) gaps.push(7 + all[0] - all[all.length - 1]);
    const score: [number, number] = [-c.filter(eve).length, all.length > 1 ? Math.min(...gaps) : 7];
    if (!best || score[0] > best.score[0] || (score[0] === best.score[0] && score[1] > best.score[1])) best = { days: c, score };
  }
  return best!.days;
}
