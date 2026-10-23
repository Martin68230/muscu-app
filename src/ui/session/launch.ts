// Données du lecteur de séance : lues une fois au démarrage ou à la reprise (aucun réseau pendant la séance).
import { list } from '../../data/repo';
import type { EquipmentProfile, Injury, Profile, SetLog } from '../../data/model';
import type { Fiche } from '../../data/fiches';
import type { Fiche as GenFiche } from '../../generator/types';
import type { EngineContext } from '../../session/engine';
import { buildEngineContext } from '../../session/history';

export interface PlayerData {
  fiches: Fiche[];
  sets: SetLog[];
  equipment: EquipmentProfile | null;
  injuries: Injury[];
  pregnant: boolean;
  ctx: EngineContext;
}

export const isPregnant = (p: Pick<Profile, 'pregnancy'> | null | undefined): boolean => p?.pregnancy === 'enceinte' || p?.pregnancy === 'post_partum';

/** Les fiches de l'écran et celles du générateur sont le même fichier JSON. */
export const asGenFiches = (f: Fiche[]): GenFiche[] => f as unknown as GenFiche[];

export async function loadPlayerData(fiches: Fiche[], profile: Profile, excludeSessionId: string | null = null): Promise<PlayerData> {
  const [sets, equipments, injuries] = await Promise.all([list('sets'), list('equipment'), list('injuries')]);
  const equipment = equipments[0] ?? null;
  const pregnant = isPregnant(profile);
  const variants = new Map<string, Fiche['variantes'][number]>();
  fiches.forEach((f) => f.variantes.forEach((v) => variants.set(v.id, v)));
  const ctx = buildEngineContext({
    sets,
    equipment: equipment ?? { dumbbellWeightsKg: [], kettlebellWeightsKg: [], platesKg: [] },
    pregnant,
    tagsOfVariant: (id) => variants.get(id)?.tags ?? [],
    echelonOf: (id) => variants.get(id)?.echelon,
    excludeSessionId,
  });
  return { fiches, sets, equipment, injuries: injuries.filter((i) => i.active && !i.deletedAt), pregnant, ctx };
}
