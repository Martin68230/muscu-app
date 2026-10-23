// Échauffement et retour au calme (V-ECH §4.3, V-COU §6.5). L'app ne dit pas que l'échauffement prévient les blessures (SRC11).
import type { WarmupSet } from '../data/model';
import { WARMUP } from './config';
import type { Ctx } from './context';
import { allowedVariants, warmupVariant } from './safety';
import type { GenExercise, WarmupItem } from './types';

function item(ficheId: string, ctx: Ctx, sec: number, preferVariant?: string): WarmupItem | null {
  const f = ctx.fichesById.get(ficheId);
  if (!f) return null;
  const r = warmupVariant(f, ctx, preferVariant);
  if (!r) return null;
  return { ficheId: f.id, variantId: r.variant.id, nom: `${f.nom} (${r.variant.nom})`, sec, adaptations: r.adaptations };
}

/** E1 : une variante cardio sans saut (échelon 1), dans l'ordre de la liste, après les filtres. */
export function generalWarmup(ctx: Ctx): WarmupItem | null {
  for (const vid of WARMUP.cardioVariants) {
    const f = ctx.variantOwner.get(vid);
    if (!f) continue;
    const it = item(f.id, ctx, WARMUP.generalSec, vid);
    if (it && it.variantId === vid) return it;
  }
  return null;
}

/** E2 : 2 fiches de mobilité liées aux piliers du jour (jambes puis haut du corps) ; cou niveau 1-2 : 1 fiche douce remplace la 2e. */
export function mobilityWarmup(ctx: Ctx, hasHinge: boolean): WarmupItem[] {
  const pick = (ids: readonly string[], taken: Set<string>) => {
    for (const id of ids) {
      if (taken.has(id)) continue;
      const it = item(id, ctx, WARMUP.mobilitySecEach);
      if (it) return it;
    }
    return null;
  };
  const taken = new Set<string>();
  const out: WarmupItem[] = [];
  const lists = [WARMUP.mobilityLegs, WARMUP.mobilityUpper, hasHinge ? WARMUP.mobilityHinge : [], WARMUP.mobilityLegs, WARMUP.mobilityUpper];
  for (const l of lists) {
    if (out.length >= WARMUP.mobilityCount) break;
    const it = pick(l, taken);
    if (it) {
      out.push(it);
      taken.add(it.ficheId);
    }
  }
  if ((ctx.neckLevel === 1 || ctx.neckLevel === 2) && !ctx.neckShock) {
    const neck = pick(WARMUP.neckSoft, taken);
    if (neck) {
      if (out.length >= WARMUP.mobilityCount) out[out.length - 1] = neck;
      else out.push(neck);
    }
  }
  return out;
}

export function cooldown(ctx: Ctx): WarmupItem | null {
  for (const id of WARMUP.cooldown) {
    const it = item(id, ctx, 0);
    if (it) return it;
  }
  return null;
}

/**
 * E3 avant chaque pilier : chargeable -> 8 répétitions à ~50 % ; + 3 à ~75 % si répétitions cibles <= 6 et aucun plafond ;
 * poids du corps / élastique -> 6 répétitions à l'échelon inférieur (ou au même échelon).
 */
export function e3Sets(ex: GenExercise, ctx: Ctx): WarmupSet[] {
  if (ex.role !== 'pilier') return [];
  if (ex.chargeable) {
    const sets: WarmupSet[] = [{ reps: WARMUP.e3LightReps, percent: WARMUP.e3LightPercent, echelon: null }];
    if (ex.repsMax <= WARMUP.e3HeavyIfRepsMaxAtMost && !ex.capped && !ctx.pregnant) {
      sets.push({ reps: WARMUP.e3HeavyReps, percent: WARMUP.e3HeavyPercent, echelon: null });
    }
    return sets;
  }
  let echelon = ex.echelon;
  // Échelon inférieur seulement si la fiche est placée sans adaptation ni remplacement (prudence).
  const f = ctx.fichesById.get(ex.ficheId);
  if (f && !ex.adaptations.length && !ex.replaces) {
    const lower = allowedVariants(f, ctx).map((v) => v.echelon).filter((e) => e < ex.echelon);
    if (lower.length) echelon = Math.max(...lower);
  }
  return [{ reps: WARMUP.e3BodyweightReps, percent: null, echelon }];
}
