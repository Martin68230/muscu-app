// Niveau 3, étape 1 : données de la carte des muscles (statuts recalculés) et silhouette (un chemin par zone).
import { describe, expect, it } from 'vitest';
import corr from '../../knowledge/zones-correspondance.json';
import { statusesForCycle, statusesForExercise, statusesForSession, statusesForWeek } from '../../src/zones/map-data';
import { pointsByZone, zoneStatus } from '../../src/zones/zones';
import { ZONE_PATHS } from '../../src/ui/muscle-silhouette';
import { FICHES } from './generator-helpers';

const byId = new Map(FICHES.map((f) => [f.id, f]));

describe('silhouette', () => {
  it('chaque zone de zones-correspondance.json a un chemin (face ou dos), et sa vue déclarée est dessinée', () => {
    for (const z of corr.zones) {
      const p = ZONE_PATHS[z.id];
      expect(p, z.id).toBeTruthy();
      expect(Boolean(p.face || p.dos), z.id).toBe(true);
      if (z.vue === 'face') expect(p.face, z.id).toBeTruthy();
      if (z.vue === 'dos') expect(p.dos, z.id).toBeTruthy();
      if (z.vue === 'face_et_dos') expect(p.face && p.dos, z.id).toBeTruthy();
    }
    expect(Object.keys(ZONE_PATHS).sort()).toEqual(corr.zones.map((z) => z.id).sort());
  });
});

describe('map-data', () => {
  const push = [
    { movementId: 'developpe-couche-barre', sets: 4 },
    { movementId: 'elevation-laterale', sets: 3 },
  ];
  it('séance : le statut correspond aux points (seuils rapportés à une séance sur 3)', () => {
    const st = statusesForSession(push, byId, 'muscle', 3);
    const pts = pointsByZone(push.map((e) => ({ ficheId: e.movementId, sets: e.sets })), byId);
    for (const [z, p] of Object.entries(pts)) expect(st[z], z).toBe(zoneStatus(p * 3, z, 'muscle'));
    expect(Object.values(st)).toContain('gris');
  });
  it('semaine : seuils hebdomadaires, pas de séance de cardio comptée', () => {
    const days = [{ exercises: [...push, { movementId: 'developpe-couche-barre', sets: 6, role: 'cardio' }] }];
    const st = statusesForWeek(days, byId, 'force');
    const pts = pointsByZone(push.map((e) => ({ ficheId: e.movementId, sets: e.sets })), byId);
    for (const [z, p] of Object.entries(pts)) expect(st[z], z).toBe(zoneStatus(p, z, 'force'));
  });
  it('un exercice : rouge = zones principales, orange = zones secondaires seulement, gris sinon', () => {
    const f = byId.get('developpe-couche-barre')!;
    const st = statusesForExercise(f);
    expect(st.pectoraux_milieu_bas).toBe('rouge');
    expect(st.triceps_lateral_medial === 'orange' || st.triceps_long_chef === 'orange').toBe(true);
    expect(st.mollets_soleaire).toBe('gris');
    expect(Object.values(st).filter((s) => s === 'rouge').length).toBeGreaterThan(0);
    expect(Object.values(st).filter((s) => s === 'orange').length).toBeGreaterThan(0);
  });
  it('cycle : une carte par groupe (haut / bas, poussée / tirage / jambes)', () => {
    const days = [
      { sessionType: 'PUSH', exercises: [{ movementId: 'developpe-couche-barre', sets: 4 }] },
      { sessionType: 'PULL', exercises: [{ movementId: 'developpe-couche-barre', sets: 1 }] },
      { sessionType: 'LEGS', exercises: [] },
    ];
    const c = statusesForCycle(days, byId, 'muscle');
    expect(Object.keys(c).sort()).toEqual(['jambes', 'poussee', 'tirage']);
    expect(statusesForCycle([{ sessionType: 'HAUT', exercises: [] }, { sessionType: 'BAS', exercises: [] }], byId, null)).toHaveProperty('haut');
  });
});
