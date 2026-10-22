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

export const SCHEMA_VERSION = 1;

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
export type InjuryZone = 'cou' | 'epaule' | 'coude' | 'poignet' | 'dos' | 'hanche' | 'genou' | 'cheville';
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
}

export interface EquipmentProfile extends SyncFields {
  preset: EquipmentPreset;
  /** Tags de knowledge/equipment-taxonomy.md (hors implicites). */
  tags: string[];
  /** Implicites décochés par la personne (ex. pas de chaise stable). */
  disabledImplicit: string[];
  dumbbellWeightsKg: number[];
  kettlebellWeightsKg: number[];
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

export interface PlannedExercise {
  movementId: string;
  variantId: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  restSec: number;
  /** Même valeur = enchaînés en superset ; null = seul. */
  supersetGroup: string | null;
}

export interface ProgramDay {
  dayIndex: number;
  label: string;
  exercises: PlannedExercise[];
}

export interface Program extends SyncFields {
  templateKey: string | null;
  name: string;
  split: 'corps_entier' | 'haut_bas' | 'push_pull_legs' | 'perso';
  startDate: string;
  weeks: number;
  active: boolean;
  days: ProgramDay[];
}

export interface WorkoutSession extends SyncFields {
  programId: string | null;
  programDayIndex: number | null;
  plannedDate: string;
  status: SessionStatus;
  startedAt: string | null;
  endedAt: string | null;
  note: string;
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
