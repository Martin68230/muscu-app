// Modèle de données local, prêt pour la synchronisation (phase 6, Supabase).
//
// Chaque enregistrement synchronisable porte les mêmes champs de base :
// - id        : identifiant stable (UUID v4), identique en local et en ligne
// - ownerId   : propriétaire (id local de l'utilisateur, remplacé par l'id Supabase au premier envoi)
// - createdAt / updatedAt : dates ISO 8601 en UTC
// - rev       : compteur de modifications, +1 à chaque écriture
// - deletedAt : suppression logique (null = vivant) pour propager les suppressions
// - syncedAt  : dernier envoi réussi au serveur (null = jamais) ; à envoyer si updatedAt > syncedAt
//
// Les tables ne stockent que des identifiants (mouvement, variante, aliment Ciqual), jamais
// le contenu de la bibliothèque, qui reste un fichier statique de l'app.

export const SCHEMA_VERSION = 3;
// 2 : table signalements (D9)
// 3 : F1 + F3 — zones cuisse et aine, lieu, grossesse et fin de parcours dans le profil, champs d'étalonnage des séries
//     et du programme. Les sauvegardes v1 et v2 restent importables (champs ajoutés = facultatifs à l'import).
// (F5, sans changement de version : programme actif (empreinte, messages), séance en cours (curseur, repos, plan), zone de douleur des séries.
//     tous facultatifs, donc aucune migration IndexedDB ni changement de SCHEMA_VERSION.)

export interface SyncFields {
  id: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  rev: number;
  deletedAt: string | null;
  syncedAt: string | null;
}

export type Level = 'debutant' | 'intermediaire' | 'avance';
/** 10 zones, comme les fiches (format-fiches.md §4.1) ; `cuisse` = face arrière (ischios), `aine` = adducteurs. */
export type InjuryZone = 'cou' | 'epaule' | 'coude' | 'poignet' | 'dos' | 'hanche' | 'genou' | 'cheville' | 'cuisse' | 'aine';
/** Lieu d'entraînement. */
export type TrainingPlace = 'maison' | 'salle';
/** Réglage facultatif, privé, jamais partagé (ce n'est pas un ShareDataType). null = pas renseigné, traité comme « non ». */
export type PregnancyStatus = 'non' | 'enceinte' | 'post_partum';
/** Objectif principal (table `goals`, rang 1) : clés de la famille v1 (generateur-v1.md §1.3). */
export type MainGoalKey = 'muscle' | 'force' | 'sante' | 'perte_gras' | 'cardio';
/** 1 = gêne légère, 2 = gêne nette, 3 = douleur (règles détaillées : kine, à valider). */
export type InjuryLevel = 1 | 2 | 3;
export type Side = 'gauche' | 'droite' | 'les_deux' | null;
export type EquipmentPreset = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'perso';
export type SessionStatus = 'prevue' | 'en_cours' | 'faite' | 'reportee' | 'sautee';
export type ShareDataType =
  | 'seances'
  | 'records'
  | 'regularite'
  | 'programme'
  | 'poids_corporel'
  | 'blessures'
  | 'nutrition';

export interface Profile extends SyncFields {
  displayName: string;
  /** Confirmation « j'ai 18 ans ou plus » (appli réservée aux majeurs). */
  adultConfirmedAt: string | null;
  healthDisclaimerAcceptedAt: string | null;
  level: Level | null;
  daysPerWeek: number | null;
  /** 0 = lundi ... 6 = dimanche */
  blockedWeekdays: number[];
  /** null = sans limite */
  sessionDurationMin: number | null;
  sports: string[];
  heightCm: number | null;
  aiEnabled: boolean;
  /** Ajoutés par F1 : peuvent manquer dans une ancienne sauvegarde (lire avec ?? null). */
  place?: TrainingPlace | null;
  /** Privé, jamais partagé, jamais envoyé à l'IA sans choix explicite. */
  pregnancy?: PregnancyStatus | null;
  /** Date de fin du parcours « profil en cartes » ; null = à faire (l'Accueil propose « Créer mon programme »). */
  profileCompletedAt?: string | null;
  /** Ajouté par F6 : décisions de progression (montée, descente, refus, niveau). Local, jamais partagé. Peut manquer. */
  progressionLog?: ProgressionEvent[];
  /**
   * Ajouté par la fonction « séance manquée » (knowledge/seance-manquee-v1.md SM-D4) : état de reprise douce. Donnée de santé :
   * locale, exportée, supprimée avec le compte, JAMAIS partagée. Absent = valeur par défaut (`repriseOf`, src/session/missed.ts).
   */
  reprise?: RepriseState;
  /** Option « Gagner du temps (exercices enchaînés par deux) » (core-et-supersets.md §12). Absent = non. */
  gagnerDuTemps?: boolean;
  /**
   * D31 (cardio-regles.md §3.2ter) : « Ajouter une séance de cardio ? » (force, muscle, perte de gras : absent = non) ou séance de
   * sport incluse (absent = oui). Réglage conservé, le programme est régénéré.
   */
  seanceCardio?: boolean;
  /** D30 (machines-etiquettes.md §2) : « J'ai accès à une salle ». Absent = non. */
  salleAccess?: boolean;
  /** D30 (cardio-regles.md §5.4) : « Je peux marcher ou courir dehors, sur un trajet sûr ». Absent = non ; aucune localisation. */
  exterieur?: boolean;
}

/** SM-D4 : état de reprise après une absence (un seul objet, sur le profil). */
export interface RepriseState {
  /** Palier en cours (0 à 4), figé au démarrage de la première séance de reprise. */
  palier: 0 | 1 | 2 | 3 | 4;
  actif: boolean;
  /** Jour de démarrage de la première séance de reprise (AAAA-MM-JJ). */
  depuis: string | null;
  /** Séances valables (SM-13) depuis `depuis`. */
  valables: number;
  /** Plancher imposé (symptôme, « pas bien ») : 0 ou 2, consommé au prochain démarrage. */
  palierMin: 0 | 2;
  /** Message de sécurité R5 + bouton T-22 pas encore pressé. */
  securiteALire: boolean;
  /** Charge de référence C0 par variante. */
  refKg: Record<string, number>;
  /** Charge à laquelle l'étalonnage a fait descendre l'exercice à la dernière séance de reprise. */
  descenteKg: Record<string, number>;
  /** « Je ne me sens pas bien » pas encore consommé par un démarrage (affiche T-19 à la reprise). */
  apresMalaise: boolean;
  /** Message de reprise (T-13/T-14/T-20/T-15) déjà affiché. */
  msgVu: boolean;
  /** Dernier jour où T-19 / T3 a été affiché (seul champ partagé avec le cardio). */
  conseilVuLe: string | null;
}

/** F6 (progression-et-bilan-v1.md §1) : ce que la personne a accepté ou refusé. Une ligne par décision. */
export type ProgressionEvent =
  | { type: 'montee' | 'descente'; movementId: string; from: number; to: number; variantId: string; at: string }
  | { type: 'refus'; kind: 'montee' | 'descente'; movementId: string; from: number; to: number; at: string }
  | { type: 'niveau'; accepted: boolean; at: string }
  /** Montée ou descente acceptée puis annulée parce que le programme a été régénéré entre-temps. */
  | { type: 'annule'; movementId: string; at: string };

export interface EquipmentProfile extends SyncFields {
  preset: EquipmentPreset;
  /** Tags de knowledge/equipment-taxonomy.md (hors implicites). */
  tags: string[];
  /** Implicites décochés par la personne (ex. pas de chaise stable). */
  disabledImplicit: string[];
  dumbbellWeightsKg: number[];
  kettlebellWeightsKg: number[];
  /** Ajoutés par D7 : peuvent manquer dans une ancienne sauvegarde (lire avec normalizeEquipment). */
  dumbbellKind?: 'fixes' | 'reglables' | null;
  /** Poids des disques disponibles (barre). */
  platesKg?: number[];
  /** Matériel non listé, texte libre : jamais utilisé comme tag de fiche. */
  other?: string;
}

export interface Goal extends SyncFields {
  goalKey: string;
  /** 1 = objectif prioritaire */
  rank: number;
}

export interface Injury extends SyncFields {
  zone: InjuryZone;
  side: Side;
  level: InjuryLevel;
  note: string;
  active: boolean;
  /** Zone cou : douleur depuis un choc, une chute, un accident ou un coup du lapin (règle C3) -> niveau 3. */
  afterShock?: boolean;
}

export type ExerciseUnit = 'reps' | 'sec' | 'reps_par_cote';
/** `cardio` (B4) : bloc ou séance de cardio, une « série » à durée (unit `sec`), effort modéré. */
export type ExerciseRole = 'pilier' | 'autre' | 'tronc' | 'fonctionnel' | 'cardio';
export interface WarmupSet {
  reps: number;
  /** Pourcentage de la charge de travail, ou null si on utilise un échelon. */
  percent: number | null;
  echelon: number | null;
}

export interface PlannedExercise {
  movementId: string;
  variantId: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  restSec: number;
  /** Même valeur = enchaînés en superset ; null = seul. */
  supersetGroup: string | null;
  // Ajoutés par F3 (generateur-v1.md §5.3) :
  /** Réserve cible (répétitions en réserve). */
  rirTarget: number;
  unit: ExerciseUnit;
  holdSec: number | null;
  warmupSets: WarmupSet[];
  role: ExerciseRole;
  /** Emplacement de la séance (generateur-v1.md §2.2), ex. `jambes_genou`. */
  slot: string;
  startLoadKg: number | null;
  /** Charge bloquée (charge:legere, niveau 2, grossesse) : jamais de hausse automatique. */
  capped: boolean;
  /** Case de sécurité appliquée (charge:legere, amplitude:<v>, appui:<v>), pour l'affichage. */
  adaptation: string | null;
  substitut: boolean;
  /**
   * Reprise douce (seance-manquee-v1.md SM-12), seulement sur la copie du plan d'une séance : étalonnage de nouveau, « garder /
   * descendre » seulement (sauf palier 4 séance 1), plafond C0. Absent hors reprise.
   */
  reprise?: { calibration: boolean; noRaise: boolean; maxKg: number | null } | null;
  /**
   * D26 (core-et-supersets.md SUP-2 point 7), seulement sur la copie du plan d'une séance : superset décidé à la génération mais
   * NON appliqué cette fois-ci, parce qu'un des deux exercices est en étalonnage ou en retour après gêne. Absent sinon.
   */
  pairDeferred?: 'etalonnage' | 'gene' | 'veille' | null;
  /** Cardio (cardio-regles.md §3.4 (g), STR-REP-7) : effort « facile » au lieu de « modéré ». Absent = modéré. */
  intensity?: 'moderee' | 'facile';
  /** STR-SEA-4 : dernières minutes du cardio en allure lente (comprises dans la durée). Absent = 0. */
  slowEndMin?: number;
  /** Rampe du débutant (cardio-regles.md §3.4 (f)) : exercice présent seulement à partir de cette semaine du programme. */
  fromWeek?: number;
  /**
   * D30 (cardio-regles.md §5.2) : série de sauts d'une séance dédiée : version douce nommée, version prévue douce ou non, T8 à
   * afficher avant. Absent hors sauts.
   */
  jump?: { soft: boolean; softVariantId: string | null; softNom: string | null; contacts: number };
  /** D30 (§5.4) : séance de marche faisable dehors (rappels T9 et alternative intérieure). Absent = intérieur. */
  outdoor?: boolean;
}

/** Échauffement d'une séance (F5) : exercices de la fiche, pas de série à saisir. */
export interface PlannedWarmupItem {
  ficheId: string;
  variantId: string;
  nom: string;
  sec: number;
}
export interface PlannedWarmup {
  generalSec: number;
  general: PlannedWarmupItem | null;
  mobility: PlannedWarmupItem[];
  cooldown: PlannedWarmupItem | null;
}

export interface ProgramDay {
  dayIndex: number;
  label: string;
  exercises: PlannedExercise[];
  // Ajoutés par F5 : peuvent manquer dans une ancienne sauvegarde.
  /** 0 = lundi ... 6 = dimanche. */
  weekday?: number;
  /** Durée affichée, arrondie aux 5 min supérieures. */
  estimatedMin?: number;
  warmup?: PlannedWarmup;
  /** D25 : type de séance (CE, HAUT, BAS, PUSH, PULL, LEGS). Absent = corps entier (ancienne sauvegarde). */
  sessionType?: string;
}

/** D25 (STR-REP-12) : jour léger proposé, jamais exigé : échauffement court et mobilité, sans charge ni séries comptées. */
export interface LightDay {
  weekday: number;
  estimatedMin: number;
  warmup: PlannedWarmup;
  /** D30 (STR-REP-12) : cardio doux facultatif (marche à plat, facile), absent si une zone ou la grossesse l'exclut. */
  cardio?: { ficheId: string; variantId: string; nom: string; minutes: number } | null;
}

export interface Program extends SyncFields {
  templateKey: string | null;
  name: string;
  split: 'corps_entier' | 'haut_bas' | 'haut_bas_ppl' | 'push_pull_legs' | 'perso';
  startDate: string;
  weeks: number;
  active: boolean;
  days: ProgramDay[];
  // Ajoutés par F5 : peuvent manquer dans une ancienne sauvegarde.
  /** Empreinte stable des entrées du générateur (profil, matériel, blessures, objectifs) : si elle change, on régénère. */
  inputsHash?: string;
  generatorVersion?: string;
  /** Explication de 2 lignes (V-EXPL) et messages du générateur (V-MSG-*), pour l'écran d'aperçu. */
  explanation?: string[];
  messages?: { id: string; text: string; session?: string; data?: Record<string, unknown> }[];
  durationMin?: number;
  /** Famille de l'objectif (muscle, force, sante), pour l'affichage. */
  family?: string;
  /** Empreinte du matériel seul, et vrai si ce programme remplace un programme généré avec un autre matériel (message à l'accueil). */
  equipmentHash?: string;
  equipmentChanged?: boolean;
  /**
   * SM-D3 : réponse à la carte « séance manquée », par jour manqué (AAAA-MM-JJ). Une régénération du programme l'efface (nouvelle ligne).
   * Peut manquer dans une ancienne sauvegarde.
   */
  missedAnswers?: Record<string, MissedAnswer>;
  /** D25 : jours légers (facultatifs) de la semaine type. Peut manquer. */
  lightDays?: LightDay[];
  /** D31 : état de l'option « Ajouter une séance de cardio ? » ou de la séance de sport incluse (aperçu, profil). Peut manquer. */
  cardioOption?: { kind: 'option' | 'sport'; offered: boolean; accepted: boolean; disabledReason: string | null } | null;
}

export interface MissedAnswer {
  reponse: 'decaler' | 'quand_je_peux' | 'sauter';
  at: string;
}

/** Position dans la séance (F5) : exercice du jour, série de travail, face du superset (0 = A, 1 = B), pas global. */
export interface SessionCursor {
  exercise: number;
  set: number;
  face: number;
  step: number;
}
/** `renonce` = « Sauter cette séance » ; `pas_bien` = « Je ne me sens pas bien » (seance-manquee-v1.md SM-D1) : status `sautee`, sans début ni fin. */
export type SessionEndReason = 'terminee' | 'abandon' | 'symptome' | 'renonce' | 'pas_bien';

export interface WorkoutSession extends SyncFields {
  programId: string | null;
  programDayIndex: number | null;
  plannedDate: string;
  status: SessionStatus;
  startedAt: string | null;
  endedAt: string | null;
  note: string;
  // Ajoutés par F5 (reprise après fermeture) : peuvent manquer dans une ancienne sauvegarde.
  cursor?: SessionCursor | null;
  /** Fin du repos en cours, en millisecondes (heure réelle) ; null = pas de repos. */
  restEndsAt?: number | null;
  restTotalMs?: number | null;
  restKind?: 'repos' | 'transition' | null;
  phase?: 'echauffement' | 'exercices' | 'fin' | null;
  skippedExercises?: number[];
  /** Exercices arrêtés par « ça fait mal » dans cette séance. */
  painExercises?: number[];
  /** Charge en cours par exercice (index -> kg), pour préremplir la série suivante. */
  loadsKg?: Record<string, number | null>;
  /** Copie du jour de programme suivi : la reprise ne dépend pas d'une régénération du programme. */
  plan?: ProgramDay | null;
  lastActionAt?: string | null;
  endReason?: SessionEndReason | null;
  /** Ajoutés par F6 : échelon changé pendant la séance (index d'exercice -> échelon, variante, échelon de départ) et exercices déjà décidés. */
  echelonSwitches?: Record<string, { echelon: number; variantId: string; from: number }>;
  calibDecided?: number[];
  /** Bilan calculé à la fin (recalculable à partir des séries) ; absent si séance abandonnée ou arrêtée par un symptôme. */
  summary?: Record<string, unknown> | null;
  // Ajoutés par « séance manquée » (SM-D1, SM-D2) : peuvent manquer dans une ancienne sauvegarde.
  /** Instant de la décision (reportée, sautée, pas bien) : clé de tri de la rotation (SM-18). */
  decidedAt?: string | null;
  /** Jour planifié d'origine D d'une séance décalée (lignes O et N, et la ligne `faite` qui en découle). */
  originDate?: string | null;
  /** Nouveau jour D' (ligne O seulement). */
  postponedTo?: string | null;
  /** Vrai sur la ligne N (et la séance faite qui en découle) : déjà décalée une fois (SM-6). */
  dejaDecalee?: boolean;
}

export interface SetLog extends SyncFields {
  sessionId: string;
  movementId: string;
  variantId: string;
  exerciseIndex: number;
  setIndex: number;
  targetRepsMin: number | null;
  targetRepsMax: number | null;
  reps: number | null;
  loadKg: number | null;
  /** Répétitions en réserve (« combien t'en restait-il ? »). */
  rir: number | null;
  /** Douleur signalée : pas de progression sur cet exercice (CLAUDE.md règle 11). */
  pain: boolean;
  comment: string;
  completedAt: string | null;
  // Ajoutés par F1 (generateur-v1.md §5.3) : peuvent manquer dans une ancienne sauvegarde.
  /** Réserve cible de la série. */
  targetRir?: number | null;
  isCalibration?: boolean;
  isWarmup?: boolean;
  /** Échelon de la variante faite (progression au poids du corps). */
  echelon?: number | null;
  /** Élastiques : résistance utilisée. */
  bandResistance?: string | null;
  /** Schémas à durée : secondes tenues. */
  holdSec?: number | null;
  side?: 'gauche' | 'droite' | null;
  capped?: boolean;
  /** Zone de la douleur signalée (« ça fait mal »), ou 'inconnu' (« je ne sais pas »). */
  painZone?: InjuryZone | 'inconnu' | null;
  /** Ajouté par F6 : repos réellement pris après cette série de travail (secondes), absent si sauté, interrompu ou hors travail. */
  restTakenSec?: number | null;
}

export interface BodyWeight extends SyncFields {
  date: string;
  kg: number;
}

export interface MealItem {
  /** Code aliment Ciqual. */
  foodCode: string;
  grams: number;
}

export interface Meal extends SyncFields {
  date: string;
  time: string | null;
  label: string;
  items: MealItem[];
}

export interface Supplement extends SyncFields {
  /** Enregistré par la personne, jamais prescrit par l'app. */
  name: string;
  doseAmount: number | null;
  doseUnit: string;
  frequency: string;
  startDate: string | null;
  endDate: string | null;
}

export interface Share extends SyncFields {
  dataType: ShareDataType;
  /** null = réglage par défaut pour tous les amis ; sinon un ami précis (phase 6). */
  friendId: string | null;
  enabled: boolean;
}

export type ReportChoice = 'consigne' | 'image' | 'douleur' | 'materiel' | 'autre';

/** Signalement d'un problème sur une fiche (D9). Privé ; visible de l'admin seulement une fois synchronisé (phase 6). */
export interface Report extends SyncFields {
  /** Id de la fiche (mouvement). */
  ficheId: string;
  /** Variante affichée au moment du signalement, ou null. */
  variantId: string | null;
  choice: ReportChoice;
  text: string;
}

/** Tables synchronisables : nom de table -> type. */
export interface SyncedTables {
  profile: Profile;
  equipment: EquipmentProfile;
  goals: Goal;
  injuries: Injury;
  programs: Program;
  sessions: WorkoutSession;
  sets: SetLog;
  bodyWeights: BodyWeight;
  meals: Meal;
  supplements: Supplement;
  shares: Share;
  signalements: Report;
}

export type TableName = keyof SyncedTables;
export type Row<T extends TableName> = SyncedTables[T];
/** Ce que l'appelant fournit : tout sauf les champs de base. */
export type NewRow<T extends TableName> = Omit<Row<T>, keyof SyncFields>;

export const TABLES: TableName[] = [
  'profile',
  'equipment',
  'goals',
  'injuries',
  'programs',
  'sessions',
  'sets',
  'bodyWeights',
  'meals',
  'supplements',
  'shares',
  'signalements',
];

/**
 * Réglages propres à l'appareil, jamais synchronisés ni exportés :
 * id de l'appareil, id local de l'utilisateur, clé API IA (CLAUDE.md règle 9c).
 */
export interface DeviceSettings {
  key: 'device';
  deviceId: string;
  localUserId: string;
  aiApiKey: string | null;
  lastSyncAt: string | null;
}

/** Partages : tout est privé par défaut (CLAUDE.md règle 7). */
export const DEFAULT_SHARES: Record<ShareDataType, boolean> = {
  seances: false,
  records: false,
  regularite: false,
  programme: false,
  poids_corporel: false,
  blessures: false,
  nutrition: false,
};

/** Types qui ne peuvent jamais être partagés sans un choix explicite de la personne. */
export const SENSITIVE_SHARE_TYPES: ShareDataType[] = ['poids_corporel', 'blessures', 'nutrition'];
