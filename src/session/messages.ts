// Textes fixes du lecteur de séance (non générés : knowledge/generateur-v1.md §6.8 points 2 et 3 ; regles-securite-communes.md U1, R5, S1).
// Statuts : R4 et R5 PROVISOIRE ; U1 numéros OK, déclencheurs PROVISOIRE ; reste NON SOURCÉ (choix de prudence de `kine`).

/** U1 : identique partout, avec un bouton d'appel `tel:15`. U2 : jamais derrière une autre question. */
export const U1_TEXT = 'Urgence : appelle le 15 (SAMU) ou le 112.';
export const U1_TEL = 'tel:15';

/** R5 : signes d'arrêt immédiat de la séance (liste affichée par « J'ai un symptôme »). */
export const R5_SIGNS: readonly string[] = [
  'Douleur, serrement ou gêne dans la poitrine, le cou, la mâchoire ou le bras',
  'Malaise',
  'Vertige',
  'Essoufflement anormal',
  'Palpitations',
];
export const R5_STOP_TEXT = 'Arrête la séance. Ne reprends pas avant l’avis d’un professionnel de santé.';

export const PAIN_HELP_TEXT = 'Douleur dans une articulation, vive ou inhabituelle ; pas la brûlure du muscle qui travaille.';
export const PAIN_STOP_TEXT = 'Exercice arrêté : pas de progression. Si la douleur persiste, consulte un professionnel de santé.';
/** S1 : zone « je ne sais pas » après 2 séances de suite avec douleur. */
export const PAIN_S1_TEXT = 'Tu as eu mal à deux séances de suite. Consulte un professionnel de santé si ça persiste.';

/** Textes des propositions de progression (la v1 PROPOSE, n'impose rien). */
export const PROGRESSION_TEXT = {
  etalonnage: 'Première fois : commence léger, puis dis combien de répétitions il te restait.',
  douleur: 'Douleur à la dernière séance : garde la même charge, sans augmenter.',
  plafond: 'Charge maintenue (gêne déclarée ou grossesse) : pas d’augmentation.',
  plusDeReps: 'Garde cette charge et essaie une répétition de plus par série.',
  sommet: 'Tu es au plus lourd de ton matériel : ajoute des répétitions.',
  maintien: 'Pour les maintiens, la durée n’augmente pas dans cette version.',
  garder: 'Garde la même charge.',
} as const;

export function loadMoreText(deltaKg: number): string {
  return `Essaie ${fmtKg(deltaKg)} kg de plus.`;
}
export function loadLessText(deltaKg: number): string {
  return `Essaie ${fmtKg(deltaKg)} kg de moins.`;
}
export function fmtKg(kg: number): string {
  return String(Math.round(kg * 100) / 100).replace('.', ',');
}
