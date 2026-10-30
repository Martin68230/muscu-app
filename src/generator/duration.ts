// Durée estimée et ajustement (V-DUREE §4.4) ; supersets antagonistes (V-SUP §4.2).
// Fonctions pures sur une forme minimale de séance, utilisables avec des séances construites à la main (T3c, T25).
import type { ExerciseRole, ExerciseUnit, Level, WarmupSet } from '../data/model';
import {
  ACCESSORY_REMOVAL_ORDER_V2, CORE_OUT_OF_FLOOR_IDS, CORE_REMOVAL_ORDER, CORE_SAFE_FAMILIES, CORE_WHEEL_IDS, HEAVY_TAGS_B1, P3_LEG_ALLOWED_TAGS,
  SUPERSET_FORBIDDEN_SCHEMAS, SUPERSET_MIN_REST_SEC, SUPERSET_SLOTS, TIME, WARMUP, type CoreFamily,
} from './config';
import { TYPE_NOYAU, typeOf } from './split';
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
  /** D26 (SUP-0 à SUP-5) : inconnus = jamais apparié (lecture prudente). */
  schema?: string;
  ficheId?: string;
  tags?: string[];
  coreFamily?: CoreFamily | null;
  niveau?: Level;
  backLoaded?: boolean;
}
export interface DurSession<E extends DurExercise = DurExercise> {
  /** 'A' | 'B' | 'C' (corps entier) ou '<TYPE>-<gabarit>' (D25 : HAUT-A, BAS-B…). */
  label: string;
  /** Séances de force de la semaine (1 à 6). */
  days: number;
  /**
   * SUP-10 : muscles principaux de la séance de musculation planifiée la veille (jour calendaire précédent) ; absent ou [] = aucune
   * séance de musculation la veille ; null = inconnu (doute) : aucune paire.
   */
  veille?: string[] | null;
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
      const rest = pairRestSec(u);
      t += sets * (u.reduce((a, e) => a + tExec(e), 0) + TIME.supersetTransitionSec * (u.length - 1)) + (sets - 1) * rest;
    }
  }
  t += TIME.transitionSec * Math.max(0, us.length - 1) + TIME.transitionSec;
  return t;
}

/** SUP-6 : repos d'une paire = le plus long des deux, jamais moins de 60 s (SUPERSET_MIN_REST_SEC). */
export function pairRestSec(u: readonly Pick<DurExercise, 'restSec'>[]): number {
  const rest = Math.max(...u.map((e) => e.restSec));
  return u.length > 1 ? Math.max(rest, SUPERSET_MIN_REST_SEC) : rest;
}

/** D26 : paires fermées P1 et P3 (P2 supprimée, P4 barrée : core-et-supersets.md §4.1). */
export type PairId = 'P1' | 'P3';
const PAIRS: { id: PairId; a: SlotKey; b: SlotKey }[] = [
  { id: 'P1', a: 'poussee_2', b: 'tirage_2' },
  { id: 'P3', a: 'jambes_2', b: 'tronc' },
];
const LEG_SLOTS: readonly SlotKey[] = ['jambes_genou', 'jambes_2'];

/** SUP-0 : un exercice peut-il entrer dans une paire ? (définition fermée ; tout ce qui échoue est interdit, SUP-3). */
export function pairEligible(e: DurExercise): boolean {
  if (!SUPERSET_SLOTS.includes(e.slot)) return false; // point 1 : accessoires seulement (jamais pilier, charnière, tirage_1)
  if (e.capped || e.adaptations.length > 0 || e.replaces) return false; // point 5, SUP-2 point 5, SUP-9
  if (!e.tags || !e.schema) return false; // matériel ou schéma inconnu : jamais apparié (lecture prudente)
  if (e.tags.some((t) => HEAVY_TAGS_B1.includes(t))) return false; // point 2 : liste B1
  if (SUPERSET_FORBIDDEN_SCHEMAS.includes(e.schema)) return false; // point 3 : poussee_v, saut, porte, cardio
  if (e.niveau === 'avance') return false; // SUP-3 : niveau avancé
  if (e.ficheId && CORE_OUT_OF_FLOOR_IDS.includes(e.ficheId)) return false; // inventaire : extension-dorsale-ballon jamais en paire
  return true;
}

/** V-SUP resserré par D26 (SUP-0 à SUP-5, SUP-9) : paire permise ? */
export function canPair(s: DurSession, id: PairId): boolean {
  if (s.pregnant) return false; // SUP-9
  if (s.level === 'debutant') return false; // SUP-4 : aucun superset pour un débutant
  if (s.veille === null) return false; // SUP-10 : veille inconnue -> pas de paire (lecture prudente)
  const p = PAIRS.find((x) => x.id === id)!;
  const a = s.exercises.find((e) => e.slot === p.a);
  const b = s.exercises.find((e) => e.slot === p.b);
  if (!a || !b || a.supersetGroup || b.supersetGroup) return false;
  if (!pairEligible(a) || !pairEligible(b)) return false;
  if (LEG_SLOTS.includes(a.slot) && LEG_SLOTS.includes(b.slot)) return false; // SUP-2 point 2
  if (a.musclesPrincipaux.some((m) => b.musclesPrincipaux.includes(m))) return false; // SUP-1 (OK, S-SUP)
  // SUP-10 : aucun muscle principal de la paire n'est muscle principal d'un exercice de la séance de la veille.
  if (s.veille && [...a.musclesPrincipaux, ...b.musclesPrincipaux].some((m) => s.veille!.includes(m))) return false;
  if (a.schema === b.schema) return false; // SUP-5
  if (a.coreFamily && b.coreFamily) return false; // SUP-2 points 3 et 4 : core + core, même famille
  const core = a.coreFamily ? a : b.coreFamily ? b : null;
  if (core) {
    const other = core === a ? b : a;
    // P3 : core CF1 ou CF2, jamais roue abdominale ; SUP-2 point 4 : jamais avec une charnière, un rowing penché, une fiche
    // dont la ligne dos n'est pas « garder » (inconnu : refusé).
    if (!CORE_SAFE_FAMILIES.includes(core.coreFamily!) || CORE_WHEEL_IDS.includes(core.ficheId ?? '')) return false;
    if (other.schema === 'charniere' || (other.ficheId ?? '').startsWith('rowing') || other.backLoaded !== false) return false;
  }
  if (id === 'P1' && a.schema !== 'poussee_h') return false; // P1 : poussée horizontale ou inclinée, jamais poussee_v
  // P3 plus strict que SUP-0 : jambes_2 au poids du corps ou à l'élastique seulement (aucune charge, haltères compris).
  if (id === 'P3' && (a.chargeable || !a.tags!.every((t) => P3_LEG_ALLOWED_TAGS.includes(t)))) return false;
  return true;
}

function formPair<E extends DurExercise>(s: DurSession<E>, id: PairId): boolean {
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

/** Forme P1 puis P3 si permises (option « gagner du temps »). */
export function formAllPairs<E extends DurExercise>(s: DurSession<E>): DurSession<E> {
  const c = { ...s, exercises: [...s.exercises] };
  for (const id of ['P1', 'P3'] as const) formPair(c, id);
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

/**
 * V-DUREE : tant que T > D, appliquer la prochaine action (1 à 6), recalculer ; jamais retirer un pilier ni E1, ni raccourcir un repos.
 * D26 (CORE-TPS-1) : après les accessoires et l'échauffement, le tronc AU-DELÀ du plancher est raccourci (2 -> 1 série) puis retiré,
 * avant la charnière et tirage_1 ; un tronc qui fait partie du plancher (`coreProtected`) n'est jamais retiré.
 */
export function ajusterDuree<E extends DurExercise>(s0: DurSession<E>, dSec: number, opts: { coreProtected?: boolean } = {}): AdjustResult<E> {
  const s: DurSession<E> = { ...s0, exercises: [...s0.exercises] };
  const actions: string[] = [];
  const removedCore: SlotKey[] = [];
  const removedAccessory: SlotKey[] = [];
  const trace = [estimerDuree(s)];
  const type = typeOf(s.label);
  // D25 (§1.1) : accessoires par indice décroissant ; le noyau du type n'est jamais retiré (STR-REP-4). Corps entier : ordre existant
  // (fonctionnel, jambes_2, tirage_2, poussee_2) puis action 6 sur le noyau (CORE_REMOVAL_ORDER ; 1 jour : ligne de 2 jours).
  const accessories = ACCESSORY_REMOVAL_ORDER_V2.filter((x) => !TYPE_NOYAU[type].includes(x as SlotKey));
  const coreOrder = type === 'CE' ? (CORE_REMOVAL_ORDER[s.days <= 2 ? 2 : 3][s.label] ?? []) : [];
  const steps: [string, () => boolean][] = [
    ...(['P1', 'P3'] as const).map((id) => [`paire:${id}`, () => formPair(s, id)] as [string, () => boolean]),
    ...accessories.map(
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
    ...(opts.coreProtected
      ? []
      : ([
          [
            'tronc:1serie',
            () => {
              const e = s.exercises.find((x) => x.slot === 'tronc');
              if (!e || e.sets <= 1) return false;
              s.exercises = s.exercises.map((x) => (x === e ? { ...x, sets: 1 } : x));
              return true;
            },
          ],
          ['retrait:tronc', () => removeSlot(s, 'tronc') && (removedCore.push('tronc'), true)],
        ] as [string, () => boolean][])),
    ...coreOrder.map(
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
