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
/** V-PER, D25 (knowledge/structure-programmes.md §2.3, E-1) : 1 à 6 jours par semaine. */
export const SUPPORTED_DAYS: readonly number[] = [1, 2, 3, 4, 5, 6];
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
/**
 * Ordre de retrait du noyau HORS tronc, action 6 (V-DUREE §4.4). NON SOURCÉ.
 * D26 (core-et-supersets.md CORE-TPS-1, écart E1) : le tronc n'est plus dans cette liste. Au-delà du plancher, il est
 * raccourci puis retiré AVANT charnière et tirage_1 (CORE_TRONC_STEPS) ; au plancher, il n'est jamais retiré.
 */
export const CORE_REMOVAL_ORDER: Record<2 | 3, Record<string, readonly string[]>> = {
  2: { A: ['charniere', 'tirage_1'], B: ['charniere', 'tirage_1'] },
  3: {
    A: ['charniere', 'tirage_1'],
    B: ['charniere', 'tirage_1'],
    C: ['tirage_1', 'charniere'],
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
/** Tags qui rendent une variante « chargeable » (V-DOSE §3.2) : une charge que l'app étalonne et fait progresser. */
export const CHARGEABLE_TAGS: readonly string[] = [
  'halteres', 'kettlebell', 'barre', 'barre_ez', 'disques', 'machine', 'poulie', 'sac_a_dos', 'bidons_ou_sacs',
];
/**
 * Charges fixes portées (écart sérieux n° 4 du contrôle relecteur du lot 09, knowledge/exercices/vague1/lot-09-lest-sac-bosu/CONTROLE-relecteur.md) :
 * le gilet lesté (`lest`) n'est PAS chargeable. L'app ne connaît pas son poids et ne peut pas l'alléger : pas de charge
 * de départ, pas d'échauffement à ~50 % (E3 au poids du corps), pas de hausse de charge proposée ; dose et progression
 * « sans charge » (répétitions puis échelon), comme l'écrivent les 7 fiches `*-gilet-lest`. Choix prudent NON SOURCÉ.
 * Il reste une charge pour la sécurité : une restriction « sans charge » retire ces variantes (safety.ts), et la réserve
 * reste celle des charges libres (jamais la réserve 1 des variantes « sûres », dose.ts).
 */
export const FIXED_LOAD_TAGS: readonly string[] = ['lest'];
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
// D32 : limites de dose écrites dans les fiches (repères lisibles par le code). Ne font que BAISSER la dose de V-DOSE / V-VOL.
// Chaque valeur est recopiée d'une fiche au statut `utilisable` ou `complete_kine` (contrôlée par kine et relecteur) ; la
// fiche fait foi. Lecture la plus restrictive en cas de doute (docs/D32-bilan.md).
// ---------------------------------------------------------------------------------------------
export interface DoseLimit {
  /** Réserve minimale (RIR) : jamais moins. */
  minRir?: number;
  /** Nombre de séries au plus (V-VOL ne dépasse jamais). */
  maxSets?: number;
  /** Jamais la dose « pilier lourd » (4-6 répétitions) : répétitions et repos des exercices « autres » de V-DOSE. */
  noHeavyReps?: boolean;
}
/**
 * Fiches « Pas d'échec » (« arrête la série avec au moins 2 répétitions en réserve », ou « pas d'échec » sans nombre : lu comme
 * 2, lecture restrictive) : réserve >= 2, jamais la réserve 1 de l'avancé (rirSafeVariants). Source : texte des fiches (statut OK).
 */
const NO_FAILURE_FICHES: readonly string[] = [
  'planche', 'curl-incline-halteres', 'developpe-incline-halteres', 'curl-barre', 'developpe-couche-barre', 'developpe-couche-prise-serree-barre',
  'developpe-incline-barre', 'developpe-militaire-barre', 'extension-triceps-barre-ez-allonge', 'good-morning-barre', 'hip-thrust-barre',
  'releve-mollets-debout-barre', 'rowing-barre-ez', 'rowing-barre-penche', 'rowing-pendlay-barre', 'shrug-barre', 'souleve-de-terre-barre',
  'souleve-de-terre-roumain-barre', 'souleve-de-terre-sumo-barre', 'squat-arriere-barre', 'squat-avant-barre', 'squat-barre-repere-banc',
  'pompe-pieds-ballon', 'roue-abdos', 'squat-ballon-lest', 'squat-lancer-mur', 'fente-gilet-lest', 'montee-gilet-lest', 'pompe-gilet-lest',
  'pont-fessier-gilet-lest', 'rowing-sac-de-sable', 'souleve-de-terre-sac', 'squat-bosu', 'squat-gilet-lest', 'squat-sac-berceau', 'traction-gilet-lest',
];
/** Clé = id de fiche ou id de variante (la variante l'emporte si les deux existent ; les limites se cumulent, la plus stricte gagne). */
export const DOSE_LIMITS: Record<string, DoseLimit> = {
  ...Object.fromEntries(NO_FAILURE_FICHES.map((id) => [id, { minRir: 2 }])),
  // Fiche good-morning-barre : « exercice avancé, charge légère : 2 à 3 séries, 2 à 3 répétitions en réserve ».
  'good-morning-barre': { minRir: 2, maxSets: 3 },
  // Fiche rowing-pendlay-barre : « exercice avancé, charge légère à modérée : 2 à 3 séries, 2 à 3 répétitions en réserve ».
  'rowing-pendlay-barre': { minRir: 2, maxSets: 3 },
  // Fiche montee-sur-marche, variante haltères : « seulement sur la première ou la deuxième marche, haltères légers » : jamais 4-6.
  'montee-sur-marche-halteres': { noHeavyReps: true },
  // Variantes nommées « haltères légers » dans leur fiche : jamais la dose lourde (lecture restrictive).
  'tirage-w-halteres-legers': { noHeavyReps: true },
  'oiseau-halteres-assis': { noHeavyReps: true },
  'oiseau-banc-incline-halteres': { noHeavyReps: true },
  'extension-triceps-couche-deux-halteres': { noHeavyReps: true },
};
/**
 * D32 : surfaces instables (bosu, ballon de gym, sangles de suspension, ballon lesté, roue) : réserve >= 2, jamais la réserve 1 de
 * l'avancé. Choix prudent de `dev` (lecture restrictive de squat-bosu « Pas d'échec »), NON SOURCÉ : à confirmer par `coach` / `kine`.
 */
export const UNSTABLE_TAGS: readonly string[] = ['bosu', 'swiss_ball', 'sangles_suspension', 'medecine_ball', 'roue_abdos'];
export const UNSTABLE_MIN_RIR = 2;

/** Limite cumulée d'une fiche et de sa variante (la plus stricte de chaque champ). */
export function doseLimitOf(ficheId: string, variantId: string, tags: readonly string[] = []): DoseLimit {
  const parts = [DOSE_LIMITS[ficheId], DOSE_LIMITS[variantId]].filter((x): x is DoseLimit => !!x);
  if (tags.some((t) => UNSTABLE_TAGS.includes(t))) parts.push({ minRir: UNSTABLE_MIN_RIR });
  const out: DoseLimit = {};
  for (const p of parts) {
    if (p.minRir !== undefined) out.minRir = Math.max(out.minRir ?? 0, p.minRir);
    if (p.maxSets !== undefined) out.maxSets = Math.min(out.maxSets ?? Infinity, p.maxSets);
    if (p.noHeavyReps) out.noHeavyReps = true;
  }
  return out;
}

/**
 * D32 : nom affiché d'une variante dont le nom contredit celui de sa fiche (ex. « Marche rapide en intervalles (Marche rapide
 * continue) ») : le nom de la variante seul est affiché ; les ids ne changent pas. Le renommage de la fiche reste à faire par `coach`.
 */
export const VARIANT_NAME_ALONE: readonly string[] = ['marche-rapide-continue'];
export function itemNom(ficheNom: string, variant: { id: string; nom: string }): string {
  return VARIANT_NAME_ALONE.includes(variant.id) ? variant.nom : `${ficheNom} (${variant.nom})`;
}

/**
 * Fiches jamais placées par le générateur, ni comme exercice ni en échauffement, même `utilisable` (consultables dans
 * la bibliothèque). Écart sérieux n° 3 du contrôle relecteur du lot 09 (knowledge/exercices/vague1/lot-09-lest-sac-bosu/CONTROLE-relecteur.md) :
 * equilibre-unipodal-bosu est de schéma `mobilite`, sans emplacement ni ligne TEMPS ; si un emplacement l'appelait un jour,
 * V-DOSE la doserait en 10 à 15 répétitions à réserve 2, l'inverse de la fiche (courts maintiens, jamais fatigué).
 * Exclue tant qu'aucun emplacement d'équilibre dosé selon la fiche n'existe. Choix prudent de `dev`.
 */
export const GENERATOR_EXCLUDED_FICHES: readonly string[] = ['equilibre-unipodal-bosu'];

/** Emplacements « piliers » (exercices principaux de la séance). */
export const MAIN_EXERCISE_SLOTS: readonly string[] = ['jambes_genou', 'poussee_1', 'tirage_1', 'charniere'];
/**
 * Lancers au ballon lesté contre un mur (lot 08) : jamais un exercice principal (décision de l'utilisateur du 25/10/2026, choix prudent) ;
 * ils restent possibles aux emplacements secondaires. Dosage fixe : FIXED_DOSE (Q23).
 */
export const PILLAR_EXCLUDED_FICHES: readonly string[] = ['lancer-poitrine-mur', 'lancer-rotation-mur', 'lancer-bas-haut-mur', 'squat-lancer-mur'];

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
// D26 : core (tronc) et supersets — knowledge/core-et-supersets.md (validé sous réserve par `relecteur`, 30/10/2026),
// knowledge/famille-core-inventaire.md. TOUT est NON SOURCÉ (choix de conception prudents), sauf SUP-1 (OK, S-SUP).
// ---------------------------------------------------------------------------------------------
export type CoreFamily = 'gainage' | 'anti_rotation' | 'rotation' | 'flexion' | 'extension';
/** CORE-ALT-1 : ordre de rotation des familles CF1 à CF5. NON SOURCÉ. */
export const CORE_FAMILY_ORDER: readonly CoreFamily[] = ['gainage', 'anti_rotation', 'rotation', 'flexion', 'extension'];
/** CORE-FAM-1 : famille déduite du schéma quand la fiche n'a pas l'attribut `famille_core`. */
export const CORE_FAMILY_FROM_SCHEMA: Record<string, CoreFamily> = { gainage: 'gainage', anti_rotation: 'anti_rotation', rotation: 'rotation' };
/** Familles « sûres » (CF1, CF2) : débutant, grossesse/post-partum, dos niveau 2, séance à charge lourde, P3. */
export const CORE_SAFE_FAMILIES: readonly CoreFamily[] = ['gainage', 'anti_rotation'];
/** Inventaire (kiné, 2e passage) : hors famille core (travail de hanche) ; exclue de l'emplacement `tronc` par id. */
export const CORE_NOT_CORE_IDS: readonly string[] = ['copenhague-court'];
/** Inventaire : CF5 qui ne compte PAS dans le plancher (schéma charnière, hors GG5) ; jamais en superset. */
export const CORE_OUT_OF_FLOOR_IDS: readonly string[] = ['extension-dorsale-ballon'];
/** Roue abdominale et roulé au ballon (CF1 dynamique) : débutant, dos dès le niveau 1, grossesse, charge lourde, P3. */
export const CORE_WHEEL_IDS: readonly string[] = ['roue-abdos', 'rollout-ballon'];
/** CF1 dynamiques ou instables retirées au dos niveau 2 (CORE-SEC-3, R7 ; planche-ballon / planche-bosu : à confirmer par `kine`). */
export const CORE_CF1_DYNAMIC_IDS: readonly string[] = ['planche-cercles-ballon', 'genoux-poitrine-ballon', 'planche-ballon', 'planche-bosu'];
/**
 * CORE-ORD-4 : CF1 à répétitions (dose fixe dynamique) exclues après une charge lourde. Lecture restrictive de `dev`
 * (la règle ne permet que le maintien <= 30 s en CF1 et les répétitions V-TEMPS en CF2) : docs/D26-bilan.md.
 */
export const CORE_HEAVY_EXCLUDED_IDS: readonly string[] = [...CORE_WHEEL_IDS, 'genoux-poitrine-ballon', 'planche-cercles-ballon'];
/** §11 point 2 (kiné) : rotation russe chargée et lancer rotatif rapide « non proposés par défaut » : jamais placés par le générateur. */
export const CORE_NOT_DEFAULT_IDS: readonly string[] = ['rotation-russe', 'lancer-rotation-mur'];
/** CORE-FREQ-1/2 : plancher hebdomadaire (séances avec core, séries de core). NON SOURCÉ (question Q3 ouverte). */
export const CORE_FLOOR = { sessions: 2, sets: 4 } as const;
/** CORE-DOSE-1 : séries par exercice de core (V-TEMPS). NON SOURCÉ. */
export const CORE_SETS_PER_EXERCISE = 2;
/** CORE-DOSE-3, CORE-ALT-3 : plafonds de core. NON SOURCÉ. */
export const CORE_MAX = { exercisesPerSession: 2, setsPerSession: 6, setsPerWeek: 12, rotationPerSession: 1 } as const;
export type CoreGoal = 'force' | 'muscle' | 'cardio' | 'sante';
/** CORE-FREQ-4, table §2.2 : cible de séances avec core (séries cible = 2 x séances). Lignes 4 à 6 jours : phase 4. NON SOURCÉ. */
export const CORE_TARGET_SESSIONS: Record<number, Record<CoreGoal, number>> = {
  2: { force: 2, muscle: 2, cardio: 2, sante: 2 },
  3: { force: 2, muscle: 3, cardio: 2, sante: 3 },
  4: { force: 2, muscle: 3, cardio: 2, sante: 3 },
  5: { force: 3, muscle: 3, cardio: 3, sante: 3 },
  6: { force: 3, muscle: 3, cardio: 3, sante: 3 },
};
/** CORE-FREQ-5 (3) : en corps entier, séances qui reçoivent le core d'abord (A puis C, puis B). NON SOURCÉ. */
export const CORE_SESSION_PRIORITY: Record<2 | 3, readonly ('A' | 'B' | 'C')[]> = { 2: ['A', 'B'], 3: ['A', 'C', 'B'] };
/** E1 / CORE-TPS-1 : séances qui perdent en premier leur core AU-DELÀ du plancher (rotation A, C, B conservée). NON SOURCÉ. */
export const CORE_REMOVAL_SESSION_ORDER: Record<2 | 3, readonly ('A' | 'B' | 'C')[]> = { 2: ['A', 'B'], 3: ['A', 'C', 'B'] };
/** CORE-ORD-4 (a) et SUP-0 point 2 (liste B1) : matériel « lourd ». */
export const HEAVY_TAGS_B1: readonly string[] = ['barre', 'barre_ez', 'disques', 'rack', 'kettlebell', 'lest', 'sac_de_sable', 'machine', 'poulie'];
/** CORE-ORD-4 (b) : pilier jambes_genou / charnière réellement lourd (haltères et sac à dos exclus ; machine et poulie couvertes par (a)). */
export const HEAVY_TAGS_PILLAR: readonly string[] = ['barre', 'barre_ez', 'disques', 'rack', 'kettlebell', 'lest', 'sac_de_sable'];
/** CORE-ORD-4 (c) : rowings penchés chargés, par id (liste à tenir à jour), plus toute fiche `rowing-*` à matériel B1. */
export const HEAVY_ROW_IDS: readonly string[] = ['rowing-barre-penche', 'rowing-pendlay-barre', 'rowing-barre-ez', 'rowing-sac-de-sable'];
/** CORE-ORD-4 : maintien maximal (s) du core après une charge lourde. NON SOURCÉ. */
export const CORE_HEAVY_MAX_HOLD_SEC = 30;
/** CORE-SEC-3 : table dos par famille et par niveau (la plus restrictive de la table et de la fiche s'applique). NON SOURCÉ (kiné). */
export interface CoreDosRule {
  retire?: boolean;
  sansCharge?: boolean;
  maxRepsPerSide?: number;
  maxHoldSec?: number;
  capped?: boolean;
  excludeIds?: readonly string[];
}
export const CORE_DOS: Record<1 | 2 | 3, Record<CoreFamily, CoreDosRule>> = {
  1: {
    gainage: { excludeIds: CORE_WHEEL_IDS },
    anti_rotation: {},
    rotation: { sansCharge: true, maxRepsPerSide: 8 },
    // CF4 : « courte et lente, jambes pliées, sans lest » ; crunch-bicyclette retirée dès le niveau 1 (inventaire, kiné).
    flexion: { sansCharge: true, excludeIds: ['crunch-bicyclette'] },
    extension: { sansCharge: true },
  },
  2: {
    gainage: { maxHoldSec: 20, capped: true, excludeIds: [...CORE_WHEEL_IDS, ...CORE_CF1_DYNAMIC_IDS, 'planche-laterale-jambe-levee'] },
    anti_rotation: { maxHoldSec: 20, capped: true },
    rotation: { retire: true },
    flexion: { retire: true },
    extension: { retire: true },
  },
  3: {
    gainage: { retire: true },
    anti_rotation: { retire: true },
    rotation: { retire: true },
    flexion: { retire: true },
    extension: { retire: true },
  },
};
/** SUP-0 point 1 : emplacements accessoires seuls appariables. */
export const SUPERSET_SLOTS: readonly string[] = ['poussee_2', 'tirage_2', 'jambes_2', 'tronc'];
/** SUP-0 point 3, SUP-3 : schémas jamais appariés. */
export const SUPERSET_FORBIDDEN_SCHEMAS: readonly string[] = ['poussee_v', 'saut', 'porte', 'cardio'];
/** SUP-6 : repos minimal d'une paire (s). NON SOURCÉ (prudence, fatigue interne plus élevée : S-SUP). */
export const SUPERSET_MIN_REST_SEC = 60;
/** SUP-0 point 2 / P3 : tags permis pour `jambes_2` en P3 (poids du corps ou élastique, plus les objets d'appui implicites). */
export const P3_LEG_ALLOWED_TAGS: readonly string[] = ['poids_du_corps', 'elastique', 'tapis', 'chaise', 'mur', 'marche_escalier', 'serviette', 'porte'];

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

// ---------------------------------------------------------------------------------------------
// D25 — structure des programmes v2 (knowledge/structure-programmes.md, validé sous réserve par coach, kine, relecteur ;
// décision de l'utilisateur du 30/10/2026 sur la règle 15). Toutes les valeurs ci-dessous sont NON SOURCÉ (choix de
// conception) sauf mention ; la limite de 10 séries fractionnaires par muscle et par séance reste VOLUME (V-PLAF, PROVISOIRE).
// ---------------------------------------------------------------------------------------------
export type SessionType = 'CE' | 'HAUT' | 'BAS' | 'PUSH' | 'PULL' | 'LEGS';
/** §2.3 : séances de la semaine par nombre de jours (familles muscle / force, intermédiaire et avancé). NON SOURCÉ. */
export const SPLIT_BY_DAYS: Record<number, readonly string[]> = {
  1: ['A'],
  2: ['A', 'B'],
  3: ['A', 'B', 'C'],
  4: ['HAUT-A', 'BAS-A', 'HAUT-B', 'BAS-B'],
  5: ['HAUT-A', 'BAS-A', 'PUSH-B', 'PULL-B', 'LEGS-B'],
  6: ['PUSH-A', 'PULL-A', 'LEGS-A', 'PUSH-B', 'PULL-B', 'LEGS-B'],
};
/** STR-REP-6 / STR-REP-14 (c) : au plus 4 séances de force (haut / bas) pour débutant, famille sante ou zone sensible à 5-6 jours. */
export const LIGHT_SPLIT_MAX_FORCE = 4;
/** STR-REP-14 (c) : zones au niveau >= 2 qui ramènent 5-6 jours à haut / bas. */
export const SPLIT_SENSITIVE_ZONES: readonly string[] = ['epaule', 'dos', 'genou', 'hanche'];
/** STR-REP-14 (b) : une séance HAUT, PUSH ou PULL de moins de 3 exercices de force devient un jour léger. */
export const SPLIT_MIN_FORCE_EXERCISES = 3;
/** STR-REP-1 : 1 jour, débutant ou famille sante : séance de 45 min au plus (ajout `kine`). */
export const ONE_DAY_BEGINNER_MAX_MIN = 45;
/** STR-REP-11 (b) : grossesse / post-partum : séances de force par semaine au plus (débutante ou niveau absent : 2). PROVISOIRE (G5). */
export const PREGNANCY_MAX_FORCE = { debutant: 2, autres: 3 } as const;
/** STR-REP-8 (ajout `kine`) : un débutant n'enchaîne jamais plus de 2 jours de force de suite ; 1 jour sans force par semaine au moins. */
export const BEGINNER_MAX_CONSECUTIVE_FORCE = 2;
export const MIN_DAYS_WITHOUT_FORCE = 1;
/** STR-REP-4 : N de départ par durée pour HAUT, BAS, PUSH, PULL, LEGS (V-DUREE moins 1, minimum 4) ; « sans limite » = 6. */
export const SPLIT_START_N_BY_DURATION: readonly [number, number][] = [
  [20, 4],
  [30, 4],
  [45, 5],
  [60, 6],
  [75, 7],
];
export const SPLIT_UNLIMITED_START_N = 6;
/**
 * §1.1 point 5 : ordre de retrait des accessoires (premier retiré d'abord) ; le noyau du type n'est jamais retiré (STR-REP-4).
 * Les emplacements d'indice 2 gardent l'ordre existant d'ACCESSORY_REMOVAL_ORDER (fonctionnel, jambes_2, tirage_2, poussee_2).
 */
export const ACCESSORY_REMOVAL_ORDER_V2: readonly string[] = [
  'fonctionnel', 'poussee_4', 'tirage_4', 'jambes_4', 'poussee_3', 'tirage_3', 'jambes_3', 'jambes_2', 'tirage_2', 'poussee_2',
];
/** STR-REP-12 : jour léger (30 min au plus, sans charge) ; mobilité 2 à 4 fiches. NON SOURCÉ (`kine`). */
/** E1 seul (secondes) ; mobilité : 4 fiches au plus de 75 s (5 min avec 4 fiches, bas de « 5 à 10 min »), dans les 30 min. */
export const LIGHT_DAY = { maxMin: 30, mobilityMax: 4, mobilitySecEach: 75 } as const;

// ---------------------------------------------------------------------------------------------
// Cardio par objectif (knowledge/cardio-regles.md §3.4 (f)-(k), §3.7 ; validé sous réserve) et STR-SEA-4. NON SOURCÉ.
// ---------------------------------------------------------------------------------------------
export const CARDIO_V2 = {
  /** §3.7 (d) : nombre de blocs selon le rang du cardio (rang 2 : 2 ; rang 3 ou plus : 1). */
  blocksByRank: { 2: 2, 3: 1 } as Record<number, number>,
  /** §3.4 (f) : rampe du débutant : le 2e bloc n'existe qu'à partir de la semaine 3 ; aucun bloc ne s'allonge pendant le premier bloc de 4 semaines. */
  beginnerSecondBlockFromWeek: 3,
  /** §3.4 (g), §3.7 (a), STR-REP-7 : bloc « facile » (après jambes lourdes, ou séance HAUT) : 15 min au plus, marche seulement. */
  easyMaxMin: 15,
  easyVariants: ['marche-rapide-continue'] as readonly string[],
  /** §3.4 (k) : tags de variante qui rendent un exercice de jambes « lourd » (l'élastique et le poids du corps ne comptent pas). */
  heavyLegTags: ['barre', 'barre_ez', 'disques', 'rack', 'kettlebell', 'lest', 'sac_de_sable', 'halteres', 'sac_a_dos', 'bidons_ou_sacs', 'machine', 'poulie'] as readonly string[],
  heavyLegSlots: ['jambes_genou', 'charniere'] as readonly string[],
  legSchemas: ['squat', 'fente', 'charniere', 'cheville_mollet', 'hanche_laterale'] as readonly string[],
  /** STR-REP-7 (avis `kine`) : zones d'appui qui limitent le bloc à 15 min, facile. */
  supportZones: ['genou', 'hanche', 'cheville', 'dos'] as readonly string[],
  /** STR-SEA-4 (`kine`) : les 2 dernières minutes de tout bloc ou séance de cardio en allure lente, comprises dans la durée. */
  slowEndMin: 2,
};

// ---------------------------------------------------------------------------------------------
// Statut des règles D30 / D31 (knowledge/cardio-regles.md §3.2bis, §3.2ter, §5 ; structure-programmes.md §2.4 ; machines-etiquettes.md),
// validées sous réserve par `coach`, `kine` et `relecteur`, décidées par l'utilisateur (DECISIONS-utilisateur.md D30, D31).
// ---------------------------------------------------------------------------------------------
export const PENDING_RULES = {
  /** Q5 : sauts (5.2, 5.2bis). Codé : séance de sport incluse (famille « sauts »), version douce d'abord pour le débutant. */
  sauts: { status: 'VALIDE_SOUS_RESERVE', enabled: true },
  /** Q6 : course (5.3). Règles codées (fonctions pures) ; aucune fiche de course : jamais proposée (FICHES_NON_DISPONIBLES). */
  course: { status: 'VALIDE_SOUS_RESERVE', enabled: true },
  /** Q7 : plafond de séances de cardio dédiées selon l'objectif et le niveau (3.2bis). */
  plafondCardioObjectif: { status: 'VALIDE_SOUS_RESERVE', enabled: true },
  /** Q8 : cardio dehors (5.4), réglage du profil, sans GPS. */
  exterieur: { status: 'VALIDE_SOUS_RESERVE', enabled: true },
  /** Q10 : étiquettes de machines et accès à une salle (machines-etiquettes.md). */
  etiquettesMachines: { status: 'VALIDE_SOUS_RESERVE', enabled: true },
  /** STR-ISO : isolation (intermédiaire / avancé ; exception du débutant en prise de muscle). */
  isolationDebutant: { status: 'VALIDE_SOUS_RESERVE', enabled: true },
  /** D28 « Créer une séance » (5.1 (6ter)) : écran NON codé (étape suivante) ; verrous en fonctions pures (impact.ts). */
  creerSeance: { status: 'ETAPE_SUIVANTE', enabled: false },
} as const;

/** Fiches que les règles citent mais qui n'existent pas encore (vague 2 de `coach`) : jamais proposées par le générateur. */
export const FICHES_NON_DISPONIBLES: readonly string[] = [
  'corde-a-sauter', 'saut-longueur-pieds-joints',
  'velo', 'rameur', 'tapis-de-course', 'elliptique', 'presse-a-cuisses',
];

/** 3.2bis : plafond de séances de cardio dédiées par semaine, selon l'objectif de rang 1 et le niveau. NON SOURCÉ (OMS : repère seul). */
export const CARDIO_CAPS = {
  /** Objectif cardio : inchangé (= CARDIO.maxDedicated). */
  cardio: { debutant: 2, intermediaire: 3, avance: 3 } as Record<Level, number>,
  /** Forme / santé. */
  sante: { debutant: 1, intermediaire: 2, avance: 2 } as Record<Level, number>,
  /** Force, prise de muscle, perte de gras : 0 par défaut ; nombre si l'option est acceptée (3.2ter A). */
  option: { debutant: 1, intermediaire: 1, avance: 2 } as Record<Level, number>,
  /** Sport : 1, incluse par défaut (3.2ter B). */
  sport: { debutant: 1, intermediaire: 1, avance: 1 } as Record<Level, number>,
  /** Grossesse / post-partum : 1 séance au plus, 20 min au plus, modérée, sans saut ni course (tout objectif). */
  pregnancyMax: 1,
  pregnancyMaxMin: 20,
  /** 3.2 : jamais plus de 3 séances dédiées ; 3.2bis : jamais plus de 300 min modérées par semaine (OMS, OK). */
  absoluteMax: 3,
  omsWeekMaxMin: 300,
};

/** 3.2ter A : option « Ajouter une séance de cardio ? ». NON SOURCÉ (choix de `coach`, confirmés par `kine`). */
export const CARDIO_OPTION = {
  goals: ['force', 'muscle', 'perte_gras'] as readonly string[],
  /** Offerte à partir de 3 jours de force choisis. */
  minForceDays: 3,
  /** Au plus 6 jours d'entraînement (force + cardio, jours légers exclus). */
  maxTrainingDays: 6,
  startMin: { debutant: 20, intermediaire: 30, avance: 30 } as Record<Level, number>,
  maxMin: { debutant: 30, intermediaire: 40, avance: 45 } as Record<Level, number>,
  /** Blocs de 3.4 réduits à 1 quand la séance est acceptée. */
  blocksWhenAccepted: 1,
};

/** 3.2ter B et sports.md : familles des sports déclarés (clés du profil, sans accent). NON SOURCÉ (classement de sports.md). */
export const SPORT_FAMILIES = {
  sauts: ['volley', 'basket', 'hand', 'handball', 'danse', 'detente'] as readonly string[],
  intermittent: ['foot', 'football', 'tennis', 'badminton', 'padel', 'squash', 'raquettes'] as readonly string[],
  /** 3.2ter B : 10 à 15 min d'effort modéré après les sauts (bas de la fourchette). */
  moderateAfterJumpsMin: 10,
};

/** 5.1 (2) : zones qui excluent sauts et course à tout niveau (1, 2 ou 3), décision de l'utilisateur et `kine`. */
export const IMPACT_EXCLUDED_ZONES: readonly string[] = ['genou', 'cheville', 'dos', 'hanche', 'cuisse', 'aine'];
/** STR-REP-12 et lecture prudente : zones de membre inférieur au niveau >= 2 : aucune séance de cardio dédiée ajoutée. */
export const LOWER_LIMB_ZONES: readonly string[] = ['genou', 'hanche', 'cheville', 'cuisse', 'aine'];

/**
 * 5.2 : mouvements avec saut autorisés (faible hauteur) et leur version douce. `jumpVariant` / `softVariant` = variantes de fiches
 * existantes, ou null (« non disponible » : fiche à créer en vague 2). `minLevel` = niveau du tableau 5.2 ; le niveau de la variante
 * de fiche s'applique aussi (le plus restrictif des deux). Liste et versions douces : NON SOURCÉ (`coach`, `kine`).
 */
export interface JumpMovement {
  key: string;
  jumpVariant: string | null;
  softVariant: string | null;
  minLevel: Level;
  /** 5.2 (`kine`) : retiré si épaule ou poignet au niveau 2 ou 3 (la version douce reste). */
  noShoulderWrist23?: boolean;
}
export const JUMP_MOVEMENTS: readonly JumpMovement[] = [
  { key: 'jumping_jacks', jumpVariant: 'jumping-jacks-saut', softVariant: 'jumping-jacks-sans-saut', minLevel: 'debutant', noShoulderWrist23: true },
  // Corde : aucune fiche (tag corde_a_sauter) : non disponible.
  { key: 'corde', jumpVariant: null, softVariant: null, minLevel: 'debutant', noShoulderWrist23: true },
  // `montees-genoux-course` est une course sur place (« Course sur place, genoux hauts ») : pas un saut de 5.2 ; non disponible.
  { key: 'montees_genoux', jumpVariant: null, softVariant: 'montees-genoux-marche', minLevel: 'debutant' },
  // Pas chassés ou patineur à petit bond : aucune variante qui corresponde (patineur existant = réception sur une jambe, exclue).
  { key: 'patineur', jumpVariant: null, softVariant: 'pas-chasses-lents', minLevel: 'intermediaire' },
  { key: 'petits_rebonds', jumpVariant: 'rebonds-deux-pieds', softVariant: 'releve-mollets-mur', minLevel: 'debutant' },
  // Saut en longueur sur place (D28) : fiche de vague 2 (réception tenue 2 s) ; la fiche actuelle n'a pas ses lignes de zone en « retirer ».
  { key: 'saut_longueur', jumpVariant: null, softVariant: null, minLevel: 'intermediaire' },
  // Squat avec petit saut : aucune fiche de faible hauteur (`saut-vertical` = saut en extension, hors liste).
  { key: 'squat_petit_saut', jumpVariant: null, softVariant: null, minLevel: 'intermediaire' },
];

/** 5.2, 5.2bis : contacts, séries, repos, espacements. Plafonds PROVISOIRE (Davies 2015) ; le reste NON SOURCÉ. */
export const JUMPS = {
  startContacts: { debutant: 40, intermediaire: 60, avance: 80 } as Record<Level, number>,
  capContacts: { debutant: 60, intermediaire: 100, avance: 120 } as Record<Level, number>,
  weeklyStep: 5,
  /** Série (5.2) : 10 à 15 sauts (débutant), 10 à 20 (autres) : départ au bas (10). */
  seriesReps: 10,
  /** R-PLIO (séance mixte, 5.2bis) : séries de 5 à 8 sauts. */
  plioSeries: [5, 8] as [number, number],
  maxExercises: 3,
  /** 5.2bis condition 6 : 60 s minimum ferme (60 à 90 s), en marchant. */
  restSec: 60,
  /** 5.2bis condition 4 : échauffement 5 min (7 si la séance dépasse 45 min), 10 petits rebonds au plus, comptés. */
  warmupMin: 5,
  warmupMinLong: 7,
  warmupBounces: 10,
  maxPerWeek: 1,
  minGapHoursBetweenJumpSessions: 72,
  /** 5.1 (5) (`kine`) : après une séance à jambes lourdes : 48 h ET deux jours calendaires complets. */
  heavyLegsGapHours: 48,
  heavyLegsGapDays: 2,
  recoveryFactor: 0.7,
};

/** 5.1 (6bis), 6ter : séances avec impact (sauts ou course). NON SOURCÉ. */
export const IMPACT = { beginnerMaxPerWeek: 2, createMaxPerWeek: 3, createMinGapHours: 48 };

/** 5.3 : course en 12 paliers. Paliers 1, 2, 12 : PROVISOIRE (NHS) ; les autres et toutes les règles de passage : NON SOURCÉ. */
export interface RunStage { run: number; walk: number; reps: number; lastRun: number }
export const RUN = {
  /** Course / marche (min) x répétitions, puis une dernière course. Palier 12 : 30 min continues. */
  stages: [
    { run: 1, walk: 1.5, reps: 7, lastRun: 1 },
    { run: 1.5, walk: 2, reps: 5, lastRun: 1.5 },
    { run: 2, walk: 2, reps: 4, lastRun: 2 },
    { run: 3, walk: 2, reps: 3, lastRun: 2 },
    { run: 4, walk: 2, reps: 3, lastRun: 2 },
    { run: 6, walk: 3, reps: 2, lastRun: 4 },
    { run: 8, walk: 3, reps: 2, lastRun: 2 },
    { run: 12, walk: 3, reps: 1, lastRun: 8 },
    { run: 16, walk: 3, reps: 1, lastRun: 6 },
    { run: 20, walk: 2, reps: 1, lastRun: 6 },
    { run: 25, walk: 2, reps: 1, lastRun: 5 },
    { run: 30, walk: 0, reps: 0, lastRun: 0 },
  ] as readonly RunStage[],
  /** Durée d'une sortie (min), calcul de `coach` (5.3) : 5 min de marche + corps du palier + 5 min de marche. */
  sortieMin: [29, 29, 28, 27, 30, 32, 34, 33, 35, 38, 42, 40] as readonly number[],
  warmupMin: 5,
  cooldownMin: 5,
  /** Palier 0 : 2 semaines de suite avec au moins 2 marches rapides de 20 min, les 2 dernières d'au moins 29 min. */
  palier0: { weeks: 2, perWeek: 2, minMin: 20, lastTwoMin: 29 },
  passAfterOutings: 2,
  maxStagesPerWeek: 1,
  maxLongestGrowth: 0.5,
  maxTotalGrowth: 0.3,
  /** Version sur place : 10 x (30 s de foulées / 60 s de marche), 5 min cumulées, sans palier, 2 par semaine au plus. */
  onSpot: { reps: 10, runSec: 30, walkSec: 60, maxPerWeek: 2 },
  /** Fréquence (5.3) : débutant rang 1 : 2 ; forme / santé : 1 ; autres : 3 au plus ; jamais deux jours de suite. */
  perWeek: { debutantCardio: 2, sante: 1, autres: 3 },
  /** Pause : plus de 2 semaines = marche, puis 2 paliers plus bas ; plus de 12 semaines = palier 0 refait. */
  pause: { weeks: 2, stagesDown: 2, redoPalier0Weeks: 12 },
};

/** 5.4 : la course dehors exige ces trois éléments actifs ; sinon l'extérieur = marche seulement. */
export const OUTDOOR_RUN_REQUIRES = ['wakeLock', 'sound', 'lookFallback'] as const;

/** machines-etiquettes.md : tags masqués sans le lieu « salle » ni l'accès à une salle, et retirés en grossesse / post-partum (G9). */
export const MACHINE_TAGS: readonly string[] = ['machine', 'poulie', 'machine_cardio'];

/** STR-ISO-0 à 5 (structure-programmes.md §2.4). NON SOURCÉ. */
export const ISOLATION = {
  /** Emplacements, dans l'ordre d'ajout ; muscle principal exigé, schéma de fiche, zones qui retirent l'exercice dès le niveau 1. */
  slots: [
    { slot: 'iso_biceps', schema: 'tirage_h', muscle: 'biceps', zones: ['coude', 'poignet'] },
    { slot: 'iso_deltoide_lateral', schema: 'poussee_v', muscle: 'deltoides_lateraux', zones: ['epaule'] },
    { slot: 'iso_mollets', schema: 'cheville_mollet', muscle: 'mollets', zones: ['cheville'] },
  ] as readonly { slot: 'iso_biceps' | 'iso_deltoide_lateral' | 'iso_mollets'; schema: string; muscle: string; zones: readonly string[] }[],
  setsPerExercise: 2,
  maxPerSession: 2,
  maxSetsPerGroupWeek: 4,
  /** STR-ISO-1 : 8 semaines de base (2 blocs), 80 % des séances de force prévues faites, aucune douleur persistante la dernière semaine. */
  beginnerBaseWeeks: 8,
  beginnerDoneRatio: 0.8,
  /** STR-ISO-5 : pause de plus de 4 semaines : isolation retirée jusqu'à un nouveau bloc de base. */
  pauseWeeks: 4,
  /** STR-ISO-2 : objectif « prise de muscle » rang 1, au moins 3 jours, corps entier ou haut / bas. */
  goal: 'muscle',
  minDays: 3,
};

/** STR-REP-12 : cardio doux du jour léger (marche à plat, facile), proposé jamais exigé : départ au bas de la fourchette. NON SOURCÉ. */
export const LIGHT_DAY_CARDIO = { startMin: 10, maxMin: { debutant: 15, autres: 20 } };

/**
 * 5.2bis, cas test D28 : calcul de durée d'une séance « pliométrie en tête + force lente ». NON SOURCÉ (calcul de `coach`, confirmé par `kine`).
 * Série de sauts ~8 s, repos 60 s (minimum ferme) ; 1 min pour T8 et les transitions ; force : répétition lente 4 s (descente 3 s),
 * 5 s de changement de jambe, repos 60 s, 1 min d'installation ; retour au calme 3 min.
 */
export const PLIO_COMPOSE = {
  jumpSeriesSec: 8, jumpRestSec: 60, jumpTransitionsMin: 1,
  repSec: 4, sideSwitchSec: 5, strengthRestSec: 60, setupMin: 1, cooldownMin: 3,
};

/** §5.1 (1) (G7, HAS 2019, PROVISOIRE) : schémas de fiche à impact, jamais en grossesse ni en post-partum, même en échauffement. */
export const IMPACT_SCHEMAS: readonly string[] = ['saut', 'course'];
/**
 * §5.1 (1) : variantes avec saut ou course rangées dans d'autres schémas (cardio), jamais en grossesse ni en post-partum. Liste tenue à
 * jour avec les fiches (variantes avec saut de JUMP_MOVEMENTS, course sur place, pas chassés rapides, mountain climbers rapides).
 */
export const IMPACT_VARIANTS: readonly string[] = ['jumping-jacks-saut', 'montees-genoux-course', 'pas-chasses-rapides', 'mountain-climbers-rapide', 'rebonds-deux-pieds'];
