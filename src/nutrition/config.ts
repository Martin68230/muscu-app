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
