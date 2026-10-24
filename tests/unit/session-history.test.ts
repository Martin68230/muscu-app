import { describe, expect, it } from 'vitest';
import type { SetLog, WorkoutSession } from '../../src/data/model';
import { availableLoadsFor, gentlerAlternative, lastTime, painCheck, painSessions, proposeProgression } from '../../src/session/history';
import { ex } from './session-helpers';
import { byId, FICHES, mk } from './generator-helpers';

let n = 0;
function log(o: Partial<SetLog> & { sessionId: string; variantId: string; completedAt: string }): SetLog {
  n++;
  return {
    id: `s${n}`, ownerId: 'u', createdAt: o.completedAt, updatedAt: o.completedAt, rev: 1, deletedAt: null, syncedAt: null,
    movementId: o.movementId ?? o.variantId, exerciseIndex: 0, setIndex: n, targetRepsMin: 8, targetRepsMax: 12,
    reps: 12, loadKg: 10, rir: 2, pain: false, comment: '', isWarmup: false, ...o,
  } as SetLog;
}
const D1 = '2026-10-20T10:00:00.000Z';
const D2 = '2026-10-22T10:00:00.000Z';
/** 3 séries au haut de la fourchette (12) à la réserve visée (2). */
const topSession = (sessionId: string, at: string, loadKg = 10, over: Partial<Omit<SetLog, 'completedAt'>> = {}) =>
  [0, 1, 2].map((i) => log({ sessionId, variantId: 'v', completedAt: new Date(Date.parse(at) + i * 60_000).toISOString(), loadKg, reps: 12, rir: 2, ...over }));
const exo = ex({ variantId: 'v', sets: 3, repsMin: 8, repsMax: 12, rirTarget: 2 });
const eq = { dumbbellWeightsKg: [2, 4, 6, 8, 10, 12.5, 15], kettlebellWeightsKg: [], platesKg: [] };
const halteres = { variantTags: ['halteres'], equipment: eq, pregnant: false };

describe('« dernière fois »', () => {
  it('dernière charge sans douleur, répétitions et date ; ignore l’échauffement', () => {
    const sets = [
      ...topSession('a', D1, 8),
      log({ sessionId: 'b', variantId: 'v', completedAt: D2, loadKg: 10, reps: 9, rir: 1 }),
      log({ sessionId: 'b', variantId: 'v', completedAt: '2026-10-22T10:05:00.000Z', loadKg: 12, reps: 6, pain: true }),
      log({ sessionId: 'b', variantId: 'v', completedAt: '2026-10-22T10:06:00.000Z', loadKg: 2, reps: 8, isWarmup: true }),
    ];
    const l = lastTime(sets, 'v')!;
    expect(l).toMatchObject({ loadKg: 10, reps: 9, date: D2, lastSessionPain: true });
    expect(lastTime(sets, 'autre')).toBeNull();
  });
});

describe('proposition de progression (la v1 propose, n’impose pas)', () => {
  it('première fois : étalonnage, charge de départ du programme', () => {
    const p = proposeProgression({ exercise: exo, sets: [], ...halteres });
    expect(p).toMatchObject({ action: 'etalonnage', reason: 'etalonnage', loadKg: exo.startLoadKg });
  });

  it('toutes les séries au haut de la fourchette à la réserve visée : palier suivant des haltères du profil', () => {
    const p = proposeProgression({ exercise: exo, sets: topSession('a', D1, 10), ...halteres });
    expect(p).toMatchObject({ action: 'hausse', loadKg: 12.5, text: 'Essaie 2,5 kg de plus.' });
  });

  it('les paliers réels sont respectés (pas de 1 kg inventé quand des haltères sont déclarés)', () => {
    const p = proposeProgression({ exercise: exo, sets: topSession('a', D1, 4), ...halteres });
    expect(p.loadKg).toBe(6);
  });

  it('sans liste de paliers (ex. sac à dos) : pas de 1 kg', () => {
    const p = proposeProgression({ exercise: exo, sets: topSession('a', D1, 10), pregnant: false, variantTags: ['sac_a_dos'], equipment: { ...eq, dumbbellWeightsKg: [] } });
    expect(p).toMatchObject({ action: 'hausse', loadKg: 11 });
    expect(availableLoadsFor(['barre'], { ...eq, platesKg: [1.25] }, 40)).toEqual([37.5, 40, 42.5]);
  });

  it('une série pas au haut de la fourchette : on garde la charge et on ajoute des répétitions', () => {
    const sets = topSession('a', D1, 10, {});
    sets[1].reps = 10;
    const p = proposeProgression({ exercise: exo, sets, ...halteres });
    expect(p).toMatchObject({ action: 'garder', loadKg: 10, reason: 'garder' });
  });

  it('réserve plus basse que la cible : pas de hausse', () => {
    const p = proposeProgression({ exercise: exo, sets: topSession('a', D1, 10, { rir: 1 }), ...halteres });
    expect(p.action).not.toBe('hausse');
  });

  it('exercice plafonné (capped) : jamais de hausse', () => {
    const p = proposeProgression({ exercise: { ...exo, capped: true }, sets: topSession('a', D1, 10), ...halteres });
    expect(p).toMatchObject({ action: 'garder', reason: 'plafond', loadKg: 10 });
  });

  it('grossesse ou post-partum : jamais de hausse (V-PRIO)', () => {
    const p = proposeProgression({ exercise: exo, sets: topSession('a', D1, 10), ...halteres, pregnant: true });
    expect(p).toMatchObject({ action: 'garder', reason: 'grossesse' });
  });

  it('après une douleur sur la fiche (même autre variante) : pas de hausse, charge conservée', () => {
    const sets = [...topSession('a', D1, 10), ...topSession('b', D2, 10, { pain: true, movementId: 'v' })];
    const p = proposeProgression({ exercise: exo, sets, ...halteres });
    expect(p).toMatchObject({ action: 'garder', reason: 'douleur' });
    // une séance suivante sans douleur lève le gel
    const next = [...sets, ...topSession('c', '2026-10-24T10:00:00.000Z', 10)];
    expect(proposeProgression({ exercise: exo, sets: next, ...halteres }).action).toBe('hausse');
  });

  it('séance précédente incomplète : pas de hausse', () => {
    const sets = topSession('a', D1, 10).slice(0, 2);
    expect(proposeProgression({ exercise: exo, sets, ...halteres })).toMatchObject({ action: 'garder', reason: 'incomplet' });
  });

  it('trop dur (répétitions sous le bas de la fourchette) : propose une baisse', () => {
    const p = proposeProgression({ exercise: exo, sets: topSession('a', D1, 10, { reps: 6, rir: 0 }), ...halteres });
    expect(p).toMatchObject({ action: 'baisse', loadKg: 8, text: 'Essaie 2 kg de moins.' });
  });

  it('plus lourd haltère atteint : pas de hausse inventée', () => {
    const p = proposeProgression({ exercise: exo, sets: topSession('a', D1, 15), ...halteres });
    expect(p).toMatchObject({ action: 'garder', reason: 'sommet' });
  });

  it('maintien : la durée n’augmente pas', () => {
    const hold = ex({ variantId: 'v', unit: 'sec', holdSec: 30, sets: 2, startLoadKg: null });
    const sets = [0, 1].map((i) => log({ sessionId: 'a', variantId: 'v', completedAt: `2026-10-20T10:0${i}:00.000Z`, loadKg: null, reps: null, rir: null, holdSec: 30 }));
    expect(proposeProgression({ exercise: hold, sets, ...halteres }).reason).toBe('maintien');
  });

  it('poids du corps : suivi par (fiche, échelon) ; la montée exige 2 séances valables (F6, la règle a changé avec la spécification)', () => {
    const bw = ex({ variantId: 'v', sets: 3, repsMin: 10, repsMax: 15, startLoadKg: null });
    const vars = [1, 2, 3].map((e) => ({ id: `w${e}`, nom: `W${e}`, echelon: e, niveau: 'debutant' as const, materielOk: true, rank: 0 }));
    const mk = (id: string, at: string) => topSession(id, at, 10).map((s) => ({ ...s, loadKg: null, reps: 15, rir: 2, targetRir: 2, targetRepsMin: 10, targetRepsMax: 15, echelon: 2, variantId: `w2-${id}` }));
    const one = mk('a', D1);
    const input = { exercise: bw, pregnant: false, echelon: 2, bodyweight: { variants: vars, level: 'intermediaire' as const } };
    expect(proposeProgression({ ...input, sets: one }).action).toBe('garder');
    const sets = [...one, ...mk('b', D2)];
    expect(proposeProgression({ ...input, sets })).toMatchObject({ action: 'hausse', echelon: 3 });
    expect(proposeProgression({ ...input, sets, echelon: 3, bodyweight: { ...input.bodyweight, variants: vars } }).action).toBe('etalonnage');
  });
});

describe('douleur sur plusieurs séances (§6.8 point 2)', () => {
  const sess = (id: string, at: string): WorkoutSession =>
    ({ id, status: 'faite', startedAt: at, endedAt: at, plannedDate: at.slice(0, 10), deletedAt: null } as WorkoutSession);
  const pain = (sessionId: string, at: string, zone: SetLog['painZone']) => log({ sessionId, variantId: 'v', completedAt: at, pain: true, painZone: zone });
  const ok = (sessionId: string, at: string) => log({ sessionId, variantId: 'v', completedAt: at });

  it('2 séances de suite avec douleur à la même zone : proposition niveau 2 (zone sans niveau)', () => {
    const sets = [pain('a', D1, 'epaule'), pain('b', D2, 'epaule')];
    const c = painCheck(sets, [sess('a', D1), sess('b', D2)], []);
    expect(c.proposals).toMatchObject([{ zone: 'epaule', from: 0, to: 2 }]);
  });

  it('zone déjà au niveau 2 : proposition niveau 3', () => {
    const sets = [pain('a', D1, 'genou'), pain('b', D2, 'genou')];
    const inj = [{ zone: 'genou', level: 2, active: true, deletedAt: null }] as never;
    expect(painCheck(sets, [sess('a', D1), sess('b', D2)], inj).proposals).toMatchObject([{ zone: 'genou', from: 2, to: 3 }]);
  });

  it('une séance sans douleur entre les deux : pas de proposition', () => {
    const sets = [pain('a', D1, 'epaule'), ok('b', D2)];
    expect(painCheck(sets, [sess('a', D1), sess('b', D2)], []).proposals).toEqual([]);
  });

  it('zone « je ne sais pas » deux fois : signe S1, pas de proposition de niveau', () => {
    const sets = [pain('a', D1, 'inconnu'), pain('b', D2, null)];
    const c = painCheck(sets, [sess('a', D1), sess('b', D2)], []);
    expect(c.proposals).toEqual([]);
    expect(c.s1Text).toContain('Consulte');
  });

  it('une séance sans aucune série est ignorée', () => {
    expect(painSessions([ok('a', D1)], [sess('a', D1), sess('vide', D2)])).toEqual([[]]);
  });
});

describe('alternative plus douce', () => {
  it('rend la fiche « version plus douce » quand elle passe les filtres, sinon null', () => {
    const soft = byId('bird-dog').securite.versionPlusDouce!;
    const alt = gentlerAlternative('bird-dog', mk({ profile: 'A0', level: 'debutant' }));
    expect(alt?.ficheId).toBe(soft);
    expect(gentlerAlternative('fiche-inconnue', mk())).toBeNull();
    // fiches retirées de l'entrée : la version douce n'existe pas pour ce profil
    expect(gentlerAlternative('bird-dog', mk({ fiches: FICHES.filter((f) => f.id !== soft) }))).toBeNull();
  });
});
