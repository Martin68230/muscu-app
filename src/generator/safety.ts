// Filtres de §6 : fiches admissibles (V-ADM), matériel (V-MAT), échelon (V-ECHELON), blessures (V-BLESS),
// cou (V-COU), grossesse (V-GROS), plafond `capped` (P-CAP, R2, §6.8 point 1).
// Règle V-PRIO : ces filtres passent avant toute règle de dose ou de structure.
import { NECK_DEDICATED_IDS, neckFicheAllowed } from '../data/injury-rules';
import { CAPPED_LOWEST_START, INTERMEDIATE_ECHELON_OFFSET, TAG_ORDER } from './config';
import { isChargeable, levelIdx, type Ctx, type ZoneEntry } from './context';
import type { Fiche, FicheVariant, SafetyCase } from './types';

export const USABLE_STATUTS = ['utilisable', 'verifie'];

/** V-ADM 1, 4, 5, 6 + filterByNeck (C1-C3) + post-partum sans saut (G7) + fiches masquées. */
export function ficheAdmissible(f: Fiche, ctx: Ctx, opts: { warmup?: boolean } = {}): boolean {
  if (!USABLE_STATUTS.includes(f.statut)) return false; // V-ADM 1 (règle 22)
  if (levelIdx(f.niveauMin) > ctx.levelI) return false; // V-ADM 4
  if (f.technique === true || f.technique === 'oui') return false; // V-ADM 5 : proposée à personne en v1
  if (!neckFicheAllowed({ id: f.id, douxPour: f.douxPour }, ctx.neckLevel)) return false; // V-COU
  if (!opts.warmup && NECK_DEDICATED_IDS.includes(f.id)) return false; // V-ADM 6 / C2
  if (ctx.pregnant && ctx.postPartum && f.schema === 'saut') return false; // G7
  if (f.schema === 'saut' && !opts.warmup) return false; // §2.2 : sauts jamais placés en v1 (D3)
  if (ctx.masques.has(f.id)) return false;
  return true;
}

export interface Restrict {
  only?: Set<string>;
  sansCharge?: boolean;
}

/** Variantes compatibles : tout le matériel dans le profil (V-MAT), niveau, règle 23, restrictions de sécurité. */
export function allowedVariants(f: Fiche, ctx: Ctx, r: Restrict = {}): FicheVariant[] {
  if (!r.only && !r.sansCharge) {
    const key = `v:${f.id}`;
    let hit = ctx.memo.get(key) as FicheVariant[] | undefined;
    if (!hit) {
      hit = filterVariants(f, ctx, r);
      ctx.memo.set(key, hit);
    }
    return hit;
  }
  return filterVariants(f, ctx, r);
}

function filterVariants(f: Fiche, ctx: Ctx, r: Restrict): FicheVariant[] {
  return f.variantes.filter((v) => {
    if (!v.tags.length || !v.tags.every((t) => ctx.available.has(t))) return false;
    if (levelIdx(v.niveau) > ctx.levelI) return false;
    if (ctx.specialiseForbidden && v.tags.includes('materiel_specialise')) return false;
    if (r.only && !r.only.has(v.id)) return false;
    if (r.sansCharge && isChargeable(v)) return false;
    return true;
  });
}

const tagRank = (v: FicheVariant): number => {
  const ranks = v.tags.map((t) => TAG_ORDER.indexOf(t)).filter((i) => i >= 0);
  return ranks.length ? Math.min(...ranks) : TAG_ORDER.length;
};

/** Départage à échelon égal (V-ECHELON) : (a) force/muscle chargeable puis ordre des tags ; sante moins de tags ; (b) moins de tags ; (c) ordre de la fiche. */
export function sortSameEchelon(f: Fiche, list: FicheVariant[], ctx: Ctx): FicheVariant[] {
  const idx = (v: FicheVariant) => f.variantes.indexOf(v);
  return [...list].sort((x, y) => {
    if (ctx.family === 'force' || ctx.family === 'muscle') {
      const c = (isChargeable(x) ? 0 : 1) - (isChargeable(y) ? 0 : 1);
      if (c) return c;
      const t = tagRank(x) - tagRank(y);
      if (t) return t;
    }
    return x.tags.length - y.tags.length || idx(x) - idx(y);
  });
}

function pickAt(f: Fiche, list: FicheVariant[], echelon: number, ctx: Ctx): FicheVariant {
  return sortSameEchelon(f, list.filter((v) => v.echelon === echelon), ctx)[0];
}

export function lowestVariant(f: Fiche, list: FicheVariant[], ctx: Ctx): FicheVariant {
  return pickAt(f, list, Math.min(...list.map((v) => v.echelon)), ctx);
}

/** Variante avec historique (dernière faite), si elle est encore permise. */
function historyVariant(list: FicheVariant[], ctx: Ctx): FicheVariant | null {
  let best: FicheVariant | null = null;
  let at = '';
  for (const v of list) {
    const h = ctx.history.get(v.id);
    if (h && h.lastAt > at) {
      at = h.lastAt;
      best = v;
    }
  }
  return best;
}

/**
 * V-ECHELON §6.3 : débutant = échelon le plus bas ; intermédiaire = un sous le plus haut de son niveau (DÉFAUT-1) ;
 * avancé = le plus haut ; sous plafond (capped, grossesse) : le plus bas pour une variante sans historique (DÉFAUT-5),
 * variante avec historique conservée (sans hausse).
 */
export function chooseVariant(f: Fiche, list: FicheVariant[], ctx: Ctx, capped: boolean): FicheVariant {
  const hist = historyVariant(list, ctx);
  if (hist) return hist;
  if ((capped || ctx.pregnant) && CAPPED_LOWEST_START) return lowestVariant(f, list, ctx);
  const echelons = [...new Set(list.map((v) => v.echelon))].sort((a, b) => a - b);
  if (ctx.level === 'debutant') return pickAt(f, list, echelons[0], ctx);
  const hi = echelons[echelons.length - 1];
  if (ctx.level === 'avance') return pickAt(f, list, hi, ctx);
  const target = Math.max(1, hi - INTERMEDIATE_ECHELON_OFFSET);
  const below = echelons.filter((e) => e <= target);
  return pickAt(f, list, below.length ? below[below.length - 1] : echelons[0], ctx);
}

// ---------------------------------------------------------------------------------------------
// Cases de sécurité (V-BLESS §6.4, V-GROS §6.6)
// ---------------------------------------------------------------------------------------------
const GARDER: SafetyCase = { action: 'garder' };

export function caseFor(f: Fiche, e: ZoneEntry): SafetyCase {
  if (e.isG) return f.securite.grossesse ?? GARDER;
  return f.securite.zones[e.key]?.[e.level - 1] ?? GARDER; // zone absente du tableau = garder
}
export const hasLine = (f: Fiche, e: ZoneEntry): boolean => e.isG || !!f.securite.zones[e.key];

/** P-CAP / R2 / §6.8 point 1 : capped si grossesse, ou zone au niveau 2 ayant une ligne (quelle que soit la case), ou case charge:legere. */
export function isCappedFiche(f: Fiche, ctx: Ctx): boolean {
  if (ctx.pregnant) return true;
  return ctx.zones.some((e) => (!e.isG && e.level === 2 && hasLine(f, e)) || caseFor(f, e).charge === 'legere');
}

/** Zones au niveau 2 qui gèlent la charge (affichage « Charge maintenue : gêne {zone} »). */
export function cappingZones(f: Fiche, ctx: Ctx): string[] {
  return ctx.zones.filter((e) => !e.isG && (e.level === 2 && hasLine(f, e) || caseFor(f, e).charge === 'legere')).map((e) => e.key);
}

function adaptationLabels(c: SafetyCase): string[] {
  const out: string[] = [];
  if (c.charge === 'legere') out.push('charge:legere');
  if (c.sansCharge) out.push('sans-charge');
  if (c.amplitude) out.push(`amplitude:${c.amplitude}`);
  if (c.appui) out.push(`appui:${c.appui}`);
  if (c.variante) out.push(`variante:${c.variante}`);
  return out;
}

function noteTexts(f: Fiche, entries: ZoneEntry[]): string[] {
  const notes = f.securite.notes ?? {};
  const out: string[] = [];
  for (const e of entries) {
    const k = e.isG ? 'grossesse' : `${e.key}-n${e.level}`;
    if (notes[k]) out.push(notes[k]);
  }
  return out;
}

export interface Candidate {
  fiche: Fiche;
  variant: FicheVariant;
  /** Fiche du classement d'où vient le candidat (elle-même, ou la fiche remplacée). */
  origin: Fiche;
  /** Une case `adapter` (ou un remplacement) est active : passe après une fiche sans adaptation (V-CLASSE clé 2). */
  adapted: boolean;
  capped: boolean;
  adaptations: string[];
  notes: string[];
  replaces: string | null;
}
export interface Resolution {
  candidates: Candidate[];
  /** Zones (ou `grossesse`) qui retirent la fiche : cité par V-MSG-ZONE. */
  blockedBy: string[];
}

/** Cible désignée par une case (variante, remplaçant, sans-zone) : id de variante, ou id de fiche (= son échelon le plus bas). */
function resolveTarget(id: string, ctx: Ctx): { fiche: Fiche; variantId: string | null } | null {
  const owner = ctx.variantOwner.get(id);
  if (owner) return { fiche: owner, variantId: id };
  const f = ctx.fichesById.get(id);
  return f ? { fiche: f, variantId: null } : null;
}

/**
 * Remplaçant (§0 de regles-securite-communes.md, V-BLESS) : proposé seulement s'il passe tous les filtres et n'est
 * lui-même ni adapté ni retiré par le profil actif ; exception grossesse : désigné par une ligne Grossesse et classé
 * `adapter` par sa propre ligne Grossesse -> proposé dans sa version adaptée. Zones cuisse/aine : jamais une fiche
 * sans ligne pour la zone.
 */
function tryReplacement(origin: Fiche, targetId: string, by: ZoneEntry, ctx: Ctx, originCapped: boolean): Candidate | null {
  const t = resolveTarget(targetId, ctx);
  if (!t || t.fiche.id === origin.id) return null;
  const R = t.fiche;
  if (!ficheAdmissible(R, ctx)) return null;
  if ((by.key === 'cuisse' || by.key === 'aine') && !R.securite.zones[by.key]) return null;
  const restrict: Restrict = {};
  const adaptations: string[] = [];
  let forced = t.variantId;
  for (const e of ctx.zones) {
    const c = caseFor(R, e);
    if (c.action === 'garder') continue;
    if (e.isG && by.isG && c.action === 'adapter') {
      if (c.sansCharge) restrict.sansCharge = true;
      if (c.variante) {
        if (!R.variantes.some((v) => v.id === c.variante)) return null;
        forced = c.variante;
      }
      adaptations.push(...adaptationLabels(c));
      continue;
    }
    return null; // remplaçant lui-même adapté ou retiré : jamais proposé (T13)
  }
  const allowed = allowedVariants(R, ctx, restrict);
  if (!allowed.length) return null;
  const variant = forced ? allowed.find((v) => v.id === forced) : lowestVariant(R, allowed, ctx);
  if (!variant) return null;
  return {
    fiche: R,
    variant,
    origin,
    adapted: true,
    capped: originCapped || isCappedFiche(R, ctx),
    adaptations,
    notes: noteTexts(R, ctx.zones.filter((e) => caseFor(R, e).action !== 'garder')),
    replaces: origin.id,
  };
}

/** Applique les cases d'une fiche admissible : 0 ou 1 candidat (elle-même adaptée, ou un remplaçant). */
export function resolveFiche(X: Fiche, ctx: Ctx): Resolution {
  const key = `r:${X.id}`;
  const cached = ctx.memo.get(key) as Resolution | undefined;
  if (cached) return cached;
  const res = resolveUncached(X, ctx);
  ctx.memo.set(key, res);
  return res;
}

function resolveUncached(X: Fiche, ctx: Ctx): Resolution {
  if (!ficheAdmissible(X, ctx)) return { candidates: [], blockedBy: [] };
  const cases = ctx.zones.map((e) => ({ e, c: caseFor(X, e) }));
  const originCapped = isCappedFiche(X, ctx);
  const byLevel = <T extends { e: ZoneEntry }>(a: T, b: T) => b.e.level - a.e.level;
  const retires = cases.filter((x) => x.c.action === 'retirer');
  const adapters = cases.filter((x) => x.c.action === 'adapter');

  if (retires.length) {
    const blockedBy = [...new Set(retires.map((x) => x.e.key))];
    const plain = retires.filter((x) => !x.c.sansZone);
    if (!plain.length) {
      // Niveau 3 `sans-zone:<id>` seulement : une seule variante reste permise.
      const targets = [...new Set(retires.map((x) => x.c.sansZone!))];
      if (targets.length > 1) return { candidates: [], blockedBy };
      const t = targets[0];
      if (X.variantes.some((v) => v.id === t)) {
        const r = applyAdapters(X, ctx, adapters, { only: new Set([t]) }, originCapped);
        return { candidates: r ? [r] : [], blockedBy: r ? [] : blockedBy };
      }
      const cand = tryReplacement(X, t, retires[0].e, ctx, originCapped);
      return { candidates: cand ? [cand] : [], blockedBy };
    }
    for (const x of [...plain].sort(byLevel)) {
      if (!x.c.remplacant) continue;
      const cand = tryReplacement(X, x.c.remplacant, x.e, ctx, originCapped);
      if (cand) return { candidates: [cand], blockedBy };
    }
    return { candidates: [], blockedBy };
  }
  const r = applyAdapters(X, ctx, adapters, {}, originCapped);
  if (r) return { candidates: [r], blockedBy: [] };
  // Fiche rendue impossible par une case (sans-charge sans variante, variante imposée introuvable) : cause santé.
  const plainAllowed = allowedVariants(X, ctx).length > 0;
  return { candidates: [], blockedBy: plainAllowed ? [...new Set(adapters.map((x) => x.e.key))] : [] };
}

function applyAdapters(
  X: Fiche,
  ctx: Ctx,
  adapters: { e: ZoneEntry; c: SafetyCase }[],
  restrict0: Restrict,
  capped: boolean,
): Candidate | null {
  const restrict: Restrict = { ...restrict0 };
  if (adapters.some((x) => x.c.sansCharge)) restrict.sansCharge = true;
  const allowed = allowedVariants(X, ctx, restrict);
  if (!allowed.length) return null; // `sans-charge` sans variante non chargeable : traité comme retirer
  const adaptations = [...new Set(adapters.flatMap((x) => adaptationLabels(x.c)))];
  const notes = noteTexts(X, adapters.map((x) => x.e));
  const echelonOf = (id: string) => X.variantes.find((v) => v.id === id)?.echelon ?? 1;
  // Deux `adapter: variante:` : niveau le plus élevé, puis échelon le plus bas (D3).
  const targets = adapters
    .filter((x) => x.c.variante)
    .sort((a, b) => b.e.level - a.e.level || echelonOf(a.c.variante!) - echelonOf(b.c.variante!));
  let variant: FicheVariant | null = null;
  if (targets.length) {
    for (const x of targets) {
      const id = x.c.variante!;
      if (X.variantes.some((v) => v.id === id)) {
        const v = allowed.find((a) => a.id === id);
        if (v) {
          variant = v;
          break;
        }
      } else {
        const cand = tryReplacement(X, id, x.e, ctx, capped);
        if (cand) return { ...cand, adaptations: [...new Set([...adaptations, ...cand.adaptations])] };
      }
    }
    if (!variant) {
      // Variante imposée impossible : « variante suivante qui convient » = la plus haute d'échelon <= la cible (plus facile),
      // sinon autre fiche (lecture prudente, docs/generateur-notes-dev.md).
      const same = targets.filter((x) => X.variantes.some((v) => v.id === x.c.variante));
      if (!same.length) return null;
      const maxE = Math.min(...same.map((x) => echelonOf(x.c.variante!)));
      const easier = allowed.filter((v) => v.echelon <= maxE);
      if (!easier.length) return null;
      variant = pickAtHighest(X, easier, ctx);
    }
  } else {
    variant = chooseVariant(X, allowed, ctx, capped);
  }
  return { fiche: X, variant, origin: X, adapted: adapters.length > 0, capped, adaptations, notes, replaces: null };
}

function pickAtHighest(f: Fiche, list: FicheVariant[], ctx: Ctx): FicheVariant {
  const hi = Math.max(...list.map((v) => v.echelon));
  return sortSameEchelon(f, list.filter((v) => v.echelon === hi), ctx)[0];
}

/**
 * Fiche d'échauffement (V-ECH) : admissible, case `garder` ou `adapter` sans remplacement (amplitude, appui, variante
 * de la même fiche) pour toutes les zones actives ; variante d'échelon 1.
 */
export function warmupVariant(f: Fiche, ctx: Ctx, preferId?: string): { variant: FicheVariant; adaptations: string[] } | null {
  if (!ficheAdmissible(f, ctx, { warmup: true })) return null;
  let only: string | null = preferId ?? null;
  const adaptations: string[] = [];
  let sansCharge = false;
  for (const e of ctx.zones) {
    const c = caseFor(f, e);
    if (c.action === 'garder') continue;
    if (c.action === 'retirer') return null;
    if (c.variante) {
      if (!f.variantes.some((v) => v.id === c.variante)) return null;
      if (only && only !== c.variante) return null;
      only = c.variante;
    }
    if (c.sansCharge) sansCharge = true;
    adaptations.push(...adaptationLabels(c));
  }
  const allowed = allowedVariants(f, ctx, { only: only ? new Set([only]) : undefined, sansCharge }).filter((v) => v.echelon === 1);
  if (!allowed.length) return null;
  const v = [...allowed].sort((x, y) => x.tags.length - y.tags.length || f.variantes.indexOf(x) - f.variantes.indexOf(y))[0];
  return { variant: v, adaptations };
}
