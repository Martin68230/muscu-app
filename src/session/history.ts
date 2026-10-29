// Continuité entre les séances (F5) : « dernière fois », proposition de progression, douleur sur plusieurs séances.
// Fonctions pures sur les lignes déjà lues dans IndexedDB. La v1 PROPOSE (« Essaie 2,5 kg de plus »), n'impose rien.
// Règles : knowledge/generateur-v1.md §5.2 et §6.8, load-calibration.md règle 4 (double progression), V-PRIO (sécurité d'abord).
import type { EquipmentProfile, Injury, InjuryZone, Level, PlannedExercise, ProgressionEvent, SetLog, WorkoutSession } from '../data/model';
import { zoneLevel } from '../data/injury-rules';
import { ZONE_GENE } from '../data/labels';
import { nextCalibrationStep, painProposals, type PainProposal, type PainZone } from '../generator/calibration';
import { buildCtx } from '../generator/context';
import { resolveFiche } from '../generator/safety';
import type { Fiche, GeneratorInput } from '../generator/types';
import type { EchelonInfo, EngineContext } from './engine';
import { ECHELON_TEXT, fmtKg, loadLessText, loadMoreText, PAIN_S1_TEXT, PROGRESSION_TEXT } from './messages';
import { evaluateEchelon, proposeHold, type EchelonProposal, type ProgVariant } from './progression';
import type { ProgressionConfig } from './progression-config';

/** Pas de charge quand aucun palier réel n'est connu (barre sans disques déclarés, machine, sac à dos…). Valeur prudente, NON SOURCÉ. */
export const DEFAULT_LOAD_STEP_KG = 1;

const isWork = (s: SetLog): boolean => !!s.completedAt && !s.isWarmup;
const byTime = (a: SetLog, b: SetLog): number => (a.completedAt! < b.completedAt! ? -1 : a.completedAt! > b.completedAt! ? 1 : 0);

// ----- « Dernière fois » -----
export interface LastTime {
  variantId: string;
  /** Date ISO de la dernière série sans douleur. */
  date: string;
  /** Dernière charge faite sans douleur (null = poids du corps). */
  loadKg: number | null;
  reps: number | null;
  rir: number | null;
  /** Séries de la dernière séance qui contient cette variante. */
  lastSessionSets: SetLog[];
  /** La dernière séance de cette variante comporte une douleur. */
  lastSessionPain: boolean;
}

export function lastTime(sets: readonly SetLog[], variantId: string, excludeSessionId?: string | null): LastTime | null {
  return lastTimeFromSets(sets.filter((s) => isWork(s) && s.variantId === variantId && s.sessionId !== excludeSessionId).sort(byTime), variantId);
}

function lastTimeFromSets(mine: SetLog[], variantId: string): LastTime | null {
  if (!mine.length) return null;
  const painFree = [...mine].reverse().find((s) => !s.pain);
  const lastSession = mine[mine.length - 1].sessionId;
  const lastSessionSets = mine.filter((s) => s.sessionId === lastSession);
  const base = { variantId, lastSessionSets, lastSessionPain: lastSessionSets.some((s) => s.pain) };
  if (!painFree) return { ...base, date: mine[mine.length - 1].completedAt!, loadKg: null, reps: null, rir: null };
  return { ...base, date: painFree.completedAt!, loadKg: painFree.loadKg, reps: painFree.reps, rir: painFree.rir };
}

// ----- Charges disponibles -----
/** Paliers réels : haltères et kettlebell du profil ; disques (2 x le plus petit) ; sinon pas de 1 kg autour de la charge actuelle. */
export function availableLoadsFor(tags: readonly string[], eq: Pick<EquipmentProfile, 'dumbbellWeightsKg' | 'kettlebellWeightsKg' | 'platesKg'>, currentKg: number | null): number[] {
  const sorted = (a: readonly number[] | undefined) => [...(a ?? [])].filter((n) => n > 0).sort((x, y) => x - y);
  if (tags.includes('halteres') && eq.dumbbellWeightsKg.length) return sorted(eq.dumbbellWeightsKg);
  if (tags.includes('kettlebell') && eq.kettlebellWeightsKg.length) return sorted(eq.kettlebellWeightsKg);
  if (currentKg === null) return [];
  const plates = sorted(eq.platesKg);
  const step = tags.some((t) => t === 'barre' || t === 'barre_ez' || t === 'disques') && plates.length ? 2 * plates[0] : DEFAULT_LOAD_STEP_KG;
  return [currentKg - step, currentKg, currentKg + step].filter((n) => n > 0);
}

// ----- Proposition de progression -----
export type ProgressionReason = 'etalonnage' | 'douleur' | 'plafond' | 'grossesse' | 'maintien' | 'incomplet' | 'double_progression' | 'sommet' | 'baisse' | 'garder' | 'symptome' | 'echelon' | 'reprise';
export interface Progression {
  action: 'etalonnage' | 'hausse' | 'baisse' | 'garder';
  loadKg: number | null;
  echelon: number | null;
  reason: ProgressionReason;
  /** Phrase à afficher ; la personne reste libre de ne pas la suivre. */
  text: string;
  /** F6 : proposition d'échelon (montée, descente, plancher) pour un exercice sans charge. */
  echelonProposal?: EchelonProposal;
  /** F6 : durée de maintien proposée (secondes), seulement si les paliers de maintien sont activés (figés en v1). */
  holdSec?: number | null;
}

/** F6 : exercice sans charge à échelons (poids du corps, élastique) : la clé de suivi est (fiche, échelon), pas la variante. */
export interface BodyweightProgression {
  variants: ProgVariant[];
  level: Level;
  events?: readonly ProgressionEvent[];
  gentler?: { nom: string } | null;
  /** Exercice adapté par une case de sécurité : aucun changement d'échelon. */
  restricted?: boolean;
  /** Séance d'arrivée (montée ou descente acceptée) : étalonnage. */
  arrival?: boolean;
}

export interface ProgressionInput {
  exercise: PlannedExercise;
  /** Toutes les séries enregistrées (le filtre par variante est fait ici). */
  sets: readonly SetLog[];
  pregnant: boolean;
  /** Tags de la variante (pour les paliers) et matériel de la personne. */
  variantTags?: readonly string[];
  equipment?: Pick<EquipmentProfile, 'dumbbellWeightsKg' | 'kettlebellWeightsKg' | 'platesKg'>;
  /** Échelon de la variante et échelons possibles (poids du corps) : niveau de la personne et matériel déjà filtrés par l'appelant. */
  echelon?: number;
  availableEchelons?: number[];
  /** Séance en cours à ignorer. */
  excludeSessionId?: string | null;
  /** F6 : séances (statut, plan) pour la définition de « séance valable » (§1.1). Absent : toutes les séries comptent comme d'une séance terminée. */
  sessions?: readonly WorkoutSession[];
  /** F6 : la dernière séance terminée s'est arrêtée sur un symptôme : aucune hausse (§1.5). */
  frozenBySymptom?: boolean;
  /** F6 : exercice sans charge à échelons. */
  bodyweight?: BodyweightProgression;
  /** F6 : schéma de la fiche (maintiens). */
  holdSchema?: string;
  cfg?: ProgressionConfig;
  /** V-PROG-E8 « reprise douce active » (seance-manquee-v1.md SM-13) : aucune proposition de montée ; les baisses restent permises. */
  repriseActive?: boolean;
}

/** Séries de la fiche pour un échelon donné (poids du corps) : même difficulté, quelle que soit la variante. */
export function lastTimeEchelon(sets: readonly SetLog[], movementId: string, echelon: number, excludeSessionId?: string | null): LastTime | null {
  const mine = sets.filter((s) => isWork(s) && s.movementId === movementId && s.echelon === echelon && s.sessionId !== excludeSessionId).sort(byTime);
  return lastTimeFromSets(mine, mine[mine.length - 1]?.variantId ?? '');
}

const plannedFor = (row: WorkoutSession | undefined, movementId: string, fallback: number): number =>
  (row?.plan ? row.plan.exercises.filter((e) => e.movementId === movementId).reduce((n, e) => n + e.sets * (e.unit === 'reps_par_cote' ? 2 : 1), 0) : 0) || fallback;

export function proposeProgression(i: ProgressionInput): Progression {
  const ex = i.exercise;
  const bw = i.bodyweight;
  const last = bw && i.echelon !== undefined ? lastTimeEchelon(i.sets, ex.movementId, i.echelon, i.excludeSessionId) : lastTime(i.sets, ex.variantId, i.excludeSessionId);
  const keep = (reason: ProgressionReason, text: string, loadKg = last?.loadKg ?? ex.startLoadKg): Progression => ({
    action: 'garder', loadKg, echelon: i.echelon ?? null, reason, text,
  });

  // Première fois (ou séance d'arrivée à un nouvel échelon) : étalonnage (V-ETAL §5.1, V-ETAL-E7). La suite se règle série par série (engine.completeSet).
  if (!last || bw?.arrival) {
    return { action: 'etalonnage', loadKg: ex.startLoadKg, echelon: i.echelon ?? null, reason: 'etalonnage', text: bw?.arrival ? ECHELON_TEXT.arrival : PROGRESSION_TEXT.etalonnage };
  }

  const movementSets = i.sets.filter((s) => isWork(s) && s.movementId === ex.movementId && s.sessionId !== i.excludeSessionId).sort(byTime);
  const lastMovementSession = movementSets.length ? movementSets[movementSets.length - 1].sessionId : null;
  const painLast = !!lastMovementSession && movementSets.some((s) => s.sessionId === lastMovementSession && s.pain);
  const fallbackPlanned = ex.sets * (ex.unit === 'reps_par_cote' ? 2 : 1);

  // ----- Exercice sans charge à échelons : montée et descente par échelon (progression.ts) -----
  if (bw && i.echelon !== undefined && ex.unit !== 'sec') {
    const res = evaluateEchelon({
      movementId: ex.movementId, echelon: i.echelon, sets: i.sets.filter((s) => s.sessionId !== i.excludeSessionId), sessions: i.sessions,
      events: bw.events, variants: bw.variants, level: bw.level, pregnant: i.pregnant, capped: ex.capped, restricted: bw.restricted,
      frozen: i.frozenBySymptom, fallbackPlanned, gentler: bw.gentler, cfg: i.cfg,
    });
    const p = res.proposal;
    if (p?.kind === 'montee' && !i.repriseActive) return { action: 'hausse', loadKg: null, echelon: p.to, reason: 'echelon', text: p.title, echelonProposal: p };
    if (p?.kind === 'descente') return { action: 'baisse', loadKg: null, echelon: p.to, reason: 'echelon', text: p.title, echelonProposal: p };
    if (p?.kind === 'plancher') return { ...keep('baisse', p.text), echelonProposal: p };
    if (i.repriseActive) return keep('reprise', '');
    if (painLast) return keep('douleur', PROGRESSION_TEXT.douleur);
    if (i.pregnant || ex.capped) return keep(i.pregnant ? 'grossesse' : 'plafond', PROGRESSION_TEXT.plafond);
    if (i.frozenBySymptom) return keep('symptome', PROGRESSION_TEXT.symptome);
    return keep('garder', PROGRESSION_TEXT.plusDeReps);
  }

  // ----- Exercice à charge -----
  const lastSets = last.lastSessionSets;
  const cur = last.loadKg;
  const loads = cur !== null ? availableLoadsFor(i.variantTags ?? [], i.equipment ?? { dumbbellWeightsKg: [], kettlebellWeightsKg: [], platesKg: [] }, cur) : [];
  const painFreeSets = lastSets.filter((s) => !s.pain);

  // Baisse (toujours permise, même `capped`, en grossesse ou après une douleur : §1.3, §7 point 4) : une série sans douleur sous le bas
  // de la fourchette, ou 2 de réserve de moins que la cible.
  const tooHard = painFreeSets.find((s) => (s.reps !== null && s.reps < ex.repsMin) || (s.rir !== null && s.rir <= ex.rirTarget - 2));
  if (tooHard && ex.unit !== 'sec' && cur !== null) {
    const step = nextCalibrationStep({
      rir: tooHard.rir ?? ex.rirTarget, reps: tooHard.reps ?? 0, repsMin: ex.repsMin, repsMax: ex.repsMax, rirTarget: ex.rirTarget,
      capped: true, pain: false, loadKg: cur, availableLoadsKg: loads, echelon: i.echelon, availableEchelons: i.availableEchelons,
    });
    if (step.action === 'baisse' && step.loadKg !== null) return { action: 'baisse', loadKg: step.loadKg, echelon: step.echelon, reason: 'baisse', text: loadLessText(cur - step.loadKg) };
  }

  if (i.repriseActive) return keep('reprise', ''); // aucun texte inventé : la ligne de progression n'est pas affichée
  // V-PRIO : la sécurité l'emporte. Jamais de hausse après une douleur, après un symptôme, sous plafond (R2, charge:legere), ni en grossesse.
  if (painLast) return keep('douleur', PROGRESSION_TEXT.douleur);
  if (i.frozenBySymptom) return keep('symptome', PROGRESSION_TEXT.symptome);
  if (i.pregnant) return keep('grossesse', PROGRESSION_TEXT.plafond);
  if (ex.capped) return keep('plafond', PROGRESSION_TEXT.plafond);
  if (ex.unit === 'sec') {
    const hold =
      i.holdSchema && ex.holdSec !== null
        ? proposeHold({ movementId: ex.movementId, schema: i.holdSchema, holdSec: ex.holdSec, sets: i.sets, sessions: i.sessions, pregnant: i.pregnant, capped: ex.capped, frozen: i.frozenBySymptom, fallbackPlanned, cfg: i.cfg })
        : null;
    return hold !== null ? { ...keep('maintien', `Essaie ${hold} secondes.`), holdSec: hold } : keep('maintien', PROGRESSION_TEXT.maintien);
  }

  // Séance valable (§1.1, §7 point 8) : terminée, toutes les séries PRÉVUES de cette séance-là faites (et non celles du plan actuel), hors étalonnage.
  const row = i.sessions?.find((s) => s.id === lastSets[0]?.sessionId);
  if ((row && row.status !== 'faite') || lastSets.length < plannedFor(row, ex.movementId, fallbackPlanned)) return keep('incomplet', PROGRESSION_TEXT.garder);
  if (lastSets.some((s) => s.isCalibration)) return keep('garder', PROGRESSION_TEXT.garder);

  const rirOk = (s: SetLog) => s.rir !== null && s.rir >= ex.rirTarget;
  // Double progression (load-calibration.md règle 4) : toutes les séries au haut de la fourchette, à la réserve visée.
  const allTop = lastSets.every((s) => s.reps !== null && s.reps >= ex.repsMax && rirOk(s));
  if (allTop) {
    if (cur === null) return keep('sommet', PROGRESSION_TEXT.sommet);
    const next = loads.filter((l) => l > cur).sort((a, b) => a - b)[0];
    if (next === undefined) return keep('sommet', PROGRESSION_TEXT.sommet);
    return { action: 'hausse', loadKg: next, echelon: null, reason: 'double_progression', text: loadMoreText(next - cur) };
  }
  return keep('garder', PROGRESSION_TEXT.plusDeReps);
}

/** Contexte du lecteur de séance : étalonnage = aucune série de travail faite pour cette variante ; paliers réels du profil. */
export function buildEngineContext(p: {
  sets: readonly SetLog[];
  equipment: Pick<EquipmentProfile, 'dumbbellWeightsKg' | 'kettlebellWeightsKg' | 'platesKg'>;
  pregnant: boolean;
  /** variantId -> tags, pour les paliers. Variante inconnue : pas de 1 kg. */
  tagsOfVariant?: (variantId: string) => readonly string[];
  echelonOf?: (variantId: string) => number | undefined;
  availableEchelons?: (ex: PlannedExercise) => number[];
  /** F6 : étalonnage des échelons pour les exercices sans charge (progression-store.echelonInfoFor). */
  echelonInfo?: (ex: PlannedExercise) => EchelonInfo | null;
  excludeSessionId?: string | null;
}): EngineContext {
  const done = new Set(p.sets.filter((s) => isWork(s) && s.sessionId !== p.excludeSessionId).map((s) => s.variantId));
  return {
    pregnant: p.pregnant,
    isCalibration: (ex) => !done.has(ex.variantId),
    availableLoadsKg: (ex, cur) => availableLoadsFor(p.tagsOfVariant?.(ex.variantId) ?? [], p.equipment, cur),
    availableEchelons: p.availableEchelons,
    echelonOf: p.echelonOf ? (ex) => p.echelonOf!(ex.variantId) : undefined,
    echelonInfo: p.echelonInfo,
  };
}

// ----- Douleur sur plusieurs séances -----
/**
 * Zones douloureuses de chaque séance terminée, de la plus ancienne à la plus récente (entrée de `painProposals`).
 * Une séance sans aucune série de travail enregistrée est ignorée (rien à comparer).
 */
export function painSessions(sets: readonly SetLog[], sessions: readonly WorkoutSession[]): PainZone[][] {
  const finished = sessions
    .filter((s) => (s.status === 'faite' || s.status === 'sautee') && s.endedAt)
    .sort((a, b) => ((a.startedAt ?? a.plannedDate) < (b.startedAt ?? b.plannedDate) ? -1 : 1));
  const out: PainZone[][] = [];
  for (const s of finished) {
    const mine = sets.filter((x) => x.sessionId === s.id && isWork(x));
    if (!mine.length) continue;
    out.push([...new Set(mine.filter((x) => x.pain).map((x): PainZone => x.painZone ?? 'inconnu'))]);
  }
  return out;
}

export interface PainCheck {
  /** Propositions : jamais appliquées sans confirmation de la personne. */
  proposals: (PainProposal & { text: string })[];
  /** Zone « je ne sais pas » deux séances de suite : signe S1 (« consulte si ça persiste »). */
  s1Text: string | null;
}

export function painCheck(sets: readonly SetLog[], sessions: readonly WorkoutSession[], injuries: readonly Injury[]): PainCheck {
  const levels: Partial<Record<InjuryZone, number>> = {};
  (['cou', 'epaule', 'coude', 'poignet', 'dos', 'hanche', 'genou', 'cheville', 'cuisse', 'aine'] as InjuryZone[]).forEach((z) => {
    levels[z] = zoneLevel(injuries, z);
  });
  const { proposals, s1Message } = painProposals(painSessions(sets, sessions), levels);
  return {
    proposals: proposals.map((p) => ({
      ...p,
      text: `Tu as eu mal ${ZONE_GENE[p.zone]} deux séances de suite. Veux-tu passer cette zone au niveau ${p.to} ? C’est toi qui décides.`,
    })),
    s1Text: s1Message ? PAIN_S1_TEXT : null,
  };
}

/**
 * Version plus douce de la fiche (champ `versionPlusDouce`), seulement si elle passe tous les filtres (matériel, niveau,
 * blessures, grossesse) ; sinon null : on garde la même variante sans hausse (§6.8 point 2 iii).
 */
export function gentlerAlternative(ficheId: string, input: GeneratorInput): { ficheId: string; nom: string; variantId: string } | null {
  const fiche: Fiche | undefined = input.fiches.find((f) => f.id === ficheId);
  const target = fiche?.securite.versionPlusDouce;
  if (!target) return null;
  const alt = input.fiches.find((f) => f.id === target);
  if (!alt) return null;
  const first = resolveFiche(alt, buildCtx(input)).candidates[0];
  return first ? { ficheId: alt.id, nom: alt.nom, variantId: first.variant.id } : null;
}

export { fmtKg };
