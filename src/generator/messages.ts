// Textes des messages (§8.2) et de l'explication (§8.1). Rédaction NON SOURCÉ, sauf R3 et C3 (repris des règles de sécurité).
import { NECK_SHOCK_MESSAGE } from '../data/injury-rules';
import { U1_TEL, U1_TEXT } from '../session/messages';
import type { GG } from './config';
import type { GenMessage, MessageId } from './types';

/** Nombre décimal affiché à l'utilisateur : virgule française, une décimale au plus (« 7,5 »). */
export const frNum = (n: number): string => String(Math.round(n * 10) / 10).replace('.', ',');

export const WEEKDAY_NAMES = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
export const GG_LABEL: Record<GG, string> = {
  GG1: 'Le devant des cuisses',
  GG2: "Le groupe hanches et arrière des cuisses",
  GG3: 'Le haut du corps en poussée (pectoraux, épaules, triceps)',
  GG4: 'Le dos (tirage)',
  GG5: 'Le tronc (gainage)',
};
export const SCHEMA_LABEL: Record<string, string> = {
  squat: 'squat',
  fente: 'fente',
  poussee_h: 'poussée horizontale',
  poussee_v: 'poussée vers le haut',
  tirage_h: 'tirage horizontal',
  tirage_v: 'tirage vertical',
  charniere: 'charnière de hanche',
  gainage: 'gainage',
  anti_rotation: 'anti-rotation',
  rotation: 'rotation',
  porte: 'porté',
  hanche_laterale: 'hanche latérale',
  cheville_mollet: 'cheville et mollet',
};
export const ZONE_LABEL: Record<string, string> = {
  cou: 'cou', epaule: 'épaule', coude: 'coude', poignet: 'poignet', dos: 'dos', hanche: 'hanche', genou: 'genou',
  cheville: 'cheville', cuisse: 'arrière de la cuisse', aine: 'aine', grossesse: 'grossesse ou post-partum',
};
export const ACHAT_LABEL: Record<string, string> = {
  sac_a_dos: 'un sac à dos',
  bidons_ou_sacs: 'des bidons ou des sacs de courses',
  elastique: 'un élastique avec un ancrage de porte',
  halteres: 'des haltères',
  barre_traction: 'une barre de traction',
  banc: 'un banc',
  kettlebell: 'un kettlebell',
};
export const R3_TEXT = "Douleur signalée : demande l'avis d'un professionnel de santé avant de reprendre les exercices de cette zone.";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const list = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} et ${xs[xs.length - 1]}`);
const m = (id: MessageId, text: string, extra: Partial<GenMessage> = {}): GenMessage => ({ id, text, ...extra });

export const msg = {
  hors: () => m('V-MSG-HORS', 'Choisis entre 1 et 6 jours par semaine.'),
  jours: (days: number[]) =>
    m(
      'V-MSG-JOURS',
      `Tes jours libres ne laissent pas assez de repos entre deux séances qui travaillent les mêmes muscles : on part sur ${days.length} séance${days.length > 1 ? 's' : ''} (${list(days.map((d) => WEEKDAY_NAMES[d]))}).`,
    ),
  /** D25, STR-REP-1 : texte du fichier de règles, mot pour mot. */
  unJour: () =>
    m(
      'V-MSG-UN-JOUR',
      "Une séance par semaine, c'est mieux que rien, mais les repères demandent au moins 2 séances par semaine pour chaque grand muscle. Passer à 2 jours est possible dans ton profil.",
    ),
  /** D25, STR-REP-1 (ajout `kine`) : séance unique d'un débutant ramenée à 45 min. Texte corrigé (knowledge/textes-d25-revue.md §1). */
  unJourDuree: (min: number) =>
    m('V-MSG-UN-JOUR-DUREE', `Avec un seul jour par semaine, ta séance dure ${min} min au plus. Si tu ajoutes un deuxième jour, tu pourras avoir deux séances plus courtes.`),
  /** D25, STR-REP-6 et 14 c : textes corrigés (knowledge/textes-d25-revue.md §2, aucune promesse). */
  legers: (reason: 'debutant' | 'zone') =>
    m(
      'V-MSG-LEGERS',
      reason === 'debutant'
        ? "Pour débuter, l'app limite à 4 séances de force par semaine. Les autres jours sont légers : mobilité douce, rien de lourd."
        : "À cause de la gêne que tu as indiquée, l'app limite à 4 séances de force par semaine. Les autres jours sont légers : mobilité douce, rien de lourd.",
    ),
  /** D25, STR-REP-11 : texte du fichier de règles, mot pour mot. */
  grosSeances: (n: number) =>
    m('V-MSG-GROS-SEANCES', `Pendant la grossesse (ou après un accouchement), l'app limite à ${n} séances de force par semaine ; les autres jours sont légers.`),
  jours2: (suggestion: number | null) =>
    m(
      'V-MSG-JOURS2',
      "Tes jours libres se suivent : il faut environ 48 h entre deux séances du corps entier. Essaie d'ajouter un jour d'écart" +
        (suggestion !== null ? ` (par exemple ${WEEKDAY_NAMES[suggestion]})` : '') +
        ' dans tes jours disponibles.',
      { action: { label: 'Modifier mes jours', target: 'jours-bloques' } },
    ),
  /** D26, CORE-FREQ-3 et CORE-SEC-2 point 4 : message neutre (pas d'alerte, pas de diagnostic), texte du fichier de règles. */
  tronc: () => m('V-MSG-TRONC', "Le tronc est adapté à ta situation : pas d'exercice de tronc cette semaine."),
  pro: () => m('V-MSG-PRO', "Avec les gênes déclarées, l'app ne peut pas proposer de séance sûre. Demande l'avis d'un professionnel de santé."),
  grosDuree: () => m('V-MSG-GROS-DUREE', 'Grossesse ou après un accouchement : séances de 60 min au plus. Ta séance est ramenée à 60 min.'),
  grosAvis: () =>
    m(
      'V-MSG-GROS-AVIS',
      "Demande l'avis de ton médecin ou de ta sage-femme avant de t'entraîner. Cette appli n'est pas un avis médical : si l'un d'eux t'a déconseillé le sport, ne suis pas ces exercices.",
    ),
  epaules: (tags: string[], withAchat: boolean) => {
    const opts = tags.map((t) => ACHAT_LABEL[t] ?? t);
    const orList = opts.length <= 1 ? opts.join('') : `${opts.slice(0, -1).join(', ')} ou ${opts[opts.length - 1]}`;
    return m(
      'V-MSG-EPAULES',
      'Avec ton matériel, pas de poussée vers le haut : tes épaules sont peu travaillées.' +
        (!withAchat && opts.length ? ` ${cap(orList)} en ${opts.length > 1 ? 'ajouteraient' : 'ajouterait'}.` : ''),
      { data: { tags } },
    );
  },
  dureeMin: (min: number) => m('V-MSG-DUREE-MIN', `Durée ramenée à ${min} min, le minimum pour une séance.`),
  freq: (gg: GG, n: number, fix: string | null) =>
    m(
      'V-MSG-FREQ',
      `${GG_LABEL[gg]} n'est travaillé que ${frNum(n)} fois par semaine. Le repère est d'au moins 2 fois.` + (fix ? ` Pour corriger : ${fix}.` : ''),
      { data: { gg, n } },
    ),
  plans: () => m('V-MSG-PLANS', 'Poitrine et dos sont travaillés une fois à plat, une fois vers le haut.'),
  plan: (schema: string, nom: string, session: string) =>
    m('V-MSG-PLAN', `Pas de ${SCHEMA_LABEL[schema] ?? schema} possible ici : ${nom} le remplace.`, { session }),
  subst: (schema: string, nom: string, session: string) =>
    m('V-MSG-SUBST', `Avec ton matériel, pas de vrai ${SCHEMA_LABEL[schema] ?? schema} : ${nom} le remplace en partie.`, { session }),
  impos: (schema: string, session: string) =>
    m('V-MSG-IMPOS', `${cap(SCHEMA_LABEL[schema] ?? schema)} : aucun exercice possible avec ton matériel.`, { session }),
  zone: (schema: string, zones: string[], session: string) =>
    m('V-MSG-ZONE', `${cap(SCHEMA_LABEL[schema] ?? schema)} retiré à cause de la gêne déclarée (${list(zones.map((z) => ZONE_LABEL[z] ?? z))}).`, {
      session,
      data: { zones },
    }),
  r3: (zone: string) => m('R3', `${cap(ZONE_LABEL[zone] ?? zone)} : ${R3_TEXT}`, { data: { zone } }),
  c3: () => m('C3', NECK_SHOCK_MESSAGE),
  achat: (tag: string, n: number) =>
    m('V-MSG-ACHAT', `L'achat le plus utile pour toi : ${ACHAT_LABEL[tag] ?? tag}. Il permet ${n} exercice(s) de plus.`, { data: { tag, n } }),
  objet: (tag: string, n: number) =>
    m(
      'V-MSG-OBJET',
      `As-tu ${ACHAT_LABEL[tag] ?? tag} ? Coche-${tag === 'bidons_ou_sacs' ? 'les' : 'le'} dans Mon matériel : il permet ${n} exercice(s) de plus.`,
      { data: { tag, n } },
    ),
  force: () =>
    m('V-MSG-FORCE', 'La force maximale progresse surtout avec des charges lourdes. Sans elles, on travaille avec des variantes plus difficiles.'),
  vol: (muscle: string, n: number) =>
    m('V-MSG-VOL', `${cap(muscle)} : ${frNum(n)} séries par semaine, sous le repère de 10 pour la prise de muscle. Allonge la séance ou ajoute du matériel.`, {
      data: { muscle, n },
    }),
  duree: (durMin: number, removed: string[], session: string, realMin: number | null, split = false) =>
    m(
      'V-MSG-DUREE',
      `${durMin} min, c'est court pour ${split ? 'une séance complète' : 'un corps entier complet'}` +
        (removed.length ? ` : ${list(removed)} ${removed.length > 1 ? 'ont été retirés' : 'a été retiré'}.` : '.') +
        (realMin !== null ? ` La séance minimale dure ${realMin} min.` : ''),
      { session },
    ),
  objGras: () =>
    m('V-MSG-OBJ', "La perte de gras dépend surtout de l'alimentation ; le plan de repas arrive dans une prochaine version. Repère OMS : 150 à 300 min d'activité modérée par semaine."),
  /** Objectif `endurance` (toujours ramené à la famille sante en v1). Le cardio a ses propres messages (cardioMsg, B4). */
  objCardio: () => m('V-MSG-OBJ', "Repère OMS : 150 à 300 min d'activité modérée par semaine."),
  objSport: () => m('V-MSG-OBJ', 'Les programmes par sport arrivent dans une prochaine version.'),
  /** D31 (cardio-regles.md §3.2ter B (c), `kine`) : séance de sport incluse. */
  sportMatch: () => m('V-MSG-SPORT-MATCH', 'Évite de faire ta séance de cardio la veille d’un match, et le lendemain d’un match en cas de courbatures.'),
  /** D33 (programmes-v3.md §6, PV3-CAR-3) : texte de `coach`, confirmé par `kine`. */
  cardioDefaut: () => m('V-MSG-CARDIO-DEFAUT', 'Tu as choisi de perdre du gras : une séance de cardio facile est ajoutée. Tu peux la retirer dans ton profil.'),
};

export function dedupe(ms: GenMessage[]): GenMessage[] {
  const seen = new Set<string>();
  return ms.filter((x) => {
    const k = `${x.id}|${x.text}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export const GOAL_LABEL: Record<string, string> = {
  perte_gras: 'Perte de gras',
  cardio: 'Cardio',
  endurance: 'Endurance',
  sport: 'Sport',
  mobilite: 'Mobilité',
  fonctionnel: 'Fonctionnel',
};

// ---------------------------------------------------------------------------------------------
// Cardio (B4) : textes de `kine` repris MOT POUR MOT de knowledge/cardio-regles.md §9bis (T0-T5, T7 ; PROVISOIRE) ; ne pas
// les réécrire ici. T1u : U1 identique partout (src/session/messages.ts), déclencheurs en ligne séparée au-dessus.
// ---------------------------------------------------------------------------------------------
export const CARDIO_TEXT = {
  T0: "Le cardio fait travailler ton cœur et ta respiration. Cette appli n'est pas un avis médical et ne remplace pas un médecin. Commence doucement, écoute ton corps, et arrête si quelque chose ne va pas.",
  T1: "Arrête la séance si tu ressens : une douleur ou un serrement dans la poitrine, le cou, la mâchoire, l'épaule, le dos ou le bras, qui apparaît ou augmente à l'effort ; un malaise ; un vertige ou la vue qui se brouille ; un essoufflement anormal, qui ne se calme pas quelques minutes après l'arrêt ; des battements de cœur très rapides ou irréguliers ; des sueurs froides, une nausée ou une faiblesse inhabituelles. Assieds-toi, bois un peu d'eau, et ne reprends pas aujourd'hui. Ne reprends pas le cardio avant d'avoir eu l'avis d'un médecin.",
  T1uTriggers: 'Douleur ou pression dans la poitrine qui ne passe pas quand tu te reposes, perte de connaissance, difficulté à respirer au repos.',
  T3: "Si tu n'as pas bougé depuis longtemps, si tu reviens après une maladie ou une opération, ou si un médecin t'a parlé de ton cœur ou de ta tension, demande-lui son avis avant de reprendre. Sinon, commence tout doucement : marche, effort facile.",
  T4: "Bouger est bon pour presque tout le monde, y compris avec une tension élevée ou une maladie chronique, s'il n'y a pas de contre-indication. Si ton médecin t'a déconseillé le sport, ne suis pas ce programme.",
  T5: "Ici le cardio reste toujours modéré : tu dois pouvoir parler. Pas de saut, pas de course. Évite la chaleur. Arrête au moindre saignement, perte de liquide, vertige, contraction régulière ou douleur de poitrine. En cas de saignement, de perte des eaux, de contractions régulières douloureuses ou de douleur de poitrine : appelle la maternité ou le 15. Pour un vertige ou un autre malaise : appelle ton médecin ou ta sage-femme.",
  T7: 'Si tu ne peux plus dire une phrase, ralentis.',
};

export const cardioMsg = {
  t0: () => m('T0', CARDIO_TEXT.T0),
  t4: () => m('T4', CARDIO_TEXT.T4),
  t3: () => m('T3', CARDIO_TEXT.T3),
  t1: () => m('T1', CARDIO_TEXT.T1),
  t1u: () => m('T1u', `${CARDIO_TEXT.T1uTriggers} ${U1_TEXT}`, { data: { tel: U1_TEL } }),
  t5: () => m('T5', CARDIO_TEXT.T5),
  /** §2 : repère OMS (C1 : OK), affiché comme repère, jamais comme objectif. Formulation de `coach` (proposition §2). */
  oms: (x: number) =>
    m('V-MSG-CARDIO-OMS', `Repère de l'OMS : 150 à 300 min d'effort modéré par semaine (ou 75 à 150 min d'effort soutenu). Ton programme en compte environ ${x} min.`, { data: { min: x } }),
  /** §2, correction coach R-h : grossesse, repère non affiché comme objectif. */
  omsGrossesse: (x: number) =>
    m(
      'V-MSG-CARDIO-OMS',
      `L'OMS recommande au moins 150 min d'effort modéré par semaine pendant la grossesse, quand tout va bien ; ton programme en compte ${x}. Fais ce qui est proposé, à ton rythme : ton médecin ou ta sage-femme peut t'en dire plus.`,
      { data: { min: x } },
    ),
  /** §7 : avertissement quand le temps manque (texte de `coach`). */
  temps: (session?: string) => m('V-MSG-CARDIO-TEMPS', 'Pas assez de temps pour le cardio ce jour-là : il est retiré avant tout le reste du programme.', session ? { session } : {}),
  /** Aucun type de cardio possible (gênes, réglage, matériel) : jamais d'exercice hors profil. Rédaction `dev`, NON SOURCÉ. */
  impos: () => m('V-MSG-CARDIO-IMPOS', "Avec tes réglages et tes gênes déclarées, l'app ne peut pas proposer de cardio sûr. Demande l'avis d'un professionnel de santé."),
  /** Réserve n° 8 du recontrôle : `machine_cardio` coché mais aucune fiche machine relue. Rédaction `dev`, NON SOURCÉ. */
  machine: () =>
    m('V-MSG-CARDIO-MACHINE', "Vélo, rameur, tapis de course : pas encore d'exercice relu pour ces appareils. Le cardio proposé est la marche rapide, sur place ou dans ton logement."),
  /** §3.2 : moins de jours libres que de séances de cardio prévues (jamais de séance double). Rédaction `dev`, NON SOURCÉ. */
  jours: (planned: number, placed: number) =>
    m('V-MSG-CARDIO-JOURS', `Tes jours libres ne laissent de la place que pour ${placed} séance(s) de cardio sur ${planned} : jamais deux séances le même jour.`, {
      data: { planned, placed },
    }),
};
