// Bilan de séance (F6) : knowledge/progression-et-bilan-v1.md §3 (V-BILAN-*). Fonctions PURES, recalculables à partir des séries.
// Sobre : pas de note, pas de score, pas de classement, pas de calories, rien de partagé. Seuils dans progression-config.ts (NON SOURCÉ).
import type { PregnancyStatus, SetLog, WorkoutSession } from '../data/model';
import { buildSteps } from './engine';
import { isWorkSet } from './progression';
import { PROGRESSION, type ProgressionConfig } from './progression-config';

export type SummaryStatus = 'premiere' | 'complete' | 'ecourtee' | 'douleur' | 'abandon' | 'symptome' | 'grossesse';
export type Verdict = 'plus' | 'moins' | 'similaire';

export interface RecordItem {
  movementId: string;
  kind: 'echelon' | 'charge' | 'repetitions' | 'duree';
  variantId: string;
  reps: number | null;
  loadKg: number | null;
  holdSec: number | null;
}
export interface Comparison {
  referenceId: string;
  verdict: Verdict;
  repsDelta: number;
  repsPct: number | null;
  setsDelta: number;
  setsVerdict: Verdict;
  tonnagePct: number | null;
  tonnageVerdict: Verdict | null;
  commonExercises: number;
}
export interface Summary {
  status: SummaryStatus;
  /** Aucune séance de référence ni exercice commun (jamais d'écart inventé). */
  isFirst: boolean;
  durationMin: number | null;
  /** Faux au-delà de la durée plausible (séance reprise) : exclue des comparaisons. */
  durationReliable: boolean;
  setsDone: number;
  setsPlanned: number;
  repsDone: number | null;
  repsPlanned: number | null;
  holdDoneSec: number | null;
  holdPlannedSec: number | null;
  tonnageKg: number | null;
  /** Repos moyen réel (s) ou, sans `restTakenSec`, temps moyen entre deux séries ; null si trop peu de données. */
  restAvgSec: number | null;
  restKind: 'repos' | 'entre';
  restPlannedAvgSec: number | null;
  comparison: Comparison | null;
  records: RecordItem[];
  /** Séries douloureuses par exercice. */
  painful: { movementId: string; count: number }[];
  referenceId: string | null;
}

export interface SummaryInput {
  session: WorkoutSession;
  /** Toutes les séries (la séance elle-même, ses séances de référence et ses séances antérieures). */
  sets: readonly SetLog[];
  sessions: readonly WorkoutSession[];
  pregnancy?: PregnancyStatus | null;
  cfg?: ProgressionConfig;
}

const ms = (iso: string | null | undefined): number => (iso ? Date.parse(iso) : NaN);
const sumBy = <T,>(a: readonly T[], f: (x: T) => number): number => a.reduce((n, x) => n + f(x), 0);
const isHold = (s: SetLog): boolean => s.holdSec !== null && s.holdSec !== undefined;
const isLoaded = (s: SetLog): boolean => (s.loadKg ?? 0) > 0;
const pct = (cur: number, ref: number): number | null => (ref > 0 ? ((cur - ref) / ref) * 100 : null);
const verdictPct = (p: number | null, t: number): Verdict => (p === null || Math.abs(p) < t ? 'similaire' : p > 0 ? 'plus' : 'moins');

/** Clé de comparaison : exercice à charge = fiche + variante ; sans charge = fiche + échelon (§3.2). */
const keyOf = (s: SetLog): string => (isLoaded(s) ? `${s.movementId}|v|${s.variantId}` : `${s.movementId}|e|${s.echelon ?? 'x'}`);

function plannedByMovement(plan: WorkoutSession['plan']): Map<string, number> {
  const out = new Map<string, number>();
  if (!plan) return out;
  for (const st of buildSteps(plan.exercises)) {
    if (st.kind !== 'work') continue;
    const m = plan.exercises[st.exercise].movementId;
    out.set(m, (out.get(m) ?? 0) + 1);
  }
  return out;
}

function aggregate(rows: readonly SetLog[], keys?: Set<string>) {
  const sel = rows.filter((s) => !keys || keys.has(keyOf(s)));
  return {
    sets: sel.length,
    reps: sumBy(sel.filter((s) => !isHold(s)), (s) => s.reps ?? 0),
    tonnage: sumBy(sel.filter(isLoaded), (s) => (s.loadKg ?? 0) * (s.reps ?? 0)),
    loaded: sel.some(isLoaded),
  };
}

export function computeSummary(i: SummaryInput): Summary {
  const cfg = i.cfg ?? PROGRESSION;
  const b = cfg.bilan;
  const sess = i.session;
  const mine = i.sets.filter((s) => s.sessionId === sess.id && isWorkSet(s)).sort((a, c) => ms(a.completedAt) - ms(c.completedAt));
  const done = mine.filter((s) => !s.pain);
  const pained = mine.filter((s) => s.pain);
  const plan = sess.plan ?? null;
  const steps = plan ? buildSteps(plan.exercises).filter((s) => s.kind === 'work') : [];
  const exOf = (idx: number) => plan!.exercises[idx];

  const minutes = Number.isFinite(ms(sess.endedAt)) && Number.isFinite(ms(sess.startedAt)) ? Math.max(1, Math.round((ms(sess.endedAt) - ms(sess.startedAt)) / 60000)) : null;
  const reliable = minutes !== null && minutes <= b.maxReliableDurationMin;
  const pregnant = i.pregnancy === 'enceinte' || i.pregnancy === 'post_partum';

  const base: Summary = {
    status: 'complete', isFirst: false, durationMin: minutes, durationReliable: reliable,
    // §3.1 : S = séries de travail terminées, séries douloureuses comprises (elles restent aussi listées à part, sans record ni comparaison).
    setsDone: mine.length, setsPlanned: steps.length || mine.length,
    repsDone: null, repsPlanned: null, holdDoneSec: null, holdPlannedSec: null, tonnageKg: null,
    restAvgSec: null, restKind: 'repos', restPlannedAvgSec: null, comparison: null, records: [], painful: [], referenceId: null,
  };

  // Abandon et symptôme : aucun bilan chiffré (§3.4). Un symptôme l'emporte sur tout.
  if (sess.endReason === 'symptome') return { ...base, status: 'symptome', durationMin: null, setsDone: 0, setsPlanned: 0 };
  if (sess.endReason === 'abandon' || sess.status === 'sautee' || done.length + pained.length === 0) {
    return { ...base, status: 'abandon', durationMin: null, setsDone: 0, setsPlanned: 0 };
  }
  // Grossesse et post-partum : durée et séries faites seulement (§3.6).
  if (pregnant) return { ...base, status: 'grossesse', setsPlanned: 0 };

  // ----- Indicateurs -----
  const repSteps = steps.filter((s) => exOf(s.exercise).unit !== 'sec');
  const holdSteps = steps.filter((s) => exOf(s.exercise).unit === 'sec');
  const repsDone = sumBy(mine.filter((s) => !isHold(s)), (s) => s.reps ?? 0);
  const holdDone = sumBy(mine.filter(isHold), (s) => s.holdSec ?? 0);
  const tonnage = sumBy(mine.filter(isLoaded), (s) => (s.loadKg ?? 0) * (s.reps ?? 0));

  const taken = done.map((s) => s.restTakenSec).filter((n): n is number => typeof n === 'number');
  const hasRestField = done.some((s) => s.restTakenSec !== undefined && s.restTakenSec !== null);
  let restAvg: number | null = null;
  let restKind: Summary['restKind'] = 'repos';
  if (hasRestField) {
    restAvg = taken.length >= b.minRestsForAverage ? taken.reduce((n, x) => n + x, 0) / taken.length : null;
  } else if (done.length >= 3) {
    // Sans `restTakenSec` (anciennes séances) : temps entre deux séries consécutives, qui inclut l'exécution ; jamais comparé au repos prescrit.
    restKind = 'entre';
    const gaps = done.slice(1).map((s, k) => (ms(s.completedAt) - ms(done[k].completedAt)) / 1000).filter((g) => g > 0 && g <= b.maxRestTakenSec);
    restAvg = gaps.length >= b.minRestsForAverage ? gaps.reduce((n, x) => n + x, 0) / gaps.length : null;
  }
  const plannedRests = steps.filter((s) => s.restAfterSec > 0 && s.restKind === 'repos').map((s) => s.restAfterSec);

  const painfulMovements = [...new Set(pained.map((s) => s.movementId))];
  const planned = plannedByMovement(plan);
  const fullyDone = (m: string): boolean => !planned.has(m) || done.filter((s) => s.movementId === m).length >= (planned.get(m) ?? 0);
  const complete = done.length >= (steps.length || done.length) && !(sess.skippedExercises?.length);

  // ----- Comparaison (§3.2) -----
  const others = i.sessions.filter((s) => !s.deletedAt && s.id !== sess.id && s.status === 'faite' && ms(s.startedAt) < ms(sess.startedAt));
  const setsOf = (id: string) => i.sets.filter((s) => s.sessionId === id && isWorkSet(s) && !s.pain);
  const curKeys = new Map<string, SetLog[]>();
  for (const s of done) if (!painfulMovements.includes(s.movementId) && fullyDone(s.movementId)) curKeys.set(keyOf(s), [...(curKeys.get(keyOf(s)) ?? []), s]);
  let comparison: Comparison | null = null;
  let referenceId: string | null = null;
  if (durationOk(reliable) && curKeys.size) {
    const hadPain = (id: string) => i.sets.some((s) => s.sessionId === id && isWorkSet(s) && s.pain);
    const newest = [...others].sort((a, c) => ms(c.startedAt) - ms(a.startedAt));
    const sameDay = newest.filter((s) => s.programId === sess.programId && s.programDayIndex === sess.programDayIndex && s.programId !== null).slice(0, b.maxReferenceBack);
    const candidates = [...sameDay, ...newest.filter((s) => !sameDay.includes(s)).slice(0, b.maxReferenceBack)];
    for (const ref of candidates) {
      if (hadPain(ref.id)) continue;
      const refRows = setsOf(ref.id);
      const common = new Set([...curKeys.keys()].filter((k) => refRows.some((s) => keyOf(s) === k)));
      if (!common.size) continue;
      const cur = aggregate([...curKeys.values()].flat(), common);
      const old = aggregate(refRows, common);
      const repsPct = pct(cur.reps, old.reps);
      const setsDelta = cur.sets - old.sets;
      const setsVerdict: Verdict = Math.abs(setsDelta) <= b.similarSets ? 'similaire' : setsDelta > 0 ? 'plus' : 'moins';
      const tonPct = cur.loaded && old.loaded ? pct(cur.tonnage, old.tonnage) : null;
      comparison = {
        referenceId: ref.id,
        verdict: old.reps > 0 ? verdictPct(repsPct, b.similarPercent) : setsVerdict,
        repsDelta: cur.reps - old.reps,
        repsPct,
        setsDelta,
        setsVerdict,
        tonnagePct: tonPct,
        tonnageVerdict: tonPct === null ? null : verdictPct(tonPct, b.similarPercent),
        commonExercises: common.size,
      };
      referenceId = ref.id;
      break;
    }
  }

  const records = findRecords(i, done, painfulMovements, others, cfg);
  const status: SummaryStatus = pained.length ? 'douleur' : !complete ? 'ecourtee' : comparison ? 'complete' : 'premiere';

  return {
    ...base,
    status,
    isFirst: !comparison,
    repsDone: repSteps.length || repsDone ? repsDone : null,
    repsPlanned: repSteps.length ? sumBy(repSteps, (s) => exOf(s.exercise).repsMax) : null,
    holdDoneSec: holdSteps.length || holdDone ? holdDone : null,
    holdPlannedSec: holdSteps.length ? sumBy(holdSteps, (s) => exOf(s.exercise).holdSec ?? 0) : null,
    tonnageKg: tonnage > 0 ? Math.round(tonnage) : null,
    restAvgSec: restAvg === null ? null : Math.round(restAvg),
    restKind,
    restPlannedAvgSec: plannedRests.length ? Math.round(plannedRests.reduce((n, x) => n + x, 0) / plannedRests.length) : null,
    comparison,
    records,
    painful: painfulMovements.map((m) => ({ movementId: m, count: pained.filter((s) => s.movementId === m).length })),
    referenceId,
  };
}
const durationOk = (reliable: boolean): boolean => reliable;

// ---------------------------------------------------------------------------------------------
// Records (§3.3) : clé = fiche ; au plus un par fiche et par séance ; exclusions complètes ; jamais d'invitation à battre un record
// ---------------------------------------------------------------------------------------------
function admissible(s: SetLog, cfg: ProgressionConfig): boolean {
  const b = cfg.bilan;
  if (!isWorkSet(s) || s.isCalibration || s.pain || s.capped) return false;
  if (isHold(s)) return (s.holdSec ?? 0) <= cfg.hold.recordCapSec;
  if (s.rir === null || s.rir === undefined) return false; // réserve non saisie
  return s.rir >= Math.max((s.targetRir ?? cfg.echelon.defaultRirTarget) - b.recordRirMargin, b.recordRirFloor);
}

function findRecords(i: SummaryInput, done: SetLog[], painfulMovements: string[], others: readonly WorkoutSession[], cfg: ProgressionConfig): RecordItem[] {
  const sess = i.session;
  if (sess.status !== 'faite' || sess.endReason === 'symptome') return [];
  const priorIds = new Set(others.map((s) => s.id));
  const out: RecordItem[] = [];
  const lo = (s: SetLog) => s.targetRepsMin ?? cfg.echelon.defaultRepsMin;
  const hi = (s: SetLog) => s.targetRepsMax ?? cfg.echelon.defaultRepsMax;
  for (const m of [...new Set(done.map((s) => s.movementId))]) {
    if (painfulMovements.includes(m)) continue;
    const priorAll = i.sets.filter((s) => priorIds.has(s.sessionId) && isWorkSet(s) && s.movementId === m);
    if (!priorAll.length) continue; // première fois, pas un record
    const prior = priorAll.filter((s) => admissible(s, cfg));
    const cur = done.filter((s) => s.movementId === m && admissible(s, cfg));
    if (!prior.length || !cur.length) continue;
    const mk = (kind: RecordItem['kind'], s: SetLog): RecordItem => ({ movementId: m, kind, variantId: s.variantId, reps: s.reps ?? null, loadKg: s.loadKg ?? null, holdSec: s.holdSec ?? null });
    const max = <T,>(a: T[], f: (x: T) => number): T | undefined => a.reduce<T | undefined>((best, x) => (best === undefined || f(x) > f(best) ? x : best), undefined);

    // 1. Échelon (poids du corps)
    const bw = (a: SetLog[]) => a.filter((s) => !isLoaded(s) && !isHold(s) && s.echelon !== null && s.echelon !== undefined);
    const curE = max(bw(cur).filter((s) => (s.reps ?? 0) >= lo(s)), (s) => s.echelon as number);
    const priorE = max(bw(prior), (s) => s.echelon as number);
    if (curE && priorE && (curE.echelon as number) > (priorE.echelon as number)) {
      out.push(mk('echelon', max(bw(cur).filter((s) => s.echelon === curE.echelon), (s) => s.reps ?? 0)!));
      continue;
    }
    // 2. Charge (même variante)
    let found = false;
    for (const v of [...new Set(cur.filter(isLoaded).map((s) => s.variantId))]) {
      const priorV = max(prior.filter((s) => isLoaded(s) && s.variantId === v), (s) => s.loadKg ?? 0);
      const curV = max(cur.filter((s) => isLoaded(s) && s.variantId === v && (s.reps ?? 0) >= lo(s)), (s) => s.loadKg ?? 0);
      if (priorV && curV && (curV.loadKg ?? 0) > (priorV.loadKg ?? 0)) {
        out.push(mk('charge', curV));
        found = true;
        break;
      }
    }
    if (found) continue;
    // 3. Répétitions à charge égale (ou échelon égal), plafonnées à la fourchette haute
    const groupKey = (s: SetLog) => (isLoaded(s) ? `v|${s.variantId}|${s.loadKg}` : `e|${s.echelon ?? 'x'}`);
    for (const g of [...new Set(cur.filter((s) => !isHold(s)).map(groupKey))]) {
      const priorG = max(prior.filter((s) => !isHold(s) && groupKey(s) === g), (s) => s.reps ?? 0);
      const curG = max(cur.filter((s) => !isHold(s) && groupKey(s) === g && (s.reps ?? 0) <= hi(s)), (s) => s.reps ?? 0);
      if (priorG && curG && (curG.reps ?? 0) > (priorG.reps ?? 0)) {
        out.push(mk('repetitions', curG));
        found = true;
        break;
      }
    }
    if (found) continue;
    // Durée d'un maintien
    const priorH = max(prior.filter(isHold), (s) => s.holdSec ?? 0);
    const curH = max(cur.filter(isHold), (s) => s.holdSec ?? 0);
    if (priorH && curH && (curH.holdSec ?? 0) > (priorH.holdSec ?? 0)) out.push(mk('duree', curH));
  }
  return out;
}
