// F0 : JSON des fiches pour l'app. Exclu de tsc (types Node absents du projet), exécuté par Vitest.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { buildAll, buildFiche, structCase, USABLE_STATUTS } from '../../tools/build-fiches.mjs';
import { listFiches, parseFrontmatter } from '../../tools/validate-fiches.mjs';

const root = resolve(__dirname, '..', '..');
const knowledge = join(root, 'knowledge', 'exercices');
const publicDir = join(root, 'public');
const json = join(publicDir, 'data', 'fiches.json');

interface Out { id: string; statut: string; images: { type: string; src: string }[]; [k: string]: any }
let fiches: Out[] = [];

beforeAll(() => {
  execFileSync(process.execPath, [join(root, 'tools', 'build-fiches.mjs')], { cwd: root });
  fiches = JSON.parse(readFileSync(json, 'utf8')).fiches;
});

const sample = readFileSync(join(knowledge, 'pilote', 'bird-dog.md'), 'utf8');
function lot(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), 'fiches-'));
  mkdirSync(join(dir, 'x'));
  for (const [n, t] of Object.entries(files)) writeFileSync(join(dir, 'x', n), t);
  return dir;
}

describe('F0 : fiches.json', () => {
  it('contient exactement les fiches utilisable et verifie, aucune autre', () => {
    const expected = listFiches(knowledge)
      .map((n: string) => parseFrontmatter(readFileSync(join(knowledge, n), 'utf8').replace(/\r\n/g, '\n').split('\n')).data)
      .filter((d: Record<string, string | string[]>) => USABLE_STATUTS.includes(d.statut as string))
      .map((d: Record<string, string | string[]>) => d.id as string)
      .sort();
    expect(fiches.map((f) => f.id).sort()).toEqual(expected);
    expect(fiches.length).toBeGreaterThan(100);
    expect(fiches.every((f) => f.statut === 'utilisable' || f.statut === 'verifie')).toBe(true);
  });

  it("une fiche complete_kine ou brouillon_coach n'apparaît jamais", () => {
    const dir = lot({
      'a.md': sample.replace(/^statut: .*$/m, 'statut: complete_kine').replace('id: bird-dog', 'id: a'),
      'b.md': sample.replace(/^statut: .*$/m, 'statut: brouillon_coach').replace('id: bird-dog', 'id: b'),
      'c.md': sample.replace(/^statut: .*$/m, 'statut: controle_relecteur').replace('id: bird-dog', 'id: c'),
      'd.md': sample.replace('id: bird-dog', 'id: d'),
    });
    const { fiches: out } = buildAll(dir, publicDir);
    expect(out.map((f: Out) => f.id)).toEqual(['d']);
  });

  it("n'inclut que les images marquées « affichable : oui »", () => {
    const withBad = sample.replace(
      '- aucune photo',
      '- `Bird_Dog/0.jpg` : affichable : non (licence)\n- `Bird_Dog/1.jpg` : affichable : à vérifier (cadrage)\n- `Air_Bike/0.jpg` : affichable : oui',
    );
    const { fiche, missing } = buildFiche(withBad, 'x.md', { publicDir });
    expect(fiche.images.map((i: { src: string }) => i.src)).toEqual(['photos/free-exercise-db/Air_Bike-0.webp', 'illustrations/bird-dog.svg']);
    expect(missing).toEqual([]);
    expect(JSON.stringify(fiche)).not.toContain('Bird_Dog');
  });

  it("chaque image citée existe dans public/ et vient d'une ligne « oui »", () => {
    const texts = listFiches(knowledge).map((n: string) => readFileSync(join(knowledge, n), 'utf8'));
    for (const f of fiches) {
      expect(f.images.length, f.id).toBeGreaterThan(0);
      const t = texts.find((x: string) => new RegExp(`^id: ${f.id}\\s*$`, 'm').test(x))!;
      for (const img of f.images) {
        expect(existsSync(join(publicDir, img.src)), `${f.id} : ${img.src}`).toBe(true);
        expect(img.src).toMatch(/^(photos\/free-exercise-db\/[A-Za-z0-9_-]+-\d+\.webp|illustrations\/[a-z0-9-]+\.svg)$/);
        const key = img.type === 'illustration' ? 'public/' + img.src : img.src.replace('photos/free-exercise-db/', '').replace(/-(\d+)\.webp$/, '/$1.jpg');
        const line = t.split('\n').find((l: string) => l.includes(key));
        expect(line, `${f.id} : ${key}`).toMatch(/affichable\s*:\s*oui/);
      }
    }
  });

  it('structure attendue pour chaque fiche', () => {
    const ids = new Set<string>();
    for (const f of fiches) {
      expect(ids.has(f.id)).toBe(false);
      ids.add(f.id);
      expect(f.nom).toBeTruthy();
      expect(['debutant', 'intermediaire', 'avance']).toContain(f.niveauMin);
      expect(f.musclesPrincipaux.length).toBeGreaterThan(0);
      expect(f.variantes.length).toBeGreaterThan(0);
      expect(f.variantes[0].echelon).toBe(1);
      for (const v of f.variantes) {
        expect(v.id && v.nom && v.installation).toBeTruthy();
        expect(v.tags.length).toBeGreaterThan(0);
      }
      expect(f.consignes.length).toBeGreaterThanOrEqual(4);
      expect(f.consignes.length).toBeLessThanOrEqual(6);
      expect(f.pointsAttention.length).toBeGreaterThan(0);
      expect(f.securite.signesArret.length, f.id).toBeGreaterThan(0);
      expect(['garder', 'adapter', 'retirer']).toContain(f.securite.grossesse.action);
      for (const [zone, cases] of Object.entries(f.securite.zones as Record<string, { action: string }[]>)) {
        expect(['cou', 'epaule', 'coude', 'poignet', 'dos', 'hanche', 'genou', 'cheville', 'cuisse', 'aine']).toContain(zone);
        expect(cases).toHaveLength(3);
        expect(cases[2].action, `${f.id}/${zone} niveau 3`).toBe('retirer');
      }
      expect(Array.isArray(f.douxPour)).toBe(true);
    }
  });

  it('transmet doux_pour, la ligne grossesse et la version plus douce', () => {
    expect(fiches.filter((f) => f.douxPour.includes('cou')).length).toBeGreaterThan(0);
    const bd = fiches.find((f) => f.id === 'bird-dog')!;
    expect(bd.securite.grossesse).toEqual({ action: 'adapter', amplitude: 'maintien-court' });
    expect(bd.securite.versionPlusDouce).toBe('dead-bug');
    expect(bd.securite.zones.poignet[0]).toEqual({ action: 'adapter', appui: 'poings-fermes' });
    expect(bd.securite.zones.poignet[2]).toEqual({ action: 'retirer', remplacant: 'dead-bug' });
  });

  it('structCase couvre toutes les formes de case', () => {
    expect(structCase('garder')).toEqual({ action: 'garder' });
    expect(structCase('retirer')).toEqual({ action: 'retirer' });
    expect(structCase('retirer: sans-zone:x-y')).toEqual({ action: 'retirer', sansZone: 'x-y' });
    expect(structCase('adapter: variante:v-1')).toEqual({ action: 'adapter', variante: 'v-1' });
    expect(structCase('adapter: charge:legere')).toEqual({ action: 'adapter', charge: 'legere' });
    expect(structCase('adapter: sans-charge')).toEqual({ action: 'adapter', sansCharge: true });
    expect(structCase('adapter: amplitude:reduite')).toEqual({ action: 'adapter', amplitude: 'reduite' });
    expect(() => structCase('adapter: n-importe-quoi')).toThrow();
  });
});
