// Écran allumé pendant la séance (Wake Lock). Tout est toléré : API absente, refus, rejet de la promesse -> bandeau, jamais de plantage.
// Redemandé au retour au premier plan (le système le relâche quand la page passe en arrière-plan), relâché à la fin.
import { useEffect, useState } from 'preact/hooks';

interface Sentinel {
  release(): Promise<void>;
  addEventListener?(type: 'release', cb: () => void): void;
}

let sentinel: Sentinel | null = null;
let okState = true;
const listeners = new Set<(ok: boolean) => void>();

function setOk(v: boolean): void {
  if (okState === v) return;
  okState = v;
  listeners.forEach((l) => l(v));
}

/** Demande l'écran allumé. Retourne false s'il est indisponible ou refusé (le bandeau s'affiche). */
export async function acquireWakeLock(): Promise<boolean> {
  try {
    const wl = (navigator as unknown as { wakeLock?: { request(t: 'screen'): Promise<Sentinel> } }).wakeLock;
    if (!wl || typeof wl.request !== 'function') {
      setOk(false);
      return false;
    }
    if (sentinel) {
      setOk(true);
      return true;
    }
    const s = await wl.request('screen');
    sentinel = s;
    s.addEventListener?.('release', () => {
      if (sentinel === s) sentinel = null;
    });
    setOk(true);
    return true;
  } catch {
    sentinel = null;
    setOk(false);
    return false;
  }
}

export async function releaseWakeLock(): Promise<void> {
  const s = sentinel;
  sentinel = null;
  try {
    await s?.release();
  } catch {
    /* ignoré */
  }
  setOk(true);
}

/** true tant que rien ne va mal ; false quand l'écran peut s'éteindre. */
export function useWakeLockOk(): boolean {
  const [ok, setState] = useState(okState);
  useEffect(() => {
    listeners.add(setState);
    setState(okState);
    return () => {
      listeners.delete(setState);
    };
  }, []);
  return ok;
}

export function resetWakeLockForTests(): void {
  sentinel = null;
  okState = true;
  listeners.clear();
}
