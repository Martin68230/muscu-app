// Petit journal local du rattrapage des zones (zones-musculaires.md §7, RAT-2 / RAT-3 / RAT-5) : profile.catchUpLog.
// 4 semaines au plus, sans donnée de santé (une zone de la carte, un exercice, une cause) ; sert aux messages et à « pas deux semaines de
// suite sur le même exercice », JAMAIS à calculer une quantité. Exporté et supprimé avec les données (c'est un champ du profil).
import type { CatchUpLogEntry } from '../data/model';
import { list, update } from '../data/repo';
import { CATCHUP } from '../generator/config';
import { shiftKey } from './catchup';

/** Journal mis à jour : les lignes de `weekKey` sont remplacées, celles de plus de 4 semaines sont retirées. Fonction pure. */
export function mergeCatchUpLog(old: readonly CatchUpLogEntry[] | undefined, weekKey: string, entries: readonly CatchUpLogEntry[]): CatchUpLogEntry[] {
  const oldest = shiftKey(weekKey, -(CATCHUP.logWeeks - 1));
  const kept = (old ?? []).filter((e) => e.week !== weekKey && e.week >= oldest && e.week < weekKey);
  return [...kept, ...entries.filter((e) => e.week === weekKey)].slice(-120);
}

/** Enregistre le journal de la semaine ; sans profil ou en cas d'erreur, ne fait rien (le rattrapage n'en dépend pas). */
export async function recordCatchUpLog(weekKey: string, entries: readonly CatchUpLogEntry[]): Promise<void> {
  try {
    const p = (await list('profile'))[0];
    if (!p) return;
    await update('profile', p.id, { catchUpLog: mergeCatchUpLog(p.catchUpLog, weekKey, entries) });
  } catch {
    /* le journal est facultatif */
  }
}
