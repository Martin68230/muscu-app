// Progression par échelons (F6) : ce qui touche aux fiches, au générateur et à IndexedDB.
// La logique est dans progression.ts (pure) ; ici : variantes vues par la progression, informations d'étalonnage pour le moteur,
// propositions de l'aperçu, et enregistrement des décisions (accepter, plus tard) dans le profil.
import { list, update } from '../data/repo';
import type { Level, ProgramDay, Program, ProgressionEvent, SetLog, WorkoutSession, PlannedExercise } from '../data/model';
import { buildCtx, isChargeable, type Ctx } from '../generator/context';
import { sortSameEchelon } from '../generator/safety';
import type { Fiche, GeneratorInput } from '../generator/types';
import type { EchelonInfo } from './engine';
import { gentlerAlternative } from './history';
import { PROGRESSION, type ProgressionConfig } from './progression-config';
import {
  evaluateEchelon, firstFinishedAt, isWorkSet, lastIncident, levelIndex, pendingArrival, proposeLevel, symptomFrozen,
  type EchelonProposal, type LevelProposal, type ProgVariant,
} from './progression';

const MAX_EVENTS = 200;

// ----- Variantes vues par la progression -----
export function progVariants(fiche: Fiche, ctx: Ctx): ProgVariant[] {
  return fiche.variantes.map((v) => {
    const sameEchelon = sortSameEchelon(fiche, fiche.variantes.filter((x) => x.echelon === v.echelon), ctx);
    return {
      id: v.id,
      nom: v.nom,
      echelon: v.echelon,
      niveau: v.niveau,
      materielOk: v.tags.length > 0 && v.tags.every((t) => ctx.available.has(t)) && !(ctx.specialiseForbidden && v.tags.includes('materiel_specialise')),
      rank: sameEchelon.indexOf(v),
    };
  });
}

const bestAt = (vars: readonly ProgVariant[], echelon: number, level?: Level): ProgVariant | undefined =>
  vars
    .filter((v) => v.echelon === echelon && v.materielOk && (level === undefined || levelIndex(v.niveau) <= levelIndex(level)))
    .sort((a, b) => a.rank - b.rank)[0];

// ----- Informations d'étalonnage pour le moteur (EngineContext.echelonInfo) -----
export interface EchelonData {
  ctx: Ctx;
  sets: readonly SetLog[];
  sessions: readonly WorkoutSession[];
  events: readonly ProgressionEvent[];
  excludeSessionId?: string | null;
  cfg?: ProgressionConfig;
}

export function echelonInfoFor(ex: PlannedExercise, d: EchelonData): EchelonInfo | null {
  const cfg = d.cfg ?? PROGRESSION;
  const fiche = d.ctx.fichesById.get(ex.movementId);
  const variant = fiche?.variantes.find((v) => v.id === ex.variantId);
  if (!fiche || !variant || isChargeable(variant) || ex.unit === 'sec') return null; // exercice à charge ou maintien : pas d'échelon
  const vars = progVariants(fiche, d.ctx);
  const others = d.sets.filter((s) => s.sessionId !== d.excludeSessionId);
  let arrival = pendingArrival(d.events, ex.movementId, others);
  if (arrival && arrival.to !== variant.echelon) arrival = null; // décision périmée (programme régénéré depuis)
  const donePair = others.some((s) => isWorkSet(s) && s.movementId === ex.movementId && s.echelon === variant.echelon);
  const calibration = !!arrival || !donePair;
  const restricted = ex.adaptation !== null;
  return {
    echelon: variant.echelon,
    calibration,
    ceiling: arrival ? arrival.to : calibration && !cfg.echelon.firstSessionRaiseAllowed ? variant.echelon : null,
    noRaise: d.ctx.pregnant || ex.capped || symptomFrozen(d.sessions) || restricted || arrival?.kind === 'descente',
    up: restricted ? null : toPair(bestAt(vars, variant.echelon + 1, d.ctx.level)),
    down: restricted ? null : toPair(bestAt(vars, variant.echelon - 1)),
  };
}
const toPair = (v: ProgVariant | undefined) => (v ? { echelon: v.echelon, variantId: v.id } : null);

// ----- Propositions de l'aperçu -----
export interface ProposalItem {
  exerciseIndex: number;
  movementId: string;
  proposal: EchelonProposal;
}
export interface ProposalSet {
  items: ProposalItem[];
  level: LevelProposal | null;
}

export interface ProposalData {
  program: Pick<Program, 'days'>;
  dayIndex: number;
  input: GeneratorInput;
  sets: readonly SetLog[];
  sessions: readonly WorkoutSession[];
  events: readonly ProgressionEvent[];
  /** Une zone du profil blessures au niveau 2 ou 3. */
  zoneLevel2Plus: boolean;
  now: number;
  cfg?: ProgressionConfig;
}

/** Propositions pour l'ouverture de la séance (jamais automatiques) : un échelon par fiche, et au plus une proposition de niveau. */
export function computeProposals(d: ProposalData): ProposalSet {
  const cfg = d.cfg ?? PROGRESSION;
  const ctx = buildCtx(d.input);
  const frozen = symptomFrozen(d.sessions);
  const level: Level = ctx.level;
  const seen = new Set<string>();
  const results = new Map<string, { exercise: PlannedExercise; index: number; day: number; res: ReturnType<typeof evaluateEchelon> }>();

  d.program.days.forEach((day: ProgramDay, di: number) => {
    day.exercises.forEach((ex, index) => {
      if (seen.has(ex.movementId)) return;
      const fiche = ctx.fichesById.get(ex.movementId);
      const variant = fiche?.variantes.find((v) => v.id === ex.variantId);
      if (!fiche || !variant || isChargeable(variant) || ex.unit === 'sec') return;
      seen.add(ex.movementId);
      const res = evaluateEchelon({
        movementId: ex.movementId,
        echelon: variant.echelon,
        sets: d.sets,
        sessions: d.sessions,
        events: d.events,
        variants: progVariants(fiche, ctx),
        level,
        pregnant: ctx.pregnant,
        capped: ex.capped,
        restricted: ex.adaptation !== null,
        frozen,
        fallbackPlanned: ex.sets * (ex.unit === 'reps_par_cote' ? 2 : 1),
        gentler: gentlerAlternative(ex.movementId, d.input),
        cfg,
      });
      results.set(ex.movementId, { exercise: ex, index, day: di, res });
    });
  });

  const items: ProposalItem[] = [];
  for (const [movementId, r] of results) {
    if (r.day === d.dayIndex && r.res.proposal) items.push({ exerciseIndex: r.index, movementId, proposal: r.res.proposal });
  }
  const readyFiches = [...results.values()].filter((r) => r.res.readyBlockedByLevel).length;
  const levelProposal = proposeLevel({
    level,
    pregnant: ctx.pregnant,
    readyFiches,
    firstSessionAt: firstFinishedAt(d.sessions),
    now: d.now,
    lastIncidentAt: lastIncident(d.sets, d.sessions),
    zoneLevel2Plus: d.zoneLevel2Plus,
    frozen,
    events: d.events,
    cfg,
  });
  return { items, level: levelProposal };
}

/**
 * Montées ou descentes acceptées dont la variante n'est plus celle du programme (programme régénéré depuis) : la décision est périmée.
 * Rend les fiches concernées ; l'aperçu le dit clairement (`ECHELON_TEXT.cancelled`) et l'enregistre une fois (`cancelArrivals`).
 */
export function staleArrivals(program: Pick<Program, 'days'>, fiches: readonly Fiche[], sets: readonly SetLog[], events: readonly ProgressionEvent[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const ev of events) {
    if ((ev.type !== 'montee' && ev.type !== 'descente') || seen.has(ev.movementId)) continue;
    seen.add(ev.movementId);
    const arrival = pendingArrival(events, ev.movementId, sets);
    if (!arrival) continue;
    const planned = program.days.flatMap((d) => d.exercises).find((e) => e.movementId === ev.movementId);
    const echelon = fiches.find((f) => f.id === ev.movementId)?.variantes.find((v) => v.id === planned?.variantId)?.echelon;
    if (planned && echelon !== undefined && echelon !== arrival.to) out.push(ev.movementId);
  }
  return out;
}

export async function cancelArrivals(movementIds: readonly string[], now: Date = new Date()): Promise<void> {
  for (const movementId of movementIds) await recordEvent({ type: 'annule', movementId, at: now.toISOString() });
}

// ----- Enregistrement des décisions -----
async function profileRow() {
  return (await list('profile'))[0];
}

export async function loadEvents(): Promise<ProgressionEvent[]> {
  return (await profileRow())?.progressionLog ?? [];
}

export async function recordEvent(ev: ProgressionEvent): Promise<void> {
  const p = await profileRow();
  if (!p) return;
  await update('profile', p.id, { progressionLog: [...(p.progressionLog ?? []), ev].slice(-MAX_EVENTS) });
}

/** Remplace la variante d'une fiche dans le programme actif (ou celui donné) : ce que la personne verra à la prochaine séance. */
export async function patchProgramVariant(programId: string | null, movementId: string, variantId: string): Promise<void> {
  const programs = await list('programs');
  const target = (programId ? programs.find((p) => p.id === programId) : undefined) ?? programs.filter((p) => p.active)[0];
  if (!target) return;
  let changed = false;
  const days = target.days.map((day) => ({
    ...day,
    exercises: day.exercises.map((e) => {
      if (e.movementId !== movementId || e.variantId === variantId) return e;
      changed = true;
      return { ...e, variantId };
    }),
  }));
  if (changed) await update('programs', target.id, { days });
}

export type MoveProposal = Extract<EchelonProposal, { kind: 'montee' | 'descente' }>;

/** « Accepter » : décision enregistrée, programme mis à jour ; la prochaine séance à cet échelon est une séance d'arrivée (étalonnage borné). */
export async function acceptEchelon(p: MoveProposal, now: Date = new Date()): Promise<void> {
  await recordEvent({ type: p.kind, movementId: p.movementId, from: p.from, to: p.to, variantId: p.variantId, at: now.toISOString() });
  await patchProgramVariant(null, p.movementId, p.variantId);
}

/** « Plus tard » : refus enregistré, pas de nouvelle proposition avant quelques séances valables de plus. */
export async function refuseEchelon(p: MoveProposal, now: Date = new Date()): Promise<void> {
  await recordEvent({ type: 'refus', kind: p.kind, movementId: p.movementId, from: p.from, to: p.to, at: now.toISOString() });
}

/** Réponse à la proposition de niveau : l'appui de la personne est nécessaire (jamais de bascule seule). */
export async function answerLevel(accepted: boolean, now: Date = new Date()): Promise<void> {
  await recordEvent({ type: 'niveau', accepted, at: now.toISOString() });
  if (accepted) {
    const p = await profileRow();
    if (p) await update('profile', p.id, { level: 'intermediaire' });
  }
}
