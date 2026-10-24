// Données du lecteur de séance : lues une fois au démarrage ou à la reprise (aucun réseau pendant la séance).
import { list } from '../../data/repo';
import type { EquipmentProfile, Injury, PlannedExercise, Profile, ProgressionEvent, SetLog, WorkoutSession } from '../../data/model';
import type { Fiche } from '../../data/fiches';
import { buildCtx, isChargeable, type Ctx } from '../../generator/context';
import type { Fiche as GenFiche, GeneratorInput } from '../../generator/types';
import type { EngineContext } from '../../session/engine';
import { buildEngineContext, gentlerAlternative, type BodyweightProgression } from '../../session/history';
import { loadGeneratorInput } from '../../session/program';
import { pendingArrival, startRepsFor, symptomFrozen } from '../../session/progression';
import { echelonInfoFor, progVariants } from '../../session/progression-store';

export interface PlayerData {
  fiches: Fiche[];
  sets: SetLog[];
  equipment: EquipmentProfile | null;
  injuries: Injury[];
  pregnant: boolean;
  ctx: EngineContext;
  /** F6 : séances, décisions de progression, gel après symptôme. */
  sessions: WorkoutSession[];
  events: ProgressionEvent[];
  frozen: boolean;
  /** Entrées du générateur (null si le profil n'est pas complet) : version plus douce, niveau. */
  input: GeneratorInput | null;
  /** F6 : répétitions à préremplir pour un exercice sans charge (le bas de la fourchette après tout changement d'échelon), ou null. */
  startReps(ex: PlannedExercise): number | null;
  /** F6 : informations de progression d'un exercice sans charge, ou undefined pour un exercice à charge. */
  bodyweightOf(ex: PlannedExercise): BodyweightProgression | undefined;
}

export const isPregnant = (p: Pick<Profile, 'pregnancy'> | null | undefined): boolean => p?.pregnancy === 'enceinte' || p?.pregnancy === 'post_partum';

/** Les fiches de l'écran et celles du générateur sont le même fichier JSON. */
export const asGenFiches = (f: Fiche[]): GenFiche[] => f as unknown as GenFiche[];

export async function loadPlayerData(fiches: Fiche[], profile: Profile, excludeSessionId: string | null = null): Promise<PlayerData> {
  const [sets, equipments, injuries, sessions, profiles] = await Promise.all([list('sets'), list('equipment'), list('injuries'), list('sessions'), list('profile')]);
  const equipment = equipments[0] ?? null;
  const pregnant = isPregnant(profile);
  const events = profiles.find((p) => p.id === profile.id)?.progressionLog ?? profile.progressionLog ?? [];
  const variants = new Map<string, Fiche['variantes'][number]>();
  fiches.forEach((f) => f.variantes.forEach((v) => variants.set(v.id, v)));
  const loaded = await loadGeneratorInput(asGenFiches(fiches)).catch(() => null);
  const gctx: Ctx | null = loaded ? buildCtx(loaded.input) : null;
  const frozen = symptomFrozen(sessions);
  const info = gctx ? (ex: PlannedExercise) => echelonInfoFor(ex, { ctx: gctx, sets, sessions, events, excludeSessionId }) : undefined;
  const ctx = buildEngineContext({
    sets,
    equipment: equipment ?? { dumbbellWeightsKg: [], kettlebellWeightsKg: [], platesKg: [] },
    pregnant,
    tagsOfVariant: (id) => variants.get(id)?.tags ?? [],
    echelonOf: (id) => variants.get(id)?.echelon,
    echelonInfo: info,
    excludeSessionId,
  });
  const bodyweightFiche = (ex: PlannedExercise) => {
    const fiche = gctx?.fichesById.get(ex.movementId);
    const variant = fiche?.variantes.find((v) => v.id === ex.variantId);
    return fiche && variant && !isChargeable(variant) && ex.unit !== 'sec' ? { fiche, variant } : null;
  };
  return {
    fiches,
    sets,
    equipment,
    injuries: injuries.filter((i) => i.active && !i.deletedAt),
    pregnant,
    ctx,
    sessions,
    events,
    frozen,
    input: loaded?.input ?? null,
    startReps: (ex) => {
      const b = bodyweightFiche(ex);
      return b ? startRepsFor(ex.movementId, b.variant.echelon, sets, excludeSessionId) : null;
    },
    bodyweightOf: (ex) => {
      const b = bodyweightFiche(ex);
      if (!b || !gctx || !loaded) return undefined;
      const arrival = pendingArrival(events, ex.movementId, sets.filter((s) => s.sessionId !== excludeSessionId));
      return {
        variants: progVariants(b.fiche, gctx),
        level: gctx.level,
        events,
        gentler: gentlerAlternative(ex.movementId, loaded.input),
        restricted: ex.adaptation !== null,
        arrival: !!arrival && arrival.to === b.variant.echelon,
      };
    },
  };
}
