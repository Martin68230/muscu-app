// « Mon sport » : valeurs de la charge et textes (knowledge/saisie-sport-v1.md, §7 « Avis kine du 13/11/2026 » qui l'emporte sur §1 à §5).
// Statut : PROVISOIRE / NON SOURCÉ. Aucun calcul ici ; rien ne relève jamais une dose : la charge ne fait que refuser, alléger ou décaler.
import type { SportEffort, SportKey } from '../data/model';

export const SPORT = {
  status: 'PROVISOIRE_NON_SOURCE',
  source: 'knowledge/saisie-sport-v1.md §7 et §8',
  /**
   * Étape 2 : le sport décale ou retire des séances de force du PROGRAMME (carte de la semaine, src/sport/week-map.ts). `false` = le programme
   * ignore le sport (comme avant). Activé le 13/11/2026 après contrôle `relecteur` (étape 2 et RAT validés) ; statut PROVISOIRE / NON SOURCÉ.
   */
  enabled: true,
  /** Au plus 3 sports déclarés, nom libre de 40 caractères, note de 200. */
  maxSports: 3,
  nameMax: 40,
  noteMax: 200,
  durationMin: { min: 5, max: 240, default: 60 },
  /** Jambes : « facile » de moins de 45 min = 0,5 ; dès 45 min (ou « soutenue », « très dur », 60 min, « jambes lourdes ») = jambes lourdes. */
  legs: { heavyFromMin: 45, severeFromMin: 90, halfNoJumpHours: 24 },
  /** Espacement (heures depuis la fin) : même grille qu'une séance de jambes lourdes ; « avancé » seul à pleine dose entre 48 et 72 h. */
  spacing: { refuseH: 24, softenH: 48, warnH: 72 },
  /** Jour habituel déclaré et non noté : « soutenue » 60 min, fin de journée ; jour de match : « très dur ». */
  habitual: { effort: 'soutenue' as SportEffort, durationMin: 60 },
  /** Contacts au sol estimés par minute (kine : x2 / x3 / x4), plafond par séance, fenêtre de 72 h. */
  contacts: { perMin: { facile: 2, soutenue: 3, tres_dur: 4 } as Record<SportEffort, number>, cap: 400, windowH: 72, noJumpH: 48 },
  /** Épaule : le jour même et le lendemain ; « très dur » : 48 h. */
  shoulder: { days: 1, daysVeryHard: 2, fromMin: 60 },
  /** Cardio dédié : pas le même jour qu'un sport « soutenue » ou plus, ni dans les 24 h après un « très dur ». */
  cardio: { afterVeryHardH: 24 },
  /** Gêne : renvoi vers un professionnel après 2 séances de suite, depuis plus d'une semaine ou avec un signe ; zone retirée 14 jours. */
  pain: { consecutive: 2, daysSpan: 7, removeDays: 14, tempLevel1Days: 2 },
  /** Reprise : plus de 14 jours sans sport noté. */
  pauseDays: 14,
  /** Jours avant un match : jambes légères la veille, aucun saut dans les 48 h avant. */
  match: { noJumpsDays: 2, lightLegsDays: 1 },
  /** Familles (§2, §7 (i)) : `autre` compte Jambes et Sauts par défaut, jamais de prévention ni de choix d'exercices. */
  jumpFamilies: ['volley', 'basket', 'hand', 'danse', 'autre'] as readonly SportKey[],
  /** Foot et raquette : sauts seulement si « avec des sauts » est coché. */
  jumpOptional: ['foot', 'raquette'] as readonly SportKey[],
  shoulderFamilies: ['volley', 'hand', 'raquette'] as readonly SportKey[],
} as const;

export const SPORT_LABEL: Record<SportKey, string> = {
  foot: 'Foot', danse: 'Danse', volley: 'Volley', raquette: 'Raquette (tennis, badminton, padel, squash)', basket: 'Basket', hand: 'Hand', autre: 'Autre sport',
};
export const SPORT_SHORT: Record<SportKey, string> = { foot: 'Foot', danse: 'Danse', volley: 'Volley', raquette: 'Raquette', basket: 'Basket', hand: 'Hand', autre: 'Autre' };

export const EFFORT_CHOICES: { id: SportEffort; label: string; help: string }[] = [
  { id: 'facile', label: 'Facile', help: 'Tu parles en phrases entières.' },
  { id: 'soutenue', label: 'Soutenue', help: 'Tu parles en phrases courtes.' },
  { id: 'tres_dur', label: 'Très dur', help: 'Tu ne dis que quelques mots, tu es très essoufflé.' },
];
export const EFFORT_LABEL: Record<SportEffort, string> = { facile: 'facile', soutenue: 'soutenue', tres_dur: 'très dur' };

export const SPORT_TEXT = {
  title: 'Mon sport',
  intro: 'Dis-nous quel sport tu pratiques : l’appli compte la fatigue de tes jambes et de tes épaules pour te proposer des séances de musculation adaptées. Rien n’est partagé.',
  sportsLegend: 'Quel(s) sport(s) pratiques-tu ? (3 au plus)',
  otherName: 'Nom de ton sport (40 caractères au plus)',
  otherUnknown: 'Je ne connais pas ce sport : je compte ta charge sans choisir d’exercices.',
  perWeek: 'Combien de séances de ce sport par semaine ?',
  days: 'Quels jours d’habitude ? (facultatif)',
  matchDay: 'Un jour de match ? (facultatif)',
  noMatch: 'Pas de match',
  jumps: 'Il y a des sauts',
  overhead: 'Les bras passent souvent au-dessus de la tête',
  /** S2-F : seul le sens plus restrictif existe (jamais « facile », avis kine 13/11/2026). */
  habitualHard: 'Mes séances de ce sport sont souvent très dures',
  daysHelp: 'Un jour habituel non noté compte comme une séance soutenue d’une heure. Note ta vraie séance pour que ce soit exact.',
  estimate: 'Estimation grossière de ta charge, pas un compteur. Ce n’est pas un avis médical.',
  noteButton: 'Noter une séance de sport',
  noteTitle: 'Noter une séance de sport',
  noSport: 'Choisis d’abord un sport dans Profil, Mon sport.',
  openMy: 'Mon sport',
  which: 'Quel sport ?',
  when: 'Quel jour ?',
  duration: 'Combien de temps ? (minutes)',
  effort: 'Quelle intensité ? (choix obligatoire)',
  effortHelp: 'Si tu hésites, choisis « Soutenue ». Un match ou une compétition : « Très dur ».',
  match: 'C’était un match ou une compétition',
  feelings: 'Comment te sens-tu ? (facultatif)',
  feelingLabels: {
    jambes_lourdes: 'Jambes lourdes', epaule_fatiguee: 'Épaule fatiguée', courbatures: 'Courbatures',
    gene_douleur: 'Une gêne ou une douleur', malaise_vertige: 'Un malaise ou un vertige',
  },
  signsLegend: 'Avec cette gêne, y a-t-il aussi :',
  signLabels: { gonflement: 'Un gonflement', nuit: 'Une douleur la nuit', perte_force: 'Une perte de force', engourdissement: 'Un engourdissement' },
  zone: 'Où ?',
  zoneUnknown: 'Je ne sais pas',
  note: 'Une note ? (200 caractères au plus)',
  save: 'Enregistrer cette séance',
  chooseEffort: 'Choisis une intensité pour enregistrer.',
  saved: 'Séance de sport enregistrée.',
  savedFail: 'Impossible d’enregistrer pour l’instant.',
  back: 'Retour',
  pain: 'Une douleur ou une gêne : pas de progression sur cette zone. Parles-en à un professionnel de santé si elle revient.',
  malaise: 'Arrête et parles-en à un professionnel de santé. Aucune autre séance n’est proposée aujourd’hui.',
  consult: 'Tu as eu une gêne à plusieurs séances de suite, ou un signe d’alerte : consulte un professionnel de santé. Cette zone est retirée de tes séances pour l’instant.',
  pregnancyRecorded: 'Cette séance est enregistrée, pas recommandée. Parles-en à ton professionnel de santé avant de reprendre ou de continuer ce sport.',
  pregnancyStop: 'Arrête et contacte un professionnel de santé en cas de saignement, de perte de liquide, de douleur, de vertige, d’essoufflement anormal ou de contractions.',
  history: 'Mes séances de sport',
  none: 'Aucune séance de sport notée pour l’instant.',
  calendarTitle: 'Sport',
  privacy: 'Ces séances restent sur ton téléphone. Elles ne comptent pas dans tes séries, ta progression ni ta régularité de musculation.',
} as const;

/** Messages de la charge pour « Créer une séance » (D28). */
export const SPORT_GATE_TEXT = {
  legsRefuse: 'Ton sport a fatigué tes jambes il y a moins de 24 h (ou c’est un jour de sport prévu) : elles ont besoin de récupérer. Essaie plutôt le haut du corps ou le tronc.',
  legsSoften: 'Ton sport a chargé tes jambes récemment : séance adoucie (intensité douce, 2 séries, sans sauts ni exercice sur une jambe).',
  legsWarn: 'Ton sport a chargé tes jambes il y a moins de 72 h : écoute-les et allège si elles sont lourdes.',
  matchTomorrow: 'Un match est prévu demain : séance de jambes adoucie et sans saut.',
  jumpsSport48: 'ton sport comporte des sauts depuis moins de 48 h',
  jumpsContacts: 'ton sport a déjà fait beaucoup de sauts ces 3 derniers jours (estimation grossière, pas un compteur)',
  jumpsLight: 'ton sport a travaillé tes jambes depuis moins de 24 h',
  jumpsMatch: 'un match est prévu dans moins de 48 h',
  jumpsUnknownPain: 'tu as noté une gêne sans savoir où (par prudence, aucun saut pendant 2 jours)',
  unknownPain: 'Gêne notée sans zone : par prudence, pas de saut et pas de progression pendant 2 jours. Parles-en à un professionnel de santé si elle revient.',
  shoulderPain: 'Arrête l’exercice et tout travail d’épaule si la gêne augmente.',
  jumpsSoutenue: 'une intensité soutenue ne se combine pas avec les sauts de ton sport',
  jumps72: 'Ton sport comporte des sauts depuis moins de 72 h : sois attentif à tes jambes (estimation grossière, pas un compteur).',
  shoulderDay: 'Ton sport a chargé tes épaules : pas de poussée vers le haut, de dips, de lancer ni de travail lourd de l’épaule aujourd’hui ; tirages et gainage légers seulement.',
  malaiseDay: 'Tu as noté un malaise ou un vertige aujourd’hui : aucune séance n’est proposée. Parles-en à un professionnel de santé.',
  consult: 'Tu as noté une gêne à plusieurs séances de sport, ou un signe d’alerte : consulte un professionnel de santé. Cette zone est retirée de la séance.',
  autre: 'Je ne connais pas ce sport : je compte ta charge sans choisir d’exercices.',
  racquetPrevention: 'Prévention inspirée d’autres sports, non démontrée pour le tennis, le badminton, le padel ou le squash.',
  estimate: 'Sport : estimation de charge, pas un avis médical.',
} as const;
