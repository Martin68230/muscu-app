// Une case de sécurité « adapter: variante:<id> » doit viser une variante DE LA MÊME FICHE ; « retirer: remplacant:<id-de-fiche> » vise
// légitimement une autre fiche et n'est pas concernée. Les cas ci-dessous utilisent des fiches FACTICES construites ici
// (indépendantes du contenu réel de knowledge/) ; seul le dernier test lit la bibliothèque réelle.
// @ts-ignore -- types Node absents du tsconfig de l'app ; ce fichier ne tourne que sous Vitest (Node)
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
// @ts-ignore -- module d'outil (JS)
import { listFiches, validateLot } from '../../tools/validate-fiches.mjs';

type Issue = { categorie: string; severite: string; message: string };
const dir = 'knowledge/exercices';
const run = (files: { name: string; text: string }[], exempt: string[] = []) =>
  (validateLot(files, { varianteExemptions: new Set(exempt) }).issues as Issue[]).filter((i) => i.categorie === 'variante-securite');

/** Fiche factice minimale : id, variantes (ids) et case Épaule niveau 2. Seules les erreurs « variante-securite » sont examinées. */
function fiche(id: string, variantes: string[], caseEpaule2: string) {
  const rows = variantes.map((v, i) => `| ${v} | Variante ${v} | ${i + 1} | debutant | poids_du_corps | Installation factice. |`).join('\n');
  const text = `---
id: ${id}
nom: Fiche ${id}
schema: poussee_h
type: force
niveau_min: debutant
muscles_principaux: [pectoraux]
muscles_secondaires: [triceps]
source_brouillon: [M0001]
statut: utilisable
---

## Variantes (installation + matériel, avec échelon de difficulté)

| id variante | nom | echelon | niveau | materiel_tags | installation |
|---|---|---|---|---|---|
${rows}

## Sécurité

| Zone | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| Épaule | garder | ${caseEpaule2} | retirer |
`;
  return { name: `test/${id}.md`, text };
}

// A possède « a-genoux » ; B possède « b-chaise » et vise à tort la variante de A.
const A = fiche('fiche-a', ['a-mur', 'a-genoux'], 'adapter: variante:a-genoux');
const B_FAUTIVE = fiche('fiche-b', ['b-sol', 'b-chaise'], 'adapter: variante:a-genoux');

describe('cases de sécurité « variante: » : variante de la même fiche', () => {
  it('fiche fautive : variante d\'une autre fiche refusée (erreur)', () => {
    const r = run([A, B_FAUTIVE]);
    expect(r.length).toBe(1);
    expect(r.every((i) => i.severite === 'erreur')).toBe(true);
    expect(r[0].message).toMatch(/variante:a-genoux : n'est pas une variante de cette fiche/);
    expect(r[0].message).toMatch(/variante d'une autre fiche/);
  });
  it('id d\'une autre fiche dans « variante: » refusé, avec l\'indication de remplacant', () => {
    const r = run([A, fiche('fiche-b', ['b-sol'], 'adapter: variante:fiche-a')]);
    expect(r.length).toBe(1);
    expect(r[0].severite).toBe('erreur');
    expect(r[0].message).toMatch(/remplacant/);
  });
  it('variante propre à la fiche : accepté', () => {
    expect(run([A, fiche('fiche-b', ['b-sol', 'b-chaise'], 'adapter: variante:b-chaise')])).toEqual([]);
  });
  it('remplacant vers une autre fiche : non concerné', () => {
    expect(run([A, fiche('fiche-b', ['b-sol'], 'retirer: remplacant:fiche-a')])).toEqual([]);
  });
  it('écart connu : avertissement ; exception devenue inutile : erreur', () => {
    const r = run([A, B_FAUTIVE], ['fiche-b>a-genoux']);
    expect(r.length).toBe(1);
    expect(r.every((i) => i.severite === 'avertissement')).toBe(true);
    const stale = run([A, fiche('fiche-b', ['b-sol', 'b-chaise'], 'adapter: variante:b-chaise')], ['fiche-b>a-genoux']);
    expect(stale.some((i) => i.severite === 'erreur' && /n'existe plus/.test(i.message))).toBe(true);
  });
  it('bibliothèque réelle : liste d\'exemptions vide et aucun écart', () => {
    const files = (listFiches(dir) as string[]).map((n) => ({ name: n, text: readFileSync(`${dir}/${n}`, 'utf8') }));
    const exempt: string[] = JSON.parse(readFileSync(`${dir}/VARIANTES-SECURITE-A-CORRIGER.json`, 'utf8')).ecarts;
    expect(exempt).toEqual([]);
    expect(run(files, exempt)).toEqual([]);
  });
});
