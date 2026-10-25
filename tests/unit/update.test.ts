import { describe, expect, it, vi } from 'vitest';
import { checkForUpdate } from '../../src/ui/update';

const reg = (o: Record<string, unknown>) => o as unknown as ServiceWorkerRegistration;

describe('Mettre à jour l’app', () => {
  it('hors ligne : message sans toucher au service worker', async () => {
    const getRegistration = vi.fn();
    expect(await checkForUpdate({ online: () => false, getRegistration, reload: vi.fn() })).toBe('hors_ligne');
    expect(getRegistration).not.toHaveBeenCalled();
  });
  it('pas de service worker (navigation privée, dev) : impossible, sans recharger', async () => {
    const reload = vi.fn();
    expect(await checkForUpdate({ online: () => true, getRegistration: async () => undefined, reload })).toBe('impossible');
    expect(reload).not.toHaveBeenCalled();
  });
  it('aucune nouvelle version : « à jour », pas de rechargement', async () => {
    const reload = vi.fn();
    const update = vi.fn(async () => undefined);
    expect(await checkForUpdate({ online: () => true, getRegistration: async () => reg({ update, installing: null, waiting: null }), reload })).toBe('a_jour');
    expect(update).toHaveBeenCalled();
    expect(reload).not.toHaveBeenCalled();
  });
  it('nouvelle version trouvée : attend l’activation puis recharge', async () => {
    const reload = vi.fn();
    const listeners: (() => void)[] = [];
    const sw = { state: 'installing', addEventListener: (_t: string, f: () => void) => listeners.push(f), postMessage: vi.fn() };
    const p = checkForUpdate({ online: () => true, getRegistration: async () => reg({ update: async () => undefined, installing: sw, waiting: null }), reload });
    await Promise.resolve();
    await new Promise((r) => setTimeout(r, 0));
    sw.state = 'activated';
    listeners.forEach((f) => f());
    expect(await p).toBe('mise_a_jour');
    expect(reload).toHaveBeenCalledTimes(1);
  });
  it('erreur du navigateur : impossible', async () => {
    expect(await checkForUpdate({ online: () => true, getRegistration: async () => reg({ update: async () => { throw new Error('x'); } }), reload: vi.fn() })).toBe('impossible');
  });
});
