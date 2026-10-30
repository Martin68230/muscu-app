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
  /** D26 (SUP-0 point 2, R3) : charge fixe tant que l'exercice est en superset. */
  paire: 'Exercice en superset : garde la même charge, ajoute des répétitions.',
} as const;
/** D26 (SUP-0, E17) : texte unique de la séance 1 quand les supersets ne sont pas encore appliqués (core-et-supersets.md §4.0). */
export const PAIR_FIRST_SESSION_TEXT =
  'Cette première séance peut durer un peu plus longtemps : les exercices nouveaux sont faits un par un. Le temps gagné apparaît dès la séance suivante.';

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

/**
 * Option « Gagner du temps » (knowledge/core-et-supersets.md §12) : libellé, explication en 2 lignes et mention honnête repris mot pour
 * mot ; aucun pourcentage de temps gagné. Les phrases « grisé » sont une rédaction de `dev` (à relire par `coach`).
 */
export const GAIN_TEXT = {
  label: 'Gagner du temps (exercices enchaînés par deux)',
  explain:
    "Tu fais deux exercices d'affilée, un pour pousser puis un pour tirer, puis tu te reposes. Le travail reste le même, la séance est plus courte, mais c'est plus fatigant : prévois un peu plus de repos entre deux séances.",
  honest: 'Même volume de travail, séance plus courte, mais plus fatigant.',
  // Textes corrigés (knowledge/textes-d25-revue.md §3 et §4, `coach`, validés par `kine`).
  offBeginner: "Cette option n'est pas proposée au début : tu fais les exercices un par un.",
  offPregnancy: 'Pendant la grossesse ou après un accouchement, les exercices se font un par un.',
  noPairToday: 'Dans cette séance, aucun exercice n’est fait par deux : tu les fais un par un.',
} as const;

/**
 * D30 / D31 (knowledge/cardio-regles.md §3.2ter, §5.2, §5.2bis, §5.4). Textes repris mot pour mot des règles quand ils y sont écrits
 * (T8, T9, phrase « grisé », arrêt des sauts, courbatures, match) ; les autres sont une rédaction de `dev` (marqués « dev », à relire
 * par `coach` ou `kine`, docs/D30-bilan.md).
 */
export const D30_TEXT = {
  /** 3.2ter A : libellé de l'option (règle) ; phrase grisée (rédaction de `coach`). */
  optionLabel: 'Ajouter une séance de cardio ?',
  optionNoDay: 'Il faut un jour libre de plus dans tes jours disponibles.',
  /** dev : explication de l'option (3.2ter A : modéré, jour sans jambes lourdes, jamais à la place d'une séance de force). */
  optionExplain: 'Une séance de cardio modéré (marche rapide ou équivalent) un jour libre, loin de tes séances de jambes. Elle ne remplace jamais une séance de force.',
  /** dev : séance de sport incluse (3.2ter B), retirable. */
  sportLabel: 'Séance de cardio incluse (sport)',
  sportExplain: 'Une séance de cardio par semaine, à la place d’un jour léger. Tu peux la retirer.',
  /** dev : grisé quand une gêne aux jambes est au niveau 2 ou 3 (lecture prudente de STR-REP-12). */
  optionLegZone: 'Avec la gêne que tu as indiquée aux jambes, l’app n’ajoute pas de séance de cardio.',
  /** dev : grisé à 1 ou 2 jours (3.2ter A : option offerte à partir de 3 jours). */
  optionFewDays: 'Cette option est proposée à partir de 3 jours de force par semaine.',
  /** 3.2ter B (c), `kine` : séance de sport. */
  sportMatch: 'Évite de la faire la veille d’un match, et le lendemain d’un match en cas de courbatures.',
  /** 5.2 T8 (`coach`, complété par `kine`), mot pour mot. */
  T8: 'Les sauts demandent plus aux genoux, aux chevilles et au dos. Commence par la version sans saut. Essaie les sauts seulement si tu n’as aucune douleur, avec des chaussures de sport, sur un sol stable et dégagé. Pas de saut si tu es très fatigué ou si tes jambes sont lourdes. Retombe doucement, genoux souples. Arrête dès qu’une douleur apparaît ou si tes réceptions deviennent bruyantes.',
  /** 5.2 (courbatures) et 5.2bis condition 7 (arrêt au premier signe ressenti), mot pour mot. */
  courbatures: 'Des courbatures aux mollets sont normales les premiers jours. Une douleur dans l’articulation, non.',
  jumpStop: 'Si tes sauts deviennent plus bas ou plus bruyants, arrête les sauts et passe à la suite.',
  /** 5.1 (5) et 6ter : question posée avant les sauts. */
  heavyQuestion: 'Tes jambes sont-elles lourdes ou courbaturées ?',
  /** dev : réponse « oui » dans un programme généré (5.1 (5) : version douce imposée). */
  heavyYes: 'Fais la version sans saut aujourd’hui.',
  /** dev : ligne « version douce » d'un exercice de sauts. */
  softLine: (nom: string): string => `Version sans saut : ${nom}.`,
  /** dev : débutant, version douce par défaut (5.2). */
  softFirst: 'Version sans saut d’abord : c’est la version prévue pour toi.',
  /** 5.4 T9 (`coach`, complété par `kine`), mot pour mot. */
  T9: 'Échauffe-toi 5 minutes en marchant. Mets des chaussures de sport qui tiennent bien le pied. Bois avant, pendant et après ; quand il fait chaud, raccourcis et va plus doucement. Garde le son bas, avec une seule oreille ou le haut-parleur, pour entendre la circulation. Choisis un trajet éclairé, sûr, de préférence piéton, avec des vêtements visibles ; prends ton téléphone et préviens quelqu’un. Ne regarde pas l’écran en courant : écoute le signal, ou arrête-toi pour regarder. Pas de verglas ni de sol glissant. Au moindre signe d’alerte, arrête.',
  /** dev : rappel T9 en une ligne (5.4 « une fois puis en une ligne »). */
  T9short: 'Dehors : trajet sûr, son bas, une seule oreille, arrête-toi pour regarder l’écran.',
  /** 5.4 : alternative intérieure (titre de la règle) ; contenu : rédaction de `dev`. */
  indoorTitle: 'Pas envie ou pas possible de sortir ?',
  indoorWalk: 'Fais la même durée en marche rapide sur place ou dans ton logement.',
  /** dev : réglages du profil (5.4 « je peux marcher ou courir dehors, sur un trajet sûr » ; machines-etiquettes.md §2). */
  outdoorLabel: 'Je peux marcher ou courir dehors, sur un trajet sûr',
  outdoorHelp: 'Facultatif. Aucune localisation : l’app compte seulement le temps. Chaque séance dehors garde une version à l’intérieur.',
  gymLabel: 'J’ai accès à une salle',
  gymHelp: 'Facultatif. Les exercices sur machine guidée ou à la poulie ne sont proposés qu’avec une salle.',
  /** dev : lecteur du jour léger (STR-REP-12 : proposé, jamais exigé). */
  lightTitle: 'Jour léger (facultatif)',
  lightIntro: 'Rien n’est obligatoire : fais tout, une partie ou rien. Aucun retard n’est compté.',
  lightCardio: (min: number): string => `Si tu veux : ${min} min de marche à plat, effort facile (tu parles en phrases entières).`,
  lightNoCardio: 'Aujourd’hui : mobilité seulement, sans cardio.',
} as const;

/**
 * Cardio par objectif : bloc « facile » (cardio-regles.md §3.4 g, §3.7 a : « on parle en phrases entières ») et fin lente de tout bloc
 * (STR-SEA-4, `kine` : 2 dernières minutes en allure lente ; ne pas s'asseoir ou s'allonger d'un coup ; arrêter si la tête tourne ;
 * grossesse : ne pas rester debout immobile longtemps, G4). Rédaction de `dev` à partir des règles (à relire par `kine`).
 */
export const CARDIO_PLAY_TEXT = {
  easy: 'Effort facile : tu parles en phrases entières.',
  moderate: 'Effort modéré (5-6 sur 10).',
  // Texte retenu par `kine` (knowledge/textes-d25-revue.md §5, avis du 31/10/2026, R5 et U1 à part).
  slowEnd: (min: number) =>
    `Pendant les ${min} dernières minutes, ralentis : marche lente ou pédalage très doux. Ne t'arrête pas net : marche encore un peu avant de t'asseoir. Si la tête tourne, si tu as une douleur dans la poitrine ou si tu es essoufflé de façon anormale (le souffle ne revient pas, tu ne peux plus dire une phrase), arrête, assieds-toi doucement et bois de l'eau. Ne refais pas de séance avant d'avoir l'avis d'un médecin.`,
  pregnancy: 'Après le cardio, ne reste pas debout immobile longtemps.',
} as const;
