// Machine à états de la séance (F5). Fonctions PURES : (jour de programme, état, action, heure) -> nouvel état.
// Aucune écriture, aucun accès réseau, aucune horloge cachée : l'heure `now` (ms) est toujours fournie. La
// persistance (IndexedDB) est dans store.ts ; le minuteur dans timer.ts.
//
// Déroulé : échauffement -> exercices (séries, supersets) -> fin.
// Les « étapes » (Step) sont dérivées du jour de programme, sans état : le curseur n'est qu'un index dans cette liste,
// donc la reprise après fermeture ne demande de sauvegarder qu'un nombre.
import type { InjuryZone, PlannedExercise, ProgramDay, SessionCursor } from '../data/model';
import { nextCalibrationStep, type CalibrationStep } from '../generator/calibration';
import { TIME, WARMUP } from '../generator/config';
import { echelonCalibrationStep } from './progression';
import { adjustRest as adjustRestState, REST_ADJUST_STEP_SEC, remainingMs, startRest, type RestState } from './timer';

export class SessionError extends Error {}

export type Phase = 'echauffement' | 'exercices' | 'fin';
export type Outcome = 'en_cours' | 'terminee' | 'abandon' | 'symptome';

export interface Step {
  kind: 'warmup' | 'work';
  /** Index dans `day.exercises`. */
  exercise: number;
  /** Rang de la série (de travail, ou d'échauffement selon `kind`), à partir de 0. */
  set: number;
  /** Face du superset : 0 = A, 1 = B (0 si l'exercice est seul). */
  face: number;
  side: 'gauche' | 'droite' | null;
  /** Repos après cette étape (0 = aucun). */
  restAfterSec: number;
  restKind: 'repos' | 'transition';
  /** Repos de la paire, utilisé à la place de la transition quand le partenaire est sauté. */
  pairRestSec: number;
  block: number;
}

/** Dérive les étapes d'un jour. Superset (même `supersetGroup`) : A1, B1, repos de la paire, A2, B2, … (generateur-v1.md §4.2). */
export function buildSteps(exercises: readonly PlannedExercise[]): Step[] {
  const steps: Step[] = [];
  const done = new Set<number>();
  let block = 0;
  exercises.forEach((first, i) => {
    if (done.has(i)) return;
    const members = [i];
    if (first.supersetGroup) {
      exercises.forEach((o, j) => {
        if (j > i && !done.has(j) && o.supersetGroup === first.supersetGroup) members.push(j);
      });
    }
    members.forEach((m) => done.add(m));
    // Échauffement de chaque exercice du bloc (série d'échauffement : jamais comptée dans le travail).
    members.forEach((m, face) => {
      exercises[m].warmupSets.forEach((_w, k) =>
        steps.push({ kind: 'warmup', exercise: m, set: k, face, side: null, restAfterSec: WARMUP.e3RestSec, restKind: 'repos', pairRestSec: WARMUP.e3RestSec, block }),
      );
    });
    const rounds = Math.max(...members.map((m) => exercises[m].sets));
    for (let r = 0; r < rounds; r++) {
      const active = members.filter((m) => r < exercises[m].sets);
      const pairRest = Math.max(...active.map((m) => exercises[m].restSec));
      active.forEach((m, a) => {
        const sides: ('gauche' | 'droite' | null)[] = exercises[m].unit === 'reps_par_cote' ? ['gauche', 'droite'] : [null];
        sides.forEach((side, s) => {
          const lastSide = s === sides.length - 1;
          const lastInRound = a === active.length - 1;
          let restAfterSec = 0;
          let restKind: Step['restKind'] = 'repos';
          if (!lastSide) restAfterSec = 0; // changement de côté : l'autre côté sert de repos
          else if (!lastInRound) {
            restAfterSec = TIME.supersetTransitionSec;
            restKind = 'transition';
          } else restAfterSec = pairRest;
          steps.push({ kind: 'work', exercise: m, set: r, face: members.indexOf(m), side, restAfterSec, restKind, pairRestSec: pairRest, block });
        });
      });
    }
    block++;
  });
  return steps;
}

/**
 * Exercice sans charge à échelons (poids du corps, élastique) : ce que le moteur doit savoir pour l'étalonnage (progression-et-bilan-v1.md §2).
 * `null` pour un exercice à charge. Construit par l'interface depuis les fiches, l'historique et les décisions de la personne.
 */
export interface EchelonInfo {
  /** Échelon du programme pour cet exercice. */
  echelon: number;
  /** Séance d'étalonnage de la fiche : aucune série faite à ce couple (fiche, échelon), ou séance d'arrivée après une montée ou une descente acceptée. */
  calibration: boolean;
  /** Plafond d'étalonnage (V-ETAL-E (e), E7) : jamais de montée au-dessus. `null` = pas d'autre plafond que `up`. */
  ceiling: number | null;
  /** Aucune montée possible : fiche `capped`, grossesse, symptôme récent, retour de gêne (R7), exercice adapté. */
  noRaise: boolean;
  /** Échelon `e+1` permis (niveau, matériel) et sa variante, ou null. */
  up: { echelon: number; variantId: string } | null;
  /** Échelon `e-1` et sa variante, ou null. */
  down: { echelon: number; variantId: string } | null;
}

/** Contexte d'exécution (jamais enregistré) : matériel, grossesse, étalonnage. Construit par store.ts depuis le profil et l'historique. */
export interface EngineContext {
  /** Grossesse / post-partum : jamais de hausse (V-PRIO). */
  pregnant: boolean;
  /** Première fois pour cette variante : séance d'étalonnage (V-ETAL §5.1). */
  isCalibration(ex: PlannedExercise): boolean;
  /** Charges possibles autour de `currentKg` (paliers réels des haltères du profil, sinon pas de 1 kg). */
  availableLoadsKg(ex: PlannedExercise, currentKg: number | null): number[];
  availableEchelons?(ex: PlannedExercise): number[];
  echelonOf?(ex: PlannedExercise): number | undefined;
  /** F6 : étalonnage des échelons pour un exercice sans charge ; null pour un exercice à charge. */
  echelonInfo?(ex: PlannedExercise): EchelonInfo | null;
}
export const NEUTRAL_CONTEXT: EngineContext = {
  pregnant: false,
  isCalibration: () => false,
  availableLoadsKg: (_ex, cur) => (cur === null ? [] : [Math.max(0, cur - 1), cur, cur + 1]),
};

export interface EngineState {
  phase: Phase;
  /** Index de l'étape courante dans `buildSteps(day.exercises)` ; `steps.length` = terminé. */
  step: number;
  skipped: number[];
  painExercises: number[];
  rest: RestState | null;
  startedAt: number;
  endedAt: number | null;
  outcome: Outcome;
  /** Charge en cours par exercice (préremplit la série suivante). */
  loads: Record<number, number | null>;
  workSetsDone: number;
  /** F6 : échelon changé pendant la séance par exercice (une seule fois, à la première série de travail). */
  echelonSwitches: Record<number, { echelon: number; variantId: string; from: number }>;
  /** F6 : exercices dont la première série de travail a déjà décidé de l'échelon. */
  calibDecided: number[];
}

export interface SetInput {
  reps?: number | null;
  loadKg?: number | null;
  /** « Combien de répétitions te restait-il ? » 0 à 4 (« 4+ » vaut 4). */
  rir?: number | null;
  side?: 'gauche' | 'droite' | null;
  holdSec?: number | null;
  pain?: boolean;
  painZone?: InjuryZone | 'inconnu' | null;
  comment?: string;
}

export interface SetEntry {
  exercise: number;
  step: number;
  set: number;
  face: number;
  isWarmup: boolean;
  side: 'gauche' | 'droite' | null;
  reps: number | null;
  loadKg: number | null;
  rir: number | null;
  holdSec: number | null;
  pain: boolean;
  painZone: InjuryZone | 'inconnu' | null;
  comment: string;
  completedAt: number;
  targetRepsMin: number | null;
  targetRepsMax: number | null;
  targetRir: number | null;
  isCalibration: boolean;
  capped: boolean;
  echelon: number | null;
  /** Variante réellement faite (change si l'échelon change pendant la séance). */
  variantId: string;
}

export interface SetResult {
  state: EngineState;
  entry: SetEntry;
  /** Étalonnage : charge (ou échelon) proposée pour la série suivante ; null hors étalonnage. */
  suggestion: CalibrationStep | null;
  /** F6 : l'échelon change pour les séries restantes de l'exercice (étalonnage d'un exercice sans charge). */
  echelonChange: { exercise: number; from: number; to: number; variantId: string } | null;
}

// ----- Aides -----
function nextStepIndex(steps: readonly Step[], from: number, skipped: readonly number[]): number {
  let i = from;
  while (i < steps.length && skipped.includes(steps[i].exercise)) i++;
  return i;
}
const clone = (s: EngineState): EngineState => ({
  ...s,
  skipped: [...s.skipped],
  painExercises: [...s.painExercises],
  loads: { ...s.loads },
  echelonSwitches: { ...s.echelonSwitches },
  calibDecided: [...s.calibDecided],
});

function hasWarmup(day: ProgramDay): boolean {
  const w = day.warmup;
  return !!w && (!!w.general || w.mobility.length > 0);
}

function num(v: unknown, label: string, min: number, max: number, integer = false): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v !== 'number' || !Number.isFinite(v) || v < min || v > max || (integer && !Number.isInteger(v))) {
    throw new SessionError(`${label} invalide`);
  }
  return v;
}

/** Charge d'une série d'échauffement : pourcentage de la charge de travail (arrondi vers le bas), ou échelon -> poids du corps. */
export function warmupLoadKg(workKg: number | null, percent: number | null, allowed: readonly number[] = []): number | null {
  if (workKg === null || percent === null) return null;
  const raw = (workKg * percent) / 100;
  const below = [...allowed].filter((l) => l <= raw).sort((a, b) => b - a)[0];
  return below ?? Math.floor(raw * 2) / 2;
}

// ----- Actions -----
export function startSession(day: ProgramDay, now: number): EngineState {
  const steps = buildSteps(day.exercises);
  const loads: Record<number, number | null> = {};
  day.exercises.forEach((ex, i) => (loads[i] = ex.startLoadKg));
  return {
    phase: hasWarmup(day) ? 'echauffement' : steps.length ? 'exercices' : 'fin',
    step: 0,
    skipped: [],
    painExercises: [],
    rest: null,
    startedAt: now,
    endedAt: null,
    outcome: 'en_cours',
    loads,
    workSetsDone: 0,
    echelonSwitches: {},
    calibDecided: [],
  };
}

function assertRunning(state: EngineState): void {
  if (state.outcome !== 'en_cours') throw new SessionError('La séance est terminée.');
}

/** Fin de l'échauffement (ou « passer l'échauffement ») : passe aux exercices. */
export function endWarmup(day: ProgramDay, state: EngineState): EngineState {
  assertRunning(state);
  if (state.phase !== 'echauffement') return state;
  const s = clone(state);
  s.phase = buildSteps(day.exercises).length ? 'exercices' : 'fin';
  return s;
}

/**
 * Série faite. `pain: true` équivaut à `markPain` : l'exercice s'arrête, les séries restantes sont annulées, aucune
 * hausse, pas de repos (generateur-v1.md §6.8 point 2).
 */
export function completeSet(day: ProgramDay, state: EngineState, input: SetInput, ctx: EngineContext, now: number): SetResult {
  assertRunning(state);
  if (state.phase !== 'exercices') throw new SessionError("Termine d'abord l'échauffement.");
  const steps = buildSteps(day.exercises);
  const cur = nextStepIndex(steps, state.step, state.skipped);
  if (cur >= steps.length) throw new SessionError('Plus de série à faire.');
  const st = steps[cur];
  const ex = day.exercises[st.exercise];
  const pain = input.pain === true;

  const reps = num(input.reps, 'Répétitions', 0, 500, true);
  const loadKg = num(input.loadKg, 'Charge', 0, 1000);
  const rir = num(input.rir, 'Réserve', 0, 4, true);
  const holdSec = num(input.holdSec, 'Durée de maintien', 0, 3600);
  if (!pain && st.kind === 'work') {
    if (ex.unit === 'sec' ? (holdSec ?? ex.holdSec) === null : reps === null) throw new SessionError('Saisis les répétitions faites.');
  }

  const info = ctx.echelonInfo?.(ex) ?? null;
  const sw = state.echelonSwitches[st.exercise];
  const calibrating = st.kind === 'work' && (info ? info.calibration : ctx.isCalibration(ex));
  const capped = ex.capped || ctx.pregnant;
  const curEchelon = sw ? sw.echelon : info ? info.echelon : null;
  const entry: SetEntry = {
    exercise: st.exercise,
    step: cur,
    set: st.set,
    face: st.face,
    isWarmup: st.kind === 'warmup',
    side: st.side ?? input.side ?? null,
    reps,
    loadKg: loadKg ?? (st.kind === 'warmup' ? null : state.loads[st.exercise] ?? null),
    rir: st.kind === 'warmup' || ex.unit === 'sec' ? null : rir,
    holdSec: ex.unit === 'sec' ? (holdSec ?? ex.holdSec) : null,
    pain,
    painZone: pain ? (input.painZone ?? 'inconnu') : null,
    comment: (input.comment ?? '').slice(0, 500),
    completedAt: now,
    targetRepsMin: st.kind === 'work' ? ex.repsMin : null,
    targetRepsMax: st.kind === 'work' ? ex.repsMax : null,
    targetRir: st.kind === 'work' && ex.unit !== 'sec' ? ex.rirTarget : null,
    isCalibration: calibrating,
    capped,
    // Exercice à charge : pas d'échelon enregistré (progression-et-bilan-v1.md §2 point 4) dès que le contexte sait les distinguer.
    echelon: curEchelon ?? (ctx.echelonInfo ? null : ctx.echelonOf?.(ex) ?? null),
    variantId: sw ? sw.variantId : ex.variantId,
  };

  const next = clone(state);
  if (st.kind === 'work') next.workSetsDone += 1;

  let suggestion: CalibrationStep | null = null;
  let echelonChange: SetResult['echelonChange'] = null;
  if (pain) {
    // R4 : l'exercice s'arrête, séries restantes annulées, charge gelée, pas de repos.
    next.skipped.push(st.exercise);
    next.painExercises.push(st.exercise);
    next.rest = null;
    next.step = nextStepIndex(steps, cur + 1, next.skipped);
  } else {
    if (st.kind === 'work') {
      if (info && calibrating && ex.unit !== 'sec') {
        // F6 §2 : la première série de travail de la fiche décide de l'échelon pour les séries restantes (une seule fois par séance).
        if (!state.calibDecided.includes(st.exercise)) {
          next.calibDecided.push(st.exercise);
          if (entry.rir !== null && entry.reps !== null && curEchelon !== null) {
            const canRaise = !capped && !info.noRaise && (info.ceiling === null || curEchelon < info.ceiling);
            const step = echelonCalibrationStep({
              reps: entry.reps, rir: entry.rir, repsMin: ex.repsMin, repsMax: ex.repsMax, rirTarget: ex.rirTarget,
              echelon: curEchelon, up: info.up, down: info.down, canRaise,
            });
            suggestion = { action: step.action, loadKg: null, echelon: step.echelon };
            if (step.action !== 'garder' && step.variantId) {
              next.echelonSwitches[st.exercise] = { echelon: step.echelon, variantId: step.variantId, from: curEchelon };
              echelonChange = { exercise: st.exercise, from: curEchelon, to: step.echelon, variantId: step.variantId };
            }
          }
        }
        next.loads[st.exercise] = entry.loadKg;
      } else if (calibrating && entry.rir !== null && entry.reps !== null && ex.unit !== 'sec') {
        suggestion = nextCalibrationStep({
          rir: entry.rir,
          reps: entry.reps,
          repsMin: ex.repsMin,
          repsMax: ex.repsMax,
          rirTarget: ex.rirTarget,
          capped,
          pain: false,
          loadKg: entry.loadKg,
          availableLoadsKg: ctx.availableLoadsKg(ex, entry.loadKg),
          echelon: entry.echelon ?? undefined,
          availableEchelons: ctx.availableEchelons?.(ex),
        });
        next.loads[st.exercise] = suggestion.loadKg;
      } else next.loads[st.exercise] = entry.loadKg;
    }
    const nextIdx = nextStepIndex(steps, cur + 1, next.skipped);
    next.step = nextIdx;
    if (nextIdx < steps.length && st.restAfterSec > 0) {
      // Superset dont le partenaire est sauté : repos de la paire à la place de la transition de 15 s.
      const sameBlock = steps[nextIdx].block === st.block;
      const useTransition = st.restKind === 'transition' && sameBlock;
      next.rest = startRest(now, useTransition ? st.restAfterSec : st.restKind === 'transition' ? st.pairRestSec : st.restAfterSec, useTransition ? 'transition' : 'repos');
    } else next.rest = null;
  }
  if (next.step >= steps.length) {
    next.phase = 'fin';
    next.rest = null;
  }
  return { state: next, entry, suggestion, echelonChange };
}

/** « Ça fait mal » : même effet que `completeSet({pain: true})`. La série en cours est enregistrée avec pain = true. */
export function markPain(
  day: ProgramDay,
  state: EngineState,
  input: Omit<SetInput, 'pain'> & { zone?: InjuryZone | 'inconnu' | null },
  ctx: EngineContext,
  now: number,
): SetResult {
  const { zone, ...rest } = input;
  return completeSet(day, state, { ...rest, pain: true, painZone: zone ?? rest.painZone ?? 'inconnu' }, ctx, now);
}

export function skipRest(state: EngineState): EngineState {
  assertRunning(state);
  if (!state.rest) return state;
  return { ...clone(state), rest: null };
}

/**
 * Repos réellement pris (secondes) quand la personne quitte l'écran de repos ; null si : repos sauté avant la fin (exclu de la moyenne),
 * transition de superset, repos d'échauffement, pas de série de travail ensuite, ou pause plus longue que `maxSec`
 * (progression-et-bilan-v1.md §3.1 point 2). `prev` = dernière série enregistrée : le repos a commencé à son heure.
 */
export function restTaken(day: ProgramDay, state: EngineState, prev: { completedAt: number; isWarmup: boolean } | null, now: number, maxSec: number): number | null {
  const rest = state.rest;
  if (!rest || rest.kind !== 'repos' || !prev || prev.isWarmup) return null;
  if (remainingMs(rest, now) > 0) return null;
  const steps = buildSteps(day.exercises);
  const next = steps[nextStepIndex(steps, state.step, state.skipped)];
  if (!next || next.kind !== 'work') return null;
  const sec = Math.round((now - prev.completedAt) / 1000);
  return sec > 0 && sec <= maxSec ? sec : null;
}

export function adjustRest(state: EngineState, deltaSec: number, now: number): EngineState {
  assertRunning(state);
  if (!state.rest) return state;
  const s = clone(state);
  s.rest = adjustRestState(state.rest, deltaSec, now);
  return s;
}
export { REST_ADJUST_STEP_SEC };

/** Saute l'exercice courant (confirmation demandée par l'interface avant l'appel). */
export function skipExercise(day: ProgramDay, state: EngineState): EngineState {
  assertRunning(state);
  if (state.phase !== 'exercices') return state;
  const steps = buildSteps(day.exercises);
  const cur = nextStepIndex(steps, state.step, state.skipped);
  if (cur >= steps.length) return state;
  const s = clone(state);
  s.skipped.push(steps[cur].exercise);
  s.rest = null;
  s.step = nextStepIndex(steps, cur + 1, s.skipped);
  if (s.step >= steps.length) s.phase = 'fin';
  return s;
}

/** Terminer. Aucune série de travail faite : la séance compte comme abandonnée (rien à enregistrer comme « faite »). */
export function finishSession(state: EngineState, now: number): EngineState {
  assertRunning(state);
  return { ...clone(state), phase: 'fin', rest: null, endedAt: now, outcome: state.workSetsDone > 0 ? 'terminee' : 'abandon' };
}

export function abandonSession(state: EngineState, now: number): EngineState {
  assertRunning(state);
  return { ...clone(state), phase: 'fin', rest: null, endedAt: now, outcome: 'abandon' };
}

export interface SymptomReport {
  state: EngineState;
  /** Toujours vrai : la séance est interrompue. */
  stopped: true;
  /** U1 affiché d'abord (U2) quand le cas est urgent. */
  urgent: boolean;
}
/** « J'ai un symptôme » : interrompt proprement la séance (les séries déjà faites restent enregistrées). */
export function reportSymptom(state: EngineState, now: number, urgent = false): SymptomReport {
  if (state.outcome !== 'en_cours') return { state, stopped: true, urgent };
  return { state: { ...clone(state), phase: 'fin', rest: null, endedAt: now, outcome: 'symptome' }, stopped: true, urgent };
}

// ----- Lecture -----
export interface SessionView {
  phase: Phase;
  outcome: Outcome;
  cursor: SessionCursor | null;
  exercise: PlannedExercise | null;
  exerciseIndex: number | null;
  isWarmupSet: boolean;
  /** « Série 2/3 » : rang de 1 à `setsTotal` (échauffement : rang et total des séries d'échauffement). */
  setNumber: number;
  setsTotal: number;
  side: 'gauche' | 'droite' | null;
  /** Superset : exercice partenaire de la paire, ou null. */
  partnerIndexes: number[];
  inSuperset: boolean;
  /** Charge à préremplir. */
  loadKg: number | null;
  resting: RestState | null;
  /** Étapes de travail faites / prévues (sauts et douleurs déduits des prévues). */
  progress: { done: number; total: number };
}

export function currentView(day: ProgramDay, state: EngineState): SessionView {
  const steps = buildSteps(day.exercises);
  const cur = nextStepIndex(steps, state.step, state.skipped);
  const st = state.phase === 'exercices' && cur < steps.length ? steps[cur] : null;
  const base = st ? day.exercises[st.exercise] : null;
  const sw = st ? state.echelonSwitches[st.exercise] : undefined;
  // F6 : après un changement d'échelon, l'exercice affiché est la nouvelle variante (même fiche).
  const ex = base && sw ? { ...base, variantId: sw.variantId } : base;
  const group = ex?.supersetGroup ?? null;
  const partners = group ? day.exercises.map((e, i) => (e.supersetGroup === group && i !== st!.exercise ? i : -1)).filter((i) => i >= 0) : [];
  const kept = steps.map((s, i) => ({ s, i })).filter(({ s }) => s.kind === 'work' && !state.skipped.includes(s.exercise));
  const done = state.phase === 'exercices' ? kept.filter(({ i }) => i < cur).length : state.workSetsDone;
  return {
    phase: state.phase,
    outcome: state.outcome,
    cursor: st ? { exercise: st.exercise, set: st.set, face: st.face, step: cur } : null,
    exercise: ex,
    exerciseIndex: st ? st.exercise : null,
    isWarmupSet: st?.kind === 'warmup',
    setNumber: st ? st.set + 1 : 0,
    setsTotal: st && ex ? (st.kind === 'warmup' ? ex.warmupSets.length : ex.sets) : 0,
    side: st?.side ?? null,
    partnerIndexes: partners,
    inSuperset: group !== null && partners.length > 0,
    loadKg: st ? (st.kind === 'warmup' ? warmupLoadKg(state.loads[st.exercise] ?? null, ex!.warmupSets[st.set]?.percent ?? null) : state.loads[st.exercise] ?? null) : null,
    resting: state.rest,
    progress: { done, total: kept.length },
  };
}
