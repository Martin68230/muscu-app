// R-REPS (knowledge/repetitions-regles.md) : rôle de dose, clé d'objectif et classe D1-D4 d'une variante, et admissibilité des D3 / D4.
import {
  ADJUSTABLE_TAGS, ASSISTANCE_TAGS, D1_VARIANTS, D3_VARIANTS, D4_FICHES, D4_NEVER, D_CLASS_BY_NIVEAU, ISOLATION_FICHE_PREFIXES, REPS_GOAL,
  type DoseRole, type RepsGoal,
} from './config';
import type { Ctx } from './context';
import { PILLAR_SLOTS } from './slots';
import type { Fiche, FicheVariant, SlotKey } from './types';

export type DClass = 1 | 2 | 3 | 4;

/** §2 : pilier (PILLAR_SLOTS), isolation (emplacement `iso_*` ou fiche d'isolation), sinon accessoire. */
export function doseRoleOf(slot: SlotKey, fiche: Pick<Fiche, 'id'>): DoseRole {
  if (slot.startsWith('iso_') || slot === 'correctif' || ISOLATION_FICHE_PREFIXES.some((p) => fiche.id.startsWith(p))) return 'isolation';
  if (PILLAR_SLOTS.includes(slot)) return 'pilier_lourd';
  return 'accessoire';
}

/** Clé d'objectif : grossesse -> santé (P-GROS) ; perte de gras sans ligne pour le pilier -> muscle (§3). */
export function repsGoalOf(ctx: Pick<Ctx, 'goalKey' | 'pregnant'>, role: DoseRole): RepsGoal {
  if (ctx.pregnant) return 'sante';
  const g = (ctx.goalKey && REPS_GOAL[ctx.goalKey]) || 'sante';
  return g === 'perte_gras' && role === 'pilier_lourd' ? 'muscle' : g;
}

/** Variante dont la charge ou la tension se règle (table par rôle) ; l'élastique d'une traction assistée ne compte pas. */
export function isAdjustable(v: Pick<FicheVariant, 'tags'>): boolean {
  if (v.tags.some((t) => ASSISTANCE_TAGS.includes(t))) return v.tags.some((t) => ADJUSTABLE_TAGS.includes(t) && t !== 'elastique' && t !== 'mini_bande');
  return v.tags.some((t) => ADJUSTABLE_TAGS.includes(t));
}

/** §4 : classe D1-D4 d'une variante non réglable ; null pour une variante réglable (table par rôle). */
export function variantClass(f: Pick<Fiche, 'id'>, v: Pick<FicheVariant, 'id' | 'tags' | 'niveau'>): DClass | null {
  if (D4_FICHES[f.id] || D4_NEVER.includes(f.id) || D4_NEVER.includes(v.id)) return 4;
  if (isAdjustable(v)) return null;
  if (D1_VARIANTS.includes(v.id)) return 1;
  if (D3_VARIANTS.includes(v.id)) return 3;
  return D_CLASS_BY_NIVEAU[v.niveau];
}

export const isNeverProposed = (f: Pick<Fiche, 'id'>, v: Pick<FicheVariant, 'id'>): boolean => D4_NEVER.includes(f.id) || D4_NEVER.includes(v.id);

/** Une variante de la fiche a déjà été faite (historique) : ce n'est plus la première séance de cet exercice. */
const ficheHasHistory = (f: Pick<Fiche, 'variantes'>, ctx: Pick<Ctx, 'history'>): boolean => f.variantes.some((x) => ctx.history.has(x.id));

/**
 * Admissibilité d'une variante selon sa classe (§4, §5) : jamais D4_NEVER ; D4 avancé seulement, hors grossesse / post-partum et sans
 * zone sensible de la fiche active ; D3 jamais en grossesse / post-partum ; D3 du débutant jamais à la première séance de l'exercice.
 */
export function classAllowed(f: Pick<Fiche, 'id' | 'variantes'> & { securite?: Pick<Fiche['securite'], 'zones'> }, v: Pick<FicheVariant, 'id' | 'tags' | 'niveau'>, ctx: Ctx): boolean {
  if (isNeverProposed(f, v)) return false;
  const k = variantClass(f, v);
  if (k === 4) {
    if (ctx.level !== 'avance' || ctx.pregnant || ctx.postPartum || ctx.repriseActive) return false;
    // [kine 05/11/2026] Garde-fou : 2 séances au haut du D3 voisin (variante par variante : ex. pompe à un bras au sol après la chaise).
    if (!ctx.d4Open.has(v.id)) return false;
    // Zone sensible de la classe, ou toute zone gênée qui a une ligne dans la fiche (§6 : aucune fourchette <= 6 sur la zone).
    const zones = D4_FICHES[f.id] ?? [];
    if (ctx.zones.some((z) => !z.isG && z.level >= 1 && (zones.includes(z.key) || !!f.securite?.zones[z.key]))) return false;
  }
  if (k === 3) {
    if (ctx.pregnant || ctx.postPartum) return false;
    if (ctx.level === 'debutant' && !ficheHasHistory(f, ctx)) return false;
  }
  return true;
}
