// Adaptation automatique après chaque séance (knowledge/adaptation-regles.md, coach + kine 05/11/2026, sous réserve du relecteur).
// Fonctions PURES utilisées par proposeProgression (history.ts), computeProposals et echelonInfoFor (progression-store.ts).
// Toutes les valeurs chiffrées viennent de progression-config.ts (`adaptation`, NON SOURCÉ / PROVISOIRE). Rien n'est appliqué ici :
// ces fonctions ne font que BLOQUER une montée ou décider quelle proposition afficher.
import type { SetLog, WorkoutSession } from '../data/model';
import { D4_FICHES, D4_NEIGHBORS, D4_NEVER, D4_OPEN_SESSIONS, D_CLASS } from '../generator/config';
import { ficheSessions, isWorkSet, type FicheSession } from './progression';
import { PROGRESSION, type ProgressionConfig } from './progression-config';

const msOf = (iso: string | null | undefined): number => (iso ? Date.parse(iso) : NaN);
const WEEK_MS = 7 * 24 * 3600 * 1000;

// ---------------------------------------------------------------------------------------------
// §5 [kine] Gel douleur par zone : toutes les fiches de la zone, levé par N séances qui sollicitent réellement la zone sans gêne
// ---------------------------------------------------------------------------------------------
export interface PainFreezeInput {
  movementId: string;
  /** Zones portées par la fiche de l'exercice (lignes de sa case de sécurité). */
  zones: readonly string[] | undefined;
  sets: readonly SetLog[];
  sessions?: readonly WorkoutSession[];
  /** Zones portées par n'importe quelle fiche (pour savoir quelles séances ont sollicité la zone). Absent : seule la fiche elle-même compte. */
  zonesOfMovement?: (movementId: string) => readonly string[];
  excludeSessionId?: string | null;
  cfg?: ProgressionConfig;
}

interface SessionTouch {
  at: number;
  /** Séance valable pour lever un gel : terminée, sans arrêt sur un symptôme. */
  clean: boolean;
  touched: Set<string>;
  pain: Set<string>;
}

const mvKey = (id: string): string => `fiche:${id}`;

/**
 * true = aucune montée (charge, répétitions, série, échelon, durée, version plus dure) sur cet exercice. Une douleur déclarée sur une
 * zone gèle toutes les fiches qui portent cette zone (et la fiche elle-même), jusqu'à N séances valables qui sollicitent réellement la
 * zone (ou la fiche) sans gêne ; une absence ne lève rien. Zone « je ne sais pas » : toutes les zones de la fiche où la douleur a eu lieu (doute).
 * Ne bloque JAMAIS une baisse (l'appelant teste la baisse avant).
 */
export function painFrozen(i: PainFreezeInput): boolean {
  const cfg = i.cfg ?? PROGRESSION;
  const own = i.zones ?? [];
  const zonesOf = (m: string): readonly string[] => i.zonesOfMovement?.(m) ?? (m === i.movementId ? own : []);
  const rows = new Map((i.sessions ?? []).filter((s) => !s.deletedAt).map((s) => [s.id, s] as const));
  const by = new Map<string, SetLog[]>();
  for (const s of i.sets) {
    if (!isWorkSet(s) || s.sessionId === i.excludeSessionId) continue;
    by.set(s.sessionId, [...(by.get(s.sessionId) ?? []), s]);
  }
  const touches: SessionTouch[] = [];
  for (const [id, list] of by) {
    const row = rows.get(id);
    if (row?.status === 'en_cours') continue;
    const touched = new Set<string>();
    const pain = new Set<string>();
    for (const s of list) {
      touched.add(mvKey(s.movementId));
      zonesOf(s.movementId).forEach((z) => touched.add(z));
      if (!s.pain) continue;
      pain.add(mvKey(s.movementId));
      const z = s.painZone;
      if (z && z !== 'inconnu') pain.add(z);
      else zonesOf(s.movementId).forEach((x) => pain.add(x));
    }
    const at = [msOf(row?.startedAt), Math.min(...list.map((s) => msOf(s.completedAt)))].find((n) => Number.isFinite(n)) ?? 0;
    touches.push({ at, clean: (row?.status ?? 'faite') === 'faite' && row?.endReason !== 'symptome', touched, pain });
  }
  touches.sort((a, b) => a.at - b.at);
  const keys = [mvKey(i.movementId), ...own];
  return keys.some((k) => {
    let last = -1;
    touches.forEach((t, n) => {
      if (t.pain.has(k)) last = n;
    });
    if (last < 0) return false;
    const clean = touches.slice(last + 1).filter((t) => t.clean && t.touched.has(k) && !t.pain.has(k)).length;
    return clean < cfg.adaptation.painCleanSessions;
  });
}

// ---------------------------------------------------------------------------------------------
// Séances au haut de la fourchette ; débutant après un échec
// ---------------------------------------------------------------------------------------------
/**
 * Séances valables de suite (de la plus récente) où toutes les séries, des deux côtés (le côté faible décide), sont au haut de la
 * fourchette à la réserve visée. Cible de la série si elle est enregistrée, sinon celle de l'exercice actuel (`fallback`).
 */
export function topRun(
  movementId: string,
  sets: readonly SetLog[],
  sessions: readonly WorkoutSession[] | undefined,
  fallbackPlanned: number,
  fallback: { repsMax: number; rirTarget: number },
): number {
  const newest = ficheSessions(movementId, sets, sessions, fallbackPlanned).reverse();
  const top = (s: SetLog) => s.reps !== null && s.reps >= (s.targetRepsMax ?? fallback.repsMax) && s.rir !== null && s.rir !== undefined && s.rir >= (s.targetRir ?? fallback.rirTarget);
  let n = 0;
  for (const f of newest) {
    if (!(f.valid && f.endReason !== 'symptome' && f.work.every(top))) break;
    n++;
  }
  return n;
}

/** RIR 0 ou série sous le bas de sa fourchette (échec), hors série douloureuse (gérée par le gel douleur). */
const failed = (f: FicheSession): boolean =>
  f.work.some((s) => !s.pain && ((s.rir !== null && s.rir !== undefined && s.rir <= 0) || (s.reps !== null && s.targetRepsMin != null && s.reps < s.targetRepsMin)));

/**
 * C1 [kine] : débutant, RIR 0 ou échec (série sous le bas de la fourchette) : aucune montée avant N séances valables au bon RIR depuis.
 * true = montée bloquée.
 */
export function beginnerFailureLock(
  movementId: string,
  sets: readonly SetLog[],
  sessions: readonly WorkoutSession[] | undefined,
  fallbackPlanned: number,
  rirTarget: number,
  cfg: ProgressionConfig = PROGRESSION,
): boolean {
  const infos = ficheSessions(movementId, sets, sessions, fallbackPlanned);
  let last = -1;
  infos.forEach((f, n) => {
    if (failed(f)) last = n;
  });
  if (last < 0) return false;
  const good = infos.slice(last + 1).filter((f) => f.valid && f.work.every((s) => s.rir !== null && s.rir !== undefined && s.rir >= (s.targetRir ?? rirTarget))).length;
  return good < cfg.adaptation.beginnerCleanSessionsAfterFailure;
}

// ---------------------------------------------------------------------------------------------
// C6 : plafond de saut de charge ; C7 : +1 série
// ---------------------------------------------------------------------------------------------
/** C6 [kine] : le palier suivant (un seul cran) n'est proposé que s'il ne dépasse pas +20 % de la charge actuelle. */
export function jumpAllowed(currentKg: number, nextKg: number, cfg: ProgressionConfig = PROGRESSION): boolean {
  return currentKg > 0 && nextKg > currentKg && nextKg <= currentKg * (1 + cfg.adaptation.maxLoadJumpRatio) + 1e-9;
}

export interface SetRaiseInput {
  /** Séries prévues actuellement. */
  sets: number;
  /** Plafond de la fiche (DOSE_LIMITS.maxSets) et de la classe, si connus. */
  ficheMaxSets?: number;
  beginner: boolean;
  /** Fiche « technique » ou classe D3 / D4 : jamais 3 séries pour le débutant. */
  technicalOrHardClass: boolean;
  /** Séances valables de suite au haut de la fourchette. */
  topRun: number;
  /** Débutant : ancienneté (ms depuis la première séance faite) et nombre de séances faites. */
  followedMs: number | null;
  doneSessions: number;
  cfg?: ProgressionConfig;
}
/** C7 : nouveau nombre de séries proposé (+1), ou null. Jamais appliqué seul : c'est l'appelant qui l'affiche comme proposition. */
export function setRaise(i: SetRaiseInput): number | null {
  const cfg = i.cfg ?? PROGRESSION;
  const cap = Math.min(cfg.adaptation.roleMaxSets, i.ficheMaxSets ?? Infinity);
  if (i.sets + 1 > cap || i.topRun < cfg.adaptation.topSessionsForSet) return null;
  if (i.beginner) {
    if (i.technicalOrHardClass) return null;
    if (i.followedMs === null || i.followedMs < cfg.adaptation.beginnerSetMinWeeks * WEEK_MS) return null;
    if (i.doneSessions < cfg.adaptation.beginnerSetMinSessions) return null;
  }
  return i.sets + 1;
}

// ---------------------------------------------------------------------------------------------
// [kine 05/11/2026] Garde-fou D4 : « 2 séances au haut du D3 voisin »
// ---------------------------------------------------------------------------------------------
interface D4Fiche {
  id: string;
  variantes: readonly { id: string; echelon: number }[];
  securite: { zones: Record<string, unknown> };
}
export interface D4OpenInput {
  fiches: readonly D4Fiche[];
  sets: readonly SetLog[];
  sessions?: readonly WorkoutSession[];
  /** Avancé, hors grossesse / post-partum et reprise douce : sinon aucune D4 (le générateur le vérifie aussi). */
  allowed: boolean;
}

/** Séances valables consécutives (la plus récente d'abord) de ces variantes, toutes les séries au haut de leur fourchette à `minRir` ou plus. */
function topRunOf(movementId: string, variantIds: readonly string[], i: D4OpenInput, minRir: number): number {
  const mine = i.sets.filter((s) => variantIds.includes(s.variantId));
  const newest = ficheSessions(movementId, mine, i.sessions, 1).reverse();
  const top = (s: SetLog) => s.reps !== null && s.targetRepsMax != null && s.reps >= s.targetRepsMax && s.rir != null && s.rir >= Math.max(minRir, s.targetRir ?? 0);
  let n = 0;
  for (const f of newest) {
    // Séance où la variante comptée n'a pas été faite (autre variante de la fiche) : la suite est rompue.
    if (!(f.valid && f.endReason !== 'symptome' && f.work.length > 0 && f.work.every(top))) break;
    n++;
  }
  return n;
}

/** Ids des variantes D4 ouvertes par l'historique (entrée `options.d4Open` du générateur). */
export function d4OpenVariants(i: D4OpenInput): string[] {
  if (!i.allowed) return [];
  const byId = new Map(i.fiches.map((f) => [f.id, f] as const));
  const zonesOf = (m: string): readonly string[] => Object.keys(byId.get(m)?.securite.zones ?? {});
  const out: string[] = [];
  for (const [d4Id, nb] of Object.entries(D4_NEIGHBORS)) {
    const d4 = byId.get(d4Id);
    const neighbor = byId.get(nb.fiche);
    if (!d4 || !neighbor || D4_NEVER.includes(d4Id)) continue;
    // Le droit se referme dès qu'une douleur ou un gel touche la zone (D4, fiche voisine ou zones sensibles de la classe).
    const zones = [...new Set([...(D4_FICHES[d4Id] ?? []), ...zonesOf(d4Id), ...zonesOf(nb.fiche)])];
    const frozen = [d4Id, nb.fiche].some((m) => painFrozen({ movementId: m, zones, sets: i.sets, sessions: i.sessions, zonesOfMovement: zonesOf }));
    if (frozen) continue;
    const topEchelon = Math.max(...neighbor.variantes.map((v) => v.echelon));
    const counted = nb.variants ?? neighbor.variantes.filter((v) => v.echelon === topEchelon).map((v) => v.id);
    if (topRunOf(nb.fiche, counted, i, D_CLASS[3].minRir) < D4_OPEN_SESSIONS) continue;
    // Échelons de la fiche D4 : le plus bas s'ouvre ; chacun des suivants après 2 séances au haut de celui d'en dessous.
    const echelons = [...new Set(d4.variantes.map((v) => v.echelon))].sort((a, b) => a - b);
    for (const [k, e] of echelons.entries()) {
      if (k > 0) {
        const below = d4.variantes.filter((v) => v.echelon === echelons[k - 1]).map((v) => v.id);
        if (topRunOf(d4Id, below, i, D_CLASS[4].minRir) < D4_OPEN_SESSIONS) break;
      }
      out.push(...d4.variantes.filter((v) => v.echelon === e).map((v) => v.id));
    }
  }
  return out;
}

/** Séances faites (terminées, non supprimées, sans arrêt sur un symptôme). */
export const doneSessionsCount = (sessions: readonly WorkoutSession[] | undefined): number =>
  (sessions ?? []).filter((s) => !s.deletedAt && s.status === 'faite' && s.endReason !== 'symptome').length;
