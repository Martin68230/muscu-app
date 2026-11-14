// « Mon sport », étape 2, S2-B (knowledge/saisie-sport-v1.md §8.2, §8.5 et « Avis kine du 13/11/2026 ») : le placement des séances de force
// du programme lit la carte de la semaine (src/sport/week-map.ts). Fonctions PURES. Le sport ne fait que RETIRER, ALLÉGER ou DÉCALER :
// jamais une série, une séance ou un cardio en plus, jamais un assouplissement de 24 / 48 / 72 h (saisie-sport-v1.md §8.6).
// A1 (saisie-sport-v1.md §9, avis kine du 13/11/2026) : quand le sport occupe EXACTEMENT 3 jours, un seul créneau « jambes légères » (le plus éloigné des jours
// de sport) devient une séance CORPS ENTIER (jambes en mode « jambes légères », sport-legs-light.ts) ; tout autre créneau adouci, ou si A1 n'est pas possible,
// devient une séance de haut du corps (choix restrictif de `dev` du 13/11/2026).
import { MIN_GAP_DAYS } from './config';
import { conflicts, typeOf } from './split';
import type { DayLoad } from '../sport/week-map';

const LEG_TYPES = ['CE', 'BAS', 'LEGS'];
const PUSH_TYPES = ['CE', 'HAUT', 'PUSH'];
/** Séances de haut du corps proposées en remplacement, dans cet ordre. */
const UPPER_CANDIDATES = ['HAUT-A', 'HAUT-B', 'PULL-A', 'PULL-B', 'PUSH-A', 'PUSH-B'];
/** Séances de jambes proposées si le haut du corps est interdit mais pas les jambes. */
const LEGS_CANDIDATES = ['BAS-A', 'BAS-B', 'LEGS-A', 'LEGS-B'];

const circGap = (a: number, b: number): number => Math.min(Math.abs(a - b), 7 - Math.abs(a - b));

/** Jours où AUCUNE séance de force n'est posée (match ; veille d'un match pour un débutant : jamais d'exercice nouveau). */
export function noForceDays(map: readonly DayLoad[], level: string): number[] {
  return map.filter((d) => d.noForce || (d.eveOfMatch && level === 'debutant')).map((d) => d.weekday);
}

/** Une séance de ce type peut-elle avoir lieu ce jour-là ? */
export function canHost(type: string, d: DayLoad): boolean {
  if (d.noForce) return false;
  if (LEG_TYPES.includes(type) && d.legs !== 'ok' && d.legs !== 'warn') return false;
  if (PUSH_TYPES.includes(type) && d.noUpperPush) return false;
  return true;
}

export interface SportAdapt {
  labels: string[];
  days: number[];
  /** Séances changées en haut du corps (ou jambes) à cause du sport. */
  converted: number;
  /** Séances retirées faute de place. */
  dropped: number;
  /** Aucune séance de jambes dans la semaine alors que le programme voulu en avait. */
  noLegs: boolean;
  /** A1 : étiquette de la séance corps entier à jambes légères (une seule par semaine), ou null. */
  a1Label: string | null;
}

/** Étiquettes des séances corps entier (gabarits A, B, C). */
const CE_LABELS = ['A', 'B', 'C'];

/**
 * Adapte une semaine déjà placée (`labels[i]` le jour `days[i]`) à la carte : une séance qui ne peut pas avoir lieu ce jour-là devient une
 * séance de haut du corps (ou de jambes si seul le haut est interdit) qui ne ressemble à aucune autre de la semaine et ne charge pas un
 * muscle déjà chargé la veille ou le lendemain ; sinon elle est retirée. Au plus 6 jours d'entraînement (force + sport) : la force part
 * avant le sport.
 */
export function adaptWeekToSport(labels: readonly string[], days: readonly number[], map: readonly DayLoad[], a1Allowed = false): SportAdapt {
  const L = [...labels];
  const D = [...days];
  const hadLegs = L.some((l) => LEG_TYPES.includes(typeOf(l)));
  let converted = 0;
  let dropped = 0;
  // A1 : exactement 3 jours de sport ; créneau « jambes légères » (D + 2 ou D + 3), jamais un jour chargé, de match, de veille de match ni de refus ;
  // le plus éloigné des jours de sport. Une seule séance par semaine.
  const sportWeekdays = map.filter((d) => d.sportDay).map((d) => d.weekday);
  const a1Day = (d: DayLoad | undefined): boolean =>
    !!d && a1Allowed && sportWeekdays.length === 3 && d.legs === 'soften' && !d.sportDay && !d.noForce && !d.eveOfMatch && !d.matchDay && !d.dayAfterMatch && !d.noUpperPush;
  const farFromSport = (day: number) => Math.min(...sportWeekdays.map((w) => circGap(day, w)));
  const a1Pick = L.map((l, i) => ({ l, day: D[i] }))
    .filter((x) => LEG_TYPES.includes(typeOf(x.l)) && a1Day(map[x.day]))
    .sort((a, b) => farFromSport(b.day) - farFromSport(a.day) || a.day - b.day)[0]?.l ?? null;
  let a1Label: string | null = null;
  for (let i = 0; i < L.length; i++) {
    const d = map[D[i]];
    if (!d) continue;
    const type = typeOf(L[i]);
    if (canHost(type, d)) continue;
    if (L[i] === a1Pick) {
      // Corps entier : l'étiquette CE existante, sinon la première libre ; il ne doit pas coller une autre séance de la semaine.
      const ce = type === 'CE' ? L[i] : CE_LABELS.find((c) => !L.includes(c));
      if (ce && L.every((_l, j) => j === i || circGap(D[i], D[j]) >= MIN_GAP_DAYS)) {
        if (ce !== L[i]) { L[i] = ce; converted++; }
        a1Label = ce;
        continue;
      }
    }
    const pool = LEG_TYPES.includes(type) && d.legs !== 'ok' && d.legs !== 'warn' ? UPPER_CANDIDATES : [...LEGS_CANDIDATES, ...UPPER_CANDIDATES];
    const pick = pool.find((c) => {
      if (L.some((l, j) => j !== i && l === c) || !canHost(typeOf(c), d)) return false;
      return L.every((l, j) => j === i || !conflicts(c, l) || circGap(D[i], D[j]) >= MIN_GAP_DAYS);
    });
    if (pick) { L[i] = pick; converted++; } else { L.splice(i, 1); D.splice(i, 1); i--; dropped++; }
  }
  // 6 jours d'entraînement au plus (force + jours de sport) : on retire de la force, jamais le sport.
  const sportDays = new Set(map.filter((d) => d.sportDay).map((d) => d.weekday));
  const total = () => new Set([...D, ...sportDays]).size;
  while (total() > 6) {
    let k = -1;
    for (let i = D.length - 1; i >= 0; i--) if (!sportDays.has(D[i])) { k = i; break; }
    if (k < 0) break;
    L.splice(k, 1);
    D.splice(k, 1);
    dropped++;
  }
  return { labels: L, days: D, converted, dropped, noLegs: hadLegs && !L.some((l) => LEG_TYPES.includes(typeOf(l))), a1Label: a1Label !== null && L.includes(a1Label) ? a1Label : null };
}

/**
 * A1, semaine déjà placée sans séance de jambes (les jours habituels ne laissent aux jambes que le créneau adouci) : exactement 3 jours de sport,
 * le créneau adouci le plus éloigné des jours de sport reçoit la séance CORPS ENTIER à jambes légères. Une séance déjà posée ce jour-là devient
 * corps entier ; sinon la séance de haut du corps la plus proche vient s'y poser (même nombre de séances, aucune ajoutée), à condition que la
 * séance corps entier reste à MIN_GAP_DAYS de toutes les autres. Renvoie null si A1 n'est pas possible.
 */
export function placeA1(labels: readonly string[], days: readonly number[], map: readonly DayLoad[], allowed: boolean): { labels: string[]; days: number[]; a1Label: string } | null {
  const sportWeekdays = map.filter((d) => d.sportDay).map((d) => d.weekday);
  if (!allowed || sportWeekdays.length !== 3 || labels.some((l) => LEG_TYPES.includes(typeOf(l)))) return null;
  const far = (day: number) => Math.min(...sportWeekdays.map((w) => circGap(day, w)));
  const slots = map
    .filter((d) => d.legs === 'soften' && !d.sportDay && !d.noForce && !d.eveOfMatch && !d.matchDay && !d.dayAfterMatch && !d.noUpperPush)
    .map((d) => d.weekday)
    .sort((a, b) => far(b) - far(a) || a - b);
  const ce = CE_LABELS.find((c) => !labels.includes(c));
  if (!ce) return null;
  for (const day of slots) {
    const order = labels.map((_, i) => i).sort((a, b) => circGap(days[a], day) - circGap(days[b], day));
    for (const i of order) {
      if (days[i] !== day && !UPPER_CANDIDATES.includes(labels[i])) continue;
      if (!labels.every((_l, j) => j === i || circGap(day, days[j]) >= MIN_GAP_DAYS)) continue;
      const pairs = labels.map((l, j) => ({ l: j === i ? ce : l, d: j === i ? day : days[j] })).sort((a, b) => a.d - b.d);
      return { labels: pairs.map((x) => x.l), days: pairs.map((x) => x.d), a1Label: ce };
    }
  }
  return null;
}
