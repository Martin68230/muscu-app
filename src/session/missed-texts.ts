// Textes de la fonction « séance manquée » et de la reprise douce : knowledge/seance-manquee-v1.md §7, repris MOT POUR MOT
// (statut : NON SOURCÉ, rédaction relue par kine et relecteur). Ne pas les réécrire ici : toute modification passe par le fichier.
// T-19 = T3 du cardio (une seule source : knowledge/cardio-regles.md, CARDIO_TEXT.T3).
import { CARDIO_TEXT } from '../generator/messages';

export const MISSED_TEXT = {
  /** T-1 : titre de la carte ({jour} = jour de la semaine de D). */
  t1: (jour: string): string => `Ta séance de ${jour} n'a pas eu lieu.`,
  T2: 'Tu peux la faire quand tu veux, la décaler ou la laisser de côté.',
  T3: 'Décaler à un autre jour de cette semaine',
  T4: 'La faire quand je peux',
  T5: 'Sauter cette séance',
  /** T-6 : liste des jours. */
  T6_TITLE: 'Choisis un jour',
  T6_BACK: 'Retour',
  t7: (nom: string, jour: string): string => `C'est noté : « ${nom} » est décalée à ${jour}. Elle est dans ton calendrier.`,
  T8: "C'est noté. Elle sera ta prochaine séance, quand tu veux.",
  t9: (nom: string): string => `Sauter « ${nom} » ? Tu passeras directement à la suivante.`,
  T9_YES: 'Oui, la sauter',
  T9_NO: 'Non, retour',
  T10: 'Ok, on passe à la suivante.',
  T11: 'Aucun autre jour libre ne laisse assez de repos cette semaine.',
  T12: 'Cette semaine, une seule séance. Tu reprends à ton rythme la semaine prochaine.',
  T13: 'Bon retour ! Pour reprendre en douceur, on démarre un peu plus léger que la dernière fois, et tu avances à ton rythme.',
  T14: 'Bon retour ! Pour reprendre en douceur, on démarre un peu plus léger que la dernière fois, et tu avances à ton rythme.',
  T20: 'Bon retour ! Après une pause comme celle-ci, on démarre nettement plus léger et on ajuste séance après séance, à ton rythme.',
  T15: 'Bon retour ! On redémarre en douceur : on cherche les bonnes charges, une séance à la fois.',
  T18_LINK: 'Je ne me sens pas bien',
  T18_AFTER: "Ok, prends le temps qu'il te faut. Si ça dure ou si tu t'inquiètes, parles-en à un professionnel de santé.",
  T21: 'Noter que tu ne te sens pas bien ? La séance sera passée.',
  T21_YES: 'Oui',
  T21_NO: 'Non, retour',
  T19: CARDIO_TEXT.T3,
  T22: "J'ai demandé l'avis d'un professionnel, je reprends",
} as const;

/** Texte de reprise selon le palier (SM-12, SM-14) ; palier imposé par le plancher (2) : T-14. */
export function repriseText(palier: number): string | null {
  if (palier === 1) return MISSED_TEXT.T13;
  if (palier === 2) return MISSED_TEXT.T14;
  if (palier === 3) return MISSED_TEXT.T20;
  if (palier === 4) return MISSED_TEXT.T15;
  return null;
}

/** Tous les textes affichés (test E20 : aucun mot interdit). */
export function allMissedTexts(): string[] {
  return Object.values(MISSED_TEXT).map((v) => (typeof v === 'function' ? (v as (...a: string[]) => string)('lundi', 'mardi') : v));
}

const DAY_NAMES = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
/** Nom du jour de la semaine d'une clé AAAA-MM-JJ (minuscule, comme « Ta séance de lundi »). */
export function dayName(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return DAY_NAMES[(new Date(y, m - 1, d).getDay() + 6) % 7];
}
/** T-6 : bouton « Mardi », « Samedi »… */
export const dayButton = (key: string): string => dayName(key).charAt(0).toUpperCase() + dayName(key).slice(1);
