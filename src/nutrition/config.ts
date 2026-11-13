// Réglages de la nutrition (knowledge/nutrition-rules.md section K, CLAUDE.md règle 10).
// Toutes les valeurs PROVISOIRE sont ici, avec leur statut ; la logique (src/nutrition/*.ts) n'en contient aucune en dur.
// Statuts : OK = sourcé ; PROVISOIRE = règle d'app prudente validée par le nutritionniste ; (S) = touche la sécurité,
// contrôle du relecteur exigé avant toute mise en ligne de la fonctionnalité qui l'utilise.

/** Lissage exponentiel d'un point par semaine. PROVISOIRE (nutrition-rules.md D, K). */
export const ALPHA_HEBDO = 0.3;
/** Lissage de pesées quotidiennes (non utilisé en v1, une pesée par semaine). PROVISOIRE. */
export const ALPHA_QUOTIDIEN = 0.1;
/** Pesées minimales pour afficher une tendance et un rythme. PROVISOIRE (S). */
export const N_PESEES_MIN = 3;
/** Écart minimal (jours) entre la première et la dernière pesée du rythme. PROVISOIRE (S). */
export const RYTHME_JOURS_MIN = 14;
/** Semaines consécutives hors rythme avant d'agir. PROVISOIRE (S). */
export const N_SEMAINES_MIN = 3;
/** Pesée brute à plus de ce nombre de kg de la tendance = écart ponctuel. PROVISOIRE. */
export const ECART_HASARD_KG = 1.5;
/** Écart d'une semaine à l'autre (kg) qui déclenche « vérifie ta balance ». PROVISOIRE (S). */
export const ALERTE_SAUT_KG = 2.0;
/** Bornes de validation de la saisie. PROVISOIRE (S) : règle d'app (nutrition-rules.md A). */
export const POIDS_KG_MIN = 35;
export const POIDS_KG_MAX = 300;
export const TAILLE_CM_MIN = 120;
export const TAILLE_CM_MAX = 230;
export const AGE_MIN = 18;
export const AGE_MAX = 100;

/** Mise à l'échelle des portions d'une recette. PROVISOIRE. */
export const ECHELLE_MIN = 0.5;
export const ECHELLE_MAX = 1.75;

/** Numéro de version du générateur de plan (invalide un plan périmé). */
export const NUTRITION_VERSION = 'N0.1';

// --- Besoins et plancher (nutrition-rules.md A et C). PROVISOIRE (S) : relecteur obligatoire avant mise en ligne. ---
/** Facteurs d'activité par nombre de séances de musculation par semaine (points médians FAO/WHO/UNU 2004). */
export const PAL_BY_SESSIONS: ReadonlyArray<{ maxSessions: number; pal: number }> = [
  { maxSessions: 1, pal: 1.4 },
  { maxSessions: 3, pal: 1.55 },
  { maxSessions: 5, pal: 1.7 },
  { maxSessions: 99, pal: 1.85 },
];
/** Filet de sécurité du plancher (kcal/j) : jamais seul, toujours en plus du métabolisme de repos. */
export const FILET_KCAL = { homme: 1500, femme: 1200 } as const;
/** Rythme de perte visé (% du poids par semaine) selon le cran du curseur ; plafond dur 1,0. */
export const PERTE_PCT_SEMAINE = { doux: 0.5, standard: 0.75, ferme: 1.0 } as const;
export const PERTE_PCT_PLAFOND = 1.0;
/** Déficit plafonné : le plus petit de 25 % du besoin et 750 kcal/j ; 10 % du besoin à partir de 65 ans. */
export const DEFICIT_MAX_PCT = 0.25;
export const DEFICIT_MAX_KCAL = 750;
export const DEFICIT_MAX_PCT_65 = 0.1;
export const AGE_PRUDENT = 65;
/** Surplus de prise : pourcentage du besoin selon le cran, plafonné à +300 kcal/j. */
export const SURPLUS_PCT = { doux: 0.05, standard: 0.1, ferme: 0.15 } as const;
export const SURPLUS_MAX_KCAL = 300;
/** Approximation de l'énergie d'un kg de poids (Wishnofsky), fourchette 5000-7700 : jamais une promesse. */
export const KCAL_PAR_KG = 7700;
/** IMC : sous 18,5 aucun calcul (Repères seulement) ; sous 22 aucun déficit chiffré. */
export const IMC_REPERES = 18.5;
export const IMC_SANS_DEFICIT = 22;
