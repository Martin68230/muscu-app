// « Mon sport », étape 2, S2-B (knowledge/saisie-sport-v1.md §8.2, §8.5 et « Avis kine du 13/11/2026 ») : le placement des séances de force
// du programme lit la carte de la semaine (src/sport/week-map.ts). Fonctions PURES. Le sport ne fait que RETIRER, ALLÉGER ou DÉCALER :
// jamais une série, une séance ou un cardio en plus, jamais un assouplissement de 24 / 48 / 72 h (saisie-sport-v1.md §8.6).
// Choix restrictif de `dev` (13/11/2026, docs/decisions-prises.md) : aucune séance « jambes légères » n'est programmée ; un créneau
// « jambes légères » devient une séance de haut du corps (la séance « Créer » adoucit déjà les jambes à la demande).
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
}

/**
 * Adapte une semaine déjà placée (`labels[i]` le jour `days[i]`) à la carte : une séance qui ne peut pas avoir lieu ce jour-là devient une
 * séance de haut du corps (ou de jambes si seul le haut est interdit) qui ne ressemble à aucune autre de la semaine et ne charge pas un
 * muscle déjà chargé la veille ou le lendemain ; sinon elle est retirée. Au plus 6 jours d'entraînement (force + sport) : la force part
 * avant le sport.
 */
export function adaptWeekToSport(labels: readonly string[], days: readonly number[], map: readonly DayLoad[]): SportAdapt {
  const L = [...labels];
  const D = [...days];
  const hadLegs = L.some((l) => LEG_TYPES.includes(typeOf(l)));
  let converted = 0;
  let dropped = 0;
  for (let i = 0; i < L.length; i++) {
    const d = map[D[i]];
    if (!d) continue;
    const type = typeOf(L[i]);
    if (canHost(type, d)) continue;
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
  return { labels: L, days: D, converted, dropped, noLegs: hadLegs && !L.some((l) => LEG_TYPES.includes(typeOf(l))) };
}
