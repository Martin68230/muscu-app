import type { Level, MainGoalKey, PregnancyStatus, Profile, TrainingPlace } from './model';
import { create, list, softDelete, update } from './repo';

// Parcours « profil en cartes » (F1) : choix proposés, phrases affichées, règles de périmètre v1.
// Aucune valeur sport/nutrition ici : les phrases de niveau sont des définitions d'affichage
// (à valider par `coach`, voir NIVEAUX), les seuils de jours viennent de knowledge/generateur-v1.md §1.2.

/** Jours par semaine gérés par le générateur (D25, knowledge/structure-programmes.md §2.3 : 1 à 6 jours). */
export const SUPPORTED_DAYS = [1, 2, 3, 4, 5, 6] as const;
export const DAYS_CHOICES = [1, 2, 3, 4, 5, 6] as const;

export function isSupportedDays(days: number | null | undefined): boolean {
  return typeof days === 'number' && days >= 1 && days <= 6;
}

/** Message affiché quand le nombre de jours demandé n'est pas géré (pas de programme faux). */
export function unsupportedDaysMessage(days: number): string {
  return `Un programme sur ${days} jours par semaine n'est pas proposé. Choisis entre 1 et 6 jours.`;
}

/** STR-REP-1 : avertissement « une séance par semaine » (texte du fichier de règles, repris du générateur). */
export const ONE_DAY_NOTE =
  "Une séance par semaine, c'est mieux que rien, mais les repères demandent au moins 2 séances par semaine pour chaque grand muscle. Passer à 2 jours est possible dans ton profil.";

export const WEEKDAYS: { index: number; short: string; long: string }[] = [
  { index: 0, short: 'L', long: 'lundi' },
  { index: 1, short: 'M', long: 'mardi' },
  { index: 2, short: 'M', long: 'mercredi' },
  { index: 3, short: 'J', long: 'jeudi' },
  { index: 4, short: 'V', long: 'vendredi' },
  { index: 5, short: 'S', long: 'samedi' },
  { index: 6, short: 'D', long: 'dimanche' },
];

/** Durées proposées (generateur-v1.md §1.2) ; null = sans limite. */
export const DURATIONS: { value: number | null; label: string }[] = [
  { value: 20, label: '20 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 h' },
  { value: 75, label: '1 h 15' },
  { value: null, label: 'Sans limite' },
];

export const PLACES: { value: TrainingPlace; label: string; hint: string }[] = [
  { value: 'maison', label: 'À la maison', hint: 'Avec peu ou pas de matériel.' },
  { value: 'salle', label: 'En salle', hint: 'Machines, barres, haltères.' },
];

/**
 * Phrases concrètes des niveaux et des objectifs (textes d'affichage relus par `coach` le 23/10 ;
 * « régulier » = au moins 2 séances par semaine, dit dans knowledge/generateur-v1.md §1). Le niveau choisi décide de la dose et de l'échelon
 * des variantes (knowledge/generateur-v1.md §3.2 et §6.3) : en cas de doute, choisis le niveau du dessous.
 */
export const NIVEAUX: { value: Level; label: string; hint: string }[] = [
  { value: 'debutant', label: 'Débutant', hint: "Moins de 6 mois d'entraînement régulier, ou reprise après une longue pause." },
  { value: 'intermediaire', label: 'Intermédiaire', hint: "Entre 6 mois et 2 ans d'entraînement régulier ; tu connais les mouvements de base et tu sais les faire proprement." },
  { value: 'avance', label: 'Avancé', hint: "Plus de 2 ans d'entraînement régulier ; tu maîtrises la technique et tu connais ta charge sur la plupart des exercices." },
];

export const OBJECTIFS: { value: MainGoalKey; label: string; hint: string }[] = [
  { value: 'muscle', label: 'Prise de muscle', hint: 'Gagner en muscle sur tout le corps, avec des séries de répétitions moyennes.' },
  { value: 'force', label: 'Force', hint: 'Devenir plus fort sur les mouvements de base : charges plus lourdes, moins de répétitions, repos plus longs.' },
  { value: 'sante', label: 'Santé et forme', hint: 'Rester actif et en forme, sans objectif chiffré : séances plus douces, plus de répétitions.' },
  { value: 'cardio', label: 'Cardio', hint: "Améliorer ton souffle et ton endurance : de la marche rapide et des exercices sans saut, à ton rythme (effort modéré)." },
  { value: 'perte_gras', label: 'Perte de gras', hint: "Garder ton muscle pendant que tu perds du gras. L'alimentation compte beaucoup : l'appli règle la musculation." },
];

export const PREGNANCY_CHOICES: { value: PregnancyStatus; label: string }[] = [
  { value: 'non', label: 'Non' },
  { value: 'enceinte', label: 'Enceinte' },
  { value: 'post_partum', label: 'Post-partum' },
];

/**
 * Textes de la carte grossesse (G1, G2, G3, G5, G6, G7, U1 de knowledge/regles-securite-communes.md ; P-GROS de generateur-v1.md §6.0).
 * Aucun diagnostic, aucune question de dépistage. À relire par `kine` puis `relecteur`.
 */
export const PREGNANCY_TEXT =
  "Facultatif. Cette réponse reste sur ce téléphone et n'est jamais partagée. La grossesse et le post-partum changent ce qui est sûr, et cette appli n'est pas un avis médical. Demande l'avis de ton médecin ou de ta sage-femme (ou du professionnel qui te suit) avant de t'entraîner. S'il t'a déconseillé le sport, ne suis pas ces exercices.";

export const PREGNANCY_EFFECT_TEXT =
  "Si tu choisis « Enceinte » ou « Post-partum », l'appli prend des précautions : charge la plus légère, aucune hausse de charge, séance de 60 minutes au plus, pas de superset, effort modéré sans aller jusqu'à l'échec, et certains exercices retirés (position allongée sur le dos ou le ventre, risque de chute, maintiens longs ; après un accouchement, aucun saut). L'appli ne te fera pas progresser tant que ce réglage est coché ; choisis « Non » quand ton professionnel de santé te le permet. Après un accouchement, la reprise du sport se discute avec ta sage-femme ou ton médecin (consultation postnatale, rééducation du périnée).";

export const PREGNANCY_STOP_TEXT =
  "Arrête la séance et contacte ton médecin ou ta sage-femme si tu as : un essoufflement qui ne passe pas au repos, des vertiges, un malaise ou des maux de tête, des contractions régulières et douloureuses, un saignement, une perte de liquide, une douleur ou un gonflement d'un mollet, une faiblesse qui gêne l'équilibre. Après un accouchement : fuite d'urine à l'effort, sensation de pesanteur dans le bas-ventre, douleur de cicatrice ou saignement qui reprend.";

export const PREGNANCY_URGENCE_TEXT =
  "Urgence : appelle le 15 (SAMU) ou le 112 en cas de douleur ou de pression dans la poitrine, de saignement, de perte des eaux ou de contractions régulières douloureuses.";

/** Libellés pour les résumés. */
export function labelOf<T extends string | number | null>(list: { value: T; label: string }[], v: T | undefined): string {
  return list.find((o) => o.value === v)?.label ?? '—';
}


/** Jours libres restants : le choix est possible s'il reste au moins autant de jours libres que de séances. */
export function freeDaysEnough(days: number | null, blocked: number[]): boolean {
  return days === null || 7 - new Set(blocked).size >= days;
}

export const PROFILE_STEPS = [
  'jours',
  'bloques',
  'duree',
  'lieu',
  'materiel',
  'niveau',
  'objectif',
  'blessures',
  'grossesse',
] as const;
export type ProfileStep = (typeof PROFILE_STEPS)[number];

/** Objectifs choisis : rang 1 = principal, rangs suivants = secondaires dans l'ordre choisi (table `goals`). */
export async function getGoals(): Promise<{ main: MainGoalKey | null; others: MainGoalKey[] }> {
  const keys = (await list('goals')).sort((a, b) => a.rank - b.rank).map((g) => g.goalKey).filter((k): k is MainGoalKey => OBJECTIFS.some((o) => o.value === k));
  return { main: keys[0] ?? null, others: [...new Set(keys.slice(1))].filter((k) => k !== keys[0]) };
}

export async function setGoals(main: MainGoalKey, others: MainGoalKey[]): Promise<void> {
  const keys = [main, ...others.filter((k, i) => k !== main && others.indexOf(k) === i)];
  const rows = (await list('goals')).sort((a, b) => a.rank - b.rank);
  for (const [i, key] of keys.entries()) {
    if (rows[i]) await update('goals', rows[i].id, { goalKey: key, rank: i + 1 });
    else await create('goals', { goalKey: key, rank: i + 1 });
  }
  for (const extra of rows.slice(keys.length)) await softDelete('goals', extra.id);
}

/** Objectif principal = ligne de rang 1 de la table `goals`. */
export async function getMainGoal(): Promise<MainGoalKey | null> {
  return (await getGoals()).main;
}

/** Change le principal ; les secondaires sont gardés (sauf celui qui devient principal). */
export async function setMainGoal(key: MainGoalKey): Promise<void> {
  await setGoals(key, (await getGoals()).others);
}

/** Libellé de la carte du profil : « Prise de muscle + Cardio, Force ». */
export function goalsSummary(main: MainGoalKey | null, others: MainGoalKey[]): string {
  if (!main) return '—';
  const name = (k: MainGoalKey) => OBJECTIFS.find((o) => o.value === k)?.label ?? k;
  return others.length ? `${name(main)} + ${others.map(name).join(', ')}` : name(main);
}

/** Le parcours a été terminé : sinon l'Accueil propose « Créer mon programme ». */
export function isProfileComplete(p: Pick<Profile, 'profileCompletedAt'>): boolean {
  return !!p.profileCompletedAt;
}

export async function completeProfile(profileId: string): Promise<Profile> {
  return update('profile', profileId, { profileCompletedAt: new Date().toISOString() });
}
