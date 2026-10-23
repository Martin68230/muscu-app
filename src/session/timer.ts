// Minuteur de repos sur l'heure réelle (CLAUDE.md A5). La vérité est un horodatage de fin (`restEndsAt`, en ms) :
// le temps restant se recalcule à chaque lecture. Un `setInterval` ne sert qu'à rafraîchir l'affichage.
// Aucune promesse d'alarme écran verrouillé : au retour au premier plan, on recalcule et l'on dit si le repos est fini.

/** Horloge injectable (tests) : millisecondes depuis 1970. */
export type NowFn = () => number;
export const realNow: NowFn = () => Date.now();

/** Pas de réglage du repos (boutons +/- 15 s). */
export const REST_ADJUST_STEP_SEC = 15;
/** Plafond d'un repos affiché (ajustements compris) : 10 min. Valeur prudente de conception, NON SOURCÉ (voir docs/f5-notes-dev.md). */
export const REST_MAX_MS = 10 * 60 * 1000;

export interface RestState {
  endsAt: number;
  totalMs: number;
  kind: 'repos' | 'transition';
}

export function startRest(now: number, seconds: number, kind: RestState['kind'] = 'repos'): RestState | null {
  if (!(seconds > 0)) return null;
  const totalMs = Math.min(Math.round(seconds * 1000), REST_MAX_MS);
  return { endsAt: now + totalMs, totalMs, kind };
}

/**
 * Temps restant (>= 0). Si l'horloge du téléphone a reculé (réglage manuel), le résultat ne dépasse jamais la durée
 * totale du repos : on ne reste pas bloqué des heures.
 */
export function remainingMs(rest: Pick<RestState, 'endsAt' | 'totalMs'> | null, now: number): number {
  if (!rest) return 0;
  return Math.max(0, Math.min(rest.endsAt - now, rest.totalMs));
}

export function isRestOver(rest: RestState | null, now: number): boolean {
  return rest !== null && remainingMs(rest, now) === 0;
}

/** +/- 15 s : jamais avant « maintenant », jamais au-delà du plafond. */
export function adjustRest(rest: RestState | null, deltaSec: number, now: number): RestState | null {
  if (!rest) return null;
  const left = remainingMs(rest, now);
  const nextLeft = Math.min(Math.max(left + Math.round(deltaSec * 1000), 0), REST_MAX_MS);
  return { ...rest, endsAt: now + nextLeft, totalMs: Math.max(nextLeft, Math.min(REST_MAX_MS, rest.totalMs + Math.round(deltaSec * 1000))) };
}

export interface ForegroundResult {
  remainingMs: number;
  /** Le repos s'est terminé pendant l'absence (écran verrouillé, autre appli) : jouer le son une fois, sans promesse d'alarme. */
  finishedWhileAway: boolean;
  /** Depuis combien de temps le repos est fini (ms), 0 s'il court encore. */
  overdueMs: number;
}

/** À appeler quand la page redevient visible (`visibilitychange`, `pageshow`) : recalcule tout depuis l'heure réelle. */
export function onForeground(rest: RestState | null, now: number, lastSeenAt: number | null): ForegroundResult {
  if (!rest) return { remainingMs: 0, finishedWhileAway: false, overdueMs: 0 };
  const left = remainingMs(rest, now);
  const overdue = left === 0 ? Math.max(0, now - rest.endsAt) : 0;
  // « Fini pendant l'absence » : la fin tombe après la dernière fois où l'écran était visible.
  const finishedWhileAway = left === 0 && (lastSeenAt === null || rest.endsAt > lastSeenAt);
  return { remainingMs: left, finishedWhileAway, overdueMs: overdue };
}

/** Rafraîchissement d'affichage seulement (jamais source de vérité). Retourne la fonction d'arrêt. */
export function startDisplayTick(callback: () => void, intervalMs = 250): () => void {
  const id = setInterval(callback, intervalMs);
  return () => clearInterval(id);
}

/** Format « m:ss » du minuteur. */
export function formatClock(ms: number): string {
  const total = Math.ceil(Math.max(0, ms) / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
