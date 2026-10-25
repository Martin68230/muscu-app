// Historique, calendrier et régularité (F7). Fonctions PURES sur les séances et séries déjà lues dans IndexedDB.
// Tout est calculé sur l'heure LOCALE de l'appareil (jour civil, semaine du lundi au dimanche) ; aucune arithmétique en millisecondes
// sur les jours, donc aucun bogue au changement d'heure. Ton neutre : aucun reproche, aucune comparaison entre personnes.
import type { SetLog, WorkoutSession } from '../data/model';
import { isWorkSet } from './progression';

/** Marque d'un jour : toujours affichée avec un texte et une forme, jamais par la couleur seule. */
export type DayMark = 'faite' | 'douleur' | 'reportee' | 'arretee' | 'symptome';

export const MARK_TEXT: Record<DayMark, string> = {
  faite: 'Faite',
  douleur: 'Faite, avec une douleur',
  reportee: 'Reportée',
  arretee: 'Arrêtée',
  symptome: 'Arrêtée, symptôme',
};
export const MARK_GLYPH: Record<DayMark, string> = { faite: '✓', douleur: '◆', reportee: '↷', arretee: '–', symptome: '◆' };
/** Priorité quand plusieurs séances tombent le même jour : la sécurité d'abord. */
const MARK_PRIORITY: DayMark[] = ['symptome', 'douleur', 'faite', 'arretee', 'reportee'];

export interface HistoryEntry {
  id: string;
  /** Jour civil local, AAAA-MM-JJ. */
  dateKey: string;
  atMs: number;
  /** Nom du jour de programme suivi. */
  label: string;
  /** Durée en minutes (séance faite seulement). */
  durationMin: number | null;
  /** Séries de travail faites (séance faite seulement ; 0 sinon). */
  setsDone: number;
  mark: DayMark;
}

const pad = (n: number): string => String(n).padStart(2, '0');
export const dateKey = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const monthKeyOf = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
export function parseKey(k: string): Date {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
}
/** Écart en jours civils (insensible au changement d'heure). */
export function dayDiff(fromKey: string, toKey: string): number {
  const [a, b] = [fromKey, toKey].map((k) => {
    const [y, m, d] = k.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  });
  return Math.round((b - a) / 86_400_000);
}
/** Lundi de la semaine du jour donné (clé AAAA-MM-JJ). */
export function mondayKey(d: Date): string {
  return dateKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7)));
}
const previousMonday = (key: string): string => {
  const d = parseKey(key);
  return dateKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7));
};

/** Date de la séance, en heure locale : le début réel, sinon le jour prévu (déjà un jour civil), sinon la création. */
export function sessionDate(s: WorkoutSession): Date {
  const started = s.startedAt ? new Date(s.startedAt) : null;
  if (started && Number.isFinite(started.getTime())) return started;
  if (/^\d{4}-\d{2}-\d{2}/.test(s.plannedDate ?? '')) return parseKey(s.plannedDate.slice(0, 10));
  return new Date(s.createdAt);
}

function minutesOf(s: WorkoutSession): number | null {
  const a = s.startedAt ? Date.parse(s.startedAt) : NaN;
  const b = s.endedAt ? Date.parse(s.endedAt) : NaN;
  if (!Number.isFinite(a) || !Number.isFinite(b) || b < a) return null;
  const min = Math.max(1, Math.round((b - a) / 60000));
  return min <= 360 ? min : null; // au-delà : séance reprise, durée non fiable
}

/** Séances terminées, arrêtées ou reportées, de la plus récente à la plus ancienne. Les séances prévues ou en cours n'y figurent pas. */
export function buildEntries(sessions: readonly WorkoutSession[], sets: readonly SetLog[]): HistoryEntry[] {
  const bySession = new Map<string, SetLog[]>();
  for (const s of sets) if (isWorkSet(s)) bySession.set(s.sessionId, [...(bySession.get(s.sessionId) ?? []), s]);
  const out: HistoryEntry[] = [];
  for (const s of sessions) {
    if (s.deletedAt || (s.status !== 'faite' && s.status !== 'sautee' && s.status !== 'reportee')) continue;
    const mine = bySession.get(s.id) ?? [];
    let mark: DayMark;
    if (s.status === 'reportee') mark = 'reportee';
    else if (s.endReason === 'symptome') mark = 'symptome';
    else if (s.status === 'sautee' || s.endReason === 'abandon' || mine.length === 0) mark = 'arretee';
    else mark = mine.some((x) => x.pain) ? 'douleur' : 'faite';
    const d = sessionDate(s);
    const counted = mark === 'faite' || mark === 'douleur';
    out.push({
      id: s.id,
      dateKey: dateKey(d),
      atMs: d.getTime(),
      label: s.plan?.label || 'Séance',
      durationMin: counted ? minutesOf(s) : null,
      setsDone: counted ? mine.length : 0,
      mark,
    });
  }
  return out.sort((a, b) => b.atMs - a.atMs);
}

export const isDone = (e: HistoryEntry): boolean => e.mark === 'faite' || e.mark === 'douleur';

/** Séances d'un mois (month : 0 à 11). */
export function entriesOfMonth(entries: readonly HistoryEntry[], year: number, month: number): HistoryEntry[] {
  const k = `${year}-${pad(month + 1)}`;
  return entries.filter((e) => e.dateKey.startsWith(k));
}
/** Regroupement par mois (clé AAAA-MM), mois les plus récents d'abord. */
export function groupByMonth(entries: readonly HistoryEntry[]): { month: string; entries: HistoryEntry[] }[] {
  const map = new Map<string, HistoryEntry[]>();
  for (const e of entries) map.set(e.dateKey.slice(0, 7), [...(map.get(e.dateKey.slice(0, 7)) ?? []), e]);
  return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1)).map(([month, list]) => ({ month, entries: list }));
}

/** Marque d'un jour (une seule, selon la priorité) ; null si aucune séance. */
export function dayMark(entries: readonly HistoryEntry[], key: string): DayMark | null {
  const marks = entries.filter((e) => e.dateKey === key).map((e) => e.mark);
  return MARK_PRIORITY.find((m) => marks.includes(m)) ?? null;
}

export interface MonthSummary {
  /** Jours avec au moins une séance faite : deux séances le même jour comptent une fois. */
  done: number;
  /** Séances prévues sur la période écoulée du mois, ou null si inconnu (jamais de pourcentage dans ce cas). */
  planned: number | null;
}

/**
 * « X séances faites sur Y prévues ». Y = jours par semaine du profil x jours écoulés / 7, depuis le début de l'usage (création du profil)
 * jusqu'à aujourd'hui au plus ; null avant le début, dans le futur ou sans nombre de jours. Règle de calcul NON SOURCÉ (conception).
 */
export function monthSummary(entries: readonly HistoryEntry[], year: number, month: number, o: { daysPerWeek: number | null; startKey: string | null; today: Date }): MonthSummary {
  const days = new Set(entriesOfMonth(entries, year, month).filter(isDone).map((e) => e.dateKey));
  const first = dateKey(new Date(year, month, 1));
  const last = dateKey(new Date(year, month + 1, 0));
  const todayKey = dateKey(o.today);
  let planned: number | null = null;
  if (o.daysPerWeek && o.startKey) {
    const from = Math.max(dayDiff(first, o.startKey), 0);
    const toKey = last < todayKey ? last : todayKey;
    const span = dayDiff(first, toKey) + 1 - from;
    if (span > 0) {
      const p = Math.round((o.daysPerWeek * span) / 7);
      planned = p > 0 ? p : null;
    }
  }
  return { done: days.size, planned };
}

export interface Regularity {
  hasAny: boolean;
  /** Jours avec une séance faite cette semaine (lundi au dimanche). */
  doneThisWeek: number;
  /** Séances prévues par semaine (profil), ou null. */
  plannedPerWeek: number | null;
  /** Semaines de suite avec au moins une séance ; la semaine en cours compte si elle a déjà une séance, sinon on part de la précédente. */
  streakWeeks: number;
  /** Jour de la dernière séance faite. */
  lastKey: string | null;
}

export function regularity(entries: readonly HistoryEntry[], today: Date, daysPerWeek: number | null): Regularity {
  const done = entries.filter(isDone);
  const days = new Set(done.map((e) => e.dateKey));
  const weeks = new Set([...days].map((k) => mondayKey(parseKey(k))));
  const thisWeek = mondayKey(today);
  const doneThisWeek = [...days].filter((k) => mondayKey(parseKey(k)) === thisWeek && k <= dateKey(today)).length;
  let cursor = weeks.has(thisWeek) ? thisWeek : previousMonday(thisWeek);
  let streak = 0;
  while (weeks.has(cursor)) {
    streak++;
    cursor = previousMonday(cursor);
  }
  const lastKey = [...days].sort().pop() ?? null;
  return { hasAny: done.length > 0, doneThisWeek, plannedPerWeek: daysPerWeek && daysPerWeek > 0 ? daysPerWeek : null, streakWeeks: streak, lastKey };
}

/** « aujourd'hui », « hier », « il y a 3 jours », « il y a 2 semaines »… */
export function relativeDay(key: string, today: Date): string {
  const n = dayDiff(key, dateKey(today));
  if (n <= 0) return 'aujourd’hui';
  if (n === 1) return 'hier';
  if (n < 14) return `il y a ${n} jours`;
  if (n < 60) return `il y a ${Math.floor(n / 7)} semaines`;
  return `il y a ${Math.floor(n / 30)} mois`;
}

export const frDate = (key: string): string => parseKey(key).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
export const frMonth = (year: number, month: number): string => new Date(year, month, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
