// Lot cohérence, point 4 (décision de l'utilisateur du 06/11/2026, sécurité : sous réserve du relecteur) : intensité après une séance
// « trop facile ». Toutes les séries au haut de la fourchette ou au-dessus, à une réserve >= 3 (et >= cible + 1) : la séance suivante
// monte, selon le temps disponible (estimation de la séance contre sa durée limite, même calcul que le générateur et le rattrapage) :
//   1) beaucoup de marge (un exercice entier avec ses repos tient) : un ajout utile, même ordre que le point 3 (fillToTarget) ;
//   2) marge moyenne ou faible : plus de répétitions (fourchette du rôle ou de la classe), puis une série, tant que l'estimation <= limite ;
//   3) séance à la limite : rien qui allonge ; 4) variante plus dure : seulement si rien d'autre n'est possible, et seulement par les
//      règles existantes (E2, C8, D3 / D4) ; 5) les repos ne sont JAMAIS touchés.
// Tout est une PROPOSITION (bilan « La prochaine fois », acceptation en un appui, adapt-accept.ts) ; rien n'est appliqué en silence.
// Les garde-fous (grossesse, reprise, douleur / gel, symptôme, séance manquée, débutant après un échec, case de sécurité, plafonds)
// sont vérifiés par l'appelant (proposeProgression) AVANT cette décision, puis de nouveau au moment d'appliquer (applyAccepted).
import type { PlannedExercise, ProgramDay, SetLog } from '../data/model';
import { CORRECTIF_COU, D_CLASS, D4_FICHE_DOSE, FIXED_DOSE, REPS_TABLE, TECHNICAL_CAP_FICHES, TECHNICAL_MAX_REPS, UNLIMITED } from '../generator/config';
import { isChargeable, type Ctx } from '../generator/context';
import { plannedOf } from '../generator/index';
import { makePlaf, splitCapsOk, weekCapsOk } from '../generator/plaf';
import { doseRoleOf, repsGoalOf, variantClass } from '../generator/reps';
import type { Fiche, FicheVariant, GenExercise, SlotKey } from '../generator/types';
import { fillToTarget, hasHeavyShoulderTrap, zoneCapsOk } from '../generator/zones-check';
import type { DurExercise, DurSession } from '../generator/duration';
import { durOf, genOf } from '../zones/catchup';
import { INTENSITY } from './progression-config';

/**
 * Durée LIMITE d'une séance (minutes) : « illimité » (aucune durée dans le profil, programme à la cible 60) = UNLIMITED.capMin (75) ;
 * durée choisie = cette durée, jamais dépassée. Même règle que le rattrapage des zones (launch.ts catchUpOf).
 */
export function sessionLimitMin(profileDurationMin: number | null | undefined, programDurationMin: number): number;
export function sessionLimitMin(profileDurationMin: number | null | undefined, programDurationMin: number | undefined): number | undefined;
export function sessionLimitMin(profileDurationMin: number | null | undefined, programDurationMin: number | undefined): number | undefined {
  if (programDurationMin === undefined) return undefined;
  return profileDurationMin == null && programDurationMin === UNLIMITED.targetMin ? UNLIMITED.capMin : programDurationMin;
}

/** Cardio du jour (hors bloc de la semaine) : compté dans l'estimation, comme la durée affichée du rattrapage. */
const cardioSecOf = (exs: readonly PlannedExercise[]): number =>
  exs.filter((e) => (e.role === 'cardio' || e.slot === 'cardio') && !e.fromWeek).reduce((a, e) => a + (e.holdSec ?? 0) * e.sets, 0);

/** Estimation (secondes) d'une séance avec `exercises` à la place des siens : estimerDuree du générateur (via catchup.durOf) + cardio du jour. */
export function estimateDaySec(day: ProgramDay, exercises: readonly PlannedExercise[], ctx: Ctx): number {
  const d = { ...day, exercises: [...exercises] };
  const gens = d.exercises.map((e) => genOf(e, ctx)).filter((e): e is GenExercise & DurExercise => e !== null);
  return durOf(d, gens, ctx) + cardioSecOf(d.exercises);
}

/** Signal « trop facile » : toutes les séries de travail (deux côtés : le côté faible décide), sans douleur, au haut de la fourchette ou au-dessus, réserve >= max(3, cible + 1). */
export function easySignal(lastSets: readonly SetLog[], ex: Pick<PlannedExercise, 'repsMax' | 'rirTarget'>): boolean {
  if (!lastSets.length) return false;
  return lastSets.every((s) => {
    const top = s.targetRepsMax ?? ex.repsMax;
    const rirT = s.targetRir ?? ex.rirTarget;
    return !s.pain && s.reps !== null && s.reps >= top && s.rir !== null && s.rir !== undefined && s.rir >= Math.max(INTENSITY.easyRir, rirT + 1);
  });
}

export interface IntensityTime {
  /** Séance prévue qui contient l'exercice. */
  day: ProgramDay;
  /** Durée limite (secondes) : sessionLimitMin * 60. */
  limitSec: number;
  /** Estimation (secondes) de la séance avec ces exercices : estimateDaySec. */
  estimate(exercises: readonly PlannedExercise[]): number;
}

export interface IntensityInput {
  exercise: PlannedExercise;
  /** Séries de travail de la dernière séance valable de l'exercice. */
  lastSets: readonly SetLog[];
  beginner: boolean;
  /**
   * C3 / C7 (relecteur 06/11) : séances valables de suite au haut de la fourchette >= topSessionsForSet (2), techniques compris.
   * Absent ou faux : ni série ni ajout, seulement des répétitions.
   */
  growthAllowed?: boolean;
  /** Haut de la fourchette du rôle (REPS_TABLE) ou de la classe (D_CLASS), plafonds de fiche compris (15 charges libres, 12 techniques). */
  repsCeiling: number;
  /** Plafond de séries : rôle (C7), fiche (DOSE_LIMITS), classe. */
  maxSets: number;
  /** Absent : aucune estimation de durée possible, aucune montée par le temps (lecture prudente). */
  time?: IntensityTime;
}

export type IntensityDecision =
  | { kind: 'exercice' }
  | { kind: 'repetitions'; repsMin: number; repsMax: number }
  | { kind: 'serie'; sets: number }
  /** Rien d'autre n'est possible (séance à la limite, plafonds atteints) : seules les règles existantes de version plus dure peuvent s'appliquer. */
  | { kind: 'variante' };

/** Plafond des charges libres (repetitions-regles.md §3, « Plafond de répétitions pour les charges libres : 15 », SRC7, OK). */
const FREE_WEIGHT_MAX_REPS = 15;

/**
 * Haut de la fourchette autorisée pour la montée de répétitions : classe D1 à D3 de la variante sans charge (D_CLASS, débutant D3 : 6-10),
 * ligne REPS_TABLE du rôle pour une variante chargeable (plafond 15, 12 pour les fiches techniques). Dose fixe, D4, durée : la fourchette
 * actuelle (aucune montée de répétitions).
 */
export function repsCeilingOf(ex: PlannedExercise, f: Fiche, v: FicheVariant, ctx: Ctx): number {
  if (ex.unit === 'sec' || FIXED_DOSE[ex.movementId] || D4_FICHE_DOSE[f.id] || ctx.pregnant) return ex.repsMax;
  if (!isChargeable(v)) {
    const k = variantClass(f, v);
    if (k === null || k === 4) return ex.repsMax;
    const c = D_CLASS[k];
    return (ctx.level === 'debutant' && c.repsDebutant ? c.repsDebutant : c.reps)[1];
  }
  const role = doseRoleOf(ex.slot as SlotKey, f);
  const row = REPS_TABLE[role]?.[repsGoalOf(ctx, role)]?.[ctx.level];
  const hi = Math.min(row?.reps[1] ?? ex.repsMax, FREE_WEIGHT_MAX_REPS);
  return TECHNICAL_CAP_FICHES.includes(f.id) ? Math.min(hi, TECHNICAL_MAX_REPS) : hi;
}

/** Fourchette visée après la montée de répétitions : +repsStep au plus, jamais au-delà du plafond ; null si déjà au plafond. */
export function repsRaise(ex: Pick<PlannedExercise, 'repsMin' | 'repsMax'>, ceiling: number): { repsMin: number; repsMax: number } | null {
  const max = Math.min(ceiling, ex.repsMax + INTENSITY.repsStep);
  if (max <= ex.repsMax) return null;
  return { repsMin: Math.min(ex.repsMin + (max - ex.repsMax), max), repsMax: max };
}

/**
 * Décision du point 4, pour un exercice dont la dernière séance valable est « trop facile » (l'appelant a déjà vérifié tous les gels).
 * null = pas de signal, ou pas d'estimation de durée. Jamais de repos raccourci ; jamais une estimation au-dessus de la limite.
 */
export function decideIntensity(i: IntensityInput): IntensityDecision | null {
  const ex = i.exercise;
  if (!i.time || !easySignal(i.lastSets, ex)) return null;
  const { day, limitSec, estimate } = i.time;
  const idx = day.exercises.findIndex((e) => e.movementId === ex.movementId);
  if (idx < 0) return null;
  const base = day.exercises;
  const est0 = estimate(base);
  const fits = (exs: readonly PlannedExercise[]) => estimate(exs) <= limitSec;
  const at = base[idx];
  // 1) Beaucoup de marge : un exercice entier (le même, avec ses séries et ses repos) tient encore. Jamais pour le débutant (2 séries,
  //    sa montée reste par répétitions puis par les propositions existantes).
  const grow = !i.beginner && i.growthAllowed === true;
  if (grow && est0 <= limitSec && fits([...base, { ...at, supersetGroup: null }])) return { kind: 'exercice' };
  // 2) Plus de répétitions, dans la fourchette du rôle ou de la classe.
  const r = repsRaise(at, i.repsCeiling);
  if (r && fits(base.map((e, j) => (j === idx ? { ...e, ...r } : e)))) return { kind: 'repetitions', ...r };
  // 2 bis) Une série en plus : jamais pour le débutant, jamais en superset, plafonds de séries.
  if (grow && !at.supersetGroup && at.sets + 1 <= i.maxSets && fits(base.map((e, j) => (j === idx ? { ...e, sets: e.sets + 1 } : e)))) {
    return { kind: 'serie', sets: at.sets + 1 };
  }
  // 3) et 4) Séance à la limite ou plafonds atteints : rien qui allonge ; la version plus dure reste aux règles existantes.
  return { kind: 'variante' };
}

// ---------------------------------------------------------------------------------------------
// Application de « un exercice en plus » (acceptée) au démarrage de la séance suivante
// ---------------------------------------------------------------------------------------------
export interface ExerciseFillDeps {
  ctx: Ctx;
  /** Séances de la semaine (jeu de la semaine), dont `days[dayIndex]` = la séance qui démarre (copie après les autres changements acceptés). */
  days: readonly ProgramDay[];
  dayIndex: number;
  limitSec: number;
  /** Exercices à ne pas toucher (changement déjà appliqué, gel douleur, case de sécurité). */
  locked(ex: PlannedExercise): boolean;
  /** Fiche dont une zone est gelée (douleur sur 2 séances, symptôme) : jamais ajoutée (relecteur 06/11, bloquant). */
  frozenFiche(ficheId: string): boolean;
}

/**
 * Remplit le temps libre de la séance jusqu'à la limite dans l'ordre du point 3 (fillToTarget : a) séries sur les zones orange de la
 * semaine jusqu'au rouge, b) correctifs des petites zones ; c) le cardio n'est jamais ajouté ici). Mêmes garde-fous que le générateur
 * (V-PLAF « auto », plafond hebdomadaire, plafonds par zone, dose de la fiche, débutant / grossesse / reprise / semaine allégée : rien),
 * plus : au plus +1 série par exercice, aucun exercice verrouillé modifié, jamais au-delà de la limite. null si rien n'a pu être ajouté.
 */
/** Fiche ajoutable par le remplissage : connue, sans zone gelée par une douleur, sans ligne de zone gênée du profil (niveau >= 1). */
export function addableFiche(ctx: Ctx, frozenFiche: (ficheId: string) => boolean, id: string): boolean {
  const f = ctx.fichesById.get(id);
  if (!f || frozenFiche(id)) return false;
  return !ctx.zones.some((z) => !z.isG && z.level >= 1 && Object.prototype.hasOwnProperty.call(f.securite.zones, z.key));
}

export function fillExerciseTime(d: ExerciseFillDeps): ProgramDay | null {
  const { ctx } = d;
  const today = d.days[d.dayIndex];
  if (!today) return null;
  // Fiches ajoutables : ni zone gelée par une douleur, ni ligne de zone gênée du profil (cases de sécurité : resolveFiche dans correctifCandidates).
  const addable = (id: string) => addableFiche(ctx, d.frozenFiche, id);
  const pool = [...ctx.fichesById.values()].filter((f) => addable(f.id) || today.exercises.some((e) => e.movementId === f.id));
  type Sess = DurSession<GenExercise>;
  const gens = (day: ProgramDay) => day.exercises.map((e) => genOf(e, ctx)).filter((e): e is GenExercise & DurExercise => e !== null);
  const sessOf = (day: ProgramDay): Sess => ({
    label: day.sessionType ?? 'CE', days: 1, level: ctx.level, pregnant: ctx.pregnant, exercises: gens(day),
    e1Sec: day.warmup?.generalSec ?? 0, e2Count: day.warmup?.mobility.length ?? 0,
  });
  const sessions = d.days.map(sessOf);
  const mine = sessions[d.dayIndex];
  const orig = new Map(mine.exercises.map((e) => [e.movementId, e] as const));
  const cardio = cardioSecOf(today.exercises);
  const plaf = makePlaf(ctx, 'auto');
  const lockedIds = new Set(today.exercises.filter((e) => d.locked(e)).map((e) => e.movementId));
  // La séance du jour est repérée par une marque recopiée avec elle (fillToTarget travaille sur des copies) ; les autres : budget 0, rien n'y est ajouté.
  const TODAY = '__intensiteJour';
  const isToday = (s: Sess) => !!(s as unknown as Record<string, unknown>)[TODAY];
  const budget = (s: Sess) => (isToday(s) ? d.limitSec - cardio : 0);
  const sessionOk = (exs: GenExercise[]) =>
    splitCapsOk(exs, plaf) &&
    // CAL-12 : jamais d'exercice lourd d'épaules / trapèzes ajouté dans une séance qui a le cou.
    !(exs.some((e) => e.ficheId === CORRECTIF_COU.ficheId && e.slot === 'correctif') && hasHeavyShoulderTrap({ exercises: exs }, ctx)) &&
    exs.every((e) => {
      const o = orig.get(e.movementId);
      return !o || (lockedIds.has(e.movementId) ? e.sets === o.sets : e.sets <= o.sets + 1);
    });
  const work = sessions.map((s, j) => (j === d.dayIndex ? { ...s, [TODAY]: true } : { ...s }));
  fillToTarget(work, {
    ctx, pool, budget, target: budget,
    sessionOk: (exs) => sessionOk(exs), weekOk: (ss) => weekCapsOk(ss as Sess[], ctx),
    alternatives: () => [],
  });
  const after = work[d.dayIndex];
  if (!zoneCapsOk(sessions, work, ctx)) return null;
  const changed = after.exercises.length !== mine.exercises.length || after.exercises.some((e, j) => e.sets !== mine.exercises[j]?.sets);
  if (!changed) return null;
  // Retour au modèle stocké : exercices existants (séries mises à jour, rien d'autre), nouveaux exercices (correctifs) en fin de séance.
  const setsOf = new Map(after.exercises.map((e) => [e.movementId, e.sets] as const));
  const kept = today.exercises.map((e) => (setsOf.has(e.movementId) && orig.has(e.movementId) ? { ...e, sets: setsOf.get(e.movementId)! } : e));
  const added = after.exercises.filter((e) => !orig.has(e.movementId)).map((e) => plannedOf(e));
  // Double contrôle (mémo du contexte) : un ajout sur une zone gelée ou gênée annule tout le remplissage.
  if (added.some((e) => !addable(e.movementId))) return null;
  const cardioIdx = kept.findIndex((e) => e.role === 'cardio' || e.slot === 'cardio');
  const exercises = cardioIdx < 0 ? [...kept, ...added] : [...kept.slice(0, cardioIdx), ...added, ...kept.slice(cardioIdx)];
  const out = { ...today, exercises };
  if (estimateDaySec(out, exercises, ctx) > d.limitSec) return null;
  return out;
}
