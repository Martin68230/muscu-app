// Types du générateur v1 (knowledge/generateur-v1.md). Entrées = profil, matériel, blessures, objectifs, fiches,
// historique ; sortie = programme ou « pas de programme ». Aucune valeur sportive ici.
import type {
  EquipmentProfile, ExerciseRole, ExerciseUnit, Injury, Level, PlannedExercise, PregnancyStatus, TrainingPlace, WarmupSet,
} from '../data/model';
import type { CoreFamily, Family, GG } from './config';

// ----- Fiches (format de public/data/fiches.json, produit par tools/build-fiches.mjs) -----
export interface SafetyCase {
  action: 'garder' | 'adapter' | 'retirer';
  variante?: string;
  remplacant?: string;
  sansZone?: string;
  charge?: string;
  sansCharge?: boolean;
  amplitude?: string;
  appui?: string;
}
export interface FicheVariant {
  id: string;
  nom: string;
  echelon: number;
  niveau: Level;
  tags: string[];
  installation?: string;
}
export interface Fiche {
  id: string;
  nom: string;
  schema: string;
  type: string;
  niveauMin: Level;
  statut: string;
  musclesPrincipaux: string[];
  musclesSecondaires: string[];
  couverture?: string;
  douxPour: string[];
  /** Champ futur (V-ADM 5) : fiche « technique » (épaulé, arraché…) : proposée à personne en v1. */
  technique?: boolean | string;
  /** D26 (CORE-FAM-1) : famille de core facultative (gainage, anti_rotation, rotation, flexion, extension). */
  familleCore?: string;
  variantes: FicheVariant[];
  securite: {
    zones: Record<string, SafetyCase[]>;
    grossesse: SafetyCase;
    versionPlusDouce?: string | null;
    notes?: Record<string, string>;
  };
}

// ----- Entrées -----
export interface HistorySet {
  variantId: string;
  loadKg: number | null;
  completedAt: string | null;
  pain: boolean;
  echelon?: number | null;
}
export type InjuryInput = Pick<Injury, 'zone' | 'level' | 'active'> & { deletedAt?: string | null; afterShock?: boolean };
export interface GeneratorInput {
  profile: {
    level?: Level | null;
    daysPerWeek?: number | null;
    blockedWeekdays?: number[];
    /** null = sans limite ; undefined = non renseigné (45 min, V-DEF). */
    sessionDurationMin?: number | null;
    place?: TrainingPlace | null;
    pregnancy?: PregnancyStatus | null;
  };
  equipment: Pick<EquipmentProfile, 'preset' | 'tags' | 'disabledImplicit' | 'dumbbellWeightsKg' | 'kettlebellWeightsKg'> & {
    platesKg?: number[];
  };
  injuries?: InjuryInput[];
  /** Objectifs classés ; le rang 1 décide (V-OBJ) ; `cardio` en rang 2 ou plus ajoute des blocs limités (B4). */
  goals?: { goalKey: string; rank: number }[];
  fiches: Fiche[];
  history?: HistorySet[];
  options?: {
    /** Option « gagner du temps » : supersets dès la génération (V-SUP). Défaut : non. */
    gagnerDuTemps?: boolean;
    /** Option « ajouter du fonctionnel » (emplacement 9). Défaut : non. */
    ajouterFonctionnel?: boolean;
    /** Charge habituelle déclarée (« pour 10 répétitions »), par id de variante ou de fiche. */
    habitualLoadsKg?: Record<string, number>;
    favoris?: string[];
    masques?: string[];
  };
}

// ----- Sortie -----
export type MessageId =
  | 'V-MSG-FREQ' | 'V-MSG-PLANS' | 'V-MSG-PLAN' | 'V-MSG-SUBST' | 'V-MSG-IMPOS' | 'V-MSG-ZONE' | 'V-MSG-ACHAT' | 'V-MSG-OBJET'
  | 'V-MSG-FORCE' | 'V-MSG-VOL' | 'V-MSG-DUREE' | 'V-MSG-JOURS' | 'V-MSG-HORS' | 'V-MSG-JOURS2' | 'V-MSG-PRO'
  | 'V-MSG-GROS-DUREE' | 'V-MSG-GROS-AVIS' | 'V-MSG-TRONC' | 'V-MSG-EPAULES' | 'R3' | 'C3' | 'V-MSG-DUREE-MIN' | 'V-MSG-OBJ'
  // Cardio (B4, knowledge/cardio-regles.md) : textes de `kine` T0-T5 et messages du générateur.
  | 'T0' | 'T1' | 'T1u' | 'T3' | 'T4' | 'T5' | 'V-MSG-CARDIO-OMS' | 'V-MSG-CARDIO-TEMPS' | 'V-MSG-CARDIO-IMPOS' | 'V-MSG-CARDIO-MACHINE'
  | 'V-MSG-CARDIO-JOURS';
export interface GenMessage {
  id: MessageId;
  text: string;
  /** Séance concernée, si le message en vise une. */
  session?: string;
  /** V-MSG-JOURS2 : bouton « Modifier mes jours ». */
  action?: { label: string; target: 'jours-bloques' };
  /** Données utiles à l'affichage (zones citées, groupe, etc.). */
  data?: Record<string, unknown>;
}

export type SlotKey =
  | 'jambes_genou' | 'poussee_1' | 'tirage_1' | 'charniere' | 'tronc' | 'poussee_2' | 'tirage_2' | 'jambes_2' | 'fonctionnel';
export type Tier = 'a' | 'b' | 'c' | 'd' | 'e';

export interface GenExercise extends PlannedExercise {
  slot: SlotKey;
  ficheId: string;
  nom: string;
  variantNom: string;
  echelon: number;
  schema: string;
  chargeable: boolean;
  unilateral: boolean;
  /** false pour les schémas à durée/par côté (V-TEMPS) : pas de question « combien t'en restait-il ? ». */
  rirAsked: boolean;
  /** Première fois pour cette variante (aucune série faite) : séance d'étalonnage (V-ETAL). */
  isCalibration: boolean;
  /** Toutes les cases appliquées (amplitude:…, appui:…, charge:legere, variante:…, sans-charge). */
  adaptations: string[];
  /** Notes de sécurité de la fiche pour les cases appliquées (`<zone>-n<niveau>`, `grossesse`). */
  notes: string[];
  /** Fiche d'origine quand ce n'est pas elle qui est placée (remplaçant). */
  replaces: string | null;
  /** Niveau de repli de l'emplacement (§7.1). */
  tier: Tier;
  musclesPrincipaux: string[];
  musclesSecondaires: string[];
  /** D26 : tags de matériel de la variante (SUP-0, CORE-ORD-4). */
  tags: string[];
  /** D26 : famille de core (CORE-FAM-1), null hors core. */
  coreFamily: CoreFamily | null;
  /** D26 : niveau de la variante placée (SUP-3 : jamais `avance` en superset). */
  niveau: Level;
  /** D26 (SUP-2 point 4) : la fiche a une ligne `dos` dont la case du niveau 1 n'est pas `garder` (lecture de `dev`). */
  backLoaded: boolean;
  /** Ligne courte « Charge maintenue : gêne {zone} » (§6.8 point 1g), ou null. */
  cappedLabel: string | null;
}
export interface WarmupItem {
  ficheId: string;
  variantId: string;
  nom: string;
  sec: number;
  adaptations: string[];
}
/** Cardio (B4) : un bloc après la musculation, ou une séance dédiée ; effort modéré seulement en v1. */
export interface CardioItem {
  kind: 'bloc' | 'seance';
  ficheId: string;
  variantId: string;
  nom: string;
  /** Durée de la semaine 1 (min). */
  minutes: number;
  /** Plan des 4 semaines du bloc (min) : +10 % au plus, arrondi vers le bas, plafonné ; 4e semaine allégée (cardio-regles.md §3.5). */
  weekMin: number[];
  /** Plafond retenu (niveau, temps disponible, 25 % en secondaire). */
  capMin: number;
  intensity: 'moderee';
  /** Repère affiché pendant l'effort (T7 de `kine`). */
  note: string;
}
export interface GenCardioSession {
  /** Libellé affiché : « Cardio », « Cardio 2 »… */
  label: string;
  weekday: number;
  cardio: CardioItem;
  estimatedMin: number;
}
export interface GenSession {
  label: 'A' | 'B' | 'C';
  /** 0 = lundi … 6 = dimanche. */
  weekday: number;
  warmup: { general: WarmupItem | null; generalSec: number; mobility: WarmupItem[]; cooldown: WarmupItem | null };
  exercises: GenExercise[];
  estimatedSec: number;
  /** Durée affichée, arrondie aux 5 min supérieures. */
  estimatedMin: number;
  /** Emplacements du noyau retirés par l'action 6 (V-DUREE). */
  removedCore: SlotKey[];
  /** Séance réduite aux piliers qui dépasse encore la durée choisie (seul cas où T > D). */
  overBudget: boolean;
  /** Bloc de cardio après la musculation (B4), ou absent. */
  cardio?: CardioItem | null;
  /** Durée totale estimée (s) : musculation + bloc de cardio. */
  totalSec?: number;
}
export interface GenProgram {
  split: 'corps_entier';
  weeks: number;
  level: Level;
  family: Family;
  goalKey: string | null;
  pregnancy: boolean;
  /** Durée retenue (min) pour la garantie T <= D ; `targetMin` = durée affichée (« sans limite » : 60). */
  durationMin: number;
  targetMin: number;
  sessions: GenSession[];
  /** Exactement 2 lignes (V-EXPL). */
  explanation: [string, string];
  messages: GenMessage[];
  coverage: Record<GG, number>;
  substitutes: { session: string; slot: SlotKey; ficheId: string; nom: string; schema: string }[];
  achat: { tag: string; gain: number } | null;
  /** Cardio (B4) : rôle de l'objectif cardio, séances dédiées, total de la semaine 1 (min). */
  cardioRole?: 'principal' | 'secondaire' | null;
  cardioSessions?: GenCardioSession[];
  cardioMinWeek?: number;
}
export type GenerateResult =
  | { ok: true; program: GenProgram; messages: GenMessage[] }
  | { ok: false; code: 'HORS' | 'JOURS2' | 'PRO' | 'IMPOS'; messages: GenMessage[] };

export type { ExerciseRole, ExerciseUnit, WarmupSet };
