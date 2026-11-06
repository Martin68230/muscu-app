// Progression par échelons (F6) : ce qui touche aux fiches, au générateur et à IndexedDB.
// La logique est dans progression.ts (pure) ; ici : variantes vues par la progression, informations d'étalonnage pour le moteur,
// propositions de l'aperçu, et enregistrement des décisions (accepter, plus tard) dans le profil.
import { isPerSide } from './sides';
import { list, update } from '../data/repo';
import type { AdaptKind, Level, ProgramDay, Program, ProgressionEvent, SetLog, WorkoutSession, PlannedExercise } from '../data/model';
import type { AdaptCancel, AdaptChange } from './adapt-accept';
import { buildCtx, isChargeable, type Ctx } from '../generator/context';
import { sortSameEchelon } from '../generator/safety';
import { classAllowed } from '../generator/reps';
import type { Fiche, GeneratorInput } from '../generator/types';
import type { EchelonInfo } from './engine';
import { painFrozen } from './adaptation';
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
      // Contrôle relecteur du 05/11/2026 (bloquant) : la classe D1-D4 filtre aussi les échelons de la progression et de l'étalonnage en
      // séance (`up` / `down`) : jamais de D3 en première séance pour un débutant, jamais de D4 hors garde-fou (classAllowed).
      materielOk:
        v.tags.length > 0 && v.tags.every((t) => ctx.available.has(t)) && !(ctx.specialiseForbidden && v.tags.includes('materiel_specialise')) &&
        classAllowed(fiche, v, ctx),
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
    noRaise: d.ctx.pregnant || ex.capped || symptomFrozen(d.sessions) || restricted || arrival?.kind === 'descente' || zoneFrozen(ex.movementId, d.ctx, others, d.sessions),
    up: restricted ? null : toPair(bestAt(vars, variant.echelon + 1, d.ctx.level)),
    down: restricted ? null : toPair(bestAt(vars, variant.echelon - 1)),
  };
}
const toPair = (v: ProgVariant | undefined) => (v ? { echelon: v.echelon, variantId: v.id } : null);

/** Zones portées par une fiche (lignes de sa case de sécurité). */
export const zonesOfFicheIn = (ctx: Pick<Ctx, 'fichesById'>) => (movementId: string): readonly string[] => Object.keys(ctx.fichesById.get(movementId)?.securite.zones ?? {});

/** adaptation-regles.md §5 [kine] : gel douleur par zone, toutes fiches comprises. */
function zoneFrozen(movementId: string, ctx: Pick<Ctx, 'fichesById'>, sets: readonly SetLog[], sessions: readonly WorkoutSession[]): boolean {
  const zonesOf = zonesOfFicheIn(ctx);
  return painFrozen({ movementId, zones: zonesOf(movementId), sets, sessions, zonesOfMovement: zonesOf });
}

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
  /** adaptation-regles.md §6 [kine] : une séance manquée depuis la dernière : aucune proposition de montée à l'ouverture. */
  missedSinceLast?: boolean;
  /**
   * Décision du chef de projet (06/11/2026) : vrai si l'intensité (ajout, répétitions, série) s'applique à cet exercice : la montée
   * d'échelon n'est alors pas proposée (elle passe après). Absent : comportement antérieur.
   */
  intensityFirst?: (ex: PlannedExercise) => boolean;
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
        // Réévaluation à l'ouverture (adaptation-regles.md §6 [kine]) : symptôme, douleur sur la zone, séance manquée.
        frozen: frozen || !!d.missedSinceLast || zoneFrozen(ex.movementId, ctx, d.sets, d.sessions),
        fallbackPlanned: ex.sets * (isPerSide(ex) ? 2 : 1),
        gentler: gentlerAlternative(ex.movementId, d.input),
        cfg,
      });
      results.set(ex.movementId, { exercise: ex, index, day: di, res });
    });
  });

  const items: ProposalItem[] = [];
  for (const [movementId, r] of results) {
    if (r.res.proposal?.kind === 'montee' && d.intensityFirst?.(r.exercise)) continue;
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

// ----- Acceptation en un appui des propositions d'adaptation (série, version plus dure, repos, décharge) -----
export interface AdaptCard {
  movementId: string;
  kind: AdaptKind;
  /** Nombre de séries visé (série), version visée (variante), repos visé en secondes (repos). Vérifiés de nouveau au moment d'appliquer. */
  sets?: number;
  variantId?: string;
  restSec?: number;
  /** Point 4 : fourchette de répétitions visée. */
  repsMin?: number;
  repsMax?: number;
}

async function recordEvents(evs: ProgressionEvent[]): Promise<void> {
  const p = await profileRow();
  if (!p || !evs.length) return;
  await update('profile', p.id, { progressionLog: [...(p.progressionLog ?? []), ...evs].slice(-MAX_EVENTS) });
}

/** « Accepter » : mémorisé avec l'exercice, le type et la date ; appliqué à la prochaine séance de cet exercice (applyAccepted). */
export async function acceptAdapt(c: AdaptCard, now: Date = new Date()): Promise<void> {
  const ev: ProgressionEvent = { type: 'adapt_accepte', kind: c.kind, movementId: c.movementId, at: now.toISOString() };
  if (c.sets !== undefined) ev.sets = c.sets;
  if (c.variantId !== undefined) ev.variantId = c.variantId;
  if (c.restSec !== undefined) ev.restSec = c.restSec;
  if (c.repsMin !== undefined) ev.repsMin = c.repsMin;
  if (c.repsMax !== undefined) ev.repsMax = c.repsMax;
  await recordEvents([ev]);
}

/** « Plus tard » : pas de nouvelle proposition de cet exercice avant la séance suivante. */
export async function laterAdapt(c: AdaptCard, now: Date = new Date()): Promise<void> {
  await recordEvents([{ type: 'adapt_plus_tard', kind: c.kind, movementId: c.movementId, at: now.toISOString() }]);
}

/** Enregistre ce que `applyAccepted` a appliqué (démarrage de la séance) et annulé (gel, programme changé). */
export async function recordAdaptResult(r: { applied: readonly AdaptChange[]; cancelled: readonly AdaptCancel[] }, now: Date = new Date()): Promise<void> {
  const at = now.toISOString();
  await recordEvents([
    ...r.applied.map((a): ProgressionEvent => ({ type: 'adapt_applique', kind: a.kind, movementId: a.movementId, at })),
    ...r.cancelled.map((a): ProgressionEvent => ({ type: 'adapt_annule', kind: a.kind, movementId: a.movementId, at, reason: a.reason })),
  ]);
}

/** Réponse à la proposition de niveau : l'appui de la personne est nécessaire (jamais de bascule seule). */
export async function answerLevel(accepted: boolean, now: Date = new Date()): Promise<void> {
  await recordEvent({ type: 'niveau', accepted, at: now.toISOString() });
  if (accepted) {
    const p = await profileRow();
    if (p) await update('profile', p.id, { level: 'intermediaire' });
  }
}
