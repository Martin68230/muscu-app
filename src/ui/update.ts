/** Mise à jour manuelle de l'app installée (service worker) : « Mettre à jour l'app » dans Profil. */
export type UpdateResult = 'a_jour' | 'mise_a_jour' | 'hors_ligne' | 'impossible';

interface Env {
  online: () => boolean;
  getRegistration: () => Promise<ServiceWorkerRegistration | undefined>;
  reload: () => void;
}

const realEnv = (): Env => ({
  online: () => navigator.onLine,
  getRegistration: async () => (typeof navigator !== 'undefined' && 'serviceWorker' in navigator ? navigator.serviceWorker.getRegistration() : undefined),
  reload: () => location.reload(),
});

/**
 * Cherche une nouvelle version : si le service worker en trouve une, on attend son activation puis on recharge l'app.
 * Rien n'est effacé : le profil, l'historique et les réglages sont dans IndexedDB, pas dans le cache de l'app.
 */
export async function checkForUpdate(env: Env = realEnv()): Promise<UpdateResult> {
  if (!env.online()) return 'hors_ligne';
  try {
    const reg = await env.getRegistration();
    if (!reg) return 'impossible';
    await reg.update();
    const sw = reg.installing ?? reg.waiting;
    if (!sw) return 'a_jour';
    await new Promise<void>((resolve) => {
      if (sw.state === 'activated') return resolve();
      sw.addEventListener('statechange', () => sw.state === 'activated' && resolve());
      if (reg.waiting === sw) sw.postMessage({ type: 'SKIP_WAITING' });
      setTimeout(resolve, 15000);
    });
    env.reload();
    return 'mise_a_jour';
  } catch {
    return 'impossible';
  }
}

export const UPDATE_TEXT: Record<UpdateResult, string> = {
  a_jour: 'Tu as déjà la dernière version.',
  mise_a_jour: 'Mise à jour installée : l’app se recharge.',
  hors_ligne: 'Pas de connexion : réessaie quand tu es en ligne.',
  impossible: 'Mise à jour impossible ici. Ferme complètement l’app et rouvre-la.',
};
