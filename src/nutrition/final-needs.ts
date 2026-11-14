// CIBLE FINALE UNIQUE (docs/nutrition-spec.md §5.5, §6 ; demande du 14/11/2026) : la SEULE fonction dont l'écran « Mes besoins », le plan de repas
// et la liste de courses lisent les calories et les macros. Pure, sans accès base. Quand elle refuse de calculer, elle dit POURQUOI et ce qui manque.

import { EAU_TOTALE_L, KCAL_PAR_KG, IMC_REPERES, LIP_MIN_GKG, LIP_MIN_PCT_ENERGIE, PERTE_PCT_SEMAINE, PRISE_PCT_SEMAINE, PROT_GKG } from './config';
import { dayTypeOf, weekTargets, type DaySession, type DayTarget, type DayType } from './day-targets';
import { adjustedTarget, bmi, computeNeeds, screenNutrition, type Body, type GoalKind, type Needs, type Pace, type ScreenResult, type ScreeningAnswers } from './needs';

/** Âge PRUDENT à partir de l'année de naissance seule : année - naissance - 1 (la date exacte n'est pas demandée) ; un mineur né en fin d'année n'est jamais compté adulte. */
export const ageFromBirthYear = (birthYear: number, now: Date = new Date()): number => now.getFullYear() - birthYear - 1;

export interface Reason {
  /** Ce qui bloque (question, donnée manquante ou valeur hors bornes). */
  code: 'sexe' | 'naissance' | 'mineur' | 'taille' | 'poids' | 'imc_bas' | 'question_oui' | 'question_refus' | 'question_vide' | 'donnees';
  text: string;
  /** true = la personne peut le corriger elle-même (donnée manquante) ; false = orientation vers un professionnel. */
  fixable: boolean;
}

const QUESTION_TEXT: Record<keyof ScreeningAnswers, string> = {
  grossesse: 'la grossesse',
  allaitement: 'l’allaitement',
  postPartum: 'un accouchement de moins d’un an',
  maladie: 'une maladie suivie',
  rapportAlimentation: 'ton rapport à l’alimentation et au poids',
  medicament: 'un traitement médicamenteux régulier',
};

/** Pourquoi l'app ne calcule pas de chiffres. Liste vide = rien ne s'y oppose. Jamais de diagnostic : un motif et une orientation. */
export function explainReperes(answers: ScreeningAnswers, body: Body): Reason[] {
  const out: Reason[] = [];
  if (body.sex !== 'homme' && body.sex !== 'femme') {
    out.push({ code: 'sexe', fixable: true, text: 'Le sexe n’est pas indiqué : la formule de calcul en dépend. Choisis « Un homme » ou « Une femme » dans « Modifier mes informations ».' });
  }
  if (body.age == null || !Number.isFinite(body.age)) {
    out.push({ code: 'naissance', fixable: true, text: 'L’année de naissance manque ou est invalide (4 chiffres, par exemple 1992).' });
  } else if (body.age < 18) {
    out.push({ code: 'mineur', fixable: false, text: 'L’app est réservée aux adultes : pas de calcul de besoins avant 18 ans. Parle à un médecin ou à un diététicien.' });
  } else if (body.age > 100) {
    out.push({ code: 'naissance', fixable: true, text: 'L’année de naissance semble invalide.' });
  }
  if (body.cm == null || !(body.cm >= 120 && body.cm <= 230)) {
    out.push({ code: 'taille', fixable: true, text: 'La taille manque ou est hors limites (entre 120 et 230 cm).' });
  }
  if (body.kg == null || !(body.kg >= 35 && body.kg <= 300)) {
    out.push({ code: 'poids', fixable: true, text: 'Le poids manque ou est hors limites (entre 35 et 300 kg).' });
  }
  if (body.kg != null && body.cm != null && body.kg >= 35 && body.cm >= 120 && bmi(body.kg, body.cm) < IMC_REPERES) {
    out.push({ code: 'imc_bas', fixable: false, text: 'Ton IMC est sous 18,5 : l’app ne propose pas d’objectif chiffré dans ce cas. Parle à un médecin ou à un diététicien.' });
  }
  for (const k of Object.keys(QUESTION_TEXT) as (keyof ScreeningAnswers)[]) {
    const a = answers[k];
    if (a === 'oui') out.push({ code: 'question_oui', fixable: false, text: `Tu as répondu « oui » pour ${QUESTION_TEXT[k]} : par prudence, l’app ne calcule pas d’objectif chiffré. Parle à un professionnel de santé qui peut t’accompagner.` });
    else if (a === 'refus') out.push({ code: 'question_refus', fixable: true, text: `Tu as préféré ne pas répondre sur ${QUESTION_TEXT[k]} : sans réponse, l’app ne calcule pas de chiffres. Tu peux répondre dans « Modifier mes informations » (réponds « Non » seulement si c’est vrai).` });
    else if (a == null) out.push({ code: 'question_vide', fixable: true, text: `Pas de réponse sur ${QUESTION_TEXT[k]}.` });
  }
  return out;
}

export interface FinalInput {
  answers: ScreeningAnswers;
  body: Body;
  sessionsPerWeek: number;
  goal: GoalKind;
  pace: Pace;
  /** Ajustement hebdomadaire déjà décidé (kcal/j), 0 si aucun. */
  adjust: number;
  /** Gel des déficits actif (règle E) : la cible de perte devient une cible de maintien. */
  gel: boolean;
  /** 7 listes de séances (lundi à dimanche) lues dans le programme. */
  days: readonly (readonly DaySession[])[];
}

export interface FinalNeeds {
  status: 'ok';
  screen: ScreenResult;
  goal: GoalKind;
  needs: Needs;
  /** Cible moyenne finale après plancher, déficit et surplus maximaux : LA valeur à utiliser partout. */
  kcal: number;
  protG: number;
  glucG: number;
  lipG: number;
  /** Eau totale conseillée (L/jour), repère général. */
  waterL: number;
  /** Rythme visé par l'objectif, kg par semaine (négatif en perte) ; 0 quand aucun écart n'est appliqué (IMC, plancher, gel). */
  targetKgPerWeek: number;
  /** Rythme que la cible finale produirait réellement : (cible - besoin) x 7 / 7700. */
  effectiveKgPerWeek: number;
  dayTypes: DayType[];
  /** 7 jours, moyenne = kcal ; null si la répartition est impossible avec ces valeurs. */
  week: DayTarget[] | null;
}

export interface Refused {
  status: 'reperes';
  reasons: Reason[];
}

export function finalNeeds(i: FinalInput): FinalNeeds | Refused {
  const reasons = explainReperes(i.answers, i.body);
  const screen = screenNutrition(i.answers, i.body);
  if (screen === 'reperes' || reasons.length > 0) {
    return { status: 'reperes', reasons: reasons.length ? reasons : [{ code: 'donnees', fixable: true, text: 'Informations incomplètes : refais le questionnaire.' }] };
  }
  const kg = i.body.kg as number;
  const goal: GoalKind = i.gel && i.goal === 'perte' ? 'maintien' : i.goal;
  const needs = computeNeeds({ screen, body: i.body, sessionsPerWeek: i.sessionsPerWeek, goal, pace: i.pace });
  if (!needs) return { status: 'reperes', reasons: [{ code: 'donnees', fixable: true, text: 'Calcul impossible avec ces valeurs : vérifie ton âge, ta taille et ton poids.' }] };
  const kcal = adjustedTarget(needs, i.gel ? 0 : i.adjust, goal, screen === 'prudent');
  if (kcal == null) return { status: 'reperes', reasons: [{ code: 'donnees', fixable: true, text: 'Calcul impossible : une valeur est invalide.' }] };
  const protG = PROT_GKG[goal] * kg;
  const lipG = Math.max(LIP_MIN_GKG * kg, (LIP_MIN_PCT_ENERGIE * kcal) / 9);
  const glucG = Math.max(0, (kcal - 4 * protG - 9 * lipG) / 4);
  const dayTypes = Array.from({ length: 7 }, (_, d) => dayTypeOf(i.days[d] ?? []));
  const week = weekTargets({ types: dayTypes, avgKcal: kcal, floorKcal: Math.min(needs.floor, kcal), kg, goal });
  const paceKg = goal === 'perte' ? -(kg * PERTE_PCT_SEMAINE[i.pace]) / 100 : goal === 'prise' ? (kg * PRISE_PCT_SEMAINE) / 100 : 0;
  // Aucun écart appliqué (IMC, plancher, maintien) : aucun rythme de perte ou de prise n'est promis.
  const targetKgPerWeek = needs.deltaKcal === 0 ? 0 : paceKg;
  const effectiveKgPerWeek = ((kcal - needs.tdee) * 7) / KCAL_PAR_KG;
  const sex = i.body.sex as 'homme' | 'femme';
  return { status: 'ok', screen, goal, needs, kcal, protG, glucG, lipG, waterL: EAU_TOTALE_L[sex], targetKgPerWeek, effectiveKgPerWeek, dayTypes, week };
}
