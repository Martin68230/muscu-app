// Acceptation en un appui des propositions d'adaptation après séance (knowledge/adaptation-regles.md §6, §7) : une série en plus,
// une version plus dure, 30 s de repos en plus, une décharge. Fonctions PURES : détection des signaux, état des décisions
// (acceptée, « plus tard »), et application à la copie du jour de la séance suivante. Les écritures sont dans progression-store.ts.
// Une acceptation ne contourne JAMAIS les gels : tout est revérifié au moment d'appliquer, sinon la proposition est annulée.
import type { AdaptKind, Level, PlannedExercise, ProgramDay, ProgressionEvent, SetLog, WorkoutSession } from '../data/model';
import { painFrozen } from './adaptation';
import type { ProgressionInput } from './history';
import { ficheSessions, isWorkSet, levelIndex } from './progression';
import { PROGRESSION, type ProgressionConfig } from './progression-config';

type AdaptEvent = Extract<ProgressionEvent, { type: 'adapt_accepte' | 'adapt_plus_tard' | 'adapt_applique' | 'adapt_annule' }>;
type Accepted = Extract<ProgressionEvent, { type: 'adapt_accepte' }>;

const DAY_MS = 24 * 3600 * 1000;
const isAdaptEvent = (e: ProgressionEvent): e is AdaptEvent => e.type.startsWith('adapt_');

// ---------------------------------------------------------------------------------------------
// État des décisions
// ---------------------------------------------------------------------------------------------
/** Dernier changement accepté pour cet exercice et pas encore appliqué ni annulé (au plus un : un seul changement à la fois). */
export function pendingAdapt(events: readonly ProgressionEvent[] | undefined, movementId: string): Accepted | null {
  let pending: Accepted | null = null;
  for (const e of events ?? []) {
    if (!isAdaptEvent(e) || e.movementId !== movementId) continue;
    if (e.type === 'adapt_accepte') pending = e;
    else if (e.type === 'adapt_applique' || e.type === 'adapt_annule') pending = null;
  }
  return pending;
}

/** « Plus tard » : pas de nouvelle proposition de cet exercice tant qu'aucune série de travail n'a été faite depuis. */
export function laterActive(events: readonly ProgressionEvent[] | undefined, movementId: string, sets: readonly SetLog[]): boolean {
  let at: string | null = null;
  for (const e of events ?? []) {
    if (isAdaptEvent(e) && e.movementId === movementId && e.type === 'adapt_plus_tard') at = e.at;
  }
  if (at === null) return false;
  const since = at;
  return !sets.some((s) => isWorkSet(s) && s.movementId === movementId && !!s.completedAt && s.completedAt > since);
}

/** Décharge acceptée il y a moins de N jours sur cet exercice : aucune montée pendant cette semaine (§7.7 [kine]). */
export function deloadWeekActive(events: readonly ProgressionEvent[] | undefined, movementId: string, now: number, cfg: ProgressionConfig = PROGRESSION): boolean {
  return (events ?? []).some(
    (e) => e.type === 'adapt_accepte' && e.kind === 'decharge' && e.movementId === movementId && now - Date.parse(e.at) < cfg.adaptation.deloadWeekDays * DAY_MS,
  );
}

/** §7.7 [kine] : au plus une proposition de décharge par 4 semaines (acceptée ou repoussée, tous exercices). */
export function deloadGapBlocked(events: readonly ProgressionEvent[] | undefined, now: number, cfg: ProgressionConfig = PROGRESSION): boolean {
  return (events ?? []).some(
    (e) => isAdaptEvent(e) && e.kind === 'decharge' && (e.type === 'adapt_accepte' || e.type === 'adapt_plus_tard') && now - Date.parse(e.at) < cfg.adaptation.deloadMinGapDays * DAY_MS,
  );
}

// ---------------------------------------------------------------------------------------------
// Signaux
// ---------------------------------------------------------------------------------------------
/** §3 repos : la dernière série perd plus de 30 % des répétitions de la première (réserve conforme vérifiée par l'appelant). */
export function restSignal(work: readonly SetLog[], cfg: ProgressionConfig = PROGRESSION): boolean {
  if (work.length < 2) return false;
  const first = work[0].reps;
  const last = work[work.length - 1].reps;
  return first !== null && last !== null && first > 0 && last < first * (1 - cfg.adaptation.restDropRatio);
}

/**
 * §7.7 décharge : baisse de performance sur 2 séances de suite (charge plus basse, ou mêmes charges et moins de répétitions) sans que la
 * réserve ait augmenté (« à RIR égal »), sur les 3 dernières séances valables de la même variante. Aucune déclaration de fatigue n'existe
 * dans l'appli : ce déclencheur-là n'est pas codé.
 */
export function deloadSignal(
  movementId: string,
  variantId: string,
  sets: readonly SetLog[],
  sessions: readonly WorkoutSession[] | undefined,
  fallbackPlanned: number,
): boolean {
  const last3 = ficheSessions(movementId, sets, sessions, fallbackPlanned).slice(-3);
  if (last3.length < 3 || !last3.every((f) => f.valid && f.endReason !== 'symptome' && f.work.length > 0 && f.work.every((s) => s.variantId === variantId))) return false;
  const perf = last3.map((f) => {
    const loads = f.work.map((s) => s.loadKg).filter((n): n is number => n !== null);
    const rirs = f.work.map((s) => s.rir).filter((n): n is number => n !== null && n !== undefined);
    return {
      load: loads.length ? Math.max(...loads) : null,
      reps: f.work.reduce((n, s) => n + (s.reps ?? 0), 0),
      rir: rirs.length === f.work.length ? rirs.reduce((a, b) => a + b, 0) / rirs.length : null,
    };
  });
  const drop = (a: (typeof perf)[number], b: (typeof perf)[number]): boolean => {
    if (a.rir === null || b.rir === null || b.rir > a.rir) return false;
    if (a.load !== null && b.load !== null && b.load < a.load) return true;
    return a.load === b.load && b.reps < a.reps;
  };
  return drop(perf[0], perf[1]) && drop(perf[1], perf[2]);
}

/** Charge de décharge : le palier réel le plus proche sous -10 %, jamais plus bas que -20 % ; null s'il n'y en a pas. */
export function deloadLoad(currentKg: number, availableKg: readonly number[], cfg: ProgressionConfig = PROGRESSION): number | null {
  const target = currentKg * (1 - cfg.adaptation.deloadRatio) + 1e-9;
  const floor = currentKg * (1 - 2 * cfg.adaptation.deloadRatio) - 1e-9;
  const best = availableKg.filter((l) => l <= target && l >= floor && l < currentKg).sort((a, b) => b - a)[0];
  return best ?? null;
}

// ---------------------------------------------------------------------------------------------
// Application à la séance suivante
// ---------------------------------------------------------------------------------------------
export type CancelReason = 'gel' | 'reprise' | 'grossesse' | 'manquee' | 'programme' | 'limite';

export interface AdaptChange { kind: AdaptKind; movementId: string }
export interface AdaptCancel extends AdaptChange { reason: CancelReason }

export interface ApplyEnv {
  events: readonly ProgressionEvent[];
  sets: readonly SetLog[];
  sessions: readonly WorkoutSession[];
  pregnant: boolean;
  repriseActive: boolean;
  /** Dernière séance terminée sur un symptôme. */
  frozenBySymptom: boolean;
  adaptOf(ex: PlannedExercise): Pick<ProgressionInput, 'level' | 'zonesOfFiche' | 'zonesOfMovement' | 'variants' | 'ficheMaxSets' | 'missedSinceLast' | 'restMaxSec'>;
  echelonOf(variantId: string): number | undefined;
  /** Paliers réels de charge pour cet exercice autour de la charge donnée. */
  loadsFor(ex: PlannedExercise, currentKg: number | null): number[];
  cfg?: ProgressionConfig;
}

export interface ApplyResult { day: ProgramDay; applied: AdaptChange[]; cancelled: AdaptCancel[] }

const lastLoadOf = (sets: readonly SetLog[], variantId: string): number | null => {
  const mine = sets.filter((s) => isWorkSet(s) && s.variantId === variantId && !s.pain && s.loadKg !== null && !!s.completedAt).sort((a, b) => (a.completedAt! < b.completedAt! ? -1 : 1));
  return mine.length ? mine[mine.length - 1].loadKg : null;
};

/**
 * Applique les changements acceptés à la copie du jour. Toutes les règles de sécurité sont revérifiées ICI : gel douleur (par zone),
 * symptôme, grossesse / post-partum, reprise douce, séance manquée, exercice plafonné ou adapté par une case de sécurité, plafonds de
 * séries / de repos / de classe. Un seul changement par exercice. Ne modifie pas `day`.
 */
export function applyAccepted(day: ProgramDay, env: ApplyEnv): ApplyResult {
  const cfg = env.cfg ?? PROGRESSION;
  const applied: AdaptChange[] = [];
  const cancelled: AdaptCancel[] = [];
  const done = new Set<string>();
  const exercises = day.exercises.map((ex) => {
    const pend = pendingAdapt(env.events, ex.movementId);
    if (!pend || done.has(ex.movementId)) return ex;
    done.add(ex.movementId);
    const a = env.adaptOf(ex);
    const cancel = (reason: CancelReason): PlannedExercise => {
      cancelled.push({ kind: pend.kind, movementId: ex.movementId, reason });
      return ex;
    };
    if (env.repriseActive) return cancel('reprise');
    if (env.pregnant) return cancel('grossesse');
    const zones = a.zonesOfFiche ?? [];
    const frozen = env.frozenBySymptom || painFrozen({ movementId: ex.movementId, zones, sets: env.sets, sessions: env.sessions, zonesOfMovement: a.zonesOfMovement, cfg });
    if (frozen || ex.capped || ex.adaptation != null) return cancel('gel');
    if (a.missedSinceLast) return cancel('manquee');
    const ok = (patch: Partial<PlannedExercise>): PlannedExercise => {
      applied.push({ kind: pend.kind, movementId: ex.movementId });
      return { ...ex, ...patch, adaptApplied: pend.kind };
    };
    switch (pend.kind) {
      case 'serie': {
        if (pend.sets !== ex.sets + 1) return cancel('programme');
        if (ex.sets + 1 > Math.min(cfg.adaptation.roleMaxSets, a.ficheMaxSets ?? Infinity)) return cancel('limite');
        return ok({ sets: ex.sets + 1 });
      }
      case 'variante': {
        const from = env.echelonOf(ex.variantId);
        const level: Level = a.level ?? 'debutant';
        const target = a.variants?.find((v) => v.id === pend.variantId);
        if (from === undefined || pend.variantId === undefined) return cancel('programme');
        if (!target) return cancel('limite');
        if (target.echelon !== from + 1) return cancel('programme');
        if (!target.materielOk || levelIndex(target.niveau) > levelIndex(level)) return cancel('limite');
        return ok({ variantId: target.id });
      }
      case 'repos': {
        const bonus = cfg.adaptation.restBonusSec;
        if (pend.restSec !== ex.restSec + bonus) return cancel('programme');
        if (ex.supersetGroup || a.restMaxSec === undefined || ex.restSec + bonus > a.restMaxSec) return cancel('limite');
        return ok({ restSec: ex.restSec + bonus });
      }
      case 'decharge': {
        const cur = lastLoadOf(env.sets, ex.variantId) ?? ex.startLoadKg;
        const next = cur === null ? null : deloadLoad(cur, env.loadsFor(ex, cur), cfg);
        if (next === null) return cancel('limite');
        return ok({ startLoadKg: next });
      }
    }
  });
  return { day: applied.length ? { ...day, exercises } : day, applied, cancelled };
}
