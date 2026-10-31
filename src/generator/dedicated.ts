// D31 : séances de cardio dédiées hors objectif cardio (knowledge/cardio-regles.md §3.2bis, §3.2ter A, B, C). Le générateur décide
// seul (aucune question « muscu ou cardio ») : objectif de rang 1, niveau, sports déclarés, jours, séances de jambes de la semaine.
// La musculation n'est jamais réduite ; la séance dédiée saute avant toute séance de force. Valeurs : config.ts (CARDIO_CAPS,
// CARDIO_OPTION, SPORT_FAMILIES, LOWER_LIMB_ZONES), toutes NON SOURCÉ sauf le repère OMS.
import type { Level } from '../data/model';
import { CARDIO, CARDIO_CAPS, CARDIO_OPTION, LOWER_LIMB_ZONES, SPORT_FAMILIES } from './config';
import type { Ctx } from './context';
import { D30_TEXT } from '../session/messages';
import type { CardioOptionState } from './types';

export type DedicatedKind = 'option' | 'sport' | 'sante';

/** 3.2ter C1 : type de séance dédiée selon l'objectif de rang 1 (cardio : règles 3.2 inchangées, hors de ce module). */
export function dedicatedKindOf(mainGoal: string | null): DedicatedKind | null {
  if (!mainGoal) return null;
  if (CARDIO_OPTION.goals.includes(mainGoal)) return 'option';
  if (mainGoal === 'sport') return 'sport';
  if (mainGoal === 'sante' || mainGoal === 'forme') return 'sante';
  return null;
}

/** 3.2bis : plafond de séances dédiées (grossesse / post-partum : 1 au plus, tout objectif). */
export function dedicatedCap(kind: DedicatedKind, level: Level, pregnant: boolean): number {
  const cap = CARDIO_CAPS[kind][level];
  return Math.min(CARDIO_CAPS.absoluteMax, pregnant ? Math.min(cap, CARDIO_CAPS.pregnancyMax) : cap);
}

/** Famille du sport déclaré pour le contenu de la séance de sport (3.2ter B) : sauts, endurance intermittente, ou aucun. */
export function sportFamily(sports: readonly string[]): 'sauts' | 'intermittent' | null {
  const k = sports.map((s) => s.toLowerCase());
  if (k.some((s) => SPORT_FAMILIES.sauts.includes(s))) return 'sauts';
  if (k.some((s) => SPORT_FAMILIES.intermittent.includes(s))) return 'intermittent';
  return null;
}

/** Durée de départ et plafond (min) : option (3.2ter A) ou 3.3 (sport, santé) ; grossesse : 20 min au plus ; jamais plus que D. */
export function dedicatedDuration(kind: DedicatedKind, level: Level, pregnant: boolean, dMin: number): { start: number; cap: number } {
  const start = kind === 'option' ? CARDIO_OPTION.startMin[level] : CARDIO.dedicatedStartMin[level];
  const max = kind === 'option' ? CARDIO_OPTION.maxMin[level] : CARDIO.dedicatedMaxMin[level];
  const cap = pregnant ? Math.min(CARDIO_CAPS.pregnancyMaxMin, start) : max;
  return { start: Math.min(start, cap, dMin), cap: Math.min(cap, dMin) };
}

export interface DedicatedInput {
  ctx: Ctx;
  mainGoal: string | null;
  /** N choisi par la personne. */
  want: number;
  /** Séances de force de la semaine et leurs jours. */
  forceDays: readonly number[];
  /** Jours « à jambes lourdes » (3.4 (k) ; ici par type de séance : corps entier, bas, jambes = lourdes, lecture prudente). */
  heavyDays: ReadonlySet<number>;
  /** Jours légers proposés (STR-REP-6, 11) ; ceux d'une zone (STR-REP-14) sont exclus par l'appelant. */
  lightDays: readonly number[];
  blocked: readonly number[];
  /** Réglage du profil : option acceptée (force / muscle / gras) ou séance de sport retirée (false). */
  setting: boolean | undefined;
  /** Jour préféré (séance avec sauts : jour où les sauts sont permis), départagé avant les autres critères sauf le lendemain de jambes. */
  prefer?: (d: number) => boolean;
}
export interface DedicatedPlan {
  kind: DedicatedKind | null;
  days: number[];
  /** Jours légers remplacés par une séance dédiée. */
  replacedLight: number[];
  /** Jours où la séance est « facile » (lendemain d'un jour de jambes lourdes, 3.2ter A). */
  easyDays: number[];
  option: CardioOptionState | null;
}

const combos = (items: number[], n: number): number[][] =>
  n === 0 ? [[]] : items.flatMap((x, i) => combos(items.slice(i + 1), n - 1).map((r) => [x, ...r]));

/**
 * Jours des séances dédiées (3.2ter A, B, C ; 3.2bis). Candidats : option et sport = jours disponibles non utilisés par la force (un jour
 * léger peut être remplacé) ; forme / santé = jours légers seulement (tableau « N - 2 » de 3.2bis : jamais un jour au-delà de N).
 * Au plus 6 jours d'entraînement (force + dédiées). Aucune séance si une zone de membre inférieur est au niveau 2 ou 3 (lecture prudente
 * de STR-REP-12). Départage déterministe : pas le lendemain d'un jour de jambes lourdes, puis jours légers d'abord (pas de jour de plus),
 * puis le plus grand écart avec les autres séances, puis l'ordre des jours.
 */
export function planDedicated(i: DedicatedInput): DedicatedPlan {
  const { ctx } = i;
  const kind = dedicatedKindOf(i.mainGoal);
  const none: DedicatedPlan = { kind, days: [], replacedLight: [], easyDays: [], option: null };
  if (!kind) return none;
  const legZone = ctx.zones.some((z) => !z.isG && z.level >= 2 && LOWER_LIMB_ZONES.includes(z.key));
  // STR-REP-11 (c) : en grossesse / post-partum, les jours légers restent « marche, mobilité douce, rien d'autre » : jamais remplacés
  // (lecture prudente ; forme / santé : aucune séance dédiée, 3.2bis « 1 au plus »).
  const candidates = (kind === 'sante' ? [...i.lightDays] : [0, 1, 2, 3, 4, 5, 6].filter((d) => !i.blocked.includes(d) && !i.forceDays.includes(d)))
    .filter((d) => !(ctx.pregnant && i.lightDays.includes(d)))
    .sort((a, b) => a - b);
  const room = Math.max(0, CARDIO_OPTION.maxTrainingDays - i.forceDays.length);
  const cap = Math.min(dedicatedCap(kind, ctx.level, ctx.pregnant), room, candidates.length);
  let disabledReason: string | null = null;
  if (kind === 'option' && i.want < CARDIO_OPTION.minForceDays) disabledReason = D30_TEXT.optionFewDays;
  else if (legZone) disabledReason = D30_TEXT.optionLegZone;
  else if (cap <= 0) disabledReason = D30_TEXT.optionNoDay;
  // D33 n° 5 (PV3-CAR-1) : perte de gras en rang 1 : séance incluse par défaut (absent = oui ; false = retirée par la personne).
  const defaultOn = kind === 'sport' || (kind === 'option' && !!i.mainGoal && CARDIO_OPTION.defaultOnGoals.includes(i.mainGoal));
  const accepted = kind === 'sante' ? true : defaultOn ? i.setting !== false : i.setting === true;
  const option: CardioOptionState | null = kind === 'sante' ? null : { kind, offered: true, accepted, disabledReason };
  if (disabledReason || !accepted) return { ...none, option };
  const prev = (d: number) => (d + 6) % 7;
  let best: { days: number[]; key: number[] } | null = null;
  // PV3-CAR-2 / 3.2bis : deux dédiées jamais consécutives (semaine circulaire) ; sinon une de moins (jamais forcée).
  const spaced = (c: number[]) => c.every((d, k) => c.every((e, j) => j === k || Math.min(Math.abs(d - e), 7 - Math.abs(d - e)) > 1));
  for (let n = cap; n > 0 && !best; n--) for (const c of combos(candidates, n)) {
    if (!spaced(c)) continue;
    const all = [...c, ...i.forceDays].sort((a, b) => a - b);
    const gaps = all.slice(1).map((d, k) => d - all[k]);
    if (all.length > 1) gaps.push(7 + all[0] - all[all.length - 1]);
    const key = [c.filter((d) => i.heavyDays.has(prev(d))).length, i.prefer && !c.some(i.prefer) ? 1 : 0, -c.filter((d) => i.lightDays.includes(d)).length, -(gaps.length ? Math.min(...gaps) : 7), ...c];
    const k = best ? key.findIndex((v, j) => v !== best!.key[j]) : -1;
    if (!best || (k >= 0 && key[k] < best.key[k])) best = { days: c, key };
  }
  const days = best?.days ?? [];
  return {
    kind, days, replacedLight: days.filter((d) => i.lightDays.includes(d)), easyDays: days.filter((d) => i.heavyDays.has(prev(d))), option,
  };
}
