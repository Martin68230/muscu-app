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
  symptome: 'Pas d’augmentation tant qu’une séance n’est pas terminée sans symptôme.',
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

// ----- Écran « J'ai un symptôme » : textes fixes en français simple (regles-securite-communes.md G6 et C4) -----
/** G6 : grossesse ou post-partum cochés. Statut : liste OK (HAS) ; orientation d'urgence PROVISOIRE (choix de `kine`). */
export const G6_TITLE = 'Grossesse ou après un accouchement';
export const G6_STOP_TEXT = 'Arrête la séance et contacte ton médecin ou ta sage-femme si tu as l’un de ces signes.';
export const G6_SIGNS: readonly string[] = [
  'Un essoufflement qui ne passe pas au repos',
  'Des contractions régulières et douloureuses',
  'Un saignement',
  'Une perte de liquide',
  'Des vertiges, un malaise ou des maux de tête',
  'Une faiblesse dans les muscles qui gêne ton équilibre',
  'Une douleur ou un gonflement dans un mollet',
];
export const G6_URGENT_TEXT = 'Saignement, perte de liquide, contractions régulières ou douleur dans la poitrine : appelle la maternité ou le 15.';

/** C4 : zone « cou » déclarée. Statut : liste HAS OK ; signes d’AVC PROVISOIRE ; vertige même léger NON SOURCÉ (choix prudent). */
export const C4_TITLE = 'Cou';
export const C4_URGENT_SIGNS: readonly string[] = [
  'Visage qui tombe d’un côté',
  'Faiblesse ou engourdissement brutal d’un bras ou d’une jambe',
  'Difficulté soudaine à parler',
  'Perte de la vue d’un œil ou vision double',
  'Gros problème d’équilibre ou de marche d’un coup',
  'Mal de tête brutal, très fort et inhabituel',
];
export const C4_STOP_TEXT = 'Arrête la séance et consulte si tu as l’un de ces signes.';
export const C4_STOP_SIGNS: readonly string[] = [
  'Fourmillements, engourdissement ou décharge dans le bras ou la main',
  'Faiblesse du bras ou de la main (des objets tombent)',
  'Maux de tête inhabituels, surtout avec une douleur de cou inhabituelle',
  'Douleur de cou inhabituelle qui dure ou qui s’aggrave, ou qui te réveille la nuit',
  'Vertige ou étourdissement, même léger',
  'Fièvre ou amaigrissement sans raison',
  'Maladresse nouvelle des mains ou trouble de l’équilibre',
];

export const SYMPTOM_RESUME_CONFIRM = 'Tu n’as plus aucun de ces signes et tu te sens bien ?';
export const SOUND_NOTE = 'Le minuteur se met à jour quand tu reviens sur l’appli ; il ne sonne pas écran verrouillé.';
export const WAKE_LOCK_BANNER = 'Ton écran peut s’éteindre pendant la séance. Touche l’écran de temps en temps.';

// ----- F6 : progression par échelons (progression-et-bilan-v1.md §1) : français simple, sans reproche. Statut : NON SOURCÉ (texte de conception). -----
export const ECHELON_TEXT = {
  upTitle: (nom: string): string => `Prêt pour l’échelon suivant : ${nom} ?`,
  upBody: 'Tu as réussi toutes tes séries plusieurs séances de suite. Cette version est un peu plus difficile ; la première fois, on commence doucement.',
  downTitle: (nom: string): string => `Essayer une version plus facile : ${nom} ?`,
  downBody: 'Les dernières séances étaient dures. Une version plus facile te permet de bien travailler. Ce n’est pas un échec.',
  floorGentler: 'Essaie une version plus douce de cet exercice (voir la fiche).',
  floorKeep: 'Garde cet exercice tel quel, sans chercher à monter ; si ça reste dur, parles-en à un professionnel de santé.',
  accept: 'Accepter',
  cancelled: 'La proposition d’échelon est annulée parce que ton programme a changé.',
  later: 'Plus tard',
  levelTitle: 'Passer au niveau intermédiaire ?',
  levelBody: 'Tu as fait le tour de ce qui est prévu à ton niveau pour plusieurs exercices. Tu peux passer au niveau intermédiaire dans ton profil, ou rester ici.',
  levelNote: 'Ça ajoute des exercices plus difficiles ; chaque nouvel exercice démarre doucement, avec un essai léger.',
  levelAccept: 'Passer au niveau intermédiaire',
  levelStay: 'Rester ici',
  /** Première séance à un nouvel échelon : essai léger (V-ETAL-E7). */
  arrival: 'Nouvelle version : commence doucement, on règle la difficulté après la première série.',
  switchedUp: (nom: string): string => `Pour les séries qui restent : passe à « ${nom} » (un peu plus difficile).`,
  switchedDown: (nom: string): string => `Pour les séries qui restent : passe à « ${nom} » (un peu plus facile).`,
  nextTime: (nom: string): string => `${nom} : on te proposera la version suivante à la prochaine séance.`,
} as const;
