// Progression du cou par paliers (NECK_PROGRESSION, config.ts ; avis kiné + relecteur du 14/11/2026, NON SOURCÉ / PROVISOIRE).
// Le palier est DÉDUIT de l'historique (séances faites avec le cou, séries, blessures) : aucun état à stocker ni à importer.
import { list, listTrusted } from '../data/repo';
import type { Injury, PlannedExercise, ProgramDay, SetLog, WorkoutSession } from '../data/model';
import { CORRECTIF_COU, NECK_PROGRESSION as NP } from '../generator/config';
import { NECK_FICHE_ID, neckMustBeRemoved } from './neck-stop';

const DAY_MS = 86_400_000;
const isNeck = (e: Pick<PlannedExercise, 'movementId' | 'slot'>) => e.movementId === NECK_FICHE_ID && e.slot === 'correctif';

/** Palier (1 à 4) du cou pour la prochaine séance. `level` : niveau du profil (débutant plafonné). Palier 1 sans historique. */
export function neckStageFrom(i: {
  sessions: readonly WorkoutSession[];
  sets: readonly SetLog[];
  injuries: readonly Injury[];
  level: string | null | undefined;
  nowMs: number;
}): number {
  if (!NP.enabled) return 1;
  // Gêne au cou, à l'épaule ou au dos (niveau >= 1) : palier 1 (relecteur : la montée exige ces zones à 0).
  if (i.injuries.some((x) => !x.deletedAt && x.active && x.level >= 1 && NP.zonesFromLevel1.includes(x.zone))) return 1;
  const cap = i.level === 'debutant' ? NP.beginnerMaxStage : NP.stages.length;
  const neckSessions = i.sessions
    .filter((s) => !s.deletedAt && (s.status === 'faite' || s.endReason === 'symptome' || s.endReason === 'abandon') && s.plan?.exercises.some(isNeck))
    .map((s) => ({ s, t: Date.parse(s.endedAt ?? s.startedAt ?? s.plannedDate) }))
    .filter((x) => Number.isFinite(x.t))
    .sort((a, b) => a.t - b.t);
  let stage = 1;
  let streak = 0;
  let lastRise = -Infinity; // début du palier en cours : première séance propre du palier, ou dernière montée
  let prevT = -Infinity;
  for (const { s, t } of neckSessions) {
    if (t - prevT > NP.resetAfterDays * DAY_MS) { stage = 1; streak = 0; lastRise = -Infinity; }
    prevT = t;
    const plan = s.plan!.exercises;
    const idx = plan.findIndex(isNeck);
    const neckSets = i.sets.filter((x) => x.sessionId === s.id && x.movementId === NECK_FICHE_ID && !x.deletedAt && !x.isWarmup);
    const hasPain = neckSets.some((x) => x.pain);
    const clean = s.status === 'faite' && s.endReason !== 'symptome' && s.endReason !== 'abandon' && !hasPain && !neckMustBeRemoved({ endReason: s.endReason, painExercises: s.painExercises, exercises: plan }) && neckSets.length > 0;
    if (!clean) { stage = 1; streak = 0; lastRise = -Infinity; continue; }
    if (lastRise === -Infinity) lastRise = t;
    streak++;
    const hold = plan[idx].holdSec ?? NP.stages[0].holdSec;
    const feltVals = neckSets.map((x) => x.felt).filter((x): x is number => typeof x === 'number');
    const felt = feltVals.length ? Math.min(...feltVals) : -1; // la plus basse déclarée (lecture prudente) // 0 s, 5 s, 10 s, 15 s, 20 s + : index x 5 s
    const enough = felt * 5 >= hold + NP.felt.extraSecNeeded; // filtre déclaratif, jamais une cible
    if (streak >= NP.cleanSessionsToRise && t - lastRise >= NP.riseMinDays * DAY_MS && enough && stage < Math.min(cap, NP.stages.length)) {
      stage++; streak = 0; lastRise = t;
    }
  }
  if (neckSessions.length && i.nowMs - prevT > NP.resetAfterDays * DAY_MS) return 1;
  return Math.min(stage, cap);
}

/** Copie du jour avec la dose du palier sur l'exercice du cou (rien d'autre ne change). Plafonds relus : jamais au-delà de NECK_PROGRESSION. */
export function applyNeckStage(day: ProgramDay, stage: number): ProgramDay {
  if (!NP.enabled || stage <= 1 || !day.exercises.some(isNeck)) return day;
  const st = NP.stages[Math.min(Math.max(stage, 1), NP.stages.length) - 1];
  const holdSec = Math.min(st.holdSec, NP.maxHoldSec);
  const sets = st.sets;
  const holds = Math.min(st.holds, Math.floor(NP.maxCumulSec / (sets * holdSec)));
  const note = `Palier ${stage} sur ${NP.stages.length} : ${sets} série${sets > 1 ? 's' : ''} de ${holds} maintiens de ${holdSec} s, direction avant. ${NP.pressureText} ${NP.riseText}`;
  return {
    ...day,
    exercises: day.exercises.map((e) => (isNeck(e) ? { ...e, sets, repsMin: holds, repsMax: holds, holdSec, cappedLabel: `${CORRECTIF_COU.stopMessage} ${note}` } : e)),
  };
}

/** Charge l'historique local et applique le palier (démarrage de séance, aperçu). */
export async function dayWithNeckStage(day: ProgramDay, nowMs: number): Promise<ProgramDay> {
  if (!day.exercises.some(isNeck)) return day;
  const [sessions, sets, injuries, profiles] = await Promise.all([listTrusted('sessions'), listTrusted('sets'), list('injuries'), list('profile')]);
  return applyNeckStage(day, neckStageFrom({ sessions, sets, injuries, level: profiles[0]?.level ?? null, nowMs }));
}
