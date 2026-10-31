// @ts-nocheck : ce test lit les fichiers du dépôt (fs de Node, non typé dans le projet de l'app)
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { buildSvg, ik, solve } from '../../tools/make-illustrations.mjs';
import { EXERCICES } from '../../tools/illustrations-poses.mjs';
import { listFiches } from '../../tools/validate-fiches.mjs';

describe('moteur d\'illustrations', () => {
  it('la cinématique inverse respecte les longueurs des segments', () => {
    const r = ik([0, 100], [30, 20], 55, 52, 'f');
    expect(Math.hypot(r.mid[0] - 0, r.mid[1] - 100)).toBeCloseTo(55, 3);
    expect(Math.hypot(r.end[0] - r.mid[0], r.end[1] - r.mid[1])).toBeCloseTo(52, 3);
  });
  it('plie le genou du côté demandé et ne dépasse jamais la longueur du membre', () => {
    const av = ik([0, 80], [0, 8], 55, 52, 'f');
    const ar = ik([0, 80], [0, 8], 55, 52, 'b');
    expect(av.mid[0]).toBeGreaterThan(0);
    expect(ar.mid[0]).toBeLessThan(0);
    const loin = ik([0, 100], [300, 100], 55, 52, 'f');
    expect(Math.hypot(loin.end[0], loin.end[1] - 100)).toBeLessThanOrEqual(107);
  });
  it('une pose debout met la cheville au sol et la tête au-dessus du bassin', () => {
    const J = solve({ p: [0, 112], t: 90 });
    expect(J.anN[1]).toBeCloseTo(8, 1);
    expect(J.head[1]).toBeGreaterThan(J.hip[1] + 60);
  });
});

describe('illustrations des fiches', () => {
  it('chaque entrée de pose produit un SVG avec deux images (trois pour ytw-sol, dips-banc-triceps et developpe-couche-barre) et un titre', () => {
    for (const ex of EXERCICES) {
      const svg = buildSvg(ex);
      expect(svg.startsWith('<svg')).toBe(true);
      expect(svg).toContain('<title');
      expect(svg).not.toContain('NaN');
      expect((svg.match(/class="bg"/g) ?? []).length).toBe(['ytw-sol', 'dips-banc-triceps', 'developpe-couche-barre', 'squat-petit-saut', 'hip-thrust-chaise'].includes(ex.id) ? 3 : 2);
    }
  });
  it('ids de pose uniques et fichiers SVG générés présents', () => {
    const ids = EXERCICES.map((e: { id: string }) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(existsSync(join('public', 'illustrations', `${id}.svg`)), id).toBe(true);
  });
  it('toute fiche qui cite une illustration a sa pose, et inversement', () => {
    const dir = join('knowledge', 'exercices');
    const citees = new Set<string>();
    for (const n of listFiches(dir)) {
      const m = readFileSync(join(dir, n), 'utf8').match(/- illustration : public\/illustrations\/([a-z0-9-]+)\.svg : affichable : oui/);
      if (m) citees.add(m[1]);
    }
    const poses = new Set(EXERCICES.map((e: { id: string }) => e.id));
    expect([...citees].filter((i) => !poses.has(i))).toEqual([]);
    expect([...poses].filter((i) => !citees.has(i as string))).toEqual([]);
    const fichiers = readdirSync(join('public', 'illustrations')).filter((f) => f.endsWith('.svg')).map((f) => f.replace('.svg', ''));
    expect(fichiers.filter((i) => !poses.has(i))).toEqual([]);
  });
});
