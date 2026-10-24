// Séance en cours : machine à états (engine.ts) + enregistrement dans IndexedDB à CHAQUE action (reprise après fermeture).
// Tout est local : aucun accès réseau (CLAUDE.md A6). L'heure vient d'une horloge injectable (`now`, en ms).
import { getDB } from '../data/db';
import { create, get, list, update } from '../data/repo';
import type { InjuryZone, Program, ProgramDay, SetLog, WorkoutSession, NewRow } from '../data/model';
import {
  abandonSession, adjustRest, completeSet, currentView, endWarmup, finishSession, markPain, reportSymptom, skipExercise, skipRest, startSession,
  restTaken, SessionError, type EngineContext, type EngineState, type Outcome, type SessionView, type SetEntry, type SetInput, type SetResult,
} from './engine';
import { PROGRESSION } from './progression-config';
import { patchProgramVariant } from './progression-store';
import { R5_STOP_TEXT, U1_TEXT, U1_TEL } from './messages';
import { onForeground as timerOnForeground, realNow, REST_ADJUST_STEP_SEC, remainingMs, type ForegroundResult, type NowFn } from './timer';
import { painCheck, type PainCheck } from './history';

/** Au-delà de 12 h, une séance « en cours » n'est plus reprise automatiquement : on propose de la terminer ou de l'abandonner. */
export const RESUME_MAX_MS = 12 * 3600 * 1000;

const iso = (ms: number): string => new Date(ms).toISOString();

function statusOf(o: Outcome): WorkoutSession['status'] {
  return o === 'en_cours' ? 'en_cours' : o === 'terminee' ? 'faite' : 'sautee';
}

function toPatch(state: EngineState, day: ProgramDay, now: number): Partial<NewRow<'sessions'>> {
  const view = currentView(day, state);
  return {
    status: statusOf(state.outcome),
    phase: state.phase,
    cursor: view.cursor ?? { exercise: view.exerciseIndex ?? 0, set: 0, face: 0, step: state.step },
    restEndsAt: state.rest?.endsAt ?? null,
    restTotalMs: state.rest?.totalMs ?? null,
    restKind: state.rest?.kind ?? null,
    skippedExercises: [...state.skipped],
    painExercises: [...state.painExercises],
    loadsKg: Object.fromEntries(Object.entries(state.loads)),
    lastActionAt: iso(now),
    endedAt: state.endedAt === null ? null : iso(state.endedAt),
    endReason: state.outcome === 'en_cours' ? null : state.outcome === 'terminee' ? 'terminee' : state.outcome === 'symptome' ? 'symptome' : 'abandon',
    echelonSwitches: Object.fromEntries(Object.entries(state.echelonSwitches).map(([k, v]) => [k, { ...v }])),
    calibDecided: [...state.calibDecided],
  };
}

function stateFromRow(row: WorkoutSession, day: ProgramDay, workSetsDone: number): EngineState {
  const fresh = startSession(day, row.startedAt ? Date.parse(row.startedAt) : Date.parse(row.createdAt));
  const loads = { ...fresh.loads };
  for (const [k, v] of Object.entries(row.loadsKg ?? {})) loads[Number(k)] = v;
  const rest =
    row.restEndsAt !== null && row.restEndsAt !== undefined
      ? { endsAt: row.restEndsAt, totalMs: row.restTotalMs ?? 0, kind: (row.restKind ?? 'repos') as 'repos' | 'transition' }
      : null;
  return {
    ...fresh,
    phase: row.phase ?? fresh.phase,
    step: row.cursor?.step ?? 0,
    skipped: [...(row.skippedExercises ?? [])],
    painExercises: [...(row.painExercises ?? [])],
    rest,
    endedAt: row.endedAt ? Date.parse(row.endedAt) : null,
    outcome: row.status === 'en_cours' ? 'en_cours' : row.status === 'faite' ? 'terminee' : row.endReason === 'symptome' ? 'symptome' : 'abandon',
    loads,
    workSetsDone,
    echelonSwitches: Object.fromEntries(Object.entries(row.echelonSwitches ?? {}).map(([k, v]) => [Number(k), { ...v }])),
    calibDecided: [...(row.calibDecided ?? [])],
  };
}

async function setsOfSession(sessionId: string): Promise<SetLog[]> {
  const db = await getDB();
  return (await db.getAllFromIndex('sets', 'sessionId', sessionId)).filter((s) => !s.deletedAt);
}

export interface SymptomOutcome {
  /** U1 en premier quand le cas est urgent (U2 : jamais derrière une autre question). */
  messages: string[];
  urgent: boolean;
  /** Numéro à composer (bouton d'appel) quand urgent. */
  tel: string | null;
}

export class SessionController {
  private lastSeenAt: number | null = null;

  private constructor(
    readonly sessionId: string,
    readonly day: ProgramDay,
    readonly programId: string | null,
    public state: EngineState,
    private ctx: EngineContext,
    private now: NowFn,
  ) {}

  /** Commence une séance. Refuse s'il en reste une « en cours » : la personne doit d'abord la reprendre, la terminer ou l'abandonner. */
  static async start(program: Program, dayIndex: number, ctx: EngineContext, now: NowFn = realNow): Promise<SessionController> {
    const day = program.days[dayIndex];
    if (!day) throw new SessionError('Séance introuvable.');
    if ((await list('sessions')).some((s) => s.status === 'en_cours')) throw new SessionError('Une séance est déjà en cours.');
    const t = now();
    const state = startSession(day, t);
    const row = await create('sessions', {
      programId: program.id,
      programDayIndex: dayIndex,
      plannedDate: iso(t).slice(0, 10),
      status: 'en_cours',
      startedAt: iso(t),
      endedAt: null,
      note: '',
      plan: day,
      ...toPatch(state, day, t),
    } as NewRow<'sessions'>);
    return new SessionController(row.id, day, program.id, state, ctx, now);
  }

  /** Reprend une séance « en cours » (après fermeture de l'app). Le plan suivi est celui enregistré avec la séance. */
  static async resume(sessionId: string, ctx: EngineContext, now: NowFn = realNow): Promise<SessionController> {
    const row = await get('sessions', sessionId);
    if (!row || row.status !== 'en_cours' || !row.plan) throw new SessionError('Aucune séance à reprendre.');
    const sets = await setsOfSession(row.id);
    const state = stateFromRow(row, row.plan, sets.filter((s) => !s.isWarmup && s.completedAt).length);
    return new SessionController(row.id, row.plan, row.programId, state, ctx, now);
  }

  view(): SessionView {
    return currentView(this.day, this.state);
  }

  restRemainingMs(): number {
    return remainingMs(this.state.rest, this.now());
  }

  // ----- Actions (chacune est enregistrée) -----
  async endWarmup(): Promise<void> {
    await this.commit(endWarmup(this.day, this.state));
  }

  async completeSet(input: SetInput): Promise<SetResult> {
    const t = this.now();
    await this.closeRest(t); // repos encore ouvert (rare) : sa durée réelle est gardée avant la série suivante
    return this.applySet(completeSet(this.day, this.state, input, this.ctx, t));
  }

  /** « Ça fait mal » : série enregistrée avec pain = true, exercice arrêté, aucune hausse. Zone facultative. */
  async markPain(input: Omit<SetInput, 'pain'> & { zone?: InjuryZone | 'inconnu' | null } = {}): Promise<SetResult> {
    return this.applySet(markPain(this.day, this.state, input, this.ctx, this.now()));
  }

  async skipRest(): Promise<void> {
    await this.closeRest(this.now());
    await this.commit(skipRest(this.state));
  }

  async adjustRest(deltaSec: number): Promise<void> {
    if (Math.abs(deltaSec) !== REST_ADJUST_STEP_SEC) throw new SessionError('Réglage du repos : 15 s à la fois.');
    await this.commit(adjustRest(this.state, deltaSec, this.now()));
  }

  /** La confirmation (« Sauter cet exercice ? ») est demandée par l'interface avant l'appel. */
  async skipExercise(): Promise<void> {
    await this.commit(skipExercise(this.day, this.state));
  }

  async finishSession(): Promise<WorkoutSession> {
    return this.commit(finishSession(this.state, this.now()));
  }

  async abandonSession(): Promise<WorkoutSession> {
    return this.commit(abandonSession(this.state, this.now()));
  }

  /** « J'ai un symptôme » : interrompt la séance, garde les séries déjà faites, expose U1 (15 ou 112) si urgent. */
  async reportSymptom(urgent = false): Promise<SymptomOutcome> {
    const r = reportSymptom(this.state, this.now(), urgent);
    await this.commit(r.state);
    return {
      urgent,
      tel: urgent ? U1_TEL : null,
      messages: urgent ? [U1_TEXT, R5_STOP_TEXT] : [R5_STOP_TEXT],
    };
  }

  // ----- Arrière-plan -----
  onBackground(): void {
    this.lastSeenAt = this.now();
  }

  /** Retour au premier plan : le repos est recalculé depuis l'heure réelle. */
  onForeground(): ForegroundResult {
    const r = timerOnForeground(this.state.rest, this.now(), this.lastSeenAt);
    this.lastSeenAt = null;
    return r;
  }

  // ----- Interne -----
  /**
   * Quand la personne quitte l'écran de repos : durée réellement prise, écrite sur la série qui précède (`restTakenSec`, bilan §3.1 point 2).
   * Rien n'est écrit si le repos a été sauté avant la fin, si c'est une transition de superset ou un repos d'échauffement.
   */
  private async closeRest(now: number): Promise<boolean> {
    if (!this.state.rest) return false;
    const sets = (await setsOfSession(this.sessionId)).filter((s) => s.completedAt).sort((a, b) => (a.completedAt! < b.completedAt! ? 1 : -1));
    const prev = sets[0];
    if (!prev) return true;
    const sec = restTaken(this.day, this.state, { completedAt: Date.parse(prev.completedAt!), isWarmup: !!prev.isWarmup }, now, PROGRESSION.bilan.maxRestTakenSec);
    if (sec !== null) await update('sets', prev.id, { restTakenSec: sec });
    return true;
  }

  private async applySet(result: SetResult): Promise<SetResult> {
    const replaced = await this.writeSet(result.entry);
    // Série rejouée (plantage entre l'enregistrement de la série et celui du curseur) : déjà comptée.
    if (replaced && !result.entry.isWarmup) result.state.workSetsDone = Math.max(0, result.state.workSetsDone - 1);
    await this.commit(result.state);
    // Échelon changé pendant la séance (étalonnage) : la prochaine séance démarre à cette variante (progression-et-bilan-v1.md §2 point 3).
    if (result.echelonChange) await patchProgramVariant(this.programId, this.day.exercises[result.echelonChange.exercise].movementId, result.echelonChange.variantId);
    return result;
  }

  /** Une série = une ligne, retrouvée par sa clé : rejouer la même action après un plantage ne crée pas de doublon. */
  private async writeSet(e: SetEntry): Promise<boolean> {
    const ex = this.day.exercises[e.exercise];
    const data: NewRow<'sets'> = {
      sessionId: this.sessionId,
      movementId: ex.movementId,
      variantId: e.variantId,
      exerciseIndex: e.exercise,
      setIndex: e.set,
      targetRepsMin: e.targetRepsMin,
      targetRepsMax: e.targetRepsMax,
      reps: e.reps,
      loadKg: e.loadKg,
      rir: e.rir,
      pain: e.pain,
      comment: e.comment,
      completedAt: iso(e.completedAt),
      targetRir: e.targetRir,
      isCalibration: e.isCalibration,
      isWarmup: e.isWarmup,
      echelon: e.echelon,
      bandResistance: null,
      holdSec: e.holdSec,
      side: e.side,
      capped: e.capped,
      painZone: e.painZone,
      restTakenSec: null,
    };
    const existing = (await setsOfSession(this.sessionId)).find(
      (s) => s.exerciseIndex === e.exercise && s.setIndex === e.set && !!s.isWarmup === e.isWarmup && (s.side ?? null) === e.side,
    );
    if (existing) await update('sets', existing.id, data);
    else await create('sets', data);
    return !!existing;
  }

  private async commit(next: EngineState): Promise<WorkoutSession> {
    this.state = next;
    return update('sessions', this.sessionId, toPatch(next, this.day, this.now()));
  }
}

// ----- Au lancement de l'app -----
export interface Resumable {
  session: WorkoutSession;
  ageMs: number;
  /** `reprendre` : moins de 12 h ; sinon la personne choisit de terminer ou d'abandonner. */
  proposal: 'reprendre' | 'terminer_ou_abandonner';
}

export async function findResumable(nowMs: number = Date.now()): Promise<Resumable | null> {
  const open = (await list('sessions')).filter((s) => s.status === 'en_cours' && s.plan);
  if (!open.length) return null;
  const last = (s: WorkoutSession) => Date.parse(s.lastActionAt ?? s.startedAt ?? s.createdAt);
  const session = open.sort((a, b) => last(b) - last(a))[0];
  const ageMs = Math.max(0, nowMs - last(session));
  return { session, ageMs, proposal: ageMs < RESUME_MAX_MS ? 'reprendre' : 'terminer_ou_abandonner' };
}

/** Séance ancienne : « terminer » compte les séries faites (faite si au moins une série de travail, sinon abandonnée) ; « abandonner » garde les séries. */
export async function closeStaleSession(sessionId: string, how: 'terminer' | 'abandonner', ctx: EngineContext, nowMs: number = Date.now()): Promise<WorkoutSession> {
  const row = await get('sessions', sessionId);
  if (!row || row.status !== 'en_cours' || !row.plan) throw new SessionError('Aucune séance à clore.');
  const ctl = await SessionController.resume(sessionId, ctx, () => nowMs);
  return how === 'terminer' ? ctl.finishSession() : ctl.abandonSession();
}

/** Douleur sur plusieurs séances : propositions niveau 2 ou 3 et signe S1 (jamais appliqués sans confirmation). */
export async function currentPainCheck(): Promise<PainCheck> {
  const [sets, sessions, injuries] = await Promise.all([list('sets'), list('sessions'), list('injuries')]);
  return painCheck(sets, sessions, injuries);
}

