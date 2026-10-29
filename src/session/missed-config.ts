// Réglages de la fonction « séance manquée, reportée, sautée » et de la « reprise douce » : knowledge/seance-manquee-v1.md
// (révision 3, recontrôle relecteur : VALIDÉ SOUS RÉSERVE ; NR-1 à NR-5 corrigés ; corrections kine 2 §12 prioritaires).
//
// Fichier UNIQUE de configuration (CLAUDE.md règle 10) : la logique (missed.ts, reprise.ts) ne contient aucune de ces valeurs en dur.
// Statut de chaque valeur en commentaire. Sauf mention, tout est NON SOURCÉ (choix prudent de conception, validé par coach, kine
// et relecteur dans le fichier ci-dessus) ; à confirmer par l'utilisateur (docs/QUESTIONS.md Q30 et suivantes).
import type { RepriseState } from '../data/model';

export interface RepriseTier {
  palier: 1 | 2 | 3 | 4;
  /** Bornes de `joursAbsence` (incluses ; `max` null = sans limite). */
  min: number;
  max: number | null;
  /** Séances valables avant toute proposition de montée (SM-13). */
  seuil: number;
  /** Baisse de charge (en % entier) de la séance j = 1, 2, 3… (vide au palier 4 : étalonnage depuis la charge légère). */
  baisses: number[];
  /** Nombre de séances (j = 1, 2…) faites à l'échelon -1 au poids du corps. */
  echelonMoinsUnSeances: number;
  /** Une série de moins sur chaque exercice « autre » à >= 3 séries (toutes les séances de reprise). */
  retirerSerie: boolean;
  /** Conseil T-19 à l'entrée du palier (K7). */
  conseil: boolean;
}

export const MISSED = {
  /** SM-12 : palier 0 = 0 à 9 jours (rien ne change). Seuil 9/10 j NON SOURCÉ ; SM-S1 (PROVISOIRE) : force inchangée jusqu'à ~28 j. */
  paliers: [
    // Palier 1 : 10-14 j ; -20 % (avis d'auteur pour < 1 mois, SM-S1, PROVISOIRE) puis -10 % (NON SOURCÉ) ; 2 séances valables (NON SOURCÉ, kine 2).
    { palier: 1, min: 10, max: 14, seuil: 2, baisses: [20, 10], echelonMoinsUnSeances: 1, retirerSerie: false, conseil: false },
    // Palier 2 : 15-27 j ; -20 % puis -10 % ; 1 série de moins sur « autre » >= 3 ; 2 séances valables. Borne 15 j alignée sur le cardio. NON SOURCÉ.
    { palier: 2, min: 15, max: 27, seuil: 2, baisses: [20, 10], echelonMoinsUnSeances: 1, retirerSerie: true, conseil: false },
    // Palier 3 : 28-55 j ; -30 / -20 / -10 % (choix de l'app entre les deux avis de la source) ; 3 séances valables ; T-19. NON SOURCÉ.
    { palier: 3, min: 28, max: 55, seuil: 3, baisses: [30, 20, 10], echelonMoinsUnSeances: 2, retirerSerie: true, conseil: true },
    // Palier 4 : 56 j et plus ; étalonnage depuis la charge légère, plafonné à C0 ; 3 séances valables ; T-19. NON SOURCÉ (kine 2 : 56 j).
    { palier: 4, min: 56, max: null, seuil: 3, baisses: [], echelonMoinsUnSeances: 0, retirerSerie: false, conseil: true },
  ] as readonly RepriseTier[],
  /** RC-8 : au-delà de ce nombre de jours, C0 est ignorée (personne traitée comme non entraînée). « Un an » de SM-S1 ; NON SOURCÉ pour le reste. */
  c0IgnoreeApresJours: 365,
  /** K1(b), K7(b) : plancher de palier après un symptôme ou un « Je ne me sens pas bien ». NON SOURCÉ. */
  palierMinApresMalaise: 2 as const,
  /** K5 : jamais sous 2 séries par exercice conservé (ACSM 2026 : OK) ; G5 (grossesse) peut être plus bas. */
  seriesMin: 2,
  /** SM-5, K4 : 2 jours civils entre deux séances de musculation (48 h : PROVISOIRE, program-logic.md §2 ; « tous muscles » NON SOURCÉ). */
  ecartJoursMin: 2,
  /** K4 : 48 h réelles depuis la fin d'une séance déjà faite (PROVISOIRE). */
  ecartHeuresMin: 48,
  /** SM-9 : compensation de volume = 0 série (limite choisie, NON SOURCÉ ; docs/QUESTIONS.md Q30). Non codée au-delà de 0. */
  compensationSeries: 0,
} as const;

/** SM-D4 : valeur par défaut (anciennes sauvegardes, premier usage). */
export const DEFAULT_REPRISE: RepriseState = {
  palier: 0,
  actif: false,
  depuis: null,
  valables: 0,
  palierMin: 0,
  securiteALire: false,
  apresMalaise: false,
  refKg: {},
  descenteKg: {},
  msgVu: false,
  conseilVuLe: null,
};

/** État de reprise d'un profil : champs absents remplacés par la valeur par défaut (migration des anciennes sauvegardes). */
export function repriseOf(profile: { reprise?: Partial<RepriseState> | null } | null | undefined): RepriseState {
  const r = profile?.reprise ?? {};
  return {
    ...DEFAULT_REPRISE,
    ...r,
    refKg: { ...(r.refKg ?? {}) },
    descenteKg: { ...(r.descenteKg ?? {}) },
  };
}

export function tierOf(palier: number): RepriseTier | null {
  return MISSED.paliers.find((t) => t.palier === palier) ?? null;
}
