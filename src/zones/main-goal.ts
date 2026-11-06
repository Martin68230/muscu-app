// Objectif principal de la personne (rang 1), lu localement : sert à choisir les seuils de zoneStatus (même échelle que le générateur).
import { list } from '../data/repo';

export async function mainGoalKey(): Promise<string | null> {
  const goals = await list('goals').catch(() => []);
  const first = goals.filter((g) => !g.deletedAt).sort((a, b) => a.rank - b.rank)[0];
  return first?.goalKey ?? null;
}
