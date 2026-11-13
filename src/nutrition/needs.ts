// Dépistage et besoins énergétiques (docs/nutrition-spec.md N2, §5.5 ; nutrition-rules.md A, C, E).
// Fonctions PURES. Échec sûr : donnée manquante, doute ou refus de répondre = « Repères seulement » (aucune cible chiffrée).

import {
  AGE_MAX, AGE_MIN, AGE_PRUDENT, DEFICIT_MAX_KCAL, DEFICIT_MAX_PCT, DEFICIT_MAX_PCT_65, FILET_KCAL, IMC_REPERES,
  IMC_PERTE_LENTE, IMC_SANS_DEFICIT, KCAL_PAR_KG, SURPLUS_PCT_PRUDENT, PAL_BY_SESSIONS, PERTE_PCT_PLAFOND, PERTE_PCT_SEMAINE, POIDS_KG_MAX, POIDS_KG_MIN,
  SURPLUS_MAX_KCAL, SURPLUS_PCT, TAILLE_CM_MAX, TAILLE_CM_MIN,
} from './config';

export type Answer = 'non' | 'oui' | 'refus' | null;
export type Sex = 'homme' | 'femme' | 'non_precise' | null;
export type Pace = 'doux' | 'standard' | 'ferme';
export type GoalKind = 'perte' | 'maintien' | 'prise';
export type ScreenResult = 'libre' | 'prudent' | 'reperes';

/** Questions bloquantes (nutrition-rules.md E). `null` = pas encore répondu. */
export interface ScreeningAnswers {
  grossesse: Answer;
  allaitement: Answer;
  postPartum: Answer;
  maladie: Answer;
  rapportAlimentation: Answer;
  medicament: Answer;
}

export interface Body {
  sex: Sex;
  kg: number | null;
  cm: number | null;
  age: number | null;
}

export function bmi(kg: number, cm: number): number {
  const m = cm / 100;
  return kg / (m * m);
}

function validBody(b: Body): b is { sex: 'homme' | 'femme'; kg: number; cm: number; age: number } {
  return (
    (b.sex === 'homme' || b.sex === 'femme') &&
    b.kg != null && b.kg >= POIDS_KG_MIN && b.kg <= POIDS_KG_MAX &&
    b.cm != null && b.cm >= TAILLE_CM_MIN && b.cm <= TAILLE_CM_MAX &&
    b.age != null && b.age >= AGE_MIN && b.age <= AGE_MAX
  );
}

/** Métabolisme de repos, Mifflin-St Jeor (1990) : 10 kg + 6,25 cm - 5 âge + 5 (homme) ou - 161 (femme). */
export function restingEnergy(b: { sex: 'homme' | 'femme'; kg: number; cm: number; age: number }): number {
  return 10 * b.kg + 6.25 * b.cm - 5 * b.age + (b.sex === 'homme' ? 5 : -161);
}

export function palFor(sessionsPerWeek: number): number {
  // Valeur invalide (NaN, négative) : facteur le plus bas, jamais le plus haut.
  const n = Number.isFinite(sessionsPerWeek) && sessionsPerWeek > 0 ? sessionsPerWeek : 0;
  const row = PAL_BY_SESSIONS.find((r) => n <= r.maxSessions);
  return (row ?? PAL_BY_SESSIONS[PAL_BY_SESSIONS.length - 1]).pal;
}

/**
 * Dépistage. Libre = tout répondu « non » et données complètes ; Prudent = idem avec 65 ans ou plus ;
 * Repères seulement dans tous les autres cas (oui, refus, non répondu, donnée manquante ou hors bornes, IMC < 18,5).
 */
export function screenNutrition(answers: ScreeningAnswers, body: Body): ScreenResult {
  const all: Answer[] = [
    answers.grossesse, answers.allaitement, answers.postPartum, answers.maladie, answers.rapportAlimentation, answers.medicament,
  ];
  if (!all.every((a) => a === 'non')) return 'reperes';
  if (!validBody(body)) return 'reperes';
  if (bmi(body.kg, body.cm) < IMC_REPERES) return 'reperes';
  return body.age >= AGE_PRUDENT ? 'prudent' : 'libre';
}

export interface NeedsInput {
  screen: ScreenResult;
  body: Body;
  sessionsPerWeek: number;
  goal: GoalKind;
  pace: Pace;
}

export interface Needs {
  /** Besoin estimé (maintien), kcal/j. */
  tdee: number;
  resting: number;
  /** Plancher du jour : max(métabolisme de repos, filet). */
  floor: number;
  /** Cible moyenne, kcal/j, jamais sous le plancher (sauf maintien si le besoin lui-même est inférieur, voir `floorBinding`). */
  target: number;
  /** Écart appliqué au besoin (négatif = déficit). */
  deltaKcal: number;
  /** Le plancher a empêché ou réduit le déficit. */
  floorBinding: boolean;
  /** Le déficit est refusé pour un motif d'IMC ou d'âge. */
  noDeficitReason: 'imc' | null;
}

/** null = aucun chiffre à afficher (Repères seulement ou données invalides). */
export function computeNeeds(input: NeedsInput): Needs | null {
  if (input.screen === 'reperes' || !validBody(input.body)) return null;
  const b = input.body;
  // Le dépistage n'est pas pris sur parole : IMC bas = aucun chiffre ; 65 ans ou plus = prudent quoi qu'on passe.
  if (bmi(b.kg, b.cm) < IMC_REPERES) return null;
  const screen: ScreenResult = b.age >= AGE_PRUDENT ? 'prudent' : input.screen;
  const resting = restingEnergy(b);
  const tdee = resting * palFor(input.sessionsPerWeek);
  const floor = Math.max(resting, FILET_KCAL[b.sex]);
  const imc = bmi(b.kg, b.cm);
  let delta = 0;
  let noDeficitReason: 'imc' | null = null;

  if (input.goal === 'perte') {
    if (imc < IMC_SANS_DEFICIT) {
      noDeficitReason = 'imc';
    } else {
      const pace: Pace = imc < IMC_PERTE_LENTE ? 'doux' : input.pace;
      const pct = Math.min(PERTE_PCT_SEMAINE[pace], PERTE_PCT_PLAFOND);
      const wanted = ((b.kg * pct) / 100) * (KCAL_PAR_KG / 7);
      const cap = screen === 'prudent'
        ? tdee * DEFICIT_MAX_PCT_65
        : Math.min(tdee * DEFICIT_MAX_PCT, DEFICIT_MAX_KCAL);
      delta = -Math.min(wanted, cap);
    }
  } else if (input.goal === 'prise') {
    delta = Math.min(tdee * SURPLUS_PCT[input.pace], SURPLUS_MAX_KCAL);
    if (screen === 'prudent') delta = Math.min(delta, tdee * SURPLUS_PCT_PRUDENT);
  }

  let target = tdee + delta;
  let floorBinding = false;
  if (delta < 0 && target < floor) {
    floorBinding = true;
    // Le plancher réduit le déficit ; s'il atteint le besoin, le déficit devient nul (maintien).
    target = Math.min(Math.ceil(floor), tdee);
    delta = target - tdee;
  }
  return { tdee, resting, floor, target, deltaKcal: delta, floorBinding, noDeficitReason };
}
