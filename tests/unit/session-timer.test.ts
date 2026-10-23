import { describe, expect, it } from 'vitest';
import { adjustRest, formatClock, isRestOver, onForeground, remainingMs, startRest } from '../../src/session/timer';

const T0 = Date.parse('2026-10-23T10:00:00.000Z');

describe('minuteur de repos sur l’heure réelle', () => {
  it('le temps restant se recalcule à chaque lecture, sans tick', () => {
    const r = startRest(T0, 90)!;
    expect(remainingMs(r, T0)).toBe(90_000);
    expect(remainingMs(r, T0 + 30_000)).toBe(60_000);
    expect(remainingMs(r, T0 + 89_999)).toBe(1);
    expect(isRestOver(r, T0 + 90_000)).toBe(true);
  });

  it('retour d’arrière-plan après 30 s : il reste 60 s, pas de repos fini', () => {
    const r = startRest(T0, 90)!;
    const back = onForeground(r, T0 + 30_000, T0 + 2_000);
    expect(back.remainingMs).toBe(60_000);
    expect(back.finishedWhileAway).toBe(false);
  });

  it('retour après la fin du repos : 0 restant, fini pendant l’absence, retard connu', () => {
    const r = startRest(T0, 90)!;
    const back = onForeground(r, T0 + 150_000, T0 + 10_000);
    expect(back.remainingMs).toBe(0);
    expect(back.finishedWhileAway).toBe(true);
    expect(back.overdueMs).toBe(60_000);
  });

  it('repos déjà fini avant la mise en arrière-plan : pas de « fini pendant l’absence »', () => {
    const r = startRest(T0, 30)!;
    expect(onForeground(r, T0 + 100_000, T0 + 50_000).finishedWhileAway).toBe(false);
  });

  it('ajuster de 15 s se calcule sur le temps restant et ne descend jamais sous maintenant', () => {
    const r = startRest(T0, 90)!;
    const plus = adjustRest(r, 15, T0 + 30_000)!;
    expect(remainingMs(plus, T0 + 30_000)).toBe(75_000);
    const moins = adjustRest(startRest(T0, 20)!, -15, T0 + 10_000)!;
    expect(remainingMs(moins, T0 + 10_000)).toBe(0);
  });

  it('si l’horloge recule, le restant ne dépasse jamais la durée totale', () => {
    const r = startRest(T0, 60)!;
    expect(remainingMs(r, T0 - 3_600_000)).toBe(60_000);
  });

  it('pas de repos pour 0 s ; plafond de 10 min ; format m:ss', () => {
    expect(startRest(T0, 0)).toBeNull();
    expect(startRest(T0, 5000)!.totalMs).toBe(600_000);
    expect(formatClock(61_000)).toBe('1:01');
    expect(formatClock(0)).toBe('0:00');
  });
});
