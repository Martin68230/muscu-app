// Filtres de la bibliothèque : groupe musculaire, niveau, matériel (fonctions pures sur les fiches déjà chargées).
import type { Fiche } from './fiches';
import { MUSCLE_GROUPS } from '../session/progress-view';

export const LEVELS = [
  { id: 'tout', label: 'Tous niveaux' },
  { id: 'debutant', label: 'Débutant' },
  { id: 'intermediaire', label: 'Jusqu’à intermédiaire' },
] as const;
const RANK: Record<string, number> = { debutant: 0, intermediaire: 1, avance: 2 };

/** Sans matériel = au moins une variante qui n'utilise que le corps, un tapis, un mur ou une chaise. */
const NO_GEAR = new Set(['poids_du_corps', 'tapis', 'mur', 'chaise']);
export const GEARS = [
  { id: 'tout', label: 'Tout matériel' },
  { id: 'sans', label: 'Sans matériel' },
  { id: 'halteres', label: 'Haltères' },
  { id: 'elastique', label: 'Élastique' },
  { id: 'barre', label: 'Barre' },
  { id: 'banc', label: 'Banc' },
  { id: 'poulie', label: 'Poulie' },
  { id: 'swiss_ball', label: 'Swiss ball' },
] as const;

export interface LibFilters { muscle: string; level: string; gear: string }
export const NO_FILTERS: LibFilters = { muscle: 'tout', level: 'tout', gear: 'tout' };
export const activeFilters = (f: LibFilters): number => [f.muscle, f.level, f.gear].filter((x) => x !== 'tout').length;

export function filterFiches(list: readonly Fiche[], f: LibFilters): Fiche[] {
  const muscles = MUSCLE_GROUPS.find((g) => g.id === f.muscle)?.muscles;
  return list.filter((x) => {
    if (muscles && !x.musclesPrincipaux.some((m) => muscles.includes(m))) return false;
    if (f.level !== 'tout' && (RANK[x.niveauMin] ?? 0) > (RANK[f.level] ?? 2)) return false;
    if (f.gear === 'sans') return x.variantes.some((v) => v.tags.every((t) => NO_GEAR.has(t)));
    if (f.gear !== 'tout') return x.variantes.some((v) => v.tags.includes(f.gear));
    return true;
  });
}
