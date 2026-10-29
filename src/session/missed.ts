// Séance manquée, reportée, sautée et reprise douce : fonctions PURES (knowledge/seance-manquee-v1.md, révision 3).
// Jours civils LOCAUX (clés AAAA-MM-JJ, `dayDiff` de calendar.ts) : aucun effet du changement d'heure sur les seuils en jours.
// Les 48 h « réelles » (K4) sont, elles, comptées en millisecondes sur l'heure réelle.
// Toutes les valeurs chiffrées viennent de missed-config.ts ; tous les textes de missed-texts.ts.
import type { Injury, MissedAnswer, NewRow, PlannedExercise, Profile, Program, ProgramDay, RepriseState, SetLog, WorkoutSession } from '../data/model';
import { isCardioDay } from '../generator';
import { buildEntries, dateKey, dayDiff, mondayKey, parseKey, plannedDates, plannedMark, sessionDate } from './calendar';
import { nextSession } from './program';
import { MISSED, tierOf } from './missed-config';
import { TIME } from '../generator/config';
import { MISSED_TEXT, repriseText } from './missed-texts';

const HOUR_MS = 3600 * 1000;

export const addDays = (key: string, n: number): string => {
  const d = parseKey(key);
  return dateKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() + n));
};
const weekdayOf = (key: string): number => (parseKey(key).getDay() + 6) % 7;
const maxKey = (a: string, b: string): string => (a > b ? a : b);
const minKey = (a: string, b: string): string => (a < b ? a : b);
const live = (sessions: readonly WorkoutSession[]): WorkoutSession[] => sessions.filter((s) => !s.deletedAt);
const keyOf = (s: WorkoutSession): string => dateKey(sessionDate(s));

/** Début du programme (jour civil). */
export function programStartKey(p: Pick<Program, 'startDate' | 'createdAt'>): string {
  return /^\d{4}-\d{2}-\d{2}/.test(p.startDate ?? '') ? p.startDate.slice(0, 10) : dateKey(new Date(p.createdAt));
}
export const programWeekdays = (p: Pick<Program, 'days'>): number[] =>
  p.days.map((d) => d.weekday).filter((w): w is number => typeof w === 'number');
const dayForWeekday = (p: Pick<Program, 'days'>, wd: number): ProgramDay | undefined => p.days.find((d) => d.weekday === wd);

/** SM-D5 : une séance de musculation = jour de programme (plan, sinon programme) qui n'est pas un cardio dédié ; inconnu = musculation (prudent). */
export function isMuscuSession(s: WorkoutSession, programs: readonly Pick<Program, 'id' | 'days'>[] = []): boolean {
  const d = s.plan ?? (s.programDayIndex !== null ? programs.find((p) => p.id === s.programId)?.days[s.programDayIndex] : undefined);
  return !d || !isCardioDay(d);
}

// ---------------------------------------------------------------------------------------------
// SM-2 : date de référence R et jours manqués
// ---------------------------------------------------------------------------------------------
/** R = jour de la ligne la plus récente du programme actif (`faite`, `sautee` toute raison, `reportee`) ; sinon début du programme - 1 jour. */
export function referenceKey(program: Program, sessions: readonly WorkoutSession[]): string {
  const keys = live(sessions)
    .filter((s) => s.programId === program.id && (s.status === 'faite' || s.status === 'sautee' || s.status === 'reportee'))
    .map(keyOf)
    .sort();
  return keys[keys.length - 1] ?? addDays(programStartKey(program), -1);
}

/** Jours décalés en attente (lignes N `prevue`, SM-D2) du programme : affichés « Prévue », puis « Non faite » s'ils passent. */
export function shiftedDays(program: Pick<Program, 'id'>, sessions: readonly WorkoutSession[]): Set<string> {
  return new Set(live(sessions).filter((s) => s.programId === program.id && s.status === 'prevue' && s.dejaDecalee).map((s) => s.plannedDate.slice(0, 10)));
}

/** Jours manqués : jours planifiés D avec R < D <= hier, sans aucune ligne ce jour-là, et « Non faite » (règle de couverture conservée). */
export function missedDays(program: Program, sessions: readonly WorkoutSession[], sets: readonly SetLog[], todayKey: string): string[] {
  const wds = programWeekdays(program);
  const startK = programStartKey(program);
  const yesterday = addDays(todayKey, -1);
  const from = maxKey(addDays(referenceKey(program, sessions), 1), startK);
  if (dayDiff(from, yesterday) < 0) return [];
  const planned = new Set(plannedDates(wds, startK, addDays(todayKey, 7)));
  const entries = buildEntries(sessions, sets);
  const lineDays = new Set(live(sessions).map(keyOf));
  return plannedDates(wds, from, yesterday).filter((d) => !lineDays.has(d) && plannedMark(d, planned, entries, todayKey) === 'non_faite');
}

/** Premier jour planifié (jour de la semaine du programme) strictement après `key`. */
export function nextPlannedAfter(program: Program, key: string): string | null {
  return plannedDates(programWeekdays(program), addDays(key, 1), addDays(key, 14))[0] ?? null;
}

// ---------------------------------------------------------------------------------------------
// K1 : exclusions (aucune carte)
// ---------------------------------------------------------------------------------------------
export interface MissedContext {
  program: Program;
  /** Tous les programmes (pour savoir si une ancienne séance était du cardio) ; facultatif. */
  programs?: Program[];
  sessions: readonly WorkoutSession[];
  sets: readonly SetLog[];
  profile: Pick<Profile, 'blockedWeekdays' | 'daysPerWeek' | 'pregnancy'> & { reprise?: Partial<RepriseState> | null };
  injuries: readonly Injury[];
  /** Message « consulte » S1/S2 actif (painCheck). */
  consulteActive: boolean;
  now: Date;
}

export const isPregnancySet = (p: Pick<Profile, 'pregnancy'>): boolean => p.pregnancy === 'enceinte' || p.pregnancy === 'post_partum';

/** K1(a) et SM-2 (f) : symptôme, douleur à la dernière séance, « consulte », zone niveau 3, sécurité à lire, malaise récent. */
export function k1Excluded(c: MissedContext): boolean {
  const all = live(c.sessions);
  const t = (s: WorkoutSession) => s.endedAt ?? s.startedAt ?? s.plannedDate;
  const finished = all
    .filter((s) => s.status === 'faite' || (s.status === 'sautee' && (s.endReason === 'abandon' || s.endReason === 'symptome')))
    .sort((a, b) => (t(a) < t(b) ? -1 : t(a) > t(b) ? 1 : 0));
  const last = finished[finished.length - 1];
  if (last) {
    if (last.endReason === 'symptome') return true;
    if ((last.painExercises ?? []).length > 0) return true;
    if (c.sets.some((x) => x.sessionId === last.id && !x.deletedAt && x.pain)) return true;
  }
  if (c.consulteActive) return true;
  if (c.injuries.some((i) => i.active && !i.deletedAt && i.level === 3)) return true;
  if (c.profile.reprise?.securiteALire || c.profile.reprise?.apresMalaise) return true;
  const k = (s: WorkoutSession) => s.decidedAt ?? s.endedAt ?? s.startedAt ?? s.plannedDate;
  const mine = all.filter((s) => s.programId === c.program.id && s.status !== 'prevue' && s.status !== 'en_cours').sort((a, b) => (k(a) < k(b) ? -1 : k(a) > k(b) ? 1 : 0));
  const recent = mine[mine.length - 1];
  return !!recent && recent.status === 'sautee' && recent.endReason === 'pas_bien';
}

// ---------------------------------------------------------------------------------------------
// SM-2 / SM-3 / SM-D6 : la carte
// ---------------------------------------------------------------------------------------------
export interface MissedCard {
  /** Jour manqué D. */
  day: string;
  /** Séance désignée par la rotation (SM-D6). */
  dayIndex: number;
  nom: string;
  /** Nom du jour de D, pour T-1. */
  jour: string;
  /** Jours proposés pour « Décaler » (SM-5) ; vide : « Décaler » absent et T-11. */
  jours: string[];
}

export function missedCard(c: MissedContext): MissedCard | null {
  if (isPregnancySet(c.profile)) return null; // SM-2 (g), K3(b)
  if (live(c.sessions).some((s) => s.status === 'en_cours')) return null; // (d)
  const todayKey = dateKey(c.now);
  const missed = missedDays(c.program, c.sessions, c.sets, todayKey);
  if (missed.length !== 1) return null; // (a) : N = 1 seulement
  const d = missed[0];
  const nextPlanned = nextPlannedAfter(c.program, d);
  if (!nextPlanned || todayKey >= nextPlanned) return null; // (c)
  if (c.program.missedAnswers?.[d]) return null; // (e)
  if (k1Excluded(c)) return null; // (f)
  const ns = nextSession(c.program, c.sessions, c.now.getTime());
  if (!ns) return null;
  const DAY_NAMES = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  return { day: d, dayIndex: ns.dayIndex, nom: ns.day.label, jour: DAY_NAMES[weekdayOf(d)], jours: postponeDays(c, d, ns.dayIndex, nextPlanned) };
}

// ---------------------------------------------------------------------------------------------
// SM-5 / SM-20 : jours proposés pour « Décaler »
// ---------------------------------------------------------------------------------------------
interface Other {
  key: string;
  muscu: boolean;
  /** Fin réelle (ms) d'une séance faite. */
  endMs: number | null;
  /** Compte dans le plafond de la semaine. */
  counts: boolean;
}

/** K4 : au moins 48 h RÉELLES (millisecondes, insensible au changement d'heure) entre la fin d'une séance faite et le début proposé. */
export const realGapOk = (endMs: number, startMs: number): boolean => startMs - endMs >= MISSED.ecartHeuresMin * HOUR_MS;

export function postponeDays(c: MissedContext, d: string, i: number, nextPlanned: string): string[] {
  const program = c.program;
  const all = live(c.sessions);
  // SM-6 : une seule fois. Choix prudent (docs/QUESTIONS.md) : aussi refusé si une ligne N de cette séance est encore en attente.
  if (all.some((s) => s.programId === program.id && s.dejaDecalee && s.programDayIndex === i && (s.originDate === d || s.status === 'prevue'))) return [];
  const todayKey = dateKey(c.now);
  const sunday = addDays(mondayKey(c.now), 6);
  const end = minKey(sunday, addDays(nextPlanned, -1));
  if (dayDiff(todayKey, end) < 0) return [];
  const day = program.days[i];
  const cardio = !!day && isCardioDay(day);
  const blocked = new Set(c.profile.blockedWeekdays ?? []);
  const programs = [program, ...(c.programs ?? [])];
  const lineDays = new Set(all.map(keyOf));

  const others: Other[] = [];
  for (const s of all) {
    if (s.status === 'faite') others.push({ key: keyOf(s), muscu: isMuscuSession(s, programs), endMs: Date.parse(s.endedAt ?? s.startedAt ?? '') || null, counts: true });
    else if (s.status === 'en_cours') others.push({ key: keyOf(s), muscu: isMuscuSession(s, programs), endMs: null, counts: true });
    else if (s.status === 'prevue' && s.dejaDecalee && s.programId === program.id) {
      const pd = s.programDayIndex !== null ? program.days[s.programDayIndex] : undefined;
      others.push({ key: s.plannedDate.slice(0, 10), muscu: !pd || !isCardioDay(pd), endMs: null, counts: true });
    }
  }
  // Jours planifiés restants (aujourd'hui compris, sans ligne), y compris la semaine suivante pour l'écart de 2 jours ; D jamais compté.
  for (const k of plannedDates(programWeekdays(program), todayKey, addDays(end, 7))) {
    if (k === d || lineDays.has(k)) continue;
    const pd = dayForWeekday(program, weekdayOf(k));
    others.push({ key: k, muscu: !pd || !isCardioDay(pd), endMs: null, counts: true });
  }
  const perWeek = c.profile.daysPerWeek && c.profile.daysPerWeek > 0 ? c.profile.daysPerWeek : programWeekdays(program).length;

  const out: string[] = [];
  for (let j = todayKey; j <= end; j = addDays(j, 1)) {
    if (blocked.has(weekdayOf(j))) continue;
    if (lineDays.has(j) || others.some((o) => o.key === j)) continue; // jamais deux séances le même jour (SM-7)
    const mon = mondayKey(parseKey(j));
    const sun = addDays(mon, 6);
    const inWeek = (o: Other) => o.counts && o.key >= mon && o.key <= sun;
    if (!cardio) {
      if (others.some((o) => o.muscu && Math.abs(dayDiff(o.key, j)) < MISSED.ecartJoursMin)) continue; // 2 jours civils (K4)
      const startMs = j === todayKey ? c.now.getTime() : parseKey(j).getTime(); // aujourd'hui : maintenant ; jour futur : 00:00 locale
      if (others.some((o) => o.muscu && o.endMs !== null && !realGapOk(o.endMs, startMs))) continue; // 48 h réelles
      if (others.filter((o) => o.muscu && inWeek(o)).length + 1 > perWeek) continue; // plafond hebdomadaire
    } else {
      // SM-20 : cardio dédié, sans contrainte de 48 h ; plafond = jours planifiés (musculation + cardio) de la semaine.
      const cap = plannedDates(programWeekdays(program), mon, sun).length;
      if (others.filter(inWeek).length + 1 > cap) continue;
    }
    out.push(j);
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Lignes à écrire (SM-D1 à SM-D3)
// ---------------------------------------------------------------------------------------------
const baseRow = (program: Program, i: number) => ({
  programId: program.id,
  programDayIndex: i,
  startedAt: null,
  endedAt: null,
  note: '',
  plan: program.days[i] ?? null,
});

/** SM-D2 : « Décaler » de D vers J = ligne O (`reportee`, sur D) + ligne N (`prevue`, sur J). */
export function postponeRows(program: Program, i: number, d: string, j: string, nowIso: string): [NewRow<'sessions'>, NewRow<'sessions'>] {
  return [
    { ...baseRow(program, i), plannedDate: d, status: 'reportee', originDate: d, postponedTo: j, decidedAt: nowIso },
    { ...baseRow(program, i), plannedDate: j, status: 'prevue', originDate: d, dejaDecalee: true },
  ];
}

/** SM-D1 : « Sauter » (`renonce`) ou « Je ne me sens pas bien » (`pas_bien`) : ligne `sautee`, sans début ni fin. */
export function skipRow(program: Program, i: number, plannedDate: string, reason: 'renonce' | 'pas_bien', nowIso: string): NewRow<'sessions'> {
  return { ...baseRow(program, i), plannedDate, status: 'sautee', endReason: reason, decidedAt: nowIso };
}

/** SM-D3 : réponse mémorisée pour le jour D. */
export function withAnswer(program: Program, d: string, reponse: MissedAnswer['reponse'], nowIso: string): Record<string, MissedAnswer> {
  return { ...(program.missedAnswers ?? {}), [d]: { reponse, at: nowIso } };
}

/** SM-11 : programme de 2 jours dont une séance est sautée : T-12 sous T-10. */
export const showT12 = (program: Pick<Program, 'days'>): boolean => program.days.length === 2;

// ---------------------------------------------------------------------------------------------
// SM-12 : absence et paliers
// ---------------------------------------------------------------------------------------------
/** Jour (local) de la dernière séance de musculation faite, tous programmes confondus (SM-D5) ; null = aucune. */
export function lastMuscuKey(sessions: readonly WorkoutSession[], programs: readonly Pick<Program, 'id' | 'days'>[] = []): string | null {
  const keys = live(sessions)
    .filter((s) => s.status === 'faite' && isMuscuSession(s, programs) && (s.endedAt || s.startedAt))
    .map((s) => dateKey(new Date(s.endedAt ?? s.startedAt!)))
    .sort();
  return keys[keys.length - 1] ?? null;
}

/** `joursAbsence` = jours civils entre la dernière séance de musculation faite et aujourd'hui ; premier usage = 0. */
export const joursAbsence = (last: string | null, todayKey: string): number => (last ? Math.max(0, dayDiff(last, todayKey)) : 0);

export function palierFromDays(n: number): 0 | 1 | 2 | 3 | 4 {
  const t = MISSED.paliers.find((p) => n >= p.min && (p.max === null || n <= p.max));
  return t ? t.palier : 0;
}

// ---------------------------------------------------------------------------------------------
// R-DEM : au démarrage d'une séance de musculation
// ---------------------------------------------------------------------------------------------
export interface RepriseStart {
  state: RepriseState;
  /** Bloc de messages de l'aperçu (T-13/T-14/T-20/T-15 puis T-19), dans l'ordre. */
  texts: string[];
  /** L'état vient d'être créé (étape 3). */
  created: boolean;
  /** Séance j de la reprise (`valables + 1`), ou 0 hors reprise. */
  j: number;
  /** Arrêt de plus d'un an : C0 ignorée (RC-8). */
  c0Ignored: boolean;
  joursAbsence: number;
}

export function repriseAtStart(state: RepriseState, jours: number, todayKey: string, lastKey: string | null): RepriseStart {
  const palierJours = palierFromDays(jours);
  const effectif = Math.max(palierJours, state.palierMin) as RepriseState['palier'];
  const malaise = state.apresMalaise; // lu à l'étape 3, mémorisé pour l'étape 6
  let s: RepriseState = { ...state, refKg: { ...state.refKg }, descenteKg: { ...state.descenteKg } };
  let created = false;
  if (effectif >= 1 && (!s.actif || effectif > s.palier)) {
    s = { ...s, palier: effectif, actif: true, depuis: todayKey, valables: 0, descenteKg: {}, msgVu: false };
    created = true;
  }
  s.palierMin = 0;
  s.apresMalaise = false;
  const texts: string[] = [];
  if (s.actif) {
    if (!s.msgVu) {
      const t = repriseText(s.palier);
      if (t) texts.push(t);
      s.msgVu = true;
    }
    let t19 = false;
    if (malaise) t19 = true; // K7(a), NR-1 : après un malaise, toujours, sans regarder conseilVuLe
    else if (created && effectif >= 3) t19 = !(s.conseilVuLe && lastKey && s.conseilVuLe >= lastKey);
    if (t19) {
      texts.push(MISSED_TEXT.T19);
      s.conseilVuLe = todayKey;
    }
  }
  return { state: s, texts, created, j: s.actif ? s.valables + 1 : 0, c0Ignored: created && s.palier === 4 && jours > MISSED.c0IgnoreeApresJours, joursAbsence: jours };
}

// ---------------------------------------------------------------------------------------------
// SM-13 : séance valable ; R-FIN
// ---------------------------------------------------------------------------------------------
/** Séance valable pour les compteurs de reprise : faite, musculation, au moins une série de travail terminée (étalonnage compris), aucune douleur, pas de symptôme. */
export function isValidRepriseSession(s: WorkoutSession, sets: readonly SetLog[], programs: readonly Pick<Program, 'id' | 'days'>[] = []): boolean {
  if (s.status !== 'faite' || s.endReason === 'symptome' || !isMuscuSession(s, programs)) return false;
  const mine = sets.filter((x) => x.sessionId === s.id && !x.deletedAt);
  if (mine.some((x) => x.pain)) return false;
  return mine.some((x) => !!x.completedAt && !x.isWarmup);
}

export function repriseAtEnd(state: RepriseState, s: WorkoutSession, sets: readonly SetLog[], programs: readonly Pick<Program, 'id' | 'days'>[] = []): RepriseState {
  const out: RepriseState = { ...state, refKg: { ...state.refKg }, descenteKg: { ...state.descenteKg } };
  if (s.endReason === 'symptome') return { ...out, palierMin: MISSED.palierMinApresMalaise, securiteALire: true }; // (a)
  if (s.status !== 'faite' || !out.actif || !isMuscuSession(s, programs)) return out; // (c) abandon : rien
  if (isValidRepriseSession(s, sets, programs)) out.valables += 1;
  const tier = tierOf(out.palier);
  if (!tier || out.valables >= tier.seuil) return { ...out, actif: false, refKg: {}, descenteKg: {} };
  if (out.palier >= 1 && out.palier <= 3) {
    (s.plan?.exercises ?? []).forEach((ex, idx) => {
      if (ex.startLoadKg === null) return;
      const work = sets
        .filter((x) => x.sessionId === s.id && !x.deletedAt && x.exerciseIndex === idx && x.completedAt && !x.isWarmup && x.loadKg !== null)
        .sort((a, b) => (a.completedAt! < b.completedAt! ? -1 : 1));
      const lastLoad = work[work.length - 1]?.loadKg ?? null;
      if (lastLoad !== null && lastLoad < ex.startLoadKg) out.descenteKg[ex.variantId] = lastLoad;
      else delete out.descenteKg[ex.variantId];
    });
  }
  return out;
}

/** R-FIN (d), K7(b) : « Je ne me sens pas bien » écrit le plancher et le drapeau de malaise aussitôt. */
export const onPasBien = (state: RepriseState): RepriseState => ({ ...state, palierMin: MISSED.palierMinApresMalaise, apresMalaise: true });
/** K1(b) : bouton T-22 pressé. */
export const onSecurityAck = (state: RepriseState): RepriseState => ({ ...state, securiteALire: false });

// ---------------------------------------------------------------------------------------------
// SM-12 : charge de départ et séance de reprise
// ---------------------------------------------------------------------------------------------
const tenths = (kg: number): number => Math.round(kg * 10);

/** Dernière charge de travail réellement faite sur la variante (tous programmes) ; séance avec douleur : la plus basse de cette séance. */
export function lastWorkLoad(sets: readonly SetLog[], variantId: string, excludeSessionId: string | null = null): number | null {
  const work = sets
    .filter((s) => !s.deletedAt && s.variantId === variantId && s.completedAt && !s.isWarmup && s.loadKg !== null && s.sessionId !== excludeSessionId)
    .sort((a, b) => (a.completedAt! < b.completedAt! ? -1 : 1));
  const last = work[work.length - 1];
  if (!last) return null;
  const same = work.filter((s) => s.sessionId === last.sessionId);
  return same.some((s) => s.pain) ? Math.min(...same.map((s) => s.loadKg!)) : last.loadKg;
}

/** Arrondi inférieur à l'échelon réel (calcul en dixièmes de kg) ; jamais sous le plus bas échelon. */
export function floorToLoads(rawTenths: number, loads: readonly number[]): number {
  const sorted = [...loads].sort((a, b) => a - b);
  if (!sorted.length) return Math.floor(rawTenths / 10);
  const below = sorted.filter((l) => tenths(l) <= rawTenths);
  return below.length ? below[below.length - 1] : sorted[0];
}

/** Paliers 1 à 3 : `floor(C0 × (100 - p_j) / 100)` en dixièmes, arrondi inférieur à l'échelon réel, puis min avec `descenteKg`, jamais > C0. */
export function repriseLoad(c0: number, palier: number, j: number, loads: readonly number[], descente?: number): number {
  const tier = tierOf(palier);
  const ps = tier?.baisses ?? [];
  const p = ps.length ? ps[Math.min(j, ps.length) - 1] : 0;
  let kg = floorToLoads(Math.floor((tenths(c0) * (100 - p)) / 100), loads);
  if (descente !== undefined) kg = Math.min(kg, descente);
  return Math.min(kg, c0);
}

/** Réglage d'un exercice pendant la reprise (copie du plan de la séance seulement, jamais le programme). */
export type RepriseExercise = NonNullable<PlannedExercise['reprise']>;

export interface ApplyRepriseInput {
  start: RepriseStart;
  sets: readonly SetLog[];
  /** Charges possibles de la variante (paliers réels du matériel). */
  loadsFor: (ex: PlannedExercise) => number[];
  /** Échelon inférieur permis par le profil actif (matériel, zones, niveau, grossesse), ou null. */
  downOf?: (ex: PlannedExercise) => { variantId: string } | null;
}

/** Applique les règles du palier à la séance : charges de départ, séries retirées, échelon -1, étalonnage garder / descendre ; durée recalculée. */
export function applyRepriseToDay(day: ProgramDay, i: ApplyRepriseInput): { day: ProgramDay; refKg: Record<string, number> } {
  const st = i.start.state;
  const refKg = { ...st.refKg };
  if (!st.actif) return { day, refKg };
  const tier = tierOf(st.palier);
  if (!tier) return { day, refKg };
  const j = i.start.j;
  let removedSec = 0;
  const exercises = day.exercises.map((ex0): PlannedExercise => {
    if (ex0.role === 'cardio') return ex0;
    const ex: PlannedExercise = { ...ex0 };
    if (tier.retirerSerie && ex.role === 'autre' && ex.sets >= 3 && ex.sets - 1 >= MISSED.seriesMin) {
      ex.sets -= 1;
      const reps = ex.unit === 'sec' ? (ex.holdSec ?? 0) : ((ex.repsMin + ex.repsMax) / 2) * TIME.secPerRep * (ex.unit === 'reps_par_cote' ? TIME.unilateralFactor : 1);
      removedSec += reps + ex.restSec;
    }
    let reprise: RepriseExercise = { calibration: ex.unit !== 'sec', noRaise: true, maxKg: null };
    if (ex.startLoadKg !== null) {
      const loads = i.loadsFor(ex);
      const lightest = loads.length ? Math.min(...loads) : ex.startLoadKg;
      const last = lastWorkLoad(i.sets, ex.variantId);
      let c0: number | null;
      if (i.start.c0Ignored) c0 = null;
      else if (refKg[ex.variantId] !== undefined) c0 = i.start.created && last !== null ? Math.min(refKg[ex.variantId], last) : refKg[ex.variantId];
      else c0 = last;
      if (c0 !== null) refKg[ex.variantId] = c0;
      if (st.palier === 4) {
        if (j <= 1) {
          ex.startLoadKg = c0 === null ? lightest : Math.min(lightest, c0);
          reprise = { calibration: true, noRaise: false, maxKg: c0 };
        } else ex.startLoadKg = last ?? ex.startLoadKg; // charge finale de la séance précédente, garder / descendre
      } else if (c0 === null) ex.startLoadKg = lightest; // C0 inconnue : charge légère d'étalonnage
      else ex.startLoadKg = repriseLoad(c0, st.palier, j, loads, st.descenteKg[ex.variantId]);
      // Plafond de sécurité du plan (R2, charge:legere, G5 grossesse) : le plus bas l'emporte (E16).
      if (ex0.capped && ex0.startLoadKg !== null && ex.startLoadKg !== null) ex.startLoadKg = Math.min(ex.startLoadKg, ex0.startLoadKg);
    } else if (ex.unit !== 'sec' && j <= tier.echelonMoinsUnSeances) {
      const down = i.downOf?.(ex) ?? null;
      if (down) ex.variantId = down.variantId; // échelon -1 seulement s'il est permis par le profil actif
    }
    ex.reprise = reprise;
    return ex;
  });
  const estimatedMin =
    day.estimatedMin !== undefined && removedSec > 0 ? Math.max(TIME.displayRoundMin, Math.ceil((day.estimatedMin * 60 - removedSec) / 60 / TIME.displayRoundMin) * TIME.displayRoundMin) : day.estimatedMin;
  return { day: { ...day, exercises, ...(estimatedMin !== undefined ? { estimatedMin } : {}) }, refKg };
}
