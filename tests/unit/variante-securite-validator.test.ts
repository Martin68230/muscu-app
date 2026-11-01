// Une case de sécurité « adapter: variante:<id> » doit viser une variante DE LA MÊME FICHE ; « retirer: remplacant:<id-de-fiche> » vise
// légitimement une autre fiche et n'est pas concernée.
// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
// @ts-ignore -- module d'outil (JS)
import { listFiches, validateLot } from '../../tools/validate-fiches.mjs';

type Issue = { categorie: string; severite: string; message: string };
const dir = 'knowledge/exercices';
const read = (rel: string) => ({ name: rel, text: readFileSync(`${dir}/${rel}`, 'utf8') });
const run = (files: { name: string; text: string }[], exempt: string[] = []) =>
  (validateLot(files, { varianteExemptions: new Set(exempt) }).issues as Issue[]).filter((i) => i.categorie === 'variante-securite');

// Fiche factice fautive : copie de la pompe diamant dont la case Épaule vise « pompe-genoux », variante de la fiche « pompe » (cas réel).
const pompe = read('pilote/pompe.md');
const diamant = read('pilote/pompe-diamant.md');
const faultyDiamant = { name: 'pilote/pompe-diamant.md', text: diamant.text };

describe('cases de sécurité « variante: » : variante de la même fiche', () => {
  it('fiche fautive : variante d\'une autre fiche refusée (erreur)', () => {
    const r = run([pompe, faultyDiamant]);
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((i) => i.severite === 'erreur')).toBe(true);
    expect(r[0].message).toMatch(/variante:pompe-genoux : n'est pas une variante de cette fiche/);
  });
  it('fiche factice : id d\'une autre fiche dans « variante: » refusé, avec l\'indication de remplacant', () => {
    const text = diamant.text.replace(/variante:pompe-genoux/g, 'variante:pompe');
    const r = run([pompe, { name: 'pilote/pompe-diamant.md', text }]);
    expect(r.length).toBeGreaterThan(0);
    expect(r[0].message).toMatch(/remplacant/);
  });
  it('variante propre à la fiche : accepté', () => {
    const id = pompe.text.split('## Variantes')[1].match(/^\|\s*([a-z0-9-]+)\s*\|/m)?.[1] ?? '';
    expect(id).not.toBe('');
    const text = pompe.text.replace(/variante:[a-z0-9-]+/g, `variante:${id}`);
    expect(run([{ name: 'pilote/pompe.md', text }])).toEqual([]);
  });
  it('écart connu : avertissement ; exception devenue inutile : erreur', () => {
    const r = run([pompe, faultyDiamant], ['pompe-diamant>pompe-genoux']);
    expect(r.every((i) => i.severite === 'avertissement')).toBe(true);
    const stale = run([pompe, diamant], ['pompe>pompe-genoux']);
    expect(stale.some((i) => i.severite === 'erreur' && /n'existe plus/.test(i.message))).toBe(true);
  });
  it('bibliothèque réelle : aucun NOUVEL écart, la liste connue ne peut que diminuer', () => {
    const files = (listFiches(dir) as string[]).map((n) => ({ name: n, text: readFileSync(`${dir}/${n}`, 'utf8') }));
    const exempt: string[] = JSON.parse(readFileSync(`${dir}/VARIANTES-SECURITE-A-CORRIGER.json`, 'utf8')).ecarts;
    expect(run(files, exempt).filter((i) => i.severite === 'erreur')).toEqual([]);
    expect(exempt.length).toBeLessThanOrEqual(26);
  });
});
