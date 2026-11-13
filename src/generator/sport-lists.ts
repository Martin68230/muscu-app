// D28 + sport : listes fermées d'exercices par sport (knowledge/saisie-sport-v1.md §4, limitées par §7 « Avis kine du 13/11/2026 »).
// Statut : PROVISOIRE / NON SOURCÉ (jugement de coach, avis kine). Toutes les fiches existent dans public/data/fiches.json (vérifié le 13/11/2026).
// Ces listes ne CONTOURNENT rien : le composeur garde ses filtres (blessure, grossesse, matériel, niveau, chaise calée, espacement, contacts).
// Elles passent EN PRIORITÉ, puis les blocs habituels de « Créer une séance » complètent. Aucun nom de programme (FIFA 11+, OSTRC) n'est affiché.
import type { SportKey } from '../data/model';
import type { CreateEntry } from './config';

/** Entrée d'une liste de sport : une fiche de `CreateEntry` + les conditions propres au sport. */
export interface SportEntry extends CreateEntry {
  /** Exercice d'épaule fragile : jamais proposé le jour même ni le lendemain d'un sport qui charge l'épaule (§7 (c)). */
  shoulderSensitive?: boolean;
  /** Jamais après des sauts, jamais en séance adoucie ni la veille de match, en début de séance (§7 (e), montée rapide sur chaise). */
  startOnly?: boolean;
}

export type SportGroup = 'sauts' | 'foot' | 'raquette' | 'danse';
/** Volley, basket et hand partagent la liste « sauts » (§4). `autre` n'en a aucune. */
export const GROUP_OF: Partial<Record<SportKey, SportGroup>> = { volley: 'sauts', basket: 'sauts', hand: 'sauts', foot: 'foot', raquette: 'raquette', danse: 'danse' };

const e = (id: string, variants: string[], minLevel: SportEntry['minLevel'], extra: Partial<SportEntry> = {}): SportEntry => ({ id, variants, minLevel, ...extra });

const rotExt = e('rotation-externe-epaule', ['rotation-externe-elastique-coude-colle', 'rotation-externe-halteres-couche'], 'debutant');
const facePull = e('face-pull-elastique', ['face-pull-elastique-porte'], 'debutant', { shoulderSensitive: true });
const tirageW = e('tirage-w-allonge', ['tirage-w-sol', 'tirage-w-halteres-legers'], 'debutant', { shoulderSensitive: true });
const oiseau = e('oiseau-un-bras-appuye', ['oiseau-un-bras-sans-charge', 'oiseau-un-bras-bidon', 'oiseau-un-bras-haltere'], 'debutant');
const ytw = e('ytw-sol', ['ytw-sol-sans-charge'], 'debutant', { shoulderSensitive: true });
const pompePlus = e('pompe-plus', ['pompe-plus-mur', 'pompe-plus-genoux'], 'debutant', { shoulderSensitive: true });
const planchLat = e('planche-laterale', ['planche-laterale-genoux', 'planche-laterale-pieds'], 'debutant');
const deadBug = e('dead-bug', ['dead-bug-poids-du-corps'], 'debutant');
const pallof = e('pallof-elastique', ['pallof-elastique-genoux', 'pallof-elastique-debout'], 'debutant');
const planche = e('planche', ['planche-genoux', 'planche-avant-bras'], 'debutant');
const bucheron = e('rotation-bucheron', ['rotation-bucheron-sans-charge', 'rotation-bucheron-elastique'], 'intermediaire');
const touche = e('planche-touche-epaule', ['planche-touche-epaule-genoux'], 'intermediaire', { shoulderSensitive: true });
const birdDog = e('bird-dog', ['bird-dog-sol'], 'debutant');
const glisse = e('glissement-mur-epaules', ['glissement-mur-dos', 'glissement-sol-dos'], 'debutant', { shoulderSensitive: true });
const fenteArr = e('fente-arriere', ['fente-arriere-mur', 'fente-arriere-poids-du-corps'], 'debutant');
const gobelet = e('squat-gobelet', ['squat-gobelet-haltere', 'squat-gobelet-kettlebell'], 'debutant');
const sdtUni = e('souleve-de-terre-roumain-unijambiste', ['sdt-unijambiste-mur', 'sdt-unijambiste-poids-du-corps'], 'intermediaire', { blockZones: ['dos', 'genou', 'hanche', 'cheville'] });
const fenteLat = e('fente-laterale', ['fente-laterale-courte'], 'debutant');
const curlServ = e('curl-ischios-serviette', ['curl-ischios-serviette-pont', 'curl-ischios-serviette-une-jambe'], 'debutant');
const curlElas = e('curl-ischios-elastique', ['curl-ischios-elastique-mur', 'curl-ischios-elastique-chaise'], 'debutant');
const pont1 = e('pont-fessier-une-jambe', ['pont-fessier-une-jambe-sol'], 'intermediaire');
const bulgare = e('squat-bulgare', ['squat-bulgare-chaise'], 'intermediaire', { needsStableChair: true, slow3s: true });
const fendu = e('squat-fendu', ['squat-fendu-mur', 'squat-fendu-poids-du-corps'], 'debutant');
const descente = e('descente-une-jambe-chaise', ['descente-une-jambe-chaise-appui'], 'intermediaire', { needsStableChair: true, slow3s: true });
/** §7 (e) : douce ou modérée seulement, début de séance, chaise calée contre un mur, 2 séries sans charge, refusée en jambes légères et la veille de match. */
const monteeRapide = e('montee-rapide-chaise', ['montee-rapide-chaise-sans-charge'], 'intermediaire', {
  needsStableChair: true, maxSets: 2, reps: [6, 6], notIn: ['soutenue'], blockZones: ['genou', 'hanche', 'cheville', 'dos'], startOnly: true,
  tempo: 'Montée rapide, descente en 3 secondes, le pied entier posé : aucun décollage.',
});

export interface SportList {
  /** Force de jambes (et corps entier). Les sauts (squat-petit-saut, rebonds-chevilles) restent dans le bloc de sauts de « Créer ». */
  legs: readonly SportEntry[];
  /** Haut du corps et tronc. */
  upper: readonly SportEntry[];
  /** Prévention en échauffement : fiches d'échauffement (variante d'échelon 1), 2 exercices (3 à partir de 45 min). */
  prevention: readonly string[];
}

export const SPORT_LISTS: Record<SportGroup, SportList> = {
  sauts: {
    legs: [monteeRapide, fenteArr, gobelet, sdtUni],
    upper: [rotExt, facePull, tirageW, oiseau, ytw, pompePlus, planchLat, deadBug],
    prevention: ['releve-mollets', 'equilibre-sur-une-jambe-en-mouvement', 'cheville-elastique', 'equilibre-unipodal'],
  },
  foot: {
    // `nordique-ischios-court` reste HORS de « Créer » (séance dédiée seulement, K-07).
    legs: [fenteLat, fenteArr, curlServ, curlElas, pont1, sdtUni, bulgare],
    upper: [pallof, planche, planchLat, bucheron],
    prevention: ['abduction-hanche-debout', 'marche-laterale-elastique', 'copenhague-court', 'cheville-elastique', 'releve-mollets'],
  },
  raquette: {
    // `lancer-rotation-mur` RETIRÉ (kine 13/11/2026) : explosif, épaule, non sourcé.
    legs: [fenteLat, fenteArr, fendu, curlServ, sdtUni],
    upper: [rotExt, facePull, oiseau, pallof, touche, bucheron],
    // Prévention extrapolée d'autres sports : aucune pliométrie, 2 fois par semaine au plus, texte obligatoire.
    prevention: ['rotation-externe-epaule', 'pallof-elastique', 'cheville-elastique', 'releve-mollets', 'equilibre-unipodal'],
  },
  danse: {
    legs: [gobelet, fenteArr, pont1, descente],
    upper: [planchLat, deadBug, birdDog, glisse],
    prevention: ['equilibre-sur-une-jambe-en-mouvement', 'equilibre-unipodal', 'releve-mollets', 'abduction-hanche-debout', 'mobilite-hanches-90-90', 'mobilite-cheville-au-mur', 'cercles-de-cheville'],
  },
};

/** Préventions d'épaule : retirées le jour d'un sport qui charge l'épaule, ou si « épaule fatiguée » est coché (§7 (c)) ; volley, hand, raquette. */
export const SHOULDER_PREVENTION: Partial<Record<SportKey, string>> = { volley: 'rotation-externe-epaule', hand: 'rotation-externe-epaule', raquette: 'rotation-externe-epaule' };
/** Exercices de prévention qui sollicitent l'épaule (jamais proposés dans ces cas). */
export const SHOULDER_IDS: readonly string[] = ['rotation-externe-epaule'];

/** Prévention des raquettes : au plus 2 fois par semaine, jamais sans le texte d'extrapolation. */
export const RACQUET_PREVENTION = { maxPerWeek: 2 } as const;

/** Haut du corps interdit le jour même et le lendemain d'un sport qui charge l'épaule (§7 (a)) : poussée verticale, dips, élévation chargée, lancer, pliométrie. */
export const UPPER_PUSH_SCHEMAS: readonly string[] = ['poussee_v'];
export const UPPER_PUSH_IDS: readonly string[] = ['dips-banc-triceps', 'lancer-poitrine-mur', 'lancer-bas-haut-mur', 'lancer-rotation-mur', 'squat-lancer-mur', 'pullover-haltere-au-sol', 'pompe-piquee', 'pompe-piquee-pieds-sureleves'];
