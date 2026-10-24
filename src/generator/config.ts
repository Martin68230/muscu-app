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
/**
 * Objectifs qui ont leur propre famille (pas de préfixe « en attendant la version dédiée », V-EXPL).
 * B4 : `cardio` n'est plus « ramené » (séances et blocs de cardio : knowledge/cardio-regles.md) ; `endurance`, `sport`,
 * `perte_gras`, `mobilite`, `fonctionnel` restent ramenés comme avant.
 */
export const NATIVE_GOALS: readonly string[] = ['muscle', 'force', 'sante', 'forme', 'cardio'];
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
// Doses fixes par fiche (N4 du recontrôle lot-08-ballons-roue, docs/QUESTIONS.md Q23) — NON SOURCÉ en entier
// ---------------------------------------------------------------------------------------------
// Repères de coach validés par kine, écrits dans chaque fiche (section dosage) ; choix prudent tant que l'utilisateur
// n'a pas répondu à Q23. Ils passent AVANT V-TEMPS et V-DOSE : ni les 10-15 répétitions de V-DOSE, ni le maintien
// de 20-30 s de la ligne `gainage` ne s'appliquent à ces fiches. Ce sont des PLAFONDS (la série s'arrête dès que la
// vitesse du lancer baisse ou que le dos se creuse) : pas de réserve demandée, jamais d'échec, jamais de charge à progresser.
// Identification par id de fiche (liste explicite) : le tag `medecine_ball` seul ne suffit pas (porté, squat, bûcheron
// et rotation assise au ballon lesté gardent leur règle habituelle).
export interface FixedDoseRow {
  unit: 'reps' | 'reps_par_cote';
  reps: [number, number];
  sets: number;
  restSec: number;
}
/** Lancers au ballon lesté contre un mur : 2 séries de 6 à 8 lancers, repos 60 à 90 s -> 90 s (haut de la fourchette, prudent). NON SOURCÉ (Q23). */
export const LANCER_DOSE: FixedDoseRow = { unit: 'reps', reps: [6, 8], sets: 2, restSec: 90 };
/** Lancer en rotation : même dose, par côté. NON SOURCÉ (Q23). */
export const LANCER_ROTATION_DOSE: FixedDoseRow = { ...LANCER_DOSE, unit: 'reps_par_cote' };
/** Gainage dynamique (roue, roulé, genoux-poitrine) : 2 séries, repos 60 s, au plus 6 à 8 répétitions lentes. NON SOURCÉ (fiches, C6 / N4). */
export const GAINAGE_DYNAMIQUE_DOSE: FixedDoseRow = { unit: 'reps', reps: [6, 8], sets: 2, restSec: 60 };
/** Planche avec cercles : 2 séries, repos 60 s, 5 à 8 cercles par sens au plus. NON SOURCÉ (fiche, C5 / N4). */
export const PLANCHE_CERCLES_DOSE: FixedDoseRow = { unit: 'reps_par_cote', reps: [5, 8], sets: 2, restSec: 60 };
/** Id de fiche -> dose fixe. */
export const FIXED_DOSE: Record<string, FixedDoseRow> = {
  'lancer-poitrine-mur': LANCER_DOSE,
  'lancer-bas-haut-mur': LANCER_DOSE,
  'squat-lancer-mur': LANCER_DOSE,
  'lancer-rotation-mur': LANCER_ROTATION_DOSE,
  'roue-abdos': GAINAGE_DYNAMIQUE_DOSE,
  'rollout-ballon': GAINAGE_DYNAMIQUE_DOSE,
  'genoux-poitrine-ballon': GAINAGE_DYNAMIQUE_DOSE,
  'planche-cercles-ballon': PLANCHE_CERCLES_DOSE,
};

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

// ---------------------------------------------------------------------------------------------
// Cardio (B4) — knowledge/cardio-regles.md (validé sous réserve par `relecteur` le 24/10/2026, 10 réserves du recontrôle).
// Choix prudents appliqués tant que l'utilisateur n'a pas décidé (docs/QUESTIONS.md Q5-Q10) : aucun saut, aucune corde,
// aucune course, aucun cardio dehors, aucune fiche machine (réserve n° 8 du recontrôle), aucun intervalle soutenu (3.3bis non codé), effort modéré.
// ---------------------------------------------------------------------------------------------
export interface CardioType {
  /** Variante de fiche (échelon 1, sans saut). */
  variantId: string;
  /** Niveau minimal pour ce type (§4, §5). */
  minLevel: Level;
  /** Permis avec le réglage « enceinte » (§5 Grossesse). */
  grossesse: boolean;
  /** Permis avec le réglage « post-partum » (§5 Post-partum : liste blanche marche rapide, vélo assis, escaliers avec rampe). */
  postPartum: boolean;
  /** Zones qui retirent ce type dès le niveau 1, en plus des cases de la fiche (§5 Blessures, « en cas de doute : retiré »). */
  excludeZones: readonly string[];
}
export const CARDIO = {
  goalKey: 'cardio',
  /**
   * §4 : types proposés, par ordre de préférence (départage par cet ordre ; marche rapide d'abord, possible pour tout profil).
   * Choix des types : NON SOURCÉ (§4, §5). Fiches existantes seulement (lot-03) : aucune fiche vélo, rameur, tapis de course,
   * elliptique, corde, step ou escaliers (§4 « Manquent »). Exclus : `jumping-jacks-saut`, `montees-genoux-course`,
   * `pas-chasses-rapides`, `mountain-climbers-rapide` (saut / course / effort non modéré, Q5-Q6), `marche-rapide-alternee`
   * (fractionné doux : seulement après 4 semaines, §3.3, non codé en v1).
   */
  types: [
    { variantId: 'marche-rapide-continue', minLevel: 'debutant', grossesse: true, postPartum: true, excludeZones: [] },
    { variantId: 'montees-genoux-marche', minLevel: 'debutant', grossesse: true, postPartum: false, excludeZones: [] },
    { variantId: 'pas-chasses-lents', minLevel: 'debutant', grossesse: true, postPartum: false, excludeZones: [] },
    { variantId: 'jumping-jacks-sans-saut', minLevel: 'debutant', grossesse: false, postPartum: false, excludeZones: [] },
    { variantId: 'boxe-vide-lente', minLevel: 'debutant', grossesse: false, postPartum: false, excludeZones: [] },
    // §4 / correction kine R-e : intermédiaire minimum, jamais en grossesse / post-partum ; Q10 : épaule / poignet -> retiré.
    { variantId: 'mountain-climbers-chaise', minLevel: 'intermediaire', grossesse: false, postPartum: false, excludeZones: ['epaule', 'poignet'] },
  ] as readonly CardioType[],
  /** §3.2 : séances de musculation corps entier quand le cardio est l'objectif principal, selon N. NON SOURCÉ. */
  principalMuscuByDays: { 2: 2, 3: 2, 4: 2, 5: 2, 6: 3 } as Record<number, 2 | 3>,
  /** §3.2 : séances de cardio dédiées selon N (N = 2 : blocs après chaque séance). NON SOURCÉ. */
  principalDedicatedByDays: { 2: 0, 3: 1, 4: 2, 5: 3, 6: 3 } as Record<number, number>,
  /** §3.2 : plafond de séances dédiées par semaine ; débutant 2 (Q7 : décision de l'utilisateur en attente). NON SOURCÉ. */
  maxDedicated: { debutant: 2, intermediaire: 3, avance: 3 } as Record<Level, number>,
  /** §3.3 / §6.1-6.3 : durée de départ d'une séance dédiée (min) ; avancé « 30-45 au départ » -> 30 (bas). NON SOURCÉ. */
  dedicatedStartMin: { debutant: 20, intermediaire: 30, avance: 30 } as Record<Level, number>,
  /** §3.3 : durée maximale d'une séance dédiée (min), jamais plus que D. NON SOURCÉ. */
  dedicatedMaxMin: { debutant: 40, intermediaire: 45, avance: 60 } as Record<Level, number>,
  /** §3.4 : durée d'un bloc après la musculation : départ au bas de la fourchette (10, §3.1 point 4 « départ bas »), maximum par niveau. NON SOURCÉ. */
  blockStartMin: 10,
  blockMaxMin: { debutant: 15, intermediaire: 20, avance: 25 } as Record<Level, number>,
  /** §3.4 (a), §6.8 : sous 10 min, pas de bloc. NON SOURCÉ. */
  blockMinMin: 10,
  /** §3.4 (d), §6.4 : cardio secondaire : 2 blocs par semaine au plus, 25 % de la durée de la séance de musculation au plus. NON SOURCÉ. */
  secondaryBlocksMax: 2,
  secondaryMaxShare: 0.25,
  /** §3.5 : +10 % de durée au plus par semaine, arrondi vers le bas (garde-fou 110 % : PROVISOIRE, C8 extrapolé). */
  weeklyIncrease: 0.1,
  /** §3.5 : semaine de récupération toutes les 4 semaines (= 4e semaine du bloc), durée -30 %. NON SOURCÉ. */
  recoveryWeek: 4,
  recoveryFactor: 0.7,
  /** 9bis Q4(d), réserve n° 10 du recontrôle : grossesse / post-partum : durées du débutant, sans progression (lecture la plus prudente). NON SOURCÉ. */
  pregnancyLevel: 'debutant' as Level,
  /** §2 : repère OMS affiché (C1 : OK), jamais imposé. */
  omsMin: [150, 300] as [number, number],
};
