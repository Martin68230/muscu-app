// Continuité entre les séances (F5) : « dernière fois », proposition de progression, douleur sur plusieurs séances.
// Fonctions pures sur les lignes déjà lues dans IndexedDB. La v1 PROPOSE (« Essaie 2,5 kg de plus »), n'impose rien.
// Règles : knowledge/generateur-v1.md §5.2 et §6.8, load-calibration.md règle 4 (double progression), V-PRIO (sécurité d'abord).
import type { EquipmentProfile, Injury, InjuryZone, PlannedExercise, SetLog, WorkoutSession } from '../data/model';
import { zoneLevel } from '../data/injury-rules';
import { ZONE_GENE } from '../data/labels';
import { nextCalibrationStep, painProposals, type PainProposal, type PainZone } from '../generator/calibration';
import { buildCtx } from '../generator/context';
import { resolveFiche } from '../generator/safety';
import type { Fiche, GeneratorInput } from '../generator/types';
import type { EngineContext } from './engine';
import { fmtKg, loadLessText, loadMoreText, PAIN_S1_TEXT, PROGRESSION_TEXT } from './messages';

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
  const mine = sets.filter((s) => isWork(s) && s.variantId === variantId && s.sessionId !== excludeSessionId).sort(byTime);
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
export type ProgressionReason = 'etalonnage' | 'douleur' | 'plafond' | 'grossesse' | 'maintien' | 'incomplet' | 'double_progression' | 'sommet' | 'baisse' | 'garder';
export interface Progression {
  action: 'etalonnage' | 'hausse' | 'baisse' | 'garder';
  loadKg: number | null;
  echelon: number | null;
  reason: ProgressionReason;
  /** Phrase à afficher ; la personne reste libre de ne pas la suivre. */
  text: string;
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
}

export function proposeProgression(i: ProgressionInput): Progression {
  const ex = i.exercise;
  const last = lastTime(i.sets, ex.variantId, i.excludeSessionId);
  const keep = (reason: ProgressionReason, text: string, loadKg = last?.loadKg ?? ex.startLoadKg): Progression => ({
    action: 'garder', loadKg, echelon: i.echelon ?? null, reason, text,
  });

  // Première fois : étalonnage (V-ETAL §5.1). La suite se règle série par série dans la séance (engine.completeSet).
  if (!last) return { action: 'etalonnage', loadKg: ex.startLoadKg, echelon: i.echelon ?? null, reason: 'etalonnage', text: PROGRESSION_TEXT.etalonnage };

  // V-PRIO : la sécurité l'emporte. Jamais de hausse après une douleur, sous plafond (R2, charge:legere), ni en grossesse.
  const movementSets = i.sets.filter((s) => isWork(s) && s.movementId === ex.movementId && s.sessionId !== i.excludeSessionId).sort(byTime);
  const lastMovementSession = movementSets.length ? movementSets[movementSets.length - 1].sessionId : null;
  if (lastMovementSession && movementSets.some((s) => s.sessionId === lastMovementSession && s.pain)) return keep('douleur', PROGRESSION_TEXT.douleur);
  if (i.pregnant) return keep('grossesse', PROGRESSION_TEXT.plafond);
  if (ex.capped) return keep('plafond', PROGRESSION_TEXT.plafond);
  if (ex.unit === 'sec') return keep('maintien', PROGRESSION_TEXT.maintien);

  const lastSets = last.lastSessionSets;
  // Séance incomplète (abandonnée) : pas de hausse (prudence).
  if (lastSets.length < ex.sets) return keep('incomplet', PROGRESSION_TEXT.garder);

  const cur = last.loadKg;
  const rirOk = (s: SetLog) => s.rir !== null && s.rir >= ex.rirTarget;
  // Double progression (load-calibration.md règle 4) : toutes les séries au haut de la fourchette, à la réserve visée.
  const allTop = lastSets.every((s) => s.reps !== null && s.reps >= ex.repsMax && rirOk(s));
  // Baisse (toujours permise) : une série sous le bas de la fourchette, ou 2 de réserve de moins que la cible.
  const tooHard = lastSets.find((s) => (s.reps !== null && s.reps < ex.repsMin) || (s.rir !== null && s.rir <= ex.rirTarget - 2));

  const loads = cur !== null ? availableLoadsFor(i.variantTags ?? [], i.equipment ?? { dumbbellWeightsKg: [], kettlebellWeightsKg: [], platesKg: [] }, cur) : [];

  if (tooHard && !allTop) {
    const step = nextCalibrationStep({
      rir: tooHard.rir ?? ex.rirTarget, reps: tooHard.reps ?? 0, repsMin: ex.repsMin, repsMax: ex.repsMax, rirTarget: ex.rirTarget,
      capped: true, pain: false, loadKg: cur, availableLoadsKg: loads, echelon: i.echelon, availableEchelons: i.availableEchelons,
    });
    if (step.action === 'baisse') {
      const text = step.loadKg !== null && cur !== null ? loadLessText(cur - step.loadKg) : 'Essaie une version plus facile.';
      return { action: 'baisse', loadKg: step.loadKg, echelon: step.echelon, reason: 'baisse', text };
    }
    return keep('garder', PROGRESSION_TEXT.garder);
  }

  if (allTop) {
    if (cur !== null) {
      const next = loads.filter((l) => l > cur).sort((a, b) => a - b)[0];
      if (next === undefined) return keep('sommet', PROGRESSION_TEXT.sommet);
      return { action: 'hausse', loadKg: next, echelon: null, reason: 'double_progression', text: loadMoreText(next - cur) };
    }
    // Poids du corps ou élastique : échelon supérieur (si son niveau et son matériel conviennent, filtré par l'appelant).
    const nextEch = (i.availableEchelons ?? []).filter((e) => e > (i.echelon ?? -Infinity)).sort((a, b) => a - b)[0];
    if (i.echelon !== undefined && nextEch !== undefined) {
      return { action: 'hausse', loadKg: null, echelon: nextEch, reason: 'double_progression', text: 'Essaie une version plus difficile.' };
    }
    return keep('sommet', PROGRESSION_TEXT.sommet);
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
  excludeSessionId?: string | null;
}): EngineContext {
  const done = new Set(p.sets.filter((s) => isWork(s) && s.sessionId !== p.excludeSessionId).map((s) => s.variantId));
  return {
    pregnant: p.pregnant,
    isCalibration: (ex) => !done.has(ex.variantId),
    availableLoadsKg: (ex, cur) => availableLoadsFor(p.tagsOfVariant?.(ex.variantId) ?? [], p.equipment, cur),
    availableEchelons: p.availableEchelons,
    echelonOf: p.echelonOf ? (ex) => p.echelonOf!(ex.variantId) : undefined,
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
