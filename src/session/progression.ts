// Progression par échelons (F6) : knowledge/progression-et-bilan-v1.md §1 (V-PROG-E*), §2 (V-ETAL-E*), §1.6 (maintiens).
// Fonctions PURES : mêmes données = mêmes propositions. Aucune écriture, aucune horloge cachée (`now` fourni).
// Toutes les valeurs chiffrées viennent de progression-config.ts (NON SOURCÉ / PROVISOIRE). La v1 PROPOSE, n'impose rien.
import type { Level, ProgressionEvent, SetLog, WorkoutSession } from '../data/model';
import { nextCalibrationStep } from '../generator/calibration';
import { ECHELON_TEXT } from './messages';
import { PROGRESSION, type ProgressionConfig } from './progression-config';

const LEVELS: readonly Level[] = ['debutant', 'intermediaire', 'avance'];
export const levelIndex = (l: Level): number => LEVELS.indexOf(l);
const DAY_MS = 24 * 3600 * 1000;
const WEEK_MS = 7 * DAY_MS;

const msOf = (iso: string | null | undefined): number => (iso ? Date.parse(iso) : NaN);
export const isWorkSet = (s: SetLog): boolean => !!s.completedAt && !s.isWarmup && !s.deletedAt;
const byTime = (a: SetLog, b: SetLog): number => msOf(a.completedAt) - msOf(b.completedAt);

/** Variante d'une fiche vue par la progression : `rank` = ordre de préférence à échelon égal (0 = la meilleure). */
export interface ProgVariant {
  id: string;
  nom: string;
  echelon: number;
  niveau: Level;
  /** Tout le matériel de la variante est dans le profil (V-MAT). */
  materielOk: boolean;
  rank: number;
}

// ---------------------------------------------------------------------------------------------
// Historique d'une fiche : séances valables (§1.1)
// ---------------------------------------------------------------------------------------------
export interface FicheSession {
  sessionId: string;
  at: number;
  status: WorkoutSession['status'];
  endReason: WorkoutSession['endReason'] | null;
  /** Échelon des séries faites (null si aucune série). */
  echelon: number | null;
  work: SetLog[];
  planned: number;
  calibration: boolean;
  pain: boolean;
  /** Séance valable : terminée, toutes les séries de travail prévues de la fiche faites, sans douleur, hors étalonnage (§1.1). */
  valid: boolean;
}

/** Séries prévues d'une fiche dans le plan d'une séance (chaque côté d'un exercice par côté compte pour une série). */
function plannedIn(row: WorkoutSession | undefined, movementId: string, fallback: number): number {
  const exs = row?.plan?.exercises.filter((e) => e.movementId === movementId) ?? [];
  if (!exs.length) return fallback;
  return exs.reduce((n, e) => n + e.sets * (e.unit === 'reps_par_cote' ? 2 : 1), 0);
}

/**
 * Séances (terminées ou non) qui concernent la fiche, de la plus ancienne à la plus récente. Une séance en cours est ignorée.
 * `fallbackPlanned` : séries prévues quand la séance n'a pas gardé son plan (anciennes données, tests).
 */
export function ficheSessions(
  movementId: string,
  sets: readonly SetLog[],
  sessions: readonly WorkoutSession[] | undefined,
  fallbackPlanned: number,
): FicheSession[] {
  const mine = sets.filter((s) => isWorkSet(s) && s.movementId === movementId);
  const bySession = new Map<string, SetLog[]>();
  for (const s of mine) bySession.set(s.sessionId, [...(bySession.get(s.sessionId) ?? []), s]);
  const rows = new Map((sessions ?? []).filter((x) => !x.deletedAt).map((x) => [x.id, x] as const));
  const ids = new Set(bySession.keys());
  for (const r of rows.values()) if (r.status !== 'en_cours' && r.plan?.exercises.some((e) => e.movementId === movementId)) ids.add(r.id);

  const out: FicheSession[] = [];
  for (const id of ids) {
    const row = rows.get(id);
    const status = row?.status ?? 'faite';
    if (status === 'en_cours') continue;
    const work = (bySession.get(id) ?? []).sort(byTime);
    const planned = plannedIn(row, movementId, fallbackPlanned);
    const at = [msOf(row?.startedAt), msOf(work[0]?.completedAt), msOf(row?.plannedDate)].find((n) => Number.isFinite(n)) ?? 0;
    const calibration = work.some((s) => !!s.isCalibration);
    const pain = work.some((s) => s.pain);
    const painFree = [...work].reverse().find((s) => !s.pain);
    out.push({
      sessionId: id,
      at,
      status,
      endReason: row?.endReason ?? null,
      echelon: painFree?.echelon ?? work[work.length - 1]?.echelon ?? null,
      work,
      planned,
      calibration,
      pain,
      valid: status === 'faite' && !calibration && !pain && work.length > 0 && work.length >= Math.max(planned, 1),
    });
  }
  return out.sort((a, b) => a.at - b.at);
}

const rirOf = (s: SetLog, cfg: ProgressionConfig): number | null => (s.rir === null || s.rir === undefined ? null : Math.min(s.rir, cfg.echelon.rirButtonMax));
const loOf = (s: SetLog, cfg: ProgressionConfig): number => s.targetRepsMin ?? cfg.echelon.defaultRepsMin;
const hiOf = (s: SetLog, cfg: ProgressionConfig): number => s.targetRepsMax ?? cfg.echelon.defaultRepsMax;
const rirTargetOf = (s: SetLog, cfg: ProgressionConfig): number => s.targetRir ?? cfg.echelon.defaultRirTarget;

/** §1.2 points 2 et 3 : toutes les séries à `reps >= hi` ET réserve saisie `>= targetRir` (les deux côtés d'un exercice par côté). */
export function isPerfect(f: FicheSession, cfg: ProgressionConfig = PROGRESSION): boolean {
  return f.work.length > 0 && f.work.every((s) => s.reps !== null && s.reps >= hiOf(s, cfg) && rirOf(s, cfg) !== null && rirOf(s, cfg)! >= rirTargetOf(s, cfg));
}

/** §1.3 : la séance est « trop dure » si, pour un côté au moins, la moitié ou plus des séries (arrondi vers le haut) est en échec. */
export function hardKinds(f: FicheSession, cfg: ProgressionConfig = PROGRESSION): { reps: boolean; rir: boolean } {
  const groups = new Map<string, SetLog[]>();
  for (const s of f.work) groups.set(s.side ?? '-', [...(groups.get(s.side ?? '-') ?? []), s]);
  const share = (g: SetLog[], low: (s: SetLog) => boolean) => g.filter(low).length >= Math.ceil(g.length * cfg.echelon.lowerShare);
  let reps = false;
  let rir = false;
  for (const g of groups.values()) {
    if (share(g, (s) => s.reps !== null && s.reps < loOf(s, cfg))) reps = true;
    if (share(g, (s) => rirOf(s, cfg) !== null && rirOf(s, cfg)! <= rirTargetOf(s, cfg) - cfg.echelon.lowerRirMargin)) rir = true;
  }
  return { reps, rir };
}

/** Longueur de la suite de séances qui satisfont `ok`, en partant de la plus récente (`newestFirst`). */
function run(newestFirst: readonly FicheSession[], ok: (f: FicheSession) => boolean): number {
  let n = 0;
  for (const f of newestFirst) {
    if (!ok(f)) break;
    n++;
  }
  return n;
}

/** V-PROG-E11 : échelons déjà quittés par une descente (échelon plus bas fait après un échelon plus haut, séance ou même séance). */
export function quittedEchelons(movementId: string, sets: readonly SetLog[]): Set<number> {
  const out = new Set<number>();
  let prev: number | null = null;
  for (const s of sets.filter((x) => isWorkSet(x) && x.movementId === movementId && x.echelon !== null && x.echelon !== undefined && !x.pain).sort(byTime)) {
    const e = s.echelon as number;
    if (prev !== null && e < prev) out.add(prev);
    prev = e;
  }
  return out;
}

/** Montée ou descente acceptée mais pas encore faite (aucune série de la fiche depuis) : la prochaine séance est une séance d'arrivée (V-ETAL-E7). */
export function pendingArrival(events: readonly ProgressionEvent[] | undefined, movementId: string, sets: readonly SetLog[]): { kind: 'montee' | 'descente'; from: number; to: number; variantId: string } | null {
  const mine = (events ?? []).filter((e): e is Extract<ProgressionEvent, { type: 'montee' | 'descente' }> => (e.type === 'montee' || e.type === 'descente') && e.movementId === movementId);
  const last = mine.sort((a, b) => msOf(a.at) - msOf(b.at))[mine.length - 1];
  if (!last) return null;
  if ((events ?? []).some((e) => e.type === 'annule' && e.movementId === movementId && msOf(e.at) >= msOf(last.at))) return null;
  const since = sets.some((s) => isWorkSet(s) && s.movementId === movementId && msOf(s.completedAt) > msOf(last.at));
  return since ? null : { kind: last.type, from: last.from, to: last.to, variantId: last.variantId };
}

/** kine 23/10 (§1.5) : la dernière séance terminée s'est arrêtée sur un symptôme : aucune montée, de quelque type que ce soit. */
export function symptomFrozen(sessions: readonly WorkoutSession[]): boolean {
  const finished = sessions.filter((s) => !s.deletedAt && (s.status === 'faite' || s.status === 'sautee') && s.endedAt).sort((a, b) => msOf(a.endedAt) - msOf(b.endedAt));
  return finished[finished.length - 1]?.endReason === 'symptome';
}

// ---------------------------------------------------------------------------------------------
// Proposition d'échelon (montée §1.2, descente §1.3)
// ---------------------------------------------------------------------------------------------
export interface EchelonInput {
  movementId: string;
  /** Échelon courant de la fiche (celui du programme). */
  echelon: number;
  sets: readonly SetLog[];
  sessions?: readonly WorkoutSession[];
  events?: readonly ProgressionEvent[];
  variants: readonly ProgVariant[];
  level: Level;
  /** Grossesse / post-partum : aucune montée (V-PROG-E8). */
  pregnant: boolean;
  /** Fiche `capped` : aucune montée (V-PROG-E8). */
  capped: boolean;
  /** Exercice adapté par une case de sécurité (amplitude, appui…) : le moteur ne propose aucun changement d'échelon (prudence). */
  restricted?: boolean;
  /** Gel après symptôme (symptomFrozen). */
  frozen?: boolean;
  /** Séries prévues par séance quand la séance n'a pas gardé son plan. */
  fallbackPlanned?: number;
  /** Version plus douce de la fiche (gentlerAlternative), pour le texte de l'échelon 1. */
  gentler?: { nom: string } | null;
  cfg?: ProgressionConfig;
}

export type EchelonProposal =
  | { kind: 'montee' | 'descente'; movementId: string; from: number; to: number; variantId: string; variantNom: string; title: string; text: string }
  | { kind: 'plancher'; movementId: string; text: string };

export interface EchelonResult {
  proposal: EchelonProposal | null;
  /** Conditions 1 à 3 de §1.2 remplies, `e+1` existe avec le matériel, mais son niveau dépasse celui de la personne (V-PROG-E6). */
  readyBlockedByLevel: boolean;
}

const bestAt = (variants: readonly ProgVariant[], echelon: number, level?: Level): ProgVariant | undefined =>
  variants
    .filter((v) => v.echelon === echelon && v.materielOk && (level === undefined || levelIndex(v.niveau) <= levelIndex(level)))
    .sort((a, b) => a.rank - b.rank)[0];

export function evaluateEchelon(i: EchelonInput): EchelonResult {
  const cfg = i.cfg ?? PROGRESSION;
  const e = i.echelon;
  const infos = ficheSessions(i.movementId, i.sets, i.sessions, i.fallbackPlanned ?? 0);
  const newest = [...infos].reverse();
  const events = i.events ?? [];
  const none: EchelonResult = { proposal: null, readyBlockedByLevel: false };

  // ----- Descente (§1.3) : toujours permise, même `capped`, grossesse, gel -----
  const hardRun = (kind: 'reps' | 'rir') => run(newest, (f) => f.status === 'faite' && !f.calibration && !f.pain && f.work.length > 0 && f.echelon === e && hardKinds(f, cfg)[kind]);
  if (hardRun('reps') >= cfg.echelon.validSessionsToLower || hardRun('rir') >= cfg.echelon.validSessionsToLower) {
    const refused = lastRefusal(events, i.movementId, 'descente', e);
    if (refused && infos.filter((f) => f.at > msOf(refused.at) && f.status === 'faite' && !f.calibration).length < cfg.echelon.validSessionsAfterRefusal) return none;
    const lower = i.restricted ? undefined : bestAt(i.variants, e - 1);
    if (lower) {
      return {
        proposal: { kind: 'descente', movementId: i.movementId, from: e, to: e - 1, variantId: lower.id, variantNom: lower.nom, title: ECHELON_TEXT.downTitle(lower.nom), text: ECHELON_TEXT.downBody },
        readyBlockedByLevel: false,
      };
    }
    return { proposal: { kind: 'plancher', movementId: i.movementId, text: i.gentler ? ECHELON_TEXT.floorGentler : ECHELON_TEXT.floorKeep }, readyBlockedByLevel: false };
  }

  // ----- Montée (§1.2) -----
  if (i.pregnant || i.capped || i.frozen || i.restricted) return none; // V-PROG-E8
  const quitted = quittedEchelons(i.movementId, i.sets);
  const required = quitted.has(e + 1) ? cfg.echelon.validSessionsToRaiseAfterDescent : cfg.echelon.validSessionsToRaise; // V-PROG-E11
  const ready = run(newest, (f) => f.valid && f.echelon === e && isPerfect(f, cfg)) >= required;
  if (!ready) return none;
  const hasUp = i.variants.some((v) => v.echelon === e + 1 && v.materielOk);
  const target = bestAt(i.variants, e + 1, i.level);
  if (!target) return { proposal: null, readyBlockedByLevel: hasUp };
  const refused = lastRefusal(events, i.movementId, 'montee', e);
  if (refused && infos.filter((f) => f.at > msOf(refused.at) && f.valid).length < cfg.echelon.validSessionsAfterRefusal) return none;
  return {
    proposal: { kind: 'montee', movementId: i.movementId, from: e, to: e + 1, variantId: target.id, variantNom: target.nom, title: ECHELON_TEXT.upTitle(target.nom), text: ECHELON_TEXT.upBody },
    readyBlockedByLevel: false,
  };
}

function lastRefusal(events: readonly ProgressionEvent[], movementId: string, kind: 'montee' | 'descente', from: number): Extract<ProgressionEvent, { type: 'refus' }> | undefined {
  const r = events.filter((x): x is Extract<ProgressionEvent, { type: 'refus' }> => x.type === 'refus' && x.movementId === movementId && x.kind === kind && x.from === from);
  return r.sort((a, b) => msOf(a.at) - msOf(b.at))[r.length - 1];
}

// ---------------------------------------------------------------------------------------------
// Passage de niveau (V-PROG-E6 / E7) : une proposition pour tout le profil, débutant vers intermédiaire seulement
// ---------------------------------------------------------------------------------------------
export interface LevelInput {
  level: Level;
  pregnant: boolean;
  /** Fiches dont les conditions 1 à 3 sont remplies à leur échelon maximal permis (EchelonResult.readyBlockedByLevel). */
  readyFiches: number;
  firstSessionAt: number | null;
  now: number;
  /** Dernière douleur ou dernier symptôme (ms), ou null. */
  lastIncidentAt: number | null;
  /** Une zone au niveau 2 ou 3 dans le profil blessures. */
  zoneLevel2Plus: boolean;
  frozen: boolean;
  events?: readonly ProgressionEvent[];
  cfg?: ProgressionConfig;
}
export interface LevelProposal {
  from: Level;
  to: Level;
  text: string;
  note: string;
}

export function proposeLevel(i: LevelInput): LevelProposal | null {
  const cfg = i.cfg ?? PROGRESSION;
  if (i.level !== 'debutant') return null; // jamais « avancé » proposé par l'app (kine 23/10)
  if (i.pregnant || i.zoneLevel2Plus || i.frozen) return null;
  if (i.readyFiches < cfg.level.minFiches) return null;
  if (i.firstSessionAt === null || i.now - i.firstSessionAt < cfg.level.minWeeksFollowed * WEEK_MS) return null;
  if (i.lastIncidentAt !== null && i.now - i.lastIncidentAt < cfg.level.quietWeeks * WEEK_MS) return null;
  const recent = (i.events ?? []).some((e) => e.type === 'niveau' && i.now - msOf(e.at) < cfg.level.blockWeeks * WEEK_MS);
  if (recent) return null;
  return { from: 'debutant', to: 'intermediaire', text: ECHELON_TEXT.levelBody, note: ECHELON_TEXT.levelNote };
}

/** Dernière douleur ou dernier symptôme, en ms (pour proposeLevel). */
export function lastIncident(sets: readonly SetLog[], sessions: readonly WorkoutSession[]): number | null {
  const t = [
    ...sets.filter((s) => s.pain && s.completedAt).map((s) => msOf(s.completedAt)),
    ...sessions.filter((s) => s.endReason === 'symptome' && !s.deletedAt).map((s) => msOf(s.endedAt ?? s.startedAt)),
  ].filter((n) => Number.isFinite(n));
  return t.length ? Math.max(...t) : null;
}

/** Première séance terminée (ms), ou null. */
export function firstFinishedAt(sessions: readonly WorkoutSession[]): number | null {
  const t = sessions.filter((s) => s.status === 'faite' && !s.deletedAt).map((s) => msOf(s.startedAt ?? s.plannedDate)).filter((n) => Number.isFinite(n));
  return t.length ? Math.min(...t) : null;
}

// ---------------------------------------------------------------------------------------------
// Étalonnage d'un exercice sans charge (§2)
// ---------------------------------------------------------------------------------------------
export interface EchelonCalInput {
  reps: number;
  rir: number;
  repsMin: number;
  repsMax: number;
  rirTarget: number;
  echelon: number;
  /** Échelon `e+1` permis (niveau, matériel) avec sa variante, ou null. */
  up: { echelon: number; variantId: string } | null;
  /** Échelon `e-1` avec sa variante, ou null. */
  down: { echelon: number; variantId: string } | null;
  /** false = aucune montée (capped, grossesse, plafond atteint, symptôme, retour de gêne, déjà un changement). */
  canRaise: boolean;
}
export interface EchelonCalStep {
  action: 'hausse' | 'baisse' | 'garder';
  echelon: number;
  variantId: string | null;
}

/** §2 point 2 : mêmes seuils que `nextCalibrationStep` ; au plus un échelon, jamais de saut (V-ETAL-E (a)(b)). */
export function echelonCalibrationStep(i: EchelonCalInput): EchelonCalStep {
  const avail = [i.down?.echelon, i.echelon, i.up?.echelon].filter((n): n is number => n !== undefined);
  const s = nextCalibrationStep({
    rir: i.rir, reps: i.reps, repsMin: i.repsMin, repsMax: i.repsMax, rirTarget: i.rirTarget,
    capped: !i.canRaise, pain: false, loadKg: null, availableLoadsKg: [], echelon: i.echelon, availableEchelons: avail,
  });
  if (s.action === 'hausse' && s.echelon === i.echelon + 1 && i.up) return { action: 'hausse', echelon: i.up.echelon, variantId: i.up.variantId };
  if (s.action === 'baisse' && s.echelon === i.echelon - 1 && i.down) return { action: 'baisse', echelon: i.down.echelon, variantId: i.down.variantId };
  return { action: 'garder', echelon: i.echelon, variantId: null };
}

/**
 * V-PROG-E10 : après tout changement d'échelon (montée, descente, quelle qu'en soit la raison), la répétition suggérée est le BAS de la
 * fourchette. Sinon : la dernière série sans douleur à cet échelon. `null` = pas d'historique, le bas de la fourchette s'applique aussi.
 */
export function startRepsFor(movementId: string, echelon: number, sets: readonly SetLog[], excludeSessionId?: string | null): number | null {
  const mine = sets.filter((s) => isWorkSet(s) && s.movementId === movementId && s.sessionId !== excludeSessionId && s.echelon !== null && s.echelon !== undefined).sort(byTime);
  if (!mine.length) return null;
  const lastEchelon = mine[mine.length - 1].echelon;
  if (lastEchelon !== echelon) return null;
  const painFree = [...mine].reverse().find((s) => !s.pain && s.echelon === echelon);
  return painFree?.reps ?? null;
}

// ---------------------------------------------------------------------------------------------
// Maintiens (§1.6) : figés en v1 (config.hold.enabled = false), codés pour le jour où `coach`/`kine`/`relecteur` valident
// ---------------------------------------------------------------------------------------------
/** Durée de départ d'un maintien : en grossesse ou post-partum, toujours le départ débutant (kine 23/10). */
export function holdStartSec(schema: string, beginner: boolean, pregnant: boolean, cfg: ProgressionConfig = PROGRESSION): number | null {
  const row = cfg.hold.perSchema[schema];
  if (!row) return null;
  return beginner || pregnant ? row.startBeginnerSec : row.startOtherSec;
}

export interface HoldInput {
  movementId: string;
  schema: string;
  /** Durée cible actuelle (secondes). */
  holdSec: number;
  sets: readonly SetLog[];
  sessions?: readonly WorkoutSession[];
  pregnant: boolean;
  capped: boolean;
  frozen?: boolean;
  fallbackPlanned?: number;
  cfg?: ProgressionConfig;
}
/** Nouvelle durée proposée, ou null. Les deux côtés doivent avoir tenu ; douleur, gel, `capped`, grossesse : durée figée. */
export function proposeHold(i: HoldInput): number | null {
  const cfg = i.cfg ?? PROGRESSION;
  if (!cfg.hold.enabled || i.pregnant || i.capped || i.frozen) return null;
  const row = cfg.hold.perSchema[i.schema];
  if (!row || i.holdSec >= row.capSec) return null;
  const newest = ficheSessions(i.movementId, i.sets, i.sessions, i.fallbackPlanned ?? 0).reverse();
  const ok = (f: FicheSession) => f.valid && f.work.every((s) => (s.holdSec ?? 0) >= i.holdSec);
  if (run(newest, ok) < cfg.hold.validSessionsToRaise) return null;
  return Math.min(row.capSec, i.holdSec + row.stepSec);
}
