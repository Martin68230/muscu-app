import type { Level, MainGoalKey, PregnancyStatus, Profile, TrainingPlace } from './model';
import { create, list, update } from './repo';

// Parcours « profil en cartes » (F1) : choix proposés, phrases affichées, règles de périmètre v1.
// Aucune valeur sport/nutrition ici : les phrases de niveau sont des définitions d'affichage
// (à valider par `coach`, voir NIVEAUX), les seuils de jours viennent de knowledge/generateur-v1.md §1.2.

/** Jours par semaine gérés par le générateur v1 (generateur-v1.md §1.2, règle V-PER). */
export const SUPPORTED_DAYS = [2, 3] as const;
export const DAYS_CHOICES = [1, 2, 3, 4, 5, 6] as const;

export function isSupportedDays(days: number | null | undefined): boolean {
  return days === 2 || days === 3;
}

/** Message affiché quand le nombre de jours demandé n'est pas encore géré (pas de programme faux). */
export function unsupportedDaysMessage(days: number): string {
  return days === 1
    ? 'Un seul jour par semaine : ce programme arrive dans une prochaine version. Choisis 2 ou 3 jours pour l\'instant.'
    : `Un programme sur ${days} jours par semaine arrive dans une prochaine version. Choisis 2 ou 3 jours pour l'instant.`;
}

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
 * Phrases concrètes des niveaux.
 * À VALIDER PAR `coach` : aucune définition dans knowledge/ à ce jour. La phrase « débutant » est celle
 * demandée par le propriétaire ; les deux autres sont des propositions de `dev` à confirmer.
 */
export const NIVEAUX: { value: Level; label: string; hint: string }[] = [
  { value: 'debutant', label: 'Débutant', hint: "Moins de 6 mois d'entraînement régulier, ou reprise après une longue pause." },
  { value: 'intermediaire', label: 'Intermédiaire', hint: "Entre 6 mois et 2 ans d'entraînement régulier ; tu connais les mouvements de base." },
  { value: 'avance', label: 'Avancé', hint: "Plus de 2 ans d'entraînement régulier ; tu connais ta charge sur la plupart des exercices." },
];

export const OBJECTIFS: { value: MainGoalKey; label: string; hint: string }[] = [
  { value: 'muscle', label: 'Muscle général', hint: 'Gagner en muscle sur tout le corps.' },
  { value: 'force', label: 'Force', hint: 'Devenir plus fort sur les mouvements de base.' },
  { value: 'sante', label: 'Santé et forme', hint: 'Rester actif, en forme, sans objectif chiffré.' },
  { value: 'perte_gras', label: 'Perte de gras', hint: 'Perdre du gras en gardant ton muscle.' },
];

export const PREGNANCY_CHOICES: { value: PregnancyStatus; label: string }[] = [
  { value: 'non', label: 'Non' },
  { value: 'enceinte', label: 'Enceinte' },
  { value: 'post_partum', label: 'Post-partum' },
];

/** Texte prudent de la carte grossesse (à relire par `kine`). */
export const PREGNANCY_TEXT =
  "Facultatif. Cette réponse reste sur ce téléphone et n'est jamais partagée. Si tu es enceinte ou si tu as accouché récemment, l'appli adapte les exercices et limite l'intensité. Demande aussi l'avis de ton médecin ou de ta sage-femme avant de t'entraîner : l'appli ne remplace pas un avis médical.";

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

/** Objectif principal = ligne de rang 1 de la table `goals`. */
export async function getMainGoal(): Promise<MainGoalKey | null> {
  const goals = (await list('goals')).sort((a, b) => a.rank - b.rank);
  const key = goals[0]?.goalKey;
  return OBJECTIFS.some((o) => o.value === key) ? (key as MainGoalKey) : null;
}

export async function setMainGoal(key: MainGoalKey): Promise<void> {
  const goals = (await list('goals')).sort((a, b) => a.rank - b.rank);
  if (goals[0]) await update('goals', goals[0].id, { goalKey: key, rank: 1 });
  else await create('goals', { goalKey: key, rank: 1 });
}

/** Le parcours a été terminé : sinon l'Accueil propose « Créer mon programme ». */
export function isProfileComplete(p: Pick<Profile, 'profileCompletedAt'>): boolean {
  return !!p.profileCompletedAt;
}

export async function completeProfile(profileId: string): Promise<Profile> {
  return update('profile', profileId, { profileCompletedAt: new Date().toISOString() });
}
