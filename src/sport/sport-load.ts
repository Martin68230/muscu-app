// Tableau de charge du sport (knowledge/saisie-sport-v1.md §2, corrigé par §7 « Avis kine du 13/11/2026 »).
// Fonctions PURES : l'heure vient de `now`, aucun accès à la base ni au réseau. Principe : la charge ne fait que REFUSER, ALLÉGER ou DÉCALER ;
// elle ne relève jamais un départ de contacts, une dose ou un plafond. Info manquante ou ambiguë : la valeur la plus lourde s'applique.
import type { InjuryZone, Level, SportEffort, SportPlanEntry, SportSession } from '../data/model';
import { SPORT } from './sport-config';

const H_MS = 3600 * 1000;
const DAY_MS = 24 * H_MS;

/** Minuit local du jour de `ms` (le jour civil de l'appareil, jamais une arithmétique en 24 h). */
export const startOfDayMs = (ms: number): number => {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
};
/** Minuit local, `n` jours civils après celui de `ms`. */
export const addDaysMs = (ms: number, n: number): number => {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n).getTime();
};
/** 0 = lundi ... 6 = dimanche. */
export const weekdayOf = (ms: number): number => (new Date(ms).getDay() + 6) % 7;
const RANK: Record<SportEffort, number> = { facile: 1, soutenue: 2, tres_dur: 3 };

/** Ce que le calcul lit d'une séance notée ou supposée (jour habituel). */
export type SportInput = Pick<SportSession, 'sport' | 'durationMin' | 'effort' | 'feelings'> & { match?: boolean; jumps?: boolean; overhead?: boolean };

export interface SportEvent {
  source: 'noted' | 'habitual';
  sport: SportInput['sport'];
  /** Fin de la séance (début + durée) ; fin de journée pour un jour habituel non noté (heure inconnue). */
  endMs: number;
  /** Minuit local du jour de la séance. */
  dayMs: number;
  effort: SportEffort;
  durationMin: number;
  match: boolean;
  /** `heavy` = jambes lourdes ; `half` = 0,5 (pas de saut le jour même ni dans les 24 h) ; `none` n'existe pas (tout sport charge les jambes un peu). */
  legs: 'half' | 'heavy';
  /** Match, « très dur » ou 90 min et plus : jambes légères de 24 à 72 h pour tous les niveaux. */
  severe: boolean;
  /** Contacts au sol estimés (x2 / x3 / x4 par minute, 400 au plus), 0 sans sauts. */
  contacts: number;
  /** Séance avec sauts « soutenue » ou plus : compte comme une séance de sauts. */
  jumpSession: boolean;
  shoulder: boolean;
  /** Aucun bloc d'épaule (épaule fatiguée, ou « très dur ») ; sinon une rotation externe très légère est permise. */
  shoulderNone: boolean;
  /** Fin du blocage de l'épaule (minuit local suivant le dernier jour concerné). */
  shoulderUntilMs: number;
}

export interface SportConsult {
  reason: 'deux_seances' | 'une_semaine' | 'signes';
  /** Zones connues à retirer du générateur. */
  zones: InjuryZone[];
  /** Une des séances n'a pas de zone : message seulement. */
  unknownZone: boolean;
}

export interface SportLoad {
  nowMs: number;
  events: SportEvent[];
  /** Renvoi vers un professionnel (gêne répétée, depuis plus d'une semaine, ou avec un signe d'alerte), sinon null. */
  consult: SportConsult | null;
  /** Gêne notée dans les 2 derniers jours : niveau 1 temporaire pour le générateur (le profil blessures n'est pas modifié). */
  tempPainZones: InjuryZone[];
  /** Gêne notée sans zone (« je ne sais pas ») dans les 2 derniers jours : valeur la plus lourde (pas de sauts, pas de progression). */
  unknownPainRecent: boolean;
  /** Malaise ou vertige noté aujourd'hui : journée sans autre charge programmée. */
  malaiseToday: boolean;
  /** Au moins une séance notée, et la dernière date de plus de 14 jours : reprise (sauts au départ du niveau). */
  pauseOver14: boolean;
  hasNoted: boolean;
  /** Jours avant le prochain jour de match déclaré (0 = aujourd'hui), null = aucun. */
  matchInDays: number | null;
}

/** Charge d'une séance (notée ou supposée). */
export function eventOf(s: SportInput, endMs: number, dayMs: number, source: SportEvent['source']): SportEvent {
  const effort: SportEffort = RANK[s.effort] ? s.effort : 'soutenue'; // doute = « soutenue »
  const dur = Number.isFinite(s.durationMin) && s.durationMin > 0 ? s.durationMin : SPORT.habitual.durationMin;
  const match = !!s.match;
  const feelings = s.feelings ?? [];
  const heavy = effort !== 'facile' || dur >= SPORT.legs.heavyFromMin || feelings.includes('jambes_lourdes') || match;
  const hasJumps = SPORT.jumpFamilies.includes(s.sport) || (SPORT.jumpOptional.includes(s.sport) && !!s.jumps);
  const contacts = hasJumps ? Math.min(SPORT.contacts.cap, Math.round(dur * SPORT.contacts.perMin[effort])) : 0;
  const tiredShoulder = feelings.includes('epaule_fatiguee');
  const shoulderFamily = SPORT.shoulderFamilies.includes(s.sport) || (s.sport === 'autre' && !!s.overhead);
  const shoulder = tiredShoulder || (shoulderFamily && (effort !== 'facile' || dur >= SPORT.shoulder.fromMin));
  const veryHard = effort === 'tres_dur';
  return {
    source, sport: s.sport, endMs, dayMs, effort, durationMin: dur, match, legs: heavy ? 'heavy' : 'half',
    severe: match || veryHard || dur >= SPORT.legs.severeFromMin,
    contacts, jumpSession: hasJumps && effort !== 'facile', shoulder,
    shoulderNone: tiredShoulder || (shoulder && veryHard),
    shoulderUntilMs: addDaysMs(dayMs, 1 + (veryHard ? SPORT.shoulder.daysVeryHard : SPORT.shoulder.days)),
  };
}

const sameDay = (a: number, b: number): boolean => startOfDayMs(a) === startOfDayMs(b);

/**
 * Charge du sport : séances notées (date plafonnée à maintenant : une séance « dans le futur » compte comme faite maintenant) et jours
 * habituels non notés. Un jour habituel est remplacé par une séance notée du même sport et du même jour SEULEMENT si elle est au moins
 * aussi chargée (sinon on garde les deux : la plus forte s'applique).
 */
export function sportLoad(sessions: readonly SportSession[], plan: readonly SportPlanEntry[] | undefined, now: Date): SportLoad {
  const nowMs = now.getTime();
  const live = sessions.filter((s) => !s.deletedAt);
  const noted = live
    .map((s) => ({ s, t: Math.min(Date.parse(s.startedAt), nowMs) }))
    .filter((x) => Number.isFinite(x.t))
    .sort((a, b) => a.t - b.t);
  const events: SportEvent[] = noted.map(({ s, t }) => eventOf(s, t + Math.max(0, s.durationMin || 0) * 60_000, startOfDayMs(t), 'noted'));

  const entries = plan ?? [];
  const today = startOfDayMs(nowMs);
  for (const e of entries) {
    for (let back = 3; back >= 0; back--) {
      const dayMs = addDaysMs(today, -back);
      const wd = weekdayOf(dayMs);
      const isMatch = e.matchWeekday === wd;
      if (!isMatch && !(e.weekdays ?? []).includes(wd)) continue;
      const assumed = eventOf(
        { sport: e.sport, durationMin: SPORT.habitual.durationMin, effort: isMatch || e.habitualEffort === 'tres_dur' ? 'tres_dur' : SPORT.habitual.effort, feelings: [], match: isMatch, jumps: e.jumps, overhead: e.overhead },
        addDaysMs(dayMs, 1) - 1, dayMs, 'habitual',
      );
      const covered = events.some((n) => n.source === 'noted' && n.sport === e.sport && sameDay(n.dayMs, dayMs)
        && RANK[n.effort] >= RANK[assumed.effort] && n.durationMin >= assumed.durationMin);
      if (!covered) events.push(assumed);
    }
  }

  // ----- Gêne, renvoi vers un professionnel -----
  const gene = noted.filter(({ s }) => s.feelings.includes('gene_douleur'));
  let consult: SportConsult | null = null;
  const latest = gene[gene.length - 1];
  if (latest && nowMs - latest.t <= SPORT.pain.removeDays * DAY_MS) {
    const zonesOf = (xs: typeof gene): { zones: InjuryZone[]; unknownZone: boolean } => ({
      zones: [...new Set(xs.map((x) => x.s.painZone).filter((z): z is InjuryZone => !!z))],
      unknownZone: xs.some((x) => !x.s.painZone),
    });
    const last2 = noted.slice(-SPORT.pain.consecutive);
    const withSigns = gene.filter((x) => nowMs - x.t <= SPORT.pain.removeDays * DAY_MS && (x.s.signs?.length ?? 0) > 0);
    const spanPair = gene.filter((x) => nowMs - x.t <= 28 * DAY_MS).filter((a, i, arr) => arr.some((b, j) => j !== i && (b.s.painZone ?? null) === (a.s.painZone ?? null) && Math.abs(b.t - a.t) >= SPORT.pain.daysSpan * DAY_MS));
    if (withSigns.length) consult = { reason: 'signes', ...zonesOf(withSigns) };
    else if (last2.length === SPORT.pain.consecutive && last2.every((x) => x.s.feelings.includes('gene_douleur'))) consult = { reason: 'deux_seances', ...zonesOf(last2) };
    else if (spanPair.length) consult = { reason: 'une_semaine', ...zonesOf(spanPair) };
  }
  const tempPainZones = [...new Set(gene.filter((x) => startOfDayMs(x.t) >= addDaysMs(today, -SPORT.pain.tempLevel1Days)).map((x) => x.s.painZone).filter((z): z is InjuryZone => !!z))];

  const unknownPainRecent = gene.some((x) => !x.s.painZone && startOfDayMs(x.t) >= addDaysMs(today, -SPORT.pain.tempLevel1Days));
  const malaiseToday = noted.some(({ s, t }) => s.feelings.includes('malaise_vertige') && sameDay(t, nowMs));
  const lastNoted = noted.length ? noted[noted.length - 1].t : null;
  const days = entries.map((e) => (e.matchWeekday == null ? null : (e.matchWeekday - weekdayOf(nowMs) + 7) % 7)).filter((d): d is number => d !== null);
  return {
    nowMs, events, consult, tempPainZones, unknownPainRecent, malaiseToday,
    pauseOver14: lastNoted !== null && nowMs - lastNoted > SPORT.pauseDays * DAY_MS,
    hasNoted: noted.length > 0,
    matchInDays: days.length ? Math.min(...days) : null,
  };
}

// ----- Portes : ce que la charge impose à une séance créée (D28) ou à un cardio -----
export type LegsGate = 'ok' | 'warn' | 'soften' | 'refuse';
const LEGS_ORDER: LegsGate[] = ['ok', 'warn', 'soften', 'refuse'];
export const worseLegs = (a: LegsGate, b: LegsGate): LegsGate => (LEGS_ORDER.indexOf(a) >= LEGS_ORDER.indexOf(b) ? a : b);

export interface SportGate {
  legs: LegsGate;
  matchTomorrow: boolean;
  /** Code d'un verrou des sauts (aucun saut programmé), sinon null. */
  jumpLock: 'sport-sauts-48h' | 'sport-contacts' | 'sport-jambes-24h' | 'sport-match' | null;
  /** Avertissement 48 à 72 h (sauts du sport). */
  jumpWarn: boolean;
  contacts72: number;
  /** Épaule : `free` rien à signaler, `light` une rotation externe très légère seulement, `none` aucun bloc d'épaule. */
  shoulder: 'free' | 'light' | 'none';
  /** Aucune poussée verticale, dips, élévation chargée, lancer ni pliométrie du haut du corps. */
  noUpperPush: boolean;
  dayLocked: boolean;
  /** Gêne récente sans zone connue : aucun saut, aucune progression pendant 2 jours. */
  unknownPain: boolean;
  consult: SportConsult | null;
}

/** `startContacts` = départ de contacts du niveau (JUMPS.startContacts) : le total des 72 h le dépasse-t-il ? */
export function sportGate(load: SportLoad, level: Level, startContacts: number): SportGate {
  const hours = (e: SportEvent): number => (load.nowMs - e.endMs) / H_MS;
  let legs: LegsGate = 'ok';
  for (const e of load.events) {
    const h = hours(e);
    if (e.legs !== 'heavy' || h >= SPORT.spacing.warnH) continue;
    if (h < SPORT.spacing.refuseH) legs = worseLegs(legs, 'refuse');
    else if (e.severe || h < SPORT.spacing.softenH) legs = worseLegs(legs, 'soften');
    else legs = worseLegs(legs, level === 'avance' ? 'warn' : 'soften');
  }
  const matchTomorrow = load.matchInDays !== null && load.matchInDays <= SPORT.match.lightLegsDays && load.matchInDays > 0;
  if (matchTomorrow) legs = worseLegs(legs, 'soften');

  const withContacts = load.events.filter((e) => e.contacts > 0 && hours(e) < SPORT.contacts.windowH);
  const contacts72 = withContacts.reduce((a, e) => a + e.contacts, 0);
  let jumpLock: SportGate['jumpLock'] = null;
  let jumpWarn = false;
  if (load.events.some((e) => e.jumpSession && hours(e) < SPORT.contacts.noJumpH)) jumpLock = 'sport-sauts-48h';
  else if (contacts72 > startContacts && withContacts.some((e) => hours(e) < SPORT.contacts.noJumpH)) jumpLock = 'sport-contacts';
  else if (load.events.some((e) => hours(e) < SPORT.legs.halfNoJumpHours)) jumpLock = 'sport-jambes-24h';
  else if (load.matchInDays !== null && load.matchInDays <= SPORT.match.noJumpsDays) jumpLock = 'sport-match';
  if (!jumpLock && (contacts72 > startContacts || load.events.some((e) => e.jumpSession && hours(e) < SPORT.contacts.windowH))) jumpWarn = true;

  const sh = load.events.filter((e) => e.shoulder && e.dayMs <= startOfDayMs(load.nowMs) && load.nowMs < e.shoulderUntilMs);
  const shoulder: SportGate['shoulder'] = sh.some((e) => e.shoulderNone) ? 'none' : sh.length ? 'light' : 'free';
  return { legs, matchTomorrow, jumpLock, jumpWarn, contacts72, shoulder, noUpperPush: sh.length > 0, dayLocked: load.malaiseToday, unknownPain: load.unknownPainRecent, consult: load.consult };
}

/** Cardio dédié (étape suivante, générateur de programmes) : pas le même jour qu'un sport « soutenue » ou plus, ni dans les 24 h après un « très dur ». */
export function cardioBlocked(load: SportLoad): boolean {
  return load.events.some((e) => {
    const sameDayLoad = e.effort !== 'facile' && e.dayMs === startOfDayMs(load.nowMs);
    const afterVeryHard = e.effort === 'tres_dur' && load.nowMs - e.endMs >= 0 && load.nowMs - e.endMs < SPORT.cardio.afterVeryHardH * H_MS;
    return sameDayLoad || afterVeryHard;
  });
}
