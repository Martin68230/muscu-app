// D30 : isolation (knowledge/structure-programmes.md §2.4, STR-ISO-0 à 5). Emplacements `iso_biceps`, `iso_deltoide_lateral`,
// `iso_mollets` ajoutés APRÈS tous les autres (piliers, noyau, accessoires), seulement s'il reste du temps, jamais au-delà du plafond
// d'emplacements, coupés en premier (ils ne sont ajoutés qu'à la fin). Valeurs : ISOLATION (config.ts), NON SOURCÉ.
import { ISOLATION } from './config';
import { levelIdx, type Ctx } from './context';
import { buildExercise } from './dose';
import { resolveFiche } from './safety';
import type { Fiche, GenExercise, GenProgram } from './types';

/**
 * STR-ISO-2 (conditions, appliquées à tous les niveaux par lecture prudente) : objectif « prise de muscle » de rang 1 (pas la perte de
 * gras ramenée à muscle), au moins 3 jours, corps entier ou haut / bas, hors grossesse et post-partum ; débutant : exception ouverte
 * (STR-ISO-1, calculée par session/program.ts).
 */
export function isoEligible(ctx: Ctx, split: GenProgram['split'], nDays: number): boolean {
  if (ctx.goalKey !== ISOLATION.goal || ctx.pregnant || !ctx.isoOpen) return false;
  if (nDays < ISOLATION.minDays) return false;
  return split === 'corps_entier' || split === 'haut_bas';
}

export type IsoDef = (typeof ISOLATION.slots)[number];

/**
 * Exercice d'isolation d'un groupe : fiche du schéma dont le muscle principal est le groupe visé, sûre pour le profil (resolveFiche :
 * matériel, niveau, lignes de zone, exercice technique exclu), jamais déjà dans la séance. Retiré dès le niveau 1 d'une zone qu'il
 * sollicite (STR-ISO-2). Débutant : fiche de niveau « débutant » seulement (STR-ISO-3) ; élévation latérale : charge la plus légère,
 * jamais augmentée (STR-ISO-3bis, `capped`).
 */
export function isoExercise(def: IsoDef, ctx: Ctx, pool: readonly Fiche[], used: ReadonlySet<string>): GenExercise | null {
  if (ctx.zones.some((z) => !z.isG && z.level >= 1 && def.zones.includes(z.key))) return null;
  for (const f of pool) {
    if (f.schema !== def.schema || !f.musclesPrincipaux.includes(def.muscle) || used.has(f.id)) continue;
    if (ctx.level === 'debutant' && levelIdx(f.niveauMin) > 0) continue;
    const cand = resolveFiche(f, ctx).candidates.find((c) => c.fiche.id === f.id && !c.replaces);
    if (!cand) continue;
    const ex = buildExercise(cand, def.slot, 'a', ctx);
    ex.sets = ISOLATION.setsPerExercise;
    ex.role = 'autre';
    ex.warmupSets = [];
    if (ctx.level === 'debutant' && def.slot === 'iso_deltoide_lateral') {
      ex.capped = true;
      ex.cappedLabel = 'Charge très légère : bras jusqu’à l’horizontale, jamais au-dessus, sans élan.';
    }
    return ex;
  }
  return null;
}

/** Séries d'isolation déjà comptées pour un groupe dans une séance (le repli `cheville_mollet` de jambes_3 / 4 compte « mollets », STR-ISO-0). */
export function isoSetsIn(exercises: readonly GenExercise[], def: IsoDef): number {
  return exercises
    .filter((e) => e.slot === def.slot || (def.slot === 'iso_mollets' && (e.slot === 'jambes_3' || e.slot === 'jambes_4') && e.schema === 'cheville_mollet'))
    .reduce((a, e) => a + e.sets, 0);
}

export const isIsoSlot = (slot: string): boolean => slot.startsWith('iso_');
