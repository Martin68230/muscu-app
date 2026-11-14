// Réglages de la nutrition (knowledge/nutrition-rules.md section K, CLAUDE.md règle 10).
// Toutes les valeurs PROVISOIRE sont ici, avec leur statut ; la logique (src/nutrition/*.ts) n'en contient aucune en dur.
// Statuts : OK = sourcé ; PROVISOIRE = règle d'app prudente, rédigée par le nutritionniste, validation finale en attente
// (knowledge/nutrition-rules.md sections A, C, K) ; (S) = touche la sécurité, contrôle du relecteur exigé avant mise en ligne.

/** Lissage exponentiel d'un point par semaine. PROVISOIRE (nutrition-rules.md D, K). */
export const ALPHA_HEBDO = 0.3;
/** Lissage de pesées quotidiennes (non utilisé en v1, une pesée par semaine). PROVISOIRE. */
export const ALPHA_QUOTIDIEN = 0.1;
/** Pesées minimales pour afficher une tendance et un rythme. PROVISOIRE (S). */
export const N_PESEES_MIN = 3;
/** Écart minimal (jours) entre la première et la dernière pesée du rythme. PROVISOIRE (S). */
export const RYTHME_JOURS_MIN = 14;
/** Semaines de pesées (>= 3 points) avant de décider un recalage (K). Non utilisé avant le lot de recalage. PROVISOIRE (S). */
export const N_SEMAINES_MIN = 3;
/** Semaines consécutives hors rythme pour l'alerte de rythme (K). Non utilisé avant le lot d'alertes. PROVISOIRE (S). */
export const N_SEMAINES_ALERTE = 2;
/** Maintien : rythme absolu (kg/semaine) sous lequel le poids est dit « stable ». PROVISOIRE. */
export const STABLE_KG_SEMAINE = 0.15;
/** Tolérance autour du rythme visé : de 75 % à 125 % = « dans le rythme ». PROVISOIRE. */
export const RYTHME_TOL_BAS = 0.75;
export const RYTHME_TOL_HAUT = 1.25;
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
/** IMC entre 22 et ce seuil : perte limitée au cran « doux » (0,5 %/semaine), règle C. PROVISOIRE (S). */
export const IMC_PERTE_LENTE = 25;
/** Âge prudent : le surplus est limité à ce pourcentage du besoin. PROVISOIRE (S). */
export const SURPLUS_PCT_PRUDENT = 0.05;

// --- Besoins par jour selon les séances (nutrition-rules.md B et K). PROVISOIRE (S). ---
/** Poids relatifs par type de jour (la fonction les normalise pour une moyenne hebdomadaire exactement égale à 1). « moyen » : 1,02, ajouté par le dev, à valider. */
export const COEF_JOUR = { repos: 0.92, leger: 0.98, moyen: 1.02, lourd: 1.06, intense: 1.1 } as const;
/** Écart maximal d'un jour par rapport à la moyenne, en kcal (K : AJUSTEMENT_JOUR_MAX). */
export const AJUSTEMENT_JOUR_MAX_KCAL = 300;
/** Séance prévue d'au moins ce nombre de minutes = jour lourd (K). */
export const JOUR_LOURD_MIN = 75;
/** Séances dont le type compte comme « jour lourd » (jambes, bas du corps, corps entier). */
export const SESSION_TYPES_LOURDS: readonly string[] = ['BAS', 'LEGS', 'CE'];
/** Protéines g/kg/jour par objectif (règle B : 1,6-2,2 entretien et prise ; 2,2-3,0 en déficit) : valeurs basses prudentes. */
export const PROT_GKG = { perte: 2.2, maintien: 1.8, prise: 1.8 } as const;
/** Variation des protéines : jusqu'à ce pourcentage du jour moyen, sur 1 à 2 jours par semaine seulement (décision du 13/11/2026). */
export const VAR_PROT = 0.1;
/** Lipides : plancher en g/kg (OK, Ruiz-Castellano 2021) et part minimale de l'énergie. */
export const LIP_MIN_GKG = 0.5;
export const LIP_MIN_PCT_ENERGIE = 0.2;
/** Glucides minimaux en g/kg par type de jour (règle B, plage basse, PROVISOIRE) : en dessous, un signalement est renvoyé. */
export const GLUC_MIN_GKG = { repos: 2, leger: 3, moyen: 3, lourd: 4, intense: 5 } as const;

// --- Plan de repas (nutrition-rules.md K, TOL_MACRO). PROVISOIRE. ---
/** Écart d'énergie toléré par repas entre la portion mise à l'échelle et la cible du repas (±10 %). */
export const TOL_KCAL_REPAS = 0.1;

// --- Alertes et recalage (nutrition-rules.md C, D, E, K). PROVISOIRE (S). ---
/** Ajustement hebdomadaire maximal de la cible (kcal/j) et cumul maximal (part du besoin initial). */
export const AJUSTEMENT_MAX_KCAL = 150;
export const AJUSTEMENT_CUMUL_PCT = 0.15;
/** Gel des déficits : perte du poids lissé supérieure à ces seuils (règle E). */
export const GEL_PERTE_PCT_SEMAINE = 2;
export const GEL_PERTE_PCT_MOIS = 5;

// --- Valeurs du plan sorties du code (relecture du 13/11/2026). PROVISOIRE. ---
/** Part de l'énergie du jour par repas selon le nombre de repas. */
export const PART_REPAS = {
  3: [0.25, 0.4, 0.35],
  4: [0.22, 0.33, 0.12, 0.33],
  5: [0.2, 0.1, 0.3, 0.1, 0.3],
} as const;
/** Tolérance d'énergie d'un jour du plan par rapport à sa cible (±5 %, règle K). */
export const TOL_KCAL_JOUR = 0.05;
/** Arrondi des grammes d'un ingrédient ajustable. */
export const ARRONDI_GRAMMES = 5;
/** Poids du score de choix d'une recette. */
export const SCORE = { ecartKcal: 10, repetition: 6, repetitionSemaineDerniere: 3, memeProteine: 2, dejaDansPanier: 1.2, nouveauPerissable: 1.0, nouveauNonPerissable: 0.4, bruit: 0.5 } as const;
/** Tolérance du recalage : au moins 0,1 kg/semaine et 25 % du rythme visé. */
export const RECALAGE_TOL_MIN_KG = 0.1;
export const RECALAGE_TOL_PCT = 0.25;

/** Rythme de prise visé (% du poids par semaine) : borne basse de la règle C (0,25 à 0,5 %). PROVISOIRE (S). */
export const PRISE_PCT_SEMAINE = 0.25;

/** Eau totale (boissons et aliments) en litres par jour : repère EFSA pour l'adulte (rules : OK via communiqué, texte à relire). Hors surcroît d'entraînement. */
export const EAU_TOTALE_L = { homme: 2.5, femme: 2.0 } as const;

// --- Plan hebdomadaire et repas optionnels (spec, annexe du 14/11/2026). PROVISOIRE. ---
/** Part de l'énergie du jour des repas optionnels (nominale) ; le total optionnel est plafonné. */
export const PART_OPTIONNEL = { petitDej: 0.2, gouter: 0.1, encas: 0.08 } as const;
export const PART_OPTIONNEL_MAX = 0.4;
/** Les deux repas principaux se partagent le reste : déjeuner / dîner. */
export const PART_DEJEUNER = 0.55;
/** En-cas : jusqu'à ce nombre par jour, et pièces d'une recette de lot mangées par prise. */
export const ENCAS_MAX_PAR_JOUR = 2;
export const PIECES_MAX_PAR_PRISE = 3;
/** Tolérance d'énergie d'un repas optionnel (pièces entières) par rapport à sa part nominale. */
export const TOL_KCAL_OPTIONNEL = 0.35;
/** Bonus de score pour une recette de lot déjà choisie sur le même créneau (préparation en lot). */
export const BONUS_LOT = 3;
/** Repli : si aucune recette ne tient dans la tolérance du repas, la plus proche (écart <= 60 %) est choisie plutôt qu'une case vide ; le jour est alors signalé « écart ». */
export const TOL_KCAL_REPLI = 0.6;
