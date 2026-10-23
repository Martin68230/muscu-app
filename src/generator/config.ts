// Réglages du générateur v1 (knowledge/generateur-v1.md §10.1, CLAUDE.md règle 10).
//
// TOUTES les valeurs chiffrées NON SOURCÉ ou PROVISOIRE utilisées par le générateur sont ici, avec la règle
// V-… et leur statut en commentaire. La logique (src/generator/*.ts) ne contient aucune valeur sportive en dur :
// changer un réglage ici ne demande pas de toucher au code.
// Statuts : OK = sourcé (SRC1-SRC15 de generateur-v1.md §0) ; PROVISOIRE ; NON SOURCÉ = choix de conception.
// Les cinq « choix par défaut prudents, en attente de l'utilisateur » (§10.1) sont marqués DÉFAUT-1 à DÉFAUT-5.

import type { Level } from '../data/model';

export type Family = 'muscle' | 'force' | 'sante';

// ---------------------------------------------------------------------------------------------
// Périmètre et valeurs par défaut (V-PER §1.2, V-DEF §9)
// ---------------------------------------------------------------------------------------------
/** V-PER : jours par semaine gérés en v1 (phase-2-criteres F1). */
export const SUPPORTED_DAYS: readonly number[] = [2, 3];
/** V-DEF : niveau absent -> débutant. NON SOURCÉ (prudence). */
export const DEFAULT_LEVEL: Level = 'debutant';
/** V-DEF : objectif absent -> famille sante. NON SOURCÉ. */
export const DEFAULT_FAMILY: Family = 'sante';
/** V-DEF : durée absente -> 45 min. NON SOURCÉ. */
export const DEFAULT_DURATION_MIN = 45;
/** V-PER / V-DEF : durée < 20 min ramenée à 20. NON SOURCÉ. */
export const MIN_DURATION_MIN = 20;
/** V-DEF : « sans limite » = N de départ 7, durée cible 60 min affichée, plafond 75 min. NON SOURCÉ. */
export const UNLIMITED = { startN: 7, targetMin: 60, capMin: 75 } as const;
/** Durées proposées (profile-setup.ts) : sert à proposer « allonger la séance à X min » (V-MSG-FREQ). */
export const DURATION_STEPS_MIN: readonly number[] = [20, 30, 45, 60, 75];

// ---------------------------------------------------------------------------------------------
// Objectifs (V-OBJ §1.3) — correspondance NON SOURCÉ
// ---------------------------------------------------------------------------------------------
/** Objectif de rang 1 -> famille v1. `perte_gras` -> muscle : DÉFAUT-4 (en attente de l'utilisateur). */
export const GOAL_FAMILY: Record<string, Family> = {
  muscle: 'muscle',
  force: 'force',
  perte_gras: 'muscle', // DÉFAUT-4, NON SOURCÉ
  sante: 'sante',
  forme: 'sante',
  cardio: 'sante',
  endurance: 'sante',
  sport: 'sante',
  mobilite: 'sante',
  fonctionnel: 'sante',
};
/** Objectifs qui ont leur propre famille (pas de préfixe « en attendant la version dédiée », V-EXPL). */
export const NATIVE_GOALS: readonly string[] = ['muscle', 'force', 'sante', 'forme'];
/** Objectifs qui activent l'emplacement 9 `fonctionnel` (§2.2). NON SOURCÉ. */
export const GOALS_WITH_FONCTIONNEL: readonly string[] = ['mobilite', 'fonctionnel'];

// ---------------------------------------------------------------------------------------------
// Répartition, bloc, jours (V-ROT §2.3, V-JOURS §2.4)
// ---------------------------------------------------------------------------------------------
/** V-ROT : bloc de 4 semaines avec les mêmes fiches. DÉFAUT-3, NON SOURCÉ. */
export const BLOCK_WEEKS = 4;
/** V-JOURS : écart minimal entre deux séances corps entier (jours). ~48 h : PROVISOIRE (ACSM via synthèses). */
export const MIN_GAP_DAYS = 2;

// ---------------------------------------------------------------------------------------------
// Grands groupes et emplacements (V-GG §2.1, V-EMP §2.2) — découpage NON SOURCÉ
// ---------------------------------------------------------------------------------------------
export type GG = 'GG1' | 'GG2' | 'GG3' | 'GG4' | 'GG5';
export const GG_LIST: readonly GG[] = ['GG1', 'GG2', 'GG3', 'GG4', 'GG5'];
export const TRONC_SCHEMAS: readonly string[] = ['gainage', 'anti_rotation', 'rotation'];
/** Seuil V-FREQ : chaque grand groupe au moins 2 fois par semaine (SRC1, SRC13 : OK). */
export const FREQ_MIN_PER_WEEK = 2;
/** N de départ selon la durée choisie (V-DUREE §4.4). NON SOURCÉ. Clé = durée minimale du palier. */
export const START_N_BY_DURATION: readonly [number, number][] = [
  [20, 5],
  [30, 5],
  [45, 6],
  [60, 7],
  [75, 8],
];
/** Ordre de retrait du noyau, action 6 (V-DUREE §4.4). NON SOURCÉ. */
export const CORE_REMOVAL_ORDER: Record<2 | 3, Record<string, readonly string[]>> = {
  2: { A: ['tronc', 'charniere', 'tirage_1'], B: ['tronc', 'charniere', 'tirage_1'] },
  3: {
    A: ['tronc', 'charniere', 'tirage_1'],
    B: ['charniere', 'tirage_1', 'tronc'],
    C: ['tirage_1', 'tronc', 'charniere'],
  },
};
/** Action 2 : ordre de retrait des emplacements accessoires. NON SOURCÉ. */
export const ACCESSORY_REMOVAL_ORDER: readonly string[] = ['fonctionnel', 'jambes_2', 'tirage_2', 'poussee_2'];

// ---------------------------------------------------------------------------------------------
// Doses (V-DOSE §3.2) — fourchettes OK (SRC1, SRC2, SRC4, SRC5, SRC9), valeurs exactes NON SOURCÉ / PROVISOIRE
// ---------------------------------------------------------------------------------------------
export interface DoseRow {
  setsPilier: number;
  setsAutre: number;
  /** Répétitions, variante chargeable (autres que piliers). */
  repsCharge: [number, number];
  /** Répétitions des piliers chargeables (si différent de repsCharge). */
  repsChargePilier?: [number, number];
  /** Répétitions au poids du corps ou à l'élastique. Borne haute 15 : PROVISOIRE (SRC7, SRC9). */
  repsBodyweight: [number, number];
  /** Réserve cible (RIR). Jamais 0 en v1 (SRC1, OK). */
  rir: number;
  /** Avancé, famille muscle : RIR sur variantes « sûres » (machine, poulie, élastique, poids du corps). SRC6 OK ; restriction NON SOURCÉ. */
  rirSafeVariants?: number;
  restPilierSec: number;
  restAutreSec: number;
}
export const DOSE: Record<Family, Record<Level, DoseRow>> = {
  muscle: {
    // séries débutant à 2 : NON SOURCÉ ; réserve 3 débutant : NON SOURCÉ ; repos 90 s : SRC4/SRC2 OK
    debutant: { setsPilier: 2, setsAutre: 2, repsCharge: [10, 12], repsBodyweight: [10, 15], rir: 3, restPilierSec: 90, restAutreSec: 90 },
    intermediaire: { setsPilier: 3, setsAutre: 3, repsCharge: [8, 12], repsBodyweight: [10, 15], rir: 2, restPilierSec: 120, restAutreSec: 90 },
    avance: { setsPilier: 3, setsAutre: 3, repsCharge: [8, 12], repsBodyweight: [10, 15], rir: 2, rirSafeVariants: 1, restPilierSec: 120, restAutreSec: 90 },
  },
  force: {
    // force débutant 6-10 : NON SOURCÉ ; piliers 4-6 : PROVISOIRE (≈ charges lourdes, SRC1/SRC9), 4 plutôt que 1-3 : NON SOURCÉ
    debutant: { setsPilier: 2, setsAutre: 2, repsCharge: [6, 10], repsBodyweight: [10, 15], rir: 3, restPilierSec: 120, restAutreSec: 90 },
    intermediaire: { setsPilier: 3, setsAutre: 2, repsCharge: [8, 12], repsChargePilier: [4, 6], repsBodyweight: [10, 15], rir: 2, restPilierSec: 180, restAutreSec: 90 },
    avance: { setsPilier: 3, setsAutre: 2, repsCharge: [8, 12], repsChargePilier: [4, 6], repsBodyweight: [10, 15], rir: 2, restPilierSec: 180, restAutreSec: 120 },
  },
  sante: {
    // santé 10-15, 2 séries : dans les fourchettes (OK), choix précis NON SOURCÉ ; repos 60-90 s : NON SOURCÉ
    debutant: { setsPilier: 2, setsAutre: 2, repsCharge: [10, 15], repsBodyweight: [10, 15], rir: 3, restPilierSec: 90, restAutreSec: 60 },
    intermediaire: { setsPilier: 2, setsAutre: 2, repsCharge: [10, 15], repsBodyweight: [10, 15], rir: 3, restPilierSec: 90, restAutreSec: 60 },
    avance: { setsPilier: 3, setsAutre: 2, repsCharge: [8, 12], repsBodyweight: [10, 15], rir: 2, restPilierSec: 90, restAutreSec: 60 },
  },
};
/** Tags qui rendent une variante « chargeable » (V-DOSE §3.2). */
export const CHARGEABLE_TAGS: readonly string[] = [
  'halteres', 'kettlebell', 'barre', 'barre_ez', 'disques', 'machine', 'poulie', 'sac_a_dos', 'bidons_ou_sacs', 'lest',
];
/** Variantes « sûres » pour la réserve 1 (avancé, muscle) : chargées seulement par ces tags. NON SOURCÉ. */
export const SAFE_LOAD_TAGS: readonly string[] = ['machine', 'poulie'];

// ---------------------------------------------------------------------------------------------
// Exercices à durée ou par côté (V-TEMPS §3.3) — NON SOURCÉ en entier ; DÉFAUT-2 (gainage 20-30 s, porté 30-40 s, 2 séries)
// ---------------------------------------------------------------------------------------------
export interface TempsRow {
  unit: 'sec' | 'reps' | 'reps_par_cote';
  debutant: { holdSec?: number; reps?: [number, number] };
  autres: { holdSec?: number; reps?: [number, number] };
  sets: number;
  restSec: number;
}
export const TEMPS: Record<string, TempsRow> = {
  gainage: { unit: 'sec', debutant: { holdSec: 20 }, autres: { holdSec: 30 }, sets: 2, restSec: 60 }, // DÉFAUT-2
  anti_rotation: { unit: 'reps_par_cote', debutant: { reps: [6, 8] }, autres: { reps: [8, 10] }, sets: 2, restSec: 60 },
  rotation: { unit: 'reps_par_cote', debutant: { reps: [8, 10] }, autres: { reps: [10, 12] }, sets: 2, restSec: 60 },
  porte: { unit: 'sec', debutant: { holdSec: 30 }, autres: { holdSec: 40 }, sets: 2, restSec: 60 }, // DÉFAUT-2
  hanche_laterale: { unit: 'reps', debutant: { reps: [10, 15] }, autres: { reps: [12, 15] }, sets: 2, restSec: 60 },
  cheville_mollet: { unit: 'reps', debutant: { reps: [10, 15] }, autres: { reps: [12, 15] }, sets: 2, restSec: 60 },
};
/**
 * V-TEMPS : « pas de RIR demandé » pour ces schémas. PlannedExercise.rirTarget est un nombre : on y met cette valeur
 * (jamais 0, T32) et `rirAsked = false` dit au lecteur de séance de ne pas poser la question. NON SOURCÉ.
 */
export const TEMPS_RIR_PLACEHOLDER = 3;

// ---------------------------------------------------------------------------------------------
// Plafonds de sécurité (V-PRIO §6.0 : P-CAP, P-GROS, P-ZONE3)
// ---------------------------------------------------------------------------------------------
/** P-GROS (G5 : repères HAS OK, codage PROVISOIRE ; « famille ramenée à sante » NON SOURCÉ). */
export const PREGNANCY = {
  family: 'sante' as Family,
  reps: [10, 15] as [number, number],
  minRir: 3,
  setsDebutant: 1,
  setsOther: 2,
  maxDurationMin: 60,
};
/** DÉFAUT-5 : sous plafond (R2, charge:legere, grossesse), variante sans historique : échelon le plus bas et charge la plus légère. */
export const CAPPED_LOWEST_START = true;
/** P-ZONE3 : nombre d'emplacements du noyau vides (cause zones niveau 3) qui fait refuser le programme. NON SOURCÉ. */
export const P_ZONE3_MAX_EMPTY_CORE = 3;
/** Niveau de priorité donné à la ligne Grossesse quand deux `adapter: variante:` s'opposent (V-GROS). NON SOURCÉ (prudence : la grossesse gagne). */
export const PREGNANCY_CASE_PRIORITY = 4;

// ---------------------------------------------------------------------------------------------
// Volume (V-VOL §3.4, V-PLAF)
// ---------------------------------------------------------------------------------------------
export const VOLUME = {
  /** Muscles suivis en famille muscle (liste NON SOURCÉ ; seuil 10 : SRC1 OK). */
  muscles: ['quadriceps', 'fessiers', 'ischios', 'pectoraux', 'grand_dorsal'] as readonly string[],
  /** Les `deltoides_*` sont comptés ensemble. */
  deltoidPrefix: 'deltoides_',
  targetMuscle: 10,
  /** Méthode fractionnaire (SRC3, préprint : PROVISOIRE) : principal = 1, secondaire = 0,5. */
  secondaryWeight: 0.5,
  /** Plafond hebdomadaire par muscle : seuil SRC1 OK, usage comme plafond NON SOURCÉ. */
  maxPerMuscleWeek: 20,
  /** V-PLAF : séries fractionnaires par muscle et par séance (SRC3 : PROVISOIRE). */
  maxPerMuscleSession: 10,
  /** V-PLAF : exercices et séries de travail par séance, séries par exercice. NON SOURCÉ. */
  maxExercisesPerSession: 8,
  maxWorkSetsPerSession: 24,
  maxSetsPerExercise: 4,
  /** Minimum de séries du « noyau » (§4.4 action 7, SRC1 : au moins 2 séries). */
  minSets: 2,
};

// ---------------------------------------------------------------------------------------------
// Échauffement (V-ECH §4.3) — contenu, durées et pourcentages NON SOURCÉ ; principe E3 : SRC11, SRC2 OK
// ---------------------------------------------------------------------------------------------
export const WARMUP = {
  generalSec: 120,
  generalReducedSec: 60,
  mobilitySecEach: 45,
  mobilityCount: 2,
  mobilityReducedCount: 1,
  e3RestSec: 45,
  e3LightReps: 8,
  e3LightPercent: 50,
  e3HeavyReps: 3,
  e3HeavyPercent: 75,
  /** 2e série E3 seulement si répétitions cibles <= 6 et aucun plafond. */
  e3HeavyIfRepsMaxAtMost: 6,
  e3BodyweightReps: 6,
  /** E1 : variantes cardio sans saut, dans cet ordre (ids de variantes). */
  cardioVariants: ['marche-rapide-continue', 'montees-genoux-marche', 'jumping-jacks-sans-saut', 'boxe-vide-lente', 'pas-chasses-lents'],
  mobilityLegs: ['mobilite-cheville-au-mur', 'mobilite-hanches-90-90'],
  mobilityUpper: ['glissement-mur-epaules', 'cercles-de-bras', 'extension-thoracique'],
  mobilityHinge: ['chat-vache'],
  /** V-COU : fiche douce cou (niveaux 1-2), la première qui passe les filtres. */
  neckSoft: ['rotation-douce-cou', 'inclinaison-douce-cou', 'retraction-cervicale'],
  cooldown: ['etirement-fessiers-figure-4', 'etirement-pectoraux-mur'],
};

// ---------------------------------------------------------------------------------------------
// Durée (V-DUREE §4.4) — NON SOURCÉ (4 s dans la fourchette 2-6 s de SRC1/SRC2)
// ---------------------------------------------------------------------------------------------
export const TIME = {
  secPerRep: 4,
  unilateralFactor: 2,
  unilateralExtraSec: 10,
  transitionSec: 60,
  supersetTransitionSec: 15,
  /** « Ajout » : si T < D - 10 min et N < 8. */
  addIfUnderMarginSec: 600,
  displayRoundMin: 5,
};
/** « Unilatéral » = id ou nom de variante contenant un de ces mots (à remplacer par un champ `unilateral` de fiche). */
export const UNILATERAL_MARKERS: readonly string[] = ['un-bras', 'une-jambe', 'unijambiste', 'un-haltere', 'bulgare', 'fente'];

// ---------------------------------------------------------------------------------------------
// Choix de la variante (V-ECHELON §6.3) — NON SOURCÉ
// ---------------------------------------------------------------------------------------------
/** DÉFAUT-1 : intermédiaire = un échelon sous le plus haut de son niveau. */
export const INTERMEDIATE_ECHELON_OFFSET = 1;
/** Départage à échelon égal, familles force/muscle : ordre des tags (equipment-taxonomy.md §3). */
export const TAG_ORDER: readonly string[] = ['barre', 'halteres', 'kettlebell', 'machine', 'poulie', 'elastique'];

// ---------------------------------------------------------------------------------------------
// Achat le plus utile (V-ACHAT §7.2) — NON SOURCÉ
// ---------------------------------------------------------------------------------------------
export const ACHAT_CANDIDATES: readonly string[] = ['sac_a_dos', 'bidons_ou_sacs', 'elastique', 'halteres', 'barre_traction', 'banc', 'kettlebell'];
export const OBJETS_QUOTIDIEN: readonly string[] = ['sac_a_dos', 'bidons_ou_sacs'];

// ---------------------------------------------------------------------------------------------
// Étalonnage (V-ETAL §5.2, load-calibration.md) — NON SOURCÉ ; marge 2 : PROVISOIRE (SRC7)
// ---------------------------------------------------------------------------------------------
export const CALIBRATION = {
  /** Le bouton « 4+ » vaut 4 et plafonne la condition de hausse. */
  rirButtonMax: 4,
  raiseMargin: 2,
  lowerMargin: 2,
};
/** R4 / §6.8 point 2 : séances consécutives avec « ça fait mal » sur la même zone avant de PROPOSER un niveau plus haut. NON SOURCÉ. */
export const PAIN_SESSIONS_FOR_PROPOSAL = 2;

// ---------------------------------------------------------------------------------------------
// Profils de matériel A à F (tools/couverture.mjs) : utilisés par les tests, la démo, et le preset F (V-MAT §6.2)
// ---------------------------------------------------------------------------------------------
export const IMPLICIT_TAGS: readonly string[] = ['poids_du_corps', 'tapis', 'chaise', 'mur', 'marche_escalier', 'serviette', 'porte'];
