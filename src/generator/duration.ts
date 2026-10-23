// Durée estimée et ajustement (V-DUREE §4.4) ; supersets antagonistes (V-SUP §4.2).
// Fonctions pures sur une forme minimale de séance, utilisables avec des séances construites à la main (T3c, T25).
import type { ExerciseRole, ExerciseUnit, Level, WarmupSet } from '../data/model';
import { ACCESSORY_REMOVAL_ORDER, CORE_REMOVAL_ORDER, TIME, WARMUP } from './config';
import type { SlotKey } from './types';

export interface DurExercise {
  slot: SlotKey;
  role: ExerciseRole;
  sets: number;
  repsMin: number;
  repsMax: number;
  unit: ExerciseUnit;
  holdSec: number | null;
  restSec: number;
  unilateral: boolean;
  capped: boolean;
  adaptations: string[];
  replaces?: string | null;
  chargeable: boolean;
  musclesPrincipaux: string[];
  warmupSets: WarmupSet[];
  supersetGroup: string | null;
}
export interface DurSession<E extends DurExercise = DurExercise> {
  label: 'A' | 'B' | 'C';
  days: 2 | 3;
  level: Level;
  pregnant: boolean;
  exercises: E[];
  e1Sec: number;
  e2Count: number;
}

/** t_exec d'une série : répétitions moyennes x 4 s (x 2 si unilatéral ou par côté) + 10 s si unilatéral ; à durée : maintien (x 2 si unilatéral). */
export function tExec(e: Pick<DurExercise, 'unit' | 'holdSec' | 'repsMin' | 'repsMax' | 'unilateral'>): number {
  if (e.unit === 'sec') return (e.holdSec ?? 0) * (e.unilateral ? TIME.unilateralFactor : 1);
  const mean = (e.repsMin + e.repsMax) / 2;
  const factor = e.unilateral || e.unit === 'reps_par_cote' ? TIME.unilateralFactor : 1;
  return mean * TIME.secPerRep * factor + (e.unilateral ? TIME.unilateralExtraSec : 0);
}

export function warmupSetSec(w: WarmupSet, unilateral: boolean): number {
  return w.reps * TIME.secPerRep * (unilateral ? TIME.unilateralFactor : 1) + (unilateral ? TIME.unilateralExtraSec : 0) + WARMUP.e3RestSec;
}

/** Unités de la séance : exercices seuls et paires (dans l'ordre). */
export function units<E extends DurExercise>(s: DurSession<E>): E[][] {
  const out: E[][] = [];
  const seen = new Map<string, E[]>();
  for (const e of s.exercises) {
    if (e.supersetGroup) {
      const g = seen.get(e.supersetGroup);
      if (g) g.push(e);
      else {
        const n = [e];
        seen.set(e.supersetGroup, n);
        out.push(n);
      }
    } else out.push([e]);
  }
  return out;
}

/** T = T_ech + exercices seuls + paires + transitions (secondes). */
export function estimerDuree(s: DurSession): number {
  let t = s.e1Sec + s.e2Count * WARMUP.mobilitySecEach;
  for (const e of s.exercises) for (const w of e.warmupSets) t += warmupSetSec(w, e.unilateral);
  const us = units(s);
  for (const u of us) {
    if (u.length === 1) {
      const e = u[0];
      t += e.sets * tExec(e) + (e.sets - 1) * e.restSec;
    } else {
      const sets = Math.max(...u.map((e) => e.sets));
      const rest = Math.max(...u.map((e) => e.restSec));
      t += sets * (u.reduce((a, e) => a + tExec(e), 0) + TIME.supersetTransitionSec * (u.length - 1)) + (sets - 1) * rest;
    }
  }
  t += TIME.transitionSec * Math.max(0, us.length - 1) + TIME.transitionSec;
  return t;
}

const PAIRS: { id: 'P1' | 'P2' | 'P3'; a: SlotKey; b: SlotKey }[] = [
  { id: 'P1', a: 'poussee_2', b: 'tirage_2' },
  { id: 'P2', a: 'tirage_1', b: 'poussee_2' },
  { id: 'P3', a: 'jambes_2', b: 'tronc' },
];
const NEVER_PAIRED: readonly SlotKey[] = ['jambes_genou', 'poussee_1', 'charniere'];
const LEG_SLOTS: readonly SlotKey[] = ['jambes_genou', 'jambes_2'];

/** V-SUP : paire permise ? (liste fermée, interdits pour toutes les familles et tous les niveaux). */
export function canPair(s: DurSession, id: 'P1' | 'P2' | 'P3'): boolean {
  if (s.pregnant) return false;
  const p = PAIRS.find((x) => x.id === id)!;
  if (id === 'P2' && s.exercises.some((e) => e.supersetGroup?.endsWith('P1'))) return false;
  const a = s.exercises.find((e) => e.slot === p.a);
  const b = s.exercises.find((e) => e.slot === p.b);
  if (!a || !b || a.supersetGroup || b.supersetGroup) return false;
  for (const e of [a, b]) {
    if (NEVER_PAIRED.includes(e.slot)) return false;
    if (e.capped || e.adaptations.length > 0 || e.replaces) return false;
  }
  if (LEG_SLOTS.includes(a.slot) && LEG_SLOTS.includes(b.slot)) return false;
  if (a.musclesPrincipaux.some((m) => b.musclesPrincipaux.includes(m))) return false;
  if (id === 'P3' && s.level === 'debutant' && a.chargeable) return false;
  return true;
}

function formPair<E extends DurExercise>(s: DurSession<E>, id: 'P1' | 'P2' | 'P3'): boolean {
  if (!canPair(s, id)) return false;
  const p = PAIRS.find((x) => x.id === id)!;
  const g = `${s.label}-${id}`;
  s.exercises = s.exercises.map((e) => (e.slot === p.a || e.slot === p.b ? { ...e, supersetGroup: g } : e));
  // La paire garde la place du premier exercice (V-ORDRE).
  const first = s.exercises.findIndex((e) => e.slot === p.a);
  const second = s.exercises.find((e) => e.slot === p.b)!;
  const rest = s.exercises.filter((e) => e.slot !== p.b);
  rest.splice(rest.findIndex((e) => e.slot === p.a) + 1, 0, second);
  if (first >= 0) s.exercises = rest;
  return true;
}

/** Forme P1, P2, P3 si permises (option « gagner du temps »). */
export function formAllPairs<E extends DurExercise>(s: DurSession<E>): DurSession<E> {
  const c = { ...s, exercises: [...s.exercises] };
  for (const id of ['P1', 'P2', 'P3'] as const) formPair(c, id);
  return c;
}

function removeSlot<E extends DurExercise>(s: DurSession<E>, slot: SlotKey): boolean {
  const e = s.exercises.find((x) => x.slot === slot);
  if (!e) return false;
  s.exercises = s.exercises
    .filter((x) => x !== e)
    .map((x) => (e.supersetGroup && x.supersetGroup === e.supersetGroup ? { ...x, supersetGroup: null } : x));
  return true;
}

export interface AdjustResult<E extends DurExercise> {
  session: DurSession<E>;
  /** Actions appliquées, dans l'ordre (pour les tests et l'explication). */
  actions: string[];
  removedCore: SlotKey[];
  removedAccessory: SlotKey[];
  /** T > D même réduite aux piliers (seul cas toléré, V-MSG-DUREE avec la durée réelle). */
  overBudget: boolean;
  trace: number[];
}

/** V-DUREE : tant que T > D, appliquer la prochaine action (1 à 6), recalculer ; jamais retirer un pilier ni E1, ni raccourcir un repos. */
export function ajusterDuree<E extends DurExercise>(s0: DurSession<E>, dSec: number): AdjustResult<E> {
  const s: DurSession<E> = { ...s0, exercises: [...s0.exercises] };
  const actions: string[] = [];
  const removedCore: SlotKey[] = [];
  const removedAccessory: SlotKey[] = [];
  const trace = [estimerDuree(s)];
  const steps: [string, () => boolean][] = [
    ...(['P1', 'P2', 'P3'] as const).map((id) => [`paire:${id}`, () => formPair(s, id)] as [string, () => boolean]),
    ...ACCESSORY_REMOVAL_ORDER.map(
      (slot) => [`retrait:${slot}`, () => removeSlot(s, slot as SlotKey) && (removedAccessory.push(slot as SlotKey), true)] as [string, () => boolean],
    ),
    [
      'series:2',
      () => {
        let changed = false;
        s.exercises = s.exercises.map((e) => {
          if (e.role !== 'pilier' && e.sets > 2) {
            changed = true;
            return { ...e, sets: 2 };
          }
          return e;
        });
        return changed;
      },
    ],
    [
      'e3:75',
      () => {
        let changed = false;
        s.exercises = s.exercises.map((e) => {
          const ws = e.warmupSets.filter((w) => w.percent !== WARMUP.e3HeavyPercent);
          if (ws.length !== e.warmupSets.length) {
            changed = true;
            return { ...e, warmupSets: ws };
          }
          return e;
        });
        return changed;
      },
    ],
    [
      'echauffement:court',
      () => {
        if (s.e1Sec <= WARMUP.generalReducedSec && s.e2Count <= WARMUP.mobilityReducedCount) return false;
        s.e1Sec = Math.min(s.e1Sec, WARMUP.generalReducedSec);
        s.e2Count = Math.min(s.e2Count, WARMUP.mobilityReducedCount);
        return true;
      },
    ],
    ...(CORE_REMOVAL_ORDER[s.days][s.label] ?? []).map(
      (slot) => [`retrait:${slot}`, () => removeSlot(s, slot as SlotKey) && (removedCore.push(slot as SlotKey), true)] as [string, () => boolean],
    ),
  ];
  for (const [name, step] of steps) {
    if (estimerDuree(s) <= dSec) break;
    if (step()) {
      actions.push(name);
      trace.push(estimerDuree(s));
    }
  }
  return { session: s, actions, removedCore, removedAccessory, overBudget: estimerDuree(s) > dSec, trace };
}
