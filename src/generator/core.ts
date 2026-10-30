// D26 : core (tronc) — familles, filtres de sécurité par famille, séance « à charge lourde ».
// Règles : knowledge/core-et-supersets.md (CORE-FAM-1, CORE-SEC-1 à 4, CORE-ORD-4) et knowledge/famille-core-inventaire.md.
// Aucune valeur chiffrée ici : tout est dans config.ts (avec statut). Les filtres ne font que retirer ou plafonner (V-PRIO).
import {
  CORE_DOS, CORE_FAMILY_FROM_SCHEMA, CORE_HEAVY_EXCLUDED_IDS, CORE_NOT_CORE_IDS, CORE_NOT_DEFAULT_IDS, CORE_OUT_OF_FLOOR_IDS,
  CORE_SAFE_FAMILIES, CORE_TARGET_SESSIONS, CORE_WHEEL_IDS, HEAVY_ROW_IDS, HEAVY_TAGS_B1, HEAVY_TAGS_PILLAR, TRONC_SCHEMAS,
  type CoreFamily, type CoreGoal,
} from './config';
import type { Ctx } from './context';
import type { Fiche } from './types';

/** CORE-FAM-1 : famille de core d'une fiche (attribut `famille_core`, sinon schéma), ou null (jamais comptée comme core). */
export function coreFamilyOf(f: Pick<Fiche, 'id' | 'schema' | 'familleCore'>): CoreFamily | null {
  if (CORE_NOT_CORE_IDS.includes(f.id)) return null;
  if (f.familleCore) return f.familleCore as CoreFamily;
  return CORE_FAMILY_FROM_SCHEMA[f.schema] ?? null;
}

/** Compte dans le plancher (CORE-FREQ-1/2) : famille de core, schéma du tronc (GG5), hors exclusions par id de l'inventaire. */
export function countsInCoreFloor(f: Pick<Fiche, 'id' | 'schema' | 'familleCore'>): boolean {
  return coreFamilyOf(f) !== null && TRONC_SCHEMAS.includes(f.schema) && !CORE_OUT_OF_FLOOR_IDS.includes(f.id);
}

export interface CoreRule {
  /** Fiche retirée par une règle de famille (débutant, grossesse, table dos, id non proposé par défaut). */
  blocked: boolean;
  /** Zones (ou `grossesse`) citées par V-MSG-ZONE quand la fiche est retirée. */
  blockedBy: string[];
  sansCharge: boolean;
  capped: boolean;
  maxHoldSec: number | null;
  maxRepsPerSide: number | null;
}

/**
 * Règles statiques de sécurité par famille de core (ne dépendent que du profil). La plus restrictive de cette règle et des
 * cases de la fiche s'applique toujours : cette fonction ne rend jamais permis ce qu'une case retire (CORE-SEC-3).
 * null : la fiche n'est pas une fiche de core.
 */
export function coreRule(f: Fiche, ctx: Pick<Ctx, 'level' | 'pregnant' | 'zones'>): CoreRule | null {
  const fam = coreFamilyOf(f);
  if (!fam) return null;
  const r: CoreRule = { blocked: false, blockedBy: [], sansCharge: false, capped: false, maxHoldSec: null, maxRepsPerSide: null };
  const block = (why?: string) => {
    r.blocked = true;
    if (why && !r.blockedBy.includes(why)) r.blockedBy.push(why);
  };
  const minCap = (a: number | null, b: number | undefined) => (b === undefined ? a : a === null ? b : Math.min(a, b));
  // §11 point 2 : rotation russe chargée, lancer rotatif rapide : non proposés par défaut.
  if (CORE_NOT_DEFAULT_IDS.includes(f.id)) block();
  // CORE-SEC-1 : débutant : CF1 et CF2 seulement, ni roue ni roulé ; CORE-DOSE-4 : aucune charge sur le core.
  if (ctx.level === 'debutant') {
    if (!CORE_SAFE_FAMILIES.includes(fam) || CORE_WHEEL_IDS.includes(f.id)) block();
    r.sansCharge = true;
  }
  // CORE-SEC-2 : grossesse ou post-partum : CF1/CF2 avec une ligne Grossesse explicite (sa case garder/adapter est appliquée
  // par safety.ts) ; jamais CF3, CF4, CF5, ni roue abdominale ; une fiche ne rétablit jamais une famille retirée.
  if (ctx.pregnant && (!CORE_SAFE_FAMILIES.includes(fam) || CORE_WHEEL_IDS.includes(f.id) || !f.securite?.grossesse)) block('grossesse');
  // CORE-SEC-3 : table dos par famille et par niveau.
  const dos = ctx.zones.find((z) => !z.isG && z.key === 'dos');
  if (dos) {
    const rule = CORE_DOS[Math.min(3, Math.max(1, dos.level)) as 1 | 2 | 3][fam];
    if (rule.retire || rule.excludeIds?.includes(f.id)) block('dos');
    if (rule.sansCharge) r.sansCharge = true;
    if (rule.capped) r.capped = true;
    r.maxHoldSec = minCap(r.maxHoldSec, rule.maxHoldSec);
    r.maxRepsPerSide = minCap(r.maxRepsPerSide, rule.maxRepsPerSide);
  }
  return r;
}

/** CORE-ORD-4 : exercice « lourd » (a), (b) ou (c). */
export function isHeavyExercise(e: { slot: string; schema: string; ficheId: string; tags: readonly string[] }): boolean {
  const has = (list: readonly string[]) => e.tags.some((t) => list.includes(t));
  if ((e.schema === 'squat' || e.schema === 'fente' || e.schema === 'charniere') && has(HEAVY_TAGS_B1)) return true; // (a)
  if ((e.slot === 'jambes_genou' || e.slot === 'charniere') && has(HEAVY_TAGS_PILLAR)) return true; // (b)
  if (HEAVY_ROW_IDS.includes(e.ficheId) || (e.ficheId.startsWith('rowing') && has(HEAVY_TAGS_B1))) return true; // (c)
  return false;
}

/** Fiche permise dans l'emplacement `tronc` pour une famille donnée, dans une séance lourde ou non (CORE-ORD-4). */
export function troncFicheFits(f: Fiche, fam: CoreFamily, heavy: boolean): boolean {
  if (!TRONC_SCHEMAS.includes(f.schema) || coreFamilyOf(f) !== fam) return false;
  if (heavy && (!CORE_SAFE_FAMILIES.includes(fam) || CORE_HEAVY_EXCLUDED_IDS.includes(f.id))) return false;
  return true;
}

/** Colonne de la table §2.2 : cardio principal -> `cardio`, sinon la famille de l'objectif. */
export function coreGoalOf(goalFamily: 'muscle' | 'force' | 'sante', cardioPrincipal: boolean): CoreGoal {
  return cardioPrincipal ? 'cardio' : goalFamily;
}

/** Cible de séances avec core (§2.2), bornée au nombre de séances de la semaine. */
export function coreTargetSessions(nDays: number, goal: CoreGoal): number {
  const row = CORE_TARGET_SESSIONS[nDays] ?? CORE_TARGET_SESSIONS[3];
  return Math.min(nDays, row[goal]);
}
