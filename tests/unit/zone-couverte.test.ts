// 14/11/2026 (retour de l'utilisateur) : (1) une zone travaillée par un exercice à dose fixe plafonnée (le cou) n'est plus « grise » sur la carte (AFFICHAGE seulement) ;
// (2) les séances de jambes (LEGS / BAS) des profils aux plafonds relevés reçoivent mollets, adducteurs et abducteurs en fin de séance quand le temps et les plafonds le permettent.
import { describe, expect, it } from 'vitest';
import { generateProgram } from '../../src/generator';
import { coveredZones, sessionMap, statusesFromPoints, weekMap } from '../../src/zones/map-data';
import { pointsByZone, zoneCoefs, ZONES, type ZoneFiche } from '../../src/zones/zones';
import { FICHES, mk } from './generator-helpers';

const NECK = 'renfo-cou-isometrique';
const fiches = FICHES as unknown as ZoneFiche[];

describe('Zone couverte : affichage seulement', () => {
  it('le cou à dose fixe n\'est pas gris ; sans la marque « dose fixe » il le reste ; les points ne changent jamais', () => {
    const capped = [{ ficheId: NECK, sets: 1, capped: true }];
    const plain = [{ ficheId: NECK, sets: 1 }];
    const ptsCapped = pointsByZone(capped, fiches);
    expect(ptsCapped).toEqual(pointsByZone(plain, fiches));
    expect(ptsCapped.cou).toBeGreaterThan(0);
    expect(statusesFromPoints(ptsCapped, 'muscle').cou).toBe('gris');
    expect(statusesFromPoints(ptsCapped, 'muscle', coveredZones(capped, fiches)).cou).toBe('orange');
    expect(coveredZones(plain, fiches).size).toBe(0);
    expect(sessionMap(capped, fiches, 'muscle').statuses.cou).toBe('orange');
    expect(weekMap([{ exercises: [{ movementId: NECK, sets: 1, capped: true }] }], fiches, 'muscle').statuses.cou).toBe('orange');
    expect(weekMap([{ exercises: [{ movementId: NECK, sets: 1 }] }], fiches, 'muscle').statuses.cou).toBe('gris');
  });
  it('jamais plus que « orange » ; une zone sans point reste grise', () => {
    const capped = [{ ficheId: NECK, sets: 1, capped: true }];
    const st = statusesFromPoints(pointsByZone(capped, fiches), 'muscle', coveredZones(capped, fiches));
    for (const z of ZONES) {
      if (z.id === 'cou') continue;
      const c = zoneCoefs(fiches.find((f) => f.id === NECK)!).get(z.id) ?? 0;
      if (c === 0) expect(st[z.id], z.id).toBe('gris');
    }
    expect(Object.values(st)).not.toContain('rouge');
  });
});

describe('Séances de jambes : mollets et adducteurs', () => {
  const byId = new Map(FICHES.map((f) => [f.id, f]));
  const covers = (ex: readonly { ficheId: string }[], zones: string[]) => ex.some((e) => { const f = byId.get(e.ficheId); return !!f && zones.some((z) => (zoneCoefs(f as unknown as ZoneFiche).get(z as never) ?? 0) >= 0.5); });
  it('profils relevés, 4 et 5 jours : chaque séance LEGS / BAS a mollets ou adducteurs ; toute la semaine couvre les deux', () => {
    let sessions = 0;
    let withCalf = 0;
    let withAdd = 0;
    for (const profile of ['A0', 'D', 'F']) for (const level of ['intermediaire', 'avance'] as const) for (const days of [4, 5]) {
      const r = generateProgram(mk({ profile, level, days, dur: 60, goal: 'muscle', place: profile === 'F' ? 'salle' : 'maison' }));
      expect(r.ok, `${profile} ${level} ${days}`).toBe(true);
      if (!r.ok) continue;
      const all = r.program.sessions.flatMap((s) => s.exercises);
      expect(covers(all, ['mollets_gastrocnemien', 'mollets_soleaire']), `semaine ${profile} ${level} ${days} : mollets`).toBe(true);
      expect(covers(all, ['adducteurs']), `semaine ${profile} ${level} ${days} : adducteurs`).toBe(true);
      for (const s of r.program.sessions.filter((x) => x.type === 'LEGS' || x.type === 'BAS')) {
        sessions++;
        const c = covers(s.exercises, ['mollets_gastrocnemien', 'mollets_soleaire']);
        const a = covers(s.exercises, ['adducteurs']);
        if (c) withCalf++;
        if (a) withAdd++;
        expect(c || a, `${profile} ${level} ${days} ${s.label}`).toBe(true);
      }
    }
    expect(sessions).toBeGreaterThan(0);
    expect(withCalf).toBeGreaterThanOrEqual(Math.ceil(sessions * 0.6)); // mesuré après le lot : voir decisions-prises.md
  }, 280_000);
});
