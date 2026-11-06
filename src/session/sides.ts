// Logique pure du lecteur : exercices d'un seul côté, chronomètre d'un exercice en durée, réserve (RIR) obligatoire.
// Aucune écriture, aucune horloge cachée : l'heure `now` (ms) est toujours fournie (CLAUDE.md règle 5).
import type { PlannedExercise } from '../data/model';
import { remainingMs, startRest, type RestState } from './timer';

type SideShape = Pick<PlannedExercise, 'unit'> & { perSide?: boolean };

/** Une série = les deux côtés (gauche puis droite) : unité « par côté » de la dose fixe, ou exercice d'un seul côté déduit de la variante. */
export const isPerSide = (ex: SideShape): boolean => ex.unit === 'reps_par_cote' || ex.perSide === true;

/** « 8 répétitions de chaque côté », « 8-10 répétitions de chaque côté », « 30 s de chaque côté ». */
export function perSideTarget(ex: Pick<PlannedExercise, 'unit' | 'repsMin' | 'repsMax' | 'holdSec'>): string {
  if (ex.unit === 'sec') return `${ex.holdSec ?? ex.repsMin} s de chaque côté`;
  const range = ex.repsMin === ex.repsMax ? `${ex.repsMin}` : `${ex.repsMin}-${ex.repsMax}`;
  return `${range} répétitions de chaque côté`;
}

/** Phrase d'explication de la carte de série. */
export const PER_SIDE_RULE = 'Une série = les deux côtés, gauche puis droite.';

/** Réserve demandée à CHAQUE série de travail (répétitions ou durée), sauf échauffement, cardio et séries de sauts. */
export function needsRir(ex: Pick<PlannedExercise, 'role'> & { jump?: unknown }, isWarmup: boolean): boolean {
  return !isWarmup && ex.role !== 'cardio' && !ex.jump;
}

/** Exercice tenu dans le temps (planche, gainage, équilibre), chronométré par le lecteur ; le cardio garde « Série faite » en fin d'effort. */
export const isHoldExercise = (ex: Pick<PlannedExercise, 'unit' | 'role'>): boolean => ex.unit === 'sec' && ex.role !== 'cardio';

/** Libellés de la réserve d'un exercice tenu : 0 à 4 -> « 0 s » à « 20 s ou plus » de plus. */
export const HOLD_RIR_LABELS: readonly string[] = ['0 s', '5 s', '10 s', '15 s', '20 s +'];

// ----- Chronomètre d'une position tenue : décompte sur l'heure réelle (même modèle que le repos) -----
export type HoldState = RestState;

export function startHold(now: number, sec: number): HoldState | null {
  return startRest(now, sec, 'repos');
}

export const holdRemainingMs = (h: HoldState | null, now: number): number => remainingMs(h, now);
export const holdOver = (h: HoldState | null, now: number): boolean => h !== null && remainingMs(h, now) === 0;

/** Secondes réellement tenues (jamais plus que la durée prévue) : durée enregistrée dans la série. */
export function heldSec(h: HoldState, now: number): number {
  const startedAt = h.endsAt - h.totalMs;
  return Math.max(0, Math.min(Math.round((now - startedAt) / 1000), Math.round(h.totalMs / 1000)));
}

// ----- Reprise du chrono après un rechargement de la page (confort local : stockage du navigateur) -----
const HOLD_KEY = 'muscu.chrono';
interface StoredHold {
  sessionId: string;
  step: number;
  endsAt: number;
  totalMs: number;
}
type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
const defaultStore = (): Store | null => {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
};

export function saveHold(sessionId: string, step: number, h: HoldState, store: Store | null = defaultStore()): void {
  try {
    store?.setItem(HOLD_KEY, JSON.stringify({ sessionId, step, endsAt: h.endsAt, totalMs: h.totalMs } satisfies StoredHold));
  } catch {
    /* stockage indisponible : le chrono repartira de zéro après un rechargement */
  }
}

export function clearHold(store: Store | null = defaultStore()): void {
  try {
    store?.removeItem(HOLD_KEY);
  } catch {
    /* ignoré */
  }
}

/** Chrono en cours retrouvé pour CETTE série (même séance, même étape), sinon null. */
export function loadHold(sessionId: string, step: number, store: Store | null = defaultStore()): HoldState | null {
  try {
    const raw = store?.getItem(HOLD_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Partial<StoredHold>;
    if (s.sessionId !== sessionId || s.step !== step || typeof s.endsAt !== 'number' || typeof s.totalMs !== 'number' || !(s.totalMs > 0)) return null;
    return { endsAt: s.endsAt, totalMs: s.totalMs, kind: 'repos' };
  } catch {
    return null;
  }
}
