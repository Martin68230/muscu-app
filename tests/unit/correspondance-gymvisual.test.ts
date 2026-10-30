// D22 (préparation) : la table de correspondance Hasan <-> nos fiches est un fichier texte versionné. Elle ne sert à rien tant que D22 n'est pas décidé ;
// ces tests évitent seulement qu'elle contienne une incohérence (id inconnu, « validé » sans fiche, muscle ciblé différent...).
// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const DIR = 'knowledge/exercices';
const lignes = readFileSync(`${DIR}/CORRESPONDANCE-GYMVISUAL.tsv`, 'utf8').split('\n').filter(Boolean).map((l: string) => l.split('\t'));
const [entete, ...rows] = lignes;

const idsFiches = new Set<string>();
const idsVariantes = new Set<string>();
const walk = (d: string): void => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = `${d}/${e.name}`;
    if (e.isDirectory()) { if (!/ecartees/.test(p)) walk(p); continue; }
    if (!e.name.endsWith('.md')) continue;
    const t = readFileSync(p, 'utf8');
    const m = /^id:\s*(\S+)/m.exec(t);
    if (m) idsFiches.add(m[1]);
    for (const l of t.split('\n')) { const c = l.split('|').map((x: string) => x.trim()); if (c.length >= 7 && /^[a-z0-9-]+$/.test(c[1]) && /^[0-9]+$/.test(c[3])) idsVariantes.add(c[1]); }
  }
};
walk(DIR);

describe('table de correspondance Gym visual (texte seulement)', () => {
  const col = (nom: string) => entete.indexOf(nom);
  it("l'en-tête est celle du script", () => {
    expect(entete).toEqual(['hasan_id', 'media_id', 'gif', 'notre_id', 'notre_variante', 'confiance', 'statut', 'note', 'revue', 'nom_hasan', 'commit_hasan']);
  });
  it('une seule ligne par exercice Hasan, commit indiqué, nom de GIF présent', () => {
    expect(new Set(rows.map((r: string[]) => r[col('hasan_id')])).size).toBe(rows.length);
    for (const r of rows) {
      expect(r[col('commit_hasan')]).toMatch(/^[0-9a-f]{40}$/);
      expect(r[col('gif')]).toMatch(/^[0-9]{4}-[A-Za-z0-9]+\.gif$/);
    }
  });
  it('statuts permis ; « sans équivalent » sans fiche ; les autres pointent une fiche (et une variante) qui existent', () => {
    for (const r of rows) {
      const statut = r[col('statut')];
      expect(['validé', 'à relire', 'sans équivalent']).toContain(statut);
      if (statut === 'sans équivalent') { expect(r[col('notre_id')]).toBe(''); continue; }
      expect(idsFiches.has(r[col('notre_id')])).toBe(true);
      if (r[col('notre_variante')]) expect(idsVariantes.has(r[col('notre_variante')])).toBe(true);
    }
  });
  it('un muscle ciblé différent ou un schéma différent n\'est jamais « validé »', () => {
    for (const r of rows) if (r[col('statut')] === 'validé') expect(r[col('note')]).not.toMatch(/muscle ciblé différent|schéma différent/);
  });
});
