// Niveau 3, étape 1 : données de la carte des muscles (statuts recalculés) et silhouette (un chemin par zone).
import { describe, expect, it } from 'vitest';
import corr from '../../knowledge/zones-correspondance.json';
import { cycleMaps, sessionMap, statusesFromPoints, setsOfExercises, setsOfLogs, statusesForExercise, weekMap } from '../../src/zones/map-data';
import { pointsByZone, thresholdsOf, zoneCoefs, zoneStatus, ZONES } from '../../src/zones/zones';
import { generateProgram, toProgramDays } from '../../src/generator';
import { HIT_RADIUS_PX, piecesOfPath, zoneAt } from '../../src/ui/muscle-hit';
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

describe('map-data : échelle d\'affichage de la carte (PROVISOIRE, décision du 06/11/2026)', () => {
  it('la carte utilise zoneStatus, la même échelle que le générateur, pour chaque objectif : un rouge veut dire seuil atteint', () => {
    for (const objectif of ['muscle', 'force', 'sante', null]) {
      for (const z of ZONES) {
        const t = thresholdsOf(z.id, objectif);
        const pts = Object.fromEntries(ZONES.map((x) => [x.id, 0])) as Record<string, number>;
        for (const v of [0, t.gris - 0.01, t.gris, t.rouge - 0.01, t.rouge]) {
          pts[z.id] = v;
          expect(statusesFromPoints(pts, objectif)[z.id], `${z.id} ${objectif} ${v}`).toBe(zoneStatus(v, z.id, objectif));
        }
      }
    }
    expect(statusesFromPoints({ ...Object.fromEntries(ZONES.map((x) => [x.id, 0])), pectoraux_haut: 4 } as never, 'force').pectoraux_haut).toBe('rouge');
  });

  // Les 6 profils de tools/demo-programmes.mjs (même entrée) : les statuts de la semaine sont ceux de zoneStatus pour l'objectif du profil (une semaine presque toute rouge est attendue).
  const eq = (tags: string[]) => ({ preset: 'perso', tags, disabledImplicit: [], dumbbellWeightsKg: [2, 4, 6, 8, 10, 12, 14], kettlebellWeightsKg: [8, 12] });
  const salle = { preset: 'F', tags: [], disabledImplicit: [], dumbbellWeightsKg: [], kettlebellWeightsKg: [] };
  const HE = ['halteres', 'elastique', 'chaise', 'poids_du_corps', 'tapis'];
  const E = ['elastique', 'chaise', 'poids_du_corps', 'tapis'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mk = (o: any) => ({
    profile: { blockedWeekdays: [], place: 'maison', sessionDurationMin: 45, sports: [], ...o.profile }, equipment: o.equipment,
    goals: [{ goalKey: o.goal, rank: 1 }, ...(o.second ? [{ goalKey: o.second, rank: 2 }] : [])], injuries: [], fiches: FICHES, options: { gagnerDuTemps: true },
  });
  const PROFILS = [
    mk({ profile: { level: 'debutant', daysPerWeek: 3 }, equipment: eq(HE), goal: 'muscle' }),
    mk({ profile: { level: 'intermediaire', daysPerWeek: 4, sessionDurationMin: 60, place: 'salle', salleAccess: true }, equipment: salle, goal: 'force' }),
    mk({ profile: { level: 'intermediaire', daysPerWeek: 3, sessionDurationMin: 45 }, equipment: eq(HE), goal: 'perte_gras', second: 'cardio' }),
    mk({ profile: { level: 'intermediaire', daysPerWeek: 3, sports: ['volley'] }, equipment: eq(E), goal: 'sport' }),
    mk({ profile: { level: 'debutant', daysPerWeek: 3 }, equipment: eq(['poids_du_corps', 'tapis']), goal: 'muscle' }),
    mk({ profile: { level: 'avance', daysPerWeek: 5, sessionDurationMin: 75, place: 'salle', salleAccess: true }, equipment: salle, goal: 'muscle' }),
  ];
  it('6 profils de démonstration : les statuts de la semaine sont exactement ceux de zoneStatus, sans échelle séparée', () => {
    PROFILS.forEach((input, i) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r = generateProgram(input as any);
      if (!r.ok) throw new Error(`profil ${i + 1}`);
      const objectif = input.goals[0].goalKey;
      const { statuses, points } = weekMap(toProgramDays(r.program), byId, objectif);
      for (const z of ZONES) expect(statuses[z.id], `profil ${i + 1} ${z.id}`).toBe(zoneStatus(points[z.id] ?? 0, z.id, objectif));
    });
  });
});

describe('map-data : vues', () => {
  const push = [
    { movementId: 'developpe-couche-barre', sets: 4 },
    { movementId: 'elevation-laterale', sets: 3 },
  ];
  it("séance : points de la séance SANS mise à l’échelle ; couleur selon le rôle des exercices (jamais plus que orange sans muscle principal)", () => {
    const m = sessionMap(setsOfExercises(push), byId, "muscle");
    const pts = pointsByZone(push.map((e) => ({ ficheId: e.movementId, sets: e.sets })), byId);
    expect(m.points).toEqual(pts);
    for (const z of ZONES) {
      const principal = push.filter((e) => zoneCoefs({ ...byId.get(e.movementId)!, musclesSecondaires: [] }).get(z.id)).length;
      if (m.statuses[z.id] === "rouge") expect(principal, z.id).toBeGreaterThanOrEqual(1);
      if (principal === 0) expect(m.statuses[z.id], z.id).not.toBe("rouge");
      if (pts[z.id] < thresholdsOf(z.id, "muscle").gris) expect(m.statuses[z.id], z.id).toBe("gris");
    }
    expect(Object.values(m.statuses)).toContain("gris");
  });
  it("règle de rouge : 2 exercices en principal, ou 1 en principal + 2 en secondaire ; un seul exercice en principal = orange", () => {
    const one = sessionMap(setsOfExercises([{ movementId: "developpe-couche-barre", sets: 4 }]), byId, "muscle");
    expect(one.statuses.pectoraux_milieu_bas).toBe("orange");
    const two = sessionMap(setsOfExercises([{ movementId: "developpe-couche-barre", sets: 3 }, { movementId: "developpe-incline-barre", sets: 3 }]), byId, "muscle");
    expect(two.statuses.pectoraux_milieu_bas).toBe("rouge");
    // les séries d’un même exercice (journal) ne comptent qu’une fois
    const logs = setsOfLogs(Array.from({ length: 5 }, () => ({ movementId: "developpe-couche-barre", sessionId: "s", completedAt: "2026-11-06T10:00:00Z" })), "s");
    expect(sessionMap(logs, byId, "muscle").statuses.pectoraux_milieu_bas).toBe("orange");
  });
  it("cas de contrôle (fiches réelles) : Poussée B sans les abdos en rouge, Bas du corps A sans les obliques en rouge", () => {
    const pousseeB = [
      { movementId: "developpe-epaules-assis-dossier-incline", sets: 3 }, { movementId: "developpe-couche-barre", sets: 3 },
      { movementId: "extension-triceps-couche-halteres", sets: 3 }, { movementId: "gainage-creux", sets: 2 },
    ];
    const pb = sessionMap(setsOfExercises(pousseeB), byId, "muscle");
    expect(pb.statuses.abdominaux_droits).not.toBe("rouge");
    const basA = ["squat-arriere-barre", "hip-thrust-banc", "abduction-hanche-poulie", "curl-ischios-serviette", "marche-pointes-talons", "bird-dog"]
      .map((movementId) => ({ movementId, sets: 3 }));
    const ba = sessionMap(setsOfExercises(basA), byId, "muscle");
    expect(ba.statuses.obliques).not.toBe("rouge");
  });
  it('semaine : le cardio ne compte pas', () => {
    const m = weekMap([{ exercises: [...push, { movementId: 'developpe-couche-barre', sets: 6, role: 'cardio' }] }], byId);
    expect(m.points).toEqual(pointsByZone(push.map((e) => ({ ficheId: e.movementId, sets: e.sets })), byId));
  });
  it('séries faites : échauffement, série non faite, supprimée ou d\'une autre séance = 0 ; un seul côté = une demi-série', () => {
    const base = { movementId: 'developpe-couche-barre', sessionId: 's1', completedAt: '2026-11-06T10:00:00Z' };
    const sets = setsOfLogs([
      base, { ...base, isWarmup: true }, { ...base, completedAt: null }, { ...base, deletedAt: '2026-11-06' }, { ...base, sessionId: 's2' },
      { ...base, side: 'gauche' as const },
    ], 's1');
    expect(sets).toHaveLength(2);
    const p = pointsByZone(sets, byId);
    expect(p.pectoraux_milieu_bas).toBe(pointsByZone([{ ficheId: base.movementId, sets: 1.5 }], byId).pectoraux_milieu_bas);
  });
  it('un exercice : rouge = zones principales, orange = zones secondaires seulement, gris sinon', () => {
    const st = statusesForExercise(byId.get('developpe-couche-barre')!);
    expect(st.pectoraux_milieu_bas).toBe('rouge');
    expect(st.triceps_lateral_medial === 'orange' || st.triceps_long_chef === 'orange').toBe(true);
    expect(st.mollets_soleaire).toBe('gris');
  });
  it('cycle : une carte par groupe, dans l\'ordre, séances de cardio seul ignorées', () => {
    const c = cycleMaps([
      { sessionType: 'LEGS', exercises: [{ movementId: 'developpe-couche-barre', sets: 1 }] },
      { sessionType: 'PUSH', exercises: [{ movementId: 'developpe-couche-barre', sets: 4 }] },
      { sessionType: 'PUSH', exercises: [{ movementId: 'developpe-couche-barre', sets: 4 }] },
      { sessionType: 'PULL', exercises: [{ movementId: 'developpe-couche-barre', sets: 1, role: 'cardio' }] },
    ], byId);
    expect(c.map((g) => g.group)).toEqual(['poussee', 'jambes']);
    expect(c[0].count).toBe(2);
    expect(c[0].map.points.pectoraux_milieu_bas).toBe(2 * pointsByZone([{ ficheId: 'developpe-couche-barre', sets: 4 }], byId).pectoraux_milieu_bas);
    // deux séances de poussée = deux exercices en principal pour les pectoraux : rouge (même règle que la séance)
    expect(c[0].map.statuses.pectoraux_milieu_bas).toBe('rouge');
  });
});

describe('toucher de la carte (zone sensible agrandie)', () => {
  // Largeur rendue minimale : écran de 375 px, marges de l'écran et de la carte (2 x 16 + 2 x 17) => 309 px pour 410 unités (face + dos).
  const PX_PER_UNIT = 309 / 410;
  const r = HIT_RADIUS_PX / PX_PER_UNIT;
  it('rayon de capture = 22 px : disque de 44 px de diamètre autour du bord de chaque zone', () => {
    expect(HIT_RADIUS_PX * 2).toBeGreaterThanOrEqual(44);
  });
  it('un point au milieu d\'un morceau de zone choisit cette zone (le plus petit dessin gagne s\'ils se chevauchent)', () => {
    let ok = 0, total = 0;
    for (const [zone, v] of Object.entries(ZONE_PATHS)) {
      for (const view of ['face', 'dos'] as const) {
        if (!v[view]) continue;
        const pts = piecesOfPath(v[view]!)[0];
        const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
        total++;
        if (zoneAt(view, cx, cy, r) === zone) ok++;
      }
    }
    // Quelques morceaux concaves ou recouverts peuvent répondre au voisin : la grande majorité doit répondre juste.
    expect(ok / total).toBeGreaterThan(0.9);
  });
  it('à côté du dessin (moins de 22 px) : la zone la plus proche ; loin de tout : rien', () => {
    // Bord extérieur de l'avant-bras gauche (x ~ 34, y ~ 215) : 10 unités plus à gauche, hors du corps.
    expect(zoneAt('face', 25, 215, r)).toBe('avant_bras');
    expect(zoneAt('face', 2, 10, r)).toBeNull();
    // Mollets au dos, à 12 unités sous le bas du dessin.
    expect(zoneAt('dos', 80, 406, r)).toBe('mollets_soleaire');
  });
});
