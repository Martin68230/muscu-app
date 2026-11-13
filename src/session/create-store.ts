// D28 « Créer une séance » : passerelle entre createSession (src/generator/create-session.ts, fonction pure) et le stockage local.
// - lit l'historique réel (séances faites, séries, programme actif) et en tire le contexte de createSession (espacement 24 / 48 / 72 h,
//   contacts de sauts, douleur récente, pause de plus de 2 semaines) ;
// - transforme la séance composée en jour jouable par le lecteur (ProgramDay) et en méta enregistrée avec la séance (WorkoutSession.created) ;
// - ajoute / retire une séance créée du calendrier (ligne `prevue` sans programme).
// Tout est local : aucun accès réseau, aucune IA, aucune donnée envoyée.
import type { CreatedMeta, NewRow, PlannedWarmupItem, ProgramDay, Program, SetLog, WorkoutSession } from '../data/model';
import { create, list, softDelete, listTrusted } from '../data/repo';
import { jumpPlanned, plannedOf } from '../generator';
import type { CreateContext, CreateHistoryItem, CreatedSession, CreateSessionRequest } from '../generator';
import type { CreateZone } from '../generator/config';
import { VOLUME, weekCountsSecondary } from '../generator/config';
import type { WarmupItem } from '../generator/types';
import { dateKey } from './calendar';

const DAY_MS = 24 * 3600 * 1000;
/** Fiches de jambes : mêmes schémas que create-session.ts (une séance qui en contient une compte comme « jambes lourdes » pour l'espacement). */
const LEG_SCHEMAS = ['squat', 'fente', 'charniere', 'cheville_mollet', 'hanche_laterale'];

export const ZONE_TEXT: Record<CreateZone, string> = { jambes: 'Jambes', haut: 'Haut du corps', tronc: 'Tronc', corps_entier: 'Corps entier' };
export const createdLabel = (zone: CreateZone): string => `Séance créée : ${ZONE_TEXT[zone].toLowerCase()}`;

const warmupItem = (w: WarmupItem | null): PlannedWarmupItem | null => (w ? { ficheId: w.ficheId, variantId: w.variantId, nom: w.nom, sec: w.sec } : null);

/** Séance composée -> jour jouable : sauts en tête (comme les séances de cardio avec sauts), puis la force dans l'ordre du composeur. */
export function createdDay(s: CreatedSession): ProgramDay {
  return {
    dayIndex: 0,
    label: createdLabel(s.zone),
    estimatedMin: s.estimatedMin,
    warmup: {
      generalSec: s.warmup.generalSec,
      general: warmupItem(s.warmup.general),
      mobility: s.warmup.mobility.map((m) => warmupItem(m)!),
      cooldown: warmupItem(s.cooldown.items[0] ?? null),
    },
    exercises: [...(s.jumps ? s.jumps.items.map((j) => jumpPlanned(j, s.jumps!)) : []), ...s.exercises.map((e) => plannedOf(e))],
  };
}

export function metaOf(s: CreatedSession, r: Pick<CreateSessionRequest, 'zone' | 'sport' | 'chairStable' | 'durationMin' | 'intensity'>): CreatedMeta {
  return {
    heavyLegs: s.heavyLegs, impact: s.impact, contacts: s.contacts,
    request: { zone: r.zone, sport: r.sport ?? null, chairStable: !!r.chairStable, durationMin: r.durationMin, intensity: r.intensity },
  };
}

/** Une séance a-t-elle compté pour le travail de jambes (force de jambes) ? */
const legStrength = (d: ProgramDay | null | undefined, schemaOf: (id: string) => string | undefined): boolean =>
  !!d && d.exercises.some((e) => e.role !== 'cardio' && !e.jump && LEG_SCHEMAS.includes(schemaOf(e.movementId) ?? ''));

export interface HistoryInput {
  sessions: readonly WorkoutSession[];
  sets: readonly SetLog[];
  programs: readonly Pick<Program, 'id' | 'days'>[];
  schemaOf: (movementId: string) => string | undefined;
  /** Muscles d'une fiche (pour les séries de la semaine). Absent : weekSets non calculé. */
  musclesOf?: (movementId: string) => { principaux: readonly string[]; secondaires: readonly string[] } | undefined;
}

/**
 * Historique réel -> séances de createSession. Comptent : les séances faites, et celles arrêtées après au moins une série de travail.
 * Séance créée : ses propres valeurs (heavyLegs, contacts, impact). Séance de programme : lue dans son plan (force de jambes, sauts).
 */
export function createHistory({ sessions, sets, programs, schemaOf }: HistoryInput): CreateHistoryItem[] {
  const bySession = new Map<string, SetLog[]>();
  for (const x of sets) if (!x.deletedAt) bySession.set(x.sessionId, [...(bySession.get(x.sessionId) ?? []), x]);
  const out: CreateHistoryItem[] = [];
  for (const s of sessions) {
    if (s.deletedAt) continue;
    const mine = bySession.get(s.id) ?? [];
    const worked = mine.some((x) => !x.isWarmup && x.completedAt);
    if (s.status !== 'faite' && !(s.status === 'sautee' && worked)) continue;
    const end = s.endedAt ?? s.lastActionAt ?? s.startedAt;
    if (!end || !Number.isFinite(Date.parse(end))) continue;
    const pain = mine.some((x) => x.pain);
    if (s.created) {
      // Méta illisible (base modifiée à la main) : lecture prudente : jambes lourdes, impact, contacts = 0 ET douleur = true (aucun saut
      // jusqu'à expiration des 14 jours), jamais NaN. 120 contacts ne serait pas prudent : le palier +5 ne limiterait plus rien.
      const m = s.created as Partial<CreatedMeta> | null;
      const readable = typeof m?.heavyLegs === 'boolean' && typeof m.impact === 'boolean' && typeof m.contacts === 'number' && Number.isFinite(m.contacts) && m.contacts >= 0 && m.contacts <= 120;
      const heavyLegs = readable ? m!.heavyLegs! : true;
      const impact = readable ? m!.impact! : true;
      const contacts = readable ? m!.contacts! : 0;
      const sport = typeof (m?.request as { sport?: unknown } | undefined)?.sport === 'string' ? ((m!.request as { sport: string }).sport) : null;
      out.push({ endIso: end, heavyLegs, jumps: impact, contacts, impact, pain: pain || !readable, sport });
      continue;
    }
    const day = s.plan ?? (s.programDayIndex !== null ? programs.find((p) => p.id === s.programId)?.days[s.programDayIndex] : undefined);
    const jumpEx = (day?.exercises ?? []).filter((e) => !!e.jump && !e.jump.soft);
    const contacts = jumpEx.reduce((m, e) => Math.max(m, e.jump!.contacts), 0);
    out.push({ endIso: end, heavyLegs: legStrength(day, schemaOf), jumps: jumpEx.length > 0, contacts, impact: jumpEx.length > 0, pain });
  }
  return out;
}

/**
 * Séries pondérées par muscle sur les 7 derniers jours glissants (séances du programme ET séances créées, séries de travail faites) :
 * 1 pour un muscle principal, les secondaires ne comptent plus (13/11/2026, plafond hebdomadaire) ; « deltoides » = somme des deltoïdes
 * (au plus 1 par série). Rolling 7 jours : lecture prudente de « par semaine » (le plafond est de VOLUME.maxPerMuscleWeek).
 */
export function weekSetsOf(h: Pick<HistoryInput, 'sessions' | 'sets' | 'musclesOf'> & { now: Date }): Record<string, number> {
  const out: Record<string, number> = {};
  if (!h.musclesOf) return out;
  const live = new Set(h.sessions.filter((s) => !s.deletedAt && (s.status === 'faite' || s.status === 'sautee' || s.status === 'en_cours')).map((s) => s.id));
  const since = h.now.getTime() - 7 * DAY_MS;
  for (const x of h.sets) {
    if (x.deletedAt || x.isWarmup || !x.completedAt || !live.has(x.sessionId)) continue;
    const t = Date.parse(x.completedAt);
    if (!Number.isFinite(t) || t < since || t > h.now.getTime() + DAY_MS) continue;
    const m = h.musclesOf(x.movementId);
    if (!m) continue;
    let delto = 0;
    for (const [list, w] of [[m.principaux, 1], [m.secondaires, VOLUME.secondaryWeight]] as const) { // 13/11/2026 : secondaires comptés seulement pour épaules, trapèzes, triceps
      for (const name of list) {
        if (w < 1 && !weekCountsSecondary(name)) continue;
        out[name] = (out[name] ?? 0) + w;
        if (name.startsWith(VOLUME.deltoidPrefix)) delto = Math.max(delto, w);
      }
    }
    if (delto) out.deltoides = (out.deltoides ?? 0) + delto;
  }
  return out;
}

/**
 * Signe d'arrêt des sauts : aucune donnée « arrêt des sauts » n'est enregistrée par le lecteur ; cas le plus proche : à la dernière séance
 * de sauts (14 derniers jours, sinon le verrou ne se lèverait jamais), un exercice de sauts passé (« Passer cet exercice »), une douleur sur
 * un exercice de sauts ou une séance arrêtée par un symptôme.
 */
export function stopSignOf(h: Pick<HistoryInput, 'sessions' | 'sets'> & { now: Date }): boolean {
  const since = h.now.getTime() - 14 * DAY_MS;
  const jumpSessions = h.sessions
    .filter((s) => !s.deletedAt && s.plan && (s.status === 'faite' || s.status === 'sautee') && s.plan.exercises.some((e) => e.jump && !e.jump.soft))
    .map((s) => ({ s, t: Date.parse(s.endedAt ?? s.lastActionAt ?? s.startedAt ?? '') }))
    .filter((x) => Number.isFinite(x.t) && x.t >= since)
    .sort((a, b) => b.t - a.t);
  const last = jumpSessions[0]?.s;
  if (!last?.plan) return false;
  const jumpIdx = last.plan.exercises.map((e, i) => (e.jump && !e.jump.soft ? i : -1)).filter((i) => i >= 0);
  if (last.endReason === 'symptome') return true;
  if ((last.skippedExercises ?? []).some((i) => jumpIdx.includes(i))) return true;
  return h.sets.some((x) => !x.deletedAt && x.sessionId === last.id && x.pain && jumpIdx.includes(x.exerciseIndex));
}

/** Contexte de createSession tiré de l'historique réel et du programme actif. */
export function createContextOf(h: HistoryInput & { activeProgram: Pick<Program, 'days'> | null; now: Date }): CreateContext {
  const items = createHistory(h);
  const nowMs = h.now.getTime();
  const tomorrowWd = (new Date(h.now.getFullYear(), h.now.getMonth(), h.now.getDate() + 1).getDay() + 6) % 7;
  const heavyLegsTomorrow = !!h.activeProgram?.days.some((d) => d.weekday === tomorrowWd && legStrength(d, h.schemaOf));
  const todayKey = dateKey(h.now);
  const interruptedToday = h.sessions.some((s) => !s.deletedAt && (s.endReason === 'abandon' || s.endReason === 'symptome') && s.endedAt && dateKey(new Date(s.endedAt)) === todayKey);
  const ends = items.map((i) => Date.parse(i.endIso)).filter(Number.isFinite);
  const pauseOver2Weeks = ends.length > 0 && nowMs - Math.max(...ends) > 14 * DAY_MS;
  return { sessions: items, heavyLegsTomorrow, interruptedToday, pauseOver2Weeks, stopSignRecent: stopSignOf(h), weekSets: weekSetsOf(h) };
}

export async function loadCreateContext(schemaOf: (id: string) => string | undefined, now: Date = new Date(), musclesOf?: HistoryInput['musclesOf']): Promise<CreateContext> {
  // Les séances de sport ne sont PAS des séances de musculation : listTrusted ne les lit pas ; elles ne passent que par `sport` (charge).
  const [sessions, sets, programs, sportSessions, profiles] = await Promise.all([listTrusted('sessions'), listTrusted('sets'), list('programs'), list('sportSessions'), list('profile')]);
  const activeProgram = programs.find((p) => p.active && !p.deletedAt) ?? null;
  const ctx = createContextOf({ sessions, sets, programs, schemaOf, musclesOf, activeProgram, now });
  return { ...ctx, sport: { sessions: sportSessions, plan: profiles[0]?.sportPlan ?? [] } };
}

// ----- Calendrier -----
/** Jours à venir (demain compris) proposés pour « Ajouter au calendrier ». */
export function upcomingDays(now: Date, n = 14): string[] {
  return Array.from({ length: n }, (_, i) => dateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() + i + 1)));
}

/** Ajoute une séance créée au calendrier : ligne `prevue` sans programme (aucune séance du programme n'est touchée). */
export async function scheduleCreated(day: ProgramDay, meta: CreatedMeta, key: string): Promise<WorkoutSession> {
  return create('sessions', {
    programId: null, programDayIndex: null, plannedDate: key, status: 'prevue', startedAt: null, endedAt: null, note: '', plan: day, created: meta,
  } as NewRow<'sessions'>);
}

export interface ScheduledCreated {
  id: string;
  dateKey: string;
  label: string;
  meta: CreatedMeta;
}
/** Séances créées ajoutées au calendrier, à partir d'aujourd'hui (les passées ne s'affichent plus). */
export function scheduledOf(sessions: readonly WorkoutSession[], todayKey: string): ScheduledCreated[] {
  return sessions
    .filter((s) => !s.deletedAt && s.status === 'prevue' && !!s.created && s.plannedDate.slice(0, 10) >= todayKey)
    .map((s) => ({ id: s.id, dateKey: s.plannedDate.slice(0, 10), label: s.plan?.label ?? 'Séance créée', meta: s.created! }))
    .sort((a, b) => (a.dateKey < b.dateKey ? -1 : 1));
}

export async function removeScheduled(id: string): Promise<void> {
  await softDelete('sessions', id);
}

