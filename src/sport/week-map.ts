// « Mon sport », étape 2, S2-A (knowledge/saisie-sport-v1.md §8.1, §8.2, §8.5 et « Avis kine du 13/11/2026 ») : carte de la semaine type.
// Fonction PURE tirée de `sportPlan` (jours habituels et jour de match, pas de séance notée) : pour chaque jour, ce que la charge du sport
// permet à une séance de force. Elle ne fait que REFUSER, ALLÉGER ou DÉCALER ; elle ne relève jamais une dose, un départ ou un plafond.
// Un jour habituel déclaré compte comme « soutenue » 60 min (jour de match : « très dur »), fin de journée ; seul « très dur » peut être déclaré
// plus lourd (`habitualEffort`), jamais « facile » (refusé par le kine).
import type { Level, SportPlanEntry } from '../data/model';
import { addDaysMs, cardioBlocked, sportGate, sportLoad, weekdayOf, type LegsGate } from './sport-load';
import { SPORT } from './sport-config';

export interface DayLoad {
  /** 0 = lundi ... 6 = dimanche. */
  weekday: number;
  /** Jambes : `ok` / `warn` (pleine dose permise, avancé seul pour `warn`) / `soften` (jambes légères) / `refuse`. */
  legs: LegsGate;
  /** Aucune force du tout ce jour (jour de match). */
  noForce: boolean;
  /** Épaule : `free`, `light` (rotation externe très légère seulement) ou `none`. */
  shoulder: 'free' | 'light' | 'none';
  /** Aucune poussée verticale, dips, élévation chargée ni lancer ce jour (jour de sport d'épaule, lendemain, veille de match). */
  noUpperPush: boolean;
  /** Aucun saut ce jour (48 h avant et 2 jours après un match, charge de contacts, sport de la veille). */
  jumpLock: boolean;
  /** Pas de cardio dédié ce jour (sport « soutenue » ou plus le jour même, ou dans les 24 h après un « très dur »). */
  cardioBlocked: boolean;
  /** Aucun nordique 48 h avant et 48 h après un match. */
  nordiqueLock: boolean;
  matchDay: boolean;
  dayAfterMatch: boolean;
  eveOfMatch: boolean;
  /** Jour de sport habituel (ou de match). */
  sportDay: boolean;
}

/** Jour d'ancrage : un lundi fixe (la carte ne dépend que des jours de la semaine). */
const ANCHOR_MONDAY = new Date(2026, 0, 5, 12, 0, 0).getTime();

/** Le plan lu pour la carte : « très dur » habituel déclaré (plus restrictif) ; jamais « facile ». */
export function planForMap(plan: readonly SportPlanEntry[]): SportPlanEntry[] {
  return plan.slice(0, SPORT.maxSports).map((e) => ({ ...e }));
}

/**
 * Carte des 7 jours (lundi à dimanche). `plan` vide ou absent : tous les jours libres. Plusieurs sports : le pire de chaque jour.
 * `startContacts` = départ de contacts du niveau (JUMPS.startContacts).
 */
export function weekLoadMap(plan: readonly SportPlanEntry[] | undefined, level: Level, startContacts: number): DayLoad[] {
  const entries = planForMap(plan ?? []);
  const matchDays = new Set(entries.map((e) => e.matchWeekday).filter((d): d is number => d !== null && d !== undefined));
  const sportDays = new Set<number>([...matchDays, ...entries.flatMap((e) => e.weekdays ?? [])]);
  return Array.from({ length: 7 }, (_, weekday) => {
    const now = new Date(addDaysMs(ANCHOR_MONDAY, weekday) + 12 * 3600 * 1000);
    const matchDay = matchDays.has(weekday);
    const dayAfterMatch = matchDays.has((weekday + 6) % 7);
    const eveOfMatch = matchDays.has((weekday + 1) % 7);
    if (!entries.length) {
      return { weekday, legs: 'ok', noForce: false, shoulder: 'free', noUpperPush: false, jumpLock: false, cardioBlocked: false, nordiqueLock: false, matchDay: false, dayAfterMatch: false, eveOfMatch: false, sportDay: false };
    }
    const load = sportLoad([], entries, now);
    const gate = sportGate(load, level, startContacts);
    // Veille de match : jambes légères pour intermédiaire et avancé seulement ; le débutant n'a aucune jambe (avis kine 13/11/2026).
    let legs: LegsGate = gate.legs;
    if (eveOfMatch && level === 'debutant') legs = 'refuse';
    // Lendemain d'un match : aucune force de jambes (`refuse`).
    if (dayAfterMatch) legs = 'refuse';
    // Jour de match : aucune force, jambes comprises.
    if (matchDay) legs = 'refuse';
    // 4 jours de sport habituels ou plus : AUCUNE force des jambes, tous niveaux (avancé compris, pas de pleine dose à D + 3) ; avis kine 13/11/2026.
    if (sportDays.size >= 4 && (legs === 'ok' || legs === 'warn')) legs = 'soften';
    const matchWindow = [0, 1, 2].some((k) => matchDays.has((weekday + 7 - k) % 7)) || [1, 2].some((k) => matchDays.has((weekday + k) % 7));
    return {
      weekday, legs, noForce: matchDay,
      shoulder: gate.shoulder, noUpperPush: gate.noUpperPush || (eveOfMatch && entries.some((e) => SPORT.shoulderFamilies.includes(e.sport) && e.matchWeekday === (weekday + 1) % 7)),
      jumpLock: gate.jumpLock !== null || matchWindow, cardioBlocked: cardioBlocked(load) || matchDay,
      nordiqueLock: matchWindow, matchDay, dayAfterMatch, eveOfMatch, sportDay: sportDays.has(weekday),
    };
  });
}

/** Jours de la semaine où une séance de force des jambes (pleine dose) est possible. */
export const legDays = (map: readonly DayLoad[]): number[] => map.filter((d) => !d.noForce && (d.legs === 'ok' || d.legs === 'warn')).map((d) => d.weekday);
export { weekdayOf };
