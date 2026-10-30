// D25 : types de séance, répartition par nombre de jours et calendrier (knowledge/structure-programmes.md §2, STR-REP-1 à 14).
// Fonctions pures et déterministes. Les valeurs (tables, plafonds) sont dans config.ts avec leur statut.
import type { Level } from '../data/model';
import {
  BEGINNER_MAX_CONSECUTIVE_FORCE, LIGHT_SPLIT_MAX_FORCE, MIN_DAYS_WITHOUT_FORCE, MIN_GAP_DAYS, PREGNANCY_MAX_FORCE, SPLIT_BY_DAYS,
  SPLIT_SENSITIVE_ZONES, type Family, type GG, type SessionType,
} from './config';
import type { SlotKey } from './types';

export const typeOf = (label: string): SessionType => (label.includes('-') ? (label.split('-')[0] as SessionType) : 'CE');
/** Gabarit V-ROT : A = horizontal d'abord, B = vertical d'abord, C = corps entier 3e séance. */
export const templateOf = (label: string): 'A' | 'B' | 'C' => (label.includes('-') ? (label.slice(-1) as 'A' | 'B') : (label as 'A' | 'B' | 'C'));

/** V-EMP corps entier (inchangé). */
const CE_SLOTS: readonly SlotKey[] = ['jambes_genou', 'poussee_1', 'tirage_1', 'charniere', 'tronc', 'poussee_2', 'tirage_2', 'jambes_2', 'fonctionnel'];
const LEG_SLOTS: readonly SlotKey[] = ['jambes_genou', 'charniere', 'tronc', 'jambes_2', 'jambes_3', 'jambes_4', 'fonctionnel'];
/**
 * §2.2 : emplacements de chaque type, dans l'ordre de remplissage (noyau, tronc si désigné, accessoires par indice croissant,
 * fonctionnel). HAUT et PUSH n'ont pas de `fonctionnel` (E-19) ; PUSH n'a jamais de `tronc` (T-D25-02).
 */
export const TYPE_SLOTS: Record<SessionType, readonly SlotKey[]> = {
  CE: CE_SLOTS,
  HAUT: ['poussee_1', 'tirage_1', 'tronc', 'poussee_2', 'tirage_2', 'poussee_3', 'tirage_3'],
  BAS: LEG_SLOTS,
  LEGS: LEG_SLOTS,
  PUSH: ['poussee_1', 'poussee_2', 'poussee_3', 'poussee_4'],
  PULL: ['tirage_1', 'tirage_2', 'tronc', 'tirage_3', 'tirage_4', 'fonctionnel'],
};
/** STR-REP-4 : noyau par type, jamais retiré pour la durée (corps entier : noyau et ordre de retrait existants). */
export const TYPE_NOYAU: Record<SessionType, readonly SlotKey[]> = {
  CE: ['jambes_genou', 'poussee_1', 'tirage_1', 'charniere', 'tronc'],
  HAUT: ['poussee_1', 'tirage_1'],
  BAS: ['jambes_genou', 'charniere'],
  LEGS: ['jambes_genou', 'charniere'],
  PUSH: ['poussee_1', 'poussee_2'],
  PULL: ['tirage_1', 'tirage_2'],
};
/** Grands groupes chargés comme muscle principal par chaque type (STR-REP-8, V-FREQ par type ; GG5 suit le plancher de core). */
export const TYPE_GG: Record<SessionType, readonly GG[]> = {
  CE: ['GG1', 'GG2', 'GG3', 'GG4'],
  HAUT: ['GG3', 'GG4'],
  BAS: ['GG1', 'GG2'],
  LEGS: ['GG1', 'GG2'],
  PUSH: ['GG3'],
  PULL: ['GG4'],
};
export const conflicts = (a: string, b: string): boolean => TYPE_GG[typeOf(a)].some((g) => TYPE_GG[typeOf(b)].includes(g));
/** Séances « haut du corps » (STR-REP-14 b) : remplacées par un jour léger sous 3 exercices de force. */
export const UPPER_TYPES: readonly SessionType[] = ['HAUT', 'PUSH', 'PULL'];

const TYPE_TITLE: Record<SessionType, string> = { CE: 'Séance', HAUT: 'Haut du corps', BAS: 'Bas du corps', PUSH: 'Poussée', PULL: 'Tirage', LEGS: 'Jambes' };
/** Titre affiché : « Séance A » (corps entier, inchangé), « Haut du corps A », « Tirage B »… */
export const sessionTitle = (label: string): string => `${TYPE_TITLE[typeOf(label)]} ${templateOf(label)}`;

export interface SplitInput {
  level: Level;
  /** Niveau non renseigné dans le profil (STR-REP-11 b : comme une débutante). */
  levelAbsent: boolean;
  goalFamily: Family;
  pregnant: boolean;
  /** Zones au niveau >= 2 (hors grossesse). */
  zones2: string[];
}
export interface SplitPlan {
  labels: string[];
  /** Jours légers demandés (STR-REP-6, STR-REP-11). */
  light: number;
  reason: 'normal' | 'debutant' | 'zone' | 'grossesse';
}

/** Répartition pour N jours (STR-REP-2 : par N seul ; exceptions STR-REP-6, STR-REP-11, STR-REP-14 c). */
export function chooseSplit(n: number, s: SplitInput): SplitPlan {
  if (s.pregnant) {
    // STR-REP-11 : corps entier uniquement, au plus 3 séances de force (2 pour une débutante ou un niveau absent), jours légers ensuite.
    const max = s.level === 'debutant' || s.levelAbsent ? PREGNANCY_MAX_FORCE.debutant : PREGNANCY_MAX_FORCE.autres;
    const k = Math.min(n, max);
    return { labels: [...SPLIT_BY_DAYS[k]], light: n - k, reason: 'grossesse' };
  }
  if (n > LIGHT_SPLIT_MAX_FORCE) {
    if (s.level === 'debutant' || s.goalFamily === 'sante') return { labels: [...SPLIT_BY_DAYS[LIGHT_SPLIT_MAX_FORCE]], light: n - LIGHT_SPLIT_MAX_FORCE, reason: 'debutant' };
    if (s.zones2.some((z) => SPLIT_SENSITIVE_ZONES.includes(z))) return { labels: [...SPLIT_BY_DAYS[LIGHT_SPLIT_MAX_FORCE]], light: n - LIGHT_SPLIT_MAX_FORCE, reason: 'zone' };
  }
  return { labels: [...SPLIT_BY_DAYS[n]], light: 0, reason: 'normal' };
}

function combos(items: number[], k: number): number[][] {
  if (k === 0) return [[]];
  const out: number[][] = [];
  items.forEach((x, i) => {
    for (const rest of combos(items.slice(i + 1), k - 1)) out.push([x, ...rest]);
  });
  return out;
}
const circGap = (a: number, b: number): number => {
  const d = Math.abs(a - b);
  return Math.min(d, 7 - d);
};
/** Plus longue suite de jours consécutifs (semaine circulaire). */
function longestRun(days: number[]): number {
  if (days.length >= 7) return 7;
  let best = 0;
  for (const d of days) {
    if (days.includes((d + 6) % 7)) continue; // début de suite
    let n = 1;
    while (days.includes((d + n) % 7)) n++;
    best = Math.max(best, n);
  }
  return best;
}

/**
 * STR-REP-8 : jours des séances `labels` (dans cet ordre) parmi les jours libres. Filtres AVANT le départage : deux séances qui
 * chargent un même grand groupe ne sont jamais sur deux jours consécutifs (écart circulaire >= MIN_GAP_DAYS), au moins un jour sans
 * force, débutant : jamais plus de 2 jours de force de suite. Départage : écart minimal maximal entre séances d'un même grand groupe
 * (lecture de `dev` : « l'écart » de la règle est celui des séances qui partagent un muscle ; en corps entier c'est l'écart de V-JOURS),
 * puis ordre lexicographique. null si aucune combinaison ne passe.
 */
export function scheduleDays(blocked: number[], labels: string[], beginner: boolean): number[] | null {
  const free = [0, 1, 2, 3, 4, 5, 6].filter((d) => !blocked.includes(d));
  const k = labels.length;
  if (k > free.length || k > 7 - MIN_DAYS_WITHOUT_FORCE) return null;
  let best: { days: number[]; score: number } | null = null;
  for (const c of combos(free, k)) {
    let score = 7;
    let ok = true;
    for (let i = 0; i < k && ok; i++) {
      for (let j = i + 1; j < k; j++) {
        if (!conflicts(labels[i], labels[j])) continue;
        const g = circGap(c[i], c[j]);
        if (g < MIN_GAP_DAYS) {
          ok = false;
          break;
        }
        score = Math.min(score, g);
      }
    }
    if (!ok) continue;
    if (beginner && longestRun(c) > BEGINNER_MAX_CONSECUTIVE_FORCE) continue;
    if (!best || score > best.score) best = { days: c, score };
  }
  return best?.days ?? null;
}

/** STR-REP-6 / STR-REP-12 : jours légers parmi les jours libres restants ; jamais deux jours légers de suite si possible. */
export function chooseLightDays(blocked: number[], forceDays: number[], count: number): number[] {
  const free = [0, 1, 2, 3, 4, 5, 6].filter((d) => !blocked.includes(d) && !forceDays.includes(d));
  const k = Math.min(count, free.length);
  if (k <= 0) return [];
  const all = combos(free, k);
  return all.find((c) => longestRun(c) <= 1) ?? all[0];
}

export interface ScheduledSplit {
  labels: string[];
  days: number[];
  light: number;
  reason: SplitPlan['reason'];
  /** Moins de séances que voulu à cause des jours libres (V-MSG-JOURS). */
  reduced: boolean;
  wanted: number;
}
/** Répartition + calendrier, avec repli N -> N - 1 -> … -> 1 (STR-REP-8 ; à 1 séance, STR-REP-1 ; jamais « aucun programme », E-14). */
export function planWeek(n: number, blocked: number[], s: SplitInput): ScheduledSplit | null {
  const first = chooseSplit(n, s);
  const beginner = s.level === 'debutant';
  for (let k = first.labels.length; k >= 1; k--) {
    const plan = k === first.labels.length ? first : chooseSplit(k, s);
    const labels = plan.labels.slice(0, k);
    const days = scheduleDays(blocked, labels, beginner);
    if (days) return { labels, days, light: first.light, reason: first.reason, reduced: k < first.labels.length, wanted: first.labels.length };
  }
  return null;
}
