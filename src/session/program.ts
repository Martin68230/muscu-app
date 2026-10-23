// Programme actif et séance du jour (F5). Appelle le générateur v1 (pur), enregistre le résultat dans la table `programs`
// (un seul programme actif) et le régénère seulement quand les entrées changent (empreinte `inputsHash`).
import { list, create, update, get } from '../data/repo';
import type { Program, ProgramDay, SetLog, WorkoutSession, NewRow } from '../data/model';
import { BLOCK_WEEKS, MIN_GAP_DAYS } from '../generator/config';
import { generateProgram, toProgramDays } from '../generator';
import type { Fiche, GeneratorInput, GenerateResult, GenMessage, GenProgram, HistorySet } from '../generator/types';

/** À changer quand les règles du générateur changent : force la régénération chez tout le monde. */
export const GENERATOR_VERSION = 'v1';
export const PROGRAM_TEMPLATE_KEY = 'generateur-v1';
const DAY_MS = 24 * 3600 * 1000;

// ----- Empreinte stable des entrées -----
/** Hachage 53 bits (cyrb53) : rapide, sans dépendance. Sert à détecter un changement, pas à protéger quoi que ce soit. */
export function hashString(str: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

const sortedNums = (a: readonly number[] | undefined): number[] => [...(a ?? [])].sort((x, y) => x - y);
const sortedStrs = (a: readonly string[] | undefined): string[] => [...(a ?? [])].sort();

/** Représentation canonique des entrées qui décident du programme (ni l'historique, ni les fiches elles-mêmes). */
function canonical(input: GeneratorInput, fichesSig: string): unknown {
  const p = input.profile;
  const eq = input.equipment;
  return {
    gen: GENERATOR_VERSION,
    fiches: fichesSig,
    profile: [p.level ?? null, p.daysPerWeek ?? null, sortedNums(p.blockedWeekdays), p.sessionDurationMin ?? null, p.place ?? null, p.pregnancy ?? null],
    equipment: [eq.preset, sortedStrs(eq.tags), sortedStrs(eq.disabledImplicit), sortedNums(eq.dumbbellWeightsKg), sortedNums(eq.kettlebellWeightsKg), sortedNums(eq.platesKg)],
    injuries: (input.injuries ?? [])
      .filter((i) => i.active && !i.deletedAt)
      .map((i) => `${i.zone}:${i.level}:${i.afterShock ? 1 : 0}`)
      .sort(),
    goals: (input.goals ?? []).map((g) => `${g.rank}:${g.goalKey}`).sort(),
    options: input.options
      ? [!!input.options.gagnerDuTemps, !!input.options.ajouterFonctionnel, Object.entries(input.options.habitualLoadsKg ?? {}).sort(), sortedStrs(input.options.favoris), sortedStrs(input.options.masques)]
      : null,
  };
}

/** Signature légère des fiches : nombre, ids, statuts (un changement de la base de fiches régénère le programme). */
export function fichesSignature(fiches: readonly Fiche[]): string {
  return `${fiches.length}:${hashString(fiches.map((f) => `${f.id}/${f.statut}/${f.variantes.length}`).sort().join('|'))}`;
}

export function computeInputsHash(input: GeneratorInput): string {
  return hashString(JSON.stringify(canonical(input, fichesSignature(input.fiches))));
}

// ----- Lecture des entrées dans IndexedDB -----
/** Séries de travail terminées -> historique du générateur (charge de départ, étalonnage). */
export function historyFromSets(sets: readonly SetLog[]): HistorySet[] {
  return sets
    .filter((s) => s.completedAt && !s.isWarmup)
    .map((s) => ({ variantId: s.variantId, loadKg: s.loadKg, completedAt: s.completedAt, pain: s.pain, echelon: s.echelon ?? null }));
}

export interface LoadedInput {
  input: GeneratorInput;
  profileComplete: boolean;
}

export async function loadGeneratorInput(fiches: Fiche[]): Promise<LoadedInput | null> {
  const [profile] = await list('profile');
  const [equipment] = await list('equipment');
  if (!profile || !equipment) return null;
  const [injuries, goals, sets] = await Promise.all([list('injuries'), list('goals'), list('sets')]);
  const input: GeneratorInput = {
    profile: {
      level: profile.level,
      daysPerWeek: profile.daysPerWeek,
      blockedWeekdays: profile.blockedWeekdays,
      sessionDurationMin: profile.sessionDurationMin,
      place: profile.place ?? null,
      pregnancy: profile.pregnancy ?? null,
    },
    equipment: {
      preset: equipment.preset,
      tags: equipment.tags,
      disabledImplicit: equipment.disabledImplicit,
      dumbbellWeightsKg: equipment.dumbbellWeightsKg,
      kettlebellWeightsKg: equipment.kettlebellWeightsKg,
      platesKg: equipment.platesKg ?? [],
    },
    injuries: injuries.map((i) => ({ zone: i.zone, level: i.level, active: i.active, deletedAt: i.deletedAt, afterShock: i.afterShock })),
    goals: goals.map((g) => ({ goalKey: g.goalKey, rank: g.rank })),
    fiches,
    history: historyFromSets(sets),
  };
  return { input, profileComplete: !!profile.profileCompletedAt };
}

// ----- Programme actif -----
export async function getActiveProgram(): Promise<Program | undefined> {
  const programs = (await list('programs')).filter((p) => p.active);
  // En cas d'anomalie (deux actifs), le plus récent gagne.
  return programs.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];
}

function toStoredProgram(gen: GenProgram, hash: string, todayIso: string): NewRow<'programs'> {
  const days: ProgramDay[] = toProgramDays(gen).map((d, i) => {
    const s = gen.sessions[i];
    const item = (w: { ficheId: string; variantId: string; nom: string; sec: number } | null) =>
      w ? { ficheId: w.ficheId, variantId: w.variantId, nom: w.nom, sec: w.sec } : null;
    return {
      ...d,
      weekday: s.weekday,
      estimatedMin: s.estimatedMin,
      warmup: {
        generalSec: s.warmup.generalSec,
        general: item(s.warmup.general),
        mobility: s.warmup.mobility.map((m) => item(m)!),
        cooldown: item(s.warmup.cooldown),
      },
    };
  });
  return {
    templateKey: PROGRAM_TEMPLATE_KEY,
    name: 'Programme corps entier',
    split: gen.split,
    startDate: todayIso,
    weeks: gen.weeks ?? BLOCK_WEEKS,
    active: true,
    days,
    inputsHash: hash,
    generatorVersion: GENERATOR_VERSION,
    explanation: [...gen.explanation],
    messages: gen.messages.map((m: GenMessage) => ({ id: m.id, text: m.text, ...(m.session ? { session: m.session } : {}) })),
    durationMin: gen.targetMin,
    family: gen.family,
  };
}

export type EnsureResult =
  | { ok: true; program: Program; regenerated: boolean }
  | { ok: false; code: 'PROFIL' | 'HORS' | 'JOURS2' | 'PRO' | 'IMPOS'; messages: GenMessage[] };

/**
 * Programme à jour pour le profil actuel. Si l'empreinte des entrées n'a pas changé, le programme enregistré est rendu tel quel
 * (aucun calcul). Sinon : régénération, ancien programme désactivé (gardé : l'historique s'y réfère). Si le générateur refuse
 * (1 ou 4-6 jours, jours libres trop proches…), l'ancien programme est désactivé aussi : pas de programme périmé.
 */
export async function ensureActiveProgram(fiches: Fiche[], opts: { force?: boolean; todayIso?: string } = {}): Promise<EnsureResult> {
  const loaded = await loadGeneratorInput(fiches);
  if (!loaded || !loaded.profileComplete) return { ok: false, code: 'PROFIL', messages: [] };
  const hash = computeInputsHash(loaded.input);
  const active = await getActiveProgram();
  if (active && !opts.force && active.inputsHash === hash) return { ok: true, program: active, regenerated: false };

  const result: GenerateResult = generateProgram(loaded.input);
  for (const p of (await list('programs')).filter((x) => x.active)) await update('programs', p.id, { active: false });
  if (!result.ok) return { ok: false, code: result.code, messages: result.messages };
  const today = opts.todayIso ?? new Date().toISOString().slice(0, 10);
  const program = await create('programs', toStoredProgram(result.program, hash, today));
  return { ok: true, program, regenerated: true };
}

// ----- Séance du jour -----
export interface NextSession {
  dayIndex: number;
  day: ProgramDay;
  /** Moins de 48 h depuis la fin de la dernière séance : avertissement (la personne reste libre). */
  tooSoon: boolean;
  /** Heure (ms) à partir de laquelle 48 h sont passées, ou null. */
  availableAtMs: number | null;
  /** Le jour de la semaine prévu pour cette séance est aujourd'hui. */
  scheduledToday: boolean;
}

/**
 * Prochaine séance : la suivante dans l'ordre A, B, C après la dernière séance FAITE de ce programme (rotation V-ROT : même
 * semaine type tout le bloc, pas de séance double). Une séance abandonnée ou interrompue n'avance pas la rotation.
 */
export function nextSession(program: Program, sessions: readonly WorkoutSession[], nowMs: number): NextSession | null {
  const n = program.days.length;
  if (!n) return null;
  const done = sessions
    .filter((s) => !s.deletedAt && s.programId === program.id && s.status === 'faite')
    .sort((a, b) => ((a.endedAt ?? a.startedAt ?? a.plannedDate) < (b.endedAt ?? b.startedAt ?? b.plannedDate) ? -1 : 1));
  const last = done[done.length - 1];
  const dayIndex = last && last.programDayIndex !== null ? (last.programDayIndex + 1) % n : 0;
  const endedMs = last ? Date.parse(last.endedAt ?? last.startedAt ?? last.plannedDate) : NaN;
  const availableAtMs = Number.isFinite(endedMs) ? endedMs + MIN_GAP_DAYS * DAY_MS : null;
  const day = program.days[dayIndex];
  const weekdayToday = (new Date(nowMs).getDay() + 6) % 7;
  return {
    dayIndex,
    day,
    tooSoon: availableAtMs !== null && nowMs < availableAtMs,
    availableAtMs,
    scheduledToday: day.weekday === weekdayToday,
  };
}

export async function getNextSession(nowMs: number): Promise<NextSession | null> {
  const program = await getActiveProgram();
  if (!program) return null;
  return nextSession(program, await list('sessions'), nowMs);
}

/** Aperçu avant de commencer : explication de 2 lignes, durée estimée, messages V-MSG-*. */
export interface ProgramPreview {
  explanation: string[];
  messages: NonNullable<Program['messages']>;
  days: { dayIndex: number; label: string; estimatedMin: number | null; exerciseCount: number }[];
}
export function programPreview(program: Program): ProgramPreview {
  return {
    explanation: program.explanation ?? [],
    messages: program.messages ?? [],
    days: program.days.map((d) => ({ dayIndex: d.dayIndex, label: d.label, estimatedMin: d.estimatedMin ?? null, exerciseCount: d.exercises.length })),
  };
}

export async function getProgram(id: string): Promise<Program | undefined> {
  return get('programs', id);
}
