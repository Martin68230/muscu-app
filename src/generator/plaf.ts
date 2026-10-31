// V-PLAF (generateur-v1.md §3.4, STR-REP-3 / STR-REP-4) et D33 (knowledge/programmes-v3.md §5, PV3-PLAF-1, avis du kiné K-01) :
// plafond de séries fractionnaires par muscle et par séance. 10 pour le débutant, la famille santé, la grossesse / le post-partum ;
// 12 pour l'intermédiaire et l'avancé avec quatre garde-fous (NON SOURCÉ) :
//   G1 : 10 pour un muscle principal d'une fiche qui porte une ligne de zone dont la zone est au niveau >= 1 ;
//   G2 : le 12e seulement par un emplacement prévu (STR-REP) ; ajouts automatiques (V-VOL « +1 série », isolation) : 11 ;
//   G3 : au plus 2 charnières par séance, la seconde sans charge (lecture restrictive de « charge légère ou poids du corps ») ;
//   G4 : semaine allégée (ctx.lightWeek, point d'extension) et reprise (ctx.repriseActive) : 10.
// Le plafond hebdomadaire de 20 (V-VOL, weekCapsOk) reste prioritaire. Valeurs : VOLUME (config.ts).
import { CHARGEABLE_TAGS, FIXED_LOAD_TAGS, VOLUME } from './config';
import type { Ctx } from './context';
import type { GenExercise } from './types';

type Ex = Pick<GenExercise, 'sets' | 'musclesPrincipaux' | 'musclesSecondaires' | 'schema' | 'slot' | 'ficheId' | 'tags'>;

export const frac = (e: Pick<GenExercise, 'musclesPrincipaux' | 'musclesSecondaires'>, m: string): number => {
  const match = (x: string) => (m === 'deltoides' ? x.startsWith(VOLUME.deltoidPrefix) : x === m);
  if (e.musclesPrincipaux.some(match)) return 1;
  if (e.musclesSecondaires.some(match)) return VOLUME.secondaryWeight;
  return 0;
};
export const sessionVol = (s: { exercises: readonly Ex[] }, m: string) => s.exercises.reduce((a, e) => a + e.sets * frac(e, m), 0);
export const musclesOf = (s: { exercises: readonly Ex[] }[]) =>
  [...new Set(s.flatMap((x) => x.exercises.flatMap((e) => [...e.musclesPrincipaux, ...e.musclesSecondaires])))].sort();
const workSets = (s: { exercises: readonly Ex[] }) => s.exercises.reduce((a, e) => a + e.sets, 0);

/** G2 : 'slot' = emplacement prévu par STR-REP (placement, ajout §4.4) ; 'auto' = « +1 série » de V-VOL ou isolation. */
export type PlafMode = 'slot' | 'auto';
export interface Plaf {
  /** Plafond de séries fractionnaires pour un muscle, compte tenu des exercices de la séance (G1). */
  cap(exercises: readonly Ex[], muscle: string): number;
}

/** Plafond de base du profil (avant G1). */
export function basePlaf(ctx: Pick<Ctx, 'level' | 'family' | 'pregnant' | 'repriseActive' | 'lightWeek'>, mode: PlafMode): number {
  if (ctx.level === 'debutant' || ctx.family === 'sante' || ctx.pregnant || ctx.repriseActive || ctx.lightWeek) return VOLUME.maxPerMuscleSession;
  return mode === 'slot' ? VOLUME.maxPerMuscleSessionSlots : VOLUME.maxPerMuscleSessionAuto;
}

/** G1 : la fiche porte une ligne pour une zone gênée (niveau >= 1) ; lecture restrictive : toute ligne, quelle que soit sa case. */
function touchesSensitiveZone(ficheId: string, ctx: Ctx): boolean {
  const f = ctx.fichesById.get(ficheId);
  if (!f) return false;
  return ctx.zones.some((z) => !z.isG && z.level >= 1 && Object.prototype.hasOwnProperty.call(f.securite.zones, z.key));
}

export function makePlaf(ctx: Ctx, mode: PlafMode): Plaf {
  const base = basePlaf(ctx, mode);
  return {
    cap(exercises, muscle) {
      if (base <= VOLUME.maxPerMuscleSession) return base;
      const sensitive = exercises.some((e) => frac(e, muscle) === 1 && touchesSensitiveZone(e.ficheId, ctx));
      return sensitive ? VOLUME.maxPerMuscleSession : base;
    },
  };
}

const loadFree = (e: Ex) => !e.tags.some((t) => CHARGEABLE_TAGS.includes(t) || FIXED_LOAD_TAGS.includes(t));

/** G3 : au plus 2 charnières ; la charnière hors emplacement `charniere` (ou la seconde) doit être sans charge. */
export function hingesOk(exercises: readonly Ex[]): boolean {
  const hinges = exercises.filter((e) => e.schema === 'charniere');
  if (hinges.length > VOLUME.maxHingesPerSession) return false;
  if (hinges.length < 2) return true;
  const first = hinges.find((e) => e.slot === 'charniere') ?? hinges[0];
  return hinges.filter((e) => e !== first).every(loadFree);
}

export function sessionCapsOk(s: { exercises: readonly Ex[] }, p: Plaf): boolean {
  if (s.exercises.length > VOLUME.maxExercisesPerSession) return false;
  if (workSets(s) > VOLUME.maxWorkSetsPerSession) return false;
  if (!hingesOk(s.exercises)) return false;
  return musclesOf([s]).every((m) => sessionVol(s, m) <= p.cap(s.exercises, m));
}

const isBack = (e: Ex) => e.schema === 'tirage_h' || e.schema === 'tirage_v' || e.musclesPrincipaux.some((m) => m === 'grand_dorsal' || m === 'rhomboides');

/**
 * D25 (STR-REP-4, lecture la plus prudente) : en plus de V-PLAF, tous les tirages comptent pour « le dos » ; même plafond (G1 : 10 si un
 * tirage porte une ligne de zone gênée). D33 : 4 tirages de 3 séries en PULL deviennent possibles à 12 (PV3-PLAF-1, T-D33-22).
 */
export function splitCapsOk(exercises: readonly Ex[], p: Plaf): boolean {
  if (!sessionCapsOk({ exercises }, p)) return false;
  const backEx = exercises.filter(isBack);
  const back = backEx.reduce((a, e) => a + e.sets, 0);
  const cap = Math.min(...['grand_dorsal', 'rhomboides'].map((m) => p.cap(backEx.map((e) => ({ ...e, musclesPrincipaux: [m], musclesSecondaires: [] })), m)));
  return back <= cap;
}

export function weekCapsOk(ss: { exercises: readonly Ex[] }[]): boolean {
  return musclesOf(ss).every((m) => ss.reduce((a, s) => a + sessionVol(s, m), 0) <= VOLUME.maxPerMuscleWeek);
}
