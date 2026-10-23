// Textes des messages (§8.2) et de l'explication (§8.1). Rédaction NON SOURCÉ, sauf R3 et C3 (repris des règles de sécurité).
import { NECK_SHOCK_MESSAGE } from '../data/injury-rules';
import type { GG } from './config';
import type { GenMessage, MessageId } from './types';

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
  hors: () => m('V-MSG-HORS', 'Ce rythme arrive dans une prochaine version. Choisis 2 ou 3 jours pour l\'instant.'),
  jours: (days: number[]) =>
    m('V-MSG-JOURS', `Tes jours libres ne laissent pas 48 h entre deux séances : on part sur 2 séances (${list(days.map((d) => WEEKDAY_NAMES[d]))}).`),
  jours2: (suggestion: number | null) =>
    m(
      'V-MSG-JOURS2',
      "Tes jours libres se suivent : il faut environ 48 h entre deux séances du corps entier. Essaie d'ajouter un jour d'écart" +
        (suggestion !== null ? ` (par exemple ${WEEKDAY_NAMES[suggestion]})` : '') +
        ' dans tes jours disponibles.',
      { action: { label: 'Modifier mes jours', target: 'jours-bloques' } },
    ),
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
      `${GG_LABEL[gg]} n'est travaillé que ${n} fois par semaine. Le repère est d'au moins 2 fois.` + (fix ? ` Pour corriger : ${fix}.` : ''),
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
    m('V-MSG-VOL', `${cap(muscle)} : ${Math.round(n * 10) / 10} séries par semaine, sous le repère de 10 pour la prise de muscle. Allonge la séance ou ajoute du matériel.`, {
      data: { muscle, n },
    }),
  duree: (durMin: number, removed: string[], session: string, realMin: number | null) =>
    m(
      'V-MSG-DUREE',
      `${durMin} min, c'est court pour un corps entier complet` +
        (removed.length ? ` : ${list(removed)} ${removed.length > 1 ? 'ont été retirés' : 'a été retiré'}.` : '.') +
        (realMin !== null ? ` La séance minimale dure ${realMin} min.` : ''),
      { session },
    ),
  objGras: () =>
    m('V-MSG-OBJ', "La perte de gras dépend surtout de l'alimentation ; le plan de repas arrive dans une prochaine version. Repère OMS : 150 à 300 min d'activité modérée par semaine."),
  objCardio: () => m('V-MSG-OBJ', "Repère OMS : 150 à 300 min d'activité modérée par semaine."),
  objSport: () => m('V-MSG-OBJ', 'Les programmes par sport arrivent dans une prochaine version.'),
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
